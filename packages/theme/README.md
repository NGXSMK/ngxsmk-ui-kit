# @ngxsmk/theme

The design-token engine of the [NGXSMK UI kit](https://ngxsmk.github.io/ngxsmk-ui-kit) ([WhatsApp Channel](https://whatsapp.com/channel/0029Vb8PWpz1XquUOnGPUM2p)). A `ThemeConfig` maps to a flat set of `--ngxsmk-*` CSS custom properties that every `@ngxsmk/core` component reads. Ships 4 presets, light/dark/system strategies, and runtime theme switching via `NgxsmkThemeService`.

## Compatibility

- Angular **17.3+**
- `zone.js` optional (zoneless-friendly)

## Install

```bash
npm install @ngxsmk/theme
```

`@ngxsmk/theme` depends only on `@angular/core` and `@angular/common`.

## Usage

### 1. Load the base stylesheet

In your global stylesheet or `angular.json` `styles`:

```scss
@import '@ngxsmk/theme/styles/ngxsmk.css';
```

This ships a single base stylesheet for the default (emerald) preset. Themes are generated on demand at runtime, so you never ship every preset.

### 2. Apply a theme

```ts
import { NgxsmkThemeService, emeraldPreset } from '@ngxsmk/theme';

constructor(private theme: NgxsmkThemeService) {}

ngOnInit() {
  this.theme.applyTheme(emeraldPreset); // emerald | violet | neutral | rose
  this.theme.setMode('dark');           // 'light' | 'dark' | 'system'
}
```

## Presets

| Preset    | Primary color       |
| --------- | ------------------- |
| `emerald` | `#059669` (default) |
| `violet`  | `#7C3AED`           |
| `neutral` | `#18181B`           |
| `rose`    | `#E11D48`           |

Presets are plain `ThemeConfig` objects exported from the package, so you can spread and override any of them.

## Token model

`ThemeConfig` drives a full token set:

- **Color** — `brand` (primary/secondary, with a derived 50–950 scale), `neutral`, and `semantic` (success / warning / error / info).
- **Radius** — global `borderRadius` (`none` / `sm` / `md` / `lg` / `xl`) plus per-corner tokens.
- **Typography** — font families and a Material-inspired display / headline / title / body / label scale.
- **Layout** — spacing, shadow, duration, easing, and a shared `z-index` ladder that overlays must respect.
- **Chart palette** — `--ngxsmk-chart-1` … `--ngxsmk-chart-8`, a fixed 8-hue categorical set (stepped per mode) that the `@ngxsmk/core` charts use for series colors. Independent of the brand hue so adjacent series stay distinguishable; override any slot to rebrand series.

### Chart series colors

Charts read the categorical palette from CSS custom properties at render time, so overriding a slot re-colors every chart — no component input needed:

```css
:root {
  --ngxsmk-chart-1: #2563eb;
  --ngxsmk-chart-2: #db2777;
}
```

## Custom themes

Pass any `ThemeConfig` to `applyTheme` — set a brand color and the engine derives the full scale:

```ts
this.theme.applyTheme({
  name: 'brand',
  brand: { primary: '#0EA5E9' },
  borderRadius: 'lg',
});
```

Per-mode token overrides are supported via the `overrides: { light, dark }` field for fine control in light and dark modes.

## Tree-shaking & deep imports

Prefer deep entry points (e.g. `@ngxsmk/theme/styles/ngxsmk.css`) and import only what you use. The package is side-effect-free except for its stylesheets.
