# Build Log: Homeward

> Version 2.0.0 | 2026-11-01 | Sections 1-11: the session of 29 Oct 2026 that planned, built, tested and refined Homeward. Section 12: the session of 1 Nov 2026 (Explore, Rover view, walking yourself). The record covers what was done, in what order, every decision, every bug and its fix, every measurement. `CHANGELOG.md` has the short form; this file has everything.

Contents: 1 Timeline | 2 Team decisions | 3 Environment | 4 What was built (every file) | 5 Data produced | 6 Decisions made during the build | 7 Bugs found and fixed | 8 Verification record | 9 Not built | 10 External services contacted | 11 Before deploy and submission

## 1. Timeline

| When | Phase | Result |
|---|---|---|
| 28 Oct 2026 | Session 1: planning | Read the research paper; wrote about 33 planning documents (README, PRD, TAD, IMPLEMENTATION_PLAN, DATA_SPEC, build chunks 00-09 and more). No code. |
| 28 Oct 2026 | Session 1b: open questions | Team answered Q1-Q7 (section 2); every affected document revised. A batch of edits renaming the event location from Bengaluru to Harohalli was rejected by the team and not applied; documents keep "Bengaluru". |
| 28 Oct 2026 | Official page | Team saved the official challenge page (Details tab); PRD and DATA_SPEC reconciled with it. |
| 29 Oct 2026 | Session 2: build | Team reported the local host allowed building early and asked for the complete product, "no demo, real researched data", with the Kokoro voice. Project skills created in `.claude/`; environment set up; data pipeline run; core logic and tests; globe; scenes; assistant, relay and voice. |
| 29 Oct 2026 | Session 2: test and refine | Every scene exercised in the browser at desktop and phone widths, in the dev server and in the production build. 27 problems found and fixed (section 7). Added Phobos and Deimos, real Mars wind, spoken hazard alerts, an offline-only assistant switch, Clear plan, diagnostics (20 checks) and a 40-question assistant eval. |
| 29 Oct 2026 | Session 2: documents | All 29 project markdown files updated to the as-built state; this log written. Checking every document against the code found three more problems (bugs 25-27), all fixed and verified. |

## 2. Team decisions (in their words where it matters)

| Question | Decision |
|---|---|
| Q1 Planning before the event | Local lead allowed the planning documents (28 Oct). On 29 Oct the team reported the local host also allowed building. See `legal/COMPLIANCE.md` 1.1. |
| Q2 Budget | Zero: "find free version... I can't spend any money". Free AI chain (Gemini, Groq, OpenRouter) and a free human-like voice from GitHub (Kokoro). |
| Q3 Name | Homeward ("Red Atlas" was taken by a similar Devpost project). |
| Q4 3D | Full 3D with our own terrain and imagery, "the same experience as Cesium but better", with a human, felt sense of place. No Cesium ion. |
| Q6 Assumptions | Keep all defaults. |
| Q7 Official page | Team pasted it; reconciled. |
| Location wording | Keep "Bengaluru" (the Harohalli rename was rejected). |
| Build request (29 Oct) | Build everything the plan and the challenge ask for, real data only, premium feel, Kokoro voice, test and refine without asking questions; choose the best option when unsure. |
| Deploy (29 Oct) | Team said "Yes, deploy", then asked first for every document to be updated and this log written. |

## 3. Environment

- Windows 11, Node 24.14.0, npm; Python 3.12 virtual environment in `.venv` with rasterio 1.5.2 (bundles GDAL 3.12.2), numpy, requests, Pillow.
- Pinned packages: vite 8.3.5, react 19.3.1, typescript 7.0.2, cesium 1.146.0, zod 4.6.7, lucide-react 1.63.0, vitest 5.0.5, kokoro-js 1.2.1, @huggingface/transformers 3.8.1 (bundles onnxruntime-web 1.22.0-dev.20250409), Inter and JetBrains Mono variable fonts 5.3.0.
- Dev server `npm run dev` (port 5173) runs the app and the same `api/v1/*.ts` handlers Vercel runs. Preview `npm run preview` (port 4173). Both send the cross-origin isolation headers.
- `.claude/launch.json` has both servers; `.claude/skills/homeward-dev` and `homeward-facts` hold the project workflow and the rules for adding facts.

