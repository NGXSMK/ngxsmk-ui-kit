export interface RGBA {
  r: number;
  g: number;
  b: number;
  a: number;
}

export function parseColor(input: string): RGBA {
  const s = (input || '').trim();
  if (s.startsWith('#')) {
    let hex = s.slice(1);
    if (hex.length === 3)
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    const num = parseInt(hex, 16);
    if (Number.isNaN(num)) return { r: 148, g: 163, b: 184, a: 1 };
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255, a: 1 };
  }
  const m = s.match(/rgba?\(([^)]+)\)/i);
  if (m) {
    const parts = m[1].split(',').map((p) => parseFloat(p));
    return { r: parts[0] || 0, g: parts[1] || 0, b: parts[2] || 0, a: parts[3] ?? 1 };
  }
  return { r: 148, g: 163, b: 184, a: 1 };
}

export function rgba(c: RGBA, a?: number): string {
  return `rgba(${Math.round(c.r)},${Math.round(c.g)},${Math.round(c.b)},${a ?? c.a})`;
}

export function mix(a: RGBA, b: RGBA, t: number): RGBA {
  return {
    r: a.r + (b.r - a.r) * t,
    g: a.g + (b.g - a.g) * t,
    b: a.b + (b.b - a.b) * t,
    a: 1,
  };
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutBack(t: number): number {
  const c1 = 1.70158;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
}

export function clamp(v: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, v));
}

export function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min];
  const range = max - min;
  const rawStep = range / count;
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)));
  const norm = rawStep / mag;
  let step: number;
  if (norm < 1.5) step = 1;
  else if (norm < 3) step = 2;
  else if (norm < 7) step = 5;
  else step = 10;
  step *= mag;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step * 1e-6; v += step) {
    ticks.push(Math.round(v * 1e6) / 1e6);
  }
  return ticks;
}

export interface ChartTheme {
  font: string;
  primary: RGBA;
  secondary: RGBA;
  tertiary: RGBA;
  error: RGBA;
  warning: RGBA;
  success: RGBA;
  info: RGBA;
  surface: RGBA;
  surfaceVariant: RGBA;
  surfaceHover: RGBA;
  onSurface: RGBA;
  onSurfaceVariant: RGBA;
  outline: RGBA;
  outlineStrong: RGBA;
  palette: RGBA[];
}

export function resolveTheme(host: HTMLElement): ChartTheme {
  const cs = getComputedStyle(host);
  const v = (name: string, fallback: string) => cs.getPropertyValue(name).trim() || fallback;
  const toRGBA = (name: string, fallback: string) => parseColor(v(name, fallback));
  // Categorical series palette — a dedicated qualitative set (--ngxsmk-chart-*),
  // decoupled from the semantic roles so series 4+ no longer inherit the
  // error/warning/success meanings. Fallbacks are the validated light-mode
  // steps; the theme CSS re-steps them for dark mode, read here at render time.
  const palette = [
    toRGBA('--ngxsmk-chart-1', '#2A78D6'),
    toRGBA('--ngxsmk-chart-2', '#1BAF7A'),
    toRGBA('--ngxsmk-chart-3', '#EDA100'),
    toRGBA('--ngxsmk-chart-4', '#008300'),
    toRGBA('--ngxsmk-chart-5', '#4A3AA7'),
    toRGBA('--ngxsmk-chart-6', '#E34948'),
    toRGBA('--ngxsmk-chart-7', '#E87BA4'),
    toRGBA('--ngxsmk-chart-8', '#EB6834'),
  ];
  return {
    font: v('--ngxsmk-font-sans', 'system-ui, sans-serif'),
    primary: toRGBA('--ngxsmk-color-primary', '#059669'),
    secondary: toRGBA('--ngxsmk-color-secondary', '#0ea5e9'),
    tertiary: toRGBA('--ngxsmk-color-tertiary', '#8b5cf6'),
    error: toRGBA('--ngxsmk-color-error', '#ef4444'),
    warning: toRGBA('--ngxsmk-color-warning', '#f59e0b'),
    success: toRGBA('--ngxsmk-color-success', '#22c55e'),
    info: toRGBA('--ngxsmk-color-info', '#06b6d4'),
    surface: toRGBA('--ngxsmk-color-surface', '#ffffff'),
    surfaceVariant: toRGBA('--ngxsmk-color-surface-variant', '#94a3b8'),
    surfaceHover: toRGBA('--ngxsmk-color-surface-hover', '#f1f5f9'),
    onSurface: toRGBA('--ngxsmk-color-on-surface', '#0a1317'),
    onSurfaceVariant: toRGBA('--ngxsmk-color-on-surface-variant', '#4e606f'),
    outline: toRGBA('--ngxsmk-color-outline', '#e4e4e7'),
    outlineStrong: toRGBA('--ngxsmk-color-outline-strong', '#ccd3db'),
    palette,
  };
}

export interface ChartHover {
  title?: string;
  lines: string[];
  color?: string;
}

export const SHARED_CHART_STYLES = `
  :host {
    display: inline-block;
    position: relative;
    font-family: var(--ngxsmk-font-sans, system-ui), sans-serif;
  }
  .ngxsmk-chart-surface {
    position: relative;
    display: inline-block;
    line-height: 0;
  }
  .ngxsmk-chart-surface canvas {
    display: block;
  }
  .ngxsmk-chart-tip {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 5;
    min-width: 64px;
    padding: 6px 9px;
    border-radius: var(--ngxsmk-radius-base, 0.5rem);
    background: var(--ngxsmk-color-surface, #ffffff);
    color: var(--ngxsmk-color-on-surface, #0a1317);
    border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    box-shadow: var(--ngxsmk-shadow-lg, 0 6px 20px rgba(15, 23, 42, 0.18));
    font-family: var(--ngxsmk-font-sans, system-ui), sans-serif;
    font-size: var(--ngxsmk-text-body-xs-size);
    line-height: 1.45;
    pointer-events: none;
    opacity: 0;
    transform: translate(-9999px, -9999px);
    transition: opacity var(--ngxsmk-duration-fast, 0.12s) var(--ngxsmk-ease-out, ease);
    white-space: nowrap;
  }
  .ngxsmk-chart-tip__title {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: var(--ngxsmk-font-weight-semibold, 600);
    margin-bottom: 2px;
  }
  .ngxsmk-chart-tip__dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: 0 0 auto;
  }
  .ngxsmk-chart-tip__line {
    opacity: 0.85;
  }
  @media (prefers-reduced-motion: reduce) {
    .ngxsmk-chart-tip {
      transition: none;
    }
  }
`;
