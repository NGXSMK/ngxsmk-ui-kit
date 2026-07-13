import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngxsmk-breadcrumb-item',
  template: `
    @if (href()) {
      <a class="ngxsmk-breadcrumb-item__link" [href]="href()"><ng-content /></a>
    } @else {
      <span class="ngxsmk-breadcrumb-item__current"><ng-content /></span>
    }
  `,
  host: { class: 'ngxsmk-breadcrumb-item' },
  styles: `
    :host { display: inline-flex; align-items: center; gap: var(--ngxsmk-space-2); font-family: var(--ngxsmk-font-sans); font-size: var(--ngxsmk-text-body-sm-size); color: var(--ngxsmk-color-on-surface-variant); }
    .ngxsmk-breadcrumb-item__link { color: var(--ngxsmk-color-on-surface-variant); text-decoration: none; }
    .ngxsmk-breadcrumb-item__link:hover { color: var(--ngxsmk-color-primary); }
    .ngxsmk-breadcrumb-item__current { color: var(--ngxsmk-color-on-surface); font-weight: 500; }
    @media (max-width: 768px) {
      :host { flex-shrink: 0; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBreadcrumbItem {
  readonly href = input('');
}
