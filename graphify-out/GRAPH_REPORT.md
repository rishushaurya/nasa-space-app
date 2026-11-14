# Graph Report - martian-map-explorer-3f8c3e  (2026-11-14)

## Corpus Check
- 120 files · ~138,580 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 10 file(s) not represented in the graph (top: (none) 5, .csv 3, .example 1)

## Summary
- 1188 nodes · 3273 edges · 60 communities (53 shown, 7 thin omitted)
- Extraction: 87% EXTRACTED · 13% INFERRED · 0% AMBIGUOUS · INFERRED: 411 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `b36b8fd6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record.mjs
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
- OBSERVABILITY.md
- Zhurong (CNSA)
- Briefing.tsx
- vercel.json
- App.tsx
- Requirement traceability against the official challenge page (PRD 5.1)
- package.json
- Scene: Science stop (photos, Log sample)
- Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds)
- state.tsx
- DLR (German Aerospace Center)
- Dock.tsx
- sheet.sh
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
6. `useRuntime()` - 24 edges
7. `WalkScene()` - 24 edges
8. `README.md: Homeward context map, rules and decisions` - 24 edges
9. `SourceLink()` - 23 edges
10. `Badge()` - 23 edges

## Surprising Connections (you probably didn't know these)
- `F16 Measurement tools (partial)` --references--> `MeasurePanel()`  [INFERRED]
  PRD.md → app/src/scenes/Explore.tsx
- `3. The main paths through the app (checked against the code)` --references--> `Shell()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/App.tsx
- `3. The main paths through the app (checked against the code)` --references--> `WalkScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Walk.tsx
- `Bugs 8-9: walk-back field took 1,861 ms and Dijkstra skipped nodes; typed-array heap, 121 ms` --references--> `Heap`  [INFERRED]
  BUILD_LOG.md → app/src/core/planner.ts
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

## Communities (60 total, 7 thin omitted)

### Community 0 - "record.mjs"
Cohesion: 0.07
Nodes (27): build(), C, chunks(), DATASETS, dur(), lines, OUT, SHORT (+19 more)

### Community 1 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.05
Nodes (48): toCesium(), Planner grids, 2 m cells: slope, relief, elevation (site/gale, site/boxwork), homeward-dev skill (build, run, test, extend), homeward-facts: workflow for adding a fact, source or data file, Source status labels: VERIFIED, SECONDARY, UNVERIFIED, Regenerate data: pipeline script order (snapshot, make_grid, make_rasters, make_moons, fetch_audio, rovers, build_facts, build_corpus, manifest), data/places/landers.json, Data pipeline steps (deterministic and idempotent: same inputs, same bytes out) (+40 more)

### Community 2 - "Mars time, ephemeris and planner core"
Cohesion: 0.06
Nodes (58): CRUISE_MSV_PER_DAY, gcrDoseMSv(), missionDoseMSv(), SURFACE_MSV_PER_DAY, AU_KM, C_KMS, cross(), directionFromMars() (+50 more)

### Community 3 - "Rover view: photos and camera models"
Cohesion: 0.07
Nodes (56): add(), azEl(), Cahv, cross(), css(), dot(), frameCentre(), frameMatrix() (+48 more)

### Community 4 - "API relay and health"
Cohesion: 0.07
Nodes (44): hits, ipHash(), json(), log(), originAllowed(), rateLimit(), requestId(), resetRateLimits() (+36 more)

### Community 5 - "Assistant tools and eval"
Cohesion: 0.06
Nodes (42): ctx, Answer, ask(), Lang, Msg, Persona, a, allowed() (+34 more)

### Community 6 - "Globe, live layers and headers"
Cohesion: 0.06
Nodes (48): Vec3, ocToOg(), ogToOc(), Moon, moonPosition(), MoonTable, Orbiter, orbiterPosition() (+40 more)

### Community 7 - "voice.ts"
Cohesion: 0.06
Nodes (30): app/public/sw.js: offline service worker, loadWhisper(), Rec, SR, startListening(), toMono16k(), generate(), listeners (+22 more)

### Community 8 - "FEATURE_TICKETS.md"
Cohesion: 0.17
Nodes (20): T00 Diagnostics script (done: 20 checks), T01 Scaffolding and pinned dependencies, T02 Mars24 time module, T03 Ephemeris and light time, T05 Data loader, schemas, facts by ID, T09 Planner panel, T11 Briefing panel, T14 Assistant loop: speech in, tools, captions, Kokoro voice (+12 more)

### Community 9 - "Diagnostics and tooling"
Cohesion: 0.07
Nodes (16): End of every session: changelog, manifest, tests, typecheck, diagnostics, browser check, No NASA logo, worm or insignia anywhere (app, OG image, film, slides, repository), Diagnostics: 20 checks with fix hints, args, CI, P(), QUICK, read() (+8 more)

### Community 10 - "BUILD_LOG.md: complete build record"
Cohesion: 0.22
Nodes (16): Recovery prompts for a drifting AI (hallucination, context loss, conflicts, behaviour, emergency), BUILD_LOG.md: complete build record, build/MANIFEST.md: chunk status and cut list, build/PLAN-2.md: research, decisions D15-D20, chunks 10-16, CHANGELOG.md: session history and handoff, Open item: Esri terms for astro.arcgis.com tiles unconfirmed (fallback: Viking default layer), Open item: 200 m terrain at landing sites other than Gale, Session 3b (6 Nov 2026): documents to 2.0, licences, GitHub push (+8 more)

### Community 11 - "Data loading and place search"
Cohesion: 0.12
Nodes (18): DataError, Fact, Gazetteer, getJson(), GridHeader, Image, ImageryLayer, Lander (+10 more)

### Community 12 - "Scene: Explore (Google-Earth style globe)"
Cohesion: 0.12
Nodes (21): data/globe terrain and imagery rasters (t0-t3, i0-i4), Allison and McEwen 2000: Mars solar time and seasons, Murray Lab global CTX mosaic, 5 m, ESA, HiRISE DTMs and orthoimages (USGS STAC), Mars24 algorithm (Mars solar time, sols, Ls), Mars Express (HRSC stereo camera), Mars Odyssey orbiter (+13 more)

### Community 13 - "T06 Mars viewer on own tiles and Gale camera"
Cohesion: 0.20
Nodes (17): EDL-01 Perseverance entry, descent and landing numbers, SCI-05 Boxwork ridges on Mount Sharp, SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633), SITE-02 Science stop: Yellowknife Bay (John Klein, Cumberland), SITE-03 Straight-line habitat to stop: 443 m, SITE-11 Boxwork science stop: Curiosity site 120 drive 0, T04 Frame conversion to Cesium, T06 Mars viewer on own tiles and Gale camera (+9 more)

### Community 14 - "Requirements and traceability"
Cohesion: 0.10
Nodes (22): NASA Exploration EVA Concept of Operations 2020 (NTRS 20200001071), Suit limits: EVAs up to 8 hours, within 2 km (lunar-derived), Ranked feature list 1-18 with cut line (paper section 11), PRD.md: Homeward product requirements, EVA-01: life support lasts about 8 hours, EVA-03: suit slope limit of 20 degrees, F05 Marswalk planner with hard budgets and walk-back heat map, F12 Provenance on every number and layer (+14 more)

### Community 15 - "Walk-back budgets and EVA limits"
Cohesion: 0.20
Nodes (14): PlanInput, EVA-01 EVA duration up to 8 h (NASA EVA ConOps 2020, lunar-derived), EVA-02 Walking radius 2 km from the lander, EVA-03 Suited slope capability up to 20 deg, EVA-04 Walk-back planning rate 3.3 km/h (Apollo 17), A* route search with an admissible heuristic (distance over 3.93 km/h), T08 Planner worker: walk-back field, A*, budgets, Tobler hiking function scaled to 3.3 km/h on flat ground (ASSUMPTION) (+6 more)

### Community 16 - "Security, privacy and CSP"
Cohesion: 0.19
Nodes (14): Plan persistence: URL hash is the source of truth, mirrored to localStorage homeward:plan:v1, Input validation with zod (relay body, URL hash params, worker messages, tool calls, manifests), Model output is never executed: only known tool names with zod-valid arguments run (prompt-injection control), Origin allow-list and CORS (ALLOWED_ORIGINS, no wildcards, no credentials), Rate limiting: 30 relay calls per IP per 10 minutes, in memory per function instance, Secrets: provider keys and ALLOWED_ORIGINS only in Vercel env and .env.local, never VITE_ prefixed, Threat model (keys, free-tier quotas, speech and questions, app integrity, model output, credibility, competition standing), 40-question assistant eval (right value, named source, zero unsupported numbers) (+6 more)

### Community 17 - "Scene flow (APP_FLOW)"
Cohesion: 0.29
Nodes (14): Deep-linkable URL hash state restored on reload or shared link, Scene: Briefing (conditions and limits), Scene: Credits (every source by agency, AI disclosure), Scene: Debrief (plan versus actual, export, share), Scene: Descent to Gale, Scene: Explore (Google-Earth style globe, added 1 Nov 2026), Scene: Mars now / Mission clock, Scene: Orbit (true-scale Mars, Earth, moons) (+6 more)

### Community 18 - "Naming and early decisions"
Cohesion: 0.19
Nodes (13): Session 1 (28 Oct 2026): planning from the research paper, Session 1b (28 Oct 2026): open questions answered, plan revised, Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026), Cesium Mars (Cesium ion 3D Tiles), Eight public competitor entries (Protikriti, Mars Traverse, MARSWAY, MarsNav and others), Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR), Where Mars is during the hackathon (computed: MY39, Ls 21.8, sunrise at Gale 13:47 IST), OpenAI Realtime API (paper's main voice choice; rejected as paid) (+5 more)

### Community 19 - "TypeScript config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 20 - "TESTING_STRATEGY.md"
Cohesion: 0.16
Nodes (12): npm test (vitest unit tests, golden NASA/ESA checks), Mars sky look checklist (butterscotch sky, small Sun, no faked sunset glow), DATA-13 JPL approximate planetary elements (Table 1), DATA-14 Mars24 algorithm (Allison and McEwen 2000, NASA GISS), SITE-07 Ocentric-to-ographic latitude offset at Bradbury: 0.0543 deg, 3.21 km, TIME-05 One-way light time on 14 Nov 2026: 11.01 min (round trip 22.0 min), Performance budgets (250 KB app JS, 30 fps walk, route under 300 ms, about 300 MB offline cache), CI: GitHub Actions (npm ci, typecheck, test, build, diag) (+4 more)

### Community 21 - "Licences and compliance"
Cohesion: 0.19
Nodes (22): docs/DATA_SPEC.md: data files, facts registry, provenance, licences, DATA-01 Own Mars tiles (planned terrain and imagery pyramids), DATA-03 HiRISE DTM DTEEC_010573_1755 (1 m, CC0), DATA-21 MOLA-HRSC Blended DEM Global 200 m v2, DATA-22 Viking Colorized Global Mosaic 232 m (MDIM 2.1), DATA-24 MSL Gale Merged Orthophoto Mosaic 25 cm, DATA-25 THEMIS thermal inertia mosaic, DATA-26 HiRISE DTMs over the boxwork site (+14 more)

### Community 22 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.15
Nodes (16): Assistant turn: push-to-talk, brain call, tools in the browser, answer with source chips, Kokoro voice, npm run models (voice and speech models, about 130 MB, once), T16 Offline assistant, Gemini API (gemini-3.8-flash, free tier), Groq (openai/gpt-oss-120b, free tier), OpenRouter (openrouter/free models), AI disclosure (Claude-written code, assistant brains, Kokoro voice, Whisper; stock voices only, never presented as NASA), Space Apps no-early-work rule and the status of the early build (section 1.1) (+8 more)

### Community 23 - "Dev dependencies"
Cohesion: 0.17
Nodes (12): devDependencies, @types/react@19.3.0, @types/react-dom@19.3.0, typescript@7.0.2, @vercel/node@28.0.1, @vitejs/plugin-react@6.1.2, vitest@5.0.5, @types/react (+4 more)

### Community 24 - "Explore.tsx"
Cohesion: 0.14
Nodes (34): bearingDeg(), hasLibrary(), loadStops(), loadTrack(), placeable(), resolveStop(), ROVER, useRuntime() (+26 more)

### Community 25 - "Curiosity, Gale, REMS and RAD"
Cohesion: 0.24
Nodes (11): Curiosity rover (Mars Science Laboratory), Gale Crater (recommended site), Hassler et al. 2014, Science: Mars surface radiation environment, Mars Climate Database v6.1 (LMD), RAD radiation detector on Curiosity, Surface radiation dose 0.64 mSv/day at Gale, REMS weather station on Curiosity, Spain's Centro de Astrobiologia (REMS, TWINS, MEDA) (+3 more)

### Community 26 - "UI_DESIGN_PROMPTS.md"
Cohesion: 0.21
Nodes (9): Calm-cockpit rules (one primary HUD number, every warning comes with the next action), Design direction: a scientist's instrument over a real planet (quiet glass panels, one butterscotch accent), Explore layout: map-app globe with 44 px glass controls, cursor pill, track legend, PLN-12 Horizon distance at 1.7 m eye height: 3.39 km, SND-01 Speed of sound on Mars: about 240-250 m/s; high pitches fade within about 8 m, Comfort settings (field of view, head bob, vignette, snap turn; not built), T10 Walk mode and HUD (walk it yourself since 1 Nov), T30 Martian sound engine (partial) (+1 more)

### Community 27 - "pipeline/corpus.md: discovery-card corpus"
Cohesion: 0.19
Nodes (13): Scene: Event (dust devil, solar-storm drill), DATA-04 MSL waypoints from NASA MMGIS, EVT-01 Perseverance dust devil, 30 Aug 2023, RAD-01 Surface dose rate at Gale: 0.64 mSv/day (Hassler et al. 2014), RAD-05 Largest surface radiation event, 20 May 2024: about 8,100 micrograys, data/rovers: msl/m20 stops, tracks and Ingenuity flights (1,386 Curiosity and 708 Perseverance waypoints), Curiosity sol 3-166 path validation: at least 95% walkable under our rules (measured 100%), T23 Dust devil event (+5 more)

### Community 28 - "library.ts"
Cohesion: 0.28
Nodes (6): json(), LibraryPhoto, libraryPhotos(), loadLibrary(), QUERY, Search

### Community 29 - "Demo walk at Yellowknife Bay"
Cohesion: 0.20
Nodes (10): Planner validation: Curiosity's sol 3-166 path is 100% walkable on the real HiRISE grid, Gale's ancient habitable lake, Grotzinger et al. 2014, Science: habitable lake at Yellowknife Bay, F07 Science stop at Yellowknife Bay, Bradbury Landing habitat start (SITE-01), Demo walk: Bradbury Landing to Yellowknife Bay, 443 m, MSL Gale Merged Orthophoto Mosaic, 25 cm (DATA-24), Scenario date 14 Nov 2026: Mars Year 39, Ls 21.6, light time 11.0 min (TIME-01..05) (+2 more)

### Community 30 - "Walk.tsx"
Cohesion: 0.13
Nodes (22): load(), setAmbient(), haversineM(), horizonM(), MARS_A_M, MARS_B_M, MARS_SPHERE_M, offsetM() (+14 more)

### Community 31 - "dependencies"
Cohesion: 0.22
Nodes (5): Meta tags and JSON-LD WebApplication (og.png not made yet, so og:image removed), @fontsource-variable/inter@5.3.0, react-dom@19.3.1, @fontsource-variable/inter, react-dom

### Community 32 - "F05 Marswalk planner with hard budgets and walk-back heat map"
Cohesion: 0.22
Nodes (9): Apollo 17 traverse planning and walk-back paper, Immersive walkthrough, scenes 0-12 (paper section 12.7), Walk-back rule: Apollo planning rate 3.3 km/h, F06 First-person walk and HUD, F10 Dust devil crosses the route, EVA-04: Apollo walk-back rate 3.3 km/h (Tobler speed scaled to it), EVT-01: dust-devil event on the route, Scene: Plan (Marswalk planner with hard budgets) (+1 more)

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
Cohesion: 0.19
Nodes (11): Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera), app/src/styles/tokens.css: design tokens, Badge colour tokens (--badge-live to --badge-generated), Colour tokens with measured WCAG contrast ratios, Track and ruler colour tokens (--color-track-msl, -m20, -heli, --color-measure), Accessibility checklist (WCAG 2.2 AA), Feature flags as a plain constant object (switch off P1/P2 features in an emergency), Panel and the four UI states (loading skeleton, error with incident ID and Retry, empty with action, ok) (+3 more)

### Community 37 - "Presence and Dingo Gap (not built)"
Cohesion: 0.25
Nodes (8): Dingo Gap 3D Tiles demo (NASA-AMMOS 3DTilesRendererJS), DATA-23: JPL 3D terrain at Dingo Gap built from Curiosity's cameras, F29 Presence design (partial), F30 Rover-scale 3D scene at Dingo Gap (not built), PLN-12: real horizon distance 3.39 km at eye height, Dingo Gap, Curiosity sol 528 (SITE-08, SITE-09), Not built list (README section 13), PLN-13: sunlight 39% of Earth's on 14 Nov (light scaling not built)

### Community 38 - "OBSERVABILITY.md"
Cohesion: 0.22
Nodes (8): First-time experience and microphone permission gate (text input always available), Error boundaries per scene, per panel, globe and assistant, ?debug=1 overlay (fps, planner timings, manifest dates, last provider, log lines), Error classification (UserError, OriginError, RateLimited, ExternalError, SystemError, DataError), Incident ID with Copy error report (the whole error-tracking system for v1), Structured JSON log format (requestId, ipHash, provider, fallbacks; never question or answer text), What leaves the browser, and to whom (speech service, relay to AI providers, tile and photo requests), Diagnostics check 17: health endpoint and ALLOWED_ORIGINS on the deployed URL

### Community 44 - "Briefing.tsx"
Cohesion: 0.18
Nodes (23): Arrival, donkiMs(), latestRems(), loadRems(), loadSpaceWeather(), num(), RemsSol, SpaceWeather (+15 more)

### Community 45 - "vercel.json"
Cohesion: 0.14
Nodes (12): Session 3 bug 11: globe never started under production CSP (Cesium Viewer needs unsafe-eval); CesiumWidget, Session 3 (1 Nov 2026): Explore, Rover view, walk yourself (version 2.0), npm run build then npm run preview (sends the vercel.json headers, CSP included), Content-Security-Policy: own origin plus mars.nasa.gov, trek.nasa.gov and astro.arcgis.com; script-src self only, Security headers in vercel.json (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy microphone only, COOP), Diagnostics check 15: security headers, COOP/COEP and CSP host list enforced, buildCommand, headers (+4 more)

### Community 46 - "App.tsx"
Cohesion: 0.13
Nodes (26): App(), Shell(), STEPS, LatLon, PlanState, Badge, Data, incidentId() (+18 more)

### Community 47 - "Requirement traceability against the official challenge page (PRD 5.1)"
Cohesion: 0.38
Nodes (7): 20 May 2024 solar storm: about 8,100 micrograys at Curiosity, F18 Space-weather scenario forcing a shelter decision (partial), F31 Second walk zone: boxwork ridges on Mount Sharp, Requirement traceability against the official challenge page (PRD 5.1), Boxwork ridges second walk zone on Mount Sharp (SITE-10, SITE-11), RAD-05: solar-storm dose used in the storm drill, SCI-05: boxwork ridges discovery card

### Community 48 - "package.json"
Cohesion: 0.18
Nodes (10): description, vite@8.3.5, engines, node, license, name, private, type (+2 more)

### Community 49 - "Scene: Science stop (photos, Log sample)"
Cohesion: 0.60
Nodes (5): Scene: Science stop (photos, Log sample), SCI-01 Gale habitable lake (Grotzinger et al. 2014), Optimistic rendering (log sample, add stop, toggle layer) with rollback, T12 Science stop card and sample log, Corpus card: Why Yellowknife Bay matters (habitable-lake)

### Community 50 - "Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds)"
Cohesion: 0.29
Nodes (6): data/manifest.json (222 files, 220.9 MB, SHA-256 per file), Facts registry: data/facts.json (Fact schema: id, value, unit, badge, sourceIds), File schemas (Fact, Source, GridHeader, Stops, Track, Lander, Gazetteer, Manifest), zod-validated at load, Research status labels: VERIFIED, SECONDARY, COMPUTED, ASSUMPTION, Supply chain: exact dependency pins, models pinned to Hugging Face commits and hash-checked, npm audit, Diagnostics checks 09 and 10: every fact has a badge and known source; every source has https, licence and credit

### Community 51 - "state.tsx"
Cohesion: 0.14
Nodes (14): Settings, Action, AppState, Ctx, IMAGERY, INITIAL, KEY, readInitial() (+6 more)

### Community 52 - "DLR (German Aerospace Center)"
Cohesion: 0.67
Nodes (3): DLR (German Aerospace Center), Schneegans et al. 2024, CGF: real-time atmospheres from Mie theory, F26 Physically based Mie sky (not built)

### Community 53 - "Dock.tsx"
Cohesion: 0.25
Nodes (15): Dock(), Line, SUGGEST, speechMode(), onVoiceState(), stopVoice(), heatCanvas(), planOk() (+7 more)

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
Cohesion: 0.20
Nodes (9): dependencies, cesium@1.146.0, @fontsource-variable/jetbrains-mono@5.3.0, lerc@2.0.0, lucide-react@1.63.0, react@19.3.1, zod@4.6.7, @fontsource-variable/jetbrains-mono (+1 more)

## Knowledge Gaps
- **28 isolated node(s):** `npm run dev (app and API relay at localhost:5173)`, `Feature flags as a plain constant object (switch off P1/P2 features in an emergency)`, `DATA-23: JPL 3D terrain at Dingo Gap built from Curiosity's cameras`, `Allison and McEwen 2000: Mars solar time and seasons`, `F17 Water and ice overlay (not built)` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 283 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **7 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BUILD_LOG.md: complete build record` connect `BUILD_LOG.md: complete build record` to `IMPLEMENTATION_PLAN.md`, `API relay and health`, `Assistant tools and eval`, `voice.ts`, `FEATURE_TICKETS.md`, `Diagnostics and tooling`, `Data loading and place search`, `Scene: Explore (Google-Earth style globe)`, `Requirements and traceability`, `Walk-back budgets and EVA limits`, `Security, privacy and CSP`, `Scene flow (APP_FLOW)`, `TypeScript config`, `Licences and compliance`, `IMPLEMENTATION_PLAN.md`, `UI_DESIGN_PROMPTS.md`, `FRONTEND_SPEC.md`, `OBSERVABILITY.md`, `Dock.tsx`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ReliveScene()` (e.g. with `placeable()` and `3. The main paths through the app (checked against the code)`) actually correct?**
  _`ReliveScene()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `npm run dev (app and API relay at localhost:5173)`, `Feature flags as a plain constant object (switch off P1/P2 features in an emergency)`, `DATA-23: JPL 3D terrain at Dingo Gap built from Curiosity's cameras` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.07142857142857142 - nodes in this community are weakly interconnected._
