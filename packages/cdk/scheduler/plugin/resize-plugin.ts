import type { SchedulerEngine } from '../scheduler-engine';
import type { SchedulerEvent, SchedulerResize } from '../models';
import type { SchedulerPlugin } from './plugin.types';

export interface ResizePluginOptions {
  snapDuration?: number;
  minDuration?: number;
  onResizeStart?: (event: SchedulerEvent) => boolean;
  onResizeEnd?: (resize: SchedulerResize) => void;
}

export class ResizePlugin implements SchedulerPlugin {
  readonly name = 'resize';
  readonly priority = 11;

  private _engine!: SchedulerEngine;
  private _options: ResizePluginOptions;
  private _resizing: {
    eventId: string;
    originEnd: Date;
  } | null = null;

  constructor(options: ResizePluginOptions = {}) {
    this._options = options;
  }

  onInit(engine: SchedulerEngine): void {
    this._engine = engine;
  }

  onDestroy(): void {
    this._resizing = null;
  }

  startResize(eventId: string): boolean {
    const event = this._engine.events().find((e) => e.id === eventId);
    if (!event || event.resizable === false) return false;
    if (this._options.onResizeStart && !this._options.onResizeStart(event)) return false;

    this._resizing = { eventId, originEnd: new Date(event.end) };
    return true;
  }

  moveResize(pointerY: number, dayEl: HTMLElement): Date | null {
    if (!this._resizing) return null;

    const event = this._engine.events().find((e) => e.id === this._resizing!.eventId);
    if (!event) return null;

    const hh = this._engine.hourHeight();
    const scrollTop = dayEl.closest('.ngxsmk-sch__scroll')?.scrollTop ?? 0;
    const colTop = dayEl.getBoundingClientRect().top;
    const rawY = pointerY - colTop + scrollTop;
    const snap = this._options.snapDuration ?? this._engine.viewState().snapDuration;
    const snapPx = (snap / 60) * hh;
    const y = Math.max(this._engine.eventTop(event) + snapPx, Math.round(rawY / snapPx) * snapPx);

    const minutes = (y / hh) * 60;
    const newEnd = new Date(event.start);
    newEnd.setHours(0, 0, 0, 0);
    newEnd.setMinutes(minutes);

    const minDur = this._options.minDuration ?? 15;
    if (newEnd.getTime() - event.start.getTime() < minDur * 60_000) {
      newEnd.setTime(event.start.getTime() + minDur * 60_000);
    }

    return newEnd;
  }

  endResize(): SchedulerResize | null {
    if (!this._resizing) return null;

    const event = this._engine.events().find((e) => e.id === this._resizing!.eventId);
    if (!event) { this._resizing = null; return null; }

    const resize: SchedulerResize = {
      event,
      oldEnd: this._resizing.originEnd,
      newEnd: event.end,
    };

    this._engine.resizeEvent(event.id, event.end);
    this._options.onResizeEnd?.(resize);
    this._resizing = null;
    return resize;
  }

  cancelResize(): void {
    this._resizing = null;
  }

  get resizing(): boolean {
    return this._resizing !== null;
  }

  get resizingEventId(): string | null {
    return this._resizing?.eventId ?? null;
  }
}
