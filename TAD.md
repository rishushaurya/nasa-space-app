# Technical Architecture Document: Homeward

> Version 2.0.0 | 2026-11-01 | Owner: 3D engineer + AI engineer | Status: built; section 0 lists where the build differs from this design
>
> 0.2.0: own Mars tiles replace Cesium ion; free AI chain and cascade voice replace OpenAI Realtime.

## 0. Architecture as built (29 Oct 2026)

Full record of the build session: `BUILD_LOG.md`.

- Terrain and imagery: one file per level in `data/globe/` (terrain as 16-bit rasters, imagery as JPEG), loaded whole. A `CustomHeightmapTerrainProvider` samples the finest raster that covers each tile (65 x 65 posts, bilinear); imagery uses one `SingleTileImageryProvider` per level with its rectangle and the Mars ellipsoid. No tile pyramid, no Cesium ion.
- Threads: the planner runs in its own worker (walk-back field cached by home and terrain settings); Kokoro runs in a voice worker, because on the main thread it stopped rendering for seconds; Cesium uses its own workers.
- Cross-origin isolation: COOP `same-origin` and COEP `credentialless` in `vercel.json` and in the dev and preview servers, so ONNX runtime can use several threads (Chrome, Firefox; Safari runs one thread). Every script, model and data file is same-origin; since 1 Nov 2026 live tiles come from NASA Mars Trek and Esri OnMars and rover photos from mars.nasa.gov (build/PLAN-2.md D15-D17).
- Globe: `Cesium.CesiumWidget` (no Viewer widgets: their Knockout bindings need `'unsafe-eval'`, which the CSP forbids).
- Live imagery (since 1 Nov 2026): `UrlTemplateImageryProvider` layers for CTX, HiRISE, THEMIS and Viking on `OcentricTiling` (`app/src/globe/layers.ts`), which converts planetocentric tile edges to the ellipsoid's geodetic latitude. They sit above our coarse global rasters and below our own Gale mosaics; offline, only our rasters are used.
- Rover view (since 1 Nov 2026): stops from MMGIS waypoints; photos from NASA's raw-image APIs, placed in CSS 3D with a `matrix3d` built from each frame's CAHV camera model and the rover attitude quaternion (`app/src/core/camera.ts`), over the Cesium eye view at the same spot with a matched field of view.
- Offline: the service worker caches the shell at install, caches files as they are used, and after the globe is up fills in the rest of `data/manifest.json` (Kokoro only when sound is on, Whisper only where the browser lacks speech recognition). Files whose hash changed are evicted.
- Relay: one OpenAI-compatible adapter tries Gemini, Groq, then OpenRouter; 8 s timeout per provider, circuit breaker after 3 failures for 60 s, 30 requests per 10 minutes per IP, origin allow-list, 32 KB body limit, zod validation. The browser runs the tools and falls back to offline rules on any failure, or always when the person keeps the assistant offline.
- Sky: Sun and Earth directions from JPL elements rotated into the Mars-fixed frame (IAU 2009 pole, Mars24 subsolar longitude); Phobos and Deimos from JPL Horizons hourly vectors with Hermite interpolation; stars are Cesium's Earth sky box (approximation, labelled).
- Sound: Kokoro voices; Mission Control through a 300-3,400 Hz band-pass; the real SuperCam wind recording as a quiet loop.
- Deploy: Vercel runs `npm run models && npm run build`; models are pinned to Hugging Face commits and hash-checked against the manifest. `/assets/` is immutable; `/data/`, `/models/`, `/ort/` and `/cesium/` revalidate.

## 1. Shape of the system

The browser app is the product. One small back-end relay holds the free-tier AI keys. Everything heavy (terrain and imagery tiles, terrain grid, traverses, photos, conditions, facts) is precomputed during the event into static files we host, so the full 3D experience also runs offline.

