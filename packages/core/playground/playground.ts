import { ChangeDetectionStrategy, Component, booleanAttribute, input, signal } from '@angular/core';

export type ViewportSize = 'full' | 'mobile' | 'tablet' | 'desktop';

@Component({
  standalone: true,
  selector: 'ngxsmk-playground',
  template: `
    <div class="ngxsmk-playground" [class.dark]="isDark()">
      <header class="ngxsmk-playground__header">
        <div class="ngxsmk-playground__logo">
          <svg
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          <span>ngxsmk Component Playground</span>
        </div>

        <div class="ngxsmk-playground__actions">
          <button
            type="button"
            class="ngxsmk-playground__btn"
            (click)="toggleTheme()"
            [attr.aria-label]="isDark() ? 'Switch to light mode' : 'Switch to dark mode'"
          >
            @if (isDark()) {
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <circle cx="12" cy="12" r="4" />
                <path
                  d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
                />
              </svg>
            } @else {
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            }
          </button>

          <button
            type="button"
            class="ngxsmk-playground__btn"
            (click)="toggleRtl()"
            [attr.aria-label]="isRtl() ? 'Switch to LTR' : 'Switch to RTL'"
          >
            <span>{{ isRtl() ? 'LTR' : 'RTL' }}</span>
          </button>

          <div class="ngxsmk-playground__select-wrapper">
            <select
              [value]="viewportSize()"
              (change)="updateViewport($event)"
              aria-label="Viewport size"
            >
              <option value="full">Full Screen</option>
              <option value="mobile">Mobile (375px)</option>
              <option value="tablet">Tablet (768px)</option>
              <option value="desktop">Desktop (1200px)</option>
            </select>
          </div>
        </div>
      </header>

      <div class="ngxsmk-playground__body">
        <main class="ngxsmk-playground__main">
          <div class="ngxsmk-playground__viewport-container">
            <div
              class="ngxsmk-playground__viewport"
              [class.ngxsmk-playground__viewport--mobile]="viewportSize() === 'mobile'"
              [class.ngxsmk-playground__viewport--tablet]="viewportSize() === 'tablet'"
              [class.ngxsmk-playground__viewport--desktop]="viewportSize() === 'desktop'"
              [dir]="isRtl() ? 'rtl' : 'ltr'"
            >
              <ng-content select="[preview]" />
            </div>
          </div>
        </main>

        <aside
          class="ngxsmk-playground__sidebar"
          role="complementary"
          aria-label="Properties and configuration"
        >
          <h4 class="ngxsmk-playground__sidebar-title">Properties & Knobs</h4>
          <div class="ngxsmk-playground__sidebar-content">
            <ng-content select="[knobs]" />
          </div>
        </aside>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .ngxsmk-playground {
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--ngxsmk-color-background);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans, sans-serif);
      transition: background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-playground.dark {
      background: var(--ngxsmk-color-background);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-playground__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-6);
      background: var(--ngxsmk-color-surface);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      z-index: 10;
      box-shadow: var(--ngxsmk-shadow-sm);
    }

    .ngxsmk-playground__logo {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      font-weight: var(--ngxsmk-font-weight-bold, 700);
      font-size: var(--ngxsmk-text-title-sm-size, 1.125rem);
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-playground__actions {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
    }

    .ngxsmk-playground__btn {
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--ngxsmk-radius-md, 6px);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      font-size: var(--ngxsmk-text-label-sm-size, 0.875rem);
      transition:
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-playground__btn:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-playground__select-wrapper select {
      height: 2.25rem;
      padding: 0 var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-md, 6px);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      cursor: pointer;
      outline: none;
    }

    .ngxsmk-playground__body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }

    .ngxsmk-playground__main {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .ngxsmk-playground__viewport-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-6);
      overflow: auto;
      background: var(--ngxsmk-color-background);
    }

    .ngxsmk-playground__viewport {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg, 8px);
      box-shadow: var(--ngxsmk-shadow-md);
      transition:
        width var(--ngxsmk-duration-slow) var(--ngxsmk-ease-in-out),
        height var(--ngxsmk-duration-slow) var(--ngxsmk-ease-in-out),
        transform var(--ngxsmk-duration-slow) var(--ngxsmk-ease-in-out),
        opacity var(--ngxsmk-duration-slow) var(--ngxsmk-ease-in-out),
        box-shadow var(--ngxsmk-duration-slow) var(--ngxsmk-ease-in-out);
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-6);
      box-sizing: border-box;
      overflow: auto;
    }

    .ngxsmk-playground__viewport--mobile {
      width: 375px;
      height: 667px;
    }

    .ngxsmk-playground__viewport--tablet {
      width: 768px;
      height: 1024px;
    }

    .ngxsmk-playground__viewport--desktop {
      width: 1200px;
      height: 800px;
    }

    .ngxsmk-playground__sidebar {
      width: 320px;
      background: var(--ngxsmk-color-surface);
      border-inline-start: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-shadow: var(--ngxsmk-shadow-sm);
    }

    .ngxsmk-playground__sidebar-title {
      margin: 0;
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-6);
      font-size: var(--ngxsmk-text-title-sm-size, 1rem);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-playground__sidebar-content {
      flex: 1;
      padding: var(--ngxsmk-space-6);
      overflow-y: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPlayground {
  readonly initialDark = input(false, { transform: booleanAttribute });

  protected readonly isDark = signal(false);
  protected readonly isRtl = signal(false);
  protected readonly viewportSize = signal<ViewportSize>('full');

  constructor() {
    this.isDark.set(this.initialDark());
  }

  protected toggleTheme(): void {
    this.isDark.update((d) => !d);
  }

  protected toggleRtl(): void {
    this.isRtl.update((r) => !r);
  }

  protected updateViewport(event: Event): void {
    const val = (event.target as HTMLSelectElement).value as ViewportSize;
    this.viewportSize.set(val);
  }
}
