# Security Checklist: Homeward

> Version 2.0.0 | 2026-11-01 | Section 0 records what the build verifies automatically and what is left for deploy day. [P0] items must be ticked before submission.

## 0. Verified on 29 Oct 2026

Full record of the build session: `BUILD_LOG.md`.

Checked automatically on every `node scripts/diagnostics.mjs` run: no secrets in the project and `.env*` ignored (04); every server variable listed with placeholders (03); exact pins (02); `npm audit` with no open high or critical item (16); every header in section 8 plus COOP and COEP (`credentialless`, same in `vite.config.ts`), CSP `connect-src 'self'` with no host beyond mars.nasa.gov, trek.nasa.gov and astro.arcgis.com (15); no `dangerouslySetInnerHTML` (13); no NASA logo files (14); every fact with a badge and a known source, every source with https, licence and credit (09, 10); no control characters in source (20).

Checked by tests: origin allow-list, body validation and size limit, rate limit, provider fallback and circuit breaker (`api/v1/assistant.test.ts`); assistant numbers grounded in tools (`app/src/assistant/eval.test.ts`).

Left for deploy day: keys set only in Vercel environment variables; `ALLOWED_ORIGINS` set to the production URL (diagnostics check 17 fails without it); `IP_SALT` set; HTTPS-only production URL; the team contact line in the privacy notice; the remaining unticked items below.

## 1. API keys and secrets (7)
- [ ] [P0] `GEMINI_API_KEY`, `GROQ_API_KEY`, `OPENROUTER_API_KEY` exist only in Vercel env and local `.env.local`
- [ ] [P0] No secret uses the `VITE_` prefix (Vite exposes those to the browser)
- [ ] [P0] Diagnostics check 4 passes (no `AIza`, `gsk_`, `sk-or-` patterns in tracked files)
- [ ] [P0] `.env.example` has placeholders only
- [ ] [P0] No payment method attached to any provider account (Google AI Studio, Groq, OpenRouter, Vercel)
- [ ] [P0] No Cesium ion token or ion asset anywhere in the code (README D11)
- [ ] Keys rotated after the event

## 2. Input validation (6)
- [ ] [P0] Relay body validated with a strict zod schema (persona, lang, messages, tools)
- [ ] [P0] Body size capped at 32 KB (413 above); message content at 4,000 characters
- [ ] [P0] URL hash params validated; invalid params fall back to defaults
- [ ] [P0] Worker messages validated on both sides
- [ ] [P0] Tool arguments from the model validated per tool
- [ ] Corpus search query capped at 200 characters

## 3. SQL injection (5, all N/A)
- [ ] N/A: no database (README D2)
- [ ] N/A: no query builder or ORM
- [ ] N/A: no stored procedures
- [ ] N/A: no user-generated queries
- [ ] Rule kept for the future: parameterised queries only if a database is ever added

## 4. XSS (6)
- [ ] [P0] No `dangerouslySetInnerHTML` (diagnostics check 13)
- [ ] [P0] Captions, corpus text, model output and tool output rendered as text; links inside model text are not clickable
- [ ] [P0] Source links come only from `sources.json` and start with `https://`
- [ ] [P0] CSP has no `unsafe-eval` for scripts (`wasm-unsafe-eval` only)
- [ ] No inline scripts except the `CESIUM_BASE_URL` assignment, moved into `main.tsx` if possible
- [ ] Export files (GeoJSON, CSV) escape commas and quotes correctly

## 5. CSRF (3)
- [ ] [P0] No cookies set by the app
- [ ] [P0] Relay checks `Origin`
- [ ] Rate limit and free-tier limits bound any non-browser abuse; nothing can be billed

## 6. Rate limiting (5)
- [ ] [P0] Relay: 30 per IP per 10 minutes, 429 with `Retry-After`; per-provider breaker
- [ ] Health endpoint: 60 per IP per minute
- [ ] [P0] Client handles 429 by switching to the offline assistant
- [ ] Rate-limit hits logged at warn level with the IP hash
- [ ] `seniordev:` comment documents the per-instance limit and its upgrade path

## 7. CORS (3)
- [ ] [P0] `ALLOWED_ORIGINS` lists exact origins, no `*`
- [ ] Preflight allows only `POST, GET` and `Content-Type`
- [ ] No credentials allowed

