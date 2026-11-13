// Homeward | app/src/ui/ui.tsx | v1.0.0 | 2026-10-29
// Shared UI: four-state Panel, badges with meanings, source links, fact rows, budgets, tooltips, toasts, error boundary.
import { Component, createContext, useContext, useState, type ErrorInfo, type ReactNode, type SyntheticEvent } from "react";
import { createPortal } from "react-dom";
import { CircleCheck, Link as LinkIcon, OctagonX, RotateCw, TriangleAlert } from "lucide-react";
import type { Badge as BadgeT, Data } from "../data/load";
import { incidentId } from "../data/load";

export const BADGE_HELP: Record<BadgeT, string> = {
  LIVE: "Computed from the clock right now with published algorithms.",
  MEASURED: "Measured by an instrument or recorded by a mission.",
  MODELLED: "Model output (climate statistics, or a space-weather model run), not a measurement.",
  COMPUTED: "Our calculation from published inputs, tested against published values.",
  STANDARD: "An agency limit or requirement.",
  ASSUMPTION: "A team choice. You can change it.",
  GENERATED: "A visual made by the app, not data.",
};

// Rendered in <body> with a viewport-clamped position, so tooltips are never clipped by scrolling panels.
const TIP_HALF = 150; // half of .tip-body max-width plus padding
export function Tip({ text, children, below }: { text: string; children: ReactNode; below?: boolean }) {
  const [at, setAt] = useState<DOMRect | null>(null);
  const show = (e: SyntheticEvent<HTMLSpanElement>) => setAt(e.currentTarget.getBoundingClientRect());
  const hide = () => setAt(null);
  const down = below || (at !== null && at.top < 96);
  return (
    <span className="tip" onMouseEnter={show} onMouseLeave={hide} onFocus={show} onBlur={hide} onKeyDown={(e) => e.key === "Escape" && hide()}>
      {children}<span className="sr-only">{text}</span>
      {at && createPortal(
        <span className="tip-body" aria-hidden style={{ left: Math.min(Math.max(at.left + at.width / 2, TIP_HALF + 8), innerWidth - TIP_HALF - 8), top: down ? at.bottom + 8 : at.top - 8, transform: `translate(-50%, ${down ? "0" : "-100%"})` }}>{text}</span>,
        document.body)}
    </span>
  );
}

export const Badge = ({ b }: { b: BadgeT }) => <Tip text={BADGE_HELP[b]}><span tabIndex={0} className={`badge ${b}`}>{b}</span></Tip>;

export function SourceLink({ id, data }: { id: string; data: Data }) {
  const s = data.sources.get(id);
  if (!s) return null;
  return (
    <Tip text={`${s.title}. ${s.publisher}. Licence: ${s.licence}. Status: ${s.status}.`}>
      <a className="src" href={s.url} target="_blank" rel="noreferrer noopener"><LinkIcon size={11} aria-hidden />{s.credit.split(";")[0]}</a>
    </Tip>
  );
}

const fmtValue = (v: number | string, unit: string | null) => (typeof v === "number" ? `${v.toLocaleString("en-US")}${unit ? ` ${unit}` : ""}` : `${v}${unit ? ` ${unit}` : ""}`);

/** One fact row by ID: label, value, badge, sources. Facts are the only source of displayed constants. */
export function FactRow({ id, data, label }: { id: string; data: Data; label?: string }) {
  const f = data.facts.get(id);
  if (!f) return <><span className="fact-label">{label ?? id}</span><span className="fact-value muted">missing fact {id}</span></>;
  return (
    <>
      <span className="fact-label">{label ?? f.label}{f.note ? <Tip text={f.note}><span className="muted" tabIndex={0}> (i)</span></Tip> : null}</span>
      <span className="fact-value"><span className="mono">{fmtValue(f.value, f.unit)}</span><Badge b={f.badge} />{f.sourceIds.map((sid) => <SourceLink key={sid} id={sid} data={data} />)}</span>
    </>
  );
}

export function LiveRow({ label, value, badge = "LIVE", tip }: { label: string; value: string; badge?: BadgeT; tip?: string }) {
  return (
    <>
      <span className="fact-label">{label}{tip ? <Tip text={tip}><span className="muted" tabIndex={0}> (i)</span></Tip> : null}</span>
      <span className="fact-value"><span className="mono">{value}</span><Badge b={badge} /></span>
    </>
  );
}

export type PanelState<T> =
  | { kind: "loading" } | { kind: "error"; message: string; incident: string; retry?: () => void }
  | { kind: "empty"; message: string; action?: { label: string; run: () => void } } | { kind: "ok"; data: T };

