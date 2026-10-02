import { Component, signal, inject, computed } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { APP_VERSION } from '../../core/version';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkAccordion, NgxsmkAccordionItem } from '@ngxsmk/core/accordion';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { ShowcaseExample } from '../../showcase/showcase-example';
import { NgxsmkThemeService } from '@ngxsmk/theme';

@Component({
  selector: 'docs-page',
  standalone: true,
  imports: [
    TranslatePipe,
    AppNav,
    NgxsmkButton,
    NgxsmkHeading,
    NgxsmkBadge,
    NgxsmkAccordion,
    NgxsmkAccordionItem,
    NgxsmkSwitch,
    NgxsmkProgress,
    ShowcaseExample,
  ],
  template: `
    <app-nav />

    <div class="d">
      <!-- ═══════════════════════ HERO ═══════════════════════ -->
      <header class="d-hero">
        <div class="d-hero__inner">
          <div class="version-badge">
            <span class="pulse-dot"></span>
            <span class="badge-tag">v{{ version }}</span>
            <span class="badge-divider">·</span>
            <span class="badge-text">Interactive Documentation</span>
          </div>
          <h1 class="d-hero__title">Build with <span class="highlight">NGXSMK</span></h1>
          <p class="d-hero__sub">
            A signal-native, zoneless Angular component library with a universal design-token
            engine. Ship production-grade UIs faster with copy-paste components and AI tooling.
          </p>
          <div class="d-hero__stats">
            <div class="d-hero__stat">
              <span class="d-hero__stat-val">150+</span>
              <span class="d-hero__stat-label">Components</span>
            </div>
            <div class="d-hero__stat">
              <span class="d-hero__stat-val">v{{ version }}</span>
              <span class="d-hero__stat-label">Latest</span>
            </div>
            <div class="d-hero__stat">
              <span class="d-hero__stat-val">0</span>
              <span class="d-hero__stat-label">Runtime deps</span>
            </div>
            <div class="d-hero__stat">
              <span class="d-hero__stat-val">AI</span>
              <span class="d-hero__stat-label">Native</span>
            </div>
          </div>
        </div>
      </header>

      <!-- ═══════════════════════ GETTING STARTED (4-STEP ONBOARDING) ═══════════════════════ -->
      <section class="d-card d-card--highlight">
        <div class="d-card__header-box">
          <ngxsmk-heading level="h2">Getting Started</ngxsmk-heading>
          <p class="d-body">
            Follow this 4-step guide to integrate NGXSMK UI Kit into any modern Angular 19+
            standalone application in under 2 minutes.
          </p>
        </div>

        <div class="d-steps-grid">
          <!-- Step 1 -->
          <div class="d-step-card">
            <div class="d-step-card__head">
              <span class="d-step-number">1</span>
              <h3 class="d-step-title">Install Core Packages</h3>
            </div>
            <p class="d-step-desc">
              Install the component library and theme token engine with zero bloated external
              dependencies.
            </p>
            <div class="d-terminal">
              <div class="d-terminal__head">
                <div class="d-terminal__dots"><i></i><i></i><i></i></div>
                <span class="d-terminal__label">bash</span>
              </div>
              <div class="d-terminal__body">
                <span class="d-terminal__prompt">$</span>
                <code class="d-terminal__code">npm install &#64;ngxsmk/core &#64;ngxsmk/theme</code>
                <button
                  class="d-terminal__copy"
                  (click)="copy('npm')"
                  [attr.aria-label]="'Copy command'"
                >
                  @if (copiedNPM()) {
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8l3 3 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  } @else {
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect
                        x="5"
                        y="5"
                        width="7"
                        height="7"
                        rx="1.5"
                        stroke="currentColor"
                        stroke-width="1.3"
                      />
                      <path
                        d="M3 10V3.5A.5.5 0 0 1 3.5 3H10"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                      />
                    </svg>
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- Step 2 -->
          <div class="d-step-card">
            <div class="d-step-card__head">
              <span class="d-step-number">2</span>
              <h3 class="d-step-title">Include Design Tokens</h3>
            </div>
            <p class="d-step-desc">
              Import the universal design tokens in your global <code>styles.scss</code> or
              <code>angular.json</code>.
            </p>
            <div class="d-terminal">
              <div class="d-terminal__head">
                <div class="d-terminal__dots"><i></i><i></i><i></i></div>
                <span class="d-terminal__label">styles.scss</span>
              </div>
              <div class="d-terminal__body">
                <code class="d-terminal__code"
                  >&#64;import '&#64;ngxsmk/theme/css/tokens.css';</code
                >
                <button
                  class="d-terminal__copy"
                  (click)="copy('theme')"
                  [attr.aria-label]="'Copy theme import'"
                >
                  @if (copiedTheme()) {
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8l3 3 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  } @else {
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect
                        x="5"
                        y="5"
                        width="7"
                        height="7"
                        rx="1.5"
                        stroke="currentColor"
                        stroke-width="1.3"
                      />
                      <path
                        d="M3 10V3.5A.5.5 0 0 1 3.5 3H10"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                      />
                    </svg>
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- Step 3 -->
          <div class="d-step-card">
            <div class="d-step-card__head">
              <span class="d-step-number">3</span>
              <h3 class="d-step-title">Import Standalone Components</h3>
            </div>
            <p class="d-step-desc">
              Every component is standalone. Import only what you use with secondary entry points.
            </p>
            <div class="d-terminal">
              <div class="d-terminal__head">
                <div class="d-terminal__dots"><i></i><i></i><i></i></div>
                <span class="d-terminal__label">app.component.ts</span>
              </div>
              <div class="d-terminal__body">
                <code class="d-terminal__code"
                  >import &#123; NgxsmkButton &#125; from '&#64;ngxsmk/core/button';</code
                >
                <button
                  class="d-terminal__copy"
                  (click)="copy('import')"
                  [attr.aria-label]="'Copy import'"
                >
                  @if (copiedImport()) {
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8l3 3 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  } @else {
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect
                        x="5"
                        y="5"
                        width="7"
                        height="7"
                        rx="1.5"
                        stroke="currentColor"
                        stroke-width="1.3"
                      />
                      <path
                        d="M3 10V3.5A.5.5 0 0 1 3.5 3H10"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                      />
                    </svg>
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- Step 4 -->
          <div class="d-step-card">
            <div class="d-step-card__head">
              <span class="d-step-number">4</span>
              <h3 class="d-step-title">Build &amp; Render UI</h3>
            </div>
            <p class="d-step-desc">
              Apply component directives or elements in your template with signals and OnPush change
              detection.
            </p>
            <div class="d-terminal">
              <div class="d-terminal__head">
                <div class="d-terminal__dots"><i></i><i></i><i></i></div>
                <span class="d-terminal__label">template.html</span>
              </div>
              <div class="d-terminal__body">
                <code class="d-terminal__code"
                  >&lt;button ngxsmk-button&gt;Get Started&lt;/button&gt;</code
                >
                <button
                  class="d-terminal__copy"
                  (click)="copy('template')"
                  [attr.aria-label]="'Copy template'"
                >
                  @if (copiedTemplate()) {
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8l3 3 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  } @else {
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect
                        x="5"
                        y="5"
                        width="7"
                        height="7"
                        rx="1.5"
                        stroke="currentColor"
                        stroke-width="1.3"
                      />
                      <path
                        d="M3 10V3.5A.5.5 0 0 1 3.5 3H10"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                      />
                    </svg>
                  }
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════ ARCHITECTURE ═══════════════════════ -->
      <section class="d-arch">
        <ngxsmk-heading level="h2" class="d-heading">Architecture</ngxsmk-heading>
        <p class="d-body d-body--center">
          Three layers, each independently usable. The CDK is pure TypeScript, Core adds the Angular
          shell, and Theme provides the design-token engine.
        </p>
        <div class="d-arch__grid">
          <div class="d-arch__layer d-arch__layer--cdk">
            <div class="d-arch__layer-tag">CDK</div>
            <h3 class="d-arch__layer-name">Behavior Primitives</h3>
            <p class="d-arch__layer-desc">
              Pure TypeScript. CVA base, form models, focus management, keyboard navigation, and
              animation helpers — no Angular dependency.
            </p>
            <div class="d-arch__layer-pkg">
              <code>@ngxsmk/cdk</code>
            </div>
          </div>
          <div class="d-arch__connector">
            <svg viewBox="0 0 24 40" fill="none" width="24" height="40">
              <path
                d="M12 0v40M5 33l7 7 7-7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="d-arch__layer d-arch__layer--core">
            <div class="d-arch__layer-tag">Core</div>
            <h3 class="d-arch__layer-name">Angular Components</h3>
            <p class="d-arch__layer-desc">
              150+ standalone components. Signal inputs, template outlets via InjectionTokens,
              token-driven styling, and optional motion.dev integration.
            </p>
            <div class="d-arch__layer-pkg">
              <code>@ngxsmk/core/*</code>
            </div>
          </div>
          <div class="d-arch__connector">
            <svg viewBox="0 0 24 40" fill="none" width="24" height="40">
              <path
                d="M12 0v40M5 33l7 7 7-7"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="d-arch__layer d-arch__layer--theme">
            <div class="d-arch__layer-tag">Theme</div>
            <h3 class="d-arch__layer-name">Design-Token Engine</h3>
            <p class="d-arch__layer-desc">
              HSL coordinates → CSS custom properties. Supports vanilla CSS, SCSS, Tailwind v3
              preset, v4 theme, and Ionic adapter. Dark mode via <code>.dark</code> class.
            </p>
            <div class="d-arch__layer-pkg">
              <code>@ngxsmk/theme</code>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════ CORE PILLARS ═══════════════════════ -->
      <section class="d-pillars">
        <ngxsmk-heading level="h2" class="d-heading">Core Pillars</ngxsmk-heading>
        <div class="d-pillars__grid">
          <div class="d-pillar">
            <div class="d-pillar__icon d-pillar__icon--zoneless">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <path
                  d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h3 class="d-pillar__title">Zoneless Reactivity</h3>
            <p class="d-pillar__desc">
              Fully decoupled from Zone.js. Native signal notification trees for fine-grained change
              detection — smaller bundles, faster runtime.
            </p>
          </div>
          <div class="d-pillar">
            <div class="d-pillar__icon d-pillar__icon--copy">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <rect
                  x="8"
                  y="8"
                  width="12"
                  height="12"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
              </svg>
            </div>
            <h3 class="d-pillar__title">Copy-Paste Scaffolding</h3>
            <p class="d-pillar__desc">
              CLI copies component source into your workspace. You own the code — zero bloated
              node_modules, full control over every line.
            </p>
          </div>
          <div class="d-pillar">
            <div class="d-pillar__icon d-pillar__icon--theme">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="1.5" />
                <path
                  d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3 class="d-pillar__title">Universal Token Engine</h3>
            <p class="d-pillar__desc">
              HSL coordinates → CSS custom properties. Outputs for vanilla CSS, SCSS, Tailwind v3
              preset, v4 theme, and Ionic adapter.
            </p>
          </div>
          <div class="d-pillar">
            <div class="d-pillar__icon d-pillar__icon--ai">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <path
                  d="M12 2a4 4 0 0 1 4 4v2a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4z"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M16 14h.01M8 14h.01M12 22c-4 0-7-2-7-4v-2c0-2 3-4 7-4s7 2 7 4v2c0 2-3 4-7 4z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3 class="d-pillar__title">AI-First Tooling</h3>
            <p class="d-pillar__desc">
              MCP component database, LLM-readable docs, and a Claude Code skill. Every component
              ships with JSDoc-powered AI context.
            </p>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════ TOKEN THEMING PLAYGROUND ═══════════════════════ -->
      <section class="d-card">
        <div class="d-card__split">
          <div class="d-card__left">
            <ngxsmk-heading level="h2">Token Theming</ngxsmk-heading>
            <p class="d-body">
              Every component reads from <code>--ngxsmk-*</code> CSS custom properties. Switch the
              accent below and watch the entire sandbox update in real time — zero rebuild needed.
            </p>

            <div class="d-accent-row">
              <span class="d-accent-label">Accent</span>
              <div class="d-accent-pills">
                @for (c of accentList; track c.name) {
                  <button
                    class="d-accent-pill"
                    [class.d-accent-pill--active]="activeAccent() === c.name"
                    [style.--pill-bg]="c.hex"
                    (click)="setAccent(c.name)"
                  >
                    <span class="d-accent-pill__dot" [style.background]="c.hex"></span>
                    {{ c.label }}
                  </button>
                }
              </div>
            </div>

            <div class="d-control">
              <label class="d-control__label" for="d-progress">Progress: {{ progress() }}%</label>
              <input
                id="d-progress"
                class="d-control__range"
                type="range"
                min="0"
                max="100"
                [value]="progress()"
                (input)="onProgress($event)"
              />
            </div>
          </div>

          <div class="d-card__right">
            <div
              class="d-sandbox"
              [style.--ngxsmk-color-primary]="accentHex()"
              [style.--ngxsmk-color-ring]="accentHex()"
            >
              <div class="d-sandbox__head">
                <ngxsmk-badge>Live Sandbox</ngxsmk-badge>
                <ngxsmk-switch
                  [checked]="sandboxSwitch()"
                  (checkedChange)="sandboxSwitch.set($event)"
                >
                  State
                </ngxsmk-switch>
              </div>
              <div class="d-sandbox__body">
                <span class="d-sandbox__section-title">Adaptive Component Stack</span>
                <ngxsmk-progress [value]="progress()" style="margin-bottom: 1rem"></ngxsmk-progress>
                <div class="d-sandbox__row">
                  <button ngxsmk-button [disabled]="!sandboxSwitch()">Apply Action</button>
                  <button ngxsmk-button variant="outline">Reset</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════ CODE EXAMPLE ═══════════════════════ -->
      <section class="d-code-example">
        <ngxsmk-heading level="h2" class="d-heading">Component Usage</ngxsmk-heading>
        <p class="d-body d-body--center">
          Every component is a standalone Angular import. Signal inputs, template-driven, and
          token-customizable. Copy any example directly into your template.
        </p>
        <showcase-example
          title="Button"
          description="Primary action trigger with variant and disabled support."
          [code]="buttonExampleCode"
          [customize]="buttonCustomizeCode"
        >
        </showcase-example>
      </section>

      <!-- ═══════════════════════ AI TOOLING ═══════════════════════ -->
      <section class="d-ai">
        <div class="d-ai__header">
          <ngxsmk-heading level="h2" class="d-heading"
            >Built for AI-Assisted Development</ngxsmk-heading
          >
          <p class="d-body d-body--center">
            Connect the NGXSMK MCP server to give your AI assistant direct access to component
            search, API lookup, and LLM-readable documentation.
          </p>
        </div>

        <div class="d-ai__grid">
          <!-- MCP Server -->
          <div class="d-ai-card">
            <div class="d-ai-card__icon">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <rect
                  x="2"
                  y="3"
                  width="20"
                  height="14"
                  rx="2"
                  stroke="currentColor"
                  stroke-width="1.5"
                />
                <path
                  d="M8 21h8M12 17v4"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3 class="d-ai-card__title">MCP Server</h3>
            <p class="d-ai-card__desc">
              Component search, API lookup, and layout recommendations over stdio. Works with Claude
              Code, Cursor, VS Code, Cline, Roo Code, and Windsurf.
            </p>
            <div class="d-terminal d-terminal--compact">
              <div class="d-terminal__body">
                <span class="d-terminal__prompt">$</span>
                <code class="d-terminal__code">claude mcp add ngxsmk -- npx &#64;ngxsmk/mcp</code>
                <button class="d-terminal__copy" (click)="copy('mcp')">
                  @if (copiedMCP()) {
                    <svg viewBox="0 0 16 16" fill="none">
                      <path
                        d="M4 8l3 3 5-5"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  } @else {
                    <svg viewBox="0 0 16 16" fill="none">
                      <rect
                        x="5"
                        y="5"
                        width="7"
                        height="7"
                        rx="1.5"
                        stroke="currentColor"
                        stroke-width="1.3"
                      />
                      <path
                        d="M3 10V3.5A.5.5 0 0 1 3.5 3H10"
                        stroke="currentColor"
                        stroke-width="1.3"
                        stroke-linecap="round"
                      />
                    </svg>
                  }
                </button>
              </div>
            </div>
          </div>

          <!-- llms.txt -->
          <div class="d-ai-card">
            <div class="d-ai-card__icon">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <polyline
                  points="14 2 14 8 20 8"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <line
                  x1="16"
                  y1="13"
                  x2="8"
                  y2="13"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <line
                  x1="16"
                  y1="17"
                  x2="8"
                  y2="17"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
            </div>
            <h3 class="d-ai-card__title">LLM Documentation</h3>
            <p class="d-ai-card__desc">
              Machine-readable component index and API reference, generated from source. Feeds any
              LLM that supports structured context.
            </p>
            <div class="d-ai-card__links">
              <a href="/llms.txt" target="_blank" rel="noopener" class="d-link">llms.txt</a>
              <span class="d-ai-card__sep">·</span>
              <a href="/llms-full.txt" target="_blank" rel="noopener" class="d-link"
                >llms-full.txt</a
              >
            </div>
          </div>

          <!-- Claude Code Skill -->
          <div class="d-ai-card">
            <div class="d-ai-card__icon">
              <svg viewBox="0 0 24 24" fill="none" width="24" height="24">
                <path
                  d="M12 2l3 6 6.5 1-4.75 4.25L18 20l-6-3-6 3 1.25-6.75L3 9l6.5-1z"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <h3 class="d-ai-card__title">Claude Code Skill</h3>
            <p class="d-ai-card__desc">
              Canonical skill file for generating correct NGXSMK components. Covers imports, signal
              APIs, token usage, and dark mode conventions.
            </p>
            <div class="d-terminal d-terminal--compact">
              <div class="d-terminal__body">
                <span class="d-terminal__prompt">$</span>
                <code class="d-terminal__code">/plugin marketplace add NGXSMK/ngxsmk-ui-kit</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ═══════════════════════ FAQ ═══════════════════════ -->
      <section class="d-faq">
        <ngxsmk-heading level="h2" class="d-heading">Frequently Asked Questions</ngxsmk-heading>
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
          <ngxsmk-accordion-item label="How does dark mode work?">
            Dark mode uses a <code>.dark</code> class on the <code>&lt;html&gt;</code> element. All
            tokens are overridden under <code>:root.dark</code>. Components never hardcode colors —
            they always reference <code>--ngxsmk-*</code> custom properties, so dark mode is
            automatic.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="What about motion and animations?">
            NGXSMK supports <code>motion.dev</code> as an optional peer dependency. Every animation
            parameter is exposed as a signal input with smart defaults. When <code>motion</code> is
            not installed, directives no-op or fall back to CSS/manual JS.
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="Can I use it with Ionic?">
            Yes. Use <code>provideNgxsmkIonicTheme()</code> from <code>@ngxsmk/theme</code> next to
            <code>provideIonicAngular()</code>. It maps NGXSMK tokens to Ionic
            <code>--ion-*</code> CSS variables (via <code>ionicVarsAdapter</code>) so web and mobile
            shells share one palette. Prefer Ionic for navigation shells; use NGXSMK for dense
            product UI (tables, forms, AI chat).
          </ngxsmk-accordion-item>
          <ngxsmk-accordion-item label="How do I contribute?">
            Fork the repo, create a branch, and follow the component convention: single-file
            component, secondary entry point, token-driven styles, signal inputs, and JSDoc summary.
            Run <code>npm run lint</code> and <code>npm test</code> before opening a PR.
          </ngxsmk-accordion-item>
        </ngxsmk-accordion>
      </section>

      <!-- ═══════════════════════ FOOTER ═══════════════════════ -->
      <footer class="d-footer">
        <p class="d-footer__text">
          NGXSMK v{{ version }} · MIT License ·
          <a
            href="https://github.com/ngxsmk/ngxsmk-ui-kit"
            target="_blank"
            rel="noopener"
            class="d-link"
            >GitHub</a
          >
        </p>
      </footer>
    </div>
  `,
  styles: `
    :host {
      display: block;
      background: var(--ngxsmk-color-background, #fafafa);
      min-height: calc(100vh - 3.5rem);
    }

    .d {
      max-width: 1160px;
      margin: 0 auto;
      padding: 0 clamp(1.25rem, 4vw, 2rem) clamp(3rem, 8vw, 5rem);
      position: relative;
      z-index: 1;
    }

    /* ──── SHARED ──── */
    .d-heading {
      font-family: var(--ngxsmk-font-sans), system-ui, sans-serif;
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: 700;
      letter-spacing: -0.025em;
      margin: 0 0 1rem;
      color: var(--ngxsmk-color-on-surface);
    }

    .d-body {
      font-size: var(--ngxsmk-text-body-md-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.65;
      margin: 0 0 1.5rem;
      max-width: 640px;
    }
    .d-body--center {
      text-align: center;
      margin-left: auto;
      margin-right: auto;
    }
    .d-body code {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.9em;
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 10%, transparent);
      color: var(--ngxsmk-color-primary);
      padding: 0.1em 0.35em;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
    }

    /* ──── HERO ──── */
    .d-hero {
      position: relative;
      padding: clamp(3.5rem, 8vw, 5.5rem) 0 clamp(2.5rem, 5vw, 3.5rem);
      text-align: center;
    }
    .d-hero::before {
      content: '';
      position: absolute;
      inset: -8% -30% auto;
      height: 18rem;
      pointer-events: none;
      background: radial-gradient(
        50% 60% at 50% 0%,
        color-mix(in srgb, var(--ngxsmk-color-primary) 14%, transparent),
        transparent 72%
      );
    }
    .d-hero__inner {
      position: relative;
      max-width: 42rem;
      margin: 0 auto;
    }
    .d-hero__eyebrow {
      margin: 0;
      font-size: 0.75rem;
      font-weight: 650;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ngxsmk-color-primary);
    }
    .d-hero__title {
      font-family: var(--font-family-display, sans-serif);
      font-size: clamp(2.2rem, 5vw, 3.5rem);
      font-weight: 750;
      letter-spacing: -0.038em;
      line-height: 1.1;
      margin: 1rem 0 0.85rem;
      color: var(--color-text-main, #0f172a);
    }
    .d-hero__title-accent {
      color: var(--brand-primary, #6366f1);
    }
    .d-hero__sub {
      font-size: 1.0625rem;
      color: var(--color-text-muted, #334155);
      line-height: 1.65;
      margin: 0 auto 2rem;
      max-width: 36rem;
    }
    .d-hero__stats {
      display: flex;
      justify-content: center;
      gap: clamp(1.25rem, 4vw, 2.5rem);
      flex-wrap: wrap;
      padding-top: 0.5rem;
      border-top: 1px solid var(--color-border, #e2e8f0);
      max-width: 28rem;
      margin: 0 auto;
    }
    .d-hero__stat {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.35rem;
      padding-top: 1rem;
    }
    .d-hero__stat-val {
      font-family: var(--font-family-display, sans-serif);
      font-size: 1.35rem;
      font-weight: 750;
      letter-spacing: -0.03em;
      line-height: 1.2;
      color: var(--color-text-main, #0f172a);
    }
    .d-hero__stat-label {
      font-size: 0.7rem;
      color: var(--color-text-muted, #334155);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
      line-height: 1.3;
    }

    /* ──── CARD ──── */
    .d-card {
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-xl, 22px);
      padding: clamp(1.5rem, 3.5vw, 2.25rem);
      box-shadow: var(--shadow-sm);
      margin-bottom: 2rem;
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    .d-card:hover {
      box-shadow: var(--shadow-md);
    }
    .d-card--highlight {
      border-color: rgba(99, 102, 241, 0.4);
    }
    .d-card__header-box {
      max-width: 600px;
      margin-bottom: 2rem;
    }
    .d-steps-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.5rem;

      @media (max-width: 768px) {
        grid-template-columns: 1fr;
      }
    }
    .d-step-card {
      background: var(--color-bg-elevated, #f1f5f9);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-lg, 16px);
      padding: 1.35rem;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .d-step-card:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-sm);
      border-color: rgba(99, 102, 241, 0.35);
    }
    .d-step-card__head {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .d-step-number {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 1.85rem;
      height: 1.85rem;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--brand-primary, #6366f1) 0%, var(--brand-primary-dark, #4f46e5) 100%);
      color: #fff;
      font-size: 0.8125rem;
      font-weight: 800;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(99, 102, 241, 0.35);
    }
    .d-step-title {
      margin: 0;
      font-family: var(--font-family-display, sans-serif);
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: -0.015em;
      color: var(--color-text-main, #0f172a);
    }
    .d-step-desc {
      margin: 0;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--color-text-muted, #334155);
      line-height: 1.55;
    }
    .d-card__split {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 1fr);
      gap: 2.5rem;
      align-items: center;

      @media (max-width: 860px) {
        grid-template-columns: 1fr;
      }
    }

    /* ──── CHECKLIST ──── */
    .d-checklist {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
      margin-top: 1.25rem;
    }
    .d-checklist__item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--color-text-main, #0f172a);
    }
    .d-checklist__icon {
      width: 16px;
      height: 16px;
      color: #10b981;
      flex-shrink: 0;
    }

    /* ──── TERMINAL ──── */
    .d-terminal {
      background: #0b0f19;
      border-radius: var(--radius-md, 12px);
      border: 1px solid #1e293b;
      overflow: hidden;
      box-shadow: var(--shadow-sm);
    }
    .d-terminal--compact {
      border-radius: var(--radius-sm, 8px);
    }
    .d-terminal__head {
      background: #111827;
      padding: 0.5rem 0.85rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #1f2937;
    }
    .d-terminal__dots {
      display: flex;
      gap: 6px;
    }
    .d-terminal__dots i {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .d-terminal__dots i:first-child {
      background: #ef4444;
    }
    .d-terminal__dots i:nth-child(2) {
      background: #f59e0b;
    }
    .d-terminal__dots i:nth-child(3) {
      background: #10b981;
    }
    .d-terminal__label {
      font-size: 0.72rem;
      color: #94a3b8;
      font-family: var(--font-family-mono, monospace);
    }
    .d-terminal__body {
      padding: 0.85rem 1.15rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .d-terminal__prompt {
      color: #818cf8;
      font-weight: 700;
      user-select: none;
      font-family: var(--font-family-mono, monospace);
      font-size: 0.85rem;
    }
    .d-terminal__code {
      font-family: var(--font-family-mono, monospace);
      font-size: 0.82rem;
      color: #f8fafc;
      flex: 1;
      white-space: nowrap;
      overflow-x: auto;
    }
    .d-terminal__copy {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: var(--radius-sm, 8px);
      color: #cbd5e1;
      padding: 0.25rem 0.5rem;
      cursor: pointer;
      transition:
        background 0.15s,
        color 0.15s,
        border-color 0.15s;
      display: flex;
      align-items: center;
    }
    .d-terminal__copy svg {
      width: 14px;
      height: 14px;
    }
    .d-terminal__copy:hover {
      background: #334155;
      color: #fff;
      border-color: #6366f1;
    }

    /* ──── ARCHITECTURE ──── */
    .d-arch {
      margin-bottom: 3rem;
    }
    .d-arch__grid {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }
    .d-arch__layer {
      width: 100%;
      max-width: 560px;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: 1.5rem;
      background: var(--ngxsmk-color-surface);
      transition:
        box-shadow 0.2s,
        transform 0.2s;
    }
    .d-arch__layer:hover {
      box-shadow: var(--ngxsmk-shadow-md);
      transform: translateY(-1px);
    }
    .d-arch__layer--cdk {
      border-left: 3px solid #6366f1;
    }
    .d-arch__layer--core {
      border-left: 3px solid var(--ngxsmk-color-primary);
    }
    .d-arch__layer--theme {
      border-left: 3px solid #10b981;
    }
    .d-arch__layer-tag {
      display: inline-block;
      font-size: var(--ngxsmk-text-body-xs-size);
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 0.5rem;
    }
    .d-arch__layer--cdk .d-arch__layer-tag {
      color: #6366f1;
    }
    .d-arch__layer--core .d-arch__layer-tag {
      color: var(--ngxsmk-color-primary);
    }
    .d-arch__layer--theme .d-arch__layer-tag {
      color: #10b981;
    }
    .d-arch__layer-name {
      font-size: var(--ngxsmk-text-title-lg-size);
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .d-arch__layer-desc {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.55;
      margin: 0 0 0.75rem;
    }
    .d-arch__layer-desc code {
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.85em;
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 8%, transparent);
      color: var(--ngxsmk-color-primary);
      padding: 0.1em 0.3em;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
    }
    .d-arch__layer-pkg code {
      font-family: var(--ngxsmk-font-mono);
      font-size: var(--ngxsmk-text-body-xs-size);
      color: var(--ngxsmk-color-on-surface-variant);
      background: var(--ngxsmk-color-surface-variant);
      padding: 0.2rem 0.5rem;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .d-arch__connector {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 40px;
      color: var(--ngxsmk-color-outline);
    }

    /* ──── PILLARS ──── */
    .d-pillars {
      margin-bottom: 3.5rem;
    }
    .d-pillars__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr));
      gap: 1.25rem;
    }
    .d-pillar {
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-lg, 16px);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      transition:
        box-shadow 0.2s,
        transform 0.2s,
        border-color 0.2s;
    }
    .d-pillar:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-3px);
      border-color: rgba(99, 102, 241, 0.35);
    }
    .d-pillar__icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
    }
    .d-pillar__icon svg {
      width: 22px;
      height: 22px;
    }
    .d-pillar__icon--zoneless {
      background: rgba(99, 102, 241, 0.12);
      color: #6366f1;
    }
    .d-pillar__icon--copy {
      background: rgba(245, 158, 11, 0.12);
      color: #f59e0b;
    }
    .d-pillar__icon--theme {
      background: rgba(16, 185, 129, 0.12);
      color: #10b981;
    }
    .d-pillar__icon--ai {
      background: rgba(6, 182, 212, 0.12);
      color: #06b6d4;
    }
    .d-pillar__title {
      font-family: var(--font-family-display, sans-serif);
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.015em;
      margin: 0 0 0.5rem;
      color: var(--color-text-main, #0f172a);
    }
    .d-pillar__desc {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--color-text-muted, #334155);
      line-height: 1.55;
      margin: 0;
    }

    /* ──── ACCENT SELECTOR ──── */
    .d-accent-row {
      margin-bottom: 1.5rem;
    }
    .d-accent-label {
      display: block;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      color: var(--color-text-main, #0f172a);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.5rem;
    }
    .d-accent-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .d-accent-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      padding: 0.35rem 0.75rem;
      border-radius: var(--radius-pill, 9999px);
      border: 1px solid var(--color-border, #e2e8f0);
      background: var(--color-bg-elevated, #f1f5f9);
      color: var(--color-text-muted, #334155);
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .d-accent-pill:hover {
      border-color: var(--brand-primary, #6366f1);
    }
    .d-accent-pill--active {
      border-color: var(--brand-primary, #6366f1);
      background: rgba(99, 102, 241, 0.1);
      color: var(--brand-primary, #6366f1);
    }
    .d-accent-pill__dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }

    /* ──── AI ──── */
    .d-ai {
      margin-bottom: 3.5rem;
    }
    .d-ai__header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .d-ai__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(17rem, 100%), 1fr));
      gap: 1.25rem;
    }
    .d-ai-card {
      background: var(--color-bg-card, #ffffff);
      border: 1px solid var(--color-border, #e2e8f0);
      border-radius: var(--radius-lg, 16px);
      padding: 1.5rem;
      box-shadow: var(--shadow-sm);
      transition:
        box-shadow 0.2s,
        transform 0.2s,
        border-color 0.2s;
    }
    .d-ai-card:hover {
      box-shadow: var(--shadow-md);
      transform: translateY(-3px);
      border-color: rgba(99, 102, 241, 0.35);
    }
    .d-ai-card__icon {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1rem;
      background: rgba(99, 102, 241, 0.12);
      color: var(--brand-primary, #6366f1);
    }
    .d-ai-card__icon svg {
      width: 22px;
      height: 22px;
    }
    .d-ai-card__title {
      font-family: var(--font-family-display, sans-serif);
      font-size: 1.1rem;
      font-weight: 700;
      letter-spacing: -0.015em;
      margin: 0 0 0.5rem;
      color: var(--color-text-main, #0f172a);
    }
    .d-ai-card__desc {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--color-text-muted, #334155);
      line-height: 1.55;
      margin: 0 0 1rem;
    }
    .d-ai-card__links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .d-ai-card__sep {
      color: var(--color-border, #e2e8f0);
    }
    .d-link {
      color: var(--brand-primary, #6366f1);
      text-decoration: none;
      font-weight: 600;
    }
    .d-link:hover {
      text-decoration: underline;
    }

    /* ──── CONTROLS ──── */
    .d-control {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }
    .d-control__label {
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 500;
      color: var(--ngxsmk-color-on-surface-variant);
    }
    .d-control__range {
      width: 100%;
      accent-color: var(--ngxsmk-color-primary);
      cursor: pointer;
    }

    /* ──── SANDBOX ──── */
    .d-sandbox {
      width: 100%;
      max-width: 340px;
      margin-left: auto;
      background: var(--ngxsmk-color-surface-variant);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      box-shadow: var(--ngxsmk-shadow-lg);
      overflow: hidden;
      transition: transform 0.3s;
    }
    .d-sandbox:hover {
      transform: translateY(-2px);
    }
    .d-sandbox__head {
      background: rgba(0, 0, 0, 0.03);
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }
    .d-sandbox__body {
      padding: 1.25rem 1rem;
    }
    .d-sandbox__section-title {
      display: block;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 700;
      margin-bottom: 0.75rem;
      color: var(--ngxsmk-color-on-surface);
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .d-sandbox__row {
      display: flex;
      gap: 0.5rem;
    }

    /* ──── CODE EXAMPLE ──── */
    .d-code-example {
      margin-bottom: 3rem;
    }

    /* ──── AI TOOLING ──── */
    .d-ai {
      margin-bottom: 3rem;
    }
    .d-ai__header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .d-ai__grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(17rem, 100%), 1fr));
      gap: var(--ngxsmk-space-4);
    }
    .d-ai-card {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      padding: 1.5rem;
      transition:
        box-shadow 0.2s,
        transform 0.2s;
    }
    .d-ai-card:hover {
      box-shadow: var(--ngxsmk-shadow-md);
      transform: translateY(-1px);
    }
    .d-ai-card__icon {
      width: 40px;
      height: 40px;
      border-radius: var(--ngxsmk-radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.75rem;
      background: color-mix(in srgb, var(--ngxsmk-color-primary) 8%, transparent);
      color: var(--ngxsmk-color-primary);
    }
    .d-ai-card__icon svg {
      width: 20px;
      height: 20px;
    }
    .d-ai-card__title {
      font-size: var(--ngxsmk-text-body-lg-size);
      font-weight: 700;
      margin: 0 0 0.5rem;
      color: var(--ngxsmk-color-on-surface);
    }
    .d-ai-card__desc {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      line-height: 1.55;
      margin: 0 0 1rem;
    }
    .d-ai-card__links {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: var(--ngxsmk-text-body-sm-size);
    }
    .d-ai-card__sep {
      color: var(--ngxsmk-color-outline);
    }
    .d-link {
      color: var(--ngxsmk-color-primary);
      text-decoration: none;
      font-weight: 500;
    }
    .d-link:hover {
      text-decoration: underline;
    }

    /* ──── FAQ ──── */
    .d-faq {
      margin-bottom: 3rem;
      text-align: center;
    }

    /* ──── FOOTER ──── */
    .d-footer {
      text-align: center;
      padding: var(--ngxsmk-space-8, 2rem) 0;
      border-top: 1px solid var(--ngxsmk-color-outline);
    }
    .d-footer__text {
      font-size: var(--ngxsmk-text-body-sm-size);
      color: var(--ngxsmk-color-on-surface-variant);
      margin: 0;
    }

    /* ──── RESPONSIVE ──── */
    @media (max-width: 768px) {
      .d {
        padding: 0 var(--ngxsmk-space-4, 1rem) var(--ngxsmk-space-10, 2.5rem);
      }
      .d-card {
        padding: var(--ngxsmk-space-5, 1.25rem);
      }
      .d-card__split {
        grid-template-columns: 1fr;
        gap: 1.75rem;
      }
      .d-steps-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .d-pillars__grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .d-ai__grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
      .d-hero {
        padding: var(--ngxsmk-space-10, 2.5rem) 0 var(--ngxsmk-space-8, 2rem);
      }
      .d-hero__stats {
        gap: var(--ngxsmk-space-4);
      }
      .d-sandbox {
        max-width: 100%;
        margin-left: 0;
      }
    }
  `,
})
export class DocsPage {
  protected readonly version = APP_VERSION;
  protected readonly theme = inject(NgxsmkThemeService);

