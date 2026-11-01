// Homeward | app/src/globe/layers.test.ts | v2.0.0 | 2026-11-01
import { describe, expect, it } from "vitest";
import * as Cesium from "cesium";
import { ocToOg } from "../core/frames";
import { OcentricTiling } from "./layers";

describe("planetocentric tiles on the IAU ellipsoid", () => {
  const t = new OcentricTiling(Cesium.Ellipsoid.MARS);
  const BRADBURY = { lat: -4.589467, lon: 137.441633 }; // planetocentric (SITE-01)
  it("finds the tile that holds Bradbury Landing in planetocentric rows, from a geodetic position", () => {
    const level = 12, n = 180 / 2 ** level; // degrees per tile at this level (2 x 1 tiles at level 0)
    const xy = t.positionToTileXY(Cesium.Cartographic.fromDegrees(BRADBURY.lon, ocToOg(BRADBURY.lat)), level);
    expect(xy.y).toBe(Math.floor((90 - BRADBURY.lat) / n));
    expect(xy.x).toBe(Math.floor((BRADBURY.lon + 180) / n));
    const r = t.tileXYToRectangle(xy.x, xy.y, level);
    const northC = 90 - xy.y * n;
    expect(Cesium.Math.toDegrees(r.north)).toBeCloseTo(ocToOg(northC), 9);
    // Without the conversion the edge would be this far off (about 0.054 deg, 3.2 km at Gale):
    expect(Math.abs(ocToOg(northC) - northC)).toBeGreaterThan(0.05);
  });
  it("keeps the poles and the equator fixed", () => {
    expect(Cesium.Math.toDegrees(t.tileXYToRectangle(0, 0, 0).north)).toBeCloseTo(90, 9);
    expect(Cesium.Math.toDegrees(t.tileXYToRectangle(0, 0, 1).south)).toBeCloseTo(0, 9); // level 1: 4 x 2 tiles, row 0 is the north half
    expect(Cesium.Math.toDegrees(t.tileXYToRectangle(0, 1, 1).south)).toBeCloseTo(-90, 9);
  });
});
