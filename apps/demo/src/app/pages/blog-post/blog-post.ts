import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AppNav } from '../../nav/nav';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { TranslatePipe } from '@ngx-translate/core';
import { getBlogPost, blogPosts, type BlogPost } from '../blog/blog-data';

@Component({
  selector: 'blog-post-page',
  standalone: true,
  imports: [DatePipe, RouterLink, AppNav, NgxsmkButton, NgxsmkHeading, TranslatePipe],
  template: `
    <app-nav />

    @if (post; as p) {
      <article class="bp">
        <!-- ═══════════════ BACK ═══════════════ -->
        <nav class="bp__nav">
          <a class="bp__back" routerLink="/blog">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path
                d="M10 12L6 8l4-4"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {{ 'blogPost.backToBlog' | translate }}
          </a>
        </nav>

        <!-- ═══════════════ HEADER ═══════════════ -->
        <header class="bp__header">
          <div class="bp__meta">
            <span
              class="bp__tag"
              [style.background]="p.tagColor + '18'"
              [style.color]="p.tagColor"
              >{{ p.tag }}</span
            >
            <span class="bp__date">{{ p.date | date: 'MMMM d, yyyy' }}</span>
            <span class="bp__dot">·</span>
            <span class="bp__read">{{ p.readTime }}</span>
          </div>
          <h1 class="bp__title">{{ p.title }}</h1>
          <p class="bp__excerpt">{{ p.excerpt }}</p>
          <div class="bp__author">
            <div class="bp__avatar">{{ p.author.charAt(0) }}</div>
            <div class="bp__author-info">
              <span class="bp__author-name">{{ p.author }}</span>
              <span class="bp__author-role"
                >{{ 'blogPost.ngxsmkTeam' | translate }} · {{ p.date | date: 'MMM d, yyyy' }}</span
              >
            </div>
          </div>
        </header>

        <!-- ═══════════════ CODE BLOCK (if any) ═══════════════ -->
        @if (p.code) {
          <div class="bp__code">
            <div class="bp__code-head">
              <div class="bp__code-dots"><i></i><i></i><i></i></div>
              <span class="bp__code-label">{{ 'blogPost.quickStart' | translate }}</span>
            </div>
            <pre class="bp__code-body"><code>{{ p.code }}</code></pre>
          </div>
        }

        <!-- ═══════════════ CONTENT ═══════════════ -->
        <div class="bp__content" [innerHTML]="p.content"></div>

        <!-- ═══════════════ SHARE / NAV ═══════════════ -->
        <footer class="bp__footer">
          <div class="bp__footer-actions">
            <button ngxsmk-button variant="outline" (click)="copyLink()">
              {{ copied ? ('blogPost.copied' | translate) : ('blogPost.copyLink' | translate) }}
            </button>
          </div>

          <div class="bp__related">
            <ngxsmk-heading level="h3" class="bp__related-title">{{
              'blogPost.moreArticles' | translate
            }}</ngxsmk-heading>
            <div class="bp__related-grid">
              @for (r of relatedPosts; track r.id) {
                <a class="bp__related-card" [routerLink]="['/blog', r.id]">
                  <span class="bp__related-tag" [style.color]="r.tagColor">{{ r.tag }}</span>
                  <h4 class="bp__related-name">{{ r.title }}</h4>
                  <span class="bp__related-read">{{ r.readTime }}</span>
                </a>
              }
            </div>
          </div>
        </footer>
      </article>
    } @else {
      <div class="bp bp--empty">
        <ngxsmk-heading level="h2">{{ 'blogPost.postNotFound' | translate }}</ngxsmk-heading>
        <p class="bp__empty-sub">{{ 'blogPost.postNotFoundDesc' | translate }}</p>
        <a ngxsmk-button routerLink="/blog">{{ 'blogPost.backToBlog' | translate }}</a>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      background: var(--color-bg-canvas, #f8fafc);
      background-image: radial-gradient(var(--color-border-card, rgba(148, 163, 184, 0.25)) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: calc(100vh - 3.5rem);
    }

    .bp {
      max-width: 820px;
      margin: 0 auto;
      padding: 2.5rem 1.5rem 5rem;
      position: relative;
      z-index: 1;
      font-family: var(--font-body, 'Inter', system-ui, sans-serif);
      color: var(--color-text-main, #0f172a);
    }

    .bp--empty {
      text-align: center;
      padding-top: 8rem;
    }
    .bp__empty-sub {
      font-size: 1rem;
      color: var(--color-text-secondary, #64748b);
      margin: 0.5rem 0 1.5rem;
    }

    /* ──── NAV ──── */
    .bp__nav {
      margin-bottom: 2rem;
    }
    .bp__back {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--color-text-secondary, #64748b);
      text-decoration: none;
      transition: color 0.15s, transform 0.15s;
    }
    .bp__back:hover {
      color: #6366f1;
      transform: translateX(-2px);
    }

    /* ──── HEADER ──── */
    .bp__header {
      margin-bottom: 3rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.15));
    }
    .bp__meta {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .bp__tag {
      padding: 0.2rem 0.65rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    .bp__date,
    .bp__read {
      font-size: 0.85rem;
      color: var(--color-text-secondary, #64748b);
    }
    .bp__dot {
      color: var(--color-text-muted, #94a3b8);
    }
    .bp__title {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: clamp(2rem, 4vw, 2.75rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin: 0 0 1rem;
      color: var(--color-text-main, #0f172a);
    }
    .bp__excerpt {
      font-size: 1.125rem;
      color: var(--color-text-secondary, #64748b);
      line-height: 1.6;
      margin: 0 0 1.75rem;
    }
    .bp__author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .bp__avatar {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      background: linear-gradient(135deg, #6366f1, #f59e0b);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.95rem;
      font-weight: 700;
    }
    .bp__author-info {
      display: flex;
      flex-direction: column;
    }
    .bp__author-name {
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--color-text-main, #0f172a);
    }
    .bp__author-role {
      font-size: 0.775rem;
      color: var(--color-text-muted, #94a3b8);
    }

    /* ──── CODE BLOCK ──── */
    .bp__code {
      background: #0b0f19;
      border-radius: var(--radius-lg, 16px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
      margin-bottom: 2.5rem;
      box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.2);
    }
    .bp__code-head {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .bp__code-dots {
      display: flex;
      gap: 6px;
    }
    .bp__code-dots i {
      width: 9px;
      height: 9px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }
    .bp__code-dots i:first-child {
      background: #ef4444;
    }
    .bp__code-dots i:nth-child(2) {
      background: #f59e0b;
    }
    .bp__code-dots i:nth-child(3) {
      background: #10b981;
    }
    .bp__code-label {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
    }
    .bp__code-body {
      padding: 1.5rem 1.25rem;
      margin: 0;
      overflow-x: auto;
    }
    .bp__code-body code {
      font-family: var(--font-mono, 'JetBrains Mono', monospace);
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.9);
      line-height: 1.7;
    }

    /* ──── CONTENT ──── */
    .bp__content {
      font-size: 1rem;
      color: var(--color-text-main, #0f172a);
      line-height: 1.8;
      margin-bottom: 3.5rem;

      :global(h2) {
        font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
        font-size: 1.5rem;
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 2.5rem 0 1rem;
        color: var(--color-text-main, #0f172a);
      }

      :global(h3) {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 2rem 0 0.75rem;
        color: var(--color-text-main, #0f172a);
      }

      :global(p) {
        margin: 0 0 1.25rem;
        color: var(--color-text-secondary, #475569);
      }

      :global(ul),
      :global(ol) {
        margin: 0 0 1.25rem;
        padding-left: 1.5rem;
      }

      :global(li) {
        margin-bottom: 0.5rem;
        color: var(--color-text-secondary, #475569);
      }

      :global(strong) {
        font-weight: 700;
        color: var(--color-text-main, #0f172a);
      }

      :global(code) {
        font-family: var(--font-mono, 'JetBrains Mono', monospace);
        font-size: 0.875em;
        background: rgba(99, 102, 241, 0.08);
        color: #6366f1;
        padding: 0.15em 0.4em;
        border-radius: 6px;
      }

      :global(pre) {
        background: #0b0f19;
        border-radius: var(--radius-lg, 16px);
        padding: 1.5rem 1.25rem;
        margin: 0 0 1.5rem;
        overflow-x: auto;
        border: 1px solid rgba(255, 255, 255, 0.08);

        code {
          background: none;
          color: rgba(255, 255, 255, 0.9);
          padding: 0;
          font-size: 0.85rem;
          line-height: 1.7;
        }
      }
    }

    /* ──── FOOTER ──── */
    .bp__footer {
      padding-top: 2.5rem;
      border-top: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.15));
    }
    .bp__footer-actions {
      margin-bottom: 3rem;
    }
    .bp__related-title {
      font-family: var(--font-display, 'Plus Jakarta Sans', system-ui, sans-serif);
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 1.25rem;
      color: var(--color-text-main, #0f172a);
    }
    .bp__related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
      gap: 1.25rem;
    }
    .bp__related-card {
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border-card, rgba(148, 163, 184, 0.2));
      border-radius: var(--radius-xl, 22px);
      padding: 1.5rem;
      text-decoration: none;
      color: inherit;
      box-shadow: 0 4px 14px -4px rgba(0, 0, 0, 0.04);
      transition:
        box-shadow 0.22s,
        transform 0.22s cubic-bezier(0.16, 1, 0.3, 1),
        border-color 0.22s;
    }
    .bp__related-card:hover {
      box-shadow: 0 16px 32px -12px rgba(99, 102, 241, 0.18);
      border-color: rgba(99, 102, 241, 0.45);
      transform: translateY(-2px);
    }
    .bp__related-tag {
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .bp__related-name {
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 700;
      margin: 0.5rem 0 0.35rem;
      color: var(--ngxsmk-color-on-surface);
      line-height: 1.3;
    }
    .bp__related-read {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    /* ──── RESPONSIVE ──── */
    @media (max-width: 640px) {
      .bp {
        padding: var(--ngxsmk-space-8, 2rem) var(--ngxsmk-space-4, 1rem)
          var(--ngxsmk-space-10, 2.5rem);
      }
    }
  `,
})
export class BlogPostPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  protected post: BlogPost | null = null;
  protected relatedPosts: BlogPost[] = [];
  protected copied = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      this.post = getBlogPost(id) ?? null;

      if (this.post) {
        this.titleService.setTitle(`${this.post.title} — NGXSMK Blog`);
        this.meta.updateTag({ name: 'description', content: this.post.excerpt });
        this.meta.updateTag({ property: 'og:title', content: `${this.post.title} — NGXSMK Blog` });
        this.meta.updateTag({ property: 'og:description', content: this.post.excerpt });

        this.relatedPosts = blogPosts.filter((p) => p.id !== this.post!.id).slice(0, 3);
      }
    });
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      this.copied = true;
      setTimeout(() => (this.copied = false), 2000);
    });
  }
}
