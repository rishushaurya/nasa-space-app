// Homeward | app/src/scenes/Briefing.tsx | v3.0.0 | 2026-11-13
// Scene 4: what is LIVE, what is MEASURED, what is a STANDARD limit. Weather is never live (WX-04).
import { useEffect, useState } from "react";
import { ArrowRight, CloudSun, Radiation, Shield, Sun, SunMedium, Thermometer } from "lucide-react";
import { lightTimeMin } from "../core/ephemeris";
import { localSolar, nextSunEvent, sunPosition } from "../core/mars-time";
import { useApp } from "../state";
import { useRuntime } from "../runtime";
import { ZONES } from "../sites";
import { useNow } from "./Clock";
import { Badge, FactRow, LiveRow, Panel, SourceLink, fmtClock, fmtIst, fmtUtc, type PanelState } from "../ui/ui";
import { donkiMs, loadRems, loadSpaceWeather, type RemsSol, type SpaceWeather } from "../core/conditions";
import { incidentId, type Data } from "../data/load";

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
      <LatestWeather data={data} />
      <SpaceWeatherPanel data={data} now={now} />
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

/** One loader for both live panels: retry on demand, abort on unmount. */
function useLoad<T>(load: (signal: AbortSignal) => Promise<T>, what: string): PanelState<T> {
  const [st, setSt] = useState<PanelState<T>>({ kind: "loading" });
  const [n, setN] = useState(0);
  useEffect(() => {
    const ac = new AbortController();
    setSt({ kind: "loading" });
    load(ac.signal).then((d) => setSt({ kind: "ok", data: d }))
      .catch((e) => { if (e.name !== "AbortError") setSt({ kind: "error", message: `${what} did not answer (${e.message}).`, incident: incidentId(), retry: () => setN((k) => k + 1) }); });
    return () => ac.abort();
  }, [n]);
  return st;
}

const fmtC = (v: number | null) => (v === null ? "--" : `${v} C`);

/** The newest sol Curiosity's REMS station has released: measured, dated, never called live (WX-04). */
function LatestWeather({ data }: { data: Data }) {
  const st = useLoad<RemsSol>(loadRems, "NASA's Curiosity weather feed");
  return (
    <Panel title="Latest measured weather at Gale" icon={<CloudSun size={18} aria-hidden />} state={st} lines={4}>
      {(w) => (
        <>
          <p className="muted" style={{ fontSize: "var(--text-sm)", marginTop: 0 }}>Curiosity's REMS station, sol {w.sol} ({w.earthDate}), {Math.round((Date.now() - Date.parse(w.earthDate)) / 86400000)} days ago: the newest sol NASA has released.</p>
          <div className="facts">
            <LiveRow label="Air temperature" value={`${fmtC(w.minC)} to ${fmtC(w.maxC)}`} badge="MEASURED" />
            <LiveRow label="Ground temperature" value={`${fmtC(w.groundMinC)} to ${fmtC(w.groundMaxC)}`} badge="MEASURED" />
            <LiveRow label="Air pressure" value={w.pressurePa === null ? "--" : `${w.pressurePa} Pa`} badge="MEASURED" />
            <LiveRow label="UV index (local)" value={w.uv ?? "--"} badge="MEASURED" />
            <LiveRow label="Sky" value={w.sky ?? "--"} badge="MEASURED" />
            {w.ls !== null && <LiveRow label="Season (Ls)" value={`${w.ls} deg`} badge="MEASURED" />}
          </div>
          <p className="muted" style={{ fontSize: "var(--text-xs)", marginBottom: 0 }}>Source <SourceLink id="MSL-REMS-FEED" data={data} />. Gale is the only walk site with a weather station; elsewhere the archive is all there is.</p>
        </>
      )}
    </Panel>
  );
}

/** Coronal mass ejections that NASA's WSA-ENLIL model runs predict will reach Mars (last 30 days and upcoming). */
function SpaceWeatherPanel({ data, now }: { data: Data; now: number }) {
  const st = useLoad<SpaceWeather>(loadSpaceWeather, "NASA's space weather service");
  return (
    <Panel title="Space weather at Mars" icon={<SunMedium size={18} aria-hidden />} state={st} lines={3}>
      {(sw) => {
        const next = sw.arrivals.filter((a) => donkiMs(a.arrivalUtc) > now).sort((a, b) => a.arrivalUtc.localeCompare(b.arrivalUtc))[0];
        return (
          <>
            {next
              ? <p role="status"><b>Solar storm predicted at Mars:</b> <span className="mono">{next.arrivalUtc.replace("T", " ")} UTC</span>, {next.glancing ? "a glancing blow" : "a direct hit"}{next.speedKmS ? `, launched at ${next.speedKmS} km/s` : ""} <Badge b="MODELLED" />. Check the walk-back time to shelter before an EVA on that sol.</p>
              : <p className="muted" style={{ marginTop: 0 }}>No coronal mass ejection is predicted to reach Mars from now on.</p>}
            <div className="facts">
              <span className="fact-label">Predicted arrivals at Mars, last 30 days</span><span className="fact-value"><span className="mono">{sw.arrivals.length}</span><Badge b="MODELLED" /><SourceLink id="NASA-DONKI" data={data} /></span>
              {sw.arrivals.slice(0, 4).flatMap((a) => [
                <span key={`l${a.arrivalUtc}`} className="fact-label">{a.glancing ? "Glancing blow" : "Hit"}{a.speedKmS ? `, ${a.speedKmS} km/s` : ""}</span>,
                <span key={`v${a.arrivalUtc}`} className="fact-value"><span className="mono">{a.arrivalUtc.replace("T", " ")}</span>{a.link && <a className="src" href={a.link} target="_blank" rel="noreferrer noopener">model run</a>}</span>,
              ])}
            </div>
            <p className="muted" style={{ fontSize: "var(--text-xs)", marginBottom: 0 }}>Predictions from NASA's Community Coordinated Modeling Center (WSA-ENLIL runs in DONKI), checked {new Date(sw.fetchedUtc).toISOString().slice(0, 16).replace("T", " ")} UTC. A CME can bring energetic particles; the walk&apos;s solar-storm drill uses the dose RAD measured in May 2024.</p>
          </>
        );
      }}
    </Panel>
  );
}
