import type { SchedulerEngine } from '../scheduler-engine';
import type { SchedulerEvent } from '../models';
import type { SchedulerPlugin } from './plugin.types';

export interface TooltipPluginOptions {
  delay?: number;
  showArrow?: boolean;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  maxWidth?: number;
  onShow?: (event: SchedulerEvent) => boolean | void;
  onHide?: (event: SchedulerEvent) => void;
  content?: (event: SchedulerEvent) => string;
}

export interface TooltipState {
  visible: boolean;
  event: SchedulerEvent | null;
  x: number;
  y: number;
  placement: 'top' | 'bottom' | 'left' | 'right';
  content: string;
}

export function createDefaultTooltipState(): TooltipState {
  return {
    visible: false,
    event: null,
    x: 0,
    y: 0,
    placement: 'top',
    content: '',
  };
}

export class TooltipPlugin implements SchedulerPlugin {
  readonly name = 'tooltip';
  readonly priority = 50;

  private _engine!: SchedulerEngine;
  private _options: Required<TooltipPluginOptions>;
  private _timeout: ReturnType<typeof setTimeout> | null = null;
  private _state: TooltipState = createDefaultTooltipState();
  private _listeners: (() => void)[] = [];

  constructor(options: TooltipPluginOptions = {}) {
    this._options = {
      delay: options.delay ?? 400,
      showArrow: options.showArrow ?? true,
      placement: options.placement ?? 'top',
      maxWidth: options.maxWidth ?? 280,
      onShow: options.onShow ?? (() => true),
      onHide:
        options.onHide ??
        (() => {
          /* noop */
        }),
      content: options.content ?? defaultContent,
    };
  }

  onInit(engine: SchedulerEngine): void {
    this._engine = engine;
  }

  onDestroy(): void {
    this.hide();
    this._clearTimeout();
    for (const unlisten of this._listeners) unlisten();
    this._listeners = [];
  }

  show(event: SchedulerEvent, targetEl: HTMLElement): void {
    this._clearTimeout();

    this._timeout = setTimeout(() => {
      if (this._options.onShow(event) === false) return;

      const rect = targetEl.getBoundingClientRect();
      const pos = this._computePosition(rect);

      this._state = {
        visible: true,
        event,
        x: pos.x,
        y: pos.y,
        placement: pos.placement,
        content: this._options.content(event),
      };
    }, this._options.delay);
  }

  hide(): void {
    this._clearTimeout();
    if (this._state.event) {
      this._options.onHide(this._state.event);
    }
    this._state = createDefaultTooltipState();
  }

  updatePosition(targetEl: HTMLElement): void {
    if (!this._state.visible || !this._state.event) return;
    const rect = targetEl.getBoundingClientRect();
    const pos = this._computePosition(rect);
    this._state = { ...this._state, x: pos.x, y: pos.y, placement: pos.placement };
  }

  get state(): TooltipState {
    return this._state;
  }

  get isVisible(): boolean {
    return this._state.visible;
  }

  private _computePosition(rect: DOMRect): {
    x: number;
    y: number;
    placement: 'top' | 'bottom' | 'left' | 'right';
  } {
    const placement = this._options.placement;
    const offset = 8;

    switch (placement) {
      case 'top':
        return { x: rect.left + rect.width / 2, y: rect.top - offset, placement };
      case 'bottom':
        return { x: rect.left + rect.width / 2, y: rect.bottom + offset, placement };
      case 'left':
        return { x: rect.left - offset, y: rect.top + rect.height / 2, placement };
      case 'right':
        return { x: rect.right + offset, y: rect.top + rect.height / 2, placement };
    }
  }

  private _clearTimeout(): void {
    if (this._timeout) {
      clearTimeout(this._timeout);
      this._timeout = null;
    }
  }
}

function defaultContent(event: SchedulerEvent): string {
  const time = `${event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  return `${event.title}\n${time}`;
}
