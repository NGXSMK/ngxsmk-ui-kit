import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type NgxsmkStatTrend = 'up' | 'down' | 'flat';

@Component({
  standalone: true,
  selector: 'ngxsmk-stat',
  template: `
    @if (icon()) {
      <div class="ngxsmk-stat__icon" [innerHTML]="icon()"></div>
    }
    <div class="ngxsmk-stat__body">
      <span class="ngxsmk-stat__value">{{ value() }}</span>
      @if (label()) {
        <span class="ngxsmk-stat__label">{{ label() }}</span>
      }
    </div>
    @if (trend() && trend() !== 'flat') {
      <div class="ngxsmk-stat__trend" [attr.data-trend]="trend()">
        <svg
          viewBox="0 0 16 16"
          width="14"
          height="14"
          aria-hidden="true"
          class="ngxsmk-stat__trend-icon"
        >
          @if (trend() === 'up') {
            <path d="M8 12V4M4 8l4-4 4 4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          } @else {
            <path d="M8 4v8M4 8l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          }
        </svg>
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-stat',
    '[attr.data-trend]': 'trend()',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-4);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-stat__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      flex-shrink: 0;
    }

    .ngxsmk-stat__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .ngxsmk-stat__value {
      font-size: var(--ngxsmk-text-headline-lg-size);
      font-weight: var(--ngxsmk-text-headline-lg-weight);
      line-height: var(--ngxsmk-text-headline-lg-line);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-stat__label {
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-stat__trend {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .ngxsmk-stat__trend-icon {
      color: var(--ngxsmk-color-on-surface-variant);
    }

    :host([data-trend='up']) .ngxsmk-stat__trend-icon {
      color: var(--ngxsmk-color-success);
    }

    :host([data-trend='down']) .ngxsmk-stat__trend-icon {
      color: var(--ngxsmk-color-error);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkStat {
  readonly value = input('');
  readonly label = input('');
  readonly trend = input<NgxsmkStatTrend>('flat');
  readonly icon = input('');
}
