# Graph Report - martian-map-explorer-3f8c3e  (2026-11-15)

## Corpus Check
- 124 files · ~146,021 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 13 file(s) not represented in the graph (top: (none) 6, .csv 3, .example 1)

## Summary
- 1235 nodes · 3380 edges · 67 communities (58 shown, 9 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 411 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bed0b51d`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record.mjs
- make_rasters.py
- planner.ts
- Rover view: photos and camera models
- API relay and health
- eval.test.ts
- globe.ts
- voice.ts
- FEATURE_TICKETS.md
- diagnostics.mjs
- homeward-dev skill (build, run, test, extend)
- Data loading and place search
- Scene: Explore (Google-Earth style globe)
- mars-time.ts
- Requirements and traceability
- T08 Planner worker: walk-back field, A*, budgets
- ephemeris.ts
- Scene flow (APP_FLOW)
- Naming and early decisions
- TypeScript config
- TESTING_STRATEGY.md
- Licences and compliance
- IMPLEMENTATION_PLAN.md
- Dev dependencies
- Explore.tsx
- Curiosity, Gale, REMS and RAD
- Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)
- pipeline/corpus.md: discovery-card corpus
- moons.ts
- tools.ts
- Walk.tsx
- dependencies
- F05 Marswalk planner with hard budgets and walk-back heat map
- Perseverance, descent and sound
- Homeward films: script and plan
- npm scripts
- FRONTEND_SPEC.md
- Presence and Dingo Gap (not built)
- Homeward
- Zhurong (CNSA)
- Briefing.tsx
- vercel.json
- App.tsx
- usgs.ts
- package.json
- speech.ts
- offline.ts
- state.tsx
- Dock.tsx
- Plan.tsx
- sheet.sh
- Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)
- Project graph: how Homeward fits together
- core.test.ts
- brain.ts
- ocToOg
- lerc.d.ts
- layers.ts
- voice.worker.ts
- TEAMMATE_GUIDE.md
- lerc
- BUILD_LOG.md: complete build record

## God Nodes (most connected - your core abstractions)
1. `docs/DATA_SPEC.md: data files, facts registry, provenance, licences` - 60 edges
2. `PRD.md: Homeward product requirements` - 45 edges
3. `BUILD_LOG.md: complete build record` - 37 edges
4. `homeward-dev skill (build, run, test, extend)` - 32 edges
5. `ReliveScene()` - 28 edges
6. `WalkScene()` - 25 edges
7. `useRuntime()` - 25 edges
8. `SourceLink()` - 25 edges
9. `README.md: Homeward context map, rules and decisions` - 24 edges
10. `PlanScene()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `F16 Measurement tools (partial)` --references--> `MeasurePanel()`  [INFERRED]
  PRD.md → app/src/scenes/Explore.tsx
- `Bugs 8-9: walk-back field took 1,861 ms and Dijkstra skipped nodes; typed-array heap, 121 ms` --references--> `Heap`  [INFERRED]
  BUILD_LOG.md → app/src/core/planner.ts
- `Bugs 8-9: walk-back field took 1,861 ms and Dijkstra skipped nodes; typed-array heap, 121 ms` --references--> `timeHomeField()`  [INFERRED]
  BUILD_LOG.md → app/src/core/planner.ts
- `3. The main paths through the app (checked against the code)` --references--> `ReliveScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Relive.tsx
- `3. The main paths through the app (checked against the code)` --references--> `WalkScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Walk.tsx

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Five safety budgets checked along the planned timeline** — mental_model_life_support_budget, mental_model_walk_back_budget, mental_model_slope_budget, mental_model_daylight_budget, mental_model_radiation_budget, app_flow_approve_plan_gate [EXTRACTED 1.00]
- **Grounded assistant cascade: speech in, free brain chain, tools, offline rules, Kokoro voice** — tad_whisper, tad_assistant_relay, implementation_plan_provider_chain, feature_tickets_assistant_tool_registry, tad_offline_rules, tad_kokoro_voice [EXTRACTED 1.00]
- **Grounded voice assistant cascade: speech in, tool-grounded AI chain, Kokoro out, delayed Mission Control** — readme_speech_in, readme_ai_chain, readme_kokoro, readme_assistant, readme_mission_control, readme_d6, readme_d12 [EXTRACTED 1.00]
- **Version 2.0 decisions D15-D20 (Explore, Rover view, walking yourself)** — readme_d15, readme_d16, readme_d17, readme_d18, readme_d19, readme_d20, build_plan_2 [EXTRACTED 1.00]
- **Marswalk safety budgets: EVA limit, slope limit, walk-back rate, planner, Plan scene** — prd_f05, prd_eva_01, prd_eva_03, readme_eva_04, readme_d5, readme_scene_plan, app_src_core_planner [INFERRED 0.85]
- **Real-data provenance enforcement: facts.csv, facts registry, badges, sources, diagnostics, eval** — pipeline_facts, docs_data_spec_facts_registry, docs_data_spec_provenance_badges, docs_data_spec_data_sources, security_security_checklist_check_09_10_facts, docs_testing_strategy_assistant_eval [INFERRED 0.85]

## Communities (67 total, 9 thin omitted)

### Community 0 - "record.mjs"
Cohesion: 0.09
Nodes (22): build(), C, chunks(), DATASETS, dur(), lines, OUT, SHORT (+14 more)

### Community 1 - "make_rasters.py"
Cohesion: 0.05
Nodes (43): Planner grids, 2 m cells: slope, relief, elevation (site/gale, site/boxwork), Regenerate data: pipeline script order (snapshot, make_grid, make_rasters, make_moons, fetch_audio, rovers, build_facts, build_corpus, manifest), DATA-04 MSL waypoints from NASA MMGIS, data/places/gazetteer.json (2,051 IAU names from the USGS Gazetteer), data/sky/moons.json (Phobos and Deimos hourly vectors from JPL Horizons), Data pipeline steps (deterministic and idempotent: same inputs, same bytes out), data/rovers/cache: offline copies of four featured Rover view stops (8.1 MB), data/rovers: msl/m20 stops, tracks and Ingenuity flights (1,386 Curiosity and 708 Perseverance waypoints) (+35 more)

### Community 2 - "planner.ts"
Cohesion: 0.12
Nodes (25): gcrDoseMSv(), Breach, BreachCode, DEFAULTS, DX, DY, fmt(), Grid (+17 more)

### Community 3 - "Rover view: photos and camera models"
Cohesion: 0.06
Nodes (63): add(), azEl(), Cahv, cross(), css(), dot(), frameCentre(), frameMatrix() (+55 more)

### Community 4 - "API relay and health"
Cohesion: 0.06
Nodes (47): hits, ipHash(), json(), log(), originAllowed(), rateLimit(), requestId(), resetRateLimits() (+39 more)

### Community 5 - "eval.test.ts"
Cohesion: 0.12
Nodes (17): a, allowed(), CASES, corpus, ctx(), data, facts, field (+9 more)

### Community 6 - "globe.ts"
Cohesion: 0.10
Nodes (26): ocToOg(), ogToOc(), toCesium(), createDem(), Dem, DEM_MAX_LEVEL, demTileAt(), sampleTile() (+18 more)

### Community 7 - "voice.ts"
Cohesion: 0.17
Nodes (13): generate(), listeners, loadVoice(), Out, pending, play(), setState(), speak() (+5 more)

### Community 8 - "FEATURE_TICKETS.md"
Cohesion: 0.13
Nodes (31): Deep-linkable URL hash state restored on reload or shared link, EDL-01 Perseverance entry, descent and landing numbers, SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633), SITE-02 Science stop: Yellowknife Bay (John Klein, Cumberland), SITE-07 Ocentric-to-ographic latitude offset at Bradbury: 0.0543 deg, 3.21 km, Plan persistence: URL hash is the source of truth, mirrored to localStorage homeward:plan:v1, T00 Diagnostics script (done: 20 checks), T01 Scaffolding and pinned dependencies (+23 more)

