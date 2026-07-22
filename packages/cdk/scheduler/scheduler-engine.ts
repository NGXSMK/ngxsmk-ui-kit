import { computed, signal, type WritableSignal, type Signal } from '@angular/core';
import type {
  SchedulerEvent,
  SchedulerResource,
  SchedulerMove,
  SchedulerResize,
  ViewState,
  ViewType,
  SelectionState,
  WorkingHours,
  Density,
} from './models';
import type { SchedulerPlugin } from './plugin/plugin.types';
import {
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  addDays,
  diffMinutes,
  isSameDay,
  dateRangeOverlaps,
} from './utils/date-utils';

export interface SchedulerConfig {
  defaultView?: ViewType;
  slotDuration?: number;
  snapDuration?: number;
  firstDayOfWeek?: number;
  locale?: string;
  rtl?: boolean;
  density?: Density;
  showAllDay?: boolean;
  showWeekends?: boolean;
  showCurrentTime?: boolean;
  businessHours?: WorkingHours;
  visibleHours?: [number, number];
  plugins?: SchedulerPlugin[];
  maxEventsPerCell?: number;
}

export interface LifecycleHooks {
  beforeRender: Signal<(state: ViewState) => void>;
  afterRender: Signal<(state: ViewState) => void>;
  beforeCreate: Signal<(event: SchedulerEvent) => boolean>;
  afterCreate: Signal<(event: SchedulerEvent) => void>;
  beforeUpdate: Signal<(event: SchedulerEvent) => boolean>;
  afterUpdate: Signal<(event: SchedulerEvent) => void>;
  beforeDelete: Signal<(event: SchedulerEvent) => boolean>;
  afterDelete: Signal<(event: SchedulerEvent) => void>;
  beforeDrag: Signal<(event: SchedulerEvent) => boolean>;
  afterDrag: Signal<(move: SchedulerMove) => void>;
  beforeResize: Signal<(event: SchedulerEvent) => boolean>;
  afterResize: Signal<(resize: SchedulerResize) => void>;
}

const HOUR_HEIGHT_MAP: Record<Density, number> = {
  compact: 48,
  comfortable: 60,
  dense: 36,
};

function computeRange(
  type: ViewType,
  date: Date,
  firstDayOfWeek: number,
): { start: Date; end: Date } {
  switch (type) {
    case 'timeGridDay':
    case 'dayGridDay':
    case 'agenda':
      return { start: startOfDay(date), end: addDays(startOfDay(date), 1) };
    case 'timeGridWeek':
    case 'dayGridWeek':
      return { start: startOfWeek(date, firstDayOfWeek), end: endOfWeek(date, firstDayOfWeek) };
    case 'timeGridWorkWeek': {
      const weekStart = startOfWeek(date, firstDayOfWeek);
      return { start: addDays(weekStart, 1), end: addDays(weekStart, 5) };
    }
    case 'timeGrid3Day':
      return { start: startOfDay(date), end: addDays(startOfDay(date), 3) };
    case 'dayGridMonth':
      return { start: startOfMonth(date), end: endOfMonth(date) };
    case 'timeline':
      return { start: startOfWeek(date, firstDayOfWeek), end: endOfWeek(date, firstDayOfWeek) };
    default:
      return { start: startOfWeek(date, firstDayOfWeek), end: endOfWeek(date, firstDayOfWeek) };
  }
}

export class SchedulerEngine {
  readonly events: WritableSignal<SchedulerEvent[]>;
  readonly resources: WritableSignal<SchedulerResource[]>;
  readonly viewState: WritableSignal<ViewState>;
  readonly selection: WritableSignal<SelectionState>;
  readonly plugins: WritableSignal<SchedulerPlugin[]>;
  readonly now = signal(new Date());

  readonly hourHeight: Signal<number>;

  readonly visibleEvents: Signal<SchedulerEvent[]>;
  readonly allDayEvents: Signal<SchedulerEvent[]>;
  readonly timedEvents: Signal<SchedulerEvent[]>;
  readonly weekDates: Signal<Date[]>;
  readonly dayNames: Signal<string[]>;
  readonly weekLabel: Signal<string>;

  private _lifecycle: LifecycleHooks;
  private _config: SchedulerConfig;

