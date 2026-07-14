import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

export interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
}

@Component({
  standalone: true,
  selector: 'ngxsmk-scheduler',
  template: `
    <div class="ngxsmk-scheduler__header">
      @for (day of days(); track day) {
        <div class="ngxsmk-scheduler__day-header">{{ day | date:'EEE' }}</div>
      }
    </div>
    <div class="ngxsmk-scheduler__grid">
      @for (day of days(); track day) {
        <div class="ngxsmk-scheduler__day">
          @for (event of eventsForDay(day); track event.id) {
            <div class="ngxsmk-scheduler__event">{{ event.title }}</div>
          }
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-scheduler' },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-sans); border: 1px solid var(--ngxsmk-color-outline-variant); border-radius: var(--ngxsmk-radius-lg); overflow: hidden; }
    .ngxsmk-scheduler__header { display: grid; grid-template-columns: repeat(7, 1fr); background: var(--ngxsmk-color-surface-variant); }
    .ngxsmk-scheduler__day-header { padding: var(--ngxsmk-space-2); text-align: center; font-size: 0.75rem; font-weight: 600; color: var(--ngxsmk-color-on-surface); }
    .ngxsmk-scheduler__grid { display: grid; grid-template-columns: repeat(7, 1fr); }
    .ngxsmk-scheduler__day { min-height: 6rem; padding: var(--ngxsmk-space-1); border-right: 1px solid var(--ngxsmk-color-outline-variant); border-bottom: 1px solid var(--ngxsmk-color-outline-variant); }
    .ngxsmk-scheduler__event { padding: var(--ngxsmk-space-1) var(--ngxsmk-space-2); margin-bottom: var(--ngxsmk-space-1); background: var(--ngxsmk-color-primary-container); color: var(--ngxsmk-color-on-primary-container); border-radius: var(--ngxsmk-radius-sm); font-size: 0.6875rem; cursor: pointer; }

    @media (max-width: 768px) {
      :host { overflow-x: auto; -webkit-overflow-scrolling: touch; }
      .ngxsmk-scheduler__header, .ngxsmk-scheduler__grid { grid-template-columns: repeat(7, minmax(4rem, 1fr)); }
    }
  `,
  imports: [DatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkScheduler {
  readonly events = input.required<SchedulerEvent[]>();
  readonly weekStart = input(new Date());

  protected days(): Date[] {
    const start = this.weekStart();
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }

  protected eventsForDay(day: Date): SchedulerEvent[] {
    return this.events().filter(e =>
      e.start.toDateString() === day.toDateString()
    );
  }
}