export function Panel<T>({ title, icon, state, children, lines = 4 }: { title: string; icon?: ReactNode; state: PanelState<T>; children: (d: T) => ReactNode; lines?: number }) {
  return (
    <section className={`panel${state.kind === "error" ? " error" : ""}`} aria-busy={state.kind === "loading"}>
      <h2>{icon}{title}</h2>
      {state.kind === "loading" && Array.from({ length: lines }, (_, i) => <div key={i} className="skeleton" />)}
      {state.kind === "error" && (
        <div role="alert">
          <p>{state.message}</p>
          <p className="muted mono">Incident {state.incident}</p>
          {state.retry && <button className="btn" onClick={state.retry}><RotateCw size={16} aria-hidden />Retry</button>}
        </div>
      )}
      {state.kind === "empty" && (
        <div><p className="muted">{state.message}</p>{state.action && <button className="btn primary" onClick={state.action.run}>{state.action.label}</button>}</div>
      )}
      {state.kind === "ok" && children(state.data)}
    </section>
  );
}

export function BudgetBar({ name, icon, used, limit, label, tip, inverse }: { name: string; icon: ReactNode; used: number; limit: number; label: string; tip: string; inverse?: boolean }) {
  const frac = limit > 0 ? Math.max(0, Math.min(1, used / limit)) : 1;
  const margin = inverse ? used / Math.max(limit, 1e-9) : 1 - frac;
  const cls = (inverse ? used < 0 : used > limit) ? "breach" : margin < 0.25 ? "low" : "ok";
  const Icon = cls === "ok" ? CircleCheck : cls === "low" ? TriangleAlert : OctagonX;
  return (
    <div className={`budget ${cls}`}>
      <Tip text={tip}><span className="budget-name" tabIndex={0}>{icon}{name}</span></Tip>
      <span className="budget-val"><span className="budget-state"><Icon size={14} aria-hidden /> {cls === "ok" ? "OK" : cls === "low" ? "LOW" : "BREACH"}</span> {label}</span>
      <div className="bar" role="meter" aria-valuemin={0} aria-valuemax={limit} aria-valuenow={Math.round(used)} aria-label={name}><i style={{ width: `${(inverse ? Math.max(0, Math.min(1, margin)) : frac) * 100}%` }} /></div>
    </div>
  );
}

type Toast = { id: number; text: string };
const ToastCtx = createContext<(text: string) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (text: string) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-2), { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 5000);
  };
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => <div key={t.id} className="toast">{t.text}</div>)}
      </div>
    </ToastCtx.Provider>
  );
}

export class Boundary extends Component<{ name: string; children: ReactNode; fallback?: ReactNode }, { err?: Error; incident?: string }> {
  override state: { err?: Error; incident?: string } = {};
  static getDerivedStateFromError(err: Error) { return { err, incident: incidentId() }; }
  override componentDidCatch(err: Error, info: ErrorInfo) {
    console.error(JSON.stringify({ level: "error", boundary: this.props.name, incidentId: this.state.incident, message: err.message, stack: info.componentStack?.slice(0, 500) }));
  }
  override render() {
    if (!this.state.err) return this.props.children;
    return this.props.fallback ?? (
      <section className="panel error" role="alert">
        <h2>This part of Homeward stopped</h2>
        <p className="muted">The rest of the app still works. Incident <span className="mono">{this.state.incident}</span></p>
        <div className="row">
          <button className="btn" onClick={() => this.setState({ err: undefined })}><RotateCw size={16} aria-hidden />Retry</button>
          <button className="btn" onClick={() => navigator.clipboard?.writeText(JSON.stringify({ boundary: this.props.name, incident: this.state.incident, message: this.state.err?.message }))}>Copy error report</button>
        </div>
      </section>
    );
  }
}

export const fmtHM = (min: number) => (Number.isFinite(min) ? `${min < 0 ? "-" : ""}${Math.floor(Math.abs(min) / 60)} h ${String(Math.round(Math.abs(min) % 60)).padStart(2, "0")} min` : "--");
export const fmtClock = (h: number) => `${String(Math.floor(h)).padStart(2, "0")}:${String(Math.floor((h % 1) * 60)).padStart(2, "0")}`;
export const fmtUtc = (ms: number) => new Date(ms).toISOString().slice(11, 16) + " UTC";
export const fmtIst = (ms: number) => new Date(ms + 5.5 * 3600000).toISOString().slice(11, 16) + " IST";
/** Planetocentric latitude and east longitude 0-360, the USGS and PDS convention. */
export const fmtLatLon = (p: { lat: number; lon: number }, dp = 4) => `${Math.abs(p.lat).toFixed(dp)} ${p.lat < 0 ? "S" : "N"}, ${(((p.lon % 360) + 360) % 360).toFixed(dp)} E`;
