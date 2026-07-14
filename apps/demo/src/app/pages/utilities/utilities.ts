import { Component, signal } from '@angular/core';
import { ShowcaseExample } from '../../showcase/showcase-example';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkVisuallyHidden } from '@ngxsmk/core/visually-hidden';
import { NgxsmkFocusTrap } from '@ngxsmk/core/focus-trap';
import { NgxsmkClickOutside } from '@ngxsmk/core/click-outside';
import { NgxsmkKeyboardShortcut } from '@ngxsmk/core/keyboard-shortcut';
import { NgxsmkCopyToClipboard } from '@ngxsmk/core/copy-to-clipboard';
import { NgxsmkScrollLock } from '@ngxsmk/core/scroll-lock';
import { NgxsmkResizeObserver } from '@ngxsmk/core/resize-observer';
import { NgxsmkIntersectionObserver } from '@ngxsmk/core/intersection-observer';
import { NgxsmkLayerProvider } from '@ngxsmk/core/layer-provider';
import { NgxsmkMediaQuery } from '@ngxsmk/core/media-query';
import { NgxsmkMediaTheme } from '@ngxsmk/core/media-theme';
import { NgxsmkLazyLoad } from '@ngxsmk/core/lazy-load';

@Component({
  selector: 'utilities-page',
  standalone: true,
  imports: [
    ShowcaseExample, NgxsmkButton,
    NgxsmkVisuallyHidden, NgxsmkFocusTrap, NgxsmkClickOutside, NgxsmkKeyboardShortcut,
    NgxsmkCopyToClipboard, NgxsmkScrollLock, NgxsmkResizeObserver, NgxsmkIntersectionObserver,
    NgxsmkLayerProvider, NgxsmkMediaQuery, NgxsmkMediaTheme, NgxsmkLazyLoad,
  ],
  template: `
    <h2 class="ngxsmk-page-title">Utilities &amp; Hooks</h2>
    <p class="ngxsmk-page-desc">
      Invisible-but-powerful directives and hooks for accessibility, layout, and
      interaction behavior — each demo below makes the effect visible and interactive.
    </p>

    <showcase-example
      title="Visually Hidden"
      description="Hides content visually while keeping it available to screen readers."
      [code]="codeVisuallyHidden" [component]="NgxsmkButton">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <p style="margin:0 0 .5rem">
          <button ngxsmk-button size="sm" (click)="showHidden.update(v => !v)">
            {{ showHidden() ? 'Hide' : 'Reveal' }} the hidden text
          </button>
        </p>
        @if (showHidden()) {
          <p style="margin:0">
            Visible label
            <span ngxsmkVisuallyHidden> — extra description only announced to screen readers</span>
          </p>
        } @else {
          <p style="margin:0">Visible label — extra description only announced to screen readers</p>
        }
        <p class="ngxsmk-demo-hint">Toggle to compare: the directive removes it from view, not the DOM.</p>
      </div>
    </showcase-example>

    <showcase-example
      title="Focus Trap"
      description="Cycles Tab focus within the element so keyboard users stay contained."
      [code]="codeFocusTrap" [component]="NgxsmkButton">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <p style="margin:0 0 .5rem">
          <button ngxsmk-button size="sm" (click)="focusTrapped.update(v => !v)">
            Trap is {{ focusTrapped() ? 'ON' : 'OFF' }}
          </button>
        </p>
        <div [ngxsmkFocusTrap]="focusTrapped()" class="ngxsmk-trap-box">
          <button ngxsmk-button size="sm">First</button>
          <button ngxsmk-button size="sm">Middle</button>
          <button ngxsmk-button size="sm">Last</button>
          <a ngxsmk-link href="#">A focusable link</a>
        </div>
        <p class="ngxsmk-demo-hint">Turn the trap on, then press Tab — focus loops inside the box.</p>
      </div>
    </showcase-example>

    <showcase-example
      title="Click Outside"
      description="Emits when a click lands outside the host element — perfect for popovers."
      [code]="codeClickOutside" [component]="NgxsmkButton">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%; position: relative">
        <button ngxsmk-button size="sm" (click)="outsideOpen.set(true)">
          {{ outsideOpen() ? 'Popover open' : 'Open popover' }}
        </button>
        @if (outsideOpen()) {
          <div class="ngxsmk-popover" ngxsmkClickOutside (ngxsmkClickOutside)="outsideOpen.set(false)">
            I close when you click anywhere outside me.
          </div>
        }
        <p class="ngxsmk-demo-hint">Open the panel, then click elsewhere on the page to dismiss it.</p>
      </div>
    </showcase-example>

    <showcase-example
      title="Keyboard Shortcut"
      description="Binds a global key combo and fires when it matches."
      [code]="codeShortcut" [component]="NgxsmkKeyboardShortcut">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <p style="margin:0">
          Press <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>L</kbd>
          <span ngxsmkKeyboardShortcut="ctrl+shift+l" (shortcutPressed)="onShortcut()"></span>
        </p>
        <p style="margin:.5rem 0 0">
          Triggered <strong>{{ shortcutCount() }}</strong> time(s).
          <span class="ngxsmk-demo-log">{{ shortcutLog() }}</span>
        </p>
      </div>
    </showcase-example>

    <showcase-example
      title="Copy to Clipboard"
      description="Copies a bound string to the clipboard on click."
      [code]="codeCopy" [component]="NgxsmkButton">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <code class="ngxsmk-demo-code">npm install @ngxsmk/core</code>
        <button
          ngxsmk-button size="sm" class="ngxsmk-demo-ml"
          ngxsmkCopyToClipboard="npm install @ngxsmk/core"
          (copied)="onCopied()"
        >{{ copied() ? 'Copied!' : 'Copy' }}</button>
        @if (copied()) {
          <p class="ngxsmk-demo-hint">Copied to your clipboard.</p>
        }
      </div>
    </showcase-example>

    <showcase-example
      title="Scroll Lock"
      description="Locks the document scroll while active — e.g. behind a modal."
      [code]="codeScrollLock" [component]="NgxsmkButton">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <button
          ngxsmk-button size="sm"
          [variant]="scrollLocked() ? 'primary' : 'ghost'"
          [ngxsmkScrollLock]="scrollLocked()"
          (click)="scrollLocked.update(v => !v)"
        >Scroll is {{ scrollLocked() ? 'LOCKED' : 'free' }}</button>
        <p class="ngxsmk-demo-hint">Toggle on, then try scrolling the page — it is frozen until you turn it off.</p>
      </div>
    </showcase-example>

    <showcase-example
      title="Resize Observer"
      description="Streams the element's size whenever it changes."
      [code]="codeResize" [component]="NgxsmkResizeObserver">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <div class="ngxsmk-resize-box" ngxsmkResizeObserver (sizeChanged)="onResize($event)">
          Drag the corner to resize me
        </div>
        <p class="ngxsmk-demo-hint">
          Current size: <strong>{{ size().width }} × {{ size().height }}px</strong>
        </p>
      </div>
    </showcase-example>

    <showcase-example
      title="Intersection Observer"
      description="Reports whether the element is visible within a scroll container."
      [code]="codeIntersection" [component]="NgxsmkIntersectionObserver">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <div class="ngxsmk-scroll-window">
          <div class="ngxsmk-scroll-spacer">Scroll down…</div>
          <div
            class="ngxsmk-observe-target"
            [class.ngxsmk-is-visible]="intersecting()"
            ngxsmkIntersectionObserver
            (intersected)="onIntersect($event)"
          >
            {{ intersecting() ? 'I am visible 👀' : 'Scroll to reveal me' }}
          </div>
          <div class="ngxsmk-scroll-spacer">…and back up.</div>
        </div>
      </div>
    </showcase-example>

    <showcase-example
      title="Layer Provider"
      description="Establishes a positioned layer context for overlays and portals."
      [code]="codeLayer" [component]="NgxsmkLayerProvider">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <div ngxsmkLayerProvider class="ngxsmk-layer-stage">
          <div class="ngxsmk-layer-card ngxsmk-layer-card--back">Base layer</div>
          <div class="ngxsmk-layer-card ngxsmk-layer-card--front">Stacked layer</div>
        </div>
        <p class="ngxsmk-demo-hint">The provider scopes z-index/layering for its children.</p>
      </div>
    </showcase-example>

    <showcase-example
      title="Media Query"
      description="Reflects a CSS media query match as a live signal."
      [code]="codeMediaQuery" [component]="NgxsmkMediaQuery">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <div ngxsmkMediaQuery="(min-width: 768px)"></div>
        <p style="margin:0">
          Viewport is
          <strong>{{ mediaMatches() ? '≥ 768px (desktop)' : '< 768px (narrow)' }}</strong>.
        </p>
        <p class="ngxsmk-demo-hint">Resize the window to flip the match.</p>
      </div>
    </showcase-example>

    <showcase-example
      title="Media Theme"
      description="Applies a theme mode attribute from a prefers-* media query."
      [code]="codeMediaTheme" [component]="NgxsmkMediaTheme">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <div
          class="ngxsmk-theme-box"
          ngxsmkMediaTheme
          query="(prefers-color-scheme: dark)"
          theme="dark"
        >
          data-theme-mode = <strong>{{ prefersDark() ? 'dark' : 'none' }}</strong>
        </div>
        <p class="ngxsmk-demo-hint">Reflects your OS “dark mode” preference.</p>
      </div>
    </showcase-example>

    <showcase-example
      title="Lazy Load"
      description="Defers rendering children until they scroll into view."
      [code]="codeLazy" [component]="NgxsmkLazyLoad">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <div class="ngxsmk-scroll-window">
          <div class="ngxsmk-scroll-spacer">Scroll down to load the content…</div>
          <ngxsmk-lazy-load rootMargin="0px">
            <div class="ngxsmk-lazy-content">
              ✅ Loaded! This markup only rendered once it entered the viewport.
            </div>
          </ngxsmk-lazy-load>
          <div class="ngxsmk-scroll-spacer">…keep scrolling.</div>
        </div>
      </div>
    </showcase-example>

    <showcase-example
      title="Lazy Load (cards)"
      description="Each card below is wrapped in ngxsmk-lazy-load, so its markup is only created once it scrolls into the viewport — scroll the feed to watch them appear."
      [code]="codeLazyCards" [component]="NgxsmkLazyLoad">
      <div class="ngxsmk-sc-surface" style="flex: 1 1 100%">
        <div class="ngxsmk-scroll-window">
          <div class="ngxsmk-scroll-spacer">Scroll down — cards load as they enter view…</div>
          @for (item of lazyCards; track item.id) {
            <ngxsmk-lazy-load class="ngxsmk-lazy-slot">
              <div class="ngxsmk-lazy-card">
                <div class="ngxsmk-lazy-card__thumb" [style.background]="item.color"></div>
                <div class="ngxsmk-lazy-card__body">
                  <strong>{{ item.title }}</strong>
                  <span>Rendered on scroll into view</span>
                </div>
              </div>
            </ngxsmk-lazy-load>
          }
          <div class="ngxsmk-scroll-spacer">…end of feed.</div>
        </div>
      </div>
    </showcase-example>
  `,
  styles: `
    :host { display: block; }

    .ngxsmk-sc-surface { width: 100%; }

    .ngxsmk-demo-hint {
      margin: 0.75rem 0 0;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }

    .ngxsmk-demo-log {
      display: inline-block;
      margin-left: 0.5rem;
      color: var(--ngxsmk-color-success, #16a34a);
    }

    .ngxsmk-demo-code {
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      padding: 0.25rem 0.5rem;
      border-radius: 4px;
      font-size: 0.8125rem;
    }

    .ngxsmk-demo-ml { margin-left: 0.5rem; }

    .ngxsmk-trap-box {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      align-items: center;
      padding: 0.75rem;
      border: 1px dashed var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
    }

    .ngxsmk-popover {
      position: absolute;
      top: 2.75rem;
      left: 0;
      padding: 0.75rem 1rem;
      background: var(--ngxsmk-color-surface, #fff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      box-shadow: var(--ngxsmk-shadow-md, 0 4px 12px rgba(0,0,0,0.12));
    }

    kbd {
      display: inline-block;
      padding: 0.1rem 0.4rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: 4px;
      font-family: ui-monospace, monospace;
      font-size: 0.75rem;
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
    }

    .ngxsmk-resize-box {
      width: 220px;
      height: 120px;
      padding: 0.75rem;
      resize: both;
      overflow: auto;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      font-size: 0.8125rem;
    }

    .ngxsmk-scroll-window {
      height: 200px;
      overflow: auto;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
    }

    .ngxsmk-scroll-spacer {
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      font-size: 0.8125rem;
    }

    .ngxsmk-observe-target {
      margin: 0.5rem;
      padding: 1.5rem;
      text-align: center;
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface, #fff);
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      transition: background 0.2s, color 0.2s;
    }

    .ngxsmk-observe-target.is-visible {
      background: var(--ngxsmk-color-primary, #4f46e5);
      color: #fff;
      border-color: transparent;
    }

    .ngxsmk-layer-stage {
      position: relative;
      height: 140px;
    }

    .ngxsmk-layer-card {
      position: absolute;
      width: 160px;
      height: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      font-size: 0.8125rem;
      box-shadow: var(--ngxsmk-shadow-md, 0 4px 12px rgba(0,0,0,0.12));
    }

    .ngxsmk-layer-card--back { top: 0; left: 0; background: var(--ngxsmk-color-surface-variant, #f4f4f5); z-index: 1; }
    .ngxsmk-layer-card--front { top: 30px; left: 60px; background: var(--ngxsmk-color-primary, #4f46e5); color: #fff; z-index: 2; }

    .ngxsmk-theme-box {
      padding: 1rem 1.25rem;
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface, #fff);
      color: var(--ngxsmk-color-on-surface, #09090b);
    }

    .ngxsmk-theme-box[data-theme-mode='dark'] {
      background: #18181b;
      color: #fafafa;
      border-color: #3f3f46;
    }

    .ngxsmk-lazy-content {
      margin: 0.5rem;
      padding: 1.5rem;
      text-align: center;
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      background: var(--ngxsmk-color-success, #16a34a);
      color: #fff;
    }

    .ngxsmk-lazy-slot {
      display: block;
      margin: 0.5rem;
    }

    .ngxsmk-lazy-card {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem;
      border-radius: var(--ngxsmk-radius-md, 0.5rem);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: var(--ngxsmk-color-surface, #fff);
    }

    .ngxsmk-lazy-card__thumb {
      width: 48px;
      height: 48px;
      flex: 0 0 auto;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
    }

    .ngxsmk-lazy-card__body {
      display: flex;
      flex-direction: column;
      font-size: 0.8125rem;
    }

    .ngxsmk-lazy-card__body span {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
  `,
})
export class UtilitiesPage {
  protected readonly NgxsmkButton = NgxsmkButton;
  protected readonly NgxsmkKeyboardShortcut = NgxsmkKeyboardShortcut;
  protected readonly NgxsmkResizeObserver = NgxsmkResizeObserver;
  protected readonly NgxsmkIntersectionObserver = NgxsmkIntersectionObserver;
  protected readonly NgxsmkLayerProvider = NgxsmkLayerProvider;
  protected readonly NgxsmkMediaQuery = NgxsmkMediaQuery;
  protected readonly NgxsmkMediaTheme = NgxsmkMediaTheme;
  protected readonly NgxsmkLazyLoad = NgxsmkLazyLoad;

