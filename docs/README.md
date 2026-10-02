# NGXSMK documentation

Guides for **app developers** using `@ngxsmk/*`. For contributing to this repo, see [Contributing](../CONTRIBUTING.md).

## Getting started

- [Installation](./getting-started/installation.md) — install, peers, bootstrap
- [Migration](../MIGRATION.md) — upgrades, deprecations, CLI codemods
- [Troubleshooting](./guides/troubleshooting.md) — common setup and SSR issues

## Using the kit

- [Signals & zoneless](./architecture/signals-zoneless.md) — how reactivity works in NGXSMK
- [Accessibility](../A11Y.md) — keyboard, ARIA, focus, and the top-20 quality surface
- Theme & tokens — see [`packages/theme/README.md`](../packages/theme/README.md)
- Live demo — [ngxsmk.github.io/ngxsmk-ui-kit](https://ngxsmk.github.io/ngxsmk-ui-kit)

## Packages

| Package | Purpose |
| --- | --- |
| `@ngxsmk/core` | UI components |
| `@ngxsmk/theme` | Design tokens and theme CSS |
| `@ngxsmk/cdk` | Headless behavior primitives |
| `@ngxsmk/cli` | `ng-add`, scaffolds, theme CSS |
| `@ngxsmk/mcp` | MCP server for coding agents |

## For contributors & agents (not app users)

- [Contributing](../CONTRIBUTING.md)
- [Governance](../GOVERNANCE.md) — design-system rules enforced in CI
- [AGENTS.md](../AGENTS.md) / [CLAUDE.md](../CLAUDE.md) — coding-agent repo guidance
- [ADR: renderer seams](./adr/0001-renderer-seams-via-injection-tokens.md)
- [Security policy](../SECURITY.md)