### Community 9 - "diagnostics.mjs"
Cohesion: 0.06
Nodes (22): End of every session: changelog, manifest, tests, typecheck, diagnostics, browser check, data/manifest.json (222 files, 220.9 MB, SHA-256 per file), Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds), File schemas (Fact, Source, GridHeader, Stops, Track, Lander, Gazetteer, Manifest), zod-validated at load, Supply chain: exact dependency pins, models pinned to Hugging Face commits and hash-checked, npm audit, dir, lines, speed (+14 more)

### Community 10 - "homeward-dev skill (build, run, test, extend)"
Cohesion: 0.18
Nodes (17): Recovery prompts for a drifting AI (hallucination, context loss, conflicts, behaviour, emergency), build/MANIFEST.md: chunk status and cut list, CHANGELOG.md: session history and handoff, Open item: Esri terms for astro.arcgis.com tiles unconfirmed (fallback: Viking default layer), Open item: 200 m terrain at landing sites other than Gale, Session 3b (6 Nov 2026): documents to 2.0, licences, GitHub push, Session 3c (7 Nov 2026): handoff, CLAUDE.md: session entry point (+9 more)

### Community 11 - "Data loading and place search"
Cohesion: 0.13
Nodes (16): DataError, Fact, Gazetteer, getJson(), GridHeader, Image, ImageryLayer, Lander (+8 more)

