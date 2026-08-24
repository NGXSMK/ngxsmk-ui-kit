# NGXSMK Component Consistency Audit Report

> Generated on: 2026-08-24T20:05:23.881Z  
> Overall Design System Health Score: **88%** (1723/1965 checks passing)  
> Scanned Components: **224**

## Category Health Scorecard

| Category | Compliance | Passed / Total | Status |
|---|---|---|---|
| **Button Heights** | **89%** | 17 / 19 | ⚠️ Needs Review |
| **Input Heights** | **88%** | 15 / 17 | ⚠️ Needs Review |
| **Border Radii** | **99%** | 238 / 240 | ✅ Excellent |
| **Typography** | **99%** | 237 / 240 | ✅ Excellent |
| **Spacing & Margin** | **100%** | 240 / 240 | ✅ Excellent |
| **Padding** | **100%** | 240 / 240 | ✅ Excellent |
| **Focus Rings** | **24%** | 53 / 224 | ❌ Non-Compliant |
| **Icon Sizes** | **100%** | 53 / 53 | ✅ Excellent |
| **Transitions & Motion** | **92%** | 220 / 240 | ✅ Excellent |
| **Color Token Purity** | **100%** | 240 / 240 | ✅ Excellent |
| **Disabled States** | **44%** | 24 / 54 | ❌ Non-Compliant |
| **Loading States** | **100%** | 11 / 11 | ✅ Excellent |
| **Error States** | **52%** | 13 / 25 | ❌ Non-Compliant |
| **Hover States** | **100%** | 99 / 99 | ✅ Excellent |
| **Density & Sizing** | **100%** | 23 / 23 | ✅ Excellent |

## Detailed Findings & Action Items

Found **242** item(s) for refinement:

- chat-dictation-button: Button height should use var(--ngxsmk-control-height-*)
- expanding-arrow-button: Button height should use var(--ngxsmk-control-height-*)
- otp-input: Form control height should bind to var(--ngxsmk-control-height-*)
- pin-input: Form control height should bind to var(--ngxsmk-control-height-*)
- expanding-arrow-button: Raw border-radius detected; use var(--ngxsmk-radius-*)
- timeline-stepper: Raw border-radius detected; use var(--ngxsmk-radius-*)
- compare-image: Typography values should use var(--ngxsmk-text-*) / var(--ngxsmk-font-*)
- notification-center: Typography values should use var(--ngxsmk-text-*) / var(--ngxsmk-font-*)
- tour: Typography values should use var(--ngxsmk-text-*) / var(--ngxsmk-font-*)
- accordion: Missing explicit :focus-visible focus ring declaration
- agent-card: Missing explicit :focus-visible focus ring declaration
- ai-thinking-indicator: Missing explicit :focus-visible focus ring declaration
- alert-dialog: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- animation: Missing explicit :focus-visible focus ring declaration
- app-shell: Missing explicit :focus-visible focus ring declaration
- aspect-ratio: Missing explicit :focus-visible focus ring declaration
- audio-player: Missing explicit :focus-visible focus ring declaration
- audio-visualizer: Missing explicit :focus-visible focus ring declaration
- avatar: Missing explicit :focus-visible focus ring declaration
- ...and 212 more items.

## Enforcement & Governance

This consistency audit is automatically enforced via:
1. `npm run audit:consistency` (CLI Audit)
2. `packages/core/src/consistency-audit.spec.ts` (Vitest Unit Suite)
3. `.github/workflows/ci.yml` (Continuous Integration Gate)