import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  inject,
  input,
  model,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

/**
 * Groups `ngxsmk-radio` children and holds the selected value.
 *
 * ```html
 * <ngxsmk-radio-group [(value)]="plan">
 *   <ngxsmk-radio value="free">Free</ngxsmk-radio>
 *   <ngxsmk-radio value="pro">Pro</ngxsmk-radio>
 * </ngxsmk-radio-group>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-radio-group',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-radio-group',
    role: 'radiogroup',
    '[attr.data-orientation]': 'orientation()',
  },
  styles: `
    :host {
      display: flex;
      gap: var(--ngxsmk-space-3);
    }
    :host([data-orientation='vertical']) { flex-direction: column; gap: var(--ngxsmk-space-2); }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkRadioGroup),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkRadioGroup implements ControlValueAccessor {
  readonly value = model<unknown>(null);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly orientation = input<'horizontal' | 'vertical'>('vertical');

  /** Shared native `name` so the browser treats the radios as one group. */
  readonly name = ngxsmkUniqueId('ngxsmk-radio-group');

  private readonly cvaDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.cvaDisabled());

  private onChange?: (value: unknown) => void;
  onTouched?: () => void;

  select(value: unknown): void {
    this.value.set(value);
    this.onChange?.(value);
  }

  writeValue(value: unknown): void {
    this.value.set(value);
  }
  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.cvaDisabled.set(disabled);
  }
}

/** Single option inside an `ngxsmk-radio-group`. */
@Component({
  standalone: true,
  selector: 'ngxsmk-radio',
  template: `
    <label class="ngxsmk-radio__wrapper">
      <input
        class="ngxsmk-radio__native"
        type="radio"
        [name]="group.name"
        [checked]="checked()"
        [disabled]="isDisabled()"
        (change)="group.select(value())"
        (blur)="group.onTouched?.()"
      />
      <span class="ngxsmk-radio__circle" aria-hidden="true"></span>
      <span class="ngxsmk-radio__label"><ng-content /></span>
    </label>
  `,
  host: {
    class: 'ngxsmk-radio',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
  },
  styles: `
    :host { display: inline-block; }

    .ngxsmk-radio__wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      cursor: pointer;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface);
    }

    :host([data-disabled]) .ngxsmk-radio__wrapper {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .ngxsmk-radio__native {
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      border: 0;
      overflow: hidden;
      clip-path: inset(100%);
      white-space: nowrap;
    }

    .ngxsmk-radio__circle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
      box-sizing: border-box;
      border: 1.5px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      transition: border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-radio__circle::after {
      content: '';
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary);
      transform: scale(0);
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    :host([data-checked]) .ngxsmk-radio__circle { border-color: var(--ngxsmk-color-primary); }
    :host([data-checked]) .ngxsmk-radio__circle::after { transform: scale(1); }

    .ngxsmk-radio__native:focus-visible + .ngxsmk-radio__circle {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 2px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkRadio {
  protected readonly group = inject(NgxsmkRadioGroup);

  readonly value = input.required<unknown>();
  readonly disabled = input(false, { transform: booleanAttribute });

  protected readonly checked = computed(
    () => this.group.value() === this.value(),
  );
  protected readonly isDisabled = computed(
    () => this.disabled() || this.group.isDisabled(),
  );
}
