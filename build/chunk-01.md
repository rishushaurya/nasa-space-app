# Chunk 01: Scaffolding

> Version 1.0.0 | 2026-10-29 | Goal: an empty app that builds, type-checks, tests and deploys, with pinned dependencies.

| Field | Value |
|---|---|
| Estimated time | 1 h |
| Depends on | 00 |
| Unlocks | 02, 03, 06 |
| Owner | 3D engineer |

## Steps

1. `git init`; branch `main`; first commit is this chunk (the repository is created on 14 Nov, see `legal/COMPLIANCE.md` 1.1).
2. Re-check versions: `npm view <pkg> version` for every package in README section 6. Use the same versions unless a newer patch fixes a known issue.
3. Create the root `package.json` with exact versions (`npm install --save-exact`):
   - dependencies: `react`, `react-dom`, `cesium`, `lucide-react`, `zod`, `kokoro-js`, `@huggingface/transformers`
   - devDependencies: `vite`, `@vitejs/plugin-react` (check its version), `typescript`, `vitest`, `@playwright/test`, `@types/react`, `@types/react-dom`, `@vercel/node` (types for functions)
   - All free and open source; no paid SDKs.
4. Scripts:

| Script | Command |
|---|---|
| `dev` | `vite` |
| `build` | `npm run cesium:copy && vite build` |
| `typecheck` | `tsc --noEmit` |
| `test` | `vitest run` |
| `e2e` | `playwright test` |
| `diag` | `node scripts/diagnostics.mjs` |
| `cesium:copy` | `node scripts/copy-cesium.mjs` |

5. `scripts/copy-cesium.mjs`: `fs.cpSync` of `node_modules/cesium/Build/Cesium/{Workers,ThirdParty,Assets,Widgets}` to `app/public/cesium/` (about 10 lines, standard library).
6. `vite.config.ts`: `root: "app"`, `build.outDir: "../dist"`, `emptyOutDir: true`, React plugin, `worker.format: "es"`. Define nothing secret.
7. `tsconfig.json`: `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `moduleResolution: "bundler"`, `jsx: "react-jsx"`, includes `app/src`, `api`, `scripts`, `eval`.
8. `vercel.json`: `outputDirectory: "dist"`, `buildCommand: "npm run build"`, headers from `docs/SECURITY_ACCESS.md` section 7.
9. `.gitignore`: `node_modules`, `dist`, `.env`, `.env.local`, `.vercel`, `app/public/cesium`, `pipeline/raw`, `.venv`, `__pycache__`, `*.pyc`, `coverage`, `playwright-report`, `test-results`, `.DS_Store`, `*.log`. Generated `app/public/tiles/` and model weights are large: keep them out of git and publish them with the deployment (or a release asset) with their hashes in the manifest.
10. `.env.example` (all free keys; no credit card needed):

```
# Server only (Vercel env). Never prefix with VITE_.
GEMINI_API_KEY=replace-me
GEMINI_MODEL=gemini-3.8-flash
GROQ_API_KEY=replace-me
GROQ_MODEL=openai/gpt-oss-120b
OPENROUTER_API_KEY=replace-me
OPENROUTER_MODEL=openrouter/free
ALLOWED_ORIGINS=http://localhost:5173,https://your-project.vercel.app
```

11. `app/index.html` with the meta tags from `docs/SEO_PERFORMANCE.md`, `<div id="root">`, and `app/src/main.tsx` rendering a placeholder heading "Homeward" (replaced in chunk 06).
12. Every new file starts with a one-line version header comment: `// Homeward | <path> | v0.1.0 | <date>`.

## Verification

```
npm ci
npm run typecheck
npm test            # "no test files" is acceptable here
npm run build
npm run diag
```
All pass; diagnostics checks 1-6 PASS. `npx vercel` preview deploy shows the placeholder page with the security headers (check with `curl -I`).

## Rollback

`git revert` the chunk commit. Nothing outside the repository changes.

## Outcome (29 Oct 2026)

Built: Vite 8.3.5 with `root: app`, React 19.3.1, strict TypeScript 7.0.2 (`noUncheckedIndexedAccess`), vitest 5.0.5, exact pins, `.env.example`, `.gitignore` (models and Cesium assets ignored, fetched or copied at build), `vercel.json`, `.claude/launch.json`, and a dev-server plugin that runs `api/v1/*.ts` so local work needs no Vercel account. Both dev and preview servers send COOP and COEP.

Verification: `npm run typecheck`, `npm test` and `npm run build` pass.

Full record: `BUILD_LOG.md`.
