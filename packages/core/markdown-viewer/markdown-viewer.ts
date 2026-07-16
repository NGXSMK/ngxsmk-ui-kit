import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-markdown-viewer',
  template: `<div class="ngxsmk-markdown-viewer__body"><ng-content /></div>`,
  host: { class: 'ngxsmk-markdown-viewer' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      line-height: 1.6;
      color: var(--ngxsmk-color-on-surface);
    }
    ::ng-deep h1,
    ::ng-deep h2,
    ::ng-deep h3,
    ::ng-deep h4 {
      margin: 1em 0 0.5em;
      font-weight: 600;
    }
    ::ng-deep h1 {
      font-size: 1.5em;
    }
    ::ng-deep h2 {
      font-size: 1.25em;
    }
    ::ng-deep h3 {
      font-size: 1.1em;
    }
    ::ng-deep p {
      margin: 0 0 0.75em;
      line-height: 1.6;
    }
    ::ng-deep code {
      background: var(--ngxsmk-color-surface-variant);
      padding: 0.125em 0.25em;
      border-radius: var(--ngxsmk-radius-sm);
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.875em;
    }
    ::ng-deep pre {
      background: var(--ngxsmk-color-surface-variant);
      padding: var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-md);
      overflow-x: auto;
    }
    ::ng-deep pre code {
      padding: 0;
      background: none;
    }
    ::ng-deep ul,
    ::ng-deep ol {
      padding-inline-start: 1.5em;
      margin: 0.5em 0;
    }
    ::ng-deep li {
      margin: 0.25em 0;
    }
    ::ng-deep blockquote {
      border-inline-start: 3px solid var(--ngxsmk-color-primary);
      margin: 0.75em 0;
      padding: 0.25em 1em;
      color: var(--ngxsmk-color-on-surface-variant);
      background: var(--ngxsmk-color-surface-container);
      border-radius: 0 var(--ngxsmk-radius-md) var(--ngxsmk-radius-md) 0;
    }
    ::ng-deep a {
      color: var(--ngxsmk-color-primary);
      text-decoration: underline;
    }
    ::ng-deep img {
      max-width: 100%;
      border-radius: var(--ngxsmk-radius-md);
    }
    ::ng-deep hr {
      border: none;
      border-top: 1px solid var(--ngxsmk-color-outline-variant);
      margin: 1.5em 0;
    }
    ::ng-deep table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    ::ng-deep th,
    ::ng-deep td {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline-variant);
      text-align: left;
    }
    ::ng-deep th {
      background: var(--ngxsmk-color-surface-variant);
      font-weight: 600;
    }
    @media (max-width: 768px) {
      ::ng-deep table {
        display: block;
        width: 100%;
        max-width: 100%;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMarkdownViewer {}
