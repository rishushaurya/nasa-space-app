# Homeward

> Version 3.0.0 | 2026-11-13 | Status: BUILT. All 9 scenes run on real data; `node scripts/diagnostics.mjs` passes. Built on 29 Oct 2026 after the team's local host in Bengaluru said building ahead was allowed; the global Space Apps FAQ says no work before the hackathon and submissions open 14 Nov 2026, 09:00 local, so read `legal/COMPLIANCE.md` 1.1 before submitting.
>
> 3.0.0: real 200 m relief for the whole planet (streamed, decoded off the main thread), a globe that renders only when something changes, geology, thermal-inertia, dust and shaded-relief overlays and HiRISE site mosaics, Spirit and Opportunity drive paths and the Schiaparelli site, a landing-site tour and a Rover view ride, every lander's own photos from NASA's image library, the latest measured Gale weather and live space weather at Mars, radio line of sight in the walk, and five orbiters at their real positions (`build/PLAN-3.md`). A knowledge graph of the project is in `graphify-out/` (`docs/PROJECT_GRAPH.md`).
>
> 2.0.0: Explore (a Google-Earth style globe with live orbiter imagery, every landing site and 2,051 named places), Rover view (street view from Curiosity's and Perseverance's own photos at every stop) and walking yourself (`build/PLAN-2.md`). 1.0.0: the app is built (section 13 says what is and is not in it). 0.2.0: renamed from "Red Atlas"; zero-budget stack; own 3D terrain and imagery instead of Cesium ion.

**Read this file first.** Every human or AI working on this project starts here.

## 1. Identity

