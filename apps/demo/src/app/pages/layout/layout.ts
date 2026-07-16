import { NgxsmkVStack, NgxsmkHStack, NgxsmkStackItem } from '@ngxsmk/core/h-stack';
import {
  NgxsmkLayoutHeader,
  NgxsmkLayoutContent,
  NgxsmkLayoutFooter,
  NgxsmkLayout,
  NgxsmkLayoutPanel,
} from '@ngxsmk/core/layout';
import { NgxsmkSection } from '@ngxsmk/core/section';
import { NgxsmkContainer } from '@ngxsmk/core/container';
import { NgxsmkGrid } from '@ngxsmk/core/grid';
import { NgxsmkFlex } from '@ngxsmk/core/flex';
import { NgxsmkStack } from '@ngxsmk/core/stack';
import { NgxsmkDivider } from '@ngxsmk/core/divider';
import { NgxsmkAspectRatio } from '@ngxsmk/core/aspect-ratio';
import { NgxsmkSpacer } from '@ngxsmk/core/spacer';
import { NgxsmkCollapsible } from '@ngxsmk/core/collapsible';
import { NgxsmkResizable } from '@ngxsmk/core/resizable';
import { NgxsmkAppShell } from '@ngxsmk/core/app-shell';
import { NgxsmkFormLayout } from '@ngxsmk/core/form-layout';
import { NgxsmkResizeHandle } from '@ngxsmk/core/resize-handle';
import { NgxsmkCenter } from '@ngxsmk/core/center';
import { Component, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ShowcaseExample } from '../../showcase/showcase-example';

/**
 * Layout category showcase.
 *
 * Every component (or related group) is wrapped in a <showcase-example [component]="NgxsmkCenter"> so the
 * demo stays consistent with the rest of the category pages. Layout primitives
 * get visible placeholder children so their effect is obvious at a glance.
 */
