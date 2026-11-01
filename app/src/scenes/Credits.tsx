// Homeward | app/src/scenes/Credits.tsx | v1.0.0 | 2026-10-29
// Scene 12: every agency, dataset, licence and AI tool. Generated from data/sources.json. No logos.
import { BookOpen, Bot } from "lucide-react";
import { useRuntime } from "../runtime";

export function CreditsScene() {
  const { data } = useRuntime();
  const sources = [...data.sources.values()];
  const groups = new Map<string, typeof sources>();
  for (const s of sources) groups.set(s.agency, [...(groups.get(s.agency) ?? []), s]);
  const order = ["NASA", "ESA", "DLR", "CNES", "Spain", "JAXA", "Other"];
  return (
    <aside className="side" style={{ width: "min(560px, calc(100% - 2 * var(--space-4)))" }}>
      <section className="panel">
        <h2><Bot size={18} aria-hidden />AI disclosure</h2>
        <p style={{ fontSize: "var(--text-sm)" }}>Homeward uses AI in three places, all labelled in the app: the assistant's answers come from free AI services (Google Gemini, Groq-hosted gpt-oss-120b, OpenRouter free models) that may only speak numbers returned by the app's own tools; the voice is Kokoro-82M, an open-source speech model running on your device; offline speech recognition uses Whisper tiny. The planning documents and code were written with an AI coding assistant (Claude). No AI-generated images or video are used. Not a NASA product; no NASA logos.</p>
      </section>
      <section className="panel credits">
        <h2><BookOpen size={18} aria-hidden />Data, software and sources</h2>
        {order.filter((a) => groups.has(a)).map((agency) => (
          <section key={agency}>
            <h3>{agency === "Other" ? "Software, AI services and other sources" : agency === "Spain" ? "Spain (Centro de Astrobiologia, INTA-CSIC)" : agency}</h3>
            <ul style={{ paddingLeft: "var(--space-4)", margin: 0 }}>
              {groups.get(agency)!.map((s) => (
                <li key={s.id}><a href={s.url} target="_blank" rel="noreferrer noopener">{s.title}</a>. {s.publisher}. Credit: {s.credit}. Licence: {s.licence}.{s.status !== "VERIFIED" ? ` (${s.status})` : ""}</li>
              ))}
            </ul>
          </section>
        ))}
        <p className="muted">Terrain layers derived from HRSC data are shared under CC BY-SA 3.0 IGO. Homeward's code is MIT-licensed. Team Quickbites, NASA Space Apps Challenge 2026.</p>
      </section>
    </aside>
  );
}
