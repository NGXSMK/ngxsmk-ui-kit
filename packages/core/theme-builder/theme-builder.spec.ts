import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxsmkThemeBuilder } from './theme-builder';
import { NgxsmkThemeService } from '@ngxsmk/theme';

describe('NgxsmkThemeBuilder', () => {
  it('renders theme builder controls and preview', () => {
    const mockThemeService = {
      applyTheme: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: NgxsmkThemeService, useValue: mockThemeService }],
    });

    const fixture = TestBed.createComponent(NgxsmkThemeBuilder);
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('.ngxsmk-theme-builder__title');
    expect(title).toBeTruthy();
    expect(title.textContent).toContain('Visual Theme Builder');

    const primaryColorInput = fixture.nativeElement.querySelector('#primaryColor') as HTMLInputElement;
    expect(primaryColorInput).toBeTruthy();
    expect(primaryColorInput.value.toLowerCase()).toBe('#7c3aed');
  });
});