@Component({
  selector: 'layout-page',
  standalone: true,
  imports: [
    ShowcaseExample,
    NgxsmkCenter,
    NgxsmkSection,
    NgxsmkContainer,
    NgxsmkGrid,
    NgxsmkFlex,
    NgxsmkHStack,
    NgxsmkVStack,
    NgxsmkStack,
    NgxsmkStackItem,
    NgxsmkDivider,
    NgxsmkAspectRatio,
    NgxsmkSpacer,
    NgxsmkCollapsible,
    NgxsmkResizable,
    NgxsmkAppShell,
    NgxsmkFormLayout,
    NgxsmkResizeHandle,
    NgxsmkLayout,
    NgxsmkLayoutHeader,
    NgxsmkLayoutContent,
    NgxsmkLayoutFooter,
    NgxsmkLayoutPanel,
    TranslatePipe,
  ],
  template: `
    <h2 class="ngxsmk-page-title">{{ 'category.layout' | translate }}</h2>
    <p class="ngxsmk-page-desc">
      {{ 'layout.desc' | translate }}
    </p>

    <showcase-example
      [title]="'layout.center' | translate"
      [description]="'layout.centerDesc' | translate"
      [code]="codeCenter"
    >
      <ngxsmk-center
        style="width:100%;height:160px;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
      >
        <div style="padding:1rem;background:var(--ngxsmk-color-surface);border-radius:8px;">
          {{ 'layout.perfectlyCentered' | translate }}
        </div>
      </ngxsmk-center>
    </showcase-example>

    <showcase-example
      [title]="'layout.section' | translate"
      [description]="'layout.sectionDesc' | translate"
      [code]="codeSection"
      [component]="NgxsmkSection"
      [customize]="customizeNgxsmkSection"
    >
      <ngxsmk-section
        [title]="'layout.projectOverview' | translate"
        style="width:100%;background:var(--ngxsmk-color-surface-variant);border-radius:8px;padding:1rem;"
      >
        <p style="margin:0;">
          {{ 'layout.sectionsKeepScannable' | translate }}
        </p>
      </ngxsmk-section>
    </showcase-example>

    <showcase-example
      [title]="'layout.container' | translate"
      [description]="'layout.containerDesc' | translate"
      [code]="codeContainer"
      [component]="NgxsmkContainer"
      [customize]="customizeNgxsmkContainer"
    >
      <ngxsmk-container
        size="md"
        style="background:var(--ngxsmk-color-surface-variant);border-radius:8px;padding:1rem;"
      >
        <p style="margin:0;">
          This container is capped at the <code>md</code> max-width and centered within its parent.
        </p>
      </ngxsmk-container>
    </showcase-example>

    <showcase-example
      [title]="'layout.grid' | translate"
      [description]="'layout.gridDesc' | translate"
      [code]="codeGrid"
      [component]="NgxsmkGrid"
    >
      <ngxsmk-grid [cols]="3" gap="0.75rem" style="width:100%;">
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.cell' | translate: { n: 1 } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.cell' | translate: { n: 2 } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.cell' | translate: { n: 3 } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.cell' | translate: { n: 4 } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.cell' | translate: { n: 5 } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.cell' | translate: { n: 6 } }}
        </div>
      </ngxsmk-grid>
    </showcase-example>

    <showcase-example
      [title]="'layout.flex' | translate"
      [description]="'layout.flexDesc' | translate"
      [code]="codeFlex"
      [component]="NgxsmkFlex"
    >
      <ngxsmk-flex [wrap]="true" justify="between" align="center" gap="0.75rem" style="width:100%;">
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.flexItem' | translate: { letter: 'A' } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.flexItem' | translate: { letter: 'B' } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.flexItem' | translate: { letter: 'C' } }}
        </div>
        <div style="padding:1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;">
          {{ 'layout.flexItem' | translate: { letter: 'D' } }}
        </div>
      </ngxsmk-flex>
    </showcase-example>

    <showcase-example
      [title]="'layout.stacks' | translate"
      [description]="'layout.stacksDesc' | translate"
      [code]="codeStacks"
      [component]="NgxsmkHStack"
    >
      <div style="width:100%;">
        <ngxsmk-h-stack gap="0.5rem">
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >A</span
          >
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >B</span
          >
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >C</span
          >
        </ngxsmk-h-stack>

        <ngxsmk-v-stack gap="0.5rem" style="margin-top:0.75rem;">
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >{{ 'layout.row' | translate: { n: 1 } }}</span
          >
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >{{ 'layout.row' | translate: { n: 2 } }}</span
          >
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >{{ 'layout.row' | translate: { n: 3 } }}</span
          >
        </ngxsmk-v-stack>

        <ngxsmk-stack direction="horizontal" gap="0.5rem" style="margin-top:0.75rem;">
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >{{ 'layout.stackItem' | translate: { name: 'X' } }}</span
          >
          <span
            ngxsmkStackItem
            style="padding:0.75rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
            >{{ 'layout.stackItem' | translate: { name: 'Y' } }}</span
          >
        </ngxsmk-stack>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'layout.divider' | translate"
      [description]="'layout.dividerDesc' | translate"
      [code]="codeDivider"
      [component]="NgxsmkDivider"
      [customize]="customizeNgxsmkDivider"
    >
      <div style="width:100%;">
        <p style="margin:0;">{{ 'layout.contentAbove' | translate }}</p>
        <ngxsmk-divider />
        <p style="margin:0;">{{ 'layout.contentBelow' | translate }}</p>

        <ngxsmk-h-stack gap="0.75rem" style="margin-top:1rem;align-items:center;">
          <span>{{ 'layout.left' | translate }}</span>
          <ngxsmk-divider orientation="vertical" style="height:1.5rem;" />
          <span>{{ 'layout.right' | translate }}</span>
        </ngxsmk-h-stack>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'layout.aspectRatio' | translate"
      [description]="'layout.aspectRatioDesc' | translate"
      [code]="codeAspect"
      [component]="NgxsmkAspectRatio"
    >
      <ngxsmk-aspect-ratio
        ratio="16/9"
        style="max-width:320px;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
      >
        <div
          style="display:flex;align-items:center;justify-content:center;color:var(--ngxsmk-color-on-surface-variant);"
        >
          16 : 9
        </div>
      </ngxsmk-aspect-ratio>
    </showcase-example>

    <showcase-example
      [title]="'layout.spacer' | translate"
      [description]="'layout.spacerDesc' | translate"
      [code]="codeSpacer"
      [component]="NgxsmkHStack"
    >
      <ngxsmk-h-stack style="width:100%;">
        <span
          style="padding:0.5rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
          >{{ 'layout.left' | translate }}</span
        >
        <ngxsmk-spacer />
        <span
          style="padding:0.5rem 1rem;background:var(--ngxsmk-color-surface-variant);border-radius:8px;"
          >{{ 'layout.right' | translate }}</span
        >
      </ngxsmk-h-stack>
    </showcase-example>

    <showcase-example
      [title]="'layout.collapsible' | translate"
      [description]="'layout.collapsibleDesc' | translate"
      [code]="codeCollapsible"
      [component]="NgxsmkCollapsible"
      [customize]="customizeNgxsmkCollapsible"
    >
      <ngxsmk-collapsible
        [title]="'layout.advancedSettings' | translate"
        [open]="true"
        style="width:100%;"
      >
        <p style="margin:0;">
          {{ 'layout.hiddenDetails' | translate }}
        </p>
      </ngxsmk-collapsible>
    </showcase-example>

    <showcase-example
      [title]="'layout.resizable' | translate"
      [description]="'layout.resizableDesc' | translate"
      [code]="codeResizable"
      [component]="NgxsmkResizable"
    >
      <div style="width:100%;max-width:420px;">
        <ngxsmk-resizable
          initialWidth="260px"
          style="border:1px solid var(--ngxsmk-color-outline);border-radius:8px;background:var(--ngxsmk-color-surface-variant);"
        >
          <div style="padding:1rem;">{{ 'layout.dragHandleResize' | translate }}</div>
        </ngxsmk-resizable>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'layout.appShell' | translate"
      [description]="'layout.appShellDesc' | translate"
      [code]="codeAppShell"
      [component]="NgxsmkAppShell"
      [customize]="customizeNgxsmkAppShell"
    >
      <div
        style="width:100%;height:360px;position:relative;overflow:hidden;border:1px solid var(--ngxsmk-color-outline);border-radius:8px;"
      >
        <ngxsmk-app-shell [sidebar]="true" [footer]="true" style="height:360px;min-height:360px;">
          <div topbar class="ngxsmk-demo-bar">{{ 'layout.topBar' | translate }}</div>
          <div sidebar class="ngxsmk-demo-side">{{ 'layout.sidebar' | translate }}</div>
          <div class="ngxsmk-demo-content">
            <p>{{ 'layout.mainContentArea' | translate }}</p>
          </div>
          <div footer class="ngxsmk-demo-bar">{{ 'layout.footer' | translate }}</div>
        </ngxsmk-app-shell>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'layout.formLayout' | translate"
      [description]="'layout.formLayoutDesc' | translate"
      [code]="codeFormLayout"
      [component]="NgxsmkFormLayout"
      [customize]="customizeNgxsmkFormLayout"
    >
      <div
        style="width:100%;height:360px;position:relative;overflow:auto;background:var(--ngxsmk-color-surface-variant);border-radius:8px;padding:1rem;"
      >
        <ngxsmk-form-layout [columns]="2">
          <label class="ngxsmk-demo-field"
            >{{ 'layout.formName' | translate }}<input class="ngxsmk-demo-input"
          /></label>
          <label class="ngxsmk-demo-field"
            >{{ 'layout.formEmail' | translate }}<input class="ngxsmk-demo-input"
          /></label>
          <label class="ngxsmk-demo-field"
            >{{ 'layout.formCompany' | translate }}<input class="ngxsmk-demo-input"
          /></label>
          <label class="ngxsmk-demo-field"
            >{{ 'layout.formRole' | translate }}<input class="ngxsmk-demo-input"
          /></label>
          <label class="ngxsmk-demo-field" style="grid-column:1 / -1;"
            >{{ 'layout.formBio' | translate
            }}<textarea class="ngxsmk-demo-input" rows="3"></textarea>
          </label>
        </ngxsmk-form-layout>
      </div>
    </showcase-example>

    <showcase-example
      [title]="'layout.resizeHandle' | translate"
      [description]="'layout.resizeHandleDesc' | translate"
      [code]="codeResizeHandle"
      [component]="NgxsmkResizeHandle"
      [customize]="customizeNgxsmkResizeHandle"
    >
      <div
        style="display:flex;width:100%;max-width:420px;border:1px solid var(--ngxsmk-color-outline);border-radius:8px;background:var(--ngxsmk-color-surface-variant);overflow:hidden;"
      >
        <div
          [style.width.px]="resizeHandleWidth()"
          style="padding:1rem;min-width:80px;box-sizing:border-box;"
        >
          {{ 'layout.dragHandleResize' | translate }}
        </div>
        <ngxsmk-resize-handle (resizing)="onHandleResizing($event)" />
      </div>
    </showcase-example>

    <showcase-example
      [title]="'layout.layoutRegions' | translate"
      [description]="'layout.layoutRegionsDesc' | translate"
      [code]="codeLayoutRegions"
      [component]="NgxsmkLayout"
    >
      <div
        style="width:100%;height:320px;position:relative;overflow:hidden;border:1px solid var(--ngxsmk-color-outline);border-radius:8px;"
      >
        <ngxsmk-layout style="min-height:0;height:100%;">
          <ngxsmk-layout-header class="ngxsmk-demo-bar">{{
            'layout.header' | translate
          }}</ngxsmk-layout-header>
          <ngxsmk-layout-content style="display:flex;gap:0.75rem;min-height:0;">
            <ngxsmk-layout-panel class="ngxsmk-demo-side">{{
              'layout.panel' | translate
            }}</ngxsmk-layout-panel>
            <div style="flex:1;padding:0.5rem;min-width:0;">
              {{ 'layout.mainContentRegion' | translate }}
            </div>
          </ngxsmk-layout-content>
          <ngxsmk-layout-footer class="ngxsmk-demo-bar">{{
            'layout.footer' | translate
          }}</ngxsmk-layout-footer>
        </ngxsmk-layout>
      </div>
    </showcase-example>
  `,
  styles: `
    :host {
      display: block;
    }

    .ngxsmk-demo-bar {
      padding: 0.5rem 1rem;
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.8125rem;
    }

    .ngxsmk-demo-side {
      width: 140px;
      padding: 1rem;
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      font-size: 0.8125rem;
    }

    .ngxsmk-demo-content {
      padding: 1rem;
    }

    .ngxsmk-demo-field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.8125rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .ngxsmk-demo-input {
      padding: 0.5rem 0.75rem;
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: 8px;
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font: inherit;
    }
  `,
})
export class LayoutPage {
  protected readonly NgxsmkCenter = NgxsmkCenter;
  protected readonly NgxsmkSection = NgxsmkSection;
  protected readonly customizeNgxsmkSection = `/* Theme <ngxsmk-section> via design tokens */
ngxsmk-section {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-headline-sm-line: ;
  --ngxsmk-text-headline-sm-size: ;
}`;
  protected readonly NgxsmkContainer = NgxsmkContainer;
  protected readonly customizeNgxsmkContainer = `/* Theme <ngxsmk-container> via design tokens */
ngxsmk-container {
  --ngxsmk-space-4: ;
}`;
  protected readonly NgxsmkGrid = NgxsmkGrid;
  protected readonly NgxsmkFlex = NgxsmkFlex;
  protected readonly NgxsmkHStack = NgxsmkHStack;
  protected readonly NgxsmkDivider = NgxsmkDivider;
  protected readonly customizeNgxsmkDivider = `/* Theme <ngxsmk-divider> via design tokens */
ngxsmk-divider {
  --ngxsmk-color-outline: ;
}`;
  protected readonly NgxsmkAspectRatio = NgxsmkAspectRatio;
  protected readonly NgxsmkCollapsible = NgxsmkCollapsible;
  protected readonly customizeNgxsmkCollapsible = `/* Theme <ngxsmk-collapsible> via design tokens */
ngxsmk-collapsible {
  --ngxsmk-color-on-surface: ;
  --ngxsmk-color-on-surface-variant: ;
  --ngxsmk-color-outline: ;
  --ngxsmk-color-ring: ;
  --ngxsmk-color-surface: ;
  --ngxsmk-color-surface-hover: ;
  --ngxsmk-duration-normal: ;
  --ngxsmk-ease-out: ;
  --ngxsmk-font-sans: ;
  --ngxsmk-radius-lg: ;
  --ngxsmk-space-3: ;
  --ngxsmk-space-4: ;
  --ngxsmk-text-body-md-line: ;
  --ngxsmk-text-body-md-size: ;
}`;
  protected readonly NgxsmkResizable = NgxsmkResizable;
  protected readonly NgxsmkAppShell = NgxsmkAppShell;
  protected readonly customizeNgxsmkAppShell = `/* Theme <ngxsmk-app-shell> via design tokens */
ngxsmk-app-shell {
  --ngxsmk-font-sans: ;
}`;
  protected readonly NgxsmkFormLayout = NgxsmkFormLayout;
  protected readonly customizeNgxsmkFormLayout = `/* Theme <ngxsmk-form-layout> via design tokens */
ngxsmk-form-layout {
  --ngxsmk-space-4: ;
  --ngxsmk-space-6: ;
}`;
  protected readonly NgxsmkResizeHandle = NgxsmkResizeHandle;
  protected readonly customizeNgxsmkResizeHandle = `/* Theme <ngxsmk-resize-handle> via design tokens */
ngxsmk-resize-handle {
  --ngxsmk-color-outline: ;
  --ngxsmk-color-primary: ;
  --ngxsmk-radius-full: ;
}`;
  protected readonly NgxsmkLayout = NgxsmkLayout;

