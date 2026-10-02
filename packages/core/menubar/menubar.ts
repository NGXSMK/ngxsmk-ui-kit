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
import { NgxsmkAnimate, playExit } from '@ngxsmk/core/animation';

export interface NgxsmkMenubarItem {
  label: string;
  action?: () => void;
  disabled?: boolean;
  divider?: boolean;
  children?: NgxsmkMenubarItem[];
}

const MENU_MOTION = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
  transition: { duration: 0.12 },
};

/**
 * Horizontal application menubar with nested dropdowns.
 *
 * ```html
 * <ngxsmk-menubar [items]="menuItems" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-menubar',
  imports: [NgxsmkAnimate, NgxsmkClickOutside],
  template: `
    <ul class="ngxsmk-menubar__list" role="menubar">
      @for (item of items(); track item.label; let i = $index) {
        <li class="ngxsmk-menubar__item" role="none">
          <button
            type="button"
            class="ngxsmk-menubar__trigger"
            role="menuitem"
            [attr.aria-haspopup]="item.children?.length ? 'menu' : null"
            [attr.aria-expanded]="openIndex() === i ? 'true' : 'false'"
            [disabled]="item.disabled"
            (click)="onTrigger(i, item)"
            (keydown)="onTriggerKey($event, i, item)"
            (mouseenter)="onHover(i, item)"
          >
            {{ item.label }}
          </button>
          @if (openIndex() === i && item.children?.length) {
            <ul
              class="ngxsmk-menubar__submenu"
              role="menu"
              tabindex="-1"
              [ngxsmkAnimate]="MENU_MOTION"
              (ngxsmkClickOutside)="close()"
              (keydown)="onSubKey($event, item.children!)"
            >
              @for (child of item.children; track child.label; let ci = $index) {
                @if (child.divider) {
                  <li class="ngxsmk-menubar__divider" role="separator"></li>
                } @else {
                  <li role="none">
                    <button
                      type="button"
                      class="ngxsmk-menubar__menuitem"
                      role="menuitem"
                      [tabindex]="activeChild() === ci ? 0 : -1"
                      [disabled]="child.disabled"
                      (mouseenter)="activeChild.set(ci)"
                      (click)="activate(child)"
                    >
                      {{ child.label }}
                    </button>
                  </li>
                }
              }
            </ul>
          }
        </li>
      }
    </ul>
  `,
  host: {
    class: 'ngxsmk-menubar',
    '[attr.data-open]': 'openIndex() !== null ? "" : null',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-menubar__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--ngxsmk-space-0-5);
      margin: 0;
      padding: var(--ngxsmk-space-1);
      list-style: none;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
    }
    .ngxsmk-menubar__item {
      position: relative;
    }
    .ngxsmk-menubar__trigger,
    .ngxsmk-menubar__menuitem {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      margin: 0;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-sm);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      cursor: pointer;
    }
    .ngxsmk-menubar__trigger:hover:not(:disabled),
    .ngxsmk-menubar__menuitem:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-menubar__trigger:focus-visible,
    .ngxsmk-menubar__menuitem:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-menubar__trigger:disabled,
    .ngxsmk-menubar__menuitem:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }
    .ngxsmk-menubar__submenu {
      position: absolute;
      top: calc(100% + var(--ngxsmk-space-1));
      left: 0;
      z-index: var(--ngxsmk-z-dropdown, 1000);
      min-width: 10rem;
      margin: 0;
      padding: var(--ngxsmk-space-1);
      list-style: none;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
    }
    .ngxsmk-menubar__menuitem {
      width: 100%;
      justify-content: flex-start;
    }
    .ngxsmk-menubar__divider {
      height: 1px;
      margin: var(--ngxsmk-space-1) 0;
      background: var(--ngxsmk-color-outline);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMenubar {
  private readonly host = inject(ElementRef<HTMLElement>);

  readonly items = input<NgxsmkMenubarItem[]>([]);
  /** When true, opening one menu keeps hover-open behavior across siblings. */
  readonly hoverOpen = model(true);

  protected readonly openIndex = signal<number | null>(null);
  protected readonly activeChild = signal(0);
  protected readonly MENU_MOTION = MENU_MOTION;

  protected onTrigger(index: number, item: NgxsmkMenubarItem): void {
    if (item.disabled) return;
    if (item.children?.length) {
      this.openIndex.update((cur) => (cur === index ? null : index));
      this.activeChild.set(0);
      return;
    }
    this.activate(item);
  }

  protected onHover(index: number, item: NgxsmkMenubarItem): void {
    if (!this.hoverOpen() || this.openIndex() === null || item.disabled || !item.children?.length) {
      return;
    }
    this.openIndex.set(index);
    this.activeChild.set(0);
  }

  protected activate(item: NgxsmkMenubarItem): void {
    if (item.disabled) return;
    item.action?.();
    this.close();
  }

  protected close(): void {
    const panel = this.host.nativeElement.querySelector('.ngxsmk-menubar__submenu');
    if (panel) {
      void playExit(panel as HTMLElement, MENU_MOTION).finally(() => this.openIndex.set(null));
      return;
    }
    this.openIndex.set(null);
  }

  protected onTriggerKey(event: KeyboardEvent, index: number, item: NgxsmkMenubarItem): void {
    const len = this.items().length;
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.focusTrigger((index + 1) % len);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.focusTrigger((index - 1 + len) % len);
    } else if (event.key === 'ArrowDown' && item.children?.length) {
      event.preventDefault();
      this.openIndex.set(index);
      this.activeChild.set(0);
      queueMicrotask(() => this.focusChild(0));
    } else if (event.key === 'Escape') {
      this.close();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.onTrigger(index, item);
    }
  }

  protected onSubKey(event: KeyboardEvent, children: NgxsmkMenubarItem[]): void {
    const actionable = children
      .map((c, i) => ({ c, i }))
      .filter(({ c }) => !c.divider && !c.disabled);
    if (!actionable.length) return;
    const cur = this.activeChild();
    const pos = Math.max(
      0,
      actionable.findIndex(({ i }) => i === cur),
    );
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const next = actionable[(pos + 1) % actionable.length].i;
      this.activeChild.set(next);
      this.focusChild(next);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const next = actionable[(pos - 1 + actionable.length) % actionable.length].i;
      this.activeChild.set(next);
      this.focusChild(next);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const child = children[cur];
      if (child) this.activate(child);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEsc(): void {
    if (this.openIndex() !== null) this.close();
  }

  private focusTrigger(index: number): void {
    const buttons = this.host.nativeElement.querySelectorAll(
      '.ngxsmk-menubar__trigger',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[index]?.focus();
  }

  private focusChild(index: number): void {
    const buttons = this.host.nativeElement.querySelectorAll(
      '.ngxsmk-menubar__menuitem',
    ) as NodeListOf<HTMLButtonElement>;
    buttons[index]?.focus();
  }
}
