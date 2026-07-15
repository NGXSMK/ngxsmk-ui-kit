import { Component, inject, HostListener, viewChild, afterNextRender } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxsmkToaster } from '@ngxsmk/core/toast';
import { NgxsmkThemeService } from '@ngxsmk/theme';
import { SeoService } from './seo.service';
import { CommandPalette } from './core/command-palette';
import { SearchService } from './core/search.service';
import { ComponentRegistry } from './core/component-registry';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NgxsmkToaster, CommandPalette],
  template: `
    <router-outlet />
    <ngxsmk-toaster />
    <app-command-palette />
  `,
})
export class App {
  protected readonly theme = inject(NgxsmkThemeService);
  private readonly seo = inject(SeoService);
  private readonly searchService = inject(SearchService);
  private readonly registry = inject(ComponentRegistry);

  readonly cmdPalette = viewChild(CommandPalette);

  constructor() {
    this.seo.init();
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
        this.searchService.buildIndex(this.registry.allComponents());
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
