// Homeward | app/src/core/los.test.ts | v3.0.0 | 2026-11-13
import { describe, expect, it } from "vitest";
import { lineOfSight } from "./los";
import { horizonM, MARS_SPHERE_M } from "./frames";
import type { Grid } from "./planner";

// A flat strip along the equator: 10 m cells, 1,000 cells (10 km), one row.
const CELL = 10, COLS = 1000, dLon = (CELL / MARS_SPHERE_M) * (180 / Math.PI);
const flat = (): Grid => ({ cols: COLS, rows: 1, cellM: CELL, westLonE: 0, northLatC: dLon / 2, dLonDeg: dLon, dLatDeg: dLon,
  slopeDeg: new Float32Array(COLS), reliefM: new Float32Array(COLS), elevM: new Float32Array(COLS) });
const at = (m: number) => ({ lat: 0, lon: (m / MARS_SPHERE_M) * (180 / Math.PI) });

describe("radio line of sight", () => {
  it("is clear over flat ground at walking range", () => {
    const s = lineOfSight(flat(), at(5), at(2005), 1.7, 3);
    expect(s.clear).toBe(true);
    expect(s.distanceM).toBeCloseTo(2000, 0);
  });
  it("is blocked by a 5 m ridge halfway", () => {
    const g = flat();
    for (let c = 98; c <= 102; c++) g.elevM[c] = 5;
    const s = lineOfSight(g, at(5), at(2005), 1.7, 3);
    expect(s.clear).toBe(false);
    expect(s.blockedAt!.lon).toBeCloseTo(at(1000).lon, 3);
  });
  it("golden: two 1.7 m antennas see each other up to twice the horizon distance on a smooth sphere", () => {
    const h = horizonM(1.7, MARS_SPHERE_M); // 3,398 m, the PLN-12 horizon at eye height (3.39 km on the 3,389.5 km mean sphere)
    expect(h).toBeCloseTo(3398, 0);
    expect(lineOfSight(flat(), at(5), at(5 + 2 * h - 150), 1.7, 1.7).clear).toBe(true);
    expect(lineOfSight(flat(), at(5), at(5 + 2 * h + 150), 1.7, 1.7).clear).toBe(false);
  });
});
