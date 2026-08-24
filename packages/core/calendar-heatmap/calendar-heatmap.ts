import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface HeatmapValue {
  date: string; // YYYY-MM-DD
  count: number;
}

/**
 * GitHub-style contribution calendar heatmap component for visualizing daily metrics.
 *
 * ```html
 * <ngxsmk-calendar-heatmap [values]="activityData" (cellClick)="onDateSelect($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-calendar-heatmap',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngxsmk-calendar-heatmap',
  },
  template: `
    <div class="ngxsmk-heatmap__container" role="grid" aria-label="Contribution calendar">
      <div class="ngxsmk-heatmap__grid">
        @for (day of days(); track day.date) {
          <div
            class="ngxsmk-heatmap__cell"
            [attr.data-level]="getLevel(day.count)"
            [attr.title]="day.date + ': ' + day.count + ' contributions'"
            [attr.aria-label]="
              day.date + ': ' + day.count + ' contributions (level ' + getLevel(day.count) + ')'
            "
            role="gridcell"
            tabindex="0"
            (click)="onCellClick(day)"
            (keydown.enter)="onCellClick(day)"
            (keydown.space)="onCellClick(day)"
          ></div>
        }
      </div>

      <div class="ngxsmk-heatmap__legend">
        <span class="ngxsmk-heatmap__legend-label">Less</span>
        <div class="ngxsmk-heatmap__cell" data-level="0"></div>
        <div class="ngxsmk-heatmap__cell" data-level="1"></div>
        <div class="ngxsmk-heatmap__cell" data-level="2"></div>
        <div class="ngxsmk-heatmap__cell" data-level="3"></div>
        <div class="ngxsmk-heatmap__cell" data-level="4"></div>
        <span class="ngxsmk-heatmap__legend-label">More</span>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
    }

    .ngxsmk-heatmap__container {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2, 0.5rem);
      padding: var(--ngxsmk-space-4, 1rem);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      background: var(--ngxsmk-color-surface);
    }

    .ngxsmk-heatmap__grid {
      display: grid;
      grid-template-rows: repeat(7, 12px);
      grid-auto-flow: column;
      gap: 3px;
    }

    .ngxsmk-heatmap__cell {
      width: 12px;
      height: 12px;
      border-radius: 2px;
      background: var(--ngxsmk-color-surface-variant);
      cursor: pointer;
      transition: transform var(--ngxsmk-duration-fast, 0.1s) ease;
    }

    .ngxsmk-heatmap__cell:hover {
      transform: scale(1.2);
    }

    .ngxsmk-heatmap__cell[data-level='0'] {
      background: var(--ngxsmk-color-surface-variant);
    }
    .ngxsmk-heatmap__cell[data-level='1'] {
      background: var(--ngxsmk-heatmap-level-1);
    }
    .ngxsmk-heatmap__cell[data-level='2'] {
      background: var(--ngxsmk-heatmap-level-2);
    }
    .ngxsmk-heatmap__cell[data-level='3'] {
      background: var(--ngxsmk-heatmap-level-3);
    }
    .ngxsmk-heatmap__cell[data-level='4'] {
      background: var(--ngxsmk-heatmap-level-4);
    }

    .ngxsmk-heatmap__legend {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 4px;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-heatmap__legend-label {
      margin: 0 4px;
    }

    /* Focus ring for keyboard navigation */
    .ngxsmk-heatmap__cell:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring, var(--ngxsmk-color-primary));
      outline-offset: 1px;
    }
  `,
})
export class NgxsmkCalendarHeatmap {
  readonly values = input<HeatmapValue[]>([]);
  readonly startDate = input<string>(''); // Default: 365 days ago

  readonly cellClick = output<HeatmapValue>();

  protected readonly days = computed(() => {
    const valueMap = new Map(this.values().map((v) => [v.date, v.count]));
    const daysArray: HeatmapValue[] = [];
    const end = new Date();
    const start = this.startDate()
      ? new Date(this.startDate())
      : new Date(end.getTime() - 364 * 24 * 60 * 60 * 1000);

    const curr = new Date(start);
    while (curr <= end) {
      const dateStr = curr.toISOString().split('T')[0];
      daysArray.push({
        date: dateStr,
        count: valueMap.get(dateStr) ?? 0,
      });
      curr.setDate(curr.getDate() + 1);
    }

    return daysArray;
  });

  protected getLevel(count: number): number {
    if (count <= 0) return 0;
    if (count <= 2) return 1;
    if (count <= 5) return 2;
    if (count <= 9) return 3;
    return 4;
  }

  protected onCellClick(day: HeatmapValue): void {
    this.cellClick.emit(day);
  }
}
