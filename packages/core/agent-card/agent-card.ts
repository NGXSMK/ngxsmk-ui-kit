import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface AgentInfo {
  name: string;
  description: string;
  status: 'active' | 'idle' | 'error';
  model: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-agent-card',
  template: `
    <div class="ngxsmk-agent-card__header">
      <div class="ngxsmk-agent-card__avatar">{{ agent().name[0] }}</div>
      <div class="ngxsmk-agent-card__info">
        <div class="ngxsmk-agent-card__name">{{ agent().name }}</div>
        <div class="ngxsmk-agent-card__model">{{ agent().model }}</div>
      </div>
      <span class="ngxsmk-agent-card__status" [attr.data-status]="agent().status"></span>
    </div>
    <div class="ngxsmk-agent-card__description">{{ agent().description }}</div>
  `,
  host: { class: 'ngxsmk-agent-card' },
  styles: `
    :host {
      display: block;
      padding: var(--ngxsmk-space-4);
      border: 1px solid var(--ngxsmk-color-outline-variant);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-agent-card__header {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      margin-bottom: var(--ngxsmk-space-2);
    }
    .ngxsmk-agent-card__avatar {
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
    }
    .ngxsmk-agent-card__info {
      flex: 1;
    }
    .ngxsmk-agent-card__name {
      font-weight: 600;
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-agent-card__model {
      font-size: var(--ngxsmk-text-label-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-agent-card__status {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: var(--ngxsmk-radius-full);
    }
    .ngxsmk-agent-card__status[data-status='active'] {
      background: var(--ngxsmk-color-success);
    }
    .ngxsmk-agent-card__status[data-status='idle'] {
      background: var(--ngxsmk-color-warning);
    }
    .ngxsmk-agent-card__status[data-status='error'] {
      background: var(--ngxsmk-color-error);
    }
    .ngxsmk-agent-card__description {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.5;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAgentCard {
  readonly agent = input.required<AgentInfo>();
}
