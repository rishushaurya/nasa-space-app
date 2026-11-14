# Compliance: Homeward

> Version 1.0.0 | 2026-10-29 | Owner: lead and storyteller | Status: app built (see 1.1 update). Not legal advice; it records the rules as the research paper found them and what the team does about each.

## 1. Space Apps 2026 rules (paper 3.2)

| Rule | Status in the paper | What we do |
|---|---|---|
| Hackathon 14-15 Nov 2026; submissions open 14 Nov 09:00 local; global judging from 16 Nov | VERIFIED | Hour plan in `IMPLEMENTATION_PLAN.md` section 12 |
| Teams may not begin working on the challenges before the hackathon | VERIFIED via FAQ excerpt | No project code, no data processing, no deliverables before 14 Nov 09:00 IST. See section 1.1 |
| Demo: 30-second video or up to 7 slides, hosted publicly outside the Space Apps site; English subtitles; slides in English | VERIFIED via guide excerpt | Film plan in `TEAMMATE_GUIDE.md` section 11; script and pipeline in `film/SCRIPT.md` (30 s cut with burned-in English subtitles and an `.srt`) |
| AI allowed but must be disclosed; generated content may not use or alter NASA branding; AI images and video need a visible AI watermark | VERIFIED via guide excerpt | Section 2 |
| Every source must be cited, even open-source or free material | VERIFIED via Terms excerpt | Credits panel + repository README; section 3 |
| Up to six people, all registered and listed | SECONDARY | Lead checks the project page |
| Must answer an official challenge | VERIFIED (2024 guide) | We answer "Interplanetary Survival Guide: Martian Map" |
| 2026 Judging and Awards Guide and Project Submission Guide due 13 Nov | per paper | Re-read both on 13 Nov; update this file and the hour plan |
| Submission deadline and time zone | UNVERIFIED | From the 2026 guide; submit with several hours of buffer |

### 1.1 Status of this planning set

These documents were written on 28 Oct 2026, before the event, with AI assistance. The paper's own advice is to prepare knowledge, not deliverables, before 14 Nov, and to ask the local lead in writing what preparation is allowed.

Ruling: the team reports (28 Oct 2026) that the Bengaluru local lead said planning documents prepared in advance are allowed. Keep the lead's reply (message or email) with the team's records.

Actions:
1. Keep these documents out of the public project repository until 14 Nov, then add them with a note in the README stating when and how they were prepared, and that the local lead allowed it.
2. ~~All code, data processing (including tile cutting), film and slides are made during the event.~~ Superseded on 29 Oct 2026, see below.
3. Ask the local lead separately whether downloading public datasets before 14 Nov, without processing them, is allowed; if not, downloads start at H0.

Update 29 Oct 2026: the team reports that the local host also allowed building the app ahead of the event, and the code and data were built on 29 Oct 2026 with AI assistance (Claude). This goes beyond the planning-documents ruling above, and the global FAQ still says teams may not begin working before the hackathon. Before submitting:
1. Get the local host's permission to build early in writing (message or email) and keep it.
2. Ask whether the global Space Apps team accepts a project built before 14 Nov; a local yes may not bind global judging.
3. Disclose the build date in the submission and in the README (section 1 already states it).
4. Submissions open 14 Nov 2026, 09:00 local; nothing can be submitted before then. The demo video or slides must still be made, with real screenshots, during the event window.
5. The full record of what was built and when is `BUILD_LOG.md`; attach or link it if the organisers ask.

## 2. AI disclosure

| AI use | Disclosure |
|---|---|
| Planning documents drafted with an AI assistant (Claude) | README "How this was made" section and the submission form |
| App code, data pipeline and tests written with an AI coding assistant (Claude), 29 Oct 2026 | README section 1 and the submission form; the Credits scene says so |
| Assistant brains: Google Gemini (`gemini-3.8-flash`), Groq-hosted `openai/gpt-oss-120b`, OpenRouter free models (name the model actually used, from the logs) | On-screen provider label on each answer; credits panel; film subtitle |
| Assistant voice: Kokoro-82M (hexgrad/kokoro, Apache-2.0) via kokoro-js, generated on the user's device | On-screen label "AI voice"; credits panel |
| Speech recognition: browser Web Speech API; Whisper (MIT weights) via transformers.js (Apache-2.0) | Credits panel |
| Kannada and Hindi voice (Gemini TTS, P2) | Credits panel if built |
| Any AI-generated image or video | Visible "AI-generated" watermark on the media itself (the films use none: every picture is a real screen recording of the app) |
| Film narration (Kokoro-82M, voice `af_heart`) and film music (MusicGen, Meta, CC BY-NC 4.0, non-commercial entry) | Named on the films' end card and in `film/SCRIPT.md` |

