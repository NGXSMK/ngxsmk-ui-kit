import {
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  DestroyRef,
  ElementRef,
  InjectionToken,
  NgZone,
  OnInit,
  afterNextRender,
  computed,
  effect,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
  type QueryList,
  type TemplateRef,
} from '@angular/core';
import { CommonModule, NgTemplateOutlet } from '@angular/common';

import {
  SchedulerEngine,
  type SchedulerEvent,
  type SchedulerResource,
  type SchedulerMove,
  type SchedulerCreate,
  type SchedulerResize,
  type ViewState,
  type ViewType,
  type SchedulerPlugin,
  type Density,
  type SchedulerConfig,
  formatHour,
  isToday,
  isWeekend,
  isPast,
  addMinutes,
  snapDateToSlot,
  minutesToTime,
  getMonthGrid,
} from '@ngxsmk/cdk/scheduler';

/* ── Template Injection Tokens ── */

export const SCHEDULER_HEADER_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_HEADER_TEMPLATE',
);
export const SCHEDULER_TOOLBAR_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_TOOLBAR_TEMPLATE',
);
export const SCHEDULER_NAV_PREV_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_NAV_PREV_TEMPLATE',
);
export const SCHEDULER_NAV_NEXT_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_NAV_NEXT_TEMPLATE',
);
export const SCHEDULER_TODAY_BTN_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_TODAY_BTN_TEMPLATE',
);
export const SCHEDULER_DAY_HEADER_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_DAY_HEADER_TEMPLATE',
);
export const SCHEDULER_TIME_LABEL_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_TIME_LABEL_TEMPLATE',
);
export const SCHEDULER_EVENT_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_EVENT_TEMPLATE',
);
export const SCHEDULER_CELL_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_CELL_TEMPLATE',
);
export const SCHEDULER_ALL_DAY_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_ALL_DAY_TEMPLATE',
);
export const SCHEDULER_NOW_INDICATOR_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_NOW_INDICATOR_TEMPLATE',
);
export const SCHEDULER_EMPTY_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_EMPTY_TEMPLATE',
);
export const SCHEDULER_RESIZE_HANDLE_TEMPLATE = new InjectionToken<TemplateRef<unknown> | null>(
  'SCHEDULER_RESIZE_HANDLE_TEMPLATE',
);

/* ── DI Config ── */

export const SCHEDULER_CONFIG = new InjectionToken<SchedulerConfig>('SCHEDULER_CONFIG');
export const SCHEDULER_ENGINE = new InjectionToken<SchedulerEngine>('SCHEDULER_ENGINE');

export function provideScheduler(
  config: SchedulerConfig = {},
): { provider: InjectionToken<unknown>; useValue: unknown }[] {
  return [
    { provider: SCHEDULER_CONFIG, useValue: config },
    { provider: SCHEDULER_ENGINE, useValue: new SchedulerEngine(config) },
  ];
}

/* ── Template Context Types ── */

export interface SchedulerEventContext {
  $implicit: SchedulerEvent;
  event: SchedulerEvent;
  selected: boolean;
  view: ViewState;
  dragging: boolean;
  resizing: boolean;
}

export interface SchedulerCellContext {
  $implicit: Date;
  date: Date;
  hour: number;
  minute: number;
  isToday: boolean;
  isWeekend: boolean;
}

export interface SchedulerDayHeaderContext {
  $implicit: Date;
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isPast: boolean;
  dayName: string;
  dayNumber: number;
}

export interface SchedulerTimeLabelContext {
  $implicit: number;
  hour: number;
  formatted: string;
}

export interface SchedulerHeaderContext {
  $implicit: ViewState;
  view: ViewState;
  weekLabel: string;
}

/* ── Constants ── */

const HOURS = Array.from({ length: 24 }, (_, i) => i);

