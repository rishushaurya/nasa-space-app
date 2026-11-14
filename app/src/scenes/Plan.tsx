// Homeward | app/src/scenes/Plan.tsx | v1.0.0 | 2026-10-29
// Scene 5: the Marswalk planner. Hard budgets from NASA limits; ASSUMPTION values are sliders; a breach blocks Approve.
import { useEffect, useMemo, useState } from "react";
import { Camera, Earth, Eraser, Footprints, House, Layers, Mountain, Radiation, Route, Sun, Timer, Wind } from "lucide-react";
import { EARTH_MEAN_R_M, offsetM } from "../core/frames";
import type { Data } from "../data/load";
import { cellCenter, DEFAULTS } from "../core/planner";
import { heatCanvas } from "../core/use-planner";
import { localSolar } from "../core/mars-time";
import { KEY, useApp } from "../state";
import { planOk, useRuntime } from "../runtime";
import { ZONES, type ZoneId } from "../sites";
import { Badge, BudgetBar, FactRow, Panel, SourceLink, Tip, fmtHM, fmtIst, fmtUtc, useToast } from "../ui/ui";

const css = (v: string) => getComputedStyle(document.documentElement).getPropertyValue(v).trim();

function Slider({ label, value, min, max, step, unit, badge, tip, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; badge: "ASSUMPTION" | "STANDARD"; tip: string; onChange: (v: number) => void }) {
  const id = `sl-${label.replace(/\W/g, "")}`;
  return (
    <div className="field">
      <label htmlFor={id}><Tip text={tip}><span tabIndex={0}>{label}</span></Tip><span className="row"><span className="mono">{value}{unit}</span><Badge b={badge} /></span></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} />
    </div>
  );
}

