# Data Spec (replaces DATABASE_SPEC)

> Version 3.0.0 | 2026-11-13 | Owner: data engineer + science lead | Status: implemented (section 0; 0.1 added 1 Nov 2026; 0.2 added 13 Nov 2026)

Homeward has no database (README D2). All data are static, versioned files under `data/`, produced by scripts in `pipeline/` during the event, checked by hash, and served from the same origin as the app. This file defines those files, the facts registry every on-screen number comes from, the dataset catalogue, and the pipeline.

## 0. As built (29 Oct 2026)

- Files (29 Oct; see 0.1 for 1 Nov): 63 in `data/manifest.json`, 212.1 MB including the self-hosted voice and speech models; 54 facts, 51 sources. Regenerate with the scripts in `pipeline/`, then `pipeline/manifest.py`.
- Terrain: single rasters per level in `data/globe/` (global 7.5 km, Gale 200 m, walk zones 8 m and 1 m), sampled by our own Cesium terrain provider; no tile pyramid. The HiRISE DTMs are shifted to meet the 200 m DEM without a step: Gale -34.1 m (8 m layer) and -34.0 m (1 m layer to the 8 m layer), boxwork -4.7 m and -5.0 m. The values are in `data/globe/layers.json`.
- Imagery: Viking colourised global mosaic (925 m, resampled to 2.6 km), Viking MDIM 2.1 colour over Gale (232 m), and the MSL Gale merged HiRISE colour mosaic at 5 m, 0.5 m and 0.25 m near the walks.
- Heights come from the DTM, not MMGIS: waypoint elevations after sol 50 sit 15-19 m lower than the DTM (a rover-frame offset), recorded in SITE-04.
- Planner grids: 2 m cells; slope by Horn on the 2 m cells (1 m slopes were inflated by DTM noise); relief from 3 x 3 posts. Gale 820 x 586 cells, boxwork 410 x 351.
- Added after the plan: `data/sky/moons.json` (Phobos and Deimos hourly state vectors from JPL Horizons, 25 Oct 2026 to 31 Mar 2027; `pipeline/make_moons.py`) and `data/audio/supercam-sol001-wind.mp3` (Perseverance SuperCam microphone, sol 1; `pipeline/fetch_audio.py`).
- Not fetched: Dingo Gap 3D tiles (DATA-23), Mars Climate Database values, DONKI events.

### 0.1 Added on 1 Nov 2026 (build/PLAN-2.md)

- Files: 222 in `data/manifest.json`, 220.9 MB; 54 facts, 74 sources, 12 landers.
- `data/rovers/msl-stops.json`, `m20-stops.json`: every MMGIS waypoint (1,386 Curiosity, sol 3 to 5045; 708 Perseverance, sol 13 to 2022) as `[site, drive, sol, lat, lon, elevGeoidM, yawDeg, distTotalM]`, sorted by rover motion counter. Source MMGIS-MSL-WAYPOINTS, MMGIS-M20-WAYPOINTS.
- `data/rovers/msl-track.json`, `m20-track.json`: MMGIS drive paths, Douglas-Peucker at 1.5e-5 deg (about 0.9 m); every waypoint sits on a track vertex (checked). `data/rovers/ingenuity.json`: 72 flights with sol, position, maximum altitude, distance, duration and airfields, plus flight paths.
- `data/rovers/cache/`: offline copies of four featured stops (Curiosity 6/0 Yellowknife Bay, 26/184 Dingo Gap, 120/0 boxwork; Perseverance 3/0 landing): the raw API records of full frames with camera models (at most 60 per stop) and 512 px JPEG copies; 8.1 MB.
- `data/places/landers.json`: built by `build_facts.py` from `pipeline/landers.csv` with the same checks as facts (badge, known sources, planetocentric lat, east lon -180..180). Coordinates: PDS Geosciences Node ODE table (Viking 1 and 2, Pathfinder: radio tracking, Folkner et al. 1997; Spirit, Opportunity: cartographic triangulation, Arvidson et al. 2004; Phoenix: Smith et al. 2009), Golombek et al. 2020 (InSight), Bridges et al. 2017 (Beagle 2), Liu et al. 2022 (Zhurong, SECONDARY), MMGIS first waypoints (Curiosity, Perseverance), The Planetary Society (Mars 3, approximate, SECONDARY).
- `data/places/gazetteer.json`: 2,051 IAU-approved Mars names from the USGS Gazetteer (planetocentric, east), with diameter, type and feature ID.
- Live, not cached: Trek and OnMars tiles (CTX beta01 5 m, HiRISE, THEMIS day and night IR 100 m, Viking 232 m) and NASA raw-image records and photos. Curiosity Navcam records carry camera models and attitude from sol 13; Curiosity Mastcam records do not, so those photos appear only in the film strip.
- Conventions checked on real records: the attitude quaternion `(s, x, y, z)` rotates the rover frame to local level (north, east, down); Curiosity site 85 gives 28.68 deg, equal to MMGIS yaw; Perseverance site 4 drive 218 gives 221.38 deg (MMGIS -138.62). Camera models are already adjusted to each delivered image's pixel grid (downsampled and subframed alike). Perseverance's drive counter also ticks without wheel motion, so a frame belongs to the latest stop at or before its counter.

### 0.3 Added on 14 Nov 2026 (build/PLAN-4.md)