| Field | Value |
|---|---|
| Name | Homeward. Tagline: "Plan a Marswalk that gets you home." (The research paper's working name "Red Atlas" is taken by a similar CesiumJS Mars planner on Devpost.) |
| Event | NASA Space Apps Challenge 2026, hackathon 14-15 Nov 2026, Bengaluru local event |
| Challenge | Interplanetary Survival Guide: Martian Map |
| Brief (paraphrased) | One layered, integrated view of one place or route on Mars, built from several NASA science missions, that helps a human explorer plan and carry out a Marswalk and do new science on the way |
| Team | Quickbites, up to 6 people (roles in `TEAMMATE_GUIDE.md`) |
| Budget | Zero. Free tiers, open-source software and voices, public data only |
| Product | A browser app at Gale Crater: true-scale Mars from orbit, descent to real terrain, a Marswalk planner with hard safety budgets, a grounded voice assistant, Mission Control on the real radio delay, and a replay of real Curiosity sols on the same ground, fully 3D online and offline |
| Source of truth for facts | `Martian Map — Space Apps 2026 Research Paper.md` (28 Oct 2026) plus checks in `docs/DATA_SPEC.md` |

## 2. The demo walk, in real numbers

All values verified or computed on 28 Oct 2026; sources in `docs/DATA_SPEC.md` (fact IDs in brackets).

| Item | Value |
|---|---|
| Habitat (start) | Bradbury Landing, Curiosity's first MMGIS waypoint (sol 3): 4.589467 S, 137.441633 E planetocentric, -4,502.5 m in the HiRISE DTM [SITE-01] |
| Science stop | Yellowknife Bay, Sheepbed mudstone, John Klein drill site: Curiosity site 6, sols 166-272: 4.58948 S, 137.44913 E; 0.8 m higher than the habitat in the DTM [SITE-02, SITE-04] |
| Straight-line distance | 443 m (computed on the 3,396.19 km Mars 2015 sphere) [SITE-03] |
| Why this stop | Grotzinger et al. 2014: an ancient habitable lake (NTRS 20150008374) [SCI-01] |
| Walk-zone terrain | HiRISE DTM `DTEEC_010573_1755_010639_1755_U01`, 1.01 m, CC0-1.0 [DATA-03] |
| Walk-zone imagery | MSL Gale Merged Orthophoto Mosaic, 25 cm, Calef and Parker 2016, USGS, no use constraints (colour version available) [DATA-24] |
| Replayed sols | Curiosity sol 182 (8 Feb 2013, first rock drilling, John Klein) [SITE-06]; Dingo Gap, sol 528, 2,993 m from the habitat [SITE-08, SITE-09]; boxwork ridges, sol 4709 [SITE-11]. Each with Curiosity's real position, track and raw photos |
| Second walk zone | Boxwork ridges on Mount Sharp: rover drop-off (sol 4600 waypoint) to the sol 4709-4789 site, 240 m straight line [SITE-10, SITE-11, SCI-05] |
| Scenario date | 14 Nov 2026: Mars Year 39, Ls 21.6 deg at 00:00 UTC; Gale sunrise 08:17 UTC (13:47 IST); one-way light time 11.0 min [TIME-01..05] |

## 3. Session protocol (every AI, every session)

On start:
0. `CLAUDE.md` (loaded automatically by Claude Code) has a short "Where to begin" section with the current state and open items.
1. Read this file.
2. Read the last 3 entries of `CHANGELOG.md`, especially "NEXT AI SHOULD"; `BUILD_LOG.md` has the full detail of the build.
3. Read `build/MANIFEST.md`. Check for IN-PROGRESS chunks (a previous session may have crashed; verify its work before continuing).
4. If confused, read `MENTAL_MODEL.md`.
5. Announce: "I am [model]. Status: [X/10 chunks done]. I will work on [what] because [why]."

On end:
1. Add a `CHANGELOG.md` entry (template at the bottom of that file).
2. Update `build/MANIFEST.md` (status, lock cleared).
3. Run `node scripts/diagnostics.mjs` (exists after chunk 00) and paste the summary into the changelog entry.
4. Write "NEXT AI SHOULD:" with exact, actionable instructions.

Recovery prompts are in `AI_RECOVERY.md`. Human shortcuts are in `COMMANDS.md`.

## 4. File map

| Path | Purpose |
|---|---|
| `README.md` | This file: context map, rules, decisions |
| `CLAUDE.md` | Entry point Claude Code loads in every new session: what to read first, rules, end-of-session steps |
| `CHANGELOG.md` | Session-by-session history and handoff |
| `BUILD_LOG.md` | Complete record of the build session: timeline, every file, data, decisions, all 27 bugs and fixes, measurements, what is not built |
| `PRD.md` | Product requirements: users, features F01-F30, priorities, acceptance |
| `TAD.md` | Technical architecture: components, flows, frames, caching, scaling |
| `APP_FLOW.md` | Scene-by-scene user journey, state transitions, error recovery |
| `MENTAL_MODEL.md` | Plain-English explanation of how the system works |
| `FEATURE_TICKETS.md` | Buildable tickets with given/when/then tests |
| `IMPLEMENTATION_PLAN.md` | Canonical technical spec: directories, file schemas, endpoints, hour plan |
| `COMMANDS.md` | Copy-paste commands for humans |
| `AI_RECOVERY.md` | Prompts for when an AI drifts, hallucinates or loses context |
| `TEAMMATE_GUIDE.md` | Plain-English guide, pitch script, 7-slide outline, judge Q&A |
| `docs/FRONTEND_SPEC.md` | Components, 4 states, accessibility, comfort, performance rules |
| `docs/SECURITY_ACCESS.md` | Threat model, headers, CSP, rate limits, secrets |
| `docs/OBSERVABILITY.md` | Logs, health check, error capture |
| `docs/SEO_PERFORMANCE.md` | Meta tags, frame-rate, bundle and tile budgets |
| `docs/TESTING_STRATEGY.md` | Golden tests against NASA/ESA numbers, assistant eval per provider, E2E |
| `docs/DATA_SPEC.md` | Replaces DATABASE_SPEC: data files, facts registry, tiles, provenance, licences, pipeline |
| `legal/COMPLIANCE.md` | Space Apps rules, AI disclosure, NASA branding, licence matrix |
| `legal/PRIVACY_POLICY.md` | What the app sends where |
| `build/MANIFEST.md` | Chunk status, locks, dependencies |
| `build/chunk-00.md` ... `chunk-09.md` | Build specs, one per chunk, with verification commands |
| `build/PLAN-2.md` | Research findings, decisions D15-D20 and chunks 10-16 for Explore, Rover view and walking yourself |
| `build/PLAN-3.md` | The build checked against the official statement, research findings, decisions D21-D27 and chunks 17-26 (version 3.0) |
| `film/SCRIPT.md`, `film/*.mjs`, `film/music.py` | The two demo films (30-second submission cut and a 2:20 story film): script, storylines, and the free pipeline that records the real app, voices the script (Kokoro), writes the music (MusicGen) and edits both with ffmpeg; output in `film/out/` (git-ignored) |
| `docs/PROJECT_GRAPH.md`, `graphify-out/` | Knowledge graph of all code and documents: connection check, main paths, how to refresh |
| `design/DESIGN_TOKENS.md` | CSS custom properties, contrast-checked |
| `design/UI_DESIGN_PROMPTS.md` | Visual spec per component and scene, presence design |
| `security/SECURITY_CHECKLIST.md` | 90+ checkbox audit items |
| `Martian Map — Space Apps 2026 Research Paper.md` | The research this plan is built on |

Built code: `app/` (Vite + React + TypeScript client; `app/src/core` tested logic, `app/src/assistant` brain, tools, voice and eval, `app/src/globe` Cesium setup, `app/src/scenes` the 8 scenes), `api/` (Vercel functions), `pipeline/` (Python data scripts), `app/public/data/` (generated data, served at `/data/`; every doc calls it `data/`), `scripts/` (diagnostics, Cesium copy, model fetch), `.claude/` (launch config and two project skills). Terrain and imagery are single rasters per level in `data/globe/` sampled by our own terrain provider, not a `tiles/` pyramid. Models in `app/public/models` and `app/public/ort` are git-ignored and fetched at build time.

Conditional documents: INCLUDED `docs/SEO_PERFORMANCE.md` (public link for judges), `legal/PRIVACY_POLICY.md` (speech and text leave the browser), `legal/COMPLIANCE.md` (competition rules and data licences). SKIPPED `legal/TERMS_OF_SERVICE.md` (no accounts), `legal/DATA_HANDLING.md` (no sensitive personal data stored), `docs/DATABASE_SPEC.md` (no database; replaced by `docs/DATA_SPEC.md`), `SLIDES.html` (a submission deliverable; it must be made during the event from real screenshots; outline in `TEAMMATE_GUIDE.md`).

## 5. Build order

```
00 diagnostics
 └─ 01 scaffolding
     ├─ 02 backend (assistant relay, health) ─────────────┐
     ├─ 03 data + tile pipeline ── 04 core logic ── 05 assistant ┤
     └─ 06 frontend shell + own Mars globe ──────── 07 scenes ──┴─ 08 advanced ── 09 hardening + deploy
```

| Chunk | Name | Depends on | Parallel with | Status |
|---|---|---|---|---|
| 00 | Manifest and diagnostics | - | - | DONE |
| 01 | Scaffolding | 00 | - | DONE |
| 02 | Backend functions | 01 | 03, 06 | DONE |
| 03 | Data and tile pipeline | 01 | 02, 06 | DONE |
| 04 | Core logic (time, ephemeris, frames, planner) | 01, 03 | 02, 06 | DONE |
| 05 | Assistant, voice and Mission Control | 02, 04 | 07 | DONE (Kannada and Hindi not built) |
| 06 | Frontend shell and own Mars globe | 01, 03 (tiles) | 02, 04 | DONE |
| 07 | Scenes and panels | 04, 06 | 05 | DONE |
| 08 | Orbit, sky, presence, audio, events, offline | 07 | - | PARTIAL: orbit, moons, descent, events, real wind and offline done; some presence cues, most P1 and all P2 not built |
| 09 | Hardening, deploy, submission | 05, 08 | - | Hardening DONE; deploy and submission are the team's steps (section 14) |

Live status and what was cut: `build/MANIFEST.md`.

## 6. Tech stack (all free)

Exact versions pinned in `package.json` (no `^` or `~`; diagnostics check 02 enforces it).

| Layer | Technology | Version | Why |
|---|---|---|---|
| Runtime | Node.js | 22.12 or later (cesium needs 22+, vitest needs 22.12+; this machine has 24.14.0) | Engines fields read on 28 Oct 2026 |
| 3D engine | CesiumJS on `Ellipsoid.MARS` with our own terrain and imagery tiles | 1.146.0 | Apache-2.0; no Cesium ion account needed; same full 3D online and offline |
| Mars data for tiles | MOLA-HRSC 200 m DEM, Viking MDIM 2.1 colour 232 m, HiRISE DTM 1 m, MSL Gale 25 cm mosaic, JPL Dingo Gap 3D Tiles | public | The same public sources Cesium Mars is built from, plus the Curiosity team's own base mosaic |
| UI | React | 19.3.1 | Mainstream |
| Build | Vite | 8.3.5 | Static build, fast dev server |
| Language | TypeScript (strict) | 7.0.2 | Type checking is the lint gate; fall back to 5.9.x if 7.x breaks a tool |
| Icons | lucide-react | 1.63.0 | Icon library, no emojis |
| Validation | zod | 4.6.7 | Request, URL-state, data and tool-argument validation |
| Tests | vitest | 5.0.5 | Golden-value unit tests, real-grid planner validation, 40-question assistant eval, relay tests (no browser E2E suite; scenes were checked by hand in the browser) |
| Voice (speech out) | Kokoro-82M q8 via kokoro-js, in a Web Worker | 1.2.1 | Natural human-sounding open voice from GitHub (hexgrad/kokoro, Apache-2.0); self-hosted weights; works offline; English voices |
| Speech in | Web Speech API (Chrome, Edge); Whisper tiny.en via @huggingface/transformers in the browser as fallback | browser / 3.8.1 | Free; Whisper runs offline (transformers.js Apache-2.0, Whisper weights MIT) |
| Mars sound | Perseverance SuperCam microphone recording, sol 1 | public | Real wind under the descent and the walk |
| AI brain, chained | 1. Gemini `gemini-3.8-flash` (free tier) 2. Groq `openai/gpt-oss-120b` (free tier) 3. OpenRouter `openrouter/free` (free models) 4. offline rules in the browser | API | Each has function calling; the next one takes over on error or rate limit |
| Kannada and Hindi voice (P2, not built) | Gemini `gemini-3.8-flash-tts` (free tier, supports both) | API | Kokoro's browser package has English voices only; the `lang` field exists in the app state, with no selector yet |
| Back end | Vercel Functions (Hobby plan, free, non-commercial) | - | One relay that holds the free-tier keys, plus health |
| Data pipeline | Python 3.12, rasterio (GDAL 3.12.2 bundled), numpy, requests, Pillow | rasterio 1.5.2 | rasterio wheels bundle GDAL, so no separate GDAL install on Windows |
| Moons | JPL Horizons API (no key) | - | Phobos and Deimos hourly state vectors, Oct 2026 to Mar 2027 |

## 7. API keys and accounts (all free)

| Service | Get it at | Free tier | Needed for |
|---|---|---|---|
| NASA Open APIs | api.nasa.gov, "Generate API Key" | Free; without a key the relay uses `DEMO_KEY` (10 requests an hour, our relay caches 30 min) | Live space weather (`NASA_API_KEY`, optional) |
| Google AI Studio (Gemini API) | aistudio.google.com, "Get API key" | Free models listed on the pricing page (updated 27 Oct 2026); limits shown in AI Studio; free-tier content is used by Google to improve its products | AI brain 1; Kannada and Hindi voice (P2) |
| Groq | console.groq.com/keys | Free plan; `openai/gpt-oss-120b` listed at 30 requests/min, 1,000/day, 8K tokens/min (base limits; check your console) | AI brain 2 |
| OpenRouter | openrouter.ai/keys | `:free` models about 20 requests/min and 50/day for accounts that never bought credits (SECONDARY) | AI brain 3 |
| Vercel | vercel.com | Hobby plan, free, non-commercial | Hosting and the relay function |
| NASA MMGIS, raw images, Mars Trek; USGS STAC and PDS Annex; JPL Horizons; MCD web | none | No key | Data |

Keys live in `.env.local` (git-ignored) and in Vercel environment variables. Only `.env.example` is committed. No credit card is needed for any of them. Also set `ALLOWED_ORIGINS` (your deployed URL) and `IP_SALT` (any random string). With no keys at all the app still works: the assistant answers from the offline rules over the same tools.

## 8. Project rules (apply on top of the 25 behaviour rules)

The 25 rules from the project brief apply. Where a rule assumes accounts or a database that this product does not have, it is marked N/A here, so no AI builds them by reflex.

| Rule | How it applies here |
|---|---|
| No emojis; icons from Lucide | Applies everywhere, including docs and commit messages |
| CSS custom properties for every visual value | Applies; tokens in `design/DESIGN_TOKENS.md` |
| Demo mode without API keys | Applies as **Offline mode**: the full 3D app runs on cached real data and our own tiles; the assistant runs on in-browser speech and rules. Nothing synthetic is ever shown as data. Generated visuals carry a GENERATED badge |
| 4 UI states, skeletons, error boundaries, tooltips | Applies to every panel that loads data |
| Auth, RBAC, user isolation, owner_id filtering | N/A: no accounts, no stored user data. Revisit only if F27 (shared notebook) is built |
| Parameterized SQL | N/A: no database |
| Validation, rate limiting, security headers, CORS whitelist, structured logs, /health | Applies to the functions in `api/` |
| Form persistence | Applies to the Marswalk plan: stored in the URL and in localStorage on every change |
| Version header on every file, changelog every change | Applies |
| Light mode, seasonal themes | SKIPPED: a dark UI over a 3D night sky; tokens make a light theme a token swap later |

Content rules, from the research paper:
- Every number shown in the app comes from `data/facts.json` or a computation tested against a published value, and carries a badge: LIVE, MEASURED, MODELLED, COMPUTED, STANDARD, ASSUMPTION or GENERATED.
- No NASA logos or insignia anywhere. Credit lines only.
- Every source cited in the credits panel and in the repository README at submission.
- AI use disclosed; AI-generated images or video watermarked.

## 9. Decisions log

| ID | Decision | Reason |
|---|---|---|
| D1 | Site is Gale; walk is Bradbury Landing to Yellowknife Bay | Best metre-scale data, Curiosity's traverse for validation, RAD measured on this crater floor |
| D2 | No accounts, no database | Nothing needs to persist server-side; state lives in the URL and localStorage |
| D3 | Offline mode replaces "demo mode" and uses only real data | The brief scores validity; fake data would fail it |
| D4 | One back-end relay (`/api/v1/assistant`) holds the free-tier keys and tries Gemini, then Groq, then OpenRouter | Keys stay secret; free tiers have rate limits, so a chain keeps the assistant answering |
| D5 | One life-support budget (oxygen and power together) from NASA's 8-hour EVA limit | No published Mars-suit consumable masses exist; inventing them would be fake precision |
| D6 | Tool calls run in the browser; any AI brain only speaks numbers returned by tools | Grounded answers, identical across providers |
| D7 | Internally all coordinates are planetocentric, east-positive; converted to Cesium geodetic latitude at one boundary function (and the same formula in the tile pipeline) | Skipping the conversion puts pins 3.2 km off at Gale (COMPUTED) |
| D8 | Build chunk files hold specs, interfaces and golden tests, not code | The no-early-work rule and the request to build nothing yet |
| D9 | Dark UI only | See section 8 |
| D10 | No analytics, no remote error tracking in v1 | Privacy, and nothing to act on during a 48-hour event |
| D11 | Own terrain and imagery tiles, cut from public data, served and cached by us; no Cesium ion | Cesium's terms (s2.2.2) forbid storing their tiles for offline use; our own tiles give the same full 3D online and offline, for free |
| D12 | Cascade voice: speech in (Web Speech or Whisper), any AI brain, speech out with Kokoro | One consistent human-sounding open voice whatever brain answers, and it works offline |
| D13 | Name: Homeward | "Red Atlas" is used by a similar Devpost project |
| D14 | Zero budget | The team cannot spend money; every service above has a free tier or is open source |
| D15 | COEP `credentialless`; CSP adds mars.nasa.gov, trek.nasa.gov and astro.arcgis.com | NASA's photo files send no CORP header; Chrome and Firefox stay cross-origin isolated (Safari runs Kokoro on one thread) |
| D16 | Rover view places each photo in CSS 3D from its CAHV camera model and the rover attitude, over the Cesium eye view | The photos cannot be WebGL textures without CORS; each stays a real, linked NASA image |
| D17 | Live NASA Trek and Esri OnMars imagery online, our own rasters offline | Google-Earth sharpness online; the same full 3D offline (D11 still holds) |
| D18 | Rover stops are MMGIS waypoints; a photo belongs to the latest stop at or before its site/drive counter | Positions are NASA's own; Perseverance's counter ticks without wheel motion |
| D19 | Lander coordinates live in `pipeline/landers.csv` with badge and sources, checked like facts | Same provenance rule as facts, numeric for flying |
| D20 | Walking yourself is the default; "Follow the plan" replays the planner | The team asked to walk themselves |
| D21 | Global terrain streams live from Esri OnMars MDEM200M (MOLA-HRSC 200 m, LERC), decoded in two workers and cached; our metre-scale rasters win at Gale; offline falls back to our 7.5 km grid | Real relief everywhere without storing 11 GB; same planetocentric conversion as D7 |
| D22 | The globe renders on demand (`requestRenderMode`); every globe method that changes the scene requests a frame | Idle frames went from continuous to zero (measured) |
| D23 | Space weather (DONKI) comes through our relay `/api/v1/spaceweather` (`NASA_API_KEY` or `DEMO_KEY`, cached 30 min); Curiosity's REMS feed is read directly from mars.nasa.gov | Key stays server-side, `connect-src 'self'` for it; the weather host was already allowed |
| D24 | CSP adds `images-api.nasa.gov` (connect) and `images-assets.nasa.gov` (img) for NASA's image library | Every lander's own photos; diagnostics check 15 allows exactly these two more hosts |
| D25 | Spirit and Opportunity tracks come from the PDS Geosciences Node tables; lander pins stay at the PDS ODE values and the card shows the offset (Spirit 0.4 km) | Real, cited traverses; no silent re-alignment |
| D26 | Rover view has a ride (autoplay to the next stop after its photos load); Explore has a landing-site tour in landing order | Google-Maps-style ride on real records |
| D27 | Radio line of sight to the shelter uses the planner's HiRISE grid and the sphere's curvature; suit antenna 1.7 m and mast 3 m are ASSUMPTION values | Real terrain physics, labelled honestly |

## 10. Errata found in the research paper

| Paper says | Correct | Evidence |
|---|---|---|
| Mars year = 669.6 sols (4.1) | 668.6 sols | 686.98 d x 24 h / 24.6597 h = 668.6; the paper's own season lengths sum to 668 |
| Radio delay 4 to 24 minutes one way (4.2, as quoted from NASA) | Light time is 3.0 to 22.3 min for NSSDC's 54.6-401.4 million km | Show the computed range; quote NASA's wording only with its source |
| Ls 21.8 deg on 14 Nov (4.6) | Ls 21.57 deg at 00:00 UTC; 21.8 deg near 12:00 UTC | Recomputed with Mars24; always state the time of day with Ls |
| Curiosity sol 5074 on 14 Nov | Correct after Gale local midnight (about 02:00 UTC); sol 5073 before it | Sol numbers change at local midnight, not UTC midnight |
| Voice: OpenAI Realtime as main assistant (8.5) | Paid; replaced by the free chain in section 6 | Zero budget (D14) |
| Cesium ion tiles for the walk and offline cache (8.7, 13.3) | Cesium's terms forbid storing their tiles for offline use (SaaS terms s2.2.2, updated Aug 2025) | Own tiles (D11) |

## 11. Diagnostics

`node scripts/diagnostics.mjs` runs 20 checks with a fix hint per failure (`--quick` skips the build and npm audit; `--base https://your-app.vercel.app` adds the live health check). Last full run, 13 Nov 2026: 19 PASS, 0 FAIL, 1 SKIP (health, needs the deployed URL); 73 tests in 15 files; startup JS 146 KB gzip. The one accepted audit item is `sharp`, a Node-only image library pulled in by transformers.js that never ships to the browser or the API; check 16 re-verifies that on every run.

## 12. UI flexibility

All colours, spacing, type, radii, shadows and motion are CSS custom properties in `app/src/styles/tokens.css`. Change a token, the whole UI follows. Components never hard-code a visual value.

## 13. As built (13 Nov 2026, version 3.0)

What a visitor gets, scene by scene:

| Scene | What it does | Real data behind it |
|---|---|---|
| Mars now | Live Mars Year, Ls, season, Gale local solar time, sunrise and sunset in UTC and IST, rover sols, radio delay | Mars24 (GISS), JPL planetary elements; golden tests against published values |
| Explore | A Google-Earth style globe with real 200 m relief everywhere and 1 m at Gale: search 2,051 IAU-named places, every lander or typed coordinates; cited cards for 13 landing sites (Schiaparelli added) with the terrain detail there and each mission's own photos from NASA's image library, one by one; a tour of every landing site; Curiosity and Perseverance tracks with every stop, Spirit and Opportunity drive paths, Ingenuity flights; live CTX 5 m, HiRISE, THEMIS day and night infrared or Viking colour; overlays for shaded relief, geology, thermal inertia, dust and HiRISE site mosaics with an opacity slider; zoom, face north, tilt, keyboard panning, cursor position and height; a ruler with an elevation profile | USGS Gazetteer, PDS Geosciences Node (landing sites, MER traverses), MMGIS, NASA Mars Trek (incl. USGS SIM 3292, MGS TES), Esri OnMars (CTX, MDEM200M), NASA Image and Video Library; planetocentric tiles and heights converted to the ellipsoid (tested) |
| Orbit | True-scale Mars lit by the real Sun, Earth marker, Phobos and Deimos and five orbiters (MRO, Odyssey, Mars Express, TGO, Hope) at their real positions with their heights, time-lapse at 1 hour per second | MOLA-HRSC terrain, Viking colour, JPL Horizons vectors (moons hourly, orbiters every 10 min; golden tests) |
| Descent | Camera from orbit to Bradbury Landing with Perseverance's real entry numbers; real Mars wind fades in below about 11 km | EDL-01, Perseverance SuperCam microphone (sol 1) |
| Briefing | Conditions with badges, suit limits, dose; the newest sol Curiosity's weather station has released (dated, MEASURED); coronal mass ejections NASA's models predict at Mars (live, MODELLED) | REMS feed, DONKI WSA-ENLIL, RAD, NASA EVA ConOps |
| Plan | Two walk zones (Yellowknife Bay, boxwork ridges); hard budgets for life support, walk-back margin, daylight, radius; a walk-back heat map; a breach blocks Approve | HiRISE DTMs at 1 m, slope and relief grids at 2 m; Tobler speed scaled to the Apollo walk-back rate |
| Walk | You walk it yourself (W, arrows, on-screen pad, drag to look) at the planner's pace, slower uphill, with the suit clock in real time, 10x or 30x; steep or rocky cells stop you; a guide points to the stop, then home; "Follow the plan" replays the route; "Fly" flies anywhere over the real terrain at 10, 50, 250 or 1,000 m/s (E and Q climb and descend; height and speed in the HUD; a view, not a suited walk, so the suit clock stops and the walk resumes where you took off). Live HUD including radio line of sight to the habitat over the real terrain; dust-devil event and solar-storm drill announced by the suit voice; science stop with Curiosity's photos and a sample log; a debrief comparing the plan with what you did; GeoJSON and CSV export; share link | EVT-01, RAD-05, Tobler scaled to the Apollo walk-back rate (EVA-04), raw Mastcam and Navcam frames |
| Rover view | Street view from the rovers' own photos: stand at any of Curiosity's 1,386 or Perseverance's 708 stops; Navcam and Mastcam-Z frames placed where each camera pointed, over the 3D view from the same spot; drag to look, zoom, arrows and keys step along the real drive; a ride that steps on by itself and faces the way the rover drove; mini-map, go to sol, every photo of the stop with full-size view and NASA links; four featured stops work offline | MMGIS waypoints, NASA raw-image APIs (camera models, rover attitude; golden-tested against a real record) |
| Credits | Every agency, dataset, licence and AI tool, generated from `data/sources.json` | 88 sources |

The assistant (bottom left) answers by voice and captions. It only speaks numbers returned by the app's tools, names its sources, and falls back from Gemini to Groq to OpenRouter to offline rules. Kokoro speaks on the device in a Web Worker, so the globe never freezes. Mission Control replies after the real round-trip light time, time-compressed 60x. The cloud button keeps every question on the device (offline rules only); the speaker button turns voice and wind on or off. After one online visit the service worker keeps the app working offline.

Not built (planned as P1 or P2, or cut for time):
- 360 street view for Spirit, Opportunity, InSight, Phoenix, Pathfinder, the Vikings and Zhurong: no public record gives their camera pointing; they have pins, cited cards and their photos one by one.
- Terrain finer than 200 m away from Gale (Jezero HiRISE heights exist only as shaded relief in Trek); offline, other sites fall back to the 7.5 km grid.
- Lens distortion in Rover view (CAHVOR and CAHVORE terms ignored; edges a few pixels off); Curiosity Mastcam photos have no pointing data, so they appear only in the film strip.
- Dingo Gap rover-scale 3D tiles (sol 528 shows Curiosity's position, track and photos, not the JPL mesh).
- Kannada and Hindi voice and UI.
- A Curiosity 3D model at the stop.
- Every-agency layer set beyond NASA, ESA/DLR and USGS data; ice overlay; Exploration Zones layer.
- Mars Climate Database conditions (the briefing says so).
- Star sphere rotated for Mars (Cesium's sky is used, labelled as an approximation); MAVEN (its Horizons ephemeris ends 1 Mar 2026).
- Per-band Martian acoustics and a suit-interior sound loop; scene light is tuned for visibility, not scaled to the 39% sunlight figure (PLN-13).
- Comfort settings (field of view, vignette); browser end-to-end tests.
- P2: landing-site checker, journey prologue, dusk clouds and frost, Mie-theory sky.

## 14. Run, test and deploy

```
npm ci
npm run models
npm run dev
```
Open http://localhost:5173. `npm run models` downloads the voice and speech models once (about 130 MB from Hugging Face, pinned to a commit and checked against `data/manifest.json`). Copy `.env.example` to `.env.local` and add free keys to switch the assistant from offline rules to the AI chain.

```
npm test
npm run typecheck
node scripts/diagnostics.mjs
```

Live: https://nasa-space-app-drab.vercel.app (Vercel Hobby, free; project `nasa-space-app` on rishushaurya's projects, connected to the GitHub repository, so every push to `main` redeploys). Set on Vercel (Production): `ALLOWED_ORIGINS`, `IP_SALT`, `GEMINI_MODEL`, `GROQ_MODEL`, `OPENROUTER_MODEL`; the four keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY`, `NASA_API_KEY`) are added by the team in Project Settings, then Redeploy. Without them the assistant uses offline rules and space weather uses `DEMO_KEY`. From this folder, `npx vercel deploy --prod` deploys too (`.vercelignore` keeps the upload under Hobby's 100 MB).

Source: https://github.com/rishushaurya/nasa-space-app (branch `main`). Deploy on Vercel (Hobby, free): import that repository, keep the settings from `vercel.json` (build command `npm run models && npm run build`, output `dist`), add the variables from `.env.example` in Project Settings, deploy, then run `node scripts/diagnostics.mjs --base https://your-app.vercel.app`. The data pipeline in `pipeline/` only needs re-running to regenerate data; its outputs are committed.