## 8. Security headers (6)
- [ ] [P0] Content-Security-Policy as in `docs/SECURITY_ACCESS.md` section 7, no console violations on production
- [ ] [P0] Strict-Transport-Security max-age 31536000, includeSubDomains
- [ ] [P0] X-Frame-Options DENY and `frame-ancestors 'none'`
- [ ] [P0] X-Content-Type-Options nosniff
- [ ] Referrer-Policy strict-origin-when-cross-origin
- [ ] [P0] Permissions-Policy allows only `microphone=(self)`

## 9. Authentication (8)
- [ ] N/A: no user accounts (README D2)
- [ ] [P0] The browser never receives a provider key; every AI call goes through the relay
- [ ] [P0] Relay keeps no state between requests
- [ ] [P0] Relay responses `Cache-Control: no-store`
- [ ] Provider keys never logged or shown on screen, including in the debug overlay
- [ ] A failed relay call falls back to offline answers without retry storms (one attempt per question)
- [ ] Mic permission requested only after a user gesture and the explanation panel
- [ ] Text input works without the mic

## 10. Authorization (5)
- [ ] One anonymous role documented in `docs/SECURITY_ACCESS.md` section 2
- [ ] No endpoint returns another visitor's data (none stores any)
- [ ] Health endpoint reveals no secret values, only ok/missing
- [ ] Tools cannot reach the network except the local corpus
- [ ] Revisit this whole section if F27 (accounts) is ever built

## 11. Assistant and voice security (5)
- [ ] [P0] CSP `connect-src 'self'` plus only mars.nasa.gov, trek.nasa.gov and astro.arcgis.com (live tiles, rover photos); Kokoro and Whisper weights load from `/models/`
- [ ] [P0] NASA raw-image records are zod-checked item by item, image URLs allow-listed to mars.nasa.gov, fetched without credentials and shown without a referrer (`app/src/rovers/raw.ts`)
- [ ] Relay responses parsed with try/catch and schema-checked
- [ ] Unknown tool names from any model are rejected with a tool error; at most 3 tool rounds
- [ ] Audio is never sent to our server
- [ ] Mission Control replies are produced by the same tools, never from raw model memory

## 12. Error handling (6)
- [ ] [P0] No stack traces in user-visible messages
- [ ] [P0] Every error response has a request ID
- [ ] [P0] Error boundaries per scene, per panel, for the globe and the assistant
- [ ] Logs exclude keys, headers, audio and transcripts
- [ ] Global handlers for `error` and `unhandledrejection` log JSON with an incident ID
- [ ] Data file validation failures show an error state, never partial data

## 13. Dependency security (4)
- [ ] [P0] All versions exact; lockfile committed
- [ ] [P0] `npm audit --omit=dev` shows no high or critical issues
- [ ] Python requirements pinned
- [ ] Only packages in README section 6 (plus `@vitejs/plugin-react` and types) installed

## 14. File handling (5)
- [ ] N/A: no user uploads
- [ ] Downloaded source files hashed in `pipeline/raw/hashes.txt`
- [ ] Data files served with correct content types
- [ ] Self-hosted model weights checked against the publisher's hash
- [ ] Export downloads generated client-side with safe file names

## 15. Production deployment (6)
- [ ] [P0] HTTPS only (Vercel default; HSTS set)
- [ ] [P0] Production env vars set for all three providers and `ALLOWED_ORIGINS`
- [ ] [P0] `/api/v1/health` returns 200 on production
- [ ] Source maps not public, or public only with no secrets inside (Vite default omits them)
- [ ] Previous deployment available for rollback
- [ ] Debug overlay only with `?debug=1` and shows no secrets

## 16. Data privacy (6)
- [ ] [P0] Privacy notice in the About panel matches actual behaviour
- [ ] [P0] No analytics or tracking scripts
- [ ] IPs only hashed in logs
- [ ] Plan stored only in the URL and localStorage; "Clear plan" works
- [ ] Fonts self-hosted (no third-party font requests)
- [ ] Rover photos served from our snapshots (no third-party image requests)

## 17. Content integrity (5)
- [ ] [P0] Every on-screen number has a badge and source (diagnostics checks 9 and 10)
- [ ] [P0] Assistant eval at least 38/40 with zero unsupported numbers
- [ ] [P0] No NASA logos (diagnostics check 14 plus a manual look at the film)
- [ ] [P0] AI-generated media watermarked; AI voice labelled
- [ ] Credits panel equals the repository README

Total: 91 items (P0: 44).
