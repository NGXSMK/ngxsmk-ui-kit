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
  vars(theme: ResolvedTheme, options?: { isDark?: boolean }): Record<string, string>;
  /** Transform a resolved theme into dark-mode platform CSS variables. */
  darkVars?(theme: ResolvedTheme): Record<string, string>;
}

/**
 * Maps NGXSMK semantic color roles to Ionic 7 & 8 color variable specifications.
 *
 * Emits full color suites (base, rgb, contrast, contrast-rgb, shade, tint),
 * 19-step contrast ladder (--ion-color-step-50..950), safe area mappings, and
 * surface variables for seamless Ionic framework interoperability.
 */
export const ionicVarsAdapter: TokenOutputAdapter = {
  name: 'ionic',

  vars(theme: ResolvedTheme, options?: { isDark?: boolean }): Record<string, string> {
    if (options?.isDark) {
      return this.darkVars ? this.darkVars(theme) : buildLightVars(theme);
    }
    return buildLightVars(theme);
  },

  darkVars(theme: ResolvedTheme): Record<string, string> {
    return buildDarkVars(theme);
  },
};

function buildColorSuite(prefix: string, baseHex: string, vars: Record<string, string>): void {
  const contrastHex = getContrastHex(baseHex);
  vars[`--ion-color-${prefix}`] = baseHex;
  vars[`--ion-color-${prefix}-rgb`] = hexToRgbStr(baseHex);
  vars[`--ion-color-${prefix}-contrast`] = contrastHex;
  vars[`--ion-color-${prefix}-contrast-rgb`] = hexToRgbStr(contrastHex);
  vars[`--ion-color-${prefix}-shade`] = shiftLightnessHex(baseHex, -12);
  vars[`--ion-color-${prefix}-tint`] = shiftLightnessHex(baseHex, 10);
}

function buildLightVars(theme: ResolvedTheme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Primary & Secondary
  buildColorSuite('primary', theme.brandBase, vars);
  buildColorSuite('secondary', theme.secondaryBase, vars);

  // Tertiary (derived from brand hue + 64)
  const tertiary = deriveScale(rotateHue(theme.brandBase, 64));
  buildColorSuite('tertiary', tertiary[500], vars);

  // Status & Feedback colors
  const successHex = theme.semantic['success'] ?? '#0D8626';
  const warningHex = theme.semantic['warning'] ?? '#E9AF08';
  const dangerHex = theme.semantic['error'] ?? '#E3193B';
  const infoHex = theme.semantic['info'] ?? '#2563EB';

  buildColorSuite('success', successHex, vars);
  buildColorSuite('warning', warningHex, vars);
  buildColorSuite('danger', dangerHex, vars);
  buildColorSuite('info', infoHex, vars);

  // Medium / Light / Dark baseline scales
  buildColorSuite('light', theme.neutral[100] ?? '#F1F4F7', vars);
  buildColorSuite('medium', theme.neutral[500] ?? '#778593', vars);
  buildColorSuite('dark', theme.neutral[900] ?? '#18181A', vars);

  // Background / Surfaces
  const bgHex = theme.neutral[50] ?? '#FFFFFF';
  const textHex = '#0A1317';
  vars['--ion-background-color'] = bgHex;
  vars['--ion-background-color-rgb'] = hexToRgbStr(bgHex);
  vars['--ion-text-color'] = textHex;
  vars['--ion-text-color-rgb'] = hexToRgbStr(textHex);

  vars['--ion-card-background'] = '#FFFFFF';
  vars['--ion-item-background'] = '#FFFFFF';
  vars['--ion-item-color'] = textHex;
  vars['--ion-toolbar-background'] = bgHex;
  vars['--ion-toolbar-color'] = textHex;
  vars['--ion-tab-bar-background'] = '#FFFFFF';
  vars['--ion-border-color'] = theme.neutral[200] ?? '#CCD3DB';

  // Typography & Radius
  vars['--ion-font-family'] = theme.fontFamily.sans;
  vars['--ion-border-radius'] = theme.radius[theme.radiusBase];

  // Stepped colors for light mode (interpolated between bg and text)
  interpolateSteppedColors(bgHex, textHex, vars);

  // Safe area insets
  vars['--ion-safe-area-top'] = 'var(--ngxsmk-safe-area-top, env(safe-area-inset-top, 0px))';
  vars['--ion-safe-area-bottom'] =
    'var(--ngxsmk-safe-area-bottom, env(safe-area-inset-bottom, 0px))';
  vars['--ion-safe-area-left'] = 'var(--ngxsmk-safe-area-left, env(safe-area-inset-left, 0px))';
  vars['--ion-safe-area-right'] = 'var(--ngxsmk-safe-area-right, env(safe-area-inset-right, 0px))';

  return vars;
}

