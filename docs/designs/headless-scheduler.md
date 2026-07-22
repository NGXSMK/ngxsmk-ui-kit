# Headless Scheduler — Architecture Design

**Status:** Proposal  
**Date:** 2026-07-22  
**Scope:** Redesign `@ngxsmk/core/scheduler` into a headless, enterprise-grade scheduling library

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Consumer App                          │
│  <ngxsmk-scheduler [config] [events] [resources] />     │
│    ├── <ng-template schedulerHeader>                    │
│    ├── <ng-template schedulerEvent>                     │
│    ├── <ng-template schedulerCell>                      │
│    └── ...                                              │
├─────────────────────────────────────────────────────────┤
│  @ngxsmk/core/scheduler  (UI shell + template wiring)   │
│    NgxsmkSchedulerComponent                             │
│    Template portal outlets                              │
│    CSS variable defaults                                │
├─────────────────────────────────────────────────────────┤
│  @ngxsmk/cdk/scheduler  (headless logic)                │
│    SchedulerEngine (signals, no DOM)                    │
│    ViewModels (dayGrid / timeGrid / agenda / timeline)  │
│    PluginHost                                           │
│    EventStore                                           │
│    SelectionManager                                     │
│    DragManager                                          │
├─────────────────────────────────────────────────────────┤
│  @ngxsmk/cdk/scheduler/plugins                         │
│    DragPlugin · ResizePlugin · RecurrencePlugin ·       │
│    TooltipPlugin · KeyboardPlugin · SelectionPlugin ·   │
│    TimezonePlugin · VirtualScrollPlugin                 │
└─────────────────────────────────────────────────────────┘
```

**Key principle:** The CDK layer contains zero DOM references. It is a pure
TypeScript state machine driven by signals. The core layer is the only place
that touches the DOM, and it does so exclusively through Angular templates and
host bindings.

---

## 2. Folder Structure

```
packages/cdk/scheduler/
├── index.ts                          # public barrel
├── ng-package.json
├── scheduler-engine.ts               # headless state machine
├── models/
│   ├── event.model.ts                # SchedulerEvent, RecurrenceRule
│   ├── resource.model.ts             # SchedulerResource
│   ├── view.model.ts                 # ViewType, ViewState
│   ├── selection.model.ts            # SelectionState
│   └── index.ts
├── view-models/
│   ├── time-grid.view-model.ts       # week / day / 3-day / work-week
│   ├── month-grid.view-model.ts      # month view
│   ├── agenda.view-model.ts          # agenda / list view
│   ├── timeline.view-model.ts        # resource timeline
│   └── index.ts
├── plugin/
│   ├── plugin.types.ts               # SchedulerPlugin interface
│   ├── plugin-host.ts                # plugin lifecycle manager
│   ├── drag.plugin.ts
│   ├── resize.plugin.ts
│   ├── recurrence.plugin.ts
│   ├── tooltip.plugin.ts
│   ├── keyboard.plugin.ts
│   ├── selection.plugin.ts
│   ├── timezone.plugin.ts
│   └── index.ts
├── utils/
│   ├── date-utils.ts                 # addDays, startOfWeek, diffMinutes, etc.
│   ├── snap.ts                       # snap to slot / snap to grid
│   └── index.ts

packages/core/scheduler/
├── index.ts
├── ng-package.json
├── scheduler.ts                      # Angular component (template + host)
├── scheduler-config.ts               # provideScheduler() DI config
├── templates/
│   ├── header.component.ts           # default header (nav + title)
│   ├── time-grid.component.ts        # default time grid renderer
│   ├── month-grid.component.ts       # default month grid renderer
│   ├── event-chip.component.ts       # default event chip
│   ├── now-indicator.component.ts    # current time line
│   └── index.ts
├── styles/
│   ├── scheduler.css                 # default theme tokens + base styles
│   ├── scheduler-dark.css            # dark mode overrides
│   └── index.ts
└── portals/
    ├── template-ports.ts             # TemplateRef injection tokens
    └── index.ts
```

---

## 3. Core Data Models

### 3.1 SchedulerEvent

```typescript
interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  textColor?: string;
  icon?: string;
  badge?: string;
  className?: string;
  style?: Record<string, string>;
  draggable?: boolean;
  resizable?: boolean;
  editable?: boolean;
  overlapping?: boolean;
  /** Recurrence rule (RFC 5545 RRULE string or structured) */
  recurrence?: RecurrenceRule;
  /** Which resource(s) this event belongs to */
  resourceId?: string;
  /** Arbitrary metadata for plugins / consumers */
  meta?: Record<string, unknown>;
}

interface RecurrenceRule {
  frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
  interval?: number;          // default 1
  count?: number;             // max occurrences
  until?: Date;               // end date
  byDay?: string[];           // ['MO','WE','FR']
  byMonth?: number[];         // [1,6,12]
  byMonthDay?: number[];      // [1,15]
  exceptions?: Date[];        // dates to skip
}
```

### 3.2 SchedulerResource

```typescript
interface SchedulerResource {
  id: string;
  title: string;
  color?: string;
  icon?: string;
  /** Nesting support (tree) */
  parentId?: string;
  /** Working hours for this resource */
  workingHours?: WorkingHours;
  /** Capacity (for resource pooling) */
  capacity?: number;
  meta?: Record<string, unknown>;
}

