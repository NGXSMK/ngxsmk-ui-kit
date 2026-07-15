import { ColorScale, FontFamilies, SemanticColors, TypographyScale } from './types';

/**
 * Cool blue-grey neutral scale. Light steps carry a subtle blue tint; the
 * darkest steps flatten toward a near-neutral charcoal so dark-mode
 * surfaces read like a soft, desaturated navy rather than a saturated one.
 */
export const DEFAULT_NEUTRAL: ColorScale = {
  50: '#F1F4F7',
  100: '#E4E9EE',
  200: '#CCD3DB',
  300: '#A4B0BC',
  400: '#778593',
  500: '#4E606F',
  600: '#3A4650',
  700: '#2A333B',
  800: '#1F1F22',
  900: '#18181A',
  950: '#111112',
};

export const DEFAULT_SEMANTIC: SemanticColors = {
  success: '#0D8626',
  warning: '#E9AF08',
  error: '#E3193B',
  info: '#2563EB',
};

export const DEFAULT_FONT_FAMILY: FontFamilies = {
  sans: "'Inter', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
};

export const DEFAULT_TYPOGRAPHY: TypographyScale = {
  display: {
    large: { size: '3.5625rem', lineHeight: '4rem', weight: '700' },
    medium: { size: '2.8125rem', lineHeight: '3.25rem', weight: '700' },
    small: { size: '2.25rem', lineHeight: '2.75rem', weight: '700' },
  },
  headline: {
    large: { size: '2rem', lineHeight: '2.5rem', weight: '600' },
    medium: { size: '1.75rem', lineHeight: '2.25rem', weight: '600' },
    small: { size: '1.5rem', lineHeight: '2rem', weight: '600' },
  },
  title: {
    large: { size: '1.375rem', lineHeight: '1.75rem', weight: '600' },
    medium: { size: '1.125rem', lineHeight: '1.5rem', weight: '600' },
    small: { size: '1rem', lineHeight: '1.5rem', weight: '600' },
  },
  body: {
    large: { size: '1rem', lineHeight: '1.5rem', weight: '400' },
    medium: { size: '0.875rem', lineHeight: '1.25rem', weight: '400' },
    small: { size: '0.75rem', lineHeight: '1rem', weight: '400' },
  },
  label: {
    large: { size: '0.875rem', lineHeight: '1.25rem', weight: '500' },
    medium: { size: '0.75rem', lineHeight: '1rem', weight: '500' },
    small: { size: '0.6875rem', lineHeight: '1rem', weight: '500' },
  },
};

/**
 * Standard height for single-line text controls (input, select, number-input,
 * combobox, input-group, power-search, multi-select). All controls in the
 * family use this so they read as one consistent size.
 */
export const CONTROL_HEIGHT = '2.5rem';

export const SPACING: Record<string, string> = {
  '0': '0px',
  '0-5': '0.125rem',
  '1': '0.25rem',
  '1-5': '0.375rem',
  '2': '0.5rem',
  '3': '0.75rem',
  '4': '1rem',
  '5': '1.25rem',
  '6': '1.5rem',
  '8': '2rem',
  '10': '2.5rem',
  '12': '3rem',
  '16': '4rem',
  '20': '5rem',
  '24': '6rem',
  '32': '8rem',
};

/**
 * Radius scale: inner 4px, element 8px (buttons/inputs, the base),
 * container 12px (cards), then progressively larger through 28px "page"
 * rounding. Deliberately generous so surfaces read soft and rounded.
 */
export const RADIUS: Record<string, string> = {
  none: '0px',
  sm: '0.25rem', // 4px  — inner (nested chips, checkboxes)
  md: '0.5rem', // 8px  — element (buttons, inputs) — default base
  lg: '0.75rem', // 12px — container (cards, popovers)
  xl: '1rem', // 16px
  '2xl': '1.25rem', // 20px
  '3xl': '1.75rem', // 28px — page / hero surfaces
  full: '9999px',
};

/**
 * Soft, diffuse, layered shadows (two stacked blurs, low alpha). Overlay
 * CSS resolves these to slightly stronger values in dark mode via the
 * elevation tokens on each surface.
 */
export const SHADOW: Record<string, string> = {
  sm: '0 1px 1px rgb(0 0 0 / 0.08), 0 2px 8px rgb(0 0 0 / 0.08)',
  md: '0 1px 2px rgb(0 0 0 / 0.1), 0 2px 12px rgb(0 0 0 / 0.1)',
  lg: '0 2px 2px rgb(0 0 0 / 0.1), 0 8px 24px rgb(0 0 0 / 0.12)',
  xl: '0 4px 6px rgb(0 0 0 / 0.1), 0 12px 32px rgb(0 0 0 / 0.16)',
  '2xl': '0 8px 12px rgb(0 0 0 / 0.14), 0 24px 48px rgb(0 0 0 / 0.22)',
};

/**
 * Stacking ladder for overlay components. Anchored popups sit lowest;
 * tooltips always win. Components must use these instead of ad-hoc values
 * so overlays never fight each other.
 */
export const Z_INDEX: Record<string, string> = {
  dropdown: '1000',
  sticky: '1100',
  banner: '1200',
  overlay: '1300',
  modal: '1400',
  popover: '1500',
  toast: '1600',
  tooltip: '1700',
};

export const DURATION: Record<string, string> = {
  instant: '0ms',
  fast: '100ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
};

export const EASING: Record<string, string> = {
  linear: 'linear',
  in: 'cubic-bezier(0.4, 0, 1, 1)',
  out: 'cubic-bezier(0, 0, 0.2, 1)',
  'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
};
