import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChild,
  computed,
  input,
} from '@angular/core';

/**
 * Staggered multi-column media layout (masonry/waterfall grid) container.
 *
 * ```html
 * <ngxsmk-masonry-grid [items]="mediaItems" [columns]="3" [gap]="16">
 *   <ng-template #item let-data>
 *     <ngxsmk-card>{{ data.title }}</ngxsmk-card>
 *   </ng-template>
 * </ngxsmk-masonry-grid>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-masonry-grid',
  template: `
    <div class="ngxsmk-masonry" [style.gap]="gap() + 'px'">
      @for (col of columnList(); track $index) {
        <div class="ngxsmk-masonry__col" [style.gap]="gap() + 'px'">
          @for (item of col; track $index) {
            <div class="ngxsmk-masonry__item">
              @if (itemTemplate()) {
                <ng-container
                  *ngTemplateOutlet="itemTemplate()!; context: { $implicit: item }"
                ></ng-container>
              } @else {
                <div class="ngxsmk-masonry__fallback-card">
                  {{ item }}
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-masonry-grid',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
    }

    .ngxsmk-masonry {
      display: flex;
      width: 100%;
      align-items: flex-start;
    }

    .ngxsmk-masonry__col {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .ngxsmk-masonry__item {
      width: 100%;
    }

    .ngxsmk-masonry__fallback-card {
      padding: var(--ngxsmk-space-4, 1rem);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMasonryGrid<T = unknown> {
  /** Array of item data objects to distribute across masonry columns. */
  readonly items = input<T[]>([]);

  /** Number of dynamic columns. Default: 3. */
  readonly columns = input<number>(3);

  /** Pixel gap between columns and items. Default: 16. */
  readonly gap = input<number>(16);

  /** Custom item template ref projected via content. */
  readonly itemTemplate = contentChild<TemplateRef<{ $implicit: T }>>('item');

  protected readonly columnList = computed<T[][]>(() => {
    const list = this.items();
    const colsCount = Math.max(1, this.columns());
    const cols: T[][] = Array.from({ length: colsCount }, () => []);

    list.forEach((item, index) => {
      const targetCol = index % colsCount;
      cols[targetCol].push(item);
    });

    return cols;
  });
}
