// Homeward | app/src/rovers/raw.ts | v2.0.0 | 2026-11-01
// Rover stops and their photos. Stops are NASA MMGIS waypoints in drive order (data/rovers/*-stops.json). Photos
// come live from NASA's raw-image APIs, validated here because they cross a trust boundary; featured stops also
// have an offline copy (pipeline/rovers.py). A photo belongs to a stop when its site and drive equal the stop's (D18).
import { z } from "zod";
import { frameCentre, parseCahv, parseQuat, type Cahv, type Quat } from "../core/camera";

export type Mission = "msl" | "m20";
export const ROVER = { msl: { name: "Curiosity", rawSource: "MSL-RAW-API", stopSource: "MMGIS-MSL-WAYPOINTS" }, m20: { name: "Perseverance", rawSource: "M2020-RAW-IMAGES", stopSource: "MMGIS-M20-WAYPOINTS" } } as const;
export type Stop = { i: number; site: number; drive: number; sol: number; lat: number; lon: number; elev: number; yaw: number; distM: number };
export type Frame = {
  id: string; cam: string; sol: number; site: number | null; drive: number | null; lmst: string | null; utc: string | null;
  src: string; thumb: string; big: string; link: string; credit: string; sample: string; w: number; h: number; model: Cahv | null; att: Quat | null;
};

const StopsFile = z.object({ mission: z.enum(["msl", "m20"]), sourceId: z.string(), rows: z.array(z.tuple([z.number(), z.number(), z.number(), z.number(), z.number(), z.number(), z.number(), z.number()])) });
const TrackFile = z.object({ sourceId: z.string(), lines: z.array(z.array(z.number())), km: z.number().optional(), lastSol: z.number().optional() });
export type Track = z.infer<typeof TrackFile>;
export type TrackName = "msl" | "m20" | "ingenuity" | "mer-a" | "mer-b";

export async function loadStops(m: Mission): Promise<Stop[]> {
  const f = StopsFile.parse(await (await fetch(`/data/rovers/${m}-stops.json`)).json());
  return f.rows.map(([site, drive, sol, lat, lon, elev, yaw, distM], i) => ({ i, site, drive, sol, lat, lon, elev, yaw, distM }));
}
export async function loadTrack(name: TrackName): Promise<Track> {
  return TrackFile.parse(await (await fetch(`/data/rovers/${name === "ingenuity" ? "ingenuity" : `${name}-track`}.json`)).json());
}

