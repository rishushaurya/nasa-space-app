# Chunk 00: Manifest and diagnostics

> Version 1.0.0 | 2026-10-29 | Goal: one command that says what works and what does not, with a fix hint per failure.

| Field | Value |
|---|---|
| Estimated time | 30 min |
| Depends on | nothing (start gate 14 Nov 09:00 IST) |
| Unlocks | 01 |
| Owner | 3D engineer |

## Files

| Path | Purpose |
|---|---|
| `scripts/diagnostics.mjs` | Runs every check below; prints `PASS` / `FAIL` / `SKIP` with a fix hint; exits 1 on any FAIL; `--ci` skips checks that need secrets |

Node standard library only (`node:fs`, `node:child_process`, `node:crypto`). No dependencies.

## Checks (added as their chunks land; a check whose files do not exist yet prints SKIP)

| # | Check | Fix hint on FAIL |
|---|---|---|
| 1 | Node version is at least 22.12 | Install Node 22 LTS or 24 |
| 2 | `package-lock.json` exists and no dependency uses `^` or `~` | Pin exact versions (README section 6) |
| 3 | `.env.example` lists every variable in `docs/SECURITY_ACCESS.md` section 3 | Add the missing names with placeholders |
| 4 | No secrets committed: no `AIza`, `gsk_` or `sk-or-` patterns in tracked files; `.env*` (except `.env.example`) git-ignored | Remove, rotate the key, add to `.gitignore` |
| 5 | `app/public/cesium/Workers` exists; no `Ion.` or `IonResource` in `app/src` (README D11) | `npm run cesium:copy`; remove Cesium ion usage |
| 6 | `npm run typecheck` passes | Fix reported type errors |
| 7 | `npm test` passes (summary line captured) | Read the failing test; golden values are in `docs/TESTING_STRATEGY.md` |
| 8 | `data/manifest.json` and `tiles/v1/manifest.json` exist and every listed file's SHA-256 matches; total offline payload within budget | Re-run the pipeline step named in the manifest |
| 9 | Every `facts.json` entry has `badge` and at least one `sourceId` present in `sources.json` | Fix `pipeline/facts.csv` and rebuild |
| 10 | Every `sources.json` URL starts with `https://` and has a licence and credit | Fix `pipeline/sources.csv` |
| 11 | No hex colour literals outside `app/src/styles/tokens.css` | Use a token |
| 12 | No emoji code points in `app/src`, `api/`, docs | Replace with a Lucide icon or text |
| 13 | No `dangerouslySetInnerHTML` in `app/src` | Render as text |
| 14 | No NASA logo files (`*meatball*`, `*insignia*`, `*nasa-logo*`) in `app/public` | Remove; use credit lines |
| 15 | `vercel.json` has CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy | Copy from `docs/SECURITY_ACCESS.md` section 7 |
| 16 | `npm audit --omit=dev` has no high or critical issues | Update the pinned version |
| 17 | (not in `--ci`) `GET /api/v1/health` on the given base URL returns 200 | See `docs/OBSERVABILITY.md` section 5 |
| 18 | `npm run build` succeeds and app JS excluding the Cesium chunk is under 250 KB gzip | Lazy-load more; see `docs/SEO_PERFORMANCE.md` |

Output format:

```
Homeward diagnostics 0.1.0  2026-11-14T09:40:12Z
PASS  01 node >= 22.12 (v24.14.0)
FAIL  05 cesium assets missing
      fix: npm run cesium:copy
SKIP  08 data manifest (chunk 03 not done)
-----
16 PASS  1 FAIL  1 SKIP
```

## Verification

```
node scripts/diagnostics.mjs
```
Expected before chunk 01: check 1 PASS, most others SKIP, exit code 0.

## Rollback

Delete `scripts/diagnostics.mjs`. Nothing else depends on it at this point.

## Outcome (29 Oct 2026)

Built `scripts/diagnostics.mjs` (Node standard library only) with 20 checks: the 18 specified, adapted to the build (env names read from `api/` code; one data manifest because there is no tile pyramid; bundle size measured on the JavaScript loaded at startup), plus 19 (voice and speech models present) and 20 (no stray control characters in source). Flags: `--ci`, `--quick`, `--base <url>`. Check 16 records `sharp` as an accepted audit item and re-verifies it is never shipped. Check 17 reads the health response and fails if `ALLOWED_ORIGINS` is unset (tested against a mock server).

Verification: last full run 19 PASS, 0 FAIL, 1 SKIP (17 needs the deployed URL). The checks found `IP_SALT` missing from `.env.example`, fixed.

Full record: `BUILD_LOG.md`.
