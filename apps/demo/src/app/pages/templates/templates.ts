import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { NgxsmkDialog } from '@ngxsmk/core/dialog';
import { NgxsmkTabs, NgxsmkTab } from '@ngxsmk/core/tabs';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkDivider } from '@ngxsmk/core/divider';
import { NgxsmkCodeBlock } from '@ngxsmk/core/code-block';
import { NgxsmkCopyToClipboard } from '@ngxsmk/core/copy-to-clipboard';
import { NgxsmkChatWindow } from '@ngxsmk/core/chat-window';
import { NgxsmkKanbanBoard, KanbanColumn } from '@ngxsmk/core/kanban-board';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkTable } from '@ngxsmk/core/table';
import { NgxsmkSelect } from '@ngxsmk/core/select';
import { NgxsmkBarChart } from '@ngxsmk/core/chart-bar';
import { NgxsmkTerminal } from '@ngxsmk/core/terminal';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkTransfer } from '@ngxsmk/core/transfer';
import { NgxsmkSignaturePad } from '@ngxsmk/core/signature-pad';
import { NgxsmkDock } from '@ngxsmk/core/dock';
import { NgxsmkCalendarHeatmap } from '@ngxsmk/core/calendar-heatmap';
import { NgxsmkVirtualScroll } from '@ngxsmk/core/virtual-scroll';
import { NgxsmkPinInput } from '@ngxsmk/core/pin-input';
import { Component, signal, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { APP_VERSION } from '../../core/version';

type TemplateCategory =
  'All' | 'Application' | 'Marketing' | 'E-Commerce' | 'Authentication' | 'DevOps';

interface TemplateItem {
  id: string;
  title: string;
  category: Exclude<TemplateCategory, 'All'>;
  description: string;
  code: string;
  gradient: string;
}

@Component({
  selector: 'templates-page',
  standalone: true,
  imports: [
    NgxsmkButton,
    NgxsmkHeading,
    NgxsmkText,
    NgxsmkDialog,
    NgxsmkTabs,
    NgxsmkTab,
    NgxsmkStat,
    NgxsmkBadge,
    NgxsmkDivider,
    NgxsmkCodeBlock,
    NgxsmkCopyToClipboard,
    NgxsmkChatWindow,
    NgxsmkKanbanBoard,
    NgxsmkFormField,
    NgxsmkInputDirective,
    NgxsmkSwitch,
    NgxsmkTable,
    NgxsmkSelect,
    NgxsmkBarChart,
    NgxsmkTerminal,
    NgxsmkTransfer,
    NgxsmkSignaturePad,
    NgxsmkDock,
    NgxsmkCalendarHeatmap,
    NgxsmkVirtualScroll,
    NgxsmkPinInput,
    NgTemplateOutlet,
    FormsModule,
    RouterLink,
    TranslatePipe,
    AppNav,
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page-container">
      <div class="ngxsmk-page">
        <header class="tpl-header">
          <div class="tpl-header__lead">
            <span class="tpl-header__eyebrow">// templates</span>
            <ngxsmk-heading level="h1" class="tpl-header__title">{{
              'nav.templates' | translate
            }}</ngxsmk-heading>
            <ngxsmk-text variant="body" class="tpl-header__sub">{{
              'templates.subtitle' | translate
            }}</ngxsmk-text>
          </div>
          <dl class="tpl-header__spec" [attr.aria-label]="'templates.templatesWord' | translate">
            <div class="tpl-header__spec-cell">
              <dt>{{ 'templates.templatesWord' | translate }}</dt>
              <dd>{{ pad(templatesList.length) }}</dd>
            </div>
            <div class="tpl-header__spec-cell">
              <dt>license</dt>
              <dd>MIT</dd>
            </div>
            <div class="tpl-header__spec-cell">
              <dt>rev</dt>
              <dd>v{{ appVersion }}</dd>
            </div>
          </dl>
        </header>

        <div class="ngxsmk-templates-toolbar">
          <div class="ngxsmk-templates-toolbar-row">
            <div class="ngxsmk-templates-categories">
              @for (cat of categories; track cat) {
                <button
                  class="ngxsmk-category-chip"
                  [class.active]="activeCategory() === cat"
                  (click)="activeCategory.set(cat)"
                >
                  {{ 'templates.cat.' + cat | translate }}
                  @if (cat !== 'All') {
                    <span class="chip-count">({{ categoryCount(cat) }})</span>
                  }
                </button>
              }
            </div>
            <div class="ngxsmk-search-wrapper">
              <svg
                class="search-icon"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                class="ngxsmk-search-input"
                type="text"
                [attr.placeholder]="'templates.searchPlaceholder' | translate"
                [ngModel]="searchQuery()"
                (ngModelChange)="searchQuery.set($event)"
              />
              @if (searchQuery()) {
                <button class="search-clear" (click)="searchQuery.set('')">
                  <svg
                    viewBox="0 0 24 24"
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              }
            </div>
          </div>
          <div class="ngxsmk-templates-toolbar-sub">
            <ngxsmk-text variant="caption" class="ngxsmk-result-count">
              {{ 'templates.cat.' + activeCategory() | translate }}
              {{ 'templates.templatesWord' | translate }}
              <span class="count-num">({{ filteredTemplates().length }})</span>
            </ngxsmk-text>
          </div>
        </div>

        @if (filteredTemplates().length === 0) {
          <div class="ngxsmk-templates-empty">
            <svg
              viewBox="0 0 24 24"
              width="48"
              height="48"
              fill="none"
              stroke="currentColor"
              stroke-width="1"
              stroke-linecap="round"
              stroke-linejoin="round"
              style="opacity: 0.3;"
            >
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <ngxsmk-text variant="body">{{ 'templates.empty' | translate }}</ngxsmk-text>
          </div>
        }

        <div class="tpl-layout">
          <aside class="tpl-index" aria-label="Template index">
            <span class="tpl-index__label">// index</span>
            <nav class="tpl-index__list">
              @for (tpl of filteredTemplates(); track tpl.id; let i = $index) {
                <a class="tpl-index__item" [routerLink]="[]" [fragment]="'tpl-' + tpl.id">
                  <span class="tpl-index__code">NGX-{{ pad(i + 1) }}</span>
                  <span class="tpl-index__dot" [attr.data-cat]="tpl.category"></span>
                  <span class="tpl-index__name">{{ tpl.title | translate }}</span>
                </a>
              }
            </nav>
          </aside>

          <div class="tpl-grid">
            @for (tpl of filteredTemplates(); track tpl.id; let i = $index) {
              <article class="tpl-card" [id]="'tpl-' + tpl.id" [style.--tpl-i]="i">
                <div
                  class="tpl-card__preview"
                  role="button"
                  tabindex="0"
                  [attr.aria-label]="
                    'templates.previewAria' | translate: { title: tpl.title | translate }
                  "
                  (click)="openPreview(tpl)"
                  (keydown.enter)="openPreview(tpl)"
                >
                  <!-- Gradient accent strip unique to each template -->
                  <div
                    class="tpl-card__gradient-strip"
                    [style.background]="tpl.gradient"
                    aria-hidden="true"
                  ></div>
                  <div class="tpl-card__frame" aria-hidden="true">
                    <ng-container
                      [ngTemplateOutlet]="miniPreview"
                      [ngTemplateOutletContext]="{ id: tpl.id }"
                    />
                  </div>
                  <div class="tpl-card__fade" aria-hidden="true"></div>
                  <div class="tpl-card__hover">
                    <span class="tpl-card__hover-pill">
                      <svg
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {{ 'templates.livePreview' | translate }}
                    </span>
                  </div>
                </div>
                <div class="tpl-card__body">
                  <div class="tpl-card__block" [attr.data-cat]="tpl.category">
                    <span class="tpl-card__sheet">NGX-{{ pad(i + 1) }}</span>
                    <span class="tpl-card__cat">
                      <span class="tpl-card__cat-swatch" aria-hidden="true"></span>
                      {{ 'templates.cat.' + tpl.category | translate }}
                    </span>
                    <span class="tpl-card__rev">v{{ appVersion }}</span>
                  </div>
                  <ngxsmk-heading level="h3" class="tpl-card__title">{{
                    tpl.title | translate
                  }}</ngxsmk-heading>
                  <ngxsmk-text variant="body" class="tpl-card__desc">{{
                    tpl.description | translate
                  }}</ngxsmk-text>
                  <div class="tpl-card__actions">
                    <button ngxsmk-button size="sm" variant="outline" (click)="openPreview(tpl)">
                      <svg
                        class="btn-icon"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      {{ 'templates.preview' | translate }}
                    </button>
                    <button ngxsmk-button size="sm" variant="ghost" (click)="openCode(tpl)">
                      <svg
                        class="btn-icon"
                        viewBox="0 0 24 24"
                        width="14"
                        height="14"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      >
                        <polyline points="16 18 22 12 16 6" />
                        <polyline points="8 6 2 12 8 18" />
                      </svg>
                      {{ 'templates.getCode' | translate }}
                    </button>
                  </div>
                </div>
              </article>
            }
          </div>
        </div>
      </div>

      <!-- Shared mini preview: rendered scaled inside cards and full-size in the dialog -->
      <ng-template #miniPreview let-id="id">
        <div class="ngxsmk-mock-window">
          <div class="ngxsmk-mock-window-titlebar">
            <div class="ngxsmk-mock-window-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="ngxsmk-mock-window-address-bar">
              <svg
                viewBox="0 0 24 24"
                width="12"
                height="12"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                class="lock-icon"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              <span>https://ngxsmk.design/templates/{{ id }}</span>
            </div>
          </div>

          <div class="ngxsmk-mock-window-content">
            <!-- 1. Admin Dashboard Template Preview -->
            @if (id === 'dashboard') {
              <div class="ngxsmk-mock-dashboard">
                <div class="ngxsmk-mock-header">
                  <ngxsmk-heading level="h4" class="mock-panel-title">{{
                    'templates.mock.adminConsole' | translate
                  }}</ngxsmk-heading>
                  <div style="flex-grow:1"></div>
                  <ngxsmk-badge variant="info">{{ appVersion }}</ngxsmk-badge>
                  <ngxsmk-text
                    variant="body"
                    style="margin-left: 1rem; font-weight: 500; font-size: var(--ngxsmk-text-body-sm-size); color: var(--ngxsmk-color-on-surface);"
                    >Sachin Dilshan</ngxsmk-text
                  >
                </div>

                <div class="ngxsmk-mock-body">
                  <div class="ngxsmk-mock-sidebar">
                    @for (item of adminNav; track item.id) {
                      <button
                        type="button"
                        class="ngxsmk-mock-side-item"
                        [class.active]="adminView() === item.id"
                        (click)="adminView.set(item.id)"
                      >
                        {{ item.label | translate }}
                      </button>
                    }
                  </div>

                  <div class="ngxsmk-mock-content">
                    @switch (adminView()) {
                      @case ('dashboard') {
                        <div class="ngxsmk-mock-stats">
                          <ngxsmk-stat
                            label="{{ 'templates.mock.activeUsers' | translate }}"
                            value="1,245"
                            trend="up"
                          />
                          <ngxsmk-stat
                            label="{{ 'templates.mock.monthlyRevenue' | translate }}"
                            value="$45,231"
                            trend="up"
                          />
                          <ngxsmk-stat
                            label="{{ 'templates.mock.serverLoad' | translate }}"
                            value="23.4%"
                            trend="down"
                          />
                        </div>
                        <div class="ngxsmk-mock-dashboard-grid">
                          <div class="ngxsmk-mock-section table-section">
                            <ngxsmk-heading
                              level="h4"
                              style="margin-bottom: 0.75rem; font-size: var(--ngxsmk-text-body-md-size); font-weight: 600;"
                              >{{
                                'templates.mock.recentRegistrations' | translate
                              }}</ngxsmk-heading
                            >
                            <ngxsmk-table
                              [columns]="tableColumns"
                              [rows]="tableRows"
                              [striped]="true"
                            />
                          </div>
                          <div class="ngxsmk-mock-section chart-section">
                            <ngxsmk-heading
                              level="h4"
                              style="margin-bottom: 0.75rem; font-size: var(--ngxsmk-text-body-md-size); font-weight: 600;"
                              >{{ 'templates.mock.weeklyOperations' | translate }}</ngxsmk-heading
                            >
                            <div
                              style="display: flex; justify-content: center; align-items: center; height: 160px;"
                            >
                              <ngxsmk-chart-bar [data]="chartData" [width]="240" [height]="120" />
                            </div>
                          </div>
                        </div>
                      }
                      @case ('analytics') {
                        <div class="ngxsmk-mock-stats">
                          <ngxsmk-stat
                            label="{{ 'templates.mock.pageViews' | translate }}"
                            value="82.4k"
                            trend="up"
                          />
                          <ngxsmk-stat
                            label="{{ 'templates.mock.bounceRate' | translate }}"
                            value="38.2%"
                            trend="down"
                          />
                          <ngxsmk-stat
                            label="{{ 'templates.mock.avgSession' | translate }}"
                            value="4m 12s"
                            trend="up"
                          />
                        </div>
                        <div class="ngxsmk-mock-dashboard-grid">
                          <div class="ngxsmk-mock-section">
                            <ngxsmk-heading
                              level="h4"
                              style="margin-bottom: 0.75rem; font-size: var(--ngxsmk-text-body-md-size); font-weight: 600;"
                              >{{ 'templates.mock.trafficOverview' | translate }}</ngxsmk-heading
                            >
                            <div
                              style="display: flex; justify-content: center; align-items: center; height: 160px;"
                            >
                              <ngxsmk-chart-bar
                                [data]="analyticsData"
                                [width]="240"
                                [height]="120"
                              />
                            </div>
                          </div>
                          <div class="ngxsmk-mock-section">
                            <ngxsmk-heading
                              level="h4"
                              style="margin-bottom: 0.75rem; font-size: var(--ngxsmk-text-body-md-size); font-weight: 600;"
                              >{{ 'templates.mock.trafficSources' | translate }}</ngxsmk-heading
                            >
                            >
                            <div class="admin-bars">
                              @for (s of trafficSources; track s.label) {
                                <div class="admin-bar-row">
                                  <span class="admin-bar-label">{{ s.label | translate }}</span>
                                  <div class="admin-bar-track">
                                    <div class="admin-bar-fill" [style.width.%]="s.value"></div>
                                  </div>
                                  <span class="admin-bar-val">{{ s.value }}%</span>
                                </div>
                              }
                            </div>
                          </div>
                        </div>
                      }
                      @case ('users') {
                        <div class="admin-users-toolbar">
                          <ngxsmk-heading
                            level="h4"
                            style="font-size: var(--ngxsmk-text-body-md-size); font-weight: 600; margin: 0;"
                            >{{ 'templates.mock.teamMembers' | translate }}</ngxsmk-heading
                          >
                          <button ngxsmk-button size="sm">
                            {{ 'templates.mock.addUser' | translate }}
                          </button>
                        </div>
                        <div class="admin-user-list">
                          @for (u of usersList; track u.email) {
                            <div class="admin-user-row">
                              <span class="admin-avatar" [style.background]="u.color">{{
                                u.initials
                              }}</span>
                              <div class="admin-user-info">
                                <span class="admin-user-name">{{ u.name }}</span>
                                <span class="admin-user-email">{{ u.email }}</span>
                              </div>
                              <span class="admin-user-role">{{ u.role | translate }}</span>
                              <ngxsmk-badge
                                [variant]="u.status === 'Active' ? 'success' : 'warning'"
                                >{{ u.status }}</ngxsmk-badge
                              >
                            </div>
                          }
                        </div>
                      }
                      @case ('settings') {
                        <div class="admin-settings">
                          <ngxsmk-form-field
                            label="{{ 'templates.mock.displayName' | translate }}"
                            hint="{{ 'templates.mock.displayNameHint' | translate }}"
                          >
                            <input ngxsmkInput placeholder="Sachin Dilshan" />
                          </ngxsmk-form-field>
                          <ngxsmk-form-field
                            label="{{ 'templates.mock.emailAddress' | translate }}"
                          >
                            <input ngxsmkInput type="email" placeholder="admin@ngxsmk.dev" />
                          </ngxsmk-form-field>
                          <ngxsmk-form-field
                            label="{{ 'templates.mock.interfaceTheme' | translate }}"
                          >
                            <ngxsmk-select [options]="themeOptions" value="system" />
                          </ngxsmk-form-field>
                          <ngxsmk-divider />
                          <ngxsmk-form-field
                            label="{{ 'templates.mock.emailNotifications' | translate }}"
                            hint="{{ 'templates.mock.emailNotificationsHint' | translate }}"
                          >
                            <ngxsmk-switch [checked]="true" />
                          </ngxsmk-form-field>
                          <ngxsmk-form-field
                            label="{{ 'templates.mock.twoFactor' | translate }}"
                            hint="{{ 'templates.mock.twoFactorHint' | translate }}"
                          >
                            <ngxsmk-switch [checked]="false" />
                          </ngxsmk-form-field>
                          <div class="admin-settings-actions">
                            <button ngxsmk-button size="sm">
                              {{ 'templates.mock.saveChanges' | translate }}
                            </button>
                            <button ngxsmk-button size="sm" variant="outline">
                              {{ 'templates.mock.cancel' | translate }}
                            </button>
                          </div>
                        </div>
                      }
                    }
                  </div>
                </div>
              </div>
            }

            <!-- 2. AI Chat Interface Template Preview -->
            @if (id === 'ai-chat') {
              <div class="ngxsmk-mock-chat">
                <div class="ngxsmk-mock-chat-header">
                  <ngxsmk-heading level="h4" class="mock-panel-title">{{
                    'templates.mock.aiAssistant' | translate
                  }}</ngxsmk-heading>
                  <span
                    style="font-size: var(--ngxsmk-text-body-sm-size); color: var(--ngxsmk-color-success); font-weight: 600;"
                    >{{ 'templates.mock.online' | translate }}</span
                  >
                </div>
                <div class="ngxsmk-mock-chat-window-wrapper">
                  <ngxsmk-chat-window [messages]="chatMessages" />
                </div>
                <div class="ngxsmk-mock-chat-composer">
                  <input
                    ngxsmkInput
                    [attr.placeholder]="'templates.mock.askAnything' | translate"
                    style="flex: 1;"
                  />
                  <button ngxsmk-button>{{ 'templates.mock.send' | translate }}</button>
                </div>
              </div>
            }

            <!-- 3. SaaS Landing Page Template Preview -->
            @if (id === 'landing-page') {
              <div class="ngxsmk-mock-landing">
                <div class="ngxsmk-mock-landing-nav">
                  <div
                    style="font-weight: 700; font-family: 'Outfit'; font-size: var(--ngxsmk-text-body-lg-size); color: var(--ngxsmk-color-primary);"
                  >
                    ngxsmk SaaS
                  </div>
                  <div
                    style="display: flex; gap: 1.5rem; font-size: var(--ngxsmk-text-body-sm-size); font-weight: 500; color: var(--ngxsmk-color-on-surface-variant);"
                  >
                    <span>{{ 'templates.mock.features' | translate }}</span>
                    <span>{{ 'templates.mock.pricing' | translate }}</span>
                    <span>{{ 'nav.docs' | translate }}</span>
                  </div>
                  <button ngxsmk-button size="sm">{{ 'nav.getStarted' | translate }}</button>
                </div>

                <div class="ngxsmk-mock-landing-hero">
                  <ngxsmk-heading
                    level="h1"
                    style="font-size: var(--ngxsmk-text-display-sm-size); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2;"
                    >{{ 'templates.mock.innovateFaster' | translate }}</ngxsmk-heading
                  >
                  >
                  <ngxsmk-text
                    variant="body"
                    style="font-size: var(--ngxsmk-text-body-md-size); opacity: 0.8; max-width: 480px; margin: 0.5rem auto 1.5rem; line-height: 1.6;"
                  >
                    {{ 'templates.mock.landingHero' | translate }}
                  </ngxsmk-text>
                  <div style="display: flex; gap: 0.75rem; justify-content: center;">
                    <button ngxsmk-button>{{ 'templates.mock.startFreeTrial' | translate }}</button>
                    <button ngxsmk-button variant="outline">
                      {{ 'templates.mock.learnMore' | translate }}
                    </button>
                  </div>
                </div>

                <div class="ngxsmk-mock-landing-pricing">
                  <div class="ngxsmk-mock-price-card">
                    <ngxsmk-heading
                      level="h4"
                      style="font-size: var(--ngxsmk-text-body-md-size); font-weight: 600;"
                      >{{ 'templates.mock.starter' | translate }}</ngxsmk-heading
                    >
                    >
                    <div class="ngxsmk-mock-price-val">
                      $0<span
                        style="font-size: var(--ngxsmk-text-body-sm-size); font-weight: 400; opacity: 0.7;"
                        >/mo</span
                      >
                    </div>
                    <ngxsmk-divider />
                    <ul class="ngxsmk-mock-price-features">
                      <li>{{ 'templates.mock.starterF1' | translate }}</li>
                      <li>{{ 'templates.mock.starterF2' | translate }}</li>
                      <li>{{ 'templates.mock.starterF3' | translate }}</li>
                    </ul>
                    <button ngxsmk-button variant="outline" style="width: 100%;">
                      {{ 'templates.mock.signUp' | translate }}
                    </button>
                  </div>

                  <div class="ngxsmk-mock-price-card highlighted">
                    <div class="ngxsmk-mock-price-badge">
                      {{ 'templates.mock.popular' | translate }}
                    </div>
                    <ngxsmk-heading
                      level="h4"
                      style="font-size: var(--ngxsmk-text-body-md-size); font-weight: 600;"
                      >{{ 'templates.mock.professional' | translate }}</ngxsmk-heading
                    >
                    >
                    <div class="ngxsmk-mock-price-val">
                      $49<span
                        style="font-size: var(--ngxsmk-text-body-sm-size); font-weight: 400; opacity: 0.7;"
                        >/mo</span
                      >
                    </div>
                    <ngxsmk-divider />
                    <ul class="ngxsmk-mock-price-features">
                      <li>{{ 'templates.mock.proF1' | translate }}</li>
                      <li>{{ 'templates.mock.proF2' | translate }}</li>
                      <li>{{ 'templates.mock.proF3' | translate }}</li>
                    </ul>
                    <button ngxsmk-button style="width: 100%;">
                      {{ 'templates.mock.getPro' | translate }}
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- 4. Kanban Task Board Template Preview -->
            @if (id === 'kanban') {
              <div class="ngxsmk-mock-kanban">
                <div class="ngxsmk-mock-kanban-header">
                  <ngxsmk-heading level="h4" class="mock-panel-title">{{
                    'templates.mock.sprintBoard' | translate
                  }}</ngxsmk-heading>
                  <ngxsmk-badge>{{ 'templates.mock.activeSprint' | translate }}</ngxsmk-badge>
                </div>
                <div class="ngxsmk-mock-kanban-body">
                  <ngxsmk-kanban-board [(columns)]="kanbanColumns" />
                </div>
              </div>
            }

            <!-- 5. User Settings Page Template Preview -->
            @if (id === 'settings') {
              <div class="ngxsmk-mock-settings">
                <div class="ngxsmk-mock-settings-header">
                  <ngxsmk-heading level="h4" class="mock-panel-title">{{
                    'templates.mock.systemConfig' | translate
                  }}</ngxsmk-heading>
                </div>
                <div class="ngxsmk-mock-settings-body">
                  <ngxsmk-tabs value="profile">
                    <ngxsmk-tab
                      value="profile"
                      label="{{ 'templates.mock.profileSettings' | translate }}"
                    >
                      <div
                        style="display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; max-width: 480px;"
                      >
                        <ngxsmk-form-field
                          label="{{ 'templates.mock.displayName' | translate }}"
                          hint="{{ 'templates.mock.displayNameHintProfile' | translate }}"
                        >
                          <input ngxsmkInput placeholder="Sachin Dilshan" />
                        </ngxsmk-form-field>
                        <ngxsmk-form-field
                          label="{{ 'templates.mock.workspaceSubdomain' | translate }}"
                        >
                          <input ngxsmkInput placeholder="my-org" />
                        </ngxsmk-form-field>
                        <ngxsmk-form-field
                          label="{{ 'templates.mock.interfaceTheme' | translate }}"
                        >
                          <ngxsmk-select [options]="themeOptions" value="system" />
                        </ngxsmk-form-field>
                      </div>
                    </ngxsmk-tab>
                    <ngxsmk-tab
                      value="notifications"
                      label="{{ 'templates.mock.notificationFeeds' | translate }}"
                    >
                      <div
                        style="display: flex; flex-direction: column; gap: 1.25rem; padding-top: 1rem;"
                      >
                        <ngxsmk-form-field
                          label="{{ 'templates.mock.emailSummaries' | translate }}"
                          hint="{{ 'templates.mock.emailSummariesHint' | translate }}"
                        >
                          <ngxsmk-switch [checked]="true" />
                        </ngxsmk-form-field>
                        <ngxsmk-form-field
                          label="{{ 'templates.mock.desktopPush' | translate }}"
                          hint="{{ 'templates.mock.desktopPushHint' | translate }}"
                        >
                          <ngxsmk-switch [checked]="false" />
                        </ngxsmk-form-field>
                      </div>
                    </ngxsmk-tab>
                  </ngxsmk-tabs>
                </div>
              </div>
            }

            <!-- 6. E-Commerce Product Detail Template Preview -->
            @if (id === 'ecommerce-detail') {
              <div class="ngxsmk-mock-ecommerce">
                <div class="ngxsmk-mock-ecommerce-grid">
                  <div class="ngxsmk-mock-ecommerce-gallery">
                    <div class="gallery-primary-img">
                      <img
                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60"
                        [attr.alt]="'templates.mock.headphonesAlt' | translate"
                        class="product-preview-img"
                      />
                    </div>
                  </div>

                  <div class="ngxsmk-mock-ecommerce-info">
                    <ngxsmk-badge variant="info" style="align-self: flex-start;">{{
                      'templates.mock.freeShipping' | translate
                    }}</ngxsmk-badge>
                    <ngxsmk-heading
                      level="h2"
                      style="font-size: var(--ngxsmk-text-headline-sm-size); font-weight: 700; margin: 0.5rem 0;"
                      >AeroSound Pro Headphones</ngxsmk-heading
                    >

                    <div class="product-ratings-row">
                      <span class="stars-gold">★★★★★</span>
                      <span class="ratings-count">{{
                        'templates.mock.reviewsCount' | translate
                      }}</span>
                    </div>

                    <div class="product-price-row">
                      <span class="price-current">$199.00</span>
                      <span class="price-old">$249.00</span>
                    </div>

                    <ngxsmk-divider />

                    <ngxsmk-text
                      variant="body"
                      style="font-size: var(--ngxsmk-text-body-sm-size); line-height: 1.6; color: var(--ngxsmk-color-on-surface-variant);"
                    >
                      {{ 'templates.mock.headphonesDesc' | translate }}
                    </ngxsmk-text>

                    <div class="product-spec-row">
                      <span style="font-weight: 600; font-size: var(--ngxsmk-text-body-sm-size);">{{
                        'templates.mock.color' | translate
                      }}</span>
                      <div class="product-color-selector">
                        <span class="color-dot active" style="background-color: #09090b;"></span>
                        <span class="color-dot" style="background-color: #7c3aed;"></span>
                        <span class="color-dot" style="background-color: #10b981;"></span>
                      </div>
                    </div>

                    <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                      <button ngxsmk-button style="flex: 1;">
                        {{ 'templates.mock.addToCart' | translate }}
                      </button>
                      <button ngxsmk-button variant="outline">
                        {{ 'templates.mock.buyNow' | translate }}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }

            <!-- 7. Credentials Auth Cards Template Preview -->
            @if (id === 'auth-cards') {
              <div class="ngxsmk-mock-auth">
                <div class="ngxsmk-mock-auth-card">
                  <div class="ngxsmk-mock-auth-header">
                    <ngxsmk-heading
                      level="h3"
                      style="font-size: var(--ngxsmk-text-title-md-size); font-weight: 700;"
                      >{{ 'templates.mock.signInToAccount' | translate }}</ngxsmk-heading
                    >
                    <ngxsmk-text
                      variant="body"
                      style="font-size: var(--ngxsmk-text-body-sm-size); color: var(--ngxsmk-color-on-surface-variant);"
                      >{{ 'templates.mock.enterCredentials' | translate }}</ngxsmk-text
                    >
                  </div>

                  <div class="ngxsmk-mock-auth-socials">
                    <button
                      ngxsmk-button
                      variant="outline"
                      style="flex: 1; font-size: var(--ngxsmk-text-body-sm-size);"
                    >
                      Google
                    </button>
                    <button
                      ngxsmk-button
                      variant="outline"
                      style="flex: 1; font-size: var(--ngxsmk-text-body-sm-size);"
                    >
                      {{ 'nav.github' | translate }}
                    </button>
                  </div>

                  <div class="auth-divider-line">
                    <span>{{ 'templates.mock.orContinueEmail' | translate }}</span>
                  </div>

                  <div class="ngxsmk-mock-auth-form">
                    <ngxsmk-form-field label="{{ 'templates.mock.emailAddress' | translate }}">
                      <input ngxsmkInput type="email" placeholder="name@example.com" />
                    </ngxsmk-form-field>
                    <ngxsmk-form-field label="{{ 'templates.mock.password' | translate }}">
                      <input ngxsmkInput type="password" placeholder="••••••••" />
                    </ngxsmk-form-field>

                    <div
                      style="display: flex; justify-content: space-between; align-items: center; font-size: var(--ngxsmk-text-body-sm-size);"
                    >
                      <ngxsmk-switch [checked]="true">{{
                        'templates.mock.keepSignedIn' | translate
                      }}</ngxsmk-switch>
                      <a
                        href="#"
                        style="color: var(--ngxsmk-color-primary); text-decoration: none; font-weight: 500;"
                        >{{ 'templates.mock.forgot' | translate }}</a
                      >
                    </div>

                    <button ngxsmk-button style="width: 100%; margin-top: 0.5rem;">
                      {{ 'templates.mock.signIn' | translate }}
                    </button>
                  </div>
                </div>
              </div>
            }

            <!-- 8. System Health Monitor Template Preview -->
            @if (id === 'health-monitor') {
              <div class="ngxsmk-mock-health">
                <div class="ngxsmk-mock-health-top">
                  <ngxsmk-heading level="h4" class="mock-panel-title">{{
                    'templates.mock.systemStatusMonitor' | translate
                  }}</ngxsmk-heading>
                  <ngxsmk-badge variant="success">{{
                    'templates.mock.allSystemsOperational' | translate
                  }}</ngxsmk-badge>
                </div>

                <div class="ngxsmk-mock-health-stats">
                  <div class="health-mini-stat">
                    <span class="label">{{ 'templates.mock.cpuUsage' | translate }}</span>
                    <span class="value">14.2%</span>
                    <div class="health-bar"><div class="fill" style="width: 14%;"></div></div>
                  </div>
                  <div class="health-mini-stat">
                    <span class="label">{{ 'templates.mock.memoryRam' | translate }}</span>
                    <span class="value">64.8%</span>
                    <div class="health-bar">
                      <div class="fill warning" style="width: 64.8%;"></div>
                    </div>
                  </div>
                  <div class="health-mini-stat">
                    <span class="label">{{ 'templates.mock.apiLatency' | translate }}</span>
                    <span class="value">24ms</span>
                    <div class="health-bar">
                      <div class="fill success" style="width: 8%;"></div>
                    </div>
                  </div>
                </div>

                <div class="ngxsmk-mock-health-terminal">
                  <ngxsmk-terminal
                    title="{{ 'templates.mock.systemEventsLog' | translate }}"
                    [lines]="healthLogs"
                  />
                </div>
              </div>
            }

            <!-- 9. AI Agent Workbench Preview -->
            @if (id === 'ai-workbench') {
              <div class="ngxsmk-mock-workbench">
                <div class="ngxsmk-mock-workbench-header">
                  <div class="ngxsmk-mock-workbench-brand">
                    <span class="workbench-status-dot"></span>
                    <span class="workbench-title">AI Agent Workbench</span>
                  </div>
                  <ngxsmk-badge variant="info">3 Models Active</ngxsmk-badge>
                </div>
                <div class="ngxsmk-mock-workbench-body">
                  <div class="ngxsmk-mock-workbench-transfer">
                    <ngxsmk-transfer
                      [dataSource]="transferItems"
                      [titles]="['Available Models', 'Active Pipeline']"
                    />
                  </div>
                  <div class="ngxsmk-mock-workbench-dock-row">
                    <ngxsmk-dock [items]="dockItems" />
                  </div>
                </div>
              </div>
            }

            <!-- 10. Financial Trading Preview -->
            @if (id === 'fintech-trading') {
              <div class="ngxsmk-mock-fintech">
                <div class="ngxsmk-mock-fintech-header">
                  <ngxsmk-heading level="h4" class="mock-panel-title"
                    >Trading Portfolio</ngxsmk-heading
                  >
                  <ngxsmk-badge variant="success">Markets Open</ngxsmk-badge>
                </div>
                <div class="ngxsmk-mock-fintech-stats">
                  <ngxsmk-stat label="Portfolio Return" value="+24.8%" trend="up" />
                  <ngxsmk-stat label="Daily Volume" value="$2.4M" trend="up" />
                  <ngxsmk-stat label="Risk Score" value="Low" trend="down" />
                </div>
                <div class="ngxsmk-mock-fintech-heatmap">
                  <ngxsmk-heading
                    level="h4"
                    style="font-size: var(--ngxsmk-text-body-sm-size); font-weight: 600; margin-bottom: 0.5rem;"
                    >Activity Heatmap</ngxsmk-heading
                  >
                  <ngxsmk-calendar-heatmap [values]="heatmapValues" />
                </div>
              </div>
            }

            <!-- 11. Developer Portal Preview -->
            @if (id === 'dev-portal') {
              <div class="ngxsmk-mock-devportal">
                <div class="ngxsmk-mock-devportal-header">
                  <ngxsmk-heading level="h4" class="mock-panel-title"
                    >Developer Portal</ngxsmk-heading
                  >
                  <ngxsmk-badge>API v3.1</ngxsmk-badge>
                </div>
                <div class="ngxsmk-mock-devportal-body">
                  <div class="ngxsmk-mock-devportal-sig">
                    <span class="devportal-section-label">Contract Sign-off</span>
                    <ngxsmk-signature-pad [width]="380" [height]="100" />
                  </div>
                  <div class="ngxsmk-mock-devportal-log">
                    <span class="devportal-section-label">Audit Log Stream</span>
                    <ngxsmk-virtual-scroll
                      [items]="virtualItems"
                      [itemHeight]="32"
                      style="height: 130px;"
                    />
                  </div>
                </div>
              </div>
            }

            <!-- 12. Checkout Flow Preview -->
            @if (id === 'checkout-flow') {
              <div class="ngxsmk-mock-checkout">
                <div class="ngxsmk-mock-checkout-steps">
                  <span class="checkout-step done">Cart</span>
                  <span class="checkout-step-line"></span>
                  <span class="checkout-step done">Shipping</span>
                  <span class="checkout-step-line"></span>
                  <span class="checkout-step active">Payment</span>
                  <span class="checkout-step-line"></span>
                  <span class="checkout-step">Confirm</span>
                </div>
                <div class="ngxsmk-mock-checkout-card">
                  <ngxsmk-heading
                    level="h3"
                    style="font-size: var(--ngxsmk-text-title-sm-size); font-weight: 700; margin-bottom: 0.25rem;"
                    >2-Factor Security Verification</ngxsmk-heading
                  >
                  <ngxsmk-text
                    variant="body"
                    style="font-size: var(--ngxsmk-text-body-sm-size); color: var(--ngxsmk-color-on-surface-variant);"
                    >Enter the 4-digit code sent to your registered phone.</ngxsmk-text
                  >
                  <div class="checkout-pin-row">
                    <ngxsmk-pin-input [length]="4" />
                  </div>
                  <button ngxsmk-button style="width: 100%; margin-top: 0.25rem;">
                    Confirm Payment
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      </ng-template>

      <!-- Live Preview / Get Code Dialog Modal -->
      <ngxsmk-dialog
        [(open)]="dialogOpen"
        [title]="selectedTemplate()?.title ?? '' | translate"
        style="--ngxsmk-dialog-width: 72rem;"
      >
        @if (selectedTemplate()) {
          <ngxsmk-tabs [(value)]="activeTab" class="ngxsmk-custom-tabs">
            <ngxsmk-tab value="preview" label="{{ 'templates.livePreview' | translate }}">
              <div class="ngxsmk-template-preview-viewport">
                <ng-container
                  [ngTemplateOutlet]="miniPreview"
                  [ngTemplateOutletContext]="{ id: selectedTemplate()?.id }"
                />
              </div>
            </ngxsmk-tab>

            <ngxsmk-tab value="code" label="{{ 'templates.mock.sourceCode' | translate }}">
              <div class="ngxsmk-template-code-viewport">
                <div class="ngxsmk-code-copy-bar">
                  <button
                    ngxsmk-button
                    size="sm"
                    [ngxsmkCopyToClipboard]="selectedTemplate()?.code ?? ''"
                    (click)="onCodeCopied()"
                  >
                    {{
                      copied()
                        ? ('templates.mock.copied' | translate)
                        : ('templates.mock.copyCode' | translate)
                    }}
                  </button>
                </div>
                <ngxsmk-code-block language="html">{{
                  selectedTemplate()?.code
                }}</ngxsmk-code-block>
              </div>
            </ngxsmk-tab>
          </ngxsmk-tabs>
        }
      </ngxsmk-dialog>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: 100vh;
    }
    .ngxsmk-page-container {
      min-height: calc(100vh - 3.5rem);
    }
    .ngxsmk-page {
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--ngxsmk-space-12, 3rem) var(--ngxsmk-space-6, 1.5rem);
    }

    /* ============================================================
       The drawing register.
       Templates are blueprints; this page is the studio's sheet
       register. Mono "annotations" (sheet codes, spec cells, title
       blocks) carry the motif; everything else stays quiet and
       token-driven so all presets + dark mode work untouched.
       ============================================================ */

    /* === Register header: title + spec strip === */
    .tpl-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      gap: var(--ngxsmk-space-8, 2rem);
      padding-bottom: var(--ngxsmk-space-6, 1.5rem);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      margin-bottom: var(--ngxsmk-space-6, 1.5rem);
    }
    .tpl-header__lead {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      min-width: 0;
    }
    .tpl-header__eyebrow {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      letter-spacing: 0.08em;
      color: var(--ngxsmk-color-primary);
    }
    .tpl-header__title {
      font-family: 'Plus Jakarta Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: clamp(2.25rem, 5vw, 3rem);
      font-weight: 800;
      letter-spacing: -0.035em;
      line-height: 1.05;
      color: var(--ngxsmk-color-on-surface);
      margin: 0;
    }
    .tpl-header__sub {
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0;
      font-size: var(--ngxsmk-text-body-lg-size);
      max-width: 34rem;
      line-height: 1.6;
    }

    /* Spec strip: the page-level title block. Hairline-ruled mono
       cells (sheets / license / rev) — echoed on every card below. */
    .tpl-header__spec {
      display: flex;
      margin: 0;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
      flex-shrink: 0;
    }
    .tpl-header__spec-cell {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.75rem 1.25rem;
    }
    .tpl-header__spec-cell + .tpl-header__spec-cell {
      border-inline-start: 1px solid var(--ngxsmk-color-outline);
    }
    .tpl-header__spec-cell dt {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0;
    }
    .tpl-header__spec-cell dd {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-lg-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      margin: 0;
    }
    .tpl-header__spec-cell:first-child dd {
      color: var(--ngxsmk-color-primary);
    }

    /* === Register layout: index rail + sheet grid === */
    .tpl-layout {
      display: grid;
      grid-template-columns: 13rem minmax(0, 1fr);
      gap: var(--ngxsmk-space-8, 2rem);
      align-items: start;
    }

    /* Index of drawings */
    .tpl-index {
      position: sticky;
      top: 5rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .tpl-index__label {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      letter-spacing: 0.08em;
      color: var(--ngxsmk-color-primary);
    }
    .tpl-index__list {
      display: flex;
      flex-direction: column;
      border-inline-start: 1px solid var(--ngxsmk-color-outline);
    }
    .tpl-index__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.4375rem 0.75rem;
      margin-inline-start: -1px;
      border-inline-start: 2px solid transparent;
      text-decoration: none;
      min-width: 0;
      transition:
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        background var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .tpl-index__item:hover {
      border-inline-start-color: var(--ngxsmk-color-primary);
      background: var(--ngxsmk-color-surface-hover);
    }
    .tpl-index__item:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
      border-radius: var(--ngxsmk-radius-sm);
    }
    .tpl-index__code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
      flex-shrink: 0;
    }
    .tpl-index__item:hover .tpl-index__code {
      color: var(--ngxsmk-color-primary);
    }
    .tpl-index__dot {
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 1px;
      flex-shrink: 0;
    }
    .tpl-index__name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Category accents come from the semantic roles, so they follow
       every preset and both modes. */
    .tpl-index__dot[data-cat='Application'],
    .tpl-card__block[data-cat='Application'] .tpl-card__cat-swatch {
      background: var(--ngxsmk-color-info);
    }
    .tpl-index__dot[data-cat='Marketing'],
    .tpl-card__block[data-cat='Marketing'] .tpl-card__cat-swatch {
      background: var(--ngxsmk-color-warning);
    }
    .tpl-index__dot[data-cat='E-Commerce'],
    .tpl-card__block[data-cat='E-Commerce'] .tpl-card__cat-swatch {
      background: var(--ngxsmk-color-success);
    }
    .tpl-index__dot[data-cat='Authentication'],
    .tpl-card__block[data-cat='Authentication'] .tpl-card__cat-swatch {
      background: var(--ngxsmk-color-primary);
    }
    .tpl-index__dot[data-cat='DevOps'],
    .tpl-card__block[data-cat='DevOps'] .tpl-card__cat-swatch {
      background: var(--ngxsmk-color-error);
    }

    /* === Sheets === */
    .tpl-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: var(--ngxsmk-space-5, 1.25rem);
    }

    .tpl-card {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
      scroll-margin-top: 5rem;
      /* 'backwards' (not 'both') so the finished animation releases the
         transform and the hover lift can take over. */
      animation: tpl-sheet-in var(--ngxsmk-duration-slow, 300ms) var(--ngxsmk-ease-out) backwards;
      animation-delay: calc(var(--tpl-i, 0) * 45ms);
      transition:
        transform var(--ngxsmk-duration-normal, 220ms) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-normal, 220ms) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-normal, 220ms) var(--ngxsmk-ease-out);
    }
    .tpl-card:hover {
      transform: var(--ngxsmk-hover-lift, translateY(-1px));
      box-shadow: var(--ngxsmk-shadow-lg);
      border-color: var(--ngxsmk-color-outline-strong);
    }
    .tpl-card:hover .tpl-card__sheet {
      color: var(--ngxsmk-color-primary);
    }

    @keyframes tpl-sheet-in {
      from {
        opacity: 0;
        transform: translateY(12px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .tpl-card {
        animation: none;
      }
    }

    /* Gradient accent strip — unique color per template, runs across the top */
    .tpl-card__gradient-strip {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      z-index: 2;
      opacity: 0.85;
      transition: opacity var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .tpl-card:hover .tpl-card__gradient-strip {
      opacity: 1;
      height: 4px;
    }

    /* Live scaled preview area */
    .tpl-card__preview {
      position: relative;
      display: block;
      width: 100%;
      height: 340px;
      border: none;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      overflow: hidden;
      cursor: pointer;
    }
    .tpl-card__preview:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
    }
    /* The mock renders at ~1.67x then scales down to fit - a mini desktop preview */
    .tpl-card__frame {
      position: absolute;
      top: 0;
      left: 0;
      width: 166.667%;
      height: 166.667%;
      transform: scale(0.6);
      transform-origin: top left;
      pointer-events: none;
      padding: 16px;
      box-sizing: border-box;
    }
    .tpl-card__fade {
      position: absolute;
      inset: auto 0 0 0;
      height: 56px;
      background: linear-gradient(
        to top,
        var(--ngxsmk-color-surface-variant, #f4f4f5),
        transparent
      );
      pointer-events: none;
    }
    .tpl-card__hover {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface) 42%, transparent);
      opacity: 0;
      transition: opacity var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-out);
    }
    .tpl-card__preview:hover .tpl-card__hover,
    .tpl-card__preview:focus-visible .tpl-card__hover {
      opacity: 1;
    }
    .tpl-card__hover-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.9rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      box-shadow: var(--ngxsmk-shadow-md);
    }

    .tpl-card__body {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: var(--ngxsmk-space-5);
      flex: 1;
    }

    /* Sheet title block: NGX-01 · category · rev, ruled off from the
       name below — every sheet in the register carries one. */
    .tpl-card__block {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-4);
      padding-bottom: 0.5rem;
      margin-bottom: 0.25rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 500;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .tpl-card__sheet {
      color: var(--ngxsmk-color-on-surface);
      transition: color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    .tpl-card__cat {
      display: inline-flex;
      align-items: center;
      gap: 0.4375rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .tpl-card__cat-swatch {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 1px;
      flex-shrink: 0;
    }
    .tpl-card__rev {
      margin-inline-start: auto;
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: var(--ngxsmk-opacity-muted, 0.7);
    }

    .tpl-card__title {
      margin: 0;
      font-family: 'Plus Jakarta Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-title-md-size);
      font-weight: 700;
      letter-spacing: -0.015em;
      color: var(--ngxsmk-color-on-surface);
    }
    .tpl-card__desc {
      margin: 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.6;
      color: var(--ngxsmk-color-on-surface-variant);
      flex: 1;
    }
    .tpl-card__actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
    .tpl-card__actions .btn-icon {
      flex-shrink: 0;
      margin-right: 0.25rem;
    }

    /* === Responsive === */
    @media (max-width: 1024px) {
      .tpl-layout {
        grid-template-columns: 1fr;
      }
      .tpl-index {
        display: none;
      }
    }
    @media (max-width: 900px) {
      .tpl-grid {
        grid-template-columns: 1fr;
      }
      .tpl-header {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--ngxsmk-space-5, 1.25rem);
      }
    }

    .btn-icon {
      flex-shrink: 0;
    }

    /* Dialog Previews Style */
    .ngxsmk-template-preview-viewport {
      min-height: 600px;
      padding: var(--ngxsmk-space-6);
      background-color: var(--ngxsmk-color-surface-variant, #f4f4f5);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 20px 20px;
      border-radius: var(--ngxsmk-radius-xl);
      border: 1px solid var(--ngxsmk-color-outline);
      box-shadow: inset 0 1px 3px color-mix(in srgb, var(--ngxsmk-color-on-surface) 4%, transparent);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: stretch;
    }

    .ngxsmk-template-code-viewport {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3);
    }

    .ngxsmk-code-copy-bar {
      display: flex;
      justify-content: flex-end;
    }

    .ngxsmk-custom-tabs ::ng-deep .ngxsmk-tabs__list {
      margin-bottom: var(--ngxsmk-space-4);
    }

    /* Mock Browser Frame */
    .ngxsmk-mock-window {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      display: flex;
      flex-direction: column;
      box-shadow: var(--ngxsmk-shadow-lg);
      overflow: hidden;
    }
    .ngxsmk-mock-window-titlebar {
      height: 2.5rem;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      padding: 0 var(--ngxsmk-space-4);
      position: relative;
    }
    .ngxsmk-mock-window-dots {
      display: flex;
      gap: 0.375rem;
      align-items: center;
    }
    .ngxsmk-mock-window-dots .dot {
      width: 0.625rem;
      height: 0.625rem;
      border-radius: 50%;
      display: inline-block;
    }
    .ngxsmk-mock-window-dots .dot.red {
      background-color: #ef4444;
    }
    .ngxsmk-mock-window-dots .dot.yellow {
      background-color: #eab308;
    }
    .ngxsmk-mock-window-dots .dot.green {
      background-color: #22c55e;
    }

    .ngxsmk-mock-window-address-bar {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40%;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
      padding: 0.125rem 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }
    .lock-icon {
      flex-shrink: 0;
      opacity: 0.7;
    }
    .ngxsmk-mock-window-content {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: var(--ngxsmk-space-4);
      height: 500px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* Mock Layouts Styles */
    .ngxsmk-mock-dashboard {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }
    .ngxsmk-mock-header {
      height: 3rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      padding: 0 var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
    }
    .mock-panel-title {
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface);
      margin: 0;
    }
    .ngxsmk-mock-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .ngxsmk-mock-sidebar {
      width: 140px;
      border-right: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: var(--ngxsmk-space-3);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .ngxsmk-mock-side-item {
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
      padding: 0.375rem 0.75rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      text-align: left;
      width: 100%;
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out);
    }
    .ngxsmk-mock-side-item:hover:not(.active) {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface) 6%, transparent);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-mock-side-item.active {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
    }

    /* === Admin Console view panels === */
    .admin-bars {
      display: flex;
      flex-direction: column;
      gap: 0.7rem;
      padding-top: 0.25rem;
    }
    .admin-bar-row {
      display: grid;
      grid-template-columns: 72px 1fr 40px;
      align-items: center;
      gap: 0.6rem;
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .admin-bar-label {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .admin-bar-track {
      height: 8px;
      background: var(--ngxsmk-color-surface-variant);
      border-radius: 999px;
      overflow: hidden;
    }
    .admin-bar-fill {
      height: 100%;
      background: var(--ngxsmk-color-primary);
      border-radius: 999px;
    }
    .admin-bar-val {
      text-align: right;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }

    .admin-users-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .admin-user-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .admin-user-row {
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      align-items: center;
      gap: 0.75rem;
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      background: var(--ngxsmk-color-surface);
    }
    .admin-avatar {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
      color: #fff;
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
      flex-shrink: 0;
    }
    .admin-user-info {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .admin-user-name {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }
    .admin-user-email {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .admin-user-role {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .admin-settings {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 460px;
    }
    .admin-settings-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.25rem;
    }
    .ngxsmk-mock-content {
      flex: 1;
      padding: var(--ngxsmk-space-4);
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-4);
    }
    .ngxsmk-mock-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--ngxsmk-space-3);
    }
    .ngxsmk-mock-dashboard-grid {
      display: grid;
      grid-template-columns: 3fr 2fr;
      gap: var(--ngxsmk-space-4);
    }
    .ngxsmk-mock-section {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: var(--ngxsmk-space-4);
    }

    /* Mock Chat Styles */
    .ngxsmk-mock-chat {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ngxsmk-mock-chat-header {
      height: 3rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
    }
    .ngxsmk-mock-chat-window-wrapper {
      flex: 1;
      overflow: hidden;
    }
    .ngxsmk-mock-chat-composer {
      padding: var(--ngxsmk-space-3);
      border-top: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      gap: var(--ngxsmk-space-2);
      background: var(--ngxsmk-color-surface);
    }

    /* Mock Landing Styles */
    .ngxsmk-mock-landing {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      overflow-y: auto;
      padding: var(--ngxsmk-space-6);
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    .ngxsmk-mock-landing-nav {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      padding-bottom: 0.75rem;
    }
    .ngxsmk-mock-landing-hero {
      text-align: center;
      padding: 1.5rem 0;
    }
    .ngxsmk-mock-landing-pricing {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: var(--ngxsmk-space-4);
      max-width: 600px;
      margin: 0 auto;
      width: 100%;
    }
    .ngxsmk-mock-price-card {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: var(--ngxsmk-space-4);
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      background: var(--ngxsmk-color-surface);
    }
    .ngxsmk-mock-price-card.highlighted {
      border-color: var(--ngxsmk-color-primary);
      box-shadow: var(--ngxsmk-shadow-md);
    }
    .ngxsmk-mock-price-badge {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
      padding: 0.125rem 0.375rem;
      border-radius: var(--ngxsmk-radius-sm);
      text-transform: uppercase;
    }
    .ngxsmk-mock-price-val {
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-mock-price-features {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      color: var(--ngxsmk-color-on-surface-variant);
      flex-grow: 1;
    }

    /* Mock Kanban Styles */
    .ngxsmk-mock-kanban {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ngxsmk-mock-kanban-header {
      height: 3rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--ngxsmk-space-4);
    }
    .ngxsmk-mock-kanban-body {
      flex: 1;
      overflow-y: auto;
    }

    /* Mock Settings Styles */
    .ngxsmk-mock-settings {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ngxsmk-mock-settings-header {
      height: 3rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      padding: 0 var(--ngxsmk-space-4);
    }
    .ngxsmk-mock-settings-body {
      flex: 1;
      padding: var(--ngxsmk-space-4);
      overflow-y: auto;
    }

    /* Mock E-commerce Styles */
    .ngxsmk-mock-ecommerce {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      padding: var(--ngxsmk-space-5);
      overflow-y: auto;
      display: flex;
      align-items: center;
    }
    .ngxsmk-mock-ecommerce-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: var(--ngxsmk-space-6);
      width: 100%;
    }
    .ngxsmk-mock-ecommerce-gallery {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .gallery-primary-img {
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 260px;
      width: 100%;
    }
    .product-preview-img {
      max-height: 100%;
      max-width: 100%;
      object-fit: cover;
    }
    .ngxsmk-mock-ecommerce-info {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .product-ratings-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .stars-gold {
      color: #eab308;
      font-size: var(--ngxsmk-text-body-md-size);
    }
    .ratings-count {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .product-price-row {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-top: 0.25rem;
    }
    .price-current {
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface);
    }
    .price-old {
      font-size: var(--ngxsmk-text-body-md-size);
      text-decoration: line-through;
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: 0.7;
    }
    .product-spec-row {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      margin-top: 0.5rem;
    }
    .product-color-selector {
      display: flex;
      gap: 0.5rem;
    }
    .color-dot {
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      cursor: pointer;
      border: 2px solid transparent;
      outline: 1px solid var(--ngxsmk-color-outline);
    }
    .color-dot.active {
      outline-color: var(--ngxsmk-color-primary);
    }

    /* Mock Auth Styles */
    .ngxsmk-mock-auth {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ngxsmk-mock-auth-card {
      background: var(--ngxsmk-color-surface, #ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      padding: var(--ngxsmk-space-5);
      width: 100%;
      max-width: 340px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: var(--ngxsmk-shadow-md);
    }
    .ngxsmk-mock-auth-header {
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .ngxsmk-mock-auth-socials {
      display: flex;
      gap: 0.5rem;
    }
    .auth-divider-line {
      display: flex;
      align-items: center;
      text-align: center;
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: 0.7;
    }
    .auth-divider-line::before,
    .auth-divider-line::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }
    .auth-divider-line:not(:empty)::before {
      margin-right: 0.5rem;
    }
    .auth-divider-line:not(:empty)::after {
      margin-left: 0.5rem;
    }
    .ngxsmk-mock-auth-form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    /* Mock DevOps Health Styles */
    .ngxsmk-mock-health {
      background: var(--ngxsmk-color-neutral-900);
      color: var(--ngxsmk-color-neutral-100);
      border: 1px solid var(--ngxsmk-color-neutral-800);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      padding: var(--ngxsmk-space-4);
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-4);
      overflow-y: auto;
    }
    .ngxsmk-mock-health-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .ngxsmk-mock-health-top .mock-panel-title {
      color: #f4f4f5;
    }
    .ngxsmk-mock-health-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--ngxsmk-space-3);
    }
    .health-mini-stat {
      background: var(--ngxsmk-color-neutral-950);
      border: 1px solid var(--ngxsmk-color-neutral-850, #262626);
      border-radius: var(--ngxsmk-radius-md);
      padding: var(--ngxsmk-space-3);
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .health-mini-stat .label {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: #a3a3a3;
      font-weight: 500;
    }
    .health-mini-stat .value {
      font-size: var(--ngxsmk-text-title-md-size);
      font-weight: 700;
      color: #f5f5f5;
    }
    .health-bar {
      width: 100%;
      height: 4px;
      background: #404040;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 0.25rem;
    }
    .health-bar .fill {
      height: 100%;
      background: var(--ngxsmk-color-primary);
    }
    .health-bar .fill.warning {
      background: #eab308;
    }
    .health-bar .fill.success {
      background: #22c55e;
    }
    .ngxsmk-mock-health-terminal {
      flex: 1;
      overflow: hidden;
    }

    /* === New Template Layouts === */

    /* AI Agent Workbench */
    .ngxsmk-mock-workbench {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ngxsmk-mock-workbench-header {
      height: 3rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
    }
    .ngxsmk-mock-workbench-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .workbench-status-dot {
      width: 0.5rem;
      height: 0.5rem;
      border-radius: 50%;
      background: var(--ngxsmk-color-success);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--ngxsmk-color-success) 25%, transparent);
    }
    .workbench-title {
      font-size: var(--ngxsmk-text-body-md-size);
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-mock-workbench-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-4);
      overflow-y: auto;
    }
    .ngxsmk-mock-workbench-transfer {
      flex: 1;
    }
    .ngxsmk-mock-workbench-dock-row {
      display: flex;
      justify-content: center;
      padding-bottom: var(--ngxsmk-space-2);
    }

    /* Financial Trading Dashboard */
    .ngxsmk-mock-fintech {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ngxsmk-mock-fintech-header {
      height: 3rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
    }
    .ngxsmk-mock-fintech-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-4) 0;
    }
    .ngxsmk-mock-fintech-heatmap {
      padding: var(--ngxsmk-space-4);
      flex: 1;
      overflow: hidden;
    }

    /* Developer Portal */
    .ngxsmk-mock-devportal {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .ngxsmk-mock-devportal-header {
      height: 3rem;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 var(--ngxsmk-space-4);
      background: var(--ngxsmk-color-surface);
    }
    .ngxsmk-mock-devportal-body {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-4);
      overflow-y: auto;
    }
    .ngxsmk-mock-devportal-sig,
    .ngxsmk-mock-devportal-log {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .devportal-section-label {
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: var(--ngxsmk-font-mono);
    }

    /* Checkout Flow */
    .ngxsmk-mock-checkout {
      background: var(--ngxsmk-color-surface-variant);
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: var(--ngxsmk-space-4);
      padding: var(--ngxsmk-space-5);
    }
    .ngxsmk-mock-checkout-steps {
      display: flex;
      align-items: center;
      gap: 0;
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 600;
    }
    .checkout-step {
      padding: 0.25rem 0.625rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      color: var(--ngxsmk-color-on-surface-variant);
      white-space: nowrap;
    }
    .checkout-step.active {
      background: var(--ngxsmk-color-primary);
      border-color: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
    }
    .checkout-step.done {
      background: var(--ngxsmk-color-success-container);
      border-color: var(--ngxsmk-color-success);
      color: var(--ngxsmk-color-on-success-container);
    }
    .checkout-step-line {
      height: 1px;
      width: 1.5rem;
      background: var(--ngxsmk-color-outline);
      flex-shrink: 0;
    }
    .ngxsmk-mock-checkout-card {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      padding: var(--ngxsmk-space-5);
      width: 100%;
      max-width: 360px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      box-shadow: var(--ngxsmk-shadow-md);
    }
    .checkout-pin-row {
      display: flex;
      justify-content: center;
      margin: 0.5rem 0;
    }

    /* === Toolbar: register filter tabs + search === */
    .ngxsmk-templates-toolbar {
      margin-bottom: var(--ngxsmk-space-8, 2rem);
    }
    .ngxsmk-templates-toolbar-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ngxsmk-space-4, 1rem);
      flex-wrap: wrap;
    }
    .ngxsmk-templates-categories {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }
    /* Filter tabs read like register stamps: quiet rectangles, mono
       counts; the active one is inked. Primary stays reserved for
       actions and focus. */
    .ngxsmk-category-chip {
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      padding: 0.375rem 0.75rem;
      border-radius: var(--ngxsmk-radius-md);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      white-space: nowrap;
      transition:
        background var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out);
    }
    .ngxsmk-category-chip:hover {
      border-color: var(--ngxsmk-color-outline-strong);
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-category-chip:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }
    .ngxsmk-category-chip.active {
      background: var(--ngxsmk-color-on-surface);
      border-color: var(--ngxsmk-color-on-surface);
      color: var(--ngxsmk-color-surface);
    }
    .chip-count {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-xs-size);
      opacity: var(--ngxsmk-opacity-muted, 0.7);
      margin-inline-start: 0.25rem;
    }
    .ngxsmk-category-chip.active .chip-count {
      opacity: 0.85;
    }
    .ngxsmk-search-wrapper {
      display: flex;
      align-items: center;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      padding: 0.375rem 0.75rem;
      gap: 0.5rem;
      min-width: 220px;
      transition:
        border-color var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-fast, 150ms) var(--ngxsmk-ease-out);
    }
    .ngxsmk-search-wrapper:focus-within {
      border-color: var(--ngxsmk-color-ring);
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }
    .search-icon {
      flex-shrink: 0;
      opacity: var(--ngxsmk-opacity-faint, 0.4);
    }
    .ngxsmk-search-input {
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface);
      outline: none;
      width: 100%;
    }
    .ngxsmk-search-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .search-clear {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.125rem;
      opacity: var(--ngxsmk-opacity-faint, 0.4);
      color: var(--ngxsmk-color-on-surface-variant);
      display: flex;
    }
    .search-clear:hover {
      opacity: 0.8;
    }
    .ngxsmk-templates-toolbar-sub {
      margin-top: 0.75rem;
    }
    .ngxsmk-result-count {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .count-num {
      font-family: var(--ngxsmk-font-mono);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface);
    }

    /* === Empty state: a blank sheet === */
    .ngxsmk-templates-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 4rem 2rem;
      text-align: center;
      border: 1px dashed var(--ngxsmk-color-outline-strong);
      border-radius: var(--ngxsmk-radius-xl);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
      margin-bottom: var(--ngxsmk-space-8, 2rem);
    }
  `,
})
export class TemplatesPage {
  protected readonly appVersion = APP_VERSION;

  /** Sheet numbers in the register read as NGX-01 … NGX-99. */
  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }

  protected readonly categories: TemplateCategory[] = [
    'All',
    'Application',
    'Marketing',
    'E-Commerce',
    'Authentication',
    'DevOps',
  ];
  protected readonly activeCategory = signal<TemplateCategory>('All');
  protected readonly searchQuery = signal('');

  protected readonly filteredTemplates = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.activeCategory();
    return this.templatesList.filter((tpl) => {
      if (cat !== 'All' && tpl.category !== cat) return false;
      if (
        query &&
        !tpl.title.toLowerCase().includes(query) &&
        !tpl.description.toLowerCase().includes(query)
      )
        return false;
      return true;
    });
  });

  protected readonly dialogOpen = signal(false);
  protected readonly selectedTemplate = signal<TemplateItem | null>(null);
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal(false);

  // --- Admin Console (dashboard template) multi-page navigation ---
  protected readonly adminNav = [
    { id: 'dashboard' as const, label: 'templates.nav.dashboard' },
    { id: 'analytics' as const, label: 'templates.nav.analytics' },
    { id: 'users' as const, label: 'templates.nav.users' },
    { id: 'settings' as const, label: 'templates.nav.settings' },
  ];
  protected readonly adminView = signal<'dashboard' | 'analytics' | 'users' | 'settings'>(
    'dashboard',
  );

  protected readonly analyticsData = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 64 },
    { label: 'Jun', value: 88 },
  ];
  protected readonly trafficSources = [
    { label: 'templates.traffic.organic', value: 48 },
    { label: 'templates.traffic.direct', value: 27 },
    { label: 'templates.traffic.referral', value: 15 },
    { label: 'templates.traffic.social', value: 10 },
  ];
  protected readonly usersList = [
    {
      name: 'Ada Lovelace',
      email: 'ada@ngxsmk.dev',
      role: 'templates.role.owner',
      status: 'Active',
      initials: 'AL',
      color: '#7c3aed',
    },
    {
      name: 'Alan Turing',
      email: 'alan@ngxsmk.dev',
      role: 'templates.role.admin',
      status: 'Active',
      initials: 'AT',
      color: '#0369a1',
    },
    {
      name: 'Grace Hopper',
      email: 'grace@ngxsmk.dev',
      role: 'templates.role.editor',
      status: 'Active',
      initials: 'GH',
      color: '#15803d',
    },
    {
      name: 'Linus Torvalds',
      email: 'linus@ngxsmk.dev',
      role: 'templates.role.viewer',
      status: 'Invited',
      initials: 'LT',
      color: '#b45309',
    },
  ];

  protected categoryCount(cat: TemplateCategory): number {
    if (cat === 'All') return this.templatesList.length;
    return this.templatesList.filter((t) => t.category === cat).length;
  }

  protected readonly dockItems = [
    { id: '1', label: 'Chat', icon: '💬' },
    { id: '2', label: 'Code', icon: '⚡' },
    { id: '3', label: 'Settings', icon: '⚙️' },
  ];

  protected readonly transferItems = [
    { key: '1', title: 'GPT-4o', description: 'Multimodal Flagship' },
    { key: '2', title: 'Gemini 1.5 Pro', description: '1M Context Window' },
    { key: '3', title: 'Claude 3.5 Sonnet', description: 'High Reasoning' },
  ];

  protected readonly heatmapValues = [
    { date: '2026-07-22', count: 8 },
    { date: '2026-07-21', count: 4 },
    { date: '2026-07-20', count: 9 },
  ];

  protected readonly virtualItems = Array.from({ length: 500 }, (_, i) => ({
    id: i + 1,
    name: 'Audit Log Event #' + (i + 1),
  }));

  protected readonly tableColumns = [
    { key: 'user', label: 'User Name' },
    { key: 'status', label: 'Billing Plan' },
    { key: 'registered', label: 'Active Sessions' },
  ];

  protected readonly tableRows = [
    { user: 'Ada Lovelace', status: 'Enterprise Pro', registered: '4 current' },
    { user: 'Alan Turing', status: 'Professional Plan', registered: '1 current' },
    { user: 'Grace Hopper', status: 'Developer Free', registered: '0 sessions' },
  ];

  protected readonly chartData = [
    { label: 'Mon', value: 34 },
    { label: 'Tue', value: 45 },
    { label: 'Wed', value: 23 },
    { label: 'Thu', value: 56 },
    { label: 'Fri', value: 89 },
  ];

  protected readonly chatMessages = [
    {
      id: '1',
      role: 'system' as const,
      content: 'Assistant initialized. Powered by Gemini 3.5.',
      timestamp: new Date(),
    },
    {
      id: '2',
      role: 'user' as const,
      content: 'How do I implement custom CSS variables in the theme engine?',
      timestamp: new Date(),
    },
    {
      id: '3',
      role: 'assistant' as const,
      content:
        'You can define custom token overrides like: --ngxsmk-button-bg: var(--ngxsmk-color-emerald);',
      timestamp: new Date(),
    },
  ];

  protected readonly kanbanColumns = signal<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'k1', title: 'Design onboarding flow', description: 'Wireframe the 3-step signup.' },
        { id: 'k2', title: 'Audit color tokens' },
      ],
    },
    {
      id: 'progress',
      title: 'In Progress',
      items: [{ id: 'k3', title: 'Build data table', description: 'Sorting + pagination.' }],
    },
    {
      id: 'review',
      title: 'In Review',
      items: [{ id: 'k4', title: 'Refactor auth guard' }],
    },
    {
      id: 'done',
      title: 'Done',
      items: [{ id: 'k5', title: 'Ship theme engine', description: 'Released in v1.2.' }],
    },
  ]);

  protected readonly themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Night Theme' },
    { value: 'system', label: 'Follow System Default' },
  ];

  protected readonly healthLogs = [
    { text: 'systemctl start nginx', isInput: true },
    { text: 'nginx.service - high-performance web server started.' },
    { text: 'docker-compose up -d --build postgres', isInput: true },
    { text: 'database container up: listening on port 5432' },
    { text: 'api-service connection established: DB response 1ms' },
  ];

  protected readonly templatesList: TemplateItem[] = [
    {
      id: 'dashboard',
      title: 'templates.list.dashboard.title',
      category: 'Application',
      description: 'templates.list.dashboard.desc',
      gradient: 'linear-gradient(135deg, #1e1b4b, #312e81, #3730a3)',
      code: `<!-- app-dashboard.html -->
