import { ChangeDetectionStrategy, Component, input, signal, effect } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-streaming-text',
  template: `{{ displayText() }}<span class="ngxsmk-streaming-text__cursor">&ZeroWidthSpace;</span>`,
  host: { class: 'ngxsmk-streaming-text', 'aria-live': 'polite' },
  styles: `
    :host { white-space: pre-wrap; word-wrap: break-word; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-streaming-text__cursor { display: inline-block; width: 0.125rem; height: 1em; background: var(--ngxsmk-color-primary); margin-left: var(--ngxsmk-space-1); animation: blink 0.8s step-end infinite; vertical-align: text-bottom; }
    @keyframes blink { 50% { opacity: 0; } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkStreamingText {
  readonly text = input('');
  readonly speed = input(30);

  protected readonly displayText = signal('');

  constructor() {
    effect(() => {
      const target = this.text();
      this.streamTo(target);
    });
  }

  private streamTo(target: string): void {
    const currentLen = this.displayText().length;
    if (target.length <= currentLen) return;
    const nextChar = target[currentLen];
    this.displayText.update(t => t + nextChar);
    if (this.displayText().length < target.length) {
      setTimeout(() => this.streamTo(target), this.speed());
    }
  }
}
