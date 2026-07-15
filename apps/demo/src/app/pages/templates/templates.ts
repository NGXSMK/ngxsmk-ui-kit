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
import { NgxsmkInput } from '@ngxsmk/core/input';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkTable } from '@ngxsmk/core/table';
import { NgxsmkSelect } from '@ngxsmk/core/select';
import { NgxsmkBarChart } from '@ngxsmk/core/chart-bar';
import { NgxsmkTerminal } from '@ngxsmk/core/terminal';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { Component, signal, computed } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppNav } from '../../nav/nav';

type TemplateCategory = 'All' | 'Application' | 'Marketing' | 'E-Commerce' | 'Authentication' | 'DevOps';

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
    NgxsmkInput,
    NgxsmkSwitch,
    NgxsmkTable,
    NgxsmkSelect,
    NgxsmkBarChart,
    NgxsmkTerminal,
    NgTemplateOutlet,
    FormsModule,
    AppNav
  ],
  template: `
    <app-nav />
    <div class="ngxsmk-page-container">
      <div class="ngxsmk-page">
        <header class="tpl-header">
          <ngxsmk-heading level="h1" class="tpl-header__title">Templates</ngxsmk-heading>
          <ngxsmk-text variant="body" class="tpl-header__sub">Ready-to-use page templates to kickstart your project.</ngxsmk-text>
        </header>

        <div class="ngxsmk-templates-toolbar">
          <div class="ngxsmk-templates-toolbar-row">
            <div class="ngxsmk-templates-categories">
              @for (cat of categories; track cat) {
                <button class="ngxsmk-category-chip" [class.active]="activeCategory() === cat" (click)="activeCategory.set(cat)">
                  {{ cat }}@if (cat !== 'All') { <span class="chip-count">({{ categoryCount(cat) }})</span> }
                </button>
              }
            </div>
            <div class="ngxsmk-search-wrapper">
              <svg class="search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input class="ngxsmk-search-input" type="text" placeholder="Search templates..." [ngModel]="searchQuery()" (ngModelChange)="searchQuery.set($event)" />
              @if (searchQuery()) {
                <button class="search-clear" (click)="searchQuery.set('')">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              }
            </div>
          </div>
          <div class="ngxsmk-templates-toolbar-sub">
            <ngxsmk-text variant="caption" class="ngxsmk-result-count">
              {{ activeCategory() === 'All' ? 'All' : activeCategory() }}
              templates <span class="count-num">({{ filteredTemplates().length }})</span>
            </ngxsmk-text>
          </div>
        </div>

        @if (filteredTemplates().length === 0) {
          <div class="ngxsmk-templates-empty">
            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" style="opacity: 0.3;"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/></svg>
            <ngxsmk-text variant="body">No templates match your search. Try a different term.</ngxsmk-text>
          </div>
        }

        <div class="tpl-grid">
          @for (tpl of filteredTemplates(); track tpl.id) {
            <article class="tpl-card">
              <div
                class="tpl-card__preview"
                role="button"
                tabindex="0"
                [attr.aria-label]="'Preview ' + tpl.title"
                (click)="openPreview(tpl)"
                (keydown.enter)="openPreview(tpl)"
              >
                <div class="tpl-card__frame" aria-hidden="true">
                  <ng-container [ngTemplateOutlet]="miniPreview" [ngTemplateOutletContext]="{ id: tpl.id }" />
                </div>
                <div class="tpl-card__fade" aria-hidden="true"></div>
                <div class="tpl-card__hover">
                  <span class="tpl-card__hover-pill">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Live Preview
                  </span>
                </div>
              </div>
              <div class="tpl-card__body">
                <span class="tpl-cat" [attr.data-cat]="tpl.category">{{ tpl.category }}</span>
                <ngxsmk-heading level="h3" class="tpl-card__title">{{ tpl.title }}</ngxsmk-heading>
                <ngxsmk-text variant="body" class="tpl-card__desc">{{ tpl.description }}</ngxsmk-text>
                <div class="tpl-card__actions">
                  <button ngxsmk-button size="sm" variant="outline" (click)="openPreview(tpl)">
                    <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    Preview
                  </button>
                  <button ngxsmk-button size="sm" variant="ghost" (click)="openCode(tpl)">
                    <svg class="btn-icon" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    Get Code
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
            <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" class="lock-icon"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span>https://ngxsmk.design/templates/{{ id }}</span>
          </div>
        </div>

        <div class="ngxsmk-mock-window-content">
                  
                  <!-- 1. Admin Dashboard Template Preview -->
                  @if (id === 'dashboard') {
                    <div class="ngxsmk-mock-dashboard">
                      <div class="ngxsmk-mock-header">
                        <ngxsmk-heading level="h4" class="mock-panel-title">Admin Console</ngxsmk-heading>
                        <div style="flex-grow:1"></div>
                        <ngxsmk-badge variant="info">v1.2.0</ngxsmk-badge>
                        <ngxsmk-text variant="body" style="margin-left: 1rem; font-weight: 500; font-size: 0.8125rem; color: var(--ngxsmk-color-on-surface);">Sachin Dilshan</ngxsmk-text>
                      </div>
                      
                      <div class="ngxsmk-mock-body">
                        <div class="ngxsmk-mock-sidebar">
                          @for (item of adminNav; track item.id) {
                            <button type="button" class="ngxsmk-mock-side-item" [class.active]="adminView() === item.id" (click)="adminView.set(item.id)">
                              {{ item.label }}
                            </button>
                          }
                        </div>

                        <div class="ngxsmk-mock-content">
                          @switch (adminView()) {
                            @case ('dashboard') {
                              <div class="ngxsmk-mock-stats">
                                <ngxsmk-stat label="Active Users" value="1,245" trend="up" />
                                <ngxsmk-stat label="Monthly Revenue" value="$45,231" trend="up" />
                                <ngxsmk-stat label="Server Load" value="23.4%" trend="down" />
                              </div>
                              <div class="ngxsmk-mock-dashboard-grid">
                                <div class="ngxsmk-mock-section table-section">
                                  <ngxsmk-heading level="h4" style="margin-bottom: 0.75rem; font-size: 0.9375rem; font-weight: 600;">Recent Registrations</ngxsmk-heading>
                                  <ngxsmk-table [columns]="tableColumns" [rows]="tableRows" [striped]="true" />
                                </div>
                                <div class="ngxsmk-mock-section chart-section">
                                  <ngxsmk-heading level="h4" style="margin-bottom: 0.75rem; font-size: 0.9375rem; font-weight: 600;">Weekly Operations</ngxsmk-heading>
                                  <div style="display: flex; justify-content: center; align-items: center; height: 160px;">
                                    <ngxsmk-chart-bar [data]="chartData" [width]="240" [height]="120" />
                                  </div>
                                </div>
                              </div>
                            }
                            @case ('analytics') {
                              <div class="ngxsmk-mock-stats">
                                <ngxsmk-stat label="Page Views" value="82.4k" trend="up" />
                                <ngxsmk-stat label="Bounce Rate" value="38.2%" trend="down" />
                                <ngxsmk-stat label="Avg. Session" value="4m 12s" trend="up" />
                              </div>
                              <div class="ngxsmk-mock-dashboard-grid">
                                <div class="ngxsmk-mock-section">
                                  <ngxsmk-heading level="h4" style="margin-bottom: 0.75rem; font-size: 0.9375rem; font-weight: 600;">Traffic Overview</ngxsmk-heading>
                                  <div style="display: flex; justify-content: center; align-items: center; height: 160px;">
                                    <ngxsmk-chart-bar [data]="analyticsData" [width]="240" [height]="120" />
                                  </div>
                                </div>
                                <div class="ngxsmk-mock-section">
                                  <ngxsmk-heading level="h4" style="margin-bottom: 0.75rem; font-size: 0.9375rem; font-weight: 600;">Traffic Sources</ngxsmk-heading>
                                  <div class="admin-bars">
                                    @for (s of trafficSources; track s.label) {
                                      <div class="admin-bar-row">
                                        <span class="admin-bar-label">{{ s.label }}</span>
                                        <div class="admin-bar-track"><div class="admin-bar-fill" [style.width.%]="s.value"></div></div>
                                        <span class="admin-bar-val">{{ s.value }}%</span>
                                      </div>
                                    }
                                  </div>
                                </div>
                              </div>
                            }
                            @case ('users') {
                              <div class="admin-users-toolbar">
                                <ngxsmk-heading level="h4" style="font-size: 0.9375rem; font-weight: 600; margin: 0;">Team Members</ngxsmk-heading>
                                <button ngxsmk-button size="sm">+ Add User</button>
                              </div>
                              <div class="admin-user-list">
                                @for (u of usersList; track u.email) {
                                  <div class="admin-user-row">
                                    <span class="admin-avatar" [style.background]="u.color">{{ u.initials }}</span>
                                    <div class="admin-user-info">
                                      <span class="admin-user-name">{{ u.name }}</span>
                                      <span class="admin-user-email">{{ u.email }}</span>
                                    </div>
                                    <span class="admin-user-role">{{ u.role }}</span>
                                    <ngxsmk-badge [variant]="u.status === 'Active' ? 'success' : 'warning'">{{ u.status }}</ngxsmk-badge>
                                  </div>
                                }
                              </div>
                            }
                            @case ('settings') {
                              <div class="admin-settings">
                                <ngxsmk-form-field label="Display Name" hint="Shown across the workspace.">
                                  <ngxsmk-input placeholder="Sachin Dilshan" />
                                </ngxsmk-form-field>
                                <ngxsmk-form-field label="Email Address">
                                  <ngxsmk-input type="email" placeholder="admin@ngxsmk.dev" />
                                </ngxsmk-form-field>
                                <ngxsmk-form-field label="Interface Theme">
                                  <ngxsmk-select [options]="themeOptions" value="system" />
                                </ngxsmk-form-field>
                                <ngxsmk-divider />
                                <ngxsmk-form-field label="Email Notifications" hint="Daily summary of workspace activity.">
                                  <ngxsmk-switch [checked]="true" />
                                </ngxsmk-form-field>
                                <ngxsmk-form-field label="Two-Factor Authentication" hint="Require a code on every sign-in.">
                                  <ngxsmk-switch [checked]="false" />
                                </ngxsmk-form-field>
                                <div class="admin-settings-actions">
                                  <button ngxsmk-button size="sm">Save Changes</button>
                                  <button ngxsmk-button size="sm" variant="outline">Cancel</button>
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
                        <ngxsmk-heading level="h4" class="mock-panel-title">AI Assistant</ngxsmk-heading>
                        <span style="font-size: 0.75rem; color: var(--ngxsmk-color-success); font-weight: 600;">● Online</span>
                      </div>
                      <div class="ngxsmk-mock-chat-window-wrapper">
                        <ngxsmk-chat-window [messages]="chatMessages" />
                      </div>
                      <div class="ngxsmk-mock-chat-composer">
                        <ngxsmk-input placeholder="Ask anything..." style="flex: 1;" />
                        <button ngxsmk-button>Send</button>
                      </div>
                    </div>
                  }

                  <!-- 3. SaaS Landing Page Template Preview -->
                  @if (id === 'landing-page') {
                    <div class="ngxsmk-mock-landing">
                      <div class="ngxsmk-mock-landing-nav">
                        <div style="font-weight: 700; font-family: 'Outfit'; font-size: 1rem; color: var(--ngxsmk-color-primary);">Astryx SaaS</div>
                        <div style="display: flex; gap: 1.5rem; font-size: 0.8125rem; font-weight: 500; color: var(--ngxsmk-color-on-surface-variant);">
                          <span>Features</span>
                          <span>Pricing</span>
                          <span>Docs</span>
                        </div>
                        <button ngxsmk-button size="sm">Get Started</button>
                      </div>
                      
                      <div class="ngxsmk-mock-landing-hero">
                        <ngxsmk-heading level="h1" style="font-size: 2.25rem; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2;">Innovate Faster</ngxsmk-heading>
                        <ngxsmk-text variant="body" style="font-size: 0.875rem; opacity: 0.8; max-width: 480px; margin: 0.5rem auto 1.5rem; line-height: 1.6;">
                          Build state-of-the-art enterprise web applications in minutes using NGXSMK premium signals-based UI Kit.
                        </ngxsmk-text>
                        <div style="display: flex; gap: 0.75rem; justify-content: center;">
                          <button ngxsmk-button>Start Free Trial</button>
                          <button ngxsmk-button variant="outline">Learn More</button>
                        </div>
                      </div>

                      <div class="ngxsmk-mock-landing-pricing">
                        <div class="ngxsmk-mock-price-card">
                          <ngxsmk-heading level="h4" style="font-size: 0.9375rem; font-weight: 600;">Starter</ngxsmk-heading>
                          <div class="ngxsmk-mock-price-val">$0<span style="font-size: 0.75rem; font-weight: 400; opacity: 0.7;">/mo</span></div>
                          <ngxsmk-divider />
                          <ul class="ngxsmk-mock-price-features">
                            <li>Basic layout UI blocks</li>
                            <li>Single developer license</li>
                            <li>Community support</li>
                          </ul>
                          <button ngxsmk-button variant="outline" style="width: 100%;">Sign Up</button>
                        </div>

                        <div class="ngxsmk-mock-price-card highlighted">
                          <div class="ngxsmk-mock-price-badge">Popular</div>
                          <ngxsmk-heading level="h4" style="font-size: 0.9375rem; font-weight: 600;">Professional</ngxsmk-heading>
                          <div class="ngxsmk-mock-price-val">$49<span style="font-size: 0.75rem; font-weight: 400; opacity: 0.7;">/mo</span></div>
                          <ngxsmk-divider />
                          <ul class="ngxsmk-mock-price-features">
                            <li>All premium & dashboard blocks</li>
                            <li>Unlimited dev licenses</li>
                            <li>Priority Slack support</li>
                          </ul>
                          <button ngxsmk-button style="width: 100%;">Get Pro</button>
                        </div>
                      </div>
                    </div>
                  }

                  <!-- 4. Kanban Task Board Template Preview -->
                  @if (id === 'kanban') {
                    <div class="ngxsmk-mock-kanban">
                      <div class="ngxsmk-mock-kanban-header">
                        <ngxsmk-heading level="h4" class="mock-panel-title">Sprint 24 Board</ngxsmk-heading>
                        <ngxsmk-badge>Active Sprint</ngxsmk-badge>
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
                        <ngxsmk-heading level="h4" class="mock-panel-title">System Configuration</ngxsmk-heading>
                      </div>
                      <div class="ngxsmk-mock-settings-body">
                        <ngxsmk-tabs value="profile">
                          <ngxsmk-tab value="profile" label="Profile Settings">
                            <div style="display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; max-width: 480px;">
                              <ngxsmk-form-field label="Display Name" hint="How you appear to others.">
                                <ngxsmk-input placeholder="Sachin Dilshan" />
                              </ngxsmk-form-field>
                              <ngxsmk-form-field label="Workspace Subdomain">
                                <ngxsmk-input placeholder="my-org" />
                              </ngxsmk-form-field>
                              <ngxsmk-form-field label="Interface Theme">
                                <ngxsmk-select [options]="themeOptions" value="system" />
                              </ngxsmk-form-field>
                            </div>
                          </ngxsmk-tab>
                          <ngxsmk-tab value="notifications" label="Notification Feeds">
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
                      </div>
                    </div>
                  }

                  <!-- 6. E-Commerce Product Detail Template Preview -->
                  @if (id === 'ecommerce-detail') {
                    <div class="ngxsmk-mock-ecommerce">
                      <div class="ngxsmk-mock-ecommerce-grid">
                        <div class="ngxsmk-mock-ecommerce-gallery">
                          <div class="gallery-primary-img">
                            <img src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60" alt="Premium Headphones" class="product-preview-img" />
                          </div>
                        </div>
                        
                        <div class="ngxsmk-mock-ecommerce-info">
                          <ngxsmk-badge variant="info" style="align-self: flex-start;">Free Shipping</ngxsmk-badge>
                          <ngxsmk-heading level="h2" style="font-size: 1.5rem; font-weight: 700; margin: 0.5rem 0;">AeroSound Pro Headphones</ngxsmk-heading>
                          
                          <div class="product-ratings-row">
                            <span class="stars-gold">★★★★★</span>
                            <span class="ratings-count">(124 reviews)</span>
                          </div>

                          <div class="product-price-row">
                            <span class="price-current">$199.00</span>
                            <span class="price-old">$249.00</span>
                          </div>

                          <ngxsmk-divider />

                          <ngxsmk-text variant="body" style="font-size: 0.8125rem; line-height: 1.6; color: var(--ngxsmk-color-on-surface-variant);">
                            Active noise-cancelling headphones featuring 40h battery life, studio acoustics, and lightweight memory foam cushions.
                          </ngxsmk-text>

                          <div class="product-spec-row">
                            <span style="font-weight: 600; font-size: 0.8125rem;">Color</span>
                            <div class="product-color-selector">
                              <span class="color-dot active" style="background-color: #09090b;"></span>
                              <span class="color-dot" style="background-color: #7c3aed;"></span>
                              <span class="color-dot" style="background-color: #10b981;"></span>
                            </div>
                          </div>

                          <div style="display: flex; gap: 0.75rem; margin-top: 1rem;">
                            <button ngxsmk-button style="flex: 1;">Add to Cart</button>
                            <button ngxsmk-button variant="outline">Buy Now</button>
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
                          <ngxsmk-heading level="h3" style="font-size: 1.25rem; font-weight: 700;">Sign in to account</ngxsmk-heading>
                          <ngxsmk-text variant="body" style="font-size: 0.75rem; color: var(--ngxsmk-color-on-surface-variant);">Enter credentials to access workspace</ngxsmk-text>
                        </div>
                        
                        <div class="ngxsmk-mock-auth-socials">
                          <button ngxsmk-button variant="outline" style="flex: 1; font-size: 0.75rem;">Google</button>
                          <button ngxsmk-button variant="outline" style="flex: 1; font-size: 0.75rem;">GitHub</button>
                        </div>
                        
                        <div class="auth-divider-line">
                          <span>or continue with email</span>
                        </div>

                        <div class="ngxsmk-mock-auth-form">
                          <ngxsmk-form-field label="Email Address">
                            <ngxsmk-input type="email" placeholder="name@example.com" />
                          </ngxsmk-form-field>
                          <ngxsmk-form-field label="Password">
                            <ngxsmk-input type="password" placeholder="••••••••" />
                          </ngxsmk-form-field>
                          
                          <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem;">
                            <ngxsmk-switch [checked]="true">Keep me signed in</ngxsmk-switch>
                            <a href="#" style="color: var(--ngxsmk-color-primary); text-decoration: none; font-weight: 500;">Forgot?</a>
                          </div>

                          <button ngxsmk-button style="width: 100%; margin-top: 0.5rem;">Sign In</button>
                        </div>
                      </div>
                    </div>
                  }

                  <!-- 8. System Health Monitor Template Preview -->
                  @if (id === 'health-monitor') {
                    <div class="ngxsmk-mock-health">
                      <div class="ngxsmk-mock-health-top">
                        <ngxsmk-heading level="h4" class="mock-panel-title">System Status Monitor</ngxsmk-heading>
                        <ngxsmk-badge variant="success">All Systems Operational</ngxsmk-badge>
                      </div>
                      
                      <div class="ngxsmk-mock-health-stats">
                        <div class="health-mini-stat">
                          <span class="label">CPU Usage</span>
                          <span class="value">14.2%</span>
                          <div class="health-bar"><div class="fill" style="width: 14%;"></div></div>
                        </div>
                        <div class="health-mini-stat">
                          <span class="label">Memory (RAM)</span>
                          <span class="value">64.8%</span>
                          <div class="health-bar"><div class="fill warning" style="width: 64.8%;"></div></div>
                        </div>
                        <div class="health-mini-stat">
                          <span class="label">API Latency</span>
                          <span class="value">24ms</span>
                          <div class="health-bar"><div class="fill success" style="width: 8%;"></div></div>
                        </div>
                      </div>

                      <div class="ngxsmk-mock-health-terminal">
                        <ngxsmk-terminal title="System Events Log" [lines]="healthLogs" />
                      </div>
                    </div>
                  }

        </div>
      </div>
    </ng-template>

    <!-- Live Preview / Get Code Dialog Modal -->
    <ngxsmk-dialog [(open)]="dialogOpen" [title]="selectedTemplate()?.title ?? ''" style="--ngxsmk-dialog-width: 72rem;">
      @if (selectedTemplate()) {
        <ngxsmk-tabs [(value)]="activeTab" class="ngxsmk-custom-tabs">
          <ngxsmk-tab value="preview" label="Live Preview">
            <div class="ngxsmk-template-preview-viewport">
              <ng-container [ngTemplateOutlet]="miniPreview" [ngTemplateOutletContext]="{ id: selectedTemplate()?.id }" />
            </div>
          </ngxsmk-tab>

          <ngxsmk-tab value="code" label="Source Code">
            <div class="ngxsmk-template-code-viewport">
              <div class="ngxsmk-code-copy-bar">
                <button ngxsmk-button size="sm" [ngxsmkCopyToClipboard]="selectedTemplate()?.code ?? ''" (click)="onCodeCopied()">
                  {{ copied() ? 'Copied to Clipboard!' : 'Copy Code' }}
                </button>
              </div>
              <ngxsmk-code-block language="html">{{ selectedTemplate()?.code }}</ngxsmk-code-block>
            </div>
          </ngxsmk-tab>
        </ngxsmk-tabs>
      }
    </ngxsmk-dialog>
  `,
  styles: `
    .ngxsmk-page-container {
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: calc(100vh - 3.5rem);
    }
    .ngxsmk-page { max-width: 1200px; margin: 0 auto; padding: var(--ngxsmk-space-12,3rem) var(--ngxsmk-space-6,1.5rem); }

    /* === Astryx-style header === */
    .tpl-header { display: flex; flex-direction: column; gap: 0.5rem; margin-bottom: var(--ngxsmk-space-8,2rem); }
    .tpl-header__title { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; color: var(--ngxsmk-color-on-surface,#09090b); margin: 0; }
    .tpl-header__sub { color: var(--ngxsmk-color-on-surface-variant,#71717a); margin: 0; font-size: 1.0625rem; }

    /* === Astryx-style card grid === */
    .tpl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--ngxsmk-space-5,1.25rem); }

    .tpl-card {
      display: flex;
      flex-direction: column;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      background: var(--ngxsmk-color-surface);
      overflow: hidden;
      transition:
        transform var(--ngxsmk-duration-normal,220ms) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-normal,220ms) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-normal,220ms) var(--ngxsmk-ease-out);
    }
    .tpl-card:hover {
      transform: translateY(-4px);
      box-shadow: var(--ngxsmk-shadow-lg);
      border-color: var(--ngxsmk-color-outline-strong);
    }

    /* Live scaled preview area */
    .tpl-card__preview {
      position: relative;
      display: block;
      width: 100%;
      height: 300px;
      border: none;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant,#f4f4f5);
      overflow: hidden;
      cursor: pointer;
    }
    .tpl-card__preview:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
    }
    /* The mock renders at ~1.67x then scales down to fit — a mini desktop preview */
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
      background: linear-gradient(to top, var(--ngxsmk-color-surface-variant,#f4f4f5), transparent);
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
      transition: opacity var(--ngxsmk-duration-normal,200ms) var(--ngxsmk-ease-out);
    }
    .tpl-card__preview:hover .tpl-card__hover,
    .tpl-card__preview:focus-visible .tpl-card__hover { opacity: 1; }
    .tpl-card__hover-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.9rem;
      border-radius: var(--ngxsmk-radius-full);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-size: 0.8125rem;
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
    .tpl-cat {
      align-self: flex-start;
      font-size: 0.625rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 0.15rem 0.5rem;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .tpl-cat[data-cat='Application'] { background: #e0f2fe; color: #0369a1; }
    .tpl-cat[data-cat='Marketing'] { background: #fef3c7; color: #b45309; }
    .tpl-cat[data-cat='E-Commerce'] { background: #dcfce7; color: #15803d; }
    .tpl-cat[data-cat='Authentication'] { background: #f3e8ff; color: #6b21a8; }
    .tpl-cat[data-cat='DevOps'] { background: #fee2e2; color: #b91c1c; }
    .tpl-card__title { margin: 0; font-size: 1.15rem; font-weight: 700; color: var(--ngxsmk-color-on-surface); }
    .tpl-card__desc { margin: 0; font-size: 0.8125rem; line-height: 1.6; color: var(--ngxsmk-color-on-surface-variant); flex: 1; }
    .tpl-card__actions { display: flex; gap: 0.5rem; margin-top: 0.75rem; }
    .tpl-card__actions .btn-icon { flex-shrink: 0; margin-right: 0.25rem; }

    @media (max-width: 900px) {
      .tpl-grid { grid-template-columns: 1fr; }
    }
    .ngxsmk-page__header { margin-bottom: var(--ngxsmk-space-12,3rem); text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem; }
    .ngxsmk-badge-wrapper { margin-bottom: 0.25rem; }
    .ngxsmk-pill-badge { background: var(--ngxsmk-color-primary-container, #ede9fe); color: var(--ngxsmk-color-on-primary-container, #4c1d95); font-size: 0.75rem; font-weight: 600; padding: 0.25rem 0.75rem; border-radius: var(--ngxsmk-radius-full); border: 1px solid color-mix(in srgb, var(--ngxsmk-color-primary) 15%, transparent); }
    .ngxsmk-main-title { font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; color: var(--ngxsmk-color-on-surface,#09090b); margin: 0; }
    .ngxsmk-page__sub { color: var(--ngxsmk-color-on-surface-variant,#71717a); margin: 0; font-size: 1rem; max-width: 600px; line-height: 1.6; }
    
    .ngxsmk-templates-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(min(22rem,100%),1fr)); gap: var(--ngxsmk-space-6,1.5rem); }
    
    .ngxsmk-template-wrapper-card {
      transition: transform var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out), box-shadow var(--ngxsmk-duration-normal) var(--ngxsmk-ease-out);
      border-radius: var(--ngxsmk-radius-xl);
    }
    .ngxsmk-template-wrapper-card:hover {
      transform: translateY(-6px);
      box-shadow: var(--ngxsmk-shadow-lg);
    }
    
    .ngxsmk-template-card { display: flex; flex-direction: column; height: 100%; border: 1px solid var(--ngxsmk-color-outline); border-radius: var(--ngxsmk-radius-xl) !important; background: var(--ngxsmk-color-surface); }
    .ngxsmk-card-head-custom { padding: var(--ngxsmk-space-5) var(--ngxsmk-space-5) var(--ngxsmk-space-3); border-bottom: none; }
    .ngxsmk-card-top-row { margin-bottom: 0.5rem; }
    .ngxsmk-category-tag { font-size: 0.625rem; font-weight: 700; text-transform: uppercase; tracking: 0.05em; padding: 0.125rem 0.5rem; border-radius: var(--ngxsmk-radius-sm); }
    .ngxsmk-category-tag[data-cat='Application'] { background: #e0f2fe; color: #0369a1; }
    .ngxsmk-category-tag[data-cat='Marketing'] { background: #fef3c7; color: #b45309; }
    .ngxsmk-category-tag[data-cat='E-Commerce'] { background: #dcfce7; color: #15803d; }
    .ngxsmk-category-tag[data-cat='Authentication'] { background: #f3e8ff; color: #6b21a8; }
    .ngxsmk-category-tag[data-cat='DevOps'] { background: #fee2e2; color: #b91c1c; }
    
    .ngxsmk-card-title-custom { margin: 0; font-size: 1.1rem; font-weight: 700; color: var(--ngxsmk-color-on-surface); }
    .ngxsmk-card-content-custom { padding: 0 var(--ngxsmk-space-5) var(--ngxsmk-space-5); display: flex; flex-direction: column; flex-grow: 1; }
    
    .ngxsmk-template-desc { color: var(--ngxsmk-color-on-surface-variant,#71717a); font-size: 0.8125rem; line-height: 1.6; margin: 0 0 var(--ngxsmk-space-5,1.25rem); flex-grow: 1; }
    .ngxsmk-template-actions { display: flex; gap: var(--ngxsmk-space-2,0.5rem); }
    .ngxsmk-btn-preview { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.375rem; font-weight: 600; }
    .ngxsmk-btn-code { flex: 1; display: inline-flex; align-items: center; justify-content: center; gap: 0.375rem; font-weight: 500; }
    .btn-icon { flex-shrink: 0; }

    /* Dialog Previews Style */
    .ngxsmk-template-preview-viewport {
      min-height: 520px;
      padding: var(--ngxsmk-space-5);
      background-color: var(--ngxsmk-color-surface-variant,#f4f4f5);
      background-image: radial-gradient(var(--ngxsmk-color-outline,#e4e4e7) 1px, transparent 1px);
      background-size: 20px 20px;
      border-radius: var(--ngxsmk-radius-lg);
      border: 1px dashed var(--ngxsmk-color-outline);
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
      background: var(--ngxsmk-color-surface,#ffffff);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      display: flex;
      flex-direction: column;
      box-shadow: var(--ngxsmk-shadow-lg);
      overflow: hidden;
    }
    .ngxsmk-mock-window-titlebar {
      height: 2.5rem;
      background: var(--ngxsmk-color-surface-variant,#f4f4f5);
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
    .ngxsmk-mock-window-dots .dot.red { background-color: #ef4444; }
    .ngxsmk-mock-window-dots .dot.yellow { background-color: #eab308; }
    .ngxsmk-mock-window-dots .dot.green { background-color: #22c55e; }
    
    .ngxsmk-mock-window-address-bar {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: 40%;
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      font-size: 0.6875rem;
      color: var(--ngxsmk-color-on-surface-variant);
      padding: 0.125rem 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
    }
    .lock-icon { flex-shrink: 0; opacity: 0.7; }
    .ngxsmk-mock-window-content {
      background: var(--ngxsmk-color-surface-variant,#f4f4f5);
      padding: var(--ngxsmk-space-4);
      height: 460px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    /* Mock Layouts Styles */
    .ngxsmk-mock-dashboard {
      background: var(--ngxsmk-color-surface,#ffffff);
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
    .mock-panel-title { font-size: 0.9375rem; font-weight: 700; color: var(--ngxsmk-color-on-surface); margin: 0; }
    .ngxsmk-mock-body {
      display: flex;
      flex: 1;
      overflow: hidden;
    }
    .ngxsmk-mock-sidebar {
      width: 140px;
      border-right: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant,#f4f4f5);
      padding: var(--ngxsmk-space-3);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .ngxsmk-mock-side-item {
      font-family: inherit;
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
      padding: 0.375rem 0.75rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md);
      background: transparent;
      text-align: left;
      width: 100%;
      cursor: pointer;
      transition: background var(--ngxsmk-duration-fast,150ms) var(--ngxsmk-ease-out), color var(--ngxsmk-duration-fast,150ms) var(--ngxsmk-ease-out);
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
    .admin-bars { display: flex; flex-direction: column; gap: 0.7rem; padding-top: 0.25rem; }
    .admin-bar-row { display: grid; grid-template-columns: 72px 1fr 40px; align-items: center; gap: 0.6rem; font-size: 0.75rem; }
    .admin-bar-label { color: var(--ngxsmk-color-on-surface-variant); }
    .admin-bar-track { height: 8px; background: var(--ngxsmk-color-surface-variant); border-radius: 999px; overflow: hidden; }
    .admin-bar-fill { height: 100%; background: var(--ngxsmk-color-primary); border-radius: 999px; }
    .admin-bar-val { text-align: right; font-weight: 600; color: var(--ngxsmk-color-on-surface); }

    .admin-users-toolbar { display: flex; align-items: center; justify-content: space-between; }
    .admin-user-list { display: flex; flex-direction: column; gap: 0.5rem; }
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
      font-size: 0.6875rem;
      font-weight: 700;
      flex-shrink: 0;
    }
    .admin-user-info { display: flex; flex-direction: column; min-width: 0; }
    .admin-user-name { font-size: 0.8125rem; font-weight: 600; color: var(--ngxsmk-color-on-surface); }
    .admin-user-email { font-size: 0.6875rem; color: var(--ngxsmk-color-on-surface-variant); }
    .admin-user-role { font-size: 0.75rem; font-weight: 500; color: var(--ngxsmk-color-on-surface-variant); }

    .admin-settings { display: flex; flex-direction: column; gap: 1rem; max-width: 460px; }
    .admin-settings-actions { display: flex; gap: 0.5rem; margin-top: 0.25rem; }
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
      background: var(--ngxsmk-color-surface,#ffffff);
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
      background: var(--ngxsmk-color-surface,#ffffff);
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
      font-size: 0.625rem;
      font-weight: 700;
      padding: 0.125rem 0.375rem;
      border-radius: var(--ngxsmk-radius-sm);
      text-transform: uppercase;
    }
    .ngxsmk-mock-price-val {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--ngxsmk-color-on-surface);
    }
    .ngxsmk-mock-price-features {
      list-style: none;
      padding: 0;
      margin: 0;
      font-size: 0.8125rem;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      color: var(--ngxsmk-color-on-surface-variant);
      flex-grow: 1;
    }

    /* Mock Kanban Styles */
    .ngxsmk-mock-kanban {
      background: var(--ngxsmk-color-surface,#ffffff);
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
      background: var(--ngxsmk-color-surface,#ffffff);
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
      background: var(--ngxsmk-color-surface,#ffffff);
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
    .stars-gold { color: #eab308; font-size: 0.875rem; }
    .ratings-count { font-size: 0.75rem; color: var(--ngxsmk-color-on-surface-variant); }
    .product-price-row {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      margin-top: 0.25rem;
    }
    .price-current { font-size: 1.5rem; font-weight: 700; color: var(--ngxsmk-color-on-surface); }
    .price-old { font-size: 0.9375rem; text-decoration: line-through; color: var(--ngxsmk-color-on-surface-variant); opacity: 0.7; }
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
      background: var(--ngxsmk-color-surface-variant,#f4f4f5);
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ngxsmk-mock-auth-card {
      background: var(--ngxsmk-color-surface,#ffffff);
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
      font-size: 0.6875rem;
      color: var(--ngxsmk-color-on-surface-variant);
      opacity: 0.7;
    }
    .auth-divider-line::before,
    .auth-divider-line::after {
      content: '';
      flex: 1;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }
    .auth-divider-line:not(:empty)::before { margin-right: 0.5rem; }
    .auth-divider-line:not(:empty)::after { margin-left: 0.5rem; }
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
    .ngxsmk-mock-health-top .mock-panel-title { color: #f4f4f5; }
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
    .health-mini-stat .label { font-size: 0.6875rem; color: #a3a3a3; font-weight: 500; }
    .health-mini-stat .value { font-size: 1.1rem; font-weight: 700; color: #f5f5f5; }
    .health-bar {
      width: 100%;
      height: 4px;
      background: #404040;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 0.25rem;
    }
    .health-bar .fill { height: 100%; background: var(--ngxsmk-color-primary); }
    .health-bar .fill.warning { background: #eab308; }
    .health-bar .fill.success { background: #22c55e; }
    .ngxsmk-mock-health-terminal {
      flex: 1;
      overflow: hidden;
    }

    /* === Toolbar / Filters === */
    .ngxsmk-templates-toolbar {
      margin-bottom: var(--ngxsmk-space-8,2rem);
    }
    .ngxsmk-templates-toolbar-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: var(--ngxsmk-space-4,1rem);
      flex-wrap: wrap;
    }
    .ngxsmk-templates-categories {
      display: flex;
      gap: 0.375rem;
      flex-wrap: wrap;
    }
    .ngxsmk-category-chip {
      font-family: inherit;
      font-size: 0.8125rem;
      font-weight: 500;
      padding: 0.375rem 0.875rem;
      border-radius: var(--ngxsmk-radius-full,9999px);
      border: 1px solid var(--ngxsmk-color-outline,#e4e4e7);
      background: var(--ngxsmk-color-surface,#ffffff);
      color: var(--ngxsmk-color-on-surface-variant,#71717a);
      cursor: pointer;
      transition: all var(--ngxsmk-duration-fast,150ms) var(--ngxsmk-ease-out);
      white-space: nowrap;
    }
    .ngxsmk-category-chip:hover {
      border-color: var(--ngxsmk-color-primary,#7c3aed);
      color: var(--ngxsmk-color-primary,#7c3aed);
    }
    .ngxsmk-category-chip.active {
      background: var(--ngxsmk-color-primary,#7c3aed);
      border-color: var(--ngxsmk-color-primary,#7c3aed);
      color: var(--ngxsmk-color-on-primary,#ffffff);
    }
    .chip-count {
      font-size: 0.75rem;
      opacity: 0.7;
      margin-left: 0.125rem;
    }
    .ngxsmk-category-chip.active .chip-count {
      opacity: 0.85;
    }
    .ngxsmk-search-wrapper {
      display: flex;
      align-items: center;
      background: var(--ngxsmk-color-surface,#ffffff);
      border: 1px solid var(--ngxsmk-color-outline,#e4e4e7);
      border-radius: var(--ngxsmk-radius-full,9999px);
      padding: 0.375rem 1rem;
      gap: 0.5rem;
      min-width: 200px;
      transition: border-color var(--ngxsmk-duration-fast,150ms);
    }
    .ngxsmk-search-wrapper:focus-within {
      border-color: var(--ngxsmk-color-primary,#7c3aed);
      box-shadow: 0 0 0 2px color-mix(in srgb, var(--ngxsmk-color-primary) 15%, transparent);
    }
    .search-icon {
      flex-shrink: 0;
      opacity: 0.4;
    }
    .ngxsmk-search-input {
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface,#09090b);
      outline: none;
      width: 100%;
    }
    .ngxsmk-search-input::placeholder {
      color: var(--ngxsmk-color-on-surface-variant,#71717a);
    }
    .search-clear {
      background: none;
      border: none;
      cursor: pointer;
      padding: 0.125rem;
      opacity: 0.4;
      color: var(--ngxsmk-color-on-surface-variant,#71717a);
      display: flex;
    }
    .search-clear:hover {
      opacity: 0.8;
    }
    .ngxsmk-templates-toolbar-sub {
      margin-top: 0.75rem;
    }
    .ngxsmk-result-count {
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant,#71717a);
    }
    .count-num {
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface,#09090b);
    }

    /* === Empty State === */
    .ngxsmk-templates-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      padding: 4rem 2rem;
      text-align: center;
    }

    /* === Preview Thumbnail === */
    .ngxsmk-template-preview-thumb {
      position: relative;
      height: 140px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ngxsmk-radius-xl) var(--ngxsmk-radius-xl) 0 0;
      overflow: hidden;
    }
    .ngxsmk-template-thumb-icon {
      color: rgba(255,255,255,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .ngxsmk-template-thumb-overlay {
      position: absolute;
      inset: 0;
      background: rgba(0,0,0,0.35);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity var(--ngxsmk-duration-normal,200ms) var(--ngxsmk-ease-out);
    }
    .ngxsmk-template-wrapper-card:hover .ngxsmk-template-thumb-overlay {
      opacity: 1;
    }
    .ngxsmk-btn-view {
      backdrop-filter: blur(4px);
    }
  `,
})
export class TemplatesPage {
  protected readonly categories: TemplateCategory[] = ['All', 'Application', 'Marketing', 'E-Commerce', 'Authentication', 'DevOps'];
  protected readonly activeCategory = signal<TemplateCategory>('All');
  protected readonly searchQuery = signal('');

