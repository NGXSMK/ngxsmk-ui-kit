import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { NGXSMK_BREADCRUMB_SEPARATOR } from '@ngxsmk/core/breadcrumb';

/**
 * A single step in a breadcrumb trail. An item with no `href` is the current
 * page and is marked `aria-current="page"`.
 *
 * ```html
 * <ngxsmk-breadcrumb-item href="/docs">Docs</ngxsmk-breadcrumb-item>
 * ```
 *
 * Wrap items in `ngxsmk-breadcrumb` for the navigation landmark and list
 * semantics; used bare they still render, just without those.
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-breadcrumb-item',
  template: `
    @if (effectiveSeparator()) {
      <span class="ngxsmk-breadcrumb-item__sep" aria-hidden="true">{{ effectiveSeparator() }}</span>
    }
    <a
      class="ngxsmk-breadcrumb-item__link"
      [attr.href]="href() || null"
      [attr.aria-current]="href() ? null : 'page'"
    >
      <ng-content />
    </a>
  `,
  // Explicit listitem role: the parent's <ol> cannot confer it on a custom
  // element, so without this the trail is not announced as a list.
  host: { class: 'ngxsmk-breadcrumb-item', role: 'listitem' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-breadcrumb-item__sep {
      display: none;
      margin-inline: var(--ngxsmk-space-1);
      color: var(--ngxsmk-color-outline-strong, var(--ngxsmk-color-on-surface-variant));
    }
    :host + :host .ngxsmk-breadcrumb-item__sep {
      display: inline;
    }
    .ngxsmk-breadcrumb-item__link {
      color: var(--ngxsmk-color-on-surface-variant);
      text-decoration: none;
    }
    .ngxsmk-breadcrumb-item__link:hover {
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-breadcrumb-item__link:not([href]) {
      color: var(--ngxsmk-color-on-surface);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      pointer-events: none;
      cursor: default;
    }
    @media (max-width: 768px) {
      :host {
        flex-shrink: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBreadcrumbItem {
  readonly href = input('');

  /**
   * Per-item override. Left empty, the item uses the enclosing breadcrumb's
   * `separator`, falling back to `/` when used outside one — which is what a
   * bare item rendered before this input could defer to a parent.
   */
  readonly separator = input('');

  private readonly inherited = inject(NGXSMK_BREADCRUMB_SEPARATOR, { optional: true });

  protected readonly effectiveSeparator = computed(
    () => this.separator() || this.inherited?.() || '/',
  );
}
