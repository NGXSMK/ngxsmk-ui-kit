# NGXSMK Design System Governance Standard

> **Status**: Official / Enforced  
> **Target**: `@ngxsmk/*` Packages, Apps, Documentation, and Tools  
> **Enforcement**: Automated CI Checks (`npm run governance`), Linters, and Review Gates

This document defines the architectural, visual, naming, API, accessibility, testing, and lifecycle standards that every component, directive, service, and token in NGXSMK must strictly follow.

---

## Table of Contents

1. [Component Architecture & Directory Structure](#1-component-architecture--directory-structure)
2. [Component & Class Naming Conventions](#2-component--class-naming-conventions)
3. [API & Signal Conventions](#3-api--signal-conventions)
4. [Design Tokens & Theme System](#4-design-tokens--theme-system)
5. [CSS, BEM & Logical Properties](#5-css-bem--logical-properties)
6. [Component Variants & Hierarchy](#6-component-variants--hierarchy)
7. [Interactive State Matrix](#7-interactive-state-matrix)
8. [Accessibility (a11y) Standards](#8-accessibility-a11y-standards)
9. [Responsive & Mobile UX](#9-responsive--mobile-ux)
10. [Component Composition & Slotted Content](#10-component-composition--slotted-content)
11. [Deprecation Policy](#11-deprecation-policy)
12. [Breaking Change Policy](#12-breaking-change-policy)
13. [Documentation & AI Surface Requirements](#13-documentation--ai-surface-requirements)
14. [Testing & Quality Verification](#14-testing--quality-verification)

---

## 1. Component Architecture & Directory Structure

Every component or directive in `@ngxsmk/core` is a standalone, isolated **secondary entry point**:

- **Single Directory**: `packages/core/<name>/`
- **Core Implementation**: `packages/core/<name>/<name>.ts` (Single-file component enclosing class, template, and scoped styles)
- **Public API Re-export**: `packages/core/<name>/index.ts`
- **Entry Point Manifest**: `packages/core/<name>/ng-package.json`
- **Unit & A11y Tests**: `packages/core/<name>/<name>.spec.ts`

```
packages/core/button/
├── button.ts             # Implementation
├── button.spec.ts        # Unit & a11y tests
├── index.ts              # export * from './button';
└── ng-package.json       # { "$schema": "...", "lib": { "entryFile": "index.ts" } }
```

### Mandatory Class & Decorator Settings

- `standalone: true` is strictly required on all components and directives.
- `changeDetection: ChangeDetectionStrategy.OnPush` is strictly required on all components.
- Directives and components must never depend on `zone.js`.

---

## 2. Component & Class Naming Conventions

| Category               | Pattern                                           | Example                                          |
| ---------------------- | ------------------------------------------------- | ------------------------------------------------ |
| **Directory Name**     | kebab-case                                        | `prompt-input`, `segmented-control`              |
| **Component Class**    | PascalCase with `Ngxsmk` prefix                   | `NgxsmkPromptInput`, `NgxsmkSegmentedControl`    |
| **Element Selector**   | kebab-case with `ngxsmk-` prefix                  | `<ngxsmk-prompt-input>`                          |
| **Attribute Selector** | `[ngxsmk<PascalCase>]` or `button[ngxsmk-button]` | `<button ngxsmk-button>`, `<input ngxsmkInput>`  |
| **Type / Interface**   | PascalCase with `Ngxsmk` prefix                   | `NgxsmkButtonVariant`, `NgxsmkPromptModelOption` |
| **Injection Token**    | SCREAMING_SNAKE_CASE with `NGXSMK_` prefix        | `NGXSMK_FORM_FIELD_CONTROL`                      |

---

## 3. API & Signal Conventions

NGXSMK components use modern Angular Signal APIs exclusively. Decorators (`@Input()`, `@Output()`, `@HostBinding()`) are strictly forbidden.

### 3.1 Input Signals

- Standard inputs: `readonly size = input<NgxsmkButtonSize>('md');`
- Required inputs: `readonly options = input.required<NgxsmkOption[]>();`
- Boolean inputs **must** include boolean transform: `readonly disabled = input(false, { transform: booleanAttribute });`
- Two-way bound values use `model()`: `readonly value = model<string>('');`

### 3.2 Output Signals

- Outputs use `output<T>()`: `readonly changed = output<string>();`
- Event names must use past/action tense: `selected`, `dismissed`, `submitted`, `opened`, `closed`.
- Avoid prefixing outputs with `on` (e.g. use `changed` instead of `onChanged`).

### 3.3 Computed Signals & Reactivity

- All template derivations, formatted labels, and active states must be declared as `computed()` signals to avoid redundant template method calls.
- Side effects belong in `effect()` within the constructor or injection context.

---

## 4. Design Tokens & Theme System

All styling in NGXSMK must be token-driven. Hardcoded colors, arbitrary pixel dimensions, and untokenized shadows are strictly prohibited.

### 4.1 Token Namespaces

- **Colors**: `--ngxsmk-color-primary`, `--ngxsmk-color-surface`, `--ngxsmk-color-surface-muted`, `--ngxsmk-color-surface-elevated`, `--ngxsmk-color-outline`, `--ngxsmk-color-on-surface`
- **Spacing**: `--ngxsmk-space-1` (4px), `--ngxsmk-space-2` (8px), `--ngxsmk-space-3` (12px), `--ngxsmk-space-4` (16px), `--ngxsmk-space-6` (24px), `--ngxsmk-space-8` (32px)
- **Radius**: `--ngxsmk-radius-sm` (4px), `--ngxsmk-radius-md` (8px), `--ngxsmk-radius-lg` (12px), `--ngxsmk-radius-xl` (16px), `--ngxsmk-radius-2xl` (20px), `--ngxsmk-radius-full` (9999px)
- **Shadows**: `--ngxsmk-shadow-sm`, `--ngxsmk-shadow-md`, `--ngxsmk-shadow-lg`, `--ngxsmk-shadow-xl`, `--ngxsmk-shadow-2xl`
- **Focus**: `--ngxsmk-focus-ring`, `--ngxsmk-focus-ring-error`
- **Control Heights**: `--ngxsmk-control-height-sm` (32px), `--ngxsmk-control-height-md` (40px), `--ngxsmk-control-height-lg` (48px)
- **Motion**: `--ngxsmk-duration-fast` (100ms), `--ngxsmk-duration-normal` (200ms), `--ngxsmk-ease-out`, `--ngxsmk-ease-in-out`

### 4.2 Hardcoded Value Rules

- `#[0-9a-fA-F]{3,8}` hex values inside component CSS/templates are forbidden.
- Theme CSS is generated: edit `packages/theme/src/lib/css.ts`, then run `npm run theme:css`.

---

## 5. CSS, BEM & Logical Properties

### 5.1 Class & Host Naming

- Use standard BEM naming prefixed with `.ngxsmk-`:
  - Block: `.ngxsmk-prompt-box`
  - Element: `.ngxsmk-prompt-box__textarea`
  - Modifier: `.ngxsmk-prompt-box__send-btn--active`
- Host elements must bind `host: { class: 'ngxsmk-<component-name>' }`.

### 5.2 100% Logical CSS Properties (RTL Mandate)

Physical directional properties are forbidden in favor of CSS logical properties:

- `margin-left` / `margin-right` ➔ `margin-inline-start` / `margin-inline-end` / `margin-inline`
- `padding-left` / `padding-right` ➔ `padding-inline-start` / `padding-inline-end` / `padding-inline`
- `left` / `right` ➔ `inset-inline-start` / `inset-inline-end`
- `text-align: left` / `text-align: right` ➔ `text-align: start` / `text-align: end`

---

## 6. Component Variants & Hierarchy

Components with multiple visual treatments must adhere to standardized variant taxonomies:

### 6.1 Action / Button Variants

- `primary`: Solid brand fill for the single primary action.
- `secondary`: Tonal/surface-variant fill for secondary actions.
- `outline`: Bordered transparent background for complementary actions.
- `ghost`: Borderless transparent background for low-emphasis toolbars.
- `destructive`: Error/danger fill for irreversible actions.
- `link`: Borderless text action without vertical translation.

### 6.2 Feedback / Status Variants

- `info`: Blue information container and icon.
- `success`: Green confirmation container and icon.
- `warning`: Amber alert container and icon.
- `error`: Red destructive container and icon.

---

## 7. Interactive State Matrix

Every interactive component must explicitly define and style all states:

```
┌───────────────────────────────────────────────────────────┐
│                    INTERACTIVE STATES                     │
├───────────┬───────────┬────────────┬───────────┬──────────┤
│  Default  │   Hover   │   Active   │  Focused  │ Disabled │
│  Neutral  │  +Lift /  │  -Scale /  │ Dual Ring │ Muted /  │
│  State    │  Surface  │  Darken    │ Focus-Vis │ No-Events│
└───────────┴───────────┴────────────┴───────────┴──────────┘
```

1. **Hover**: Smooth `100ms ease-out` background or border tint; optional subtle `--ngxsmk-hover-lift` on cards/elevated buttons.
2. **Active / Pressed**: Snappy `--ngxsmk-press-scale` (`scale(0.98)`).
3. **Focus Visible**: High-contrast dual focus ring (`:focus-visible { box-shadow: var(--ngxsmk-focus-ring); outline: none; }`).
4. **Disabled**: `opacity: var(--ngxsmk-opacity-disabled); cursor: not-allowed; pointer-events: none;`.
5. **Loading**: Display animated spinner or skeleton with `aria-busy="true"`.
6. **Invalid / Error**: `aria-invalid="true"`, error border tint, and `var(--ngxsmk-focus-ring-error)`.

---

## 8. Accessibility (a11y) Standards

- **WCAG 2.2 AAA / AA Compliance**: All text and interactive controls must meet minimum 4.5:1 (normal text) and 3:1 (large text/UI components) contrast ratios in both light and dark modes.
- **WAI-ARIA Roles**: Proper roles (`role="dialog"`, `role="menu"`, `role="tablist"`, `role="listbox"`, `role="progressbar"`) and state attributes (`aria-expanded`, `aria-selected`, `aria-current`, `aria-invalid`).
- **Keyboard Navigation**: Roving tabindex (`[tabindex]="active ? 0 : -1"`) with `ArrowDown`/`ArrowUp`/`Home`/`End`/`Escape` navigation for menus, tabs, and select dropdowns.
- **Mobile Touch Targets**: Minimum interactive dimensions of 44×44px (`--ngxsmk-touch-target-min`) on mobile viewports.
- **Screen Reader Fallbacks**: Canvas charts and visual visualizations must provide visually hidden semantic `<table>` fallbacks.
- **Reduced Motion**: All animations must respect `prefers-reduced-motion` and collapse durations to `0ms`.

---

## 9. Responsive & Mobile UX

- **Responsive Viewport Breakpoints**: Mobile (`< 640px`), Tablet (`768px`), Desktop (`1024px+`), Wide (`1280px+`).
- **Mobile Form Zoom Prevention**: All input text fields must have `font-size: 16px` on viewports `< 640px` to prevent iOS Safari auto-zoom.
- **Dialogs on Mobile**: Dialogs and drawers must adapt gracefully to bottom sheets with safe-area padding (`--ngxsmk-safe-area-bottom`).
- **Overflow & Scrolling**: Data tables, code blocks, and tab bars must enforce `overflow-x: auto` boundaries with touch scrolling (`-webkit-overflow-scrolling: touch`).

---

## 10. Component Composition & Slotted Content

- Prefer composition over monolithic configurations.
- Use explicit slot selectors: `<ng-content select="[ngxsmkCardHeader]" />`, `<ng-content select="[ngxsmkEmptyIcon], svg" />`.
- Provide directive anchors for complex sub-templates: `NgxsmkCellDef`, `NgxsmkCardTitle`, `NgxsmkDialogFooter`.
- Form controls must implement `ControlValueAccessor` via `CvaBase<T>` and `NgxsmkFormFieldControl` to integrate seamlessly with `NgxsmkFormField`.

---

## 11. Deprecation Policy

When deprecating an API or component:

1. Mark the class/method with JSDoc `@deprecated Use <Replacement> (<path>) instead. Will be removed in v<Major+1>.0.0.`
2. Maintain backward-compatible re-exports or shims for at least **1 major version release**.
3. Deprecated components must be logged in release notes and migration guides.

---

## 12. Breaking Change Policy

- Breaking changes are restricted to **Major Version Releases** (e.g. v2.0.0 ➔ v3.0.0).
- Every breaking change must have an associated changeset describing:
  - Exact reason for the change.
  - Before and after code migration examples.
  - Automated migration schematics when possible.

---

## 13. Documentation & AI Surface Requirements

Every component must maintain documentation across 3 surfaces:

1. **JSDoc Summary & Usage Snippet**: Placed immediately above the `@Component` / `@Directive` class for automated LLM extraction into `llms.txt` and MCP database:
   ````ts
   /**
    * Multi-line prompt composer with model selection and send triggers.
    *
    * ```html
    * <ngxsmk-prompt-input [(value)]="prompt" (submitPrompt)="onSend($event)" />
    * ```
    */
   ````
2. **Demo Showcase Page**: An interactive, realistic documentation page in `apps/demo` showcasing defaults, variants, states, and accessibility instructions.
3. **MCP Tooling**: Run `node tools/scripts/generate-ai-docs.mjs` on any API addition to synchronize `packages/mcp/src/component-db.ts` and `llms.txt`.

---

## 14. Testing & Quality Verification

Before any pull request is merged, it must pass all automated verification gates:

```bash
# 1. Design System Governance Static Analysis
npm run governance

# 2. Code Linting & Formatting Check
npm run lint && npm run format:check

# 3. Comprehensive Unit & A11y Tests
npm test

# 4. Zoneless Execution Check (0 zone.js references in 246 FESM bundles)
npm run check:zoneless

# 5. Bundle Size Budget Check (<10% threshold)
npm run size

# 6. Full Monorepo Build (Theme CSS -> Core Libs -> MCP -> Demo Showcase)
npm run build
```
