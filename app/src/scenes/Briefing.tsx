// Homeward | app/src/scenes/Briefing.tsx | v1.0.0 | 2026-10-29
// Scene 4: what is LIVE, what is MEASURED, what is a STANDARD limit. Weather is never live (WX-04).
import { useEffect } from "react";
import { ArrowRight, Radiation, Shield, Sun, Thermometer } from "lucide-react";
import { lightTimeMin } from "../core/ephemeris";
import { localSolar, nextSunEvent, sunPosition } from "../core/mars-time";
import { useApp } from "../state";
import { useRuntime } from "../runtime";
import { ZONES } from "../sites";
import { useNow } from "./Clock";
import { FactRow, LiveRow, fmtClock, fmtIst, fmtUtc } from "../ui/ui";

export function BriefingScene() {
  const { s, set } = useApp();
  const { data, globe } = useRuntime();
  const now = useNow(5000);
  const z = ZONES[s.zone];
  useEffect(() => {
    if (!globe) return;
    globe.setSun(now);
    globe.setPins([{ id: "home", p: z.home, label: z.homeName, kind: "home" }, { id: "stop", p: z.stop, label: z.stopName, kind: "stop" }]);
    void globe.flyTo(z.home, 900, { pitchDeg: -30, headingDeg: 80, seconds: 2.5 });
  }, [globe, s.zone]);
  const sp = sunPosition(now, z.home.lat, z.home.lon);
  const set_ = nextSunEvent(now, z.home.lat, z.home.lon, "set");
  return (
    <aside className="side">
      <section className="panel">
        <h2><Sun size={18} aria-hidden />Right now at {z.short}</h2>
        <div className="facts">
          <LiveRow label="Local true solar time" value={fmtClock(localSolar(now, z.home.lon).ltstH)} />
          <LiveRow label="Sun elevation" value={`${sp.elevationDeg.toFixed(1)} deg`} />
          <LiveRow label="Next sunset" value={`${fmtUtc(set_)} / ${fmtIst(set_)}`} />
          <LiveRow label="Radio delay (one way)" value={`${lightTimeMin(now).toFixed(2)} min`} />
        </div>
      </section>
      <section className="panel">
        <h2><Thermometer size={18} aria-hidden />Conditions (measured, not live)</h2>
        <p className="muted" style={{ fontSize: "var(--text-sm)" }}>Rover weather reaches the public archive long after it is measured, so no app can show live Mars weather.</p>
        <div className="facts"><FactRow id="WX-01" data={data} /><FactRow id="PLN-03" data={data} /><FactRow id="PLN-05" data={data} /><FactRow id="WX-04" data={data} /></div>
        <p className="muted" style={{ fontSize: "var(--text-xs)" }}>Modelled climate for this hour (Mars Climate Database): not included in this build. The LMD web query is scheduled for the data pipeline.</p>
      </section>
      <section className="panel">
        <h2><Radiation size={18} aria-hidden />Radiation and dust</h2>
        <div className="facts"><FactRow id="RAD-01" data={data} /><FactRow id="RAD-03" data={data} /><FactRow id="RAD-07" data={data} /><FactRow id="DUST-01" data={data} /><FactRow id="DUST-03" data={data} /></div>
      </section>
      <section className="panel">
        <h2><Shield size={18} aria-hidden />Suit limits</h2>
        <div className="facts"><FactRow id="EVA-01" data={data} /><FactRow id="EVA-02" data={data} /><FactRow id="EVA-03" data={data} /><FactRow id="EVA-04" data={data} /><FactRow id="SND-01" data={data} /></div>
        <div className="row" style={{ marginTop: "var(--space-3)" }}><button className="btn primary" onClick={() => set({ scene: "plan" })}>Plan the Marswalk <ArrowRight size={16} aria-hidden /></button></div>
      </section>
    </aside>
  );
}
