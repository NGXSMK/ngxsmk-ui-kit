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
    <a class="skip-link" href="#main-content">Skip to content</a>
    <router-outlet />
    <ngxsmk-toaster />
    <app-command-palette />
    <app-scroll-to-top />
  `,
  styles: `
    .skip-link {
      position: absolute;
      inset-inline-start: var(--ngxsmk-space-3, 0.75rem);
      top: var(--ngxsmk-space-3, 0.75rem);
      z-index: 10000;
      padding: 0.5rem 0.875rem;
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      background: var(--ngxsmk-color-primary, #0d9488);
      color: var(--ngxsmk-color-on-primary, #fff);
      font-family: var(--ngxsmk-font-sans, system-ui);
      font-size: 0.875rem;
      font-weight: 600;
      text-decoration: none;
      transform: translateY(-200%);
      transition: transform 0.15s ease;
    }
    .skip-link:focus {
      transform: translateY(0);
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, 0 0 0 3px rgb(13 148 136 / 0.45));
    }
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
      write: () => {
        void this.registry.initialize();
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
