import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';

export interface NgxsmkStep {
  label: string;
  description?: string;
  optional?: boolean;
  /** Force a completed check even if the step is ahead of the active index. */
  completed?: boolean;
  disabled?: boolean;
}

export type NgxsmkStepperOrientation = 'horizontal' | 'vertical';

type StepView = NgxsmkStep & {
  index: number;
  state: 'complete' | 'active' | 'upcoming';
  reachable: boolean;
};

/**
 * Stepper header that renders progress through a sequence of steps. Pair the
 * emitted/`[(activeIndex)]` value with your own content to swap panels.
 *
 * ```html
 * <ngxsmk-stepper [steps]="steps" [(activeIndex)]="step" linear />
 * ```
 *
 * State is derived entirely with `computed` (no effects); a roving `tabindex`
 * keeps keyboard focus within one tab stop.
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-stepper',
  template: `
    <ol class="ngxsmk-stepper__list">
      @for (step of steps_(); track step.index) {
        <li class="ngxsmk-stepper__item" [attr.data-state]="step.state">
          <button
            type="button"
            class="ngxsmk-stepper__trigger"
            [attr.tabindex]="step.index === activeIndex() ? 0 : -1"
            [attr.aria-current]="step.index === activeIndex() ? 'step' : null"
            [disabled]="!step.reachable || step.disabled"
            (click)="select(step.index)"
            (keydown)="onKeydown($event)"
          >
            <span class="ngxsmk-stepper__marker" aria-hidden="true">
              @if (step.state === 'complete') {
                <svg viewBox="0 0 16 16" width="14" height="14">
                  <path
                    d="M3 8.5l3.5 3.5L13 4.5"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              } @else {
                {{ step.index + 1 }}
              }
            </span>
            <span class="ngxsmk-stepper__text">
              <span class="ngxsmk-stepper__label">
                {{ step.label }}
                @if (step.optional) {
                  <span class="ngxsmk-stepper__optional">Optional</span>
                }
              </span>
              @if (step.description) {
                <span class="ngxsmk-stepper__description">{{ step.description }}</span>
              }
            </span>
          </button>
          @if (!$last) {
            <span class="ngxsmk-stepper__connector" aria-hidden="true"></span>
          }
        </li>
      }
    </ol>
  `,
  host: {
    class: 'ngxsmk-stepper',
    '[attr.data-orientation]': 'orientation()',
    '[attr.aria-label]': 'label()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans, sans-serif);
    }
    .ngxsmk-stepper__list {
      display: flex;
      align-items: flex-start;
      list-style: none;
      margin: 0;
      padding: 0;
    }
    :host([data-orientation='vertical']) .ngxsmk-stepper__list {
      flex-direction: column;
      align-items: stretch;
    }
    .ngxsmk-stepper__item {
      display: flex;
      align-items: center;
      flex: 1 1 auto;
      min-width: 0;
    }
    :host([data-orientation='vertical']) .ngxsmk-stepper__item {
      flex-direction: column;
      align-items: flex-start;
    }
    .ngxsmk-stepper__trigger {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      padding: var(--ngxsmk-space-2, 0.5rem);
      background: none;
      border: 0;
      border-radius: var(--ngxsmk-radius-md, 8px);
      font: inherit;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      text-align: start;
    }
    .ngxsmk-stepper__trigger:disabled {
      cursor: default;
    }
    .ngxsmk-stepper__trigger:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-stepper__marker {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      flex-shrink: 0;
      font-size: 0.8125rem;
      font-weight: 600;
      border-radius: var(--ngxsmk-radius-full, 999px);
      border: 2px solid currentColor;
      background: var(--ngxsmk-color-surface);
      transition:
        background-color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease),
        color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease),
        border-color var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease);
    }
    .ngxsmk-stepper__text {
      display: inline-flex;
      flex-direction: column;
      min-width: 0;
    }
    .ngxsmk-stepper__label {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      font-size: var(--ngxsmk-text-body-md-size, 0.9375rem);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      white-space: nowrap;
    }
    .ngxsmk-stepper__optional {
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: 400;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-stepper__description {
      font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-stepper__connector {
      flex: 1 1 auto;
      height: 2px;
      min-width: var(--ngxsmk-space-4, 1rem);
      margin: 0 var(--ngxsmk-space-1, 0.25rem);
      background: var(--ngxsmk-color-outline);
    }
    :host([data-orientation='vertical']) .ngxsmk-stepper__connector {
      width: 2px;
      min-height: var(--ngxsmk-space-4, 1rem);
      height: auto;
      margin: var(--ngxsmk-space-1, 0.25rem) 0 var(--ngxsmk-space-1, 0.25rem) 0.875rem;
    }

    .ngxsmk-stepper__item[data-state='active'] .ngxsmk-stepper__marker {
      color: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-stepper__item[data-state='complete'] .ngxsmk-stepper__marker {
      color: var(--ngxsmk-color-on-primary);
      background: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-stepper__item[data-state='complete'] .ngxsmk-stepper__connector {
      background: var(--ngxsmk-color-primary);
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-stepper__marker {
        transition: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkStepper {
  readonly steps = input<readonly NgxsmkStep[]>([]);
  readonly activeIndex = model(0);
  readonly orientation = input<NgxsmkStepperOrientation>('horizontal');
  /** In linear mode only completed steps and the next step are reachable. */
  readonly linear = input(false, { transform: booleanAttribute });
  readonly label = input('Progress');
  readonly stepChange = output<number>();

  protected readonly steps_ = computed<StepView[]>(() => {
    const active = this.activeIndex();
    const linear = this.linear();
    return this.steps().map((step, index) => {
      const state: StepView['state'] =
        step.completed || index < active ? 'complete' : index === active ? 'active' : 'upcoming';
      const reachable = !linear || index <= active || step.completed === true;
      return { ...step, index, state, reachable };
    });
  });

  protected select(index: number): void {
    const step = this.steps_()[index];
    if (!step || !step.reachable || step.disabled) return;
    if (index === this.activeIndex()) return;
    this.activeIndex.set(index);
    this.stepChange.emit(index);
  }

  /** Advance to the next enabled step; no-op past the end. */
  next(): void {
    this.move(1);
  }

  /** Return to the previous enabled step; no-op before the start. */
  previous(): void {
    this.move(-1);
  }

  private move(delta: number): void {
    const steps = this.steps_();
    let i = this.activeIndex() + delta;
    while (i >= 0 && i < steps.length && steps[i].disabled) i += delta;
    if (i < 0 || i >= steps.length) return;
    // In linear mode, advancing implicitly completes the prior steps, so the
    // target is always reachable via a single step.
    this.activeIndex.set(i);
    this.stepChange.emit(i);
  }

  protected onKeydown(event: KeyboardEvent): void {
    let delta: number;
    if (event.key === 'ArrowRight' || event.key === 'ArrowDown') delta = 1;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') delta = -1;
    else return;
    event.preventDefault();
    const steps = this.steps_();
    let i = this.activeIndex() + delta;
    while (i >= 0 && i < steps.length && !steps[i].reachable) i += delta;
    if (i >= 0 && i < steps.length && steps[i].reachable) {
      this.select(i);
    }
  }
}
