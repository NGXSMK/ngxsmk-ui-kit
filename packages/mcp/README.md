# @ngxsmk/mcp

Model Context Protocol (MCP) Server for the **NGXSMK** Angular UI ecosystem.

Provides AI coding assistants (Claude Code, Cursor, Copilot) with real-time component search, API documentation lookups, layout recommendations, and anti-pattern diagnostic tools.

---

## Installation & Running

```bash
# Run via npx:
npx -y @ngxsmk/mcp
```

Or configure in your MCP settings (`.mcp.json` or Claude Desktop):

```json
{
  "mcpServers": {
    "ngxsmk": {
      "command": "npx",
      "args": ["-y", "@ngxsmk/mcp"]
    }
  }
}
```

---

## Exposed MCP Tools

- `ngxsmk_search_components`: Search 257+ signal-native components by query.
- `ngxsmk_explain_api`: Returns full JSDoc, inputs, models, and usage examples.
- `ngxsmk_recommend_layout`: Recommends optimal component compositions.
- `ngxsmk_get_anti_patterns`: Returns common mistakes and canonical before/after patterns.
- `ngxsmk_get_migration_path`: Provides migration mappings from Angular Material/PrimeNG to NGXSMK.
