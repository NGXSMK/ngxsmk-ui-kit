import { NgxsmkScheduler } from '@ngxsmk/core/scheduler';
import type { SchedulerEvent, ViewType } from '@ngxsmk/cdk/scheduler';
import {
  type DiagramNode,
  NgxsmkDiagramBuilder,
  type DiagramEdge,
} from '@ngxsmk/core/diagram-builder';
import {
  type QueryField,
  NgxsmkQueryBuilder,
  type QueryCondition,
} from '@ngxsmk/core/query-builder';
import { NgxsmkTimelineGantt, type GanttItem } from '@ngxsmk/core/timeline-gantt';
import { NgxsmkWorkflowBuilder, type WorkflowNode } from '@ngxsmk/core/workflow-builder';
import { NgxsmkRuleBuilder, type RuleGroup } from '@ngxsmk/core/rule-builder';
import { NgxsmkSpreadsheet, provideSpreadsheet, SPREADSHEET_ENGINE } from '@ngxsmk/core/spreadsheet';
import type { ColumnDef, RowDef } from '@ngxsmk/cdk/spreadsheet';
import { NgxsmkPivotTable, type PivotRow } from '@ngxsmk/core/pivot-table';
import { NgxsmkFlowEditor } from '@ngxsmk/core/flow-editor';
import { NgxsmkJsonViewer } from '@ngxsmk/core/json-viewer';
import { NgxsmkTerminal } from '@ngxsmk/core/terminal';
import { NgxsmkOrgChart, type OrgNode } from '@ngxsmk/core/org-chart';
import { type KanbanColumn, NgxsmkKanbanBoard } from '@ngxsmk/core/kanban-board';
import { NgxsmkInputGroup } from '@ngxsmk/core/input-group';
import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'enterprise-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkKanbanBoard,
    NgxsmkScheduler,
    NgxsmkTimelineGantt,
    NgxsmkWorkflowBuilder,
    NgxsmkRuleBuilder,
    NgxsmkSpreadsheet,
    NgxsmkPivotTable,
    NgxsmkDiagramBuilder,
    NgxsmkFlowEditor,
    NgxsmkJsonViewer,
    NgxsmkTerminal,
    NgxsmkOrgChart,
    NgxsmkQueryBuilder,
    NgxsmkInputGroup,
    TranslatePipe,
  ],
  template: `
    <h2 class="ngxsmk-page-title">{{ 'category.enterprise' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'enterprise.pageDesc' | translate }}
    </p>

    <showcase-example
      title="Kanban Board"
      [description]="'enterprise.kanbanDesc' | translate"
      [code]="codeKanban"
      [component]="NgxsmkKanbanBoard"
      [customize]="customizeNgxsmkKanbanBoard"
    >
      <div class="ngxsmk-sc-surface" style="height:340px;overflow:auto;">
        <ngxsmk-kanban-board [columns]="kanbanColumns" />
      </div>
    </showcase-example>

    <showcase-example
      title="Scheduler"
      [description]="'enterprise.schedulerDesc' | translate"
      [code]="codeScheduler"
      [component]="NgxsmkScheduler"
      [customize]="customizeNgxsmkScheduler"
    >
      <div class="ngxsmk-sc-surface" style="height:340px;overflow:hidden;">
        <ngxsmk-scheduler
          [events]="schedulerEvents()"
          [view]="schedulerView()"
          (viewChange)="schedulerView.set($event.view)"
          (eventCreate)="onSchedulerCreate($event)"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="Timeline Gantt"
      [description]="'enterprise.timelineGanttDesc' | translate"
      [code]="codeGantt"
      [component]="NgxsmkTimelineGantt"
      [customize]="customizeNgxsmkTimelineGantt"
    >
      <div class="ngxsmk-sc-surface ngxsmk-scroll-x">
        <ngxsmk-timeline-gantt [items]="ganttItems" />
      </div>
    </showcase-example>

    <showcase-example
      title="Workflow Builder"
      [description]="'enterprise.workflowDesc' | translate"
      [code]="codeWorkflow"
      [component]="NgxsmkWorkflowBuilder"
      [customize]="customizeNgxsmkWorkflowBuilder"
    >
      <div style="height:420px;overflow:auto;">
        <ngxsmk-workflow-builder [nodes]="workflowNodes" [edges]="workflowEdges" />
      </div>
    </showcase-example>

    <showcase-example
      title="Rule Builder"
      [description]="'enterprise.ruleDesc' | translate"
      [code]="codeRule"
      [component]="NgxsmkRuleBuilder"
      [customize]="customizeNgxsmkRuleBuilder"
    >
      <div class="ngxsmk-sc-col" style="max-width:520px;">
        <ngxsmk-rule-builder [group]="ruleGroup" />
      </div>
    </showcase-example>

    <showcase-example
      title="Spreadsheet"
      [description]="'enterprise.spreadsheetDesc' | translate"
      [code]="codeSpreadsheet"
      [component]="NgxsmkSpreadsheet"
      [customize]="customizeNgxsmkSpreadsheet"
    >
      <div style="height:260px;overflow:auto;width:100%;">
        <ngxsmk-spreadsheet [columns]="spreadsheetColumns" [rows]="spreadsheetRows" />
      </div>
    </showcase-example>

    <showcase-example
      title="Pivot Table"
      [description]="'enterprise.pivotDesc' | translate"
      [code]="codePivot"
      [component]="NgxsmkPivotTable"
      [customize]="customizeNgxsmkPivotTable"
    >
      <div style="height:280px;overflow:auto;width:100%;">
        <ngxsmk-pivot-table [rows]="pivotRows" [columns]="pivotColumns" rowLabel="Quarter" />
      </div>
    </showcase-example>

    <showcase-example
      title="Diagram Builder"
      [description]="'enterprise.diagramDesc' | translate"
      [code]="codeDiagram"
      [component]="NgxsmkDiagramBuilder"
      [customize]="customizeNgxsmkDiagramBuilder"
    >
      <div class="ngxsmk-sc-surface" style="height:280px;overflow:hidden;">
        <ngxsmk-diagram-builder
          [nodes]="diagramNodes"
          [edges]="diagramEdges"
          (selected)="selectedNode.set($event)"
        />
      </div>
      @if (selectedNode()) {
        <p style="margin:0.5rem 0 0;font-size:var(--ngxsmk-text-body-sm-size);">
          {{ 'enterprise.selectedNode' | translate }} <strong>{{ selectedNode() }}</strong>
        </p>
      }
    </showcase-example>

    <showcase-example
      title="Flow Editor"
      [description]="'enterprise.flowDesc' | translate"
      [code]="codeFlow"
      [component]="NgxsmkFlowEditor"
      [customize]="customizeNgxsmkFlowEditor"
    >
      <div style="height:420px;">
        <ngxsmk-flow-editor title="Onboarding Flow" [nodes]="flowNodes" style="height:100%;" />
      </div>
    </showcase-example>

    <showcase-example
      title="JSON Viewer"
      [description]="'enterprise.jsonDesc' | translate"
      [code]="codeJson"
      [component]="NgxsmkJsonViewer"
      [customize]="customizeNgxsmkJsonViewer"
    >
      <div style="width:100%;max-width:520px;">
        <ngxsmk-json-viewer [data]="jsonData" />
      </div>
    </showcase-example>

    <showcase-example
      title="Terminal"
      [description]="'enterprise.terminalDesc' | translate"
      [code]="codeTerminal"
      [component]="NgxsmkTerminal"
      [customize]="customizeNgxsmkTerminal"
    >
      <div style="width:100%;max-width:600px;">
        <ngxsmk-terminal title="build.log" prompt="$" [lines]="terminalLines" />
      </div>
    </showcase-example>

    <showcase-example
      title="Org Chart"
      [description]="'enterprise.orgDesc' | translate"
      [code]="codeOrg"
      [component]="NgxsmkOrgChart"
      [customize]="customizeNgxsmkOrgChart"
    >
      <div style="height:320px;overflow:auto;width:100%;">
        <ngxsmk-org-chart [nodes]="orgNodes" />
      </div>
    </showcase-example>

    <showcase-example
      title="Query Builder"
      [description]="'enterprise.queryDesc' | translate"
      [code]="codeQuery"
      [component]="NgxsmkQueryBuilder"
      [customize]="customizeNgxsmkQueryBuilder"
    >
      <div class="ngxsmk-sc-col" style="max-width:560px;">
        <ngxsmk-query-builder [fields]="queryFields" [(conditions)]="queryConditions" />
      </div>
    </showcase-example>

    <showcase-example
      title="Input Group"
      [description]="'enterprise.inputGroupDesc' | translate"
      [code]="codeInputGroup"
      [component]="NgxsmkInputGroup"
      [customize]="customizeNgxsmkInputGroup"
    >
      <div class="ngxsmk-sc-col" style="max-width:420px;gap:1.5rem;">
        <ngxsmk-input-group
          label="Email"
          placeholder="you@company.com"
          hint="We'll never share your email."
          type="email"
          [showClear]="true"
        />
        <ngxsmk-input-group
          label="Password"
          placeholder="Enter password"
          type="password"
          [required]="true"
          [showClear]="true"
          variant="filled"
        />
        <ngxsmk-input-group
          label="Username"
          placeholder="Pick a username"
          hint="3-20 characters"
          [minLength]="3"
          [maxLength]="20"
          [showCounter]="true"
          variant="soft"
          [floatingLabel]="true"
        />
        <ngxsmk-input-group
          label="API Key"
          placeholder="sk-..."
          hint="Found in your dashboard settings."
          variant="outlined"
          [loading]="true"
          radius="pill"
          size="lg"
        />
      </div>
    </showcase-example>
  `,
})
export class EnterprisePage {
  protected readonly NgxsmkKanbanBoard = NgxsmkKanbanBoard;
  protected readonly customizeNgxsmkKanbanBoard = `/* Theme <ngxsmk-kanban-board> via design tokens */
ngxsmk-kanban-board {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkScheduler = NgxsmkScheduler;
  protected readonly customizeNgxsmkScheduler = `/* Theme <ngxsmk-scheduler> via design tokens */
ngxsmk-scheduler {
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
}`;
  protected readonly NgxsmkTimelineGantt = NgxsmkTimelineGantt;
  protected readonly customizeNgxsmkTimelineGantt = `/* Theme <ngxsmk-timeline-gantt> via design tokens */
ngxsmk-timeline-gantt {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkWorkflowBuilder = NgxsmkWorkflowBuilder;
  protected readonly customizeNgxsmkWorkflowBuilder = `/* Theme <ngxsmk-workflow-builder> via design tokens */
ngxsmk-workflow-builder {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-sm: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkRuleBuilder = NgxsmkRuleBuilder;
  protected readonly customizeNgxsmkRuleBuilder = `/* Theme <ngxsmk-rule-builder> via design tokens */
ngxsmk-rule-builder {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkSpreadsheet = NgxsmkSpreadsheet;
  protected readonly customizeNgxsmkSpreadsheet = `/* Theme <ngxsmk-spreadsheet> via design tokens */
ngxsmk-spreadsheet {
  --ngxsmk-spreadsheet-bg: ;
  --ngxsmk-spreadsheet-header-bg: ;
  --ngxsmk-spreadsheet-border: ;
  --ngxsmk-spreadsheet-grid-color: ;
  --ngxsmk-spreadsheet-hover-bg: ;
  --ngxsmk-spreadsheet-selected-bg: ;
  --ngxsmk-spreadsheet-active-border: ;
  --ngxsmk-spreadsheet-font: ;
  --ngxsmk-spreadsheet-font-mono: ;
  --ngxsmk-spreadsheet-row-height: ;
  --ngxsmk-spreadsheet-header-height: ;
  --ngxsmk-spreadsheet-cell-padding: ;
  --ngxsmk-spreadsheet-radius: ;
  --ngxsmk-spreadsheet-shadow: ;
}`;
  protected readonly NgxsmkPivotTable = NgxsmkPivotTable;
  protected readonly customizeNgxsmkPivotTable = `/* Theme <ngxsmk-pivot-table> via design tokens */
ngxsmk-pivot-table {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-mono: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
}`;
  protected readonly NgxsmkDiagramBuilder = NgxsmkDiagramBuilder;
  protected readonly customizeNgxsmkDiagramBuilder = `/* Theme <ngxsmk-diagram-builder> via design tokens */
ngxsmk-diagram-builder {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
}`;
  protected readonly NgxsmkFlowEditor = NgxsmkFlowEditor;
  protected readonly customizeNgxsmkFlowEditor = `/* Theme <ngxsmk-flow-editor> via design tokens */
ngxsmk-flow-editor {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-container: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkJsonViewer = NgxsmkJsonViewer;
  protected readonly customizeNgxsmkJsonViewer = `/* Theme <ngxsmk-json-viewer> via design tokens */
ngxsmk-json-viewer {
  --ngxsmk-color-error: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-success: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-color-warning: ;
  --ngxsmk-font-mono: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkTerminal = NgxsmkTerminal;
  protected readonly customizeNgxsmkTerminal = `/* Theme <ngxsmk-terminal> via design tokens */
ngxsmk-terminal {
  --ngxsmk-color-neutral-100: ;
  --ngxsmk-color-neutral-300: ;
  --ngxsmk-color-neutral-400: ;
  --ngxsmk-color-neutral-800: ;
  --ngxsmk-color-neutral-900: ;
  --ngxsmk-color-neutral-950: ;
  --ngxsmk-color-success: ;
  --ngxsmk-font-mono: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-terminal-bg: ;
  --ngxsmk-terminal-fg: ;
  --ngxsmk-terminal-prompt: ;
}`;
  protected readonly NgxsmkOrgChart = NgxsmkOrgChart;
  protected readonly customizeNgxsmkOrgChart = `/* Theme <ngxsmk-org-chart> via design tokens */
ngxsmk-org-chart {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline-variant: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkQueryBuilder = NgxsmkQueryBuilder;
  protected readonly customizeNgxsmkQueryBuilder = `/* Theme <ngxsmk-query-builder> via design tokens */
ngxsmk-query-builder {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-2: ;
}`;

  protected readonly selectedNode = signal<string | null>(null);
  protected readonly NgxsmkInputGroup = NgxsmkInputGroup;

  private readonly weekStart = new Date();

  protected readonly kanbanColumns: KanbanColumn[] = [
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'k1', title: 'Design onboarding flow', description: 'Wireframe the 3-step signup.' },
        { id: 'k2', title: 'Audit color tokens' },
      ],
    },
    {
      id: 'progress',
      title: 'In Progress',
      items: [{ id: 'k3', title: 'Build data table', description: 'Sorting + pagination.' }],
    },
    {
      id: 'review',
      title: 'In Review',
      items: [{ id: 'k4', title: 'Refactor auth guard' }],
    },
    {
      id: 'done',
      title: 'Done',
      items: [{ id: 'k5', title: 'Ship theme engine', description: 'Released in v1.2.' }],
    },
  ];

  protected readonly schedulerView = signal<ViewType>('timeGridWeek');
  protected readonly schedulerEvents = signal<SchedulerEvent[]>([
    this.event('s1', 'Standup', 0, 9, 9.5, '#6750a4'),
    this.event('s2', 'Design review', 1, 11, 12, '#0b57d0'),
    this.event('s3', 'Sprint planning', 2, 14, 15.5, '#0b57d0'),
    this.event('s4', '1:1 with lead', 4, 15, 15.5, '#6750a4'),
    this.event('s5', 'Demo day', 4, 16, 17, '#6750a4'),
    { id: 's6', title: 'Company offsite', start: this.daysOffset(3), end: this.daysOffset(5), allDay: true, color: '#0b57d0' },
  ]);
  protected readonly onSchedulerCreate = (create: { event: SchedulerEvent; day: Date; start: Date; end: Date }) => {
    this.schedulerEvents.update(events => [...events, create.event]);
  };

  protected readonly ganttItems: GanttItem[] = [
    { id: 'g1', label: 'Discovery', start: 0, duration: 20, progress: 100 },
    { id: 'g2', label: 'Design', start: 15, duration: 30, progress: 80 },
    { id: 'g3', label: 'Development', start: 40, duration: 40, progress: 45 },
    { id: 'g4', label: 'QA & Launch', start: 78, duration: 20, progress: 10 },
  ];

  protected readonly workflowNodes: WorkflowNode[] = [
    { id: 'w1', label: 'New Request', type: 'start' },
    { id: 'w2', label: 'Validate Input', type: 'task' },
    { id: 'w3', label: 'Approved?', type: 'decision' },
    { id: 'w4', label: 'Notify User', type: 'task' },
    { id: 'w5', label: 'Complete', type: 'end' },
  ];
  protected readonly workflowEdges = [
    { from: 'w1', to: 'w2' },
    { from: 'w2', to: 'w3' },
    { from: 'w3', to: 'w4' },
    { from: 'w4', to: 'w5' },
  ];

  protected readonly ruleGroup: RuleGroup = {
    operator: 'AND',
    rules: [
      { field: 'plan', operator: 'equals', value: 'enterprise' },
      { field: 'seats', operator: '>=', value: '50' },
      { field: 'region', operator: 'in', value: 'EU, US' },
    ],
  };

  protected readonly spreadsheetColumns: ColumnDef[] = [
    { id: 'product', header: 'Product', sortable: true },
    { id: 'q1', header: 'Q1', cellType: 'number', sortable: true },
    { id: 'q2', header: 'Q2', cellType: 'number', sortable: true },
    { id: 'q3', header: 'Q3', cellType: 'number', sortable: true },
    { id: 'q4', header: 'Q4', cellType: 'number', sortable: true },
  ];

  protected readonly spreadsheetRows: RowDef[] = [
    { id: 'r1', cells: { product: { value: 'Widgets' }, q1: { value: 1200 }, q2: { value: 1450 }, q3: { value: 1600 }, q4: { value: 1720 } }, selectable: true, editable: true },
    { id: 'r2', cells: { product: { value: 'Gadgets' }, q1: { value: 980 }, q2: { value: 1010 }, q3: { value: 1240 }, q4: { value: 1380 } }, selectable: true, editable: true },
    { id: 'r3', cells: { product: { value: 'Gizmos' }, q1: { value: 540 }, q2: { value: 620 }, q3: { value: 710 }, q4: { value: 820 } }, selectable: true, editable: true },
    { id: 'r4', cells: { product: { value: 'Total' }, q1: { value: 2720 }, q2: { value: 3080 }, q3: { value: 3550 }, q4: { value: 3920 } }, selectable: true, editable: false },
  ];

  protected readonly pivotRows: PivotRow[] = [
    { label: 'Q1', values: { Sales: 100, Costs: 60, Profit: 40 } },
    { label: 'Q2', values: { Sales: 130, Costs: 70, Profit: 60 } },
    { label: 'Q3', values: { Sales: 155, Costs: 80, Profit: 75 } },
    { label: 'Q4', values: { Sales: 190, Costs: 95, Profit: 95 } },
  ];
  protected readonly pivotColumns = ['Sales', 'Costs', 'Profit'];

  protected readonly diagramNodes: DiagramNode[] = [
    { id: 'd1', label: 'Client', x: 20, y: 30 },
    { id: 'd2', label: 'API Gateway', x: 220, y: 30 },
    { id: 'd3', label: 'Auth Service', x: 220, y: 130 },
    { id: 'd4', label: 'Database', x: 420, y: 80 },
  ];
  protected readonly diagramEdges: DiagramEdge[] = [
    { from: 'd1', to: 'd2' },
    { from: 'd2', to: 'd3' },
    { from: 'd2', to: 'd4' },
    { from: 'd3', to: 'd4' },
  ];

  protected readonly flowNodes = [
    { id: 'f1', label: 'Sign Up' },
    { id: 'f2', label: 'Verify Email' },
    { id: 'f3', label: 'Complete Profile' },
    { id: 'f4', label: 'Invite Team' },
    { id: 'f5', label: 'Dashboard' },
  ];

  protected readonly jsonData = {
    id: 'usr_8f3a',
    name: 'Ada Lovelace',
    active: true,
    roles: ['admin', 'billing'],
    meta: { lastLogin: '2026-07-13', seats: 42, trial: false },
  };

  protected readonly terminalLines = [
    { text: 'nx build core', isInput: true },
    { text: '> nx run core:build' },
    { text: 'Compiling @ngxsmk/core...' },
    { text: 'Successfully ran target build (4.2s)' },
    { text: 'npm publish --access public', isInput: true },
    { text: '+ @ngxsmk/core@1.3.0' },
  ];

  protected readonly orgNodes: OrgNode[] = [
    {
      id: 'o1',
      name: 'Grace Hopper',
      role: 'Chief Executive Officer',
      children: [
        { id: 'o2', name: 'Alan Turing', role: 'VP Engineering' },
        { id: 'o3', name: 'Katherine Johnson', role: 'VP Product' },
        { id: 'o4', name: 'Linus Pauling', role: 'VP Design' },
      ],
    },
  ];

  protected readonly queryFields: QueryField[] = [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'age', label: 'Age', type: 'number' },
    { key: 'active', label: 'Active', type: 'boolean' },
    { key: 'created', label: 'Created', type: 'date' },
  ];
  protected readonly queryConditions = signal<QueryCondition[]>([
    { field: 'name', operator: 'contains', value: 'Ada' },
    { field: 'age', operator: 'gt', value: '18' },
  ]);

  private event(
    id: string,
    title: string,
    dayOffset: number,
    hour: number,
    endHour?: number,
    color?: string,
  ): SchedulerEvent {
    const start = new Date(this.weekStart);
    start.setDate(start.getDate() + dayOffset);
    start.setHours(hour, 0, 0, 0);
    const end = new Date(start);
    end.setHours(endHour ?? hour + 1);
    return { id, title, start, end, color };
  }

  private daysOffset(n: number): Date {
    const d = new Date(this.weekStart);
    d.setDate(d.getDate() + n);
    return d;
  }

  protected readonly codeKanban = `<ngxsmk-kanban-board [columns]="columns" />

columns = [
  { id: 'todo', title: 'To Do', items: [{ id: 'k1', title: 'Design flow' }] },
  { id: 'done', title: 'Done', items: [{ id: 'k5', title: 'Ship engine' }] },
];`;

  protected readonly codeScheduler = `<ngxsmk-scheduler
  [view]="view()"
  (viewChange)="view.set($event.view)"
  (eventCreate)="onCreate($event)"
/>

view = signal('week');
onCreate = (e) => this.events.update(ev => [...ev, e.event]);`;

  protected readonly codeGantt = `<ngxsmk-timeline-gantt [items]="items" />

items = [{ id: 'g1', label: 'Design', start: 15, duration: 30, progress: 80 }];`;

  protected readonly codeWorkflow = `<ngxsmk-workflow-builder [nodes]="nodes" [edges]="edges" />

nodes = [{ id: 'w1', label: 'New Request', type: 'start' }];`;

  protected readonly codeRule = `<ngxsmk-rule-builder [group]="group" />

group = {
  operator: 'AND',
  rules: [{ field: 'plan', operator: 'equals', value: 'enterprise' }],
};`;

  protected readonly codeSpreadsheet = `<ngxsmk-spreadsheet [columns]="columns" [rows]="rows" />

columns = [
  { id: 'product', header: 'Product', sortable: true },
  { id: 'q1', header: 'Q1', cellType: 'number' },
];
rows = [
  { id: 'r1', cells: { product: { value: 'Widgets' }, q1: { value: 1200 } } },
];`;

  protected readonly codePivot = `<ngxsmk-pivot-table [rows]="rows" [columns]="cols" rowLabel="Quarter" />

rows = [{ label: 'Q1', values: { Sales: 100, Costs: 60 } }];
cols = ['Sales', 'Costs', 'Profit'];`;

  protected readonly codeDiagram = `<ngxsmk-diagram-builder
  [nodes]="nodes" [edges]="edges" (selected)="onSelect($event)" />

nodes = [{ id: 'd1', label: 'Client', x: 20, y: 30 }];
edges = [{ from: 'd1', to: 'd2' }];`;

  protected readonly codeFlow = `<ngxsmk-flow-editor title="Onboarding Flow" [nodes]="nodes" />

nodes = [{ id: 'f1', label: 'Sign Up' }];`;

  protected readonly codeJson = `<ngxsmk-json-viewer [data]="data" />

data = { id: 'usr_8f3a', active: true, seats: 42 };`;

  protected readonly codeTerminal = `<ngxsmk-terminal title="build.log" prompt="$" [lines]="lines" />

lines = [{ text: 'nx build core', isInput: true }, { text: 'Done (4.2s)' }];`;

  protected readonly codeOrg = `<ngxsmk-org-chart [nodes]="nodes" />

nodes = [{ id: 'o1', name: 'Grace Hopper', role: 'CEO',
  children: [{ id: 'o2', name: 'Alan Turing', role: 'VP Eng' }] }];`;

  protected readonly codeQuery = `<ngxsmk-query-builder [fields]="fields" [(conditions)]="conditions" />

fields = [{ key: 'name', label: 'Name', type: 'string' }];`;

  protected readonly customizeNgxsmkInputGroup = `/* Theme <ngxsmk-input-group> via design tokens */
ngxsmk-input-group {
  --ngxsmk-input-group-bg: ;
  --ngxsmk-input-group-border: ;
  --ngxsmk-input-group-radius: ;
  --ngxsmk-input-group-shadow: ;
  --ngxsmk-input-group-focus-border: ;
  --ngxsmk-input-group-focus-shadow: ;
  --ngxsmk-input-group-error-border: ;
  --ngxsmk-input-group-error-focus-shadow: ;
  --ngxsmk-input-group-success-border: ;
  --ngxsmk-input-group-warning-border: ;
  --ngxsmk-input-group-height: ;
  --ngxsmk-input-group-padding: ;
  --ngxsmk-input-group-gap: ;
  --ngxsmk-input-group-font: ;
}`;

  protected readonly codeInputGroup = `<ngxsmk-input-group
  label="Email"
  placeholder="you@company.com"
  hint="We'll never share your email."
  type="email"
  [showClear]="true"
/>

<ngxsmk-input-group
  label="Password"
  type="password"
  [required]="true"
  variant="filled"
/>

<ngxsmk-input-group
  label="Username"
  hint="3-20 characters"
  [minLength]="3"
  [maxLength]="20"
  [showCounter]="true"
  variant="soft"
  [floatingLabel]="true"
/>`;
}
