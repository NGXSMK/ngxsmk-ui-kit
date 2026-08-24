# NGXSMK Component Complexity & Simplicity Audit Report

> Timestamp: 2026-08-24T20:05:24.645Z  
> Audited Components: **240**  
> Average File Size: **157 LoC**  
> Signal Purity Rate: **99%** (2 RxJS subscriptions detected)  
> Derived State Ratio: **58%** computed signals

## 1. Simplicity Dimensions Scorecard

| Architectural Simplicity Question | Assessment | Status |
|---|---|---|
| **1. Can the API be smaller?** | Average **3.5** inputs per component; focused single-purpose APIs. | ✅ Lean |
| **2. Can the implementation be smaller?** | Average **157** LoC with single-file encapsulation. | ✅ Compact |
| **3. Can dependencies be removed?** | Zero heavy 3rd-party dependencies; native DOM and CSS custom properties. | ✅ Zero Bloat |
| **4. Can the DOM be simplified?** | Semantic native HTML elements (`<button>`, `<input>`, `<dialog>`) preferred. | ✅ Minimalist |
| **5. Can CSS be simplified?** | Token-driven `--ngxsmk-*` properties compiled to shared stylesheets. | ✅ Tokenized |
| **6. Can state be derived instead of stored?** | **58%** of reactive states are `computed()` signals. | ✅ Highly Derived |
| **7. Can Signals replace subscriptions?** | **99%** pure signal adoption; zero zone-based change detection. | ✅ Signal-Native |
| **8. Can a primitive be reused?** | `@ngxsmk/cdk` primitives (`roving-focus`, `focus-trap`, `click-outside`) reused. | ✅ High Reuse |
| **9. Can an abstraction be removed?** | Direct signals binding without intermediate wrapper services. | ✅ Direct |

## 2. Top Leanest & Simplest Components

| Component | Lines of Code (LoC) | Inputs | Outputs | Computed Signals | Simplicity Score |
|---|---|---|---|---|---|
| **click-outside** | 2 | 0 | 0 | 0 | **100/100** |
| **focus-trap** | 2 | 0 | 0 | 0 | **100/100** |
| **mobile-nav-toggle** | 2 | 0 | 0 | 0 | **100/100** |
| **stack-item** | 2 | 0 | 0 | 0 | **100/100** |
| **table-header-cell** | 2 | 0 | 0 | 0 | **100/100** |
| **table-row** | 2 | 0 | 0 | 0 | **100/100** |
| **top-nav-heading** | 2 | 0 | 0 | 0 | **100/100** |
| **top-nav-item** | 2 | 0 | 0 | 0 | **100/100** |
| **top-nav-mega-menu** | 2 | 0 | 0 | 0 | **100/100** |
| **top-nav-mega-menu-featured-card** | 2 | 0 | 0 | 0 | **100/100** |
| **top-nav-mega-menu-item** | 2 | 0 | 0 | 0 | **100/100** |
| **top-nav-menu** | 2 | 0 | 0 | 0 | **100/100** |
| **v-stack** | 2 | 0 | 0 | 0 | **100/100** |
| **input-group-text** | 9 | 0 | 0 | 0 | **99/100** |
| **button** | 25 | 0 | 0 | 0 | **98/100** |

## 3. Recommended Optimization Candidates

### `media-query` (41 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `lazy-load` (49 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `nav-heading-menu` (70 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `i18n` (82 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `media-theme` (39 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `voice-input` (102 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `overflow-list` (102 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `resizable` (99 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `streaming-text` (122 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `tooltip` (144 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `hover-card` (159 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `context-menu` (184 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `typeahead` (141 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `file-tree` (187 LoC)
- Evaluate if mutable state can be converted to derived computed() signals

### `reasoning-timeline` (209 LoC)
- Evaluate if mutable state can be converted to derived computed() signals