<ngxsmk-app-shell>
  <ngxsmk-side-nav>
    <ngxsmk-side-nav-section>
      <ngxsmk-side-nav-heading>Workspace</ngxsmk-side-nav-heading>
      <ngxsmk-side-nav-item active="true">Dashboard</ngxsmk-side-nav-item>
      <ngxsmk-side-nav-item>Analytics</ngxsmk-side-nav-item>
      <ngxsmk-side-nav-item badge="3">Customers</ngxsmk-side-nav-item>
    </ngxsmk-side-nav-section>
    <ngxsmk-side-nav-collapse-button />
  </ngxsmk-side-nav>

  <div class="main-content">
    <div class="stats-grid">
      <ngxsmk-stat label="Active Users" value="1,245" trend="up" />
      <ngxsmk-stat label="Monthly Revenue" value="$45,231" trend="up" />
      <ngxsmk-stat label="Server Load" value="23.4%" trend="down" />
    </div>

    <div class="dashboard-grid">
      <ngxsmk-table [columns]="tableColumns" [rows]="tableRows" [striped]="true" />
      <ngxsmk-chart-bar [data]="chartData" [width]="240" [height]="120" />
    </div>
  </div>
</ngxsmk-app-shell>`,
    },
    {
      id: 'ai-chat',
      title: 'templates.list.aichat.title',
      category: 'Application',
      description: 'templates.list.aichat.desc',
      gradient: 'linear-gradient(135deg, #064e3b, #065f46, #047857)',
      code: `<!-- ai-chat.html -->