  constructor(config: SchedulerConfig = {}) {
    this._config = config;
    const firstDay = config.firstDayOfWeek ?? 1;
    const date = config.date ?? new Date();
    const view = config.defaultView ?? 'timeGridWeek';
    const range = computeRange(view, date, firstDay);

    this._lifecycle = {
      beforeRender: signal(() => true),
      afterRender: signal(() => {
        /* noop */
      }),
      beforeCreate: signal(() => true),
      afterCreate: signal(() => {
        /* noop */
      }),
      beforeUpdate: signal(() => true),
      afterUpdate: signal(() => {
        /* noop */
      }),
      beforeDelete: signal(() => true),
      afterDelete: signal(() => {
        /* noop */
      }),
      beforeDrag: signal(() => true),
      afterDrag: signal(() => {
        /* noop */
      }),
      beforeResize: signal(() => true),
      afterResize: signal(() => {
        /* noop */
      }),
    };

    this.events = signal(config.initialEvents ?? []);
    this.resources = signal(config.initialResources ?? []);
    this.plugins = signal(config.plugins ?? []);

    this.viewState = signal<ViewState>({
      type: view,
      date: new Date(date),
      rangeStart: range.start,
      rangeEnd: range.end,
      slotDuration: config.slotDuration ?? 30,
      snapDuration: config.snapDuration ?? 15,
      visibleHours: config.visibleHours ?? [0, 24],
      firstDayOfWeek: firstDay,
      locale: config.locale ?? 'en-US',
      rtl: config.rtl ?? false,
      density: config.density ?? 'comfortable',
      showAllDay: config.showAllDay ?? true,
      showWeekends: config.showWeekends ?? true,
      showCurrentTime: config.showCurrentTime ?? true,
    });

    this.selection = signal<SelectionState>({
      selectedEventIds: new Set(),
      selectedRange: null,
      multiSelect: false,
      focusedCell: null,
    });

    this.hourHeight = computed(() => HOUR_HEIGHT_MAP[this.viewState().density] ?? 60);

    this.visibleEvents = computed(() => {
      const vs = this.viewState();
      const events = this.events();
      return events.filter(
        (e) => !e.allDay && dateRangeOverlaps(e.start, e.end, vs.rangeStart, vs.rangeEnd),
      );
    });

    this.allDayEvents = computed(() => {
      const vs = this.viewState();
      const events = this.events();
      return events.filter(
        (e) => e.allDay && dateRangeOverlaps(e.start, e.end, vs.rangeStart, vs.rangeEnd),
      );
    });

    this.timedEvents = computed(() => this.visibleEvents());

    this.weekDates = computed(() => {
      const vs = this.viewState();
      const start = vs.rangeStart;
      const dates: Date[] = [];
      let current = new Date(start);
      while (current < vs.rangeEnd) {
        dates.push(new Date(current));
        current = addDays(current, 1);
      }
      return dates;
    });

    this.dayNames = computed(() => {
      const locale = this.viewState().locale;
      return Array.from({ length: 7 }, (_, i) => {
        const d = startOfWeek(new Date(), this.viewState().firstDayOfWeek);
        d.setDate(d.getDate() + i);
        return d.toLocaleDateString(locale, { weekday: 'short' });
      });
    });

    this.weekLabel = computed(() => {
      const vs = this.viewState();
      return (
        vs.rangeStart.toLocaleDateString(vs.locale, {
          month: 'short',
          day: 'numeric',
        }) +
        ' – ' +
        vs.rangeEnd.toLocaleDateString(vs.locale, {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
    });
  }

  get lifecycle(): LifecycleHooks {
    return this._lifecycle;
  }

  // ── Navigation ──

  next(): void {
    const vs = this.viewState();
    const date = addDays(vs.date, this._viewSpan(vs.type));
    this._navigateTo(date);
  }

  previous(): void {
    const vs = this.viewState();
    const date = addDays(vs.date, -this._viewSpan(vs.type));
    this._navigateTo(date);
  }

  today(): void {
    this._navigateTo(new Date());
  }

  goto(date: Date): void {
    this._navigateTo(date);
  }

  setView(type: ViewType, date?: Date): void {
    const vs = this.viewState();
    const refDate = date ?? vs.date;
    const range = computeRange(type, refDate, vs.firstDayOfWeek);
    this.viewState.update((s) => ({
      ...s,
      type,
      date: new Date(refDate),
      rangeStart: range.start,
      rangeEnd: range.end,
    }));
  }

  // ── Event Mutations ──

  addEvent(event: SchedulerEvent): void {
    if (!this._runHook(this._lifecycle.beforeCreate, event)) return;
    this.events.update((evts) => [...evts, event]);
    this._lifecycle.afterCreate()(event);
  }

  updateEvent(id: string, patch: Partial<SchedulerEvent>): void {
    const existing = this.events().find((e) => e.id === id);
    if (!existing) return;
    const updated = { ...existing, ...patch };
    if (!this._runHook(this._lifecycle.beforeUpdate, updated)) return;
    this.events.update((evts) => evts.map((e) => (e.id === id ? updated : e)));
    this._lifecycle.afterUpdate()(updated);
  }

  removeEvent(id: string): void {
    const existing = this.events().find((e) => e.id === id);
    if (!existing) return;
    if (!this._runHook(this._lifecycle.beforeDelete, existing)) return;
    this.events.update((evts) => evts.filter((e) => e.id !== id));
    this._lifecycle.afterDelete()(existing);
  }

  moveEvent(id: string, newStart: Date, newEnd: Date, resourceId?: string): void {
    const existing = this.events().find((e) => e.id === id);
    if (!existing) return;

    const move: SchedulerMove = {
      event: existing,
      from: existing.start,
      to: newStart,
      newStart,
      newEnd,
      resourceId,
    };

    if (!this._runHook(this._lifecycle.beforeDrag, existing)) return;

    this.events.update((evts) =>
      evts.map((e) =>
        e.id === id
          ? { ...e, start: newStart, end: newEnd, resourceId: resourceId ?? e.resourceId }
          : e,
      ),
    );

    this._lifecycle.afterDrag()(move);
  }

  resizeEvent(id: string, newEnd: Date): void {
    const existing = this.events().find((e) => e.id === id);
    if (!existing) return;

    const resize: SchedulerResize = {
      event: existing,
      oldEnd: existing.end,
      newEnd,
    };

    if (!this._runHook(this._lifecycle.beforeResize, existing)) return;

    this.events.update((evts) => evts.map((e) => (e.id === id ? { ...e, end: newEnd } : e)));

    this._lifecycle.afterResize()(resize);
  }

  // ── Selection ──

  selectEvent(id: string, multi = false): void {
    this.selection.update((s) => {
      const ids = new Set(multi ? s.selectedEventIds : []);
      if (ids.has(id)) {
        ids.delete(id);
      } else {
        ids.add(id);
      }
      return { ...s, selectedEventIds: ids };
    });
  }

  selectRange(start: Date, end: Date, resourceId?: string): void {
    this.selection.update((s) => ({
      ...s,
      selectedRange: { start, end, resourceId },
    }));
  }

  clearSelection(): void {
    this.selection.update((s) => ({
      ...s,
      selectedEventIds: new Set(),
      selectedRange: null,
    }));
  }

  isEventSelected(id: string): boolean {
    return this.selection().selectedEventIds.has(id);
  }

  // ── Queries ──

  eventsForDay(day: Date): SchedulerEvent[] {
    return this.visibleEvents().filter((e) => isSameDay(e.start, day));
  }

  allDayEventsForDay(day: Date): SchedulerEvent[] {
    return this.allDayEvents().filter(
      (e) => e.start.getTime() <= day.getTime() + 86_400_000 && e.end.getTime() >= day.getTime(),
    );
  }

  getEventsInRange(start: Date, end: Date): SchedulerEvent[] {
    return this.events().filter((e) => dateRangeOverlaps(e.start, e.end, start, end));
  }

  eventTop(event: SchedulerEvent): number {
    const hh = this.hourHeight();
    return ((event.start.getHours() * 60 + event.start.getMinutes()) / 60) * hh;
  }

  eventHeight(event: SchedulerEvent): number {
    const hh = this.hourHeight();
    const durationMin = diffMinutes(event.start, event.end);
    return Math.max((durationMin / 60) * hh, 18);
  }

  currentTimeY(): number {
    const hh = this.hourHeight();
    const now = this.now();
    return ((now.getHours() * 60 + now.getMinutes()) / 60) * hh;
  }

  // ── Private ──

  private _navigateTo(date: Date): void {
    const vs = this.viewState();
    const range = computeRange(vs.type, date, vs.firstDayOfWeek);
    this.viewState.update((s) => ({
      ...s,
      date: new Date(date),
      rangeStart: range.start,
      rangeEnd: range.end,
    }));
  }

  private _viewSpan(type: ViewType): number {
    switch (type) {
      case 'timeGridDay':
      case 'dayGridDay':
      case 'agenda':
        return 1;
      case 'timeGrid3Day':
        return 3;
      case 'timeGridWorkWeek':
      case 'timeGridWeek':
      case 'dayGridWeek':
        return 7;
      case 'dayGridMonth':
        return 30;
      case 'timeline':
        return 7;
      default:
        return 7;
    }
  }

  private _runHook<T>(hook: Signal<(arg: T) => boolean | void>, arg: T): boolean {
    const fn = hook();
    const result = fn(arg);
    return result === false ? false : true;
  }
}

export interface SchedulerConfig {
  defaultView?: ViewType;
  slotDuration?: number;
  snapDuration?: number;
  firstDayOfWeek?: number;
  locale?: string;
  rtl?: boolean;
  density?: Density;
  showAllDay?: boolean;
  showWeekends?: boolean;
  showCurrentTime?: boolean;
  businessHours?: WorkingHours;
  visibleHours?: [number, number];
  plugins?: SchedulerPlugin[];
  maxEventsPerCell?: number;
  date?: Date;
  initialEvents?: SchedulerEvent[];
  initialResources?: SchedulerResource[];
}
