// Homeward | app/src/assistant/brain.ts | v1.0.0 | 2026-10-29
// One question: relay (free AI chain) with up to 3 tool rounds; falls back to offline rules on any failure.
import { answerOffline } from "./offline";
import { runTool, toolSchemas, type ToolCtx } from "./tools";

export type Persona = "suit" | "mission-control";
export type Lang = "en" | "hi" | "kn";
export type Answer = { text: string; sourceIds: string[]; factIds: string[]; provider: string };
type Msg = { role: "user"; content: string } | { role: "assistant"; content: string | null; toolCalls?: { id: string; name: string; arguments: string }[] } | { role: "tool"; toolCallId: string; content: string };

export async function ask(question: string, persona: Persona, lang: Lang, ctx: ToolCtx, history: { q: string; a: string }[] = [], online = true): Promise<Answer> {
  if (!online) return { ...answerOffline(question, ctx, persona), provider: "offline" };
  const messages: Msg[] = [];
  for (const h of history.slice(-3)) messages.push({ role: "user", content: h.q }, { role: "assistant", content: h.a });
  messages.push({ role: "user", content: question.slice(0, 500) });
  const src = new Set<string>(), facts = new Set<string>();
  try {
    for (let round = 0; round < 4; round++) {
      const r = await fetch("/api/v1/assistant", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ persona, lang, messages, tools: toolSchemas() }), signal: AbortSignal.timeout(20000) });
      if (!r.ok) throw new Error(`relay ${r.status}`);
      const j = (await r.json()) as { provider: string; message: { content: string | null; toolCalls: { id: string; name: string; arguments: string }[] } };
      const calls = j.message.toolCalls ?? [];
      if (!calls.length || round === 3) {
        if (!j.message.content) throw new Error("empty answer");
        return { text: j.message.content.trim(), sourceIds: [...src], factIds: [...facts], provider: j.provider };
      }
      messages.push({ role: "assistant", content: j.message.content, toolCalls: calls });
      for (const c of calls) {
        const res = runTool(c.name, c.arguments, ctx);
        res.sourceIds.forEach((s) => src.add(s)); res.factIds.forEach((f) => facts.add(f));
        messages.push({ role: "tool", toolCallId: c.id, content: JSON.stringify(res).slice(0, 7900) });
      }
    }
  } catch {
    const off = answerOffline(question, ctx, persona);
    return { ...off, provider: "offline" };
  }
  return { ...answerOffline(question, ctx, persona), provider: "offline" };
}
