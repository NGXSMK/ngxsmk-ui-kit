#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const index_js_1 = require("@modelcontextprotocol/sdk/server/index.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const types_js_1 = require("@modelcontextprotocol/sdk/types.js");
const component_db_1 = require("./component-db");
const TOOLS = [
    {
        name: 'ngxsmk_search_components',
        description: 'Search for component definitions, styling capabilities, and inputs/outputs in the ngxsmk-ui-kit library.',
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
        description: 'Get deep technical documentation, code snippets, inputs, outputs, and import paths for a specific ngxsmk component.',
        inputSchema: {
            type: 'object',
            properties: {
                component: {
                    type: 'string',
                    description: 'The exact component class name or selector (e.g. "NgxsmkAiChat", "ngxsmk-button")',
                },
            },
            required: ['component'],
        },
    },
    {
        name: 'ngxsmk_recommend_layout',
        description: 'Generate a complete standalone Angular page (TS + template) using correct @ngxsmk/core/<entry> imports — never barrel imports.',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['login', 'dashboard', 'settings', 'ai-assistant', 'ops-table'],
                    description: 'The type of application layout to generate',
                },
            },
            required: ['type'],
        },
    },
    {
        name: 'ngxsmk_scaffold_page',
        description: 'Scaffold a ready-to-paste standalone Angular component for a page recipe with secondary-entry imports, signal APIs, and token-only styles.',
        inputSchema: {
            type: 'object',
            properties: {
                type: {
                    type: 'string',
                    enum: ['login', 'dashboard', 'settings', 'ai-assistant', 'ops-table'],
                    description: 'Page recipe to scaffold',
                },
                className: {
                    type: 'string',
                    description: 'Optional Angular class name (default depends on type)',
                },
            },
            required: ['type'],
        },
    },
    {
        name: 'ngxsmk_get_anti_patterns',
        description: 'Get the official list of anti-patterns and rules to avoid when generating NGXSMK code (e.g. avoiding decorators, barrel imports, physical CSS, hardcoded colors).',
        inputSchema: {
            type: 'object',
            properties: {},
        },
    },
    {
        name: 'ngxsmk_get_migration_path',
        description: 'Get step-by-step migration guides from Angular Material, Bootstrap, or Ionic toward NGXSMK standalone signal components (and Ionic theme sync).',
        inputSchema: {
            type: 'object',
            properties: {
                sourceLibrary: {
                    type: 'string',
                    enum: ['material', 'bootstrap', 'ionic'],
                    description: 'The source library being migrated from',
                },
            },
            required: ['sourceLibrary'],
        },
    },
    {
        name: 'ngxsmk_ionic_setup',
        description: 'Return the recommended Ionic Angular + NGXSMK setup: providers, CSS imports, token sync via provideNgxsmkIonicTheme, and what to keep as Ionic vs NGXSMK.',
        inputSchema: {
            type: 'object',
            properties: {
                architecture: {
                    type: 'string',
                    enum: ['standalone', 'ngmodule'],
                    description: 'Ionic Angular project architecture (default: standalone)',
                },
            },
        },
    },
];
function elementTag(selector) {
    const first = selector.split(',')[0].trim();
    const attr = first.match(/^(\w+)\[([^\]]+)\]$/);
    if (attr)
        return `<${attr[1]} ${attr[2]}>...</${attr[1]}>`;
    return `<${first} />`;
}
function usageSnippet(c) {
    const first = c.selector.split(',')[0].trim();
    const attr = first.match(/^(\w+)\[([^\]]+)\]$/);
    const bindings = c.inputs
        .slice(0, 3)
        .map((i) => (i.twoWay ? `[(${i.name})]="${i.name}"` : `[${i.name}]="${i.name}"`))
        .concat(c.outputs
        .slice(0, 2)
        .map((o) => `(${o.name})="on${o.name[0].toUpperCase()}${o.name.slice(1)}($event)"`));
    const attrs = bindings.length ? ' ' + bindings.join(' ') : '';
    if (attr)
        return `<${attr[1]} ${attr[2]}${attrs}>...</${attr[1]}>`;
    return `<${first}${attrs} />`;
}
function scaffoldPage(type, className) {
    const recipes = {
        login: {
            className: 'LoginPage',
            body: `import { Component, signal } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkCard, NgxsmkCardContent } from '@ngxsmk/core/card';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [NgxsmkButton, NgxsmkCard, NgxsmkCardContent, NgxsmkFormField, NgxsmkInputDirective, NgxsmkCheckbox],
  template: \`
    <main class="page">
      <ngxsmk-card>
        <div ngxsmkCardContent class="stack">
          <h1>Sign in</h1>
          <ngxsmk-form-field label="Email">
            <input ngxsmkInput type="email" autocomplete="username" />
          </ngxsmk-form-field>
          <ngxsmk-form-field label="Password">
            <input ngxsmkInput type="password" autocomplete="current-password" />
          </ngxsmk-form-field>
          <ngxsmk-checkbox [(checked)]="remember">Remember me</ngxsmk-checkbox>
          <button ngxsmk-button type="button">Continue</button>
        </div>
      </ngxsmk-card>
    </main>
  \`,
  styles: \`
    .page { max-width: 24rem; margin: 4rem auto; padding: 0 1rem; font-family: var(--ngxsmk-font-sans); }
    .stack { display: flex; flex-direction: column; gap: var(--ngxsmk-space-4); padding: var(--ngxsmk-space-5); }
    h1 { margin: 0; letter-spacing: -0.03em; }
  \`,
})
export class CLASSNAME {
  readonly remember = signal(true);
}
`,
        },
        dashboard: {
            className: 'DashboardPage',
            body: `import { Component } from '@angular/core';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkDataTable } from '@ngxsmk/core/data-table';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [NgxsmkStat, NgxsmkDataTable],
  template: \`
    <main class="page">
      <h1>Dashboard</h1>
      <div class="stats">
        <ngxsmk-stat label="Active users" value="1,245" trend="up" />
        <ngxsmk-stat label="Revenue" value="$45k" trend="up" />
      </div>
      <ngxsmk-data-table [columns]="columns" [rows]="rows" [sortable]="true" [pageSize]="5" />
    </main>
  \`,
  styles: \`
    .page { max-width: 56rem; margin: 0 auto; padding: var(--ngxsmk-space-8) var(--ngxsmk-space-5); font-family: var(--ngxsmk-font-sans); }
    .stats { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--ngxsmk-space-3); margin-block: var(--ngxsmk-space-5); }
  \`,
})
export class CLASSNAME {
  readonly columns = [{ key: 'name', label: 'Service' }, { key: 'status', label: 'Status' }];
  readonly rows = [{ id: 1, name: 'API', status: 'Healthy' }];
}
`,
        },
        settings: {
            className: 'SettingsPage',
            body: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [FormsModule, NgxsmkButton, NgxsmkFormField, NgxsmkInputDirective, NgxsmkSwitch],
  template: \`
    <main class="page">
      <h1>Settings</h1>
      <ngxsmk-form-field label="Display name">
        <input ngxsmkInput [(ngModel)]="name" />
      </ngxsmk-form-field>
      <ngxsmk-switch [(checked)]="emailDigests">Email digests</ngxsmk-switch>
      <button ngxsmk-button type="button">Save</button>
    </main>
  \`,
  styles: \`
    .page { max-width: 28rem; margin: 0 auto; padding: var(--ngxsmk-space-8) var(--ngxsmk-space-5); display: flex; flex-direction: column; gap: var(--ngxsmk-space-4); font-family: var(--ngxsmk-font-sans); }
  \`,
})
export class CLASSNAME {
  name = 'Ada Lovelace';
  readonly emailDigests = signal(true);
}
`,
        },
        'ai-assistant': {
            className: 'AiAssistantPage',
            body: `import { Component } from '@angular/core';
import { NgxsmkAiChat, type NgxsmkAiMessage } from '@ngxsmk/core/ai-chat';

@Component({
  selector: 'app-ai-assistant-page',
  standalone: true,
  imports: [NgxsmkAiChat],
  template: \`
    <main class="page">
      <h1>Assistant</h1>
      <ngxsmk-ai-chat [messages]="messages" [models]="models" [selectedModel]="models[0]" (sendMessage)="onSend($event)" />
    </main>
  \`,
  styles: \`
    .page { max-width: 40rem; margin: 0 auto; padding: var(--ngxsmk-space-8) var(--ngxsmk-space-5); font-family: var(--ngxsmk-font-sans); }
    ngxsmk-ai-chat { display: block; min-height: 24rem; }
  \`,
})
export class CLASSNAME {
  readonly models = ['gemini-2.5-flash', 'claude-sonnet'];
  messages: NgxsmkAiMessage[] = [{ id: 1, role: 'assistant', content: 'How can I help you today?' }];
  onSend(text: string): void {
    this.messages = [...this.messages, { id: Date.now(), role: 'user', content: text }];
  }
}
`,
        },
        'ops-table': {
            className: 'OpsTablePage',
            body: `import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkDataTable } from '@ngxsmk/core/data-table';

@Component({
  selector: 'app-ops-table-page',
  standalone: true,
  imports: [FormsModule, NgxsmkInputDirective, NgxsmkDataTable],
  template: \`
    <main class="page">
      <header>
        <h1>Service inventory</h1>
        <input ngxsmkInput placeholder="Filter…" [(ngModel)]="filter" />
      </header>
      <ngxsmk-data-table
        [columns]="columns"
        [rows]="rows"
        [filter]="filter"
        [sortable]="true"
        [selectable]="true"
        [columnFilterable]="true"
        [resizable]="true"
        [reorderable]="true"
        rowKey="id"
        [(selectedKeys)]="selected"
      />
    </main>
  \`,
  styles: \`
    .page { max-width: 64rem; margin: 0 auto; padding: var(--ngxsmk-space-8) var(--ngxsmk-space-5); font-family: var(--ngxsmk-font-sans); }
    header { display: flex; flex-wrap: wrap; gap: var(--ngxsmk-space-3); justify-content: space-between; margin-bottom: var(--ngxsmk-space-4); }
  \`,
})
export class CLASSNAME {
  filter = '';
  readonly selected = signal<Array<string | number>>([]);
  readonly columns = [
    { key: 'name', label: 'Service', filterable: true },
    { key: 'region', label: 'Region', filterable: true },
    { key: 'status', label: 'Status', filterable: true },
  ];
  readonly rows = [
    { id: 1, name: 'api-gateway', region: 'us-east-1', status: 'Healthy' },
    { id: 2, name: 'billing-worker', region: 'eu-west-1', status: 'Degraded' },
  ];
}
`,
        },
    };
    const recipe = recipes[type];
    if (!recipe) {
        return `Unknown type "${type}". Use: ${Object.keys(recipes).join(', ')}`;
    }
    const name = className || recipe.className;
    return recipe.body.replace(/CLASSNAME/g, name);
}
function findComponent(query) {
    const q = query.toLowerCase();
    return component_db_1.COMPONENT_DATABASE.find((c) => c.name.toLowerCase() === q ||
        c.selector.toLowerCase() === q ||
        c.selector
            .split(',')
            .map((s) => s.trim().toLowerCase())
            .includes(q));
}
const server = new index_js_1.Server({
    name: 'ngxsmk-mcp-server',
    version: '1.3.3',
}, {
    capabilities: {
        tools: {},
    },
});
server.setRequestHandler(types_js_1.ListToolsRequestSchema, async () => {
    return {
        tools: TOOLS,
    };
});
server.setRequestHandler(types_js_1.CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    if (name === 'ngxsmk_search_components') {
        const query = (args?.query || '').toLowerCase();
        const terms = query.split(/\s+/).filter(Boolean);
        const results = component_db_1.COMPONENT_DATABASE.filter((c) => {
            const haystack = `${c.name} ${c.selector} ${c.entryPoint} ${c.description}`.toLowerCase();
            return terms.every((t) => haystack.includes(t));
        }).slice(0, 25);
        return {
            content: [
                {
                    type: 'text',
                    text: results.length > 0
                        ? `Found ${results.length} components:\n\n${results
                            .map((r) => `- **${r.name}** (\`${r.selector}\`, import from \`${r.entryPoint}\`)${r.description ? ` — ${r.description}` : ''}`)
                            .join('\n')}`
                        : `No components matched query: "${query}"`,
                },
            ],
        };
    }
    if (name === 'ngxsmk_explain_api') {
        const match = findComponent(args?.component || '');
        if (!match) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Component "${args?.component}" not found in database. Try ngxsmk_search_components first.`,
                    },
                ],
            };
        }
        const inputsText = match.inputs
            .map((i) => `- \`${i.twoWay ? `[(${i.name})]` : `[${i.name}]`}\` (${i.type}${i.required ? ', required' : ''}${i.default ? `, default: \`${i.default}\`` : ''})`)
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
    if (name === 'ngxsmk_recommend_layout' || name === 'ngxsmk_scaffold_page') {
        const type = String(args?.type || '');
        const className = args?.className;
        const code = scaffoldPage(type, className);
        return {
            content: [
                {
                    type: 'text',
                    text: `### NGXSMK scaffold — \`${type}\`

