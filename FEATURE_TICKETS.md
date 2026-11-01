# Feature Tickets: Homeward

> Version 2.0.0 | 2026-11-01 | Status: built on 29 Oct 2026, extended on 1 Nov 2026 (`build/PLAN-2.md`); section 0 gives every ticket's outcome.

## 0. Ticket outcomes (29 Oct 2026; updated 1 Nov 2026)

Full record of the build session: `BUILD_LOG.md`.

| Ticket | Outcome |
|---|---|
| T00 Diagnostics | Done: 20 checks |
| T01 Scaffolding | Done: exact pins |
| T02 Mars24, T03 Ephemeris, T04 Frames | Done, golden-tested |
| T05 Data loader | Done: zod schemas, facts by ID |
| T06 Mars viewer | Done on one raster per level (no tile pyramid) |
| T07 Terrain grid | Done: 2 m cells, Horn slope, 3 x 3 relief |
| T39 Own Mars tiles | Done differently: per-level rasters sampled by a custom terrain provider |
| T08 Planner worker | Done: field 121 ms, route 10 ms on the real grid |
| T09 Planner panel, T12 Science stop | Done |
| T10 Walk and HUD | Done; since 1 Nov you walk it yourself by default (keys, pad, drag to look) at the planner's pace, with arrival and home detection and a plan-versus-actual debrief; Follow the plan replays the route |
| T11 Briefing | Done without Mars Climate Database values |
| T13 Relay, T14 Assistant loop, T15 Mission Control | Done |
| T16 Offline assistant | Done: rules over every intent, plus a switch that keeps answers on the device |
| T17 Eval | Done for the offline brain (40/40); live providers not evaluated |
| T18 Relive sol 182 | Done as Rover view (1 Nov): street view at every Curiosity and Perseverance stop from NASA's photos, placed by camera model; the sol 182, 528 and 4709 stories are featured stops; no rover 3D model |
| T19 Credits, T20 URL state | Done |
| T21 Orbit view | Done with Phobos and Deimos; no star map or orbiters |
| T22 Descent, T23 Dust devil, T24 Health and headers, T25 Export and share | Done |
| T26 Measurement | Partial (1 Nov): ruler with distance, climb and descent and an elevation profile; cursor position and height; no area or line of sight |
| T27 Every-agency layers | Partial (1 Nov): live MRO CTX and HiRISE, Mars Odyssey THEMIS, Viking; no ESA, ISRO or UAE imagery layer |
| T28 Ice | Not built |
| T32 Mission pins | Done (1 Nov): 12 landers with cited coordinates in Explore, plus 2,051 IAU names, rover tracks, stops and Ingenuity flights |
| T29 Space weather | Partial: no shelter-time slider, no DONKI |
| T30 Sound engine | Partial: band-pass and real wind only |
| T31 Service worker | Done differently: shell at install, background fill after the globe, hash eviction; no progress bar |
| T33 Deploy and submission | Partial: hardening done; deploy, film and submission are team steps |
| T40 Presence and comfort | Partial: eye height, horizon, wind; no light scaling, no settings |
| T41 Dingo Gap | Not built |
| T42 Boxwork zone | Done |
| T43 THEMIS | Done (1 Nov): live day and night infrared layers in Explore (NASA Mars Trek) |
| T34-T38, T44-T45 | Not built (P2) |

Effort: S = under 2 h, M = 2-5 h, L = 5-10 h of one person. Every ticket that shows data must implement all four UI states (loading skeleton, success, error with Retry and incident ID, empty with a call to action). "Facts" means IDs in `docs/DATA_SPEC.md`.

## Summary

