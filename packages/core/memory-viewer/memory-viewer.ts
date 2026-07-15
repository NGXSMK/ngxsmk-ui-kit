import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-memory-viewer',
  template: `
    <div class="ngxsmk-memory-viewer__items">
      @for (entry of entries(); track entry.key) {
        <div class="ngxsmk-memory-viewer__entry">
          <div class="ngxsmk-memory-viewer__key">{{ entry.key }}</div>
          <div class="ngxsmk-memory-viewer__value">{{ entry.value }}</div>
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-memory-viewer' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.8125rem;
    }
    .ngxsmk-memory-viewer__items {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-memory-viewer__entry {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-md);
    }
    .ngxsmk-memory-viewer__key {
      font-weight: 500;
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-memory-viewer__value {
      color: var(--ngxsmk-color-on-surface);
      word-break: break-all;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMemoryViewer {
  readonly entries = input.required<{ key: string; value: string }[]>();
}
