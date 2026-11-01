# Chunk 09: Hardening, deploy, submission

> Version 1.0.0 | 2026-10-29 | Goal: a production URL that survives judges, a film and submission that follow every rule. Ticket T33.

| Field | Value |
|---|---|
| Estimated time | 4 h (starts at feature freeze, H28) |
| Depends on | 05, 08 |
| Unlocks | submission |
| Owner | Lead, with everyone |

Note: Docker, nginx and server CI/CD from the generic template are not used; the app is a static site plus two Vercel functions. GitHub Actions runs the checks in `docs/TESTING_STRATEGY.md` section 6.

## Steps

1. **Freeze.** No new features after H28. Flags off for anything not green.
2. **Diagnostics.** `npm run diag` with no FAIL. Paste the summary into the changelog.
3. **Security pass.** Work through every P0 item in `security/SECURITY_CHECKLIST.md`. Confirm no payment method on any provider account, and no CSP errors in the console on the production URL.
4. **Deploy.** `npx vercel --prod`. Set env vars for Production (`GEMINI_API_KEY`, `GEMINI_MODEL`, `GROQ_API_KEY`, `GROQ_MODEL`, `OPENROUTER_API_KEY`, `OPENROUTER_MODEL`, `ALLOWED_ORIGINS`). Add the production origin to `ALLOWED_ORIGINS`. Make sure the tiles and model weights are part of the deployment and within Vercel's free limits; if not, host them on another free static host and add that origin to the CSP with a note.
5. **Smoke test on production.** `curl -I` shows the headers; `/api/v1/health` returns 200; the demo path runs on two browsers (Chrome, Firefox) and on the weakest laptop at the Low preset; then again with the network off after one visit.
6. **Eval.** Final `node eval/run.mjs --provider gemini` and `--provider groq`: at least 38/40 each, zero unsupported numbers. Check the free quota left in each console before judging.
7. **Fact check.** The science lead taps every number in the demo path and follows its source.
8. **Credits.** The credits panel and the repository README list the same sources, licences and AI tools.
9. **Film.** Capture at 1920x1080 from the production build, cut per `TEAMMATE_GUIDE.md` section 11, burn in English subtitles, label the AI voice, no NASA logos, watermark any AI-generated media, credits at the end. Host publicly outside the Space Apps site.
10. **Slides (if used).** Up to 7, English, from real screenshots, outline in `TEAMMATE_GUIDE.md` section 12.
11. **Repository README for judges.** What it is, live link, film link, how to run, data sources and licences (from `sources.json`), AI disclosure, team, and a note on when the planning documents were written (`legal/COMPLIANCE.md` 1.1).
12. **Submit** before the official deadline with several hours of buffer. Screenshot the confirmation into the changelog.
13. **After the event.** Rotate all three provider keys.

## Pre-demo checklist (run every 2 hours from H28, and 30 minutes before judging)

- [ ] `/api/v1/health` 200
- [ ] Globe loads at Gale in under 5 s on venue Wi-Fi
- [ ] Voice connects; if not, offline assistant works
- [ ] Offline mode tested on the demo laptop
- [ ] Recorded walkthrough file on the desktop of the demo laptop
- [ ] Laptop charged, notifications off, browser zoom 100%

## Verification

All of the above ticked; changelog entry "Chunk 09 complete" with the production URL, film URL and submission confirmation.

## Rollback

Vercel keeps previous deployments; promote the last good one from the Vercel dashboard (`vercel rollback` also works).

## Outcome (29 Oct 2026)

Done: hardening (headers including COOP and COEP, rate limit, validation, secrets audit, accepted-risk audit, pinned and hash-checked models, revalidated caching for unhashed paths, offline-only switch), diagnostics, documents updated to the as-built state, `BUILD_LOG.md`.

Left for the team: deploy on Vercel with the keys, `ALLOWED_ORIGINS` and `IP_SALT`; run diagnostics with `--base`; make `og.png` from a real screenshot; add the contact line to the privacy notice; film or slides during the event; settle the early-build question in `legal/COMPLIANCE.md` 1.1 before submitting (submissions open 14 Nov 2026, 09:00 local).

Full record: `BUILD_LOG.md`.
