// Homeward | app/src/assistant/offline.ts | v1.0.0 | 2026-10-29
// Offline assistant: keyword intents mapped to the same tools, answered with templates. No invented numbers.
import { runTool, searchCorpus, type ToolCtx } from "./tools";
import type { Persona } from "./brain";

type Out = { text: string; sourceIds: string[]; factIds: string[] };
const v = (r: { values: Record<string, number | string> }, k: string) => r.values[k];

const INTENTS: { re: RegExp; answer: (c: ToolCtx, q: string) => Out }[] = [
  { re: /extend|longer|more time|extra (time|min)|stay (on|at|for)/i, answer: (c, q) => {
    const minutes = Math.min(480, Number(q.match(/(\d+)\s*min/i)?.[1] ?? 15));
    const r = runTool("check_extra_time", JSON.stringify({ minutes }), c);
    if (r.values.status) return { text: "I have no plan loaded yet. Open the planner first.", sourceIds: [], factIds: [] };
    const why = `The plan can take at most ${v(r, "maxExtraMin")} extra minutes before ${v(r, "limitedBy")} runs short (life-support slack ${v(r, "lifeSupportSlackMin")} min, daylight slack ${v(r, "daylightSlackMin")} min).`;
    return { text: `${v(r, "fits") === "yes" ? `Yes, ${minutes} more minutes at the stop fits.` : `No, not ${minutes} more minutes.`} ${why}`, sourceIds: r.sourceIds, factIds: r.factIds };
  } },
  { re: /turn back|walk back|get home|home|return|margin|how long.*(left|until)|life support|oxygen|\bair\b(?! pressure)/i, answer: (c) => {
    const r = runTool("get_budgets", "{}", c);
    if (r.values.status) return { text: "I have no plan loaded yet. Open the planner first.", sourceIds: [], factIds: [] };
    return { text: `Life support left: ${v(r, "lifeSupportLeftMin")} minutes after the ${v(r, "reserveMin")} minute reserve (NASA EVA limit). Walking home from here takes ${v(r, "walkHomeNowMin")} minutes at the Apollo walk-back rate, so your margin is ${v(r, "walkBackMarginMin")} minutes.`, sourceIds: r.sourceIds, factIds: r.factIds };
  } },
  { re: /dust devil|whirlwind|safe to continue|event|storm alert|solar storm|flare/i, answer: (c) => {
    const r = runTool("get_event", "{}", c);
    if (c.event === "dust-devil") return { text: `Dust devil reference: ${Object.values(r.values)[0]}, filmed by Perseverance. It is a dust hazard, not a wind threat to a suited walker; keep visors clear and check your margin before continuing.`, sourceIds: r.sourceIds, factIds: r.factIds };
    if (c.event === "solar-storm") return { text: `Solar storm reference: ${Object.values(r.values)[0]} measured beside Curiosity on 20 May 2024. Head for shelter at the habitat or rover now.`, sourceIds: r.sourceIds, factIds: r.factIds };
    return { text: "No event is active right now.", sourceIds: [], factIds: [] };
  } },
  { re: /delay|earth|mission control|radio|\blight\b/i, answer: (c) => {
    const r = runTool("get_radio_delay", "{}", c);
    return { text: `A signal to Earth takes ${v(r, "oneWayMin")} minutes one way, so a reply needs about ${v(r, "roundTripMin")} minutes (computed from JPL planetary elements).`, sourceIds: r.sourceIds, factIds: [] };
  } },
  { re: /sun|sunset|sunrise|dark|daylight/i, answer: (c) => {
    const r = runTool("get_sun", "{}", c), b = runTool("get_budgets", "{}", c);
    return { text: `The Sun is ${v(r, "sunElevationDeg")} degrees high; next sunset ${v(r, "nextSunsetUtc")} UTC (Mars24 algorithm).${b.values.daylightLeftMin !== undefined ? ` Daylight left on your plan: ${v(b, "daylightLeftMin")} minutes.` : ""}`, sourceIds: r.sourceIds, factIds: [] };
  } },
  { re: /radiation|dose|sievert|cosmic/i, answer: (c) => {
    const r = runTool("get_hazard_facts", JSON.stringify({ topic: "radiation" }), c), b = runTool("get_budgets", "{}", c);
    return { text: `Surface dose rate: ${Object.values(r.values)[0]} (Curiosity RAD). This plan adds about ${v(b, "planDoseMSv")} mSv. NASA's career limit: ${Object.values(r.values)[1]}.`, sourceIds: [...r.sourceIds, ...b.sourceIds], factIds: r.factIds };
  } },
  { re: /where am i|position|slope|steep|how far|distance/i, answer: (c) => {
    const r = runTool("get_position", "{}", c);
    return { text: `You are ${v(r, "distanceHomeM")} m from home and ${v(r, "distanceStopM")} m from the science stop. Local slope ${v(r, "slopeDeg")} degrees, relief ${v(r, "reliefM")} m (HiRISE terrain).`, sourceIds: r.sourceIds, factIds: r.factIds };
  } },
  { re: /why|science|matter|rock|lake|boxwork|organic|found/i, answer: (c) => {
    const r = runTool("get_science", "{}", c);
    return { text: `${c.zone.why} ${Object.entries(r.values).slice(0, 1).map(([k, val]) => `${k}: ${val}.`).join(" ")}`, sourceIds: r.sourceIds, factIds: r.factIds };
  } },
  { re: /route|plan|distance|walk|how long/i, answer: (c) => {
    const r = runTool("get_route", "{}", c);
    return { text: `Route to ${v(r, "stop")}: ${v(r, "routeM")} m, ${v(r, "walkMin")} minutes walking, ${v(r, "onSiteMin")} minutes on site, ${v(r, "totalMin")} minutes in all. Breaches: ${v(r, "breaches")}.`, sourceIds: r.sourceIds, factIds: r.factIds };
  } },
  { re: /weather|temperature|cold|pressure|humid|wind/i, answer: (c) => {
    const r = runTool("get_conditions", "{}", c);
    return { text: `Measured at Gale by REMS: ${Object.values(r.values)[0]}. Weather on Mars cannot be live; these are archived measurements.`, sourceIds: r.sourceIds, factIds: r.factIds };
  } },
];

export function answerOffline(q: string, c: ToolCtx, persona: Persona): Out {
  const hit = INTENTS.find((i) => i.re.test(q));
  let out: Out;
  if (hit) out = hit.answer(c, q);
  else {
    const cards = searchCorpus(c.data.corpus, q, 1);
    out = cards[0] ? { text: cards[0].text, sourceIds: cards[0].sourceIds, factIds: [] } : { text: "I have no offline data for that. Ask Mission Control or open the sources panel.", sourceIds: [], factIds: [] };
  }
  return persona === "mission-control" ? { ...out, text: `${out.text} Mission Control.` } : out;
}
