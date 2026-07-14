import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-collapsible',
  template: `
    <button
      type="button"
      class="ngxsmk-collapsible__trigger"
      [attr.aria-expanded]="open()"
      (click)="toggle()"
    >
      <span class="ngxsmk-collapsible__title">{{ title() }}</span>
      <svg
        class="ngxsmk-collapsible__chevron"
        viewBox="0 0 16 16"
        width="14"
        height="14"
        aria-hidden="true"
      >
        <path
          d="M4 6l4 4 4-4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <div class="ngxsmk-collapsible__region" [style.max-height]="open() ? contentHeight : '0px'">
      <div class="ngxsmk-collapsible__content" #content>
        <ng-content />
      </div>
    </div>
  `,
  host: {
    class: 'ngxsmk-collapsible',
    '[attr.data-open]': 'open() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      font-family: var(--ngxsmk-font-sans);
      overflow: hidden;
    }

    .ngxsmk-collapsible__trigger {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-3);
      width: 100%;
      padding: var(--ngxsmk-space-4);
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 500;
      line-height: var(--ngxsmk-text-body-md-line);
      text-align: start;
      cursor: pointer;
    }

    .ngxsmk-collapsible__trigger:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-collapsible__trigger:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
    }

    .ngxsmk-collapsible__title { flex: 1; min-width: 0; }

    .ngxsmk-collapsible__chevron {
      flex-shrink: 0;
      transition: transform var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    :host([data-open]) .ngxsmk-collapsible__chevron { transform: rotate(180deg); }

    .ngxsmk-collapsible__region {
      overflow: hidden;
      transition: max-height var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }

    .ngxsmk-collapsible__content {
      padding: 0 var(--ngxsmk-space-4) var(--ngxsmk-space-4);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    }

    @media (prefers-reduced-motion: reduce) {
      .ngxsmk-collapsible__region,
      .ngxsmk-collapsible__chevron { transition: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCollapsible {
  readonly open = model(false);
  readonly title = input('');

  protected readonly contentHeight = 'var(--ngxsmk-collapsible-content-height, 500px)';

  toggle(): void {
    this.open.update((v) => !v);
  }
}
