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
import { NgxsmkScrollLock } from '@ngxsmk/cdk';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

export type NgxsmkAlertDialogVariant = 'info' | 'destructive';

/**
 * Confirm / cancel modal built on the native `<dialog>` element.
 *
 * ```html
 * <ngxsmk-alert-dialog
 *   [(open)]="open"
 *   title="Delete item?"
 *   message="This cannot be undone."
 *   variant="destructive"
 *   (confirmed)="onDelete()"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-alert-dialog',
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events -->
    <dialog
      #dialog
      class="ngxsmk-alert-dialog__native"
      role="alertdialog"
      [attr.aria-labelledby]="titleId"
      [attr.aria-describedby]="messageId"
      (cancel)="onCancel($event)"
      (close)="open.set(false)"
      (click)="onBackdropClick($event)"
    >
      @if (open()) {
        <div class="ngxsmk-alert-dialog__card" [attr.data-variant]="variant()">
          <h2 class="ngxsmk-alert-dialog__title" [id]="titleId">{{ title() }}</h2>
          <p class="ngxsmk-alert-dialog__message" [id]="messageId">{{ message() }}</p>
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
      font-size: var(--ngxsmk-text-title-md-size);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }
    .ngxsmk-alert-dialog__message {
      margin: 0;
      font-size: var(--ngxsmk-text-label-lg-size);
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
      font-size: var(--ngxsmk-text-label-lg-size);
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
  private readonly scrollLock = inject(NgxsmkScrollLock);
  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  protected readonly titleId = ngxsmkUniqueId('ngxsmk-alert-title');
  protected readonly messageId = ngxsmkUniqueId('ngxsmk-alert-message');
  private locked = false;

  constructor() {
    effect(() => {
      const dialog = this.dialogRef().nativeElement;
      if (this.open() && !dialog.open) {
        dialog.showModal();
        this.setLocked(true);
      } else if (!this.open() && dialog.open) {
        dialog.close();
        this.setLocked(false);
      } else if (!this.open()) {
        this.setLocked(false);
      }
    });
    inject(DestroyRef).onDestroy(() => this.setLocked(false));
  }

  private setLocked(locked: boolean): void {
    if (locked === this.locked) return;
    this.locked = locked;
    if (locked) this.scrollLock.lock();
    else this.scrollLock.unlock();
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
