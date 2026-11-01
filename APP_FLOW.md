# Application Flow: Homeward

> Version 2.0.0 | 2026-11-01 | Owner: lead + 3D engineer | Status: built; section 0 describes the flow as it runs

## 0. Flow as built (29 Oct 2026)

Full record of the build session: `BUILD_LOG.md`.

1. Mars now: live clock over the globe; buttons fly to Mars, explore the map, open Rover street view or skip to the planner. The assistant bar is hidden here.
2a. Explore (added 1 Nov 2026): Google-Earth style globe with search, landing-site cards, rover tracks and stops, live orbiter layers, map controls and a ruler. A lander card opens Rover view or the planner; a rover stop dot opens Rover view there.
2. Orbit: true-scale Mars, Earth and the moons; time-lapse button; Descend to Gale.
3. Descent: scripted camera with Perseverance's entry phases; wind fades in at the parachute phase; continues to the Briefing by itself.
4. Briefing: conditions and limits; Plan the Marswalk.
5. Plan: zone toggle (Yellowknife Bay or boxwork ridges), photos of the stop, budgets, heat map, sliders, provenance, Clear plan. Approve is disabled while any budget is breached.
6. Walk: you walk it yourself by default (hold W or the arrows or the pad, drag to look; suit clock in real time, 10x or 30x), or Follow the plan at 10x, 30x or 60x. Reaching within 15 m of the stop opens the stop panel; within 10 m of home after the stop opens the debrief, which compares the plan with what you did. The dust devil appears 60% of the way along the outbound leg; the solar-storm drill is a button. Each event shows a card and the suit announces it. At the stop: photos and Log sample. At the end: debrief with GeoJSON and CSV export and a share link.
7. Rover view (scene id `relive`, so old links still open): street view at any Curiosity or Perseverance stop from NASA's photos; arrows, keys and the mini-map step along the drive; featured stops carry the sol 182, 528 and 4709 stories. The assistant bar is hidden here.
8. Credits: every source by agency, AI disclosure.

The stepper reaches any scene at any time. State lives in the URL and local storage, so a reload or a shared link restores the scene and plan. Errors: each scene sits in its own error boundary with an incident ID and Copy report; data panels show loading, error, empty or content; the assistant falls back to offline rules; an Offline chip appears without a network.

There is one user role (explorer) and no login. The app is one view whose scene changes. The scene script below comes from paper section 12.7 and is also the acceptance test. The 30-second film is a cut of scenes 1, 3, 6, 8 and 10.

## 1. Navigation graph

```
[0 Mission clock] ─► [1 Orbit] ─► [2 Choose site] ─► [3 Descent] ─► [4 Briefing] ─► [5 Plan]
                                       ▲                                              │ approve
                                       │                                              ▼
 [11 Visit everything] ◄── [12 Credits]◄── [9 Debrief] ◄── [8 Event] ◄──► [7 Science stop] ◄── [6 Walk]
                                       │
                                       └──► [10 Relive a sol]  (also reachable from 6, 7, 9 via the timeline button)
```

A persistent top bar gives: scene stepper, mission clock chip, Offline indicator, Credits, and the Assistant button. Every scene is deep-linkable: `#scene=plan&stops=YKB&t=2026-11-14T10:00LTST&sol=182&cam=...`.

## 2. Scenes

| # | Scene | User sees and does | State transitions | Done when |
|---|---|---|---|---|
| 0 | Mission clock | Mars Year, Ls and season, LTST at Gale and Jezero, sunrise and sunset (UTC, IST), Curiosity and Perseverance sols, one-way and round-trip delay | Loading skeleton ─► values (LIVE badges) ─► Continue | Values match TIME-01..06 and the LMD converter |
| 1 | Orbit | Mars at true scale; Sun and Earth in real directions; Phobos and Deimos moving; labelled orbiters (P1) | Tiles loading (skeleton overlay with progress) ─► rendered; on tile error: error panel with Retry and Offline options | Every object shows its source on tap |
| 2 | Choose site | Pins for every surface mission (P1); Gale highlighted with its walkability level | Hover/focus pin ─► tooltip; select ─► mission card | Every pin opens a cited card |
| 3 | Descent | Camera falls to Gale; sky turns from black to butterscotch; HUD counts real EDL numbers; sound fades in as air thickens | Automatic, 8-12 s; Skip button; reduced motion = cut with a fade | HUD values equal EDL-01 |
| 4 | Briefing | Conditions for the chosen hour: LIVE (clock, Sun), MODELLED (MCD climatology), MEASURED (REMS ranges); dose so far; daylight left; suit limits | Panel 4-state; Start planning | Every number carries a badge |
| 5 | Plan | Pick stops (Yellowknife Bay preset); route, budget bars, walk-back heat map; sliders for ASSUMPTION values | Edit ─► worker computing (bars show skeleton shimmer, previous route dimmed) ─► OK or BREACH list; Approve enabled only if OK | A plan that breaks any budget cannot be approved |
| 6 | Walk | First person at 1.7 m; WASD/arrows or auto-walk along the route; HUD: life support, dose, Sun time, distance and time home, radio delay | Walking ─► margin warnings at 25% and 10% (ASSUMPTION) ─► forced return prompt at 0 | Ground follows the terrain; at least 30 fps |
| 7 | Science stop | Arrive at Yellowknife Bay; discovery card (SCI-01, SCI-02); log a sample | Card ─► Log sample (optimistic add to log; rollback only if validation fails) | Card links to its paper; log exports with coordinates |
| 8 | Event | Dust devil crosses the route (EVT-01), or solar storm alert (P1, RAD-05) | Event toast ─► ask suit assistant ─► optional "Send to Earth" ─► Mission Control countdown | Answer cites tool values; timer = 2 x light time / compression |
| 9 | Debrief | Plan versus actual: distance, time, dose, margin used, science logged; Export; Share URL | Export (P1) ─► file download; Share ─► copy URL with toast | Export reopens the same scene |
| 10 | Relive sol 182 | Curiosity model at SITE-02, sol 182 photos, REMS weather, RAD dose; "What would a human need here?" | Timeline ─► load sol (skeleton cards) ─► flyover ─► cards | Rover within a few metres of SITE-02 |
| 11 | Visit everything | Fly to any site; walk/hike/fly label per stop (P1/P2) | Select ─► fly ─► level badge | Each stop states its level |
| 12 | Credits | Every agency, dataset, licence, AI tool | Static list with links | Matches the README |