Voice rules: stock voices only; never clone a real astronaut, NASA engineer or archival broadcast voice; never present the assistant or Mission Control persona as NASA.

## 3. NASA branding and media

- No NASA logo ("meatball"), "worm" or insignia anywhere: app, OG image, film, slides, repository. NASA says its insignia is protected and it does not want it used in AI tools (paper 9.4).
- NASA media are generally not copyrighted in the US; keep credit lines (for example "NASA/JPL-Caltech", "NASA/JPL-Caltech/MSSS") and imply no endorsement.
- Third-party items in NASA galleries may carry their own rights; check each one used.

## 4. Licence matrix (datasets and assets used)

| Item | Licence or terms | Obligation |
|---|---|---|
| CesiumJS | Apache-2.0 | Keep the licence notice in the bundle |
| Cesium ion and Cesium Mars | Not used (README D11): SaaS terms s2.2.2 forbid storing Cesium data output for offline use | - |
| HiRISE DTM and orthoimages (USGS ARD) | CC0-1.0; HiRISE requests credit "NASA/JPL/University of Arizona" | Credit anyway |
| MOLA-HRSC blended DEM 200 m (our terrain tiles) | MOLA CC0; HRSC CC BY-SA 3.0 IGO; cite Fergason, Hare and Laura 2018 | Credit ESA/DLR/FU Berlin and the authors; our terrain tiles are share-alike (CC BY-SA 3.0 IGO) |
| Viking MDIM 2.1 colour mosaic 232 m (our global imagery tiles) | Public domain, no use constraints (USGS) | Credit NASA/USGS/NASA Ames |
| MSL Gale Merged Orthophoto Mosaic 25 cm (our walk-zone imagery tiles) | USGS metadata: use constraints "None"; from HiRISE | Cite Calef III and Parker 2016; credit "NASA/JPL/University of Arizona" for HiRISE |
| JPL Curiosity Dingo Gap 3D Tiles (URS297920) | No licence file; released by NASA JPL | Credit every instrument listed in DATA-23; no endorsement; ask JPL if in doubt |
| Gemini API free tier | Google's API terms; free-tier content used to improve Google products | Say so in the privacy notice; no sensitive data |
| Groq free tier, OpenRouter free models | Their terms; OpenRouter free models are served by third parties | Say so in the privacy notice |
| Whisper weights; transformers.js | MIT; Apache-2.0 | Notices in credits |
| ESA Mars Express VMC images, DLR and ESA HRSC flyovers | CC BY-SA 3.0 IGO | Credit; derivatives under the same licence |
| NASA images, video, audio, 3D models | NASA media guidelines | Credit; no endorsement; no logos |
| NASA Deep Star Maps 2020 | Credit requested | "NASA/Goddard Space Flight Center Scientific Visualization Studio"; "Gaia DR2: ESA/Gaia/DPAC" |
| Mars Climate Database | Free; no commercial use | Non-commercial only; credit LMD and partners |
| timecraftjs (if used) | Caltech copyright; commercial use must be negotiated; US export-control terms | Non-commercial only; read the licence before adding |
| kokoro-js, Kokoro-82M | Apache-2.0 | Notice in credits |
| Rapier (only if the three.js fallback is used) | Apache-2.0 | Notice |
| Phoenix MET data (P2) | Open Government Licence - Canada | Attribution statement |
| Inter, JetBrains Mono fonts | SIL Open Font License 1.1 | Ship the licence file with the fonts |
| Zhurong video (if shown) | CNSA terms unconfirmed | Link to the official release; do not embed a copy |
| MRO CTX global mosaic beta01 via Esri OnMars (live layer since 1 Nov 2026) | The service description states that the Caltech Murray Lab grants free use of beta01 for all purposes; Esri's own hosting terms are not stated on the service (UNVERIFIED) | Credit "NASA/JPL/MSSS/The Murray Lab"; before submission, confirm Esri's terms for public astro.arcgis.com services, or make Viking (NASA Trek) the default layer |
| MRO HiRISE sparse mosaic via Esri OnMars (optional layer) | Built from public PDS data (service description); Esri hosting terms not stated (UNVERIFIED) | Credit "NASA/JPL/University of Arizona"; same check as above |
| NASA Mars Trek tiles (THEMIS day and night, Viking; live since 1 Nov 2026) | NASA media guidelines; public | Credit NASA/JPL-Caltech/Arizona State University (THEMIS) and NASA/JPL/USGS (Viking) |
| NASA raw rover images and records (Rover view; Curiosity and Perseverance) | NASA media guidelines; raw images are public | Credit per image (NASA/JPL-Caltech, /MSSS for Mastcam, /ASU for Mastcam-Z), shown on each photo; no endorsement; offline copies of four stops are 512 px derivatives with the same credit |
| NASA MMGIS waypoints, drive paths, Ingenuity flights | NASA media guidelines | Credit NASA/JPL-Caltech |
| USGS Gazetteer of Planetary Nomenclature | Public domain (USGS); names approved by the IAU | Credit "IAU/USGS Gazetteer of Planetary Nomenclature" |
| MOLA-HRSC 200 m heights via Esri OnMars MDEM200M (live terrain since 13 Nov 2026) | MOLA CC0; HRSC CC BY-SA 3.0 IGO; Esri hosting terms not stated (UNVERIFIED, same check as CTX) | Credit as for the 200 m DEM; heights are only displayed, not redistributed |
| Mars Trek overlays: USGS SIM 3292 geology, MGS TES thermal inertia and dust, MOLA-HRSC colour shaded relief, HiRISE site mosaics | Public domain (USGS) or NASA media guidelines; HRSC parts CC BY-SA 3.0 IGO | Credit per layer (Credits scene, `sources.csv`) |
| PDS Geosciences Node MER traverse tables | NASA PDS | Credit NASA/JPL-Caltech, the MER science team (T. Parker) and the PDS Geosciences Node |
| NASA Image and Video Library photos | NASA media guidelines | Credit per image (shown in the viewer) with a link to its NASA page; no endorsement |
| Curiosity REMS weather feed; DONKI; JPL Horizons orbiters | Public (NASA); REMS is NASA/JPL-Caltech/CAB (CSIC-INTA) | Credit as listed in `sources.csv` |
| HiRISE ESP_048041_1780 (Schiaparelli) | NASA media guidelines | Credit NASA/JPL-Caltech/University of Arizona |
| lerc 2.0.0 (LERC decoder) | Apache-2.0 | Notice in the bundle |
| Other teams' public repositories | Their own licences | Context only; never copy code or assets |

