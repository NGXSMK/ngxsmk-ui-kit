import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-terminal',
  template: `
    <div class="ngxsmk-terminal__header">{{ title() }}</div>
    <div class="ngxsmk-terminal__body">
      @for (line of lines(); track $index) {
        <div class="ngxsmk-terminal__line" [class.ngxsmk-terminal__line--input]="line.isInput">
          <span class="ngxsmk-terminal__prompt">{{ prompt() }}</span>
          <span>{{ line.text }}</span>
        </div>
      }
      <div class="ngxsmk-terminal__line ngxsmk-terminal__line--active">
        <span class="ngxsmk-terminal__prompt">{{ prompt() }}</span>
        <span class="ngxsmk-terminal__cursor">{{ cursor }}</span>
      </div>
    </div>
  `,
  host: { class: 'ngxsmk-terminal' },
  styles: `
    :host { display: block; background: var(--ngxsmk-terminal-bg, var(--ngxsmk-color-neutral-950)); color: var(--ngxsmk-terminal-fg, var(--ngxsmk-color-neutral-300)); border: 1px solid var(--ngxsmk-color-neutral-800); border-radius: var(--ngxsmk-radius-lg); font-family: var(--ngxsmk-font-mono); font-size: 0.8125rem; overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .ngxsmk-terminal__header { padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4); background: var(--ngxsmk-color-neutral-900); color: var(--ngxsmk-color-neutral-400); font-size: 0.75rem; font-weight: 600; border-bottom: 1px solid var(--ngxsmk-color-neutral-800); }
    .ngxsmk-terminal__body { padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4); min-height: 10rem; overflow-y: auto; }
    .ngxsmk-terminal__line { display: flex; min-width: 0; }
    .ngxsmk-terminal__prompt { color: var(--ngxsmk-terminal-prompt, var(--ngxsmk-color-success)); margin-right: var(--ngxsmk-space-2); user-select: none; }
    .ngxsmk-terminal__line--input { color: var(--ngxsmk-color-neutral-100); }
    .ngxsmk-terminal__cursor { animation: blink 1s step-end infinite; }
    @keyframes blink { 50% { opacity: 0; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTerminal {
  readonly title = input('Terminal');
  readonly lines = input.required<{ text: string; isInput?: boolean }[]>();
  readonly prompt = input('$');
  protected cursor = '▊';
}
