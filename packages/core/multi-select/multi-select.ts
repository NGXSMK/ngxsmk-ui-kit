import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  forwardRef,
  inject,
  input,
  model,
  output,
  signal,
  computed,
  booleanAttribute,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { ListboxKeyboard } from '@ngxsmk/cdk/listbox-keyboard';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';

export interface NgxsmkMultiSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'ngxsmk-multi-select',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkMultiSelect),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkMultiSelect),
    },
  ],
  template: `
    <div
      #trigger
      class="ngxsmk-multi-select__trigger"
      [id]="id()"
      [class.ngxsmk-multi-select__trigger--open]="open()"
      [class.ngxsmk-multi-select__trigger--disabled]="isDisabled()"
      [attr.tabindex]="isDisabled() ? -1 : 0"
      role="combobox"
      [attr.aria-expanded]="open()"
      [attr.aria-controls]="open() ? listboxId : null"
      [attr.aria-activedescendant]="activeDescendant()"
      [attr.aria-disabled]="isDisabled() ? 'true' : null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedby()"
      (click)="toggle()"
      (keydown)="onKeydown($event)"
      (blur)="onBlur()"
    >
      <div class="ngxsmk-multi-select__tags">
        @for (s of selectedValues(); track s) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
          <span class="ngxsmk-multi-select__tag" (click)="$event.stopPropagation()">
            <span class="ngxsmk-multi-select__tag-label">{{ labelFor(s) }}</span>
            <button
              type="button"
              class="ngxsmk-multi-select__tag-remove"
              [disabled]="isDisabled()"
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
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.data-invalid]': 'ariaInvalid() ? "" : null',
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
      transition: border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out), box-shadow var(--ngxsmk-duration-fast);
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

    :host([data-invalid]) .ngxsmk-multi-select__trigger {
      border-color: var(--ngxsmk-color-error);
    }
    :host([data-invalid]) .ngxsmk-multi-select__trigger:focus-visible {
      box-shadow: var(--ngxsmk-focus-ring-error);
    }

    .ngxsmk-multi-select__trigger--disabled {
      opacity: var(--ngxsmk-button-disabled-opacity, 0.5);
      cursor: not-allowed;
      pointer-events: none;
      background: var(--ngxsmk-color-surface-variant);
    }

    .ngxsmk-multi-select__tags {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-1-5);
      flex: 1;
    }

    .ngxsmk-multi-select__tag {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-sm);
      background: var(--ngxsmk-color-primary-container, rgba(0,0,0,0.06));
      color: var(--ngxsmk-color-on-primary-container, var(--ngxsmk-color-on-surface));
      font-size: var(--ngxsmk-text-label-md-size);
      line-height: var(--ngxsmk-text-label-md-line);
    }

    .ngxsmk-multi-select__tag-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      background: none;
      color: inherit;
      cursor: pointer;
      font-size: 1.1em;
      line-height: 1;
      opacity: 0.7;
    }
    .ngxsmk-multi-select__tag-remove:hover {
      opacity: 1;
    }

    .ngxsmk-multi-select__placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
      user-select: none;
    }

    .ngxsmk-multi-select__chevron {
      width: 1rem;
      height: 1rem;
      flex-shrink: 0;
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
export class NgxsmkMultiSelect extends CvaBase<string[]> implements NgxsmkFormFieldControl {
  readonly options = input.required<NgxsmkMultiSelectOption[]>();
  readonly value = model<string[]>([]);
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly id = input(ngxsmkUniqueId('ngxsmk-multi-select'));

  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string[]>();

  protected readonly listboxId = ngxsmkUniqueId('ngxsmk-multi-select-listbox');
  protected readonly open = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  protected readonly remaining = computed(() => {
    const val = this.value() || [];
    return this.options().filter((o) => !val.includes(o.value));
  });

  protected readonly selectedValues = computed(() => {
    const val = this.value() || [];
    return val.filter((v) => this.options().some((o) => o.value === v));
  });

  protected readonly kb = new ListboxKeyboard({
    optionSelector: '.ngxsmk-multi-select__option',
    options: () => this.remaining(),
    host: this.host,
  });

  protected readonly activeIndex = this.kb.activeIndex;

  protected readonly activeDescendant = computed(() =>
    this.open() && this.activeIndex() >= 0
      ? `${this.listboxId}-${this.activeIndex()}`
      : null,
  );

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(val: unknown): void {
    this.value.set(Array.isArray(val) ? val : []);
  }

  protected onBlur(): void {
    this.emitTouched();
  }

  protected labelFor(v: string): string {
    return this.options().find((o) => o.value === v)?.label || v;
  }

  protected toggle(): void {
    if (this.isDisabled()) return;
    const next = !this.open();
    this.open.set(next);
    this.activeIndex.set(next && this.remaining().length ? 0 : -1);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;
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

  protected selectOption(opt: NgxsmkMultiSelectOption): void {
    const next = [...(this.value() || []), opt.value];
    this.value.set(next);
    this.emitChange(next);
    this.changed.emit(next);
    const count = this.remaining().length;
    this.activeIndex.set(count ? Math.min(this.activeIndex(), count - 1) : -1);
    this.scrollActiveIntoView();
  }

  protected remove(v: string): void {
    if (this.isDisabled()) return;
    const next = (this.value() || []).filter((x) => x !== v);
    this.value.set(next);
    this.emitChange(next);
    this.changed.emit(next);
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
