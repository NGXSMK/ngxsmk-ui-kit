import { deriveScale, rotateHue, shiftLightness } from './color';
import { resolveTheme } from './define-config';
import { ColorScale, ResolvedTheme, ThemeConfig, TypeRoleSize, TypeStyle } from './types';
import {
  CONTROL_HEIGHT,
  CONTROL_HEIGHTS,
  FONT_WEIGHT,
  ICON_SIZE,
  LEADING,
  OPACITY,
  TRACKING,
} from './tokens';

type Vars = Record<string, string>;

function scaleVars(prefix: string, scale: ColorScale): Vars {
  const vars: Vars = {};
  for (const [step, value] of Object.entries(scale)) {
    vars[`--ngxsmk-color-${prefix}-${step}`] = value;
  }
  return vars;
}

/** Default CSS custom properties for each component, emitted once in :root. */
const COMPONENT_TOKEN_DEFAULTS: Record<string, Vars> = {
  button: {
    '--ngxsmk-button-bg': 'var(--ngxsmk-color-primary)',
    '--ngxsmk-button-color': 'var(--ngxsmk-color-on-primary)',
    '--ngxsmk-button-font-family': 'var(--ngxsmk-font-sans)',
    '--ngxsmk-button-font-weight': '500',
    '--ngxsmk-button-radius': 'var(--ngxsmk-radius-base)',
    '--ngxsmk-button-disabled-opacity': '0.5',
  },
  card: {
    '--ngxsmk-card-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-card-radius': 'var(--ngxsmk-radius-xl)',
    '--ngxsmk-card-shadow': 'var(--ngxsmk-shadow-sm)',
    '--ngxsmk-card-border-color': 'var(--ngxsmk-color-outline)',
  },
  accordion: {
    '--ngxsmk-accordion-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-accordion-radius': 'var(--ngxsmk-radius-lg)',
    '--ngxsmk-accordion-border-color': 'var(--ngxsmk-color-outline)',
  },
  progress: {
    '--ngxsmk-progress-height': '0.5rem',
    '--ngxsmk-progress-bg': 'var(--ngxsmk-color-surface-variant)',
    '--ngxsmk-progress-color': 'var(--ngxsmk-color-primary)',
    '--ngxsmk-progress-radius': 'var(--ngxsmk-radius-full)',
  },
  switch: {
    '--ngxsmk-switch-width': '2.25rem',
    '--ngxsmk-switch-height': '1.25rem',
    '--ngxsmk-switch-radius': 'var(--ngxsmk-radius-full)',
    '--ngxsmk-switch-bg': 'var(--ngxsmk-color-outline-strong)',
    '--ngxsmk-switch-thumb-size': '0.875rem',
    '--ngxsmk-switch-thumb-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-switch-checked-bg': 'var(--ngxsmk-color-primary)',
  },
  spreadsheet: {
    '--ngxsmk-spreadsheet-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-spreadsheet-header-bg': 'var(--ngxsmk-color-surface-variant)',
    '--ngxsmk-spreadsheet-header-color': 'var(--ngxsmk-color-on-surface-variant)',
    '--ngxsmk-spreadsheet-border': 'var(--ngxsmk-color-outline)',
    '--ngxsmk-spreadsheet-grid-color': 'var(--ngxsmk-color-outline-variant)',
    '--ngxsmk-spreadsheet-hover-bg': 'var(--ngxsmk-color-surface-hover)',
    '--ngxsmk-spreadsheet-selected-bg':
      'color-mix(in srgb, var(--ngxsmk-color-primary) 12%, transparent)',
    '--ngxsmk-spreadsheet-active-border': 'var(--ngxsmk-color-primary)',
    '--ngxsmk-spreadsheet-font': 'var(--ngxsmk-font-sans)',
    '--ngxsmk-spreadsheet-font-mono': 'var(--ngxsmk-font-mono)',
    '--ngxsmk-spreadsheet-row-height': '2.25rem',
    '--ngxsmk-spreadsheet-header-height': '2.5rem',
    '--ngxsmk-spreadsheet-cell-padding': '6px 10px',
    '--ngxsmk-spreadsheet-cell-font-size': 'var(--ngxsmk-text-body-sm-size)',
    '--ngxsmk-spreadsheet-scrollbar-size': '8px',
    '--ngxsmk-spreadsheet-shadow': 'var(--ngxsmk-shadow-sm)',
    '--ngxsmk-spreadsheet-radius': 'var(--ngxsmk-radius-lg)',
    '--ngxsmk-spreadsheet-edit-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-spreadsheet-edit-border': 'var(--ngxsmk-color-primary)',
    '--ngxsmk-spreadsheet-row-hover-bg': 'var(--ngxsmk-color-surface-hover)',
    '--ngxsmk-spreadsheet-col-hover-bg':
      'color-mix(in srgb, var(--ngxsmk-color-primary) 6%, transparent)',
    '--ngxsmk-spreadsheet-frozen-shadow': '2px 0 4px rgba(0,0,0,0.08)',
    '--ngxsmk-spreadsheet-selection-range':
      'color-mix(in srgb, var(--ngxsmk-color-primary) 8%, transparent)',
  },
  inputGroup: {
    '--ngxsmk-input-group-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-input-group-border': 'var(--ngxsmk-color-outline-strong)',
    '--ngxsmk-input-group-radius': 'var(--ngxsmk-radius-md)',
    '--ngxsmk-input-group-shadow': 'none',
    '--ngxsmk-input-group-focus-border': 'var(--ngxsmk-color-primary)',
    '--ngxsmk-input-group-focus-shadow':
      '0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-primary) 15%, transparent)',
    '--ngxsmk-input-group-error-border': 'var(--ngxsmk-color-error)',
    '--ngxsmk-input-group-error-focus-shadow':
      '0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-error) 15%, transparent)',
    '--ngxsmk-input-group-success-border': 'var(--ngxsmk-color-success)',
    '--ngxsmk-input-group-warning-border': 'var(--ngxsmk-color-warning)',
    '--ngxsmk-input-group-height': '2.5rem',
    '--ngxsmk-input-group-padding': '0.75rem',
    '--ngxsmk-input-group-gap': 'var(--ngxsmk-space-2)',
    '--ngxsmk-input-group-font': 'var(--ngxsmk-font-sans)',
  },
};

