// Homeward | app/src/core/planner.ts | v1.0.0 | 2026-10-29
// Marswalk planner on a terrain grid: walk-back field (Dijkstra), routes (A*), hard budgets.
import { gcrDoseMSv } from "./dose";
import { haversineM, type LatLon } from "./frames";

export type Grid = {
  cols: number; rows: number; cellM: number;
  westLonE: number; northLatC: number; dLonDeg: number; dLatDeg: number; // cell size in degrees
  slopeDeg: Float32Array; reliefM: Float32Array; elevM: Float32Array; // NaN = no data
};

export type Settings = {
  slopeMaxDeg: number; reliefMaxM: number; reserveMin: number; daylightMarginMin: number;
  speedFactor: number; radiusM: number; lifeSupportH: number;
};

// EVA-01 8 h, EVA-02 2 km, EVA-03 20 deg are NASA standards; the rest are ASSUMPTION values (sliders in the app).
export const DEFAULTS: Settings = { slopeMaxDeg: 20, reliefMaxM: 1.0, reserveMin: 30, daylightMarginMin: 30, speedFactor: 1, radiusM: 2000, lifeSupportH: 8 };

/** Tobler's hiking function scaled so flat ground gives the Apollo walk-back rate, 3.3 km/h (EVA-04). */
export const walkSpeedKmh = (rise: number, run: number, factor = 1) =>
  (factor * 3.3 * Math.exp(-3.5 * Math.abs(rise / run + 0.05))) / Math.exp(-0.175);
const vMax = (factor: number) => walkSpeedKmh(-0.05, 1, factor);

export const cellIndex = (g: Grid, p: LatLon) => {
  const c = Math.floor((p.lon - g.westLonE) / g.dLonDeg), r = Math.floor((g.northLatC - p.lat) / g.dLatDeg);
  return c < 0 || r < 0 || c >= g.cols || r >= g.rows ? -1 : r * g.cols + c;
};
export const cellCenter = (g: Grid, i: number): LatLon => ({
  lon: g.westLonE + ((i % g.cols) + 0.5) * g.dLonDeg,
  lat: g.northLatC - (Math.floor(i / g.cols) + 0.5) * g.dLatDeg,
});

export function passable(g: Grid, i: number, s: Settings): boolean {
  const sl = g.slopeDeg[i]!, rl = g.reliefM[i]!;
  return !Number.isNaN(sl) && !Number.isNaN(g.elevM[i]!) && sl <= s.slopeMaxDeg && rl <= s.reliefMaxM;
}

// seniordev: cell size treated as equal east-west and north-south; the 0.3% stretch of the equirectangular DTM at 4.6 S is ignored.
function stepMinutes(g: Grid, a: number, b: number, diag: boolean, factor: number): number {
  const d = g.cellM * (diag ? Math.SQRT2 : 1);
  return (d / 1000 / walkSpeedKmh(g.elevM[b]! - g.elevM[a]!, d, factor)) * 60;
}

// Binary min-heap on typed arrays (lazy deletion: stale entries are skipped by the caller).
class Heap {
  ids = new Int32Array(1 << 16); pri = new Float64Array(1 << 16); size = 0;
  push(id: number, p: number) {
    if (this.size === this.ids.length) {
      const ni = new Int32Array(this.size * 2); ni.set(this.ids); this.ids = ni;
      const np = new Float64Array(this.size * 2); np.set(this.pri); this.pri = np;
    }
    const ids = this.ids, pri = this.pri; let i = this.size++;
    while (i > 0) { const j = (i - 1) >> 1; if (pri[j]! <= p) break; ids[i] = ids[j]!; pri[i] = pri[j]!; i = j; }
    ids[i] = id; pri[i] = p;
  }
  pop(): number {
    const ids = this.ids, pri = this.pri, top = ids[0]!, n = --this.size, id = ids[n]!, p = pri[n]!;
    let i = 0;
    for (;;) {
      let c = 2 * i + 1; if (c >= n) break;
      if (c + 1 < n && pri[c + 1]! < pri[c]!) c++;
      if (pri[c]! >= p) break;
      ids[i] = ids[c]!; pri[i] = pri[c]!; i = c;
    }
    ids[i] = id; pri[i] = p;
    return top;
  }
  get topPri() { return this.pri[0]!; }
}

