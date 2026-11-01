// Homeward | app/src/rovers/raw.test.ts | v2.0.0 | 2026-11-01
import { describe, expect, it } from "vitest";
import { atStop, forStop, pickFrames, resolveStop, type Frame, type Stop } from "./raw";
import { parseCahv, parseQuat } from "../core/camera";

const stop = (site: number, drive: number, sol: number, i = 0): Stop => ({ i, site, drive, sol, lat: 0, lon: 0, elev: 0, yaw: 0, distM: 0 });
const MODEL = "(0.939641,0.75466,-1.84547);(-0.340077,0.596884,0.726678);(-1237.1,-302.686,367.626);(268.703,-474.285,1206.33)";
const frame = (site: number | null, drive: number | null, o: Partial<Frame> = {}): Frame => ({ id: `${site}-${drive}-${Math.random()}`, cam: "NAV_LEFT_B", sol: 1, site, drive, lmst: null, utc: null,
  src: "", thumb: "", big: "", link: "", credit: "", sample: "full", w: 1024, h: 1024, model: parseCahv(MODEL), att: parseQuat("(1,0,0,0)"), ...o });

describe("rover stops and frames", () => {
  const stops = [stop(2, 0, 3), stop(3, 0, 13), stop(3, 110, 14), stop(4, 0, 20)];
  it("a frame belongs to the latest stop at or before its motion counter", () => {
    expect(atStop(frame(3, 8), stops[1]!, stops[2])).toBe(true); // Perseverance sol 13: 3_8 at waypoint 3_0
    expect(atStop(frame(3, 110), stops[1]!, stops[2])).toBe(false);
    expect(atStop(frame(3, 500), stops[2]!, stops[3])).toBe(true); // next stop is a new site
    expect(atStop(frame(null, null), stops[1]!, stops[2])).toBe(false);
  });
  it("prefers frames at exactly the stop's counter when there are enough", () => {
    const exact = Array.from({ length: 10 }, (_, k) => frame(3, 0, { att: parseQuat(`(${Math.cos(k * 0.3)},0,0,${Math.sin(k * 0.3)})`) }));
    expect(forStop([...exact, frame(3, 50)], stops[1]!, stops[2]).exact).toBe(true);
    expect(forStop([frame(3, 8), frame(3, 16)], stops[1]!, stops[2]).exact).toBe(false);
  });
  it("keeps one frame per direction (the largest) and drops thumbnails and frames without a model", () => {
    const small = frame(3, 0, { w: 1000, h: 1000 }), big = frame(3, 0), thumb = frame(3, 0, { sample: "thumbnail" }), bare = frame(3, 0, { model: null });
    expect(pickFrames([small, big, thumb, bare])).toEqual([big]);
  });
  it("resolves a counter to its stop; site 0 starts the mission (Curiosity from sol 13)", () => {
    expect(resolveStop(stops, 3, 50, "m20")).toBe(1);
    expect(resolveStop(stops, 9, 0, "m20")).toBe(3);
    expect(resolveStop(stops, 0, 0, "msl")).toBe(1);
    expect(resolveStop(stops, 0, 0, "m20")).toBe(0);
  });
});
