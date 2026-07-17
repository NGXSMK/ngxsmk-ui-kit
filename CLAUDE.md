# CLAUDE.md

See [AGENTS.md](AGENTS.md) for repo layout, commands, and conventions — it is
the single source of truth for agent guidance in this repo.

Quick reminders:

- Single-file, standalone, signal-based components; one dir + secondary entry
  point per component under `packages/core`.
- Theme CSS is generated — edit `packages/theme` sources, then `npm run theme:css`.
- After changing any component's public API, run
  `node tools/scripts/generate-ai-docs.mjs` to refresh llms.txt and the MCP DB.
- Use Node 20/22 LTS (Node 26 breaks Angular CLI 22).
