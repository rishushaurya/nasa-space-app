# Homeward 4.0 plan: the five resources the challenge names

> Version 4.0.0 | 2026-11-14 | Written after a research pass on 14 Nov 2026 (every endpoint below was opened and its CORS headers checked from the deployed origin). Read with `README.md`, `build/PLAN-3.md` and `docs/PROJECT_GRAPH.md`.

## 1. What the team asked for (14 Nov 2026)

Put the five resources the official statement lists into Homeward, researched first, each where it belongs:

1. JPL Mars Trek (the team's link opens the Viking 2 landing site with an HRSC, a CTX and a HiRISE image on).
2. USGS-NASA Planetary Geologic Mapping Program, "Interactive Maps: Mars".
3. "Curiosity's Proposed Path up Mount Sharp" (route map and flyover).
4. NASA Worldview.
5. The Mars Perseverance raw images gallery.

## 2. What each resource is, and what we already had

| Resource | What it really is (checked) | Already in Homeward | Gap |
|---|---|---|---|
| Mars Trek link | Three Trek products at Viking 2 (47.6-48.0 N, 134.2 E): `h1394_0000_nd3` (Mars Express HRSC, to level 9), `b16_015887_2280_xn_48n225w` (MRO CTX, to level 12), `PSP_001501_2280_RED` (MRO HiRISE, to level 16). Trek's search index lists 16 landing-site mosaics; new to us: Viking 1 (`PSP_001521_2025_RED`, `Viking_CTX_BlockAdj_dd`, `h2942_0000_nd3`) and Viking 2. Two are fictional sites from the film "The Martian" (Ares 3, 4) | Trek tiles for THEMIS, Viking colour, relief, geology, TES, and HiRISE site mosaics of Jezero, Spirit, Opportunity, Phoenix, InSight | Viking 1 and Viking 2 site mosaics; a way to switch a lander's mosaic on from its card |
| Trek geology service | `SIM3292_Global_Geology/MapServer/identify` returns the unit at a point (Gale: `AHi`, "Amazonian and Hesperian impact unit"); CORS echoes our origin; host already in `connect-src` | The geologic map as a coloured overlay | The unit's name under any place, in words |
| USGS "Interactive Maps: Mars" | An ArcGIS web app (item `f693b580...`) over one feature layer, `PGM_Map_Database_MARS_INTERACTIVE2/FeatureServer/1`: the footprints of all 148 published USGS geologic maps of Mars (title, scale, map number, year, DOI). CORS `*`. Jezero has SIM 3464 at 1:75,000; Meridiani SIM 3356 at 1:2,000,000 | Only the global SIM 3292 | Which published maps cover a spot, finest first, with their USGS pages |
| Curiosity's proposed path | PIA23179 (15 May 2019): an oblique 3D view of the route proposed up lower Mount Sharp, from HiRISE, CRISM, CTX and HRSC; in the NASA Image Library (host already allowed). It is a perspective picture, not a georeferenced map; the caption names no regions | Curiosity's real drive (MMGIS), 1,386 stops | The official route picture beside the real drive, labelled as a 2019 proposal |
| NASA Worldview | Earth imagery from NASA GIBS. `gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi` serves one image per request, CORS `*`: Landsat WELD annual true colour (30 m, cloud-free) and MODIS Terra true colour by date | Nothing about Earth beyond the light-time and the Earth marker | "Learn from maps of other destinations": Earth's Mars-analog walking ground, seen from orbit, with a date picker as in Worldview |
| Perseverance raw images | The same feed Rover view already reads; it also sorts newest first and reports totals (579,518 records on 14 Nov; newest sol 2031) and filters by camera (`search=|CAMERA`) | Photos per stop (placed in 3D) and every photo of a stop | The gallery itself: newest images from Mars, by camera, and a step from any image to the stop it was taken at |

Not used: Trek's search index (no CORS header; not needed at run time), the PIA23179 flyover video (the page links none), Ares 3 and 4 mosaics (fiction).

## 3. Decisions

| ID | Decision | Reason |
|---|---|---|
| D28 | Viking 1 and Viking 2 HiRISE, CTX and HRSC mosaics join the "sites" overlay, each bounded by its WMTS footprint; a lander card offers "Show the site mosaic" when one covers it | The team's Trek link, generalised to every lander Trek has mosaics for |
| D29 | The rock unit under a place comes live from Trek's SIM 3292 identify (already allowed host); offline it is simply not shown | Words for the coloured map: what the walker stands on |
| D30 | The USGS map catalogue is snapshotted by the pipeline (`pipeline/usgs_maps.py`, footprints simplified to about 0.05 deg) and searched on the device (point in polygon, tested); no new run-time host | 148 polygons are small; works offline; keeps the CSP unchanged |
| D31 | PIA23179 is pinned first in Curiosity's photos and captioned as NASA's 2019 proposed route; the drive on the map is where Curiosity really went | Official resource, honest framing |
| D32 | Rover view gets "Newest from Mars": the feeds' own newest-first pages, a camera filter, the published total, and "Stand at this stop" for an image whose site and drive resolve to a stop | The raw-images gallery inside the app, tied to the street view |
| D33 | CSP `img-src` adds `https://gibs.earthdata.nasa.gov` for one Earth panel: the Haughton-Mars Project Research Station (75 deg 26 min N, 89 deg 52 min W; Mars Institute, NASA-supported) in Landsat WELD annual colour, or MODIS for a chosen date, with the planner's 2 km walking radius drawn to the same scale | Worldview's imagery and its time picker, used for the statement's "learn from maps of other destinations" |

## 4. Chunks (each ends with tests, typecheck, diag and a browser check)

| Chunk | Goal | Files | Done when |
|---|---|---|---|
| 28 Trek landing-site mosaics | D28 | `globe/live.ts`, `scenes/Explore.tsx`, `pipeline/sources.csv` | Viking 1 and 2 show HiRISE from the card; tiles load under the production CSP |
| 29 Rock unit here | D29 | `data/usgs.ts` (+test), `scenes/Explore.tsx` | Gale shows AHi with its description and source |
| 30 USGS geologic maps here | D30 | `pipeline/usgs_maps.py`, `data/usgs/mars-maps.json`, `data/usgs.ts` (+test), `Explore.tsx` | Jezero lists SIM 3464 first; golden test on the real file |
| 31 Mount Sharp route | D31 | `rovers/library.ts` (+test), `Explore.tsx` | Curiosity's photos open with PIA23179, credited |
| 32 Newest from Mars | D32 | `rovers/raw.ts` (+test), `scenes/Relive.tsx` | Newest Perseverance images load, filter by camera, and one steps to its stop |
| 33 Earth analog (Worldview) | D33 | `scenes/Plan.tsx` (panel), `vercel.json`, `scripts/diagnostics.mjs`, `facts.csv`, `sources.csv` | Landsat image with the 2 km circle; date switches to MODIS; no CSP violation in preview |
| 34 Documents | README D28-D33 and section 13, CHANGELOG, MANIFEST, BUILD_LOG, DATA_SPEC, COMPLIANCE, skills, graph | docs | As-built is true |
