import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

@Component({
  selector: 'ngxsmk-mobile-nav',
  template: `
    @if (open()) {
      <div class="ngxsmk-mobile-nav__backdrop" (click)="close()"></div>
      <div class="ngxsmk-mobile-nav__panel" role="dialog" aria-modal="true" [attr.aria-label]="label()">
        <div class="ngxsmk-mobile-nav__header">
          <span class="ngxsmk-mobile-nav__title">{{ label() }}</span>
          <button type="button" class="ngxsmk-mobile-nav__close" (click)="close()" aria-label="Close navigation">
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="ngxsmk-mobile-nav__content"><ng-content /></div>
      </div>
    }
  `,
  host: { class: 'ngxsmk-mobile-nav' },
  styles: `
    :host { display: contents; }
    .ngxsmk-mobile-nav__backdrop { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: var(--ngxsmk-z-overlay, 1300); }
    .ngxsmk-mobile-nav__panel { position: fixed; top: 0; left: 0; bottom: 0; width: min(20rem, 100vw - 3rem); background: var(--ngxsmk-color-surface); z-index: var(--ngxsmk-z-modal, 1400); display: flex; flex-direction: column; box-shadow: var(--ngxsmk-shadow-xl); animation: ngxsmk-slide-in 200ms var(--ngxsmk-ease-out); }
    .ngxsmk-mobile-nav__header { display: flex; align-items: center; justify-content: space-between; padding: var(--ngxsmk-space-4); border-bottom: 1px solid var(--ngxsmk-color-outline); }
    .ngxsmk-mobile-nav__title { font-family: var(--ngxsmk-font-sans); font-size: var(--ngxsmk-text-title-md-size); font-weight: 600; }
    .ngxsmk-mobile-nav__close { display: inline-flex; padding: var(--ngxsmk-space-1); border: none; background: transparent; color: var(--ngxsmk-color-on-surface); cursor: pointer; border-radius: var(--ngxsmk-radius-sm); }
    .ngxsmk-mobile-nav__close:hover { background: var(--ngxsmk-color-surface-hover); }
    .ngxsmk-mobile-nav__content { flex: 1; overflow-y: auto; padding: var(--ngxsmk-space-4); }
    @keyframes ngxsmk-slide-in { from { transform: translateX(-100%); } to { transform: translateX(0); } }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMobileNav {
  readonly open = input(false);
  readonly label = input('Navigation');
  readonly openedChange = output<boolean>();

  close(): void { this.openedChange.emit(false); }
}

@Component({
  selector: 'ngxsmk-mobile-nav-toggle',
  template: `
    <button type="button" class="ngxsmk-mobile-nav-toggle__btn" (click)="toggled.emit()" [attr.aria-label]="'Toggle navigation'">
      <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
        <path d="M4 6h16M4 12h16M4 18h16"/>
      </svg>
    </button>
  `,
  host: { class: 'ngxsmk-mobile-nav-toggle' },
  styles: `
    :host { display: flex; }
    .ngxsmk-mobile-nav-toggle__btn { display: inline-flex; align-items: center; justify-content: center; width: 2.5rem; height: 2.5rem; padding: 0; border: none; border-radius: var(--ngxsmk-radius-md); background: transparent; color: var(--ngxsmk-color-on-surface); cursor: pointer; }
    .ngxsmk-mobile-nav-toggle__btn:hover { background: var(--ngxsmk-color-surface-hover); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkMobileNavToggle {
  readonly toggled = output<void>();
}
