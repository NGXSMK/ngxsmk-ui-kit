# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/ngxsmk/ngxsmk-ui-kit/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/ngxsmk/ngxsmk-ui-kit/releases/tag/v1.0.0
