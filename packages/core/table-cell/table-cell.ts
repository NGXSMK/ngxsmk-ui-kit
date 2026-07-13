import { ChangeDetectionStrategy, Component, Directive, inject, input, output } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const STYLE_ID = 'ngxsmk-table-composed-styles';

/**
 * Skin for the *composed* table pattern — a hand-written `<table class="ngxsmk-table">`
 * built from the `ngxsmkTableRow` / `ngxsmkTableCell` / `ngxsmkTableHeaderCell` directives.
 * Injected globally (like the `ngxsmk-input` skin) because these directives host no view,
 * so scoped component styles cannot reach them. Kept visually in sync with `NgxsmkTable`.
 */
const TABLE_CSS = `
.ngxsmk-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid var(--ngxsmk-color-outline);
  font-family: var(--ngxsmk-font-sans);
  font-size: var(--ngxsmk-text-body-sm-size);
  line-height: var(--ngxsmk-text-body-sm-line);
  color: var(--ngxsmk-color-on-surface);
}
.ngxsmk-table-header-cell {
  padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
  background: var(--ngxsmk-color-surface-variant);
  color: var(--ngxsmk-color-on-surface);
  font-weight: 600;
  text-align: start;
  border-bottom: 2px solid var(--ngxsmk-color-outline-strong);
  white-space: nowrap;
}
.ngxsmk-table-cell {
  padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
  border-bottom: 1px solid var(--ngxsmk-color-outline);
}
.ngxsmk-table tbody .ngxsmk-table-row:last-child .ngxsmk-table-cell { border-bottom: none; }
.ngxsmk-table-row[data-selected] .ngxsmk-table-cell {
  background: var(--ngxsmk-color-primary-container);
  color: var(--ngxsmk-color-on-primary-container);
}
.ngxsmk-table-header-cell[aria-sort] { user-select: none; }

@media (max-width: 768px) {
  .ngxsmk-table {
    display: block;
    width: 100%;
    max-width: 100%;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
}
`;

function ensureTableStyles(document: Document): void {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = TABLE_CSS;
  document.head.appendChild(style);
}

@Directive({
  selector: 'td[ngxsmkTableCell], ngxsmk-table-cell',
  host: { class: 'ngxsmk-table-cell' },
})
export class NgxsmkTableCell {
  constructor() {
    ensureTableStyles(inject(DOCUMENT));
  }
}

@Directive({
  selector: 'th[ngxsmkTableHeaderCell], ngxsmk-table-header-cell',
  host: {
    class: 'ngxsmk-table-header-cell',
    '[attr.aria-sort]': 'sortDirection() || null',
    '[style.cursor]': 'sortable() ? "pointer" : null',
  },
})
export class NgxsmkTableHeaderCell {
  readonly sortable = input(false);
  readonly sortDirection = input<'asc' | 'desc' | ''>('');
  readonly sorted = output<void>();

  constructor() {
    ensureTableStyles(inject(DOCUMENT));
  }
}

@Directive({
  selector: 'tr[ngxsmkTableRow], ngxsmk-table-row',
  host: {
    class: 'ngxsmk-table-row',
    '[attr.data-selected]': 'selected() ? "" : null',
  },
})
export class NgxsmkTableRow {
  readonly selected = input(false);

  constructor() {
    ensureTableStyles(inject(DOCUMENT));
  }
}