- Files: 226 in `data/manifest.json`, 222.7 MB; 56 facts, 91 sources, 13 landers.
- `data/usgs/mars-maps.json`: `{ sourceId, maps: [{ title, number, scale, year, url, rings }] }`, the 116 published USGS geologic maps of Mars from the Planetary Geologic Mapping Program map database (`pipeline/usgs_maps.py`), sorted finest scale first; rings in degrees (outSR 4326), simplified to 0.05 deg. Source USGS-PGM-MAP-DB.
- Facts EARTH-01 and EARTH-02: the Haughton-Mars Project Research Station (75.433 N, 89.867 W; Mars Institute). Sources MARS-INSTITUTE-HMP and NASA-GIBS added; TREK-SITE-HIRISE now also covers the Viking 1 and 2 mosaics.
- Live, not cached: Trek's SIM 3292 identify (rock unit), Trek's Viking site mosaics, NASA's newest raw images (both rovers), PIA23179 from the NASA Image Library, GIBS WMS images (Landsat WELD annual; HLS Sentinel-2 30 m by date).

### 0.2 Added on 13 Nov 2026 (build/PLAN-3.md)

- Files: 225 in `data/manifest.json`, 222.7 MB; 54 facts, 88 sources, 13 landers.
- `data/rovers/mer-a-track.json`, `mer-b-track.json`: Spirit and Opportunity drive paths from the PDS Geosciences Node interpolated traverse tables (`pipeline/rovers.py mer`), same format as the other tracks plus `km` and `lastSol`. Spirit: equirectangular metres centred on 175.5 E (the label); Opportunity: metres east and north of the landing site (checked against Victoria crater). Source PDS-AN-MER-TRAVERSE.
- `data/sky/orbiters.json`: MRO, Mars Odyssey, Mars Express, TGO and Hope state vectors from JPL Horizons every 10 minutes from 10 Nov 2026 to each spacecraft's published ephemeris end (`pipeline/make_orbiters.py`); same row format as `moons.json`. Source JPL-HORIZONS-ORBITERS.
- `landers.csv`: Schiaparelli at the HiRISE ESP_048041_1780 image centre (2.093 S, 353.780 E).
- Live, not cached: MOLA-HRSC 200 m heights (Esri OnMars MDEM200M, LERC), Trek overlays (USGS SIM 3292 geology, MGS TES thermal inertia and dust, MOLA-HRSC colour shaded relief, HiRISE site mosaics of Jezero, Spirit, Opportunity, Phoenix and InSight), the NASA Image and Video Library, Curiosity's REMS feed, DONKI through `/api/v1/spaceweather`.

## 1. Labels

Two label sets, one for research status and one for the in-app badge.

| Research status | Meaning |
|---|---|
| VERIFIED | The linked page states it and was opened on the date given |
| SECONDARY | Non-official source; replace with an agency page before submission if possible |
| COMPUTED | Our own calculation from a published algorithm, checked against published values |
| ASSUMPTION | Team-chosen working value; exposed as an adjustable setting in the app |

| In-app badge | Use for | Example |
|---|---|---|
| LIVE | Computed from the clock right now | Ls, local solar time, radio delay |
| MEASURED | An instrument measured it | REMS humidity range, RAD dose rate |
| MODELLED | A climate model's statistics, not a forecast | Mars Climate Database temperature at 13:00 LTST |
| COMPUTED | Our tested calculation on fixed inputs | 443 m to Yellowknife Bay |
| STANDARD | An agency limit or requirement | 600 mSv career limit; 8-hour EVA |
| ASSUMPTION | A team choice the user can change | 30-minute reserve |
| GENERATED | A visual that is not data | Procedural rocks below 25 cm |

A number with no badge must not ship. The diagnostics script fails the build if any `facts.json` entry lacks `badge` or `source`.

## 2. Facts registry (`data/facts.json`)

Every number the app shows or speaks. IDs are stable; code references IDs, never literals. "Paper" means the research paper section, which links the original source.

### 2.1 Site and walk (VERIFIED from the live MMGIS file on 28 Oct 2026, except where marked)

| ID | Fact | Value | Badge | Source |
|---|---|---|---|---|
| SITE-01 | Habitat: Bradbury Landing, first MSL waypoint (sol 3, site 2 drive 0) | lat -4.589467, lon 137.441633 (planetocentric, east), elev -4,500.971 m (areoid) | MEASURED | `mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json` |
| SITE-02 | Science stop: Yellowknife Bay, site 6 drive 0 (sols 166-272), John Klein and Cumberland drill sites | lat -4.58948488, lon 137.4491296, elev -4,520.456 m | MEASURED | same file |
| SITE-03 | Straight-line habitat to stop | 443 m | COMPUTED | haversine on the 3,396.19 km sphere |
| SITE-04 | Elevation change habitat to stop | -19.5 m | COMPUTED | SITE-01, SITE-02 |
| SITE-05 | Curiosity's odometry on arrival at site 6 | 723.41 m | MEASURED | MMGIS `dist_total_m`, sol 166 |
| SITE-06 | Curiosity first rock drilling, John Klein | sol 182, 8 Feb 2013 | MEASURED | NASA/JPL PIA17595 and mission reports; confirm the date in the raw-image API |
| SITE-07 | Ocentric-to-ographic latitude offset at Bradbury | 0.0543 deg, 3.21 km | COMPUTED | IAU 2015 Mars ellipsoid a = 3,396.19 km, b = 3,376.20 km |
| SITE-08 | Curiosity at Dingo Gap, sol 528 waypoint | lat -4.62655059, lon 137.4072626, elev -4,486.771 m; odometry 4,909.81 m | MEASURED | MMGIS MSL waypoints |
| SITE-09 | Habitat to Dingo Gap, straight line | 2,993 m (beyond the 2 km walking radius, EVA-02, so it is a separate scene, not a walk stop) | COMPUTED | SITE-01, SITE-08 |
| SITE-10 | Boxwork walk start (rover drop-off): Curiosity's sol 4600 waypoint | lat -4.804189, lon 137.3796858, elev -3,632.878 m | MEASURED | MMGIS MSL waypoints (read 28 Oct 2026) |
| SITE-11 | Boxwork science stop: Curiosity site 120 drive 0, occupied sols 4709-4789 | lat -4.80799931, lon 137.3810495, elev -3,608.689 m | MEASURED | same |
| SITE-12 | Boxwork walk | 240 m straight line, +24.2 m climb; 13,439 m from Bradbury Landing | COMPUTED | SITE-01, SITE-10, SITE-11 |

