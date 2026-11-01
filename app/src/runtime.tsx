// Homeward | app/src/runtime.tsx | v1.0.0 | 2026-10-29
// Runtime objects shared by scenes: loaded data, the globe, the current plan, the walker and active events.
import { createContext, useContext } from "react";
import type { Data } from "./data/load";
import type { MarsGlobe } from "./globe/globe";
import type { PlanState } from "./core/use-planner";
import type { LatLon } from "./core/frames";
import type { PanelState } from "./ui/ui";

export type EventKind = "dust-devil" | "solar-storm" | null;
export type Runtime = {
  data: Data; globe: MarsGlobe | null;
  plan: PanelState<PlanState> & { retry: () => void };
  position: LatLon; setPosition: (p: LatLon) => void;
  elapsedMin: number; setElapsedMin: (m: number) => void;
  event: EventKind; setEvent: (e: EventKind) => void;
};
export const RuntimeCtx = createContext<Runtime | null>(null);
export function useRuntime(): Runtime {
  const r = useContext(RuntimeCtx);
  if (!r) throw new Error("useRuntime outside provider");
  return r;
}
export const planOk = (p: Runtime["plan"]): PlanState | null => (p.kind === "ok" ? p.data : null);
