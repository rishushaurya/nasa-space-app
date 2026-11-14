// Homeward | film/voice.mjs | v1.0.0 | 2026-11-14
// Speaks every line in film/lines.json with Kokoro-82M (fp32, voice af_heart, Apache-2.0) on this machine: one WAV per line.
// Usage: node film/voice.mjs [speed]   (writes film/out/voice/<id>.wav)
import { KokoroTTS } from "kokoro-js";
import { mkdirSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const speed = Number(process.argv[2] ?? 0.92);
const lines = JSON.parse(readFileSync(new URL("./lines.json", import.meta.url), "utf8"));
const dir = new URL("./out/voice/", import.meta.url);
mkdirSync(dir, { recursive: true });
const tts = await KokoroTTS.from_pretrained("onnx-community/Kokoro-82M-v1.0-ONNX", { dtype: "fp32", device: "cpu" });
for (const [id, text] of [...lines.story, ...lines.short]) {
  const out = new URL(`${id}.wav`, dir);
  if (existsSync(out)) continue;
  const audio = await tts.generate(text, { voice: "af_heart", speed });
  await audio.save(fileURLToPath(out));
  console.log(id, (audio.audio.length / audio.sampling_rate).toFixed(2), "s");
}
