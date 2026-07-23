/**
 * Tailwind CSS v3 preset for NGXSMK.
 *
 * Usage in tailwind.config.js:
 *   const { ngxsmkPreset } = require('@ngxsmk/theme/tailwind/v3');
 *   module.exports = { presets: [ngxsmkPreset], content: [...] };
 */
export const ngxsmkPreset = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--ngxsmk-color-primary)',
          hover: 'var(--ngxsmk-color-primary-hover)',
          active: 'var(--ngxsmk-color-primary-active)',
          container: 'var(--ngxsmk-color-primary-container)',
          'on-container': 'var(--ngxsmk-color-on-primary-container)',
          50: 'var(--ngxsmk-color-brand-50)',
          100: 'var(--ngxsmk-color-brand-100)',
          200: 'var(--ngxsmk-color-brand-200)',
          300: 'var(--ngxsmk-color-brand-300)',
          400: 'var(--ngxsmk-color-brand-400)',
          500: 'var(--ngxsmk-color-brand-500)',
          600: 'var(--ngxsmk-color-brand-600)',
          700: 'var(--ngxsmk-color-brand-700)',
          800: 'var(--ngxsmk-color-brand-800)',
          900: 'var(--ngxsmk-color-brand-900)',
          950: 'var(--ngxsmk-color-brand-950)',
        },
        'on-primary': 'var(--ngxsmk-color-on-primary)',
        secondary: {
          DEFAULT: 'var(--ngxsmk-color-secondary)',
          hover: 'var(--ngxsmk-color-secondary-hover)',
          active: 'var(--ngxsmk-color-secondary-active)',
          container: 'var(--ngxsmk-color-secondary-container)',
          'on-container': 'var(--ngxsmk-color-on-secondary-container)',
          50: 'var(--ngxsmk-color-secondary-50)',
          100: 'var(--ngxsmk-color-secondary-100)',
          200: 'var(--ngxsmk-color-secondary-200)',
          300: 'var(--ngxsmk-color-secondary-300)',
          400: 'var(--ngxsmk-color-secondary-400)',
          500: 'var(--ngxsmk-color-secondary-500)',
          600: 'var(--ngxsmk-color-secondary-600)',
          700: 'var(--ngxsmk-color-secondary-700)',
          800: 'var(--ngxsmk-color-secondary-800)',
          900: 'var(--ngxsmk-color-secondary-900)',
          950: 'var(--ngxsmk-color-secondary-950)',
        },
        'on-secondary': 'var(--ngxsmk-color-on-secondary)',
        tertiary: {
          DEFAULT: 'var(--ngxsmk-color-tertiary)',
          container: 'var(--ngxsmk-color-tertiary-container)',
          'on-container': 'var(--ngxsmk-color-on-tertiary-container)',
        },
        neutral: {
          DEFAULT: 'var(--ngxsmk-color-on-surface)',
          50: 'var(--ngxsmk-color-neutral-50)',
          100: 'var(--ngxsmk-color-neutral-100)',
          200: 'var(--ngxsmk-color-neutral-200)',
          300: 'var(--ngxsmk-color-neutral-300)',
          400: 'var(--ngxsmk-color-neutral-400)',
          500: 'var(--ngxsmk-color-neutral-500)',
          600: 'var(--ngxsmk-color-neutral-600)',
          700: 'var(--ngxsmk-color-neutral-700)',
          800: 'var(--ngxsmk-color-neutral-800)',
          900: 'var(--ngxsmk-color-neutral-900)',
          950: 'var(--ngxsmk-color-neutral-950)',
        },
        background: 'var(--ngxsmk-color-background)',
        'on-background': 'var(--ngxsmk-color-on-background)',
        surface: {
          DEFAULT: 'var(--ngxsmk-color-surface)',
          variant: 'var(--ngxsmk-color-surface-variant)',
          hover: 'var(--ngxsmk-color-surface-hover)',
          active: 'var(--ngxsmk-color-surface-active)',
          container: 'var(--ngxsmk-color-surface-container)',
          1: 'var(--ngxsmk-color-surface-1)',
          2: 'var(--ngxsmk-color-surface-2)',
          3: 'var(--ngxsmk-color-surface-3)',
          4: 'var(--ngxsmk-color-surface-4)',
          5: 'var(--ngxsmk-color-surface-5)',
        },
        'on-surface': {
          DEFAULT: 'var(--ngxsmk-color-on-surface)',
          variant: 'var(--ngxsmk-color-on-surface-variant)',
        },
        outline: {
          DEFAULT: 'var(--ngxsmk-color-outline)',
          strong: 'var(--ngxsmk-color-outline-strong)',
          variant: 'var(--ngxsmk-color-outline-variant)',
        },
        ring: 'var(--ngxsmk-color-ring)',
        backdrop: 'var(--ngxsmk-color-backdrop)',
        error: {
          DEFAULT: 'var(--ngxsmk-color-error)',
          container: 'var(--ngxsmk-color-error-container)',
          'on-container': 'var(--ngxsmk-color-on-error-container)',
        },
        'on-error': 'var(--ngxsmk-color-on-error)',
        success: {
          DEFAULT: 'var(--ngxsmk-color-success)',
          container: 'var(--ngxsmk-color-success-container)',
          'on-container': 'var(--ngxsmk-color-on-success-container)',
        },
        'on-success': 'var(--ngxsmk-color-on-success)',
        warning: {
          DEFAULT: 'var(--ngxsmk-color-warning)',
          container: 'var(--ngxsmk-color-warning-container)',
          'on-container': 'var(--ngxsmk-color-on-warning-container)',
        },
        'on-warning': 'var(--ngxsmk-color-on-warning)',
        info: {
          DEFAULT: 'var(--ngxsmk-color-info)',
          container: 'var(--ngxsmk-color-info-container)',
          'on-container': 'var(--ngxsmk-color-on-info-container)',
        },
        'on-info': 'var(--ngxsmk-color-on-info)',
        chart: {
          1: 'var(--ngxsmk-chart-1)',
          2: 'var(--ngxsmk-chart-2)',
          3: 'var(--ngxsmk-chart-3)',
          4: 'var(--ngxsmk-chart-4)',
          5: 'var(--ngxsmk-chart-5)',
          6: 'var(--ngxsmk-chart-6)',
          7: 'var(--ngxsmk-chart-7)',
          8: 'var(--ngxsmk-chart-8)',
        },
      },
      borderRadius: {
        none: 'var(--ngxsmk-radius-none)',
        sm: 'var(--ngxsmk-radius-sm)',
        DEFAULT: 'var(--ngxsmk-radius-base)',
        md: 'var(--ngxsmk-radius-md)',
        lg: 'var(--ngxsmk-radius-lg)',
        xl: 'var(--ngxsmk-radius-xl)',
        '2xl': 'var(--ngxsmk-radius-2xl)',
        '3xl': 'var(--ngxsmk-radius-3xl)',
        full: 'var(--ngxsmk-radius-full)',
      },
      spacing: {
        'ngxsmk-0': 'var(--ngxsmk-space-0)',
        'ngxsmk-0-5': 'var(--ngxsmk-space-0-5)',
        'ngxsmk-1': 'var(--ngxsmk-space-1)',
        'ngxsmk-1-5': 'var(--ngxsmk-space-1-5)',
        'ngxsmk-2': 'var(--ngxsmk-space-2)',
        'ngxsmk-3': 'var(--ngxsmk-space-3)',
        'ngxsmk-4': 'var(--ngxsmk-space-4)',
        'ngxsmk-5': 'var(--ngxsmk-space-5)',
        'ngxsmk-6': 'var(--ngxsmk-space-6)',
        'ngxsmk-8': 'var(--ngxsmk-space-8)',
        'ngxsmk-10': 'var(--ngxsmk-space-10)',
        'ngxsmk-12': 'var(--ngxsmk-space-12)',
        'ngxsmk-16': 'var(--ngxsmk-space-16)',
        'ngxsmk-20': 'var(--ngxsmk-space-20)',
        'ngxsmk-24': 'var(--ngxsmk-space-24)',
        'ngxsmk-32': 'var(--ngxsmk-space-32)',
      },
      boxShadow: {
        sm: 'var(--ngxsmk-shadow-sm)',
        DEFAULT: 'var(--ngxsmk-shadow-md)',
        md: 'var(--ngxsmk-shadow-md)',
        lg: 'var(--ngxsmk-shadow-lg)',
        xl: 'var(--ngxsmk-shadow-xl)',
        '2xl': 'var(--ngxsmk-shadow-2xl)',
      },
      fontFamily: {
        sans: 'var(--ngxsmk-font-sans)',
        mono: 'var(--ngxsmk-font-mono)',
      },
      fontSize: {
        'display-lg': [
          'var(--ngxsmk-text-display-lg-size)',
          {
            lineHeight: 'var(--ngxsmk-text-display-lg-line)',
            fontWeight: 'var(--ngxsmk-text-display-lg-weight)',
          },
        ],
        'display-md': [
          'var(--ngxsmk-text-display-md-size)',
          {
            lineHeight: 'var(--ngxsmk-text-display-md-line)',
            fontWeight: 'var(--ngxsmk-text-display-md-weight)',
          },
        ],
        'display-sm': [
          'var(--ngxsmk-text-display-sm-size)',
          {
            lineHeight: 'var(--ngxsmk-text-display-sm-line)',
            fontWeight: 'var(--ngxsmk-text-display-sm-weight)',
          },
        ],
        'headline-lg': [
          'var(--ngxsmk-text-headline-lg-size)',
          {
            lineHeight: 'var(--ngxsmk-text-headline-lg-line)',
            fontWeight: 'var(--ngxsmk-text-headline-lg-weight)',
          },
        ],
        'headline-md': [
          'var(--ngxsmk-text-headline-md-size)',
          {
            lineHeight: 'var(--ngxsmk-text-headline-md-line)',
            fontWeight: 'var(--ngxsmk-text-headline-md-weight)',
          },
        ],
        'headline-sm': [
          'var(--ngxsmk-text-headline-sm-size)',
          {
            lineHeight: 'var(--ngxsmk-text-headline-sm-line)',
            fontWeight: 'var(--ngxsmk-text-headline-sm-weight)',
          },
        ],
        'title-lg': [
          'var(--ngxsmk-text-title-lg-size)',
          {
            lineHeight: 'var(--ngxsmk-text-title-lg-line)',
            fontWeight: 'var(--ngxsmk-text-title-lg-weight)',
          },
        ],
        'title-md': [
          'var(--ngxsmk-text-title-md-size)',
          {
            lineHeight: 'var(--ngxsmk-text-title-md-line)',
            fontWeight: 'var(--ngxsmk-text-title-md-weight)',
          },
        ],
        'title-sm': [
          'var(--ngxsmk-text-title-sm-size)',
          {
            lineHeight: 'var(--ngxsmk-text-title-sm-line)',
            fontWeight: 'var(--ngxsmk-text-title-sm-weight)',
          },
        ],
        'body-lg': [
          'var(--ngxsmk-text-body-lg-size)',
          {
            lineHeight: 'var(--ngxsmk-text-body-lg-line)',
            fontWeight: 'var(--ngxsmk-text-body-lg-weight)',
          },
        ],
        'body-md': [
          'var(--ngxsmk-text-body-md-size)',
          {
            lineHeight: 'var(--ngxsmk-text-body-md-line)',
            fontWeight: 'var(--ngxsmk-text-body-md-weight)',
          },
        ],
        'body-sm': [
          'var(--ngxsmk-text-body-sm-size)',
          {
            lineHeight: 'var(--ngxsmk-text-body-sm-line)',
            fontWeight: 'var(--ngxsmk-text-body-sm-weight)',
          },
        ],
        'body-xs': [
          'var(--ngxsmk-text-body-xs-size)',
          {
            lineHeight: 'var(--ngxsmk-text-body-xs-line)',
            fontWeight: 'var(--ngxsmk-text-body-xs-weight)',
          },
        ],
        'label-lg': [
          'var(--ngxsmk-text-label-lg-size)',
          {
            lineHeight: 'var(--ngxsmk-text-label-lg-line)',
            fontWeight: 'var(--ngxsmk-text-label-lg-weight)',
          },
        ],
        'label-md': [
          'var(--ngxsmk-text-label-md-size)',
          {
            lineHeight: 'var(--ngxsmk-text-label-md-line)',
            fontWeight: 'var(--ngxsmk-text-label-md-weight)',
          },
        ],
        'label-sm': [
          'var(--ngxsmk-text-label-sm-size)',
          {
            lineHeight: 'var(--ngxsmk-text-label-sm-line)',
            fontWeight: 'var(--ngxsmk-text-label-sm-weight)',
          },
        ],
      },
      transitionDuration: {
        instant: 'var(--ngxsmk-duration-instant)',
        fast: 'var(--ngxsmk-duration-fast)',
        normal: 'var(--ngxsmk-duration-normal)',
        slow: 'var(--ngxsmk-duration-slow)',
        slower: 'var(--ngxsmk-duration-slower)',
      },
      transitionTimingFunction: {
        linear: 'var(--ngxsmk-ease-linear)',
        in: 'var(--ngxsmk-ease-in)',
        out: 'var(--ngxsmk-ease-out)',
        'in-out': 'var(--ngxsmk-ease-in-out)',
        emphasized: 'var(--ngxsmk-ease-emphasized)',
      },
      zIndex: {
        dropdown: 'var(--ngxsmk-z-dropdown)',
        sticky: 'var(--ngxsmk-z-sticky)',
        banner: 'var(--ngxsmk-z-banner)',
        overlay: 'var(--ngxsmk-z-overlay)',
        modal: 'var(--ngxsmk-z-modal)',
        popover: 'var(--ngxsmk-z-popover)',
        toast: 'var(--ngxsmk-z-toast)',
        tooltip: 'var(--ngxsmk-z-tooltip)',
      },
      opacity: {
        disabled: 'var(--ngxsmk-opacity-disabled)',
        muted: 'var(--ngxsmk-opacity-muted)',
        faint: 'var(--ngxsmk-opacity-faint)',
      },
    },
  },
  corePlugins: {
    preflight: false,
  },
} as const;
