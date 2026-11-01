# Design Tokens: Homeward

> Version 2.0.0 | 2026-11-01 | Implemented in `app/src/styles/tokens.css`, which is now the source of truth. Components reference tokens only; diagnostics check 11 fails on any hex colour outside that file.

## 0. As built (29 Oct 2026)

The tokens live in `app/src/styles/tokens.css` (66 lines; four track and ruler colours added on 1 Nov 2026, section 1). The globe reads colours from the same tokens at run time, so no colour is typed into TypeScript. If this file and the CSS disagree, the CSS wins. Full record of the build session: `BUILD_LOG.md`.

## 1. Colour, with measured contrast

WCAG 2.x contrast ratios computed on 28 Oct 2026 against the three surfaces. Text needs at least 4.5:1, large text and UI component boundaries at least 3:1.

| Token | Hex | on bg `#060918` | on surface `#0E1430` | on raised `#161E44` | Use |
|---|---|---|---|---|---|
| `--color-bg` | #060918 | - | - | - | Page and space background |
| `--color-surface` | #0E1430 | - | - | - | Panels |
| `--color-surface-raised` | #161E44 | - | - | - | Cards, popovers, skeleton base |
| `--color-text` | #E8ECF8 | 16.78 | 15.31 | 13.65 | Body text |
| `--color-text-muted` | #A3ADCC | 8.87 | 8.10 | 7.22 | Labels, secondary text |
| `--color-accent` | #E8A75D | 9.54 | 8.71 | 7.76 | Mars butterscotch: primary actions, route line |
| `--color-on-accent` | #060918 | 9.54 on accent | | | Text on accent buttons |
| `--color-ok` | #4ADE80 | 11.37 | 10.38 | 9.25 | Budget within limits |
| `--color-warn` | #FBBF24 | 11.87 | 10.83 | 9.65 | Margin under 25% |
| `--color-breach` | #F87171 | 7.16 | 6.54 | 5.83 | Limit broken |
| `--color-info` | #60A5FA | 7.79 | 7.11 | 6.34 | Links, info toasts |
| `--color-border` | #3A4680 | 2.23 | 2.04 | 1.82 | Decorative dividers only (not a control boundary) |
| `--color-control-border` | #6B7AC0 | 4.88 | 4.45 | 3.97 | Inputs, sliders, buttons outlines |
| `--color-focus` | #FFD166 | 13.74 | 12.54 | 11.17 | Focus ring |
| `--color-skeleton-highlight` | #222C5C | 1.49 | 1.36 | 1.21 | Shimmer only (decorative) |

Badge colours (always shown with their text label, never colour alone):

| Token | Hex | on bg | on surface | on raised | Badge |
|---|---|---|---|---|---|
| `--badge-live` | #22D3EE | 10.96 | 10.01 | 8.92 | LIVE |
| `--badge-measured` | #6EE7B7 | 13.00 | 11.86 | 10.57 | MEASURED |
| `--badge-modelled` | #C4B5FD | 10.73 | 9.79 | 8.73 | MODELLED |
| `--badge-computed` | #93C5FD | 10.99 | 10.03 | 8.94 | COMPUTED |
| `--badge-standard` | #FDBA74 | 11.75 | 10.72 | 9.55 | STANDARD |
| `--badge-assumption` | #FCD34D | 13.74 | 12.54 | 11.17 | ASSUMPTION |
| `--badge-generated` | #F9A8D4 | 10.92 | 9.97 | 8.88 | GENERATED |

Map lines (added 1 Nov 2026; same hex values as the badges above, so the same contrast, and always paired with a text legend in Explore):

| Token | Hex | on bg | Line |
|---|---|---|---|
| `--color-track-msl` | #22D3EE | 10.96 | Curiosity's track, stops and mini-map line |
| `--color-track-m20` | #6EE7B7 | 13.00 | Perseverance's track and stops |
| `--color-track-heli` | #C4B5FD | 10.73 | Ingenuity's flights |
| `--color-measure` | #FFD166 | 13.74 | The ruler line, its profile and the active ruler button |

Usage rules:
- Budget state = colour + icon (`CircleCheck`, `TriangleAlert`, `OctagonX`) + text ("OK", "LOW", "BREACH") + pattern on the bar (solid, diagonal stripes, cross-hatch).
- Accent is for the one primary action per panel and for the planned route.
- Breach red never used for decoration.
- Change a hex here, then re-run the contrast script in `scripts/` (add a 15-line check in chunk 06 if the palette changes).

## 2. Typography

Fonts self-hosted (SIL OFL 1.1): Inter for UI, JetBrains Mono for numbers in the HUD and data tables (tabular figures).

