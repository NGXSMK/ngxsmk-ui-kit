import { NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkCardDescription, NgxsmkCardContent, NgxsmkCard, NgxsmkCardFooter } from '@ngxsmk/core/card';
import { NgxsmkTableCell, NgxsmkTableHeaderCell, NgxsmkTableRow } from '@ngxsmk/core/table-cell';
import { NgxsmkAvatar } from '@ngxsmk/core/avatar';
import { NgxsmkAvatarGroupOverflow } from '@ngxsmk/core/avatar-group-overflow';
import { NgxsmkAvatarStatusDot } from '@ngxsmk/core/avatar-status-dot';
import { NgxsmkTag, NgxsmkChip } from '@ngxsmk/core/tag';
import { NgxsmkTable } from '@ngxsmk/core/table';
import { NgxsmkDataTable } from '@ngxsmk/core/data-table';
import { NgxsmkList } from '@ngxsmk/core/list';
import { NgxsmkListItem } from '@ngxsmk/core/list-item';
import { NgxsmkMetadataList, NgxsmkMetadataListItem } from '@ngxsmk/core/metadata-list';
import { NgxsmkOverflowList } from '@ngxsmk/core/overflow-list';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkStatusDot } from '@ngxsmk/core/status-dot';
import { NgxsmkAccordion, NgxsmkAccordionItem } from '@ngxsmk/core/accordion';
import { NgxsmkTabs, NgxsmkTab } from '@ngxsmk/core/tabs';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { Component, signal } from '@angular/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'data-display-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkAvatar,
    NgxsmkAvatarGroupOverflow,
    NgxsmkAvatarStatusDot,
    NgxsmkTag,
    NgxsmkChip,
    NgxsmkTable,
    NgxsmkDataTable,
    NgxsmkList,
    NgxsmkListItem,
    NgxsmkMetadataList,
    NgxsmkMetadataListItem,
    NgxsmkOverflowList,
    NgxsmkStat,
    NgxsmkStatusDot,
    NgxsmkAccordion,
    NgxsmkAccordionItem,
    NgxsmkTabs,
    NgxsmkTab,
    NgxsmkButton,
    NgxsmkCard,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkCardDescription,
    NgxsmkCardContent,
    NgxsmkCardFooter,
    NgxsmkTableHeaderCell,
    NgxsmkTableCell,
    NgxsmkTableRow,
  ],
  template: `
    <h2 class="ngxsmk-page-title">Data Display</h2>
    <p class="ngxsmk-page-desc">
      Components for presenting structured information â€” tabs, disclosure,
      avatars, tags, tables, lists, and metrics. Every piece is token-driven
      and accessible by default.
    </p>

    <showcase-example
      title="Tabs"
      description="A labeled, keyboard-navigable tab interface. The active panel is wired to a signal via two-way binding."
      [code]="codeTabs"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-tabs [(value)]="activeTab">
          <ngxsmk-tab value="overview" label="Overview">The overview panel summarizes account health and recent activity.</ngxsmk-tab>
          <ngxsmk-tab value="activity" label="Activity">Releases, comments, and status changes land here in reverse-chronological order.</ngxsmk-tab>
          <ngxsmk-tab value="settings" label="Settings">Manage notifications, visibility, and integration tokens.</ngxsmk-tab>
        </ngxsmk-tabs>
      </div>
    </showcase-example>

    <showcase-example
      title="Accordion"
      description="A vertically stacked disclosure widget. Items expand independently to reveal supporting detail."
      [code]="codeAccordion"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-accordion>
          <ngxsmk-accordion-item label="What is NGXSMK?" value="q1">
            An Angular-first, signals-native UI ecosystem built on shared design tokens.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="Is it themeable?" value="q2">
            Yes â€” a universal token engine drives color, spacing, and type across every component.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="Is it accessible?" value="q3">
            Components ship with WAI-ARIA semantics and full keyboard support.
          </ngxsmk-accordion-item>
        </ngxsmk-accordion>
      </div>
    </showcase-example>

    <showcase-example
      title="Avatar"
      description="User imagery with an automatic initials fallback. Combine with a status dot to convey presence."
      [code]="codeAvatar"
    >
      <div class="ngxsmk-sc-col">
        <div class="ngxsmk-sc-wrap">
          <ngxsmk-avatar src="https://i.pravatar.cc/120?img=12" alt="Ava Chen" size="lg" />
          <ngxsmk-avatar name="Ava Chen" size="lg" />
          <ngxsmk-avatar name="Ben Park" size="md" shape="square" />
          <ngxsmk-avatar name="Cara Diaz" size="sm" />
        </div>
        <div class="ngxsmk-sc-wrap">
          <span class="ngxsmk-sc-surface" style="position:relative;display:inline-flex">
            <ngxsmk-avatar name="Ava Chen" />
            <ngxsmk-avatar-status-dot variant="online" />
          </span>
          <span class="ngxsmk-sc-surface" style="position:relative;display:inline-flex">
            <ngxsmk-avatar name="Ben Park" />
            <ngxsmk-avatar-status-dot variant="away" />
          </span>
          <span class="ngxsmk-sc-surface" style="position:relative;display:inline-flex">
            <ngxsmk-avatar name="Cara Diaz" />
            <ngxsmk-avatar-status-dot variant="busy" />
          </span>
          <span class="ngxsmk-sc-surface" style="position:relative;display:inline-flex">
            <ngxsmk-avatar name="Dev Rao" />
            <ngxsmk-avatar-status-dot variant="offline" />
          </span>
        </div>
        <div class="ngxsmk-sc-wrap">
          <ngxsmk-avatar src="https://i.pravatar.cc/120?img=12" alt="Ava Chen" size="lg" />
          <ngxsmk-avatar src="https://i.pravatar.cc/120?img=32" alt="Ben Park" size="lg" />
          <ngxsmk-avatar src="https://i.pravatar.cc/120?img=5" alt="Cara Diaz" size="lg" />
          <ngxsmk-avatar-group-overflow [count]="3" />
        </div>
      </div>
    </showcase-example>

    <showcase-example
      title="Tag"
      description="Compact, non-interactive labels for categorizing and filtering content."
      [code]="codeTag"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-tag>angular</ngxsmk-tag>
        <ngxsmk-tag variant="primary">signals</ngxsmk-tag>
        <ngxsmk-tag variant="success">stable</ngxsmk-tag>
        <ngxsmk-tag variant="warning">beta</ngxsmk-tag>
        <ngxsmk-tag variant="error">deprecated</ngxsmk-tag>
        <ngxsmk-tag variant="info">docs</ngxsmk-tag>
      </div>
    </showcase-example>

    <showcase-example
      title="Chip"
      description="A removable token, ideal for applied filters and selected values."
      [code]="codeChip"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-chip>TypeScript</ngxsmk-chip>
        <ngxsmk-chip>Angular</ngxsmk-chip>
        <ngxsmk-chip>RxJS</ngxsmk-chip>
        <ngxsmk-chip>Standalone</ngxsmk-chip>
      </div>
    </showcase-example>

    <showcase-example
      title="Table"
      description="A simple, lightweight table driven by column and row definitions."
      [code]="codeTable"
    >
      <ngxsmk-table [columns]="memberColumns" [rows]="memberRows" [striped]="true" />
    </showcase-example>

    <showcase-example
      title="Data Table"
      description="A paginated, sortable data table for larger datasets."
      [code]="codeDataTable"
    >
      <ngxsmk-data-table
        [columns]="orderColumns"
        [rows]="orderRows"
        [pageSize]="4"
        [sortable]="true"
        [striped]="true"
      />
    </showcase-example>

    <showcase-example
      title="List"
      description="A vertical list of items, optionally divided or linkable."
      [code]="codeList"
    >
      <div class="ngxsmk-sc-col" style="width:100%;max-width:28rem">
        <ngxsmk-list [divided]="true">
          <ngxsmk-list-item variant="active">Inbox</ngxsmk-list-item>
          <ngxsmk-list-item>Starred</ngxsmk-list-item>
          <ngxsmk-list-item href="#snoozed">Snoozed</ngxsmk-list-item>
          <ngxsmk-list-item variant="disabled">Archived</ngxsmk-list-item>
        </ngxsmk-list>
      </div>
    </showcase-example>

    <showcase-example
      title="Metadata List"
      description="A definition-style list pairing labels with their values."
      [code]="codeMetadata"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-metadata-list>
          <ngxsmk-metadata-list-item><dt>Created</dt><dd>Jul 13, 2026</dd></ngxsmk-metadata-list-item>
          <ngxsmk-metadata-list-item><dt>Author</dt><dd>Ada Lovelace</dd></ngxsmk-metadata-list-item>
          <ngxsmk-metadata-list-item><dt>Status</dt><dd>Published</dd></ngxsmk-metadata-list-item>
          <ngxsmk-metadata-list-item><dt>Version</dt><dd>22.0.1</dd></ngxsmk-metadata-list-item>
        </ngxsmk-metadata-list>
      </div>
    </showcase-example>

    <showcase-example
      title="Overflow List"
      description="Collapses surplus items behind a single 'more' affordance that expands on demand."
      [code]="codeOverflow"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-overflow-list [max]="3" [total]="6">
          <span item>Design</span>
          <span item>Engineering</span>
          <span item>Product</span>
          <span item>Research</span>
          <span item>Marketing</span>
          <span item>Support</span>
        </ngxsmk-overflow-list>
      </div>
    </showcase-example>

    <showcase-example
      title="Stat"
      description="A compact metric with optional trend indicator and icon."
      [code]="codeStat"
    >
      <div class="ngxsmk-sc-grid ngxsmk-sc-grid--3">
        <ngxsmk-stat label="Active users" value="1,284" trend="up" />
        <ngxsmk-stat label="Churn" value="2.3%" trend="down" />
        <ngxsmk-stat label="Open tickets" value="37" trend="flat" />
      </div>
    </showcase-example>

    <showcase-example
      title="Status Dot"
      description="A color-coded presence indicator for online, away, busy, and offline states."
      [code]="codeStatusDot"
    >
      <div class="ngxsmk-sc-wrap">
        <span class="ngxsmk-demo-row"><ngxsmk-status-dot variant="online" /> Online</span>
        <span class="ngxsmk-demo-row"><ngxsmk-status-dot variant="away" /> Away</span>
        <span class="ngxsmk-demo-row"><ngxsmk-status-dot variant="busy" /> Busy</span>
        <span class="ngxsmk-demo-row"><ngxsmk-status-dot variant="offline" /> Offline</span>
      </div>
    </showcase-example>

    <showcase-example
      title="Card"
      description="A content container composed from header, title, description, content, and footer sub-directives."
      [code]="codeCard"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-card style="max-width:24rem">
          <div ngxsmkCardHeader>
            <h3 ngxsmkCardTitle>Quarterly report</h3>
            <p ngxsmkCardDescription>Performance summary for Q2 2026.</p>
          </div>
          <div ngxsmkCardContent>
            Revenue grew 18% quarter-over-quarter, driven by the new enterprise
            tier. Active accounts crossed the 10k mark with churn holding steady
            at 2.3%.
          </div>
          <div ngxsmkCardFooter>
            <button ngxsmk-button variant="primary" size="sm">View report</button>
            <button ngxsmk-button variant="ghost" size="sm">Export</button>
          </div>
        </ngxsmk-card>
      </div>
    </showcase-example>

    <showcase-example
      title="Table (composed)"
      description="Build a table from the cell primitives â€” header cells, rows, and cells â€” for full layout control."
      [code]="codeTableComposed"
    >
      <div class="ngxsmk-sc-wrap">
        <table class="ngxsmk-table" style="width:100%;max-width:32rem">
          <thead>
            <tr ngxsmkTableRow>
              <th ngxsmkTableHeaderCell>Name</th>
              <th ngxsmkTableHeaderCell>Role</th>
              <th ngxsmkTableHeaderCell>Team</th>
            </tr>
          </thead>
          <tbody>
            <tr ngxsmkTableRow>
              <td ngxsmkTableCell>Alice Nguyen</td>
              <td ngxsmkTableCell>Admin</td>
              <td ngxsmkTableCell>Platform</td>
            </tr>
            <tr ngxsmkTableRow>
              <td ngxsmkTableCell>Bob Martin</td>
              <td ngxsmkTableCell>Editor</td>
              <td ngxsmkTableCell>Content</td>
            </tr>
            <tr ngxsmkTableRow>
              <td ngxsmkTableCell>Carla Diaz</td>
              <td ngxsmkTableCell>Viewer</td>
              <td ngxsmkTableCell>Design</td>
            </tr>
          </tbody>
        </table>
      </div>
    </showcase-example>
  `,
})
export class DataDisplayPage {
  protected readonly activeTab = signal('overview');

