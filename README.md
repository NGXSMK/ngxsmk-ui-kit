# NGXSMK UI Kit

> Angular-first open-source UI ecosystem — signals-native, zoneless, token-themed.

**Status:** v1.0 foundation (in development). The workspace, theme engine, CDK
behaviors, and the first wave of P0 components are implemented; see
[`blueprint/`](blueprint/) for the full architecture and roadmap.

## Features

- **Signals-native & zoneless** — no `zone.js` dependency; all state is signal-based.
- **Token-themed** — every component reads `var(--ngxsmk-*)` custom properties; no hard-coded colors or spacing.
- **Consistent control sizing** — all single-line inputs (input, select, number-input, combobox, input-group, power-search, multi-select) share one `--ngxsmk-control-height` token (40px) with uniform padding and typography.
- **Light / dark** — class, media, and system strategies with runtime preset switching.
- **Accessible by default** — native elements wrapped with visually-hidden inputs so `ngModel` / reactive forms just work.

## Packages

| Package | Purpose |
|---|---|
| [`@ngxsmk/theme`](packages/theme) | Universal design-token engine: `ThemeConfig` → `--ngxsmk-*` CSS custom properties, 4 presets, light/dark strategies, runtime switching via `NgxsmkThemeService`. |
| [`@ngxsmk/cdk`](packages/cdk) | Low-level behaviors: click-outside, focus trap, scroll lock, live announcer, reactive media queries, visually-hidden. |
| [`@ngxsmk/core`](packages/core) | Standalone, OnPush, signals-based components — buttons, badges, tags, chips, cards, dividers, spinners, skeletons, alerts, progress, avatars, form-field, inputs, checks/radios/switches, tabs, accordions, tooltips, dialogs, toasts, and re-exported `ngxsmk-datepicker` / `ngxsmk-tel-input`. |

## Apps

- `apps/demo` — component showcase with a dark-mode toggle and runtime theme presets.

## Getting started

```bash
npm install
npm start          # serve the demo at http://localhost:4200
npm test           # unit tests (vitest) for all packages
npm run build      # regenerate theme CSS, build all packages + demo
npm run theme:css  # regenerate packages/theme/styles/*.css from the token sources
```

## Theming & design tokens

`@ngxsmk/theme` emits a flat set of CSS custom properties (`--ngxsmk-color-*`,
`--ngxsmk-space-*`, `--ngxsmk-radius-*`, `--ngxsmk-text-*`,
`--ngxsmk-shadow-*`, …) from a `ThemeConfig`. Components consume these directly
and expose per-component override hooks (e.g. `--ngxsmk-button-bg`) on top.

Control height is centralized in the `--ngxsmk-control-height` token (default
`2.5rem` / 40px). Changing it resizes every single-line text control at once.

## Integrated third-party components

`@ngxsmk/core` re-exports two external libraries so consumers get them from one
place:

- **`ngxsmk-datepicker`** → `NgxsmkDatepicker` (peer: `luxon`)
- **`ngxsmk-tel-input`** → `NgxsmkTelInput` (peers: `@angular/material`, `@angular/cdk`, `intl-tel-input`, `libphonenumber-js`)

These peer packages are declared on `@ngxsmk/core` and installed in the workspace.

## Architecture notes

- **Tokens first.** Components never hard-code colors/spacing — everything reads `var(--ngxsmk-*)`.
- **Native elements first.** Buttons style native `<button>`/`<a>`; Dialog wraps native `<dialog>` (top layer, focus, Escape for free); form controls wrap visually-hidden native inputs.
- **Zoneless-ready.** Signal-based state throughout; no `zone.js`.
- **Packaging.** Angular Package Format via `ng-packagr`. The root `tsconfig.json` maps `@ngxsmk/*` to sources for app dev/tests; each `tsconfig.lib.json` overrides to `dist/` for `ng-packagr` builds (build `theme`/`cdk` before `core`).

## Performance & tree-shaking

The library is built to stay out of your critical path:

- **Per-component secondary entry points.** Every component ships as its own `@ngxsmk/core/<name>` entry point, so import only what you use. Prefer deep imports over the barrel:

  ```ts
  import { NgxsmkButton } from '@ngxsmk/core/button';      // ✅ tree-shaken to one component
  import { NgxsmkButton } from '@ngxsmk/core';             // ⚠ pulls the whole catalog
  ```

  `package.json` sets `"sideEffects": false`, so unused re-exports are eliminated by the bundler.
- **Signal-native + `OnPush` + zoneless.** All 150+ components use signal `input()`/`output()`/`model()`, `ChangeDetectionStrategy.OnPush`, and the demo runs without `zone.js` (`provideZonelessChangeDetection`).
- **Partial compilation.** `ng-packagr` v22 emits partially-compiled output by default; your app's Angular compiler finishes it, shrinking published bundles.
- **Lazy heavy peers.** `tel-input` (`@angular/material` + `intl-tel-input` + `libphonenumber-js`) and `datepicker` (`ngxsmk-datepicker` + `luxon`) are isolated entry points — they are only pulled in when you import those specific components.
- **Runtime themes.** Themes are generated on demand via `NgxsmkThemeService.applyTheme()`; the app ships a single base stylesheet, not every preset.

## License

MIT
