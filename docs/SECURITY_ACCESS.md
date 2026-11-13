# Security and Access: Homeward

> Version 3.0.0 | 2026-11-13 | Owner: AI and voice engineer | Status: built; section 0 records the controls in place
>
> 3.0.0: CSP adds `images-api.nasa.gov` (connect) and `images-assets.nasa.gov` (img) for NASA's image library (README D24); new relay `/api/v1/spaceweather` (D23). 2.0.0: CSP opened to three named NASA and Esri hosts for live tiles and rover photos; COEP `credentialless` (build/PLAN-2.md D15). 0.2.0: relay with free provider chain replaces the voice-key endpoint; no Cesium ion; CSP reduced to our own origin.

## 0. Controls as built (1 Nov 2026)

Full record of the build sessions: `BUILD_LOG.md`.

- Headers (`vercel.json`, all paths): CSP `default-src 'self'; script-src 'self' 'wasm-unsafe-eval'; worker-src 'self' blob:; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob: https://mars.nasa.gov https://trek.nasa.gov https://astro.arcgis.com https://images-assets.nasa.gov; connect-src 'self' blob: data: https://mars.nasa.gov https://trek.nasa.gov https://astro.arcgis.com https://images-api.nasa.gov; media-src 'self' blob: data:; font-src 'self' data:; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests`; HSTS one year with subdomains; X-Frame-Options DENY; nosniff; strict-origin-when-cross-origin referrer; Permissions-Policy allowing only the microphone for this origin; COOP `same-origin` and COEP `credentialless`. Diagnostics check 15 enforces them, including that the CSP names no other host and that `vite.config.ts` uses the same COEP.
- Why these hosts: NASA Mars Trek and Esri OnMars serve the live orbiter tiles and, since 3.0, the 200 m elevation tiles (CORS `*`); mars.nasa.gov serves the rover raw-image records, photos and Curiosity's weather feed; images-api.nasa.gov and images-assets.nasa.gov are NASA's image library (search and files). The image library's records are parsed with zod and image URLs must match `https://images-assets.nasa.gov/image/...jpg` (`app/src/rovers/library.ts`); DONKI is called only by our relay, with the key server-side, a 15 s timeout, 30 requests per 10 minutes per IP hash and a 30-minute cache (`api/v1/spaceweather.ts`). Scripts, models, fonts and the AI relay stay on our own origin; `script-src` is still `'self'` only.
- Why COEP `credentialless` and not `require-corp`: NASA's photo files send no `Cross-Origin-Resource-Policy` header, so `require-corp` blocks them. `credentialless` loads them without cookies and keeps the page cross-origin isolated in Chrome and Firefox (checked: `crossOriginIsolated` is true), so Kokoro keeps its threads. Safari does not support `credentialless`, so there the page is not isolated and Kokoro runs on one thread.
- Tested under the real policy: `npm run preview` sends every header `vercel.json` sends (read from it in `vite.config.ts`). That check found two faults the dev server could not show: Cesium's `Viewer` compiled Knockout bindings with `Function()`, so the globe never started under `script-src 'self'` (now `CesiumWidget`, no widgets); and Vite inlines a small font subset as a `data:` URI (now `font-src 'self' data:`). zod is set to `jitless` so its `Function` probe raises no report. Result: no CSP violations across Explore, Rover view and the assistant.
- Untrusted input from NASA's APIs: every raw-image record is parsed with zod item by item and a bad record is dropped; image URLs must match `https://mars.nasa.gov/...jpg|png` (`app/src/rovers/raw.ts`); photos are shown as `<img>` with `referrerPolicy="no-referrer"` and fetches use `credentials: "omit"`. Nothing from these APIs is rendered as HTML.
- Relay: origin allow-list (`ALLOWED_ORIGINS`), zod validation with unknown fields rejected, 32 KB body limit, 30 requests per 10 minutes per IP hash, 8 s provider timeout, circuit breaker. Keys exist only in server environment variables; `.env.example` holds placeholders (diagnostics checks 03 and 04).
- Supply chain: exact dependency pins; models pinned to Hugging Face commits and checked against SHA-256 values in `data/manifest.json` at build time; `npm audit` reviewed by diagnostics check 16. One accepted item: `sharp` (via transformers.js), Node-only, not shipped to the browser, not imported by the API; the check re-verifies both conditions.
- Privacy controls in the app: a switch in the assistant bar keeps every question on the device; Clear plan resets the saved plan without undoing that choice.

