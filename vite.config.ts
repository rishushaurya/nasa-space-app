// Homeward | vite.config.ts | v1.0.0 | 2026-10-29
import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";

// Runs the same Web-standard handlers as Vercel (api/v1/*.ts) inside the dev server,
// so local development needs no Vercel account.
function apiDev(): Plugin {
  return {
    name: "homeward-api-dev",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ?? "";
        const route = url.match(/^\/api\/v1\/([a-z-]+)/)?.[1];
        if (!route) return next();
        try {
          // An absolute path: with root "app", "/api/v1/..." would resolve inside app/ and fail (HTTP 500).
          const mod = await server.ssrLoadModule(fileURLToPath(new URL(`./api/v1/${route}.ts`, import.meta.url)));
          const handler = mod[req.method ?? "GET"];
          if (!handler) { res.statusCode = 405; return res.end(); }
          const chunks: Buffer[] = [];
          for await (const c of req) chunks.push(c as Buffer);
          const headers = new Headers();
          for (const [k, v] of Object.entries(req.headers)) if (typeof v === "string") headers.set(k, v);
          headers.set("x-forwarded-for", req.socket.remoteAddress ?? "127.0.0.1");
          const body = chunks.length ? Buffer.concat(chunks) : undefined;
          const response: Response = await handler(new Request(`http://${req.headers.host ?? "localhost:5173"}${url}`, { method: req.method, headers, body }));
          res.statusCode = response.status;
          response.headers.forEach((v, k) => res.setHeader(k, v));
          res.end(Buffer.from(await response.arrayBuffer()));
        } catch (e) {
          server.config.logger.error(String(e));
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "DEV_HANDLER_FAILED" }));
        }
      });
    },
  };
}

// Cross-origin isolation lets onnxruntime-web run Kokoro on several threads (SharedArrayBuffer). Mirrors vercel.json.
// credentialless (not require-corp) so NASA rover photos, which send no CORP header, still load (PLAN-2 D15).
const ISOLATION = { "Cross-Origin-Opener-Policy": "same-origin", "Cross-Origin-Embedder-Policy": "credentialless" };
// The preview server sends every header vercel.json sends for all paths (CSP included), so the production build can be
// checked locally under the same policy. The dev server keeps only ISOLATION, because Vite's dev client needs inline code.
const VERCEL = JSON.parse(readFileSync(fileURLToPath(new URL("./vercel.json", import.meta.url)), "utf8")) as { headers: { source: string; headers: { key: string; value: string }[] }[] };
const PRODUCTION = Object.fromEntries(VERCEL.headers.find((h) => h.source === "/(.*)")!.headers.map((h) => [h.key, h.value]));

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));
  return {
    root: "app",
    publicDir: "public",
    envDir: "..",
    plugins: [react(), apiDev()],
    worker: { format: "es" },
    build: { outDir: "../dist", emptyOutDir: true, chunkSizeWarningLimit: 6000 },
    server: { port: 5173, headers: ISOLATION },
    preview: { port: 4173, headers: { ...ISOLATION, ...PRODUCTION } },
    test: { root: ".", include: ["app/src/**/*.test.ts", "api/**/*.test.ts"] },
  };
});
