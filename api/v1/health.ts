// Homeward | api/v1/health.ts | v1.0.0 | 2026-10-29
// GET: configuration and data reachability. Never calls an AI provider (that would spend free quota).
import { json, requestId } from "../_lib/http.js";

const started = Date.now();
const has = (v?: string) => (v && v !== "replace-me" ? "ok" : "missing");

export async function GET(req: Request): Promise<Response> {
  const rid = requestId(), env = process.env;
  let manifest = "ok";
  try {
    const r = await fetch(new URL("/data/manifest.json", req.url), { signal: AbortSignal.timeout(4000) });
    if (!r.ok) manifest = "missing";
  } catch { manifest = "unreachable"; }
  const checks = { geminiKey: has(env.GEMINI_API_KEY), groqKey: has(env.GROQ_API_KEY), openrouterKey: has(env.OPENROUTER_API_KEY), allowedOrigins: env.ALLOWED_ORIGINS ? "ok" : "default", dataManifest: manifest };
  const anyKey = [checks.geminiKey, checks.groqKey, checks.openrouterKey].includes("ok");
  const healthy = manifest === "ok";
  return json(healthy ? 200 : 503, { status: healthy ? (anyKey ? "healthy" : "healthy-offline-assistant") : "degraded", checks, version: "1.0.0", uptimeS: Math.round((Date.now() - started) / 1000) }, rid);
}
