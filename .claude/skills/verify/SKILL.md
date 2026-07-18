---
name: verify
description: Verify ngxsmk-ui-kit changes at their runtime surfaces — MCP server over stdio, AI-docs generator CLI, Claude plugin manifests, npm packaging. Use after changing packages/mcp, tools/scripts/generate-ai-docs.mjs, or the .claude-plugin / plugins packaging.
---

# Verifying ngxsmk-ui-kit AI surfaces

## MCP server (packages/mcp)

Drive it over stdio (no build needed — `dist/` is checked in; rebuild with
`npm run build:mcp` if `src/` changed):

```bash
printf '%s\n' \
'{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"v","version":"0"}}}' \
'{"jsonrpc":"2.0","method":"notifications/initialized"}' \
'{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
'{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"ngxsmk_search_components","arguments":{"query":"button"}}}' \
| node packages/mcp/dist/index.js
```

Consumer simulation: `npm pack` in packages/mcp, `npm install <tarball>` in a
temp dir, then run `./node_modules/.bin/ngxsmk-mcp` — this is what
`npx -y @ngxsmk/mcp` does.

Known: the server does not enforce tool inputSchema (missing/invalid args fall
through to defaults); MCP clients validate instead.

## AI docs generator

`node tools/scripts/generate-ai-docs.mjs` then
`npx prettier --write packages/mcp/src/component-db.ts apps/demo/public/component-api.json .claude-plugin/marketplace.json plugins/ngxsmk/.claude-plugin/plugin.json packages/mcp/server.json`
— raw generator output is not prettier-clean (repo convention is regen → format).
After both, `git status` should show no unexpected diffs (idempotent).

Version stamping: temporarily bump root package.json `version`, rerun the
generator, and check the 4 version fields in plugin.json, marketplace.json and
server.json (top-level + packages[0]); restore with `git checkout -- package.json`
and rerun.

## Plugin / marketplace manifests

```bash
claude plugin validate --strict .claude-plugin/marketplace.json
claude plugin validate --strict plugins/ngxsmk
```

## MCP registry manifest

Validate `packages/mcp/server.json` with ajv (available via node_modules)
against https://static.modelcontextprotocol.io/schemas/2025-09-29/server.schema.json.
Gotcha: `description` max length is 100 chars.

## Published docs URLs

https://ngxsmk.github.io/ngxsmk-ui-kit/llms.txt and /llms-full.txt are the URLs
the README and skill reference — fetch them to confirm they serve after deploys.
