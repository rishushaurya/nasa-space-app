# Graph Report - clever-ptolemy-805f09  (2026-11-14)

## Corpus Check
- 123 files · ~143,313 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .csv 3, .example 1)

## Summary
- 1216 nodes · 3357 edges · 75 communities (65 shown, 10 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 411 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0b34e598`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record.mjs
- make_rasters.py
- planner.ts
- raw.ts
- assistant.ts
- eval.test.ts
- globe.ts
- voice.ts
- FEATURE_TICKETS.md
- diagnostics.mjs
- BUILD_LOG.md: complete build record
- load.ts
- Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)
- T06 Mars viewer on own tiles and Gale camera
- PRD.md: Homeward product requirements
- T08 Planner worker: walk-back field, A*, budgets
- SECURITY_ACCESS.md
- APP_FLOW.md
- Decisions on open questions Q1-Q7 (team answers, 28 Oct 2026)
- compilerOptions
- Golden values: tests reproduce published NASA and ESA numbers (GISS Mars24 examples, landing light times)
- docs/DATA_SPEC.md: data files, facts registry, provenance, licences
- TAD.md
- package.json
- Explore.tsx
- RAD radiation detector on Curiosity
- mars-time.ts
- pipeline/corpus.md: discovery-card corpus
- library.ts
- Demo walk: Bradbury Landing to Yellowknife Bay, 443 m
- Walk.tsx
- main.tsx
- Scene: Walk (walk it yourself, HUD, events, debrief)
- NASA MMGIS rover waypoints and traverses
- Homeward films: script and plan
- scripts
- FRONTEND_SPEC.md
- F30 Rover-scale 3D scene at Dingo Gap (not built)
- core.test.ts
- CNSA (China)
- Briefing.tsx
- vercel.json
- App.tsx
- rovers.py
- engines
- Scene: Science stop (photos, Log sample)
- Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds)
- state.tsx
- data/globe terrain and imagery rasters (t0-t3, i0-i4)
- ui.tsx
- sheet.sh
- TESTING_STRATEGY.md
- Project graph: how Homeward fits together
- legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix
- ephemeris.ts
- zod
- lerc.d.ts
- build_facts.py
- Flight.tsx
- get
- IMPLEMENTATION_PLAN.md
- make.mjs
- voice.worker.ts
- Relive.tsx
- build_corpus.py
- common.py
- Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera)
- fetch-models.mjs
- ref_node_fs
- dose.ts
- lerc

## God Nodes (most connected - your core abstractions)
1. `docs/DATA_SPEC.md: data files, facts registry, provenance, licences` - 60 edges
2. `PRD.md: Homeward product requirements` - 45 edges
3. `BUILD_LOG.md: complete build record` - 37 edges
4. `homeward-dev skill (build, run, test, extend)` - 32 edges
5. `ReliveScene()` - 28 edges
6. `useRuntime()` - 25 edges
7. `SourceLink()` - 25 edges
8. `WalkScene()` - 24 edges
9. `README.md: Homeward context map, rules and decisions` - 24 edges
10. `PlanScene()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `F16 Measurement tools (partial)` --references--> `MeasurePanel()`  [INFERRED]
  PRD.md → app/src/scenes/Explore.tsx
- `3. The main paths through the app (checked against the code)` --references--> `Shell()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/App.tsx
- `3. The main paths through the app (checked against the code)` --references--> `ReliveScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Relive.tsx
- `3. The main paths through the app (checked against the code)` --references--> `WalkScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Walk.tsx
- `3. The main paths through the app (checked against the code)` --references--> `FactRow()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/ui/ui.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Five safety budgets checked along the planned timeline** — mental_model_life_support_budget, mental_model_walk_back_budget, mental_model_slope_budget, mental_model_daylight_budget, mental_model_radiation_budget, app_flow_approve_plan_gate [EXTRACTED 1.00]
- **Grounded assistant cascade: speech in, free brain chain, tools, offline rules, Kokoro voice** — tad_whisper, tad_assistant_relay, implementation_plan_provider_chain, feature_tickets_assistant_tool_registry, tad_offline_rules, tad_kokoro_voice [EXTRACTED 1.00]
- **Grounded voice assistant cascade: speech in, tool-grounded AI chain, Kokoro out, delayed Mission Control** — readme_speech_in, readme_ai_chain, readme_kokoro, readme_assistant, readme_mission_control, readme_d6, readme_d12 [EXTRACTED 1.00]
- **Version 2.0 decisions D15-D20 (Explore, Rover view, walking yourself)** — readme_d15, readme_d16, readme_d17, readme_d18, readme_d19, readme_d20, build_plan_2 [EXTRACTED 1.00]
- **Marswalk safety budgets: EVA limit, slope limit, walk-back rate, planner, Plan scene** — prd_f05, prd_eva_01, prd_eva_03, readme_eva_04, readme_d5, readme_scene_plan, app_src_core_planner [INFERRED 0.85]
- **Real-data provenance enforcement: facts.csv, facts registry, badges, sources, diagnostics, eval** — pipeline_facts, docs_data_spec_facts_registry, docs_data_spec_provenance_badges, docs_data_spec_data_sources, security_security_checklist_check_09_10_facts, docs_testing_strategy_assistant_eval [INFERRED 0.85]

## Communities (75 total, 10 thin omitted)

### Community 0 - "record.mjs"
Cohesion: 0.17
Nodes (10): FF, go(), OUT, record(), settle(), SHOTS, sunAt(), url() (+2 more)

### Community 1 - "make_rasters.py"
Cohesion: 0.16
Nodes (15): oc_to_og(), og_to_oc(), build(), dtm_url(), horn_slope(), local_relief(), to_xy(), blend_to_parent() (+7 more)

### Community 2 - "planner.ts"
Cohesion: 0.11
Nodes (27): gcrDoseMSv(), Breach, BreachCode, DEFAULTS, DX, DY, fmt(), Grid (+19 more)

### Community 3 - "raw.ts"
Cohesion: 0.07
Nodes (63): add(), azEl(), Cahv, cross(), css(), dot(), frameCentre(), frameMatrix() (+55 more)

### Community 4 - "assistant.ts"
Cohesion: 0.06
Nodes (52): hits, ipHash(), json(), log(), originAllowed(), rateLimit(), requestId(), resetRateLimits() (+44 more)

### Community 5 - "eval.test.ts"
Cohesion: 0.06
Nodes (42): ctx, Answer, ask(), Lang, Msg, Persona, a, allowed() (+34 more)

### Community 6 - "globe.ts"
Cohesion: 0.09
Nodes (32): ocToOg(), ogToOc(), toCesium(), createDem(), Dem, DEM_MAX_LEVEL, demTileAt(), sampleTile() (+24 more)

### Community 7 - "voice.ts"
Cohesion: 0.09
Nodes (18): loadWhisper(), Rec, SR, startListening(), toMono16k(), generate(), listeners, loadVoice() (+10 more)

### Community 8 - "FEATURE_TICKETS.md"
Cohesion: 0.20
Nodes (17): T00 Diagnostics script (done: 20 checks), T01 Scaffolding and pinned dependencies, T02 Mars24 time module, T03 Ephemeris and light time, T05 Data loader, schemas, facts by ID, T09 Planner panel, T11 Briefing panel, T13 Assistant relay with free provider chain (+9 more)

### Community 9 - "diagnostics.mjs"
Cohesion: 0.12
Nodes (11): End of every session: changelog, manifest, tests, typecheck, diagnostics, browser check, Diagnostics: 20 checks with fix hints, args, CI, P(), QUICK, read(), results (+3 more)

### Community 10 - "BUILD_LOG.md: complete build record"
Cohesion: 0.33
Nodes (14): Recovery prompts for a drifting AI (hallucination, context loss, conflicts, behaviour, emergency), BUILD_LOG.md: complete build record, build/MANIFEST.md: chunk status and cut list, build/PLAN-2.md: research, decisions D15-D20, chunks 10-16, CHANGELOG.md: session history and handoff, Open item: Esri terms for astro.arcgis.com tiles unconfirmed (fallback: Viking default layer), Open item: 200 m terrain at landing sites other than Gale, Session 3b (6 Nov 2026): documents to 2.0, licences, GitHub push (+6 more)

### Community 11 - "load.ts"
Cohesion: 0.12
Nodes (18): App(), DataError, Fact, Gazetteer, getJson(), Image, ImageryLayer, Lander (+10 more)

### Community 12 - "Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)"
Cohesion: 0.16
Nodes (17): Session 1 (28 Oct 2026): planning from the research paper, Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026), Allison and McEwen 2000: Mars solar time and seasons, Eight public competitor entries (Protikriti, Mars Traverse, MARSWAY, MarsNav and others), Murray Lab global CTX mosaic, 5 m, Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR), Where Mars is during the hackathon (computed: MY39, Ls 21.8, sunrise at Gale 13:47 IST), Mars24 algorithm (Mars solar time, sols, Ls) (+9 more)