  protected readonly memberColumns = [
    { key: 'name', label: 'Name' },
    { key: 'role', label: 'Role' },
    { key: 'team', label: 'Team' },
  ];
  protected readonly memberRows = [
    { name: 'Alice Nguyen', role: 'Admin', team: 'Platform' },
    { name: 'Bob Martin', role: 'Editor', team: 'Content' },
    { name: 'Carla Diaz', role: 'Viewer', team: 'Design' },
    { name: 'Dev Rao', role: 'Editor', team: 'Platform' },
  ];

  protected readonly orderColumns = [
    { key: 'id', label: 'Order' },
    { key: 'customer', label: 'Customer' },
    { key: 'total', label: 'Total' },
    { key: 'status', label: 'Status' },
  ];
  protected readonly orderRows = [
    { id: '#1042', customer: 'Ava Chen', total: '$248.00', status: 'Paid' },
    { id: '#1043', customer: 'Ben Park', total: '$89.50', status: 'Pending' },
    { id: '#1044', customer: 'Cara Diaz', total: '$1,204.00', status: 'Paid' },
    { id: '#1045', customer: 'Dev Rao', total: '$42.00', status: 'Refunded' },
    { id: '#1046', customer: 'Eli Stone', total: '$310.75', status: 'Paid' },
    { id: '#1047', customer: 'Faye Wong', total: '$18.20', status: 'Pending' },
    { id: '#1048', customer: 'Gus Lee', total: '$560.00', status: 'Paid' },
  ];

