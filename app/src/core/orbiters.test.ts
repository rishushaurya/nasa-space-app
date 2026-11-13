// Homeward | app/src/core/orbiters.test.ts | v3.0.0 | 2026-11-13
// Golden checks on the real JPL Horizons table (data/sky/orbiters.json, fetched 13 Nov 2026 by pipeline/make_orbiters.py).
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { orbiterPosition, type OrbiterTable } from "./moons";

const t = JSON.parse(readFileSync(new URL("../../public/data/sky/orbiters.json", import.meta.url), "utf8")) as OrbiterTable;
const at = (id: string) => t.orbiters.find((o) => o.id === id)!;
const radiusKm = (id: string, utc: string) => Math.hypot(...orbiterPosition(t, at(id), Date.parse(utc))!);

describe("Mars orbiters (JPL Horizons)", () => {
  it("keeps MRO in its low orbit, 250-320 km above the 3,396 km equatorial radius, over a full sol", () => {
    for (let m = 0; m < 24.6 * 60; m += 7) {
      const alt = radiusKm("mro", new Date(Date.parse("2026-11-14T00:00:00Z") + m * 60000).toISOString()) - 3396.19;
      expect(alt).toBeGreaterThan(200); expect(alt).toBeLessThan(340); // tolerance covers the polar flattening
    }
  });
  it("puts Hope far out (its orbit spans about 20,000 to 43,000 km altitude)", () => {
    const r = radiusKm("hope", "2026-11-14T00:00:00Z");
    expect(r).toBeGreaterThan(3396 + 19000); expect(r).toBeLessThan(3396 + 44000);
  });
  it("matches a Horizons row exactly at a table time (radius is frame-independent)", () => {
    const row = at("mro").rows[0]!;
    expect(radiusKm("mro", t.startUtc)).toBeCloseTo(Math.hypot(row[0]!, row[1]!, row[2]!), 6);
  });
  it("shows nothing past an orbiter's published ephemeris end", () => {
    expect(orbiterPosition(t, at("mro"), Date.parse(at("mro").endUtc) + 3600000)).toBeNull();
  });
});
