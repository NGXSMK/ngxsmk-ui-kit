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
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">Roadmap</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub"
          >A preview of what we're working on and what's coming next to NGXSMK.</ngxsmk-text
        >
      </header>

      <div class="ngxsmk-roadmap-list">
        @for (m of milestones; track m.quarter) {
          <ngxsmk-card class="ngxsmk-milestone">
            <div ngxsmkCardHeader>
              <div class="ngxsmk-milestone__top">
                <ngxsmk-heading level="h3" ngxsmkCardTitle
                  >{{ m.quarter }} — {{ m.title }}</ngxsmk-heading
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
                    m.status === 'shipped'
                      ? 'Shipped'
                      : m.status === 'in-progress'
                        ? 'In progress'
                        : 'Planned'
                  }}</ngxsmk-badge
                >
              </div>
            </div>
            <div ngxsmkCardContent>
              <ul class="ngxsmk-milestone__items">
                @for (item of m.items; track item) {
                  <li>{{ item }}</li>
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
      quarter: 'Q3 2026',
      title: 'CLI Tools & Schematics',
      status: 'in-progress',
      items: [
        'Schematic generators for add/update components',
        'Copy-paste installer scripts',
        'Theme preset scaffolding',
      ],
    },
    {
      quarter: 'Q4 2026',
      title: 'AI Toolkit Expansion',
      status: 'planned',
      items: [
        'MCP server for coding assistants',
        'More agent primitives (guardrails, evaluations)',
        'Streaming token diff viewer',
      ],
    },
    {
      quarter: 'Q1 2027',
      title: 'Enterprise Suite',
      status: 'planned',
      items: ['Data-grid virtualization', 'Spreadsheet formula engine', 'Collaborative canvas'],
    },
    {
      quarter: 'Q2 2026',
      title: 'Foundations',
      status: 'shipped',
      items: ['Universal token engine', '200+ components shipped', 'Zoneless runtime support'],
    },
  ];
}
