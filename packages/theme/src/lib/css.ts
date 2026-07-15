import { deriveScale, rotateHue, shiftLightness } from './color';
import { resolveTheme } from './define-config';
import { ColorScale, ResolvedTheme, ThemeConfig, TypeRoleSize, TypeStyle } from './types';
import { CONTROL_HEIGHT } from './tokens';

type Vars = Record<string, string>;

function scaleVars(prefix: string, scale: ColorScale): Vars {
  const vars: Vars = {};
  for (const [step, value] of Object.entries(scale)) {
    vars[`--ngxsmk-color-${prefix}-${step}`] = value;
  }
  return vars;
}

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

    // Component-specific Tokens (Buttons)
    '--ngxsmk-button-bg': 'var(--ngxsmk-color-primary)',
    '--ngxsmk-button-color': 'var(--ngxsmk-color-on-primary)',
    '--ngxsmk-button-font-family': 'var(--ngxsmk-font-sans)',
    '--ngxsmk-button-font-weight': '500',
    '--ngxsmk-button-radius': 'var(--ngxsmk-radius-base)',
    '--ngxsmk-button-disabled-opacity': '0.5',

    // Component-specific Tokens (Cards)
    '--ngxsmk-card-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-card-radius': 'var(--ngxsmk-radius-xl)',
    '--ngxsmk-card-shadow': 'var(--ngxsmk-shadow-sm)',
    '--ngxsmk-card-border-color': 'var(--ngxsmk-color-outline)',

    // Component-specific Tokens (Accordion)
    '--ngxsmk-accordion-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-accordion-radius': 'var(--ngxsmk-radius-lg)',
    '--ngxsmk-accordion-border-color': 'var(--ngxsmk-color-outline)',

    // Component-specific Tokens (Progress)
    '--ngxsmk-progress-height': '0.5rem',
    '--ngxsmk-progress-bg': 'var(--ngxsmk-color-surface-variant)',
    '--ngxsmk-progress-color': 'var(--ngxsmk-color-primary)',
    '--ngxsmk-progress-radius': 'var(--ngxsmk-radius-full)',

    // Component-specific Tokens (Switch)
    '--ngxsmk-switch-width': '2.25rem',
    '--ngxsmk-switch-height': '1.25rem',
    '--ngxsmk-switch-radius': 'var(--ngxsmk-radius-full)',
    '--ngxsmk-switch-bg': 'var(--ngxsmk-color-outline-strong)',
    '--ngxsmk-switch-thumb-size': '0.875rem',
    '--ngxsmk-switch-thumb-bg': 'var(--ngxsmk-color-surface)',
    '--ngxsmk-switch-checked-bg': 'var(--ngxsmk-color-primary)',
  };

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

    // Astryx: cool-grey body, white cards floating on top, hairline borders.
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

    // Astryx dark: near-neutral charcoal body, slightly lighter card,
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
  const dark = darkVars(theme);

  let darkBlock: string;
  switch (theme.darkMode.strategy) {
    case 'media':
      darkBlock = `@media (prefers-color-scheme: dark) {\n${block(':root', dark, '  ')}\n}`;
      break;
    case 'system': {
      // `light-dark()` support is per-property; the class block still serves
      // as the override hook, so `system` behaves as media + class.
      const cn = theme.darkMode.className;
      darkBlock = [
        `@media (prefers-color-scheme: dark) {\n${block(':root', dark, '  ')}\n}`,
        block(`:root.${cn}, :root.${cn} body, .${cn}`, dark),
      ].join('\n\n');
      break;
    }
    default: {
      // `:root.<class>` (specificity 0,2,0) plus a `body` variant defend the
      // dark tokens against third-party stylesheets that redefine `--ngxsmk-*`
      // on a plain `:root` (0,1,0) — those would otherwise win by source order
      // when injected into <head> after this sheet. The bare `.<class>` keeps
      // scoped (non-root) dark regions working.
      const cn = theme.darkMode.className;
      darkBlock = block(`:root.${cn}, :root.${cn} body, .${cn}`, dark);
    }
  }

  const reducedMotion = `@media (prefers-reduced-motion: reduce) {\n  :root {\n    --ngxsmk-motion-duration: 0ms;\n  }\n}`;
  return `/* Generated by @ngxsmk/theme — do not edit by hand. */\n${root}\n\n${darkBlock}\n\n${reducedMotion}\n`;
}