| Token | Value |
|---|---|
| `--font-sans` | "Inter", system-ui, sans-serif |
| `--font-mono` | "JetBrains Mono", ui-monospace, monospace |
| `--text-xs` / `--text-sm` / `--text-base` / `--text-lg` / `--text-xl` / `--text-2xl` / `--text-3xl` / `--text-4xl` | 12 / 14 / 16 / 18 / 20 / 24 / 32 / 48 px |
| `--weight-regular` / `--weight-medium` / `--weight-bold` | 400 / 500 / 700 |
| `--leading-tight` / `--leading-normal` | 1.2 / 1.5 |

## 3. Spacing, radius, shadow, motion, layers

| Group | Tokens |
|---|---|
| Spacing (4 px base) | `--space-1` 4px, `--space-2` 8px, `--space-3` 12px, `--space-4` 16px, `--space-6` 24px, `--space-8` 32px, `--space-12` 48px, `--space-16` 64px |
| Radius | `--radius-sm` 4px, `--radius-md` 8px, `--radius-lg` 12px, `--radius-xl` 16px, `--radius-full` 9999px |
| Shadow | `--shadow-sm` 0 1px 2px rgb(0 0 0 / 0.4); `--shadow-md` 0 4px 12px rgb(0 0 0 / 0.45); `--shadow-lg` 0 12px 32px rgb(0 0 0 / 0.5); `--shadow-xl` 0 24px 48px rgb(0 0 0 / 0.55) |
| Motion | `--motion-fast` 150ms, `--motion-normal` 300ms, `--motion-slow` 500ms; `--ease-out` cubic-bezier(0.2, 0.8, 0.2, 1); `--ease-in-out` cubic-bezier(0.4, 0, 0.2, 1) |
| Breakpoints (reference; CSS media queries cannot read variables) | sm 640px, md 768px, lg 1024px, xl 1280px |
| Z-index | `--z-hud` 50, `--z-dropdown` 100, `--z-modal` 200, `--z-toast` 300, `--z-tooltip` 400 |
| Panel glass | `--panel-bg` rgb(14 20 48 / 0.88) over the 3D view; `--panel-blur` 8px |

## 4. CSS

```css
/* Homeward | app/src/styles/tokens.css | v0.1.0 | 2026-11-14 */
:root {
  --color-bg: #060918;
  --color-surface: #0E1430;
  --color-surface-raised: #161E44;
  --color-text: #E8ECF8;
  --color-text-muted: #A3ADCC;
  --color-accent: #E8A75D;
  --color-on-accent: #060918;
  --color-ok: #4ADE80;
  --color-warn: #FBBF24;
  --color-breach: #F87171;
  --color-info: #60A5FA;
  --color-border: #3A4680;
  --color-control-border: #6B7AC0;
  --color-focus: #FFD166;
  --color-skeleton-highlight: #222C5C;

  --badge-live: #22D3EE;
  --badge-measured: #6EE7B7;
  --badge-modelled: #C4B5FD;
  --badge-computed: #93C5FD;
  --badge-standard: #FDBA74;
  --badge-assumption: #FCD34D;
  --badge-generated: #F9A8D4;

  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
  --text-xs: 12px; --text-sm: 14px; --text-base: 16px; --text-lg: 18px;
  --text-xl: 20px; --text-2xl: 24px; --text-3xl: 32px; --text-4xl: 48px;
  --weight-regular: 400; --weight-medium: 500; --weight-bold: 700;
  --leading-tight: 1.2; --leading-normal: 1.5;

  --space-1: 4px; --space-2: 8px; --space-3: 12px; --space-4: 16px;
  --space-6: 24px; --space-8: 32px; --space-12: 48px; --space-16: 64px;

  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;

  --shadow-sm: 0 1px 2px rgb(0 0 0 / 0.4);
  --shadow-md: 0 4px 12px rgb(0 0 0 / 0.45);
  --shadow-lg: 0 12px 32px rgb(0 0 0 / 0.5);
  --shadow-xl: 0 24px 48px rgb(0 0 0 / 0.55);

  --motion-fast: 150ms; --motion-normal: 300ms; --motion-slow: 500ms;
  --ease-out: cubic-bezier(0.2, 0.8, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  --z-hud: 50; --z-dropdown: 100; --z-modal: 200; --z-toast: 300; --z-tooltip: 400;

  --panel-bg: rgb(14 20 48 / 0.88);
  --panel-blur: 8px;
}

@media (prefers-reduced-motion: reduce) {
  :root { --motion-fast: 0ms; --motion-normal: 0ms; --motion-slow: 0ms; }
}
```

## 5. Themes

Dark only in v1 (README D9). A light theme or seasonal variant is a second `:root[data-theme="..."]` block overriding the colour tokens; no component changes. Not built (YAGNI).
