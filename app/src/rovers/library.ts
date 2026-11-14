// Homeward | app/src/rovers/library.ts | v3.0.0 | 2026-11-13
// Every lander's own photos from the NASA Image and Video Library (images-api.nasa.gov, CORS open; PLAN-3 D24).
// A curated query per lander plus a keyword the title or description must contain, and artist concepts and factory
// photos dropped, because the library's free-text search also matches namesakes (Schiaparelli crater, for one).
import { z } from "zod";

/** medium is missing for some older photos (only orig and thumb exist), so the viewer falls back to orig. */
export type LibraryPhoto = { id: string; title: string; date: string; credit: string; thumb: string; medium: string; orig: string; link: string; note?: string };

const QUERY: Record<string, { q: string; must: RegExp }> = {
  mars3: { q: "Soviet Mars 3 lander", must: /mars 3|soviet/i },
  viking1: { q: "Viking Lander 1", must: /viking lander 1|viking 1\b/i },
  viking2: { q: "Viking Lander 2", must: /viking lander 2|viking 2\b/i },
  pathfinder: { q: "Pathfinder Sojourner", must: /pathfinder|sojourner/i },
  beagle2: { q: "Beagle 2", must: /beagle/i },
  spirit: { q: "Spirit rover Gusev", must: /spirit/i },
  opportunity: { q: "Opportunity rover Meridiani", must: /opportunity/i },
  phoenix: { q: "Phoenix Mars lander", must: /phoenix/i },
  curiosity: { q: "Curiosity rover Gale", must: /curiosity/i },
  insight: { q: "InSight lander", must: /insight/i },
  perseverance: { q: "Perseverance rover Jezero", must: /perseverance|ingenuity/i },
  zhurong: { q: "Zhurong", must: /zhurong/i },
  schiaparelli: { q: "Schiaparelli ExoMars lander", must: /exomars|lander/i },
};
// Official resources shown first for a lander, whatever the filter says (PLAN-4 D31): PIA23179 is a rendered route
// view, so its caption says "animation" and the filter would drop it.
const PINNED: Record<string, { id: string; note: string }[]> = {
  curiosity: [{ id: "PIA23179", note: "NASA's proposed route up lower Mount Sharp (2019), a perspective view built from MRO and Mars Express data. The drive drawn on the map is where Curiosity actually went." }],
};
const NOT_FROM_MARS = /artist|concept|illustration|animation|processing|assembly|clean ?room|kennedy|launch|testbed|engineering model|full-scale model/i;

const Search = z.object({ collection: z.object({ items: z.array(z.object({
  data: z.array(z.object({ nasa_id: z.string(), title: z.string(), date_created: z.string().optional(), description: z.string().optional(),
    secondary_creator: z.string().optional(), photographer: z.string().optional(), center: z.string().optional() })).min(1),
  links: z.array(z.object({ href: z.string() })).optional(),
})) }) });

// The preview link is whichever size NASA chose (thumb, small, medium, large or orig).
const ASSET = /^(https:\/\/images-assets\.nasa\.gov\/image\/[\w.%-]+\/[\w.%-]+)~(thumb|small|medium|large|orig)\.jpg$/;

/** Filters and maps one search response; exported for the test. Only NASA's own image host is accepted. */
export function libraryPhotos(json: unknown, landerId: string, max = 18, pinned = false): LibraryPhoto[] {
  const want = QUERY[landerId];
  const r = Search.safeParse(json);
  if (!want || !r.success) return [];
  return r.data.collection.items.flatMap((it) => {
    const d = it.data[0]!, text = `${d.title} ${d.description ?? ""}`;
    const thumb = (it.links?.[0]?.href ?? "").replace(/^http:\/\//, "https://"), base = thumb.match(ASSET)?.[1];
    if (!base || (!pinned && (!want.must.test(text) || NOT_FROM_MARS.test(text)))) return [];
    return [{ id: d.nasa_id, title: d.title, date: (d.date_created ?? "").slice(0, 10), credit: d.secondary_creator ?? d.photographer ?? d.center ?? "NASA",
      thumb, medium: `${base}~medium.jpg`, orig: `${base}~orig.jpg`, link: `https://images.nasa.gov/details/${encodeURIComponent(d.nasa_id)}` }];
  }).slice(0, max);
}

export const hasLibrary = (landerId: string) => landerId in QUERY;

export async function loadLibrary(landerId: string, signal?: AbortSignal): Promise<LibraryPhoto[]> {
  const want = QUERY[landerId];
  if (!want) return [];
  const get = async (q: string) => {
    const r = await fetch(`https://images-api.nasa.gov/search?${q}&media_type=image`, { signal, credentials: "omit" });
    if (!r.ok) throw new Error(`NASA image library HTTP ${r.status}`);
    return r.json();
  };
  const pins = PINNED[landerId] ?? [];
  const [found, ...pinned] = await Promise.all([get(`q=${encodeURIComponent(want.q)}&page_size=60`), ...pins.map((p) => get(`nasa_id=${p.id}`))]);
  const first = pinned.flatMap((j, k) => libraryPhotos(j, landerId, 1, true).map((p) => ({ ...p, note: pins[k]!.note })));
  return [...first, ...libraryPhotos(found, landerId).filter((p) => !first.some((f) => f.id === p.id))];
}