### Community 13 - "T06 Mars viewer on own tiles and Gale camera"
Cohesion: 0.17
Nodes (18): EDL-01 Perseverance entry, descent and landing numbers, SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633), SITE-02 Science stop: Yellowknife Bay (John Klein, Cumberland), SITE-07 Ocentric-to-ographic latitude offset at Bradbury: 0.0543 deg, 3.21 km, T04 Frame conversion to Cesium, T06 Mars viewer on own tiles and Gale camera, T07 Terrain grid pipeline (2 m cells, Horn slope), T22 Descent and tuned sky (+10 more)

### Community 14 - "PRD.md: Homeward product requirements"
Cohesion: 0.10
Nodes (23): NASA Exploration EVA Concept of Operations 2020 (NTRS 20200001071), Suit limits: EVAs up to 8 hours, within 2 km (lunar-derived), Ranked feature list 1-18 with cut line (paper section 11), PRD.md: Homeward product requirements, EVA-01: life support lasts about 8 hours, EVA-03: suit slope limit of 20 degrees, F05 Marswalk planner with hard budgets and walk-back heat map, F15 Shareable URL and export (GeoJSON, CSV) (+15 more)

### Community 15 - "T08 Planner worker: walk-back field, A*, budgets"
Cohesion: 0.15
Nodes (21): EVA-01 EVA duration up to 8 h (NASA EVA ConOps 2020, lunar-derived), EVA-02 Walking radius 2 km from the lander, EVA-03 Suited slope capability up to 20 deg, EVA-04 Walk-back planning rate 3.3 km/h (Apollo 17), PLN-12 Horizon distance at 1.7 m eye height: 3.39 km, RAD-01 Surface dose rate at Gale: 0.64 mSv/day (Hassler et al. 2014), SND-01 Speed of sound on Mars: about 240-250 m/s; high pitches fade within about 8 m, Comfort settings (field of view, head bob, vignette, snap turn; not built) (+13 more)

