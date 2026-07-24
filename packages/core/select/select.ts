import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  output,
  signal,
  forwardRef,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { CvaBase } from '@ngxsmk/cdk/cva-base';

export interface NgxsmkSelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * Themed single-select dropdown. A custom trigger + popup listbox (not a native
 * `<select>`), so it themes consistently across browsers like the rest of the
 * control family and matches `ngxsmk-input`'s visual language exactly. Pairs
 * with `ngxsmk-form-field` for label, hint, and error wiring via the same
 * `id` / `ariaInvalid` / `ariaDescribedby` hooks `ngxsmk-input` exposes.
 *
 * ```html
 * <ngxsmk-select
 *   placeholder="Pick a color"
 *   [options]="colors"
 *   [(value)]="color"
 * />
 *
 * <ngxsmk-form-field label="Color" error="Required">
 *   <ngxsmk-select [options]="colors" [(value)]="color" />
 * </ngxsmk-form-field>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-select',
  imports: [CdkConnectedOverlay, CdkOverlayOrigin],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkSelect),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkSelect),
    },
  ],
  template: `
    <button
      #trigger
      cdkOverlayOrigin
      #triggerOrigin="cdkOverlayOrigin"
      type="button"
      class="ngxsmk-select__trigger"
      role="combobox"
      [attr.aria-expanded]="open()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-labelledby]="ariaLabelledby() ?? null"
      [attr.aria-controls]="open() ? listboxId() : null"
      [attr.aria-activedescendant]="open() ? activeDescendant() : null"
      [attr.aria-invalid]="ariaInvalid() ? 'true' : null"
      [attr.aria-describedby]="ariaDescribedby()"
      [disabled]="isDisabled()"
      (click)="toggle()"
      (keydown)="onTriggerKeydown($event)"
    >
      <span class="ngxsmk-select__value" [class.ngxsmk-select__value--placeholder]="!selected()">
        {{ selected()?.label ?? placeholder() }}
      </span>
      <svg
        class="ngxsmk-select__chevron"
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
    </button>

    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="triggerOrigin"
      [cdkConnectedOverlayOpen]="open()"
      [cdkConnectedOverlayMinWidth]="triggerWidth"
      [cdkConnectedOverlayHasBackdrop]="false"
      (overlayOutsideClick)="close()"
    >
      <ul
        #listbox
        class="ngxsmk-select__listbox"
        [id]="listboxId()"
        role="listbox"
        tabindex="-1"
        (keydown)="onListboxKeydown($event)"
      >
        @if (placeholder()) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
          <li
            #item
            role="option"
            [id]="id() + '-placeholder'"
            class="ngxsmk-select__option ngxsmk-select__option--placeholder"
            [class.ngxsmk-select__option--active]="activeIndex() === -1"
            [attr.aria-selected]="!value()"
            (click)="selectPlaceholder()"
          >
            {{ placeholder() }}
          </li>
        }
        @for (opt of options(); track opt.value; let i = $index) {
          <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
          <li
            #item
            role="option"
            [id]="id() + '-' + i"
            class="ngxsmk-select__option"
            [class.ngxsmk-select__option--active]="i === activeIndex()"
            [class.ngxsmk-select__option--selected]="opt.value === value()"
            [attr.aria-selected]="opt.value === value()"
            [attr.aria-disabled]="opt.disabled ?? null"
            (click)="selectAndClose(opt)"
            (mouseenter)="activeIndex.set(opt.disabled ? activeIndex() : i)"
          >
            {{ opt.label }}
          </li>
        }
        @if (options().length === 0) {
          <li class="ngxsmk-select__empty" role="presentation">{{ emptyLabel() }}</li>
        }
      </ul>
    </ng-template>
  `,
  host: {
    class: 'ngxsmk-select',
    '[attr.id]': 'id()',
    '[attr.aria-invalid]': "ariaInvalid() ? 'true' : null",
    '[attr.aria-describedby]': 'ariaDescribedby()',
    '[attr.data-disabled]': "isDisabled() ? '' : null",
  },
  styles: `
    :host {
      position: relative;
      display: block;
      width: 100%;
    }

    /* Trigger mirrors ngxsmk-input's box exactly so the two read as one family. */
    .ngxsmk-select__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2);
      width: 100%;
      box-sizing: border-box;
      height: var(--ngxsmk-control-height);
      padding: 0 var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      text-align: left;
      cursor: pointer;
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-select__trigger:hover:not(:disabled):not([aria-invalid='true']) {
      border-color: var(--ngxsmk-color-ring);
    }
    .ngxsmk-select__trigger:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }
    :host([aria-invalid='true']) .ngxsmk-select__trigger {
      border-color: var(--ngxsmk-color-error);
    }
    :host([aria-invalid='true']) .ngxsmk-select__trigger:focus-visible {
      box-shadow: var(--ngxsmk-focus-ring-error);
    }
    :host([data-disabled]) .ngxsmk-select__trigger {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }

    .ngxsmk-select__value {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .ngxsmk-select__value--placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-select__chevron {
      flex-shrink: 0;
      width: 1rem;
      height: 1rem;
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host-context([data-open]) .ngxsmk-select__chevron,
    .ngxsmk-select__trigger[aria-expanded='true'] .ngxsmk-select__chevron {
      transform: rotate(180deg);
    }

    /* Listbox */
    /* Dropdown popup matches search/combobox styling. */
    .ngxsmk-select__listbox {
      box-sizing: border-box;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-md);
      z-index: var(--ngxsmk-z-dropdown, 1000);
      max-height: 14rem;
      overflow-y: auto;
      padding: var(--ngxsmk-space-1) 0;
      margin: var(--ngxsmk-space-1) 0 0;
      list-style-type: none;
    }

    .ngxsmk-select__option {
      display: flex;
      align-items: center;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-sm);
      cursor: pointer;
      color: var(--ngxsmk-color-on-surface);
      user-select: none;
    }
    .ngxsmk-select__option--placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-select__option--active {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-select__option--selected {
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-select__option--selected.ngxsmk-select__option--active {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
    }
    .ngxsmk-select__option[aria-disabled='true'] {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }

    .ngxsmk-select__empty {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-2);
      text-align: center;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSelect extends CvaBase<string> implements NgxsmkFormFieldControl {
  readonly options = input.required<NgxsmkSelectOption[]>();
  readonly value = model<string>('');
  readonly placeholder = input('');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly emptyLabel = input('No options');

  /** DOM id; `ngxsmk-form-field` wires its label's `for` to this. */
  readonly id = input(ngxsmkUniqueId('ngxsmk-select'));

  /**
   * Explicit labelledby target. Optional — `ngxsmk-form-field` currently keys
   * off `contentChild(NgxsmkInput)` only, so a wrapped select needs this set
   * manually until form-field learns about sibling controls.
   */
  readonly ariaLabelledby = input<string | null>(null);

  /** Set by `ngxsmk-form-field` to flag validation state. */
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  readonly changed = output<string>();

  protected readonly open = signal(false);
  protected readonly activeIndex = signal(-1);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private typeaheadBuffer = '';
  private typeaheadClear: ReturnType<typeof setTimeout> | null = null;

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  protected get triggerWidth(): number {
    return this.host.nativeElement.getBoundingClientRect().width;
  }

  writeValue(val: string): void {
    this.value.set(val || '');
  }

  protected readonly listboxId = computed(() => `${this.id()}-listbox`);

  protected readonly selected = computed(
    () => this.options().find((o) => o.value === this.value()) ?? null,
  );

  protected readonly activeDescendant = computed(() =>
    this.activeIndex() === -1 ? `${this.id()}-placeholder` : `${this.id()}-${this.activeIndex()}`,
  );

  protected toggle(): void {
    if (this.isDisabled()) {
      return;
    }
    if (this.open()) {
      this.close();
    } else {
      this.openNow();
    }
  }

  protected openNow(): void {
    if (this.isDisabled()) {
      return;
    }
    const idx = this.options().findIndex((o) => o.value === this.value());
    this.activeIndex.set(idx >= 0 ? idx : this.placeholder() ? -1 : this.firstEnabled());
    this.open.set(true);
    this.host.nativeElement.setAttribute('data-open', '');
    Promise.resolve().then(() => this.scrollActiveIntoView());
  }

  protected close(): void {
    this.open.set(false);
    this.activeIndex.set(-1);
    this.host.nativeElement.removeAttribute('data-open');
    this.typeaheadBuffer = '';
    this.emitTouched();
  }

  protected selectPlaceholder(): void {
    this.value.set('');
    this.changed.emit('');
    this.emitChange('');
    this.close();
  }

  protected selectAndClose(opt: NgxsmkSelectOption): void {
    if (opt.disabled) {
      return;
    }
    this.value.set(opt.value);
    this.changed.emit(opt.value);
    this.emitChange(opt.value);
    this.close();
  }

  protected onTriggerKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp':
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        if (!this.open()) {
          this.openNow();
        } else if (event.key === 'Enter' || event.key === ' ' || event.key === 'Spacebar') {
          this.commitActive();
        } else {
          this.move(event.key === 'ArrowDown' ? 1 : -1);
        }
        break;
      case 'Escape':
        if (this.open()) {
          event.preventDefault();
          this.close();
        }
        break;
      case 'Tab':
        this.close();
        break;
      default:
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          this.typeahead(event.key);
        }
        break;
    }
  }

  protected onListboxKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.move(1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.move(-1);
        break;
      case 'Home':
        event.preventDefault();
        this.activeIndex.set(this.placeholder() ? -1 : this.firstEnabled());
        this.scrollActiveIntoView();
        break;
      case 'End':
        event.preventDefault();
        this.activeIndex.set(this.lastEnabled());
        this.scrollActiveIntoView();
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        event.preventDefault();
        this.commitActive();
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        break;
      default:
        if (event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
          this.typeahead(event.key);
        }
        break;
    }
  }

  @HostListener('window:keydown', ['$event'])
  protected interceptEsc(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.open()) {
      event.preventDefault();
      this.close();
    }
  }

  private move(delta: number): void {
    const opts = this.options();
    const hasPlaceholder = !!this.placeholder();
    if (opts.length === 0) {
      return;
    }
    let next = this.activeIndex() + delta;
    // Wrap around and skip disabled options; never land on a disabled one.
    for (let guard = 0; guard <= opts.length; guard++) {
      if (next < (hasPlaceholder ? -1 : 0)) {
        next = opts.length - 1;
      } else if (next > opts.length - 1) {
        next = hasPlaceholder ? -1 : 0;
      }
      if (next === -1 || !opts[next]?.disabled) {
        break;
      }
      next += delta;
    }
    this.activeIndex.set(next);
    this.scrollActiveIntoView();
  }

  private commitActive(): void {
    if (this.activeIndex() === -1) {
      if (this.placeholder()) {
        this.selectPlaceholder();
      } else {
        const first = this.options()[this.firstEnabled()];
        if (first) {
          this.selectAndClose(first);
        }
      }
      return;
    }
    const opt = this.options()[this.activeIndex()];
    if (opt) {
      this.selectAndClose(opt);
    }
  }

  private typeahead(ch: string): void {
    this.typeaheadBuffer += ch.toLowerCase();
    if (this.typeaheadClear) {
      clearTimeout(this.typeaheadClear);
    }
    this.typeaheadClear = setTimeout(() => (this.typeaheadBuffer = ''), 500);

    const match = this.options().findIndex(
      (o) => !o.disabled && o.label.toLowerCase().startsWith(this.typeaheadBuffer),
    );
    if (match >= 0) {
      this.activeIndex.set(match);
      if (!this.open()) {
        // Highlight-by-typing on a closed trigger selects to match native <select> feel.
        const opt = this.options()[match];
        this.value.set(opt.value);
        this.changed.emit(opt.value);
        this.emitChange(opt.value);
      }
      this.scrollActiveIntoView();
    }
  }

  private firstEnabled(): number {
    return this.options().findIndex((o) => !o.disabled);
  }

  private lastEnabled(): number {
    const opts = this.options();
    for (let i = opts.length - 1; i >= 0; i--) {
      if (!opts[i].disabled) {
        return i;
      }
    }
    return this.firstEnabled();
  }

  private scrollActiveIntoView(): void {
    requestAnimationFrame(() => {
      const items = this.host.nativeElement.querySelectorAll<HTMLElement>('.ngxsmk-select__option');
      // The placeholder item, when present, sits in the list before the options.
      const idx =
        this.activeIndex() === -1
          ? 0
          : this.placeholder()
            ? this.activeIndex() + 1
            : this.activeIndex();
      items[idx]?.scrollIntoView({ block: 'nearest' });
    });
  }
}
