import {
  Directive,
  inject,
  output,
  ElementRef,
  DestroyRef,
} from '@angular/core';

export interface NgxsmkResizeObserverSize {
  width: number;
  height: number;
}

@Directive({
  selector: '[ngxsmkResizeObserver]',
})
export class NgxsmkResizeObserver {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);
  readonly sizeChanged = output<NgxsmkResizeObserverSize>();

  private readonly ro: ResizeObserver;

  constructor() {
    this.ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize, blockSize } = entry.borderBoxSize?.[0] ?? {
          inlineSize: entry.contentRect.width,
          blockSize: entry.contentRect.height,
        };
        this.sizeChanged.emit({
          width: Math.round(inlineSize),
          height: Math.round(blockSize),
        });
      }
    });
    this.ro.observe(this.el.nativeElement);
    this.destroyRef.onDestroy(() => this.ro.disconnect());
  }
}