<ngxsmk-chat-layout>
  <ngxsmk-chat-window [messages]="chatMessages" />
  
  <ngxsmk-chat-composer-drawer>
    <input ngxsmkInput placeholder="Ask anything..." style="flex: 1;" />
    <button ngxsmk-button>Send</button>
  </ngxsmk-chat-composer-drawer>
</ngxsmk-chat-layout>`,
    },
    {
      id: 'landing-page',
      title: 'templates.list.landing.title',
      category: 'Marketing',
      description: 'templates.list.landing.desc',
      gradient: 'linear-gradient(135deg, #701a75, #86198f, #a21caf)',
      code: `<!-- landing-page.html -->
<div class="landing-nav">
  <div style="font-weight: 700; font-family: 'Outfit';">ngxsmk SaaS</div>
  <div style="display: flex; gap: 1rem;">
    <span>Features</span>
    <span>Pricing</span>
    <span>Docs</span>
  </div>
  <button ngxsmk-button size="sm">Get Started</button>
</div>

<div class="landing-hero">
  <ngxsmk-heading level="h1">Innovate Faster</ngxsmk-heading>
  <ngxsmk-text variant="body" style="font-size: var(--ngxsmk-text-body-lg-size); opacity: 0.8; max-width: 480px; margin: 0.5rem auto 1.5rem;">
    Build state-of-the-art enterprise web applications in minutes using NGXSMK premium signals-based UI Kit.
  </ngxsmk-text>
  <div style="display: flex; gap: 0.75rem; justify-content: center;">
    <button ngxsmk-button>Start Free Trial</button>
    <button ngxsmk-button variant="outline">Learn More</button>
  </div>
