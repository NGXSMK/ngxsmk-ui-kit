import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

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
      grid-template-columns: auto minmax(0, 1fr);
      min-height: 100vh;
      min-height: 100dvh;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-app-shell__main {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      min-width: 0;
    }
    .ngxsmk-app-shell__header {
      padding-top: var(--ngxsmk-safe-area-top, env(safe-area-inset-top, 0px));
    }
    .ngxsmk-app-shell__content {
      flex: 1;
      overflow-y: auto;
    }
    .ngxsmk-app-shell__footer {
      padding-bottom: var(--ngxsmk-safe-area-bottom, env(safe-area-inset-bottom, 0px));
    }
    @media (max-width: 768px) {
      :host {
        grid-template-columns: minmax(0, 1fr);
      }
      .ngxsmk-app-shell__sidebar {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAppShell {
  readonly sidebar = input(false, { transform: booleanAttribute });
  readonly topbar = input(true, { transform: booleanAttribute });
  readonly footer = input(false, { transform: booleanAttribute });
}
