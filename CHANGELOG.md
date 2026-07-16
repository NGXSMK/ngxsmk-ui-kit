# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.1] - 2026-07-16

### Added

- **Keyboard navigation** for the typeahead/select family — `autocomplete`,
  `combobox`, `multi-select`, and `multi-selector` now support <kbd>↓</kbd>/<kbd>↑</kbd>
  (with wrap-around), <kbd>Home</kbd>/<kbd>End</kbd>, <kbd>Enter</kbd> to select, and
  <kbd>Escape</kbd> to close, matching the existing `select` behavior. Includes
  `aria-activedescendant` wiring and `role="listbox"`/`role="option"` semantics.
- **Interaction and sizing tokens** — `--ngxsmk-focus-ring` / `--ngxsmk-focus-ring-error`,
  `--ngxsmk-opacity-{disabled,muted,faint}`, `--ngxsmk-icon-{sm,md,lg}`,
  `--ngxsmk-control-height-{sm,md,lg}`, `--ngxsmk-tracking-{tight,normal,wide}`,
  `--ngxsmk-hover-lift`, and `--ngxsmk-press-scale`.
- **Runtime i18n in the demo** — 10 languages with a language switcher.
- **Theme export formats** — the playground's theme editor now exports SCSS
  variables and Tokens Studio JSON (for Figma) alongside CSS, Tailwind, and StyleX.
- **Inspector click-to-reveal** in the theme playground — click any previewed
  element to jump to and select its source in the code editor.

### Changed

- **Unified focus indicator** — every component now renders its focus ring from
  `var(--ngxsmk-focus-ring)` instead of three competing ad-hoc patterns.
- **Refined elevation scale** — shadows gain a hairline contact layer so surfaces
  read crisply against white.
- Demo `templates`, `playground`, and `playground/component` pages redesigned.
- `@ngxsmk/cdk`'s main barrel no longer re-exports `@ngxsmk/cdk/testing`, keeping
  `axe-core` (a CommonJS dependency) out of runtime bundles. Import test helpers
  from `@ngxsmk/cdk/testing` directly.
- Demo no longer showcases `date-picker`/`datepicker`/`tel-input`; the standalone
  [ngxsmk-datepicker](https://github.com/NGXSMK/ngxsmk-datepicker) and
  [ngxsmk-tel-input](https://github.com/NGXSMK/ngxsmk-tel-input) repositories are
  referenced instead.

### Fixed

- **`prefers-reduced-motion` now suppresses all token-driven motion** — the
  generated stylesheet previously zeroed only `--ngxsmk-motion-duration` while
  components animate with `--ngxsmk-duration-*` directly. A `.ngxsmk-reduce-motion`
  class offers the same as an app-level opt-in.
- **Dark-mode color regressions** — 14 components hardcoded light-only hex
  fallbacks (`var(--ngxsmk-color-surface, #ffffff)`); all now resolve from tokens.
- `meter` referenced a non-existent `--ngxsmk-color-danger` token; now uses
  `--ngxsmk-color-error`.
- Disabled states used seven different opacity literals; all now use
  `--ngxsmk-opacity-disabled`.
- `chart-pie` defaults to non-responsive so `size` controls the diameter.

## [1.3.0] - 2026-07-16

### Added

- **`NgxsmkSeoService` / `provideSeo()`** — manages document title, meta
  description, canonical link, Open Graph and Twitter Card tags, robots
  directive, and JSON-LD from a single API.

### Removed

- The `astryx` theme preset.

## [1.2.0] - 2026-07-16

### Added

- **Component explorer, global search, command palette, and interactive
  playground** in the demo app.

### Changed

- Libraries are compiled in **partial Ivy mode**, resolving `NG0203` for
  consumers.

### Fixed

- `NgxsmkThemeService` document and signal initialization.
- `DOCUMENT` imported from `@angular/common` (not exported by `@angular/core`
  in v19+).
- CI compatibility matrix pins Node 20 for Angular 17/18.

## [1.1.0] - 2025-07-15

### Added

- **180 standalone components** across `@ngxsmk/core` — buttons, badges, tags,
  chips, cards, dividers, spinners, skeletons, alerts, progress bars, avatars,
  form-field, inputs, checkboxes, radios, switches, tabs, accordions, tooltips,
  dialogs, toasts, data-table, combobox, multi-select, power-search, pagination,
  stepper, command-palette, charts, kanban-board, and many more.
- **`@ngxsmk/theme`** — universal design-token engine with `ThemeConfig` →
  `--ngxsmk-*` CSS custom properties, 4 built-in presets, light/dark/system
  mode strategies, and runtime switching via `NgxsmkThemeService`.
- **`@ngxsmk/cdk`** — low-level behaviors: `ClickOutside`, `FocusTrap`,
  `ScrollLock`, `LiveAnnouncer`, `MediaQuery`, `VisuallyHidden`,
  `IntersectionObserver`, `ResizeObserver`.
- **Animation system** — `NgxsmkAnimate` directive, `NgxsmkPresence` structural
  directive, and `playEnter`/`playExit` imperative helpers powered by
  [Motion](https://motion.dev) (optional peer dependency).
- **Signals-native architecture** — all components use `input()`, `output()`,
  `model()`, `signal()`, and `computed()`. No `zone.js` dependency.
- **Per-component secondary entry points** — import only what you use for
  optimal tree-shaking.
- **CI compatibility testing** across Angular 17.3, 18, 19, 20, 21, and 22.
- Re-exported `ngxsmk-datepicker` and `ngxsmk-tel-input` as isolated entry
  points in `@ngxsmk/core`.

### Changed

- Migrated to Angular 22, TypeScript 6.0, and `ng-packagr` 22 for the
  development workspace (published libraries remain compatible with Angular 17.3+).
- Standardized control height across all single-line inputs via
  `--ngxsmk-control-height` token (40 px).

## [1.0.0] - Initial release

### Added

- Initial release of `@ngxsmk/theme`, `@ngxsmk/cdk`, and `@ngxsmk/core`.
- Core component set with signal-based architecture.
- Design-token theming engine with light/dark mode support.

[1.3.1]: https://github.com/ngxsmk/ngxsmk-ui-kit/compare/v1.3.0...v1.3.1
[1.3.0]: https://github.com/ngxsmk/ngxsmk-ui-kit/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/ngxsmk/ngxsmk-ui-kit/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ngxsmk/ngxsmk-ui-kit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ngxsmk/ngxsmk-ui-kit/releases/tag/v1.0.0