## 4. What was built (every file, line counts on 29 Oct 2026)

### App core (`app/src/core`, pure, tested)
| File | Lines | Purpose |
|---|---|---|
| `mars-time.ts` | 121 | Mars24 (Allison and McEwen 2000) with a leap-second table: Mars time, local solar time, Sun position, sunrise and sunset, sols, Mars Year, seasons, next local solar time |
| `ephemeris.ts` | 87 | JPL approximate planetary elements; Earth-Mars distance and light time; `eclipticToMarsFixed` (IAU 2009 pole plus the Mars24 subsolar longitude); Sun and Earth directions from Mars; Earth elongation |
| `moons.ts` | 20 | Phobos and Deimos from JPL Horizons hourly vectors: cubic Hermite in time, rotated into the Mars-fixed frame |
| `frames.ts` | 27 | Planetocentric to planetographic latitude for Cesium (3.21 km offset at Gale), west to east longitude, haversine on the 3,396.19 km sphere, horizon distance |
| `dose.ts` | 7 | Galactic cosmic ray dose at 0.64 mSv/day (Hassler et al. 2014) |
| `planner.ts` | 203 | Tobler walking speed scaled to 3.3 km/h; passability (slope 20 deg, relief 1 m); walk-back time field (Dijkstra on reversed edges, typed-array heap); A* route; budgets and breaches (LIFE_SUPPORT, WALK_BACK, DAYLIGHT, RADIUS, UNREACHABLE, OUTSIDE_GRID) |
| `planner.worker.ts` | 22 | Runs the planner off the main thread; caches the field by home, slope, relief and speed |
| `use-planner.ts` | 99 | React hook: next 10:00 local solar time, sunset, snapping home and stop to standable ground within 15 m, heat-map canvas |
| `core.test.ts` | 153 | 25 golden tests (section 8) |
| `planner-real.test.ts` | 24 | Real HiRISE grid validation |

### Globe, data, state, UI
| File | Lines | Purpose |
|---|---|---|
| `globe/globe.ts` | 218 | Cesium viewer on `Ellipsoid.MARS`: own terrain provider sampling in-memory rasters (finest first, bilinear, 65 x 65 per tile), per-level imagery, Mars-tuned sky (scale height 11 km), sunlight from the real Sun direction, Earth marker, Phobos and Deimos, pins, route, Curiosity traverse, walk-back heat map, dust-devil column, camera flights with a timer fallback, first-person eye; every method is safe after destroy |
| `data/load.ts` | 72 | zod schemas and loaders for facts, sources, corpus, traverse, layers, sols, moons and planner grids |
| `state.tsx` | 80 | App state in the URL hash and localStorage (zod-validated, debounced 300 ms): scene, zone, plan settings, sound, online assistant switch, samples |
| `runtime.tsx` | 24 | Shared runtime: data, globe, plan, position, elapsed time, active event |
| `sites.ts` | 28 | The two walk zones (Gale: Bradbury Landing to Yellowknife Bay; boxwork: rover drop-off to the sol 4709 site) |
| `ui/ui.tsx` | 153 | Badge with meanings, SourceLink, FactRow, four-state Panel, BudgetBar, tooltips rendered in `<body>`, toasts, error Boundary with incident ID, time formats |
| `styles/tokens.css`, `styles/app.css` | 62, 169 | Every colour and spacing as a token; layout for desktop, tablet (under 1,024 px) and phone (under 640 px and 480 px) |
| `App.tsx`, `main.tsx`, `cesium-base.ts`, `index.html` | 115, 15, 4, - | Shell, scene stepper, globe start-up, service-worker registration and warm-up |

