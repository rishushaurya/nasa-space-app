// Homeward | app/src/core/planner-real.test.ts | v1.0.0 | 2026-10-29
// Validation on the real HiRISE grid (PRD success metric) and the planner time budget.
import { it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { DEFAULTS, timeHomeField, route, cellIndex, type Grid } from "./planner";
it("Curiosity's real path to Yellowknife Bay is at least 95% walkable; planner under the time budget", () => {
  const h = JSON.parse(readFileSync("app/public/data/site/gale/grid.json", "utf8"));
  const a = new Float32Array(readFileSync("app/public/data/site/gale/grid.bin").buffer.slice(0));
  const n = h.cols * h.rows;
  const g: Grid = { ...h, slopeDeg: a.subarray(0, n), reliefM: a.subarray(n, 2 * n), elevM: a.subarray(2 * n) };
  const home = cellIndex(g, { lat: -4.589467, lon: 137.441633 }), stop = cellIndex(g, { lat: -4.58948488, lon: 137.4491296 });
  let t0 = performance.now(); const f = timeHomeField(g, home, DEFAULTS); const t1 = performance.now(); const r = route(g, home, stop, DEFAULTS); const t2 = performance.now();
  // Curiosity's real path (sols 3-166) must be walkable under our rules.
  const tr = JSON.parse(readFileSync("app/public/data/traverse/msl.json", "utf8")).points.filter((p: { sol: number }) => p.sol <= 166);
  let tot = 0, okc = 0;
  for (let i = 1; i < tr.length; i++) for (let k = 0; k <= 20; k++) {
    const lat = tr[i - 1].lat + (tr[i].lat - tr[i - 1].lat) * k / 20, lon = tr[i - 1].lon + (tr[i].lon - tr[i - 1].lon) * k / 20;
    const c = cellIndex(g, { lat, lon }); if (c < 0) continue; tot++;
    if (g.slopeDeg[c]! <= 20 && g.reliefM[c]! <= 1) okc++;
  }
  expect(t1 - t0).toBeLessThan(500); expect(t2 - t1).toBeLessThan(300);
  console.log(JSON.stringify({ fieldMs: Math.round(t1 - t0), routeMs: Math.round(t2 - t1), pathCells: r?.length, homeToStopMin: f[stop], passablePct: Math.round(100 * okc / tot), samples: tot }));
  expect(okc / tot).toBeGreaterThan(0.95);
});
