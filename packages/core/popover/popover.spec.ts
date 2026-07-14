import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NgxsmkPopover } from './popover';

@Component({
  standalone: true,
  imports: [NgxsmkPopover],
  template: `
    <ngxsmk-popover placement="bottom" align="start" [disabled]="disabled">
      <button ngxsmkPopoverTrigger>Open</button>
      <div class="body">Content</div>
    </ngxsmk-popover>
  `,
})
class Host {
  readonly popover = viewChild.required(NgxsmkPopover);
  disabled = false;
}

function setup(configure?: (h: Host) => void) {
  const fixture = TestBed.createComponent(Host);
  if (configure) configure(fixture.componentInstance);
  fixture.detectChanges();
  const host: HTMLElement =
    fixture.nativeElement.querySelector('ngxsmk-popover');
  return { fixture, host };
}

describe('NgxsmkPopover', () => {
  beforeEach(() => {
    // Make playExit resolve synchronously (skips the motion import).
    vi.stubGlobal(
      'matchMedia',
      vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn() }),
    );
  });

  it('is closed by default with no panel rendered', () => {
    const { host } = setup();
    expect(host.querySelector('.ngxsmk-popover__panel')).toBeNull();
    expect(host.hasAttribute('data-open')).toBe(false);
  });

  it('opens on trigger click and renders a dialog panel', () => {
    const { fixture, host } = setup();
    host
      .querySelector<HTMLButtonElement>('[ngxsmkPopoverTrigger]')!
      .parentElement!.click();
    fixture.detectChanges();
    const panel = host.querySelector('.ngxsmk-popover__panel');
    expect(panel).not.toBeNull();
    expect(panel!.getAttribute('role')).toBe('dialog');
    expect(panel!.getAttribute('data-placement')).toBe('bottom');
    expect(panel!.getAttribute('data-align')).toBe('start');
  });

  it('does not open when disabled', () => {
    const { fixture, host } = setup((h) => (h.disabled = true));
    fixture.componentInstance.popover().toggle();
    fixture.detectChanges();
    expect(host.querySelector('.ngxsmk-popover__panel')).toBeNull();
  });

  it('close() tears the panel down', async () => {
    const { fixture, host } = setup();
    fixture.componentInstance.popover().show();
    fixture.detectChanges();
    expect(host.querySelector('.ngxsmk-popover__panel')).not.toBeNull();

    fixture.componentInstance.popover().close();
    await Promise.resolve();
    fixture.detectChanges();
    expect(host.querySelector('.ngxsmk-popover__panel')).toBeNull();
  });
});
