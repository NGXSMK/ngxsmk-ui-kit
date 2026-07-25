import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkTimeline, NgxsmkTimelineItem } from './timeline';

@Component({
  standalone: true,
  imports: [NgxsmkTimeline, NgxsmkTimelineItem],
  template: `
    <ngxsmk-timeline [orientation]="orientation()">
      <ngxsmk-timeline-item time="09:41" dateTime="2026-07-25T09:41:00Z" variant="success">
        <span slot="title">Deployed</span>
        Shipped to production
      </ngxsmk-timeline-item>
      <ngxsmk-timeline-item time="09:12" variant="error" [last]="true">
        Build failed
      </ngxsmk-timeline-item>
    </ngxsmk-timeline>
  `,
})
class HostComponent {
  readonly orientation = signal<'vertical' | 'horizontal'>('vertical');
}

describe('NgxsmkTimeline', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture, root: fixture.nativeElement as HTMLElement };
  }

  it('renders an explicit list of listitems', () => {
    const { root } = setup();

    expect(root.querySelector('ol')!.getAttribute('role')).toBe('list');
    const items = root.querySelectorAll('ngxsmk-timeline-item');
    expect(items).toHaveLength(2);
    for (const item of Array.from(items)) {
      expect(item.getAttribute('role')).toBe('listitem');
    }
  });

  it('exposes a machine-readable datetime when supplied', () => {
    const { root } = setup();
    const times = root.querySelectorAll('time');

    expect(times[0].getAttribute('datetime')).toBe('2026-07-25T09:41:00Z');
    expect(times[0].textContent?.trim()).toBe('09:41');
    // Second item has no dateTime, so no bogus attribute.
    expect(times[1].getAttribute('datetime')).toBeNull();
  });

  it('projects title and body into separate slots', () => {
    const { root } = setup();
    const first = root.querySelector('ngxsmk-timeline-item')!;

    expect(first.querySelector('.ngxsmk-timeline-item__title')!.textContent).toContain('Deployed');
    expect(first.querySelector('.ngxsmk-timeline-item__body')!.textContent).toContain(
      'Shipped to production',
    );
  });

  it('reflects the variant for marker styling', () => {
    const { root } = setup();
    const items = root.querySelectorAll('ngxsmk-timeline-item');

    expect(items[0].getAttribute('data-variant')).toBe('success');
    expect(items[1].getAttribute('data-variant')).toBe('error');
  });

  it('omits the connector on the last item', () => {
    const { root } = setup();
    const items = root.querySelectorAll('ngxsmk-timeline-item');

    expect(items[0].querySelector('.ngxsmk-timeline-item__connector')).not.toBeNull();
    expect(items[1].querySelector('.ngxsmk-timeline-item__connector')).toBeNull();
  });

  it('reflects orientation for styling', () => {
    const { fixture, root } = setup();
    const timeline = root.querySelector('ngxsmk-timeline')!;
    expect(timeline.getAttribute('data-orientation')).toBe('vertical');

    fixture.componentInstance.orientation.set('horizontal');
    fixture.detectChanges();
    expect(timeline.getAttribute('data-orientation')).toBe('horizontal');
  });

  it('hides decorative rail markup from assistive tech', () => {
    const { root } = setup();
    const rail = root.querySelector('.ngxsmk-timeline-item__rail')!;
    expect(rail.getAttribute('aria-hidden')).toBe('true');
  });

  it('has no accessibility violations', async () => {
    const { root } = setup();
    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });
  });
});
