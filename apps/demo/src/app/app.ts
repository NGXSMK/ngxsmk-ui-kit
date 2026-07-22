import { Component, inject, HostListener, viewChild, afterNextRender } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { NgxsmkToaster } from '@ngxsmk/core/toast';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { SeoService } from './seo.service';
import { CommandPalette } from './core/command-palette';
import { ComponentRegistry } from './core/component-registry';
import { ScrollToTop } from './core/scroll-to-top';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxsmkToaster, CommandPalette, ScrollToTop],
  template: `
    <router-outlet />
    <ngxsmk-toaster />
    <app-command-palette />
    <app-scroll-to-top />
  `,
})
export class App {
  protected readonly theme = inject(NgxsmkThemeService);
  private readonly seo = inject(SeoService);
  private readonly registry = inject(ComponentRegistry);

  readonly cmdPalette = viewChild(CommandPalette);

  constructor() {
    this.seo.init();
    inject(Router)
      .events.pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        window.scrollTo(0, 0);
      });
    let stored: string | null = null;
    try {
      stored = document.defaultView?.localStorage?.getItem('ngxsmk-theme-mode') ?? null;
    } catch {
      /* noop */
    }
    if (!stored) {
      this.theme.setMode('light');
    }

    afterNextRender({
      write: async () => {
        await this.registry.initialize();
      },
    });
  }

  @HostListener('window:keydown', ['$event'])
  protected handleGlobalShortcut(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      const palette = this.cmdPalette();
      if (palette?.isOpen()) {
        palette.close();
      } else {
        palette?.open();
      }
    }
  }
}
