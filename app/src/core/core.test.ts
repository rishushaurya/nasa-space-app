// Homeward | app/src/core/core.test.ts | v1.0.0 | 2026-10-29
// Golden values: published NASA/ESA/GISS numbers and the computed values in docs/TESTING_STRATEGY.md.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { LANDINGS, localSolar, marsTime, marsYear, nextSunEvent, solNumber, sunPosition } from "./mars-time";
import { earthElongation, directionFromMars, lightTimeMin } from "./ephemeris";
import { bearingDeg, flyStep, FLY_MIN_M, haversineM, horizonM, ocToOg, offsetM, ogToOc } from "./frames";
import { gcrDoseMSv, missionDoseMSv } from "./dose";
import { moonPosition, type Moon, type MoonTable } from "./moons";
import { DEFAULTS, plan, route, timeHomeField, walkSpeedKmh, type Grid } from "./planner";

const U = (...a: [number, number, number, number?, number?, number?]) => Date.UTC(a[0], a[1] - 1, a[2], a[3] ?? 0, a[4] ?? 0, a[5] ?? 0);
const hms = (h: number) => Math.round(h * 3600);

describe("Mars24 (GISS worked examples)", () => {
  it("example 1: 2000-01-06 MST 23:59:39, Ls 277.18758", () => {
    const m = marsTime(U(2000, 1, 6));
    expect(Math.abs(hms(m.mstH) - (23 * 3600 + 59 * 60 + 39))).toBeLessThanOrEqual(1);
    expect(m.lsDeg).toBeCloseTo(277.18758, 3);
  });
  it("example 2 (Spirit): Ls 327.32416, EOT -12.77553, LTST 00:00, azimuth 180", () => {
    const t = U(2004, 1, 3, 13, 46, 31);
    const m = marsTime(t);
    expect(m.lsDeg).toBeCloseTo(327.32416, 3);
    expect(m.eotDeg).toBeCloseTo(-12.77553, 3);
    const lt = localSolar(t, 360 - 184.702).ltstH;
    expect(Math.min(lt, 24 - lt) * 3600).toBeLessThan(2);
    expect(sunPosition(t, -14.64, 360 - 184.702).azimuthDeg).toBeCloseTo(180, 1);
  });
});

describe("Scenario date 14 Nov 2026 (TIME facts)", () => {
  it("MY39 starts on 30 Sep 2026", () => {
    expect(marsYear(U(2026, 9, 29))).toBe(38);
    expect(marsYear(U(2026, 10, 1))).toBe(39);
    expect(marsYear(U(2026, 11, 14))).toBe(39);
  });
  it("Ls 21.57 deg at 00:00 UTC", () => expect(marsTime(U(2026, 11, 14)).lsDeg).toBeCloseTo(21.57, 1));
  it("Gale sunrise 08:17 UTC on 14 Nov, 08:56 UTC on 15 Nov", () => {
    for (const [d, h, mi] of [[14, 8, 17], [15, 8, 56]] as const) {
      const t = nextSunEvent(U(2026, 11, d), -4.5895, 137.4417, "rise");
      expect(Math.abs(t - U(2026, 11, d, h, mi))).toBeLessThan(2 * 60000);
    }
  });
  it("Jezero sunrise 12:08 UTC on 14 Nov", () => {
    const t = nextSunEvent(U(2026, 11, 14), 18.44, 77.45, "rise");
    expect(Math.abs(t - U(2026, 11, 14, 12, 8))).toBeLessThan(2 * 60000);
  });
  it("rover sols in the daylight of 14 Nov: Curiosity 5074, Perseverance 2039", () => {
    expect(solNumber(U(2026, 11, 14, 12), LANDINGS.curiosity.utcMs, LANDINGS.curiosity.lonE)).toBe(5074);
    expect(solNumber(U(2026, 11, 14, 12), LANDINGS.perseverance.utcMs, LANDINGS.perseverance.lonE)).toBe(2039);
  });
  it("Earth is an evening star about 38 deg east of the Sun", () => {
    const e = earthElongation(U(2026, 11, 14));
    expect(e.east).toBe(true);
    expect(e.deg).toBeGreaterThan(36);
    expect(e.deg).toBeLessThan(40);
  });
  it("body-fixed Sun direction agrees with the Mars24 declination", () => {
    const t = U(2026, 11, 14);
    expect(Math.abs(directionFromMars("sun", t).latDeg - marsTime(t).declDeg)).toBeLessThan(0.3);
  });
});