  protected readonly showHidden = signal(true);
  protected readonly focusTrapped = signal(true);
  protected readonly outsideOpen = signal(false);
  protected readonly shortcutCount = signal(0);
  protected readonly shortcutLog = signal('Press the shortcut to trigger it.');
  protected readonly copied = signal(false);
  protected readonly scrollLocked = signal(false);
  protected readonly size = signal({ width: 0, height: 0 });
  protected readonly intersecting = signal(false);
  protected readonly mediaMatches = signal(false);
  protected readonly prefersDark = signal(false);

  constructor() {
    if (typeof window !== 'undefined') {
      const mq = window.matchMedia('(min-width: 768px)');
      this.mediaMatches.set(mq.matches);
      mq.addEventListener('change', (e) => this.mediaMatches.set(e.matches));

      const dark = window.matchMedia('(prefers-color-scheme: dark)');
      this.prefersDark.set(dark.matches);
      dark.addEventListener('change', (e) => this.prefersDark.set(e.matches));
    }
  }

  protected onShortcut(): void {
    this.shortcutCount.update((c) => c + 1);
    this.shortcutLog.set('Triggered at ' + new Date().toLocaleTimeString());
  }

  protected onCopied(): void {
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 2000);
  }

  protected onResize(size: { width: number; height: number }): void {
    this.size.set(size);
  }

  protected onIntersect(value: boolean): void {
    this.intersecting.set(value);
  }

  protected readonly codeVisuallyHidden =
