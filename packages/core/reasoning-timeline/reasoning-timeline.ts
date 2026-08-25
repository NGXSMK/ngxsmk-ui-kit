import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

export type NgxsmkReasoningStepStatus = 'pending' | 'running' | 'completed' | 'error';

export interface NgxsmkReasoningStep {
  id?: string;
  label: string;
  content?: string;
  status?: NgxsmkReasoningStepStatus;
  durationMs?: number;
  expanded?: boolean;
}

export type ReasoningStep = NgxsmkReasoningStep;

@Component({
  standalone: true,
  selector: 'ngxsmk-reasoning-timeline',
  template: `
    <div class="ngxsmk-reasoning-timeline__steps" role="list">
      @for (step of steps(); track step.id ?? step.label; let i = $index) {
        <div
          class="ngxsmk-reasoning-timeline__step"
          role="listitem"
          [attr.data-status]="step.status || 'completed'"
        >
          <div class="ngxsmk-reasoning-timeline__line"></div>
          <div
            class="ngxsmk-reasoning-timeline__dot"
            [class.ngxsmk-reasoning-timeline__dot--running]="step.status === 'running'"
            [class.ngxsmk-reasoning-timeline__dot--error]="step.status === 'error'"
          >
            @if (step.status === 'completed') {
              <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                <path
                  d="M13.78 4.22a.75.75 0 0 1 0 1.06l-7.25 7.25a.75.75 0 0 1-1.06 0L2.22 9.28a.751.751 0 0 1 .018-1.042.751.751 0 0 1 1.042-.018L6 10.94l6.72-6.72a.75.75 0 0 1 1.06 0Z"
                />
              </svg>
            } @else if (step.status === 'error') {
              <svg viewBox="0 0 16 16" width="10" height="10" fill="currentColor">
                <path
                  d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.749.749 0 0 1 1.275.326.749.749 0 0 1-.215.734L9.06 8l3.22 3.22a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L8 9.06l-3.22 3.22a.751.751 0 0 1-1.042-.018.751.751 0 0 1-.018-1.042L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06Z"
                />
              </svg>
            }
          </div>
          <div class="ngxsmk-reasoning-timeline__body">
            <button
              type="button"
              class="ngxsmk-reasoning-timeline__header-btn"
              [disabled]="!step.content"
              [attr.aria-expanded]="isExpanded(i, step)"
              (click)="toggleStep(i)"
            >
              <span class="ngxsmk-reasoning-timeline__label">{{ step.label }}</span>
              @if (step.durationMs) {
                <span class="ngxsmk-reasoning-timeline__duration">{{ step.durationMs }}ms</span>
              }
              @if (step.content) {
                <svg
                  class="ngxsmk-reasoning-timeline__chevron"
                  [class.ngxsmk-reasoning-timeline__chevron--open]="isExpanded(i, step)"
                  viewBox="0 0 16 16"
                  width="12"
                  height="12"
                  aria-hidden="true"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
            </button>
            @if (step.content && isExpanded(i, step)) {
              <div class="ngxsmk-reasoning-timeline__content">
                {{ step.content }}
              </div>
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
    .ngxsmk-reasoning-timeline__steps {
      display: flex;
      flex-direction: column;
      position: relative;
    }
    .ngxsmk-reasoning-timeline__step {
      display: flex;
      gap: var(--ngxsmk-space-3);
      position: relative;
      padding-bottom: var(--ngxsmk-space-3);
    }
    .ngxsmk-reasoning-timeline__step:last-child {
      padding-bottom: 0;
    }
    .ngxsmk-reasoning-timeline__line {
      position: absolute;
      top: 1.25rem;
      bottom: 0;
      left: 0.5rem;
      width: 2px;
      background: var(--ngxsmk-color-outline);
      transform: translateX(-50%);
    }
    .ngxsmk-reasoning-timeline__step:last-child .ngxsmk-reasoning-timeline__line {
      display: none;
    }
    .ngxsmk-reasoning-timeline__dot {
      width: 1rem;
      height: 1rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      z-index: 1;
      margin-top: 0.125rem;
    }
    .ngxsmk-reasoning-timeline__step[data-status='completed'] .ngxsmk-reasoning-timeline__dot {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
    }
    .ngxsmk-reasoning-timeline__dot--running {
      background: var(--ngxsmk-color-primary) !important;
      animation: ngxsmk-pulse-scale 1.4s infinite ease-in-out;
    }
    .ngxsmk-reasoning-timeline__dot--error {
      background: var(--ngxsmk-color-error) !important;
      color: var(--ngxsmk-color-on-error) !important;
    }

    @keyframes ngxsmk-pulse-scale {
      0%,
      100% {
        transform: scale(0.9);
        opacity: 0.7;
      }
      50% {
        transform: scale(1.15);
        opacity: 1;
        box-shadow: 0 0 0 4px var(--ngxsmk-color-primary-container);
      }
    }

    .ngxsmk-reasoning-timeline__body {
      flex: 1;
      min-width: 0;
    }
    .ngxsmk-reasoning-timeline__header-btn {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      width: 100%;
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      color: var(--ngxsmk-color-on-surface);
      text-align: left;
      cursor: pointer;
    }
    .ngxsmk-reasoning-timeline__header-btn:disabled {
      cursor: default;
    }
    .ngxsmk-reasoning-timeline__label {
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      flex: 1;
    }
    .ngxsmk-reasoning-timeline__duration {
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-reasoning-timeline__chevron {
      color: var(--ngxsmk-color-on-surface-variant);
      transition: transform var(--ngxsmk-duration-fast);
    }
    .ngxsmk-reasoning-timeline__chevron--open {
      transform: rotate(180deg);
    }
    .ngxsmk-reasoning-timeline__content {
      color: var(--ngxsmk-color-on-surface-variant);
      margin-top: var(--ngxsmk-space-1-5);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-md);
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: var(--ngxsmk-text-body-xs-size);
      white-space: pre-wrap;
      word-break: break-word;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkReasoningTimeline {
  readonly steps = input.required<NgxsmkReasoningStep[]>();

  private readonly expandedOverrides = signal<Record<number, boolean>>({});

  protected isExpanded(index: number, step: NgxsmkReasoningStep): boolean {
    const override = this.expandedOverrides()[index];
    return override !== undefined ? override : (step.expanded ?? step.status === 'running');
  }

  protected toggleStep(index: number): void {
    const current = this.isExpanded(index, this.steps()[index]);
    this.expandedOverrides.update((map) => ({
      ...map,
      [index]: !current,
    }));
  }
}
