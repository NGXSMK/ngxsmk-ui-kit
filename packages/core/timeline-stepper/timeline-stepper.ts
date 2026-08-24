import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface NgxsmkTimelineStep {
  id?: string;
  title: string;
  description?: string;
  date?: string;
  timestamp?: string;
  status: 'completed' | 'active' | 'pending';
}

export type TimelineStep = NgxsmkTimelineStep;

/**
 * Vertical milestone timeline node step tracker component.
 *
 * ```html
 * <ngxsmk-timeline-stepper [steps]="orderTimeline" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-timeline-stepper',
  template: `
    <div class="ngxsmk-timeline">
      @for (step of steps(); track step.id; let last = $last) {
        <div class="ngxsmk-timeline__item" [attr.data-status]="step.status">
          <div class="ngxsmk-timeline__left">
            <div class="ngxsmk-timeline__node">
              @if (step.status === 'completed') {
                ✓
              } @else if (step.status === 'active') {
                ●
              }
            </div>
            @if (!last) {
              <div class="ngxsmk-timeline__line"></div>
            }
          </div>

          <div class="ngxsmk-timeline__content">
            <div class="ngxsmk-timeline__header">
              <span class="ngxsmk-timeline__title">{{ step.title }}</span>
              @if (step.timestamp) {
                <span class="ngxsmk-timeline__time">{{ step.timestamp }}</span>
              }
            </div>
            @if (step.description) {
              <p class="ngxsmk-timeline__desc">{{ step.description }}</p>
            }
          </div>
        </div>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-timeline-stepper',
  },
  styles: `
    :host {
      display: block;
      width: 100%;
      font-family: var(--ngxsmk-font-sans, system-ui);
    }

    .ngxsmk-timeline {
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-timeline__item {
      display: flex;
      gap: 1rem;
      position: relative;
      padding-bottom: 1.25rem;
    }

    .ngxsmk-timeline__item:last-child {
      padding-bottom: 0;
    }

    .ngxsmk-timeline__left {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 1.5rem;
    }

    .ngxsmk-timeline__node {
      width: 1.35rem;
      height: 1.35rem;
      border-radius: 9999px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.7rem;
      font-weight: 700;
      z-index: 2;
      border: 2px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-timeline__item[data-status='completed'] .ngxsmk-timeline__node {
      background: var(--ngxsmk-color-success);
      border-color: var(--ngxsmk-color-success);
      color: #ffffff;
    }

    .ngxsmk-timeline__item[data-status='active'] .ngxsmk-timeline__node {
      background: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
      color: #ffffff;
    }

    .ngxsmk-timeline__line {
      width: 2px;
      flex: 1;
      background: var(--ngxsmk-color-outline);
      margin-top: 0.2rem;
    }

    .ngxsmk-timeline__item[data-status='completed'] .ngxsmk-timeline__line {
      background: var(--ngxsmk-color-success);
    }

    .ngxsmk-timeline__content {
      flex: 1;
      padding-top: 0.05rem;
    }

    .ngxsmk-timeline__header {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.5rem;
    }

    .ngxsmk-timeline__title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-timeline__time {
      font-size: 0.725rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-timeline__desc {
      margin: 0.2rem 0 0;
      font-size: 0.8rem;
      line-height: 1.45;
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTimelineStepper {
  /** Array of timeline step definitions. */
  readonly steps = input<NgxsmkTimelineStep[]>([]);
}
