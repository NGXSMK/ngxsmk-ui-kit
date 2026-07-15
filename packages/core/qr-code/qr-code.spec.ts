import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkQrCode } from './qr-code';

@Component({
  standalone: true,
  imports: [NgxsmkQrCode],
  template: `
    <ngxsmk-qr-code
      [value]="value()"
      [size]="size()"
      [color]="color()"
    />
  `,
})
class HostComponent {
  readonly value = signal('https://angular.dev');
  readonly size = signal(256);
  readonly color = signal('#000000');
}

describe('NgxsmkQrCode', () => {
  it('renders SVG and path correctly', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.getAttribute('width')).toBe('256');
    expect(svg.getAttribute('height')).toBe('256');

    const path = fixture.nativeElement.querySelector('path');
    expect(path).toBeTruthy();
    expect(path.getAttribute('fill')).toBe('#000000');
    expect(path.getAttribute('d')).toContain('M');
  });
});
