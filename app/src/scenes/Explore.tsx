// Homeward | app/src/scenes/Explore.tsx | v2.0.0 | 2026-11-01
// Scene 2 of the research plan (12.7): choose where to go. A Google-Earth style globe: search every IAU-named place,
// every landing site with cited coordinates, rover tracks and stops, orbiter layers, a ruler with an elevation profile.
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Camera, Compass, Crosshair, Footprints, House, Layers, Minus, Mountain, Plus, Rotate3d, Ruler, Search, Trash2 } from "lucide-react";
import { LIVE } from "../globe/live";
import { haversineM, MARS_SPHERE_M, type LatLon } from "../core/frames";
import { searchPlaces, type Place } from "../core/places";
import { IMAGERY, useApp } from "../state";
import { useRuntime } from "../runtime";
import { loadStops, loadTrack, ROVER } from "../rovers/raw";
import { Badge, SourceLink, Tip, fmtLatLon, useToast } from "../ui/ui";
import type { Lander } from "../data/load";

const HOME = { lat: -4.589467, lon: 137.441633 };
const tracks = { msl: loadTrackOnce("msl"), m20: loadTrackOnce("m20"), heli: loadTrackOnce("ingenuity") };
function loadTrackOnce(n: "msl" | "m20" | "ingenuity") { let p: Promise<number[][]> | null = null; return () => (p ??= loadTrack(n).catch((e) => { p = null; throw e; })); }
const stopsOnce = { msl: null as ReturnType<typeof loadStops> | null, m20: null as ReturnType<typeof loadStops> | null };
export const stopsFor = (m: "msl" | "m20") => (stopsOnce[m] ??= loadStops(m).catch((e) => { stopsOnce[m] = null; throw e; }));

const IMAGERY_LABEL: Record<(typeof IMAGERY)[number], { label: string; sourceId: string; note: string }> = {
  ctx: { label: LIVE.ctx.label, sourceId: LIVE.ctx.sourceId, note: LIVE.ctx.note },
  viking: { label: LIVE.viking.label, sourceId: LIVE.viking.sourceId, note: LIVE.viking.note },
  "themis-day": { label: LIVE["themis-day"].label, sourceId: LIVE["themis-day"].sourceId, note: LIVE["themis-day"].note },
  "themis-night": { label: LIVE["themis-night"].label, sourceId: LIVE["themis-night"].sourceId, note: LIVE["themis-night"].note },
  offline: { label: "Offline: our own copy", sourceId: "DATA-22b", note: "Viking colour, MOLA-HRSC terrain and the 25 cm Gale mosaic, cached on this device" },
};

