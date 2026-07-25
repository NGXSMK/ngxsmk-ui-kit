# @ngxsmk/theme

## 2.1.0

### Minor Changes

- 0c2b5ad: Ionic support and Angular 17+ packaging fixes.

  **Fixed — packaging bugs that broke real consumers.** These were invisible in
  the repo (the lockfile masked them) and only surfaced once the packed tarballs
  were installed into a fresh app:

  - `@angular/cdk` was imported by `@ngxsmk/core/select` but never declared as a
    peer dependency. It is now declared.
  - `qrcode-generator` was imported by `@ngxsmk/core/qr-code` but never declared
    as a peer dependency. It is now declared.
  - The `ngxsmk-datepicker` peer range is narrowed to `>=2.3.1 <2.4.0`.
    `ngxsmk-datepicker@2.4.0` dropped the `"."` entry from its `exports` map,
    which makes `@ngxsmk/core/datepicker` — a bare `export * from
'ngxsmk-datepicker'` — unresolvable for anyone who installs it.
  - `@angular/material` is declared as an optional peer, documenting that
    `ngxsmk-tel-input` imports `@angular/material/form-field` unconditionally
    despite marking it optional itself.

  **Added — Ionic integration.**

  - `@ngxsmk/core/ionic`: `provideNgxsmkIonic()` wires the Ionic platform
    adapter, the Ionic button renderer, and a safe-area bridge in one call.
  - `@ngxsmk/cdk/platform`: `NGXSMK_PLATFORM_ADAPTER` abstracts which element
    scrolls and where overlays attach. `NgxsmkScrollLock` now locks the element
    the adapter names instead of always locking `document.body` — previously a
    silent no-op under Ionic, which scrolls inside `ion-content`. The imperative
    dialog services attach to the adapter's overlay container so overlays land
    inside `ion-app`'s stacking context.
  - `ionicVarsAdapter` is now complete: the six-variable set for all nine Ionic
    color roles, the `--ion-color-step-50`…`-950` ladder Ionic derives its
    neutrals from, surface variables, and a real dark-mode block. Previously it
    emitted a light-only `:root` block with no step ladder, so Ionic dark mode
    received no tokens at all.
  - Safe-area tokens (`--ngxsmk-safe-area-*`) backed by `env(safe-area-inset-*)`,
    applied to the toast, sheet, mobile-nav, and top-nav mega-menu.

  **Changed — `ButtonRenderer`.** `applyVariant`, `applyIconOnly`, and
  `applyDisabled` are removed. The button directive never called them; variant,
  size, and disabled state are reflected through host bindings. `IonicButtonRenderer`
  previously implemented all five methods as empty bodies; it now renders a real
  `<ion-spinner>`.

  Renderer selection moves to `NGXSMK_BUTTON_RENDERER_CLASS`, a root-level token.
  `NGXSMK_BUTTON_RENDERER` is provided by the button directive itself, and a
  directive's own providers shadow environment providers — so it could not be
  overridden from `bootstrapApplication` at all. A node-level
  `NGXSMK_BUTTON_RENDERER` provider still wins for a single subtree.

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
