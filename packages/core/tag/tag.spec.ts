import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkTag, NgxsmkChip, NgxsmkTagVariant } from './tag';

@Component({
  standalone: true,
  imports: [NgxsmkTag, NgxsmkChip],
  template: `
    <ngxsmk-tag [variant]="variant()">{{ tagLabel() }}</ngxsmk-tag>
    <ngxsmk-chip [removable]="removable()" [disabled]="disabled()" (removed)="onRemoved()">
      {{ chipLabel() }}
    </ngxsmk-chip>
  `,
})
class HostComponent {
  readonly variant = signal<NgxsmkTagVariant>('neutral');
  readonly tagLabel = signal('Angular');
  readonly chipLabel = signal('Signals');
  readonly removable = signal(true);
  readonly disabled = signal(false);
  removedCalled = false;

  onRemoved() {
    this.removedCalled = true;
  }
}

describe('Tag and Chip Components', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const tagEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-tag');
    const chipEl: HTMLElement = fixture.nativeElement.querySelector('ngxsmk-chip');
    return { fixture, tagEl, chipEl };
  }

  describe('NgxsmkTag', () => {
    it('projects tag content correctly', () => {
      const { tagEl } = setup();
      expect(tagEl.textContent).toBe('Angular');
    });

    it('sets data-variant host attribute based on variant input', () => {
      const { fixture, tagEl } = setup();
      expect(tagEl.getAttribute('data-variant')).toBe('neutral');

      fixture.componentInstance.variant.set('primary');
      fixture.detectChanges();
      expect(tagEl.getAttribute('data-variant')).toBe('primary');
    });
  });

  describe('NgxsmkChip', () => {
    it('projects chip label content', () => {
      const { chipEl } = setup();
      expect(chipEl.textContent).toContain('Signals');
    });

    it('renders remove button when removable is true', () => {
      const { fixture, chipEl } = setup();
      expect(chipEl.querySelector('.ngxsmk-chip__remove')).toBeTruthy();

      fixture.componentInstance.removable.set(false);
      fixture.detectChanges();
      expect(chipEl.querySelector('.ngxsmk-chip__remove')).toBeNull();
    });

    it('disables remove button and sets data-disabled when disabled is true', () => {
      const { fixture, chipEl } = setup();
      expect(chipEl.getAttribute('data-disabled')).toBeNull();

      const btn = chipEl.querySelector('.ngxsmk-chip__remove') as HTMLButtonElement;
      expect(btn.disabled).toBe(false);

      fixture.componentInstance.disabled.set(true);
      fixture.detectChanges();

      expect(chipEl.getAttribute('data-disabled')).toBe('');
      expect(btn.disabled).toBe(true);
    });

    it('emits removed output when remove button is clicked', () => {
      const { fixture, chipEl } = setup();
      const btn = chipEl.querySelector('.ngxsmk-chip__remove') as HTMLButtonElement;
      btn.click();
      fixture.detectChanges();

      expect(fixture.componentInstance.removedCalled).toBe(true);
    });
  });
});