### Scenes (`app/src/scenes`)
| File | Lines | Scene |
|---|---|---|
| `Clock.tsx` | 70 | Mars now: live mission clock |
| `Flight.tsx` | 104 | Orbit (moons, time-lapse) and Descent (Perseverance entry profile, wind fades in) |
| `Briefing.tsx` | 54 | Conditions, limits and dose |
| `Plan.tsx` | 113 | Planner with budgets, heat map, sliders, provenance, Clear plan |
| `Walk.tsx` | 216 | First-person walk, HUD, events, science stop, debrief, GeoJSON and CSV export, share |
| `Relive.tsx` | 50 | Curiosity sols 182, 528 and 4709 |
| `Credits.tsx` | 34 | Sources by agency, AI disclosure |

### Assistant (`app/src/assistant`)
| File | Lines | Purpose |
|---|---|---|
| `tools.ts` | 159 | 11 tools: budgets, route, position, Sun, radio delay, conditions, science, extra time at the stop, hazard facts, active event, source search |
| `brain.ts` | 38 | Relay client with up to 3 tool rounds; offline rules on any failure or when the person keeps the assistant offline |
| `offline.ts` | 67 | Keyword intents answered with templates from the same tools |
| `voice.ts`, `voice.worker.ts` | 81, 46 | Kokoro-82M q8 in a Web Worker (af_heart for the suit, bm_george for Mission Control through a 300-3,400 Hz band-pass), sentence pipelining |
| `ambient.ts` | 36 | Real Mars wind loop, gain normalised from the recording's RMS |
| `speech.ts` | 58 | Web Speech API, or Whisper tiny.en on the device |
| `Dock.tsx` | 115 | Captions, input, mic, Mission Control countdown, online switch, sound switch, suggestions, spoken hazard alerts |
| `assistant.test.ts`, `eval.test.ts` | 20, 71 | Extra-time tool tests; 40-question eval |

### Server, scripts, pipeline, config
| File | Lines | Purpose |
|---|---|---|
| `api/v1/assistant.ts`, `api/v1/health.ts` | 51, 19 | Relay and health (Web Request/Response, run by Vercel and by the dev server) |
| `api/_lib/http.ts`, `api/_lib/providers.ts` | 38, 75 | Request IDs, JSON logs, salted IP hash, origin allow-list, rate limit; provider chain with timeout and circuit breaker, system prompt |
| `api/v1/assistant.test.ts` | 79 | 8 relay tests |
| `scripts/diagnostics.mjs` | 220 | 20 checks with fix hints |
| `scripts/fetch-models.mjs` | 44 | Kokoro, Whisper and ONNX runtime, pinned to Hugging Face commits, SHA-256 checked |
| `scripts/copy-cesium.mjs` | 10 | Copies Cesium's static assets |
| `pipeline/common.py` | 84 | Paths, zones, URLs, latitude conversion, retrying downloads |
| `pipeline/snapshot.py` | 60 | MMGIS traverse; sols 182, 528, 4709 with 6 full-frame raw images each |
| `pipeline/make_grid.py` | 98 | Planner grids from HiRISE DTMs |
| `pipeline/make_rasters.py` | 177 | Terrain and imagery rasters, `layers.json` |
| `pipeline/make_moons.py` | 35 | JPL Horizons vectors |
| `pipeline/fetch_audio.py` | 12 | SuperCam sol 1 recording |
| `pipeline/build_facts.py`, `build_corpus.py`, `manifest.py` | 47, 29, 21 | Facts and sources JSON from CSV, discovery-card corpus, hashed manifest |
| `pipeline/facts.csv`, `sources.csv`, `corpus.md` | 55, 52, 101 | 54 facts, 51 sources, 20 cards |
| `app/public/sw.js` | - | Service worker (section 6) |
| `vercel.json`, `vite.config.ts`, `tsconfig.json`, `package.json`, `.env.example`, `.gitignore` | - | Headers and caching, dev API plugin and isolation headers, strict TypeScript, exact pins, server variable names, ignores (models fetched at build) |

## 5. Data produced (`app/public/data`, 63 files, 212.1 MB with models)

