# @ngxsmk/cli

Command line utilities, Angular schematics, and automated migration codemods for the **NGXSMK** UI ecosystem.

---

## Installation & Usage

```bash
# Preview automated migrations without modifying files:
npx @ngxsmk/cli migrate --dry-run

# Apply automated migration codemods to your Angular project:
npx @ngxsmk/cli migrate
```

Or via Angular CLI:

```bash
ng update @ngxsmk/cli
```

---

## Features

- **Automated Codemods**: Rewrites legacy barrel imports into granular secondary entry points (`@ngxsmk/core/button`, `@ngxsmk/core/card`).
- **Token Modernization**: Converts legacy CSS variables to standard `--ngxsmk-*` design tokens.
- **Signals Migration Diagnostics**: Highlights legacy `@Input()` decorators to help migrate components to Angular Signals.
