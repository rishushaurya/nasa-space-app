// Homeward | app/src/core/dose.ts | v1.0.0 | 2026-10-29
// Galactic cosmic ray dose equivalent at Gale: 0.64 mSv/day (RAD-01, Hassler et al. 2014); cruise 1.84 mSv/day (RAD-02).
export const SURFACE_MSV_PER_DAY = 0.64;
export const CRUISE_MSV_PER_DAY = 1.84;
export const gcrDoseMSv = (hours: number, ratePerDay = SURFACE_MSV_PER_DAY) => (hours / 24) * ratePerDay;
export const missionDoseMSv = (outDays: number, surfaceDays: number, backDays: number) =>
  (outDays + backDays) * CRUISE_MSV_PER_DAY + surfaceDays * SURFACE_MSV_PER_DAY;
