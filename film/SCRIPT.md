# Homeward films: script and plan

> Version 1.0.0 | 2026-11-14 | Two films from one set of real screen recordings: the 30-second submission film (Space Apps rule: 30 s video or 7 slides, English subtitles; `legal/COMPLIANCE.md`) and a story film of about 3 minutes to show anyone. Built by `film/make.mjs` (section 6).

## 1. The one thing

- What it is: a map of Mars made only from real data that plans a walk and brings the walker home.
- What a viewer remembers: "Every number in it is real, and it always gets you home."
- The spine: one walk on sol 182, from the habitat at Bradbury Landing to Sheepbed mudstone at Yellowknife Bay (443 m), the rock where Curiosity found the ancient lake. It travels from the hook (the wind at that kind of place) to the payoff (the walk home).

## 2. Three storylines (picked: A)

- **A. "The walk home" (picked).** A moment in someone's day, carried as one flight through one world: from the real wind of Mars, out to orbit, down through every landing site and into the walker's helmet display. Picked because a stranger follows a person and a walk more easily than a feature list.
- B. "Thirteen landings." Every lander in landing order, Mars 3 to Zhurong, each opening on its own photo; Homeward is the map that holds them all.
- C. "Eleven minutes." The film runs on the real radio delay: what can go wrong in 11 minutes, and what the map has already worked out before Earth hears about it.

## 3. Look and sound

- Look: the app itself, full frame, real recordings only (no mockups, no AI images or video). Wide "world" shots hide the panels; product shots keep the real interface. Type: Inter, the app's own face; colours from `app/src/styles/tokens.css` (ground #060918, text #E8ECF8, accent #E8A75D rationed to the title and the end card).
- Voice: Kokoro-82M, voice `af_heart` (Apache-2.0, runs on our own machine), calm and warm, a little slower than default. Disclosed as AI on the end card and in the credits.
- Music: an original bed made for this film by MusicGen (Meta, open model, CC BY-NC 4.0; this is a non-commercial entry), calm and spacious, opening up at the title and swelling once at the payoff.
- Real Mars sound (NASA/JPL-Caltech, public): the wind recorded by Perseverance's SuperCam microphone on sol 4 (22 Feb 2021) opens the film and returns when the walker steps outside.

## 4. Story film (2 min 20 s)

| # | Picture (real recordings) | Voice | On screen |
|---|---|---|---|
| 1 | Mars from orbit, slow drift, sunlit | (3 s of real wind alone) "Listen. That is real wind, on Mars. Perseverance recorded it on its fourth day there." | "Real wind, recorded on Mars" / "Perseverance SuperCam, sol 4. NASA/JPL-Caltech/LANL/CNES" |
| 2 | Mars now: the live clock, radio delay 11.04 min | "One day, a person will stand in that wind. Earth will be eleven light-minutes away. If something goes wrong out there, no one can reach them in time." | live panel |
| 3 | Dark globe, the names of the datasets arriving one by one | "Everything they need to know already exists. But it is scattered across dozens of missions, archives and formats. No single map brings it together." | HiRISE, CTX, MOLA, HRSC, THEMIS, TES, REMS, RAD, DONKI, Horizons |
| 4 | The globe turns into the light | "So we built one. Homeward. A map of Mars made only from real data, that plans your walk, and always brings you home." | Title: Homeward |
| 5 | Olympus Mons, then Valles Marineris, in colour relief | "The whole planet, in true three D, from NASA and ESA orbiters. Olympus Mons. Valles Marineris. Two thousand named places, one search away." | |
| 6 | Landing-site tour; Opportunity's track through Victoria crater | "Every place we have landed, from Mars 3 in 1971 to Zhurong. Opportunity's forty-five kilometre drive, traced from NASA's own records." | |
| 7 | Geology and ground-heat overlays fade in | "Lay the science on top: the geology, the heat of the ground, the dust. Every layer names where it came from." | |
| 8 | Rover view: looking around at Yellowknife Bay and Dingo Gap in Curiosity's photos | "Then stand where the rovers stood, and look all around, in their own photographs." | |
| 9 | Briefing at Yellowknife Bay | "Now it is your turn. Sol one eighty two. You want to reach the rock where Curiosity found an ancient lake. First, the briefing: daylight, radiation, and what Curiosity measured there." | |
| 10 | Plan: the route drawn from the habitat to Sheepbed mudstone | "Homeward plans the route. It steers around slopes and rocks a suit cannot cross, and keeps air, power, dose and daylight in budget, with enough left to walk back." | |
| 11 | Walk: first person, the helmet display (wind returns) | "Then you walk it. Every step, the display shows the way home, the air you have left, and whether your radio still reaches the habitat." | |
| 12 | The suit assistant answers with a source | "Ask the suit assistant, and it answers only with real numbers, and where they came from." | |
| 13 | Pull back to orbit; the real orbiters pass | "Above you, the real orbiters pass overhead, exactly where they are right now." | |
| 14 | Credits scene | "Every number you saw is real: measured, computed, and cited. No demo data. Nothing invented." | "88 cited sources" |
| 15 | End card | "Homeward. So the first people on Mars can always find their way home." | Homeward / Martian Map / NASA Space Apps Challenge 2026, Bengaluru / AI disclosure |

