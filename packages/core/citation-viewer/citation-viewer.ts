import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-citation-viewer',
  template: `
    <div class="ngxsmk-citation-viewer__card">
      <div class="ngxsmk-citation-viewer__title">{{ title() }}</div>
      @if (author()) {
        <div class="ngxsmk-citation-viewer__meta">{{ author() }}</div>
      }
      <div class="ngxsmk-citation-viewer__preview">{{ snippet() }}</div>
    </div>
  `,
  host: { class: 'ngxsmk-citation-viewer' },
  styles: `
    :host { display: block; padding: var(--ngxsmk-space-3); border-left: 3px solid var(--ngxsmk-color-primary); background: var(--ngxsmk-color-surface-container); border-radius: var(--ngxsmk-radius-md); font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-citation-viewer__title { font-size: 0.875rem; font-weight: 500; color: var(--ngxsmk-color-on-surface); margin-bottom: var(--ngxsmk-space-1); }
    .ngxsmk-citation-viewer__meta { font-size: 0.75rem; color: var(--ngxsmk-color-on-surface-variant); margin-bottom: var(--ngxsmk-space-1); }
    .ngxsmk-citation-viewer__preview { font-size: 0.8125rem; color: var(--ngxsmk-color-on-surface-variant); line-height: 1.5; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCitationViewer {
  readonly title = input('');
  readonly author = input('');
  readonly snippet = input('');
}
