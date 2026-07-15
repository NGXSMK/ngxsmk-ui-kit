import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkAvatar, NgxsmkAvatarSize } from './avatar';

@Component({
  standalone: true,
  imports: [NgxsmkAvatar],
  template: ` <ngxsmk-avatar [src]="src()" [name]="name()" [size]="size()" [shape]="shape()" /> `,
})
class HostComponent {
  readonly src = signal('');
  readonly name = signal('');
  readonly size = signal<NgxsmkAvatarSize>('md');
  readonly shape = signal<'circle' | 'square'>('circle');
}

describe('NgxsmkAvatar', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const avatarEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-avatar');
    return { fixture, avatarEl };
  }

  it('renders initials fallback when src is empty', () => {
    const { fixture, avatarEl } = setup();

    // Default with no name -> "?"
    expect(avatarEl.querySelector('img')).toBeNull();
    expect(avatarEl.querySelector('.ngxsmk-avatar__initials')?.textContent).toBe('?');

    // Add name
    fixture.componentInstance.name.set('Ada Lovelace');
    fixture.detectChanges();
    expect(avatarEl.querySelector('.ngxsmk-avatar__initials')?.textContent).toBe('AL');

    // Single name
    fixture.componentInstance.name.set('Ada');
    fixture.detectChanges();
    expect(avatarEl.querySelector('.ngxsmk-avatar__initials')?.textContent).toBe('A');
  });

  it('renders image when src is provided', () => {
    const { fixture, avatarEl } = setup();

    fixture.componentInstance.src.set('https://example.com/avatar.png');
    fixture.componentInstance.name.set('Test User');
    fixture.detectChanges();

    const img = avatarEl.querySelector('img');
    expect(img).toBeTruthy();
    expect(img?.getAttribute('src')).toBe('https://example.com/avatar.png');
    expect(img?.getAttribute('alt')).toBe('Test User');
    expect(avatarEl.querySelector('.ngxsmk-avatar__initials')).toBeNull();
  });

  it('falls back to initials if image fails to load', () => {
    const { fixture, avatarEl } = setup();

    fixture.componentInstance.src.set('https://example.com/bad-avatar.png');
    fixture.componentInstance.name.set('Error User');
    fixture.detectChanges();

    const img = avatarEl.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();

    // Trigger image error
    img.dispatchEvent(new Event('error'));
    fixture.detectChanges();

    expect(avatarEl.querySelector('img')).toBeNull();
    expect(avatarEl.querySelector('.ngxsmk-avatar__initials')?.textContent).toBe('EU');
  });

  it('binds size and shape inputs to host data-attributes', () => {
    const { fixture, avatarEl } = setup();
    expect(avatarEl.getAttribute('data-size')).toBe('md');
    expect(avatarEl.getAttribute('data-shape')).toBe('circle');

    fixture.componentInstance.size.set('lg');
    fixture.componentInstance.shape.set('square');
    fixture.detectChanges();

    expect(avatarEl.getAttribute('data-size')).toBe('lg');
    expect(avatarEl.getAttribute('data-shape')).toBe('square');
  });
});
