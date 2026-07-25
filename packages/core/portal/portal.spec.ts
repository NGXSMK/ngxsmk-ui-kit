import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { afterEach, describe, expect, it } from 'vitest';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';
import { NgxsmkPortal } from './portal';

@Component({
  standalone: true,
  imports: [NgxsmkPortal],
  template: `
    <div id="origin">
      <ng-template [ngxsmkPortal]="target()" [ngxsmkPortalDisabled]="disabled()">
        <span id="teleported">{{ label() }}</span>
      </ng-template>
    </div>
  `,
})
class HostComponent {
  readonly target = signal<HTMLElement | string | null>(null);
  readonly disabled = signal(false);
  readonly label = signal('hello');
}

describe('NgxsmkPortal', () => {
  let overlay: HTMLElement;

  function setup() {
    overlay = document.createElement('div');
    overlay.id = 'overlay-host';
    document.body.appendChild(overlay);

    TestBed.configureTestingModule({
      providers: [
        {
          provide: NGXSMK_PLATFORM_ADAPTER,
          useValue: { scrollContainer: () => overlay, overlayContainer: () => overlay },
        },
      ],
    });

    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    return { fixture };
  }

  afterEach(() => overlay?.remove());

  it('renders into the platform overlay container by default', () => {
    const { fixture } = setup();

    expect(overlay.querySelector('#teleported')).not.toBeNull();
    // It must not also remain at the declaration site.
    expect(fixture.nativeElement.querySelector('#teleported')).toBeNull();
  });

  it('keeps bindings live from the declaring component', () => {
    const { fixture } = setup();
    fixture.componentInstance.label.set('updated');
    fixture.detectChanges();

    // The view stays logically attached, so change detection still reaches it
    // even though its DOM lives elsewhere.
    expect(overlay.querySelector('#teleported')!.textContent).toBe('updated');
  });

  it('renders into an element target', () => {
    const { fixture } = setup();
    const custom = document.createElement('div');
    document.body.appendChild(custom);

    fixture.componentInstance.target.set(custom);
    fixture.detectChanges();

    expect(custom.querySelector('#teleported')).not.toBeNull();
    expect(overlay.querySelector('#teleported')).toBeNull();
    custom.remove();
  });

  it('resolves a selector target', () => {
    const { fixture } = setup();
    const custom = document.createElement('div');
    custom.id = 'by-selector';
    document.body.appendChild(custom);

    fixture.componentInstance.target.set('#by-selector');
    fixture.detectChanges();

    expect(custom.querySelector('#teleported')).not.toBeNull();
    custom.remove();
  });

  it('renders in place when disabled', () => {
    const { fixture } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('#origin #teleported')).not.toBeNull();
    expect(overlay.querySelector('#teleported')).toBeNull();
  });

  it('moves back out to the overlay when re-enabled', () => {
    const { fixture } = setup();
    fixture.componentInstance.disabled.set(true);
    fixture.detectChanges();
    fixture.componentInstance.disabled.set(false);
    fixture.detectChanges();

    expect(overlay.querySelector('#teleported')).not.toBeNull();
  });

  it('removes its nodes from the target on destroy', () => {
    const { fixture } = setup();
    expect(overlay.querySelector('#teleported')).not.toBeNull();

    fixture.destroy();

    // Nodes live outside the view container, so Angular would otherwise leave
    // them behind.
    expect(overlay.querySelector('#teleported')).toBeNull();
  });
});