  protected readonly codeCenter = `<ngxsmk-center>\n  <div>Perfectly centered</div>\n</ngxsmk-center>`;

  protected readonly codeSection = `<ngxsmk-section title="Project overview">\n  <p>Section body content.</p>\n</ngxsmk-section>`;

  protected readonly codeContainer = `<ngxsmk-container size="md">\n  <p>Capped, centered content.</p>\n</ngxsmk-container>`;

  protected readonly codeGrid = `<ngxsmk-grid [cols]="3" gap="0.75rem">\n  <div>Cell 1</div>\n  <div>Cell 2</div>\n  <div>Cell 3</div>\n</ngxsmk-grid>`;

  protected readonly codeFlex = `<ngxsmk-flex [wrap]="true" justify="between" align="center" gap="0.75rem">\n  <div>Flex A</div>\n  <div>Flex B</div>\n</ngxsmk-flex>`;

  protected readonly codeStacks = `<ngxsmk-h-stack gap="0.5rem">\n  <span ngxsmkStackItem>A</span>\n  <span ngxsmkStackItem>B</span>\n</ngxsmk-h-stack>\n\n<ngxsmk-v-stack gap="0.5rem">\n  <span ngxsmkStackItem>Row 1</span>\n</ngxsmk-v-stack>\n\n<ngxsmk-stack direction="horizontal" gap="0.5rem">\n  <span ngxsmkStackItem>X</span>\n</ngxsmk-stack>`;

