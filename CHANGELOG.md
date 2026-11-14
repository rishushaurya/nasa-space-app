# Changelog: Homeward

> Version 3.0.0 | 2026-11-13 | Newest entry first. Every session adds one entry before it ends.

## 2026-11-14 | Claude Opus 5.5 | Session 5c (version 4.0: the five NASA resources)

**Description**: The team asked to research the five resources the official statement lists and build each into Homeward. Research pass, `build/PLAN-4.md` (D28-D33, chunks 28-34), then the build, checked under the production headers.

**Changes**:
- Created: `build/PLAN-4.md`, `app/src/data/usgs.ts` (+test), `pipeline/usgs_maps.py`, `app/public/data/usgs/mars-maps.json`
- Modified: `globe/live.ts` (Viking 1 and 2 HiRISE, CTX, HRSC site mosaics), `globe/layers.ts` (`min` level), `scenes/Explore.tsx` (rock unit and USGS maps on every place and lander card, "Show the site mosaic", photo notes), `rovers/library.ts` (+test; PIA23179 pinned for Curiosity), `rovers/raw.ts` (+test; `latest`, `totals`, camera list), `scenes/Relive.tsx` ("Newest from Mars", "Stand at this stop"), `scenes/Plan.tsx` ("Practised on Earth first" from NASA GIBS), `core/frames.ts` (+test; Earth mean radius), `vercel.json` and `scripts/diagnostics.mjs` (CSP D33: gibs.earthdata.nasa.gov images), `pipeline/facts.csv` (EARTH-01, EARTH-02), `pipeline/sources.csv` (USGS-PGM-MAP-DB, MARS-INSTITUTE-HMP, NASA-GIBS; TREK-SITE-HIRISE widened)
- Documents: README (header, file map, D28-D33, section 13), CLAUDE.md, MANIFEST, BUILD_LOG section 14, DATA_SPEC 0.3, COMPLIANCE, homeward-dev skill

**Diagnostics**: 19 PASS, 0 FAIL, 1 SKIP (17 needs the deployed URL). Tests: 81 passed in 16 files. Startup JS 150 KB gzip.

**Known Issues**:
- Not deployed: the live site still runs 3.0 until this is committed and pushed (Vercel deploys `main`).
- NASA's raw-image feeds refuse headless browsers, so "Newest from Mars" was checked in the browser pane, not by script.
- HLS imagery for a chosen date is often cloudy or empty at 75 N (polar night November to February); the panel says so.

**NEXT AI SHOULD**: If the team agrees, commit and push (no co-author line), then run `node scripts/diagnostics.mjs --base https://nasa-space-app-drab.vercel.app`. Then the open items in CLAUDE.md.

---

## 2026-11-14 | Claude Opus 5.5 | Session 5b (Vercel deploy)

**Description**: The team asked for a $0 deploy with all environment variables. Deployed on Vercel Hobby (free; no card; over-limit usage pauses, never bills) with the CLI: project `nasa-space-app`, connected to `rishushaurya/nasa-space-app` so pushes to `main` redeploy. Live at https://nasa-space-app-drab.vercel.app.

