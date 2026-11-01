// Homeward | scripts/fetch-models.mjs | v1.1.0 | 2026-10-29
// Self-hosts the open Kokoro-82M voice (Apache-2.0), Whisper tiny.en (MIT) and the ONNX runtime, so voice works offline
// and the page never calls a third-party host (CSP connect-src 'self'). Runs in the Vercel build: models stay out of git.
// Downloads are pinned to a Hugging Face commit and every file must match the SHA-256 in data/manifest.json.
import { createHash } from "node:crypto";
import { cpSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const MODELS = [
  { repo: "onnx-community/Kokoro-82M-v1.0-ONNX", rev: "1939ad2a8e416c0acfeecc08a694d14ef25f2231",
    files: ["config.json", "tokenizer.json", "tokenizer_config.json", "onnx/model_quantized.onnx", "voices/af_heart.bin", "voices/bm_george.bin", "voices/am_michael.bin"] },
  { repo: "onnx-community/whisper-tiny.en", rev: "2575352d61be1bf7225cf8f8b268a4678025fc58",
    files: ["config.json", "generation_config.json", "preprocessor_config.json", "tokenizer.json", "tokenizer_config.json", "onnx/encoder_model_quantized.onnx", "onnx/decoder_model_merged_quantized.onnx"] },
];
// onnxruntime-web is the exact build transformers.js runs (1.22.0-dev.20250409); the wasm must match its JS glue.
const ORT_FILES = ["ort-wasm-simd-threaded.jsep.mjs", "ort-wasm-simd-threaded.jsep.wasm", "ort-wasm-simd-threaded.mjs", "ort-wasm-simd-threaded.wasm"];

const expected = new Map(JSON.parse(readFileSync("app/public/data/manifest.json", "utf8")).files.map((f) => [f.path, f.sha256]));
const verify = (path, buf) => {
  const want = expected.get(path), got = createHash("sha256").update(buf).digest("hex");
  if (want && want !== got) throw new Error(`${path}: SHA-256 ${got} does not match the manifest`);
};

for (const { repo, rev, files } of MODELS) {
  for (const f of files) {
    const path = `/models/${repo}/${f}`, dst = `app/public${path}`;
    if (existsSync(dst)) { verify(path, readFileSync(dst)); continue; }
    const r = await fetch(`https://huggingface.co/${repo}/resolve/${rev}/${f}`);
    if (!r.ok) throw new Error(`${repo}/${f}: HTTP ${r.status}`);
    const buf = Buffer.from(await r.arrayBuffer());
    verify(path, buf);
    mkdirSync(dirname(dst), { recursive: true });
    writeFileSync(dst, buf);
    console.log("fetched", repo, f);
  }
}

mkdirSync("app/public/ort", { recursive: true });
for (const f of ORT_FILES) {
  const src = `node_modules/onnxruntime-web/dist/${f}`, dst = `app/public/ort/${f}`;
  if (!existsSync(dst)) cpSync(src, dst);
  verify(`/ort/${f}`, readFileSync(dst));
}
console.log("Voice and speech models verified under app/public/models and app/public/ort");