  protected readonly codeDivider = `<p>Above</p>\n<ngxsmk-divider />\n<p>Below</p>\n\n<ngxsmk-h-stack>\n  <span>Left</span>\n  <ngxsmk-divider orientation="vertical" />\n  <span>Right</span>\n</ngxsmk-h-stack>`;

  protected readonly codeAspect = `<ngxsmk-aspect-ratio ratio="16/9">\n  <div>16 : 9</div>\n</ngxsmk-aspect-ratio>`;

  protected readonly codeSpacer = `<ngxsmk-h-stack>\n  <span>Left</span>\n  <ngxsmk-spacer />\n  <span>Right</span>\n</ngxsmk-h-stack>`;

  protected readonly codeCollapsible = `<ngxsmk-collapsible title="Advanced settings" [open]="true">\n  <p>Hidden details here.</p>\n</ngxsmk-collapsible>`;

  protected readonly codeResizable = `<ngxsmk-resizable initialWidth="260px">\n  <div>Drag the handle to resize.</div>\n</ngxsmk-resizable>`;

  protected readonly codeAppShell = `<ngxsmk-app-shell [sidebar]="true" [footer]="true">\n  <div topbar>Top bar</div>\n  <div sidebar>Sidebar</div>\n  <div>Main content</div>\n  <div footer>Footer</div>\n</ngxsmk-app-shell>`;

