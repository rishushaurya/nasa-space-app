// Homeward | app/src/assistant/Dock.tsx | v1.0.0 | 2026-10-29
// The suit assistant and Mission Control. Captions always; voice by Kokoro on the device.
import { useEffect, useRef, useState } from "react";
import { Cloud, CloudOff, Mic, MicOff, RadioTower, Send, Volume2, VolumeX } from "lucide-react";
import { useApp } from "../state";
import { planOk, useRuntime } from "../runtime";
import { ZONES } from "../sites";
import { lightTimeMin } from "../core/ephemeris";
import { ask, type Answer } from "./brain";
import { loadVoice, onVoiceState, speak, stopVoice, type VoiceState } from "./voice";
import { speechMode, startListening } from "./speech";
import type { ToolCtx } from "./tools";
import { SourceLink, Tip, useToast } from "../ui/ui";

type Line = { who: "you" | "suit" | "mc"; text: string; a?: Answer };
const SUGGEST = ["How long until I must turn back?", "Is it safe to continue?", "Why does this rock matter?", "What is the radio delay to Earth?"];

export function Dock() {
  const { s, set } = useApp();
  const rt = useRuntime();
  const toast = useToast();
  const [lines, setLines] = useState<Line[]>([]);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [listening, setListening] = useState(false);
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [mc, setMc] = useState<{ q: string; due: number; realMin: number } | null>(null);
  const [now, setNow] = useState(Date.now());
  const rec = useRef<{ stop: () => Promise<string>; cancel: () => void } | null>(null);
  const history = useRef<{ q: string; a: string }[]>([]);
  const capRef = useRef<HTMLDivElement>(null);

  useEffect(() => onVoiceState(setVoiceState), []);
  useEffect(() => { if (s.voice) void loadVoice().catch(() => undefined); }, [s.voice]); // warm up so the first answer speaks at once
  useEffect(() => { capRef.current?.scrollTo({ top: capRef.current.scrollHeight }); }, [lines, busy, mc]);
  useEffect(() => { if (!mc) return; const id = setInterval(() => setNow(Date.now()), 250); return () => clearInterval(id); }, [mc]);

  const ctx = (): ToolCtx => ({ data: rt.data, zone: ZONES[s.zone], plan: planOk(rt.plan), settings: s.settings, position: rt.position, elapsedMin: rt.elapsedMin, event: rt.event, now: Date.now() });

  const run = async (question: string, persona: "suit" | "mission-control", auto = false) => {
    if (!question.trim()) return;
    setBusy(true);
    if (persona === "suit" && !auto) setLines((l) => [...l.slice(-5), { who: "you", text: question }]);
    const a = await ask(question, persona, s.lang, ctx(), history.current, s.online);
    history.current = [...history.current.slice(-4), { q: question, a: a.text }];
    setLines((l) => [...l.slice(-5), { who: persona === "suit" ? "suit" : "mc", text: a.text, a }]);
    setBusy(false);
    if (s.voice) speak(a.text, persona).catch(() => toast("Voice unavailable; captions continue"));
  };

  useEffect(() => {
    if (!mc || now < mc.due) return;
    const question = mc.q;
    setMc(null);
    void run(question, "mission-control");
  }, [now, mc]);

  // The suit announces walk hazards itself, with live numbers from the same tools.
  useEffect(() => {
    if (rt.event === "dust-devil") void run("A dust devil is crossing ahead. What should I do?", "suit", true);
    if (rt.event === "solar-storm") void run("Solar storm alert. What should I do?", "suit", true);
  }, [rt.event]);

  const sendToEarth = () => {
    const question = q.trim() || lines.filter((l) => l.who === "you").at(-1)?.text;
    if (!question) { toast("Type a question for Mission Control first"); return; }
    const realMin = 2 * lightTimeMin(Date.now());
    setMc({ q: question, due: Date.now() + (realMin * 60000) / s.compression, realMin });
    setLines((l) => [...l.slice(-5), { who: "you", text: `To Earth: ${question}` }]);
    setQ("");
  };

  const toggleMic = async () => {
    if (listening && rec.current) {
      setListening(false);
      const text = await rec.current.stop().catch(() => "");
      rec.current = null;
      if (text) void run(text, "suit"); else toast("I did not catch that. Try again or type.");
      return;
    }
    try { rec.current = await startListening(s.lang); setListening(true); }
    catch { toast("Microphone unavailable. You can type instead."); }
  };

  const left = mc ? Math.max(0, (mc.due - now) / 1000) : 0;
  return (
    <div className="dock">
      <section className="panel" aria-label="Suit assistant">
        <div className="captions" ref={capRef} aria-live="polite">
          {lines.length === 0 && <p className="muted hint" style={{ margin: 0, fontSize: "var(--text-sm)" }}>Ask the suit assistant. It answers only with numbers from the app's tools and names the source. AI voice.</p>}
          {lines.slice(-3).map((l, i) => (
            <div key={i} className={`caption ${l.who === "you" ? "user" : l.who}`}>
              <span className="who">{l.who === "you" ? "You" : l.who === "suit" ? "Suit" : "Mission Control"}</span>{l.text}
              {l.a && <div className="row">{l.a.sourceIds.slice(0, 4).map((sid) => <SourceLink key={sid} id={sid} data={rt.data} />)}<span className="provider">{l.a.provider === "offline" ? "Offline answer" : `via ${l.a.provider}`}</span></div>}
            </div>
          ))}
          {busy && <div className="skeleton" />}
          {mc && <div className="caption mc"><span className="who">Mission Control</span><span className="countdown">{left.toFixed(0)} s</span> <span className="muted">reply on its way: {mc.realMin.toFixed(1)} min real round trip, time-compressed {s.compression}x</span></div>}
        </div>
        <form className="ask" onSubmit={(e) => { e.preventDefault(); const v = q; setQ(""); void run(v, "suit"); }}>
          <Tip text={listening ? "Stop and send" : speechMode() === "browser" ? "Talk (browser speech recognition)" : "Talk (Whisper on this device)"}>
            <button type="button" className={`btn icon mic${listening ? " on" : ""}`} onClick={toggleMic} aria-label={listening ? "Stop listening" : "Start listening"}>{listening ? <MicOff size={16} /> : <Mic size={16} />}</button>
          </Tip>
          <input type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask the suit assistant" aria-label="Question for the suit assistant" maxLength={500} />
          <Tip text="Ask the suit assistant now"><button className="btn icon" type="submit" aria-label="Send" disabled={busy}><Send size={16} /></button></Tip>
          <Tip text={`Send to Mission Control: the reply takes the real round trip (${(2 * lightTimeMin(Date.now())).toFixed(1)} min), shown ${s.compression}x faster`}><button className="btn icon" type="button" onClick={sendToEarth} aria-label="Send to Mission Control" disabled={!!mc}><RadioTower size={16} /></button></Tip>
          <Tip text={s.online ? "Online assistant: questions go to free AI services through our relay (see Privacy)" : "Offline assistant only: questions never leave this device"}>
            <button type="button" className="btn icon" aria-pressed={!s.online} aria-label="Keep the assistant offline" onClick={() => set({ online: !s.online })}>{s.online ? <Cloud size={16} /> : <CloudOff size={16} />}</button>
          </Tip>
          <Tip text={s.voice ? `Sound on: Kokoro voice (${voiceState === "loading" ? "preparing" : voiceState}) and real Mars wind` : "Sound off"}>
            <button type="button" className="btn icon" aria-pressed={s.voice} aria-label="Toggle sound" onClick={() => { if (s.voice) stopVoice(); else void loadVoice().catch(() => toast("Voice model could not load")); set({ voice: !s.voice }); }}>{s.voice ? <Volume2 size={16} /> : <VolumeX size={16} />}</button>
          </Tip>
        </form>
        <div className="suggest">{SUGGEST.map((x) => <button key={x} type="button" onClick={() => void run(x, "suit")}>{x}</button>)}</div>
      </section>
    </div>
  );
}
