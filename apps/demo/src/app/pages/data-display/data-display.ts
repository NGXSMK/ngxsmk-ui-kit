import {
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCardDescription,
  NgxsmkCardContent,
  NgxsmkCard,
  NgxsmkCardFooter,
} from '@ngxsmk/core/card';
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
import { TranslatePipe } from '@ngx-translate/core';
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
    TranslatePipe,
  ],
  template: `
    <h2 class="ngxsmk-page-title">{{ 'category.data-display' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'dataDisplay.pageDesc' | translate }}
    </p>

    <showcase-example
      title="Tabs"
      [description]="'dataDisplay.tabsDesc' | translate"
      [code]="codeTabs"
      [component]="NgxsmkTabs"
      [customize]="customizeNgxsmkTabs"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-tabs [(value)]="activeTab">
          <ngxsmk-tab value="overview" [label]="'dataDisplay.overview' | translate"
            >The overview panel summarizes account health and recent activity.</ngxsmk-tab
          >
          <ngxsmk-tab value="activity" [label]="'dataDisplay.activity' | translate"
            >Releases, comments, and status changes land here in reverse-chronological
            order.</ngxsmk-tab
          >
          <ngxsmk-tab value="settings" [label]="'dataDisplay.settings' | translate"
            >Manage notifications, visibility, and integration tokens.</ngxsmk-tab
          >
        </ngxsmk-tabs>
      </div>
    </showcase-example>

    <showcase-example
      title="Accordion"
      [description]="'dataDisplay.accordionDesc' | translate"
      [code]="codeAccordion"
      [component]="NgxsmkAccordion"
      [customize]="customizeNgxsmkAccordion"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-accordion>
          <ngxsmk-accordion-item label="What is NGXSMK?" value="q1">
            An Angular-first, signals-native UI ecosystem built on shared design tokens.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="Is it themeable?" value="q2">
            Yes - a universal token engine drives color, spacing, and type across every component.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="Is it accessible?" value="q3">
            Components ship with WAI-ARIA semantics and full keyboard support.
          </ngxsmk-accordion-item>
        </ngxsmk-accordion>
      </div>
    </showcase-example>

    <showcase-example
      title="Avatar"
      [description]="'dataDisplay.avatarDesc' | translate"
      [code]="codeAvatar"
      [component]="NgxsmkAvatar"
      [customize]="customizeNgxsmkAvatar"
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
      [description]="'dataDisplay.tagDesc' | translate"
      [code]="codeTag"
      [component]="NgxsmkTag"
      [customize]="customizeNgxsmkTag"
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
      [description]="'dataDisplay.chipDesc' | translate"
      [code]="codeChip"
      [component]="NgxsmkChip"
      [customize]="customizeNgxsmkChip"
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
      [description]="'dataDisplay.tableDesc' | translate"
      [code]="codeTable"
      [component]="NgxsmkTable"
      [customize]="customizeNgxsmkTable"
    >
      <div class="ngxsmk-scroll-x">
        <ngxsmk-table [columns]="memberColumns" [rows]="memberRows" [striped]="true" />
      </div>
    </showcase-example>

    <showcase-example
      title="Data Table"
      [description]="'dataDisplay.dataTableDesc' | translate"
      [code]="codeDataTable"
      [component]="NgxsmkDataTable"
      [customize]="customizeNgxsmkDataTable"
    >
      <div class="ngxsmk-scroll-x">
        <ngxsmk-data-table
          [columns]="orderColumns"
          [rows]="orderRows"
          [pageSize]="4"
          [sortable]="true"
          [striped]="true"
        />
      </div>
    </showcase-example>

    <showcase-example
      title="List"
      [description]="'dataDisplay.listDesc' | translate"
      [code]="codeList"
      [component]="NgxsmkList"
      [customize]="customizeNgxsmkList"
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
      [description]="'dataDisplay.metadataDesc' | translate"
      [code]="codeMetadata"
      [component]="NgxsmkMetadataList"
      [customize]="customizeNgxsmkMetadataList"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-metadata-list>
          <ngxsmk-metadata-list-item
            ><dt>Created</dt>
            <dd>Jul 13, 2026</dd></ngxsmk-metadata-list-item
          >
          <ngxsmk-metadata-list-item
            ><dt>Author</dt>
            <dd>Ada Lovelace</dd></ngxsmk-metadata-list-item
          >
          <ngxsmk-metadata-list-item
            ><dt>Status</dt>
            <dd>Published</dd></ngxsmk-metadata-list-item
          >
          <ngxsmk-metadata-list-item
            ><dt>Version</dt>
            <dd>22.0.1</dd></ngxsmk-metadata-list-item
          >
        </ngxsmk-metadata-list>
      </div>
    </showcase-example>

    <showcase-example
      title="Overflow List"
      [description]="'dataDisplay.overflowDesc' | translate"
      [code]="codeOverflow"
      [component]="NgxsmkOverflowList"
      [customize]="customizeNgxsmkOverflowList"
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
      [description]="'dataDisplay.statDesc' | translate"
      [code]="codeStat"
      [component]="NgxsmkStat"
      [customize]="customizeNgxsmkStat"
    >
      <div class="ngxsmk-sc-grid ngxsmk-sc-grid--3">
        <ngxsmk-stat [label]="'dataDisplay.statActiveUsers' | translate" value="1,284" trend="up" />
        <ngxsmk-stat [label]="'dataDisplay.statChurn' | translate" value="2.3%" trend="down" />
        <ngxsmk-stat [label]="'dataDisplay.statOpenTickets' | translate" value="37" trend="flat" />
      </div>
    </showcase-example>

    <showcase-example
      title="Status Dot"
      [description]="'dataDisplay.statusDotDesc' | translate"
      [code]="codeStatusDot"
      [component]="NgxsmkStatusDot"
      [customize]="customizeNgxsmkStatusDot"
    >
      <div class="ngxsmk-sc-wrap">
        <span class="ngxsmk-demo-row"
          ><ngxsmk-status-dot variant="online" /> {{ 'dataDisplay.statusOnline' | translate }}</span
        >
        <span class="ngxsmk-demo-row"
          ><ngxsmk-status-dot variant="away" /> {{ 'dataDisplay.statusAway' | translate }}</span
        >
        <span class="ngxsmk-demo-row"
          ><ngxsmk-status-dot variant="busy" /> {{ 'dataDisplay.statusBusy' | translate }}</span
        >
        <span class="ngxsmk-demo-row"
          ><ngxsmk-status-dot variant="offline" />
          {{ 'dataDisplay.statusOffline' | translate }}</span
        >
      </div>
    </showcase-example>

    <showcase-example
      title="Card"
      [description]="'dataDisplay.cardDesc' | translate"
      [code]="codeCard"
      [component]="NgxsmkCard"
      [customize]="customizeNgxsmkCard"
    >
      <div class="ngxsmk-sc-wrap">
        <ngxsmk-card style="max-width:24rem">
          <div ngxsmkCardHeader>
            <h3 ngxsmkCardTitle>Quarterly report</h3>
            <p ngxsmkCardDescription>Performance summary for Q2 2026.</p>
          </div>
          <div ngxsmkCardContent>
            Revenue grew 18% quarter-over-quarter, driven by the new enterprise tier. Active
            accounts crossed the 10k mark with churn holding steady at 2.3%.
          </div>
          <div ngxsmkCardFooter>
            <button ngxsmk-button variant="primary" size="sm">
              {{ 'dataDisplay.viewReport' | translate }}
            </button>
            <button ngxsmk-button variant="ghost" size="sm">
              {{ 'dataDisplay.export' | translate }}
            </button>
          </div>
        </ngxsmk-card>
      </div>
    </showcase-example>

    <showcase-example
      title="Table (composed)"
      [description]="'dataDisplay.tableComposedDesc' | translate"
      [code]="codeTableComposed"
      [component]="NgxsmkTableRow"
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
  protected readonly NgxsmkTabs = NgxsmkTabs;
  protected readonly customizeNgxsmkTabs = `/* Theme <ngxsmk-tabs> via design tokens */
