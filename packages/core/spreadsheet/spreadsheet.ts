import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  input,
  model,
  output,
  signal,
  TemplateRef,
  viewChild,
  afterNextRender,
  DestroyRef,
  type OnInit,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  SpreadsheetEngine,
  type SpreadsheetConfig,
  type SpreadsheetDensity,
  type SpreadsheetPlugin,
  type CellValue,
  type ColumnDef,
  type RowDef,
  type CellAddress,
  type CellRange,
  type SortCriterion,
  type FilterCriterion,
  SortPlugin,
  SelectionPlugin,
  UndoPlugin,
  ClipboardPlugin,
  FormulaPlugin,
  formatCellValue,
  normalizeRange,
  cellsInRange,
} from '@ngxsmk/cdk/spreadsheet';

// ── Template Injection Tokens ──

/** Context passed to cell template. */
export interface SpreadsheetCellContext {
  $implicit: CellValue;
  value: CellValue;
  rowIndex: number;
  colIndex: number;
  col: ColumnDef;
  row: RowDef;
  editing: boolean;
  selected: boolean;
  active: boolean;
  engine: SpreadsheetEngine;
}

/** Context passed to column header template. */
export interface SpreadsheetHeaderContext {
  $implicit: ColumnDef;
  col: ColumnDef;
  colIndex: number;
  sortDirection: 'asc' | 'desc' | null;
  resizing: boolean;
}

/** Context passed to row header template. */
export interface SpreadsheetRowHeaderContext {
  $implicit: number;
  rowIndex: number;
  selected: boolean;
}

/** Context passed to the toolbar template. */
export interface SpreadsheetToolbarContext {
  $implicit: SpreadsheetEngine;
  engine: SpreadsheetEngine;
}

/** Context passed to the context menu template. */
export interface SpreadsheetContextMenuContext {
  $implicit: { row: number; col: number; x: number; y: number };
  cellAddress: { row: number; col: number; x: number; y: number };
  engine: SpreadsheetEngine;
  close: () => void;
}

/** Context passed to empty state template. */
export interface SpreadsheetEmptyContext {
  $implicit: SpreadsheetEngine;
  engine: SpreadsheetEngine;
}

/** Context passed to loading template. */
export interface SpreadsheetLoadingContext {
  $implicit: SpreadsheetEngine;
  engine: SpreadsheetEngine;
}

/** Context passed to status bar template. */
export interface SpreadsheetStatusBarContext {
  $implicit: SpreadsheetEngine;
  engine: SpreadsheetEngine;
  selectedCount: number;
  totalRows: number;
  totalCols: number;
}

/** Context passed to formula bar template. */
export interface SpreadsheetFormulaBarContext {
  $implicit: SpreadsheetEngine;
  engine: SpreadsheetEngine;
  activeCell: CellAddress | null;
  cellValue: CellValue;
}

/** Context passed to cell editor template. */
export interface SpreadsheetEditorContext {
  $implicit: CellValue;
  value: CellValue;
  rowIndex: number;
  colIndex: number;
  col: ColumnDef;
  commit: (val: CellValue) => void;
  cancel: () => void;
}

// ── Template Tokens ──

export const SPREADSHEET_CELL_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetCellContext> | null>('SPREADSHEET_CELL_TEMPLATE');
export const SPREADSHEET_HEADER_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetHeaderContext> | null>('SPREADSHEET_HEADER_TEMPLATE');
export const SPREADSHEET_ROW_HEADER_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetRowHeaderContext> | null>(
    'SPREADSHEET_ROW_HEADER_TEMPLATE',
  );
export const SPREADSHEET_TOOLBAR_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetToolbarContext> | null>('SPREADSHEET_TOOLBAR_TEMPLATE');
export const SPREADSHEET_CONTEXT_MENU_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetContextMenuContext> | null>(
    'SPREADSHEET_CONTEXT_MENU_TEMPLATE',
  );
export const SPREADSHEET_EMPTY_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetEmptyContext> | null>('SPREADSHEET_EMPTY_TEMPLATE');
export const SPREADSHEET_LOADING_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetLoadingContext> | null>('SPREADSHEET_LOADING_TEMPLATE');
export const SPREADSHEET_STATUS_BAR_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetStatusBarContext> | null>(
    'SPREADSHEET_STATUS_BAR_TEMPLATE',
  );
export const SPREADSHEET_FORMULA_BAR_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetFormulaBarContext> | null>(
    'SPREADSHEET_FORMULA_BAR_TEMPLATE',
  );
export const SPREADSHEET_EDITOR_TEMPLATE =
  new InjectionToken<TemplateRef<SpreadsheetEditorContext> | null>('SPREADSHEET_EDITOR_TEMPLATE');

// ── DI Tokens ──

export const SPREADSHEET_CONFIG = new InjectionToken<Partial<SpreadsheetConfig>>(
  'SPREADSHEET_CONFIG',
);
export const SPREADSHEET_ENGINE = new InjectionToken<SpreadsheetEngine>('SPREADSHEET_ENGINE');

// ── Provider Function ──

export function provideSpreadsheet(
  config: Partial<SpreadsheetConfig> = {},
): { provider: InjectionToken<unknown>; useValue: unknown }[] {
  const engine = new SpreadsheetEngine(config);

  // Auto-register default plugins
  const plugins: SpreadsheetPlugin[] = [
    new SortPlugin(),
    new SelectionPlugin(),
    new UndoPlugin(),
    new ClipboardPlugin(),
  ];

  if (config.formulas !== false) {
    plugins.push(new FormulaPlugin());
  }

  engine.pluginHost.register(...plugins);

  return [
    { provider: SPREADSHEET_CONFIG, useValue: config },
    { provider: SPREADSHEET_ENGINE, useValue: engine },
  ];
}

// ── Component ──

