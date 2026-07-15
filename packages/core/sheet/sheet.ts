import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { NgxsmkScrollLock } from '@ngxsmk/cdk';
import { NgxsmkAnimate, NgxsmkMotionState, playExit } from '@ngxsmk/core/animation';

export type NgxsmkSheetSide = 'left' | 'right' | 'bottom';

@Component({
  standalone: true,
  selector: 'ngxsmk-sheet',
  template: `
    @if (open()) {
        <div class="ngxsmk-sheet__root" [attr.data-side]="side()">
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="ngxsmk-sheet__backdrop" (click)="requestClose()"></div>
        <div
          class="ngxsmk-sheet__panel"
          [ngxsmkAnimate]="SHEET_MOTION"
          [attr.data-side]="side()"
          role="dialog"
          aria-modal="true"
          [attr.aria-label]="title()"
        >
        <div class="ngxsmk-sheet__header">
          <h2 class="ngxsmk-sheet__title">{{ title() }}</h2>
          <button
            type="button"
              class="ngxsmk-sheet__close"
              aria-label="Close"
              (click)="requestClose()"
            >
            <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
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
    host: { class: 'ngxsmk-sheet' },
    imports: [NgxsmkAnimate],
  styles: `
    :host { display: contents; }

    .ngxsmk-sheet__root {
      position: fixed;
      inset: 0;
      z-index: var(--ngxsmk-z-modal, 1400);
      display: flex;
    }

    .ngxsmk-sheet__root[data-side='left'] { justify-content: flex-start; }
    .ngxsmk-sheet__root[data-side='right'] { justify-content: flex-end; }
    .ngxsmk-sheet__root[data-side='bottom'] { align-items: flex-end; }

    .ngxsmk-sheet__backdrop {
      position: fixed;
      inset: 0;
      background: var(--ngxsmk-color-backdrop, rgb(0 0 0 / 0.5));
    }

    .ngxsmk-sheet__panel {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      box-shadow: var(--ngxsmk-shadow-xl);
      z-index: 1;
    }

    .ngxsmk-sheet__panel[data-side="left"],
    .ngxsmk-sheet__panel[data-side="right"] {
      width: min(var(--ngxsmk-sheet-width, 24rem), 100vw);
      height: 100%;
    }

    .ngxsmk-sheet__panel[data-side="bottom"] {
      width: 100%;
      max-height: var(--ngxsmk-sheet-height, 50vh);
      border-radius: var(--ngxsmk-radius-xl) var(--ngxsmk-radius-xl) 0 0;
    }

    .ngxsmk-sheet__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-6);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-sheet__title {
      margin: 0;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: var(--ngxsmk-text-headline-sm-weight);
      line-height: var(--ngxsmk-text-headline-sm-line);
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
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 1px;
    }

    .ngxsmk-sheet__body {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-6);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSheet {
  private readonly scrollLock = inject(NgxsmkScrollLock);
  private readonly hostEl = inject(ElementRef<HTMLElement>);

  readonly open = model(false);
  readonly side = input<NgxsmkSheetSide>('right');
  readonly title = input('');

  protected readonly closing = signal(false);

  protected readonly SHEET_MOTION: NgxsmkMotionState = {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 12 },
    transition: { duration: 0.22, easing: 'ease-out' },
  };

  /** Plays the exit animation, then flips `open` to false (reduced-motion safe). */
  protected requestClose(): void {
    if (this.closing()) return;
    this.closing.set(true);
    const el = this.hostEl.nativeElement.querySelector('.ngxsmk-sheet__panel') as HTMLElement | null;
    void playExit(el ?? this.hostEl.nativeElement, this.SHEET_MOTION).then(() => {
      this.closing.set(false);
      this.open.set(false);
    });
  }

  private locked = false;

  constructor() {
    effect(() => {
      if (this.open()) {
        this.setLocked(true);
      } else {
        this.setLocked(false);
      }
    });

    inject(DestroyRef).onDestroy(() => this.setLocked(false));
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
