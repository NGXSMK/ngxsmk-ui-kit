import { ChangeDetectionStrategy, Component, booleanAttribute, input } from '@angular/core';

export interface NgxsmkCitationSource {
  id?: string;
  title: string;
  author?: string;
  snippet?: string;
  url?: string;
}

/**
 * Single citation card or a stacked list of sources for AI answers.
 * Pass one source via title/author/snippet, or multiple via `[sources]`.
 *
 * ```html
 * <ngxsmk-citation-viewer [sources]="citations" />
 * <ngxsmk-citation-viewer title="Paper" author="Ada" snippet="Finding…" url="https://…" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-citation-viewer',
  template: `
    <div class="ngxsmk-citation-viewer__list" role="list">
      @for (src of resolved(); track src.id ?? src.title + $index) {
        <article class="ngxsmk-citation-viewer__card" role="listitem">
          <div class="ngxsmk-citation-viewer__head">
            @if (src.url) {
              <a
                class="ngxsmk-citation-viewer__title"
                [href]="src.url"
                target="_blank"
                rel="noopener noreferrer"
              >
                {{ src.title }}
              </a>
            } @else {
              <div class="ngxsmk-citation-viewer__title">{{ src.title }}</div>
            }
            @if (showIndex()) {
              <span class="ngxsmk-citation-viewer__index">{{ $index + 1 }}</span>
            }
          </div>
          @if (src.author) {
            <div class="ngxsmk-citation-viewer__meta">{{ src.author }}</div>
          }
          @if (src.snippet) {
            <div class="ngxsmk-citation-viewer__preview">{{ src.snippet }}</div>
          }
        </article>
      }
    </div>
  `,
  host: { class: 'ngxsmk-citation-viewer' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-citation-viewer__list {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-citation-viewer__card {
      padding: var(--ngxsmk-space-3);
      border-inline-start: 3px solid var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-surface-container, var(--ngxsmk-color-surface-variant));
      border-radius: var(--ngxsmk-radius-md);
    }
    .ngxsmk-citation-viewer__head {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2);
      margin-bottom: var(--ngxsmk-space-1);
    }
    .ngxsmk-citation-viewer__title {
      font-size: var(--ngxsmk-text-label-lg-size);
      font-weight: var(--ngxsmk-font-weight-medium, 500);
      color: var(--ngxsmk-color-on-surface);
      text-decoration: none;
    }
    a.ngxsmk-citation-viewer__title:hover {
      color: var(--ngxsmk-color-primary);
      text-decoration: underline;
    }
    .ngxsmk-citation-viewer__index {
      flex-shrink: 0;
      font-size: var(--ngxsmk-text-label-sm-size, 0.75rem);
      color: var(--ngxsmk-color-on-surface-variant);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full);
      min-width: 1.25rem;
      height: 1.25rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .ngxsmk-citation-viewer__meta {
      font-size: var(--ngxsmk-text-label-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin-bottom: var(--ngxsmk-space-1);
    }
    .ngxsmk-citation-viewer__preview {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: var(--ngxsmk-leading-normal, 1.5);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCitationViewer {
  /** Multi-source list. When empty, falls back to title/author/snippet/url. */
  readonly sources = input<NgxsmkCitationSource[]>([]);
  readonly title = input('');
  readonly author = input('');
  readonly snippet = input('');
  readonly url = input('');
  /** Show 1-based badges when listing multiple sources (default on for lists). */
  readonly showIndex = input(true, { transform: booleanAttribute });

  protected resolved(): NgxsmkCitationSource[] {
    const list = this.sources();
    if (list.length) return list;
    if (!this.title()) return [];
    return [
      {
        title: this.title(),
        author: this.author() || undefined,
        snippet: this.snippet() || undefined,
        url: this.url() || undefined,
      },
    ];
  }
}
