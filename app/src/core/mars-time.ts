// Homeward | app/src/core/mars-time.ts | v1.0.0 | 2026-10-29
// Mars24 algorithm (Allison and McEwen 2000), steps A-1..D-6 as published by NASA GISS:
// https://www.giss.nasa.gov/tools/mars24/help/algorithm.html

const D2R = Math.PI / 180;
const mod = (x: number, m: number) => ((x % m) + m) % m;

// TAI-UTC (s) from each date; TT-UTC = TAI-UTC + 32.184 s. Enough for 1997 onwards.
const LEAPS: [number, number][] = [
  [Date.UTC(1997, 6, 1), 31], [Date.UTC(1999, 0, 1), 32], [Date.UTC(2006, 0, 1), 33],
  [Date.UTC(2009, 0, 1), 34], [Date.UTC(2012, 6, 1), 35], [Date.UTC(2015, 6, 1), 36], [Date.UTC(2017, 0, 1), 37],
];

export function ttMinusUtc(utcMs: number): number {
  let tai = 30;
  for (const [t, s] of LEAPS) if (utcMs >= t) tai = s;
  return tai + 32.184;
}

export const jdUT = (utcMs: number) => 2440587.5 + utcMs / 86400000;
export const jdTT = (utcMs: number) => jdUT(utcMs) + ttMinusUtc(utcMs) / 86400;

const PBS: [number, number, number][] = [
  [0.0071, 2.2353, 49.409], [0.0057, 2.7543, 168.173], [0.0039, 1.1177, 191.837], [0.0037, 15.7866, 21.736],
  [0.0021, 2.1354, 15.704], [0.002, 2.4694, 95.528], [0.0018, 32.8493, 49.095],
];

export type MarsTime = {
  jdTT: number; lsDeg: number; eotDeg: number; msd: number; mstH: number;
  declDeg: number; sunDistAu: number; subsolarLonWDeg: number; nuMinusM: number;
};

export function marsTime(utcMs: number): MarsTime {
  const jtt = jdTT(utcMs);
  const dt = jtt - 2451545.0;
  const M = 19.3871 + 0.52402073 * dt;
  const aFMS = 270.3871 + 0.524038496 * dt;
  const pbs = PBS.reduce((s, [a, tau, phi]) => s + a * Math.cos(D2R * ((0.985626 * dt) / tau + phi)), 0);
  const nuMinusM =
    (10.691 + 3.0e-7 * dt) * Math.sin(D2R * M) + 0.623 * Math.sin(D2R * 2 * M) + 0.05 * Math.sin(D2R * 3 * M) +
    0.005 * Math.sin(D2R * 4 * M) + 0.0005 * Math.sin(D2R * 5 * M) + pbs;
  const ls = mod(aFMS + nuMinusM, 360);
  const eot = 2.861 * Math.sin(D2R * 2 * ls) - 0.071 * Math.sin(D2R * 4 * ls) + 0.002 * Math.sin(D2R * 6 * ls) - nuMinusM;
  const msd = (jtt - 2451549.5) / 1.0274912517 + 44796.0 - 0.0009626;
  const mst = mod(24 * msd, 24);
  const decl = Math.asin(0.42565 * Math.sin(D2R * ls)) / D2R + 0.25 * Math.sin(D2R * ls);
  const r = 1.52367934 * (1.00436 - 0.09309 * Math.cos(D2R * M) - 0.004336 * Math.cos(D2R * 2 * M) -
    0.00031 * Math.cos(D2R * 3 * M) - 0.00003 * Math.cos(D2R * 4 * M));
  return { jdTT: jtt, lsDeg: ls, eotDeg: eot, msd, mstH: mst, declDeg: decl, sunDistAu: r, subsolarLonWDeg: mod(mst * 15 + eot + 180, 360), nuMinusM };
}

