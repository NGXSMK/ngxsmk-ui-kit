import { ChangeDetectionStrategy, Component, model, output } from '@angular/core';

@Component({
  standalone: true,
  /* eslint-disable-next-line @angular-eslint/component-selector */
  selector: 'button[ngxsmkToggleButton]',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-toggle-button',
    '[attr.aria-pressed]': 'pressed()',
    '(click)': 'toggle()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-lg-size);
      cursor: pointer;
      transition:
        color,
        background-color,
        border-color,
        box-shadow,
        transform,
        opacity var(--ngxsmk-duration-fast);
    }
    :host([aria-pressed='true']) {
      background: var(--ngxsmk-color-primary-container);
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary-container);
    }
    :host(:hover) {
      background: var(--ngxsmk-color-surface-hover);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkToggleButton {
  readonly pressed = model(false);
  readonly toggled = output<boolean>();

  protected toggle(): void {
    this.pressed.update((v) => !v);
    this.toggled.emit(this.pressed());
  }
}
