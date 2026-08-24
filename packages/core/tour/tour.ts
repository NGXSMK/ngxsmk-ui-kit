import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';

export interface NgxsmkTourStep {
  targetId: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

/**
 * Guided product tour spotlight overlay and onboarding step guide.
 *
 * ```html
 * <ngxsmk-tour [(active)]="isTourActive" [(currentStep)]="stepIndex" [steps]="tourSteps" (completed)="onDone()" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-tour',
  template: `
    @if (active() && currentStepData(); as step) {
      <!-- SPOTLIGHT BACKDROP OVERLAY -->
      <div
        class="ngxsmk-tour__backdrop"
        role="button"
        tabindex="0"
        (click)="onBackdropClick()"
        (keydown.enter)="onBackdropClick()"
        (keydown.space)="onBackdropClick()"
      ></div>

      <!-- HIGHLIGHT BOX AROUND TARGET -->
      @if (targetRect(); as rect) {
        <div
          class="ngxsmk-tour__spotlight"
          [style.top]="rect.top - 6 + 'px'"
          [style.left]="rect.left - 6 + 'px'"
          [style.width]="rect.width + 12 + 'px'"
          [style.height]="rect.height + 12 + 'px'"
        ></div>

        <!-- STEP GUIDANCE POPOVER -->
        <div
          class="ngxsmk-tour__popover"
          [style.top]="popoverPos().top + 'px'"
          [style.left]="popoverPos().left + 'px'"
        >
          <div class="ngxsmk-tour__popover-header">
            <span class="ngxsmk-tour__counter"
              >Step {{ currentStep() + 1 }} of {{ steps().length }}</span
            >
            <button type="button" class="ngxsmk-tour__close-btn" (click)="endTour()">✕</button>
          </div>

          <h4 class="ngxsmk-tour__title">{{ step.title }}</h4>
          <p class="ngxsmk-tour__desc">{{ step.description }}</p>

          <div class="ngxsmk-tour__footer">
            <button type="button" class="ngxsmk-tour__skip-btn" (click)="endTour()">Skip</button>

            <div class="ngxsmk-tour__nav-btns">
              @if (currentStep() > 0) {
                <button
                  type="button"
                  class="ngxsmk-tour__btn ngxsmk-tour__btn--sec"
                  (click)="prevStep()"
                >
                  Back
                </button>
              }
              <button
                type="button"
                class="ngxsmk-tour__btn ngxsmk-tour__btn--pri"
                (click)="nextStep()"
              >
                {{ currentStep() === steps().length - 1 ? 'Finish' : 'Next' }}
              </button>
            </div>
          </div>
        </div>
      }
    }
  `,
  host: {
    class: 'ngxsmk-tour',
  },
  styles: `
    :host {
      display: block;
    }

    .ngxsmk-tour__backdrop {
      position: fixed;
      inset: 0;
      z-index: 9990;
      background: rgba(9, 9, 11, 0.5);
      backdrop-filter: blur(2px);
    }

    .ngxsmk-tour__spotlight {
      position: fixed;
      z-index: 9992;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      box-shadow:
        0 0 0 9999px rgba(9, 9, 11, 0.5),
        0 0 15px rgba(124, 58, 237, 0.5);
      pointer-events: none;
      transition: all 0.25s ease-out;
      border: 2px solid var(--ngxsmk-color-primary);
    }

    .ngxsmk-tour__popover {
      position: fixed;
      z-index: 9995;
      width: 20rem;
      padding: 1rem;
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease-out;
    }

    .ngxsmk-tour__popover-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .ngxsmk-tour__counter {
      font-size: 0.7rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-tour__close-btn {
      border: none;
      background: none;
      font-size: 0.85rem;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
    }

    .ngxsmk-tour__title {
      margin: 0 0 0.25rem;
      font-size: 0.95rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-tour__desc {
      margin: 0 0 0.85rem;
      font-size: 0.825rem;
      line-height: 1.5;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-tour__footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .ngxsmk-tour__skip-btn {
      border: none;
      background: none;
      font-size: 0.775rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
    }

    .ngxsmk-tour__nav-btns {
      display: flex;
      gap: 0.4rem;
    }

    .ngxsmk-tour__btn {
      padding: 0.3rem 0.75rem;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-size: 0.775rem;
      font-weight: 600;
      cursor: pointer;
      border: none;
      transition: background-color 0.15s ease;
    }

    .ngxsmk-tour__btn--pri {
      background: var(--ngxsmk-color-primary);
      color: #ffffff;
    }

    .ngxsmk-tour__btn--sec {
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      border: 1px solid var(--ngxsmk-color-outline);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTour {
  /** Tour step definitions array. */
  readonly steps = input<NgxsmkTourStep[]>([]);

  /** Two-way signal model for tour active state. */
  readonly active = model<boolean>(false);

  /** Two-way signal model for active step index (0-indexed). */
  readonly currentStep = model<number>(0);

  /** Emits when tour completes all steps. */
  readonly completed = output<void>();

  protected readonly targetRect = signal<{
    top: number;
    left: number;
    width: number;
    height: number;
  } | null>(null);

  protected readonly currentStepData = computed<NgxsmkTourStep | null>(() => {
    const s = this.steps();
    const idx = this.currentStep();
    return s[idx] ?? null;
  });

  protected readonly popoverPos = computed(() => {
    const rect = this.targetRect();
    if (!rect) return { top: 100, left: 100 };
    const step = this.currentStepData();
    const pos = step?.position || 'bottom';

    if (pos === 'top') {
      return { top: Math.max(10, rect.top - 180), left: Math.max(10, rect.left) };
    }
    return { top: rect.top + rect.height + 16, left: Math.max(10, rect.left) };
  });

  constructor() {
    effect(() => {
      if (this.active() && this.currentStepData()) {
        this.updateTargetRect();
      }
    });
  }

  protected nextStep(): void {
    const max = this.steps().length - 1;
    if (this.currentStep() < max) {
      this.currentStep.update((i) => i + 1);
    } else {
      this.endTour();
      this.completed.emit();
    }
  }

  protected prevStep(): void {
    if (this.currentStep() > 0) {
      this.currentStep.update((i) => i - 1);
    }
  }

  protected endTour(): void {
    this.active.set(false);
  }

  protected onBackdropClick(): void {
    this.endTour();
  }

  private updateTargetRect(): void {
    const step = this.currentStepData();
    if (!step || typeof document === 'undefined') return;

    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        this.targetRect.set({ top: r.top, left: r.left, width: r.width, height: r.height });
      }, 200);
    }
  }
}
