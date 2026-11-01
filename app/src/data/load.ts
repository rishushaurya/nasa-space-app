// Homeward | app/src/data/load.ts | v1.0.0 | 2026-10-29
// Fetches and validates every data file; a file that fails validation is an error, never partial data.
import { z } from "zod";
import type { Grid } from "../core/planner";
import type { Place } from "../core/places";

const Badge = z.enum(["LIVE", "MEASURED", "MODELLED", "COMPUTED", "STANDARD", "ASSUMPTION", "GENERATED"]);
export type Badge = z.infer<typeof Badge>;
const Fact = z.object({ id: z.string(), label: z.string(), value: z.union([z.number(), z.string()]), unit: z.string().nullable(), badge: Badge, sourceIds: z.array(z.string()).min(1), note: z.string().nullable() });
export type Fact = z.infer<typeof Fact>;
const Source = z.object({ id: z.string(), agency: z.string(), title: z.string(), publisher: z.string(), url: z.string().startsWith("https://"), licence: z.string(), credit: z.string(), accessed: z.string(), status: z.string() });
export type Source = z.infer<typeof Source>;
const Card = z.object({ id: z.string(), title: z.string(), text: z.string(), sourceIds: z.array(z.string()), keywords: z.array(z.string()) });
export type Card = z.infer<typeof Card>;
const Image = z.object({ id: z.string(), camera: z.string().nullable().optional(), file: z.string(), credit: z.string(), source: z.string() });
const Sol = z.object({ mission: z.literal("MSL"), sol: z.number(), story: z.string(), position: z.object({ lat: z.number(), lon: z.number(), elev: z.number(), yaw: z.number(), waypointSol: z.number(), sourceId: z.string() }), images: z.array(Image) });
export type Sol = z.infer<typeof Sol>;
const Waypoint = z.object({ sol: z.number(), site: z.number(), drive: z.number(), lon: z.number(), lat: z.number(), elev_geoid: z.number(), yaw: z.number(), dist_total_m: z.number() });
export type Waypoint = z.infer<typeof Waypoint>;
const Traverse = z.object({ source: z.string(), count_all: z.number(), latest_sol: z.number(), points: z.array(Waypoint) });
const TerrainLayer = z.object({ name: z.string(), file: z.string(), cols: z.number(), rows: z.number(), west: z.number(), east: z.number(), south: z.number(), north: z.number(), scale: z.number(), offset: z.number(), sourceIds: z.array(z.string()), note: z.string() });
export type TerrainLayer = z.infer<typeof TerrainLayer>;
const ImageryLayer = z.object({ name: z.string(), file: z.string(), width: z.number(), height: z.number(), west: z.number(), east: z.number(), south: z.number(), north: z.number(), sourceIds: z.array(z.string()), note: z.string() });
export type ImageryLayer = z.infer<typeof ImageryLayer>;
const Layers = z.object({ terrain: z.array(TerrainLayer), imagery: z.array(ImageryLayer), heights: z.string() });
export type Layers = z.infer<typeof Layers>;
const GridHeader = z.object({ zone: z.string(), dtmId: z.string(), cols: z.number(), rows: z.number(), cellM: z.number(), westLonE: z.number(), northLatC: z.number(), dLonDeg: z.number(), dLatDeg: z.number(), layers: z.array(z.string()), processing: z.array(z.string()) });
export type GridHeader = z.infer<typeof GridHeader>;

export class DataError extends Error {
  constructor(public file: string, public detail: string) { super(`${file}: ${detail}`); }
}

async function getJson<T>(file: string, schema: z.ZodType<T>): Promise<T> {
  const r = await fetch(file);
  if (!r.ok) throw new DataError(file, `HTTP ${r.status}`);
  const parsed = schema.safeParse(await r.json());
  if (!parsed.success) throw new DataError(file, parsed.error.issues.slice(0, 3).map((i) => `${i.path.join(".")} ${i.message}`).join("; "));
  return parsed.data;
}

const MoonTable = z.object({ startUtc: z.string(), stepS: z.number().positive(), phobos: z.array(z.array(z.number()).length(6)), deimos: z.array(z.array(z.number()).length(6)) });
const Lander = z.object({ id: z.string(), name: z.string(), agency: z.string(), kind: z.string(), landedUtc: z.string(), lat: z.number().min(-90).max(90), lon: z.number().min(-180).max(180),
  badge: Badge, sourceIds: z.array(z.string()).min(1), rover: z.enum(["msl", "m20"]).nullable(), note: z.string() });
export type Lander = z.infer<typeof Lander>;
const Gazetteer = z.object({ sourceId: z.string(), rows: z.array(z.tuple([z.string(), z.number(), z.number(), z.number(), z.string(), z.number()])) });

export type Data = {
  facts: Map<string, Fact>; sources: Map<string, Source>; corpus: Card[]; traverse: z.infer<typeof Traverse>; layers: Layers;
  sols: Map<number, Sol>; moons: z.infer<typeof MoonTable>; landers: Lander[]; places: Place[];
};

export async function loadData(): Promise<Data> {
  const [facts, sources, corpus, traverse, layers, s182, s528, s4709, moons, landers, gaz] = await Promise.all([
    getJson("/data/facts.json", z.array(Fact)), getJson("/data/sources.json", z.array(Source)), getJson("/data/corpus.json", z.array(Card)),
    getJson("/data/traverse/msl.json", Traverse), getJson("/data/globe/layers.json", Layers),
    getJson("/data/sols/msl-0182.json", Sol), getJson("/data/sols/msl-0528.json", Sol), getJson("/data/sols/msl-4709.json", Sol),
    getJson("/data/sky/moons.json", MoonTable), getJson("/data/places/landers.json", z.array(Lander)), getJson("/data/places/gazetteer.json", Gazetteer),
  ]);
  const places: Place[] = [
    ...landers.map((l): Place => ({ kind: "lander", id: l.id, name: l.name, p: { lat: l.lat, lon: l.lon }, detail: `${l.agency} ${l.kind}, landed ${l.landedUtc}` })),
    ...gaz.rows.map(([name, lat, lon, km, type, fid]): Place => ({ kind: "feature", id: `gz-${fid}`, name, p: { lat, lon }, detail: `${type}${km ? `, ${km.toLocaleString("en-US")} km across` : ""}`, sizeKm: km })),
  ];
  return {
    facts: new Map(facts.map((f) => [f.id, f])), sources: new Map(sources.map((s) => [s.id, s])), corpus, traverse, layers,
    sols: new Map([s182, s528, s4709].map((s) => [s.sol, s])), moons, landers, places,
  };
}

export async function loadGrid(zone: "gale" | "boxwork"): Promise<{ header: GridHeader; grid: Grid }> {
  const header = await getJson(`/data/site/${zone}/grid.json`, GridHeader);
  const r = await fetch(`/data/site/${zone}/grid.bin`);
  if (!r.ok) throw new DataError(`grid ${zone}`, `HTTP ${r.status}`);
  const all = new Float32Array(await r.arrayBuffer());
  const n = header.cols * header.rows;
  if (all.length !== 3 * n) throw new DataError(`grid ${zone}`, "size mismatch");
  return { header, grid: { cols: header.cols, rows: header.rows, cellM: header.cellM, westLonE: header.westLonE, northLatC: header.northLatC,
    dLonDeg: header.dLonDeg, dLatDeg: header.dLatDeg, slopeDeg: all.subarray(0, n), reliefM: all.subarray(n, 2 * n), elevM: all.subarray(2 * n) } };
}

export const incidentId = () => Math.random().toString(16).slice(2, 10);
