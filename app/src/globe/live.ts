// Homeward | app/src/globe/live.ts | v2.0.0 | 2026-11-01
// Live imagery layers (NASA Mars Trek and Esri OnMars tiles). Plain data, so scenes can list them without loading Cesium.
export type LiveId = "ctx" | "hirise" | "themis-day" | "themis-night" | "viking";
export const LIVE: Record<LiveId, { label: string; url: string; size: number; max: number; sourceId: string; note: string }> = {
  ctx: { label: "CTX 5 m (MRO)", url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/CTX/MapServer/tile/{z}/{y}/{x}", size: 512, max: 12, sourceId: "ONMARS-CTX", // level 12 is about 5 m per pixel, the mosaic's own resolution; deeper tiles are missing
    note: "Mars Reconnaissance Orbiter Context Camera, global at about 5 m per pixel (uncontrolled beta mosaic, so it can sit tens of metres off)" },
  hirise: { label: "HiRISE patches (MRO)", url: "https://astro.arcgis.com/arcgis/rest/services/OnMars/HiRISE/MapServer/tile/{z}/{y}/{x}", size: 512, max: 16, sourceId: "ONMARS-HIRISE",
    note: "HiRISE red-band images to about 25 cm where they exist; uncontrolled, so a patch can sit hundreds of metres off" },
  "themis-day": { label: "THEMIS day infrared (Odyssey)", url: "https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_DayIR_ControlledMosaics_100m_v2_oct2018/1.0.0//default/default028mm/{z}/{y}/{x}.png", size: 256, max: 11, sourceId: "TREK-THEMIS-DAY",
    note: "Mars Odyssey thermal camera by day, 100 m, 65 S to 65 N: bright is warm, mostly slopes facing the Sun" },
  "themis-night": { label: "THEMIS night infrared (Odyssey)", url: "https://trek.nasa.gov/tiles/Mars/EQ/THEMIS_NightIR_ControlledMosaics_100m_v2_oct2018/1.0.0//default/default028mm/{z}/{y}/{x}.png", size: 256, max: 11, sourceId: "TREK-THEMIS-NIGHT",
    note: "Mars Odyssey thermal camera at night, 100 m: bright stays warm, so rock and bedrock; dark is dust and sand" },
  viking: { label: "Viking colour 232 m", url: "https://trek.nasa.gov/tiles/Mars/EQ/Mars_Viking_MDIM21_ClrMosaic_global_232m/1.0.0//default/default028mm/{z}/{y}/{x}.jpg", size: 256, max: 7, sourceId: "TREK-VIKING",
    note: "Viking orbiters' colour mosaic at 232 m (the offline globe uses our own copy)" },
};
