# Build Manifest: Homeward

> Version 3.0.0 | 2026-11-13 | Update this table at the start and end of every chunk. Chunks 10-16 are specified in `build/PLAN-2.md`, chunks 17-26 in `build/PLAN-3.md`.

Start gate (planned): 14 Nov 2026, 09:00 IST. The team reports the local host allowed building early; all chunks were built on 29 Oct 2026. Read `legal/COMPLIANCE.md` 1.1 before submitting.

Chunk files contain goals, file lists, interfaces, validation rules, golden tests and verification commands. They deliberately do not contain finished code (README D8): the code is written during the event, test first.

| Chunk | Name | Status | Locked by | Depends on | Unlocks | Est. time | Owner role |
|---|---|---|---|---|---|---|---|
| 00 | Manifest and diagnostics | DONE (20 checks) | - | - | 01 | 0.5 h | 3D engineer |
| 01 | Scaffolding | DONE | - | 00 | 02, 03, 06 | 1 h | 3D engineer |
| 02 | Backend relay (free AI chain) and health | DONE | - | 01 | 05 | 2 h | AI engineer |
| 03 | Data and tile pipeline | DONE (single rasters per level, no tile pyramid) | - | 01 | 04, 06, 07 | 9 h | Data engineer |
| 04 | Core logic | DONE | - | 01, 03 (grid for planner tests only) | 05, 07 | 6 h | Planner engineer |
| 05 | Assistant, voice and Mission Control | DONE (no Kannada or Hindi) | - | 02, 04 | 09 | 8 h | AI engineer |
| 06 | Frontend shell and own Mars globe | DONE | - | 01, 03 (global tiles first) | 07 | 4 h | 3D engineer |
| 07 | Scenes and panels | DONE | - | 04, 06 | 08 | 10 h | 3D engineer + science lead |
| 08 | Orbit, sky, presence, audio, events, Dingo Gap, offline | PARTIAL (orbit, moons, descent, sky, dust devil, solar storm, real wind, offline done; some presence cues and P1 items cut, list below) | - | 07 | 09 | 9 h | 3D engineer + data engineer |
| 09 | Hardening, deploy, submission | PARTIAL (hardening done; deploy and submission are team steps) | - | 05, 08 | - | 4 h | Lead |
| 10 | Headers for live tiles and rover photos | DONE (COEP credentialless, CSP three hosts, check 15) | - | 09 | 12, 14 | 0.5 h | Lead |
| 11 | Rover stops, tracks, landers, place names | DONE (`pipeline/rovers.py`, `landers.csv`) | - | 03 | 13, 14 | 2 h | Data engineer |
| 12 | Live imagery layers | DONE (CTX, HiRISE, THEMIS day and night, Viking; planetocentric tiling, tested) | - | 10 | 13 | 1 h | 3D engineer |
| 13 | Explore scene | DONE (search, landers, tracks, stops, layers, map controls, ruler) | - | 11, 12 | - | 3 h | 3D engineer |
| 14 | Rover view (street view) | DONE (Curiosity and Perseverance; camera-model placement golden-tested) | - | 10, 11 | - | 4 h | 3D engineer + science lead |
| 15 | Walk yourself | DONE (default; checked end to end in the browser) | - | 07 | - | 1.5 h | 3D engineer |
| 16 | Documents | DONE | - | 10-15 | - | 1 h | Lead |
| 17 | Knowledge graph | DONE (`graphify-out/`, `docs/PROJECT_GRAPH.md`; no broken internal links, no import cycles) | - | - | 26 | 1 h | Lead |
| 18 | Global terrain | DONE (MDEM200M LERC in two workers, LRU cache; checked at Olympus Mons and Valles Marineris) | - | 12 | - | 2 h | 3D engineer |
| 19 | Smoother globe | DONE (render on demand; idle frames 0, measured) | - | 18 | - | 0.5 h | 3D engineer |
| 20 | Science overlays | DONE (shaded relief, geology, thermal inertia, dust, HiRISE site mosaics; opacity) | - | 12 | - | 1 h | 3D engineer |
| 21 | Every visited place | DONE (Spirit 7.08 km and Opportunity 45.1 km tracks, Schiaparelli, landing-site tour) | - | 11 | - | 1.5 h | Data engineer |
| 22 | Rover view ride | DONE (autoplay along the drive, 3/6/10 s per stop) | - | 14 | - | 0.5 h | 3D engineer |
| 23 | Lander photos | DONE (NASA image library, curated query per lander, tested filter; CSP D24) | - | 13 | - | 1 h | Science lead |
| 24 | Live conditions | DONE (REMS latest sol; DONKI relay `/api/v1/spaceweather`, tested) | - | 02 | - | 1 h | AI engineer |
| 25 | Physics | DONE (radio line of sight with curvature, golden horizon test; five orbiters from Horizons, golden tests) | - | 04 | - | 1.5 h | Planner engineer |
| 26 | Documents | DONE | - | 17-25 | - | 1 h | Lead |
| 27 | Demo films | DONE as a first cut (30 s and 2:20 story film from real recordings; re-cut after 09:00 on 14 Nov for the event window) | - | 26 | - | 2 h | Lead and storyteller |

