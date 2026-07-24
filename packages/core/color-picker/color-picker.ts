import {
  ChangeDetectionStrategy,
  Component,
  forwardRef,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CvaBase } from '@ngxsmk/cdk/cva-base';
import { NGXSMK_FORM_FIELD_CONTROL, NgxsmkFormFieldControl } from '@ngxsmk/core/form-field';
import { ngxsmkUniqueId } from '@ngxsmk/core/util';

export type ColorFormat = 'hex' | 'hsl' | 'rgb';

/**
 * Signal-native interactive color picker component with hue slider, presets, and HEX input.
 *
 * ```html
 * <ngxsmk-color-picker [(value)]="selectedColor" [presets]="customSwatches" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-color-picker',
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkColorPicker),
      multi: true,
    },
    {
      provide: NGXSMK_FORM_FIELD_CONTROL,
      useExisting: forwardRef(() => NgxsmkColorPicker),
    },
  ],
  host: {
    class: 'ngxsmk-color-picker',
    '[class.ngxsmk-color-picker--disabled]': 'disabled()',
  },
  template: `
    <div class="ngxsmk-color-picker__container" role="group" [attr.aria-label]="ariaLabel()">
      <!-- Preview Swatch & Current Value Display -->
      <div class="ngxsmk-color-picker__header">
        <div
          class="ngxsmk-color-picker__swatch"
          [style.background]="value()"
          aria-hidden="true"
        ></div>
        <div class="ngxsmk-color-picker__input-wrap">
          <input
            type="text"
            class="ngxsmk-color-picker__input"
            [value]="value()"
            [disabled]="disabled()"
            aria-label="Hex color value"
            (change)="onHexInputChange($event)"
          />
        </div>
      </div>

      <!-- Hue Slider -->
      <div class="ngxsmk-color-picker__hue-wrap">
        <label class="ngxsmk-color-picker__label" [for]="id() + '-hue'">Hue</label>
        <input
          [id]="id() + '-hue'"
          type="range"
          min="0"
          max="360"
          class="ngxsmk-color-picker__hue-slider"
          [value]="hue()"
          [disabled]="disabled()"
          aria-label="Color hue slider"
          (input)="onHueChange($event)"
        />
      </div>

      <!-- Presets Grid -->
      @if (showPresets() && presets().length > 0) {
        <div class="ngxsmk-color-picker__presets" role="listbox" aria-label="Color presets">
          @for (preset of presets(); track preset) {
            <button
              type="button"
              class="ngxsmk-color-picker__preset-btn"
              [class.ngxsmk-color-picker__preset-btn--selected]="
                value().toLowerCase() === preset.toLowerCase()
              "
              [style.background]="preset"
              [disabled]="disabled()"
              role="option"
              [attr.aria-selected]="value().toLowerCase() === preset.toLowerCase()"
              [attr.aria-label]="'Color preset ' + preset"
              (click)="selectPreset(preset)"
            ></button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
    }

    .ngxsmk-color-picker__container {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3, 0.75rem);
      padding: var(--ngxsmk-space-4, 1rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-xl, 0.75rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      width: 260px;
      box-shadow: var(--ngxsmk-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
    }

    .ngxsmk-color-picker__header {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3, 0.75rem);
    }

    .ngxsmk-color-picker__swatch {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      flex-shrink: 0;
      box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    .ngxsmk-color-picker__input-wrap {
      flex: 1;
    }

    .ngxsmk-color-picker__input {
      width: 100%;
      padding: 0.375rem 0.625rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: var(--ngxsmk-color-surface, #ffffff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      text-transform: uppercase;
      outline: none;
      box-sizing: border-box;
    }

    .ngxsmk-color-picker__input:focus {
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      box-shadow: var(--ngxsmk-shadow-focus);
    }

    .ngxsmk-color-picker__hue-wrap {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }

    .ngxsmk-color-picker__label {
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-color-picker__hue-slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 0.75rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: linear-gradient(
        to right,
        #ff0000 0%,
        #ffff00 17%,
        #00ff00 33%,
        #00ffff 50%,
        #0000ff 67%,
        #ff00ff 83%,
        #ff0000 100%
      );
      outline: none;
      cursor: pointer;
    }

    .ngxsmk-color-picker__hue-slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background: #ffffff;
      border: 2px solid var(--ngxsmk-color-on-surface, #09090b);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      cursor: pointer;
    }

    .ngxsmk-color-picker__presets {
      display: grid;
      grid-template-columns: repeat(6, 1fr);
      gap: 0.375rem;
      padding-top: 0.25rem;
      border-top: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
    }

    .ngxsmk-color-picker__preset-btn {
      width: 1.625rem;
      height: 1.625rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      cursor: pointer;
      padding: 0;
      transition:
        transform var(--ngxsmk-duration-fast, 150ms) ease,
        box-shadow var(--ngxsmk-duration-fast, 150ms) ease;
    }

    .ngxsmk-color-picker__preset-btn:hover:not(:disabled) {
      transform: scale(1.15);
    }

    .ngxsmk-color-picker__preset-btn--selected {
      outline: 2px solid var(--ngxsmk-color-primary, #7c3aed);
      outline-offset: 1px;
    }

    :host(.ngxsmk-color-picker--disabled) {
      opacity: 0.5;
      pointer-events: none;
    }
  `,
})
export class NgxsmkColorPicker extends CvaBase<string> implements NgxsmkFormFieldControl {
  readonly value = model<string>('#7c3aed');
  readonly presets = input<string[]>([
    '#ef4444',
    '#f97316',
    '#f59e0b',
    '#10b981',
    '#06b6d4',
    '#3b82f6',
    '#6366f1',
    '#7c3aed',
    '#ec4899',
    '#09090b',
    '#64748b',
    '#ffffff',
  ]);
  readonly showPresets = input(true);
  readonly disabled = input(false);
  readonly ariaLabel = input('Color picker');

  readonly changed = output<string>();

  readonly id = input(ngxsmkUniqueId('ngxsmk-color-picker'));
  readonly ariaInvalid = model(false);
  readonly ariaDescribedby = model<string | null>(null);

  protected readonly hue = signal(270);

  protected inputDisabled(): boolean {
    return this.disabled();
  }

  writeValue(value: unknown): void {
    if (typeof value === 'string') {
      this.value.set(value);
    }
  }

  protected onHueChange(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    this.hue.set(val);
    const hex = this.hslToHex(val, 80, 58);
    this.updateColor(hex);
  }

  protected selectPreset(color: string): void {
    this.updateColor(color);
  }

  protected onHexInputChange(event: Event): void {
    let val = (event.target as HTMLInputElement).value.trim();
    if (!val.startsWith('#')) val = '#' + val;
    if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
      this.updateColor(val);
    }
  }

  private updateColor(hex: string): void {
    this.value.set(hex);
    this.emitChange(hex);
    this.emitTouched();
    this.changed.emit(hex);
  }

  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color)
        .toString(16)
        .padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }
}
