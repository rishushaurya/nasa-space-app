// Homeward | app/public/sw.js | v1.1.0 | 2026-10-29
// Offline mode. Install caches only the shell; files are cached as they are used, and once the globe is up the page
// sends "warm" so the rest of the data manifest is filled in the background: Kokoro only when voice is on,
// Whisper only where the browser has no speech recognition of its own.
// Precaching everything at install raced the page's own first-visit downloads and fetched 211 MB twice.
const CACHE = "homeward-v2";
const RUNTIME = ["/assets/", "/cesium/", "/data/", "/models/", "/ort/"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(["/", "/favicon.svg", "/manifest.webmanifest"])));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k !== "kokoro-voices") await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => {
  if (e.data?.type !== "warm") return;
  e.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    const m = await (await fetch("/data/manifest.json", { cache: "no-cache" })).json();
    // A file whose hash changed since the last visit is dropped, so a redeploy with fixed data reaches returning users.
    const old = new Map(((await (await cache.match("/data/manifest.json"))?.json().catch(() => null))?.files ?? []).map((f) => [f.path, f.sha256]));
    for (const f of m.files) if (old.has(f.path) && old.get(f.path) !== f.sha256) await cache.delete(f.path);
    await cache.put("/data/manifest.json", new Response(JSON.stringify(m), { headers: { "content-type": "application/json" } }));
    for (const f of m.files) {
      const model = /^\/(models|ort)\//.test(f.path), jsep = /\.jsep\./.test(f.path);
      if (model && !((e.data.voice && (jsep || f.path.includes("Kokoro"))) || (e.data.whisper && (jsep || f.path.includes("whisper"))))) continue;
      if (await cache.match(f.path)) continue;
      try { await cache.add(f.path); } catch { /* offline or quota: retried on the next visit */ }
    }
  })().catch(() => {}));
});

self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || url.origin !== location.origin || url.pathname.startsWith("/api/")) return;
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then((r) => { const copy = r.clone(); caches.open(CACHE).then((c) => c.put("/", copy)); return r; }).catch(() => caches.match("/")));
    return;
  }
  e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((hit) => hit || fetch(e.request).then((r) => {
    if (r.ok && r.status === 200 && RUNTIME.some((p) => url.pathname.startsWith(p))) { const copy = r.clone(); caches.open(CACHE).then((c) => c.put(url.pathname, copy)); }
    return r;
  })));
});
