import {
  NgxsmkCardContent,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCard,
} from '@ngxsmk/core/card';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { Component } from '@angular/core';
import { AppNav } from '../../nav/nav';

@Component({
  selector: 'community-page',
  standalone: true,
  imports: [
    NgxsmkCard,
    NgxsmkCardContent,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkButton,
    NgxsmkHeading,
    NgxsmkText,
    AppNav,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">Community & Contribution</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub"
          >Join our growing community, ask questions, propose features, and share what you've
          built.</ngxsmk-text
        >
      </header>

      <div class="ngxsmk-community-grid">
        <ngxsmk-card class="ngxsmk-community-card">
          <div ngxsmkCardHeader>
            <ngxsmk-heading level="h3" ngxsmkCardTitle>GitHub Discussions</ngxsmk-heading>
          </div>
          <div ngxsmkCardContent>
            <ngxsmk-text variant="body" class="ngxsmk-community-desc"
              >Ask questions, share suggestions, and get feedback from developers and contributors
              on our discussions forum.</ngxsmk-text
            >
            <a
              ngxsmk-button
              size="sm"
              href="https://github.com/NGXSMK/ngxsmk-ui-kit/discussions/19"
              target="_blank"
              >Join Discussion</a
            >
          </div>
        </ngxsmk-card>
      </div>
    </div>
  `,
  styles: `
    .ngxsmk-page {
      max-width: 1400px;
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
    .ngxsmk-community-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(22rem, 100%), 1fr));
      gap: var(--ngxsmk-space-6, 1.5rem);
    }
    .ngxsmk-community-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .ngxsmk-community-desc {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-4, 1rem);
    }
  `,
})
export class CommunityPage {}