### Community 16 - "SECURITY_ACCESS.md"
Cohesion: 0.23
Nodes (12): Deep-linkable URL hash state restored on reload or shared link, Plan persistence: URL hash is the source of truth, mirrored to localStorage homeward:plan:v1, Content-Security-Policy: own origin plus mars.nasa.gov, trek.nasa.gov and astro.arcgis.com; script-src self only, Input validation with zod (relay body, URL hash params, worker messages, tool calls, manifests), Model output is never executed: only known tool names with zod-valid arguments run (prompt-injection control), Rate limiting: 30 relay calls per IP per 10 minutes, in memory per function instance, Secrets: provider keys and ALLOWED_ORIGINS only in Vercel env and .env.local, never VITE_ prefixed, Threat model (keys, free-tier quotas, speech and questions, app integrity, model output, credibility, competition standing) (+4 more)

### Community 17 - "APP_FLOW.md"
Cohesion: 0.32
Nodes (13): Scene: Briefing (conditions and limits), Scene: Credits (every source by agency, AI disclosure), Scene: Debrief (plan versus actual, export, share), Scene: Descent to Gale, Scene: Explore (Google-Earth style globe, added 1 Nov 2026), Scene: Mars now / Mission clock, Scene: Orbit (true-scale Mars, Earth, moons), Scene: Plan (zone toggle, budgets, heat map, sliders) (+5 more)

