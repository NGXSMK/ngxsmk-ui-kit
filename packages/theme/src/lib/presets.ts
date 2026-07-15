import { ThemeConfig } from './types';

/** Retained alias so existing violet-themed demos keep working. */
export const violetPreset: ThemeConfig = {
  name: 'violet',
  brand: { primary: '#7C3AED' },
};

/** Monochrome preset in the spirit of shadcn/ui's default look. */
export const neutralPreset: ThemeConfig = {
  name: 'neutral',
  brand: {
    primary: '#18181B',
    // A neutral brand cannot be derived from lightness alone — pin the scale.
    primaryScale: {
      50: '#FAFAFA',
      100: '#F4F4F5',
      200: '#E4E4E7',
      300: '#D4D4D8',
      400: '#A1A1AA',
      500: '#71717A',
      600: '#3F3F46',
      700: '#27272A',
      800: '#1F1F23',
      900: '#18181B',
      950: '#09090B',
    },
  },
  overrides: {
    // A near-black brand must invert in dark mode to stay visible.
    dark: {
      '--ngxsmk-color-primary': '#FAFAFA',
      '--ngxsmk-color-on-primary': '#18181B',
      '--ngxsmk-color-primary-hover': '#E4E4E7',
      '--ngxsmk-color-primary-active': '#D4D4D8',
      '--ngxsmk-color-ring': '#D4D4D8',
    },
  },
};

/**
 * Default preset: Emerald green. This preset generates the prebuilt
 * `ngxsmk.css` stylesheet shipped with @ngxsmk/theme.
 */
export const emeraldPreset: ThemeConfig = {
  name: 'emerald',
  brand: { primary: '#059669' },
};

export const rosePreset: ThemeConfig = {
  name: 'rose',
  brand: { primary: '#E11D48' },
};

export const presets: Record<string, ThemeConfig> = {
  violet: violetPreset,
  neutral: neutralPreset,
  emerald: emeraldPreset,
  rose: rosePreset,
};