### Community 12 - "Scene: Explore (Google-Earth style globe)"
Cohesion: 0.12
Nodes (21): Murray Lab global CTX mosaic, 5 m, DLR (German Aerospace Center), ESA, HiRISE DTMs and orthoimages (USGS STAC), Mars Express (HRSC stereo camera), Mars Odyssey orbiter, Mars Climate Database v6.1 (LMD), MOLA-HRSC blended DEM, 200 m (+13 more)

### Community 13 - "mars-time.ts"
Cohesion: 0.22
Nodes (19): jdTT(), jdUT(), LANDINGS, LEAPS, localSolar(), MarsTime, marsTime(), marsYear() (+11 more)

### Community 14 - "Requirements and traceability"
Cohesion: 0.09
Nodes (26): NASA Exploration EVA Concept of Operations 2020 (NTRS 20200001071), Suit limits: EVAs up to 8 hours, within 2 km (lunar-derived), Ranked feature list 1-18 with cut line (paper section 11), PRD.md: Homeward product requirements, EVA-01: life support lasts about 8 hours, EVA-03: suit slope limit of 20 degrees, F05 Marswalk planner with hard budgets and walk-back heat map, F13 Credits panel (+18 more)

### Community 15 - "T08 Planner worker: walk-back field, A*, budgets"
Cohesion: 0.14
Nodes (22): EVA-01 EVA duration up to 8 h (NASA EVA ConOps 2020, lunar-derived), EVA-02 Walking radius 2 km from the lander, EVA-03 Suited slope capability up to 20 deg, EVA-04 Walk-back planning rate 3.3 km/h (Apollo 17), PLN-12 Horizon distance at 1.7 m eye height: 3.39 km, RAD-01 Surface dose rate at Gale: 0.64 mSv/day (Hassler et al. 2014), SND-01 Speed of sound on Mars: about 240-250 m/s; high pitches fade within about 8 m, Comfort settings (field of view, head bob, vignette, snap turn; not built) (+14 more)

### Community 16 - "ephemeris.ts"
Cohesion: 0.21
Nodes (17): AU_KM, C_KMS, cross(), directionFromMars(), dot(), earthElongation(), earthMarsDistanceAu(), eclipticToMarsFixed() (+9 more)

### Community 17 - "Scene flow (APP_FLOW)"
Cohesion: 0.27
Nodes (15): Scene: Briefing (conditions and limits), Scene: Credits (every source by agency, AI disclosure), Scene: Debrief (plan versus actual, export, share), Scene: Descent to Gale, Scene: Explore (Google-Earth style globe, added 1 Nov 2026), Scene: Mars now / Mission clock, Scene: Orbit (true-scale Mars, Earth, moons), Scene: Plan (zone toggle, budgets, heat map, sliders) (+7 more)

