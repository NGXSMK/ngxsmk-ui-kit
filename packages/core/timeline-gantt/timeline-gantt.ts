import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface GanttItem {
  id: string;
  label: string;
  start: number;
  duration: number;
  progress?: number;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-timeline-gantt',
  template: `
    <div class="ngxsmk-timeline-gantt__rows">
      @for (item of items(); track item.id) {
        <div class="ngxsmk-timeline-gantt__row">
          <div class="ngxsmk-timeline-gantt__label">{{ item.label }}</div>
          <div class="ngxsmk-timeline-gantt__bar-track">
            <div
              class="ngxsmk-timeline-gantt__bar"
              [style.margin-left.%]="item.start"
              [style.width.%]="item.duration"
            >
              @if (item.progress !== null && item.progress !== undefined) {
                <div class="ngxsmk-timeline-gantt__progress" [style.width.%]="item.progress"></div>
              }
            </div>
          </div>
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-timeline-gantt' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: 0.8125rem;
    }
    .ngxsmk-timeline-gantt__row {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-2) 0;
      border-bottom: 1px solid var(--ngxsmk-color-outline-variant);
    }
    .ngxsmk-timeline-gantt__label {
      width: 10rem;
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      flex-shrink: 0;
    }
    .ngxsmk-timeline-gantt__bar-track {
      flex: 1;
      height: 1.5rem;
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-sm);
      position: relative;
      overflow: hidden;
    }
    .ngxsmk-timeline-gantt__bar {
      position: absolute;
      height: 100%;
      background: var(--ngxsmk-color-primary);
      border-radius: var(--ngxsmk-radius-sm);
    }
    .ngxsmk-timeline-gantt__progress {
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
      border-radius: var(--ngxsmk-radius-sm);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTimelineGantt {
  readonly items = input.required<GanttItem[]>();
}
