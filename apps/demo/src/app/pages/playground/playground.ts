import { NgxsmkCard } from '@ngxsmk/core/card';
import { NgxsmkAvatar } from '@ngxsmk/core/avatar';
import { NgxsmkBadge } from '@ngxsmk/core/badge';
import { NgxsmkButton } from '@ngxsmk/core/button';
import { NgxsmkCheckbox } from '@ngxsmk/core/checkbox';
import { NgxsmkChip } from '@ngxsmk/core/tag';
import { NgxsmkDivider } from '@ngxsmk/core/divider';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkProgress } from '@ngxsmk/core/progress';
import { NgxsmkStat } from '@ngxsmk/core/stat';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkText } from '@ngxsmk/core/text';
import { NgxsmkHStack, NgxsmkVStack } from '@ngxsmk/core/h-stack';
import { NgxsmkDropdownMenu, NgxsmkDropdownMenuItem } from '@ngxsmk/core/dropdown-menu';
import { NgxsmkAlert } from '@ngxsmk/core/alert';

import {
  Component,
  computed,
  signal,
  input,
  forwardRef,
  effect,
  ChangeDetectionStrategy,
  ViewChild,
  ElementRef,
  inject,
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { AppNav } from '../../nav/nav';
import { NgxsmkThemeService } from '@ngxsmk/theme';

interface ASTNode {
  type: string;
  attributes: Record<string, any>;
  children: ASTNode[];
  text?: string;
  /** Absolute offset of the opening '<' in the editor source (inspector click-to-reveal). */
  start?: number;
}

function parseJSX(code: string, offset = 0): ASTNode[] {
  // Blank comments out with same-length whitespace so every node's source
  // offset stays valid against the original editor text.
  const blank = (m: string) => ' '.repeat(m.length);
  code = code.replace(/\{\/\*[\s\S]*?\*\/\}/g, blank).replace(/<!--[\s\S]*?-->/g, blank);
  let pos = 0;

  function parseNode(): ASTNode | null {
    while (pos < code.length && /\s/.test(code.charAt(pos))) pos++;
    if (pos >= code.length) return null;

    if (code.charAt(pos) === '<') {
      if (code.startsWith('</', pos)) {
        return null;
      }

      const tagStart = pos + 1;
      let tagEnd = tagStart;
      while (tagEnd < code.length && /[a-zA-Z0-9_-]/.test(code.charAt(tagEnd))) {
        tagEnd++;
      }
      const tagName = code.substring(tagStart, tagEnd);
      pos = tagEnd;

      const attributes: Record<string, any> = {};
      while (pos < code.length) {
        while (pos < code.length && /\s/.test(code.charAt(pos))) pos++;
        if (pos >= code.length) break;

        if (code.charAt(pos) === '/' || code.charAt(pos) === '>') {
          break;
        }

        const attrStart = pos;
        let attrEnd = attrStart;
        while (attrEnd < code.length && /[a-zA-Z0-9_-]/.test(code.charAt(attrEnd))) {
          attrEnd++;
        }
        const attrName = code.substring(attrStart, attrEnd);
        pos = attrEnd;

        while (pos < code.length && /\s/.test(code.charAt(pos))) pos++;

        if (pos < code.length && code.charAt(pos) === '=') {
          pos++;
          while (pos < code.length && /\s/.test(code.charAt(pos))) pos++;

          if (pos < code.length && (code.charAt(pos) === '"' || code.charAt(pos) === "'")) {
            const quote = code.charAt(pos);
            pos++;
            const valStart = pos;
            while (pos < code.length && code.charAt(pos) !== quote) pos++;
            attributes[attrName] = code.substring(valStart, pos);
            pos++;
          } else if (pos < code.length && code.charAt(pos) === '{') {
            pos++;
            let braceCount = 1;
            const valStart = pos;
            while (pos < code.length && braceCount > 0) {
              if (code.charAt(pos) === '{') braceCount++;
              else if (code.charAt(pos) === '}') braceCount--;
              pos++;
            }
            const rawFull = code.substring(valStart, pos - 1);
            const rawVal = rawFull.trim();
            if (rawVal.startsWith('<')) {
              const lead = rawFull.length - rawFull.trimStart().length;
              attributes[attrName] = parseJSX(rawVal, offset + valStart + lead)[0] || null;
            } else if (rawVal === 'true') {
              attributes[attrName] = true;
            } else if (rawVal === 'false') {
              attributes[attrName] = false;
            } else if (!isNaN(Number(rawVal))) {
              attributes[attrName] = Number(rawVal);
            } else {
              attributes[attrName] = rawVal;
            }
          }
        } else if (attrName) {
          attributes[attrName] = true;
        }
      }

      while (pos < code.length && /\s/.test(code.charAt(pos))) pos++;

      if (pos < code.length && code.startsWith('/>', pos)) {
        pos += 2;
        return { type: tagName, attributes, children: [], start: offset + tagStart - 1 };
      }

      if (pos < code.length && code.charAt(pos) === '>') {
        pos++;
        const children: ASTNode[] = [];
        while (pos < code.length) {
          while (pos < code.length && /\s/.test(code.charAt(pos))) pos++;
          if (pos >= code.length) break;

          if (code.startsWith('</', pos)) {
            pos += 2;
            while (pos < code.length && code.charAt(pos) !== '>') pos++;
            pos++;
            break;
          }

          const child = parseNode();
          if (child) {
            children.push(child);
          }
        }
        return { type: tagName, attributes, children, start: offset + tagStart - 1 };
      }
    } else {
      const textStart = pos;
      while (pos < code.length && code.charAt(pos) !== '<') {
        pos++;
      }
      const text = code.substring(textStart, pos).trim();
      if (text) {
        return { type: 'TEXT_NODE', attributes: {}, children: [], text };
      }
    }
    return null;
  }

  const nodes: ASTNode[] = [];
  while (pos < code.length) {
    const node = parseNode();
    if (node) {
      nodes.push(node);
    } else {
      pos++;
    }
  }
  return nodes;
}

@Component({
  selector: 'ast-renderer',
  standalone: true,
  imports: [
    NgStyle,
    NgxsmkButton,
    NgxsmkBadge,
    NgxsmkChip,
    NgxsmkCard,
    NgxsmkSwitch,
    NgxsmkCheckbox,
    NgxsmkAlert,
    NgxsmkProgress,
    NgxsmkStat,
    NgxsmkAvatar,
    NgxsmkHeading,
    NgxsmkText,
    NgxsmkDivider,
    NgxsmkHStack,
    NgxsmkVStack,
    forwardRef(() => AstRenderer),
  ],
  template: `
    @if (node().type === 'TEXT_NODE') {
      {{ node().text }}
    } @else {
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div
        class="inspect-wrapper"
        [class.inspecting]="parent.inspectMode()"
        [class.hovered]="isInspected()"
        [class.selected]="parent.inspectMode() && parent.inspectedNode() === node()"
        (mouseenter)="onMouseEnter($event)"
        (mouseleave)="onMouseLeave()"
        (click)="onInspectClick($event)"
      >
        @if (parent.inspectMode() && (isInspected() || parent.inspectedNode() === node())) {
          <div class="inspect-label">{{ node().type }}</div>
        }

        @switch (node().type) {
          @case ('Card') {
            <ngxsmk-card
              [style.width.px]="node().attributes['width']"
              [style.padding]="
                node().attributes['padding']
                  ? 'var(--ngxsmk-space-' + node().attributes['padding'] + ')'
                  : null
              "
              style="display:block; margin: 0 auto; max-width: 100%; box-sizing: border-box;"
            >
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-card>
          }
          @case ('Layout') {
            <div class="demo-layout" style="display: flex; flex-direction: column; width: 100%;">
              @if (node().attributes['header']) {
                <div
                  class="demo-layout-header"
                  style="border-bottom: 1px solid var(--ngxsmk-color-outline); padding-bottom: var(--ngxsmk-space-3); margin-bottom: var(--ngxsmk-space-3);"
                >
                  <ast-renderer [node]="node().attributes['header']" />
                </div>
              }
              <div
                class="demo-layout-content"
                style="flex: 1; display: flex; flex-direction: column; gap: var(--ngxsmk-space-3);"
              >
                @for (c of node().children; track $index) {
                  <ast-renderer [node]="c" />
                }
                @if (node().attributes['content']) {
                  <ast-renderer [node]="node().attributes['content']" />
                }
              </div>
              @if (node().attributes['footer']) {
                <div
                  class="demo-layout-footer"
                  style="border-top: 1px solid var(--ngxsmk-color-outline); padding-top: var(--ngxsmk-space-3); margin-top: var(--ngxsmk-space-3);"
                >
                  <ast-renderer [node]="node().attributes['footer']" />
                </div>
              }
            </div>
          }
          @case ('LayoutHeader') {
            <div class="demo-layout-header-content">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </div>
          }
          @case ('LayoutContent') {
            <div
              class="demo-layout-content-content"
              style="display: flex; flex-direction: column; gap: var(--ngxsmk-space-3);"
            >
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </div>
          }
          @case ('LayoutFooter') {
            <div class="demo-layout-footer-content">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </div>
          }
          @case ('Heading') {
            <ngxsmk-heading [level]="headingLevel()" style="margin: 0;">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-heading>
          }
          @case ('Text') {
            <ngxsmk-text
              [variant]="node().attributes['type'] || 'body'"
              [color]="node().attributes['color']"
            >
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-text>
          }
          @case ('Button') {
            <button
              ngxsmk-button
              [variant]="node().attributes['variant'] || 'primary'"
              [size]="node().attributes['size'] || 'md'"
            >
              {{ node().attributes['label'] }}
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </button>
          }
          @case ('HStack') {
            <ngxsmk-h-stack [justify]="justifyContent()">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-h-stack>
          }
          @case ('VStack') {
            <ngxsmk-v-stack>
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-v-stack>
          }
          @case ('Switch') {
            <ngxsmk-switch [checked]="node().attributes['checked']">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-switch>
          }
          @case ('Checkbox') {
            <ngxsmk-checkbox [checked]="node().attributes['checked']">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-checkbox>
          }
          @case ('Badge') {
            <ngxsmk-badge [variant]="node().attributes['variant'] || 'primary'">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-badge>
          }
          @case ('Chip') {
            <ngxsmk-chip [removable]="node().attributes['removable']">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-chip>
          }
          @case ('Alert') {
            <ngxsmk-alert
              [variant]="node().attributes['variant'] || 'info'"
              [title]="node().attributes['title']"
            >
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </ngxsmk-alert>
          }
          @case ('Progress') {
            <ngxsmk-progress
              [value]="node().attributes['value']"
              [label]="node().attributes['label']"
            />
          }
          @case ('Stat') {
            <ngxsmk-stat
              [value]="node().attributes['value']"
              [label]="node().attributes['label']"
              [trend]="node().attributes['trend']"
            />
          }
          @case ('Avatar') {
            <ngxsmk-avatar
              [name]="node().attributes['name']"
              [size]="node().attributes['size'] || 'md'"
            />
          }
          @case ('Divider') {
            <ngxsmk-divider />
          }
          @default {
            <div [ngStyle]="nodeStyles()">
              @for (c of node().children; track $index) {
                <ast-renderer [node]="c" />
              }
            </div>
          }
        }
      </div>
    }
  `,
  styles: `
    .inspect-wrapper {
      position: relative;
      transition: outline 0.15s ease;
    }
    .inspect-wrapper.inspecting:hover {
      outline: 1.5px solid var(--ngxsmk-color-primary);
      outline-offset: 2px;
      border-radius: var(--ngxsmk-radius-sm);
      cursor: crosshair;
    }
    /* Pinned by click: stays outlined after the pointer leaves. */
    .inspect-wrapper.selected {
      outline: 1.5px solid var(--ngxsmk-color-primary);
      outline-offset: 2px;
      border-radius: var(--ngxsmk-radius-sm);
    }
    .inspect-label {
      position: absolute;
      top: -18px;
      left: 2px;
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      font-size: 0.625rem;
      font-family: var(--ngxsmk-font-mono, monospace);
      font-weight: 700;
      padding: 1px 4px;
      border-radius: 3px;
      z-index: 100;
      pointer-events: none;
      line-height: 1;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    .demo-layout {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
    }
    .demo-layout-header {
      padding-bottom: var(--ngxsmk-space-3);
      margin-bottom: var(--ngxsmk-space-3);
    }
    .demo-layout-footer {
      padding-top: var(--ngxsmk-space-3);
      margin-top: var(--ngxsmk-space-3);
    }
    .demo-layout-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AstRenderer {
  readonly node = input.required<ASTNode>();
  protected readonly parent = inject(PlaygroundPage);
  protected readonly isInspected = signal(false);

  headingLevel() {
    const lvl = this.node().attributes['level'] || 2;
    return `h${lvl}` as any;
  }

  justifyContent() {
    const align = this.node().attributes['hAlign'] || 'start';
    if (align === 'end') return 'flex-end';
    if (align === 'center') return 'center';
    if (align === 'between') return 'space-between';
    return 'flex-start';
  }

  nodeStyles() {
    const styles: Record<string, string> = {};
    if (this.node().attributes['style']) {
      const parts = this.node().attributes['style'].split(';');
      for (const part of parts) {
        const [k, v] = part.split(':');
        if (k && v) {
          styles[k.trim()] = v.trim();
        }
      }
    }
    return styles;
  }

  protected onMouseEnter(event: MouseEvent) {
    if (this.parent.inspectMode()) {
      event.stopPropagation();
      this.isInspected.set(true);
    }
  }

  protected onMouseLeave() {
    this.isInspected.set(false);
  }

  /** Inspect mode: click any rendered element to reveal its source in the editor. */
  protected onInspectClick(event: MouseEvent) {
    if (!this.parent.inspectMode()) return;
    event.preventDefault();
    event.stopPropagation();
    this.parent.revealNodeSource(this.node());
  }
}

const TEMPLATES: Record<string, string> = {
  showcase: `import {Card} from '@ngxsmk/core/Card';
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  HStack,
} from '@ngxsmk/core/Layout';
import {Text, Heading} from '@ngxsmk/core/Text';
import {Button} from '@ngxsmk/core/Button';

export default function Example() {
  return (
    <Card width={400} padding={4}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <Heading level={2}>Welcome</Heading>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <Text type="body" color="secondary">
              Try out components in the code editor, open a ready-made template,
              and build your own theme in the theme editor - all in one place.
            </Text>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack hAlign="end">
              <Button label="Get started" variant="primary" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  );
}`,
  'ai-chat': `import {Card} from '@ngxsmk/core/Card';
import {
  Layout,
  LayoutHeader,
  LayoutContent,
  LayoutFooter,
  HStack,
  VStack,
} from '@ngxsmk/core/Layout';
import {Text, Heading} from '@ngxsmk/core/Text';
import {Button} from '@ngxsmk/core/Button';
import {Avatar} from '@ngxsmk/core/Avatar';
import {Alert} from '@ngxsmk/core/Alert';

export default function ChatExample() {
  return (
    <Card width={450} padding={4}>
      <Layout
        header={
          <LayoutHeader hasDivider>
            <HStack>
              <Avatar name="ngxsmk AI" size="sm" />
              <VStack>
                <Heading level={3}>ngxsmk Assistant</Heading>
                <Text type="caption" color="muted">Online</Text>
              </VStack>
            </HStack>
          </LayoutHeader>
        }
        content={
          <LayoutContent>
            <VStack>
              <Alert variant="info" title="System">
                This conversation is encrypted and secure.
              </Alert>
              <HStack>
                <Avatar name="User" size="sm" />
                <Card padding={3}>
                  <Text type="body">How do I customize the brand colors in ngxsmk?</Text>
                </Card>
              </HStack>
              <HStack>
                <Avatar name="ngxsmk AI" size="sm" />
                <Card padding={3} style="background-color: var(--ngxsmk-color-primary-container);">
                  <Text type="body">You can customize brand colors in the Theme Editor under Base Styles, or define a custom primaryScale.</Text>
                </Card>
              </HStack>
            </VStack>
          </LayoutContent>
        }
        footer={
          <LayoutFooter hasDivider>
            <HStack hAlign="end">
              <Button label="Clear" variant="outline" size="sm" />
              <Button label="Send Message" variant="primary" size="sm" />
            </HStack>
          </LayoutFooter>
        }
      />
    </Card>
  );
}`,
  'ai-landing': `<Card width={500} padding={5}>
  <Layout
    header={
      <LayoutHeader>
        <VStack>
          <Heading level={2}>ngxsmk Core Agent</Heading>
          <Text type="body" color="secondary">The most advanced pair programmer for Next.js and StyleX.</Text>
        </VStack>
      </LayoutHeader>
    }
    content={
      <LayoutContent>
        <VStack>
          <Stat value="99.9%" label="Precision Rate" trend="up" />
          <Divider />
          <Progress value={85} label="Scaffolding Workspace" />
        </VStack>
      </LayoutContent>
    }
    footer={
      <LayoutFooter>
        <HStack hAlign="center">
          <Button label="Start Coding Now" variant="primary" />
        </HStack>
      </LayoutFooter>
    }
  />
</Card>`,
  contact: `<Card width={400} padding={4}>
  <Layout
    header={
      <LayoutHeader hasDivider>
        <Heading level={2}>Contact Support</Heading>
        <Text type="caption" color="muted">We typical reply in less than 24 hours.</Text>
      </LayoutHeader>
    }
    content={
      <LayoutContent>
        <VStack>
          <Text type="body">Email Address</Text>
          <Switch checked={true}>Subscribe to product updates</Switch>
          <Checkbox checked={true}>I agree to the terms of service</Checkbox>
        </VStack>
      </LayoutContent>
    }
    footer={
      <LayoutFooter hasDivider>
        <HStack hAlign="end">
          <Button label="Cancel" variant="ghost" />
          <Button label="Submit Request" variant="primary" />
        </HStack>
      </LayoutFooter>
    }
  />
</Card>`,
  checkout: `<Card width={420} padding={4}>
  <Layout
    header={
      <LayoutHeader hasDivider>
        <Heading level={2}>Payment Details</Heading>
        <Text type="caption" color="muted">Enter your billing information below.</Text>
      </LayoutHeader>
    }
    content={
      <LayoutContent>
        <VStack>
          <Text type="body">Cardholder Name</Text>
          <Text type="body">Card Number</Text>
          <HStack>
            <Text type="body">Expiry Date</Text>
            <Text type="body">CVV</Text>
          </HStack>
        </VStack>
      </LayoutContent>
    }
    footer={
      <LayoutFooter hasDivider>
        <VStack>
          <Button label="Pay $49.00" variant="primary" style="width: 100%;" />
        </VStack>
      </LayoutFooter>
    }
  />
</Card>`,
  login: `<Card width={380} padding={4}>
  <Layout
    header={
      <LayoutHeader hasDivider>
        <Heading level={2}>Sign In</Heading>
        <Text type="caption" color="muted">Enter your email and password to log in.</Text>
      </LayoutHeader>
    }
    content={
      <LayoutContent>
        <VStack>
          <Text type="body">Email address</Text>
          <Text type="body">Password</Text>
          <HStack justify="between">
            <Checkbox checked={true}>Remember me</Checkbox>
            <Button label="Forgot Password?" variant="ghost" size="sm" />
          </HStack>
        </VStack>
      </LayoutContent>
    }
    footer={
      <LayoutFooter hasDivider>
        <VStack>
          <Button label="Sign In" variant="primary" style="width: 100%;" />
          <Button label="Continue with SSO" variant="outline" style="width: 100%; margin-top: 8px;" />
        </VStack>
      </LayoutFooter>
    }
  />
</Card>`,
};

const RADII = { sm: 4, md: 8, lg: 12, xl: 18 } as const;
type RadiusKey = keyof typeof RADII;

@Component({
  selector: 'playground-page',
  standalone: true,
  imports: [
    NgStyle,
    AppNav,
    NgxsmkButton,
    NgxsmkSwitch,
    NgxsmkHeading,
    NgxsmkHStack,
    NgxsmkDropdownMenu,
    AstRenderer,
    TranslatePipe,
  ],
  template: `
    <app-nav />

    <div class="pg-container">
      <!-- LEFT SIDENAV (ngxsmk views selectors) -->
      <aside class="pg-sidenav">
        <button
          type="button"
          [attr.aria-label]="'playground.codeEditor' | translate"
          class="sidenav-btn"
          [class.active]="tab() === 'code'"
          (click)="tab.set('code')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-code-xml"
          >
            <path d="m18 16 4-4-4-4"></path>
            <path d="m6 8-4 4 4 4"></path>
            <path d="m14.5 4-5 16"></path>
          </svg>
        </button>
        <button
          type="button"
          [attr.aria-label]="'playground.themeEditor' | translate"
          class="sidenav-btn"
          [class.active]="tab() === 'theme'"
          (click)="tab.set('theme')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-palette"
          >
            <path
              d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"
            ></path>
            <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle>
            <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle>
            <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle>
            <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </svg>
        </button>
      </aside>

      <!-- MAIN CONFIG PANEL (440px width) -->
      <section class="pg-panel">
        <header class="panel-head">
          <ngxsmk-h-stack justify="space-between" align="center" style="width: 100%;">
            <ngxsmk-heading level="h3" style="margin: 0; font-size: 1.25rem; font-weight: 700;">{{
              'playground.title' | translate
            }}</ngxsmk-heading>

            <ngxsmk-h-stack gap="var(--ngxsmk-space-2)">
              <ngxsmk-dropdown-menu [items]="themeMenuItems">
                <button
                  type="button"
                  ngxsmk-button
                  variant="secondary"
                  size="sm"
                  ngxsmkDropdownTrigger
                >
                  {{ 'nav.themes' | translate }}
                  <svg
                    style="margin-left:4px;"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </ngxsmk-dropdown-menu>

              <ngxsmk-dropdown-menu [items]="templateMenuItems">
                <button
                  type="button"
                  ngxsmk-button
                  variant="secondary"
                  size="sm"
                  ngxsmkDropdownTrigger
                >
                  {{ 'nav.templates' | translate }}
                  <svg
                    style="margin-left:4px;"
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="m6 9 6 6 6-6" />
                  </svg>
                </button>
              </ngxsmk-dropdown-menu>
            </ngxsmk-h-stack>
          </ngxsmk-h-stack>
        </header>

        <!-- VIEW 1: CODE EDITOR -->
        @if (tab() === 'code') {
          <div class="panel-content editor-panel">
            <div class="editor-container">
              <div class="line-numbers" #linesEl>
                @for (line of lines(); track $index) {
                  <div>{{ $index + 1 }}</div>
                }
              </div>
              <div class="textarea-wrapper">
                <pre class="highlight-pre" #highlightPreEl [innerHTML]="highlightedCode()"></pre>
                <textarea
                  class="editor-textarea"
                  [value]="editorCode()"
                  (input)="onCodeChange($any($event.target).value)"
                  (scroll)="syncScroll($event)"
                  spellcheck="false"
                  #textareaEl
                ></textarea>
              </div>
            </div>
          </div>
        }

        <!-- VIEW 2: THEME EDITOR -->
        @if (tab() === 'theme') {
          <div class="panel-content theme-panel">
            <nav class="theme-tabs">
              <button
                type="button"
                class="theme-tab-btn"
                [class.active]="themeTab() === 'base'"
                (click)="themeTab.set('base')"
              >
                {{ 'playground.tab.baseStyles' | translate }}
              </button>
              <button
                type="button"
                class="theme-tab-btn"
                [class.active]="themeTab() === 'components'"
                (click)="themeTab.set('components')"
              >
                {{ 'nav.components' | translate }}
              </button>
              <button
                type="button"
                class="theme-tab-btn"
                [class.active]="themeTab() === 'advanced'"
                (click)="themeTab.set('advanced')"
              >
                {{ 'playground.tab.advanced' | translate }}
              </button>
            </nav>

            <div class="theme-tab-content">
              @if (themeTab() === 'base') {
                <div class="theme-group">
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.createFromAccent' | translate
                    }}</span>
                    <ngxsmk-switch
                      [checked]="createFromAccent()"
                      (checkedChange)="createFromAccent.set($event)"
                    />
                  </div>

                  <div class="control-divider"></div>

                  <!-- ACCENT -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.colorAccent' | translate
                    }}</span>
                    <div class="color-picker-container">
                      <input
                        type="color"
                        class="color-swatch"
                        [value]="accent()"
                        (input)="accent.set($any($event.target).value)"
                      />
                      <input
                        type="text"
                        class="color-input"
                        [value]="accent()"
                        (input)="accent.set($any($event.target).value)"
                      />
                    </div>
                  </div>

                  <!-- NEUTRAL -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.colorNeutral' | translate
                    }}</span>
                    <div class="color-picker-container">
                      <input
                        type="color"
                        class="color-swatch"
                        [value]="neutral()"
                        (input)="neutral.set($any($event.target).value)"
                      />
                      <input
                        type="text"
                        class="color-input"
                        [value]="neutral()"
                        (input)="neutral.set($any($event.target).value)"
                      />
                    </div>
                  </div>

                  <!-- CARD -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.colorCard' | translate
                    }}</span>
                    <div class="color-picker-container">
                      <input
                        type="color"
                        class="color-swatch"
                        [value]="cardBg()"
                        (input)="cardBg.set($any($event.target).value)"
                      />
                      <input
                        type="text"
                        class="color-input"
                        [value]="cardBg()"
                        (input)="cardBg.set($any($event.target).value)"
                      />
                    </div>
                  </div>

                  <!-- SURFACE / BACKGROUND -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.colorSurface' | translate
                    }}</span>
                    <div class="color-picker-container">
                      <input
                        type="color"
                        class="color-swatch"
                        [value]="appBg()"
                        (input)="appBg.set($any($event.target).value)"
                      />
                      <input
                        type="text"
                        class="color-input"
                        [value]="appBg()"
                        (input)="appBg.set($any($event.target).value)"
                      />
                    </div>
                  </div>

                  <!-- TEXT -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.colorTextPrimary' | translate
                    }}</span>
                    <div class="color-picker-container">
                      <input
                        type="color"
                        class="color-swatch"
                        [value]="text()"
                        (input)="text.set($any($event.target).value)"
                      />
                      <input
                        type="text"
                        class="color-input"
                        [value]="text()"
                        (input)="text.set($any($event.target).value)"
                      />
                    </div>
                  </div>

                  <div class="control-divider"></div>

                  <!-- DENSITY PRESET -->
                  <div class="theme-control-row col">
                    <span class="control-label">{{
                      'playground.control.presetDensity' | translate
                    }}</span>
                    <div class="segmented-control">
                      <button
                        type="button"
                        class="seg-btn"
                        [class.active]="density() === 'compact'"
                        (click)="density.set('compact')"
                      >
                        {{ 'playground.density.compact' | translate }}
                      </button>
                      <button
                        type="button"
                        class="seg-btn"
                        [class.active]="density() === 'default'"
                        (click)="density.set('default')"
                      >
                        {{ 'playground.density.default' | translate }}
                      </button>
                      <button
                        type="button"
                        class="seg-btn"
                        [class.active]="density() === 'comfortable'"
                        (click)="density.set('comfortable')"
                      >
                        {{ 'playground.density.comfortable' | translate }}
                      </button>
                      <button
                        type="button"
                        class="seg-btn"
                        [class.active]="density() === 'gigantic'"
                        (click)="density.set('gigantic')"
                      >
                        {{ 'playground.density.gigantic' | translate }}
                      </button>
                    </div>
                  </div>

                  <div class="control-divider"></div>

                  <!-- HEADING FONT -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.headingFont' | translate
                    }}</span>
                    <select
                      class="theme-select"
                      [value]="headingFont()"
                      (change)="headingFont.set($any($event.target).value)"
                    >
                      @for (f of fonts; track f.value) {
                        <option [value]="f.value">{{ f.label }}</option>
                      }
                    </select>
                  </div>

                  <!-- BODY FONT -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.bodyFont' | translate
                    }}</span>
                    <select
                      class="theme-select"
                      [value]="bodyFont()"
                      (change)="bodyFont.set($any($event.target).value)"
                    >
                      @for (f of fonts; track f.value) {
                        <option [value]="f.value">{{ f.label }}</option>
                      }
                    </select>
                  </div>

                  <!-- TYPE SCALE -->
                  <div class="theme-control-row">
                    <span class="control-label">{{
                      'playground.control.typeScale' | translate
                    }}</span>
                    <select
                      class="theme-select"
                      [value]="scale()"
                      (change)="scale.set(+$any($event.target).value)"
                    >
                      @for (s of scales; track s.value) {
                        <option [value]="s.value">{{ s.label | translate }}</option>
                      }
                    </select>
                  </div>

                  <div class="control-divider"></div>

                  <!-- CORNER RADIUS -->
                  <div class="theme-control-row col">
                    <span class="control-label">{{
                      'playground.control.cornerRadius' | translate
                    }}</span>
                    <div class="segmented-control">
                      @for (r of radii; track r.key) {
                        <button
                          type="button"
                          class="seg-btn"
                          [class.active]="radius() === r.key"
                          (click)="radius.set(r.key)"
                        >
                          {{ r.label }}
                        </button>
                      }
                    </div>
                  </div>
                </div>
              }

              @if (themeTab() === 'components') {
                <div class="theme-group empty-state">
                  <span class="empty-title">{{
                    'playground.empty.components.title' | translate
                  }}</span>
                  <span class="empty-desc">{{
                    'playground.empty.components.desc' | translate
                  }}</span>
                </div>
              }

              @if (themeTab() === 'advanced') {
                <div class="theme-group empty-state">
                  <span class="empty-title">{{
                    'playground.empty.advanced.title' | translate
                  }}</span>
                  <span class="empty-desc">{{ 'playground.empty.advanced.desc' | translate }}</span>
                </div>
              }
            </div>
          </div>
        }
      </section>

      <!-- RIGHT PREVIEW CANVAS CONTAINER -->
      <main class="pg-main-preview">
        <!-- TOOLBAR -->
        <header class="preview-toolbar">
          <!-- ZOOM -->
          <ngxsmk-h-stack gap="var(--ngxsmk-space-2)">
            <button
              type="button"
              class="toolbar-btn"
              [class.active]="scaleZoom() === '0.5x'"
              (click)="scaleZoom.set('0.5x')"
            >
              0.5×
            </button>
            <button
              type="button"
              class="toolbar-btn"
              [class.active]="scaleZoom() === '1x'"
              (click)="scaleZoom.set('1x')"
            >
              1×
            </button>
            <button
              type="button"
              class="toolbar-btn"
              [class.active]="scaleZoom() === '1.5x'"
              (click)="scaleZoom.set('1.5x')"
            >
              1.5×
            </button>
            <button
              type="button"
              class="toolbar-btn"
              [class.active]="scaleZoom() === '2x'"
              (click)="scaleZoom.set('2x')"
            >
              2×
            </button>
          </ngxsmk-h-stack>

          <!-- RESPONSIVE VIEWPORTS -->
          <ngxsmk-h-stack gap="var(--ngxsmk-space-2)" class="center-controls">
            <button
              type="button"
              class="toolbar-btn text-btn"
              [class.active]="viewportMode() === 'desktop'"
              (click)="viewportMode.set('desktop')"
            >
              {{ 'playground.viewport.desktop' | translate }}
            </button>
            <button
              type="button"
              class="toolbar-btn text-btn"
              [class.active]="viewportMode() === 'phone'"
              (click)="viewportMode.set('phone')"
            >
              {{ 'playground.viewport.phone' | translate }}
            </button>
            <button
              type="button"
              class="toolbar-btn text-btn"
              [class.active]="viewportMode() === 'expand'"
              (click)="viewportMode.set('expand')"
            >
              {{ 'playground.viewport.expand' | translate }}
            </button>
          </ngxsmk-h-stack>

          <!-- ACTIONS -->
          <ngxsmk-h-stack gap="var(--ngxsmk-space-2)">
            <!-- GRID TOGGLE -->
            <button
              type="button"
              class="toolbar-btn icon-btn"
              [class.active]="showGrid()"
              (click)="showGrid.set(!showGrid())"
              [attr.title]="'playground.toggleGrid' | translate"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-grid-3x3"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <path d="M3 9h18" />
                <path d="M3 15h18" />
                <path d="M9 3v18" />
                <path d="M15 3v18" />
              </svg>
            </button>
            <!-- INSPECTOR TOGGLE -->
            <button
              type="button"
              class="toolbar-btn icon-btn"
              [class.active]="inspectMode()"
              (click)="toggleInspect()"
              [attr.title]="'playground.toggleInspector' | translate"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="lucide lucide-mouse-pointer-click"
              >
                <path d="M14 4.1 12 6" />
                <path
                  d="m5.1 8-2.9-.8a1 1 0 0 1-.2-1.8l16-12a1 1 0 0 1 1.4 1.4l-12 16a1 1 0 0 1-1.8-.2z"
                />
                <path d="m8.3 9.6 1.8 1.8" />
                <path d="m19 19-5-5" />
                <path d="M14 19v-3" />
                <path d="M19 14h-3" />
              </svg>
            </button>
            <!-- DARK MODE -->
            <button
              type="button"
              class="toolbar-btn icon-btn"
              (click)="toggleDarkMode()"
              [attr.title]="'playground.toggleDarkMode' | translate"
            >
              @if (mode() === 'dark') {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-sun"
                >
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
              } @else {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-moon"
                >
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
              }
            </button>
            <button type="button" class="toolbar-btn text-btn" (click)="copyLink()">
              {{
                linkCopied()
                  ? ('playground.copied' | translate)
                  : ('playground.copyUrl' | translate)
              }}
            </button>
            <button
              type="button"
              class="toolbar-btn text-btn primary"
              (click)="showDownloadModal.set(true)"
            >
              {{ 'playground.downloadTheme' | translate }}
            </button>
          </ngxsmk-h-stack>
        </header>

        <!-- CANVAS AREA -->
        <div
          class="canvas-scroll-area"
          [class.dark]="mode() === 'dark'"
          [class.show-grid]="showGrid()"
          [style.background]="
            mode() === 'dark' ? 'var(--ngxsmk-color-neutral-950)' : 'var(--ngxsmk-color-background)'
          "
        >
          <div
            class="canvas-viewport"
            [class.phone]="viewportMode() === 'phone'"
            [class.expand]="viewportMode() === 'expand'"
            [style.transform]="zoomScaleStyle()"
            [ngStyle]="tokens()"
          >
            <div class="canvas-render-wrapper">
              @for (node of parsedCode(); track $index) {
                <ast-renderer [node]="node" />
              }
            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- MODERN DOWNLOAD/EXPORT FORMATS MODAL -->
    @if (showDownloadModal()) {
      <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
      <div class="modal-overlay" (click)="showDownloadModal.set(false)">
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="modal-card" (click)="$event.stopPropagation()">
          <header class="modal-head">
            <ngxsmk-heading level="h3" style="margin: 0; font-size: 1.15rem; font-weight: 700;">{{
              'playground.export.title' | translate
            }}</ngxsmk-heading>
            <button type="button" class="close-btn" (click)="showDownloadModal.set(false)">
              &times;
            </button>
          </header>

          <nav class="modal-tabs">
            <button
              type="button"
              class="modal-tab-btn"
              [class.active]="exportFormat() === 'css'"
              (click)="exportFormat.set('css')"
            >
              {{ 'playground.export.css' | translate }}
            </button>
            <button
              type="button"
              class="modal-tab-btn"
              [class.active]="exportFormat() === 'scss'"
              (click)="exportFormat.set('scss')"
            >
              SCSS
            </button>
            <button
              type="button"
              class="modal-tab-btn"
              [class.active]="exportFormat() === 'tailwind'"
              (click)="exportFormat.set('tailwind')"
            >
              {{ 'playground.export.tailwind' | translate }}
            </button>
            <button
              type="button"
              class="modal-tab-btn"
              [class.active]="exportFormat() === 'stylex'"
              (click)="exportFormat.set('stylex')"
            >
              {{ 'playground.export.stylex' | translate }}
            </button>
            <button
              type="button"
              class="modal-tab-btn"
              [class.active]="exportFormat() === 'figma'"
              (click)="exportFormat.set('figma')"
            >
              Figma
            </button>
          </nav>

          <div class="modal-body">
            <pre class="export-pre"><code>{{ exportCode() }}</code></pre>
          </div>

          <footer class="modal-footer">
            <button
              type="button"
              ngxsmk-button
              variant="outline"
              size="sm"
              (click)="copyExportCode()"
            >
              {{
                exportCopied()
                  ? ('playground.export.copied' | translate)
                  : ('playground.export.copyCode' | translate)
              }}
            </button>
            <button
              type="button"
              ngxsmk-button
              variant="primary"
              size="sm"
              (click)="triggerDownload()"
            >
              {{ 'playground.export.downloadConfig' | translate }}
            </button>
          </footer>
        </div>
      </div>
    }
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans, system-ui);
      color: var(--ngxsmk-color-on-background);
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
      height: 100vh;
      overflow: hidden;
    }

    /* ---- CUSTOM SCROLLBARS ---- */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    /* Default thumb follows the theme; the always-dark editor pane and
       dark preview override with a light thumb. */
    ::-webkit-scrollbar-thumb {
      background: var(--ngxsmk-color-outline-strong);
      border-radius: 99px;
    }
    .dark ::-webkit-scrollbar-thumb,
    .editor-panel ::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.12);
    }

    .pg-container {
      display: flex;
      flex-direction: row;
      height: calc(100vh - 3.5rem);
      background-color: var(--ngxsmk-color-background, #fafafa);
      background-image: radial-gradient(var(--ngxsmk-color-outline, #e4e4e7) 1px, transparent 1px);
      background-size: 24px 24px;
    }

    /* ---- LEFT SIDENAV ----
       Instrument rail: always dark like a camera body, but built from
       the neutral scale so every preset harmonizes with it. */
    .pg-sidenav {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--ngxsmk-space-3);
      width: 3.5rem;
      padding: var(--ngxsmk-space-4) 0;
      background: var(--ngxsmk-color-neutral-950);
      border-inline-end: 1px solid var(--ngxsmk-color-neutral-800);
    }

    .sidenav-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.5rem;
      height: 2.5rem;
      border-radius: var(--ngxsmk-radius-md);
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-neutral-400);
      cursor: pointer;
      transition:
        color var(--ngxsmk-duration-normal, 250ms) var(--ngxsmk-ease-in-out),
        background var(--ngxsmk-duration-normal, 250ms) var(--ngxsmk-ease-in-out),
        box-shadow var(--ngxsmk-duration-normal, 250ms) var(--ngxsmk-ease-in-out);
    }

    .sidenav-btn:hover {
      color: #ffffff;
      background: var(--ngxsmk-color-neutral-800);
    }

    .sidenav-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }

    /* Active = indicator light: primary edge on the rail. */
    .sidenav-btn.active {
      color: #ffffff;
      background: var(--ngxsmk-color-neutral-700);
      box-shadow:
        inset 2px 0 0 var(--ngxsmk-color-primary),
        inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }

    /* ---- CONFIG PANEL (Obsidian Glassmorphism) ---- */
    .pg-panel {
      display: flex;
      flex-direction: column;
      width: 440px;
      backdrop-filter: blur(12px);
      border-right: 1px solid var(--ngxsmk-color-outline);
      border-radius: 0;
    }

    .dark .pg-panel {
      background: color-mix(in srgb, var(--ngxsmk-color-neutral-900) 85%, transparent);
      border-right: 1px solid var(--ngxsmk-color-neutral-800);
    }

    .panel-head {
      display: flex;
      align-items: center;
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-5);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .dark .panel-head {
      border-bottom: 1px solid var(--ngxsmk-color-neutral-800);
    }

    .panel-content {
      flex: 1;
      overflow-y: auto;
    }

    /* ---- CODE EDITOR VIEW (always-dark instrument surface) ---- */
    .editor-panel {
      padding: 0;
      background: var(--ngxsmk-color-neutral-950);
    }

    .editor-container {
      display: flex;
      flex-direction: row;
      height: 100%;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.8125rem;
      line-height: 1.6;
      position: relative;
    }

    .line-numbers {
      padding: var(--ngxsmk-space-4) 0;
      width: 2.75rem;
      text-align: right;
      color: var(--ngxsmk-color-neutral-600);
      user-select: none;
      background: var(--ngxsmk-color-neutral-950);
      border-right: 1px solid var(--ngxsmk-color-neutral-800);
      overflow-y: hidden;
      font-size: 0.75rem;
    }

    .line-numbers div {
      padding-right: 0.5rem;
    }

    .textarea-wrapper {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .editor-textarea,
    .highlight-pre {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: var(--ngxsmk-space-4);
      margin: 0;
      border: none;
      font-family: inherit;
      font-size: inherit;
      line-height: inherit;
      white-space: pre;
      overflow: auto;
      box-sizing: border-box;
    }

    .editor-textarea {
      background: transparent;
      color: transparent;
      caret-color: #ffffff;
      resize: none;
      outline: none;
      z-index: 2;
    }

    .highlight-pre {
      background: var(--ngxsmk-color-neutral-950);
      color: var(--ngxsmk-color-neutral-300);
      z-index: 1;
      pointer-events: none;
    }

    /* ---- SYNTAX HIGHLIGHT TOKEN COLORS ---- */
    ::ng-deep .hl-keyword {
      color: #f472b6 !important;
      font-weight: 600;
    }
    ::ng-deep .hl-tag {
      color: #818cf8 !important;
    }
    ::ng-deep .hl-tag-html {
      color: #fb7185 !important;
    }
    ::ng-deep .hl-attr {
      color: #38bdf8 !important;
    }
    ::ng-deep .hl-str {
      color: #34d399 !important;
    }
    ::ng-deep .hl-brace {
      color: #fbbf24 !important;
    }
    ::ng-deep .hl-comment {
      color: #71717a !important;
      font-style: italic;
    }

    /* ---- THEME EDITOR VIEW ---- */
    .theme-panel {
      display: flex;
      flex-direction: column;
    }

    .theme-tabs {
      display: flex;
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      padding: 0 var(--ngxsmk-space-3);
    }

    .theme-tab-btn {
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-4);
      border: none;
      background: transparent;
      font-family: inherit;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      position: relative;
      transition: color var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-out);
    }

    .theme-tab-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
      border-radius: var(--ngxsmk-radius-sm);
    }

    .theme-tab-btn.active {
      color: var(--ngxsmk-color-on-surface);
    }

    .theme-tab-btn.active::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: var(--ngxsmk-space-4);
      right: var(--ngxsmk-space-4);
      height: 2px;
      background: var(--ngxsmk-color-primary);
      border-radius: 99px;
    }

    .theme-tab-content {
      flex: 1;
      overflow-y: auto;
      padding: var(--ngxsmk-space-5);
    }

    .theme-group {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-4);
    }

    .theme-control-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--ngxsmk-space-4);
    }

    .theme-control-row.col {
      flex-direction: column;
      align-items: flex-start;
      gap: var(--ngxsmk-space-2);
    }

    .control-label {
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
    }

    .color-picker-container {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      padding: 2px var(--ngxsmk-space-2) 2px 2px;
      background: var(--ngxsmk-color-surface);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
      transition: border-color 0.2s ease;
    }

    .color-picker-container:hover {
      border-color: var(--ngxsmk-color-outline-strong);
    }

    .color-swatch {
      width: 1.75rem;
      height: 1.75rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      background: none;
      padding: 0;
      box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
    }

    .color-swatch::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .color-swatch::-webkit-color-swatch {
      border: none;
      border-radius: 4px;
    }

    .color-input {
      width: 5rem;
      border: none;
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.75rem;
      outline: none;
    }

    .control-divider {
      height: 1px;
      background: var(--ngxsmk-color-outline-variant);
      margin: var(--ngxsmk-space-2) 0;
    }

    .segmented-control {
      display: flex;
      width: 100%;
      background: var(--ngxsmk-color-surface-variant);
      border-radius: var(--ngxsmk-radius-md);
      padding: 2px;
      gap: 2px;
      box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
    }

    .seg-btn {
      flex: 1;
      padding: var(--ngxsmk-space-2);
      border: none;
      background: transparent;
      border-radius: calc(var(--ngxsmk-radius-md) - 2px);
      font-family: inherit;
      font-size: 0.725rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-in-out),
        color var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-in-out),
        box-shadow var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-in-out);
    }

    .seg-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }

    .seg-btn.active {
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    }

    .theme-select {
      width: 10rem;
      padding: var(--ngxsmk-space-2);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      font-size: 0.8125rem;
      outline: none;
      cursor: pointer;
      transition: border-color 0.2s ease;
    }

    .theme-select:hover {
      border-color: var(--ngxsmk-color-outline-strong);
    }

    .theme-group.empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: var(--ngxsmk-space-8) var(--ngxsmk-space-5);
      border: 1px dashed var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
    }

    .empty-title {
      font-size: 0.875rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface);
      margin-bottom: var(--ngxsmk-space-1);
    }

    .empty-desc {
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    /* ---- RIGHT PREVIEW MAIN ---- */
    .pg-main-preview {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    .preview-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ngxsmk-space-3) var(--ngxsmk-space-5);
      background: var(--ngxsmk-color-surface);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      position: relative;
    }

    .dark .preview-toolbar {
      border-bottom: 1px solid var(--ngxsmk-color-neutral-800);
    }

    .toolbar-btn {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      border: 1px solid transparent;
      background: transparent;
      border-radius: var(--ngxsmk-radius-md);
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-in-out),
        color var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-in-out),
        border-color var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-in-out);
    }

    .toolbar-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }

    .toolbar-btn:hover {
      background: var(--ngxsmk-color-surface-hover);
      color: var(--ngxsmk-color-on-surface);
    }

    .toolbar-btn.active {
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface);
      border-color: var(--ngxsmk-color-outline);
    }

    .toolbar-btn.text-btn {
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
    }

    .toolbar-btn.text-btn.active {
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      border-color: var(--ngxsmk-color-primary);
    }

    .toolbar-btn.text-btn.primary {
      background: var(--ngxsmk-color-primary);
      color: var(--ngxsmk-color-on-primary);
      border-color: var(--ngxsmk-color-primary);
    }

    .toolbar-btn.text-btn.primary:hover {
      background: var(--ngxsmk-color-primary-hover);
    }

    .toolbar-btn.icon-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.25rem;
      height: 2.25rem;
      padding: 0;
      border: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface);
    }

    .center-controls {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    /* ---- FIGMA DOT-GRID BACKGROUND ---- */
    .canvas-scroll-area {
      flex: 1;
      overflow: auto;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--ngxsmk-space-8);
      position: relative;
      transition: background 0.2s ease;
    }

    .canvas-scroll-area.show-grid {
      background-image: radial-gradient(
        color-mix(in srgb, var(--ngxsmk-color-outline-strong) 70%, transparent) 1px,
        transparent 1px
      );
      background-size: 20px 20px;
    }

    .canvas-scroll-area.dark.show-grid {
      background-image: radial-gradient(var(--ngxsmk-color-neutral-800) 1px, transparent 1px);
      background-size: 20px 20px;
    }

    .canvas-viewport {
      background: var(--ngxsmk-color-background);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-xl);
      box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.06);
      width: 100%;
      max-width: 900px;
      min-height: 500px;
      padding: var(--ngxsmk-space-8);
      transition:
        width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        max-width 0.3s cubic-bezier(0.4, 0, 0.2, 1),
        transform 0.15s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .canvas-viewport.phone {
      width: 400px;
      max-width: min(400px, 100%);
    }

    .canvas-viewport.expand {
      width: 100%;
      max-width: none;
    }

    .canvas-render-wrapper {
      width: 100%;
    }

    /* ---- MODERN MODAL DIALOG ---- */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(9, 9, 11, 0.7);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--ngxsmk-z-modal, 2000);
      animation: fadeIn 0.2s ease-out;
    }

    .modal-card {
      background: var(--ngxsmk-color-surface);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-lg);
      width: 500px;
      max-width: 90vw;
      box-shadow: var(--ngxsmk-shadow-2xl);
      display: flex;
      flex-direction: column;
      animation: slideIn 0.25s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .modal-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-5);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
    }

    .close-btn {
      font-size: 1.5rem;
      border: none;
      background: transparent;
      cursor: pointer;
      color: var(--ngxsmk-color-on-surface-variant);
    }

    .modal-tabs {
      display: flex;
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-3);
      background: var(--ngxsmk-color-surface-variant);
      border-bottom: 1px solid var(--ngxsmk-color-outline);
      gap: var(--ngxsmk-space-1);
    }

    .modal-tab-btn {
      padding: var(--ngxsmk-space-2) var(--ngxsmk-space-4);
      border: none;
      background: transparent;
      border-radius: var(--ngxsmk-radius-md);
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant);
      cursor: pointer;
      transition:
        background var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-out),
        color var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-out),
        box-shadow var(--ngxsmk-duration-normal, 200ms) var(--ngxsmk-ease-out);
    }

    .modal-tab-btn:focus-visible {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring, var(--ngxsmk-shadow-focus));
    }

    .modal-tab-btn.active {
      background: var(--ngxsmk-color-surface);
      color: var(--ngxsmk-color-on-surface);
      box-shadow: var(--ngxsmk-shadow-sm);
    }

    .modal-body {
      padding: var(--ngxsmk-space-5);
      background: var(--ngxsmk-color-neutral-950);
      overflow-y: auto;
      max-height: 350px;
    }

    .export-pre {
      margin: 0;
      font-family: var(--ngxsmk-font-mono);
      font-size: 0.8125rem;
      line-height: 1.6;
      color: #34d399;
      white-space: pre-wrap;
    }

    .modal-footer {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: var(--ngxsmk-space-3);
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-5);
      border-top: 1px solid var(--ngxsmk-color-outline);
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes slideIn {
      from {
        transform: translateY(10px) scale(0.98);
        opacity: 0;
      }
      to {
        transform: translateY(0) scale(1);
        opacity: 1;
      }
    }

    @media (max-width: 1024px) {
      .pg-container {
        flex-direction: column;
      }
      .pg-panel {
        width: 100%;
        height: auto;
      }
      .center-controls {
        position: static;
        transform: none;
      }
    }
  `,
})
export class PlaygroundPage {
  @ViewChild('linesEl') linesEl?: ElementRef<HTMLElement>;
  @ViewChild('highlightPreEl') highlightPreEl?: ElementRef<HTMLElement>;
  @ViewChild('textareaEl') textareaEl?: ElementRef<HTMLTextAreaElement>;

  protected readonly tab = signal<'code' | 'theme'>('code');
  protected readonly themeTab = signal<'base' | 'components' | 'advanced'>('base');

  private readonly themeService = inject(NgxsmkThemeService);

  // Code Editor state
  protected readonly editorCode = signal<string>(TEMPLATES['showcase']);
  protected readonly lines = computed(() => {
    return this.editorCode().split('\n');
  });

  // Highlighted code output helper
  protected readonly highlightedCode = computed(() => {
    return this.highlightCode(this.editorCode());
  });

  // Theme states
  protected readonly createFromAccent = signal(false);
  protected readonly accent = signal('#0064e0');
  protected readonly neutral = signal('#a1a1aa');
  protected readonly cardBg = signal('#ffffff');
  protected readonly appBg = signal('#fafafa');
  protected readonly text = signal('#09090b');
  protected readonly density = signal<'compact' | 'default' | 'comfortable' | 'gigantic'>(
    'default',
  );
  protected readonly headingFont = signal("'Inter', system-ui, sans-serif");
  protected readonly bodyFont = signal("'Inter', system-ui, sans-serif");
  protected readonly scale = signal(1.2);
  protected readonly radius = signal<RadiusKey>('md');
  protected readonly mode = signal<'light' | 'dark'>('light');

  // Preview options
  protected readonly scaleZoom = signal<'0.5x' | '1x' | '1.5x' | '2x'>('1x');
  protected readonly viewportMode = signal<'desktop' | 'phone' | 'expand'>('expand');
  protected readonly showGrid = signal(true);
  readonly inspectMode = signal(false);
  /** Node pinned by an inspector click; drives the persistent outline + label. */
  readonly inspectedNode = signal<ASTNode | null>(null);

  protected toggleInspect(): void {
    const next = !this.inspectMode();
    this.inspectMode.set(next);
    if (!next) {
      this.inspectedNode.set(null);
    }
  }

  /**
   * Inspector click-to-reveal: pin the node, switch to the code editor,
   * scroll to the node's source, and select its opening tag.
   */
  revealNodeSource(node: ASTNode): void {
    this.inspectedNode.set(node);
    if (node.start == null) return;
    this.tab.set('code');
    // The editor sits behind an @if — let it render before driving the DOM.
    setTimeout(() => {
      const ta = this.textareaEl?.nativeElement;
      if (!ta) return;
      const code = this.editorCode();
      const start = Math.min(node.start ?? 0, code.length);
      const tagEnd = Math.min(start + 1 + node.type.length, code.length);
      ta.focus();
      ta.setSelectionRange(start, tagEnd);
      const line = code.slice(0, start).split('\n').length - 1;
      const lineHeight = parseFloat(getComputedStyle(ta).lineHeight) || 21;
      ta.scrollTop = Math.max(0, line * lineHeight - ta.clientHeight / 3);
      // Keep the highlight overlay and gutter in sync with the new position.
      ta.dispatchEvent(new Event('scroll'));
    });
  }

  // Link status
  protected readonly linkCopied = signal(false);

  // Exporter modal states
  readonly showDownloadModal = signal(false);
  protected readonly exportFormat = signal<'css' | 'scss' | 'tailwind' | 'stylex' | 'figma'>('css');
  protected readonly exportCopied = signal(false);

  // Dropdown menus configurations
  protected readonly themeMenuItems: NgxsmkDropdownMenuItem[] = [
    { label: 'Butter', action: () => this.applyThemePreset('butter') },
    { label: 'Gothic', action: () => this.applyThemePreset('gothic') },
    { label: 'Matcha', action: () => this.applyThemePreset('matcha') },
    { label: 'Neutral', action: () => this.applyThemePreset('neutral') },
    { label: 'Stone', action: () => this.applyThemePreset('stone') },
    { label: 'Y2K', action: () => this.applyThemePreset('y2k') },
  ];

  protected readonly templateMenuItems: NgxsmkDropdownMenuItem[] = [
    { label: 'Theme Showcase', action: () => this.loadTemplate('showcase') },
    { label: 'AI Chat · AI Chat Conversation', action: () => this.loadTemplate('ai-chat') },
    { label: 'AI Chat · AI Chat Landing', action: () => this.loadTemplate('ai-landing') },
    { label: 'Form · Contact Form', action: () => this.loadTemplate('contact') },
    { label: 'Form · Checkout Form', action: () => this.loadTemplate('checkout') },
    { label: 'Login · Login Card', action: () => this.loadTemplate('login') },
  ];

  // Font options
  protected readonly fonts = [
    { value: "'Inter', system-ui, sans-serif", label: 'Inter' },
    { value: "'Outfit', sans-serif", label: 'Outfit' },
    { value: "'DM Sans', sans-serif", label: 'DM Sans' },
    { value: "'Figtree', sans-serif", label: 'Figtree' },
    { value: "'Poppins', sans-serif", label: 'Poppins' },
    { value: "'Montserrat', sans-serif", label: 'Montserrat' },
    { value: 'system-ui, sans-serif', label: 'System' },
    { value: 'Georgia, serif', label: 'Georgia' },
  ];

  protected readonly scales = [
    { value: 1.067, label: 'playground.scales.minorSecond' },
    { value: 1.125, label: 'playground.scales.majorSecond' },
    { value: 1.2, label: 'playground.scales.minorThird' },
    { value: 1.25, label: 'playground.scales.majorThird' },
    { value: 1.333, label: 'playground.scales.perfectFourth' },
    { value: 1.414, label: 'playground.scales.augmentedFourth' },
    { value: 1.5, label: 'playground.scales.perfectFifth' },
    { value: 1.618, label: 'playground.scales.goldenRatio' },
  ];

  protected readonly radii: { key: RadiusKey; label: string }[] = [
    { key: 'sm', label: 'S' },
    { key: 'md', label: 'M' },
    { key: 'lg', label: 'L' },
    { key: 'xl', label: 'XL' },
  ];

  // Automatically derive neutral/dark settings from accent if createFromAccent is toggled
  constructor() {
    this.restoreFromHash();

    // Sync playground dark mode with global theme dark mode
    effect(
      () => {
        const isDark = this.themeService.isDark();
        const currentMode = this.mode();
        if (isDark && currentMode === 'light') {
          this.mode.set('dark');
          this.cardBg.set('#18181b');
          this.appBg.set('#09090b');
          this.text.set('#fafafa');
          this.neutral.set('#3f3f46');
        } else if (!isDark && currentMode === 'dark') {
          this.mode.set('light');
          this.cardBg.set('#ffffff');
          this.appBg.set('#fafafa');
          this.text.set('#09090b');
          this.neutral.set('#e4e4e7');
        }
      },
      { allowSignalWrites: true },
    );

    // Set up effects to update parameters based on Accent toggle if enabled
    effect(() => {
      if (this.createFromAccent()) {
        const acc = this.accent();
        // Simple client-side color derivation
        this.neutral.set(this.blendColor(acc, '#808080', 0.5));
      }
    });
  }

  private blendColor(color1: string, color2: string, weight: number): string {
    const c1 = parseInt(color1.substring(1), 16);
    const c2 = parseInt(color2.substring(1), 16);
    const r = Math.round(((c1 >> 16) & 0xff) * (1 - weight) + ((c2 >> 16) & 0xff) * weight);
    const g = Math.round(((c1 >> 8) & 0xff) * (1 - weight) + ((c2 >> 8) & 0xff) * weight);
    const b = Math.round((c1 & 0xff) * (1 - weight) + (c2 & 0xff) * weight);
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }

  protected readonly parsedCode = computed(() => {
    try {
      // Find Example function output JSX
      const code = this.editorCode();
      const returnIndex = code.indexOf('return (');
      if (returnIndex !== -1) {
        const start = returnIndex + 8;
        const end = code.lastIndexOf(');');
        if (end !== -1) {
          // Pass the substring's base offset so node.start stays absolute
          // in the editor text (inspector click-to-reveal relies on it).
          return parseJSX(code.substring(start, end), start);
        }
      }
      return parseJSX(code);
    } catch (e) {
      console.error(e);
      return [];
    }
  });

  protected zoomScaleStyle() {
    const scale = this.scaleZoom();
    if (scale === '0.5x') return 'scale(0.5)';
    if (scale === '1.5x') return 'scale(1.5)';
    if (scale === '2x') return 'scale(2)';
    return 'scale(1)';
  }

  protected toggleDarkMode() {
    this.themeService.toggle();
  }

  protected applyThemePreset(preset: string) {
    if (preset === 'butter') {
      this.accent.set('#d97706');
      this.neutral.set('#78716c');
      this.appBg.set('#fafaf9');
      this.cardBg.set('#ffffff');
      this.text.set('#44403c');
      this.mode.set('light');
    } else if (preset === 'gothic') {
      this.accent.set('#c084fc');
      this.neutral.set('#27272a');
      this.appBg.set('#09090b');
      this.cardBg.set('#18181b');
      this.text.set('#f4f4f5');
      this.mode.set('dark');
    } else if (preset === 'matcha') {
      this.accent.set('#65a30d');
      this.neutral.set('#78716c');
      this.appBg.set('#f7fee7');
      this.cardBg.set('#ffffff');
      this.text.set('#3f6212');
      this.mode.set('light');
    } else if (preset === 'neutral') {
      this.accent.set('#18181b');
      this.neutral.set('#a1a1aa');
      this.appBg.set('#fafafa');
      this.cardBg.set('#ffffff');
      this.text.set('#09090b');
      this.mode.set('light');
    } else if (preset === 'stone') {
      this.accent.set('#57534e');
      this.neutral.set('#a8a29e');
      this.appBg.set('#fafaf9');
      this.cardBg.set('#ffffff');
      this.text.set('#1c1917');
      this.mode.set('light');
    } else if (preset === 'y2k') {
      this.accent.set('#ec4899');
      this.neutral.set('#d4d4d8');
      this.appBg.set('#fafafa');
      this.cardBg.set('#ffffff');
      this.text.set('#18181b');
      this.mode.set('light');
    }
  }

  protected loadTemplate(key: string) {
    const tpl = TEMPLATES[key];
    if (tpl) {
      this.editorCode.set(tpl);
    }
  }

  protected onCodeChange(code: string) {
    this.editorCode.set(code);
  }

  protected syncScroll(event: Event) {
    const el = event.target as HTMLElement;
    if (this.linesEl) {
      this.linesEl.nativeElement.scrollTop = el.scrollTop;
    }
    if (this.highlightPreEl) {
      this.highlightPreEl.nativeElement.scrollTop = el.scrollTop;
      this.highlightPreEl.nativeElement.scrollLeft = el.scrollLeft;
    }
  }

  // --- Dynamic highlight JSX logic ---
  private highlightCode(code: string): string {
    if (!code) return '';
    const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const patterns: { re: RegExp; cls: string }[] = [
      { re: /\/\*[\s\S]*?\*\/|\/\/[^\n]*/g, cls: 'hl-comment' },
      { re: /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g, cls: 'hl-str' },
      { re: /<\/?[A-Z][\w-]*/g, cls: 'hl-tag' },
      { re: /<\/?[a-z][\w-]*/g, cls: 'hl-tag-html' },
      { re: /[A-Za-z_]\w*(?=\s*=)/g, cls: 'hl-attr' },
      { re: /[{}]/g, cls: 'hl-brace' },
      {
        re: /\b(?:import|from|export|default|function|return|const|let|interface|class|readonly|protected|private|public|implements|extends)\b/g,
        cls: 'hl-keyword',
      },
    ];

    let result = '';
    let pos = 0;
    while (pos < code.length) {
      let best: { idx: number; len: number; cls: string } | null = null;
      for (const p of patterns) {
        p.re.lastIndex = pos;
        const m = p.re.exec(code);
        if (m && m.index >= pos && (!best || m.index < best.idx)) {
          best = { idx: m.index, len: m[0].length, cls: p.cls };
        }
      }
      if (!best) {
        result += esc(code.slice(pos));
        break;
      }
      result += esc(code.slice(pos, best.idx));
      result += `<span class="${best.cls}">${esc(code.slice(best.idx, best.idx + best.len))}</span>`;
      pos = best.idx + best.len;
    }
    return result;
  }

  // --- Multi format exporters logic ---
  protected readonly exportCode = computed(() => {
    const fmt = this.exportFormat();
    if (fmt === 'css') {
      return this.generatedCss();
    } else if (fmt === 'scss') {
      // SCSS variables mirroring the CSS custom properties, plus a :root
      // block so a single @use wires the theme up.
      const t = this.tokens();
      const keys = Object.keys(t).filter((k) => k.startsWith('--ngxsmk-'));
      const vars = keys.map((k) => `$${k.slice(2)}: ${t[k]};`).join('\n');
      const root = keys.map((k) => `  ${k}: #{$${k.slice(2)}};`).join('\n');
      return `// NGXSMK theme tokens — generated by the playground\n${vars}\n\n:root {\n${root}\n}`;
    } else if (fmt === 'figma') {
      // Tokens Studio (Figma Tokens plugin) JSON. Only the source design
      // decisions are exported — derived values (color-mix) stay in code.
      const radius = this.radiusPx();
      const figma = {
        ngxsmk: {
          color: {
            primary: { value: this.accent(), type: 'color' },
            surface: { value: this.cardBg(), type: 'color' },
            background: { value: this.appBg(), type: 'color' },
            'on-surface': { value: this.text(), type: 'color' },
            outline: { value: this.neutral(), type: 'color' },
          },
          radius: {
            sm: { value: `${Math.max(2, radius - 2)}px`, type: 'borderRadius' },
            base: { value: `${radius}px`, type: 'borderRadius' },
            lg: { value: `${radius * 1.5}px`, type: 'borderRadius' },
            xl: { value: `${radius * 2}px`, type: 'borderRadius' },
          },
          font: {
            heading: { value: this.headingFont(), type: 'fontFamilies' },
            body: { value: this.bodyFont(), type: 'fontFamilies' },
          },
        },
      };
      return JSON.stringify(figma, null, 2);
    } else if (fmt === 'tailwind') {
      const a = this.accent();
      const n = this.neutral();
      return `module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '${a}',
        ring: '${a}',
        surface: '${this.cardBg()}',
        background: '${this.appBg()}',
        outline: '${n}',
      },
      borderRadius: {
        base: '${this.radiusPx()}px',
      }
    }
  }
};`;
    } else {
      const a = this.accent();
      const n = this.neutral();
      return `import stylex from '@stylexjs/stylex';

export const tokens = stylex.defineVars({
  primary: '${a}',
  ring: '${a}',
  surface: '${this.cardBg()}',
  background: '${this.appBg()}',
  outline: '${n}',
  radiusBase: '${this.radiusPx()}px',
});`;
    }
  });

  protected copyExportCode() {
    navigator.clipboard.writeText(this.exportCode()).then(() => {
      this.exportCopied.set(true);
      setTimeout(() => this.exportCopied.set(false), 1600);
    });
  }

  protected triggerDownload() {
    const fmt = this.exportFormat();
    const code = this.exportCode();
    let filename = `theme-${this.accent().replace('#', '')}.css`;
    let type = 'text/css';

    if (fmt === 'tailwind') {
      filename = 'tailwind.config.js';
      type = 'application/javascript';
    } else if (fmt === 'stylex') {
      filename = 'tokens.stylex.js';
      type = 'application/javascript';
    } else if (fmt === 'scss') {
      filename = `_ngxsmk-theme.scss`;
      type = 'text/x-scss';
    } else if (fmt === 'figma') {
      // Import via the Tokens Studio plugin in Figma.
      filename = 'ngxsmk.tokens.json';
      type = 'application/json';
    }

    const blob = new Blob([code], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  protected copyLink() {
    this.compress(this.editorCode()).then((hash) => {
      const shareUrl = `${location.protocol}//${location.host}${location.pathname}#code=${hash}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        this.linkCopied.set(true);
        setTimeout(() => this.linkCopied.set(false), 2000);
      });
    });
  }

  private async compress(text: string): Promise<string> {
    const bytes = new TextEncoder().encode(text);
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });
    const compressionStream = new CompressionStream('deflate-raw');
    const compressedStream = stream.pipeThrough(compressionStream);
    const response = new Response(compressedStream);
    const buffer = await response.arrayBuffer();

    let binary = '';
    const bytesArr = new Uint8Array(buffer);
    for (let i = 0; i < bytesArr.byteLength; i++) {
      binary += String.fromCharCode(bytesArr[i]);
    }
    const base64 = btoa(binary);
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  private async decompress(hash: string): Promise<string> {
    let base64 = hash.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(bytes);
        controller.close();
      },
    });
    const decompressionStream = new DecompressionStream('deflate-raw');
    const decompressedStream = stream.pipeThrough(decompressionStream);
    return new Response(decompressedStream).text();
  }

  private restoreFromHash() {
    if (typeof location === 'undefined') return;
    const hash = location.hash;
    if (hash.includes('code=')) {
      const codeHash = hash.split('code=')[1];
      this.decompress(codeHash).then(
        (text) => {
          if (text) this.editorCode.set(text);
        },
        (err) => console.error('Failed to restore code from hash', err),
      );
    }
  }

  private readonly radiusPx = computed(() => RADII[this.radius()]);

  protected readonly tokens = computed<Record<string, string>>(() => {
    const a = this.accent();
    const card = this.cardBg();
    const app = this.appBg();
    const t = this.text();
    const n = this.neutral();
    const r = this.radiusPx();
    return {
      '--ngxsmk-color-primary': a,
      '--ngxsmk-color-ring': a,
      '--ngxsmk-color-on-primary': '#ffffff',
      '--ngxsmk-color-primary-container': `color-mix(in srgb, ${a} 16%, ${card})`,
      '--ngxsmk-color-on-primary-container': a,
      '--ngxsmk-color-surface': card,
      '--ngxsmk-color-background': app,
      '--ngxsmk-color-on-surface': t,
      '--ngxsmk-color-on-background': t,
      '--ngxsmk-color-on-surface-variant': `color-mix(in srgb, ${t} 55%, ${card})`,
      '--ngxsmk-color-surface-variant': `color-mix(in srgb, ${n} 40%, ${card})`,
      '--ngxsmk-color-surface-hover': `color-mix(in srgb, ${t} 6%, ${card})`,
      '--ngxsmk-color-outline': n,
      '--ngxsmk-color-outline-strong': `color-mix(in srgb, ${n} 55%, ${t})`,
      '--ngxsmk-color-error': '#ef4444',
      '--ngxsmk-radius-sm': `${Math.max(2, r - 2)}px`,
      '--ngxsmk-radius-base': `${r}px`,
      '--ngxsmk-radius-md': `${r}px`,
      '--ngxsmk-radius-lg': `${r * 1.5}px`,
      '--ngxsmk-radius-xl': `${r * 2}px`,
      '--ngxsmk-radius-full': '999px',
      '--ngxsmk-font-sans': this.bodyFont(),
      '--pg-heading-font': this.headingFont(),
      '--pg-scale': String(this.scale()),
    };
  });

  protected readonly generatedCss = computed(() => {
    const t = this.tokens();
    const keys = Object.keys(t).filter((k) => k.startsWith('--ngxsmk-'));
    return ':root {\n' + keys.map((k) => `  ${k}: ${t[k]};`).join('\n') + '\n}';
  });
}
