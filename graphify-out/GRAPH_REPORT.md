# Graph Report - martian-map-explorer-3f8c3e  (2026-11-14)

## Corpus Check
- 123 files · ~144,320 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 11 file(s) not represented in the graph (top: (none) 6, .csv 3, .example 1)

## Summary
- 1219 nodes · 3365 edges · 61 communities (53 shown, 8 thin omitted)
- Extraction: 88% EXTRACTED · 12% INFERRED · 0% AMBIGUOUS · INFERRED: 411 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `81dd23e7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- record.mjs
- IMPLEMENTATION_PLAN.md
- planner.ts
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
- Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)
- pipeline/corpus.md: discovery-card corpus
- Presence design: feeling there, from real numbers
- Demo walk at Yellowknife Bay
- Walk.tsx
- dependencies
- F05 Marswalk planner with hard budgets and walk-back heat map
- Perseverance, descent and sound
- Homeward films: script and plan
- npm scripts
- FRONTEND_SPEC.md
- Presence and Dingo Gap (not built)
- Zhurong (CNSA)
- Briefing.tsx
- vercel.json
- App.tsx
- Relive.tsx
- engines
- state.tsx
- fetch-models.mjs
- Plan.tsx
- sheet.sh
- Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)
- Project graph: how Homeward fits together
- ocToOg
- lerc.d.ts
- layers.ts
- voice.worker.ts
- common.py
- TAD.md
- fetch-models.mjs

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
- `3. The main paths through the app (checked against the code)` --references--> `Shell()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/App.tsx
- `3. The main paths through the app (checked against the code)` --references--> `ReliveScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Relive.tsx
- `3. The main paths through the app (checked against the code)` --references--> `WalkScene()`  [INFERRED]
  docs/PROJECT_GRAPH.md → app/src/scenes/Walk.tsx
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

## Communities (61 total, 8 thin omitted)

### Community 0 - "record.mjs"
Cohesion: 0.09
Nodes (22): build(), C, chunks(), DATASETS, dur(), lines, OUT, SHORT (+14 more)

### Community 1 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.14
Nodes (16): Planner grids, 2 m cells: slope, relief, elevation (site/gale, site/boxwork), oc_to_og(), og_to_oc(), build(), dtm_url(), horn_slope(), local_relief(), to_xy() (+8 more)

### Community 2 - "planner.ts"
Cohesion: 0.06
Nodes (63): CRUISE_MSV_PER_DAY, gcrDoseMSv(), missionDoseMSv(), SURFACE_MSV_PER_DAY, AU_KM, C_KMS, cross(), directionFromMars() (+55 more)

### Community 3 - "Rover view: photos and camera models"
Cohesion: 0.07
Nodes (69): add(), azEl(), Cahv, cross(), css(), dot(), frameCentre(), frameMatrix() (+61 more)

### Community 4 - "API relay and health"
Cohesion: 0.07
Nodes (44): hits, ipHash(), json(), log(), originAllowed(), rateLimit(), requestId(), resetRateLimits() (+36 more)

### Community 5 - "Assistant tools and eval"
Cohesion: 0.06
Nodes (44): ctx, Answer, ask(), Lang, Msg, Persona, a, allowed() (+36 more)

### Community 6 - "globe.ts"
Cohesion: 0.06
Nodes (49): Vec3, ocToOg(), ogToOc(), Moon, moonPosition(), MoonTable, Orbiter, orbiterPosition() (+41 more)

### Community 7 - "voice.ts"
Cohesion: 0.07
Nodes (26): loadWhisper(), Rec, SR, startListening(), toMono16k(), generate(), listeners, loadVoice() (+18 more)

### Community 8 - "FEATURE_TICKETS.md"
Cohesion: 0.17
Nodes (19): Scene: Credits (every source by agency, AI disclosure), data/sources.json (74 sources with licence, credit, status), T00 Diagnostics script (done: 20 checks), T01 Scaffolding and pinned dependencies, T02 Mars24 time module, T03 Ephemeris and light time, T05 Data loader, schemas, facts by ID, T09 Planner panel (+11 more)

### Community 9 - "Diagnostics and tooling"
Cohesion: 0.09
Nodes (15): End of every session: changelog, manifest, tests, typecheck, diagnostics, browser check, ?debug=1 overlay (fps, planner timings, manifest dates, last provider, log lines), Error classification (UserError, OriginError, RateLimited, ExternalError, SystemError, DataError), Incident ID with Copy error report (the whole error-tracking system for v1), Diagnostics: 20 checks with fix hints, args, CI, P() (+7 more)

### Community 10 - "BUILD_LOG.md: complete build record"
Cohesion: 0.17
Nodes (24): Recovery prompts for a drifting AI (hallucination, context loss, conflicts, behaviour, emergency), BUILD_LOG.md: complete build record, build/MANIFEST.md: chunk status and cut list, build/PLAN-2.md: research, decisions D15-D20, chunks 10-16, CHANGELOG.md: session history and handoff, Open item: Esri terms for astro.arcgis.com tiles unconfirmed (fallback: Viking default layer), Open item: 200 m terrain at landing sites other than Gale, Session 3b (6 Nov 2026): documents to 2.0, licences, GitHub push (+16 more)

### Community 11 - "Data loading and place search"
Cohesion: 0.13
Nodes (17): DataError, Fact, Gazetteer, getJson(), Image, ImageryLayer, Lander, loadData() (+9 more)

### Community 12 - "Scene: Explore (Google-Earth style globe)"
Cohesion: 0.13
Nodes (18): Allison and McEwen 2000: Mars solar time and seasons, Murray Lab global CTX mosaic, 5 m, HiRISE DTMs and orthoimages (USGS STAC), Mars24 algorithm (Mars solar time, sols, Ls), Mars Odyssey orbiter, Mars Climate Database v6.1 (LMD), NASA MMGIS rover waypoints and traverses, Mars Reconnaissance Orbiter (MRO) (+10 more)

### Community 13 - "SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633)"
Cohesion: 0.29
Nodes (11): SITE-01 Habitat: Bradbury Landing (lat -4.589467, lon 137.441633), SITE-07 Ocentric-to-ographic latitude offset at Bradbury: 0.0543 deg, 3.21 km, T04 Frame conversion to Cesium, T06 Mars viewer on own tiles and Gale camera, T27 Every-agency layers (partial), T28 Water and ice overlay (not built), T32 Mission pins and site cards (12 landers), T34-T38 P2 tickets: landing-site check, Kannada/Hindi, prologue, more weather, Mie sky (not built) (+3 more)

### Community 14 - "Requirements and traceability"
Cohesion: 0.13
Nodes (19): NASA Exploration EVA Concept of Operations 2020 (NTRS 20200001071), Suit limits: EVAs up to 8 hours, within 2 km (lunar-derived), PRD.md: Homeward product requirements, EVA-01: life support lasts about 8 hours, EVA-03: suit slope limit of 20 degrees, F05 Marswalk planner with hard budgets and walk-back heat map, F16 Measurement tools (partial), F17 Water and ice overlay (not built) (+11 more)

### Community 15 - "Walk-back budgets and EVA limits"
Cohesion: 0.23
Nodes (13): EVA-01 EVA duration up to 8 h (NASA EVA ConOps 2020, lunar-derived), EVA-02 Walking radius 2 km from the lander, EVA-03 Suited slope capability up to 20 deg, EVA-04 Walk-back planning rate 3.3 km/h (Apollo 17), A* route search with an admissible heuristic (distance over 3.93 km/h), T08 Planner worker: walk-back field, A*, budgets, Tobler hiking function scaled to 3.3 km/h on flat ground (ASSUMPTION), Life support budget: 8 hours minus a 30-minute reserve (+5 more)

### Community 16 - "Security, privacy and CSP"
Cohesion: 0.24
Nodes (9): npm run build then npm run preview (sends the vercel.json headers, CSP included), Content-Security-Policy: own origin plus mars.nasa.gov, trek.nasa.gov and astro.arcgis.com; script-src self only, Input validation with zod (relay body, URL hash params, worker messages, tool calls, manifests), Model output is never executed: only known tool names with zod-valid arguments run (prompt-injection control), Rate limiting: 30 relay calls per IP per 10 minutes, in memory per function instance, Secrets: provider keys and ALLOWED_ORIGINS only in Vercel env and .env.local, never VITE_ prefixed, Threat model (keys, free-tier quotas, speech and questions, app integrity, model output, credibility, competition standing), Diagnostics checks 03 and 04: env placeholders listed, no secrets in tracked files (+1 more)

### Community 17 - "Scene flow (APP_FLOW)"
Cohesion: 0.19
Nodes (19): Deep-linkable URL hash state restored on reload or shared link, First-time experience and microphone permission gate (text input always available), Scene: Briefing (conditions and limits), Scene: Debrief (plan versus actual, export, share), Scene: Descent to Gale, Scene: Explore (Google-Earth style globe, added 1 Nov 2026), Scene: Mars now / Mission clock, Scene: Orbit (true-scale Mars, Earth, moons) (+11 more)

### Community 18 - "Naming and early decisions"
Cohesion: 0.21
Nodes (11): Session 1b (28 Oct 2026): open questions answered, plan revised, Cesium Mars (Cesium ion 3D Tiles), Eight public competitor entries (Protikriti, Mars Traverse, MARSWAY, MarsNav and others), Judging criteria: Influence, Creativity, Validity, Relevance, Presentation, Challenge: Interplanetary Survival Guide, Martian Map, OpenAI Realtime API (paper's main voice choice; rejected as paid), Red Atlas (recommended design and working name), NASA Space Apps Challenge 2026 (14-15 Nov 2026) (+3 more)

### Community 19 - "TypeScript config"
Cohesion: 0.12
Nodes (16): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+8 more)

### Community 20 - "TESTING_STRATEGY.md"
Cohesion: 0.18
Nodes (11): npm test (vitest unit tests, golden NASA/ESA checks), DATA-13 JPL approximate planetary elements (Table 1), DATA-14 Mars24 algorithm (Allison and McEwen 2000, NASA GISS), SITE-03 Straight-line habitat to stop: 443 m, TIME-05 One-way light time on 14 Nov 2026: 11.01 min (round trip 22.0 min), Performance budgets (250 KB app JS, 30 fps walk, route under 300 ms, about 300 MB offline cache), CI: GitHub Actions (npm ci, typecheck, test, build, diag), Playwright end-to-end demo path (planned, not built) (+3 more)

### Community 21 - "Licences and compliance"
Cohesion: 0.14
Nodes (27): docs/DATA_SPEC.md: data files, facts registry, provenance, licences, DATA-01 Own Mars tiles (planned terrain and imagery pyramids), DATA-03 HiRISE DTM DTEEC_010573_1755 (1 m, CC0), DATA-21 MOLA-HRSC Blended DEM Global 200 m v2, DATA-22 Viking Colorized Global Mosaic 232 m (MDIM 2.1), DATA-24 MSL Gale Merged Orthophoto Mosaic 25 cm, DATA-25 THEMIS thermal inertia mosaic, DATA-26 HiRISE DTMs over the boxwork site (+19 more)

### Community 22 - "IMPLEMENTATION_PLAN.md"
Cohesion: 0.12
Nodes (24): Assistant turn: push-to-talk, brain call, tools in the browser, answer with source chips, Kokoro voice, npm run dev (app and API relay at localhost:5173), npm run diag / node scripts/diagnostics.mjs --base <url> (PASS/FAIL per check), npm run models (voice and speech models, about 130 MB, once), Structured JSON log format (requestId, ipHash, provider, fallbacks; never question or answer text), Origin allow-list and CORS (ALLOWED_ORIGINS, no wildcards, no credentials), 40-question assistant eval (right value, named source, zero unsupported numbers), T16 Offline assistant (+16 more)

### Community 23 - "Dev dependencies"
Cohesion: 0.12
Nodes (20): description, devDependencies, @types/react@19.3.0, @types/react-dom@19.3.0, typescript@7.0.2, @vercel/node@28.0.1, vite@8.3.5, @vitejs/plugin-react@6.1.2 (+12 more)

### Community 24 - "Explore.tsx"
Cohesion: 0.09
Nodes (32): fmtScale(), GeoMap, Identify, inside(), loadMaps(), mapsAt(), MapsFile, parseUnit() (+24 more)

### Community 25 - "Curiosity, Gale, REMS and RAD"
Cohesion: 0.21
Nodes (12): Curiosity rover (Mars Science Laboratory), Dingo Gap 3D Tiles demo (NASA-AMMOS 3DTilesRendererJS), Gale's ancient habitable lake, Gale Crater (recommended site), Grotzinger et al. 2014, Science: habitable lake at Yellowknife Bay, Hassler et al. 2014, Science: Mars surface radiation environment, RAD radiation detector on Curiosity, Surface radiation dose 0.64 mSv/day at Gale (+4 more)

### Community 26 - "Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)"
Cohesion: 0.27
Nodes (9): Session 1 (28 Oct 2026): planning from the research paper, Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026), Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR), Ranked feature list 1-18 with cut line (paper section 11), Where Mars is during the hackathon (computed: MY39, Ls 21.8, sunrise at Gale 13:47 IST), Earth-Mars radio delay (11.0 min one way on 14 Nov 2026), F22 Landing-site safety check (not built), F23 Kannada and Hindi mode (not built) (+1 more)

### Community 27 - "pipeline/corpus.md: discovery-card corpus"
Cohesion: 0.24
Nodes (11): Scene: Event (dust devil, solar-storm drill), EVT-01 Perseverance dust devil, 30 Aug 2023, RAD-01 Surface dose rate at Gale: 0.64 mSv/day (Hassler et al. 2014), RAD-05 Largest surface radiation event, 20 May 2024: about 8,100 micrograys, Curiosity sol 3-166 path validation: at least 95% walkable under our rules (measured 100%), T23 Dust devil event, T29 Space-weather scenario (partial), Radiation budget: 0.64 mSv per day background; solar storm forces a shelter decision (+3 more)

### Community 28 - "Presence design: feeling there, from real numbers"
Cohesion: 0.32
Nodes (7): Calm-cockpit rules (one primary HUD number, every warning comes with the next action), PLN-12 Horizon distance at 1.7 m eye height: 3.39 km, SND-01 Speed of sound on Mars: about 240-250 m/s; high pitches fade within about 8 m, Comfort settings (field of view, head bob, vignette, snap turn; not built), T10 Walk mode and HUD (walk it yourself since 1 Nov), T30 Martian sound engine (partial), T40 Presence cues and comfort settings (partial)

### Community 29 - "Demo walk at Yellowknife Bay"
Cohesion: 0.25
Nodes (8): Planner validation: Curiosity's sol 3-166 path is 100% walkable on the real HiRISE grid, F07 Science stop at Yellowknife Bay, Bradbury Landing habitat start (SITE-01), Demo walk: Bradbury Landing to Yellowknife Bay, 443 m, MSL Gale Merged Orthophoto Mosaic, 25 cm (DATA-24), Scenario date 14 Nov 2026: Mars Year 39, Ls 21.6, light time 11.0 min (TIME-01..05), SCI-01: ancient habitable lake at Yellowknife Bay (Grotzinger et al. 2014), Yellowknife Bay science stop, John Klein drill site (SITE-02)

### Community 30 - "Walk.tsx"
Cohesion: 0.10
Nodes (28): load(), setAmbient(), EARTH_MEAN_R_M, FLY_MAX_M, FLY_MIN_M, flyStep(), haversineM(), horizonM() (+20 more)

### Community 31 - "dependencies"
Cohesion: 0.18
Nodes (6): Session 3 (1 Nov 2026): Explore, Rover view, walk yourself (version 2.0), Meta tags and JSON-LD WebApplication (og.png not made yet, so og:image removed), @fontsource-variable/inter@5.3.0, react-dom@19.3.1, @fontsource-variable/inter, react-dom

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
Cohesion: 0.16
Nodes (10): app/src/styles/tokens.css: design tokens, Phrases for an AI assistant (setup, fix, UI, features, demo, deployment, emergency, status), Badge colour tokens (--badge-live to --badge-generated), Colour tokens with measured WCAG contrast ratios, Track and ruler colour tokens (--color-track-msl, -m20, -heli, --color-measure), Design direction: a scientist's instrument over a real planet (quiet glass panels, one butterscotch accent), Explore layout: map-app globe with 44 px glass controls, cursor pill, track legend, Mars sky look checklist (butterscotch sky, small Sun, no faked sunset glow) (+2 more)

### Community 37 - "Presence and Dingo Gap (not built)"
Cohesion: 0.29
Nodes (7): DATA-23: JPL 3D terrain at Dingo Gap built from Curiosity's cameras, F29 Presence design (partial), F30 Rover-scale 3D scene at Dingo Gap (not built), PLN-12: real horizon distance 3.39 km at eye height, Dingo Gap, Curiosity sol 528 (SITE-08, SITE-09), Not built list (README section 13), PLN-13: sunlight 39% of Earth's on 14 Nov (light scaling not built)

### Community 44 - "Briefing.tsx"
Cohesion: 0.15
Nodes (23): App(), Shell(), Arrival, donkiMs(), latestRems(), loadRems(), loadSpaceWeather(), num() (+15 more)

### Community 45 - "vercel.json"
Cohesion: 0.11
Nodes (11): Security headers in vercel.json (HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy microphone only, COOP), dir, lines, speed, Diagnostics check 15: security headers, COOP/COEP and CSP host list enforced, buildCommand, headers, outputDirectory (+3 more)

### Community 46 - "App.tsx"
Cohesion: 0.13
Nodes (28): STEPS, Dock(), Line, SUGGEST, speechMode(), onVoiceState(), stopVoice(), lightTimeMin() (+20 more)

### Community 47 - "Relive.tsx"
Cohesion: 0.18
Nodes (10): DATA-04 MSL waypoints from NASA MMGIS, data/places/gazetteer.json (2,051 IAU names from the USGS Gazetteer), data/rovers/cache: offline copies of four featured Rover view stops (8.1 MB), data/rovers: msl/m20 stops, tracks and Ingenuity flights (1,386 Curiosity and 708 Perseverance waypoints), featured(), ingenuity(), lines_of(), mer() (+2 more)

### Community 51 - "state.tsx"
Cohesion: 0.15
Nodes (13): Action, AppState, Ctx, IMAGERY, INITIAL, KEY, readInitial(), reducer() (+5 more)

### Community 52 - "fetch-models.mjs"
Cohesion: 0.29
Nodes (7): DLR (German Aerospace Center), ESA, Mars Express (HRSC stereo camera), MOLA-HRSC blended DEM, 200 m, Schneegans et al. 2024, CGF: real-time atmospheres from Mie theory, USGS Astrogeology, F26 Physically based Mie sky (not built)

### Community 53 - "Plan.tsx"
Cohesion: 0.25
Nodes (23): heatCanvas(), Layers, useRuntime(), ExploreScene(), fmtDistance(), GroundDetail(), hasSiteMosaic(), LanderCard() (+15 more)

### Community 55 - "Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)"
Cohesion: 0.43
Nodes (5): fold(), parseLatLon(), Place, searchPlaces(), all

### Community 56 - "Project graph: how Homeward fits together"
Cohesion: 0.40
Nodes (4): 1. What is in it (13 Nov 2026), 2. Connection check (the team asked that every connection works), 4. Keeping it current, Project graph: how Homeward fits together

### Community 59 - "ocToOg"
Cohesion: 0.18
Nodes (10): dependencies, @fontsource-variable/jetbrains-mono@5.3.0, kokoro-js@1.2.1, lerc@2.0.0, lucide-react@1.63.0, react@19.3.1, zod@4.6.7, @fontsource-variable/jetbrains-mono (+2 more)

### Community 61 - "layers.ts"
Cohesion: 0.12
Nodes (16): toCesium(), homeward-facts: workflow for adding a fact, source or data file, Source status labels: VERIFIED, SECONDARY, UNVERIFIED, data/places/landers.json, Claim labels: VERIFIED, SECONDARY, UNVERIFIED, RECOMMENDATION, COMPUTED, ASSUMPTION, main(), pipeline/facts.csv: facts registry source (id, value, unit, badge, sources), pipeline/landers.csv: lander coordinates with badge and sources (+8 more)

### Community 63 - "voice.worker.ts"
Cohesion: 0.13
Nodes (13): Regenerate data: pipeline script order (snapshot, make_grid, make_rasters, make_moons, fetch_audio, rovers, build_facts, build_corpus, manifest), data/sky/moons.json (Phobos and Deimos hourly vectors from JPL Horizons), data/audio/supercam-sol001-wind.mp3 (Perseverance SuperCam microphone), USGS Gazetteer of Planetary Nomenclature, get(), vectors(), vectors(), gazetteer() (+5 more)

### Community 69 - "common.py"
Cohesion: 0.23
Nodes (6): Data pipeline steps (deterministic and idempotent: same inputs, same bytes out), main(), sha256(), write_json(), pipeline/corpus.md: discovery-card corpus, main()

### Community 70 - "TAD.md"
Cohesion: 0.17
Nodes (12): Known traps (hidden pane, heredoc backspace, ONNX path, Kokoro in its worker, no Cesium in scenes, CesiumWidget, OcentricTiling, golden-tested camera), app/public/sw.js: offline service worker, data/manifest.json (222 files, 220.9 MB, SHA-256 per file), Supply chain: exact dependency pins, models pinned to Hugging Face commits and hash-checked, npm audit, Diagnostics check 18: startup JavaScript budget (scenes must not import Cesium), Measured values (startup JS 140 KB gzip, offline payload 220.9 MB, frame rate not yet measured on the weakest laptop), Rendering quality presets (High, Medium, Low; automatic drop after 10 s under 20 fps), Esri OnMars hosting terms for CTX and HiRISE tiles (UNVERIFIED) (+4 more)

### Community 71 - "fetch-models.mjs"
Cohesion: 0.25
Nodes (3): expected, MODELS, ORT_FILES

## Knowledge Gaps
- **28 isolated node(s):** `Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR)`, `Allison and McEwen 2000: Mars solar time and seasons`, `F17 Water and ice overlay (not built)`, `F24 Journey prologue (not built)`, `F25 More route weather: dusk clouds, frost, storm warning (not built)` (+23 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 288 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BUILD_LOG.md: complete build record` connect `BUILD_LOG.md: complete build record` to `IMPLEMENTATION_PLAN.md`, `planner.ts`, `API relay and health`, `Assistant tools and eval`, `globe.ts`, `voice.ts`, `FEATURE_TICKETS.md`, `Diagnostics and tooling`, `Data loading and place search`, `Requirements and traceability`, `Security, privacy and CSP`, `Scene flow (APP_FLOW)`, `TypeScript config`, `IMPLEMENTATION_PLAN.md`, `FRONTEND_SPEC.md`, `vercel.json`, `App.tsx`, `voice.worker.ts`, `common.py`, `TAD.md`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `ReliveScene()` (e.g. with `placeable()` and `3. The main paths through the app (checked against the code)`) actually correct?**
  _`ReliveScene()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `Existing Mars tools (Mars Trek, NASA's Eyes, Explore with Perseverance, JMARS, OpenSpace, CosmoScout VR)`, `Allison and McEwen 2000: Mars solar time and seasons`, `F17 Water and ice overlay (not built)` to the rest of the system?**
  _28 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `record.mjs` be split into smaller, more focused modules?**
  _Cohesion score 0.09113300492610837 - nodes in this community are weakly interconnected._
- **Why does `PRD.md: Homeward product requirements` connect `Requirements and traceability` to `F05 Marswalk planner with hard budgets and walk-back heat map`, `Perseverance, descent and sound`, `planner.ts`, `Rover view: photos and camera models`, `Assistant tools and eval`, `globe.ts`, `Presence and Dingo Gap (not built)`, `BUILD_LOG.md: complete build record`, `Scene: Explore (Google-Earth style globe)`, `Naming and early decisions`, `layers.ts`, `state.tsx`, `Licences and compliance`, `IMPLEMENTATION_PLAN.md`, `fetch-models.mjs`, `Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)`, `Demo walk at Yellowknife Bay`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `IMPLEMENTATION_PLAN.md` be split into smaller, more focused modules?**
  _Cohesion score 0.14112903225806453 - nodes in this community are weakly interconnected._
- **Why does `homeward-dev skill (build, run, test, extend)` connect `BUILD_LOG.md: complete build record` to `IMPLEMENTATION_PLAN.md`, `planner.ts`, `Rover view: photos and camera models`, `common.py`, `TAD.md`, `globe.ts`, `Relive.tsx`, `state.tsx`, `Dev dependencies`, `Research paper: Interplanetary Survival Guide, Martian Map (28 Oct 2026)`, `Explore.tsx`, `layers.ts`, `Walk.tsx`, `voice.worker.ts`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._