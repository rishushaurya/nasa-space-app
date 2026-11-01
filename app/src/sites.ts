// Homeward | app/src/sites.ts | v1.0.0 | 2026-10-29
// The two walk zones. Coordinates are MMGIS waypoints (facts SITE-01/02/10/11), planetocentric east.
import type { LatLon } from "./core/frames";

export type ZoneId = "gale" | "boxwork";
export type Zone = {
  id: ZoneId; title: string; short: string;
  home: LatLon; homeName: string; homeFact: string;
  stop: LatLon; stopName: string; stopFact: string; scienceFacts: string[]; distanceFact: string;
  photoSol: number; why: string; landingLonE: number;
  rover: { m: "msl"; site: number; drive: number }; // Curiosity's stop at the science site, for Rover view
};

export const ZONES: Record<ZoneId, Zone> = {
  gale: {
    id: "gale", short: "Yellowknife Bay", title: "Bradbury Landing to Yellowknife Bay",
    home: { lat: -4.589467, lon: 137.441633 }, homeName: "Habitat at Bradbury Landing", homeFact: "SITE-01",
    stop: { lat: -4.58948488, lon: 137.4491296 }, stopName: "Sheepbed mudstone, Yellowknife Bay", stopFact: "SITE-02",
    scienceFacts: ["SCI-01", "SCI-02"], distanceFact: "SITE-03", photoSol: 182, landingLonE: 137.4417, rover: { m: "msl", site: 6, drive: 0 },
    why: "Curiosity drilled this rock on sol 182 and found the first proof that Mars was once habitable: an ancient lake.",
  },
  boxwork: {
    id: "boxwork", short: "Boxwork ridges", title: "Rover drop-off to the boxwork ridges, Mount Sharp",
    home: { lat: -4.804189, lon: 137.3796858 }, homeName: "Pressurised rover (Curiosity's sol 4600 spot)", homeFact: "SITE-10",
    stop: { lat: -4.80799931, lon: 137.3810495 }, stopName: "Boxwork ridge Curiosity studied (sols 4709-4789)", stopFact: "SITE-11",
    scienceFacts: ["SCI-05"], distanceFact: "SITE-12", photoSol: 4709, landingLonE: 137.4417, rover: { m: "msl", site: 120, drive: 0 },
    why: "Ridges one to two metres tall record groundwater flowing through fractures. The official challenge page uses boxwork as its example science goal.",
  },
};