// Only NASA's own image host is accepted (CSP img-src allows it too).
const nasaUrl = (u: string | null | undefined) => {
  const s = (u ?? "").replace(/^http:\/\//, "https://").replace("//mars.jpl.nasa.gov/", "//mars.nasa.gov/");
  return /^https:\/\/mars\.nasa\.gov\/[\w\-./%]+\.(jpe?g|png)$/i.test(s) ? s : null;
};
const dims = (s: string | null | undefined, last2: boolean) => {
  const n = (s ?? "").match(/-?\d+/g)?.map(Number) ?? [];
  const [w, h] = last2 ? n.slice(-2) : n;
  return w && h && w > 0 && h > 0 ? { w, h } : null;
};

const MslItem = z.object({
  imageid: z.string(), instrument: z.string(), sol: z.number(), site: z.number().nullable().optional(), drive: z.number().nullable().optional(),
  attitude: z.string().nullable().optional(), camera_model_component_list: z.string().nullable().optional(), subframe_rect: z.string().nullable().optional(),
  https_url: z.string().nullable().optional(), url: z.string().nullable().optional(), link: z.string().nullable().optional(), image_credit: z.string().nullable().optional(),
  date_taken: z.string().nullable().optional(), extended: z.object({ lmst: z.string().nullable().optional(), sample_type: z.string().nullable().optional() }).partial().optional(),
});
const M20Item = z.object({
  imageid: z.string(), sol: z.number(), site: z.number().nullable().optional(), drive: z.union([z.string(), z.number()]).nullable().optional(),
  attitude: z.string().nullable().optional(), sample_type: z.string().nullable().optional(), credit: z.string().nullable().optional(), link: z.string().nullable().optional(),
  date_taken_mars: z.string().nullable().optional(), date_taken_utc: z.string().nullable().optional(),
  camera: z.object({ instrument: z.string(), camera_model_component_list: z.string().nullable().optional() }),
  image_files: z.object({ small: z.string().nullable().optional(), medium: z.string().nullable().optional(), large: z.string().nullable().optional() }).partial(),
  extended: z.object({ dimension: z.string().nullable().optional() }).partial().optional(),
});

function fromMsl(x: z.infer<typeof MslItem>, local?: string): Frame | null {
  const src = local ?? nasaUrl(x.https_url ?? x.url);
  if (!src) return null;
  const d = dims(x.subframe_rect, true) ?? { w: 1024, h: 1024 };
  return { id: x.imageid, cam: x.instrument, sol: x.sol, site: x.site ?? null, drive: x.drive ?? null, lmst: x.extended?.lmst ?? null, utc: x.date_taken ?? null,
    src, thumb: src, big: local ?? nasaUrl(x.https_url ?? x.url) ?? src, link: x.link?.startsWith("/raw_images/") ? `https://mars.nasa.gov${x.link}` : "https://mars.nasa.gov/msl/multimedia/raw-images/",
    credit: x.image_credit ?? "NASA/JPL-Caltech", sample: (x.extended?.sample_type ?? "").toLowerCase(), ...d,
    model: parseCahv(x.camera_model_component_list), att: parseQuat(x.attitude) };
}
function fromM20(x: z.infer<typeof M20Item>, local?: string): Frame | null {
  const src = local ?? nasaUrl(x.image_files.medium ?? x.image_files.large);
  if (!src) return null;
  const d = dims(x.extended?.dimension, false) ?? { w: 1600, h: 1200 };
  const drive = x.drive === null || x.drive === undefined || x.drive === "" ? null : Number(x.drive);
  return { id: x.imageid, cam: x.camera.instrument, sol: x.sol, site: x.site ?? null, drive: Number.isFinite(drive) ? drive : null,
    lmst: x.date_taken_mars ?? null, utc: x.date_taken_utc ?? null, src, thumb: local ?? nasaUrl(x.image_files.small) ?? src, big: local ?? nasaUrl(x.image_files.large) ?? src,
    link: x.link?.startsWith("https://mars.nasa.gov/") ? x.link : "https://mars.nasa.gov/mars2020/multimedia/raw-images/",
    credit: x.credit ?? "NASA/JPL-Caltech", sample: (x.sample_type ?? "").toLowerCase(), ...d,
    model: parseCahv(x.camera.camera_model_component_list), att: parseQuat(x.attitude) };
}

const url = (m: Mission, a: number, b: number, page: number, cams?: string[]) => m === "msl"
  ? `https://mars.nasa.gov/api/v1/raw_image_items/?order=sol%20asc&per_page=100&page=${page}&condition_1=msl:mission&condition_2=${a}:sol:gte&condition_3=${b}:sol:lte${cams ? `&condition_4=${cams[0]}:instrument` : ""}`
  : `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=100&page=${page}&order=sol+asc${cams ? `&search=${cams.map((c) => `%7C${c}`).join("")}` : ""}&condition_2=${a}:sol:gte&condition_3=${b}:sol:lte`;

type RawPage = { items?: unknown[]; images?: unknown[]; more?: boolean; total?: number; total_results?: number | string; total_images?: number | string };
/** Frames from one page of raw records, validated item by item (a bad record is skipped, never trusted). */
export function parsePage(m: Mission, j: RawPage, per = 100): { frames: Frame[]; more: boolean } {
  const items = (m === "msl" ? j.items : j.images) ?? [];
  const frames = items.flatMap((x) => {
    const p2 = (m === "msl" ? MslItem : M20Item).safeParse(x);
    if (!p2.success) return [];
    const f = m === "msl" ? fromMsl(p2.data as z.infer<typeof MslItem>) : fromM20(p2.data as z.infer<typeof M20Item>);
    return f ? [f] : [];
  });
  return { frames, more: m === "msl" ? !!j.more : items.length === per };
}
async function getPage(u: string, signal: AbortSignal): Promise<RawPage> {
  const r = await fetch(u, { signal, credentials: "omit" });
  if (!r.ok) throw new Error(`NASA raw images HTTP ${r.status}`);
  return (await r.json()) as RawPage;
}
async function page(m: Mission, a: number, b: number, p: number, signal: AbortSignal, cams?: string[]): Promise<{ frames: Frame[]; more: boolean }> {
  return parsePage(m, await getPage(url(m, a, b, p, cams), signal));
}

/** Cameras offered in the newest-images gallery (the feeds' own instrument names). */
export const LATEST_CAMS: Record<Mission, [id: string, label: string][]> = {
  msl: [["NAV_LEFT_B", "Navcam"], ["MAST_LEFT", "Mastcam"], ["MAHLI", "MAHLI arm camera"], ["CHEMCAM_RMI", "ChemCam"], ["FHAZ_LEFT_B", "Front Hazcam"]],
  m20: [["NAVCAM_LEFT", "Navcam"], ["MCZ_LEFT", "Mastcam-Z"], ["SHERLOC_WATSON", "WATSON arm camera"], ["SUPERCAM_RMI", "SuperCam"], ["FRONT_HAZCAM_LEFT_A", "Front Hazcam"]],
};
/** The newest raw images from Mars, as NASA's raw-image gallery lists them (PLAN-4 D32), with the published totals:
 *  `total` every image the mission has released, `matching` those of the chosen camera. Thumbnails are dropped. */
export async function latest(m: Mission, p: number, signal: AbortSignal, cam?: string): Promise<{ frames: Frame[]; more: boolean; total: number | null; matching: number | null }> {
  const per = 50;
  const u = m === "msl"
    ? `https://mars.nasa.gov/api/v1/raw_image_items/?order=sol%20desc,date_taken%20desc&per_page=${per}&page=${p}&condition_1=msl:mission${cam ? `&condition_2=${cam}:instrument` : ""}`
    : `https://mars.nasa.gov/rss/api/?feed=raw_images&category=mars2020&feedtype=json&num=${per}&page=${p}&order=sol+desc${cam ? `&search=%7C${cam}` : ""}`;
  const j = await getPage(u, signal);
  return { ...latestFrames(m, j, per), ...totals(m, j, !!cam) };
}
const num = (v: unknown) => (v === undefined || v === null || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));
/** Exported for the test. */
export const totals = (m: Mission, j: RawPage, filtered: boolean) => m === "msl"
  ? { total: filtered ? null : num(j.total), matching: filtered ? num(j.total) : null }
  : { total: num(j.total_images), matching: filtered ? num(j.total_results) : null };
