// Homeward | scripts/copy-cesium.mjs | v1.0.0 | 2026-10-29
// Copies Cesium's runtime assets next to the app (they are loaded from CESIUM_BASE_URL).
import { cpSync, existsSync } from "node:fs";

const src = "node_modules/cesium/Build/Cesium";
const dst = "app/public/cesium";
if (!existsSync(`${dst}/Workers`)) {
  for (const dir of ["Workers", "ThirdParty", "Assets", "Widgets"]) cpSync(`${src}/${dir}`, `${dst}/${dir}`, { recursive: true });
  console.log("Cesium assets copied to", dst);
}
