# NGXSMK Documentation System & Knowledge Hub

Welcome to the **NGXSMK Documentation System** — the definitive guide for building modern, signals-native, zoneless Angular applications with design tokens, enterprise widgets, and AI interfaces.

---

```
┌────────────────────────────────────────────────────────────────────────┐
│             NGXSMK ENTERPRISE DOCUMENTATION SYSTEM                     │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│  GETTING STARTED│  DESIGN SYSTEM  │  ARCHITECTURE &  │  REFERENCE APPS │
│  Installation & │  Tokens, Colors │  Signals, A11y   │  7 Enterprise   │
│  Configuration  │  & Theming Lab  │  & Performance   │  Live Blueprints│
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

---

## 1. Documentation Index

### 1.1 Getting Started
- **[Installation Guide](./getting-started/installation.md)**: Minimal setup, peer dependencies, and standalone Angular bootstrap.
- **[Migration Guide](../MIGRATION.md)**: Version upgrade pathways, deprecation sunset timeline, and automated CLI codemods.

### 1.2 Architecture & Engineering Standards
- **[Signals & Zoneless Architecture](./architecture/signals-zoneless.md)**: Deep dive into 100% signal reactivity and zero-`zone.js` performance.
- **[Accessibility (A11y) Standards](../A11Y.md)**: WCAG 2.2 AA compliance, keyboard interaction matrices, roving focus, and screen reader behavior.
- **[Simplicity & Complexity Guidelines](../GOVERNANCE.md)**: Simplicity criteria, LoC bounds, and signal purity standards.
- **[Performance Laboratory](../REFERENCE_APPLICATIONS.md)**: Benchmark methodologies, Brotli bundle footprints, and signal throughput.

### 1.3 AI, MCP & Coding Agents
- **[AI Coding Agent Handbook](../AI_CODING_GUIDE.md)**: Import maps, composition blueprints, and documented anti-patterns.
- **[Machine-Readable Index (`llms.txt`)](../llms.txt)**: Fast-access component and API index for AI models.
- **[AI Search & SEO Strategy](../SEO_STRATEGY.md)**: Top 100 SEO & Generative Engine Optimization (GEO) blueprint.

### 1.4 Guides & Troubleshooting
- **[Developer Troubleshooting Guide](./guides/troubleshooting.md)**: Solutions for common Angular development questions, SSR flash, and form validation.

---

## 2. Package Ecosystem

| Package | Description | Version |
|---|---|---|
| **`@ngxsmk/core`** | 150+ signals-native standalone UI components and directives | `3.0.0` |
| **`@ngxsmk/theme`** | Universal design tokens engine and dynamic CSS injectors | `3.0.0` |
| **`@ngxsmk/cdk`** | Headless interaction primitives (Roving Focus, Focus Trap, Skip Link) | `3.0.0` |
| **`@ngxsmk/cli`** | Scaffolding tools, automated migration codemods, and theme compilers | `3.0.0` |
| **`@ngxsmk/mcp`** | Model Context Protocol server for AI coding agents | `3.0.0` |