const passMask = (g: Grid, s: Settings) => {
  const m = new Uint8Array(g.cols * g.rows);
  for (let i = 0; i < m.length; i++) m[i] = passable(g, i, s) ? 1 : 0;
  return m;
};
const DX = [-1, 0, 1, -1, 1, -1, 0, 1], DY = [-1, -1, -1, 0, 0, 1, 1, 1];

/** Minutes to walk from every cell to `home` (Infinity if unreachable). */
export function timeHomeField(g: Grid, home: number, s: Settings): Float32Array {
  const n = g.cols * g.rows, cols = g.cols, rows = g.rows, t = new Float64Array(n).fill(Infinity), ok = passMask(g, s), el = g.elevM;
  const heap = new Heap(), k = (s.speedFactor * 3.3) / Math.exp(-0.175) / 60, d0 = g.cellM / 1000, d1 = d0 * Math.SQRT2;
  t[home] = 0; heap.push(home, 0);
  while (heap.size) {
    const pu = heap.topPri, u = heap.pop();
    if (pu > t[u]!) continue;
    const x = u % cols, y = (u / cols) | 0, eu = el[u]!;
    for (let q = 0; q < 8; q++) {
      const nx = x + DX[q]!, ny = y + DY[q]!;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const v = ny * cols + nx;
      if (!ok[v]) continue;
      const dkm = DX[q] && DY[q] ? d1 : d0;
      const sl = (eu - el[v]!) / (dkm * 1000); // walking v -> u
      const nt = pu + dkm / (k * Math.exp(-3.5 * Math.abs(sl + 0.05)));
      if (nt < t[v]!) { t[v] = nt; heap.push(v, nt); }
    }
  }
  return Float32Array.from(t);
}

/** Fastest path of cells from `a` to `b`, or null. Start and goal are always allowed. */
export function route(g: Grid, a: number, b: number, s: Settings): number[] | null {
  const n = g.cols * g.rows, cols = g.cols, rows = g.rows, gScore = new Float64Array(n).fill(Infinity), from = new Int32Array(n).fill(-1), el = g.elevM;
  const ok = passMask(g, s); ok[b] = 1;
  const bx = b % cols, by = (b / cols) | 0, k = (s.speedFactor * 3.3) / Math.exp(-0.175) / 60, hk = g.cellM / 1000 / (vMax(s.speedFactor) / 60);
  const d0 = g.cellM / 1000, d1 = d0 * Math.SQRT2;
  const heap = new Heap(), closed = new Uint8Array(n);
  gScore[a] = 0; heap.push(a, Math.hypot((a % cols) - bx, ((a / cols) | 0) - by) * hk);
  while (heap.size) {
    const u = heap.pop();
    if (u === b) break;
    if (closed[u]) continue;
    closed[u] = 1;
    const x = u % cols, y = (u / cols) | 0, eu = el[u]!, gu = gScore[u]!;
    for (let q = 0; q < 8; q++) {
      const nx = x + DX[q]!, ny = y + DY[q]!;
      if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
      const w = ny * cols + nx;
      if (!ok[w] || closed[w]) continue;
      const dkm = DX[q] && DY[q] ? d1 : d0;
      const ng = gu + dkm / (k * Math.exp(-3.5 * Math.abs((el[w]! - eu) / (dkm * 1000) + 0.05)));
      if (ng < gScore[w]!) { gScore[w] = ng; from[w] = u; heap.push(w, ng + Math.hypot(nx - bx, ny - by) * hk); }
    }
  }
  if (gScore[b] === Infinity) return null;
  const path = [b];
  while (path[path.length - 1] !== a) path.push(from[path[path.length - 1]!]!);
  return path.reverse();
}

export type Stop = { id: string; name: string; cell: number; minutes: number };
export type BreachCode = "LIFE_SUPPORT" | "WALK_BACK" | "DAYLIGHT" | "RADIUS" | "UNREACHABLE" | "OUTSIDE_GRID";
export type Breach = { code: BreachCode; message: string; stopId?: string; atMin?: number; factIds: string[] };
export type TimelinePoint = { cell: number; tMin: number; stopId?: string };
export type PlanInput = { home: number; stops: Stop[]; startUtcMs: number; sunsetUtcMs: number; settings: Settings };
export type PlanResult = {
  ok: boolean; breaches: Breach[]; path: number[]; timeline: TimelinePoint[];
  totals: { walkM: number; walkMin: number; stopMin: number; totalMin: number };
  budgets: {
    lifeSupport: { usedMin: number; limitMin: number; marginMin: number };
    walkBack: { minMarginMin: number; atMin: number };
    daylight: { returnUtcMs: number; limitUtcMs: number; marginMin: number };
    dose: { mSv: number };
  };
};

