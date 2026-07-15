import {
  ChangeDetectionStrategy,
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  output,
  viewChild,
  DestroyRef,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

export type NgxsmkAlertDialogVariant = 'info' | 'destructive';

@Component({
  standalone: true,
  selector: 'ngxsmk-alert-dialog',
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <dialog
      #dialog
      class="ngxsmk-alert-dialog__native"
      (cancel)="onCancel($event)"
      (close)="open.set(false)"
      (click)="onBackdropClick($event)"
    >
      @if (open()) {
        <div class="ngxsmk-alert-dialog__card" [attr.data-variant]="variant()">
          <h2 class="ngxsmk-alert-dialog__title">{{ title() }}</h2>
          <p class="ngxsmk-alert-dialog__message">{{ message() }}</p>
          <div class="ngxsmk-alert-dialog__footer">
            <button
              type="button"
              class="ngxsmk-alert-dialog__btn ngxsmk-alert-dialog__btn--cancel"
              (click)="cancel()"
            >
              {{ cancelLabel() }}
            </button>
            <button
              type="button"
              class="ngxsmk-alert-dialog__btn ngxsmk-alert-dialog__btn--confirm"
              (click)="confirm()"
            >
              {{ confirmLabel() }}
            </button>
          </div>
        </div>
      }
    </dialog>
  `,
  host: { class: 'ngxsmk-alert-dialog' },
  styles: `
    :host {
      display: contents;
    }
    .ngxsmk-alert-dialog__native {
      width: min(24rem, calc(100vw - 2rem));
      padding: 0;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-xl);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-alert-dialog__native::backdrop {
      background: var(--ngxsmk-color-backdrop, rgb(0 0 0 / 0.5));
    }
    .ngxsmk-alert-dialog__card {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-6);
    }
    .ngxsmk-alert-dialog__title {
      margin: 0;
      font-size: 1.125rem;
      font-weight: 600;
    }
    .ngxsmk-alert-dialog__message {
      margin: 0;
      font-size: 0.875rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-alert-dialog__footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--ngxsmk-space-2);
      margin-top: var(--ngxsmk-space-2);
    }
    .ngxsmk-alert-dialog__btn {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4);
      border-radius: var(--ngxsmk-radius-md);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: 0.875rem;
      cursor: pointer;
    }
    .ngxsmk-alert-dialog__btn--confirm {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      border-color: var(--ngxsmk-color-primary);
    }
    [data-variant='destructive'] .ngxsmk-alert-dialog__btn--confirm {
      background: var(--ngxsmk-color-error);
      border-color: var(--ngxsmk-color-error);
      color: var(--ngxsmk-color-on-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAlertDialog {
  readonly open = model(false);
  readonly title = input('');
  readonly message = input('');
  readonly confirmLabel = input('Confirm');
  readonly cancelLabel = input('Cancel');
  readonly variant = input<NgxsmkAlertDialogVariant>('info');
  readonly confirmed = output<void>();
  readonly cancelled = output<void>();
  private readonly doc = inject(DOCUMENT);
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const dialog = this.dialogRef().nativeElement;
      if (this.open() && !dialog.open) {
        dialog.showModal();
        this.doc.body.style.overflow = 'hidden';
      } else if (!this.open() && dialog.open) {
        dialog.close();
        this.doc.body.style.overflow = '';
      }
    });
    inject(DestroyRef).onDestroy(() => {
      this.doc.body.style.overflow = '';
    });
  }

  confirm(): void {
    this.confirmed.emit();
    this.open.set(false);
  }
  cancel(): void {
    this.cancelled.emit();
    this.open.set(false);
  }
  protected onCancel(e: Event): void {
    e.preventDefault();
    this.cancel();
  }
  protected onBackdropClick(e: MouseEvent): void {
    if (e.target === this.dialogRef().nativeElement) this.cancel();
  }
}
