import { Component, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { AppNav } from '../../nav/nav';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { getBlogPost, blogPosts, type BlogPost } from '../blog/blog-data';

@Component({
  selector: 'blog-post-page',
  standalone: true,
  imports: [DatePipe, RouterLink, AppNav, NgxsmkButton, NgxsmkHeading],
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
            Back to blog
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
              <span class="bp__author-role">NGXSMK Team · {{ p.date | date: 'MMM d, yyyy' }}</span>
            </div>
          </div>
        </header>

        <!-- ═══════════════ CODE BLOCK (if any) ═══════════════ -->
        @if (p.code) {
          <div class="bp__code">
            <div class="bp__code-head">
              <div class="bp__code-dots"><i></i><i></i><i></i></div>
              <span class="bp__code-label">Quick Start</span>
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
              {{ copied ? '✓ Copied' : 'Copy link' }}
            </button>
          </div>

          <div class="bp__related">
            <ngxsmk-heading level="h3" class="bp__related-title">More articles</ngxsmk-heading>
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
        <ngxsmk-heading level="h2">Post not found</ngxsmk-heading>
        <p class="bp__empty-sub">The article you're looking for doesn't exist.</p>
        <a ngxsmk-button routerLink="/blog">Back to blog</a>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      background: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: calc(100vh - 3.5rem);
    }

    .bp {
      max-width: 760px;
      margin: 0 auto;
      padding: var(--ngxsmk-space-10, 2.5rem) var(--ngxsmk-space-6, 1.5rem)
        var(--ngxsmk-space-16, 4rem);
      position: relative;
      z-index: 1;
    }

    .bp--empty {
      text-align: center;
      padding-top: 8rem;
    }
    .bp__empty-sub {
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0.5rem 0 1.5rem;
    }

    /* ──── NAV ──── */
    .bp__nav {
      margin-bottom: 2rem;
    }
    .bp__back {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
      text-decoration: none;
      transition: color 0.15s;
    }
    .bp__back:hover {
      color: var(--ngxsmk-color-primary);
    }

    /* ──── HEADER ──── */
    .bp__header {
      margin-bottom: 2.5rem;
    }
    .bp__meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .bp__tag {
      padding: 0.2rem 0.6rem;
      border-radius: var(--ngxsmk-radius-sm);
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
    }
    .bp__date,
    .bp__read {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .bp__dot {
      color: var(--ngxsmk-color-outline);
    }
    .bp__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: clamp(1.75rem, 4vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin: 0 0 1rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .bp__excerpt {
      font-size: var(--ngxsmk-text-title-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.6;
      margin: 0 0 1.5rem;
    }
    .bp__author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .bp__avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--ngxsmk-color-primary, #7c3aed), #a78bfa);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 700;
    }
    .bp__author-info {
      display: flex;
      flex-direction: column;
    }
    .bp__author-name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }
    .bp__author-role {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    /* ──── CODE BLOCK ──── */
    .bp__code {
      background: #09090b;
      border-radius: var(--ngxsmk-radius-lg);
      border: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
      margin-bottom: 2.5rem;
    }
    .bp__code-head {
      padding: 0.5rem 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .bp__code-dots {
      display: flex;
      gap: 5px;
    }
    .bp__code-dots i {
      width: 7px;
      height: 7px;
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
      font-size: var(--ngxsmk-text-body-xs-size);
      color: rgba(255, 255, 255, 0.4);
      font-family: var(--ngxsmk-font-mono);
    }
    .bp__code-body {
      padding: 1.25rem 1rem;
      margin: 0;
      overflow-x: auto;
    }
    .bp__code-body code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
    }

    /* ──── CONTENT ──── */
    .bp__content {
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
      line-height: 1.75;
      margin-bottom: 3rem;

      :global(h2) {
        font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
        font-size: var(--ngxsmk-text-headline-sm-size);
        font-weight: 700;
        letter-spacing: -0.02em;
        margin: 2.5rem 0 1rem;
        color: var(--ngxsmk-color-on-surface);
      }

      :global(h3) {
        font-size: var(--ngxsmk-text-title-lg-size);
        font-weight: 700;
        margin: 2rem 0 0.75rem;
        color: var(--ngxsmk-color-on-surface);
      }

      :global(p) {
        margin: 0 0 1.25rem;
        color: var(--ngxsmk-color-on-surface-variant);
      }

      :global(ul),
      :global(ol) {
        margin: 0 0 1.25rem;
        padding-left: 1.5rem;
      }

      :global(li) {
        margin-bottom: 0.5rem;
        color: var(--ngxsmk-color-on-surface-variant);
      }

      :global(strong) {
        font-weight: 700;
        color: var(--ngxsmk-color-on-surface);
      }

      :global(code) {
        font-family: var(--ngxsmk-font-mono);
        font-size: 0.9em;
        background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 8%, transparent);
        color: var(--ngxsmk-color-primary);
        padding: 0.1em 0.35em;
        border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      }

      :global(pre) {
        background: #09090b;
        border-radius: var(--ngxsmk-radius-md);
        padding: 1.25rem 1rem;
        margin: 0 0 1.5rem;
        overflow-x: auto;

        code {
          background: none;
          color: rgba(255, 255, 255, 0.85);
          padding: 0;
          font-size: var(--ngxsmk-text-body-sm-size);
          line-height: 1.7;
        }
      }
    }

    /* ──── FOOTER ──── */
    .bp__footer {
      padding-top: 2rem;
      border-top: 1px solid var(--ngxsmk-color-outline);
    }
    .bp__footer-actions {
      margin-bottom: 3rem;
    }
    .bp__related-title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 1.25rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .bp__related-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(16rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4);
    }
    .bp__related-card {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: 1.25rem;
      text-decoration: none;
      color: inherit;
      transition:
        box-shadow 0.2s,
        transform 0.2s;
    }
    .bp__related-card:hover {
      box-shadow: var(--ngxsmk-shadow-md);
      transform: translateY(-1px);
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