interface WorkingHours {
  /** ISO day numbers: 1=Mon … 7=Sun */
  days: number[];
  /** [startMinute, endMinute) from midnight */
  ranges: [number, number][];
}
```

### 3.3 ViewState

```typescript
type ViewType =
  | 'dayGridDay'
  | 'dayGridWeek'
  | 'dayGridMonth'
  | 'timeGridDay'
  | 'timeGridWeek'
  | 'timeGridWorkWeek'
  | 'timeGrid3Day'
  | 'agenda'
  | 'timeline';

interface ViewState {
  type: ViewType;
  /** The reference date for the current view */
  date: Date;
  /** Visible date range */
  rangeStart: Date;
  rangeEnd: Date;
  /** Slot granularity in minutes (15, 30, 60) */
  slotDuration: number;
  /** Snap granularity in minutes */
  snapDuration: number;
  /** Hours to display (default [0,24]) */
  visibleHours: [number, number];
  /** Resources (for timeline view) */
  resources: SchedulerResource[];
  /** First day of week (0=Sun … 6=Sat) */
  firstDayOfWeek: number;
  /** Working hours highlight */
  businessHours?: WorkingHours;
  /** Locale */
  locale: string;
  /** RTL */
  rtl: boolean;
}
```

### 3.4 SelectionState

```typescript
interface SelectionState {
  /** Currently selected event IDs */
  selectedEventIds: Set<string>;
  /** Currently selected time range */
  selectedRange: { start: Date; end: Date; resourceId?: string } | null;
  /** Multi-select mode */
  multiSelect: boolean;
  /** Currently focused cell */
  focusedCell: { date: Date; resourceId?: string } | null;
}
```

---

## 4. SchedulerEngine (Headless State Machine)

The engine is a plain TypeScript class — no Angular, no DOM. It owns all state
as writable signals and exposes computed signals for derived state.

```typescript
class SchedulerEngine {
  // ── Inputs (writable signals) ──
  readonly events = signal<SchedulerEvent[]>([]);
  readonly resources = signal<SchedulerResource[]>([]);
  readonly viewState = signal<ViewState>(defaultViewState);
  readonly selection = signal<SelectionState>(defaultSelection);
  readonly plugins = signal<SchedulerPlugin[]>([]);

  // ── Derived (computed) ──
  readonly visibleEvents = computed(() => this.filterByRange(this.events(), this.viewState()));
  readonly slots = computed(() => this.computeSlots(this.viewState()));
  readonly columns = computed(() => this.computeColumns(this.viewState()));
  readonly dayColumns = computed(() => this.computeDayColumns(this.viewState()));

  // ── Commands (immutably update signals) ──
  next(): void;
  previous(): void;
  today(): void;
  goto(date: Date): void;
  setView(type: ViewType, date?: Date): void;
  addEvent(event: SchedulerEvent): void;
  updateEvent(id: string, patch: Partial<SchedulerEvent>): void;
  removeEvent(id: string): void;
  moveEvent(id: string, newStart: Date, newEnd: Date, resourceId?: string): void;
  resizeEvent(id: string, newEnd: Date): void;
  selectEvent(id: string, multi?: boolean): void;
  selectRange(start: Date, end: Date, resourceId?: string): void;
  clearSelection(): void;
  scrollToDate(date: Date): void;

