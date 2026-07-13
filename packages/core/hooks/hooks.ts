import { inject, Injectable, signal, WritableSignal, computed, effect, Signal, DestroyRef } from '@angular/core';
import { DOCUMENT } from '@angular/common';

// ─── Core Hooks ─────────────────────────────────────────────

export function useMediaQuery(query: string): WritableSignal<boolean> {
  const mq = signal(window.matchMedia(query).matches);
  const destroyRef = inject(DestroyRef);
  const media = window.matchMedia(query);
  const handler = (e: MediaQueryListEvent) => mq.set(e.matches);
  media.addEventListener('change', handler);
  destroyRef.onDestroy(() => media.removeEventListener('change', handler));
  return mq;
}

export function useTheme(): WritableSignal<'light' | 'dark'> {
  const theme = signal<'light' | 'dark'>(
    document.documentElement.getAttribute('data-theme') as 'light' | 'dark' || 'light'
  );
  effect(() => {
    document.documentElement.setAttribute('data-theme', theme());
  });
  return theme;
}

export function useScrollLock(): { locked: WritableSignal<boolean> } {
  const locked = signal(false);
  const doc = inject(DOCUMENT);
  effect(() => {
    if (locked()) {
      doc.body.style.overflow = 'hidden';
    } else {
      doc.body.style.overflow = '';
    }
  });
  return { locked };
}

export function useToast(): (message: string, variant?: 'info' | 'success' | 'error' | 'warning') => void {
  return (message: string, variant: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    const el = document.createElement('div');
    el.textContent = message;
    el.style.cssText = `position:fixed;bottom:1rem;right:1rem;padding:0.75rem 1rem;border-radius:8px;background:var(--ngxsmk-color-${variant === 'info' ? 'surface-container' : variant === 'success' ? 'success-container' : variant === 'error' ? 'error-container' : 'warning-container'});color:var(--ngxsmk-color-on-${variant === 'info' ? 'surface' : variant});font-family:var(--ngxsmk-font-sans);z-index:var(--ngxsmk-z-toast, 1600);box-shadow:var(--ngxsmk-shadow-lg);`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
  };
}

export function useDialog(): {
  open: (content: string) => void;
  close: () => void;
  isOpen: Signal<boolean>;
} {
  const isOpen = signal(false);
  return {
    open: () => isOpen.set(true),
    close: () => isOpen.set(false),
    isOpen: isOpen.asReadonly(),
  };
}

export function useStreamingText(target: string, speed = 30): Signal<string> {
  const displayed = signal('');
  let index = 0;
  function stream() {
    if (index >= target.length) return;
    displayed.update(t => t + target[index++]);
    setTimeout(stream, speed);
  }
  stream();
  return displayed.asReadonly();
}

// ─── Focus / Keyboard Hooks ────────────────────────────────

