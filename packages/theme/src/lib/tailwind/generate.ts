import { ResolvedTheme } from '../types';
import { deriveScale, rotateHue } from '../color';

/**
 * Generate a Tailwind CSS v3 config object from a `ResolvedTheme`.
 *
 * The output references `var(--ngxsmk-*)` CSS custom properties so it
 * stays in sync with the active theme at runtime (light/dark, presets).
 *
 * ```ts
 * import { generateTailwindPreset } from '@ngxsmk/theme/tailwind';
 * import { resolveTheme } from '@ngxsmk/theme';
 *
 * const preset = generateTailwindPreset(resolveTheme({ brand: { primary: '#7C3AED' } }));
 * // → use in tailwind.config.js: { presets: [preset] }
 * ```
 */
export function generateTailwindPreset(theme: ResolvedTheme): Record<string, unknown> {
  return {
    theme: {
      extend: {
        colors: buildColorMap(theme),
        borderRadius: buildRadiusMap(theme),
        spacing: buildSpacingMap(theme),
        boxShadow: buildShadowMap(theme),
        fontFamily: {
          sans: `var(--ngxsmk-font-sans)`,
          mono: `var(--ngxsmk-font-mono)`,
        },
        fontSize: buildFontSizeMap(theme),
        transitionDuration: buildDurationMap(theme),
        transitionTimingFunction: buildEasingMap(theme),
        zIndex: buildZIndexMap(theme),
      },
    },
    corePlugins: {
      preflight: false,
    },
  };
}

/**
 * Generate a Tailwind CSS v4 `@theme` CSS string from a `ResolvedTheme`.
 *
 * The output is a complete CSS file that can be imported directly:
 * ```css
 * @import "tailwindcss";
 * @import "./ngxsmk-theme.css";
 * ```
 */