export const latestFrames = (m: Mission, j: RawPage, per = 50) => { const r = parsePage(m, j, per); return { frames: r.frames.filter((f) => f.sample !== "thumbnail"), more: r.more }; };

const PLACE_CAMS: Record<Mission, string[][]> = { msl: [["NAV_LEFT_A"], ["NAV_LEFT_B"]], m20: [["NAVCAM_LEFT", "MCZ_LEFT"]] };
/** At or after this stop's rover motion counter and before the next stop's. Perseverance's drive counter also ticks
 *  without wheel motion (sol 13 frames are 3_8 and 3_16 at waypoint 3_0), so exact matching alone misses them. */
export const atStop = (f: Frame, s: Stop, next?: Stop) =>
  f.site === s.site && f.drive !== null && f.drive >= s.drive && (!next || next.site !== s.site || f.drive < next.drive);
export const placeable = (f: Frame) => !!f.model && !!f.att && f.sample !== "thumbnail";

/**
 * Frames for the 360 view: one per direction (5 deg cells, per camera), the largest wins, then wide cameras first.
 * seniordev: capped at `max` frames; Chrome sorts every CSS 3D plane, so hundreds of overlapping frames get slow.
 */
export function pickFrames(frames: Frame[], max = 90): Frame[] {
  const best = new Map<string, Frame>();
  for (const f of frames.filter(placeable)) {
    const c = frameCentre(f.model!, f.att!, f.w, f.h);
    const k = `${f.cam.startsWith("MCZ") || f.cam.startsWith("MAST") ? "z" : "n"}:${Math.round(c.az / 5)}:${Math.round(c.el / 5)}`;
    const o = best.get(k);
    if (!o || f.w * f.h > o.w * o.h) best.set(k, f);
  }
  const wide = (f: Frame) => (f.cam.startsWith("NAV") ? 0 : 1);
  return [...best.values()].sort((a, b) => wide(a) - wide(b) || b.w * b.h - a.w * a.h).slice(0, max);
}

