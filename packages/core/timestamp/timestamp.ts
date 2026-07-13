import { ChangeDetectionStrategy, Component, input, computed } from '@angular/core';

@Component({
  selector: 'ngxsmk-timestamp',
  template: `<time [attr.datetime]="datetime()">{{ display() }}</time>`,
  host: { class: 'ngxsmk-timestamp' },
  styles: `
    :host { display: inline; font-family: var(--ngxsmk-font-sans); font-size: var(--ngxsmk-text-body-sm-size); color: var(--ngxsmk-color-on-surface-variant); white-space: nowrap; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTimestamp {
  readonly date = input.required<Date | string | number>();
  readonly format = input<'relative' | 'absolute' | 'smart'>('smart');

  protected readonly datetime = computed(() => new Date(this.date()).toISOString());

  protected readonly display = computed(() => {
    const d = new Date(this.date());
    const now = Date.now();
    const diff = now - d.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (this.format() === 'absolute') return d.toLocaleString();
    if (this.format() === 'relative') {
      if (mins < 1) return 'just now';
      if (mins < 60) return `${mins}m ago`;
      if (hours < 24) return `${hours}h ago`;
      if (days < 7) return `${days}d ago`;
      return d.toLocaleDateString();
    }
    // smart
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'yesterday';
    if (days < 7) return `${days}d ago`;
    return d.toLocaleDateString();
  });
}
