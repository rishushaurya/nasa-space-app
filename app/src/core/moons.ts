// Homeward | app/src/core/moons.ts | v3.0.0 | 2026-11-13
// Phobos, Deimos and the Mars orbiters from JPL Horizons state vectors (data/sky/moons.json hourly, orbiters.json every
// 10 min): cubic Hermite in time on position and velocity, then rotated into the Mars-fixed frame. Outside a table's
// span nothing is shown.
import { eclipticToMarsFixed, type Vec3 } from "./ephemeris";

export type MoonTable = { startUtc: string; stepS: number; phobos: number[][]; deimos: number[][] };
export type Moon = "phobos" | "deimos";
export type Orbiter = { id: string; name: string; agency: string; horizonsId: number; endUtc: string; rows: number[][] };
export type OrbiterTable = { startUtc: string; stepS: number; orbiters: Orbiter[] };

/** Mars-fixed position in km (x towards 0 deg E, z north) from rows of [x, y, z km, vx, vy, vz m/s], or null outside them. */
export function statePosition(rows: number[][], startUtc: string, h: number, utcMs: number): Vec3 | null {
  const u = (utcMs - Date.parse(startUtc)) / 1000 / h, i = Math.floor(u);
  if (i < 0 || i >= rows.length - 1) return null;
  const s = u - i, a = rows[i]!, b = rows[i + 1]!;
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1, h10 = s ** 3 - 2 * s ** 2 + s, h01 = -2 * s ** 3 + 3 * s ** 2, h11 = s ** 3 - s ** 2;
  // The tangent terms need km per step.
  const p = [0, 1, 2].map((k) => h00 * a[k]! + h10 * (h * a[k + 3]!) / 1000 + h01 * b[k]! + h11 * (h * b[k + 3]!) / 1000) as Vec3;
  const r = Math.hypot(...p), d = eclipticToMarsFixed(p, utcMs).unit;
  return [d[0] * r, d[1] * r, d[2] * r];
}

export const moonPosition = (t: MoonTable, moon: Moon, utcMs: number) => statePosition(t[moon], t.startUtc, t.stepS, utcMs);
export const orbiterPosition = (t: OrbiterTable, o: Orbiter, utcMs: number) => statePosition(o.rows, t.startUtc, t.stepS, utcMs);
