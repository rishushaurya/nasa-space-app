// Homeward | app/src/core/places.test.ts | v2.0.0 | 2026-11-01
import { describe, expect, it } from "vitest";
import { parseLatLon, searchPlaces, type Place } from "./places";

const P = (kind: Place["kind"], name: string, sizeKm?: number): Place => ({ kind, id: name, name, p: { lat: 0, lon: 0 }, detail: "", sizeKm });
const all = [P("feature", "Gale", 154), P("feature", "Galle", 230), P("feature", "Jezero", 49), P("feature", "Arsia Mons", 435), P("lander", "Perseverance and Ingenuity"), P("feature", "Mawrth Vallis", 636)];

describe("place search", () => {
  it("parses typed coordinates in common forms", () => {
    expect(parseLatLon("4.59 S, 137.44 E")).toEqual({ lat: -4.59, lon: 137.44 });
    expect(parseLatLon("-4.59 137.44")).toEqual({ lat: -4.59, lon: 137.44 });
    const v1 = parseLatLon("22.27N 312.05E")!; // 0-360 east input wraps to -180..180
    expect(v1.lat).toBe(22.27);
    expect(v1.lon).toBeCloseTo(-47.95, 9);
    expect(parseLatLon("91 0")).toBeNull();
    expect(parseLatLon("Gale")).toBeNull();
  });
  it("ranks exact over prefix, and finds landers by any word", () => {
    expect(searchPlaces("gale", all).map((p) => p.name)).toEqual(["Gale"]);
    expect(searchPlaces("gal", all).map((p) => p.name)).toEqual(["Galle", "Gale"]); // same rank, bigger first
    expect(searchPlaces("ingen", all)[0]!.name).toBe("Perseverance and Ingenuity");
    expect(searchPlaces("mons", all)[0]!.name).toBe("Arsia Mons");
    expect(searchPlaces("x", all)).toEqual([]);
  });
});
