import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
} from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-progress-circle',
  template: `
    <svg
      [attr.viewBox]="'0 0 100 100'"
      [attr.width]="circleSizePx()"
      [attr.height]="circleSizePx()"
      class="ngxsmk-progress-circle__svg"
      [class.ngxsmk-progress-circle__svg--indeterminate]="indeterminate()"
    >
      <!-- Background Circle -->
      <circle
        class="ngxsmk-progress-circle__track"
        cx="50"
        cy="50"
        [attr.r]="radius()"
        [attr.stroke-width]="strokeWidth()"
      />
      <!-- Active Segment -->
      <circle
        class="ngxsmk-progress-circle__fill"
        cx="50"
        cy="50"
        [attr.r]="radius()"
        [attr.stroke-width]="strokeWidth()"
        [attr.stroke-dasharray]="circumference()"
        [attr.stroke-dashoffset]="dashOffset()"
      />
    </svg>
    @if (showValue() && !indeterminate()) {
      <span class="ngxsmk-progress-circle__text">{{ percentage() }}%</span>
    }
  `,
  host: {
    class: 'ngxsmk-progress-circle',
    role: 'progressbar',
    '[attr.aria-valuenow]': 'indeterminate() ? null : percentage()',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      position: relative;
      font-family: var(--ngxsmk-font-sans);
    }

    .ngxsmk-progress-circle__svg {
      transform: rotate(-90deg);
    }

    .ngxsmk-progress-circle__track {
      fill: none;
      stroke: var(--ngxsmk-color-outline-variant, rgb(5 54 89 / 0.06));
    }

    .ngxsmk-progress-circle__fill {
      fill: none;
      stroke: var(--ngxsmk-color-primary);
      stroke-linecap: round;
      transition: stroke-dashoffset var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease);
    }

    :host([data-variant='primary']) .ngxsmk-progress-circle__fill {
      stroke: var(--ngxsmk-color-primary);
    }
    :host([data-variant='success']) .ngxsmk-progress-circle__fill {
      stroke: var(--ngxsmk-color-success);
    }
    :host([data-variant='warning']) .ngxsmk-progress-circle__fill {
      stroke: var(--ngxsmk-color-warning);
    }
    :host([data-variant='error']) .ngxsmk-progress-circle__fill {
      stroke: var(--ngxsmk-color-error);
    }

    .ngxsmk-progress-circle__text {
      position: absolute;
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-progress-circle__svg--indeterminate {
      animation: ngxsmk-progress-circle-rotate 1.4s linear infinite;
    }

    .ngxsmk-progress-circle__svg--indeterminate .ngxsmk-progress-circle__fill {
      animation: ngxsmk-progress-circle-dash 1.4s ease-in-out infinite;
    }

    @keyframes ngxsmk-progress-circle-rotate {
      to {
        transform: rotate(270deg);
      }
    }

    @keyframes ngxsmk-progress-circle-dash {
      0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-progress-circle__fill {
        transition: none;
      }
      .ngxsmk-progress-circle__svg--indeterminate {
        animation: none;
      }
      .ngxsmk-progress-circle__svg--indeterminate .ngxsmk-progress-circle__fill {
        animation: none;
        stroke-dasharray: 150, 200;
        stroke-dashoffset: -50;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkProgressCircle {
  readonly value = input<number>(0);
  readonly max = input<number>(100);
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly strokeWidth = input<number>(6);
  readonly variant = input<'default' | 'primary' | 'success' | 'warning' | 'error'>('default');
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly showValue = input(false, { transform: booleanAttribute });

  protected readonly radius = computed(() => 50 - this.strokeWidth() / 2);
  protected readonly circumference = computed(() => 2 * Math.PI * this.radius());
  
  protected readonly percentage = computed(() => {
    const val = this.value();
    const maxVal = this.max();
    if (maxVal <= 0) return 0;
    return Math.round(Math.max(0, Math.min(100, (val / maxVal) * 100)));
  });

  protected readonly dashOffset = computed(() => {
    if (this.indeterminate()) {
      return 0;
    }
    const pct = this.percentage() / 100;
    return this.circumference() * (1 - pct);
  });

  protected readonly circleSizePx = computed(() => {
    switch (this.size()) {
      case 'sm':
        return '40px';
      case 'lg':
        return '96px';
      default:
        return '64px';
    }
  });
}
