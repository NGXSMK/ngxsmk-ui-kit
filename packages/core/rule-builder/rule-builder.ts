import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface RuleGroup {
  operator: 'AND' | 'OR';
  rules: Rule[];
}

export interface Rule {
  field: string;
  operator: string;
  value: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-rule-builder',
  template: `
    <div class="ngxsmk-rule-builder__group">
      <div class="ngxsmk-rule-builder__operator">{{ group().operator }}</div>
      @for (rule of group().rules; track $index) {
        <div class="ngxsmk-rule-builder__rule">
          <span class="ngxsmk-rule-builder__field">{{ rule.field }}</span>
          <span class="ngxsmk-rule-builder__op">{{ rule.operator }}</span>
          <span class="ngxsmk-rule-builder__value">{{ rule.value }}</span>
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-rule-builder' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.8125rem;
      border: 1px solid var(--ngxsmk-color-outline-variant);
      border-radius: var(--ngxsmk-radius-md);
      padding: var(--ngxsmk-space-3);
    }
    .ngxsmk-rule-builder__group {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-rule-builder__operator {
      font-weight: 600;
      font-size: var(--ngxsmk-text-label-md-size);
      text-transform: uppercase;
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-rule-builder__rule {
      display: flex;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-2);
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-rule-builder__field {
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-rule-builder__op {
      color: var(--ngxsmk-color-primary);
    }
    .ngxsmk-rule-builder__value {
      color: var(--ngxsmk-color-on-surface-variant);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkRuleBuilder {
  readonly group = input.required<RuleGroup>();
}
