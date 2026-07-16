# @ngxsmk/theme

## 1.3.1

### Patch Changes

- Keyboard navigation, unified focus rings, and dark-mode fixes.

  **Added**

  - Keyboard navigation for the typeahead/select family — `autocomplete`, `combobox`, `multi-select`, and `multi-selector` now support arrow keys (with wrap-around), `Home`/`End`, `Enter` to select, and `Escape` to close, matching `select`. Includes `aria-activedescendant` wiring and `role="listbox"`/`role="option"` semantics.
  - Interaction and sizing tokens: `--ngxsmk-focus-ring` / `--ngxsmk-focus-ring-error`, `--ngxsmk-opacity-{disabled,muted,faint}`, `--ngxsmk-icon-{sm,md,lg}`, `--ngxsmk-control-height-{sm,md,lg}`, `--ngxsmk-tracking-{tight,normal,wide}`, `--ngxsmk-hover-lift`, and `--ngxsmk-press-scale`.

  **Changed**

  - Every component now renders its focus ring from `var(--ngxsmk-focus-ring)` instead of three competing ad-hoc patterns.
  - Refined elevation scale — shadows gain a hairline contact layer so surfaces read crisply against white.
  - `@ngxsmk/cdk`'s main barrel no longer re-exports `@ngxsmk/cdk/testing`, keeping `axe-core` (a CommonJS dependency) out of runtime bundles. Import test helpers from `@ngxsmk/cdk/testing` directly.

  **Fixed**

  - `prefers-reduced-motion` now suppresses all token-driven motion. The generated stylesheet previously zeroed only `--ngxsmk-motion-duration` while components animate with `--ngxsmk-duration-*` directly. A `.ngxsmk-reduce-motion` class offers the same as an app-level opt-in.
  - Dark-mode color regressions in 14 components that hardcoded light-only hex fallbacks (e.g. `var(--ngxsmk-color-surface, #ffffff)`).
  - `meter` referenced a non-existent `--ngxsmk-color-danger` token; it now uses `--ngxsmk-color-error`.
  - Disabled states used seven different opacity literals; all now use `--ngxsmk-opacity-disabled`.
  - `chart-pie` defaults to non-responsive so `size` controls the diameter.