describe("Light time (NASA and ESA landing reconstructions)", () => {
  it("Perseverance landing 11.37 min", () => expect(lightTimeMin(U(2021, 2, 18, 20, 43, 49))).toBeCloseTo(11.37, 1));
  it("Curiosity landing 13.80 min (ESA 13 min 48 s)", () => expect(lightTimeMin(U(2012, 8, 6, 5, 17, 57))).toBeCloseTo(13.8, 1));
  it("14 Nov 2026 00:00 UTC 11.01 min", () => expect(lightTimeMin(U(2026, 11, 14))).toBeCloseTo(11.01, 1));
});

describe("Frames, distances, dose", () => {
  it("SITE-01 ocentric -4.5895 -> ographic -4.6438, round trip", () => {
    expect(ocToOg(-4.5895)).toBeCloseTo(-4.6438, 4);
    expect(ogToOc(ocToOg(-4.5895))).toBeCloseTo(-4.5895, 9);
  });
  it("Bradbury to Yellowknife Bay 443 m; to Dingo Gap 2,993 m; boxwork walk 240 m", () => {
    const b = { lat: -4.589467, lon: 137.441633 };
    expect(haversineM(b, { lat: -4.58948488, lon: 137.4491296 })).toBeCloseTo(443, -1);
    expect(Math.abs(haversineM(b, { lat: -4.62655059, lon: 137.4072626 }) - 2993)).toBeLessThan(5);
    expect(Math.abs(haversineM({ lat: -4.804189, lon: 137.3796858 }, { lat: -4.80799931, lon: 137.3810495 }) - 240)).toBeLessThan(2);
  });
  it("horizon 3.39 km at 1.7 m", () => expect(horizonM(1.7) / 1000).toBeCloseTo(3.39, 2));
  it("bearing and offset agree with haversine: Yellowknife Bay is due east of Bradbury, 443 m", () => {
    const b = { lat: -4.589467, lon: 137.441633 }, y = { lat: -4.58948488, lon: 137.4491296 };
    expect(Math.abs(bearingDeg(b, y) - 90)).toBeLessThan(0.5);
    const o = offsetM(b, bearingDeg(b, y), haversineM(b, y));
    expect(haversineM(o, y)).toBeLessThan(0.5);
  });
  it("8 h walk 0.213 mSv; 180+500+180 d mission 982 mSv", () => {
    expect(gcrDoseMSv(8)).toBeCloseTo(0.213, 3);
    expect(missionDoseMSv(180, 500, 180)).toBeCloseTo(982.4, 1);
  });
  it("Tobler scaled: 3.30 km/h flat, 3.93 km/h at -5%", () => {
    expect(walkSpeedKmh(0, 1)).toBeCloseTo(3.3, 2);
    expect(walkSpeedKmh(-0.05, 1)).toBeCloseTo(3.93, 2);
  });
});

function flatGrid(n: number, cellM = 2): Grid {
  const len = n * n, d = cellM / 3396190 * 180 / Math.PI;
  return { cols: n, rows: n, cellM, westLonE: 137.4, northLatC: -4.5, dLonDeg: d, dLatDeg: d,
    slopeDeg: new Float32Array(len), reliefM: new Float32Array(len), elevM: new Float32Array(len) };
}