  protected readonly copiedNPM = signal(false);
  protected readonly copiedCLI = signal(false);
  protected readonly copiedMCP = signal(false);
  protected readonly copiedTheme = signal(false);
  protected readonly copiedImport = signal(false);
  protected readonly copiedTemplate = signal(false);

  protected readonly activeAccent = signal<'violet' | 'emerald' | 'rose' | 'amber' | 'blue'>(
    'violet',
  );
  protected readonly progress = signal(65);
  protected readonly sandboxSwitch = signal(true);

  protected readonly accentList = [
    { name: 'violet' as const, label: 'Violet', hex: '#7c3aed' },
    { name: 'emerald' as const, label: 'Emerald', hex: '#059669' },
    { name: 'rose' as const, label: 'Rose', hex: '#e11d48' },
    { name: 'amber' as const, label: 'Amber', hex: '#d97706' },
    { name: 'blue' as const, label: 'Blue', hex: '#2563eb' },
  ];

  protected readonly accentHex = computed(
    () => this.accentList.find((c) => c.name === this.activeAccent())?.hex ?? '#7c3aed',
  );

  protected setAccent(name: 'violet' | 'emerald' | 'rose' | 'amber' | 'blue'): void {
    this.activeAccent.set(name);
  }

  protected onProgress(e: Event): void {
    this.progress.set(Number((e.target as HTMLInputElement).value));
  }