### Community 18 - "Decisions on open questions Q1-Q7 (team answers, 28 Oct 2026)"
Cohesion: 0.23
Nodes (10): Session 1b (28 Oct 2026): open questions answered, plan revised, Cesium Mars (Cesium ion 3D Tiles), Judging criteria: Influence, Creativity, Validity, Relevance, Presentation, Challenge: Interplanetary Survival Guide, Martian Map, OpenAI Realtime API (paper's main voice choice; rejected as paid), Red Atlas (recommended design and working name), NASA Space Apps Challenge 2026 (14-15 Nov 2026), Decisions on open questions Q1-Q7 (team answers, 28 Oct 2026) (+2 more)

### Community 19 - "compilerOptions"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 20 - "Golden values: tests reproduce published NASA and ESA numbers (GISS Mars24 examples, landing light times)"
Cohesion: 0.38
Nodes (5): DATA-13 JPL approximate planetary elements (Table 1), DATA-14 Mars24 algorithm (Allison and McEwen 2000, NASA GISS), SITE-03 Straight-line habitat to stop: 443 m, TIME-05 One-way light time on 14 Nov 2026: 11.01 min (round trip 22.0 min), T15 Mission Control delay queue

### Community 21 - "docs/DATA_SPEC.md: data files, facts registry, provenance, licences"
Cohesion: 0.26
Nodes (15): docs/DATA_SPEC.md: data files, facts registry, provenance, licences, DATA-01 Own Mars tiles (planned terrain and imagery pyramids), DATA-03 HiRISE DTM DTEEC_010573_1755 (1 m, CC0), DATA-21 MOLA-HRSC Blended DEM Global 200 m v2, DATA-22 Viking Colorized Global Mosaic 232 m (MDIM 2.1), DATA-24 MSL Gale Merged Orthophoto Mosaic 25 cm, DATA-25 THEMIS thermal inertia mosaic, DATA-26 HiRISE DTMs over the boxwork site (+7 more)

### Community 22 - "TAD.md"
Cohesion: 0.27
Nodes (8): Assistant turn: push-to-talk, brain call, tools in the browser, answer with source chips, Kokoro voice, T16 Offline assistant, Assistant component (tool registry, brain client, speech in, Kokoro voice, captions, offline rules), Globe/Walk view (CesiumJS on Ellipsoid.MARS, orbit to eye level), Kokoro-82M voice (kokoro-js, generated on device), Offline rules brain: rules over the same tools, Per-level terrain and imagery rasters in data/globe sampled by a CustomHeightmapTerrainProvider (no tile pyramid), Whisper speech recognition in the browser (transformers.js, offline fallback for the Web Speech API)

### Community 23 - "package.json"
Cohesion: 0.12
Nodes (20): description, devDependencies, @types/react@19.3.0, @types/react-dom@19.3.0, typescript@7.0.2, @vercel/node@28.0.1, vite@8.3.5, @vitejs/plugin-react@6.1.2 (+12 more)

### Community 24 - "Explore.tsx"
Cohesion: 0.12
Nodes (34): Layers, fmtScale(), GeoMap, Identify, inside(), loadMaps(), mapsAt(), MapsFile (+26 more)

### Community 25 - "RAD radiation detector on Curiosity"
Cohesion: 0.18
Nodes (12): Hassler et al. 2014, Science: Mars surface radiation environment, 20 May 2024 solar storm: about 8,100 micrograys at Curiosity, Mars Climate Database v6.1 (LMD), RAD radiation detector on Curiosity, Surface radiation dose 0.64 mSv/day at Gale, REMS weather station on Curiosity, Spain's Centro de Astrobiologia (REMS, TWINS, MEDA), F04 Suit-up briefing (partial) (+4 more)

### Community 26 - "mars-time.ts"
Cohesion: 0.23
Nodes (20): jdTT(), jdUT(), LANDINGS, LEAPS, localSolar(), MarsTime, marsTime(), marsYear() (+12 more)

### Community 27 - "pipeline/corpus.md: discovery-card corpus"
Cohesion: 0.27
Nodes (10): Scene: Event (dust devil, solar-storm drill), EVT-01 Perseverance dust devil, 30 Aug 2023, Data pipeline steps (deterministic and idempotent: same inputs, same bytes out), RAD-05 Largest surface radiation event, 20 May 2024: about 8,100 micrograys, T23 Dust devil event, T29 Space-weather scenario (partial), pipeline/corpus.md: discovery-card corpus, Corpus card: Boxwork ridges on Mount Sharp (+2 more)

### Community 28 - "library.ts"
Cohesion: 0.24
Nodes (7): json(), LibraryPhoto, libraryPhotos(), loadLibrary(), PINNED, QUERY, Search

### Community 29 - "Demo walk: Bradbury Landing to Yellowknife Bay, 443 m"
Cohesion: 0.20
Nodes (11): Planner validation: Curiosity's sol 3-166 path is 100% walkable on the real HiRISE grid, Gale's ancient habitable lake, Gale Crater (recommended site), Grotzinger et al. 2014, Science: habitable lake at Yellowknife Bay, F07 Science stop at Yellowknife Bay, Bradbury Landing habitat start (SITE-01), Demo walk: Bradbury Landing to Yellowknife Bay, 443 m, MSL Gale Merged Orthophoto Mosaic, 25 cm (DATA-24) (+3 more)

### Community 30 - "Walk.tsx"
Cohesion: 0.12
Nodes (24): EARTH_MEAN_R_M, haversineM(), horizonM(), MARS_A_M, MARS_B_M, MARS_SPHERE_M, offsetM(), EYE_M (+16 more)

### Community 31 - "main.tsx"
Cohesion: 0.18
Nodes (7): Meta tags and JSON-LD WebApplication (og.png not made yet, so og:image removed), @fontsource-variable/inter@5.3.0, @fontsource-variable/jetbrains-mono@5.3.0, react-dom@19.3.1, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono, react-dom

### Community 32 - "Scene: Walk (walk it yourself, HUD, events, debrief)"
Cohesion: 0.22
Nodes (9): Apollo 17 traverse planning and walk-back paper, Immersive walkthrough, scenes 0-12 (paper section 12.7), Walk-back rule: Apollo planning rate 3.3 km/h, F06 First-person walk and HUD, F10 Dust devil crosses the route, EVA-04: Apollo walk-back rate 3.3 km/h (Tobler speed scaled to it), EVT-01: dust-devil event on the route, Scene: Plan (Marswalk planner with hard budgets) (+1 more)

### Community 33 - "NASA MMGIS rover waypoints and traverses"
Cohesion: 0.21
Nodes (13): Curiosity rover (Mars Science Laboratory), Ingenuity Mars helicopter, Mars Odyssey orbiter, Martian acoustics: sound speed 240-250 m/s, high pitches fade within 8 m, NASA MMGIS rover waypoints and traverses, NASA, Perseverance rover (Mars 2020), SuperCam microphone on Perseverance (first sounds of Mars) (+5 more)

### Community 34 - "Homeward films: script and plan"
Cohesion: 0.22
Nodes (8): 1. The one thing, 2. Three storylines (picked: A), 3. Look and sound, 4. Story film (2 min 20 s), 5. The 30-second film, 6. How it is made (all free, all on our machine), Homeward films: script and plan, Rebuild (about 20 minutes; do it after 09:00 on 14 Nov so the submitted film is made in the event window)

### Community 35 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, cesium:copy, dev, diag, models, preview, test (+1 more)

### Community 36 - "FRONTEND_SPEC.md"
Cohesion: 0.14
Nodes (14): app/src/styles/tokens.css: design tokens, Phrases for an AI assistant (setup, fix, UI, features, demo, deployment, emergency, status), npm run dev (app and API relay at localhost:5173), npm run diag / node scripts/diagnostics.mjs --base <url> (PASS/FAIL per check), npm run models (voice and speech models, about 130 MB, once), Badge colour tokens (--badge-live to --badge-generated), Colour tokens with measured WCAG contrast ratios, Track and ruler colour tokens (--color-track-msl, -m20, -heli, --color-measure) (+6 more)

### Community 37 - "F30 Rover-scale 3D scene at Dingo Gap (not built)"
Cohesion: 0.25
Nodes (8): Dingo Gap 3D Tiles demo (NASA-AMMOS 3DTilesRendererJS), DATA-23: JPL 3D terrain at Dingo Gap built from Curiosity's cameras, F29 Presence design (partial), F30 Rover-scale 3D scene at Dingo Gap (not built), PLN-12: real horizon distance 3.39 km at eye height, Dingo Gap, Curiosity sol 528 (SITE-08, SITE-09), Not built list (README section 13), PLN-13: sunlight 39% of Earth's on 14 Nov (light scaling not built)

### Community 38 - "core.test.ts"
Cohesion: 0.15
Nodes (15): Moon, moonPosition(), MoonTable, Orbiter, orbiterPosition(), OrbiterTable, statePosition(), at() (+7 more)

### Community 44 - "Briefing.tsx"
Cohesion: 0.19
Nodes (18): Arrival, donkiMs(), latestRems(), loadRems(), loadSpaceWeather(), num(), RemsSol, SpaceWeather (+10 more)

### Community 45 - "vercel.json"
Cohesion: 0.15
Nodes (9): npm run build then npm run preview (sends the vercel.json headers, CSP included), Security headers in vercel.json (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy microphone only, COOP), Diagnostics check 15: security headers, COOP/COEP and CSP host list enforced, buildCommand, headers, outputDirectory, ISOLATION, PRODUCTION (+1 more)

### Community 46 - "App.tsx"
Cohesion: 0.17
Nodes (20): STEPS, Dock(), Line, SUGGEST, speechMode(), onVoiceState(), stopVoice(), lightTimeMin() (+12 more)

### Community 47 - "rovers.py"
Cohesion: 0.16
Nodes (14): DATA-04 MSL waypoints from NASA MMGIS, data/places/gazetteer.json (2,051 IAU names from the USGS Gazetteer), data/rovers/cache: offline copies of four featured Rover view stops (8.1 MB), data/rovers: msl/m20 stops, tracks and Ingenuity flights (1,386 Curiosity and 708 Perseverance waypoints), Curiosity sol 3-166 path validation: at least 95% walkable under our rules (measured 100%), USGS Gazetteer of Planetary Nomenclature, write_json(), featured() (+6 more)

### Community 49 - "Scene: Science stop (photos, Log sample)"
Cohesion: 0.60
Nodes (5): Scene: Science stop (photos, Log sample), SCI-01 Gale habitable lake (Grotzinger et al. 2014), Optimistic rendering (log sample, add stop, toggle layer) with rollback, T12 Science stop card and sample log, Corpus card: Why Yellowknife Bay matters (habitable-lake)

### Community 50 - "Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds)"
Cohesion: 0.40
Nodes (5): data/manifest.json (222 files, 220.9 MB, SHA-256 per file), Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds), File schemas (Fact, Source, GridHeader, Stops, Track, Lander, Gazetteer, Manifest), zod-validated at load, Supply chain: exact dependency pins, models pinned to Hugging Face commits and hash-checked, npm audit, Diagnostics checks 09 and 10: every fact has a badge and known source; every source has https, licence and credit

