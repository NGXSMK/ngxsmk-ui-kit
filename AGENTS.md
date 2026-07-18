# AGENTS.md — guidance for AI coding agents

NGXSMK is an Angular-first UI kit: 150+ signals-native, zoneless, standalone
components plus a universal design-token engine. This file tells coding agents
how to work in this repo and how to generate correct code that _uses_ the
library.

## Repo layout

- `packages/core` — the component library. **One directory per component**, each
  a secondary entry point (`@ngxsmk/core/button`). Convention: single-file
  components (`button.ts` holds the class; `index.ts` re-exports it;
  `ng-package.json` marks the entry point).
- `packages/theme` — design tokens and theme engine. Theme CSS is **generated**:
  edit `packages/theme/src/lib/css.ts` (and friends), then run `npm run theme:css`.
  Never hand-edit generated CSS.
- `packages/cdk` — behavior primitives.
- `packages/mcp` — MCP server for coding agents. Its component database
  (`src/component-db.ts`) is auto-generated — do not edit by hand.
- `packages/cli` — `ngxsmk` binary (theme CSS generation for consumers).
- `apps/demo` — demo/docs app (deployed showcase).
- `tools/scripts` — build and codegen scripts.

## Commands

- Build everything: `npm run build` (theme CSS → libs → mcp → demo)
- Build libs only: `npm run build:libs`
- Tests: `npm test` (theme, cdk, core via `ng test` — Vitest)
- Regenerate theme CSS after token changes: `npm run theme:css`
- Regenerate AI docs (llms.txt, llms-full.txt, MCP component DB) after
  adding/changing component APIs: `node tools/scripts/generate-ai-docs.mjs`
- Lint/format: `npm run lint`, `npm run format`

Node >= 20 required. Note: Node 26 breaks Angular CLI 22 build/test — use
Node 20/22 LTS.

## Code conventions

- Standalone components/directives only; no NgModules.
- Signal APIs only: `input()`, `input.required()`, `model()`, `output()`,
  `computed()`, `effect()`. No decorators (`@Input`/`@Output`), no zone.js
  assumptions.
- Selectors are prefixed `ngxsmk-` (element) or `[ngxsmk-x]` (attribute, e.g.
  the button applies to native `<button>`/`<a>` for free semantics).
- Styling is token-driven via `--ngxsmk-*` CSS custom properties. Components
  must not hardcode colors/radii/spacing.
- Dark mode = `dark` class on `<html>`; tokens are overridden under
  `:root.dark` (specificity matters — third-party libs also set `--ngxsmk-*`).
- In grid layouts use `minmax(0, 1fr)` rather than `1fr` to avoid min-content
  phone overflow.
- Conventional commits enforced by commitlint; changesets for versioning.

## Adding a new component

1. Create `packages/core/<name>/` with `<name>.ts`, `index.ts`,
   `ng-package.json` (copy an existing sibling like `button` as a template).
2. Add a JSDoc summary + usage snippet above the `@Component`/`@Directive` —
   this is extracted into llms.txt and the MCP database.
3. Add styles/tokens in `packages/theme` and run `npm run theme:css`.
4. Add a demo page in `apps/demo`.
5. Run `node tools/scripts/generate-ai-docs.mjs`.

## AI consumption surfaces

- `llms.txt` / `llms-full.txt` (repo root, also served by the demo site) —
  generated component index/API reference for LLMs.
- `@ngxsmk/mcp` — stdio MCP server with `ngxsmk_search_components`,
  `ngxsmk_explain_api`, `ngxsmk_recommend_layout`. Build: `npm run build:mcp`;
  run: `npm run start:mcp`. Consumers run it via `npx -y @ngxsmk/mcp`; in this
  repo it is preconfigured via the root `.mcp.json`. `packages/mcp/server.json`
  is the MCP registry manifest (name `io.github.ngxsmk/ngxsmk-mcp`).
- `.claude/skills/using-ngxsmk` — the canonical Claude Code skill. A copy is
  synced into `plugins/ngxsmk/skills/` by `generate-ai-docs.mjs` — edit only
  the `.claude/skills` original.
- Claude Code plugin — `.claude-plugin/marketplace.json` (repo root) exposes
  `plugins/ngxsmk` (skill + MCP server). Install:
  `/plugin marketplace add NGXSMK/ngxsmk-ui-kit`, then
  `/plugin install ngxsmk@ngxsmk`. Version fields are stamped from the root
  `package.json` by `generate-ai-docs.mjs`.
