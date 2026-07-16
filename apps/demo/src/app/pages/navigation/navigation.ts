import {
  NgxsmkSideNavHeading,
  NgxsmkSideNavItem,
  NgxsmkSideNavSection,
  NgxsmkSideNav,
  NgxsmkSideNavCollapseButton,
} from '@ngxsmk/core/side-nav';
import {
  NgxsmkTopNavHeading,
  NgxsmkTopNavItem,
  NgxsmkTopNavMenu,
  NgxsmkTopNavMegaMenu,
  NgxsmkTopNavMegaMenuItem,
  NgxsmkTopNav,
  NgxsmkTopNavMegaMenuFeaturedCard,
} from '@ngxsmk/core/top-nav';
import { NgxsmkOutline } from '@ngxsmk/core/outline';
import { NgxsmkTabMenu } from '@ngxsmk/core/tab-menu';
import { NgxsmkNavIcon } from '@ngxsmk/core/nav-icon';
import { NgxsmkNavHeadingMenu } from '@ngxsmk/core/nav-heading-menu';
import { NgxsmkLinkProvider } from '@ngxsmk/core/link-provider';
import { NgxsmkMobileNav, NgxsmkMobileNavToggle } from '@ngxsmk/core/mobile-nav';
import { NgxsmkBreadcrumbItem } from '@ngxsmk/core/breadcrumb-item';
import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

interface AppOutlineItem {
  id: string;
  label: string;
  depth: number;
}

