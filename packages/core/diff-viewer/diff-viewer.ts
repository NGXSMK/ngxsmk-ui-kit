import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export interface NgxsmkDiffLine {
  type: 'add' | 'remove' | 'context';
  prefix: string;
  text: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-diff-viewer',
  template: `
    <div class="ngxsmk-diff-viewer__lines">
      @for (line of parsed(); track $index) {
        <div [class]="'ngxsmk-diff-viewer__line ngxsmk-diff-viewer__line--' + line.type">
          <span class="ngxsmk-diff-viewer__ln">{{ $index + 1 }}</span>
          <span class="ngxsmk-diff-viewer__prefix">{{ line.prefix }}</span>
          <span class="ngxsmk-diff-viewer__text">{{ line.text }}</span>
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-diff-viewer' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      border-radius: var(--ngxsmk-radius-md);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
      border: 1px solid var(--ngxsmk-color-outline-variant);
    }
    .ngxsmk-diff-viewer__line {
      display: flex;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-3);
    }
    .ngxsmk-diff-viewer__line--add {
      background: color-mix(in srgb, var(--ngxsmk-color-success) 10%, transparent);
    }
    .ngxsmk-diff-viewer__line--remove {
      background: color-mix(in srgb, var(--ngxsmk-color-error) 10%, transparent);
    }
    .ngxsmk-diff-viewer__line--add .ngxsmk-diff-viewer__prefix {
      color: var(--ngxsmk-color-success);
    }
    .ngxsmk-diff-viewer__line--remove .ngxsmk-diff-viewer__prefix {
      color: var(--ngxsmk-color-error);
    }
    .ngxsmk-diff-viewer__ln {
      color: var(--ngxsmk-color-outline);
      min-width: 3ch;
      text-align: right;
      user-select: none;
    }
    .ngxsmk-diff-viewer__prefix {
      min-width: 1ch;
    }
    .ngxsmk-diff-viewer__text {
      flex: 1;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkDiffViewer {
  readonly source = input('');

  protected readonly parsed = computed<NgxsmkDiffLine[]>(() => {
    const src = this.source() || '';
    return src.split('\n').map((line) => {
      if (line.startsWith('+') && !line.startsWith('+++'))
        return { type: 'add', prefix: '+', text: line.slice(1) };
      if (line.startsWith('-') && !line.startsWith('---'))
        return { type: 'remove', prefix: '-', text: line.slice(1) };
      return { type: 'context', prefix: ' ', text: line };
    });
  });
}
