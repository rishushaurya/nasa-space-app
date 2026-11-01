# Frontend Spec: Homeward

> Version 2.0.0 | 2026-11-01 | Owner: 3D engineer + science and experience lead | Status: built; section 0 records what was implemented

## 0. As built (29 Oct 2026)

Full record of the build session: `BUILD_LOG.md`.

- Shared components in `app/src/ui/ui.tsx`: `Panel` (loading skeleton, error with incident ID and retry, empty, content), `Badge` (each badge explains itself), `SourceLink` (title, publisher, licence, status on hover or focus), `FactRow`, `BudgetBar`, `Tip`, toasts, and an error `Boundary` around every scene and the assistant (Retry, Copy error report).
- Tooltips render in `<body>` with a position clamped to the viewport, so scrolling panels never clip them; they open on hover or keyboard focus and close with Escape.
- Accessibility: visible focus ring on every control; captions and HUD summaries in `aria-live` regions (5 regions); icon buttons carry labels; reduced-motion media query respected; tooltips repeat their text for screen readers.
- Layout: HUD top left, assistant bar bottom left, side panel right (400 px; 340 px under 1,024 px). Under 640 px the side panel becomes a 36vh bottom sheet, the assistant bar sits above it, the HUD drops its secondary row, and the stepper shows icons only; under 480 px the brand name hides.
- Performance: planner and voice each run in a worker; the globe and the assistant models load lazily; startup JavaScript was 122 KB gzip on 29 Oct and is 140 KB gzip on 1 Nov.
- Not built: comfort settings (field of view, vignette, snap turn), a light theme.

### 0.1 Added on 1 Nov 2026 (`build/PLAN-2.md`)

- Scenes: Explore (`scenes/Explore.tsx`) and Rover view (`scenes/Relive.tsx`, scene id `relive`); the stepper has 9 scenes. The assistant bar is hidden in Rover view to leave the photos clear.
- Explore: search is a combobox with an in-flow listbox (arrow keys, Enter, Escape); results sit in the panel because every panel's backdrop blur is its own stacking context. Map controls are 44 px buttons with labels and tooltips (zoom, face north, tilt, home, ruler); the keyboard pans with arrows, zooms with + and -, and N faces north. The cursor readout is `aria-live="off"`. Layers are a radio group plus checkboxes, each with its source link.
- Rover view: a CSS 3D layer (`.pano`, `role="application"` with a spoken description of stop, sol and heading) over the Cesium eye view. Photos are `<img>` elements with `matrix3d` transforms, fetched only once within 100 deg of the view; drag to look, wheel or buttons to zoom, arrows or Page keys to step; step arrows are real buttons with labels; the photo strip is a list of buttons; the full-size view is a modal dialog with focus on Close, arrows and Escape. All four panel states apply (stops and photos are `Panel`s).
- Walk: walking yourself is the default; hold-to-walk buttons use pointer capture so touch works; the HUD adds a guide arrow with a spoken angle; the debrief is a three-column comparison (`.facts.compare`).
- Performance: scenes never import Cesium (camera moves go through `globe.cam`), so startup JavaScript stays at 140 KB gzip.

## 1. Component inventory and the four states

`Panel` is the one wrapper that enforces the four states. Every data-driven component renders through it.

```tsx
// app/src/ui/Panel.tsx (shape only; written on 14 Nov)
type PanelState<T> =
  | { kind: "loading" }
  | { kind: "error"; message: string; incidentId: string; retry: () => void }
  | { kind: "empty"; message: string; action?: { label: string; run: () => void } }
  | { kind: "ok"; data: T };
```