Version 2.0 (1 Nov 2026) added the rows for CTX, HiRISE, Trek, rover images, MMGIS and the Gazetteer above; every one also appears in `data/sources.json` and the Credits scene.

Homeward itself: choose an open licence for our code at submission (MIT recommended). Derived data built from share-alike sources (any HRSC-derived product) is published under CC BY-SA 3.0 IGO.

## 5. Privacy and data protection

The app stores no personal data server-side and has no accounts or analytics. Speech goes to the browser's speech service while the talk button is held (or stays on the device with Whisper); question text goes through our relay to a free AI provider. Details in `legal/PRIVACY_POLICY.md`. GDPR, COPPA, CAN-SPAM and TRAI DLT duties are not triggered by v1 (no accounts, no email, no SMS, no data collected by us). Revisit this section if any of those features are added.

## 6. Accessibility

Target WCAG 2.2 AA (W3C Recommendation since 5 Oct 2023). Checklist in `docs/FRONTEND_SPEC.md` section 13.

## 7. Planetary protection (content rule)

Places that may need special procedures, such as recurring slope lineae, are flagged as "special region: protocol required" in the planner and are never routed through by default (paper 4.13).

## 8. Submission checklist (paper 14.4)

- [ ] Project page complete; all members registered and listed.
- [ ] Film (30 s) or slides (up to 7) hosted publicly outside the Space Apps site, English subtitles. A first cut was made at about 02:30 on 14 Nov, before the window opened; re-record and re-cut after 09:00 (`film/SCRIPT.md` section 6, about 20 minutes) so the submitted film is made inside the event window.
- [ ] Public repository with a README listing every data source, licence and AI tool.
- [ ] Credits panel in the app matches the README.
- [ ] AI disclosure statement; watermarks on any AI media.
- [ ] No NASA logos anywhere.
- [ ] Submitted before the official deadline with several hours of buffer.
