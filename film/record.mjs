// Homeward | film/record.mjs | v1.0.0 | 2026-11-14
// Records every film shot from the real app: headless Chrome on the GPU, DevTools screencast frames, ffmpeg to 30 fps.
// Needs `npm run dev` on :5173 and `npm i --no-save puppeteer-core@24`. Usage: node film/record.mjs [shot ...]
// Writes film/out/clips/<shot>.mp4. Every picture is the app itself; "clean" shots only hide the panels.
import puppeteer from "puppeteer-core";
import { mkdirSync, writeFileSync, rmSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

export const FF = process.env.FFMPEG ?? "ffmpeg";
const OUT = fileURLToPath(new URL("./out/clips/", import.meta.url));
const CHROME = process.env.CHROME ?? "C:/Program Files/Google/Chrome/Application/chrome.exe";
mkdirSync(OUT, { recursive: true });
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
let n = 0;
const url = (patch) => `http://localhost:${process.env.PORT ?? 5173}/?r=${++n}#s=` + encodeURIComponent(JSON.stringify({ voice: false, online: false, ...patch }));

const browser = await puppeteer.launch({
  executablePath: CHROME, headless: true,
  args: ["--enable-gpu", "--use-angle=d3d11", "--ignore-gpu-blocklist", "--window-size=1920,1080", "--mute-audio"],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 1 },
});
const page = await browser.newPage();
page.on("pageerror", (e) => console.log("  pageerror:", e.message));

async function settle(maxMs = 45000) {
  const t0 = Date.now();
  for (let ok = 0; Date.now() - t0 < maxMs; await wait(400)) {
    const done = await page.evaluate(() => window.__globe?.viewer.scene.globe.tilesLoaded).catch(() => false);
    if ((ok = done ? ok + 1 : 0) >= 5) return;
  }
  console.log("  tiles still loading after", maxMs, "ms");
}
async function go(patch, { clean = false } = {}) {
  await page.goto(url(patch), { waitUntil: "networkidle2", timeout: 120000 });
  await page.waitForFunction(() => !!window.__globe, { timeout: 90000 });
  if (clean) await page.addStyleTag({ content: ".app > *:not(.globe){display:none!important}" });
  await wait(1500);
}
// Real Sun for the next time the place has this local true solar time (Mars24, app/src/core/mars-time.ts).
const sunAt = (lon, ltst) => page.evaluate(async (lon, ltst) => {
  const m = await import("/src/core/mars-time.ts");
  window.__globe.setSun(m.nextLtst(Date.now(), lon, ltst));
}, lon, ltst);
const fly = (p, range, o = {}) => page.evaluate((p, range, o) => window.__globe.flyTo(p, range, o), p, range, o);
const click = (text) => page.locator(`::-p-text(${text})`).click();