| ID | Title | Feature | Priority | Effort | Depends on | Chunk |
|---|---|---|---|---|---|---|
| T00 | Diagnostics script | all | P0 | S | - | 00 |
| T01 | Scaffolding and pinned dependencies | all | P0 | S | T00 | 01 |
| T02 | Mars24 time module | F01 | P0 | S | T01 | 04 |
| T03 | Ephemeris and light time | F01, F09 | P0 | S | T01 | 04 |
| T04 | Frame conversion to Cesium | all | P0 | S | T01 | 04 |
| T05 | Data loader, schemas, facts by ID | F12 | P0 | S | T01 | 06 |
| T06 | Mars viewer on our own tiles and Gale camera | F02, F06 | P0 | M | T01, T04, T39 | 06 |
| T07 | Terrain grid pipeline | F05 | P0 | M | T01 | 03 |
| T39 | Own Mars tile pipeline (terrain + imagery pyramids) | F02, F03, F06, F20 | P0 | L | T01 | 03 |
| T08 | Planner worker: walk-back field, A*, budgets | F05 | P0 | L | T07, T02 | 04 |
| T09 | Planner panel | F05 | P0 | M | T08, T05 | 07 |
| T10 | Walk mode and HUD | F06 | P0 | M | T06, T08 | 07 |
| T11 | Briefing panel | F04 | P0 | S | T05, T02 | 07 |
| T12 | Science stop card and sample log | F07 | P0 | S | T05 | 07 |
| T13 | Assistant relay with free provider chain | F08 | P0 | M | T01 | 02 |
| T14 | Assistant loop: speech in, tools, captions, Kokoro voice | F08 | P0 | L | T13, T08, T05 | 05 |
| T15 | Mission Control delay queue | F09 | P0 | S | T03, T14 | 05 |
| T16 | Offline assistant | F08, F20 | P1 | M | T14 | 05 |
| T17 | Assistant 40-question eval | F08 | P0 | M | T14 | 05 |
| T18 | Relive sol 182 | F11 | P0 | M | T06, T05 | 03, 07 |
| T19 | Credits panel | F13 | P0 | S | T05 | 07 |
| T20 | URL state and plan persistence | F15 | P0 | S | T05 | 06 |
| T21 | Orbit view | F02 | P0 | M | T06, T03 | 08 |
| T22 | Descent and tuned sky | F03 | P0 | M | T06 | 08 |
| T23 | Dust devil event | F10 | P0 | S | T10, T14 | 08 |
| T24 | Health endpoint and security headers | backend | P0 | S | T13 | 02 |
| T25 | Export and share | F15 | P1 | S | T09 | 07 |
| T26 | Measurement tools | F16 | P1 | M | T06, T07 | 07 |
| T27 | Every-agency layers | F14 | P1 | M | T06 | 08 |
| T28 | Water and ice overlay | F17 | P1 | S | T27 | 08 |
| T29 | Space-weather scenario | F18 | P0 | S | T08 | 08 |
| T30 | Martian sound engine | F19 | P1 | M | T10 | 08 |
| T31 | Service worker offline | F20 | P1 | M | T05 | 08 |
| T32 | Mission pins and site cards | F21 | P1 | S | T06, T04 | 08 |
| T33 | Deploy, hardening, submission | all | P0 | M | all P0 | 09 |
| T40 | Presence cues and comfort settings | F29 | P0 (cues), P1 (settings) | M | T10 | 07, 08 |
| T41 | Dingo Gap rover-scale scene | F30 | P1 | M | T06, T39 | 08 |
| T42 | Boxwork walk zone (second grid, tiles, rover drop-off, card) | F31 | P1 | M | T07, T39, T08 | 03, 07, 08 |
| T43 | THEMIS thermal-inertia layer and route note | F32 | P1 | S | T07 | 03, 08 |
| T34-T38 | Landing-site check, Kannada/Hindi, prologue, more weather, Mie sky | F22-F26 | P2 | - | core done by H30 | 05, 08 |
| T44-T45 | CRISM spectral layer; crew of two and rover support | F33, F34 | P2 | - | core done by H30 | 04, 08 |

## P0 tickets

### T02 Mars24 time module
- **Done when**: `marsTime(utc)` returns `{ msd, mst, ls, eotDeg, declDeg, sunDistAu, subsolarLonW }` and `localSolar(utc, lonE)` returns LMST and LTST, implementing GISS steps A-1 to D-6 with TT-UTC = 69.184 s.
- **Tests**: Given 2004-01-03T13:46:31Z, then Ls = 327.32416 +/- 0.0005 and EOT = -12.77553 +/- 0.0005 (TT-UTC 64.184 s for that date, as in the GISS example). Given 2000-01-06T00:00:00Z, then MST = 23:59:39 +/- 1 s. Given 2026-11-14T00:00Z, then Ls = 21.57 +/- 0.02. Given the Ls = 0 crossing search, then MY39 starts on 2026-09-30.
- **Edge cases**: mod-360 and mod-24 wrapping; dates before 2017 need the leap-second table (only the GISS checks use them).
- **Security**: none. **UI states**: none (pure function).

### T03 Ephemeris and light time
- **Done when**: `helio(body, utc)` implements JPL Table 1 steps 1-5 for EM barycentre and Mars; `lightTimeMin(utc)` returns one-way minutes.
- **Tests**: Perseverance touchdown 2021-02-18T20:43:49Z gives 11.37 +/- 0.02 min; Curiosity touchdown 2012-08-06T05:17:57Z gives 13.80 +/- 0.02 min; 2026-11-14T00:00Z gives 11.01 +/- 0.02 min.
- **Edge cases**: Kepler solver must converge (tolerance 1e-6 deg, max 50 iterations).