  // ── Lifecycle hooks (called by plugins) ──
  readonly beforeRender = signal<((state: ViewState) => void)[]>([]);
  readonly afterRender = signal<((state: ViewState) => void)[]>([]);
  readonly beforeCreate = signal<((event: SchedulerEvent) => boolean)[]>([]);
  readonly afterCreate = signal<((event: SchedulerEvent) => void)[]>([]);
  // ... beforeUpdate, afterUpdate, beforeDelete, afterDelete,
  //     beforeDrag, afterDrag, beforeResize, afterResize
}
```

---

## 5. Plugin Architecture

### 5.1 Plugin Interface

```typescript
interface SchedulerPlugin {
  /** Unique name for identification */
  name: string;
  /** Priority (lower = earlier). Default 100. */
  priority?: number;
  /** Called when plugin is registered */
  onInit?(engine: SchedulerEngine): void;
  /** Called when plugin is unregistered */
  onDestroy?(): void;
  /** Hook into render cycle */
  onRender?(state: ViewState): void;
  /** Provide additional computed signals */
  provideSignals?(): Record<string, WritableSignal<unknown> | ComputedRef<unknown>>;
  /** Provide additional methods */
  provideMethods?(): Record<string, (...args: unknown[]) => void>;
}
```

### 5.2 Built-in Plugins

| Plugin | Description | Opt-in |
|--------|-------------|--------|
| `DragPlugin` | Event drag-and-drop (pointer events, touch, keyboard) | ✅ |
| `ResizePlugin` | Bottom-edge resize handle | ✅ |
| `RecurrencePlugin` | Expand RRULE events into occurrences | ✅ |
| `TooltipPlugin` | Hover/focus tooltip with custom template | ✅ |
| `KeyboardPlugin` | Arrow key nav, Enter to select, Delete to remove | ✅ |
| `SelectionPlugin` | Click-drag range selection, multi-select | ✅ |
| `TimezonePlugin` | Convert display times across zones | ✅ |
| `VirtualScrollPlugin` | Window rendering for 10k+ events | ✅ |
| `UndoPlugin` | Undo/redo stack for all mutations | ✅ |
| `PrintPlugin` | Print-friendly layout | ✅ |
| `ExportPlugin` | iCal / CSV export | ✅ |

### 5.3 Plugin Registration

```typescript
provideScheduler({
  plugins: [
    ngxsmkDragPlugin(),
    ngxsmkResizePlugin(),
    ngxsmkTooltipPlugin({ delay: 300 }),
    ngxsmkKeyboardPlugin({ capture: true }),
  ],
})
```

---

## 6. Template Architecture

Every visual element is exposed as a named `ng-template` that the consumer can
override. The component uses `@angular/cdk/portal` (`CdkPortalOutlet`) to
project custom templates into the correct locations.

### 6.1 Template Injection Tokens

```typescript
// Each token is an InjectionToken<TemplateRef<unknown> | null>
const SCHEDULER_HEADER_TEMPLATE = new InjectionToken('SCHEDULER_HEADER_TEMPLATE');
const SCHEDULER_TOOLBAR_TEMPLATE = new InjectionToken('SCHEDULER_TOOLBAR_TEMPLATE');
const SCHEDULER_NAV_PREV_TEMPLATE = new InjectionToken('SCHEDULER_NAV_PREV_TEMPLATE');
const SCHEDULER_NAV_NEXT_TEMPLATE = new InjectionToken('SCHEDULER_NAV_NEXT_TEMPLATE');
const SCHEDULER_TODAY_BTN_TEMPLATE = new InjectionToken('SCHEDULER_TODAY_BTN_TEMPLATE');
const SCHEDULER_DAY_HEADER_TEMPLATE = new InjectionToken('SCHEDULER_DAY_HEADER_TEMPLATE');
const SCHEDULER_TIME_LABEL_TEMPLATE = new InjectionToken('SCHEDULER_TIME_LABEL_TEMPLATE');
const SCHEDULER_EVENT_TEMPLATE = new InjectionToken('SCHEDULER_EVENT_TEMPLATE');
const SCHEDULER_CELL_TEMPLATE = new InjectionToken('SCHEDULER_CELL_TEMPLATE');
const SCHEDULER_ALL_DAY_TEMPLATE = new InjectionToken('SCHEDULER_ALL_DAY_TEMPLATE');
const SCHEDULER_NOW_INDICATOR_TEMPLATE = new InjectionToken('SCHEDULER_NOW_INDICATOR_TEMPLATE');
const SCHEDULER_TOOLTIP_TEMPLATE = new InjectionToken('SCHEDULER_TOOLTIP_TEMPLATE');
const SCHEDULER_EMPTY_TEMPLATE = new InjectionToken('SCHEDULER_EMPTY_TEMPLATE');
const SCHEDULER_LOADING_TEMPLATE = new InjectionToken('SCHEDULER_LOADING_TEMPLATE');
const SCHEDULER_CONTEXT_MENU_TEMPLATE = new InjectionToken('SCHEDULER_CONTEXT_MENU_TEMPLATE');
const SCHEDULER_RESIZE_HANDLE_TEMPLATE = new InjectionToken('SCHEDULER_RESIZE_HANDLE_TEMPLATE');
const SCHEDULER_DRAG_PREVIEW_TEMPLATE = new InjectionToken('SCHEDULER_DRAG_PREVIEW_TEMPLATE');
const SCHEDULER_SELECTION_OVERLAY_TEMPLATE = new InjectionToken('SCHEDULER_SELECTION_OVERLAY_TEMPLATE');
const SCHEDULER_RESOURCE_TEMPLATE = new InjectionToken('SCHEDULER_RESOURCE_TEMPLATE');
```

### 6.2 Consumer Usage (Content Projection)

```html
<ngxsmk-scheduler [(events)]="events" [view]="'timeGridWeek'">

  <!-- Custom event chip -->
  <ng-template schedulerEvent let-event let-selected="selected">
    <div class="my-event" [class.selected]="selected">
      <mat-icon>{{ event.icon }}</mat-icon>
      <span>{{ event.title }}</span>
      <span class="badge">{{ event.meta?.count }}</span>
    </div>
  </ng-template>

  <!-- Custom day header -->
  <ng-template schedulerDayHeader let-day let-isToday="isToday">
    <div class="custom-header" [class.today]="isToday">
      {{ day | date:'EEE' }}
      <span class="date">{{ day | date:'d' }}</span>
    </div>
  </ng-template>

  <!-- Custom toolbar -->
  <ng-template schedulerToolbar let-view let-date="date">
    <my-custom-toolbar [view]="view" [date]="date" />
  </ng-template>

</ngxsmk-scheduler>
```

### 6.3 Template Context

Each template receives a typed context object:

```typescript
interface SchedulerEventContext {
  $implicit: SchedulerEvent;
  event: SchedulerEvent;
  selected: boolean;
  view: ViewState;
  dragging: boolean;
  resizing: boolean;
  overlap: boolean;
}

