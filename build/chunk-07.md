# Chunk 07: Scenes and panels

> Version 1.0.0 | 2026-10-29 | Goal: the P0 story from mission clock to credits, every panel with four states. Tickets T09, T10, T11, T12, T18 (UI), T19; P1: T25, T26.

| Field | Value |
|---|---|
| Estimated time | 10 h (split between 3D engineer, planner engineer, science lead) |
| Depends on | 04, 06 |
| Unlocks | 08 |

## Scenes (spec in `APP_FLOW.md` section 2; look in `design/UI_DESIGN_PROMPTS.md`)

| File | Scene | Data | Key behaviour |
|---|---|---|---|
| `scenes/Clock.tsx` | 0 | `marsTime`, `localSolar`, `nextSunEvent`, `solNumber`, `lightTimeMin` | Updates each second; IST shown beside UTC; LIVE badges |
| `scenes/Briefing.tsx` | 4 | facts, `conditions/gale-ls22.json`, Mars24 | Three badge groups; hour picker 06-18 LTST |
| `scenes/Plan.tsx` | 5 | planner worker, grid | Stop list, sliders with tooltips, budget bars, breach list, heat-map toggle, Approve gated |
| `scenes/Walk.tsx` | 6 | walk camera, plan timeline | HUD, warnings at 25% and 10% margin, forced-return prompt |
| `scenes/ScienceStop.tsx` | 7 | facts SCI-01, SCI-02, sol 182 photo | Discovery card; Log sample (optimistic) |
| `scenes/Debrief.tsx` | 9 | plan versus walked | Totals; Share URL; Export (P1) |
| `scenes/Relive.tsx` | 10 | `sols/msl-0182.json`, traverse | Rover model at SITE-02 with waypoint yaw; Sun for the sol; 4+ photos; weather and dose cards; "What would a human need here?" runs the planner |
| `scenes/Credits.tsx` | 12 | `sources.json` | Grouped by agency; licence; link; AI disclosure; no logos |

## Walk camera (`globe/camera.ts`)

- Eye height 1.7 m (ASSUMPTION) above terrain sampled with `sampleHeightMostDetailed` (throttled 100 ms; interpolate between samples).
- Speed from `walkSpeedKmh` on the local slope; auto-walk follows the planned path; manual WASD is clamped to passable cells (blocked cells stop movement with a tooltip "Too steep for a suited walk: 23 deg > 20 deg").
- Distance walked, time and dose accrue from the same core functions as the plan, so plan and walk always agree.

## Planner heat map

Colour ramp over `timeHomeField` with 4 bands plus a hatched band where the walk-back margin would be negative at the current elapsed time. Bands labelled in minutes; not colour-only (hatch pattern and legend text).

## State, caching, validation

- Every data panel uses `Panel` (four states). Skeleton shapes per `docs/FRONTEND_SPEC.md` section 1.
- Plan state: URL + localStorage on every change; restore on reload; never cleared on error.
- Sample log: in the URL state as a compact list; validated (note max 200 characters).
- Sol 182 images: lazy-loaded, fixed dimensions, credit line under each.

## P1 in this chunk

T25 export (GeoJSON: route LineString, stops and samples as Points, `properties.sources`; CSV: minute-by-minute timeline with a sources header) and T26 measurement tools (distance via `haversineM`, elevation profile from the grid, slope histogram, line of sight sampled along the segment).

## Verification

```
npm test
npm run e2e        # the demo path spec, see docs/TESTING_STRATEGY.md section 1
```
Manual: keyboard-only run through scenes 0-12; screen reader announces scene headings; every number shows a badge; Yellowknife Bay plan is OK by default and breaches as documented when stop time is raised to 470 minutes.

## Rollback

Each scene is lazy and behind the scene switch; a broken scene can be hidden from the stepper with a flag while the rest ships.

## Outcome (29 Oct 2026)

Built the 8 scenes: Mars now, Orbit, Descent, Briefing, Plan (two zones, budgets, heat map, sliders, provenance, Clear plan), Walk (HUD, auto and manual walking, science stop, sample log, debrief, GeoJSON and CSV export, share), Relive (sols 182, 528, 4709), Credits.

Fixed during testing: the assistant bar overlapped the side panel and the subject hid behind it (layout plus camera re-centring); the side panel scrolled sideways (tooltips); phone layout overlaps; walk events outliving the Walk scene.

Verification: every scene exercised in the dev server and the production preview; Gale plan 905 m round trip and boxwork 659 m with all budgets OK.

Full record: `BUILD_LOG.md`.