</div>

<div class="landing-pricing">
  <ngxsmk-card class="price-card">
    <ngxsmk-heading level="h4">Starter</ngxsmk-heading>
    <div class="price-val">$0/mo</div>
    <ngxsmk-divider />
    <ul class="price-features">
      <li>Basic layout UI blocks</li>
      <li>Single developer license</li>
      <li>Community support</li>
    </ul>
    <button ngxsmk-button variant="outline" style="width: 100%;">Sign Up</button>
  </ngxsmk-card>

  <ngxsmk-card class="price-card highlighted">
    <div class="price-badge">Popular</div>
    <ngxsmk-heading level="h4">Professional</ngxsmk-heading>
    <div class="price-val">$49/mo</div>
    <ngxsmk-divider />
    <ul class="price-features">
      <li>All premium & dashboard blocks</li>
      <li>Unlimited dev licenses</li>
      <li>Priority Slack support</li>
    </ul>
    <button ngxsmk-button style="width: 100%;">Get Pro</button>
  </ngxsmk-card>
</div>`,
    },
    {
      id: 'kanban',
      title: 'templates.list.kanban.title',
      category: 'Application',
      description: 'templates.list.kanban.desc',
      gradient: 'linear-gradient(135deg, #1e3a5f, #1e4d8c, #2563eb)',
      code: `<!-- kanban-board.html -->
