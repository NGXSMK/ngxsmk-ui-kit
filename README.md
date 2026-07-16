# NGXSMK UI Kit

[![Angular](https://img.shields.io/badge/Angular-17.3%2B-dd0031?logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.x-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-20%2B-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![npm @ngxsmk/core](https://img.shields.io/badge/npm-%40ngxsmk%2Fcore-blue)](https://www.npmjs.com/package/@ngxsmk/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)

> **v1.3.1 · Signals-native · Zoneless** — an Angular-first, open-source UI ecosystem, signals-native, zoneless, and token-themed.

## Table of contents

- [Features](#features)
- [Packages](#packages)
- [Components](#components)
- [SEO utilities](#seo-utilities)
- [Installation](#installation)
- [Quick start](#quick-start)
- [Theming & design tokens](#theming--design-tokens)
- [Animations](#animations)
- [CLI & schematics](#cli--schematics)
- [Accessibility](#accessibility)
- [Performance & tree-shaking](#performance--tree-shaking)
- [Integrated third-party components](#integrated-third-party-components)
- [Development](#development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

NGXSMK is a component library for modern Angular (**v17.3+**). Every component is a
standalone, `OnPush`, signal-based component that reads design tokens from CSS
custom properties, so theming is instant and bundle size stays minimal. No
`zone.js` required — it works with both zone-based and zoneless apps.

> **Angular version note:** the source targets Angular **17.3** as the minimum
> (signal `input`/`model` and signal `viewChild`/`contentChild` queries). It uses
> no Angular 18+/19+/20+‑only runtime APIs, so the same components run on 17.3,
> 18, 19, 20, 21, and 22. The demo app in this repo additionally uses
> zoneless change detection (`provideZonelessChangeDetection`), which needs
> Angular 18+ (stable in 19), so the demo itself targets 18+.
>
> **Verified:** all three publishable packages (`@ngxsmk/theme`, `@ngxsmk/cdk`,
> `@ngxsmk/core`) are compiled against every supported major in CI
> (`.github/workflows/compatibility.yml`) — the libraries build cleanly on
> Angular 17.3. Peer dependencies are declared as `>=17.3.0`.

---

## Status

Stable. The `1.3.1` release ships the full component catalog, the token theme
engine, CDK behaviors, and the animation helpers. The workspace, theme engine,
and CDK are implemented and supported on Angular **17.3+** (see the
version note above).

## Features

- **Signals-native & zoneless** — no `zone.js` dependency; all state is signal-based (`input()`, `output()`, `model()`).
- **Token-themed** — every component reads `var(--ngxsmk-*)` custom properties; no hard-coded colors or spacing.
- **Consistent control sizing** — all single-line inputs (input, select, number-input, combobox, input-group, power-search, multi-select) share one `--ngxsmk-control-height` token (40px) with uniform padding and typography.
- **Light / dark** — class, media, and system strategies with runtime preset switching.
- **Accessible by default** — native elements wrapped with visually-hidden inputs so `ngModel` / reactive forms just work, plus focus management, live announcer, and ARIA wiring.
- **Motion-ready** — optional first-class animations via [Motion](https://motion.dev) (`motion` is an optional peer dependency), with `prefers-reduced-motion` honored automatically.
- **Charts built in** — eight token-themed chart components (`bar`, `line`, `area`, `pie`/donut, `scatter`, `heatmap`, `candlestick`, `dashboard`) that follow the same theming and accessibility standards as every other component — no external charting library to reconcile.
- **Live theme playground** — the demo app ships a visual token editor (`/playground`): tweak colors, radius, density, and typography live, then export the result as CSS variables, SCSS, Tailwind config, StyleX tokens, or Tokens Studio JSON for Figma.
- **Tree-shakable** — per-component secondary entry points; import only what you use.
- **SEO-ready** — `NgxsmkSeoService` / `provideSeo()` manage the document title, meta description, canonical link, Open Graph & Twitter Card tags, robots directive, and JSON-LD from a single API.

## Packages

| Package                           | Purpose                                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@ngxsmk/theme`](packages/theme) | Universal design-token engine: `ThemeConfig` → `--ngxsmk-*` CSS custom properties, 4 presets, light/dark strategies, runtime switching via `NgxsmkThemeService`.                                                                                                                                                                                           |
| [`@ngxsmk/cdk`](packages/cdk)     | Low-level behaviors: click-outside, focus trap, scroll lock, live announcer, reactive media queries, visually-hidden.                                                                                                                                                                                                                                      |
| [`@ngxsmk/core`](packages/core)   | 170+ standalone, `OnPush`, signals-based components — buttons, badges, tags, chips, cards, dividers, spinners, skeletons, alerts, progress, avatars, form-field, inputs, checks/radios/switches, tabs, accordions, tooltips, dialogs, toasts, and re-exported `ngxsmk-datepicker` / `ngxsmk-tel-input`. Also exposes the `@ngxsmk/core/animation` helpers. |

## Components

A curated slice of the catalog — every name below is a deep entry point
(`@ngxsmk/core/<name>`). Import only what you use.

- **Forms & inputs** — `input`, `textarea`, `select`, `multi-select`, `combobox`, `autocomplete`, `typeahead`, `number-input`, `pin-input`, `slider`, `checkbox`, `radio`, `switch`, `form-field`, `datepicker`, `tel-input`, `tag`, `segmented-control`, `rating`, `toggle-button`
- **Buttons & actions** — `button`, `button-group`, `fab`, `split-button`, `link`
- **Layout & structure** — `card`, `stack`, `h-stack`, `v-stack`, `grid`, `flex`, `center`, `spacer`, `divider`, `aspect-ratio`, `container`, `section`, `app-shell`, `side-nav`, `sheet`, `resizable`, `layout`
- **Navigation** — `tabs`, `tab-menu`, `breadcrumb-item`, `pagination`, `top-nav`, `nav-icon`, `nav-heading-menu`, `dropdown-menu`, `context-menu`, `command-palette`, `mobile-nav`
- **Feedback & status** — `alert`, `banner`, `toast`, `skeleton`, `spinner`, `progress`, `progress-circle`, `empty-state`, `status-dot`, `badge`
- **Data display** — `avatar`, `avatar-group-overflow`, `avatar-status-dot`, `table`, `data-table`, `list`, `list-item`, `tree-view`, `accordion`, `stat`, `metadata-list`, `markdown`, `markdown-viewer`, `code`, `code-block`, `citation`, `citation-viewer`, `blockquote`, `thumbnail`, `timestamp`, `meter`
- **Overlay & popups** — `dialog`, `alert-dialog`, `tooltip`, `popover`, `hover-card`, `lightbox`
- **AI & chat** — `chat-window`, `chat-message`, `chat-message-bubble`, `chat-input`, `chat-layout`, `chat-system-message`, `chat-tokenized-text`, `chat-send-button`, `chat-composer-drawer`, `ai-chat`, `agent-card`, `reasoning-timeline`, `streaming-text`, `voice-input`
- **Charts** — `chart-bar`, `chart-line`, `chart-pie`, `chart-area`, `chart-scatter`, `chart-heatmap`, `chart-candlestick`, `chart-dashboard`
- **Enterprise & data** — `kanban-board`, `scheduler`, `workflow-builder`, `flow-editor`, `spreadsheet`, `pivot-table`, `org-chart`, `diagram-builder`, `query-builder`, `rule-builder`, `timeline-gantt`, `memory-viewer`
- **Media** — `audio-player`, `image-viewer`, `carousel`, `prompt-carousel`, `lightbox`, `qr-code`
- **Utilities & helpers** — `copy-to-clipboard`, `keyboard-shortcut`, `click-outside`, `scroll-lock`, `media-query`, `lazy-load`, `visually-hidden`, `focus-trap`, `intersection-observer`, `resize-observer`, `i18n`, `seo`, `animation` (`NgxsmkAnimate` / `NgxsmkPresence`), `let`, `hooks`, `diff-viewer`, `json-viewer`

See the live [demo app](apps/demo) for interactive examples of every component.

## SEO utilities

`NgxsmkSeoService` (from `@ngxsmk/core/seo`) keeps your app crawlable and
social-share friendly from one place. Set app-wide defaults at bootstrap with
`provideSeo()`, then update per route from a router subscription:

```ts
import { provideSeo } from '@ngxsmk/core/seo';

bootstrapApplication(App, {
  providers: [
    provideSeo({
      siteName: 'NGXSMK',
      image: 'https://example.com/og.png',
      twitterCard: 'summary_large_image',
    }),
  ],
});
```

```ts
import { NgxsmkSeoService } from '@ngxsmk/core/seo';

// inside a NavigationEnd subscription
seo.update({
  title: routeTitle,
  description: routeDescription,
  canonical: fullUrl,
  type: 'website',
  jsonLd: { '@type': 'WebSite', name: 'NGXSMK' },
});
```

> **Repo discoverability:** add GitHub **topics** (`angular`, `ui-kit`,
> `design-system`, `components`, `signals`, `zoneless`, `theming`) and set a
> social-preview image in the repository Settings — these can't be configured
> from files, so do them once in the GitHub UI.

## Installation

Install the packages you need. `@ngxsmk/core` re-exports the CDK and theme
internals, so most apps only need:

```bash
npm install @ngxsmk/core @ngxsmk/theme
```

**Requirements:** Angular **17.3+**, Node **20+**, TypeScript **5.x+** (peer
Angular packages `@angular/core`, `@angular/common`, `@angular/forms`).

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
import {
  ApplicationConfig,
  provideZonelessChangeDetection,
  withViewTransitions,
} from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), withViewTransitions()],
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
import { NgxsmkThemeService, emeraldPreset } from '@ngxsmk/theme';

constructor(private theme: NgxsmkThemeService) {}

ngOnInit() {
  // Apply a preset (emerald is the default theme shipped in ngxsmk.css)
  this.theme.applyTheme(emeraldPreset);

  // Dark mode is independent of the preset — toggle it any time
  this.theme.setMode('dark'); // 'light' | 'dark' | 'system'
}
```

You can also pass a fully custom `ThemeConfig` (any brand color, radius,
typography, or token overrides) — see the [`@ngxsmk/theme`](packages/theme)
docs for the full model.

- **Presets:** 4 built-in presets — `emerald` (default), `violet`, `neutral`, `rose`. Apply any at runtime with no flash.
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
  enter animation, and plays an exit animation _before_ detaching when its
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
  exit?: Record<string, string | number>; // target styles on leave
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

## CLI & schematics

[`@ngxsmk/cli`](packages/cli) provides an `ng add` schematic that wires the
packages and the base theme stylesheet into a new or existing Angular workspace:

```bash
ng add @ngxsmk/core
```

It installs `@ngxsmk/core` + `@ngxsmk/theme`, registers `ngxsmk.css` in your
`angular.json` styles, and sets a default preset — no manual CSS wiring
required. A standalone `ngxsmk` binary is also available for theme CSS
generation in CI.

## Accessibility

NGXSMK targets WCAG 2.1 AA:

- **Native primitives** — form controls wrap native `<input>`/`<select>` elements with visually-hidden labels, so `ngModel` / reactive forms and screen readers work without extra markup.
- **Keyboard & focus** — dialogs, sheets, and popovers trap and restore focus; menus, tabs, and comboboxes follow WAI-ARIA keyboard patterns.
- **Live regions** — the CDK `LiveAnnouncer` announces dynamic changes to assistive technology.
- **Reduced motion** — animations honor `prefers-reduced-motion` automatically (Motion jumps to the final state).
- **Semantic tokens** — status colors ship with paired foreground tokens for AA contrast in both light and dark modes.

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

This is an Nx-free Angular monorepo. To **develop/build this repo** you need
Node 20+ and Angular CLI 22. The published libraries themselves support
Angular **17.3+** (see version note above).

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

## Roadmap

- Comprehensive unit test coverage across all packages.
- ESLint integration with strict Angular and TypeScript rules.
- Storybook documentation site with interactive examples.
- Automated accessibility (a11y) auditing in CI.
- More preset themes and richer theme-editor controls (per-component tokens, advanced overrides).
- Figma component library mirroring the kit (token sync already available via the playground's Tokens Studio JSON export).
- Expanded `NgxsmkPresence`-based overlay animations (sheet, dropdown, hover-card).
- Form-field validation visuals and more input types.
- `ng add` / `ng update` schematics.
- SSR (Angular Universal) compatibility.
- i18n and RTL layout support.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for
setup, branching, and PR guidelines before opening a pull request.

## License

[MIT](./LICENSE) © NGXSMK contributors.
