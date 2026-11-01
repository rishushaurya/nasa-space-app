// Homeward | app/src/globe/globe.ts | v1.0.0 | 2026-10-29
// CesiumJS on the IAU 2015 Mars ellipsoid with our own terrain and imagery (README D11: no Cesium ion).
import * as Cesium from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
import { directionFromMars } from "../core/ephemeris";
import { ocToOg, ogToOc, type LatLon } from "../core/frames";
import { moonPosition, type Moon, type MoonTable } from "../core/moons";
import type { Layers, TerrainLayer } from "../data/load";
import { liveProvider } from "./layers";
import type { LiveId } from "./live";

Cesium.Ellipsoid.default = Cesium.Ellipsoid.MARS;
const ELL = Cesium.Ellipsoid.MARS;

export const cssColor = (name: string, alpha = 1) =>
  Cesium.Color.fromCssColorString(getComputedStyle(document.documentElement).getPropertyValue(name).trim() || "white").withAlpha(alpha);
const pos = (p: LatLon, h = 0) => Cesium.Cartesian3.fromDegrees(p.lon, ocToOg(p.lat), h, ELL);

type Loaded = { lay: TerrainLayer; data: Int16Array; cell: number };

export type MarsGlobe = {
  viewer: Cesium.CesiumWidget;
  heightAt: (p: LatLon) => number;
  setSun: (utcMs: number) => void;
  flyTo: (p: LatLon, rangeM: number, opts?: { headingDeg?: number; pitchDeg?: number; seconds?: number; noShift?: boolean }) => Promise<void>;
  eye: (p: LatLon, headingDeg: number, pitchDeg?: number, eyeM?: number) => void;
  setRoute: (pts: LatLon[] | null) => void;
  setTraverse: (pts: LatLon[] | null) => void;
  setPins: (pins: { id: string; p: LatLon; label: string; kind: "home" | "stop" | "rover" | "site" }[]) => void;
  setHeat: (canvas: HTMLCanvasElement | null, box?: { west: number; east: number; south: number; north: number }) => void;
  setDustDevil: (p: LatLon | null) => void;
  onPick: (fn: (p: LatLon) => void) => void;
  /** Live imagery: one base (or none for our own offline rasters) plus the HiRISE overlay. */
  setImagery: (base: Exclude<LiveId, "hirise"> | null, hirise: boolean) => void;
  liveErrors: () => number;
  setLabels: (places: { name: string; p: LatLon; km: number }[] | null) => void;
  setTracks: (tracks: { id: string; lines: number[][]; color: string; width?: number }[]) => void;
  setStops: (id: string, pts: LatLon[] | null, color: string) => void;
  setMeasure: (pts: LatLon[] | null) => void;
  /** Click on a pin or stop: its id ("pin-..." or "stop-<set>-<index>"); empty string for bare ground. */
  onSelect: (fn: ((id: string, p: LatLon | null) => void) | null) => void;
  onHover: (fn: ((p: LatLon | null) => void) | null) => void;
  setFov: (deg: number) => void;
  /** Map controls for Explore (kept here so scenes never import Cesium and it stays out of the startup bundle). */
  cam: {
    state: () => { heading: number; pitch: number; aboveGround: number };
    onChange: (fn: () => void) => () => void;
    orbit: (headingDeg: number, pitchDeg: number) => void;
    zoom: (metres: number) => void;
    pan: (rightRad: number, upRad: number) => void;
  };
  destroy: () => void;
};

