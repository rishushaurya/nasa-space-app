// Homeward | app/src/scenes/Flight.tsx | v3.0.0 | 2026-11-13
// Scene 1 (orbit) and scene 3 (descent). The descent HUD shows Perseverance's real entry profile (EDL-01) over Gale.
import { useEffect, useRef, useState } from "react";
import { ArrowRight, FastForward, Globe, Plane, SatelliteDish, SkipForward } from "lucide-react";
import { earthElongation } from "../core/ephemeris";
import { useApp } from "../state";
import { useRuntime } from "../runtime";
import { ZONES } from "../sites";
import { useNow } from "./Clock";
import { Badge, FactRow, Panel, SourceLink, type PanelState } from "../ui/ui";
import { incidentId, loadOrbiters } from "../data/load";
import { orbiterPosition, type OrbiterTable } from "../core/moons";
import { setAmbient } from "../assistant/ambient";

export function OrbitScene() {
  const { set } = useApp();
  const { globe, data } = useRuntime();
  const now = useNow(60000);
  useEffect(() => {
    if (!globe) return;
    globe.setSun(now);
    globe.setPins([{ id: "gale", p: ZONES.gale.home, label: "Gale Crater", kind: "site" }, { id: "jezero", p: { lat: 18.4447, lon: 77.4509 }, label: "Jezero (Perseverance)", kind: "site" }]);
    void globe.flyTo(ZONES.gale.home, 1.1e7, { pitchDeg: -70, headingDeg: 0, seconds: 4 });
    return () => globe.setPins([]);
  }, [globe]);
  // Time-lapse at one hour per second: Phobos's three orbits a sol take about 25 s; Sun, Earth and moons move together.
  const [lapse, setLapse] = useState(false);
  const [simT, setSimT] = useState(now);
  useEffect(() => {
    if (!globe || !lapse) return;
    let t = Date.now(), last = performance.now();
    const id = setInterval(() => { const n = performance.now(); t += (n - last) * 3600; last = n; globe.setSun(t); setSimT(t); }, 50);
    return () => { clearInterval(id); globe.setSun(Date.now()); };
  }, [globe, lapse]);
  // Orbiters overhead at their JPL Horizons positions (PLAN-3 chunk 25): NASA, ESA, ESA with Roscosmos, and the UAE.
  const [orb, setOrb] = useState<PanelState<OrbiterTable>>({ kind: "loading" });
  useEffect(() => {
    if (!globe) return;
    let alive = true;
    loadOrbiters().then((t) => { if (!alive) return; globe.setOrbiters(t); setOrb({ kind: "ok", data: t }); })
      .catch((e) => alive && setOrb({ kind: "error", message: `Orbiter positions could not load: ${e.message}`, incident: incidentId() }));
    return () => { alive = false; globe.setOrbiters(null); };
  }, [globe]);
  const el = earthElongation(now);
  return (
    <aside className="side">
      <section className="panel">
        <h2><Globe size={18} aria-hidden />Mars from orbit</h2>
        <p className="muted">True scale, lit by the Sun's real direction for this moment. Terrain: MOLA and HRSC. Colour: Viking orbiters.</p>
        <div className="facts">
          <FactRow id="PLN-01" data={data} /><FactRow id="PLN-02" data={data} /><FactRow id="PLN-03" data={data} /><FactRow id="PLN-04" data={data} /><FactRow id="PLN-07" data={data} />
          <span className="fact-label">Earth from Mars now</span><span className="fact-value"><span className="mono">{el.deg.toFixed(1)} deg {el.east ? "east" : "west"} of Sun</span><Badge b="LIVE" /></span>
          <FactRow id="MSN-05" data={data} />
          <span className="fact-label">Phobos and Deimos shown at</span><span className="fact-value"><span className="mono">{lapse ? `${new Date(simT).toISOString().slice(0, 16).replace("T", " ")} UTC` : "now"}</span><Badge b="COMPUTED" /><SourceLink id="JPL-HORIZONS" data={data} /></span>
        </div>
        <div className="row"><button className="btn" aria-pressed={lapse} onClick={() => setLapse(!lapse)}><FastForward size={16} aria-hidden />{lapse ? "Back to real time" : "Time-lapse: 1 hour per second"}</button></div>
        <h3>Layers on the globe</h3>
        {data.layers.imagery.map((l) => <div key={l.name} className="row" style={{ fontSize: "var(--text-xs)" }}><span className="grow muted">{l.note}</span>{l.sourceIds.map((s) => <SourceLink key={s} id={s} data={data} />)}</div>)}
        <p className="muted" style={{ fontSize: "var(--text-xs)" }}>Star background: Cesium's Tycho-2 sky, not yet rotated for Mars (approximation).</p>
        <div className="row"><button className="btn primary" onClick={() => set({ scene: "descent" })}>Descend to Gale <ArrowRight size={16} aria-hidden /></button></div>
      </section>
      <Panel title="Orbiters overhead" icon={<SatelliteDish size={18} aria-hidden />} state={orb} lines={5}>
        {(t) => {
          const at = lapse ? simT : now;
          return (
            <>
              <div className="facts">
                {t.orbiters.flatMap((o) => {
                  const p = orbiterPosition(t, o, at);
                  return [<span key={`l${o.id}`} className="fact-label">{o.name} <small className="muted">({o.agency})</small></span>,
                    <span key={`v${o.id}`} className="fact-value"><span className="mono">{p ? `${Math.round(Math.hypot(...p) - 3396.19).toLocaleString("en-US")} km up` : `no ephemeris after ${o.endUtc.slice(0, 10)}`}</span>{p && <Badge b="COMPUTED" />}</span>];
                })}
              </div>
              <p className="muted" style={{ fontSize: "var(--text-xs)", marginBottom: 0 }}>Positions from JPL Horizons every 10 minutes, interpolated <SourceLink id="JPL-HORIZONS-ORBITERS" data={data} />; height above the 3,396 km equatorial radius. MAVEN is not shown: its Horizons ephemeris ends on 1 March 2026.</p>
            </>
          );
        }}
      </Panel>
    </aside>
  );
}

