# Homeward 3.0 plan: whole-Mars 3D, every visited place, live conditions, smoother globe

> Version 3.0.0 | 2026-11-13 | Written after a research pass on 13 Nov 2026 (every endpoint below was opened and its headers checked). Status: chunks 17-26 DONE on 13 Nov 2026 (`build/MANIFEST.md`). One planned item moved out: InSight raw images by sol (the lander photo strip covers InSight). Read with `README.md` and `build/PLAN-2.md`.

## 1. What the team asked for (13 Nov 2026)

1. A knowledge graph of the project, kept up to date, so every connection is understood and checked.
2. Compare the build against the official problem statement and close the gaps.
3. Real data everywhere (no demo data), from every space agency where possible.
4. Proper controls and less lag, using well-researched techniques.
5. Every Mars mission and visited place, viewable like a Google Maps ride: picture by picture and in 360.
6. Whole Mars like Google Earth: real surroundings generated from real data.
7. Real tests and real physics; documents so a new session knows what was done; push without a Claude co-author line.

## 2. The build against the official statement (pasted by the team, 13 Nov 2026)

| The statement asks for | State before 3.0 | Gap closed in 3.0 |
|---|---|---|
| A layered, integrated view of a location or route, from multiple NASA science missions | Planner fuses HiRISE slope and relief, Apollo walk-back rate, RAD dose, Mars24 daylight into one go/no-go; imagery from MRO, Odyssey, Viking | Layer stack gains geology (USGS SIM 3292), thermal inertia and dust (MGS TES), colour shaded relief (MOLA-HRSC), Jezero HiRISE 25 cm; every layer has an opacity and a source |
| At least three kinds of data (optical, thermal, spectral, topographic, geophysical, atmospheric, radiation, chemical) | Optical, topographic, thermal (THEMIS), radiation, atmospheric (facts) | Adds geologic, mineral-related (TES), live atmospheric (REMS latest sol), live space weather (DONKI) |
| Astronaut safety first; radiation and space weather | Dose budget, storm drill on the May 2024 numbers | Live CME arrivals predicted at Mars (NASA CCMC WSA-Enlil via DONKI), shown in the briefing with their source |
| Suits and equipment limit mobility; a route that avoids obstacles such as large rocks | Slope and 1 m relief cells block the route; walk speed from Tobler scaled to the Apollo rate | Radio line of sight to the habitat over the real terrain, in the walk HUD (a suited explorer out of sight of the antenna needs relay or turn-back) |
| Current conditions | Clock, Sun, light time live; weather as archived facts | The latest sol Curiosity's REMS station released (date shown, MEASURED), plus live space weather |
| Point-of-view imagery so the crew knows what to expect | Rover view at every Curiosity and Perseverance stop | A ride (autoplay) along a rover's real drive; NASA photo library for every lander (Viking, Pathfinder, Spirit, Opportunity, Phoenix, InSight, Zhurong as seen by HiRISE) |
| Display as habitat screen, tablet or HUD | All three | Unchanged |
| Learn from maps of other destinations | Apollo walk-back, Artemis EVA limits | Unchanged |
| Whole planet as context (team ask) | 3D relief only at Gale (HiRISE) and the 7.5 km global grid elsewhere | Real 200 m MOLA-HRSC relief everywhere, streamed and decoded off the main thread |

## 3. Research findings (all opened and tested on 13 Nov 2026)