/** The stop at or before a rover motion counter; site 0 means the start of the mission (for Curiosity the first stop
 *  from sol 13, when its Navcam records begin to carry camera models). */
export function resolveStop(stops: Stop[], site: number, drive: number, m: Mission): number {
  let i = -1;
  for (let k = 0; k < stops.length && (stops[k]!.site < site || (stops[k]!.site === site && stops[k]!.drive <= drive)); k++) i = k;
  return i >= 0 && site > 0 ? i : Math.max(0, m === "msl" ? stops.findIndex((s) => s.sol >= 13) : 0);
}

const OfflineFile = z.object({ mission: z.enum(["msl", "m20"]), site: z.number(), drive: z.number(), items: z.array(z.unknown()), local: z.record(z.string(), z.string()) });
async function offline(m: Mission, s: Stop): Promise<Frame[] | null> {
  const r = await fetch(`/data/rovers/cache/${m}-${s.site}-${s.drive}.json`).catch(() => null);
  if (!r?.ok) return null;
  const f = OfflineFile.parse(await r.json());
  return f.items.flatMap((x) => {
    if (m === "msl") { const p = MslItem.safeParse(x); const fr = p.success ? fromMsl(p.data, f.local[p.data.imageid]) : null; return fr ? [fr] : []; }
    const p = M20Item.safeParse(x); const fr = p.success ? fromM20(p.data, f.local[p.data.imageid]) : null; return fr ? [fr] : [];
  });
}

export type StopPhotos = { frames: Frame[]; placed: Frame[]; offline: boolean; truncated: boolean; exact: boolean };

/** Frames at exactly the stop's counter when there are enough for a view; otherwise every frame before the next stop. */
export function forStop(frames: Frame[], s: Stop, next?: Stop): { placed: Frame[]; exact: boolean } {
  const mine = frames.filter((f) => atStop(f, s, next));
  const exact = mine.filter((f) => f.drive === s.drive);
  return pickFrames(exact).length >= 8 ? { placed: pickFrames(exact), exact: true } : { placed: pickFrames(mine), exact: false };
}

/** Photos taken at a stop with a camera model, from arrival until the next drive. */
export async function stopPhotos(m: Mission, stops: Stop[], i: number, signal: AbortSignal): Promise<StopPhotos> {
  const s = stops[i]!, next = stops[i + 1], b = next?.sol ?? s.sol;
  try {
    const frames: Frame[] = [];
    let truncated = false;
    for (const cams of PLACE_CAMS[m]) {
      for (let p = 0; p < 5; p++) {
        const r = await page(m, s.sol, b, p, signal, cams);
        frames.push(...r.frames.filter((f) => atStop(f, s, next)));
        if (!r.more) break;
        if (p === 4) truncated = true;
      }
    }
    return { frames, ...forStop(frames, s, next), offline: false, truncated };
  } catch (e) {
    if ((e as Error).name === "AbortError") throw e;
    const cached = await offline(m, s);
    if (!cached) throw e;
    return { frames: cached, ...forStop(cached, s, next), offline: true, truncated: false };
  }
}

/** Every image of the stop's sols (all cameras), one page at a time, for the film strip. Records without a site
 *  (Curiosity's Mastcam) are kept when their sol is before the next drive. */
export async function stopGallery(m: Mission, stops: Stop[], i: number, p: number, signal: AbortSignal): Promise<{ frames: Frame[]; more: boolean }> {
  const s = stops[i]!, n = stops[i + 1], next = n?.sol ?? s.sol;
  const r = await page(m, s.sol, next, p, signal);
  const here = (f: Frame) => atStop(f, s, n) || (f.site === null && f.sol >= s.sol && (f.sol < next || next === s.sol));
  return { frames: r.frames.filter((f) => here(f) && f.sample !== "thumbnail"), more: r.more };
}
