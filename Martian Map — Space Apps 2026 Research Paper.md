# Interplanetary Survival Guide: Martian Map — Research Paper and Build Plan (NASA Space Apps 2026)

Oct 28, 2026 · @Quickbites

## Executive summary

**What the challenge wants.** A layered, integrated view of one place on Mars, built from several missions' data, that helps a human explorer plan and carry out a Marswalk safely and do science along the way (Section 2).

**What to build: "Red Atlas", a scientist's Mars workbench in one place (RECOMMENDATION).** It is a browser app at Gale Crater. It starts in space at true scale and descends through a dusty sky to real ground. There it plans a Marswalk with hard limits on oxygen, power, radiation dose, daylight and walk-back distance. A voice assistant answers only from cited data, while Mission Control's replies take the real round trip of about 22 minutes, 11 each way. A time machine replays any rover's real sol, and data from every agency that has been to Mars appears with credits (Sections 11 and 12).

**Why it can win.**

- **The competition.** At least eight public entries already exist, and several walk on terrain and draw routes (Section 3.4). None combines every agency's data, replayable rover history, a physically based sky, a grounded and delayed voice, and validated numbers.
- **Existing tools.** Mars Trek, NASA's Eyes, Explore with Perseverance, Access Mars, JMARS, OpenSpace and CosmoScout VR each do one part (Section 3.5).

**Your six ideas.** Keep walking, but as the live view of the plan. Turn the journey into a 60-second prologue built on real computed numbers. Make real dangers the core. Keep gamification, but score science within safety margins. Keep the voice, grounded and delayed. Drop rocket testing and turn landings into a landing-site safety check (Section 10).

**Real numbers for the judging weekend (computed and cross-checked; Sections 4.6 and 10.1).**

- **Season:** Mars Year 39, Ls 22°, early northern spring.
- **Sunrise at Gale:** 13:47 IST on 14 November.
- **Sky:** Earth is an evening star 38° from the Sun.
- **Radio delay:** 11.0 minutes one way.
- **Launch window:** the cheapest 2026 departure was 31 October, arriving 19 August 2027.
- **In the news:** Japan's MMX launched to Phobos on 20 October.

**Build first, in this order (Section 13).**

1. CesiumJS with Cesium Mars at Gale.
2. The planner with budgets.
3. The assistant with tools.
4. Relive a sol.
5. The orbit view and sky.
6. The film, with features frozen at hour 28.

**Rules that can sink you (Section 3.2).**

- No project work before 14 November.
- Disclose AI and watermark AI-generated media.
- No NASA logos.
- Cite every source, and respect share-alike licences (Section 9.4).

**How to read this paper.**

- **The science:** Section 4, a full Mars environment atlas.
- **The data:** Sections 5–7, covering every resource, every agency and every rover.
- **The technology:** Sections 8–9.
- **Decisions and design:** Sections 10–12, including the requirement check, the scene-by-scene walkthrough and the site tour (12.6–12.8).
- **Execution:** Sections 13–14.
- **What to watch and check:** Sections 15–16, including the readiness audit.
- **Papers and links:** Sections 17–18.

## 1. How this research was done

Every factual claim in this paper links to a page that was opened during the research on 28 October 2026; anything I could not open is labelled UNVERIFIED.

**Labels used throughout**

