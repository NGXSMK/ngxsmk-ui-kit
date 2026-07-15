import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-app-shell',
  template: `
    @if (sidebar()) {
      <aside class="ngxsmk-app-shell__sidebar"><ng-content select="[sidebar]" /></aside>
    }
    <div class="ngxsmk-app-shell__main">
      @if (topbar()) {
        <header class="ngxsmk-app-shell__header"><ng-content select="[topbar]" /></header>
      }
      <main class="ngxsmk-app-shell__content"><ng-content /></main>
      @if (footer()) {
        <footer class="ngxsmk-app-shell__footer"><ng-content select="[footer]" /></footer>
      }
    </div>
  `,
  host: { class: 'ngxsmk-app-shell' },
  styles: `
    :host {
      display: grid;
      grid-template-columns: auto 1fr;
      min-height: 100vh;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-app-shell__main {
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ngxsmk-app-shell__content {
      flex: 1;
      overflow-y: auto;
    }
    @media (max-width: 768px) {
      :host {
        grid-template-columns: 1fr;
      }
      .ngxsmk-app-shell__sidebar {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAppShell {
  readonly sidebar = input(false);
  readonly topbar = input(true);
  readonly footer = input(false);
}
