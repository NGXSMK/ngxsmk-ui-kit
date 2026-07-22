import type { SpreadsheetPlugin } from './plugin.types';
import type { SpreadsheetEngine } from '../spreadsheet-engine';

/**
 * PluginHost manages the lifecycle of all registered plugins.
 * Plugins are executed in priority order (lower = first).
 */
export class PluginHost {
  private _plugins: SpreadsheetPlugin[] = [];
  private _engine: SpreadsheetEngine | null = null;

  /** Register one or more plugins. */
  register(...plugins: SpreadsheetPlugin[]): void {
    this._plugins.push(...plugins);
    this._plugins.sort((a, b) => (a.priority ?? 0) - (b.priority ?? 0));
  }

  /** Unregister plugins by name. */
  unregister(...names: string[]): void {
    const nameSet = new Set(names);
    const toRemove = this._plugins.filter((p) => nameSet.has(p.name));
    toRemove.forEach((p) => p.onDestroy?.());
    this._plugins = this._plugins.filter((p) => !nameSet.has(p.name));
  }

  /** Initialize all plugins with the engine. Called once during engine construction. */
  init(engine: SpreadsheetEngine): void {
    this._engine = engine;
    for (const plugin of this._plugins) {
      plugin.onInit?.(engine);
    }
  }

  /** Destroy all plugins. */
  destroy(): void {
    for (const plugin of this._plugins) {
      plugin.onDestroy?.();
    }
    this._plugins = [];
    this._engine = null;
  }

  /** Run onBeforeRender on all plugins. Returns false if any plugin cancels. */
  beforeRender(): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeRender?.() === false) return false;
    }
    return true;
  }

  /** Run onAfterRender on all plugins. */
  afterRender(): void {
    for (const plugin of this._plugins) {
      plugin.onAfterRender?.();
    }
  }

  /** Run onBeforeEdit on all plugins. Returns false if any cancels. */
  beforeEdit(rowIndex: number, colId: string): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeEdit?.(rowIndex, colId) === false) return false;
    }
    return true;
  }

  /** Run onAfterEdit on all plugins. */
  afterEdit(rowIndex: number, colId: string, oldValue: unknown, newValue: unknown): void {
    for (const plugin of this._plugins) {
      plugin.onAfterEdit?.(rowIndex, colId, oldValue, newValue);
    }
  }

  /** Run onBeforeSort on all plugins. Returns false if any cancels. */
  beforeSort(colId: string, direction: 'asc' | 'desc' | null): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeSort?.(colId, direction) === false) return false;
    }
    return true;
  }

  /** Run onAfterSort on all plugins. */
  afterSort(): void {
    for (const plugin of this._plugins) {
      plugin.onAfterSort?.();
    }
  }

  /** Run onBeforeFilter on all plugins. Returns false if any cancels. */
  beforeFilter(): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeFilter?.() === false) return false;
    }
    return true;
  }

  /** Run onAfterFilter on all plugins. */
  afterFilter(): void {
    for (const plugin of this._plugins) {
      plugin.onAfterFilter?.();
    }
  }

  /** Run onBeforeInsertRows on all plugins. Returns false if any cancels. */
  beforeInsertRows(count: number, atIndex: number): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeInsertRows?.(count, atIndex) === false) return false;
    }
    return true;
  }

  /** Run onAfterInsertRows on all plugins. */
  afterInsertRows(indices: number[]): void {
    for (const plugin of this._plugins) {
      plugin.onAfterInsertRows?.(indices);
    }
  }

  /** Run onBeforeDeleteRows on all plugins. Returns false if any cancels. */
  beforeDeleteRows(indices: number[]): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeDeleteRows?.(indices) === false) return false;
    }
    return true;
  }

  /** Run onAfterDeleteRows on all plugins. */
  afterDeleteRows(indices: number[]): void {
    for (const plugin of this._plugins) {
      plugin.onAfterDeleteRows?.(indices);
    }
  }

  /** Run onBeforeInsertColumns on all plugins. Returns false if any cancels. */
  beforeInsertColumns(count: number, atIndex: number): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeInsertColumns?.(count, atIndex) === false) return false;
    }
    return true;
  }

  /** Run onAfterInsertColumns on all plugins. */
  afterInsertColumns(indices: number[]): void {
    for (const plugin of this._plugins) {
      plugin.onAfterInsertColumns?.(indices);
    }
  }

  /** Run onBeforeDeleteColumns on all plugins. Returns false if any cancels. */
  beforeDeleteColumns(indices: number[]): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeDeleteColumns?.(indices) === false) return false;
    }
    return true;
  }

  /** Run onAfterDeleteColumns on all plugins. */
  afterDeleteColumns(indices: number[]): void {
    for (const plugin of this._plugins) {
      plugin.onAfterDeleteColumns?.(indices);
    }
  }

  /** Run onBeforePaste on all plugins. Returns false if any cancels. */
  beforePaste(data: string, startCell: { row: number; col: number }): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforePaste?.(data, startCell) === false) return false;
    }
    return true;
  }

  /** Run onAfterPaste on all plugins. */
  afterPaste(): void {
    for (const plugin of this._plugins) {
      plugin.onAfterPaste?.();
    }
  }

  /** Run onBeforeCopy on all plugins. Returns false if any cancels. */
  beforeCopy(): boolean {
    for (const plugin of this._plugins) {
      if (plugin.onBeforeCopy?.() === false) return false;
    }
    return true;
  }

  /** Run onAfterCopy on all plugins. */
  afterCopy(): void {
    for (const plugin of this._plugins) {
      plugin.onAfterCopy?.();
    }
  }

  /** Fire a custom event to all plugins. */
  fireEvent(eventType: string, payload: unknown): void {
    for (const plugin of this._plugins) {
      plugin.onEvent?.(eventType, payload);
    }
  }

  /** Get all registered plugins. */
  get plugins(): ReadonlyArray<SpreadsheetPlugin> {
    return this._plugins;
  }
}
