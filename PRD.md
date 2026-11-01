# Product Requirements Document: Homeward

> Version 2.0.0 | 2026-11-01 | Owner: lead and storyteller | Status: built; section 0 gives the status of every feature

## 0. Feature status as built (29 Oct 2026)

Full record of the build session: `BUILD_LOG.md`.

| Feature | Status | Notes |
|---|---|---|
| F01 Mission clock | Built | Matches Mars24 golden tests |
| F02 Orbit arrival | Built | Globe, real Sun and Earth directions, Phobos and Deimos from JPL Horizons with a time-lapse; P1 star map and labelled orbiters not built |
| F03 Descent | Built | EDL-01 HUD, Mars-tuned atmosphere; the formal sky photo comparison was not done |
| F04 Briefing | Partial | LIVE, MEASURED, STANDARD and COMPUTED badges; no MODELLED (Mars Climate Database) values, and the scene says so |
| F05 Planner | Built | Hard budgets, slope and relief avoidance, walk-back heat map; a breach blocks Approve |
| F06 Walk and HUD | Built | You walk it yourself by default (keys, pad, drag to look) at the planner's pace; Follow the plan replays the route; 1.7 m eye height; 30 fps on the weakest laptop not yet measured |
| F07 Science stop | Built | SCI-01 and SCI-02 cards, Curiosity's photos, sample log |
| F08 Grounded assistant | Built | Voice in, Kokoro voice out, captions, source chips; 40/40 on the offline eval; live providers not evaluated (no keys locally) |
| F09 Mission Control | Built | 2 x light time, compression shown on screen |
| F10 Dust devil | Built | GENERATED column, EVT-01 card, the suit announces it |
| F11 Relive sol 182 | Built as Rover view (1 Nov 2026) | Street view at every Curiosity and Perseverance stop from NASA's photos, placed by camera model; featured stops keep the sol 182, 528 and 4709 stories; no rover 3D model, no per-sol weather and dose |
| F12 Provenance | Built | Badges, source tooltips, processing log; diagnostics check 09 |
| F13 Credits | Built | Generated from `data/sources.json` (74 sources) |
| F14 Every-agency layers | Partial | Live MRO CTX and HiRISE, Mars Odyssey THEMIS day and night, Viking colour, plus NASA, ESA/DLR (HRSC inside the DEM) and USGS; landers of USSR, UK/ESA and CNSA on the map; no ESA, ISRO or UAE imagery layer |
| F15 URL and export | Built | URL state, local storage, GeoJSON and CSV with sources, share link |
| F16 Measurement tools | Partial | Ruler with distance, climb and descent and an elevation profile in Explore; cursor position and height; no area or line of sight |
| F17 Water and ice | Not built | |
| F18 Space weather | Partial | Storm drill with RAD-05, microgray kept apart from mSv, the suit says head for shelter; no shelter-time slider, no DONKI list |
| F19 Sound engine | Partial | Radio band-pass for Mission Control and the real SuperCam wind loop; no per-band acoustics |
| F20 Offline | Built | Service worker, offline rules, Kokoro offline; Whisper offline once cached; an Offline chip instead of a progress bar and manifest date |
| F21 Mission pins | Not built | Only Gale and Jezero pins in the orbit view |
| F22-F26 | Not built | P2 |
| F27, F28 | Not built | P3, out of v1 |
| F29 Presence | Partial | 1.7 m eye height, real horizon with no fog, real wind; no 39% light scaling, no suit-interior sound, no comfort settings |
| F30 Dingo Gap 3D | Not built | Sol 528 shows position, track and photos |
| F31 Boxwork zone | Built | Rover drop-off, SCI-05, sol 4709 photos, same budgets |
| F32 THEMIS | Not built | |
| F33 CRISM | Not built | P2 |
| F34 Crew of two | Not built | Single walker; rover drop-off only in the boxwork zone |

Added beyond the PRD: an extra-time check for the stop, spoken hazard alerts, a switch that keeps the assistant offline, Clear plan, and the moons time-lapse.

## 1. Executive summary

Homeward is a browser app that helps an astronaut plan and carry out a safe Marswalk at Gale Crater while doing real science on the way. It combines data from many Mars missions on one Google-Earth style globe (as built: MRO, Mars Odyssey, MGS, Viking, ESA/DLR HRSC and USGS, with every lander pinned), lets anyone stand at any Curiosity or Perseverance stop in the rovers' own photos, and refuses any plan that breaks a hard limit on life support, walk-back distance, slope, radiation or daylight. Its voice assistant speaks only numbers it got from the app's own tested tools, in a natural open-source voice, and Mission Control's replies arrive after the real Earth-Mars round trip, about 22 minutes on the judging weekend. Everything runs on free services and public data, and the full 3D experience also works offline.

