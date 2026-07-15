import {
  NgxsmkCardContent,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCard,
} from '@ngxsmk/core/card';
import { NgxsmkTag } from '@ngxsmk/core/tag';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { NgxsmkTimestamp } from '@ngxsmk/core/timestamp';
import { Component } from '@angular/core';
import { AppNav } from '../../nav/nav';

interface Post {
  title: string;
  excerpt: string;
  tag: string;
  date: Date;
}

@Component({
  selector: 'blog-page',
  standalone: true,
  imports: [
    NgxsmkCard,
    NgxsmkCardContent,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkTag,
    NgxsmkHeading,
    NgxsmkText,
    NgxsmkTimestamp,
    AppNav,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">Blog</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub"
          >Latest news, articles, and write-ups from the NGXSMK team.</ngxsmk-text
        >
      </header>

      <div class="ngxsmk-blog-grid">
        @for (post of posts; track post.title) {
          <ngxsmk-card class="ngxsmk-blog-card">
            <div ngxsmkCardHeader>
              <div class="ngxsmk-blog-card__top">
                <ngxsmk-tag variant="primary">{{ post.tag }}</ngxsmk-tag>
                <ngxsmk-timestamp [date]="post.date" format="relative" />
              </div>
              <ngxsmk-heading level="h3" ngxsmkCardTitle>{{ post.title }}</ngxsmk-heading>
            </div>
            <div ngxsmkCardContent>
              <ngxsmk-text variant="body" class="ngxsmk-blog-desc">{{ post.excerpt }}</ngxsmk-text>
              <a ngxsmk-button size="sm" variant="outline" href="#">Read article</a>
            </div>
          </ngxsmk-card>
        }
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
    .ngxsmk-blog-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(22rem, 100%), 1fr));
      gap: var(--ngxsmk-space-6, 1.5rem);
    }
    .ngxsmk-blog-card {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    .ngxsmk-blog-card__top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2, 0.5rem);
      margin-bottom: var(--ngxsmk-space-2, 0.5rem);
    }
    .ngxsmk-blog-desc {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.875rem;
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-4, 1rem);
    }
  `,
})
export class BlogPage {
  protected readonly posts: Post[] = [
    {
      title: 'Introducing NGXSMK',
      excerpt:
        'Why we built a signals-native, zoneless design system for Angular — and how the universal token engine keeps your brand portable.',
      tag: 'Announcement',
      date: new Date(Date.now() - 2 * 86400000),
    },
    {
      title: 'Theming without lock-in',
      excerpt:
        'One token engine, four outputs: CSS variables, SCSS, Tailwind, and JSON. Swap the entire look at runtime.',
      tag: 'Theming',
      date: new Date(Date.now() - 9 * 86400000),
    },
    {
      title: 'Building AI components',
      excerpt:
        'A look at the chat window, streaming text, and tool-call viewer primitives that power agent-ready UIs.',
      tag: 'AI',
      date: new Date(Date.now() - 21 * 86400000),
    },
    {
      title: 'Enterprise widgets, free',
      excerpt:
        'Kanban, spreadsheet, pivot table, and diagram editors — all MIT-licensed and fully customizable.',
      tag: 'Enterprise',
      date: new Date(Date.now() - 40 * 86400000),
    },
  ];
}