@Component({
  standalone: true,
  selector: 'ngxsmk-spreadsheet',
  imports: [NgTemplateOutlet, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngxsmk-spreadsheet',
    '[class.ngxsmk-spreadsheet--compact]': 'density() === "compact"',
    '[class.ngxsmk-spreadsheet--dense]': 'density() === "dense"',
    '[class.ngxsmk-spreadsheet--rtl]': 'engine.rtl()',
    '[attr.role]': '"grid"',
    '[attr.aria-rowcount]': 'engine.totalRows()',
    '[attr.aria-colcount]': 'engine.totalColumns()',
    '(keydown)': '_onKeyDown($event)',
  },
  template: `
    <!-- Toolbar Slot -->
    @if (tplToolbar) {
      <div class="ngxsmk-spreadsheet__toolbar">
        <ng-container
          *ngTemplateOutlet="tplToolbar; context: { $implicit: engine, engine: engine }"
        ></ng-container>
      </div>
    }

    <!-- Formula Bar Slot -->
    @if (tplFormulaBar) {
      <div class="ngxsmk-spreadsheet__formula-bar">
        <ng-container
          *ngTemplateOutlet="
            tplFormulaBar;
            context: {
              $implicit: engine,
              engine: engine,
              activeCell: engine.selection().activeCell,
              cellValue: _activeCellValue(),
            }
          "
        ></ng-container>
      </div>
    }

    <div class="ngxsmk-spreadsheet__container" #container>
      <!-- Empty State -->
      @if (engine.totalRows() === 0 && engine.totalColumns() === 0) {
        @if (tplEmpty) {
          <ng-container
            *ngTemplateOutlet="tplEmpty; context: { $implicit: engine, engine: engine }"
          ></ng-container>
        } @else {
          <div class="ngxsmk-spreadsheet__empty">
            <div class="ngxsmk-spreadsheet__empty-icon">
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
              </svg>
            </div>
            <p class="ngxsmk-spreadsheet__empty-text">No data to display</p>
          </div>
        }
      } @else {
        <!-- Grid Layout -->
        <div class="ngxsmk-spreadsheet__grid" [style.--_total-w.px]="totalGridWidth()">
          <!-- Corner Cell -->
          <div class="ngxsmk-spreadsheet__corner"></div>

          <!-- Column Headers -->
          <div
            class="ngxsmk-spreadsheet__col-headers"
            [style.--_header-h.px]="engine.headerHeight()"
          >
            <div
              class="ngxsmk-spreadsheet__col-headers-inner"
              [style.--_translate-x.px]="-_scrollLeft()"
            >
              @for (col of engine.visibleColumns(); track col.id; let ci = $index) {
                <div
                  class="ngxsmk-spreadsheet__col-header"
                  [class.ngxsmk-spreadsheet__col-header--sorted]="
                    engine.getColumnState(col.id)?.sort
                  "
                  [class.ngxsmk-spreadsheet__col-header--pinned-left]="col.pinned === 'left'"
                  [class.ngxsmk-spreadsheet__col-header--pinned-right]="col.pinned === 'right'"
                  [style.--_col-w.px]="engine.columnWidths().get(col.id)"
                  [style.--_col-left.px]="_colOffset(col.id)"
                  [attr.data-col-index]="ci"
                  [attr.aria-sort]="
                    engine.getColumnState(col.id)?.sort === 'asc'
                      ? 'ascending'
                      : engine.getColumnState(col.id)?.sort === 'desc'
                        ? 'descending'
                        : 'none'
                  "
                  tabindex="0"
                  (click)="engine.sortBy(col.id)"
                  (keydown.enter)="engine.sortBy(col.id)"
                  (keydown.space)="engine.sortBy(col.id)"
                >
                  @if (tplHeader) {
                    <ng-container
                      *ngTemplateOutlet="
                        tplHeader;
                        context: {
                          $implicit: col,
                          col: col,
                          colIndex: ci,
                          sortDirection: engine.getColumnState(col.id)?.sort ?? null,
                          resizing: false,
                        }
                      "
                    ></ng-container>
                  } @else {
                    <span class="ngxsmk-spreadsheet__col-header-text">{{ col.header }}</span>
                    @if (engine.getColumnState(col.id)?.sort) {
                      <span class="ngxsmk-spreadsheet__sort-indicator">
                        {{ engine.getColumnState(col.id)?.sort === 'asc' ? '↑' : '↓' }}
                      </span>
                    }
                  }

                  <!-- Column Resize Handle -->
                  @if (col.resizable !== false) {
                    <div
                      class="ngxsmk-spreadsheet__resize-handle"
                      (pointerdown)="$event.stopPropagation(); _startResize(col.id, $event)"
                    ></div>
                  }
                </div>
              }
            </div>
          </div>

          <!-- Row Headers -->
          <div
            class="ngxsmk-spreadsheet__row-headers"
            [style.--_row-h.px]="engine.rowHeight()"
            [style.--_translate-y.px]="-_scrollTop()"
          >
            @for (row of engine.displayRows(); track row.id; let ri = $index) {
              @if (ri >= _virtualRange().start && ri < _virtualRange().end) {
                <div
                  class="ngxsmk-spreadsheet__row-header"
                  [class.ngxsmk-spreadsheet__row-header--selected]="
                    engine.selection().selectedRows.has(ri)
                  "
                  [style.--_row-top.px]="ri * engine.rowHeight()"
                  [attr.data-row-index]="ri"
                  tabindex="0"
                  (click)="engine.selectRow(ri)"
                  (keydown.enter)="engine.selectRow(ri)"
                  (keydown.space)="engine.selectRow(ri)"
                >
                  @if (tplRowHeader) {
                    <ng-container
                      *ngTemplateOutlet="
                        tplRowHeader;
                        context: {
                          $implicit: ri,
                          rowIndex: ri,
                          selected: engine.selection().selectedRows.has(ri),
                        }
                      "
                    ></ng-container>
                  } @else {
                    {{ ri + 1 }}
                  }
                </div>
              }
            }
          </div>

          <!-- Cell Grid -->
          <div
            class="ngxsmk-spreadsheet__cells"
            #cellsContainer
            [style.--_row-h.px]="engine.rowHeight()"
            [style.--_header-h.px]="engine.headerHeight()"
            (scroll)="_onScroll($event)"
          >
            <div
              class="ngxsmk-spreadsheet__cells-inner"
              [style.--_total-h.px]="engine.totalHeight()"
              [style.--_total-w.px]="totalGridWidth()"
            >
              <!-- Pinned Left Columns (always visible) -->
              @for (col of engine.pinnedLeftColumns(); track col.id; let ci = $index) {
                <div
                  class="ngxsmk-spreadsheet__col ngxsmk-spreadsheet__col--pinned-left"
                  [style.--_col-w.px]="engine.columnWidths().get(col.id)"
                  [style.--_col-left.px]="_pinnedLeftOffset(ci)"
                >
                  @for (row of engine.displayRows(); track row.id; let ri = $index) {
                    <div
                      class="ngxsmk-spreadsheet__cell"
                      [class.ngxsmk-spreadsheet__cell--selected]="engine.isCellSelected(ri, ci)"
                      [class.ngxsmk-spreadsheet__cell--active]="engine.isCellActive(ri, ci)"
                      [class.ngxsmk-spreadsheet__cell--editing]="_isEditing(ri, ci)"
                      [style.--_row-top.px]="ri * engine.rowHeight()"
                      [attr.data-row]="ri"
                      [attr.data-col]="ci"
                      [attr.data-col-id]="col.id"
                      [attr.aria-rowindex]="ri + 1"
                      [attr.aria-colindex]="ci + 1"
                      [attr.aria-selected]="engine.isCellSelected(ri, ci)"
                      role="gridcell"
                      (mousedown)="_onCellMouseDown(ri, ci, $event)"
                      (dblclick)="_onCellDblClick(ri, ci)"
                    >
                      @if (_isEditing(ri, ci)) {
                        @if (tplEditor) {
                          <ng-container
                            *ngTemplateOutlet="
                              tplEditor;
                              context: {
                                $implicit: engine.editingValue(),
                                value: engine.editingValue(),
                                rowIndex: ri,
                                colIndex: ci,
                                col: col,
                                commit: _commitEdit,
                                cancel: _cancelEdit,
                              }
                            "
                          ></ng-container>
                        } @else {
                          <!-- eslint-disable @angular-eslint/template/no-autofocus -->
                          <input
                            autofocus
                            class="ngxsmk-spreadsheet__cell-editor"
                            [ngModel]="engine.editingValue()"
                            (ngModelChange)="engine.editingValue.set($event)"
                            (keydown)="_onEditorKeydown($event)"
                            (blur)="_commitEdit()"
                          />
                          <!-- eslint-enable @angular-eslint/template/no-autofocus -->
                        }
                      } @else {
                        @if (tplCell) {
                          <ng-container
                            *ngTemplateOutlet="
                              tplCell;
                              context: {
                                $implicit: row.cells[col.id]?.value,
                                value: row.cells[col.id]?.value,
                                rowIndex: ri,
                                colIndex: ci,
                                col: col,
                                row: row,
                                editing: false,
                                selected: engine.isCellSelected(ri, ci),
                                active: engine.isCellActive(ri, ci),
                                engine: engine,
                              }
                            "
                          ></ng-container>
                        } @else {
                          <span class="ngxsmk-spreadsheet__cell-text">
                            {{ _formatCell(row.cells[col.id]?.value, col) }}
                          </span>
                        }
                      }
                    </div>
                  }
                </div>
              }

              <!-- Scrollable Columns -->
              @for (col of engine.unpinnedColumns(); track col.id; let ci = $index) {
                <div
                  class="ngxsmk-spreadsheet__col"
                  [style.--_col-w.px]="engine.columnWidths().get(col.id)"
                  [style.--_col-left.px]="_scrollableColOffset(ci)"
                >
                  @for (row of engine.displayRows(); track row.id; let ri = $index) {
                    <div
                      class="ngxsmk-spreadsheet__cell"
                      [class.ngxsmk-spreadsheet__cell--selected]="
                        engine.isCellSelected(ri, ci + engine.pinnedLeftColumns().length)
                      "
                      [class.ngxsmk-spreadsheet__cell--active]="
                        engine.isCellActive(ri, ci + engine.pinnedLeftColumns().length)
                      "
                      [class.ngxsmk-spreadsheet__cell--editing]="
                        _isEditing(ri, ci + engine.pinnedLeftColumns().length)
                      "
                      [style.--_row-top.px]="ri * engine.rowHeight()"
                      [attr.data-row]="ri"
                      [attr.data-col]="ci + engine.pinnedLeftColumns().length"
                      [attr.data-col-id]="col.id"
                      [attr.aria-rowindex]="ri + 1"
                      [attr.aria-colindex]="ci + engine.pinnedLeftColumns().length + 1"
                      [attr.aria-selected]="
                        engine.isCellSelected(ri, ci + engine.pinnedLeftColumns().length)
                      "
                      role="gridcell"
                      (mousedown)="
                        _onCellMouseDown(ri, ci + engine.pinnedLeftColumns().length, $event)
                      "
                      (dblclick)="_onCellDblClick(ri, ci + engine.pinnedLeftColumns().length)"
                    >
                      @if (_isEditing(ri, ci + engine.pinnedLeftColumns().length)) {
                        @if (tplEditor) {
                          <ng-container
                            *ngTemplateOutlet="
                              tplEditor;
                              context: {
                                $implicit: engine.editingValue(),
                                value: engine.editingValue(),
                                rowIndex: ri,
                                colIndex: ci + engine.pinnedLeftColumns().length,
                                col: col,
                                commit: _commitEdit,
                                cancel: _cancelEdit,
                              }
                            "
                          ></ng-container>
                        } @else {
                          <!-- eslint-disable @angular-eslint/template/no-autofocus -->
                          <input
                            autofocus
                            class="ngxsmk-spreadsheet__cell-editor"
                            [ngModel]="engine.editingValue()"
                            (ngModelChange)="engine.editingValue.set($event)"
                            (keydown)="_onEditorKeydown($event)"
                            (blur)="_commitEdit()"
                          />
                          <!-- eslint-enable @angular-eslint/template/no-autofocus -->
                        }
                      } @else {
                        @if (tplCell) {
                          <ng-container
                            *ngTemplateOutlet="
                              tplCell;
                              context: {
                                $implicit: row.cells[col.id]?.value,
                                value: row.cells[col.id]?.value,
                                rowIndex: ri,
                                colIndex: ci + engine.pinnedLeftColumns().length,
                                col: col,
                                row: row,
                                editing: false,
                                selected: engine.isCellSelected(
                                  ri,
                                  ci + engine.pinnedLeftColumns().length
                                ),
                                active: engine.isCellActive(
                                  ri,
                                  ci + engine.pinnedLeftColumns().length
                                ),
                                engine: engine,
                              }
                            "
                          ></ng-container>
                        } @else {
                          <span class="ngxsmk-spreadsheet__cell-text">
                            {{ _formatCell(row.cells[col.id]?.value, col) }}
                          </span>
                        }
                      }
                    </div>
                  }
                </div>
              }

              <!-- Pinned Right Columns (always visible) -->
              @for (col of engine.pinnedRightColumns(); track col.id; let ci = $index) {
                <div
                  class="ngxsmk-spreadsheet__col ngxsmk-spreadsheet__col--pinned-right"
                  [style.--_col-w.px]="engine.columnWidths().get(col.id)"
                  [style.--_col-right.px]="_pinnedRightOffset(ci)"
                >
                  @for (row of engine.displayRows(); track row.id; let ri = $index) {
                    <div
                      class="ngxsmk-spreadsheet__cell"
                      [class.ngxsmk-spreadsheet__cell--selected]="
                        engine.isCellSelected(
                          ri,
                          ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length
                        )
                      "
                      [class.ngxsmk-spreadsheet__cell--active]="
                        engine.isCellActive(
                          ri,
                          ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length
                        )
                      "
                      [class.ngxsmk-spreadsheet__cell--editing]="
                        _isEditing(
                          ri,
                          ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length
                        )
                      "
                      [style.--_row-top.px]="ri * engine.rowHeight()"
                      [attr.data-row]="ri"
                      [attr.data-col]="
                        ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length
                      "
                      [attr.data-col-id]="col.id"
                      [attr.aria-rowindex]="ri + 1"
                      [attr.aria-colindex]="
                        ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length + 1
                      "
                      [attr.aria-selected]="
                        engine.isCellSelected(
                          ri,
                          ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length
                        )
                      "
                      role="gridcell"
                      (mousedown)="
                        _onCellMouseDown(
                          ri,
                          ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length,
                          $event
                        )
                      "
                      (dblclick)="
                        _onCellDblClick(
                          ri,
                          ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length
                        )
                      "
                    >
                      @if (
                        _isEditing(
                          ri,
                          ci + engine.pinnedLeftColumns().length + engine.unpinnedColumns().length
                        )
                      ) {
                        @if (tplEditor) {
                          <ng-container
                            *ngTemplateOutlet="
                              tplEditor;
                              context: {
                                $implicit: engine.editingValue(),
                                value: engine.editingValue(),
                                rowIndex: ri,
                                colIndex:
                                  ci +
                                  engine.pinnedLeftColumns().length +
                                  engine.unpinnedColumns().length,
                                col: col,
                                commit: _commitEdit,
                                cancel: _cancelEdit,
                              }
                            "
                          ></ng-container>
                        } @else {
                          <!-- eslint-disable @angular-eslint/template/no-autofocus -->
                          <input
                            autofocus
                            class="ngxsmk-spreadsheet__cell-editor"
                            [ngModel]="engine.editingValue()"
                            (ngModelChange)="engine.editingValue.set($event)"
                            (keydown)="_onEditorKeydown($event)"
                            (blur)="_commitEdit()"
                          />
                          <!-- eslint-enable @angular-eslint/template/no-autofocus -->
                        }
                      } @else {
                        @if (tplCell) {
                          <ng-container
                            *ngTemplateOutlet="
                              tplCell;
                              context: {
                                $implicit: row.cells[col.id]?.value,
                                value: row.cells[col.id]?.value,
                                rowIndex: ri,
                                colIndex:
                                  ci +
                                  engine.pinnedLeftColumns().length +
                                  engine.unpinnedColumns().length,
                                col: col,
                                row: row,
                                editing: false,
                                selected: engine.isCellSelected(
                                  ri,
                                  ci +
                                    engine.pinnedLeftColumns().length +
                                    engine.unpinnedColumns().length
                                ),
                                active: engine.isCellActive(
                                  ri,
                                  ci +
                                    engine.pinnedLeftColumns().length +
                                    engine.unpinnedColumns().length
                                ),
                                engine: engine,
                              }
                            "
                          ></ng-container>
                        } @else {
                          <span class="ngxsmk-spreadsheet__cell-text">
                            {{ _formatCell(row.cells[col.id]?.value, col) }}
                          </span>
                        }
                      }
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Status Bar -->
        @if (tplStatusBar) {
          <div class="ngxsmk-spreadsheet__status-bar">
            <ng-container
              *ngTemplateOutlet="
                tplStatusBar;
                context: {
                  $implicit: engine,
                  engine: engine,
                  selectedCount: _selectedCellCount(),
                  totalRows: engine.totalRows(),
                  totalCols: engine.totalColumns(),
                }
              "
            ></ng-container>
          </div>
        } @else {
          <div class="ngxsmk-spreadsheet__status-bar">
            <span class="ngxsmk-spreadsheet__status-item">
              {{ engine.totalRows() }} rows × {{ engine.totalColumns() }} columns
            </span>
            @if (_selectedCellCount() > 0) {
              <span class="ngxsmk-spreadsheet__status-item">
                {{ _selectedCellCount() }} cell{{ _selectedCellCount() > 1 ? 's' : '' }} selected
              </span>
            }
          </div>
        }
      }
    </div>

    <!-- Context Menu Overlay -->
    @if (_contextMenuVisible()) {
      <div
        class="ngxsmk-spreadsheet__context-menu-overlay"
        tabindex="0"
        (click)="_contextMenuVisible.set(false)"
        (keydown.escape)="_contextMenuVisible.set(false)"
        (contextmenu)="_contextMenuVisible.set(false); $event.preventDefault()"
      >
        @if (tplContextMenu) {
          <div
            class="ngxsmk-spreadsheet__context-menu"
            [style.--_ctx-x.px]="_contextMenuPos().x"
            [style.--_ctx-y.px]="_contextMenuPos().y"
          >
            <ng-container
              *ngTemplateOutlet="
                tplContextMenu;
                context: {
                  $implicit: _contextMenuPos(),
                  cellAddress: {
                    row: _contextMenuPos().row,
                    col: _contextMenuPos().col,
                    x: _contextMenuPos().x,
                    y: _contextMenuPos().y,
                  },
                  engine: engine,
                  close: _closeContextMenu,
                }
              "
            ></ng-container>
          </div>
        } @else {
          <div
            class="ngxsmk-spreadsheet__context-menu"
            [style.--_ctx-x.px]="_contextMenuPos().x"
            [style.--_ctx-y.px]="_contextMenuPos().y"
          >
            <button class="ngxsmk-spreadsheet__ctx-item" (click)="_ctxCut()">Cut</button>
            <button class="ngxsmk-spreadsheet__ctx-item" (click)="_ctxCopy()">Copy</button>
            <button class="ngxsmk-spreadsheet__ctx-item" (click)="_ctxPaste()">Paste</button>
            <div class="ngxsmk-spreadsheet__ctx-separator"></div>
            <button class="ngxsmk-spreadsheet__ctx-item" (click)="_ctxInsertRowAbove()">
              Insert row above
            </button>
            <button class="ngxsmk-spreadsheet__ctx-item" (click)="_ctxInsertRowBelow()">
              Insert row below
            </button>
            <div class="ngxsmk-spreadsheet__ctx-separator"></div>
            <button
              class="ngxsmk-spreadsheet__ctx-item ngxsmk-spreadsheet__ctx-item--danger"
              (click)="_ctxDeleteRow()"
            >
              Delete row
            </button>
          </div>
        }
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      position: relative;
      background: var(--ngxsmk-spreadsheet-bg, var(--ngxsmk-color-surface));
      border: 1px solid var(--ngxsmk-spreadsheet-border, var(--ngxsmk-color-outline));
      border-radius: var(--ngxsmk-spreadsheet-radius, var(--ngxsmk-radius-lg));
      font-family: var(--ngxsmk-spreadsheet-font, var(--ngxsmk-font-sans));
      font-size: var(--ngxsmk-spreadsheet-cell-font-size, var(--ngxsmk-text-body-sm-size));
      line-height: 1.4;
      overflow: hidden;
      box-shadow: var(--ngxsmk-spreadsheet-shadow, var(--ngxsmk-shadow-sm));
    }

    .ngxsmk-spreadsheet__toolbar {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border-bottom: 1px solid var(--ngxsmk-spreadsheet-border, var(--ngxsmk-color-outline));
      background: var(--ngxsmk-spreadsheet-header-bg, var(--ngxsmk-color-surface-variant));
      min-height: 2.25rem;
    }

    .ngxsmk-spreadsheet__formula-bar {
      display: flex;
      align-items: center;
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-3);
      border-bottom: 1px solid
        var(--ngxsmk-spreadsheet-grid-color, var(--ngxsmk-color-outline-variant));
      background: var(--ngxsmk-spreadsheet-bg, var(--ngxsmk-color-surface));
      min-height: 1.75rem;
      font-family: var(--ngxsmk-spreadsheet-font-mono, var(--ngxsmk-font-mono));
      font-size: var(--ngxsmk-text-body-xs-size);
    }

    .ngxsmk-spreadsheet__container {
      position: relative;
      overflow: hidden;
    }

    .ngxsmk-spreadsheet__grid {
      display: grid;
      grid-template-columns: auto 1fr;
      grid-template-rows: auto 1fr;
      height: 100%;
      max-height: 70vh;
    }

    .ngxsmk-spreadsheet__corner {
      position: sticky;
      top: 0;
      left: 0;
      z-index: 30;
      width: 3rem;
      min-width: 3rem;
      height: var(--_header-h, 2.5rem);
      background: var(--ngxsmk-spreadsheet-header-bg, var(--ngxsmk-color-surface-variant));
      border-right: 1px solid var(--ngxsmk-spreadsheet-border, var(--ngxsmk-color-outline));
      border-bottom: 1px solid var(--ngxsmk-spreadsheet-border, var(--ngxsmk-color-outline));
    }

    /* ── Column Headers ── */
    .ngxsmk-spreadsheet__col-headers {
      position: sticky;
      top: 0;
      z-index: 20;
      overflow: hidden;
      height: var(--_header-h, 2.5rem);
      background: var(--ngxsmk-spreadsheet-header-bg, var(--ngxsmk-color-surface-variant));
      border-bottom: 1px solid var(--ngxsmk-spreadsheet-border, var(--ngxsmk-color-outline));
    }

    .ngxsmk-spreadsheet__col-headers-inner {
      display: flex;
      transform: translateX(var(--_translate-x, 0));
      will-change: transform;
    }

    .ngxsmk-spreadsheet__col-header {
      position: relative;
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-1);
      width: var(--_col-w, 150px);
      min-width: var(--_col-w, 150px);
      height: var(--_header-h, 2.5rem);
      padding: 0 var(--ngxsmk-space-2);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-spreadsheet-header-color, var(--ngxsmk-color-on-surface-variant));
      cursor: pointer;
      user-select: none;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      transition: background var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
      border-right: 1px solid
        var(--ngxsmk-spreadsheet-grid-color, var(--ngxsmk-color-outline-variant));
    }

    .ngxsmk-spreadsheet__col-header:hover {
      background: var(--ngxsmk-spreadsheet-hover-bg, var(--ngxsmk-color-surface-hover));
    }

    .ngxsmk-spreadsheet__col-header--sorted {
      color: var(--ngxsmk-color-primary);
    }

    .ngxsmk-spreadsheet__col-header-text {
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .ngxsmk-spreadsheet__sort-indicator {
      font-size: 0.75rem;
      opacity: 0.8;
    }

    .ngxsmk-spreadsheet__resize-handle {
      position: absolute;
      top: 0;
      right: -2px;
      width: 5px;
      height: 100%;
      cursor: col-resize;
      z-index: 5;
    }

    .ngxsmk-spreadsheet__resize-handle:hover,
    .ngxsmk-spreadsheet__resize-handle:active {
      background: var(--ngxsmk-color-primary);
      opacity: 0.4;
    }

    /* ── Row Headers ── */
    .ngxsmk-spreadsheet__row-headers {
      position: sticky;
      left: 0;
      z-index: 10;
      overflow: hidden;
      width: 3rem;
      min-width: 3rem;
    }

    .ngxsmk-spreadsheet__row-header {
      position: absolute;
      top: 0;
      left: 0;
      width: 3rem;
      height: var(--_row-h, 2.25rem);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-spreadsheet-header-color, var(--ngxsmk-color-on-surface-variant));
      background: var(--ngxsmk-spreadsheet-header-bg, var(--ngxsmk-color-surface-variant));
      border-right: 1px solid var(--ngxsmk-spreadsheet-border, var(--ngxsmk-color-outline));
      border-bottom: 1px solid
        var(--ngxsmk-spreadsheet-grid-color, var(--ngxsmk-color-outline-variant));
      cursor: pointer;
      user-select: none;
      transform: translateY(var(--_row-top, 0));
    }

    .ngxsmk-spreadsheet__row-header--selected {
      background: var(
        --ngxsmk-spreadsheet-selected-bg,
        color-mix(in srgb, var(--ngxsmk-color-primary) 12%, transparent)
      );
      color: var(--ngxsmk-color-primary);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }

    /* ── Cell Grid ── */
    .ngxsmk-spreadsheet__cells {
      overflow: auto;
      position: relative;
    }

    .ngxsmk-spreadsheet__cells-inner {
      position: relative;
      min-width: var(--_total-w, 100%);
      min-height: var(--_total-h, 100%);
    }

    .ngxsmk-spreadsheet__col {
      position: absolute;
      top: 0;
      left: 0;
      width: var(--_col-w, 150px);
      transform: translateX(var(--_col-left, 0));
    }

    .ngxsmk-spreadsheet__cell {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: var(--_row-h, 2.25rem);
      padding: var(--ngxsmk-spreadsheet-cell-padding, 6px 10px);
      border-right: 1px solid
        var(--ngxsmk-spreadsheet-grid-color, var(--ngxsmk-color-outline-variant));
      border-bottom: 1px solid
        var(--ngxsmk-spreadsheet-grid-color, var(--ngxsmk-color-outline-variant));
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: flex;
      align-items: center;
      cursor: cell;
      transition: background var(--ngxsmk-duration-fast, 100ms) var(--ngxsmk-ease-out);
      transform: translateY(var(--_row-top, 0));
      font-family: var(--ngxsmk-spreadsheet-font, var(--ngxsmk-font-sans));
    }

    .ngxsmk-spreadsheet__cell:hover {
      background: var(--ngxsmk-spreadsheet-hover-bg, var(--ngxsmk-color-surface-hover));
    }

    .ngxsmk-spreadsheet__cell--selected {
      background: var(
        --ngxsmk-spreadsheet-selected-bg,
        color-mix(in srgb, var(--ngxsmk-color-primary) 12%, transparent)
      );
    }

    .ngxsmk-spreadsheet__cell--active {
      outline: 2px solid var(--ngxsmk-spreadsheet-active-border, var(--ngxsmk-color-primary));
      outline-offset: -2px;
      z-index: 5;
    }

    .ngxsmk-spreadsheet__cell--editing {
      padding: 0;
      background: var(--ngxsmk-spreadsheet-edit-bg, var(--ngxsmk-color-surface));
      outline: 2px solid var(--ngxsmk-spreadsheet-edit-border, var(--ngxsmk-color-primary));
      outline-offset: -2px;
      z-index: 6;
    }

    .ngxsmk-spreadsheet__cell-text {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 100%;
    }

    .ngxsmk-spreadsheet__cell-editor {
      width: 100%;
      height: 100%;
      border: none;
      outline: none;
      background: transparent;
      padding: 0 var(--ngxsmk-space-2);
      font: inherit;
      color: inherit;
    }

    /* ── Pinned Columns ── */
    .ngxsmk-spreadsheet__col--pinned-left {
      position: sticky;
      z-index: 15;
      background: var(--ngxsmk-spreadsheet-bg, var(--ngxsmk-color-surface));
      box-shadow: var(--ngxsmk-spreadsheet-frozen-shadow, 2px 0 4px rgba(0, 0, 0, 0.08));
    }

    .ngxsmk-spreadsheet__col--pinned-right {
      position: sticky;
      z-index: 15;
      background: var(--ngxsmk-spreadsheet-bg, var(--ngxsmk-color-surface));
      box-shadow: -2px 0 4px rgba(0, 0, 0, 0.08);
    }

    /* ── Empty State ── */
    .ngxsmk-spreadsheet__empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-12) var(--ngxsmk-space-6);
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-spreadsheet__empty-icon {
      margin-bottom: var(--ngxsmk-space-3);
      opacity: 0.4;
    }

    .ngxsmk-spreadsheet__empty-text {
      font-size: var(--ngxsmk-text-body-md-size);
      margin: 0;
    }

    /* ── Status Bar ── */
    .ngxsmk-spreadsheet__status-bar {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-1) var(--ngxsmk-space-3);
      border-top: 1px solid var(--ngxsmk-spreadsheet-border, var(--ngxsmk-color-outline));
      background: var(--ngxsmk-spreadsheet-header-bg, var(--ngxsmk-color-surface-variant));
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
      min-height: 1.5rem;
    }

    .ngxsmk-spreadsheet__status-item {
      white-space: nowrap;
    }

    /* ── Context Menu ── */
    .ngxsmk-spreadsheet__context-menu-overlay {
      position: fixed;
      inset: 0;
      z-index: 1000;
    }

    .ngxsmk-spreadsheet__context-menu {
      position: fixed;
      top: var(--_ctx-y, 0);
      left: var(--_ctx-x, 0);
      min-width: 11rem;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      box-shadow: var(--ngxsmk-shadow-lg, 0 4px 16px rgba(0, 0, 0, 0.12));
      padding: var(--ngxsmk-space-1) 0;
      z-index: 1001;
    }

    .ngxsmk-spreadsheet__ctx-item {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      text-align: left;
      border: none;
      background: none;
      font: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface);
      cursor: pointer;
      white-space: nowrap;
    }

    .ngxsmk-spreadsheet__ctx-item:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-spreadsheet__ctx-item--danger {
      color: var(--ngxsmk-color-error);
    }

    .ngxsmk-spreadsheet__ctx-separator {
      height: 1px;
      margin: var(--ngxsmk-space-1) 0;
      background: var(--ngxsmk-color-outline);
    }

    /* ── Scrollbar ── */
    .ngxsmk-spreadsheet__cells::-webkit-scrollbar {
      width: var(--ngxsmk-spreadsheet-scrollbar-size, 8px);
      height: var(--ngxsmk-spreadsheet-scrollbar-size, 8px);
    }

    .ngxsmk-spreadsheet__cells::-webkit-scrollbar-track {
      background: transparent;
    }

    .ngxsmk-spreadsheet__cells::-webkit-scrollbar-thumb {
      background: var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-full);
    }

    .ngxsmk-spreadsheet__cells::-webkit-scrollbar-thumb:hover {
      background: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-spreadsheet__cells::-webkit-scrollbar-corner {
      background: transparent;
    }

    /* ── Dark Mode ── */
    :host-context(.dark) {
      --ngxsmk-spreadsheet-bg: var(--ngxsmk-color-surface);
      --ngxsmk-spreadsheet-header-bg: var(--ngxsmk-color-surface-container, #28292c);
      --ngxsmk-spreadsheet-grid-color: var(
        --ngxsmk-color-outline-variant,
        rgba(242, 244, 246, 0.06)
      );
      --ngxsmk-spreadsheet-hover-bg: var(--ngxsmk-color-surface-hover, rgba(255, 255, 255, 0.05));
      --ngxsmk-spreadsheet-selected-bg: color-mix(
        in srgb,
        var(--ngxsmk-color-primary) 15%,
        transparent
      );
      --ngxsmk-spreadsheet-frozen-shadow: 2px 0 6px rgba(0, 0, 0, 0.3);
    }

    /* ── Density Variants ── */
    :host(.ngxsmk-spreadsheet--compact) {
      --ngxsmk-spreadsheet-row-height: 1.75rem;
      --ngxsmk-spreadsheet-header-height: 2rem;
      --ngxsmk-spreadsheet-cell-padding: 2px 6px;
      --ngxsmk-spreadsheet-cell-font-size: var(--ngxsmk-text-body-xs-size);
    }

    :host(.ngxsmk-spreadsheet--dense) {
      --ngxsmk-spreadsheet-row-height: 1.5rem;
      --ngxsmk-spreadsheet-header-height: 1.75rem;
      --ngxsmk-spreadsheet-cell-padding: 1px 4px;
      --ngxsmk-spreadsheet-cell-font-size: 0.6875rem;
    }
  `,
})
export class NgxsmkSpreadsheet implements OnInit, AfterViewInit {
  // ── Inputs ──
  readonly columns = input<ColumnDef[]>([]);
  readonly rows = input<RowDef[]>([]);
  readonly density = input<SpreadsheetDensity>('comfortable');
  readonly editable = input<boolean>(true);
  readonly multiSort = input<boolean>(false);