## 5. The 30-second film

| Seconds | Picture | Voice |
|---|---|---|
| 0-4 | Mars from orbit, real wind | "Listen. That is real wind, recorded on Mars." |
| 4-8 | Live clock, 11.04 min | "One day, someone will walk there, eleven light-minutes from help." |
| 8-11 | Title over the turning globe | "Homeward is the map they can trust." |
| 11-14 | Olympus Mons in relief | "The whole planet, in true three D." |
| 14-17 | Landing-site tour | "Every landing site." |
| 17-20 | Rover view look-around | "The rovers' own photographs." |
| 20-25 | Plan, then the walk HUD | "A route that keeps air, dose and daylight in budget, and always gets you home." |
| 25-30 | End card with credits and AI disclosure | "Every number real. Every source cited." |

## 6. How it is made (all free, all on our machine)

1. `film/record.mjs`: headless Chrome on the laptop GPU drives the real app (`npm run dev`) through each shot by its URL state and the globe API, and records it with the DevTools screencast (about 60 fps), resampled to 30 fps.
2. `film/voice.mjs`: Kokoro-82M (fp32) speaks each line to its own WAV, so every cut lands on its line.
3. `film/music.py`: MusicGen writes the bed in three moods; ffmpeg crossfades them.
4. `film/make.mjs`: ffmpeg cuts the shots to the voice, adds the title cards and burned-in English subtitles (also as `.srt`), mixes voice, music and NASA's Mars recordings (voice on top, music around -20 dB, loudness -14 LUFS), and writes both films.

Rules kept: real recordings only, no NASA logo, no emojis, AI voice and music disclosed on screen, every NASA sound credited.

### Rebuild (about 20 minutes; do it after 09:00 on 14 Nov so the submitted film is made in the event window)

Needs ffmpeg 8 or newer (`winget install Gyan.FFmpeg`), Chrome, and a Python environment with `torch`, `transformers<5` and `soundfile` for the music (CUDA makes it fast). Start `npm run dev` first.

```bash
npm i --no-save puppeteer-core@24
```

```bash
node film/record.mjs
```

```bash
node film/voice.mjs
```

```bash
python film/music.py
```

```bash
NASA_AUDIO=<folder with scam-mic-sol004-run001.wav from https://www.nasa.gov/sounds-from-beyond/> node film/make.mjs
```

Outputs: `film/out/homeward-30s.mp4` and `film/out/homeward-story.mp4`, each with an `.srt` (`short.srt`, `story.srt`). Review with `sh film/sheet.sh film/out/homeward-30s.mp4`. Voice and music files are reused if present; delete one to make it again. The record step needs the network (live NASA, ESA and Esri tiles). NASA's raw-image API refuses headless browsers, so Rover view shots use the four featured stops the app keeps offline.
