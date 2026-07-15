import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkPlayground } from './playground';

@Component({
  standalone: true,
  imports: [NgxsmkPlayground],
  template: `
    <ngxsmk-playground>
      <div preview>Test Component</div>
      <div knobs>Label Knob</div>
    </ngxsmk-playground>
  `,
})
class HostComponent {}

describe('NgxsmkPlayground', () => {
  it('renders preview and knobs content', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const viewport = fixture.nativeElement.querySelector('.ngxsmk-playground__viewport');
    expect(viewport).toBeTruthy();
    expect(viewport.textContent.trim()).toBe('Test Component');

    const sidebar = fixture.nativeElement.querySelector('.ngxsmk-playground__sidebar-content');
    expect(sidebar).toBeTruthy();
    expect(sidebar.textContent.trim()).toBe('Label Knob');
  });
});
