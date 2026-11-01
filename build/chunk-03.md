# Chunk 03: Data and tile pipeline

> Version 1.0.0 | 2026-10-29 | Goal: every data file and every Mars terrain and imagery tile the app needs, built reproducibly from public sources, hashed and licensed. Tickets T07, T39, T18 (data part), T41 (placement). Spec: `docs/DATA_SPEC.md` sections 4-5.

| Field | Value |
|---|---|
| Estimated time | 9 h (downloads in the background; tiles about 4-5 h) |
| Depends on | 01 |
| Unlocks | 04 (planner tests), 07 |
| Owner | Data engineer (facts and corpus: science lead) |

## Environment

```
python -m venv .venv
.venv\Scripts\activate          (Windows)   |   source .venv/bin/activate   (macOS/Linux)
pip install rasterio numpy requests pillow
pip freeze > pipeline/requirements.txt     (then trim to the direct packages, exact versions)
```

## Files

| Path | Does | Inputs | Outputs |
|---|---|---|---|
| `pipeline/fetch.py` | Downloads with retries (3 attempts, 1 s/2 s/4 s back-off); writes `raw/hashes.txt` with URL, SHA-256, bytes, UTC time | URLs below | `pipeline/raw/*` |
| `pipeline/make_grid.py` | Reads the DTM, Horn slope in numpy, clips the walk box, 2 m cells (slope max, elevation mean), nodata mask, writes header and binary | `raw/DTEEC_010573_1755_010639_1755_U01.tif` | `data/site/gale/grid.json`, `grid.bin` |
| `pipeline/snapshot.py` | MSL waypoints (sols 3-300 and the latest 20); sol 182 record; downloads at least 4 sol-182 images | MMGIS, raw-image API | `data/traverse/msl.json`, `data/sols/msl-0182.json`, `data/sols/img/*.jpg` |
| `pipeline/build_facts.py` | CSV to JSON with checks | `facts.csv`, `sources.csv` | `data/facts.json`, `data/sources.json` |
| `pipeline/build_corpus.py` | Markdown cards to JSON | `corpus.md` | `data/corpus.json` |
| `pipeline/frames.py` | ocentric/ographic conversion, same formulas and test vectors as `core/frames.ts` | - | - |
| `pipeline/make_grid.py --site boxwork` (P1) | Second planner grid around SITE-10 and SITE-11 with slope, `reliefM` and thermal inertia | DATA-26, DATA-25 | `data/site/boxwork/grid.{json,bin}` |
| `pipeline/thermal.py` (P1) | Reads the THEMIS quantitative cube (ISIS3, readable by rasterio/GDAL), resamples thermal inertia into both grids; records the units from the label | DATA-25 | `thermalInertia` layer |
| `pipeline/make_tiles.py` | Terrain (65x65 Int16) and imagery (256x256 JPEG) pyramids on Cesium's geographic tiling scheme for `Ellipsoid.MARS`; regions and levels per `docs/DATA_SPEC.md` 5.1; seam offset and feathering; `tiles/v1/manifest.json` with available ranges, sources, licences, processing log | DATA-21, DATA-22, DATA-24, DATA-03 | `app/public/tiles/v1/` |
| `pipeline/place_dingo_gap.py` | Copies the Dingo Gap tileset; computes its placement at SITE-08 (position via frames, heading from the waypoint yaw); checks edge heights against our terrain | DATA-23, waypoints | `tiles/v1/dingo-gap/`, `data/sols/msl-0528.json` |
| `pipeline/manifest.py` | Hash every file in `data/` and `tiles/` | `data/`, `tiles/` | `data/manifest.json` |
| `pipeline/facts.csv`, `sources.csv`, `corpus.md` | Hand-written by the science lead from `docs/DATA_SPEC.md` section 2 and the paper | - | - |

## Source URLs (checked on 28 Oct 2026)

| What | URL |
|---|---|
| DTM | `https://astrogeo-ard.s3-us-west-2.amazonaws.com/mars/mro/hirise/controlled/dtm/PSP_010573_1755_PSP_010639_1755/DTEEC_010573_1755_010639_1755_U01.tif` |
| DTM provenance | same folder, `provenance.txt` |
| Ortho (alignment check only) | same folder, `PSP_010573_1755_RED_A_01_ORTHO.tif` |
| STAC item | `https://stac.astrogeology.usgs.gov/api/collections/mro_hirise_socet_dtms/items/DTEEC_010573_1755_010639_1755_U01` |
| MSL waypoints | `https://mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json` |
| Sol 182 images | `https://mars.nasa.gov/api/v1/raw_image_items/?order=sol%20desc&per_page=50&page=0&condition_1=msl:mission&condition_2=182:sol:gte&condition_3=182:sol:lte` |
| Global DEM (about 11 GB) | `https://planetarymaps.usgs.gov/mosaic/Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif` |
| Global colour imagery (about 12 GB) | `https://planetarymaps.usgs.gov/mosaic/Mars_Viking_MDIM21_ClrMosaic_global_232m.tif` |
| MSL Gale 25 cm mosaic (23 GB grey; colour COG about 1 GB) | Download links on `https://astrogeology.usgs.gov/search/map/mars_msl_gale_merged_orthophoto_mosaic_25cm` (read on day 1) |
| Dingo Gap 3D Tiles | `https://github.com/NASA-AMMOS/3DTilesSampleData/tree/master/msl-dingo-gap` (`scene-tileset.json`, folder `0528_0260184_to_s64o256`) |
| THEMIS thermal inertia, 30S120E (about 2.4 GB, P1) | `https://asc-astropedia.s3.us-west-2.amazonaws.com/Mars/Odyssey/THEMIS-Global-Thermal-Inertia-Mosaic/Quantitative-32-Bit/THEMIS_TI_Mosaic_Quant_30S120E_100mpp.cub` |
| Boxwork DTMs (P1) | STAC items `DTEEC_019698_1750_019988_1750_U01`, `DTEEC_009149_1750_009294_1750_U01` in `mro_hirise_socet_dtms` |
| Boxwork-sol images (P1) | Raw-image API as above with sols 4709-4789 |

