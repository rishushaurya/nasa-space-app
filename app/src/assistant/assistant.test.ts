// Homeward | app/src/assistant/assistant.test.ts | v1.0.0 | 2026-10-29
import { describe, expect, it } from "vitest";
import { answerOffline } from "./offline";
import { runTool, type ToolCtx } from "./tools";

// Only the fields check_extra_time reads: life-support slack 250 min, daylight slack 100 min.
const ctx = { event: null, plan: { result: { ok: true, budgets: { lifeSupport: { limitMin: 450, usedMin: 200 }, daylight: { marginMin: 100 } } } } } as unknown as ToolCtx;

describe("check_extra_time", () => {
  it("is limited by the tighter budget", () => {
    const r = runTool("check_extra_time", JSON.stringify({ minutes: 20 }), ctx).values;
    expect(r).toMatchObject({ maxExtraMin: 100, limitedBy: "daylight", fits: "yes" });
    expect(runTool("check_extra_time", JSON.stringify({ minutes: 120 }), ctx).values.fits).toBe("no");
  });
  it("answers the extend question offline with the parsed minutes", () => {
    const a = answerOffline("Should we extend the stop by 20 minutes?", ctx, "mission-control");
    expect(a.text).toMatch(/^Yes, 20 more minutes at the stop fits\. The plan can take at most 100 extra minutes before daylight runs short/);
    expect(a.text.endsWith("Mission Control.")).toBe(true);
  });
});