export async function createGlobe(el: HTMLElement, layers: Layers, moons: MoonTable, onProgress: (f: number) => void): Promise<MarsGlobe> {
  // Terrain rasters (planetocentric grids, finest first).
  let done = 0;
  const loaded: Loaded[] = await Promise.all(layers.terrain.map(async (lay) => {
    const r = await fetch(lay.file);
    if (!r.ok) throw new Error(`terrain ${lay.name}: HTTP ${r.status}`);
    const data = new Int16Array(await r.arrayBuffer());
    onProgress(++done / (layers.terrain.length + layers.imagery.length));
    return { lay, data, cell: (lay.east - lay.west) / lay.cols };
  }));
  loaded.sort((a, b) => a.cell - b.cell);

  const sample = (L: Loaded, latC: number, lon: number): number | undefined => {
    const { west, east, south, north, cols, rows, scale, offset } = L.lay;
    if (lon < west || lon > east || latC < south || latC > north) return undefined;
    const x = Math.min(Math.max((lon - west) / (east - west) * cols - 0.5, 0), cols - 1.001);
    const y = Math.min(Math.max((north - latC) / (north - south) * rows - 0.5, 0), rows - 1.001);
    const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, d = L.data, i = y0 * cols + x0;
    const v = d[i]! * (1 - fx) * (1 - fy) + d[i + 1]! * fx * (1 - fy) + d[i + cols]! * (1 - fx) * fy + d[i + cols + 1]! * fx * fy;
    return v * scale + offset;
  };
  const heightAt = (p: LatLon) => {
    for (const L of loaded) { const h = sample(L, p.lat, p.lon); if (h !== undefined) return h; }
    return 0;
  };

  const tiling = new Cesium.GeographicTilingScheme({ ellipsoid: ELL });
  const N = 65;
  const terrainProvider = new Cesium.CustomHeightmapTerrainProvider({
    width: N, height: N, tilingScheme: tiling,
    callback: (x: number, y: number, level: number) => {
      const r = tiling.tileXYToRectangle(x, y, level);
      const w = Cesium.Math.toDegrees(r.west), e = Cesium.Math.toDegrees(r.east), s = Cesium.Math.toDegrees(r.south), n = Cesium.Math.toDegrees(r.north);
      const out = new Float32Array(N * N);
      for (let row = 0; row < N; row++) {
        const latC = ogToOc(n - (row / (N - 1)) * (n - s));
        for (let col = 0; col < N; col++) out[row * N + col] = heightAt({ lat: latC, lon: w + (col / (N - 1)) * (e - w) });
      }
      return out;
    },
  });

  // CesiumWidget, not Viewer: Viewer's widgets compile Knockout bindings with Function(), which the production CSP
  // (script-src 'self', no 'unsafe-eval') blocks, so the globe never started on the deployed site.
  const viewer = new Cesium.CesiumWidget(el, {
    baseLayer: false, terrainProvider, skyBox: Cesium.SkyBox.createEarthSkyBox(), skyAtmosphere: new Cesium.SkyAtmosphere(ELL), msaaSamples: 4,
  });
  const scene = viewer.scene, globe = scene.globe;
  if (scene.sun) scene.sun.show = false;
  if (scene.moon) scene.moon.show = false;
  globe.enableLighting = true;
  globe.dynamicAtmosphereLightingFromSun = false;
  globe.baseColor = cssColor("--color-surface");
  globe.showGroundAtmosphere = true;
  globe.depthTestAgainstTerrain = true;
  scene.fog.enabled = true;
  scene.fog.density = 0.00012;
  scene.screenSpaceCameraController.minimumZoomDistance = 2;

  // Mars-tuned atmosphere (ASSUMPTION: values tuned by eye against Curiosity photos; scale height 11 km, PLN-09).
  const sky = scene.skyAtmosphere!;
  sky.atmosphereRayleighScaleHeight = 11000;
  sky.atmosphereMieScaleHeight = 11000;
  sky.atmosphereRayleighCoefficient = new Cesium.Cartesian3(1.2e-6, 1.6e-6, 2.2e-6);
  sky.atmosphereMieCoefficient = new Cesium.Cartesian3(2.6e-5, 1.75e-5, 1.0e-5);
  sky.atmosphereMieAnisotropy = 0.82;
  sky.atmosphereLightIntensity = 26;
  sky.perFragmentAtmosphere = true;
  const atm = scene.atmosphere;
  atm.rayleighScaleHeight = 11000;
  atm.mieScaleHeight = 11000;
  atm.rayleighCoefficient = new Cesium.Cartesian3(1.2e-6, 1.6e-6, 2.2e-6);
  atm.mieCoefficient = new Cesium.Cartesian3(2.6e-5, 1.75e-5, 1.0e-5);
  atm.mieAnisotropy = 0.82;
  atm.lightIntensity = 16;
  atm.dynamicLighting = Cesium.DynamicAtmosphereLightingType.SCENE_LIGHT;

  for (const im of layers.imagery) {
    const provider = await Cesium.SingleTileImageryProvider.fromUrl(im.file, { rectangle: Cesium.Rectangle.fromDegrees(im.west, im.south, im.east, im.north), ellipsoid: ELL });
    viewer.imageryLayers.addImageryProvider(provider);
    onProgress(++done / (layers.terrain.length + layers.imagery.length));
  }

  const sunLight = new Cesium.DirectionalLight({ direction: new Cesium.Cartesian3(1, 0, 0), intensity: 2.2, color: cssColor("--color-text") });
  scene.light = sunLight;
  const earth = viewer.entities.add({ id: "earth", position: Cesium.Cartesian3.ZERO, point: { pixelSize: 6, color: cssColor("--color-info") },
    label: { text: "Earth", font: "13px sans-serif", pixelOffset: new Cesium.Cartesian2(0, -14), fillColor: cssColor("--color-text"), showBackground: true, backgroundColor: cssColor("--color-bg", 0.6) } });
  // Phobos and Deimos at their real positions (JPL Horizons); depth-tested, so Mars hides them when they pass behind it.
  const moonEnts = (["phobos", "deimos"] as Moon[]).map((m) => [m, viewer.entities.add({ id: m, show: false, position: Cesium.Cartesian3.ZERO,
    point: { pixelSize: 5, color: cssColor("--color-text") },
    label: { text: m === "phobos" ? "Phobos" : "Deimos", font: "12px sans-serif", pixelOffset: new Cesium.Cartesian2(0, -12), fillColor: cssColor("--color-text-muted"), showBackground: true, backgroundColor: cssColor("--color-bg", 0.6) } })] as const);
  // Scene cleanups can run after the viewer is gone (unmount order, hot reload): every method is then a no-op.
  const gone = () => viewer.isDestroyed();
  const setSun = (utcMs: number) => {
    if (gone()) return;
    const s = directionFromMars("sun", utcMs).unit, e = directionFromMars("earth", utcMs).unit;
    sunLight.direction = Cesium.Cartesian3.normalize(new Cesium.Cartesian3(-s[0], -s[1], -s[2]), new Cesium.Cartesian3());
    earth.position = new Cesium.ConstantPositionProperty(new Cesium.Cartesian3(e[0] * 3e8, e[1] * 3e8, e[2] * 3e8));
    for (const [m, ent] of moonEnts) {
      const p = moonPosition(moons, m, utcMs);
      ent.show = !!p;
      if (p) ent.position = new Cesium.ConstantPositionProperty(new Cesium.Cartesian3(p[0] * 1000, p[1] * 1000, p[2] * 1000));
    }
  };
  setSun(Date.now());

  // Centre the subject in the part of the screen not covered by the side panel.
  const panelShift = (rangeM: number, headingDeg: number, p: LatLon): LatLon => {
    const panel = document.querySelector(".side") as HTMLElement | null;
    const frac = panel && innerWidth > 640 ? (panel.offsetWidth + 16) / innerWidth / 2 : 0;
    const m = rangeM * 1.15 * frac, hr = Cesium.Math.toRadians(headingDeg + 90), R = 3396190;
    return { lat: p.lat + Cesium.Math.toDegrees((m * Math.cos(hr)) / R), lon: p.lon + Cesium.Math.toDegrees((m * Math.sin(hr)) / R / Math.cos(Cesium.Math.toRadians(p.lat))) };
  };
  const flyTo = (p0: LatLon, rangeM: number, o: { headingDeg?: number; pitchDeg?: number; seconds?: number; noShift?: boolean } = {}) =>
    new Promise<void>((resolve) => {
      if (gone()) return resolve();
      const p = o.noShift ? p0 : panelShift(rangeM, o.headingDeg ?? 0, p0);
      const target = pos(p, heightAt(p));
      const secs = o.seconds ?? 3;
      const fallback = setTimeout(resolve, secs * 1000 + 1500); // animation frames pause in hidden tabs
      viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(target, 1), {
        offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(o.headingDeg ?? 0), Cesium.Math.toRadians(o.pitchDeg ?? -35), rangeM),
        duration: secs, complete: () => { clearTimeout(fallback); resolve(); }, cancel: () => { clearTimeout(fallback); resolve(); },
      });
    });
  const eye = (p: LatLon, headingDeg: number, pitchDeg = -4, eyeM = 1.7) =>
    gone() || viewer.camera.setView({ destination: pos(p, heightAt(p) + eyeM), orientation: { heading: Cesium.Math.toRadians(headingDeg), pitch: Cesium.Math.toRadians(pitchDeg), roll: 0 } });

  const line = (id: string, color: Cesium.Color, width: number) => viewer.entities.add({ id, polyline: { positions: [], clampToGround: true, width, material: color }, show: false });
  const route = line("route", cssColor("--color-route"), 5);
  const traverse = line("traverse", cssColor("--badge-live", 0.75), 3);
  const setLine = (ent: Cesium.Entity, pts: LatLon[] | null) => {
    if (gone()) return;
    ent.show = !!pts && pts.length > 1;
    if (pts && pts.length > 1) ent.polyline!.positions = new Cesium.ConstantProperty(pts.map((p) => pos(p)));
  };

  // Pins skip the depth test only near the ground (so terrain never hides them); from orbit Mars hides far-side pins.
  const PIN_NO_DEPTH_M = 300000;
  let pinIds: string[] = [];
  const setPins: MarsGlobe["setPins"] = (pins) => {
    if (gone()) return;
    pinIds.forEach((id) => viewer.entities.removeById(id));
    pinIds = pins.map((pin) => {
      const color = cssColor(pin.kind === "home" ? "--color-ok" : pin.kind === "stop" ? "--color-accent" : pin.kind === "rover" ? "--badge-live" : "--color-text");
      viewer.entities.add({ id: `pin-${pin.id}`, position: pos(pin.p), point: { pixelSize: 11, color, outlineColor: cssColor("--color-bg"), outlineWidth: 2, heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: PIN_NO_DEPTH_M },
        label: { text: pin.label, font: "600 13px sans-serif", fillColor: cssColor("--color-text"), showBackground: true, backgroundColor: cssColor("--color-bg", 0.7), pixelOffset: new Cesium.Cartesian2(0, -18), heightReference: Cesium.HeightReference.CLAMP_TO_GROUND, disableDepthTestDistance: PIN_NO_DEPTH_M, distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4.0e6) } });
      return `pin-${pin.id}`;
    });
  };

  let heat: Cesium.ImageryLayer | null = null;
  const setHeat: MarsGlobe["setHeat"] = async (canvas, box) => {
    if (gone()) return;
    if (heat) { viewer.imageryLayers.remove(heat, true); heat = null; }
    if (!canvas || !box) return;
    const provider = await Cesium.SingleTileImageryProvider.fromUrl(canvas.toDataURL("image/png"), { rectangle: Cesium.Rectangle.fromDegrees(box.west, ocToOg(box.south), box.east, ocToOg(box.north)), ellipsoid: ELL });
    if (gone()) return;
    if (heat) viewer.imageryLayers.remove(heat, true);
    heat = viewer.imageryLayers.addImageryProvider(provider);
    heat.alpha = 0.38;
  };

  // GENERATED visual: a translucent dust column sized from EVT-01 (60 m wide, about 2 km tall).
  const devil = viewer.entities.add({ id: "dust-devil", show: false, position: Cesium.Cartesian3.ZERO,
    cylinder: { length: 2000, topRadius: 90, bottomRadius: 30, material: cssColor("--color-accent", 0.28), outline: false } });
  const setDustDevil = (p: LatLon | null) => {
    if (gone()) return;
    devil.show = !!p;
    if (p) devil.position = new Cesium.ConstantPositionProperty(pos(p, heightAt(p) + 1000));
  };

  // Live layers go above our coarse global rasters (i0, i1) and below our own fine Gale mosaics (i2 and up).
  const liveAt = layers.imagery.filter((l) => /^i[01]-/.test(l.name)).length;
  let live: Cesium.ImageryLayer[] = [], liveKey = "", errors = 0;
  const setImagery: MarsGlobe["setImagery"] = (base, hirise) => {
    if (gone() || liveKey === `${base}:${hirise}`) return;
    liveKey = `${base}:${hirise}`;
    live.forEach((l) => viewer.imageryLayers.remove(l, true));
    live = [];
    errors = 0;
    const add = (id: LiveId, alpha = 1) => {
      const l = viewer.imageryLayers.addImageryProvider(liveProvider(id, ELL, () => errors++), liveAt + live.length);
      l.alpha = alpha;
      live.push(l);
    };
    // CTX is greyscale: laid over the Viking colour at 0.7 so the ground keeps a hint of its real colour.
    if (base) add(base, base === "ctx" ? 0.7 : 1);
    if (hirise) add("hirise");
  };

  const labels = scene.primitives.add(new Cesium.LabelCollection()) as Cesium.LabelCollection;
  const setLabels: MarsGlobe["setLabels"] = (places) => {
    if (gone()) return;
    labels.removeAll();
    // Google-Earth style: a feature's name appears once the camera is within about eight times its size.
    for (const pl of places ?? []) labels.add({ position: pos(pl.p, heightAt(pl.p) + 300), text: pl.name, font: "12px sans-serif", fillColor: cssColor("--color-text-muted"),
      outlineColor: cssColor("--color-bg"), outlineWidth: 3, style: Cesium.LabelStyle.FILL_AND_OUTLINE, horizontalOrigin: Cesium.HorizontalOrigin.CENTER,
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, Math.min(Math.max(pl.km * 8000, 40000), 9e6)) });
  };

  let trackEnts: Cesium.Entity[] = [];
  const setTracks: MarsGlobe["setTracks"] = (tracks) => {
    if (gone()) return;
    trackEnts.forEach((e) => viewer.entities.remove(e));
    trackEnts = tracks.map((t) => viewer.entities.add({ id: `track-${t.id}`, polyline: {
      // Drive segments follow on from each other, so one line per rover is drawn.
      positions: t.lines.flatMap((ln) => Array.from({ length: ln.length / 2 }, (_, i) => pos({ lon: ln[2 * i]!, lat: ln[2 * i + 1]! }))),
      clampToGround: true, width: t.width ?? 3, material: cssColor(t.color, 0.9) } }));
  };

  const stopSets = new Map<string, Cesium.PointPrimitiveCollection>();
  const setStops: MarsGlobe["setStops"] = (id, pts, color) => {
    if (gone()) return;
    const old = stopSets.get(id);
    if (old) { scene.primitives.remove(old); stopSets.delete(id); }
    if (!pts) return;
    const c = scene.primitives.add(new Cesium.PointPrimitiveCollection()) as Cesium.PointPrimitiveCollection;
    pts.forEach((p, i) => c.add({ id: `stop-${id}-${i}`, position: pos(p, heightAt(p) + 1), pixelSize: 7, color: cssColor(color), outlineColor: cssColor("--color-bg"), outlineWidth: 1.5,
      // Points are not draped, so they only show close up, where the rendered terrain matches heightAt (no parallax).
      distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 25000), disableDepthTestDistance: 25000 }));
    stopSets.set(id, c);
  };

  const measure = line("measure", cssColor("--color-measure"), 3);
  const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
  const groundAt = (px: Cesium.Cartesian2): LatLon | null => {
    const ray = viewer.camera.getPickRay(px);
    const c = ray && (globe.pick(ray, scene) ?? viewer.camera.pickEllipsoid(px, ELL));
    if (!c) return null;
    const carto = Cesium.Cartographic.fromCartesian(c, ELL);
    return { lat: ogToOc(Cesium.Math.toDegrees(carto.latitude)), lon: Cesium.Math.toDegrees(carto.longitude) };
  };
  const onPick = (fn: (p: LatLon) => void) => handler.setInputAction((e: { position: Cesium.Cartesian2 }) => {
    const p = groundAt(e.position);
    if (p) fn(p);
  }, Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
  const onSelect: MarsGlobe["onSelect"] = (fn) => {
    if (gone()) return;
    if (!fn) return handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK);
    handler.setInputAction((e: { position: Cesium.Cartesian2 }) => {
      const hit = scene.pick(e.position) as { id?: unknown } | undefined;
      const id = hit?.id instanceof Cesium.Entity ? hit.id.id : typeof hit?.id === "string" ? hit.id : "";
      fn(id, groundAt(e.position));
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
  };
  let hoverFrame = 0;
  const onHover: MarsGlobe["onHover"] = (fn) => {
    if (gone()) return;
    if (!fn) return handler.removeInputAction(Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    handler.setInputAction((e: { endPosition: Cesium.Cartesian2 }) => {
      const px = Cesium.Cartesian2.clone(e.endPosition);
      cancelAnimationFrame(hoverFrame);
      hoverFrame = requestAnimationFrame(() => fn(groundAt(px)));
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  };
  const setFov = (deg: number) => {
    if (gone()) return;
    (viewer.camera.frustum as Cesium.PerspectiveFrustum).fov = Cesium.Math.toRadians(deg);
  };

  return {
    viewer, heightAt, setSun, flyTo, eye, setRoute: (p) => setLine(route, p), setTraverse: (p) => setLine(traverse, p), setPins, setHeat, setDustDevil, onPick,
    setImagery, liveErrors: () => errors, setLabels, setTracks, setStops, setMeasure: (p) => setLine(measure, p), onSelect, onHover, setFov,
    cam: {
      state: () => {
        const c = viewer.camera, g = c.positionCartographic;
        const p = { lat: ogToOc(Cesium.Math.toDegrees(g.latitude)), lon: Cesium.Math.toDegrees(g.longitude) };
        return { heading: Cesium.Math.toDegrees(c.heading), pitch: Cesium.Math.toDegrees(c.pitch), aboveGround: g.height - heightAt(p) };
      },
      onChange: (fn) => { viewer.camera.percentageChanged = 0.01; return viewer.camera.changed.addEventListener(fn); },
      // Turn or tilt about the ground point at the screen centre, as a map does.
      orbit: (h, p) => {
        const c = scene.canvas, ray = viewer.camera.getPickRay(new Cesium.Cartesian2(c.clientWidth / 2, c.clientHeight / 2));
        const t = ray && globe.pick(ray, scene);
        if (!t) return;
        viewer.camera.flyToBoundingSphere(new Cesium.BoundingSphere(t, 1), { offset: new Cesium.HeadingPitchRange(Cesium.Math.toRadians(h), Cesium.Math.toRadians(p), Cesium.Cartesian3.distance(viewer.camera.position, t)), duration: 0.8 });
      },
      zoom: (m) => viewer.camera.zoomIn(m),
      pan: (r, u) => { if (r) viewer.camera.rotateRight(r); if (u) viewer.camera.rotateUp(u); },
    },
    destroy: () => { if (gone()) return; handler.destroy(); viewer.destroy(); },
  };
}

export { Cesium };