```
                          BUILD TIME (during the event, pipeline/)
  MOLA-HRSC 200 m DEM ───────┐
  Viking MDIM 2.1 colour ────┤
  HiRISE DTM 1 m (CC0) ──────┤   Python (rasterio, numpy, Pillow)   app/public/tiles/ (terrain .bin, imagery .jpg)
  MSL Gale 25 cm mosaic ─────┼──────────────────────────────────►  app/public/data/  (facts, sources, corpus, grid,
  JPL Dingo Gap 3D Tiles ────┤                                                        traverse, sols, conditions, sky)
  MMGIS, raw images, MCD, ───┘                                     app/public/models/ (Curiosity glTF, Kokoro, Whisper)
  JPL Horizons
 ─────────────────────────────────────────────────────────────────────────┬─────────────────────────────────────────
                          RUN TIME                                         │ same origin, CDN, service worker cache
                                                                           ▼
 ┌──────────────────────────── Browser (Vite + React + TS) ─────────────────────────────────────────────┐
 │ Scene controller (URL state)                                                                          │
 │  ├─ Globe/Walk: CesiumJS, Globe(Ellipsoid.MARS), own heightmap terrain + own imagery tiles,          │
 │  │              Dingo Gap 3D Tiles, Curiosity model, tuned sky                                       │
 │  ├─ Core (pure TS, tested): mars-time, ephemeris, frames, dose, planner (+ Web Worker)               │
 │  ├─ Panels: clock, briefing, planner, HUD, science card, relive, credits                             │
 │  ├─ Assistant loop: speech in ─► brain ─► tools (Core + data) ─► brain ─► text ─► Kokoro voice        │
 │  │     speech in: Web Speech API (online, Chrome/Edge) or Whisper (in browser, offline)              │
 │  │     brain: POST /api/v1/assistant (online) or offline rules (same tools)                          │
 │  ├─ Mission Control queue: reply delivered after 2 x light time / compression                        │
 │  ├─ Audio: Web Audio (Mars acoustics, suit interior, radio band, silence in space)                   │
 │  └─ Service worker: shell, data, tiles, models                                                       │
 └───────────────────────┬──────────────────────────────────────────────────────────────────────────────┘
                         │ POST /api/v1/assistant  { persona, messages, tools }
                         ▼
 ┌────────────── Vercel Function (relay) ──────────────┐      free-tier providers, tried in order:
 │ validate, origin check, rate limit, then:           │ ───► 1 Gemini  gemini-3.8-flash
 │ try provider 1, on error/429/timeout try 2, then 3  │ ───► 2 Groq    openai/gpt-oss-120b
 │ circuit breaker per provider; never logs content    │ ───► 3 OpenRouter openrouter/free (tool-capable)
 └──────────────────────────────────────────────────────┘     all fail ─► 503 ─► browser uses offline rules
```

## 2. Components

| Component | Purpose | Technology | Location |
|---|---|---|---|
| Scene controller | Active scene, plan, sol, camera; serialised to the URL | React state + zod-validated URL params | `app/src/scenes/` |
| Globe/Walk view | Renders Mars from orbit to eye level | CesiumJS 1.146, `Globe(Ellipsoid.MARS)`, `CustomHeightmapTerrainProvider`, `UrlTemplateImageryProvider`, `Cesium3DTileset` | `app/src/globe/` |
| Core | Mars24 time, JPL ephemeris and light time, frames, dose, budgets | TypeScript, no DOM | `app/src/core/` |
| Planner worker | Route search and walk-back field on the terrain grid | Web Worker, typed arrays | `app/src/core/planner.worker.ts` |
| Data loader | Fetches `data/*`, validates with zod, facts by ID | fetch + zod | `app/src/data/` |
| Assistant | Tool registry, brain client, speech in, Kokoro voice, captions, offline rules | Web Speech API, transformers.js Whisper, kokoro-js | `app/src/assistant/` |
| Mission Control | Delay queue for "Earth" replies | setTimeout keyed to scenario light time | `app/src/assistant/mission-control.ts` |
| Audio engine | Martian acoustics, suit interior, radio band, ambience | Web Audio API | `app/src/audio/` |
| Offline | Caches shell, data, tiles, models | Service worker (hand-written) | `app/public/sw.js` |
| Assistant relay | Holds free-tier keys; provider fallback chain | Vercel Function (Node), zod | `api/v1/assistant.ts` |
| Health | Config and data reachability | Vercel Function | `api/v1/health.ts` |
| Pipeline | Builds `data/` and `tiles/` from public sources | Python 3.12, rasterio, numpy, Pillow | `pipeline/` |

