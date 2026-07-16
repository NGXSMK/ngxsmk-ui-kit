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
import { TranslatePipe } from '@ngx-translate/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

@Component({
  selector: 'feedback-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    TranslatePipe,
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
    <h2 class="ngxsmk-page-title">{{ 'category.feedback' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'feedback.intro' | translate }}
    </p>

    <showcase-example
      title="Alert"
      [description]="'feedback.alertDesc' | translate"
      [code]="codeAlert"
      [component]="NgxsmkAlert"
      [customize]="customizeNgxsmkAlert"
    >
      <div class="ngxsmk-demo-stack ngxsmk-sc-surface">
        <ngxsmk-alert variant="info" [title]="'feedback.headsUp' | translate">
          {{ 'feedback.newVersion' | translate }}
        </ngxsmk-alert>
        <ngxsmk-alert variant="success" [title]="'feedback.saved' | translate">{{
          'feedback.changesLive' | translate
        }}</ngxsmk-alert>
        <ngxsmk-alert variant="warning" [title]="'feedback.reviewRequired' | translate">
          {{ 'feedback.settingsPerf' | translate }}
        </ngxsmk-alert>
        <ngxsmk-alert variant="error" [title]="'feedback.uploadFailed' | translate" dismissible>
          {{ 'feedback.fileProcessed' | translate }}
        </ngxsmk-alert>
      </div>
    </showcase-example>

    <showcase-example
      title="Banner"
      [description]="'feedback.bannerDesc' | translate"
      [code]="codeBanner"
      [component]="NgxsmkBanner"
      [customize]="customizeNgxsmkBanner"
    >
      <div class="ngxsmk-sc-col ngxsmk-sc-surface">
        <ngxsmk-banner variant="info">{{ 'feedback.maintenance' | translate }}</ngxsmk-banner>
        <ngxsmk-banner variant="success">{{
          'feedback.subscriptionRenewed' | translate
        }}</ngxsmk-banner>
        <ngxsmk-banner variant="warning">{{ 'feedback.storageFull' | translate }}</ngxsmk-banner>
        <ngxsmk-banner variant="error" dismissible>
          {{ 'feedback.connectionLost' | translate }}
        </ngxsmk-banner>
      </div>
    </showcase-example>

    <showcase-example
      title="Badge"
      [description]="'feedback.badgeDesc' | translate"
      [code]="codeBadge"
      [component]="NgxsmkBadge"
      [customize]="customizeNgxsmkBadge"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-badge variant="primary">{{ 'feedback.badgePrimary' | translate }}</ngxsmk-badge>
        <ngxsmk-badge variant="secondary">{{ 'feedback.badgeSecondary' | translate }}</ngxsmk-badge>
        <ngxsmk-badge variant="outline">{{ 'feedback.badgeOutline' | translate }}</ngxsmk-badge>
        <ngxsmk-badge variant="success">{{ 'feedback.badgeActive' | translate }}</ngxsmk-badge>
        <ngxsmk-badge variant="warning">{{ 'feedback.badgePending' | translate }}</ngxsmk-badge>
        <ngxsmk-badge variant="error">{{ 'feedback.badgeFailed' | translate }}</ngxsmk-badge>
        <ngxsmk-badge variant="info">{{ 'feedback.badgeInfo' | translate }}</ngxsmk-badge>
      </span>
    </showcase-example>

    <showcase-example
      title="Progress"
      [description]="'feedback.progressDesc' | translate"
      [code]="codeProgress"
      [component]="NgxsmkProgress"
      [customize]="customizeNgxsmkProgress"
    >
      <div class="ngxsmk-sc-col ngxsmk-sc-surface">
        <ngxsmk-progress
          [value]="progressValue()"
          [label]="'feedback.uploading' | translate: { percent: progressValue() }"
        />
        <ngxsmk-progress [value]="null" [label]="'feedback.loading' | translate" />
        <div class="ngxsmk-demo-row">
          <button ngxsmk-button size="sm" variant="outline" (click)="decrement()">
            {{ 'feedback.minus10' | translate }}
          </button>
          <button ngxsmk-button size="sm" variant="outline" (click)="increment()">
            {{ 'feedback.plus10' | translate }}
          </button>
          <button ngxsmk-button size="sm" variant="ghost" (click)="reset()">
            {{ 'feedback.reset' | translate }}
          </button>
        </div>
      </div>
    </showcase-example>

    <showcase-example
      title="Skeleton"
      [description]="'feedback.skeletonDesc' | translate"
      [code]="codeSkeleton"
      [component]="NgxsmkSkeleton"
      [customize]="customizeNgxsmkSkeleton"
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
      [description]="'feedback.spinnerDesc' | translate"
      [code]="codeSpinner"
      [component]="NgxsmkSpinner"
      [customize]="customizeNgxsmkSpinner"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-spinner size="sm" />
        <ngxsmk-spinner size="md" />
        <ngxsmk-spinner size="lg" />
        <span class="ngxsmk-sc-wrap">
          <ngxsmk-spinner size="sm" [label]="'feedback.spinnerSaving' | translate" />
          <ngxsmk-spinner size="md" [label]="'feedback.spinnerLoadingResults' | translate" />
        </span>
      </span>
    </showcase-example>

    <showcase-example
      title="Empty State"
      [description]="'feedback.emptyStateDesc' | translate"
      [code]="codeEmptyState"
      [component]="NgxsmkEmptyState"
      [customize]="customizeNgxsmkEmptyState"
    >
      <div class="ngxsmk-sc-surface">
        <ngxsmk-empty-state
          [title]="'feedback.noResultsFound' | translate"
          [description]="'feedback.adjustFilters' | translate"
        >
          <button ngxsmk-button size="sm" variant="primary">
            {{ 'feedback.clearFilters' | translate }}
          </button>
        </ngxsmk-empty-state>
      </div>
    </showcase-example>

    <showcase-example
      title="Status Dot"
      [description]="'feedback.statusDotDesc' | translate"
      [code]="codeStatusDot"
      [component]="NgxsmkStatusDot"
      [customize]="customizeNgxsmkStatusDot"
    >
      <span class="ngxsmk-sc-wrap">
        <span class="ngxsmk-sc-wrap"
          ><ngxsmk-status-dot variant="online" /> {{ 'feedback.online' | translate }}</span
        >
        <span class="ngxsmk-sc-wrap"
          ><ngxsmk-status-dot variant="away" /> {{ 'feedback.away' | translate }}</span
        >
        <span class="ngxsmk-sc-wrap"
          ><ngxsmk-status-dot variant="busy" /> {{ 'feedback.busy' | translate }}</span
        >
        <span class="ngxsmk-sc-wrap"
          ><ngxsmk-status-dot variant="offline" /> {{ 'feedback.offline' | translate }}</span
        >
      </span>
    </showcase-example>
  `,
})
export class FeedbackPage {
  protected readonly NgxsmkAlert = NgxsmkAlert;
  protected readonly customizeNgxsmkAlert = `/* Theme <ngxsmk-alert> via design tokens */
ngxsmk-alert {
  --ngxsmk-color-error-container: ;
  --ngxsmk-color-info-container: ;
  --ngxsmk-color-on-error-container: ;
  --ngxsmk-color-on-info-container: ;
  --ngxsmk-color-on-success-container: ;
  --ngxsmk-color-on-warning-container: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-success-container: ;
  --ngxsmk-color-warning-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkBanner = NgxsmkBanner;
  protected readonly customizeNgxsmkBanner = `/* Theme <ngxsmk-banner> via design tokens */
ngxsmk-banner {
  --ngxsmk-color-error-container: ;
  --ngxsmk-color-info-container: ;
  --ngxsmk-color-on-error-container: ;
  --ngxsmk-color-on-info-container: ;
  --ngxsmk-color-on-success-container: ;
  --ngxsmk-color-on-warning-container: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-success-container: ;
  --ngxsmk-color-warning-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkBadge = NgxsmkBadge;
  protected readonly customizeNgxsmkBadge = `/* Theme <ngxsmk-badge> via design tokens */
ngxsmk-badge {
  --ngxsmk-color-error-container: ;
  --ngxsmk-color-info-container: ;
  --ngxsmk-color-on-error-container: ;
  --ngxsmk-color-on-info-container: ;
  --ngxsmk-color-on-primary: ;
  --ngxsmk-color-on-success-container: ;
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-warning-container: ;
  --ngxsmk-color-outline-strong: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-success-container: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-color-warning-container: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-space-0-5: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-label-sm-line: ;
  --ngxsmk-text-label-sm-size: ;
  --ngxsmk-text-label-sm-weight: ;
}`;
  protected readonly NgxsmkProgress = NgxsmkProgress;
  protected readonly customizeNgxsmkProgress = `/* Theme <ngxsmk-progress> via design tokens */
ngxsmk-progress {
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-slow: ;
  --ngxsmk-ease-in-out: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-progress-bg: ;
  --ngxsmk-progress-color: ;
  --ngxsmk-progress-height: ;
  --ngxsmk-progress-radius: ;
  --ngxsmk-radius-full: ;
}`;
  protected readonly NgxsmkSkeleton = NgxsmkSkeleton;
  protected readonly customizeNgxsmkSkeleton = `/* Theme <ngxsmk-skeleton> via design tokens */
ngxsmk-skeleton {
  --ngxsmk-color-outline: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-radius-full: ;
  --ngxsmk-radius-md: ;
}`;
  protected readonly NgxsmkSpinner = NgxsmkSpinner;
  protected readonly customizeNgxsmkSpinner = `/* Theme <ngxsmk-spinner> via design tokens */
ngxsmk-spinner {
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-radius-full: ;
}`;
  protected readonly NgxsmkEmptyState = NgxsmkEmptyState;
  protected readonly customizeNgxsmkEmptyState = `/* Theme <ngxsmk-empty-state> via design tokens */
ngxsmk-empty-state {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-12: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-4: ;
  --ngxsmk-space-6: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-text-headline-sm-line: ;
  --ngxsmk-text-headline-sm-size: ;
  --ngxsmk-text-headline-sm-weight: ;
}`;
  protected readonly NgxsmkStatusDot = NgxsmkStatusDot;
  protected readonly customizeNgxsmkStatusDot = `/* Theme <ngxsmk-status-dot> via design tokens */
ngxsmk-status-dot {
  --ngxsmk-radius-full: ;
}`;

  protected readonly progressValue = signal(35);
  protected readonly progressLabel = () => `Uploading ${this.progressValue()}%`;

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
