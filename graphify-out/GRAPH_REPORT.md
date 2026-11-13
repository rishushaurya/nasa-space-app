# Graph Report - martian-map-explorer-3f8c3e  (2026-11-13)

## Corpus Check
- 113 files · ~132,435 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 9 file(s) not represented in the graph (top: (none) 4, .csv 3, .example 1)

## Summary
- 1141 nodes · 3212 edges · 60 communities (54 shown, 6 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 411 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `364f34e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- planner.ts
- IMPLEMENTATION_PLAN.md
- Mars time, ephemeris and planner core
- Rover view: photos and camera models
- API relay and health
- Assistant tools and eval
- Globe, live layers and headers
- voice.ts
- FEATURE_TICKETS.md
- Diagnostics and tooling
- BUILD_LOG.md: complete build record
- Data loading and place search
- Scene: Explore (Google-Earth style globe)
- T06 Mars viewer on own tiles and Gale camera
- Requirements and traceability
- Walk-back budgets and EVA limits
- Security, privacy and CSP
- Scene flow (APP_FLOW)
- Naming and early decisions
- TypeScript config
- TESTING_STRATEGY.md
- Licences and compliance
- IMPLEMENTATION_PLAN.md
- Dev dependencies
- Explore.tsx
- Curiosity, Gale, REMS and RAD
- UI_DESIGN_PROMPTS.md
- pipeline/corpus.md: discovery-card corpus
- Research paper and errata
- Demo walk at Yellowknife Bay
- Walk.tsx
- dependencies
- F05 Marswalk planner with hard budgets and walk-back heat map
- Perseverance, descent and sound
- frames.ts
- npm scripts
- Performance traps
- Presence and Dingo Gap (not built)
- OBSERVABILITY.md
- Zhurong (CNSA)
- Briefing.tsx
- vercel.json
- App.tsx
- ui.tsx
- package.json
- tools.ts
- fetch-models.mjs
- state.tsx
- data/globe terrain and imagery rasters (t0-t3, i0-i4)
- Dock.tsx
- F08 Grounded suit assistant
- places.ts
- Project graph: how Homeward fits together
- Homeward (Marswalk planner app at Gale Crater)
- dependencies
- lerc.d.ts

## God Nodes (most connected - your core abstractions)
1. `docs/DATA_SPEC.md: data files, facts registry, provenance, licences` - 60 edges
2. `PRD.md: Homeward product requirements` - 45 edges
3. `BUILD_LOG.md: complete build record` - 37 edges
4. `homeward-dev skill (build, run, test, extend)` - 32 edges
5. `ReliveScene()` - 27 edges
6. `WalkScene()` - 24 edges
7. `useRuntime()` - 24 edges
8. `README.md: Homeward context map, rules and decisions` - 24 edges
9. `Badge()` - 23 edges
10. `SourceLink()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `F16 Measurement tools (partial)` --references--> `MeasurePanel()`  [INFERRED]
  PRD.md → app/src/scenes/Explore.tsx
- `3. The main paths through the app (checked against the code)` --references--> `Shell()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/App.tsx
- `3. The main paths through the app (checked against the code)` --references--> `WalkScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Walk.tsx
- `3. The main paths through the app (checked against the code)` --references--> `FactRow()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/ui/ui.tsx
- `Bugs 8-9: walk-back field took 1,861 ms and Dijkstra skipped nodes; typed-array heap, 121 ms` --references--> `Heap`  [INFERRED]
  BUILD_LOG.md → app/src/core/planner.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Five safety budgets checked along the planned timeline** — mental_model_life_support_budget, mental_model_walk_back_budget, mental_model_slope_budget, mental_model_daylight_budget, mental_model_radiation_budget, app_flow_approve_plan_gate [EXTRACTED 1.00]
- **Grounded assistant cascade: speech in, free brain chain, tools, offline rules, Kokoro voice** — tad_whisper, tad_assistant_relay, implementation_plan_provider_chain, feature_tickets_assistant_tool_registry, tad_offline_rules, tad_kokoro_voice [EXTRACTED 1.00]
- **Grounded voice assistant cascade: speech in, tool-grounded AI chain, Kokoro out, delayed Mission Control** — readme_speech_in, readme_ai_chain, readme_kokoro, readme_assistant, readme_mission_control, readme_d6, readme_d12 [EXTRACTED 1.00]
- **Version 2.0 decisions D15-D20 (Explore, Rover view, walking yourself)** — readme_d15, readme_d16, readme_d17, readme_d18, readme_d19, readme_d20, build_plan_2 [EXTRACTED 1.00]
- **Marswalk safety budgets: EVA limit, slope limit, walk-back rate, planner, Plan scene** — prd_f05, prd_eva_01, prd_eva_03, readme_eva_04, readme_d5, readme_scene_plan, app_src_core_planner [INFERRED 0.85]
- **Real-data provenance enforcement: facts.csv, facts registry, badges, sources, diagnostics, eval** — pipeline_facts, docs_data_spec_facts_registry, docs_data_spec_provenance_badges, docs_data_spec_data_sources, security_security_checklist_check_09_10_facts, docs_testing_strategy_assistant_eval [INFERRED 0.85]

## Communities (60 total, 6 thin omitted)

### Community 0 - "planner.ts"
Cohesion: 0.13
Nodes (22): Breach, BreachCode, DEFAULTS, DX, DY, fmt(), Grid, Heap (+14 more)

### Community 1 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.05
Nodes (48): toCesium(), Planner grids, 2 m cells: slope, relief, elevation (site/gale, site/boxwork), homeward-dev skill (build, run, test, extend), homeward-facts: workflow for adding a fact, source or data file, Source status labels: VERIFIED, SECONDARY, UNVERIFIED, Regenerate data: pipeline script order (snapshot, make_grid, make_rasters, make_moons, fetch_audio, rovers, build_facts, build_corpus, manifest), data/places/landers.json, Data pipeline steps (deterministic and idempotent: same inputs, same bytes out) (+40 more)

### Community 2 - "Mars time, ephemeris and planner core"
Cohesion: 0.07
Nodes (56): CRUISE_MSV_PER_DAY, missionDoseMSv(), SURFACE_MSV_PER_DAY, AU_KM, C_KMS, cross(), directionFromMars(), dot() (+48 more)

### Community 3 - "Rover view: photos and camera models"
Cohesion: 0.07
Nodes (55): add(), azEl(), Cahv, cross(), css(), dot(), frameCentre(), frameMatrix() (+47 more)

### Community 4 - "API relay and health"
Cohesion: 0.08
Nodes (41): hits, ipHash(), json(), log(), originAllowed(), rateLimit(), requestId(), resetRateLimits() (+33 more)

### Community 5 - "Assistant tools and eval"
Cohesion: 0.09
Nodes (30): ctx, Answer, ask(), Lang, Msg, Persona, a, allowed() (+22 more)

### Community 6 - "Globe, live layers and headers"
Cohesion: 0.09
Nodes (33): ocToOg(), ogToOc(), moonPosition(), createDem(), Dem, DEM_MAX_LEVEL, demTileAt(), sampleTile() (+25 more)

### Community 7 - "voice.ts"
Cohesion: 0.11
Nodes (19): generate(), listeners, loadVoice(), Out, pending, play(), setState(), speak() (+11 more)

### Community 8 - "FEATURE_TICKETS.md"
Cohesion: 0.14
Nodes (21): Deep-linkable URL hash state restored on reload or shared link, T00 Diagnostics script (done: 20 checks), T01 Scaffolding and pinned dependencies, T03 Ephemeris and light time, T05 Data loader, schemas, facts by ID, T09 Planner panel, T13 Assistant relay with free provider chain, T14 Assistant loop: speech in, tools, captions, Kokoro voice (+13 more)

### Community 9 - "Diagnostics and tooling"
Cohesion: 0.10
Nodes (13): Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds), File schemas (Fact, Source, GridHeader, Stops, Track, Lander, Gazetteer, Manifest), zod-validated at load, Diagnostics: 20 checks with fix hints, args, CI, P(), QUICK, read() (+5 more)

### Community 10 - "BUILD_LOG.md: complete build record"
Cohesion: 0.12
Nodes (26): Recovery prompts for a drifting AI (hallucination, context loss, conflicts, behaviour, emergency), app/src/styles/tokens.css: design tokens, BUILD_LOG.md: complete build record, build/MANIFEST.md: chunk status and cut list, build/PLAN-2.md: research, decisions D15-D20, chunks 10-16, CHANGELOG.md: session history and handoff, Open item: Esri terms for astro.arcgis.com tiles unconfirmed (fallback: Viking default layer), Open item: 200 m terrain at landing sites other than Gale (+18 more)

### Community 11 - "Data loading and place search"
Cohesion: 0.12
Nodes (17): DataError, Fact, Gazetteer, getJson(), GridHeader, Image, ImageryLayer, Lander (+9 more)

### Community 12 - "Scene: Explore (Google-Earth style globe)"
Cohesion: 0.17
Nodes (16): Allison and McEwen 2000: Mars solar time and seasons, Murray Lab global CTX mosaic, 5 m, HiRISE DTMs and orthoimages (USGS STAC), Mars24 algorithm (Mars solar time, sols, Ls), Mars Odyssey orbiter, Mars Reconnaissance Orbiter (MRO), NASA, Ranked resource catalogue (tiers S, A, B, C) (+8 more)

### Community 13 - "T06 Mars viewer on own tiles and Gale camera"
Cohesion: 0.25
Nodes (14): EDL-01 Perseverance entry, descent and landing numbers, SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633), SITE-02 Science stop: Yellowknife Bay (John Klein, Cumberland), SITE-07 Ocentric-to-ographic latitude offset at Bradbury: 0.0543 deg, 3.21 km, T04 Frame conversion to Cesium, T06 Mars viewer on own tiles and Gale camera, T07 Terrain grid pipeline (2 m cells, Horn slope), T22 Descent and tuned sky (+6 more)

### Community 14 - "Requirements and traceability"
Cohesion: 0.11
Nodes (22): 20 May 2024 solar storm: about 8,100 micrograys at Curiosity, PRD.md: Homeward product requirements, F10 Dust devil crosses the route, F12 Provenance on every number and layer, F13 Credits panel, F16 Measurement tools (partial), F17 Water and ice overlay (not built), F18 Space-weather scenario forcing a shelter decision (partial) (+14 more)

### Community 15 - "Walk-back budgets and EVA limits"
Cohesion: 0.22
Nodes (15): EVA-01 EVA duration up to 8 h (NASA EVA ConOps 2020, lunar-derived), EVA-02 Walking radius 2 km from the lander, EVA-03 Suited slope capability up to 20 deg, EVA-04 Walk-back planning rate 3.3 km/h (Apollo 17), RAD-01 Surface dose rate at Gale: 0.64 mSv/day (Hassler et al. 2014), A* route search with an admissible heuristic (distance over 3.93 km/h), T02 Mars24 time module, T08 Planner worker: walk-back field, A*, budgets (+7 more)

### Community 16 - "Security, privacy and CSP"
Cohesion: 0.21
Nodes (13): Plan persistence: URL hash is the source of truth, mirrored to localStorage homeward:plan:v1, Content-Security-Policy: own origin plus mars.nasa.gov, trek.nasa.gov and astro.arcgis.com; script-src self only, Input validation with zod (relay body, URL hash params, worker messages, tool calls, manifests), Model output is never executed: only known tool names with zod-valid arguments run (prompt-injection control), Origin allow-list and CORS (ALLOWED_ORIGINS, no wildcards, no credentials), Rate limiting: 30 relay calls per IP per 10 minutes, in memory per function instance, Secrets: provider keys and ALLOWED_ORIGINS only in Vercel env and .env.local, never VITE_ prefixed, Threat model (keys, free-tier quotas, speech and questions, app integrity, model output, credibility, competition standing) (+5 more)

### Community 17 - "Scene flow (APP_FLOW)"
Cohesion: 0.22
Nodes (18): Scene: Briefing (conditions and limits), Scene: Credits (every source by agency, AI disclosure), Scene: Debrief (plan versus actual, export, share), Scene: Descent to Gale, Scene: Explore (Google-Earth style globe, added 1 Nov 2026), Scene: Mars now / Mission clock, Scene: Orbit (true-scale Mars, Earth, moons), Scene: Plan (zone toggle, budgets, heat map, sliders) (+10 more)

### Community 18 - "Naming and early decisions"
Cohesion: 0.33
Nodes (6): Session 1b (28 Oct 2026): open questions answered, plan revised, Cesium Mars (Cesium ion 3D Tiles), OpenAI Realtime API (paper's main voice choice; rejected as paid), Red Atlas (recommended design and working name), Decisions on open questions Q1-Q7 (team answers, 28 Oct 2026), CesiumJS 1.146 on Ellipsoid.MARS with own terrain and imagery

### Community 19 - "TypeScript config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 20 - "TESTING_STRATEGY.md"
Cohesion: 0.14
Nodes (14): npm test (vitest unit tests, golden NASA/ESA checks), DATA-04 MSL waypoints from NASA MMGIS, DATA-13 JPL approximate planetary elements (Table 1), DATA-14 Mars24 algorithm (Allison and McEwen 2000, NASA GISS), data/rovers: msl/m20 stops, tracks and Ingenuity flights (1,386 Curiosity and 708 Perseverance waypoints), SITE-03 Straight-line habitat to stop: 443 m, TIME-05 One-way light time on 14 Nov 2026: 11.01 min (round trip 22.0 min), Performance budgets (250 KB app JS, 30 fps walk, route under 300 ms, about 300 MB offline cache) (+6 more)

### Community 21 - "Licences and compliance"
Cohesion: 0.15
Nodes (27): docs/DATA_SPEC.md: data files, facts registry, provenance, licences, DATA-01 Own Mars tiles (planned terrain and imagery pyramids), DATA-03 HiRISE DTM DTEEC_010573_1755 (1 m, CC0), DATA-21 MOLA-HRSC Blended DEM Global 200 m v2, DATA-22 Viking Colorized Global Mosaic 232 m (MDIM 2.1), DATA-24 MSL Gale Merged Orthophoto Mosaic 25 cm, DATA-25 THEMIS thermal inertia mosaic, DATA-26 HiRISE DTMs over the boxwork site (+19 more)

### Community 22 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.18
Nodes (16): Assistant turn: push-to-talk, brain call, tools in the browser, answer with source chips, Kokoro voice, npm run models (voice and speech models, about 130 MB, once), 40-question assistant eval (right value, named source, zero unsupported numbers), T16 Offline assistant, Gemini API (gemini-3.8-flash, free tier), Groq (openai/gpt-oss-120b, free tier), OpenRouter (openrouter/free models), AI disclosure (Claude-written code, assistant brains, Kokoro voice, Whisper; stock voices only, never presented as NASA) (+8 more)

### Community 23 - "Dev dependencies"
Cohesion: 0.14
Nodes (14): devDependencies, @types/react@19.3.0, @types/react-dom@19.3.0, typescript@7.0.2, @vercel/node@28.0.1, vite@8.3.5, @vitejs/plugin-react@6.1.2, vitest@5.0.5 (+6 more)

### Community 24 - "Explore.tsx"
Cohesion: 0.11
Nodes (36): json(), hasLibrary(), LibraryPhoto, libraryPhotos(), loadLibrary(), QUERY, Search, loadStops() (+28 more)

### Community 25 - "Curiosity, Gale, REMS and RAD"
Cohesion: 0.18
Nodes (14): Curiosity rover (Mars Science Laboratory), Dingo Gap 3D Tiles demo (NASA-AMMOS 3DTilesRendererJS), Gale's ancient habitable lake, Gale Crater (recommended site), Grotzinger et al. 2014, Science: habitable lake at Yellowknife Bay, Hassler et al. 2014, Science: Mars surface radiation environment, Mars Climate Database v6.1 (LMD), RAD radiation detector on Curiosity (+6 more)

### Community 26 - "UI_DESIGN_PROMPTS.md"
Cohesion: 0.17
Nodes (10): Calm-cockpit rules (one primary HUD number, every warning comes with the next action), Design direction: a scientist's instrument over a real planet (quiet glass panels, one butterscotch accent), Explore layout: map-app globe with 44 px glass controls, cursor pill, track legend, Mars sky look checklist (butterscotch sky, small Sun, no faked sunset glow), SND-01 Speed of sound on Mars: about 240-250 m/s; high pitches fade within about 8 m, Comfort settings (field of view, head bob, vignette, snap turn; not built), Manual checklist before filming and submission, No NASA logo, worm or insignia anywhere (app, OG image, film, slides, repository) (+2 more)

### Community 27 - "pipeline/corpus.md: discovery-card corpus"
Cohesion: 0.22
Nodes (11): Scene: Event (dust devil, solar-storm drill), EVT-01 Perseverance dust devil, 30 Aug 2023, PLN-12 Horizon distance at 1.7 m eye height: 3.39 km, RAD-05 Largest surface radiation event, 20 May 2024: about 8,100 micrograys, T10 Walk mode and HUD (walk it yourself since 1 Nov), T23 Dust devil event, T29 Space-weather scenario (partial), T30 Martian sound engine (partial) (+3 more)

### Community 28 - "Research paper and errata"
Cohesion: 0.24
Nodes (10): Session 1 (28 Oct 2026): planning from the research paper, Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026), Eight public competitor entries (Protikriti, Mars Traverse, MARSWAY, MarsNav and others), Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR), Ranked feature list 1-18 with cut line (paper section 11), Where Mars is during the hackathon (computed: MY39, Ls 21.8, sunrise at Gale 13:47 IST), Earth-Mars radio delay (11.0 min one way on 14 Nov 2026), F22 Landing-site safety check (not built) (+2 more)

### Community 29 - "Demo walk at Yellowknife Bay"
Cohesion: 0.25
Nodes (8): F07 Science stop at Yellowknife Bay, Bradbury Landing habitat start (SITE-01), Demo walk: Bradbury Landing to Yellowknife Bay, 443 m, HiRISE DTM DTEEC_010573_1755_010639_1755_U01, 1 m, CC0 (DATA-03), MSL Gale Merged Orthophoto Mosaic, 25 cm (DATA-24), Scenario date 14 Nov 2026: Mars Year 39, Ls 21.6, light time 11.0 min (TIME-01..05), SCI-01: ancient habitable lake at Yellowknife Bay (Grotzinger et al. 2014), Yellowknife Bay science stop, John Klein drill site (SITE-02)

### Community 30 - "Walk.tsx"
Cohesion: 0.24
Nodes (16): load(), setAmbient(), gcrDoseMSv(), bearingDeg(), haversineM(), offsetM(), lineOfSight(), cellCenter() (+8 more)

### Community 31 - "dependencies"
Cohesion: 0.18
Nodes (7): Meta tags and JSON-LD WebApplication (og.png not made yet, so og:image removed), @fontsource-variable/inter@5.3.0, @fontsource-variable/jetbrains-mono@5.3.0, react-dom@19.3.1, @fontsource-variable/inter, @fontsource-variable/jetbrains-mono, react-dom

### Community 32 - "F05 Marswalk planner with hard budgets and walk-back heat map"
Cohesion: 0.15
Nodes (13): Apollo 17 traverse planning and walk-back paper, NASA Exploration EVA Concept of Operations 2020 (NTRS 20200001071), Suit limits: EVAs up to 8 hours, within 2 km (lunar-derived), Immersive walkthrough, scenes 0-12 (paper section 12.7), Walk-back rule: Apollo planning rate 3.3 km/h, EVA-01: life support lasts about 8 hours, EVA-03: suit slope limit of 20 degrees, F05 Marswalk planner with hard budgets and walk-back heat map (+5 more)

### Community 33 - "Perseverance, descent and sound"
Cohesion: 0.31
Nodes (9): Ingenuity Mars helicopter, Martian acoustics: sound speed 240-250 m/s, high pitches fade within 8 m, Perseverance rover (Mars 2020), SuperCam microphone on Perseverance (first sounds of Mars), F03 Descent to Gale, F19 Martian sound engine (partial), EDL-01: Perseverance's real entry numbers, Scene: Descent to Bradbury Landing (+1 more)

### Community 34 - "frames.ts"
Cohesion: 0.21
Nodes (7): horizonM(), MARS_A_M, MARS_B_M, MARS_SPHERE_M, EYE_M, MAST_M, Sight

### Community 35 - "npm scripts"
Cohesion: 0.22
Nodes (9): scripts, build, cesium:copy, dev, diag, models, preview, test (+1 more)

### Community 36 - "Performance traps"
Cohesion: 0.36
Nodes (5): Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera), Diagnostics check 18: startup JavaScript budget (scenes must not import Cesium), Measured values (startup JS 140 KB gzip, offline payload 220.9 MB, frame rate not yet measured on the weakest laptop), Rendering quality presets (High, Medium, Low; automatic drop after 10 s under 20 fps), Diagnostics check 20: no control characters in source (heredoc backspace trap)

### Community 37 - "Presence and Dingo Gap (not built)"
Cohesion: 0.40
Nodes (5): F29 Presence design (partial), PLN-12: real horizon distance 3.39 km at eye height, Dingo Gap, Curiosity sol 528 (SITE-08, SITE-09), Not built list (README section 13), PLN-13: sunlight 39% of Earth's on 14 Nov (light scaling not built)

### Community 38 - "OBSERVABILITY.md"
Cohesion: 0.20
Nodes (9): First-time experience and microphone permission gate (text input always available), Error boundaries per scene, per panel, globe and assistant, ?debug=1 overlay (fps, planner timings, manifest dates, last provider, log lines), Error classification (UserError, OriginError, RateLimited, ExternalError, SystemError, DataError), Incident ID with Copy error report (the whole error-tracking system for v1), Structured JSON log format (requestId, ipHash, provider, fallbacks; never question or answer text), GET /api/v1/health endpoint (status, checks, version, uptimeS), What leaves the browser, and to whom (speech service, relay to AI providers, tile and photo requests) (+1 more)

### Community 44 - "Briefing.tsx"
Cohesion: 0.19
Nodes (18): Arrival, donkiMs(), latestRems(), loadRems(), loadSpaceWeather(), num(), RemsSol, SpaceWeather (+10 more)

### Community 45 - "vercel.json"
Cohesion: 0.13
Nodes (9): npm run build then npm run preview (sends the vercel.json headers, CSP included), Security headers in vercel.json (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy microphone only, COOP), Diagnostics check 15: security headers, COOP/COEP and CSP host list enforced, buildCommand, headers, outputDirectory, ISOLATION, PRODUCTION (+1 more)

### Community 46 - "App.tsx"
Cohesion: 0.15
Nodes (22): App(), Shell(), STEPS, Data, incidentId(), loadData(), loadOrbiters(), MarsGlobe (+14 more)

### Community 47 - "ui.tsx"
Cohesion: 0.29
Nodes (14): heatCanvas(), Badge, css(), PlanScene(), Slider(), Badge(), BADGE_HELP, BudgetBar() (+6 more)

### Community 48 - "package.json"
Cohesion: 0.22
Nodes (8): description, engines, node, license, name, private, type, version

### Community 49 - "tools.ts"
Cohesion: 0.13
Nodes (14): empty, NO_PLAN, noArgs, Tool, ToolResult, TOOLS, LatLon, PlanResult (+6 more)

### Community 50 - "fetch-models.mjs"
Cohesion: 0.13
Nodes (8): app/public/sw.js: offline service worker, data/manifest.json (222 files, 220.9 MB, SHA-256 per file), Supply chain: exact dependency pins, models pinned to Hugging Face commits and hash-checked, npm audit, F20 Offline mode, Offline mode: full 3D on cached real data and own tiles, expected, MODELS, ORT_FILES

### Community 51 - "state.tsx"
Cohesion: 0.14
Nodes (14): OVERLAY_IDS, Action, AppState, Ctx, IMAGERY, INITIAL, KEY, readInitial() (+6 more)

### Community 52 - "data/globe terrain and imagery rasters (t0-t3, i0-i4)"
Cohesion: 0.25
Nodes (8): data/globe terrain and imagery rasters (t0-t3, i0-i4), DLR (German Aerospace Center), ESA, Mars Express (HRSC stereo camera), MOLA-HRSC blended DEM, 200 m, Schneegans et al. 2024, CGF: real-time atmospheres from Mie theory, Viking colourised mosaic (MDIM 2.1), 232 m, F26 Physically based Mie sky (not built)

### Community 53 - "Dock.tsx"
Cohesion: 0.21
Nodes (13): Dock(), Line, SUGGEST, Rec, speechMode(), SR, startListening(), toMono16k() (+5 more)

### Community 54 - "F08 Grounded suit assistant"
Cohesion: 0.40
Nodes (4): 40-question assistant eval (offline rules, 40/40), Planner validation: Curiosity's sol 3-166 path is 100% walkable on the real HiRISE grid, F08 Grounded suit assistant, Success metrics: golden tests, assistant eval, planner validity

### Community 55 - "places.ts"
Cohesion: 0.43
Nodes (5): fold(), parseLatLon(), Place, searchPlaces(), all

### Community 56 - "Project graph: how Homeward fits together"
Cohesion: 0.40
Nodes (4): 1. What is in it (13 Nov 2026), 2. Connection check (the team asked that every connection works), 4. Keeping it current, Project graph: how Homeward fits together

### Community 57 - "Homeward (Marswalk planner app at Gale Crater)"
Cohesion: 0.33
Nodes (5): Rules: no early work, AI disclosure, no NASA logos, cite every source, Judging criteria: Influence, Creativity, Validity, Relevance, Presentation, Challenge: Interplanetary Survival Guide, Martian Map, NASA Space Apps Challenge 2026 (14-15 Nov 2026), Homeward (Marswalk planner app at Gale Crater)

### Community 59 - "dependencies"
Cohesion: 0.15
Nodes (12): loadWhisper(), dependencies, cesium@1.146.0, @huggingface/transformers@3.8.1, kokoro-js@1.2.1, lerc@2.0.0, lucide-react@1.63.0, react@19.3.1 (+4 more)

## Knowledge Gaps
- **28 isolated node(s):** `Apollo 17 traverse planning and walk-back paper`, `F17 Water and ice overlay (not built)`, `F24 Journey prologue (not built)`, `F25 More route weather: dusk clouds, frost, storm warning (not built)`, `F27 Shared mission notebook (P3)` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 255 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BUILD_LOG.md: complete build record` connect `BUILD_LOG.md: complete build record` to `planner.ts`, `IMPLEMENTATION_PLAN.md`, `API relay and health`, `Assistant tools and eval`, `voice.ts`, `FEATURE_TICKETS.md`, `Data loading and place search`, `Requirements and traceability`, `Security, privacy and CSP`, `Scene flow (APP_FLOW)`, `TypeScript config`, `Licences and compliance`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN_PROMPTS.md`, `Performance traps`, `OBSERVABILITY.md`, `fetch-models.mjs`, `data/globe terrain and imagery rasters (t0-t3, i0-i4)`, `Dock.tsx`?**
  _High betweenness centrality (0.077) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ReliveScene()` (e.g. with `placeable()` and `3. The main paths through the app (checked against the code)`) actually correct?**
  _`ReliveScene()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Apollo 17 traverse planning and walk-back paper`, `F17 Water and ice overlay (not built)`, `F24 Journey prologue (not built)` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `planner.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.1330049261083744 - nodes in this community are weakly interconnected._
- **Why does `docs/DATA_SPEC.md: data files, facts registry, provenance, licences` connect `Licences and compliance` to `IMPLEMENTATION_PLAN.md`, `Rover view: photos and camera models`, `Performance traps`, `FEATURE_TICKETS.md`, `Diagnostics and tooling`, `BUILD_LOG.md: complete build record`, `T06 Mars viewer on own tiles and Gale camera`, `Requirements and traceability`, `Walk-back budgets and EVA limits`, `Scene flow (APP_FLOW)`, `fetch-models.mjs`, `TESTING_STRATEGY.md`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN_PROMPTS.md`, `pipeline/corpus.md: discovery-card corpus`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `IMPLEMENTATION_PLAN.md` be split into smaller, more focused modules?**
  _Cohesion score 0.0502970297029703 - nodes in this community are weakly interconnected._
- **Why does `homeward-dev skill (build, run, test, extend)` connect `IMPLEMENTATION_PLAN.md` to `planner.ts`, `Mars time, ephemeris and planner core`, `Rover view: photos and camera models`, `Globe, live layers and headers`, `BUILD_LOG.md: complete build record`, `package.json`, `fetch-models.mjs`, `state.tsx`, `places.ts`, `Explore.tsx`, `Walk.tsx`?**
  _High betweenness centrality (0.071) - this node is a cross-community bridge._