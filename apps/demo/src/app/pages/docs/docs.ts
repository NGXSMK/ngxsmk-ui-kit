import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { APP_VERSION } from '../../core/version';
import { NgxsmkButton } from '@ngxsmk/core/button';
import {
  NgxsmkCard,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCardContent,
} from '@ngxsmk/core/card';
import { NgxsmkAccordion, NgxsmkAccordionItem } from '@ngxsmk/core/accordion';
import { NgxsmkTag } from '@ngxsmk/core/tag';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkHeading } from '@ngxsmk/core/heading';

@Component({
  selector: 'docs-page',
  standalone: true,
  imports: [
    TranslatePipe,
    NgxsmkCard,
    NgxsmkCardContent,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    AppNav,
    NgxsmkButton,
    NgxsmkAccordion,
    NgxsmkAccordionItem,
    NgxsmkTag,
    NgxsmkProgress,
    NgxsmkSwitch,
    NgxsmkHeading,
  ],
  template: `
    <app-nav />

    <div class="docs-container">
      <!-- HERO HEADER -->
      <header class="docs-header">
        <div class="docs-badges">
          <ngxsmk-tag class="docs-badge">v{{ version }}</ngxsmk-tag>
          <ngxsmk-tag
            class="docs-badge"
            style="--ngxsmk-color-surface-variant: rgba(0, 100, 224, 0.1); color: var(--ngxsmk-color-primary)"
            >Zoneless</ngxsmk-tag
          >
          <ngxsmk-tag
            class="docs-badge"
            style="--ngxsmk-color-surface-variant: rgba(16, 185, 129, 0.1); color: #10b981"
            >Signal-first</ngxsmk-tag
          >
        </div>
        <ngxsmk-heading level="h1" class="docs-title">{{
          'docs.developerPortal' | translate
        }}</ngxsmk-heading>
        <p class="docs-subtitle">
          {{ 'docs.subtitle' | translate }}
        </p>
      </header>

      <!-- QUICK INSTALL & TERMINAL SECTION -->
      <section class="docs-section-card">
        <div class="docs-grid-two">
          <div class="docs-install-info">
            <ngxsmk-heading level="h2" class="docs-section-title">{{
              'docs.quickStart' | translate
            }}</ngxsmk-heading>
            <p class="docs-text">
              {{ 'docs.quickStartDesc' | translate }}
            </p>
            <div class="docs-features-checklist">
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>{{ 'docs.checkZeroDeps' | translate }}</span>
              </div>
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>{{ 'docs.checkSsr' | translate }}</span>
              </div>
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>{{ 'docs.checkWebApis' | translate }}</span>
              </div>
            </div>
          </div>

          <div class="docs-terminal-container">
            <!-- Terminal 1 -->
            <div class="docs-terminal">
              <div class="terminal-header">
                <div class="terminal-dots"><i></i><i></i><i></i></div>
                <span class="terminal-title">bash - npm</span>
              </div>
              <div class="terminal-body">
                <span class="terminal-prompt">$</span>
                <code class="terminal-code">npm install &#64;ngxsmk/core &#64;ngxsmk/theme</code>
                <button class="terminal-copy-btn" (click)="copyCommand('npm')">
                  {{ (copiedNPM() ? 'docs.copied' : 'docs.copy') | translate }}
                </button>
              </div>
            </div>

            <!-- Terminal 2 -->
            <div class="docs-terminal" style="margin-top: 1rem;">
              <div class="terminal-header">
                <div class="terminal-dots"><i></i><i></i><i></i></div>
                <span class="terminal-title">bash - cli</span>
              </div>
              <div class="terminal-body">
                <span class="terminal-prompt">$</span>
                <code class="terminal-code">npx ngxsmk add button</code>
                <button class="terminal-copy-btn" (click)="copyCommand('cli')">
                  {{ (copiedCLI() ? 'docs.copied' : 'docs.copy') | translate }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ARCHITECTURE PILLARS GRID -->
      <section style="margin-bottom: 3rem;">
        <ngxsmk-heading level="h2" class="docs-subheading">{{
          'docs.corePillars' | translate
        }}</ngxsmk-heading>
        <div class="docs-pillars-grid">
          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">⚡</div>
              <h3 ngxsmkCardTitle>{{ 'docs.pillarZoneless' | translate }}</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                {{ 'docs.pillarZonelessDesc' | translate }}
              </p>
            </div>
          </ngxsmk-card>

          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">◇</div>
              <h3 ngxsmkCardTitle>{{ 'docs.pillarCopyPaste' | translate }}</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                {{ 'docs.pillarCopyPasteDesc' | translate }}
              </p>
            </div>
          </ngxsmk-card>

          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">🎨</div>
              <h3 ngxsmkCardTitle>{{ 'docs.pillarHslEngine' | translate }}</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                {{ 'docs.pillarHslEngineDesc' | translate }}
              </p>
            </div>
          </ngxsmk-card>

          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">✦</div>
              <h3 ngxsmkCardTitle>{{ 'docs.pillarAiFirst' | translate }}</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                {{ 'docs.pillarAiFirstDesc' | translate }}
              </p>
            </div>
          </ngxsmk-card>
        </div>
      </section>

      <!-- AI TOOLING SECTION -->
      <section class="docs-section-card" style="margin-bottom: 3rem;">
        <div class="docs-grid-two">
          <div>
            <ngxsmk-heading level="h2" class="docs-section-title">{{
              'docs.aiTooling' | translate
            }}</ngxsmk-heading>
            <p class="docs-text">
              {{ 'docs.aiToolingDesc' | translate }}
            </p>
            <div class="docs-features-checklist">
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>{{ 'docs.aiToolingMcp' | translate }}</span>
              </div>
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span
                  >{{ 'docs.aiToolingLlms' | translate }} —
                  <a href="/llms.txt" target="_blank" rel="noopener">llms.txt</a> ·
                  <a href="/llms-full.txt" target="_blank" rel="noopener">llms-full.txt</a></span
                >
              </div>
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>{{ 'docs.aiToolingClients' | translate }}</span>
              </div>
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>{{ 'docs.aiToolingInstall' | translate }}</span>
              </div>
            </div>
          </div>

          <div class="docs-terminal-container">
            <div class="docs-terminal">
              <div class="terminal-header">
                <div class="terminal-dots"><i></i><i></i><i></i></div>
                <span class="terminal-title">bash — claude code</span>
              </div>
              <div class="terminal-body">
                <span class="terminal-prompt">$</span>
                <code class="terminal-code">claude mcp add ngxsmk -- npx &#64;ngxsmk/mcp</code>
                <button class="terminal-copy-btn" (click)="copyCommand('mcp')">
                  {{ (copiedMCP() ? 'docs.copied' : 'docs.copy') | translate }}
                </button>
              </div>
            </div>
            <p class="docs-terminal-note">{{ 'docs.aiToolingInstallNote' | translate }}</p>
          </div>
        </div>
      </section>

      <!-- INTERACTIVE PREVIEW & ACCENT WORKSPACE -->
      <section class="docs-section-card" style="margin-bottom: 3rem;">
        <div class="docs-grid-two">
          <div>
            <ngxsmk-heading level="h2" class="docs-section-title">{{
              'docs.tokenTheming' | translate
            }}</ngxsmk-heading>
            <p class="docs-text">
              {{ 'docs.tokenThemingDesc' | translate }}
            </p>

            <div class="theme-preset-selector">
              <span class="preset-label">{{ 'docs.chooseAccent' | translate }}</span>
              <div class="preset-buttons">
                <button
                  class="preset-btn violet"
                  [class.active]="accentColor() === 'violet'"
                  (click)="accentColor.set('violet')"
                >
                  {{ 'docs.accentViolet' | translate }}
                </button>
                <button
                  class="preset-btn emerald"
                  [class.active]="accentColor() === 'emerald'"
                  (click)="accentColor.set('emerald')"
                >
                  {{ 'docs.accentEmerald' | translate }}
                </button>
                <button
                  class="preset-btn rose"
                  [class.active]="accentColor() === 'rose'"
                  (click)="accentColor.set('rose')"
                >
                  {{ 'docs.accentRose' | translate }}
                </button>
                <button
                  class="preset-btn amber"
                  [class.active]="accentColor() === 'amber'"
                  (click)="accentColor.set('amber')"
                >
                  {{ 'docs.accentAmber' | translate }}
                </button>
                <button
                  class="preset-btn blue"
                  [class.active]="accentColor() === 'blue'"
                  (click)="accentColor.set('blue')"
                >
                  {{ 'docs.accentBlue' | translate }}
                </button>
              </div>
            </div>

            <div class="docs-playground-controls">
              <div class="control-row">
                <label for="progress-range">{{
                  'docs.simulateProgress' | translate: { value: playgroundProgress() }
                }}</label>
                <input
                  id="progress-range"
                  type="range"
                  min="0"
                  max="100"
                  [value]="playgroundProgress()"
                  (input)="updateProgress($event)"
                />
              </div>
            </div>
          </div>

          <div class="docs-preview-sandbox">
            <!-- Sandbox preview card containing components with dynamically overridden variables -->
            <div
              class="sandbox-card"
              [style.--ngxsmk-color-primary]="getAccentColorHex()"
              [style.--ngxsmk-color-ring]="getAccentColorHex()"
            >
              <div class="sandbox-header">
                <ngxsmk-tag>{{ 'docs.liveSandbox' | translate }}</ngxsmk-tag>
                <ngxsmk-switch
                  [checked]="playgroundSwitch()"
                  (checkedChange)="playgroundSwitch.set($event)"
                  >{{ 'docs.state' | translate }}</ngxsmk-switch
                >
              </div>

              <div class="sandbox-body">
                <h4 class="sandbox-item-title">{{ 'docs.adaptiveStack' | translate }}</h4>

                <ngxsmk-progress
                  [value]="playgroundProgress()"
                  style="margin-bottom: 1.5rem;"
                ></ngxsmk-progress>

                <div class="sandbox-buttons">
                  <button ngxsmk-button [disabled]="!playgroundSwitch()">
                    {{ 'docs.applyAction' | translate }}
                  </button>
                  <button ngxsmk-button variant="outline">{{ 'docs.reset' | translate }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ACCORDION FAQ SECTION -->
      <section style="margin-bottom: 4rem;">
        <ngxsmk-heading level="h2" class="docs-subheading" style="margin-bottom: 1.5rem;">
          {{ 'docs.faqTitle' | translate }}
        </ngxsmk-heading>
        <ngxsmk-accordion [multiple]="true">
          <ngxsmk-accordion-item [label]="'docs.faqZonelessLabel' | translate">
            {{ 'docs.faqZonelessAnswer' | translate }}
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item [label]="'docs.faqTailwindLabel' | translate">
            {{ 'docs.faqTailwindAnswer' | translate }}
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item [label]="'docs.faqCopyPasteLabel' | translate">
            {{ 'docs.faqCopyPasteAnswer' | translate }}
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item [label]="'docs.faqAiLabel' | translate">
            {{ 'docs.faqAiAnswer' | translate }}
          </ngxsmk-accordion-item>
        </ngxsmk-accordion>
      </section>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      min-height: calc(100vh - 3.5rem);
    }

    .docs-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: var(--ngxsmk-space-12, 3rem) var(--ngxsmk-space-6, 1.5rem);
      position: relative;
      z-index: 1;
      font-family: 'DM Sans', var(--ngxsmk-font-sans, system-ui), sans-serif;
    }

    .docs-header {
      margin-bottom: var(--ngxsmk-space-10, 2.5rem);
      text-align: left;
    }
    .docs-badges {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .docs-badge {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
    }
    ngxsmk-heading.docs-title {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-display-md-size);
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .docs-subtitle {
      font-size: var(--ngxsmk-text-title-md-size);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      margin: 0;
      line-height: 1.5;
      max-width: 640px;
    }

    .docs-section-card {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      padding: var(--ngxsmk-space-8, 2rem);
      box-shadow: var(--ngxsmk-shadow-md);
      margin-bottom: 2.5rem;
    }

    .docs-grid-two {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      gap: 2.5rem;
      align-items: center;
    }
    @media (max-width: 768px) {
      .docs-grid-two {
        grid-template-columns: minmax(0, 1fr);
        gap: 1.75rem;
      }
      .docs-container {
        padding: var(--ngxsmk-space-8, 2rem) var(--ngxsmk-space-4, 1rem);
      }
      .docs-section-card {
        padding: var(--ngxsmk-space-5, 1.25rem);
      }
    }

    ngxsmk-heading.docs-section-title {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.75rem;
      color: var(--ngxsmk-color-on-surface);
    }

    .docs-text {
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.6;
      margin: 0 0 1.25rem;
    }

    .docs-features-checklist {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .checklist-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface);
    }
    .checklist-icon {
      color: #10b981;
      font-weight: bold;
    }

    /* Terminal Widget */
    .docs-terminal-container {
      display: flex;
      flex-direction: column;
    }
    .docs-terminal {
      background: #09090b;
      border-radius: var(--ngxsmk-radius-lg);
      border: 1px solid rgba(255, 255, 255, 0.08);
      overflow: hidden;
    }
    .terminal-header {
      background: rgba(255, 255, 255, 0.04);
      padding: 0.5rem 0.75rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .terminal-dots {
      display: flex;
      gap: 5px;
    }
    .terminal-dots i {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
    }
    .terminal-dots i:first-child {
      background: #ef4444;
    }
    .terminal-dots i:nth-child(2) {
      background: #f59e0b;
    }
    .terminal-dots i:nth-child(3) {
      background: #10b981;
    }
    .terminal-title {
      font-size: var(--ngxsmk-text-body-xs-size);
      color: rgba(255, 255, 255, 0.4);
      font-family: var(--ngxsmk-font-mono);
    }
    .terminal-body {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.625rem;
    }
    .terminal-prompt {
      color: var(--ngxsmk-color-primary);
      font-weight: bold;
      user-select: none;
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .terminal-code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-sm-size);
      color: rgba(255, 255, 255, 0.85);
      flex: 1;
      white-space: nowrap;
      overflow-x: auto;
    }
    .terminal-copy-btn {
      background: rgba(255, 255, 255, 0.06);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: var(--ngxsmk-radius-md);
      color: rgba(255, 255, 255, 0.7);
      padding: 0.2rem 0.5rem;
      font-size: var(--ngxsmk-text-body-xs-size);
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s;
    }
    .terminal-copy-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }
    .docs-terminal-note {
      margin: 0.625rem 0 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-muted, rgba(255, 255, 255, 0.45));
    }

    /* Pillars Grid */
    ngxsmk-heading.docs-subheading {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 1rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .docs-pillars-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4);
    }
    .pillar-card {
      transition:
        transform 0.2s,
        box-shadow 0.2s;
    }
    .pillar-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--ngxsmk-shadow-md);
    }
    .pillar-icon {
      font-size: var(--ngxsmk-text-headline-sm-size);
      margin-bottom: 0.5rem;
    }
    .docs-card-text {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.55;
      margin: 0;
    }

    /* Theme presets workspace */
    .theme-preset-selector {
      margin-bottom: 1.25rem;
    }
    .preset-label {
      display: block;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .preset-buttons {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .preset-btn {
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: var(--ngxsmk-radius-md);
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition: all 0.15s;
    }
    .preset-btn:hover {
      color: var(--ngxsmk-color-on-surface);
      background: var(--ngxsmk-color-surface-hover);
    }
    .preset-btn.active {
      border-color: transparent;
      color: #fff;
    }
    .preset-btn.violet.active {
      background: #7c3aed;
    }
    .preset-btn.emerald.active {
      background: #059669;
    }
    .preset-btn.rose.active {
      background: #e11d48;
    }
    .preset-btn.amber.active {
      background: #d97706;
    }
    .preset-btn.blue.active {
      background: #2563eb;
    }

    .docs-playground-controls {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1.25rem;
    }
    .control-row {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .control-row label {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .control-row input[type='range'] {
      width: 100%;
      accent-color: var(--ngxsmk-color-primary);
      cursor: pointer;
    }

    /* Sandbox preview container */
    .docs-preview-sandbox {
      display: flex;
      align-items: center;
      justify-content: center;
      perspective: 1000px;
    }
    .sandbox-card {
      width: 100%;
      max-width: 320px;
      background: var(--ngxsmk-color-surface-variant);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      box-shadow: var(--ngxsmk-shadow-lg);
      overflow: hidden;
      transition: transform 0.3s;
    }
    .sandbox-card:hover {
      transform: translateY(-2px) rotateX(1deg);
    }
    .sandbox-header {
      background: rgba(0, 0, 0, 0.03);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }
    .sandbox-body {
      padding: 1.25rem 1rem;
    }
    .sandbox-item-title {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 700;
      margin: 0 0 1rem;
      color: var(--ngxsmk-color-on-surface);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .sandbox-buttons {
      display: flex;
      gap: 0.5rem;
    }
  `,
})
export class DocsPage {
  protected readonly version = APP_VERSION;
  accentColor = signal<'violet' | 'emerald' | 'rose' | 'amber' | 'blue'>('violet');
  playgroundProgress = signal(65);
  playgroundSwitch = signal(true);
  copiedNPM = signal(false);
  copiedCLI = signal(false);
  copiedMCP = signal(false);

  copyCommand(type: 'npm' | 'cli' | 'mcp') {
    const commands = {
      npm: 'npm install @ngxsmk/core @ngxsmk/theme',
      cli: 'npx ngxsmk add button',
      mcp: 'claude mcp add ngxsmk -- npx @ngxsmk/mcp',
    };
    const flags = { npm: this.copiedNPM, cli: this.copiedCLI, mcp: this.copiedMCP };
    navigator.clipboard.writeText(commands[type]).then(() => {
      flags[type].set(true);
      setTimeout(() => flags[type].set(false), 2000);
    });
  }

  getAccentColorHex() {
    const colors = {
      violet: '#7C3AED',
      emerald: '#059669',
      rose: '#E11D48',
      amber: '#D97706',
      blue: '#2563EB',
    };
    return colors[this.accentColor()];
  }

  updateProgress(event: Event) {
    const input = event.target as HTMLInputElement;
    this.playgroundProgress.set(Number(input.value));
  }
}