- **Why does `PRD.md: Homeward product requirements` connect `Requirements and traceability` to `IMPLEMENTATION_PLAN.md`, `Mars time, ephemeris and planner core`, `Rover view: photos and camera models`, `Assistant tools and eval`, `Globe, live layers and headers`, `voice.ts`, `BUILD_LOG.md: complete build record`, `Scene: Explore (Google-Earth style globe)`, `Naming and early decisions`, `Licences and compliance`, `IMPLEMENTATION_PLAN.md`, `Curiosity, Gale, REMS and RAD`, `Demo walk at Yellowknife Bay`, `F05 Marswalk planner with hard budgets and walk-back heat map`, `Perseverance, descent and sound`, `Presence and Dingo Gap (not built)`, `Requirement traceability against the official challenge page (PRD 5.1)`, `state.tsx`, `DLR (German Aerospace Center)`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `IMPLEMENTATION_PLAN.md` be split into smaller, more focused modules?**
  _Cohesion score 0.0502970297029703 - nodes in this community are weakly interconnected._
- **Why does `homeward-dev skill (build, run, test, extend)` connect `IMPLEMENTATION_PLAN.md` to `Mars time, ephemeris and planner core`, `Rover view: photos and camera models`, `Globe, live layers and headers`, `voice.ts`, `BUILD_LOG.md: complete build record`, `package.json`, `state.tsx`, `places.ts`, `Explore.tsx`, `Walk.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._