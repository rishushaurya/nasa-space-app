# Homeward (NASA Space Apps 2026, Martian Map)

A browser app for exploring Mars and planning and walking a real Marswalk at Gale Crater. Version 1.0 was built on 29 Oct 2026; version 2.0 (1 Nov 2026) added Explore (a Google-Earth style globe), Rover view (street view from Curiosity's and Perseverance's own photos) and walking yourself. Every number comes from real, cited data.

## Where to begin (state on 14 Nov 2026)

- Done: versions 1.0, 2.0 and 3.0 are built (3.0 on 13 Nov 2026: global 200 m relief, render on demand, science overlays, Spirit and Opportunity tracks, Schiaparelli, tour and ride, lander photos, live weather and space weather, radio line of sight, orbiters; `build/PLAN-3.md`), version 4.0 is built (14 Nov 2026: the five resources the statement lists; `build/PLAN-4.md`), all checks pass (81 tests; diagnostics 19 PASS, 0 FAIL, 1 SKIP locally), and the knowledge graph is in `graphify-out/` (`docs/PROJECT_GRAPH.md`).
- Deployed (14 Nov 2026): https://nasa-space-app-drab.vercel.app (Vercel Hobby, free, connected to GitHub `main`; diagnostics against it 20 PASS, 0 FAIL, 0 SKIP).
- Not done (team steps or open items): add the four free keys in Vercel Project Settings and redeploy (`docs/CONTEXT.md` section 14); confirm Esri's terms for the CTX and HiRISE tiles (`legal/COMPLIANCE.md` section 4; fallback: make Viking the default layer); 200 m terrain at landing sites other than Gale (`build/PLAN-2.md` section 5); the cut list in `build/MANIFEST.md`; the submission (events open 14 Nov 2026, 09:00 local; read `legal/COMPLIANCE.md` 1.1 first). The demo films are scripted and built by `film/` (`film/SCRIPT.md`): re-run section 6 after 09:00 on 14 Nov so the submitted film is made in the event window, then host it publicly (outside the Space Apps site) with its `.srt`.
- First move in a new session: run the start steps below, then ask the team what they want next. The team sets priorities; if they give none, follow "NEXT AI SHOULD" in the newest `CHANGELOG.md` entry. Dingo Gap 3D (T41) stays deferred until they ask.

## Start of every session

1. Read `docs/CONTEXT.md` (rules, decisions D1-D27, section 13 for what is built and what is not, section 14 for run and deploy), then `docs/PROJECT_GRAPH.md` (how the parts connect; query `graphify-out/` instead of re-reading everything).
2. Read the newest entry in `CHANGELOG.md`, especially "NEXT AI SHOULD".
3. Read `build/MANIFEST.md` (chunk status 00-34 and the cut list of features not built yet). Chunks 10-16 are in `build/PLAN-2.md`, chunks 17-26 in `build/PLAN-3.md`, chunks 28-34 in `build/PLAN-4.md`.
4. For detail on any past decision or bug, read `BUILD_LOG.md` (sections 6 and 7 for version 1.0, section 12 for version 2.0, section 13 for version 3.0).
5. Use the project skills: `homeward-dev` for code, tests and pipeline work (its "Traps already hit" list saves hours); `homeward-facts` whenever a number, source, lander or data file changes.
6. Run `npm test` and `npm run diag` before changing anything, so you know the starting state (13 Nov 2026: 73 tests; 19 PASS, 0 FAIL, 1 SKIP).

## Rules that never bend

- Real data only: every number on screen comes from `pipeline/facts.csv` or `pipeline/landers.csv` (with badge and source), a NASA record shown with its source, or a tested function in `app/src/core/`. No invented, demo or placeholder data.
- Zero budget: free tiers, open-source models and public data only. No Cesium ion.
- No NASA logos, no emojis, colours only from `app/src/styles/tokens.css`.
- Never commit secrets; keys live only in `.env.local` and Vercel environment variables.
- Do not commit or push unless the team asks. The repository is git, branch `main`, remote `origin` = https://github.com/rishushaurya/nasa-space-app; the team does not want a Claude `Co-Authored-By` line in commits. `HEALTHSYNC_AI_Humanized.pdf` in the root is not part of the project and stays untracked.
- The CSP allows only our origin plus mars.nasa.gov, trek.nasa.gov, astro.arcgis.com, images-api.nasa.gov, images-assets.nasa.gov and gibs.earthdata.nasa.gov (images only, D33); do not add hosts or `'unsafe-eval'` without a decision in `docs/CONTEXT.md` section 9.
- Keep the event location wording as "Bengaluru".

## End of every session

Run `graphify update .` (code graph, free), add a `CHANGELOG.md` entry, update `build/MANIFEST.md`, update the as-built section of any document you made untrue, and for large sessions add to `BUILD_LOG.md`. Run `npm test`, `npm run typecheck` and `npm run diag`, and check the change in the browser before saying it works: `npm run dev` for features, and `npm run build` then `npm run preview` for anything that loads code, fonts or cross-origin files, because only the preview sends the production headers (CSP). Keep the browser pane visible while checking anything animated: a hidden pane runs at about one frame per second.