  protected readonly codeFormLayout = `<ngxsmk-form-layout [columns]="2">\n  <label>Name<input /></label>\n  <label>Email<input /></label>\n</ngxsmk-form-layout>`;

  protected readonly codeResizeHandle = `<div style="display:flex;">\n  <div [style.width.px]="width()">Resizable panel</div>\n  <ngxsmk-resize-handle (resizing)="onResizing($event)" />\n</div>`;

  protected readonly codeLayoutRegions = `<ngxsmk-layout>\n  <ngxsmk-layout-header>Header</ngxsmk-layout-header>\n  <ngxsmk-layout-content>\n    <ngxsmk-layout-panel>Panel</ngxsmk-layout-panel>\n    <div>Main content</div>\n  </ngxsmk-layout-content>\n  <ngxsmk-layout-footer>Footer</ngxsmk-layout-footer>\n</ngxsmk-layout>`;

  protected readonly resizeHandleWidth = signal(220);

  protected onHandleResizing(event: MouseEvent): void {
    const startPointer = event.clientX;
    const startSize = this.resizeHandleWidth();
    const onMove = (e: MouseEvent) => {
      const next = Math.max(80, startSize + (e.clientX - startPointer));
      this.resizeHandleWidth.set(next);
    };
    const onUp = () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }
}
