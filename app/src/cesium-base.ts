// Homeward | app/src/cesium-base.ts | v1.0.0 | 2026-10-29
// Must be imported before anything that loads Cesium: tells Cesium where its workers and assets live.
(window as unknown as { CESIUM_BASE_URL: string }).CESIUM_BASE_URL = "/cesium/";
export {};
