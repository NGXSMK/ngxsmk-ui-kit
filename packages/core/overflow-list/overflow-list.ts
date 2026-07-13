import { ChangeDetectionStrategy, Component, input, signal, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'ngxsmk-overflow-list',
  template: `
    <div class="ngxsmk-overflow-list__items" [class.expanded]="expanded()">
      <ng-content select="[item]" />
      @if (overflowCount() > 0) {
        <button type="button" class="ngxsmk-overflow-list__more" (click)="expanded.set(true)">
          +{{ overflowCount() }} more
        </button>
      } @else if (expanded() && (total() || 0) > max()) {
        <button type="button" class="ngxsmk-overflow-list__more" (click)="expanded.set(false)">
          Show less
        </button>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-overflow-list',
    '[attr.data-max]': 'max()',
    '[class.expanded]': 'expanded()',
  },
  encapsulation: ViewEncapsulation.None,
  styles: `
    .ngxsmk-overflow-list {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .ngxsmk-overflow-list__items {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      flex-wrap: wrap;
    }
    .ngxsmk-overflow-list__more {
      border: none;
      background: var(--ngxsmk-color-surface-variant);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-full);
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      font-size: inherit;
    }
    .ngxsmk-overflow-list__more:hover {
      background: var(--ngxsmk-color-outline);
    }

    /* Declarative nth-child hiding logic based on data-max attribute */
    .ngxsmk-overflow-list[data-max="1"]:not(.expanded) [item]:nth-child(n+2) { display: none !important; }
    .ngxsmk-overflow-list[data-max="2"]:not(.expanded) [item]:nth-child(n+3) { display: none !important; }
    .ngxsmk-overflow-list[data-max="3"]:not(.expanded) [item]:nth-child(n+4) { display: none !important; }
    .ngxsmk-overflow-list[data-max="4"]:not(.expanded) [item]:nth-child(n+5) { display: none !important; }
    .ngxsmk-overflow-list[data-max="5"]:not(.expanded) [item]:nth-child(n+6) { display: none !important; }
    .ngxsmk-overflow-list[data-max="6"]:not(.expanded) [item]:nth-child(n+7) { display: none !important; }
    .ngxsmk-overflow-list[data-max="7"]:not(.expanded) [item]:nth-child(n+8) { display: none !important; }
    .ngxsmk-overflow-list[data-max="8"]:not(.expanded) [item]:nth-child(n+9) { display: none !important; }
    .ngxsmk-overflow-list[data-max="9"]:not(.expanded) [item]:nth-child(n+10) { display: none !important; }
    .ngxsmk-overflow-list[data-max="10"]:not(.expanded) [item]:nth-child(n+11) { display: none !important; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkOverflowList {
  readonly max = input(3);
  readonly total = input(0);

  protected readonly expanded = signal(false);

  protected overflowCount(): number {
    if (this.expanded()) return 0;
    return Math.max(0, (this.total() || 0) - this.max());
  }
}
