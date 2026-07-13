import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxsmkToaster } from '@ngxsmk/core/toast';
import { NgxsmkThemeService } from '@ngxsmk/theme';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgxsmkToaster,
  ],
  template: `
    <router-outlet />
    <ngxsmk-toaster />
  `,
})
export class App {
  protected readonly theme = inject(NgxsmkThemeService);

  constructor() {
    let stored: string | null = null;
    try {
      stored = document.defaultView?.localStorage?.getItem('ngxsmk-theme-mode') ?? null;
    } catch {
      // localStorage unavailable
    }
    if (!stored) {
      this.theme.setMode('light');
    }
  }
}
