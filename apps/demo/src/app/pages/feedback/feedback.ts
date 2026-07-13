import { NgxsmkBanner } from '@ngxsmk/core/banner';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { NgxsmkSkeleton } from '@ngxsmk/core/skeleton';
import { NgxsmkSpinner } from '@ngxsmk/core/spinner';
import { NgxsmkEmptyState } from '@ngxsmk/core/empty-state';
import { NgxsmkStatusDot } from '@ngxsmk/core/status-dot';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkAlert } from '@ngxsmk/core/alert';
import { Component, signal } from '@angular/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'feedback-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkAlert,
    NgxsmkBanner,
    NgxsmkBadge,
    NgxsmkProgress,
    NgxsmkSkeleton,
    NgxsmkSpinner,
    NgxsmkEmptyState,
    NgxsmkStatusDot,
    NgxsmkButton,
  ],
  template: `
    <h2 class="ngxsmk-page-title">Feedback</h2>
    <p class="ngxsmk-page-desc">
      Components that communicate status, progress, and system responses —
      from inline alerts and banners to loaders, skeletons, and presence dots.
    </p>

    <showcase-example
      title="Alert"
      description="Inline notifications for info, success, warning, and error states. Add dismissible for user-dismissable messages."
      [code]="codeAlert"
    >
      <div class="ngxsmk-demo-stack ngxsmk-sc-surface">
        <ngxsmk-alert variant="info" title="Heads up">
          A new version of the app is available.
        </ngxsmk-alert>
        <ngxsmk-alert variant="success" title="Saved">Your changes are live.</ngxsmk-alert>
        <ngxsmk-alert variant="warning" title="Review required">
          Some settings may affect performance.
        </ngxsmk-alert>
        <ngxsmk-alert variant="error" title="Upload failed" dismissible>
          The file could not be processed. Try again.
        </ngxsmk-alert>
      </div>
    </showcase-example>

    <showcase-example
      title="Banner"
      description="Full-width, attention-grabbing messages that sit at the top of a surface. Variants match the alert palette."
      [code]="codeBanner"
    >
      <div class="ngxsmk-sc-col ngxsmk-sc-surface">
        <ngxsmk-banner variant="info">Scheduled maintenance starts at 2:00 AM UTC.</ngxsmk-banner>
        <ngxsmk-banner variant="success">Your subscription has been renewed.</ngxsmk-banner>
        <ngxsmk-banner variant="warning">Storage is almost full (92%).</ngxsmk-banner>
        <ngxsmk-banner variant="error" dismissible>
          Connection lost. Reconnecting&hellip;
        </ngxsmk-banner>
      </div>
    </showcase-example>

    <showcase-example
      title="Badge"
      description="Compact, pill-shaped labels for counts, statuses, and tags. Pair with buttons or list rows."
      [code]="codeBadge"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-badge variant="primary">Primary</ngxsmk-badge>
        <ngxsmk-badge variant="secondary">Secondary</ngxsmk-badge>
        <ngxsmk-badge variant="outline">Outline</ngxsmk-badge>
        <ngxsmk-badge variant="success">Active</ngxsmk-badge>
        <ngxsmk-badge variant="warning">Pending</ngxsmk-badge>
        <ngxsmk-badge variant="error">Failed</ngxsmk-badge>
        <ngxsmk-badge variant="info">Info</ngxsmk-badge>
      </span>
    </showcase-example>

    <showcase-example
      title="Progress"
      description="Determinate bar with a 0–100 value, or indeterminate when value is null. Use the buttons to drive it live."
      [code]="codeProgress"
    >
      <div class="ngxsmk-sc-col ngxsmk-sc-surface">
        <ngxsmk-progress [value]="progressValue()" [label]="progressLabel()" />
        <ngxsmk-progress [value]="null" label="Loading" />
        <div class="ngxsmk-demo-row">
          <button ngxsmk-button size="sm" variant="outline" (click)="decrement()">− 10</button>
          <button ngxsmk-button size="sm" variant="outline" (click)="increment()">+ 10</button>
          <button ngxsmk-button size="sm" variant="ghost" (click)="reset()">Reset</button>
        </div>
      </div>
    </showcase-example>

    <showcase-example
      title="Skeleton"
      description="Shimmering placeholders that mirror the shape of upcoming content while data loads."
      [code]="codeSkeleton"
    >
      <div class="ngxsmk-sc-grid ngxsmk-sc-grid--3">
        <div class="ngxsmk-sc-col">
          <ngxsmk-skeleton width="100%" height="1rem" />
          <ngxsmk-skeleton width="80%" height="1rem" />
          <ngxsmk-skeleton width="60%" height="1rem" />
        </div>
        <div class="ngxsmk-sc-col" style="align-items:center;">
          <ngxsmk-skeleton width="3rem" height="3rem" shape="circle" />
          <ngxsmk-skeleton width="6rem" height="0.875rem" />
        </div>
        <div class="ngxsmk-sc-col">
          <ngxsmk-skeleton width="100%" height="5rem" shape="rounded" />
        </div>
      </div>
    </showcase-example>

    <showcase-example
      title="Spinner"
      description="Indeterminate loading indicators in three sizes, optionally labelled for assistive tech."
      [code]="codeSpinner"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-spinner size="sm" />
        <ngxsmk-spinner size="md" />
        <ngxsmk-spinner size="lg" />
        <span class="ngxsmk-sc-wrap">
          <ngxsmk-spinner size="sm" label="Saving" />
          <ngxsmk-spinner size="md" label="Loading results" />
        </span>
      </span>
    </showcase-example>

    <showcase-example
      title="Empty State"
      description="Centered placeholder for empty lists or results. Add actions via projected content."
      [code]="codeEmptyState"
    >
      <div class="ngxsmk-sc-surface">
        <ngxsmk-empty-state
          title="No results found"
          description="Try adjusting your filters or search terms."
        >
          <button ngxsmk-button size="sm" variant="primary">Clear filters</button>
        </ngxsmk-empty-state>
      </div>
    </showcase-example>

    <showcase-example
      title="Status Dot"
      description="Small presence indicator for online, away, busy, and offline states. Combine with text or avatars."
      [code]="codeStatusDot"
    >
      <span class="ngxsmk-sc-wrap">
        <span class="ngxsmk-sc-wrap"><ngxsmk-status-dot variant="online" /> Online</span>
        <span class="ngxsmk-sc-wrap"><ngxsmk-status-dot variant="away" /> Away</span>
        <span class="ngxsmk-sc-wrap"><ngxsmk-status-dot variant="busy" /> Busy</span>
        <span class="ngxsmk-sc-wrap"><ngxsmk-status-dot variant="offline" /> Offline</span>
      </span>
    </showcase-example>
  `,
})
export class FeedbackPage {
  protected readonly progressValue = signal(35);
  protected readonly progressLabel = () =>
    `Uploading ${this.progressValue()}%`;

