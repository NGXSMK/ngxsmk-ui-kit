import { TestBed } from '@angular/core/testing';
import { describe, expect, it, vi } from 'vitest';
import { NgxsmkColorPicker } from './color-picker';

describe('NgxsmkColorPicker', () => {
  it('renders color picker container and hex input', () => {
    const fixture = TestBed.createComponent(NgxsmkColorPicker);
    fixture.componentRef.setInput('value', '#7c3aed');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector(
      '.ngxsmk-color-picker__input',
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toBe('#7c3aed');
  });

  it('renders preset swatches when showPresets is true', () => {
    const fixture = TestBed.createComponent(NgxsmkColorPicker);
    fixture.componentRef.setInput('presets', ['#ef4444', '#3b82f6']);
    fixture.componentRef.setInput('showPresets', true);
    fixture.detectChanges();

    const presetBtns = fixture.nativeElement.querySelectorAll('.ngxsmk-color-picker__preset-btn');
    expect(presetBtns.length).toBe(2);
  });

  it('updates value and emits changed when a preset is selected', () => {
    const fixture = TestBed.createComponent(NgxsmkColorPicker);
    const spy = vi.fn();
    fixture.componentInstance.changed.subscribe(spy);
    fixture.componentRef.setInput('presets', ['#ef4444', '#3b82f6']);
    fixture.detectChanges();

    const presetBtns = fixture.nativeElement.querySelectorAll('.ngxsmk-color-picker__preset-btn');
    (presetBtns[1] as HTMLButtonElement).click();

    expect(fixture.componentInstance.value()).toBe('#3b82f6');
    expect(spy).toHaveBeenCalledWith('#3b82f6');
  });
});
