import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/**
 * Visual LLM context window token usage meter with cost estimation.
 *
 * ```html
 * <ngxsmk-token-counter [used]="16450" [limit]="128000" modelName="Claude 3.5 Sonnet" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-token-counter',
  template: `
    <div class="ngxsmk-token-counter__header">
      <div class="ngxsmk-token-counter__title-group">
        @if (modelName()) {
          <span class="ngxsmk-token-counter__model">{{ modelName() }}</span>
        }
        <span class="ngxsmk-token-counter__stats">
          {{ formattedUsed() }} / {{ formattedLimit() }} tokens
        </span>
      </div>

      <div class="ngxsmk-token-counter__meta">
        @if (showPercentage()) {
          <span class="ngxsmk-token-counter__pct" [style.color]="statusColor()">
            {{ percentage() }}%
          </span>
        }
        @if (showCost() && costPer1k() > 0) {
          <span class="ngxsmk-token-counter__cost"> (≈ \${{ estimatedCost() }}) </span>
        }
      </div>
    </div>

    <!-- PROGRESS METER -->
    <div class="ngxsmk-token-counter__track">
      <div
        class="ngxsmk-token-counter__bar"
        [style.width]="percentage() + '%'"
        [style.background]="statusColor()"
      ></div>
    </div>
  `,
  host: {
    class: 'ngxsmk-token-counter',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-token-counter__header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2, 0.5rem);
      margin-bottom: var(--ngxsmk-space-1, 0.25rem);
      font-size: 0.8rem;
    }

    .ngxsmk-token-counter__title-group {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-token-counter__model {
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-token-counter__stats {
      font-family: var(--ngxsmk-font-mono, monospace);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.75rem;
    }

    .ngxsmk-token-counter__meta {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: 0.75rem;
      font-weight: 600;
    }

    .ngxsmk-token-counter__cost {
      color: var(--ngxsmk-color-on-surface-variant);
      font-weight: 400;
    }

    .ngxsmk-token-counter__track {
      width: 100%;
      height: 0.375rem;
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-full, 9999px);
      overflow: hidden;
    }

    .ngxsmk-token-counter__bar {
      height: 100%;
      border-radius: inherit;
      transition:
        width 0.3s ease,
        background-color 0.3s ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTokenCounter {
  /** Number of tokens used so far. */
  readonly used = input<number>(0);

  /** Context window maximum token limit. Default: 128,000. */
  readonly limit = input<number>(128000);

  /** AI model name label e.g. 'GPT-4o' or 'Claude 3.5 Sonnet'. */
  readonly modelName = input<string>('');

  /** Estimated cost rate per 1,000 tokens in USD. Default: 0.0025. */
  readonly costPer1k = input<number>(0.0025);

  /** Show calculated cost indicator. Default: true. */
  readonly showCost = input<boolean>(true);

  /** Show percentage text label. Default: true. */
  readonly showPercentage = input<boolean>(true);

  protected readonly percentage = computed(() => {
    const l = Math.max(1, this.limit());
    const u = Math.max(0, this.used());
    return Math.min(100, Math.round((u / l) * 100));
  });

  protected readonly formattedUsed = computed(() => this.formatNumber(this.used()));
  protected readonly formattedLimit = computed(() => this.formatNumber(this.limit()));

  protected readonly estimatedCost = computed(() => {
    const cost = (this.used() / 1000) * this.costPer1k();
    if (cost < 0.001 && cost > 0) return '<0.001';
    return cost.toFixed(3);
  });

  protected readonly statusColor = computed(() => {
    const pct = this.percentage();
    if (pct >= 90) return 'var(--ngxsmk-color-error)';
    if (pct >= 75) return 'var(--ngxsmk-color-amber)';
    return 'var(--ngxsmk-color-primary)';
  });

  private formatNumber(num: number): string {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}k`;
    return num.toLocaleString();
  }
}