## 3. Stack

Versions in `README.md` section 6. Choices not to make, and why:

| Not used | Reason |
|---|---|
| Cesium ion | Its terms forbid storing tiles for offline use; our own tiles from the same public sources cost nothing (README D11) |
| Paid voice or AI APIs | Zero budget (D14) |
| Speech-to-speech models | A cascade keeps one open, human-sounding voice (Kokoro) regardless of which free brain answers, and works offline |
| A router library | Scenes are modes of one view; the URL hash carries state |
| A state library | React state plus the URL is enough |
| A database or ORM | No server-side state (D2) |
| A WebSocket server | Nothing needs a persistent server connection |
| A vector database | The corpus is under about 120 short cards; keyword scoring in the browser is enough |
| three.js alongside Cesium | One renderer; Cesium loads the Dingo Gap 3D Tiles directly |

## 4. Coordinate frames (the most likely silent bug)

| Data | Frame as published | Convert how |
|---|---|---|
| MMGIS waypoints, paper coordinates, Gazetteer | Planetocentric latitude, east-positive longitude, metres relative to the areoid | Internal canonical form |
| HiRISE DTM | Mars 2015 sphere (R = 3,396,190 m), planetocentric, equirectangular, centre longitude 0 | Pixel to lon/lat with the file's transform |
| MOLA-HRSC DEM, Viking mosaic, MSL mosaic | Planetocentric, east-positive, simple cylindrical / equirectangular | Same |
| NSSDC Viking and Pathfinder sites | Degrees west | lonE = 360 - lonW |
| Cesium globe and tiling scheme on `Ellipsoid.MARS` | Geodetic (planetographic) latitude | `toCesium(latC, lonE)`: latG = atan(tan(latC) x (a/b)^2), a = 3,396.19 km, b = 3,376.20 km |
| Our tiles | Cut on Cesium's geographic tiling scheme | For each tile pixel, convert its geodetic latitude back to planetocentric before sampling the source raster (same formula, Python port, shared test vectors) |

Heights: every source is referenced to the areoid. Tiles store areoid heights and Cesium treats them as heights above the ellipsoid. `seniordev:` absolute heights are off by the areoid undulation (a few km at most), but every layer shares the same reference, so terrain, rover models, tracks and pins stay consistent; add the MOLA areoid grid if true ellipsoidal heights are ever needed.

Unit tests: SITE-01 shifts by 0.0543 deg latitude (SITE-07); the terrain tile height at SITE-01 is within 20 m of MMGIS -4,500.97 m.

## 5. Data flows

### 5.1 Plan a Marswalk

```
user picks stops ─► scene state ─► planner worker
   worker: load grid (once) ─► Dijkstra from habitat on reversed edges = timeHome[cell]
           A* habitat ─► stop1 ─► ... ─► habitat (edge cost = metres / speed(slope))
           timeline: life support left, dose, Sun elevation, timeHome at each step
   ─► budgets ─► { ok | breaches[] } ─► UI paints route + heat map + bars
   ─► URL and localStorage updated (form persistence)
```

### 5.2 Ask the suit assistant

```
push-to-talk ─► speech in: Web Speech API (online) | Whisper in a worker (offline or unsupported browser)
   ─► text question
   online:  POST /api/v1/assistant { persona: "suit", messages, tools }
            relay tries Gemini ─► Groq ─► OpenRouter; returns { provider, message: text | toolCalls }
            browser runs each tool (zod-checked args) ─► sends tool results ─► relay ─► final text
   offline: rules map the question to tools ─► template sentence
   ─► captions + source chips (fact IDs from the tools) ─► Kokoro speaks (suit voice)
```