### Community 18 - "Naming and early decisions"
Cohesion: 0.16
Nodes (12): Session 1b (28 Oct 2026): open questions answered, plan revised, Cesium Mars (Cesium ion 3D Tiles), Rules: no early work, AI disclosure, no NASA logos, cite every source, Eight public competitor entries (Protikriti, Mars Traverse, MARSWAY, MarsNav and others), Judging criteria: Influence, Creativity, Validity, Relevance, Presentation, Challenge: Interplanetary Survival Guide, Martian Map, OpenAI Realtime API (paper's main voice choice; rejected as paid), Red Atlas (recommended design and working name) (+4 more)

### Community 19 - "TypeScript config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 20 - "TESTING_STRATEGY.md"
Cohesion: 0.15
Nodes (13): npm test (vitest unit tests, golden NASA/ESA checks), Mars sky look checklist (butterscotch sky, small Sun, no faked sunset glow), DATA-13 JPL approximate planetary elements (Table 1), DATA-14 Mars24 algorithm (Allison and McEwen 2000, NASA GISS), SITE-03 Straight-line habitat to stop: 443 m, TIME-05 One-way light time on 14 Nov 2026: 11.01 min (round trip 22.0 min), Performance budgets (250 KB app JS, 30 fps walk, route under 300 ms, about 300 MB offline cache), CI: GitHub Actions (npm ci, typecheck, test, build, diag) (+5 more)

### Community 21 - "Licences and compliance"
Cohesion: 0.16
Nodes (25): docs/DATA_SPEC.md: data files, facts registry, provenance, licences, DATA-01 Own Mars tiles (planned terrain and imagery pyramids), DATA-03 HiRISE DTM DTEEC_010573_1755 (1 m, CC0), DATA-21 MOLA-HRSC Blended DEM Global 200 m v2, DATA-22 Viking Colorized Global Mosaic 232 m (MDIM 2.1), DATA-24 MSL Gale Merged Orthophoto Mosaic 25 cm, DATA-25 THEMIS thermal inertia mosaic, DATA-26 HiRISE DTMs over the boxwork site (+17 more)

### Community 22 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.12
Nodes (18): First-time experience and microphone permission gate (text input always available), Error boundaries per scene, per panel, globe and assistant, ?debug=1 overlay (fps, planner timings, manifest dates, last provider, log lines), Error classification (UserError, OriginError, RateLimited, ExternalError, SystemError, DataError), Incident ID with Copy error report (the whole error-tracking system for v1), Structured JSON log format (requestId, ipHash, provider, fallbacks; never question or answer text), Circuit breaker (3 failures skips a provider for 60 s) and 8 s provider timeout, Gemini API (gemini-3.8-flash, free tier) (+10 more)

### Community 23 - "Dev dependencies"
Cohesion: 0.14
Nodes (14): devDependencies, @types/react@19.3.0, @types/react-dom@19.3.0, typescript@7.0.2, @vercel/node@28.0.1, vite@8.3.5, @vitejs/plugin-react@6.1.2, vitest@5.0.5 (+6 more)

### Community 24 - "Explore.tsx"
Cohesion: 0.12
Nodes (27): bearingDeg(), incidentId(), hasLibrary(), loadLibrary(), loadStops(), loadTrack(), placeable(), resolveStop() (+19 more)

### Community 25 - "Curiosity, Gale, REMS and RAD"
Cohesion: 0.12
Nodes (20): Curiosity rover (Mars Science Laboratory), Dingo Gap 3D Tiles demo (NASA-AMMOS 3DTilesRendererJS), Gale's ancient habitable lake, Gale Crater (recommended site), Grotzinger et al. 2014, Science: habitable lake at Yellowknife Bay, Hassler et al. 2014, Science: Mars surface radiation environment, RAD radiation detector on Curiosity, Surface radiation dose 0.64 mSv/day at Gale (+12 more)

### Community 26 - "Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)"
Cohesion: 0.32
Nodes (8): Session 1 (28 Oct 2026): planning from the research paper, Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026), Allison and McEwen 2000: Mars solar time and seasons, Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR), Where Mars is during the hackathon (computed: MY39, Ls 21.8, sunrise at Gale 13:47 IST), Mars24 algorithm (Mars solar time, sols, Ls), Earth-Mars radio delay (11.0 min one way on 14 Nov 2026), Errata found in the research paper (README section 10)

### Community 27 - "pipeline/corpus.md: discovery-card corpus"
Cohesion: 0.20
Nodes (14): Scene: Event (dust devil, solar-storm drill), Scene: Science stop (photos, Log sample), EVT-01 Perseverance dust devil, 30 Aug 2023, RAD-05 Largest surface radiation event, 20 May 2024: about 8,100 micrograys, SCI-01 Gale habitable lake (Grotzinger et al. 2014), Optimistic rendering (log sample, add stop, toggle layer) with rollback, T12 Science stop card and sample log, T23 Dust devil event (+6 more)

### Community 28 - "moons.ts"
Cohesion: 0.16
Nodes (16): Vec3, Moon, moonPosition(), MoonTable, Orbiter, orbiterPosition(), OrbiterTable, statePosition() (+8 more)