| Component | Loading (skeleton shape) | Success | Error | Empty |
|---|---|---|---|---|
| Mission clock | 6 value rows with label bars | Values with LIVE badges, update each second | "Clock data failed its checks" + Retry | n/a (always computable) |
| Briefing | 3 grouped cards (LIVE, MODELLED, MEASURED) | Values, badges, source chips | Per-card error + Retry | "No modelled data for this hour; choose 06:00-18:00 LTST" |
| Planner | Stop list rows + 5 budget bars shimmer; previous route dimmed | Route, bars, breach list, Approve | "Planner stopped; your plan is safe" + Retry (restarts worker) | "Add a science stop to plan a Marswalk" + Add Yellowknife Bay |
| Walk HUD | Bar outlines | Live values | "HUD lost the plan" + Return to planner | n/a |
| Science card | Image block + 3 text lines | Card, photo credit, paper link, Log sample | Card error + Retry | "No discovery card for this stop yet" |
| Assistant captions | One caption line shimmer while connecting | Streaming caption + source chips | "Voice unavailable" + Retry + Use offline assistant | Suggested questions as buttons |
| Mission Control | Countdown placeholder | Countdown, then reply card | "No reply received" + Retry | "Send a question to Earth" |
| Relive sol | Photo grid of 4 grey tiles + 2 cards | Photos with credits, weather, dose | Per-section error | "The REMS archive has no value for this field on sol 182" |
| Credits | List rows | Grouped sources | Error + Retry | n/a |
| Globe | Full-screen overlay with streaming percentage | Rendered scene | WebGL or ion error panel + recorded walkthrough link | n/a |

## 2. Skeletons

Skeletons match the final layout's size, so nothing shifts when data arrive. Shimmer uses tokens only:

```css
.skeleton {
  background: linear-gradient(90deg, var(--color-surface-raised) 0%, var(--color-skeleton-highlight) 50%, var(--color-surface-raised) 100%);
  background-size: 200% 100%;
  animation: shimmer var(--motion-slow) linear infinite;
  border-radius: var(--radius-sm);
}
@keyframes shimmer { from { background-position: 200% 0; } to { background-position: -200% 0; } }
@media (prefers-reduced-motion: reduce) { .skeleton { animation: none; } }
```

The 3D view does not use skeletons (Cesium streams progressively); it shows a progress overlay.

## 3. Optimistic rendering

| Action | Optimistic result | Rollback |
|---|---|---|
| Log sample | Appears in the log at once | Removed with a toast only if validation fails |
| Add or reorder a stop | Stop list updates at once; route recomputes | Previous route restored if the worker errors |
| Toggle a layer | Layer chip toggles at once | Chip reverts with a toast if the layer fails to load |

## 4. Error boundaries

```
<App>
 ├─ <ErrorBoundary name="topbar">
 ├─ <ErrorBoundary name="globe">          fallback: static credited image + walkthrough link
 ├─ <ErrorBoundary name="scene:<id>">     fallback: "This scene failed" + Back to plan + incident ID
 │    └─ <Panel> instances catch their own data errors
 └─ <ErrorBoundary name="assistant">     fallback: text box with offline assistant
```

Each boundary logs `{ level: "error", boundary, incidentId, message, stack }` to the console as JSON (see `docs/OBSERVABILITY.md`).

## 5. Form persistence (the plan)

- Source of truth: URL hash (`#scene=plan&stops=YKB:60&start=10:00&reserve=30&...`), validated by zod.
- Mirror: `localStorage["homeward:plan:v1"]`, written on every change (debounced 300 ms).
- On load: URL wins; if the URL has no plan, restore from localStorage; if both fail validation, start empty with a toast.
- Plans are never cleared on errors. "Clear plan" is an explicit button.

## 6. Tooltips

One `Tooltip` component: 200 ms show delay, flips at viewport edges, opens on hover and keyboard focus, closes on Escape, linked with `aria-describedby`. Required on: every badge (explains the badge type), every budget bar (limit and source), every slider (what the ASSUMPTION means), every icon-only button, every layer chip (dataset, licence).

## 7. Debounce and throttle

| Event | Strategy | Value |
|---|---|---|
| Corpus search input | debounce | 300 ms |
| Plan slider changes to planner worker | debounce | 150 ms (feels live; the worker is fast) |
| localStorage write | debounce | 300 ms |
| Window resize | debounce | 250 ms |
| Walk camera terrain sampling | throttle | 100 ms |
| HUD screen-reader live region | throttle | 5 s |
| Mission clock | interval | 1 s |

Both helpers live in `app/src/util/timing.ts` (about 20 lines, no library).

## 8. Icons

