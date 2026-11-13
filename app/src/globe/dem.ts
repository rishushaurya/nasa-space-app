// Homeward | app/src/globe/dem.ts | v3.0.0 | 2026-11-13
// Live global relief (PLAN-3 D21): MOLA-HRSC 200 m blend v2 from Esri OnMars MDEM200M, 2x1 geographic LERC tiles on
// the Mars 2000 sphere (planetocentric latitude), levels 0-7 (level 7 = 0.00275 deg, about 163 m per sample).
// Tiles are decoded in workers and kept in a small LRU cache; sampling is synchronous on cached tiles only.

export const DEM_MAX_LEVEL = 7;
const NODATA = -32768;
type Tile = { w: number; h: number; data: Int16Array };

/** Tile column/row and fractional sample position for a planetocentric point at a level (origin -180, 90). */
export function demTileAt(lat: number, lon: number, z: number) {
  const size = 180 / 2 ** z;
  const lonN = ((((lon + 180) % 360) + 360) % 360);
  const x = Math.min(Math.floor(lonN / size), 2 ** (z + 1) - 1), y = Math.min(Math.max(Math.floor((90 - lat) / size), 0), 2 ** z - 1);
  return { x, y, fx: (lonN - x * size) / size, fy: (90 - lat - y * size) / size };
}

/** Bilinear height in a tile whose w x h samples span the tile edge to edge (513 samples for 512 cells). */
export function sampleTile(t: Tile, fx: number, fy: number): number | undefined {
  const px = Math.min(Math.max(fx * (t.w - 1), 0), t.w - 1.001), py = Math.min(Math.max(fy * (t.h - 1), 0), t.h - 1.001);
  const x0 = Math.floor(px), y0 = Math.floor(py), ax = px - x0, ay = py - y0, i = y0 * t.w + x0, d = t.data;
  const a = d[i]!, b = d[i + 1]!, c = d[i + t.w]!, e = d[i + t.w + 1]!;
  if (a === NODATA || b === NODATA || c === NODATA || e === NODATA) return undefined;
  return a * (1 - ax) * (1 - ay) + b * ax * (1 - ay) + c * (1 - ax) * ay + e * ax * ay;
}

export function createDem(maxTiles = 160) {
  const workers = [0, 1].map(() => new Worker(new URL("./dem.worker.ts", import.meta.url), { type: "module" }));
  const cache = new Map<string, Tile>(); // insertion order = LRU order
  const pending = new Map<string, Promise<Tile | null>>();
  const waiting = new Map<number, (t: Tile | null) => void>();
  let seq = 0, failures = 0, pausedUntil = 0;
  for (const w of workers) w.onmessage = (e: MessageEvent<{ id: number; w?: number; h?: number; data?: Int16Array; error?: string }>) => {
    const r = e.data, done = waiting.get(r.id);
    waiting.delete(r.id);
    if (r.error || !r.data) { failures++; if (failures % 4 === 0) pausedUntil = performance.now() + 30000; done?.(null); return; }
    failures = 0;
    done?.({ w: r.w!, h: r.h!, data: r.data });
  };

  const get = (z: number, y: number, x: number) => {
    const k = `${z}/${y}/${x}`, t = cache.get(k);
    if (t) { cache.delete(k); cache.set(k, t); }
    return t;
  };
  /** Starts (or joins) a tile download; resolves null when it fails (offline, or the service is down). */
  const load = (z: number, y: number, x: number): Promise<Tile | null> => {
    const k = `${z}/${y}/${x}`, t = get(z, y, x);
    if (t) return Promise.resolve(t);
    if (performance.now() < pausedUntil) return Promise.resolve(null); // seniordev: crude back-off after repeated failures
    let p = pending.get(k);
    if (!p) {
      const id = ++seq;
      p = new Promise<Tile | null>((res) => { waiting.set(id, res); workers[id % workers.length]!.postMessage({ id, z, y, x }); }).then((tile) => {
        pending.delete(k);
        if (tile) { cache.set(k, tile); while (cache.size > maxTiles) cache.delete(cache.keys().next().value!); }
        return tile;
      });
      pending.set(k, p);
    }
    return p;
  };

  return {
    /** Height from the finest cached tile at or below level z, or undefined. */
    sample(lat: number, lon: number, z = DEM_MAX_LEVEL): number | undefined {
      for (let l = Math.min(z, DEM_MAX_LEVEL); l >= 0; l--) {
        const a = demTileAt(lat, lon, l), t = get(l, a.y, a.x);
        if (t) { const h = sampleTile(t, a.fx, a.fy); if (h !== undefined) return h; }
      }
      return undefined;
    },
    /** Loads every tile at level z covering a planetocentric box; true when all are cached. */
    async ensure(z: number, south: number, north: number, west: number, east: number): Promise<boolean> {
      const a = demTileAt(north, west, z), b = demTileAt(south, east - 1e-9, z), jobs: Promise<Tile | null>[] = [];
      for (let y = a.y; y <= b.y; y++) for (let x = a.x; x <= b.x; x++) jobs.push(load(z, y, x));
      return (await Promise.all(jobs)).every(Boolean);
    },
    has(z: number, south: number, north: number, west: number, east: number): boolean {
      const a = demTileAt(north, west, z), b = demTileAt(south, east - 1e-9, z);
      for (let y = a.y; y <= b.y; y++) for (let x = a.x; x <= b.x; x++) if (!cache.has(`${z}/${y}/${x}`)) return false;
      return true;
    },
    destroy() { workers.forEach((w) => w.terminate()); cache.clear(); },
  };
}
export type Dem = ReturnType<typeof createDem>;