function buildDarkVars(theme: ResolvedTheme): Record<string, string> {
  const vars: Record<string, string> = {};

  // Primary & Secondary dark adjustments
  const primaryDark = theme.brand[400] ?? theme.brandBase;
  const secondaryDark = theme.secondary[400] ?? theme.secondaryBase;

  buildColorSuite('primary', primaryDark, vars);
  buildColorSuite('secondary', secondaryDark, vars);

  // Tertiary
  const tertiary = deriveScale(rotateHue(theme.brandBase, 64));
  buildColorSuite('tertiary', tertiary[400] ?? tertiary[500], vars);

  // Status & Feedback
  buildColorSuite('success', shiftLightnessHex(theme.semantic['success'] ?? '#0D8626', 10), vars);
  buildColorSuite('warning', shiftLightnessHex(theme.semantic['warning'] ?? '#E9AF08', 8), vars);
  buildColorSuite('danger', shiftLightnessHex(theme.semantic['error'] ?? '#E3193B', 10), vars);
  buildColorSuite('info', shiftLightnessHex(theme.semantic['info'] ?? '#2563EB', 10), vars);

  buildColorSuite('light', theme.neutral[800] ?? '#1F1F22', vars);
  buildColorSuite('medium', theme.neutral[400] ?? '#778593', vars);
  buildColorSuite('dark', theme.neutral[100] ?? '#F1F4F7', vars);

  // Dark backgrounds & surfaces
  const darkBgHex = '#111112';
  const darkTextHex = '#DFE2E5';
  const darkSurface = '#1F1F22';

  vars['--ion-background-color'] = darkBgHex;
  vars['--ion-background-color-rgb'] = hexToRgbStr(darkBgHex);
  vars['--ion-text-color'] = darkTextHex;
  vars['--ion-text-color-rgb'] = hexToRgbStr(darkTextHex);

  vars['--ion-card-background'] = darkSurface;
  vars['--ion-item-background'] = darkSurface;
  vars['--ion-item-color'] = darkTextHex;
  vars['--ion-toolbar-background'] = '#18181A';
  vars['--ion-toolbar-color'] = darkTextHex;
  vars['--ion-tab-bar-background'] = '#18181A';
  vars['--ion-border-color'] = 'rgba(242, 244, 246, 0.1)';

  // Typography & Radius
  vars['--ion-font-family'] = theme.fontFamily.sans;
  vars['--ion-border-radius'] = theme.radius[theme.radiusBase];

  // Stepped colors for dark mode
  interpolateSteppedColors(darkBgHex, darkTextHex, vars);

  // Safe area insets
  vars['--ion-safe-area-top'] = 'var(--ngxsmk-safe-area-top, env(safe-area-inset-top, 0px))';
  vars['--ion-safe-area-bottom'] =
    'var(--ngxsmk-safe-area-bottom, env(safe-area-inset-bottom, 0px))';
  vars['--ion-safe-area-left'] = 'var(--ngxsmk-safe-area-left, env(safe-area-inset-left, 0px))';
  vars['--ion-safe-area-right'] = 'var(--ngxsmk-safe-area-right, env(safe-area-inset-right, 0px))';

  return vars;
}

/** Default NGXSMK adapter — emits `--ngxsmk-*` variables. */
export const cssVarsAdapter: TokenOutputAdapter = {
  name: 'ngxsmk',
  vars: () => ({}), // Not used directly — buildThemeCss handles this
};

// ─── Helpers ──────────────────────────────────────────────

function hexToRgbStr(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  return `${r}, ${g}, ${b}`;
}

function getContrastHex(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 0;
  const g = parseInt(clean.substring(2, 4), 16) || 0;
  const b = parseInt(clean.substring(4, 6), 16) || 0;
  // Standard WCAG relative luminance approximation
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 150 ? '#000000' : '#FFFFFF';
}

function shiftLightnessHex(hex: string, amount: number): string {
  const clean = hex.replace('#', '');
  let r = parseInt(clean.substring(0, 2), 16) || 0;
  let g = parseInt(clean.substring(2, 4), 16) || 0;
  let b = parseInt(clean.substring(4, 6), 16) || 0;

  if (amount > 0) {
    r = Math.min(255, r + Math.round((255 - r) * (amount / 100)));
    g = Math.min(255, g + Math.round((255 - g) * (amount / 100)));
    b = Math.min(255, b + Math.round((255 - b) * (amount / 100)));
  } else {
    const factor = 1 + amount / 100;
    r = Math.max(0, Math.round(r * factor));
    g = Math.max(0, Math.round(g * factor));
    b = Math.max(0, Math.round(b * factor));
  }

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
}

function interpolateSteppedColors(
  bgHex: string,
  textHex: string,
  vars: Record<string, string>,
): void {
  const cleanBg = bgHex.replace('#', '');
  const cleanText = textHex.replace('#', '');

  const bgR = parseInt(cleanBg.substring(0, 2), 16) || 0;
  const bgG = parseInt(cleanBg.substring(2, 4), 16) || 0;
  const bgB = parseInt(cleanBg.substring(4, 6), 16) || 0;

  const textR = parseInt(cleanText.substring(0, 2), 16) || 0;
  const textG = parseInt(cleanText.substring(2, 4), 16) || 0;
  const textB = parseInt(cleanText.substring(4, 6), 16) || 0;

  const steps = [
    50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750, 800, 850, 900, 950,
  ];

  for (const step of steps) {
    const weight = step / 1000;
    const r = Math.round(bgR * (1 - weight) + textR * weight);
    const g = Math.round(bgG * (1 - weight) + textG * weight);
    const b = Math.round(bgB * (1 - weight) + textB * weight);
    const hex =
      `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`.toUpperCase();
    vars[`--ion-color-step-${step}`] = hex;
  }
}