| Finding | Evidence | What it unlocks |
|---|---|---|
| Esri OnMars `MDEM200M` ImageServer: the MOLA-HRSC 200 m blend v2 as 512 px LERC elevation tiles, levels 0-7 (0.00275 deg = 163 m at level 7), Float32 metres, Mars 2000 sphere (planetocentric), `Access-Control-Allow-Origin: *`, host already in our CSP | `?f=json` service description, tile 3/2/5 headers and `CntZImage` magic | Real relief for the whole planet, streamed like Google Earth |
| `lerc` 2.0.0 (Esri, Apache-2.0) is already installed as a Cesium dependency; pure JS decoder | `node_modules/lerc/package.json` | Decode tiles in a Web Worker, no new download |
| Mars Trek WMTS (CORS `*` or origin echo): `SIM3292_Global_Geology` (to level 11), `TES_Thermal_Inertia`, `TES_Dust` (level 1), `Mars_MOLA_blend200ppx_HRSC_ClrShade` (level 8), `JEZ_hirise_soc_006_orthoMosaic_25cm` (level 17), Spirit, Opportunity and Phoenix HiRISE site mosaics (level 16-17) | WMTSCapabilities.xml per layer, tile headers | Geology, thermal, dust and shaded-relief overlays; sharp Jezero |
| PDS Geosciences Node (Analyst's Notebook) publishes the interpolated Spirit (8,804 drives, sols 1-2209) and Opportunity (21,104 drives, sols 1-5130) traverses as CSV. Spirit: equirectangular metres centred 175.5 E; Opportunity: metres east and north of the landing site | The labels `MERA_traverse.lbl`, `MERB_traverse_5130.lbl`; Opportunity's sol 951-1634 positions average to 2.048 S, 5.504 W, the Gazetteer centre of Victoria crater (2.05 S, 5.50 W) | The two missing rover tracks: 7.2 km and 45.1 km |
| HiRISE ESP_048041_1780 shows the Schiaparelli impact, centred 2.093 S, 353.780 E (25 Oct 2016) | uahirise.org product page | Schiaparelli on the "every visited place" map |
| NASA's MSL weather feed (`mars.nasa.gov/rss/api/?feed=weather&category=msl`, CORS `*`) lists 4,745 sols; the newest is sol 4995 (25 Aug 2026): min -71 C, max -5 C, 777 Pa, UV moderate | curl | "Latest measured weather" with its date, honestly not live |
| DONKI WSA-Enlil runs (`api.nasa.gov/DONKI/WSAEnlilSimulations`, CORS `*`, `DEMO_KEY` 10 requests per hour) list impacts at Mars: 13 of 56 runs in the last 30 days, the latest predicting a glancing blow at Mars on 13 Nov 2026 12:00 UTC | curl | Live space weather at Mars; through our relay so the key stays server-side and `connect-src` stays `'self'` |
| NASA Image and Video Library (`images-api.nasa.gov`, CORS `*`; files on `images-assets.nasa.gov`) has the landers' own photos with JPL credits: Viking 1 (28), Pathfinder (57), Opportunity panoramas (30), Spirit (3+), Phoenix, InSight, and HiRISE's Zhurong image | search queries | A photo strip for every lander, picture by picture |
| InSight raw images come from the same `raw_image_items` API as Curiosity (`condition_1=insight:mission`), without camera models | curl | InSight photos by sol (no 360: no pointing) |
| JPL Horizons has merged ephemerides for MRO (-74), Odyssey (-53), Mars Express (-41), TGO (-143) and Hope (-62) through Nov 2026; MAVEN's ends 1 Mar 2026 | Horizons API | The orbiters overhead, labelled, at their real positions |
| Render on demand (`requestRenderMode`) is Cesium's documented way to stop drawing frames when nothing changes | Cesium docs, "Improving Performance with Explicit Rendering" | Idle GPU and CPU near zero; smoother on weak laptops |

Not found or not usable: MER camera pointing (no 360 for Spirit and Opportunity), PDS Imaging Atlas search returned nothing for MER, NSSDC pages for Mars 2, Mars 6 and Mars Polar Lander did not load in this pass (not added: no unverified coordinates).

## 4. Decisions

| ID | Decision | Reason |
|---|---|---|
| D21 | Global terrain streams live from `MDEM200M` (LERC), decoded in a worker and cached; our own finer rasters win where they exist; offline falls back to our 7.5 km grid | Whole-planet relief at 200 m data resolution without storing 11 GB; the same planetocentric conversion as D7 |
| D22 | The globe renders on demand (`requestRenderMode`); every globe method that changes the scene asks for a frame | The globe stops spending GPU when nothing moves; animations and flights still render |
| D23 | Space weather comes through our relay `/api/v1/spaceweather` (DONKI, `NASA_API_KEY` or `DEMO_KEY`, cached 30 min); latest measured weather comes straight from `mars.nasa.gov` | Keeps keys server-side and `connect-src 'self'`; the weather host is already allowed |
| D24 | CSP adds `https://images-api.nasa.gov` (connect) and `https://images-assets.nasa.gov` (img) for the NASA photo library | NASA's own public archive; the only way to show every lander's photos |
| D25 | Spirit and Opportunity tracks come from the PDS Geosciences Node tables; the pin stays the PDS ODE landing value (Spirit's first traverse point sits about 0.4 km from it: different control networks, said on screen) | Real, cited traverses; no silent re-alignment |
| D26 | The "ride" steps a rover's real stops automatically after each stop's photos load, with a dwell the user can change; the landing-site tour flies the landers in landing order | Google-Maps-style ride on real records |
| D27 | Radio line of sight uses the planner's HiRISE grid and the sphere's curvature; eye 1.7 m and habitat mast 3 m are ASSUMPTION values | Real terrain physics, honestly labelled |

## 5. Chunks (each ends with tests, typecheck, diag and a browser check)

| Chunk | Goal | Files | Done when |
|---|---|---|---|
| 17 Graph | `graphify-out/` graph of code and documents; `docs/PROJECT_GRAPH.md` explains communities and how to refresh | `.graphifyignore`, `graphify-out/`, `docs/PROJECT_GRAPH.md` | Report lists the god nodes and communities |
| 18 Global terrain | Live 200 m relief everywhere | `app/src/globe/dem.ts`, `dem.worker.ts`, `globe.ts`, `package.json` (lerc pin) | Olympus Mons and Valles Marineris show relief; Gale unchanged; offline falls back |
| 19 Smoother globe | Render on demand; tile cache; no main-thread decode | `globe.ts` | Idle frames stop; flights, walk and rover view still render |
| 20 Layers | Geology, TES thermal inertia and dust, MOLA-HRSC shaded relief, Jezero HiRISE, MER and Phoenix HiRISE mosaics; opacity slider | `live.ts`, `layers.ts`, `globe.ts`, `Explore.tsx`, `state.tsx`, `sources.csv` | Each overlay draws over Gale or Jezero with its source |
| 21 Every visited place | Spirit and Opportunity tracks, Schiaparelli, a landing-site tour | `pipeline/rovers.py`, `landers.csv`, `Explore.tsx` | Tracks sit on the HiRISE mosaics; tour visits every lander |
| 22 Ride | Autoplay along a rover's stops | `Relive.tsx` | Ride steps on after each stop's photos load |
| 23 Mission photos | NASA photo library per lander; InSight raw images by sol | `app/src/rovers/library.ts` (+test), `Explore.tsx`, `vercel.json`, `diagnostics.mjs` | Every lander card shows real photos with credits and NASA links |
| 24 Live conditions | REMS latest sol; DONKI CME arrivals at Mars | `api/v1/spaceweather.ts` (+test), `app/src/core/conditions.ts` (+test), `Briefing.tsx`, `.env.example` | Briefing shows both with dates, badges and sources |
| 25 Physics | Radio line of sight in the walk HUD; orbiters in the orbit view | `app/src/core/los.ts` (+test), `Walk.tsx`, `pipeline/make_moons.py`, `Flight.tsx`, `globe.ts` | Golden LOS test; MRO and Odyssey move on their orbits |
| 26 Documents | README, CHANGELOG, MANIFEST, BUILD_LOG, DATA_SPEC, skills, graph refresh | docs | As-built is true |

## 6. Not in this pass (with reason)

- Street view for Spirit, Opportunity, InSight and the other landers: their public records have no camera pointing; photo strips instead.
- Rover-scale 3D meshes (Dingo Gap T41): still deferred until the team asks.
- Mars Climate Database values: the service needs a registration form; the briefing keeps saying so.
- Terrain finer than 200 m outside Gale (HiRISE DTMs at Jezero exist as Trek tiles but only as colour shaded relief, not heights).
