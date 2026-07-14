import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgxsmkAnimate, NgxsmkMotionState } from '@ngxsmk/core/animation';

export interface NgxsmkContextMenuItem {
  label: string;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'ngxsmk-context-menu',
  template: `
    @if (visible()) {
      <div
        class="ngxsmk-context-menu__list"
        [ngxsmkAnimate]="CONTEXT_MENU_MOTION"
        [style.left.px]="x()"
        [style.top.px]="y()"
        (click)="onClick($event)"
      >
        @for (item of items(); track item.label) {
          @if (item.divider) {
            <div class="ngxsmk-context-menu__divider"></div>
          }
          <button
            type="button"
            class="ngxsmk-context-menu__item"
            [disabled]="item.disabled"
            data-action
          >
            {{ item.label }}
          </button>
        }
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-context-menu',
    '[style.display]': '"contents"',
  },
  imports: [NgxsmkAnimate],
  styles: [
    `
    .ngxsmk-context-menu__list {
      position: fixed;
      z-index: var(--ngxsmk-z-popover, 1500);
      min-width: 10rem;
      padding: var(--ngxsmk-space-1);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-context-menu__item {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-sm);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      text-align: left;
      cursor: pointer;
      white-space: nowrap;
    }

    .ngxsmk-context-menu__item:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-context-menu__item:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
    }

    .ngxsmk-context-menu__item:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .ngxsmk-context-menu__divider {
      height: 1px;
      margin: var(--ngxsmk-space-1) 0;
      background: var(--ngxsmk-color-outline);
    }
  `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkContextMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly items = input.required<NgxsmkContextMenuItem[]>();
  readonly triggerRef = input<HTMLElement>();

  protected readonly visible = signal(false);
  protected readonly x = signal(0);
  protected readonly y = signal(0);

  protected readonly CONTEXT_MENU_MOTION: NgxsmkMotionState = {
    initial: { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.14, easing: 'ease-out' },
  };

  constructor() {
    this.destroyRef.onDestroy(() => this.hide());
  }

  @HostListener('contextmenu', ['$event'])
  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.show(event.clientX, event.clientY);
  }

  show(x: number, y: number): void {
    this.x.set(x);
    this.y.set(y);
    this.visible.set(true);
  }

  hide(): void {
    this.visible.set(false);
  }

  protected onClick(event: Event): void {
    const target = (event.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
    if (!target) return;
    const idx = Array.from(
      this.host.nativeElement.querySelectorAll('[data-action]')
    ).indexOf(target);
    if (idx >= 0) {
      const item = this.items()[idx];
      if (!item.disabled) {
        item.action();
      }
    }
    this.hide();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const path = event.composedPath();
    if (!path.includes(this.host.nativeElement)) {
      this.hide();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.hide();
  }
}
