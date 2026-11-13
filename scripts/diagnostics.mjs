// Homeward | scripts/diagnostics.mjs | v1.0.0 | 2026-10-29
// One command that says what works and what does not, with a fix hint per failure (build/chunk-00.md).
// Usage: node scripts/diagnostics.mjs [--ci] [--quick] [--base https://your-app.vercel.app]
//   --ci     skip checks that need a deployed URL   --quick  skip build and npm audit
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const args = process.argv.slice(2);
const CI = args.includes("--ci"), QUICK = args.includes("--quick");
const BASE = args[args.indexOf("--base") + 1] && args.includes("--base") ? args[args.indexOf("--base") + 1] : null;
const P = (...p) => join(ROOT, ...p);
const read = (...p) => readFileSync(P(...p), "utf8");
const results = [];
const check = async (n, name, fn, fix) => {
  try {
    const r = await fn();
    results.push(r === "SKIP" || r?.skip ? { n, s: "SKIP", name: `${name}${r?.skip ? ` (${r.skip})` : ""}` } : { n, s: "PASS", name: `${name}${typeof r === "string" ? ` (${r})` : ""}` });
  } catch (e) {
    results.push({ n, s: "FAIL", name: `${name}: ${e.message}`, fix });
  }
};
const fail = (m) => { throw new Error(m); };
const run = (cmd) => execSync(cmd, { cwd: ROOT, stdio: "pipe", encoding: "utf8", maxBuffer: 64 << 20 });

function* walk(dir, skip = /node_modules|[\\/]dist$|[\\/]\.venv$|[\\/]\.git$|[\\/]public[\\/](cesium|models|ort)$|[\\/]pipeline[\\/]raw$|__pycache__/) {
  if (!existsSync(dir)) return;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (skip.test(p)) continue;
    if (e.isDirectory()) yield* walk(p, skip); else yield p;
  }
}
const TEXT = /\.(ts|tsx|mjs|js|json|css|html|md|py|csv|yml|yaml|txt|example|svg|webmanifest)$/;
const textFiles = (dir) => [...walk(dir)].filter((f) => TEXT.test(f) || f.endsWith(".env.example"));
const rel = (f) => relative(ROOT, f).split(sep).join("/");

console.log(`Homeward diagnostics 1.0.0  ${new Date().toISOString().slice(0, 19)}Z`);

await check(1, "node >= 22.12", () => {
  const [a, b] = process.versions.node.split(".").map(Number);
  if (a < 22 || (a === 22 && b < 12)) fail(`found v${process.versions.node}`);
  return `v${process.versions.node}`;
}, "Install Node 22 LTS or 24");

await check(2, "exact dependency pins", () => {
  if (!existsSync(P("package-lock.json"))) fail("package-lock.json missing");
  const pkg = JSON.parse(read("package.json"));
  const loose = Object.entries({ ...pkg.dependencies, ...pkg.devDependencies }).filter(([, v]) => /^[\^~]|[*x]|latest/.test(v));
  if (loose.length) fail(loose.map(([k, v]) => `${k}@${v}`).join(", "));
  return `${Object.keys({ ...pkg.dependencies, ...pkg.devDependencies }).length} pinned`;
}, "Pin exact versions in package.json, then npm install");

await check(3, ".env.example lists every server variable", () => {
  const used = new Set();
  for (const f of textFiles(P("api"))) for (const m of readFileSync(f, "utf8").matchAll(/\benv\.([A-Z][A-Z0-9_]+)/g)) used.add(m[1]);
  const listed = new Set([...read(".env.example").matchAll(/^([A-Z][A-Z0-9_]+)=/gm)].map((m) => m[1]));
  const missing = [...used].filter((k) => !listed.has(k));
  if (missing.length) fail(`missing ${missing.join(", ")}`);
  if (/^[A-Z_]+_KEY=(?!replace-me|$).+/m.test(read(".env.example"))) fail("a real-looking key value is in .env.example");
  return `${used.size} names`;
}, "Add the missing names with placeholder values");

