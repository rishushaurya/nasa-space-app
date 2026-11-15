---
name: homeward-facts
description: Add or change a fact, source, data file or discovery card in Homeward. Use whenever a number, dataset, citation or science claim is added or edited.
---

# Adding real data to Homeward

1. Find the claim in `Martian Map — Space Apps 2026 Research Paper.md` or a primary source (agency page, paper, archive). Open the source; do not rely on memory.
2. Add the source to `pipeline/sources.csv`: id, title, publisher, url (https only), licence, credit, accessed date, status (VERIFIED, SECONDARY, UNVERIFIED).
3. Add the fact to `pipeline/facts.csv`: id (prefix SITE, TIME, PLN, RAD, EVA, DUST, SND, WX, EVT, SCI, EDL, MSN, DATA), label, value, unit, badge (LIVE, MEASURED, MODELLED, COMPUTED, STANDARD, ASSUMPTION, GENERATED), source ids separated by `;`, note.
4. Computed values: implement them in `app/src/core/`, add a golden test against a published value, and use badge COMPUTED.
5. Team choices are ASSUMPTION and must be adjustable in the UI.
6. Rebuild: from `pipeline/`, run `../.venv/Scripts/python build_facts.py` and then `manifest.py`; then `npm test` and `npm run diag` (checks every fact has a badge and a known source, and every file hash).
7. New data files: write them under `app/public/data/` from a pipeline script (examples: `make_moons.py`, `fetch_audio.py`, `rovers.py`), add the source row, rerun `manifest.py`.
7a. Landing sites: one row in `pipeline/landers.csv` (planetocentric lat, east lon -180..180, badge, sources); `build_facts.py` checks it like a fact and writes `data/places/landers.json`. Prefer the PDS Geosciences Node table (PDS-ODE-LANDING) or the mission's own paper; mark anything else SECONDARY.
7b. Live imagery layers: add the entry to `app/src/globe/live.ts` with a `sourceId` from `sources.csv`. A new host also needs the CSP in `vercel.json` (diagnostics check 15 lists the allowed hosts) and a decision row in `docs/CONTEXT.md` section 9.
7c. Rover stops, tracks, Ingenuity flights and Mars place names are refreshed with `pipeline/rovers.py` (NASA MMGIS and the USGS Gazetteer change as missions go on); then `manifest.py`.
8. Mirror important facts in `docs/DATA_SPEC.md` section 2 (data files in section 0.1) and log the change in `CHANGELOG.md`.

Never paste long text from a source: paraphrase, keep at most one short quote with attribution.
