# Homeward 2.0 plan: Google-Earth Mars, Rover Street View, walk yourself

> Version 2.0.0 | 2026-11-01 | Written after a research pass on 1 Nov 2026. Status: chunks 10-16 DONE on 1 Nov 2026 (live status in `build/MANIFEST.md`). Read with `README.md`.

## 1. What the team asked for

1. A Google-Earth experience: fly anywhere on Mars, search places, sharp imagery as you zoom, every place a crew or a robot has been.
2. Walk yourself: no auto-walk by default; the walker moves you.
3. Every visited place: all landers, rovers and crash sites, with their tracks.
4. Every rover image in order, viewable like Google Street View: stand at a rover stop, look around, click an arrow to move to the next stop.
5. Everything the challenge asks, made real, accurate and usable.

## 2. Research findings (all opened and tested on 1 Nov 2026)

| Finding | Evidence | What it unlocks |
|---|---|---|
| Curiosity raw-image API (`mars.nasa.gov/api/v1/raw_image_items`) sends `Access-Control-Allow-Origin: *`; Navcam frames from sol 13 carry `site`, `drive`, `attitude` (quaternion), and a CAHVOR camera model; filter by camera with `condition_4=NAV_LEFT_B:instrument`; site and drive cannot be filtered server-side | curl of sols 3, 13, 166, 528, 1000, 2000, 3000, 4709, 5040 | Every Curiosity stop since sol 13 as a 360 view |
| Perseverance raw-image API (`mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020`) has the same fields plus 320/800/1200 px versions; camera filter `search=%7CNAVCAM_LEFT%7CMCZ_LEFT` | curl of sols 100, 600-605 | Every Perseverance stop as a 360 view |
| Image files (no CORS, no CORP header) load in `<img>` only if the page's COEP is `credentialless`, not `require-corp` | response headers | Change COEP; place frames with CSS 3D, not WebGL |
| MMGIS waypoints: 1,386 Curiosity stops (sol 3-5045), 708 Perseverance stops (sol 13-2022), each with site, drive, sol, lat, lon, yaw, distance driven; full drive paths `MSL_traverse.json`, `M20_traverse.json`; Ingenuity `m20_heli_waypoints.json` | downloaded | Stops in true order; traverse lines; helicopter flights |
| MMGIS lists NASA cylindrical Navcam panoramas per Perseverance stop, but the files return HTTP 403 | curl | Not usable; we place the raw frames ourselves |
| Conventions checked on real records: rotating the rover X axis by the API quaternion `(s,x,y,z)` gives 28.68 deg for Curiosity site 85 (MMGIS yaw 28.68) and 221.38 deg for Perseverance site 4 drive 218 (MMGIS -138.62); the CAHV ray at the optical centre matches the reported mast azimuth | python check | Exact placement of each photo in the 360 view |
| Mars Trek tiles (`trek.nasa.gov/tiles/Mars/EQ/...`) and Esri OnMars (`astro.arcgis.com/.../OnMars/CTX`, `.../HiRISE`) send `Access-Control-Allow-Origin: *`; 2x1 geographic tiles on the Mars 2000 sphere (planetocentric) | WMTS capabilities, MapServer JSON | Live CTX 5 m global imagery, HiRISE, THEMIS day and night IR, Viking colour; streamed like Google Earth |
| These tiles are planetocentric; the globe is on the IAU ellipsoid (geodetic latitude): without conversion they sit 3.2 km off at Gale and up to about 20 km at 45 deg | D7 formula | A tiling scheme that converts tile edges |
| USGS Gazetteer returns all 2,097 named Mars features (planetocentric, east, 0-360) with diameter and type | HTML table | Search and Google-Earth-style labels |
| PDS Geosciences Node (ODE) landing-site table with references: Spirit, Opportunity, Phoenix, Pathfinder, Viking 1 and 2, MSL | page text | Cited lander coordinates |
| InSight raw images have no pointing data; Spirit and Opportunity have no public JSON API or traverse vectors found | API probe, Trek search | Galleries and pins only for those, stated on screen |