Download order at H0: MSL mosaic colour COG and the DTM first (walk zone), then the global DEM and Viking mosaic. Before downloading a big file, check whether it is tiled or has overviews (`rasterio.open(url).block_shapes`, `.overviews(1)`) and read only the windows needed if so.

## Rules

- Deterministic and idempotent: fixed sort orders, no timestamps inside data files except the manifest's `generatedAt`.
- Grid box: lon 137.432-137.460 E, lat -4.600 to -4.580 planetocentric. Pixel-to-lon/lat uses the DTM's own transform (Mars 2015 sphere, equirectangular, centre longitude 0); confirm the CRS printed by rasterio matches the STAC WKT.
- Slope is computed at the native 1 m before downsampling; the 2 m cell takes the maximum (conservative for safety).
- Elevation in the grid is only for profiles and the HUD; heights in the 3D view come from our terrain tiles (same DTM, so they agree).
- Tiles: for every tile sample, convert its geodetic latitude to planetocentric before sampling; keep areoid heights (see `TAD.md` section 4); write the HiRISE-to-DEM seam offset into the tile manifest.
- `build_facts.py` exits non-zero if any fact lacks `badge` or a known `sourceId`, or any source lacks `licence`, `credit` or an `https://` URL.
- Images: keep the NASA credit (`NASA/JPL-Caltech/MSSS` for Mastcam, `NASA/JPL-Caltech` for engineering cameras); never crop out or alter anything.
- MCD conditions: run the MCD web interface by hand for Gale (lat -4.59, lon 137.44), Ls 22, climatology dust scenario, LTST 06 to 18 hourly; save the outputs and the exact query text into `data/conditions/gale-ls22.json` with badge MODELLED.

## Tests

| Given | When | Then |
|---|---|---|
| The grid | SITE-01 and SITE-02 sampled | Both are valid (not nodata) |
| The grid | Landing area 30 m around SITE-01 | Median slope under 5 deg |
| Two runs | `manifest.py` | Identical SHA-256 for every file |
| `facts.csv` missing a badge | `build_facts.py` | Exit 1 naming the row |
| Waypoints | Sol 166 entry | lon 137.4491296, lat -4.58948488 (matches SITE-02) |
| Frames | `frames.py` and `core/frames.ts` on shared vectors | Agree within 1e-9 deg |
| Terrain tiles | Height at SITE-01 | Within 20 m of -4,500.97 m |
| Terrain tiles | Seam between HiRISE DTM and DEM | Recorded offset under 50 m; no step over 1 m after feathering |
| Tiles | Two runs | Identical hashes |
| Dingo Gap | Tileset edge heights versus our terrain | Within about 2 m |
| Grids | `reliefM` around SITE-01 (flat landing area) | Mostly under 0.5 m |
| Boxwork grid (P1) | SITE-10 and SITE-11 sampled | Both valid; ridges visible in the 25 cm ortho show high `reliefM` or slope |

## Verification

```
python pipeline/fetch.py
python pipeline/make_grid.py
python pipeline/make_tiles.py
python pipeline/place_dingo_gap.py
python pipeline/snapshot.py
python pipeline/build_facts.py
python pipeline/build_corpus.py
python pipeline/manifest.py
npm run diag          # checks 8-10 PASS
```

## Rollback

Delete `app/public/data/` and `app/public/tiles/` and re-run; raw downloads are cached in `pipeline/raw/` with hashes.

## Outcome (29 Oct 2026)

Built the pipeline in `pipeline/` (Python 3.12, rasterio 1.5.2): `snapshot.py` (MMGIS traverse; sols 182, 528, 4709 with 6 raw full-frame images each), `make_grid.py` (2 m planner grids: Horn slope on 2 m cells, relief from 3 x 3 posts; Gale 820 x 586, boxwork 410 x 351), `make_rasters.py` (terrain at 7.5 km, 200 m, 8 m, 1 m; imagery at 2.6 km, 232 m, 5 m, 0.5 m, 0.25 m; HiRISE heights shifted to meet the 200 m DEM: Gale -34.1 and -34.0 m, boxwork -4.7 and -5.0 m), `make_moons.py` (JPL Horizons), `fetch_audio.py` (SuperCam sol 1), `build_facts.py`, `build_corpus.py`, `manifest.py`.

Different from the spec: one raster per level instead of a tile pyramid (no `tiles/v1/`). Findings: 1 m slopes were inflated by DTM noise (hence 2 m); MMGIS elevations after sol 50 sit 15-19 m below the DTM (SITE-04), so heights come from the DTM.

Verification: 63 files, 212.1 MB, every hash checked by diagnostics check 08; 54 facts and 51 sources pass checks 09 and 10.

Full record: `BUILD_LOG.md`.