### T04 Frame conversion
- **Done when**: `toCesium(latC, lonE, heightM?)` converts planetocentric to Cesium `Cartographic` (geodetic latitude on the IAU 2015 ellipsoid); `fromWestLon(lonW)` exists for NSSDC sites.
- **Tests**: SITE-01 latitude moves from -4.5895 to -4.6438 +/- 0.0001 deg; round trip back within 1e-9 deg.
- **Security**: none.

### T05 Data loader
- **Done when**: `loadFacts()`, `fact(id)`, `source(id)` work; every file validated with zod; a failed file rejects with `{ file, issues, incidentId }`.
- **Tests**: Given a facts file missing `badge`, when loaded, then the loader rejects and names the entry.
- **UI states**: global skeleton during first load; error screen with Retry if the manifest fails.

### T06 Mars viewer on our own tiles
- **Done when**: `Globe(Ellipsoid.MARS)` with `CustomHeightmapTerrainProvider` and `UrlTemplateImageryProvider` on our `/tiles/v1/` pyramids (`build/chunk-06.md`); no Cesium ion, Bing or Earth sky box; flies to SITE-01.
- **Tests**: the alignment checks in `build/chunk-06.md` (waypoints over the 25 cm mosaic, terrain height at SITE-01 within 20 m of -4,500.97 m, unconverted pin 3.2 km off). Automated: a smoke test that the viewer mounts and requests only same-origin tiles.
- **Edge cases**: tiles not yet cached and offline shows "Connect once to cache Mars"; missing tiles at a level fall back to the parent (callback returns `undefined`); WebGL unavailable shows a static credited image and the recorded walkthrough link.

### T39 Own Mars tile pipeline
- **Done when**: `pipeline/make_tiles.py` writes terrain and imagery pyramids and `tiles/v1/manifest.json` per `docs/DATA_SPEC.md` section 5.1.
- **Tests**: Python and TypeScript frame formulas agree on shared vectors; terrain height at SITE-01 within 20 m of -4,500.97 m; the HiRISE-to-DEM seam offset is recorded and under 50 m; a re-run gives identical hashes; total size within the offline budget.
- **Edge cases**: tile corners crossing the 180 deg meridian; nodata in the HiRISE strip (fall back to the DEM); the MSL mosaic edge (fall back to Viking imagery).

### T07 Terrain grid pipeline
- **Done when**: `data/site/gale/grid.{json,bin}` exists per the schema in `docs/DATA_SPEC.md` section 4, generated by `pipeline/make_grid.py` from DATA-03.
- **Tests**: Given SITE-01 and SITE-02, then both fall on non-nodata cells; the landing area median slope is under 5 deg (spot check); re-running produces an identical SHA-256.
- **Edge cases**: DTM nodata, the strip edge, metre units confirmed from the GeoTIFF.

### T08 Planner worker
- **Done when**: The worker exposes `plan({ stops, startLtst, settings })` returning `{ path, timeline, budgets, breaches, timeHomeField }`.
  - Speed: Tobler hiking function scaled so flat ground gives 3.3 km/h: `v = 3.3 x exp(-3.5 x |s + 0.05|) / exp(-0.175)` km/h, s = rise over run along the step (ASSUMPTION, documented on the provenance card).
  - Blocked: slope over the threshold (default 20 deg), relief over the obstacle threshold (`reliefM` over 1.0 m inside the 3 x 3 m neighbourhood, ASSUMPTION, slider 0.5-2.0 m; marks large rocks and ridges the DTM resolves), nodata, beyond the radius (default 2 km).
  - Walk-back field: Dijkstra from the habitat on reversed edges.
  - Route: A* with an admissible heuristic (straight-line distance over the maximum speed, 3.93 km/h).
  - Budgets: life support (8 h minus reserve), walk-back margin at every timeline step, daylight (home by sunset minus margin), dose accrual (RAD-01), slope.
- **Tests**: Given the default settings and the Yellowknife Bay stop with 60 min on site, then the plan is OK. Given a stop beyond 2 km, then breach `RADIUS`. Given a 7.9 h stop time, then breach `LIFE_SUPPORT`. Given Curiosity's waypoints between sols 3 and 166, then at least 95% of the cells on that path are passable. Route search under 300 ms; walk-back field under 500 ms, recomputed only when slope or speed settings change (measured on the weakest laptop).
- **Radius**: a stop beyond the radius is rejected geometrically before any search (breach `RADIUS`); a stop outside the grid box gets breach `OUTSIDE_GRID`.
- **Edge cases**: unreachable stop (enclosed by blocked cells) returns breach `UNREACHABLE` with the stop ID; duplicate stops; zero stops. The planner says plainly that rocks smaller than about 1 m cannot be seen in orbital data.
- **Security**: worker accepts only validated messages (zod).

