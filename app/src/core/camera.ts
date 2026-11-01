// Homeward | app/src/core/camera.ts | v2.0.0 | 2026-11-01
// Where a rover photo looks. NASA raw-image records give a CAHV(OR) camera model in the rover frame and the rover
// attitude as a quaternion (s, x, y, z) from the rover frame to the local level frame (x north, y east, z down).
// Both conventions were checked on real records (build/PLAN-2.md section 2): the rotated rover X axis equals the
// MMGIS yaw, and the ray at the optical centre equals the reported mast azimuth.
export type V3 = [number, number, number];
export type Quat = [number, number, number, number];
export type Cahv = { c: V3; a: V3; h: V3; v: V3 };

const D2R = Math.PI / 180;
const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a: V3, b: V3): V3 => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const sub = (a: V3, b: V3): V3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const add = (a: V3, b: V3): V3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: V3, k: number): V3 => [a[0] * k, a[1] * k, a[2] * k];
const unit = (a: V3): V3 => mul(a, 1 / Math.hypot(...a));

const nums = (s: string) => (s.match(/-?\d+(\.\d+)?(e-?\d+)?/gi) ?? []).map(Number);

/** "(cx,cy,cz);(ax,ay,az);(hx,..);(vx,..);..." -> CAHV (O, R, E terms are ignored). */
export function parseCahv(list: string | null | undefined): Cahv | null {
  const g = (list ?? "").split(";").map(nums);
  if (g.length < 4 || g.slice(0, 4).some((x) => x.length !== 3 || x.some((n) => !Number.isFinite(n)))) return null;
  return { c: g[0] as V3, a: unit(g[1] as V3), h: g[2] as V3, v: g[3] as V3 };
}

export function parseQuat(s: string | null | undefined): Quat | null {
  const q = nums(s ?? "");
  if (q.length !== 4) return null;
  const n = Math.hypot(...q);
  return n > 0.5 ? (q.map((x) => x / n) as Quat) : null;
}

/** Unit ray (rover frame) through pixel (x, y): the inverse of x = (P-C).H / (P-C).A, y = (P-C).V / (P-C).A. */
export function pixelRay(m: Cahv, x: number, y: number): V3 {
  const u = cross(sub(m.v, mul(m.a, y)), sub(m.h, mul(m.a, x)));
  return unit(dot(u, m.a) < 0 ? mul(u, -1) : u);
}

/** Rotate a vector by a unit quaternion (s, x, y, z): q p q*. */
export function rotate(q: Quat, p: V3): V3 {
  const u: V3 = [q[1], q[2], q[3]];
  const t = mul(cross(u, p), 2);
  return add(add(p, mul(t, q[0])), cross(u, t));
}

/** Azimuth clockwise from north and elevation above the horizon, degrees, for a local-level (N, E, D) vector. */
export function azEl(d: V3) {
  return { az: ((Math.atan2(d[1], d[0]) / D2R) % 360 + 360) % 360, el: -Math.asin(d[2] / Math.hypot(...d)) / D2R };
}

/** Local level (N, E, D) to CSS 3D axes (x right = east, y down, z towards the viewer = south). */
const css = (v: V3): V3 => [v[1], v[2], -v[0]];

/**
 * CSS matrix3d that lays an image of w x h model pixels on the plane at distance r along its camera axis,
 * in local-level space. Pixels map to that plane affinely, so three corners fix it exactly (CAHV, no distortion).
 * seniordev: CAHVOR/CAHVORE distortion terms are dropped; wide Navcam edges can be off by a few pixels.
 */
export function frameMatrix(m: Cahv, q: Quat, w: number, h: number, r: number): number[] {
  const at = (x: number, y: number) => { const d = pixelRay(m, x, y); return css(rotate(q, mul(d, r / dot(d, m.a)))); };
  const o = at(0, 0), ex = mul(sub(at(w, 0), o), 1 / w), ey = mul(sub(at(0, h), o), 1 / h), n = unit(cross(ex, ey));
  return [...ex, 0, ...ey, 0, ...n, 0, ...o, 1];
}

/** Direction the frame's centre looks, local level. */
export const frameCentre = (m: Cahv, q: Quat, w: number, h: number) => azEl(rotate(q, pixelRay(m, w / 2, h / 2)));

/**
 * Screen position (px from the view centre) of a direction (az, el) for a viewer looking at (yaw, pitch) with a
 * horizontal field of view; null when it is behind the viewer. Same projection as the CSS view.
 */
export function project(az: number, el: number, yaw: number, pitch: number, hfovDeg: number, widthPx: number): { x: number; y: number } | null {
  const d: V3 = [Math.cos(el * D2R) * Math.cos((az - yaw) * D2R), Math.cos(el * D2R) * Math.sin((az - yaw) * D2R), -Math.sin(el * D2R)];
  // Pitch the view: rotate about the east axis of the yawed frame.
  const cp = Math.cos(pitch * D2R), sp = Math.sin(pitch * D2R);
  const fwd = d[0] * cp - d[2] * sp, down = d[0] * sp + d[2] * cp;
  if (fwd <= 1e-6) return null;
  const f = widthPx / 2 / Math.tan((hfovDeg / 2) * D2R);
  return { x: (d[1] / fwd) * f, y: (down / fwd) * f };
}
