import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-field-label, [ngxsmkFieldLabel], label[ngxsmkFieldLabel]',
  template: `<ng-content />
    @if (required()) {
      <span class="ngxsmk-field-label__req" aria-hidden="true">*</span>
    }`,
  host: { class: 'ngxsmk-field-label' },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-field-label__req {
      color: var(--ngxsmk-color-error);
      margin-left: var(--ngxsmk-space-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkFieldLabel {
  readonly required = input(false);
}
