# @ngxsmk/mcp

## 2.1.0

## 1.3.2

- The component database is now auto-generated from `packages/core` sources
  (214 components, previously 3 hand-written entries). Regenerate with
  `node tools/scripts/generate-ai-docs.mjs`.
- `ngxsmk_search_components` matches descriptions and entry points, supports
  multi-term queries, and returns import paths.
- `ngxsmk_explain_api` accepts class names or selectors and includes the
  standalone import statement and a generated usage snippet.

## 1.3.1
