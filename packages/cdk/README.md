# @ngxsmk/cdk

Low-level, framework-agnostic Angular behaviors used by NGXSMK components:

- `ClickOutside` — detect clicks outside an element
- `FocusTrap` — trap focus within a container
- `ScrollLock` — lock/unlock page scroll
- `LiveAnnouncer` — announce messages to assistive tech
- `MediaQuery` — reactive media-query signals
- `VisuallyHidden` — visually hide content while keeping it accessible

Part of the [NGXSMK UI kit](https://github.com/NGXSMK/ngxsmk-ui-kit).

## Compatibility

- Angular **17.3+**
- `zone.js` optional (zoneless-friendly)

## Install

```bash
npm install @ngxsmk/cdk
```

`@ngxsmk/cdk` depends only on `@angular/core` and `@angular/common`.

## Usage

```ts
import { ClickOutside } from '@ngxsmk/cdk/click-outside';
```

Prefer deep entry-point imports (e.g. `@ngxsmk/cdk/click-outside`) so the
bundler tree-shakes unused behaviors.

## Building & publishing

Built with the rest of the workspace via `npm run build:libs`. The published
artifact lives in `dist/ngxsmk/cdk`. To publish all packages:

```bash
npm run publish
```
