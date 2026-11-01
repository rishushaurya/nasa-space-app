---
name: homeward-dev
description: Build, run, test and extend the Homeward Mars app (NASA Space Apps 2026). Use for any coding, data-pipeline, testing or fixing task in this repository.
---

# Homeward development

Read `README.md` first (rules, decisions D1-D20, section 13 for what is built), then the last `CHANGELOG.md` entry, `build/MANIFEST.md`, `build/PLAN-2.md` (research and decisions behind Explore, Rover view and walking yourself) and, for detail, `BUILD_LOG.md` (section 12 for version 2.0).

## Commands

| Task | Command |
|---|---|
| Install | `npm ci` |
| Voice and speech models (once; pinned and hash-checked) | `npm run models` |
| Run (app + API relay in one dev server) | `npm run dev`, open http://localhost:5173 |
| Unit tests, golden values, 40-question assistant eval (52 tests in 9 files) | `npm test` |
| Type check | `npm run typecheck` |
| Diagnostics (20 checks, PASS/FAIL with fix hints) | `npm run diag`; `node scripts/diagnostics.mjs --quick` skips build and audit; `--base <url>` checks a deployment |
| Production build and preview (sends the `vercel.json` headers, CSP included) | `npm run build`, then `npm run preview` (http://localhost:4173) |
| Data pipeline (from `pipeline/`, Windows) | `../.venv/Scripts/python snapshot.py`, then `make_grid.py`, `make_rasters.py`, `make_moons.py`, `fetch_audio.py`, `rovers.py` (stops, tracks, Ingenuity, Gazetteer, offline featured stops), `build_facts.py` (also builds `data/places/landers.json`), `build_corpus.py`, and last `manifest.py` |

## Non-negotiable rules

1. Every number on screen comes from `app/public/data/facts.json` (by ID) or a tested function in `app/src/core/`. Never type a number into a component. New fact: add a row to `pipeline/facts.csv` with badge and source, run `build_facts.py` and `manifest.py`.
2. Coordinates are planetocentric, east-positive everywhere; convert only through `toCesium` / `ocToOg` in `app/src/core/frames.ts`.
3. No paid services, no Cesium ion, no NASA logos, no emojis, no invented data. Generated visuals carry the GENERATED badge.
4. Colours and spacing only from `app/src/styles/tokens.css`.
5. Every data panel uses `Panel` (loading, error, empty, ok).
6. Before claiming anything works: run `npm test`, `npm run typecheck`, `npm run diag`, and look at the app in the browser.

## Where things live

- `app/src/core/` pure logic: `mars-time.ts` (Mars24), `ephemeris.ts` (JPL elements, Mars-fixed rotation), `moons.ts` (JPL Horizons), `frames.ts`, `planner.ts` (+ worker), `dose.ts`
- `app/src/globe/` Cesium viewer on our own terrain and imagery rasters; `layers.ts` live Trek and OnMars tiles on a planetocentric tiling scheme; `live.ts` the layer list (no Cesium import, so scenes can use it); the camera API (`globe.cam`) keeps Cesium out of scene code and out of the startup bundle
- `app/src/core/camera.ts` CAHV camera model and attitude maths for Rover view; `app/src/core/places.ts` place search; `app/src/rovers/raw.ts` rover stops and NASA raw-image client (zod at the boundary)
- `app/src/assistant/` tools, brain (relay client), offline rules, Kokoro voice (+ worker), wind, speech in, Mission Control (`Dock.tsx`), eval
- `app/src/scenes/` one file per scene: `Clock` (Mars now), `Explore` (Google-Earth globe: search, landers, tracks, layers, map controls, ruler; also exports `stopsFor`), `Flight` (Orbit, Descent), `Briefing`, `Plan`, `Walk` (walk yourself by default, Follow the plan), `Relive` (Rover view; the scene id stays `relive` so old links work), `Credits`; `app/src/ui/` shared components (`fmtLatLon` prints planetocentric, 0-360 E)
- `app/src/state.tsx` URL and localStorage state, including `imagery`, `hirise`, `labels`, `tracks`, `rover: { m, site, drive }` and `place`
- `api/v1/` Vercel functions (Web Request/Response); the dev server runs the same files
- `pipeline/` Python data scripts writing to `app/public/data/`; `app/public/sw.js` offline service worker

## Rover view essentials (research in `build/PLAN-2.md` section 2)

- Stops are MMGIS waypoints in `data/rovers/{msl,m20}-stops.json`, sorted by rover motion counter (site, drive). A stop is addressed by site and drive, never by index.
- Photos come live from NASA: Curiosity `mars.nasa.gov/api/v1/raw_image_items/?condition_1=msl:mission&condition_2=<a>:sol:gte&condition_3=<b>:sol:lte&condition_4=<CAMERA>:instrument`; Perseverance `mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&search=%7CNAVCAM_LEFT%7CMCZ_LEFT&condition_2=...`. Neither filters by site or drive; `raw.ts` does that client-side.
- A photo belongs to the latest stop at or before its (site, drive); exact matches are preferred when there are at least 8 (Perseverance's counter ticks without wheel motion).
- Placement: CAHV model from `camera_model_component_list` (already in the delivered image's pixel grid), attitude quaternion `(s, x, y, z)` from rover frame to local level (north, east, down). `core/camera.ts` builds a CSS `matrix3d` per photo; the view is `translateZ(p) rotateX(pitch) rotateY(yaw)` with `p = max(w, h) / 2 / tan(fov / 2)`, matched to Cesium's `frustum.fov`. Golden test: `core/camera.test.ts` (a real sol 3000 Navcam record).
- Curiosity Navcam has pointing from sol 13; Curiosity Mastcam has none (film strip only). Offline copies of four featured stops live in `data/rovers/cache/` (`pipeline/rovers.py featured()`).

## Traps already hit (details in `BUILD_LOG.md` sections 7 and 12.3)

- Kokoro must run in `voice.worker.ts`; on the main thread it freezes the globe. The ONNX runtime path must be a full-origin URL.
- Edit regexes with the file tools, not shell heredocs: escaped word boundaries turned into raw backspace bytes twice (diagnostics check 20).
- A hidden browser pane pauses animation frames; camera flights finish on a timer, and frame rates measured there mean nothing.
- `/data/` paths are not content-hashed: never mark them immutable; the service worker evicts files whose manifest hash changed.
- `npm run preview` sends the production headers from `vercel.json` (CSP included); the dev server does not. Check anything that loads code, fonts or cross-origin files there. Use `CesiumWidget`, never `Viewer`: Viewer's Knockout widgets need `'unsafe-eval'`.
- Scenes must not import `cesium` (even `{ Cesium }` from `globe.ts`): it pulls the whole engine into the startup bundle (diagnostics check 18 failed at 1,229 KB). Add a method to the globe API instead.
- Live tiles from Trek and OnMars are planetocentric: always use `OcentricTiling`, or they sit 3.2 km off at Gale.
- Non-draped points (stop dots) drift from draped lines at coarse zoom (terrain LOD parallax); they show only within 25 km.
- Pins skip the depth test only within 300 km; with `Infinity` they show through Mars from the far side.
- Shell heredocs break on apostrophes in this environment: write files with the file tools.
- With Vite `root: "app"`, `ssrLoadModule("/api/...")` resolves under `app/`; the dev relay uses an absolute path.

End every session with a `CHANGELOG.md` entry, a `build/MANIFEST.md` update and, for large sessions, an entry in `BUILD_LOG.md`.
