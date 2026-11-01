// Homeward | app/src/main.tsx | v1.0.0 | 2026-10-29
import "./zod-config";
import "./cesium-base";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./styles/tokens.css";
import "./styles/app.css";
import { createRoot } from "react-dom/client";
import { App } from "./App";

window.addEventListener("error", (e) => console.error(JSON.stringify({ level: "error", source: "window", message: e.message })));
window.addEventListener("unhandledrejection", (e) => console.error(JSON.stringify({ level: "error", source: "promise", message: String(e.reason) })));

createRoot(document.getElementById("root")!).render(<App />);

if ("serviceWorker" in navigator && import.meta.env.PROD) navigator.serviceWorker.register("/sw.js").catch(() => {});