## 1. Threat model

| Asset | Threat | Control |
|---|---|---|
| Gemini, Groq, OpenRouter keys | Leak through the browser, logs or git | Server env only; never in `VITE_*`; diagnostics grep for `AIza`, `gsk_`, `sk-or-` patterns; logs never print headers |
| Free-tier quotas | Someone scripts the relay to exhaust them | Origin check; per-IP rate limit; per-provider breaker; no payment method on any account, so the worst case is "assistant switches to offline rules", never a bill |
| Users' speech and questions | Sent somewhere unexpected | Speech goes only to the browser's speech service (online) or stays on the device (Whisper); question text goes only through our relay to the listed AI providers; stated in `legal/PRIVACY_POLICY.md` and on the first-use panel; mic needs a user gesture |
| App integrity | XSS through corpus text, captions, model output or URL params | No HTML injection; React text rendering; zod on every input; strict CSP |
| Model output | Prompt injection makes the model request harmful actions | Model output is never executed; only known tool names with zod-valid arguments run, and tools only read local state |
| Credibility | Wrong or invented numbers | Facts registry with badges and sources; diagnostics fail on gaps; eval per provider |
| Competition standing | Licence or branding violation | `legal/COMPLIANCE.md` checks; no NASA logos |

## 2. Authentication and authorization

There are no user accounts and no user data stored server-side (README D2), so there is one anonymous role.

```
browser ─► POST /api/v1/assistant
            ├─ Origin in ALLOWED_ORIGINS?               no ─► 403 ORIGIN_NOT_ALLOWED
            ├─ body under 32 KB and matches zod schema?  no ─► 413 / 400 INVALID_BODY
            ├─ IP under 30 calls per 10 minutes?        no ─► 429 RATE_LIMITED + Retry-After
            └─ provider chain (keys added server-side) ─► 200 { provider, message, requestId } | 503
```

| Role | Create | Read | Update | Delete |
|---|---|---|---|---|
| Anonymous visitor | Assistant turns (rate-limited) | All public app data | Own plan in own browser only | Own plan in own browser only |

User isolation is structural: each visitor's plan lives only in their own URL and `localStorage`, and the relay keeps no conversation state between requests. If F27 (shared notebook) is ever built, this section must be rewritten with accounts, owner IDs and server-side checks.

## 3. Secrets

| Variable | Where | Exposed to browser? |
|---|---|---|
| `GEMINI_API_KEY`, `GEMINI_MODEL` | Vercel env (Production, Preview), `.env.local` for `vercel dev` | No |
| `GROQ_API_KEY`, `GROQ_MODEL` | same | No |
| `OPENROUTER_API_KEY`, `OPENROUTER_MODEL` | same | No |
| `ALLOWED_ORIGINS` | Vercel env, comma-separated | No |

`.env.example` lists every name with a placeholder and a comment. `.env`, `.env.local` and `.vercel/` are git-ignored. Rotation: revoke and recreate all three keys after the event and after any suspected leak. No payment method is attached to any provider account.

## 4. Input validation

| Input | Rule |
|---|---|
| Relay body | `{ persona, lang, messages (1-20), tools (max 12) }`, `strict()`, max 32 KB; message content max 4,000 characters |
| URL hash params | zod: `scene` from a fixed list; `stops` as known stop IDs with minutes 0-480; `start` HH:MM; sliders within their documented ranges; `sol` integer 0-6000; camera numbers finite |
| Worker messages | zod on both sides |
| Tool calls from any model | Tool name must be in `TOOLS`; arguments zod-validated; out-of-range values return a tool error the model must report, never a guess; maximum 3 tool rounds per question |
| Data and tile manifests | zod schemas from `docs/DATA_SPEC.md` |
| Speech transcripts and typed questions | string, max 500 characters, trimmed |
| Corpus search query | string, max 200 characters |