await check(4, "no secrets in the project", () => {
  const pat = /AIza[0-9A-Za-z_-]{35}|gsk_[A-Za-z0-9]{40,}|sk-or-v1-[a-f0-9]{40,}/;
  const hits = textFiles(ROOT).filter((f) => !/\.env(\.local)?$/.test(f) && pat.test(readFileSync(f, "utf8"))).map(rel);
  if (hits.length) fail(hits.join(", "));
  const gi = read(".gitignore").split(/\r?\n/);
  if (!gi.includes(".env") || !gi.includes(".env.local")) fail(".env or .env.local not git-ignored");
  return "0 hits";
}, "Remove the key, rotate it at the provider, keep keys only in .env.local and Vercel env");

await check(5, "Cesium assets self-hosted, no ion", () => {
  if (!existsSync(P("app/public/cesium/Workers"))) fail("app/public/cesium/Workers missing");
  const ion = textFiles(P("app/src")).filter((f) => /\bIon\.|IonResource|ion\.cesium\.com/.test(readFileSync(f, "utf8"))).map(rel);
  if (ion.length) fail(`ion used in ${ion.join(", ")}`);
}, "npm run cesium:copy; remove Cesium ion usage");

await check(6, "typecheck", () => { run("npx tsc --noEmit"); }, "Fix the reported type errors (npm run typecheck)");

await check(7, "tests", () => {
  let out;
  try { out = run("npx vitest run"); } catch (e) { fail((e.stdout || e.message).split("\n").filter((l) => /FAIL|Tests/.test(l)).slice(0, 5).join("; ")); }
  return out.match(/Tests\s+(\d+ passed[^\n]*)/)?.[1]?.trim() ?? "passed";
}, "Read the failing test; golden values are in docs/TESTING_STRATEGY.md");

await check(8, "data manifest hashes", () => {
  const m = JSON.parse(read("app/public/data/manifest.json"));
  const bad = [];
  for (const f of m.files) {
    const p = P("app/public", f.path);
    if (!existsSync(p)) { bad.push(`${f.path} missing`); continue; }
    const buf = readFileSync(p);
    if (buf.length !== f.bytes || createHash("sha256").update(buf).digest("hex") !== f.sha256) bad.push(`${f.path} changed`);
  }
  if (bad.length) fail(bad.slice(0, 5).join(", ") + (bad.length > 5 ? ` and ${bad.length - 5} more` : ""));
  const mb = m.totalBytes / 1e6;
  if (mb > 256) fail(`offline payload ${mb.toFixed(1)} MB over the 256 MB budget`);
  return `${m.files.length} files, ${mb.toFixed(1)} MB`;
}, "npm run models, or re-run the pipeline step for the file, then .venv python pipeline/manifest.py");

const facts = existsSync(P("app/public/data/facts.json")) ? JSON.parse(read("app/public/data/facts.json")) : null;
const sources = existsSync(P("app/public/data/sources.json")) ? JSON.parse(read("app/public/data/sources.json")) : null;
const arr = (x) => (Array.isArray(x) ? x : x?.facts ?? x?.sources ?? Object.values(x ?? {}));

await check(9, "every fact has a badge and known sources", () => {
  const ids = new Set(arr(sources).map((s) => s.id));
  if (!arr(facts).length || !ids.size) fail("facts.json or sources.json missing or empty");
  const bad = arr(facts).filter((f) => !f.badge || !f.sourceIds?.length || f.sourceIds.some((s) => !ids.has(s))).map((f) => f.id);
  if (bad.length) fail(bad.join(", "));
  return `${arr(facts).length} facts`;
}, "Fix pipeline/facts.csv and run pipeline/build_facts.py");

