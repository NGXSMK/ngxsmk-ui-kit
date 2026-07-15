import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-top-nav',
  template: `<div class="ngxsmk-top-nav__inner"><ng-content /></div>`,
  host: { class: 'ngxsmk-top-nav' },
  styles: `
    :host {
      display: flex;
      align-items: center;
      height: var(--ngxsmk-topnav-height, 3.5rem);
      padding: 0 var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      gap: var(--ngxsmk-space-2);
    }
    .ngxsmk-top-nav__inner {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      flex: 1;
      width: 100%;
      max-width: var(--ngxsmk-container-max-width, 1280px);
      margin: 0 auto;
    }
    @media (max-width: 768px) {
      .ngxsmk-top-nav__inner {
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTopNav {}

@Component({
  standalone: true,
  selector: 'ngxsmk-top-nav-heading',
  template: `<a class="ngxsmk-top-nav-heading__link" [href]="href()"><ng-content /></a>`,
  host: { class: 'ngxsmk-top-nav-heading' },
  styles: `
    :host {
      display: flex;
      align-items: center;
      margin-right: var(--ngxsmk-space-4);
    }
    .ngxsmk-top-nav-heading__link {
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-title-md-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
      text-decoration: none;
      white-space: nowrap;
    }
    .ngxsmk-top-nav-heading__link:hover {
      color: var(--ngxsmk-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTopNavHeading {
  readonly href = input('/');
}

@Component({
  standalone: true,
  selector: 'ngxsmk-top-nav-item',
  template: `
    @if (href()) {
      <a class="ngxsmk-top-nav-item__link" [href]="href()"><ng-content /></a>
    } @else {
      <button type="button" class="ngxsmk-top-nav-item__link" (click)="clicked.emit()">
        <ng-content />
      </button>
    }
  `,
  host: { class: 'ngxsmk-top-nav-item', '[attr.data-active]': 'active() ? "" : null' },
  styles: `
    :host {
      display: flex;
    }
    .ngxsmk-top-nav-item__link {
      display: inline-flex;
      align-items: center;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
      white-space: nowrap;
    }
    .ngxsmk-top-nav-item__link:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    :host([data-active]) .ngxsmk-top-nav-item__link {
      color: var(--ngxsmk-color-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTopNavItem {
  readonly href = input('');
  readonly active = input(false);
  readonly clicked = output<void>();
}

@Component({
  standalone: true,
  selector: 'ngxsmk-top-nav-menu',
  template: `<ng-content />`,
  host: { class: 'ngxsmk-top-nav-menu' },
  styles: `
    :host {
      position: relative;
      display: flex;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTopNavMenu {}

@Component({
  standalone: true,
  selector: 'ngxsmk-top-nav-mega-menu',
  template: `
    <div class="ngxsmk-top-nav-mega-menu__dropdown">
      <div class="ngxsmk-top-nav-mega-menu__grid">
        <ng-content select="[mega-column]" />
      </div>
      @if (featured()) {
        <div class="ngxsmk-top-nav-mega-menu__featured">
          <ng-content select="[mega-featured]" />
        </div>
      }
    </div>
    <ng-content />
  `,
  host: { class: 'ngxsmk-top-nav-mega-menu' },
  styles: `
    :host {
      position: relative;
      display: inline-flex;
      align-items: center;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-top-nav-mega-menu__dropdown {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      min-width: min(40rem, calc(100vw - 2rem));
      padding: var(--ngxsmk-space-6);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      box-shadow: var(--ngxsmk-shadow-lg);
      z-index: var(--ngxsmk-z-dropdown, 1000);
      cursor: default;
      white-space: normal;
    }
    :host(:hover) .ngxsmk-top-nav-mega-menu__dropdown {
      display: flex;
      gap: var(--ngxsmk-space-6);
    }
    .ngxsmk-top-nav-mega-menu__grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--ngxsmk-space-4);
      flex: 1;
    }
    .ngxsmk-top-nav-mega-menu__featured {
      width: 14rem;
    }

    @media (max-width: 640px) {
      .ngxsmk-top-nav-mega-menu__dropdown {
        position: fixed;
        top: var(--ngxsmk-topnav-height, 3.5rem);
        left: 0;
        right: 0;
        width: 100vw;
        min-width: 0;
        max-height: calc(100dvh - var(--ngxsmk-topnav-height, 3.5rem));
        overflow-y: auto;
        flex-direction: column;
        border-radius: 0;
      }
      .ngxsmk-top-nav-mega-menu__grid {
        grid-template-columns: 1fr;
      }
      .ngxsmk-top-nav-mega-menu__featured {
        width: 100%;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTopNavMegaMenu {
  readonly featured = input(false);
}

@Component({
  standalone: true,
  selector: 'ngxsmk-top-nav-mega-menu-item',
  template: `
    <a class="ngxsmk-top-nav-mega-menu-item__link" [href]="href()">
      @if (icon()) {
        <span class="ngxsmk-top-nav-mega-menu-item__icon">{{ icon() }}</span>
      }
      <div class="ngxsmk-top-nav-mega-menu-item__content">
        <span class="ngxsmk-top-nav-mega-menu-item__title">{{ title() }}</span>
        @if (description()) {
          <span class="ngxsmk-top-nav-mega-menu-item__desc">{{ description() }}</span>
        }
      </div>
    </a>
  `,
  host: { class: 'ngxsmk-top-nav-mega-menu-item' },
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-top-nav-mega-menu-item__link {
      display: flex;
      align-items: flex-start;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-md);
      text-decoration: none;
      transition: background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-top-nav-mega-menu-item__link:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-top-nav-mega-menu-item__title {
      display: block;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-top-nav-mega-menu-item__desc {
      display: block;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin-top: var(--ngxsmk-space-0-5);
    }
    .ngxsmk-top-nav-mega-menu-item__icon {
      font-size: 1.25rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTopNavMegaMenuItem {
  readonly title = input.required<string>();
  readonly href = input('');
  readonly description = input('');
  readonly icon = input('');
}

@Component({
  standalone: true,
  selector: 'ngxsmk-top-nav-mega-menu-featured-card',
  template: `<a class="ngxsmk-top-nav-mega-menu-featured" [href]="href()"><ng-content /></a>`,
  host: { class: 'ngxsmk-top-nav-mega-menu-featured-card' },
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-top-nav-mega-menu-featured {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-4);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-primary-container);
      text-decoration: none;
      color: var(--ngxsmk-color-on-primary-container);
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-top-nav-mega-menu-featured:hover {
      filter: brightness(0.95);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkTopNavMegaMenuFeaturedCard {
  readonly href = input('');
}