ngxsmk-tabs {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-text-label-lg-line: ;
  --ngxsmk-text-label-lg-size: ;
  --ngxsmk-text-label-lg-weight: ;
}`;
  protected readonly NgxsmkAccordion = NgxsmkAccordion;
  protected readonly customizeNgxsmkAccordion = `/* Theme <ngxsmk-accordion> via design tokens */
ngxsmk-accordion {
  --ngxsmk-accordion-bg: ;
  --ngxsmk-accordion-border-color: ;
  --ngxsmk-accordion-radius: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-radius-lg: ;
}`;
  protected readonly NgxsmkAvatar = NgxsmkAvatar;
  protected readonly customizeNgxsmkAvatar = `/* Theme <ngxsmk-avatar> via design tokens */
ngxsmk-avatar {
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-radius-lg: ;
}`;
  protected readonly NgxsmkTag = NgxsmkTag;
  protected readonly customizeNgxsmkTag = `/* Theme <ngxsmk-tag> via design tokens */
ngxsmk-tag {
  --ngxsmk-color-error-container: ;
  --ngxsmk-color-info-container: ;
  --ngxsmk-color-on-error-container: ;
  --ngxsmk-color-on-info-container: ;
  --ngxsmk-color-on-primary-container: ;
  --ngxsmk-color-on-success-container: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-on-warning-container: ;
  --ngxsmk-color-primary-container: ;
  --ngxsmk-color-success-container: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-color-warning-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-label-md-line: ;
  --ngxsmk-text-label-md-size: ;
  --ngxsmk-text-label-md-weight: ;
}`;
  protected readonly NgxsmkChip = NgxsmkChip;
  protected readonly customizeNgxsmkChip = `/* Theme <ngxsmk-chip> via design tokens */