@Component({
  standalone: true,
  selector: 'ngxsmk-scheduler',
  /**
   * Headless scheduler with full template customization.
   *
   * ```html
   * <ngxsmk-scheduler [(events)]="events" [view]="'timeGridWeek'">
   *   <ng-template schedulerEvent let-event>
   *     <div class="my-event">{{ event.title }}</div>
   *   </ng-template>
   * </ngxsmk-scheduler>
   * ```
   */
  template: `
    <!-- ── Header ── -->
    <div class="ngxsmk-sch__header">
      <div class="ngxsmk-sch__nav">
        <button class="ngxsmk-sch__nav-btn" type="button" aria-label="Previous" (click)="onPrev()">
          ‹
        </button>
        <button
          class="ngxsmk-sch__nav-btn ngxsmk-sch__nav-btn--today"
          type="button"
          (click)="onToday()"
        >
          Today
        </button>
        <button class="ngxsmk-sch__nav-btn" type="button" aria-label="Next" (click)="onNext()">
          ›
        </button>
        <span class="ngxsmk-sch__title">{{ engine.weekLabel() }}</span>
      </div>
      <div class="ngxsmk-sch__view-switcher">
        @for (vt of viewTypes; track vt) {
          <button
            class="ngxsmk-sch__view-btn"
            [class.ngxsmk-sch__view-btn--active]="engine.viewState().type === vt"
            type="button"
            (click)="engine.setView(vt)"
          >
            {{ viewLabels[vt] }}
          </button>
        }
      </div>
    </div>

    <!-- ── Time Grid View ── -->
    @if (isTimeGrid()) {
      <!-- Day Headers -->
      <div class="ngxsmk-sch__day-headers">
        <div class="ngxsmk-sch__gutter-spacer"></div>
        @for (day of engine.weekDates(); track day.toISOString()) {
          @if (tplDayHeader) {
            <div class="ngxsmk-sch__day-header">
              <ng-container
                *ngTemplateOutlet="
                  tplDayHeader;
                  context: {
                    $implicit: day,
                    date: day,
                    isToday: isToday(day),
                    isWeekend: isWeekend(day),
                    isPast: isPast(day),
                    dayName: (day | date: 'EEE'),
                    dayNumber: (day | date: 'd'),
                  }
                "
              ></ng-container>
            </div>
          } @else {
            <div
              class="ngxsmk-sch__day-header"
              [class.ngxsmk-sch__day-header--today]="isToday(day)"
              [class.ngxsmk-sch__day-header--weekend]="isWeekend(day)"
            >
              <span class="ngxsmk-sch__day-name">{{ day | date: 'EEE' }}</span>
              <span class="ngxsmk-sch__day-num" [class.ngxsmk-sch__day-num--today]="isToday(day)">{{
                day | date: 'd'
              }}</span>
            </div>
          }
        }
      </div>

      <!-- All-Day Row -->
      @if (engine.viewState().showAllDay && engine.allDayEvents().length > 0) {
        <div class="ngxsmk-sch__allday">
          <div class="ngxsmk-sch__gutter-label ngxsmk-sch__gutter-label--allday">all-day</div>
          @for (day of engine.weekDates(); track day.toISOString()) {
            <div class="ngxsmk-sch__allday-cell">
              @for (event of engine.allDayEventsForDay(day); track event.id) {
                <div
                  class="ngxsmk-sch__event ngxsmk-sch__event--allday"
                  [style.background]="event.color || ''"
                  [style.color]="event.textColor || ''"
                  tabindex="0"
                  (click)="onEventClick(event)"
                  (keydown.enter)="onEventClick(event)"
                  (keydown.space)="onEventClick(event)"
                >
                  {{ event.title }}
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Time Grid -->
      <div class="ngxsmk-sch__scroll" #scrollContainer>
        <div class="ngxsmk-sch__time-grid">
          <div class="ngxsmk-sch__gutter" aria-hidden="true">
            @for (h of hours; track h) {
              @if (tplTimeLabel) {
                <div class="ngxsmk-sch__gutter-label">
                  <ng-container
                    *ngTemplateOutlet="
                      tplTimeLabel;
                      context: {
                        $implicit: h,
                        hour: h,
                        formatted: formatHour(h, engine.viewState().locale),
                      }
                    "
                  ></ng-container>
                </div>
              } @else {
                <div class="ngxsmk-sch__gutter-label">
                  {{ formatHour(h, engine.viewState().locale) }}
                </div>
              }
            }
          </div>
          @for (day of engine.weekDates(); track day.toISOString()) {
            <div
              class="ngxsmk-sch__day-col"
              [class.ngxsmk-sch__day-col--today]="isToday(day)"
              [class.ngxsmk-sch__day-col--weekend]="isWeekend(day)"
              [class.ngxsmk-sch__day-col--over]="dragOverDay() === day.toISOString()"
              [attr.data-day]="day.toISOString()"
              (pointerdown)="onColPointerDown(day, $event)"
            >
              @for (h of hours; track h) {
                <div
                  class="ngxsmk-sch__hour-line"
                  [style.top]="h * engine.hourHeight() + 'px'"
                ></div>
              }
              <div class="ngxsmk-sch__day-spacer" aria-hidden="true"></div>
              @for (event of engine.eventsForDay(day); track event.id) {
                @if (tplEvent) {
                  <div
                    class="ngxsmk-sch__event ngxsmk-sch__event--timed"
                    [class.ngxsmk-sch__event--selected]="engine.isEventSelected(event.id)"
                    [class.ngxsmk-sch__event--dragging]="draggingEventId() === event.id"
                    [class.ngxsmk-sch__event--ghost]="isGhost(event)"
                    [style.top]="eventStyleTop(event) + 'px'"
                    [style.height]="engine.eventHeight(event) + 'px'"
                    [style.z-index]="draggingEventId() === event.id ? 10 : 1"
                    [style.opacity]="isGhost(event) ? '0.35' : ''"
                    (pointerdown)="onEventPointerDown(day, event, $event)"
                    (click)="onEventClick(event)"
                    (dblclick)="onEventDoubleClick(event)"
                    (contextmenu)="onEventContextMenu(event, $event)"
                    role="button"
                    [attr.aria-label]="
                      event.title +
                      ', ' +
                      (event.start | date: 'HH:mm') +
                      '–' +
                      (event.end | date: 'HH:mm')
                    "
                    tabindex="0"
                  >
                    <ng-container
                      *ngTemplateOutlet="
                        tplEvent;
                        context: {
                          $implicit: event,
                          event,
                          selected: engine.isEventSelected(event.id),
                          view: engine.viewState(),
                          dragging: draggingEventId() === event.id,
                        }
                      "
                    ></ng-container>
                  </div>
                } @else {
                  <div
                    class="ngxsmk-sch__event ngxsmk-sch__event--timed"
                    [class.ngxsmk-sch__event--selected]="engine.isEventSelected(event.id)"
                    [class.ngxsmk-sch__event--dragging]="draggingEventId() === event.id"
                    [class.ngxsmk-sch__event--ghost]="isGhost(event)"
                    [style.top]="eventStyleTop(event) + 'px'"
                    [style.height]="engine.eventHeight(event) + 'px'"
                    [style.background]="event.color || ''"
                    [style.color]="event.textColor || ''"
                    [style.z-index]="draggingEventId() === event.id ? 10 : 1"
                    [style.opacity]="isGhost(event) ? '0.35' : ''"
                    (pointerdown)="onEventPointerDown(day, event, $event)"
                    (click)="onEventClick(event)"
                    (dblclick)="onEventDoubleClick(event)"
                    (contextmenu)="onEventContextMenu(event, $event)"
                    role="button"
                    [attr.aria-label]="
                      event.title +
                      ', ' +
                      (event.start | date: 'HH:mm') +
                      '–' +
                      (event.end | date: 'HH:mm')
                    "
                    tabindex="0"
                  >
                    <span class="ngxsmk-sch__event-time">
                      {{ event.start | date: 'HH:mm' }} – {{ event.end | date: 'HH:mm' }}
                    </span>
                    <span class="ngxsmk-sch__event-title">{{ event.title }}</span>
                  </div>
                }
              }
              @if (isToday(day) && engine.viewState().showCurrentTime) {
                @if (tplNowIndicator) {
                  <div class="ngxsmk-sch__now-line" [style.top]="engine.currentTimeY() + 'px'">
                    <ng-container
                      *ngTemplateOutlet="
                        tplNowIndicator;
                        context: {
                          $implicit: engine.now(),
                          time: engine.now(),
                          y: engine.currentTimeY(),
                        }
                      "
                    ></ng-container>
                  </div>
                } @else {
                  <div
                    class="ngxsmk-sch__now-line"
                    [style.top]="engine.currentTimeY() + 'px'"
                    aria-label="Current time"
                  >
                    <div class="ngxsmk-sch__now-dot"></div>
                  </div>
                }
              }
              @if (creating() && creating()!.day.toISOString() === day.toISOString()) {
                <div
                  class="ngxsmk-sch__create-preview"
                  [style.top]="creating()!.top + 'px'"
                  [style.height]="creating()!.height + 'px'"
                ></div>
              }
            </div>
          }
        </div>
      </div>
    }

    <!-- ── Month Grid View ── -->
    @if (isMonthGrid()) {
      <div class="ngxsmk-sch__month">
        <div class="ngxsmk-sch__month-header">
          @for (dayName of ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; track dayName) {
            <div class="ngxsmk-sch__month-header-cell">{{ dayName }}</div>
          }
        </div>
        <div class="ngxsmk-sch__month-grid">
          @for (week of monthGrid(); track $index) {
            @for (day of week; track day.toISOString()) {
              <div
                class="ngxsmk-sch__month-cell"
                [class.ngxsmk-sch__month-cell--today]="isToday(day)"
                [class.ngxsmk-sch__month-cell--weekend]="isWeekend(day)"
                [class.ngxsmk-sch__month-cell--other]="
                  day.getMonth() !== engine.viewState().date.getMonth()
                "
              >
                <span
                  class="ngxsmk-sch__month-day-num"
                  [class.ngxsmk-sch__month-day-num--today]="isToday(day)"
                >
                  {{ day | date: 'd' }}
                </span>
                <div class="ngxsmk-sch__month-events">
                  @for (event of engine.eventsForDay(day); track event.id; let i = $index) {
                    @if (i < 3) {
                      <div
                        class="ngxsmk-sch__month-event"
                        [style.background]="event.color || ''"
                        [style.color]="event.textColor || ''"
                        tabindex="0"
                        (click)="onEventClick(event)"
                        (keydown.enter)="onEventClick(event)"
                        (keydown.space)="onEventClick(event)"
                      >
                        <span class="ngxsmk-sch__month-event-time">{{
                          event.start | date: 'HH:mm'
                        }}</span>
                        {{ event.title }}
                      </div>
                    }
                  }
                  @if (engine.eventsForDay(day).length > 3) {
                    <div class="ngxsmk-sch__month-more">
                      +{{ engine.eventsForDay(day).length - 3 }} more
                    </div>
                  }
                </div>
              </div>
            }
          }
        </div>
      </div>
    }

    <!-- ── Agenda View ── -->
    @if (isAgenda()) {
      <div class="ngxsmk-sch__agenda">
        @for (event of agendaEvents(); track event.id) {
          <div
            class="ngxsmk-sch__agenda-item"
            [class.ngxsmk-sch__agenda-item--selected]="engine.isEventSelected(event.id)"
            (click)="onEventClick(event)"
            (dblclick)="onEventDoubleClick(event)"
            role="button"
            tabindex="0"
          >
            <div class="ngxsmk-sch__agenda-date">
              <span class="ngxsmk-sch__agenda-day-num">{{ event.start | date: 'd' }}</span>
              <span class="ngxsmk-sch__agenda-day-name">{{ event.start | date: 'EEE' }}</span>
            </div>
            <div
              class="ngxsmk-sch__agenda-color"
              [style.background]="event.color || 'var(--_primary)'"
            ></div>
            <div class="ngxsmk-sch__agenda-details">
              <div class="ngxsmk-sch__agenda-title">{{ event.title }}</div>
              <div class="ngxsmk-sch__agenda-time">
                {{ event.start | date: 'HH:mm' }} – {{ event.end | date: 'HH:mm' }}
              </div>
            </div>
          </div>
        }
        @if (agendaEvents().length === 0) {
          <div class="ngxsmk-sch__agenda-empty">No events in this range</div>
        }
      </div>
    }

    <!-- ── Timeline View ── -->
    @if (isTimeline()) {
      <div class="ngxsmk-sch__timeline">
        @for (day of engine.weekDates(); track day.toISOString()) {
          <div
            class="ngxsmk-sch__timeline-day"
            [class.ngxsmk-sch__timeline-day--today]="isToday(day)"
          >
            <div class="ngxsmk-sch__timeline-day-label">
              <span class="ngxsmk-sch__timeline-day-name">{{ day | date: 'EEE' }}</span>
              <span
                class="ngxsmk-sch__timeline-day-num"
                [class.ngxsmk-sch__timeline-day-num--today]="isToday(day)"
                >{{ day | date: 'd' }}</span
              >
            </div>
            <div class="ngxsmk-sch__timeline-events">
              @for (event of engine.eventsForDay(day); track event.id) {
                <div
                  class="ngxsmk-sch__timeline-event"
                  [style.background]="event.color || ''"
                  [style.color]="event.textColor || ''"
                  [class.ngxsmk-sch__timeline-event--selected]="engine.isEventSelected(event.id)"
                  (click)="onEventClick(event)"
                  (dblclick)="onEventDoubleClick(event)"
                  role="button"
                  tabindex="0"
                >
                  <span class="ngxsmk-sch__timeline-event-time">
                    {{ event.start | date: 'HH:mm' }} – {{ event.end | date: 'HH:mm' }}
                  </span>
                  <span class="ngxsmk-sch__timeline-event-title">{{ event.title }}</span>
                </div>
              }
              @if (engine.eventsForDay(day).length === 0) {
                <div class="ngxsmk-sch__timeline-empty">—</div>
              }
            </div>
          </div>
        }
      </div>
    }
  `,
  host: { class: 'ngxsmk-scheduler' },
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        font-family: var(--scheduler-font, var(--ngxsmk-font-sans, system-ui, sans-serif));
        font-size: var(--scheduler-font-size, var(--ngxsmk-text-body-sm-size, 0.75rem));
        background: var(--scheduler-bg, var(--ngxsmk-color-surface));
        color: var(--scheduler-text, var(--ngxsmk-color-on-surface));
        border: 1px solid var(--scheduler-border, var(--ngxsmk-color-outline-variant));
        border-radius: var(--scheduler-radius, var(--ngxsmk-radius-lg, 0.75rem));
        overflow: hidden;
        height: 100%;
        --_hour-h: var(--scheduler-hour-height, 60px);
        --_gutter-w: var(--scheduler-time-col-width, 56px);
        --_primary: var(--scheduler-primary, var(--ngxsmk-color-primary));
        --_primary-container: var(
          --scheduler-primary-container,
          var(--ngxsmk-color-primary-container)
        );
        --_on-primary-container: var(
          --scheduler-on-primary-container,
          var(--ngxsmk-color-on-primary-container)
        );
        --_border: var(--scheduler-border, var(--ngxsmk-color-outline-variant));
        --_border-light: var(
          --scheduler-border-light,
          color-mix(in srgb, var(--_border) 50%, transparent)
        );
        --_surface: var(--scheduler-bg, var(--ngxsmk-color-surface));
        --_text: var(--scheduler-text, var(--ngxsmk-color-on-surface));
        --_text-sec: var(--scheduler-text-secondary, var(--ngxsmk-color-on-surface-variant));
        --_today-bg: var(
          --scheduler-today-bg,
          color-mix(in srgb, var(--_primary) 3%, var(--_surface))
        );
        --_weekend-bg: var(
          --scheduler-weekend-bg,
          color-mix(in srgb, var(--_text-sec) 3%, var(--_surface))
        );
        --_error: var(--scheduler-now-color, var(--ngxsmk-color-error));
        --_radius-sm: var(--scheduler-event-radius, var(--ngxsmk-radius-sm, 0.25rem));
        --_shadow-sm: var(
          --scheduler-event-shadow,
          var(--ngxsmk-shadow-sm, 0 0 0 1px rgb(0 0 0 / 0.03), 0 1px 1px rgb(0 0 0 / 0.07))
        );
        --_shadow-md: var(
          --scheduler-event-shadow-hover,
          var(
            --ngxsmk-shadow-md,
            0 0 0 1px rgb(0 0 0 / 0.03),
            0 1px 2px rgb(0 0 0 / 0.09),
            0 4px 16px rgb(0 0 0 / 0.09)
          )
        );
        --_fast: var(
          --scheduler-transition-fast,
          var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out, cubic-bezier(0, 0, 0.2, 1))
        );
      }

      /* ── Nav ── */
      .ngxsmk-sch__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(
          --scheduler-header-padding,
          var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem)
        );
        background: var(--scheduler-header-bg, var(--_surface));
        border-bottom: 1px solid var(--_border);
        gap: var(--ngxsmk-space-3, 0.75rem);
        flex-wrap: wrap;
        min-height: var(--scheduler-header-height, 48px);
      }
      .ngxsmk-sch__nav {
        display: flex;
        align-items: center;
        gap: var(--ngxsmk-space-2, 0.5rem);
      }
      .ngxsmk-sch__nav-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        height: 1.75rem;
        padding: 0 var(--ngxsmk-space-2, 0.5rem);
        border: 1px solid var(--_border);
        border-radius: var(--ngxsmk-radius-sm, 0.25rem);
        background: var(--_surface);
        color: var(--_text);
        font-size: var(--ngxsmk-text-label-md-size, 0.75rem);
        font-family: inherit;
        cursor: pointer;
        transition:
          background var(--_fast),
          border-color var(--_fast),
          box-shadow var(--_fast);
        user-select: none;
        white-space: nowrap;
      }
      .ngxsmk-sch__nav-btn:hover {
        background: color-mix(in srgb, var(--_primary) 8%, var(--_surface));
        border-color: var(--_primary);
        box-shadow: var(
          --ngxsmk-shadow-sm,
          0 0 0 1px rgb(0 0 0 / 0.03),
          0 1px 1px rgb(0 0 0 / 0.07)
        );
      }
      .ngxsmk-sch__nav-btn:active {
        box-shadow: none;
      }
      .ngxsmk-sch__nav-btn--today {
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
      }
      .ngxsmk-sch__title {
        font-size: var(--ngxsmk-text-label-lg-size, 0.875rem);
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        color: var(--_text);
        margin-left: var(--ngxsmk-space-2, 0.5rem);
        user-select: none;
      }

      /* ── View switcher ── */
      .ngxsmk-sch__view-switcher {
        display: flex;
        gap: 2px;
        background: color-mix(in srgb, var(--_text-sec) 8%, var(--_surface));
        border-radius: var(--ngxsmk-radius-sm, 0.25rem);
        padding: 2px;
      }
      .ngxsmk-sch__view-btn {
        padding: 3px var(--ngxsmk-space-2, 0.5rem);
        border: none;
        border-radius: calc(var(--ngxsmk-radius-sm, 0.25rem) - 1px);
        background: transparent;
        color: var(--_text-sec);
        font-size: var(--ngxsmk-text-label-sm-size, 0.6875rem);
        font-family: inherit;
        font-weight: var(--ngxsmk-font-weight-medium, 500);
        cursor: pointer;
        transition:
          background var(--_fast),
          color var(--_fast);
        user-select: none;
        white-space: nowrap;
      }
      .ngxsmk-sch__view-btn:hover {
        color: var(--_text);
      }
      .ngxsmk-sch__view-btn--active {
        background: var(--_surface);
        color: var(--_text);
        box-shadow: var(
          --ngxsmk-shadow-sm,
          0 0 0 1px rgb(0 0 0 / 0.03),
          0 1px 1px rgb(0 0 0 / 0.07)
        );
      }

      /* ── Day headers ── */
      .ngxsmk-sch__day-headers {
        display: grid;
        grid-template-columns: var(--_gutter-w) repeat(7, minmax(0, 1fr));
        background: var(--_surface);
        border-bottom: 1px solid var(--_border);
      }
      .ngxsmk-sch__gutter-spacer {
        border-inline-end: 1px solid var(--_border);
      }
      .ngxsmk-sch__day-header {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: var(--ngxsmk-space-0-5, 0.125rem);
        padding: var(--ngxsmk-space-1-5, 0.375rem) 0;
        border-inline-end: 1px solid var(--_border-light);
      }
      .ngxsmk-sch__day-name {
        font-size: var(--ngxsmk-text-label-xs-size, var(--ngxsmk-text-label-sm-size, 0.6875rem));
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--_text-sec);
        line-height: var(--ngxsmk-leading-none, 1);
      }
      .ngxsmk-sch__day-num {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.625rem;
        height: 1.625rem;
        border-radius: 50%;
        font-size: var(--ngxsmk-text-body-md-size, 0.875rem);
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        color: var(--_text);
        line-height: var(--ngxsmk-leading-none, 1);
        transition:
          background var(--_fast),
          color var(--_fast);
      }
      .ngxsmk-sch__day-num--today {
        background: var(--_primary);
        color: var(--scheduler-on-primary, var(--ngxsmk-color-on-primary));
      }
      .ngxsmk-sch__day-header--weekend .ngxsmk-sch__day-name {
        opacity: 0.6;
      }

      /* ── All-day row ── */
      .ngxsmk-sch__allday {
        display: grid;
        grid-template-columns: var(--_gutter-w) repeat(7, minmax(0, 1fr));
        border-bottom: 1px solid var(--_border);
        min-height: var(--scheduler-allday-height, 1.75rem);
        background: color-mix(in srgb, var(--_text-sec) 4%, var(--_surface));
      }
      .ngxsmk-sch__gutter-label {
        display: flex;
        align-items: flex-start;
        justify-content: flex-end;
        padding: var(--ngxsmk-space-1, 0.25rem) var(--ngxsmk-space-1, 0.25rem) 0 0;
        font-size: var(--ngxsmk-text-label-xs-size, var(--ngxsmk-text-label-sm-size, 0.6875rem));
        color: var(--_text-sec);
        border-inline-end: 1px solid var(--_border);
        user-select: none;
        line-height: var(--ngxsmk-leading-none, 1);
      }
      .ngxsmk-sch__gutter-label--allday {
        font-size: 9px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        justify-content: center;
        padding: 0;
        align-items: center;
        opacity: 0.6;
      }
      .ngxsmk-sch__allday-cell {
        display: flex;
        flex-direction: column;
        gap: 1px;
        padding: 2px 3px;
        border-inline-end: 1px solid var(--_border-light);
      }
      .ngxsmk-sch__event--allday {
        width: 100%;
        padding: 1px var(--ngxsmk-space-2, 0.5rem);
        background: var(--_primary-container);
        color: var(--_on-primary-container);
        border-radius: var(--_radius-sm);
        font-size: var(--ngxsmk-text-label-xs-size, var(--ngxsmk-text-label-sm-size, 0.6875rem));
        font-weight: var(--ngxsmk-font-weight-medium, 500);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        user-select: none;
        transition: box-shadow var(--_fast);
      }
      .ngxsmk-sch__event--allday:hover {
        box-shadow: var(--_shadow-sm);
      }

      /* ── Scroll container ── */
      .ngxsmk-sch__scroll {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .ngxsmk-sch__scroll::-webkit-scrollbar {
        width: 6px;
      }
      .ngxsmk-sch__scroll::-webkit-scrollbar-track {
        background: transparent;
      }
      .ngxsmk-sch__scroll::-webkit-scrollbar-thumb {
        background: color-mix(in srgb, var(--_text-sec) 25%, transparent);
        border-radius: 3px;
      }
      .ngxsmk-sch__scroll::-webkit-scrollbar-thumb:hover {
        background: color-mix(in srgb, var(--_text-sec) 45%, transparent);
      }

      /* ── Time grid ── */
      .ngxsmk-sch__time-grid {
        display: grid;
        grid-template-columns: var(--_gutter-w) repeat(7, minmax(0, 1fr));
        position: relative;
      }
      .ngxsmk-sch__gutter {
        position: relative;
        border-inline-end: 1px solid var(--_border);
      }
      .ngxsmk-sch__gutter .ngxsmk-sch__gutter-label {
        height: var(--_hour-h);
        padding-top: 0;
        align-items: flex-start;
      }
      .ngxsmk-sch__day-col {
        position: relative;
        border-inline-end: 1px solid var(--_border-light);
        transition: background var(--_fast);
      }
      .ngxsmk-sch__day-col--today {
        background: var(--_today-bg);
      }
      .ngxsmk-sch__day-col--weekend {
        background: var(--_weekend-bg);
      }
      .ngxsmk-sch__day-col--today.ngxsmk-sch__day-col--weekend {
        background: var(--_today-bg);
      }
      .ngxsmk-sch__day-spacer {
        height: calc(24 * var(--_hour-h));
      }
      .ngxsmk-sch__hour-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 0;
        border-top: 1px solid var(--_border-light);
        pointer-events: none;
      }

      /* ── Drop target ── */
      .ngxsmk-sch__day-col--over {
        background: color-mix(in srgb, var(--_primary) 5%, var(--_surface));
        box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--_primary) 20%, transparent);
      }

      /* ── Timed events ── */
      .ngxsmk-sch__event--timed {
        position: absolute;
        left: 3px;
        right: 3px;
        display: flex;
        flex-direction: column;
        gap: 1px;
        padding: var(--scheduler-event-padding, 3px 6px);
        background: var(--_primary-container);
        color: var(--_on-primary-container);
        border-radius: var(--_radius-sm);
        border-left: var(--scheduler-event-border-left, 3px solid var(--_primary));
        font-size: var(--ngxsmk-text-label-xs-size, var(--ngxsmk-text-label-sm-size, 0.6875rem));
        overflow: hidden;
        cursor: grab;
        user-select: none;
        box-shadow: var(--_shadow-sm);
        transition:
          box-shadow var(--_fast),
          opacity var(--_fast);
        touch-action: none;
      }
      .ngxsmk-sch__event--timed:active {
        cursor: grabbing;
      }
      .ngxsmk-sch__event--timed:hover {
        box-shadow: var(--_shadow-md);
        z-index: 2 !important;
      }
      .ngxsmk-sch__event--selected {
        outline: 2px solid var(--_primary);
        outline-offset: -1px;
      }
      .ngxsmk-sch__event--dragging {
        cursor: grabbing;
      }
      .ngxsmk-sch__event--ghost {
        opacity: 0.35;
        pointer-events: none;
      }
      .ngxsmk-sch__event-time {
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        font-size: 10px;
        line-height: var(--ngxsmk-leading-none, 1);
        opacity: 0.85;
      }
      .ngxsmk-sch__event-title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: var(--ngxsmk-font-weight-medium, 500);
        line-height: 1.2;
      }

      /* ── Now line ── */
      .ngxsmk-sch__now-line {
        position: absolute;
        left: 0;
        right: 0;
        height: 2px;
        background: var(--_error);
        z-index: 5;
        pointer-events: none;
      }
      .ngxsmk-sch__now-dot {
        position: absolute;
        left: -4px;
        top: -3px;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: var(--_error);
        animation: ngxsmk-sch-pulse 2s ease-in-out infinite;
      }
      @keyframes ngxsmk-sch-pulse {
        0%,
        100% {
          opacity: 1;
          transform: scale(1);
        }
        50% {
          opacity: 0.5;
          transform: scale(1.4);
        }
      }

      /* ── Create preview ── */
      .ngxsmk-sch__create-preview {
        position: absolute;
        left: 3px;
        right: 3px;
        background: color-mix(in srgb, var(--_primary) 12%, var(--_surface));
        border: 1.5px dashed color-mix(in srgb, var(--_primary) 50%, transparent);
        border-radius: var(--_radius-sm);
        z-index: 2;
        pointer-events: none;
      }

      /* ── Month Grid ── */
      .ngxsmk-sch__month {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }
      .ngxsmk-sch__month-header {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        border-bottom: 1px solid var(--_border);
        background: var(--_surface);
      }
      .ngxsmk-sch__month-header-cell {
        padding: var(--ngxsmk-space-2, 0.5rem);
        text-align: center;
        font-size: var(--ngxsmk-text-label-xs-size, var(--ngxsmk-text-label-sm-size, 0.6875rem));
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: var(--_text-sec);
      }
      .ngxsmk-sch__month-grid {
        display: grid;
        grid-template-columns: repeat(7, 1fr);
        grid-auto-rows: 1fr;
        flex: 1;
        overflow-y: auto;
      }
      .ngxsmk-sch__month-cell {
        border-inline-end: 1px solid var(--_border-light);
        border-bottom: 1px solid var(--_border-light);
        padding: var(--ngxsmk-space-1, 0.25rem);
        min-height: var(--scheduler-month-cell-height, 5rem);
        display: flex;
        flex-direction: column;
      }
      .ngxsmk-sch__month-cell--today {
        background: var(--_today-bg);
      }
      .ngxsmk-sch__month-cell--weekend {
        background: var(--_weekend-bg);
      }
      .ngxsmk-sch__month-cell--other {
        opacity: 0.4;
      }
      .ngxsmk-sch__month-day-num {
        font-size: var(--ngxsmk-text-label-sm-size, 0.75rem);
        font-weight: var(--ngxsmk-font-weight-medium, 500);
        color: var(--_text-sec);
        margin-bottom: 2px;
      }
      .ngxsmk-sch__month-day-num--today {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.5rem;
        height: 1.5rem;
        border-radius: 50%;
        background: var(--_primary);
        color: var(--scheduler-on-primary, var(--ngxsmk-color-on-primary));
      }
      .ngxsmk-sch__month-events {
        display: flex;
        flex-direction: column;
        gap: 1px;
        flex: 1;
        overflow: hidden;
      }
      .ngxsmk-sch__month-event {
        padding: 1px 4px;
        border-radius: var(--_radius-sm);
        font-size: 10px;
        font-weight: var(--ngxsmk-font-weight-medium, 500);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        cursor: pointer;
        background: var(--_primary-container);
        color: var(--_on-primary-container);
        line-height: 1.4;
      }
      .ngxsmk-sch__month-event-time {
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        margin-right: 2px;
      }
      .ngxsmk-sch__month-more {
        font-size: 10px;
        color: var(--_text-sec);
        padding: 1px 4px;
        cursor: pointer;
        font-weight: var(--ngxsmk-font-weight-medium, 500);
      }

      /* ── Agenda View ── */
      .ngxsmk-sch__agenda {
        flex: 1;
        overflow-y: auto;
        padding: var(--ngxsmk-space-2, 0.5rem);
      }
      .ngxsmk-sch__agenda-item {
        display: flex;
        align-items: center;
        gap: var(--ngxsmk-space-3, 0.75rem);
        padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
        border-radius: var(--_radius-sm);
        cursor: pointer;
        transition: background var(--_fast);
      }
      .ngxsmk-sch__agenda-item:hover {
        background: color-mix(in srgb, var(--_text-sec) 6%, var(--_surface));
      }
      .ngxsmk-sch__agenda-item--selected {
        outline: 2px solid var(--_primary);
        outline-offset: -2px;
      }
      .ngxsmk-sch__agenda-date {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 2.5rem;
      }
      .ngxsmk-sch__agenda-day-num {
        font-size: var(--ngxsmk-text-body-lg-size, 1.125rem);
        font-weight: var(--ngxsmk-font-weight-bold, 700);
        color: var(--_text);
        line-height: var(--ngxsmk-leading-none, 1);
      }
      .ngxsmk-sch__agenda-day-name {
        font-size: var(--ngxsmk-text-label-xs-size, 0.6875rem);
        color: var(--_text-sec);
        text-transform: uppercase;
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
      }
      .ngxsmk-sch__agenda-color {
        width: 4px;
        align-self: stretch;
        border-radius: 2px;
        flex-shrink: 0;
      }
      .ngxsmk-sch__agenda-details {
        flex: 1;
        min-width: 0;
      }
      .ngxsmk-sch__agenda-title {
        font-size: var(--ngxsmk-text-body-md-size, 0.875rem);
        font-weight: var(--ngxsmk-font-weight-medium, 500);
        color: var(--_text);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .ngxsmk-sch__agenda-time {
        font-size: var(--ngxsmk-text-label-sm-size, 0.75rem);
        color: var(--_text-sec);
      }
      .ngxsmk-sch__agenda-empty {
        text-align: center;
        padding: var(--ngxsmk-space-8, 2rem);
        color: var(--_text-sec);
        font-size: var(--ngxsmk-text-body-md-size, 0.875rem);
      }

      /* ── Timeline View ── */
      .ngxsmk-sch__timeline {
        flex: 1;
        overflow-y: auto;
        display: flex;
        flex-direction: column;
      }
      .ngxsmk-sch__timeline-day {
        display: flex;
        border-bottom: 1px solid var(--_border-light);
      }
      .ngxsmk-sch__timeline-day--today {
        background: var(--_today-bg);
      }
      .ngxsmk-sch__timeline-day-label {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-width: var(--_gutter-w);
        padding: var(--ngxsmk-space-2, 0.5rem);
        border-inline-end: 1px solid var(--_border);
      }
      .ngxsmk-sch__timeline-day-name {
        font-size: var(--ngxsmk-text-label-xs-size, 0.6875rem);
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        text-transform: uppercase;
        color: var(--_text-sec);
      }
      .ngxsmk-sch__timeline-day-num {
        font-size: var(--ngxsmk-text-body-md-size, 0.875rem);
        font-weight: var(--ngxsmk-font-weight-bold, 700);
        color: var(--_text);
      }
      .ngxsmk-sch__timeline-day-num--today {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background: var(--_primary);
        color: var(--scheduler-on-primary, var(--ngxsmk-color-on-primary));
      }
      .ngxsmk-sch__timeline-events {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: var(--ngxsmk-space-1, 0.25rem);
        padding: var(--ngxsmk-space-2, 0.5rem);
      }
      .ngxsmk-sch__timeline-event {
        display: flex;
        align-items: center;
        gap: var(--ngxsmk-space-2, 0.5rem);
        padding: var(--ngxsmk-space-1-5, 0.375rem) var(--ngxsmk-space-2, 0.5rem);
        background: var(--_primary-container);
        color: var(--_on-primary-container);
        border-radius: var(--_radius-sm);
        border-left: 3px solid var(--_primary);
        cursor: pointer;
        transition: box-shadow var(--_fast);
      }
      .ngxsmk-sch__timeline-event:hover {
        box-shadow: var(--_shadow-sm);
      }
      .ngxsmk-sch__timeline-event--selected {
        outline: 2px solid var(--_primary);
        outline-offset: -1px;
      }
      .ngxsmk-sch__timeline-event-time {
        font-size: var(--ngxsmk-text-label-xs-size, 0.6875rem);
        font-weight: var(--ngxsmk-font-weight-semibold, 600);
        opacity: 0.85;
        white-space: nowrap;
      }
      .ngxsmk-sch__timeline-event-title {
        font-size: var(--ngxsmk-text-body-sm-size, 0.8125rem);
        font-weight: var(--ngxsmk-font-weight-medium, 500);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .ngxsmk-sch__timeline-empty {
        color: var(--_text-sec);
        font-size: var(--ngxsmk-text-label-sm-size, 0.75rem);
        opacity: 0.5;
      }

      /* ── Dark Mode ── */
      :host-context(.dark) {
        --_primary: var(--scheduler-primary, var(--ngxsmk-color-primary));
        --_primary-container: var(
          --scheduler-primary-container,
          var(--ngxsmk-color-primary-container)
        );
        --_on-primary-container: var(
          --scheduler-on-primary-container,
          var(--ngxsmk-color-on-primary-container)
        );
        --_border: var(--scheduler-border, var(--ngxsmk-color-outline-variant));
        --_surface: var(--scheduler-bg, var(--ngxsmk-color-surface));
        --_text: var(--scheduler-text, var(--ngxsmk-color-on-surface));
        --_text-sec: var(--scheduler-text-secondary, var(--ngxsmk-color-on-surface-variant));
        --_today-bg: var(
          --scheduler-today-bg,
          color-mix(in srgb, var(--_primary) 8%, var(--_surface))
        );
        --_weekend-bg: var(
          --scheduler-weekend-bg,
          color-mix(in srgb, var(--_text-sec) 6%, var(--_surface))
        );
        --_error: var(--scheduler-now-color, var(--ngxsmk-color-error));
        --_shadow-sm: var(
          --scheduler-event-shadow,
          0 0 0 1px rgb(0 0 0 / 0.2),
          0 1px 2px rgb(0 0 0 / 0.3)
        );
        --_shadow-md: var(
          --scheduler-event-shadow-hover,
          0 0 0 1px rgb(0 0 0 / 0.2),
          0 2px 4px rgb(0 0 0 / 0.4)
        );
      }
      :host-context(.dark) .ngxsmk-sch__nav-btn {
        border-color: var(--_border);
        background: var(--_surface);
        color: var(--_text);
      }
      :host-context(.dark) .ngxsmk-sch__nav-btn:hover {
        background: color-mix(in srgb, var(--_primary) 12%, var(--_surface));
        border-color: var(--_primary);
      }
      :host-context(.dark) .ngxsmk-sch__view-btn {
        color: var(--_text-sec);
      }
      :host-context(.dark) .ngxsmk-sch__view-btn--active {
        background: var(--_surface);
        color: var(--_text);
      }
      :host-context(.dark) .ngxsmk-sch__month-event {
        background: var(--_primary-container);
        color: var(--_on-primary-container);
      }
      :host-context(.dark) .ngxsmk-sch__timeline-event {
        background: var(--_primary-container);
        color: var(--_on-primary-container);
      }

      /* ── Responsive ── */
      @media (max-width: 768px) {
        :host {
          --_gutter-w: 40px;
          --_hour-h: 48px;
        }
        .ngxsmk-sch__time-grid,
        .ngxsmk-sch__day-headers,
        .ngxsmk-sch__allday {
          grid-template-columns: var(--_gutter-w) repeat(7, minmax(4.5rem, 1fr));
        }
        .ngxsmk-sch__scroll {
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }
        .ngxsmk-sch__view-switcher {
          display: none;
        }
      }
    `,
  ],
  imports: [CommonModule, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkScheduler implements OnInit {
  readonly events = model.required<SchedulerEvent[]>();
  readonly view = input<ViewType>('timeGridWeek');
  readonly date = input<Date>(new Date());
  readonly resources = input<SchedulerResource[]>([]);
  readonly slotDuration = input(30);
  readonly snapDuration = input(15);
  readonly visibleHours = input<[number, number]>([0, 24]);
  readonly firstDayOfWeek = input(1);
  readonly locale = input('en-US');
  readonly rtl = input(false);
  readonly density = input<Density>('comfortable');
  readonly showAllDay = input(true);
  readonly showWeekends = input(true);
  readonly showCurrentTime = input(true);
  readonly editable = input(true);
  readonly selectable = input(true);
  readonly draggable = input(true);
  readonly resizable = input(true);
  readonly plugins = input<SchedulerPlugin[]>([]);

  readonly eventClick = output<SchedulerEvent>();
  readonly eventDoubleClick = output<SchedulerEvent>();
  readonly eventContextMenu = output<{
    event: SchedulerEvent;
    position: { x: number; y: number };
  }>();
  readonly eventDrop = output<SchedulerMove>();
  readonly eventResize = output<SchedulerResize>();
  readonly eventCreate = output<SchedulerCreate>();
  readonly viewChange = output<{ view: ViewType; start: Date; end: Date }>();
  readonly dateChange = output<Date>();
  readonly prevWeek = output<void>();
  readonly nextWeek = output<void>();
  readonly todayClick = output<void>();

  @ContentChildren('schedulerEvent') eventTemplates?: QueryList<TemplateRef<unknown>>;

  readonly scrollContainer = viewChild<ElementRef<HTMLElement>>('scrollContainer');

  protected readonly hours = HOURS;
  protected readonly engine: SchedulerEngine;
  protected readonly draggingEventId = signal<string | null>(null);
  protected readonly dragOverDay = signal<string | null>(null);
  protected readonly dragOffsetY = signal(0);
  protected readonly dragCurrentTop = signal<number | null>(null);
  protected readonly dragCurrentDay = signal<Date | null>(null);
  protected readonly dragEvent = signal<SchedulerEvent | null>(null);
  protected readonly monthGrid = computed(() => {
    const vs = this.engine.viewState();
    return getMonthGrid(vs.date, vs.firstDayOfWeek);
  });
  protected readonly agendaEvents = computed(() => {
    const vs = this.engine.viewState();
    const events = this.engine.events();
    const start = vs.rangeStart;
    const end = vs.rangeEnd;
    return events
      .filter((e) => e.start < end && e.end > start)
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  });

  // Template slots — injected via DI, null means use default rendering
  protected readonly tplEvent = inject(SCHEDULER_EVENT_TEMPLATE, { optional: true });
  protected readonly tplHeader = inject(SCHEDULER_HEADER_TEMPLATE, { optional: true });
  protected readonly tplDayHeader = inject(SCHEDULER_DAY_HEADER_TEMPLATE, { optional: true });
  protected readonly tplTimeLabel = inject(SCHEDULER_TIME_LABEL_TEMPLATE, { optional: true });
  protected readonly tplCell = inject(SCHEDULER_CELL_TEMPLATE, { optional: true });
  protected readonly tplAllDay = inject(SCHEDULER_ALL_DAY_TEMPLATE, { optional: true });
  protected readonly tplNowIndicator = inject(SCHEDULER_NOW_INDICATOR_TEMPLATE, { optional: true });

  protected readonly creating = signal<{
    day: Date;
    startY: number;
    top: number;
    height: number;
  } | null>(null);
  private _pointerStartDay: Date | null = null;
  private _pointerStartY = 0;
  private _nowInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly viewTypes: ViewType[] = [
    'timeGridDay',
    'timeGrid3Day',
    'timeGridWeek',
    'timeGridWorkWeek',
    'dayGridMonth',
    'agenda',
  ];
  protected readonly viewLabels: Record<string, string> = {
    timeGridDay: 'Day',
    timeGrid3Day: '3 Day',
    timeGridWeek: 'Week',
    timeGridWorkWeek: 'Work Week',
    dayGridMonth: 'Month',
    agenda: 'Agenda',
    dayGridDay: 'Day',
    dayGridWeek: 'Week',
    timeline: 'Timeline',
  };

  constructor() {
    const config = inject(SCHEDULER_CONFIG, { optional: true }) ?? {};
    const existingEngine = inject(SCHEDULER_ENGINE, { optional: true });
    this.engine =
      existingEngine ??
      new SchedulerEngine({
        ...config,
        defaultView: this.view(),
        date: this.date(),
        slotDuration: this.slotDuration(),
        snapDuration: this.snapDuration(),
        visibleHours: this.visibleHours(),
        firstDayOfWeek: this.firstDayOfWeek(),
        locale: this.locale(),
        rtl: this.rtl(),
        density: this.density(),
        showAllDay: this.showAllDay(),
        showWeekends: this.showWeekends(),
        showCurrentTime: this.showCurrentTime(),
        plugins: this.plugins(),
      });

    const destroyRef = inject(DestroyRef);
    const ngZone = inject(NgZone);

    afterNextRender(() => {
      ngZone.runOutsideAngular(() => {
        this._nowInterval = setInterval(() => this.engine.now.set(new Date()), 60_000);
        this.scrollToWorkingHour();
      });
    });

    effect(() => {
      const engineEvents = this.engine.events();
      this.events.set(engineEvents);
    });

    destroyRef.onDestroy(() => {
      if (this._nowInterval) clearInterval(this._nowInterval);
    });
  }

  ngOnInit(): void {
    this.engine.events.set(this.events());
  }

  protected onPrev(): void {
    this.engine.previous();
    this.prevWeek.emit();
  }

  protected onNext(): void {
    this.engine.next();
    this.nextWeek.emit();
  }

  protected onToday(): void {
    this.engine.today();
    this.todayClick.emit();
  }

  protected onEventClick(event: SchedulerEvent): void {
    if (this.selectable()) {
      this.engine.selectEvent(event.id);
    }
    this.eventClick.emit(event);
  }

  protected onEventDoubleClick(event: SchedulerEvent): void {
    this.eventDoubleClick.emit(event);
  }

  protected onEventContextMenu(event: SchedulerEvent, e: MouseEvent): void {
    e.preventDefault();
    this.eventContextMenu.emit({ event, position: { x: e.clientX, y: e.clientY } });
  }

  /* ── Pointer-based Drag (vertical + horizontal) ── */

  protected eventStyleTop(event: SchedulerEvent): number {
    if (this.draggingEventId() === event.id && this.dragCurrentTop() !== null) {
      return this.dragCurrentTop()!;
    }
    return this.engine.eventTop(event);
  }

  protected isGhost(event: SchedulerEvent): boolean {
    return this.draggingEventId() === event.id && this.dragCurrentTop() !== null;
  }

  protected onEventPointerDown(day: Date, event: SchedulerEvent, pe: PointerEvent): void {
    if (!this.draggable() || event.draggable === false) return;
    if (pe.button !== 0) return;
    pe.preventDefault();
    pe.stopPropagation();

    const target = pe.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    this.draggingEventId.set(event.id);
    this.dragEvent.set(event);
    this.dragOffsetY.set(pe.clientY - rect.top);
    this.dragCurrentTop.set(this.engine.eventTop(event));
    this.dragCurrentDay.set(day);
    this.dragOverDay.set(day.toISOString());

    this._onDocPointerMove = this._handleDocDragMove.bind(this);
    this._onDocPointerUp = this._handleDocDragEnd.bind(this);
    document.addEventListener('pointermove', this._onDocPointerMove);
    document.addEventListener('pointerup', this._onDocPointerUp);
  }

  protected onColPointerDown(day: Date, pe: PointerEvent): void {
    if (pe.button !== 0 || !this.editable()) return;
    const target = pe.target as HTMLElement;
    if (target.closest('.ngxsmk-sch__event')) return;

    const hh = this.engine.hourHeight();
    const scrollEl = target.closest('.ngxsmk-sch__scroll');
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
    const rect = target.getBoundingClientRect();
    const y = pe.clientY - rect.top + scrollTop;
    const snapPx = (this.engine.viewState().snapDuration / 60) * hh;
    const snappedY = Math.floor(y / snapPx) * snapPx;

    this._pointerStartDay = day;
    this._pointerStartY = snappedY;
    this.creating.set({ day, startY: snappedY, top: snappedY, height: snapPx });

    this._onDocPointerMove = this._handleDocCreateMove.bind(this);
    this._onDocPointerUp = this._handleDocCreateEnd.bind(this);
    document.addEventListener('pointermove', this._onDocPointerMove);
    document.addEventListener('pointerup', this._onDocPointerUp);
  }

  private _onDocPointerMove: ((e: PointerEvent) => void) | null = null;
  private _onDocPointerUp: ((e: PointerEvent) => void) | null = null;

  private _hitTestDayCol(clientX: number): { day: Date; el: HTMLElement } | null {
    const grid = document.querySelector('.ngxsmk-sch__time-grid');
    if (!grid) return null;
    const cols = grid.querySelectorAll<HTMLElement>('.ngxsmk-sch__day-col');
    for (const col of cols) {
      const r = col.getBoundingClientRect();
      if (clientX >= r.left && clientX <= r.right) {
        const dayStr = col.getAttribute('data-day');
        if (dayStr) return { day: new Date(dayStr), el: col };
      }
    }
    return null;
  }

  private _handleDocDragMove = (pe: PointerEvent): void => {
    const dragId = this.draggingEventId();
    if (!dragId) return;

    const hit = this._hitTestDayCol(pe.clientX);
    if (!hit) return;

    const hh = this.engine.hourHeight();
    const snapPx = (this.engine.viewState().snapDuration / 60) * hh;
    const scrollEl = hit.el.closest('.ngxsmk-sch__scroll');
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
    const colRect = hit.el.getBoundingClientRect();
    const y = pe.clientY - colRect.top + scrollTop;
    const rawTop = y - this.dragOffsetY();
    const snappedTop = Math.max(0, Math.round(rawTop / snapPx) * snapPx);

    this.dragCurrentTop.set(snappedTop);
    this.dragCurrentDay.set(hit.day);
    this.dragOverDay.set(hit.day.toISOString());
  };

  private _handleDocDragEnd = (_pe: PointerEvent): void => {
    document.removeEventListener('pointermove', this._onDocPointerMove!);
    document.removeEventListener('pointerup', this._onDocPointerUp!);
    this._onDocPointerMove = null;
    this._onDocPointerUp = null;

    const dragId = this.draggingEventId();
    const dragEvt = this.dragEvent();
    const currentTop = this.dragCurrentTop();
    const currentDay = this.dragCurrentDay();

    if (dragId && dragEvt && currentTop !== null && currentDay) {
      const hh = this.engine.hourHeight();
      const snap = this.engine.viewState().snapDuration;
      const startMinutes = (currentTop / hh) * 60;
      const durationMs = dragEvt.end.getTime() - dragEvt.start.getTime();
      const durationMin = durationMs / 60_000;
      const snappedStart = Math.round(startMinutes / snap) * snap;
      const newStart = new Date(currentDay);
      newStart.setHours(0, 0, 0, 0);
      newStart.setMinutes(snappedStart);
      const newEnd = new Date(newStart.getTime() + durationMin * 60_000);

      this.engine.moveEvent(dragId, newStart, newEnd);
      this.eventDrop.emit({
        event: dragEvt,
        from: dragEvt.start,
        to: currentDay,
        newStart,
        newEnd,
      });
    }

    this.draggingEventId.set(null);
    this.dragEvent.set(null);
    this.dragCurrentTop.set(null);
    this.dragCurrentDay.set(null);
    this.dragOverDay.set(null);
  };

  private _handleDocCreateMove = (pe: PointerEvent): void => {
    if (!this._pointerStartDay) return;

    const target = document.elementFromPoint(pe.clientX, pe.clientY);
    const col = target?.closest<HTMLElement>('.ngxsmk-sch__day-col');
    if (!col) return;

    const dayStr = col.getAttribute('data-day');
    const day = dayStr ? new Date(dayStr) : this._pointerStartDay;
    if (day.toISOString() !== this._pointerStartDay!.toISOString()) return;

    const hh = this.engine.hourHeight();
    const snapPx = (this.engine.viewState().snapDuration / 60) * hh;
    const scrollEl = col.closest('.ngxsmk-sch__scroll');
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
    const rect = col.getBoundingClientRect();
    const y = pe.clientY - rect.top + scrollTop;
    const snappedY = Math.floor(y / snapPx) * snapPx;
    const top = Math.min(this._pointerStartY, snappedY);
    const bottom = Math.max(this._pointerStartY, snappedY) + snapPx;
    const height = Math.max(bottom - top, snapPx);
    this.creating.update((c) => (c ? { ...c, top, height } : null));
  };

  private _handleDocCreateEnd = (pe: PointerEvent): void => {
    document.removeEventListener('pointermove', this._onDocPointerMove!);
    document.removeEventListener('pointerup', this._onDocPointerUp!);
    this._onDocPointerMove = null;
    this._onDocPointerUp = null;

    const create = this.creating();
    this.creating.set(null);
    this._pointerStartDay = null;
    if (!create) return;

    const hh = this.engine.hourHeight();
    const snap = this.engine.viewState().snapDuration;
    const snapPx = (snap / 60) * hh;
    const target = document.elementFromPoint(pe.clientX, pe.clientY);
    const col = target?.closest<HTMLElement>('.ngxsmk-sch__day-col');
    if (!col) return;

    const dayStr = col.getAttribute('data-day');
    const day = dayStr ? new Date(dayStr) : create.day;
    const scrollEl = col.closest('.ngxsmk-sch__scroll');
    const scrollTop = scrollEl ? scrollEl.scrollTop : 0;
    const rect = col.getBoundingClientRect();
    const rawY = pe.clientY - rect.top + scrollTop;
    const snappedY = Math.floor(rawY / snapPx) * snapPx;
    const startSlot = Math.min(create.startY, snappedY);
    const endSlot = Math.max(create.startY, snappedY) + snapPx;
    const startMinutes = (startSlot / hh) * 60;
    const endMinutes = (endSlot / hh) * 60;
    const newStart = snapDateToSlot(minutesToTime(day, startMinutes), snap);
    let newEnd = snapDateToSlot(minutesToTime(day, endMinutes), snap);
    if (newEnd <= newStart) newEnd = addMinutes(newStart, snap);

    const id = `evt_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const newEvent: SchedulerEvent = { id, title: 'New event', start: newStart, end: newEnd };
    this.engine.addEvent(newEvent);
    this.eventCreate.emit({ event: newEvent, day, start: newStart, end: newEnd });
  };

  protected isToday(date: Date): boolean {
    return isToday(date);
  }

  protected isWeekend(date: Date): boolean {
    return isWeekend(date);
  }

  protected isPast(date: Date): boolean {
    return isPast(date);
  }

  protected formatHour(h: number, locale?: string): string {
    return formatHour(h, locale);
  }

  protected isTimeGrid(): boolean {
    return this.engine.viewState().type.startsWith('timeGrid');
  }

  protected isMonthGrid(): boolean {
    return this.engine.viewState().type === 'dayGridMonth';
  }

  protected isAgenda(): boolean {
    return this.engine.viewState().type === 'agenda';
  }

  protected isTimeline(): boolean {
    return this.engine.viewState().type === 'timeline';
  }

  /* ── Scroll ── */

  private scrollToWorkingHour(): void {
    const container = this.scrollContainer()?.nativeElement;
    if (!container) return;
    const hour = new Date().getHours();
    const scrollTo = Math.max(0, (hour - 2) * this.engine.hourHeight());
    requestAnimationFrame(() => container.scrollTo({ top: scrollTo, behavior: 'smooth' }));
  }
}
