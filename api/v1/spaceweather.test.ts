// Homeward | api/v1/spaceweather.test.ts | v3.0.0 | 2026-11-13
import { beforeEach, describe, expect, it } from "vitest";
import { resetRateLimits } from "../_lib/http";
import { handle, marsArrivals, resetSpaceWeatherCache } from "./spaceweather";

// Shapes from a real DONKI WSAEnlilSimulations response (13 Nov 2026), trimmed.
const SIMS = [
  { simulationID: "WSA-ENLIL/49473/1", modelCompletionTime: "2026-11-09T19:59Z", link: "https://ccmc.gsfc.nasa.gov/DONKI/view/WSA-ENLIL/49473/-1",
    cmeInputs: [{ cmeStartTime: "2026-11-08T12:36Z", speed: 612 }],
    impactList: [{ location: "Mars", arrivalTime: "2026-11-13T12:00Z", isGlancingBlow: true }, { location: "Psyche", arrivalTime: "2026-11-14T06:00Z", isGlancingBlow: true }] },
  { simulationID: "WSA-ENLIL/49460/1", modelCompletionTime: "2026-11-09T02:00Z", cmeInputs: [{ cmeStartTime: "2026-11-08T12:36Z", speed: 580 }],
    impactList: [{ location: "Mars", arrivalTime: "2026-11-13T18:00Z", isGlancingBlow: false }] },
  { simulationID: "WSA-ENLIL/49507/1", modelCompletionTime: "2026-11-12T02:24Z", cmeInputs: [{ cmeStartTime: "2026-11-11T23:24Z", speed: 367 }], impactList: null },
  { junk: true },
];

describe("DONKI arrivals at Mars", () => {
  it("keeps Mars only, the newest model run per CME, newest arrival first", () => {
    const a = marsArrivals(SIMS);
    expect(a).toHaveLength(1);
    expect(a[0]).toMatchObject({ arrivalUtc: "2026-11-13T12:00Z", glancing: true, speedKmS: 612, modelRunUtc: "2026-11-09T19:59Z", link: "https://ccmc.gsfc.nasa.gov/DONKI/view/WSA-ENLIL/49473/-1" });
  });
  it("tolerates a non-array body", () => expect(marsArrivals({ error: 1 })).toEqual([]));
});

describe("GET /api/v1/spaceweather", () => {
  beforeEach(() => { resetSpaceWeatherCache(); resetRateLimits(); });
  const req = () => new Request("http://localhost/api/v1/spaceweather", { headers: { "x-forwarded-for": "1.2.3.4" } });
  it("uses DEMO_KEY without a key, caches the answer and never leaks the key", async () => {
    const urls: string[] = [];
    const fetchFake = (async (u: string) => { urls.push(u); return new Response(JSON.stringify(SIMS)); }) as unknown as typeof fetch;
    const deps = { fetch: fetchFake, env: { NASA_API_KEY: "replace-me" }, now: () => Date.parse("2026-11-13T00:00:00Z") };
    const r1 = await handle(req(), deps), r2 = await handle(req(), deps);
    const body = await r1.json() as { arrivals: unknown[]; sourceId: string };
    expect(r1.status).toBe(200); expect(r2.status).toBe(200);
    expect(body.sourceId).toBe("NASA-DONKI"); expect(body.arrivals).toHaveLength(1);
    expect(urls).toHaveLength(1);
    expect(urls[0]).toContain("startDate=2026-10-14&endDate=2026-11-13&api_key=DEMO_KEY");
  });
  it("answers 502 when DONKI fails", async () => {
    const r = await handle(req(), { fetch: (async () => new Response("", { status: 503 })) as unknown as typeof fetch, env: {}, now: Date.now });
    expect(r.status).toBe(502);
  });
});
