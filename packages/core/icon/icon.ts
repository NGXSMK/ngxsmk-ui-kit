import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type NgxsmkIconSize = 'sm' | 'md' | 'lg';

/** Built-in icon names — project custom SVG when `name` is omitted. */
export type NgxsmkIconName =
  | 'check'
  | 'x'
  | 'plus'
  | 'minus'
  | 'search'
  | 'chevron-down'
  | 'chevron-up'
  | 'chevron-left'
  | 'chevron-right'
  | 'menu'
  | 'settings'
  | 'user'
  | 'bell'
  | 'calendar'
  | 'clock'
  | 'copy'
  | 'external-link'
  | 'info'
  | 'alert-circle'
  | 'trash';

const PATHS: Record<NgxsmkIconName, string> = {
  check: 'M5 12l4 4L19 6',
  x: 'M6 6l12 12M18 6L6 18',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  search: 'M11 5a6 6 0 1 0 0 12 6 6 0 0 0 0-12zM21 21l-4.3-4.3',
  'chevron-down': 'M6 9l6 6 6-6',
  'chevron-up': 'M6 15l6-6 6 6',
  'chevron-left': 'M15 6l-6 6 6 6',
  'chevron-right': 'M9 6l6 6-6 6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  settings:
    'M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9c.3.6.9 1 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  user: 'M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10.3 21a1.9 1.9 0 0 0 3.4 0',
  calendar:
    'M8 2v3M16 2v3M4 9h16M5 5h14a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z',
  clock: 'M12 7v5l3 2M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  copy: 'M8 8V6a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2M4 10h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z',
  'external-link': 'M14 4h6v6M10 14L20 4M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5',
  info: 'M12 16v-4M12 8h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  'alert-circle': 'M12 8v4M12 16h.01M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z',
  trash:
    'M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6',
};

/**
 * Inline icon sized by `--ngxsmk-icon-*` tokens. Use a built-in `name` or
 * project custom SVG.
 *
 * ```html
 * <ngxsmk-icon name="check" size="md" aria-label="Done" />
 * <ngxsmk-icon size="sm" aria-hidden="true">
 *   <svg viewBox="0 0 24 24">…</svg>
 * </ngxsmk-icon>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-icon',
  template: `
    @if (name(); as n) {
      <svg
        class="ngxsmk-icon__svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path [attr.d]="path()" />
      </svg>
    } @else {
      <ng-content />
    }
  `,
  host: {
    class: 'ngxsmk-icon',
    '[attr.data-size]': 'size()',
    '[attr.role]': 'ariaLabel() ? "img" : null',
    '[attr.aria-label]': 'ariaLabel() || null',
    '[attr.aria-hidden]': 'ariaLabel() ? null : "true"',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: currentColor;
      line-height: 0;
      vertical-align: middle;
    }
    :host([data-size='sm']) {
      width: var(--ngxsmk-icon-sm, 1rem);
      height: var(--ngxsmk-icon-sm, 1rem);
    }
    :host([data-size='md']) {
      width: var(--ngxsmk-icon-md, 1.25rem);
      height: var(--ngxsmk-icon-md, 1.25rem);
    }
    :host([data-size='lg']) {
      width: var(--ngxsmk-icon-lg, 1.5rem);
      height: var(--ngxsmk-icon-lg, 1.5rem);
    }
    .ngxsmk-icon__svg,
    :host ::ng-deep svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkIcon {
  readonly name = input<NgxsmkIconName | ''>('');
  readonly size = input<NgxsmkIconSize>('md');
  readonly ariaLabel = input('', { alias: 'aria-label' });

  protected readonly path = computed(() => {
    const n = this.name();
    return n ? PATHS[n] : '';
  });
}
