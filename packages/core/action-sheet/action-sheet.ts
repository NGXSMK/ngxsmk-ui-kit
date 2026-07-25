import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  booleanAttribute,
  effect,
  inject,
  input,
  model,
  output,
  viewChild,
} from '@angular/core';
import { NgxsmkScrollLock } from '@ngxsmk/cdk/scroll-lock';

/** One choice in an action sheet. */
export interface NgxsmkActionSheetAction {
  /** Stable identifier emitted on selection. */
  id: string;
  label: string;
  /** Renders in the destructive color — for delete, discard, sign out. */
  destructive?: boolean;
  disabled?: boolean;
}

/**
 * Bottom-anchored list of choices, in the shape mobile users expect from a
 * native action sheet.
 *
 * Distinct from `ngxsmk-sheet`, which is a general side/bottom panel for
 * arbitrary content. This is specifically a short menu of mutually exclusive
 * actions, with a separated cancel affordance and a destructive style.
 *
 * ```html
 * <ngxsmk-action-sheet
 *   [(open)]="sheetOpen"
 *   title="Photo"
 *   [actions]="[
 *     { id: 'edit', label: 'Edit' },
 *     { id: 'delete', label: 'Delete', destructive: true },
 *   ]"
 *   (selected)="handle($event)"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-action-sheet',
  template: `
    @if (open()) {
      <!-- The backdrop is a redundant pointer affordance; the keyboard path is
           Escape, handled on the panel below. Making it focusable would add a
           tab stop that announces nothing and sits before the dialog. -->
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div class="ngxsmk-action-sheet__backdrop" (click)="dismiss('backdrop')"></div>

      <div
        #panel
        class="ngxsmk-action-sheet__panel"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title() || ariaLabel()"
        (keydown)="onKeydown($event)"
      >
        @if (title()) {
          <p class="ngxsmk-action-sheet__title">{{ title() }}</p>
        }

        <div class="ngxsmk-action-sheet__actions" role="group">
          @for (action of actions(); track action.id) {
            <button
              type="button"
              class="ngxsmk-action-sheet__action"
              [attr.data-destructive]="action.destructive ? '' : null"
              [disabled]="action.disabled"
              (click)="choose(action)"
            >
              {{ action.label }}
            </button>
          }
        </div>

        @if (showCancel()) {
          <button type="button" class="ngxsmk-action-sheet__cancel" (click)="dismiss('cancel')">
            {{ cancelLabel() }}
          </button>
        }
      </div>
    }
  `,
  host: { class: 'ngxsmk-action-sheet' },
  styles: `
    .ngxsmk-action-sheet__backdrop {
      position: fixed;
      inset: 0;
      background: var(--ngxsmk-color-backdrop, rgb(0 0 0 / 0.5));
      z-index: var(--ngxsmk-z-overlay, 1300);
    }
    .ngxsmk-action-sheet__panel {
      position: fixed;
      inset-inline: 0;
      inset-block-end: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-3);
      /* Clears the home indicator on devices that report an inset. */
      padding-bottom: calc(var(--ngxsmk-space-3) + var(--ngxsmk-safe-area-bottom));
      padding-left: calc(var(--ngxsmk-space-3) + var(--ngxsmk-safe-area-left));
      padding-right: calc(var(--ngxsmk-space-3) + var(--ngxsmk-safe-area-right));
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-action-sheet__title {
      margin: 0;
      padding: var(--ngxsmk-space-2);
      text-align: center;
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-action-sheet__actions {
      display: flex;
      flex-direction: column;
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
    }
    .ngxsmk-action-sheet__action,
    .ngxsmk-action-sheet__cancel {
      padding: var(--ngxsmk-space-4);
      border: 0;
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
      font-size: var(--ngxsmk-text-body-md-size);
      cursor: pointer;
    }
    .ngxsmk-action-sheet__action + .ngxsmk-action-sheet__action {
      border-top: 1px solid var(--ngxsmk-color-outline);
    }
    .ngxsmk-action-sheet__action:hover:not(:disabled),
    .ngxsmk-action-sheet__cancel:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-action-sheet__action:focus-visible,
    .ngxsmk-action-sheet__cancel:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-action-sheet__action[data-destructive] {
      color: var(--ngxsmk-color-error);
    }
    .ngxsmk-action-sheet__action:disabled {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
      cursor: not-allowed;
    }
    .ngxsmk-action-sheet__cancel {
      border-radius: var(--ngxsmk-radius-lg);
      font-weight: 600;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkActionSheet {
  readonly open = model(false);

  readonly actions = input<readonly NgxsmkActionSheetAction[]>([]);

  /** Optional heading describing what the actions apply to. */
  readonly title = input('');

  /** Used as the dialog's accessible name when there is no `title`. */
  readonly ariaLabel = input('Actions');

  readonly cancelLabel = input('Cancel');
  readonly showCancel = input(true, { transform: booleanAttribute });

  /** Emits the chosen action's `id`. */
  readonly selected = output<string>();

  /** Emits how the sheet was dismissed without a choice. */
  readonly dismissed = output<'backdrop' | 'cancel' | 'escape'>();

  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  private readonly scrollLock = inject(NgxsmkScrollLock);

  private locked = false;

  constructor() {
    effect(() => {
      const isOpen = this.open();

      // Guarded so repeated effect runs cannot unbalance the lock's reference
      // count, which would leave the page unscrollable after close.
      if (isOpen && !this.locked) {
        this.scrollLock.lock();
        this.locked = true;
      } else if (!isOpen && this.locked) {
        this.scrollLock.unlock();
        this.locked = false;
      }

      if (isOpen) {
        // Move focus into the sheet so the keyboard lands somewhere useful.
        this.panel()?.nativeElement.querySelector('button')?.focus();
      }
    });

    // A sheet destroyed while open (a route change, say) would otherwise leave
    // the page permanently scroll-locked.
    inject(DestroyRef).onDestroy(() => {
      if (this.locked) {
        this.scrollLock.unlock();
        this.locked = false;
      }
    });
  }

  protected choose(action: NgxsmkActionSheetAction): void {
    if (action.disabled) return;
    this.open.set(false);
    this.selected.emit(action.id);
  }

  protected dismiss(reason: 'backdrop' | 'cancel' | 'escape'): void {
    this.open.set(false);
    this.dismissed.emit(reason);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.dismiss('escape');
    }
  }
}
