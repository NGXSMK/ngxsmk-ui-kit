import { Component, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkAlert } from '@ngxsmk/core/alert';
import { NgxsmkCard, NgxsmkCardContent, NgxsmkCardHeader, NgxsmkCardTitle } from '@ngxsmk/core/card';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkPromptInput } from '@ngxsmk/core/prompt-input';

@Component({
  imports: [
    NgxsmkButton,
    NgxsmkBadge,
    NgxsmkAlert,
    NgxsmkCard,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkCardContent,
    NgxsmkSwitch,
    NgxsmkCheckbox,
    NgxsmkPromptInput,
  ],
  template: `
    <div class="test-host">
      <!-- Buttons with variants and sizes -->
      <button ngxsmk-button variant="primary" size="sm">Primary SM</button>
      <button ngxsmk-button variant="secondary" size="md">Secondary MD</button>
      <button ngxsmk-button variant="outline" size="lg">Outline LG</button>
      <button ngxsmk-button variant="link">Link</button>
      <button ngxsmk-button iconOnly aria-label="Icon">★</button>

      <!-- Badge Variants -->
      <ngxsmk-badge variant="info">Info</ngxsmk-badge>
      <ngxsmk-badge variant="success">Success</ngxsmk-badge>
      <ngxsmk-badge variant="error">Error</ngxsmk-badge>

      <!-- Alert -->
      <ngxsmk-alert variant="warning">System Alert</ngxsmk-alert>

      <!-- Interactive Card -->
      <ngxsmk-card [interactive]="true">
        <div ngxsmkCardHeader><h4 ngxsmkCardTitle>Card Title</h4></div>
        <div ngxsmkCardContent>Card body copy</div>
      </ngxsmk-card>

      <!-- Form Controls -->
      <ngxsmk-switch [(checked)]="switchVal">Enable Feature</ngxsmk-switch>
      <ngxsmk-checkbox [(checked)]="checkVal">Accept Policy</ngxsmk-checkbox>
      <ngxsmk-prompt-input [(value)]="promptVal" />
    </div>
  `,
})
class ConsistencyAuditHost {
  readonly switchVal = signal(false);
  readonly checkVal = signal(true);
  readonly promptVal = signal('Hello AI');
}

describe('Design System Consistency Runtime Audit', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders standard button variants and sizes with consistent data attributes', async () => {
    const fixture = TestBed.createComponent(ConsistencyAuditHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const buttons = el.querySelectorAll('button[ngxsmk-button]');
    expect(buttons.length).toBe(5);

    expect(buttons[0].getAttribute('data-variant')).toBe('primary');
    expect(buttons[0].getAttribute('data-size')).toBe('sm');

    expect(buttons[1].getAttribute('data-variant')).toBe('secondary');
    expect(buttons[1].getAttribute('data-size')).toBe('md');

    expect(buttons[2].getAttribute('data-variant')).toBe('outline');
    expect(buttons[2].getAttribute('data-size')).toBe('lg');

    expect(buttons[3].getAttribute('data-variant')).toBe('link');
    expect(buttons[4].hasAttribute('data-icon-only')).toBe(true);
  });

  it('renders badge feedback variants consistently', async () => {
    const fixture = TestBed.createComponent(ConsistencyAuditHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const badges = el.querySelectorAll('ngxsmk-badge');
    expect(badges.length).toBe(3);
    expect(badges[0].getAttribute('data-variant')).toBe('info');
    expect(badges[1].getAttribute('data-variant')).toBe('success');
    expect(badges[2].getAttribute('data-variant')).toBe('error');
  });

  it('renders interactive cards with data-interactive attribute', async () => {
    const fixture = TestBed.createComponent(ConsistencyAuditHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const card = el.querySelector('ngxsmk-card');
    expect(card).toBeTruthy();
    expect(card?.hasAttribute('data-interactive')).toBe(true);
  });

  it('renders form controls with signal two-way bindings', async () => {
    const fixture = TestBed.createComponent(ConsistencyAuditHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('ngxsmk-switch')).toBeTruthy();
    expect(el.querySelector('ngxsmk-checkbox')).toBeTruthy();
    expect(el.querySelector('ngxsmk-prompt-input')).toBeTruthy();
  });
});