### 5.3 Mission Control reply

```
"Send to Earth" ─► message stamped with scenario time
   delay = 2 x lightTime(scenarioDate) / compression   (22.0 min / 60 = 22 s on 14 Nov)
   countdown labelled "time-compressed 60x"
   at zero: same loop with persona "mission-control" ─► Kokoro speaks (Mission Control voice, radio band-pass)
```

### 5.4 Relive a sol

```
timeline ─► load data/sols/msl-0182.json (or the Dingo Gap scene for sol 528)
   fly to the waypoint ─► Curiosity model (toCesium + terrain height, yaw from waypoint)
   Sun from Mars24 at that sol's local time ─► credited photos ─► weather and dose cards
   Dingo Gap: rover-scale 3D Tiles placed at the sol 528 waypoint; walk at eye height on the rover-built terrain
```

### 5.5 Offline

```
after one online visit the service worker holds: shell, data, tiles, models (Kokoro, Whisper)
   globe, descent, walk, relive: identical, from cached tiles
   assistant: Whisper ─► offline rules over the same tools ─► Kokoro
   banner: "Offline: cached real data from <manifest date>"
```

## 6. API design

Versioned under `/api/v1/` by file path. Full contract in `IMPLEMENTATION_PLAN.md` section 7.

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/v1/assistant` | Origin allow-list + per-IP rate limit (no user accounts) | Relays one brain turn through the free provider chain |
| GET | `/api/v1/health` | none | `{ status, checks, version, uptimeS }` |
| POST | `/api/v1/tts` (P2) | same | Gemini TTS for Kannada and Hindi replies |

## 7. Caching

| What | Where | TTL and invalidation |
|---|---|---|
| `data/*`, `tiles/*`, `models/*` | CDN, service worker | Immutable; a pipeline run writes a new version folder (`tiles/v2/...`) and the manifest points to it |
| App JS/CSS | CDN | Vite content hashes; immutable |
| `index.html`, `sw.js` | CDN | `no-cache` |
| Planner grid | Worker memory | Once per session |
| Facts | Module memory | Once; IDs are stable |
| Assistant replies | none | Never cached (they depend on live state) |

## 8. Security architecture

Summary; details in `docs/SECURITY_ACCESS.md`.
- The Gemini, Groq and OpenRouter keys exist only in Vercel environment variables; the browser never sees them.
- The relay checks `Origin`, validates the body with zod (size-capped), rate-limits per IP, applies a timeout and circuit breaker per provider, and logs structured JSON without message content.
- Free-tier quotas are the cost ceiling: nothing can be billed because no payment method is attached to any account.
- CSP allows network calls only to our own origin plus three named hosts for live tiles and rover photos (mars.nasa.gov, trek.nasa.gov, astro.arcgis.com); speech recognition in Chrome is a browser service, not a page request.
- Microphone is the only powerful feature allowed.

## 9. Scaling

| Load | What happens | Action |
|---|---|---|
| 1x (judges, team) | Static CDN; a few assistant turns | None |
| 10x (shared publicly) | Gemini free limits reached first; relay falls to Groq, then OpenRouter | Automatic; offline rules as the last step |
| 100x | All free tiers exhausted daily; static hosting bandwidth for tiles grows | Assistant answers from offline rules; reduce tile levels or move tiles to a free static host with more bandwidth |

## 10. Dependencies

```
tiles/, data/ ◄── pipeline/      core/ ◄── data/       planner.worker ◄── core/, grid
assistant ◄── core/, data/, /api/v1/assistant           scenes ◄── globe/, core/, assistant, audio
```

External services by criticality: static hosting (cached offline after the first visit), the AI chain (offline rules as fallback), Chrome's speech service (Whisper as fallback).
