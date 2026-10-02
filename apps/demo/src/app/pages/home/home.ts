import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AppNav } from '../../nav/nav';
import { NgxsmkThemeService, presets, type ThemeConfig } from '@ngxsmk/theme';
import { APP_VERSION } from '../../core/version';

import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkToast } from '@ngxsmk/core/toast';

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AppNav,
    NgxsmkButton,
    NgxsmkBadge,
    NgxsmkStat,
    NgxsmkSwitch,
    NgxsmkCheckbox,
    NgxsmkInputDirective,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage implements OnInit {
  protected readonly appVersion = APP_VERSION;
  protected readonly theme = inject(NgxsmkThemeService);
  private readonly toast = inject(NgxsmkToast);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly installCommand = 'npm install @ngxsmk/core @ngxsmk/theme';
  protected readonly copied = signal(false);
  protected readonly hasCopiedInstall = signal(false);
  protected readonly hasCopiedSnippet = signal(false);
  protected readonly notifyEmail = signal(true);
  protected readonly selectedSku = signal(true);
  protected readonly selectedIds = signal<(string | number)[]>([1, 3]);
  protected readonly shippingId = signal('standard');

  copyInstallCommand(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText('npm i @ngxsmk/core @ngxsmk/theme');
      this.hasCopiedInstall.set(true);
      this.copied.set(true);
      this.toast.success('Copied to clipboard', 'npm i @ngxsmk/core @ngxsmk/theme');
      setTimeout(() => {
        this.hasCopiedInstall.set(false);
        this.copied.set(false);
      }, 2000);
    }
  }

  copySnippet(): void {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(this.sandboxSnippet());
      this.hasCopiedSnippet.set(true);
      this.toast.success('Snippet Copied', 'Paste directly into your Angular template');
      setTimeout(() => this.hasCopiedSnippet.set(false), 2000);
    }
  }

  // Active theme preset
  protected readonly activePreset = signal<string>('ink');
  protected readonly presetList = [
    { name: 'emerald', label: 'Emerald', primary: '#059669', bg: '#DEF1E7' },
    { name: 'ink', label: 'Ink', primary: '#0D9488', bg: '#18181B' },
    { name: 'violet', label: 'Violet', primary: '#7C3AED', bg: '#EDE9FE' },
    { name: 'rose', label: 'Rose', primary: '#E11D48', bg: '#FFE4E6' },
    { name: 'neutral', label: 'Graphite', primary: '#27272A', bg: '#F4F4F5' },
  ];

  protected applyPreset(name: string): void {
    this.activePreset.set(name);
    const p = (presets as Record<string, ThemeConfig | undefined>)[name];
    if (p) {
      this.theme.applyTheme(p);
      this.toast.success('Preset Applied', `Switched theme to ${name.toUpperCase()}`);
    }
  }

  // Interactive Component Sandbox
  protected readonly sandboxTab = signal<
    'button' | 'badge' | 'switch' | 'stat' | 'checkbox' | 'input'
  >('button');
  protected readonly sandboxVariant = signal<'primary' | 'secondary' | 'outline' | 'ghost'>(
    'primary',
  );
  protected readonly sandboxSize = signal<'sm' | 'md' | 'lg'>('md');
  protected readonly sandboxSwitchVal = signal(true);
  protected readonly sandboxCheckboxVal = signal(true);
  protected readonly sandboxCopied = signal(false);

  protected readonly sandboxSnippet = computed(() => {
    const tab = this.sandboxTab();
    const variant = this.sandboxVariant();
    const size = this.sandboxSize();
    if (tab === 'button') {
      return `<button ngxsmk-button variant="${variant}" size="${size}">\n  Explore Signals\n</button>`;
    } else if (tab === 'badge') {
      return `<ngxsmk-badge variant="${variant === 'outline' ? 'outline' : 'primary'}">\n  Production Ready\n</ngxsmk-badge>`;
    } else if (tab === 'switch') {
      return `<ngxsmk-switch [(checked)]="isEnabled">\n  Enable Zoneless Mode\n</ngxsmk-switch>`;
    } else if (tab === 'checkbox') {
      return `<ngxsmk-checkbox [(checked)]="isZoneless">\n  100% Zoneless Signals\n</ngxsmk-checkbox>`;
    } else if (tab === 'input') {
      return `<input ngxsmkInput placeholder="Search 150+ components..." />`;
    } else {
      return `<ngxsmk-stat\n  label="Render Latency"\n  value="0.4ms"\n  trend="up"\n/>`;
    }
  });

  protected readonly liveState = computed(() => {
    const tab = this.sandboxTab();
    if (tab === 'button') {
      return `variant="${this.sandboxVariant()}", size="${this.sandboxSize()}"`;
    } else if (tab === 'badge') {
      return `variant="${this.sandboxVariant()}"`;
    } else if (tab === 'switch') {
      return `checked=${this.sandboxSwitchVal()}`;
    } else if (tab === 'stat') {
      return `trend="up", value="0.4ms"`;
    } else if (tab === 'checkbox') {
      return `checked=${this.sandboxCheckboxVal()}`;
    } else {
      return `value="ngxsmk"`;
    }
  });

  protected readonly features = [
    {
      key: 'signals',
      tag: 'Reactivity',
      title: 'Signals-Native Reactivity',
      desc: 'Built exclusively with Angular signals (input, model, output, and computed). Zero Zone.js patching and clean reactive data flow.',
    },
    {
      key: 'zoneless',
      tag: 'Performance',
      title: '100% Zoneless Architecture',
      desc: 'Completely eliminates Zone.js overhead from your production app. Micro-task change detection and sub-millisecond render frames.',
    },
    {
      key: 'tokens',
      tag: 'Design Tokens',
      title: 'Universal Token Engine',
      desc: '150+ pure CSS custom properties (--ngxsmk-*). Switch themes dynamically between Emerald, Ink, Violet, Rose, and Graphite without rebuilding.',
    },
    {
      key: 'a11y',
      tag: 'WCAG 2.1 AAA',
      title: 'Accessibility By Default',
      desc: 'Every primitive is keyboard navigable, screen-reader announced, focus-trapped, and Axe-core verified with ARIA 1.2 compliant semantics.',
    },
    {
      key: 'enterprise',
      tag: 'Enterprise Ready',
      title: 'Enterprise Data Grid & Tools',
      desc: 'Heavy-duty virtualized data tables, Kanban boards, Gantt charts, audio players, signature pads, and docking bars ready out of the box.',
    },
    {
      key: 'ai',
      tag: 'AI & MCP Native',
      title: 'Built-in MCP Server & AI Tools',
      desc: 'Includes a stdio MCP server for Claude Code, Cursor, and Windsurf. Autonomous coding agents can search components and write idiomatic templates directly.',
    },
  ];

  protected readonly comparisonRows = [
    {
      capability: 'Signals & Zoneless Native',
      ngxsmk: '✅ 100% Signals (0 Zone.js)',
      material: '⚠️ Hybrid / Zone.js dependent',
      primeng: '⚠️ Legacy CD & Partial',
    },
    {
      capability: 'Design Token Engine',
      ngxsmk: '✅ 150+ Pure CSS Tokens',
      material: '⚠️ Heavy Sass / M3 mixins',
      primeng: '⚠️ Sass theme files',
    },
    {
      capability: 'AI Coding Tools & MCP',
      ngxsmk: '✅ Built-in MCP Server (@ngxsmk/mcp)',
      material: '❌ None',
      primeng: '❌ None',
    },
    {
      capability: 'Secondary Entry Points',
      ngxsmk: '✅ 100% Tree-Shakeable (@ngxsmk/core/*)',
      material: '⚠️ Deep imports',
      primeng: '⚠️ Monolithic bundles',
    },
    {
      capability: 'Cross-Platform Ionic Sync',
      ngxsmk: '✅ provideNgxsmkIonicTheme()',
      material: '❌ Incompatible styling',
      primeng: '❌ Web only',
    },
    {
      capability: 'Bundle Size Per Primitive',
      ngxsmk: '✅ < 15kB chunk',
      material: '⚠️ 45kB+ per module',
      primeng: '⚠️ 60kB+ per module',
    },
  ];

  protected copySandboxCode(): void {
    document.defaultView?.navigator?.clipboard?.writeText(this.sandboxSnippet()).then(() => {
      this.sandboxCopied.set(true);
      this.toast.success('Snippet Copied', 'Paste directly into your Angular template');
      setTimeout(() => this.sandboxCopied.set(false), 2000);
    });
  }

  protected readonly inventoryColumns = [
    { key: 'item', label: 'Item' },
    { key: 'available', label: 'Available' },
    { key: 'location', label: 'Location' },
    { key: 'tag', label: 'Tag' },
  ];

  protected readonly inventoryRows = [
    { id: 1, item: 'Signal Kit', available: 64, location: 'Case 1', tag: 'Fresh' },
    { id: 2, item: 'Theme Pack', available: 38, location: 'Shelf B', tag: 'Popular' },
    { id: 3, item: 'AI Console', available: 51, location: 'Aisle 3', tag: 'New' },
    { id: 4, item: 'Ops Table', available: 12, location: 'Case 2', tag: 'Classic' },
    { id: 5, item: 'Form Bundle', available: 27, location: 'Cooler', tag: 'Staple' },
  ];

  protected readonly products = [
    {
      title: 'Minimalist watch',
      desc: 'Clean design, everyday durability.',
      badge: 'Limited',
      price: '$248',
      tone: 'stone',
    },
    {
      title: 'Canvas backpack',
      desc: 'Water-resistant daily carry.',
      badge: 'New',
      price: '$128',
      tone: 'teal',
    },
    {
      title: 'Linen throw',
      desc: 'Soft layers for quiet spaces.',
      badge: 'Popular',
      price: '$89',
      tone: 'sand',
    },
  ];

  protected readonly shipping = [
    { id: 'economy', label: 'Economy Shipping', eta: '5–7 business days', price: '$12.00' },
    { id: 'standard', label: 'Standard Shipping', eta: '3–5 business days', price: '$16.00' },
    { id: 'express', label: 'Express Shipping', eta: '1–2 business days', price: '$24.00' },
  ];

  protected readonly activity = [
    { id: 'Order #1043', meta: 'Placed · 1:59 pm', amount: '+$248' },
    { id: 'Order #1041', meta: 'Refunded · 12:40 pm', amount: '−$89' },
    { id: 'Order #1040', meta: 'Placed · 10:30 am', amount: '+$156' },
    { id: 'Order #1038', meta: 'Placed · 9:11 am', amount: '+$412' },
  ];

  protected readonly trustBadges = [
    {
      id: 'components',
      label: 'Components',
      value: '260+',
      detail: 'Signals-native secondary entries',
    },
    {
      id: 'zoneless',
      label: 'Zoneless',
      value: 'CI gated',
      detail: 'npm run check:zoneless',
    },
    {
      id: 'a11y',
      label: 'A11y',
      value: 'Top-20 axe',
      detail: 'A11Y top-20 + runtime axe host',
    },
    {
      id: 'bundles',
      label: 'Bundle size',
      value: 'CI gated',
      detail: 'Baseline growth check',
    },
    {
      id: 'visual',
      label: 'Visual',
      value: 'Playwright',
      detail: 'Light + dark baselines',
    },
    {
      id: 'agents',
      label: 'Agents',
      value: 'MCP',
      detail: 'Scaffold with correct imports',
    },
  ];

  protected readonly motionHero = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, easing: 'ease-out' },
  };
  protected readonly motionTitle = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: 0.05, easing: 'ease-out' },
  };
  protected readonly motionCta = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay: 0.12, easing: 'ease-out' },
  };
  protected readonly motionStage = {
    initial: { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay: 0.18, easing: 'ease-out' },
  };

  ngOnInit(): void {
    this.title.setTitle('NGXSMK — Open source Angular design system, agent ready');
    this.meta.updateTag({
      name: 'description',
      content:
        'NGXSMK is an open source Angular design system — signals-native, zoneless, fully customizable themes, and agent-ready with MCP.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'NGXSMK — fully customizable and agent ready',
    });

    try {
      const stored = document.defaultView?.localStorage?.getItem('ngxsmk-theme-mode') ?? null;
      if (!stored) this.theme.setMode('light');
    } catch {
      /* noop */
    }
  }

  protected onHeroSend(text: string): void {
    this.toast.info('Demo only', text.slice(0, 80));
  }

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
