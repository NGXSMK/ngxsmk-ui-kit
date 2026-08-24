import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { NgxsmkClickOutside } from '@ngxsmk/cdk';
import { NgxsmkAnimate, NgxsmkMotionState, playExit } from '@ngxsmk/core/animation';

export interface NgxsmkDropdownMenuItem {
  label: string;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-dropdown-menu',
  imports: [NgxsmkAnimate, NgxsmkClickOutside],
  template: `
    <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
    <div
      class="ngxsmk-dropdown-menu__trigger"
      [attr.aria-haspopup]="'menu'"
      [attr.aria-expanded]="open()"
      (click)="toggle()"
      (keydown)="onTriggerKeydown($event)"
    >
      <ng-content select="[ngxsmkDropdownTrigger]" />
    </div>
    @if (open()) {
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div
        class="ngxsmk-dropdown-menu__list"
        [attr.data-align]="align()"
        role="menu"
        [ngxsmkAnimate]="DROPDOWN_MENU_MOTION"
        (ngxsmkClickOutside)="close()"
        (keydown)="onMenuKeydown($event)"
        (click)="onClick($event)"
      >
        @for (item of items(); track item.label; let i = $index) {
          @if (item.divider) {
            <div class="ngxsmk-dropdown-menu__divider" role="separator"></div>
          }
          <button
            type="button"
            class="ngxsmk-dropdown-menu__item"
            role="menuitem"
            [tabindex]="activeIndex() === i ? 0 : -1"
            [disabled]="item.disabled"
            [attr.aria-disabled]="item.disabled ? 'true' : null"
            data-action
            (mouseenter)="activeIndex.set(i)"
          >
            {{ item.label }}
          </button>
        }
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-dropdown-menu',
    '[attr.data-open]': 'open() ? "" : null',
  },
  styles: `
    :host {
      display: inline-block;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-dropdown-menu__trigger {
      display: inline-flex;
    }

    .ngxsmk-dropdown-menu__list {
      position: absolute;
      top: calc(100% + var(--ngxsmk-space-1));
      z-index: var(--ngxsmk-z-dropdown, 1000);
      min-width: 10rem;
      padding: var(--ngxsmk-space-1);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
    }

    .ngxsmk-dropdown-menu__list[data-align='end'] {
      right: 0;
      left: auto;
    }

    .ngxsmk-dropdown-menu__list[data-align='start'] {
      left: 0;
      right: auto;
    }

    .ngxsmk-dropdown-menu__item {
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
      transition: background-color var(--ngxsmk-duration-fast);
    }

    .ngxsmk-dropdown-menu__item:hover:not(:disabled),
    .ngxsmk-dropdown-menu__item:focus-visible {
      background: var(--ngxsmk-color-surface-hover);
      outline: none;
    }

    .ngxsmk-dropdown-menu__item:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }

    .ngxsmk-dropdown-menu__divider {
      height: 1px;
      margin: var(--ngxsmk-space-1) 0;
      background: var(--ngxsmk-color-outline);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDropdownMenu {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  readonly items = input.required<NgxsmkDropdownMenuItem[]>();
  readonly align = input<'start' | 'end'>('end');
  readonly open = model(false);

  protected readonly closing = signal(false);
  protected readonly activeIndex = signal(-1);

  protected readonly DROPDOWN_MENU_MOTION: NgxsmkMotionState = {
    initial: { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.14, easing: 'ease-out' },
  };

  toggle(): void {
    if (this.open()) {
      this.close();
    } else {
      this.openMenu(0);
    }
  }

  openMenu(focusIndex = 0): void {
    this.open.set(true);
    this.activeIndex.set(focusIndex);
    setTimeout(() => {
      this.focusItem(focusIndex);
    }, 0);
  }

  /** Plays the exit animation, then flips `open` to false (reduced-motion safe). */
  close(): void {
    if (this.closing()) return;
    this.closing.set(true);
    const el = this.host.nativeElement.querySelector(
      '.ngxsmk-dropdown-menu__list',
    ) as HTMLElement | null;
    void playExit(el ?? this.host.nativeElement, this.DROPDOWN_MENU_MOTION).then(() => {
      this.closing.set(false);
      this.open.set(false);
      this.activeIndex.set(-1);
    });
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.openMenu(0);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.openMenu(this.items().length - 1);
    }
  }

  protected onMenuKeydown(event: KeyboardEvent): void {
    const enabledIndices = this.items()
      .map((item, idx) => (item.disabled ? -1 : idx))
      .filter((idx) => idx !== -1);

    if (!enabledIndices.length) return;

    const currentPos = enabledIndices.indexOf(this.activeIndex());

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextPos = (currentPos + 1) % enabledIndices.length;
      const nextIdx = enabledIndices[nextPos];
      this.activeIndex.set(nextIdx);
      this.focusItem(nextIdx);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevPos = (currentPos - 1 + enabledIndices.length) % enabledIndices.length;
      const nextIdx = enabledIndices[prevPos];
      this.activeIndex.set(nextIdx);
      this.focusItem(nextIdx);
    } else if (event.key === 'Home') {
      event.preventDefault();
      const firstIdx = enabledIndices[0];
      this.activeIndex.set(firstIdx);
      this.focusItem(firstIdx);
    } else if (event.key === 'End') {
      event.preventDefault();
      const lastIdx = enabledIndices[enabledIndices.length - 1];
      this.activeIndex.set(lastIdx);
      this.focusItem(lastIdx);
    } else if (event.key === 'Escape' || event.key === 'Tab') {
      this.close();
    }
  }

  private focusItem(index: number): void {
    const buttons = this.host.nativeElement.querySelectorAll<HTMLButtonElement>('[data-action]');
    if (buttons && buttons[index]) {
      buttons[index].focus();
    }
  }

  protected onClick(event: Event): void {
    const target = (event.target as HTMLElement).closest('[data-action]') as HTMLElement | null;
    if (!target) return;
    const idx = Array.from(this.host.nativeElement.querySelectorAll('[data-action]')).indexOf(
      target,
    );
    if (idx >= 0) {
      const item = this.items()[idx];
      if (!item.disabled) {
        item.action();
      }
    }
    this.close();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.open()) {
      this.close();
    }
  }
}