| Output | Content | Source |
|---|---|---|
| `globe/t0-global.i16` | Global terrain, 2,880 x 1,440 (7.5 km) | MOLA-HRSC blended DEM 200 m v2 |
| `globe/t1-gale.i16` | Gale at 200 m | same |
| `globe/t2-*.i16`, `t3-*.i16` | Walk zones at 8 m and 1 m; Gale shifted -34.1 and -34.0 m, boxwork -4.7 and -5.0 m to meet the 200 m DEM | HiRISE DTMs DTEEC_010573_1755_010639_1755_U01 and DTEEC_019698_1750_019988_1750_U01 |
| `globe/i0-global.jpg` | Global colour, 8,192 x 4,096 | Viking colourised mosaic 925 m |
| `globe/i1-gale.jpg` | Gale colour, 232 m | Viking MDIM 2.1 colourised |
| `globe/i2..i4-*.jpg` | 5 m, 0.5 m and 0.25 m colour near the walks | MSL Gale merged HiRISE colour mosaic (Parker and Calef) |
| `site/gale`, `site/boxwork` | Planner grids, 2 m cells: slope (Horn, on 2 m cells), relief (3 x 3 posts), elevation; Gale 820 x 586, boxwork 410 x 351 | HiRISE DTMs |
| `traverse/msl.json` | Curiosity waypoints | NASA/JPL MMGIS |
| `sols/msl-0182.json`, `0528`, `4709` and `sols/img` | Position, story and 6 raw full-frame images per sol | MMGIS, NASA raw images |
| `sky/moons.json` | Phobos and Deimos, 3,769 hourly states each, 25 Oct 2026 to 31 Mar 2027 | JPL Horizons |
| `audio/supercam-sol001-wind.mp3` | 20.1 s of Mars wind, sol 1 | NASA/JPL-Caltech/LANL/CNES/CNRS/ISAE-Supaero |
| `facts.json`, `sources.json`, `corpus.json` | 54 facts, 51 sources, 20 cards | `pipeline/*.csv`, `corpus.md` |
| `manifest.json` | Path, size and SHA-256 of every file (also lists `/models/` and `/ort/`) | `pipeline/manifest.py` |

Data findings recorded as facts: MMGIS waypoint elevations after sol 50 sit 15-19 m below the DTM (a rover-frame offset), so terrain heights come from the DTM (SITE-04); the latitude conversion moves pins 3.21 km at Gale (SITE-07).

## 6. Decisions made during the build

| Decision | Why |
|---|---|
| One raster per level, sampled by a custom Cesium terrain provider, instead of a tile pyramid | Simpler pipeline, same full-3D result, works offline; the walk zones are small |
| IAU 2009 Mars pole, not IAU 2015 | The 2015 form needs large periodic terms; without them the Sun direction was 1.34 deg off |
| Slope computed on 2 m cells | 1 m slopes were inflated by DTM noise |
| Heights from the HiRISE DTM, not MMGIS | MMGIS elevations carry a 15-19 m rover-frame offset after sol 50 |
| Stop and home snapped to standable ground within 15 m | Curiosity's exact drill spots sit on outcrops a suited walker would stand beside |
| Kokoro in a Web Worker; next sentence generated while the current one plays | On the main thread, generation froze the globe (0 frames in 5.5 s) |
| Cross-origin isolation (COOP same-origin, COEP require-corp) | Lets ONNX runtime use several threads; every asset is same-origin, so nothing breaks |
| Full-origin URL for the ONNX runtime files | The dev server rewrote root-relative dynamic imports and refused files from `/public` |
| Service worker caches the shell at install, the rest as used, then fills the manifest in the background after the globe is up; Kokoro only when sound is on, Whisper only where the browser has no speech recognition; changed files evicted by hash | Precaching 211 MB at install raced the page's first downloads and failed |
| Models git-ignored, fetched at build, pinned to Hugging Face commits and hash-checked | 88 MB model file; reproducible, tamper-evident deploys |
| `/assets/` immutable; `/data/`, `/models/`, `/ort/`, `/cesium/` revalidated | Only Vite's assets have content hashes |
| Event toasts removed; the suit voice and the event card announce hazards | Three copies of one alert were noise |
| Tooltips rendered in `<body>` with viewport clamping | Hidden tooltips widened scrolling panels and could be clipped |
| `check_extra_time` tool | "Can we stay 20 more minutes?" is a core planning question and had no tool |
| Offline-only assistant switch; Clear plan keeps sound and privacy choices | The privacy notice promised both; clearing a plan must not re-enable sending questions |
| `sharp` accepted in npm audit | Node-only image library pulled in by transformers.js, no upstream fix, never shipped or imported by the API; diagnostics re-verifies that every run |
| Phobos and Deimos from JPL Horizons vectors with our own rotation | Authoritative positions, small file (252 KB), golden-tested against Horizons' own sub-moon points |
| Real SuperCam wind recording as the only ambient sound | A real measurement beats a generated soundscape; credited on screen |

