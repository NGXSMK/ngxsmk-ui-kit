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

interface Milestone {
  quarter: string;
  title: string;
  status: 'shipped' | 'in-progress' | 'planned';
  items: string[];
}

@Component({
  selector: 'roadmap-page',
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
        <ngxsmk-heading level="h1">{{ 'roadmap.title' | translate }}</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub">{{
          'roadmap.subtitle' | translate
        }}</ngxsmk-text>
      </header>

      <div class="ngxsmk-roadmap-list">
        @for (m of milestones; track m.quarter) {
          <ngxsmk-card class="ngxsmk-milestone">
            <div ngxsmkCardHeader>
              <div class="ngxsmk-milestone__top">
                <ngxsmk-heading level="h3" ngxsmkCardTitle
                  >{{ m.quarter | translate }} - {{ m.title | translate }}</ngxsmk-heading
                >
                <ngxsmk-badge
                  [variant]="
                    m.status === 'shipped'
                      ? 'success'
                      : m.status === 'in-progress'
                        ? 'warning'
                        : 'primary'
                  "
                  >{{
                    (m.status === 'shipped'
                      ? 'roadmap.status.shipped'
                      : m.status === 'in-progress'
                        ? 'roadmap.status.inProgress'
                        : 'roadmap.status.planned'
                    ) | translate
                  }}</ngxsmk-badge
                >
              </div>
            </div>
            <div ngxsmkCardContent>
              <ul class="ngxsmk-milestone__items">
                @for (item of m.items; track item) {
                  <li>{{ item | translate }}</li>
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
    .ngxsmk-page__header h1,
    .ngxsmk-page__header ngxsmk-heading {
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
    .ngxsmk-roadmap-list {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-5, 1.25rem);
    }
    .ngxsmk-milestone__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }
    .ngxsmk-milestone__items {
      margin: 0;
      padding-left: 1.25rem;
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-size: 0.875rem;
      line-height: 1.8;
    }
  `,
})
export class RoadmapPage {
  protected readonly milestones: Milestone[] = [
    {
      quarter: 'roadmap.quarter.q3_2026',
      title: 'roadmap.milestone.cliTools',
      status: 'in-progress',
      items: ['roadmap.items.cli.0', 'roadmap.items.cli.1', 'roadmap.items.cli.2'],
    },
    {
      quarter: 'roadmap.quarter.q4_2026',
      title: 'roadmap.milestone.aiToolkit',
      status: 'planned',
      items: ['roadmap.items.ai.0', 'roadmap.items.ai.1', 'roadmap.items.ai.2'],
    },
    {
      quarter: 'roadmap.quarter.q1_2027',
      title: 'roadmap.milestone.enterpriseSuite',
      status: 'planned',
      items: [
        'roadmap.items.enterprise.0',
        'roadmap.items.enterprise.1',
        'roadmap.items.enterprise.2',
      ],
    },
    {
      quarter: 'roadmap.quarter.q2_2026',
      title: 'roadmap.milestone.foundations',
      status: 'shipped',
      items: [
        'roadmap.items.foundations.0',
        'roadmap.items.foundations.1',
        'roadmap.items.foundations.2',
      ],
    },
  ];
}
