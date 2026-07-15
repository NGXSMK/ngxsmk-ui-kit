import { deriveScale, rotateHue } from './color';
import {
  DEFAULT_FONT_FAMILY,
  DEFAULT_NEUTRAL,
  DEFAULT_SEMANTIC,
  DEFAULT_TYPOGRAPHY,
  DURATION,
  EASING,
  RADIUS,
  SHADOW,
  SPACING,
  Z_INDEX,
} from './tokens';
import { ResolvedTheme, ThemeConfig } from './types';

/**
 * Identity helper that gives `ngxsmk.config.ts` files full type inference:
 *
 * ```ts
 * import { defineConfig } from '@ngxsmk/theme';
 * export default defineConfig({ brand: { primary: '#7C3AED' } });
 * ```
 */
export function defineConfig(config: ThemeConfig): ThemeConfig {
  return config;
}

/** Merge a user config with defaults and derive all color scales. */
export function resolveTheme(config: ThemeConfig): ResolvedTheme {
  const secondaryBase = config.brand.secondary ?? rotateHue(config.brand.primary, 60);
  return {
    name: config.name ?? 'custom',
    brandBase: config.brand.primary,
    brand: config.brand.primaryScale ?? deriveScale(config.brand.primary),
    secondaryBase,
    secondary: config.brand.secondaryScale ?? deriveScale(secondaryBase),
    neutral: config.neutral ?? DEFAULT_NEUTRAL,
    semantic: { ...DEFAULT_SEMANTIC, ...config.semantic },
    fontFamily: { ...DEFAULT_FONT_FAMILY, ...config.typography?.fontFamily },
    typography: DEFAULT_TYPOGRAPHY,
    spacing: SPACING,
    radius: RADIUS,
    radiusBase: config.borderRadius ?? 'md',
    shadow: SHADOW,
    duration: DURATION,
    easing: EASING,
    zIndex: Z_INDEX,
    darkMode: {
      strategy: config.darkMode?.strategy ?? 'class',
      className: config.darkMode?.className ?? 'dark',
    },
    overrides: {
      light: config.overrides?.light ?? {},
      dark: config.overrides?.dark ?? {},
    },
  };
}