await check(10, "every source has https, licence and credit", () => {
  if (!arr(sources).length) fail("sources.json missing or empty");
  const bad = arr(sources).filter((s) => !/^https:\/\//.test(s.url) || !s.licence || !s.credit).map((s) => s.id);
  if (bad.length) fail(bad.join(", "));
  return `${arr(sources).length} sources`;
}, "Fix pipeline/sources.csv and run pipeline/build_facts.py");

await check(11, "no hex colours outside tokens.css", () => {
  const hits = textFiles(P("app/src")).filter((f) => !f.endsWith("tokens.css") && /\.(tsx?|css)$/.test(f))
    .flatMap((f) => readFileSync(f, "utf8").split("\n").map((l, i) => [f, i + 1, l]))
    .filter(([, , l]) => /(["'\s:(,])#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b(?![-\w])/.test(l)).map(([f, n]) => `${rel(f)}:${n}`);
  if (hits.length) fail(hits.slice(0, 5).join(", "));
}, "Use a CSS token from app/src/styles/tokens.css");

await check(12, "no emoji in code or docs", () => {
  const dirs = ["app/src", "api", "scripts", "docs", "build", "design", "legal", "security", ".claude"].map((d) => P(d));
  const rootMd = readdirSync(ROOT).filter((f) => f.endsWith(".md") && !f.startsWith("Martian Map")).map((f) => P(f));
  const files = [...dirs.flatMap((d) => textFiles(d)), ...rootMd];
  const hits = files.filter((f) => /(?![©®™])\p{Extended_Pictographic}/u.test(readFileSync(f, "utf8"))).map(rel);
  if (hits.length) fail(hits.slice(0, 5).join(", "));
  return `${files.length} files`;
}, "Replace with a Lucide icon or plain text");

await check(13, "no dangerouslySetInnerHTML", () => {
  const hits = textFiles(P("app/src")).filter((f) => readFileSync(f, "utf8").includes("dangerouslySetInnerHTML")).map(rel);
  if (hits.length) fail(hits.join(", "));
}, "Render as text");

await check(14, "no NASA logo files", () => {
  const hits = [...walk(P("app/public"))].filter((f) => /meatball|insignia|nasa[-_]?logo|worm/i.test(f)).map(rel);
  if (hits.length) fail(hits.join(", "));
}, "Remove the file; use credit lines (NASA media guidelines)");

await check(15, "security and isolation headers", () => {
  const v = JSON.parse(read("vercel.json"));
  const keys = new Set(v.headers.flatMap((h) => h.headers.map((x) => x.key)));
  const need = ["Content-Security-Policy", "Strict-Transport-Security", "X-Frame-Options", "X-Content-Type-Options", "Referrer-Policy", "Permissions-Policy", "Cross-Origin-Opener-Policy", "Cross-Origin-Embedder-Policy"];
  const missing = need.filter((k) => !keys.has(k));
  if (missing.length) fail(`missing ${missing.join(", ")}`);
  const csp = v.headers.flatMap((h) => h.headers).find((x) => x.key === "Content-Security-Policy").value;
  if (!/connect-src 'self'/.test(csp)) fail("CSP connect-src is not 'self'");
  // Only NASA and Esri OnMars hosts may be added (rover photos, Trek and OnMars tiles; PLAN-2 D15; NASA image library, PLAN-3 D24).
  const ALLOWED = new Set(["https://mars.nasa.gov", "https://trek.nasa.gov", "https://astro.arcgis.com", "https://images-api.nasa.gov", "https://images-assets.nasa.gov"]);
  const extra = [...csp.matchAll(/https:\/\/[^\s;]+/g)].map((m) => m[0]).filter((h) => !ALLOWED.has(h));
  if (extra.length) fail(`CSP lists unexpected hosts ${extra.join(", ")}`);
  const coep = v.headers.flatMap((h) => h.headers).find((x) => x.key === "Cross-Origin-Embedder-Policy").value;
  if (coep !== "credentialless" || !read("vite.config.ts").includes(`"Cross-Origin-Embedder-Policy": "${coep}"`)) fail(`COEP ${coep}: must be credentialless in vercel.json and vite.config.ts`);
}, "Copy the headers from docs/SECURITY_ACCESS.md section 7");

await check(16, "npm audit (production deps)", () => {
  if (QUICK) return { skip: "--quick" };
  let out;
  try { out = run("npm audit --omit=dev --json"); } catch (e) { out = e.stdout; }
  let j;
  try { j = JSON.parse(out); } catch { return { skip: "registry unreachable" }; }
  // Accepted: sharp is a Node-only image library pulled in by @huggingface/transformers, with no upstream fix.
  // It is safe only while it never ships to the browser and api/ never loads transformers; both are re-checked here.
  const ACCEPTED = new Set(["sharp"]);
  const shipped = existsSync(P("dist")) && [...walk(P("dist"), /^$/)].some((f) => f.endsWith(".js") && /from"sharp"|require\("sharp"\)|libvips/.test(readFileSync(f, "utf8")));
  const serverUses = textFiles(P("api")).some((f) => /transformers|kokoro|sharp/.test(readFileSync(f, "utf8")));
  if (shipped || serverUses) ACCEPTED.clear();
  const vulns = j.vulnerabilities ?? {};
  const accepted = (name, seen = new Set()) => ACCEPTED.has(name) || (!seen.has(name) && (seen.add(name), (vulns[name]?.via ?? []).every((x) => typeof x === "string" && accepted(x, seen))));
  const open = Object.values(vulns).filter((x) => ["high", "critical"].includes(x.severity) && !accepted(x.name));
  if (open.length) fail(open.map((x) => `${x.name} (${x.severity})`).join(", "));
  const acc = Object.values(vulns).filter((x) => accepted(x.name)).map((x) => x.name);
  return acc.length ? `none open; accepted: ${acc.join(", ")} (sharp is Node-only, not shipped, not imported by api/)` : "none high or critical";
}, "Update the affected pinned version");

await check(17, "deployed health endpoint", async () => {
  if (CI || !BASE) return { skip: CI ? "--ci" : "no --base URL" };
  const r = await fetch(new URL("/api/v1/health", BASE));
  if (r.status !== 200) fail(`HTTP ${r.status}`);
  const j = await r.json();
  // api/v1/health.ts reports { status, checks: { geminiKey, groqKey, openrouterKey, allowedOrigins, dataManifest } }.
  const keys = ["gemini", "groq", "openrouter"].filter((k) => j.checks?.[`${k}Key`] === "ok");
  if (j.checks?.allowedOrigins !== "ok") fail("ALLOWED_ORIGINS not set, so the relay only accepts localhost");
  return `${j.status}; keys: ${keys.join(", ") || "none (offline assistant only)"}`;
}, "Set the API keys in Vercel env and redeploy; see docs/OBSERVABILITY.md section 5");

await check(18, "build, startup JS under 250 KB gzip", () => {
  if (QUICK) return { skip: "--quick" };
  run("npm run build");
  const html = readFileSync(P("dist/index.html"), "utf8");
  const startup = [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.js)"/g)].map((m) => m[1]);
  const kb = startup.reduce((s, f) => s + gzipSync(readFileSync(P("dist", f))).length, 0) / 1024;
  const lazy = readdirSync(P("dist/assets")).filter((f) => f.endsWith(".js") && !startup.includes(`assets/${f}`));
  const lazyKb = lazy.reduce((s, f) => s + gzipSync(readFileSync(P("dist/assets", f))).length, 0) / 1024;
  if (kb > 250) fail(`startup JS ${kb.toFixed(0)} KB gzip`);
  return `startup ${kb.toFixed(0)} KB gzip; lazy (globe, voice, speech) ${(lazyKb / 1024).toFixed(1)} MB gzip`;
}, "Lazy-load more; see docs/SEO_PERFORMANCE.md");

await check(19, "voice and speech models self-hosted", () => {
  const need = ["models/onnx-community/Kokoro-82M-v1.0-ONNX/onnx/model_quantized.onnx", "models/onnx-community/Kokoro-82M-v1.0-ONNX/voices/af_heart.bin",
    "models/onnx-community/Kokoro-82M-v1.0-ONNX/voices/bm_george.bin", "ort/ort-wasm-simd-threaded.jsep.wasm"];
  const missing = need.filter((f) => !existsSync(P("app/public", f)));
  if (missing.length) fail(`missing ${missing.join(", ")}`);
  return `${(statSync(P("app/public", need[0])).size / 1e6).toFixed(0)} MB Kokoro q8`;
}, "npm run models");

await check(20, "no stray control characters in source", () => {
  // A raw backspace once replaced a regex word boundary and silently broke assistant routing.
  const files = ["app/src", "api", "scripts", "pipeline"].flatMap((d) => textFiles(P(d)));
  const hits = files.filter((f) => /[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(readFileSync(f, "utf8"))).map(rel);
  if (hits.length) fail(hits.join(", "));
  return `${files.length} files`;
}, "Retype the character; editors and shells can turn an escaped \\b into a raw backspace");

console.log(results.map((r) => `${r.s.padEnd(5)} ${String(r.n).padStart(2, "0")} ${r.name}${r.fix ? `\n      fix: ${r.fix}` : ""}`).join("\n"));
const count = (s) => results.filter((r) => r.s === s).length;
console.log(`-----\n${count("PASS")} PASS  ${count("FAIL")} FAIL  ${count("SKIP")} SKIP`);
process.exit(count("FAIL") ? 1 : 0);