export function ExploreScene() {
  const { s, set } = useApp();
  const { data, globe } = useRuntime();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<LatLon | null>(null);
  const [view, setView] = useState({ heading: 0, aboveGround: 0 });
  const [measuring, setMeasuring] = useState(false);
  const [pts, setPts] = useState<LatLon[]>([]);
  const [trackState, setTrackState] = useState<"loading" | "ok" | "error">("loading");
  const [liveFail, setLiveFail] = useState(0);
  const measuringRef = useRef(measuring);
  measuringRef.current = measuring;

  const results = useMemo(() => searchPlaces(q, data.places), [q, data.places]);
  const selected = s.place ? data.places.find((p) => p.id === s.place) ?? null : null;
  const lander = selected?.kind === "lander" ? data.landers.find((l) => l.id === selected.id) ?? null : null;

  const flyToPlace = (p: Place) => {
    if (!globe) return;
    const range = p.kind === "lander" ? 40000 : p.kind === "coords" ? 20000 : Math.min(Math.max((p.sizeKm ?? 10) * 2500, 15000), 6e6);
    void globe.flyTo(p.p, range, { pitchDeg: range > 2e6 ? -80 : -50, headingDeg: 0, seconds: 3 });
  };
  const choose = (p: Place) => { set({ place: p.kind === "coords" ? null : p.id }); setQ(""); flyToPlace(p); };

  // Pins, labels, tracks and stops while Explore is open.
  useEffect(() => {
    if (!globe) return;
    globe.setPins(data.landers.map((l) => ({ id: `lander-${l.id}`, p: { lat: l.lat, lon: l.lon }, label: l.name, kind: l.rover ? "rover" as const : "site" as const })));
    if (selected) flyToPlace(selected); else void globe.flyTo(HOME, 9e6, { pitchDeg: -88, headingDeg: 0, seconds: 2.5, noShift: true });
    return () => { globe.setPins([]); globe.setMeasure(null); globe.onSelect(null); globe.onHover(null); };
  }, [globe]);
  useEffect(() => {
    if (!globe) return;
    globe.setLabels(s.labels ? data.places.filter((p) => p.kind === "feature").map((p) => ({ name: p.name, p: p.p, km: p.sizeKm ?? 1 })) : null);
    return () => globe.setLabels(null);
  }, [globe, s.labels]);
  useEffect(() => {
    if (!globe || !s.tracks) return;
    let alive = true;
    setTrackState("loading");
    Promise.all([tracks.msl(), tracks.m20(), tracks.heli(), stopsFor("msl"), stopsFor("m20")]).then(([msl, m20, heli, sm, s2]) => {
      if (!alive) return;
      globe.setTracks([{ id: "msl", lines: msl, color: "--color-track-msl" }, { id: "m20", lines: m20, color: "--color-track-m20" }, { id: "heli", lines: heli, color: "--color-track-heli", width: 2 }]);
      globe.setStops("msl", sm.map((x) => ({ lat: x.lat, lon: x.lon })), "--color-track-msl");
      globe.setStops("m20", s2.map((x) => ({ lat: x.lat, lon: x.lon })), "--color-track-m20");
      setTrackState("ok");
    }).catch(() => alive && setTrackState("error"));
    return () => { alive = false; globe.setTracks([]); globe.setStops("msl", null, ""); globe.setStops("m20", null, ""); };
  }, [globe, s.tracks]);

  // Clicks: a pin selects a place, a rover stop opens Rover view there, bare ground adds a ruler point.
  useEffect(() => {
    if (!globe) return;
    globe.onSelect(async (id, ground) => {
      const l = id.match(/^pin-lander-(.+)$/);
      if (l) { const p = data.places.find((x) => x.id === l[1]); if (p) { set({ place: p.id }); flyToPlace(p); } return; }
      const st = id.match(/^stop-(msl|m20)-(\d+)$/);
      if (st) {
        const m = st[1] as "msl" | "m20", stop = (await stopsFor(m))[Number(st[2])];
        if (stop) set({ rover: { m, site: stop.site, drive: stop.drive }, scene: "relive" });
        return;
      }
      if (measuringRef.current && ground) setPts((x) => [...x, ground].slice(-50));
    });
    globe.onHover(setHover);
  }, [globe, data]);
  useEffect(() => { globe?.setMeasure(pts.length > 1 ? pts : null); }, [globe, pts]);

  // Compass and height above ground follow the camera.
  useEffect(() => {
    if (!globe) return;
    const upd = () => { const c = globe.cam.state(); setView({ heading: c.heading, aboveGround: c.aboveGround }); };
    upd();
    const off = globe.cam.onChange(upd);
    const id = setInterval(() => setLiveFail(globe.liveErrors()), 3000);
    return () => { off(); clearInterval(id); };
  }, [globe]);

  const zoom = (k: number) => globe?.cam.zoom(Math.max(view.aboveGround, 50) * k);
  const northUp = () => globe?.cam.orbit(0, globe.cam.state().pitch);
  const tilt = () => globe && globe.cam.orbit(view.heading, globe.cam.state().pitch > -70 ? -89 : -40);

  // Keyboard, like a map: arrows pan, + and - zoom, N faces north.
  useEffect(() => {
    if (!globe) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("input, textarea, select")) return;
      const a = Math.min(Math.max(view.aboveGround, 100) / MARS_SPHERE_M * 0.4, 0.2);
      const k = e.key;
      if (k === "ArrowLeft") globe.cam.pan(-a, 0); else if (k === "ArrowRight") globe.cam.pan(a, 0);
      else if (k === "ArrowUp") globe.cam.pan(0, a); else if (k === "ArrowDown") globe.cam.pan(0, -a);
      else if (k === "+" || k === "=") zoom(0.4); else if (k === "-") zoom(-0.6);
      else if (k.toLowerCase() === "n") northUp();
      else return;
      e.preventDefault();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [globe, view.aboveGround]);

  const onSearchKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") { setActive((a) => Math.min(a + 1, results.length - 1)); e.preventDefault(); }
    else if (e.key === "ArrowUp") { setActive((a) => Math.max(a - 1, 0)); e.preventDefault(); }
    else if (e.key === "Enter" && results[active]) choose(results[active]!);
    else if (e.key === "Escape") setQ("");
  };

  return (
    <>
      <div className="readout mono" aria-live="off">
        {hover ? <>{fmtLatLon(hover)} <span className="muted">elev</span> {Math.round(globe?.heightAt(hover) ?? 0).toLocaleString("en-US")} m</> : <span className="muted">Point at the ground for coordinates</span>}
        <span className="muted"> | camera {fmtDistance(view.aboveGround)} above ground</span>
      </div>
      <div className="mapnav" role="toolbar" aria-label="Map controls">
        <Tip text="Zoom in (+)"><button className="btn icon" onClick={() => zoom(0.4)} aria-label="Zoom in"><Plus size={18} /></button></Tip>
        <Tip text="Zoom out (-)"><button className="btn icon" onClick={() => zoom(-0.6)} aria-label="Zoom out"><Minus size={18} /></button></Tip>
        <Tip text="Face north (N)"><button className="btn icon" onClick={northUp} aria-label={`Face north; now facing ${Math.round((view.heading + 360) % 360)} degrees`}><Compass size={18} style={{ transform: `rotate(${-view.heading - 45}deg)` }} /></button></Tip>
        <Tip text="Tilt: top-down or perspective"><button className="btn icon" onClick={tilt} aria-label="Tilt the view"><Rotate3d size={18} /></button></Tip>
        <Tip text="Back to Gale Crater"><button className="btn icon" onClick={() => { set({ place: "curiosity" }); void globe?.flyTo(HOME, 60000, { pitchDeg: -50, seconds: 2.5 }); }} aria-label="Fly to Gale Crater"><House size={18} /></button></Tip>
        <Tip text="Measure distance and elevation"><button className="btn icon" aria-pressed={measuring} onClick={() => setMeasuring(!measuring)} aria-label="Measure distance"><Ruler size={18} /></button></Tip>
      </div>

      <aside className="side">
        <section className="panel">
          <h2><Search size={18} aria-hidden />Explore Mars</h2>
          <div className="combo">
            <input type="search" role="combobox" aria-expanded={results.length > 0} aria-controls="place-results" aria-label="Search places, landers or coordinates"
              placeholder="Gale, Olympus Mons, Viking 1, or 18.4 N 77.5 E" value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onSearchKey} />
            {results.length > 0 && (
              <ul id="place-results" role="listbox" className="results">
                {results.map((r, i) => (
                  <li key={r.id} role="option" aria-selected={i === active}><button onClick={() => choose(r)} onMouseEnter={() => setActive(i)}>
                    <span>{r.name}</span><small className="muted">{r.detail}</small></button></li>
                ))}
              </ul>
            )}
          </div>
          <p className="muted" style={{ fontSize: "var(--text-xs)", margin: "var(--space-2) 0 0" }}>{data.places.length.toLocaleString("en-US")} places: every landing site and every IAU-approved name <SourceLink id="USGS-GAZETTEER" data={data} />. Drag to turn, scroll to zoom, right-drag to tilt.</p>
        </section>

        {selected && (lander ? <LanderCard l={lander} /> : (
          <section className="panel">
            <h2><Crosshair size={18} aria-hidden />{selected.name}</h2>
            <div className="facts">
              <span className="fact-label">Type</span><span className="fact-value">{selected.detail}</span>
              <span className="fact-label">Centre</span><span className="fact-value"><span className="mono">{fmtLatLon(selected.p)}</span><Badge b="STANDARD" /><SourceLink id="USGS-GAZETTEER" data={data} /></span>
              <GroundDetail p={selected.p} />
            </div>
          </section>
        ))}

        <section className="panel">
          <h2><Footprints size={18} aria-hidden />Where we have landed</h2>
          <ul className="list">
            {[...data.landers].sort((a, b) => (b.rover ? 1 : 0) - (a.rover ? 1 : 0) || a.landedUtc.localeCompare(b.landedUtc)).map((l) => (
              <li key={l.id}><button aria-pressed={s.place === l.id} onClick={() => { const p = data.places.find((x) => x.id === l.id)!; set({ place: l.id }); flyToPlace(p); }}>
                <span>{l.name}</span><small className="muted">{l.agency}, {l.landedUtc.slice(0, 4)}{l.rover ? ", street view" : ""}</small></button></li>
            ))}
          </ul>
        </section>

        <section className="panel">
          <h2><Layers size={18} aria-hidden />Layers</h2>
          <div role="radiogroup" aria-label="Ground imagery" className="radios">
            {IMAGERY.map((id) => (
              <label key={id}><input type="radio" name="imagery" checked={s.imagery === id} onChange={() => set({ imagery: id })} />
                <span><b>{IMAGERY_LABEL[id].label}</b> <SourceLink id={IMAGERY_LABEL[id].sourceId} data={data} /><br /><small className="muted">{IMAGERY_LABEL[id].note}</small></span></label>
            ))}
          </div>
          <label className="check"><input type="checkbox" checked={s.hirise} onChange={(e) => set({ hirise: e.target.checked })} />HiRISE patches, about 25 cm <SourceLink id="ONMARS-HIRISE" data={data} /></label>
          <label className="check"><input type="checkbox" checked={s.labels} onChange={(e) => set({ labels: e.target.checked })} />Place names</label>
          <label className="check"><input type="checkbox" checked={s.tracks} onChange={(e) => set({ tracks: e.target.checked })} />Rover tracks and stops, Ingenuity flights</label>
          {s.tracks && (
            <div className="legend" style={{ marginTop: "var(--space-2)" }}>
              <span><i className="sw" style={{ background: "var(--color-track-msl)" }} />Curiosity <SourceLink id="MMGIS-MSL-TRAVERSE" data={data} /></span>
              <span><i className="sw" style={{ background: "var(--color-track-m20)" }} />Perseverance <SourceLink id="MMGIS-M20-TRAVERSE" data={data} /></span>
              <span><i className="sw" style={{ background: "var(--color-track-heli)" }} />Ingenuity <SourceLink id="MMGIS-M20-HELI" data={data} /></span>
              {trackState === "loading" && <span className="muted">loading tracks</span>}
              {trackState === "error" && <span role="alert">Tracks could not load</span>}
            </div>
          )}
          {s.tracks && <p className="muted" style={{ fontSize: "var(--text-xs)" }}>Zoom in on a track: each dot is a rover stop. Click one to stand there in Rover view.</p>}
          {s.imagery !== "offline" && liveFail > 20 && <p role="status" style={{ fontSize: "var(--text-xs)" }}>Some live tiles did not load ({liveFail}); the globe falls back to our offline imagery there.</p>}
        </section>

        {(measuring || pts.length > 0) && <MeasurePanel pts={pts} onClear={() => setPts([])} measuring={measuring} onDone={() => { setMeasuring(false); toast("Ruler off"); }} />}
      </aside>
    </>
  );
}

