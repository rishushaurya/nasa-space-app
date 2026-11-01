# Chunk 08: Orbit, sky, presence, audio, events, offline

> Version 1.0.0 | 2026-10-29 | Goal: the cinematic opening, the feeling of standing on Mars, the dust-devil moment, Martian sound, the Dingo Gap rover-scale scene, every-agency layers and full 3D offline. Tickets T21, T22, T23, T40 cues (P0); T27-T32, T40 settings, T41 (P1); T34, T36-T38 (P2 only if the core is stable at H30).

| Field | Value |
|---|---|
| Estimated time | 9 h |
| Depends on | 07 |
| Unlocks | 09 |
| Owner | 3D engineer + data engineer; science lead for audio and facts |

## P0

### Orbit view (T21)
- Globe at true scale on our tiles; Sun direction from `marsTime` (subsolar point); Earth marker from `helioEcliptic` (re-check TIME-09, 37.9 deg elongation on 14 Nov).
- Phobos and Deimos: precompute positions hourly for 14-16 Nov 2026 from JPL Horizons (target 401 Phobos, 402 Deimos, centre 499 Mars, Mars-fixed frame) into `data/sky/moons-2026-11.json`; interpolate. Time-lapse shows Phobos's three orbits per sol (MSN-05).
- P1: star sphere from NASA Deep Star Maps 2020 (celestial frame) rotated into the Mars-fixed frame; orbiters MRO, MAVEN, Odyssey, Mars Express, TGO, Hope, Tianwen-1 from Horizons, each labelled with its agency.

### Descent and tuned sky (T22)
- Scripted camera from about 120 km to eye height over SITE-01, 8-12 s; tiles at every level are our own, so the descent sharpens from 232 m Viking colour to the 25 cm MSL mosaic.
- CesiumJS atmosphere: start from the documented Earth defaults and adjust towards Mars (scale height near 11 km per PLN-09; weaker Rayleigh; stronger Mie; warmer hue). Record final values and reference photos, badge ASSUMPTION on the sky's provenance card.
- HUD counts EDL-01 values (entry about 19,500 km/h; parachute at about 11 km and 1,512 km/h; TRN 4.2 to 2.2 km), labelled "Perseverance's real entry profile, shown over Gale".
- Sound: silence until the descent passes about 11 km (one scale height; ASSUMPTION threshold), then wind fades in.

### Presence cues (T40, P0)
Grounded in real numbers; see `design/UI_DESIGN_PROMPTS.md` section 8.
- Eye height 1.7 m (ASSUMPTION); the horizon sits where it really is, 3.39 km away (PLN-12): use no fog or haze that hides it closer, and no exaggerated curvature.
- Exposure: scene light scaled to 39% of Earth's sunlight on 14 Nov (PLN-13); the Sun disc 0.33 deg (TIME-07).
- Sound: thin-air acoustics per SND-01; suit interior (breathing, fan) as a quiet loop (GENERATED, credited); footsteps through the suit, not the air.
- Scale: the Curiosity model (about 3 m long, NASA 3D Resources) at Yellowknife Bay; real tracks only where the imagery shows them.

### Solar storm (T29, raised to P0)
The official objectives single out space weather. Alert card with RAD-05 (about 8,100 micrograys at Curiosity, 20 May 2024); the planner adds "reach shelter within N minutes" (N ASSUMPTION, slider; shelter = habitat, rover or a mapped overhang); dose in mGy shown separately from the mSv background; DONKI event list (DATA-27) only if reachable on the day.

### Dust devil (T23)
- At a scripted point about 2/3 along the outbound route, a dust column (GENERATED badge) crosses about 400 m ahead at 19 km/h (EVT-01: 60 m wide, about 2 km tall).
- Event card: EVT-01 and WX-02 with sources; `get_event` returns the same numbers; suggested question "Is it safe to continue?".

## P1