/** Tokens that do not change between light and dark mode. */
function staticVars(theme: ResolvedTheme): Vars {
  const vars: Vars = {
    ...scaleVars('brand', theme.brand),
    ...scaleVars('secondary', theme.secondary),
    ...scaleVars('neutral', theme.neutral),
    '--ngxsmk-font-sans': theme.fontFamily.sans,
    '--ngxsmk-font-mono': theme.fontFamily.mono,
    '--ngxsmk-radius-base': theme.radius[theme.radiusBase],
    '--ngxsmk-control-height': CONTROL_HEIGHT,

    // Motion Tokens
    '--ngxsmk-motion-duration': 'var(--ngxsmk-duration-normal)',
    '--ngxsmk-motion-ease': 'var(--ngxsmk-ease-in-out)',

    // Interactive-state motion: shared lift/press transforms. Neutralized to
    // `none` under prefers-reduced-motion (see buildThemeCss).
    '--ngxsmk-hover-lift': 'translateY(-1px)',
    '--ngxsmk-press-scale': 'scale(0.98)',

    // Safe-area insets: the display cutouts, notches, and home indicators a
    // browser reports via env(). Zero on desktop and on any browser that does
    // not report them, so edge-anchored components can add them
    // unconditionally. Ionic publishes the same numbers as --ion-safe-area-*;
    // the Ionic adapter re-points these tokens at those so a single set of
    // values drives both token systems.
    '--ngxsmk-safe-area-top': 'env(safe-area-inset-top, 0px)',
    '--ngxsmk-safe-area-right': 'env(safe-area-inset-right, 0px)',
    '--ngxsmk-safe-area-bottom': 'env(safe-area-inset-bottom, 0px)',
    '--ngxsmk-safe-area-left': 'env(safe-area-inset-left, 0px)',

    // Focus ring: THE focus indicator for every component. Aliases the
    // mode-aware --ngxsmk-shadow-focus; the error variant derives from the
    // semantic error role so invalid controls ring red in both modes.
    '--ngxsmk-focus-ring': 'var(--ngxsmk-shadow-focus)',
    '--ngxsmk-focus-ring-error':
      '0 0 0 2px color-mix(in srgb, var(--ngxsmk-color-error) 15%, transparent), ' +
      '0 0 0 4px color-mix(in srgb, var(--ngxsmk-color-error) 45%, transparent)',

    // Component-specific token defaults
    ...Object.values(COMPONENT_TOKEN_DEFAULTS).reduce(
      (merged, tokens) => ({ ...merged, ...tokens }),
      {} as Vars,
    ),
  };

  for (const [key, value] of Object.entries(CONTROL_HEIGHTS)) {
    vars[`--ngxsmk-control-height-${key}`] = value;
  }
  for (const [key, value] of Object.entries(OPACITY)) {
    vars[`--ngxsmk-opacity-${key}`] = value;
  }
  for (const [key, value] of Object.entries(ICON_SIZE)) {
    vars[`--ngxsmk-icon-${key}`] = value;
  }
  for (const [key, value] of Object.entries(TRACKING)) {
    vars[`--ngxsmk-tracking-${key}`] = value;
  }
  for (const [key, value] of Object.entries(FONT_WEIGHT)) {
    vars[`--ngxsmk-font-weight-${key}`] = value;
  }
  for (const [key, value] of Object.entries(LEADING)) {
    vars[`--ngxsmk-leading-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.spacing)) {
    vars[`--ngxsmk-space-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.radius)) {
    vars[`--ngxsmk-radius-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.shadow)) {
    vars[`--ngxsmk-shadow-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.duration)) {
    vars[`--ngxsmk-duration-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.easing)) {
    vars[`--ngxsmk-ease-${key}`] = value;
  }
  for (const [key, value] of Object.entries(theme.zIndex)) {
    vars[`--ngxsmk-z-${key}`] = value;
  }

  const sizes = { large: 'lg', medium: 'md', small: 'sm' } as const;
  for (const [role, styles] of Object.entries(theme.typography)) {
    for (const [size, suffix] of Object.entries(sizes)) {
      const style: TypeStyle = styles[size as TypeRoleSize];
      vars[`--ngxsmk-text-${role}-${suffix}-size`] = style.size;
      vars[`--ngxsmk-text-${role}-${suffix}-line`] = style.lineHeight;
      vars[`--ngxsmk-text-${role}-${suffix}-weight`] = style.weight;
    }
  }

  // Extra-small body text for dense metadata rows; below the smallest
  // TypeRoleSize so it is emitted outside the role loop.
  vars['--ngxsmk-text-body-xs-size'] = '0.6875rem';
  vars['--ngxsmk-text-body-xs-line'] = '1rem';
  vars['--ngxsmk-text-body-xs-weight'] = '400';

  return vars;
}

/** Semantic role tokens for light mode. */
function lightVars(theme: ResolvedTheme): Vars {
  const vars: Vars = {
    'color-scheme': 'light',

    '--ngxsmk-color-primary': theme.brandBase,
    '--ngxsmk-color-on-primary': '#FFFFFF',
    '--ngxsmk-color-primary-hover': shiftLightness(theme.brandBase, -8),
    '--ngxsmk-color-primary-active': shiftLightness(theme.brandBase, -14),
    '--ngxsmk-color-primary-container': theme.brand[100],
    '--ngxsmk-color-on-primary-container': theme.brand[900],

    '--ngxsmk-color-secondary': theme.secondaryBase,
    '--ngxsmk-color-on-secondary': '#FFFFFF',
    '--ngxsmk-color-secondary-hover': shiftLightness(theme.secondaryBase, -8),
    '--ngxsmk-color-secondary-active': shiftLightness(theme.secondaryBase, -14),
    '--ngxsmk-color-secondary-container': theme.secondary[100],
    '--ngxsmk-color-on-secondary-container': theme.secondary[900],

    // Default light theme: cool-grey body, white cards floating on top, hairline borders.
    '--ngxsmk-color-background': theme.neutral[50],
    '--ngxsmk-color-on-background': '#0A1317',
    '--ngxsmk-color-surface': '#FFFFFF',
    '--ngxsmk-color-on-surface': '#0A1317',
    '--ngxsmk-color-surface-variant': theme.neutral[100],
    '--ngxsmk-color-on-surface-variant': theme.neutral[500],
    '--ngxsmk-color-surface-hover': 'rgb(5 54 89 / 0.05)',
    '--ngxsmk-color-surface-active': 'rgb(5 54 89 / 0.1)',
    '--ngxsmk-color-surface-container': '#FFFFFF',
    '--ngxsmk-color-outline': 'rgb(5 54 89 / 0.1)',
    '--ngxsmk-color-outline-strong': theme.neutral[200],
    '--ngxsmk-color-outline-variant': 'rgb(5 54 89 / 0.06)',

    // Elevation ladder
    '--ngxsmk-color-surface-1': '#FFFFFF',
    '--ngxsmk-color-surface-2': theme.neutral[50],
    '--ngxsmk-color-surface-3': theme.neutral[100],
    '--ngxsmk-color-surface-4': theme.neutral[200],
    '--ngxsmk-color-surface-5': theme.neutral[300],

    '--ngxsmk-color-ring': theme.brandBase,
    '--ngxsmk-color-backdrop': 'rgb(1 18 40 / 0.4)',
    '--ngxsmk-shadow-focus': `0 0 0 2px ${theme.brand[100]}, 0 0 0 4px color-mix(in srgb, ${theme.brandBase} 45%, transparent)`,

    // Categorical chart palette — a fixed 8-hue qualitative set (NOT derived
    // from the brand, so adjacent series stay distinguishable across themes),
    // stepped for the light surface. Validated for the light chart surface:
    // CVD worst-adjacent ΔE 24.2, chroma/lightness in-band. Charts read these
    // via getComputedStyle; consumers can override any slot to rebrand series.
    '--ngxsmk-chart-1': '#2A78D6',
    '--ngxsmk-chart-2': '#1BAF7A',
    '--ngxsmk-chart-3': '#EDA100',
    '--ngxsmk-chart-4': '#008300',
    '--ngxsmk-chart-5': '#4A3AA7',
    '--ngxsmk-chart-6': '#E34948',
    '--ngxsmk-chart-7': '#E87BA4',
    '--ngxsmk-chart-8': '#EB6834',
  };

  const tertiary = deriveScale(rotateHue(theme.brandBase, 64));
  vars['--ngxsmk-color-tertiary'] = tertiary[500];
  vars['--ngxsmk-color-on-tertiary'] = '#FFFFFF';
  vars['--ngxsmk-color-tertiary-container'] = tertiary[100];
  vars['--ngxsmk-color-on-tertiary-container'] = tertiary[900];

  for (const [name, hex] of Object.entries(theme.semantic)) {
    const scale = deriveScale(hex);
    vars[`--ngxsmk-color-${name}`] = hex;
    vars[`--ngxsmk-color-on-${name}`] = '#FFFFFF';
    vars[`--ngxsmk-color-${name}-container`] = scale[100];
    vars[`--ngxsmk-color-on-${name}-container`] = scale[800];
  }

  return { ...vars, ...theme.overrides.light };
}

/** Semantic role tokens for dark mode. */
function darkVars(theme: ResolvedTheme): Vars {
  const vars: Vars = {
    'color-scheme': 'dark',

    '--ngxsmk-color-primary': theme.brand[400],
    '--ngxsmk-color-on-primary': '#FFFFFF',
    '--ngxsmk-color-primary-hover': theme.brand[300],
    '--ngxsmk-color-primary-active': theme.brand[200],
    '--ngxsmk-color-primary-container': theme.brand[900],
    '--ngxsmk-color-on-primary-container': theme.brand[100],

    '--ngxsmk-color-secondary': theme.secondary[400],
    '--ngxsmk-color-on-secondary': '#FFFFFF',
    '--ngxsmk-color-secondary-hover': theme.secondary[300],
    '--ngxsmk-color-secondary-active': theme.secondary[200],
    '--ngxsmk-color-secondary-container': theme.secondary[900],
    '--ngxsmk-color-on-secondary-container': theme.secondary[100],

    // Default dark theme: near-neutral charcoal body, slightly lighter card,
    // lighter still for popovers; hairline light-on-dark borders.
    '--ngxsmk-color-background': '#111112',
    '--ngxsmk-color-on-background': '#DFE2E5',
    '--ngxsmk-color-surface': '#1F1F22',
    '--ngxsmk-color-on-surface': '#DFE2E5',
    '--ngxsmk-color-surface-variant': '#28292C',
    '--ngxsmk-color-on-surface-variant': '#AAAFB5',
    '--ngxsmk-color-surface-hover': 'rgb(255 255 255 / 0.05)',
    '--ngxsmk-color-surface-active': 'rgb(255 255 255 / 0.1)',
    '--ngxsmk-color-surface-container': '#28292C',
    '--ngxsmk-color-outline': 'rgb(242 244 246 / 0.1)',
    '--ngxsmk-color-outline-strong': '#494D53',
    '--ngxsmk-color-outline-variant': 'rgb(242 244 246 / 0.06)',

    // Elevation ladder
    '--ngxsmk-color-surface-1': theme.neutral[800],
    '--ngxsmk-color-surface-2': theme.neutral[700],
    '--ngxsmk-color-surface-3': theme.neutral[600],
    '--ngxsmk-color-surface-4': theme.neutral[500],
    '--ngxsmk-color-surface-5': theme.neutral[400],

    '--ngxsmk-color-ring': theme.brand[400],
    '--ngxsmk-color-backdrop': 'rgb(17 17 18 / 0.6)',
    '--ngxsmk-shadow-focus': `0 0 0 2px color-mix(in srgb, ${theme.brand[400]} 25%, transparent), 0 0 0 4px color-mix(in srgb, ${theme.brand[400]} 45%, transparent)`,

    // Categorical chart palette — the same eight hues as light, re-stepped for
    // the dark surface (not a different palette). Validated for the dark chart
    // surface: all slots ≥ 3:1 contrast, CVD worst-adjacent ΔE 10.3 (floor band,
    // relies on the legend/labels charts already render for secondary encoding).
    '--ngxsmk-chart-1': '#3987E5',
    '--ngxsmk-chart-2': '#199E70',
    '--ngxsmk-chart-3': '#C98500',
    '--ngxsmk-chart-4': '#008300',
    '--ngxsmk-chart-5': '#9085E9',
    '--ngxsmk-chart-6': '#E66767',
    '--ngxsmk-chart-7': '#D55181',
    '--ngxsmk-chart-8': '#D95926',
  };

  const tertiary = deriveScale(rotateHue(theme.brandBase, 64));
  vars['--ngxsmk-color-tertiary'] = tertiary[400];
  vars['--ngxsmk-color-on-tertiary'] = tertiary[950];
  vars['--ngxsmk-color-tertiary-container'] = tertiary[900];
  vars['--ngxsmk-color-on-tertiary-container'] = tertiary[100];

  for (const [name, hex] of Object.entries(theme.semantic)) {
    const scale = deriveScale(hex);
    vars[`--ngxsmk-color-${name}`] = scale[400];
    vars[`--ngxsmk-color-on-${name}`] = scale[950];
    vars[`--ngxsmk-color-${name}-container`] = scale[950];
    vars[`--ngxsmk-color-on-${name}-container`] = scale[300];
  }

  return { ...vars, ...theme.overrides.dark };
}

function block(selector: string, vars: Vars, indent = ''): string {
  const lines = Object.entries(vars).map(([name, value]) => `${indent}  ${name}: ${value};`);
  return `${indent}${selector} {\n${lines.join('\n')}\n${indent}}`;
}

/**
 * Emit `vars` under whichever selector or at-rule the theme's dark-mode
 * strategy calls for.
 *
 * Shared with the runtime token adapters (e.g. the Ionic `--ion-*` output) so
 * every token system a consumer enables flips to dark under exactly the same
 * condition — a duplicated strategy switch would drift.
 */
export function emitDarkBlock(theme: ResolvedTheme, vars: Vars): string {
  switch (theme.darkMode.strategy) {
    case 'media':
      return `@media (prefers-color-scheme: dark) {\n${block(':root', vars, '  ')}\n}`;
    case 'system': {
      // `light-dark()` support is per-property; the class block still serves
      // as the override hook, so `system` behaves as media + class.
      const cn = theme.darkMode.className;
      return [
        `@media (prefers-color-scheme: dark) {\n${block(':root', vars, '  ')}\n}`,
        block(`:root.${cn}, :root.${cn} body, .${cn}`, vars),
      ].join('\n\n');
    }
    default: {
      // `:root.<class>` (specificity 0,2,0) plus a `body` variant defend the
      // dark tokens against third-party stylesheets that redefine the same
      // custom properties on a plain `:root` (0,1,0) — those would otherwise
      // win by source order when injected into <head> after this sheet. The
      // bare `.<class>` keeps scoped (non-root) dark regions working.
      const cn = theme.darkMode.className;
      return block(`:root.${cn}, :root.${cn} body, .${cn}`, vars);
    }
  }
}

/**
 * Transform a theme config into a CSS stylesheet of `--ngxsmk-*` custom
 * properties. Emits static tokens plus light-mode roles on `:root`, and
 * dark-mode roles according to the configured dark-mode strategy.
 */
export function buildThemeCss(config: ThemeConfig | ResolvedTheme): string {
  const theme =
    'brand' in config && 'spacing' in (config as object)
      ? (config as ResolvedTheme)
      : resolveTheme(config as ThemeConfig);

  const root = block(':root', { ...staticVars(theme), ...lightVars(theme) });
  const darkBlock = emitDarkBlock(theme, darkVars(theme));

  // Zero every duration token (components animate with --ngxsmk-duration-*
  // directly) and neutralize the shared transforms so ALL token-driven motion
  // stops. `.ngxsmk-reduce-motion` offers the same as an app-level opt-in.
  const reducedVars: Vars = {
    '--ngxsmk-motion-duration': '0ms',
    '--ngxsmk-hover-lift': 'none',
    '--ngxsmk-press-scale': 'none',
  };
  for (const key of Object.keys(theme.duration)) {
    reducedVars[`--ngxsmk-duration-${key}`] = '0ms';
  }
  const reducedMotion = [
    `@media (prefers-reduced-motion: reduce) {\n${block(':root', reducedVars, '  ')}\n}`,
    block(':root.ngxsmk-reduce-motion, .ngxsmk-reduce-motion', reducedVars),
  ].join('\n\n');
  return `/* Generated by @ngxsmk/theme — do not edit by hand. */\n${root}\n\n${darkBlock}\n\n${reducedMotion}\n`;
}