  protected readonly filteredTemplates = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const cat = this.activeCategory();
    return this.templatesList.filter(tpl => {
      if (cat !== 'All' && tpl.category !== cat) return false;
      if (query && !tpl.title.toLowerCase().includes(query) && !tpl.description.toLowerCase().includes(query)) return false;
      return true;
    });
  });

  protected readonly dialogOpen = signal(false);
  protected readonly selectedTemplate = signal<TemplateItem | null>(null);
  protected readonly activeTab = signal<'preview' | 'code'>('preview');
  protected readonly copied = signal(false);

  // --- Admin Console (dashboard template) multi-page navigation ---
  protected readonly adminNav = [
    { id: 'dashboard' as const, label: 'Dashboard' },
    { id: 'analytics' as const, label: 'Analytics' },
    { id: 'users' as const, label: 'Users' },
    { id: 'settings' as const, label: 'Settings' },
  ];
  protected readonly adminView = signal<'dashboard' | 'analytics' | 'users' | 'settings'>('dashboard');

  protected readonly analyticsData = [
    { label: 'Jan', value: 42 },
    { label: 'Feb', value: 55 },
    { label: 'Mar', value: 38 },
    { label: 'Apr', value: 71 },
    { label: 'May', value: 64 },
    { label: 'Jun', value: 88 },
  ];
  protected readonly trafficSources = [
    { label: 'Organic', value: 48 },
    { label: 'Direct', value: 27 },
    { label: 'Referral', value: 15 },
    { label: 'Social', value: 10 },
  ];
  protected readonly usersList = [
    { name: 'Ada Lovelace', email: 'ada@ngxsmk.dev', role: 'Owner', status: 'Active', initials: 'AL', color: '#7c3aed' },
    { name: 'Alan Turing', email: 'alan@ngxsmk.dev', role: 'Admin', status: 'Active', initials: 'AT', color: '#0369a1' },
    { name: 'Grace Hopper', email: 'grace@ngxsmk.dev', role: 'Editor', status: 'Active', initials: 'GH', color: '#15803d' },
    { name: 'Linus Torvalds', email: 'linus@ngxsmk.dev', role: 'Viewer', status: 'Invited', initials: 'LT', color: '#b45309' },
  ];

  protected categoryCount(cat: TemplateCategory): number {
    if (cat === 'All') return this.templatesList.length;
    return this.templatesList.filter(t => t.category === cat).length;
  }

  protected readonly tableColumns = [
    { key: 'user', label: 'User Name' },
    { key: 'status', label: 'Billing Plan' },
    { key: 'registered', label: 'Active Sessions' }
  ];

  protected readonly tableRows = [
    { user: 'Ada Lovelace', status: 'Enterprise Pro', registered: '4 current' },
    { user: 'Alan Turing', status: 'Professional Plan', registered: '1 current' },
    { user: 'Grace Hopper', status: 'Developer Free', registered: '0 sessions' }
  ];

  protected readonly chartData = [
    { label: 'Mon', value: 34 },
    { label: 'Tue', value: 45 },
    { label: 'Wed', value: 23 },
    { label: 'Thu', value: 56 },
    { label: 'Fri', value: 89 }
  ];

  protected readonly chatMessages = [
    { id: '1', role: 'system' as const, content: 'Assistant initialized. Powered by Gemini 3.5.', timestamp: new Date() },
    { id: '2', role: 'user' as const, content: 'How do I implement custom CSS variables in the theme engine?', timestamp: new Date() },
    { id: '3', role: 'assistant' as const, content: 'You can define custom token overrides like: --ngxsmk-button-bg: var(--ngxsmk-color-emerald);', timestamp: new Date() }
  ];

  protected readonly kanbanColumns = signal<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'k1', title: 'Design onboarding flow', description: 'Wireframe the 3-step signup.' },
        { id: 'k2', title: 'Audit color tokens' }
      ]
    },
    {
      id: 'progress',
      title: 'In Progress',
      items: [
        { id: 'k3', title: 'Build data table', description: 'Sorting + pagination.' }
      ]
    },
    {
      id: 'review',
      title: 'In Review',
      items: [
        { id: 'k4', title: 'Refactor auth guard' }
      ]
    },
    {
      id: 'done',
      title: 'Done',
      items: [
        { id: 'k5', title: 'Ship theme engine', description: 'Released in v1.2.' }
      ]
    }
  ]);

  protected readonly themeOptions = [
    { value: 'light', label: 'Light Theme' },
    { value: 'dark', label: 'Dark Night Theme' },
    { value: 'system', label: 'Follow System Default' }
  ];

  protected readonly healthLogs = [
    { text: 'systemctl start nginx', isInput: true },
    { text: 'nginx.service - high-performance web server started.' },
    { text: 'docker-compose up -d --build postgres', isInput: true },
    { text: 'database container up: listening on port 5432' },
    { text: 'api-service connection established: DB response 1ms' }
  ];

  protected readonly templatesList: TemplateItem[] = [
    {
      id: 'dashboard',
      title: 'Admin Dashboard',
      category: 'Application',
      description: 'A complete dashboard template featuring sidebar navigation, user profile settings, complex data tables, dynamic charts, and stats panels.',
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
</ngxsmk-app-shell>`
    },
    {
      id: 'ai-chat',
      title: 'AI Chat Interface',
      category: 'Application',
      description: 'A modern, responsive conversational UI featuring message streaming, markdown response formatting, code syntax highlighting, and inline tool calls.',
      gradient: 'linear-gradient(135deg, #064e3b, #065f46, #047857)',
      code: `<!-- ai-chat.html -->
<ngxsmk-chat-layout>
  <ngxsmk-chat-window [messages]="chatMessages" />
  
  <ngxsmk-chat-composer-drawer>
    <ngxsmk-input placeholder="Ask anything..." style="flex: 1;" />
    <button ngxsmk-button>Send</button>
  </ngxsmk-chat-composer-drawer>
</ngxsmk-chat-layout>`
    },
    {
      id: 'landing-page',
      title: 'SaaS Landing Page',
      category: 'Marketing',
      description: 'A high-conversion landing page mockup with a beautiful hero section, interactive pricing tables, features grids, and animated FAQ accordions.',
      gradient: 'linear-gradient(135deg, #701a75, #86198f, #a21caf)',
      code: `<!-- landing-page.html -->
<div class="landing-nav">
  <div style="font-weight: 700; font-family: 'Outfit';">Astryx SaaS</div>
  <div style="display: flex; gap: 1rem;">
    <span>Features</span>
    <span>Pricing</span>
    <span>Docs</span>
  </div>
  <button ngxsmk-button size="sm">Get Started</button>
</div>

<div class="landing-hero">
  <ngxsmk-heading level="h1">Innovate Faster</ngxsmk-heading>
  <ngxsmk-text variant="body" style="font-size: 1rem; opacity: 0.8; max-width: 480px; margin: 0.5rem auto 1.5rem;">
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
</div>`
    },
    {
      id: 'kanban',
      title: 'Kanban Task Board',
      category: 'Application',
      description: 'An interactive column-based task board to manage sprint tasks, user stories, and bugs. Features drag-and-drop actions.',
      gradient: 'linear-gradient(135deg, #1e3a5f, #1e4d8c, #2563eb)',
      code: `<!-- kanban-board.html -->
<ngxsmk-card>
  <div ngxsmkCardHeader>
    <ngxsmk-heading level="h3">Sprint 24 Board</ngxsmk-heading>
  </div>
  <div ngxsmkCardContent>
    <ngxsmk-kanban-board [columns]="columns" />
  </div>
</ngxsmk-card>`
    },
    {
      id: 'settings',
      title: 'User Settings Page',
      category: 'Application',
      description: 'A comprehensive, multi-section configuration panel for profile options, billing systems, and security switches.',
      gradient: 'linear-gradient(135deg, #292524, #44403c, #57534e)',
      code: `<!-- settings.html -->
<div class="settings-container">
  <ngxsmk-tabs value="profile">
    <ngxsmk-tab value="profile" label="Profile">
      <div style="display: flex; flex-direction: column; gap: 1rem; padding-top: 1rem; max-width: 480px;">
        <ngxsmk-form-field label="Display Name" hint="How you appear to others.">
          <ngxsmk-input placeholder="Jane Doe" />
        </ngxsmk-form-field>
        <ngxsmk-form-field label="Workspace Subdomain">
          <ngxsmk-input placeholder="my-org" />
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
</div>`
    },
    {
      id: 'ecommerce-detail',
      title: 'E-Commerce Product Detail',
      category: 'E-Commerce',
      description: 'A premium product details layout with rating feedback, price old/new offsets, custom color selectors, and cart commands.',
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
</div>`
    },
    {
      id: 'auth-cards',
      title: 'Credentials Auth Cards',
      category: 'Authentication',
      description: 'A gorgeous authentication card with email/password input validations, social login quick buttons, and keep-alive switches.',
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
      <ngxsmk-input type="email" placeholder="name@example.com" />
    </ngxsmk-form-field>
    <ngxsmk-form-field label="Password">
      <ngxsmk-input type="password" placeholder="••••••••" />
    </ngxsmk-form-field>
    
    <div class="options">
      <ngxsmk-switch [checked]="true">Keep me signed in</ngxsmk-switch>
      <a href="#">Forgot?</a>
    </div>

    <button ngxsmk-button style="width: 100%;">Sign In</button>
  </ngxsmk-form-layout>
</ngxsmk-card>`
    },
    {
      id: 'health-monitor',
      title: 'System Health Monitor',
      category: 'DevOps',
      description: 'A DevOps administration dashboard with active stat load gauges, health badges, and real-time server command logs.',
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

<ngxsmk-terminal title="System Events Log" [lines]="logs" />`
    }
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