`<span ngxsmkVisuallyHidden>Extra description for screen readers</span>`;

  protected readonly codeFocusTrap =
`<div ngxsmkFocusTrap [ngxsmkFocusTrap]="true">
  <button>First</button>
  <button>Last</button>
</div>`;

  protected readonly codeClickOutside =
`<div ngxsmkClickOutside (ngxsmkClickOutside)="open.set(false)">
  Popover content
</div>`;

  protected readonly codeShortcut =
`<span ngxsmkKeyboardShortcut="ctrl+shift+l"
      (shortcutPressed)="onShortcut()"></span>`;

  protected readonly codeCopy =
`<button ngxsmkCopyToClipboard="npm install @ngxsmk/core"
        (copied)="onCopied()">Copy</button>`;

  protected readonly codeScrollLock =
`<button [ngxsmkScrollLock]="locked()" (click)="locked.set(!locked())">
  Toggle scroll lock
</button>`;

  protected readonly codeResize =
`<div ngxsmkResizeObserver (sizeChanged)="onResize($event)">
  Resizable
</div>`;

  protected readonly codeIntersection =
`<div ngxsmkIntersectionObserver (intersected)="onIntersect($event)">
  Watched element
</div>`;

  protected readonly codeLayer =
`<div ngxsmkLayerProvider>
  <div class="ngxsmk-overlay">Stacked content</div>
</div>`;

  protected readonly codeMediaQuery =
