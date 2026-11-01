# AI Recovery: Homeward

> Version 2.0.0 | 2026-11-01 | Paste these to an AI that drifts. The project is built: start from section 0.

## 0. Current state (1 Nov 2026)

The app is built and verified (version 2.0: Explore, Rover view and walking yourself added). Before changing anything, read `CLAUDE.md`, `README.md` (sections 9, 13 and 14), the newest `CHANGELOG.md` entry, `build/MANIFEST.md`, `build/PLAN-2.md` and `BUILD_LOG.md` (section 12 for 2.0), then run `npm test` and `npm run diag`. The project is a git repository on `main`; commit only when the team asks.

Known traps:
- A hidden browser pane pauses animation frames: camera flights finish on a timer fallback, and frame-rate numbers from a hidden pane mean nothing.
- Editing code through shell heredocs can turn an escaped regex word boundary into a raw backspace byte; use file-editing tools. Diagnostics check 20 catches it.
- The ONNX runtime path must be a full-origin URL, or the dev server breaks the voice.
- Kokoro must stay in its worker; on the main thread it freezes the globe.
- Never add a number to a component: add it to `pipeline/facts.csv` (or a lander to `pipeline/landers.csv`) with a badge and source.
- Scenes must not import Cesium; use the globe API (`globe.cam` and friends), or the startup bundle balloons (diagnostics check 18).
- Use `CesiumWidget`, never `Viewer`: the production CSP has no `'unsafe-eval'`, and Viewer's widgets need it. Check CSP-sensitive changes with `npm run build` then `npm run preview`, which sends the `vercel.json` headers.
- Live tiles are planetocentric: keep `OcentricTiling` or they sit kilometres off.
- Rover photos: the camera model and quaternion conventions are golden-tested (`core/camera.test.ts`); if photos look misplaced, check the data, not the maths, first.
- The full list of traps is in the `homeward-dev` skill.

## Hallucination
- "Stop. Read README.md section 6 and list the tech stack. Use only those. If you need something else, ask first."
- "List the files that actually exist with `git ls-files`. Re-read README.md section 4 and compare."
- "Check your work against TAD.md. If it adds a database, accounts, a router, a state library or a WebSocket server, remove it (README section 9)."
- "Where does this number come from? Show the fact ID in docs/DATA_SPEC.md. If there is none, remove the number or add a sourced fact first."
- "You wrote a coordinate. Is it planetocentric east? Did it go through toCesium? Show the line."

## Context loss
- "Run the session start protocol: README.md, the last 3 CHANGELOG.md entries, build/MANIFEST.md, MENTAL_MODEL.md. Then tell me what you understand."
- "What is the build status? Show the MANIFEST table."
- "What did the last session do? Read the newest CHANGELOG entry and its NEXT AI SHOULD line."

## Conflicts between sessions
- "There is a conflict in [file]. Read CHANGELOG.md for who changed it and why, read TAD.md for the intended design, keep the version that matches, and log the resolution."
- "Chunk [X] has been IN-PROGRESS for more than twice its estimate. Verify what exists against build/chunk-[X].md, finish or restart it, and log it."

## Behaviour
- "Stop adding features. Only build what FEATURE_TICKETS.md lists for the current chunk."
- "Stop using [tech]. TAD.md says [tech]."
- "You changed [file] without a CHANGELOG entry. Add it now."
- "Audit [component] for the 4 states: loading skeleton, success, error with Retry and incident ID, empty with a call to action."
- "Check the plan persists: change it, reload, and confirm it comes back from the URL and localStorage."
- "List both endpoints. Confirm each has validation, origin check, rate limit, structured log and security headers."
- "Run the assistant eval. Any answer with a number no tool returned is a failure. Fix the tools or the instructions, not the test."
- "Remove every emoji and any NASA logo or insignia you added."

## Emergency
- "Everything is broken. Run `npm run diag`. Fix FAILs in the order printed."
- "I have [X] minutes before the demo. Turn off P1 and P2 features behind their flags, switch on offline mode, run the E2E demo path, and tell me what works."
- "Start fresh: keep the docs, delete generated code on a new branch, re-run chunk 01 onwards."
