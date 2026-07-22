# Advanced Scheduler — Research Findings

**Date:** 2026-07-22
**Scope:** Research for enhancing `ngxsmk-scheduler` from a simple 7-day grid to a feature-rich calendar component.

---

## 1. Angular CDK DragDrop

### Does `@angular/cdk/drag-drop` exist?

**Yes.** The Angular CDK includes a comprehensive drag-drop module at `@angular/cdk/drag-drop`. It provides `CdkDrag`, `CdkDragHandle`, `CdkDragPreview`, `CdkDragPlaceholder`, `CdkDropList`, and `CdkDropListGroup` directives.

**Source:** https://github.com/angular/components/tree/main/src/cdk/drag-drop

### What does it provide over native HTML5 drag?

| Feature | Native HTML5 DnD | Angular CDK DragDrop |
|---------|------------------|---------------------|
| Touch support | **Limited/broken** — Chrome on Android since 2016, iOS Safari since 2021, Firefox Android since v124. Accessibility services on Android can block it entirely. | **Full touch+mouse+pen** — unified Pointer Events abstraction |
| Keyboard support | **None** — requires mouse | **Full** — arrow keys for movement, handle focus |
| Preview/placeholder | Browser-dependent translucent ghost | Custom `cdkDragPreview` and `cdkDragPlaceholder` templates |
| Axis locking | Manual math | `cdkDragLockAxis="x\|y"` |
| Boundary constraints | Manual bounding-box checks | `cdkDragBoundary` input |
| Drop lists | Manual `dragover`/`drop` event wiring | `CdkDropList` with automatic registration, `cdkDropListConnectedTo` |
| Sorting | Manual DOM measurement | `cdkDropListSortPredicate`, automatic reordering |
| Auto-scrolling | Manual implementation | Built-in scroll-while-dragging |
| RTL support | Manual | Built-in via `Directionality` |

**Sources:**
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- https://bugzilla.mozilla.org/show_bug.cgi?id=1764177
- https://github.com/angular/components/blob/main/src/cdk/drag-drop/directives/drag.ts

### Angular 22 Signals/Zoneless Compatibility

The CDK DragDrop directive source (`drag.ts`) still uses:
- `@Input()` / `@Output()` decorators (not signal-based `input()` / `output()`)
- `NgZone.runOutsideAngular()` for performance-critical listeners
- `BehaviorSubject`, `Subject`, `Observable` (RxJS)