  // ── Two-Way Binding ──
  readonly selectedCells = model<CellRange | null>(null);

  // ── Outputs ──
  readonly cellClick = output<{ row: number; col: number; value: CellValue }>();
  readonly cellDoubleClick = output<{ row: number; col: number; value: CellValue }>();
  readonly cellEdit = output<{
    row: number;
    col: string;
    oldValue: CellValue;
    newValue: CellValue;
  }>();
  readonly selectionChange = output<CellRange | null>();
  readonly sortChange = output<SortCriterion[]>();
  readonly filterChange = output<FilterCriterion[]>();
  readonly rowInsert = output<{ count: number; index: number }>();
  readonly rowDelete = output<{ indices: number[]; rows: RowDef[] }>();
  readonly scrolled = output<{ scrollTop: number; scrollLeft: number }>();

  // ── Template Refs ──
  protected readonly tplCell = inject(SPREADSHEET_CELL_TEMPLATE, { optional: true });
  protected readonly tplHeader = inject(SPREADSHEET_HEADER_TEMPLATE, { optional: true });
  protected readonly tplRowHeader = inject(SPREADSHEET_ROW_HEADER_TEMPLATE, { optional: true });
  protected readonly tplToolbar = inject(SPREADSHEET_TOOLBAR_TEMPLATE, { optional: true });
  protected readonly tplContextMenu = inject(SPREADSHEET_CONTEXT_MENU_TEMPLATE, { optional: true });
  protected readonly tplEmpty = inject(SPREADSHEET_EMPTY_TEMPLATE, { optional: true });
  protected readonly tplLoading = inject(SPREADSHEET_LOADING_TEMPLATE, { optional: true });
  protected readonly tplStatusBar = inject(SPREADSHEET_STATUS_BAR_TEMPLATE, { optional: true });
  protected readonly tplFormulaBar = inject(SPREADSHEET_FORMULA_BAR_TEMPLATE, { optional: true });
  protected readonly tplEditor = inject(SPREADSHEET_EDITOR_TEMPLATE, { optional: true });

