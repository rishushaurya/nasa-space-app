// Homeward | app/src/rovers/library.test.ts | v3.0.0 | 2026-11-13
import { describe, expect, it } from "vitest";
import { libraryPhotos } from "./library";

const item = (nasa_id: string, title: string, description = "", href = `http://images-assets.nasa.gov/image/${nasa_id}/${nasa_id}~thumb.jpg`) =>
  ({ data: [{ nasa_id, title, description, date_created: "1997-02-28T00:00:00Z", secondary_creator: "NASA/JPL", center: "JPL" }], links: [{ href }] });

describe("NASA image library filter", () => {
  // Shapes copied from a real response (search "Viking Lander 1", 13 Nov 2026).
  const json = { collection: { items: [
    item("PIA03165", "Afternoon on Chryse Planitia - Viking Lander 1 Camera 1 Mosaic"),
    item("PIA00563", "First Color Image From Viking Lander 1"),
    item("PIA19811", "Artist Concept of InSight Lander on Mars"),
    item("PIA00568", "First Color Image of the Viking Lander 2 Site"),
    item("PIA99999", "Viking Lander 1 elsewhere", "", "https://example.com/x~thumb.jpg"),
    item("PIA03250", "Sweeping View of the Columbia", "Spirit took this panorama", "http://images-assets.nasa.gov/image/PIA03250/PIA03250~small.jpg"),
  ] } };

  it("keeps the lander's own photos, upgraded to https, with medium size and NASA page", () => {
    const out = libraryPhotos(json, "viking1");
    expect(out.map((p) => p.id)).toEqual(["PIA03165", "PIA00563"]);
    expect(out[0]).toMatchObject({ thumb: "https://images-assets.nasa.gov/image/PIA03165/PIA03165~thumb.jpg",
      medium: "https://images-assets.nasa.gov/image/PIA03165/PIA03165~medium.jpg", link: "https://images.nasa.gov/details/PIA03165", date: "1997-02-28", credit: "NASA/JPL" });
  });
  it("drops artist concepts, other landers and foreign hosts", () => {
    expect(libraryPhotos(json, "insight")).toEqual([]);
    expect(libraryPhotos(json, "viking2").map((p) => p.id)).toEqual(["PIA00568"]);
  });
  it("accepts any preview size NASA links (Spirit's come as ~small)", () => {
    expect(libraryPhotos(json, "spirit")[0]).toMatchObject({ id: "PIA03250", thumb: "https://images-assets.nasa.gov/image/PIA03250/PIA03250~small.jpg",
      medium: "https://images-assets.nasa.gov/image/PIA03250/PIA03250~medium.jpg", orig: "https://images-assets.nasa.gov/image/PIA03250/PIA03250~orig.jpg" });
  });
  it("keeps a pinned official resource even when its caption says animation (PIA23179)", () => {
    const pia = { collection: { items: [item("PIA23179", "Curiosity's Proposed Path up Mount Sharp", "This animation shows a proposed route for NASA's Curiosity rover")] } };
    expect(libraryPhotos(pia, "curiosity")).toEqual([]);
    expect(libraryPhotos(pia, "curiosity", 1, true).map((p) => p.id)).toEqual(["PIA23179"]);
  });
  it("returns nothing for a malformed response or an unknown lander", () => {
    expect(libraryPhotos({ nope: 1 }, "viking1")).toEqual([]);
    expect(libraryPhotos(json, "nowhere")).toEqual([]);
  });
});