### T09 Planner panel
- **Done when**: Stops list with Yellowknife Bay preset, sliders for each ASSUMPTION (reserve, daylight margin, slope threshold, speed factor), budget bars with text and pattern for state, breach list with links, walk-back heat map toggle, Approve button disabled on any breach.
- **UI states**: skeleton bars while computing; error with Retry if the worker fails; empty state "Add a science stop to plan a Marswalk" with Add button.
- **Persistence**: every change writes the URL and `homeward:plan:v1`; reload restores it.
- **Tooltips**: every slider, bar and badge.

### T10 Walk mode and HUD
- **Done when**: Camera at 1.7 m above sampled terrain; keyboard (WASD, arrows, Shift to run is disabled because suits do not run; Space for auto-walk); HUD shows life support, dose, Sun elevation and time to sunset, distance and time home, radio delay; margin warnings at 25% and 10%.
- **Tests**: Given auto-walk to SITE-02, then distance walked is within 10% of the planned path length; fps is logged.
- **Accessibility**: all HUD values readable by screen readers through a live region, throttled to one update per 5 s.

### T11 Briefing panel
- **Done when**: Shows LIVE clock values, MODELLED MCD values for the selected LTST hour at Ls 22, MEASURED REMS ranges (WX-01), dose so far, daylight left, suit limits (EVA-01..04), each with a badge and source chip.
- **UI states**: all four.

### T12 Science stop
- **Done when**: Card for Yellowknife Bay with SCI-01, SCI-02, a Curiosity photo from sol 182 (credited), and Log sample; the log records time, coordinates and note. The same photos appear on the stop in the planner ("what you will see"), before the walk starts.
- **Optimistic**: the logged sample appears at once; it is removed with a toast only if local validation fails.

### T13 Assistant relay
- **Done when**: `POST /api/v1/assistant` per `IMPLEMENTATION_PLAN.md` section 7: zod body, origin check, per-IP limit (30 per 10 min), provider chain Gemini then Groq then OpenRouter with an 8 s timeout each and a circuit breaker; returns `{ provider, message, requestId }`.
- **Tests**: the table in `build/chunk-02.md` (403, 400, 413, 429, fallback order, 503 when all fail, breaker skip, tool calls passed through).
- **Security**: keys only in env; never logged; message content never logged; `Cache-Control: no-store`.

### T14 Assistant loop
- **Done when**: Tool registry with JSON schemas: `get_position`, `get_budgets`, `get_route`, `get_conditions`, `get_sun`, `get_radio_delay`, `get_nearby_targets`, `get_event`, `search_sources`, each returning `{ values, factIds, sourceIds, badges }`. Speech in via the Web Speech API or Whisper; up to 3 tool rounds through the relay; captions with source chips and the provider label; Kokoro speaks the answer in sentence chunks.
- **Tests**: unit tests for every tool against fixture state; the T17 eval per provider.
- **UI states**: listening, thinking (skeleton caption line), speaking, error with Retry and Use offline, empty (suggested questions).
- **Security**: tool arguments validated with zod; only known tool names run; no tool calls the network.

### T15 Mission Control queue
- **Done when**: "Send to Earth" stores the question with the scenario time, shows a countdown of `2 x lightTimeMin(scenarioDate)` minutes divided by the compression factor (default 60, ASSUMPTION), labels "time-compressed 60x", then delivers a reply generated with the same tools under a Mission Control persona.
- **Tests**: Given 2026-11-14T00:00Z and compression 60, then the countdown is 22.0 s +/- 0.1 s and the label reads "22.0 min real".

### T17 Assistant eval
- **Done when**: `eval/questions.json` holds 40 questions with expected fact IDs and accepted values; `eval/run.mjs --provider <name>` runs them with the same instructions and tools and scores: correct value, cited source, no unsupported number.
- **Pass**: Gemini and Groq at least 38 of 40 each; OpenRouter at least 18 of 20 (its free daily limit); 0 unsupported numbers for all. A provider that fails is removed from the chain. Results saved to `eval/results-<provider>-<date>.json`. All runs are free.

### T18 Relive sol 182
- **Done when**: `data/sols/msl-0182.json` exists (pipeline); scene loads it, places the NASA Curiosity model at SITE-02 with yaw from the waypoint, sets the Sun for the sol's local time, pins at least 4 credited photos, shows REMS and dose cards when present (empty state if the archive has no value for that field).
- **Tests**: rover position equals SITE-02 after `toCesium`; image credits present.

