import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkNavIconSize = 'sm' | 'md' | 'lg';

@Component({
  standalone: true,
  selector: 'ngxsmk-nav-icon',
  template: `
    <span class="ngxsmk-nav-icon__container">
      <ng-content />
    </span>
    @if (label()) {
      <span class="ngxsmk-nav-icon__label">{{ label() }}</span>
    }
  `,
  host: {
    class: 'ngxsmk-nav-icon',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.data-size]': 'size()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-md);
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host(:hover) {
      background: var(--ngxsmk-color-surface-hover);
      color: var(--ngxsmk-color-on-surface);
    }
    :host([data-active]) {
      color: var(--ngxsmk-color-primary);
    }
    :host([data-active]) .ngxsmk-nav-icon__container {
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-nav-icon__container {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
    }
    .ngxsmk-nav-icon__label {
      font-weight: var(--ngxsmk-font-weight-medium, 500);
    }
    :host([data-size='lg']) {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      font-size: var(--ngxsmk-text-body-md-size);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkNavIcon {
  readonly label = input('');
  readonly active = input(false);
  readonly size = input<NgxsmkNavIconSize>('md');
}
