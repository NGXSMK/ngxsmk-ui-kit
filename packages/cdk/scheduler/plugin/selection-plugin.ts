import type { SchedulerEngine } from '../scheduler-engine';
import type { SchedulerEvent } from '../models';
import type { SchedulerPlugin } from './plugin.types';

export interface SelectionPluginOptions {
  multiSelect?: boolean;
  rangeSelect?: boolean;
  onSelect?: (events: SchedulerEvent[]) => void;
  onDeselect?: (events: SchedulerEvent[]) => void;
  onRangeSelect?: (start: Date, end: Date) => void;
}

export class SelectionPlugin implements SchedulerPlugin {
  readonly name = 'selection';
  readonly priority = 5;

  private _engine!: SchedulerEngine;
  private _options: SelectionPluginOptions;
  private _rangeSelecting = false;
  private _rangeStart: Date | null = null;

  constructor(options: SelectionPluginOptions = {}) {
    this._options = options;
  }

  onInit(engine: SchedulerEngine): void {
    this._engine = engine;
    if (this._options.multiSelect) {
      this._engine.selection.update((s) => ({ ...s, multiSelect: true }));
    }
  }

  onDestroy(): void {
    this._rangeSelecting = false;
    this._rangeStart = null;
  }

  toggleEvent(eventId: string, modifierKey = false): void {
    const multi = this._options.multiSelect && modifierKey;
    this._engine.selectEvent(eventId, multi);

    const selectedIds = this._engine.selection().selectedEventIds;
    const selectedEvents = this._engine.events().filter((e) => selectedIds.has(e.id));

    if (selectedIds.has(eventId)) {
      this._options.onSelect?.(selectedEvents);
    } else {
      this._options.onDeselect?.(selectedEvents);
    }
  }

  selectOnly(eventId: string): void {
    this._engine.clearSelection();
    this._engine.selectEvent(eventId);
    const event = this._engine.events().find((e) => e.id === eventId);
    if (event) this._options.onSelect?.([event]);
  }

  selectRange(start: Date, end: Date): void {
    this._engine.selectRange(start, end);
    this._options.onRangeSelect?.(start, end);
  }

  startRangeSelect(date: Date): void {
    this._rangeSelecting = true;
    this._rangeStart = date;
  }

  updateRangeSelect(date: Date): void {
    if (!this._rangeSelecting || !this._rangeStart) return;
    const s = this._rangeStart < date ? this._rangeStart : date;
    const e = this._rangeStart < date ? date : this._rangeStart;
    this._engine.selectRange(s, e);
  }

  endRangeSelect(): DateRange | null {
    if (!this._rangeSelecting || !this._rangeStart) return null;
    const range = this._engine.selection().selectedRange;
    this._rangeSelecting = false;
    this._rangeStart = null;
    return range;
  }

  selectAll(): void {
    const all = this._engine.events();
    this._engine.selection.update((s) => ({
      ...s,
      selectedEventIds: new Set(all.map((e) => e.id)),
    }));
  }

  clearSelection(): void {
    this._engine.clearSelection();
  }

  get selectedIds(): Set<string> {
    return this._engine.selection().selectedEventIds;
  }

  get selectedCount(): number {
    return this._engine.selection().selectedEventIds.size;
  }

  get hasSelection(): boolean {
    return this._engine.selection().selectedEventIds.size > 0;
  }

  get isRangeSelecting(): boolean {
    return this._rangeSelecting;
  }
}

interface DateRange {
  start: Date;
  end: Date;
  resourceId?: string;
}
