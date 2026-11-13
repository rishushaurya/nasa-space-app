// Homeward | app/src/globe/dem.test.ts | v3.0.0 | 2026-11-13
import { describe, expect, it } from "vitest";
import { demTileAt, sampleTile } from "./dem";

describe("MDEM200M tiling (2x1 at level 0, origin -180, 90)", () => {
  it("puts Gale in the right tile at levels 0 and 7", () => {
    expect(demTileAt(-4.5895, 137.4416, 0)).toMatchObject({ x: 1, y: 0 });
    const t = demTileAt(-4.5895, 137.4416, 7); // 1.40625 deg tiles
    expect(t.x).toBe(Math.floor((137.4416 + 180) / 1.40625));
    expect(t.y).toBe(Math.floor((90 + 4.5895) / 1.40625));
  });
  it("wraps east longitudes above 180", () => expect(demTileAt(0, 350, 0).x).toBe(0));
  it("interpolates bilinearly and skips no-data", () => {
    const t = { w: 2, h: 2, data: new Int16Array([0, 10, 20, 30]) };
    expect(sampleTile(t, 0.5, 0.5)).toBeCloseTo(15, 1);
    expect(sampleTile({ ...t, data: new Int16Array([0, -32768, 20, 30]) }, 0.5, 0.5)).toBeUndefined();
  });
});
