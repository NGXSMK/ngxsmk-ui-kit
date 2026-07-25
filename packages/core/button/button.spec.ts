import { Component, Renderer2, RendererFactory2, inject, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { NgxsmkButton, NgxsmkButtonVariant } from './button';
import { IonicButtonRenderer, NGXSMK_BUTTON_RENDERER_CLASS } from './default-renderer';

@Component({
  standalone: true,
  imports: [NgxsmkButton],
  template: `
    <button ngxsmk-button [variant]="variant" size="sm" [loading]="loading()">Save</button>
  `,
})
class HostComponent {
  variant: NgxsmkButtonVariant = 'outline';
  readonly loading = signal(false);
}

describe('NgxsmkButton', () => {
  function setup() {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    return { fixture, button };
  }

  it('reflects variant and size as data attributes', () => {
    const { button } = setup();
    expect(button.getAttribute('data-variant')).toBe('outline');
    expect(button.getAttribute('data-size')).toBe('sm');
    expect(button.classList).toContain('ngxsmk-button');
  });

  it('disables the native button and shows a spinner while loading', () => {
    const { fixture, button } = setup();
    expect(button.disabled).toBe(false);
    expect(button.querySelector('.ngxsmk-button__spinner')).toBeNull();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    expect(button.disabled).toBe(true);
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(button.querySelector('.ngxsmk-button__spinner')).not.toBeNull();
  });

  it('removes the spinner when loading returns to false', () => {
    const { fixture, button } = setup();

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();
    expect(button.querySelector('.ngxsmk-button__spinner')).not.toBeNull();

    fixture.componentInstance.loading.set(false);
    fixture.detectChanges();
    expect(button.querySelector('.ngxsmk-button__spinner')).toBeNull();
  });
});

describe('NgxsmkButton renderer override', () => {
  it('honors an app-level NGXSMK_BUTTON_RENDERER_CLASS provider', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: NGXSMK_BUTTON_RENDERER_CLASS, useValue: IonicButtonRenderer }],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    // The directive provides NGXSMK_BUTTON_RENDERER itself, so this passing is
    // what proves the root-level class token is not shadowed by it.
    const spinner = button.querySelector('.ngxsmk-button__spinner');
    expect(spinner).not.toBeNull();
    expect(spinner!.tagName.toLowerCase()).toBe('ion-spinner');
  });

  it('defaults to the span spinner with no override', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    fixture.componentInstance.loading.set(true);
    fixture.detectChanges();

    expect(button.querySelector('.ngxsmk-button__spinner')!.tagName.toLowerCase()).toBe('span');
  });
});

describe('IonicButtonRenderer', () => {
  function setup() {
    TestBed.configureTestingModule({
      providers: [
        IonicButtonRenderer,
        {
          provide: Renderer2,
          useFactory: () => inject(RendererFactory2).createRenderer(null, null),
        },
      ],
    });
    return {
      renderer: TestBed.inject(IonicButtonRenderer),
      host: document.createElement('button'),
    };
  }

  it('inserts an ion-spinner carrying the shared spinner class', () => {
    const { renderer, host } = setup();

    renderer.createSpinner(host);

    const spinner = host.querySelector('.ngxsmk-button__spinner');
    expect(spinner).not.toBeNull();
    expect(spinner!.tagName.toLowerCase()).toBe('ion-spinner');
    expect(spinner!.getAttribute('aria-hidden')).toBe('true');
  });

  it('is idempotent and removes the spinner again', () => {
    const { renderer, host } = setup();

    renderer.createSpinner(host);
    renderer.createSpinner(host);
    expect(host.querySelectorAll('.ngxsmk-button__spinner')).toHaveLength(1);

    renderer.removeSpinner(host);
    expect(host.querySelector('.ngxsmk-button__spinner')).toBeNull();
  });
});
