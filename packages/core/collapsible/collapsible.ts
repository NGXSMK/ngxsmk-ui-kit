import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  input,
  model,
  untracked,
  viewChild,
} from '@angular/core';
import { loadMotion, prefersReducedMotion } from '@ngxsmk/core/animation';

@Component({
  standalone: true,
  selector: 'ngxsmk-collapsible',
  template: `
    <button
      type="button"
      class="ngxsmk-collapsible__trigger"
      [attr.aria-expanded]="open()"
      (click)="toggle()"
    >
      <span class="ngxsmk-collapsible__title">{{ title() }}</span>
      <svg
        class="ngxsmk-collapsible__chevron"
        viewBox="0 0 16 16"
        width="14"
        height="14"
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
    </button>
    <div class="ngxsmk-collapsible__region" #region>
      <div class="ngxsmk-collapsible__content" #content>
        <ng-content />
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-collapsible',
    '[attr.data-open]': 'open() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      font-family: var(--ngxsmk-font-sans);
      overflow: hidden;
    }

    .ngxsmk-collapsible__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-3);
      width: 100%;
      padding: var(--ngxsmk-space-4);
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      line-height: var(--ngxsmk-text-body-md-line);
      text-align: start;
      cursor: pointer;
    }

    .ngxsmk-collapsible__trigger:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-collapsible__trigger:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-collapsible__title {
      flex: 1;
      min-width: 0;
    }

    .ngxsmk-collapsible__chevron {
      flex-shrink: 0;
      transition: transform var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    :host([data-open]) .ngxsmk-collapsible__chevron {
      transform: rotate(180deg);
    }

    .ngxsmk-collapsible__region {
      overflow: hidden;
      transition: max-height var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    .ngxsmk-collapsible__content {
      padding: 0 var(--ngxsmk-space-4) var(--ngxsmk-space-4);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-collapsible__region,
      .ngxsmk-collapsible__chevron {
        transition: none;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCollapsible {
  private readonly destroyRef = inject(DestroyRef);

  readonly open = model(false);
  readonly title = input('');

  /** Expand/collapse animation duration in seconds. Default `0.2`. */
  readonly collapsibleDuration = input<number>(0.2);

  /** Easing name or cubic-bezier array. Default `'ease-out'`. */
  readonly collapsibleEase = input<string | number[]>('ease-out');

  /** Animation mode: `'css'` (default) or `'motion'` (motion.dev animate). */
  readonly collapsibleAnimation = input<'css' | 'motion'>('css');

  private readonly regionRef = viewChild<ElementRef<HTMLElement>>('region');

  constructor() {
    effect(() => {
      const mode = this.collapsibleAnimation();
      const open = this.open();
      if (mode !== 'motion') return;

      untracked(() => {
        void this.animateToggle(open);
      });
    });
  }

  toggle(): void {
    this.open.update((v) => !v);
  }

  private async animateToggle(open: boolean): Promise<void> {
    if (prefersReducedMotion()) return;

    const region = this.regionRef()?.nativeElement;
    if (!region) return;

    const motion = await loadMotion();
    if (!motion) return;

    const duration = this.collapsibleDuration();
    const ease = this.collapsibleEase();

    if (open) {
      region.style.maxHeight = '0px';
      const content = region.firstElementChild;
      const targetHeight = content ? `${content.scrollHeight}px` : '500px';
      await motion.animate(region, { maxHeight: targetHeight }, { duration, ease }).finished;
    } else {
      await motion.animate(region, { maxHeight: '0px' }, { duration, ease }).finished;
    }
  }
}
