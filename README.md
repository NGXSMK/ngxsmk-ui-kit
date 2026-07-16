<div align="center">

<img src="apps/demo/public/favicon.svg" alt="NGXSMK logo" width="72" height="72" />

# NGXSMK — The Open-Source Angular UI Kit

**170+ free Angular components. Signals-native. Zoneless. Token-themed. Dark mode built in.**

The modern Angular component library & design system for Angular 17.3 → 22 —
forms, data tables, charts, AI chat UI, and enterprise widgets that ship as
tree-shakable standalone components.

[![npm version](https://img.shields.io/npm/v/@ngxsmk/core?label=npm&color=blue)](https://www.npmjs.com/package/@ngxsmk/core)
[![npm downloads](https://img.shields.io/npm/dm/@ngxsmk/core?color=blue)](https://www.npmjs.com/package/@ngxsmk/core)
[![CI](https://github.com/NGXSMK/ngxsmk-ui-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/NGXSMK/ngxsmk-ui-kit/actions/workflows/ci.yml)
[![Angular compatibility](https://github.com/NGXSMK/ngxsmk-ui-kit/actions/workflows/compatibility.yml/badge.svg)](https://github.com/NGXSMK/ngxsmk-ui-kit/actions/workflows/compatibility.yml)
[![Angular](https://img.shields.io/badge/Angular-17.3%20→%2022-dd0031?logo=angular&logoColor=white)](https://angular.dev)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/NGXSMK/ngxsmk-ui-kit?style=social)](https://github.com/NGXSMK/ngxsmk-ui-kit/stargazers)

[**Live Demo**](https://ngxsmk.dev) · [**Component Explorer**](https://ngxsmk.dev/showcase/explorer) · [**Theme Playground**](https://ngxsmk.dev/playground) · [Report a Bug](https://github.com/NGXSMK/ngxsmk-ui-kit/issues) · [Request a Feature](https://github.com/NGXSMK/ngxsmk-ui-kit/issues)

</div>

---

```bash
npm install @ngxsmk/core @ngxsmk/theme
```

```ts
import { NgxsmkButton } from '@ngxsmk/core/button';

@Component({
  selector: 'app-root',
  imports: [NgxsmkButton],
  template: `<button ngxsmk-button variant="primary">Get started</button>`,
})
export class App {}
```

That's it — no `zone.js`, no global module, no CSS framework required.

## Why NGXSMK?

Most Angular UI libraries were designed before signals, standalone components,
and zoneless change detection existed. NGXSMK was built **after** — every one of
its 170+ components is a standalone, `OnPush`, signal-based component
(`input()`, `output()`, `model()`) that reads design tokens from CSS custom
properties. The result: instant runtime theming, minimal bundles, and an API
that feels like modern Angular instead of fighting it.

- ⚡ **Signals-native & zoneless** — no `zone.js` dependency; works in zone-based _and_ zoneless apps.
- 🎨 **Design-token theming** — every component reads `var(--ngxsmk-*)`; switch themes and dark mode at runtime with zero flash.
- 🌗 **Light / dark / system** — class, media, and system strategies with 4 built-in presets (`emerald`, `violet`, `neutral`, `rose`).
- 📊 **Charts built in** — 8 token-themed chart components (bar, line, area, pie/donut, scatter, heatmap, candlestick, dashboard) — no external charting library.
- 🤖 **AI & chat UI** — chat windows, streaming text, reasoning timelines, agent cards, voice input: the building blocks for LLM apps in Angular.
- 🏢 **Enterprise widgets** — kanban board, scheduler, Gantt timeline, spreadsheet, pivot table, org chart, workflow & rule builders.
- ♿ **Accessible by default** — WCAG 2.1 AA target: native form primitives, focus management, ARIA patterns, `prefers-reduced-motion`.
- 🌲 **Tree-shakable** — a secondary entry point per component (`@ngxsmk/core/button`); import only what you use.
- 🧰 **Batteries included** — SEO service, i18n-friendly primitives, animation helpers, CLI with `ng add`.
- 🆓 **MIT licensed** — free for personal and commercial use, forever.

**Try everything live at [ngxsmk.dev](https://ngxsmk.dev)** — including a
[visual theme editor](https://ngxsmk.dev/playground) that exports your brand
theme as CSS variables, SCSS, Tailwind config, StyleX tokens, or Tokens Studio
JSON for Figma.

## How does NGXSMK compare?

<!-- prettier-ignore -->
| Capability | NGXSMK | Angular Material | PrimeNG |
| --- | :-: | :-: | :-: |
| Signals-first component API (`input()` / `model()`) | ✅ | Partial | Partial |
| Designed zoneless-first (no `zone.js` assumptions) | ✅ | Works | Works |
| Runtime theme switching via CSS design tokens | ✅ | Partial | ✅ |
| Built-in charts (no third-party chart lib) | ✅ 8 types | ❌ | Wrapper (Chart.js) |
| AI / chat / LLM UI components | ✅ | ❌ | ❌ |
| Enterprise widgets (kanban, Gantt, spreadsheet, pivot) | ✅ | ❌ | Partial |
| Per-component tree-shakable entry points | ✅ | ✅ | ✅ |
| Visual theme builder with multi-format export | ✅ | ❌ | ✅ |
| License | MIT | MIT | MIT (core) |

_Angular Material and PrimeNG are excellent libraries — the table highlights
scope differences so you can pick the right tool. NGXSMK aims to be the
all-in-one kit for signal-native, zoneless Angular apps._

## Table of contents

- [Quick start](#quick-start)
- [Features](#features)
- [Packages](#packages)
- [Components](#components)
- [Theming & design tokens](#theming--design-tokens)
- [Animations](#animations)
- [SEO utilities](#seo-utilities)
- [CLI & schematics](#cli--schematics)
- [Accessibility](#accessibility)
- [Performance & tree-shaking](#performance--tree-shaking)
- [Integrated third-party components](#integrated-third-party-components)
- [FAQ](#faq)
- [Development](#development)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

## Angular version support

The source targets Angular **17.3** as the minimum (signal `input`/`model` and
signal `viewChild`/`contentChild` queries). It uses no Angular 18+/19+/20+-only
runtime APIs, so the same components run on **17.3, 18, 19, 20, 21, and 22**.
The demo app additionally uses zoneless change detection
(`provideZonelessChangeDetection`), which needs Angular 18+.

> **Verified in CI:** all three publishable packages (`@ngxsmk/theme`,
> `@ngxsmk/cdk`, `@ngxsmk/core`) are compiled against every supported major
> (`.github/workflows/compatibility.yml`). Peer dependencies are declared as
> `>=17.3.0`.

## Quick start

### 1. Install

```bash
npm install @ngxsmk/core @ngxsmk/theme
```

Or let the schematic wire everything for you:

```bash
ng add @ngxsmk/core
```

**Requirements:** Angular **17.3+**, Node **20+**, TypeScript **5.x+**.

### 2. Load the base styles

In your global stylesheet (or `angular.json` `styles`):

```scss
@import '@ngxsmk/theme/styles/ngxsmk.css';
```

This ships a single base stylesheet — themes are generated on demand at runtime.

### 3. (Optional) Go zoneless

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

### 4. Use a component

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

### Peer dependencies

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
(`@ngxsmk/core/<name>`). Import only what you use, and browse them all in the
[live component explorer](https://ngxsmk.dev/showcase/explorer).

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

## Integrated third-party components

`@ngxsmk/core` re-exports two external libraries so consumers get them from one
place (each is an isolated, lazy entry point):

- **`ngxsmk-datepicker`** → `NgxsmkDatepicker` (peer: `luxon`)
- **`ngxsmk-tel-input`** → `NgxsmkTelInput` (peers: `@angular/material`, `@angular/cdk`, `intl-tel-input`, `libphonenumber-js`)

They are only pulled into your bundle when you import those specific components.

## FAQ

<details>
<summary><b>Is NGXSMK free for commercial projects?</b></summary>

Yes. NGXSMK is MIT-licensed — free for personal, open-source, and commercial
use with no paid tiers or license keys.

</details>

<details>
<summary><b>Which Angular versions are supported?</b></summary>

Angular **17.3 through 22**. The packages are compiled against every supported
major in CI. The zoneless demo app targets Angular 18+, but the libraries
themselves work in zone-based Angular 17.3 apps too.

</details>

<details>
<summary><b>Do I need zone.js?</b></summary>

No. NGXSMK components are signal-based and zoneless-first — they work with
`provideZonelessChangeDetection()` and in classic zone-based apps alike.

</details>

<details>
<summary><b>How is NGXSMK different from Angular Material or PrimeNG?</b></summary>

NGXSMK is built signals-first for modern Angular, themes exclusively through
CSS design tokens, and bundles categories the others leave to third parties:
charts, AI/chat UI, and enterprise widgets like kanban boards, Gantt timelines,
spreadsheets, and pivot tables. See the [comparison table](#how-does-ngxsmk-compare).

</details>

<details>
<summary><b>Can I use my own brand theme?</b></summary>

Yes — pass a custom `ThemeConfig` (brand color, radius, typography, token
overrides) to `NgxsmkThemeService`, or design it visually in the
[theme playground](https://ngxsmk.dev/playground) and export CSS variables,
SCSS, Tailwind config, StyleX tokens, or Tokens Studio JSON.

</details>

<details>
<summary><b>Does it work with Tailwind CSS?</b></summary>

Yes. NGXSMK styles itself through `--ngxsmk-*` custom properties and doesn't
impose a global CSS reset, so it coexists with Tailwind utilities — and the
theme playground can export your token set as a Tailwind config.

</details>

<details>
<summary><b>Is server-side rendering (SSR) supported?</b></summary>

SSR/Angular Universal compatibility is on the [roadmap](#roadmap). The
components use native DOM APIs behind Angular abstractions where possible; full
SSR verification is planned.

</details>

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

Found a bug or have an idea?
[Open an issue](https://github.com/NGXSMK/ngxsmk-ui-kit/issues) — every report
makes the kit better.

## Support the project

If NGXSMK saves you time, **[star the repository](https://github.com/NGXSMK/ngxsmk-ui-kit)** ⭐ —
stars are the main way other Angular developers discover open-source projects
like this one. Sharing the [live demo](https://ngxsmk.dev) with your team helps
too.

[![GitHub stars](https://img.shields.io/github/stars/NGXSMK/ngxsmk-ui-kit?style=for-the-badge&logo=github&label=Star%20on%20GitHub&color=7c3aed)](https://github.com/NGXSMK/ngxsmk-ui-kit/stargazers)
[![Follow the star history](https://img.shields.io/badge/📈-Star%20history-2694fe?style=for-the-badge)](https://star-history.com/#NGXSMK/ngxsmk-ui-kit&Date)

## License

[MIT](./LICENSE) © NGXSMK contributors.

---

<div align="center">

**NGXSMK** — Angular UI kit · Angular component library · Angular design system ·
signals · zoneless · dark mode · design tokens · charts · AI chat UI · enterprise components

Made with ❤️ for the Angular community

</div>
