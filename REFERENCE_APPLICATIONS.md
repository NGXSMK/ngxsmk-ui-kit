# NGXSMK 7 Real-World Reference Applications & Architectural Blueprints

> **Mission**: Validate NGXSMK components in realistic, complex, multi-component enterprise compositions rather than isolated demos. Ensure flawless real-world UX, keyboard accessibility, responsiveness, and zoneless performance.

---

```
┌────────────────────────────────────────────────────────────────────────┐
│               NGXSMK 7 REAL-WORLD REFERENCE APPLICATIONS               │
├─────────────────┬─────────────────┬──────────────────┬─────────────────┤
│  1. SaaS        │  3. Analytics   │  5. E-Commerce   │  7. Mobile First│
│     Dashboard   │     Platform    │     Storefront   │     Responsive  │
├─────────────────┼─────────────────┼──────────────────┼─────────────────┤
│  2. Enterprise  │  4. AI Agent    │  6. Project Mgmt │  Vitest E2E     │
│     Admin       │     Workflow    │     Kanban & Gant│  Stress Suite   │
└─────────────────┴─────────────────┴──────────────────┴─────────────────┘
```

---

## 1. SaaS Dashboard Application

### 1.1 Architecture & Component Composition

- **Layout**: Fluid sidebar navigation (`NgxsmkNavHeadingMenu`), header with command palette hotkey (`NgxsmkPowerSearch`, `NgxsmkKbd`), notification drawer trigger (`NgxsmkBadge`), and user avatar profile menu.
- **Main View**:
  - Top Metrics Grid: 4 `NgxsmkStatTrendCard` instances with sparkline trends.
  - Active Workspaces: `NgxsmkTabs` switching between 'Production Cluster', 'Staging', and 'Edge Regions'.
  - Live Activity Stream: `NgxsmkTable` with status badges (`NgxsmkBadge`), real-time alert banner (`NgxsmkAlert`).

### 1.2 Key Signals Graph

```ts
readonly activeWorkspace = signal<'prod' | 'staging' | 'edge'>('prod');
readonly monthlyRevenue = signal(84230);
readonly growthRate = computed(() => `+${((this.monthlyRevenue() / 75000 - 1) * 100).toFixed(1)}%`);
```

---

## 2. Enterprise Admin Application

### 2.1 Architecture & Component Composition

- **Role-Based Access Control (RBAC)**: `NgxsmkTransfer` two-column list moving granular permissions between 'Available Roles' and 'Assigned Roles'.
- **Audit Trail & User Table**: `NgxsmkTable` with multi-select checkboxes (`NgxsmkCheckbox`), sortable headers (`NgxsmkTableHeaderCell`), batch actions toolbar, and sticky pagination (`NgxsmkPagination`).
- **Destructive Actions**: Accessible modal dialog (`NgxsmkDialog`) with focus trap, `aria-describedby` warning text, and dual confirmation buttons.

---

## 3. Deep Analytics Platform

### 3.1 Architecture & Component Composition

- **Filtering Bar**: `NgxsmkDateRangePicker` with quick presets (Today, 7D, 30D, YTD) and `NgxsmkSegmentedControl` for granularity (Hourly, Daily, Weekly).
- **Visualization Suite**:
  - Time-series Revenue & Traffic Chart: `NgxsmkBarChart` and `NgxsmkLineChart`.
  - Retention & Activity Heatmap: `NgxsmkCalendarHeatmap`.
  - Metric Summary Cards: `NgxsmkProgressCircle` and `NgxsmkMeter`.
- **Export & Sharing**: `NgxsmkSplitButton` triggering CSV, JSON, or PDF download.

---

## 4. AI Assistant & Agent Workflow Application

### 4.1 Architecture & Component Composition

- **Conversational Chat**: `NgxsmkAiChat` with auto-resizing composer textarea (`NgxsmkPromptInput`), model picker select dropdown (`gemini-2.5-pro`, `claude-3.5-sonnet`), and streaming text renderer (`NgxsmkStreamingText`).
- **Reasoning Inspector**: `NgxsmkReasoningTimeline` displaying expandable thought chains, glowing pulse status indicator (`NgxsmkAiThinkingIndicator`), and token cost metrics (`NgxsmkTokenCounter`).
- **Artifacts & Diff Viewer**: Side-by-side code difference generator (`NgxsmkDiffViewer`) and terminal log output (`NgxsmkTerminal`).

---

## 5. E-Commerce Storefront Application

### 5.1 Architecture & Component Composition

- **Faceted Product Filter**: Left-pane accordion (`NgxsmkAccordion`) with multi-select category checkboxes (`NgxsmkCheckboxList`), price range slider (`NgxsmkRangeSlider`), and active tag dismissals (`NgxsmkTag`).
- **Product Grid**: Responsive card grid with product thumbnail image viewer (`NgxsmkImageViewer`), star rating score (`NgxsmkRating`), price badge (`NgxsmkBadge`), and primary 'Add to Cart' button (`NgxsmkButton`).
- **Checkout Drawer**: Slide-out drawer sheet with order line items, promo code input (`NgxsmkFormField`, `NgxsmkInputDirective`), and credit card input (`NgxsmkCreditCardInput`) validating card type and Luhn checksum.

---

## 6. Project Management Application (Kanban & Roadmap)

### 6.1 Architecture & Component Composition

- **Kanban Board**: `NgxsmkKanbanBoard` with customizable column lanes (Backlog, In Progress, Code Review, Done), draggable task cards with avatar stack assignment (`NgxsmkAvatar`), and priority badges.
- **Sprint Overview**: Progress percentage meter (`NgxsmkProgress`), timeline stepper milestones (`NgxsmkTimelineStepper`), and digital signature sign-off pad (`NgxsmkSignaturePad`).
- **Task Detail Modal**: Slide-over drawer sheet with file upload dropzone (`NgxsmkFileUpload`), markdown description editor (`NgxsmkCodeEditor`), and comment stream.

---

## 7. Mobile-First Responsive Application

### 7.1 Architecture & Component Composition

- **Mobile Ergonomics**:
  - Touch Target Guard: All interactive elements strictly adhere to **48×48px** touch target minimums (`--ngxsmk-touch-target-min`).
  - Bottom Navigation Dock: `NgxsmkDock` fixed to bottom viewport with active tab highlights.
  - Slide-out Mobile Drawer: `NgxsmkDrawer` anchored to viewport edges with gesture dismissals.
  - Pull-to-refresh & Virtual List: `NgxsmkVirtualScroll` handling thousands of feed cards smoothly without frame drops.
  - Skip Link: Accessible skip navigation anchor (`NgxsmkSkipLink`) for mobile switch/keyboard accessibility.

---

## 8. Automated Verification & Stress Testing

All 7 reference applications are continuously instantiated, mounted, and tested in [`packages/core/src/reference-apps.spec.ts`](file:///d:/My%20Projects/ngxsmk-ui-kit/packages/core/src/reference-apps.spec.ts) to verify zero runtime exceptions, clean signal graph updates, and 100% zoneless change detection stability.
