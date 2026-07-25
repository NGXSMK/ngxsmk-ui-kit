import { ResolvedTheme } from './types';
import { deriveScale, rotateHue } from './color';

/**
 * A token output adapter transforms a `ResolvedTheme` into platform-specific
 * CSS custom properties. The default `cssVarsAdapter` emits `--ngxsmk-*`
 * variables; the `ionicVarsAdapter` emits `--ion-*` variables that Ionic
 * components consume.
 */
export interface TokenOutputAdapter {
  /** Unique name for this adapter (e.g. 'ngxsmk', 'ionic'). */
  readonly name: string;
  /** Transform a resolved theme into platform-specific CSS variables. */
  vars(theme: ResolvedTheme): Record<string, string>;
  /**
   * Optional dark-mode variables, emitted under the theme's configured dark
   * selector (`.dark` class or a `prefers-color-scheme` block). Adapters that
   * only produce mode-independent output can omit this.
   */
  varsDark?(theme: ResolvedTheme): Record<string, string>;
}

/**
 * The nine color roles Ionic ships. Each expands to the six variables Ionic
 * expects: base, `-rgb`, `-contrast`, `-contrast-rgb`, `-shade`, `-tint`.
 *
 * NGXSMK's `error` semantic maps onto Ionic's `danger` role, which is the name
 * Ionic components use (`color="danger"`).
 */
const IONIC_ROLES = [
  'primary',
  'secondary',
  'tertiary',
  'success',
  'warning',
  'danger',
  'medium',
  'light',
  'dark',
] as const;

/** Ionic's step ladder: 50, 100, 150 … 950 (background -> text). */
const STEP_STOPS = Array.from({ length: 19 }, (_, i) => (i + 1) * 50);

/**
 * Maps NGXSMK design tokens onto Ionic's `--ion-*` namespace so Ionic
 * components adopt the same brand, surfaces, and typography as NGXSMK ones.
 *
 * Emits the three groups Ionic actually reads:
 *  - **Color roles** — the six-variable set per role, so `color="primary"`,
 *    `color="danger"`, and friends resolve including their contrast text.
 *  - **Step ladder** — `--ion-color-step-50` … `-950`, interpolated from
 *    background toward text. Ionic derives most borders, muted text, and
 *    pressed states from these; without them a themed app keeps stock greys.
 *  - **Surfaces** — item, toolbar, card, and tab-bar backgrounds plus border
 *    and placeholder colors.
 *
 * Light and dark are generated from the same `ResolvedTheme` and mirror the
 * surface decisions in the NGXSMK light/dark token sets.
 */
export const ionicVarsAdapter: TokenOutputAdapter = {
  name: 'ionic',
  vars: (theme) => ionicVars(theme, 'light'),
  varsDark: (theme) => ionicVars(theme, 'dark'),
};

