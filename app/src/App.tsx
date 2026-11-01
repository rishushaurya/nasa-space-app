// Homeward | app/src/App.tsx | v1.0.0 | 2026-10-29
import { useEffect, useRef, useState, type ReactNode } from "react";
import { BookOpen, Camera, Clock, Footprints, Globe, Map as MapIcon, Plane, Route, Sun, WifiOff } from "lucide-react";
import { loadData, incidentId, type Data } from "./data/load";
import type { MarsGlobe } from "./globe/globe";
import { StateProvider, useApp, type Scene } from "./state";
import { RuntimeCtx, type EventKind } from "./runtime";
import { usePlanner } from "./core/use-planner";
import { ZONES } from "./sites";
import { Boundary, Panel, ToastProvider, Tip, useToast, type PanelState } from "./ui/ui";
import { ClockScene } from "./scenes/Clock";
import { OrbitScene, DescentScene } from "./scenes/Flight";
import { BriefingScene } from "./scenes/Briefing";
import { PlanScene } from "./scenes/Plan";
import { WalkScene } from "./scenes/Walk";
import { ReliveScene } from "./scenes/Relive";
import { ExploreScene } from "./scenes/Explore";
import { CreditsScene } from "./scenes/Credits";
import { Dock } from "./assistant/Dock";
import { speechMode } from "./assistant/speech";
import type { LatLon } from "./core/frames";

const STEPS: { id: Scene; label: string; icon: typeof Clock; tip: string }[] = [
  { id: "clock", label: "Mars now", icon: Clock, tip: "Mission clock: Mars time, season, sols and radio delay, live" },
  { id: "explore", label: "Explore", icon: MapIcon, tip: "Fly anywhere on Mars: search 2,000 named places, every landing site, rover tracks and orbiter layers" },
  { id: "orbit", label: "Orbit", icon: Globe, tip: "True-scale Mars from orbit, lit by the real Sun" },
  { id: "descent", label: "Descent", icon: Plane, tip: "Fly down to Gale Crater with Perseverance's real entry numbers" },
  { id: "briefing", label: "Briefing", icon: Sun, tip: "Conditions, limits and dose before the walk" },
  { id: "plan", label: "Plan", icon: Route, tip: "Plan a Marswalk with hard safety budgets" },
  { id: "walk", label: "Walk", icon: Footprints, tip: "Walk the plan in first person with a live HUD" },
  { id: "relive", label: "Rover view", icon: Camera, tip: "Street view from Curiosity and Perseverance: stand at any stop, look around in NASA's own photos, step to the next stop" },
  { id: "credits", label: "Credits", icon: BookOpen, tip: "Every agency, dataset, licence and AI tool" },
];

