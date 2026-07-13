import { Routes } from '@angular/router';
import { ShowcaseLayout } from './showcase-layout/showcase-layout';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./pages/home/home').then(m => m.HomePage),
  },
  {
    path: 'docs',
    loadComponent: () => import('./pages/docs/docs').then(m => m.DocsPage),
  },
  {
    path: 'templates',
    loadComponent: () => import('./pages/templates/templates').then(m => m.TemplatesPage),
  },
  {
    path: 'themes',
    loadComponent: () => import('./pages/themes/themes').then(m => m.ThemesPage),
  },
  {
    path: 'playground',
    loadComponent: () => import('./pages/playground/playground').then(m => m.PlaygroundPage),
  },
  {
    path: 'community',
    loadComponent: () => import('./pages/community/community').then(m => m.CommunityPage),
  },
  {
    path: 'blog',
    loadComponent: () => import('./pages/blog/blog').then(m => m.BlogPage),
  },
  {
    path: 'changelog',
    loadComponent: () => import('./pages/changelog/changelog').then(m => m.ChangelogPage),
  },
  {
    path: 'roadmap',
    loadComponent: () => import('./pages/roadmap/roadmap').then(m => m.RoadmapPage),
  },
  {
    path: 'showcase',
    component: ShowcaseLayout,
    children: [
      { path: '', redirectTo: 'content-typography', pathMatch: 'full' },
      { path: 'content-typography', loadComponent: () => import('./pages/content-typography/content-typography').then(m => m.ContentTypographyPage) },
      { path: 'navigation', loadComponent: () => import('./pages/navigation/navigation').then(m => m.NavigationPage) },
      { path: 'layout', loadComponent: () => import('./pages/layout/layout').then(m => m.LayoutPage) },
      { path: 'forms', loadComponent: () => import('./pages/forms/forms').then(m => m.FormsPage) },
      { path: 'feedback', loadComponent: () => import('./pages/feedback/feedback').then(m => m.FeedbackPage) },
      { path: 'data-display', loadComponent: () => import('./pages/data-display/data-display').then(m => m.DataDisplayPage) },
      { path: 'overlay', loadComponent: () => import('./pages/overlay/overlay').then(m => m.OverlayPage) },
      { path: 'charts', loadComponent: () => import('./pages/charts/charts').then(m => m.ChartsPage) },
      { path: 'ai', loadComponent: () => import('./pages/ai/ai').then(m => m.AiPage) },
      { path: 'enterprise', loadComponent: () => import('./pages/enterprise/enterprise').then(m => m.EnterprisePage) },
      { path: 'utilities', loadComponent: () => import('./pages/utilities/utilities').then(m => m.UtilitiesPage) },
    ],
  },
];
