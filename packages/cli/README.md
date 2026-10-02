# @ngxsmk/cli

Schematics and codemods for the **NGXSMK** Angular UI kit.

## Install into an app

```bash
ng add @ngxsmk/cli --theme=classic
# premium Ink look:
ng add @ngxsmk/cli --theme=ink
```

What `ng-add` does:

1. Adds `@ngxsmk/core`, `@ngxsmk/theme`, `@ngxsmk/cdk` to `package.json` and runs install
2. Wires the theme CSS into `angular.json` (`ngxsmk.css` for classic/emerald)
3. Scaffolds `src/app/ngxsmk-starter/ngxsmk-starter.ts` (disable with `--scaffold=false`)

## Generate page recipes

Correct **secondary-entry** imports every time:

```bash
ng generate @ngxsmk/cli:scaffold --type=login
ng generate @ngxsmk/cli:scaffold --type=dashboard
ng generate @ngxsmk/cli:scaffold --type=settings
ng generate @ngxsmk/cli:scaffold --type=ai-assistant
ng generate @ngxsmk/cli:scaffold --type=ops-table
```

## Migrations

```bash
npx @ngxsmk/cli migrate --dry-run
npx @ngxsmk/cli migrate
```

Rewrites barrel imports to `@ngxsmk/core/<entry>` and modernizes tokens.
