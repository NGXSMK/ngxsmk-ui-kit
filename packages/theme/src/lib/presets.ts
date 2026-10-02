import { ColorScale, ThemeConfig } from './types';

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
 *
 * **Classic contract:** keep this visually stable for existing consumers.
 * Premium Ink lives in `inkPreset` / `ngxsmk.ink.css` as an opt-in.
 */
export const emeraldPreset: ThemeConfig = {
  name: 'emerald',
  brand: { primary: '#059669' },
};

export const rosePreset: ThemeConfig = {
  name: 'rose',
  brand: { primary: '#E11D48' },
};

/**
 * Cool graphite neutrals for the Ink & precision look. Independent of the
 * Classic `DEFAULT_NEUTRAL` so emerald/violet/rose stay unchanged.
 */
const INK_NEUTRAL: ColorScale = {
  50: '#F6F7F8',
  100: '#EBEDF0',
  200: '#D5D8DE',
  300: '#B0B5BF',
  400: '#7E8491',
  500: '#5A606C',
  600: '#454954',
  700: '#33363E',
  800: '#1C1E24',
  900: '#12141A',
  950: '#0A0B0E',
};

/**
 * Opt-in premium preset: Ink & precision.
 * Generates `ngxsmk.ink.css`. Does not replace the default `ngxsmk.css`.
 *
 * Consumers:
 * ```css
 * @import '@ngxsmk/theme/styles/ngxsmk.ink.css';
 * ```
 * or `theme.applyTheme(inkPreset)`.
 */
