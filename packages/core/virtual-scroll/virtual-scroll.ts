import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  TemplateRef,
  computed,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Signals-native virtual scroll container for rendering massive datasets with 60 FPS performance.
 *
 * ```html
 * <ngxsmk-virtual-scroll [items]="largeArray" [itemHeight]="40" style="height: 400px">
 *   <ng-template let-item let-i="index">
 *     <div class="row">{{ i }}: {{ item.name }}</div>
 *   </ng-template>
 * </ngxsmk-virtual-scroll>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-virtual-scroll',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngxsmk-virtual-scroll',
  },
  template: `
    <div class="ngxsmk-virtual-scroll__viewport" (scroll)="onScroll($event)">
      <div class="ngxsmk-virtual-scroll__spacer" [style.height.px]="totalHeight()">
        <div
          class="ngxsmk-virtual-scroll__content"
          [style.transform]="'translateY(' + offsetY() + 'px)'"
        >
          @for (item of visibleItems(); track $index) {
            <ng-container
              *ngTemplateOutlet="
                template || defaultItemTpl;
                context: { $implicit: item.data, index: item.index }
              "
            ></ng-container>
          }
        </div>
      </div>
    </div>

    <ng-template #defaultItemTpl let-item let-i="index">
      <div class="ngxsmk-virtual-scroll__default-row">{{ item }}</div>
    </ng-template>
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      height: 300px;
      overflow: hidden;
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
    }

    .ngxsmk-virtual-scroll__viewport {
      width: 100%;
      height: 100%;
      overflow-y: auto;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;
    }

    .ngxsmk-virtual-scroll__spacer {
      position: relative;
      width: 100%;
      pointer-events: none;
    }

    .ngxsmk-virtual-scroll__content {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      pointer-events: auto;
    }

    .ngxsmk-virtual-scroll__default-row {
      display: flex;
      align-items: center;
      padding: 0 var(--ngxsmk-space-3, 0.75rem);
      height: 40px;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
    }
  `,
})
export class NgxsmkVirtualScroll<T = unknown> {
  readonly items = input<T[]>([]);
  readonly itemHeight = input<number>(40);
  readonly buffer = input<number>(5);

  @ContentChild(TemplateRef) protected template?: TemplateRef<{ $implicit: T; index: number }>;

  protected readonly scrollTop = signal(0);

  protected readonly totalHeight = computed(() => this.items().length * this.itemHeight());

  protected readonly startIndex = computed(() => {
    const start = Math.floor(this.scrollTop() / this.itemHeight()) - this.buffer();
    return Math.max(0, start);
  });

  protected readonly endIndex = computed(() => {
    // Assuming viewport height ~400px default if not measured
    const visibleCount = Math.ceil(500 / this.itemHeight());
    const end = this.startIndex() + visibleCount + this.buffer() * 2;
    return Math.min(this.items().length, end);
  });

  protected readonly offsetY = computed(() => this.startIndex() * this.itemHeight());

  protected readonly visibleItems = computed(() => {
    const list = this.items();
    const start = this.startIndex();
    const end = this.endIndex();
    const result: { data: T; index: number }[] = [];
    for (let i = start; i < end; i++) {
      if (list[i] !== undefined) {
        result.push({ data: list[i], index: i });
      }
    }
    return result;
  });

  protected onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    this.scrollTop.set(target.scrollTop);
  }
}