const fmtDistance = (m: number) => (Math.abs(m) >= 10000 ? `${(m / 1000).toLocaleString("en-US", { maximumFractionDigits: 0 })} km` : `${Math.round(m).toLocaleString("en-US")} m`);

/** The finest terrain we have under a point, so every place states how closely you can look (research 12.8). */
function GroundDetail({ p }: { p: LatLon }) {
  const { data } = useRuntime();
  const lay = data.layers.terrain.filter((l) => p.lon >= l.west && p.lon <= l.east && p.lat >= l.south && p.lat <= l.north)
    .sort((a, b) => (a.east - a.west) / a.cols - (b.east - b.west) / b.cols)[0];
  if (!lay) return null;
  const cellM = ((lay.east - lay.west) / lay.cols) * Math.PI / 180 * MARS_SPHERE_M * Math.cos(p.lat * Math.PI / 180);
  const level = cellM < 3 ? "Walk: metre-scale terrain" : cellM < 300 ? "Hike: terrain at tens to hundreds of metres" : "Fly over: planet-scale terrain";
  return (
    <>
      <span className="fact-label">Terrain here</span>
      <span className="fact-value"><span>{level} ({fmtDistance(cellM)} cells)</span><Badge b="COMPUTED" />{lay.sourceIds.map((id) => <SourceLink key={id} id={id} data={data} />)}</span>
    </>
  );
}