const PHASES = [
  { t: 0, alt: "125 km", speed: "about 19,500 km/h", phase: "Atmospheric entry" },
  { t: 0.45, alt: "about 11 km", speed: "about 1,512 km/h", phase: "Parachute opens (21.5 m)" },
  { t: 0.7, alt: "4.2 km to 2.2 km", speed: "", phase: "Terrain-relative navigation: up to 600 m divert" },
  { t: 0.92, alt: "0 m", speed: "", phase: "Touchdown at Bradbury Landing" },
];

export function DescentScene() {
  const { set, s } = useApp();
  const { globe, data } = useRuntime();
  const [phase, setPhase] = useState(0);
  // Silence until the parachute phase, about 11 km (one scale height, ASSUMPTION threshold), then real Mars wind fades in.
  useEffect(() => { void setAmbient(s.voice && phase >= 1); }, [phase, s.voice]);
  useEffect(() => () => void setAmbient(false), []);
  const cancelled = useRef(false);
  useEffect(() => {
    if (!globe) return;
    cancelled.current = false;
    const z = ZONES[s.zone];
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    globe.setSun(Date.now());
    (async () => {
      setPhase(0);
      if (!reduce) await globe.flyTo(z.home, 160000, { pitchDeg: -60, headingDeg: 20, seconds: 4 });
      if (cancelled.current) return; setPhase(1);
      if (!reduce) await globe.flyTo(z.home, 11000, { pitchDeg: -35, headingDeg: 60, seconds: 4 });
      if (cancelled.current) return; setPhase(2);
      if (!reduce) await globe.flyTo(z.home, 1600, { pitchDeg: -22, headingDeg: 85, seconds: 3.5 });
      if (cancelled.current) return; setPhase(3);
      await globe.flyTo(z.home, 220, { pitchDeg: -14, headingDeg: 90, seconds: reduce ? 0.3 : 2.5 });
      if (!cancelled.current) setTimeout(() => !cancelled.current && set({ scene: "briefing" }), 1200);
    })();
    return () => { cancelled.current = true; };
  }, [globe]);
  const p = PHASES[phase]!;
  return (
    <div className="letterbox" style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      <div className="edl-hud" aria-live="polite" style={{ pointerEvents: "auto" }}>
        <div className="panel">
          <h2><Plane size={18} aria-hidden />{p.phase}</h2>
          <div className="v">{p.alt}</div>
          {p.speed && <div className="muted">{p.speed}</div>}
          <div className="row" style={{ marginTop: "var(--space-2)" }}><Badge b="MEASURED" /><span className="muted" style={{ fontSize: "var(--text-xs)" }}>Perseverance's real entry profile, shown over Gale</span>{data.facts.get("EDL-01")?.sourceIds.map((sid) => <SourceLink key={sid} id={sid} data={data} />)}</div>
          <div className="row" style={{ marginTop: "var(--space-2)" }}><FactRow id="EDL-02" data={data} /></div>
          <button className="btn" onClick={() => { cancelled.current = true; set({ scene: "briefing" }); }}><SkipForward size={16} aria-hidden />Skip</button>
        </div>
      </div>
    </div>
  );
}
