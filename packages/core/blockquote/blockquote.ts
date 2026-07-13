import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngxsmk-blockquote',
  template: `
    <div class="ngxsmk-blockquote__content"><ng-content /></div>
    @if (cite()) {
      <footer class="ngxsmk-blockquote__footer">— {{ cite() }}</footer>
    }
  `,
  host: { class: 'ngxsmk-blockquote' },
  styles: `
    :host {
      display: block;
      margin: 0;
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-6);
      border-left: 3px solid var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-md);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface);
      font-style: italic;
    }
    .ngxsmk-blockquote__content { margin: 0; }
    .ngxsmk-blockquote__footer {
      margin-top: var(--ngxsmk-space-2);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      font-style: normal;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBlockquote {
  readonly cite = input('');
}