### Community 29 - "tools.ts"
Cohesion: 0.13
Nodes (13): empty, NO_PLAN, noArgs, Tool, ToolResult, TOOLS, Card, Zone (+5 more)

### Community 30 - "Walk.tsx"
Cohesion: 0.11
Nodes (27): load(), setAmbient(), EARTH_MEAN_R_M, FLY_MAX_M, FLY_MIN_M, flyStep(), haversineM(), horizonM() (+19 more)

### Community 31 - "dependencies"
Cohesion: 0.18
Nodes (7): Meta tags and JSON-LD WebApplication (og.png not made yet, so og:image removed), @fontsource-variable/inter@5.3.0, @fontsource-variable/jetbrains-mono@5.3.0, react-dom@19.3.1, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono, react-dom

### Community 32 - "F05 Marswalk planner with hard budgets and walk-back heat map"
Cohesion: 0.18
Nodes (12): Apollo 17 traverse planning and walk-back paper, 20 May 2024 solar storm: about 8,100 micrograys at Curiosity, Immersive walkthrough, scenes 0-12 (paper section 12.7), Walk-back rule: Apollo planning rate 3.3 km/h, F06 First-person walk and HUD, F10 Dust devil crosses the route, F18 Space-weather scenario forcing a shelter decision (partial), EVA-04: Apollo walk-back rate 3.3 km/h (Tobler speed scaled to it) (+4 more)

### Community 33 - "Perseverance, descent and sound"
Cohesion: 0.31
Nodes (9): Ingenuity Mars helicopter, Martian acoustics: sound speed 240-250 m/s, high pitches fade within 8 m, Perseverance rover (Mars 2020), SuperCam microphone on Perseverance (first sounds of Mars), F03 Descent to Gale, F19 Martian sound engine (partial), EDL-01: Perseverance's real entry numbers, Scene: Descent to Bradbury Landing (+1 more)

### Community 34 - "Homeward films: script and plan"
Cohesion: 0.22
Nodes (8): 1. The one thing, 2. Three storylines (picked: A), 3. Look and sound, 4. Story film (2 min 20 s), 5. The 30-second film (29.5 s), 6. How it is made (all free, all on our machine), Homeward films: script and plan, Rebuild (about 20 minutes; do it after 09:00 on 14 Nov so the submitted film is made in the event window)

### Community 35 - "npm scripts"
Cohesion: 0.22
Nodes (9): scripts, build, cesium:copy, dev, diag, models, preview, test (+1 more)

### Community 36 - "FRONTEND_SPEC.md"
Cohesion: 0.22
Nodes (8): app/src/styles/tokens.css: design tokens, Badge colour tokens (--badge-live to --badge-generated), Colour tokens with measured WCAG contrast ratios, Track and ruler colour tokens (--color-track-msl, -m20, -heli, --color-measure), Calm-cockpit rules (one primary HUD number, every warning comes with the next action), Design direction: a scientist's instrument over a real planet (quiet glass panels, one butterscotch accent), Explore layout: map-app globe with 44 px glass controls, cursor pill, track legend, Accessibility checklist (WCAG 2.2 AA)

### Community 37 - "Presence and Dingo Gap (not built)"
Cohesion: 0.29
Nodes (7): DATA-23: JPL 3D terrain at Dingo Gap built from Curiosity's cameras, F29 Presence design (partial), F30 Rover-scale 3D scene at Dingo Gap (not built), PLN-12: real horizon distance 3.39 km at eye height, Dingo Gap, Curiosity sol 528 (SITE-08, SITE-09), Not built list (README section 13), PLN-13: sunlight 39% of Earth's on 14 Nov (light scaling not built)

### Community 38 - "Homeward"
Cohesion: 0.12
Nodes (15): 10. Errata found in the research paper, 11. Diagnostics, 12. UI flexibility, 13. As built (14 Nov 2026, version 4.0), 14. Run, test and deploy, 1. Identity, 2. The demo walk, in real numbers, 3. Session protocol (every AI, every session) (+7 more)

### Community 44 - "Briefing.tsx"
Cohesion: 0.24
Nodes (13): Arrival, donkiMs(), latestRems(), loadRems(), loadSpaceWeather(), num(), RemsSol, SpaceWeather (+5 more)

