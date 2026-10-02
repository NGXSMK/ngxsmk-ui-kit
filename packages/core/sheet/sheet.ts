import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  PLATFORM_ID,
  booleanAttribute,
  computed,
  effect,
  inject,
  input,
  model,
  signal,
  untracked,
} from '@angular/core';
import { NgxsmkFocusTrap, NgxsmkScrollLock } from '@ngxsmk/cdk';
import { NgxsmkAnimate, NgxsmkMotionState, playExit } from '@ngxsmk/core/animation';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

export type NgxsmkSheetSide = 'left' | 'right' | 'bottom';

/**
 * Slide-over panel (drawer) from the left, right, or bottom edge.
 * Portals to `document.body` so fixed positioning is never clipped by
 * ancestor overflow / transforms (e.g. demo showcase scroll regions).
 *
 * ```html
 * <ngxsmk-sheet [(open)]="open" side="right" title="Settings">
 *   Panel content
 * </ngxsmk-sheet>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-sheet',
  template: `
    @if (open()) {
      <div
        class="ngxsmk-sheet__root"
        tabindex="-1"
        [attr.data-side]="side()"
        (keydown)="onRootKeydown($event)"
      >
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="ngxsmk-sheet__backdrop" (click)="onBackdrop()"></div>
        <div
          class="ngxsmk-sheet__panel"
          [ngxsmkAnimate]="sheetMotion()"
          [attr.data-side]="side()"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="title() ? titleId : null"
          [attr.aria-label]="title() ? null : 'Sheet'"
          tabindex="-1"
          ngxsmkFocusTrap
          [ngxsmkFocusTrapAutoCapture]="true"
        >
          <div class="ngxsmk-sheet__header">
            @if (title()) {
              <h2 class="ngxsmk-sheet__title" [id]="titleId">{{ title() }}</h2>
            } @else {
              <span class="ngxsmk-sheet__title-spacer"></span>
            }
            <button
              type="button"
              class="ngxsmk-sheet__close"
              aria-label="Close"
              (click)="requestClose()"
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
          </div>
          <div class="ngxsmk-sheet__body">
            <ng-content />
          </div>
        </div>
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-sheet',
    '(document:keydown.escape)': 'onDocumentEscape($event)',
  },
  imports: [NgxsmkAnimate, NgxsmkFocusTrap],
  styles: `
    :host {
      display: contents;
    }

    .ngxsmk-sheet__root {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      display: flex;
      pointer-events: none;
    }

    .ngxsmk-sheet__root[data-side='left'] {
      justify-content: flex-start;
    }
    .ngxsmk-sheet__root[data-side='right'] {
      justify-content: flex-end;
    }
    .ngxsmk-sheet__root[data-side='bottom'] {
      align-items: flex-end;
    }

    .ngxsmk-sheet__backdrop {
      position: absolute;
      inset: 0;
      background: var(--ngxsmk-sheet-backdrop, var(--ngxsmk-color-backdrop));
      pointer-events: auto;
    }

    .ngxsmk-sheet__panel {
      position: relative;
      display: flex;
      flex-direction: column;
      min-height: 0;
      max-height: 100%;
      background: var(--ngxsmk-sheet-bg, var(--ngxsmk-color-surface));
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      box-shadow: var(--ngxsmk-sheet-shadow, var(--ngxsmk-shadow-xl));
      border: 1px solid var(--ngxsmk-color-outline);
      z-index: 1;
      pointer-events: auto;
      outline: none;
    }

    .ngxsmk-sheet__panel[data-side='left'],
    .ngxsmk-sheet__panel[data-side='right'] {
      width: min(var(--ngxsmk-sheet-width, 24rem), 100vw);
      height: 100%;
      max-height: 100dvh;
      border-block: none;
    }

    .ngxsmk-sheet__panel[data-side='left'] {
      border-inline-start: none;
      border-radius: 0 var(--ngxsmk-sheet-radius, var(--ngxsmk-radius-xl))
        var(--ngxsmk-sheet-radius, var(--ngxsmk-radius-xl)) 0;
    }

    .ngxsmk-sheet__panel[data-side='right'] {
      border-inline-end: none;
      border-radius: var(--ngxsmk-sheet-radius, var(--ngxsmk-radius-xl)) 0 0
        var(--ngxsmk-sheet-radius, var(--ngxsmk-radius-xl));
    }

    .ngxsmk-sheet__panel[data-side='bottom'] {
      width: 100%;
      max-height: min(var(--ngxsmk-sheet-height, 50vh), 100dvh);
      border-inline: none;
      border-bottom: none;
      border-radius: var(--ngxsmk-sheet-radius, var(--ngxsmk-radius-xl))
        var(--ngxsmk-sheet-radius, var(--ngxsmk-radius-xl)) 0 0;
    }

    .ngxsmk-sheet__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-4);
      flex-shrink: 0;
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-6);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-sheet__title {
      margin: 0;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: var(--ngxsmk-text-headline-sm-weight);
      line-height: var(--ngxsmk-text-headline-sm-line);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-sheet__title-spacer {
      flex: 1;
    }

    .ngxsmk-sheet__close {
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

    .ngxsmk-sheet__close:hover {
      background: var(--ngxsmk-color-surface-hover);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-sheet__close:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-sheet__body {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-6);
      -webkit-overflow-scrolling: touch;
    }

    .ngxsmk-sheet__panel[data-side='left'] .ngxsmk-sheet__header,
    .ngxsmk-sheet__panel[data-side='right'] .ngxsmk-sheet__header {
      padding-top: calc(
        var(--ngxsmk-space-4) + var(--ngxsmk-safe-area-top, env(safe-area-inset-top, 0px))
      );
    }

    .ngxsmk-sheet__panel[data-side='bottom'] .ngxsmk-sheet__body {
      padding-bottom: calc(
        var(--ngxsmk-space-6) + var(--ngxsmk-safe-area-bottom, env(safe-area-inset-bottom, 0px))
      );
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSheet {
  private readonly scrollLock = inject(NgxsmkScrollLock);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  readonly open = model(false);
  readonly side = input<NgxsmkSheetSide>('right');
  readonly title = input('');
  /** When false, Escape and backdrop clicks no longer close the sheet. */
  readonly dismissible = input(true, { transform: booleanAttribute });

  protected readonly closing = signal(false);
  protected readonly titleId = ngxsmkUniqueId('ngxsmk-sheet-title');

  protected readonly sheetMotion = computed((): NgxsmkMotionState => {
    const side = this.side();
    if (side === 'left') {
      return {
        initial: { opacity: 0, x: -24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -16 },
        transition: { duration: 0.22, easing: 'ease-out' },
      } satisfies NgxsmkMotionState;
    }
    if (side === 'right') {
      return {
        initial: { opacity: 0, x: 24 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: 16 },
        transition: { duration: 0.22, easing: 'ease-out' },
      } satisfies NgxsmkMotionState;
    }
    return {
      initial: { opacity: 0, y: 24 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: 16 },
      transition: { duration: 0.22, easing: 'ease-out' },
    } satisfies NgxsmkMotionState;
  });

  private locked = false;
  private portaledRoot: HTMLElement | null = null;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.setLocked(true);
        untracked(() => this.schedulePortal());
      } else {
        this.setLocked(false);
        this.portaledRoot = null;
      }
    });

    inject(DestroyRef).onDestroy(() => {
      this.setLocked(false);
      this.portaledRoot = null;
    });
  }

  protected onBackdrop(): void {
    if (this.dismissible()) {
      this.requestClose();
    }
  }

  protected onDocumentEscape(event: Event): void {
    if (!this.open() || !this.dismissible() || this.closing()) return;
    event.preventDefault();
    this.requestClose();
  }

  protected onRootKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.dismissible()) {
      event.preventDefault();
      event.stopPropagation();
      this.requestClose();
    }
  }

  /** Plays the exit animation, then flips `open` to false (reduced-motion safe). */
  protected requestClose(): void {
    if (this.closing()) return;
    this.closing.set(true);
    const el =
      (this.portaledRoot?.querySelector('.ngxsmk-sheet__panel') as HTMLElement | null) ??
      (this.hostEl.nativeElement.querySelector('.ngxsmk-sheet__panel') as HTMLElement | null);
    void playExit(el ?? this.hostEl.nativeElement, this.sheetMotion()).then(() => {
      this.closing.set(false);
      this.open.set(false);
    });
  }

  private schedulePortal(): void {
    if (!this.isBrowser) return;
    // Defer until the @if root exists in the DOM, then lift to <body>
    // so overflow/transform ancestors (demo showcase) cannot clip it.
    queueMicrotask(() => {
      const root =
        (this.hostEl.nativeElement.querySelector('.ngxsmk-sheet__root') as HTMLElement | null) ??
        this.portaledRoot;
      if (!root || !this.open()) return;
      if (root.parentElement !== this.document.body) {
        this.document.body.appendChild(root);
      }
      this.portaledRoot = root;
    });
  }

  private setLocked(locked: boolean): void {
    if (locked === this.locked) return;
    this.locked = locked;
    if (locked) {
      this.scrollLock.lock();
    } else {
      this.scrollLock.unlock();
    }
  }
}
