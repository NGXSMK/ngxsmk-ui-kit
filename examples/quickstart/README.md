# NGXSMK quickstart

The smallest useful NGXSMK app: zoneless Angular, one stylesheet, a handful of
components (`button`, `card`, `form-field` + `input`, `dialog`, `switch`,
layout primitives) and runtime dark mode.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/NGXSMK/ngxsmk-ui-kit/tree/main/examples/quickstart?file=src%2Fapp%2Fapp.ts)

## Run locally

```bash
npm install
npm start
```

## What to look at

- `angular.json` `styles` — loads `@ngxsmk/theme/styles/ngxsmk.css` plus the
  directive styles for `button` / `input` (native-element attribute APIs).
- `src/main.ts` — `provideZonelessChangeDetection()`; there is no `zone.js`.
- `src/app/app.ts` — every component is imported from its own secondary entry
  point (`@ngxsmk/core/button`, `@ngxsmk/core/card`, …) so only what you use is
  bundled. Inputs are signals; `[(open)]` and `[(ngModel)]` just work.
- Dark mode is the `dark` class on `<html>`, toggled through
  `NgxsmkThemeService` from `@ngxsmk/theme`.

Next steps: browse the [live demo](https://ngxsmk.github.io/ngxsmk-ui-kit),
the [component API reference](https://ngxsmk.github.io/ngxsmk-ui-kit/api), or
run `ng add @ngxsmk/core` in an existing project.
