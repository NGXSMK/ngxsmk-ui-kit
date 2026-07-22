import type { SpreadsheetEngine } from '../spreadsheet-engine';

/** Plugin lifecycle interface. Every spreadsheet plugin must implement this. */
export interface SpreadsheetPlugin {
  /** Unique plugin name for identification. */
  readonly name: string;
  /** Execution priority – lower runs first. Default 0. */
  readonly priority?: number;
  /** Called when the engine initializes. */
  onInit?(engine: SpreadsheetEngine): void;
  /** Called when the engine is destroyed. */
  onDestroy?(): void;
  /** Called before each render cycle. Return false to cancel. */
  onBeforeRender?(): boolean;
  /** Called after each render cycle. */
  onAfterRender?(): void;
  /** Called before a cell edit begins. Return false to cancel. */
  onBeforeEdit?(rowIndex: number, colId: string): boolean;
  /** Called after a cell edit completes. */
  onAfterEdit?(rowIndex: number, colId: string, oldValue: unknown, newValue: unknown): void;
  /** Called before a sort operation. Return false to cancel. */
  onBeforeSort?(colId: string, direction: 'asc' | 'desc' | null): boolean;
  /** Called after a sort operation. */
  onAfterSort?(): void;
  /** Called before a filter operation. Return false to cancel. */
  onBeforeFilter?(): boolean;
  /** Called after a filter operation. */
  onAfterFilter?(): void;
  /** Called before rows are inserted. Return false to cancel. */
  onBeforeInsertRows?(count: number, atIndex: number): boolean;
  /** Called after rows are inserted. */
  onAfterInsertRows?(indices: number[]): void;
  /** Called before rows are deleted. Return false to cancel. */
  onBeforeDeleteRows?(indices: number[]): boolean;
  /** Called after rows are deleted. */
  onAfterDeleteRows?(indices: number[]): void;
  /** Called before columns are inserted. Return false to cancel. */
  onBeforeInsertColumns?(count: number, atIndex: number): boolean;
  /** Called after columns are inserted. */
  onAfterInsertColumns?(indices: number[]): void;
  /** Called before columns are deleted. Return false to cancel. */
  onBeforeDeleteColumns?(indices: number[]): boolean;
  /** Called after columns are deleted. */
  onAfterDeleteColumns?(indices: number[]): void;
  /** Called before clipboard paste. Return false to cancel. */
  onBeforePaste?(data: string, startCell: { row: number; col: number }): boolean;
  /** Called after clipboard paste. */
  onAfterPaste?(): void;
  /** Called before clipboard copy. Return false to cancel. */
  onBeforeCopy?(): boolean;
  /** Called after clipboard copy. */
  onAfterCopy?(): void;
  /** Custom event handler for arbitrary spreadsheet events. */
  onEvent?(eventType: string, payload: unknown): void;
}
