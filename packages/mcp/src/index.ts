import * as readline from 'readline';

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
      'Get deep technical documentation, code snippets, inputs, outputs, and design tokens for a specific ngxsmk component.',
    inputSchema: {
      type: 'object',
      properties: {
        component: {
          type: 'string',
          description:
            'The exact component class name or selector (e.g. "NgxsmkAiChat", "ngx-button")',
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

const COMPONENT_DATABASE = [
  {
    name: 'NgxsmkAiChat',
    selector: 'ngxsmk-ai-chat',
    inputs: [
      {
        name: 'messages',
        type: 'NgxsmkAiMessage[]',
        default: '[]',
        desc: 'Array of conversational user/assistant turn messages.',
      },
      {
        name: 'models',
        type: 'string[]',
        default: "['gemini-2.5-flash', 'gemini-2.5-pro']",
        desc: 'List of options in model selector dropdown.',
      },
      {
        name: 'isTyping',
        type: 'boolean',
        default: 'false',
        desc: 'Shows animated typing indicator bubbles.',
      },
      {
        name: 'tokenCount',
        type: 'number',
        default: '0',
        desc: 'Displays total token count usage indicator.',
      },
    ],
    outputs: [
      {
        name: 'sendMessage',
        type: 'string',
        desc: 'Emitted when user submits a message or selects a suggestion chip.',
      },
      {
        name: 'modelChanged',
        type: 'string',
        desc: 'Emitted when a new model is selected in the dropdown.',
      },
    ],
    tokens: [
      '--ngxsmk-color-primary',
      '--ngxsmk-color-surface',
      '--ngxsmk-color-outline',
      '--ngxsmk-radius-lg',
      '--ngxsmk-space-4',
    ],
    snippet: `<ngxsmk-ai-chat\n  [messages]="messages()"\n  [isTyping]="isTyping()"\n  (sendMessage)="onSendMessage($event)"\n/>`,
  },
  {
    name: 'NgxsmkThemeBuilder',
    selector: 'ngxsmk-theme-builder',
    inputs: [],
    outputs: [],
    tokens: ['--ngxsmk-color-surface', '--ngxsmk-color-outline', '--ngxsmk-radius-lg'],
    snippet: `<ngxsmk-theme-builder />`,
  },
  {
    name: 'NgxsmkCarousel',
    selector: 'ngxsmk-carousel',
    inputs: [
      {
        name: 'autoplay',
        type: 'boolean',
        default: 'false',
        desc: 'Toggles automated slide cycling interval.',
      },
      {
        name: 'interval',
        type: 'number',
        default: '3000',
        desc: 'Timeout in milliseconds between auto cycles.',
      },
    ],
    outputs: [],
    tokens: ['--ngxsmk-motion-duration', '--ngxsmk-motion-ease', '--ngxsmk-color-primary'],
    snippet: `<ngxsmk-carousel [autoplay]="true">\n  <ngxsmk-carousel-slide>Slide 1</ngxsmk-carousel-slide>\n  <ngxsmk-carousel-slide>Slide 2</ngxsmk-carousel-slide>\n</ngxsmk-carousel>`,
  },
];

function handleRequest(message: any): any {
  const { method, params, id } = message;

  if (method === 'initialize') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {},
        },
        serverInfo: {
          name: 'ngxsmk-mcp-server',
          version: '1.3.0',
        },
      },
    };
  }

  if (method === 'tools/list') {
    return {
      jsonrpc: '2.0',
      id,
      result: {
        tools: TOOLS,
      },
    };
  }

  if (method === 'tools/call') {
    const { name, arguments: args } = params;

    if (name === 'ngxsmk_search_components') {
      const query = (args.query || '').toLowerCase();
      const results = COMPONENT_DATABASE.filter(
        (c) => c.name.toLowerCase().includes(query) || c.selector.toLowerCase().includes(query),
      );

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text:
                results.length > 0
                  ? `Found ${results.length} components:\n\n${results.map((r) => `- **${r.name}** (<${r.selector}>)`).join('\n')}`
                  : `No components matched query: "${query}"`,
            },
          ],
        },
      };
    }

    if (name === 'ngxsmk_explain_api') {
      const compName = (args.component || '').toLowerCase();
      const match = COMPONENT_DATABASE.find(
        (c) => c.name.toLowerCase() === compName || c.selector.toLowerCase() === compName,
      );

      if (!match) {
        return {
          jsonrpc: '2.0',
          id,
          result: {
            content: [
              {
                type: 'text',
                text: `Component "${args.component}" not found in database. Try searching first.`,
              },
            ],
          },
        };
      }

      const inputsText = match.inputs
        .map((i) => `- \`[${i.name}]\` (${i.type}, default: \`${i.default}\`): ${i.desc}`)
        .join('\n');
      const outputsText = match.outputs
        .map((o) => `- \`(${o.name})\` (emits: \`${o.type}\`): ${o.desc}`)
        .join('\n');
      const tokensText = match.tokens.map((t) => `- \`${t}\``).join('\n');

      return {
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `### API documentation for **${match.name}** (${match.selector})

#### Inputs
${inputsText || 'None'}

#### Outputs
${outputsText || 'None'}

#### CSS Design Tokens
${tokensText || 'None'}

#### Usage Code Snippet
\`\`\`html
${match.snippet}
\`\`\`
`,
            },
          ],
        },
      };
    }

    if (name === 'ngxsmk_recommend_layout') {
      const type = args.type;
      let template = '';

      if (type === 'login') {
        template = `<div class="login-container" style="display: flex; align-items: center; justify-content: center; height: 100vh;">
  <ngxsmk-card style="width: 100%; max-width: 400px; padding: var(--ngxsmk-space-6);">
    <h2 style="margin-bottom: var(--ngxsmk-space-4);">Sign In</h2>
    <div style="margin-bottom: var(--ngxsmk-space-4);">
      <label style="display: block; margin-bottom: var(--ngxsmk-space-2);">Email</label>
      <input type="email" style="width: 100%; height: 2.5rem; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md);" />
    </div>
    <div style="margin-bottom: var(--ngxsmk-space-6);">
      <label style="display: block; margin-bottom: var(--ngxsmk-space-2);">Password</label>
      <input type="password" style="width: 100%; height: 2.5rem; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-md);" />
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
        jsonrpc: '2.0',
        id,
        result: {
          content: [
            {
              type: 'text',
              text: `Recommended layout code:\n\n\`\`\`html\n${template}\n\`\`\``,
            },
          ],
        },
      };
    }
  }

  return {
    jsonrpc: '2.0',
    id,
    error: {
      code: -32601,
      message: `Method not found: ${method}`,
    },
  };
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

rl.on('line', (line: string) => {
  if (!line.trim()) return;

  try {
    const message = JSON.parse(line);
    const response = handleRequest(message);
    console.log(JSON.stringify(response));
  } catch (err) {
    console.error(
      JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32700,
          message: 'Parse error',
        },
      }),
    );
  }
});
