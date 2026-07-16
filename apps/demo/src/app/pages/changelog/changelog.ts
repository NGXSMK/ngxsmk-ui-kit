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
import { TranslatePipe } from '@ngx-translate/core';
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
    TranslatePipe,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">{{ 'changelog.title' | translate }}</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub">{{
          'changelog.subtitle' | translate
        }}</ngxsmk-text>
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
                release.summary | translate
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
                      >{{ change.type | translate }}</ngxsmk-badge
                    >
                    <span>{{ change.text | translate }}</span>
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
      version: 'v1.3.1',
      date: '2026-07-16',
      summary: 'changelog.release.v131.summary',
      changes: [
        {
          type: 'added',
          text: 'changelog.release.v131.changes.0',
        },
        {
          type: 'changed',
          text: 'changelog.release.v131.changes.1',
        },
        {
          type: 'fixed',
          text: 'changelog.release.v131.changes.2',
        },
        {
          type: 'fixed',
          text: 'changelog.release.v131.changes.3',
        },
      ],
    },
    {
      version: 'v1.3.0',
      date: '2026-07-16',
      summary: 'changelog.release.v130.summary',
      changes: [
        {
          type: 'added',
          text: 'changelog.release.v130.changes.0',
        },
        {
          type: 'changed',
          text: 'changelog.release.v130.changes.1',
        },
        {
          type: 'changed',
          text: 'changelog.release.v130.changes.2',
        },
      ],
    },
    {
      version: 'v1.2.0',
      date: '2026-07-15',
      summary: 'changelog.release.v120.summary',
      changes: [
        {
          type: 'fixed',
          text: 'changelog.release.v120.changes.0',
        },
        {
          type: 'added',
          text: 'changelog.release.v120.changes.1',
        },
        {
          type: 'added',
          text: 'changelog.release.v120.changes.2',
        },
        {
          type: 'added',
          text: 'changelog.release.v120.changes.3',
        },
      ],
    },
    {
      version: 'v1.1.0',
      date: '2026-07-15',
      summary: 'changelog.release.v110.summary',
      changes: [
        {
          type: 'added',
          text: 'changelog.release.v110.changes.0',
        },
        {
          type: 'added',
          text: 'changelog.release.v110.changes.1',
        },
        { type: 'changed', text: 'changelog.release.v110.changes.2' },
        { type: 'changed', text: 'changelog.release.v110.changes.3' },
      ],
    },
    {
      version: 'v1.0.0',
      date: '2026-07-15',
      summary: 'changelog.release.v100.summary',
      changes: [
        { type: 'added', text: 'changelog.release.v100.changes.0' },
        {
          type: 'added',
          text: 'changelog.release.v100.changes.1',
        },
        { type: 'added', text: 'changelog.release.v100.changes.2' },
        { type: 'added', text: 'changelog.release.v100.changes.3' },
        {
          type: 'changed',
          text: 'changelog.release.v100.changes.4',
        },
      ],
    },
    {
      version: 'v0.0.0-beta.1',
      date: '2026-07-13',
      summary: 'changelog.release.v0beta1.summary',
      changes: [
        { type: 'added', text: 'changelog.release.v0beta1.changes.0' },
        { type: 'added', text: 'changelog.release.v0beta1.changes.1' },
        { type: 'added', text: 'changelog.release.v0beta1.changes.2' },
        { type: 'fixed', text: 'changelog.release.v0beta1.changes.3' },
      ],
    },
    {
      version: 'v0.0.0-alpha.3',
      date: '2026-06-02',
      summary: 'changelog.release.v0alpha3.summary',
      changes: [
        { type: 'added', text: 'changelog.release.v0alpha3.changes.0' },
        { type: 'changed', text: 'changelog.release.v0alpha3.changes.1' },
      ],
    },
    {
      version: 'v0.0.0-alpha.1',
      date: '2026-04-15',
      summary: 'changelog.release.v0alpha1.summary',
      changes: [{ type: 'added', text: 'changelog.release.v0alpha1.changes.0' }],
    },
  ];
}
