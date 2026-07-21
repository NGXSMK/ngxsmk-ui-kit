import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
  booleanAttribute,
} from '@angular/core';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { ListboxKeyboard } from '@ngxsmk/cdk/listbox-keyboard';

@Component({
  selector: 'ngxsmk-multi-select',
  standalone: true,
  template: `
    <div
      #trigger
      class="ngxsmk-multi-select__trigger"
      [class.ngxsmk-multi-select__trigger--open]="open()"
      [class.ngxsmk-multi-select__trigger--disabled]="disabled()"
      [attr.tabindex]="disabled() ? -1 : 0"
      role="combobox"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="open() ? listboxId : null"
      [attr.aria-activedescendant]="activeDescendant()"
      [attr.aria-disabled]="disabled() ? 'true' : null"
      (click)="toggle()"
      (keydown)="onKeydown($event)"
    >
      <div class="ngxsmk-multi-select__tags">
        @for (s of selectedValues(); track s) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
          <span class="ngxsmk-multi-select__tag" (click)="$event.stopPropagation()">
            <span class="ngxsmk-multi-select__tag-label">{{ labelFor(s) }}</span>
            <button
              type="button"
              class="ngxsmk-multi-select__tag-remove"
              [disabled]="disabled()"
              (click)="remove(s)"
              aria-label="Remove"
            >
              &times;
            </button>
          </span>
        }
        @if (selectedValues().length === 0) {
          <span class="ngxsmk-multi-select__placeholder">
            {{ placeholder() || 'Select options...' }}
          </span>
        }
      </div>
      <svg
        class="ngxsmk-multi-select__chevron"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>

    @if (open()) {
      <ul [id]="listboxId" class="ngxsmk-multi-select__listbox" role="listbox">
        @for (opt of remaining(); track opt.value; let i = $index) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
          <li
            [id]="listboxId + '-' + i"
            role="option"
            aria-selected="false"
            class="ngxsmk-multi-select__option"
            [class.ngxsmk-multi-select__option--active]="i === activeIndex()"
            (click)="selectOption(opt)"
            (mouseenter)="activeIndex.set(i)"
          >
            {{ opt.label }}
          </li>
        }
        @if (remaining().length === 0) {
          <li class="ngxsmk-multi-select__empty">No options left</li>
        }
      </ul>
    }
  `,
  host: {
    class: 'ngxsmk-multi-select',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      position: relative;
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-multi-select__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2);
      width: 100%;
      box-sizing: border-box;
      min-height: var(--ngxsmk-control-height);
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base);
      background: var(--ngxsmk-color-surface);
      cursor: pointer;
      transition: border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-multi-select__trigger:hover:not(.ngxsmk-multi-select__trigger--disabled) {
      border-color: var(--ngxsmk-color-ring);
    }

    .ngxsmk-multi-select__trigger:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-multi-select__trigger--open {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-multi-select__trigger--disabled {
      opacity: var(--ngxsmk-button-disabled-opacity, 0.5);
      cursor: not-allowed;
      pointer-events: none;
    }

    .ngxsmk-multi-select__tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-1-5);
      flex: 1;
      align-items: center;
    }

    .ngxsmk-multi-select__placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
      user-select: none;
    }

    .ngxsmk-multi-select__tag {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      border-radius: var(--ngxsmk-radius-sm);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
    }

    .ngxsmk-multi-select__tag-remove {
      border: none;
      background: none;
      cursor: pointer;
      font-size: var(--ngxsmk-text-body-lg-size);
      line-height: 1;
      padding: 0;
      color: inherit;
      opacity: var(--ngxsmk-opacity-muted);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ngxsmk-multi-select__tag-remove:hover {
      opacity: 1;
    }

    .ngxsmk-multi-select__chevron {
      flex: 0 0 auto;
      width: 1rem;
      height: 1rem;
      color: var(--ngxsmk-color-on-surface-variant);
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-multi-select__trigger--open .ngxsmk-multi-select__chevron {
      transform: rotate(180deg);
    }

    .ngxsmk-multi-select__listbox {
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      margin-top: var(--ngxsmk-space-1);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-md);
      z-index: var(--ngxsmk-z-dropdown, 1000);
      max-height: 15rem;
      overflow-y: auto;
      padding: var(--ngxsmk-space-1) 0;
      margin-bottom: 0;
      list-style-type: none;
    }

    .ngxsmk-multi-select__option {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-multi-select__option:hover,
    .ngxsmk-multi-select__option--active {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-multi-select__empty {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      color: var(--ngxsmk-color-on-surface-variant);
      text-align: center;
      font-size: var(--ngxsmk-text-label-lg-size);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMultiSelect {
  readonly options = input.required<{ value: string; label: string }[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly changed = output<string[]>();

  protected readonly listboxId = ngxsmkUniqueId('ngxsmk-multi-select-listbox');
  protected readonly open = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly kb = new ListboxKeyboard({
    optionSelector: '.ngxsmk-multi-select__option',
    options: () => this.remaining(),
    host: this.host,
  });

  protected readonly activeIndex = this.kb.activeIndex;

  protected activeDescendant(): string | null {
    return this.open() && this.activeIndex() >= 0
      ? `${this.listboxId}-${this.activeIndex()}`
      : null;
  }

  protected selectedValues(): string[] {
    return this.value().filter((v) => this.options().some((o) => o.value === v));
  }

  protected labelFor(v: string): string {
    return this.options().find((o) => o.value === v)?.label || v;
  }

  protected remaining(): { value: string; label: string }[] {
    return this.options().filter((o) => !this.value().includes(o.value));
  }

  protected toggle(): void {
    if (this.disabled()) return;
    const next = !this.open();
    this.open.set(next);
    this.activeIndex.set(next && this.remaining().length ? 0 : -1);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    this.kb.handleKeydown(event, {
      onSelect: (i) => {
        const opt = this.remaining()[i];
        if (opt) this.selectOption(opt);
      },
      onOpen: () => {
        this.open.set(true);
        this.activeIndex.set(this.remaining().length ? 0 : -1);
      },
      onClose: () => {
        this.open.set(false);
        this.activeIndex.set(-1);
      },
      isOpen: () => this.open(),
    });
  }

  protected selectOption(opt: { value: string; label: string }): void {
    this.value.set([...this.value(), opt.value]);
    this.changed.emit(this.value());
    const count = this.remaining().length;
    this.activeIndex.set(count ? Math.min(this.activeIndex(), count - 1) : -1);
    this.scrollActiveIntoView();
  }

  protected remove(v: string): void {
    this.value.set(this.value().filter((x) => x !== v));
    this.changed.emit(this.value());
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (this.open() && !this.host.nativeElement.contains(event.target as Node)) {
      this.open.set(false);
      this.activeIndex.set(-1);
    }
  }

  private scrollActiveIntoView(): void {
    this.kb.scrollActiveIntoView();
  }
}