  protected readonly codeTabs = `<ngxsmk-tabs [(value)]="activeTab">
  <ngxsmk-tab value="overview" label="Overview">â€¦</ngxsmk-tab>
  <ngxsmk-tab value="activity" label="Activity">â€¦</ngxsmk-tab>
  <ngxsmk-tab value="settings" label="Settings">â€¦</ngxsmk-tab>
</ngxsmk-tabs>`;

  protected readonly codeAccordion = `<ngxsmk-accordion>
  <ngxsmk-accordion-item label="What is NGXSMK?" value="q1">â€¦</ngxsmk-accordion-item>
  <ngxsmk-accordion-item label="Is it themeable?" value="q2">â€¦</ngxsmk-accordion-item>
</ngxsmk-accordion>`;

  protected readonly codeAvatar = `<ngxsmk-avatar src="/u/12.png" alt="Ava Chen" size="lg" />
<ngxsmk-avatar name="Ava Chen" size="lg" />
<span style="position:relative;display:inline-flex">
  <ngxsmk-avatar name="Ava Chen" />
  <ngxsmk-avatar-status-dot variant="online" />
</span>
<ngxsmk-avatar-group-overflow [count]="3" />`;

  protected readonly codeTag = `<ngxsmk-tag>angular</ngxsmk-tag>
<ngxsmk-tag variant="primary">signals</ngxsmk-tag>
<ngxsmk-tag variant="success">stable</ngxsmk-tag>
<ngxsmk-tag variant="error">deprecated</ngxsmk-tag>`;