## 7. Bugs found and fixed (27)

| # | Symptom | Root cause | Fix |
|---|---|---|---|
| 1 | Sun direction 1.34 deg off in tests | IAU 2015 pole without its periodic terms | IAU 2009 pole |
| 2 | Sol images included thumbnails | Raw-image listing mixes thumbnails | Filter on the image ID |
| 3 | Too many cells blocked as steep | 1 m DTM noise | Slope on 2 m cells |
| 4 | Type errors in Dock, tools, Credits | Returned booleans from cleanups; union return type; ordering | Fixed signatures |
| 5 | Globe black; camera flights never finished | Hidden browser pane pauses animation frames | Timer fallback on every flight |
| 6 | Stale globe after hot reload | Viewer kept across module reloads | Full reload; later every method made safe after destroy (bug 17) |
| 7 | Dock over the side panel; subject hidden behind the panel | Layout | Width rules and `panelShift` camera re-centring |
| 8 | Walk-back field took 1,861 ms | Object heap, per-step allocations | Typed-array heap, passability mask, inline loops: 121 ms |
| 9 | Dijkstra skipped nodes | Float32 times compared with Float64 priorities | Compute in Float64, store Float32 |
| 10 | Dust devil never appeared | The outbound leg's end time was computed wrongly, so the 60% trigger point was never reached | Outbound end = arrival time at the stop |
| 11 | Voice "error" in dev | Dev server rewrote the ONNX runtime's dynamic import | Full-origin `wasmPaths` |
| 12 | Globe froze about 5 s per spoken sentence | Inference on the main thread | Web Worker, pipelining, cross-origin isolation |
| 13 | First production visit: "3D view could not start: Failed to fetch" | Service worker precached 211 MB at install while the page fetched the same files | New service-worker strategy (section 6) |
| 14 | "Extend the stop by 20 minutes?" got a solar-storm card | No intent or tool for extra time | `check_extra_time` tool and intent |
| 15 | Same hazard shown three times | Toast plus card plus caption | Toasts removed for events |
| 16 | Event still "active" in Relive | Walk never cleared its event on exit | Cleanup on unmount |
| 17 | Error on leaving Plan after a reload | Cleanup called a destroyed viewer | Methods no-op after destroy |
| 18 | Side panel scrolled sideways; text clipped | Hidden tooltips overflowed the panel | Tooltips in `<body>`; fact labels get a minimum width |
| 19 | Phone: Walk, Relive and Credits buttons off screen | Top bar too wide at 375 px | Compact stepper; brand name hidden under 480 px |
| 20 | Phone: HUD, Dock and sheet overlapped | Fixed 52vh offsets and tall cells | 36vh sheet, Dock pinned above it, compact HUD, secondary cells hidden |
| 21 | "How much daylight is left?" answered with radio delay | "light" matched inside "daylight" | Word boundary (found by the eval) |
| 22 | "What is the air pressure?" answered with life support | "air" matched the oxygen intent | Negative lookahead (found by the eval) |
| 23 | Regex word boundaries silently became raw backspace bytes, twice | Shell escaping in heredoc edits | Rewritten with a Node script; diagnostics check 20 now catches control characters |
| 24 | `IP_SALT` missing from `.env.example` | Variable added in code only | Added (found by diagnostics check 03) |
| 25 | Broken link preview; description over-claimed "every agency" | `og.png` never made; copy written before the cut | Removed the image tags until a real screenshot exists; description now names NASA, ESA and USGS |
| 26 | Diagnostics would report "no keys" for a deployment that has them | Check 17 read a `providers` field; the health endpoint returns `checks` | Reads `checks`, also fails when `ALLOWED_ORIGINS` is unset; tested against a mock server |
| 27 | The privacy notice promised a Settings switch that keeps the assistant offline, a Clear plan button and hint flags; none existed | Notice written from the plan | Built the offline-only switch (cloud button; verified 0 relay calls) and Clear plan (keeps sound and privacy choices); notice rewritten to match the app |