export function localSolar(utcMs: number, lonEDeg: number): { lmstH: number; ltstH: number } {
  const m = marsTime(utcMs);
  const lonW = mod(360 - lonEDeg, 360);
  const lmst = mod(m.mstH - lonW / 15, 24);
  return { lmstH: lmst, ltstH: mod(lmst + m.eotDeg / 15, 24) };
}

export function sunPosition(utcMs: number, latDeg: number, lonEDeg: number): { elevationDeg: number; azimuthDeg: number } {
  const m = marsTime(utcMs);
  const H = D2R * (mod(360 - lonEDeg, 360) - m.subsolarLonWDeg);
  const phi = D2R * latDeg, d = D2R * m.declDeg;
  const z = Math.acos(Math.sin(d) * Math.sin(phi) + Math.cos(d) * Math.cos(phi) * Math.cos(H));
  const az = Math.atan2(Math.sin(H), Math.cos(phi) * Math.tan(d) - Math.sin(phi) * Math.cos(H));
  return { elevationDeg: 90 - z / D2R, azimuthDeg: mod(az / D2R, 360) };
}

/** Next UTC time after utcMs when local true solar time at lonE equals ltstH. */
export function nextLtst(utcMs: number, lonEDeg: number, ltstH: number): number {
  const SOL_MS = 88775244; // 24.6597 h (PLN-07)
  let t = utcMs + (mod(ltstH - localSolar(utcMs, lonEDeg).ltstH, 24) / 24) * SOL_MS;
  for (let i = 0; i < 3; i++) {
    let d = ltstH - localSolar(t, lonEDeg).ltstH;
    if (d > 12) d -= 24; if (d < -12) d += 24;
    t += (d / 24) * SOL_MS;
  }
  return t;
}

/** Next sunrise or sunset after utcMs (Sun centre crossing 0 deg elevation), to about 1 s. */
export function nextSunEvent(utcMs: number, latDeg: number, lonEDeg: number, kind: "rise" | "set"): number {
  const el = (t: number) => sunPosition(t, latDeg, lonEDeg).elevationDeg;
  const step = 60000;
  let t = utcMs, prev = el(t);
  for (let i = 0; i < 3 * 1480; i++) {
    const nt = t + step, e = el(nt);
    if ((kind === "rise" && prev < 0 && e >= 0) || (kind === "set" && prev >= 0 && e < 0)) {
      let a = t, b = nt;
      while (b - a > 1000) { const mid = (a + b) / 2; if ((el(mid) >= 0) === (kind === "rise")) b = mid; else a = mid; }
      return b;
    }
    t = nt; prev = e;
  }
  throw new Error("No sun event within 3 sols");
}

/** Sol number at a site, sol 0 = landing sol; sols change at local mean midnight. */
export function solNumber(utcMs: number, landingUtcMs: number, lonEDeg: number): number {
  const local = (t: number) => marsTime(t).msd + lonEDeg / 360;
  return Math.floor(local(utcMs)) - Math.floor(local(landingUtcMs));
}

/** Mars Year (MY 1 began 11 Apr 1955, Clancy et al. 2000), corrected at the Ls = 0 boundary. */
export function marsYear(utcMs: number): number {
  const n = (jdUT(utcMs) - 2435208.5) / 686.9726;
  let my = Math.floor(n) + 1;
  const frac = n - Math.floor(n), ls = marsTime(utcMs).lsDeg;
  if (frac > 0.9 && ls < 30) my += 1;
  if (frac < 0.1 && ls > 330) my -= 1;
  return my;
}

export function seasonName(lsDeg: number): string {
  const s = ["northern spring", "northern summer", "northern autumn", "northern winter"];
  return s[Math.floor(mod(lsDeg, 360) / 90)]!;
}

export const LANDINGS = {
  curiosity: { utcMs: Date.UTC(2012, 7, 6, 5, 17, 57), lonE: 137.4417 },
  perseverance: { utcMs: Date.UTC(2021, 1, 18, 20, 43, 49), lonE: 77.45 },
} as const;