  protected readonly codeChip = `<ngxsmk-chip>TypeScript</ngxsmk-chip>
<ngxsmk-chip>Angular</ngxsmk-chip>
<ngxsmk-chip (removed)="remove(item)">RxJS</ngxsmk-chip>`;

  protected readonly codeTable = `<ngxsmk-table
  [columns]="[{ key: 'name', label: 'Name' }, { key: 'role', label: 'Role' }]"
  [rows]="[{ name: 'Alice', role: 'Admin' }, { name: 'Bob', role: 'Editor' }]"
  [striped]="true"
/>`;

  protected readonly codeDataTable = `<ngxsmk-data-table
  [columns]="orderColumns"
  [rows]="orderRows"
  [pageSize]="4"
  [sortable]="true"
/>`;

  protected readonly codeList = `<ngxsmk-list [divided]="true">
  <ngxsmk-list-item variant="active">Inbox</ngxsmk-list-item>
  <ngxsmk-list-item href="#snoozed">Snoozed</ngxsmk-list-item>
  <ngxsmk-list-item variant="disabled">Archived</ngxsmk-list-item>
</ngxsmk-list>`;

  protected readonly codeMetadata = `<ngxsmk-metadata-list>
  <ngxsmk-metadata-list-item><dt>Created</dt><dd>Jul 13, 2026</dd></ngxsmk-metadata-list-item>
  <ngxsmk-metadata-list-item><dt>Author</dt><dd>Ada Lovelace</dd></ngxsmk-metadata-list-item>
</ngxsmk-metadata-list>`;

