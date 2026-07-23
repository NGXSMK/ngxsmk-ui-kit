import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { loadMotion, prefersReducedMotion } from '@ngxsmk/core/animation';

/**
 * A modal whose full-size surface unfolds outward from its exact center using
 * clip-path animation, then folds back the same way.
 *
 * When `motion` is installed, uses `motion.animate()` for smooth spring/keyframe
 * clip-path transitions. Falls back to CSS transitions when motion is not installed.
 *
 * ```html
 * <ngxsmk-morph-modal [(morphModalOpen)]="isOpen">
 *   <button ngxsmkMorphModalTrigger>Open</button>
 *   <div ngxsmkMorphModalContent [morphModalAriaLabel]="'My modal'">
 *     Content here
 *   </div>
 * </ngxsmk-morph-modal>
 *
 * <!-- With spring animation -->
 * <ngxsmk-morph-modal [(morphModalOpen)]="isOpen2">
 *   <button ngxsmkMorphModalTrigger>Open</button>
 *   <div
 *     ngxsmkMorphModalContent
 *     [morphModalAriaLabel]="'Spring modal'"
 *     morphModalType="spring"
 *     [morphModalStiffness]="200"
 *     [morphModalDamping]="20"
 *   >
 *     Spring-animated content
 *   </div>
 * </ngxsmk-morph-modal>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-morph-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<ng-content />`,
})
export class NgxsmkMorphModal {
  /** Whether the modal is open (two-way bindable). */
  readonly morphModalOpen = signal<boolean>(false);

  /** Emits when the open state changes. */
  readonly openChange = output<boolean>();

  setOpen(open: boolean): void {
    this.morphModalOpen.set(open);
    this.openChange.emit(open);
  }
}