### Community 51 - "state.tsx"
Cohesion: 0.15
Nodes (13): OVERLAY_IDS, Action, AppState, Ctx, IMAGERY, INITIAL, KEY, readInitial() (+5 more)

### Community 52 - "data/globe terrain and imagery rasters (t0-t3, i0-i4)"
Cohesion: 0.18
Nodes (11): data/globe terrain and imagery rasters (t0-t3, i0-i4), DLR (German Aerospace Center), ESA, HiRISE DTMs and orthoimages (USGS STAC), Mars Express (HRSC stereo camera), MOLA-HRSC blended DEM, 200 m, Mars Reconnaissance Orbiter (MRO), Schneegans et al. 2024, CGF: real-time atmospheres from Mie theory (+3 more)

### Community 53 - "ui.tsx"
Cohesion: 0.29
Nodes (14): heatCanvas(), Badge, css(), EarthAnalog(), PlanScene(), Slider(), Badge(), BADGE_HELP (+6 more)

### Community 55 - "TESTING_STRATEGY.md"
Cohesion: 0.20
Nodes (10): fold(), parseLatLon(), Place, searchPlaces(), all, npm test (vitest unit tests, golden NASA/ESA checks), Performance budgets (250 KB app JS, 30 fps walk, route under 300 ms, about 300 MB offline cache), CI: GitHub Actions (npm ci, typecheck, test, build, diag) (+2 more)

