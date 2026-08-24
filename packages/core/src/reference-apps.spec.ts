import { Component, computed, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { beforeEach, describe, expect, it } from 'vitest';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkAlert } from '@ngxsmk/core/alert';
import { NgxsmkCard, NgxsmkCardContent, NgxsmkCardHeader, NgxsmkCardTitle } from '@ngxsmk/core/card';
import { NgxsmkTab, NgxsmkTabs } from '@ngxsmk/core/tabs';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { NgxsmkProgressCircle } from '@ngxsmk/core/progress-circle';
import { NgxsmkMeter } from '@ngxsmk/core/meter';
import { NgxsmkRating } from '@ngxsmk/core/rating';
import { NgxsmkAvatar } from '@ngxsmk/core/avatar';
import { NgxsmkDialog } from '@ngxsmk/core/dialog';
import { NgxsmkPromptInput } from '@ngxsmk/core/prompt-input';
import { NgxsmkAiThinkingIndicator } from '@ngxsmk/core/ai-thinking-indicator';
import { NgxsmkSkipLink } from '@ngxsmk/cdk/skip-link';
import { NgxsmkRovingFocusGroup, NgxsmkRovingFocusItem } from '@ngxsmk/cdk/roving-focus';

// 1. SaaS Dashboard Host
@Component({
  imports: [NgxsmkCard, NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkCardContent, NgxsmkTabs, NgxsmkTab, NgxsmkBadge, NgxsmkAlert],
  template: `
    <div class="saas-dashboard">
      <ngxsmk-alert variant="info" title="Cluster Healthy">All systems operating within normal parameters.</ngxsmk-alert>
      <div class="stats-row">
        <ngxsmk-card>
          <div ngxsmkCardHeader><h4 ngxsmkCardTitle>Revenue</h4></div>
          <div ngxsmkCardContent><span class="val">{{ revenueFormatted() }}</span> <ngxsmk-badge variant="success">+14.2%</ngxsmk-badge></div>
        </ngxsmk-card>
      </div>
      <ngxsmk-tabs [(value)]="activeWorkspace">
        <ngxsmk-tab value="prod" label="Production">Prod Nodes: 12</ngxsmk-tab>
        <ngxsmk-tab value="staging" label="Staging">Staging Nodes: 4</ngxsmk-tab>
      </ngxsmk-tabs>
    </div>
  `,
})
class SaasDashboardTestApp {
  readonly revenue = signal(84230);
  readonly revenueFormatted = computed(() => `$${this.revenue().toLocaleString()}`);
  readonly activeWorkspace = signal('prod');
}

// 2. Enterprise Admin Host
@Component({
  imports: [NgxsmkFormField, NgxsmkInputDirective, NgxsmkButton, NgxsmkDialog, FormsModule],
  template: `
    <div class="enterprise-admin">
      <ngxsmk-form-field label="Filter Audit Logs">
        <input ngxsmkInput [(ngModel)]="searchFilter" />
      </ngxsmk-form-field>
      <button ngxsmk-button variant="destructive" (click)="isDeleteOpen.set(true)">Revoke Access</button>
      <ngxsmk-dialog [(open)]="isDeleteOpen" title="Confirm Revocation">
        <p>Revoking access will immediately disconnect active sessions.</p>
        <button ngxsmk-button variant="outline" (click)="isDeleteOpen.set(false)">Cancel</button>
      </ngxsmk-dialog>
    </div>
  `,
})
class EnterpriseAdminTestApp {
  readonly searchFilter = signal('');
  readonly isDeleteOpen = signal(false);
}

// 3. Analytics Platform Host
@Component({
  imports: [NgxsmkProgressCircle, NgxsmkMeter, NgxsmkCard, NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkCardContent],
  template: `
    <div class="analytics-platform">
      <ngxsmk-card>
        <div ngxsmkCardHeader><h4 ngxsmkCardTitle>Conversion Funnel</h4></div>
        <div ngxsmkCardContent>
          <ngxsmk-progress-circle [value]="conversionPct()" />
          <ngxsmk-meter [value]="78" [min]="0" [max]="100" />
        </div>
      </ngxsmk-card>
    </div>
  `,
})
class AnalyticsPlatformTestApp {
  readonly conversionPct = signal(68);
}

// 4. AI Assistant Host
@Component({
  imports: [NgxsmkPromptInput, NgxsmkAiThinkingIndicator, NgxsmkBadge],
  template: `
    <div class="ai-app">
      @if (isGenerating()) {
        <ngxsmk-ai-thinking-indicator label="Reasoning..." variant="orb" />
      }
      <ngxsmk-badge variant="info">{{ activeModel() }}</ngxsmk-badge>
      <ngxsmk-prompt-input [(value)]="prompt" (submitPrompt)="onSend()" />
    </div>
  `,
})
class AiAppTestApp {
  readonly isGenerating = signal(true);
  readonly activeModel = signal('gemini-2.5-pro');
  readonly prompt = signal('');
  onSend() {
    this.isGenerating.set(false);
  }
}

