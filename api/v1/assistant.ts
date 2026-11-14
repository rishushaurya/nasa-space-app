// Homeward | api/v1/assistant.ts | v1.0.0 | 2026-10-29
// POST: one assistant turn through the free provider chain. Tools run in the browser, never here.
import { z } from "zod";
import { ipHash, json, log, originAllowed, rateLimit, requestId } from "../_lib/http.js";
import { runChain, systemPrompt, type ChatMessage, type Env } from "../_lib/providers.js";

const ToolCall = z.object({ id: z.string().max(100), name: z.string().max(64), arguments: z.string().max(4000) }).strict();
const Message = z.discriminatedUnion("role", [
  z.object({ role: z.literal("user"), content: z.string().min(1).max(4000) }).strict(),
  z.object({ role: z.literal("assistant"), content: z.string().max(4000).nullable(), toolCalls: z.array(ToolCall).max(8).optional() }).strict(),
  z.object({ role: z.literal("tool"), toolCallId: z.string().max(100), content: z.string().max(8000) }).strict(),
]);
const Tool = z.object({ name: z.string().regex(/^[a-z_]{1,64}$/), description: z.string().max(500), parameters: z.record(z.string(), z.unknown()) }).strict();
const Body = z.object({
  persona: z.enum(["suit", "mission-control"]),
  lang: z.enum(["en", "hi", "kn"]),
  messages: z.array(Message).min(1).max(20),
  tools: z.array(Tool).max(12),
}).strict();

export async function handle(req: Request, deps: { fetch: typeof fetch; env: Env; now: () => number }): Promise<Response> {
  const rid = requestId(), t0 = deps.now(), route = "/api/v1/assistant";
  const ip = await ipHash(req);
  if (!originAllowed(req, deps.env)) return json(403, { error: "ORIGIN_NOT_ALLOWED" }, rid);
  const raw = await req.text();
  if (raw.length > 32 * 1024) return json(413, { error: "BODY_TOO_LARGE" }, rid);
  let parsed;
  try { parsed = Body.safeParse(JSON.parse(raw)); } catch { return json(400, { error: "INVALID_BODY", message: "Body must be JSON" }, rid); }
  if (!parsed.success) return json(400, { error: "INVALID_BODY", message: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, rid);
  const rl = rateLimit(ip, 30, 10 * 60000, deps.now());
  if (!rl.ok) {
    log({ level: "warn", requestId: rid, route, status: 429, ipHash: ip, message: "rate limited" });
    return json(429, { error: "RATE_LIMITED", retryAfterS: rl.retryAfterS }, rid, { "retry-after": String(rl.retryAfterS) });
  }
  const b = parsed.data;
  const messages: ChatMessage[] = [{ role: "system", content: systemPrompt(b.persona, b.lang) }, ...b.messages.map((m): ChatMessage =>
    m.role === "user" ? { role: "user", content: m.content }
      : m.role === "tool" ? { role: "tool", tool_call_id: m.toolCallId, content: m.content }
        : { role: "assistant", content: m.content, ...(m.toolCalls?.length ? { tool_calls: m.toolCalls.map((c) => ({ id: c.id, type: "function" as const, function: { name: c.name, arguments: c.arguments } })) } : {}) })];
  try {
    const out = await runChain(messages, b.tools, deps.env, { fetch: deps.fetch, now: deps.now });
    log({ level: out.fallbacks.length ? "warn" : "info", requestId: rid, route, status: 200, ms: deps.now() - t0, ipHash: ip,
      message: "answered", metadata: { provider: out.provider, fallbacks: out.fallbacks, toolCalls: out.reply.toolCalls.length } });
    return json(200, { provider: out.provider, message: out.reply }, rid);
  } catch (e) {
    log({ level: "error", requestId: rid, route, status: 503, ms: deps.now() - t0, ipHash: ip, message: "all providers failed", metadata: { fallbacks: (e as { fallbacks?: string[] }).fallbacks } });
    return json(503, { error: "ALL_PROVIDERS_FAILED", message: "Online assistant unavailable, using offline answers" }, rid);
  }
}

export const POST = (req: Request) => handle(req, { fetch, env: process.env, now: Date.now });
