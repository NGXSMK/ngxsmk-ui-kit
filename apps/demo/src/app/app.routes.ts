import { Routes } from '@angular/router';
import { ShowcaseLayout } from './showcase-layout/showcase-layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
    title: 'NGXSMK - High-Performance Zoneless Angular Design System',
    data: {
      description:
        'NGXSMK is a premium, MIT-licensed Angular design system engineered with signals, zoneless change detection, and modular token customizers. Build AI-first chat interfaces and enterprise tools in minutes.',
    },
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs').then((m) => m.DocsPage),
    title: 'Documentation - NGXSMK',
    data: {
      description:
        'Get started with NGXSMK. View step-by-step guides, command-line scaffolding commands, architectural pillars, and customizable HSL themes.',
    },
  },
  {
    path: 'api',
    loadComponent: () =>
      import('./pages/api-reference/api-reference').then((m) => m.ApiReferencePage),
    title: 'API Reference - Generated Component APIs | NGXSMK',
    data: {
      description:
        'Complete generated API reference for every NGXSMK component and directive: signal inputs, two-way models, outputs, types, and defaults — extracted directly from the source.',
    },
  },
  {
    path: 'templates',
    loadComponent: () => import('./pages/templates/templates').then((m) => m.TemplatesPage),
    title: 'Templates - Production-Ready Page Layouts | NGXSMK',
    data: {
      description:
        'Production-ready page templates built with NGXSMK. Scaffold admin dashboards, AI assistant chat boxes, SaaS landing pages, and responsive login flows.',
    },
  },
  {
    path: 'themes',
    loadComponent: () => import('./pages/themes/themes').then((m) => m.ThemesPage),
    title: 'Themes & Tokens - Dynamic Appearance | NGXSMK',
    data: {
      description:
        'Customize the appearance of your NGXSMK components at runtime. Toggle between light/dark modes and apply preset color palettes instantly.',
    },
  },
  {
    path: 'ionic',
    loadComponent: () => import('./pages/ionic/ionic').then((m) => m.IonicPage),
    title: 'Ionic Integration - NGXSMK in Ionic apps | NGXSMK',
    data: {
      description:
        'Run NGXSMK inside Ionic. Map NGXSMK design tokens onto Ionic --ion-* variables, lock ion-content scrolling from overlays, and honor mobile safe-area insets.',
    },
  },
  {
    path: 'playground',
    loadComponent: () => import('./pages/playground/playground').then((m) => m.PlaygroundPage),
    title: 'Playground - Interactive Theme Editor | NGXSMK',
    data: {
      description:
        'Test and preview NGXSMK components inside our interactive theme builder. Modify spacing, shadows, border radius, and typography tokens.',
    },
  },
  {
    path: 'playground/component',
    loadComponent: () =>
      import('./pages/interactive-playground/interactive-playground').then(
        (m) => m.InteractivePlayground,
      ),
    title: 'Component Playground - Live Prop Editing | NGXSMK',
    data: {
      description:
        'Select any NGXSMK component, edit its properties in real-time, and copy the generated Angular template code.',
    },
  },
  {
    path: 'community',
    loadComponent: () => import('./pages/community/community').then((m) => m.CommunityPage),
    title: 'Community & Contributing - Join the Ecosystem | NGXSMK',
    data: {
      description:
        'Join the NGXSMK community. Suggest features, report issues, and share feedback with the maintainers.',
    },
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then((m) => m.BlogPage),
    title: 'Blog & News - Latest Design System Updates | NGXSMK',
    data: {
      description:
        'Stay up to date with the latest news, updates, design philosophies, and technical releases from the NGXSMK design system team.',
    },
  },
  {
    path: 'changelog',
    loadComponent: () => import('./pages/changelog/changelog').then((m) => m.ChangelogPage),
    title: 'Changelog & Release Notes - Version History | NGXSMK',
    data: {
      description:
        'Browse release notes and version history for NGXSMK. Track new component additions, performance optimizations, and API updates.',
    },
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./pages/roadmap/roadmap').then((m) => m.RoadmapPage),
    title: 'Roadmap - Upcoming Features & Future Releases | NGXSMK',
    data: {
      description:
        'View the product roadmap for NGXSMK. Explore upcoming components, enterprise tool enhancements, and AI integration plans.',
    },
  },
  {
    path: 'showcase',
    component: ShowcaseLayout,
    children: [
      { path: '', redirectTo: 'content-typography', pathMatch: 'full' },
      {
        path: 'explorer',
        loadComponent: () =>
          import('./pages/component-explorer/component-explorer').then((m) => m.ComponentExplorer),
        title: 'Component Explorer — Browse All Components | NGXSMK',
        data: {
          description:
            'Browse the complete NGXSMK component catalog. Search, filter by category, and explore signal-native form controls, AI interfaces, enterprise tools, and layout primitives.',
        },
      },
      {
        path: 'content-typography',
        loadComponent: () =>
          import('./pages/content-typography/content-typography').then(
            (m) => m.ContentTypographyPage,
          ),
        title: 'Content & Typography - Showcase | NGXSMK',
        data: {
          description:
            'Explore text primitives, headings, blockquotes, codeblocks, keyboard shortcuts, links, and markdown rendering elements in NGXSMK.',
        },
      },
      {
        path: 'navigation',
        loadComponent: () => import('./pages/navigation/navigation').then((m) => m.NavigationPage),
        title: 'Navigation Components - Showcase | NGXSMK',
        data: {
          description:
            'Browse navigation menus, tabs, breadcrumbs, side navigation sidebars, and mega-menus built with NGXSMK.',
        },
      },
      {
        path: 'layout',
        loadComponent: () => import('./pages/layout/layout').then((m) => m.LayoutPage),
        title: 'Layout Primitives - Showcase | NGXSMK',
        data: {
          description:
            'Responsive layout primitives for building grid layouts, stacks, flexboxes, dividers, aspect ratios, resizable panels, and app shells.',
        },
      },
      {
        path: 'forms',
        loadComponent: () => import('./pages/forms/forms').then((m) => m.FormsPage),
        title: 'Form Controls - Showcase | NGXSMK',
        data: {
          description:
            'Explore modern, signal-first form controls including select dropdowns, multi-selectors, datepickers, switches, radio groups, and text fields.',
        },
      },
      {
        path: 'feedback',
        loadComponent: () => import('./pages/feedback/feedback').then((m) => m.FeedbackPage),
        title: 'Feedback & Status - Showcase | NGXSMK',
        data: {
          description:
            'Status indicators, skeleton loaders, spinners, alert banners, progress bars, and empty-state placeholders in NGXSMK.',
        },
      },
      {
        path: 'data-display',
        loadComponent: () =>
          import('./pages/data-display/data-display').then((m) => m.DataDisplayPage),
        title: 'Data Display Components - Showcase | NGXSMK',
        data: {
          description:
            'Data display grids including customizable tables, tabs, accordions, metadata lists, avatars, and chip elements.',
        },
      },
      {
        path: 'overlay',
        loadComponent: () => import('./pages/overlay/overlay').then((m) => m.OverlayPage),
        title: 'Overlays & Popovers - Showcase | NGXSMK',
        data: {
          description:
            'Overlay components: dialogs, alert drawers, dropdown menus, context menus, tooltips, hover cards, and lightboxes.',
        },
      },
      {
        path: 'charts',
        loadComponent: () => import('./pages/charts/charts').then((m) => m.ChartsPage),
        title: 'Data Visualization SVG Charts - Showcase | NGXSMK',
        data: {
          description:
            'Lightweight SVG chart primitives including line, bar, pie/donut, area, scatter, candlestick, and heatmaps.',
        },
      },
      {
        path: 'ai',
        loadComponent: () => import('./pages/ai/ai').then((m) => m.AiPage),
        title: 'AI Interface Components - Showcase | NGXSMK',
        data: {
          description:
            'Design components for AI applications: chat windows, dictation buttons, reasoning timelines, streaming text, and citations.',
        },
      },
      {
        path: 'enterprise',
        loadComponent: () => import('./pages/enterprise/enterprise').then((m) => m.EnterprisePage),
        title: 'Enterprise Grid & Board Tools - Showcase | NGXSMK',
        data: {
          description:
            'Advanced enterprise widgets: Kanban boards, gantt schedulers, workflow builders, flow charts, spreadsheets, and pivot tables.',
        },
      },
      {
        path: 'utilities',
        loadComponent: () => import('./pages/utilities/utilities').then((m) => m.UtilitiesPage),
        title: 'Reactive Hooks & Utilities - Showcase | NGXSMK',
        data: {
          description:
            'Helper directives for keyboard shortcuts, copy-to-clipboard, scroll-locking, and media queries.',
        },
      },
    ],
  },
];