### T19 Credits panel
- **Done when**: Generated from `data/sources.json`, grouped by agency, with licence and link; includes AI tools (Gemini, Groq's gpt-oss-120b, OpenRouter's free models, Kokoro-82M, Whisper, any code assistants) and an AI disclosure line; no logos.

### T20 URL state
- **Done when**: zod schema for hash params; invalid params fall back to defaults with a toast; every state change replaces history (no back-button spam).

### T21 Orbit view
- **Done when**: Mars globe, Sun direction from Mars24, Earth marker from `helio()`, Phobos and Deimos from precomputed Horizons positions for 14-16 Nov (P1 for orbiters and star map).

### T22 Descent and tuned sky
- **Done when**: Scripted camera path to SITE-01; CesiumJS atmosphere parameters tuned towards Mars (scale height near 11 km per PLN-09; weaker Rayleigh, stronger Mie; values recorded as ASSUMPTION); HUD shows EDL-01 numbers; sky checklist in `design/UI_DESIGN_PROMPTS.md` passes.

### T23 Dust devil event
- **Done when**: At a scripted point on the walk, a visual dust column (GENERATED badge) crosses the route at EVT-01's speed; an event card shows EVT-01 and WX-02 with sources; `get_event` returns it.

### T24 Health and headers
- **Done when**: `GET /api/v1/health` returns 200 with `{ status, checks: { geminiKey, groqKey, openrouterKey, allowedOrigins, dataManifest }, version, uptimeS }` and 503 if no provider key is set or the manifest fails; `vercel.json` sets the headers in `docs/SECURITY_ACCESS.md`.

### T33 Deploy and submission
- **Done when**: Production URL works on two browsers and the weakest laptop; diagnostics all PASS; security checklist P0 items ticked; credits match README; AI disclosure present; 30-second film and subtitles exported; submission made with several hours of buffer.

## P1 tickets (short form)

| ID | Done when |
|---|---|
| T16 | Offline assistant: Whisper speech in, rules answering the 15 most common intents (from the eval) with the same tools, Kokoro voice, caption says "Offline answer" |
| T25 | Export GeoJSON (route, stops, samples) and CSV (timeline) with a `sources` array; share copies the URL |
| T26 | Distance, elevation profile, slope histogram, line of sight between two points; distance SITE-01 to SITE-02 reads 443 m |
| T27 | Layer list with at least one visible job per agency listed in PRD F14, each with its credit |
| T28 | Ice overlay with the paper 4.12 sources and the plain statement that Gale has little near-surface ice |
| T29 | (Now P0, see summary) Solar storm scenario using RAD-05; shelter rule added to walk-back; mGy shown separately from mSv |
| T30 | Web Audio graph: low-pass and distance attenuation per SND-01, radio band-pass for voices, silence above the atmosphere |
| T31 | Service worker caches shell, `data/`, `tiles/v1/`, `models/`, `audio/`; Offline banner shows the manifest date; the full demo path works with the network off |
| T32 | Pins for every mission in paper 7.1, converted to planetocentric east; each opens a cited card |
| T40 | Presence (P0): eye height 1.7 m, horizon at the real 3.39 km, exposure matched to 39% of Earth's sunlight, 0.33 deg Sun, Mars acoustics, suit-interior sound (GENERATED), Curiosity model for scale. Comfort (P1): field-of-view slider, head bob off by default, turn vignette option, reduced motion |
| T42 | Boxwork walk zone: `data/site/boxwork/grid` and tiles from DATA-26; habitat replaced by the rover at SITE-10; stop at SITE-11 with an SCI-05 card and Curiosity photos from sols 4709-4789; walk-back target is the rover; tests: 240 m straight line (SITE-12), route stays in hollows where `reliefM` marks ridges |
| T43 | THEMIS thermal inertia (DATA-25) resampled into both grids; layer toggle with legend; route note "loose sand likely" where thermal inertia is low (threshold ASSUMPTION, shown on the provenance card); never blocks a route |
| T41 | Dingo Gap scene: DATA-23 tileset placed at SITE-08 (toCesium + yaw from the waypoint), checked against our terrain at its edges; Curiosity model; credits for every instrument; walkable at eye height |

## P2 tickets (only if the core is stable at H30)

T34 landing-site safety check (F22), T35 Kannada and Hindi mode via browser speech in and Gemini TTS free tier (F23), T36 journey prologue (F24), T37 dusk clouds, frost and storm warning (F25), T38 Mie-theory sky from Schneegans et al. 2024 (F26). Write their full tickets only when they are picked up.