export const inkPreset: ThemeConfig = {
  name: 'ink',
  brand: { primary: '#0F766E' },
  neutral: INK_NEUTRAL,
  typography: {
    fontFamily: {
      sans: "'Geist Sans', 'Geist Sans Fallback', system-ui, -apple-system, sans-serif",
      mono: "'Geist Mono', 'Geist Mono Fallback', monospace",
    },
  },
  borderRadius: 'md',
  radiusScale: {
    sm: '0.1875rem', // 3px
    md: '0.375rem', // 6px — element base
    lg: '0.5rem', // 8px — cards / popovers
    xl: '0.625rem', // 10px
    '2xl': '0.75rem', // 12px
    '3xl': '1rem', // 16px — page surfaces (was 28px in Classic)
  },
  shadowScale: {
    sm: '0 0 0 1px rgb(0 0 0 / 0.04), 0 1px 2px rgb(0 0 0 / 0.04)',
    md: '0 0 0 1px rgb(0 0 0 / 0.04), 0 1px 2px rgb(0 0 0 / 0.05), 0 4px 10px rgb(0 0 0 / 0.05)',
    lg: '0 0 0 1px rgb(0 0 0 / 0.05), 0 2px 4px rgb(0 0 0 / 0.05), 0 10px 28px rgb(0 0 0 / 0.08)',
    xl: '0 0 0 1px rgb(0 0 0 / 0.05), 0 4px 8px rgb(0 0 0 / 0.06), 0 18px 40px rgb(0 0 0 / 0.1)',
    '2xl':
      '0 0 0 1px rgb(0 0 0 / 0.06), 0 8px 16px rgb(0 0 0 / 0.08), 0 28px 56px rgb(0 0 0 / 0.12)',
  },
  overrides: {
    light: {
      // Graphite canvas — quieter than Classic cool-blue wash.
      '--ngxsmk-color-background': '#F4F5F7',
      '--ngxsmk-color-surface': '#FFFFFF',
      '--ngxsmk-color-surface-elevated': '#FFFFFF',
      '--ngxsmk-color-surface-overlay': '#FFFFFF',
      '--ngxsmk-color-surface-variant': '#EBEDF0',
      '--ngxsmk-color-on-background': '#0A0B0E',
      '--ngxsmk-color-on-surface': '#0A0B0E',
      '--ngxsmk-color-on-surface-variant': '#5A606C',
      '--ngxsmk-color-surface-hover': 'rgb(10 11 14 / 0.04)',
      '--ngxsmk-color-surface-active': 'rgb(10 11 14 / 0.08)',
      '--ngxsmk-color-outline': 'rgb(10 11 14 / 0.1)',
      '--ngxsmk-color-outline-strong': '#D5D8DE',
      '--ngxsmk-color-outline-variant': 'rgb(10 11 14 / 0.06)',
      '--ngxsmk-color-outline-subtle': 'rgb(10 11 14 / 0.05)',
      '--ngxsmk-color-backdrop': 'rgb(10 11 14 / 0.48)',
      '--ngxsmk-color-ring': '#0F766E',
      // Precision focus — tighter than Classic double ring.
      '--ngxsmk-shadow-focus':
        '0 0 0 1px #FFFFFF, 0 0 0 3px color-mix(in srgb, #0F766E 55%, transparent)',
      // Density.
      '--ngxsmk-control-height': '2.25rem',
      '--ngxsmk-control-height-sm': '1.875rem',
      '--ngxsmk-control-height-md': '2.25rem',
      '--ngxsmk-control-height-lg': '2.75rem',
      // Component chrome — border-first, no float.
      '--ngxsmk-hover-lift': 'none',
      '--ngxsmk-button-font-weight': '600',
      '--ngxsmk-button-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-input-border': 'var(--ngxsmk-color-outline)',
      '--ngxsmk-input-height': 'var(--ngxsmk-control-height)',
      '--ngxsmk-input-group-height': '2.25rem',
      '--ngxsmk-input-group-border': 'var(--ngxsmk-color-outline)',
      '--ngxsmk-card-shadow': 'none',
      '--ngxsmk-card-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-card-border-width': '1px',
      '--ngxsmk-dialog-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-dialog-blur': '8px',
      '--ngxsmk-sheet-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-toast-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-toast-accent-width': '2px',
      '--ngxsmk-select-border': 'var(--ngxsmk-color-outline)',
      '--ngxsmk-menu-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-pagination-size': '2rem',
      '--ngxsmk-pagination-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-table-header-bg':
        'color-mix(in srgb, var(--ngxsmk-color-surface-variant) 70%, transparent)',
      '--ngxsmk-badge-font-weight': '650',
      '--ngxsmk-progress-height': '0.375rem',
      // Forms — denser labels, quieter group chrome.
      '--ngxsmk-form-field-gap': 'var(--ngxsmk-space-1)',
      '--ngxsmk-form-field-label-weight': '600',
      '--ngxsmk-input-group-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-input-group-padding': '0.625rem',
      '--ngxsmk-radio-border': 'var(--ngxsmk-color-outline)',
      // Data table — ops density.
      '--ngxsmk-data-table-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-data-table-filter-bg':
        'color-mix(in srgb, var(--ngxsmk-color-surface-variant) 55%, transparent)',
      '--ngxsmk-data-table-page-size': '1.875rem',
      '--ngxsmk-data-table-loading-height': '2px',
      // AI surfaces — border-first console, no soft float.
      '--ngxsmk-ai-chat-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-ai-chat-header-bg': 'var(--ngxsmk-color-surface)',
      '--ngxsmk-ai-chat-bubble-bg': 'var(--ngxsmk-color-surface-variant)',
      '--ngxsmk-ai-chat-bubble-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-ai-chat-composer-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-prompt-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-prompt-border': 'var(--ngxsmk-color-outline)',
      '--ngxsmk-prompt-shadow': 'none',
      '--ngxsmk-prompt-send-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-chat-bubble-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-chat-bubble-padding': 'var(--ngxsmk-space-2) var(--ngxsmk-space-3)',
    },
    dark: {
      '--ngxsmk-color-background': '#0A0B0E',
      '--ngxsmk-color-surface': '#12141A',
      '--ngxsmk-color-surface-elevated': '#1C1E24',
      '--ngxsmk-color-surface-overlay': '#1C1E24',
      '--ngxsmk-color-surface-container': '#12141A',
      '--ngxsmk-color-surface-variant': '#1C1E24',
      '--ngxsmk-color-surface-1': '#12141A',
      '--ngxsmk-color-surface-2': '#1C1E24',
      '--ngxsmk-color-outline': 'rgb(246 247 248 / 0.12)',
      '--ngxsmk-color-outline-strong': 'rgb(246 247 248 / 0.18)',
      '--ngxsmk-color-outline-variant': 'rgb(246 247 248 / 0.08)',
      '--ngxsmk-color-backdrop': 'rgb(0 0 0 / 0.62)',
      '--ngxsmk-shadow-focus':
        '0 0 0 1px #12141A, 0 0 0 3px color-mix(in srgb, #2DD4BF 50%, transparent)',
      '--ngxsmk-hover-lift': 'none',
      '--ngxsmk-control-height': '2.25rem',
      '--ngxsmk-control-height-sm': '1.875rem',
      '--ngxsmk-control-height-md': '2.25rem',
      '--ngxsmk-control-height-lg': '2.75rem',
      '--ngxsmk-button-font-weight': '600',
      '--ngxsmk-card-shadow': 'none',
      '--ngxsmk-card-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-dialog-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-input-border': 'var(--ngxsmk-color-outline)',
      '--ngxsmk-select-border': 'var(--ngxsmk-color-outline)',
      '--ngxsmk-form-field-label-weight': '600',
      '--ngxsmk-input-group-height': '2.25rem',
      '--ngxsmk-ai-chat-radius': 'var(--ngxsmk-radius-lg)',
      '--ngxsmk-ai-chat-header-bg': 'var(--ngxsmk-color-surface)',
      '--ngxsmk-prompt-shadow': 'none',
      '--ngxsmk-prompt-border': 'var(--ngxsmk-color-outline)',
      '--ngxsmk-prompt-send-radius': 'var(--ngxsmk-radius-md)',
      '--ngxsmk-data-table-filter-bg':
        'color-mix(in srgb, var(--ngxsmk-color-surface-variant) 70%, transparent)',
    },
  },
};

export const presets: Record<string, ThemeConfig> = {
  violet: violetPreset,
  neutral: neutralPreset,
  emerald: emeraldPreset,
  rose: rosePreset,
  ink: inkPreset,
};