### Community 45 - "vercel.json"
Cohesion: 0.15
Nodes (10): Session 3 bug 11: globe never started under production CSP (Cesium Viewer needs unsafe-eval); CesiumWidget, Session 3 (1 Nov 2026): Explore, Rover view, walk yourself (version 2.0), npm run build then npm run preview (sends the vercel.json headers, CSP included), Security headers in vercel.json (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy microphone only, COOP), buildCommand, headers, outputDirectory, ISOLATION (+2 more)

### Community 46 - "App.tsx"
Cohesion: 0.13
Nodes (19): App(), STEPS, Badge, Data, loadData(), MarsGlobe, EventKind, Runtime (+11 more)

### Community 47 - "usgs.ts"
Cohesion: 0.27
Nodes (11): fmtScale(), GeoMap, Identify, inside(), loadMaps(), mapsAt(), MapsFile, parseUnit() (+3 more)

### Community 48 - "package.json"
Cohesion: 0.22
Nodes (8): description, engines, node, license, name, private, type, version

### Community 49 - "speech.ts"
Cohesion: 0.26
Nodes (10): Assistant turn: push-to-talk, brain call, tools in the browser, answer with source chips, Kokoro voice, loadWhisper(), Rec, SR, startListening(), toMono16k(), T16 Offline assistant, Assistant component (tool registry, brain client, speech in, Kokoro voice, captions, offline rules) (+2 more)

### Community 50 - "offline.ts"
Cohesion: 0.24
Nodes (8): ctx, answerOffline(), INTENTS, Out, searchCorpus(), ToolCtx, Bug 23: regex word boundaries became raw backspace bytes via shell heredocs, check_extra_time assistant tool (extend the stop)

### Community 51 - "state.tsx"
Cohesion: 0.14
Nodes (14): Settings, OVERLAY_IDS, Action, AppState, Ctx, IMAGERY, INITIAL, KEY (+6 more)

### Community 52 - "Dock.tsx"
Cohesion: 0.33
Nodes (9): Dock(), Line, SUGGEST, speechMode(), onVoiceState(), stopVoice(), lightTimeMin(), planOk() (+1 more)

### Community 53 - "Plan.tsx"
Cohesion: 0.21
Nodes (32): Shell(), heatCanvas(), Layers, loadOrbiters(), useRuntime(), BriefingScene(), ClockScene(), useNow() (+24 more)

### Community 55 - "Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)"
Cohesion: 0.43
Nodes (5): fold(), parseLatLon(), Place, searchPlaces(), all

### Community 56 - "Project graph: how Homeward fits together"
Cohesion: 0.40
Nodes (4): 1. What is in it (13 Nov 2026), 2. Connection check (the team asked that every connection works), 4. Keeping it current, Project graph: how Homeward fits together

### Community 57 - "core.test.ts"
Cohesion: 0.25
Nodes (4): CRUISE_MSV_PER_DAY, missionDoseMSv(), SURFACE_MSV_PER_DAY, Core: pure tested TypeScript (mars-time, ephemeris, frames, dose, planner)

### Community 58 - "brain.ts"
Cohesion: 0.33
Nodes (6): Answer, ask(), Lang, Msg, Persona, toolSchemas()

### Community 59 - "ocToOg"
Cohesion: 0.22
Nodes (9): dependencies, cesium@1.146.0, @huggingface/transformers@3.8.1, kokoro-js@1.2.1, lucide-react@1.63.0, react@19.3.1, zod@4.6.7, @huggingface/transformers (+1 more)

### Community 61 - "layers.ts"
Cohesion: 0.18
Nodes (10): homeward-facts: workflow for adding a fact, source or data file, Source status labels: VERIFIED, SECONDARY, UNVERIFIED, data/places/landers.json, Claim labels: VERIFIED, SECONDARY, UNVERIFIED, RECOMMENDATION, COMPUTED, ASSUMPTION, main(), pipeline/facts.csv: facts registry source (id, value, unit, badge, sources), pipeline/landers.csv: lander coordinates with badge and sources, pipeline/sources.csv: source registry (id, url, licence, status) (+2 more)

### Community 63 - "voice.worker.ts"
Cohesion: 0.16
Nodes (13): app/public/sw.js: offline service worker, load(), Msg, seedVoiceCache(), Session 3 bug 5: far-side lander pins showed through Mars; depth test skipped only within 300 km, Bug 5: hidden browser pane pauses animation frames; timer fallback on flights, Bugs 11-12: Kokoro failed in dev and froze the globe; moved to a Web Worker, Session 3 bug 9: startup JS 1,229 KB after Explore imported Cesium; split into live.ts and globe.cam (+5 more)

