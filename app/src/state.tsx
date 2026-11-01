// Homeward | app/src/state.tsx | v1.0.0 | 2026-10-29
// App state lives in the URL hash (shareable, reproducible) and is mirrored to localStorage on every change.
import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import { z } from "zod";
import { DEFAULTS, type Settings } from "./core/planner";

export const SCENES = ["clock", "explore", "orbit", "descent", "briefing", "plan", "walk", "relive", "credits"] as const;
export const IMAGERY = ["ctx", "viking", "themis-day", "themis-night", "offline"] as const;
export type Scene = (typeof SCENES)[number];

const StateSchema = z.object({
  scene: z.enum(SCENES),
  zone: z.enum(["gale", "boxwork"]),
  stopMin: z.number().min(0).max(480),
  startLtst: z.number().min(5).max(18),
  compression: z.number().min(1).max(600),
  sol: z.number().int().min(0).max(6000),
  heat: z.boolean(),
  voice: z.boolean(),
  online: z.boolean(), // false: the assistant never leaves the device (offline rules only)
  lang: z.enum(["en", "hi", "kn"]),
  settings: z.object({
    slopeMaxDeg: z.number().min(10).max(30), reliefMaxM: z.number().min(0.5).max(2), reserveMin: z.number().min(0).max(120),
    daylightMarginMin: z.number().min(0).max(120), speedFactor: z.number().min(0.5).max(1.5), radiusM: z.number().min(500).max(10000),
    lifeSupportH: z.number().min(4).max(8),
  }),
  samples: z.array(z.object({ t: z.number(), lat: z.number(), lon: z.number(), note: z.string().max(200) })).max(50),
  imagery: z.enum(IMAGERY), hirise: z.boolean(), labels: z.boolean(), tracks: z.boolean(),
  // Rover view: a stop is named by its rover motion counter (site, drive), which never changes as NASA adds stops.
  rover: z.object({ m: z.enum(["msl", "m20"]), site: z.number().int().min(0), drive: z.number().int().min(0) }),
  place: z.string().max(40).nullable(), // selected lander or feature in Explore
});
export type AppState = z.infer<typeof StateSchema>;

const INITIAL: AppState = {
  scene: "clock", zone: "gale", stopMin: 60, startLtst: 10, compression: 60, sol: 182, heat: true, voice: true, online: true, lang: "en",
  settings: DEFAULTS, samples: [], imagery: "ctx", hirise: false, labels: true, tracks: true, rover: { m: "msl", site: 6, drive: 0 }, place: null,
};
export const KEY = "homeward:plan:v1";

type Action = { type: "set"; patch: Partial<AppState> } | { type: "settings"; patch: Partial<Settings> } | { type: "reset" };
function reducer(s: AppState, a: Action): AppState {
  if (a.type === "set") return { ...s, ...a.patch };
  if (a.type === "settings") return { ...s, settings: { ...s.settings, ...a.patch } };
  // Clears the plan; keeps the person's sound, privacy and map choices.
  return { ...INITIAL, scene: s.scene, voice: s.voice, online: s.online, imagery: s.imagery, hirise: s.hirise, labels: s.labels, tracks: s.tracks };
}

function readInitial(): { state: AppState; warning?: string } {
  const tryParse = (raw: string | null) => {
    if (!raw) return null;
    try { const r = StateSchema.safeParse({ ...INITIAL, ...JSON.parse(raw) }); return r.success ? r.data : undefined; } catch { return undefined; }
  };
  const hash = decodeURIComponent(location.hash.replace(/^#s=/, ""));
  const fromHash = location.hash.startsWith("#s=") ? tryParse(hash) : null;
  if (fromHash) return { state: fromHash };
  let stored: AppState | null | undefined = null;
  try { stored = tryParse(localStorage.getItem(KEY)); } catch { /* storage blocked */ }
  if (stored) return { state: stored };
  return { state: INITIAL, warning: fromHash === undefined ? "That link was incomplete, so the default plan is shown." : undefined };
}

const Ctx = createContext<{ s: AppState; set: (p: Partial<AppState>) => void; setSettings: (p: Partial<Settings>) => void; reset: () => void; warning?: string } | null>(null);

export function StateProvider({ children }: { children: ReactNode }) {
  const init = readInitial();
  const [s, dispatch] = useReducer(reducer, init.state);
  useEffect(() => {
    const id = setTimeout(() => {
      const raw = JSON.stringify(s);
      history.replaceState(null, "", `#s=${encodeURIComponent(raw)}`);
      try { localStorage.setItem(KEY, raw); } catch { /* storage blocked */ }
    }, 300);
    return () => clearTimeout(id);
  }, [s]);
  return (
    <Ctx.Provider value={{ s, warning: init.warning, set: (patch) => dispatch({ type: "set", patch }), setSettings: (patch) => dispatch({ type: "settings", patch }), reset: () => dispatch({ type: "reset" }) }}>
      {children}
    </Ctx.Provider>
  );
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp outside StateProvider");
  return v;
}
