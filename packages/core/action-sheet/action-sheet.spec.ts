import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkActionSheet, NgxsmkActionSheetAction } from './action-sheet';

@Component({
  standalone: true,
  imports: [NgxsmkActionSheet],
  template: `
    <ngxsmk-action-sheet
      [(open)]="open"
      [title]="title()"
      [actions]="actions()"
      (selected)="onSelect($event)"
      (dismissed)="onDismiss($event)"
    />
  `,
})
class HostComponent {
  readonly open = signal(false);
  readonly title = signal('Photo');
  readonly actions = signal<readonly NgxsmkActionSheetAction[]>([
    { id: 'edit', label: 'Edit' },
    { id: 'delete', label: 'Delete', destructive: true },
    { id: 'locked', label: 'Locked', disabled: true },
  ]);
  readonly onSelect = vi.fn();
  readonly onDismiss = vi.fn();
}

describe('NgxsmkActionSheet', () => {
  function setup(open = true) {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.componentInstance.open.set(open);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const actions = () => root.querySelectorAll<HTMLButtonElement>('.ngxsmk-action-sheet__action');
    return { fixture, root, actions };
  }

  it('renders nothing while closed', () => {
    const { root } = setup(false);
    expect(root.querySelector('.ngxsmk-action-sheet__panel')).toBeNull();
  });

  it('exposes a modal dialog named by its title', () => {
    const { root } = setup();
    const panel = root.querySelector('.ngxsmk-action-sheet__panel')!;

    expect(panel.getAttribute('role')).toBe('dialog');
    expect(panel.getAttribute('aria-modal')).toBe('true');
    expect(panel.getAttribute('aria-label')).toBe('Photo');
  });

  it('falls back to ariaLabel when no title is given', () => {
    const { fixture, root } = setup();
    fixture.componentInstance.title.set('');
    fixture.detectChanges();

    expect(root.querySelector('.ngxsmk-action-sheet__panel')!.getAttribute('aria-label')).toBe(
      'Actions',
    );
  });

  it('emits the action id and closes on selection', () => {
    const { fixture, actions } = setup();
    actions()[0].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.onSelect).toHaveBeenCalledWith('edit');
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('marks destructive actions and disables disabled ones', () => {
    const { actions } = setup();

    expect(actions()[1].getAttribute('data-destructive')).toBe('');
    expect(actions()[0].getAttribute('data-destructive')).toBeNull();
    expect(actions()[2].disabled).toBe(true);
  });

  it('ignores clicks on a disabled action', () => {
    const { fixture, actions } = setup();
    actions()[2].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.onSelect).not.toHaveBeenCalled();
    expect(fixture.componentInstance.open()).toBe(true);
  });

  it('dismisses on backdrop click', () => {
    const { fixture, root } = setup();
    root.querySelector<HTMLElement>('.ngxsmk-action-sheet__backdrop')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.onDismiss).toHaveBeenCalledWith('backdrop');
    expect(fixture.componentInstance.open()).toBe(false);
  });

  it('dismisses on cancel', () => {
    const { fixture, root } = setup();
    root.querySelector<HTMLElement>('.ngxsmk-action-sheet__cancel')!.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.onDismiss).toHaveBeenCalledWith('cancel');
  });

  it('dismisses on Escape', () => {
    const { fixture, root } = setup();
    root
      .querySelector('.ngxsmk-action-sheet__panel')!
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.onDismiss).toHaveBeenCalledWith('escape');
  });

  it('locks scrolling while open and releases it on close', () => {
    const { fixture } = setup();
    expect(document.body.style.overflow).toBe('hidden');

    fixture.componentInstance.open.set(false);
    fixture.detectChanges();
    expect(document.body.style.overflow).toBe('');
  });

  it('releases the scroll lock when destroyed while open', () => {
    const { fixture } = setup();
    expect(document.body.style.overflow).toBe('hidden');

    // A route change mid-sheet must not leave the page unscrollable.
    fixture.destroy();
    expect(document.body.style.overflow).toBe('');
  });

  it('has no accessibility violations', async () => {
    const { root } = setup();
    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });
  });
});
