import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  input,
  model,
  output,
} from '@angular/core';

@Directive({
  standalone: true,
  selector: '[ngxsmkCheckboxListItem]',
  host: { class: 'ngxsmk-checkbox-list-item' },
})
export class NgxsmkCheckboxListItem {}

@Component({
  standalone: true,
  selector: 'ngxsmk-checkbox-list-item, [ngxsmkCheckboxListItem]',
  template: `
    <label class="ngxsmk-checkbox-list-item__wrapper">
      <input
        type="checkbox"
        class="ngxsmk-checkbox-list-item__native"
        [checked]="checked()"
        [disabled]="disabled()"
        (change)="onToggle($event)"
      />
      <span class="ngxsmk-checkbox-list-item__box" aria-hidden="true">
        <svg viewBox="0 0 16 16" width="12" height="12">
          <path
            d="M3 8.5l3.5 3.5L13 4.5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </span>
      <span class="ngxsmk-checkbox-list-item__content">
        <span class="ngxsmk-checkbox-list-item__label"><ng-content /></span>
        @if (description()) {
          <span class="ngxsmk-checkbox-list-item__description">{{ description() }}</span>
        }
      </span>
    </label>
  `,
  host: {
    class: 'ngxsmk-checkbox-list-item',
    '[attr.data-checked]': 'checked() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-checkbox-list-item__wrapper {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      cursor: pointer;
      border-radius: var(--ngxsmk-radius-base);
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-checkbox-list-item__wrapper:hover {
      background: var(--ngxsmk-color-surface-variant);
    }
    :host([data-disabled]) .ngxsmk-checkbox-list-item__wrapper {
      cursor: not-allowed;
      opacity: 0.5;
    }
    .ngxsmk-checkbox-list-item__native {
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
    .ngxsmk-checkbox-list-item__box {
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
    .ngxsmk-checkbox-list-item__box svg {
      opacity: 0;
      transform: scale(0.6);
      transition: all var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host([data-checked]) .ngxsmk-checkbox-list-item__box {
      background: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
    }
    :host([data-checked]) .ngxsmk-checkbox-list-item__box svg {
      opacity: 1;
      transform: scale(1);
    }
    .ngxsmk-checkbox-list-item__content {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-0-5);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-checkbox-list-item__label {
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-checkbox-list-item__description {
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCheckboxListItemComponent {
  readonly checked = model(false);
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly description = input('');
  readonly changed = output<boolean>();

  protected onToggle(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    this.checked.set(checked);
    this.changed.emit(checked);
  }
}