<ngxsmk-card>
  <div ngxsmkCardHeader>
    <ngxsmk-heading level="h3">Sprint 24 Board</ngxsmk-heading>
  </div>
  <div ngxsmkCardContent>
    <ngxsmk-kanban-board [columns]="columns" />
  </div>
</ngxsmk-card>`,
    },
    {
      id: 'settings',
      title: 'templates.list.settings.title',
      category: 'Application',
      description: 'templates.list.settings.desc',
      gradient: 'linear-gradient(135deg, #292524, #44403c, #57534e)',
      code: `<!-- settings.html -->
<div class="settings-container">
  <ngxsmk-tabs value="profile">
    <ngxsmk-tab value="profile" label="Profile">
      <div style="display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; max-width: 480px;">
        <ngxsmk-form-field label="Display Name" hint="How you appear to others.">
          <input ngxsmkInput placeholder="Jane Doe" />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Workspace Subdomain">
          <input ngxsmkInput placeholder="my-org" />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Interface Theme">
          <ngxsmk-select [options]="themeOptions" value="system" />
        </ngxsmk-form-field>
      </div>
    </ngxsmk-tab>
    <ngxsmk-tab value="notifications" label="Notifications">
      <div style="display: flex; flex-direction: column; gap: 1.25rem; padding-top: 1rem;">
        <ngxsmk-form-field label="Email Summaries" hint="Receive a summary of updates every morning.">
          <ngxsmk-switch [checked]="true" />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Desktop Push Notifications" hint="Notify immediately on task assignment.">
          <ngxsmk-switch [checked]="false" />
        </ngxsmk-form-field>
      </div>
    </ngxsmk-tab>
  </ngxsmk-tabs>