Also hardened while testing: unpinned model downloads now pinned and hash-checked; `/data/` no longer marked immutable; transformers.js no longer keeps a second 90 MB cache copy; the stale `eval` path removed from `tsconfig.json`.

## 8. Verification record

Tests: 38 passing in 5 files (`npm test`).
- `core.test.ts` (25): Mars24 examples, Mars Year 39, Ls, Gale sunrise and sunset, sols, Earth elongation, light times (11.37, 13.80, 11.01 min golden values), frame offsets, distances 443 m, 2,993 m and 240 m, horizon 3.39 km, dose, Tobler speed, planner breaches, Phobos and Deimos against JPL Horizons.
- `planner-real.test.ts` (1): Curiosity's sol 3-166 path is 100% walkable under our rules (903 samples; threshold 95%); field 121 ms, route 10 ms.
- `assistant.test.ts` (2), `eval.test.ts` (2, covering 40 questions): right intent for all 40, no number outside the tools, registry or cited cards.
- `api/v1/assistant.test.ts` (8): 403 unknown origin, 400 bad body, 413 over 32 KB, 429 after 30 calls in 10 min, Gemini to Groq to OpenRouter fallback then 503, circuit breaker after 3 failures, tool calls passed through, 503 with no keys.

Measurements:
- Phobos within 0.031 deg (5 km) of JPL Horizons' sub-Phobos point at 2026-11-14 00:30 UT, between table rows; Deimos within 0.047 deg (19 km).
- Kokoro: model load 1.4-2.0 s from cache; about 5.4 s to generate 3.0 s of speech on 4 threads (12-core laptop); before the worker, 0 animation frames during generation; after, frames continue.
- Wind recording: 20.1 s, 44.1 kHz, RMS 0.060, peak 0.697; gain 0.67, so peak after gain is 0.47.
- Bundle: startup JS 122 KB gzip; lazy chunks (globe, voice, speech) 2.1 MB gzip; first visit fills about 161 MB of offline cache with sound on in Chrome.

Diagnostics (`node scripts/diagnostics.mjs --ci`): 19 PASS, 0 FAIL, 1 SKIP (check 17, live health, needs the deployed URL).

Browser checks (dev server and production preview; desktop 1,024 px and phone 375 x 812): Mars now; Orbit with moons and time-lapse; Descent handing over to Briefing; Briefing; Plan for both zones (Gale 905 m round trip, Boxwork 659 m, all budgets OK); Walk with HUD, dust devil, solar-storm drill, Mission Control reply after 24.2 min real round trip shown in about 24 s; Relive sols 182, 528, 4709; Credits; offline answers with sources; voice ready; offline switch (0 relay calls); Clear plan; first visit from empty storage in the production build with no console errors.

Not measured: frame rate on the team's weakest laptop (the test pane was throttled to about 2 frames per second when hidden); answers from the live AI providers (no keys were configured locally).

## 9. Not built

