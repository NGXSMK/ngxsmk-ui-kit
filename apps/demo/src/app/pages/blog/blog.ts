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
import { TranslatePipe } from '@ngx-translate/core';
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
    TranslatePipe,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page">
      <header class="ngxsmk-page__header">
        <ngxsmk-heading level="h1">{{ 'blog.title' | translate }}</ngxsmk-heading>
        <ngxsmk-text variant="body" class="ngxsmk-page__sub">{{
          'blog.subtitle' | translate
        }}</ngxsmk-text>
      </header>

      <div class="ngxsmk-blog-grid">
        @for (post of posts; track post.title) {
          <ngxsmk-card class="ngxsmk-blog-card">
            <div ngxsmkCardHeader>
              <div class="ngxsmk-blog-card__top">
                <ngxsmk-tag variant="primary">{{ post.tag | translate }}</ngxsmk-tag>
                <ngxsmk-timestamp [date]="post.date" format="relative" />
              </div>
              <ngxsmk-heading level="h3" ngxsmkCardTitle>{{
                post.title | translate
              }}</ngxsmk-heading>
            </div>
            <div ngxsmkCardContent>
              <ngxsmk-text variant="body" class="ngxsmk-blog-desc">{{
                post.excerpt | translate
              }}</ngxsmk-text>
              <a ngxsmk-button size="sm" variant="outline" href="#">{{
                'blog.readArticle' | translate
              }}</a>
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
    .ngxsmk-page__header h1,
    .ngxsmk-page__header ngxsmk-heading {
      font-size: var(--ngxsmk-text-headline-lg-size);
      font-weight: 700;
      margin: 0 0 var(--ngxsmk-space-2, 0.5rem);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .ngxsmk-page__sub {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin: 0;
      font-size: var(--ngxsmk-text-body-lg-size);
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
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: 1.6;
      margin: 0 0 var(--ngxsmk-space-4, 1rem);
    }
  `,
})
export class BlogPage {
  protected readonly posts: Post[] = [
    {
      title: 'blog.post.introducing.title',
      excerpt: 'blog.post.introducing.excerpt',
      tag: 'blog.tag.announcement',
      date: new Date(Date.now() - 2 * 86400000),
    },
    {
      title: 'blog.post.theming.title',
      excerpt: 'blog.post.theming.excerpt',
      tag: 'blog.tag.theming',
      date: new Date(Date.now() - 9 * 86400000),
    },
    {
      title: 'blog.post.buildingAi.title',
      excerpt: 'blog.post.buildingAi.excerpt',
      tag: 'category.ai',
      date: new Date(Date.now() - 21 * 86400000),
    },
    {
      title: 'blog.post.enterpriseFree.title',
      excerpt: 'blog.post.enterpriseFree.excerpt',
      tag: 'category.enterprise',
      date: new Date(Date.now() - 40 * 86400000),
    },
  ];
}
