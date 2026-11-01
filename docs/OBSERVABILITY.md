# Observability: Homeward

> Version 2.0.0 | 2026-11-01 | Owner: AI and voice engineer | Status: built; section 0 records what is implemented

## 0. As built (29 Oct 2026)

Full record of the build session: `BUILD_LOG.md`.

- Relay logs (`api/_lib/http.ts`): one JSON line per request with `ts`, `level`, `requestId`, `route`, `status`, `ms`, `ipHash` (first 3 bytes of a SHA-256 of the IP plus `IP_SALT`), `message` and `metadata` (provider used, fallbacks tried, number of tool calls). The text of questions and answers is never logged.
- Health: `GET /api/v1/health` returns `status` (`healthy`, `healthy-offline-assistant` when no AI key is set, or `degraded` with HTTP 503 when the data manifest is unreachable), `checks` (`geminiKey`, `groqKey`, `openrouterKey` as ok or missing, `allowedOrigins`, `dataManifest`), `version` and `uptimeS`.
- `node scripts/diagnostics.mjs --base <url>` calls health (check 17), names the providers with keys, and fails if `ALLOWED_ORIGINS` is not set.
- Browser, since 1 Nov 2026: Explore counts failed live tiles (`globe.liveErrors()`) and says when the globe has fallen back to offline imagery; Rover view shows NASA raw-image failures in its photo panel with an incident ID and Retry, and falls back to the offline copy for featured stops. Nothing is reported to a server.
- Browser: each scene and the assistant sit in an error boundary showing an incident ID with Retry and Copy error report; data panels show their own incident IDs. No analytics and no remote error tracking (README D10).

Sized for a 48-hour event with two functions and a static client. Remote error tracking is skipped in v1 (README D10); every error still carries an incident ID the user can read out or copy.

## 1. Log format (functions and client console)

```json
{ "ts": "2026-11-14T10:12:03.412Z", "level": "warn", "requestId": "b3e1c9f2", "route": "/api/v1/assistant",
  "status": 200, "ms": 1840, "ipHash": "9f2c1a", "message": "Answered after fallback",
  "metadata": { "provider": "groq", "fallbacks": ["gemini:429"], "toolCalls": 1 } }
```

- `requestId`: random 8-hex ID per request, returned in the `X-Request-Id` header and in every JSON body.
- `ipHash`: first 6 hex characters of SHA-256 of the IP plus a per-deployment salt. Raw IPs are never logged.
- Never logged: keys, Authorization headers, audio, question or answer text, tool arguments or results.
- `userId`: not applicable (no users).

Client errors use the same shape with `incidentId` instead of `requestId`, `boundary` or `panel`, and `scene`.

## 2. Levels

| Level | Use |
|---|---|
| debug | Development only (`?debug=1`): tool calls, planner timings, provider used |
| info | Relay requests answered by the first provider |
| warn | Degraded: fallback to a later provider, breaker opened, rate limit hit, offline rules used, frame-rate preset drop |
| error | A request or panel failed |
| fatal | App cannot start (manifest, tiles or WebGL failure) |

## 3. Error classification

| Class | Status | Example | User message |
|---|---|---|---|
| UserError | 400 / 413 | Bad persona; body too big | "That question could not be sent. Please shorten it." |
| OriginError | 403 | Unknown origin | (not shown in the app) |
| RateLimited | 429 | 31st call in 10 minutes | "The online assistant is resting for a few minutes; offline answers are on." |
| ExternalError | 503 | Every provider failed | "Online assistant unavailable, using offline answers." |
| SystemError | 500 | Our bug | "Something went wrong (ID b3e1c9f2)." |
| DataError | client | Data or tile manifest failed zod | "This data did not pass its checks (ID ...)." |

## 4. Error reporting in the client

Each error boundary and panel error shows the incident ID and a "Copy error report" button that copies the JSON log line (no personal data). The team pastes it into the team chat during the event. That is the whole error-tracking system for v1.

## 5. Health check

`GET /api/v1/health`:

```json
{ "status": "healthy", "checks": { "geminiKey": "ok", "groqKey": "ok", "openrouterKey": "ok", "allowedOrigins": "ok", "dataManifest": "ok" }, "version": "0.2.0", "uptimeS": 3600 }
```

- `dataManifest`: fetches `/data/manifest.json` from the same deployment.
- 200 if at least one provider key is set and the manifest loads; 503 with `"status": "degraded"` otherwise. A missing key for a later provider shows `"missing"` but does not fail the check.
- It never calls a provider (that would spend free quota).
- The diagnostics script and the pre-demo checklist call it.

## 6. Tracing

`requestId` is generated at the relay's entry, used on every log line for that request, and returned to the client, which shows it in the assistant's error state. That links a failed answer on screen to its function log line, including which providers were tried.

## 7. Metrics

| Metric | Where |
|---|---|
| Relay latency, status counts, provider used, fallbacks | Vercel function logs |
| Free-quota use | Each provider's console (AI Studio, Groq console, OpenRouter activity page), checked by the AI engineer before each eval and every 2 hours from H28 |
| Frame rate | Debug overlay (`?debug=1`): fps p50 and p5 over the last 10 s |
| Planner timings | Debug overlay: walk-back field ms, route ms |
| Assistant quality | `eval/results-<provider>-<date>.json` |

## 8. Alerting

| Trigger | Channel |
|---|---|
| Production deployment failed | Vercel email |
| Health 503 or fallbacks on most requests during the demo window | The pre-demo checklist run by the lead every 2 hours from H28 |

## 9. Dashboard

The `?debug=1` overlay: fps, planner timings, data and tile manifest dates, last provider used, last 20 log lines. No separate dashboard service.