ngxsmk-chip {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-label-md-line: ;
  --ngxsmk-text-label-md-size: ;
  --ngxsmk-text-label-md-weight: ;
}`;
  protected readonly NgxsmkTable = NgxsmkTable;
  protected readonly customizeNgxsmkTable = `/* Theme <ngxsmk-table> via design tokens */
ngxsmk-table {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkDataTable = NgxsmkDataTable;
  protected readonly customizeNgxsmkDataTable = `/* Theme <ngxsmk-data-table> via design tokens */
ngxsmk-data-table {
  --ngxsmk-color-on-primary: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkList = NgxsmkList;
  protected readonly customizeNgxsmkList = `/* Theme <ngxsmk-list> via design tokens */
ngxsmk-list {
  --ngxsmk-color-outline: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
}`;
  protected readonly NgxsmkMetadataList = NgxsmkMetadataList;
  protected readonly customizeNgxsmkMetadataList = `/* Theme <ngxsmk-metadata-list> via design tokens */
ngxsmk-metadata-list {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkOverflowList = NgxsmkOverflowList;
  protected readonly customizeNgxsmkOverflowList = `/* Theme <ngxsmk-overflow-list> via design tokens */
ngxsmk-overflow-list {
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkStat = NgxsmkStat;
  protected readonly customizeNgxsmkStat = `/* Theme <ngxsmk-stat> via design tokens */
ngxsmk-stat {
  --ngxsmk-color-error: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-success: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
  --ngxsmk-text-headline-lg-line: ;
  --ngxsmk-text-headline-lg-size: ;
  --ngxsmk-text-headline-lg-weight: ;
}`;
  protected readonly NgxsmkStatusDot = NgxsmkStatusDot;
  protected readonly customizeNgxsmkStatusDot = `/* Theme <ngxsmk-status-dot> via design tokens */
ngxsmk-status-dot {
  --ngxsmk-radius-full: ;
}`;
  protected readonly NgxsmkCard = NgxsmkCard;
  protected readonly customizeNgxsmkCard = `/* Theme <ngxsmk-card> via design tokens */
ngxsmk-card {
  --ngxsmk-card-bg: ;
  --ngxsmk-card-border-color: ;
  --ngxsmk-card-radius: ;
  --ngxsmk-card-shadow: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-duration-normal: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-radius-xl: ;
  --ngxsmk-shadow-md: ;
  --ngxsmk-shadow-sm: ;
}`;
  protected readonly NgxsmkTableRow = NgxsmkTableRow;

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
  <ngxsmk-tab value="overview" label="Overview">…</ngxsmk-tab>
  <ngxsmk-tab value="activity" label="Activity">…</ngxsmk-tab>
  <ngxsmk-tab value="settings" label="Settings">…</ngxsmk-tab>
</ngxsmk-tabs>`;

  protected readonly codeAccordion = `<ngxsmk-accordion>
  <ngxsmk-accordion-item label="What is NGXSMK?" value="q1">…</ngxsmk-accordion-item>
  <ngxsmk-accordion-item label="Is it themeable?" value="q2">…</ngxsmk-accordion-item>
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
    Revenue grew 18% quarter-over-quarter…
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
