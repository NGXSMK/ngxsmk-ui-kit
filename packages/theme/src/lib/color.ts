import { ColorScale } from './types';

/** OKLCH color: l in [0,1], c in [0,0.4], h in [0,360). */
export interface Oklch {
  l: number;
  c: number;
  h: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
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
  return { r, g, b };
}

function srgbToLinear(c: number): number {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function linearToSrgb(c: number): number {
  return c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
}

export function hexToOklch(hex: string): Oklch {
  const { r: sr, g: sg, b: sb } = hexToRgb(hex);
  const r = srgbToLinear(sr);
  const g = srgbToLinear(sg);
  const b = srgbToLinear(sb);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  const C = Math.sqrt(a * a + b_ * b_);
  let h = (Math.atan2(b_, a) * 180) / Math.PI;
  if (h < 0) h += 360;

  return { l: L, c: C, h };
}

export function oklchToHex({ l: L, c: C, h }: Oklch): string {
  const hRad = (h * Math.PI) / 180;
  const a = C * Math.cos(hRad);
  const b_ = C * Math.sin(hRad);

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b_;
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b_;
  const s_ = L - 0.0894841775 * a - 1.291485548 * b_;

  const l = l_ * l_ * l_;
  const m = m_ * m_ * m_;
  const s = s_ * s_ * s_;

  const r = +4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186148 * m + 1.707614701 * s;

  const rClamped = Math.min(255, Math.max(0, Math.round(linearToSrgb(r) * 255)));
  const gClamped = Math.min(255, Math.max(0, Math.round(linearToSrgb(g) * 255)));
  const bClamped = Math.min(255, Math.max(0, Math.round(linearToSrgb(b) * 255)));

  const toHex = (v: number) => v.toString(16).padStart(2, '0');
  return `#${toHex(rClamped)}${toHex(gClamped)}${toHex(bClamped)}`.toUpperCase();
}

/** Shift a color's lightness by `delta` (clamped 0–1). */
export function shiftLightness(hex: string, delta: number): string {
  const oklch = hexToOklch(hex);
  return oklchToHex({ ...oklch, l: Math.min(1.0, Math.max(0.0, oklch.l + delta)) });
}

/** Rotate a color's hue by `degrees`, keeping chroma and lightness. */
export function rotateHue(hex: string, degrees: number): string {
  const oklch = hexToOklch(hex);
  return oklchToHex({ ...oklch, h: (((oklch.h + degrees) % 360) + 360) % 360 });
}

/** Lightness stops for each scale step in OKLCH (0–1). */
const LIGHTNESS_STOPS: Record<keyof ColorScale, number> = {
  50: 0.97,
  100: 0.94,
  200: 0.87,
  300: 0.78,
  400: 0.66,
  500: 0.56,
  600: 0.48,
  700: 0.40,
  800: 0.32,
  900: 0.25,
  950: 0.16,
};

/** Derive a full 50–950 color scale from a single brand hex. */
export function deriveScale(baseHex: string): ColorScale {
  const base = hexToOklch(baseHex);

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
    if (key === nearest) {
      scale[key] = oklchToHex(base);
    } else {
      // Perceptually scale chroma using a sine taper so that extremes (50/950) don't clip/saturate unnaturally.
      const scaleChroma = base.c * Math.sin(Math.PI * stop);
      scale[key] = oklchToHex({ l: stop, c: scaleChroma, h: base.h });
    }
  }
  return scale;
}
