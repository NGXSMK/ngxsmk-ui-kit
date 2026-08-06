# @ngxsmk/core

The component library of the [NGXSMK UI kit](https://ngxsmk.github.io/ngxsmk-ui-kit): 170+ standalone, `OnPush`, signals-based components — forms, navigation, data display, overlays, AI/chat, charts, and enterprise widgets. Also exposes animation helpers (`@ngxsmk/core/animation`) and an SEO service (`@ngxsmk/core/seo`).

## Compatibility

- Angular **17.3+**
- `zone.js` optional (zoneless-friendly)

## Install

```bash
npm install @ngxsmk/core @ngxsmk/theme
```

Peer dependencies (already present in any Angular app):

- `@angular/common`, `@angular/core`, `@angular/forms`, `@ngxsmk/cdk`
- `ngxsmk-datepicker`, `luxon` (datepicker component)
- `ngxsmk-tel-input`, `@angular/material`, `@angular/cdk`, `intl-tel-input`, `libphonenumber-js` (tel input)
- `motion` (optional — lazy-loaded animations)

## Quick start

```ts
import { NgxsmkButton } from '@ngxsmk/core/button';

@Component({
  selector: 'app-root',
  imports: [NgxsmkButton],
  template: `<button ngxsmk-button variant="primary">Get started</button>`,
})
export class App {}
```

Load the base theme once (see [`@ngxsmk/theme`](../theme)):

```scss
@import '@ngxsmk/theme/styles/ngxsmk.css';
```

## Component categories

- **Forms & inputs** — `input`, `textarea`, `select`, `multi-select`, `combobox`, `autocomplete`, `checkbox`, `radio`, `switch`, `form-field`, `datepicker`, `tel-input`, `slider`, `rating`
- **Buttons & actions** — `button`, `button-group`, `fab`, `split-button`, `link`
- **Layout** — `card`, `stack`, `grid`, `flex`, `divider`, `aspect-ratio`, `app-shell`, `side-nav`, `sheet`
- **Navigation** — `tabs`, `tab-menu`, `pagination`, `dropdown-menu`, `context-menu`, `command-palette`
- **Feedback** — `alert`, `banner`, `toast`, `skeleton`, `spinner`, `progress`, `empty-state`, `badge`
- **Data display** — `avatar`, `table`, `data-table`, `list`, `tree-view`, `accordion`, `markdown`, `code-block`, `citation`
- **Overlay** — `dialog`, `alert-dialog`, `tooltip`, `popover`, `hover-card`, `lightbox`
- **AI & chat** — `chat-window`, `chat-message`, `chat-input`, `ai-chat`, `agent-card`, `reasoning-timeline`, `streaming-text`
- **Charts** — `chart-bar`, `chart-line`, `chart-pie`, `chart-area`, `chart-scatter`, `chart-heatmap`
- **Enterprise** — `kanban-board`, `scheduler`, `workflow-builder`, `spreadsheet`, `pivot-table`, `org-chart`
- **Utilities** — `copy-to-clipboard`, `seo`, `animation`, `i18n`

See the [live demo](https://ngxsmk.github.io/ngxsmk-ui-kit) for examples of every component or join our [WhatsApp Channel](https://whatsapp.com/channel/0029Vb8PWpz1XquUOnGPUM2p) for updates.

## Tree-shaking

Prefer deep imports (`@ngxsmk/core/button`) over the barrel (`@ngxsmk/core`) so the bundler tree-shakes unused components. Every component is its own secondary entry point and the package is marked side-effect-free.
