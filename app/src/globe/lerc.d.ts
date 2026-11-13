// Homeward | app/src/globe/lerc.d.ts | v3.0.0 | 2026-11-13
// The lerc 2.0.0 package (Esri, Apache-2.0) ships no types; only decode is used (dem.worker.ts).
declare module "lerc" {
  const Lerc: { decode(input: ArrayBuffer, options?: Record<string, unknown>): unknown };
  export default Lerc;
}
