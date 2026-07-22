import { Injectable } from '@angular/core';
import type { SchedulerEngine } from '../scheduler-engine';
import type { SchedulerPlugin } from './plugin.types';

@Injectable()
export class PluginHost {
  private _plugins = new Map<string, SchedulerPlugin>();
  private _engine: SchedulerEngine | null = null;

  register(engine: SchedulerEngine, plugins: SchedulerPlugin[]): void {
    this._engine = engine;
    const sorted = [...plugins].sort((a, b) => (a.priority ?? 100) - (b.priority ?? 100));
    for (const plugin of sorted) {
      if (this._plugins.has(plugin.name)) continue;
      this._plugins.set(plugin.name, plugin);
      plugin.onInit?.(engine);
    }
  }

  unregister(name: string): void {
    const plugin = this._plugins.get(name);
    if (plugin) {
      plugin.onDestroy?.();
      this._plugins.delete(name);
    }
  }

  notifyRender(): void {
    for (const plugin of this._plugins.values()) {
      plugin.onRender?.();
    }
  }

  destroy(): void {
    for (const plugin of this._plugins.values()) {
      plugin.onDestroy?.();
    }
    this._plugins.clear();
  }

  has(name: string): boolean {
    return this._plugins.has(name);
  }

  get(name: string): SchedulerPlugin | undefined {
    return this._plugins.get(name);
  }
}
