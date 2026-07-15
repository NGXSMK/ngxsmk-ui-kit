import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, beforeEach, afterEach, vi } from 'vitest';
import { NgxsmkTooltip } from './tooltip';

vi.mock('motion', () => ({
  animate: vi.fn().mockReturnValue({ finished: Promise.resolve() }),
  style: vi.fn(),
}));

@Component({
  standalone: true,
  imports: [NgxsmkTooltip],
  template: `
    <button [ngxsmkTooltip]="text()" [tooltipPosition]="position()" id="trigger">Button</button>
  `,
})
class HostComponent {
  readonly text = signal('Tooltip Message');
  readonly position = signal<'top' | 'bottom' | 'left' | 'right'>('top');
}

describe('NgxsmkTooltip', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    // Clean up any remaining tooltips in body
    document.body.querySelectorAll('.ngxsmk-tooltip').forEach((el) => el.remove());
  });

  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const trigger: HTMLButtonElement = fixture.nativeElement.querySelector('#trigger');
    return { fixture, trigger };
  }

  it('does not render tooltip initially', () => {
    setup();
    expect(document.body.querySelector('.ngxsmk-tooltip')).toBeNull();
  });

  it('renders tooltip after hover delay', () => {
    const { fixture, trigger } = setup();

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    fixture.detectChanges();

    // Tooltip shouldn't show immediately
    expect(document.body.querySelector('.ngxsmk-tooltip')).toBeNull();

    // Advance timer past SHOW_DELAY_MS (150ms)
    vi.advanceTimersByTime(150);
    fixture.detectChanges();

    const tooltip = document.body.querySelector('.ngxsmk-tooltip');
    expect(tooltip).toBeTruthy();
    expect(tooltip?.textContent).toBe('Tooltip Message');
  });

  it('hides tooltip immediately on mouseleave', async () => {
    const { fixture, trigger } = setup();

    trigger.dispatchEvent(new MouseEvent('mouseenter'));
    vi.advanceTimersByTime(150);
    fixture.detectChanges();

    expect(document.body.querySelector('.ngxsmk-tooltip')).toBeTruthy();

    trigger.dispatchEvent(new MouseEvent('mouseleave'));
    fixture.detectChanges();

    // Wait for the async animation and removal from DOM
    await vi.advanceTimersByTimeAsync(50);
    fixture.detectChanges();

    expect(document.body.querySelector('.ngxsmk-tooltip')).toBeNull();
  });
});