</div>`,
    },
    {
      id: 'ecommerce-detail',
      title: 'templates.list.ecommerce.title',
      category: 'E-Commerce',
      description: 'templates.list.ecommerce.desc',
      gradient: 'linear-gradient(135deg, #7c2d12, #9a3412, #c2410c)',
      code: `<!-- product-detail.html -->
<div class="product-grid">
  <div class="product-gallery">
    <img src="product.jpg" alt="Preview Image" />
  </div>
  
  <div class="product-info">
    <ngxsmk-badge variant="info">Free Shipping</ngxsmk-badge>
    <ngxsmk-heading level="h2">AeroSound Pro Headphones</ngxsmk-heading>
    
    <div class="ratings">
      <span>★★★★★</span>
      <span>(124 reviews)</span>
    </div>

    <div class="prices">
      <span class="price-current">$199.00</span>
      <span class="price-old">$249.00</span>
    </div>
    
    <ngxsmk-divider />
    
    <ngxsmk-text variant="body">Active noise-cancelling headphones featuring 40h battery.</ngxsmk-text>
    
    <div class="spec-row">
      <span>Color</span>
      <div class="colors">
        <span class="color-dot active" style="background-color: #09090b;"></span>
        <span class="color-dot" style="background-color: #7c3aed;"></span>
      </div>
    </div>
    
    <div class="actions">
      <button ngxsmk-button>Add to Cart</button>
      <button ngxsmk-button variant="outline">Buy Now</button>
    </div>
  </div>
