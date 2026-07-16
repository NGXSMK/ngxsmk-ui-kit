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
4. Run `npm run build`, `npm test`, and `npm run lint` before pushing.
5. Open a pull request against `main` with a clear description.

## Commit messages

We follow [Conventional Commits](https://www.conventionalcommits.org):

```
feat(core): add NgxsmkPresence structural directive
fix(theme): correct dark-mode surface token
docs: update theming guide
```

## Changesets

Any change to `packages/*` that users would notice needs a changeset. From the
repo root:

```bash
npm run changeset          # describe the change, pick a bump level
npm run changeset:status   # preview what would be released
```

This writes a markdown file to `.changeset/`; commit it with your PR. Docs-only
or internal-tooling changes don't need one — use `npx changeset add --empty` if
CI asks for a changeset you don't think is warranted.

The published packages are **version-locked**: bumping one bumps all five
(`core`, `cdk`, `theme`, `cli`, `mcp`), so they always share a version.

### Releasing

```bash
npm run changeset:version  # applies changesets: bumps versions + per-package CHANGELOGs
npm run publish            # builds on the Angular 17 toolchain and publishes from dist/
```

`changeset version` maintains each `packages/*/CHANGELOG.md`. The root
`CHANGELOG.md` is curated by hand as the human-readable release story — update it
alongside a release. Do **not** run `changeset publish`: releases go through
`tools/scripts/publish.mjs`, which compiles in partial-Ivy mode against the
lowest supported Angular and publishes the `dist/ngxsmk/*` output rather than
the source packages.

## Coding standards

- **Linting** is enforced by ESLint (`eslint.config.js`) with Angular,
  TypeScript, and accessibility rules. Run `npm run lint` to check.
- **Formatting** is enforced by Prettier (`.prettierrc`) and EditorConfig
  (`.editorconfig`). Run `npm run format` or your editor's format-on-save.
- Prefer deep imports (`@ngxsmk/core/button`) over the barrel in library and app
  code to preserve tree-shaking.
- Honor `prefers-reduced-motion` in any new animation work.

## Reporting issues

Open an issue with a minimal reproduction (StackBlitz or a demo route) and the
expected vs. actual behavior.

## Code of conduct

Be respectful and constructive. By participating you agree to uphold a welcoming,
harassment-free community.
