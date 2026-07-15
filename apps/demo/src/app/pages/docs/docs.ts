import { Component, signal } from '@angular/core';
import { AppNav } from '../../nav/nav';
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

@Component({
  selector: 'docs-page',
  standalone: true,
  imports: [
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
  ],
  template: `
    <app-nav />

    <div class="docs-hero-bg">
      <div class="docs-hero-bg__glow docs-hero-bg__glow--1"></div>
      <div class="docs-hero-bg__glow docs-hero-bg__glow--2"></div>
    </div>

    <div class="docs-container">
      <!-- HERO HEADER -->
      <header class="docs-header">
        <div class="docs-badges">
          <ngxsmk-tag class="docs-badge">v0.0.1</ngxsmk-tag>
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
        <h1 class="docs-title">Developer Portal</h1>
        <p class="docs-subtitle">
          A high-performance design system designed for modern standalone Angular apps.
        </p>
      </header>

      <!-- QUICK INSTALL & TERMINAL SECTION -->
      <section class="docs-section-card">
        <div class="docs-grid-two">
          <div class="docs-install-info">
            <h2 class="docs-section-title">Quick Start</h2>
            <p class="docs-text">
              Install core packages and the design engine. You can copy the code directly into your
              terminal to start immediately.
            </p>
            <div class="docs-features-checklist">
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>Zero external runtime dependencies.</span>
              </div>
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>Fully optimized for Server-Side Rendering (SSR).</span>
              </div>
              <div class="checklist-item">
                <span class="checklist-icon">✓</span>
                <span>Engineered with native standard Web APIs.</span>
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
                  {{ copiedNPM() ? 'Copied!' : 'Copy' }}
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
                  {{ copiedCLI() ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ARCHITECTURE PILLARS GRID -->
      <section style="margin-bottom: 3rem;">
        <h2 class="docs-subheading">Core Pillars</h2>
        <div class="docs-pillars-grid">
          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">⚡</div>
              <h3 ngxsmkCardTitle>Zoneless Reactivity</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                Fully decoupled from Zone.js. Components trigger standard change detection cycles
                via native signal notification trees for peak performance.
              </p>
            </div>
          </ngxsmk-card>

          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">◇</div>
              <h3 ngxsmkCardTitle>Copy-Paste Scaffolding</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                Directly own the source code. Component modules are scaffolded into your app files,
                leaving zero bloated dependencies behind in node_modules.
              </p>
            </div>
          </ngxsmk-card>

          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">🎨</div>
              <h3 ngxsmkCardTitle>HSL Variable Engine</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                Configure global aesthetics in HSL coordinates. Easily generate style outputs
                compatible with vanilla CSS, SCSS, or Tailwind configurations.
              </p>
            </div>
          </ngxsmk-card>

          <ngxsmk-card class="pillar-card">
            <div ngxsmkCardHeader>
              <div class="pillar-icon">✦</div>
              <h3 ngxsmkCardTitle>AI-First Layouts</h3>
            </div>
            <div ngxsmkCardContent>
              <p class="docs-card-text">
                Ship specialized interfaces built for AI streaming, reasoning timelines, custom code
                editors, and floating card citation viewers.
              </p>
            </div>
          </ngxsmk-card>
        </div>
      </section>

      <!-- INTERACTIVE PREVIEW & ACCENT WORKSPACE -->
      <section class="docs-section-card" style="margin-bottom: 3rem;">
        <div class="docs-grid-two">
          <div>
            <h2 class="docs-section-title">Token Theming</h2>
            <p class="docs-text">
              Dynamic themes are powered by CSS Custom Properties. Click the color presets below to
              see the interactive sandbox component instantaneously adapt to the new theme
              variables.
            </p>

            <div class="theme-preset-selector">
              <span class="preset-label">Choose Accent:</span>
              <div class="preset-buttons">
                <button
                  class="preset-btn violet"
                  [class.active]="accentColor() === 'violet'"
                  (click)="accentColor.set('violet')"
                >
                  Violet
                </button>
                <button
                  class="preset-btn emerald"
                  [class.active]="accentColor() === 'emerald'"
                  (click)="accentColor.set('emerald')"
                >
                  Emerald
                </button>
                <button
                  class="preset-btn rose"
                  [class.active]="accentColor() === 'rose'"
                  (click)="accentColor.set('rose')"
                >
                  Rose
                </button>
                <button
                  class="preset-btn amber"
                  [class.active]="accentColor() === 'amber'"
                  (click)="accentColor.set('amber')"
                >
                  Amber
                </button>
                <button
                  class="preset-btn blue"
                  [class.active]="accentColor() === 'blue'"
                  (click)="accentColor.set('blue')"
                >
                  Blue
                </button>
              </div>
            </div>

            <div class="docs-playground-controls">
              <div class="control-row">
                <label for="progress-range">Simulate progress: ({{ playgroundProgress() }}%)</label>
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
                <ngxsmk-tag>Live Sandbox</ngxsmk-tag>
                <ngxsmk-switch
                  [checked]="playgroundSwitch()"
                  (checkedChange)="playgroundSwitch.set($event)"
                  >State</ngxsmk-switch
                >
              </div>

              <div class="sandbox-body">
                <h4 class="sandbox-item-title">Adaptive Component Stack</h4>

                <ngxsmk-progress
                  [value]="playgroundProgress()"
                  style="margin-bottom: 1.5rem;"
                ></ngxsmk-progress>

                <div class="sandbox-buttons">
                  <button ngxsmk-button [disabled]="!playgroundSwitch()">Apply Action</button>
                  <button ngxsmk-button variant="outline">Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ACCORDION FAQ SECTION -->
      <section style="margin-bottom: 4rem;">
        <h2 class="docs-subheading" style="margin-bottom: 1.5rem;">Frequently Asked Questions</h2>
        <ngxsmk-accordion [multiple]="true">
          <ngxsmk-accordion-item label="Is NGXSMK fully Zoneless?">
            Yes! All components are designed from the ground up to operate without Zone.js. They
            utilize Angular's modern Signal APIs for lightweight, fine-grained reactivity, leading
            to much smaller bundle footprints and better runtime performance.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="Can I use it with Tailwind CSS?">
            Absolutely. NGXSMK's token engine exposes CSS custom properties (variables) that can be
            easily mapped in your tailwind.config.js. The design parameters are completely decoupled
            from any single utility framework.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="How does the copy-paste DX model work?">
            Instead of importing bloated pre-compiled modules, our CLI tool allows you to copy
            component source code directly into your workspace. You retain complete ownership,
            styling control, and structural flexibility.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="What AI layout modules are included?">
            We provide specialized interfaces built for AI chat applications, such as scroll-locked
            chat bubbles, streaming text responses, Reasoning Timelines, and formatted Citation card
            lists.
          </ngxsmk-accordion-item>
        </ngxsmk-accordion>
      </section>
    </div>
  `,
  styles: `
    .docs-hero-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 480px;
      overflow: hidden;
      pointer-events: none;
      z-index: 0;
    }
    .docs-hero-bg__glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      opacity: 0.15;
    }
    .docs-hero-bg__glow--1 {
      top: -10%;
      left: 10%;
      width: 400px;
      height: 400px;
      background: var(--ngxsmk-color-primary);
    }
    .docs-hero-bg__glow--2 {
      top: 5%;
      right: 15%;
      width: 300px;
      height: 300px;
      background: #10b981;
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
      font-size: 0.7rem;
      font-weight: 600;
    }
    .docs-title {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.15;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
    .docs-subtitle {
      font-size: 1.1rem;
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
      grid-template-columns: 1.2fr 1fr;
      gap: 2.5rem;
      align-items: center;
    }
    @media (max-width: 768px) {
      .docs-grid-two {
        grid-template-columns: 1fr;
        gap: 1.75rem;
      }
    }

    .docs-section-title {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0 0 0.75rem;
      color: var(--ngxsmk-color-on-surface);
    }

    .docs-text {
      font-size: 0.875rem;
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
      font-size: 0.8125rem;
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
      font-size: 0.6875rem;
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
      font-size: 0.8125rem;
    }
    .terminal-code {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.8125rem;
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
      font-size: 0.6875rem;
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s;
    }
    .terminal-copy-btn:hover {
      background: rgba(255, 255, 255, 0.12);
      color: #fff;
    }

    /* Pillars Grid */
    .docs-subheading {
      font-family: 'Outfit', var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 1.625rem;
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
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .docs-card-text {
      font-size: 0.8125rem;
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
      font-size: 0.75rem;
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
      font-size: 0.75rem;
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
      font-size: 0.75rem;
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
      font-size: 0.8125rem;
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
  accentColor = signal<'violet' | 'emerald' | 'rose' | 'amber' | 'blue'>('violet');
  playgroundProgress = signal(65);
  playgroundSwitch = signal(true);
  copiedNPM = signal(false);
  copiedCLI = signal(false);

  copyCommand(type: 'npm' | 'cli') {
    const cmd = type === 'npm' ? 'npm install @ngxsmk/core @ngxsmk/theme' : 'npx ngxsmk add button';
    navigator.clipboard.writeText(cmd).then(() => {
      if (type === 'npm') {
        this.copiedNPM.set(true);
        setTimeout(() => this.copiedNPM.set(false), 2000);
      } else {
        this.copiedCLI.set(true);
        setTimeout(() => this.copiedCLI.set(false), 2000);
      }
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
