# Graph Report - martian-map-explorer-3f8c3e  (2026-11-14)

## Corpus Check
- 120 files · ~139,989 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .csv 3, .example 1)

## Summary
- 1191 nodes · 3281 edges · 69 communities (60 shown, 9 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 411 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0b34e598`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record.mjs
- IMPLEMENTATION_PLAN.md
- Mars time, ephemeris and planner core
- Rover view: photos and camera models
- API relay and health
- Assistant tools and eval
- globe.ts
- voice.ts
- FEATURE_TICKETS.md
- Diagnostics and tooling
- BUILD_LOG.md: complete build record
- Data loading and place search
- Scene: Explore (Google-Earth style globe)
- SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633)
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
- library.ts
- Demo walk at Yellowknife Bay
- Walk.tsx
- dependencies
- F05 Marswalk planner with hard budgets and walk-back heat map
- Perseverance, descent and sound
- Homeward films: script and plan
- npm scripts
- FRONTEND_SPEC.md
- Presence and Dingo Gap (not built)
- frames.ts
- Zhurong (CNSA)
- Briefing.tsx
- vercel.json
- App.tsx
- Relive.tsx
- engines
- Scene: Science stop (photos, Log sample)
- Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds)
- state.tsx
- fetch-models.mjs
- Dock.tsx
- sheet.sh
- Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)
- Project graph: how Homeward fits together
- legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix
- moons.ts
- ocToOg
- lerc.d.ts
- layers.ts
- speech.ts
- voice.worker.ts
- app/public/sw.js: offline service worker
- dem.ts
- data/globe terrain and imagery rasters (t0-t3, i0-i4)
- F13 Credits panel

## God Nodes (most connected - your core abstractions)
1. `docs/DATA_SPEC.md: data files, facts registry, provenance, licences` - 60 edges
2. `PRD.md: Homeward product requirements` - 45 edges
3. `BUILD_LOG.md: complete build record` - 37 edges
4. `homeward-dev skill (build, run, test, extend)` - 32 edges
5. `ReliveScene()` - 27 edges
6. `WalkScene()` - 25 edges
7. `useRuntime()` - 24 edges
8. `README.md: Homeward context map, rules and decisions` - 24 edges
9. `Badge()` - 23 edges
10. `SourceLink()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `F16 Measurement tools (partial)` --references--> `MeasurePanel()`  [INFERRED]
  PRD.md → app/src/scenes/Explore.tsx
- `3. The main paths through the app (checked against the code)` --references--> `WalkScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Walk.tsx
- `Bugs 8-9: walk-back field took 1,861 ms and Dijkstra skipped nodes; typed-array heap, 121 ms` --references--> `Heap`  [INFERRED]
  BUILD_LOG.md → app/src/core/planner.ts
- `USGS Gazetteer of Planetary Nomenclature` --shares_data_with--> `gazetteer()`  [INFERRED]
  Martian Map — Space Apps 2026 Research Paper.md → pipeline/rovers.py
- `Bugs 8-9: walk-back field took 1,861 ms and Dijkstra skipped nodes; typed-array heap, 121 ms` --references--> `timeHomeField()`  [INFERRED]
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

## Communities (69 total, 9 thin omitted)

### Community 0 - "record.mjs"
Cohesion: 0.07
Nodes (25): build(), C, chunks(), DATASETS, dur(), lines, OUT, SHORT (+17 more)

### Community 1 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.05
Nodes (47): Planner grids, 2 m cells: slope, relief, elevation (site/gale, site/boxwork), homeward-dev skill (build, run, test, extend), homeward-facts: workflow for adding a fact, source or data file, Source status labels: VERIFIED, SECONDARY, UNVERIFIED, Regenerate data: pipeline script order (snapshot, make_grid, make_rasters, make_moons, fetch_audio, rovers, build_facts, build_corpus, manifest), data/places/landers.json, Data pipeline steps (deterministic and idempotent: same inputs, same bytes out), NASA MMGIS rover waypoints and traverses (+39 more)

### Community 2 - "Mars time, ephemeris and planner core"
Cohesion: 0.06
Nodes (63): CRUISE_MSV_PER_DAY, gcrDoseMSv(), missionDoseMSv(), SURFACE_MSV_PER_DAY, AU_KM, C_KMS, cross(), directionFromMars() (+55 more)

### Community 3 - "Rover view: photos and camera models"
Cohesion: 0.07
Nodes (55): add(), azEl(), Cahv, cross(), css(), dot(), frameCentre(), frameMatrix() (+47 more)

### Community 4 - "API relay and health"
Cohesion: 0.06
Nodes (54): hits, ipHash(), json(), log(), originAllowed(), rateLimit(), requestId(), resetRateLimits() (+46 more)

### Community 5 - "Assistant tools and eval"
Cohesion: 0.06
Nodes (45): ctx, Answer, ask(), Lang, Msg, Persona, a, allowed() (+37 more)

### Community 6 - "globe.ts"
Cohesion: 0.16
Nodes (15): ogToOc(), Moon, MoonTable, Layers, TerrainLayer, createDem(), createGlobe(), cssColor() (+7 more)

### Community 7 - "voice.ts"
Cohesion: 0.23
Nodes (11): generate(), listeners, loadVoice(), Out, pending, play(), setState(), speak() (+3 more)

### Community 8 - "FEATURE_TICKETS.md"
Cohesion: 0.15
Nodes (25): T00 Diagnostics script (done: 20 checks), T01 Scaffolding and pinned dependencies, T03 Ephemeris and light time, T04 Frame conversion to Cesium, T05 Data loader, schemas, facts by ID, T06 Mars viewer on own tiles and Gale camera, T09 Planner panel, T13 Assistant relay with free provider chain (+17 more)

### Community 9 - "Diagnostics and tooling"
Cohesion: 0.12
Nodes (11): End of every session: changelog, manifest, tests, typecheck, diagnostics, browser check, Diagnostics: 20 checks with fix hints, args, CI, P(), QUICK, read(), results (+3 more)

### Community 10 - "BUILD_LOG.md: complete build record"
Cohesion: 0.30
Nodes (14): Recovery prompts for a drifting AI (hallucination, context loss, conflicts, behaviour, emergency), BUILD_LOG.md: complete build record, build/MANIFEST.md: chunk status and cut list, build/PLAN-2.md: research, decisions D15-D20, chunks 10-16, CHANGELOG.md: session history and handoff, Open item: Esri terms for astro.arcgis.com tiles unconfirmed (fallback: Viking default layer), Open item: 200 m terrain at landing sites other than Gale, Session 3 (1 Nov 2026): Explore, Rover view, walk yourself (version 2.0) (+6 more)

### Community 11 - "Data loading and place search"
Cohesion: 0.11
Nodes (20): fold(), parseLatLon(), Place, searchPlaces(), all, DataError, Fact, Gazetteer (+12 more)

### Community 12 - "Scene: Explore (Google-Earth style globe)"
Cohesion: 0.20
Nodes (12): Murray Lab global CTX mosaic, 5 m, HiRISE DTMs and orthoimages (USGS STAC), Mars Odyssey orbiter, Mars Reconnaissance Orbiter (MRO), Site tour with walk, hike and fly-over levels (paper section 12.8), THEMIS infrared day and night mosaics, 100 m, USGS Astrogeology, USGS Gazetteer of Planetary Nomenclature (+4 more)

### Community 13 - "SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633)"
Cohesion: 0.22
Nodes (11): DATA-13 JPL approximate planetary elements (Table 1), DATA-14 Mars24 algorithm (Allison and McEwen 2000, NASA GISS), SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633), SITE-02 Science stop: Yellowknife Bay (John Klein, Cumberland), SITE-03 Straight-line habitat to stop: 443 m, SITE-07 Ocentric-to-ographic latitude offset at Bradbury: 0.0543 deg, 3.21 km, TIME-05 One-way light time on 14 Nov 2026: 11.01 min (round trip 22.0 min), T07 Terrain grid pipeline (2 m cells, Horn slope) (+3 more)

### Community 14 - "Requirements and traceability"
Cohesion: 0.09
Nodes (26): DLR (German Aerospace Center), NASA Exploration EVA Concept of Operations 2020 (NTRS 20200001071), Suit limits: EVAs up to 8 hours, within 2 km (lunar-derived), Ranked feature list 1-18 with cut line (paper section 11), Schneegans et al. 2024, CGF: real-time atmospheres from Mie theory, PRD.md: Homeward product requirements, EVA-01: life support lasts about 8 hours, EVA-03: suit slope limit of 20 degrees (+18 more)

### Community 15 - "Walk-back budgets and EVA limits"
Cohesion: 0.18
Nodes (17): EVA-01 EVA duration up to 8 h (NASA EVA ConOps 2020, lunar-derived), EVA-02 Walking radius 2 km from the lander, EVA-03 Suited slope capability up to 20 deg, EVA-04 Walk-back planning rate 3.3 km/h (Apollo 17), RAD-01 Surface dose rate at Gale: 0.64 mSv/day (Hassler et al. 2014), A* route search with an admissible heuristic (distance over 3.93 km/h), T02 Mars24 time module, T08 Planner worker: walk-back field, A*, budgets (+9 more)

### Community 16 - "Security, privacy and CSP"
Cohesion: 0.17
Nodes (11): Deep-linkable URL hash state restored on reload or shared link, npm run build then npm run preview (sends the vercel.json headers, CSP included), Plan persistence: URL hash is the source of truth, mirrored to localStorage homeward:plan:v1, Content-Security-Policy: own origin plus mars.nasa.gov, trek.nasa.gov and astro.arcgis.com; script-src self only, Input validation with zod (relay body, URL hash params, worker messages, tool calls, manifests), Model output is never executed: only known tool names with zod-valid arguments run (prompt-injection control), Secrets: provider keys and ALLOWED_ORIGINS only in Vercel env and .env.local, never VITE_ prefixed, Threat model (keys, free-tier quotas, speech and questions, app integrity, model output, credibility, competition standing) (+3 more)

### Community 17 - "Scene flow (APP_FLOW)"
Cohesion: 0.27
Nodes (15): Scene: Briefing (conditions and limits), Scene: Credits (every source by agency, AI disclosure), Scene: Debrief (plan versus actual, export, share), Scene: Descent to Gale, Scene: Explore (Google-Earth style globe, added 1 Nov 2026), Scene: Mars now / Mission clock, Scene: Orbit (true-scale Mars, Earth, moons), Scene: Plan (zone toggle, budgets, heat map, sliders) (+7 more)

### Community 18 - "Naming and early decisions"
Cohesion: 0.21
Nodes (11): Session 1b (28 Oct 2026): open questions answered, plan revised, Cesium Mars (Cesium ion 3D Tiles), Eight public competitor entries (Protikriti, Mars Traverse, MARSWAY, MarsNav and others), Judging criteria: Influence, Creativity, Validity, Relevance, Presentation, Challenge: Interplanetary Survival Guide, Martian Map, OpenAI Realtime API (paper's main voice choice; rejected as paid), Red Atlas (recommended design and working name), NASA Space Apps Challenge 2026 (14-15 Nov 2026) (+3 more)

### Community 19 - "TypeScript config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 20 - "TESTING_STRATEGY.md"
Cohesion: 0.18
Nodes (10): npm test (vitest unit tests, golden NASA/ESA checks), Mars sky look checklist (butterscotch sky, small Sun, no faked sunset glow), EDL-01 Perseverance entry, descent and landing numbers, Performance budgets (250 KB app JS, 30 fps walk, route under 300 ms, about 300 MB offline cache), CI: GitHub Actions (npm ci, typecheck, test, build, diag), Playwright end-to-end demo path (planned, not built), Manual checklist before filming and submission, Planner tests (walk-back field, wall detour, breaches on hand-made and real grids) (+2 more)

### Community 21 - "Licences and compliance"
Cohesion: 0.17
Nodes (21): docs/DATA_SPEC.md: data files, facts registry, provenance, licences, DATA-01 Own Mars tiles (planned terrain and imagery pyramids), DATA-03 HiRISE DTM DTEEC_010573_1755 (1 m, CC0), DATA-04 MSL waypoints from NASA MMGIS, DATA-21 MOLA-HRSC Blended DEM Global 200 m v2, DATA-22 Viking Colorized Global Mosaic 232 m (MDIM 2.1), DATA-24 MSL Gale Merged Orthophoto Mosaic 25 cm, DATA-25 THEMIS thermal inertia mosaic (+13 more)

### Community 22 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.14
Nodes (18): Assistant turn: push-to-talk, brain call, tools in the browser, answer with source chips, Kokoro voice, 40-question assistant eval (right value, named source, zero unsupported numbers), T16 Offline assistant, Gemini API (gemini-3.8-flash, free tier), Groq (openai/gpt-oss-120b, free tier), OpenRouter (openrouter/free models), AI disclosure (Claude-written code, assistant brains, Kokoro voice, Whisper; stock voices only, never presented as NASA), Space Apps no-early-work rule and the status of the early build (section 1.1) (+10 more)

### Community 23 - "Dev dependencies"
Cohesion: 0.12
Nodes (20): description, devDependencies, @types/react@19.3.0, @types/react-dom@19.3.0, typescript@7.0.2, @vercel/node@28.0.1, vite@8.3.5, @vitejs/plugin-react@6.1.2 (+12 more)

### Community 24 - "Explore.tsx"
Cohesion: 0.20
Nodes (20): hasLibrary(), loadStops(), loadTrack(), useRuntime(), ExploreScene(), fmtDistance(), GroundDetail(), HOME (+12 more)

### Community 25 - "Curiosity, Gale, REMS and RAD"
Cohesion: 0.18
Nodes (14): Curiosity rover (Mars Science Laboratory), Gale's ancient habitable lake, Gale Crater (recommended site), Grotzinger et al. 2014, Science: habitable lake at Yellowknife Bay, Hassler et al. 2014, Science: Mars surface radiation environment, Mars Climate Database v6.1 (LMD), NASA, RAD radiation detector on Curiosity (+6 more)

### Community 26 - "UI_DESIGN_PROMPTS.md"
Cohesion: 0.27
Nodes (7): Calm-cockpit rules (one primary HUD number, every warning comes with the next action), PLN-12 Horizon distance at 1.7 m eye height: 3.39 km, SND-01 Speed of sound on Mars: about 240-250 m/s; high pitches fade within about 8 m, Comfort settings (field of view, head bob, vignette, snap turn; not built), T10 Walk mode and HUD (walk it yourself since 1 Nov), T30 Martian sound engine (partial), T40 Presence cues and comfort settings (partial)

### Community 27 - "pipeline/corpus.md: discovery-card corpus"
Cohesion: 0.38
Nodes (7): Scene: Event (dust devil, solar-storm drill), EVT-01 Perseverance dust devil, 30 Aug 2023, RAD-05 Largest surface radiation event, 20 May 2024: about 8,100 micrograys, T23 Dust devil event, T29 Space-weather scenario (partial), Corpus card: Dust devils, Corpus card: The May 2024 solar storm

### Community 28 - "library.ts"
Cohesion: 0.28
Nodes (6): json(), LibraryPhoto, libraryPhotos(), loadLibrary(), QUERY, Search

### Community 29 - "Demo walk at Yellowknife Bay"
Cohesion: 0.22
Nodes (8): Planner validation: Curiosity's sol 3-166 path is 100% walkable on the real HiRISE grid, F07 Science stop at Yellowknife Bay, Bradbury Landing habitat start (SITE-01), Demo walk: Bradbury Landing to Yellowknife Bay, 443 m, HiRISE DTM DTEEC_010573_1755_010639_1755_U01, 1 m, CC0 (DATA-03), MSL Gale Merged Orthophoto Mosaic, 25 cm (DATA-24), SCI-01: ancient habitable lake at Yellowknife Bay (Grotzinger et al. 2014), Yellowknife Bay science stop, John Klein drill site (SITE-02)

### Community 30 - "Walk.tsx"
Cohesion: 0.21
Nodes (17): load(), setAmbient(), flyStep(), haversineM(), LatLon, offsetM(), lineOfSight(), cellCenter() (+9 more)

### Community 31 - "dependencies"
Cohesion: 0.12
Nodes (13): Meta tags and JSON-LD WebApplication (og.png not made yet, so og:image removed), dependencies, @fontsource-variable/inter@5.3.0, @fontsource-variable/jetbrains-mono@5.3.0, lerc@2.0.0, lucide-react@1.63.0, react@19.3.1, react-dom@19.3.1 (+5 more)

### Community 32 - "F05 Marswalk planner with hard budgets and walk-back heat map"
Cohesion: 0.18
Nodes (12): Apollo 17 traverse planning and walk-back paper, 20 May 2024 solar storm: about 8,100 micrograys at Curiosity, Immersive walkthrough, scenes 0-12 (paper section 12.7), Walk-back rule: Apollo planning rate 3.3 km/h, F06 First-person walk and HUD, F10 Dust devil crosses the route, F18 Space-weather scenario forcing a shelter decision (partial), EVA-04: Apollo walk-back rate 3.3 km/h (Tobler speed scaled to it) (+4 more)

### Community 33 - "Perseverance, descent and sound"
Cohesion: 0.31
Nodes (9): Ingenuity Mars helicopter, Martian acoustics: sound speed 240-250 m/s, high pitches fade within 8 m, Perseverance rover (Mars 2020), SuperCam microphone on Perseverance (first sounds of Mars), F03 Descent to Gale, F19 Martian sound engine (partial), EDL-01: Perseverance's real entry numbers, Scene: Descent to Bradbury Landing (+1 more)

### Community 34 - "Homeward films: script and plan"
Cohesion: 0.22
Nodes (8): 1. The one thing, 2. Three storylines (picked: A), 3. Look and sound, 4. Story film (2 min 20 s), 5. The 30-second film, 6. How it is made (all free, all on our machine), Homeward films: script and plan, Rebuild (about 20 minutes; do it after 09:00 on 14 Nov so the submitted film is made in the event window)

### Community 35 - "npm scripts"
Cohesion: 0.22
Nodes (9): scripts, build, cesium:copy, dev, diag, models, preview, test (+1 more)

### Community 36 - "FRONTEND_SPEC.md"
Cohesion: 0.18
Nodes (11): Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera), app/src/styles/tokens.css: design tokens, Badge colour tokens (--badge-live to --badge-generated), Colour tokens with measured WCAG contrast ratios, Design direction: a scientist's instrument over a real planet (quiet glass panels, one butterscotch accent), Accessibility checklist (WCAG 2.2 AA), Feature flags as a plain constant object (switch off P1/P2 features in an emergency), Panel and the four UI states (loading skeleton, error with incident ID and Retry, empty with action, ok) (+3 more)

### Community 37 - "Presence and Dingo Gap (not built)"
Cohesion: 0.25
Nodes (8): Dingo Gap 3D Tiles demo (NASA-AMMOS 3DTilesRendererJS), DATA-23: JPL 3D terrain at Dingo Gap built from Curiosity's cameras, F29 Presence design (partial), F30 Rover-scale 3D scene at Dingo Gap (not built), PLN-12: real horizon distance 3.39 km at eye height, Dingo Gap, Curiosity sol 528 (SITE-08, SITE-09), Not built list (README section 13), PLN-13: sunlight 39% of Earth's on 14 Nov (light scaling not built)

### Community 38 - "frames.ts"
Cohesion: 0.17
Nodes (9): FLY_MAX_M, FLY_MIN_M, horizonM(), MARS_A_M, MARS_B_M, MARS_SPHERE_M, EYE_M, MAST_M (+1 more)

### Community 44 - "Briefing.tsx"
Cohesion: 0.18
Nodes (20): Arrival, donkiMs(), latestRems(), loadRems(), loadSpaceWeather(), num(), RemsSol, SpaceWeather (+12 more)

### Community 45 - "vercel.json"
Cohesion: 0.14
Nodes (11): Session 3 bug 11: globe never started under production CSP (Cesium Viewer needs unsafe-eval); CesiumWidget, Bug 5: hidden browser pane pauses animation frames; timer fallback on flights, homeward-dev: traps already hit, Security headers in vercel.json (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy microphone only, COOP), Diagnostics check 15: security headers, COOP/COEP and CSP host list enforced, buildCommand, headers, outputDirectory (+3 more)

### Community 46 - "App.tsx"
Cohesion: 0.13
Nodes (27): App(), Shell(), STEPS, PlanState, Badge, Data, incidentId(), loadData() (+19 more)

### Community 47 - "Relive.tsx"
Cohesion: 0.27
Nodes (14): bearingDeg(), placeable(), resolveStop(), ROVER, stopGallery(), clamp(), FEATURED, Lightbox() (+6 more)

### Community 49 - "Scene: Science stop (photos, Log sample)"
Cohesion: 0.60
Nodes (5): Scene: Science stop (photos, Log sample), SCI-01 Gale habitable lake (Grotzinger et al. 2014), Optimistic rendering (log sample, add stop, toggle layer) with rollback, T12 Science stop card and sample log, Corpus card: Why Yellowknife Bay matters (habitable-lake)

### Community 50 - "Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds)"
Cohesion: 0.22
Nodes (6): Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds), File schemas (Fact, Source, GridHeader, Stops, Track, Lander, Gazetteer, Manifest), zod-validated at load, Research status labels: VERIFIED, SECONDARY, COMPUTED, ASSUMPTION, Error boundaries per scene, per panel, globe and assistant, Incident ID with Copy error report (the whole error-tracking system for v1), Diagnostics checks 09 and 10: every fact has a badge and known source; every source has https, licence and credit

### Community 51 - "state.tsx"
Cohesion: 0.14
Nodes (14): Settings, Action, AppState, Ctx, IMAGERY, INITIAL, KEY, readInitial() (+6 more)

### Community 52 - "fetch-models.mjs"
Cohesion: 0.15
Nodes (7): Phrases for an AI assistant (setup, fix, UI, features, demo, deployment, emergency, status), npm run dev (app and API relay at localhost:5173), npm run diag / node scripts/diagnostics.mjs --base <url> (PASS/FAIL per check), npm run models (voice and speech models, about 130 MB, once), expected, MODELS, ORT_FILES

### Community 53 - "Dock.tsx"
Cohesion: 0.25
Nodes (15): Dock(), Line, SUGGEST, speechMode(), onVoiceState(), stopVoice(), heatCanvas(), planOk() (+7 more)

### Community 55 - "Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)"
Cohesion: 0.23
Nodes (12): Phobos within 5 km and Deimos within 19 km of JPL Horizons sub-moon points, Session 1 (28 Oct 2026): planning from the research paper, Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026), Allison and McEwen 2000: Mars solar time and seasons, Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR), Where Mars is during the hackathon (computed: MY39, Ls 21.8, sunrise at Gale 13:47 IST), JPL Horizons API and approximate planetary elements, Mars24 algorithm (Mars solar time, sols, Ls) (+4 more)

### Community 56 - "Project graph: how Homeward fits together"
Cohesion: 0.40
Nodes (4): 1. What is in it (13 Nov 2026), 2. Connection check (the team asked that every connection works), 4. Keeping it current, Project graph: how Homeward fits together

### Community 57 - "legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix"
Cohesion: 0.23
Nodes (11): legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix, Apache-2.0 (CesiumJS, kokoro-js, Kokoro-82M, transformers.js), CC0-1.0 (HiRISE DTMs, MOLA), CC BY-SA 3.0 IGO (HRSC-derived terrain is share-alike), Esri OnMars hosting terms for CTX and HiRISE tiles (UNVERIFIED), Licence matrix for datasets and assets, No NASA logo, worm or insignia anywhere (app, OG image, film, slides, repository), NASA media guidelines (credit, no endorsement, no logos) (+3 more)

### Community 58 - "moons.ts"
Cohesion: 0.29
Nodes (9): Vec3, moonPosition(), Orbiter, orbiterPosition(), OrbiterTable, statePosition(), at(), radiusKm() (+1 more)

### Community 59 - "ocToOg"
Cohesion: 0.27
Nodes (5): ocToOg(), toCesium(), OcentricTiling, cesium@1.146.0, cesium

### Community 61 - "layers.ts"
Cohesion: 0.27
Nodes (7): LIVE, LiveId, OVERLAY_IDS, Tiles, Session 3 bug 9: startup JS 1,229 KB after Explore imported Cesium; split into live.ts and globe.cam, Esri OnMars services (astro.arcgis.com), NASA Mars Trek tile services (WMTS)

### Community 62 - "speech.ts"
Cohesion: 0.28
Nodes (7): loadWhisper(), Rec, SR, startListening(), toMono16k(), Kokoro-82M open voice (kokoro-js, in a Web Worker), Speech in: Web Speech API with Whisper tiny.en fallback

### Community 63 - "voice.worker.ts"
Cohesion: 0.25
Nodes (7): load(), Msg, seedVoiceCache(), @huggingface/transformers@3.8.1, kokoro-js@1.2.1, @huggingface/transformers, kokoro-js

### Community 64 - "app/public/sw.js: offline service worker"
Cohesion: 0.33
Nodes (6): app/public/sw.js: offline service worker, Bug 13: service worker precached 211 MB at install; new caching strategy, data/manifest.json (222 files, 220.9 MB, SHA-256 per file), Supply chain: exact dependency pins, models pinned to Hugging Face commits and hash-checked, npm audit, F20 Offline mode, Offline mode: full 3D on cached real data and own tiles

### Community 65 - "dem.ts"
Cohesion: 0.38
Nodes (5): Dem, DEM_MAX_LEVEL, demTileAt(), sampleTile(), Tile

### Community 66 - "data/globe terrain and imagery rasters (t0-t3, i0-i4)"
Cohesion: 0.33
Nodes (7): data/globe terrain and imagery rasters (t0-t3, i0-i4), ESA, Mars Express (HRSC stereo camera), MOLA-HRSC blended DEM, 200 m, Viking colourised mosaic (MDIM 2.1), 232 m, F02 Orbit arrival, Scene: Orbit (true-scale Mars, Sun, Earth, moons)

### Community 68 - "F13 Credits panel"
Cohesion: 0.67
Nodes (3): F13 Credits panel, Scene: Credits (agencies, datasets, licences, AI tools), Sources registry (data/sources.json, 74 sources)

## Knowledge Gaps
- **28 isolated node(s):** `npm run dev (app and API relay at localhost:5173)`, `ESA`, `Allison and McEwen 2000: Mars solar time and seasons`, `F17 Water and ice overlay (not built)`, `F24 Journey prologue (not built)` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 284 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BUILD_LOG.md: complete build record` connect `BUILD_LOG.md: complete build record` to `record.mjs`, `IMPLEMENTATION_PLAN.md`, `Mars time, ephemeris and planner core`, `API relay and health`, `Assistant tools and eval`, `FEATURE_TICKETS.md`, `Data loading and place search`, `Requirements and traceability`, `Security, privacy and CSP`, `Scene flow (APP_FLOW)`, `TypeScript config`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN_PROMPTS.md`, `FRONTEND_SPEC.md`, `Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds)`, `fetch-models.mjs`, `Dock.tsx`, `legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix`, `speech.ts`, `data/globe terrain and imagery rasters (t0-t3, i0-i4)`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ReliveScene()` (e.g. with `placeable()` and `3. The main paths through the app (checked against the code)`) actually correct?**
  _`ReliveScene()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npm run dev (app and API relay at localhost:5173)`, `ESA`, `Allison and McEwen 2000: Mars solar time and seasons` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.0746031746031746 - nodes in this community are weakly interconnected._
