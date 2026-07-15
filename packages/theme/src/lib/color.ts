import { ColorScale } from './types';

/** HSL triple: h in [0,360), s and l in [0,100]. */
export interface Hsl {
  h: number;
  s: number;
  l: number;
}

export function hexToHsl(hex: string): Hsl {
  const value = hex.replace('#', '');
  const full =
    value.length === 3
      ? value
          .split('')
          .map((c) => c + c)
          .join('')
      : value;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) {
    throw new Error(`Invalid hex color: "${hex}"`);
  }

  const r = parseInt(full.slice(0, 2), 16) / 255;
  const g = parseInt(full.slice(2, 4), 16) / 255;
  const b = parseInt(full.slice(4, 6), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case r:
        h = 60 * (((g - b) / delta) % 6);
        break;
      case g:
        h = 60 * ((b - r) / delta + 2);
        break;
      default:
        h = 60 * ((r - g) / delta + 4);
    }
  }
  if (h < 0) h += 360;

  return { h, s: s * 100, l: l * 100 };
}

export function hslToHex({ h, s, l }: Hsl): string {
  const sn = s / 100;
  const ln = l / 100;
  const c = (1 - Math.abs(2 * ln - 1)) * sn;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = ln - c / 2;

  let rgb: [number, number, number];
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];

  const toHex = (v: number) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(rgb[0])}${toHex(rgb[1])}${toHex(rgb[2])}`.toUpperCase();
}

/** Shift a color's lightness by `delta` percentage points (clamped 0–100). */
export function shiftLightness(hex: string, delta: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, l: Math.min(100, Math.max(0, hsl.l + delta)) });
}

/** Rotate a color's hue by `degrees`, keeping saturation and lightness. */
export function rotateHue(hex: string, degrees: number): string {
  const hsl = hexToHsl(hex);
  return hslToHex({ ...hsl, h: (((hsl.h + degrees) % 360) + 360) % 360 });
}

/**
 * Lightness stops for each scale step. Tuned so that step 500/600 stays close
 * to typical brand-color lightness and the extremes remain usable as tinted
 * backgrounds (50–100) and readable text (900–950).
 */
const LIGHTNESS_STOPS: Record<keyof ColorScale, number> = {
  50: 97,
  100: 94,
  200: 87,
  300: 78,
  400: 66,
  500: 56,
  600: 48,
  700: 40,
  800: 32,
  900: 25,
  950: 16,
};

/**
 * Derive a full 50–950 color scale from a single brand hex.
 *
 * The input color keeps its exact value at the step whose lightness stop is
 * nearest to the input's own lightness, so `scale[step]` round-trips brand
 * colors instead of shifting them.
 */
export function deriveScale(baseHex: string): ColorScale {
  const base = hexToHsl(baseHex);

  let nearest: keyof ColorScale = 500;
  let nearestDelta = Number.POSITIVE_INFINITY;
  for (const [step, stop] of Object.entries(LIGHTNESS_STOPS)) {
    const delta = Math.abs(stop - base.l);
    if (delta < nearestDelta) {
      nearestDelta = delta;
      nearest = Number(step) as keyof ColorScale;
    }
  }

  const scale = {} as ColorScale;
  for (const [step, stop] of Object.entries(LIGHTNESS_STOPS)) {
    const key = Number(step) as keyof ColorScale;
    scale[key] = key === nearest ? hslToHex(base) : hslToHex({ h: base.h, s: base.s, l: stop });
  }
  return scale;
}