  // ── DI ──
  readonly engine: SpreadsheetEngine;
  private readonly _cdr = inject(ChangeDetectorRef);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _container = viewChild<ElementRef>('container');
  private readonly _cellsContainer = viewChild<ElementRef>('cellsContainer');

  constructor() {
    const provided = inject(SPREADSHEET_ENGINE, { optional: true });
    this.engine = provided ?? new SpreadsheetEngine();
  }

  // ── Internal State ──
  protected readonly _scrollTop = signal(0);
  protected readonly _scrollLeft = signal(0);
  protected readonly _contextMenuVisible = signal(false);
  protected readonly _contextMenuPos = signal({ row: 0, col: 0, x: 0, y: 0 });
  protected readonly _resizingCol = signal<string | null>(null);
  protected readonly _resizeStartX = signal(0);
  protected readonly _resizeStartWidth = signal(0);

  // ── Computed ──
  protected readonly _virtualRange = computed(() => this.engine.virtualRowRange());
  protected readonly _activeCellValue = computed(() => {
    const ac = this.engine.selection().activeCell;
    if (!ac) return null;
    const col = this.engine.visibleColumns()[ac.col];
    if (!col) return null;
    return this.engine.getCellValue(ac.row, col.id);
  });

  protected readonly _selectedCellCount = computed(() => {
    const sel = this.engine.selection();
    if (sel.range) {
      const nr = normalizeRange(sel.range);
      return (nr.end.row - nr.start.row + 1) * (nr.end.col - nr.start.col + 1);
    }
    return sel.selectedRows.size + sel.selectedCols.size;
  });

