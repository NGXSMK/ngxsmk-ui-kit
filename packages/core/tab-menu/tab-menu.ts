import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-tab-menu',
  template: `
    <div class="ngxsmk-tab-menu__wrapper" role="tablist" [attr.aria-label]="'Navigation menu'">
      <ng-content />
    </div>
  `,
  host: { class: 'ngxsmk-tab-menu' },
  // None: the tab buttons are projected content, so emulated styles can't reach them.
  encapsulation: ViewEncapsulation.None,
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-tab-menu__wrapper {
      display: flex;
      gap: var(--ngxsmk-space-1);
      background: var(--ngxsmk-color-surface-variant);
      padding: var(--ngxsmk-space-1);
      border-radius: var(--ngxsmk-radius-lg);
    }

    @media (max-width: 768px) {
      .ngxsmk-tab-menu__wrapper {
        overflow-x: auto;
        flex-wrap: nowrap;
      }
    }

    .ngxsmk-tab-menu__tab {
      appearance: none;
      margin: 0;
      border: 0;
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      font: inherit;
      font-size: var(--ngxsmk-text-label-md-size, 0.75rem);
      font-weight: 500;
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      cursor: pointer;
      white-space: nowrap;
      transition:
        background-color var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
    }

    .ngxsmk-tab-menu__tab:hover {
      background: var(--ngxsmk-color-surface-hover, rgba(0, 0, 0, 0.05));
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-tab-menu__tab--active {
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.08));
    }

    .ngxsmk-tab-menu__tab:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTabMenu {}
