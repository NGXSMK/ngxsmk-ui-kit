# NGXSMK Enterprise Migration & Upgrade Strategy

> **Target Standard**: Seamless, predictable upgrades across major Angular and NGXSMK versions.  
> **Tooling**: Automated AST codemods via `ngxsmk migrate` and Angular CLI `ng update @ngxsmk/cli`.

---

## 1. Enterprise Deprecation & Breaking Change Policy

To ensure zero unexpected breakage in enterprise mission-critical codebases:

1. **One-Major Deprecation Buffer**: Any public API slated for removal is marked `@deprecated` with a console warning for at least **1 major release cycle** before elimination.
2. **Automated Codemods Provided**: Every breaking change must be accompanied by an automated AST codemod in `@ngxsmk/cli`.
3. **No Stealth Removals**: All removals and changes are documented in `CHANGELOG.md` and `MIGRATION.md` with explicit Before/After snippets.

---

## 2. Automated Migration Quickstart

You can automatically upgrade your project using the NGXSMK CLI or Angular CLI:

### Option A: Via NGXSMK CLI Codemods
```bash
# Preview changes without modifying files:
npx @ngxsmk/cli migrate --dry-run

# Apply automated codemods to your codebase:
npx @ngxsmk/cli migrate
```

### Option B: Via Angular CLI `ng update`
```bash
ng update @ngxsmk/cli
```

---

## 3. Migration Guide: v1.x ➔ v2.0

### 3.1 Secondary Entry Point Imports
* **Breaking Change**: Root barrel imports from `@ngxsmk/core` are deprecated in favor of granular secondary entry points (`@ngxsmk/core/<component>`) to enable 100% tree-shaking.
* **Automated Codemod**: `npx @ngxsmk/cli migrate` automatically rewrites imports.

#### Before (v1.x):
```ts
import { NgxsmkButton, NgxsmkCard, NgxsmkDialog } from '@ngxsmk/core';
```

#### After (v2.0):
```ts
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkCard } from '@ngxsmk/core/card';
import { NgxsmkDialog } from '@ngxsmk/core/dialog';
```

---

### 3.2 Signal-Based Inputs & Two-Way Models
* **Change**: All component inputs use Angular Signals (`input()`, `model()`).
* **Before (v1.x)**:
  ```html
  <ngxsmk-switch [checked]="isDark" (checkedChange)="isDark = $event"></ngxsmk-switch>
  ```
* **After (v2.0)**:
  ```html
  <ngxsmk-switch [(checked)]="isDark"></ngxsmk-switch>
  ```

---

### 3.3 Design Token Renames
* **Change**: Legacy `--ngxsmk-color-accent` has been consolidated into `--ngxsmk-color-primary`.
* **Automated Codemod**: Automatically converted by `ngxsmk migrate`.

---

## 4. Deprecation & Sunset Matrix

| Deprecated Feature | Deprecated Since | Sunset Target | Migration Action / Automated Codemod |
|---|---|---|---|
| `@ngxsmk/core` barrel imports | v2.0 | v3.0 | `ngxsmk migrate` (rewrites to `@ngxsmk/core/<name>`) |
| `[theme]="..."` card attribute | v2.0 | v3.0 | Use `[variant]="..."` |
| `--ngxsmk-color-accent` token | v2.0 | v3.0 | Use `--ngxsmk-color-primary` |
| `DefaultButtonRenderer` class | v2.0 | v3.0 | Renamed to `NgxsmkDefaultButtonRenderer` |
| Non-signals `@Input()` usage | v2.0 | v3.0 | Migrate to `input()` / `model()` |

---

## 5. Troubleshooting & Monorepo Upgrades

- **Multi-project Monorepos**: Run `npx @ngxsmk/cli migrate` from the workspace root to scan all applications and libraries simultaneously.
- **Git Safety Check**: Always commit your working tree before running `ngxsmk migrate`. Run `git diff` after migration to review changes.
