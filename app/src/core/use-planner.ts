// Homeward | app/src/core/use-planner.ts | v1.0.0 | 2026-10-29
import { useEffect, useRef, useState } from "react";
import { loadGrid, incidentId, type GridHeader } from "../data/load";
import { ZONES, type ZoneId } from "../sites";
import { nextLtst, nextSunEvent } from "./mars-time";
import { cellCenter, cellIndex, passable, type Grid, type PlanResult, type Settings } from "./planner";
import { haversineM, type LatLon } from "./frames";
import type { PanelState } from "../ui/ui";

export type PlanState = { grid: Grid; header: GridHeader; result: PlanResult; field: Float32Array; startUtcMs: number; sunsetUtcMs: number; stopCell: number; homeCell: number; timings: { fieldMs: number; routeMs: number }; snappedM: number };

/** Nearest passable cell within maxM of p (the crew stands next to a steep outcrop, not on it). */
export function snap(g: Grid, p: LatLon, s: Settings, maxM: number): { cell: number; m: number } {
  const c0 = cellIndex(g, p);
  if (c0 < 0) return { cell: -1, m: 0 };
  if (passable(g, c0, s)) return { cell: c0, m: 0 };
  const r = Math.ceil(maxM / g.cellM), cx = c0 % g.cols, cy = Math.floor(c0 / g.cols);
  let best = { cell: c0, m: Infinity };
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const x = cx + dx, y = cy + dy;
    if (x < 0 || y < 0 || x >= g.cols || y >= g.rows) continue;
    const i = y * g.cols + x, m = Math.hypot(dx, dy) * g.cellM;
    if (m <= maxM && m < best.m && passable(g, i, s)) best = { cell: i, m };
  }
  return Number.isFinite(best.m) ? best : { cell: c0, m: 0 };
}

export function usePlanner(zone: ZoneId, stopMin: number, startLtst: number, settings: Settings): PanelState<PlanState> & { retry: () => void } {
  const [st, setSt] = useState<PanelState<PlanState>>({ kind: "loading" });
  const [nonce, setNonce] = useState(0);
  const worker = useRef<Worker | null>(null);
  const gridRef = useRef<{ grid: Grid; header: GridHeader } | null>(null);
  const fieldRef = useRef<Float32Array | null>(null);
  const reqId = useRef(0);
  const [ready, setReady] = useState(0);

  useEffect(() => {
    let alive = true;
    setSt({ kind: "loading" });
    gridRef.current = null; fieldRef.current = null;
    const w = new Worker(new URL("./planner.worker.ts", import.meta.url), { type: "module" });
    worker.current = w;
    w.onerror = () => alive && setSt({ kind: "error", message: "The planner stopped. Your plan is safe.", incident: incidentId(), retry: () => setNonce((n) => n + 1) });
    loadGrid(zone).then((g) => {
      if (!alive) return;
      gridRef.current = g;
      w.postMessage({ type: "init", grid: g.grid });
      setReady((r) => r + 1);
    }).catch((e) => alive && setSt({ kind: "error", message: `Terrain grid failed its checks: ${e.message}`, incident: incidentId(), retry: () => setNonce((n) => n + 1) }));
    return () => { alive = false; w.terminate(); };
  }, [zone, nonce]);

  useEffect(() => {
    const g = gridRef.current, w = worker.current;
    if (!g || !w) return;
    const z = ZONES[zone];
    const startUtcMs = nextLtst(Date.now(), z.home.lon, startLtst);
    const noon = startUtcMs + (12 - startLtst) * 1.027491 * 3600000;
    const sunsetUtcMs = nextSunEvent(noon, z.home.lat, z.home.lon, "set");
    const home = snap(g.grid, z.home, settings, 15), stop = snap(g.grid, z.stop, settings, 15);
    const id = ++reqId.current;
    const timer = setTimeout(() => {
      w.onmessage = (e: MessageEvent) => {
        const m = e.data;
        if (m.type !== "result" || m.id !== reqId.current) return;
        if (m.field) fieldRef.current = m.field;
        setSt({ kind: "ok", data: { grid: g.grid, header: g.header, result: m.result, field: fieldRef.current!, startUtcMs, sunsetUtcMs, stopCell: stop.cell, homeCell: home.cell, timings: m.timings,
          snappedM: stop.cell >= 0 ? haversineM(z.stop, cellCenter(g.grid, stop.cell)) : 0 } });
      };
      w.postMessage({ type: "plan", id, input: { home: home.cell, stops: [{ id: "stop", name: z.stopName, cell: stop.cell, minutes: stopMin }], startUtcMs, sunsetUtcMs, settings } });
    }, 150);
    return () => clearTimeout(timer);
  }, [zone, stopMin, startLtst, settings, ready]);

  return Object.assign(st, { retry: () => setNonce((n) => n + 1) });
}

/** Walk-back heat map as a canvas: 4 bands of minutes-to-home, hatched where the margin would be negative. */
export function heatCanvas(g: Grid, field: Float32Array, limitMin: number, colors: string[], hatch: string): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = g.cols; c.height = g.rows;
  const ctx = c.getContext("2d")!;
  const img = ctx.createImageData(g.cols, g.rows);
  const rgb = colors.map((s) => { ctx.fillStyle = s; const v = ctx.fillStyle as string; return [parseInt(v.slice(1, 3), 16), parseInt(v.slice(3, 5), 16), parseInt(v.slice(5, 7), 16)]; });
  ctx.fillStyle = hatch;
  const hv = ctx.fillStyle as string, hr = [parseInt(hv.slice(1, 3), 16), parseInt(hv.slice(3, 5), 16), parseInt(hv.slice(5, 7), 16)];
  for (let i = 0; i < field.length; i++) {
    const t = field[i]!;
    const x = i % g.cols, y = Math.floor(i / g.cols);
    let col: number[] | undefined, a = 150;
    if (!Number.isFinite(t)) { if ((x + y) % 6 < 2) { col = hr; a = 170; } }
    else if (t > limitMin) { col = (x + y) % 6 < 3 ? hr : undefined; a = 190; }
    else col = rgb[Math.min(3, Math.floor(t / 5))];
    if (!col) continue;
    img.data.set([col[0]!, col[1]!, col[2]!, a], i * 4);
  }
  ctx.putImageData(img, 0, 0);
  return c;
}