### Community 56 - "Project graph: how Homeward fits together"
Cohesion: 0.40
Nodes (4): 1. What is in it (13 Nov 2026), 2. Connection check (the team asked that every connection works), 4. Keeping it current, Project graph: how Homeward fits together

### Community 57 - "legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix"
Cohesion: 0.19
Nodes (13): Mars sky look checklist (butterscotch sky, small Sun, no faked sunset glow), Manual checklist before filming and submission, legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix, Apache-2.0 (CesiumJS, kokoro-js, Kokoro-82M, transformers.js), CC0-1.0 (HiRISE DTMs, MOLA), CC BY-SA 3.0 IGO (HRSC-derived terrain is share-alike), Esri OnMars hosting terms for CTX and HiRISE tiles (UNVERIFIED), Licence matrix for datasets and assets (+5 more)

### Community 58 - "ephemeris.ts"
Cohesion: 0.19
Nodes (18): AU_KM, C_KMS, cross(), directionFromMars(), dot(), earthElongation(), earthMarsDistanceAu(), eclipticToMarsFixed() (+10 more)

### Community 59 - "zod"
Cohesion: 0.20
Nodes (9): dependencies, @huggingface/transformers@3.8.1, kokoro-js@1.2.1, lucide-react@1.63.0, react@19.3.1, zod@4.6.7, @huggingface/transformers, kokoro-js (+1 more)

