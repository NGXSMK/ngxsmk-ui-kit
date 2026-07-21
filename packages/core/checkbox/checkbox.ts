import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  forwardRef,
  input,
  model,
  output,
} from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CvaBase } from '@ngxsmk/cdk/cva-base';

/**
 * Checkbox built on a visually hidden native input, so forms integration and
 * assistive tech behavior stay native.
 *
 * ```html
 * <ngxsmk-checkbox [(checked)]="agreed">Accept terms</ngxsmk-checkbox>
 * <ngxsmk-checkbox [formControl]="ctrl">Subscribe</ngxsmk-checkbox>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-checkbox',
  template: `
    <label class="ngxsmk-checkbox__wrapper">
      <input
        class="ngxsmk-checkbox__native"
        type="checkbox"
        [checked]="checked()"
        [disabled]="isDisabled()"
        [indeterminate]="indeterminate()"
        (change)="onInteraction($event)"
        (blur)="emitTouched()"
      />
      <span class="ngxsmk-checkbox__box" aria-hidden="true">
        @if (indeterminate()) {
          <svg viewBox="0 0 16 16" width="12" height="12">
            <path d="M3.5 8h9" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        } @else {
          <svg class="ngxsmk-checkbox__check" viewBox="0 0 16 16" width="12" height="12">
            <path
              d="M3 8.5l3.5 3.5L13 4.5"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        }
      </span>
      <span class="ngxsmk-checkbox__label"><ng-content /></span>
    </label>
  `,
  host: {
    class: 'ngxsmk-checkbox',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
  },
  styles: `
    :host {
      display: inline-block;
    }

    .ngxsmk-checkbox__wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      cursor: pointer;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface);
    }

    :host([data-disabled]) .ngxsmk-checkbox__wrapper {
      cursor: not-allowed;
      opacity: var(--ngxsmk-opacity-disabled);
    }

    .ngxsmk-checkbox__native {
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

    .ngxsmk-checkbox__box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.125rem;
      height: 1.125rem;
      flex-shrink: 0;
      border: 1.5px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-sm);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-primary);
      transition:
        background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-checkbox__box svg {
      opacity: 0;
      transform: scale(0.6);
      transition:
        color,
        background-color,
        border-color,
        box-shadow,
        transform,
        opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    :host([data-checked]) .ngxsmk-checkbox__box,
    .ngxsmk-checkbox__native:indeterminate + .ngxsmk-checkbox__box {
      background: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
    }

    :host([data-checked]) .ngxsmk-checkbox__box svg,
    .ngxsmk-checkbox__native:indeterminate + .ngxsmk-checkbox__box svg {
      opacity: 1;
      transform: scale(1);
    }

    .ngxsmk-checkbox__native:focus-visible + .ngxsmk-checkbox__box {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkCheckbox),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCheckbox extends CvaBase<boolean> {
  readonly checked = model(false);
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly changed = output<boolean>();

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  protected onInteraction(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.emitChange(checked);
    this.changed.emit(checked);
  }

  writeValue(value: unknown): void {
    this.checked.set(!!value);
  }
}
