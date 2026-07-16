import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-date-picker',
  template: `
    <input
      type="date"
      class="ngxsmk-date-picker__control"
      [value]="value()"
      [min]="min()"
      [max]="max()"
      [placeholder]="placeholder()"
      (input)="onInput($event)"
    />
  `,
  host: { class: 'ngxsmk-date-picker' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-date-picker__control {
      display: block;
      width: 100%;
      box-sizing: border-box;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-base);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-date-picker__control::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-date-picker__control:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDatePicker {
  readonly value = model('');
  readonly min = input('');
  readonly max = input('');
  readonly placeholder = input('');
  readonly changed = output<string>();

  protected onInput(event: Event): void {
    const val = (event.target as HTMLInputElement).value;
    this.value.set(val);
    this.changed.emit(val);
  }
}
