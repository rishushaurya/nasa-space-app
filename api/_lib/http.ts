// Homeward | api/_lib/http.ts | v1.0.0 | 2026-10-29
// Shared helpers for the Web-standard Vercel functions (also run by the Vite dev server).

export const requestId = () => crypto.randomUUID().slice(0, 8);

export function json(status: number, body: unknown, rid: string, extra: Record<string, string> = {}): Response {
  return new Response(JSON.stringify({ ...(body as object), requestId: rid }), {
    status,
    headers: { "content-type": "application/json", "cache-control": "no-store", "x-request-id": rid, ...extra },
  });
}

export function log(entry: Record<string, unknown>) {
  console.log(JSON.stringify({ ts: new Date().toISOString(), ...entry }));
}

export async function ipHash(req: Request): Promise<string> {
  const ip = (req.headers.get("x-forwarded-for") ?? "unknown").split(",")[0]!.trim();
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + (process.env.IP_SALT ?? "homeward")));
  return [...new Uint8Array(buf)].slice(0, 3).map((b) => b.toString(16).padStart(2, "0")).join("");
}

export function originAllowed(req: Request, env: Record<string, string | undefined> = process.env): boolean {
  const allowed = (env.ALLOWED_ORIGINS ?? "http://localhost:5173").split(",").map((s) => s.trim());
  const origin = req.headers.get("origin");
  return origin !== null && allowed.includes(origin);
}

// seniordev: in-memory sliding window per function instance; a shared store is only needed at much higher traffic.
const hits = new Map<string, number[]>();
export function rateLimit(key: string, max: number, windowMs: number, now = Date.now()): { ok: true } | { ok: false; retryAfterS: number } {
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= max) return { ok: false, retryAfterS: Math.ceil((windowMs - (now - list[0]!)) / 1000) };
  list.push(now);
  hits.set(key, list);
  return { ok: true };
}
export const resetRateLimits = () => hits.clear();
