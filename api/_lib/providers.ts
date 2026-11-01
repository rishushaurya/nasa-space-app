// Homeward | api/_lib/providers.ts | v1.0.0 | 2026-10-29
// Free AI providers, tried in order, all through one OpenAI-compatible chat adapter.

export type Env = Record<string, string | undefined>;
export type ChatMessage =
  | { role: "system" | "user"; content: string }
  | { role: "assistant"; content: string | null; tool_calls?: { id: string; type: "function"; function: { name: string; arguments: string } }[] }
  | { role: "tool"; tool_call_id: string; content: string };
export type ToolSchema = { name: string; description: string; parameters: Record<string, unknown> };
export type Reply = { content: string | null; toolCalls: { id: string; name: string; arguments: string }[] };

type Provider = { name: "gemini" | "groq" | "openrouter"; url: string; key?: string; model: string };

export function providers(env: Env): Provider[] {
  return [
    { name: "gemini", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", key: env.GEMINI_API_KEY, model: env.GEMINI_MODEL ?? "gemini-3.8-flash" },
    { name: "groq", url: "https://api.groq.com/openai/v1/chat/completions", key: env.GROQ_API_KEY, model: env.GROQ_MODEL ?? "openai/gpt-oss-120b" },
    { name: "openrouter", url: "https://openrouter.ai/api/v1/chat/completions", key: env.OPENROUTER_API_KEY, model: env.OPENROUTER_MODEL ?? "openrouter/free" },
  ].filter((p) => p.key && p.key !== "replace-me") as Provider[];
}

// seniordev: breaker state per function instance.
const breaker = new Map<string, { fails: number; openUntil: number }>();
export const resetBreakers = () => breaker.clear();

export async function runChain(
  messages: ChatMessage[], tools: ToolSchema[], env: Env, deps: { fetch: typeof fetch; now: () => number; timeoutMs?: number },
): Promise<{ provider: string; reply: Reply; fallbacks: string[] }> {
  const fallbacks: string[] = [];
  for (const p of providers(env)) {
    const b = breaker.get(p.name) ?? { fails: 0, openUntil: 0 };
    if (b.openUntil > deps.now()) { fallbacks.push(`${p.name}:breaker`); continue; }
    try {
      const res = await deps.fetch(p.url, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${p.key}`, "x-title": "Homeward" },
        body: JSON.stringify({
          model: p.model, messages, temperature: 0.2, max_tokens: 500,
          ...(tools.length ? { tools: tools.map((t) => ({ type: "function", function: t })), tool_choice: "auto" } : {}),
        }),
        signal: AbortSignal.timeout(deps.timeoutMs ?? 8000),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { choices?: { message?: { content?: string | null; tool_calls?: { id: string; function: { name: string; arguments: string } }[] } }[] };
      const msg = data.choices?.[0]?.message;
      if (!msg) throw new Error("no message");
      breaker.set(p.name, { fails: 0, openUntil: 0 });
      return {
        provider: p.name, fallbacks,
        reply: { content: msg.content ?? null, toolCalls: (msg.tool_calls ?? []).map((c) => ({ id: c.id, name: c.function.name, arguments: c.function.arguments ?? "{}" })) },
      };
    } catch (e) {
      const fails = b.fails + 1;
      breaker.set(p.name, { fails, openUntil: fails >= 3 ? deps.now() + 60000 : 0 });
      fallbacks.push(`${p.name}:${(e as Error).message}`);
    }
  }
  throw Object.assign(new Error("ALL_PROVIDERS_FAILED"), { fallbacks });
}

export function systemPrompt(persona: "suit" | "mission-control", lang: "en" | "hi" | "kn"): string {
  const language = { en: "English", hi: "Hindi", kn: "Kannada" }[lang];
  return [
    persona === "suit"
      ? "You are the suit assistant of an astronaut on a Marswalk at Gale Crater, Mars. You answer instantly."
      : "You are Mission Control on Earth. Your reply reaches the crew about 22 minutes after their question because of the radio round trip, so give advice that is still useful after that delay. Sign off as 'Mission Control'.",
    "Rules you must follow:",
    "1. Speak a number only if a tool returned it in this conversation. Never estimate or recall numbers yourself. Call tools first.",
    "2. After a number, name its source briefly, for example 'from Curiosity's radiation detector' or 'NASA EVA limit'.",
    "3. If no tool covers the question, say you have no data for that and suggest asking Mission Control or checking the source panel.",
    "4. Never invent hazards, events or mission facts. You are not NASA and do not speak for NASA.",
    "5. Keep answers under three short sentences unless asked for more. Safety first: if a budget is breached, say what to do next.",
    `6. Answer in ${language}.`,
  ].join("\n");
}
