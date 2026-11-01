# Implementation Plan: Homeward

> Version 2.0.0 | 2026-11-01 | Canonical technical spec for version 1.0, now built. Section 0 lists every place the build differs from this plan; version 2.0 (Explore, Rover view, walking yourself) is specified in `build/PLAN-2.md`.
>
> 0.1.0 initial plan from the research paper. 0.2.0 renamed to Homeward; zero budget (free AI chain, Kokoro voice, Whisper fallback); own Mars tiles instead of Cesium ion; Dingo Gap rover-scale scene; presence design.

## 0. As built (29 Oct 2026)

Full record of the build session: `BUILD_LOG.md`.

- No `app/public/tiles/` and no `eval/`: terrain and imagery are in `data/globe/`; the eval is `app/src/assistant/eval.test.ts`.
- Added files: `app/src/core/moons.ts`, `app/src/assistant/voice.worker.ts`, `app/src/assistant/ambient.ts`, `pipeline/make_moons.py`, `pipeline/fetch_audio.py`, `scripts/fetch-models.mjs`, `data/sky/moons.json`, `data/audio/supercam-sol001-wind.mp3`.
- Endpoints as planned: `POST /api/v1/assistant`, `GET /api/v1/health`.
- Tools: 11 (adds `check_extra_time`).
- State: adds `online` (keep the assistant on the device).
- Versions as pinned in `package.json`; transformers.js is 3.8.1, not 4.x.
- Pipeline order: `snapshot.py`, `make_grid.py`, `make_rasters.py`, `make_moons.py`, `fetch_audio.py`, `rovers.py` (added 1 Nov), `build_facts.py`, `build_corpus.py`, `manifest.py` (run from `pipeline/` with the `.venv` Python).
- Added on 1 Nov 2026 (`build/PLAN-2.md`): scenes `Explore.tsx` and Rover view (`Relive.tsx` rewritten); `core/camera.ts`, `core/places.ts`, `rovers/raw.ts`, `globe/layers.ts`, `globe/live.ts`, `zod-config.ts`; `pipeline/rovers.py`, `pipeline/landers.csv`; `data/rovers/`, `data/places/`; state adds `imagery`, `hirise`, `labels`, `tracks`, `rover` and `place`. The globe is a `CesiumWidget`, not a `Viewer`.

## 1. Identity

| Field | Value |
|---|---|
| Project | Homeward, NASA Space Apps 2026, "Interplanetary Survival Guide: Martian Map" |
| Site | Gale Crater: Bradbury Landing (SITE-01) to Yellowknife Bay (SITE-02); rover-scale scene at Dingo Gap (sol 528) |
| Scenario date | 14 Nov 2026 (Mars Year 39, Ls about 22 deg, northern spring) |
| Budget | Zero |
| Deliverables | Public web app, public repository with README of sources/licences/AI use, 30-second film with English subtitles (or up to 7 slides) |

## 2. Services and limits (all free)

| Service | Auth | Free limit (checked 28 Oct 2026) | Fallback |
|---|---|---|---|
| Gemini API, `gemini-3.8-flash` | Server key | Free tier; per-model limits shown in AI Studio; free-tier content used to improve Google products | Groq |
| Groq, `openai/gpt-oss-120b` | Server key | 30 requests/min, 1,000/day, 8K tokens/min, 200K tokens/day (page lists these as base limits; check the console) | OpenRouter |
| OpenRouter, `openrouter/free` | Server key | About 20 requests/min, 50/day without past credit purchases (SECONDARY) | Offline rules |
| Gemini TTS, `gemini-3.8-flash-tts` (P2) | Server key | Free tier; Hindi and Kannada supported | Captions only |
| Vercel Hobby | Git integration | Free, non-commercial; quotas per Vercel's plan page | Any free static host + the same function on Netlify or Cloudflare |
| NASA MMGIS, raw images; USGS STAC and PDS Annex; JPL Horizons; MCD web | none | Undocumented endpoints may change | Snapshots in `data/` |

## 3. Features

Feature list, priorities and acceptance: `PRD.md` section 5. Tickets: `FEATURE_TICKETS.md`. Key technical detail per P0 feature:

| ID | How | Key detail | Why it matters |
|---|---|---|---|
| F01 | `core/mars-time.ts`, `core/ephemeris.ts`, recomputed every second | Sol numbers change at local midnight | Judges can check against the LMD converter |
| F02/F03 | Own tiles on `Ellipsoid.MARS`; camera path; tuned `scene.atmosphere` and `SkyAtmosphere` | Atmosphere values are ASSUMPTION until compared with photos | First 5 seconds of the film |
| F04 | Facts by ID + MCD table + Mars24 Sun | Three badge types side by side | Honest "current conditions" (WX-04) |
| F05 | Worker: Dijkstra walk-back field + A* + budget timeline | One Dijkstra gives time-home for every cell | The survival rule is enforced |
| F06 | Camera height from `globe.getHeight` / `sampleTerrainMostDetailed` on our terrain (throttled) | Eye height 1.7 m; horizon 3.39 km away (COMPUTED) | The walk is the live view of the plan |
| F08 | Speech in, brain chain, tools in the browser, Kokoro voice | Every tool result carries fact IDs | Grounded voice, free |
| F09 | Delay = 2 x light time / compression | Labelled on screen | Crew autonomy |
| F11 | `data/sols/msl-0182.json` + NASA Curiosity model | Position via `toCesium` | History checks the plan |
| F12/F13 | `Badge`, `SourceChip`, credits from `sources.json` | Diagnostics fail on a missing badge | Validity and rules |
| F29 | Presence design (horizon, light level, sound, scale, comfort) | Every cue from a real number or labelled GENERATED | "Being there" without fake data |

## 4. Architecture

`TAD.md` section 1 (diagram) and section 4 (frames).

## 5. Repository layout

One `package.json` at the root. Vite's root is `app/`. Vercel serves `dist/` and runs functions from `api/`.

```
/
├── package.json              pinned deps; scripts: dev, build, test, e2e, typecheck, diag, cesium:copy
├── package-lock.json
├── tsconfig.json             strict, noUncheckedIndexedAccess
├── vite.config.ts            root "app", outDir "../dist", worker format "es"
├── vercel.json               headers, outputDirectory "dist"
├── .env.example              placeholders only
├── .gitignore
├── app/
│   ├── index.html
│   ├── public/
│   │   ├── cesium/           copied from node_modules by scripts/copy-cesium.mjs (git-ignored)
│   │   ├── data/             generated by pipeline/; served at /data/ ("data/" in all docs)
│   │   ├── tiles/v1/         generated terrain (.bin) and imagery (.jpg) pyramids + dingo-gap/ 3D Tiles; served at /tiles/
│   │   ├── models/           Curiosity glTF (NASA), Kokoro-82M ONNX weights, Whisper ONNX weights, each with licence file
│   │   ├── audio/            NASA Perseverance wind recording; suit-interior loop (GENERATED, credited)
│   │   ├── fonts/            Inter, JetBrains Mono (OFL) + licence
│   │   ├── og.png            screenshot, no logos
│   │   └── sw.js             service worker
│   └── src/
│       ├── main.tsx          sets window.CESIUM_BASE_URL, mounts App, registers SW
│       ├── App.tsx           top bar, scene switch, one ErrorBoundary per scene
│       ├── styles/tokens.css, base.css
│       ├── core/             mars-time, ephemeris, frames, dose, planner, planner.worker (+ tests)
│       ├── data/             schemas.ts (zod), load.ts
│       ├── globe/            viewer.ts, terrain.ts (heightmap provider), imagery.ts, camera.ts, overlays.ts, presence.ts
│       ├── scenes/           Clock, Orbit, Descent, Briefing, Plan, Walk, ScienceStop, Event, Debrief, Relive, Tour, Credits, url-state.ts
│       ├── ui/               Panel (4-state), Skeleton, ErrorBoundary, Badge, SourceChip, Tooltip, BudgetBar, Toast
│       ├── assistant/        tools.ts, instructions.ts, brain.ts, speech-in.ts, whisper.worker.ts, voice.ts (Kokoro), offline.ts, mission-control.ts, corpus-search.ts, Captions.tsx
│       ├── audio/engine.ts   Web Audio graph
│       ├── features.ts       feature flags (plain constant object)
│       └── util/timing.ts    debounce and throttle
├── api/
│   ├── v1/assistant.ts       relay with provider chain
│   ├── v1/health.ts
│   ├── v1/tts.ts             (P2) Gemini TTS for Kannada and Hindi
│   └── _lib/
│       ├── http.ts           JSON responses, request ID, structured log, origin check, rate limit
│       └── providers.ts      one OpenAI-compatible chat adapter for all three (Gemini publishes an OpenAI-compatible endpoint; confirm tool calling on it on day 1, else add a small native Gemini adapter)
├── pipeline/
│   ├── requirements.txt      pinned
│   ├── frames.py             same formulas as core/frames.ts, shared test vectors
│   ├── fetch.py  make_grid.py  make_tiles.py  snapshot.py  build_facts.py  build_corpus.py  manifest.py
│   ├── facts.csv  sources.csv  corpus.md
│   └── raw/                  downloads (git-ignored, hashes in raw/hashes.txt)
├── scripts/
│   ├── diagnostics.mjs
│   └── copy-cesium.mjs
├── eval/
│   ├── questions.json        40 questions with expected fact IDs
│   └── run.mjs               runs the eval against each provider in the chain
└── tests/e2e/demo-path.spec.ts
```