### Community 61 - "build_facts.py"
Cohesion: 0.16
Nodes (13): homeward-facts: workflow for adding a fact, source or data file, Source status labels: VERIFIED, SECONDARY, UNVERIFIED, data/places/landers.json, Claim labels: VERIFIED, SECONDARY, UNVERIFIED, RECOMMENDATION, COMPUTED, ASSUMPTION, main(), pipeline/facts.csv: facts registry source (id, value, unit, badge, sources), pipeline/landers.csv: lander coordinates with badge and sources, pipeline/sources.csv: source registry (id, url, licence, status) (+5 more)

### Community 62 - "Flight.tsx"
Cohesion: 0.23
Nodes (11): Shell(), load(), setAmbient(), incidentId(), loadOrbiters(), useNow(), DescentScene(), OrbitScene() (+3 more)

### Community 63 - "get"
Cohesion: 0.17
Nodes (8): Regenerate data: pipeline script order (snapshot, make_grid, make_rasters, make_moons, fetch_audio, rovers, build_facts, build_corpus, manifest), data/sky/moons.json (Phobos and Deimos hourly vectors from JPL Horizons), data/audio/supercam-sol001-wind.mp3 (Perseverance SuperCam microphone), get(), vectors(), images_for(), sol_record(), waypoints()

### Community 64 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.24
Nodes (8): 40-question assistant eval (right value, named source, zero unsupported numbers), Gemini API (gemini-3.8-flash, free tier), Groq (openai/gpt-oss-120b, free tier), OpenRouter (openrouter/free models), AI disclosure (Claude-written code, assistant brains, Kokoro voice, Whisper; stock voices only, never presented as NASA), Space Apps no-early-work rule and the status of the early build (section 1.1), 30-second film plan, Risk register (Wi-Fi, quotas, licences, frame mix-up, early-work rule)

### Community 65 - "make.mjs"
Cohesion: 0.20
Nodes (12): build(), C, chunks(), DATASETS, dur(), lines, OUT, SHORT (+4 more)

### Community 66 - "voice.worker.ts"
Cohesion: 0.24
Nodes (9): app/public/sw.js: offline service worker, load(), Msg, seedVoiceCache(), Bugs 11-12: Kokoro failed in dev and froze the globe; moved to a Web Worker, Bug 13: service worker precached 211 MB at install; new caching strategy, Session 2 (29 Oct 2026): build, test, refine (version 1.0), F20 Offline mode (+1 more)

### Community 67 - "Relive.tsx"
Cohesion: 0.35
Nodes (10): bearingDeg(), placeable(), resolveStop(), clamp(), FEATURED, Lightbox(), Minimap(), ReliveScene() (+2 more)