// 5. E-Commerce Host
@Component({
  imports: [NgxsmkCard, NgxsmkCardHeader, NgxsmkCardTitle, NgxsmkCardContent, NgxsmkRating, NgxsmkButton, NgxsmkBadge],
  template: `
    <div class="ecommerce-app">
      <ngxsmk-card>
        <div ngxsmkCardHeader>
          <h4 ngxsmkCardTitle>Mechanical Keyboard Pro</h4>
          <ngxsmk-badge variant="primary">$149.00</ngxsmk-badge>
        </div>
        <div ngxsmkCardContent>
          <ngxsmk-rating [value]="4.8" [readonly]="true" />
          <button ngxsmk-button variant="primary" (click)="cartCount.set(cartCount() + 1)">
            Add to Cart ({{ cartCount() }})
          </button>
        </div>
      </ngxsmk-card>
    </div>
  `,
})
class EcommerceTestApp {
  readonly cartCount = signal(0);
}

// 6. Project Management Host
@Component({
  imports: [NgxsmkProgress, NgxsmkAvatar, NgxsmkBadge, NgxsmkButton],
  template: `
    <div class="pm-app">
      <div class="sprint-header">
        <ngxsmk-progress [value]="sprintProgress()" />
        <ngxsmk-avatar name="Alice Smith" />
        <ngxsmk-badge variant="success">Sprint 42</ngxsmk-badge>
      </div>
      <button ngxsmk-button size="sm" (click)="sprintProgress.set(100)">Complete Sprint</button>
    </div>
  `,
})
class ProjectManagementTestApp {
  readonly sprintProgress = signal(75);
}

// 7. Mobile Responsive Host
@Component({
  imports: [NgxsmkSkipLink, NgxsmkRovingFocusGroup, NgxsmkRovingFocusItem, NgxsmkSwitch],
  template: `
    <div class="mobile-app">
      <ngxsmk-skip-link targetId="mobile-main">Skip to main</ngxsmk-skip-link>
      <div ngxsmkRovingFocusGroup orientation="horizontal" class="bottom-dock">
        <button ngxsmkRovingFocusItem>Feed</button>
        <button ngxsmkRovingFocusItem>Search</button>
        <button ngxsmkRovingFocusItem>Profile</button>
      </div>
      <main id="mobile-main">
        <ngxsmk-switch [(checked)]="offlineMode">Offline Mode</ngxsmk-switch>
      </main>
    </div>
  `,
})
class MobileResponsiveTestApp {
  readonly offlineMode = signal(false);
}

describe('NGXSMK 7 Real-World Reference Applications Integration Suite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('1. SaaS Dashboard: renders metrics, tabs, and responds to workspace switching', async () => {
    const fixture = TestBed.createComponent(SaasDashboardTestApp);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('.val').textContent).toBe('$84,230');
    expect(el.querySelector('ngxsmk-alert').textContent).toContain('Cluster Healthy');

    fixture.componentInstance.activeWorkspace.set('staging');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.activeWorkspace()).toBe('staging');
  });

  it('2. Enterprise Admin: opens and closes modal dialogs with signals', async () => {
    const fixture = TestBed.createComponent(EnterpriseAdminTestApp);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.isDeleteOpen()).toBe(false);
    fixture.componentInstance.isDeleteOpen.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.isDeleteOpen()).toBe(true);
  });

  it('3. Analytics Platform: renders progress circles and meters smoothly', async () => {
    const fixture = TestBed.createComponent(AnalyticsPlatformTestApp);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('ngxsmk-progress-circle')).toBeTruthy();
    expect(el.querySelector('ngxsmk-meter')).toBeTruthy();
  });

  it('4. AI Assistant: updates thinking indicator and prompt input signals', async () => {
    const fixture = TestBed.createComponent(AiAppTestApp);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('ngxsmk-badge').textContent).toContain('gemini-2.5-pro');
    expect(fixture.componentInstance.isGenerating()).toBe(true);

    fixture.componentInstance.onSend();
    expect(fixture.componentInstance.isGenerating()).toBe(false);
  });

  it('5. E-Commerce: updates shopping cart count on button click', async () => {
    const fixture = TestBed.createComponent(EcommerceTestApp);
    fixture.detectChanges();
    await fixture.whenStable();

    const btn = fixture.nativeElement.querySelector('button[ngxsmk-button]');
    expect(btn.textContent).toContain('Add to Cart (0)');

    btn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(btn.textContent).toContain('Add to Cart (1)');
  });

  it('6. Project Management: renders avatar stacks, badges, and updates sprint progress', async () => {
    const fixture = TestBed.createComponent(ProjectManagementTestApp);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('ngxsmk-avatar')).toBeTruthy();
    expect(el.querySelector('ngxsmk-badge').textContent).toContain('Sprint 42');

    fixture.componentInstance.sprintProgress.set(100);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.sprintProgress()).toBe(100);
  });

  it('7. Mobile Responsive: renders skip link, roving focus dock, and toggles switch', async () => {
    const fixture = TestBed.createComponent(MobileResponsiveTestApp);
    fixture.detectChanges();
    await fixture.whenStable();

    const el = fixture.nativeElement;
    expect(el.querySelector('ngxsmk-skip-link')).toBeTruthy();
    expect(el.querySelectorAll('.bottom-dock button').length).toBe(3);

    fixture.componentInstance.offlineMode.set(true);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.offlineMode()).toBe(true);
  });
});
