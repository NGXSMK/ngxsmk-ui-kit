import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-breadcrumb-item',
  template: `
    @if (separator()) {
      <span class="ngxsmk-breadcrumb-item__sep" aria-hidden="true">{{ separator() }}</span>
    }
    <a
      class="ngxsmk-breadcrumb-item__link"
      [attr.href]="href() || null"
      [attr.aria-current]="href() ? null : 'page'"
    >
      <ng-content />
    </a>
  `,
  host: { class: 'ngxsmk-breadcrumb-item' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-breadcrumb-item__sep {
      display: none;
      margin-inline: var(--ngxsmk-space-1);
      color: var(--ngxsmk-color-outline-strong, var(--ngxsmk-color-on-surface-variant));
    }
    :host + :host .ngxsmk-breadcrumb-item__sep {
      display: inline;
    }
    .ngxsmk-breadcrumb-item__link {
      color: var(--ngxsmk-color-on-surface-variant);
      text-decoration: none;
    }
    .ngxsmk-breadcrumb-item__link:hover {
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-breadcrumb-item__link:not([href]) {
      color: var(--ngxsmk-color-on-surface);
      font-weight: 500;
      pointer-events: none;
      cursor: default;
    }
    @media (max-width: 768px) {
      :host {
        flex-shrink: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBreadcrumbItem {
  readonly href = input('');
  readonly separator = input('/');
}
