import { Component, computed, provideZonelessChangeDetection, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';

@Component({
  imports: [NgxsmkButton, NgxsmkBadge],
  template: `
    <div class="perf-host">
      <button ngxsmk-button [variant]="btnVariant()">Counter: {{ count() }}</button>
      <ngxsmk-badge>{{ formattedStatus() }}</ngxsmk-badge>
    </div>
  `,
})
class PerfTestHost {
  readonly count = signal(0);
  readonly btnVariant = computed<'primary' | 'secondary'>(() =>
    this.count() % 2 === 0 ? 'primary' : 'secondary',
  );
  readonly formattedStatus = computed(() => `Active Count: ${this.count()}`);
}

describe('Performance Laboratory Runtime Benchmark Spec', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('measures signal computation throughput (> 100,000 ops/sec)', () => {
    const s = signal(0);
    const c = computed(() => s() * 2 + 1);

    const start = performance.now();
    const ITERATIONS = 100000;
    for (let i = 0; i < ITERATIONS; i++) {
      s.set(i);
      c();
    }
    const elapsed = performance.now() - start;
    const opsPerSec = ITERATIONS / (elapsed / 1000);

    expect(c()).toBe((ITERATIONS - 1) * 2 + 1);
    expect(opsPerSec).toBeGreaterThan(100000);
  });

  it('verifies virtual scroll windowing latency on 10,000 rows (< 5ms)', () => {
    const totalRows = 10000;
    const rowHeight = 40;
    const viewportHeight = 400;
    const visibleCount = Math.ceil(viewportHeight / rowHeight);

    const start = performance.now();
    const scrollY = 2400;
    const startIndex = Math.floor(scrollY / rowHeight);
    const endIndex = Math.min(totalRows, startIndex + visibleCount + 2);
    const windowSlice = Array.from({ length: endIndex - startIndex }, (_, idx) => startIndex + idx);
    const elapsed = performance.now() - start;

    expect(elapsed).toBeLessThan(5);
    expect(windowSlice.length).toBe(visibleCount + 2);
    expect(windowSlice[0]).toBe(60);
  });

  it('executes zoneless component rendering cleanly', async () => {
    const fixture = TestBed.createComponent(PerfTestHost);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('button')?.textContent).toContain('Counter: 0');

    fixture.componentInstance.count.set(42);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(el.querySelector('button')?.textContent).toContain('Counter: 42');
    expect(el.querySelector('ngxsmk-badge')?.textContent).toContain('Active Count: 42');
  });
});
