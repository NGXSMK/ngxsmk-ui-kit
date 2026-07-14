# @ngxsmk/theme

The design-token engine of the [NGXSMK UI kit](https://github.com/NGXSMK/ngxsmk-ui-kit).
`ThemeConfig` maps to `--ngxsmk-*` CSS custom properties, ships 4 presets with
light/dark strategies, and supports runtime theme switching via
`NgxsmkThemeService`.

## Compatibility

- Angular **17.3+**
- `zone.js` optional (zoneless-friendly)

## Install

```bash
npm install @ngxsmk/theme
```

`@ngxsmk/theme` depends only on `@angular/core` and `@angular/common`.

## Usage

```scss
@import '@ngxsmk/theme/styles/ngxsmk.css';
```

```ts
import { NgxsmkThemeService } from '@ngxsmk/theme';
```

`@ngxsmk/theme` emits a flat set of CSS custom properties that every NGXSMK
component reads — no per-component theming required.

## Building & publishing

Built with the rest of the workspace via `npm run build:libs`. The published
artifact lives in `dist/ngxsmk/theme`. To publish all packages:

```bash
npm run publish
```
