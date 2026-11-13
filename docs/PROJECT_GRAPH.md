# Project graph: how Homeward fits together

> Version 3.0.0 | 2026-11-13 | Built with graphify (code by syntax tree, documents by two extraction agents). Refresh after every change (section 4).

`graphify-out/` holds a knowledge graph of the whole repository: every source file, function and component, and every document, decision, feature, dataset and fact ID the documents name, with the links between them. Open `graphify-out/graph.html` in a browser to explore it; `graphify-out/GRAPH_REPORT.md` is the written summary; `graphify-out/graph.json` is the data.

## 1. What is in it (13 Nov 2026)

- 1,141 nodes, 3,212 edges, 60 communities after the 3.0 code was added (first full build: 1,055 nodes, 2,977 edges, 44 communities, from 70 code files and 29 documents).
- 87% of edges are EXTRACTED (an import, a call, or a document naming a file); 13% are INFERRED by the extraction agents (average confidence 0.9); none AMBIGUOUS.
- Generated data (`app/public/`), build output and the lock file are left out by `.graphifyignore`.

## 2. Connection check (the team asked that every connection works)

| Check | Result |
|---|---|
| Edges pointing at a missing project file or symbol | None. The 55 edges with no target node all point at outside libraries (numpy, rasterio, Node's fs and crypto, Python's json and math) and one CSS import, which the extractor does not model |
| Import cycles | None |
| Documents naming files that do not exist | Found by the extraction agents: `app/src/assistant/mission-control.ts`, `app/src/data/schemas.ts`, `app/src/features.ts`, `pipeline/make_tiles.py`, `eval/run.mjs`. All are plan-era names in `IMPLEMENTATION_PLAN.md` and `FEATURE_TICKETS.md` (the code went elsewhere: Mission Control lives in `Dock.tsx`, schemas in `data/load.ts`, the eval in `assistant/eval.test.ts`, terrain in `make_rasters.py`) |
| Weakly connected nodes | 28 symbols with one link or none, mostly fact IDs and not-built features (F17, F24) named in one document only |

## 3. The main paths through the app (checked against the code)

- **Facts to screen:** `pipeline/facts.csv` and `sources.csv` → `build_facts.py` (checks badges and sources) → `data/facts.json` → `data/load.ts` (zod) → `ui.tsx` `FactRow` and `SourceLink` → every scene. Diagnostics checks 09 and 10 guard the first step.
- **Globe:** `App.tsx` `Shell` creates the globe lazily (`globe/globe.ts`), which reads our rasters (`data/globe/`), streams live tiles (`layers.ts`, `live.ts`) and live 200 m relief (`dem.ts` with `dem.worker.ts`), and renders on demand. Scenes never import Cesium; they call the globe API through `runtime.tsx` `useRuntime`.
- **Planner:** `data/site/<zone>/grid.bin` → `use-planner.ts` → `planner.worker.ts` → `planner.ts` (A* route, Dijkstra walk-back field, budgets) → `Plan.tsx` and `Walk.tsx`; `los.ts` adds radio line of sight on the same grid.
- **Rover view:** `rovers/raw.ts` (stops, NASA raw-image APIs, zod) → `core/camera.ts` (CAHV placement) → `Relive.tsx` (street view and the ride).
- **Conditions:** `core/conditions.ts` → NASA's REMS feed (direct) and `api/v1/spaceweather.ts` (DONKI, through our relay) → `Briefing.tsx`.
- **Assistant:** `Dock.tsx` → `brain.ts` → `api/v1/assistant.ts` → `api/_lib/providers.ts` (Gemini, Groq, OpenRouter) or `offline.ts`; tools in `tools.ts` read the same facts and planner.

The most connected nodes are `docs/DATA_SPEC.md`, `PRD.md`, `BUILD_LOG.md`, the `homeward-dev` skill, `ReliveScene`, `useRuntime`, `WalkScene` and `Shell`: they are the places a change ripples out from.

## 4. Keeping it current

| After | Run | Cost |
|---|---|---|
| Any code change | `graphify update .` | Free, seconds (syntax tree only) |
| A document change | `/graphify . --update` in Claude Code (the skill re-reads changed documents with extraction agents) | Agent tokens for the changed files only |
| Asking a question | `graphify query "how does the walk-back field reach the HUD?"`, `graphify path "Shell()" "lineOfSight()"`, `graphify explain "useRuntime()"` | Free |

`graphify-out/cache/` and the dated backup folders are local only (git-ignored); `graph.json`, `graph.html`, `GRAPH_REPORT.md` and `manifest.json` are committed so a new session can read the graph without rebuilding it.