`lucide-react` only. Named imports per icon (tree-shaken). Icon-only buttons need `aria-label` and a tooltip. Mapping: clock `Clock`, plan `Route`, walk `Footprints`, assistant `Mic`, Mission Control `RadioTower`, relive `History`, credits `BookOpen`, layers `Layers`, offline `WifiOff`, warning `TriangleAlert`, breach `OctagonX`, ok `CircleCheck`, source `Link`, export `Download`, share `Share2`.

## 9. CSS architecture

- `styles/tokens.css`: all custom properties (`design/DESIGN_TOKENS.md`).
- `styles/base.css`: reset, typography, focus ring, reduced motion.
- Component styles: CSS Modules (`Panel.module.css`), referencing tokens only. No hex values outside `tokens.css`; diagnostics greps for them.

## 10. Responsive breakpoints

| Width | Layout |
|---|---|
| under 640 px | Globe full screen; panels become a bottom sheet with tabs; HUD shows 3 values (life support, time home, delay) |
| 640-1023 px | Globe plus one side panel (collapsible) |
| 1024-1279 px | Globe plus side panel plus HUD strip |
| 1280 px and up | Globe, side panel, HUD, assistant captions dock |

Test widths: 360, 768, 1024, 1440, 1920. The film is captured at 1920x1080.

## 11. Motion

| Animation | Duration | Easing | Trigger | Reduced motion |
|---|---|---|---|---|
| Panel enter | `--motion-normal` (300 ms) | `--ease-out` | Scene change | Opacity only |
| Skeleton to content | `--motion-fast` (150 ms) | linear | Data ready | Instant |
| Budget bar change | `--motion-normal` | `--ease-in-out` | Plan change | Instant |
| Breach pulse | 2 x `--motion-slow` | ease | New breach | Static outline |
| Camera fly-to | 3-8 s (Cesium) | Cesium default | Scene change | Cut with a 300 ms fade |
| Descent | 8-12 s | scripted | Scene 3 | Cut to ground with a fade, HUD values listed |

## 12. Theme

Dark only in v1 (README D9). All colours are tokens, so a light theme is a new token block later. Seasonal themes: SKIPPED (YAGNI).

## 13. Accessibility checklist (WCAG 2.2 AA)

- Every interactive element reachable by Tab in a logical order; visible focus ring (`--color-focus`, 13.7:1 on background).
- Walk controls: WASD and arrow keys; Space for auto-walk; Escape opens the menu. All actions also available as buttons.
- Planner usable without the 3D view (stop list, sliders, bars, breach list are plain controls).
- Captions for every spoken line, assistant and Mission Control, with speaker labels.
- Hazard and budget states shown by colour, icon, pattern and text ("BREACH: life support").
- Contrast: all text tokens at least 4.5:1 on every surface (checked in `design/DESIGN_TOKENS.md`); control borders at least 3:1.
- Modals trap focus and return it to the trigger; scene change moves focus to the scene heading.
- `prefers-reduced-motion` respected (section 11).
- Language attribute set per caption when Kannada or Hindi is used (P2).

## 14. Code splitting

- Cesium is loaded in its own chunk (`import("cesium")` from `globe/viewer.ts`); the shell and mission clock render first.
- Lazy: Relive, Tour, Credits scenes; the assistant module and kokoro-js (loaded on the first Assistant press, weights from `/models/`); transformers.js and the Whisper weights (only when the Web Speech API is unavailable or offline).
- Skeleton or the globe overlay shows while a chunk loads.

## 15. Images and media

- Rover photos: snapshot copies in `data/sols/`, `loading="lazy"`, explicit width and height, credit under each.
- Star map: one 8k equirectangular image for the walk sky (P1), 16k only if frame rate allows.
- No image or video generated by AI ships without a visible watermark (`legal/COMPLIANCE.md`).

## 16. Feature flags

A plain constant object in `app/src/features.ts` (`{ orbiters: true, iceLayer: true, dingoGap: true, assistantCloud: true, voiceOut: true, kannadaHindi: false, ... }`). Used to switch off P1 and P2 features in an emergency. No flag service.

## 17. Comfort settings (F29, P1)

Settings panel (stored in localStorage `homeward:comfort:v1`): field of view 60-90 deg (default 70, ASSUMPTION), head bob (off by default), vignette while turning (off), snap turn (off), reduced motion (follows the OS setting by default). See `design/UI_DESIGN_PROMPTS.md` section 8.