  protected readonly totalGridWidth = computed(() => {
    const widths = this.engine.columnWidths();
    let total = 0;
    for (const col of this.engine.visibleColumns()) {
      total += widths.get(col.id) ?? 150;
    }
    return total;
  });

  // Bound methods for template context
  protected readonly _commitEdit = (): void => {
    this.engine.commitEdit();
    this._cdr.detectChanges();
  };

  protected readonly _cancelEdit = (): void => {
    this.engine.cancelEdit();
    this._cdr.detectChanges();
  };

  protected readonly _closeContextMenu = (): void => {
    this._contextMenuVisible.set(false);
  };

  // ── Lifecycle ──

  ngOnInit(): void {
    // Sync external data into engine
    if (this.columns().length > 0) {
      this.engine.columnDefs.set(this.columns());
    }
    if (this.rows().length > 0) {
      this.engine.rowData.set(this.rows());
    }

    // Watch for input changes
    effect(() => {
      const cols = this.columns();
      if (cols.length > 0) {
        this.engine.columnDefs.set(cols);
      }
    });

    effect(() => {
      const r = this.rows();
      if (r.length > 0) {
        this.engine.rowData.set(r);
      }
    });

    effect(() => {
      this.engine.density.set(this.density());
    });

    effect(() => {
      this.engine.editable.set(this.editable());
    });

    // Sync selection to model
    effect(() => {
      const sel = this.engine.selection();
      this.selectionChange.emit(sel.range);
    });
  }

