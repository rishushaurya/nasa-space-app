// Homeward | app/src/globe/live.ts | v3.0.0 | 2026-11-13
// Live imagery layers (NASA Mars Trek and Esri OnMars tiles). Plain data, so scenes can list them without loading Cesium.
export type LiveId = "ctx" | "hirise" | "themis-day" | "themis-night" | "viking";
type Tiles = { url: string; size: number; max: number; min?: number; rect?: [west: number, south: number, east: number, north: number] };
const TREK = (layer: string, ext = "png") => `https://trek.nasa.gov/tiles/Mars/EQ/${layer}/1.0.0//default/default028mm/{z}/{y}/{x}.${ext}`;

export const LIVE: Record<LiveId, Tiles & { label: string; sourceId: string; note: string }> = {
  ctx: { label: "CTX 5 m (MRO)", url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/{z}/{y}/{x}", size: 512, max: 12, sourceId: "ONMARS-CTX", // level 12 is about 5 m per pixel, the mosaic's own resolution; deeper tiles are missing
    note: "Mars Reconnaissance Orbiter Context Camera, global at about 5 m per pixel (uncontrolled beta mosaic, so it can sit tens of metres off)" },
  hirise: { label: "HiRISE patches (MRO)", url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/HiRISE/MapServer/tile/{z}/{y}/{x}", size: 512, max: 16, sourceId: "ONMARS-HIRISE",
    note: "HiRISE red-band images to about 25 cm where they exist; uncontrolled, so a patch can sit hundreds of metres off" },
  "themis-day": { label: "THEMIS day infrared (Odyssey)", url: TREK("THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018"), size: 256, max: 11, sourceId: "TREK-THEMIS-DAY",
    note: "Mars Odyssey thermal camera by day, 100 m, 65 S to 65 N: bright is warm, mostly slopes facing the Sun" },
  "themis-night": { label: "THEMIS night infrared (Odyssey)", url: TREK("THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018"), size: 256, max: 11, sourceId: "TREK-THEMIS-NIGHT",
    note: "Mars Odyssey thermal camera at night, 100 m: bright stays warm, so rock and bedrock; dark is dust and sand" },
  viking: { label: "Viking colour 232 m", url: TREK("Mars_Viking_MDIM21_ClrMosaic_global_232m", "jpg"), size: 256, max: 7, sourceId: "TREK-VIKING",
    note: "Viking orbiters' colour mosaic at 232 m (the offline globe uses our own copy)" },
};

/** Overlays drawn over the ground imagery at one shared opacity (PLAN-3 chunk 20). Several can be on at once. */
export const OVERLAY_IDS = ["relief", "geology", "thermal", "dust", "sites"] as const;
export type OverlayId = (typeof OVERLAY_IDS)[number];
export const OVERLAYS: Record<OverlayId, { label: string; sourceId: string; kind: string; note: string; parts: Tiles[] }> = {
  relief: { label: "Shaded relief, coloured by height", sourceId: "TREK-MOLA-HRSC-SHADE", kind: "Topographic",
    note: "MOLA laser altimeter and HRSC stereo, 200 m: blue is low, red and white are high", parts: [{ url: TREK("Mars_MOLA_blend200ppx_HRSC_ClrShade_clon0dd_200mpp_lzw", "jpg"), size: 256, max: 8 }] },
  geology: { label: "Geologic map (USGS SIM 3292)", sourceId: "TREK-GEOLOGY", kind: "Geologic",
    note: "Rock units by age and origin, mapped at 1:20,000,000 (Tanaka et al. 2014); unit colours follow the USGS legend",
    parts: [{ url: "https://trek.nasa.gov/mars/trekarcgis/rest/services/SIM3292_Global_Geology/MapServer/WMTS/tile/1.0.0/SIM3292_Global_Geology/default/default028mm/{z}/{y}/{x}.png", size: 256, max: 11 }] },
  thermal: { label: "Thermal inertia (MGS TES)", sourceId: "TREK-TES-TI", kind: "Thermal",
    note: "How well the ground holds heat, about 3 km per pixel: high is rock or crust (firm footing), low is loose dust", parts: [{ url: TREK("TES_Thermal_Inertia"), size: 256, max: 1 }] },
  dust: { label: "Dust cover (MGS TES)", sourceId: "TREK-TES-DUST", kind: "Spectral",
    note: "Dust cover index from the thermal spectrometer: where fine dust blankets the surface (a suit and seal hazard)", parts: [{ url: TREK("TES_Dust"), size: 256, max: 1 }] },
  sites: { label: "Landing-site mosaics (to 25 cm)", sourceId: "TREK-SITE-HIRISE", kind: "Optical",
    note: "Mars Trek's landing-site mosaics: HiRISE at Jezero, the Spirit and Opportunity roving sites and the Phoenix and InSight landing sites; HiRISE, CTX and HRSC at Viking 1 and Viking 2 (PLAN-4 D28)",
    // Each part is bounded by its WMTS footprint; coarse images first so the sharper ones draw over them.
    parts: [
      { url: TREK("h2942_0000_nd3"), size: 256, max: 10, rect: [-49.5924, 14.0680, -46.3979, 26.8116] }, // Viking 1, Mars Express HRSC
      { url: TREK("Viking_CTX_BlockAdj_dd"), size: 256, max: 12, rect: [-50.1289, 20.6080, -46.4711, 23.9921] }, // Viking 1, MRO CTX
      { url: TREK("PSP_001521_2025_RED"), size: 256, max: 17, rect: [-48.0316, 22.0912, -47.8628, 22.4609] }, // Viking 1, MRO HiRISE
      { url: TREK("h1394_0000_nd3"), size: 256, min: 4, max: 9, rect: [73.0889, 46.0494, 174.8215, 87.0653] }, // Viking 2, Mars Express HRSC; tiles exist from level 4 only
      { url: TREK("b16_015887_2280_xn_48n225w"), size: 256, max: 12, rect: [133.7853, 46.3961, 135.0174, 48.9849] }, // Viking 2, MRO CTX
      { url: TREK("PSP_001501_2280_RED"), size: 256, max: 16, rect: [134.1990, 47.5634, 134.3996, 47.7836] }, // Viking 2, MRO HiRISE
      { url: TREK("JEZ_hirise_soc_006_orthoMosaic_25cm_Eqc_latTs0_lon0_first_dd"), size: 256, max: 17, rect: [77.2229, 18.3068, 77.5840, 18.6693] },
      { url: TREK("spirit_hirise_mosaic"), size: 256, max: 17, rect: [175.4279, -14.6925, 175.5858, -14.5358] },
      { url: TREK("opportunity_hirise_mosaic"), size: 256, max: 17, rect: [-5.5964, -2.7513, -4.9954, -1.8994] },
      { url: TREK("phoenix_hirise_mosaic"), size: 256, max: 16, rect: [-125.8898, 68.1660, -125.6608, 68.2499] },
      { url: TREK("ESP_058005_1845_RED_spline_rect"), size: 256, max: 17, rect: [135.5688, 4.3305, 135.6963, 4.6680] },
    ] },
};
