import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';
import { AppNav } from '../../nav/nav';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { blogPosts } from './blog-data';

@Component({
  selector: 'blog-page',
  standalone: true,
  imports: [DatePipe, RouterLink, AppNav, NgxsmkButton, NgxsmkBadge, NgxsmkHeading],
  template: `
    <app-nav />

    <div class="b">
      <!-- ═══════════════ HERO ═══════════════ -->
      <header class="b-hero">
        <div class="b-hero__inner">
          <ngxsmk-badge variant="primary">Blog</ngxsmk-badge>
          <h1 class="b-hero__title">Latest from NGXSMK</h1>
          <p class="b-hero__sub">
            Technical deep-dives, release announcements, and guides for building production UIs with
            signal-native Angular components.
          </p>
          <div class="b-hero__stats">
            <div class="b-hero__stat">
              <span class="b-hero__stat-val">{{ posts.length }}</span>
              <span class="b-hero__stat-label">Articles</span>
            </div>
            <div class="b-hero__stat">
              <span class="b-hero__stat-val">4</span>
              <span class="b-hero__stat-label">Topics</span>
            </div>
            <div class="b-hero__stat">
              <span class="b-hero__stat-val">Weekly</span>
              <span class="b-hero__stat-label">Cadence</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════════ CATEGORY FILTER ═══════════════ -->
      <section class="b-filters">
        <button
          class="b-filter"
          [class.b-filter--active]="activeFilter() === 'all'"
          (click)="activeFilter.set('all')"
        >
          All
        </button>
        @for (cat of categories; track cat) {
          <button
            class="b-filter"
            [class.b-filter--active]="activeFilter() === cat"
            (click)="activeFilter.set(cat)"
          >
            {{ cat }}
          </button>
        }
      </section>

      <!-- ═══════════════ FEATURED POST ═══════════════ -->
      @if (featuredPost(); as fp) {
        <section class="b-featured">
          <div class="b-featured__badge">
            <svg viewBox="0 0 16 16" fill="none" width="14" height="14">
              <path
                d="M8 1l2.2 4.4L15 6l-3.5 3.4L12 14 8 11.8 4 14l.5-4.6L1 6l4.8-.6z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
            </svg>
            Featured
          </div>
          <a class="b-featured__card" [routerLink]="['/blog', fp.id]">
            <div class="b-featured__content">
              <div class="b-featured__meta">
                <span
                  class="b-featured__tag"
                  [style.background]="fp.tagColor + '18'"
                  [style.color]="fp.tagColor"
                  >{{ fp.tag }}</span
                >
                <span class="b-featured__date">{{ fp.date | date: 'MMMM d, yyyy' }}</span>
                <span class="b-featured__dot">·</span>
                <span class="b-featured__read">{{ fp.readTime }}</span>
              </div>
              <h2 class="b-featured__title">{{ fp.title }}</h2>
              <p class="b-featured__excerpt">{{ fp.excerpt }}</p>
              <div class="b-featured__author">
                <div class="b-featured__avatar">{{ fp.author.charAt(0) }}</div>
                <div class="b-featured__author-info">
                  <span class="b-featured__author-name">{{ fp.author }}</span>
                  <span class="b-featured__author-role">NGXSMK Team</span>
                </div>
              </div>
            </div>
            @if (fp.code) {
              <div class="b-featured__code">
                <div class="b-featured__code-head">
                  <div class="b-featured__code-dots"><i></i><i></i><i></i></div>
                </div>
                <pre class="b-featured__code-body"><code>{{ fp.code }}</code></pre>
              </div>
            }
          </a>
        </section>
      }

      <!-- ═══════════════ POST GRID ═══════════════ -->
      <section class="b-grid">
        @for (post of filteredPosts(); track post.id; let i = $index) {
          <a
            class="b-post"
            [class.b-post--wide]="i === 0"
            [style.--post-accent]="post.tagColor"
            [routerLink]="['/blog', post.id]"
          >
            <div class="b-post__head">
              <span class="b-post__tag" [style.color]="post.tagColor">{{ post.tag }}</span>
              <span class="b-post__date">{{ post.date | date: 'MMM d' }}</span>
            </div>
            <h3 class="b-post__title">{{ post.title }}</h3>
            <p class="b-post__excerpt">{{ post.excerpt }}</p>
            <div class="b-post__foot">
              <div class="b-post__author-mini">
                <div class="b-post__avatar-sm">{{ post.author.charAt(0) }}</div>
                <span class="b-post__author-name">{{ post.author }}</span>
              </div>
              <span class="b-post__read">{{ post.readTime }}</span>
            </div>
          </a>
        }
      </section>

      <!-- ═══════════════ NEWSLETTER CTA ═══════════════ -->
      <section class="b-newsletter">
        <div class="b-newsletter__inner">
          <div class="b-newsletter__icon">
            <svg viewBox="0 0 24 24" fill="none" width="28" height="28">
              <rect
                x="2"
                y="4"
                width="20"
                height="16"
                rx="2"
                stroke="currentColor"
                stroke-width="1.5"
              />
              <path
                d="M22 7l-10 6L2 7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <ngxsmk-heading level="h2" class="b-newsletter__title">Stay in the loop</ngxsmk-heading>
          <p class="b-newsletter__sub">
            Get notified about new components, theme updates, and AI tooling improvements. No spam —
            just technical updates.
          </p>
          <div class="b-newsletter__form">
            <input
              class="b-newsletter__input"
              type="email"
              placeholder="developer@example.com"
              aria-label="Email address"
            />
            <button ngxsmk-button class="b-newsletter__btn">Subscribe</button>
          </div>
          <p class="b-newsletter__note">Join 2,400+ Angular developers. Unsubscribe anytime.</p>
        </div>
      </section>

      <!-- ═══════════════ TOPICS ═══════════════ -->
      <section class="b-topics">
        <ngxsmk-heading level="h2" class="b-topics__title">Topics</ngxsmk-heading>
        <div class="b-topics__grid">
          @for (topic of topicList; track topic.name) {
            <div class="b-topic" [style.--topic-color]="topic.color">
              <span class="b-topic__icon">{{ topic.icon }}</span>
              <h3 class="b-topic__name">{{ topic.name }}</h3>
              <p class="b-topic__desc">{{ topic.desc }}</p>
              <span class="b-topic__count">{{ topic.count }} articles</span>
            </div>
          }
        </div>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: calc(100vh - 3.5rem);
    }

    .b {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 var(--ngxsmk-space-6, 1.5rem) var(--ngxsmk-space-16, 4rem);
      position: relative;
      z-index: 1;
    }

    /* ──── HERO ──── */
    .b-hero {
      padding: var(--ngxsmk-space-16, 4rem) 0 var(--ngxsmk-space-10, 2.5rem);
      text-align: center;
    }
    .b-hero__inner {
      max-width: 640px;
      margin: 0 auto;
    }
    .b-hero__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: clamp(2rem, 5vw, 3.25rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 1.1;
      margin: 1rem 0 0.75rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .b-hero__sub {
      font-size: var(--ngxsmk-text-title-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.6;
      margin: 0 0 2rem;
    }
    .b-hero__stats {
      display: flex;
      justify-content: center;
      gap: var(--ngxsmk-space-8, 2rem);
      flex-wrap: wrap;
    }
    .b-hero__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
    .b-hero__stat-val {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-md-size);
      font-weight: 800;
      color: var(--ngxsmk-color-primary, #7c3aed);
    }
    .b-hero__stat-label {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.06em;
      font-weight: 500;
    }

    /* ──── FILTERS ──── */
    .b-filters {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 2.5rem;
    }
    .b-filter {
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      padding: 0.4rem 1rem;
      border-radius: var(--ngxsmk-radius-full, 999px);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition: all 0.15s;
    }
    .b-filter:hover {
      color: var(--ngxsmk-color-on-surface);
      border-color: var(--ngxsmk-color-outline-strong);
    }
    .b-filter--active {
      background: var(--ngxsmk-color-primary);
      color: #fff;
      border-color: transparent;
    }

    /* ──── FEATURED ──── */
    .b-featured {
      margin-bottom: 3rem;
    }
    .b-featured__badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #f59e0b;
      margin-bottom: 0.75rem;
    }
    .b-featured__card {
      display: grid;
      grid-template-columns: 1fr 1fr;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      overflow: hidden;
      box-shadow: var(--ngxsmk-shadow-md);
      text-decoration: none;
      color: inherit;
      transition:
        box-shadow 0.2s,
        transform 0.2s;
    }
    .b-featured__card:hover {
      box-shadow: var(--ngxsmk-shadow-lg);
      transform: translateY(-2px);
    }
    .b-featured__content {
      padding: 2rem;
    }
    .b-featured__meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      flex-wrap: wrap;
      margin-bottom: 1rem;
    }
    .b-featured__tag {
      padding: 0.2rem 0.6rem;
      border-radius: var(--ngxsmk-radius-sm);
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
    }
    .b-featured__date,
    .b-featured__read {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .b-featured__dot {
      color: var(--ngxsmk-color-outline);
    }
    .b-featured__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.75rem;
      color: var(--ngxsmk-color-on-surface);
      line-height: 1.25;
    }
    .b-featured__excerpt {
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.65;
      margin: 0 0 1.5rem;
    }
    .b-featured__author {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .b-featured__avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--ngxsmk-color-primary, #7c3aed), #a78bfa);
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      font-weight: 700;
    }
    .b-featured__author-info {
      display: flex;
      flex-direction: column;
    }
    .b-featured__author-name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }
    .b-featured__author-role {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .b-featured__code {
      background: #09090b;
      display: flex;
      flex-direction: column;
    }
    .b-featured__code-head {
      padding: 0.5rem 0.75rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .b-featured__code-dots {
      display: flex;
      gap: 5px;
    }
    .b-featured__code-dots i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }
    .b-featured__code-dots i:first-child {
      background: #ef4444;
    }
    .b-featured__code-dots i:nth-child(2) {
      background: #f59e0b;
    }
    .b-featured__code-dots i:nth-child(3) {
      background: #10b981;
    }
    .b-featured__code-body {
      flex: 1;
      padding: 1.25rem 1rem;
      margin: 0;
      overflow: auto;
    }
    .b-featured__code-body code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: rgba(255, 255, 255, 0.85);
      line-height: 1.7;
    }

    /* ──── POST GRID ──── */
    .b-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: var(--ngxsmk-space-4);
      margin-bottom: 3rem;
    }
    .b-post {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      text-decoration: none;
      color: inherit;
      transition:
        box-shadow 0.2s,
        transform 0.2s;
    }
    .b-post:hover {
      box-shadow: var(--ngxsmk-shadow-md);
      transform: translateY(-2px);
    }
    .b-post--wide {
      grid-column: span 2;
    }
    .b-post__head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0.75rem;
    }
    .b-post__tag {
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
    }
    .b-post__date {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .b-post__title {
      font-size: var(--ngxsmk-text-body-lg-size);
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface);
      line-height: 1.3;
    }
    .b-post__excerpt {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.6;
      margin: 0 0 1.25rem;
      flex: 1;
    }
    .b-post__foot {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 0.75rem;
      border-top: 1px solid var(--ngxsmk-color-outline);
    }
    .b-post__author-mini {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .b-post__avatar-sm {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: color-mix(
        in srgb,
        var(--post-accent, var(--ngxsmk-color-primary)) 15%,
        transparent
      );
      color: var(--post-accent, var(--ngxsmk-color-primary));
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.65rem;
      font-weight: 700;
    }
    .b-post__author-name {
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }
    .b-post__read {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    /* ──── NEWSLETTER ──── */
    .b-newsletter {
      margin-bottom: 3rem;
    }
    .b-newsletter__inner {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      padding: 3rem 2rem;
      text-align: center;
      box-shadow: var(--ngxsmk-shadow-md);
    }
    .b-newsletter__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 56px;
      height: 56px;
      border-radius: var(--ngxsmk-radius-lg);
      background: color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 10%, transparent);
      color: var(--ngxsmk-color-primary, #7c3aed);
      margin-bottom: 1.25rem;
    }
    .b-newsletter__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.75rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .b-newsletter__sub {
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.6;
      margin: 0 auto 1.5rem;
      max-width: 480px;
    }
    .b-newsletter__form {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      max-width: 420px;
      margin: 0 auto 1rem;
    }
    .b-newsletter__input {
      flex: 1;
      padding: 0.6rem 1rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      transition:
        border-color 0.15s,
        box-shadow 0.15s;
    }
    .b-newsletter__input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .b-newsletter__input:focus {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-ring) 25%, transparent);
    }
    .b-newsletter__note {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0;
    }

    /* ──── TOPICS ──── */
    .b-topics {
      margin-bottom: 2rem;
    }
    .b-topics__title {
      font-family: 'Outfit', var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 1.5rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .b-topics__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(14rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4);
    }
    .b-topic {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: 1.5rem;
      transition:
        box-shadow 0.2s,
        transform 0.2s;
    }
    .b-topic:hover {
      box-shadow: var(--ngxsmk-shadow-md);
      transform: translateY(-1px);
    }
    .b-topic__icon {
      font-size: 1.5rem;
    }
    .b-topic__name {
      font-size: var(--ngxsmk-text-body-lg-size);
      font-weight: 700;
      margin: 0.5rem 0 0.35rem;
      color: var(--topic-color, var(--ngxsmk-color-on-surface));
    }
    .b-topic__desc {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.55;
      margin: 0 0 0.75rem;
    }
    .b-topic__count {
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 600;
      color: var(--topic-color, var(--ngxsmk-color-primary));
    }

    /* ──── RESPONSIVE ──── */
    @media (max-width: 768px) {
      .b {
        padding: 0 var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-10, 2.5rem);
      }
      .b-featured__card {
        grid-template-columns: 1fr;
      }
      .b-featured__code {
        display: none;
      }
      .b-grid {
        grid-template-columns: 1fr;
      }
      .b-post--wide {
        grid-column: span 1;
      }
      .b-newsletter__form {
        flex-direction: column;
      }
    }
  `,
})
export class BlogPage implements OnInit {
  private readonly titleService = inject(Title);
  private readonly meta = inject(Meta);

