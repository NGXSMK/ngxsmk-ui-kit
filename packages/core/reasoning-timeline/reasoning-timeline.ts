import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface ReasoningStep {
  label: string;
  content: string;
  durationMs?: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-reasoning-timeline',
  template: `
    <div class="ngxsmk-reasoning-timeline__steps">
      @for (step of steps(); track $index) {
        <div class="ngxsmk-reasoning-timeline__step">
          <div class="ngxsmk-reasoning-timeline__dot"></div>
          <div class="ngxsmk-reasoning-timeline__body">
            <div class="ngxsmk-reasoning-timeline__label">{{ step.label }}</div>
            <div class="ngxsmk-reasoning-timeline__content">{{ step.content }}</div>
            @if (step.durationMs) {
              <div class="ngxsmk-reasoning-timeline__duration">{{ step.durationMs }}ms</div>
            }
          </div>
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-reasoning-timeline' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .ngxsmk-reasoning-timeline__step {
      display: flex;
      gap: var(--ngxsmk-space-3);
      padding-inline-start: var(--ngxsmk-space-2);
      position: relative;
    }
    .ngxsmk-reasoning-timeline__step:not(:last-child) {
      padding-bottom: var(--ngxsmk-space-3);
    }
    .ngxsmk-reasoning-timeline__dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary);
      margin-top: var(--ngxsmk-space-1-5);
      flex-shrink: 0;
    }
    .ngxsmk-reasoning-timeline__body {
      flex: 1;
    }
    .ngxsmk-reasoning-timeline__label {
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-reasoning-timeline__content {
      color: var(--ngxsmk-color-on-surface-variant);
      margin-top: var(--ngxsmk-space-1);
    }
    .ngxsmk-reasoning-timeline__duration {
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-outline);
      margin-top: var(--ngxsmk-space-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkReasoningTimeline {
  readonly steps = input.required<ReasoningStep[]>();
}
