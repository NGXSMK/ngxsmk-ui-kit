import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkDialog, NgxsmkDialogFooter } from '@ngxsmk/core/dialog';
import { NgxsmkTag } from '@ngxsmk/core/tag';
import { NgxsmkToast, NgxsmkToaster } from '@ngxsmk/core/toast';
import { NgxsmkAvatar } from '@ngxsmk/core/avatar';
import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AppNav } from '../../nav/nav';
import { NgxsmkAnimate } from '@ngxsmk/core/animation';
import { NgxsmkThemeService } from '@ngxsmk/theme';

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Stat {
  value: string;
  label: string;
}

interface Template {
  name: string;
  description: string;
  badges: string[];
  glyph: string;
}

interface ComponentCategory {
  title: string;
  path: string;
  items: string[];
}

@Component({
  selector: 'home-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AppNav,
    NgxsmkAvatar,
    NgxsmkButton,
    NgxsmkDialog,
    NgxsmkDialogFooter,
    NgxsmkTag,
    NgxsmkToaster,
    NgxsmkAnimate,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  protected readonly theme = inject(NgxsmkThemeService);
  private readonly toast = inject(NgxsmkToast);
  private readonly router = inject(Router);

  protected readonly installCommand = 'npm install @ngxsmk/core @ngxsmk/theme';
  protected readonly searchQuery = signal('');

  protected readonly motionHero = {
    initial: { opacity: 0, scale: 0.97 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, easing: 'ease-out' }
  };

  protected readonly motionTitle = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, delay: 0.1, easing: 'ease-out' }
  };

  protected readonly motionCta = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, delay: 0.25, easing: 'ease-out' }
  };

  protected readonly motionBento = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.6, delay: 0.35, easing: 'ease-out' }
  };

  protected getItemFragment(item: string): string {
    return item
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-');
  }

  protected navigateCat(path: string): void {
    this.router.navigate(['/showcase', path]);
  }

  protected readonly categories: ComponentCategory[] = [
    {
      title: 'Forms',
      path: 'forms',
      items: [
        'Button',
        'Button Group',
        'FAB (Floating Action)',
        'Split Button',
        'Toggle Button',
        'Toggle Button Group',
        'Input',
        'Checkbox',
        'Checkbox List',
        'Radio',
        'Switch',
        'Textarea',
        'Number Input',
        'Select',
        'Multi Select',
        'Autocomplete',
        'Combobox',
        'Typeahead',
        'Power Search',
        'Slider',
        'Date Picker',
        'Segmented Control',
        'Selector',
        'Multi Selector',
        'Tokenizer',
        'Input Group',
        'Field',
        'Form Field',
      ],
    },
    {
      title: 'AI',
      path: 'ai',
      items: [
        'Interactive AI Chat',
        'Agent Card',
        'Chat Window',
        'Chat Input',
        'Chat Layout',
        'Chat Send Button',
        'Chat Dictation Button',
        'Chat Tokens',
        'Conversation List',
        'Composer Drawer',
        'Streaming Text',
        'Markdown Viewer',
        'Code Block',
        'Diff Viewer',
        'Citation Viewer',
        'Tool Call Viewer',
        'Reasoning Timeline',
        'Memory Viewer',
        'Voice Input',
        'Audio Player',
        'Image Viewer',
      ],
    },
    {
      title: 'Enterprise',
      path: 'enterprise',
      items: [
        'Kanban Board',
        'Scheduler',
        'Timeline Gantt',
        'Workflow Builder',
        'Rule Builder',
        'Spreadsheet',
        'Pivot Table',
        'Diagram Builder',
        'Flow Editor',
        'JSON Viewer',
        'Terminal',
        'Org Chart',
        'Query Builder',
      ],
    },
    {
      title: 'Content & Typography',
      path: 'content-typography',
      items: [
        'Heading',
        'Text',
        'Blockquote',
        'Code',
        'Kbd',
        'Link',
        'Thumbnail',
        'Timestamp',
        'Token',
        'Citation',
        'Markdown',
      ],
    },
    {
      title: 'Navigation',
      path: 'navigation',
      items: [
        'Breadcrumb Item',
        'Outline',
        'Tab Menu',
        'Nav Icon',
        'Nav Heading Menu',
        'Side Nav',
        'Top Nav',
        'Mega Menu',
        'Mobile Nav',
      ],
    },
    {
      title: 'Layout',
      path: 'layout',
      items: [
        'Center',
        'Section',
        'Container',
        'Grid',
        'Flex',
        'HStack',
        'VStack',
        'Stack',
        'Divider',
        'Aspect Ratio',
        'Spacer',
        'Collapsible',
        'Resizable',
        'App Shell',
        'Form Layout',
      ],
    },
    {
      title: 'Feedback',
      path: 'feedback',
      items: [
        'Alert',
        'Banner',
        'Badge',
        'Progress',
        'Progress Circle',
        'Skeleton',
        'Spinner',
        'Empty State',
        'Status Dot',
      ],
    },
    {
      title: 'Data Display',
      path: 'data-display',
      items: [
        'Tabs',
        'Accordion',
        'Avatar',
        'Tag & Chip',
        'Table',
        'Data Table',
        'List',
        'Metadata List',
        'Overflow List',
        'Stat',
        'Status Dot',
        'Carousel',
        'Tree View',
        'QR Code',
      ],
    },
    {
      title: 'Overlay',
      path: 'overlay',
      items: [
        'Dialog',
        'Alert Dialog',
        'Tooltip',
        'Hover Card',
        'Sheet',
        'Dropdown Menu',
        'Context Menu',
        'Lightbox',
      ],
    },
    {
      title: 'Charts',
      path: 'charts',
      items: [
        'Line Chart',
        'Bar Chart',
        'Pie Chart',
        'Area Chart',
        'Scatter Chart',
        'Candlestick Chart',
        'Heatmap',
        'Dashboard',
      ],
    },
    {
      title: 'Utilities & Hooks',
      path: 'utilities',
      items: [
        'Theme Builder',
        'Component Playground',
        'Visually Hidden',
        'Focus Trap',
        'Click Outside',
        'Keyboard Shortcut',
        'Copy to Clipboard',
        'Scroll Lock',
        'Resize Observer',
        'Intersection Observer',
        'Lazy Load',
        'Layer Provider',
        'Media Query',
        'Media Theme',
      ],
    },
  ];

  protected readonly filteredCategories = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.categories;
    return this.categories
      .map((c) => ({
        ...c,
        items: c.items.filter(
          (item) => item.toLowerCase().includes(q) || c.title.toLowerCase().includes(q),
        ),
      }))
      .filter((c) => c.items.length > 0);
  });

  protected readonly features: Feature[] = [
    {
      icon: '⚡',
      title: 'Angular-native',
      description:
        'Built with signals, standalone components, and zoneless change detection. Never a port - designed for modern Angular.',
    },
    {
      icon: '◇',
      title: 'Copy-paste DX',
      description:
        'Own your components. npx ngxsmk add drops the source into your project - no black-box dependencies.',
    },
    {
      icon: '✦',
      title: 'AI components',
      description:
        'Chat windows, streaming text, agent tool calls, and reasoning timelines - a design system built for the AI era.',
    },
    {
      icon: '▤',
      title: 'Enterprise suite',
      description:
        'Kanban, workflow, spreadsheet, pivot table, and diagram editors - all free under an MIT license.',
    },
    {
      icon: '❖',
      title: 'Universal themes',
      description:
        'One token engine outputs CSS variables, SCSS, Tailwind, or JSON. Swap the entire look at runtime with zero lock-in.',
    },
    {
      icon: '⌘',
      title: 'Complete ecosystem',
      description:
        'CLI, schematics, VS Code extension, playground, and an MCP server for AI coding assistants.',
    },
  ];

  protected readonly stats: Stat[] = [
    { value: '217', label: 'Components' },
    { value: '0', label: 'Runtime deps' },
    { value: 'WCAG AA', label: 'Accessible' },
    { value: 'MIT', label: 'Licensed' },
  ];

  protected readonly templates: Template[] = [
    {
      name: 'Admin dashboard',
      description: 'Sidebar layout, data tables, charts, and settings.',
      badges: ['Signals', 'Zoneless'],
      glyph: '▦',
    },
    {
      name: 'AI assistant',
      description: 'Chat interface with streaming and tool calls.',
      badges: ['AI', 'SSR'],
      glyph: '✦',
    },
    {
      name: 'Landing page',
      description: 'Marketing hero, features, and pricing sections.',
      badges: ['Static', 'Fast'],
      glyph: '◈',
    },
    {
      name: 'Authentication',
      description: 'Sign-in, sign-up, and multi-step onboarding flows.',
      badges: ['Forms', 'A11y'],
      glyph: '⛨',
    },
  ];

  protected readonly copied = signal(false);

  protected readonly agreed = signal(true);
  protected readonly notifications = signal(false);
  protected readonly dialogOpen = signal(false);

  constructor() {
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

  protected copyInstall(): void {
    document.defaultView?.navigator?.clipboard
      ?.writeText(this.installCommand)
      .then(() => {
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      })
      .catch(() => this.toast.error('Copy failed', 'Clipboard is unavailable.'));
  }

  protected confirmDialog(): void {
    this.dialogOpen.set(false);
    this.toast.info('Deleted', 'The file has been removed.');
  }
}
