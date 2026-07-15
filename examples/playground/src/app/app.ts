import { Component, inject } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkThemeService, astryxPreset } from '@ngxsmk/theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [NgxsmkButton],
  template: `
    <main style="padding: 2rem; font-family: var(--ngxsmk-font-sans)">
      <h1>@ngxsmk Playground</h1>
      <p>Built against the compiled (partial-Ivy) @ngxsmk packages.</p>
      <button ngxsmk-button variant="primary" (click)="theme.toggle()">Toggle theme</button>
    </main>
  `,
})
export class App {
  protected readonly theme = inject(NgxsmkThemeService);

  constructor() {
    this.theme.applyTheme(astryxPreset);
  }
}
