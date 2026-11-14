// Homeward | film/make.mjs | v1.0.0 | 2026-11-14
// Cuts the recorded shots (film/out/clips) to the narration (film/out/voice), adds titles and burned-in English
// subtitles (also written as .srt), mixes voice, music (film/out/music) and NASA's Mars recordings, and writes
// film/out/homeward-story.mp4 and film/out/homeward-30s.mp4. Usage: node film/make.mjs [story|short]
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const FF = process.env.FFMPEG ?? "ffmpeg", FP = process.env.FFPROBE ?? "ffprobe";
const OUT = fileURLToPath(new URL("./out/", import.meta.url));
const NASA = process.env.NASA_AUDIO; // folder with NASA's WAVs from nasa.gov/sounds-from-beyond (see SCRIPT.md)
const dur = (f) => Number(execFileSync(FP, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const lines = JSON.parse(readFileSync(new URL("./lines.json", import.meta.url), "utf8"));
const TEXT = Object.fromEntries([...lines.story, ...lines.short]);
const voiceLen = (id) => dur(`${OUT}voice/${id}.wav`);

// Shots. dur: seconds on screen (or "vo": the line plus padding); at: where its line starts within the shot.
// zoom: a slow push from z0 to z1 centred on (cx, cy) as fractions of the frame. dim: darken for type.
const STORY = [
  { clip: "hook", in: 0, vo: "s01", at: 3.0, pad: 1.0, titles: [["Kicker", 0.6, 8.6, "Real wind, recorded on Mars", 1], ["Credit", 0.9, 8.6, "Perseverance SuperCam microphone, sol 4 (22 Feb 2021). NASA/JPL-Caltech/LANL/CNES", 1]] },
  { clip: "clock", in: 1, vo: "s02", zoom: [1.0, 1.12, 0.14, 0.33] },
  { clip: "dusk", in: 0, vo: "s03", dim: 0.45, montage: true },
  { clip: "dusk", in: 11.2, vo: "s04", dim: 0.3, titles: [["Title", 1.35, 99, "Homeward", 5], ["Sub", 3.0, 99, "A map of Mars made only from real data", 5]] },
  { clip: "olympus", in: 1.0, dur: 5.0, vo: "s05", at: 0.3, titles: [["Place", 0.6, 4.6, "Olympus Mons  |  live 200 m relief, MOLA (NASA) and HRSC (ESA)", 1]] },
  { clip: "valles", in: 2.0, dur: 4.2, titles: [["Place", 0.4, 3.8, "Valles Marineris", 1]] },
  { clip: "search", in: 0.6, dur: 4.6 },
  { clip: "tour", in: 0.4, dur: 6.0, vo: "s06", at: 0.3 },
  { clip: "opportunity", in: 1.5, dur: 6.4, titles: [["Place", 0.5, 5.8, "Opportunity, 45.1 km, sols 1 to 5130  |  PDS Geosciences Node", 1]] },
  { clip: "layers", in: 0.6, vo: "s07" },
  { clip: "yellowknife", in: 1.5, dur: 3.6, vo: "s08", at: 0.3, titles: [["Place", 0.4, 3.3, "Curiosity at Yellowknife Bay, its own photos", 1]] },
  { clip: "dingo", in: 2.0, dur: 3.2, titles: [["Place", 0.3, 3.0, "Dingo Gap, sol 528", 1]] },
  { clip: "briefing", in: 0.4, vo: "s09", titles: [["Place", 0.5, 4.5, "Sol 182, Yellowknife Bay", 1]] },
  { clip: "plan", in: 0.4, vo: "s10", titles: [["Place", 0.6, 6, "Habitat to Sheepbed mudstone, 443 m", 1]] },
  { clip: "walk", in: 1.0, vo: "s11", wind: true, zoom: [1.25, 1.4, 0.2, 0.15] },
  { clip: "assistant", in: 7.0, vo: "s12", zoom: [1.45, 1.6, 0.16, 0.86] },
  { clip: "orbiters", in: 5.5, vo: "s13", titles: [["Place", 0.5, 5.5, "Orbiter positions: JPL Horizons", 1]] },
  { clip: "credits", in: 0.5, vo: "s14", titles: [["Big", 2.6, 99, "88 cited sources", 4]] },
  { clip: "hook", in: 9.0, vo: "s15", at: 1.0, pad: 3.6, dim: 1, blur: 14, end: true },
];
const SHORT = [
  { clip: "hook", in: 2.0, vo: "t01", at: 0.4, pad: 0.3, titles: [["Kicker", 0.3, 4.0, "Real wind, recorded on Mars", 1]] },
  { clip: "clock", in: 2.0, vo: "t02", pad: 0.3, zoom: [1.0, 1.08, 0.14, 0.33] },
  { clip: "dusk", in: 15.0, vo: "t03", pad: 0.3, dim: 0.3, titles: [["Title", 0.15, 99, "Homeward", 5]] },
  { clip: "olympus", in: 3.0, vo: "t04", pad: 0.25 },
  { clip: "tour", in: 1.0, vo: "t05", pad: 0.3 },
  { clip: "yellowknife", in: 2.0, vo: "t06", pad: 0.3 },
  { clip: "plan", in: 1.0, dur: 2.9, vo: "t07", at: 0.2 },
  { clip: "walk", in: 2.0, dur: 3.0, wind: true, zoom: [1.25, 1.35, 0.2, 0.15] },
  { clip: "hook", in: 9.0, vo: "t08", at: 0.3, dim: 1, blur: 14, end: true, fill: 30 },
];
const DATASETS = ["HiRISE", "CTX", "MOLA", "HRSC", "THEMIS", "TES", "Viking", "REMS", "RAD", "DONKI", "JPL Horizons", "PDS", "USGS Gazetteer", "Mars24"];

// ASS colours are &HAABBGGRR; from app/src/styles/tokens.css.
const C = { text: "&H00F8ECE8", muted: "&H00CCADA3", accent: "&H005DA7E8", bg: "&H00180906" };
const ASS_HEAD = `[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Sub,Inter Film,46,${C.text},${C.text},&H90180906,&H80180906,0,0,0,0,100,100,0,0,1,2.2,1.4,2,160,160,62,1
Style: Kicker,Inter Film,60,${C.text},${C.text},&H70180906,&H90000000,-1,0,0,0,100,100,1,0,1,1.5,2,1,110,110,250,1
Style: Credit,Inter Film,28,${C.muted},${C.muted},&H70180906,&H90000000,0,0,0,0,100,100,0.5,0,1,1.2,1.5,1,112,110,205,1
Style: Place,Inter Film,34,${C.text},${C.text},&H80180906,&H90000000,-1,0,0,0,100,100,1,0,1,1.6,1.8,7,96,90,84,1
Style: Title,Inter Film,188,${C.accent},${C.accent},&H30180906,&H80000000,-1,0,0,0,100,100,6,0,1,3.5,5,5,0,0,30,1
Style: Big,Inter Film,110,${C.text},${C.text},&H60180906,&HA0000000,-1,0,0,0,100,100,2,0,1,2,4,5,0,0,0,1
Style: Data,Inter Film,40,${C.muted},${C.muted},&H00000000,&H00000000,0,0,0,0,100,100,3,0,1,0,0,7,0,0,0,1
Style: End1,Inter Film,150,${C.accent},${C.accent},&H60180906,&HA0000000,-1,0,0,0,100,100,6,0,1,0,3,5,0,0,0,1
Style: End2,Inter Film,46,${C.text},${C.text},&H60180906,&HA0000000,0,0,0,0,100,100,2,0,1,0,2,5,0,0,0,1
Style: End3,Inter Film,29,${C.muted},${C.muted},&H60180906,&HA0000000,0,0,0,0,100,100,0.5,0,1,1,1.5,5,0,0,0,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
`;
const ts = (s, srt) => {
  s = Math.max(0, s);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  return srt ? `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${x.toFixed(3).padStart(6, "0").replace(".", ",")}` : `${h}:${String(m).padStart(2, "0")}:${x.toFixed(2).padStart(5, "0")}`;
};
// Split a line into subtitle chunks (at most ~52 characters) timed by length; Kokoro pauses at punctuation.
function chunks(text) {
  const parts = text.match(/[^.,:;!?]+[.,:;!?]*/g).map((p) => p.trim());
  const out = [];
  for (const p of parts) { const last = out.at(-1); if (last && last.length + p.length < 46 && !/[.!?]$/.test(last)) out[out.length - 1] = `${last} ${p}`; else out.push(p); }
  return out;
}

function build(name, shots, xf) {
  // Timeline: shot k starts at T[k]; crossfades of xf seconds overlap neighbours.
  const lens = shots.map((s) => s.vo ? voiceLen(s.vo) : 0);
  const D = shots.map((s, k) => s.dur ?? (s.at ?? 0.35) + lens[k] + (s.pad ?? 0.7));
  const T = []; let t = 0;
  D.forEach((d, k) => { T.push(t); t += d - (k < D.length - 1 ? xf : 0); });
  let total = t;
  if (shots.at(-1).fill) { D[D.length - 1] += shots.at(-1).fill - total; total = shots.at(-1).fill; }
  const voices = shots.map((s, k) => s.vo && { id: s.vo, t: T[k] + (s.at ?? 0.35), len: lens[k] }).filter(Boolean);

  // Titles and subtitles.
  let ass = ASS_HEAD, srt = "", n = 0;
  const ev = (style, a, b, text) => { ass += `Dialogue: 1,${ts(a)},${ts(b)},${style},,0,0,0,,${text}\n`; };
  for (const v of voices) {
    const cs = chunks(TEXT[v.id]), w = cs.map((c) => c.length + 6), sum = w.reduce((a, b) => a + b, 0);
    let a = v.t;
    cs.forEach((c, i) => {
      const b = a + (v.len * w[i]) / sum;
      ev("Sub", a, b - 0.04, `{\\fad(120,120)}${c}`);
      srt += `${++n}\n${ts(a, 1)} --> ${ts(b - 0.04, 1)}\n${c}\n\n`;
      a = b;
    });
  }
  shots.forEach((s, k) => {
    const end = T[k] + D[k];
    for (const [style, a, b, text, how] of s.titles ?? []) {
      const s0 = T[k] + a, s1 = Math.min(T[k] + b, end - 0.1);
      const anim = style === "Title" ? "{\\fad(500,500)\\blur10\\fsp40\\t(0,900,0.5,\\blur0\\fsp6)}"
        : style === "Big" ? "{\\fad(300,400)\\fscx92\\fscy92\\t(0,500,0.6,\\fscx100\\fscy100)}"
        : style === "Sub" && how === 5 ? "" : "{\\fad(350,350)}";
      ev(style === "Sub" ? "Kicker" : style, s0, s1, style === "Sub" ? `{\\an5\\pos(960,660)\\fs44\\b0\\fad(500,500)}${text}` : anim + text);
    }
    if (s.montage) {
      // The scattered archives: each dataset name lands somewhere different, then all fade together.
      DATASETS.forEach((d, i) => {
        const x = 170 + ((i * 523) % 1520), y = 150 + ((i * 337) % 640), a = T[k] + 0.5 + i * 0.42;
        ev("Data", a, T[k] + D[k] - 0.5, `{\\pos(${x},${y})\\fad(300,700)\\alpha&HFF&\\t(0,300,\\alpha&H30&)}${d}`);
      });
    }
    if (s.end) {
      const a = T[k] + (s.at ?? 0.35) + 0.15, b = total;
      ev("End1", a, b, `{\\pos(960,430)\\fad(600,0)\\blur8\\fsp30\\t(0,900,0.5,\\blur0\\fsp6)}Homeward`);
      ev("End2", a + 0.7, b, `{\\pos(960,560)\\fad(500,0)}Martian Map  |  NASA Space Apps Challenge 2026, Bengaluru`);
      ev("End3", a + 1.2, b, `{\\pos(960,880)\\fad(500,0)}Real screen recordings of the app. Narration: Kokoro-82M AI voice. Music: MusicGen (AI). Mars sound: NASA/JPL-Caltech/LANL/CNES.`);
      ev("End3", a + 1.2, b, `{\\pos(960,920)\\fad(500,0)}Data: NASA, ESA, DLR, USGS, JPL and more, every number cited in the app.`);
    }
  });
  writeFileSync(`${OUT}${name}.ass`, ass);
  writeFileSync(`${OUT}${name}.srt`, srt);

  // Video: trim, push in, dim, crossfade.
  const args = ["-y", "-v", "error", "-stats"];
  const vf = [];
  shots.forEach((s, k) => {
    args.push("-ss", String(s.in), "-t", String(D[k] + 0.1), "-i", `${OUT}clips/${s.clip}.mp4`);
    let f = `[${k}:v]setpts=PTS-STARTPTS,fps=30,format=yuv420p`;
    if (s.zoom) {
      const [z0, z1, cx, cy] = s.zoom, z = `(${z0}+(${z1}-${z0})*min(t/${D[k]},1))`;
      f += `,scale=w='trunc(1920*${z}/2)*2':h='trunc(1080*${z}/2)*2':eval=frame,crop=1920:1080:x='min(max(iw*${cx}-960,0),iw-1920)':y='min(max(ih*${cy}-540,0),ih-1080)'`;
    }
    if (s.blur) f += `,gblur=sigma=${s.blur}`;
    f += `,eq=contrast=1.05:saturation=1.08${s.dim ? `:brightness=${-s.dim * 0.35}` : ""}`;
    vf.push(`${f}[v${k}]`);
  });
  let last = "v0";
  for (let k = 1; k < shots.length; k++) { vf.push(`[${last}][v${k}]xfade=transition=fade:duration=${xf}:offset=${T[k].toFixed(3)}[x${k}]`); last = `x${k}`; }
  vf.push(`[${last}]subtitles=${name}.ass:fontsdir=fonts,fade=t=out:st=${(total - 1.2).toFixed(2)}:d=1.2,trim=0:${total.toFixed(3)}[vout]`);

  // Audio: voice lines, music bed ducked under the voice, NASA's Mars wind.
  let i = shots.length;
  const af = [];
  const vo = voices.map((v) => { args.push("-i", `${OUT}voice/${v.id}.wav`); const ms = Math.round(v.t * 1000); af.push(`[${i}:a]aresample=48000,highpass=f=70,adelay=${ms}|${ms}[vo${i}]`); return `[vo${i++}]`; });
  af.push(`${vo.join("")}amix=inputs=${vo.length}:normalize=0,pan=stereo|c0=c0|c1=c0,volume=1.0,apad,atrim=0:${total.toFixed(3)},asplit=2[voice][key]`);
  // Music: calm until the title, rise through the proof, swell from the orbiters; each mood looped with 3 s crossfades.
  const tTitle = name === "story" ? T[3] + 1.2 : T[2], tSwell = name === "story" ? T[16] : T[7];
  const sec = [["calm", 0, tTitle], ["rise", tTitle, tSwell], ["swell", tSwell, total]];
  const ml = [], hasMusic = sec.every(([m]) => existsSync(`${OUT}music/${m}.wav`));
  for (const [mood, a, b] of hasMusic ? sec : []) {
    const need = b - a + 3, f = `${OUT}music/${mood}.wav`, L = dur(f), copies = Math.max(1, Math.ceil((need - 3) / (L - 3)));
    args.push("-i", f); const src = i++;
    af.push(`[${src}:a]aresample=48000,aformat=channel_layouts=stereo,loudnorm=I=-23:TP=-3,asplit=${copies}${Array.from({ length: copies }, (_, c) => `[m${src}_${c}]`).join("")}`);
    let cur = `m${src}_0`;
    for (let c = 1; c < copies; c++) { af.push(`[${cur}][m${src}_${c}]acrossfade=d=3[mc${src}_${c}]`); cur = `mc${src}_${c}`; }
    af.push(`[${cur}]atrim=0:${need.toFixed(3)},asetpts=PTS-STARTPTS[ms${src}]`);
    ml.push(`ms${src}`);
  }
  const mix = ["[voice]"];
  if (hasMusic) {
    af.push(`[${ml[0]}][${ml[1]}]acrossfade=d=3[mm1]`, `[mm1][${ml[2]}]acrossfade=d=3,atrim=0:${total.toFixed(3)},afade=t=in:d=2.5,afade=t=out:st=${(total - 2.5).toFixed(2)}:d=2.5[bed]`);
    af.push(`[bed][key]sidechaincompress=threshold=0.02:ratio=5:attack=40:release=700:makeup=1[music]`);
    mix.push("[music]");
  } else { console.log("  no music in film/out/music: the film is cut without a bed"); af.push("[key]anullsink"); }
  // Wind: Perseverance SuperCam sol 4 (boosted: it is faint), under the opening and again on the walk.
  if (NASA && existsSync(`${NASA}/scam-mic-sol004-run001.wav`)) {
    args.push("-i", `${NASA}/scam-mic-sol004-run001.wav`); const w = i++;
    const walk = shots.findIndex((s) => s.wind), a0 = shots[0].vo ? 0 : 0, aEnd = T[1] + 2.5;
    af.push(`[${w}:a]aresample=48000,aformat=channel_layouts=stereo,highpass=f=30,lowpass=f=4000,loudnorm=I=-24:TP=-2,asplit=2[w1][w2]`);
    af.push(`[w1]atrim=8:${(8 + aEnd).toFixed(2)},asetpts=PTS-STARTPTS,afade=t=out:st=${(aEnd - 3).toFixed(2)}:d=3,volume=1.6,adelay=${a0}|${a0}[wa]`);
    const wl = D[walk], wt = Math.round(T[walk] * 1000);
    af.push(`[w2]atrim=14:${(14 + wl).toFixed(2)},asetpts=PTS-STARTPTS,afade=t=in:d=1.2,afade=t=out:st=${(wl - 1.5).toFixed(2)}:d=1.5,volume=0.9,adelay=${wt}|${wt}[wb]`);
    mix.push("[wa]", "[wb]");
  }
  af.push(`${mix.join("")}amix=inputs=${mix.length}:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]`);

  writeFileSync(`${OUT}${name}.filter`, [...vf, ...af].join(";\n"));
  args.push("-/filter_complex", `${name}.filter`, "-map", "[vout]", "-map", "[aout]", "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-profile:v", "high", "-c:a", "aac", "-b:a", "192k", "-movflags", "+faststart", "-t", total.toFixed(3), `homeward-${name === "story" ? "story" : "30s"}.mp4`);
  console.log(`${name}: ${shots.length} shots, ${total.toFixed(1)} s`);
  execFileSync(FF, args, { cwd: OUT, stdio: "inherit" });
}

const which = process.argv[2];
if (!which || which === "story") build("story", STORY, 0.6);
if (!which || which === "short") build("short", SHORT, 0.35);
