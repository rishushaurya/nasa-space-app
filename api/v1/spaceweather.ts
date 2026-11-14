// Homeward | api/v1/spaceweather.ts | v3.0.0 | 2026-11-13
// GET: coronal mass ejections predicted to reach Mars, from NASA's DONKI (CCMC WSA-ENLIL model runs), last 30 days.
// Through our relay so the NASA key stays server-side and the page's connect-src stays 'self' (PLAN-3 D23).
import { z } from "zod";
import { ipHash, json, log, rateLimit, requestId } from "../_lib/http.js";

const Sim = z.object({
  simulationID: z.string(), modelCompletionTime: z.string().nullable().optional(), link: z.string().nullable().optional(),
  cmeInputs: z.array(z.object({ cmeStartTime: z.string().nullable().optional(), speed: z.number().nullable().optional() }).passthrough()).nullable().optional(),
  impactList: z.array(z.object({ location: z.string().nullable().optional(), arrivalTime: z.string().nullable().optional(), isGlancingBlow: z.boolean().nullable().optional() }).passthrough()).nullable().optional(),
}).passthrough();
export type Arrival = { arrivalUtc: string; glancing: boolean; cmeStartUtc: string | null; speedKmS: number | null; modelRunUtc: string | null; link: string | null; simulation: string };

/** Every predicted arrival at Mars, newest model run per CME first, one row per CME. Bad records are skipped. */
export function marsArrivals(body: unknown): Arrival[] {
  const rows = Array.isArray(body) ? body : [];
  const byCme = new Map<string, Arrival>();
  for (const raw of rows) {
    const p = Sim.safeParse(raw);
    if (!p.success) continue;
    const s = p.data, cme = s.cmeInputs?.[0];
    for (const hit of s.impactList ?? []) {
      if (hit.location !== "Mars" || !hit.arrivalTime) continue;
      const a: Arrival = { arrivalUtc: hit.arrivalTime, glancing: !!hit.isGlancingBlow, cmeStartUtc: cme?.cmeStartTime ?? null, speedKmS: cme?.speed ?? null,
        modelRunUtc: s.modelCompletionTime ?? null, link: s.link?.startsWith("https://") ? s.link : null, simulation: s.simulationID };
      const key = a.cmeStartUtc ?? a.simulation, old = byCme.get(key);
      if (!old || (a.modelRunUtc ?? "") > (old.modelRunUtc ?? "")) byCme.set(key, a);
    }
  }
  return [...byCme.values()].sort((a, b) => b.arrivalUtc.localeCompare(a.arrivalUtc));
}

const TTL_MS = 30 * 60000;
let cache: { at: number; body: object } | null = null;
export const resetSpaceWeatherCache = () => { cache = null; };

export async function handle(req: Request, deps: { fetch: typeof fetch; env: Record<string, string | undefined>; now: () => number }): Promise<Response> {
  const rid = requestId(), route = "/api/v1/spaceweather", ip = await ipHash(req);
  const rl = rateLimit(`sw:${ip}`, 30, 10 * 60000, deps.now());
  if (!rl.ok) return json(429, { error: "RATE_LIMITED", retryAfterS: rl.retryAfterS }, rid, { "retry-after": String(rl.retryAfterS) });
  if (cache && deps.now() - cache.at < TTL_MS) return json(200, cache.body, rid, { "cache-control": "public, max-age=900" });
  const end = new Date(deps.now()), start = new Date(deps.now() - 30 * 86400000), day = (d: Date) => d.toISOString().slice(0, 10);
  const key = deps.env.NASA_API_KEY && deps.env.NASA_API_KEY !== "replace-me" ? deps.env.NASA_API_KEY : "DEMO_KEY";
  try {
    const r = await deps.fetch(`https://api.nasa.gov/DONKI/WSAEnlilSimulations?startDate=${day(start)}&endDate=${day(end)}&api_key=${encodeURIComponent(key)}`, { signal: AbortSignal.timeout(15000) });
    if (!r.ok) throw new Error(`DONKI HTTP ${r.status}`);
    const body = { sourceId: "NASA-DONKI", fetchedUtc: end.toISOString(), windowStartUtc: start.toISOString(), arrivals: marsArrivals(await r.json()) };
    cache = { at: deps.now(), body };
    log({ level: "info", requestId: rid, route, status: 200, ipHash: ip, message: "donki", metadata: { arrivals: body.arrivals.length, demoKey: key === "DEMO_KEY" } });
    return json(200, body, rid, { "cache-control": "public, max-age=900" });
  } catch (e) {
    log({ level: "warn", requestId: rid, route, status: 502, ipHash: ip, message: String((e as Error).message) });
    return json(502, { error: "DONKI_UNAVAILABLE", message: "NASA's space weather service did not answer" }, rid);
  }
}

export const GET = (req: Request) => handle(req, { fetch, env: process.env, now: Date.now });