function Shell({ data }: { data: Data }) {
  const { s, set, warning } = useApp();
  const toast = useToast();
  const el = useRef<HTMLDivElement>(null);
  const [globe, setGlobe] = useState<MarsGlobe | null>(null);
  const [globeState, setGlobeState] = useState<PanelState<true>>({ kind: "loading" });
  const [progress, setProgress] = useState(0);
  const [offline, setOffline] = useState(!navigator.onLine);
  const zone = ZONES[s.zone];
  const plan = usePlanner(s.zone, s.stopMin, s.startLtst, s.settings);
  const [position, setPosition] = useState<LatLon>(zone.home);
  const [elapsedMin, setElapsedMin] = useState(0);
  const [event, setEvent] = useState<EventKind>(null);

  useEffect(() => { if (warning) toast(warning); }, [warning]);
  // Live NASA and Esri tiles online; our own rasters only when offline or chosen (PLAN-2 D17).
  useEffect(() => { globe?.setImagery(offline || s.imagery === "offline" ? null : s.imagery, !offline && s.hirise); }, [globe, offline, s.imagery, s.hirise]);
  useEffect(() => { setPosition(ZONES[s.zone].home); setElapsedMin(0); setEvent(null); }, [s.zone]);
  useEffect(() => {
    const on = () => setOffline(false), off = () => setOffline(true);
    addEventListener("online", on); addEventListener("offline", off);
    return () => { removeEventListener("online", on); removeEventListener("offline", off); };
  }, []);
  useEffect(() => {
    let g: MarsGlobe | null = null, alive = true;
    import("./globe/globe").then((m) => m.createGlobe(el.current!, data.layers, data.moons, setProgress)).then((x) => {
      if (!alive) { x.destroy(); return; }
      g = x; setGlobe(x); setGlobeState({ kind: "ok", data: true });
      if (import.meta.env.DEV || location.search.includes("debug=1")) (window as unknown as { __globe: MarsGlobe }).__globe = x;
      // The first view is up: let the service worker fill in the rest of the offline data in the background.
      if (import.meta.env.PROD) void navigator.serviceWorker?.ready.then((r) => r.active?.postMessage({ type: "warm", voice: s.voice, whisper: speechMode() === "whisper" }));
    }).catch((e) => alive && setGlobeState({ kind: "error", message: `The 3D view could not start: ${e.message}. WebGL may be unavailable.`, incident: incidentId() }));
    return () => { alive = false; g?.destroy(); };
  }, [data]);

  const scenes: Record<Scene, ReactNode> = {
    clock: <ClockScene />, explore: <ExploreScene />, orbit: <OrbitScene />, descent: <DescentScene />, briefing: <BriefingScene />,
    plan: <PlanScene />, walk: <WalkScene />, relive: <ReliveScene />, credits: <CreditsScene />,
  };

  return (
    <RuntimeCtx.Provider value={{ data, globe, plan, position, setPosition, elapsedMin, setElapsedMin, event, setEvent }}>
      <div className="app">
        <div className="globe" ref={el} aria-label="3D view of Mars" role="img" />
        <header className="topbar">
          <div className="brand"><Globe size={20} aria-hidden /><span className="brand-name">Homeward</span> <small>Martian Map, Space Apps 2026</small></div>
          <nav className="stepper" aria-label="Scenes">
            {STEPS.map((st) => (
              <Tip key={st.id} text={st.tip} below>
                <button aria-current={s.scene === st.id ? "step" : undefined} onClick={() => set({ scene: st.id })}><st.icon size={16} aria-hidden /><span>{st.label}</span></button>
              </Tip>
            ))}
          </nav>
          <div className="topbar-actions">
            {offline && <Tip text="Offline: running on cached real data and on-device voice" below><span className="chip"><WifiOff size={14} aria-hidden />Offline</span></Tip>}
          </div>
        </header>
        {globeState.kind === "loading" && (
          <div className="overlay-progress" role="status"><div className="panel"><h2>Streaming Mars</h2><p className="mono">{Math.round(progress * 100)}%</p><p className="muted">Terrain and imagery from NASA, ESA and USGS public data</p></div></div>
        )}
        {globeState.kind === "error" && <div className="center-card"><Panel title="3D view unavailable" state={globeState}>{() => null}</Panel></div>}
        <Boundary name={`scene:${s.scene}`} key={s.scene}>{scenes[s.scene]}</Boundary>
        {s.scene !== "clock" && s.scene !== "relive" && <Boundary name="assistant"><Dock /></Boundary>}
      </div>
    </RuntimeCtx.Provider>
  );
}

export function App() {
  const [st, setSt] = useState<PanelState<Data>>({ kind: "loading" });
  const [n, setN] = useState(0);
  useEffect(() => {
    setSt({ kind: "loading" });
    loadData().then((d) => setSt({ kind: "ok", data: d })).catch((e) => setSt({ kind: "error", message: `Mission data could not load: ${e.message}`, incident: incidentId(), retry: () => setN((x) => x + 1) }));
  }, [n]);
  return (
    <StateProvider>
      <ToastProvider>
        {st.kind === "ok" ? <Shell data={st.data} /> : (
          <div className="center-card"><Panel title="Loading mission data" state={st} lines={6}>{() => null}</Panel></div>
        )}
      </ToastProvider>
    </StateProvider>
  );
}