@Component({
  selector: 'navigation-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkBreadcrumbItem,
    NgxsmkOutline,
    NgxsmkTabMenu,
    NgxsmkNavIcon,
    NgxsmkNavHeadingMenu,
    NgxsmkLinkProvider,
    NgxsmkSideNav,
    NgxsmkSideNavHeading,
    NgxsmkSideNavItem,
    NgxsmkSideNavSection,
    NgxsmkSideNavCollapseButton,
    NgxsmkTopNav,
    NgxsmkTopNavHeading,
    NgxsmkTopNavItem,
    NgxsmkTopNavMenu,
    NgxsmkTopNavMegaMenu,
    NgxsmkTopNavMegaMenuItem,
    NgxsmkTopNavMegaMenuFeaturedCard,
    NgxsmkMobileNav,
    NgxsmkMobileNavToggle,
    TranslatePipe,
  ],
  template: `
    <h2 class="ngxsmk-page-title">{{ 'category.navigation' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'navigation.desc' | translate }}
    </p>

    <showcase-example
      [title]="'navigation.breadcrumbItem' | translate"
      [description]="'navigation.breadcrumbItemDesc' | translate"
      [code]="codeBreadcrumb"
      [component]="NgxsmkBreadcrumbItem"
      [customize]="customizeNgxsmkBreadcrumbItem"
    >
      <nav [attr.aria-label]="'navigation.breadcrumbAria' | translate" class="ngxsmk-sc-wrap">
        <ngxsmk-breadcrumb-item href="/">{{
          'navigation.home' | translate
        }}</ngxsmk-breadcrumb-item>
        <ngxsmk-breadcrumb-item href="/docs">{{ 'nav.docs' | translate }}</ngxsmk-breadcrumb-item>
        <ngxsmk-breadcrumb-item>{{ 'nav.components' | translate }}</ngxsmk-breadcrumb-item>
      </nav>
    </showcase-example>

    <showcase-example
      [title]="'navigation.outline' | translate"
      [description]="'navigation.outlineDesc' | translate"
      [code]="codeOutline"
      [component]="NgxsmkOutline"
      [customize]="customizeNgxsmkOutline"
    >
      <ngxsmk-outline [items]="outlineItems" [(activeId)]="outlineActive" />
    </showcase-example>

    <showcase-example
      [title]="'navigation.tabMenu' | translate"
      [description]="'navigation.tabMenuDesc' | translate"
      [code]="codeTabMenu"
      [component]="NgxsmkTabMenu"
      [customize]="customizeNgxsmkTabMenu"
    >
      <ngxsmk-tab-menu>
        <button
          class="ngxsmk-tab-menu__tab"
          role="tab"
          [class.ngxsmk-tab-menu__tab--active]="tabActive() === 'overview'"
          (click)="tabActive.set('overview')"
        >
          {{ 'navigation.overview' | translate }}
        </button>
        <button
          class="ngxsmk-tab-menu__tab"
          role="tab"
          [class.ngxsmk-tab-menu__tab--active]="tabActive() === 'activity'"
          (click)="tabActive.set('activity')"
        >
          {{ 'navigation.activity' | translate }}
        </button>
        <button
          class="ngxsmk-tab-menu__tab"
          role="tab"
          [class.ngxsmk-tab-menu__tab--active]="tabActive() === 'settings'"
          (click)="tabActive.set('settings')"
        >
          {{ 'navigation.settings' | translate }}
        </button>
      </ngxsmk-tab-menu>
    </showcase-example>

    <showcase-example
      [title]="'navigation.navIcon' | translate"
      [description]="'navigation.navIconDesc' | translate"
      [code]="codeNavIcon"
      [component]="NgxsmkNavIcon"
      [customize]="customizeNgxsmkNavIcon"
    >
      <span class="ngxsmk-sc-wrap">
        <ngxsmk-nav-icon
          [label]="'navigation.home' | translate"
          [active]="navIconActive() === 'home'"
          (click)="navIconActive.set('home')"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M3 11l9-8 9 8M5 10v10h14V10" />
          </svg>
        </ngxsmk-nav-icon>
        <ngxsmk-nav-icon
          [label]="'navigation.search' | translate"
          [active]="navIconActive() === 'search'"
          (click)="navIconActive.set('search')"
        >
          <svg
            viewBox="0 0 24 24"
            width="20"
            height="20"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4-4" />
          </svg>
        </ngxsmk-nav-icon>
        <ngxsmk-nav-icon
          [label]="'navigation.settings' | translate"
          size="lg"
          [active]="navIconActive() === 'settings'"
          (click)="navIconActive.set('settings')"
        >
          <svg
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path
              d="M19 12a7 7 0 0 0-.1-1l2-1.5-2-3.4-2.3 1a7 7 0 0 0-1.7-1l-.3-2.5h-4l-.3 2.5a7 7 0 0 0-1.7 1l-2.3-1-2 3.4 2 1.5a7 7 0 0 0 0 2l-2 1.5 2 3.4 2.3-1a7 7 0 0 0 1.7 1l.3 2.5h4l.3-2.5a7 7 0 0 0 1.7-1l2.3 1 2-3.4-2-1.5a7 7 0 0 0 .1-1z"
            />
          </svg>
        </ngxsmk-nav-icon>
      </span>
    </showcase-example>

    <showcase-example
      [title]="'navigation.navHeadingMenu' | translate"
      [description]="'navigation.navHeadingMenuDesc' | translate"
      [code]="codeNavHeadingMenu"
      [component]="NgxsmkNavHeadingMenu"
      [customize]="customizeNgxsmkNavHeadingMenu"
    >
      <div class="ngxsmk-sc-surface" style="width: 16rem;">
        <ngxsmk-nav-heading-menu>
          {{ 'navigation.products' | translate }}
          <a nav-item href="#">{{ 'navigation.overview' | translate }}</a>
          <a nav-item href="#">{{ 'navigation.pricing' | translate }}</a>
          <a nav-item href="#">{{ 'navigation.changelog' | translate }}</a>
        </ngxsmk-nav-heading-menu>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'navigation.sideNav' | translate"
      [description]="'navigation.sideNavDesc' | translate"
      [code]="codeSideNav"
      [component]="NgxsmkSideNav"
      [customize]="customizeNgxsmkSideNav"
    >
      <div
        style="height: 320px; position: relative; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-lg); overflow: hidden;"
      >
        <ngxsmk-side-nav>
          <ngxsmk-side-nav-section>
            <ngxsmk-side-nav-heading>{{
              'navigation.workspace' | translate
            }}</ngxsmk-side-nav-heading>
            <ngxsmk-side-nav-item
              [active]="sideNavActive() === 'dashboard'"
              (clicked)="sideNavActive.set('dashboard')"
              >{{ 'navigation.dashboard' | translate }}</ngxsmk-side-nav-item
            >
            <ngxsmk-side-nav-item
              [active]="sideNavActive() === 'analytics'"
              (clicked)="sideNavActive.set('analytics')"
              badge="3"
              >{{ 'navigation.analytics' | translate }}</ngxsmk-side-nav-item
            >
            <ngxsmk-side-nav-item
              [active]="sideNavActive() === 'reports'"
              (clicked)="sideNavActive.set('reports')"
              >{{ 'navigation.reports' | translate }}</ngxsmk-side-nav-item
            >
          </ngxsmk-side-nav-section>
          <ngxsmk-side-nav-section>
            <ngxsmk-side-nav-heading>{{
              'navigation.account' | translate
            }}</ngxsmk-side-nav-heading>
            <ngxsmk-side-nav-item
              [active]="sideNavActive() === 'profile'"
              (clicked)="sideNavActive.set('profile')"
              >{{ 'navigation.profile' | translate }}</ngxsmk-side-nav-item
            >
            <ngxsmk-side-nav-item
              [active]="sideNavActive() === 'billing'"
              (clicked)="sideNavActive.set('billing')"
              >{{ 'navigation.billing' | translate }}</ngxsmk-side-nav-item
            >
          </ngxsmk-side-nav-section>
          <ngxsmk-side-nav-collapse-button />
        </ngxsmk-side-nav>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'navigation.topNav' | translate"
      [description]="'navigation.topNavDesc' | translate"
      [code]="codeTopNav"
      [component]="NgxsmkTopNav"
      [customize]="customizeNgxsmkTopNav"
    >
      <div
        style="height: 200px; position: relative; width: 100%; overflow: hidden; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-lg);"
      >
        <ngxsmk-top-nav>
          <ngxsmk-top-nav-heading>Acme</ngxsmk-top-nav-heading>
          <ngxsmk-top-nav-item
            [active]="topNavActive() === 'home'"
            (clicked)="topNavActive.set('home')"
            >{{ 'navigation.home' | translate }}</ngxsmk-top-nav-item
          >
          <ngxsmk-top-nav-item
            [active]="topNavActive() === 'about'"
            (clicked)="topNavActive.set('about')"
            >{{ 'navigation.about' | translate }}</ngxsmk-top-nav-item
          >
          <ngxsmk-top-nav-menu>
            <ngxsmk-top-nav-item>{{ 'navigation.resources' | translate }} ▾</ngxsmk-top-nav-item>
          </ngxsmk-top-nav-menu>
        </ngxsmk-top-nav>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'navigation.megaMenu' | translate"
      [description]="'navigation.megaMenuDesc' | translate"
      [code]="codeMegaMenu"
      [component]="NgxsmkTopNav"
      [customize]="customizeNgxsmkTopNav"
    >
      <div
        style="height: 380px; position: relative; width: 100%; overflow: hidden; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-lg);"
      >
        <ngxsmk-top-nav>
          <ngxsmk-top-nav-heading>Acme</ngxsmk-top-nav-heading>
          <ngxsmk-top-nav-mega-menu [featured]="true">
            {{ 'navigation.products' | translate }} ▾
            <div mega-column>
              <ngxsmk-top-nav-mega-menu-item
                [title]="'navigation.analytics' | translate"
                [description]="'navigation.trackMetrics' | translate"
                href="#"
              />
              <ngxsmk-top-nav-mega-menu-item
                [title]="'navigation.automation' | translate"
                [description]="'navigation.buildWorkflows' | translate"
                href="#"
              />
              <ngxsmk-top-nav-mega-menu-item
                [title]="'navigation.insights' | translate"
                [description]="'navigation.surfaceTrends' | translate"
                href="#"
              />
            </div>
            <div mega-column>
              <ngxsmk-top-nav-mega-menu-item
                [title]="'navigation.reports' | translate"
                [description]="'navigation.shareProgress' | translate"
                href="#"
              />
              <ngxsmk-top-nav-mega-menu-item
                [title]="'navigation.integrations' | translate"
                [description]="'navigation.connectTools' | translate"
                href="#"
              />
              <ngxsmk-top-nav-mega-menu-item
                [title]="'navigation.api' | translate"
                [description]="'navigation.buildCustomApps' | translate"
                href="#"
              />
            </div>
            <ngxsmk-top-nav-mega-menu-featured-card mega-featured href="#">
              <strong>{{ 'navigation.whatsNew' | translate }}</strong>
              <span>{{ 'navigation.whatsNewDesc' | translate }}</span>
            </ngxsmk-top-nav-mega-menu-featured-card>
          </ngxsmk-top-nav-mega-menu>
        </ngxsmk-top-nav>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'navigation.mobileNav' | translate"
      [description]="'navigation.mobileNavDesc' | translate"
      [code]="codeMobileNav"
      [component]="NgxsmkMobileNavToggle"
      [customize]="customizeNgxsmkMobileNavToggle"
    >
      <div class="ngxsmk-sc-surface" style="position: relative; overflow: hidden;">
        <ngxsmk-mobile-nav-toggle (toggled)="mobileNavOpen.set(!mobileNavOpen())" />
        <p class="ngxsmk-demo-hint">
          {{ 'navigation.tapHint' | translate }}
        </p>
        <ngxsmk-mobile-nav
          [open]="mobileNavOpen()"
          (openedChange)="mobileNavOpen.set($event)"
          label="Acme"
        >
          <a href="#" class="ngxsmk-demo-mobile-link">{{ 'navigation.home' | translate }}</a>
          <a href="#" class="ngxsmk-demo-mobile-link">{{ 'navigation.projects' | translate }}</a>
          <a href="#" class="ngxsmk-demo-mobile-link">{{ 'navigation.settings' | translate }}</a>
          <a href="#" class="ngxsmk-demo-mobile-link">{{ 'navigation.signOut' | translate }}</a>
        </ngxsmk-mobile-nav>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'navigation.linkProvider' | translate"
      [description]="'navigation.linkProviderDesc' | translate"
      [code]="codeLinkProvider"
      [component]="NgxsmkLinkProvider"
    >
      <nav
        class="ngxsmk-sc-wrap"
        [ngxsmkLinkProvider]="linkTpl"
        [attr.aria-label]="'navigation.primaryAria' | translate"
      >
        @for (item of linkItems; track item.href) {
          <a
            class="ngxsmk-link"
            [href]="item.href"
            [class.ngxsmk-link--active]="item.href === activeLink()"
            (click)="activeLink.set(item.href)"
            >{{ item.label }}</a
          >
        }
      </nav>
      <ng-template #linkTpl let-link>
        <a class="ngxsmk-link" [href]="link.href">{{ link.label }}</a>
      </ng-template>
    </showcase-example>

    <showcase-example
      [title]="'navigation.sideNavComposed' | translate"
      [description]="'navigation.sideNavComposedDesc' | translate"
      [code]="codeSideNavComposed"
      [component]="NgxsmkSideNav"
      [customize]="customizeNgxsmkSideNav"
    >
      <div
        style="height: 280px; position: relative; overflow: hidden; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-lg);"
      >
        <ngxsmk-side-nav>
          <ngxsmk-side-nav-section>
            <ngxsmk-side-nav-heading>{{
              'navigation.workspace' | translate
            }}</ngxsmk-side-nav-heading>
            @for (item of sideNavComposedMain; track item.id) {
              <ngxsmk-side-nav-item
                [active]="sideNavComposedActive() === item.id"
                (clicked)="sideNavComposedActive.set(item.id)"
                >{{ item.label }}</ngxsmk-side-nav-item
              >
            }
          </ngxsmk-side-nav-section>
          <ngxsmk-side-nav-section>
            <ngxsmk-side-nav-heading>{{
              'navigation.account' | translate
            }}</ngxsmk-side-nav-heading>
            @for (item of sideNavComposedAccount; track item.id) {
              <ngxsmk-side-nav-item
                [active]="sideNavComposedActive() === item.id"
                (clicked)="sideNavComposedActive.set(item.id)"
                >{{ item.label }}</ngxsmk-side-nav-item
              >
            }
          </ngxsmk-side-nav-section>
          <ngxsmk-side-nav-collapse-button />
        </ngxsmk-side-nav>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'navigation.topNavComposed' | translate"
      [description]="'navigation.topNavComposedDesc' | translate"
      [code]="codeTopNavComposed"
      [component]="NgxsmkTopNavHeading"
      [customize]="customizeNgxsmkTopNavHeading"
    >
      <div
        style="height: 220px; position: relative; width: 100%; overflow: hidden; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-lg);"
      >
        <div class="ngxsmk-top-nav">
          <ngxsmk-top-nav-heading>Acme</ngxsmk-top-nav-heading>
          @for (item of topNavComposedLinks; track item.id) {
            <ngxsmk-top-nav-item
              [active]="topNavComposedActive() === item.id"
              (clicked)="topNavComposedActive.set(item.id)"
              >{{ item.label }}</ngxsmk-top-nav-item
            >
          }
          <ngxsmk-top-nav-menu>
            <ngxsmk-top-nav-item>{{ 'navigation.resources' | translate }} ▾</ngxsmk-top-nav-item>
          </ngxsmk-top-nav-menu>
        </div>
        <div class="ngxsmk-top-nav-composed__mega">
          @for (item of topNavComposedMega; track item.title) {
            <ngxsmk-top-nav-mega-menu-item
              [title]="item.title"
              [description]="item.description"
              href="#"
            />
          }
          <ngxsmk-top-nav-mega-menu-featured-card href="#">
            <strong>{{ 'navigation.whatsNew' | translate }}</strong>
            <span>{{ 'navigation.whatsNewDesc' | translate }}</span>
          </ngxsmk-top-nav-mega-menu-featured-card>
        </div>
      </div>
    </showcase-example>
  `,
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-demo-hint {
      margin: 0.5rem 0 0;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .ngxsmk-demo-mobile-link {
      display: block;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-2);
      border-radius: var(--ngxsmk-radius-md);
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
    }
    .ngxsmk-demo-mobile-link:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-link {
      display: inline-flex;
      align-items: center;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border-radius: var(--ngxsmk-radius-md);
      text-decoration: none;
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .ngxsmk-link:hover {
      background: var(--ngxsmk-color-surface-hover);
    }
    .ngxsmk-link--active {
      color: var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-primary-container);
    }

    .ngxsmk-top-nav-composed__mega {
      display: flex;
      gap: var(--ngxsmk-space-3);
      flex-wrap: wrap;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
    }

    .ngxsmk-top-nav {
      display: flex;
      align-items: center;
      height: var(--ngxsmk-topnav-height, 3.5rem);
      padding: 0 var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      gap: var(--ngxsmk-space-2);
    }
  `,
})
export class NavigationPage {
  protected readonly NgxsmkBreadcrumbItem = NgxsmkBreadcrumbItem;
  protected readonly customizeNgxsmkBreadcrumbItem = `/* Theme <ngxsmk-breadcrumb-item> via design tokens */
ngxsmk-breadcrumb-item {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-2: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkOutline = NgxsmkOutline;
  protected readonly customizeNgxsmkOutline = `/* Theme <ngxsmk-outline> via design tokens */
ngxsmk-outline {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-1-5: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-body-sm-line: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkTabMenu = NgxsmkTabMenu;
  protected readonly customizeNgxsmkTabMenu = `/* Theme <ngxsmk-tab-menu> via design tokens */
ngxsmk-tab-menu {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-color-surface-variant: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-shadow-sm: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-3: ;
  --ngxsmk-text-label-md-size: ;
}`;
  protected readonly NgxsmkNavIcon = NgxsmkNavIcon;
  protected readonly customizeNgxsmkNavIcon = `/* Theme <ngxsmk-nav-icon> via design tokens */
ngxsmk-nav-icon {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-md-size: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkNavHeadingMenu = NgxsmkNavHeadingMenu;
  protected readonly customizeNgxsmkNavHeadingMenu = `/* Theme <ngxsmk-nav-heading-menu> via design tokens */
ngxsmk-nav-heading-menu {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-duration-fast: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-md: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-sm-size: ;
}`;
  protected readonly NgxsmkSideNav = NgxsmkSideNav;
  protected readonly customizeNgxsmkSideNav = `/* Theme <ngxsmk-side-nav> via design tokens */
ngxsmk-side-nav {
  --ngxsmk-color-outline: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-duration-normal: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-sidenav-collapsed-width: ;
  --ngxsmk-sidenav-width: ;
  --ngxsmk-space-1: ;
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkTopNav = NgxsmkTopNav;
  protected readonly customizeNgxsmkTopNav = `/* Theme <ngxsmk-top-nav> via design tokens */
ngxsmk-top-nav {
  --ngxsmk-color-outline: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-container-max-width: ;
  --ngxsmk-space-2: ;
  --ngxsmk-space-4: ;
  --ngxsmk-topnav-height: ;
}`;
  protected readonly NgxsmkMobileNavToggle = NgxsmkMobileNavToggle;
  protected readonly customizeNgxsmkMobileNavToggle = `/* Theme <ngxsmk-mobile-nav-toggle> via design tokens */
ngxsmk-mobile-nav-toggle {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-radius-md: ;
}`;
  protected readonly NgxsmkLinkProvider = NgxsmkLinkProvider;
  protected readonly NgxsmkTopNavHeading = NgxsmkTopNavHeading;
  protected readonly customizeNgxsmkTopNavHeading = `/* Theme <ngxsmk-top-nav-heading> via design tokens */
ngxsmk-top-nav-heading {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-title-md-size: ;
}`;

  protected readonly outlineItems: AppOutlineItem[] = [
    { id: 'intro', label: 'Introduction', depth: 0 },
    { id: 'install', label: 'Installation', depth: 0 },
    { id: 'config', label: 'Configuration', depth: 1 },
    { id: 'theming', label: 'Theming', depth: 1 },
    { id: 'api', label: 'API Reference', depth: 0 },
  ];
  protected readonly outlineActive = signal('config');

  protected readonly tabActive = signal('overview');
  protected readonly navIconActive = signal('home');
  protected readonly sideNavActive = signal('dashboard');
  protected readonly topNavActive = signal('home');
  protected readonly mobileNavOpen = signal(false);

  protected readonly linkItems: { href: string; label: string }[] = [
    { href: '/overview', label: 'Overview' },
    { href: '/projects', label: 'Projects' },
    { href: '/tasks', label: 'Tasks' },
    { href: '/settings', label: 'Settings' },
  ];
  protected readonly activeLink = signal('/overview');

  protected readonly sideNavComposedActive = signal('dashboard');
  protected readonly sideNavComposedMain = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'reports', label: 'Reports' },
  ];
  protected readonly sideNavComposedAccount = [
    { id: 'profile', label: 'Profile' },
    { id: 'billing', label: 'Billing' },
  ];

  protected readonly topNavComposedActive = signal('home');
  protected readonly topNavComposedLinks = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];
  protected readonly topNavComposedMega = [
    { title: 'Analytics', description: 'Track your metrics' },
    { title: 'Automation', description: 'Build workflows' },
    { title: 'Insights', description: 'Surface trends' },
  ];

  protected readonly codeBreadcrumb = `<nav aria-label="Breadcrumb">
  <ngxsmk-breadcrumb-item href="/">Home</ngxsmk-breadcrumb-item>
  <ngxsmk-breadcrumb-item href="/docs">Docs</ngxsmk-breadcrumb-item>
  <ngxsmk-breadcrumb-item>Components</ngxsmk-breadcrumb-item>
</nav>`;

  protected readonly codeOutline = `<ngxsmk-outline [items]="outlineItems" [(activeId)]="activeId" />`;

  protected readonly codeTabMenu = `<ngxsmk-tab-menu>
  <button role="tab">Overview</button>
  <button role="tab">Activity</button>
  <button role="tab">Settings</button>
</ngxsmk-tab-menu>`;

  protected readonly codeNavIcon = `<ngxsmk-nav-icon label="Home" [active]="true">
  <svg viewBox="0 0 24 24" .../>
</ngxsmk-nav-icon>`;

  protected readonly codeNavHeadingMenu = `<ngxsmk-nav-heading-menu>
  Products
  <a nav-item href="#">Overview</a>
  <a nav-item href="#">Pricing</a>
  <a nav-item href="#">Changelog</a>
</ngxsmk-nav-heading-menu>`;

  protected readonly codeSideNav = `<ngxsmk-side-nav>
  <ngxsmk-side-nav-section>
    <ngxsmk-side-nav-heading>Workspace</ngxsmk-side-nav-heading>
    <ngxsmk-side-nav-item [active]="true">Dashboard</ngxsmk-side-nav-item>
    <ngxsmk-side-nav-item badge="3">Analytics</ngxsmk-side-nav-item>
  </ngxsmk-side-nav-section>
  <ngxsmk-side-nav-collapse-button />
</ngxsmk-side-nav>`;

  protected readonly codeTopNav = `<ngxsmk-top-nav>
  <ngxsmk-top-nav-heading>Acme</ngxsmk-top-nav-heading>
  <ngxsmk-top-nav-item [active]="true">Home</ngxsmk-top-nav-item>
  <ngxsmk-top-nav-menu>
    <ngxsmk-top-nav-item>Resources ▾</ngxsmk-top-nav-item>
  </ngxsmk-top-nav-menu>
</ngxsmk-top-nav>`;

  protected readonly codeMegaMenu = `<ngxsmk-top-nav-mega-menu [featured]="true">
  Products ▾
  <div mega-column>
    <ngxsmk-top-nav-mega-menu-item title="Analytics" description="Track metrics" href="#" />
  </div>
  <ngxsmk-top-nav-mega-menu-featured-card mega-featured href="#">
    <strong>What's new</strong>
  </ngxsmk-top-nav-mega-menu-featured-card>
</ngxsmk-top-nav-mega-menu>`;

  protected readonly codeMobileNav = `<ngxsmk-mobile-nav-toggle (toggled)="open = !open" />
<ngxsmk-mobile-nav [open]="open" (openedChange)="open = $event" label="Acme">
  <a href="#">Home</a>
  <a href="#">Settings</a>
</ngxsmk-mobile-nav>`;

  protected readonly codeLinkProvider = `<nav [ngxsmkLinkProvider]="linkTpl" aria-label="Primary">
  @for (item of linkItems; track item.href) {
    <a class="ngxsmk-link" [href]="item.href" [class.ngxsmk-link--active]="item.href === activeLink()">{{ item.label }}</a>
  }
</nav>
<ng-template #linkTpl let-link>
  <a class="ngxsmk-link" [href]="link.href">{{ link.label }}</a>
</ng-template>`;

  protected readonly codeSideNavComposed = `<ngxsmk-side-nav>
  <ngxsmk-side-nav-section>
    <ngxsmk-side-nav-heading>Workspace</ngxsmk-side-nav-heading>
    <ngxsmk-side-nav-item [active]="true">Dashboard</ngxsmk-side-nav-item>
    <ngxsmk-side-nav-item>Analytics</ngxsmk-side-nav-item>
  </ngxsmk-side-nav-section>
  <ngxsmk-side-nav-collapse-button />
</ngxsmk-side-nav>`;

  protected readonly codeTopNavComposed = `<div class="ngxsmk-top-nav">
  <ngxsmk-top-nav-heading>Acme</ngxsmk-top-nav-heading>
  <ngxsmk-top-nav-item [active]="true">Home</ngxsmk-top-nav-item>
  <ngxsmk-top-nav-menu>
    <ngxsmk-top-nav-item>Resources ▾</ngxsmk-top-nav-item>
  </ngxsmk-top-nav-menu>
</div>
<div class="ngxsmk-top-nav-composed__mega">
  <ngxsmk-top-nav-mega-menu-item title="Analytics" description="Metrics" href="#" />
  <ngxsmk-top-nav-mega-menu-featured-card href="#">
    <strong>What's new</strong>
  </ngxsmk-top-nav-mega-menu-featured-card>
</div>`;
}
