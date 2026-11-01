# Mental Model: how Homeward works, in plain English

> Version 2.0.0 | 2026-11-01 | Status: built. Read this when you are lost.

## 0. Now that it is built (29 Oct 2026)

Everything below still describes how Homeward thinks. The working app follows it, with three practical differences: terrain and imagery are one file per level rather than tiles; the voice runs in a background worker so the globe never pauses; and the app caches itself in the background after the first view instead of downloading everything up front. What is in and what is out: `README.md` section 13. Full record of the build session: `BUILD_LOG.md`.

## The whole thing in one paragraph

Homeward is a web page. When it opens, it reads a handful of data files that the team made during the hackathon from public NASA and partner data. It computes the current time on Mars from a published NASA formula, draws the real planet with Cesium from terrain and imagery tiles we cut ourselves from public NASA, ESA and USGS data, and lets you plan a walk from Curiosity's landing site to the rock it first drilled, 443 m away. The planner checks your plan against hard limits and refuses unsafe ones. You can ask a voice assistant questions; it can only answer with numbers it gets by calling the app's own functions. A message to "Mission Control" takes the real Earth-Mars round trip to come back, shortened on screen by a stated factor.

## When the user does X, the system does Y, because Z

| When | The system | Because |
|---|---|---|
| The page opens | Loads `data/manifest.json`, then the facts, sources and site files, checking each against a schema | A bad file must show an error, not wrong numbers |
| The mission clock shows | Converts the current UTC time to Mars time with the Mars24 algorithm and to Earth-Mars distance with JPL's planetary elements | These are the published methods; our tests reproduce NASA's and ESA's own numbers |
| You pick a stop | Sends the stops to a background worker that searches the terrain grid | Searching about 489,000 cells must not freeze the 3D view |
| The worker plans | First works out, for every cell, how long it takes to walk home; then finds the fastest path through your stops | "Can I still get home from here?" becomes a lookup, at every step of the walk |
| A budget breaks | Lists the breach and disables Approve | A survival guide must say no, not "caution" |
| You walk | You hold W or the pad and move at the planner's own pace, slower uphill; the camera follows the terrain at eye height; steep or rocky cells stop you; the HUD counts down life support and up dose, and points to the stop, then home | The walk is the live view of the plan |
| You ask the assistant | Your speech becomes text; our relay sends it to the first free AI provider that answers (Gemini, then Groq, then OpenRouter); the AI asks the app for numbers through named tools; the app answers with values and fact IDs; the reply is spoken by Kokoro, an open-source voice running on your device; captions show source chips | Every spoken number is traceable to a source, and it costs nothing |
| You message Mission Control | The reply is held for twice the current light time, divided by the on-screen compression factor | It teaches why the crew must decide alone |
| You open Rover view at a stop | Fetches that stop's Navcam and Mastcam-Z photos from NASA and lays each one where its camera pointed, using the camera model and the rover's attitude, over the 3D view from the same spot | Every rover stop becomes a street view in NASA's own photos, in drive order |
| You explore the map | Streams orbiter imagery from NASA Mars Trek and Esri OnMars, converted from planetocentric tiles to our ellipsoid, and draws every landing site, named place and rover track from sourced files | Google-Earth freedom without losing provenance: every pin and layer names its source (Dingo Gap in 3D is still not built) |
| The network fails | The whole 3D world keeps working from cached tiles; speech recognition (Whisper), the assistant (rules over the same tools) and the voice (Kokoro) all run in the browser | Judging day Wi-Fi is not trustworthy |

## How data moves

```
public source ─► pipeline script (during the event) ─► data file with hash and licence
   ─► app loads it ─► schema check ─► facts by ID ─► panels, planner, assistant tools ─► screen and voice
```

No number is typed into a component. A component asks for a fact by ID (for example `RAD-01`) or calls a tested function.

## How safety logic works

Five budgets, all checked along the planned timeline:
1. **Life support** (oxygen and power together): 8 hours (NASA EVA limit) minus a 30-minute reserve (our assumption).
2. **Walk-back**: at every point, time left must exceed time to walk home at 3.3 km/h (Apollo planning rate), slowed on slopes by a hiking formula (our assumption).
3. **Slope**: no cell steeper than 20 degrees (NASA suit capability, from lunar planning).
4. **Daylight**: back home at least 30 minutes before sunset (our assumption), sunset from Mars24.
5. **Radiation**: background dose at 0.64 mSv per day (measured by Curiosity); a solar storm scenario forces a shelter decision.

Values marked "our assumption" have sliders. The others are fixed and cited.

## How the assistant stays honest

- It has tools, not knowledge. Tools return numbers with fact IDs.
- Its instructions say: speak only numbers from tool results in this turn; name the source; if no tool covers it, say so.
- A 40-question test runs before filming. Any answer with a number that no tool returned counts as a failure.

## How errors propagate

```
error ─► caught at the nearest error boundary (each scene and each panel has one)
      ─► logged to the console as JSON with an incident ID
      ─► the panel shows a plain message, the incident ID and Retry
      ─► the rest of the app keeps working
```

Back-end errors are logged as JSON in Vercel with a request ID that is also returned to the browser.

## Where the smart logic lives

| Logic | File |
|---|---|
| Mars time, season, Sun | `app/src/core/mars-time.ts` |
| Earth-Mars distance and light time | `app/src/core/ephemeris.ts` |
| Coordinate conversion to Cesium | `app/src/core/frames.ts` |
| Route search, walk-back field, budgets | `app/src/core/planner.ts`, `planner.worker.ts` |
| Assistant tools | `app/src/assistant/tools.ts` |
| Mission Control delay | `app/src/assistant/mission-control.ts` |

## Online versus offline

| | Online | Offline |
|---|---|---|
| Data | From our host | From the service-worker cache (same files) |
| Terrain and imagery | Our own tiles from our host | The same tiles from the cache: identical 3D |
| Speech in | Browser speech service (Chrome, Edge) | Whisper in the browser |
| Assistant brain | Free AI chain via our relay | Rules over the same tools |
| Voice | Kokoro in the browser | Kokoro in the browser |
| Banner | none | "Offline: cached real data from <date>" |

Offline never means made-up data. It means the same real data, cached.

## What there is not

No accounts, no database, no analytics, no user tracking, no WebSocket server. If someone proposes one, check `README.md` section 9 first.
