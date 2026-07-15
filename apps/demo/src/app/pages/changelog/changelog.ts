import {
  NgxsmkCardContent,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCard,
} from '@ngxsmk/core/card';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { Component } from '@angular/core';
import { AppNav } from '../../nav/nav';

interface Change {
  type: 'added' | 'fixed' | 'changed';
  text: string;
}

interface Release {
  version: string;
  date: string;
  summary: string;
  changes: Change[];
}

@Component({
  selector: 'changelog-page',
  standalone: true,
  imports: [
    NgxsmkCard,
    NgxsmkCardContent,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkBadge,
    NgxsmkHeading,
    NgxsmkText,
    AppNav,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">Changelog</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub"
          >Keep track of the changes, bug fixes, updates, and releases of NGXSMK.</ngxsmk-text
        >
      </header>

      <div class="ngxsmk-changelog-list">
        @for (release of releases; track release.version) {
          <ngxsmk-card class="ngxsmk-release">
            <div ngxsmkCardHeader>
              <div class="ngxsmk-release__top">
                <ngxsmk-heading level="h3" ngxsmkCardTitle>{{ release.version }}</ngxsmk-heading>
                <ngxsmk-badge variant="primary">{{ release.date }}</ngxsmk-badge>
              </div>
            </div>
            <div ngxsmkCardContent>
              <ngxsmk-text variant="body" class="ngxsmk-changelog-desc">{{
                release.summary
              }}</ngxsmk-text>
              <ul class="ngxsmk-release__changes">
                @for (change of release.changes; track change.text) {
                  <li>
                    <ngxsmk-badge
                      [variant]="
                        change.type === 'added'
                          ? 'success'
                          : change.type === 'fixed'
                            ? 'warning'
                            : 'primary'
                      "
                      >{{ change.type }}</ngxsmk-badge
                    >
                    <span>{{ change.text }}</span>
                  </li>
                }
              </ul>
            </div>
          </ngxsmk-card>
        }
      </div>
    </div>
  `,
  styles: `
    .ngxsmk-page {
      max-width: 980px;
      margin: 0 auto;
      padding: var(--ngxsmk-space-12, 3rem) var(--ngxsmk-space-6, 1.5rem);
    }
    .ngxsmk-page__header {
      margin-bottom: var(--ngxsmk-space-12, 3rem);
    }
    .ngxsmk-page__header h1 {
      font-size: 2rem;
      font-weight: 700;
      margin: 0 0 var(--ngxsmk-space-2, 0.5rem);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .ngxsmk-page__sub {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin: 0;
      font-size: 1rem;
    }
    .ngxsmk-changelog-list {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-5, 1.25rem);
    }
    .ngxsmk-release__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }
    .ngxsmk-changelog-desc {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-3, 0.75rem);
    }
    .ngxsmk-release__changes {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }
    .ngxsmk-release__changes li {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
  `,
})
export class ChangelogPage {
  protected readonly releases: Release[] = [
    {
      version: 'v1.1.0',
      date: '2026-07-15',
      summary: 'Stable release with updated toolchain, command palette, and prompt carousel.',
      changes: [
        {
          type: 'added',
          text: 'Command palette component (@ngxsmk/core/command-palette) for quick search and actions.',
        },
        {
          type: 'added',
          text: 'Prompt carousel component (@ngxsmk/core/prompt-carousel) for AI-focused templates.',
        },
        { type: 'changed', text: 'Standardized workspace configuration and builder options.' },
        { type: 'changed', text: 'Verified Angular compatibility across versions 17 through 22.' },
      ],
    },
    {
      version: 'v1.0.0',
      date: '2026-07-15',
      summary: 'First stable release of the NGXSMK ecosystem.',
      changes: [
        { type: 'added', text: '@ngxsmk/core, @ngxsmk/cdk, and @ngxsmk/theme published at 1.0.0.' },
        {
          type: 'added',
          text: 'Angular 17.3+ support verified across 17, 18, 19, 20, 21, and 22.',
        },
        { type: 'added', text: '200+ components across forms, AI, enterprise, charts, and more.' },
        { type: 'added', text: 'Universal token engine with runtime theme switching.' },
        {
          type: 'changed',
          text: 'Peer dependencies widened to >=17.3.0 (was pinned to Angular 22).',
        },
      ],
    },
    {
      version: 'v0.0.0-beta.1',
      date: '2026-07-13',
      summary: 'Initial beta release of the NGXSMK ecosystem.',
      changes: [
        { type: 'added', text: '@ngxsmk/core, @ngxsmk/cdk, and @ngxsmk/theme packages.' },
        { type: 'added', text: '200+ components across forms, AI, enterprise, charts, and more.' },
        { type: 'added', text: 'Universal token engine with runtime theme switching.' },
        { type: 'fixed', text: 'Zoneless change detection compatibility.' },
      ],
    },
    {
      version: 'v0.0.0-alpha.3',
      date: '2026-06-02',
      summary: 'Preview of the showcase application and documentation site.',
      changes: [
        { type: 'added', text: 'Interactive component explorer.' },
        { type: 'changed', text: 'Migrated all components to signal inputs.' },
      ],
    },
    {
      version: 'v0.0.0-alpha.1',
      date: '2026-04-15',
      summary: 'First internal alpha of the core component library.',
      changes: [{ type: 'added', text: 'Foundational primitives: button, card, input, dialog.' }],
    },
  ];
}
