import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NgxsmkSeoService } from '@ngxsmk/core/seo';
import { APP_VERSION } from './core/version';

const SITE_NAME = 'NGXSMK';
const SITE_ORIGIN = 'https://ngxsmk.github.io/ngxsmk-ui-kit';
const DEFAULT_DESCRIPTION =
  'NGXSMK is an Angular-first, MIT-licensed UI kit — signals-native, zoneless components and a universal design-token engine.';
const SOCIAL_IMAGE = `${SITE_ORIGIN}/assets/og-image.png`;

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seo = inject(NgxsmkSeoService);

  init(): void {
    this.seo.update({
      siteName: SITE_NAME,
      locale: 'en_US',
      image: SOCIAL_IMAGE,
      twitterCard: 'summary_large_image',
      robots: 'index, follow, max-image-preview:large',
      og: {
        'image:alt': 'NGXSMK — Angular UI kit',
        'image:width': '1200',
        'image:height': '630',
        'image:type': 'image/png',
      },
      twitter: {
        'image:alt': 'NGXSMK — Angular UI kit',
      },
      jsonLd: this.siteGraph('/'),
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot;
        }),
      )
      .subscribe((snapshot) => {
        const title = snapshot.title || (snapshot.data['title'] as string | undefined) || SITE_NAME;
        const description =
          (snapshot.data['description'] as string | undefined) ?? DEFAULT_DESCRIPTION;
        const path = this.cleanPath(this.router.url);
        const url = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;

        this.seo.update({
          title,
          description,
          canonical: url,
          url,
          siteName: SITE_NAME,
          type: 'website',
          image: SOCIAL_IMAGE,
          locale: 'en_US',
          twitterCard: 'summary_large_image',
          robots: 'index, follow, max-image-preview:large',
          og: {
            'image:alt': title,
            'image:width': '1200',
            'image:height': '630',
            'image:type': 'image/png',
          },
          twitter: {
            'image:alt': title,
          },
          jsonLd: this.siteGraph(path, title, description),
        });
      });
  }

  /** Strip query/hash and normalize to a leading-slash path. */
  private cleanPath(url: string): string {
    const bare = (url || '/').split('?')[0].split('#')[0] || '/';
    if (!bare.startsWith('/')) return `/${bare}`;
    return bare === '' ? '/' : bare;
  }

  private siteGraph(
    path: string,
    pageTitle = SITE_NAME,
    pageDescription = DEFAULT_DESCRIPTION,
  ): Record<string, unknown>[] {
    const pageUrl = `${SITE_ORIGIN}${path === '/' ? '/' : path}`;
    const crumbs = this.breadcrumbs(path);

    return [
      {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_ORIGIN}/#organization`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        logo: `${SITE_ORIGIN}/favicon.svg`,
        description: DEFAULT_DESCRIPTION,
        sameAs: ['https://github.com/NGXSMK/ngxsmk-ui-kit', 'https://www.npmjs.com/org/ngxsmk'],
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_ORIGIN}/#website`,
        name: SITE_NAME,
        url: SITE_ORIGIN,
        description: DEFAULT_DESCRIPTION,
        publisher: { '@id': `${SITE_ORIGIN}/#organization` },
        inLanguage: 'en',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': `${SITE_ORIGIN}/#software`,
        name: 'NGXSMK UI Kit',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Web',
        softwareVersion: APP_VERSION,
        license: 'https://opensource.org/licenses/MIT',
        url: SITE_ORIGIN,
        downloadUrl: 'https://www.npmjs.com/package/@ngxsmk/core',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        author: { '@id': `${SITE_ORIGIN}/#organization` },
      },
      {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: pageTitle,
        description: pageDescription,
        isPartOf: { '@id': `${SITE_ORIGIN}/#website` },
        about: { '@id': `${SITE_ORIGIN}/#software` },
        inLanguage: 'en',
      },
      ...(crumbs.length > 1
        ? [
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: crumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: crumb.item,
              })),
            },
          ]
        : []),
    ];
  }

  private breadcrumbs(path: string): { name: string; item: string }[] {
    const segments = path.split('/').filter(Boolean);
    const crumbs: { name: string; item: string }[] = [
      { name: 'Home', item: `${SITE_ORIGIN}/` },
    ];
    let acc = '';
    for (const segment of segments) {
      acc += `/${segment}`;
      crumbs.push({
        name: segment
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(' '),
        item: `${SITE_ORIGIN}${acc}`,
      });
    }
    return crumbs;
  }
}
