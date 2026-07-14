import {
  ChangeDetectionStrategy,
  Component,
  Injectable,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { NgxsmkLiveAnnouncer } from '@ngxsmk/cdk';

export type NgxsmkToastVariant = 'default' | 'success' | 'error' | 'warning' | 'info';

export interface NgxsmkToastOptions {
  title: string;
  description?: string;
  variant?: NgxsmkToastVariant;
  /** Auto-dismiss delay in ms; 0 keeps the toast until dismissed. */
  duration?: number;
}

export interface NgxsmkActiveToast extends Required<Omit<NgxsmkToastOptions, 'description'>> {
  id: number;
  description: string;
}

const DEFAULT_DURATION_MS = 5000;

const prefersReducedMotion = (): boolean =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;

/**
 * Toast state and API. Render `<ngxsmk-toaster />` once near the app root,
 * then call `show`/`success`/`error` from anywhere.
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkToast {
  private readonly announcer = inject(NgxsmkLiveAnnouncer);
  private readonly items = signal<NgxsmkActiveToast[]>([]);
  private readonly leaving = signal<ReadonlySet<number>>(new Set());
  private readonly timers = new Map<number, ReturnType<typeof setTimeout>>();
  private nextId = 0;

  isLeaving(id: number): boolean {
    return this.leaving().has(id);
  }

  readonly toasts = this.items.asReadonly();

  show(options: NgxsmkToastOptions | string): number {
    const opts = typeof options === 'string' ? { title: options } : options;
    const toast: NgxsmkActiveToast = {
      id: this.nextId++,
      title: opts.title,
      description: opts.description ?? '',
      variant: opts.variant ?? 'default',
      duration: opts.duration ?? DEFAULT_DURATION_MS,
    };

    this.items.update((list) => [...list, toast]);
    this.announcer.announce(
      [toast.title, toast.description].filter(Boolean).join('. '),
      toast.variant === 'error' ? 'assertive' : 'polite',
    );

    if (toast.duration > 0) {
      this.timers.set(
        toast.id,
        setTimeout(() => this.dismiss(toast.id), toast.duration),
      );
    }
    return toast.id;
  }

  success(title: string, description?: string): number {
    return this.show({ title, description, variant: 'success' });
  }
  error(title: string, description?: string): number {
    return this.show({ title, description, variant: 'error' });
  }
  warning(title: string, description?: string): number {
    return this.show({ title, description, variant: 'warning' });
  }
  info(title: string, description?: string): number {
    return this.show({ title, description, variant: 'info' });
  }

  dismiss(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(id);
    }
    if (this.isLeaving(id)) {
      return;
    }
    if (prefersReducedMotion()) {
      this.remove(id);
      return;
    }
    this.leaving.update((set) => {
      const next = new Set(set);
      next.add(id);
      return next;
    });
  }

  /** Called once a toast's leave animation ends. */
  commitDismiss(id: number): void {
    this.leaving.update((set) => {
      if (!set.has(id)) {
        return set;
      }
      const next = new Set(set);
      next.delete(id);
      return next;
    });
    this.remove(id);
  }

  clear(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    this.leaving.set(new Set());
    this.items.set([]);
  }

  private remove(id: number): void {
    this.items.update((list) => list.filter((t) => t.id !== id));
  }
}

/**
 * Toast outlet. Place once in the root template: `<ngxsmk-toaster />`.
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-toaster',
  template: `
    @for (toast of toasts(); track toast.id) {
      <div
        class="ngxsmk-toaster__toast"
        [attr.data-variant]="toast.variant"
        [class.leaving]="service.isLeaving(toast.id)"
        (animationend)="onAnimEnd($event, toast.id)"
      >
        <div class="ngxsmk-toaster__accent" aria-hidden="true"></div>
        <div class="ngxsmk-toaster__body">
          <p class="ngxsmk-toaster__title">{{ toast.title }}</p>
          @if (toast.description) {
            <p class="ngxsmk-toaster__description">{{ toast.description }}</p>
          }
        </div>
        <button
          type="button"
          class="ngxsmk-toaster__close"
          aria-label="Dismiss notification"
          (click)="service.dismiss(toast.id)"
        >
          <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-toaster',
    '[attr.data-position]': 'position()',
  },
  styles: `
    :host {
      position: fixed;
      z-index: var(--ngxsmk-z-toast, 1600);
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      width: min(22rem, calc(100vw - 2rem));
      pointer-events: none;
      font-family: var(--ngxsmk-font-sans);
    }

    :host([data-position='bottom-right']) { right: 1rem; bottom: 1rem; }
    :host([data-position='bottom-left']) { left: 1rem; bottom: 1rem; }
    :host([data-position='top-right']) { right: 1rem; top: 1rem; }
    :host([data-position='top-left']) { left: 1rem; top: 1rem; }

    .ngxsmk-toaster__toast {
      display: flex;
      align-items: stretch;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-3) var(--ngxsmk-space-3) 0;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
      pointer-events: auto;
      overflow: hidden;
      animation: ngxsmk-toast-in var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    .ngxsmk-toaster__accent {
      width: 4px;
      flex-shrink: 0;
      border-radius: 0;
      background: var(--ngxsmk-color-outline-strong);
    }
    .ngxsmk-toaster__toast[data-variant='success'] .ngxsmk-toaster__accent { background: var(--ngxsmk-color-success); }
    .ngxsmk-toaster__toast[data-variant='error'] .ngxsmk-toaster__accent { background: var(--ngxsmk-color-error); }
    .ngxsmk-toaster__toast[data-variant='warning'] .ngxsmk-toaster__accent { background: var(--ngxsmk-color-warning); }
    .ngxsmk-toaster__toast[data-variant='info'] .ngxsmk-toaster__accent { background: var(--ngxsmk-color-info); }

    .ngxsmk-toaster__body { flex: 1; min-width: 0; }

    .ngxsmk-toaster__title {
      margin: 0;
      font-size: var(--ngxsmk-text-label-lg-size);
      font-weight: 600;
      line-height: var(--ngxsmk-text-label-lg-line);
    }

    .ngxsmk-toaster__description {
      margin: var(--ngxsmk-space-0-5) 0 0;
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
    }

    .ngxsmk-toaster__close {
      align-self: flex-start;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
      padding: 0;
      border: none;
      border-radius: var(--ngxsmk-radius-sm);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
    }
    .ngxsmk-toaster__close:hover { color: var(--ngxsmk-color-on-surface); }
    .ngxsmk-toaster__close:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: 1px;
    }

    @keyframes ngxsmk-toast-in {
      from { opacity: 0; transform: translateY(0.5rem); }
      to { opacity: 1; transform: translateY(0); }
    }

    .ngxsmk-toaster__toast.leaving {
      animation: ngxsmk-toast-out var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-in, ease-in) forwards;
      pointer-events: none;
    }

    @keyframes ngxsmk-toast-out {
      from { opacity: 1; transform: translateY(0); }
      to { opacity: 0; transform: translateY(0.5rem); }
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-toaster__toast { animation: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkToaster {
  protected readonly service = inject(NgxsmkToast);

  readonly position = input<'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'>(
    'bottom-right',
  );

  protected readonly toasts = computed(() => this.service.toasts());

  protected onAnimEnd(event: AnimationEvent, id: number): void {
    if (event.animationName === 'ngxsmk-toast-out') {
      this.service.commitDismiss(id);
    }
  }
}
