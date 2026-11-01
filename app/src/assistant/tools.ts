// Homeward | app/src/assistant/tools.ts | v1.0.0 | 2026-10-29
// The only way any AI brain (or the offline rules) gets numbers: tools that read tested code and the facts registry.
import { z } from "zod";
import type { Card, Data } from "../data/load";
import { lightTimeMin } from "../core/ephemeris";
import { haversineM, type LatLon } from "../core/frames";
import { localSolar, nextSunEvent, sunPosition } from "../core/mars-time";
import { cellIndex, type Settings } from "../core/planner";
import type { PlanState } from "../core/use-planner";
import type { Zone } from "../sites";

export type ToolCtx = {
  data: Data; zone: Zone; plan: PlanState | null; settings: Settings; position: LatLon;
  elapsedMin: number; event: "dust-devil" | "solar-storm" | null; now: number;
};
export type ToolResult = { values: Record<string, number | string>; factIds: string[]; sourceIds: string[] };
type Tool = { name: string; description: string; parameters: Record<string, unknown>; args: z.ZodType; run: (a: never, c: ToolCtx) => ToolResult };

const r1 = (x: number) => Math.round(x * 10) / 10;
const factVals = (c: ToolCtx, ids: string[]): ToolResult => {
  const values: Record<string, number | string> = {}, src = new Set<string>();
  for (const id of ids) {
    const f = c.data.facts.get(id);
    if (!f) continue;
    values[f.label] = `${f.value}${f.unit ? ` ${f.unit}` : ""}${f.note ? ` (${f.note})` : ""}`;
    f.sourceIds.forEach((s) => src.add(s));
  }
  return { values, factIds: ids, sourceIds: [...src] };
};
const NO_PLAN: ToolResult = { values: { status: "no plan loaded yet" }, factIds: [], sourceIds: [] };
const noArgs = { type: "object", properties: {}, additionalProperties: false };
const empty = z.object({}).passthrough();

export function searchCorpus(cards: Card[], q: string, k = 3): Card[] {
  const words = q.toLowerCase().split(/[^a-z0-9]+/).filter((w) => w.length > 2);
  return cards.map((c) => {
    const hay = `${c.title} ${c.text} ${c.keywords.join(" ")}`.toLowerCase();
    return { c, s: words.reduce((s, w) => s + (c.keywords.some((kw) => kw.includes(w)) ? 3 : 0) + (hay.includes(w) ? 1 : 0), 0) };
  }).filter((x) => x.s > 0).sort((a, b) => b.s - a.s).slice(0, k).map((x) => x.c);
}

