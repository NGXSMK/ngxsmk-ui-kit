import { Injectable, inject } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { filter, map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly meta = inject(Meta);

  init(): void {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route.snapshot.data;
        }),
      )
      .subscribe((data) => {
        const desc =
          data['description'] ||
          'NGXSMK - Premium Zoneless and Signal-first Angular Design System featuring AI-ready controls and custom tokens.';
        this.meta.updateTag({ name: 'description', content: desc });
        this.meta.updateTag({ name: 'og:description', content: desc });
        this.meta.updateTag({ name: 'twitter:description', content: desc });

        // Standard SEO and Social Graph Tags
        this.meta.updateTag({ name: 'robots', content: 'index, follow' });
        this.meta.updateTag({
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, shrink-to-fit=no',
        });
        this.meta.updateTag({ property: 'og:type', content: 'website' });
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
      });
  }
}