SQL: not applicable; there is no database. If one is ever added, parameterised queries only.

## 5. Rate limiting

| Endpoint | Per IP | Window | On limit |
|---|---|---|---|
| `POST /api/v1/assistant` | 30 | 10 min sliding | 429, `Retry-After`; the app answers with offline rules meanwhile |
| `GET /api/v1/health` | 60 | 1 min | 429 |
| Upstream providers | their own free limits | - | Relay moves to the next provider; breaker skips a failing provider for 60 s |

In-memory per function instance (best effort, marked with a `seniordev:` comment). Per-user limits: not applicable (no users).

## 6. CORS

Both functions answer only same-origin requests in production. `ALLOWED_ORIGINS` = production origin, Vercel preview origin for this project, `http://localhost:5173`. Preflight: `Access-Control-Allow-Methods: POST, GET`, `Access-Control-Allow-Headers: Content-Type`, `Access-Control-Max-Age: 600`. No wildcards. No credentials.

## 7. Security headers (`vercel.json`, all routes)

| Header | Value |
|---|---|
| Content-Security-Policy | see below |
| Strict-Transport-Security | `max-age=31536000; includeSubDomains` |
| X-Frame-Options | `DENY` |
| X-Content-Type-Options | `nosniff` |
| Referrer-Policy | `strict-origin-when-cross-origin` |
| Permissions-Policy | `microphone=(self), camera=(), geolocation=(), payment=(), usb=(), xr-spatial-tracking=()` |
| Cross-Origin-Opener-Policy | `same-origin` |

Starting CSP (tighten or extend only for errors seen in the console on day 1, and record why):

```
default-src 'self';
script-src 'self' 'wasm-unsafe-eval';
worker-src 'self' blob:;
style-src 'self' 'unsafe-inline';
img-src 'self' data: blob:;
connect-src 'self';
media-src 'self' blob:;
font-src 'self';
object-src 'none';
base-uri 'self';
form-action 'self';
frame-ancestors 'none';
upgrade-insecure-requests
```

Notes (as planned; section 0 has the as-built CSP, which adds three NASA and Esri hosts for live tiles and rover photos): every file the page loads (tiles, data, models, fonts, audio) comes from our own origin, and every AI call goes through our relay, so `connect-src 'self'` is enough. `'wasm-unsafe-eval'` is for Cesium's WebAssembly decoders, kokoro-js and transformers.js (ONNX Runtime Web). `'unsafe-inline'` for styles is needed by Cesium widgets and React style attributes. The Web Speech API is a browser service and needs no CSP entry. If transformers.js or kokoro-js try to fetch weights from huggingface.co, configure them to load from `/models/` instead of widening the CSP.

## 8. CSRF

No cookies and no sessions, so classic CSRF does not apply. The relay is protected from cross-site browser use by the origin check; non-browser abuse is bounded by the rate limit and the free-tier limits, and cannot cost money.

## 9. XSS

- React renders all corpus text, captions, model output and tool output as text. `dangerouslySetInnerHTML` is banned (diagnostics greps for it).
- Links in source cards come only from `sources.json`, built by our pipeline, and must start with `https://`. Links that appear inside model text are shown as plain text, not as links.
- CSP as above.

## 10. Session management

No sessions. Each relay request is self-contained (the browser sends the short message history). Nothing is stored server-side between requests.

## 11. Not applicable, with reasons

Bloom filter (no high-volume uniqueness checks), thundering-herd coalescing (static immutable files on a CDN), hot-key replication (no cache tier), payment idempotency (no payments), UGC moderation (no user content is published), COPPA age gate (we collect no data; the assistant is optional; see `legal/PRIVACY_POLICY.md`).