Statuses: DONE (verified, files exist), IN-PROGRESS (locked; others keep out), READY (dependencies met), BLOCKED (wait).

Rules:
- Set IN-PROGRESS and your name before starting; clear the lock when done.
- IN-PROGRESS for more than twice the estimate: the next person may investigate and take over, and logs it.
- Chunks 02, 03 and 06 can run in parallel after 01. Chunk 04's time, ephemeris and frame modules do not need 03; only its planner tests need the grid.
- Feature freeze at H28 (15 Nov, 13:00 IST): after that, chunk 08 P2 items are dropped, not started.

## Progress log

| Time (IST) | Chunk | Change | By |
|---|---|---|---|
| 2026-10-28 | - | Manifest created; nothing built | Claude Opus 5.5 (planning) |
| 2026-10-28 | 02, 03, 05, 06, 08 | Specs revised: free AI relay, Kokoro voice, own Mars tiles, Dingo Gap, presence; estimates updated | Claude Opus 5.5 (planning) |
| 2026-10-29 | 00-09 | Built and verified in the browser; diagnostics 19 PASS, 0 FAIL, 1 SKIP (live health needs the deployed URL) | Claude Opus 5.5 |
| 2026-10-29 | all | Every chunk file given an Outcome section; all documents updated to as-built; full record in `BUILD_LOG.md` | Claude Opus 5.5 |
| 2026-11-01 | 10-16 | Research pass and `build/PLAN-2.md`; Explore, Rover view, walking yourself, live layers built; checked in the browser at desktop and 375 px; diagnostics 19 PASS, 0 FAIL, 1 SKIP; 52 tests | Claude Opus 5.5 |
| 2026-11-06 | 16 | Every document and both skills at 2.0; CTX licence recorded; pushed to https://github.com/rishushaurya/nasa-space-app (`main`) | Claude Opus 5.5 |
| 2026-11-07 | - | Handoff: "Where to begin" in `CLAUDE.md`; memory updated. Next: team's choice, else deploy, Esri terms, 200 m terrain | Claude Opus 5.5 |
| 2026-11-13 | 17-26 | Version 3.0: research, `build/PLAN-3.md`, knowledge graph, global relief, render on demand, overlays, MER tracks, Schiaparelli, tour, ride, lander photos, live conditions, line of sight, orbiters; checked in the dev server and under production headers; 73 tests; 19 PASS, 0 FAIL, 1 SKIP | Claude Fable 5.2, Claude Opus 5.5 |
| 2026-11-14 | - | Fly mode in the Walk scene (10 to 1,000 m/s, climb and descend, tested `flyStep`); 76 tests | Claude Opus 5.5 |
| 2026-11-14 | - | Deployed on Vercel Hobby (https://nasa-space-app-drab.vercel.app); function import fix; diagnostics 20 PASS, 0 FAIL, 0 SKIP | Claude Opus 5.5 |
| 2026-11-14 | 27 | Demo films: `film/` pipeline (record the real app, Kokoro narration, MusicGen bed, NASA Mars wind, ffmpeg edit with subtitles); first cut of both films; no app code changed | Claude Opus 5.5 |

## Cut from chunk 08 and 09 (not built)

- T41 Dingo Gap 3D tiles; Curiosity 3D model; T27 every-agency layers beyond NASA, ESA/DLR and USGS; T28 ice overlay. (T43 THEMIS layer and T32 mission pins were built on 1 Nov 2026.)
- From PLAN-2 section 5: 360 street view for missions without public pointing data (they now have photo strips); lens distortion in Rover view. (200 m terrain everywhere was built in 3.0.)
- T30 per-band acoustics and suit-interior loop (the real SuperCam wind recording is in); T40 comfort settings; light scaled to 39% (PLN-13); star sphere rotated for Mars; labelled orbiters.
- MCD conditions; Kannada and Hindi (P2); all P2 items; browser end-to-end tests; InSight raw images by sol (the API has them, without pointing); MAVEN (no ephemeris after 1 Mar 2026).
- Team steps: Vercel deploy with keys (import https://github.com/rishushaurya/nasa-space-app), demo video or slides from real screenshots, submission form.
- Open checks: Esri's terms for the OnMars CTX and HiRISE tiles (`legal/COMPLIANCE.md` section 4).