  protected readonly buttonExampleCode = `<button ngxsmk-button>
  Click me
</button>

<button ngxsmk-button variant="outline">
  Outline variant
</button>

<button ngxsmk-button [disabled]="isDisabled">
  Disabled state
</button>`;

  protected readonly buttonCustomizeCode = `/* Override button tokens */
.btn-primary {
  --ngxsmk-color-primary: #7c3aed;
  --ngxsmk-radius-md: 0.5rem;
  --ngxsmk-text-body-sm-size: 0.875rem;
}`;

  copy(type: 'npm' | 'cli' | 'mcp' | 'theme' | 'import' | 'template'): void {
    const commands: Record<string, string> = {
      npm: 'npm install @ngxsmk/core @ngxsmk/theme',
      cli: 'npx ngxsmk add button',
      mcp: 'claude mcp add ngxsmk -- npx @ngxsmk/mcp',
      theme: "@import '@ngxsmk/theme/css/tokens.css';",
      import: "import { NgxsmkButton } from '@ngxsmk/core/button';",
      template: '<button ngxsmk-button>Get Started</button>',
    };
    const flags: Record<string, typeof this.copiedNPM> = {
      npm: this.copiedNPM,
      cli: this.copiedCLI,
      mcp: this.copiedMCP,
      theme: this.copiedTheme,
      import: this.copiedImport,
      template: this.copiedTemplate,
    };
    if (commands[type] && flags[type]) {
      navigator.clipboard.writeText(commands[type]).then(() => {
        flags[type].set(true);
        setTimeout(() => flags[type].set(false), 2000);
      });
    }
  }
}
