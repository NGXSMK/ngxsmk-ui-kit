import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';

@Component({
  selector: 'ngxsmk-slider',
  template: `
    <input
      type="range"
      class="ngxsmk-slider__control"
      [min]="min()"
      [max]="max()"
      [step]="step()"
      [value]="value()"
      [disabled]="disabled()"
      (input)="onInput($event)"
    />
  `,
  host: {
    class: 'ngxsmk-slider',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      padding: var(--ngxsmk-space-2) 0;
    }
    .ngxsmk-slider__control {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 0.375rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-variant);
      outline: none;
      cursor: pointer;
    }
    .ngxsmk-slider__control::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 1.125rem;
      height: 1.125rem;
      border-radius: 50%;
      background: var(--ngxsmk-color-primary);
      border: 2px solid var(--ngxsmk-color-surface);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      cursor: pointer;
      transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-slider__control::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }
    .ngxsmk-slider__control::-moz-range-thumb {
      width: 1.125rem;
      height: 1.125rem;
      border-radius: 50%;
      background: var(--ngxsmk-color-primary);
      border: 2px solid var(--ngxsmk-color-surface);
      box-shadow: 0 1px 3px rgba(0,0,0,0.2);
      cursor: pointer;
    }
    .ngxsmk-slider__control:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 2px;
    }
    :host([data-disabled]) .ngxsmk-slider__control {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSlider {
  readonly min = input(0);
  readonly max = input(100);
  readonly step = input(1);
  readonly value = model(0);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly changed = output<number>();

  protected onInput(event: Event): void {
    const val = parseFloat((event.target as HTMLInputElement).value);
    this.value.set(val);
    this.changed.emit(val);
  }
}
