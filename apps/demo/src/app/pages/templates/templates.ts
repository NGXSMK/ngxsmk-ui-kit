import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { NgxsmkDialog } from '@ngxsmk/core/dialog';
import { NgxsmkTabs, NgxsmkTab } from '@ngxsmk/core/tabs';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkDivider } from '@ngxsmk/core/divider';
import { NgxsmkCodeBlock } from '@ngxsmk/core/code-block';
import { NgxsmkCopyToClipboard } from '@ngxsmk/core/copy-to-clipboard';
import { NgxsmkChatWindow } from '@ngxsmk/core/chat-window';
import { NgxsmkKanbanBoard, KanbanColumn } from '@ngxsmk/core/kanban-board';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkTable } from '@ngxsmk/core/table';
import { NgxsmkSelect } from '@ngxsmk/core/select';
import { NgxsmkBarChart } from '@ngxsmk/core/chart-bar';
import { NgxsmkTerminal } from '@ngxsmk/core/terminal';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkTransfer } from '@ngxsmk/core/transfer';
import { NgxsmkSignaturePad } from '@ngxsmk/core/signature-pad';
import { NgxsmkDock } from '@ngxsmk/core/dock';
import { NgxsmkCalendarHeatmap } from '@ngxsmk/core/calendar-heatmap';
import { NgxsmkVirtualScroll } from '@ngxsmk/core/virtual-scroll';
import { NgxsmkPinInput } from '@ngxsmk/core/pin-input';
import { Component, signal, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { APP_VERSION } from '../../core/version';

type TemplateCategory =
  'All' | 'Application' | 'Marketing' | 'E-Commerce' | 'Authentication' | 'DevOps';

interface TemplateItem {
  id: string;
  title: string;
  category: Exclude<TemplateCategory, 'All'>;
  description: string;
  code: string;
  gradient: string;
}

@Component({
  selector: 'templates-page',
  standalone: true,
  imports: [
    NgxsmkButton,
    NgxsmkHeading,
    NgxsmkText,
    NgxsmkDialog,
    NgxsmkTabs,
    NgxsmkTab,
    NgxsmkStat,
    NgxsmkBadge,
    NgxsmkDivider,
    NgxsmkCodeBlock,
    NgxsmkCopyToClipboard,
    NgxsmkChatWindow,
    NgxsmkKanbanBoard,
    NgxsmkFormField,
    NgxsmkInputDirective,
    NgxsmkSwitch,
    NgxsmkTable,
    NgxsmkSelect,
    NgxsmkBarChart,
    NgxsmkTerminal,
    NgxsmkTransfer,
    NgxsmkSignaturePad,
    NgxsmkDock,
    NgxsmkCalendarHeatmap,
    NgxsmkVirtualScroll,
    NgxsmkPinInput,
    NgTemplateOutlet,
    FormsModule,
    RouterLink,
    TranslatePipe,
    AppNav,
  ],
  templateUrl: './templates.html',
  styleUrl: './templates.scss',
})
export class TemplatesPage {
  protected readonly appVersion = APP_VERSION;
  protected readonly previewDevice = signal<'desktop' | 'tablet' | 'mobile'>('desktop');

  /** Sheet numbers in the register read as NGX-01 … NGX-99. */
  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected readonly categories: TemplateCategory[] = [
    'All',
    'Application',
    'Marketing',
    'E-Commerce',
    'Authentication',
    'DevOps',
  ];
  protected readonly activeCategory = signal<TemplateCategory>('All');
  protected readonly searchQuery = signal('');

  protected readonly filteredTemplates = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.activeCategory();
    return this.templatesList.filter((tpl) => {
      if (cat !== 'All' && tpl.category !== cat) return false;
      if (
        query &&
        !tpl.title.toLowerCase().includes(query) &&
        !tpl.description.toLowerCase().includes(query)
      )
        return false;
      return true;
    });
  });

  protected readonly dialogOpen = signal(false);
  protected readonly selectedTemplate = signal<TemplateItem | null>(null);
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal(false);

  // --- Admin Console (dashboard template) multi-page navigation ---
  protected readonly adminNav = [
    { id: 'dashboard' as const, label: 'templates.nav.dashboard' },
    { id: 'analytics' as const, label: 'templates.nav.analytics' },
    { id: 'users' as const, label: 'templates.nav.users' },
    { id: 'settings' as const, label: 'templates.nav.settings' },
  ];
  protected readonly adminView = signal<'dashboard' | 'analytics' | 'users' | 'settings'>(
    'dashboard',
  );

  protected readonly analyticsData = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 64 },
    { label: 'Jun', value: 88 },
  ];
  protected readonly trafficSources = [
    { label: 'templates.traffic.organic', value: 48 },
    { label: 'templates.traffic.direct', value: 27 },
    { label: 'templates.traffic.referral', value: 15 },
    { label: 'templates.traffic.social', value: 10 },
  ];
  protected readonly usersList = [
    {
      name: 'Ada Lovelace',
      email: 'ada@ngxsmk.dev',
      role: 'templates.role.owner',
      status: 'Active',
      initials: 'AL',
      color: '#7c3aed',
    },
    {
      name: 'Alan Turing',
      email: 'alan@ngxsmk.dev',
      role: 'templates.role.admin',
      status: 'Active',
      initials: 'AT',
      color: '#0369a1',
    },
    {
      name: 'Grace Hopper',
      email: 'grace@ngxsmk.dev',
      role: 'templates.role.editor',
      status: 'Active',
      initials: 'GH',
      color: '#15803d',
    },
    {
      name: 'Linus Torvalds',
      email: 'linus@ngxsmk.dev',
      role: 'templates.role.viewer',
      status: 'Invited',
      initials: 'LT',
      color: '#b45309',
    },
  ];

  // --- Ops Table Data ---
  protected readonly opsServices = [
    {
      name: 'auth-gateway',
      cluster: 'us-east-1a',
      version: 'v2.4.1',
      uptime: '99.99%',
      latency: '12ms',
      status: 'Healthy',
    },
    {
      name: 'payment-svc',
      cluster: 'eu-central-1',
      version: 'v2.3.9',
      uptime: '99.95%',
      latency: '28ms',
      status: 'Healthy',
    },
    {
      name: 'search-indexer',
      cluster: 'us-west-2b',
      version: 'v2.4.0',
      uptime: '98.40%',
      latency: '145ms',
      status: 'Degraded',
    },
    {
      name: 'analytics-worker',
      cluster: 'us-east-1b',
      version: 'v2.4.1',
      uptime: '99.98%',
      latency: '18ms',
      status: 'Healthy',
    },
    {
      name: 'billing-cron',
      cluster: 'eu-west-1a',
      version: 'v2.2.0',
      uptime: '100%',
      latency: '5ms',
      status: 'Standby',
    },
  ];

  protected categoryCount(cat: TemplateCategory): number {
    if (cat === 'All') return this.templatesList.length;
    return this.templatesList.filter((t) => t.category === cat).length;
  }

  protected readonly dockItems = [
    { id: '1', label: 'Chat', icon: '💬' },
    { id: '2', label: 'Code', icon: '⚡' },
    { id: '3', label: 'Settings', icon: '⚙️' },
  ];

  protected readonly transferItems = [
    { key: '1', title: 'GPT-4o', description: 'Multimodal Flagship' },
    { key: '2', title: 'Gemini 1.5 Pro', description: '1M Context Window' },
    { key: '3', title: 'Claude 3.5 Sonnet', description: 'High Reasoning' },
  ];
  protected readonly activePipelineKeys = signal<string[]>(['3']);

  protected readonly heatmapValues = (() => {
    const list: { date: string; count: number }[] = [];
    const now = new Date(2026, 9, 2);
    for (let i = 0; i < 90; i++) {
      const d = new Date(now.getTime() - i * 86400000);
      const dayOfWeek = d.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        const count = (i * 7 + 13) % 11;
        list.push({ date: d.toISOString().split('T')[0], count });
      } else if (i % 4 === 0) {
        list.push({ date: d.toISOString().split('T')[0], count: 2 });
      }
    }
    return list;
  })();

  protected readonly virtualItems = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: 'Audit Log Event #' + (i + 1),
    timestamp: `${(i * 3 + 2) % 60}s ago`,
    ip: `192.168.1.${(i % 250) + 1}`,
  }));

  protected readonly tableColumns = [
    { key: 'user', label: 'User Name' },
    { key: 'status', label: 'Billing Plan' },
    { key: 'registered', label: 'Active Sessions' },
  ];

  protected readonly tableRows = [
    { user: 'Ada Lovelace', status: 'Enterprise Pro', registered: '4 current' },
    { user: 'Alan Turing', status: 'Professional Plan', registered: '1 current' },
    { user: 'Grace Hopper', status: 'Developer Free', registered: '0 sessions' },
  ];

  protected readonly chartData = [
    { label: 'Mon', value: 34 },
    { label: 'Tue', value: 45 },
    { label: 'Wed', value: 23 },
    { label: 'Thu', value: 56 },
    { label: 'Fri', value: 89 },
  ];

  // --- AI Chat State ---
  protected readonly chatInput = signal('');
  protected readonly chatMessages = signal<
    {
      id: string;
      role: 'system' | 'user' | 'assistant';
      content: string;
      timestamp: Date;
    }[]
  >([
    {
      id: '1',
      role: 'system',
      content: 'Assistant initialized. Powered by Gemini 2.5 Flash.',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user',
      content: 'How do I implement custom CSS variables in the theme engine?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant',
      content:
        'You can define custom token overrides like: --ngxsmk-button-bg: var(--ngxsmk-color-emerald); in your global stylesheet.',
      timestamp: new Date(),
    },
  ]);

  protected sendChatMessage(): void {
    const text = this.chatInput().trim();
    if (!text) return;
    this.chatInput.set('');
    const newMsg = {
      id: String(Date.now()),
      role: 'user' as const,
      content: text,
      timestamp: new Date(),
    };
    this.chatMessages.update((msgs) => [...msgs, newMsg]);

    setTimeout(() => {
      this.chatMessages.update((msgs) => [
        ...msgs,
        {
          id: String(Date.now() + 1),
          role: 'assistant' as const,
          content: `Here is a solution for "${text}": NGXSMK components use standard CSS custom properties and Angular signal-native inputs for maximum flexibility.`,
          timestamp: new Date(),
        },
      ]);
    }, 500);
  }

  // --- AI Console State ---
  protected readonly consoleStatus = signal<string | null>(null);
  protected readonly consoleInput = signal('');
  protected readonly consoleActions = signal<string[]>([]);

  protected runConsoleChip(action: string): void {
    this.consoleStatus.set(`Executed ${action} · Completed in 14ms`);
    this.consoleActions.update((a) => [action, ...a]);
    setTimeout(() => this.consoleStatus.set(null), 3000);
  }

  protected sendConsoleCommand(): void {
    const cmd = this.consoleInput().trim();
    if (!cmd) return;
    this.consoleInput.set('');
    this.consoleStatus.set(`Command "${cmd}" executed successfully.`);
    setTimeout(() => this.consoleStatus.set(null), 3000);
  }

  // --- Ops Table State ---
  protected readonly opsSearch = signal('');
  protected readonly opsSelected = signal<Set<string>>(
    new Set(['auth-gateway', 'analytics-worker']),
  );
  protected readonly opsPage = signal(1);

  protected readonly filteredOpsServices = computed(() => {
    const q = this.opsSearch().toLowerCase().trim();
    if (!q) return this.opsServices;
    return this.opsServices.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.cluster.toLowerCase().includes(q) ||
        s.status.toLowerCase().includes(q),
    );
  });

  protected toggleOpsSelect(name: string): void {
    this.opsSelected.update((set) => {
      const next = new Set(set);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  // --- E-Commerce State ---
  protected readonly selectedProductColor = signal('#09090b');
  protected readonly cartCount = signal(0);
  protected readonly addedToCartFeedback = signal(false);

  protected addToCart(): void {
    this.cartCount.update((c) => c + 1);
    this.addedToCartFeedback.set(true);
    setTimeout(() => this.addedToCartFeedback.set(false), 2000);
  }

  // --- Checkout State ---
  protected readonly checkoutPin = signal('');
  protected readonly checkoutSuccess = signal(false);

  protected confirmPayment(): void {
    this.checkoutSuccess.set(true);
  }

  protected onPinCompleted(pin: string): void {
    if (pin.length === 4) {
      this.checkoutSuccess.set(true);
    }
  }

  // --- Settings State ---
  protected readonly settingsSaved = signal(false);

  protected saveSettings(): void {
    this.settingsSaved.set(true);
    setTimeout(() => this.settingsSaved.set(false), 2500);
  }

  // --- Auth State ---
  protected readonly authEmail = signal('ada@ngxsmk.dev');
  protected readonly authPassword = signal('••••••••');
  protected readonly authState = signal<'idle' | 'loading' | 'success'>('idle');

  protected submitAuth(): void {
    this.authState.set('loading');
    setTimeout(() => {
      this.authState.set('success');
      setTimeout(() => this.authState.set('idle'), 2500);
    }, 700);
  }

  // --- Landing State ---
  protected readonly landingToast = signal<string | null>(null);

  protected triggerLandingAction(msg: string): void {
    this.landingToast.set(msg);
    setTimeout(() => this.landingToast.set(null), 2500);
  }

  protected readonly kanbanColumns = signal<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'k1', title: 'Design onboarding flow', description: 'Wireframe the 3-step signup.' },
        { id: 'k2', title: 'Audit color tokens' },
      ],
    },
    {
      id: 'progress',
      title: 'In Progress',
      items: [{ id: 'k3', title: 'Build data table', description: 'Sorting + pagination.' }],
    },
    {
      id: 'review',
      title: 'In Review',
      items: [{ id: 'k4', title: 'Refactor auth guard' }],
    },
    {
      id: 'done',
      title: 'Done',
      items: [{ id: 'k5', title: 'Ship theme engine', description: 'Released in v1.2.' }],
    },
  ]);

  protected readonly themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Night Theme' },
    { value: 'system', label: 'Follow System Default' },
  ];

  protected readonly healthLogs = [
    { text: 'systemctl start nginx', isInput: true },
    { text: 'nginx.service - high-performance web server started.' },
    { text: 'docker-compose up -d --build postgres', isInput: true },
    { text: 'database container up: listening on port 5432' },
    { text: 'api-service connection established: DB response 1ms' },
  ];

  protected readonly templatesList: TemplateItem[] = [
    {
      id: 'dashboard',
      title: 'templates.list.dashboard.title',
      category: 'Application',
      description: 'templates.list.dashboard.desc',
      gradient: 'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)',
      code: `<!-- app-dashboard.html -->
<ngxsmk-app-shell>
  <ngxsmk-side-nav>
    <ngxsmk-side-nav-section>
      <ngxsmk-side-nav-heading>Workspace</ngxsmk-side-nav-heading>
      <ngxsmk-side-nav-item active="true">Dashboard</ngxsmk-side-nav-item>
      <ngxsmk-side-nav-item>Analytics</ngxsmk-side-nav-item>
      <ngxsmk-side-nav-item badge="3">Customers</ngxsmk-side-nav-item>
    </ngxsmk-side-nav-section>
    <ngxsmk-side-nav-collapse-button />
  </ngxsmk-side-nav>

  <div class="main-content">
    <div class="stats-grid">
      <ngxsmk-stat label="Active Users" value="1,245" trend="up" />
      <ngxsmk-stat label="Monthly Revenue" value="$45,231" trend="up" />
      <ngxsmk-stat label="Server Load" value="23.4%" trend="down" />
    </div>

    <div class="dashboard-grid">
      <ngxsmk-table [columns]="tableColumns" [rows]="tableRows" [striped]="true" />
      <ngxsmk-chart-bar [data]="chartData" [width]="240" [height]="120" />
    </div>
  </div>
</ngxsmk-app-shell>`,
    },
    {
      id: 'ai-chat',
      title: 'templates.list.aichat.title',
      category: 'Application',
      description: 'templates.list.aichat.desc',
      gradient: 'linear-gradient(135deg, #064e3b, #065f46, #047857)',
      code: `<!-- ai-chat.html -->
<ngxsmk-chat-layout>
  <ngxsmk-chat-window [messages]="chatMessages" />
  
  <ngxsmk-chat-composer-drawer>
    <input ngxsmkInput placeholder="Ask anything..." style="flex: 1;" />
    <button ngxsmk-button>Send</button>
  </ngxsmk-chat-composer-drawer>
</ngxsmk-chat-layout>`,
    },
    {
      id: 'ai-console',
      title: 'templates.list.aiconsole.title',
      category: 'Application',
      description: 'templates.list.aiconsole.desc',
      gradient: 'linear-gradient(135deg, #0f172a, #134e4a, #0d9488)',
      code: `<!-- ai-console.html -->
<div class="ai-console">
  <header class="ai-console__bar">
    <ngxsmk-breadcrumb
      [items]="[
        { label: 'Workspace', href: '/' },
        { label: 'Agents' },
        { label: 'Support bot' }
      ]"
    />
    <button ngxsmk-button size="sm" variant="outline">
      <ngxsmk-icon name="settings" size="sm" />
      Model
    </button>
  </header>

  <main class="ai-console__main">
    <ngxsmk-ai-chat
      [messages]="messages"
      [models]="['gemini-2.5-flash', 'claude-sonnet']"
      (sendMessage)="onSend($event)"
    />
  </main>
</div>`,
    },
    {
      id: 'ops-table',
      title: 'templates.list.opstable.title',
      category: 'Application',
      description: 'templates.list.opstable.desc',
      gradient: 'linear-gradient(135deg, #1c1917, #292524, #0d9488)',
      code: `<!-- ops-table.html -->
<section class="ops">
  <header class="ops__head">
    <div>
      <h1>Service inventory</h1>
      <p>Select rows, resize columns, drag headers to reorder.</p>
    </div>
    <input ngxsmkInput placeholder="Filter services…" [(ngModel)]="filter" />
  </header>

  <ngxsmk-data-table
    [columns]="columns"
    [rows]="rows"
    [filter]="filter"
    [pageSize]="10"
    [sortable]="true"
    [selectable]="true"
    [resizable]="true"
    [reorderable]="true"
    rowKey="id"
    [(selectedKeys)]="selected"
    (pageChange)="loadPage($event)"
  />
</section>`,
    },
    {
      id: 'landing-page',
      title: 'templates.list.landing.title',
      category: 'Marketing',
      description: 'templates.list.landing.desc',
      gradient: 'linear-gradient(135deg, #701a75, #86198f, #a21caf)',
      code: `<!-- landing-page.html -->
<div class="landing-nav">
  <div style="font-weight: 700; font-family: 'Outfit';">ngxsmk SaaS</div>
  <div style="display: flex; gap: 1rem;">
    <span>Features</span>
    <span>Pricing</span>
    <span>Docs</span>
  </div>
  <button ngxsmk-button size="sm">Get Started</button>
</div>

<div class="landing-hero">
  <ngxsmk-heading level="h1">Innovate Faster</ngxsmk-heading>
  <ngxsmk-text variant="body" style="font-size: var(--ngxsmk-text-body-lg-size); opacity: 0.8; max-width: 480px; margin: 0.5rem auto 1.5rem;">
    Build state-of-the-art enterprise web applications in minutes using NGXSMK premium signals-based UI Kit.
  </ngxsmk-text>
  <div style="display: flex; gap: 0.75rem; justify-content: center;">
    <button ngxsmk-button>Start Free Trial</button>
    <button ngxsmk-button variant="outline">Learn More</button>
  </div>
</div>

<div class="landing-pricing">
  <ngxsmk-card class="price-card">
    <ngxsmk-heading level="h4">Starter</ngxsmk-heading>
    <div class="price-val">$0/mo</div>
    <ngxsmk-divider />
    <ul class="price-features">
      <li>Basic layout UI blocks</li>
      <li>Single developer license</li>
      <li>Community support</li>
    </ul>
    <button ngxsmk-button variant="outline" style="width: 100%;">Sign Up</button>
  </ngxsmk-card>

  <ngxsmk-card class="price-card highlighted">
    <div class="price-badge">Popular</div>
    <ngxsmk-heading level="h4">Professional</ngxsmk-heading>
    <div class="price-val">$49/mo</div>
    <ngxsmk-divider />
    <ul class="price-features">
      <li>All premium & dashboard blocks</li>
      <li>Unlimited dev licenses</li>
      <li>Priority Slack support</li>
    </ul>
    <button ngxsmk-button style="width: 100%;">Get Pro</button>
  </ngxsmk-card>
</div>`,
    },
    {
      id: 'kanban',
      title: 'templates.list.kanban.title',
      category: 'Application',
      description: 'templates.list.kanban.desc',
      gradient: 'linear-gradient(135deg, #1e3a5f, #1e4d8c, #2563eb)',
      code: `<!-- kanban-board.html -->
<ngxsmk-card>
  <div ngxsmkCardHeader>
    <ngxsmk-heading level="h3">Sprint 24 Board</ngxsmk-heading>
  </div>
  <div ngxsmkCardContent>
    <ngxsmk-kanban-board [columns]="columns" />
  </div>
</ngxsmk-card>`,
    },
    {
      id: 'settings',
      title: 'templates.list.settings.title',
      category: 'Application',
      description: 'templates.list.settings.desc',
      gradient: 'linear-gradient(135deg, #292524, #44403c, #57534e)',
      code: `<!-- settings-form.html -->
<div class="settings-form">
  <ngxsmk-breadcrumb
    [items]="[
      { label: 'App', href: '/' },
      { label: 'Settings' }
    ]"
  />

  <ngxsmk-tabs value="profile">
    <ngxsmk-tab value="profile" label="Profile">
      <div class="settings-form__stack">
        <ngxsmk-form-field label="Display name" hint="How you appear to others.">
          <input ngxsmkInput placeholder="Jane Doe" />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Work hours start">
          <ngxsmk-time-picker [(value)]="start" step="900" />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Phone">
          <input
            ngxsmkInput
            ngxsmkInputMask
            mask="(000) 000-0000"
            [(value)]="phone"
            placeholder="(555) 000-0000"
          />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Theme">
          <ngxsmk-select [options]="themeOptions" value="system" />
        </ngxsmk-form-field>
        <button ngxsmk-button type="button">Save profile</button>
      </div>
    </ngxsmk-tab>
    <ngxsmk-tab value="notifications" label="Notifications">
      <div class="settings-form__stack">
        <ngxsmk-form-field label="Email summaries" hint="Morning digest of updates.">
          <ngxsmk-switch [checked]="true" />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Desktop push" hint="Notify on assignment.">
          <ngxsmk-switch [checked]="false" />
        </ngxsmk-form-field>
      </div>
    </ngxsmk-tab>
  </ngxsmk-tabs>
</div>`,
    },
    {
      id: 'ecommerce-detail',
      title: 'templates.list.ecommerce.title',
      category: 'E-Commerce',
      description: 'templates.list.ecommerce.desc',
      gradient: 'linear-gradient(135deg, #7c2d12, #9a3412, #c2410c)',
      code: `<!-- product-detail.html -->
<div class="product-grid">
  <div class="product-gallery">
    <img src="product.jpg" alt="Preview Image" />
  </div>
  
  <div class="product-info">
    <ngxsmk-badge variant="info">Free Shipping</ngxsmk-badge>
    <ngxsmk-heading level="h2">AeroSound Pro Headphones</ngxsmk-heading>
    
    <div class="ratings">
      <span>★★★★★</span>
      <span>(124 reviews)</span>
    </div>

    <div class="prices">
      <span class="price-current">$199.00</span>
      <span class="price-old">$249.00</span>
    </div>
    
    <ngxsmk-divider />
    
    <ngxsmk-text variant="body">Active noise-cancelling headphones featuring 40h battery.</ngxsmk-text>
    
    <div class="spec-row">
      <span>Color</span>
      <div class="colors">
        <span class="color-dot active" style="background-color: #09090b;"></span>
        <span class="color-dot" style="background-color: #7c3aed;"></span>
      </div>
    </div>
    
    <div class="actions">
      <button ngxsmk-button>Add to Cart</button>
      <button ngxsmk-button variant="outline">Buy Now</button>
    </div>
  </div>
</div>`,
    },
    {
      id: 'auth-cards',
      title: 'templates.list.auth.title',
      category: 'Authentication',
      description: 'templates.list.auth.desc',
      gradient: 'linear-gradient(135deg, #3b0764, #581c87, #6b21a8)',
      code: `<!-- auth-card.html -->
<ngxsmk-card class="auth-card">
  <ngxsmk-heading level="h3">Sign in to account</ngxsmk-heading>
  <ngxsmk-text variant="body">Enter credentials to access workspace</ngxsmk-text>
  
  <div class="socials">
    <button ngxsmk-button variant="outline">Google</button>
    <button ngxsmk-button variant="outline">GitHub</button>
  </div>
  
  <div class="divider">or continue with email</div>

  <ngxsmk-form-layout>
    <ngxsmk-form-field label="Email Address">
      <input ngxsmkInput type="email" placeholder="name@example.com" />
    </ngxsmk-form-field>
    <ngxsmk-form-field label="Password">
      <input ngxsmkInput type="password" placeholder="••••••••" />
    </ngxsmk-form-field>
    
    <div class="options">
      <ngxsmk-switch [checked]="true">Keep me signed in</ngxsmk-switch>
      <a href="#">Forgot?</a>
    </div>

    <button ngxsmk-button style="width: 100%;">Sign In</button>
  </ngxsmk-form-layout>
</ngxsmk-card>`,
    },
    {
      id: 'health-monitor',
      title: 'templates.list.health.title',
      category: 'DevOps',
      description: 'templates.list.health.desc',
      gradient: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
      code: `<!-- health-monitor.html -->
<div class="health-header">
  <ngxsmk-heading level="h4">System Status Monitor</ngxsmk-heading>
  <ngxsmk-badge variant="success">All Systems Operational</ngxsmk-badge>
</div>

<div class="health-gauges">
  <ngxsmk-stat label="CPU Usage" value="14.2%" trend="up" />
  <ngxsmk-stat label="Memory" value="64.8%" trend="flat" />
  <ngxsmk-stat label="API Latency" value="24ms" trend="down" />
</div>

<ngxsmk-terminal title="System Events Log" [lines]="logs" />`,
    },
    {
      id: 'ai-workbench',
      title: 'templates.list.aiworkbench.title',
      category: 'Application',
      description: 'templates.list.aiworkbench.desc',
      gradient: 'linear-gradient(135deg, #0284c7, #0369a1, #075985)',
      code: `<!-- ai-workbench.html -->
<div class="ai-workbench">
  <ngxsmk-heading level="h3">AI Agent Workbench</ngxsmk-heading>
  <ngxsmk-dock [items]="dockItems" />
  <ngxsmk-transfer [dataSource]="transferItems" [titles]="['Available Models', 'Active Pipeline']" />
</div>`,
    },
    {
      id: 'fintech-trading',
      title: 'templates.list.fintech.title',
      category: 'Application',
      description: 'templates.list.fintech.desc',
      gradient: 'linear-gradient(135deg, #059669, #047857, #065f46)',
      code: `<!-- fintech-trading.html -->
<div class="trading-dashboard">
  <ngxsmk-stat label="Portfolio Return" value="+24.8%" trend="up" />
  <ngxsmk-calendar-heatmap [values]="heatmapValues" />
</div>`,
    },
    {
      id: 'dev-portal',
      title: 'templates.list.devportal.title',
      category: 'DevOps',
      description: 'templates.list.devportal.desc',
      gradient: 'linear-gradient(135deg, #4f46e5, #4338ca, #3730a3)',
      code: `<!-- dev-portal.html -->
<div class="dev-portal">
  <ngxsmk-signature-pad [width]="380" [height]="120" />
  <ngxsmk-virtual-scroll [items]="virtualItems" [itemHeight]="36" />
</div>`,
    },
    {
      id: 'checkout-flow',
      title: 'templates.list.checkout.title',
      category: 'E-Commerce',
      description: 'templates.list.checkout.desc',
      gradient: 'linear-gradient(135deg, #d97706, #b45309, #92400e)',
      code: `<!-- checkout-flow.html -->
<div class="checkout-card">
  <ngxsmk-heading level="h3">2-Factor Security Verification</ngxsmk-heading>
  <ngxsmk-pin-input [length]="4" />
  <button ngxsmk-button style="width: 100%;">Confirm Payment</button>
</div>`,
    },
  ];

  protected openPreview(tpl: TemplateItem): void {
    this.selectedTemplate.set(tpl);
    this.activeTab.set('preview');
    this.adminView.set('dashboard');
    this.dialogOpen.set(true);
  }

  protected openCode(tpl: TemplateItem): void {
    this.selectedTemplate.set(tpl);
    this.activeTab.set('code');
    this.dialogOpen.set(true);
  }

  protected onCodeCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