export function generateTailwindThemeCss(theme: ResolvedTheme): string {
  const lines: string[] = [
    '@theme {',
    '  /* ── Colors ────────────────────────────────────────────── */',
  ];

  const colorEntries = Object.entries(buildColorMap(theme));
  for (const [key, value] of colorEntries) {
    lines.push(`  --color-${key}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ── Border Radius ─────────────────────────────────────── */');
  for (const [key, value] of Object.entries(buildRadiusMap(theme))) {
    lines.push(`  --radius-${key}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ── Spacing ───────────────────────────────────────────── */');
  for (const [key, value] of Object.entries(buildSpacingMap(theme))) {
    lines.push(`  --spacing-${key}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ── Shadows ───────────────────────────────────────────── */');
  for (const [key, value] of Object.entries(buildShadowMap(theme))) {
    lines.push(`  --shadow-${key}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ── Fonts ─────────────────────────────────────────────── */');
  lines.push(`  --font-sans: var(--ngxsmk-font-sans);`);
  lines.push(`  --font-mono: var(--ngxsmk-font-mono);`);

  lines.push('');
  lines.push('  /* ── Transitions ───────────────────────────────────────── */');
  for (const [key, value] of Object.entries(buildDurationMap(theme))) {
    lines.push(`  --duration-${key}: ${value};`);
  }
  for (const [key, value] of Object.entries(buildEasingMap(theme))) {
    lines.push(`  --ease-${key}: ${value};`);
  }

  lines.push('');
  lines.push('  /* ── Z-Index ───────────────────────────────────────────── */');
  for (const [key, value] of Object.entries(buildZIndexMap(theme))) {
    lines.push(`  --z-${key}: ${value};`);
  }

  lines.push('}');

  return lines.join('\n');
}

// ─── Internal builders ──────────────────────────────────────

function buildColorMap(theme: ResolvedTheme): Record<string, string> {
  const v = (name: string): string => `var(--ngxsmk-${name})`;
  const colors: Record<string, string> = {};

  // Brand (primary)
  colors['primary'] = v('color-primary');
  colors['primary-hover'] = v('color-primary-hover');
  colors['primary-active'] = v('color-primary-active');
  colors['primary-container'] = v('color-primary-container');
  colors['on-primary'] = v('color-on-primary');
  colors['on-primary-container'] = v('color-on-primary-container');
  for (const step of Object.keys(theme.brand)) {
    colors[`primary-${step}`] = v(`color-brand-${step}`);
  }

  // Secondary
  colors['secondary'] = v('color-secondary');
  colors['secondary-hover'] = v('color-secondary-hover');
  colors['secondary-active'] = v('color-secondary-active');
  colors['secondary-container'] = v('color-secondary-container');
  colors['on-secondary'] = v('color-on-secondary');
  colors['on-secondary-container'] = v('color-on-secondary-container');
  for (const step of Object.keys(theme.secondary)) {
    colors[`secondary-${step}`] = v(`color-secondary-${step}`);
  }

  // Tertiary
  const tertiary = deriveScale(rotateHue(theme.brandBase, 64));
  colors['tertiary'] = tertiary['500'];
  colors['tertiary-container'] = tertiary['100'];
  colors['on-tertiary'] = '#FFFFFF';
  colors['on-tertiary-container'] = tertiary['900'];

  // Neutral
  for (const step of Object.keys(theme.neutral)) {
    colors[`neutral-${step}`] = v(`color-neutral-${step}`);
  }

  // Surface / background
  colors['background'] = v('color-background');
  colors['on-background'] = v('color-on-background');
  colors['surface'] = v('color-surface');
  colors['surface-variant'] = v('color-surface-variant');
  colors['surface-hover'] = v('color-surface-hover');
  colors['surface-active'] = v('color-surface-active');
  colors['surface-container'] = v('color-surface-container');
  for (let i = 1; i <= 5; i++) {
    colors[`surface-${i}`] = v(`color-surface-${i}`);
  }
  colors['on-surface'] = v('color-on-surface');
  colors['on-surface-variant'] = v('color-on-surface-variant');
  colors['outline'] = v('color-outline');
  colors['outline-strong'] = v('color-outline-strong');
  colors['outline-variant'] = v('color-outline-variant');
  colors['ring'] = v('color-ring');
  colors['backdrop'] = v('color-backdrop');

  // Semantic
  for (const name of ['error', 'success', 'warning', 'info'] as const) {
    colors[name] = v(`color-${name}`);
    colors[`${name}-container`] = v(`color-${name}-container`);
    colors[`on-${name}`] = v(`color-on-${name}`);
    colors[`on-${name}-container`] = v(`color-on-${name}-container`);
  }

  // Chart palette
  for (let i = 1; i <= 8; i++) {
    colors[`chart-${i}`] = v(`chart-${i}`);
  }

  return colors;
}

function buildRadiusMap(theme: ResolvedTheme): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(theme.radius)) {
    result[key] = `var(--ngxsmk-radius-${key})`;
  }
  result['base'] = `var(--ngxsmk-radius-base)`;
  return result;
}

function buildSpacingMap(theme: ResolvedTheme): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(theme.spacing)) {
    result[`ngxsmk-${key}`] = `var(--ngxsmk-space-${key})`;
  }
  return result;
}

function buildShadowMap(theme: ResolvedTheme): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(theme.shadow)) {
    result[key] = `var(--ngxsmk-shadow-${key})`;
  }
  return result;
}

function buildFontSizeMap(theme: ResolvedTheme): Record<string, [string, Record<string, string>]> {
  const result: Record<string, [string, Record<string, string>]> = {};
  const sizes = { large: 'lg', medium: 'md', small: 'sm' } as const;

  for (const [role] of Object.entries(theme.typography)) {
    for (const [, suffix] of Object.entries(sizes)) {
      result[`${role}-${suffix}`] = [
        `var(--ngxsmk-text-${role}-${suffix}-size)`,
        {
          lineHeight: `var(--ngxsmk-text-${role}-${suffix}-line)`,
          fontWeight: `var(--ngxsmk-text-${role}-${suffix}-weight)`,
        },
      ];
    }
  }

  // Extra-small body
  result['body-xs'] = [
    `var(--ngxsmk-text-body-xs-size)`,
    {
      lineHeight: `var(--ngxsmk-text-body-xs-line)`,
      fontWeight: `var(--ngxsmk-text-body-xs-weight)`,
    },
  ];

  return result;
}

function buildDurationMap(theme: ResolvedTheme): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(theme.duration)) {
    result[key] = `var(--ngxsmk-duration-${key})`;
  }
  return result;
}

function buildEasingMap(theme: ResolvedTheme): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(theme.easing)) {
    result[key] = `var(--ngxsmk-ease-${key})`;
  }
  return result;
}

function buildZIndexMap(theme: ResolvedTheme): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key of Object.keys(theme.zIndex)) {
    result[key] = `var(--ngxsmk-z-${key})`;
  }
  return result;
}
