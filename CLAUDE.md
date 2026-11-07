# Homeward (NASA Space Apps 2026, Martian Map)

A browser app for exploring Mars and planning and walking a real Marswalk at Gale Crater. Version 1.0 was built on 29 Oct 2026; version 2.0 (1 Nov 2026) added Explore (a Google-Earth style globe), Rover view (street view from Curiosity's and Perseverance's own photos) and walking yourself. Every number comes from real, cited data.

## Where to begin (state on 7 Nov 2026)

- Done: version 1.0 and 2.0 are built, every document and both skills are at the 2.0 as-built state, all checks pass (52 tests; diagnostics 19 PASS, 0 FAIL, 1 SKIP), and everything is pushed to GitHub `main` (one commit, `eae7574`, plus any later ones).
- Not done (team steps or open items): deploy on Vercel from the GitHub repository and run `node scripts/diagnostics.mjs --base <url>`; confirm Esri's terms for the CTX and HiRISE tiles (`legal/COMPLIANCE.md` section 4; fallback: make Viking the default layer); 200 m terrain at landing sites other than Gale (`build/PLAN-2.md` section 5); the cut list in `build/MANIFEST.md`; demo film or slides and the submission (events open 14 Nov 2026, 09:00 local; read `legal/COMPLIANCE.md` 1.1 first).
- First move in a new session: run the start steps below, then ask the team what they want next. The team sets priorities; if they give none, follow "NEXT AI SHOULD" in the newest `CHANGELOG.md` entry. Dingo Gap 3D (T41) stays deferred until they ask.

## Start of every session

1. Read `README.md` (rules, decisions D1-D20, section 13 for what is built and what is not, section 14 for run and deploy).
2. Read the newest entry in `CHANGELOG.md`, especially "NEXT AI SHOULD".
3. Read `build/MANIFEST.md` (chunk status 00-16 and the cut list of features not built yet). Chunks 10-16 and the research behind them are in `build/PLAN-2.md`.
4. For detail on any past decision or bug, read `BUILD_LOG.md` (sections 6 and 7 for version 1.0, section 12 for version 2.0).
5. Use the project skills: `homeward-dev` for code, tests and pipeline work (its "Traps already hit" list saves hours); `homeward-facts` whenever a number, source, lander or data file changes.
6. Run `npm test` and `npm run diag` before changing anything, so you know the starting state (1 Nov 2026: 52 tests; 19 PASS, 0 FAIL, 1 SKIP).

## Rules that never bend

- Real data only: every number on screen comes from `pipeline/facts.csv` or `pipeline/landers.csv` (with badge and source), a NASA record shown with its source, or a tested function in `app/src/core/`. No invented, demo or placeholder data.
- Zero budget: free tiers, open-source models and public data only. No Cesium ion.
- No NASA logos, no emojis, colours only from `app/src/styles/tokens.css`.
- Never commit secrets; keys live only in `.env.local` and Vercel environment variables.
- Do not commit or push unless the team asks. The repository is git, branch `main`, remote `origin` = https://github.com/rishushaurya/nasa-space-app; the team does not want a Claude `Co-Authored-By` line in commits. `HEALTHSYNC_AI_Humanized.pdf` in the root is not part of the project and stays untracked.
- The CSP allows only our origin plus mars.nasa.gov, trek.nasa.gov and astro.arcgis.com; do not add hosts or `'unsafe-eval'` without a decision in README section 9.
- Keep the event location wording as "Bengaluru".

## End of every session

Add a `CHANGELOG.md` entry, update `build/MANIFEST.md`, update the as-built section of any document you made untrue, and for large sessions add to `BUILD_LOG.md`. Run `npm test`, `npm run typecheck` and `npm run diag`, and check the change in the browser before saying it works: `npm run dev` for features, and `npm run build` then `npm run preview` for anything that loads code, fonts or cross-origin files, because only the preview sends the production headers (CSP). Keep the browser pane visible while checking anything animated: a hidden pane runs at about one frame per second.
