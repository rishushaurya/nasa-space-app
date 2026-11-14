# Teammate Guide: Homeward

> Version 2.0.0 | 2026-11-01 | For everyone on the team, technical or not. The app is built: section 0 says what to show and what not to claim. 2.0.0 adds Explore, Rover view and walking yourself.

## 0. The app is built (29 Oct 2026; Explore, Rover view and walking yourself added 1 Nov 2026)

What to show judges, in order: the live Mars clock; Explore (search "Jezero", open a landing-site card, zoom onto a rover track, switch to THEMIS night infrared); Rover view (stand at Yellowknife Bay in Curiosity's own photos, drag to look round, step along the drive with the arrows); Mars from orbit with Phobos and Deimos (press Time-lapse); the descent to Gale; the planner refusing an unsafe plan (raise the stop time until a budget turns red); the walk, walked by hand (hold W), with the dust devil and the suit voice warning, and the debrief comparing the plan with what you did; the solar-storm drill; a question to Mission Control arriving after the real radio delay; Curiosity's own photos at the stop; the boxwork zone; the credits.

What not to claim: data from every agency (imagery and terrain come from NASA missions MRO, Mars Odyssey, MGS and Viking, ESA/DLR's HRSC and USGS; landers from NASA, the USSR, the UK with ESA and CNSA are on the map), street view for any rover other than Curiosity and Perseverance, a Curiosity 3D model, Dingo Gap in 3D, an ice layer, 3D relief at landing sites other than Gale, Kannada or Hindi, live Mars weather (no app can have it, and ours says so). Rover view needs the internet except at four featured stops.

Before submitting: read `legal/COMPLIANCE.md` 1.1 (the app was built on 29 Oct after the local host allowed it; the global rule says no work before the event), and make the film or slides from real screenshots during the event. Full record of the build session: `BUILD_LOG.md`.

## 1. What is Homeward?

A web app that lets an astronaut plan a safe walk on Mars at Gale Crater, using real data from many Mars missions, lets anyone visit every landing site and stand in the rovers' own photos, and refuses any plan that would not get them home.

## 2. The problem, with an analogy

Picture a mountaineer on a glacier whose base camp can only reply 22 minutes after every radio call, whose oxygen lasts 8 hours, and whose map came from a satellite that cannot see small rocks. They need a guide that knows the ground, counts their air, and says no when a route is too far. On Mars that guide does not exist yet. Today's Mars tools each do one piece: maps, rover history, or 3D views (paper 3.5).

## 3. How it works

**Simple version.** We start in space, fly down to Gale Crater, and plan a walk from Curiosity's landing spot to the rock it first drilled, 443 m away. Bars show air, daylight, radiation and the distance home. If a bar turns red, the plan is blocked. You can ask the suit's voice assistant questions, and it answers only with numbers it looked up, naming the source. A message to Mission Control comes back after the real radio delay. Then we stand where Curiosity stood, in its own photos, and step along its real drive like a street view; the same works for Perseverance at Jezero. Explore lets you fly anywhere on Mars, search any named place and visit every landing site. The planner, the walk and the assistant work without Wi-Fi, and none of it costs money.

**Technical version.** CesiumJS renders Mars on the IAU 2015 ellipsoid from our own terrain and imagery tiles, cut from the same public data Cesium Mars uses (MOLA-HRSC 200 m, Viking colour 232 m) plus 1 m HiRISE terrain and the Curiosity team's 25 cm HiRISE mosaic at Gale; online, it also streams NASA Mars Trek and Esri OnMars tiles (CTX at 5 m, HiRISE, THEMIS), converting their planetocentric tiles to the ellipsoid. Rover view fetches NASA's raw-image records and places each photo with its own camera model (CAHV) and the rover's attitude quaternion, tested against a real record. A Web Worker runs Dijkstra from the habitat over a 2 m slope grid derived from a CC0 HiRISE DTM, giving time-to-home for every cell, then A* through the chosen stops with Tobler-scaled walking speed (3.3 km/h on flat ground, Apollo planning rate). Budgets come from NASA's EVA ConOps and Curiosity's RAD data. Time and Sun come from the Mars24 algorithm; Earth-Mars distance from JPL's planetary elements; both reproduce NASA's and ESA's published landing light times. The assistant is a cascade: speech to text in the browser, a free AI brain (Gemini, falling back to Groq, then OpenRouter, then offline rules) that may only use numbers from tools running in the browser, and the open-source Kokoro voice speaking on the device.

## 4. Features with analogies

| Feature | Analogy |
|---|---|
| Mission clock | A world clock, for Mars |
| Planner with hard budgets | A fuel gauge that will not let you leave if you cannot get back |
| Walk-back heat map | A "you can still get home from here" shadow on the map |
| Grounded assistant | A librarian who only answers from the books on the shelf, and shows you the page |
| Mission Control delay | Sending a letter that takes 22 minutes to get a reply |
| Explore | Google Earth, for Mars, with every landing site pinned and sourced |
| Rover view | Google Street View, built from the rovers' own photos at every stop |
| Walk yourself | A walking game where the rules are NASA's: your real pace, your real air |
| Provenance badges | Nutrition labels for every number |

## 5. Us versus other tools

| | Mars Trek | NASA's Eyes | Explore with Perseverance | Public 2026 entries | Homeward |
|---|---|---|---|---|---|
| Real terrain to walk on | no | no | yes (one rover) | several | yes |
| Data from many missions together | yes (layers) | positions | no | no | yes: MRO, Odyssey, MGS, Viking, HRSC and every lander |
| Hard safety budgets and walk-back | no | no | no | some | yes, enforced |
| Street view from the rovers' own photos at every stop | no | no | partly (one rover, one 3D model) | Navcam panoramas in one | yes, Curiosity and Perseverance |
| Assistant grounded in cited tools, with real delay | no | no | no | AI interpreter in one | yes |
| Numbers tested against NASA and ESA values | n/a | n/a | n/a | not shown | yes |

## 6. Offline mode, in plain words

If the venue Wi-Fi dies, the whole 3D app keeps working on the same real data and map tiles saved in the browser. Speech recognition and the voice already run on the laptop; the assistant switches to offline answers built from the same tools. Nothing is made up; the banner says the date of the saved data.

## 7. Tech stack and what a judge might ask

| Tech | Why we chose it | Judge might ask |
|---|---|---|
| CesiumJS with our own Mars tiles | Free, works offline, same public sources as Cesium Mars | "Is this real terrain?" Yes: MOLA-HRSC globally, 1 m HiRISE at Gale; elsewhere the relief is coarse (7.5 km) but the imagery is 5 m CTX |
| NASA raw-image APIs and MMGIS | The rovers' own photos and positions, free and public | "Are the photos in the right place?" Each is placed by its own camera model and the rover's attitude; Curiosity's sol-168 panorama lands at exactly 0, 30, 60 deg and so on |
| HiRISE DTM (CC0) | Only data fine enough for walking slopes | "How do you know slopes?" 1 m stereo terrain, slope by Horn's method (as in GDAL) |
| Mars24 algorithm | NASA GISS's own method | "How do you know the time on Mars?" Same formula NASA uses; our test reproduces their example |
| JPL elements | Published, testable | "Is the 22-minute delay real?" We reproduce NASA's 11.37 min at Perseverance's landing |
| Free AI chain (Gemini, Groq, OpenRouter) | Free, with fallbacks | "Can the AI make things up?" It can only speak numbers from tools; every provider passes the same 40-question test |
| Kokoro-82M voice (Apache-2.0) | Natural, open-source, runs on the laptop | "Is that a real person?" No, an open-source AI voice, labelled on screen |
| Vercel function | Keeps the free keys secret | "Is it secure?" One relay, origin check, rate limit, nothing stored |

## 8. Security, in plain words

There are no accounts and we store nothing about you. Your voice is turned into text by your browser; your question text goes through our relay to a free AI service, and Google says it uses free-tier content to improve its products, so the app tells you that before you start. The voice that answers is generated on your own laptop. Our keys never reach the browser, and no account has a card attached, so nothing can ever be charged.

## 9. Judge Q&A

1. **Is any of this fake?** No. Every number has a badge and a source. Pictures we generate, like small rocks or the dust column, are labelled GENERATED.
2. **Why Gale?** The best metre-scale terrain and imagery (HiRISE, plus the Curiosity team's own 25 cm mosaic), Curiosity's traverse to check against, and Curiosity measured the radiation on that very crater floor.
3. **Why not where the ice is?** Gale has little near-surface ice, and we say so; an ice layer is not built yet.
4. **Where do the suit limits come from?** NASA's 2020 EVA Concept of Operations (8 hours, 20 deg slopes, 2 km radius). They are lunar numbers, and we say so.
5. **Why 3.3 km/h?** Apollo 17 planners used it to size walk-back distance.
6. **Is the weather live?** No, and nothing can be: rover weather reaches the public archive more than a Mars year later. We show live time and Sun, modelled climate, and measured ranges, each labelled.
7. **How do you validate the planner?** Curiosity drove from the landing site to Yellowknife Bay. At least 95% of that real path must be passable under our rules.
8. **Why does Mission Control take 22 minutes?** Light takes about 11 minutes each way on 14 November 2026; we compute it and test the method against NASA's and ESA's landing numbers.
9. **What about radiation?** About 0.64 mSv per day on the surface, measured by Curiosity's RAD. Even a full 8-hour walk adds only about 0.2 mSv; the real danger is a solar storm, which our scenario replays from May 2024.
10. **Which agencies?** On screen today: NASA (MRO CTX and HiRISE, Mars Odyssey THEMIS, MGS MOLA, Viking, Curiosity, Perseverance, Ingenuity), ESA and DLR (HRSC terrain), USGS (Gazetteer, mosaics), Spain's CAB and France's CNES through rover instruments, and landers of the USSR, the UK with ESA and CNSA on the map. ISRO, UAE and JAXA appear in the facts and credits only.
11. **Did you use AI?** Yes, disclosed: free AI models for the assistant (Gemini, Groq's gpt-oss, OpenRouter), the open-source Kokoro voice and Whisper speech recognition, and AI coding assistants. AI media is watermarked.
15. **What did it cost?** Nothing. Free tiers, open-source software and voices, and public NASA, ESA and USGS data.
16. **Why does it feel real?** The horizon is where it really is (3.39 km at eye height), the light is the real 39% of Earth's, the Sun is the real 0.33 deg, sound behaves as Perseverance measured, and in Rover view you stand inside Curiosity's and Perseverance's own photos, each where its camera pointed.
12. **Why not a rocket simulator?** It is outside the brief and cannot be done credibly in 48 hours. We kept the scientific core: is a landing site safe and worth it (stretch feature).
13. **What is new here?** A street view of every rover stop from the rovers' own photos, a radio-delayed Mission Control, enforced walk-back, and many missions' data on one globe. None of the public entries combines them.
14. **What next?** MMX's Phobos data from 2027, Rosalind Franklin after 2030, Mangalyaan-2, and Kannada and Hindi classrooms.

## 10. Three-minute pitch

| Time | Say | Show |
|---|---|---|
| 0:00-0:20 | "On 14 November 2026, an astronaut at Gale Crater is 11 light-minutes from help. Air for 8 hours. Daylight until 17:57 local time." | Mission clock |
| 0:20-0:50 | "Homeward is one place for Mars: every landing site, the rovers' own photos, a real sky, and a planner that keeps you alive." | Explore, then orbit and descent |
| 0:50-1:30 | "We plan a walk to Yellowknife Bay, where Curiosity found an ancient lake. The planner checks slope, air, daylight, radiation and the walk home at every step." | Planner, heat map, a red breach |
| 1:30-2:10 | "A dust devil crosses. The suit assistant answers now, with sources. Mission Control's advice arrives 22 minutes later." | Walk, assistant captions, countdown |
| 2:10-2:40 | "Stand where Curiosity stood, in its own photos, and walk its real drive like a street view. The same for Perseverance at Jezero." | Rover view at Yellowknife Bay, step forward |
| 2:40-3:00 | "Every number is sourced and tested against NASA and ESA. AI disclosed." | Credits, badges |

## 11. The 30-second film (paper 14.1)

As made (14 Nov 2026): `film/SCRIPT.md` has the final script for the 30-second cut and a 2:20 story film, and `film/` rebuilds both from the real app. The table below is the original plan.

| Seconds | Picture | Subtitle |
|---|---|---|
| 0-4 | True-scale Mars in space; Phobos crossing; Earth as an evening star | "14 November 2026. Mars Year 39. One Mars, built from many missions' data." |
| 4-9 | Descent through the dusty sky to Gale at sunrise | "Real terrain. Real sky. Real time on Mars." |
| 9-15 | Planner draws a route to the ancient-lake outcrop; bars stay green | "Plan a Marswalk that gets you home." |
| 15-20 | Walking; a dust devil crosses; question to the assistant | Assistant answer with a source card |
| 20-24 | "Mission Control, 22 minutes later" (time-compressed, labelled) | "Earth is 11 light-minutes away. The crew decides." |
| 24-28 | Rover view: Curiosity's own photos at Yellowknife Bay, stepping along the drive | "Every rover stop, in the rover's own photos." |
| 28-30 | Name, team, credits, AI disclosure | "Data: NASA, ESA, DLR, USGS and more. AI voice disclosed." |

Rules: label the voice as AI; watermark any AI-generated image or video; no NASA logos; credit every clip.

## 12. Seven-slide outline (paper 14.2; build the deck during the event from real screenshots)

1. The problem: a walk 11 light-minutes from help, with air, power, dose and daylight running out.
2. Our answer: one place: every landing site, the rovers' own photos at every stop, a real sky, a planner that keeps you alive.
3. The missions behind it: a logo-free grid of names and datasets (MRO, Mars Odyssey, MGS, Viking, Curiosity, Perseverance, HRSC, USGS, and the landers of four agencies).
4. How it works: the TAD diagram.
5. Why you can trust it: badges, golden tests, measured versus modelled.
6. Three moments: the walk, the delayed Mission Control reply, sol 182.
7. Impact and next: crews, classrooms in Kannada and Hindi, MMX, Mangalyaan-2, Rosalind Franklin.

## 13. Roles (paper 13.2)

| Role | Owns | Docs to read first |
|---|---|---|
| Lead and storyteller | Story, film, slides, judging checklist, final claim check | PRD, this guide, legal/COMPLIANCE |
| 3D engineer | Cesium world on our tiles, orbit, descent, sky, walking, presence, Dingo Gap | TAD, chunks 06, 07, 08 |
| Data engineer | Pipeline, Mars tiles, grid, traverses, images, conditions, provenance | docs/DATA_SPEC, chunk 03 |
| Planner engineer | Route search, budgets, walk-back, validation | chunk 04, FEATURE_TICKETS T08 |
| AI and voice engineer | Relay with free AI chain, tools, speech in, Kokoro voice, Mission Control, eval per provider | chunks 02, 05 |
| Science and experience lead | Facts, sources, corpus, discovery cards, audio, accessibility, credits | docs/DATA_SPEC, design docs |

## 14. Risks (paper 13.3, kept current)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Venue Wi-Fi fails | Medium | High | Full 3D offline mode from our own tiles; recorded walkthrough as last resort |
| Tile pipeline takes too long (big downloads) | Medium | High | Walk zone and global levels first; windowed reads; ask the local lead about pre-downloading public data |
| Free AI quotas run out on judging day | Medium | Medium | Three providers in a chain, offline rules last; spread eval runs; check quotas every 2 hours from H28 |
| Free-tier terms change before the event | Low | Medium | Re-check pricing and limits pages on 13 Nov; keep the chain configurable by env |
| Assistant says something wrong | Medium | High | Tools-only numbers, refusal on gaps, 40-question eval |
| Undocumented endpoints change | Medium | Medium | Snapshot everything in `data/` |
| Licence mistakes | Medium | High | Licence column, credits panel, no logos |
| Breaking the no-early-work rule | Low | Disqualification | No code or data processing before 14 Nov; the local lead allowed these planning docs; keep that reply |
| Scope creep | High | High | Cut line and feature freeze at H28 |
| Pins 3 km off from a frame mix-up | Medium | High | `toCesium` everywhere, unit test, visual check |
| Fatigue | High | Medium | Two sleep shifts; nobody codes past 24 hours awake |
| Slow on a judge's laptop | Medium | Medium | Quality presets; test on the weakest team laptop |