**However, it IS compatible with zoneless apps** because:
1. It uses `ChangeDetectorRef` and signals internally in `DragDropRegistry` (`WritableSignal<DragRef[]>`)
2. `NgZone.run()` / `NgZone.runOutsideAngular()` are **no-ops in zoneless mode** — they don't break anything, they just do nothing
3. The Angular team is progressively refactoring Material/CDK for signals (tracked in [angular/components#32132](https://github.com/angular/components/issues/32132))

**Key risk:** CDK DragDrop is not yet fully signals-native. Using `@Input()` decorators means consumers can't pass signal values directly without unwrapping. For a fully signals-first library like NGXSMK, this is a minor ergonomic concern but not a blocker.

**Sources:**
- https://github.com/angular/components/blob/main/src/cdk/drag-drop/directives/drag.ts (lines 1-80: inject pattern, NgZone usage)
- https://github.com/angular/components/issues/32132 (signals migration tracking)
- https://angular.dev/guide/zoneless (zoneless compatibility guide)

---

## 2. HTML5 Drag and Drop Limitations

### Touch Support — Critical Gap

The HTML5 Drag and Drop API has **severely limited touch support**:

| Platform | Status |
|----------|--------|
| Chrome on Android | Supported since Android 7 (2016), but **broken when accessibility gesture/touch exploration is enabled** |
| Android WebView | Same as Chrome |
| Safari on iOS | Supported since iOS 15 (September 2021) |
| Firefox on Android | Supported since v124 (March 2024) — was an outlier for years |
| Firefox on Desktop | Supported on Windows since 2012; macOS/Linux only mouse-based |

**Activating touch drag:** On mobile, users must **long-press** then drag (vs. double-tap on desktop Windows).

**Source:** https://bugzilla.mozilla.org/show_bug.cgi?id=1764177

### Known Limitations

1. **No keyboard accessibility** — drag-and-drop has zero keyboard support in the native API. Users must use mouse/touch.
2. **Text selection blocked** — making an element `draggable="true"` prevents normal text selection inside it (users must hold Alt to select text).
3. **Data store is string-only** — `DataTransfer.setData()` only accepts strings; complex objects must be serialized.
4. **Drop target requires `preventDefault()`** — elements don't accept drops by default.
5. **Input events suppressed** — during drag, all mouse/keyboard events are suppressed.
6. **No custom drag image on mobile** — `setDragImage()` has no effect on touch devices.
7. **Inconsistent cross-browser behavior** — ghost image rendering, drop effect icons, and timing vary.

**Sources:**
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API
- https://html.spec.whatwg.org/multipage/dnd.html
- https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations

### Recommendation for NGXSMK

The current scheduler uses native HTML5 DnD (`draggable="true"` + drag events). For a production UI kit:
- **Replace with CDK DragDrop** for consistent touch/keyboard support
- **Or** use Pointer Events + custom drag logic for maximum control (as Angular Material team itself recommends for custom UX patterns)

---

## 3. Calendar/Scheduler UX Patterns

### FullCalendar (v7) — Industry Reference

FullCalendar is the most widely used open-source calendar library. Its view types and features define the baseline expectation:

**Views:**
- **TimeGrid** — hourly slots, day or week span (the "schedule" view)
- **DayGrid** — month view with event pills
- **List** — linear event list
- **Timeline** — resource-based horizontal timeline (premium)

**Key features:**
- Event creation via **click + drag** on empty time slots
- Event **resize** by dragging the bottom edge
- **Multi-day events** displayed as spanning bars across day columns
- **Current time indicator** — red line that auto-updates
- **View switching** via toolbar buttons (month/week/day)
- **All-day event row** at top of TimeGrid

**Sources:**
- https://fullcalendar.io/docs (TimeGrid, DayGrid, List views)
- https://fullcalendar.io/docs/timegrid-view

### Google Calendar / Outlook Patterns

| Pattern | Google Calendar | Outlook |
|---------|----------------|---------|
| Hourly grid | 24h vertical slots, 30-min increments | Same, with 15-min sub-lines |
| Event creation | Click empty slot → modal opens with pre-filled time | Same |
| Drag to move | Pointer down on event → drag to new time/day | Same |
| Resize | Drag bottom edge handle | Same |
| Multi-day | Spans full width at top of week view | Same |
| Current time | Red line with pulsing dot | Red line |
| Day/week/month | Toggle buttons in header | Tabs |

### Common UX Patterns Summary

1. **Hourly grid (7×24 = 168 cells):** Vertical time axis on left, 7 day columns. Each hour is a row; 30-min or 15-min sub-divisions optional.
2. **Click-drag creation:** User mousedown on empty slot, drags to define duration, releases to open creation dialog.
3. **Event resize:** Small handle at bottom of event chip; drag to change end time.
4. **Multi-day events:** Rendered as a horizontal bar spanning across multiple day columns, usually in a dedicated "all-day" row above the time grid.
5. **Current time indicator:** A `<div>` absolutely positioned at `top: (currentHour × hourHeight) + (currentMinute / 60 × hourHeight)`, updated via `setInterval` every minute.
6. **View switching:** Controlled by an `input()` signal (`view: 'week' | 'day' | 'month'`), re-rendering the grid accordingly.

---

## 4. Performance Considerations

### The 7×24 Grid Problem

A weekly time-slot view has **7 × 24 = 168 cells** minimum. With 30-minute slots: **336 cells**. With 15-minute slots: **672 cells**.

Each cell may contain:
- Multiple event chips (with click handlers, drag handlers)
- A background grid line
- Time labels (left axis)

**Total DOM elements estimate (30-min slots):**
- Grid cells: 336
- Time labels: 48 (24 hours × 2 half-day labels)
- Event chips: variable (assume avg 2 per day = 14)
- Total: ~400 elements

### Is Virtual Scrolling Needed?

**Angular CDK Virtual Scrolling** (`@angular/cdk/scrolling`) is designed for lists with **1,000+ items**. Key facts:

- `cdk-virtual-scroll-viewport` only renders items that fit on-screen plus a buffer
- `FixedSizeVirtualScrollStrategy` is fastest (items must be same height)
- `AutoSizeVirtualScrollStrategy` exists in `@angular/cdk-experimental` (not production-ready)

**For a 7×24 grid (~400 cells):**
- **Virtual scrolling is NOT needed** — 400 DOM elements is trivial for modern browsers
- The grid is 2D, but CDK virtual scroll is 1D (list-based). Adapting it for a time×day grid would require custom `VirtualScrollStrategy` or splitting into 7 column viewports
- The **vertical axis (time)** could theoretically use virtual scrolling if users scroll through 24 hours, but most calendar UIs show 8-12 visible hours and let users scroll the rest

**When virtual scrolling WOULD be needed:**
- Month view with many events (100+ events per month rendered simultaneously)
- Multi-resource timeline (100+ resources × time slots)
- Infinite-scrolling list view

**Optimization recommendations instead:**
1. **CSS containment** — `contain: layout style paint` on each cell
2. **`OnPush` change detection** — already used in current component
3. **Track by stable ID** — `@for` with `track event.id`
4. **Lazy event rendering** — only render events for visible time range
5. **Use `minmax(0, 1fr)` in grid** — per AGENTS.md convention, prevents overflow

**Sources:**
- https://github.com/angular/components/blob/main/src/cdk/scrolling/scrolling.md
- https://web.dev/articles/virtualize-lists-with-angular-cdk
- https://github.com/angular/components/pull/31316 (zoneless virtual scroll fix — signals/effects used internally)

---

## 5. Accessibility

### W3C WAI-ARIA — No Dedicated Drag-and-Drop Pattern

The [WAI-ARIA Authoring Practices Guide (APG)](https://www.w3.org/WAI/ARIA/apg/patterns/) does **not include a dedicated drag-and-drop pattern**. This is a known gap in the accessibility specification.

**Relevant patterns that apply:**

#### Grid Pattern (ARIA `grid` role)
最适合 calendar view:
- Container has `role="grid"`
- Rows have `role="row"`
- Cells have `role="gridcell"` (or `columnheader`/`rowheader`)
- **Keyboard navigation:** Arrow keys move between cells, Home/End for row bounds, Page Up/Down for scrolling
- **Focus management:** Only one cell in the grid is in the tab sequence
- **Selection:** `aria-selected="true"` on selected cells

**Source:** https://www.w3.org/WAI/ARIA/apg/patterns/grid/

#### Drag-and-Drop Accessibility Requirements

Since no ARIA pattern exists for DnD, best practices from W3C and industry:

1. **Keyboard alternative required** — Every drag-and-drop action MUST have a keyboard-accessible alternative:
   - Arrow keys to move selected event
   - Enter/Space to pick up / drop
   - Escape to cancel
   - Visual feedback for current position

2. **ARIA attributes for drag state:**
   - `aria-grabbed="true"` on dragged item (deprecated in ARIA 1.1 but still widely used)
   - `aria-dropeffect="move|copy"` on valid drop targets
   - `aria-live` region to announce "Item picked up", "Item moved to Monday 9am", "Drop cancelled"

3. **Screen reader announcements:**
   - On grab: "Grabbed [event name]. Use arrow keys to move, Enter to drop, Escape to cancel."
   - On move: "Moved to [day] [time]"
   - On drop: "Dropped [event name] at [day] [time]"

4. **Visual focus indicators** — High-contrast outline on focused/dragged event

5. **Touch accessibility** — Long-press to grab, then drag (matches native mobile DnD activation)

**Sources:**
- https://www.w3.org/WAI/ARIA/apg/patterns/grid/
- WAI-ARIA 1.2 specification: https://www.w3.org/TR/wai-aria-1.2/

### Angular CDK DragDrop Accessibility

CDK DragDrop provides:
- Keyboard support via handles (arrow keys for movement)
- Focus styles
- But does NOT automatically add ARIA `aria-grabbed`/`aria-dropeffect` — this must be added manually

---

## 6. Summary — Recommended Architecture for Advanced Scheduler

### View Modes
```
input view = signal<'dayGridWeek' | 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('timeGridWeek');
```

### Core Data Model
```typescript
interface SchedulerEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  // For multi-day events
  resourceId?: string;
}
```

### New Outputs/Models
```typescript
// Event creation via click-drag
eventCreated = output<SchedulerEvent>();

// Event resize
eventResized = output<{ event: SchedulerEvent; oldEnd: Date; newEnd: Date }>();

// View change
viewChanged = output<{ view: string; start: Date; end: Date }>();

// Date navigation
dateChanged = output<Date>();
```

### Drag-and-Drop Strategy
- **Use CDK DragDrop** (`CdkDrag` + `CdkDropList`) for cross-day event moves
- Add custom **resize handle** at bottom of event chips (small div with `cursor: ns-resize`)
- Implement **click-drag creation** via Pointer Events on empty cells
- Add **keyboard DnD** alternative (Arrow + Enter/Escape)

### Rendering Strategy
- **TimeGrid (week/day):** CSS Grid with `grid-template-rows: repeat(48, 1fr)` for 30-min slots
- **DayGrid (month):** CSS Grid 7 columns, variable rows per week
- **Current time indicator:** Absolutely positioned `<div>` updated via `setInterval` (use `afterNextRender` + `DestroyRef` cleanup)
- **No virtual scrolling needed** for the grid itself (< 700 cells)
- **All-day events row:** Separate section above the time grid

### Accessibility Checklist
- [ ] `role="grid"` on calendar container
- [ ] `role="row"` on each hour/week-row
- [ ] `role="gridcell"` on each time slot
- [ ] Arrow key navigation between cells
- [ ] Keyboard drag-and-drop (grab → move → drop)
- [ ] `aria-live` announcements for DnD operations
- [ ] Focus management for modal creation/edit dialogs
