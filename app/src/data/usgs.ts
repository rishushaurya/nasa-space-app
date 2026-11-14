// Homeward | app/src/data/usgs.ts | v4.0.0 | 2026-11-14
// USGS geology at a place (PLAN-4 D29, D30): the SIM 3292 rock unit under it, live from Mars Trek's identify service,
// and every published USGS geologic map of Mars that covers it, from the pipeline's snapshot of the Planetary
// Geologic Mapping Program's map database (pipeline/usgs_maps.py).
import { z } from "zod";
import type { LatLon } from "../core/frames";

export type RockUnit = { unit: string; description: string };
const Identify = z.object({ results: z.array(z.object({ attributes: z.object({ Unit: z.string(), UnitDesc: z.string() }) })) });

/** The first unit in an identify response, or null; exported for the test. */
export function parseUnit(json: unknown): RockUnit | null {
  const r = Identify.safeParse(json);
  const a = r.success ? r.data.results[0]?.attributes : undefined;
  return a && a.Unit.trim() ? { unit: a.Unit.trim(), description: a.UnitDesc.trim() } : null;
}

const IDENTIFY = "https://trek.nasa.gov/mars/trekarcgis/rest/services/SIM3292_Global_Geology/MapServer/identify";
export async function rockUnit(p: LatLon, signal?: AbortSignal): Promise<RockUnit | null> {
  const q = new URLSearchParams({ f: "json", geometry: `${p.lon},${p.lat}`, geometryType: "esriGeometryPoint", sr: "4326", layers: "all", tolerance: "1",
    mapExtent: `${p.lon - 1},${p.lat - 1},${p.lon + 1},${p.lat + 1}`, imageDisplay: "600,600,96", returnGeometry: "false" });
  const r = await fetch(`${IDENTIFY}?${q}`, { signal, credentials: "omit" });
  if (!r.ok) throw new Error(`Mars Trek geology HTTP ${r.status}`);
  return parseUnit(await r.json());
}

export type GeoMap = { title: string; number: string; scale: number; year: string; url: string; rings: number[][][] };
const MapsFile = z.object({ sourceId: z.string(), maps: z.array(z.object({ title: z.string(), number: z.string(), scale: z.number().positive(), year: z.string(),
  url: z.string(), rings: z.array(z.array(z.array(z.number()).length(2))) })) });

let maps: Promise<GeoMap[]> | null = null;
export const loadMaps = () => (maps ??= fetch("/data/usgs/mars-maps.json").then((r) => r.json()).then((j) => MapsFile.parse(j).maps)
  .catch((e) => { maps = null; throw e; }));

/** Even-odd test over every ring, so holes and multi-part footprints both work. */
function inside(p: LatLon, rings: number[][][]): boolean {
  let hit = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]!, [xj, yj] = ring[j]!;
      if (yi! > p.lat !== yj! > p.lat && p.lon < ((xj! - xi!) * (p.lat - yi!)) / (yj! - yi!) + xi!) hit = !hit;
    }
  }
  return hit;
}

/** The published maps whose footprint contains the point, finest scale first (the file is already sorted). */
export const mapsAt = (all: GeoMap[], p: LatLon) => all.filter((m) => inside(p, m.rings));

/** "1:75,000" from 75000. */
export const fmtScale = (s: number) => `1:${s.toLocaleString("en-US")}`;