  protected readonly activeFilter = signal('all');
  protected readonly categories = ['Announcement', 'Theming', 'AI', 'Enterprise'];
  protected readonly posts = blogPosts;

  protected readonly topicList = [
    {
      name: 'Announcements',
      icon: '📢',
      desc: 'Major releases, breaking changes, and ecosystem updates.',
      color: '#6366f1',
      count: 2,
    },
    {
      name: 'Theming',
      icon: '🎨',
      desc: 'Design tokens, CSS variables, Tailwind presets, and dark mode.',
      color: '#10b981',
      count: 2,
    },
    {
      name: 'AI',
      icon: '✦',
      desc: 'Chat UIs, streaming, tool calls, reasoning timelines, and MCP.',
      color: '#7c3aed',
      count: 1,
    },
    {
      name: 'Enterprise',
      icon: '🏢',
      desc: 'Kanban, spreadsheet, scheduler, and workflow components.',
      color: '#ef4444',
      count: 1,
    },
  ];

  protected readonly featuredPost = computed(
    () => this.posts.find((p) => p.featured) ?? this.posts[0],
  );

  protected readonly filteredPosts = computed(() => {
    const filter = this.activeFilter();
    const featured = this.featuredPost();
    const rest = this.posts.filter((p) => p.id !== featured.id);
    if (filter === 'all') return rest;
    return rest.filter((p) => p.tag === filter);
  });

  ngOnInit(): void {
    this.titleService.setTitle('Blog — NGXSMK | Angular UI Kit Updates & Guides');
    this.meta.updateTag({
      name: 'description',
      content:
        'Technical deep-dives, release announcements, and guides for building production UIs with NGXSMK signal-native Angular components.',
    });
    this.meta.updateTag({
      property: 'og:title',
      content: 'Blog — NGXSMK | Angular UI Kit Updates & Guides',
    });
    this.meta.updateTag({
      property: 'og:description',
      content:
        'Technical deep-dives, release announcements, and guides for building production UIs with NGXSMK signal-native Angular components.',
    });
  }
}