### 2.2 Time and sky (COMPUTED with Mars24 and JPL Table 1 elements; re-run on 28 Oct 2026)

| ID | Fact | Value | Badge |
|---|---|---|---|
| TIME-01 | Start of Mars Year 39 (Ls = 0) | 30 Sep 2026, about 09:00 UTC (matches The Planetary Society's MY list) | COMPUTED |
| TIME-02 | Ls at 2026-11-14T00:00Z / 2026-11-15T00:00Z | 21.57 deg / 22.04 deg (northern spring) | COMPUTED |
| TIME-03 | Gale sunrise, 14 Nov / 15 Nov | 08:17 UTC (13:47 IST) / 08:56 UTC (14:26 IST); local 06:03 to 17:57 LTST on 14 Nov (paper 4.6) | COMPUTED |
| TIME-04 | Jezero sunrise, 14 Nov / 15 Nov | 12:08 UTC / 12:47 UTC | COMPUTED |
| TIME-05 | One-way light time at 2026-11-14T00:00Z | 11.01 min (1.324 AU); round trip 22.0 min | COMPUTED |
| TIME-06 | Rover sols during the daylight of 14 Nov | Curiosity 5074, Perseverance 2039 (sol 0 = landing sol; the count changes at local midnight) | COMPUTED |
| TIME-07 | Sun-Mars distance, 14 Nov | 1.608 AU; top-of-atmosphere sunlight about 526 W/m2; Sun 0.33 deg across | COMPUTED |
| TIME-08 | Solar declination, 2026-11-14T00:00Z | 9.10 deg N | COMPUTED |
| TIME-09 | Earth from Mars, 14 Nov | 37.9 deg east of the Sun, an evening star | COMPUTED (paper; re-check in chunk 04) |
| TIME-10 | Closest approach this cycle | 19 Feb 2027, 101.4 million km, 5.64 light-minutes | COMPUTED (paper) |
| TIME-11 | Cheapest 2026 departure | 31 Oct 2026, C3 9.14 km2/s2, 292 days, arrive 19 Aug 2027 | COMPUTED (paper, Lambert solver; not re-checked) |
| TIME-12 | Light-time range for NSSDC distance extremes | 3.0 to 22.3 min | COMPUTED |

Golden checks that prove the code (also in `docs/TESTING_STRATEGY.md`): Perseverance landing light time 11.37 min (NTRS 20230006978); Curiosity landing 13.80 min (ESA, 13 min 48 s); GISS worked example for Spirit, Ls 327.32416 deg and EOT -12.77553 deg. All three reproduced on 28 Oct 2026.

### 2.3 Planet (VERIFIED, NSSDC Mars Fact Sheet and NASA Mars Facts, via paper 4.1)

| ID | Fact | Value | Badge |
|---|---|---|---|
| PLN-01 | Mean radius (equatorial) | 3,389.5 km (3,396.2 km) | MEASURED |
| PLN-02 | Surface gravity | 3.73 m/s2, 0.38 g | MEASURED |
| PLN-03 | Surface pressure | 6.36 mbar mean; 4.0 to 8.7 mbar by season | MEASURED |
| PLN-04 | Atmosphere | 95.1% CO2, 2.59% N2, 1.94% Ar, 0.16% O2 | MEASURED |
| PLN-05 | Temperature | about -153 to +20 C; average about -59 C | MEASURED |
| PLN-06 | Mean top-of-atmosphere sunlight | 586.2 W/m2 (43% of Earth's) | MEASURED |
| PLN-07 | Sol; year | 24.6597 h; 686.98 days = 668.6 sols (paper's 669.6 is an error) | MEASURED / COMPUTED |
| PLN-08 | Seasons (north) | spring 194, summer 178, autumn 142, winter 154 sols | MEASURED |
| PLN-09 | Scale height | 11.0 km | MEASURED |
| PLN-10 | Jump height versus Earth | about 2.6 times (9.82 / 3.73) | COMPUTED |
| PLN-11 | IAU 2015 ellipsoid radii | 3,396.19 km equatorial, 3,376.20 km polar | STANDARD (Archinal et al. 2018) |
| PLN-12 | Distance to the horizon for eyes 1.7 m above flat ground | 3.39 km on Mars (mean radius 3,389.5 km) versus 4.65 km on Earth | COMPUTED (sqrt(2Rh)) |
| PLN-13 | Sunlight on 14 Nov 2026 compared with Earth at 1 AU | about 39% (1 / 1.608^2) | COMPUTED |

### 2.4 Human limits and hazards (VERIFIED via paper 4.2 and 4.14 unless marked)

| ID | Fact | Value | Badge | Source |
|---|---|---|---|---|
| RAD-01 | Surface dose equivalent rate at Gale | 0.64 +/- 0.12 mSv/day | MEASURED | Hassler et al. 2014 (RAD) |
| RAD-02 | Cruise dose rate | 1.84 mSv/day | MEASURED | RAD via DLR |
| RAD-03 | Career limit | 600 mSv | STANDARD | NASA OCHMO technical brief |
| RAD-04 | Solar particle event limit | 250 mSv | STANDARD | paper 4.2, OCHMO brief |
| RAD-05 | Largest surface event, 20 May 2024 | about 8,100 micrograys absorbed dose beside Curiosity, roughly 30 chest X-rays | MEASURED | NASA MAVEN/RAD release |
| RAD-06 | 180 d out + 500 d on Mars + 180 d back | 0.98 Sv (Hassler et al. quote about 1.01 Sv) | COMPUTED | RAD-01, RAD-02 |
| RAD-07 | One 8-hour Marswalk from GCR alone | 0.21 mSv | COMPUTED | RAD-01 |
| EVA-01 | EVA duration | up to 8 h (6 +/- 2 h); lunar-derived | STANDARD | NASA EVA ConOps 2020, NTRS 20200001071 |
| EVA-02 | Early Artemis walking radius | 2 km from the lander; lunar-derived | STANDARD | same |
| EVA-03 | Suited slope capability | up, down or across slopes up to 20 deg; lunar-derived | STANDARD (SECONDARY: from search excerpts of the same ConOps; open the PDF on day 1) | same |
| EVA-04 | Walk-back planning rate | 3.3 km/h | STANDARD | Apollo 17 traverse planning paper |
| EVA-05 | Suited walk-back test distance | 10 km | MEASURED | NASA Walkback Test (core.ac.uk 15254764) |
| DUST-01 | Crew dust exposure limit | under 0.1 mg/m3 of dust below 10 micrometres, 24-hour average, exposures up to 30 days | STANDARD | NASA, 2026 |
| DUST-02 | Fine dust on suit materials | particles under 2.5 micrometres and around 100 nm, over 1,645 sols | MEASURED | NASA, 26 Oct 2026 |
| DUST-03 | Perchlorate in soil | about 0.5 to 1% | MEASURED | Space.com; NASA dust article |
| SND-01 | Speed of sound | about 240 m/s below 240 Hz, 250 m/s above; high pitches fade within about 8 m | MEASURED | CNRS, Maurice et al. 2022 |
| COM-01 | Solar conjunction | about two weeks without commands, every two years | STANDARD | NASA |

### 2.5 Weather and events (VERIFIED via paper 4.10, 4.11)

| ID | Fact | Value | Badge |
|---|---|---|---|
| WX-01 | REMS at Gale | yearly swing of daily-mean temperature about 20 K; relative humidity about 70% at night near Ls 93, under 5% from 10:00 to 18:00; pressure swings about 30% a year | MEASURED |
| WX-02 | MEDA at Jezero, first 250 sols | daily-mean pressure 735 to 761 to 650 Pa; afternoon winds about 7 m/s; gusts to 25 m/s; 26 K diurnal tide; dust devils 5-135 m across at 4-24 m/s | MEASURED |
| WX-03 | Viking 1 | daily air range -89 to -31 C; winds 2-7 m/s in summer, 17-30 m/s in dust storms | MEASURED |
| WX-04 | REMS public archive end | sol 4,488, 22 Mar 2025 | MEASURED (PDS Atmospheres Node) |
| EVT-01 | Perseverance dust devil, 30 Aug 2023 | about 60 m wide, about 2 km tall, about 19 km/h, about 4 km away | MEASURED |
| EVT-02 | Global dust storms | 1971, 1977, 1982, 1994, 2001, 2007, 2018; southern spring and summer | MEASURED |
| EVT-03 | Opportunity lost | last heard 10 Jun 2018, during the global storm | MEASURED |

### 2.6 Science and missions (VERIFIED via paper 4.5-4.15, 6, 7)

| ID | Fact | Value |
|---|---|---|
| SCI-01 | Gale lake (Grotzinger et al. 2014) | near-neutral pH, low salinity, chemical energy microbes could use |
| SCI-02 | Organics in Gale mudstone | about 10 ppm or more organic carbon, top 5 cm, 3-billion-year-old rock; can form without life |
| SCI-03 | Methane | Curiosity record 21 ppbv on 19 Jun 2019; TGO upper limit 0.07 ppbv two days later |
| SCI-04 | Cheyava Falls | potential biosignature announced 10 Sep 2025; non-biological origin not ruled out |
| SCI-05 | Boxwork on Mount Sharp (NASA, 23 Feb 2026) | low ridges about 1-2 m tall with sandy hollows between, not much wider than the rover; read as minerals left by groundwater in bedrock fractures, then wind erosion of the hollows; part of a sulfate-rich layer; look like giant spiderwebs from orbit; Mastcam panorama 26 Sep 2025; four drill samples. The official challenge page uses boxwork as its example science goal (VERIFIED, saved page 28 Oct 2026) |
| EDL-01 | Perseverance entry | about 19,500 km/h at entry; 21.5 m parachute about 240 s later at about 11 km and 1,512 km/h; TRN between 4.2 and 2.2 km shifts touchdown up to 600 m |
| EDL-02 | Landing record | 12 of 19 robotic landing attempts had succeeded by 2024 |
| MSN-01 | MMX launch | 20 Oct 2026, 04:41:03 JST, H3 F10, Tanegashima |
| MSN-02 | ESCAPADE | launched 13 Nov 2025; trans-Mars burn Nov 2026; arrival Sep 2027 |
| MSN-03 | Ingenuity | 72 flights, 128.8 min aloft, 17.0 km, up to 24.0 m high, last flight 18 Jan 2024 |
| MSN-04 | Perseverance passes Opportunity's 45.16 km | 11 Oct 2026 (SECONDARY, news) |
| MSN-05 | Phobos and Deimos | Phobos about 6,000 km up, three orbits a day, falling 1.8 m per century; Deimos about 30 h |

The full set (every row of paper sections 4 and 6-7 that the app shows) is entered in `pipeline/facts.csv` during chunk 03 and compiled to `data/facts.json`.

## 3. Dataset catalogue

Status as checked on 28 Oct 2026. Licence column feeds `legal/COMPLIANCE.md` and the credits panel.

| ID | Dataset | Access | Licence or terms | Used for | Check |
|---|---|---|---|---|---|
| DATA-01 | Our own Mars tiles (terrain and imagery pyramids) built from DATA-21, DATA-22, DATA-24 and DATA-03 | `/tiles/v1/` on our host | Inherits the sources' terms: terrain CC BY-SA 3.0 IGO (HRSC-derived); imagery public domain with credits | Globe, descent, walk, offline | Built in chunk 03. Not used: Cesium ion's Cesium Mars, whose terms (s2.2.2) forbid storing tiles for offline use |
| DATA-02 | NASA Mars Trek WMTS | `api.nasa.gov/mars-wmts/catalog`, no key | NASA media terms | Extra layers | Paper |
| DATA-03 | HiRISE DTM `DTEEC_010573_1755_010639_1755_U01` (pair PSP_010573_1755 / PSP_010639_1755), 1.0118 m GSD, produced by University of Arizona as a possible MSL landing-site DTM | USGS STAC `mro_hirise_socet_dtms`; COG at `astrogeo-ard.s3-us-west-2.amazonaws.com/mars/mro/hirise/controlled/dtm/PSP_010573_1755_PSP_010639_1755/` | CC0-1.0; HiRISE asks for credit "NASA/JPL/University of Arizona" | Slope, planner grid | VERIFIED (STAC item read; footprint contains SITE-01 and a point 500 m east) |
| DATA-04 | MSL waypoints (1,386 points, sols 3-5045 on 28 Oct 2026; fields RMC, site, drive, sol, lon, lat, elev_geoid, roll, pitch, yaw, dist_total_m) | `mars.nasa.gov/mmgis-maps/MSL/Layers/json/MSL_waypoints.json` | NASA; undocumented endpoint | Traverse, validation, relive | VERIFIED; snapshot it |
| DATA-05 | M20 waypoints (`M20_waypoints_sol2009_all`) | `.../M20/Layers/json/M20_waypoints.json` | same | Jezero tour (P2) | VERIFIED |
| DATA-06 | MSL raw images by sol | `mars.nasa.gov/api/v1/raw_image_items/?condition_1=msl:mission&condition_2=182:sol:gte&condition_3=182:sol:lte` | NASA media terms, credit NASA/JPL-Caltech/MSSS for Mastcam | Sol 182 photo cards | VERIFIED (sol 182 returns Mastcam items) |
| DATA-07 | Mars 2020 raw-image feed | `mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020,ingenuity&feedtype=json&ver=1.2&latest=true` | same | Live sol check | VERIFIED (latest sol 2022 at 2026-10-28T11:14Z) |
| DATA-08 | REMS RDR/ENV archive | PDS Atmospheres Node | NASA PDS | Sol 182 weather | Paper; archive ends sol 4,488 |
| DATA-09 | Mars Climate Database v6.1 | web interface | Free; no commercial use | MODELLED conditions | Paper |
| DATA-10 | NASA Deep Star Maps 2020 (SVS 4851), celestial frame | NASA SVS | Credit "NASA/Goddard Space Flight Center Scientific Visualization Studio" and "Gaia DR2: ESA/Gaia/DPAC" | Star sphere | Paper |
| DATA-11 | NASA 3D Resources: Curiosity model, Phobos and Deimos textures | github.com/nasa/NASA-3D-Resources | NASA media terms | Models | Paper |
| DATA-12 | Perseverance microphone recordings | NASA | NASA media terms | Wind ambience | Paper |
| DATA-13 | JPL approximate planetary elements, Table 1 (1800-2050) | ssd.jpl.nasa.gov/planets/approx_pos.html | Public | Earth-Mars distance; Mars accuracy about 25,000 km | VERIFIED |
| DATA-14 | Mars24 algorithm (Allison and McEwen 2000) | giss.nasa.gov/tools/mars24/help/algorithm.html | Public | Mars time and Sun | VERIFIED |
| DATA-15 | JPL Horizons API | ssd-api.jpl.nasa.gov | Public | Phobos, Deimos, orbiters (precomputed) | Paper |
| DATA-16 | ESA Mars Express VMC images | ESA Flickr | CC BY-SA 3.0 IGO | Orbit look reference; credits | Paper |
| DATA-17 | Tianwen-1 MoRIC 76 m global map | China Lunar and Planetary Data System | check terms | Agency layer (P1) | Paper |
| DATA-18 | ISRO MOM Mars Colour Camera | ISSDC / PRADAN, free registration | ISRO terms | Agency layer (P1) | Paper |
| DATA-19 | Emirates Mars Mission (Hope) | sdc.emiratesmarsmission.ae | EMM terms | Agency layer (P1) | Paper |
| DATA-20 | SWIM ice consistency | swim.psi.edu | check terms | Ice overlay (P1) | Paper |
| DATA-21 | MOLA-HRSC Blended DEM Global 200 m v2 (Fergason, Hare and Laura 2018): planetocentric, east-positive, simple cylindrical, 106,694 x 53,347, 16-bit; radius 3,396,190 m; elevation uncertainty at least +/-3 m from the areoid | `planetarymaps.usgs.gov/mosaic/Mars/HRSC_MOLA_Blend/Mars_HRSC_MOLA_BlendDEM_Global_200mp_v2.tif` (about 11 GB) | MOLA CC0; HRSC CC BY-SA 3.0 IGO; cite the authors | Global and regional terrain tiles | VERIFIED (USGS page, 28 Oct 2026) |
| DATA-22 | Mars Viking Colorized Global Mosaic 232 m (MDIM 2.1, colourised by NASA Ames) | `planetarymaps.usgs.gov/mosaic/Mars_Viking_MDIM21_ClrMosaic_global_232m.tif` (about 12 GB) | Public domain, no use constraints (USGS listing) | Global and regional imagery tiles | VERIFIED via the USGS listing in search results |
| DATA-23 | JPL "Curiosity Dingo Gap 3D Tiles Data Set": rover-scale terrain from MSL Mastcam, Navcam, Hazcam and HiRISE by JPL's Landform pipeline; generated 9 Jul 2020, released 3 Mar 2021, release ID URS297920; tileset `0528_0260184_to_s64o256` | github.com/NASA-AMMOS/3DTilesSampleData, folder `msl-dingo-gap` | No licence file in the repository; released by NASA JPL; credit every listed instrument: "NASA/JPL-Caltech/MSSS" (Mastcam), "NASA/JPL-Caltech" (Navcam, Hazcam), "NASA/JPL-Caltech/University of Arizona" (HiRISE), "NASA/JPL-Caltech/USGS Astrogeology/F. Calef/T. Parker" (mosaics) | Rover-scale walk at Dingo Gap (F30) | VERIFIED (README read 28 Oct 2026) |
| DATA-25 | THEMIS Thermal Inertia Mosaic Quantitative 30S120E 100 mpp (Fergason 2014; method Fergason et al. 2006, JGR 111, E12004): lat 0 to 30 S, lon 120-180 E, 35,565 x 17,782, 32-bit ISIS cube | `asc-astropedia.s3.us-west-2.amazonaws.com/Mars/Odyssey/THEMIS-Global-Thermal-Inertia-Mosaic/Quantitative-32-Bit/THEMIS_TI_Mosaic_Quant_30S120E_100mpp.cub` (about 2.4 GB) | Public domain; cite authors | Thermal layer: rock versus loose sand along the route (F32) | VERIFIED (USGS page, 28 Oct 2026); confirm units in the cube label |
| DATA-26 | HiRISE DTMs over the boxwork site: `DTEEC_019698_1750_019988_1750_U01` and `DTEEC_009149_1750_009294_1750_U01`, 1.01 m | USGS STAC `mro_hirise_socet_dtms` | CC0-1.0 | Second walk zone (F31) | VERIFIED (STAC point search at 137.381 E, 4.808 S) |
| DATA-27 | NASA DONKI space-weather event database (flares, solar energetic particles) | CCMC DONKI web service; api.nasa.gov DONKI | NASA | Real event list for the space-weather scenario (F18) | UNVERIFIED: both endpoints timed out on 28 Oct 2026; retry on day 1; F18 works from RAD-05 without it |
| DATA-24 | MSL Gale Merged Orthophoto Mosaic 25 cm, version 3 (Calef III and Parker 2016), from HiRISE; colour version `MSL_Gale_HiRISE-LRGB_78quads_sharp_cog.tif` (about 1 GB, Parker and Calef) | astrogeology.usgs.gov/search/map/mars_msl_gale_merged_orthophoto_mosaic_25cm (GeoTIFF about 23 GB) | USGS metadata: use constraints "None"; HiRISE credit requested | Walk-zone and traverse imagery | VERIFIED via search results of the USGS record; open the record on day 1 for the download links and the colour mosaic's resolution |

## 3.1 Kinds of data (the official objectives suggest at least three)

The challenge page lists optical, thermal, spectral, topographic, geophysical, atmospheric, radiation and chemical as examples. Homeward layers six of them:

| Kind | Datasets | Used in | Priority |
|---|---|---|---|
| Optical | MSL Gale 25 cm mosaic (DATA-24), Viking colour (DATA-22), Curiosity Mastcam and Navcam photos (DATA-06), JPL Dingo Gap terrain textures (DATA-23) | Globe, walk, point-of-view photos at each stop | P0 |
| Topographic | HiRISE DTMs (DATA-03, DATA-26), MOLA-HRSC (DATA-21) | Slope, roughness obstacles, walk-back field, terrain | P0 |
| Radiation | RAD dose rates and the May 2024 event (RAD-01..05); DONKI event list (DATA-27, if reachable) | Dose budget, space-weather scenario | P0 |
| Atmospheric | Mars Climate Database (DATA-09), REMS and MEDA ranges (WX-01, WX-02), dust devil (EVT-01) | Briefing, events | P0 |
| Thermal | THEMIS quantitative thermal inertia (DATA-25) | Rock versus loose-sand layer along the route | P1 |
| Chemical | Curiosity organics and perchlorate (SCI-02, DUST-03); boxwork sulfate layer (SCI-05) | Discovery cards, hazard notes | P0 (cards) |
| Spectral | CRISM products over Gale from the PDS Orbital Data Explorer (search on day 1) | Mineral layer | P2 |

## 4. File schemas

All JSON is UTF-8, validated by zod schemas in `app/src/data/schemas.ts` at load time. A file that fails validation shows the panel's error state, never partial data.

```ts
// data/facts.json
type Fact = {
  id: string;            // "RAD-01"
  label: string;         // "Surface dose equivalent rate at Gale"
  value: number | string;
  unit?: string;         // "mSv/day"
  uncertainty?: number;  // same unit, one sigma where published
  badge: "LIVE" | "MEASURED" | "MODELLED" | "COMPUTED" | "STANDARD" | "ASSUMPTION" | "GENERATED";
  sourceIds: string[];   // keys into sources.json
  note?: string;         // "lunar-derived", "time of day 00:00 UTC"
};

// data/sources.json
type Source = {
  id: string; title: string; publisher: string; url: string;
  licence: string; credit: string; accessed: string; // ISO date
  status: "VERIFIED" | "SECONDARY" | "UNVERIFIED";
};

// data/site/gale/grid.json (+ grid.bin, little-endian)
type GridHeader = {
  dtmId: "DTEEC_010573_1755_010639_1755_U01";
  cellM: 2;                         // planner cell size
  cols: number; rows: number;
  originLonE: number; originLatC: number;   // north-west corner, planetocentric
  dLonDeg: number; dLatDeg: number;
  layers: { name: "slopeDeg" | "elevM" | "reliefM" | "thermalInertia"; type: "uint16" | "float32"; scale: number; offset: number }[];
  // reliefM: max minus min elevation of the 1 m DTM posts inside the 2 m cell and its 8 neighbours (obstacle proxy)
  // thermalInertia: DATA-25 resampled to the grid (P1)
  nodata: number;                   // cells outside the DTM's valid mask
  processing: string[];             // human-readable log, shown on the provenance card
  sha256: string;
};

// data/sols/msl-0182.json
type Sol = {
  mission: "MSL"; sol: number; earthDateUtc: string;
  position: { latC: number; lonE: number; elevM: number; sourceId: string };
  images: { id: string; camera: string; file: string; credit: string }[];  // snapshot copies
  weather?: { factIds: string[] };  // REMS values for this sol
  storyFactIds: string[];
};

// data/rovers/msl-stops.json, m20-stops.json (validated in app/src/rovers/raw.ts)
type Stops = { mission: "msl" | "m20"; sourceId: string; fields: string[]; rows: [site: number, drive: number, sol: number, latC: number, lonE: number, elevGeoidM: number, yawDeg: number, distTotalM: number][] };
// data/rovers/msl-track.json, m20-track.json, ingenuity.json: lines are flattened [lon, lat, lon, lat, ...]
type Track = { sourceId: string; lines: number[][] };
// data/rovers/cache/<m>-<site>-<drive>.json: raw NASA records (parsed with the same zod schemas as live ones)
type OfflineStop = { mission: "msl" | "m20"; site: number; drive: number; items: unknown[]; local: Record<string /* imageid */, string /* /data/rovers/cache/...jpg */> };
// data/places/landers.json (from pipeline/landers.csv)
type Lander = { id: string; name: string; agency: string; kind: string; landedUtc: string; lat: number; lon: number; badge: Badge; sourceIds: string[]; rover: "msl" | "m20" | null; note: string };
// data/places/gazetteer.json
type Gazetteer = { sourceId: "USGS-GAZETTEER"; fields: string[]; rows: [name: string, latC: number, lonE: number, diameterKm: number, type: string, featureId: number][] };

// data/manifest.json
type Manifest = { files: { path: string; sha256: string; bytes: number; sourceIds: string[]; licence: string; script: string; generatedAt: string }[] };
```

## 5. Pipeline (chunk 03, from 14 Nov only)

| Step | Script | Input | Output | Done when |
|---|---|---|---|---|
| 1 | `pipeline/fetch.py` | STAC item, MMGIS URLs, raw-image API | `pipeline/raw/` + `raw/hashes.txt` | Every file hashed, URL and access time logged |
| 2 | Slope inside `pipeline/make_grid.py`: read the DTM with rasterio, Horn's 3x3 method in numpy (the method `gdaldem slope` uses) | DTM (projected, metres) | slope in degrees | Spot-check: flat landing area under 5 deg; if the GDAL CLI is installed, `gdaldem slope -compute_edges` agrees within 0.1 deg on a sample window |
| 3 | `pipeline/make_grid.py` | DTM, slope | `data/site/gale/grid.{json,bin}` | Box lon 137.432-137.460 E, lat -4.600 to -4.580 (about 1.65 x 1.18 km, about 489,000 cells); 2 m cells; slope = max of the 1 m cells inside (conservative); elevation = mean; outside the DTM mask = nodata; plus `reliefM` (obstacle proxy); about 4 MB uncompressed |
| 3b | `pipeline/make_grid.py --site boxwork` (P1) | DATA-26, DATA-25 | `data/site/boxwork/grid.{json,bin}` | Box around SITE-10 and SITE-11 (lon 137.374-137.388 E, lat -4.812 to -4.800); same rules; checked against the 25 cm HiRISE ortho that the 1-2 m ridges show up in `reliefM` and slope; a 1 m stereo DTM smooths features only a few metres wide, so state that limit on the provenance card |
| 4 | `pipeline/snapshot.py` | MMGIS, raw images | `data/traverse/msl.json` (sols 3-300 plus latest), `data/sols/msl-0182.json`, image copies | Sol 182 has at least 4 images with credits |
| 5 | Manual MCD query, recorded | MCD web, Gale, Ls 22, climatology scenario, LTST 06-18 | `data/conditions/gale-ls22.json` | Query parameters saved in the file; badge MODELLED |
| 6 | `pipeline/build_facts.py` | `pipeline/facts.csv`, `pipeline/sources.csv` | `data/facts.json`, `data/sources.json` | Every fact has badge and source; script exits non-zero otherwise |
| 7 | `pipeline/build_corpus.py` | `pipeline/corpus.md` (paraphrased cards, each with source IDs) | `data/corpus.json` | 60-120 cards; no card over 80 words |
| 8 | `pipeline/make_tiles.py` | DATA-21, DATA-22, DATA-24, DATA-03 | `tiles/v1/terrain/{z}/{x}/{y}.bin`, `tiles/v1/imagery/{z}/{x}/{y}.jpg`, `tiles/v1/manifest.json` | See section 5.1 |
| 9 | `pipeline/place_dingo_gap.py` | DATA-23, MMGIS sol 528 | `tiles/v1/dingo-gap/` (copied tileset) + `data/sols/msl-0528.json` with the placement | Rover-scale terrain sits on our terrain within about 2 m at its edges |
| 10 | `pipeline/manifest.py` | `data/`, `tiles/` | `data/manifest.json` | Hashes match on re-run |

All scripts are deterministic and idempotent: same inputs, same bytes out. Re-running costs minutes except the downloads.

### 5.1 Our own Mars tiles (replaces Cesium ion, README D11)

Tiling matches CesiumJS's `GeographicTilingScheme` on `Ellipsoid.MARS`: level 0 is 2 x 1 tiles; a level-z tile spans 180/2^z degrees. For each tile sample, its geodetic latitude is converted to planetocentric (`pipeline/frames.py`) before reading the source raster.

| Region | Terrain source and levels | Imagery source and levels | Approximate size |
|---|---|---|---|
| Whole planet | MOLA-HRSC 200 m (DATA-21), downsampled, levels 0-5 (5.2 km sample spacing at level 5) | Viking MDIM 2.1 colour 232 m (DATA-22), downsampled, levels 0-5 (1.3 km/px) | about 2,730 tiles each; tens of MB |
| Gale Crater region, lon 135.5-139.5 E, lat 6.6 S to 2.6 S | MOLA-HRSC, levels 6-9 | Viking colour, levels 6-8 | small (a few hundred tiles) |
| MSL traverse area covered by the MSL mosaic, clipped to a box around Bradbury, Yellowknife Bay and Dingo Gap | HiRISE DTM (DATA-03) where it exists, else MOLA-HRSC, levels 10-15 | MSL Gale mosaic (DATA-24), colour version if its resolution suffices, levels 9-15 | tens of MB |
| Walk zone (the planner grid box) | HiRISE DTM 1 m, levels 16-17 (1.3 m sample spacing) | MSL Gale mosaic 25 cm, levels 16-17 (0.32 m/px) | about 20-30 MB |
| Boxwork walk zone (P1) | HiRISE DTMs (DATA-26), levels 10-17 over the 3b box | MSL Gale mosaic if it covers the site, else the DTMs' own HiRISE orthoimages (with the paper 9.3 clean-up logged) | about 20-30 MB |

Rules:
- Terrain tiles: 65 x 65 samples, Int16 metres (areoid heights; see `TAD.md` section 4), little-endian, gzip by the CDN.
- Imagery tiles: 256 x 256 JPEG, quality 85; no colour changes except a documented brightness match where the MSL mosaic meets the Viking mosaic.
- Seams: where the HiRISE DTM meets the 200 m DEM, shift the DTM by the mean difference in the overlap (record the value) and feather over 50 m. This is the paper 9.3 clean-up, logged on the provenance card.
- `tiles/v1/manifest.json` lists, per level, the x/y ranges that exist (the terrain callback uses it to avoid requests for missing tiles), the sources, licences and every processing step.
- Read big rasters in windows (rasterio over HTTP or local files). Check on day 1 whether each USGS GeoTIFF is tiled or has overviews; if not, download it once (DATA-21 about 11 GB, DATA-22 about 12 GB, DATA-24 23 GB grey or about 1 GB colour COG).
- Total budget for the offline cache: about 300 MB including models (see `docs/SEO_PERFORMANCE.md`).
- Licence of the terrain tiles: derived from HRSC data, so they are published under CC BY-SA 3.0 IGO (share-alike); imagery tiles from public-domain sources carry their credits.

Alignment check (chunk 06, by eye and by number): MSL waypoints from sol 3 to 166 drawn over the 25 cm mosaic follow Curiosity's route to the Yellowknife Bay outcrop; the terrain height at SITE-01 is within 20 m of -4,500.97 m; an unconverted pin lands about 3.2 km away (SITE-07).

## 6. Caching and invalidation

| What | Where | Policy |
|---|---|---|
| `data/*`, `tiles/v1/*`, `models/*` | CDN + service worker | Immutable; `Cache-Control: public, max-age=31536000, immutable`; a new pipeline run writes new names or a new `tiles/vN/` folder |
| `index.html`, `sw.js` | CDN | `no-cache` (always revalidate) |
| Assistant replies | Never cached | Depend on live state |

## 7. Retention

Nothing user-related is stored server-side. The plan lives in the URL and in `localStorage` (`homeward:plan:v1`). Function logs follow Vercel's default retention and contain no audio or transcripts.
