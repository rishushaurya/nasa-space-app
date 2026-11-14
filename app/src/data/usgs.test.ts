// Golden checks on real USGS records: Trek's identify answer at Gale and the snapshotted map catalogue.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { fmtScale, mapsAt, parseUnit, type GeoMap } from "./usgs";

describe("USGS geology", () => {
  it("reads the rock unit from Trek's identify response at Gale (14 Nov 2026)", () => {
    const real = { results: [{ layerId: 0, layerName: "SIM3292_Global_Geology", displayFieldName: "Unit", value: "AHi",
      attributes: { FID: "774", Unit: "AHi", UnitDesc: "Amazonian and Hesperian impact unit", SphArea_km: "87031.101563" } }] };
    expect(parseUnit(real)).toEqual({ unit: "AHi", description: "Amazonian and Hesperian impact unit" });
    expect(parseUnit({ results: [] })).toBeNull();
    expect(parseUnit({ error: { code: 400 } })).toBeNull();
  });

  const all = (JSON.parse(readFileSync("app/public/data/usgs/mars-maps.json", "utf8")) as { maps: GeoMap[] }).maps;
  it("lists Jezero's own 1:75,000 map first", () => {
    const here = mapsAt(all, { lat: 18.45, lon: 77.45 });
    expect(here[0]?.number).toBe("SIM 3464");
    expect(here.some((m) => m.number === "SIM 3292")).toBe(true); // the global map covers everywhere
  });
  it("finds the Meridiani Planum map at Opportunity's site", () => {
    expect(mapsAt(all, { lat: -2.0, lon: -5.5 }).map((m) => m.number)).toContain("SIM 3356");
  });
  it("formats a scale", () => expect(fmtScale(75000)).toBe("1:75,000"));
});
