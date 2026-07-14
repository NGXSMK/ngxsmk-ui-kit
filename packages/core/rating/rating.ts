import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  forwardRef,
  input,
  model,
  numberAttribute,
  output,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export type NgxsmkRatingSize = 'sm' | 'md' | 'lg';

/**
 * Star rating built as a single `role="slider"` widget, so half-step values and
 * full keyboard control come for free and assistive tech announces the value.
 *
 * ```html
 * <ngxsmk-rating [(value)]="score" />
 * <ngxsmk-rating [(value)]="score" [max]="10" allowHalf />
 * <ngxsmk-rating [formControl]="ctrl" readonly />
 * ```
 *
 * Fully signal-driven with zero effects: every visual is a `computed`, positioning
 * is pure CSS, and there are no layout reads — SSR- and zoneless-safe.
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-rating',
  template: `
    @for (star of stars(); track star.index) {
      <span
        class="ngxsmk-rating__star"
        [attr.data-fill]="star.fill"
        (pointerdown)="onPointer($event, star.index)"
        (pointermove)="onHover($event, star.index)"
      >
        <svg viewBox="0 0 24 24" width="1em" height="1em" aria-hidden="true">
          <path
            d="M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9z"
          />
        </svg>
      </span>
    }
    <span class="ngxsmk-rating__sr" aria-live="off">{{ valueText() }}</span>
  `,
  host: {
    role: 'slider',
    class: 'ngxsmk-rating',
    '[attr.tabindex]': 'isDisabled() ? -1 : 0',
    '[attr.data-size]': 'size()',
    '[attr.data-readonly]': 'readonly() ? "" : null',
    '[attr.data-disabled]': 'isDisabled() ? "" : null',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuetext]': 'valueText()',
    '[attr.aria-readonly]': 'readonly() ? "true" : null',
    '[attr.aria-disabled]': 'isDisabled() ? "true" : null',
    '[attr.aria-label]': 'label()',
    '(keydown)': 'onKeydown($event)',
    '(pointerleave)': 'clearPreview()',
    '(blur)': 'onBlur()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: 0.15em;
      font-size: var(--ngxsmk-rating-size, 1.5rem);
      line-height: 1;
      color: var(--ngxsmk-color-outline-strong, #cbd5e1);
      cursor: pointer;
      outline: none;
      touch-action: none;
    }
    :host([data-size='sm']) { --ngxsmk-rating-size: 1.125rem; }
    :host([data-size='lg']) { --ngxsmk-rating-size: 2rem; }
    :host([data-readonly]),
    :host([data-disabled]) { cursor: default; }
    :host([data-disabled]) { opacity: 0.5; }

    .ngxsmk-rating__star {
      position: relative;
      display: inline-flex;
      color: inherit;
    }
    /* Empty star painted in the host colour; ::before overlays the gold fill,
       kept full-size and revealed left-to-right via clip-path (0 | 0.5 | 1). */
    .ngxsmk-rating__star svg { display: block; fill: currentColor; }
    .ngxsmk-rating__star {
      --ngxsmk-star-fill: 0;
      --ngxsmk-rating-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M12 2.5l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.3l6.5-.9z'/%3E%3C/svg%3E");
    }
    .ngxsmk-rating__star::before {
      content: '';
      position: absolute;
      inset: 0;
      background: var(--ngxsmk-color-warning, #f59e0b);
      -webkit-mask: var(--ngxsmk-rating-mask) center / contain no-repeat;
      mask: var(--ngxsmk-rating-mask) center / contain no-repeat;
      clip-path: inset(0 calc((1 - var(--ngxsmk-star-fill)) * 100%) 0 0);
      transition: clip-path var(--ngxsmk-duration-fast, 120ms) var(--ngxsmk-ease-out, ease);
    }
    .ngxsmk-rating__star[data-fill='0.5'] { --ngxsmk-star-fill: 0.5; }
    .ngxsmk-rating__star[data-fill='1'] { --ngxsmk-star-fill: 1; }

    :host(:focus-visible) {
      border-radius: var(--ngxsmk-radius-sm, 4px);
      outline: 2px solid var(--ngxsmk-color-ring, #6366f1);
      outline-offset: 3px;
    }

    .ngxsmk-rating__sr {
      position: absolute;
      width: 1px; height: 1px;
      margin: -1px; padding: 0; border: 0;
      overflow: hidden; clip-path: inset(100%); white-space: nowrap;
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-rating__star[data-fill]::before { transition: none; }
    }
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxsmkRating),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkRating implements ControlValueAccessor {
  readonly value = model(0);
  readonly max = input(5, { transform: numberAttribute });
  readonly allowHalf = input(false, { transform: booleanAttribute });
  readonly readonly = input(false, { transform: booleanAttribute });
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly size = input<NgxsmkRatingSize>('md');
  readonly label = input('Rating');
  readonly changed = output<number>();

  private readonly cvaDisabled = signal(false);
  private readonly previewValue = signal<number | null>(null);

  protected readonly isDisabled = computed(
    () => this.disabled() || this.cvaDisabled(),
  );
  protected readonly isInteractive = computed(
    () => !this.readonly() && !this.isDisabled(),
  );
  private readonly step = computed(() => (this.allowHalf() ? 0.5 : 1));

  /** Value used to paint the stars: the hover preview when present, else value. */
  private readonly display = computed(() => this.previewValue() ?? this.value());

  protected readonly stars = computed(() => {
    const shown = this.display();
    const out: { index: number; fill: '0' | '0.5' | '1' }[] = [];
    for (let i = 1; i <= this.max(); i++) {
      const fill = shown >= i ? '1' : shown >= i - 0.5 ? '0.5' : '0';
      out.push({ index: i, fill });
    }
    return out;
  });

  protected readonly valueText = computed(
    () => `${this.value()} of ${this.max()} stars`,
  );

  private onChange?: (value: number) => void;
  private onTouched?: () => void;

  protected onPointer(event: PointerEvent, index: number): void {
    if (!this.isInteractive()) return;
    event.preventDefault();
    this.commit(this.resolve(event, index));
  }

  protected onHover(event: PointerEvent, index: number): void {
    if (!this.isInteractive()) return;
    this.previewValue.set(this.resolve(event, index));
  }

  protected clearPreview(): void {
    this.previewValue.set(null);
  }

  /** Half vs full based on which side of the star the pointer is on. */
  private resolve(event: PointerEvent, index: number): number {
    if (!this.allowHalf()) return index;
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const isLeft = event.clientX - rect.left < rect.width / 2;
    return isLeft ? index - 0.5 : index;
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!this.isInteractive()) return;
    const step = this.step();
    let next: number | null = null;
    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        next = Math.min(this.max(), this.value() + step);
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        next = Math.max(0, this.value() - step);
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = this.max();
        break;
      default:
        return;
    }
    event.preventDefault();
    this.commit(next);
  }

  private commit(next: number): void {
    this.clearPreview();
    if (next === this.value()) {
      // Re-emit touched even if unchanged so blur/validation still fire.
      this.onTouched?.();
      return;
    }
    this.value.set(next);
    this.onChange?.(next);
    this.onTouched?.();
    this.changed.emit(next);
  }

  protected onBlur(): void {
    this.onTouched?.();
  }

  writeValue(value: unknown): void {
    this.value.set(typeof value === 'number' ? value : 0);
  }
  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.cvaDisabled.set(disabled);
  }
}
