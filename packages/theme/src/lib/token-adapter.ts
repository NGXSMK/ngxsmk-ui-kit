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
}

/**
 * Maps NGXSMK semantic color roles to Ionic's color variable namespace.
 *
 * Ionic expects:
 *   --ion-color-primary, --ion-color-primary-rgb, --ion-color-primary-shade,
 *   --ion-color-primary-tint, --ion-color-secondary, etc.
 *
 * This adapter produces the subset Ionic needs for theming.
 */
export const ionicVarsAdapter: TokenOutputAdapter = {
  name: 'ionic',

  vars(theme: ResolvedTheme): Record<string, string> {
    const vars: Record<string, string> = {};

    // Primary
    vars['--ion-color-primary'] = theme.brandBase;
    vars['--ion-color-primary-rgb'] = hexToRgbStr(theme.brandBase);
    vars['--ion-color-primary-shade'] = shiftLightnessHex(theme.brandBase, -14);
    vars['--ion-color-primary-tint'] = shiftLightnessHex(theme.brandBase, 8);

    // Secondary
    vars['--ion-color-secondary'] = theme.secondaryBase;
    vars['--ion-color-secondary-rgb'] = hexToRgbStr(theme.secondaryBase);
    vars['--ion-color-secondary-shade'] = shiftLightnessHex(theme.secondaryBase, -14);
    vars['--ion-color-secondary-tint'] = shiftLightnessHex(theme.secondaryBase, 8);

    // Tertiary (derived from brand hue + 64)
    const tertiary = deriveScale(rotateHue(theme.brandBase, 64));
    vars['--ion-color-tertiary'] = tertiary[500];
    vars['--ion-color-tertiary-rgb'] = hexToRgbStr(tertiary[500]);
    vars['--ion-color-tertiary-shade'] = tertiary[600];
    vars['--ion-color-tertiary-tint'] = tertiary[400];

    // Semantic status colors
    for (const [name, hex] of Object.entries(theme.semantic)) {
      vars[`--ion-color-${name}`] = hex;
      vars[`--ion-color-${name}-rgb`] = hexToRgbStr(hex);
    }

    // Background / surface
    vars['--ion-background-color'] = theme.neutral[50];
    vars['--ion-background-color-rgb'] = hexToRgbStr(theme.neutral[50]);
    vars['--ion-text-color'] = '#0A1317';
    vars['--ion-text-color-rgb'] = '10, 19, 23';

    // Typography
    vars['--ion-font-family'] = theme.fontFamily.sans;

    // Border radius (Ionic uses --ion-border-radius)
    vars['--ion-border-radius'] = theme.radius[theme.radiusBase];

    return vars;
  },
};

/** Default NGXSMK adapter — emits `--ngxsmk-*` variables. */
export const cssVarsAdapter: TokenOutputAdapter = {
  name: 'ngxsmk',
  vars: () => ({}), // Not used directly — buildThemeCss handles this
};

// ─── Helpers ──────────────────────────────────────────────

function hexToRgbStr(hex: string): string {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `${r}, ${g}, ${b}`;
}

function shiftLightnessHex(hex: string, amount: number): string {
  // Simple hex lightness shift — import from color.ts would be circular
  const h = hex.replace('#', '');
  let r = parseInt(h.substring(0, 2), 16);
  let g = parseInt(h.substring(2, 4), 16);
  let b = parseInt(h.substring(4, 6), 16);

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

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}