interface SchedulerCellContext {
  $implicit: Date;
  date: Date;
  hour: number;
  minute: number;
  isToday: boolean;
  isWeekend: boolean;
  isBusinessHours: boolean;
  isOutsideVisibleHours: boolean;
  resourceId?: string;
}

interface SchedulerDayHeaderContext {
  $implicit: Date;
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isPast: boolean;
  dayName: string;
  dayNumber: number;
  monthName: string;
}
```

---

## 7. Theme Architecture

### 7.1 CSS Variable System

All visual properties are controlled by CSS custom properties. The component
ships with a default theme. Consumers override via their own stylesheet or
Angular `::ng-deep` / `ViewEncapsulation.None`.

```css
/* ── Base tokens ── */
--scheduler-bg: var(--ngxsmk-color-surface);
--scheduler-text: var(--ngxsmk-color-on-surface);
--scheduler-text-secondary: var(--ngxsmk-color-on-surface-variant);
--scheduler-border: var(--ngxsmk-color-outline-variant);
--scheduler-border-light: color-mix(in srgb, var(--scheduler-border) 50%, transparent);

/* ── Header ── */
--scheduler-header-bg: var(--ngxsmk-color-surface);
--scheduler-header-height: 56px;
--scheduler-header-border: var(--scheduler-border);
--scheduler-header-font-size: var(--ngxsmk-text-body-md-size);

/* ── Navigation ── */
--scheduler-nav-btn-bg: transparent;
--scheduler-nav-btn-border: var(--scheduler-border);
--scheduler-nav-btn-radius: var(--ngxsmk-radius-sm);
--scheduler-nav-btn-hover-bg: color-mix(in srgb, var(--scheduler-primary) 8%, var(--scheduler-bg));
--scheduler-nav-btn-hover-border: var(--scheduler-primary);

/* ── Time column ── */
--scheduler-time-col-width: 56px;
--scheduler-time-label-font-size: var(--ngxsmk-text-label-sm-size);
--scheduler-time-label-color: var(--scheduler-text-secondary);

/* ── Grid ── */
--scheduler-hour-height: 60px;
--scheduler-grid-line-color: var(--scheduler-border-light);
--scheduler-grid-line-thick: var(--scheduler-border);
--scheduler-cell-hover-bg: color-mix(in srgb, var(--scheduler-primary) 4%, var(--scheduler-bg));