## 6. Data and tile files

Schemas and the tile plan: `docs/DATA_SPEC.md` sections 4 and 5. No SQL anywhere.

## 7. HTTP API

### POST `/api/v1/assistant`

| Item | Value |
|---|---|
| Request body | `{ "persona": "suit" | "mission-control", "lang": "en" | "hi" | "kn", "messages": Message[], "tools": ToolSchema[] }`, zod-validated, max 32 KB, max 20 messages |
| Message | `{ role: "user" | "assistant" | "tool", content?: string, toolCalls?: { id, name, arguments }[], toolCallId?: string }` |
| Checks | `Origin` in `ALLOWED_ORIGINS`; per-IP limit 30 per 10 minutes (one question can take 2-3 turns because of tool calls) |
| Chain | Gemini, then Groq, then OpenRouter (models from `GEMINI_MODEL`, `GROQ_MODEL`, `OPENROUTER_MODEL`), all through one OpenAI-compatible `chat/completions` adapter with `tools`; Gemini through its OpenAI-compatible endpoint, or a small native `generateContent` adapter with `functionDeclarations` if the day-1 check shows tools do not work there. Each call has an 8 s timeout. A provider that fails 3 times in a row is skipped for 60 s (circuit breaker). 429, 5xx and timeouts move to the next provider; 400 from a provider is logged and also moves on |
| 200 | `{ "provider": "gemini", "message": { "content": "...", "toolCalls": [] }, "requestId": "b3e1..." }` |
| 400 | `{ "error": "INVALID_BODY", "message": "...", "requestId": "..." }` |
| 403 | `{ "error": "ORIGIN_NOT_ALLOWED", "requestId": "..." }` |
| 429 | `{ "error": "RATE_LIMITED", "retryAfterS": 300, "requestId": "..." }` + `Retry-After` |
| 503 | `{ "error": "ALL_PROVIDERS_FAILED", "message": "Switching to the offline assistant", "requestId": "..." }` |
| Headers | `Cache-Control: no-store`; security headers from `vercel.json` |
| Logs | provider used, latency, status, fallbacks taken; never message content |

```ts
// api/_lib/http.ts (shape, written on 14 Nov)
// seniordev: in-memory rate limit and circuit breaker per function instance; move to a shared store if traffic grows
```

### GET `/api/v1/health`

```json
{ "status": "healthy", "checks": { "geminiKey": "ok", "groqKey": "ok", "openrouterKey": "ok", "allowedOrigins": "ok", "dataManifest": "ok" }, "version": "0.2.0", "uptimeS": 3600 }
```
200 if at least one provider key is set and the manifest loads; 503 otherwise. It never calls a provider (that would spend free quota).

### Assistant loop (browser)

1. Push-to-talk records; `speech-in.ts` uses the Web Speech API where available (language `en-IN`, `hi-IN` or `kn-IN`), otherwise Whisper in a worker.
2. `brain.ts` posts `{ persona, lang, messages, tools }`. If the reply has `toolCalls`, run each tool locally (zod-validated args), append `{ role: "tool", toolCallId, content: JSON }`, post again. Maximum 3 tool rounds per question.
3. Final text goes to captions with source chips from the fact IDs of every tool called this turn, then to `voice.ts` (Kokoro; suit voice and Mission Control voice are different stock voices, chosen on day 1 by listening).
4. On 503, 429 or network failure, `offline.ts` answers with the same tools.

Tool result shape:

```json
{ "values": { "lifeSupportLeftMin": 312, "timeHomeMin": 9.4, "marginMin": 272.6 },
  "factIds": ["EVA-01", "EVA-04"], "sourceIds": ["NTRS-20200001071", "ALSJ-APOLLO17-TRAVERSE"],
  "badges": { "lifeSupportLeftMin": "COMPUTED", "timeHomeMin": "COMPUTED" } }
```

## 8. Assistant instructions (core rules, full text in `app/src/assistant/instructions.ts`)

1. You are the suit assistant of an astronaut on Mars at Gale Crater.
2. Speak a number only if a tool returned it in this conversation turn. Round as the tool rounded.
3. After a number, name its source briefly ("from Curiosity's radiation detector").
4. If no tool covers the question, say you have no data for it, and suggest asking Mission Control.
5. Never invent hazards, events, or mission facts. Never claim to be NASA or speak for NASA.
6. Keep answers under 3 sentences unless asked for more. Answer in the language of the question (English, Hindi or Kannada).
7. Mission Control persona: same rules, signs off "Mission Control", and knows its reply is about 22 minutes old.

The same instructions go to every provider; the eval checks each one.

