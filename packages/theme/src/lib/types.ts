/**
 * Design token model for the NGXSMK universal theme engine.
 *
 * A `ThemeConfig` is the single source of truth for a theme. The token
 * engine transforms it into platform outputs (CSS custom properties today;
 * SCSS/Tailwind/JSON exporters build on the same model).
 */

/** An 11-step color scale, 50 (lightest) to 950 (darkest). */
export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export type ColorScaleStep = keyof ColorScale;

/** Status colors used by alerts, badges, form validation, toasts. */
export interface SemanticColors {
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface FontFamilies {
  sans: string;
  mono: string;
}

/** A single typographic role (size + line height + weight). */
export interface TypeStyle {
  size: string;
  lineHeight: string;
  weight: string;
}

export type TypeRoleSize = 'large' | 'medium' | 'small';

/** Material-inspired type roles: display, headline, title, body, label. */
export interface TypographyScale {
  display: Record<TypeRoleSize, TypeStyle>;
  headline: Record<TypeRoleSize, TypeStyle>;
  title: Record<TypeRoleSize, TypeStyle>;
  body: Record<TypeRoleSize, TypeStyle>;
  label: Record<TypeRoleSize, TypeStyle>;
}

export type DarkModeStrategy = 'class' | 'media' | 'system';

export type RadiusPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl';

/** User-facing theme configuration. Everything except `brand` is optional. */
export interface ThemeConfig {
  /** Identifier used when registering multiple themes. */
  name?: string;
  brand: {
    /** Brand color as hex (e.g. `#7C3AED`). A full 50–950 scale is derived. */
    primary: string;
    /** Optional pre-built scale; overrides derivation from `primary`. */
    primaryScale?: ColorScale;
    /** Secondary brand color as hex. A full 50–950 scale is derived. */
    secondary?: string;
    /** Optional pre-built secondary scale. */
    secondaryScale?: ColorScale;
  };
  /** Neutral (gray) scale. Defaults to a balanced zinc-like scale. */
  neutral?: ColorScale;
  semantic?: Partial<SemanticColors>;
  typography?: {
    fontFamily?: Partial<FontFamilies>;
  };
  /** Global corner rounding character of the theme. Default `md`. */
  borderRadius?: RadiusPreset;
  /** How dark mode is activated. Default: `class` (a `.dark` class on `<html>`). */
  darkMode?: {
    strategy?: DarkModeStrategy;
    /** Class name used by the `class` strategy. Default `dark`. */
    className?: string;
  };
  /**
   * Raw semantic-role token overrides merged into the generated output,
   * e.g. `{ dark: { '--ngxsmk-color-primary': '#FAFAFA' } }`.
   */
  overrides?: {
    light?: Record<string, string>;
    dark?: Record<string, string>;
  };
}

/** A fully resolved theme: config merged with defaults, scales derived. */
export interface ResolvedTheme {
  name: string;
  /** The exact brand color from the config — light-mode primary. */
  brandBase: string;
  brand: ColorScale;
  secondaryBase: string;
  secondary: ColorScale;
  neutral: ColorScale;
  semantic: SemanticColors;
  fontFamily: FontFamilies;
  typography: TypographyScale;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  radiusBase: RadiusPreset;
  shadow: Record<string, string>;
  duration: Record<string, string>;
  easing: Record<string, string>;
  /** Stacking layers emitted as `--ngxsmk-z-*`; overlays must share this ladder. */
  zIndex: Record<string, string>;
  darkMode: { strategy: DarkModeStrategy; className: string };
  overrides: {
    light: Record<string, string>;
    dark: Record<string, string>;
  };
}
