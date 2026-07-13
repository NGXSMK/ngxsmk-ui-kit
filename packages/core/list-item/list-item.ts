import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkListItemVariant = 'default' | 'active' | 'disabled';

@Component({
  selector: 'ngxsmk-list-item, [ngxsmkListItem]',
  template: `
    @if (href()) {
      <a class="ngxsmk-list-item__link" [href]="href()"><ng-content /></a>
    } @else {
      <ng-content />
    }
  `,
  host: {
    class: 'ngxsmk-list-item',
    '[attr.data-variant]': 'variant()',
    '[attr.data-has-link]': 'href() ? "" : null',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-md);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
      cursor: default;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    
    /* Apply padding/hover only on non-link hosts to prevent collapse */
    :host:not([data-has-link]) {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
    }
    :host:not([data-has-link]):hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    :host([data-variant='active']:not([data-has-link])) {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      font-weight: 500;
    }
    :host([data-variant='disabled']) {
      opacity: 0.5;
      pointer-events: none;
    }

    /* Apply padding/hover on link elements to occupy the full cell bounding area */
    .ngxsmk-list-item__link {
      text-decoration: none;
      color: inherit;
      display: flex;
      align-items: center;
      gap: inherit;
      width: 100%;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border-radius: inherit;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-list-item__link:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    :host([data-variant='active']) .ngxsmk-list-item__link {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      font-weight: 500;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkListItem {
  readonly href = input('');
  readonly variant = input<NgxsmkListItemVariant>('default');
}