| Label | Meaning |
| --- | --- |
| VERIFIED | The linked page, opened today, states it. |
| SECONDARY | Stated by a non-official source (news, another team's repository). Treat as likely, not certain. |
| UNVERIFIED | I could not confirm it. Check before relying on it. |
| RECOMMENDATION | My judgement for your team, not a fact. |
| COMPUTED | Calculated with my own scripts from published algorithms and elements, and checked against published values where possible. |
| ASSUMPTION | A working value or estimate I chose; tune or replace it with your own measurement. |

**Order of trust:** official NASA, ESA, ISRO and other agency pages first; then peer-reviewed papers; then official tool documentation and repositories; then reputable news; other teams' repositories are used only as competitive intelligence.

**Access limits.** The Space Apps website blocks automated readers, so its pages (challenge statement, FAQ, rules, judging guide) were read only through search-engine excerpts. The full 2026 challenge statements were released today, 28 October, and I could not read the full text of yours. Section 2 marks exactly what was recovered and from where; Section 16 lists what you should check by hand.

**Quotations.** Sources are paraphrased and linked rather than copied, so open the link for exact wording.

## 2. The challenge, decoded

The challenge asks for one layered, integrated view of a single place or route on Mars, built from several NASA science missions, that helps a human explorer plan and carry out a Marswalk and do new science on the way. It is a decision tool for an astronaut first; a game, a 3D walk or a voice assistant are ways to deliver it, not the goal.

### 2.1 What was recovered, and from where

The [official challenge page](https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/) could not be opened by my tools (the site disallows automated access). Full challenge statements, including NASA's dataset lists, were scheduled for release on 28 October 2026 ([Astrobiology.com, reposting NASA SMD](https://astrobiology.com/2026/09/04/registration-is-now-open-for-the-2026-nasa-space-apps-challenge/)).

| Element | What it says (paraphrased) | Source | Status |
| --- | --- | --- | --- |
| Title | Interplanetary Survival Guide: Martian Map | [Official URL](https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/) | VERIFIED |
| Summary | Build a layered, integrated view of a location or route on the Martian surface that combines data from multiple NASA science missions, to help a human explorer plan and carry out a successful Marswalk while doing new science along the way | Quoted identically by independent teams: [Jarin4649](https://github.com/Jarin4649/Jarin-s-Project-Mars.), [Team Protikriti](https://github.com/AhsanulHoque22/Nasa-Space-Apps-Challenge-2026-Team-Protikriti) | SECONDARY, consistent |
| Difficulty | Intermediate | [Team Code Huzzlers repo](https://github.com/RISHI-1453/NASA_Space-Apps_Challenge_Martian_Map); described as one of the more accessible 2026 challenges by [The Recursive](https://therecursive.com/nasa-space-apps-challenge-2026-where-to-join-it-in-cee) | SECONDARY |
| Subject tags | Human Exploration, Mars, Software | [Team Protikriti repo](https://github.com/AhsanulHoque22/Nasa-Space-Apps-Challenge-2026-Team-Protikriti) | SECONDARY |
| Three needs | Route and destinations; current conditions; science along the way | [Mars Traverse repo](https://github.com/lkorth/mars-traverse) | SECONDARY |
| Framing | NASA's science chief describes the 2026 challenges together as building the ultimate interplanetary survival guide for astronauts on the Moon and Mars | [NASA Science, 15 Oct 2026](https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/) | VERIFIED |
| Mars focus | Several 2026 challenges involve operational concepts for Martian surface activities and integrating data from multiple Mars missions | [NASA Science, 15 Oct 2026](https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/) | VERIFIED |
| Listed resources and partner agencies | Not recovered | Official page only | UNVERIFIED: paste the page text to me and I will reconcile Section 5 against it |

The 2026 edition has 14 challenges under the theme "The Next Frontier" ([The Recursive](https://therecursive.com/nasa-space-apps-challenge-2026-where-to-join-it-in-cee)). Neighbouring 2026 challenges include an astronaut-health app, a game where children manage a lunar or Martian base, and a search for Earth analogue sites (same source), so stay clearly on the map-and-Marswalk brief to avoid drifting into theirs.

### 2.2 Plain-language meaning

- **One place or one route, not the whole planet.** Depth at a single site beats a shallow planet-wide viewer.
- **Layered and integrated.** Layers must combine into answers (for example slope + light + ice + dust into a route cost), not just toggle on and off.
- **Multiple NASA science missions.** Orbiters such as MGS, MRO, Odyssey and rovers such as Curiosity and Perseverance should visibly feed the result.
- **A human explorer.** The user is an astronaut in a pressure suit with limited oxygen, power, time and visibility, minutes of light-time away from Earth.
- **Plan and carry out.** Two modes: planning before the walk, and support during it (where am I, what is around me, can I still get home).
- **New science along the way.** The route should be shaped by what is worth studying, not only by what is safe.
- **"Survival guide".** Hazards, margins and contingencies must be explicit.

### 2.3 Implied expectations (RECOMMENDATION)

- Real data with provenance, units and uncertainty, because judges score scientific validity (Section 3).
- A clear safety logic, such as a walk-back constraint, rather than a vague "safe" label.
- A defensible choice of site, ideally a NASA-studied human landing Exploration Zone or a well-mapped rover site.
- Honesty about limits: orbital data cannot see small rocks; climate data are statistics, not forecasts.

### 2.4 Subjects your team must understand

| Subject | Why it matters here |
| --- | --- |
| Mars coordinates and geodesy (IAU Mars 2000/2015, planetocentric east longitude, areoid) | Every layer must line up on the same grid. |
| Raster terrain processing (DEM, slope, roughness, hillshade) | Route safety starts with slope from elevation models. |
| Orbital instruments (MOLA, HiRISE, CTX, CRISM, THEMIS, SHARAD) | Each answers a different survival or science question. |
| Mars environment (pressure, temperature, dust, seasons by Ls, radiation) | Drives "current conditions" and hazards. |
| EVA physiology and suit limits | Sets walking speed, metabolic cost and consumable budgets. |
| Path planning (A\*, cost surfaces, multi-objective trade-offs) | The core algorithm of a Marswalk planner. |
| Mars time (sols, local solar time, Mars24 algorithm) | Sun angle, shadows, daylight windows. |
| Communications delay and relay geometry | Why the explorer needs on-board decision support. |
| Web 3D (3D Tiles, terrain LOD, WebGL) | Delivering the walkable, real-terrain view in a browser. |
| Grounded AI (retrieval, tool calling, speech) | Making the voice assistant accurate rather than plausible. |

## 3. What winning looks like

Space Apps scores five equally weighted criteria, and in 2025 only 45 of 1,294 Global Nominees became Global Finalists, so the project must be scientifically defensible and beautifully presented at the same time ([DevStory recap](https://blog.devstory.co.kr/en/post/nasa-space-app-challenge/index.html)).

### 3.1 Judging criteria

The most recent published Judging and Awards Guide lists Influence, Creativity, Validity, Relevance and Presentation, and reminds teams that presentation counts as much as the other four ([Judging & Awards Guide](https://spaceappschallenge.org/resources/judging-awards-guide)). The 2026 edition of the guide is due on 13 November ([Internshala listing of official dates](https://internshala.com/competitions/nasa-international-space-apps-challenge-2026-registration/)); re-check it that day.

| Criterion | What judges ask (paraphrased from past guides) | How this project scores (RECOMMENDATION) |
| --- | --- | --- |
| Influence | How big a problem, and how many people does it help? | Frame it as the planning tool NASA's first Mars crews and today's students both need. |
| Creativity | Is it new, or an increment on existing tools? | Differentiate from the many map-plus-route entries (3.4). |
| Validity | Is it scientifically valid and would it work in the real world? | Real data, cited numbers, provenance badges, a validation test against a real rover traverse. |
| Relevance | Does it answer the challenge? Complete? Usable? | Stay on one site, the Marswalk, conditions and science. |
| Presentation | Is the story of challenge, solution and importance clear? | A 30-second film that shows one Marswalk end to end. |

Older guides spell out Validity and Relevance this way ([2020 team page quoting the guide](https://2020.spaceappschallenge.org/challenges/create/create-mascot/teams/curious-explorers/stream); [2019 Northeastern page](https://2019.spaceappschallenge.org/locations/northeastern-university/)).

### 3.2 Rules and submission requirements

| Rule | Detail | Status |
| --- | --- | --- |
| Dates | Hackathon 14–15 November 2026; submissions open 14 Nov, 09:00 local; global judging starts 16 Nov | VERIFIED ([NASA Science](https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/), [Astrobiology.com](https://astrobiology.com/2026/09/04/registration-is-now-open-for-the-2026-nasa-space-apps-challenge/), [Internshala](https://internshala.com/competitions/nasa-international-space-apps-challenge-2026-registration/)) |
| No early work | The current Participant FAQ says teams may not begin working on the challenges before the hackathon; older FAQs asked everyone to start the actual work when the event begins | VERIFIED via search excerpt of the [Participant FAQs](https://www.spaceappschallenge.org/resources/participant-faqs/) and the [2022 FAQ](https://legacy.spaceappschallenge.org/resources/faq/) |
| Demo | A 30-second video or up to 7 slides, hosted publicly outside the Space Apps site; video needs English subtitles, slides in English | VERIFIED via excerpt of the [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) |
| AI use | AI tools are allowed but must be disclosed; generated content may not use or alter NASA branding; AI-generated images and videos need a visible AI watermark | VERIFIED via excerpt of the [Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/) |
| Citations | Every source must be cited, even open-source or free material | VERIFIED via excerpt of the [2026 Terms and Conditions](https://www.spaceappschallenge.org/legal/) |
| Team | Up to six people, all registered and listed on the project page | SECONDARY ([stoicsatvik prep repo](https://github.com/stoicsatvik/martian)) |
| Eligibility | Must answer an official challenge; "create your own" entries are not eligible for global judging | VERIFIED for 2024 ([Judging & Awards Guide](https://spaceappschallenge.org/resources/judging-awards-guide)) |

What this means for you: use the next two weeks to learn tools, read data documentation and rehearse, but write the project code and build its data pipeline only from 14 November (RECOMMENDATION). Ask your Bengaluru local lead to confirm this in writing.

### 3.3 Awards and what past winners did

There are 10 Global Awards: Best Use of Science, Best Use of Data, Best Use of Technology, Galactic Impact, Best Mission Concept, Most Inspirational, Best Storytelling, Global Connection, Art & Technology and Local Impact ([2025 Awards page](https://www.spaceappschallenge.org/2025/awards/)). The 2025 winners were chosen from 11,511 projects by 114,094 registrants at 551 events ([Wikipedia summary of official numbers](https://en.wikipedia.org/wiki/NASA_International_Space_Apps_Challenge)).

| 2025 winner | Award | What it did | Lesson for you |
| --- | --- | --- | --- |
| [SpaceGenes+](https://news.sciencex.in/nasa-announces-2025-international-space-apps-challenge-global-winners) | Best Use of Science | Interactive dashboard showing how radiation and microgravity together affect astronaut biology | A specific user (mission planners) and one sharp scientific question |
| [PureFlow](https://news.sciencex.in/nasa-announces-2025-international-space-apps-challenge-global-winners) | Best Mission Concept | Design and 3D-model a habitat, then test it against real space-weather threats | Test your plans against real hazard scenarios |
| Twisters ([SkySense description](https://www.spaceappschallenge.org/2025/meet-the-2025-global-winners/)) | Best Use of Technology | Blended several NASA weather datasets into probabilities for planning outdoor activities | "Conditions for an outing" framed as probabilities is a proven winner, very close to a Marswalk |
| [Astro Sweepers](https://www.spaceappschallenge.org/2025/meet-the-2025-global-winners/) | Galactic Impact | A sustainability score for satellites from orbital-debris data | One memorable number that summarises complex data |
| [Photonics Odyssey](https://www.socialnews.xyz/2025/12/18/indian-teams-satellite-internet-concept-wins-nasas-2025-space-apps-challenge/amp/) (Chennai) | Most Inspirational | Satellite internet reimagined as public infrastructure | Indian teams can and do win |

The other 2025 winners were Resonant Exoplanets, HerCode Space, Gaia+LEO, Zumorroda-X and QUEÑARIS ([DevStory recap](https://blog.devstory.co.kr/en/post/nasa-space-app-challenge/index.html)). The last Mars-themed global winner was Mars 3D Home, Best Mission Concept in 2022 ([Wikipedia](https://en.wikipedia.org/wiki/NASA_International_Space_Apps_Challenge)).

### 3.4 The competition is already visible

At least eight public GitHub repositories already target this exact challenge, several with working demos. They set the floor you must clear.

| Repository | What it already has | Implication |
| --- | --- | --- |
| [Team Protikriti, Martian Map](https://github.com/AhsanulHoque22/Nasa-Space-Apps-Challenge-2026-Team-Protikriti) | CesiumJS globe, Street View stitched from Navcam images, walkable terrain in Mars gravity, A\* EVA planner with GO/NO-GO, live REMS weather, 182 tests | Walking, weather and slope routing are now table stakes |
| [Mars Traverse](https://github.com/lkorth/mars-traverse) | Exploration Zones, five traveller types, live rover positions from MMGIS, Mars24 lighting, VR/AR route preview | Even WebXR has been done |
| [MARSWAY](https://github.com/ahsanur-official/Interplanetary-Survival-Guide-Martian-Map) | Three Pareto routes (fast, science, safe) with "why this route" explanations and provenance badges | Explainable trade-offs are expected |
| [MarsNav](https://github.com/Aryan221224/MarsNav) | Landing-site selection plus EVA navigation, 55-page user guide | Documentation depth is high |
| [MarsPath](https://github.com/25243060-creator/martian-map-route-planner), [Martialoy](https://github.com/Aluchashi/Martialoy), [Code Huzzlers](https://github.com/RISHI-1453/NASA_Space-Apps_Challenge_Martian_Map), [NeuroNexus](https://github.com/kmmohaimenulhaque-code/neuronexus-mars-survival) | A\* on HiRISE slope, energy ledgers, O2 budgets, AI interpreter | Many teams will ship similar planners |

How to beat them (RECOMMENDATION): do what none of them does well. Ground every number in a cited model, close the loop between the map and a live, grounded voice assistant that speaks with a realistic communication delay, validate the planner against a real rover traverse, and tell one story so clearly that a judge understands it in 30 seconds. Sections 11 and 12 turn this into a design.

### 3.5 The Mars tools that already exist, and how this project goes beyond all of them

Agencies and universities have already built excellent Mars tools, but each does one thing. None combines data, history, presence and human planning in one place, which is the gap this project fills.

| Existing tool | What it does well | What a Marswalk scientist still lacks | Source |
| --- | --- | --- | --- |
| NASA Mars Trek | Planet-wide layers and open tile services | Walking, time of day and season, hazard budgets, a planner | Section 5.1 |
| NASA's Eyes on the Solar System | Runs in a browser and shows more than 150 missions at their real positions | Surface analysis and planning | [NASA](https://science.nasa.gov/eyes/) |
| Explore with Perseverance | A 3D landscape built from Perseverance's own images plus HiRISE | Other rovers and agencies, conditions, planning | [JPL](https://www.jpl.nasa.gov/news/take-a-3d-spin-on-mars-and-track-nasas-perseverance-rover/) |
| Access Mars (Google with JPL, 2017) | Browser VR built from Curiosity photos at three sites | Data layers, time, other missions | [Google](https://blog.google/products/google-ar-vr/helping-nasa-and-jpl-bring-surface-mars-your-browser/) |
| JMARS (Arizona State University) | Scientist-grade desktop GIS with most Mars layers | Immersion and human-mission planning | Section 5.2 |
| MMGIS and NASA's location maps | Mission-grade maps of rover and helicopter paths, open source | Immersion, other agencies, human limits | [NASA](https://science.nasa.gov/open-science/mars-mapping-open-source) |
| PDS Analyst's Notebook | The sol-by-sol record of rover operations | Visual, walkable context | [PDS](https://an.rsl.wustl.edu/) |
| OpenSpace | Cinematic, open-source (MIT) universe used in museums, with HiRISE-to-ground browsing | A desktop application (the project lists Windows and Linux); not a planner | [OpenSpace](https://openspaceproject.com/about/about.html) |
| CosmoScout VR (DLR) | Physically based planetary atmospheres, MIT licence | Builds on Linux and Windows; not a planner | [GitHub](https://github.com/cosmoscout/cosmoscout-vr) |
| Esri OnMars and ArcGIS | GIS analysis on Mars services in the Mars 2000 frame | Mars scenes cannot use dynamic, vector-tile or scene layers and show daylight incorrectly | [ArcGIS](https://developers.arcgis.com/javascript/latest/sample-code/mars/index.html) |
| Other 2026 entries | Walking, A\* routes, weather | See Section 3.4 | Section 3.4 |

**The one-place promise (RECOMMENDATION).** Bring together:

- Trek-level data layers
- Eyes-level positions of everything
- Access-Mars-level presence, on real terrain at real sites
- Analyst's-Notebook-level history, replayable sol by sol (Section 7)
- A physically based sky in the CosmoScout style (Section 9)
- Data from every agency, not just NASA (Section 6)

Then add what none of the tools has: a human Marswalk planner with hard safety budgets, and a voice that answers only from cited data and talks to Mission Control across the real radio delay. That combination is the one a working scientist or mission planner would want open on one screen.

## 4. Mars, the complete environment, with real numbers

A Marswalk is bounded by thin cold air, radiation, dust, terrain, suit consumables, daylight and a radio delay of 4 to 24 minutes each way, so every number your app shows should come from the sources below.

### 4.1 The planet in numbers (VERIFIED)

| Quantity | Value | Source |
| --- | --- | --- |
| Mean radius | 3,389.5 km (equatorial 3,396.2 km) | [NASA NSSDC Mars Fact Sheet](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html?embed=true) |
| Surface gravity | 3.73 m/s² mean, 0.38 of Earth | NSSDC |
| Surface pressure | 6.36 mbar at mean radius, 4.0 to 8.7 mbar by season (Earth: about 1,013 mbar) | NSSDC |
| Atmosphere | 95.1% CO₂, 2.59% N₂, 1.94% Ar, 0.16% O₂ | NSSDC |
| Air density, scale height | about 0.016 kg/m³; 11.0 km | NSSDC |
| Temperature | about -153 °C to +20 °C; average about -59 °C; Viking 1 daily range -89 to -31 °C | [NASA Mars Facts](https://science.nasa.gov/mars/facts/), NSSDC |
| Winds (Viking sites) | 2–7 m/s summer, 17–30 m/s in dust storms | NSSDC |
| Sunlight | 586 W/m² at the top of the atmosphere, 43% of Earth's | NSSDC |
| Day and year | Sol = 24.66 h; year = 687 Earth days (669.6 sols) | NSSDC, [NASA Mars Facts](https://science.nasa.gov/mars/facts/) |
| Seasons | Northern spring 194 sols, summer 178, autumn 142, winter 154 | [NASA Mars Facts](https://science.nasa.gov/mars/facts/) |
| Distance from Earth | 54.6 to 401.4 million km | NSSDC |

### 4.2 Hazards, measured

NASA groups the dangers of human spaceflight into five hazards: radiation, isolation and confinement, distance from Earth, gravity fields, and hostile or closed environments ([NASA Human Research Program](https://www.nasa.gov/hrp/hazards)). On the surface, those translate into the following.

| Hazard | Real numbers | What it means for a Marswalk | Source |
| --- | --- | --- | --- |
| Radiation | 0.64 ± 0.12 mSv/day on the surface at Gale Crater; 1.84 mSv/day during cruise. A 180-day trip out, 500 days on Mars and 180 days back totals about 1.01 Sv | The round trip alone exceeds NASA's 600 mSv career limit; a solar particle event must stay under 250 mSv. Show a running dose budget | [DLR summary of RAD results](https://elib.dlr.de/106090), [Space.com on Hassler et al. 2014](https://space.com/23875-mars-radiation-life-manned-mission.html), [NASA OCHMO technical brief](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf) |
| Thin CO₂ air | 6.36 mbar, 95% CO₂ | Pressure suit always; no breathable air; sound barely carries | NSSDC |
| Cold | -153 to +20 °C; at the equator at noon the ground can feel like 24 °C while air at head height is 0 °C | Thermal limits on EVA timing; plan walks around midday | [NASA Mars Facts](https://science.nasa.gov/mars/facts/) |
| Dust storms | Planet-encircling storms in 1971, 1977, 1982, 1994, 2001, 2007 and 2018; the 2018 storm ended the solar-powered Opportunity rover | Avoid the southern spring–summer storm season for long walks; solar power can fail for weeks | [NASA, 10 things about the 2018 storm](https://solarsystem.nasa.gov/news/469/10-things-massive-dust-storm-on-mars), [Wikipedia summary](https://en.wikipedia.org/wiki/2018_Mars_global_dust_storm) |
| Fine dust on suits | Perseverance measured particles under 2.5 µm and around 100 nm clinging to spacesuit materials over 1,645 sols (published 27 Oct 2026) | Fine dust is the hardest to remove and can reach the lungs; plan dust-off and airlock procedures | [NASA, 26 Oct 2026](https://www.nasa.gov/missions/mars-2020-perseverance/nasas-perseverance-offers-clues-to-protect-crews-from-mars-dust/) |
| Dust exposure limit | NASA's new limit: under 0.1 mg/m³ of dust smaller than 10 µm, 24-hour average, for exposures up to 30 days | A real number your habitat "dust meter" can show | [NASA, Martian dust limit](https://www.nasa.gov/general/establishing-crew-exposure-limits-of-martian-dust/) |
| Toxic soil | Perchlorate at roughly 0.5 to 1% of soil; disrupts thyroid function | Never bring regolith inside; label sample-handling risk | [Space.com](https://www.space.com/21554-mars-toxic-perchlorate-chemicals.html), [NASA dust article](https://www.nasa.gov/missions/mars-2020-perseverance/nasas-perseverance-offers-clues-to-protect-crews-from-mars-dust/) |
| Low gravity | 0.38 g | Different gait, longer jumps, bone and muscle loss over months | NSSDC, [NASA HRP](https://www.nasa.gov/hrp/hazards) |
| Distance | Radio delay of 4 to 24 minutes one way; every two years a solar conjunction pauses commands for about two weeks | Mission control cannot help in real time; the crew needs on-board decision support | [NASA analog blog](https://blogs.nasa.gov/analogsfieldtesting/?p=654), [NASA on conjunction](https://www.nasa.gov/solar-system/planets/mars/nasas-mars-fleet-will-still-conduct-science-while-lying-low) |
| Suit limits | NASA's exploration suit supports EVAs up to 8 hours (6 ± 2 h); early Artemis walks stay within 2 km of the lander | Use these as default walk limits, and say they are lunar-derived | [NASA EVA ConOps 2020](https://ntrs.nasa.gov/api/citations/20200001071/downloads/20200001071.pdf) |
| Walk-back | Apollo planning sized return distance from remaining life support at 3.3 km/h; NASA later tested a 10 km suited walk-back | The core safety rule your planner should enforce | [Apollo 17 traverse planning paper](https://www.nasa.gov/wp-content/uploads/static/history/alsj/19790073512_1979073512.pdf), [Walkback Test](https://core.ac.uk/works/15254764) |
| Sound | Sound travels at about 240 m/s below 240 Hz and 250 m/s above; high-pitched sound fades within about 8 m | Crew cannot hear hazards; all talk is by radio | [CNRS](https://www.cnrs.fr/en/perseverance-records-first-ever-sounds-mars), [DLR via Adlershof](https://adlershof.de/en/news/the-sound-of-mars) |

### 4.3 Water ice and landing sites

- NASA's 2015 workshop discussed 47 candidate Exploration Zones, each a set of Regions of Interest within about 100 km of a central landing site, limited to ±50° latitude and below +2 km elevation ([NTRS 20170002903](https://ntrs.nasa.gov/api/citations/20170002903/downloads/20170002903.pdf), [NTRS 20160002370](https://ntrs.nasa.gov/api/citations/20160002370/downloads/20160002370.pdf)).
- The SWIM project combines radar, thermal, neutron, altimetry and image data into ice-consistency maps; Arcadia Planitia and Deuteronilus Mensae match the most criteria for shallow buried ice ([USGS record of Morgan et al. 2021](https://www.usgs.gov/publications/availability-subsurface-water-ice-resources-northern-mid-latitudes-mars)).

### 4.4 Time, seasons and light

- Mars solar time, sol numbers and season (solar longitude, Ls) follow the Allison and McEwen (2000) algorithm used in NASA GISS's Mars24 ([GISS credits](https://www.giss.nasa.gov/tools/mars24/help/credits.html), [paper on NTRS](https://ntrs.nasa.gov/api/citations/20000097895/downloads/20000097895.pdf)). The open-source `marstime` Python package implements it ([docs](https://marstime.readthedocs.io/en/latest/marstime.html)).
- Global dust storms occur in southern spring and summer, when Mars is closest to the Sun ([Universe Today](https://www.universetoday.com/articles/the-global-dust-storm-that-ended-opportunity-helped-teach-us-how-mars-lost-its-water)).

### 4.5 Getting there and landing

- Earth–Mars launch windows open about every 26 months; the current one runs from November to December 2026, the very weeks of the hackathon ([19FortyFive](https://www.19fortyfive.com/2026/08/the-mars-launch-window-opens-in-november-2026-and-closes-about-a-month-later-the-next-one-is-in-2029/), [NASA mission design webinar](https://ntrs.nasa.gov/api/citations/20130010385/downloads/20130010385.pdf)).
- NASA's twin ESCAPADE orbiters, launched 13 November 2025, are due to fire their trans-Mars injection burn in November 2026 and arrive in September 2027 ([NASA ESCAPADE blog](https://science.nasa.gov/blogs/escapade/2025/11), [NASA Mars Facts](https://science.nasa.gov/mars/facts/)).
- SpaceX's planned uncrewed Starships for this window were deprioritised in favour of the Moon, according to a February 2026 report (SECONDARY: [Space Daily](https://spacedaily.com/d-five-uncrewed-starship-rockets-are-projected-to-launch-toward-mars-during-the-brief-window-in-late-2026-when-the-two-planets-align-for-the-closest-possible-journey-and-depending-on-whether-t/)).
- Perseverance hit the atmosphere at about 19,500 km/h, opened a 21.5 m parachute about 240 s later at about 11 km altitude and 1,512 km/h, and used Terrain-Relative Navigation between 4.2 and 2.2 km altitude to shift touchdown by up to 600 m ([JPL landing press kit](https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission)).
- Only 12 of 19 attempted robotic Mars landings had succeeded when NASA wrote its 2024 EDL white paper ([NASA, Mars EDL challenges](https://www.nasa.gov/wp-content/uploads/2024/12/acr24-mars-edl-challenges.pdf?emrc=d99c3e)).

### 4.6 Where Mars is during the hackathon (computed)

During the hackathon it is early northern spring on Mars in Mars Year 39. That is outside the dust-storm season, and Earth shines as an evening star over Gale Crater. I computed the table below with the Mars24 algorithm (Allison and McEwen 2000, as used by NASA GISS), reimplemented in Python ([GISS](https://www.giss.nasa.gov/tools/mars24/help/credits.html), [paper](https://ntrs.nasa.gov/api/citations/20000097895/downloads/20000097895.pdf)). Two independent checks support it: the code puts the start of each Mars Year on 26 December 2022, 12 November 2024 and 30 September 2026, exactly the dates The Planetary Society lists for Mars Years 37, 38 and 39 ([Planetary Society](https://www.planetary.org/articles/mars-calendar)), and it puts Perseverance's touchdown (20:43:49 UTC spacecraft time) at about 3:53 p.m. local mean solar time.

| Quantity (COMPUTED) | 14 Nov 2026 | 15 Nov 2026 |
| --- | --- | --- |
| Mars Year and season | MY 39, Ls 21.8°: northern spring, southern autumn | Ls 22.3° |
| Sun–Mars distance | 1.608 AU, moving out towards aphelion | 1.609 AU |
| Sunlight at the top of the atmosphere | about 526 W/m² (NSSDC's 586.2 W/m² mean, scaled by distance) | about 526 W/m² |
| Sun overhead at latitude | 9.2° N | 9.4° N |
| Size of the Sun in the sky | 0.33° across, about 62% of its size seen from Earth | same |
| Gale, Bradbury Landing (4.59° S, 137.44° E) | Sunrise 06:03 and sunset 17:57 local true solar time; 12.2 Earth hours of daylight; the Sun rises at 08:17 UTC (13:47 IST) | Sunrise 08:56 UTC (14:26 IST) |
| Jezero, Octavia E. Butler Landing (18.44° N, 77.45° E) | Sunrise 05:48, sunset 18:12 local true solar time; 12.75 Earth hours of daylight; sunrise at 12:08 UTC (17:38 IST) | Sunrise 12:47 UTC (18:17 IST) |
| Rover sol numbers | Curiosity sol 5074; Perseverance sol 2039 | Curiosity 5075; Perseverance 2040 |
| Earth seen from Mars | 37.9° east of the Sun: an evening star after sunset | about the same |
| One-way radio delay | 11.00 minutes | 10.91 minutes |

- Mars Years are counted from Mars Year 1, which began on 11 April 1955, a convention proposed by Clancy and co-authors in 2000 ([Planetary Society](https://www.planetary.org/articles/mars-calendar); [Piqueux et al. 2015, USGS record](https://pubs.usgs.gov/publication/70139666)). Ls is the Sun's position along Mars's orbit: 0° is the northern spring equinox, 90° the summer solstice, 180° the autumn equinox and 270° the winter solstice (same source).
- The French LMD team runs a free converter between Mars dates and Earth dates ([LMD](https://www-mars.lmd.jussieu.fr/mars/time/mars_date_to_earth_date.html)); use it to check the app's clock.
- Curiosity once photographed Earth and the Moon as the brightest point in the Martian night sky, about 80 minutes after sunset on sol 529 ([JPL](https://www.jpl.nasa.gov/news/nasa-mars-rover-curiosity-sees-evening-star-earth/)). During the hackathon the geometry repeats, so a "look for home" moment in the app is both real and timely.
- Sol numbers assume sol 0 is the landing sol at each rover's site longitude. Check them against the rovers' raw-image feeds before showing them (ASSUMPTION).

All values come from my scripts (Mars24 for season and Sun; JPL Keplerian elements for distance and delay). Treat them as accurate to a few minutes and a few tenths of a degree, which is enough for an exploration app. They are not flight-ops grade.

### 4.7 Inside Mars: crust, mantle, core, quakes, impacts and magnetism

NASA's InSight lander (landed 26 November 2018, retired December 2022) gave the first seismic picture of the planet's interior.

| Feature | What is known | Source |
| --- | --- | --- |
| Marsquakes | 1,319 detected over the mission; the largest, on 4 May 2022 (sol 1,222), was estimated at magnitude 5. France's CNES provided the SEIS seismometer | [EarthSky](https://earthsky.org/space/insight-falls-silent-nasa-declares-mission-end/) (SECONDARY) for the total; [NASA](https://www.nasa.gov/missions/insight/nasas-insight-records-monster-quake-on-mars) for the largest |
| Kinds of events | The catalogue to sol 1,011 holds 951 marsquakes at regional and far distances, plus 1,062 very short events most likely caused by local thermal stresses | [ETH Zurich Research Collection](https://www.research-collection.ethz.ch/entities/publication/3e5bcf11-d70f-4148-8277-fa84ba324c1f) |
| Crust | About 20 km or just under 40 km thick at InSight; 24 to 72 km on average across the planet (Knapmeyer-Endrun et al. 2021, [doi:10.1126/science.abf8966](https://doi.org/10.1126/science.abf8966)) | [DLR](https://www.dlr.de/en/latest/news/2021/03/20210722_the-red-planet-has-a-larger-core-and-a-thinner-crust) |
| Mantle | Just over 1,500 km thick, olivine-rich ([doi:10.1126/science.abf2966](https://doi.org/10.1126/science.abf2966)) | DLR |
| Core | First estimated at about 1,830 ± 40 km radius (Stähler et al. 2021, [doi:10.1126/science.abi7730](https://doi.org/10.1126/science.abi7730)); revised in 2023 to about 1,650 ± 20 km, with a molten silicate layer above it (Samuel et al. 2023, [doi:10.1038/s41586-023-06601-8](https://doi.org/10.1038/s41586-023-06601-8)) | [Royal Observatory of Belgium](https://www.astro.oma.be/en/a-molten-layer-at-the-base-of-the-martian-mantle/) |
| Deep water | InSight data suggest liquid water in the mid-crust, 11.5 to 20 km below the lander; if the site is typical, more water than the hypothesised ancient oceans (Wright, Morzfeld and Manga, PNAS, 12 August 2024) | [UC Berkeley](https://eps.berkeley.edu/news/eps-professor-michael-manga-contributes-groundbreaking-discovery-subsurface-liquid-water-mars) |
| Fresh impacts | A meteoroid strike on 24 December 2021 caused a magnitude 4 quake and dug a crater about 150 m wide and 21 m deep, throwing out boulder-sized blocks of water ice closer to the equator than buried ice had ever been seen | [NASA](https://www.nasa.gov/missions/insight/nasas-insight-lander-detects-stunning-meteoroid-impact-on-mars) |
| Magnetism | No global magnetic field today, because the core dynamo stopped; the ancient southern highlands keep magnetised bands about 100 miles wide and up to 600 miles long, the longest over 1,200 miles | [NASA Mars Global Surveyor, 1999](https://mgs-mager.gsfc.nasa.gov/press/release_1999-56.html) |

What it means for the app (RECOMMENDATION): quakes are a science layer, not a major walking hazard. The missing magnetic field is the real story, because it is why radiation and solar storms reach the surface (Sections 4.2 and 4.14). A "listen to Mars" stop can play InSight's sonified quakes beside the epicentre direction.

### 4.8 The surface: geography, lakes, a possible ocean, and the ground underfoot

| Feature | Numbers | Source |
| --- | --- | --- |
| Olympus Mons | 26 km above the surrounding plain; Everest is only a third as high | [ESA](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars) |
| Tharsis bulge | 10 km high and 4,000 km wide | ESA |
| Valles Marineris | 4,000 km long, up to 600 km wide and 7 km deep, about a fifth of the way round the planet | ESA |
| Hellas basin | 2,300 km across and more than 9 km deep | ESA |
| North–south divide | The northern lowlands are on average 6 km lower than the southern highlands | ESA |
| Gale's ancient lake | Curiosity found a habitable lake: near-neutral pH, low salinity, iron and sulfur in several oxidation states that microbes could use for energy, lasting at least hundreds to tens of thousands of years (Grotzinger et al.) | [NTRS 20150008374](https://ntrs.nasa.gov/citations/20150008374) |
| Jezero's delta | Jezero held a lake tens of metres deep about 3.6 billion years ago across its \~35 km floor; tilted delta layers and later flood boulders over 1 m across (Mangold et al., Science, 7 October 2021) | [CNRS](https://cnrs.fr/en/node/6157) |
| A possible ocean shore | Zhurong's ground-penetrating radar found sand layers about 10 m down that dip about 15°, like beach deposits, read as the shore of an ancient ocean (Liu et al., PNAS, February 2025). Still debated | [Astrobiology.com](https://astrobiology.com/2025/03/ancient-beaches-testify-to-a-long-ago-ocean-on-mars.html) (SECONDARY) |
| Organic molecules | Curiosity found organic fragments, about 10 ppm or more of organic carbon, in 3-billion-year-old lake mudstones in the top 5 cm of rock; organics can form without life | [JPL](https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars) |
| Dust and soil | Fine dust under 2.5 µm and around 100 nm clings to suit materials; perchlorate makes up roughly 0.5–1% of soil (Section 4.2) | Section 4.2 |

For geology layers, use the USGS global map (SIM 3292) and the Jezero map (SIM 3464) in Section 5.2.

### 4.9 The atmosphere: thin, cold, oxidising, leaking to space, and glowing

- **Thin and seasonal.** The Martian air is more than a hundred times lighter than Earth's, with surface pressure like Earth's air about 35 km up. Each winter so much CO₂ freezes at the poles that surface pressure drops by as much as 30% ([ESA](https://sci.esa.int/web/home/-/30215-the-martian-atmosphere)); Curiosity measured the same yearly swing of about 30% at Gale ([NASA](https://science.nasa.gov/photojournal/seasonal-pressure-curve-peaks-at-gale-crater)).
- **No ozone shield.** The atmosphere is highly oxidising, and with no ozone layer ultraviolet light reaches the ground (ESA, same page).
- **The methane puzzle.** Curiosity sees low methane that peaks every summer, and a record 21 ppbv on 19 June 2019. Two days later ESA's Trace Gas Orbiter set an upper limit of 0.07 ppbv, and Mars Express saw none ([ESA](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ESA_s_Mars_orbiters_did_not_see_latest_Curiosity_methane_burst), [JPL](https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars)).
- **The oxygen puzzle.** Oxygen above Gale rises by as much as 30% in spring and summer, then falls back; no known chemistry explains it ([NASA SVS](https://svs.gsfc.nasa.gov/13784/)).
- **Leaking to space.** MAVEN measured the solar wind stripping about 100 g of gas per second, faster during solar storms ([AGU](https://news.agu.org/press-release/maven-mission-reveals-speed-of-solar-wind-stripping-martian-atmosphere/)); about 65% of the argon ever in the atmosphere has been lost to space (Jakosky et al., Science, 2017; [LASP](https://lasp.colorado.edu/maven/2017/03/30/maven-reveals-most-of-mars-atmosphere-was-lost-to-space/)).
- **Auroras of four kinds.** ESA's SPICAM found a new type of aurora tied to magnetised crust ([ESA](https://sci.esa.int/web/mars-express/-/37525-discovery-of-an-aurora-on-mars)); the UAE's Hope found a "sinuous discrete aurora" spanning half the planet's diameter, published 5 May 2022 ([Live Science](https://livescience.com/mars-sinuous-discrete-aurora), SECONDARY); MAVEN saw nightside aurora over the whole planet from 14 to 20 May 2024 ([NASA](https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/)); and after a March 2024 solar storm Perseverance recorded the first visible-light aurora from any planet's surface, green at 557.7 nm, which astronauts would probably be able to see ([JPL](https://www.jpl.nasa.gov/news/nasa-observes-first-visible-light-auroras-at-mars/)).
- **Flying in it.** Ingenuity proved flight in air less than 1% as dense as Earth's: 72 flights, 128.8 minutes aloft, 17.0 km covered, up to 24.0 m high, last flight on 18 January 2024 ([NASA](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/)).

Composition and density are in Section 4.1.

### 4.10 Weather and climate, landing site by landing site

Eight surface missions have carried weather stations, and five of their weather stations were built outside NASA (Spain, Canada, China). Together they give the measured ranges an honest conditions panel should show.

| Site and years | Station (who built it) | What it measured, in numbers | Source |
| --- | --- | --- | --- |
| Viking 1 and 2, 1976–1982 | Viking meteorology (NASA) | Viking 1 daily air range about −89 to −31 °C; winds 2–7 m/s in summer, 17–30 m/s in dust storms; the yearly swing of daily-mean temperature is about 60 K at Viking 2 and 30 K at Viking 1 | [NSSDC](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html?embed=true); [Martínez et al. 2017](https://link.springer.com/10.1007/s11214-017-0360-x) |
| All long-lived sites | Pressure sensors | Pressure peaks in late southern spring near Ls 260° and bottoms near Ls 150°, as CO₂ freezes onto and sublimes off the poles | Martínez et al. 2017 |
| Phoenix, 2008, 68° N | MET station with lidar (Canadian Space Agency) | Temperatures at 250, 500 and 1,000 mm above the deck, pressure, and a lidar that watched ice crystals fall from clouds like snow on sol 99 | [Open Government Canada dataset](https://open.canada.ca/data/en/dataset/0e338f52-25e4-465c-8104-bb9d7c8d3df3) (26 May–28 Oct 2008, Open Government Licence – Canada); [JPL](https://www.jpl.nasa.gov/images/pia11200-lidar-measurements-of-snow-falling-from-martian-clouds/) |
| Curiosity, Gale, 2012– | REMS (Spain's Centro de Astrobiología) | Yearly swing of daily-mean temperature about 20 K; relative humidity reaches about 70% at night in early winter (Ls ≈ 93°) but stays under 5% between 10:00 and 18:00; pressure swings about 30% a year | Martínez et al. 2017; [NASA](https://science.nasa.gov/photojournal/seasonal-pressure-curve-peaks-at-gale-crater); [CAB](https://cab.inta-csic.es/en/?p=29215) |
| InSight, Elysium Planitia, 2018–2022 (4.50° N, 135.62° E, −2,614 m) | TWINS wind and temperature (Spain) plus pressure | Near-continuous record from 10 December 2018 (Ls 304°, Mars Year 34) for over a Mars year; early reports: highs never above −9 °C, lows to −95 °C, gusts to 17 m/s | [Forget et al. 2022](https://oro.open.ac.uk/86958); [Space.com](https://www.space.com/mars-weather-reports-from-insight-lander.html) (SECONDARY) |
| Perseverance, Jezero, 2021– | MEDA (Spain) | First 250 sols: daily-mean pressure from 735 Pa up to 761 Pa, then down to 650 Pa; afternoon mean winds about 7 m/s, midday gusts to 25 m/s, calm from 04:00 to 06:00; diurnal temperature tide of 26 K; dust devils 5–135 m across spinning at 4–24 m/s, the most found by any surface mission | [Rodriguez-Manfredi et al. 2023, Nature Geoscience](https://link.springer.com/article/10.1038/s41561-022-01084-0) |
| Zhurong, southern Utopia Planitia, 2021–2022 | Mars Climate Station (China) | Lowest air temperature about −55 °C, top wind 16.7 m/s; winds blew close to due south from the northern summer solstice, then turned south-east; data from 176 of 325 sols | [Jiang et al. 2023, Scientific Reports](https://doi.org/10.1038/s41598-023-30513-2), [DOAJ record](https://doaj.org/article/f3c95d17c7f84f95bb67b6f0bb2ee2a5); [Space.com](https://space.com/china-mars-zhurong-rover-wind-changes) (SECONDARY) |

How to use it (RECOMMENDATION): show each site's measured range beside the Mars Climate Database estimate for the chosen place, season and hour. Use the measured ranges for realism and the model for everywhere else, and label which is which. Spain's CAB has built the weather stations on three NASA landers (REMS, TWINS, MEDA), so Spain's science agency belongs in the credits.

### 4.11 Dust storms, dust devils, clouds, frost and snow

- **Dust storms.** Planet-wide storms struck in 1971, 1977, 1982, 1994, 2001, 2007 and 2018 and come in southern spring and summer (Sections 4.2 and 4.4). China's Zhurong went into hibernation on 20 May 2022 as a dust storm arrived and never woke, most likely because dust covered its solar panels ([Universe Today](https://www.universetoday.com/161136/china-finally-tells-us-whats-going-on-with-its-mars-rover), SECONDARY).
- **Dust devils.** On 30 August 2023 Perseverance filmed a dust devil about 60 m wide and an estimated 2 km tall, moving at about 19 km/h some 4 km away; dust devils are one of the ways dust moves around Mars ([JPL](https://www.jpl.nasa.gov/news/nasas-perseverance-captures-dust-filled-martian-whirlwind)).
- **Clouds.** Curiosity photographed a feather-shaped iridescent cloud just after sunset on 27 January 2023, during a campaign to study night-shining clouds; a January 2025 campaign filmed red- and green-tinged clouds drifting overhead ([NASA](https://www.nasa.gov/image-article/a-rainbow-colored-feather-in-the-martian-sky)).
- **Snow.** Phoenix's Canadian lidar saw ice crystals falling from a cloud base on sol 99, 3 September 2008 ([JPL](https://www.jpl.nasa.gov/images/pia11200-lidar-measurements-of-snow-falling-from-martian-clouds/)).
- **Frost on volcano tops.** Water frost forms overnight and in the early morning in the summit caldera of Olympus Mons, about 20 km up; it was seen independently by CaSSIS and NOMAD on ESA's Trace Gas Orbiter and by HRSC on Mars Express, in an image taken at 7:20 a.m. local time (Valantinas et al., Nature Geoscience, 10 June 2024) ([Royal Observatory of Belgium](https://www.astro.oma.be/en/first-evidence-of-water-frost-on-the-tallest-volcanoes-of-mars/)).
- **Humidity.** At Gale, relative humidity climbs to about 70% on early-winter nights and stays under 5% by day (Martínez et al. 2017, above).

For the app (RECOMMENDATION): a dust devil crossing the planned route, a cloud deck at dusk, morning frost at altitude and a storm warning are all real events with real numbers behind them. Each one can be a scripted moment in the demo, labelled with its source.

### 4.12 Ice, water and the polar caps, past and present

| Where | What is there | Source |
| --- | --- | --- |
| Ground ice at high latitudes | Mars Odyssey found an ice-rich layer about 60 cm down at 60° S and within 30 cm at 75° S, 20–50% ice by mass (over 50% by volume) | [NASA release via NSSDC, 2002](https://nssdc.gsfc.nasa.gov/planetary/text/mo2001_pr_20020528.txt) |
| Ice cliffs | HiRISE scarps at about 56.6° S expose about 80 m of water ice, a potential resource for crews | [NASA](https://science.nasa.gov/photojournal/underground-martian-ice-deposit-exposed-at-scarp/) |
| Near-equator ice | Ice blocks thrown out by the December 2021 impact (Section 4.7) | [NASA](https://www.nasa.gov/missions/insight/nasas-insight-lander-detects-stunning-meteoroid-impact-on-mars) |
| Valles Marineris | The FREND neutron telescope (Russia's IKI, on ESA's Trace Gas Orbiter) found hydrogen consistent with up to about 40% water in the top metre over an area the size of the Netherlands in Candor Chaos (Mitrofanov et al., Icarus 2021) | [ESA](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ExoMars_discovers_hidden_water_in_Mars_Grand_Canyon) |
| South polar layered deposits | MARSIS radar (Italy and NASA, on Mars Express) measured about 1.6 million km³ of ice, a global layer about 11 m thick if melted (Plaut et al., Science, 2007) | [ESA](https://sci.esa.int/web/mars-express/-/41029-plaut-j-et-al-2007) |
| Buried CO₂ ice | MRO's radar found about 12,000 km³ of buried CO₂ ice holding up to 80% as much CO₂ as today's atmosphere; total atmospheric mass may change several-fold over 100,000 years or less | [ScienceDaily, NASA release 2011](https://www.sciencedaily.com/releases/2011/04/110421190450.htm) |
| Seasonal cap jets | CO₂ gas jets burst through translucent slab ice in the southern seasonal cap (Kieffer et al., Nature 2006) | [USGS record](https://pubs.usgs.gov/publication/70028279) |
| Dark streaks (RSL) | Seasonal streaks on slopes steeper than about 27° are now read as dry granular flows, not running water; Mars today is very dry | [JPL](https://www.jpl.nasa.gov/news/recurring-martian-streaks-flowing-sand-not-water/) |
| Deep groundwater | Possible liquid water 11.5–20 km down (Section 4.7) | [UC Berkeley](https://eps.berkeley.edu/news/eps-professor-michael-manga-contributes-groundbreaking-discovery-subsurface-liquid-water-mars) |
| Northern mid-latitudes | SWIM's ice-consistency maps (Section 4.3) | Section 4.3 |

For a Marswalk, the practical water story is ice within a metre or two of the surface at mid-to-high latitudes. Gale has the best terrain and weather data but little near-surface ice. Make that trade-off explicit in the app (RECOMMENDATION).

### 4.13 Habitability and the search for life

- **Once habitable, for certain.** Gale's ancient lake had near-neutral water, low salinity and chemical energy that microbes could have used (Section 4.8, [NTRS](https://ntrs.nasa.gov/citations/20150008374)).
- **Organic matter preserved.** Curiosity found ancient organic molecules in 3-billion-year-old mudstones; NASA stresses that organics can form without life ([JPL](https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars)).
- **The strongest hint so far.** In July 2024 Perseverance found "leopard spots" in a rock called Cheyava Falls in Jezero's Bright Angel formation, containing the iron minerals vivianite and greigite; NASA announced the potential biosignature on 10 September 2025 with a paper in Nature, adding that non-biological explanations cannot be ruled out. The rover's sample from that rock is called Sapphire Canyon ([JPL](https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/)).
- **Gases that do not add up.** The methane and oxygen puzzles (Section 4.9) keep the question of present-day activity open.
- **Next missions.** China's Tianwen-3 aims to drill up to 2 m, launch around 2028 and return samples around 2031, with eight candidate landing areas short-listed ([CAS, 8 September 2026](https://english.casad.cas.cn/newsroom/ma/202609/t20260908_1192779.html)). ESA's Rosalind Franklin rover is covered in Section 6.
- **Planetary protection.** Even dry streak sites may need special procedures to avoid carrying Earth microbes there ([JPL](https://www.jpl.nasa.gov/news/recurring-martian-streaks-flowing-sand-not-water/)). In the app, mark such places as special regions that a crew should not walk into without a protocol (RECOMMENDATION).

For the app (RECOMMENDATION): make "science along the way" concrete. Each route can visit a real unit of the same kind as these discoveries (lake mudstone, delta front, sulfate layers), with the discovery's paper one tap away.

### 4.14 Space weather: solar storms, radiation events and UV

- **Why it matters on Mars.** Without a global magnetic field (Section 4.7), a solar storm reaches the whole planet. From 14 to 20 May 2024 MAVEN saw aurora across the entire night side ([NASA](https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/)).
- **The biggest dose spike measured on the surface.** In the 20 May 2024 event (an X12 flare), an astronaut standing beside Curiosity would have received about 8,100 micrograys, roughly 30 chest X-rays. That is not deadly, but it was the largest surge RAD had seen in 12 years. RAD's principal investigator notes that cliffs or lava tubes would add shielding (same NASA page).
- **Forecasts exist.** NASA's Moon to Mars Space Weather Analysis Office analyses solar eruptions in real time, and teams issue Mars Space Weather Alert Notifications to operating missions. That alert system is how Perseverance's visible-aurora observation was timed ([JPL](https://www.jpl.nasa.gov/news/nasa-observes-first-visible-light-auroras-at-mars/)).
- **Measured in orbit too.** The Liulin-MO dosimeter, from Bulgaria's Space Research and Technology Institute with Russia's IKI, sits inside FREND on ESA's Trace Gas Orbiter and records dose rate and particle flux every minute (Semkova et al. 2018, Icarus) ([Bulgarian Academy of Sciences](https://esa-pro.space.bas.bg/node/82)).
- **Ultraviolet.** With no ozone layer, ultraviolet light reaches the surface ([ESA](https://sci.esa.int/web/home/-/30215-the-martian-atmosphere)); Curiosity's REMS carries a UV sensor ([Martínez et al. 2017](https://link.springer.com/10.1007/s11214-017-0360-x)).
- **Background dose.** 0.64 mSv per day on the surface and 1.84 mSv per day in cruise (Section 4.2).

For the app (RECOMMENDATION): a "solar storm" scenario based on the real May 2024 numbers. A shelter-seeking rule (reach a cliff overhang or the habitat) becomes part of the walk-back logic. NASA's DONKI space-weather database at the Community Coordinated Modeling Center can supply real event histories ([CCMC](https://ccmc.gsfc.nasa.gov/tools/DONKI/); UNVERIFIED: page found but not read).

### 4.15 Phobos, Deimos, Earth and the sky above Mars

- **Phobos** orbits only about 6,000 km above the surface and circles Mars three times a day. It is spiralling inward by about 1.8 m per century and within 50 million years will crash or break into a ring. Its crater Stickney is about 10 km wide. **Deimos** takes about 30 hours per orbit. Asaph Hall discovered both in August 1877 ([NASA](https://science.nasa.gov/mars/moons/facts)).
- **Japan's MMX is on its way.** It launched at 04:41:03 JST on 20 October 2026 on H3 flight 10 from Tanegashima ([JAXA](https://global.jaxa.jp/press/2026/10/20261020-1_e.html)). It reaches Mars next summer, will collect at least 10 g of Phobos in two landings, observe Deimos, and return its capsule to Australia in 2031 ([MMX site](https://www.mmx.jaxa.jp/en/)). ESA supplied its deep-space communication equipment and Estrack ground-station support ([ESA](https://www.esa.int/ESA_Multimedia/Images/2026/10/MMX_lifts_off_to_Mars_s_moon_Phobos)).
- **Deimos up close.** The UAE's Hope took the highest-resolution images of Deimos to date ([Gulf News, 17 February 2026](https://gulfnews.com/amp/story/uae%2Fuae-extends-emirates-mars-mission-to-2028-as-hope-probe-marks-five-years-1.500445958)).
- **The Sun** looks about 0.33° across during the hackathon, 62% of its size from Earth, and gives about 526 W/m² above the atmosphere (COMPUTED, Section 4.6).
- **Sunsets are blue.** Fine dust lets blue light through more efficiently, most strongly near sunset, as Curiosity's Mastcam recorded on sol 956, 15 April 2015 ([NASA](https://science.nasa.gov/photojournal/sunset-in-mars-gale-crater/)).
- **Earth is a star.** Curiosity photographed Earth and the Moon as the brightest point in the night sky ([JPL](https://www.jpl.nasa.gov/news/nasa-mars-rover-curiosity-sees-evening-star-earth/)); on 14 November 2026 Earth sits 37.9° east of the Sun, an evening star (COMPUTED, Section 4.6).
- **Night lights.** The green visible aurora and iridescent twilight clouds (Sections 4.9 and 4.11) are real sky events to render.

## 5. Ranked resource catalogue

Twelve resources carry almost the whole project: Cesium Mars for the 3D world, NASA Trek and USGS rasters for layers, HiRISE terrain for walk safety, MMGIS traverses for validation, raw rover images for ground truth, SWIM for ice, the Mars Climate Database for conditions, Mars24 for time and light, JPL Horizons for distance and delay, and RAD plus NASA standards for radiation.

**How they are ranked (RECOMMENDATION).** Score = relevance to a Marswalk decision × ease of use inside 48 hours × credibility of the source. Tier S = build on it; Tier A = strong addition; Tier B = partner-agency data that adds breadth; Tier C = pipeline tools and references. Ease: Easy = usable in an hour with a URL or key; Medium = some processing; Hard = expert tooling.

### 5.1 Tier S: build on these

| # | Resource | What it is | Why it matters | Ease | How you would use it |
| --- | --- | --- | --- | --- | --- |
| 1 | [Cesium Mars](https://cesium.com/platform/cesium-ion/content/cesium-mars/) ([launch post](https://cesium.com/blog/2025/09/03/lift-off-to-cesium-mars/)) | Global Mars 3D Tiles (200 m terrain, 232 m colour) plus Gale Crater at 1 m terrain and 25 cm imagery and Jezero at 20 m terrain and 6 m imagery, in the IAU\_2015:49901 frame | A real, walkable Mars in a browser with almost no pipeline work; also works in Unreal and Unity | Easy (free Cesium ion account; check its terms and attribution) | Base globe and the walkable site; CesiumJS 1.133 added a built-in Mars ellipsoid ([Cesium release roundup](https://community.cesium.com/t/cesium-release-roundup/14210?page=3)) |
| 2 | [NASA Mars Trek WMTS](https://api.nasa.gov/mars-wmts/catalog) | Tile services behind NASA's Mars Trek portal: mosaics, colour hillshades and other layers, no key needed ([third-party summary of the endpoints](https://www.withone.ai/knowledge/nasa/conn_mod_def%3A%3AGMkvi4bYJIA%3A%3ATp9sKbaITguCZ2w69T5HDQ)) | Dozens of ready layers from many missions, which directly answers "multiple missions" | Easy | Toggleable map layers over the Cesium globe |
| 3 | [HiRISE DTMs and orthoimages](https://stac.astrogeology.usgs.gov/docs/data/mars/hirise_dtms/) ([HiRISE DTM notes](https://www.uahirise.org/dtm/about.php)) | Stereo terrain models at 1–2 m post spacing with orthoimages near 25 cm, searchable through the USGS STAC catalogue | The only data fine enough to judge slopes for a walking astronaut | Medium | Slope, roughness and line-of-sight for the chosen site; check the shaded relief for known artefacts first |
| 4 | [MOLA–HRSC blended DEM, 200 m](https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m) | Global elevation from NASA's MGS laser altimeter and ESA's Mars Express stereo camera (11 GB GeoTIFF; MOLA CC0, HRSC CC BY-SA 3.0 IGO) | Planet-wide context, horizons and the elevation input to a radiation model | Easy to stream via Cesium; Medium to process yourself | Regional terrain, horizon and sunrise times, elevation-based dose scaling |
| 5 | [Murray Lab global CTX mosaic](https://murray-lab.caltech.edu/CTX/) ([USGS record](https://astrogeology.usgs.gov/search/map/mars-mro-ctx-global-mosaic-murray-lab-v1)) | 5 m/pixel mosaic covering 99.5% of Mars, with seam maps tracing every pixel to its source image | Fills the gaps between HiRISE strips at outcrop scale | Medium (4°×4° tiles) | Site imagery around the walk; seam maps prove provenance |
| 6 | [NASA MMGIS](https://github.com/NASA-AMMOS/MMGIS) and its [public Mars maps](https://mars.nasa.gov/mmgis-maps/) | JPL's open-source mission mapping system and the rover traverse and waypoint layers it serves | Real Perseverance and Curiosity drives to test your planner against | Easy to read the layers; Medium to self-host | Replay a real drive and score the route planner against it |
| 7 | Rover raw-image feeds for [Mars 2020](https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020,ingenuity&feedtype=json&ver=1.2&latest=true) and MSL (endpoints as listed in [mars\_raw\_utils](https://docs.rs/mars_raw_utils/latest/src/mars_raw_utils/constants.rs.html)) | JSON feeds of every raw rover image with sol, camera and position metadata | Ground-truth photos at stops along the route | Easy, but undocumented: UNVERIFIED stability | "What is it like here?" photo cards at science stops |
| 8 | [SWIM ice maps](https://swim.psi.edu) ([USGS paper record](https://www.usgs.gov/publications/availability-subsurface-water-ice-resources-northern-mid-latitudes-mars)) | Multi-dataset ice-consistency maps for the northern mid-latitudes | Water is the top survival resource; NASA-funded and peer-reviewed | Medium | Resource layer and a site-selection criterion |
| 9 | [Mars Climate Database v6.1](https://www-mars.lmd.jussieu.fr/mcd_python) ([access terms](https://www-mars.lmd.jussieu.fr/mars/access.html)) | Climate model statistics: temperature, pressure, winds, dust by season, time and place; full version free on request, no commercial use | The honest way to show "conditions" anywhere: as typical ranges, not forecasts | Easy (web) / Medium (full) | Conditions panel with ranges and a dust-storm scenario |
| 10 | Mars24 algorithm ([GISS](https://www.giss.nasa.gov/tools/mars24/help/credits.html)) and [`marstime`](https://marstime.readthedocs.io/en/latest/marstime.html) | Mars local solar time, sol date, season and sun position | Real lighting, shadows, daylight budget and season | Easy | Sun position for the 3D scene; sunrise and sunset per site |
| 11 | [JPL Horizons API](https://ssd-api.jpl.nasa.gov/doc/horizons.html) and [approximate planetary elements](https://ssd.jpl.nasa.gov/planets/approx_pos.html) | Precise ephemerides by API, or a 12-number formula good to about 25,000 km for Mars | Earth–Mars distance, radio delay and journey trajectories | Easy | Live radio-delay clock and the journey prologue |
| 12 | Radiation rates ([RAD via DLR](https://elib.dlr.de/106090)) and limits ([NASA OCHMO brief](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf)) | Measured surface and cruise dose rates and NASA's career and event limits | Turns radiation into a real budget | Easy | Dose meter and mission dose ledger |

### 5.2 Tier A: strong additions

| Resource | What it is | How you would use it | Ease |
| --- | --- | --- | --- |
| [PDS Orbital Data Explorer + REST API](https://ode.rsl.wustl.edu/mars/pagehelp/Content/Additional_Resources/ODE_REST_API.htm) | Search 37.6 million orbital products (2.57 PB) from NASA PDS, ESA PSA and JAXA ([ODE 2026 abstract](https://pds-geosciences.wustl.edu/workshops/PSCW2026/PSCW_ODE_2026.pdf)) | Find CRISM, THEMIS, SHARAD and HiRISE products over your site | Medium |
| [USGS SIM 3464, Jezero geologic map](https://www.usgs.gov/maps/geologic-map-jezero-crater-and-nili-planum-region-mars) and [SIM 3292, global geologic map](https://www.usgs.gov/media/112477) | Mapped geologic units (public domain) | Science stops at unit contacts | Medium |
| [THEMIS IR day and night mosaics, 100 m](https://www.openspaceproject.com/s/Data-Set-Guide-for-Mars.pdf) (links to the USGS products) | Thermal infrared views from Mars Odyssey | Rock versus dust (thermal inertia proxy), night-time contrast | Easy via Trek |
| [Exploration Zone map](https://ntrs.nasa.gov/api/citations/20160002370/downloads/20160002370.pdf) (NASA, cites the zone map) | The 47 candidate human landing zones from 2015 | Choose a human-relevant site and show its Regions of Interest | Easy |
| [NASA Trajectory Browser](https://trajbrowser.arc.nasa.gov) ([user guide](https://trajbrowser.arc.nasa.gov/user_guide.php)) | NASA Ames tool for launch dates, flight times and Δv | Cross-check your own journey numbers | Easy |
| [hapsira](https://hapsira.readthedocs.io/) (maintained fork of the archived poliastro) | Python astrodynamics: Lambert solvers, transfers, plots | Porkchop plots for the journey prologue | Medium |
| [3DTilesRendererJS](https://github.com/NASA-AMMOS/3DTilesRendererJS) | JPL-originated 3D Tiles renderer for three.js, with Mars examples (Dingo Gap, Cesium ion Mars) | Alternative to CesiumJS if you want three.js effects and physics | Medium |
| [NASA 3D Resources](https://github.com/nasa/NASA-3D-Resources) ([Perseverance model](https://science.nasa.gov/resource/mars-perseverance-rover-3d-model/)) | Free NASA spacecraft and rover models | Rover and lander models in the scene | Easy |
| [Sounds of Mars](https://science.nasa.gov/resource/nasas-perseverance-rover-microphone-captures-sounds-from-mars/) | Real Perseverance microphone recordings (NASA media guidelines apply) | Ambient wind and rover sound | Easy |
| [JMARS](https://jmars.asu.edu/node/2844) (Arizona State University) | Free desktop GIS with most Mars layers, including the CTX mosaic and the 200 m DEM | Pre-hackathon exploration of your candidate site | Easy |

### 5.3 Tier B: partner-agency data for breadth (every agency in depth: Section 6)

| Agency, mission | Data | Access | Use |
| --- | --- | --- | --- |
| ESA, Mars Express HRSC | Stereo terrain inside the blended DEM; more through ODE and ESA's PSA | Through items 4 and ODE | Credit ESA in your layer list |
| ISRO, Mars Orbiter Mission | Mars Colour Camera images and other payloads via ISSDC; 2,200+ registered users had downloaded about 630 GB by 2018 ([ISRO](https://new1.isro.gov.in/MOM%20released.html), [archive](https://mrbrowse.issdc.gov.in/MOMLTA/)) | Free registration | An "India's view of Mars" context layer; strong local storytelling |
| UAE, Emirates Mars Mission (Hope) | Whole-planet atmosphere data from EXI, EMIRS and EMUS; 3.3 TB released by the ninth batch ([Satellite Pro ME](https://satelliteprome.com/news/hope-probe-reveals-new-observations-about-the-martian-atmosphere/)) | Science Data Centre ([UAE Space Agency](https://space.gov.ae/en/media-center/news/15/2/2023/hope-probe-uncovers-new-scientific-observations-in-its-sixth-batch-of-scientific-data)) | Daily dust and cloud context for "conditions" |
| CNSA, Tianwen-1 | Global true-colour map at 76 m/pixel from MoRIC ([dataset record](https://b2find.eudat.eu/dataset/54d7a117-ae0c-568b-9715-d186447e6317)) | China's Lunar and Planetary Data System; HiPS copy at CDS | Alternative colour basemap |

### 5.4 Tier C: pipeline tools

| Tool | Use | Note |
| --- | --- | --- |
| GDAL / rasterio | Reproject, clip and derive slope from DEMs | Standard; Mars CRS codes are in the IAU\_2015 authority |
| [`npt`](https://pypi.org/project/npt/) | Query ODE for HiRISE, CTX and HRSC products from Python | Small helper |
| [MarsSI](https://marssi.univ-lyon1.fr/wiki/HiRISE) | On-demand HiRISE and CTX processing, including DEMs | Not needed in 48 hours; useful later |
| USGS ISIS and NASA Ames Stereo Pipeline | Make your own DEMs | Expert tools; skip for the hackathon |

### 5.5 Papers and documents to cite in the app (full list by topic: Section 17)

- Hassler et al. 2014, Mars surface radiation ([NTRS record](https://ntrs.nasa.gov/citations/20180007641)).
- Morgan et al. 2021, SWIM ice availability ([USGS record](https://pubs.usgs.gov/publication/70226786)).
- Maurice et al. 2022, sound on Mars ([CNRS summary](https://www.cnrs.fr/en/perseverance-records-first-ever-sounds-mars)).
- Allison and McEwen 2000, Mars solar time ([NTRS PDF](https://ntrs.nasa.gov/api/citations/20000097895/downloads/20000097895.pdf)).
- NASA Exploration EVA Concept of Operations 2020 ([NTRS PDF](https://ntrs.nasa.gov/api/citations/20200001071/downloads/20200001071.pdf)).
- NASA Martian dust exposure limit, 2026 ([NASA](https://www.nasa.gov/general/establishing-crew-exposure-limits-of-martian-dust/)).
- Mars 2020 trajectory reconstruction ([NTRS 20230006978](https://ntrs.nasa.gov/citations/20230006978)).

Past projects for this exact challenge are listed in Section 3.4; study them for ideas, not code, because the rules require original work during the event.

## 6. Every space agency's Mars missions, instruments and open data

Space Apps 2026 is hosted by 17 international space agencies ([CSA](https://www.asc-csa.gc.ca/eng/events/2026/2026-11-14-space-apps-challenge.asp)); the official list could not be opened (Section 2.1). For Mars, at least 17 agencies and national institutes have flown missions or instruments whose results you can use. No other approach to this challenge that I found draws on all of them. The table gives each agency's Mars work, its open data and the job it does in your app. Section 7 turns every lander and rover into replayable history. Status is as of 28 October 2026.

| Agency | Mars missions and instruments | Open data, and how to get it | Job in your app |
| --- | --- | --- | --- |
| **NASA** (USA) | Orbiters MGS, Odyssey, MRO, MAVEN; landers and rovers Viking 1 and 2, Pathfinder and Sojourner, Spirit, Opportunity, Phoenix, Curiosity, InSight, Perseverance and Ingenuity; the ESCAPADE twin orbiters now heading out (Section 4.5) | Planetary Data System; Mars Trek; MMGIS; the PDS Analyst's Notebook for rover activity sol by sol ([PDS Geosciences](https://an.rsl.wustl.edu/)); raw-image feeds; NAIF SPICE archives for spacecraft and rover positions ([Mars 2020 SPICE archive](https://naif.jpl.nasa.gov/pub/naif/pds/pds4/mars2020/mars2020_spice/document/spiceds_v003.html)) | The backbone: terrain, imagery, traverses, weather, radiation (Section 5) |
| **ESA** (Europe) | Mars Express (HRSC, MARSIS, SPICAM, the VMC "Mars webcam"); the ExoMars Trace Gas Orbiter with Roscosmos (CaSSIS, NOMAD, FREND); the Rosalind Franklin rover, being rebuilt for launch in 2028 and landing in 2030, with a drill that reaches about 2 m; NASA supplies the launcher, landing engines and rover heater units ([ESA FAQ](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/FAQ_The_rebirth_of_ESA_s_ExoMars_Rosalind_Franklin_mission)) | Planetary Science Archive: CaSSIS raw data go public after six months ([ESA](https://www.cosmos.esa.int/web/psa/exomars2016)); calibrated NOMAD data download without an account ([NOMAD team](https://nomad.aeronomie.be/data-psa-users)); over 19,000 VMC images on Flickr under CC BY-SA 3.0 IGO ([ESA](https://sci.esa.int/web/mars-express/-/57864-mars-webcam-goes-pro)) | Whole-disc views of clouds and dust for the orbit view; frost on volcanoes; deep-space tracking (ESA's Estrack supports MMX) |
| **DLR** (Germany) | HRSC stereo camera science, with Freie Universität Berlin ([FU Berlin HRSC pages](https://planet.geo.fu-berlin.de/eng/projects/mars/hrsc005-DarkSpot.php), SECONDARY); InSight interior results ([DLR](https://www.dlr.de/en/latest/news/2021/03/20210722_the-red-planet-has-a-larger-core-and-a-thinner-crust)) | HRSC terrain inside the MOLA–HRSC 200 m DEM (CC BY-SA 3.0 IGO, Section 5.1); CosmoScout VR, DLR's open-source solar-system viewer with a physically based atmosphere renderer ([GitHub](https://github.com/cosmoscout/cosmoscout-vr), MIT licence) | Planet-wide terrain; the Martian sky model (Section 9) |
| **CNES** (France) | SEIS seismometer on InSight ([NASA](https://www.nasa.gov/missions/insight/nasas-insight-records-monster-quake-on-mars)); the French-American SuperCam on Perseverance ([CNRS](https://cnrs.fr/en/node/6157)), whose microphone made the first recordings of Martian sound ([CNRS](https://www.cnrs.fr/en/perseverance-records-first-ever-sounds-mars)); France's LMD builds the Mars Climate Database ([LMD](https://www-mars.lmd.jussieu.fr/mars/access.html)) | Mars Climate Database (free; full version on request); marsquake catalogue | Quakes, real sound, modelled climate anywhere |
| **ASI** (Italy) | MARSIS radar on Mars Express; SHARAD radar on MRO, developed under ASI's responsibility and built by Thales Alenia Space Italia ([SHARAD overview](https://en.wikipedia.org/wiki/SHARAD), SECONDARY) | Radar products through ESA's PSA and NASA's PDS | Subsurface ice: MARSIS sized the south polar ice; MRO's radar found buried CO₂ ice (Section 4.12) |
| **ISRO** (India) | Mars Orbiter Mission: launched 5 November 2013, reached orbit on its first attempt on 24 September 2014, designed for six months and still working four years later, with 980+ Mars Colour Camera images ([ISRO](https://www.isro.gov.in/Mars%20Orbiter%20Mission.html)); contact lost in 2022 ([Space.com](https://www.space.com/india-mars-orbiter-mission-loses-contact), SECONDARY); Mangalyaan-2 aims for India's first Mars soft landing in 2030, says ISRO Chairman V. Narayanan ([India TV](https://www.indiatvnews.com/science/isro-confirms-mangalyaan-2-mission-india-to-attempt-first-mars-landing-in-2030-2025-11-06-1016099)) | ISSDC long-term archive and the PRADAN portal, free registration ([PRADAN](https://pradan.issdc.gov.in/); usage figures in Section 5.3) | An "India's view of Mars" layer from Mars Colour Camera full-disc images; the local-impact story for a Bengaluru team |
| **CNSA** (China) | Tianwen-1, launched July 2020: orbiter plus the Zhurong rover, which drove about 2,000 m in southern Utopia Planitia ([CAS](https://english.casad.cas.cn/newsroom/ma/202609/t20260908_1192779.html)) and has been silent since hibernating on 20 May 2022 ([Universe Today](https://www.universetoday.com/161136/china-finally-tells-us-whats-going-on-with-its-mars-rover), SECONDARY); Tianwen-3 sample return around 2028, samples home around 2031 (CAS) | Global colour map at 76 m from 14,757 MoRIC images over 284 orbits ([Astrobiology.com](https://astrobiology.com/2024/08/global-color-image-dataset-and-map-of-mars-by-tianwen-1.html), [dataset record](https://b2find.eudat.eu/dataset/54d7a117-ae0c-568b-9715-d186447e6317)); Zhurong weather and radar papers (Sections 4.8 and 4.10) | A second true-colour basemap; a non-NASA traverse to replay; the beach-deposit stop |
| **UAE** (MBRSC and UAE Space Agency) | Hope: launched 19 July 2020, in orbit since 9 February 2021; EXI and EMUS built by LASP, EMIRS by Arizona State University ([LASP](https://lasp.colorado.edu/missions/emm-hope/)); extended to 2028, with 10 TB released in 16 batches, new aurora types and the sharpest images of Deimos ([Gulf News](https://gulfnews.com/amp/story/uae%2Fuae-extends-emirates-mars-mission-to-2028-as-hope-probe-marks-five-years-1.500445958)) | Science Data Centre at sdc.emiratesmarsmission.ae (LASP) | Whole-planet weather by time of day, dust and ice clouds, aurora, Deimos |
| **JAXA** (Japan) | MMX, launched 20 October 2026 to Phobos; at least 10 g of sample, home in 2031; its instrument list includes MEGANE gamma-ray and neutron spectrometers, a rover and the SHV camera ([JAXA](https://global.jaxa.jp/press/2026/10/20261020-1_e.html), [MMX](https://www.mmx.jaxa.jp/en/)) | Data still to come; mission pages | Phobos as a destination and a news hook in launch week |
| **Roscosmos and IKI** (Russia) | Partner in ESA's Trace Gas Orbiter; FREND neutron telescope, PI Igor Mitrofanov of IKI ([ESA](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ExoMars_discovers_hidden_water_in_Mars_Grand_Canyon)); the DAN neutron instrument on Curiosity, contributed by Russia's Federal Space Agency ([PDS](https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/dan.html)); the Soviet Mars 3 made the first landing, on 2 December 1971, but fell silent about 20 seconds after it began transmitting ([Guinness World Records](https://www.guinnessworldrecords.com/world-records/103439-first-spacecraft-to-reach-the-surface-of-mars), SECONDARY) | DAN records in PDS (msl-m-dan-3\_4-rdr-v1); FREND water map (Mitrofanov et al. 2021) | Hidden water under Curiosity's real route; the Valles Marineris water spot |
| **CSA** (Canada) | Phoenix's MET weather station and lidar ([Open Government Canada](https://open.canada.ca/data/en/dataset/0e338f52-25e4-465c-8104-bb9d7c8d3df3)); Curiosity's APXS rock analyser, built by Canada's MDA and designed at the University of Guelph ([CBC](https://www.cbc.ca/news/science/mars-bound-rock-analyzer-a-new-step-for-canada-in-space-1.1007601), SECONDARY) | Phoenix MET CSV, Open Government Licence – Canada | Polar weather and the "snow on Mars" moment |
| **Spain** (INTA-CSIC Centro de Astrobiología) | REMS on Curiosity, TWINS on InSight, MEDA on Perseverance ([CAB](https://cab.inta-csic.es/en/?p=29215)) | Weather records in NASA's Planetary Data System | Measured temperature, wind, pressure, humidity, UV |
| **Switzerland** (University of Bern, ETH Zurich) | CaSSIS colour and stereo camera on the Trace Gas Orbiter ([University of Bern](https://jahresbericht2019.unibe.ch/key_areas/matter_and_the_universe/cassis/index_eng.html), SECONDARY); ETH's marsquake catalogue ([ETH](https://www.research-collection.ethz.ch/entities/publication/3e5bcf11-d70f-4148-8277-fa84ba324c1f)) | CaSSIS in ESA's PSA | Colour close-ups; quakes |
| **Belgium** (BIRA-IASB, Royal Observatory of Belgium) | NOMAD spectrometer on the Trace Gas Orbiter ([NOMAD](https://nomad.aeronomie.be/data-psa-users)); Martian core and frost studies ([ROB](https://www.astro.oma.be/en/first-evidence-of-water-frost-on-the-tallest-volcanoes-of-mars/)) | Calibrated NOMAD data in ESA's PSA | Water vapour and trace gases |
| **Bulgaria** (Space Research and Technology Institute, BAS) | Liulin-MO dosimeter inside FREND ([BAS](https://esa-pro.space.bas.bg/node/82)) | Data files plus Semkova et al. 2018 | Radiation in Mars orbit |
| **Finland** (Finnish Meteorological Institute) | Pressure observations from Perseverance's MEDA ([research.fi dataset](https://research.fi/en/results/dataset/03bfae7b-acf6-4fd7-889a-fa046cf17211), SECONDARY) | Dataset record | Pressure measurements |
| **United Kingdom** | Beagle 2, the UK-led lander carried by Mars Express, landed on 25 December 2003 and was found partially deployed by HiRISE in 2015 ([ESA](https://sci.esa.int/web/mars-express/-/55263-beagle-2-lander-found-on-mars)); UK industry is building Rosalind Franklin ([UCL](https://www.ucl.ac.uk/mathematical-physical-sciences/news/2025/apr/uk-firm-land-mars-rover-ucl-built-eyes), SECONDARY) | HiRISE images of the site | A landing site for the "every lander" map |

**What changed in 2026, and why judges will notice.** In 2026 MMX launched (20 October), Hope was extended to 2028 (February), China began building a Tianwen-3 prototype (September), and NASA set a new limit for Martian dust exposure (October, Section 4.2). ESCAPADE fires its burn towards Mars this November (Section 4.5). News reports in October 2026 also say Perseverance overtook Opportunity's off-world driving record ([TimesLIVE](https://www.timeslive.co.za/news/sci-tech/2026-10-13-nasas-perseverance-rover-breaks-off-planet-driving-record-on-mars/); see Section 7).

**How to use them all (RECOMMENDATION).** Give every agency at least one visible job in the app and one line in an on-screen credits panel. "Data from multiple missions" then becomes "data from every agency that has been to Mars", a claim no competing entry makes.

## 7. Every rover, lander and flight, relived

The feature that sets this project apart is a time machine for Mars exploration (RECOMMENDATION). Pick any surface mission and any sol, and the app flies from orbit to the site. It puts the vehicle where it really stood, shows that sol's real photos, weather and sounds, and lets you walk around the scene. The data to do this exist for most missions, from several agencies.

### 7.1 The surface missions you can replay

| Mission (agency) | Landed | Where (coordinates as published) | Highlights you can relive | Source |
| --- | --- | --- | --- | --- |
| Mars 3 (USSR) | 2 December 1971 | 45° S, 158° W | First landing; it transmitted for only about 20 seconds | [Guinness World Records](https://www.guinnessworldrecords.com/world-records/103439-first-spacecraft-to-reach-the-surface-of-mars) (SECONDARY); coordinates from [The Planetary Society](https://www.planetary.org/space-images/mars_landing_site_map_lakdawalla) (SECONDARY) |
| Viking 1 (NASA) | 20 July 1976 | Chryse Planitia, 22.48° N, 49.97° W | Worked until 13 November 1982; daily air range −89 to −31 °C | [NSSDC record, University of Washington copy](https://atmos.uw.edu/~mars/viking/mission/viking-williams-nssdc-revised.html); [NSSDC](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html?embed=true) |
| Viking 2 (NASA) | 3 September 1976 | Utopia Planitia, 47.97° N, 225.74° W | Communications ended 11 April 1980 | [NSSDC record, University of Washington copy](https://atmos.uw.edu/~mars/viking/mission/viking-williams-nssdc-revised.html) |
| Pathfinder and Sojourner (NASA) | 4 July 1997 | Ares Vallis, 19.33° N, 33.55° W | Sojourner, the first rover on Mars; final data on 27 September 1997; ASI/MET weather record | [NASA](https://science.nasa.gov/mission/mars-pathfinder); coordinates from The Planetary Society (SECONDARY) |
| Beagle 2 (UK, on ESA's Mars Express) | 25 December 2003 | Planned site 10.6° N, 270° W; found partially deployed by HiRISE in 2015 | A lost lander spotted from orbit | [ESA](https://sci.esa.int/web/mars-express/-/55263-beagle-2-lander-found-on-mars); The Planetary Society (SECONDARY) |
| Spirit (NASA) | 3 January 2004 | Gusev Crater, 14.5719° S, 175.4785° E | Drove 7.7 km; mission ended in 2010 | [NASA](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity); coordinates from The Planetary Society (SECONDARY) |
| Opportunity (NASA) | 24 January 2004 | Meridiani Planum, 1.9462° S, 354.4734° E | Drove 45.16 km; last heard on 10 June 2018, during a global dust storm | [NASA](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity); coordinates from The Planetary Society (SECONDARY) |
| Phoenix (NASA, with CSA's weather station) | 25 May 2008 | Vastitas Borealis, 68.22° N | Ice under the soil, perchlorate, snow falling from clouds on sol 99; mission ended 2 November 2008 | [NASA](https://science.nasa.gov/mission/phoenix); [JPL](https://www.jpl.nasa.gov/images/pia11200-lidar-measurements-of-snow-falling-from-martian-clouds/) |
| Curiosity (NASA) | 6 August 2012 | Bradbury Landing, Gale Crater, 4.5895° S, 137.4417° E | Gale's ancient lake; organics; passed 1 km of elevation gain on 26 August 2026 | [Wikipedia](https://en.wikipedia.org/wiki/Bradbury_Landing) for coordinates; [Astrobiology.com](https://astrobiology.com/2026/09/04/mars-curiosity-reaches-1-kilometer-elevation-gain/) |
| InSight (NASA, with CNES, DLR and Spain) | 26 November 2018 | Elysium Planitia, 4.50238° N, 135.62345° E, −2,614 m | 1,319 marsquakes; the December 2021 impact; DLR's HP³ heat-flow "mole" | [Forget et al. 2022](https://oro.open.ac.uk/86958); [DLR](https://www.dlr.de/en/irs/research-transfer/missions-and-projects/further-and-completed-projects/insight-1); Section 4.7 |
| Perseverance and Ingenuity (NASA) | 18 February 2021 | Octavia E. Butler Landing, Jezero, 18.44° N, 77.45° E | Jezero's delta; the Cheyava Falls rock; 72 helicopter flights covering 17.0 km; passed Opportunity's 45.16 km on 11 October 2026 | [Wikipedia](https://en.wikipedia.org/wiki/Octavia_E._Butler_Landing); [NASA Ingenuity](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/); [NASA](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity) |
| Zhurong (CNSA) | 15 May 2021 | Southern Utopia Planitia, 25.066° N, 109.925° E, −4,099 m | About 2,000 m driven; buried beach-like layers; silent since 20 May 2022 | [Liu et al. 2022, Nature Astronomy](https://link.springer.com/10.1038/s41550-021-01519-5); [CAS](https://english.casad.cas.cn/newsroom/ma/202609/t20260908_1192779.html) |
| Coming next | 2027–2031 | Phobos; Oxia Planum; to be chosen | MMX on Phobos; Rosalind Franklin, landing in 2030; Tianwen-3; Mangalyaan-2 | Section 6 |

### 7.2 The data that make any sol replayable

| You need | Where it comes from | Notes |
| --- | --- | --- |
| Where the rover was, each sol | NASA's MMGIS waypoint files, for example `mars.nasa.gov/mmgis-maps/M20/Layers/json/M20_waypoints.json`, which carries a sol for each point ([R-bloggers tutorial](https://www.r-bloggers.com/2025/11/perseverance/)); NASA's public location maps for [Perseverance](https://science.nasa.gov/mission/mars-2020-perseverance/location-map/) and [Curiosity](https://science.nasa.gov/mission/msl-curiosity/location-map/) ([NASA Open Science](https://science.nasa.gov/open-science/mars-mapping-open-source)) | The JSON endpoint is undocumented, so cache a copy during the hackathon (UNVERIFIED stability) |
| Exact position and heading | NAIF's Mars 2020 SPICE archive: localized rover-path and site SPKs (preferred over telemetry-based ones), reconstructed surface-orientation CKs (with gaps) and a landing-site SPK in the IAU\_MARS frame; it has no Ingenuity kernels ([NAIF](https://naif.jpl.nasa.gov/pub/naif/pds/pds4/mars2020/mars2020_spice/document/spiceds_v003.html)) | Read in the browser with timecraftjs (Section 9.5) |
| What it did that sol | The PDS Analyst's Notebook, with sol-by-sol plans, data and traverse maps ([Analyst's Notebook](https://an.rsl.wustl.edu/); [MER notebook](https://an.rsl.wustl.edu/mer/)) | Its help pages block automated reading, so I could not confirm its full mission list |
| What it saw | Raw-image feeds (Section 5.1); NASA's Image and Video Library API at `images-api.nasa.gov`, whose `/search` takes `q`, `media_type=video` or `audio`, and year filters and returns Collection+JSON ([API docs, v1.22.0](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)) | The docs state no key or rate limits; test early |
| Weather that sol | REMS, MEDA and TWINS records (Section 4.10) | Show them with the Mars Climate Database estimate beside them |
| Radiation that sol | RAD (Sections 4.2 and 4.14) |  |
| The sky that sol | Mars24 Sun position (Section 4.6) |  |
| The ground in 3D | Cesium Mars at Gale and Jezero; HiRISE terrain elsewhere (Section 9). NASA's own "Explore with Perseverance" builds its 3D landscape mostly from rover images plus HiRISE ([JPL](https://www.jpl.nasa.gov/news/take-a-3d-spin-on-mars-and-track-nasas-perseverance-rover/)) | Rover-scale meshes in Section 9.4 |

### 7.3 Real video and sound from Mars, with official sources

| Moment | What it is | Official source and credit |
| --- | --- | --- |
| Perseverance lands, 18 February 2021 | Four entry-descent-landing cameras (descent stage looking down, rover looking up, aeroshell looking at the parachute, rover looking at the ground) with mission-control audio; MP4 at 1080p and 4K | [NASA SVS](https://svs.gsfc.nasa.gov/31250), NASA/JPL-Caltech |
| Curiosity descends, 6 August 2012 | All MARDI thumbnail frames of the last two and a half minutes, at about 4 frames per second | [NASA](https://science.nasa.gov/resource/dropping-in-on-mars-a-rovers-eye-view) |
| Ingenuity's first flight, 19 April 2021 | A 39.1-second flight to 3 m with a 30-second hover, filmed by Perseverance | [NASA](https://nasa.gov/press-release/nasa-s-ingenuity-mars-helicopter-succeeds-in-historic-first-flight) |
| Zhurong lands and drives off | Footage from a camera on the rover, from parachute to touchdown and the drive off the platform, released by CNSA on 27 June 2021 | [Al Jazeera](https://www.aljazeera.com/news/2021/6/27/china-releases-new-video-and-still-from-mars-rover) (SECONDARY; check CNSA's reuse terms) |
| An eclipse by Phobos | The most zoomed-in, highest-frame-rate Phobos eclipse filmed from the surface, which also helps measure Phobos's decaying orbit | [JPL](https://www.jpl.nasa.gov/images/pia25179-perseverances-mastcam-z-captures-a-phobos-solar-eclipse) |
| A 2 km dust devil | Perseverance, 30 August 2023 | [JPL](https://www.jpl.nasa.gov/news/nasas-perseverance-captures-dust-filled-martian-whirlwind) |
| Iridescent clouds | Curiosity, January 2023; video campaign January 2025 | [NASA](https://www.nasa.gov/image-article/a-rainbow-colored-feather-in-the-martian-sky) |
| A blue sunset | Curiosity, sol 956 | [NASA](https://science.nasa.gov/photojournal/sunset-in-mars-gale-crater/) |
| Flying over Mars in 3D | DLR's 4 min 28 s virtual flight over Ares Vallis to Rosalind Franklin's landing ellipse, from HRSC data, credit FU Berlin, CC BY-SA 3.0 IGO; ESA publishes more HRSC flyovers | [DLR](https://www.dlr.de/en/media/videos/2024/video-a-virtual-flight-over-the-ares-vallis-region-on-mars); [ESA example](<https://www.esa.int/ESA_Multimedia/Videos/2025/10/Fly_over_Xanthe_Terra_with_Mars_Express/(lang)>) (not opened) |
| Mars from orbit, live-ish | Over 19,000 VMC images, CC BY-SA 3.0 IGO | [ESA](https://sci.esa.int/web/mars-express/-/57864-mars-webcam-goes-pro) |
| The sound of Mars | Perseverance microphone recordings; sound travels at about 240–250 m/s | [NASA](https://science.nasa.gov/resource/nasas-perseverance-rover-microphone-captures-sounds-from-mars/); [CNRS](https://www.cnrs.fr/en/perseverance-records-first-ever-sounds-mars) |

Rights (RECOMMENDATION): keep NASA's credit lines and never use NASA logos (Section 3.2). ESA and DLR material under CC BY-SA 3.0 IGO needs its credit, and anything you derive from it must carry the same licence. For CNSA footage, embed or link the official release unless its reuse terms are confirmed.

### 7.4 How one replayed sol is built (RECOMMENDATION)

1. Choose a mission and a sol from a timeline of real moments: Curiosity's and Perseverance's landings, Ingenuity's first flight, Phoenix's snow on sol 99, InSight's largest quake on sol 1,222, Zhurong's last drives before May 2022, Cheyava Falls in July 2024, Curiosity's 1 km climb in August 2026, and Perseverance's record drive in October 2026.
2. Fly the camera from orbit down to the waypoint (Section 9), with the real Sun for that sol and time.
3. Place the NASA 3D rover model at the SPICE position and heading; draw the traverse so far.
4. Pin that sol's raw images in the scene, play its sounds (Perseverance) and show its weather and dose cards.
5. Let the user walk around, measure and ask the assistant, with every answer cited.
6. A "what would a human have needed here?" overlay runs the Marswalk planner on the same ground. History becomes a survival lesson that ties straight back to the brief.

## 8. Technology to make it feel real

The best buildable stack is a web app on CesiumJS with Cesium Mars for both the map and the first-person walk, a voice assistant built on a realtime speech model that can only answer from the app's own data, licensed stock voices, and Web Audio for Martian acoustics and radio delay (RECOMMENDATION). Unreal Engine is worth it only for optional cinematic shots.

### 8.1 Engine choice

| Option | Strengths | Weaknesses | Verdict |
| --- | --- | --- | --- |
| CesiumJS + [Cesium Mars](https://cesium.com/platform/cesium-ion/content/cesium-mars/) | Real Mars terrain streamed in a browser; Gale at 1 m terrain and 25 cm imagery; built-in Mars ellipsoid; judges open a link | Character movement is yours to write; eye-level detail limited to 25 cm imagery | Primary |
| three.js / React Three Fiber + [3DTilesRendererJS](https://github.com/NASA-AMMOS/3DTilesRendererJS) + [Rapier](https://classic.yarnpkg.com/en/package/@dimforge/rapier3d) | Full control of shaders and post-effects; Rapier ships a kinematic character controller and runs in the browser through WebAssembly | More integration work; Earth-tuned sky libraries such as [@takram/three-atmosphere](https://www.npmjs.com/package/@takram/three-atmosphere) are effectively limited to Earth's atmosphere | Alternative if your team knows three.js |
| Unreal Engine 5 + [Cesium for Unreal](https://cesium.com/learn/unreal/unreal-moon-mars/) | Best visuals; Cesium Mars streams in with a Mars ellipsoid (plugin 2.7.0 or later) | Desktop-only unless you run a streaming server; heavier; AI code generation is weaker for Blueprints | Optional, for trailer shots only |
| Unity + Cesium for Unity | Middle ground; Cesium Mars supported ([Cesium](https://cesium.com/blog/2025/09/03/lift-off-to-cesium-mars/)) | Desktop build to distribute | Only if a teammate already knows Unity |

### 8.2 Terrain: a resolution ladder

1. Planet: Cesium Mars global terrain (200 m) and imagery (232 m), plus NASA Mars Trek layers and Esri's OnMars services, which publish Mars elevation (`OnMars/MDEM200M/ImageServer`) and imagery (`OnMars/MDIM/MapServer`) in the Mars 2000 spatial reference, wkid 104971 ([ArcGIS sample](https://developers.arcgis.com/javascript/latest/sample-code/mars/index.html)).
2. Region: the Murray Lab CTX mosaic at 5 m/pixel for context around the site.
3. Walk zone: Gale Crater at 1 m terrain and 25 cm imagery inside Cesium Mars; or Jezero from HiRISE DTMs and orthoimages, after your own seam and alignment clean-up (Section 9).
4. Below 25 cm: rover-scale 3D terrain built from the rovers' own stereo images where it exists (Section 9); elsewhere, generated rocks and texture, clearly labelled as generated.

**Site recommendation: Gale Crater (RECOMMENDATION).** It has the best ready-made terrain in Cesium Mars, Curiosity's traverse to validate against, live REMS weather, and RAD radiation measured on that very crater floor. Its honest weakness is that it lies far from SWIM's mapped buried ice, which makes the survival trade-off a teaching moment rather than a hidden flaw.

### 8.3 Movement and physics

- Use 3.71–3.73 m/s² gravity ([NSSDC](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html?embed=true)). The same jump rises about 2.6 times higher than on Earth (9.82 ÷ 3.73, a ratio from those NSSDC values).
- Walking pace: cite the Apollo walk-back planning rate of 3.3 km/h ([NASA](https://www.nasa.gov/wp-content/uploads/static/history/alsj/19790073512_1979073512.pdf)); slow it on slopes with an explicitly labelled assumption such as an Earth hiking function, and expose a sensitivity slider (ASSUMPTION).
- Block steep cells using slope from the 1 m terrain; show the threshold you chose and why.
- In CesiumJS, keep the camera at eye height and sample the tileset height under the avatar each frame; in three.js, use Rapier's character controller against tile colliders.

### 8.4 Sky, light and sound

- Sun position from the Mars24 algorithm drives shadows and day length. Check it against real photos: every HiRISE observation page lists its local Mars time, for example 3:36 PM with a 67° solar incidence angle for PSP\_001483\_1545 ([HiRISE](https://hirise.lpl.arizona.edu/HiCat/images/PSP/PSP_001483_1545)), so the app's shadows at that place and time should match the image.
- NASA describes the daytime sky as hazy and red from suspended dust ([NASA Mars Facts](https://science.nasa.gov/mars/facts/)); drive sky colour and visibility from a dust-opacity value taken from the Mars Climate Database scenario. Section 9 upgrades this to a physically based Martian atmosphere.
- **Martian acoustics (a differentiator).** Measured sound speed is about 240 m/s below 240 Hz and 250 m/s above, and high pitches fade within about 8 m ([CNRS](https://www.cnrs.fr/en/perseverance-records-first-ever-sounds-mars), [Adlershof/DLR](https://adlershof.de/en/news/the-sound-of-mars)). Apply a Web Audio low-pass filter, distance attenuation and a tiny per-band delay to every in-world sound, and use NASA's recordings for wind ([NASA](https://science.nasa.gov/resource/nasas-perseverance-rover-microphone-captures-sounds-from-mars/)).
- **Radio realism.** Band-limit voices to a radio channel and apply the real Earth–Mars delay: about 11.0 minutes one way on 14–15 November 2026 (computed in Section 10 from JPL's planetary elements).

### 8.5 Voices (licensed or consented only)

| Option | What it offers | Licence and cost notes | Use it for |
| --- | --- | --- | --- |
| OpenAI Realtime API, gpt-realtime-2.1 and mini | Speech-to-speech with tool calls; voices include Cedar and Marin | Billed per audio token, about $32 in and $64 out per million for gpt-realtime-2 (SECONDARY: [vantaige](https://vantaige.io/blog/openai-gpt-realtime-2-voice-agent-setup-2026), [DataNorth](https://datanorth.ai/news/openai-releases-gpt-realtime-2-1-voice-models)) | Main assistant voice |
| Google Gemini Live API | Low-latency native-audio voice agents; the GA 2.5 model offers 30 HD voices in 24 languages ([Google Cloud docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-live-api?authuser=2)); Gemini 3.8 Live reported in September 2026 (SECONDARY: [mer.vin](https://mer.vin/news/gemini-3-8-live-adds-extended-thinking-to-real-time-multimodal-ai/)) | Usage-based | Equal alternative to OpenAI |
| ElevenLabs | Highly realistic text-to-speech and a voice library | Commercial use needs a paid plan; free plan is non-commercial (SECONDARY: [Oakgen](https://oakgen.ai/blog/elevenlabs-free-commercial-use)) | Cinematic narration in the demo video |
| Sarvam Bulbul v3 (Bengaluru) | 30+ voices in 11 languages including Kannada, Hindi and Indian English; REST, streaming and WebSocket ([Sarvam docs](https://docs.sarvam.ai/api/getting-started/models/bulbul)) | Usage-based | Kannada and Hindi mode: a local-impact feature |
| Kokoro-82M via [kokoro-js](https://www.npmjs.com/package/kokoro-js) | Runs fully in the browser on WebGPU or WebAssembly | Apache-2.0 | Offline fallback when venue Wi-Fi fails |
| [Pipecat](https://github.com/pipecat-ai/pipecat) or LiveKit Agents | Open-source voice pipelines with swappable speech, model and voice providers ([comparison](https://www.forasoft.com/blog/article/pipecat-vs-livekit-agents)) | BSD-2 and Apache-2.0 | Only if you want a custom cascade |

Voice rules: pick stock or licensed library voices; never clone a real astronaut, NASA engineer or archival broadcast voice; label the assistant as an AI voice on screen and in the demo, because Space Apps requires AI disclosure ([Project Submission Guide](https://www.spaceappschallenge.org/resources/project-submission-guide/)).

### 8.6 The assistant's brain: grounded, not chatty

- **Tools first.** The model calls functions on your own data: position, elevation and slope, conditions by season and hour, dose so far, walk-back margin, sunlight left, nearby science targets and current radio delay. Every number it speaks comes from a tool result.
- **Cited retrieval.** A small curated corpus (the sources in this paper) answers "why" questions; the answer card shows the source link.
- **Refusal on gaps.** If neither tools nor corpus cover it, the assistant says so.
- **Two voices, one lesson.** An on-suit assistant answers instantly; "Mission Control" replies arrive after the real light-time delay (time-compressed in the demo and labelled). This dramatises NASA's point that a Mars crew must operate independently of Earth ([NASA DRA 5.0](https://www.nasa.gov/wp-content/uploads/2015/09/373665main_nasa-sp-2009-566.pdf)).
- **Measure it.** Write 40 questions with answers taken from this paper and score the assistant before the demo.

### 8.7 Engineering that makes it trustworthy

Section 3.4 lists what other teams have already published; nothing here depends on their code or ideas. Each choice below comes from a primary standard or agency practice (RECOMMENDATION unless linked).

- **Provenance everywhere.** Every layer, number and spoken answer carries its mission, instrument, product ID, resolution, date and licence, links to its archive record, and the app writes the credit line for whatever is on screen.
- **Reproducible views.** The URL encodes place, sol and season, layers and camera, so a scientist can share an exact scene; exports are GeoJSON or CSV with the citations attached.
- **Works without the network.** A service worker caches the demo site's data; the W3C specification describes service workers as making it easier to build offline-enabled web applications ([W3C](https://www.w3.org/TR/service-workers/)). Cache only what each licence allows, and check Cesium ion's terms before caching its tiles.
- **Tested against agency numbers.** Unit tests compare the app's outputs with published values: NASA's 11.37-minute light time at the Mars 2020 landing ([NTRS 20230006978](https://ntrs.nasa.gov/citations/20230006978)) and ESA's 13 min 48 s at Curiosity's landing ([ESA](https://www.esa.int/esaCP/SEMEV8TX55H_index_0.html)). Section 10 shows both checks passing.
- **Accessible by design.** Keyboard control, captions for every spoken line, and hazards shown by pattern as well as colour, following WCAG 2.2, a W3C Recommendation since 5 October 2023 ([W3C](https://www.w3.org/TR/2023/REC-WCAG22-20231005/)).
- **XR only as a bonus.** The WebXR Device API is experimental, needs HTTPS and does not work in some widely used browsers ([MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_API)), so the desktop and phone experience comes first.

## 9. Real 3D Mars, from orbit to a single rock

The goal is one continuous Mars at true scale. You fly to it from space and descend through its dusty sky to walk on real ground, with the Sun, Earth, moons, orbiters and stars where they really are. Everything below has a real data source, and anything generated is labelled as generated.

### 9.1 Mars in space at true scale

- **The globe.** Cesium Mars is 3D Tiles in the IAU\_2015:49901 frame: USGS's Viking colourised mosaic at 232 m and the MOLA–HRSC blended terrain at 200 m, with sharper data at Gale and Jezero. Your own high-resolution terrain can be clipped in as an inset. A CesiumJS Sandcastle (Mars.html) and a Cesium for Unreal sample level show the setup ([Cesium](https://cesium.com/blog/2025/09/03/lift-off-to-cesium-mars/)). Alternative colour: China's 76 m Tianwen-1 map (Section 6).
- **The stars.** NASA's Deep Star Maps 2020 plot 1.7 billion stars from Hipparcos-2, Tycho-2 and Gaia DR2 as OpenEXR half-float maps from 4k up to 64k (65,536 × 32,768) pixels. They come in celestial (ICRF/J2000) coordinates, the version recommended for 3D. Credit "NASA/Goddard Space Flight Center Scientific Visualization Studio" and "Gaia DR2: ESA/Gaia/DPAC" ([NASA SVS](https://svs.gsfc.nasa.gov/4851)). Rotate the star sphere with SPICE's Mars-to-J2000 transformation so the constellations stand where they would above Mars (RECOMMENDATION).
- **The Sun and Earth.** Use real directions from the ephemeris (Sections 4.6 and 10.1): a 0.33° Sun, and Earth as an evening star 37.9° from it during the hackathon.
- **The moons.** NASA 3D Resources offers Phobos and Deimos textures (from Viking images processed at USGS; credit NASA/JPL/Solar System Simulator) ([NASA](https://science.nasa.gov/3d-resources/mars-phobos)) alongside its model collection (Section 5.2). Place them with JPL Horizons and let Phobos race across the sky three times a day (Section 4.15).
- **The orbiters.** Show MRO, MAVEN, Odyssey, Mars Express, TGO, Hope and Tianwen-1 at their real positions from SPICE or Horizons, each labelled with its agency (Section 6), so a viewer sees that Mars is busy (RECOMMENDATION).
- **Ground truth for the look.** ESA's VMC images and Hope's whole-disc images show how Mars's limb, haze and clouds really look from orbit; tune the globe against them.
- **Silence in space.** No sound until the atmosphere thickens on descent, then the Martian acoustic model (Section 8.4) takes over (RECOMMENDATION).

### 9.2 The Martian atmosphere, at three levels of realism

| Level | How | What it gets right | Effort |
| --- | --- | --- | --- |
| 1. Tuned CesiumJS sky (do this first) | CesiumJS's SkyAtmosphere and scene.atmosphere expose Rayleigh and Mie coefficients (Earth defaults 5.5, 13.0, 28.4 × 10⁻⁶ and 21 × 10⁻⁶), scale heights (10,000 m and 3,200 m), Mie anisotropy (0.9), light intensity, hue, saturation and brightness shifts, and per-fragment shading; the model follows "Display of the Earth Taking into Account Atmospheric Scattering" ([SkyAtmosphere](https://cesium.com/learn/cesiumjs/ref-doc/SkyAtmosphere.html), [Atmosphere](https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Documentation/Atmosphere.html)) | A convincing butterscotch limb and haze. A Mars preset is a tuned approximation (ASSUMPTION): set the scale height near Mars's 11 km (NSSDC), weaken Rayleigh, strengthen Mie dust, warm the hue, and keep the side-by-side photos you tuned against | Hours |
| 2. Physically based Martian dust (the real thing) | DLR's Mie-theory model (Schneegans et al. 2024, Computer Graphics Forum 43(2), [doi:10.1111/cgf.15010](https://doi.org/10.1111/cgf.15010)) extends Bruneton's precomputed scattering to other planets. Martian dust is a bimodal log-normal mix (effective radii 0.04 µm and 1.4 µm) of feldspar with 3% hematite, spread over 4 km and 20 km scale profiles. Its phase function matches rover and orbiter measurements up to about 90°, and it reproduces the blue halo round the setting Sun. Precomputing takes seconds and rendering costs about what Bruneton's does. The renderer and Mie preprocessor ship in CosmoScout VR (MIT; [Zenodo](https://doi.org/10.5281/zenodo.3381953)) ([paper](https://cgvr.cs.uni-bremen.de/papers/cgf24/v43i2_15_15010.pdf), [CosmoScout VR](https://github.com/cosmoscout/cosmoscout-vr)) | The real blue sunset and the right glow around the Sun, from published dust optics | One to two days for a strong graphics developer (ASSUMPTION). takram's three.js Bruneton port (MIT) says it is effectively limited to Earth and points to Hillaire's method for other planets, so plan your own lookup shader ([README](https://unpkg.com/@takram/three-atmosphere@0.13.2/README.md)) |
| 3. Cinematic shots | Unreal's Sky Atmosphere can make "extraterrestrial atmospheres" and moves seamlessly from the surface to space with planetary curvature, set by ground radius, atmosphere height, Rayleigh and Mie distributions and scales, and absorption. It handles one planet at a time and may show artefacts at high altitude ([Epic](https://dev.epicgames.com/documentation/unreal-engine/sky-atmosphere-component-in-unreal-engine)). OpenSpace (MIT) uses Costa et al.'s model with Martian dust, compared against Curiosity images, and streams HiRISE and MOLA from orbit to the ground at Jezero ([paper](https://arxiv.org/abs/2010.03534v1), [OpenSpace](https://openspaceproject.com/features/globe-browsing.html)) | Trailer-quality B-roll | Hours, if a teammate knows the tool |

Check the sky against real photos: Curiosity's blue sunset on sol 956 (Section 4.15) and daytime haze. Schneegans et al. note that an earlier model put the blue glow at the horizon instead of around the Sun (Collienne et al.) and that Costa et al.'s halo is too wide. Showing judges you used the newest published physics is itself a Validity point.

### 9.3 From orbit to the ground: the data ladder and our own clean-up

- **Ladder.** Planet, region, walk zone, rock scale, as in Section 8.2. NASA Mars Trek's tile services cover the planet (Section 5.1). Esri's OnMars publishes Mars elevation (`OnMars/MDEM200M/ImageServer`) and imagery (`OnMars/MDIM/MapServer`) in the Mars 2000 reference, wkid 104971, usable from the ArcGIS Maps SDK, which notes limits for Mars scenes: no dynamic, vector-tile or scene layers, and daylight shown incorrectly ([ArcGIS sample](https://developers.arcgis.com/javascript/latest/sample-code/mars/index.html)). Esri's Astro group listed MDIM 2.1 at about 230 m, the HRSC/MOLA DEM at 200 m, a 5 m CTX mosaic of Olympus Mons and 30 cm HiRISE at Victoria Crater in 2019; check what is live now ([Esri](https://www.esri.com/arcgis-blog/products/arcgis-online/imagery/observing-the-red-planet)).
- **Credit lines on screen.** "NASA/JPL-Caltech Mars Trek"; "NASA/JPL-Caltech/University of Arizona HiRISE, via Esri OnMars and NASA Mars Trek"; HiRISE images are public domain, with no usage restrictions, and the team asks for the credit "Image: NASA/JPL/University of Arizona" ([HiRISE policy](https://uahirise.org/media/usage.php)).
- **HiRISE seam and alignment clean-up, done by us (RECOMMENDATION).** (1) Pull the DTM and orthoimage from the USGS STAC catalogue (Section 5.1). (2) Check the shaded relief for known artefacts. (3) Co-register the orthoimage to the 5 m CTX mosaic and the DTM to the 200 m MOLA–HRSC base by estimating a shift, and a small rotation if needed, with feature matching or cross-correlation. Apply it and record it. (4) Feather the seams between neighbouring HiRISE products and match brightness to CTX. (5) Write the processing log into the layer's provenance card, "seams and alignment tidied here", so judges can see exactly what was changed. GDAL and rasterio do the raster work; USGS ISIS and the Ames Stereo Pipeline are the expert tools (Section 5.4).
- **Rover-scale 3D.** NASA's Explore with Perseverance builds its landscape mostly from rover images with HiRISE ([JPL](https://www.jpl.nasa.gov/news/take-a-3d-spin-on-mars-and-track-nasas-perseverance-rover/)). Google and JPL's Access Mars built 3D terrain from Curiosity photos at the landing site, Pahrump Hills and Murray Buttes ([Google](https://blog.google/products/google-ar-vr/helping-nasa-and-jpl-bring-surface-mars-your-browser/)); I could not confirm that its code or meshes are downloadable (UNVERIFIED). 3DTilesRendererJS ships a Dingo Gap Mars demo with multiple tilesets under Apache 2.0 ([GitHub](https://github.com/NASA-AMMOS/3DTilesRendererJS)). The stretch goal is your own photogrammetry from rover stereo pairs with the Ames Stereo Pipeline.
- **Walking physics.** Rapier's JavaScript bindings, Apache 2.0 ([README](https://unpkg.com/@dimforge/rapier3d@0.17.3/README.md)), or CesiumJS height sampling (Section 8.3).

### 9.4 Free assets and open-source projects, with their licences

| Asset | What you get | Licence or terms, as the source states them | Use |
| --- | --- | --- | --- |
| CesiumJS and Cesium Mars | Engine; global and site 3D Tiles | CesiumJS Apache-2.0 ([licenses.dev](https://licenses.dev/npm/cesium/1.139.1)); Cesium ion account terms for the tiles | The world |
| NASA images, video and audio | Everything NASA publishes | Generally not copyrighted in the US; credit NASA; the insignia is protected by law and NASA does not want it used in AI tools; no implied endorsement; third-party items excepted ([NASA](https://nasa.gov/nasa-brand-center/images-and-media)) | All NASA media |
| HiRISE | Images and terrain models | Public domain; credit requested; USGS's set of 900+ HiRISE DTMs is CC0-1.0 (Section 12.8) ([HiRISE](https://uahirise.org/media/usage.php)) | Walk zone |
| MOLA–HRSC DEM | 200 m global terrain | MOLA CC0, HRSC CC BY-SA 3.0 IGO (Section 5.1) | Globe |
| ESA VMC images; DLR and ESA HRSC flyovers | Orbit views and 3D flights | CC BY-SA 3.0 IGO: credit, and share-alike for derivatives ([ESA](https://sci.esa.int/web/mars-express/-/57864-mars-webcam-goes-pro), [DLR](https://www.dlr.de/en/media/videos/2024/video-a-virtual-flight-over-the-ares-vallis-region-on-mars)) | Orbit look, B-roll |
| Deep Star Maps 2020 | Star background up to 64k | Credit lines requested by NASA SVS ([SVS](https://svs.gsfc.nasa.gov/4851)) | Sky |
| NASA 3D Resources | Rover, lander and orbiter models; Phobos and Deimos textures | NASA media terms ([GitHub](https://github.com/nasa/NASA-3D-Resources)) | Models |
| CosmoScout VR | Atmosphere renderer and Mie preprocessor | MIT ([GitHub](https://github.com/cosmoscout/cosmoscout-vr)) | Physically based sky |
| OpenSpace | Desktop universe with Mars globe browsing | MIT ([OpenSpace](https://openspaceproject.com/about/about.html)) | B-roll, reference |
| takram three-atmosphere | Bruneton sky for three.js | MIT; Earth-focused | Reference code |
| 3DTilesRendererJS | 3D Tiles in three.js, Mars demos | Apache 2.0 | three.js route |
| Rapier | Physics in WebAssembly | Apache 2.0 | Walking |
| timecraftjs | NAIF SPICE in the browser | Caltech copyright; commercial use must be negotiated; US export-control terms apply ([GitHub](https://github.com/NASA-AMMOS/timecraftjs)) | Positions of everything |
| Kokoro-82M | Offline speech | Apache-2.0 (Section 8.5) | Fallback voice |
| Phoenix MET data | Polar weather CSV | Open Government Licence – Canada ([Open Canada](https://open.canada.ca/data/en/dataset/0e338f52-25e4-465c-8104-bb9d7c8d3df3)) | Weather |
| Mars Climate Database | Modelled climate | Free; no commercial use (Section 5.1) | Conditions |
| Esri OnMars services | Mars elevation and imagery in ArcGIS | Terms not stated on the pages I read; check Esri's terms (UNVERIFIED) | Basemaps |
| NASA Image and Video Library API | Search NASA video and audio | Docs give no key or rate limits (Section 7.2) | Media wall |

### 9.5 Positions of everything, in the browser

timecraftjs compiles NAIF's CSPICE to JavaScript with Emscripten. It loads kernels as ArrayBuffers, converts spacecraft and Earth times, and offers `spkpos` and light-time functions without a server. Its lite build needs about 20 MB and the full build about 100 MB ([GitHub](https://github.com/NASA-AMMOS/timecraftjs)). Use it with the Mars 2020 and MSL SPICE archives for rover positions (Section 7.2). Use JPL Horizons, precomputed during the hackathon, for moons and orbiters (Section 5.1).

## 10. An honest verdict on your six ideas

I tested each idea on four things: does it serve the brief (plan and carry out a Marswalk, with science along the way), is it scientifically sound, can six students build it in 48 hours, and do real data support it.

| Your idea | Serves the brief? | Scientifically sound? | Buildable in 48 h? | Verdict |
| --- | --- | --- | --- | --- |
| 1. Real-time walking on real terrain | Yes: it is the "carry out" half of the brief | Yes, on real terrain (Gale at 1 m and 25 cm in Cesium Mars) in 3.73 m/s² gravity | Yes, at one site | **Keep, but change its job.** The walk is the live view of the plan: slope, dose, oxygen and walk-back margin update as you move. Walking alone is table stakes (Section 3.4) |
| 2. Full journey: launch, trajectory, entry, landing, surface | Partly: the brief is about the surface | Yes, if the numbers are real; mine are computed and checked (below) | A full flight simulator, no; a 60-second data prologue, yes | **Change** into a short prologue: the real 2026 launch window, cruise time, arrival date and radio delay, then cut to the surface |
| 3. Real dangers from real data | Yes: it is the "survival guide" | Yes: RAD dose, NASA's dust limit, perchlorate, cold, pressure, storms, solar events (Sections 4.2 and 4.14) | Yes | **Keep as the core.** Every hazard becomes a layer and a budget |
| 4. Gamification | Yes, if it rewards good planning | Only if the score uses real limits | Yes | **Keep, but score the right thing.** Points for science collected while keeping oxygen, power, dose and daylight margins, using NASA's 8-hour EVA ceiling and the walk-back rule (Section 4.2). No fictional enemies |
| 5. AI voice that answers on Mars | Yes: crew autonomy at 4–24 minutes' delay | Yes, if every number comes from tools and cited sources (Section 8.6) | Yes | **Keep:** grounded answers, an instant suit assistant, and a Mission Control voice that arrives after the real delay |
| 6. Testing rockets and landings | Weakly | Rocket design is far beyond 48 hours and outside the brief | No, not credibly | **Drop rocket testing; change landings into a landing-site safety check** (below) |

### 10.1 The journey numbers, computed and checked

I wrote a Python ephemeris from JPL's published Keplerian elements and a Lambert solver for Earth–Mars transfers ([JPL elements](https://ssd.jpl.nasa.gov/planets/approx_pos.html)). It passes two independent checks against published values. It gives 11.37 minutes of one-way light time at Perseverance's landing, matching NASA's reconstruction (touchdown at 20:43:49 spacecraft time, signal on Earth at 20:55:11; [NTRS 20230006978](https://ntrs.nasa.gov/citations/20230006978)). It gives 13.80 minutes at Curiosity's landing, matching ESA's 13 min 48 s ([ESA](https://www.esa.int/esaCP/SEMEV8TX55H_index_0.html)).

| Quantity (COMPUTED) | Value |
| --- | --- |
| One-way light time, 14 November 2026 | 11.00 minutes (197.8 million km, 1.322 AU) |
| Closest approach this cycle, 19 February 2027 | 101.4 million km, 5.64 minutes |
| Cheapest departure in the 2026 window | C3 = 9.14 km²/s², leaving 31 October 2026, 292 days of cruise, arriving 19 August 2027 at 2.73 km/s relative to Mars |
| Launch period | C3 ≤ 12 km²/s²: 11 October to 26 November; ≤ 15: 3 October to 8 December; ≤ 20: 21 September to 22 December |
| Fastest cruise with C3 ≤ 20 km²/s² | 172 days |
| Textbook Hohmann reference | 259 days, C3 = 8.67 km²/s² |
| Dose, 180 days out + 500 days on Mars + 180 days back | 0.98 Sv using RAD's rates (Hassler et al. quote about 1.01 Sv for the same plan), above NASA's 600 mSv career limit (Section 4.2) |
| One 8-hour Marswalk at 0.64 mSv/day | 0.21 mSv |

The computed period overlaps the November–December 2026 window reported in Section 4.5; a real mission's launch period also depends on its rocket and its arrival constraints. Cross-check any number you show with NASA's Trajectory Browser (Section 5.2).

### 10.2 What replaces "testing rockets and landings"

**A landing-site safety check (RECOMMENDATION).** The user drops a landing ellipse on the map. The app scores it with real data: slope and roughness from HiRISE terrain, rock hazards, ice and science targets within walking range, and the Exploration Zone limits of ±50° latitude and below +2 km elevation (Section 4.3). It then plays the real entry numbers, using Perseverance's profile: about 19,500 km/h at entry, a 21.5 m parachute at about 11 km altitude and 1,512 km/h, and Terrain-Relative Navigation between 4.2 and 2.2 km that can move touchdown by up to 600 m (Section 4.5). An honest odds line comes last: only 12 of 19 robotic landing attempts had succeeded by 2024 (Section 4.5). The scientific core of your idea stays: is this place safe to land and worth it. The rocket engineering you could not finish credibly goes.

## 11. Additional features: the scientist's workbench

All rankings here are RECOMMENDATIONS. Impact is judged against the five criteria (Section 3.1); effort is the share of a six-person, 48-hour team. Must-haves come first; the rest are ordered by impact for effort.

| Rank | Feature | What it does | Why it wins points | Data behind it | Effort |
| --- | --- | --- | --- | --- | --- |
| 1 | Marswalk planner with hard budgets | Route from A to B through science stops, with live oxygen, power, dose, daylight and walk-back margin; refuses a plan that breaks a limit | Relevance, Validity: it is the brief | HiRISE slope, NASA EVA ConOps, Apollo walk-back rate, RAD, Mars24 (Sections 4.2 and 4.6) | Medium |
| 2 | Grounded voice with real radio delay | Instant suit assistant plus a Mission Control voice whose replies arrive after the real round trip, about 22 minutes | Creativity, Presentation; dramatises crew autonomy | Section 8.6; computed delay (Section 10.1) | Medium |
| 3 | Every-agency layer stack and credits | Each agency's data has a visible job and a credit line | Influence, Creativity; no one else does it | Section 6 | Low |
| 4 | Relive any sol | Fly to any rover on any sol and see its photos, weather and sounds | Creativity, Presentation: the memorable moment | Section 7 | Medium |
| 5 | Orbit-to-surface descent | Start in space with stars, moons and orbiters, then descend through a physically based dusty sky | Presentation: the first 5 seconds of the video | Section 9 | Medium to high |
| 6 | Measurement tools | Distance, elevation profile, slope histogram, line of sight, area | Validity; scientists expect them | Terrain layers | Low |
| 7 | Provenance and export | Every layer and number shows source, date, licence and processing; one-click GeoJSON or CSV with citations; shareable URL | Validity; reproducibility | All sources | Low |
| 8 | Water and ice prospecting | Overlay of Odyssey, SWIM, FREND, ice cliffs and fresh-impact ice, with depth to ice | Influence: water decides where humans go | Section 4.12 | Low |
| 9 | Space-weather scenario | Replays the May 2024 storm numbers and forces a shelter decision | Validity, Presentation | Section 4.14 | Low |
| 10 | Science stops with discovery cards | Lake mudstone, delta front, Cheyava Falls-like rocks, each with its paper | Relevance: "new science along the way" | Sections 4.8 and 4.13 | Low |
| 11 | Live "today on Mars" panel | Mars Year, Ls, season, rover sol numbers, radio delay, sunrise at Gale in IST | Presentation; a live tie to the judging days | Section 4.6 | Low |
| 12 | Martian sound engine | Real wind and rover sounds through a Mars acoustic filter; silence in space | Creativity | Section 8.4 | Low |
| 13 | Weather events on the route | Dust devils, dusk clouds, frost, storm warnings, each tied to real measurements | Validity, Presentation | Section 4.11 | Medium |
| 14 | Landing-site safety check | Drop an ellipse; score slope, rocks, ice and science; replay real EDL numbers | Relevance; replaces rocket testing | Section 10.2 | Medium |
| 15 | Kannada and Hindi voice mode | The assistant answers in local languages | Local Impact award | Section 8.5 | Low |
| 16 | Offline-first demo | Runs with no venue Wi-Fi | Reliability on judging day | Section 8.7 | Low |
| 17 | Shared mission notebook (stretch) | Team members pin notes and measurements to places and sols | Influence for real science teams | App state | Medium |
| 18 | WebXR view (stretch) | Stand on Mars in a headset | Presentation, if time allows | Section 8.7 | Medium |

**Cut line (RECOMMENDATION):** ship 1–12 for the demo. Build 13–16 if the core is stable by hour 30. Leave 17–18 for after Space Apps. Judges reward a complete, working story over a long list of half-features.

## 12. The recommended design

### 12.1 Concept and story

**Working name (RECOMMENDATION): "Red Atlas".** Check the name is free and keep NASA branding out of it (Section 3.2). **Pitch:** everything a Mars explorer needs in one place: every agency's data, every rover's history, a real sky, and a planner that keeps you alive.

**The demo story, set on the judging weekend.** It is 14 November 2026, Mars Year 39, early northern spring.

1. We start in space at true scale, with stars, Phobos, the orbiters and Earth as an evening star.
2. We descend through a dusty sky to Gale Crater as the Sun rises, at 13:47 IST (Section 4.6).
3. The scientist plans a Marswalk to a lake-mudstone outcrop. The route is green on oxygen, power, dose and daylight.
4. During the walk a dust devil crosses the route, and the suit assistant answers at once from cited data.
5. Mission Control's reply arrives after the real round trip of about 22 minutes, 11 each way (time-compressed and labelled).
6. One tap relives Curiosity's real sol on this same ground, with its photos, weather and dose.
7. The plan exports with every source attached.

### 12.2 Feature tiers

Core: features 1–12 in Section 11. Stretch: 13–16. After Space Apps: 17–18.

### 12.3 Architecture

&#91;embedded content: system architecture · 4 layers, sources to assistant\]

The browser app is the product. The thin back end only hides API keys, caches data and runs the assistant's tool endpoints. Everything heavy is precomputed during the hackathon, so the demo also runs offline.

### 12.4 Data pipeline, in build order

1. Choose the site and fix its frame: Gale, IAU\_2015:49901 in Cesium Mars (Section 5.1).
2. Pull and clean the walk-zone terrain: HiRISE DTM and orthoimage, seams and alignment fixed, provenance logged (Section 9.3).
3. Derive slope, roughness and line of sight with GDAL.
4. Precompute the Sun for the demo sols with our validated Mars24 code (Section 4.6), and Earth, moon and orbiter positions with Horizons or SPICE.
5. Cache traverses and that sol's images from MMGIS and the raw-image feeds; snapshot the endpoints (Section 7.2).
6. Build the conditions table from the Mars Climate Database and measured ranges (Section 4.10); build the dose table from RAD (Section 4.2).
7. Write the assistant's corpus from this paper's sources, and its tool endpoints from steps 3–6.

### 12.5 Stack and the reason for each choice

| Layer | Choice (RECOMMENDATION) | Why | Fallback |
| --- | --- | --- | --- |
| 3D engine | CesiumJS + Cesium Mars | Real Mars in a browser on day one; Apache-2.0 | three.js + 3DTilesRendererJS |
| Sky | Tuned CesiumJS atmosphere, then DLR's Mie tables | Hours to look right; physics if time allows | Tuned sky only |
| Time and positions | Our Mars24 port, timecraftjs, Horizons | Validated against published values | Precomputed JSON |
| App code | TypeScript with a mainstream UI framework | AI coding tools are strongest on mainstream stacks | Plain TypeScript |
| Back end | Small serverless functions | Keys stay secret; caching | Fully static, offline mode |
| Assistant | Realtime speech model with tool calls and retrieval | Grounded, low-latency voice | Kokoro voice plus text model |
| Local languages | Sarvam Bulbul v3 | Kannada and Hindi from a Bengaluru company | English only |
| Audio | Web Audio API | Martian acoustics and radio effects | Pre-rendered audio |
| Data processing | Python with GDAL and rasterio | Standard and scriptable | Precomputed rasters |
| Tests | Unit tests against NASA and ESA numbers | Proves Validity | Manual checks |

### 12.6 Does it do what the challenge asks? Requirement by requirement

The requirements below come from the challenge summary that independent teams quote identically, plus the three needs and subject tags recovered in Section 2.1. Re-check this table against the official page as soon as you can read it there.

| The challenge asks for | How Red Atlas delivers it | NASA missions behind it | Where in this paper | Seen in the demo |
| --- | --- | --- | --- | --- |
| "A layered, integrated view" | Layers combine into one route cost and one go/no-go answer instead of separate toggles: slope, roughness, light, dose, ice and science value | MGS (MOLA), MRO (HiRISE, CTX, CRISM, SHARAD), Odyssey (THEMIS, GRS) | 8.2; 11, features 1, 6 and 8 | Plan scene |
| "of a location or route on the Martian surface" | One walk zone at Gale with a planned route; other places in the site tour | MSL, MRO | 8.2, 12.8 | Descent and walk |
| "combines data from multiple NASA science missions" | At least eight NASA missions feed visible layers, with every other agency's data alongside | MGS, Odyssey, MRO, Phoenix, MSL, InSight, Mars 2020, MAVEN | 5, 6 | Layer list and credits |
| "to help a human explorer plan" | A planner with hard budgets for oxygen, power, dose, daylight and the walk-back rule | NASA EVA ConOps, the Apollo walk-back rule, RAD | 4.2; 11, feature 1 | Plan scene |
| "and carry out a successful Marswalk" | First-person walk with a live heads-up display, real events, a grounded assistant, and Mission Control on the real round trip | Mars24, Mars Climate Database, REMS and MEDA, space-weather alerts | 8.3–8.6, 12.7 | Walk scene |
| "while doing new science along the way" | Science stops picked for value, discovery cards linked to papers, a sample log | MSL (lake mudstones, organics), Mars 2020 (Cheyava Falls) | 4.8, 4.13; 11, feature 10 | Science stop |
| Route and destinations | Route planner, destination list, site tour | — | 11, 12.8 | Plan and tour |
| Current conditions | Live Mars clock (season, Sun, local time); modelled conditions for that hour; the latest archived measured weather; space-weather alerts | MSL, Mars 2020, InSight, MAVEN | 4.6, 4.10, 4.14 | Suit-up briefing |
| Subjects: Human Exploration, Mars, Software | A browser app for planning crewed surface work | — | 2.1 | The whole demo |
| Judging: Influence, Creativity, Validity, Relevance, Presentation | Mapped criterion by criterion | — | 14.3 | Film and slides |
| Rules: AI disclosure, no NASA branding, cite every source, 30-second video or 7 slides, start on 14 November | Built into the plan | — | 3.2, 13, 14.4 | Submission |

**An honest note on "current conditions".** Mars weather cannot be live in the app. Curiosity's REMS archive currently runs to sol 4,488, 22 March 2025 ([PDS Atmospheres Node](https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html)), while the rover passes sol 5,050 this month (Section 4.6). So show three kinds of values with different badges: live (the Mars clock and Sun), modelled (the Mars Climate Database for this place, season and hour) and measured (the latest archived sols). Say on screen which is which (RECOMMENDATION).

### 12.7 The immersive walkthrough, scene by scene

This is the script the app is built to, and the test it must pass (RECOMMENDATION; numbers from the sections cited). Build the scenes in this order. The 30-second film (Section 14.1) is a cut of scenes 1, 3, 6, 8 and 10.

| # | Scene | What you see and do | What makes it real | Done when |
| --- | --- | --- | --- | --- |
| 0 | Mission clock | The opening screen shows Mars today: Mars Year, season, sol numbers, Sun times at Gale, radio delay | Mars24 port and JPL elements (4.6, 10.1) | Values match Section 4.6 and the LMD date converter for the same moment |
| 1 | Arrival in orbit | Mars at true scale against 1.7 billion stars; Phobos and Deimos moving; orbiters labelled by agency; Earth as a bright evening star | NASA star map, NASA moon textures, Horizons or SPICE positions (9.1) | Phobos completes about three orbits per Mars day in time-lapse; every object shows its source on tap |
| 2 | Choose where to go | Spin the globe; pins for every landing site and landmark; layers from every agency | Coordinates in 7.1; layers in 6 | Every pin opens a mission card with a citation |
| 3 | Entry, descent and landing | The sky turns from black to butterscotch; the heads-up display counts down real entry numbers; sound fades in as the air thickens | Perseverance's entry profile (4.5); the atmosphere model (9.2) | Display numbers equal the JPL press-kit values; the sky passes the photo comparison in 9.2 |
| 4 | Habitat and suit-up | Briefing: modelled weather for the hour, measured ranges, dose so far, daylight left, suit limits | Mars Climate Database, REMS and MEDA ranges, RAD, EVA ConOps (4.2, 4.10) | Every number carries a live, modelled, measured or computed badge |
| 5 | Plan the Marswalk | Pick science targets; the planner draws a route and explains it; budgets turn red when a limit breaks | HiRISE slope; walk-back at 3.3 km/h; the 8-hour EVA limit (4.2, 8.3) | A plan that breaks any budget cannot be approved |
| 6 | The walk | First-person at eye height (ASSUMPTION: about 1.7 m) in 3.73 m/s² gravity. Footsteps and wind play through the Mars acoustic filter. The display shows oxygen, power, dose, Sun time, distance home and radio delay. Curiosity's real tracks and photos appear where it actually drove | Cesium Mars 1 m terrain and 25 cm imagery; MMGIS traverse; raw images (5.1, 7.2, 8.3, 8.4) | The ground under the feet follows the terrain model; at least 30 frames per second on the team's weakest laptop (ASSUMPTION target) |
| 7 | Science stop | Reach a lake-mudstone outcrop; a discovery card explains why it matters; log a sample | Grotzinger et al.; Curiosity's organics (4.8, 4.13) | The card links to its paper; the sample log exports with coordinates |
| 8 | Something happens | A dust devil crosses the route, or a solar-storm alert arrives; ask the suit assistant; Mission Control answers after the round trip | Perseverance's dust-devil numbers; the May 2024 storm dose; the computed delay (4.11, 4.14, 10.1) | The answer cites tool values; the Mission Control timer equals twice the one-way light time for the scenario date |
| 9 | Return and debrief | Walk home inside the margin; compare the plan with what happened; dose and science totals; export | The planner's log | The export carries every source and reopens the same scene from its URL |
| 10 | Relive a sol | Switch to Curiosity on a real sol at this spot: rover model, that sol's photos, weather and dose | SPICE or MMGIS position, raw images, REMS (7.2) | The rover stands within a few metres of its published waypoint (ASSUMPTION tolerance) |
| 11 | Visit everything | Fly to any other site; walk where data allow and fly over elsewhere | Section 12.8 | Each stop states its walkability level |
| 12 | Credits and provenance | Every agency, data set, licence and AI tool in one panel | Sections 6, 9.4, 18 | Matches the README and the submission form |

### 12.8 Visit everything: the site tour, and where you can truly walk

Not every part of Mars has terrain fine enough to walk on. Each tour stop therefore shows one of three levels:

- **Walk** (metre scale): a HiRISE terrain model at 1–2 m with images near 25 cm. USGS hosts over 900 HiRISE DTMs as Cloud Optimized GeoTIFFs under CC0-1.0 ([USGS STAC](https://stac.astrogeology.usgs.gov/docs/data/mars/hirise_dtms/)).
- **Hike** (tens of metres): CTX terrain models, for example a 20.2 m DTM with 6 m images at InSight's site; public domain, cite Fergason et al. 2016 ([USGS](https://astrogeology.usgs.gov/search/map/ctx_digital_terrain_model_of_mars_insight_landing_site_ellipse_9_center)).
- **Fly over** (planet scale): 200 m global terrain with 5 m CTX or 232 m colour imagery (Sections 5.1 and 9.1).

| Stop | Why go | Best ground data | Level |
| --- | --- | --- | --- |
| Gale: Bradbury Landing and Mount Sharp | Curiosity's ancient lake; the demo site | Cesium Mars 1 m terrain and 25 cm imagery (5.1) | Walk |
| Jezero: Octavia E. Butler Landing and the delta | Perseverance, Ingenuity, Cheyava Falls | USGS's Mars 2020 Terrain Relative Navigation mosaic: a 1 m HiRISE DTM with 0.25 m images over 18.31–18.67° N, 77.22–77.58° E, built from 7 stereo pairs; cite Fergason et al. 2020 ([USGS](https://astrogeology.usgs.gov/search/map/mars_2020_terrain_relative_navigation_hirise_dtm_mosaic)) | Walk |
| Victoria Crater, Meridiani Planum | Opportunity's crater, where the team planned its "Duck Bay" entry | HiRISE DTM DTEEC\_001414\_1780\_001612\_1780, about 1 m/pixel ([HiRISE](https://hirise.lpl.arizona.edu/dtm/PSP_001414_1780)) | Walk |
| Elysium Planitia | InSight's quakes and weather | CTX DTMs at 20.2 m ([USGS](https://astrogeology.usgs.gov/search/map/ctx_digital_terrain_model_of_mars_insight_landing_site_ellipse_9_center)) | Hike |
| Gusev Crater | Spirit | Search the USGS DTM catalogue by area during the event | Hike or fly over |
| Ares Vallis, Chryse, Utopia, Vastitas Borealis | Pathfinder, Viking 1 and 2, Phoenix | The same search | Fly over unless a DTM exists |
| Southern Utopia Planitia | Zhurong | The same search; the Tianwen-1 colour map (Section 6) | Fly over unless a DTM exists |
| Mars 3 and Beagle 2 sites | The first landing; the lost-and-found lander | Approximate positions only (Section 7.1) | Fly over |
| Landmarks: Olympus Mons summit, Valles Marineris and Candor Chaos, Hellas, the south polar deposits, the 56.6° S ice cliffs | Frost, hidden water, the deepest basin, buried ice (Sections 4.8–4.12) | Centre coordinates from the USGS Gazetteer of Planetary Nomenclature, given as planetocentric, east-positive, 0–360° ([example entry](https://planetarynames.wr.usgs.gov/Feature/4573)); HiRISE patches where DTMs exist | Fly over, with walk patches |

**Coordinates.** The NSSDC records give the Viking and Pathfinder sites in degrees west, while the Gazetteer uses east-positive longitudes (Section 7.1). Convert every pin to one convention, and check each against HiRISE images of the hardware where they exist (RECOMMENDATION).

The result: you can walk at three sites, hike at a fourth and fly over the rest, with every stop honestly labelled. That is more of Mars to visit than any single existing tool offers (Section 3.5), and none of it is fake detail.

## 13. Build plan

&#91;embedded content: build plan · 7 phases, prep to submission (not to scale)\]

The hours assume the event starts at 09:00 IST on Saturday 14 November, when submissions open ([Internshala listing of official dates](https://internshala.com/competitions/nasa-international-space-apps-challenge-2026-registration/)). The submission deadline was not published in any source I could read, so confirm it in the 2026 Project Submission Guide, due on 13 November, and move the last two phases to fit (UNVERIFIED).

### 13.1 Before 14 November: learn, do not build

The rules say teams may not begin work on the challenge before the hackathon (Section 3.2). So prepare knowledge, not deliverables (RECOMMENDATION):

- Create accounts and read the docs: Cesium ion, your voice-model provider, Sarvam, NASA's API portal.
- Work through public tutorials, such as the CesiumJS Mars Sandcastle and the ArcGIS Mars sample, in a throwaway folder that you delete.
- Each member reads their sections of this paper, and the team agrees the site (Gale), the story (Section 12.1) and the cut line (Section 11).
- Ask your Bengaluru local lead in writing what preparation is allowed.

### 13.2 Roles for six people

| Role | Owns | Sections |
| --- | --- | --- |
| Lead and storyteller | Story, video, slides, judging checklist, final claim check | 3, 12, 14 |
| 3D engineer | CesiumJS world, orbit view, descent, sky, walking | 8, 9 |
| Data engineer | HiRISE clean-up, slope, traverses, images, weather, dose tables, provenance | 5, 6, 7, 9.3 |
| Planner engineer | Route search on a cost surface, budgets, walk-back rule, landing-site check | 4.2, 10.2, 11 |
| AI and voice engineer | Realtime voice, tools, retrieval, radio delay, Kannada and Hindi, the 40-question check | 8.5, 8.6 |
| Science and experience lead | Verifies numbers, writes discovery cards, Martian audio, accessibility, credits panel | 4, 8.4, 8.7 |

### 13.3 Risk register

| Risk | Likelihood | Impact | Mitigation |
| --- | --- | --- | --- |
| Venue Wi-Fi fails on demo day | Medium | High | Offline cache, local tiles for the site, offline voice fallback, a recorded walkthrough |
| Cesium ion limits or terms block the demo | Low to medium | High | Read the terms on day one; keep a self-hosted copy of public-domain HiRISE tiles for the walk zone |
| Voice API costs or rate limits | Medium | Medium | Spending cap, short sessions, text fallback |
| The assistant says something wrong | Medium | High | Numbers from tools only, refusal on gaps, the 40-question check before filming |
| Undocumented endpoints change (raw images, MMGIS) | Medium | Medium | Snapshot everything the demo needs during the event |
| Licence mistakes (share-alike, NASA logo) | Medium | High | Licence column in the data catalogue; on-screen credits; no logos (Sections 7.3 and 9.4) |
| Breaking the no-early-work rule | Low | Disqualification | No project code or data processing before 14 November |
| Scope creep | High | High | Hard cut line and feature freeze at H28 |
| The physically based sky takes too long | Medium | Low | Ship the tuned CesiumJS sky first |
| Fatigue | High | Medium | Two sleep shifts; nobody codes past 24 hours awake |
| Slow on a judge's laptop | Medium | Medium | Quality presets; test on the weakest laptop in the team |

## 14. Presentation and submission

Presentation weighs as much as each of the other four criteria (Section 3.1), and the demo is a 30-second video or at most 7 slides, hosted publicly, in English with English subtitles (Section 3.2). Plan the film before the code and build towards it (RECOMMENDATION).

### 14.1 The 30-second film, shot by shot

| Seconds | Picture | On-screen line (English subtitles) |
| --- | --- | --- |
| 0–4 | True-scale Mars in space; Phobos crossing; Earth as an evening star | "14 November 2026. Mars Year 39. One Mars, built from every agency's data." |
| 4–9 | Descent through the dusty sky to Gale Crater at sunrise | "Real terrain. Real sky. Real time on Mars." |
| 9–15 | The planner draws a route to an ancient-lake outcrop; oxygen, power, dose and daylight bars stay green | "Plan a Marswalk that gets you home." |
| 15–20 | Walking; a dust devil crosses; the scientist asks if there is time to reach the outcrop and return | The assistant answers with numbers and a source card |
| 20–24 | "Mission Control, 22 minutes later" (the round trip, time-compressed and labelled) | "Earth is 11 light-minutes away. The crew decides." |
| 24–28 | Relive Curiosity's real sol on this ground: photo, weather, dose | "Every rover's history, replayable." |
| 28–30 | Name, team, credits line, AI disclosure | "Data: NASA, ESA, ISRO, CNSA, UAE, JAXA and more. AI voice disclosed." |

Rules to follow in the film: label the voice as AI. Put a visible AI watermark on any AI-generated image or video. Never show or alter NASA logos (Section 3.2; NASA does not want its insignia used in AI tools, [NASA](https://nasa.gov/nasa-brand-center/images-and-media)). Credit every clip (Section 7.3).

### 14.2 The seven slides

1. **The problem:** an astronaut on Mars plans a walk 11 light-minutes from help, with oxygen, power, dose and daylight all running out.
2. **Our answer:** one place with every agency's data, every rover's history, a real sky and a planner that keeps you alive.
3. **Data from every agency:** the Section 6 table as a logo-free grid of names and data sets.
4. **How it works:** the architecture diagram (Section 12.3).
5. **Why you can trust it:** provenance badges; computed values checked against NASA and ESA (Section 10.1); measured versus modelled conditions (Section 4.10).
6. **Three moments:** the Marswalk, the delayed Mission Control answer, a relived sol.
7. **Impact and next:** crew-planning research, classrooms in Kannada and Hindi, and new data from MMX, Mangalyaan-2 and Rosalind Franklin.

### 14.3 How each criterion is earned on screen

| Criterion | What the judge sees |
| --- | --- |
| Influence | A tool for real crews and for students; data from every agency; local languages |
| Creativity | Relive-a-sol, radio-delayed Mission Control, a physically based Martian sky; none of these appears in the entries already public (Section 3.4) |
| Validity | Every number has a source badge; tests pass against NASA and ESA values; generated content is labelled |
| Relevance | One site, one Marswalk, planned and carried out, with science along the way |
| Presentation | A 30-second story with a beginning (space), a middle (the walk) and an end (history and credits) |

### 14.4 Submission checklist

- Project page complete; all team members registered and listed (Section 3.2).
- Demo video or slides hosted publicly outside the Space Apps site, with English subtitles.
- Public code repository, with a README that lists every data source, licence and AI tool used.
- A credits page in the app matching the README.
- AI disclosure statement; watermarks on AI-generated media.
- Submitted before the deadline in the 2026 Project Submission Guide, with a buffer of several hours.

## 15. Things you did not ask about but should know

1. **The hackathon falls inside a real Mars launch window.** My calculation puts the cheapest 2026 departure on 31 October, with a launch period running from October into December (Section 10.1). NASA's ESCAPADE orbiters fire their burn towards Mars this November (Section 4.5), and Japan's MMX left for Phobos on 20 October (Section 4.15). Use this news in the pitch.
2. **Mars is in early northern spring, Mars Year 39, during judging.** Earth is an evening star over Gale, and the Sun rises there at 13:47 IST on 14 November (Section 4.6). A live "today on Mars" panel makes the demo feel current.
3. **Brand-new science you can cite.** NASA set its first Martian dust exposure limit and published Perseverance's dust results this month (Section 4.2), and news reports say Perseverance passed Opportunity's driving record in October (Section 7.1). Judges will notice up-to-date science.
4. **No early work.** The FAQ forbids starting the challenge before the event (Section 3.2). Learning is fine; code and data processing are not. Get the local lead's guidance in writing.
5. **AI rules.** Disclose AI use and watermark AI-generated images and video. Never use NASA's insignia; NASA specifically does not want it used in AI tools ([NASA](https://nasa.gov/nasa-brand-center/images-and-media)).
6. **Licences differ, and share-alike bites.** HRSC, ESA VMC and DLR flyovers are CC BY-SA 3.0 IGO, so anything you derive from them carries the same licence. The Mars Climate Database bars commercial use; timecraftjs needs negotiation for commercial use; HiRISE is public domain. Keep the licence column from Section 9.4 in your README.
7. **A strong India story.** ISRO's Mars Orbiter Mission data are free through ISSDC and PRADAN; Mangalyaan-2 aims to land in 2030; Sarvam, a Bengaluru company, voices Kannada and Hindi (Sections 6 and 8.5). That is the case for the Local Impact award (Section 3.3).
8. **The agencies host the event.** Space Apps 2026 is hosted by 17 space agencies ([CSA](https://www.asc-csa.gc.ca/eng/events/2026/2026-11-14-space-apps-challenge.asp)), and CSA says its mentors will be available all weekend; other agencies may offer the same. Ask them about their data during the event.
9. **Planetary protection is a real constraint.** Some places need special procedures to avoid carrying Earth microbes there (Section 4.13). A planner that flags them looks professional.
10. **Honest limits.** Orbital data cannot see small rocks, climate data are statistics rather than forecasts, and several data endpoints are undocumented. Show these limits in the app; judges score validity.
11. **Costs.** Realtime voice is billed by audio volume (Section 8.5). Set a spending cap, and keep the offline voice as a fallback.
12. **The competition is public.** At least eight teams have already published repositories for this challenge (Section 3.4). Originality is required, so treat their work as context, never as code to reuse.
13. **Accessibility counts.** Captions, keyboard control and colour-blind-safe hazard patterns follow WCAG 2.2 (Section 8.7) and widen your audience.
14. **What happens after.** The same app can take in MMX's Phobos data from 2027, Rosalind Franklin's results after its 2030 landing, and Mangalyaan-2's. Mention this in slide 7.

## 16. Readiness audit and open questions

I re-read the whole paper on 28 October 2026 against your original brief, your later requests and the challenge. The result: it is complete enough to build from on 14 November. Section 16.2 lists the errors this audit fixed, and Section 16.3 lists what you must still check by hand.

### 16.1 Audit against your brief

| What you asked for | Where it is answered | Status |
| --- | --- | --- |
| Part 1: the challenge fully understood (statement, objectives, subjects, difficulty, resources, partners, expectations, plain meaning, what winning looks like, judging, submission, past winners) | Sections 2 and 3 | Done, except the official full text, its listed resources and the partner names, which automated tools still cannot read (16.3) |
| Part 2: every usable resource, ranked, with what, why, ease and how | Sections 5, 6, 7 and 9.4 | Done: four tiers, 17 agencies, every surface mission, free assets with licences |
| Part 3: licensed realistic voices, real terrain and walking, an accurate voice assistant, engines, physics, rendering, other categories | Sections 8 and 9 | Done |
| Part 4: an honest verdict on your six ideas, plus new ideas | Sections 10 and 11 | Done |
| Part 5: architecture, scope, risks, validation, competition, presentation, rules | Sections 3.4–3.5 and 12–15 | Done |
| Later requests: every agency, Mars in space with a real atmosphere, free assets and repos, the full Mars environment and its papers, nothing copied from competitors, past rover movements, videos, real 3D, Mars Trek, HiRISE and Esri OnMars | Sections 4.6–4.15, 6, 7, 8.7, 9 and 17 | Done |
| Every factual claim cited; facts separated from recommendations and assumptions | Labels in Section 1; 252 links in Section 18 | Done; secondary and unverified items are labelled where they appear |
| Ready to build: checked against the challenge, scene by scene, every site | Sections 12.6–12.8 | Added in this audit |

### 16.2 Errors found and fixed in this audit

- **Mission Control timing.** A reply to a question needs the round trip, about 22 minutes on 14 November 2026, not 11. Fixed in the executive summary, Sections 11, 12 and 14, and the architecture diagram.
- **Launch period.** My computed window starts in October, so it overlaps the November–December window in Section 4.5 rather than matching it. The wording is corrected.
- **Competitors.** Not all eight public entries walk on terrain; several do.
- **Viking and Pathfinder.** These rows now carry landing dates, coordinates and end dates from NSSDC and NASA. An unsourced "six years" was removed.
- **Smaller fixes.** OpenSpace's platforms are now stated as the project lists them, and the weather-station count now says "carried weather stations".
- **New facts this audit adds.**
  - Perseverance passed Opportunity's 45.16 km on 11 October 2026 (NASA).
  - USGS's set of over 900 HiRISE DTMs is CC0-1.0.
  - A 1 m HiRISE terrain mosaic of Jezero exists, made for Perseverance's landing.
  - Rover weather reaches the public archive with a delay of well over a Mars year, so "current conditions" are labelled as live, modelled or measured (Section 12.6).

### 16.3 Still unverified

Check these by hand before you rely on them.

| Item | Why it is open | How to settle it |
| --- | --- | --- |
| Full official challenge text, listed resources and partner agencies | The Space Apps site blocks automated readers | Paste the page text into a chat with me and I will reconcile Section 5 against it |
| The 17 host agencies by name | Only the total is published by CSA; the partner page is blocked | Read the official partner page |
| Submission deadline and time zone | Not in any readable source | The 2026 Project Submission Guide, due 13 November |
| Bengaluru local event details and rules on preparation | Not found | Ask the local lead in writing |
| Raw-image feeds and MMGIS JSON endpoints | Undocumented; may change | Snapshot during the event |
| Esri OnMars service terms and current layer list | Not stated on the pages read; the layer list is from 2019 | Read Esri's terms and the live service directory |
| Access Mars code and meshes | Not confirmed to be downloadable | Search the Google Creative Lab and JPL repositories |
| NASA DONKI details | Page found but not read | Read the CCMC page |
| Voice-model prices, the Gemini 3.8 Live report, ElevenLabs licensing | From secondary sources (Section 8.5) | Check each provider's pricing and terms pages |
| Perseverance's record distance (about 45.2 km) | From a news report | NASA's Perseverance blog |
| Rows marked SECONDARY in Sections 6 and 7 | Non-official sources | Replace with agency pages when you build the credits panel |
| Mars preset values for the CesiumJS sky | My assumption, to be tuned by eye | Compare with real images |
| Effort estimates in Sections 9, 11 and 13 | Judgement, not measurement | Revisit after the first six hours |
| Sol numbers in Section 4.6 | Computed from landing dates | Compare with the raw-image feeds |

## 17. Key research papers by topic

These are the papers behind the numbers in this paper, each linked to its publisher, DOI or an agency summary. Put the same links on the app's source cards.

### Interior and marsquakes

- Knapmeyer-Endrun et al. 2021, *Science*, thickness and structure of the crust: [doi:10.1126/science.abf8966](https://doi.org/10.1126/science.abf8966)
- Khan et al. 2021, *Science*, upper-mantle structure: [doi:10.1126/science.abf2966](https://doi.org/10.1126/science.abf2966)
- Stähler et al. 2021, *Science*, seismic detection of the core: [doi:10.1126/science.abi7730](https://doi.org/10.1126/science.abi7730)
- Samuel et al. 2023, *Nature*, a molten silicate layer above the core: [doi:10.1038/s41586-023-06601-8](https://doi.org/10.1038/s41586-023-06601-8)
- The InSight marsquake catalogue, sols 0–1011 (2022): [ETH Research Collection](https://www.research-collection.ethz.ch/entities/publication/3e5bcf11-d70f-4148-8277-fa84ba324c1f)
- Wright, Morzfeld and Manga 2024, *PNAS*, liquid water in the mid-crust: [UC Berkeley summary](https://eps.berkeley.edu/news/eps-professor-michael-manga-contributes-groundbreaking-discovery-subsurface-liquid-water-mars)
- Acuña et al. 1999, *Science*, crustal magnetisation: [NASA MGS release](https://mgs-mager.gsfc.nasa.gov/press/release_1999-56.html)

### Atmosphere, weather and climate

- Martínez et al. 2017, *Space Science Reviews*, near-surface climate from Viking to Curiosity: [doi:10.1007/s11214-017-0360-x](https://doi.org/10.1007/s11214-017-0360-x)
- Rodriguez-Manfredi et al. 2023, *Nature Geoscience* 16, 19–28, Jezero's meteorology: [doi:10.1038/s41561-022-01084-0](https://doi.org/10.1038/s41561-022-01084-0)
- Jiang et al. 2023, *Scientific Reports*, Zhurong's first 325 sols: [doi:10.1038/s41598-023-30513-2](https://doi.org/10.1038/s41598-023-30513-2)
- Forget et al. 2022, InSight meteorology over a Mars year: [Open Research Online](https://oro.open.ac.uk/86958)
- Webster et al. 2018, *Science*, seasonal methane; Eigenbrode et al. 2018, *Science*, ancient organics: [JPL summary](https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars)
- Jakosky et al. 2017, *Science*, atmospheric loss from argon isotopes: [LASP summary](https://lasp.colorado.edu/maven/2017/03/30/maven-reveals-most-of-mars-atmosphere-was-lost-to-space/)
- Bertaux et al. 2005, *Nature*, discovery of aurora on Mars: [Nature](https://www.nature.com/articles/nature03603); [ESA summary](https://sci.esa.int/web/mars-express/-/37525-discovery-of-an-aurora-on-mars)
- Knutsen et al., *Science Advances*, first visible-light aurora from the surface: [JPL summary](https://www.jpl.nasa.gov/news/nasa-observes-first-visible-light-auroras-at-mars/)
- Valantinas et al. 2024, *Nature Geoscience*, frost on the Tharsis volcanoes: [Royal Observatory of Belgium](https://www.astro.oma.be/en/first-evidence-of-water-frost-on-the-tallest-volcanoes-of-mars/)
- Allison and McEwen 2000, Mars solar time and seasons: [NTRS PDF](https://ntrs.nasa.gov/api/citations/20000097895/downloads/20000097895.pdf)
- Piqueux et al. 2015, *Icarus*, numbering of Mars years and seasons: [USGS record](https://pubs.usgs.gov/publication/70139666)

### Radiation and space weather

- Hassler et al. 2014, *Science*, the surface radiation environment: [NTRS record](https://ntrs.nasa.gov/citations/20180007641)
- Semkova et al. 2018, *Icarus*, Liulin-MO radiation results: [doi:10.1016/j.icarus.2017.12.034](https://doi.org/10.1016/j.icarus.2017.12.034)
- NASA's crew radiation-protection technical brief: [NASA PDF](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf)

### Water, ice and the poles

- Plaut et al. 2007, *Science* 316, 92–95, radar sounding of the south polar deposits: [ESA record](https://sci.esa.int/web/mars-express/-/41029-plaut-j-et-al-2007)
- Phillips et al. 2011, *Science*, buried CO₂ ice: [NASA release via ScienceDaily](https://www.sciencedaily.com/releases/2011/04/110421190450.htm)
- Kieffer et al. 2006, *Nature*, CO₂ jets under slab ice: [USGS record](https://pubs.usgs.gov/publication/70028279)
- Mitrofanov et al. 2021, *Icarus*, hydrogen in Valles Marineris: [ESA summary](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ExoMars_discovers_hidden_water_in_Mars_Grand_Canyon)
- Morgan et al. 2021, SWIM ice availability: [USGS record](https://pubs.usgs.gov/publication/70226786)
- Dundas et al. 2017, *Nature Geoscience*, streaks as granular flows: [JPL summary](https://www.jpl.nasa.gov/news/recurring-martian-streaks-flowing-sand-not-water/)
- Exposed ice in mid-latitude scarps (Dundas et al. 2018): [NASA](https://science.nasa.gov/photojournal/underground-martian-ice-deposit-exposed-at-scarp/)

### Geology and habitability

- Grotzinger et al., *Science* 343, the habitable lake at Yellowknife Bay: [NTRS record](https://ntrs.nasa.gov/citations/20150008374)
- Mangold et al. 2021, *Science*, Jezero's delta and floods: [CNRS summary](https://cnrs.fr/en/node/6157)
- Liu (Hai) et al. 2025, *PNAS*, coastal deposits imaged by Zhurong: [Astrobiology.com summary](https://astrobiology.com/2025/03/ancient-beaches-testify-to-a-long-ago-ocean-on-mars.html)
- Liu (Jianjun) et al. 2022, *Nature Astronomy*, the Zhurong landing site: [doi:10.1038/s41550-021-01519-5](https://doi.org/10.1038/s41550-021-01519-5)
- The Perseverance team's 2025 *Nature* paper on Cheyava Falls: [JPL summary](https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/)

### Human exploration and operations

- NASA Exploration EVA Concept of Operations, 2020: [NTRS PDF](https://ntrs.nasa.gov/api/citations/20200001071/downloads/20200001071.pdf)
- Apollo 17 traverse planning and walk-back: [NASA PDF](https://www.nasa.gov/wp-content/uploads/static/history/alsj/19790073512_1979073512.pdf)
- Mars Design Reference Architecture 5.0: [NASA PDF](https://www.nasa.gov/wp-content/uploads/2015/09/373665main_nasa-sp-2009-566.pdf)
- Human landing Exploration Zones: [NTRS 20160002370](https://ntrs.nasa.gov/api/citations/20160002370/downloads/20160002370.pdf)
- Mars 2020 trajectory reconstruction: [NTRS 20230006978](https://ntrs.nasa.gov/citations/20230006978)
- NASA's 2024 white paper on Mars entry, descent and landing: [NASA PDF](https://www.nasa.gov/wp-content/uploads/2024/12/acr24-mars-edl-challenges.pdf?emrc=d99c3e)
- NASA's Martian dust exposure limit: [NASA](https://www.nasa.gov/general/establishing-crew-exposure-limits-of-martian-dust/)

### Rendering and visualisation

- Schneegans et al. 2024, *Computer Graphics Forum*, real-time atmospheres from Mie theory: [doi:10.1111/cgf.15010](https://doi.org/10.1111/cgf.15010)
- Costa et al., atmospheric effects for celestial bodies in OpenSpace: [arXiv:2010.03534](https://arxiv.org/abs/2010.03534v1)
- Bruneton and Neyret 2008, *Precomputed Atmospheric Scattering*: [Eurographics Digital Library](https://diglib.eg.org/items/0af15b7c-795a-4cca-97d3-4cc9b99126e4)
- Maurice et al. 2022, sound on Mars: [CNRS summary](https://www.cnrs.fr/en/perseverance-records-first-ever-sounds-mars)

## 18. References: every link used

These are all 263 links cited in this paper, grouped by publisher; the 11 added in the readiness audit are listed last. The section that cites each one gives the context.

### Space Apps and the competition (25)

- [2019.spaceappschallenge.org/locations/northeastern-university](https://2019.spaceappschallenge.org/locations/northeastern-university/)
- [2020.spaceappschallenge.org/challenges/create/create-mascot/teams/curious-e…](https://2020.spaceappschallenge.org/challenges/create/create-mascot/teams/curious-explorers/stream)
- [blog.devstory.co.kr/en/post/nasa-space-app-challenge/index.html](https://blog.devstory.co.kr/en/post/nasa-space-app-challenge/index.html)
- [github.com/25243060-creator/martian-map-route-planner](https://github.com/25243060-creator/martian-map-route-planner)
- [github.com/AhsanulHoque22/Nasa-Space-Apps-Challenge-2026-Team-Protikriti](https://github.com/AhsanulHoque22/Nasa-Space-Apps-Challenge-2026-Team-Protikriti)
- [github.com/ahsanur-official/Interplanetary-Survival-Guide-Martian-Map](https://github.com/ahsanur-official/Interplanetary-Survival-Guide-Martian-Map)
- [github.com/Aluchashi/Martialoy](https://github.com/Aluchashi/Martialoy)
- [github.com/Aryan221224/MarsNav](https://github.com/Aryan221224/MarsNav)
- [github.com/Jarin4649/Jarin-s-Project-Mars.](https://github.com/Jarin4649/Jarin-s-Project-Mars.)
- [github.com/kmmohaimenulhaque-code/neuronexus-mars-survival](https://github.com/kmmohaimenulhaque-code/neuronexus-mars-survival)
- [github.com/lkorth/mars-traverse](https://github.com/lkorth/mars-traverse)
- [github.com/RISHI-1453/NASA\_Space-Apps\_Challenge\_Martian\_Map](https://github.com/RISHI-1453/NASA_Space-Apps_Challenge_Martian_Map)
- [github.com/stoicsatvik/martian](https://github.com/stoicsatvik/martian)
- [internshala.com/competitions/nasa-international-space-apps-challenge-2026-r…](https://internshala.com/competitions/nasa-international-space-apps-challenge-2026-registration/)
- [legacy.spaceappschallenge.org/resources/faq](https://legacy.spaceappschallenge.org/resources/faq/)
- [news.sciencex.in/nasa-announces-2025-international-space-apps-challenge-glo…](https://news.sciencex.in/nasa-announces-2025-international-space-apps-challenge-global-winners)
- [socialnews.xyz/2025/12/18/indian-teams-satellite-internet-concept-wins-nasa…](https://www.socialnews.xyz/2025/12/18/indian-teams-satellite-internet-concept-wins-nasas-2025-space-apps-challenge/amp/)
- [spaceappschallenge.org/2025/awards](https://www.spaceappschallenge.org/2025/awards/)
- [spaceappschallenge.org/2025/meet-the-2025-global-winners](https://www.spaceappschallenge.org/2025/meet-the-2025-global-winners/)
- [spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martia…](https://www.spaceappschallenge.org/2026/challenges/interplanetary-survival-guide-martian-map/)
- [spaceappschallenge.org/legal](https://www.spaceappschallenge.org/legal/)
- [spaceappschallenge.org/resources/judging-awards-guide](https://spaceappschallenge.org/resources/judging-awards-guide)
- [spaceappschallenge.org/resources/participant-faqs](https://www.spaceappschallenge.org/resources/participant-faqs/)
- [spaceappschallenge.org/resources/project-submission-guide](https://www.spaceappschallenge.org/resources/project-submission-guide/)
- [therecursive.com/nasa-space-apps-challenge-2026-where-to-join-it-in-cee](https://therecursive.com/nasa-space-apps-challenge-2026-where-to-join-it-in-cee)

### NASA and JPL (68)

- [api.nasa.gov/mars-wmts/catalog](https://api.nasa.gov/mars-wmts/catalog)
- [blogs.nasa.gov/analogsfieldtesting?p=654](https://blogs.nasa.gov/analogsfieldtesting/?p=654)
- [ccmc.gsfc.nasa.gov/tools/DONKI](https://ccmc.gsfc.nasa.gov/tools/DONKI/)
- [giss.nasa.gov/tools/mars24/help/credits.html](https://www.giss.nasa.gov/tools/mars24/help/credits.html)
- [images.nasa.gov/docs/images.nasa.gov\_api\_docs.pdf](https://images.nasa.gov/docs/images.nasa.gov_api_docs.pdf)
- [jpl.nasa.gov/images/pia11200-lidar-measurements-of-snow-falling-from-martia…](https://www.jpl.nasa.gov/images/pia11200-lidar-measurements-of-snow-falling-from-martian-clouds/)
- [jpl.nasa.gov/images/pia25179-perseverances-mastcam-z-captures-a-phobos-sola…](https://www.jpl.nasa.gov/images/pia25179-perseverances-mastcam-z-captures-a-phobos-solar-eclipse)
- [jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on…](https://www.jpl.nasa.gov/news/nasa-finds-ancient-organic-material-mysterious-methane-on-mars)
- [jpl.nasa.gov/news/nasa-mars-rover-curiosity-sees-evening-star-earth](https://www.jpl.nasa.gov/news/nasa-mars-rover-curiosity-sees-evening-star-earth/)
- [jpl.nasa.gov/news/nasa-observes-first-visible-light-auroras-at-mars](https://www.jpl.nasa.gov/news/nasa-observes-first-visible-light-auroras-at-mars/)
- [jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-la…](https://www.jpl.nasa.gov/news/nasa-says-mars-rover-discovered-potential-biosignature-last-year/)
- [jpl.nasa.gov/news/nasas-perseverance-captures-dust-filled-martian-whirlwind](https://www.jpl.nasa.gov/news/nasas-perseverance-captures-dust-filled-martian-whirlwind)
- [jpl.nasa.gov/news/press\_kits/mars\_2020/landing/mission](https://www.jpl.nasa.gov/news/press_kits/mars_2020/landing/mission)
- [jpl.nasa.gov/news/recurring-martian-streaks-flowing-sand-not-water](https://www.jpl.nasa.gov/news/recurring-martian-streaks-flowing-sand-not-water/)
- [jpl.nasa.gov/news/take-a-3d-spin-on-mars-and-track-nasas-perseverance-rover](https://www.jpl.nasa.gov/news/take-a-3d-spin-on-mars-and-track-nasas-perseverance-rover/)
- [mars.nasa.gov/mmgis-maps](https://mars.nasa.gov/mmgis-maps/)
- [mars.nasa.gov/rss/api?feed=raw\_images&category=mars2020,ingenuity&feedtype=…](https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020,ingenuity&feedtype=json&ver=1.2&latest=true)
- [mgs-mager.gsfc.nasa.gov/press/release\_1999-56.html](https://mgs-mager.gsfc.nasa.gov/press/release_1999-56.html)
- [naif.jpl.nasa.gov/pub/naif/pds/pds4/mars2020/mars2020\_spice/document/spiced…](https://naif.jpl.nasa.gov/pub/naif/pds/pds4/mars2020/mars2020_spice/document/spiceds_v003.html)
- [nasa.gov/general/establishing-crew-exposure-limits-of-martian-dust](https://www.nasa.gov/general/establishing-crew-exposure-limits-of-martian-dust/)
- [nasa.gov/hrp/hazards](https://www.nasa.gov/hrp/hazards)
- [nasa.gov/image-article/a-rainbow-colored-feather-in-the-martian-sky](https://www.nasa.gov/image-article/a-rainbow-colored-feather-in-the-martian-sky)
- [nasa.gov/missions/insight/nasas-insight-lander-detects-stunning-meteoroid-i…](https://www.nasa.gov/missions/insight/nasas-insight-lander-detects-stunning-meteoroid-impact-on-mars)
- [nasa.gov/missions/insight/nasas-insight-records-monster-quake-on-mars](https://www.nasa.gov/missions/insight/nasas-insight-records-monster-quake-on-mars)
- [nasa.gov/missions/mars-2020-perseverance/nasas-perseverance-offers-clues-to…](https://www.nasa.gov/missions/mars-2020-perseverance/nasas-perseverance-offers-clues-to-protect-crews-from-mars-dust/)
- [nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm](https://www.nasa.gov/missions/maven/nasa-watches-mars-light-up-during-epic-solar-storm/)
- [nasa.gov/nasa-brand-center/images-and-media](https://nasa.gov/nasa-brand-center/images-and-media)
- [nasa.gov/press-release/nasa-s-ingenuity-mars-helicopter-succeeds-in-histori…](https://nasa.gov/press-release/nasa-s-ingenuity-mars-helicopter-succeeds-in-historic-first-flight)
- [nasa.gov/solar-system/planets/mars/nasas-mars-fleet-will-still-conduct-scie…](https://www.nasa.gov/solar-system/planets/mars/nasas-mars-fleet-will-still-conduct-science-while-lying-low)
- [nasa.gov/wp-content/uploads/2015/09/373665main\_nasa-sp-2009-566.pdf](https://www.nasa.gov/wp-content/uploads/2015/09/373665main_nasa-sp-2009-566.pdf)
- [nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-oc…](https://www.nasa.gov/wp-content/uploads/2023/03/radiation-protection-technical-brief-ochmo.pdf)
- [nasa.gov/wp-content/uploads/2024/12/acr24-mars-edl-challenges.pdf](https://www.nasa.gov/wp-content/uploads/2024/12/acr24-mars-edl-challenges.pdf?emrc=d99c3e)
- [nasa.gov/wp-content/uploads/static/history/alsj/19790073512\_1979073512.pdf](https://www.nasa.gov/wp-content/uploads/static/history/alsj/19790073512_1979073512.pdf)
- [nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html](https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html?embed=true)
- [nssdc.gsfc.nasa.gov/planetary/text/mo2001\_pr\_20020528.txt](https://nssdc.gsfc.nasa.gov/planetary/text/mo2001_pr_20020528.txt)
- [ntrs.nasa.gov/api/citations/20000097895/downloads/20000097895.pdf](https://ntrs.nasa.gov/api/citations/20000097895/downloads/20000097895.pdf)
- [ntrs.nasa.gov/api/citations/20130010385/downloads/20130010385.pdf](https://ntrs.nasa.gov/api/citations/20130010385/downloads/20130010385.pdf)
- [ntrs.nasa.gov/api/citations/20160002370/downloads/20160002370.pdf](https://ntrs.nasa.gov/api/citations/20160002370/downloads/20160002370.pdf)
- [ntrs.nasa.gov/api/citations/20170002903/downloads/20170002903.pdf](https://ntrs.nasa.gov/api/citations/20170002903/downloads/20170002903.pdf)
- [ntrs.nasa.gov/api/citations/20200001071/downloads/20200001071.pdf](https://ntrs.nasa.gov/api/citations/20200001071/downloads/20200001071.pdf)
- [ntrs.nasa.gov/citations/20150008374](https://ntrs.nasa.gov/citations/20150008374)
- [ntrs.nasa.gov/citations/20180007641](https://ntrs.nasa.gov/citations/20180007641)
- [ntrs.nasa.gov/citations/20230006978](https://ntrs.nasa.gov/citations/20230006978)
- [science.nasa.gov/3d-resources/mars-phobos](https://science.nasa.gov/3d-resources/mars-phobos)
- [science.nasa.gov/blogs/escapade/2025/11](https://science.nasa.gov/blogs/escapade/2025/11)
- [science.nasa.gov/eyes](https://science.nasa.gov/eyes/)
- [science.nasa.gov/mars/facts](https://science.nasa.gov/mars/facts/)
- [science.nasa.gov/mars/moons/facts](https://science.nasa.gov/mars/moons/facts)
- [science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter](https://science.nasa.gov/mission/mars-2020-perseverance/ingenuity-mars-helicopter/)
- [science.nasa.gov/mission/mars-2020-perseverance/location-map](https://science.nasa.gov/mission/mars-2020-perseverance/location-map/)
- [science.nasa.gov/mission/msl-curiosity/location-map](https://science.nasa.gov/mission/msl-curiosity/location-map/)
- [science.nasa.gov/open-science/mars-mapping-open-source](https://science.nasa.gov/open-science/mars-mapping-open-source)
- [science.nasa.gov/photojournal/seasonal-pressure-curve-peaks-at-gale-crater](https://science.nasa.gov/photojournal/seasonal-pressure-curve-peaks-at-gale-crater)
- [science.nasa.gov/photojournal/sunset-in-mars-gale-crater](https://science.nasa.gov/photojournal/sunset-in-mars-gale-crater/)
- [science.nasa.gov/photojournal/underground-martian-ice-deposit-exposed-at-scarp](https://science.nasa.gov/photojournal/underground-martian-ice-deposit-exposed-at-scarp/)
- [science.nasa.gov/resource/driving-distances-on-mars-and-the-moon](https://science.nasa.gov/resource/driving-distances-on-mars-and-the-moon/)
- [science.nasa.gov/resource/dropping-in-on-mars-a-rovers-eye-view](https://science.nasa.gov/resource/dropping-in-on-mars-a-rovers-eye-view)
- [science.nasa.gov/resource/mars-perseverance-rover-3d-model](https://science.nasa.gov/resource/mars-perseverance-rover-3d-model/)
- [science.nasa.gov/resource/nasas-perseverance-rover-microphone-captures-soun…](https://science.nasa.gov/resource/nasas-perseverance-rover-microphone-captures-sounds-from-mars/)
- [science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-spac…](https://science.nasa.gov/universe/nasa-welcomes-all-ages-experience-levels-for-space-apps-challenge/)
- [solarsystem.nasa.gov/news/469/10-things-massive-dust-storm-on-mars](https://solarsystem.nasa.gov/news/469/10-things-massive-dust-storm-on-mars)
- [ssd-api.jpl.nasa.gov/doc/horizons.html](https://ssd-api.jpl.nasa.gov/doc/horizons.html)
- [ssd.jpl.nasa.gov/planets/approx\_pos.html](https://ssd.jpl.nasa.gov/planets/approx_pos.html)
- [svs.gsfc.nasa.gov/13784](https://svs.gsfc.nasa.gov/13784/)
- [svs.gsfc.nasa.gov/31250](https://svs.gsfc.nasa.gov/31250)
- [svs.gsfc.nasa.gov/4851](https://svs.gsfc.nasa.gov/4851)
- [trajbrowser.arc.nasa.gov](https://trajbrowser.arc.nasa.gov)
- [trajbrowser.arc.nasa.gov/user\_guide.php](https://trajbrowser.arc.nasa.gov/user_guide.php)

### Archives, USGS and mission science teams (28)

- [an.rsl.wustl.edu](https://an.rsl.wustl.edu/)
- [an.rsl.wustl.edu/mer](https://an.rsl.wustl.edu/mer/)
- [astrogeology.usgs.gov/search/map/mars-mro-ctx-global-mosaic-murray-lab-v1](https://astrogeology.usgs.gov/search/map/mars-mro-ctx-global-mosaic-murray-lab-v1)
- [astrogeology.usgs.gov/search/map/mars\_mgs\_mola\_mex\_hrsc\_blended\_dem\_global\_…](https://astrogeology.usgs.gov/search/map/mars_mgs_mola_mex_hrsc_blended_dem_global_200m)
- [b2find.eudat.eu/dataset/54d7a117-ae0c-568b-9715-d186447e6317](https://b2find.eudat.eu/dataset/54d7a117-ae0c-568b-9715-d186447e6317)
- [hirise.lpl.arizona.edu/HiCat/images/PSP/PSP\_001483\_1545](https://hirise.lpl.arizona.edu/HiCat/images/PSP/PSP_001483_1545)
- [jmars.asu.edu/node/2844](https://jmars.asu.edu/node/2844)
- [lasp.colorado.edu/maven/2017/03/30/maven-reveals-most-of-mars-atmosphere-wa…](https://lasp.colorado.edu/maven/2017/03/30/maven-reveals-most-of-mars-atmosphere-was-lost-to-space/)
- [lasp.colorado.edu/missions/emm-hope](https://lasp.colorado.edu/missions/emm-hope/)
- [mrbrowse.issdc.gov.in/MOMLTA](https://mrbrowse.issdc.gov.in/MOMLTA/)
- [murray-lab.caltech.edu/CTX](https://murray-lab.caltech.edu/CTX/)
- [ode.rsl.wustl.edu/mars/pagehelp/Content/Additional\_Resources/ODE\_REST\_API.htm](https://ode.rsl.wustl.edu/mars/pagehelp/Content/Additional_Resources/ODE_REST_API.htm)
- [open.canada.ca/data/en/dataset/0e338f52-25e4-465c-8104-bb9d7c8d3df3](https://open.canada.ca/data/en/dataset/0e338f52-25e4-465c-8104-bb9d7c8d3df3)
- [oro.open.ac.uk/86958](https://oro.open.ac.uk/86958)
- [pds-atmospheres.nmsu.edu/data\_and\_services/atmospheres\_data/MARS/curiosity/…](https://pds-atmospheres.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/dan.html)
- [pds-geosciences.wustl.edu/workshops/PSCW2026/PSCW\_ODE\_2026.pdf](https://pds-geosciences.wustl.edu/workshops/PSCW2026/PSCW_ODE_2026.pdf)
- [pradan.issdc.gov.in](https://pradan.issdc.gov.in/)
- [pubs.usgs.gov/publication/70028279](https://pubs.usgs.gov/publication/70028279)
- [pubs.usgs.gov/publication/70139666](https://pubs.usgs.gov/publication/70139666)
- [pubs.usgs.gov/publication/70226786](https://pubs.usgs.gov/publication/70226786)
- [research-collection.ethz.ch/entities/publication/3e5bcf11-d70f-4148-8277-fa…](https://www.research-collection.ethz.ch/entities/publication/3e5bcf11-d70f-4148-8277-fa84ba324c1f)
- [stac.astrogeology.usgs.gov/docs/data/mars/hirise\_dtms](https://stac.astrogeology.usgs.gov/docs/data/mars/hirise_dtms/)
- [swim.psi.edu](https://swim.psi.edu)
- [uahirise.org/dtm/about.php](https://www.uahirise.org/dtm/about.php)
- [uahirise.org/media/usage.php](https://uahirise.org/media/usage.php)
- [usgs.gov/maps/geologic-map-jezero-crater-and-nili-planum-region-mars](https://www.usgs.gov/maps/geologic-map-jezero-crater-and-nili-planum-region-mars)
- [usgs.gov/media/112477](https://www.usgs.gov/media/112477)
- [usgs.gov/publications/availability-subsurface-water-ice-resources-northern-…](https://www.usgs.gov/publications/availability-subsurface-water-ice-resources-northern-mid-latitudes-mars)

### ESA and European agencies and institutes (33)

- [adlershof.de/en/news/the-sound-of-mars](https://adlershof.de/en/news/the-sound-of-mars)
- [astro.oma.be/en/a-molten-layer-at-the-base-of-the-martian-mantle](https://www.astro.oma.be/en/a-molten-layer-at-the-base-of-the-martian-mantle/)
- [astro.oma.be/en/first-evidence-of-water-frost-on-the-tallest-volcanoes-of-mars](https://www.astro.oma.be/en/first-evidence-of-water-frost-on-the-tallest-volcanoes-of-mars/)
- [cab.inta-csic.es/en?p=29215](https://cab.inta-csic.es/en/?p=29215)
- [cgvr.cs.uni-bremen.de/papers/cgf24/v43i2\_15\_15010.pdf](https://cgvr.cs.uni-bremen.de/papers/cgf24/v43i2_15_15010.pdf)
- [cnrs.fr/en/node/6157](https://cnrs.fr/en/node/6157)
- [cnrs.fr/en/perseverance-records-first-ever-sounds-mars](https://www.cnrs.fr/en/perseverance-records-first-ever-sounds-mars)
- [cosmos.esa.int/web/psa/exomars2016](https://www.cosmos.esa.int/web/psa/exomars2016)
- [dlr.de/en/latest/news/2021/03/20210722\_the-red-planet-has-a-larger-core-and…](https://www.dlr.de/en/latest/news/2021/03/20210722_the-red-planet-has-a-larger-core-and-a-thinner-crust)
- [dlr.de/en/media/videos/2024/video-a-virtual-flight-over-the-ares-vallis-reg…](https://www.dlr.de/en/media/videos/2024/video-a-virtual-flight-over-the-ares-vallis-region-on-mars)
- [elib.dlr.de/106090](https://elib.dlr.de/106090)
- [eps.berkeley.edu/news/eps-professor-michael-manga-contributes-groundbreakin…](https://eps.berkeley.edu/news/eps-professor-michael-manga-contributes-groundbreaking-discovery-subsurface-liquid-water-mars)
- [esa-pro.space.bas.bg/node/82](https://esa-pro.space.bas.bg/node/82)
- [esa.int/ESA\_Multimedia/Images/2026/10/MMX\_lifts\_off\_to\_Mars\_s\_moon\_Phobos](https://www.esa.int/ESA_Multimedia/Images/2026/10/MMX_lifts_off_to_Mars_s_moon_Phobos)
- [esa.int/ESA\_Multimedia/Videos/2025/10/Fly\_over\_Xanthe\_Terra\_with\_Mars\_Expre…](<https://www.esa.int/ESA_Multimedia/Videos/2025/10/Fly_over_Xanthe_Terra_with_Mars_Express/(lang)>)
- [esa.int/esaCP/SEMEV8TX55H\_index\_0.html](https://www.esa.int/esaCP/SEMEV8TX55H_index_0.html)
- [esa.int/…/ESA\_s\_Mars\_orbiters\_did\_not\_see\_latest\_Curiosity\_methane\_burst](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ESA_s_Mars_orbiters_did_not_see_latest_Curiosity_methane_burst)
- [esa.int/…/ExoMars\_discovers\_hidden\_water\_in\_Mars\_Grand\_Canyon](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/ExoMars_discovers_hidden_water_in_Mars_Grand_Canyon)
- [esa.int/…/FAQ\_The\_rebirth\_of\_ESA\_s\_ExoMars\_Rosalind\_Franklin\_mission](https://esa.int/Science_Exploration/Human_and_Robotic_Exploration/Exploration/ExoMars/FAQ_The_rebirth_of_ESA_s_ExoMars_Rosalind_Franklin_mission)
- [esa.int/Science\_Exploration/Space\_Science/Mars\_Express/Geography\_of\_Mars](https://www.esa.int/Science_Exploration/Space_Science/Mars_Express/Geography_of_Mars)
- [jahresbericht2019.unibe.ch/key\_areas/matter\_and\_the\_universe/cassis/index\_e…](https://jahresbericht2019.unibe.ch/key_areas/matter_and_the_universe/cassis/index_eng.html)
- [nomad.aeronomie.be/data-psa-users](https://nomad.aeronomie.be/data-psa-users)
- [planet.geo.fu-berlin.de/eng/projects/mars/hrsc005-DarkSpot.php](https://planet.geo.fu-berlin.de/eng/projects/mars/hrsc005-DarkSpot.php)
- [research.fi/en/results/dataset/03bfae7b-acf6-4fd7-889a-fa046cf17211](https://research.fi/en/results/dataset/03bfae7b-acf6-4fd7-889a-fa046cf17211)
- [sci.esa.int/web/home/-/30215-the-martian-atmosphere](https://sci.esa.int/web/home/-/30215-the-martian-atmosphere)
- [sci.esa.int/web/mars-express/-/37525-discovery-of-an-aurora-on-mars](https://sci.esa.int/web/mars-express/-/37525-discovery-of-an-aurora-on-mars)
- [sci.esa.int/web/mars-express/-/41029-plaut-j-et-al-2007](https://sci.esa.int/web/mars-express/-/41029-plaut-j-et-al-2007)
- [sci.esa.int/web/mars-express/-/55263-beagle-2-lander-found-on-mars](https://sci.esa.int/web/mars-express/-/55263-beagle-2-lander-found-on-mars)
- [sci.esa.int/web/mars-express/-/57864-mars-webcam-goes-pro](https://sci.esa.int/web/mars-express/-/57864-mars-webcam-goes-pro)
- [ucl.ac.uk/mathematical-physical-sciences/news/2025/apr/uk-firm-land-mars-ro…](https://www.ucl.ac.uk/mathematical-physical-sciences/news/2025/apr/uk-firm-land-mars-rover-ucl-built-eyes)
- [www-mars.lmd.jussieu.fr/mars/access.html](https://www-mars.lmd.jussieu.fr/mars/access.html)
- [www-mars.lmd.jussieu.fr/mars/time/mars\_date\_to\_earth\_date.html](https://www-mars.lmd.jussieu.fr/mars/time/mars_date_to_earth_date.html)
- [www-mars.lmd.jussieu.fr/mcd\_python](https://www-mars.lmd.jussieu.fr/mcd_python)

### Other space agencies (7)

- [asc-csa.gc.ca/eng/events/2026/2026-11-14-space-apps-challenge.asp](https://www.asc-csa.gc.ca/eng/events/2026/2026-11-14-space-apps-challenge.asp)
- [english.casad.cas.cn/newsroom/ma/202609/t20260908\_1192779.html](https://english.casad.cas.cn/newsroom/ma/202609/t20260908_1192779.html)
- [global.jaxa.jp/press/2026/10/20261020-1\_e.html](https://global.jaxa.jp/press/2026/10/20261020-1_e.html)
- [isro.gov.in/Mars Orbiter Mission.html](https://www.isro.gov.in/Mars%20Orbiter%20Mission.html)
- [mmx.jaxa.jp/en](https://www.mmx.jaxa.jp/en/)
- [new1.isro.gov.in/MOM released.html](https://new1.isro.gov.in/MOM%20released.html)
- [space.gov.ae/en/media-center/news/15/2/2023/hope-probe-uncovers-new-scienti…](https://space.gov.ae/en/media-center/news/15/2/2023/hope-probe-uncovers-new-scientific-observations-in-its-sixth-batch-of-scientific-data)

### Papers and journals (18)

- [arxiv.org/abs/2010.03534v1](https://arxiv.org/abs/2010.03534v1)
- [diglib.eg.org/items/0af15b7c-795a-4cca-97d3-4cc9b99126e4](https://diglib.eg.org/items/0af15b7c-795a-4cca-97d3-4cc9b99126e4)
- [doaj.org/article/f3c95d17c7f84f95bb67b6f0bb2ee2a5](https://doaj.org/article/f3c95d17c7f84f95bb67b6f0bb2ee2a5)
- [doi.org/10.1007/s11214-017-0360-x](https://doi.org/10.1007/s11214-017-0360-x)
- [doi.org/10.1016/j.icarus.2017.12.034](https://doi.org/10.1016/j.icarus.2017.12.034)
- [doi.org/10.1038/s41550-021-01519-5](https://doi.org/10.1038/s41550-021-01519-5)
- [doi.org/10.1038/s41561-022-01084-0](https://doi.org/10.1038/s41561-022-01084-0)
- [doi.org/10.1038/s41586-023-06601-8](https://doi.org/10.1038/s41586-023-06601-8)
- [doi.org/10.1038/s41598-023-30513-2](https://doi.org/10.1038/s41598-023-30513-2)
- [doi.org/10.1111/cgf.15010](https://doi.org/10.1111/cgf.15010)
- [doi.org/10.1126/science.abf2966](https://doi.org/10.1126/science.abf2966)
- [doi.org/10.1126/science.abf8966](https://doi.org/10.1126/science.abf8966)
- [doi.org/10.1126/science.abi7730](https://doi.org/10.1126/science.abi7730)
- [doi.org/10.5281/zenodo.3381953](https://doi.org/10.5281/zenodo.3381953)
- [link.springer.com/10.1007/s11214-017-0360-x](https://link.springer.com/10.1007/s11214-017-0360-x)
- [link.springer.com/10.1038/s41550-021-01519-5](https://link.springer.com/10.1038/s41550-021-01519-5)
- [link.springer.com/article/10.1038/s41561-022-01084-0](https://link.springer.com/article/10.1038/s41561-022-01084-0)
- [nature.com/articles/nature03603](https://www.nature.com/articles/nature03603)

### Software, standards and tools (37)

- [blog.google/products/google-ar-vr/helping-nasa-and-jpl-bring-surface-mars-y…](https://blog.google/products/google-ar-vr/helping-nasa-and-jpl-bring-surface-mars-your-browser/)
- [cesium.com/blog/2025/09/03/lift-off-to-cesium-mars](https://cesium.com/blog/2025/09/03/lift-off-to-cesium-mars/)
- [cesium.com/downloads/cesiumjs/releases/1.127/Build/Documentation/Atmosphere…](https://cesium.com/downloads/cesiumjs/releases/1.127/Build/Documentation/Atmosphere.html)
- [cesium.com/learn/cesiumjs/ref-doc/SkyAtmosphere.html](https://cesium.com/learn/cesiumjs/ref-doc/SkyAtmosphere.html)
- [cesium.com/learn/unreal/unreal-moon-mars](https://cesium.com/learn/unreal/unreal-moon-mars/)
- [cesium.com/platform/cesium-ion/content/cesium-mars](https://cesium.com/platform/cesium-ion/content/cesium-mars/)
- [classic.yarnpkg.com/en/package/@dimforge/rapier3d](https://classic.yarnpkg.com/en/package/@dimforge/rapier3d)
- [community.cesium.com/t/cesium-release-roundup/14210](https://community.cesium.com/t/cesium-release-roundup/14210?page=3)
- [dev.epicgames.com/documentation/unreal-engine/sky-atmosphere-component-in-u…](https://dev.epicgames.com/documentation/unreal-engine/sky-atmosphere-component-in-unreal-engine)
- [developer.mozilla.org/en-US/docs/Web/API/WebXR\_API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_API)
- [developers.arcgis.com/javascript/latest/sample-code/mars/index.html](https://developers.arcgis.com/javascript/latest/sample-code/mars/index.html)
- [docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-…](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/models/gemini/2-5-flash-live-api?authuser=2)
- [docs.rs/mars\_raw\_utils/latest/src/mars\_raw\_utils/constants.rs.html](https://docs.rs/mars_raw_utils/latest/src/mars_raw_utils/constants.rs.html)
- [docs.sarvam.ai/api/getting-started/models/bulbul](https://docs.sarvam.ai/api/getting-started/models/bulbul)
- [esri.com/arcgis-blog/products/arcgis-online/imagery/observing-the-red-planet](https://www.esri.com/arcgis-blog/products/arcgis-online/imagery/observing-the-red-planet)
- [forasoft.com/blog/article/pipecat-vs-livekit-agents](https://www.forasoft.com/blog/article/pipecat-vs-livekit-agents)
- [github.com/cosmoscout/cosmoscout-vr](https://github.com/cosmoscout/cosmoscout-vr)
- [github.com/NASA-AMMOS/3DTilesRendererJS](https://github.com/NASA-AMMOS/3DTilesRendererJS)
- [github.com/NASA-AMMOS/MMGIS](https://github.com/NASA-AMMOS/MMGIS)
- [github.com/NASA-AMMOS/timecraftjs](https://github.com/NASA-AMMOS/timecraftjs)
- [github.com/nasa/NASA-3D-Resources](https://github.com/nasa/NASA-3D-Resources)
- [github.com/pipecat-ai/pipecat](https://github.com/pipecat-ai/pipecat)
- [hapsira.readthedocs.io](https://hapsira.readthedocs.io/)
- [licenses.dev/npm/cesium/1.139.1](https://licenses.dev/npm/cesium/1.139.1)
- [marssi.univ-lyon1.fr/wiki/HiRISE](https://marssi.univ-lyon1.fr/wiki/HiRISE)
- [marstime.readthedocs.io/en/latest/marstime.html](https://marstime.readthedocs.io/en/latest/marstime.html)
- [npmjs.com/package/@takram/three-atmosphere](https://www.npmjs.com/package/@takram/three-atmosphere)
- [npmjs.com/package/kokoro-js](https://www.npmjs.com/package/kokoro-js)
- [openspaceproject.com/about/about.html](https://openspaceproject.com/about/about.html)
- [openspaceproject.com/features/globe-browsing.html](https://openspaceproject.com/features/globe-browsing.html)
- [openspaceproject.com/s/Data-Set-Guide-for-Mars.pdf](https://www.openspaceproject.com/s/Data-Set-Guide-for-Mars.pdf)
- [pypi.org/project/npt](https://pypi.org/project/npt/)
- [unpkg.com/@dimforge/rapier3d@0.17.3/README.md](https://unpkg.com/@dimforge/rapier3d@0.17.3/README.md)
- [unpkg.com/@takram/three-atmosphere@0.13.2/README.md](https://unpkg.com/@takram/three-atmosphere@0.13.2/README.md)
- [w3.org/TR/2023/REC-WCAG22-20231005](https://www.w3.org/TR/2023/REC-WCAG22-20231005/)
- [w3.org/TR/service-workers](https://www.w3.org/TR/service-workers/)
- [withone.ai/knowledge/nasa (Mars Trek WMTS summary)](https://www.withone.ai/knowledge/nasa/conn_mod_def%3A%3AGMkvi4bYJIA%3A%3ATp9sKbaITguCZ2w69T5HDQ)

### News, reference and other secondary sources (36)

- [19fortyfive.com/2026/08/the-mars-launch-window-opens-in-november-2026-and-c…](https://www.19fortyfive.com/2026/08/the-mars-launch-window-opens-in-november-2026-and-closes-about-a-month-later-the-next-one-is-in-2029/)
- [aljazeera.com/news/2021/6/27/china-releases-new-video-and-still-from-mars-r…](https://www.aljazeera.com/news/2021/6/27/china-releases-new-video-and-still-from-mars-rover)
- [astrobiology.com/2024/08/global-color-image-dataset-and-map-of-mars-by-tian…](https://astrobiology.com/2024/08/global-color-image-dataset-and-map-of-mars-by-tianwen-1.html)
- [astrobiology.com/2025/03/ancient-beaches-testify-to-a-long-ago-ocean-on-mar…](https://astrobiology.com/2025/03/ancient-beaches-testify-to-a-long-ago-ocean-on-mars.html)
- [astrobiology.com/2026/09/04/mars-curiosity-reaches-1-kilometer-elevation-gain](https://astrobiology.com/2026/09/04/mars-curiosity-reaches-1-kilometer-elevation-gain/)
- [astrobiology.com/2026/09/04/registration-is-now-open-for-the-2026-nasa-spac…](https://astrobiology.com/2026/09/04/registration-is-now-open-for-the-2026-nasa-space-apps-challenge/)
- [cbc.ca/news/science/mars-bound-rock-analyzer-a-new-step-for-canada-in-space…](https://www.cbc.ca/news/science/mars-bound-rock-analyzer-a-new-step-for-canada-in-space-1.1007601)
- [core.ac.uk/works/15254764](https://core.ac.uk/works/15254764)
- [datanorth.ai/news/openai-releases-gpt-realtime-2-1-voice-models](https://datanorth.ai/news/openai-releases-gpt-realtime-2-1-voice-models)
- [earthsky.org/space/insight-falls-silent-nasa-declares-mission-end](https://earthsky.org/space/insight-falls-silent-nasa-declares-mission-end/)
- [en.wikipedia.org/wiki/2018\_Mars\_global\_dust\_storm](https://en.wikipedia.org/wiki/2018_Mars_global_dust_storm)
- [en.wikipedia.org/wiki/Bradbury\_Landing](https://en.wikipedia.org/wiki/Bradbury_Landing)
- [en.wikipedia.org/wiki/NASA\_International\_Space\_Apps\_Challenge](https://en.wikipedia.org/wiki/NASA_International_Space_Apps_Challenge)
- [en.wikipedia.org/wiki/Octavia\_E.\_Butler\_Landing](https://en.wikipedia.org/wiki/Octavia_E._Butler_Landing)
- [en.wikipedia.org/wiki/SHARAD](https://en.wikipedia.org/wiki/SHARAD)
- [guinnessworldrecords.com/world-records/103439-first-spacecraft-to-reach-the…](https://www.guinnessworldrecords.com/world-records/103439-first-spacecraft-to-reach-the-surface-of-mars)
- [gulfnews.com/amp/story/uae/uae-extends-emirates-mars-mission-to-2028-as-hop…](https://gulfnews.com/amp/story/uae%2Fuae-extends-emirates-mars-mission-to-2028-as-hope-probe-marks-five-years-1.500445958)
- [indiatvnews.com/science/isro-confirms-mangalyaan-2-mission-india-to-attempt…](https://www.indiatvnews.com/science/isro-confirms-mangalyaan-2-mission-india-to-attempt-first-mars-landing-in-2030-2025-11-06-1016099)
- [livescience.com/mars-sinuous-discrete-aurora](https://livescience.com/mars-sinuous-discrete-aurora)
- [mer.vin/news/gemini-3-8-live-adds-extended-thinking-to-real-time-multimodal-ai](https://mer.vin/news/gemini-3-8-live-adds-extended-thinking-to-real-time-multimodal-ai/)
- [news.agu.org/press-release/maven-mission-reveals-speed-of-solar-wind-stripp…](https://news.agu.org/press-release/maven-mission-reveals-speed-of-solar-wind-stripping-martian-atmosphere/)
- [oakgen.ai/blog/elevenlabs-free-commercial-use](https://oakgen.ai/blog/elevenlabs-free-commercial-use)
- [planetary.org/articles/mars-calendar](https://www.planetary.org/articles/mars-calendar)
- [r-bloggers.com/2025/11/perseverance](https://www.r-bloggers.com/2025/11/perseverance/)
- [satelliteprome.com/news/hope-probe-reveals-new-observations-about-the-marti…](https://satelliteprome.com/news/hope-probe-reveals-new-observations-about-the-martian-atmosphere/)
- [sciencedaily.com/releases/2011/04/110421190450.htm](https://www.sciencedaily.com/releases/2011/04/110421190450.htm)
- [space.com/21554-mars-toxic-perchlorate-chemicals.html](https://www.space.com/21554-mars-toxic-perchlorate-chemicals.html)
- [space.com/23875-mars-radiation-life-manned-mission.html](https://space.com/23875-mars-radiation-life-manned-mission.html)
- [space.com/china-mars-zhurong-rover-wind-changes](https://space.com/china-mars-zhurong-rover-wind-changes)
- [space.com/india-mars-orbiter-mission-loses-contact](https://www.space.com/india-mars-orbiter-mission-loses-contact)
- [space.com/mars-weather-reports-from-insight-lander.html](https://www.space.com/mars-weather-reports-from-insight-lander.html)
- [spacedaily.com/d-five-uncrewed-starship-rockets-are-projected-to-launch-tow…](https://spacedaily.com/d-five-uncrewed-starship-rockets-are-projected-to-launch-toward-mars-during-the-brief-window-in-late-2026-when-the-two-planets-align-for-the-closest-possible-journey-and-depending-on-whether-t/)
- [timeslive.co.za/news/sci-tech/2026-10-13-nasas-perseverance-rover-breaks-of…](https://www.timeslive.co.za/news/sci-tech/2026-10-13-nasas-perseverance-rover-breaks-off-planet-driving-record-on-mars/)
- [universetoday.com/161136/china-finally-tells-us-whats-going-on-with-its-mar…](https://www.universetoday.com/161136/china-finally-tells-us-whats-going-on-with-its-mars-rover)
- [universetoday.com/articles/the-global-dust-storm-that-ended-opportunity-hel…](https://www.universetoday.com/articles/the-global-dust-storm-that-ended-opportunity-helped-teach-us-how-mars-lost-its-water)
- [vantaige.io/blog/openai-gpt-realtime-2-voice-agent-setup-2026](https://vantaige.io/blog/openai-gpt-realtime-2-voice-agent-setup-2026)

### Added in the readiness audit (11 new, plus one repeat)

- [atmos.uw.edu/\~mars/viking/mission/viking-williams-nssdc-revised.html](https://atmos.uw.edu/~mars/viking/mission/viking-williams-nssdc-revised.html)
- [astrogeology.usgs.gov/search/map/ctx\_digital\_terrain\_model\_of\_mars\_insight\_landing\_site\_ellipse\_9\_center](https://astrogeology.usgs.gov/search/map/ctx_digital_terrain_model_of_mars_insight_landing_site_ellipse_9_center)
- [astrogeology.usgs.gov/search/map/mars\_2020\_terrain\_relative\_navigation\_hirise\_dtm\_mosaic](https://astrogeology.usgs.gov/search/map/mars_2020_terrain_relative_navigation_hirise_dtm_mosaic)
- [atmos.nmsu.edu/data\_and\_services/atmospheres\_data/MARS/curiosity/rems.html](https://atmos.nmsu.edu/data_and_services/atmospheres_data/MARS/curiosity/rems.html)
- [dlr.de/en/irs/research-transfer/missions-and-projects/further-and-completed-projects/insight-1](https://www.dlr.de/en/irs/research-transfer/missions-and-projects/further-and-completed-projects/insight-1)
- [hirise.lpl.arizona.edu/dtm/PSP\_001414\_1780](https://hirise.lpl.arizona.edu/dtm/PSP_001414_1780)
- [planetary.org/space-images/mars\_landing\_site\_map\_lakdawalla](https://www.planetary.org/space-images/mars_landing_site_map_lakdawalla)
- [planetarynames.wr.usgs.gov/Feature/4573](https://planetarynames.wr.usgs.gov/Feature/4573)
- [science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity](https://science.nasa.gov/mission/mars-exploration-rovers-spirit-and-opportunity)
- [science.nasa.gov/mission/mars-pathfinder](https://science.nasa.gov/mission/mars-pathfinder)
- [science.nasa.gov/mission/phoenix](https://science.nasa.gov/mission/phoenix)
- [stac.astrogeology.usgs.gov/docs/data/mars/hirise\_dtms](https://stac.astrogeology.usgs.gov/docs/data/mars/hirise_dtms/) (already listed above; cited again for the CC0-1.0 licence)