</div>`,
    },
    {
      id: 'auth-cards',
      title: 'templates.list.auth.title',
      category: 'Authentication',
      description: 'templates.list.auth.desc',
      gradient: 'linear-gradient(135deg, #3b0764, #581c87, #6b21a8)',
      code: `<!-- auth-card.html -->
<ngxsmk-card class="auth-card">
  <ngxsmk-heading level="h3">Sign in to account</ngxsmk-heading>
  <ngxsmk-text variant="body">Enter credentials to access workspace</ngxsmk-text>
  
  <div class="socials">
    <button ngxsmk-button variant="outline">Google</button>
    <button ngxsmk-button variant="outline">GitHub</button>
  </div>
  
  <div class="divider">or continue with email</div>

  <ngxsmk-form-layout>
    <ngxsmk-form-field label="Email Address">
      <input ngxsmkInput type="email" placeholder="name@example.com" />
    </ngxsmk-form-field>
    <ngxsmk-form-field label="Password">
      <input ngxsmkInput type="password" placeholder="••••••••" />
    </ngxsmk-form-field>
    
    <div class="options">
      <ngxsmk-switch [checked]="true">Keep me signed in</ngxsmk-switch>
      <a href="#">Forgot?</a>
    </div>

    <button ngxsmk-button style="width: 100%;">Sign In</button>
  </ngxsmk-form-layout>
