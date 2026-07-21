#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { COMPONENT_DATABASE, ComponentEntry } from './component-db';

const TOOLS = [
  {
    name: 'ngxsmk_search_components',
    description:
      'Search for component definitions, styling capabilities, and inputs/outputs in the ngxsmk-ui-kit library.',
    inputSchema: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: 'Keyword search (e.g. "button", "carousel", "ai-chat")',
        },
      },
      required: ['query'],
    },
  },
  {
    name: 'ngxsmk_explain_api',
    description:
      'Get deep technical documentation, code snippets, inputs, outputs, and import paths for a specific ngxsmk component.',
    inputSchema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          description:
            'The exact component class name or selector (e.g. "NgxsmkAiChat", "ngxsmk-button")',
        },
      },
      required: ['component'],
    },
  },
  {
    name: 'ngxsmk_recommend_layout',
    description:
      'Generate production-ready Angular template layouts using ngxsmk grid, stack, and card systems.',
    inputSchema: {
      type: 'object',
      properties: {
        type: {
          type: 'string',
          enum: ['login', 'dashboard', 'settings', 'ai-assistant'],
          description: 'The type of application layout to generate',
        },
      },
      required: ['type'],
    },
  },
];

function elementTag(selector: string): string {
  const first = selector.split(',')[0].trim();
  const attr = first.match(/^(\w+)\[([^\]]+)\]$/);
  if (attr) return `<${attr[1]} ${attr[2]}>...</${attr[1]}>`;
  return `<${first} />`;
}

function usageSnippet(c: ComponentEntry): string {
  const first = c.selector.split(',')[0].trim();
  const attr = first.match(/^(\w+)\[([^\]]+)\]$/);
  const bindings = c.inputs
    .slice(0, 3)
    .map((i) => (i.twoWay ? `[(${i.name})]="${i.name}"` : `[${i.name}]="${i.name}"`))
    .concat(
      c.outputs
        .slice(0, 2)
        .map((o) => `(${o.name})="on${o.name[0].toUpperCase()}${o.name.slice(1)}($event)"`),
    );
  const attrs = bindings.length ? ' ' + bindings.join(' ') : '';
  if (attr) return `<${attr[1]} ${attr[2]}${attrs}>...</${attr[1]}>`;
  return `<${first}${attrs} />`;
}

function findComponent(query: string): ComponentEntry | undefined {
  const q = query.toLowerCase();
  return COMPONENT_DATABASE.find(
    (c) =>
      c.name.toLowerCase() === q ||
      c.selector.toLowerCase() === q ||
      c.selector
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .includes(q),
  );
}

const server = new Server(
  {
    name: 'ngxsmk-mcp-server',
    version: '1.3.3',
  },
  {
    capabilities: {
      tools: {},
    },
  },
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: TOOLS,
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'ngxsmk_search_components') {
    const query = ((args as any)?.query || '').toLowerCase();
    const terms = query.split(/\s+/).filter(Boolean);
    const results = COMPONENT_DATABASE.filter((c) => {
      const haystack = `${c.name} ${c.selector} ${c.entryPoint} ${c.description}`.toLowerCase();
      return terms.every((t: string) => haystack.includes(t));
    }).slice(0, 25);

    return {
      content: [
        {
          type: 'text',
          text:
            results.length > 0
              ? `Found ${results.length} components:\n\n${results
                  .map(
                    (r) =>
                      `- **${r.name}** (\`${r.selector}\`, import from \`${r.entryPoint}\`)${r.description ? ` — ${r.description}` : ''}`,
                  )
                  .join('\n')}`
              : `No components matched query: "${query}"`,
        },
      ],
    };
  }

  if (name === 'ngxsmk_explain_api') {
    const match = findComponent((args as any)?.component || '');

    if (!match) {
      return {
        content: [
          {
            type: 'text',
            text: `Component "${(args as any)?.component}" not found in database. Try ngxsmk_search_components first.`,
          },
        ],
      };
    }

    const inputsText = match.inputs
      .map(
        (i) =>
          `- \`${i.twoWay ? `[(${i.name})]` : `[${i.name}]`}\` (${i.type}${i.required ? ', required' : ''}${i.default ? `, default: \`${i.default}\`` : ''})`,
      )
      .join('\n');
    const outputsText = match.outputs
      .map((o) => `- \`(${o.name})\` (emits: \`${o.type}\`)`)
      .join('\n');

    return {
      content: [
        {
          type: 'text',
          text: `### API documentation for **${match.name}** (\`${match.selector}\`)

${match.description || ''}

- Import: \`import { ${match.name} } from '${match.entryPoint}';\` (standalone — add to the component's \`imports\` array)
- Element usage: \`${elementTag(match.selector)}\`
- Styling: use \`--ngxsmk-*\` CSS custom properties; never override internal classes.

#### Inputs
${inputsText || 'None'}

#### Outputs
${outputsText || 'None'}

#### Usage Code Snippet
\`\`\`html
${usageSnippet(match)}
\`\`\`
`,
        },
      ],
    };
  }

  if (name === 'ngxsmk_recommend_layout') {
    const type = (args as any)?.type;
    let template = '';

    if (type === 'login') {
      template = `<div class="login-container" style="display: flex; align-items: center; justify-content: center; height: 100vh;">
  <ngxsmk-card style="width: 100%; max-width: 400px; padding: var(--ngxsmk-space-6);">
    <h2 style="margin-bottom: var(--ngxsmk-space-4);">Sign In</h2>
    <div style="margin-bottom: var(--ngxsmk-space-4);">
      <label style="display: block; margin-bottom: var(--ngxsmk-space-2);">Email</label>
      <input ngxsmkInput type="email" style="width: 100%;" />
    </div>
    <div style="margin-bottom: var(--ngxsmk-space-6);">
      <label style="display: block; margin-bottom: var(--ngxsmk-space-2);">Password</label>
      <input ngxsmkInput type="password" style="width: 100%;" />
    </div>
    <button ngxsmk-button style="width: 100%;">Sign In</button>
  </ngxsmk-card>
</div>`;
    } else if (type === 'ai-assistant') {
      template = `<div class="assistant-layout" style="display: flex; height: 100vh;">
  <aside style="width: 250px; border-right: 1px solid var(--ngxsmk-color-outline); background: var(--ngxsmk-color-surface);">
    <div style="padding: var(--ngxsmk-space-4); font-weight: bold;">History</div>
  </aside>
  <main style="flex: 1; display: flex; flex-direction: column;">
    <div style="flex: 1; padding: var(--ngxsmk-space-6);">
      <ngxsmk-ai-chat [messages]="messages()" [isTyping]="isTyping()" />
    </div>
  </main>
</div>`;
    } else {
      template = `<!-- General layout for type: ${type} -->\n<div class="ngxsmk-layout">\n  <ngxsmk-card>General Card</ngxsmk-card>\n</div>`;
    }

    return {
      content: [
        {
          type: 'text',
          text: `Recommended layout code:\n\n\`\`\`html\n${template}\n\`\`\``,
        },
      ],
    };
  }

  throw new Error(`Tool not found: ${name}`);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ngxsmk-mcp-server running on stdio');
}

run().catch((error) => {
  console.error('Fatal error in main:', error);
  process.exit(1);
});
