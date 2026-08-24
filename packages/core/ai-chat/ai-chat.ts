import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  booleanAttribute,
  input,
  output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface NgxsmkAiMessage {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string;
  citations?: string[];
}

@Component({
  standalone: true,
  selector: 'ngxsmk-ai-chat',
  imports: [FormsModule],
  template: `
    <div class="ngxsmk-ai-chat">
      <!-- Header -->
      <header class="ngxsmk-ai-chat__header">
        <div class="ngxsmk-ai-chat__header-title">
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12A10 10 0 0 1 12 2z"
            />
            <path d="M12 8v8" />
            <path d="M8 12h8" />
          </svg>
          <span>AI Assistant</span>
        </div>
        <div class="ngxsmk-ai-chat__header-actions">
          <select
            [value]="selectedModel()"
            (change)="onModelChange($event)"
            aria-label="Select AI Model"
          >
            @for (model of models(); track model) {
              <option [value]="model">{{ model }}</option>
            }
          </select>
        </div>
      </header>

      <!-- Message Panel -->
      <div class="ngxsmk-ai-chat__feed" #feedContainer>
        @for (msg of messages(); track msg.id) {
          <div
            class="ngxsmk-ai-chat__message-row"
            [class.ngxsmk-ai-chat__message-row--user]="msg.role === 'user'"
          >
            <div class="ngxsmk-ai-chat__avatar">
              @if (msg.role === 'user') {
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              } @else {
                <svg
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
                  />
                </svg>
              }
            </div>
            <div class="ngxsmk-ai-chat__message-content">
              @if (msg.reasoning) {
                <details class="ngxsmk-ai-chat__reasoning">
                  <summary>Thought Process</summary>
                  <div class="ngxsmk-ai-chat__reasoning-text">
                    {{ msg.reasoning }}
                  </div>
                </details>
              }
              <div class="ngxsmk-ai-chat__bubble">
                <p>{{ msg.content }}</p>
              </div>
              @if (msg.citations && msg.citations.length > 0) {
                <div class="ngxsmk-ai-chat__citations">
                  @for (cite of msg.citations; track cite) {
                    <span class="ngxsmk-ai-chat__citation"> [{{ $index + 1 }}] {{ cite }} </span>
                  }
                </div>
              }
            </div>
          </div>
        }

        @if (isTyping()) {
          <div class="ngxsmk-ai-chat__message-row">
            <div class="ngxsmk-ai-chat__avatar">
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"
                />
              </svg>
            </div>
            <div class="ngxsmk-ai-chat__message-content">
              <div class="ngxsmk-ai-chat__bubble ngxsmk-ai-chat__bubble--typing">
                <span class="ngxsmk-ai-chat__dot"></span>
                <span class="ngxsmk-ai-chat__dot"></span>
                <span class="ngxsmk-ai-chat__dot"></span>
              </div>
            </div>
          </div>
        }
      </div>

      <!-- Suggestions Row -->
      @if (suggestions().length > 0 && messages().length === 0) {
        <div class="ngxsmk-ai-chat__suggestions">
          @for (sug of suggestions(); track sug) {
            <button
              type="button"
              class="ngxsmk-ai-chat__suggestion-btn"
              (click)="sendSuggestion(sug)"
            >
              {{ sug }}
            </button>
          }
        </div>
      }

      <!-- Input Footer -->
      <footer class="ngxsmk-ai-chat__footer">
        <form (submit)="onSubmit($event)" class="ngxsmk-ai-chat__form">
          <input
            type="text"
            [placeholder]="placeholder()"
            [(ngModel)]="promptText"
            name="promptText"
            autocomplete="off"
            aria-label="Type your message"
          />
          <button type="submit" [disabled]="!promptText.trim()">
            <svg
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
        @if (tokenCount() > 0) {
          <div class="ngxsmk-ai-chat__token-viewer">Token usage: {{ tokenCount() }}</div>
        }
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
    }

    .ngxsmk-ai-chat {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      overflow: hidden;
      font-family: var(--ngxsmk-font-sans);
      color: var(--ngxsmk-color-on-surface);
    }

    .ngxsmk-ai-chat__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface-variant);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-ai-chat__header-title {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-ai-chat__header-actions select {
      height: var(--ngxsmk-control-height-sm, 2rem);
      padding: 0 var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      cursor: pointer;
    }
    .ngxsmk-ai-chat__header-actions select:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-ai-chat__feed {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-4);
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-4);
    }

    .ngxsmk-ai-chat__message-row {
      display: flex;
      gap: var(--ngxsmk-space-3);
      max-width: 85%;
    }

    .ngxsmk-ai-chat__message-row--user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }

    .ngxsmk-ai-chat__avatar {
      width: 2rem;
      height: 2rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ngxsmk-ai-chat__message-row--user .ngxsmk-ai-chat__avatar {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-ai-chat__message-content {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
    }

    .ngxsmk-ai-chat__bubble {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-lg);
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
    }
    .ngxsmk-ai-chat__bubble p {
      margin: 0;
    }
    .ngxsmk-ai-chat__message-row--user .ngxsmk-ai-chat__bubble {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
    }

    .ngxsmk-ai-chat__reasoning {
      background: var(--ngxsmk-color-surface-variant);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      font-size: var(--ngxsmk-text-label-sm-size);
      margin-bottom: var(--ngxsmk-space-2);
      cursor: pointer;
    }

    .ngxsmk-ai-chat__reasoning-text {
      padding: var(--ngxsmk-space-2) 0;
      color: var(--ngxsmk-color-on-surface-variant);
      border-top: 1px solid var(--ngxsmk-color-outline);
      margin-top: var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-mono);
      white-space: pre-wrap;
    }

    .ngxsmk-ai-chat__citations {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-1);
      margin-top: var(--ngxsmk-space-1);
    }

    .ngxsmk-ai-chat__citation {
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-primary-container);
      padding: var(--ngxsmk-space-0-5) var(--ngxsmk-space-1-5);
      border-radius: var(--ngxsmk-radius-sm);
    }

    .ngxsmk-ai-chat__bubble--typing {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      height: 1.25rem;
    }

    .ngxsmk-ai-chat__dot {
      width: 6px;
      height: 6px;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-on-surface-variant);
      animation: ngxsmk-bounce 1.4s infinite ease-in-out both;
    }
    .ngxsmk-ai-chat__dot:nth-child(1) {
      animation-delay: -0.32s;
    }
    .ngxsmk-ai-chat__dot:nth-child(2) {
      animation-delay: -0.16s;
    }

    @keyframes ngxsmk-bounce {
      0%,
      80%,
      100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }

    .ngxsmk-ai-chat__suggestions {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-background);
    }

    .ngxsmk-ai-chat__suggestion-btn {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-full);
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      font-size: var(--ngxsmk-text-label-sm-size);
      cursor: pointer;
      color: var(--ngxsmk-color-on-surface);
      transition: background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-ai-chat__suggestion-btn:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-ai-chat__suggestion-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-ai-chat__footer {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
      border-top: 1px solid var(--ngxsmk-color-outline);
    }

    .ngxsmk-ai-chat__form {
      display: flex;
      gap: var(--ngxsmk-space-2);
    }

    .ngxsmk-ai-chat__form input {
      flex: 1;
      height: var(--ngxsmk-control-height-md, 2.5rem);
      padding: 0 var(--ngxsmk-space-3);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-background);
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      outline: none;
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-ai-chat__form input:focus {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring);
    }

    .ngxsmk-ai-chat__form button {
      width: var(--ngxsmk-control-height-md, 2.5rem);
      height: var(--ngxsmk-control-height-md, 2.5rem);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      border-radius: var(--ngxsmk-radius-md);
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-ai-chat__form button:hover:not(:disabled) {
      background: var(--ngxsmk-color-primary-hover);
    }
    .ngxsmk-ai-chat__form button:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
    }
    .ngxsmk-ai-chat__form button:disabled {
      opacity: var(--ngxsmk-opacity-disabled);
      cursor: not-allowed;
    }

    .ngxsmk-ai-chat__token-viewer {
      margin-top: var(--ngxsmk-space-2);
      font-size: var(--ngxsmk-text-label-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      text-align: right;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAiChat {
  readonly messages = input<NgxsmkAiMessage[]>([]);
  readonly models = input<string[]>(['gemini-2.5-flash', 'gemini-2.5-pro', 'claude-3.5-sonnet']);
  readonly selectedModel = input<string>('gemini-2.5-flash');
  readonly suggestions = input<string[]>([]);
  readonly isTyping = input(false, { transform: booleanAttribute });
  readonly tokenCount = input<number>(0);
  readonly placeholder = input<string>('Ask me anything...');

  readonly sendMessage = output<string>();
  readonly modelChanged = output<string>();

  @ViewChild('feedContainer') private feedContainer!: ElementRef<HTMLDivElement>;

  protected promptText = '';

  protected onModelChange(event: Event): void {
    const val = (event.target as HTMLSelectElement).value;
    this.modelChanged.emit(val);
  }

  protected sendSuggestion(sug: string): void {
    this.sendMessage.emit(sug);
  }

  protected onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    const text = this.promptText.trim();
    if (text) {
      this.sendMessage.emit(text);
      this.promptText = '';
      setTimeout(() => this.scrollToBottom(), 50);
    }
  }

  private scrollToBottom(): void {
    try {
      const el = this.feedContainer.nativeElement;
      el.scrollTop = el.scrollHeight;
    } catch {
      // Ignored if view not ready.
    }
  }
}
