import { ChangeDetectionStrategy, Component, signal } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-nav-heading-menu',
  template: `
    <button type="button" class="ngxsmk-nav-heading-menu__trigger" (click)="open.set(!open())" [attr.aria-expanded]="open()">
      <span class="ngxsmk-nav-heading-menu__label"><ng-content /></span>
      <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true" [class.rotated]="open()">
        <path d="M4 6l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    @if (open()) {
      <div class="ngxsmk-nav-heading-menu__items"><ng-content select="[nav-item]" /></div>
    }
  `,
  host: { class: 'ngxsmk-nav-heading-menu' },
  styles: `
    :host { display: block; font-family: var(--ngxsmk-font-sans); }
    .ngxsmk-nav-heading-menu__trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3); border: none; border-radius: var(--ngxsmk-radius-md); background: transparent; color: var(--ngxsmk-color-on-surface); font-size: var(--ngxsmk-text-body-sm-size); font-weight: 500; cursor: pointer; }
    .ngxsmk-nav-heading-menu__trigger:hover { background: var(--ngxsmk-color-surface-hover); }
    .ngxsmk-nav-heading-menu__trigger svg { transition: transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out); }
    .ngxsmk-nav-heading-menu__trigger svg.rotated { transform: rotate(180deg); }
    .ngxsmk-nav-heading-menu__items { display: flex; flex-direction: column; gap: var(--ngxsmk-space-1); padding: var(--ngxsmk-space-1) 0 var(--ngxsmk-space-1) var(--ngxsmk-space-4); }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkNavHeadingMenu {
  protected readonly open = signal(false);
}