## 2. Problem

An explorer on Mars is 3 to 22 light-minutes from help (TIME-12), with life support that lasts about 8 hours (EVA-01), slopes a suit can only partly handle (EVA-03), a radiation environment no magnetic field shields, and daylight that ends on schedule. Existing tools each solve one part (paper 3.5): Mars Trek has layers, NASA's Eyes has positions, Explore with Perseverance has rover-built 3D, JMARS has analysis, the PDS Analyst's Notebook has history. None turns them into one decision with hard margins, and the eight public competitor entries (paper 3.4) all stop at map plus route plus weather. The official challenge page makes the same point: Mars Trek and the USGS-NASA Planetary Geologic Mapping Program layer data for regional and global views, not for the small areas an astronaut covers on one excursion (paraphrased, challenge page saved 28 Oct 2026).

## 3. Users

| Persona | Goal | Frustration | What they need from Homeward |
|---|---|---|---|
| EVA crew scientist (primary) | Reach the best outcrop, collect a sample, get home with margin | Earth cannot answer in time; consumables and daylight run out; small hazards are invisible from orbit | A plan with live margins, a walk-back guarantee, an assistant that answers at once with sources |
| Mission planner on Earth | Check that a crew plan is safe and worth it | Data scattered across tools and agencies | Every layer in one frame, provenance on every number, a shareable URL of the exact scene |
| Student or teacher in Bengaluru | Understand Mars through a real walk | English-only, jargon-heavy tools | A guided walk with plain explanations; Kannada and Hindi voice (P2) |
| Space Apps judge | Decide in about 30 seconds whether this answers the brief, scientifically | Many look-alike entries | A clear story, visible sources, tests against NASA and ESA numbers |

## 4. User stories

1. As a crew scientist, I want to see today's Mars time, season, sunrise and radio delay, so that I plan around light and comms.
2. As a crew scientist, I want to pick science targets and get a route that respects slope, life support, daylight and walk-back, so that I never commit to a walk I cannot return from.
3. As a crew scientist, I want any plan that breaks a limit to be blocked with the reason shown, so that I fix the plan instead of hoping.
4. As a crew scientist, I want a heat map of "time to get home" from every point, so that I know where my margin ends while walking.
5. As a crew scientist, I want to ask by voice "can I still reach the outcrop and get back?" and hear numbers with their sources, so that I decide without waiting 22 minutes.
6. As a crew scientist, I want Mission Control's advice to arrive after the real delay, so that I train for autonomy.
7. As a crew scientist, I want each science stop to explain why it matters, with the paper one tap away, so that the walk produces science.
8. As a planner, I want every number badged as live, measured, modelled, computed, standard, assumption or generated, so that I know what to trust.
9. As a planner, I want to replay Curiosity's real sol 182 at Yellowknife Bay, so that I compare our plan with what the rover actually did there.
10. As a planner, I want to export the plan with citations and share the exact view by URL, so that others can check it.
11. As a judge, I want a credits panel listing every agency, dataset, licence and AI tool, so that I can confirm the rules were followed.
12. As a student, I want the walk to work without venue Wi-Fi (P1) and in my language (P2), so that the demo is reliable and inclusive.

## 5. Features

Priorities: P0 = must for the 30-second film and live demo; P1 = must for submission; P2 = if the core is stable by hour 30; P3 = after Space Apps. Paper section 11 ranks are in brackets.

