import { ChangeDetectionStrategy, Component, booleanAttribute, input, output } from '@angular/core';

export type NgxsmkTagVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Label for categorizing content.
 *
 * ```html
 * <ngxsmk-tag>angular</ngxsmk-tag>
 * <ngxsmk-tag variant="primary">signals</ngxsmk-tag>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-tag',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-tag',
    '[attr.data-variant]': 'variant()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-radius-sm);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-md-size);
      font-weight: var(--ngxsmk-text-label-md-weight);
      line-height: var(--ngxsmk-text-label-md-line);
      white-space: nowrap;
    }

    :host([data-variant='neutral']) {
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      border-color: var(--ngxsmk-color-outline);
    }
    :host([data-variant='primary']) {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-primary) 20%, transparent);
    }
    :host([data-variant='success']) {
      background: var(--ngxsmk-color-success-container);
      color: var(--ngxsmk-color-on-success-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-success) 20%, transparent);
    }
    :host([data-variant='warning']) {
      background: var(--ngxsmk-color-warning-container);
      color: var(--ngxsmk-color-on-warning-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-warning) 20%, transparent);
    }
    :host([data-variant='error']) {
      background: var(--ngxsmk-color-error-container);
      color: var(--ngxsmk-color-on-error-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-error) 20%, transparent);
    }
    :host([data-variant='info']) {
      background: var(--ngxsmk-color-info-container);
      color: var(--ngxsmk-color-on-info-container);
      border-color: color-mix(in srgb, var(--ngxsmk-color-info) 20%, transparent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTag {
  readonly variant = input<NgxsmkTagVariant>('neutral');
}

/**
 * Removable tag. Emits `removed` when the close affordance is activated.
 *
 * ```html
 * <ngxsmk-chip (removed)="remove(item)">{{ item }}</ngxsmk-chip>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-chip',
  template: `
    <span class="ngxsmk-chip__label"><ng-content /></span>
    @if (removable()) {
      <button
        type="button"
        class="ngxsmk-chip__remove"
        aria-label="Remove"
        [disabled]="disabled()"
        (click)="removed.emit()"
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
    }
  `,
  host: {
    class: 'ngxsmk-chip',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-1) var(--ngxsmk-space-0-5)
        var(--ngxsmk-space-2-5, var(--ngxsmk-space-3));
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-md-size);
      font-weight: var(--ngxsmk-text-label-md-weight);
      line-height: var(--ngxsmk-text-label-md-line);
      white-space: nowrap;
    }

    :host([data-disabled]) {
      opacity: var(--ngxsmk-opacity-disabled);
      pointer-events: none;
    }

    .ngxsmk-chip__remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
      padding: 0;
      border: none;
      border-radius: var(--ngxsmk-radius-full);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition:
        background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-chip__remove:hover {
      background: var(--ngxsmk-color-outline);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-chip__remove:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkChip {
  readonly removable = input(true, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly removed = output<void>();
}
