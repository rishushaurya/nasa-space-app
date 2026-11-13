// Homeward | app/src/globe/dem.worker.ts | v3.0.0 | 2026-11-13
// Fetches and decodes MOLA-HRSC 200 m elevation tiles (Esri OnMars MDEM200M, LERC) off the main thread (PLAN-3 D21).
// Heights are rounded to whole metres in an Int16Array (Mars spans -8,210 to 21,241 m), half the memory of Float32.
import Lerc from "lerc";

const URL_TILE = "https://astro.arcgis.com/arcgis/rest/services/OnMars/MDEM200M/ImageServer/tile";

self.onmessage = async (e: MessageEvent<{ id: number; z: number; y: number; x: number }>) => {
  const { id, z, y, x } = e.data;
  try {
    const r = await fetch(`${URL_TILE}/${z}/${y}/${x}`, { credentials: "omit" });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const img = Lerc.decode(await r.arrayBuffer()) as { width: number; height: number; pixels: Float32Array[]; mask?: Uint8Array };
    const src = img.pixels[0]!, out = new Int16Array(src.length);
    for (let i = 0; i < src.length; i++) out[i] = img.mask && !img.mask[i] ? -32768 : Math.round(src[i]!);
    (self as unknown as Worker).postMessage({ id, w: img.width, h: img.height, data: out }, [out.buffer]);
  } catch (err) {
    (self as unknown as Worker).postMessage({ id, error: String((err as Error).message ?? err) });
  }
};
