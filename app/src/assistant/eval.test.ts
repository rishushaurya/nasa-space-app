// Homeward | app/src/assistant/eval.test.ts | v1.0.0 | 2026-10-29
// PRD F08 eval: 40 questions through the offline brain on real data and a real Gale plan. Each answer must take the
// expected intent, and every number in it must come from a tool result, the facts registry or a sourced corpus card.
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { answerOffline } from "./offline";
import { TOOLS, runTool, type ToolCtx } from "./tools";
import type { Persona } from "./brain";
import type { Data } from "../data/load";
import { nextLtst, nextSunEvent } from "../core/mars-time";
import { DEFAULTS, cellCenter, plan, timeHomeField, type Grid } from "../core/planner";
import { snap, type PlanState } from "../core/use-planner";
import { ZONES } from "../sites";

const json = (p: string) => JSON.parse(readFileSync(`app/public/data/${p}`, "utf8"));
const facts = json("facts.json") as { id: string; label: string; value: string; unit?: string; note?: string }[];
const corpus = json("corpus.json") as { text: string }[];
const data = { facts: new Map(facts.map((f) => [f.id, f])), sources: new Map(), corpus } as unknown as Data;

const z = ZONES.gale, h = json("site/gale/grid.json");
const a = new Float32Array(readFileSync("app/public/data/site/gale/grid.bin").buffer.slice(0));
const n = h.cols * h.rows;
const g: Grid = { ...h, slopeDeg: a.subarray(0, n), reliefM: a.subarray(n, 2 * n), elevM: a.subarray(2 * n) };
const NOW = Date.UTC(2026, 10, 14, 0, 0);
const startUtcMs = nextLtst(NOW, z.home.lon, 10), sunsetUtcMs = nextSunEvent(startUtcMs + 2 * 1.027491 * 3600000, z.home.lat, z.home.lon, "set");
const home = snap(g, z.home, DEFAULTS, 15).cell, stop = snap(g, z.stop, DEFAULTS, 15).cell;
const field = timeHomeField(g, home, DEFAULTS);
const result = plan(g, field, { home, stops: [{ id: "stop", name: z.stopName, cell: stop, minutes: 60 }], startUtcMs, sunsetUtcMs, settings: DEFAULTS });
const planState = { grid: g, header: h, result, field, startUtcMs, sunsetUtcMs, stopCell: stop, homeCell: home, timings: { fieldMs: 0, routeMs: 0 }, snappedM: 0 } as PlanState;
const ctx = (event: ToolCtx["event"] = null): ToolCtx => ({ data, zone: z, plan: planState, settings: DEFAULTS, position: cellCenter(g, result.path[40]!), elapsedMin: 40, event, now: startUtcMs + 40 * 60000 });

const nums = (s: string) => (s.match(/\d{1,3}(?:,\d{3})+(?:\.\d+)?|\d+(?:\.\d+)?/g) ?? []).map((x) => x.replace(/,/g, ""));
function allowed(c: ToolCtx, q: string): Set<string> {
  const out = [q, z.why, ...corpus.map((k) => k.text), ...facts.map((f) => `${f.label} ${f.value} ${f.note ?? ""}`)];
  for (const t of TOOLS) out.push(JSON.stringify(runTool(t.name, t.name === "check_extra_time" ? '{"minutes":15}' : t.name === "get_hazard_facts" ? '{"topic":"radiation"}' : "{}", c).values));
  for (const m of [20, 30, 480]) out.push(JSON.stringify(runTool("check_extra_time", JSON.stringify({ minutes: m }), c).values));
  return new Set(out.flatMap(nums));
}

const W = "Life support left", DD = "Dust devil reference", SS = "Solar storm reference", RD = "A signal to Earth takes", SUN = "The Sun is",
  DOSE = "Surface dose rate", POS = "You are", SCI = "Curiosity drilled", RT = "Route to", WX = "Measured at Gale by REMS", EXT = "more minutes";
const CASES: [string, string, ToolCtx["event"]?, Persona?][] = [
  ["How long until I must turn back?", W], ["How much oxygen do I have left?", W], ["What is my walk-back margin?", W],
  ["Can I still get home safely?", W], ["How long is my life support good for?", W],
  ["Is it safe to continue?", DD, "dust-devil"], ["What is that whirlwind?", DD, "dust-devil"],
  ["Solar storm alert, what do I do?", SS, "solar-storm"], ["Is the flare dangerous?", SS, "solar-storm"],
  ["What is the radio delay to Earth?", RD, null, "mission-control"], ["How long does a message to Mission Control take?", RD],
  ["How far away is Earth in light minutes?", RD], ["If I call Earth now, when will they hear me?", RD, null, "mission-control"],
  ["When is sunset?", SUN], ["How much daylight is left?", SUN], ["Will it get dark before I am back?", SUN], ["How high is the Sun right now?", SUN],
  ["What radiation dose am I getting?", DOSE], ["How many sieverts will this walk cost?", DOSE], ["Is cosmic radiation a problem here?", DOSE], ["What is the dose on this walk?", DOSE],
  ["Where am I?", POS], ["How steep is the ground here?", POS], ["How far am I from the science stop?", POS], ["What is the slope under my feet?", POS],
  ["Why does this rock matter?", SCI], ["What did Curiosity find at Yellowknife Bay?", SCI], ["Tell me about the ancient lake.", SCI], ["Were organics found here?", SCI],
  ["How long is the route?", RT], ["What is the plan for today?", RT], ["How many minutes of walking in total?", RT], ["Describe my walk.", RT],
  ["What is the weather like?", WX], ["How cold is it?", WX], ["What is the air pressure?", WX], ["Is it windy today?", WX],
  ["Should we extend the stop by 20 minutes?", EXT, null, "mission-control"], ["Can I stay at the outcrop for 30 more minutes?", EXT], ["Can we spend 600 minutes longer at the stop?", EXT],
];

describe("assistant eval (offline brain, real Gale plan)", () => {
  it("has 40 questions and a valid plan", () => { expect(CASES).toHaveLength(40); expect(result.ok).toBe(true); });
  it("every answer takes the right intent and every number is grounded", () => {
    const failures: string[] = [];
    for (const [q, want, event, persona = "suit"] of CASES) {
      const c = ctx(event ?? null), a = answerOffline(q, c, persona), ok = allowed(c, q);
      if (!a.text.includes(want)) failures.push(`${q} -> expected "${want}", got "${a.text.slice(0, 70)}"`);
      const stray = nums(a.text).filter((x) => !ok.has(x));
      if (stray.length) failures.push(`${q} -> ungrounded numbers ${stray.join(", ")}`);
      if (persona === "mission-control" && !a.text.endsWith("Mission Control.")) failures.push(`${q} -> missing Mission Control sign-off`);
    }
    expect(failures).toEqual([]);
  });
});
