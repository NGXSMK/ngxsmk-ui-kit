import { NgxsmkCardContent, NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkCard } from '@ngxsmk/core/card';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppNav } from '../../nav/nav';

@Component({
  selector: 'docs-page',
  standalone: true,
  imports: [RouterLink, NgxsmkCard, NgxsmkCardContent, NgxsmkCardHeader, NgxsmkCardTitle, AppNav],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <h1>Documentation</h1>
        <p class="ngxsmk-page__sub">Everything you need to build with NGXSMK.</p>
      </header>

      <div class="ngxsmk-docs-grid">
        <a class="ngxsmk-docs-card" routerLink="/showcase">
          <ngxsmk-card interactive>
            <div ngxsmkCardHeader>
              <h3 ngxsmkCardTitle>Getting Started</h3>
            </div>
            <div ngxsmkCardContent>
              <p>Install NGXSMK, set up your first component, and configure themes in minutes.</p>
              <span class="ngxsmk-docs-card__link">Read more →</span>
            </div>
          </ngxsmk-card>
        </a>

        <a class="ngxsmk-docs-card" routerLink="/showcase">
          <ngxsmk-card interactive>
            <div ngxsmkCardHeader>
              <h3 ngxsmkCardTitle>Components</h3>
            </div>
            <div ngxsmkCardContent>
              <p>Browse all 217 components with live examples, API docs, and accessibility notes.</p>
              <span class="ngxsmk-docs-card__link">Browse →</span>
            </div>
          </ngxsmk-card>
        </a>

        <a class="ngxsmk-docs-card" routerLink="/themes">
          <ngxsmk-card interactive>
            <div ngxsmkCardHeader>
              <h3 ngxsmkCardTitle>Theming</h3>
            </div>
            <div ngxsmkCardContent>
              <p>Learn how the token engine works, create custom presets, and switch themes at runtime.</p>
              <span class="ngxsmk-docs-card__link">Learn more →</span>
            </div>
          </ngxsmk-card>
        </a>

        <a class="ngxsmk-docs-card" routerLink="/templates">
          <ngxsmk-card interactive>
            <div ngxsmkCardHeader>
              <h3 ngxsmkCardTitle>Templates</h3>
            </div>
            <div ngxsmkCardContent>
              <p>Production-ready page templates built with NGXSMK components. Clone and customize.</p>
              <span class="ngxsmk-docs-card__link">View templates →</span>
            </div>
          </ngxsmk-card>
        </a>

        <a class="ngxsmk-docs-card" routerLink="/playground">
          <ngxsmk-card interactive>
            <div ngxsmkCardHeader>
              <h3 ngxsmkCardTitle>CLI & Tooling</h3>
            </div>
            <div ngxsmkCardContent>
              <p>Scaffold projects, add components, and generate themes with the NGXSMK CLI.</p>
              <span class="ngxsmk-docs-card__link">Explore CLI →</span>
            </div>
          </ngxsmk-card>
        </a>

        <a class="ngxsmk-docs-card" routerLink="/community">
          <ngxsmk-card interactive>
            <div ngxsmkCardHeader>
              <h3 ngxsmkCardTitle>Contributing</h3>
            </div>
            <div ngxsmkCardContent>
              <p>Join the community, report issues, and contribute to the open-source ecosystem.</p>
              <span class="ngxsmk-docs-card__link">Get involved →</span>
            </div>
          </ngxsmk-card>
        </a>
      </div>
    </div>
  `,
  styles: `
    .ngxsmk-page { max-width: 1400px; margin: 0 auto; padding: var(--ngxsmk-space-12,3rem) var(--ngxsmk-space-6,1.5rem); }
    .ngxsmk-page__header { margin-bottom: var(--ngxsmk-space-12,3rem); }
    .ngxsmk-page__header h1 { font-size: 2rem; font-weight: 700; margin: 0 0 var(--ngxsmk-space-2,0.5rem); color: var(--ngxsmk-color-on-surface,#09090b); }
    .ngxsmk-page__sub { color: var(--ngxsmk-color-on-surface-variant,#71717a); margin: 0; font-size: 1rem; }
    .ngxsmk-docs-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(min(22rem,100%),1fr)); gap: var(--ngxsmk-space-6,1.5rem); }
    .ngxsmk-docs-card { text-decoration: none; color: inherit; }
    .ngxsmk-docs-card__link { color: var(--ngxsmk-color-primary,#7c3aed); font-weight: 500; font-size: 0.875rem; }
    .ngxsmk-docs-card p { color: var(--ngxsmk-color-on-surface-variant,#71717a); font-size: 0.875rem; line-height: 1.6; margin: 0 0 var(--ngxsmk-space-3,0.75rem); }
  `,
})
export class DocsPage {}
