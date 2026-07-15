import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import {
  NgxsmkCard,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCardDescription,
  NgxsmkCardContent,
  NgxsmkCardFooter,
} from './card';

@Component({
  standalone: true,
  imports: [
    NgxsmkCard,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkCardDescription,
    NgxsmkCardContent,
    NgxsmkCardFooter,
  ],
  template: `
    <ngxsmk-card [interactive]="interactive()">
      <div ngxsmkCardHeader>
        <h3 ngxsmkCardTitle>Card Title</h3>
        <p ngxsmkCardDescription>Card Description</p>
      </div>
      <div ngxsmkCardContent>Card Content</div>
      <div ngxsmkCardFooter>Card Footer</div>
    </ngxsmk-card>
  `,
})
class HostComponent {
  readonly interactive = signal(false);
}

describe('NgxsmkCard', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const cardEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-card');
    return { fixture, cardEl };
  }

  it('renders all sections and projects content correctly', () => {
    const { cardEl } = setup();
    expect(cardEl).toBeTruthy();

    const header = cardEl.querySelector('.ngxsmk-card__header');
    const title = cardEl.querySelector('.ngxsmk-card__title');
    const desc = cardEl.querySelector('.ngxsmk-card__description');
    const content = cardEl.querySelector('.ngxsmk-card__content');
    const footer = cardEl.querySelector('.ngxsmk-card__footer');

    expect(header).toBeTruthy();
    expect(title?.textContent).toBe('Card Title');
    expect(desc?.textContent).toBe('Card Description');
    expect(content?.textContent).toBe('Card Content');
    expect(footer?.textContent).toBe('Card Footer');
  });

  it('updates host data-interactive attribute based on interactive input', () => {
    const { fixture, cardEl } = setup();
    expect(cardEl.getAttribute('data-interactive')).toBeNull();

    fixture.componentInstance.interactive.set(true);
    fixture.detectChanges();
    expect(cardEl.getAttribute('data-interactive')).toBe('');
  });
});
