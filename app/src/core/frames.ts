// Homeward | app/src/core/frames.ts | v1.0.0 | 2026-10-29
// One place for coordinate conventions (README D7). Internal form: planetocentric latitude, east longitude.
// Cesium on Ellipsoid.MARS uses geodetic (planetographic) latitude on the IAU 2015 ellipsoid.

export const MARS_A_M = 3396190; // IAU 2015 equatorial radius
export const MARS_B_M = 3376200; // IAU 2015 polar radius
export const MARS_SPHERE_M = 3396190; // radius of the sphere the USGS products use
export const EARTH_MEAN_R_M = 6371008.8; // IUGG mean Earth radius, for the Earth analog panel (PLAN-4 D33)
const D2R = Math.PI / 180;
const K = (MARS_A_M / MARS_B_M) ** 2;

export type LatLon = { lat: number; lon: number }; // planetocentric deg, east deg

export const ocToOg = (latC: number) => Math.atan(Math.tan(latC * D2R) * K) / D2R;
export const ogToOc = (latG: number) => Math.atan(Math.tan(latG * D2R) / K) / D2R;
export const westToEast = (lonW: number) => (((360 - lonW) % 360) + 360) % 360;

/** Degrees for Cesium (Cartographic.fromDegrees): longitude east, geodetic latitude. */
export const toCesium = (p: LatLon) => ({ lon: p.lon, lat: ocToOg(p.lat) });

export function haversineM(a: LatLon, b: LatLon, r = MARS_SPHERE_M): number {
  const la1 = a.lat * D2R, la2 = b.lat * D2R, dla = la2 - la1, dlo = (b.lon - a.lon) * D2R;
  const h = Math.sin(dla / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dlo / 2) ** 2;
  return 2 * r * Math.asin(Math.sqrt(h));
}

/** Horizon distance for an eye at height h on a sphere of radius r. */
export const horizonM = (h: number, r = 3389500) => Math.sqrt(2 * r * h);

/** Initial bearing from a to b, degrees clockwise from north (sphere). */
export function bearingDeg(a: LatLon, b: LatLon): number {
  const y = Math.sin((b.lon - a.lon) * D2R) * Math.cos(b.lat * D2R);
  const x = Math.cos(a.lat * D2R) * Math.sin(b.lat * D2R) - Math.sin(a.lat * D2R) * Math.cos(b.lat * D2R) * Math.cos((b.lon - a.lon) * D2R);
  return (Math.atan2(y, x) / D2R + 360) % 360;
}

/** Point m metres from p along a bearing (flat approximation; fine below a few km). */
export function offsetM(p: LatLon, bearing: number, m: number, r = MARS_SPHERE_M): LatLon {
  const d = m / r;
  return { lat: p.lat + (d * Math.cos(bearing * D2R)) / D2R, lon: p.lon + (d * Math.sin(bearing * D2R)) / D2R / Math.cos(p.lat * D2R) };
}

export const FLY_MIN_M = 2, FLY_MAX_M = 300_000;
/** One frame of free flight (Walk scene, Fly mode): `fwd` and `up` are -1, 0 or 1; climbing runs at half the
 *  ground speed. Height is above the ground, clamped; latitude stops short of the poles; longitude wraps. */
export function flyStep(p: LatLon, heightM: number, headingDeg: number, fwd: number, up: number, speedMs: number, dt: number): { p: LatLon; heightM: number } {
  const n = fwd ? offsetM(p, headingDeg + (fwd < 0 ? 180 : 0), speedMs * dt) : p;
  return {
    p: { lat: Math.max(-89, Math.min(89, n.lat)), lon: ((n.lon + 540) % 360) - 180 },
    heightM: Math.max(FLY_MIN_M, Math.min(FLY_MAX_M, heightM + up * speedMs * 0.5 * dt)),
  };
}