- **Why does `PRD.md: Homeward product requirements` connect `Requirements and traceability` to `IMPLEMENTATION_PLAN.md`, `Mars time, ephemeris and planner core`, `Rover view: photos and camera models`, `Assistant tools and eval`, `BUILD_LOG.md: complete build record`, `Scene: Explore (Google-Earth style globe)`, `Naming and early decisions`, `Licences and compliance`, `IMPLEMENTATION_PLAN.md`, `Curiosity, Gale, REMS and RAD`, `Demo walk at Yellowknife Bay`, `F05 Marswalk planner with hard budgets and walk-back heat map`, `Perseverance, descent and sound`, `Presence and Dingo Gap (not built)`, `state.tsx`, `Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)`, `legal/COMPLIANCE.md: Space Apps rules, AI disclosure, licence matrix`, `app/public/sw.js: offline service worker`, `data/globe terrain and imagery rasters (t0-t3, i0-i4)`, `F13 Credits panel`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Should `IMPLEMENTATION_PLAN.md` be split into smaller, more focused modules?**
  _Cohesion score 0.05304982817869416 - nodes in this community are weakly interconnected._
- **Why does `homeward-dev skill (build, run, test, extend)` connect `IMPLEMENTATION_PLAN.md` to `app/public/sw.js: offline service worker`, `Mars time, ephemeris and planner core`, `Rover view: photos and camera models`, `BUILD_LOG.md: complete build record`, `Data loading and place search`, `vercel.json`, `Relive.tsx`, `state.tsx`, `Dev dependencies`, `Explore.tsx`, `moons.ts`, `ocToOg`, `layers.ts`, `Walk.tsx`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._