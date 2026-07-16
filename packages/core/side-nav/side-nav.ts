import { ChangeDetectionStrategy, Component, input, output, signal, inject } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-side-nav',
  template: `<div class="ngxsmk-side-nav__inner"><ng-content /></div>`,
  host: { class: 'ngxsmk-side-nav', '[attr.data-collapsed]': 'collapsed() ? "" : null' },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      width: var(--ngxsmk-sidenav-width, 16rem);
      background: var(--ngxsmk-color-surface);
      border-inline-end: 1px solid var(--ngxsmk-color-outline);
      transition: width var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
      overflow: hidden;
    }
    :host([data-collapsed]) {
      width: var(--ngxsmk-sidenav-collapsed-width, 3.5rem);
    }
    .ngxsmk-side-nav__inner {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-4);
      overflow-y: auto;
      flex: 1;
    }
    @media (max-width: 768px) {
      :host,
      :host([data-collapsed]) {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSideNav {
  readonly collapsed = signal(false);
  readonly collapsedChange = output<boolean>();

  toggle(): void {
    this.collapsed.update((v) => !v);
    this.collapsedChange.emit(this.collapsed());
  }
}

@Component({
  standalone: true,
  selector: 'ngxsmk-side-nav-heading',
  template: `<span class="ngxsmk-side-nav-heading__text"><ng-content /></span>`,
  host: { class: 'ngxsmk-side-nav-heading' },
  styles: `
    :host {
      display: block;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      margin-top: var(--ngxsmk-space-2);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-label-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSideNavHeading {}

@Component({
  standalone: true,
  selector: 'ngxsmk-side-nav-item',
  template: `
    @if (href()) {
      <a
        class="ngxsmk-side-nav-item__link"
        [href]="href()"
        [attr.target]="external() ? '_blank' : null"
      >
        <span class="ngxsmk-side-nav-item__icon"><ng-content select="[icon]" /></span>
        <span class="ngxsmk-side-nav-item__label"><ng-content /></span>
        @if (badge()) {
          <span class="ngxsmk-side-nav-item__badge">{{ badge() }}</span>
        }
      </a>
    } @else {
      <button type="button" class="ngxsmk-side-nav-item__link" (click)="clicked.emit()">
        <span class="ngxsmk-side-nav-item__icon"><ng-content select="[icon]" /></span>
        <span class="ngxsmk-side-nav-item__label"><ng-content /></span>
        @if (badge()) {
          <span class="ngxsmk-side-nav-item__badge">{{ badge() }}</span>
        }
      </button>
    }
  `,
  host: {
    class: 'ngxsmk-side-nav-item',
    '[attr.data-active]': 'active() ? "" : null',
    '[attr.data-disabled]': 'disabled() ? "" : null',
  },
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-side-nav-item__link {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      width: 100%;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      text-decoration: none;
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-side-nav-item__link:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    :host([data-active]) .ngxsmk-side-nav-item__link {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      font-weight: 500;
    }
    :host([data-disabled]) .ngxsmk-side-nav-item__link {
      opacity: var(--ngxsmk-opacity-disabled);
      pointer-events: none;
    }
    .ngxsmk-side-nav-item__icon {
      display: inline-flex;
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-side-nav-item__label {
      flex: 1;
      text-align: start;
    }
    .ngxsmk-side-nav-item__badge {
      font-size: var(--ngxsmk-text-label-sm-size);
      padding: 0.125rem 0.5rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSideNavItem {
  readonly href = input('');
  readonly active = input(false);
  readonly disabled = input(false);
  readonly external = input(false);
  readonly badge = input('');
  readonly clicked = output<void>();
}

@Component({
  standalone: true,
  selector: 'ngxsmk-side-nav-section',
  template: `<ng-content />`,
  host: { class: 'ngxsmk-side-nav-section' },
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSideNavSection {}

@Component({
  standalone: true,
  selector: 'ngxsmk-side-nav-collapse-button',
  template: `
    <button
      type="button"
      class="ngxsmk-side-nav-collapse-btn"
      (click)="sideNav.toggle()"
      [attr.aria-label]="sideNav.collapsed() ? 'Expand sidebar' : 'Collapse sidebar'"
    >
      <svg
        viewBox="0 0 16 16"
        width="16"
        height="16"
        aria-hidden="true"
        [class.rotated]="sideNav.collapsed()"
      >
        <path
          d="M10 4L6 8l4 4"
          fill="none"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
  `,
  host: { class: 'ngxsmk-side-nav-collapse-btn-host' },
  styles: `
    :host {
      display: flex;
      padding: var(--ngxsmk-space-2);
      border-top: 1px solid var(--ngxsmk-color-outline);
    }
    .ngxsmk-side-nav-collapse-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      padding: var(--ngxsmk-space-2);
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-side-nav-collapse-btn:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-side-nav-collapse-btn svg {
      transition: transform var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
    }
    .ngxsmk-side-nav-collapse-btn svg.rotated {
      transform: rotate(180deg);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSideNavCollapseButton {
  protected readonly sideNav = inject(NgxsmkSideNav);
}
