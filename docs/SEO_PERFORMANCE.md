# SEO and Performance: Homeward

> Version 2.0.0 | 2026-11-01 | Owner: 3D engineer | Status: built; section 0 records measured values

## 0. Measured (29 Oct 2026; updated 1 Nov 2026)

Full record of the build session: `BUILD_LOG.md`.

| Item | Budget | Measured |
|---|---|---|
| Startup JavaScript | 250 KB gzip | 140 KB gzip on 1 Nov (122 KB on 29 Oct; diagnostics check 18). Scenes never import Cesium: one static import pulled it into startup at 1,229 KB |
| Lazy JavaScript (globe, voice, speech) | - | 2.1 MB gzip; the globe chunk is 4.17 MB raw, 1.12 MB gzip |
| Offline cache after one visit with sound on (Chrome) | 256 MB | about 161 MB |
| Offline payload in the data manifest | 256 MB | 220.9 MB (222 files) on 1 Nov, including 8.1 MB of offline Rover view stops |
| Rover view photos | - | Fetched only within 100 deg of the view; a full Navcam stop is about 80 frames of 0.2-0.6 MB from NASA, so the first view fills in over several seconds on a slow link |
| Live map tiles | - | CTX capped at level 12 (its own 5 m); deeper requests only produced missing tiles and console errors |
| Frame rate on the weakest team laptop | 30 fps | Not measured yet (the dev laptop shows about 145 frames per second in a visible pane) |

Meta tags in `app/index.html`: title, description (names NASA, ESA and USGS data), robots, Open Graph title and description, Twitter summary card, theme colour, JSON-LD WebApplication. `og.png` does not exist yet, so the `og:image` and large-card tags were removed on 29 Oct; make the image from a real screenshot (spec below) and add both tags back.

Search ranking does not matter for a hackathon link, but a clean preview card does when the link is shared, and performance on a judge's laptop matters a lot.

## 1. Meta tags (one page)

```html
<title>Homeward: plan a safe Marswalk at Gale Crater</title>
<meta name="description" content="Explore Mars from NASA, ESA and USGS data, visit every landing site, stand at any Curiosity or Perseverance stop in the rovers' own photos, and plan and walk a real Marswalk with hard safety budgets and a grounded voice assistant. NASA Space Apps 2026.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://<production-origin>/">
<meta property="og:title" content="Homeward">
<meta property="og:description" content="A Marswalk planner built from real Mars data, Space Apps 2026.">
<meta property="og:image" content="https://<production-origin>/og.png">
<meta property="og:url" content="https://<production-origin>/">
<meta name="twitter:card" content="summary_large_image">
```

`og.png`: 1200x630 screenshot from the app, no NASA logo, no AI-generated imagery.

## 2. Structured data

```json
{ "@context": "https://schema.org", "@type": "WebApplication", "name": "Homeward",
  "applicationCategory": "EducationalApplication", "operatingSystem": "Any (modern browser with WebGL)",
  "description": "Marswalk planner at Gale Crater using real Mars data", "isAccessibleForFree": true }
```

## 3. robots.txt and sitemap

```
User-agent: *
Allow: /
Sitemap: https://<production-origin>/sitemap.xml
```

The sitemap lists one URL. Deep links use the hash, so they are not separate pages.

## 4. Performance budgets

| Budget | Target | Note |
|---|---|---|
| App JS (excluding Cesium), gzip | under 250 KB | React, our code, lucide icons, zod |
| Cesium chunk | measured, not budgeted | Loaded after the shell renders; it is the product |
| CSS, gzip | under 50 KB | |
| First shell paint (mission clock visible) | under 2 s on a 20 Mbit/s link | Clock needs no tiles |
| Globe visible with Gale in view | under 5 s on a 20 Mbit/s link | ASSUMPTION target |
| Walk scene frame rate | at least 30 fps on the weakest team laptop | ASSUMPTION target from paper 12.7 |
| Planner route / walk-back field | under 300 ms / under 500 ms | In a worker |
| Data on first load | under 5 MB (grid about 2.9 MB uncompressed, compressed by the CDN) | Sol photos lazy-loaded |
| Tiles streamed while viewing | Only the levels the camera needs | Same-origin, immutable, gzip for terrain |
| Full offline cache (shell, data, all tiles, Kokoro and Whisper weights, audio) | about 300 MB, downloaded in the background after the first visit with a progress bar | Prune tile levels first if over budget; measure the real total in chunk 03 |
| Layout shift (CLS) | under 0.1 | Skeletons sized to content |
| Largest contentful paint | under 2.5 s for the shell | |
| Interaction to next paint | under 200 ms for panels | Planner work never on the main thread |

## 5. Rendering quality presets

| Preset | `globe.maximumScreenSpaceError` (our terrain; Cesium default 2) | Dingo Gap tileset `maximumScreenSpaceError` (default 16) | Shadows | Star map | Auto-select |
|---|---|---|---|---|---|
| High | 1.5 | 4 | on | 8k | default on discrete GPUs |
| Medium | 2 | 8 | off | 4k | default |
| Low | 4 | 16 | off | 2k | automatic after 10 s under 20 fps |

Values are starting points (ASSUMPTION); tune on the weakest laptop on day 1.

## 6. Lazy loading and code splitting

See `docs/FRONTEND_SPEC.md` section 14. Prefetch the Cesium chunk while scene 0 is on screen.

## 7. CDN and caching

See `docs/DATA_SPEC.md` section 6. Vercel's CDN serves hashed assets as immutable; `index.html` and `sw.js` revalidate.