  protected readonly codeOverflow = `<ngxsmk-overflow-list [max]="3" [total]="6">
  <span item>Design</span>
  <span item>Engineering</span>
  <span item>Product</span>
  <span item>Research</span>
</ngxsmk-overflow-list>`;

  protected readonly codeStat = `<ngxsmk-stat label="Active users" value="1,284" trend="up" />
<ngxsmk-stat label="Churn" value="2.3%" trend="down" />
<ngxsmk-stat label="Open tickets" value="37" trend="flat" />`;

  protected readonly codeStatusDot = `<ngxsmk-status-dot variant="online" /> Online
<ngxsmk-status-dot variant="away" /> Away
<ngxsmk-status-dot variant="busy" /> Busy
<ngxsmk-status-dot variant="offline" /> Offline`;

  protected readonly codeCard = `<ngxsmk-card>
  <div ngxsmkCardHeader>
    <h3 ngxsmkCardTitle>Quarterly report</h3>
    <p ngxsmkCardDescription>Performance summary for Q2 2026.</p>
  </div>
  <div ngxsmkCardContent>
    Revenue grew 18% quarter-over-quarterâ€¦
  </div>
  <div ngxsmkCardFooter>
    <ngxsmk-button variant="primary" size="sm">View report</ngxsmk-button>
    <ngxsmk-button variant="ghost" size="sm">Export</ngxsmk-button>
  </div>
</ngxsmk-card>`;

  protected readonly codeTableComposed = `<table class="ngxsmk-table">
  <thead>
    <tr ngxsmkTableRow>
      <th ngxsmkTableHeaderCell>Name</th>
      <th ngxsmkTableHeaderCell>Role</th>
      <th ngxsmkTableHeaderCell>Team</th>
    </tr>
  </thead>
  <tbody>
    <tr ngxsmkTableRow>
      <td ngxsmkTableCell>Alice Nguyen</td>
      <td ngxsmkTableCell>Admin</td>
      <td ngxsmkTableCell>Platform</td>
    </tr>
    <tr ngxsmkTableRow>
      <td ngxsmkTableCell>Bob Martin</td>
      <td ngxsmkTableCell>Editor</td>
      <td ngxsmkTableCell>Content</td>
    </tr>
  </tbody>
</table>`;
}