/* ── Today ── */
--scheduler-today-bg: color-mix(in srgb, var(--scheduler-primary) 3%, var(--scheduler-bg));
--scheduler-today-header-bg: color-mix(in srgb, var(--scheduler-primary) 6%, var(--scheduler-bg));
--scheduler-today-number-bg: var(--scheduler-primary);
--scheduler-today-number-color: var(--scheduler-on-primary, #fff);

/* ── Weekend ── */
--scheduler-weekend-bg: color-mix(in srgb, var(--scheduler-text-secondary) 3%, var(--scheduler-bg));

/* ── Events ── */
--scheduler-event-bg: var(--scheduler-primary-container);
--scheduler-event-color: var(--scheduler-on-primary-container);
--scheduler-event-radius: var(--ngxsmk-radius-sm);
--scheduler-event-shadow: var(--ngxsmk-shadow-sm);
--scheduler-event-shadow-hover: var(--ngxsmk-shadow-md);
--scheduler-event-font-size: var(--ngxsmk-text-label-sm-size);
--scheduler-event-padding: 3px 6px;
--scheduler-event-border-left: 3px solid var(--scheduler-primary);
--scheduler-event-z-index: 1;
--scheduler-event-z-index-hover: 2;
--scheduler-event-z-index-drag: 10;

/* ── All-day ── */
--scheduler-allday-height: 28px;
--scheduler-allday-bg: color-mix(in srgb, var(--scheduler-text-secondary) 5%, var(--scheduler-bg));

/* ── Current time ── */
--scheduler-now-color: var(--ngxsmk-color-error, #ef4444);
--scheduler-now-width: 2px;
--scheduler-now-dot-size: 8px;

/* ── Selection ── */
--scheduler-selection-bg: color-mix(in srgb, var(--scheduler-primary) 15%, var(--scheduler-bg));
--scheduler-selection-border: 1.5px dashed color-mix(in srgb, var(--scheduler-primary) 60%, transparent);

/* ── Drag ── */
--scheduler-drag-opacity: var(--ngxsmk-opacity-faint);
--scheduler-drop-highlight-bg: color-mix(in srgb, var(--scheduler-primary) 6%, var(--scheduler-bg));
--scheduler-drop-highlight-border: inset 0 0 0 1px color-mix(in srgb, var(--scheduler-primary) 25%, transparent);

/* ── Resize ── */
--scheduler-resize-handle-height: 6px;
--scheduler-resize-handle-color: transparent;
--scheduler-resize-handle-hover-color: var(--scheduler-primary);

/* ── Tooltip ── */
--scheduler-tooltip-bg: var(--ngxsmk-color-inverse-surface, #1c1b1f);
--scheduler-tooltip-color: var(--ngxsmk-color-inverse-on-surface, #f3edf7);
--scheduler-tooltip-radius: var(--ngxsmk-radius-sm);
--scheduler-tooltip-shadow: var(--ngxsmk-shadow-lg);
--scheduler-tooltip-padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
--scheduler-tooltip-font-size: var(--ngxsmk-text-body-sm-size);

/* ── Scrollbar ── */
--scheduler-scrollbar-width: 6px;
--scheduler-scrollbar-thumb: color-mix(in srgb, var(--scheduler-text-secondary) 30%, transparent);
--scheduler-scrollbar-thumb-hover: color-mix(in srgb, var(--scheduler-text-secondary) 50%, transparent);

/* ── Transitions ── */
--scheduler-transition-fast: var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
--scheduler-transition-normal: var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);

/* ── Primary color (used by many derived tokens) ── */
--scheduler-primary: var(--ngxsmk-color-primary);
--scheduler-primary-container: var(--ngxsmk-color-primary-container);
--scheduler-on-primary-container: var(--ngxsmk-color-on-primary-container);
```

### 7.2 Dark Mode

```css
/* scheduler-dark.css — loaded alongside scheduler.css */
:host.dark {
  --scheduler-bg: #1a1a2e;
  --scheduler-text: #e0e0e0;
  --scheduler-border: #333355;
  /* ... full dark palette overrides */
}
```

### 7.3 Theme Variants

Consumers can create theme classes:

```css
.theme-outlook {
  --scheduler-primary: #0078d4;
  --scheduler-event-radius: 2px;
  --scheduler-event-border-left: none;
  /* Outlook uses solid colored backgrounds without left accent */
}

.theme-apple {
  --scheduler-primary: #007aff;
  --scheduler-event-radius: 6px;
  --scheduler-event-shadow: none;
  /* Apple uses flat colored pills */
}

.theme-linear {
  --scheduler-primary: #5e6ad2;
  --scheduler-event-radius: 4px;
  --scheduler-hour-height: 48px;
  /* Linear uses compact rows */
}
```

---

## 8. Component API

### 8.1 Inputs

```typescript
@Component({ selector: 'ngxsmk-scheduler' })
class NgxsmkSchedulerComponent {
  // ── Data ──
  readonly events = model.required<SchedulerEvent[]>();
  readonly resources = input<SchedulerResource[]>([]);

  // ── View ──
  readonly view = input<ViewType>('timeGridWeek');
  readonly date = input<Date>(new Date());
  readonly slotDuration = input(30);           // minutes
  readonly snapDuration = input(15);           // minutes
  readonly visibleHours = input<[number, number]>([0, 24]);
  readonly firstDayOfWeek = input(1);          // 0=Sun, 1=Mon
  readonly locale = input('en-US');
  readonly rtl = input(false);

  // ── Layout ──
  readonly density = input<'compact' | 'comfortable' | 'dense'>('comfortable');
  readonly showAllDay = input(true);
  readonly showWeekends = input(true);
  readonly showCurrentTime = input(true);

  // ── Business hours ──
  readonly businessHours = input<WorkingHours | null>(null);

  // ── Responsive ──
  readonly desktopView = input<ViewType>('timeGridWeek');
  readonly tabletView = input<ViewType>('timeGrid3Day');
  readonly mobileView = input<ViewType>('timeGridDay');

  // ── Plugins ──
  readonly plugins = input<SchedulerPlugin[]>([]);

  // ── Interaction ──
  readonly editable = input(true);
  readonly selectable = input(true);
  readonly draggable = input(true);
  readonly resizable = input(true);
}
```

### 8.2 Outputs

```typescript
  // ── Events ──
  readonly eventClick = output<SchedulerEvent>();
  readonly eventDoubleClick = output<SchedulerEvent>();
  readonly eventContextMenu = output<{ event: SchedulerEvent; position: { x: number; y: number } }>();
  readonly eventDragStart = output<SchedulerEvent>();
  readonly eventDragEnd = output<{ event: SchedulerEvent; revert: () => void }>();
  readonly eventDrop = output<SchedulerMove>();
  readonly eventResize = output<{ event: SchedulerEvent; oldEnd: Date; newEnd: Date }>();
  readonly eventCreate = output<SchedulerCreate>();

  // ── View ──
  readonly viewChange = output<{ view: ViewType; start: Date; end: Date }>();
  readonly dateChange = output<Date>();

  // ── Selection ──
  readonly select = output<{ events: SchedulerEvent[]; range?: { start: Date; end: Date } }>();
  readonly unselect = output<void>();

  // ── Navigation ──
  readonly prevWeek = output<void>();
  readonly nextWeek = output<void>();
  readonly todayClick = output<void>();

  // ── Lifecycle ──
  readonly beforeEventCreate = output<SchedulerEvent>();
  readonly afterEventCreate = output<SchedulerEvent>();
  readonly beforeEventUpdate = output<SchedulerEvent>();
  readonly afterEventUpdate = output<SchedulerEvent>();
  readonly beforeEventDelete = output<SchedulerEvent>();
  readonly afterEventDelete = output<SchedulerEvent>();
```

### 8.3 Methods (exposed via template ref or host)

```typescript
  next(): void;
  previous(): void;
  today(): void;
  goto(date: Date): void;
  setView(type: ViewType): void;
  scrollTo(date: Date, options?: ScrollOptions): void;
  addEvent(event: SchedulerEvent): void;
  updateEvent(id: string, patch: Partial<SchedulerEvent>): void;
  removeEvent(id: string): void;
  selectEvent(id: string): void;
  clearSelection(): void;
  getEventsInRange(start: Date, end: Date): SchedulerEvent[];
  export(format: 'ical' | 'csv'): string;
  print(): void;
```

---

## 9. Public API

### 9.1 provideScheduler()

```typescript
function provideScheduler(config?: SchedulerConfig): Provider[] {
  return [
    { provide: SCHEDULER_CONFIG, useValue: config ?? {} },
    SchedulerEngine,
    // Register default plugins
    ...(config?.plugins ?? []).map(p => ({
      provide: SCHEDULER_PLUGINS,
      useValue: p,
      multi: true,
    })),
  ];
}

interface SchedulerConfig {
  /** Default view type */
  defaultView?: ViewType;
  /** Slot duration in minutes */
  slotDuration?: number;
  /** Snap duration in minutes */
  snapDuration?: number;
  /** First day of week (0=Sun … 6=Sat) */
  firstDayOfWeek?: number;
  /** Locale string */
  locale?: string;
  /** RTL */
  rtl?: boolean;
  /** Business hours */
  businessHours?: WorkingHours;
  /** Plugins to register */
  plugins?: SchedulerPlugin[];
  /** Maximum events per cell before "+N more" */
  maxEventsPerCell?: number;
  /** Event display mode: 'block' | 'dot' | 'list-item' */
  eventDisplay?: 'block' | 'dot' | 'list-item';
  /** Custom theme class */
  themeClass?: string;
}
```

### 9.2 DI Tokens

```typescript
const SCHEDULER_CONFIG = new InjectionToken<SchedulerConfig>('SCHEDULER_CONFIG');
const SCHEDULER_ENGINE = new InjectionToken<SchedulerEngine>('SCHEDULER_ENGINE');
const SCHEDULER_PLUGINS = new InjectionToken<SchedulerPlugin>('SCHEDULER_PLUGINS');
const SCHEDULER_LOCALE = new InjectionToken<string>('SCHEDULER_LOCALE');
const SCHEDULER_I18N = new InjectionToken<SchedulerI18n>('SCHEDULER_I18N');

interface SchedulerI18n {
  dayNames: string[];
  dayNamesShort: string[];
  monthNames: string[];
  monthNamesShort: string[];
  allDayLabel: string;
  noEventsLabel: string;
  moreLabel: string;
  todayLabel: string;
  previousLabel: string;
  nextLabel: string;
}
```

---

## 10. Performance Strategy

### 10.1 Virtual Scrolling

For 10k+ events, the VirtualScrollPlugin replaces the DOM with a windowed
renderer:

- **Time grid vertical axis:** Only render rows visible in the viewport + buffer
- **Time grid horizontal axis (week):** 7 columns always visible, no virtual scroll needed
- **Month grid:** Window render cells (only visible weeks + buffer)
- **Timeline:** Virtual scroll both axes

### 10.2 Memoization

```typescript
// Engine computes derived state only when inputs change
readonly visibleEvents = computed(() => {
  const events = this.events();
  const range = this.viewState();
  return this._filterByRange(events, range.rangeStart, range.rangeEnd);
}, { equal: (a, b) => a.length === b.length && a[0]?.id === b[0]?.id });

// View model computes slot layout only when events or range changes
readonly layout = computed(() => {
  const events = this.visibleEvents();
  const slots = this.slots();
  return this._computeLayout(events, slots);
});
```

### 10.3 Minimal DOM Updates

- Use `@for` with `track event.id` for stable event list rendering
- Use `@if` with signal-based conditions for show/hide
- Avoid `detectChanges()` — rely entirely on signal reactivity
- Use `ChangeDetectionStrategy.OnPush` on every component
- Run timers (`now` signal) outside Angular zone via `NgZone.runOutsideAngular()`

### 10.4 Bundle Tree-Shaking

- Each plugin is a separate entry point (`@ngxsmk/cdk/scheduler/plugins/drag`)
- View models are separate entry points (`@ngxsmk/cdk/scheduler/view-models/time-grid`)
- Consumers only pay for what they import

---

## 11. Accessibility Strategy

### 11.1 ARIA Roles

| Element | Role | Attributes |
|---------|------|------------|
| Scheduler container | `role="application"` | `aria-label="Scheduler"` |
| Time grid | `role="grid"` | `aria-label="Week of Jan 1"` |
| Day column | `role="columnheader"` | `aria-label="Monday, Jan 1"` |
| Time slot | `role="gridcell"` | `aria-label="9:00 AM – 9:30 AM"` |
| Event chip | `role="button"` | `aria-label="Standup, 9:00 AM – 9:30 AM"`, `tabindex="0"` |
| All-day row | `role="row"` | |
| Navigation | `role="toolbar"` | `aria-label="Scheduler navigation"` |

### 11.2 Keyboard Interactions

| Key | Action |
|-----|--------|
| Arrow keys | Navigate between cells |
| Enter / Space | Select focused event or create event at focused cell |
| Delete / Backspace | Delete selected event |
| Escape | Clear selection, cancel drag |
| Tab | Move focus between events and controls |
| Shift+Arrow | Extend selection |
| Ctrl+A | Select all events in view |
| Ctrl+Z / Ctrl+Y | Undo / Redo |
| Home / End | Jump to first / last visible cell |
| Page Up / Down | Previous / next week |

### 11.3 Screen Reader

- Live region announces: "Event created", "Event moved to Monday 9 AM", "3 events on Tuesday"
- Event announcements include time range and resource
- Navigation announces current position: "Focused on Wednesday 2 PM"

---

## 12. Responsive Strategy

```typescript
// Consumer configures breakpoint → view mapping
provideScheduler({
  responsive: {
    desktop: '(min-width: 1024px)',
    tablet: '(min-width: 640px) and (max-width: 1023px)',
    mobile: '(max-width: 639px)',
  },
  defaultViews: {
    desktop: 'timeGridWeek',
    tablet: 'timeGrid3Day',
    mobile: 'timeGridDay',
  },
});
```

### 12.1 Mobile Adaptations

- **Navigation:** Swipe left/right to navigate (gesture plugin)
- **Event tap:** Opens detail sheet (bottom sheet or dialog)
- **Drag:** Long-press to initiate drag
- **Time labels:** Collapsed to show only business hours
- **All-day row:** Hidden by default, expandable
- **Header:** Simplified to date + nav arrows only

---

## 13. View Models

### 13.1 TimeGrid ViewModel

Computes the layout for day/week/3-day/work-week views:

```typescript
interface TimeGridSlot {
  start: Date;
  end: Date;
  hour: number;
  minute: number;
  isBusinessHours: boolean;
  isWeekend: boolean;
  isToday: boolean;
}

interface TimeGridColumn {
  date: Date;
  isToday: boolean;
  isWeekend: boolean;
  isPast: boolean;
  dayLabel: string;
  slots: TimeGridSlot[];
  events: LayoutEvent[];
}

interface LayoutEvent {
  event: SchedulerEvent;
  top: number;          // px from top of column
  height: number;       // px
  left: number;         // percentage (for overlap stacking)
  width: number;        // percentage (for overlap stacking)
  zIndex: number;
  column: number;       // which overlap column
  totalColumns: number; // total overlapping events
}
```

### 13.2 MonthGrid ViewModel

```typescript
interface MonthGridCell {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  events: SchedulerEvent[];
  moreCount: number;      // events beyond maxEventsPerCell
}

interface MonthGridWeek {
  cells: MonthGridCell[];
  weekNumber: number;
}
```

### 13.3 Agenda ViewModel

```typescript
interface AgendaGroup {
  date: Date;
  dayLabel: string;
  isToday: boolean;
  events: SchedulerEvent[];
}
```

---

## 14. Component Architecture

### 14.1 Component Hierarchy

```
NgxsmkSchedulerComponent          (orchestrator — template + DI wiring)
├── SchedulerHeaderComponent      (nav + title + optional toolbar slot)
│   ├── NavPrevButton              (projected or default)
│   ├── NavTitle                   (computed date range)
│   ├── NavNextButton              (projected or default)
│   └── ToolbarSlot               (portal outlet for custom toolbar)
├── SchedulerDayHeadersComponent  (column headers)
│   └── DayHeader × N             (projected or default, per day)
├── SchedulerAllDayComponent      (optional all-day row)
│   └── AllDayCell × N
├── SchedulerTimeGridComponent    (scrollable time grid — main body)
│   ├── TimeColumnComponent       (sticky left gutter with time labels)
│   │   └── TimeLabel × 24
│   ├── DayColumnComponent × 7    (one per visible day)
│   │   ├── HourLine × 24
│   │   ├── EventChip × N         (positioned absolutely)
│   │   │   └── ResizeHandle      (bottom edge, optional)
│   │   ├── NowIndicator           (if today)
│   │   └── SelectionOverlay       (if selecting)
│   └── DropIndicator              (if dragging)
├── SchedulerTooltipComponent     (floating, portal-rendered)
└── SchedulerContextMenuComponent (floating, portal-rendered)
```

### 14.2 Dependency Injection Chain

```
SCHEDULER_CONFIG → SchedulerConfig
SCHEDULER_ENGINE → SchedulerEngine (singleton per scheduler instance)
SCHEDULER_PLUGINS → SchedulerPlugin[] (multi-provider)
SCHEDULER_I18N → SchedulerI18n
SCHEDULER_LOCALE → string
```

---

## 15. Example: Building a Hospital Scheduler

```typescript
@Component({
  standalone: true,
  imports: [NgxsmkScheduler, NgxsmkSchedulerModule],
  template: `
    <ngxsmk-scheduler
      [(events)]="appointments"
      [resources]="rooms"
      [view]="'timeGridWeek'"
      [slotDuration]="15"
      [businessHours]="{ days: [1,2,3,4,5], ranges: [[480, 1200]] }"
      (eventClick)="openAppointment($event)"
      (eventDrop)="reschedule($event)"
    >
      <!-- Custom event chip: show patient name + room -->
      <ng-template schedulerEvent let-event>
        <div class="appointment-chip" [style.background]="event.color">
          <span class="patient">{{ event.title }}</span>
          <span class="room">{{ event.meta?.room }}</span>
          <span class="time">{{ event.start | date:'HH:mm' }}</span>
        </div>
      </ng-template>

      <!-- Custom time labels: show 15-min increments -->
      <ng-template schedulerTimeLabel let-hour let-minute>
        @if (minute === 0) {
          {{ hour | number }}:00
        }
      </ng-template>

    </ngxsmk-scheduler>
  `,
})
export class HospitalSchedulePage {
  appointments = signal<SchedulerEvent[]>([]);
  rooms = signal<SchedulerResource[]>([
    { id: 'r1', title: 'Room 101', color: '#4caf50' },
    { id: 'r2', title: 'Room 102', color: '#2196f3' },
    { id: 'r3', title: 'Room 103', color: '#ff9800' },
  ]);
}
```

---

## 16. Example: Building a Factory Shift Planner

```typescript
@Component({
  template: `
    <ngxsmk-scheduler
      [(events)]="shifts"
      [resources]="lines"
      [view]="'timeline'"
      [slotDuration]="60"
      [firstDayOfWeek]="1"
      (eventDrop)="onShiftMoved($event)"
    >
      <ng-template schedulerEvent let-event>
        <shift-chip [shift]="event" />
      </ng-template>

      <ng-template schedulerResource let-resource>
        <div class="line-header">
          <mat-icon>precision_manufacturing</mat-icon>
          {{ resource.title }}
        </div>
      </ng-template>
    </ngxsmk-scheduler>
  `,
})
export class ShiftPlannerPage { ... }
```

---

## 17. Implementation Phases

### Phase 1 — Core Engine + Time Grid (MVP)
- `SchedulerEngine` (signals-based state machine)
- `TimeGridViewModel` (week/day/3-day/work-week)
- `NgxsmkSchedulerComponent` (shell with template outlets)
- Default header, day headers, time labels, event chips
- CSS variable system + default theme
- Navigation (prev/next/today/goto)
- Current time indicator
- All-day events row
- Basic click-drag event creation
- Drag-to-move events
- Responsive breakpoint → view mapping
- `provideScheduler()` DI config

### Phase 2 — Plugins
- DragPlugin (full pointer-based drag with keyboard fallback)
- ResizePlugin (bottom-edge handle)
- SelectionPlugin (range + multi-select)
- TooltipPlugin (hover/focus)
- KeyboardPlugin (full arrow-key navigation)
- RecurrencePlugin (RRULE expansion)

### Phase 3 — Additional Views
- MonthGrid view
- Agenda view
- Timeline view (resource-based)

### Phase 4 — Advanced Features
- VirtualScrollPlugin (10k+ events)
- TimezonePlugin
- UndoPlugin
- PrintPlugin
- ExportPlugin (iCal/CSV)
- Context menu
- Copy/paste/duplicate
- Working hours highlighting

### Phase 5 — Polish
- Animation library (enter/exit/move transitions)
- Loading skeletons
- Empty state illustrations
- Print stylesheet
- Comprehensive ARIA implementation
- Mobile gesture plugin (swipe, long-press)

---

## 18. Migration Path

The current `NgxsmkScheduler` has:
- `events` model
- `weekStart` input
- `eventMoved` output
- `eventCreated` output
- `prevWeek` / `nextWeek` outputs

The new component will:
1. Keep `events` model (backward compatible)
2. Replace `weekStart` with `date` input
3. Add `view` input (defaults to `timeGridWeek`)
4. Keep `eventMoved` as `eventDrop` (rename for clarity)
5. Keep `eventCreated` (same name)
6. Keep `prevWeek`/`nextWeek` (still useful)
7. Add `provideScheduler()` for configuration

The existing demo usage:
```html
<ngxsmk-scheduler [(events)]="events" [weekStart]="weekStart" />
```
Will continue to work with the new component — `weekStart` becomes an alias
for `date` for backward compatibility.

---

## 19. Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Headless vs monolithic | Headless | Maximum flexibility; consumers build their own UI |
| CSS vars vs SCSS vars | CSS vars | Runtime theming, no build step, works in any framework |
| Template portals vs content projection | Template portals | Named templates with typed context > untyped `<ng-content>` |
| CDK DragDrop vs native HTML5 DnD | Pointer Events | CDK uses `@Input()` decorators (not signals); pointer events give full control |
| Plugin system vs config object | Plugin system | Extensibility without bloating the core; tree-shakeable |
| Virtual scroll vs always-render | Plugin-based | Most apps <1k events; virtual scroll is opt-in for scale |
| Separate CDK package vs inline | Separate CDK | Reusable across multiple UI libraries; keeps core thin |
| Signal-based engine | Signals | Angular-native reactivity; no RxJS dependency for core state |

---

## 20. Success Criteria

- [ ] A developer can build a Google Calendar clone using only `@ngxsmk/core/scheduler`
- [ ] A developer can build a hospital booking system with the same component
- [ ] All visual properties are customizable via CSS variables
- [ ] Every visual element is replaceable via `ng-template`
- [ ] 10,000 events render in < 200ms with VirtualScrollPlugin
- [ ] Full keyboard navigation without a mouse
- [ ] Screen reader announces all meaningful interactions
- [ ] Works on mobile (320px) through desktop (2560px)
- [ ] Bundle size < 15kB gzipped for basic usage (no plugins)
- [ ] TypeScript types are excellent — autocomplete works for all options
