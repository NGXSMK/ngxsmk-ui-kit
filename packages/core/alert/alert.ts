import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

export type NgxsmkAlertVariant = 'info' | 'success' | 'warning' | 'error';

/**
 * Inline notification.
 *
 * ```html
 * <ngxsmk-alert variant="success" title="Saved">Your changes are live.</ngxsmk-alert>
 * <ngxsmk-alert variant="error" dismissible (dismissed)="onDismiss()">…</ngxsmk-alert>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-alert',
  template: `
    @if (!hidden()) {
      <svg
        class="ngxsmk-alert__icon"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        @switch (variant()) {
          @case ('success') {
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <path d="m9 11 3 3L22 4" />
          }
          @case ('warning') {
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
          }
          @case ('error') {
            <circle cx="12" cy="12" r="10" />
            <path d="m15 9-6 6" />
            <path d="m9 9 6 6" />
          }
          @default {
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          }
        }
      </svg>
      <div class="ngxsmk-alert__body">
        @if (title()) {
          <p class="ngxsmk-alert__title">{{ title() }}</p>
        }
        <div class="ngxsmk-alert__content"><ng-content /></div>
      </div>
      @if (dismissible()) {
        <button type="button" class="ngxsmk-alert__close" aria-label="Dismiss" (click)="dismiss()">
          <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
            <path
              d="M4 4l8 8M12 4l-8 8"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
            />
          </svg>
        </button>
      }
    }
  `,
  host: {
    class: 'ngxsmk-alert',
    '[attr.role]': 'role()',
    '[attr.data-variant]': 'variant()',
    '[attr.data-hidden]': 'hidden() ? "" : null',
  },
  styles: `
    :host {
      display: flex;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-4);
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-radius-lg);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }

    :host([data-hidden]) {
      display: none;
    }

    :host([data-variant='info']) {
      background: var(--ngxsmk-color-info-container);
      color: var(--ngxsmk-color-on-info-container);
    }
    :host([data-variant='success']) {
      background: var(--ngxsmk-color-success-container);
      color: var(--ngxsmk-color-on-success-container);
    }
    :host([data-variant='warning']) {
      background: var(--ngxsmk-color-warning-container);
      color: var(--ngxsmk-color-on-warning-container);
    }
    :host([data-variant='error']) {
      background: var(--ngxsmk-color-error-container);
      color: var(--ngxsmk-color-on-error-container);
    }

    .ngxsmk-alert__icon {
      flex-shrink: 0;
      margin-top: 0.125rem;
    }

    .ngxsmk-alert__body {
      flex: 1;
      min-width: 0;
    }

    .ngxsmk-alert__title {
      margin: 0 0 var(--ngxsmk-space-0-5);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }

    .ngxsmk-alert__content {
      margin: 0;
    }

    .ngxsmk-alert__close {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.5rem;
      height: 1.5rem;
      padding: 0;
      border: none;
      border-radius: var(--ngxsmk-radius-sm);
      background: transparent;
      color: inherit;
      cursor: pointer;
      opacity: var(--ngxsmk-opacity-muted);
      transition: opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-alert__close:hover {
      opacity: 1;
    }
    .ngxsmk-alert__close:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAlert {
  readonly variant = input<NgxsmkAlertVariant>('info');
  readonly title = input('');
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly dismissed = output<void>();

  protected readonly hidden = signal(false);

  /** `alert` interrupts screen readers — reserve it for problems. */
  protected readonly role = computed(() =>
    this.variant() === 'error' || this.variant() === 'warning' ? 'alert' : 'status',
  );

  dismiss(): void {
    this.hidden.set(true);
    this.dismissed.emit();
  }
}
