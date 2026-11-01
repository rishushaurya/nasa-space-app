// Homeward | app/src/core/places.ts | v2.0.0 | 2026-11-01
// Place search for the Explore globe: landers first, then IAU-approved names (USGS Gazetteer), or typed coordinates.
import type { LatLon } from "./frames";

export type Place = { kind: "lander" | "feature" | "coords"; id: string; name: string; p: LatLon; detail: string; sizeKm?: number };

/** "4.59 S, 137.44 E", "-4.59 137.44", "18.4N 77.5E" -> planetocentric lat, east lon in -180..180. */
export function parseLatLon(q: string): LatLon | null {
  const m = q.trim().match(/^(-?\d+(?:\.\d+)?)\s*°?\s*([NS])?[\s,;]+(-?\d+(?:\.\d+)?)\s*°?\s*([EW])?$/i);
  if (!m) return null;
  let lat = Number(m[1]), lon = Number(m[3]);
  if (m[2]?.toUpperCase() === "S") lat = -Math.abs(lat);
  if (m[4]?.toUpperCase() === "W") lon = -Math.abs(lon);
  if (lon > 180 || lon < -180) lon = ((((lon + 180) % 360) + 360) % 360) - 180;
  return Math.abs(lat) <= 90 ? { lat, lon } : null;
}

const fold = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

/** Exact, then prefix, then word prefix, then substring; bigger features first within a rank. */
export function searchPlaces(q: string, places: Place[], limit = 8): Place[] {
  const c = parseLatLon(q);
  if (c) return [{ kind: "coords", id: "coords", name: `${Math.abs(c.lat).toFixed(4)} ${c.lat < 0 ? "S" : "N"}, ${Math.abs(c.lon).toFixed(4)} ${c.lon < 0 ? "W" : "E"}`, p: c, detail: "Typed coordinates (planetocentric)" }];
  const t = fold(q.trim());
  if (t.length < 2) return [];
  const rank = (p: Place) => {
    const n = fold(p.name);
    const r = n === t ? 0 : n.startsWith(t) ? 1 : n.split(/[\s-]+/).some((w) => w.startsWith(t)) ? 2 : n.includes(t) ? 3 : 9;
    return r === 9 ? 9 : r - (p.kind === "lander" ? 0.5 : 0);
  };
  return places.map((p) => [rank(p), p] as const).filter(([r]) => r < 9)
    .sort((a, b) => a[0] - b[0] || (b[1].sizeKm ?? 1e9) - (a[1].sizeKm ?? 1e9)).slice(0, limit).map(([, p]) => p);
}
