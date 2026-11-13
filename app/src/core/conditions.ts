// Homeward | app/src/core/conditions.ts | v3.0.0 | 2026-11-13
// Current conditions that are real: the newest sol Curiosity's REMS station has released (MEASURED, with its date; Mars
// weather cannot be live, WX-04) and coronal mass ejections predicted to reach Mars (DONKI, via our relay).
import { z } from "zod";

export type RemsSol = { sol: number; earthDate: string; ls: number | null; season: string | null; minC: number | null; maxC: number | null; groundMinC: number | null; groundMaxC: number | null;
  pressurePa: number | null; uv: string | null; sky: string | null; sunrise: string | null; sunset: string | null };
export type Arrival = { arrivalUtc: string; glancing: boolean; cmeStartUtc: string | null; speedKmS: number | null; modelRunUtc: string | null; link: string | null };

const num = (v: unknown) => { const n = typeof v === "number" ? v : Number(String(v ?? "").trim()); return v === null || v === "" || v === "--" || !Number.isFinite(n) ? null : n; };
const str = (v: unknown) => (typeof v === "string" && v.trim() && v.trim() !== "--" ? v.trim() : null);

/** The newest sol in NASA's MSL weather feed that has an air temperature (rows are newest first, but sorted anyway). */
export function latestRems(json: unknown): RemsSol | null {
  const rows = (json as { soles?: unknown })?.soles;
  if (!Array.isArray(rows)) return null;
  const parsed = rows.flatMap((r: Record<string, unknown>): RemsSol[] => {
    const sol = num(r?.sol), date = str(r?.terrestrial_date);
    if (sol === null || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return [];
    return [{ sol, earthDate: date, ls: num(r.ls), season: str(r.season), minC: num(r.min_temp), maxC: num(r.max_temp), groundMinC: num(r.min_gts_temp), groundMaxC: num(r.max_gts_temp),
      pressurePa: num(r.pressure), uv: str(r.local_uv_irradiance_index), sky: str(r.atmo_opacity), sunrise: str(r.sunrise), sunset: str(r.sunset) }];
  }).filter((r) => r.minC !== null && r.maxC !== null);
  return parsed.sort((a, b) => b.sol - a.sol)[0] ?? null;
}

export async function loadRems(signal?: AbortSignal): Promise<RemsSol> {
  const r = await fetch("https://mars.nasa.gov/rss/api/?feed=weather&category=msl&feedtype=json", { signal, credentials: "omit" });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  const s = latestRems(await r.json());
  if (!s) throw new Error("no sol with temperatures");
  return s;
}

const SpaceWeather = z.object({ fetchedUtc: z.string(), windowStartUtc: z.string(), arrivals: z.array(z.object({ arrivalUtc: z.string(), glancing: z.boolean(), cmeStartUtc: z.string().nullable(),
  speedKmS: z.number().nullable(), modelRunUtc: z.string().nullable(), link: z.string().nullable() }).passthrough()) });
export type SpaceWeather = z.infer<typeof SpaceWeather>;

export async function loadSpaceWeather(signal?: AbortSignal): Promise<SpaceWeather> {
  const r = await fetch("/api/v1/spaceweather", { signal });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return SpaceWeather.parse(await r.json());
}

/** DONKI time strings ("2026-11-13T12:00Z") as milliseconds. */
export const donkiMs = (s: string) => Date.parse(s.length === 17 ? s.replace("Z", ":00Z") : s);
