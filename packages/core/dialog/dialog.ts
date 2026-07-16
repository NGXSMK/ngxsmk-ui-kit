import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  booleanAttribute,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { NgxsmkScrollLock } from '@ngxsmk/cdk';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { NgxsmkAnimate, NgxsmkMotionState, playExit } from '@ngxsmk/core/animation';

/** Marks content projected into the dialog's footer action row. */
@Directive({
  standalone: true,
  selector: '[ngxsmkDialogFooter]',
  host: {
    style: `
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: flex-end;
      gap: var(--ngxsmk-space-2);
      width: 100%;
    `,
  },
})
export class NgxsmkDialogFooter {}

/**
 * Modal dialog built on the native `<dialog>` element: top-layer rendering,
 * focus management, and Escape handling come from the platform.
 *
 * ```html
 * <ngxsmk-dialog [(open)]="confirmOpen" title="Delete file?">
 *   This action cannot be undone.
 *   <div ngxsmkDialogFooter>
 *     <button ngxsmk-button variant="outline" (click)="confirmOpen = false">Cancel</button>
 *     <button ngxsmk-button variant="destructive" (click)="delete()">Delete</button>
 *   </div>
 * </ngxsmk-dialog>
 * ```
 */
const DIALOG_MOTION: NgxsmkMotionState = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 8 },
  transition: { duration: 0.18, easing: 'ease-out' },
};

@Component({
  standalone: true,
  selector: 'ngxsmk-dialog',
  imports: [NgxsmkAnimate],
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <dialog
      #dialog
      class="ngxsmk-dialog__native"
      [attr.aria-labelledby]="title() ? titleId : null"
      (cancel)="onCancel($event)"
      (close)="onNativeClose()"
      (click)="onBackdropClick($event)"
    >
      @if (visible()) {
        <div class="ngxsmk-dialog__container" [ngxsmkAnimate]="enterMotion">
          @if (title() || dismissible()) {
            <div class="ngxsmk-dialog__header">
              @if (title()) {
                <h2 class="ngxsmk-dialog__title" [id]="titleId">{{ title() }}</h2>
              }
              @if (dismissible()) {
                <button
                  type="button"
                  class="ngxsmk-dialog__close"
                  aria-label="Close"
                  (click)="close()"
                >
                  <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              }
            </div>
          }
          <div class="ngxsmk-dialog__body"><ng-content /></div>
          <div class="ngxsmk-dialog__footer">
            <ng-content select="[ngxsmkDialogFooter]" />
          </div>
        </div>
      }
    </dialog>
  `,
  host: { class: 'ngxsmk-dialog' },
  styles: `
    .ngxsmk-dialog__native {
      width: min(var(--ngxsmk-dialog-width, 28rem), calc(100vw - 2rem));
      max-height: calc(100dvh - 2rem);
      overflow: auto;
      padding: 0;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-xl);
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-dialog__native::backdrop {
      background: var(--ngxsmk-color-backdrop, rgb(0 0 0 / 0.5));
    }

    .ngxsmk-dialog__container {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-6);
    }

    .ngxsmk-dialog__header {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--ngxsmk-space-4);
    }

    .ngxsmk-dialog__title {
      margin: 0;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: var(--ngxsmk-text-headline-sm-weight);
      line-height: var(--ngxsmk-text-headline-sm-line);
    }

    .ngxsmk-dialog__close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      flex-shrink: 0;
      padding: 0;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
    }
    .ngxsmk-dialog__close:hover {
      background: var(--ngxsmk-color-surface-hover);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-dialog__close:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-dialog__body {
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-dialog__footer {
      display: flex;
      justify-content: flex-end;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-dialog__footer:empty {
      display: none;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDialog {
  private readonly scrollLock = inject(NgxsmkScrollLock);

  readonly open = model(false);
  readonly title = input('');
  /** When false, Escape and backdrop clicks no longer close the dialog. */
  readonly dismissible = input(true, { transform: booleanAttribute });

  protected readonly titleId = ngxsmkUniqueId('ngxsmk-dialog-title');

  /** Mirrors `open` and stays true through the leave animation. */
  protected readonly visible = signal(false);
  protected readonly enterMotion = DIALOG_MOTION;

  private readonly dialogRef = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');
  private locked = false;

  constructor() {
    // Only `open()` and `dialogRef()` drive reactivity; the show/leave work
    // (which may perform async motion loading) runs untracked, so it can't
    // leak into the host's reactive context.
    effect(() => {
      const dialog = this.dialogRef().nativeElement;
      const open = this.open();
      untracked(() => {
        if (open && !dialog.open) {
          this.visible.set(true);
          dialog.showModal();
          this.setLocked(true);
        } else if (!open && dialog.open) {
          void playExit(dialog, DIALOG_MOTION).then(() => {
            dialog.close();
            this.visible.set(false);
          });
        }
      });
    });

    inject(DestroyRef).onDestroy(() => this.setLocked(false));
  }

  close(): void {
    this.open.set(false);
  }

  protected onCancel(event: Event): void {
    // Fired by Escape; respect non-dismissible dialogs.
    event.preventDefault();
    if (this.dismissible()) {
      this.close();
    }
  }

  protected onNativeClose(): void {
    this.setLocked(false);
    this.open.set(false);
  }

  protected onBackdropClick(event: MouseEvent): void {
    // Clicks on the backdrop target the <dialog> element itself.
    if (this.dismissible() && event.target === this.dialogRef().nativeElement) {
      this.close();
    }
  }

  private setLocked(locked: boolean): void {
    if (locked === this.locked) {
      return;
    }
    this.locked = locked;
    if (locked) {
      this.scrollLock.lock();
    } else {
      this.scrollLock.unlock();
    }
  }
}
