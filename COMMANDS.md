# Commands: Homeward

> Version 2.0.0 | 2026-11-01 | For humans. Section 0 has the commands that work in the built project.

## 0. Commands that work now (1 Nov 2026)

| Task | Command |
|---|---|
| Install | `npm ci` |
| Voice and speech models (once, about 130 MB) | `npm run models` |
| Run app and API relay | `npm run dev`, open http://localhost:5173 |
| Tests | `npm test` |
| Type check | `npm run typecheck` |
| Diagnostics | `npm run diag` (add `-- --quick` to skip build and audit) |
| Production build and preview | `npm run build` then `npm run preview` (http://localhost:4173); the preview sends the same headers as `vercel.json`, CSP included, so a CSP problem shows here before deploy |
| Regenerate data | from `pipeline/`: `../.venv/Scripts/python snapshot.py`, then `make_grid.py`, `make_rasters.py`, `make_moons.py`, `fetch_audio.py`, `rovers.py` (rover stops, tracks, Ingenuity, place names, offline stops), `build_facts.py` (facts, sources and landers), `build_corpus.py`, `manifest.py` |
| After deploy | `node scripts/diagnostics.mjs --base https://your-app.vercel.app` |

Full record of the build session: `BUILD_LOG.md`.

## Shell commands (after chunk 01)

| Command | What it does |
|---|---|
| `npm ci` | Install pinned dependencies exactly from the lockfile |
| `npm run cesium:copy` | Copy Cesium's workers and assets into `app/public/cesium/` |
| `npm run dev` | Dev server at http://localhost:5173 |
| `npx vercel dev` | Dev server with the `api/` functions (needs Vercel CLI login) |
| `npm run typecheck` | `tsc --noEmit` (strict); this is the lint gate |
| `npm test` | Unit tests (vitest), including the golden NASA/ESA checks |
| `npm run e2e` | Not built: there is no browser end-to-end suite yet (scenes were checked by hand) |
| `npm run build` | Production build into `dist/` |
| `npm run diag` | `node scripts/diagnostics.mjs`, PASS/FAIL per check with fix hints |
| `node eval/run.mjs --provider gemini` | Run the 40-question assistant eval against one provider (free; uses daily quota); also `groq`, `openrouter` |
| `python -m venv .venv` then `pip install -r pipeline/requirements.txt` | Pipeline environment |
| `python pipeline/fetch.py` ... `python pipeline/manifest.py` | Data and tile pipeline steps, in order (see `build/chunk-03.md`) |
| `npx vercel --prod` | Deploy to production |

## Phrases for an AI assistant

### Setup and build
| Say | Effect |
|---|---|
| "Execute chunk 04" | The AI reads `build/chunk-04.md`, checks MANIFEST dependencies, builds, verifies, logs |
| "Build everything from scratch" | Chunks 00 to 09 in MANIFEST order, verifying each |
| "Run diagnostics" | `npm run diag` and a summary |
| "Set up the development environment" | Node, Python venv, env file, Cesium copy, first `npm test` |

### Fix
| Say | Effect |
|---|---|
| "The globe is blank, fix it" | Checks `/data/globe/layers.json` and the rasters it lists, the terrain callback, CESIUM_BASE_URL, CSP, console errors; a hidden browser pane pauses rendering |
| "The assistant always says Offline answer, fix it" | Checks `/api/v1/health`, the three keys in Vercel env, `ALLOWED_ORIGINS`, each provider's free quota |
| "Pins are about 3 km off, fix it" | Checks `toCesium` is used (ocentric to ographic, SITE-07) |
| "The assistant gives a number without a source, fix it" | Audits tools for factIds and the instructions rule; re-runs the eval |
| "Voice is silent, fix it" | Checks the Kokoro weights in `/models/`, WebGPU or WASM fallback, autoplay (needs a user gesture), mic permission |
| "Fix all type errors" | `npm run typecheck` until clean |

### UI
| Say | Effect |
|---|---|
| "Change the accent colour to [x]" | Edits `tokens.css` only, re-checks contrast |
| "Redesign the [panel]" | Uses `design/UI_DESIGN_PROMPTS.md`, keeps the 4 states |
| "Make the HUD more minimal" | Reduces HUD to life support, time home, radio delay |

### Features
| Say | Effect |
|---|---|
| "Add a science stop at [place]" | Adds the stop with a cited discovery card and a fact entry |
| "Add a hazard event: [x]" | Only with a cited measurement; adds facts, event file, assistant tool output |
| "Add Kannada and Hindi voice" | Builds T35 (P2) |

### Demo
| Say | Effect |
|---|---|
| "Start the demo for me" | `npm run dev`, opens scene 0 at the scenario date |
| "Prepare for a live demo offline" | Loads every scene once online, then tests with the network off |
| "Reset to the judging-weekend scenario" | Opens `#t=2026-11-14T...` with the Yellowknife Bay plan |

### Deployment
| Say | Effect |
|---|---|
| "Deploy to Vercel" | Chunk 09 steps |
| "Check production health" | GET `/api/v1/health` and a smoke run |

### Emergency
| Say | Effect |
|---|---|
| "Everything is broken, start from the docs" | Session start protocol, diagnostics, fix FAILs in order |
| "I have [X] minutes before the demo, make it work" | Turns off P1/P2 features, enables offline mode, checks the demo path only |
| "Roll back to the last working state" | `git log`, finds the last commit with all diagnostics PASS, reverts to it on a branch |

### Status
| Say | Effect |
|---|---|
| "What is the build status?" | MANIFEST table |
| "Which features work?" | PRD features versus tickets versus tests |
| "Audit the security checklist" | Walks `security/SECURITY_CHECKLIST.md` |
| "Check every on-screen number has a source" | Diagnostics facts check plus a UI grep for numeric literals |