  protected increment(): void {
    this.progressValue.update((v) => Math.min(100, v + 10));
  }

  protected decrement(): void {
    this.progressValue.update((v) => Math.max(0, v - 10));
  }

  protected reset(): void {
    this.progressValue.set(0);
  }

  protected readonly codeAlert = `<ngxsmk-alert variant="success" title="Saved">Your changes are live.</ngxsmk-alert>\n<ngxsmk-alert variant="error" title="Failed" dismissible>Could not process file.</ngxsmk-alert>`;
  protected readonly codeBanner = `<ngxsmk-banner variant="warning">Storage is almost full (92%).</ngxsmk-banner>\n<ngxsmk-banner variant="error" dismissible>Connection lost.</ngxsmk-banner>`;
  protected readonly codeBadge = `<ngxsmk-badge variant="primary">Primary</ngxsmk-badge>\n<ngxsmk-badge variant="success">Active</ngxsmk-badge>\n<ngxsmk-badge variant="error">Failed</ngxsmk-badge>`;
  protected readonly codeProgress = `<ngxsmk-progress [value]="value" label="Uploading" />\n<ngxsmk-progress [value]="null" label="Loading" />`;
  protected readonly codeSkeleton = `<ngxsmk-skeleton width="100%" height="1rem" />\n<ngxsmk-skeleton width="3rem" height="3rem" shape="circle" />`;
  protected readonly codeSpinner = `<ngxsmk-spinner size="md" />\n<ngxsmk-spinner size="lg" label="Loading results" />`;
  protected readonly codeEmptyState = `<ngxsmk-empty-state title="No results" description="Try adjusting filters.">\n  <button ngxsmk-button size="sm" variant="primary">Clear filters</button>\n</ngxsmk-empty-state>`;
  protected readonly codeStatusDot = `<ngxsmk-status-dot variant="online" /> Online\n<ngxsmk-status-dot variant="busy" /> Busy\n<ngxsmk-status-dot variant="offline" /> Offline`;
}
