import type { SchedulerEngine } from '../scheduler-engine';
import type { SchedulerEvent, SchedulerMove } from '../models';
import type { SchedulerPlugin } from './plugin.types';

export interface DragPluginOptions {
  snapDuration?: number;
  onDragStart?: (event: SchedulerEvent) => boolean;
  onDragEnd?: (move: SchedulerMove) => void;
}

export class DragPlugin implements SchedulerPlugin {
  readonly name = 'drag';
  readonly priority = 10;

  private _engine!: SchedulerEngine;
  private _options: DragPluginOptions;
  private _dragging: {
    eventId: string;
    offsetY: number;
    startTop: number;
    originDay: Date;
  } | null = null;

  constructor(options: DragPluginOptions = {}) {
    this._options = options;
  }

  onInit(engine: SchedulerEngine): void {
    this._engine = engine;
  }

  onDestroy(): void {
    this._dragging = null;
  }

  startDrag(eventId: string, pointerY: number, dayEl: HTMLElement, day: Date): boolean {
    const event = this._engine.events().find((e) => e.id === eventId);
    if (!event || event.draggable === false) return false;
    if (this._options.onDragStart && !this._options.onDragStart(event)) return false;

    const hh = this._engine.hourHeight();
    const scrollTop = dayEl.closest('.ngxsmk-sch__scroll')?.scrollTop ?? 0;
    const colTop = dayEl.getBoundingClientRect().top;
    const eventTop = this._engine.eventTop(event);
    const offsetY = pointerY - colTop - eventTop + scrollTop;

    this._dragging = {
      eventId,
      offsetY,
      startTop: eventTop,
      originDay: day,
    };
    return true;
  }

  moveDrag(pointerY: number, dayEl: HTMLElement, day: Date): { top: number; day: Date } | null {
    if (!this._dragging) return null;

    const hh = this._engine.hourHeight();
    const scrollTop = dayEl.closest('.ngxsmk-sch__scroll')?.scrollTop ?? 0;
    const colTop = dayEl.getBoundingClientRect().top;
    const rawY = pointerY - colTop + scrollTop - this._dragging.offsetY;
    const snap = this._options.snapDuration ?? this._engine.viewState().snapDuration;
    const snapPx = (snap / 60) * hh;
    const top = Math.max(0, Math.round(rawY / snapPx) * snapPx);

    return { top, day };
  }

  endDrag(top: number, day: Date): SchedulerMove | null {
    if (!this._dragging) return null;

    const event = this._engine.events().find((e) => e.id === this._dragging!.eventId);
    if (!event) { this._dragging = null; return null; }

    const hh = this._engine.hourHeight();
    const minutes = (top / hh) * 60;
    const durationMs = event.end.getTime() - event.start.getTime();
    const newStart = new Date(day);
    newStart.setHours(0, 0, 0, 0);
    newStart.setMinutes(minutes);
    const newEnd = new Date(newStart.getTime() + durationMs);

    const move: SchedulerMove = {
      event,
      from: event.start,
      to: day,
      newStart,
      newEnd,
      resourceId: event.resourceId,
    };

    this._engine.moveEvent(event.id, newStart, newEnd);
    this._options.onDragEnd?.(move);
    this._dragging = null;
    return move;
  }

  cancelDrag(): void {
    this._dragging = null;
  }

  get dragging(): boolean {
    return this._dragging !== null;
  }

  get draggingEventId(): string | null {
    return this._dragging?.eventId ?? null;
  }
}
