import type { SchedulerEngine } from '../scheduler-engine';
import type { SchedulerPlugin } from './plugin.types';
import { addDays, addMinutes } from '../utils/date-utils';

export interface KeyboardPluginOptions {
  onKeyAction?: (action: string) => boolean | void;
}

export class KeyboardPlugin implements SchedulerPlugin {
  readonly name = 'keyboard';
  readonly priority = 20;

  private _engine!: SchedulerEngine;
  private _options: KeyboardPluginOptions;
  private _handler: ((e: KeyboardEvent) => void) | null = null;

  constructor(options: KeyboardPluginOptions = {}) {
    this._options = options;
  }

  onInit(engine: SchedulerEngine): void {
    this._engine = engine;
    if (typeof document !== 'undefined') {
      this._handler = (e: KeyboardEvent) => this._onKeyDown(e);
      document.addEventListener('keydown', this._handler);
    }
  }

  onDestroy(): void {
    if (this._handler) {
      document.removeEventListener('keydown', this._handler);
      this._handler = null;
    }
  }

  private _onKeyDown(e: KeyboardEvent): void {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)
      return;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        this._moveFocus(1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        this._moveFocus(-1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        this._moveFocusTime(-30);
        break;
      case 'ArrowDown':
        e.preventDefault();
        this._moveFocusTime(30);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        this._activateFocused();
        break;
      case 'Delete':
      case 'Backspace':
        e.preventDefault();
        this._deleteSelected();
        break;
      case 'Escape':
        e.preventDefault();
        this._deselect();
        this._options.onKeyAction?.('escape');
        break;
      case 'a':
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          this._selectAll();
        }
        break;
      case 't':
        if (!e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault();
          this._goToday();
        }
        break;
    }
  }

  private _moveFocus(deltaDays: number): void {
    const sel = this._engine.selection();
    const focused = sel.focusedCell;

    if (focused) {
      const newDate = addDays(focused.date, deltaDays);
      this._engine.selection.update((s) => ({
        ...s,
        focusedCell: { date: newDate, resourceId: focused.resourceId },
      }));
    } else {
      const vs = this._engine.viewState();
      this._engine.selection.update((s) => ({
        ...s,
        focusedCell: { date: vs.date },
      }));
    }
    this._options.onKeyAction?.('moveFocus');
  }

  private _moveFocusTime(deltaMinutes: number): void {
    const sel = this._engine.selection();
    const focused = sel.focusedCell;

    if (focused) {
      const newDate = addMinutes(focused.date, deltaMinutes);
      this._engine.selection.update((s) => ({
        ...s,
        focusedCell: { date: newDate, resourceId: focused.resourceId },
      }));
    } else {
      this._moveFocus(0);
    }
    this._options.onKeyAction?.('moveFocusTime');
  }

  private _activateFocused(): void {
    const sel = this._engine.selection();
    const ids = sel.selectedEventIds;
    if (ids.size === 1) {
      const eventId = Array.from(ids)[0];
      const event = this._engine.events().find((e) => e.id === eventId);
      if (event) this._options.onKeyAction?.('activate');
    } else {
      const focused = sel.focusedCell;
      if (focused) {
        const dayEvents = this._engine.eventsForDay(focused.date);
        if (dayEvents.length > 0) {
          this._engine.selectEvent(dayEvents[0].id);
        }
      }
    }
  }

  private _deleteSelected(): void {
    if (this._options.onKeyAction?.('delete') === false) return;
    const ids = this._engine.selection().selectedEventIds;
    for (const id of ids) {
      this._engine.removeEvent(id);
    }
    this._engine.clearSelection();
  }

  private _deselect(): void {
    this._engine.clearSelection();
  }

  private _selectAll(): void {
    const events = this._engine.events();
    this._engine.selection.update((s) => ({
      ...s,
      selectedEventIds: new Set(events.map((e) => e.id)),
    }));
    this._options.onKeyAction?.('selectAll');
  }

  private _goToday(): void {
    this._engine.today();
    this._options.onKeyAction?.('today');
  }
}