describe("Planner", () => {
  it("walk-back field on a flat grid equals distance / 3.3 km/h", () => {
    const g = flatGrid(5), f = timeHomeField(g, 12, DEFAULTS);
    expect(f[0]).toBeCloseTo(((2 * 2 * Math.SQRT2) / 1000 / 3.3) * 60, 4);
  });
  it("routes around a steep wall, and through it when the limit allows", () => {
    const g = flatGrid(9);
    for (let y = 0; y < 8; y++) g.slopeDeg[y * 9 + 4] = 25;
    const p = route(g, 4 * 9 + 0, 4 * 9 + 8, DEFAULTS)!;
    expect(p.some((i) => i === 8 * 9 + 4)).toBe(true);
    expect(route(g, 36, 44, { ...DEFAULTS, slopeMaxDeg: 30 })!.length).toBe(9);
  });
  it("obstacle relief blocks like slope", () => {
    const g = flatGrid(5);
    for (let y = 0; y < 5; y++) g.reliefM[y * 5 + 2] = 1.5;
    expect(route(g, 10, 14, DEFAULTS)).toBeNull();
  });
  it("budgets: OK, LIFE_SUPPORT, DAYLIGHT, RADIUS", () => {
    const g = flatGrid(50), home = 25 * 50 + 5, stop = { id: "s", name: "Stop", cell: 25 * 50 + 45, minutes: 60 };
    const f = timeHomeField(g, home, DEFAULTS);
    const base = { home, startUtcMs: 0, sunsetUtcMs: 10 * 3600000, settings: DEFAULTS };
    expect(plan(g, f, { ...base, stops: [stop] }).ok).toBe(true);
    expect(plan(g, f, { ...base, stops: [{ ...stop, minutes: 470 }] }).breaches[0]!.code).toBe("LIFE_SUPPORT");
    expect(plan(g, f, { ...base, sunsetUtcMs: 3600000, stops: [stop] }).breaches.map((b) => b.code)).toContain("DAYLIGHT");
    expect(plan(g, f, { ...base, settings: { ...DEFAULTS, radiusM: 10 }, stops: [stop] }).breaches[0]!.code).toBe("RADIUS");
  });
  it("enclosed stop is UNREACHABLE", () => {
    const g = flatGrid(9), goal = 4 * 9 + 4;
    for (const d of [-10, -9, -8, -1, 1, 8, 9, 10]) g.slopeDeg[goal + d] = 40;
    const f = timeHomeField(g, 0, DEFAULTS);
    const r = plan(g, f, { home: 0, stops: [{ id: "x", name: "X", cell: goal, minutes: 10 }], startUtcMs: 0, sunsetUtcMs: 1e9, settings: DEFAULTS });
    expect(r.breaches[0]!.code).toBe("UNREACHABLE");
  });
});

describe("moons (JPL Horizons vectors, Hermite between hourly rows, rotated to Mars-fixed)", () => {
  const t = JSON.parse(readFileSync("app/public/data/sky/moons.json", "utf8")) as MoonTable;
  const sub = (m: Moon, utc: number) => {
    const p = moonPosition(t, m, utc)!, r = Math.hypot(...p);
    return { lonE: ((Math.atan2(p[1], p[0]) * 180) / Math.PI + 360) % 360, lat: (Math.asin(p[2] / r) * 180) / Math.PI, r };
  };
  // Horizons OBSERVER quantity 14 from each moon's centre, 2026-11-14 00:30 UT (west-positive longitudes converted to east).
  it("sub-Phobos point within 0.3 deg of Horizons (334.148 E, 0.444 N)", () => {
    const s = sub("phobos", Date.UTC(2026, 10, 14, 0, 30));
    expect(Math.abs(s.lonE - 334.148)).toBeLessThan(0.3);
    expect(Math.abs(s.lat - 0.444)).toBeLessThan(0.3);
    expect(s.r).toBeGreaterThan(9200); expect(s.r).toBeLessThan(9550);
  });
  it("sub-Deimos point within 0.3 deg of Horizons (158.284 E, 0.427 S)", () => {
    const s = sub("deimos", Date.UTC(2026, 10, 14, 0, 30));
    expect(Math.abs(s.lonE - 158.284)).toBeLessThan(0.3);
    expect(Math.abs(s.lat + 0.427)).toBeLessThan(0.3);
  });
  it("is null outside the table", () => { expect(moonPosition(t, "phobos", Date.UTC(2030, 0, 1))).toBeNull(); });
});

describe("Fly mode (flyStep)", () => {
  const gale = { lat: -4.5895, lon: 137.4417 };
  it("moves forward at the chosen speed and keeps its height", () => {
    const r = flyStep(gale, 100, 90, 1, 0, 250, 2);
    expect(haversineM(gale, r.p)).toBeCloseTo(500, -1);
    expect(r.heightM).toBe(100);
  });
  it("climbs at half speed and never goes below the ground floor", () => {
    expect(flyStep(gale, 100, 0, 0, 1, 100, 1).heightM).toBe(150);
    expect(flyStep(gale, 10, 0, 0, -1, 1000, 1).heightM).toBe(FLY_MIN_M);
  });
  it("wraps longitude across 180 degrees and stops short of the poles", () => {
    const r = flyStep({ lat: 0, lon: 179.99 }, 100, 90, 1, 0, 1000, 1);
    expect(r.p.lon).toBeLessThan(-179.9);
    expect(flyStep({ lat: 88.99, lon: 0 }, 100, 0, 1, 0, 100000, 1).p.lat).toBe(89);
  });
});