### Community 68 - "build_corpus.py"
Cohesion: 0.29
Nodes (4): main(), vectors(), main(), scale()

### Community 70 - "Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera)"
Cohesion: 0.36
Nodes (5): Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera), Diagnostics check 18: startup JavaScript budget (scenes must not import Cesium), Measured values (startup JS 140 KB gzip, offline payload 220.9 MB, frame rate not yet measured on the weakest laptop), Rendering quality presets (High, Medium, Low; automatic drop after 10 s under 20 fps), Diagnostics check 20: no control characters in source (heredoc backspace trap)

### Community 71 - "fetch-models.mjs"
Cohesion: 0.25
Nodes (3): expected, MODELS, ORT_FILES

### Community 72 - "ref_node_fs"
Cohesion: 0.29
Nodes (3): dir, lines, speed

### Community 73 - "dose.ts"
Cohesion: 0.40
Nodes (4): CRUISE_MSV_PER_DAY, missionDoseMSv(), SURFACE_MSV_PER_DAY, Core: pure tested TypeScript (mars-time, ephemeris, frames, dose, planner)

## Knowledge Gaps
- **28 isolated node(s):** `npm run dev (app and API relay at localhost:5173)`, `ESA`, `Allison and McEwen 2000: Mars solar time and seasons`, `F17 Water and ice overlay (not built)`, `F24 Journey prologue (not built)` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 287 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BUILD_LOG.md: complete build record` connect `BUILD_LOG.md: complete build record` to `planner.ts`, `assistant.ts`, `eval.test.ts`, `voice.ts`, `FEATURE_TICKETS.md`, `load.ts`, `PRD.md: Homeward product requirements`, `SECURITY_ACCESS.md`, `APP_FLOW.md`, `compilerOptions`, `TAD.md`, `FRONTEND_SPEC.md`, `App.tsx`, `data/globe terrain and imagery rasters (t0-t3, i0-i4)`, `legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix`, `get`, `IMPLEMENTATION_PLAN.md`, `voice.worker.ts`, `common.py`, `Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera)`, `ref_node_fs`?**
  _High betweenness centrality (0.102) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ReliveScene()` (e.g. with `placeable()` and `3. The main paths through the app (checked against the code)`) actually correct?**
  _`ReliveScene()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npm run dev (app and API relay at localhost:5173)`, `ESA`, `Allison and McEwen 2000: Mars solar time and seasons` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `planner.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.10873440285204991 - nodes in this community are weakly interconnected._
- **Why does `PRD.md: Homeward product requirements` connect `PRD.md: Homeward product requirements` to `raw.ts`, `eval.test.ts`, `BUILD_LOG.md: complete build record`, `Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)`, `Decisions on open questions Q1-Q7 (team answers, 28 Oct 2026)`, `docs/DATA_SPEC.md: data files, facts registry, provenance, licences`, `RAD radiation detector on Curiosity`, `mars-time.ts`, `Demo walk: Bradbury Landing to Yellowknife Bay, 443 m`, `Scene: Walk (walk it yourself, HUD, events, debrief)`, `NASA MMGIS rover waypoints and traverses`, `F30 Rover-scale 3D scene at Dingo Gap (not built)`, `core.test.ts`, `data/globe terrain and imagery rasters (t0-t3, i0-i4)`, `legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix`, `ephemeris.ts`, `build_facts.py`, `IMPLEMENTATION_PLAN.md`, `voice.worker.ts`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `raw.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06625258799171843 - nodes in this community are weakly interconnected._
- **Why does `homeward-dev skill (build, run, test, extend)` connect `BUILD_LOG.md: complete build record` to `make_rasters.py`, `planner.ts`, `raw.ts`, `globe.ts`, `package.json`, `Explore.tsx`, `mars-time.ts`, `Walk.tsx`, `core.test.ts`, `rovers.py`, `state.tsx`, `TESTING_STRATEGY.md`, `ephemeris.ts`, `build_facts.py`, `get`, `voice.worker.ts`, `Relive.tsx`, `build_corpus.py`, `common.py`, `dose.ts`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._