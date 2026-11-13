// Homeward | app/src/scenes/Relive.tsx | v3.0.0 | 2026-11-13
// Scene 10 and 11 of the research plan: Rover view, a street view built from NASA's own rover photos. Each stop is an
// MMGIS waypoint; each photo is placed by its camera model and the rover's attitude (core/camera.ts) over the 3D
// globe seen from the same spot. Arrows step to the previous and next stop along the real drive.
import { useEffect, useMemo, useRef, useState, type PointerEvent as RPointerEvent } from "react";
import { Camera, ChevronLeft, ChevronRight, ChevronUp, ChevronsLeft, ChevronsRight, Images, Minus, Pause, Play, Plus, Route, X } from "lucide-react";
import { frameCentre, frameMatrix, project } from "../core/camera";
import { bearingDeg, haversineM, type LatLon } from "../core/frames";
import { useApp } from "../state";
import { useRuntime } from "../runtime";
import { placeable, resolveStop, ROVER, stopGallery, stopPhotos, type Frame, type Mission, type Stop, type StopPhotos } from "../rovers/raw";
import { stopsFor } from "./Explore";
import { Badge, FactRow, Panel, SourceLink, Tip, fmtLatLon, type PanelState } from "../ui/ui";
import { incidentId } from "../data/load";