## 3. Decisions

| ID | Decision | Reason |
|---|---|---|
| D15 | COEP `credentialless` instead of `require-corp`; CSP adds `mars.nasa.gov`, `trek.nasa.gov`, `astro.arcgis.com` to `img-src` and `connect-src` | Rover photos have no CORP header; Chrome and Firefox keep cross-origin isolation (multithreaded Kokoro); Safari runs Kokoro single-threaded |
| D16 | Rover Street View in CSS 3D (one `<img>` per frame, `matrix3d` from the CAHV model and attitude) over the Cesium eye view at the same spot | Images cannot be WebGL textures without CORS; CSS keeps every frame a real, linked NASA image |
| D17 | Live NASA/Esri imagery online, our own rasters offline | Google-Earth sharpness online, the same full 3D offline (D11 still holds) |
| D18 | Stops are MMGIS waypoints; a frame belongs to a stop when its site and drive equal the waypoint's | Positions are NASA's; mid-drive frames are listed but not placed |
| D19 | Lander coordinates live in `pipeline/landers.csv` with badge and sources, checked like facts | Same provenance rule as facts, numeric for flying |
| D20 | Manual walking is the default; "Follow the plan" replays the planner | The team asked to walk themselves |

## 4. Chunks (build order; each ends with tests, typecheck, diag and a browser check)

| Chunk | Goal | Files | Done when |
|---|---|---|---|
| 10 Headers | COEP credentialless, CSP for NASA hosts | `vite.config.ts`, `vercel.json`, `scripts/diagnostics.mjs` (15), `docs/SECURITY_ACCESS.md` | A Navcam JPEG loads in the dev page; check 15 passes |
| 11 Data | Stops, traverses, Ingenuity, landers, Gazetteer, offline copies of featured stops | `pipeline/rovers.py`, `pipeline/landers.csv`, `build_facts.py`, `sources.csv`, `app/public/data/rovers/*`, `data/places/*` | Files validated by zod in `load.ts`; manifest updated |
| 12 Live layers | CTX, HiRISE, THEMIS day/night, Viking; planetocentric tiling scheme | `app/src/globe/globe.ts`, `app/src/globe/layers.ts` | CTX lines up with our Gale mosaic at 25 cm (visual check); unit test of tile edges |
| 13 Explore | Google-Earth scene: search, mission list, labels, traverses, nav controls, cursor readout, ruler | `app/src/scenes/Explore.tsx`, `App.tsx`, `state.tsx`, `app.css` | Search "Jezero" flies there; every lander pin opens a cited card |
| 14 Rover view | Street View for Curiosity and Perseverance: 360 frames, arrows to neighbours, drag, zoom, keys, minimap, film strip, lightbox, deep link | `app/src/core/camera.ts` (+test), `app/src/rovers/raw.ts`, `app/src/scenes/Relive.tsx` | Station 85/0 shows frames at the right azimuths; arrows move along the track |
| 15 Walk yourself | Manual by default; WASD/arrows hold to walk at the Apollo pace, drag to look, on-screen pad, stop and home detection | `app/src/scenes/Walk.tsx` | Walk from habitat to the stop and back by hand; debrief appears |
| 16 Docs | README section 13, CHANGELOG, MANIFEST, DATA_SPEC, BUILD_LOG, credits | docs | Diag passes; as-built is true |

## 5. Not in this pass (with reason)

- 200 m terrain at landing sites other than Gale (`pipeline/make_rasters.py` can cut more 200 m windows from the global DEM COG); today they are sharp in CTX but flat in 3D.

- Spirit and Opportunity Street View: no public pointing metadata or traverse vectors found; pins, HiRISE roving-site layer and links instead.
- InSight, Phoenix, Pathfinder, Viking photo bubbles: no pointing data in a public API.
- Zhurong: CNSA data needs registration; pin only.
- Rover-scale 3D meshes (Dingo Gap T41), Jezero 1 m walk zone, ice overlay, Kannada and Hindi: unchanged from the cut list.
