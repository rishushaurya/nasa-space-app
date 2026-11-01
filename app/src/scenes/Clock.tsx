// Homeward | app/src/scenes/Clock.tsx | v1.0.0 | 2026-10-29
// Scene 0: Mars right now, computed with the Mars24 algorithm and JPL planetary elements (all LIVE).
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { earthElongation, lightTimeMin } from "../core/ephemeris";
import { LANDINGS, localSolar, marsTime, marsYear, nextSunEvent, seasonName, solNumber } from "../core/mars-time";
import { useApp } from "../state";
import { useRuntime } from "../runtime";
import { Badge, fmtClock, fmtIst, fmtUtc } from "../ui/ui";

const GALE = { lat: -4.5895, lon: 137.4417 };

export function useNow(ms = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), ms); return () => clearInterval(id); }, [ms]);
  return now;
}

export function ClockScene() {
  const { set } = useApp();
  const { globe } = useRuntime();
  const now = useNow();
  const m = marsTime(now), lt = localSolar(now, GALE.lon).ltstH;
  const rise = nextSunEvent(now, GALE.lat, GALE.lon, "rise"), sset = nextSunEvent(now, GALE.lat, GALE.lon, "set");
  const delay = lightTimeMin(now), el = earthElongation(now);

  useEffect(() => {
    if (!globe) return;
    globe.setSun(now);
    const c = globe.viewer.camera;
    const spin = () => c.rotate(c.constrainedAxis ?? c.up, -0.0008);
    // Look at the sunlit side: the camera sits above the subsolar point, shifted towards the evening terminator.
    const sub = { lat: marsTime(now).declDeg, lon: -marsTime(now).subsolarLonWDeg + 35 };
    void globe.flyTo(sub, 1.5e7, { pitchDeg: -90, seconds: 0, noShift: true });
    const id = setInterval(spin, 30);
    return () => clearInterval(id);
  }, [globe]);

  const kpis: [string, string, string?][] = [
    ["Mars Year", `MY ${marsYear(now)}`, `Ls ${m.lsDeg.toFixed(1)} deg, ${seasonName(m.lsDeg)}`],
    ["Gale local solar time", fmtClock(lt), `LMST ${fmtClock(localSolar(now, GALE.lon).lmstH)}`],
    ["Next sunrise at Gale", fmtUtc(rise), fmtIst(rise)],
    ["Next sunset at Gale", fmtUtc(sset), fmtIst(sset)],
    ["Curiosity", `sol ${solNumber(now, LANDINGS.curiosity.utcMs, LANDINGS.curiosity.lonE)}`, `Perseverance sol ${solNumber(now, LANDINGS.perseverance.utcMs, LANDINGS.perseverance.lonE)}`],
    ["Radio delay to Earth", `${delay.toFixed(2)} min`, `${(2 * delay).toFixed(1)} min round trip`],
  ];

  return (
    <section className="center-card panel" aria-labelledby="clock-title">
      <h1 id="clock-title" className="hero-title">Homeward</h1>
      <p className="hero-sub">Plan a Marswalk that gets you home. This is Mars right now, computed from NASA's published algorithms.</p>
      <div className="kpis">
        {kpis.map(([k, v, sub]) => (
          <div className="kpi" key={k}>
            <div className="k">{k}<Badge b="LIVE" /></div>
            <div className="v">{v}</div>
            {sub && <div className="muted mono" style={{ fontSize: "var(--text-xs)" }}>{sub}</div>}
          </div>
        ))}
      </div>
      <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
        Earth is {el.deg.toFixed(1)} deg {el.east ? "east of the Sun: an evening star after sunset" : "west of the Sun: a morning star before sunrise"}. Sun {m.sunDistAu.toFixed(3)} AU away.
      </p>
      <div className="row">
        <button className="btn primary" onClick={() => set({ scene: "orbit" })} autoFocus>Fly to Mars <ArrowRight size={16} aria-hidden /></button>
        <button className="btn" onClick={() => set({ scene: "explore" })}>Explore the map</button>
        <button className="btn" onClick={() => set({ scene: "relive" })}>Rover street view</button>
        <button className="btn" onClick={() => set({ scene: "plan" })}>Skip to the planner</button>
      </div>
    </section>
  );
}
