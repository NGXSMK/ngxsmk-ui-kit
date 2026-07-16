import { ChangeDetectionStrategy, Component, input, model, output } from '@angular/core';

export interface SelectorOption {
  value: string;
  label: string;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-selector',
  template: `
    <div class="ngxsmk-selector__chips">
      @for (opt of options(); track opt.value) {
        <button
          type="button"
          class="ngxsmk-selector__chip"
          [attr.data-selected]="isSelected(opt.value) ? '' : null"
          (click)="toggle(opt.value)"
        >
          {{ opt.label }}
        </button>
      }
    </div>
  `,
  host: { class: 'ngxsmk-selector' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-selector__chips {
      display: flex;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-selector__chip {
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-full);
      border: 1px solid var(--ngxsmk-color-outline);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-size: var(--ngxsmk-text-body-sm-size);
      cursor: pointer;
      transition:
        color,
        background-color,
        border-color,
        box-shadow,
        transform,
        opacity var(--ngxsmk-duration-fast);
    }
    .ngxsmk-selector__chip[data-selected] {
      background: var(--ngxsmk-color-primary-container);
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary-container);
    }
    .ngxsmk-selector__chip:hover:not([data-selected]) {
      border-color: var(--ngxsmk-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSelector {
  readonly options = input.required<SelectorOption[]>();
  readonly selected = model<string[]>([]);
  readonly changed = output<string[]>();
  readonly multiple = input(true);

  protected isSelected(v: string): boolean {
    return this.selected().includes(v);
  }

  protected toggle(v: string): void {
    const current = [...this.selected()];
    if (this.isSelected(v)) {
      this.selected.set(current.filter((x) => x !== v));
    } else if (this.multiple()) {
      this.selected.set([...current, v]);
    } else {
      this.selected.set([v]);
    }
    this.changed.emit(this.selected());
  }
}
