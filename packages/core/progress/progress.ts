import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * Progress bar. Omit `value` (or pass `null`) for indeterminate mode.
 *
 * ```html
 * <ngxsmk-progress [value]="64" />
 * <ngxsmk-progress [value]="null" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-progress',
  template: `<div class="ngxsmk-progress__bar" [style.width]="barWidth()"></div>`,
  host: {
    class: 'ngxsmk-progress',
    role: 'progressbar',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'clamped()',
    '[attr.aria-label]': 'label()',
    '[attr.data-indeterminate]': 'value() === null ? "" : null',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      height: var(--ngxsmk-progress-height, 0.5rem);
      background: var(--ngxsmk-progress-bg, var(--ngxsmk-color-surface-variant));
      border-radius: var(--ngxsmk-progress-radius, var(--ngxsmk-radius-full));
      overflow: hidden;
    }

    .ngxsmk-progress__bar {
      height: 100%;
      background: var(--ngxsmk-progress-color, var(--ngxsmk-color-primary));
      border-radius: inherit;
      transition: width var(--ngxsmk-duration-slow) var(--ngxsmk-ease-out);
    }

    :host([data-indeterminate]) .ngxsmk-progress__bar {
      width: 40%;
      animation: ngxsmk-progress-slide 1.2s var(--ngxsmk-ease-in-out, ease-in-out) infinite;
    }

    @keyframes ngxsmk-progress-slide {
      from { transform: translateX(-250%); }
      to { transform: translateX(350%); }
    }

    @media (prefers-reduced-motion: reduce) {
      :host([data-indeterminate]) .ngxsmk-progress__bar { animation-duration: 2.4s; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkProgress {
  /** 0–100, or `null` for indeterminate. */
  readonly value = input<number | null>(null);
  readonly label = input('Progress');

  protected readonly clamped = computed(() => {
    const value = this.value();
    return value === null ? null : Math.min(100, Math.max(0, value));
  });

  protected readonly barWidth = computed(() => {
    const clamped = this.clamped();
    return clamped === null ? null : `${clamped}%`;
  });
}
