# @ngxsmk/core

The component library of the [NGXSMK UI kit](https://github.com/NGXSMK/ngxsmk-ui-kit):
170+ standalone, `OnPush`, signals-based components — buttons, badges, tags,
chips, cards, dividers, spinners, skeletons, alerts, progress, avatars,
form-field, inputs, checks/radios/switches, tabs, accordions, tooltips,
dialogs, toasts, and re-exported `ngxsmk-datepicker` / `ngxsmk-tel-input`.
Also exposes the `@ngxsmk/core/animation` helpers.

## Compatibility

- Angular **17.3+**
- `zone.js` optional (zoneless-friendly)

## Install

```bash
npm install @ngxsmk/core @ngxsmk/theme
```

`@ngxsmk/core` declares these **peer dependencies** (you already have them in
an Angular app):

- `@angular/common`, `@angular/core`, `@angular/forms`
- `@ngxsmk/cdk`
- `ngxsmk-datepicker`, `luxon` (datepicker)
- `ngxsmk-tel-input`, `@angular/material`, `@angular/cdk`, `intl-tel-input`,
  `libphonenumber-js` (tel input)
- `motion` (optional, lazy-loaded animations)

## Usage

```ts
import { NgxsmkButton } from '@ngxsmk/core/button';
```

Prefer deep imports (`@ngxsmk/core/button`) over the barrel (`@ngxsmk/core`)
so the bundler tree-shakes unused components.

## Building & publishing

Built with the rest of the workspace via `npm run build:libs`. The published
artifact lives in `dist/ngxsmk/core`. To publish all packages:

```bash
npm run publish
```
