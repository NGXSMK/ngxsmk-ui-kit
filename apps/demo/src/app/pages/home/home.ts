import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkToast, NgxsmkToaster } from '@ngxsmk/core/toast';
import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AppNav } from '../../nav/nav';
import { NgxsmkAnimate } from '@ngxsmk/core/animation';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { APP_VERSION } from '../../core/version';

interface BentoCard {
  icon: string;
  title: string;
  desc: string;
  span?: 'wide' | 'tall' | 'full';
  accent?: string;
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
    this.title.setTitle('NGXSMK — Signal-Native Angular UI Kit | 150+ Components');
    this.meta.updateTag({
      name: 'description',
      content:
        'NGXSMK is a signal-native, zoneless Angular component library with 150+ standalone components, a universal design-token engine, and AI-first tooling. MIT licensed, zero runtime dependencies.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'NGXSMK — Signal-Native Angular UI Kit | 150+ Components',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Signal-native, zoneless Angular components with a universal token engine. Copy-paste scaffolding, AI tooling, and enterprise widgets — all MIT licensed.',
    });
    this.meta.updateTag({
      name: 'keywords',
      content:
        'Angular UI kit, Angular components, signal components, zoneless Angular, design system, Angular 19, Angular 20, standalone components, token engine, MIT, AI components, enterprise widgets',
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
      title: 'home.featNativeTitle',
      desc: 'home.featNativeDesc',
      span: 'wide',
      accent: '#6366f1',
    },
    {
      icon: '◇',
      title: 'home.featCopyPasteTitle',
      desc: 'home.featCopyPasteDesc',
      accent: '#f59e0b',
    },
    {
      icon: '✦',
      title: 'home.featAiTitle',
      desc: 'home.featAiDesc',
      accent: '#7c3aed',
    },
    {
      icon: '❖',
      title: 'home.featThemesTitle',
      desc: 'home.featThemesDesc',
      span: 'wide',
      accent: '#10b981',
    },
    {
      icon: '▤',
      title: 'home.featEnterpriseTitle',
      desc: 'home.featEnterpriseDesc',
      accent: '#ef4444',
    },
    {
      icon: '⌘',
      title: 'home.featEcosystemTitle',
      desc: 'home.featEcosystemDesc',
      accent: '#3b82f6',
    },
  ];

  protected readonly stats: Stat[] = [
    { value: '150+', label: 'Components', accent: '#6366f1' },
    { value: '0', label: 'Runtime deps', accent: '#10b981' },
    { value: 'WCAG AA', label: 'Accessible', accent: '#f59e0b' },
    { value: 'MIT', label: 'Licensed', accent: '#3b82f6' },
  ];

  protected readonly codeExample = `<button ngxsmk-button>
  Get Started
</button>

<button ngxsmk-button variant="outline">
  Learn More
</button>

<ngxsmk-badge variant="primary">
  v2.1.0
</ngxsmk-badge>

<ngxsmk-progress [value]="75" />`;

  protected readonly techFeatures = [
    { label: 'Signals', desc: 'input(), model(), computed(), effect()' },
    { label: 'Standalone', desc: 'No NgModules — every component is standalone' },
    { label: 'Zoneless', desc: 'No Zone.js dependency — pure signal reactivity' },
    { label: 'SSR', desc: 'Server-side rendering ready out of the box' },
    { label: 'OnPush', desc: 'All components use OnPush change detection' },
    { label: 'Dark Mode', desc: 'CSS custom properties with .dark class toggle' },
  ];

  protected readonly categoryGroups: CategoryGroup[] = [
    {
      title: 'Forms',
      icon: '📝',
      path: 'forms',
      count: 25,
      color: '#6366f1',
      items: ['Button', 'Input', 'Checkbox', 'Radio', 'Switch', 'Select', 'Slider', 'DatePicker'],
    },
    {
      title: 'AI',
      icon: '✦',
      path: 'ai',
      count: 21,
      color: '#7c3aed',
      items: ['ChatWindow', 'StreamingText', 'MarkdownViewer', 'CodeBlock', 'DiffViewer'],
    },
    {
      title: 'Enterprise',
      icon: '🏢',
      path: 'enterprise',
      count: 13,
      color: '#ef4444',
      items: ['Kanban', 'Scheduler', 'Spreadsheet', 'Gantt', 'Workflow'],
    },
    {
      title: 'Data Display',
      icon: '📊',
      path: 'data-display',
      count: 11,
      color: '#10b981',
      items: ['Table', 'Accordion', 'Tabs', 'List', 'Stat'],
    },
    {
      title: 'Overlay',
      icon: '🪟',
      path: 'overlay',
      count: 8,
      color: '#f59e0b',
      items: ['Dialog', 'Sheet', 'Tooltip', 'ContextMenu'],
    },
    {
      title: 'Charts',
      icon: '📈',
      path: 'charts',
      count: 8,
      color: '#3b82f6',
      items: ['Line', 'Bar', 'Pie', 'Area', 'Heatmap'],
    },
  ];

  protected readonly filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.categoryGroups;
    return this.categoryGroups.filter(
      (c) =>
        c.title.toLowerCase().includes(q) || c.items.some((item) => item.toLowerCase().includes(q)),
    );
  });

  protected readonly copied = signal(false);

  protected copyInstall(): void {
    document.defaultView?.navigator?.clipboard
      ?.writeText(this.installCommand)
      .then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      })
      .catch(() => this.toast.error('Copy failed', 'Clipboard is unavailable.'));
  }
}
