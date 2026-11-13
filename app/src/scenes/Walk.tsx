// Homeward | app/src/scenes/Walk.tsx | v3.0.0 | 2026-11-13
// Scene 6-9: you walk the plan yourself (D20); "Follow the plan" replays the planner's route. HUD values come from
// the planner and tested core functions.
import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { Antenna, ArrowUp, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Download, Eye, FlaskConical, House, Pause, Play, Radiation, RadioTower, Share2, Sun, TriangleAlert, Wind } from "lucide-react";
import { lightTimeMin } from "../core/ephemeris";
import { bearingDeg as bearing, haversineM, offsetM as offset } from "../core/frames";
import { gcrDoseMSv } from "../core/dose";
import { lineOfSight } from "../core/los";
import { cellCenter, cellIndex, passable, walkSpeedKmh } from "../core/planner";
import { useApp } from "../state";
import { planOk, useRuntime } from "../runtime";
import { ZONES } from "../sites";
import { Badge, FactRow, SourceLink, fmtHM, useToast } from "../ui/ui";
import { setAmbient } from "../assistant/ambient";

const download = (name: string, body: string, type: string) => {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([body], { type }));
  a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
};

export function WalkScene() {
  const { s, set } = useApp();
  const { data, globe, plan, setPosition, position, elapsedMin, setElapsedMin, event, setEvent } = useRuntime();
  const toast = useToast();
  const p = planOk(plan);
  const z = ZONES[s.zone];
  const [playing, setPlaying] = useState(true);
  const [speed, setSpeed] = useState(30);
  const [pace, setPace] = useState(1);
  const [view, setView] = useState<"eye" | "above">("eye");
  const [atStop, setAtStop] = useState(false);
  const [done, setDone] = useState(false);
  const [heading, setHeading] = useState(90);
  const [manual, setManual] = useState(true);
  const devilStart = useRef<number | null>(null);
  const stopSeen = useRef(false);
  const tRef = useRef(0);
  const held = useRef(new Set<string>());
  const look = useRef({ heading: 90, pitch: -4 });
  const here = useRef(z.home);
  const walked = useRef(0); // metres actually walked when walking yourself

  const tl = useMemo(() => (p ? p.result.timeline.map((x) => ({ ...x, p: cellCenter(p.grid, x.cell) })) : []), [p]);
  const total = p?.result.totals.totalMin ?? 0;
  const outboundEnd = (tl.find((x) => x.stopId)?.tMin ?? total) - (p?.result.totals.stopMin ?? 0); // arrival at the stop

  useEffect(() => {
    tRef.current = 0; setElapsedMin(0); setEvent(null); stopSeen.current = false; devilStart.current = null; setDone(false); setAtStop(false); setPosition(z.home);
    here.current = z.home; walked.current = 0; look.current = { heading: bearing(z.home, z.stop), pitch: -4 }; setHeading(look.current.heading);
    return () => setEvent(null);
  }, [p?.startUtcMs, s.zone]);
  useEffect(() => { void setAmbient(s.voice); return () => void setAmbient(false); }, [s.voice]);
  useEffect(() => { if (globe && tl.length) globe.setRoute(tl.map((x) => x.p)); return () => { globe?.setRoute(null); globe?.setDustDevil(null); }; }, [globe, tl]);

  const posAt = (t: number) => {
    let i = tl.findIndex((x) => x.tMin >= t);
    if (i <= 0) return { p: tl[0]?.p ?? z.home, next: tl[1]?.p ?? z.stop };
    const a = tl[i - 1]!, b = tl[i]!;
    const f = b.tMin > a.tMin ? (t - a.tMin) / (b.tMin - a.tMin) : 1;
    while (i < tl.length - 1 && haversineM(tl[i]!.p, a.p) < 1) i++;
    return { p: { lat: a.p.lat + (b.p.lat - a.p.lat) * f, lon: a.p.lon + (b.p.lon - a.p.lon) * f }, next: tl[Math.min(i + 2, tl.length - 1)]!.p };
  };
  const dustDevil = (at: typeof z.home, hd: number) => {
    if (devilStart.current === null || !globe) return;
    const age = tRef.current - devilStart.current; // minutes; EVT-01 speed about 19 km/h = 317 m/min
    globe.setDustDevil(age < 3 ? offset(offset(at, hd, 400), hd + 90, -300 + age * 317 * 0.6) : null);
  };

  // Follow the plan: mission time runs `speed` times faster than real time (labelled on screen).
  useEffect(() => {
    if (!globe || !p || manual) return;
    let raf = 0, last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000; last = now;
      if (playing && !atStop && !done) {
        tRef.current = Math.min(total, tRef.current + (dt * speed) / 60);
        const stopPt = tl.find((x) => x.stopId);
        if (!stopSeen.current && stopPt && tRef.current >= stopPt.tMin - (p.result.totals.stopMin)) { stopSeen.current = true; setAtStop(true); tRef.current = stopPt.tMin - p.result.totals.stopMin; }
        if (tRef.current >= total) setDone(true);
        if (devilStart.current === null && tRef.current > outboundEnd * 0.6 && tRef.current < outboundEnd) {
          devilStart.current = tRef.current; setEvent("dust-devil"); // the suit announces it (Dock) and the event card explains it
        }
      }
      const { p: at, next } = posAt(tRef.current);
      const hd = bearing(at, next);
      if (view === "eye") globe.eye(at, hd, -4); else globe.eye(offset(at, hd + 180, 60), hd, -28, 35);
      globe.setSun(p.startUtcMs + tRef.current * 60000);
      dustDevil(at, hd);
      here.current = at; look.current = { heading: hd, pitch: -4 };
      setPosition(at); setHeading(hd); setElapsedMin(tRef.current);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [globe, p, playing, speed, view, atStop, done, manual, tl]);

  // Walk yourself: hold W/S or the arrows to walk, A/D to turn, drag to look. Speed is the planner's own:
  // Tobler's hiking function scaled to the Apollo walk-back rate (EVA-04), slower uphill. The suit clock runs
  // `pace` times real time, walking or standing, as life support would. Cells too steep or rocky stop you.
  useEffect(() => {
    if (!manual || !globe || !p) return;
    const ctl = globe.viewer.scene.screenSpaceCameraController;
    ctl.enableInputs = false;
    const KEYS: Record<string, string> = { w: "up", arrowup: "up", s: "down", arrowdown: "down", a: "left", arrowleft: "left", d: "right", arrowright: "right" };
    const kd = (e: KeyboardEvent) => { const k = KEYS[e.key.toLowerCase()]; if (!k || (e.target as HTMLElement)?.closest?.("input, textarea, select")) return; held.current.add(k); e.preventDefault(); };
    const ku = (e: KeyboardEvent) => { const k = KEYS[e.key.toLowerCase()]; if (k) held.current.delete(k); };
    const clear = () => held.current.clear();
    addEventListener("keydown", kd); addEventListener("keyup", ku); addEventListener("blur", clear);
    let raf = 0, last = performance.now(), lastUi = 0, warned = 0;
    const loop = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.1); last = now;
      const k = held.current, L = look.current;
      if (playing && !done) {
        L.heading = (L.heading + ((k.has("right") ? 1 : 0) - (k.has("left") ? 1 : 0)) * 60 * dt + 360) % 360;
        const dir = (k.has("up") ? 1 : 0) - (k.has("down") ? 1 : 0);
        if (dir && !atStop) {
          const b = L.heading + (dir < 0 ? 180 : 0), at = here.current;
          const rise = globe.heightAt(offset(at, b, 1)) - globe.heightAt(at);
          const step = (walkSpeedKmh(rise, 1, s.settings.speedFactor) / 3.6) * dt * pace;
          const np = offset(at, b, step), c = cellIndex(p.grid, np);
          if (c >= 0 && passable(p.grid, c, s.settings)) { here.current = np; walked.current += step; }
          else if (now - warned > 3000) { warned = now; toast(c < 0 ? "Edge of the mapped walk zone" : `Too steep or rocky for a suited walk here (${p.grid.slopeDeg[c]!.toFixed(0)} deg, relief ${p.grid.reliefM[c]!.toFixed(1)} m)`); }
        }
        if (!atStop) tRef.current += (dt * pace) / 60;
        const toStop = haversineM(here.current, z.stop), toHome = haversineM(here.current, z.home), leg = haversineM(z.home, z.stop);
        if (devilStart.current === null && !stopSeen.current && leg - toStop > leg * 0.6) { devilStart.current = tRef.current; setEvent("dust-devil"); }
        if (!stopSeen.current && toStop < 15) { stopSeen.current = true; setAtStop(true); held.current.clear(); }
        if (stopSeen.current && !atStop && toHome < 10) { setDone(true); held.current.clear(); }
      }
      globe.eye(here.current, L.heading, L.pitch);
      globe.setSun(p.startUtcMs + tRef.current * 60000);
      dustDevil(here.current, L.heading);
      if (now - lastUi > 100) { lastUi = now; setPosition(here.current); setHeading(L.heading); setElapsedMin(tRef.current); }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); removeEventListener("keydown", kd); removeEventListener("keyup", ku); removeEventListener("blur", clear); held.current.clear(); ctl.enableInputs = true; };
  }, [manual, globe, p, playing, pace, atStop, done, s.settings]);

  // Drag anywhere on the view to look around (as in Rover view); the pad buttons hold like keys.
  const drag = useRef<{ x: number; y: number; h: number; p: number } | null>(null);
  const hold = (k: string) => ({
    onPointerDown: (e: ReactPointerEvent<HTMLButtonElement>) => { e.currentTarget.setPointerCapture(e.pointerId); held.current.add(k); },
    onPointerUp: () => held.current.delete(k), onPointerCancel: () => held.current.delete(k), onLostPointerCapture: () => held.current.delete(k),
  });

  if (!p) return <aside className="side"><section className="panel"><h2>No approved plan</h2><p className="muted">Plan a walk first.</p><button className="btn primary" onClick={() => set({ scene: "plan" })}>Open the planner</button></section></aside>;

  const lim = p.result.budgets.lifeSupport.limitMin;
  const cell = cellIndex(p.grid, position);
  const home = cell >= 0 ? p.field[cell]! : NaN;
  const lifeLeft = lim - elapsedMin, margin = lifeLeft - home;
  const daylight = (p.sunsetUtcMs - (p.startUtcMs + elapsedMin * 60000)) / 60000;
  const cls = margin < 0 ? "breach" : margin < lim * 0.1 ? "breach" : margin < lim * 0.25 ? "warn" : "";
  const delay = lightTimeMin(Date.now());
  const sol = data.sols.get(z.photoSol);
  const sight = lineOfSight(p.grid, position, z.home); // radio path to the shelter over the HiRISE terrain (PLAN-3 D27)

  const exportGeo = () => download(`homeward-${s.zone}-plan.geojson`, JSON.stringify({
    type: "FeatureCollection",
    properties: { app: "Homeward", site: z.title, sources: ["MMGIS-MSL-WAYPOINTS", "DATA-03", "NTRS-20200001071", "APOLLO17-TRAVERSE", "HASSLER-2014"].map((id) => data.sources.get(id)?.url) },
    features: [
      { type: "Feature", properties: { kind: "route", totalMin: Math.round(total), walkM: Math.round(p.result.totals.walkM) }, geometry: { type: "LineString", coordinates: tl.map((x) => [x.p.lon, x.p.lat]) } },
      { type: "Feature", properties: { kind: "habitat", name: z.homeName }, geometry: { type: "Point", coordinates: [z.home.lon, z.home.lat] } },
      { type: "Feature", properties: { kind: "science-stop", name: z.stopName }, geometry: { type: "Point", coordinates: [z.stop.lon, z.stop.lat] } },
      ...s.samples.map((x) => ({ type: "Feature", properties: { kind: "sample", note: x.note, tMin: x.t }, geometry: { type: "Point", coordinates: [x.lon, x.lat] } })),
    ],
  }, null, 1), "application/geo+json");
  const exportCsv = () => download(`homeward-${s.zone}-timeline.csv`, ["t_min,lat_planetocentric,lon_east,time_home_min", ...tl.map((x) => `${x.tMin.toFixed(2)},${x.p.lat.toFixed(6)},${x.p.lon.toFixed(6)},${(p.field[x.cell] ?? 0).toFixed(2)}`),
    "# Sources: MMGIS MSL waypoints; HiRISE DTM (CC0, NASA/JPL/University of Arizona); NASA EVA ConOps 2020; Apollo 17 traverse planning"].join("\n"), "text/csv");

  return (
    <>
      {manual && <div className="walk-look" aria-hidden
        onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, h: look.current.heading, p: look.current.pitch }; }}
        onPointerMove={(e) => { const d = drag.current; if (d) look.current = { heading: (d.h - (e.clientX - d.x) * 0.15 + 360) % 360, pitch: Math.min(60, Math.max(-60, d.p + (e.clientY - d.y) * 0.15)) }; }}
        onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)} />}
      <div className="hud" role="region" aria-label="Suit heads-up display">
        <div className={`cell primary ${cls}`}><span className="k"><House size={12} aria-hidden />Time to walk home</span><span className="v">{Number.isFinite(home) ? `${home.toFixed(1)} min` : "no safe path"}</span><span className="k">margin {fmtHM(margin)}</span></div>
        <div className={`cell ${lifeLeft < lim * 0.25 ? "warn" : ""}`}><span className="k"><Wind size={12} aria-hidden />Life support</span><span className="v">{fmtHM(lifeLeft)}</span></div>
        <div className="cell"><span className="k"><Radiation size={12} aria-hidden />Dose</span><span className="v">{gcrDoseMSv(elapsedMin / 60).toFixed(3)} mSv</span></div>
        <div className={`cell ${daylight < 60 ? "warn" : ""}`}><span className="k"><Sun size={12} aria-hidden />Daylight</span><span className="v">{fmtHM(daylight)}</span></div>
        <div className="cell secondary"><span className="k">Distance home</span><span className="v">{Math.round(haversineM(position, z.home))} m</span></div>
        <div className={`cell ${sight.clear ? "secondary" : "warn"}`}><span className="k"><Antenna size={12} aria-hidden />Radio to {s.zone === "gale" ? "habitat" : "rover"}</span><span className="v">{sight.clear ? "In sight" : "Blocked"}</span></div>
        {manual && (() => {
          const goal = stopSeen.current ? z.home : z.stop, rel = bearing(position, goal) - heading;
          return <div className="cell"><span className="k">{stopSeen.current ? "Home" : "Science stop"}</span><span className="v"><ArrowUp size={18} aria-label={`${Math.round(((rel % 360) + 540) % 360 - 180)} degrees from your heading`} style={{ transform: `rotate(${rel}deg)`, verticalAlign: "middle" }} /> {Math.round(haversineM(position, goal))} m</span></div>;
        })()}
        <div className="cell secondary"><span className="k"><RadioTower size={12} aria-hidden />Earth delay</span><span className="v">{delay.toFixed(1)} min</span></div>
        <div className="cell secondary"><span className="k">Elapsed</span><span className="v">{fmtHM(elapsedMin)}</span></div>
      </div>
      <p className="sr-only" aria-live="polite">{Math.round(elapsedMin) % 5 === 0 ? `Time home ${Number.isFinite(home) ? home.toFixed(0) : "unknown"} minutes, life support ${Math.round(lifeLeft)} minutes` : ""}</p>

      <aside className="side">
        <section className="panel">
          <div className="seg" role="group" aria-label="How to walk">
            <button aria-pressed={manual} onClick={() => setManual(true)}>Walk yourself</button>
            <button aria-pressed={!manual} onClick={() => setManual(false)}>Follow the plan</button>
          </div>
          <div className="row" style={{ marginTop: "var(--space-2)" }}>
            <button className="btn icon" onClick={() => setPlaying(!playing)} aria-label={playing ? "Pause the suit clock" : "Resume"}>{playing ? <Pause size={16} /> : <Play size={16} />}</button>
            {manual
              ? <div className="seg" role="group" aria-label="Time compression">{[1, 10, 30].map((x) => <button key={x} aria-pressed={pace === x} onClick={() => setPace(x)}>{x === 1 ? "Real time" : `${x}x`}</button>)}</div>
              : <div className="seg" role="group" aria-label="Time speed">{[10, 30, 60].map((x) => <button key={x} aria-pressed={speed === x} onClick={() => setSpeed(x)}>{x}x</button>)}</div>}
            {!manual && <button className="btn icon" onClick={() => setView(view === "eye" ? "above" : "eye")} aria-label="Toggle view"><Eye size={16} /></button>}
          </div>
          {manual && (
            <div className="dpad" aria-label="Walk controls">
              <button className="btn up" aria-label="Walk forward (W)" {...hold("up")}><ChevronUp size={22} /></button>
              <button className="btn left" aria-label="Turn left (A)" {...hold("left")}><ChevronLeft size={22} /></button>
              <button className="btn down" aria-label="Walk back (S)" {...hold("down")}><ChevronDown size={22} /></button>
              <button className="btn right" aria-label="Turn right (D)" {...hold("right")}><ChevronRight size={22} /></button>
            </div>
          )}
          <p className="muted" style={{ fontSize: "var(--text-xs)", margin: "var(--space-2) 0 0" }}>{manual
            ? <>Hold W or the up arrow to walk, A and D to turn, drag the view to look around. You walk at the planner&apos;s pace: {walkSpeedKmh(0, 1, s.settings.speedFactor).toFixed(1)} km/h on the flat, slower uphill <SourceLink id="APOLLO17-TRAVERSE" data={data} />. The suit clock runs {pace === 1 ? "in real time" : `${pace}x faster than real time`}. Walk to the science stop and back home.</>
            : `Mission time runs ${speed}x faster than real time.`} Radio to the shelter is a straight path over the HiRISE terrain and the planet's curvature (suit antenna 1.7 m, mast 3 m <Badge b="ASSUMPTION" />); out of sight means no direct voice link. Eye height 1.7 m <Badge b="ASSUMPTION" />; horizon {data.facts.get("PLN-12")?.value} km away.{s.voice && <> Wind: Perseverance&apos;s real microphone recording, sol 1 <SourceLink id="NASA-SUPERCAM-SOL1" data={data} /></>}</p>
          <div className="row" style={{ marginTop: "var(--space-2)" }}>
            <button className="btn" onClick={() => setEvent("solar-storm")}><Radiation size={16} aria-hidden />Solar-storm drill</button>
          </div>
        </section>
        {event === "solar-storm" && (
          <section className="panel error" role="alert">
            <h2><TriangleAlert size={18} aria-hidden />Solar storm: take shelter</h2>
            <p>Shelter ({s.zone === "gale" ? "habitat" : "pressurised rover"}) is <b className="mono">{Number.isFinite(home) ? home.toFixed(1) : "?"} min</b> away on foot.</p>
            <div className="facts"><FactRow id="RAD-05" data={data} /><FactRow id="RAD-04" data={data} /></div>
            <p className="muted" style={{ fontSize: "var(--text-xs)" }}>The May 2024 figure is absorbed dose (gray), a different quantity from the sievert background, so they are not added together.</p>
            <button className="btn" onClick={() => setEvent(null)}>Acknowledge</button>
          </section>
        )}
        {event === "dust-devil" && (
          <section className="panel">
            <h2><TriangleAlert size={18} aria-hidden />Dust devil ahead</h2>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>The moving column is drawn by the app <Badge b="GENERATED" /> at the size and speed of a real one Perseverance filmed.</p>
            <div className="facts"><FactRow id="EVT-01" data={data} /><FactRow id="WX-02" data={data} /></div>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>Ask the suit assistant whether it is safe to continue.</p>
            <button className="btn" onClick={() => setEvent(null)}>Dismiss</button>
          </section>
        )}
        {atStop && (
          <section className="panel">
            <h2><FlaskConical size={18} aria-hidden />{z.stopName}</h2>
            <p>{z.why}</p>
            <div className="facts">{z.scienceFacts.map((id) => <FactRow key={id} id={id} data={data} />)}</div>
            {sol && <div className="photos" style={{ marginTop: "var(--space-2)" }}>{sol.images.slice(0, 2).map((im) => <figure key={im.id}><img src={im.file} alt={`Curiosity image ${im.id}`} loading="lazy" /><figcaption>{im.credit}</figcaption></figure>)}</div>}
            <div className="row" style={{ marginTop: "var(--space-2)" }}>
              <button className="btn" onClick={() => { set({ samples: [...s.samples, { t: elapsedMin, lat: position.lat, lon: position.lon, note: `${z.short} sample` }].slice(-50) }); toast("Sample logged with coordinates"); }}><FlaskConical size={16} aria-hidden />Log sample</button>
              <button className="btn primary" onClick={() => { tRef.current += p.result.totals.stopMin; setAtStop(false); }}>Finish work, head home</button>
            </div>
          </section>
        )}
        {done && (
          <section className="panel">
            <h2><House size={18} aria-hidden />Debrief: home safe</h2>
            {/* Research 12.7 scene 9: compare the plan with what happened. Following the plan, the two are equal. */}
            <div className="facts compare">
              <span className="fact-label" /><span className="fact-label">Plan</span><span className="fact-label">{manual ? "You" : "Walked"}</span>
              <span className="fact-label">Walked</span><span className="fact-value mono">{Math.round(p.result.totals.walkM)} m</span><span className="fact-value mono">{Math.round(manual ? walked.current : p.result.totals.walkM)} m</span>
              <span className="fact-label">Time outside</span><span className="fact-value mono">{fmtHM(total)}</span><span className="fact-value mono">{fmtHM(elapsedMin)}</span>
              <span className="fact-label">Life support left</span><span className="fact-value mono">{fmtHM(lim - total)}</span><span className="fact-value mono">{fmtHM(lim - elapsedMin)}</span>
              <span className="fact-label">Cosmic-ray dose</span><span className="fact-value mono">{p.result.budgets.dose.mSv.toFixed(3)} mSv</span><span className="fact-value mono">{gcrDoseMSv(elapsedMin / 60).toFixed(3)} mSv</span>
              <span className="fact-label">Samples logged</span><span className="fact-value mono" /><span className="fact-value mono">{s.samples.length}</span>
            </div>
            <div className="row" style={{ marginTop: "var(--space-3)" }}>
              <button className="btn" onClick={exportGeo}><Download size={16} aria-hidden />GeoJSON</button>
              <button className="btn" onClick={exportCsv}><Download size={16} aria-hidden />CSV</button>
              <button className="btn" onClick={() => { void navigator.clipboard?.writeText(location.href); toast("Link to this exact plan copied"); }}><Share2 size={16} aria-hidden />Share</button>
              <button className="btn primary" onClick={() => set({ scene: "relive", rover: z.rover })}>See this place in Curiosity's photos</button>
            </div>
          </section>
        )}
      </aside>
    </>
  );
}
