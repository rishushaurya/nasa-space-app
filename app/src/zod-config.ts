// Homeward | app/src/zod-config.ts | v2.0.0 | 2026-11-01
// Imported first in main.tsx, before any schema module: zod probes Function("") to decide on its JIT, and the CSP
// (no 'unsafe-eval') turns that probe into a violation report. jitless skips the probe.
import { z } from "zod";

z.config({ jitless: true });