export function PlanScene() {
  const { s, set, setSettings, reset } = useApp();
  const toast = useToast();
  const { data, globe, plan } = useRuntime();
  const z = ZONES[s.zone];
  const p = planOk(plan);
  const sol = data.sols.get(z.photoSol);

  const route = useMemo(() => p ? [p.homeCell, ...p.result.path].filter((_, i, a) => i % 2 === 0 || i === a.length - 1).map((c) => cellCenter(p.grid, c)) : null, [p]);
  useEffect(() => {
    if (!globe) return;
    globe.setPins([{ id: "home", p: z.home, label: z.homeName, kind: "home" }, { id: "stop", p: z.stop, label: z.stopName, kind: "stop" }]);
    void globe.flyTo({ lat: (z.home.lat + z.stop.lat) / 2, lon: (z.home.lon + z.stop.lon) / 2 }, s.zone === "gale" ? 900 : 650, { pitchDeg: -48, headingDeg: 0, seconds: 2 });
    return () => { globe.setRoute(null); globe.setHeat(null); };
  }, [globe, s.zone]);
  useEffect(() => { if (globe && p) globe.setSun(p.startUtcMs + 30 * 60000); }, [globe, p?.startUtcMs]);
  useEffect(() => { globe?.setRoute(route); }, [globe, route]);
  useEffect(() => {
    if (!globe || !p) return;
    if (!s.heat) { globe.setHeat(null); return; }
    const g = p.grid;
    const canvas = heatCanvas(g, p.field, p.result.budgets.lifeSupport.limitMin, [css("--color-ok"), css("--badge-live"), css("--color-warn"), css("--color-accent")], css("--color-breach"));
    globe.setHeat(canvas, { west: g.westLonE, east: g.westLonE + g.cols * g.dLonDeg, south: g.northLatC - g.rows * g.dLatDeg, north: g.northLatC });
  }, [globe, p?.field, s.heat, p?.result.budgets.lifeSupport.limitMin]);

  const pick = (id: ZoneId) => set({ zone: id });

  return (
    <aside className="side">
      <section className="panel">
        <h2><Route size={18} aria-hidden />Plan a Marswalk</h2>
        <div className="seg" role="group" aria-label="Walk zone">
          {(Object.keys(ZONES) as ZoneId[]).map((id) => <button key={id} aria-pressed={s.zone === id} onClick={() => pick(id)}>{ZONES[id].short}</button>)}
        </div>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>{z.title}. {z.why}</p>
        <div className="facts"><FactRow id={z.distanceFact} data={data} /></div>
      </section>

      <section className="panel">
        <h2><Camera size={18} aria-hidden />What you will see at the stop</h2>
        {sol ? (
          <>
            <p className="muted" style={{ fontSize: "var(--text-sm)" }}>Curiosity's own photos from sol {sol.sol}: {sol.story}.</p>
            <div className="photos">
              {sol.images.slice(0, 4).map((im) => <figure key={im.id}><img src={im.file} alt={`Curiosity ${im.camera ?? ""} image ${im.id}, sol ${sol.sol}`} loading="lazy" width={320} height={240} /><figcaption>{im.camera} {im.credit}</figcaption></figure>)}
            </div>
            <div className="facts" style={{ marginTop: "var(--space-2)" }}>{z.scienceFacts.map((id) => <FactRow key={id} id={id} data={data} />)}</div>
          </>
        ) : <p className="muted">No photos for this stop.</p>}
      </section>

      <Panel title="Safety budgets" icon={<Timer size={18} aria-hidden />} state={plan} lines={6}>
        {(d) => {
          const b = d.result.budgets, lim = b.lifeSupport.limitMin;
          return (
            <>
              <p className="muted" style={{ fontSize: "var(--text-sm)" }}>EVA starts {fmtUtc(d.startUtcMs)} ({fmtIst(d.startUtcMs)}), {s.startLtst}:00 local solar time on the next sol. Walk {Math.round(d.result.totals.walkM)} m there and back, {Math.round(d.result.totals.walkMin)} min of walking.</p>
              <BudgetBar name="Life support (O2 + power)" icon={<Wind size={14} aria-hidden />} used={b.lifeSupport.usedMin} limit={lim} label={`${fmtHM(b.lifeSupport.usedMin)} / ${fmtHM(lim)}`} tip="8-hour NASA EVA limit (EVA-01) minus your reserve. Oxygen and power share this budget: no Mars-suit consumable masses are published." />
              <BudgetBar name="Walk-back margin" icon={<House size={14} aria-hidden />} used={b.walkBack.minMarginMin} limit={lim} inverse label={`${fmtHM(b.walkBack.minMarginMin)} at worst`} tip="At every step, life support left minus the time to walk home at the Apollo planning rate (EVA-04), slowed on slopes." />
              <BudgetBar name="Daylight" icon={<Sun size={14} aria-hidden />} used={b.daylight.marginMin} limit={lim} inverse label={`${fmtHM(b.daylight.marginMin)} to spare`} tip="Home before sunset minus your daylight margin. Sunset from the Mars24 algorithm." />
              <div className="facts"><span className="fact-label"><Radiation size={14} aria-hidden /> Dose on this walk</span><span className="fact-value"><span className="mono">{b.dose.mSv.toFixed(3)} mSv</span><Badge b="COMPUTED" /><SourceLink id="HASSLER-2014" data={data} /></span></div>
              {d.snappedM > 0.5 && <p className="muted" style={{ fontSize: "var(--text-xs)" }}>The stop is {Math.round(d.snappedM)} m from Curiosity's exact spot, on the nearest ground a suited walker can stand on.</p>}
              {d.result.breaches.length > 0 && <ul className="breaches" aria-live="polite">{d.result.breaches.map((x, i) => <li key={i}><Mountain size={14} aria-hidden />{x.message}</li>)}</ul>}
              <p className="muted" style={{ fontSize: "var(--text-xs)" }}>Rocks smaller than about 1 m cannot be seen in orbital terrain models. Planner: field {Math.round(d.timings.fieldMs)} ms, route {Math.round(d.timings.routeMs)} ms.</p>
              <div className="row">
                <Tip text={d.result.ok ? "Start the walk" : `Blocked: ${d.result.breaches.map((x) => x.code).join(", ")}`}>
                  <button className="btn primary" disabled={!d.result.ok} onClick={() => set({ scene: "walk" })}><Footprints size={16} aria-hidden />Approve and walk</button>
                </Tip>
                <button className="btn" aria-pressed={s.heat} onClick={() => set({ heat: !s.heat })}><Layers size={16} aria-hidden />{s.heat ? "Hide" : "Show"} walk-back map</button>
              </div>
              {s.heat && <div className="legend" aria-label="Walk-back map legend"><span><i className="sw" style={{ background: "var(--color-ok)" }} />0-5 min home</span><span><i className="sw" style={{ background: "var(--badge-live)" }} />5-10</span><span><i className="sw" style={{ background: "var(--color-warn)" }} />10-15</span><span><i className="sw" style={{ background: "var(--color-accent)" }} />15+</span><span><i className="sw" style={{ background: "var(--color-breach)" }} />no safe way home</span></div>}
            </>
          );
        }}
      </Panel>

      <section className="panel">
        <h2><Timer size={18} aria-hidden />Plan settings</h2>
        <Slider label="Time at the science stop" value={s.stopMin} min={0} max={480} step={5} unit=" min" badge="ASSUMPTION" tip="How long the crew works at the outcrop" onChange={(v) => set({ stopMin: v })} />
        <Slider label="EVA start (local solar time)" value={s.startLtst} min={6} max={17} step={0.5} unit=":00" badge="ASSUMPTION" tip={`Local true solar time at the site; now it is ${localSolar(Date.now(), z.home.lon).ltstH.toFixed(1)} h there`} onChange={(v) => set({ startLtst: v })} />
        <Slider label="Life-support reserve" value={s.settings.reserveMin} min={0} max={120} step={5} unit=" min" badge="ASSUMPTION" tip="Kept back from the 8-hour EVA limit" onChange={(v) => setSettings({ reserveMin: v })} />
        <Slider label="Daylight margin" value={s.settings.daylightMarginMin} min={0} max={120} step={5} unit=" min" badge="ASSUMPTION" tip="Be home this long before sunset" onChange={(v) => setSettings({ daylightMarginMin: v })} />
        <Slider label="Maximum slope" value={s.settings.slopeMaxDeg} min={10} max={30} step={1} unit=" deg" badge={s.settings.slopeMaxDeg === DEFAULTS.slopeMaxDeg ? "STANDARD" : "ASSUMPTION"} tip="NASA EVA ConOps: suited walking up, down and across slopes up to 20 deg (lunar-derived)" onChange={(v) => setSettings({ slopeMaxDeg: v })} />
        <Slider label="Obstacle relief threshold" value={s.settings.reliefMaxM} min={0.5} max={2} step={0.1} unit=" m" badge="ASSUMPTION" tip="Cells whose terrain varies more than this within about 3 m are treated as rocks or ridges to avoid" onChange={(v) => setSettings({ reliefMaxM: v })} />
        <Slider label="Walking speed factor" value={s.settings.speedFactor} min={0.5} max={1.5} step={0.05} unit="x" badge="ASSUMPTION" tip="Scales Tobler's hiking function, which is 3.3 km/h on flat ground (Apollo walk-back rate)" onChange={(v) => setSettings({ speedFactor: v })} />
        <div className="row"><button className="btn" onClick={() => { reset(); try { localStorage.removeItem(KEY); } catch { /* storage blocked */ } toast("Plan cleared: settings, samples and saved copy reset to defaults"); }}><Eraser size={16} aria-hidden />Clear plan</button></div>
        <details><summary className="muted">Terrain grid provenance</summary>{p && <ul className="muted" style={{ fontSize: "var(--text-xs)" }}>{p.header.processing.map((x) => <li key={x}>{x}</li>)}</ul>}</details>
      </section>
      <EarthAnalog data={data} />
    </aside>
  );
}

/** Learn from maps of other destinations (PLAN-4 D33): the Haughton-Mars Project station on Devon Island, where suits,
 *  rovers and walks have been tested for Mars since 1997, seen from orbit through NASA GIBS (the imagery behind
 *  Worldview), with the same walking radius as the plan drawn to scale. */
function EarthAnalog({ data }: { data: Data }) {
  const [day, setDay] = useState(""); // empty: Landsat's cloud-free annual composite; a date: that day's HLS 30 m image
  const lat = Number(data.facts.get("EARTH-01")?.value), lon = Number(data.facts.get("EARTH-02")?.value), radiusM = Number(data.facts.get("EVA-02")?.value) * 1000;
  if (!Number.isFinite(lat) || !Number.isFinite(lon) || !Number.isFinite(radiusM)) return null;
  const half = 3 * radiusM, px = 512, home = { lat, lon };
  const n = offsetM(home, 0, half, EARTH_MEAN_R_M).lat, e = offsetM(home, 90, half, EARTH_MEAN_R_M).lon;
  const box = [2 * lat - n, 2 * lon - e, n, e].map((v) => v.toFixed(5)).join(","); // WMS 1.3.0, EPSG:4326: lat, lon order
  const layer = day ? `HLS_S30_Nadir_BRDF_Adjusted_Reflectance&TIME=${day}` : "Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual";
  const src = `https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&CRS=EPSG:4326&WIDTH=${px}&HEIGHT=${px}&FORMAT=image/jpeg&BBOX=${box}&LAYERS=${layer}`;
  const r = (radiusM / half) * (px / 2);
  return (
    <section className="panel">
      <h2><Earth size={18} aria-hidden />Practised on Earth first</h2>
      <p className="muted" style={{ fontSize: "var(--text-sm)", marginTop: 0 }}>The Haughton-Mars Project station on Devon Island, Canada: a polar-desert crater where spacesuits, rovers and walks have been field-tested for Mars since 1997. The circle is this plan's walking radius at the same scale.</p>
      <div style={{ position: "relative", width: "100%", aspectRatio: "1" }}>
        <img src={src} alt={day ? `Devon Island on ${day}, Sentinel-2 30 m` : "Devon Island, Landsat annual composite"} referrerPolicy="no-referrer" style={{ width: "100%", height: "100%", borderRadius: "var(--radius-sm)", display: "block" }} />
        <svg viewBox={`0 0 ${px} ${px}`} style={{ position: "absolute", inset: 0 }} aria-hidden>
          <circle cx={px / 2} cy={px / 2} r={r} fill="none" stroke="var(--color-accent)" strokeWidth="3" />
          <circle cx={px / 2} cy={px / 2} r="6" fill="var(--color-ok)" />
        </svg>
      </div>
      <div className="facts" style={{ marginTop: "var(--space-3)" }}>
        <FactRow id="EARTH-01" data={data} label="Station latitude" />
        <FactRow id="EARTH-02" data={data} label="Station longitude" />
        <FactRow id="EVA-02" data={data} label="Circle: walking radius" />
      </div>
      <div className="row" style={{ marginTop: "var(--space-2)" }}>
        <label htmlFor="earth-day" className="muted" style={{ fontSize: "var(--text-sm)" }}>Image date</label>
        <input id="earth-day" type="date" value={day} min="2015-12-01" max={new Date().toISOString().slice(0, 10)} onChange={(e) => setDay(e.target.value)} />
        {day && <button className="btn" onClick={() => setDay("")}>Annual composite</button>}
      </div>
      <p className="muted" style={{ fontSize: "var(--text-xs)" }}>{day ? "Harmonized Landsat Sentinel-2, 30 m, for that day: a satellite passes every few days and the station is dark from November to February, so many dates show cloud or nothing." : "Landsat annual composite, 30 m, cloud-free. Pick a date to see one day, as in NASA Worldview."} <SourceLink id="NASA-GIBS" data={data} /> <SourceLink id="MARS-INSTITUTE-HMP" data={data} /></p>
    </section>
  );
}