### Community 64 - "TEAMMATE_GUIDE.md"
Cohesion: 0.40
Nodes (4): 40-question assistant eval (right value, named source, zero unsupported numbers), T17 Assistant 40-question eval (offline brain 40/40), Space Apps no-early-work rule and the status of the early build (section 1.1), Risk register (Wi-Fi, quotas, licences, frame mix-up, early-work rule)

### Community 70 - "BUILD_LOG.md: complete build record"
Cohesion: 0.12
Nodes (24): Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera), BUILD_LOG.md: complete build record, build/PLAN-2.md: research, decisions D15-D20, chunks 10-16, Feature flags as a plain constant object (switch off P1/P2 features in an emergency), Content-Security-Policy: own origin plus mars.nasa.gov, trek.nasa.gov and astro.arcgis.com; script-src self only, Input validation with zod (relay body, URL hash params, worker messages, tool calls, manifests), Model output is never executed: only known tool names with zod-valid arguments run (prompt-injection control), Origin allow-list and CORS (ALLOWED_ORIGINS, no wildcards, no credentials) (+16 more)

## Knowledge Gaps
- **28 isolated node(s):** `Feature flags as a plain constant object (switch off P1/P2 features in an emergency)`, `Allison and McEwen 2000: Mars solar time and seasons`, `F17 Water and ice overlay (not built)`, `F24 Journey prologue (not built)`, `F25 More route weather: dusk clouds, frost, storm warning (not built)` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 303 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BUILD_LOG.md: complete build record` connect `BUILD_LOG.md: complete build record` to `make_rasters.py`, `planner.ts`, `API relay and health`, `globe.ts`, `FEATURE_TICKETS.md`, `diagnostics.mjs`, `homeward-dev skill (build, run, test, extend)`, `Data loading and place search`, `Requirements and traceability`, `Scene flow (APP_FLOW)`, `TypeScript config`, `Licences and compliance`, `IMPLEMENTATION_PLAN.md`, `FRONTEND_SPEC.md`, `speech.ts`, `offline.ts`, `Dock.tsx`, `brain.ts`, `voice.worker.ts`, `TEAMMATE_GUIDE.md`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ReliveScene()` (e.g. with `placeable()` and `3. The main paths through the app (checked against the code)`) actually correct?**
  _`ReliveScene()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Feature flags as a plain constant object (switch off P1/P2 features in an emergency)`, `Allison and McEwen 2000: Mars solar time and seasons`, `F17 Water and ice overlay (not built)` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.09113300492610837 - nodes in this community are weakly interconnected._
- **Why does `PRD.md: Homeward product requirements` connect `Requirements and traceability` to `Rover view: photos and camera models`, `homeward-dev skill (build, run, test, extend)`, `Scene: Explore (Google-Earth style globe)`, `mars-time.ts`, `ephemeris.ts`, `Naming and early decisions`, `Licences and compliance`, `IMPLEMENTATION_PLAN.md`, `Curiosity, Gale, REMS and RAD`, `Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)`, `moons.ts`, `tools.ts`, `F05 Marswalk planner with hard budgets and walk-back heat map`, `Perseverance, descent and sound`, `Presence and Dingo Gap (not built)`, `layers.ts`, `voice.worker.ts`, `TEAMMATE_GUIDE.md`, `BUILD_LOG.md: complete build record`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._
- **Should `make_rasters.py` be split into smaller, more focused modules?**
  _Cohesion score 0.05399625768511093 - nodes in this community are weakly interconnected._
- **Why does `homeward-dev skill (build, run, test, extend)` connect `homeward-dev skill (build, run, test, extend)` to `make_rasters.py`, `planner.ts`, `Rover view: photos and camera models`, `globe.ts`, `BUILD_LOG.md: complete build record`, `mars-time.ts`, `ephemeris.ts`, `package.json`, `state.tsx`, `Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)`, `Explore.tsx`, `core.test.ts`, `moons.ts`, `layers.ts`, `Walk.tsx`, `voice.worker.ts`?**
  _High betweenness centrality (0.061) - this node is a cross-community bridge._