// Homeward | app/src/assistant/ambient.ts | v1.0.0 | 2026-10-29
// Real Mars wind under the descent and the walk: Perseverance's SuperCam microphone on sol 1 (NASA-SUPERCAM-SOL1),
// looped quietly. The raw recording's level is arbitrary, so the gain is set from its measured RMS (target ASSUMPTION).
const URL_WIND = "/data/audio/supercam-sol001-wind.mp3";
const TARGET_RMS = 0.04, FADE_S = 2;
let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let src: AudioBufferSourceNode | null = null;
let buffer: Promise<{ buf: AudioBuffer; level: number }> | null = null;

function load(c: AudioContext) {
  buffer ??= fetch(URL_WIND).then((r) => r.arrayBuffer()).then((a) => c.decodeAudioData(a)).then((buf) => {
    const d = buf.getChannelData(0);
    let sum = 0;
    for (let i = 0; i < d.length; i++) sum += d[i]! * d[i]!;
    return { buf, level: Math.min(4, TARGET_RMS / Math.max(1e-4, Math.sqrt(sum / d.length))) };
  }).catch((e) => { buffer = null; throw e; });
  return buffer;
}

/** Fade the wind in or out. Failures are silent: the wind is atmosphere, never information. */
export async function setAmbient(on: boolean) {
  if (!on) {
    if (ctx && gain) { gain.gain.cancelScheduledValues(ctx.currentTime); gain.gain.setTargetAtTime(0, ctx.currentTime, FADE_S / 3); }
    return;
  }
  try {
    ctx ??= new AudioContext();
    if (ctx.state === "suspended") await ctx.resume();
    const { buf, level } = await load(ctx);
    if (!gain) { gain = ctx.createGain(); gain.gain.value = 0; gain.connect(ctx.destination); }
    if (!src) { src = ctx.createBufferSource(); src.buffer = buf; src.loop = true; src.connect(gain); src.start(); }
    gain.gain.cancelScheduledValues(ctx.currentTime);
    gain.gain.setTargetAtTime(level, ctx.currentTime, FADE_S / 3);
  } catch { /* no audio device or decode failure */ }
}
