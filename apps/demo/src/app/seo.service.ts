import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { NgxsmkSeoService } from '@ngxsmk/core/seo';

const SITE_NAME = 'NGXSMK';
const DEFAULT_DESCRIPTION =
  'NGXSMK - Premium Zoneless and Signal-first Angular Design System featuring AI-ready controls and custom tokens.';
const SOCIAL_IMAGE = 'https://ngxsmk.dev/assets/og-image.png';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly seo = inject(NgxsmkSeoService);

  init(): void {
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
        const title = (snapshot.data['title'] as string) ?? SITE_NAME;
        const description = (snapshot.data['description'] as string) ?? DEFAULT_DESCRIPTION;
        const url = this.canonicalUrl();

        this.seo.update({
          title,
          description,
          canonical: url,
          url,
          siteName: SITE_NAME,
          type: 'website',
          image: SOCIAL_IMAGE,
          twitterCard: 'summary_large_image',
        });
      });
  }

  private canonicalUrl(): string {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ngxsmk.dev';
    return `${origin}${this.router.url || '/'}`;
  }
}
