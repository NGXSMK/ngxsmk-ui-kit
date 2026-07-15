import { ChangeDetectionStrategy, Component, ElementRef, afterNextRender, input, signal, inject } from '@angular/core';
import { NgxsmkResizeHandle } from '@ngxsmk/core/resize-handle';

@Component({
  standalone: true,
  selector: 'ngxsmk-resizable',
  template: `
    <div
      class="ngxsmk-resizable__panel"
      [style.width]="orientation() === 'horizontal' ? size() : undefined"
      [style.height]="orientation() === 'vertical' ? size() : undefined"
    >
      <ng-content />
    </div>
    <ngxsmk-resize-handle
      [orientation]="orientation()"
      (resizing)="onResizing($event)"
    />
  `,
  host: {
    class: 'ngxsmk-resizable',
    '[attr.data-orientation]': 'orientation()',
  },
  styles: `
    :host {
      display: flex;
    }

    :host([data-orientation='vertical']) {
      flex-direction: column;
    }

    .ngxsmk-resizable__panel {
      flex: 1 1 auto;
      min-width: 0;
      min-height: 0;
      overflow: hidden;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgxsmkResizeHandle],
})
export class NgxsmkResizable {
  readonly initialWidth = input('');
  readonly initialHeight = input('');
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly sizeSignal = signal('');
  private startPointer = 0;
  private startSize = 0;
  private readonly el: HTMLElement;

  constructor() {
    this.el = this.elementRef.nativeElement;
    afterNextRender(() => {
      const init = this.orientation() === 'horizontal' ? this.initialWidth() : this.initialHeight();
      if (init) {
        this.sizeSignal.set(init);
      }
    });
  }

  protected readonly size = this.sizeSignal.asReadonly();

  protected onResizing(event: MouseEvent): void {
    const panel = this.el.querySelector<HTMLElement>('.ngxsmk-resizable__panel');
    if (!panel) { return; }

    const onMove = (e: MouseEvent) => {
      e.preventDefault();
      const delta = this.orientation() === 'horizontal'
        ? e.clientX - this.startPointer
        : e.clientY - this.startPointer;
      const newSize = Math.max(50, this.startSize + delta);
      this.sizeSignal.set(`${newSize}px`);
    };

    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };

    this.startPointer = this.orientation() === 'horizontal' ? event.clientX : event.clientY;
    this.startSize = this.orientation() === 'horizontal' ? panel.offsetWidth : panel.offsetHeight;

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
}
