# Chunk 06: Frontend shell and our own Mars globe

> Version 1.0.0 | 2026-10-29 | Goal: the app frame, design tokens, shared UI pieces, data loading, URL state, and Mars on our own terrain and imagery tiles, with the alignment check passed. Tickets T05, T06, T20.

| Field | Value |
|---|---|
| Estimated time | 4 h |
| Depends on | 01; 03 for tiles (start with the global levels as soon as they exist) |
| Unlocks | 07 |
| Owner | 3D engineer |

## Day-1 check (15 minutes)

Read the CesiumJS 1.146 reference for `Ellipsoid.MARS`, `Globe`, `CustomHeightmapTerrainProvider` (options: `callback(x, y, level)`, `width`, `height`, `tilingScheme`; return a typed array of heights or `undefined` to keep the parent tile), `GeographicTilingScheme` (`ellipsoid` option), `UrlTemplateImageryProvider` and `Cesium3DTileset`. Record exact names in the changelog.

## Files

| Path | Purpose |
|---|---|
| `app/src/main.tsx` | Sets `window.CESIUM_BASE_URL = "/cesium/"` before importing Cesium; mounts `App`; registers the service worker (chunk 08) |
| `app/src/App.tsx` | Top bar (scene stepper, clock chip, offline indicator, credits, assistant button), scene switch, error boundaries per `docs/FRONTEND_SPEC.md` section 4 |
| `app/src/styles/tokens.css`, `base.css` | From `design/DESIGN_TOKENS.md`; self-hosted fonts with OFL licence files |
| `app/src/ui/*` | `Panel` (4 states), `Skeleton`, `ErrorBoundary`, `Badge`, `SourceChip`, `Tooltip`, `BudgetBar`, `Toast` |
| `app/src/data/schemas.ts`, `load.ts` | zod schemas from `docs/DATA_SPEC.md` section 4; `loadAll()`, `fact(id)`, `source(id)` |
| `app/src/scenes/url-state.ts` | zod schema for hash params; `readState()`, `writeState()` (replaceState, debounced 300 ms), localStorage mirror `homeward:plan:v1` |
| `app/src/globe/viewer.ts` | `createViewer(el)`: `new Viewer(el, { globe: new Globe(Ellipsoid.MARS), baseLayer: false, ... })`; no Cesium ion, no Bing, no Earth sky box; credits container shows our data credits |
| `app/src/globe/terrain.ts` | `marsTerrain()`: `CustomHeightmapTerrainProvider` with `GeographicTilingScheme({ ellipsoid: Ellipsoid.MARS })`, 65x65 samples; callback checks `tiles/v1/terrain/available.json` ranges locally, then fetches `/tiles/v1/terrain/{z}/{x}/{y}.bin` (Int16, metres, decoded with the scale in the manifest) or returns `undefined` |
| `app/src/globe/imagery.ts` | `marsImagery()`: `UrlTemplateImageryProvider` for `/tiles/v1/imagery/{z}/{x}/{y}.jpg`, same tiling scheme, `maximumLevel` from the manifest, `credit` listing the sources on screen |
| `app/src/globe/camera.ts` | `flyToSite(latC, lonE, rangeM)`, `walkCamera()` (chunk 07) |
| `app/src/globe/overlays.ts` | `pin()`, `polyline()` clamped to ground, all positions through `toCesium` |
| `app/src/features.ts` | Feature flags constant |
| `app/src/util/timing.ts` | `debounce`, `throttle` |

## Rules

- No Cesium ion anywhere (README D11): no `Ion.defaultAccessToken`, no `createWorldTerrain`, no ion asset IDs. Diagnostics greps for `Ion.` and `IonResource`.
- All positions go through `toCesium` (README D7).
- WebGL unavailable: static credited image and the recorded walkthrough link.
- Every `Badge` has a tooltip explaining its type.

## Alignment checks (must pass before chunk 07)

1. Pin SITE-01 (lat -4.589467, lon 137.441633, planetocentric) through `toCesium`.
2. Zoom to about 300 m altitude over the 25 cm MSL mosaic tiles. Draw the MSL waypoints from sol 3 to sol 166: the line must run over the terrain features Curiosity crossed and end on the Yellowknife Bay outcrop. If a post-landing HiRISE image of the landing site is used for comparison, the pin must sit on the rover's landing location.
3. Read the terrain height at SITE-01: within 20 m of -4,500.97 m (MMGIS). This proves the areoid reference is shared.
4. Temporarily pin SITE-01 without conversion: it should land about 3.2 km away (SITE-07). Remove the temporary pin.
5. Screenshot steps 2 and 3 into the changelog.

## Verification

```
npm run dev       # globe loads from /tiles, flies to Gale, checks above pass
npm test -- data url-state frames
npm run diag
```

## Rollback

`git revert`; chunk 01's placeholder page returns.

## Outcome (29 Oct 2026)

Built `globe/globe.ts` (Mars ellipsoid, own terrain provider over in-memory rasters, per-level imagery, Mars-tuned sky, real sunlight, Earth and moons, pins, route, traverse, heat map, dust-devil column, flights with a timer fallback for hidden tabs, methods safe after destroy), `data/load.ts`, `state.tsx` (URL and local storage), `runtime.tsx`, `ui/ui.tsx` (four-state Panel, badges, sources, tooltips in `<body>`, toasts, error boundaries), `styles/tokens.css` and `styles/app.css`.

Verification: checked in the browser at 1,024 px and 375 px; no hex colours outside tokens (check 11).

Full record: `BUILD_LOG.md`.
