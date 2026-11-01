# Chunk 05: Assistant, voice and Mission Control

> Version 1.0.0 | 2026-10-29 | Goal: a free voice assistant that speaks only numbers from tools, in a natural open-source voice, online and offline; Mission Control after the real delay; the 40-question eval per provider. Tickets T14, T15, T16, T17 (T35 Kannada/Hindi is P2).

| Field | Value |
|---|---|
| Estimated time | 8 h |
| Depends on | 02 (relay), 04 (core) |
| Unlocks | 09 |
| Owner | AI and voice engineer |

## Pipeline

```
push-to-talk ─► speech-in.ts ─► text ─► brain.ts (relay or offline rules) ⇄ tools.ts ─► text ─► Captions + voice.ts (Kokoro)
```

## Files and interfaces

```ts
// app/src/assistant/tools.ts
export type ToolResult = { values: Record<string, number | string>; factIds: string[]; sourceIds: string[]; badges: Record<string, Badge> };
export type Tool = { name: string; description: string; parameters: JSONSchema; args: z.ZodType; run(args: unknown, ctx: AppContext): ToolResult };
export const TOOLS: Tool[]; // get_position, get_budgets, get_route, get_conditions, get_sun, get_radio_delay, get_nearby_targets, get_event, search_sources
```

| Tool | Returns (examples) | Facts |
|---|---|---|
| `get_position` | latC, lonE, elevation, local slope, distance home | SITE-01, grid |
| `get_budgets` | life support left, walk-back margin, daylight left, dose so far | EVA-01, EVA-04, RAD-01, Mars24 |
| `get_route` | length, time, stops, breaches | planner |
| `get_conditions` | MODELLED MCD values for the hour; MEASURED REMS ranges | DATA-09, WX-01 |
| `get_sun` | elevation, azimuth, sunrise and sunset in LTST and UTC | Mars24 |
| `get_radio_delay` | one-way and round-trip minutes for the scenario date | TIME-05 |
| `get_nearby_targets` | stops within a radius and why they matter | SCI-01, SCI-02 |
| `get_event` | active event and its numbers | EVT-01, RAD-05 |
| `search_sources` | top 3 corpus cards (title, one-line summary, source IDs) | corpus |

```ts
// app/src/assistant/speech-in.ts
export function canUseWebSpeech(): boolean;              // SpeechRecognition or webkitSpeechRecognition present and online
export async function listen(lang: "en-IN" | "hi-IN" | "kn-IN", signal: AbortSignal): Promise<string>;
// falls back to whisper.worker.ts: @huggingface/transformers automatic-speech-recognition, a small multilingual Whisper ONNX model
// (choose the smallest that understands the team's accents in a 10-sentence test; record the model ID and size), WebGPU if present, else WASM

// app/src/assistant/brain.ts
export async function ask(q: string, persona: Persona, lang: Lang, ctx: AppContext): Promise<{ text: string; factIds: string[]; provider: string }>;
// up to 3 tool rounds via POST /api/v1/assistant; on 429/503/network error -> offline.ts

// app/src/assistant/voice.ts   (kokoro-js, model onnx-community/Kokoro-82M-v1.0-ONNX, self-hosted weights)
export async function speak(text: string, who: "suit" | "mission-control"): Promise<void>;
// device "webgpu" with dtype "fp32" when available (per kokoro-js README), else "wasm" with "q8"; two stock voices picked by ear on day 1
// mission-control audio passes through the radio band-pass in audio/engine.ts

// app/src/assistant/offline.ts
export function answerOffline(text: string, ctx: AppContext): { text: string; factIds: string[] } | null; // keyword intents -> same tools -> templates

// app/src/assistant/mission-control.ts
export function delayMs(scenarioUtcMs: number, compression: number): number; // 2 * lightTimeMin * 60000 / compression
```

## Instructions

Full text in `app/src/assistant/instructions.ts`, rules in `IMPLEMENTATION_PLAN.md` section 8. Two personas from the same rules: "Suit" (instant) and "Mission Control" (delayed, signs off, knows its reply is about 22 minutes old).

## UI states

| Element | Loading | Success | Error | Empty |
|---|---|---|---|---|
| Captions dock | "Listening" waveform, then "Thinking" shimmer line | Text + source chips + small provider label (Gemini, Groq, OpenRouter, Offline) | "Assistant unavailable" + Retry + Use offline | Three suggested questions |
| Mission Control card | Countdown | Reply with chips | "No reply received" + Retry | "Send a question to Earth" |

The microphone is requested only on the first press, after a panel explains where speech goes (`legal/PRIVACY_POLICY.md`). Typing always works.

## Latency budget (targets, ASSUMPTION)

Speech in about 1 s after release; brain about 1-2 s (one tool round); Kokoro first audio about 0.5 s on WebGPU. Show the caption text as soon as it arrives; speak in sentence chunks.

## Eval (T17)

- `eval/questions.json`: 40 items per `docs/TESTING_STRATEGY.md` section 4.
- `eval/run.mjs --provider gemini|groq|openrouter`: runs the same instructions and tools (tools run in Node against fixture state from the real data files), scores, writes `eval/results-<provider>-<date>.json`.
- Gate: Gemini and Groq at least 38/40 with zero unsupported numbers. OpenRouter: run 20 questions per day (its free limit is about 50 requests/day) and keep it in the chain only if it scores at least 18/20 with zero unsupported numbers. A provider that fails the gate is removed from the chain.
- Offline rules: the 15 most common intents must answer correctly; everything else must say "no offline answer for that".

## P2: Kannada and Hindi (T35)

Speech in: Web Speech API with `kn-IN` or `hi-IN`. Brain: same chain with `lang`. Voice: `POST /api/v1/tts` relays to `gemini-3.8-flash-tts` (free tier; Hindi and Kannada supported); offline shows captions only. Native speakers on the team check 10 answers each.

## Verification

```
npm test -- assistant
node eval/run.mjs --provider gemini
node eval/run.mjs --provider groq
npm run dev    # press Assistant, ask "How long until I must turn back?", check chips EVA-01 and EVA-04 and the spoken answer
```
Then switch the network off and ask again: Whisper, offline rules and Kokoro must answer.

## Rollback

Flags in `app/src/features.ts`: `assistantCloud: false` leaves the offline assistant; `voiceOut: false` leaves captions only.

## Outcome (29 Oct 2026)

Built `tools.ts` (11 tools, including `check_extra_time` added after testing), `brain.ts` (relay client, 3 tool rounds, offline fallback, offline-only switch), `offline.ts`, `voice.ts` with `voice.worker.ts` (Kokoro-82M q8 self-hosted; af_heart for the suit, bm_george for Mission Control through a band-pass), `speech.ts` (Web Speech API or Whisper tiny.en), `Dock.tsx` (captions, Mission Control on 2 x light time at 60x, spoken hazard alerts, voice preload), `ambient.ts` (real wind).

Fixed during testing: the voice failed in dev (the dev server rewrote the ONNX runtime import; full-origin path); generation froze the globe (moved to a worker, sentences pipelined, multithreaded through cross-origin isolation); routing bugs for "extend the stop", "daylight" and "air pressure". Not built: Kannada and Hindi.

Verification: 40-question eval passes for the offline brain (right intent, no ungrounded number); Kokoro measured at about 5.4 s for 3.0 s of speech on 4 threads, with the globe still rendering; Mission Control reply observed after the 24.2 min real round trip shown in about 24 s.

Full record: `BUILD_LOG.md`.