  ngAfterViewInit(): void {
    // Set up viewport dimensions
    afterNextRender(() => {
      const container = this._container()?.nativeElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        this.engine.viewportHeight.set(rect.height);
        this.engine.viewportWidth.set(rect.width);

        const ro = new ResizeObserver((entries) => {
          for (const entry of entries) {
            this.engine.viewportHeight.set(entry.contentRect.height);
            this.engine.viewportWidth.set(entry.contentRect.width);
          }
        });
        ro.observe(container);
        this._destroyRef.onDestroy(() => ro.disconnect());
      }
    });
  }

  // ── Scroll ──

  protected _onScroll(event: Event): void {
    const el = event.target as HTMLElement;
    this._scrollTop.set(el.scrollTop);
    this._scrollLeft.set(el.scrollLeft);
    this.engine.scrollTop.set(el.scrollTop);
    this.engine.scrollLeft.set(el.scrollLeft);
    this.scrolled.emit({ scrollTop: el.scrollTop, scrollLeft: el.scrollLeft });
  }

  // ── Column Offsets ──

  protected _colOffset(colId: string): number {
    const cols = this.engine.visibleColumns();
    const widths = this.engine.columnWidths();
    let offset = 0;
    for (const col of cols) {
      if (col.id === colId) break;
      offset += widths.get(col.id) ?? 150;
    }
    return offset;
  }

  protected _pinnedLeftOffset(colIndex: number): number {
    const cols = this.engine.pinnedLeftColumns();
    const widths = this.engine.columnWidths();
    let offset = 0;
    for (let i = 0; i < colIndex; i++) {
      offset += widths.get(cols[i]?.id) ?? 150;
    }
    return offset;
  }

  protected _pinnedRightOffset(colIndex: number): number {
    const cols = this.engine.pinnedRightColumns();
    const widths = this.engine.columnWidths();
    let offset = 0;
    for (let i = cols.length - 1; i > colIndex; i--) {
      offset += widths.get(cols[i]?.id) ?? 150;
    }
    return offset;
  }

  protected _scrollableColOffset(colIndex: number): number {
    const cols = this.engine.unpinnedColumns();
    const widths = this.engine.columnWidths();
    let offset = 0;
    for (let i = 0; i < colIndex; i++) {
      offset += widths.get(cols[i]?.id) ?? 150;
    }
    return offset;
  }

  // ── Cell Interactions ──

  protected _onCellMouseDown(row: number, col: number, event: MouseEvent): void {
    if (event.button !== 0) return;

    if (event.shiftKey) {
      // Range selection
      const active = this.engine.selection().activeCell ?? { row, col };
      this.engine.selectRange(active, { row, col });
    } else if (event.ctrlKey || event.metaKey) {
      // Toggle selection
      this.engine.selectRow(row);
    } else {
      this.engine.selectCell(row, col);
    }

    this.cellClick.emit({
      row,
      col,
      value: this.engine.getCellValue(row, this.engine.visibleColumns()[col]?.id ?? ''),
    });
  }

  protected _onCellDblClick(row: number, col: number): void {
    const colDef = this.engine.visibleColumns()[col];
    if (!colDef || colDef.editable === false || !this.engine.editable()) return;

    this.engine.startEdit(row, colDef.id);

    this.cellDoubleClick.emit({
      row,
      col,
      value: this.engine.getCellValue(row, colDef.id),
    });
  }

  protected _isEditing(row: number, col: number): boolean {
    const ec = this.engine.editingCell();
    return ec?.row === row && ec?.col === col;
  }

  // ── Keyboard ──

  protected _onKeyDown(event: KeyboardEvent): void {
    const sel = this.engine.selection();
    const isEditing = this.engine.editingCell() != null;

    if (isEditing) return; // Let editor handle its own keys

    switch (event.key) {
      case 'ArrowUp':
        event.preventDefault();
        this.engine.navigate(-1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        this.engine.navigate(1, 0);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.engine.navigate(0, -1);
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.engine.navigate(0, 1);
        break;
      case 'Tab':
        event.preventDefault();
        if (event.shiftKey) {
          this.engine.navigate(0, -1);
        } else {
          this.engine.navigate(0, 1);
        }
        break;
      case 'Enter':
        event.preventDefault();
        if (sel.activeCell) {
          const col = this.engine.visibleColumns()[sel.activeCell.col];
          if (col) {
            this.engine.startEdit(sel.activeCell.row, col.id);
          }
        }
        break;
      case 'F2':
        event.preventDefault();
        if (sel.activeCell) {
          const col = this.engine.visibleColumns()[sel.activeCell.col];
          if (col) {
            this.engine.startEdit(sel.activeCell.row, col.id);
          }
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.engine.cancelEdit();
        break;
      case 'Delete':
      case 'Backspace':
        event.preventDefault();
        this._clearSelectedCells();
        break;
      case 'a':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this.engine.selectAll();
        }
        break;
      case 'c':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this._copy();
        }
        break;
      case 'x':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this._cut();
        }
        break;
      case 'v':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this._paste();
        }
        break;
      case 'z':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          if (event.shiftKey) {
            this._redo();
          } else {
            this._undo();
          }
        }
        break;
      case 'y':
        if (event.ctrlKey || event.metaKey) {
          event.preventDefault();
          this._redo();
        }
        break;
      default:
        // Start typing into cell
        if (
          sel.activeCell &&
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey
        ) {
          const col = this.engine.visibleColumns()[sel.activeCell.col];
          if (col && col.editable !== false && this.engine.editable()) {
            this.engine.startEdit(sel.activeCell.row, col.id);
            this.engine.editingValue.set(event.key);
          }
        }
        break;
    }
  }

  protected _onEditorKeydown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        this.engine.commitEdit();
        this.engine.navigate(1, 0);
        break;
      case 'Tab':
        event.preventDefault();
        this.engine.commitEdit();
        this.engine.navigate(0, event.shiftKey ? -1 : 1);
        break;
      case 'Escape':
        event.preventDefault();
        this.engine.cancelEdit();
        break;
    }
  }

  // ── Clipboard ──

  private _copy(): void {
    const plugin = this.engine.pluginHost.plugins.find((p) => p.name === 'clipboard') as
      ClipboardPlugin | undefined;
    plugin?.copy();
  }

  private _cut(): void {
    const plugin = this.engine.pluginHost.plugins.find((p) => p.name === 'clipboard') as
      ClipboardPlugin | undefined;
    plugin?.cut();
  }

  private _paste(): void {
    const plugin = this.engine.pluginHost.plugins.find((p) => p.name === 'clipboard') as
      ClipboardPlugin | undefined;
    plugin?.paste();
  }

  // ── Undo/Redo ──

  private _undo(): void {
    const plugin = this.engine.pluginHost.plugins.find((p) => p.name === 'undo') as
      UndoPlugin | undefined;
    plugin?.undo();
  }

  private _redo(): void {
    const plugin = this.engine.pluginHost.plugins.find((p) => p.name === 'undo') as
      UndoPlugin | undefined;
    plugin?.redo();
  }

  // ── Clear ──

  private _clearSelectedCells(): void {
    const sel = this.engine.selection();
    if (!sel.range) return;

    const nr = normalizeRange(sel.range);
    const cols = this.engine.visibleColumns();

    for (const addr of cellsInRange(nr)) {
      const col = cols[addr.col];
      if (col) {
        this.engine.setCellValue(addr.row, col.id, null);
      }
    }
  }

  // ── Column Resize ──

  protected _startResize(colId: string, event: PointerEvent): void {
    event.preventDefault();
    this._resizingCol.set(colId);
    this._resizeStartX.set(event.clientX);
    this._resizeStartWidth.set(this.engine.getColumnState(colId)?.width ?? 150);

    const onMove = (e: PointerEvent) => {
      const dx = e.clientX - this._resizeStartX();
      const newWidth = Math.max(40, this._resizeStartWidth() + dx);
      this.engine.setColumnWidth(colId, newWidth);
    };

    const onUp = () => {
      this._resizingCol.set(null);
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
  }

  // ── Context Menu ──

  protected _ctxCut(): void {
    this._closeContextMenu();
    this._cut();
  }

  protected _ctxCopy(): void {
    this._closeContextMenu();
    this._copy();
  }

  protected _ctxPaste(): void {
    this._closeContextMenu();
    this._paste();
  }

  protected _ctxInsertRowAbove(): void {
    const pos = this._contextMenuPos();
    this.engine.insertRows(1, pos.row);
    this._closeContextMenu();
  }

  protected _ctxInsertRowBelow(): void {
    const pos = this._contextMenuPos();
    this.engine.insertRows(1, pos.row + 1);
    this._closeContextMenu();
  }

  protected _ctxDeleteRow(): void {
    const pos = this._contextMenuPos();
    const deleted = this.engine.deleteRows([pos.row]);
    this.rowDelete.emit({ indices: [pos.row], rows: deleted });
    this._closeContextMenu();
  }

  // ── Formatting ──

  protected _formatCell(value: CellValue, col: ColumnDef): string {
    return formatCellValue(value, col.formatter ? undefined : undefined);
  }
}
