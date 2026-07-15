import { ChangeDetectionStrategy, Component, Directive } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'ngxsmk-metadata-list-item, [ngxsmkMetadataListItem]',
  host: { class: 'ngxsmk-metadata-list-item' },
})
export class NgxsmkMetadataListItem {}

@Component({
  standalone: true,
  selector: 'ngxsmk-metadata-list',
  template: `<dl class="ngxsmk-metadata-list__dl"><ng-content /></dl>`,
  host: { class: 'ngxsmk-metadata-list' },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-metadata-list__dl { display: grid; grid-template-columns: auto 1fr; gap: var(--ngxsmk-space-2) var(--ngxsmk-space-4); margin: 0; }
    ::ng-deep .ngxsmk-metadata-list-item { display: contents; }
    ::ng-deep .ngxsmk-metadata-list-item dt { color: var(--ngxsmk-color-on-surface-variant); font-size: var(--ngxsmk-text-body-sm-size); white-space: nowrap; }
    ::ng-deep .ngxsmk-metadata-list-item dd { margin: 0; color: var(--ngxsmk-color-on-surface); font-size: var(--ngxsmk-text-body-md-size); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMetadataList {}