const D2R = Math.PI / 180;
// Featured stops: the demo walk zones and Perseverance's landing site (offline copies exist for these).
const FEATURED: { m: Mission; site: number; drive: number; title: string; sol?: number; facts: string[]; zone?: "gale" | "boxwork" }[] = [
  { m: "msl", site: 6, drive: 0, title: "Yellowknife Bay: John Klein drill site", sol: 182, facts: ["SITE-06", "SCI-01", "SCI-02"], zone: "gale" },
  { m: "msl", site: 26, drive: 184, title: "Dingo Gap", sol: 528, facts: ["SITE-08", "SITE-09"] },
  { m: "msl", site: 120, drive: 0, title: "Boxwork ridges on Mount Sharp", sol: 4709, facts: ["SITE-11", "SCI-05"], zone: "boxwork" },
  { m: "m20", site: 3, drive: 0, title: "Octavia E. Butler Landing, Jezero", facts: [] },
];
const utcMs = (s: string | null) => (s ? Date.parse(/[zZ]|[+-]\d\d:?\d\d$/.test(s) ? s : `${s}Z`) : NaN);
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export function ReliveScene() {
  const { s, set } = useApp();
  const { data, globe } = useRuntime();
  const m = s.rover.m;
  const [stops, setStops] = useState<PanelState<Stop[]>>({ kind: "loading" });
  const [photos, setPhotos] = useState<PanelState<StopPhotos>>({ kind: "loading" });
  const [view, setView] = useState({ yaw: 0, pitch: -10, fov: 70 });
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight });
  const [loaded, setLoaded] = useState<Set<string>>(new Set());
  const [gallery, setGallery] = useState<{ frames: Frame[]; more: boolean; page: number; state: "idle" | "loading" | "error" }>({ frames: [], more: false, page: 0, state: "idle" });
  const [open, setOpen] = useState<number | null>(null);
  const [n, setN] = useState(0); // retry counter
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    setStops({ kind: "loading" });
    stopsFor(m).then((x) => alive && setStops({ kind: "ok", data: x }))
      .catch((e) => alive && setStops({ kind: "error", message: `Rover stops could not load: ${e.message}`, incident: incidentId(), retry: () => setN((k) => k + 1) }));
    return () => { alive = false; };
  }, [m, n]);
  const list = stops.kind === "ok" ? stops.data : [];
  const i = list.length ? resolveStop(list, s.rover.site, s.rover.drive, m) : -1;
  const stop = list[i], prev = list[i - 1], next = list[i + 1];
  const go = (k: number) => { const t = list[clamp(k, 0, list.length - 1)]; if (t) set({ rover: { m, site: t.site, drive: t.drive } }); };

  // Photos for this stop, live from NASA (offline copy for featured stops).
  useEffect(() => {
    if (!stop) return;
    const ac = new AbortController();
    setPhotos({ kind: "loading" }); setLoaded(new Set()); setGallery({ frames: [], more: false, page: 0, state: "idle" }); setOpen(null);
    stopPhotos(m, list, i, ac.signal).then((p) => setPhotos(p.placed.length ? { kind: "ok", data: p }
      : { kind: "empty", message: p.frames.length ? "NASA's records for this stop have photos but none with a camera model, so none can be placed. The film strip has them all." : "No Navcam or Mastcam-Z photos were recorded at this stop. Step to the next stop or open the film strip." }))
      .catch((e) => { if (e.name !== "AbortError") setPhotos({ kind: "error", message: `NASA's raw-image service did not answer (${e.message}). Featured stops work offline.`, incident: incidentId(), retry: () => setN((k) => k + 1) }); });
    return () => ac.abort();
  }, [stop?.site, stop?.drive, m, n]);
  // First arrival faces the way the rover faced (MMGIS yaw); later steps keep your heading, as in a street view.
  const faced = useRef(false);
  useEffect(() => { if (stop && !faced.current) { faced.current = true; setView((v) => ({ ...v, yaw: stop.yaw })); } }, [stop]);

  const placed = photos.kind === "ok" ? photos.data.placed : [];
  const camH = useMemo(() => {
    const zs = placed.map((f) => -f.model!.c[2]).filter((z) => z > 0.5 && z < 3).sort((a, b) => a - b);
    return zs.length ? zs[zs.length >> 1]! : null;
  }, [placed]);
  // Photos load where you look first: a frame is fetched once its centre comes within 100 deg of the view.
  const centres = useMemo(() => placed.map((f) => frameCentre(f.model!, f.att!, f.w, f.h)), [placed]);
  const [wanted, setWanted] = useState<Set<string>>(new Set());
  useEffect(() => setWanted(new Set()), [placed]);
  useEffect(() => {
    const cosMax = Math.cos(100 * D2R), se = Math.sin(view.pitch * D2R), ce = Math.cos(view.pitch * D2R);
    const add = placed.filter((f, k) => !wanted.has(f.id) && se * Math.sin(centres[k]!.el * D2R) + ce * Math.cos(centres[k]!.el * D2R) * Math.cos((centres[k]!.az - view.yaw) * D2R) > cosMax);
    if (add.length) setWanted((w) => new Set([...w, ...add.map((f) => f.id)]));
  }, [placed, centres, view.yaw, view.pitch]);

  // The 3D globe sees from the same spot, so gaps between photos show the real terrain and sky.
  useEffect(() => {
    if (!globe) return;
    const ctl = globe.viewer.scene.screenSpaceCameraController;
    ctl.enableInputs = false;
    return () => { ctl.enableInputs = true; globe.setFov(60); globe.setPins([]); globe.setSun(Date.now()); };
  }, [globe]);
  useEffect(() => {
    if (!globe || !stop) return;
    globe.eye({ lat: stop.lat, lon: stop.lon }, view.yaw, view.pitch, camH ?? 2);
    globe.setFov(view.fov);
  }, [globe, stop, view, camH]);
  useEffect(() => { const t = placed.map((f) => utcMs(f.utc)).find(Number.isFinite); if (globe && t) globe.setSun(t); }, [globe, placed]);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => e && setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    if (el.current) ro.observe(el.current);
    return () => ro.disconnect();
  }, []);

  // Drag to look, wheel to zoom, keys to turn and step.
  const drag = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(null);
  const big = Math.max(size.w, size.h), persp = big / 2 / Math.tan((view.fov / 2) * D2R), degPx = view.fov / big;
  const onDown = (e: RPointerEvent) => { (e.target as HTMLElement).setPointerCapture?.(e.pointerId); drag.current = { x: e.clientX, y: e.clientY, yaw: view.yaw, pitch: view.pitch }; };
  const onMove = (e: RPointerEvent) => { const d = drag.current; if (d) setView((v) => ({ ...v, yaw: (d.yaw - (e.clientX - d.x) * degPx + 360) % 360, pitch: clamp(d.pitch + (e.clientY - d.y) * degPx, -85, 85) })); };
  const zoom = (k: number) => setView((v) => ({ ...v, fov: clamp(v.fov * k, 12, 100) }));
  const nb = [prev && { s: prev, k: i - 1, dir: "back" }, next && { s: next, k: i + 1, dir: "forward" }].filter(Boolean) as { s: Stop; k: number; dir: string }[];
  const arrows = stop ? nb.map((x) => ({ ...x, d: haversineM(stop, x.s), b: haversineM(stop, x.s) > 0.3 ? bearingDeg(stop, x.s) : (x.dir === "forward" ? stop.yaw : stop.yaw + 180) })) : [];
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest?.("input, textarea, select") || open !== null) return;
      const ahead = arrows.slice().sort((a, b) => Math.abs(((a.b - view.yaw + 540) % 360) - 180) - Math.abs(((b.b - view.yaw + 540) % 360) - 180)); // most ahead first
      if (e.key === "ArrowLeft") setView((v) => ({ ...v, yaw: (v.yaw + 350) % 360 }));
      else if (e.key === "ArrowRight") setView((v) => ({ ...v, yaw: (v.yaw + 10) % 360 }));
      else if (e.key === "ArrowUp" && ahead[0]) go(ahead[0].k);
      else if (e.key === "ArrowDown" && ahead[ahead.length - 1]) go(ahead[ahead.length - 1]!.k);
      else if (e.key === "PageUp") go(i + 1); else if (e.key === "PageDown") go(i - 1);
      else if (e.key === "+" || e.key === "=") zoom(0.85); else if (e.key === "-") zoom(1.18);
      else return;
      e.preventDefault();
    };
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [arrows, view.yaw, i, open]);

  // The ride (PLAN-3 D26): step to the next stop a few seconds after this stop's photos are in, facing the way the
  // rover drove, like a street-view drive. Stops at the last stop; a stop without photos waits the same time.
  const [ride, setRide] = useState(false);
  const [dwell, setDwell] = useState(6);
  const settled = photos.kind !== "loading" && (photos.kind !== "ok" || loaded.size >= wanted.size);
  useEffect(() => {
    if (!ride || !stop || photos.kind === "loading") return;
    if (!next) { setRide(false); return; }
    const t = setTimeout(() => {
      if (haversineM(stop, next) > 0.3) setView((v) => ({ ...v, yaw: bearingDeg(stop, next) }));
      go(i + 1);
    }, (settled ? dwell : dwell + 8) * 1000); // photos still arriving: wait a little longer, then move on anyway
    return () => clearTimeout(t);
  }, [ride, photos.kind, settled, i, dwell]);

  const loadGallery = (page: number) => {
    if (!stop) return;
    setGallery((g) => ({ ...g, state: "loading" }));
    stopGallery(m, list, i, page, new AbortController().signal)
      .then((r) => setGallery((g) => ({ frames: page === 0 ? r.frames : [...g.frames, ...r.frames], more: r.more, page, state: "idle" })))
      .catch(() => setGallery((g) => ({ ...g, state: "error" })));
  };
  const featured = FEATURED.find((f) => f.m === m && stop && f.site === stop.site && f.drive === stop.drive);
  const story = featured?.sol ? data.sols.get(featured.sol) : undefined;
  const compass = (b: number) => ["north", "north-east", "east", "south-east", "south", "south-west", "west", "north-west"][Math.round(((b % 360) + 360) % 360 / 45) % 8];

  return (
    <>
      <div ref={el} className="pano" style={{ perspective: `${persp}px` }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={() => (drag.current = null)} onPointerCancel={() => (drag.current = null)}
        onWheel={(e) => zoom(Math.exp(e.deltaY * 0.001))} role="application" aria-roledescription="360 degree rover view"
        aria-label={stop ? `${ROVER[m].name} at stop ${i + 1} of ${list.length}, sol ${stop.sol}, facing ${compass(view.yaw)}. Drag or use arrow keys to look; up arrow steps forward.` : "Rover view loading"}>
        <div className="pano-cam" style={{ transform: `translateZ(${persp}px) rotateX(${view.pitch}deg) rotateY(${view.yaw}deg)` }}>
          {placed.map((f, k) => wanted.has(f.id) && (
            <img key={f.id} src={f.src} alt="" width={f.w} height={f.h} draggable={false} referrerPolicy="no-referrer"
              className={loaded.has(f.id) ? "on" : undefined} onLoad={() => setLoaded((x) => new Set(x).add(f.id))}
              // Narrow cameras sit a little nearer so they draw over Navcam where they overlap.
              style={{ width: f.w, height: f.h, transform: `matrix3d(${frameMatrix(f.model!, f.att!, f.w, f.h, f.cam.startsWith("NAV") ? 1000 - k * 0.01 : 960 - k * 0.01).map((v) => v.toFixed(6)).join(",")})` }} />
          ))}
        </div>
        {stop && arrows.map((a) => {
          if (a.d < 0.3) return null;
          const at = project(a.b, -Math.atan2(camH ?? 2, a.d) / D2R, view.yaw, view.pitch, view.fov, big);
          return at && Math.abs(at.x) < size.w / 2 && Math.abs(at.y) < size.h / 2 ? (
            <button key={a.k} className="pano-marker" style={{ left: size.w / 2 + at.x, top: size.h / 2 + at.y }} onClick={() => go(a.k)} onPointerDown={(e) => e.stopPropagation()}>Sol {a.s.sol}, {a.d < 1000 ? `${Math.round(a.d)} m` : `${(a.d / 1000).toFixed(1)} km`}</button>
          ) : null;
        })}
      </div>
      {stop && (
        <div className="pano-arrows" aria-label="Step along the drive">
          {arrows.map((a) => {
            const r = (a.b - view.yaw) * D2R;
            return (
              <Tip key={a.k} text={`${a.dir === "forward" ? "Next" : "Previous"} stop: sol ${a.s.sol}, ${a.d < 0.3 ? "same spot" : `${Math.round(a.d)} m ${compass(a.b)}`}`}>
                <button className="pano-arrow" style={{ left: Math.sin(r) * 120, top: -Math.cos(r) * 48, transform: `rotate(${a.b - view.yaw}deg)` }} onClick={() => go(a.k)}
                  aria-label={`Go ${a.dir} to the stop of sol ${a.s.sol}${a.d >= 0.3 ? `, ${Math.round(a.d)} metres ${compass(a.b)}` : ""}`}><ChevronUp size={30} aria-hidden /></button>
              </Tip>
            );
          })}
        </div>
      )}
      <div className="pano-status" role="status">
        {photos.kind === "loading" && stop && <span className="chip">Fetching {ROVER[m].name}'s photos from NASA</span>}
        {photos.kind === "ok" && loaded.size < wanted.size && <span className="chip">{loaded.size} of {placed.length} photos in place</span>}
      </div>

      {gallery.frames.length > 0 && (
        <div className="strip" role="list" aria-label="All photos from this stop">
          {gallery.frames.map((f, k) => <button key={f.id} role="listitem" onClick={() => setOpen(k)} aria-label={`${f.cam}, sol ${f.sol}`}><img src={f.thumb} alt="" loading="lazy" referrerPolicy="no-referrer" /></button>)}
          {gallery.more && <button className="btn" onClick={() => loadGallery(gallery.page + 1)} disabled={gallery.state === "loading"}>More</button>}
        </div>
      )}
      {open !== null && gallery.frames[open] && <Lightbox frames={gallery.frames} k={open} setK={setOpen} />}

      <aside className="side">
        <Panel title="Rover view" icon={<Camera size={18} aria-hidden />} state={stops} lines={5}>
          {() => (
            <>
              <div className="seg" role="group" aria-label="Rover">
                {(["msl", "m20"] as Mission[]).map((x) => <button key={x} aria-pressed={m === x} onClick={() => { faced.current = false; set({ rover: { m: x, site: 0, drive: 0 } }); }}>{ROVER[x].name}</button>)}
              </div>
              {stop && (
                <div className="facts" style={{ marginTop: "var(--space-3)" }}>
                  <span className="fact-label">Stop</span><span className="fact-value mono">{i + 1} of {list.length.toLocaleString("en-US")}</span>
                  <span className="fact-label">Sol</span><span className="fact-value"><span className="mono">{stop.sol}{next && next.sol !== stop.sol ? ` to ${next.sol}` : ""}</span><Badge b="MEASURED" /></span>
                  <span className="fact-label">Site, drive</span><span className="fact-value mono">{stop.site}, {stop.drive}</span>
                  <span className="fact-label">Position</span><span className="fact-value"><span className="mono">{fmtLatLon(stop)}</span><Badge b="MEASURED" /><SourceLink id={ROVER[m].stopSource} data={data} /></span>
                  <span className="fact-label">Elevation (areoid)</span><span className="fact-value mono">{Math.round(stop.elev).toLocaleString("en-US")} m</span>
                  <span className="fact-label">Driven so far</span><span className="fact-value mono">{stop.distM < 1000 ? `${Math.round(stop.distM)} m` : `${(stop.distM / 1000).toFixed(2)} km`}</span>
                  <span className="fact-label">Rover heading</span><span className="fact-value mono">{Math.round((stop.yaw + 360) % 360)} deg</span>
                  {camH && <><span className="fact-label">Camera height</span><span className="fact-value"><span className="mono">{camH.toFixed(2)} m</span><Badge b="COMPUTED" /><Tip text="From NASA's camera model for these photos: the camera centre above the rover's ground reference"><span className="muted" tabIndex={0}>(i)</span></Tip></span></>}
                </div>
              )}
              <div className="row" style={{ marginTop: "var(--space-3)" }}>
                <Tip text="Back 10 stops"><button className="btn icon" onClick={() => go(i - 10)} disabled={i <= 0} aria-label="Back 10 stops"><ChevronsLeft size={16} /></button></Tip>
                <Tip text="Previous stop (Page Down)"><button className="btn icon" onClick={() => go(i - 1)} disabled={i <= 0} aria-label="Previous stop"><ChevronLeft size={16} /></button></Tip>
                <Tip text="Next stop (Page Up)"><button className="btn icon" onClick={() => go(i + 1)} disabled={i >= list.length - 1} aria-label="Next stop"><ChevronRight size={16} /></button></Tip>
                <Tip text="Forward 10 stops"><button className="btn icon" onClick={() => go(i + 10)} disabled={i >= list.length - 1} aria-label="Forward 10 stops"><ChevronsRight size={16} /></button></Tip>
                <Tip text="Zoom in (+)"><button className="btn icon" onClick={() => zoom(0.8)} aria-label="Zoom in"><Plus size={16} /></button></Tip>
                <Tip text="Zoom out (-)"><button className="btn icon" onClick={() => zoom(1.25)} aria-label="Zoom out"><Minus size={16} /></button></Tip>
              </div>
              <div className="row" style={{ marginTop: "var(--space-2)" }}>
                <button className="btn" aria-pressed={ride} onClick={() => setRide(!ride)} disabled={!next && !ride}>{ride ? <><Pause size={16} aria-hidden />Stop the ride</> : <><Play size={16} aria-hidden />Ride along the drive</>}</button>
                <div className="seg" role="group" aria-label="Seconds at each stop">{[3, 6, 10].map((x) => <button key={x} aria-pressed={dwell === x} onClick={() => setDwell(x)}>{x} s</button>)}</div>
              </div>
              <form className="row" style={{ marginTop: "var(--space-2)" }} onSubmit={(e) => { e.preventDefault(); const sol = Number(new FormData(e.currentTarget).get("sol")); const k = list.findLastIndex((x) => x.sol <= sol); go(k < 0 ? 0 : k); }}>
                <label htmlFor="go-sol" className="muted" style={{ fontSize: "var(--text-sm)" }}>Go to sol</label>
                <input key={stop?.sol} id="go-sol" name="sol" type="number" min={list[0]?.sol ?? 0} max={list[list.length - 1]?.sol ?? 6000} defaultValue={stop?.sol} style={{ width: "7rem" }} />
                <button className="btn" type="submit">Go</button>
              </form>
              {stop && <Minimap stops={list} i={i} yaw={view.yaw} go={go} color={m === "msl" ? "--color-track-msl" : "--color-track-m20"} />}
            </>
          )}
        </Panel>

        <Panel title="Photos at this stop" icon={<Images size={18} aria-hidden />} state={photos} lines={3}>
          {(p) => (
            <>
              <p className="muted" style={{ fontSize: "var(--text-sm)", marginTop: 0 }}>
                {p.placed.length} photos placed from {p.frames.filter(placeable).length} with camera models{p.offline ? ", from this device's offline copy" : ", live from NASA"}.
                {!p.exact && " Some were taken after small moves of the rover's arm or mast counter; they are shown from this stop's position."}
                {p.truncated && " This stop has more photos than shown."}
              </p>
              <p className="muted" style={{ fontSize: "var(--text-xs)" }}>Each photo sits where its camera pointed: NASA's camera model and the rover's attitude, lens distortion ignored <Badge b="COMPUTED" /> <SourceLink id={ROVER[m].rawSource} data={data} />. These are raw images: colour frames are not white-balanced, and exposure differs from frame to frame.</p>
              <div className="row">
                <button className="btn" onClick={() => loadGallery(0)} disabled={gallery.state === "loading"}><Images size={16} aria-hidden />{gallery.frames.length ? "Reload" : "All photos from this stop"}</button>
                {gallery.state === "error" && <span role="alert" className="muted">Could not load the list</span>}
              </div>
            </>
          )}
        </Panel>

        {featured && (
          <section className="panel">
            <h2><Route size={18} aria-hidden />{featured.title}</h2>
            {story && <p style={{ marginTop: 0 }}>{story.story}.</p>}
            {featured.facts.length > 0 && <div className="facts">{featured.facts.map((id) => <FactRow key={id} id={id} data={data} />)}</div>}
            {featured.zone && <button className="btn primary" style={{ marginTop: "var(--space-3)" }} onClick={() => set({ zone: featured.zone!, scene: "plan" })}><Route size={16} aria-hidden />What would a human need here? Plan it</button>}
          </section>
        )}
        <section className="panel">
          <h2>Featured stops</h2>
          <ul className="list">{FEATURED.map((f) => <li key={`${f.m}${f.site}-${f.drive}`}><button aria-pressed={featured === f} onClick={() => set({ rover: { m: f.m, site: f.site, drive: f.drive } })}><span>{f.title}</span><small className="muted">{ROVER[f.m].name}, site {f.site} drive {f.drive}</small></button></li>)}</ul>
        </section>
      </aside>
    </>
  );
}

/** Stops within about 300 m on a local plane: the track, you, which way you face. Click a dot to go there. */
function Minimap({ stops, i, yaw, go, color }: { stops: Stop[]; i: number; yaw: number; go: (k: number) => void; color: string }) {
  const c = stops[i]!, R = 300, k = 100 / R;
  const xy = (p: LatLon) => ({ x: 100 + Math.sin(bearingDeg(c, p) * D2R) * haversineM(c, p) * k, y: 100 - Math.cos(bearingDeg(c, p) * D2R) * haversineM(c, p) * k });
  const near = stops.map((s, j) => ({ s, j })).filter(({ s }) => haversineM(c, s) < R * 1.4);
  return (
    <svg className="minimap" viewBox="0 0 200 200" role="img" aria-label="Map of nearby rover stops; north is up" style={{ marginTop: "var(--space-3)" }}>
      <polyline fill="none" stroke={`var(${color})`} strokeOpacity="0.6" strokeWidth="1.5" points={near.map(({ s }) => { const p = xy(s); return `${p.x},${p.y}`; }).join(" ")} />
      {near.map(({ s, j }) => { const p = xy(s); return <circle key={j} cx={p.x} cy={p.y} r={j === i ? 0 : 3.5} fill="var(--color-text-muted)" onClick={() => go(j)} style={{ cursor: "pointer" }}><title>Sol {s.sol}</title></circle>; })}
      <path d="M100 100 L92 80 A22 22 0 0 1 108 80 Z" fill="var(--color-accent)" fillOpacity="0.8" transform={`rotate(${yaw} 100 100)`} />
      <circle cx="100" cy="100" r="5" fill="var(--color-accent)" />
      <text x="6" y="16" fill="var(--color-text-muted)" fontSize="11">N</text>
      <text x="194" y="194" textAnchor="end" fill="var(--color-text-muted)" fontSize="10">{R} m</text>
    </svg>
  );
}

function Lightbox({ frames, k, setK }: { frames: Frame[]; k: number; setK: (k: number | null) => void }) {
  const f = frames[k]!;
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setK(null);
      else if (e.key === "ArrowRight") setK(Math.min(k + 1, frames.length - 1));
      else if (e.key === "ArrowLeft") setK(Math.max(k - 1, 0));
      else return;
      e.preventDefault(); e.stopPropagation();
    };
    addEventListener("keydown", onKey, true);
    return () => removeEventListener("keydown", onKey, true);
  }, [k, frames.length]);
  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={`${f.cam} image ${f.id}`}>
      <img src={f.big} alt={`${f.cam} image ${f.id}, sol ${f.sol}`} referrerPolicy="no-referrer" />
      <section className="panel">
        <div className="row">
          <b className="grow">{f.cam}, sol {f.sol}</b>
          <button className="btn icon" onClick={() => setK(Math.max(k - 1, 0))} disabled={k === 0} aria-label="Previous photo"><ChevronLeft size={16} /></button>
          <span className="mono muted">{k + 1} / {frames.length}</span>
          <button className="btn icon" onClick={() => setK(Math.min(k + 1, frames.length - 1))} disabled={k === frames.length - 1} aria-label="Next photo"><ChevronRight size={16} /></button>
          <button ref={closeRef} className="btn icon" onClick={() => setK(null)} aria-label="Close"><X size={16} /></button>
        </div>
        <p className="muted mono" style={{ fontSize: "var(--text-xs)", marginBottom: 0 }}>{f.id}{f.lmst ? ` | ${f.lmst}` : ""}{f.utc ? ` | ${f.utc.replace("T", " ").slice(0, 19)} UTC` : ""} | {f.credit} | <a className="src" href={f.link} target="_blank" rel="noreferrer noopener">NASA page</a></p>
      </section>
    </div>
  );
}
