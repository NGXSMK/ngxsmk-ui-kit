# Component tiers

Not every entry point in `@ngxsmk/core` is at the same maturity. Use this
list when deciding what to depend on in production, where to spend review
budget, and what to treat as still evolving.

| Tier             | Meaning                                                                                         |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| **Core**         | Hardened primitives. Prefer these for new apps. Smoke-tested; API changes are rare and versioned. |
| **Extended**     | Production-ready for their domain, but narrower audience (charts, AI/chat, media).                |
| **Experimental** | Useful today; APIs and behaviour may still move. Pin versions; prefer Core alternatives when possible. |

Every name below is a secondary entry point: `@ngxsmk/core/<name>`.

## Core

Forms, actions, layout, navigation, overlays, and feedback — the surface most
apps need day one.

- **Forms** — `input`, `textarea`, `select`, `multi-select`, `combobox`, `autocomplete`, `checkbox`, `radio`, `switch`, `form-field`, `slider`, `rating`, `segmented-control`, `otp-input`, `number-input`, `pin-input`, `input-group`
- **Actions** — `button`, `button-group`, `fab`, `split-button`, `link`, `toggle-button`, `toggle-button-group`
- **Layout** — `card`, `stack`, `h-stack`, `container`, `grid`, `flex`, `center`, `spacer`, `divider`, `aspect-ratio`, `section`, `app-shell`, `side-nav`, `sheet`, `resizable`
- **Navigation** — `tabs`, `pagination`, `breadcrumb`, `breadcrumb-item`, `dropdown-menu`, `context-menu`, `top-nav`, `mobile-nav`, `command-palette`
- **Overlays** — `dialog`, `alert-dialog`, `tooltip`, `popover`, `hover-card`
- **Feedback** — `alert`, `banner`, `toast`, `skeleton`, `spinner`, `progress`, `empty-state`, `badge`, `status-dot`
- **Data display** — `avatar`, `table`, `list`, `list-item`, `accordion`, `stat`, `tag`, `chip`, `chip-group`
- **Utilities** — `copy-to-clipboard`, `visually-hidden`, `focus-trap`, `click-outside`, `scroll-lock`, `media-query`, `seo`, `animation`

Re-exports that need their own peers (still Core quality, install peers only if used):

- `datepicker` → `ngxsmk-datepicker` + `luxon`
- `tel-input` → `ngxsmk-tel-input` + related peers (see [@ngxsmk/core README](../packages/core/README.md))

## Extended

Domain kits that are polished but not every app will import.

- **Charts** — `chart-bar`, `chart-line`, `chart-area`, `chart-pie`, `chart-scatter`, `chart-heatmap`, `chart-candlestick`, `chart-dashboard`, `sparkline`, `gauge`
- **AI & chat** — `ai-chat`, `chat-window`, `chat-message`, `chat-input`, `chat-layout`, `agent-card`, `reasoning-timeline`, `streaming-text`, `voice-input`, `prompt-input`, `prompt-library`, `token-counter`
- **Media** — `audio-player`, `carousel`, `image-viewer`, `lightbox`, `qr-code`, `compare-image`
- **Content** — `markdown`, `code-block`, `code-editor`, `json-viewer`, `diff-viewer`, `terminal`, `citation`
- **Data** — `data-table`, `tree-view`, `tree-select`, `virtual-scroll`, `filter-builder`, `query-builder`

## Experimental

Large surface area or still-settling APIs. Smoke-tested to mount; treat as
opt-in and watch changelogs before upgrading.

- **Enterprise boards** — `kanban-board`, `scheduler`, `spreadsheet`, `pivot-table`, `org-chart`, `timeline-gantt`, `workflow-builder`, `flow-editor`, `diagram-builder`, `rule-builder`
- **Complex nav / chrome** — `menubar`, `tab-menu`, `top-nav-mega-menu`, `notification-center`, `power-search`
- **Specialized forms** — `credit-card-input`, `rich-text-editor`, `image-cropper`, `file-tree`
- **Misc** — `morph-modal`, `pull-to-refresh`, `audio-visualizer`, `memory-viewer`, `tool-call-viewer`

## How tiers are maintained

- **Core** entries should keep a dedicated behaviour spec (or expand beyond the
  generated `*.smoke.spec.ts`).
- **Extended / Experimental** ship with the generated smoke harness
  (`npm run test:smoke:gen`) as a floor; deeper tests land as the API hardens.
- Promoting an entry (Experimental → Extended → Core) is a docs + changelog
  decision — no code move required; update this file and mention it in the
  release notes.
