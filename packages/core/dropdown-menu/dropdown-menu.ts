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
import { NgxsmkAnimate, NgxsmkMotionState, playExit } from '@ngxsmk/core/animation';

export interface NgxsmkDropdownMenuItem {
  label: string;
  action: () => void;
  divider?: boolean;
  disabled?: boolean;
}

@Component({
  selector: 'ngxsmk-dropdown-menu',
  template: `
    <div class="ngxsmk-dropdown-menu__trigger" (click)="toggle()">
      <ng-content select="[ngxsmkDropdownTrigger]" />
    </div>
    @if (open()) {
      <div class="ngxsmk-dropdown-menu__list" [ngxsmkAnimate]="DROPDOWN_MENU_MOTION" (click)="onClick($event)">
        @for (item of items(); track item.label) {
          @if (item.divider) {
            <div class="ngxsmk-dropdown-menu__divider"></div>
          }
          <button
            type="button"
            class="ngxsmk-dropdown-menu__item"
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
    class: 'ngxsmk-dropdown-menu',
  },
  imports: [NgxsmkAnimate],
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
      right: 0;
      z-index: var(--ngxsmk-z-dropdown, 1000);
      min-width: 10rem;
      padding: var(--ngxsmk-space-1);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
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
    }

    .ngxsmk-dropdown-menu__item:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-dropdown-menu__item:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
    }

    .ngxsmk-dropdown-menu__item:disabled {
      opacity: 0.4;
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
  readonly open = model(false);

  protected readonly closing = signal(false);

  /** Plays the exit animation, then flips `open` to false (reduced-motion safe). */
  protected close(): void {
    if (this.closing()) return;
    this.closing.set(true);
    const el = this.host.nativeElement.querySelector('.ngxsmk-dropdown-menu__list') as HTMLElement | null;
    void playExit(el ?? this.host.nativeElement, this.DROPDOWN_MENU_MOTION).then(() => {
      this.closing.set(false);
      this.open.set(false);
    });
  }

  protected readonly DROPDOWN_MENU_MOTION: NgxsmkMotionState = {
    initial: { opacity: 0, y: -6 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -6 },
    transition: { duration: 0.14, easing: 'ease-out' },
  };

  toggle(): void {
    this.open.update((v) => !v);
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
    this.close();
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.close();
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.close();
  }
}