## 3. First-time experience

1. Scene 0 opens with a one-line caption: "This is Mars right now, computed from published algorithms." A single Continue button has focus.
2. First time the Assistant button is pressed: a short panel explains where speech and text go (Chrome's speech service while the talk button is held; the question text to a free AI provider; nothing when offline) and asks for microphone permission only then. A text box is always available instead of voice.
3. Each scene shows a dismissible hint once (stored in `localStorage` as `homeward:hints:v1`).

## 4. Decision trees

```
App start
 ├─ data/manifest.json loads? ── no ─► Error screen: "Cannot load mission data" + Retry + incident ID
 ├─ Tiles reachable (network or service-worker cache)? ── no ─► "Mars tiles not cached yet: connect once" + Retry
 └─ yes ─► Scene from URL (validated by zod; invalid params ─► default scene 0, toast "Link was incomplete")

Assistant button (push to talk)
 ├─ mic granted? ── no ─► text input, same assistant
 ├─ speech in: Web Speech API available and online? ── yes ─► browser speech service
 │                                                  └─ no ─► Whisper in the browser
 ├─ brain: POST /api/v1/assistant ─► 200 (Gemini, Groq or OpenRouter answered) ─► tools ─► answer
 │         └─ 429 / 503 / network down ─► offline rules, caption says "Offline answer"
 └─ voice: Kokoro speaks the answer (suit voice); captions always shown

Approve plan
 ├─ All budgets OK ─► Approve enabled ─► scene 6
 └─ Any breach ─► Approve disabled, tooltip lists breaches, each breach links to the slider or stop causing it
```

## 5. Error recovery

| Failure | User sees | Recovery |
|---|---|---|
| Data file fails zod validation | That panel's error state: "This data did not pass its checks" + incident ID | Retry; diagnostics name the file |
| Planner worker crashes | Route panel error with Retry; previous valid route kept | Worker restarted on Retry |
| Tile load slow | Skeleton overlay with "Streaming terrain" and percentage | Quality preset drops automatically after 10 s under 20 fps |
| Every AI provider busy or down | Caption "Offline answer" with a small Offline label | Offline rules answer; online returns automatically on the next question |
| Kokoro model not loaded yet | Captions show at once; "Preparing voice" chip | Voice starts when the model is ready (cached after the first load) |
| Mic denied | Text box with the same assistant | Link to browser mic settings help |
| Out of budget mid-walk (life support) | Red HUD bar, voice prompt "Return now", route home highlighted | Walk-back route from the precomputed field |
| Mission Control reply fails to generate | Countdown completes, card says "No reply received" | Retry button; offline template |

## 6. Assistant turn, step by step

Nothing in the app needs a persistent connection. One question is a short loop:

| Step | What happens | UI effect |
|---|---|---|
| 1 | Push-to-talk released; speech becomes text | "Listening" waveform, then the question appears as a caption |
| 2 | Brain call (relay or offline rules) | "Thinking" shimmer line |
| 3 | Brain asks for tools; the browser runs them | "Checking: life support" chips appear |
| 4 | Brain returns the answer | Caption text with source chips and the provider label |
| 5 | Kokoro speaks it, sentence by sentence | Speaking indicator; Stop button |

## 7. Permission-gated flows

There are no roles. The only gate is the browser microphone permission (Permissions-Policy allows `microphone=(self)` only). Everything works without it through text input.