| Ticket | Spec |
|---|---|
| T27 Every-agency layers | Grouped by agency, each with one visible job: NASA (MOLA, HiRISE, Viking imagery), ESA/DLR (HRSC in our terrain; VMC orbit reference), CNES (MCD conditions, SuperCam sound), ASI (SHARAD/MARSIS ice notes), ISRO (MCC full-disc image in the orbit view), CNSA (Tianwen-1 76 m colour basemap toggle, if its terms allow), UAE (Hope dust and cloud card), JAXA (MMX card at Phobos), Roscosmos/IKI (FREND water note, DAN on Curiosity), CSA (Phoenix snow card), Spain CAB (REMS, MEDA, TWINS in the briefing). Each with a provenance card and licence |
| T28 Ice overlay | Points and areas from paper 4.12 with depths; statement that Gale has little near-surface ice |
| T42 Boxwork walk zone | Second site from the site picker: tiles and grid from chunk 03 step 3b; a pressurised-rover model at SITE-10 replaces the habitat as the walk-back target; stop at SITE-11 with the SCI-05 card and Curiosity photos from sols 4709-4789; same budgets |
| T43 Thermal layer | THEMIS thermal inertia overlay with legend and provenance card; low values add a "loose sand likely" note on the route |
| T30 Sound engine | Web Audio: per-band delay (240 m/s below 240 Hz, 250 m/s above), low-pass with distance so high pitches fade by about 8 m (SND-01); NASA microphone wind loop credited; radio band-pass (300-3,400 Hz, ASSUMPTION) for Mission Control |
| T31 Offline | `app/public/sw.js`: precache shell and every file in `data/manifest.json` and `tiles/v1/manifest.json`, plus `/models/` and `/audio/`, on the first online visit with a progress bar ("Caching Mars for offline: 62%"); cache-first for immutable files, network-first for `index.html`; offline banner with the manifest date |
| T32 Mission pins | All surface missions from paper 7.1; NSSDC west longitudes converted with `westToEast`; each pin opens a cited card; walk/hike/fly level badge |
| T40 Comfort settings | Field-of-view slider (60-90 deg, default 70, ASSUMPTION), head bob off by default, optional vignette while turning, snap-turn option, reduced motion; stored in localStorage |
| T41 Dingo Gap | Load `tiles/v1/dingo-gap/scene-tileset.json` as a `Cesium3DTileset` with the placement from `data/sols/msl-0528.json`; Curiosity model at SITE-08; walk at eye height on the rover-built terrain; credits for every instrument (DATA-23); a provenance card explaining the JPL Landform pipeline |

## P2 (only after H30 if P0 and P1 are green)

T34 landing-site safety check (Exploration Zone limits +/-50 deg latitude and below +2 km; slope from the 200 m DEM; EDL-01 replay; EDL-02 odds line), T36 journey prologue (TIME-10, TIME-11), T37 dusk clouds, frost, storm warning, T38 Mie-theory sky (Schneegans et al. 2024, CosmoScout VR, MIT).

## Verification

```
npm run dev
npm run e2e
```
Manual: orbit to descent to Gale without a stall on the weakest laptop; sky compared with Curiosity photos; Phobos time-lapse; dust devil card sourced; Dingo Gap terrain meets ours without a step; with the network off after one online visit, every scene works in full 3D.

## Rollback

Each P1 and P2 item sits behind a flag in `app/src/features.ts`; switch it off rather than reverting under time pressure.

## Outcome (29 Oct 2026)

Built (P0 and some P1): orbit view with the real Sun and Earth and Phobos and Deimos from JPL Horizons plus a 1 hour per second time-lapse; descent with Perseverance's entry numbers; Mars-tuned atmosphere; the dust devil (60% of the way out, GENERATED column, EVT-01 card, spoken by the suit); the solar-storm drill (RAD-05, microgray kept apart from mSv); the real SuperCam wind under descent and walk; offline service worker (shell at install, background fill after the globe, hash eviction); the boxwork zone (T42).

Not built: Dingo Gap 3D tiles, Curiosity model, every-agency layers, ice overlay, THEMIS, mission pins, per-band acoustics and suit sound, 39% light scaling, comfort settings, star sphere for Mars and orbiters, DONKI, all P2. The first production visit failed because the old precache-everything service worker raced the page; fixed.

Verification: moons within 0.031 deg (Phobos) and 0.047 deg (Deimos) of JPL Horizons; first visit from empty storage in the production build loads with no console errors.

Full record: `BUILD_LOG.md`.