| ID | Feature | Priority | Acceptance criteria | Chunk |
|---|---|---|---|---|
| F01 | Mission clock: Mars Year, Ls, season, local times at Gale, sunrise/sunset in UTC and IST, rover sols, radio delay [11] | P0 | Values for 2026-11-14T00:00Z equal TIME-02..06 within tolerance; every value badged LIVE | 04, 07 |
| F02 | Orbit arrival: true-scale Mars, Sun and Earth in real directions, Phobos and Deimos moving [5] | P0 (globe, Sun, Earth, Phobos); P1 (star map, labelled orbiters) | Earth marker within 1 deg of the computed direction; Phobos completes about 3 orbits per sol in time-lapse | 08 |
| F03 | Descent to Gale with tuned atmosphere and real EDL numbers [5] | P0 | HUD shows EDL-01 values; sky passes the photo comparison checklist | 08 |
| F04 | Suit-up briefing: conditions for the hour with LIVE/MODELLED/MEASURED badges, dose, daylight left, suit limits | P0 | No number without a badge; MCD values labelled as climatology, not forecast | 07 |
| F05 | Marswalk planner with hard budgets, obstacle avoidance and walk-back heat map [1] | P0 | A plan that breaks any budget cannot be approved; reasons listed; the route avoids cells that are too steep or whose 1 m relief marks an obstacle (large rocks, ridges); route recompute under 300 ms, walk-back field under 500 ms | 04, 07 |
| F06 | First-person walk with HUD: life support, dose, Sun, distance home, radio delay [1] | P0 | Camera at 1.7 m (ASSUMPTION) follows terrain; at least 30 fps on the weakest team laptop (ASSUMPTION target) | 07 |
| F07 | Science stop at Yellowknife Bay with discovery card, point-of-view photos and sample log [10] | P0 | Card cites SCI-01 and SCI-02 with links; Curiosity's own photos of the stop are shown while planning, so the astronaut knows what to expect (an official consideration); sample log exports with coordinates | 07 |
| F08 | Grounded suit assistant: voice in, voice out, captions, source chips [2] | P0 | 40-question eval: at least 38 correct, 0 numbers that did not come from a tool result | 05 |
| F09 | Mission Control on the real round-trip delay, time-compressed and labelled [2] | P0 | Timer equals 2 x one-way light time for the scenario date; compression factor shown on screen | 05 |
| F10 | Dust devil crosses the route, with real numbers [13, scripted single event] | P0 | Event card shows EVT-01 with source; the assistant can answer about it | 08 |
| F11 | Relive Curiosity sol 182 at Yellowknife Bay: rover model, that sol's photos, weather and dose [4] | P0 | Rover within a few metres (ASSUMPTION tolerance) of SITE-02; at least 4 credited photos | 07 |
| F12 | Provenance on every number and layer: badge, source card, licence, processing log [7] | P0 | Diagnostics fail if any fact lacks badge or source | 06, 07 |
| F13 | Credits panel: every agency, dataset, licence, AI tool [3] | P0 | Matches the repository README at submission | 07 |
| F14 | Every-agency layer stack: each agency's data has one visible job [3] | P1 | At least NASA, ESA, DLR, CNES, ASI, ISRO, CNSA, UAE, JAXA, Roscosmos/IKI, CSA, Spain credited with a job | 07, 08 |
| F15 | Shareable URL and export (GeoJSON, CSV) with citations [7] | P0 (URL state), P1 (export) | Opening an exported URL restores scene, plan, sol and camera | 07 |
| F16 | Measurement tools: distance, elevation profile, slope histogram, line of sight [6] | P1 | Distance between SITE-01 and SITE-02 reads 443 m | 07 |
| F17 | Water and ice overlay: Odyssey, SWIM, FREND, ice cliffs, fresh-impact ice [8] | P1 | States plainly that Gale has little near-surface ice | 08 |
| F18 | Space-weather scenario from the May 2024 event, forcing a shelter decision [9] | P0 (raised: the official objectives single out space weather) | Uses RAD-05; shows mGy separately from mSv (different quantities); DONKI event list if reachable (DATA-27) | 08 |
| F19 | Martian sound engine: per-band speed, high-frequency loss, silence in space [12] | P1 | Low-pass and distance attenuation per SND-01; NASA wind recording credited | 08 |
| F20 | Offline mode: the full 3D app (own tiles), data, speech in (Whisper), assistant (offline rules) and voice (Kokoro) work without network [16] | P1 | The whole demo path, including descent, walk and Dingo Gap, runs with the network off after one online visit | 08 |
| F21 | Pins for every surface mission; tour with walk/hike/fly levels [paper 12.8] | P1 (pins), P2 (Jezero walk) | Every pin opens a mission card with a citation; coordinates converted to one convention | 08 |
| F22 | Landing-site safety check [14] | P2 | Scores slope, ice, science and Exploration Zone limits (+/-50 deg, below +2 km) | 08 |
| F23 | Kannada and Hindi mode: speech in via the browser (kn-IN, hi-IN), answers from the same chain, voice via Gemini TTS free tier [15] | P2 | Same tool answers spoken in Kannada or Hindi with captions; offline shows captions only | 05 |
| F24 | Journey prologue: 2026 launch window, cruise, arrival, delay | P2 | Shows TIME-10, TIME-11 with COMPUTED badges | 08 |
| F25 | More route weather: dusk clouds, frost, storm warning [13] | P2 | Each tied to a cited measurement | 08 |
| F26 | Physically based Mie sky (Schneegans et al. 2024) | P2 | Blue halo around the setting Sun, compared with sol 956 photo | 08 |
| F27 | Shared mission notebook [17] | P3 | Needs accounts; out of v1 | - |
| F28 | WebXR view [18] | P3 | Experimental API; desktop first | - |
| F29 | Presence design: real horizon distance (3.39 km at eye height, PLN-12), real light level (39% of Earth's on 14 Nov, PLN-13), 0.33 deg Sun, Martian acoustics and suit-interior sound, scale cues, comfort settings | P0 (cues), P1 (comfort settings) | Every cue traceable to a fact or labelled GENERATED; comfort settings: field of view, head bob off by default, turn vignette, reduced motion | 07, 08 |
| F30 | Rover-scale scene at Dingo Gap: JPL's 3D terrain built from Curiosity's own cameras (DATA-23), Curiosity at its sol 528 waypoint | P1 | Rover-scale tiles sit on our terrain; credits list every instrument; walkable at eye height | 08 |
| F31 | Second walk zone: the boxwork ridges on Mount Sharp, the official page's own example. A pressurised rover drops the crew at Curiosity's sol 4600 waypoint (SITE-10); they walk 240 m and climb 24 m to the ridge Curiosity studied (SITE-11); walk-back target is the rover | P1 | Same planner and budgets; route threads the sandy hollows between 1-2 m ridges using `reliefM`; discovery card from SCI-05; Curiosity's photos from those sols | 03, 07, 08 |
| F32 | Thermal layer: THEMIS thermal inertia (DATA-25) along the route, rock versus loose sand | P1 | Shown as a layer and a route note ("loose sand likely"), never as a hard block; units from the cube label | 03, 08 |
| F33 | Spectral layer: CRISM mineral products over Gale from the PDS Orbital Data Explorer | P2 | Product IDs and licence recorded | 08 |
| F34 | Crew of two and rover support: EVA in pairs, walk-back sized for helping a crewmate, rover drop-off and pickup (official consideration) | P2 | Uses EVA ConOps limits; any new limit is cited or marked ASSUMPTION | 04, 07 |

## 5.1 Requirement traceability (checked against the official challenge page, Details tab, saved 28 Oct 2026)

Official facts now VERIFIED from the saved page: title; difficulty Intermediate; subjects Human Exploration, Mars, Planets & Moons, Software, Space Exploration; the summary as quoted by other teams. The Resources tab was not in the saved file; reconcile it when it is saved. Objectives below are paraphrased.

| The official page asks for | Homeward delivers | NASA missions behind it | Features |
|---|---|---|---|
| A layered, integrated view of a location or route, from multiple NASA science missions | Layers combine into one route cost and one go/no-go at one hyperlocal walk zone | MGS (MOLA), MRO (HiRISE, CRISM), Odyssey (THEMIS), MSL, MAVEN, Mars 2020, Phoenix, InSight | F05, F12, F14, F17, F32 |
| Help a human explorer plan and carry out a Marswalk, with new science on the way | Planner, first-person walk with HUD, grounded assistant, delayed Mission Control, science stops | Mars24, MCD, REMS, MEDA, RAD | F04-F10 |
| A map, tool or interface usable during a surface mission, from NASA data and tools | Habitat planning display (planner), HUD in the walk, tablet-sized layout on small screens | - | F05, F06, F29 |
| Pick science goals and a location; a well-explored rover site is fine | Yellowknife Bay (habitable lake); the boxwork ridges on Mount Sharp, the page's own example | MSL | F07, F31 |
| Consider at least three kinds of data | Six: optical, topographic, radiation, atmospheric, chemical (P0), thermal (P1); spectral P2 (`docs/DATA_SPEC.md` 3.1) | MRO, MGS, MSL, Odyssey | F05, F17, F32, F33 |
| Safety first; the radiation environment differs, so consider space weather | Dose budget and a P0 solar-storm scenario with a shelter decision | MSL RAD, MAVEN | F05, F18 |
| Suits and carried equipment limit mobility; a route map that avoids significant obstacles such as large rock formations | Slope limit from suit capability, relief-based obstacle cells, walk-back rule; honest note that rocks under about 1 m are invisible from orbit | MRO HiRISE | F05 |
| Consideration: display as habitat screen, tablet or helmet HUD | All three framings in the app | - | F05, F06 |
| Consideration: past, future or no time frame | Live time (14 Nov 2026) plus replayed past sols | MSL | F01, F11 |
| Consideration: use rover point-of-view imagery so the crew knows what to expect | Curiosity's photos at each stop while planning; Rover view at every Curiosity and Perseverance stop (rover-scale 3D at Dingo Gap is not built) | MSL, Mars 2020 | F07, F11, F30 |
| Consideration: rovers carrying crew, or astronauts working in pairs | Rover drop-off at the boxwork walk; crew-of-two option | - | F31, F34 |
| Consideration: learn from maps made for other destinations | Apollo walk-back rate and Artemis EVA limits drive the budgets | Apollo, Artemis | F05 |

## 6. Non-functional requirements

| Area | Requirement |
|---|---|
| Validity | Every number from `data/facts.json` or a tested computation; golden tests pass (see `docs/TESTING_STRATEGY.md`) |
| Performance | Walk scene at least 30 fps on the weakest team laptop; planner recompute under 300 ms; first view of the globe under 5 s on a 20 Mbit/s link (ASSUMPTION targets) |
| Accessibility | WCAG 2.2 AA: keyboard walking and planning, captions for every spoken line, hazards shown by pattern and text as well as colour, reduced-motion support |
| Reliability | Full 3D offline mode (P1); AI provider chain with offline rules; recorded walkthrough as last resort |
| Security | Free-tier keys only in the back-end relay; CSP with `connect-src 'self'`; security headers (see `docs/SECURITY_ACCESS.md`) |
| Compliance | No NASA logos; AI disclosed; licences honoured, including share-alike (see `legal/COMPLIANCE.md`) |
| Cost | Zero: free tiers, open-source software and voices, public data; no payment method on any account |

## 7. Success metrics

| Metric | Target |
|---|---|
| Golden tests (Mars24 examples, light times, MY39 start, sunrise at Gale) | 100% pass |
| Assistant eval | Gemini and Groq each at least 38 of 40 correct; 0 unsupported numbers; 100% of answers carry a source chip; offline rules answer the 15 most common intents |
| Planner validity: share of Curiosity's real path from SITE-01 to SITE-02 that the planner rates passable | at least 95% (a rover drove it; a suited human limited to 20 deg should be able to walk it) |
| Judge comprehension | A non-team tester explains the product in one sentence after watching the 30-second film |
| Credits completeness | Every dataset in `docs/DATA_SPEC.md` used in the build appears in the credits panel |

## 8. Constraints

- Hackathon 14-15 Nov 2026; no project work before 14 Nov 09:00 IST; feature freeze at H28 (13:00 IST, 15 Nov); submission deadline from the 2026 Project Submission Guide (published 13 Nov; UNVERIFIED until then).
- Six people at most (roles in `TEAMMATE_GUIDE.md`).
- Zero budget: Gemini, Groq and OpenRouter free tiers; Vercel Hobby (non-commercial); MCD (no commercial use); open-source voices and models. Homeward is non-commercial.
- Demo: 30-second video or up to 7 slides, hosted publicly outside the Space Apps site, English subtitles.

## 9. Out of scope

Rocket design and flight simulation (paper 10); live Mars weather (impossible: archives lag over a Mars year, WX-04); user accounts and stored profiles; walking at sites without metre-scale terrain; native mobile apps; any fictional enemy or invented hazard.

## 10. Roadmap (P3 and beyond)

Shared notebook with accounts (F27), WebXR (F28), MMX Phobos data from 2027, Rosalind Franklin results after its 2030 landing, Mangalyaan-2 (paper 15.14).

## 11. Decisions on the open questions (team answers, 28 Oct 2026)

| ID | Question | Decision |
|---|---|---|
| Q1 | Does the Bengaluru local lead allow planning documents made before 14 Nov? | Yes, allowed. Add them to the public repository on 14 Nov with a note on when and how they were made |
| Q2 | Budget for the voice assistant | Zero. Free AI chain (Gemini, then Groq, then OpenRouter, then offline rules) and the open-source Kokoro voice (README D4, D12, D14) |
| Q3 | Name | Homeward. "Red Atlas" is used by a similar Devpost CesiumJS Mars planner. One web search found no Mars app called Homeward; re-check before submission |
| Q4 | Offline 3D | Full 3D everywhere from our own tiles cut from public data; Cesium's terms forbid storing their tiles offline (README D11) |
| Q5 | Voice model | No paid model. Current free model IDs are in README section 6; confirm them on 14 Nov |
| Q6 | Life-support reserve, daylight margin, eye height, compression factor | Keep 30 min, 30 min, 1.7 m, 60x (ASSUMPTION, adjustable in the app) |
| Q7 | Official challenge resources list | The team pastes the official page text; then reconcile `docs/DATA_SPEC.md` and section 5.1 |
