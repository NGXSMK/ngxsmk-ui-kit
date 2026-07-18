import { Component, provideZonelessChangeDetection } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkSpinner } from '@ngxsmk/core/spinner';

@Component({
  imports: [NgxsmkButton, NgxsmkBadge, NgxsmkSpinner],
  template: `
    <button ngxsmk-button>Click</button>
    <ngxsmk-badge>New</ngxsmk-badge>
    <ngxsmk-spinner />
  `,
})
class ZonelessHost {}

describe('zoneless rendering', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection()],
    });
  });

  it('renders components with provideZonelessChangeDetection', async () => {
    const fixture = TestBed.createComponent(ZonelessHost);
    fixture.detectChanges();
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('button')?.textContent).toContain('Click');
    expect(el.querySelector('ngxsmk-badge')?.textContent).toContain('New');
    expect(el.querySelector('ngxsmk-spinner')).toBeTruthy();
  });
});