export function useFocusTrap(): {
  trapRef: WritableSignal<HTMLElement | null>;
  activate: () => void;
  deactivate: () => void;
} {
  const trapRef = signal<HTMLElement | null>(null);
  const active = signal(false);
  const destroyRef = inject(DestroyRef);

  function handleKey(e: KeyboardEvent) {
    if (!active() || e.key !== 'Tab') return;
    const el = trapRef();
    if (!el) return;
    const focusable = el.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  destroyRef.onDestroy(() => document.removeEventListener('keydown', handleKey));
  document.addEventListener('keydown', handleKey);

  return {
    trapRef,
    activate: () => { active.set(true); trapRef()?.querySelector<HTMLElement>('button, input, [tabindex]:not([tabindex="-1"])')?.focus(); },
    deactivate: () => active.set(false),
  };
}

export function useListFocus(): {
  activeIndex: WritableSignal<number>;
  handleKey: (e: KeyboardEvent, length: number) => void;
  reset: () => void;
} {
  const activeIndex = signal(-1);
  return {
    activeIndex,
    handleKey(e: KeyboardEvent, length: number) {
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex.update(i => Math.min(i + 1, length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex.update(i => Math.max(i - 1, 0)); }
    },
    reset: () => activeIndex.set(-1),
  };
}

export function useGridFocus(): {
  row: WritableSignal<number>;
  col: WritableSignal<number>;
  handleKey: (e: KeyboardEvent, rows: number, cols: number) => void;
} {
  const row = signal(0);
  const col = signal(0);
  return {
    row, col,
    handleKey(e: KeyboardEvent, rows: number, cols: number) {
      switch (e.key) {
        case 'ArrowDown': e.preventDefault(); row.update(r => Math.min(r + 1, rows - 1)); break;
        case 'ArrowUp': e.preventDefault(); row.update(r => Math.max(r - 1, 0)); break;
        case 'ArrowRight': e.preventDefault(); col.update(c => Math.min(c + 1, cols - 1)); break;
        case 'ArrowLeft': e.preventDefault(); col.update(c => Math.max(c - 1, 0)); break;
      }
    },
  };
}

export function useTreeFocus(): {
  activePath: WritableSignal<string[]>;
  expand: (id: string) => void;
  collapse: (id: string) => void;
  toggle: (id: string) => void;
} {
  const activePath = signal<string[]>([]);
  const expanded = signal<Set<string>>(new Set());
  return {
    activePath,
    expand: (id: string) => expanded.update(s => { s.add(id); return s; }),
    collapse: (id: string) => expanded.update(s => { s.delete(id); return s; }),
    toggle: (id: string) => expanded.update(s => { s.has(id) ? s.delete(id) : s.add(id); return s; }),
  };
}

export function useKeyboardHint(): {
  hints: WritableSignal<{ key: string; label: string }[]>;
  visible: WritableSignal<boolean>;
} {
  const hints = signal<{ key: string; label: string }[]>([]);
  const visible = signal(false);
  const destroyRef = inject(DestroyRef);
  destroyRef.onDestroy(() => {});
  return { hints, visible };
}

// ─── Overflow / Layout Hooks ──────────────────────────────

export function useOverflow(): {
  ref: WritableSignal<HTMLElement | null>;
  isOverflowing: Signal<boolean>;
} {
  const ref = signal<HTMLElement | null>(null);
  const isOverflowing = computed(() => {
    const el = ref();
    return el ? el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight : false;
  });
  return { ref, isOverflowing };
}

export function useScrollOverflow(): {
  containerRef: WritableSignal<HTMLElement | null>;
  scrollTop: WritableSignal<number>;
  scrollBottom: Signal<boolean>;
} {
  const containerRef = signal<HTMLElement | null>(null);
  const scrollTop = signal(0);
  const scrollBottom = computed(() => {
    const el = containerRef();
    return el ? el.scrollHeight - el.scrollTop - el.clientHeight < 1 : true;
  });
  return { containerRef, scrollTop, scrollBottom };
}

// ─── Input / Click Hooks ──────────────────────────────────

export function useInputContainer(): {
  focused: WritableSignal<boolean>;
  filled: WritableSignal<boolean>;
  containerClass: Signal<string>;
} {
  const focused = signal(false);
  const filled = signal(false);
  const containerClass = computed(() =>
    (focused() ? 'ngxsmk-input--focused ' : '') + (filled() ? 'ngxsmk-input--filled ' : '')
  );
  return { focused, filled, containerClass };
}

export function useClickableContainer(): {
  ref: WritableSignal<HTMLElement | null>;
  clicked: WritableSignal<number>;
} {
  const ref = signal<HTMLElement | null>(null);
  const clicked = signal(0);
  const destroyRef = inject(DestroyRef);
  destroyRef.onDestroy(() => ref()?.removeEventListener('click', handler));
  function handler() { clicked.update(c => c + 1); }
  effect(() => ref()?.addEventListener('click', handler));
  return { ref, clicked };
}

export function useLayer(): {
  zIndex: WritableSignal<number>;
  increment: () => void;
  decrement: () => void;
} {
  let current = 100;
  const zIndex = signal(current);
  return {
    zIndex,
    increment: () => { current++; zIndex.set(current); },
    decrement: () => { current = Math.max(100, current - 1); zIndex.set(current); },
  };
}

export function useImageMode(): {
  src: WritableSignal<string>;
  darkSrc: WritableSignal<string>;
  resolved: Signal<string>;
} {
  const src = signal('');
  const darkSrc = signal('');
  const theme = useTheme();
  const resolved = computed(() => theme() === 'dark' && darkSrc() ? darkSrc() : src());
  return { src, darkSrc, resolved };
}

// ─── Table Hooks ──────────────────────────────────────────

export function useTableSortable<T>(): {
  sortKey: WritableSignal<keyof T | null>;
  sortDir: WritableSignal<'asc' | 'desc'>;
  sortedData: Signal<T[]>;
  toggleSort: (key: keyof T) => void;
} {
  const data = signal<T[]>([]);
  const sortKey = signal<keyof T | null>(null);
  const sortDir = signal<'asc' | 'desc'>('asc');
  const sortedData = computed(() => {
    const key = sortKey();
    if (!key) return data();
    const dir = sortDir();
    return [...data()].sort((a, b) => {
      const av = String(a[key] ?? ''), bv = String(b[key] ?? '');
      return dir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    });
  });
  return {
    sortKey, sortDir, sortedData,
    toggleSort: (key: keyof T) => {
      if (sortKey() === key) sortDir.update(d => d === 'asc' ? 'desc' : 'asc');
      else { sortKey.set(key); sortDir.set('asc'); }
    },
  };
}

export function useTablePagination<T>(): {
  page: WritableSignal<number>;
  pageSize: WritableSignal<number>;
  total: Signal<number>;
  totalPages: Signal<number>;
  paginatedData: Signal<T[]>;
  goTo: (p: number) => void;
  next: () => void;
  prev: () => void;
} {
  const data = signal<T[]>([]);
  const page = signal(1);
  const pageSize = signal(20);
  const total = computed(() => data().length);
  const totalPages = computed(() => Math.max(1, Math.ceil(total() / pageSize())));
  const paginatedData = computed(() => {
    const start = (page() - 1) * pageSize();
    return data().slice(start, start + pageSize());
  });
  return {
    page, pageSize, total, totalPages, paginatedData,
    goTo: (p: number) => page.set(Math.max(1, Math.min(p, totalPages()))),
    next: () => page.update(p => Math.min(p + 1, totalPages())),
    prev: () => page.update(p => Math.max(p - 1, 1)),
  };
}

export function useTableSelection<T extends { id: string }>(): {
  selectedIds: WritableSignal<Set<string>>;
  allSelected: Signal<boolean>;
  toggle: (id: string) => void;
  toggleAll: (items: T[]) => void;
  clear: () => void;
  selectedItems: Signal<T[]>;
} {
  const items = signal<T[]>([]);
  const selectedIds = signal<Set<string>>(new Set());
  const allSelected = computed(() => items().length > 0 && selectedIds().size === items().length);
  const selectedItems = computed(() => items().filter(i => selectedIds().has(i.id)));
  return {
    selectedIds, allSelected, selectedItems,
    toggle: (id: string) => selectedIds.update(s => { s.has(id) ? s.delete(id) : s.add(id); return s; }),
    toggleAll: (allItems: T[]) => {
      selectedIds.update(s => {
        if (s.size === allItems.length) s.clear();
        else allItems.forEach(i => s.add(i.id));
        return s;
      });
    },
    clear: () => selectedIds.set(new Set()),
  };
}

export function useTableFiltering<T>(): {
  filters: WritableSignal<Record<string, string>>;
  filteredData: Signal<T[]>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
} {
  const data = signal<T[]>([]);
  const filters = signal<Record<string, string>>({});
  const filteredData = computed(() => {
    const f = filters();
    if (!Object.keys(f).length) return data();
    return data().filter(item =>
      Object.entries(f).every(([key, val]) =>
        !val || String((item as Record<string, unknown>)[key] ?? '').toLowerCase().includes(val.toLowerCase())
      )
    );
  });
  return {
    filters, filteredData,
    setFilter: (key: string, value: string) => filters.update(f => ({ ...f, [key]: value })),
    clearFilters: () => filters.set({}),
  };
}

export function useTableFilterState(): {
  filters: WritableSignal<Record<string, { value: string; operator: string }>>;
  activeCount: Signal<number>;
  setFilter: (key: string, value: string, operator?: string) => void;
  removeFilter: (key: string) => void;
  clearAll: () => void;
} {
  const filters = signal<Record<string, { value: string; operator: string }>>({});
  const activeCount = computed(() => Object.keys(filters()).length);
  return {
    filters, activeCount,
    setFilter: (key: string, value: string, operator = 'contains') => filters.update(f => ({ ...f, [key]: { value, operator } })),
    removeFilter: (key: string) => filters.update(f => { const { [key]: _, ...rest } = f; return rest; }),
    clearAll: () => filters.set({}),
  };
}

export function useTableRowExpansion<T extends { id: string }>(): {
  expandedIds: WritableSignal<Set<string>>;
  isExpanded: (id: string) => boolean;
  toggle: (id: string) => void;
  collapseAll: () => void;
} {
  const expandedIds = signal<Set<string>>(new Set());
  return {
    expandedIds,
    isExpanded: (id: string) => expandedIds().has(id),
    toggle: (id: string) => expandedIds.update(s => { s.has(id) ? s.delete(id) : s.add(id); return s; }),
    collapseAll: () => expandedIds.set(new Set()),
  };
}

export function useTableSelectionState<T extends { id: string }>(): {
  selectionState: WritableSignal<Record<string, boolean>>;
  count: Signal<number>;
  toggle: (id: string) => void;
  selectAll: (ids: string[]) => void;
  deselectAll: () => void;
} {
  const selectionState = signal<Record<string, boolean>>({});
  const count = computed(() => Object.values(selectionState()).filter(Boolean).length);
  return {
    selectionState, count,
    toggle: (id: string) => selectionState.update(s => ({ ...s, [id]: !s[id] })),
    selectAll: (ids: string[]) => selectionState.set(Object.fromEntries(ids.map(id => [id, true]))),
    deselectAll: () => selectionState.set({}),
  };
}

export function useTableColumnResize(): {
  columnWidths: WritableSignal<Record<string, number>>;
  startResize: (col: string, startX: number, startWidth: number) => void;
  resizing: Signal<boolean>;
} {
  const columnWidths = signal<Record<string, number>>({});
  const resizing = signal(false);
  return {
    columnWidths, resizing,
    startResize: (col: string, startX: number, startWidth: number) => {
      resizing.set(true);
      function onMove(e: MouseEvent) {
        columnWidths.update(w => ({ ...w, [col]: Math.max(60, startWidth + (e.clientX - startX)) }));
      }
      function onUp() {
        resizing.set(false);
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }
      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
  };
}

export function useTableColumnSettings(): {
  visibleColumns: WritableSignal<Set<string>>;
  columnOrder: WritableSignal<string[]>;
  toggleColumn: (col: string) => void;
  moveColumn: (from: number, to: number) => void;
} {
  const visibleColumns = signal<Set<string>>(new Set());
  const columnOrder = signal<string[]>([]);
  return {
    visibleColumns, columnOrder,
    toggleColumn: (col: string) => visibleColumns.update(s => { s.has(col) ? s.delete(col) : s.add(col); return s; }),
    moveColumn: (from: number, to: number) => columnOrder.update(order => {
      const copy = [...order];
      const [moved] = copy.splice(from, 1);
      copy.splice(to, 0, moved);
      return copy;
    }),
  };
}

export function useTableStickyColumns(): {
  stickyColumns: WritableSignal<Set<string>>;
  toggleSticky: (col: string) => void;
} {
  const stickyColumns = signal<Set<string>>(new Set());
  return {
    stickyColumns,
    toggleSticky: (col: string) => stickyColumns.update(s => { s.has(col) ? s.delete(col) : s.add(col); return s; }),
  };
}

// ─── Popover / Hover Hooks ────────────────────────────────

export function usePopover(): {
  isOpen: WritableSignal<boolean>;
  triggerRef: WritableSignal<HTMLElement | null>;
  contentRef: WritableSignal<HTMLElement | null>;
  open: () => void;
  close: () => void;
  toggle: () => void;
} {
  const isOpen = signal(false);
  const triggerRef = signal<HTMLElement | null>(null);
  const contentRef = signal<HTMLElement | null>(null);
  const destroyRef = inject(DestroyRef);
  destroyRef.onDestroy(() => document.removeEventListener('click', handleOutside));
  function handleOutside(e: MouseEvent) {
    if (isOpen() && !triggerRef()?.contains(e.target as Node) && !contentRef()?.contains(e.target as Node)) {
      isOpen.set(false);
    }
  }
  document.addEventListener('click', handleOutside);
  return {
    isOpen, triggerRef, contentRef,
    open: () => isOpen.set(true),
    close: () => isOpen.set(false),
    toggle: () => isOpen.update(v => !v),
  };
}

export function useHoverCard(): {
  isVisible: WritableSignal<boolean>;
  show: () => void;
  hide: () => void;
  delay: WritableSignal<number>;
} {
  const isVisible = signal(false);
  const delay = signal(300);
  let timer: ReturnType<typeof setTimeout> | null = null;
  return {
    isVisible, delay,
    show: () => { timer = setTimeout(() => isVisible.set(true), delay()); },
    hide: () => { if (timer) clearTimeout(timer); isVisible.set(false); },
  };
}

export function useEntryAnimation(): {
  animate: WritableSignal<boolean>;
  className: Signal<string>;
} {
  const animate = signal(false);
  const className = computed(() => animate() ? 'ngxsmk-animate--enter' : '');
  return { animate, className };
}

@Injectable({ providedIn: 'root' })
export class NgxsmkHooksService {}
