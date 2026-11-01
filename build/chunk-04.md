# Chunk 04: Core logic

> Version 1.0.0 | 2026-10-29 | Goal: tested pure functions for Mars time, ephemeris, frames, dose and the planner. Tickets T02, T03, T04, T08. Write the tests in `docs/TESTING_STRATEGY.md` section 2-3 first.

| Field | Value |
|---|---|
| Estimated time | 6 h |
| Depends on | 01; 03 for the real-grid planner tests |
| Unlocks | 05, 07 |
| Owner | Planner engineer |

## Files and interfaces

```ts
// app/src/core/mars-time.ts   (GISS Mars24 steps A-1..D-6; TT-UTC 69.184 s after 2017, table before)
export type MarsTime = { jdTT: number; msd: number; mstH: number; lsDeg: number; eotDeg: number; declDeg: number; sunDistAu: number; subsolarLonWDeg: number };
export function marsTime(utcMs: number): MarsTime;
export function localSolar(utcMs: number, lonEDeg: number): { lmstH: number; ltstH: number };
export function sunPosition(utcMs: number, latCDeg: number, lonEDeg: number): { elevationDeg: number; azimuthDeg: number };
export function nextSunEvent(utcMs: number, latCDeg: number, lonEDeg: number, kind: "rise" | "set"): number; // utcMs, Sun centre at 0 deg
export function solNumber(utcMs: number, landingUtcMs: number, lonEDeg: number): number; // sol 0 = landing sol
export function marsYear(utcMs: number): number; // MY 1 began 11 Apr 1955 (Clancy et al.)
```

```ts
// app/src/core/ephemeris.ts   (JPL approximate elements, Table 1, 1800-2050; EM barycentre and Mars)
export function helioEcliptic(body: "em" | "mars", utcMs: number): [number, number, number]; // au, J2000 ecliptic
export function earthMarsDistanceAu(utcMs: number): number;
export function lightTimeMin(utcMs: number): number; // one-way, au * 149597870.7 km / 299792.458 km/s
export function earthDirectionFromMars(utcMs: number): { elongationDeg: number }; // re-check TIME-09
```

```ts
// app/src/core/frames.ts
export const MARS_A_M = 3396190; export const MARS_B_M = 3376200; // IAU 2015
export function ocentricToOgraphicLat(latCDeg: number): number;   // atan(tan(latC) * (a/b)^2)
export function ographicToOcentricLat(latGDeg: number): number;
export function westToEast(lonWDeg: number): number;              // 360 - lonW, wrapped to 0-360
export function toCesium(latCDeg: number, lonEDeg: number, heightM?: number): { lonDeg: number; latDeg: number; heightM: number };
export function haversineM(a: LatLon, b: LatLon, radiusM?: number): number; // default 3396190
```

```ts
// app/src/core/dose.ts
export function gcrDoseMSv(hours: number, rateMSvPerDay?: number): number; // default RAD-01 0.64
```

```ts
// app/src/core/planner.ts   (pure; the worker wraps it)
export type Settings = { slopeMaxDeg: number; reliefMaxM: number; reserveMin: number; daylightMarginMin: number; speedFactor: number; radiusM: number; lifeSupportH: number };
export const DEFAULTS: Settings = { slopeMaxDeg: 20, reliefMaxM: 1.0, reserveMin: 30, daylightMarginMin: 30, speedFactor: 1, radiusM: 2000, lifeSupportH: 8 };
// reliefMaxM is an ASSUMPTION: cells whose 1 m DTM relief (grid layer reliefM) exceeds it are obstacles (large rocks, ridges)
export function walkSpeedKmh(rise: number, run: number, factor: number): number; // Tobler scaled to 3.3 on flat
export function timeHomeField(grid: Grid, home: Cell, s: Settings): Float32Array;   // Dijkstra on reversed edges, minutes
export function route(grid: Grid, from: Cell, to: Cell, s: Settings): Cell[] | null; // A*, heuristic dist / 3.93 km/h
export function plan(input: PlanInput, grid: Grid, field: Float32Array): PlanResult;
export type Breach = { code: "LIFE_SUPPORT" | "WALK_BACK" | "DAYLIGHT" | "SLOPE" | "RADIUS" | "UNREACHABLE" | "OUTSIDE_GRID"; atMin?: number; stopId?: string; message: string; factIds: string[] };
```

```ts
// app/src/core/planner.worker.ts
// onmessage: zod-validate { type: "init", gridUrl } | { type: "plan", input }; cache grid and field;
// recompute the field only when slopeMaxDeg or speedFactor change; post { type: "result", result, timings }.
```

## Budget rules (all evaluated along the timeline in 1-minute steps)

| Budget | Rule | Facts |
|---|---|---|
| Life support | elapsed <= lifeSupportH x 60 - reserveMin | EVA-01; reserve ASSUMPTION |
| Walk-back | at every step: (lifeSupportH x 60 - reserveMin - elapsed) >= timeHome(cell) | EVA-04; field from Dijkstra |
| Daylight | return time <= sunset - daylightMarginMin (sunset from `nextSunEvent`) | Mars24; margin ASSUMPTION |
| Slope | no path cell over slopeMaxDeg (enforced by search) | EVA-03 |
| Obstacles | no path cell with `reliefM` over reliefMaxM (enforced by search); the panel states that rocks under about 1 m are not visible from orbit | official objective; ASSUMPTION threshold |
| Radius | every stop within radiusM of home (checked first) | EVA-02 |
| Dose | report GCR dose for the plan (never a breach on its own); solar-storm scenario adds a shelter rule in chunk 08 | RAD-01 |

Clock units: the timeline runs in Earth minutes. LTST hours are Mars hours (1 sol = 24.6597 Earth hours, PLN-07), so a span of LTST hours is multiplied by 1.027491 to get Earth hours. Sunrise and sunset come from `nextSunEvent` in UTC, so no conversion is needed when comparing against them.

Breach messages name the fact and the number, for example "Life support: plan needs 7 h 52 min, limit is 7 h 30 min after the 30 min reserve (EVA-01)".

## Validation

Settings ranges: slopeMaxDeg 10-30, reliefMaxM 0.5-2.0, reserveMin 0-120, daylightMarginMin 0-120, speedFactor 0.5-1.5, radiusM 500-10000 (10 km is the NASA walk-back test distance, EVA-05), lifeSupportH 4-8.

## Verification

```
npm test -- core
```
All golden tests in `docs/TESTING_STRATEGY.md` sections 2 and 3 pass. Log the planner timings on the weakest laptop in the changelog.

## Rollback

`git revert` the chunk; the UI chunks depend on these interfaces, so revert them together.

## Outcome (29 Oct 2026)

Built `mars-time.ts`, `ephemeris.ts`, `frames.ts`, `dose.ts`, `planner.ts`, `planner.worker.ts`, `use-planner.ts`, and later `moons.ts`. The Mars pole is IAU 2009: the 2015 form without its periodic terms put the Sun 1.34 deg off. The planner first took 1,861 ms for the walk-back field; a typed-array heap, a passability mask and Float64 internal times brought it to 121 ms and fixed nodes being skipped.

Verification: 25 golden tests in `core.test.ts`; on the real grid Curiosity's sol 3-166 path is 100% walkable under our rules (903 samples), field 121 ms, route 10 ms.

Full record: `BUILD_LOG.md`.