Dingo Gap rover-scale 3D tiles (F30); a Curiosity 3D model (F11, F29); every-agency layers (F14); water and ice overlay (F17); measurement tools (F16); THEMIS thermal layer (F32); mission pins (F21); per-band Martian acoustics and suit-interior sound (F19); light scaled to 39% of Earth's (PLN-13); comfort settings; star sphere rotated for Mars and labelled orbiters; Mars Climate Database conditions and DONKI events (F04, F18 parts); a shelter-time slider in the storm scenario; Kannada and Hindi (F23); all P2 and P3 items (F22, F24-F28, F33, F34); browser end-to-end tests; an offline banner with the manifest date and a caching progress bar.

## 10. External services contacted during the build

USGS Astrogeology (DEM, mosaics, HiRISE DTMs), NASA/JPL MMGIS (waypoints), NASA raw-image API, NASA Science asset server (SuperCam audio), JPL Horizons API, Hugging Face (model files, pinned commits), npm registry, GitHub API (licence checks during planning). No personal data was sent anywhere; the user's email address was not used.

## 11. Before deploy and submission

1. Get the local host's permission to build early in writing; ask whether the global Space Apps team accepts a project built before 14 Nov; disclose the build date (`legal/COMPLIANCE.md` 1.1).
2. Deploy on Vercel with the free keys and `ALLOWED_ORIGINS`, `IP_SALT`; run diagnostics with `--base`.
3. Make `og.png` (1,200 x 630) from a real screenshot, then restore the `og:image` and large-card tags (`docs/SEO_PERFORMANCE.md`).
4. Add the team contact line to `legal/PRIVACY_POLICY.md`.
5. Film the 30-second video or make the slides from real screenshots during the event window; submissions open 14 Nov 2026, 09:00 local.
6. Measure frame rate on the weakest team laptop; ask a few real questions with the keys set and read the answers.

## 12. Session 3, 1 Nov 2026: Explore, Rover view, walking yourself

The team asked for a Google-Earth experience, walking themselves instead of auto-walk, every visited place, and every rover photo in order like Google Street View. Plan, findings and decisions D15-D20: `build/PLAN-2.md`.

### 12.1 Research (all tested live)

- Curiosity raw-image API: `Access-Control-Allow-Origin: *`; Navcam records carry site, drive, attitude quaternion and a CAHVOR model from sol 13 (sols 3 and 13 to 5040 sampled); `condition_4=<camera>:instrument` filters by camera, site and drive cannot be filtered server-side. Mastcam (MSSS) records have no pointing.
- Perseverance raw-image API: same fields, 320/800/1200 px versions, `search=%7CNAVCAM_LEFT%7CMCZ_LEFT`; Navcam models are CAHVORE.
- Camera models are adjusted to each delivered image's pixel grid (hc 126.5 for a 256 px downsample, 25.6 for an offset subframe), so no per-case pixel offsets are needed.
- Conventions: the quaternion `(s, x, y, z)` rotates rover frame to local level; it reproduces MMGIS yaw exactly (28.68 deg; 221.38 vs -138.62 deg). Curiosity's sol-168 360 pan lands at 0, 30, 60 ... 330 deg and a constant -17 deg although rover-frame mast elevations vary from -12 to -22 deg (the rover was tilted): the strongest check that placement is right.
- MMGIS: 1,386 and 708 waypoints, drive paths, Ingenuity waypoints and flight paths; its per-stop Perseverance panoramas return HTTP 403.
- Mars Trek and Esri OnMars tiles send CORS `*`: CTX beta01 5 m, HiRISE (sparse), THEMIS day and night 100 m, Viking 232 m; 2 x 1 geographic tiles on the Mars 2000 sphere.
- Landing sites: PDS Geosciences Node ODE table with references; InSight from Golombek et al. 2020; Beagle 2 from Bridges et al. 2017; Zhurong from Liu et al. 2022. USGS Gazetteer gives all 2,097 Mars names (2,051 approved).
- Not found: public pointing data for Spirit, Opportunity, InSight, Phoenix, Pathfinder, Viking, Zhurong; Spirit and Opportunity traverse vectors.