const fmt = (min: number) => `${Math.floor(min / 60)} h ${Math.round(min % 60)} min`;

export function plan(g: Grid, field: Float32Array, input: PlanInput): PlanResult {
  const { home, stops, settings: s } = input;
  const breaches: Breach[] = [];
  const homeP = cellCenter(g, home);
  for (const st of stops) {
    if (st.cell < 0) breaches.push({ code: "OUTSIDE_GRID", stopId: st.id, message: `${st.name} is outside the mapped walk zone`, factIds: [] });
    else if (haversineM(homeP, cellCenter(g, st.cell)) > s.radiusM)
      breaches.push({ code: "RADIUS", stopId: st.id, message: `${st.name} is beyond the ${(s.radiusM / 1000).toFixed(1)} km walking radius`, factIds: ["EVA-02"] });
  }
  const path: number[] = [], timeline: TimelinePoint[] = [{ cell: home, tMin: 0 }];
  let t = 0, walkM = 0, stopMin = 0;
  if (!breaches.length) {
    const seq = [home, ...stops.map((x) => x.cell), home];
    for (let k = 0; k < seq.length - 1; k++) {
      const leg = route(g, seq[k]!, seq[k + 1]!, s);
      if (!leg) {
        const st = stops[Math.min(k, stops.length - 1)];
        breaches.push({ code: "UNREACHABLE", stopId: st?.id, message: `No safe path to ${k < stops.length ? st?.name : "home"} within the slope and obstacle limits`, factIds: ["EVA-03"] });
        break;
      }
      for (let i = 1; i < leg.length; i++) {
        const a = leg[i - 1]!, b = leg[i]!, diag = a % g.cols !== b % g.cols && ((a / g.cols) | 0) !== ((b / g.cols) | 0);
        t += stepMinutes(g, a, b, diag, s.speedFactor);
        walkM += g.cellM * (diag ? Math.SQRT2 : 1);
        path.push(b); timeline.push({ cell: b, tMin: t });
      }
      const st = stops[k];
      if (k < stops.length && st) { t += st.minutes; stopMin += st.minutes; timeline.push({ cell: st.cell, tMin: t, stopId: st.id }); }
    }
  }
  const limitMin = s.lifeSupportH * 60 - s.reserveMin;
  let minMargin = Infinity, atMin = 0;
  for (const p of timeline) {
    const m = limitMin - p.tMin - field[p.cell]!;
    if (m < minMargin) { minMargin = m; atMin = p.tMin; }
  }
  if (!Number.isFinite(minMargin)) minMargin = timeline.length > 1 ? -Infinity : limitMin;
  const returnUtcMs = input.startUtcMs + t * 60000, limitUtcMs = input.sunsetUtcMs - s.daylightMarginMin * 60000;
  if (!breaches.some((b) => b.code === "UNREACHABLE" || b.code === "RADIUS" || b.code === "OUTSIDE_GRID")) {
    if (t > limitMin) breaches.push({ code: "LIFE_SUPPORT", message: `Plan needs ${fmt(t)}; limit is ${fmt(limitMin)} after the ${s.reserveMin} min reserve`, factIds: ["EVA-01"] });
    else if (minMargin < 0) breaches.push({ code: "WALK_BACK", atMin, message: `At ${fmt(atMin)} the walk home would exceed the life support left`, factIds: ["EVA-01", "EVA-04"] });
    if (returnUtcMs > limitUtcMs) breaches.push({ code: "DAYLIGHT", message: `Return ${Math.round((returnUtcMs - limitUtcMs) / 60000)} min after the daylight limit (sunset minus ${s.daylightMarginMin} min)`, factIds: ["TIME-03"] });
  }
  return {
    ok: breaches.length === 0, breaches, path, timeline,
    totals: { walkM, walkMin: t - stopMin, stopMin, totalMin: t },
    budgets: {
      lifeSupport: { usedMin: t, limitMin, marginMin: limitMin - t },
      walkBack: { minMarginMin: minMargin, atMin },
      daylight: { returnUtcMs, limitUtcMs, marginMin: (limitUtcMs - returnUtcMs) / 60000 },
      dose: { mSv: gcrDoseMSv(t / 60) },
    },
  };
}
