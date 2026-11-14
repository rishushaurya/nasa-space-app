// Homeward | app/src/globe/layers.ts | v3.0.0 | 2026-11-13
// Live imagery streamed like Google Earth: NASA Mars Trek and Esri OnMars tiles (both send CORS headers). They are
// 2x1 geographic tiles on the Mars 2000 sphere, so latitude is planetocentric; our globe is the IAU ellipsoid with
// geodetic latitude. Without converting tile edges they would sit 3.2 km off at Gale and about 20 km at 45 deg (D7).
import * as Cesium from "cesium";
import { ocToOg, ogToOc } from "../core/frames";
import { LIVE, type LiveId } from "./live";

const R2D = 180 / Math.PI;

/** Geographic tiling whose rows are planetocentric: tile edges are converted to geodetic for Cesium. */
export class OcentricTiling extends Cesium.GeographicTilingScheme {
  constructor(ellipsoid: Cesium.Ellipsoid) { super({ ellipsoid, numberOfLevelZeroTilesX: 2, numberOfLevelZeroTilesY: 1 }); }
  override tileXYToRectangle(x: number, y: number, level: number, result?: Cesium.Rectangle): Cesium.Rectangle {
    const r = super.tileXYToRectangle(x, y, level, result);
    r.south = ocToOg(r.south * R2D) / R2D; r.north = ocToOg(r.north * R2D) / R2D;
    return r;
  }
  override positionToTileXY(position: Cesium.Cartographic, level: number, result?: Cesium.Cartesian2): Cesium.Cartesian2 {
    const p = Cesium.Cartographic.clone(position);
    p.latitude = ogToOc(p.latitude * R2D) / R2D;
    return super.positionToTileXY(p, level, result);
  }
}

/** A tile provider; `rect` (planetocentric degrees) keeps a local mosaic from requesting tiles it does not have, and
 *  `min` skips coarse levels a pyramid lacks (Trek's h1394 HRSC strip starts at level 4, whatever its WMTS file says). */
export function tileProvider(t: { url: string; size: number; max: number; min?: number; rect?: [number, number, number, number] }, ellipsoid: Cesium.Ellipsoid, alpha: boolean, onError: () => void) {
  const p = new Cesium.UrlTemplateImageryProvider({ url: t.url, tilingScheme: new OcentricTiling(ellipsoid), tileWidth: t.size, tileHeight: t.size, minimumLevel: t.min ?? 0, maximumLevel: t.max, hasAlphaChannel: alpha,
    ...(t.rect ? { rectangle: Cesium.Rectangle.fromDegrees(t.rect[0], ocToOg(t.rect[1]), t.rect[2], ocToOg(t.rect[3])) } : {}) });
  p.errorEvent.addEventListener(onError); // a listener also stops Cesium logging every failed tile
  return p;
}

export const liveProvider = (id: LiveId, ellipsoid: Cesium.Ellipsoid, onError: () => void) => tileProvider(LIVE[id], ellipsoid, id === "hirise", onError);
