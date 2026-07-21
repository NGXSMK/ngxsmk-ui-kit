# Domain Glossary — ngxsmk-ui-kit

## Core Concepts

**Component** — A standalone Angular directive or element that adds behavior + styling to native HTML or renders its own DOM. Every component is a single-file module with signal inputs, inline styles, and token-driven CSS. Selector prefix: `ngxsmk-`.

**Design Token** — A named CSS custom property (`--ngxsmk-*`) representing a visual primitive: color, spacing, radius, shadow, typography, duration, or z-index. Tokens are the sole source of visual truth — components never hardcode values.

**Theme** — The full set of resolved design tokens derived from a `ThemeConfig` (brand hex + overrides). A theme produces CSS custom properties for light and dark modes.

**Color Scale** — An 11-step perceptual gradient (50→950) derived from a single brand hex using OKLCH color space. Scales: brand, secondary, neutral.

**Semantic Color** — A token with role meaning (primary, success, error) mapped to a color scale step. Semantic colors swap between light/dark mode; raw scale values do not.

**Dark Mode** — Visual inversion via token replacement under `.dark` class (or `prefers-color-scheme`). Three strategies: `class`, `media`, `system`.

## Component Architecture

**Signal Input** — An `input()` or `input.required()` property. The only way to pass data into a component. No `@Input()` decorators.

**Model Signal** — A `model()` property — two-way binding via signal. Used for value, open state, and other bi-directional data flows.

**ControlValueAccessor (CVA)** — Angular forms integration pattern. Form components (select, input, checkbox, etc.) implement CVA to work with `ngModel` and `formControl`.

**Form-Field Control** — The `NgxsmkFormFieldControl` interface (`id`, `ariaInvalid`, `ariaDescribedby`). A narrow seam for wiring form controls to `ngxsmk-form-field` for label/hint/error display.

**Content Projection** — Angular's `<ng-content>` with named slots (`select="[slotName]"`). Used for composability (e.g., dialog footer, card header).

**Standalone** — Every component/directive is `standalone: true`. No NgModules anywhere.

## Platform Layers

**CDK (Component Dev Kit)** — `@ngxsmk/cdk`. Behavior primitives with zero visual opinion: focus trapping, scroll locking, media queries, intersection observation, live announcements, and the overlay strategy seam. Injectable services and attribute directives.

**Animation** — `@ngxsmk/core/animation`. WAAPI-based animation system via optional `motion` peer dependency. `NgxsmkAnimate` (enter), `NgxsmkPresence` (enter+exit with view management).

**Theme Engine** — `@ngxsmk/theme`. Token definition → OKLCH color derivation → CSS generation. The deepest module in the codebase.

## Rendering Concepts

**Renderer** — A per-component interface that abstracts DOM manipulation. Each component defines its own `XxxRenderer` interface, an `NGXSMK_XXX_RENDERER` injection token, a `DefaultXxxRenderer` (current web behavior), and optionally an `IonicXxxRenderer`. Currently structural — the interfaces and tokens are defined but the default web behavior does not yet delegate through them. When wired, components will inject the token and delegate rendering to it, separating behavioral state (signals, inputs, outputs) from platform-specific DOM work.

**Rendering Backend** — The concrete implementation behind a Renderer interface. Currently two backends exist in type definitions: Web (native HTML + CSS classes) and Ionic (Ionic components). A backend would be selected at the provider level — the component code would be backend-agnostic. Not yet wired in practice.

**Overlay** — Any floating UI: popover, dropdown, tooltip, dialog, sheet, command-palette. Decoupled from Angular CDK via the `NgxsmkOverlayStrategy` seam.

**Overlay Strategy** — The cross-cutting abstraction for how overlays are positioned and rendered. Lives in `@ngxsmk/cdk/overlay`. Adapters: `CdkOverlayAdapter` (current web), `IonicOverlayAdapter` (proposed mobile).

**Token Output Adapter** — Transforms a `ResolvedTheme` into platform-specific CSS custom properties. The `cssVarsAdapter` emits `--ngxsmk-*` variables; the `ionicVarsAdapter` emits `--ion-*` variables that Ionic components consume. Lives in `@ngxsmk/theme`.

## Data & Metadata

**Component Schema** — The proposed single-source-of-truth for component metadata (inputs, outputs, selectors, descriptions). Currently duplicated: MCP database (auto-generated) + demo registry (manually curated).

**MCP Database** — `packages/mcp/src/component-db.ts`. Auto-generated from source JSDoc. Flat array of `ComponentEntry` objects consumed by the MCP server.

**Demo Registry** — `apps/demo/src/app/core/component-registry.ts`. Manually curated with examples, accessibility scores, categories. Uses heuristic inference.

## Platform Targets

**Web (Current)** — The primary rendering target. Uses native HTML elements (`<button>`, `<dialog>`, `<input>`), Angular CDK overlay, and `--ngxsmk-*` CSS variables.

**Ionic (Proposed)** — A secondary rendering target. Uses Ionic components (`ion-button`, `ion-modal`, `ion-select`), Ionic overlay system, and `--ion-*` CSS variables. Same behavioral modules, different rendering backend.

## Token Namespace

| Prefix                   | Meaning                  | Example                     |
| ------------------------ | ------------------------ | --------------------------- |
| `--ngxsmk-color-*`       | Semantic color roles     | `--ngxsmk-color-primary`    |
| `--ngxsmk-color-brand-*` | Brand scale (11 steps)   | `--ngxsmk-color-brand-500`  |
| `--ngxsmk-space-*`       | Spacing scale (16 steps) | `--ngxsmk-space-4`          |
| `--ngxsmk-radius-*`      | Border radius scale      | `--ngxsmk-radius-lg`        |
| `--ngxsmk-shadow-*`      | Elevation shadows        | `--ngxsmk-shadow-md`        |
| `--ngxsmk-font-*`        | Typography families      | `--ngxsmk-font-sans`        |
| `--ngxsmk-text-*`        | Typography roles         | `--ngxsmk-text-body-medium` |
| `--ngxsmk-duration-*`    | Animation speeds         | `--ngxsmk-duration-normal`  |
| `--ngxsmk-z-*`           | Z-index layers           | `--ngxsmk-z-dropdown`       |
| `--ion-*`                | Ionic variable namespace | `--ion-color-primary`       |
