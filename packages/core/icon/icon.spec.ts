import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkIcon, NgxsmkIconName } from './icon';

@Component({
  standalone: true,
  imports: [NgxsmkIcon],
  template: `<ngxsmk-icon [name]="name()" [size]="size()" aria-label="Done" />`,
})
class HostComponent {
  readonly name = signal<NgxsmkIconName>('check');
  readonly size = signal<'sm' | 'md' | 'lg'>('md');
}

describe('NgxsmkIcon', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const el: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-icon');
    return { fixture, el };
  }

  it('renders a built-in SVG path', () => {
    const { el } = setup();
    expect(el.querySelector('svg path')).toBeTruthy();
    expect(el.getAttribute('data-size')).toBe('md');
    expect(el.getAttribute('aria-label')).toBe('Done');
  });

  it('updates size', () => {
    const { fixture, el } = setup();
    fixture.componentInstance.size.set('lg');
    fixture.detectChanges();
    expect(el.getAttribute('data-size')).toBe('lg');
  });
});