function LanderCard({ l }: { l: Lander }) {
  const { set } = useApp();
  const { data } = useRuntime();
  return (
    <section className="panel">
      <h2><Mountain size={18} aria-hidden />{l.name}</h2>
      <p className="muted" style={{ fontSize: "var(--text-sm)", marginTop: 0 }}>{l.agency} {l.kind}. {l.note}.</p>
      <div className="facts">
        <span className="fact-label">Landed (UTC)</span><span className="fact-value"><span className="mono">{l.landedUtc}</span><Badge b="MEASURED" />{l.sourceIds.slice(-1).map((id) => <SourceLink key={id} id={id} data={data} />)}</span>
        <span className="fact-label">Position (planetocentric)</span><span className="fact-value"><span className="mono">{fmtLatLon({ lat: l.lat, lon: l.lon })}</span><Badge b={l.badge} />{l.sourceIds.map((id) => <SourceLink key={id} id={id} data={data} />)}</span>
        <GroundDetail p={{ lat: l.lat, lon: l.lon }} />
      </div>
      <div className="row" style={{ marginTop: "var(--space-3)" }}>
        {l.rover && <button className="btn primary" onClick={() => set({ rover: { m: l.rover!, site: 0, drive: 0 }, scene: "relive" })}><Camera size={16} aria-hidden />{ROVER[l.rover].name} street view</button>}
        {l.id === "curiosity" && <button className="btn" onClick={() => set({ zone: "gale", scene: "plan" })}><Footprints size={16} aria-hidden />Plan a Marswalk here</button>}
      </div>
      {!l.rover && <p className="muted" style={{ fontSize: "var(--text-xs)" }}>No public record gives this mission's camera pointing, so there is no street view here; its photos are in the mission archive linked above.</p>}
    </section>
  );
}

function MeasurePanel({ pts, measuring, onClear, onDone }: { pts: LatLon[]; measuring: boolean; onClear: () => void; onDone: () => void }) {
  const { data, globe } = useRuntime();
  const legs = pts.slice(1).map((p, i) => haversineM(pts[i]!, p));
  const total = legs.reduce((a, b) => a + b, 0);
  // Elevation profile: 64 samples along the line from our terrain (the finest layer at each point).
  const prof = useMemo(() => {
    if (!globe || pts.length < 2 || total === 0) return [];
    const out: { d: number; h: number }[] = [];
    for (let k = 0; k <= 64; k++) {
      let d = (k / 64) * total, i = 0;
      while (i < legs.length - 1 && d > legs[i]!) { d -= legs[i]!; i++; }
      const f = legs[i]! ? d / legs[i]! : 0, a = pts[i]!, b = pts[i + 1]!;
      const p = { lat: a.lat + (b.lat - a.lat) * f, lon: a.lon + (b.lon - a.lon) * f };
      out.push({ d: (k / 64) * total, h: globe.heightAt(p) });
    }
    return out;
  }, [globe, pts]);
  const lo = Math.min(...prof.map((x) => x.h)), hi = Math.max(...prof.map((x) => x.h));
  const climb = prof.slice(1).reduce((a, x, i) => a + Math.max(0, x.h - prof[i]!.h), 0), drop = prof.slice(1).reduce((a, x, i) => a + Math.max(0, prof[i]!.h - x.h), 0);
  return (
    <section className="panel">
      <h2><Ruler size={18} aria-hidden />Measure</h2>
      {pts.length < 2 ? <p className="muted">{measuring ? "Click the ground to add points." : "Turn the ruler on to measure."}</p> : (
        <>
          <div className="facts">
            <span className="fact-label">Distance</span><span className="fact-value"><span className="mono">{fmtDistance(total)}</span><Badge b="COMPUTED" /></span>
            <span className="fact-label">Climb / descent</span><span className="fact-value"><span className="mono">+{Math.round(climb)} m / -{Math.round(drop)} m</span><Badge b="MEASURED" /><SourceLink id="DATA-21" data={data} /></span>
            <span className="fact-label">Lowest / highest</span><span className="fact-value mono">{Math.round(lo).toLocaleString("en-US")} m / {Math.round(hi).toLocaleString("en-US")} m</span>
          </div>
          <svg className="profile" viewBox="0 0 300 80" role="img" aria-label={`Elevation profile from ${Math.round(lo)} to ${Math.round(hi)} metres over ${fmtDistance(total)}`}>
            <polyline fill="none" stroke="var(--color-measure)" strokeWidth="2" points={prof.map((x) => `${(x.d / total) * 300},${76 - ((x.h - lo) / Math.max(hi - lo, 1)) * 72}`).join(" ")} />
          </svg>
          <p className="muted" style={{ fontSize: "var(--text-xs)" }}>Great-circle distance on the 3,396.19 km sphere; heights from the finest terrain loaded here (HiRISE at Gale, MOLA-HRSC elsewhere), relative to the areoid.</p>
        </>
      )}
      <div className="row">
        <button className="btn" onClick={onClear} disabled={!pts.length}><Trash2 size={16} aria-hidden />Clear</button>
        {measuring && <button className="btn" onClick={onDone}>Done</button>}
      </div>
    </section>
  );
}
