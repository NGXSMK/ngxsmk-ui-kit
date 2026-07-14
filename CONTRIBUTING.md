# Contributing to NGXSMK UI Kit

Thanks for your interest in contributing! This guide covers the workflow for
the monorepo.

## Getting started

```bash
npm install
npm start          # serve the demo at http://localhost:4200
npm run build:libs # build all packages
npm test           # run unit tests for all packages
```

## Development workflow

1. Fork the repo and create a branch off `main`:
   ```bash
   git checkout -b feat/my-change
   ```
2. Make your change. Keep components:
   - **Standalone** and `ChangeDetectionStrategy.OnPush`.
   - **Signal-based** — use `input()`, `output()`, `model()`; avoid `zone.js`.
   - **Token-themed** — read `var(--ngxsmk-*)`; never hard-code colors/spacing.
   - **Accessible** — native elements with visually-hidden inputs where relevant.
3. Add or update unit tests for the affected package.
4. Run `npm run build` and `npm test` before pushing.
5. Open a pull request against `main` with a clear description.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat(core): add NgxsmkPresence structural directive
fix(theme): correct dark-mode surface token
docs: update theming guide
```

## Coding standards

- Formatting is enforced by Prettier (`.prettierrc`) and EditorConfig
  (`.editorconfig`). Run your editor's format-on-save or `npx prettier --write`.
- Prefer deep imports (`@ngxsmk/core/button`) over the barrel in library and app
  code to preserve tree-shaking.
- Honor `prefers-reduced-motion` in any new animation work.

## Reporting issues

Open an issue with a minimal reproduction (StackBlitz or a demo route) and the
expected vs. actual behavior.

## Code of conduct

Be respectful and constructive. By participating you agree to uphold a welcoming,
harassment-free community.
