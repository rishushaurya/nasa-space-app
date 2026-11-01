// Homeward | app/src/core/camera.test.ts | v2.0.0 | 2026-11-01
// Golden values from a real NASA record: Curiosity Navcam NLB_663825389EDR_F0850000NCAM00312M_, sol 3000, site 85 drive 0.
import { describe, expect, it } from "vitest";
import { azEl, frameCentre, frameMatrix, parseCahv, parseQuat, pixelRay, project, rotate } from "./camera";

const MODEL = "(0.939641,0.75466,-1.84547);(-0.340077,0.596884,0.726678);(-1237.1,-302.686,367.626);(268.703,-474.285,1206.33);(-0.340075,0.596885,0.726678);(0.0,0.000114235,0.00639706)";
const ATT = "(0.96844,-0.0245114,-0.0217826,0.247079)";
const m = parseCahv(MODEL)!, q = parseQuat(ATT)!;
const hc = m.a[0] * m.h[0] + m.a[1] * m.h[1] + m.a[2] * m.h[2], vc = m.a[0] * m.v[0] + m.a[1] * m.v[1] + m.a[2] * m.v[2];

describe("camera model and attitude", () => {
  it("parses only complete models", () => {
    expect(parseCahv(null)).toBeNull();
    expect(parseCahv("(1,2,3);(1,0,0)")).toBeNull();
    expect(parseQuat("(0,0,0)")).toBeNull();
  });
  it("the ray at the optical centre is the camera axis and matches the record's mast pointing", () => {
    const r = pixelRay(m, hc, vc);
    expect(r[0] * m.a[0] + r[1] * m.a[1] + r[2] * m.a[2]).toBeCloseTo(1, 9);
    const p = azEl(r); // rover frame
    expect(p.az).toBeCloseTo(119.969, 0); // mast_az in the record
    expect(Math.abs(p.el - -47.0461)).toBeLessThan(0.5); // mast_el
  });
  it("the attitude turns the rover's forward axis to MMGIS's yaw for site 85, drive 0 (28.68 deg)", () => {
    expect(Math.abs(azEl(rotate(q, [1, 0, 0])).az - 28.68)).toBeLessThan(0.05);
  });
  it("the CSS plane puts every pixel on its own ray", () => {
    const M = frameMatrix(m, q, 1024, 1024, 1000);
    for (const [x, y] of [[0, 0], [512, 512], [1024, 300], [200, 1024]] as const) {
      const p: [number, number, number] = [M[12]! + x * M[0]! + y * M[4]!, M[13]! + x * M[1]! + y * M[5]!, M[14]! + x * M[2]! + y * M[6]!];
      const want = azEl(rotate(q, pixelRay(m, x, y))), got = azEl([-p[2], p[0], p[1]]); // CSS back to N, E, D
      expect(got.az).toBeCloseTo(want.az, 6);
      expect(got.el).toBeCloseTo(want.el, 6);
    }
  });
  it("projection: what you look at is at the screen centre; behind you is hidden", () => {
    const c = frameCentre(m, q, 1024, 1024);
    const s = project(c.az, c.el, c.az, c.el, 60, 1200)!;
    expect(Math.abs(s.x) + Math.abs(s.y)).toBeLessThan(1e-6);
    expect(project(c.az + 180, 0, c.az, 0, 60, 1200)).toBeNull();
    const edge = project(30, 0, 0, 0, 60, 1200)!; // half the field of view to the right lands on the right edge
    expect(edge.x).toBeCloseTo(600, 6);
    expect(project(0, 10, 0, 0, 60, 1200)!.y).toBeLessThan(0); // above the horizon is up the screen
  });
});
