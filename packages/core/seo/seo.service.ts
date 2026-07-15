import { DOCUMENT } from '@angular/common';
import {
  ENVIRONMENT_INITIALIZER,
  EnvironmentProviders,
  Injectable,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface NgxsmkSeoConfig {
  /** Document title (also mirrored to `og:title` / `twitter:title`). */
  title?: string;
  /** Meta description (also mirrored to `og:description` / `twitter:description`). */
  description?: string;
  /** Canonical URL — upserts a `<link rel="canonical">`. */
  canonical?: string;
  /** Robots directive, e.g. `index, follow`. Defaults to `index, follow`. */
  robots?: string;
  /** Open Graph `og:type` (`website` | `article`). */
  type?: 'website' | 'article';
  /** Page URL, mirrored to `og:url` and used as the canonical base. */
  url?: string;
  /** Social share image, mirrored to `og:image` / `twitter:image`. */
  image?: string;
  /** `og:site_name`. */
  siteName?: string;
  /** `og:locale`, e.g. `en_US`. */
  locale?: string;
  /** Twitter card type. Defaults to `summary_large_image`. */
  twitterCard?: 'summary' | 'summary_large_image';
  /** Extra Open Graph properties (keyed without the `og:` prefix). */
  og?: Record<string, string>;
  /** Extra Twitter card properties (keyed without the `twitter:` prefix). */
  twitter?: Record<string, string>;
  /** JSON-LD structured data (object or array of objects). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

const CANONICAL_ID = 'ngxsmk-seo-canonical';
const JSONLD_ID = 'ngxsmk-seo-jsonld';

/**
 * Declarative SEO helper for Angular apps: manages the document title, meta
 * description, canonical link, Open Graph / Twitter Card tags, robots
 * directive, and JSON-LD structured data from a single API.
 *
 * SSR-safe — every DOM write goes through the injected `Document` and
 * degrades gracefully when `head` is unavailable (e.g. prerender shells).
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkSeoService {
  private readonly document = inject(DOCUMENT);
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  /** Apply a full SEO configuration in a single call. */
  update(config: NgxsmkSeoConfig): void {
    if (config.title != null) this.setTitle(config.title);
    if (config.description != null) this.setDescription(config.description);
    if (config.canonical != null) this.setCanonical(config.canonical);
    this.setRobots(config.robots ?? 'index, follow');

    const og: Record<string, string> = { ...config.og };
    if (config.type) og['type'] = config.type;
    if (config.url) og['url'] = config.url;
    if (config.image) og['image'] = config.image;
    if (config.siteName) og['site_name'] = config.siteName;
    if (config.locale) og['locale'] = config.locale;
    if (config.title != null) og['title'] = config.title;
    if (config.description != null) og['description'] = config.description;
    this.setOpenGraph(og);

    const twitter: Record<string, string> = { ...config.twitter };
    twitter['card'] = config.twitterCard ?? 'summary_large_image';
    if (config.title != null) twitter['title'] = config.title;
    if (config.description != null) twitter['description'] = config.description;
    if (config.image) twitter['image'] = config.image;
    this.setTwitterCard(twitter);

    if (config.jsonLd != null) this.setJsonLd(config.jsonLd);
  }

  setTitle(title: string): void {
    this.title.setTitle(title);
    this.upsertMeta('property', 'og:title', title);
  }

  setDescription(description: string): void {
    this.upsertMeta('name', 'description', description);
    this.upsertMeta('property', 'og:description', description);
    this.upsertMeta('name', 'twitter:description', description);
  }

  setRobots(content: string): void {
    this.upsertMeta('name', 'robots', content);
  }

  /** Upsert a `<link rel="canonical" href="...">`. */
  setCanonical(url: string): void {
    const head = this.document.head;
    if (!head) return;
    let link = this.document.getElementById(CANONICAL_ID) as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.id = CANONICAL_ID;
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /** Set one or more Open Graph tags (keys without the `og:` prefix). */
  setOpenGraph(props: Record<string, string>): void {
    for (const [key, value] of Object.entries(props)) {
      this.upsertMeta('property', `og:${key}`, value);
    }
  }

  /** Set one or more Twitter Card tags (keys without the `twitter:` prefix). */
  setTwitterCard(props: Record<string, string>): void {
    for (const [key, value] of Object.entries(props)) {
      this.upsertMeta('name', `twitter:${key}`, value);
    }
  }

  /** Upsert a `<script type="application/ld+json">` block with the given data. */
  setJsonLd(data: Record<string, unknown> | Record<string, unknown>[]): void {
    const head = this.document.head;
    if (!head) return;
    let script = this.document.getElementById(JSONLD_ID) as HTMLScriptElement | null;
    if (!script) {
      script = this.document.createElement('script');
      script.id = JSONLD_ID;
      script.type = 'application/ld+json';
      head.appendChild(script);
    }
    script.textContent = JSON.stringify(data);
  }

  private upsertMeta(attr: 'name' | 'property', key: string, value: string): void {
    const selector = `${attr}="${key}"`;
    if (this.meta.getTag(selector)) {
      this.meta.updateTag({ [attr]: key, content: value });
    } else {
      this.meta.addTag({ [attr]: key, content: value });
    }
  }
}

/**
 * Apply default SEO metadata once at application bootstrap. Per-route updates
 * should still run through `NgxsmkSeoService.update()` (e.g. from a router
 * subscription) so the canonical URL and title stay in sync with navigation.
 */
export function provideSeo(config: NgxsmkSeoConfig): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: ENVIRONMENT_INITIALIZER,
      useValue: () => inject(NgxsmkSeoService).update(config),
      multi: true,
    },
  ]);
}