**Changes**:
- Fixed: the server functions crashed on Vercel (`ERR_MODULE_NOT_FOUND`: Node's ES modules need the `.js` ending on relative imports); `api/v1/assistant.ts`, `health.ts`, `spaceweather.ts` now import `../_lib/*.js` (TypeScript resolves them to the `.ts` files; tests unchanged)
- Created: `.vercelignore` (keeps a CLI upload under Hobby's 100 MB: no models, Cesium copy, film output, graph cache)
- Vercel Production variables: `ALLOWED_ORIGINS` (the live URL), `IP_SALT` (random), `GEMINI_MODEL`, `GROQ_MODEL`, `OPENROUTER_MODEL`. The four API keys were not available; the team adds them in Project Settings and redeploys
- Documents: README section 14, CLAUDE.md

**Diagnostics**: `node scripts/diagnostics.mjs --base https://nasa-space-app-drab.vercel.app`: 20 PASS, 0 FAIL, 0 SKIP (health `healthy-offline-assistant`). Live in a real browser: REMS feed, raw-image API, MDEM200M, NASA image library and `/api/v1/spaceweather` all 200 under the production CSP; tests 73 passed; typecheck clean.

**Known Issues**:
- The GitHub copy of `main` still has the old imports until this fix is pushed; a push from GitHub before then would deploy functions that crash.
- Esri does not serve some low-zoom CTX tiles (for example 1/0/2); the globe falls back, the console shows a CORS error for each.

**NEXT AI SHOULD**: If the team agrees, commit and push (no co-author line) so GitHub deploys match. Remind the team to add the four free keys in Vercel and redeploy, then re-run the diagnostics.

---

## 2026-11-14 | Claude Opus 5.5 | Session 5 (demo films)

**Description**: The team asked for a story-style film that explains the whole project, with a natural female voice, calm space music and real Mars sound. Space Apps allows a 30-second video, so two films come from one set of real recordings: `homeward-30s.mp4` (submission) and `homeward-story.mp4` (2:20, to show anyone). Everything is free and runs on this machine.

**Changes**:
- Created: `film/SCRIPT.md` (one thing, three storylines with the pick, look and sound, shot-by-shot script for both films, how they are made), `film/lines.json` (narration), `film/record.mjs` (records each shot from the real app: headless Chrome on the GPU, DevTools screencast, about 60 fps, to 30 fps MP4), `film/voice.mjs` (Kokoro-82M fp32, voice `af_heart`), `film/music.py` (MusicGen medium, three moods), `film/make.mjs` (cuts to the voice, titles, burned-in subtitles and `.srt`, music ducked under the voice, NASA's Mars wind, -14 LUFS), `film/sheet.sh` (contact sheets for review), `film/.gitignore` (`out/`)
- Modified: README (file map; Credits count 74 to 88, the real count in `sources.csv`), CLAUDE.md, `legal/COMPLIANCE.md` (demo row, AI disclosure rows, checklist note), `TEAMMATE_GUIDE.md` section 11
- Real sound: Perseverance SuperCam sol 4 wind (NASA/JPL-Caltech/LANL/CNES) from nasa.gov "Sounds from Beyond", downloaded at build time, not committed
- Found while recording: NASA's raw-image and weather services refuse headless browsers, so Rover view shots use the four featured stops the app keeps (`pipeline/rovers.py` FEATURED) and the briefing shot shows measured conditions rather than the live REMS panel; a hash-only URL change does not reload the app, so each shot loads with a new query string; ffmpeg 8 renamed `-filter_complex_script` to `-/filter_complex`

**Diagnostics**: no app code changed. Narration checked with Whisper tiny.en against `lines.json` (every line matches; "and cited" sounded like "incited", so that line was reworded). Films: 30-second cut 30.0 s (-15.5 LUFS, peak -1.4 dBFS); story film 2:19 (-14.7 LUFS, peak -1.4 dBFS); music sits about 9 dB under the voice in the gaps and is ducked under speech. Tests 73 passed; typecheck clean; diagnostics 19 PASS, 0 FAIL, 1 SKIP; `graphify update .` run.

**Known Issues**:
- The first cut was made at about 02:30 on 14 Nov, before the event window (09:00). Re-run `film/SCRIPT.md` section 6 after 09:00 for the submitted film.
- The walk shot's ground is the 200 m relief at eye level (HiRISE tiles were still streaming); the helmet display is the subject of that shot.

**NEXT AI SHOULD**: After 09:00 on 14 Nov, start `npm run dev`, then re-run the film pipeline (`film/SCRIPT.md` section 6), watch both films end to end, and help the team host the 30-second film publicly with its `.srt`. Then: deploy on Vercel and run `node scripts/diagnostics.mjs --base <url>`; confirm Esri's terms.

---

## 2026-11-13 | Claude Fable 5.2, Claude Opus 5.5 | Session 4 (version 3.0: whole-Mars 3D, every visited place, live conditions)

**Description**: The team asked for a project graph, a check of the build against the official statement, real data everywhere, better controls and less lag, every visited place as a Google-Maps-style ride, and whole-planet Google Earth. Research pass (every endpoint opened and its headers checked), then `build/PLAN-3.md` (statement-by-statement comparison, findings, decisions D21-D27, chunks 17-26), then the build, checked in the dev server and under the production headers.

**Changes**:
- Created: `build/PLAN-3.md`, `docs/PROJECT_GRAPH.md`, `.graphifyignore`, `graphify-out/` (graph.json, graph.html, GRAPH_REPORT.md), `app/src/globe/dem.ts` and `dem.worker.ts` (+test, `lerc.d.ts`), `app/src/rovers/library.ts` (+test), `app/src/core/conditions.ts` (+test), `app/src/core/los.ts` (+test), `app/src/core/orbiters.test.ts`, `api/v1/spaceweather.ts` (+test), `pipeline/make_orbiters.py`, data `rovers/mer-a-track.json`, `rovers/mer-b-track.json`, `sky/orbiters.json`
- Modified: `globe.ts` (live 200 m relief behind our fine rasters; render on demand; overlays; orbiters), `live.ts` and `layers.ts` (overlay definitions, bounded providers), `Explore.tsx` (overlays and opacity, MER tracks, landing-site tour, lander photos and viewer, drive-path facts, live terrain line), `Relive.tsx` (ride), `Briefing.tsx` (latest measured weather, space weather), `Walk.tsx` (radio line of sight), `Flight.tsx` (orbiters overhead), `moons.ts` (shared state interpolation), `load.ts` (orbiters), `state.tsx` (overlays), `App.tsx`, `ui.tsx` (MODELLED help), `tokens.css` (MER and orbiter colours), `rovers/raw.ts` (track metadata), `pipeline/rovers.py` (`mer` step, steps by name), `sources.csv` (+14 sources), `landers.csv` (Schiaparelli), `vercel.json` and `diagnostics.mjs` (CSP D24), `.env.example` (`NASA_API_KEY`), `package.json` (`lerc` 2.0.0 pinned; already a Cesium dependency)
- Documents: README (header, file map, D21-D27, keys, diagnostics, section 13), CLAUDE.md, MANIFEST, PLAN-3, BUILD_LOG section 13, DATA_SPEC 0.2, SECURITY_ACCESS, PRIVACY_POLICY, COMPLIANCE, the homeward-dev skill
- Found and fixed while testing: NASA's image library links previews at different sizes (Spirit's are `~small`), so the first filter dropped every Spirit photo; some older photos have no `~medium` size (viewer falls back to `~orig`); Horizons' predicted ephemerides end on different dates (MRO 30 Nov 2026), so the pipeline stops each orbiter at its published end; heredoc edits broke on apostrophes again (edit scripts are written as files)

**Diagnostics**: 19 PASS, 0 FAIL, 1 SKIP (17, needs the deployed URL). Tests: 73 passed in 15 files. Startup JS 146 KB gzip. Production preview: no CSP violations in Explore (overlays, tracks, photos, live relief), Briefing and Orbit.

**Known Issues**:
- `/api/v1/spaceweather` needs the dev server or Vercel; `npm run preview` has no API, so the space-weather panel shows its error state there.
- Some library "photos" are maps or charts NASA filed under the mission (for example a Spirit elevation map); they are real NASA products with credits.
- MRO disappears from the orbit view after 30 Nov 2026 (end of its published ephemeris); re-run `pipeline/make_orbiters.py` to extend.
- The live terrain and the overlays need the network; offline the globe uses our own rasters as before.

**NEXT AI SHOULD**: Read `CLAUDE.md` and `docs/PROJECT_GRAPH.md`, run `npm test` and `npm run diag`, then ask the team what is next. Open items: deploy on Vercel (add `NASA_API_KEY`) and run `node scripts/diagnostics.mjs --base <url>`; confirm Esri's terms for OnMars CTX, HiRISE and MDEM200M; re-run `make_orbiters.py` before 30 Nov 2026; InSight raw images by sol if wanted; Dingo Gap 3D stays deferred.

---

## 2026-11-07 | Claude Opus 5.5 | Session 3c (handoff)

**Description**: Made the starting point obvious for the next session. No code changed.

**Changes**:
- Modified: `CLAUDE.md` (new "Where to begin" section: what is done, what is open, first move), `README.md` (section 3 points to it; section 14 names the GitHub repository), `build/MANIFEST.md` (progress rows for 6 and 7 Nov; open checks), `AI_RECOVERY.md`, `COMMANDS.md` (clone and push lines), `BUILD_LOG.md` (12.5); Claude memory for this project (where to begin, repository, no co-author rule).

**Diagnostics**: 17 PASS, 0 FAIL, 3 SKIP (`--quick`). Tests: 52 passed.

**NEXT AI SHOULD**: Read `CLAUDE.md` "Where to begin", run `npm test` and `npm run diag`, then ask the team what they want next. If they give no direction: deploy on Vercel from GitHub and run `node scripts/diagnostics.mjs --base <url>`; confirm Esri's tile terms; then 200 m terrain at the other landing sites.

---

## 2026-11-06 | Claude Opus 5.5 | Session 3b (documents to 2.0, licences, GitHub)

**Description**: Every document and both `.claude` skills brought to the 2.0 as-built state so a new session starts with full knowledge; plan-era claims the app does not back up were removed (Dingo Gap 3D ground, an ice layer, data from every agency). The project was pushed to GitHub.

**Changes**:
- Modified: `CLAUDE.md` (2.0 start steps, D1-D20, PLAN-2, BUILD_LOG section 12, CSP rule, preview check), both skills (scene map, Rover view essentials, traps, landers and live layers), AI_RECOVERY, TEAMMATE_GUIDE (demo order, pitch, film, judge Q&A without false claims), FEATURE_TICKETS (T10, T18, T26, T27, T32, T43), MENTAL_MODEL, PRD, APP_FLOW, TAD, IMPLEMENTATION_PLAN, COMMANDS, docs/TESTING_STRATEGY (52 tests), docs/FRONTEND_SPEC, docs/SEO_PERFORMANCE, docs/OBSERVABILITY, design/DESIGN_TOKENS (track tokens), design/UI_DESIGN_PROMPTS, legal/COMPLIANCE (rows for CTX, HiRISE, Trek, rover images, MMGIS, Gazetteer), security checklist; `app/index.html` description now matches the app.
- Licences checked: the OnMars CTX service states that the Caltech Murray Lab grants free use of beta01 for all purposes (credit NASA/JPL/MSSS/The Murray Lab), now in `pipeline/sources.csv`; Esri's own hosting terms are not stated anywhere found (open item below). The HiRISE layer note now says patches can sit hundreds of metres off, as the service itself warns.
- Repository: pushed to https://github.com/rishushaurya/nasa-space-app (branch `main`). `HEALTHSYNC_AI_Humanized.pdf` stays untracked (not part of the project).

**Diagnostics**: 19 PASS, 0 FAIL, 1 SKIP (17, needs the deployed URL). Tests: 52 passed in 9 files.

**Known Issues**:
- Esri's terms for public astro.arcgis.com services are not confirmed (`legal/COMPLIANCE.md` section 4). If they forbid this use, make Viking (NASA Trek) the default layer in `app/src/state.tsx`.

**NEXT AI SHOULD**: Ask the team what they want next (they lead priorities). Otherwise: deploy to Vercel from the GitHub repository and run `node scripts/diagnostics.mjs --base <url>`; confirm Esri's terms; consider 200 m terrain at the other landing sites (`build/PLAN-2.md` section 5). Dingo Gap 3D stays deferred until the team asks.

---

## 2026-11-01 | Claude Opus 5.5 | Session 3 (Explore, Rover view, walk yourself)

**Description**: Research pass, then `build/PLAN-2.md` (findings, decisions D15-D20, chunks 10-16), then chunks 10-16 built and checked in the browser with the pane visible (desktop and 375 px). Full record in `BUILD_LOG.md` section 12.

**Changes**:
- Created: `build/PLAN-2.md`, `pipeline/rovers.py`, `pipeline/landers.csv`, `app/src/core/camera.ts` (+test), `app/src/core/places.ts` (+test), `app/src/rovers/raw.ts` (+test), `app/src/globe/layers.ts` (+test), `app/src/globe/live.ts`, `app/src/scenes/Explore.tsx`, `data/rovers/*` (1,386 Curiosity and 708 Perseverance stops, tracks, Ingenuity, offline copies of 4 featured stops, 8.1 MB), `data/places/*` (12 landers with cited coordinates, 2,051 Gazetteer names)
- Modified: `Relive.tsx` rewritten as Rover view (street view from NASA photos placed by CAHV camera model and rover attitude), `Walk.tsx` (walk yourself by default, hold-to-walk at the planner pace, drag to look, pad, arrival and home detection, guide arrow), `globe.ts` (live CTX/HiRISE/THEMIS/Viking tiles on a planetocentric tiling scheme, labels, tracks, stop dots, selection, hover, camera API; far-side pins no longer show through Mars), `App.tsx`, `state.tsx`, `Clock.tsx`, `load.ts`, `frames.ts` (bearing, offset), `ui.tsx` (fmtLatLon), `app.css`, `tokens.css` (track colours), `build_facts.py` (landers), `sources.csv` (+23 sources), `vite.config.ts` and `vercel.json` (COEP credentialless, CSP for mars.nasa.gov, trek.nasa.gov, astro.arcgis.com), `diagnostics.mjs` (check 15 enforces both)
- Fixed (found in testing): dev API relay returned 500 since the build (`ssrLoadModule` path resolved under `app/`); key handlers threw on events without `closest`; Walk debrief showed only the plan's totals (now plan beside what you did)
- Fixed (found by testing the production headers, which `npm run preview` now sends from `vercel.json`): the deployed globe never started, because Cesium's `Viewer` widgets compile Knockout bindings with `Function()` and the CSP has no `'unsafe-eval'` (now `CesiumWidget`); an inlined `data:` font was blocked (`font-src 'self' data:`); zod's eval probe raised a CSP report (`app/src/zod-config.ts`, jitless); CTX tiles past level 12 do not exist and failed without CORS headers (capped at 12, the mosaic's 5 m)
- Documents brought to as-built: README (sections 1, 4, 9 D15-D20, 11, 13), PRD (F06, F11, F13, F14, F16), APP_FLOW, MENTAL_MODEL, TAD, docs/DATA_SPEC.md (0.1, schemas), docs/SECURITY_ACCESS.md, security/SECURITY_CHECKLIST.md, legal/PRIVACY_POLICY.md (map tiles and rover photos now reach NASA and Esri directly, with the visitor's IP), build/MANIFEST.md (chunks 10-16), build/PLAN-2.md, BUILD_LOG.md section 12, both `.claude` skills

**Diagnostics**: 19 PASS, 0 FAIL, 1 SKIP (17, needs the deployed URL). Tests: 52 passed in 9 files. Startup JS 140 KB gzip.

**Known Issues**:
- Rover view needs NASA's raw-image APIs online; only the 4 featured stops work offline. Curiosity Navcam pointing exists from sol 13. Lens distortion is ignored (edges off by a few pixels).
- Other landing sites have only the 7.5 km global terrain: sharp in CTX, flat in 3D (`build/PLAN-2.md` section 5).
- Spirit, Opportunity, InSight, Phoenix, Pathfinder, Viking and Zhurong have pins and cards but no street view (no public pointing data).

**NEXT AI SHOULD**: Deploy to Vercel and run `node scripts/diagnostics.mjs --base <url>`; the preview server already runs the production headers, so expect no CSP violations; confirm once on the real HTTPS domain. Then, if the team wants 3D relief at other landing sites, cut 200 m windows from the global DEM for each lander in `pipeline/make_rasters.py` (stay under the 256 MB offline budget, now 220.9 MB).

---

## 2026-10-29 | Claude Opus 5.5 | Session 2 (build, test, refine)

**Description**: Built the whole app from the plan after the team said their local host allowed it, then tested every scene in the browser (desktop and phone widths) and fixed what the tests found. Before deploying, at the team's request, every markdown file was brought to the as-built state and the full record was written to `BUILD_LOG.md` (timeline, every file, data, decisions, all 27 bugs and fixes, measurements, what is not built).

**Chunks Modified**: 00-09 (see `build/MANIFEST.md` for the cut list)

**Changes**:
- Created: `app/` (8 scenes, core logic, assistant, globe), `api/` (relay, health), `pipeline/` (snapshot, grids, rasters, facts, corpus, manifest, moons, audio), `scripts/` (diagnostics, Cesium copy, model fetch), `.claude/` (launch config, homeward-dev and homeward-facts skills), `vercel.json`, `.env.example`
- Created later in the session: `BUILD_LOG.md`, `app/src/core/moons.ts`, `app/src/assistant/voice.worker.ts`, `app/src/assistant/ambient.ts`, `app/src/assistant/assistant.test.ts`, `app/src/assistant/eval.test.ts`, `pipeline/make_moons.py`, `pipeline/fetch_audio.py`, `data/sky/moons.json`, `data/audio/supercam-sol001-wind.mp3`
- Modified (documents, all to version 1.0.0 with an as-built section): README.md, PRD.md (status of F01-F34), FEATURE_TICKETS.md (outcome of every ticket), TAD.md, APP_FLOW.md, MENTAL_MODEL.md, IMPLEMENTATION_PLAN.md, COMMANDS.md, AI_RECOVERY.md, TEAMMATE_GUIDE.md, build/MANIFEST.md, build/chunk-00.md to chunk-09.md (Outcome sections), docs/DATA_SPEC.md, docs/TESTING_STRATEGY.md, docs/FRONTEND_SPEC.md, docs/OBSERVABILITY.md, docs/SECURITY_ACCESS.md, docs/SEO_PERFORMANCE.md, design/DESIGN_TOKENS.md, design/UI_DESIGN_PROMPTS.md, legal/COMPLIANCE.md (build-date note), legal/PRIVACY_POLICY.md (matches the app), security/SECURITY_CHECKLIST.md, both `.claude` skills
- Modified (code, during the document pass): `app/index.html` (no missing og image; honest description), `scripts/diagnostics.mjs` (check 17 reads the real health response), `app/src/state.tsx`, `brain.ts`, `Dock.tsx`, `Plan.tsx` (offline-only assistant switch, Clear plan)
- Deleted: none

**Fixes found by testing in this session**:
- Kokoro voice failed in dev: Vite rewrote the ONNX runtime's dynamic import; full-origin `wasmPaths` fixes it.
- Kokoro froze the globe for about 5 s per sentence (0 frames): moved to a Web Worker; sentences are pipelined; COOP/COEP headers enable multithreaded WASM.
- First production visit failed ("Failed to fetch"): the service worker precached 211 MB at install while the page downloaded the same files. Install now caches only the shell; the rest fills in after the globe is up, and changed files are evicted by manifest hash.
- Assistant routing: "extend the stop" fell through to an unrelated card (new `check_extra_time` tool); "daylight" and "air pressure" were misrouted (found by the new 40-question eval).
- Tooltips widened scrolling panels (now rendered in `<body>`); phone layout overlapped HUD, Dock and sheet; event toasts duplicated the suit's spoken alert; walk events outlived the Walk scene; Plan cleanup ran on a destroyed viewer.
- `/data/` and `/models/` were served `immutable` without content hashes; now revalidated. Models are pinned to Hugging Face commits and hash-checked at build.
- `IP_SALT` was missing from `.env.example` (found by diagnostics).
- Found while checking documents against code: `og.png` referenced but never made, and the description claimed "every agency"; diagnostics check 17 read a field the health endpoint does not return; the privacy notice promised an offline switch and Clear plan that did not exist (both built and verified: 0 relay calls with the switch off).

**Added beyond the first build**: Phobos and Deimos from JPL Horizons with a time-lapse (golden-tested against Horizons); real Mars wind from Perseverance's SuperCam microphone; spoken hazard alerts; voice preload.

**Diagnostics**: 19 PASS, 0 FAIL, 1 SKIP (17, live health needs the deployed URL). Tests: 38 passed in 5 files.

**Build Status**: 8/10 chunks complete, 2 partial (08: some presence cues and most P1/P2 cut; 09: deploy and submission are team steps)

**Known Issues**:
- Submission timing: the global FAQ says no work before the hackathon; submissions open 14 Nov 2026 09:00 local. See `legal/COMPLIANCE.md` 1.1.
- Kokoro on WASM generates about 1.8x slower than real time on a 12-core laptop; pipelining hides most of it, with short gaps between long sentences.
- `npm audit` lists `sharp` (via transformers.js); it is Node-only and never shipped; diagnostics check 16 re-verifies that.
- Moons are shown only between 25 Oct 2026 and 31 Mar 2027; extend with `pipeline/make_moons.py`.

**Handoff**: `CLAUDE.md` (added at the end of this session) tells every new session what to read first; the project skills and `BUILD_LOG.md` carry the detail.

**NEXT AI SHOULD**: Deploy to Vercel with the free keys and run `node scripts/diagnostics.mjs --base <url>`. Then pick from the cut list in `build/MANIFEST.md`, Dingo Gap 3D tiles (T41) first. Keep every new number in `pipeline/facts.csv` with a badge and source.

**Notes**: Code, data pipeline and docs were written with AI assistance (Claude); disclosed in the Credits scene and `legal/COMPLIANCE.md`.

---

## 2026-10-28 | Claude Opus 5.5 | Session 1b (open questions answered, plan revised)

**Description**: Went through PRD open questions Q1-Q7 with the team and revised every affected document. Still planning only; no code, no data processing.

**Team decisions**: Q1 local lead allowed the planning docs. Q3 name changed to Homeward ("Red Atlas" is a similar Devpost CesiumJS Mars planner). Q2 zero budget: free AI chain plus an open-source voice. Q4 full 3D offline: own tiles. Q6 keep default assumptions. Q7 the team will paste the official challenge page.

**Research checks run on 28 Oct 2026**:
- Cesium ion SaaS terms s2.2.2 (major update 20 Aug 2025): no storing Cesium data output for offline use; only general performance caching. So Cesium ion is dropped.
- Gemini API pricing page (updated 27 Oct 2026): `gemini-3.8-flash`, Live and TTS models free on the free tier; free-tier content is used to improve Google products. Live API supports function calling and ephemeral tokens; Hindi and Kannada supported; Gemini 3.8 Flash TTS supports both.
- Groq limits page: `openai/gpt-oss-120b` 30 RPM, 1K RPD, 8K TPM, 200K TPD (listed as base limits); Whisper and Orpheus TTS also hosted.
- OpenRouter free models: about 20 RPM and 50 requests/day without purchases (SECONDARY).
- OpenAI `gpt-realtime-2.1` released 6 Jul 2026, paid; not used.
- Licences via GitHub API: hexgrad/kokoro Apache-2.0; canopyai/Orpheus-TTS Apache-2.0; transformers.js Apache-2.0; web-llm Apache-2.0; resemble-ai/chatterbox MIT. kokoro-js 1.2.1 ships English voices only.
- USGS: MOLA-HRSC 200 m DEM v2 (11 GB, MOLA CC0 + HRSC CC BY-SA 3.0 IGO); Viking MDIM 2.1 colour 232 m (about 12 GB, public domain); MSL Gale Merged Orthophoto Mosaic 25 cm v3 (Calef and Parker 2016, 23 GB, use constraints "None"; colour COG about 1 GB).
- NASA-AMMOS 3DTilesSampleData `msl-dingo-gap`: JPL release URS297920, Landform pipeline, sol 528 site; repository has no licence file.
- MMGIS: Curiosity at Dingo Gap sol 528 at lon 137.4072626, lat -4.62655059, 2,993 m from Bradbury.
- CesiumJS `CustomHeightmapTerrainProvider` options confirmed (callback, width, height, tilingScheme, ellipsoid).

**Chunks Modified**: none built; specs for 00, 01, 02, 03, 05, 06, 08, 09 revised

**Changes**:
- Created: none
- Modified: all planning documents (rename to Homeward); README.md, TAD.md, IMPLEMENTATION_PLAN.md, build/chunk-02.md, build/chunk-05.md, build/chunk-06.md, build/chunk-08.md, legal/PRIVACY_POLICY.md, docs/SECURITY_ACCESS.md, docs/OBSERVABILITY.md rewritten; PRD.md (F29 presence, F30 Dingo Gap, decisions), FEATURE_TICKETS.md (T39 tiles, T40 presence, T41 Dingo Gap), docs/DATA_SPEC.md (DATA-21..24, SITE-08..09, PLN-12..13, tile plan), docs/TESTING_STRATEGY.md, docs/FRONTEND_SPEC.md, docs/SEO_PERFORMANCE.md, legal/COMPLIANCE.md, security/SECURITY_CHECKLIST.md, design/UI_DESIGN_PROMPTS.md (presence design), APP_FLOW.md, MENTAL_MODEL.md, TEAMMATE_GUIDE.md, COMMANDS.md, build/MANIFEST.md, build/chunk-00.md, build/chunk-01.md, build/chunk-03.md, build/chunk-09.md
- Deleted: none

**Build Status**: 0/10 chunks complete (none may start before 14 Nov 2026 09:00 IST)

**Known Issues**:
- Official challenge page text not yet reconciled (team will paste it): docs/DATA_SPEC.md section 3 and PRD section 5.1.
- Day-1 checks: Gemini OpenAI-compatible endpoint with tools (build/chunk-02.md); exact CesiumJS API names (build/chunk-06.md); whether the USGS GeoTIFFs are tiled or need full downloads (build/chunk-03.md); MSL mosaic colour COG resolution; vertical reference of the MOLA-HRSC DEM (expect areoid; SITE-01 test).
- Dingo Gap tiles have no licence file; credited as a NASA JPL release. Ask JPL if the team wants certainty.
- EVA-03 (20 deg slope) still from search excerpts of NTRS 20200001071.
- "Homeward" was checked with one web search only; re-check before submission.

**NEXT AI SHOULD**: Before 14 Nov, do nothing in code. When the team pastes the official challenge page, reconcile docs/DATA_SPEC.md section 3 and PRD section 5.1 and log it. On 14 Nov at or after 09:00 IST: read README.md, execute build/chunk-00.md, then follow build/MANIFEST.md; start the large downloads in chunk 03 at H0.

**Notes**: Planning documents written with AI assistance (Claude); disclose in the submission.

---

## 2026-10-28 | Claude Opus 5.5 | Session 1 (planning, pre-hackathon)

**Description**: Read the research paper (1,400 lines) and turned it into the full planning document set. No application code and no data processing for the project were done, in line with the Space Apps no-early-work rule and the request to build nothing yet.

**Research checks run on 28 Oct 2026** (all in a scratch script outside the project):
- Mars24 algorithm and constants read from the GISS page; the GISS Spirit worked example reproduced (Ls 327.32419 versus 327.32416; EOT exact).
- JPL Table 1 elements read; light time reproduced for Perseverance landing (11.37 min, NASA) and Curiosity landing (13.80 min, ESA).
- Paper values confirmed: MY39 starts 30 Sep 2026; Gale sunrise 08:17 UTC (13:47 IST) on 14 Nov and 08:56 UTC on 15 Nov; Jezero 12:08 and 12:47 UTC; light time 11.01 min at 2026-11-14T00:00Z.
- MMGIS MSL waypoints read live: Bradbury Landing (sol 3) and Yellowknife Bay site 6 (sols 166-272), 443 m apart.
- USGS STAC: HiRISE DTM `DTEEC_010573_1755_010639_1755_U01` (1.01 m, CC0-1.0) covers both points.
- NASA raw-image API returns Mastcam images for MSL sol 182.
- npm versions read for every planned package.

**Errata recorded** (README section 10): a Mars year is 668.6 sols, not 669.6; the 3.0-22.3 min light-time range versus the quoted 4-24 min; Ls must carry its time of day; sol numbers change at local midnight.

**Chunks Modified**: none (planning only)

**Changes**:
- Created: README.md, CHANGELOG.md, PRD.md, TAD.md, APP_FLOW.md, MENTAL_MODEL.md, FEATURE_TICKETS.md, IMPLEMENTATION_PLAN.md, COMMANDS.md, AI_RECOVERY.md, TEAMMATE_GUIDE.md, docs/DATA_SPEC.md, docs/FRONTEND_SPEC.md, docs/SECURITY_ACCESS.md, docs/OBSERVABILITY.md, docs/SEO_PERFORMANCE.md, docs/TESTING_STRATEGY.md, legal/COMPLIANCE.md, legal/PRIVACY_POLICY.md, build/MANIFEST.md, build/chunk-00.md to build/chunk-09.md, design/DESIGN_TOKENS.md, design/UI_DESIGN_PROMPTS.md, security/SECURITY_CHECKLIST.md
- Modified: none
- Deleted: none

**Build Status**: 0/10 chunks complete (none may start before 14 Nov 2026 09:00 IST)

**Known Issues**:
- PRD.md section 11: open questions Q1-Q7 need team answers (local-lead ruling on planning docs, spend cap, name check, Cesium ion caching terms, current voice model ID, assumption defaults, official resource list).
- IMPLEMENTATION_PLAN.md section 7: OpenAI GA event names, calls endpoint and the expiry field to be confirmed against the GA reference on day 1.
- docs/DATA_SPEC.md EVA-03 (20 deg slope) comes from search excerpts of NTRS 20200001071; open the PDF to confirm.
- Cesium Mars asset ID is not published; read it from the team's ion library.

**NEXT AI SHOULD**: Before 14 Nov, do nothing in code. On 14 Nov at or after 09:00 IST: read README.md, then execute build/chunk-00.md, then follow build/MANIFEST.md. Re-run `npm view <pkg> version` and pin exact versions before chunk 01.

**Notes**: These documents were written with AI assistance (Claude). Disclose that in the submission (legal/COMPLIANCE.md section 2).

---

## Template (copy for each new session)

```
## [YYYY-MM-DD] | [AI model or person] | Session [N]
**Description**:
**Chunks Modified**:
**Changes**:
- Created:
- Modified:
- Deleted:
**Diagnostics**: [paste PASS/FAIL summary]
**Build Status**: X/10 chunks complete
**Known Issues**:
- [issue, file path, suggested fix]
**NEXT AI SHOULD**:
**Notes**:
```
