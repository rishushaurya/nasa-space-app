# Chunk 02: Backend functions

> Version 1.0.0 | 2026-10-29 | Goal: a relay that holds the free-tier AI keys and tries Gemini, then Groq, then OpenRouter; and a health check. Tickets T13, T24.

| Field | Value |
|---|---|
| Estimated time | 2 h |
| Depends on | 01 |
| Unlocks | 05 |
| Owner | AI and voice engineer |

## Day-1 check (15 minutes, before writing code)

Read and record in the changelog: the Gemini OpenAI-compatible endpoint and whether `gemini-3.8-flash` supports `tools` there; Groq's tool-use docs for `openai/gpt-oss-120b`; OpenRouter's `openrouter/free` router and how to require tool support; each provider's free limits as shown in your own console or AI Studio.

## Files

| Path | Purpose |
|---|---|
| `api/_lib/http.ts` | `requestId()`, `json()`, `log()`, `checkOrigin()`, `rateLimit()`, `ipHash()` |
| `api/_lib/providers.ts` | `PROVIDERS` list from env (name, baseUrl, key, model); `chat(provider, body, signal)` via one OpenAI-compatible adapter; per-provider breaker state |
| `api/v1/assistant.ts` | POST: validate, origin, rate limit, chain, respond |
| `api/v1/health.ts` | GET: key presence, origins, data manifest |
| `api/_lib/*.test.ts`, `api/v1/assistant.test.ts` | Tests with a fake `fetch` |

## Interfaces

```ts
// api/_lib/providers.ts
export type Provider = { name: "gemini" | "groq" | "openrouter"; baseUrl: string; key: string | undefined; model: string };
// gemini:     https://generativelanguage.googleapis.com/v1beta/openai   (confirm on day 1)
// groq:       https://api.groq.com/openai/v1
// openrouter: https://openrouter.ai/api/v1
export async function runChain(input: AssistantInput, deps: { fetch: typeof fetch; now(): number }): Promise<{ provider: string; message: AssistantMessage; fallbacks: string[] }>;
// seniordev: breaker state is per function instance; a shared store is only needed at much higher traffic
```

```ts
// api/v1/assistant.ts
const Body = z.object({
  persona: z.enum(["suit", "mission-control"]),
  lang: z.enum(["en", "hi", "kn"]),
  messages: z.array(Message).min(1).max(20),
  tools: z.array(ToolSchema).max(12),
}).strict();
```

## Validation and errors

Per `IMPLEMENTATION_PLAN.md` section 7: 400 INVALID_BODY, 403 ORIGIN_NOT_ALLOWED, 405 other methods, 413 bodies over 32 KB, 429 RATE_LIMITED with `Retry-After`, 503 ALL_PROVIDERS_FAILED. Every response carries `X-Request-Id` and `Cache-Control: no-store`. One JSON log line per request with provider, fallbacks, latency and status, never message text.

## Tests (write first)

| Given | When | Then |
|---|---|---|
| Origin not in the list | POST | 403, no provider call |
| Body with an unknown persona or extra field | POST | 400 with field errors |
| Body over 32 KB | POST | 413 |
| 30 good calls from one IP | 31st within 10 min | 429, `Retry-After` > 0 |
| Gemini returns 429 | POST | Groq answers; response `provider: "groq"`, log shows fallback |
| Gemini times out (8 s) and Groq returns 500 | POST | OpenRouter answers |
| All three fail | POST | 503 ALL_PROVIDERS_FAILED |
| Gemini fails 3 times in a row | next POST within 60 s | Gemini skipped (breaker open), no call made |
| Provider returns tool calls | POST | `message.toolCalls` passed through unchanged; no tool executed server-side |
| No keys set | GET health | 503 `degraded` |

## Verification

```
npm test
npx vercel dev
curl -s -X POST http://localhost:3000/api/v1/assistant -H "Origin: http://localhost:5173" -H "Content-Type: application/json" -d "{\"persona\":\"suit\",\"lang\":\"en\",\"messages\":[{\"role\":\"user\",\"content\":\"Say ready.\"}],\"tools\":[]}"
curl -s http://localhost:3000/api/v1/health
```
Expected: a reply naming the provider used; then remove `GEMINI_API_KEY` locally and confirm Groq answers.

## Rollback

Delete `api/`; the app still works with the offline assistant.

## Outcome (29 Oct 2026)

Built `api/v1/assistant.ts`, `api/v1/health.ts`, `api/_lib/http.ts`, `api/_lib/providers.ts`: one OpenAI-compatible adapter tries Gemini `gemini-3.8-flash`, Groq `openai/gpt-oss-120b`, then OpenRouter `openrouter/free`; 8 s timeout; circuit breaker after 3 failures for 60 s; 30 requests per 10 minutes per IP hash; origin allow-list; zod validation; 32 KB body limit; JSON logs without question text. With no keys it answers 503 and the browser uses offline rules.

Verification: 8 tests in `api/v1/assistant.test.ts` pass (403, 400, 413, 429, fallback then 503, breaker, tool calls passed through, 503 with no keys). Live providers were not called (no keys locally).

Full record: `BUILD_LOG.md`.
