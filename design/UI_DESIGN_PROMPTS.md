# UI Design Prompts: Homeward

> Version 2.0.0 | 2026-11-01 | Visual spec per component and scene, now built. Section 0 records how the build follows it; section 0.1 covers the scenes added on 1 Nov 2026.

## 0. As built (29 Oct 2026)

Full record of the build session: `BUILD_LOG.md`.

- Dark UI over the 3D view: translucent blurred panels, monospaced numbers, a badge on every number, Lucide icons only, no emojis.
- Presence: eye height 1.7 m; the horizon sits at its real distance with no fog; the real SuperCam wind plays under the descent and the walk; hazards are spoken by the suit voice. Not built: light scaled to 39% of Earth's, suit-interior sound, a Curiosity model, comfort settings.
- Motion: camera flights of 2-4 s; tooltips fade in after 200 ms; toasts slide in; reduced motion respected.
- Phone layout: section 0 of `docs/FRONTEND_SPEC.md`.

### 0.1 Added on 1 Nov 2026

- Explore: the globe fills the screen like a map app. Map controls stack top left as 44 px glass buttons (zoom, face north with a live compass, tilt, home, ruler); the cursor readout is a pill at the bottom centre (top on phones); the side panel holds search, the selected place card, the lander list and layers. Track colours have their own tokens (`--color-track-msl`, `-m20`, `-heli`, `--color-measure`) and a legend.
- Rover view: the photos are the scene. Nothing covers them except the step arrows (round chevrons on an ellipse at the bottom, rotated towards each neighbouring stop), small pill markers on the ground where the next stops are, a status chip while photos load, and the side panel. Raw NASA photos are shown as they are, grey or yellow-cast, with no colour correction, and the panel says so.
- Walk: the HUD gains a guide cell with an arrow to the science stop, then home; the walk pad sits in the side panel so it never covers the assistant bar.

## 1. Direction

A scientist's instrument over a real planet. The 3D view is the hero; UI is quiet, precise glass panels at the edges, monospaced numbers, and one warm accent (Mars butterscotch) for the route and primary actions. Reference feel: a mission operations console crossed with a field guide. Information density is medium: the HUD is sparse, the planner and briefing are data-rich.

## 2. Global elements

| Element | Layout | Look | States |
|---|---|---|---|
| Top bar | Full width, 48 px, over the globe | `--panel-bg` with blur; scene stepper centre; clock chip left; offline, credits, assistant right | Active scene underlined in accent; offline icon `WifiOff` in warn colour when offline |
| Panel | Right side 360-420 px (desktop), bottom sheet (mobile) | `--panel-bg`, `--radius-lg`, `--shadow-lg`, `--space-4` padding | Loading: skeleton shapes; error: breach-coloured left border 3 px, message, incident ID in mono, Retry button; empty: muted text and one action |
| Badge | Inline pill after a value | 11 px uppercase label, 1 px border in badge colour, text in badge colour, transparent fill | Hover/focus shows tooltip with the badge meaning |
| Source chip | After badges or captions | `Link` icon 12 px + short source name, info colour | Hover underline; opens the source card |
| Tooltip | 8 px from target, arrow 6 px | Raised surface, `--shadow-md`, `--text-sm`, max width 280 px | 200 ms delay; flips at edges; Escape closes |
| Budget bar | Label, value in mono, 8 px bar, limit tick | Fill colour by state plus pattern (solid, stripes, cross-hatch); limit tick in text colour | Skeleton while computing; animates over `--motion-normal` |
| Toast | Bottom centre | Raised surface, icon by type, auto-dismiss 5 s (errors stay) | Focusable; announced via live region |
| Skeleton | Matches final shape | Raised surface with shimmer highlight | Static under reduced motion |

## 3. Scenes

| Scene | Composition | Notes |
|---|---|---|
| 0 Mission clock | Centred card over a slowly rotating Mars; large mono values for LTST at Gale, Ls and season; secondary rows for sunrise UTC/IST, sols, delay | "This is Mars right now" caption; LIVE badges; Continue button in accent |
| 1 Orbit | Full-screen globe; small labels for Phobos, Deimos, Earth (a bright point with a thin ring and label "Earth"); orbiters (P1) as small diamonds with agency names | Tap any object for its source card |
| 3 Descent | Letterboxed (2.39:1 bars fading in) during the descent; HUD top-left: altitude, speed, phase (Entry, Parachute, TRN, Touchdown) in mono | Bars and HUD removed at touchdown; reduced motion = fade |
| 4 Briefing | Three stacked cards: LIVE (time, Sun, delay), MODELLED (MCD hour table with an hour picker), MEASURED (REMS ranges); a fourth for limits (STANDARD) and dose | Each value row: label, value, unit, badge, chip |
| 5 Plan | Panel: stops (drag to reorder), sliders (ASSUMPTION badges), five budget bars, breach list, Approve; globe: route in accent 3 px with a dark 1 px casing, stops as numbered circles, heat map at 35% opacity with hatch for negative margin | Approve disabled with a tooltip listing breaches |
| 6 Walk | Minimal HUD bottom-left: life support, time home, dose, Sun to sunset, radio delay; compass strip top-centre; captions dock bottom-centre | HUD numbers 20 px mono; warn and breach states pulse once then stay outlined |
| 7 Science stop | Card with the sol 182 photo (credited), title "Sheepbed mudstone, Yellowknife Bay", two facts with chips, "Why it matters" paragraph, Log sample | Photo never cropped in a way that hides the credit |
| 8 Event | Toast-style alert top-centre with `TriangleAlert`; event card with numbers and sources; suggested question chip | The dust column itself carries a small GENERATED tag in the view |
| 9 Debrief | Two columns: planned versus walked; totals; Export and Share buttons | |
| 10 Relive | Timeline strip across the bottom with real moments (paper 7.4), sol 182 selected; photos as a 2x2 grid with credits; weather and dose cards | Rover model lit by the sol's Sun |
| 12 Credits | Grouped list by agency, each dataset with licence and link; AI disclosure at top | Plain text, no logos |

