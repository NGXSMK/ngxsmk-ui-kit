import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkFileUpload } from './file-upload';

describe('NgxsmkFileUpload', () => {
  it('renders dropzone with text and icon', () => {
    const fixture = TestBed.createComponent(NgxsmkFileUpload);
    fixture.detectChanges();

    const dropzone = fixture.nativeElement.querySelector('.ngxsmk-file-upload__dropzone');
    expect(dropzone).toBeTruthy();
    expect(dropzone.textContent).toContain('Click to upload');
  });

  it('displays accept and maxSizeMb helper text', () => {
    const fixture = TestBed.createComponent(NgxsmkFileUpload);
    fixture.componentRef.setInput('accept', 'image/*');
    fixture.componentRef.setInput('maxSizeMb', 5);
    fixture.detectChanges();

    const subText = fixture.nativeElement.querySelector('.ngxsmk-file-upload__sub-text');
    expect(subText.textContent).toContain('image/*');
    expect(subText.textContent).toContain('5MB');
  });

  it('toggles drag state on dragover and dragleave', () => {
    const fixture = TestBed.createComponent(NgxsmkFileUpload);
    fixture.detectChanges();

    const dropzone = fixture.nativeElement.querySelector('.ngxsmk-file-upload__dropzone');
    const dragoverEvent = new Event('dragover', { bubbles: true });
    dropzone.dispatchEvent(dragoverEvent);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('ngxsmk-file-upload--dragging')).toBe(true);

    const dragleaveEvent = new Event('dragleave', { bubbles: true });
    dropzone.dispatchEvent(dragleaveEvent);
    fixture.detectChanges();

    expect(fixture.nativeElement.classList.contains('ngxsmk-file-upload--dragging')).toBe(false);
  });
});
