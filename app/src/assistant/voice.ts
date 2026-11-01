// Homeward | app/src/assistant/voice.ts | v1.1.0 | 2026-10-29
// Kokoro-82M (hexgrad/kokoro, Apache-2.0), generated on the user's device from self-hosted weights in a Web Worker.
// Suit assistant: af_heart. Mission Control: bm_george through a radio band-pass (300-3,400 Hz, ASSUMPTION).
const VOICES = { suit: "af_heart", "mission-control": "bm_george" } as const;
const VOICE_IDS = Object.values(VOICES) as string[];
type Out = { type: "ready" } | { type: "audio"; id: number; audio: Float32Array; rate: number } | { type: "error"; id: number; message: string };

let worker: Worker | null = null;
let loading: Promise<void> | null = null;
let seq = 0;
const pending = new Map<number, { res: (a: { audio: Float32Array; rate: number }) => void; rej: (e: Error) => void }>();
let ctx: AudioContext | null = null;
let current: AudioBufferSourceNode | null = null;
let stopped = false;
export type VoiceState = "idle" | "loading" | "ready" | "error";
let state: VoiceState = "idle";
const listeners = new Set<(s: VoiceState) => void>();
const setState = (s: VoiceState) => { state = s; listeners.forEach((l) => l(s)); };
export const onVoiceState = (fn: (s: VoiceState) => void) => { listeners.add(fn); fn(state); return () => { listeners.delete(fn); }; };

export function loadVoice(): Promise<void> {
  if (!loading) {
    setState("loading");
    loading = new Promise<void>((res, rej) => {
      worker = new Worker(new URL("./voice.worker.ts", import.meta.url), { type: "module" });
      worker.onmessage = (e: MessageEvent<Out>) => {
        const m = e.data;
        if (m.type === "ready") { setState("ready"); res(); return; }
        const p = pending.get(m.id);
        pending.delete(m.id);
        if (m.type === "audio") p?.res({ audio: m.audio, rate: m.rate });
        else if (p) p.rej(new Error(m.message));
        else rej(new Error(m.message));
      };
      worker.onerror = (e) => rej(new Error(e.message || "Voice worker failed"));
      worker.postMessage({ type: "load", voices: VOICE_IDS });
    }).catch((e) => { setState("error"); worker?.terminate(); worker = null; loading = null; throw e; });
  }
  return loading;
}

function generate(text: string, voice: string) {
  const id = ++seq;
  return new Promise<{ audio: Float32Array; rate: number }>((res, rej) => {
    pending.set(id, { res, rej });
    worker!.postMessage({ type: "gen", id, text, voice, voices: VOICE_IDS });
  });
}

function play(audio: Float32Array, rate: number, radio: boolean): Promise<void> {
  ctx ??= new AudioContext();
  const buf = ctx.createBuffer(1, audio.length, rate);
  buf.copyToChannel(audio as Float32Array<ArrayBuffer>, 0);
  const src = ctx.createBufferSource();
  src.buffer = buf;
  let node: AudioNode = src;
  if (radio) {
    const hp = ctx.createBiquadFilter(); hp.type = "highpass"; hp.frequency.value = 300;
    const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 3400;
    node.connect(hp); hp.connect(lp); node = lp;
  }
  node.connect(ctx.destination);
  current = src;
  return new Promise((res) => { src.onended = () => res(); src.start(); });
}

/** Speak sentence by sentence; the next sentence is generated while the current one plays. */
export async function speak(text: string, who: keyof typeof VOICES): Promise<void> {
  stopped = false;
  await loadVoice();
  const parts = (text.replace(/\s+/g, " ").match(/[^.!?]+[.!?]*/g) ?? [text]).map((p) => p.trim()).filter(Boolean);
  let next = parts.length ? generate(parts[0]!, VOICES[who]) : null;
  for (let i = 0; next; i++) {
    const out = await next;
    next = i + 1 < parts.length && !stopped ? generate(parts[i + 1]!, VOICES[who]) : null;
    if (stopped) return;
    await play(out.audio, out.rate, who === "mission-control");
  }
}

export function stopVoice() { stopped = true; try { current?.stop(); } catch { /* already stopped */ } }