</ngxsmk-card>`,
    },
    {
      id: 'health-monitor',
      title: 'templates.list.health.title',
      category: 'DevOps',
      description: 'templates.list.health.desc',
      gradient: 'linear-gradient(135deg, #0f172a, #1e293b, #334155)',
      code: `<!-- health-monitor.html -->
<div class="health-header">
  <ngxsmk-heading level="h4">System Status Monitor</ngxsmk-heading>
  <ngxsmk-badge variant="success">All Systems Operational</ngxsmk-badge>
</div>

<div class="health-gauges">
  <ngxsmk-stat label="CPU Usage" value="14.2%" trend="up" />
  <ngxsmk-stat label="Memory" value="64.8%" trend="flat" />
  <ngxsmk-stat label="API Latency" value="24ms" trend="down" />
</div>

<ngxsmk-terminal title="System Events Log" [lines]="logs" />`,
    },
    {
      id: 'ai-workbench',
      title: 'templates.list.aiworkbench.title',
      category: 'Application',
      description: 'templates.list.aiworkbench.desc',
      gradient: 'linear-gradient(135deg, #0284c7, #0369a1, #075985)',
      code: `<!-- ai-workbench.html -->
<div class="ai-workbench">
  <ngxsmk-heading level="h3">AI Agent Workbench</ngxsmk-heading>
  <ngxsmk-dock [items]="dockItems" />
  <ngxsmk-transfer [dataSource]="transferItems" [titles]="['Available Models', 'Active Pipeline']" />
</div>`,
    },
    {
      id: 'fintech-trading',
      title: 'templates.list.fintech.title',
      category: 'Application',
      description: 'templates.list.fintech.desc',
      gradient: 'linear-gradient(135deg, #059669, #047857, #065f46)',
      code: `<!-- fintech-trading.html -->
<div class="trading-dashboard">
  <ngxsmk-stat label="Portfolio Return" value="+24.8%" trend="up" />
  <ngxsmk-calendar-heatmap [values]="heatmapValues" />
</div>`,
    },
    {
      id: 'dev-portal',
      title: 'templates.list.devportal.title',
      category: 'DevOps',
      description: 'templates.list.devportal.desc',
      gradient: 'linear-gradient(135deg, #4f46e5, #4338ca, #3730a3)',
      code: `<!-- dev-portal.html -->
<div class="dev-portal">
  <ngxsmk-signature-pad [width]="380" [height]="120" />
  <ngxsmk-virtual-scroll [items]="virtualItems" [itemHeight]="36" />
</div>`,
    },
    {
      id: 'checkout-flow',
      title: 'templates.list.checkout.title',
      category: 'E-Commerce',
      description: 'templates.list.checkout.desc',
      gradient: 'linear-gradient(135deg, #d97706, #b45309, #92400e)',
      code: `<!-- checkout-flow.html -->
<div class="checkout-card">
  <ngxsmk-heading level="h3">2-Factor Security Verification</ngxsmk-heading>
  <ngxsmk-pin-input [length]="4" />
  <button ngxsmk-button style="width: 100%;">Confirm Payment</button>
</div>`,
    },
  ];

  protected openPreview(tpl: TemplateItem): void {
    this.selectedTemplate.set(tpl);
    this.activeTab.set('preview');
    this.adminView.set('dashboard');
    this.dialogOpen.set(true);
  }

  protected openCode(tpl: TemplateItem): void {
    this.selectedTemplate.set(tpl);
    this.activeTab.set('code');
    this.dialogOpen.set(true);
  }

  protected onCodeCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }
}
