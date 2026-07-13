import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'a[ngxsmk-link]',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-link',
    '[attr.data-variant]': 'variant()',
    '[attr.data-underline]': 'underline() ? "" : null',
    '[attr.target]': 'external() ? "_blank" : null',
    '[attr.rel]': 'external() ? "noopener noreferrer" : null',
  },
  styles: `
    :host {
      display: inline;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-primary);
      text-decoration: none;
      cursor: pointer;
      transition: color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host(:hover) { color: var(--ngxsmk-color-primary-hover); }
    :host(:focus-visible) { outline: 2px solid var(--ngxsmk-color-ring); outline-offset: 2px; border-radius: var(--ngxsmk-radius-sm); }
    :host([data-underline]:hover) { text-decoration: underline; }
    :host([data-variant='muted']) { color: var(--ngxsmk-color-on-surface-variant); }
    :host([data-variant='muted']:hover) { color: var(--ngxsmk-color-on-surface); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkLink {
  readonly variant = input<'default' | 'muted'>('default');
  readonly underline = input(false);
  readonly external = input(false);
}
