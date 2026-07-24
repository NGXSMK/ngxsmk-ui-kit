import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-json-viewer',
  template: `<pre class="ngxsmk-json-viewer__tree" [innerHTML]="formatted()"></pre>`,
  host: { class: 'ngxsmk-json-viewer' },
  styles: `
    :host {
      display: block;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: var(--ngxsmk-space-4, 1rem);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      font-family: var(--ngxsmk-font-mono, monospace);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
      line-height: var(--ngxsmk-leading-relaxed, 1.6);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .ngxsmk-json-viewer__tree {
      margin: 0;
      font-family: inherit;
      white-space: pre-wrap;
      word-break: break-word;
    }
    ::ng-deep .ngxsmk-json-key {
      color: var(--ngxsmk-color-primary, #7c3aed);
      font-weight: 600;
    }
    ::ng-deep .ngxsmk-json-string {
      color: var(--ngxsmk-color-success, #16a34a);
    }
    ::ng-deep .ngxsmk-json-number {
      color: var(--ngxsmk-color-warning, #d97706);
    }
    ::ng-deep .ngxsmk-json-boolean {
      color: var(--ngxsmk-color-error, #dc2626);
    }
    ::ng-deep .ngxsmk-json-null {
      color: var(--ngxsmk-color-outline, #a1a1aa);
      font-style: italic;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkJsonViewer {
  readonly data = input.required<unknown>();

  protected formatted(): string {
    const raw = JSON.stringify(this.data(), null, 2) ?? 'null';
    return this.highlight(raw);
  }

  private highlight(jsonStr: string): string {
    const escaped = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const regex =
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\btrue\b|\bfalse\b|\bnull\b|-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

    return escaped.replace(regex, (match) => {
      let cls = 'ngxsmk-json-number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'ngxsmk-json-key';
          const keyPart = match.slice(0, -1);
          return `<span class="${cls}">${keyPart}</span>:`;
        } else {
          cls = 'ngxsmk-json-string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'ngxsmk-json-boolean';
      } else if (/null/.test(match)) {
        cls = 'ngxsmk-json-null';
      }
      return `<span class="${cls}">${match}</span>`;
    });
  }
}
