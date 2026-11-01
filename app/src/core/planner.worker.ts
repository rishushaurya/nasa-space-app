// Homeward | app/src/core/planner.worker.ts | v1.0.0 | 2026-10-29
// Runs the planner off the main thread; the walk-back field is cached until home or terrain settings change.
import { plan, timeHomeField, type Grid, type PlanInput } from "./planner";

let grid: Grid | null = null;
let field: Float32Array | null = null;
let fieldKey = "";

self.onmessage = (e: MessageEvent) => {
  const m = e.data as { type: "init"; grid: Grid } | { type: "plan"; id: number; input: PlanInput };
  if (m?.type === "init" && m.grid?.cols > 0) { grid = m.grid; field = null; fieldKey = ""; return; }
  if (m?.type !== "plan" || !grid || typeof m.input?.home !== "number") return;
  const s = m.input.settings;
  const key = `${m.input.home}|${s.slopeMaxDeg}|${s.reliefMaxM}|${s.speedFactor}`;
  const t0 = performance.now();
  let newField = false;
  if (key !== fieldKey || !field) { field = timeHomeField(grid, m.input.home, s); fieldKey = key; newField = true; }
  const t1 = performance.now();
  const result = plan(grid, field, m.input);
  const t2 = performance.now();
  self.postMessage({ type: "result", id: m.id, result, field: newField ? field.slice() : null, timings: { fieldMs: t1 - t0, routeMs: t2 - t1 } });
};
