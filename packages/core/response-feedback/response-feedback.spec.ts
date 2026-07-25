import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { expectNoA11yViolations } from '@ngxsmk/cdk/testing';
import { NgxsmkFeedbackEvent, NgxsmkResponseFeedback } from './response-feedback';

@Component({
  standalone: true,
  imports: [NgxsmkResponseFeedback],
  template: `
    <ngxsmk-response-feedback
      [(rating)]="rating"
      [reasons]="reasons()"
      [allowComment]="allowComment()"
      (submitted)="onSubmit($event)"
    />
  `,
})
class HostComponent {
  readonly rating = signal<'up' | 'down' | null>(null);
  readonly reasons = signal<readonly string[]>(['Incorrect', 'Too slow']);
  readonly allowComment = signal(true);
  readonly onSubmit = vi.fn<(e: NgxsmkFeedbackEvent) => void>();
}

describe('NgxsmkResponseFeedback', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const root = fixture.nativeElement as HTMLElement;
    const votes = () => root.querySelectorAll<HTMLButtonElement>('.ngxsmk-response-feedback__vote');
    const reasons = () =>
      root.querySelectorAll<HTMLButtonElement>('.ngxsmk-response-feedback__reason');
    const click = (el: HTMLElement) => {
      el.click();
      fixture.detectChanges();
    };
    return { fixture, root, votes, reasons, click };
  }

  it('records an upvote and reflects it as pressed', () => {
    const { fixture, votes, click } = setup();
    click(votes()[0]);

    expect(fixture.componentInstance.rating()).toBe('up');
    expect(votes()[0].getAttribute('aria-pressed')).toBe('true');
    expect(votes()[1].getAttribute('aria-pressed')).toBe('false');
  });

  it('clears the rating when the active direction is clicked again', () => {
    const { fixture, votes, click } = setup();
    click(votes()[0]);
    click(votes()[0]);

    expect(fixture.componentInstance.rating()).toBeNull();
  });

  it('shows the follow-up only after a downvote', () => {
    const { root, votes, click } = setup();
    expect(root.querySelector('.ngxsmk-response-feedback__followup')).toBeNull();

    click(votes()[0]);
    expect(root.querySelector('.ngxsmk-response-feedback__followup')).toBeNull();

    click(votes()[1]);
    expect(root.querySelector('.ngxsmk-response-feedback__followup')).not.toBeNull();
  });

  it('emits the selected reason with the rating', () => {
    const { fixture, votes, reasons, click } = setup();
    click(votes()[1]);
    click(reasons()[0]);

    expect(fixture.componentInstance.onSubmit).toHaveBeenLastCalledWith({
      rating: 'down',
      reason: 'Incorrect',
    });
  });

  it('toggles a reason off when picked twice', () => {
    const { fixture, votes, reasons, click } = setup();
    click(votes()[1]);
    click(reasons()[0]);
    click(reasons()[0]);

    expect(fixture.componentInstance.onSubmit).toHaveBeenLastCalledWith({ rating: 'down' });
  });

  it('includes a typed comment in the submission', () => {
    const { fixture, root, votes, click } = setup();
    click(votes()[1]);

    const field = root.querySelector<HTMLTextAreaElement>(
      '.ngxsmk-response-feedback__comment-field',
    )!;
    field.value = 'Cited a source that does not exist';
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.onSubmit).toHaveBeenLastCalledWith({
      rating: 'down',
      comment: 'Cited a source that does not exist',
    });
  });

  it('discards reason and comment when the rating flips away from down', () => {
    const { fixture, votes, reasons, click } = setup();
    click(votes()[1]);
    click(reasons()[1]);
    click(votes()[0]);

    // Switching to a positive rating must not carry over why it was negative.
    expect(fixture.componentInstance.onSubmit).toHaveBeenLastCalledWith({ rating: 'up' });
  });

  it('hides the follow-up entirely when nothing is configured', () => {
    const { fixture, root, votes, click } = setup();
    fixture.componentInstance.reasons.set([]);
    fixture.componentInstance.allowComment.set(false);
    fixture.detectChanges();

    click(votes()[1]);
    expect(root.querySelector('.ngxsmk-response-feedback__followup')).toBeNull();
  });

  it('has no accessibility violations in either state', async () => {
    const { root, votes, click } = setup();
    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });

    click(votes()[1]);
    await expectNoA11yViolations(root, { rules: { 'color-contrast': { enabled: false } } });
  });
});
