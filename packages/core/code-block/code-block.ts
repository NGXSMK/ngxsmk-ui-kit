import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  effect,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

/**
 * Code panel with copy control, language label, and optional streaming reveal
 * for AI assistant UIs. Pass source via `[code]` (preferred) or project text.
 *
 * ```html
 * <ngxsmk-code-block language="ts" [code]="snippet" [streaming]="busy" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-code-block',
  template: `
    <div class="ngxsmk-code-block__chrome">
      <span class="ngxsmk-code-block__lang">{{ language() || 'code' }}</span>
      <button
        type="button"
        class="ngxsmk-code-block__copy"
        [attr.aria-label]="copied() ? 'Copied' : 'Copy code'"
        (click)="copy()"
      >
        {{ copied() ? 'Copied' : 'Copy' }}
      </button>
    </div>
    <pre
      class="ngxsmk-code-block__pre"
      [attr.data-streaming]="streaming() && !streamDone() ? '' : null"
    ><code class="ngxsmk-code-block__code">{{ displayed() }}</code></pre>
    <div #slot class="ngxsmk-code-block__slot" hidden aria-hidden="true"><ng-content /></div>
  `,
  host: {
    class: 'ngxsmk-code-block',
    '[attr.data-language]': 'language() || null',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      overflow: hidden;
      background: var(--ngxsmk-color-surface-variant);
    }
    .ngxsmk-code-block__chrome {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      background: color-mix(in srgb, var(--ngxsmk-color-surface) 70%, transparent);
    }
    .ngxsmk-code-block__lang {
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-sm-size, 0.75rem);
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-code-block__copy {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-sm);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-sm-size, 0.75rem);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-2);
      cursor: pointer;
    }
    .ngxsmk-code-block__copy:hover {
      border-color: var(--ngxsmk-color-ring, var(--ngxsmk-color-primary));
    }
    .ngxsmk-code-block__copy:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-code-block__pre {
      margin: 0;
      padding: var(--ngxsmk-space-4);
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }
    .ngxsmk-code-block__pre[data-streaming] .ngxsmk-code-block__code::after {
      content: '';
      display: inline-block;
      width: 0.5ch;
      height: 1.1em;
      margin-inline-start: 1px;
      vertical-align: text-bottom;
      background: var(--ngxsmk-color-primary);
      animation: ngxsmk-code-caret 1s steps(1) infinite;
    }
    .ngxsmk-code-block__code {
      color: var(--ngxsmk-color-on-surface);
      white-space: pre;
    }
    .ngxsmk-code-block__slot {
      display: none;
    }
    @keyframes ngxsmk-code-caret {
      50% {
        opacity: 0;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCodeBlock implements AfterContentInit {
  private readonly document = inject(DOCUMENT);
  private readonly slot = viewChild<ElementRef<HTMLElement>>('slot');

  readonly language = input('');
  /** Full source text. When set, overrides projected content. */
  readonly code = input('');
  /** Reveal source gradually (AI streaming). */
  readonly streaming = input(false);
  readonly streamChunk = input(3);
  readonly streamIntervalMs = input(24);

  protected readonly displayed = signal('');
  protected readonly copied = signal(false);
  protected readonly streamDone = signal(true);

  private readonly projected = signal('');
  private timer: ReturnType<typeof setInterval> | null = null;
  private copyTimer: ReturnType<typeof setTimeout> | null = null;

  private readonly source = computed(() => this.code() || this.projected());

  constructor() {
    effect((onCleanup) => {
      const full = this.source();
      const streaming = this.streaming();
      untracked(() => this.clearTimer());

      if (!streaming) {
        this.displayed.set(full);
        this.streamDone.set(true);
        return;
      }

      this.displayed.set('');
      this.streamDone.set(false);
      let i = 0;
      const chunk = Math.max(1, this.streamChunk());
      const ms = Math.max(8, this.streamIntervalMs());
      this.timer = setInterval(() => {
        i = Math.min(full.length, i + chunk);
        this.displayed.set(full.slice(0, i));
        if (i >= full.length) {
          this.streamDone.set(true);
          this.clearTimer();
        }
      }, ms);

      onCleanup(() => this.clearTimer());
    });
  }

  ngAfterContentInit(): void {
    const text = this.slot()?.nativeElement.textContent?.trim() ?? '';
    if (text) this.projected.set(text);
  }

  protected async copy(): Promise<void> {
    const text = this.displayed() || this.source();
    try {
      await this.document.defaultView?.navigator.clipboard.writeText(text);
      this.copied.set(true);
      if (this.copyTimer) clearTimeout(this.copyTimer);
      this.copyTimer = setTimeout(() => this.copied.set(false), 1600);
    } catch {
      /* clipboard may be unavailable */
    }
  }

  private clearTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
