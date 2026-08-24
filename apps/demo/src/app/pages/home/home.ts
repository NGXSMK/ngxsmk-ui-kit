import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AppNav } from '../../nav/nav';
import { NgxsmkAnimate } from '@ngxsmk/core/animation';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { APP_VERSION } from '../../core/version';

import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkTable, type NgxsmkTableColumn } from '@ngxsmk/core/table';
import { NgxsmkBarChart } from '@ngxsmk/core/chart-bar';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkAvatar } from '@ngxsmk/core/avatar';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkToast, NgxsmkToaster } from '@ngxsmk/core/toast';

interface BentoCard {
  icon: string;
  title: string;
  desc: string;
  tag: string;
  accent: string;
}

interface Stat {
  value: string;
  label: string;
  accent?: string;
}

interface CategoryGroup {
  title: string;
  icon: string;
  path: string;
  count: number;
  items: string[];
  color: string;
  desc: string;
}

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    FormsModule,
    TranslatePipe,
    RouterLink,
    AppNav,
    NgxsmkButton,
    NgxsmkBadge,
    NgxsmkStat,
    NgxsmkTable,
    NgxsmkBarChart,
    NgxsmkProgress,
    NgxsmkSwitch,
    NgxsmkAvatar,
    NgxsmkInputDirective,
    NgxsmkToaster,
    NgxsmkAnimate,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit {
  protected readonly appVersion = APP_VERSION;
  protected readonly theme = inject(NgxsmkThemeService);
  private readonly toast = inject(NgxsmkToast);
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly installCommand = 'npm install @ngxsmk/core @ngxsmk/theme';
  protected readonly searchQuery = signal('');
  protected readonly copied = signal(false);

  // Showcase Dashboard Interactive State
  protected readonly showcaseTab = signal<'analytics' | 'services' | 'settings'>('analytics');
  protected readonly demoActiveUsers = signal('48,250');
  protected readonly demoLiveMode = signal(true);
  protected readonly demoProgress = signal(78);
  protected readonly demoFilterQuery = signal('');

  protected readonly showcaseChartData = [
    { label: 'Mon', value: 340 },
    { label: 'Tue', value: 480 },
    { label: 'Wed', value: 610 },
    { label: 'Thu', value: 540 },
    { label: 'Fri', value: 720 },
    { label: 'Sat', value: 890 },
    { label: 'Sun', value: 810 },
  ];

  protected readonly showcaseColumns: NgxsmkTableColumn[] = [
    { key: 'name', label: 'Component / Service' },
    { key: 'type', label: 'Type' },
    { key: 'status', label: 'Status' },
    { key: 'latency', label: 'Latency' },
  ];

  protected readonly showcaseRows = [
    { name: 'Button & Controls', type: 'Form Action', status: 'Optimal', latency: '4ms' },
    { name: 'Zoneless Signal Tree', type: 'Reactivity', status: 'Optimal', latency: '2ms' },
    { name: 'Dynamic Token Engine', type: 'Design System', status: 'Optimal', latency: '5ms' },
    { name: 'AI Chat Composer', type: 'AI Assistant', status: 'Optimal', latency: '12ms' },
    { name: 'Enterprise Kanban Grid', type: 'Business Tool', status: 'Optimal', latency: '8ms' },
  ];

  protected readonly motionHero = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, easing: 'ease-out' },
  };

  protected readonly motionTitle = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.1, easing: 'ease-out' },
  };

  protected readonly motionCta = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay: 0.25, easing: 'ease-out' },
  };

  ngOnInit(): void {
    this.title.setTitle('NGXSMK UI Kit — Modern Developer-First Angular UI Components');
    this.meta.updateTag({
      name: 'description',
      content:
        'NGXSMK UI Kit is a modern, customizable and developer-friendly UI component library for building production-ready Angular applications with signals and zoneless architecture.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'NGXSMK UI Kit — Build beautiful Angular applications faster',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'A modern, customizable and developer friendly UI component library for building production ready Angular applications.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'NGXSMK, NGXSMK UI Kit, Angular UI kit, Angular components, signal components, zoneless Angular, design system, Angular 19, Angular 20, standalone components, token engine, MIT, AI components, enterprise widgets',
    });

    let stored: string | null = null;
    try {
      stored = document.defaultView?.localStorage?.getItem('ngxsmk-theme-mode') ?? null;
    } catch {
      // localStorage unavailable
    }
    if (!stored) {
      this.theme.setMode('light');
    }
  }

  protected getItemFragment(item: string): string {
    return item
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
  }

  protected navigateCat(path: string): void {
    this.router.navigate(['/showcase', path]);
  }

  protected readonly bentoCards: BentoCard[] = [
    {
      icon: '⚡',
      title: 'Angular First',
      desc: 'Built specifically for modern Angular with signals, standalone components, and pure zoneless change detection.',
      tag: 'Signals & Zoneless',
      accent: '#6366f1',
    },
    {
      icon: '🛡️',
      title: 'Type Safe',
      desc: 'Developer friendly TypeScript APIs. Every component uses signal inputs, two-way models, and typed event outputs.',
      tag: 'TypeScript Native',
      accent: '#3b82f6',
    },
    {
      icon: '🎨',
      title: 'Universal Theming',
      desc: 'Flexible themes and variants driven by CSS custom properties. Dynamic preset switching with Tailwind v3/v4 support.',
      tag: 'Design Tokens',
      accent: '#10b981',
    },
    {
      icon: '📦',
      title: 'Production Ready',
      desc: '150+ reusable components designed for real applications. Zero bloated external runtime dependencies.',
      tag: '0 Dependencies',
      accent: '#f59e0b',
    },
    {
      icon: '📱',
      title: 'Responsive & Accessible',
      desc: 'Follows WCAG AA accessibility standards with full keyboard navigation, visible focus rings, and seamless mobile reflow.',
      tag: 'WCAG AA Compliant',
      accent: '#ec4899',
    },
    {
      icon: '🤖',
      title: 'AI-First Tooling',
      desc: 'Includes an MCP component database, LLM-readable API reference (llms.txt), and Claude Code skills for instant scaffolding.',
      tag: 'MCP & LLM Ready',
      accent: '#7c3aed',
    },
  ];

  protected readonly stats: Stat[] = [
    { value: '150+', label: 'Components', accent: '#6366f1' },
    { value: '0', label: 'Runtime deps', accent: '#10b981' },
    { value: 'Signals', label: 'Reactivity', accent: '#f59e0b' },
    { value: 'MIT', label: 'Licensed', accent: '#3b82f6' },
  ];

  protected readonly codeExample = `import { Component, signal } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';

@Component({
  selector: 'app-hero-demo',
  standalone: true,
  imports: [NgxsmkButton, NgxsmkBadge, NgxsmkInputDirective],
  template: \`
    <div class="user-card">
      <ngxsmk-badge variant="primary">v3.0.0</ngxsmk-badge>
      <input ngxsmkInput placeholder="Enter username..." />
      <button ngxsmk-button (click)="submit()">
        Save Changes
      </button>
    </div>
  \`
})
export class HeroDemoComponent {
  readonly username = signal('');
  submit() { /* Signal action */ }
}`;

  protected readonly techFeatures = [
    { label: 'Signals-Native', desc: 'input(), input.required(), model(), computed(), effect()' },
    { label: 'Standalone Only', desc: 'Zero NgModules — every component is a standalone entry' },
    { label: 'Pure Zoneless', desc: 'Operates flawlessly without zone.js dependency' },
    { label: 'SSR & Hydration', desc: 'Server-side rendering and hydration ready out of the box' },
    { label: 'OnPush By Default', desc: 'Every component utilizes OnPush change detection' },
    { label: 'Dark Mode Ready', desc: 'Seamless CSS custom properties toggle via .dark class' },
  ];

  protected readonly categoryGroups: CategoryGroup[] = [
    {
      title: 'Actions & Buttons',
      icon: '🔘',
      path: 'forms',
      count: 27,
      color: '#6366f1',
      desc: 'Buttons, toggle groups, icon buttons, loading triggers, split actions.',
      items: ['Button', 'Button Group', 'Toggle Button', 'Split Button', 'FAB', 'Expanding Arrow'],
    },
    {
      title: 'Forms & Inputs',
      icon: '📝',
      path: 'forms',
      count: 25,
      color: '#3b82f6',
      desc: 'Form controls, selects, typeaheads, date pickers, switches, and sliders.',
      items: ['Input', 'Select', 'Checkbox', 'Radio', 'Switch', 'Date Picker', 'Slider', 'OTP Input'],
    },
    {
      title: 'Navigation',
      icon: '🧭',
      path: 'navigation',
      count: 9,
      color: '#0d9488',
      desc: 'Tabs, breadcrumbs, menus, sidebars, mega menus, and mobile drawers.',
      items: ['Top Nav', 'Side Nav', 'Tab Menu', 'Breadcrumb', 'Mega Menu', 'Outline'],
    },
    {
      title: 'Feedback & Status',
      icon: '🔔',
      path: 'feedback',
      count: 8,
      color: '#f59e0b',
      desc: 'Alerts, toasts, badges, progress bars, spinners, skeletons, and empty states.',
      items: ['Alert', 'Badge', 'Progress', 'Skeleton', 'Spinner', 'Empty State', 'Banner'],
    },
    {
      title: 'Data Display',
      icon: '📊',
      path: 'data-display',
      count: 11,
      color: '#10b981',
      desc: 'Tables, data grids, accordions, avatars, metadata lists, and chip tags.',
      items: ['Table', 'Data Table', 'Accordion', 'Avatar', 'Tag & Chip', 'Metadata List'],
    },
    {
      title: 'Overlays & Modals',
      icon: '🪟',
      path: 'overlay',
      count: 8,
      color: '#dc2626',
      desc: 'Dialogs, alert dialogs, sheets, tooltips, hover cards, and dropdown menus.',
      items: ['Dialog', 'Alert Dialog', 'Tooltip', 'Hover Card', 'Sheet', 'Dropdown Menu'],
    },
    {
      title: 'Data Visualization',
      icon: '📈',
      path: 'charts',
      count: 10,
      color: '#059669',
      desc: 'Lightweight, theme-reactive SVG charts with zero external dependencies.',
      items: ['Line Chart', 'Bar Chart', 'Pie Chart', 'Area Chart', 'Heatmap', 'Sparkline'],
    },
    {
      title: 'AI Interfaces',
      icon: '✦',
      path: 'ai',
      count: 21,
      color: '#7c3aed',
      desc: 'Chat windows, dictation buttons, streaming text, reasoning traces, and citations.',
      items: ['Chat Window', 'Streaming Text', 'Markdown Viewer', 'Code Block', 'Diff Viewer'],
    },
    {
      title: 'Enterprise Tools',
      icon: '🏢',
      path: 'enterprise',
      count: 13,
      color: '#ef4444',
      desc: 'Kanban boards, schedulers, spreadsheets, workflow builders, and Gantt charts.',
      items: ['Kanban Board', 'Scheduler', 'Timeline Gantt', 'Spreadsheet', 'Workflow Builder'],
    },
  ];

  protected readonly filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.categoryGroups;
    return this.categoryGroups.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q) ||
        c.items.some((item) => item.toLowerCase().includes(q)),
    );
  });

  protected copyInstall(): void {
    document.defaultView?.navigator?.clipboard
      ?.writeText(this.installCommand)
      .then(() => {
        this.copied.set(true);
        this.toast.success('Copied to clipboard', this.installCommand);
        setTimeout(() => this.copied.set(false), 2500);
      })
      .catch(() => this.toast.error('Copy failed', 'Clipboard is unavailable.'));
  }
}