## 9. Design system

`design/DESIGN_TOKENS.md` and `design/UI_DESIGN_PROMPTS.md` (including presence design).

## 10. Offline mode (replaces "demo mode")

| Piece | Offline behaviour |
|---|---|
| Shell, `data/`, `tiles/`, `models/`, `audio/` | Cached by the service worker on the first online visit (about 300 MB budget; see `docs/SEO_PERFORMANCE.md`) |
| Globe, descent, walk, Dingo Gap | Identical to online: our own tiles |
| Speech in | Whisper (in browser) |
| Brain | Offline rules over the same tools |
| Voice | Kokoro (in browser), same voices as online |
| Indicator | Banner: "Offline: cached real data from <manifest date>" |

The app never shows invented data in any mode. Procedural visuals (rocks below 25 cm outside the Dingo Gap scene, the dust column, suit-interior sound) carry the GENERATED badge or credit.

## 11. Security measures

1. Free-tier keys only in Vercel env; no payment method on any account.
2. Origin allow-list on the relay; CORS allows only our origins.
3. zod validation on every request body, URL hash param, worker message and tool argument; size caps.
4. Per-IP rate limit on the relay; per-provider timeout and circuit breaker.
5. Security headers on every response (CSP with `connect-src 'self'`, HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy with microphone only).
6. No secrets in git; `.env.example` only; diagnostics greps for key patterns (`AIza`, `gsk_`, `sk-or-`).
7. Structured logs without message content, audio or raw IPs (hashed).
8. Dependencies pinned; `npm audit --omit=dev` in diagnostics.
9. No `dangerouslySetInnerHTML`; corpus, captions and model text rendered as text.
10. Model output is never executed: only known tool names with zod-valid arguments run.

## 12. Hour plan

H0 = Saturday 14 Nov 2026, 09:00 IST. The submission deadline is UNVERIFIED until the 2026 Project Submission Guide (13 Nov); move H34+ to fit it with several hours of buffer. Large downloads (about 11 GB DEM, 12 GB Viking mosaic, parts of the 23 GB MSL mosaic) start at H0 on the fastest connection available; ask the local lead whether downloading public data without processing it may start earlier.

| Hours | Lead + storyteller | 3D engineer | Data engineer | Planner engineer | AI + voice engineer | Science + experience lead |
|---|---|---|---|---|---|---|
| H0-H2 | Shot list for the film | Chunk 00, 01 | Start downloads; `frames.py` with shared test vectors | Write T02-T04 tests first | Chunk 02 relay | `facts.csv`, `sources.csv` |
| H2-H8 | Credits text; slide skeleton | Chunk 06: viewer on own tiles (global levels first) | T39 `make_tiles.py`: global, Gale region, walk zone; T07 `make_grid.py` | T02-T04, then T08 planner | T14 brain loop + tools; Kokoro voice | `corpus.md`; eval questions |
| H8-H16 | Review scenes against APP_FLOW | T10 walk, T40 presence cues, T21 orbit | Sol 182 snapshot; Dingo Gap placement; MCD conditions; manifest | T09 planner panel | T15 Mission Control; T16 Whisper fallback; T17 eval run per provider | T11 briefing, T12 science card, T19 credits |
| H16-H20 | Sleep shift A (half the team) | | | | | |
| H20-H28 | Film rehearsal | T22 descent and sky, T23 dust devil, T41 Dingo Gap scene | T31 service worker; T32 pins | Validation against Curiosity's path; T29 | Eval to target on each provider | T30 sound; comfort and accessibility pass |
| H28 | **Feature freeze** | | | | | |
| H28-H34 | Film capture, subtitles, slides | Performance presets on the weakest laptop | Credits = README check | Bug fixes only | Final eval; free-quota check | Fact check of every on-screen number |
| H34+ | Submit with buffer | Chunk 09 deploy | | | | |

Nobody codes past 24 hours awake.

## 13. Key setup (no credit card needed)

| Service | Steps |
|---|---|
| Gemini | aistudio.google.com: sign in, "Get API key", create a key in a new project. Vercel env `GEMINI_API_KEY`, `GEMINI_MODEL=gemini-3.8-flash`. Read your free-tier limits in AI Studio and note them in the changelog |
| Groq | console.groq.com/keys: create a key. Vercel env `GROQ_API_KEY`, `GROQ_MODEL=openai/gpt-oss-120b`. Note the free-plan limits from the console |
| OpenRouter | openrouter.ai/keys: create a key; do not add credits. Vercel env `OPENROUTER_API_KEY`, `OPENROUTER_MODEL=openrouter/free` |
| Vercel | Import the repository; set the env vars above for Production and Preview; set `ALLOWED_ORIGINS` to the production, preview and `http://localhost:5173` origins |