function ionicVars(theme: ResolvedTheme, mode: 'light' | 'dark'): Record<string, string> {
  const vars: Record<string, string> = {};
  const dark = mode === 'dark';

  // Surfaces mirror lightVars()/darkVars() in css.ts so both token systems
  // describe the same visual surface.
  const background = dark ? '#111112' : theme.neutral[50];
  const text = dark ? '#DFE2E5' : '#0A1317';
  const elevated = dark ? '#1F1F22' : '#FFFFFF';

  const tertiary = deriveScale(rotateHue(theme.brandBase, 64));

  const roleBase: Record<(typeof IONIC_ROLES)[number], string> = {
    primary: dark ? theme.brand[400] : theme.brandBase,
    secondary: dark ? theme.secondary[400] : theme.secondaryBase,
    tertiary: dark ? tertiary[400] : tertiary[500],
    success: roleColor(theme.semantic.success, dark),
    warning: roleColor(theme.semantic.warning, dark),
    danger: roleColor(theme.semantic.error, dark),
    medium: dark ? theme.neutral[400] : theme.neutral[500],
    light: dark ? theme.neutral[800] : theme.neutral[100],
    dark: dark ? theme.neutral[100] : theme.neutral[900],
  };

  for (const role of IONIC_ROLES) {
    const base = roleBase[role];
    const contrast = contrastOn(base);
    vars[`--ion-color-${role}`] = base;
    vars[`--ion-color-${role}-rgb`] = hexToRgbStr(base);
    vars[`--ion-color-${role}-contrast`] = contrast;
    vars[`--ion-color-${role}-contrast-rgb`] = hexToRgbStr(contrast);
    // Ionic's own ratios: shade is 12% toward black, tint 10% toward white.
    vars[`--ion-color-${role}-shade`] = mixHex(base, '#000000', 0.12);
    vars[`--ion-color-${role}-tint`] = mixHex(base, '#FFFFFF', 0.1);
  }

  // NGXSMK's `info` semantic has no Ionic equivalent. Emit it as a custom role
  // so apps that opt in can wire `color="info"` themselves; Ionic ignores it
  // otherwise.
  const info = roleColor(theme.semantic.info, dark);
  vars['--ion-color-info'] = info;
  vars['--ion-color-info-rgb'] = hexToRgbStr(info);
  vars['--ion-color-info-contrast'] = contrastOn(info);
  vars['--ion-color-info-contrast-rgb'] = hexToRgbStr(contrastOn(info));
  vars['--ion-color-info-shade'] = mixHex(info, '#000000', 0.12);
  vars['--ion-color-info-tint'] = mixHex(info, '#FFFFFF', 0.1);

  vars['--ion-background-color'] = background;
  vars['--ion-background-color-rgb'] = hexToRgbStr(background);
  vars['--ion-text-color'] = text;
  vars['--ion-text-color-rgb'] = hexToRgbStr(text);

  // The ladder Ionic interpolates its neutrals from.
  for (const stop of STEP_STOPS) {
    vars[`--ion-color-step-${stop}`] = mixHex(background, text, stop / 1000);
  }

  vars['--ion-item-background'] = elevated;
  vars['--ion-card-background'] = elevated;
  vars['--ion-toolbar-background'] = elevated;
  vars['--ion-tab-bar-background'] = elevated;
  vars['--ion-border-color'] = mixHex(background, text, 0.15);
  vars['--ion-placeholder-color'] = mixHex(background, text, 0.6);

  vars['--ion-font-family'] = theme.fontFamily.sans;

  return vars;
}

/**
 * Dark surfaces need a lighter step of a semantic hue to stay legible, matching
 * how `darkVars()` promotes semantics to their 400 step.
 */
function roleColor(hex: string, dark: boolean): string {
  return dark ? deriveScale(hex)[400] : hex;
}

// ─── Helpers ──────────────────────────────────────────────

function parseHex(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  const full =
    h.length === 3
      ? h
          .split('')
          .map((c) => c + c)
          .join('')
      : h;
  return [
    parseInt(full.substring(0, 2), 16),
    parseInt(full.substring(2, 4), 16),
    parseInt(full.substring(4, 6), 16),
  ];
}

function toHex([r, g, b]: [number, number, number]): string {
  const c = (n: number) =>
    Math.max(0, Math.min(255, Math.round(n)))
      .toString(16)
      .padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}

function hexToRgbStr(hex: string): string {
  return parseHex(hex).join(', ');
}

/** Linear sRGB blend of `amount` (0–1) of `b` into `a` — matches Ionic's Sass `mix()`. */
function mixHex(a: string, b: string, amount: number): string {
  const [ar, ag, ab] = parseHex(a);
  const [br, bg, bb] = parseHex(b);
  return toHex([ar + (br - ar) * amount, ag + (bg - ag) * amount, ab + (bb - ab) * amount]);
}

/** Black or white, whichever reads on `hex` — YIQ, as Ionic's own contrast does. */
function contrastOn(hex: string): string {
  const [r, g, b] = parseHex(hex);
  return (r * 299 + g * 587 + b * 114) / 1000 >= 128 ? '#000000' : '#FFFFFF';
}

/** Default NGXSMK adapter — emits `--ngxsmk-*` variables. */
export const cssVarsAdapter: TokenOutputAdapter = {
  name: 'ngxsmk',
  vars: () => ({}), // Not used directly — buildThemeCss handles this
};