### 12.2 Built

- Pipeline: `pipeline/rovers.py` (stops, simplified tracks, Ingenuity, Gazetteer, offline featured stops), `pipeline/landers.csv` checked by `build_facts.py`; 23 new sources.
- Core: `core/camera.ts` (CAHV ray, quaternion rotation, CSS `matrix3d` per photo, projection), `core/places.ts` (search, coordinate parsing), `frames.ts` bearing and offset; all tested.
- Globe: live layers on `OcentricTiling`, place labels by feature size, tracks, stop dots, selection, hover, field of view, camera API.
- Scenes: Explore (new), Rover view (Relive rewritten; scene id kept so old links work), Walk (manual default, planner pace, pad, drag to look, guide arrow, arrival and home detection, plan-versus-actual debrief), Clock buttons.
- Headers: COEP `credentialless`, CSP with three hosts; diagnostics check 15 enforces both.

### 12.3 Bugs found and fixed

1. Pipeline: `int(x.get("drive") or -1)` turned drive 0 into -1; three featured stops came back empty.
2. Pipeline: the featured-stop snapshot pulled every sample type (about 1,300 records at Yellowknife Bay); now full frames only, at most 60.
3. Perseverance's drive counter ticks without wheel motion (sol 13 frames at 3_8 and 3_16, waypoint 3_0): exact site/drive matching found nothing; now the latest stop at or before the counter, exact matches preferred.
4. Search results were hidden under the next panel (each panel's backdrop blur is its own stacking context): the list is now in flow.
5. Far-side lander pins showed through Mars (`disableDepthTestDistance: Infinity`): now 300 km.
6. Stop dots drifted off the track at coarse zoom (terrain LOD parallax; the data match exactly): dots show within 25 km only.
7. The dev API relay had returned HTTP 500 since the build (`ssrLoadModule("/api/...")` resolved under `app/`): absolute path.
8. Key handlers called `closest` on `window` targets and threw: `?.closest?.()`.
9. Startup JS 1,229 KB gzip after Explore imported Cesium: layer list split into `live.ts`, camera moves behind `globe.cam`; 140 KB again.
10. Rover view up-arrow chose the stop behind you (a stray sort reversal); the mini-map always used Curiosity's colour; the go-to-sol box kept an old value.
11. Under the production CSP the globe never started (present since the first build, hidden because neither dev nor preview sent the CSP): Cesium's `Viewer` compiles Knockout bindings with `Function()`. Now `CesiumWidget` (it has entities and imagery since Cesium 1.121), and `npm run preview` sends the `vercel.json` headers.
12. An inlined `data:` font was blocked by `font-src 'self'` (since the first build); zod's eval probe raised a CSP report; CTX tiles beyond level 12 do not exist and failed without CORS headers.
13. The walk debrief showed only the plan's totals; it now puts what you did beside the plan.

### 12.4 Verification

- `npm test` 52 passed in 9 files; `npm run typecheck` clean; diagnostics 19 PASS, 0 FAIL, 1 SKIP (live health needs the deployed URL); startup JS 140 KB gzip; offline payload 222 files, 220.9 MB.
- Browser (visible pane, about 145 frames per second): walked Bradbury to Yellowknife Bay at 30x by holding W (428 m in about 18 s, dust devil at 60%, stop panel on arrival), finished the stop, turned, walked home, debrief appeared (plan 905 m, walked 847 m). Real-time pace measured at 10 m in 10 s (3.3 km/h). Explore search, fly-to, cards, tracks, CTX registration against our own Gale mosaic; Rover view at Yellowknife Bay (81 photos placed), stepping to the next stop, Perseverance's landing site. Phone width (375 x 812): Explore, Rover view and Walk.
- `crossOriginIsolated` stays true with COEP `credentialless` in Chrome.
- Production build under the production headers (`npm run preview`): no CSP violations across Mars now, Explore, Rover view (NASA records and photos load) and the assistant (answer and voice worker).

