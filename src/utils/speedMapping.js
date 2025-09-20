// Speed mapping utility for algorithm playback.
// SPEED_LEVELS represent multipliers relative to original 1x baseline delay.
// We will convert a chosen multiplier to a per-step delay (ms).
// Assumption: baseline 1x ~= 600ms previous mapping (600 - speed*6). We'll instead set a
// base delay of 220ms for 1x to keep things snappy yet visible, scaling inversely.
// Feel free to tweak BASE_DELAY for UX.

export const SPEED_LEVELS = [1, 3, 5, 8, 12, 15, 20];
export const DEFAULT_SPEED = 5; // 5x default as requested

const BASE_DELAY = 220; // ms at 1x

export function computeDelay(multiplier) {
  // Inverse relationship: higher multiplier -> lower delay.
  if (!multiplier || multiplier <= 0) return BASE_DELAY;
  // We'll clamp to the highest defined level ratio for stability.
  const max = SPEED_LEVELS[SPEED_LEVELS.length - 1];
  const clamped = Math.min(multiplier, max);
  // Simple inverse: BASE_DELAY / (clamped / 1)
  // Ensure a minimum floor so extremely high multipliers still render.
  const raw = BASE_DELAY / clamped;
  return Math.max(10, Math.round(raw));
}