export const TOOLS: Tool[] = [
  {
    name: "get_budgets", description: "Life support left, walk-back margin, daylight left and radiation dose for the current Marswalk plan and position.",
    parameters: noArgs, args: empty,
    run: (_a, c): ToolResult => {
      if (!c.plan) return NO_PLAN;
      const b = c.plan.result.budgets, lim = b.lifeSupport.limitMin;
      const cell = cellIndex(c.plan.grid, c.position);
      const home = cell >= 0 ? c.plan.field[cell]! : NaN;
      const daylightLeft = (c.plan.sunsetUtcMs - (c.plan.startUtcMs + c.elapsedMin * 60000)) / 60000;
      return {
        values: {
          lifeSupportLeftMin: Math.round(lim - c.elapsedMin), lifeSupportLimitMin: lim, reserveMin: c.settings.reserveMin,
          walkHomeNowMin: Number.isFinite(home) ? r1(home) : "no safe path from here",
          walkBackMarginMin: Number.isFinite(home) ? Math.round(lim - c.elapsedMin - home) : "unknown",
          daylightLeftMin: Math.round(daylightLeft), planDoseMSv: Number(b.dose.mSv.toFixed(3)), planOk: c.plan.result.ok ? "yes" : "no",
        },
        factIds: ["EVA-01", "EVA-04", "RAD-01"], sourceIds: ["NTRS-20200001071", "APOLLO17-TRAVERSE", "HASSLER-2014"],
      };
    },
  },
  {
    name: "get_route", description: "The planned route: distance, walking time, time on site, total time and any safety breaches.",
    parameters: noArgs, args: empty,
    run: (_a, c): ToolResult => {
      if (!c.plan) return NO_PLAN;
      const t = c.plan.result.totals;
      return { values: { stop: c.zone.stopName, routeM: Math.round(t.walkM), walkMin: Math.round(t.walkMin), onSiteMin: Math.round(t.stopMin), totalMin: Math.round(t.totalMin),
        breaches: c.plan.result.breaches.map((b) => b.message).join("; ") || "none" }, factIds: [c.zone.distanceFact, "EVA-03"], sourceIds: ["MMGIS-MSL-WAYPOINTS", "DATA-03"] };
    },
  },
  {
    name: "get_position", description: "Where the astronaut is now: coordinates, local slope, terrain relief and distance to home and to the science stop.",
    parameters: noArgs, args: empty,
    run: (_a, c) => {
      const cell = c.plan ? cellIndex(c.plan.grid, c.position) : -1;
      const g = c.plan?.grid;
      return { values: { latDeg: Number(c.position.lat.toFixed(5)), lonEDeg: Number(c.position.lon.toFixed(5)),
        slopeDeg: g && cell >= 0 ? r1(g.slopeDeg[cell]!) : "unknown", reliefM: g && cell >= 0 ? r1(g.reliefM[cell]!) : "unknown",
        distanceHomeM: Math.round(haversineM(c.position, c.zone.home)), distanceStopM: Math.round(haversineM(c.position, c.zone.stop)), site: c.zone.title },
        factIds: [c.zone.homeFact], sourceIds: ["DATA-03", "MMGIS-MSL-WAYPOINTS"] };
    },
  },
  {
    name: "get_sun", description: "Sun elevation and azimuth now, and today's sunrise and sunset at the site in UTC and local true solar time.",
    parameters: noArgs, args: empty,
    run: (_a, c) => {
      const p = c.zone.home, sp = sunPosition(c.now, p.lat, p.lon), lt = localSolar(c.now, p.lon).ltstH;
      const set = nextSunEvent(c.now, p.lat, p.lon, "set"), rise = nextSunEvent(c.now, p.lat, p.lon, "rise");
      return { values: { sunElevationDeg: r1(sp.elevationDeg), sunAzimuthDeg: r1(sp.azimuthDeg), localTrueSolarTime: `${Math.floor(lt)}:${String(Math.floor((lt % 1) * 60)).padStart(2, "0")}`,
        nextSunsetUtc: new Date(set).toISOString().slice(0, 16), nextSunriseUtc: new Date(rise).toISOString().slice(0, 16) }, factIds: [], sourceIds: ["GISS-MARS24"] };
    },
  },
  {
    name: "get_radio_delay", description: "Current one-way and round-trip radio delay between Mars and Earth.",
    parameters: noArgs, args: empty,
    run: (_a, c) => { const m = lightTimeMin(c.now); return { values: { oneWayMin: Number(m.toFixed(2)), roundTripMin: Number((2 * m).toFixed(1)) }, factIds: [], sourceIds: ["JPL-APPROX-ELEMENTS"] }; },
  },
  {
    name: "get_conditions", description: "Measured weather ranges at Gale and the planet's surface conditions. Mars weather is never live: archives lag by more than a Mars year.",
    parameters: noArgs, args: empty, run: (_a, c) => factVals(c, ["WX-01", "PLN-03", "PLN-05", "WX-04"]),
  },
  {
    name: "get_science", description: "Why the science stop matters and what Curiosity found there.",
    parameters: noArgs, args: empty, run: (_a, c) => factVals(c, [...c.zone.scienceFacts, c.zone.stopFact]),
  },
  {
    name: "check_extra_time", description: "Whether the plan can take extra minutes at the science stop without breaking the life-support or daylight budgets, and the most it can take.",
    parameters: { type: "object", properties: { minutes: { type: "number", minimum: 0, maximum: 480 } }, required: ["minutes"], additionalProperties: false },
    args: z.object({ minutes: z.number().min(0).max(480) }),
    run: (a: { minutes: number }, c): ToolResult => {
      if (!c.plan) return NO_PLAN;
      const b = c.plan.result.budgets;
      const lifeSlack = b.lifeSupport.limitMin - b.lifeSupport.usedMin, daySlack = b.daylight.marginMin;
      const maxExtra = Math.max(0, Math.floor(Math.min(lifeSlack, daySlack)));
      return {
        values: { requestedMin: a.minutes, lifeSupportSlackMin: Math.round(lifeSlack), daylightSlackMin: Math.round(daySlack), maxExtraMin: maxExtra,
          limitedBy: lifeSlack <= daySlack ? "life support" : "daylight", fits: c.plan.result.ok && a.minutes <= maxExtra ? "yes" : "no" },
        factIds: ["EVA-01"], sourceIds: ["NTRS-20200001071"],
      };
    },
  },
  {
    name: "get_hazard_facts", description: "Published facts on one hazard topic.",
    parameters: { type: "object", properties: { topic: { type: "string", enum: ["radiation", "dust", "suit_limits", "planet", "sound", "landing", "storms"] } }, required: ["topic"], additionalProperties: false },
    args: z.object({ topic: z.enum(["radiation", "dust", "suit_limits", "planet", "sound", "landing", "storms"]) }),
    run: (a: { topic: string }, c) => factVals(c, {
      radiation: ["RAD-01", "RAD-03", "RAD-04", "RAD-05", "RAD-07"], dust: ["DUST-01", "DUST-02", "DUST-03"], suit_limits: ["EVA-01", "EVA-02", "EVA-03", "EVA-04", "EVA-05"],
      planet: ["PLN-01", "PLN-02", "PLN-03", "PLN-04", "PLN-05", "PLN-12"], sound: ["SND-01"], landing: ["EDL-01", "EDL-02"], storms: ["EVT-02", "EVT-03"],
    }[a.topic] ?? []),
  },
  {
    name: "get_event", description: "The active event on the walk (dust devil or solar storm alert), with its real reference numbers.",
    parameters: noArgs, args: empty,
    run: (_a, c) => c.event === "dust-devil" ? factVals(c, ["EVT-01", "WX-02"]) : c.event === "solar-storm" ? factVals(c, ["RAD-05", "RAD-04", "RAD-01"]) : { values: { activeEvent: "none" }, factIds: [], sourceIds: [] },
  },
  {
    name: "search_sources", description: "Search the curated source cards to answer 'why' questions. Returns short summaries and their sources.",
    parameters: { type: "object", properties: { query: { type: "string" } }, required: ["query"], additionalProperties: false },
    args: z.object({ query: z.string().max(200) }),
    run: (a: { query: string }, c) => {
      const hits = searchCorpus(c.data.corpus, a.query);
      return { values: Object.fromEntries(hits.map((h) => [h.title, h.text])), factIds: [], sourceIds: [...new Set(hits.flatMap((h) => h.sourceIds))] };
    },
  },
];

export const toolSchemas = () => TOOLS.map(({ name, description, parameters }) => ({ name, description, parameters }));

export function runTool(name: string, rawArgs: string, ctx: ToolCtx): ToolResult & { error?: string } {
  const tool = TOOLS.find((t) => t.name === name);
  if (!tool) return { values: {}, factIds: [], sourceIds: [], error: `Unknown tool ${name}` };
  let parsed: unknown;
  try { parsed = JSON.parse(rawArgs || "{}"); } catch { return { values: {}, factIds: [], sourceIds: [], error: "Arguments were not JSON" }; }
  const ok = tool.args.safeParse(parsed);
  if (!ok.success) return { values: {}, factIds: [], sourceIds: [], error: ok.error.issues[0]?.message ?? "Invalid arguments" };
  return tool.run(ok.data as never, ctx);
}