async function record(name, fn) {
  const dir = `${OUT}${name}_frames/`;
  rmSync(dir, { recursive: true, force: true }); mkdirSync(dir, { recursive: true });
  const cdp = await page.createCDPSession();
  const ts = [];
  cdp.on("Page.screencastFrame", (f) => {
    writeFileSync(`${dir}${String(ts.length).padStart(5, "0")}.jpg`, Buffer.from(f.data, "base64"));
    ts.push(f.metadata.timestamp);
    cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  // Draw every frame while recording, so the screencast never stalls on render-on-demand.
  await page.evaluate(() => { window.__globe.viewer.scene.requestRenderMode = false; });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 93, maxWidth: 1920, maxHeight: 1080, everyNthFrame: 1 });
  await fn();
  await cdp.send("Page.stopScreencast");
  await wait(300);
  await page.evaluate(() => { window.__globe.viewer.scene.requestRenderMode = true; });
  await cdp.detach();
  let list = "ffconcat version 1.0\n";
  ts.forEach((t, i) => { list += `file '${String(i).padStart(5, "0")}.jpg'\nduration ${((ts[i + 1] ?? t + 1 / 30) - t).toFixed(5)}\n`; });
  writeFileSync(`${dir}list.txt`, list + `file '${String(ts.length - 1).padStart(5, "0")}.jpg'\n`);
  execFileSync(FF, ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", `${dir}list.txt`, "-vf", "fps=30,format=yuv420p", "-c:v", "libx264", "-preset", "slow", "-crf", "14", `${OUT}${name}.mp4`]);
  rmSync(dir, { recursive: true, force: true });
  const span = ts.at(-1) - ts[0];
  console.log(`${name}: ${span.toFixed(1)} s at ${(ts.length / span).toFixed(0)} fps`);
}

const world = { scene: "explore", imagery: "viking", labels: false, tracks: false };
const SHOTS = {
  // 1. Mars from orbit, sunlit Valles Marineris, slow drift (under the real wind).
  hook: async () => {
    await go(world, { clean: true }); await sunAt(-65, 11);
    await fly({ lat: -2, lon: -100 }, 7.2e6, { seconds: 0, pitchDeg: -90 }); await settle();
    await record("hook", async () => { await fly({ lat: -8, lon: -62 }, 6.4e6, { seconds: 18, pitchDeg: -90 }); });
  },
  // 2. The live mission clock: Mars time, sols and the radio delay to Earth.
  clock: async () => { await go({ scene: "clock" }); await settle(); await wait(2000); await record("clock", () => wait(12000)); },
  // 3-4. One take from the night side into the light: the data montage, then the title.
  dusk: async () => {
    await go(world, { clean: true }); await sunAt(20, 9);
    await fly({ lat: 10, lon: -95 }, 9e6, { seconds: 0, pitchDeg: -90 }); await settle();
    await record("dusk", async () => { await fly({ lat: 0, lon: 25 }, 7e6, { seconds: 24, pitchDeg: -90 }); });
  },
  // 5. Olympus Mons and Valles Marineris on the live 200 m relief in Viking colour, low morning Sun.
  olympus: async () => {
    await go(world, { clean: true }); await sunAt(-134, 8.6);
    await fly({ lat: 2, lon: -137 }, 1.5e6, { seconds: 0, pitchDeg: -55 }); await settle();
    await record("olympus", async () => { await fly({ lat: 12.5, lon: -133.8 }, 5.2e5, { seconds: 13, pitchDeg: -32 }); await wait(500); });
  },
  valles: async () => {
    await go(world, { clean: true }); await sunAt(-70, 9);
    await fly({ lat: -20, lon: -82 }, 7e5, { seconds: 0, pitchDeg: -35, headingDeg: 60 }); await settle();
    await record("valles", async () => { await fly({ lat: -15, lon: -64 }, 3.2e5, { seconds: 12, pitchDeg: -24, headingDeg: 75 }); await wait(500); });
  },
  // 5b. Search: 2,064 named places (IAU/USGS Gazetteer).
  search: async () => {
    await go({ scene: "explore", imagery: "viking", tracks: true }); await settle();
    await record("search", async () => {
      await wait(800);
      await page.type('[aria-label="Search places, landers or coordinates"]', "Jezero", { delay: 140 });
      await wait(900); await page.keyboard.press("Enter"); await wait(8000);
    });
  },
  // 6. The landing-site tour, in landing order, with the real panel.
  tour: async () => {
    await go({ scene: "explore", imagery: "viking", tracks: true }); await settle();
    await record("tour", async () => { await wait(600); await click("Tour every landing site"); await wait(19000); });
  },
  // 6b. Opportunity's 45.1 km traverse (PDS Geosciences Node) down to Victoria crater on HiRISE.
  opportunity: async () => {
    await go({ scene: "explore", imagery: "ctx", tracks: true, labels: false, overlays: ["sites"], overlayAlpha: 1 }, { clean: true }); await sunAt(-5.5, 11);
    await fly({ lat: -2.4, lon: -5.6 }, 1.1e5, { seconds: 0, pitchDeg: -80 }); await settle();
    await record("opportunity", async () => { await fly({ lat: -2.09, lon: -5.5 }, 9e3, { seconds: 13, pitchDeg: -55 }); await wait(800); });
  },
  // 7. Science overlays switched on in the real panel: geology, then thermal inertia.
  layers: async () => {
    await go({ scene: "explore", imagery: "viking", tracks: false, labels: false }); await sunAt(137, 11);
    await fly({ lat: -6, lon: 138 }, 2.2e6, { seconds: 0, pitchDeg: -70 }); await settle();
    await record("layers", async () => {
      await wait(1000); await click("Geologic map (USGS SIM 3292)"); await wait(4500);
      await click("Geologic map (USGS SIM 3292)"); await click("Thermal inertia (MGS TES)"); await wait(4500);
    });
  },
  // 8. Rover view: stand at a stop and look around (drag) in the rover's own photos. Only the featured stops, whose
  // NASA records the app keeps (pipeline/rovers.py FEATURED): NASA's raw-image API refuses headless browsers.
  ...Object.fromEntries([["yellowknife", "msl", 6, 0], ["dingo", "msl", 26, 184], ["jezero", "m20", 3, 0], ["boxwork", "msl", 120, 0]].map(([name, m, site, drive]) => [name, async () => {
    await go({ scene: "relive", rover: { m, site, drive } }); await wait(12000);
    await record(name, async () => {
      await page.mouse.move(1500, 560); await page.mouse.down();
      for (let k = 1; k <= 300; k++) { await page.mouse.move(1500 - k * 4.5, 560); await wait(33); } // about 45 deg of turn
      await page.mouse.up(); await wait(400);
    });
  }])),
  // 9. Briefing at Yellowknife Bay: live Sun and delay, measured conditions, latest REMS sol, space weather.
  briefing: async () => {
    await go({ scene: "briefing" }); await settle(); await wait(6000);
    await record("briefing", async () => {
      await wait(3000);
      await page.evaluate(() => { const el = [...document.querySelectorAll("*")].find((e) => e.scrollHeight > e.clientHeight + 40 && getComputedStyle(e).overflowY !== "visible" && e.getBoundingClientRect().left > 900); el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" }); });
      await wait(11000);
    });
  },
  // 10. The planner's route from the habitat to Sheepbed mudstone with its budgets.
  plan: async () => {
    await go({ scene: "plan", hirise: true }); await settle(); await wait(3000);
    await record("plan", async () => {
      const id = await page.evaluate(() => setInterval(() => window.__globe.cam.orbit(0.12, 0), 33));
      await wait(13000); await page.evaluate((id) => clearInterval(id), id);
    });
  },
  // 11. First-person walk following the plan, helmet display live.
  walk: async () => {
    await go({ scene: "walk", hirise: true }); await settle(); await wait(2000);
    await record("walk", async () => { await click("Follow the plan"); await wait(400); await click("10x").catch(() => {}); await wait(15000); });
  },
  // 12. Out on the route, the suit assistant (offline rules on this device) answers with its source.
  assistant: async () => {
    await go({ scene: "walk", hirise: true }); await settle(); await wait(1500);
    await record("assistant", async () => { await click("Follow the plan"); await wait(400); await click("10x").catch(() => {}); await wait(7000); await click("How long until I must turn back?"); await wait(8500); });
  },
  // 13. Orbit view in time-lapse: Phobos and the real orbiters (JPL Horizons) move.
  orbiters: async () => {
    await go({ scene: "orbit", imagery: "viking" }); await page.addStyleTag({ content: ".app > *:not(.globe){opacity:0!important}" }); await settle();
    await record("orbiters", async () => { await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Time-lapse"))?.click()); await wait(13000); });
  },
  // 14. Credits: every agency, dataset and licence, scrolling.
  credits: async () => {
    await go({ scene: "credits" }); await settle(); await wait(2000);
    await record("credits", async () => {
      await page.evaluate(() => { const el = [...document.querySelectorAll("*")].filter((e) => e.scrollHeight > e.clientHeight + 200 && getComputedStyle(e).overflowY !== "visible").sort((a, b) => b.scrollHeight - a.scrollHeight)[0]; if (el) { const t0 = performance.now(); const f = () => { el.scrollTop = (performance.now() - t0) * 0.09; if (performance.now() - t0 < 10000) requestAnimationFrame(f); }; f(); } });
      await wait(10000);
    });
  },
};

for (const name of process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(SHOTS)) {
  try { await SHOTS[name](); } catch (e) { console.log(`${name}: FAILED ${e.message}`); }
}
await browser.close();
