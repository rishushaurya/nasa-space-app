// Homeward | app/src/core/conditions.test.ts | v3.0.0 | 2026-11-13
import { describe, expect, it } from "vitest";
import { donkiMs, latestRems } from "./conditions";

describe("Curiosity REMS feed", () => {
  // The first rows of NASA's MSL weather feed as read on 13 Nov 2026, plus a row with missing temperatures.
  const feed = { soles: [
    { id: "4746", terrestrial_date: "2026-08-25", sol: "4995", ls: "341", season: "Month 12", min_temp: "-71", max_temp: "-5", pressure: "777", local_uv_irradiance_index: "Moderate", atmo_opacity: "Sunny", sunrise: "06:46", sunset: "18:51", min_gts_temp: "-84", max_gts_temp: "4" },
    { id: "4747", terrestrial_date: "2026-08-26", sol: "4996", min_temp: "--", max_temp: "--", pressure: "--" },
    { id: "4745", terrestrial_date: "2026-08-24", sol: "4994", min_temp: "-72", max_temp: "-6", pressure: "776" },
  ] };
  it("takes the newest sol that has temperatures, with numbers parsed", () => {
    expect(latestRems(feed)).toEqual({ sol: 4995, earthDate: "2026-08-25", ls: 341, season: "Month 12", minC: -71, maxC: -5, groundMinC: -84, groundMaxC: 4, pressurePa: 777, uv: "Moderate", sky: "Sunny", sunrise: "06:46", sunset: "18:51" });
  });
  it("returns null for a malformed feed", () => { expect(latestRems({})).toBeNull(); expect(latestRems({ soles: [{ sol: "x" }] })).toBeNull(); });
});

describe("DONKI times", () => {
  it("parses minute-precision UTC", () => expect(donkiMs("2026-11-13T12:00Z")).toBe(Date.UTC(2026, 10, 13, 12)));
});
