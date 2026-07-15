import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-avatar-group-overflow',
  template: `+{{ count() }}`,
  host: { class: 'ngxsmk-avatar-group-overflow', '[attr.aria-label]': 'ariaLabel()' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.75rem;
      font-weight: 500;
      border: 2px solid var(--ngxsmk-color-surface);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAvatarGroupOverflow {
  readonly count = input.required<number>();

  protected ariaLabel(): string {
    return this.count() + ' more';
  }
}
