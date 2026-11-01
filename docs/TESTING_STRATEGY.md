# Testing Strategy: Homeward

> Version 2.0.0 | 2026-11-01 | Owner: planner engineer (unit), AI engineer (eval), lead (manual) | Status: implemented (section 0)

The tests exist to prove Validity: our numbers reproduce published agency numbers. Tests are written before the code they check (chunk 04 starts with them).

## 0. As built (1 Nov 2026): 52 tests in 9 files, all passing

| File | Tests | What it proves |
|---|---|---|
| `app/src/core/core.test.ts` | 26 | Mars24 golden examples, MY39, Ls, Gale sunrises, sols, Earth elongation, light times, frame offsets, distances (443 / 2,993 / 240 m), horizon, dose, Tobler speed, planner breaches; Phobos and Deimos sub-points within 0.3 deg of JPL Horizons (measured: 0.031 deg, 5 km for Phobos; 0.047 deg, 19 km for Deimos) |
| `app/src/core/planner-real.test.ts` | 1 | Curiosity's real sol 3-166 path is at least 95% walkable under our rules on the real HiRISE grid (measured 100%, 903 samples); field under 500 ms, route under 300 ms |
| `app/src/assistant/assistant.test.ts` | 2 | `check_extra_time` is limited by the tighter budget; the "extend the stop" question routes to it |
| `app/src/assistant/eval.test.ts` | 2 | The 40-question eval below, on real data and a real Gale plan |
| `app/src/core/camera.test.ts` | 5 | Rover view placement against a real NASA record (Curiosity Navcam, sol 3000, site 85): the ray at the optical centre matches the record's mast azimuth (119.97 deg) and elevation; the attitude turns the rover's forward axis to MMGIS's yaw (28.68 deg, within 0.05); every pixel of the CSS plane lies on its own ray; the projection centres what you look at and hides what is behind |
| `app/src/rovers/raw.test.ts` | 4 | A photo belongs to the latest stop at or before its motion counter (Perseverance's sol 13 case); exact matches preferred; one frame per direction, largest wins, thumbnails and model-less frames dropped; site 0 resolves to the start of the mission (Curiosity from sol 13) |
| `app/src/globe/layers.test.ts` | 2 | Planetocentric tiles on the IAU ellipsoid: Bradbury Landing's tile has geodetic edges equal to the converted planetocentric ones (a 0.054 deg, 3.2 km error without it); poles and equator fixed |
| `app/src/core/places.test.ts` | 2 | Typed coordinates in common forms (S/W, 0-360 E); search ranks exact over prefix, bigger features first, landers by any word |
| `api/v1/assistant.test.ts` | 8 | Relay: unknown origin 403, bad body 400, over 32 KB 413, rate limit 429, Gemini to Groq to OpenRouter fallback then 503, circuit breaker, tool calls passed through, 503 with no keys (the browser then answers offline) |

The eval found two routing bugs on its first run ("daylight" matched the radio-delay intent; "air pressure" matched life support); both are fixed. Not built: a browser end-to-end suite (scenes were checked by hand in the browser, desktop and phone widths; on 1 Nov the walk was driven end to end by scripted key events, and the production build was checked under the production CSP with `npm run preview`) and per-provider evals with live keys.

## 1. What is tested where

| Level | What | Tool |
|---|---|---|
| Unit (golden) | Mars24 time, ephemeris and light time, frames, Tobler speed, dose accrual | vitest |
| Unit | Planner (walk-back field, A*, budgets), URL-state schema, data schemas, assistant tools, Mission Control delay | vitest |
| Integration | Assistant relay (origin, validation, rate limit, provider fallback order, breaker, all-fail 503, with a mocked fetch); data and tile manifests load and validate | vitest |
| Pipeline | Grid and tile determinism (same SHA-256 twice); Python and TypeScript frame formulas agree on shared vectors; facts and sources completeness; terrain height at SITE-01 | Python asserts in each script's `__main__` |
| Assistant | 40-question eval per provider; offline rules on the 15 common intents | `eval/run.mjs --provider` |
| E2E | The demo path: clock, plan Yellowknife Bay, approve, walk, ask, Mission Control, relive sol 182, credits | Playwright, one spec |
| Manual | Visual alignment, sky look, audio, accessibility, offline | Checklist in section 7 |

## 2. Golden values (reproduced on 28 Oct 2026 in a scratch script; tolerances chosen for an exploration app)

| Test | Input | Expected | Tolerance | Source of truth |
|---|---|---|---|---|
| GISS example 1 | 2000-01-06T00:00:00Z, TT-UTC 64.184 s | MST 23:59:39; Ls 277.18758 deg | 1 s; 0.0005 deg | GISS Mars24 algorithm page |
| GISS example 2 (Spirit) | 2004-01-03T13:46:31Z, TT-UTC 64.184 s, 184.702 W, -14.640 N | Ls 327.32416 deg; EOT -12.77553 deg; LTST 00:00:00; solar azimuth 180 deg | 0.0005 deg; 1 s; 0.01 deg | same |
| MY39 start | Ls = 0 crossing search from 2026-09-25 | 2026-09-30 | same day | The Planetary Society Mars calendar |
| Ls on 14 Nov | 2026-11-14T00:00Z | 21.57 deg | 0.02 deg | COMPUTED (TIME-02) |
| Gale sunrise | 14 Nov 2026, -4.5895 N, 137.4417 E, Sun centre at 0 deg elevation | 08:17 UTC | 2 min | Paper 4.6 (13:47 IST) |
| Gale sunrise | 15 Nov 2026 | 08:56 UTC | 2 min | Paper 4.6 |
| Jezero sunrise | 14 Nov 2026, 18.44 N, 77.45 E | 12:08 UTC | 2 min | Paper 4.6 |
| Perseverance light time | 2021-02-18T20:43:49Z | 11.37 min | 0.02 min | NASA, NTRS 20230006978 |
| Curiosity light time | 2012-08-06T05:17:57Z | 13.80 min | 0.02 min | ESA (13 min 48 s) |
| Light time on 14 Nov | 2026-11-14T00:00Z | 11.01 min | 0.02 min | COMPUTED (TIME-05) |
| Curiosity sol | 2026-11-14T12:00Z | 5074 | exact | Paper 4.6; cross-check raw-image feed |
| Perseverance sol | 2026-11-14T12:00Z | 2039 | exact | Paper 4.6; the M20 feed showed sol 2022 on 2026-10-28T11:14Z |
| Frames | SITE-01 planetocentric lat -4.5895 | geodetic -4.6438 deg | 0.0001 deg | IAU 2015 ellipsoid (SITE-07) |
| Distance | SITE-01 to SITE-02 on the 3,396.19 km sphere | 443 m | 2 m | MMGIS coordinates (SITE-03) |
| Tobler scaling | slope 0 / slope -0.05 | 3.30 / 3.93 km/h | 0.01 | Definition in FEATURE_TICKETS T08 |
| Dose | 8 h at 0.64 mSv/day | 0.213 mSv | 0.001 | RAD-01 (RAD-07) |
| Mission dose | 180 d at 1.84 + 500 d at 0.64 + 180 d at 1.84 mSv/day | 982 mSv | 1 | RAD-06 |
| Mission Control | 2026-11-14T00:00Z, compression 60 | 22.0 s countdown, label "22.0 min real" | 0.1 s | T15 |
| Terrain reference | Our terrain tile height at SITE-01 | -4,500.97 m (MMGIS, areoid) | 20 m | SITE-01; proves tiles and waypoints share the areoid reference |
| Horizon | Eye height 1.7 m, R 3,389.5 km | 3.39 km | 0.01 km | PLN-12 |
| Dingo Gap distance | SITE-01 to SITE-08 | 2,993 m | 5 m | SITE-09 |

## 3. Planner tests (fixtures are small hand-made grids plus the real grid)

| Given | When | Then |
|---|---|---|
| 5x5 flat grid | Dijkstra from the centre | Corner time = diagonal distance / 3.3 km/h |
| A wall of 25 deg cells | Route across | Path goes around; with threshold 30 deg it goes through |
| Stop enclosed by blocked cells | Plan | Breach `UNREACHABLE` naming the stop |
| Real grid, Yellowknife Bay, 60 min on site, start 10:00 LTST | Plan | OK; every budget has positive margin |
| Same, 470 min on site | Plan | Breach `LIFE_SUPPORT` |
| Same, start 16:30 LTST | Plan | Breach `DAYLIGHT` |
| Stop 2.5 km away | Plan | Breach `RADIUS` before any search |
| Curiosity waypoints sol 3-166, rasterised to the grid | Passability check | at least 95% of cells passable at 20 deg |
| Real grid | Timing | route under 300 ms, field under 500 ms on the weakest laptop (logged, not a CI gate) |

## 4. Assistant eval

- `eval/questions.json`: 40 items `{ id, question, expectFactIds, acceptValues, mustRefuse }`. Mix: 10 budget and route questions, 8 time and sky, 6 hazards and limits, 6 science, 4 event (dust devil), 4 out-of-scope that must be refused, 2 Mission Control.
- Scoring per answer: the right value (within the tool's rounding); a source named; no number outside the tool results of that turn; refusals where `mustRefuse`.
- Pass: Gemini and Groq at least 38 of 40 each, OpenRouter at least 18 of 20 (its free limit is about 50 requests a day), and zero unsupported numbers for every provider. A provider that fails is removed from the chain until fixed. Run before every film take and after any change to instructions or tools. Runs are free but use daily quota: spread them out and log which provider and how many requests.
- Offline rules: the 15 most common intents answer correctly with the right fact IDs; every other question gets "no offline answer for that".

## 5. Mocking

- External HTTP (the three AI providers) is mocked in unit and integration tests with a fake `fetch`.
- Fixture data are small slices of the real `data/` files (same schemas), never invented values.
- The E2E test runs against `vercel dev` with real data files and a stubbed voice (text input path), so it costs nothing.

## 6. CI

GitHub Actions on push: `npm ci`, `npm run typecheck`, `npm test`, `npm run build`, `npm run diag -- --ci`. Merging to `main` requires green. E2E runs on demand (needs the generated tiles locally).

Coverage targets: 100% of lines in `core/frames.ts`, `core/mars-time.ts`, `core/ephemeris.ts` and the budget checks in `core/planner.ts` (they decide what is "safe"); about 80% elsewhere in `core/`; no target for UI.

## 7. Manual checklist (before filming and before submission)

- [ ] MSL waypoints sol 3-166 follow Curiosity's route over the 25 cm mosaic and end on the Yellowknife Bay outcrop; SITE-01 is not 3 km off.
- [ ] Curiosity model at SITE-02 stands on Yellowknife Bay floor; at Dingo Gap the rover-scale terrain meets our terrain without a visible step.
- [ ] Horizon at eye height looks close (3.39 km) and the light level matches the exposure setting.
- [ ] Sky at sunrise and noon compared side by side with Curiosity photos (sol 956 sunset for later).
- [ ] Every number on every scene has a badge; tap three at random and follow the source link.
- [ ] Walk at 30 fps or better on the weakest laptop; Low preset kicks in when forced.
- [ ] Keyboard-only run of the demo path; screen reader announces scene headings and budget states.
- [ ] Reduced motion on: descent becomes a fade.
- [ ] Network off after one online run: offline banner; globe, descent, walk and Dingo Gap in full 3D; data panels; Whisper speech in, offline answers and Kokoro voice all work.
- [ ] With the Gemini key removed, Groq answers; with Groq removed too, OpenRouter answers; with all removed, offline answers.
- [ ] Mic denied: text assistant works.
- [ ] Credits panel equals the README sources list.
- [ ] No NASA logos anywhere, including the OG image and the film.

## 8. How to run

```
npm test                 # all 52 tests, including golden values, the camera-model check and the 40-question offline eval
npm run diag             # diagnostics, includes a test run summary
```

Planned but not built: `npm run e2e` (Playwright demo path) and `node eval/run.mjs --provider ...` (per-provider eval with live keys).
