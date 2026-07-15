import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-citation',
  template: `
    <span class="ngxsmk-citation__marker">[{{ index() }}]</span>
    <span class="ngxsmk-citation__text"><ng-content /></span>
    @if (url()) {
      <a
        class="ngxsmk-citation__link"
        [href]="url()"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Open source"
      >
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          <path
            d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V6"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
          <path
            d="M10 2h4v4M9 7l5-5"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </a>
    }
  `,
  host: { class: 'ngxsmk-citation' },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      vertical-align: baseline;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-citation__marker {
      font-weight: 600;
      color: var(--ngxsmk-color-primary);
      font-size: 0.75em;
    }
    .ngxsmk-citation__link {
      display: inline-flex;
      color: var(--ngxsmk-color-primary);
      opacity: 0.7;
    }
    .ngxsmk-citation__link:hover {
      opacity: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCitation {
  readonly index = input.required<number>();
  readonly url = input('');
}
