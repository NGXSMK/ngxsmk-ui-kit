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
 * Toggle switch for immediate on/off settings.
 *
 * ```html
 * <ngxsmk-switch [(checked)]="notifications">Email notifications</ngxsmk-switch>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-switch',
  template: `
    <label class="ngxsmk-switch__wrapper">
      <input
        class="ngxsmk-switch__native"
        type="checkbox"
        role="switch"
        [checked]="checked()"
        [disabled]="isDisabled()"
        (change)="onInteraction($event)"
        (blur)="emitTouched()"
      />
      <span class="ngxsmk-switch__track" aria-hidden="true">
        <span class="ngxsmk-switch__thumb"></span>
      </span>
      <span class="ngxsmk-switch__label"><ng-content /></span>
    </label>
  `,
  host: {
    class: 'ngxsmk-switch',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
  },
  styles: `
    :host {
      display: inline-block;
    }

    .ngxsmk-switch__wrapper {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      cursor: pointer;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface);
    }

    :host([data-disabled]) .ngxsmk-switch__wrapper {
      cursor: not-allowed;
      opacity: var(--ngxsmk-opacity-disabled);
    }

    .ngxsmk-switch__native {
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

    .ngxsmk-switch__track {
      display: inline-flex;
      align-items: center;
      width: var(--ngxsmk-switch-width, 2.25rem);
      height: var(--ngxsmk-switch-height, 1.25rem);
      flex-shrink: 0;
      padding: 2px;
      box-sizing: border-box;
      border-radius: var(--ngxsmk-switch-radius, var(--ngxsmk-radius-full));
      background: var(--ngxsmk-switch-bg, var(--ngxsmk-color-outline-strong));
      transition: background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-switch__thumb {
      width: var(--ngxsmk-switch-thumb-size, 0.875rem);
      height: var(--ngxsmk-switch-thumb-size, 0.875rem);
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-switch-thumb-bg, var(--ngxsmk-color-surface));
      box-shadow: var(--ngxsmk-shadow-sm);
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    :host([data-checked]) .ngxsmk-switch__track {
      background: var(--ngxsmk-switch-checked-bg, var(--ngxsmk-color-primary));
    }
    :host([data-checked]) .ngxsmk-switch__thumb {
      transform: translateX(
        calc(var(--ngxsmk-switch-width, 2.25rem) - var(--ngxsmk-switch-thumb-size, 0.875rem) - 4px)
      );
    }

    .ngxsmk-switch__native:focus-visible ~ .ngxsmk-switch__track {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkSwitch),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSwitch extends CvaBase<boolean> {
  readonly checked = model(false);
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
