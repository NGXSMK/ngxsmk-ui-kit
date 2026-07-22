import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  afterNextRender,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

/**
 * Digital signature canvas component with smooth stroke rendering and export capabilities.
 *
 * ```html
 * <ngxsmk-signature-pad [(value)]="signatureDataUrl" (cleared)="onClear()" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-signature-pad',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkSignaturePad),
    },
  ],
  host: {
    class: 'ngxsmk-signature-pad',
    '[class.ngxsmk-signature-pad--disabled]': 'disabled()',
  },
  template: `
    <div class="ngxsmk-signature-pad__container">
      <canvas
        #canvas
        class="ngxsmk-signature-pad__canvas"
        [width]="width()"
        [height]="height()"
        (mousedown)="startDrawing($event)"
        (mousemove)="draw($event)"
        (mouseup)="stopDrawing()"
        (mouseleave)="stopDrawing()"
        (touchstart)="handleTouchStart($event)"
        (touchmove)="handleTouchMove($event)"
        (touchend)="stopDrawing()"
      ></canvas>

      <div class="ngxsmk-signature-pad__controls">
        <button
          type="button"
          class="ngxsmk-signature-pad__btn"
          [disabled]="disabled() || isEmpty()"
          (click)="clear()"
        >
          Clear
        </button>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
    }

    .ngxsmk-signature-pad__container {
      position: relative;
      display: inline-flex;
      flex-direction: column;
      border: 1px solid var(--ngxsmk-color-outline, #d1d5db);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      overflow: hidden;
    }

    .ngxsmk-signature-pad__canvas {
      touch-action: none;
      cursor: crosshair;
      background: transparent;
    }

    .ngxsmk-signature-pad--disabled .ngxsmk-signature-pad__canvas {
      cursor: not-allowed;
      opacity: 0.6;
    }

    .ngxsmk-signature-pad__controls {
      display: flex;
      justify-content: flex-end;
      padding: var(--ngxsmk-space-2, 0.5rem);
      border-top: 1px dashed var(--ngxsmk-color-outline, #e5e7eb);
      background: var(--ngxsmk-color-surface-variant, #fafafa);
    }

    .ngxsmk-signature-pad__btn {
      padding: 0.25rem 0.625rem;
      border: 1px solid var(--ngxsmk-color-outline, #d1d5db);
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .ngxsmk-signature-pad__btn:hover:not(:disabled) {
      background: var(--ngxsmk-color-error, #ef4444);
      color: #ffffff;
      border-color: var(--ngxsmk-color-error, #ef4444);
    }

    .ngxsmk-signature-pad__btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
})
export class NgxsmkSignaturePad extends CvaBase<string> implements NgxsmkFormFieldControl {
  readonly width = input<number>(400);
  readonly height = input<number>(180);
  readonly penColor = input<string>('#09090b');
  readonly penWidth = input<number>(2);
  readonly disabled = input<boolean>(false);

  readonly value = model<string>('');
  readonly cleared = output<void>();

  readonly id = input(ngxsmkUniqueId('ngxsmk-signature-pad'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  @ViewChild('canvas') protected canvasEl?: ElementRef<HTMLCanvasElement>;

  protected readonly isEmpty = signal(true);
  private isDrawing = false;
  private ctx: CanvasRenderingContext2D | null = null;
  private lastX = 0;
  private lastY = 0;

  constructor() {
    super();
    afterNextRender(() => {
      this.initCanvas();
    });
  }

  private initCanvas(): void {
    if (!this.canvasEl) return;
    const canvas = this.canvasEl.nativeElement;
    this.ctx = canvas.getContext('2d');
    if (this.ctx) {
      this.ctx.strokeStyle = this.penColor();
      this.ctx.lineWidth = this.penWidth();
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';
    }
  }

  protected startDrawing(event: MouseEvent): void {
    if (this.disabled() || !this.ctx || !this.canvasEl) return;
    this.isDrawing = true;
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    this.lastX = event.clientX - rect.left;
    this.lastY = event.clientY - rect.top;
  }

  protected draw(event: MouseEvent): void {
    if (!this.isDrawing || !this.ctx || !this.canvasEl) return;
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    const currentX = event.clientX - rect.left;
    const currentY = event.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
    this.isEmpty.set(false);
    this.saveDataUrl();
  }

  protected handleTouchStart(event: TouchEvent): void {
    if (this.disabled() || !this.ctx || !this.canvasEl || event.touches.length === 0) return;
    this.isDrawing = true;
    const touch = event.touches[0];
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    this.lastX = touch.clientX - rect.left;
    this.lastY = touch.clientY - rect.top;
  }

  protected handleTouchMove(event: TouchEvent): void {
    if (!this.isDrawing || !this.ctx || !this.canvasEl || event.touches.length === 0) return;
    event.preventDefault();
    const touch = event.touches[0];
    const rect = this.canvasEl.nativeElement.getBoundingClientRect();
    const currentX = touch.clientX - rect.left;
    const currentY = touch.clientY - rect.top;

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(currentX, currentY);
    this.ctx.stroke();

    this.lastX = currentX;
    this.lastY = currentY;
    this.isEmpty.set(false);
    this.saveDataUrl();
  }

  protected stopDrawing(): void {
    this.isDrawing = false;
  }

  clear(): void {
    if (!this.canvasEl || !this.ctx) return;
    this.ctx.clearRect(0, 0, this.width(), this.height());
    this.isEmpty.set(true);
    this.value.set('');
    this.emitChange('');
    this.cleared.emit();
  }

  private saveDataUrl(): void {
    if (!this.canvasEl) return;
    const dataUrl = this.canvasEl.nativeElement.toDataURL('image/png');
    this.value.set(dataUrl);
    this.emitChange(dataUrl);
  }

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(val: unknown): void {
    if (typeof val === 'string') {
      this.value.set(val);
      if (!val) {
        this.clear();
      }
    }
  }
}
