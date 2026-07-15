import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-code-block',
  template: `<pre
    class="ngxsmk-code-block__pre"
  ><code class="ngxsmk-code-block__code"><ng-content /></code></pre>`,
  host: { class: 'ngxsmk-code-block' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.8125rem;
    }
    .ngxsmk-code-block__pre {
      background: var(--ngxsmk-color-surface-variant);
      padding: var(--ngxsmk-space-4);
      border-radius: var(--ngxsmk-radius-md);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      margin: 0;
    }
    .ngxsmk-code-block__code {
      color: var(--ngxsmk-color-on-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCodeBlock {
  readonly language = input('');
}
