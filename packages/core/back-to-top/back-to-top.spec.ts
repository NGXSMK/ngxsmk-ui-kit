import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkBackToTop } from './back-to-top';

@Component({
  standalone: true,
  imports: [NgxsmkBackToTop],
  template: `<ngxsmk-back-to-top [threshold]="100" (activated)="onActivate()" />`,
})
class HostComponent {
  readonly onActivate = vi.fn();
}

describe('NgxsmkBackToTop', () => {
  let scroller: HTMLElement;

  function setup() {
    scroller = document.createElement('div');
    document.body.appendChild(scroller);
    scroller.scrollTo = vi.fn() as unknown as typeof scroller.scrollTo;

    TestBed.configureTestingModule({
      providers: [
        {
          provide: NGXSMK_PLATFORM_ADAPTER,
          useValue: { scrollContainer: () => scroller, overlayContainer: () => document.body },
        },
      ],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const host = root.querySelector('ngxsmk-back-to-top')!;
    const scrollTo = (top: number) => {
      Object.defineProperty(scroller, 'scrollTop', { value: top, configurable: true });
      scroller.dispatchEvent(new Event('scroll'));
      fixture.detectChanges();
    };
    return { fixture, root, host, scrollTo };
  }

  afterEach(() => scroller?.remove());

  it('is hidden from assistive tech below the threshold', () => {
    const { host } = setup();

    expect(host.getAttribute('aria-hidden')).toBe('true');
    expect(host.getAttribute('data-visible')).toBeNull();
    // Must not be a reachable tab stop while invisible.
    expect(host.querySelector('button')!.getAttribute('tabindex')).toBe('-1');
  });

  it('appears once scrolled past the threshold', () => {
    const { host, scrollTo } = setup();
    scrollTo(150);

    expect(host.getAttribute('data-visible')).toBe('');
    expect(host.getAttribute('aria-hidden')).toBeNull();
    expect(host.querySelector('button')!.getAttribute('tabindex')).toBeNull();
  });

  it('hides again when scrolled back up', () => {
    const { host, scrollTo } = setup();
    scrollTo(150);
    scrollTo(10);

    expect(host.getAttribute('data-visible')).toBeNull();
  });

  it('scrolls the platform container, not the window', () => {
    const { host, scrollTo } = setup();
    scrollTo(150);

    host.querySelector('button')!.click();

    expect(scroller.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
  });

  it('emits activated and hides itself on click', () => {
    const { fixture, host, scrollTo } = setup();
    scrollTo(150);

    host.querySelector('button')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.onActivate).toHaveBeenCalledTimes(1);
    expect(host.getAttribute('data-visible')).toBeNull();
  });

  it('stops listening once destroyed', () => {
    const { fixture, scrollTo } = setup();
    const remove = vi.spyOn(scroller, 'removeEventListener');

    fixture.destroy();
    expect(remove).toHaveBeenCalled();

    // No error from a scroll event after teardown.
    expect(() => scrollTo(500)).not.toThrow();
  });

  it('has no accessibility violations when visible', async () => {
    const { root, scrollTo } = setup();
    scrollTo(150);

    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });
  });
});
