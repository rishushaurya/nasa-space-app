// Homeward | app/src/core/los.ts | v3.0.0 | 2026-11-13
// Radio line of sight over the planner's terrain grid (PLAN-3 D27). A suited explorer needs a direct radio path to the
// habitat or rover antenna; terrain and the planet's curvature can block it. Antenna heights are ASSUMPTION values.
import { cellIndex, type Grid } from "./planner";
import { haversineM, MARS_SPHERE_M, type LatLon } from "./frames";

export const EYE_M = 1.7; // suit antenna at eye height (same ASSUMPTION as the walk's eye height)
export const MAST_M = 3; // habitat or rover antenna mast (ASSUMPTION)

export type Sight = { clear: boolean; worstClearanceM: number; blockedAt: LatLon | null; distanceM: number };

/** Samples the straight radio path every half cell; the ray drops below the chord by d(D-d)/2R (curvature). */
export function lineOfSight(g: Grid, a: LatLon, b: LatLon, ha = EYE_M, hb = MAST_M, r = MARS_SPHERE_M): Sight {
  const D = haversineM(a, b, r);
  const za = g.elevM[cellIndex(g, a)], zb = g.elevM[cellIndex(g, b)];
  if (za === undefined || zb === undefined || Number.isNaN(za) || Number.isNaN(zb)) return { clear: false, worstClearanceM: NaN, blockedAt: null, distanceM: D };
  const n = Math.max(2, Math.ceil(D / (g.cellM / 2)));
  let worst = Infinity, at: LatLon | null = null;
  for (let k = 1; k < n; k++) {
    const f = k / n, d = f * D, p = { lat: a.lat + (b.lat - a.lat) * f, lon: a.lon + (b.lon - a.lon) * f };
    const z = g.elevM[cellIndex(g, p)];
    if (z === undefined || Number.isNaN(z)) continue;
    const clearance = za + ha + (zb + hb - za - ha) * f - (d * (D - d)) / (2 * r) - z;
    if (clearance < worst) { worst = clearance; at = p; }
  }
  return { clear: worst > 0, worstClearanceM: worst === Infinity ? Math.min(za + ha, zb + hb) - Math.max(za, zb) : worst, blockedAt: worst > 0 ? null : at, distanceM: D };
}