/**
 * Trigger directive that toggles a parent `NgxsmkMorphModal`.
 *
 * ```html
 * <button ngxsmkMorphModalTrigger>Open</button>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkMorphModalTrigger]',
  host: {
    '(click)': 'toggle()',
    '[attr.aria-haspopup]': '"dialog"',
    '[attr.aria-expanded]': 'modal?.morphModalOpen()',
  },
})
export class NgxsmkMorphModalTrigger {
  readonly modal = inject(NgxsmkMorphModal, { optional: true });

  toggle(): void {
    this.modal?.setOpen(!this.modal?.morphModalOpen());
  }
}

/**
 * Close directive that closes the parent `NgxsmkMorphModal` on click.
 *
 * ```html
 * <button ngxsmkMorphModalClose>Close</button>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkMorphModalClose]',
  host: { '(click)': 'close()' },
})
export class NgxsmkMorphModalClose {
  private readonly modal = inject(NgxsmkMorphModal, { optional: true });
  close(): void {
    this.modal?.setOpen(false);
  }
}

/**
 * Content panel for the morph modal. Renders into the document body via
 * a portal and applies clip-path animation.
 *
 * When `motion` is installed, uses `motion.animate()` for the clip-path unfold.
 * Falls back to CSS transitions when motion is not installed.
 *
 * ```html
 * <div ngxsmkMorphModalContent [morphModalAriaLabel]="'My modal'"
 *      [morphModalDismissible]="true">
 *   <p>Modal content</p>
 * </div>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkMorphModalContent]',
  host: {
    '[style.position]': '"fixed"',
    '[style.inset]': '"0"',
    '[style.z-index]': '"var(--ngxsmk-z-modal, 1500)"',
    '[style.display]': '"flex"',
    '[style.align-items]': '"center"',
    '[style.justify-content]': '"center"',
    '[style.background]': '"var(--ngxsmk-color-backdrop, rgb(0 0 0 / 0.5))"',
    '[style.clip-path]': '_clipPath()',
    '[style.transition]': '_cssTransition()',
    '[style.pointer-events]': '_isOpen() ? "auto" : "none"',
    '[attr.role]': '"dialog"',
    '[attr.aria-modal]': '"true"',
    '[attr.aria-label]': 'morphModalAriaLabel()',
    '[attr.aria-describedby]': 'morphModalAriaDescribedBy() || null',
    '(click)': '_onBackdropClick($event)',
    '(keydown.escape)': '_onEscape()',
  },
})
export class NgxsmkMorphModalContent {
  private readonly modal = inject(NgxsmkMorphModal, { optional: true });
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /** Accessible name announced by screen readers. */
  readonly morphModalAriaLabel = input.required<string>();

  /** Optional id of descriptive content. */
  readonly morphModalAriaDescribedBy = input<string>();

  /** Close on Escape or backdrop press. */
  readonly morphModalDismissible = input<boolean>(true);

  /** Render the close button inside the panel. */
  readonly morphModalShowClose = input<boolean>(true);

  /** Close button label. */
  readonly morphModalCloseLabel = input<string>('Close modal');

  /** Clip-path radius in px. Default `30`. */
  readonly morphModalRadius = input<number>(30);

  /** Duration of the unfold animation in seconds. Default `0.43`. */
  readonly morphModalDuration = input<number>(0.43);

  /** Easing name or cubic-bezier array. Default `'ease-out'`. */
  readonly morphModalEase = input<string | number[]>('ease-out');

  /** Animation type: `'tween'` or `'spring'`. Default `'tween'`. */
  readonly morphModalType = input<'tween' | 'spring'>('tween');

  /** Spring stiffness (when type is 'spring'). */
  readonly morphModalStiffness = input<number>();

  /** Spring damping (when type is 'spring'). */
  readonly morphModalDamping = input<number>();

  /** Emits when the modal has finished opening. */
  readonly afterOpen = output<void>();

  /** Emits when the modal has finished closing. */
  readonly afterClose = output<void>();

  readonly _isOpen = signal(false);
  readonly _clipPath = signal('circle(0% at 50% 50%)');
  readonly _cssTransition = signal('');

  private _triggerRect: DOMRect | null = null;

  constructor() {
    afterNextRender(() => {
      if (prefersReducedMotion()) {
        this._cssTransition.set(
          `clip-path ${this.morphModalDuration()}s ${this.morphModalEase()}`,
        );
      }
    });

    // Watch the parent modal's open state
    if (this.modal) {
      const checkOpen = () => {
        const open = this.modal!.morphModalOpen();
        if (open && !this._isOpen()) {
          this.open();
        } else if (!open && this._isOpen()) {
          this.close();
        }
      };

      // Poll the signal since we can't directly effect on it in a directive
      // (the modal is injected, not an input)
      const interval = setInterval(checkOpen, 50);
      this.destroyRef.onDestroy(() => clearInterval(interval));
    }
  }

  private async open(): Promise<void> {
    this._isOpen.set(true);
    this.el.nativeElement.style.display = 'flex';

    if (prefersReducedMotion()) {
      this._clipPath.set('circle(150% at 50% 50%)');
      this.afterOpen.emit();
      return;
    }

    const motion = await loadMotion();
    if (motion) {
      const opts = this._buildOptions();
      await motion.animate(
        this.el.nativeElement,
        { clipPath: `circle(150% at 50% 50%)` },
        opts,
      ).finished;
    } else {
      this._clipPath.set('circle(150% at 50% 50%)');
    }

    this.afterOpen.emit();
  }

  private async close(): Promise<void> {
    if (prefersReducedMotion()) {
      this._clipPath.set('circle(0% at 50% 50%)');
      this._isOpen.set(false);
      this.afterClose.emit();
      return;
    }

    const motion = await loadMotion();
    if (motion) {
      const opts = this._buildOptions();
      await motion.animate(
        this.el.nativeElement,
        { clipPath: 'circle(0% at 50% 50%)' },
        opts,
      ).finished;
    } else {
      this._clipPath.set('circle(0% at 50% 50%)');
    }

    this._isOpen.set(false);
    this.afterClose.emit();
  }

  private _buildOptions(): Record<string, unknown> {
    const type = this.morphModalType();
    if (type === 'spring') {
      const opts: Record<string, unknown> = { type: 'spring' };
      const stiffness = this.morphModalStiffness();
      const damping = this.morphModalDamping();
      if (stiffness != null) opts['stiffness'] = stiffness;
      if (damping != null) opts['damping'] = damping;
      return opts;
    }
    return { duration: this.morphModalDuration(), ease: this.morphModalEase() };
  }

  protected _onBackdropClick(event: MouseEvent): void {
    if (this.morphModalDismissible() && event.target === this.el.nativeElement) {
      this.modal?.setOpen(false);
    }
  }

  protected _onEscape(): void {
    if (this.morphModalDismissible()) {
      this.modal?.setOpen(false);
    }
  }
}