`<div ngxsmkMediaQuery="(min-width: 768px)"></div>
<!-- matches() signal reflects the query -->`;

  protected readonly codeMediaTheme =
`<div ngxsmkMediaTheme query="(prefers-color-scheme: dark)" theme="dark">
  Theme-aware content
</div>`;

  protected readonly codeLazy =
`<ngxsmk-lazy-load rootMargin="0px">
  <div>Rendered on scroll into view</div>
</ngxsmk-lazy-load>`;

  protected readonly lazyCards = [
    { id: 1, title: 'Card Alpha', color: 'linear-gradient(135deg,#4f46e5,#22d3ee)' },
    { id: 2, title: 'Card Bravo', color: 'linear-gradient(135deg,#16a34a,#a3e635)' },
    { id: 3, title: 'Card Charlie', color: 'linear-gradient(135deg,#f59e0b,#ef4444)' },
    { id: 4, title: 'Card Delta', color: 'linear-gradient(135deg,#a855f7,#ec4899)' },
  ];

  protected readonly codeLazyCards =
`<ngxsmk-lazy-load>
  <div class="ngxsmk-lazy-card">
    <div class="ngxsmk-lazy-card__thumb"></div>
    <div class="ngxsmk-lazy-card__body">
      <strong>{{ item.title }}</strong>
      <span>Rendered on scroll into view</span>
    </div>
  </div>
</ngxsmk-lazy-load>`;
}
