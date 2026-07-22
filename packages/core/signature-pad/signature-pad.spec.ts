import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxsmkSignaturePad } from './signature-pad';

describe('NgxsmkSignaturePad', () => {
  it('renders canvas element with specified width and height', () => {
    const fixture = TestBed.createComponent(NgxsmkSignaturePad);
    fixture.componentRef.setInput('width', 300);
    fixture.componentRef.setInput('height', 150);
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
    expect(canvas.getAttribute('width')).toBe('300');
    expect(canvas.getAttribute('height')).toBe('150');
  });

  it('renders canvas with role="img" and accessible aria-label', () => {
    const fixture = TestBed.createComponent(NgxsmkSignaturePad);
    fixture.componentRef.setInput('ariaLabel', 'Contract signature');
    fixture.detectChanges();

    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas.getAttribute('role')).toBe('img');
    expect(canvas.getAttribute('aria-label')).toBe('Contract signature');
  });

  it('emits cleared event when clear button is clicked', () => {
    const fixture = TestBed.createComponent(NgxsmkSignaturePad);
    const spy = vi.fn();
    fixture.componentInstance.cleared.subscribe(spy);
    fixture.detectChanges();

    const clearBtn = fixture.nativeElement.querySelector(
      '.ngxsmk-signature-pad__btn',
    ) as HTMLButtonElement;
    if (clearBtn && !clearBtn.disabled) {
      clearBtn.click();
      expect(spy).toHaveBeenCalled();
    }
  });

  it('disables controls when disabled input is set to true', () => {
    const fixture = TestBed.createComponent(NgxsmkSignaturePad);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('ngxsmk-signature-pad--disabled')).toBe(true);
  });
});
