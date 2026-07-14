# NGXSMK UI Kit

[![Angular](https://img.shields.io/badge/Angular-22.x-dd0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![npm @ngxsmk/core](https://img.shields.io/badge/npm-%40ngxsmk%2Fcore-blue)](https://www.npmjs.com/package/@ngxsmk/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> An Angular-first, open-source UI ecosystem — **signals-native, zoneless, and token-themed**.

NGXSMK is a component library for modern Angular (v20+). Every component is a
standalone, `OnPush`, signal-based component that reads design tokens from CSS
custom properties, so theming is instant and bundle size stays minimal. No
`zone.js` required.

---

## Status

Actively developed and usable. The workspace, theme engine, CDK behaviors, and
the full component catalog are implemented. APIs may still change before a `1.0`
stable release — see the [Roadmap](#roadmap).

## Features

- **Signals-native & zoneless** — no `zone.js` dependency; all state is signal-based (`input()`, `output()`, `model()`).
- **Token-themed** — every component reads `var(--ngxsmk-*)` custom properties; no hard-coded colors or spacing.
- **Consistent control sizing** — all single-line inputs (input, select, number-input, combobox, input-group, power-search, multi-select) share one `--ngxsmk-control-height` token (40px) with uniform padding and typography.
- **Light / dark** — class, media, and system strategies with runtime preset switching.
- **Accessible by default** — native elements wrapped with visually-hidden inputs so `ngModel` / reactive forms just work, plus focus management, live announcer, and ARIA wiring.
- **Motion-ready** — optional first-class animations via [Motion](https://motion.dev) (`motion` is an optional peer dependency), with `prefers-reduced-motion` honored automatically.
- **Tree-shakable** — per-component secondary entry points; import only what you use.

## Packages

| Package | Purpose |
|---|---|
| [`@ngxsmk/theme`](packages/theme) | Universal design-token engine: `ThemeConfig` → `--ngxsmk-*` CSS custom properties, 4 presets, light/dark strategies, runtime switching via `NgxsmkThemeService`. |
| [`@ngxsmk/cdk`](packages/cdk) | Low-level behaviors: click-outside, focus trap, scroll lock, live announcer, reactive media queries, visually-hidden. |
| [`@ngxsmk/core`](packages/core) | 170+ standalone, `OnPush`, signals-based components — buttons, badges, tags, chips, cards, dividers, spinners, skeletons, alerts, progress, avatars, form-field, inputs, checks/radios/switches, tabs, accordions, tooltips, dialogs, toasts, and re-exported `ngxsmk-datepicker` / `ngxsmk-tel-input`. Also exposes the `@ngxsmk/core/animation` helpers. |

## Installation

Install the packages you need. `@ngxsmk/core` re-exports the CDK and theme
internals, so most apps only need:

```bash
npm install @ngxsmk/core @ngxsmk/theme
```

`@ngxsmk/core` declares these **peer dependencies** (you already have the
`@angular/*` ones in any Angular app):

```bash
# Always required
npm install @angular/common @angular/core @angular/forms @ngxsmk/cdk

# Only if you use the datepicker component
npm install ngxsmk-datepicker luxon

# Only if you use the telephone input component
npm install ngxsmk-tel-input @angular/material @angular/cdk intl-tel-input libphonenumber-js

# Only if you enable animations (optional)
npm install motion
```

> `motion` is an **optional** peer — components work without it; animations are
> lazy-loaded and only pulled in when an animation actually runs.

## Quick start

### 1. Provide a zoneless environment

```ts
import { ApplicationConfig, provideZonelessChangeDetection, withViewTransitions } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    withViewTransitions(),
  ],
};
```

### 2. Load the base styles

In your global stylesheet (or `angular.json` `styles`):

```scss
@import '@ngxsmk/theme/styles/ngxsmk.css';
```

This ships a single base stylesheet — themes are generated on demand at runtime.

### 3. Use a component

```ts
import { NgxsmkButton } from '@ngxsmk/core/button';

@Component({
  selector: 'app-root',
  imports: [NgxsmkButton],
  template: `<button ngxsmk-button variant="primary">Get started</button>`,
})
export class App {}
```

> **Prefer deep imports** (`@ngxsmk/core/button`) over the barrel
> (`@ngxsmk/core`) so the bundler tree-shakes unused components.

## Theming & design tokens

`@ngxsmk/theme` emits a flat set of CSS custom properties
(`--ngxsmk-color-*`, `--ngxsmk-space-*`, `--ngxsmk-radius-*`,
`--ngxsmk-text-*`, `--ngxsmk-shadow-*`, …) from a `ThemeConfig`. Components
consume these directly and expose per-component override hooks (e.g.
`--ngxsmk-button-bg`) on top.

```ts
import { NgxsmkThemeService } from '@ngxsmk/theme';

constructor(private theme: NgxsmkThemeService) {}

ngOnInit() {
  this.theme.applyTheme({ preset: 'midnight', mode: 'dark' });
}
```

- **Presets:** 4 built-in presets; switch at runtime with no flash.
- **Modes:** `light`, `dark`, or `system` (follows `prefers-color-scheme`).
- **Control height** is centralized in `--ngxsmk-control-height` (default
  `2.5rem` / 40px). Changing it resizes every single-line text control at once.

## Animations

Animations are powered by [Motion](https://motion.dev) and are fully optional.

- **Directive:** `NgxsmkAnimate` plays an enter animation on the host element
  once rendered.

  ```html
  <div ngxsmkAnimate="enterMotion"></div>
  ```

- **Structural directive:** `NgxsmkPresence` mounts its template, plays an
  enter animation, and plays an exit animation *before* detaching when its
  `show` input flips to `false`.

  ```html
  <div *ngxsmkPresence="show: visible(); motion: motionState">…</div>
  ```

- **Imperative helpers:** `playEnter(el, state)` / `playExit(el, state)` for
  custom overlays (used internally by `dialog` and `tooltip`).

`prefers-reduced-motion` is honored automatically — Motion jumps straight to
the final state when the user prefers reduced motion.

### Motion state

Every animation is described by a `NgxsmkMotionState`:

```ts
interface NgxsmkMotionState {
  initial?: Record<string, string | number>; // starting styles, e.g. { opacity: 0, y: 8 }
  animate?: Record<string, string | number>; // target styles on enter, e.g. { opacity: 1, y: 0 }
  exit?: Record<string, string | number>;    // target styles on leave
  transition?: { duration?: number; delay?: number; easing?: string | number[] }; // seconds!
}
```

Durations are in **seconds** (consistent with Motion / WAAPI). Bind a state to
the directive:

```ts
@Component({
  template: `<div [ngxsmkAnimate]="enterMotion">…</div>`,
  imports: [NgxsmkAnimate],
})
export class Demo {
  protected readonly enterMotion: NgxsmkMotionState = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.2, easing: 'ease-out' },
  };
}
```

`NgxsmkPresence` is the structural equivalent for elements that mount/unmount
(`*ngxsmkPresence="show: open(); motion: state"`); it plays the `animate` state
on enter and the `exit` state on leave before detaching. The built-in `dialog`,
`tooltip`, and `toast` components already ship animated via these helpers.
`motion` remains an **optional** peer — animations are lazy-loaded and only
pulled in when an animation actually runs, so the library type-checks and
bundles cleanly whether or not `motion` is installed.

## Integrated third-party components

`@ngxsmk/core` re-exports two external libraries so consumers get them from one
place (each is an isolated, lazy entry point):

- **`ngxsmk-datepicker`** → `NgxsmkDatepicker` (peer: `luxon`)
- **`ngxsmk-tel-input`** → `NgxsmkTelInput` (peers: `@angular/material`, `@angular/cdk`, `intl-tel-input`, `libphonenumber-js`)

They are only pulled into your bundle when you import those specific components.

## Performance & tree-shaking

The library is built to stay out of your critical path:

- **Per-component secondary entry points.** Every component ships as its own
  `@ngxsmk/core/<name>` entry point. Prefer deep imports over the barrel.
- **`"sideEffects": false`** on every package, so unused re-exports are
  eliminated by the bundler.
- **Signal-native + `OnPush` + zoneless.** All components use signal
  `input()`/`output()`/`model()`, `ChangeDetectionStrategy.OnPush`, and the demo
  runs without `zone.js`.
- **Partial compilation.** `ng-packagr` v22 emits partially-compiled output by
  default; your app's Angular compiler finishes it, shrinking published bundles.
- **Lazy heavy peers.** `tel-input` and `datepicker` are isolated entry points.
- **Runtime themes.** Themes are generated on demand; the app ships a single
  base stylesheet, not every preset.

## Development

This is an Nx-free Angular monorepo. Requirements: Node 20+, Angular CLI 22.

```bash
npm install

npm start          # serve the demo at http://localhost:4200
npm run build      # regenerate theme CSS, build all packages + demo
npm run build:libs # build @ngxsmk/theme, @ngxsmk/cdk, @ngxsmk/core (in order)
npm run build:demo # build the showcase app
npm test           # run unit tests for all packages
npm run theme:css  # regenerate packages/theme/styles/*.css from the token sources
```

### Project structure

```
packages/
  theme/      # @ngxsmk/theme  — design-token engine
  cdk/        # @ngxsmk/cdk    — low-level behaviors
  core/       # @ngxsmk/core   — components + animation helpers
apps/
  demo/       # component showcase (dark-mode toggle + runtime presets)
tools/
  scripts/    # theme CSS generator, etc.
```

## Publishing

The root `package.json` is `private: true` (it is the workspace, not a
publishable package). To publish to npm, build and publish each package
individually:

```bash
npm run build:libs
cd dist/ngxsmk/core && npm publish --access public
cd dist/ngxsmk/theme && npm publish --access public
cd dist/ngxsmk/cdk  && npm publish --access public
```

Each package carries its own `package.json` with correctly scoped `sideEffects`
and peer dependencies.

## Roadmap

- Stabilize public APIs for a `1.0` release.
- More preset themes and a visual theme editor.
- Expanded `NgxsmkPresence`-based overlay animations (sheet, dropdown, hover-card).
- Form-field validation visuals and more input types.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for
setup, branching, and PR guidelines before opening a pull request.

## License

[MIT](./LICENSE) © NGXSMK contributors.
