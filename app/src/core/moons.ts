// Homeward | app/src/core/moons.ts | v1.0.0 | 2026-10-29
// Phobos and Deimos from JPL Horizons hourly state vectors (data/sky/moons.json): cubic Hermite in time on position
// and velocity, then rotated into the Mars-fixed frame. Outside the table's span the moons are not shown.
import { eclipticToMarsFixed, type Vec3 } from "./ephemeris";

export type MoonTable = { startUtc: string; stepS: number; phobos: number[][]; deimos: number[][] };
export type Moon = "phobos" | "deimos";

/** Mars-fixed position in km (x towards 0 deg E, z north), or null outside the table. */
export function moonPosition(t: MoonTable, moon: Moon, utcMs: number): Vec3 | null {
  const rows = t[moon], h = t.stepS;
  const u = (utcMs - Date.parse(t.startUtc)) / 1000 / h, i = Math.floor(u);
  if (i < 0 || i >= rows.length - 1) return null;
  const s = u - i, a = rows[i]!, b = rows[i + 1]!;
  const h00 = 2 * s ** 3 - 3 * s ** 2 + 1, h10 = s ** 3 - 2 * s ** 2 + s, h01 = -2 * s ** 3 + 3 * s ** 2, h11 = s ** 3 - s ** 2;
  // Rows are [x, y, z] km and [vx, vy, vz] m/s; the tangent terms need km per step.
  const p = [0, 1, 2].map((k) => h00 * a[k]! + h10 * (h * a[k + 3]!) / 1000 + h01 * b[k]! + h11 * (h * b[k + 3]!) / 1000) as Vec3;
  const r = Math.hypot(...p), d = eclipticToMarsFixed(p, utcMs).unit;
  return [d[0] * r, d[1] * r, d[2] * r];
}
