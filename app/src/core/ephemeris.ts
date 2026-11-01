// Homeward | app/src/core/ephemeris.ts | v1.0.0 | 2026-10-29
// JPL approximate planetary elements, Table 1 (1800-2050): https://ssd.jpl.nasa.gov/planets/approx_pos.html
// Mars position accuracy about 25,000 km, enough for light time to well under a second.
import { jdTT, marsTime } from "./mars-time";

type El = [number, number][]; // [value, rate per century] for a, e, I, L, long.peri, long.node
const EL: Record<"em" | "mars", El> = {
  em: [[1.00000261, 0.00000562], [0.01671123, -0.00004392], [-0.00001531, -0.01294668], [100.46457166, 35999.37244981], [102.93768193, 0.32327364], [0, 0]],
  mars: [[1.52371034, 0.00001847], [0.0939341, 0.00007882], [1.84969142, -0.00813131], [-4.55343205, 19140.30268499], [-23.94362959, 0.44441088], [49.55953891, -0.29257343]],
};
const D2R = Math.PI / 180;
export const AU_KM = 149597870.7;
export const C_KMS = 299792.458;
const OBLIQUITY = 23.43928 * D2R;

export type Vec3 = [number, number, number];

/** Heliocentric J2000 ecliptic position in au. */
export function helioEcliptic(body: "em" | "mars", utcMs: number): Vec3 {
  const T = (jdTT(utcMs) - 2451545.0) / 36525;
  const [a, e, I, L, wbar, Om] = EL[body].map(([v, r]) => v + r * T) as [number, number, number, number, number, number];
  const w = wbar - Om;
  const M = ((L - wbar + 180) % 360 + 360) % 360 - 180;
  const es = 57.29578 * e;
  let E = M + es * Math.sin(D2R * M);
  for (let i = 0; i < 50; i++) {
    const dE = (M - (E - es * Math.sin(D2R * E))) / (1 - e * Math.cos(D2R * E));
    E += dE;
    if (Math.abs(dE) <= 1e-6) break;
  }
  const xp = a * (Math.cos(D2R * E) - e), yp = a * Math.sqrt(1 - e * e) * Math.sin(D2R * E);
  const cw = Math.cos(D2R * w), sw = Math.sin(D2R * w), cO = Math.cos(D2R * Om), sO = Math.sin(D2R * Om), cI = Math.cos(D2R * I), sI = Math.sin(D2R * I);
  return [
    (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp,
    (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp,
    sw * sI * xp + cw * sI * yp,
  ];
}

const sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const norm = (a: Vec3): Vec3 => { const l = Math.hypot(...a); return [a[0] / l, a[1] / l, a[2] / l]; };
const cross = (a: Vec3, b: Vec3): Vec3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

export const earthMarsDistanceAu = (utcMs: number) => Math.hypot(...sub(helioEcliptic("mars", utcMs), helioEcliptic("em", utcMs)));
export const lightTimeMin = (utcMs: number) => (earthMarsDistanceAu(utcMs) * AU_KM) / C_KMS / 60;

/** Mars north pole (IAU 2009, Archinal et al. 2011; the 2015 form needs large periodic terms) as a J2000 ecliptic unit vector. */
function marsPoleEcliptic(utcMs: number): Vec3 {
  const T = (jdTT(utcMs) - 2451545.0) / 36525;
  const a0 = D2R * (317.68143 - 0.1061 * T), d0 = D2R * (52.8865 - 0.0609 * T);
  const eq: Vec3 = [Math.cos(d0) * Math.cos(a0), Math.cos(d0) * Math.sin(a0), Math.sin(d0)];
  return [eq[0], Math.cos(OBLIQUITY) * eq[1] + Math.sin(OBLIQUITY) * eq[2], -Math.sin(OBLIQUITY) * eq[1] + Math.cos(OBLIQUITY) * eq[2]];
}

/**
 * A J2000 ecliptic direction rotated into Mars body-fixed planetocentric lat/lon (east).
 * The body-fixed frame is anchored on the pole and the Mars24 subsolar longitude.
 */
export function eclipticToMarsFixed(dir: Vec3, utcMs: number): { latDeg: number; lonEDeg: number; unit: Vec3 } {
  const mars = helioEcliptic("mars", utcMs);
  const sunDir = norm([-mars[0], -mars[1], -mars[2]]);
  const v = norm(dir);
  const p = marsPoleEcliptic(utcMs);
  const x0 = norm(sub(sunDir, [p[0] * dot(sunDir, p), p[1] * dot(sunDir, p), p[2] * dot(sunDir, p)]));
  const y0 = cross(p, x0);
  const subsolarLonE = -marsTime(utcMs).subsolarLonWDeg;
  const lon = Math.atan2(dot(v, y0), dot(v, x0)) / D2R + subsolarLonE;
  const lat = Math.asin(Math.max(-1, Math.min(1, dot(v, p)))) / D2R;
  const lonE = ((lon % 360) + 360) % 360;
  const cl = Math.cos(lat * D2R);
  return { latDeg: lat, lonEDeg: lonE, unit: [cl * Math.cos(lonE * D2R), cl * Math.sin(lonE * D2R), Math.sin(lat * D2R)] };
}

/** Direction of the Sun or Earth as seen from Mars, in Mars body-fixed coordinates. */
export function directionFromMars(target: "sun" | "earth", utcMs: number) {
  const mars = helioEcliptic("mars", utcMs);
  return eclipticToMarsFixed(target === "sun" ? [-mars[0], -mars[1], -mars[2]] : sub(helioEcliptic("em", utcMs), mars), utcMs);
}

/** Angle between Earth and the Sun as seen from Mars, and whether Earth is east of the Sun (evening sky). */
export function earthElongation(utcMs: number): { deg: number; east: boolean } {
  const s = directionFromMars("sun", utcMs), e = directionFromMars("earth", utcMs);
  const deg = Math.acos(Math.max(-1, Math.min(1, dot(s.unit, e.unit)))) / D2R;
  const dl = ((e.lonEDeg - s.lonEDeg) % 360 + 360) % 360;
  return { deg, east: dl < 180 };
}
