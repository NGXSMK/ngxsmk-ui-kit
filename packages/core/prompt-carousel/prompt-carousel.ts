import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';

export interface PromptItem {
  id: string;
  category: string;
  title: string;
  prompt: string;
  icon?: string;
  colorPreset?: 'violet' | 'emerald' | 'rose' | 'amber' | 'blue';
}

@Component({
  selector: 'ngxsmk-prompt-carousel',
  standalone: true,
  template: `
    <div class="ngxsmk-prompt-carousel-container">
      <div class="ngxsmk-prompt-carousel-fade ngxsmk-prompt-carousel-fade--left"></div>

      <div class="ngxsmk-prompt-carousel-track">
        @for (item of prompts(); track item.id) {
          <div
            class="ngxsmk-prompt-card"
            [attr.data-preset]="item.colorPreset || 'violet'"
            tabindex="0"
            role="button"
            (click)="selectPrompt(item)"
            (keydown.enter)="selectPrompt(item)"
            (keydown.space)="selectPrompt(item); $event.preventDefault()"
          >
            <div class="ngxsmk-prompt-card__header">
              <span class="ngxsmk-prompt-card__icon">{{ item.icon || '✦' }}</span>
              <span class="ngxsmk-prompt-card__cat">{{ item.category }}</span>
            </div>

            <h4 class="ngxsmk-prompt-card__title">{{ item.title }}</h4>
            <p class="ngxsmk-prompt-card__preview">"{{ item.prompt }}"</p>

            <div class="ngxsmk-prompt-card__footer">
              <span class="ngxsmk-prompt-card__action">Use prompt →</span>
            </div>
          </div>
        }
      </div>

      <div class="ngxsmk-prompt-carousel-fade ngxsmk-prompt-carousel-fade--right"></div>
    </div>
  `,
  styles: `
    .ngxsmk-prompt-carousel-container {
      position: relative;
      width: 100%;
      overflow: hidden;
      padding: var(--ngxsmk-space-2, 0.5rem) 0;
    }

    .ngxsmk-prompt-carousel-track {
      display: flex;
      gap: var(--ngxsmk-space-4, 1rem);
      overflow-x: auto;
      scroll-behavior: smooth;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-6, 1.5rem);
      /* Hide scrollbars */
      -ms-overflow-style: none; /* IE and Edge */
      scrollbar-width: none; /* Firefox */
    }

    .ngxsmk-prompt-carousel-track::-webkit-scrollbar {
      display: none; /* Chrome, Safari and Opera */
    }

    .ngxsmk-prompt-carousel-fade {
      position: absolute;
      top: 0;
      bottom: 0;
      width: var(--ngxsmk-space-12, 3rem);
      pointer-events: none;
      z-index: 2;
    }

    .ngxsmk-prompt-carousel-fade--left {
      left: 0;
      background: linear-gradient(
        to right,
        var(--ngxsmk-color-background, #fafafa) 10%,
        transparent
      );
    }

    .ngxsmk-prompt-carousel-fade--right {
      right: 0;
      background: linear-gradient(
        to left,
        var(--ngxsmk-color-background, #fafafa) 10%,
        transparent
      );
    }

    .ngxsmk-prompt-card {
      flex: 0 0 240px;
      width: 240px;
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      padding: var(--ngxsmk-space-4, 1rem);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 160px;
      cursor: pointer;
      box-shadow: var(--ngxsmk-shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
      position: relative;
      overflow: hidden;
      transition:
        transform 0.2s cubic-bezier(0.2, 0, 0, 1),
        box-shadow 0.2s cubic-bezier(0.2, 0, 0, 1),
        border-color 0.2s ease;
    }

    .ngxsmk-prompt-card::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: var(--ngxsmk-color-primary, #7c3aed);
      opacity: 0.8;
    }

    .ngxsmk-prompt-card[data-preset='violet']::before {
      background: #7c3aed;
    }
    .ngxsmk-prompt-card[data-preset='emerald']::before {
      background: #059669;
    }
    .ngxsmk-prompt-card[data-preset='rose']::before {
      background: #e11d48;
    }
    .ngxsmk-prompt-card[data-preset='amber']::before {
      background: #d97706;
    }
    .ngxsmk-prompt-card[data-preset='blue']::before {
      background: #2563eb;
    }

    .ngxsmk-prompt-card:hover {
      transform: translateY(-4px) scale(1.01);
      box-shadow: var(--ngxsmk-shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));
      border-color: var(--ngxsmk-color-outline-strong, #b5b5be);
    }

    .ngxsmk-prompt-card__header {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      margin-bottom: var(--ngxsmk-space-2, 0.5rem);
    }

    .ngxsmk-prompt-card__icon {
      font-size: 0.9rem;
    }

    .ngxsmk-prompt-card__cat {
      font-size: 0.6875rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-prompt-card__title {
      margin: 0 0 var(--ngxsmk-space-1, 0.25rem) 0;
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 0.875rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface, #09090b);
      line-height: 1.3;
    }

    .ngxsmk-prompt-card__preview {
      margin: 0;
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
      font-style: italic;
    }

    .ngxsmk-prompt-card__footer {
      margin-top: var(--ngxsmk-space-2, 0.5rem);
      display: flex;
      justify-content: flex-end;
    }

    .ngxsmk-prompt-card__action {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-primary, #7c3aed);
      transition: color 0.15s;
    }

    .ngxsmk-prompt-card:hover .ngxsmk-prompt-card__action {
      color: var(--ngxsmk-color-primary-hover, #6d28d9);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPromptCarousel {
  readonly prompts = input<PromptItem[]>([]);
  readonly selected = output<PromptItem>();

  selectPrompt(item: PromptItem): void {
    this.selected.emit(item);
  }
}
