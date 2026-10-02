import { Rule, SchematicContext, SchematicsException, Tree } from '@angular-devkit/schematics';

export interface ScaffoldSchema {
  project?: string;
  /** login | dashboard | settings | ai-assistant | ops-table */
  type?: string;
  name?: string;
  path?: string;
}

const RECIPES: Record<
  string,
  { file: string; className: string; selector: string; source: string }
> = {
  login: {
    file: 'login-page.ts',
    className: 'LoginPage',
    selector: 'app-login-page',
    source: `import { Component, signal } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkCard, NgxsmkCardContent } from '@ngxsmk/core/card';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgxsmkButton,
    NgxsmkCard,
    NgxsmkCardContent,
    NgxsmkFormField,
    NgxsmkInputDirective,
    NgxsmkCheckbox,
  ],
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
    .stack { display: flex; flex-direction: column; gap: 1rem; padding: 1.25rem; }
    h1 { margin: 0; letter-spacing: -0.03em; }
  \`,
})
export class LoginPage {
  readonly remember = signal(true);
}
`,
  },
  dashboard: {
    file: 'dashboard-page.ts',
    className: 'DashboardPage',
    selector: 'app-dashboard-page',
    source: `import { Component } from '@angular/core';
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
        <ngxsmk-stat label="Errors" value="0.4%" trend="down" />
      </div>
      <ngxsmk-data-table [columns]="columns" [rows]="rows" [pageSize]="5" [sortable]="true" />
    </main>
  \`,
  styles: \`
    .page { max-width: 56rem; margin: 0 auto; padding: 2rem 1.25rem; font-family: var(--ngxsmk-font-sans); }
    .stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; margin: 1.25rem 0; }
    h1 { margin: 0; letter-spacing: -0.03em; }
    @media (max-width: 720px) { .stats { grid-template-columns: minmax(0, 1fr); } }
  \`,
})
export class DashboardPage {
  readonly columns = [
    { key: 'name', label: 'Service' },
    { key: 'status', label: 'Status' },
  ];
  readonly rows = [
    { id: 1, name: 'API', status: 'Healthy' },
    { id: 2, name: 'Worker', status: 'Degraded' },
  ];
}
`,
  },
  settings: {
    file: 'settings-page.ts',
    className: 'SettingsPage',
    selector: 'app-settings-page',
    source: `import { Component, signal } from '@angular/core';
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
    .page {
      max-width: 28rem;
      margin: 0 auto;
      padding: 2rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      font-family: var(--ngxsmk-font-sans);
    }
    h1 { margin: 0; letter-spacing: -0.03em; }
  \`,
})
export class SettingsPage {
  name = 'Ada Lovelace';
  readonly emailDigests = signal(true);
}
`,
  },
  'ai-assistant': {
    file: 'ai-assistant-page.ts',
    className: 'AiAssistantPage',
    selector: 'app-ai-assistant-page',
    source: `import { Component } from '@angular/core';
import { NgxsmkAiChat, type NgxsmkAiMessage } from '@ngxsmk/core/ai-chat';

@Component({
  selector: 'app-ai-assistant-page',
  standalone: true,
  imports: [NgxsmkAiChat],
  template: \`
    <main class="page">
      <h1>Assistant</h1>
      <ngxsmk-ai-chat
        [messages]="messages"
        [models]="models"
        [selectedModel]="models[0]"
        (sendMessage)="onSend($event)"
      />
    </main>
  \`,
  styles: \`
    .page { max-width: 40rem; margin: 0 auto; padding: 2rem 1.25rem; font-family: var(--ngxsmk-font-sans); }
    h1 { margin: 0 0 1rem; letter-spacing: -0.03em; }
    ngxsmk-ai-chat { display: block; min-height: 24rem; }
  \`,
})
export class AiAssistantPage {
  readonly models = ['gemini-2.5-flash', 'claude-sonnet'];
  messages: NgxsmkAiMessage[] = [
    { id: 1, role: 'assistant', content: 'How can I help you today?' },
  ];
  onSend(text: string): void {
    this.messages = [
      ...this.messages,
      { id: Date.now(), role: 'user', content: text },
    ];
  }
}
`,
  },
  'ops-table': {
    file: 'ops-table-page.ts',
    className: 'OpsTablePage',
    selector: 'app-ops-table-page',
    source: `import { Component, signal } from '@angular/core';
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
        [pageSize]="8"
        [sortable]="true"
        [selectable]="true"
        [resizable]="true"
        [reorderable]="true"
        rowKey="id"
        [(selectedKeys)]="selected"
      />
    </main>
  \`,
  styles: \`
    .page { max-width: 64rem; margin: 0 auto; padding: 2rem 1.25rem; font-family: var(--ngxsmk-font-sans); }
    header { display: flex; flex-wrap: wrap; gap: 0.75rem; justify-content: space-between; margin-bottom: 1rem; }
    h1 { margin: 0; letter-spacing: -0.03em; }
  \`,
})
export class OpsTablePage {
  filter = '';
  readonly selected = signal<Array<string | number>>([]);
  readonly columns = [
    { key: 'name', label: 'Service' },
    { key: 'region', label: 'Region' },
    { key: 'status', label: 'Status' },
  ];
  readonly rows = [
    { id: 1, name: 'api-gateway', region: 'us-east-1', status: 'Healthy' },
    { id: 2, name: 'billing-worker', region: 'eu-west-1', status: 'Degraded' },
  ];
}
`,
  },
};

export function scaffold(options: ScaffoldSchema): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const type = options.type || 'login';
    const recipe = RECIPES[type];
    if (!recipe) {
      throw new SchematicsException(
        `Unknown scaffold type "${type}". Use: ${Object.keys(RECIPES).join(', ')}`,
      );
    }

    if (!tree.exists('angular.json')) {
      throw new SchematicsException('Could not find angular.json.');
    }
    const json = JSON.parse(tree.read('angular.json')!.toString('utf-8'));
    const projectName = options.project || Object.keys(json.projects)[0];
    const project = json.projects[projectName];
    const sourceRoot: string = project?.sourceRoot || 'src';
    const folder = options.path || `${sourceRoot}/app/pages/${type}`;
    const filePath = `${folder}/${recipe.file}`;

    if (tree.exists(filePath)) {
      throw new SchematicsException(`File already exists: ${filePath}`);
    }

    let source = recipe.source;
    if (options.name) {
      // Keep class export name stable for imports; only note the custom name in a comment.
      source = `/** Scaffold: ${options.name} */\n` + source;
    }

    tree.create(filePath, source);
    context.logger.info(`Created ${filePath}`);
    context.logger.info(`Import { ${recipe.className} } and add a route.`);
    return tree;
  };
}
