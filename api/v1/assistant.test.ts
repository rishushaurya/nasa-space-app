// Homeward | api/v1/assistant.test.ts | v1.0.0 | 2026-10-29
import { beforeEach, describe, expect, it } from "vitest";
import { handle } from "./assistant";
import { resetRateLimits } from "../_lib/http";
import { resetBreakers } from "../_lib/providers";

const env = { GEMINI_API_KEY: "g", GROQ_API_KEY: "q", OPENROUTER_API_KEY: "o", ALLOWED_ORIGINS: "http://localhost:5173" };
const body = { persona: "suit", lang: "en", messages: [{ role: "user", content: "How long until I must turn back?" }], tools: [] };
const req = (b: unknown = body, origin = "http://localhost:5173", ip = "1.2.3.4") =>
  new Request("http://localhost/api/v1/assistant", { method: "POST", headers: { origin, "x-forwarded-for": ip, "content-type": "application/json" }, body: typeof b === "string" ? b : JSON.stringify(b) });
const ok = (content: string, tool_calls?: unknown) => new Response(JSON.stringify({ choices: [{ message: { content, tool_calls } }] }), { status: 200 });

function fakeFetch(plan: Record<string, () => Response | Promise<Response>>) {
  const calls: string[] = [];
  const f = (async (url: string) => {
    const name = url.includes("googleapis") ? "gemini" : url.includes("groq") ? "groq" : "openrouter";
    calls.push(name);
    return plan[name]!();
  }) as unknown as typeof fetch;
  return { f, calls };
}
const run = (r: Request, f: typeof fetch, now = () => 1000, e: Record<string, string> = env) => handle(r, { fetch: f, env: e, now });

beforeEach(() => { resetRateLimits(); resetBreakers(); });

describe("assistant relay", () => {
  it("403 for an unknown origin, with no provider call", async () => {
    const { f, calls } = fakeFetch({});
    expect((await run(req(body, "https://evil.example"), f)).status).toBe(403);
    expect(calls).toEqual([]);
  });
  it("400 for unknown persona or extra fields", async () => {
    const { f } = fakeFetch({});
    expect((await run(req({ ...body, persona: "nasa" }), f)).status).toBe(400);
    expect((await run(req({ ...body, extra: 1 }), f)).status).toBe(400);
    expect((await run(req("not json"), f)).status).toBe(400);
  });
  it("413 for bodies over 32 KB", async () => {
    const { f } = fakeFetch({});
    expect((await run(req({ ...body, messages: [{ role: "user", content: "x".repeat(40000) }] }), f)).status).toBe(413);
  });
  it("429 after 30 calls in 10 minutes from one IP", async () => {
    const { f } = fakeFetch({ gemini: () => ok("hi") });
    for (let i = 0; i < 30; i++) expect((await run(req(), f)).status).toBe(200);
    const r = await run(req(), f);
    expect(r.status).toBe(429);
    expect(Number(r.headers.get("retry-after"))).toBeGreaterThan(0);
  });
  it("falls back gemini -> groq -> openrouter, then 503", async () => {
    let { f, calls } = fakeFetch({ gemini: () => new Response("", { status: 429 }), groq: () => ok("from groq") });
    let r = await run(req(), f);
    expect((await r.json()).provider).toBe("groq");
    expect(calls).toEqual(["gemini", "groq"]);
    resetBreakers();
    ({ f, calls } = fakeFetch({ gemini: () => new Response("", { status: 500 }), groq: () => new Response("", { status: 500 }), openrouter: () => ok("from or") }));
    expect((await (await run(req(), f)).json()).provider).toBe("openrouter");
    resetBreakers();
    ({ f } = fakeFetch({ gemini: () => new Response("", { status: 500 }), groq: () => new Response("", { status: 500 }), openrouter: () => new Response("", { status: 500 }) }));
    r = await run(req(), f);
    expect(r.status).toBe(503);
  });
  it("opens the breaker after 3 failures and skips the provider", async () => {
    const { f, calls } = fakeFetch({ gemini: () => new Response("", { status: 500 }), groq: () => ok("g") });
    for (let i = 0; i < 3; i++) await run(req(), f);
    calls.length = 0;
    await run(req(), f);
    expect(calls).toEqual(["groq"]);
  });
  it("passes tool calls through unchanged", async () => {
    const { f } = fakeFetch({ gemini: () => ok("", [{ id: "c1", type: "function", function: { name: "get_budgets", arguments: "{}" } }]) });
    const j = await (await run(req(), f)).json();
    expect(j.message.toolCalls).toEqual([{ id: "c1", name: "get_budgets", arguments: "{}" }]);
  });
  it("503 straight away when no keys are configured", async () => {
    const { f, calls } = fakeFetch({});
    expect((await run(req(), f, () => 1000, { ALLOWED_ORIGINS: env.ALLOWED_ORIGINS })).status).toBe(503);
    expect(calls).toEqual([]);
  });
});
