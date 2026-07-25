import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

/** Visual weight of a timeline marker, mapped to the semantic color roles. */
export type NgxsmkTimelineVariant =
  'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';

/**
 * Chronological list of events — an activity feed, an audit trail, a release
 * history.
 *
 * The kit had `timeline-gantt` (scheduling), `timeline-stepper` (progress
 * through a known sequence), and `reasoning-timeline` (agent traces), but no
 * plain "what happened, in order" list.
 *
 * ```html
 * <ngxsmk-timeline>
 *   <ngxsmk-timeline-item time="09:41" variant="success">
 *     Deployed to production
 *   </ngxsmk-timeline-item>
 *   <ngxsmk-timeline-item time="09:12" variant="error">
 *     <span slot="title">Build failed</span>
 *     Timed out after 10 minutes
 *   </ngxsmk-timeline-item>
 * </ngxsmk-timeline>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-timeline',
  template: `
    <!-- Explicit list role: the projected items are custom elements, so the
         <ol>'s implicit role would not survive into the a11y tree. -->
    <ol class="ngxsmk-timeline__list" role="list">
      <ng-content />
    </ol>
  `,
  host: {
    class: 'ngxsmk-timeline',
    '[attr.data-orientation]': 'orientation()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-timeline__list {
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    :host([data-orientation='horizontal']) .ngxsmk-timeline__list {
      flex-direction: row;
      overflow-x: auto;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTimeline {
  readonly orientation = input<'vertical' | 'horizontal'>('vertical');
}

/**
 * One event in an {@link NgxsmkTimeline}.
 *
 * Content is the event body. Use `slot="title"` for a heading line and
 * `slot="marker"` to replace the default dot with an icon.
 *
 * ```html
 * <ngxsmk-timeline-item time="09:41" variant="success">Deployed</ngxsmk-timeline-item>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-timeline-item',
  template: `
    <div class="ngxsmk-timeline-item__rail" aria-hidden="true">
      <span class="ngxsmk-timeline-item__marker">
        <ng-content select="[slot=marker]" />
      </span>
      @if (!last()) {
        <span class="ngxsmk-timeline-item__connector"></span>
      }
    </div>

    <div class="ngxsmk-timeline-item__content">
      @if (time()) {
        <!-- <time> carries the machine-readable value when one is given, so a
             relative label like "2h ago" still exposes the real instant. -->
        <time class="ngxsmk-timeline-item__time" [attr.datetime]="dateTime() || null">
          {{ time() }}
        </time>
      }
      <div class="ngxsmk-timeline-item__title"><ng-content select="[slot=title]" /></div>
      <div class="ngxsmk-timeline-item__body"><ng-content /></div>
    </div>
  `,
  host: {
    class: 'ngxsmk-timeline-item',
    role: 'listitem',
    '[attr.data-variant]': 'variant()',
  },
  styles: `
    :host {
      display: flex;
      gap: var(--ngxsmk-space-3);
      /* Space for the connector to span to the next item. */
      padding-bottom: var(--ngxsmk-space-5);
    }
    :host(:last-of-type) {
      padding-bottom: 0;
    }
    .ngxsmk-timeline-item__rail {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 0 0 auto;
    }
    .ngxsmk-timeline-item__marker {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 0.75rem;
      block-size: 0.75rem;
      margin-block-start: 0.3rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-outline-strong);
    }
    .ngxsmk-timeline-item__connector {
      flex: 1 1 auto;
      inline-size: 1px;
      margin-block-start: var(--ngxsmk-space-1);
      background: var(--ngxsmk-color-outline);
    }
    .ngxsmk-timeline-item__content {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
      min-inline-size: 0;
    }
    .ngxsmk-timeline-item__time {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
      font-variant-numeric: tabular-nums;
    }
    .ngxsmk-timeline-item__title:empty {
      display: none;
    }
    .ngxsmk-timeline-item__title {
      font-weight: 600;
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .ngxsmk-timeline-item__body {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    :host([data-variant='primary']) .ngxsmk-timeline-item__marker {
      background: var(--ngxsmk-color-primary);
    }
    :host([data-variant='success']) .ngxsmk-timeline-item__marker {
      background: var(--ngxsmk-color-success);
    }
    :host([data-variant='warning']) .ngxsmk-timeline-item__marker {
      background: var(--ngxsmk-color-warning);
    }
    :host([data-variant='error']) .ngxsmk-timeline-item__marker {
      background: var(--ngxsmk-color-error);
    }
    :host([data-variant='info']) .ngxsmk-timeline-item__marker {
      background: var(--ngxsmk-color-info);
    }

    :host-context([data-orientation='horizontal']) {
      flex-direction: column;
      padding-bottom: 0;
      padding-inline-end: var(--ngxsmk-space-5);
    }
    :host-context([data-orientation='horizontal']) .ngxsmk-timeline-item__rail {
      flex-direction: row;
      inline-size: 100%;
    }
    :host-context([data-orientation='horizontal']) .ngxsmk-timeline-item__connector {
      block-size: 1px;
      inline-size: auto;
      margin-block-start: 0;
      margin-inline-start: var(--ngxsmk-space-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTimelineItem {
  /** Human-readable timestamp, e.g. `09:41` or `2h ago`. */
  readonly time = input('');

  /** Machine-readable instant for the `<time datetime>` attribute. */
  readonly dateTime = input('');

  readonly variant = input<NgxsmkTimelineVariant>('default');

  /** Suppresses the trailing connector. Set on the final item. */
  readonly last = input(false, { transform: booleanAttribute });
}
