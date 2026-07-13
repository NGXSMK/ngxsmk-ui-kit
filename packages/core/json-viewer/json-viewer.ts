import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'ngxsmk-json-viewer',
  template: `<div class="ngxsmk-json-viewer__tree" [innerHTML]="formatted()"></div>`,
  host: { class: 'ngxsmk-json-viewer' },
  styles: `
    :host { display: block; background: var(--ngxsmk-color-surface-variant); padding: var(--ngxsmk-space-4); border-radius: var(--ngxsmk-radius-md); font-family: var(--ngxsmk-font-mono); font-size: 0.8125rem; line-height: 1.6; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    ::ng-deep .ngxsmk-json-key { color: var(--ngxsmk-color-primary); }
    ::ng-deep .ngxsmk-json-string { color: var(--ngxsmk-color-success); }
    ::ng-deep .ngxsmk-json-number { color: var(--ngxsmk-color-warning); }
    ::ng-deep .ngxsmk-json-boolean { color: var(--ngxsmk-color-error); }
    ::ng-deep .ngxsmk-json-null { color: var(--ngxsmk-color-outline); font-style: italic; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkJsonViewer {
  readonly data = input.required<unknown>();

  protected formatted(): string {
    return this.highlight(JSON.stringify(this.data(), null, 2));
  }

  private highlight(json: string): string {
    return json.replace(/"([^"]+)":/g, '<span class="ngxsmk-json-key">"$1"</span>:')
      .replace(/"([^"]+)"/g, '<span class="ngxsmk-json-string">"$1"</span>')
      .replace(/\b(\d+\.?\d*)\b/g, '<span class="ngxsmk-json-number">$1</span>')
      .replace(/\b(true|false)\b/g, '<span class="ngxsmk-json-boolean">$1</span>')
      .replace(/\bnull\b/g, '<span class="ngxsmk-json-null">null</span>');
  }
}
