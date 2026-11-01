// Homeward | app/src/assistant/speech.ts | v1.0.0 | 2026-10-29
// Speech in: the browser's Web Speech API when online (Chrome/Edge; audio goes to the browser's speech service),
// otherwise Whisper tiny.en (MIT) running on the device through transformers.js.
type Rec = { stop: () => Promise<string>; cancel: () => void };
type SR = { lang: string; interimResults: boolean; continuous: boolean; start(): void; stop(): void; abort(): void; onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null; onerror: (() => void) | null };

const SRClass = (window as unknown as { SpeechRecognition?: new () => SR; webkitSpeechRecognition?: new () => SR }).SpeechRecognition
  ?? (window as unknown as { webkitSpeechRecognition?: new () => SR }).webkitSpeechRecognition;
export const speechMode = () => (SRClass && navigator.onLine ? "browser" : "whisper");

let whisper: Promise<(audio: Float32Array) => Promise<{ text: string }>> | null = null;
function loadWhisper() {
  whisper ??= (async () => {
    const t = await import("@huggingface/transformers");
    t.env.allowRemoteModels = false; t.env.allowLocalModels = true; t.env.localModelPath = "/models/";
    if (t.env.backends.onnx.wasm) t.env.backends.onnx.wasm.wasmPaths = `${location.origin}/ort/`;
    const asr = await t.pipeline("automatic-speech-recognition", "onnx-community/whisper-tiny.en", { dtype: "q8", device: "wasm" });
    return async (audio: Float32Array) => (await asr(audio)) as { text: string };
  })();
  return whisper;
}

async function toMono16k(blob: Blob): Promise<Float32Array> {
  const ac = new AudioContext();
  const decoded = await ac.decodeAudioData(await blob.arrayBuffer());
  void ac.close();
  const off = new OfflineAudioContext(1, Math.ceil(decoded.duration * 16000), 16000);
  const src = off.createBufferSource();
  src.buffer = decoded; src.connect(off.destination); src.start();
  return (await off.startRendering()).getChannelData(0);
}

export async function startListening(lang: "en" | "hi" | "kn"): Promise<Rec> {
  if (speechMode() === "browser" && SRClass) {
    const r = new SRClass();
    r.lang = { en: "en-IN", hi: "hi-IN", kn: "kn-IN" }[lang];
    r.interimResults = false; r.continuous = true;
    let text = "";
    let done: (s: string) => void = () => {};
    const finished = new Promise<string>((res) => { done = res; });
    r.onresult = (e) => { text = Array.from(e.results).map((x) => x[0]!.transcript).join(" "); };
    r.onend = () => done(text.trim());
    r.onerror = () => done(text.trim());
    r.start();
    return { stop: () => { r.stop(); return finished; }, cancel: () => r.abort() };
  }
  const run = loadWhisper();
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const mr = new MediaRecorder(stream);
  const chunks: Blob[] = [];
  mr.ondataavailable = (e) => chunks.push(e.data);
  mr.start();
  const end = () => new Promise<Blob>((res) => { mr.onstop = () => { stream.getTracks().forEach((t) => t.stop()); res(new Blob(chunks, { type: mr.mimeType })); }; mr.stop(); });
  return {
    stop: async () => { const audio = await toMono16k(await end()); return (await (await run)(audio)).text.trim(); },
    cancel: () => { void end(); },
  };
}
