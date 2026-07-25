import {
  ChangeDetectionStrategy,
  Component,
  booleanAttribute,
  computed,
  input,
  model,
  output,
} from '@angular/core';

/** Which way the user rated a response. */
export type NgxsmkFeedbackRating = 'up' | 'down' | null;

/** A complete feedback submission. */
export interface NgxsmkFeedbackEvent {
  rating: NgxsmkFeedbackRating;
  /** One of `reasons`, when the user picked one. */
  reason?: string;
  /** Free-text detail, when `allowComment` is enabled and the user typed some. */
  comment?: string;
}

/**
 * Thumbs up/down rating for a generated response, with optional follow-up.
 *
 * Distinct from `ngxsmk-rating`, which captures a score on a scale. This is the
 * binary signal an LLM product collects to build an evaluation set: a direction,
 * and — when the answer was bad — why.
 *
 * Reason chips appear only after a downvote, so the common case stays a single
 * click and the detail is asked for only when there is something to learn.
 *
 * ```html
 * <ngxsmk-response-feedback
 *   [(rating)]="rating"
 *   [reasons]="['Incorrect', 'Too slow', 'Unsafe']"
 *   allowComment
 *   (submitted)="log($event)"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-response-feedback',
  template: `
    <div class="ngxsmk-response-feedback__actions" role="group" [attr.aria-label]="ariaLabel()">
      <button
        type="button"
        class="ngxsmk-response-feedback__vote"
        [attr.aria-pressed]="rating() === 'up'"
        [attr.aria-label]="upLabel()"
        [disabled]="disabled()"
        (click)="vote('up')"
      >
        <span class="ngxsmk-response-feedback__glyph" data-fallback="up" aria-hidden="true"
          ><ng-content select="[slot=up]"
        /></span>
      </button>

      <button
        type="button"
        class="ngxsmk-response-feedback__vote"
        [attr.aria-pressed]="rating() === 'down'"
        [attr.aria-label]="downLabel()"
        [disabled]="disabled()"
        (click)="vote('down')"
      >
        <span class="ngxsmk-response-feedback__glyph" data-fallback="down" aria-hidden="true"
          ><ng-content select="[slot=down]"
        /></span>
      </button>
    </div>

    @if (showFollowUp()) {
      <div class="ngxsmk-response-feedback__followup">
        @if (reasons().length) {
          <div
            class="ngxsmk-response-feedback__reasons"
            role="group"
            [attr.aria-label]="reasonLabel()"
          >
            @for (option of reasons(); track option) {
              <button
                type="button"
                class="ngxsmk-response-feedback__reason"
                [attr.aria-pressed]="reason() === option"
                (click)="pickReason(option)"
              >
                {{ option }}
              </button>
            }
          </div>
        }

        @if (allowComment()) {
          <label class="ngxsmk-response-feedback__comment">
            <span class="ngxsmk-response-feedback__comment-label">{{ commentLabel() }}</span>
            <textarea
              class="ngxsmk-response-feedback__comment-field"
              rows="2"
              [value]="comment()"
              (input)="onComment($event)"
            ></textarea>
          </label>
        }
      </div>
    }
  `,
  host: {
    class: 'ngxsmk-response-feedback',
    '[attr.data-rating]': 'rating()',
  },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-response-feedback__actions {
      display: flex;
      gap: var(--ngxsmk-space-1);
    }
    .ngxsmk-response-feedback__vote {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-inline-size: var(--ngxsmk-control-height-sm);
      min-block-size: var(--ngxsmk-control-height-sm);
      padding: var(--ngxsmk-space-1);
      border: 1px solid transparent;
      border-radius: var(--ngxsmk-radius-md);
      background: none;
      color: var(--ngxsmk-color-on-surface-variant);
      font: inherit;
      cursor: pointer;
      transition: all var(--ngxsmk-motion-duration) var(--ngxsmk-motion-ease);
    }
    .ngxsmk-response-feedback__vote:hover:not(:disabled) {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-response-feedback__vote[aria-pressed='true'] {
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-primary-container);
    }
    .ngxsmk-response-feedback__vote:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    /* Default glyphs come from CSS, not ng-content fallback content, which
       Angular only supports from v18 and would break the 17.3 floor. The
       buttons carry their own aria-labels, so these are decorative. */
    .ngxsmk-response-feedback__glyph[data-fallback='up']:empty::after {
      content: '👍';
    }
    .ngxsmk-response-feedback__glyph[data-fallback='down']:empty::after {
      content: '👎';
    }
    .ngxsmk-response-feedback__vote:disabled {
      opacity: var(--ngxsmk-opacity-disabled, 0.5);
      cursor: not-allowed;
    }
    .ngxsmk-response-feedback__followup {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-response-feedback__reasons {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-1);
    }
    .ngxsmk-response-feedback__reason {
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full);
      background: none;
      color: var(--ngxsmk-color-on-surface-variant);
      font: inherit;
      font-size: var(--ngxsmk-text-label-sm-size);
      cursor: pointer;
    }
    .ngxsmk-response-feedback__reason[aria-pressed='true'] {
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-response-feedback__reason:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-response-feedback__comment {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-response-feedback__comment-field {
      padding: var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
      resize: vertical;
    }
    .ngxsmk-response-feedback__comment-field:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkResponseFeedback {
  /** Current rating. Clicking the active direction clears it. */
  readonly rating = model<NgxsmkFeedbackRating>(null);

  /** Reason chips offered after a downvote. Empty hides them. */
  readonly reasons = input<readonly string[]>([]);

  /** Show a free-text field alongside the reasons. */
  readonly allowComment = input(false, { transform: booleanAttribute });

  readonly disabled = input(false, { transform: booleanAttribute });

  readonly ariaLabel = input('Rate this response');
  readonly upLabel = input('Good response');
  readonly downLabel = input('Bad response');
  readonly reasonLabel = input('What went wrong?');
  readonly commentLabel = input('Anything else?');

  /** The selected reason, if any. */
  readonly reason = model<string | null>(null);
  /** The typed comment, if any. */
  readonly comment = model('');

  /** Emitted whenever the submission changes — rating, reason, or comment. */
  readonly submitted = output<NgxsmkFeedbackEvent>();

  /** Follow-up is for learning why something was bad, so only after a downvote. */
  protected readonly showFollowUp = computed(
    () => this.rating() === 'down' && (this.reasons().length > 0 || this.allowComment()),
  );

  protected vote(direction: Exclude<NgxsmkFeedbackRating, null>): void {
    // Clicking the active direction clears it, so a misclick is recoverable.
    const next = this.rating() === direction ? null : direction;
    this.rating.set(next);

    if (next !== 'down') {
      this.reason.set(null);
      this.comment.set('');
    }

    this.emit();
  }

  protected pickReason(option: string): void {
    this.reason.set(this.reason() === option ? null : option);
    this.emit();
  }

  protected onComment(event: Event): void {
    this.comment.set((event.target as HTMLTextAreaElement).value);
    this.emit();
  }

  private emit(): void {
    const event: NgxsmkFeedbackEvent = { rating: this.rating() };
    const reason = this.reason();
    const comment = this.comment();
    if (reason) event.reason = reason;
    if (comment) event.comment = comment;
    this.submitted.emit(event);
  }
}