Rules baked in: secondary-entry imports only, signal APIs, token CSS, standalone component.

\`\`\`ts
${code}
\`\`\`
`,
                },
            ],
        };
    }
    if (name === 'ngxsmk_get_anti_patterns') {
        return {
            content: [
                {
                    type: 'text',
                    text: `### Official NGXSMK Anti-Patterns & Traps

1. ❌ **Decorator-based APIs**: Never use \`@Input()\` or \`@Output()\`. Always use signals (\`input()\`, \`model()\`, \`output()\`, \`computed()\`).
2. ❌ **Root Barrel Imports**: Never import from \`@ngxsmk/core\`. Always use secondary entry points like \`@ngxsmk/core/button\` or \`@ngxsmk/core/dialog\`.
3. ❌ **Hardcoded Colors & Spacing**: Never write \`#hex\` or pixel values in styles. Use \`var(--ngxsmk-color-*)\` and \`var(--ngxsmk-space-*)\`.
4. ❌ **Physical CSS Properties**: Never use \`margin-left\`, \`right\`, \`text-align: left\`. Use logical properties (\`margin-inline-start\`, \`text-align: start\`) for 100% RTL compliance.
5. ❌ **Unconstrained CSS Grids**: Never use \`grid-template-columns: 1fr\`. Always use \`minmax(0, 1fr)\` to prevent mobile blowout.
`,
                },
            ],
        };
    }
    if (name === 'ngxsmk_get_migration_path') {
        const src = args?.sourceLibrary;
        if (!src || !['material', 'bootstrap', 'ionic'].includes(src)) {
            return {
                content: [
                    {
                        type: 'text',
                        text: `Missing or invalid sourceLibrary. Pass one of: "material", "bootstrap", "ionic". Example: { "sourceLibrary": "ionic" }.`,
                    },
                ],
                isError: true,
            };
        }
        let guidance = '';
        if (src === 'material') {
            guidance = `### Angular Material → NGXSMK
- \`<button mat-raised-button color="primary">\` → \`<button ngxsmk-button>\`
- \`<mat-form-field><mat-label>Email</mat-label><input matInput></mat-form-field>\` → \`<ngxsmk-form-field label="Email"><input ngxsmkInput></ngxsmk-form-field>\`
- \`<mat-slide-toggle [(ngModel)]="val">\` → \`<ngxsmk-switch [(checked)]="val">\`
- \`<mat-tab-group>\` → \`<ngxsmk-tabs>\`
- \`<mat-card>\` → \`<ngxsmk-card>\`
- Import from \`@ngxsmk/core/<entry>\` only (never the root barrel).
`;
        }
        else if (src === 'bootstrap') {
            guidance = `### Bootstrap / ng-bootstrap → NGXSMK
- \`.btn.btn-primary\` → \`<button ngxsmk-button>\`
- \`.form-control\` → \`<input ngxsmkInput>\` inside \`<ngxsmk-form-field>\`
- \`.modal\` → \`<ngxsmk-dialog>\` or \`<ngxsmk-sheet>\`
- \`.nav-tabs\` → \`<ngxsmk-tabs>\`
- Drop Bootstrap utility classes for layout; prefer \`@ngxsmk/core/stack\`, \`grid\`, \`container\`.
- Theme via \`--ngxsmk-*\` tokens, not Bootstrap SCSS variables.
`;
        }
        else {
            guidance = `### Ionic Angular → NGXSMK (hybrid)
Keep Ionic for **shell navigation** (\`ion-tabs\`, \`ion-menu\`, \`ion-router-outlet\`, page lifecycle).
Use NGXSMK for **product UI** (forms, tables, AI chat, dense overlays).

1. Install \`@ngxsmk/core\` + \`@ngxsmk/theme\`.
2. Import theme CSS once: \`@import '@ngxsmk/theme/styles/ngxsmk.css';\`
3. In \`app.config.ts\`:
\`\`\`ts
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideNgxsmkIonicTheme } from '@ngxsmk/theme';

export const appConfig = {
  providers: [
    provideIonicAngular(),
    provideNgxsmkIonicTheme(), // maps --ngxsmk-* → --ion-*
  ],
};
\`\`\`
4. Replace dense Ionic forms gradually: \`ion-input\` → \`ngxsmkInput\` + \`ngxsmk-form-field\`, \`ion-toggle\` → \`ngxsmk-switch\`.
5. Do **not** nest Ionic modals inside NGXSMK dialogs (or vice versa) without a clear stacking plan.
Call \`ngxsmk_ionic_setup\` for a full paste-ready snippet.
`;
        }
        return {
            content: [
                {
                    type: 'text',
                    text: guidance,
                },
            ],
        };
    }
    if (name === 'ngxsmk_ionic_setup') {
        const arch = args?.architecture ?? 'standalone';
        const text = arch === 'ngmodule'
            ? `### Ionic Angular (NgModule) + NGXSMK

1. \`npm i @ngxsmk/core @ngxsmk/theme\`
2. Global styles: \`@import '@ngxsmk/theme/styles/ngxsmk.css';\`
3. In \`AppModule\`:
\`\`\`ts
import { IonicModule } from '@ionic/angular';
import { provideNgxsmkIonicTheme } from '@ngxsmk/theme';

@NgModule({
  imports: [IonicModule.forRoot()],
  providers: [provideNgxsmkIonicTheme()],
})
export class AppModule {}
\`\`\`
4. Keep \`ion-router-outlet\` / tabs / menu. Import NGXSMK components per feature module from \`@ngxsmk/core/<name>\`.
5. Prefer signals + standalone feature components even inside an NgModule shell.
`
            : `### Ionic Angular (standalone) + NGXSMK

1. \`npm i @ngxsmk/core @ngxsmk/theme\`
2. Global styles (\`src/global.scss\`):
\`\`\`scss
@import '@ngxsmk/theme/styles/ngxsmk.css';
// optional Ink: @import '@ngxsmk/theme/styles/ngxsmk.ink.css';
\`\`\`
3. \`app.config.ts\`:
\`\`\`ts
import { ApplicationConfig } from '@angular/core';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { provideNgxsmkIonicTheme, inkPreset } from '@ngxsmk/theme';

export const appConfig: ApplicationConfig = {
  providers: [
    provideIonicAngular(),
    provideNgxsmkIonicTheme(), // or provideNgxsmkIonicTheme(inkPreset)
  ],
};
\`\`\`
4. **Keep Ionic for:** tabs, side menu, page transitions, Capacitor plugins.
5. **Use NGXSMK for:** data tables, AI chat, complex forms, sheets/dialogs that match your web kit.
6. Tokens: NGXSMK writes \`--ngxsmk-*\`; \`provideNgxsmkIonicTheme\` also syncs \`--ion-*\` so Ionic chrome matches.
`;
        return { content: [{ type: 'text', text }] };
    }
    throw new Error(`Unknown tool "${name}". Available: ${TOOLS.map((t) => t.name).join(', ')}.`);
});
async function run() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error('ngxsmk-mcp-server running on stdio');
}
run().catch((error) => {
    console.error('Fatal error in main:', error);
    process.exit(1);
});