## 4. Mars sky look checklist (scene 3 and walk)

- [ ] Daytime sky hazy butterscotch, not Earth blue (NASA Mars Facts).
- [ ] Horizon haze stronger than at the zenith.
- [ ] Sun small: 0.33 deg across (TIME-07), about 62% of its size from Earth.
- [ ] At sunset, a bluish glow around the Sun (Curiosity sol 956 photo), only if the Mie sky (P2) is built; otherwise do not fake it.
- [ ] Shadows match the Sun direction from Mars24 for the chosen time.
- [ ] Side-by-side screenshots against the reference photos saved in the changelog.

## 5. Icons (lucide-react)

Clock `Clock`, plan `Route`, walk `Footprints`, assistant `Mic`, Mission Control `RadioTower`, relive `History`, credits `BookOpen`, layers `Layers`, offline `WifiOff`, warning `TriangleAlert`, breach `OctagonX`, ok `CircleCheck`, source `Link`, export `Download`, share `Share2`, sun `Sun`, radiation `Radiation`, life support `Wind` (oxygen flow), home `House`, sample `FlaskConical`, info `Info`. Size 16 px in panels, 20 px in the HUD; colour inherits text or state.

## 6. Responsive

Mobile (under 640 px): globe full screen, bottom sheet with tabs (Plan, HUD, Assistant), HUD reduced to three values, top bar collapses the stepper into a menu. Tablet: one side panel. Desktop: side panel plus HUD plus captions dock.

## 7. Seasonal variants

Not built (YAGNI). Possible later: token overrides only.

## 8. Presence design: feeling there, from real numbers

The goal is the feeling of standing on Mars without inventing anything. Each cue below is either a measured or computed fact, or labelled GENERATED. Design choices are RECOMMENDATION or ASSUMPTION and adjustable.

| Cue | What the visitor senses | Real basis | Implementation |
|---|---|---|---|
| A close horizon | The world ends sooner than on Earth | 3.39 km at 1.7 m eye height versus 4.65 km on Earth (PLN-12) | No distance fog that hides it closer; correct ellipsoid curvature only |
| Dimmer, warmer light | Noon looks like a soft overcast afternoon | 39% of Earth's sunlight on 14 Nov (PLN-13); dusty butterscotch sky (NASA Mars Facts) | Exposure scaled to the irradiance; tuned atmosphere (chunk 08) |
| A small Sun | The Sun looks shrunken | 0.33 deg, about 62% of its size from Earth (TIME-07) | Sun disc size from the ephemeris |
| Quiet, thin air | Sounds are muffled and do not carry | Two sound speeds; high pitches fade within about 8 m (SND-01) | Web Audio filter; NASA microphone wind |
| Being in a suit | Breathing and fan hum, voices only by radio | Suits are always needed (6.36 mbar, PLN-03) | Suit-interior loop (GENERATED, credited); radio band-pass on Mission Control |
| Distance from home | Earth is a single bright star after sunset | 37.9 deg east of the Sun on 14 Nov (TIME-09) | Earth marker in the night sky |
| Scale | A car-sized rover next to you | NASA's Curiosity model | Model at Yellowknife Bay and Dingo Gap |
| Ground underfoot | Real rocks and sand at your feet | JPL's rover-built terrain at Dingo Gap (DATA-23) | Walk at eye height there |
| Time pressure | Margins counting down calmly | EVA-01, EVA-04 | One primary HUD number ("time home"), others on demand |

Calm-cockpit rules (RECOMMENDATION): one primary number on the HUD; every warning comes with the next action ("Return now: 9 min walk home"); no flashing except a single pulse on a new breach; voice confirms decisions in one sentence; nothing startles the user except a real event.

Comfort (P1): field-of-view slider (default 70 deg, ASSUMPTION), head bob off by default, optional vignette while turning, snap turn, reduced motion. Frame rate is protected first: the Low preset kicks in before the experience stutters.
