// Homeward | app/src/assistant/voice.worker.ts | v1.0.0 | 2026-10-29
// Runs Kokoro-82M off the main thread: inference takes seconds and would otherwise freeze the globe.
import { env } from "@huggingface/transformers";
import { KokoroTTS } from "kokoro-js";

const REPO = "onnx-community/Kokoro-82M-v1.0-ONNX";
let tts: Promise<KokoroTTS> | null = null;

async function seedVoiceCache(voices: string[]) {
  // kokoro-js looks voices up in Cache Storage by their Hugging Face URL before fetching; seed it from our own copy.
  const cache = await caches.open("kokoro-voices");
  for (const id of voices) {
    const key = `https://huggingface.co/${REPO}/resolve/main/voices/${id}.bin`;
    if (await cache.match(key)) continue;
    const r = await fetch(`/models/${REPO}/voices/${id}.bin`);
    if (r.ok) await cache.put(key, r);
  }
}

function load(voices: string[]) {
  tts ??= (async () => {
    env.allowRemoteModels = false;
    env.allowLocalModels = true;
    env.localModelPath = "/models/";
    env.useBrowserCache = false; // the service worker already caches /models/; a second copy would cost 90 MB
    // Full-origin URL: the dev server rewrites root-relative dynamic imports.
    if (env.backends.onnx.wasm) env.backends.onnx.wasm.wasmPaths = `${location.origin}/ort/`;
    await seedVoiceCache(voices);
    return KokoroTTS.from_pretrained(REPO, { dtype: "q8", device: "wasm" });
  })().catch((e) => { tts = null; throw e; });
  return tts;
}

type Msg = { type: "load"; voices: string[] } | { type: "gen"; id: number; text: string; voice: string; voices: string[] };

self.onmessage = async (e: MessageEvent<Msg>) => {
  const m = e.data;
  try {
    const model = await load(m.voices);
    if (m.type === "load") { self.postMessage({ type: "ready" }); return; }
    const out = await model.generate(m.text, { voice: m.voice as NonNullable<Parameters<KokoroTTS["generate"]>[1]>["voice"] });
    self.postMessage({ type: "audio", id: m.id, audio: out.audio, rate: out.sampling_rate }, { transfer: [out.audio.buffer] });
  } catch (err) {
    self.postMessage({ type: "error", id: m.type === "gen" ? m.id : -1, message: String((err as Error)?.message ?? err) });
  }
};
