import {
  NgxsmkCardContent,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
  NgxsmkCard,
} from '@ngxsmk/core/card';
import { NgxsmkHeading } from '@ngxsmk/core/heading';
import { NgxsmkText } from '@ngxsmk/core/text';
import { ChangeDetectionStrategy, Component, computed, input, model, Type } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { NgxsmkPropPanel, PropDescriptor } from './prop-panel';

export interface PlaygroundEntry {
  key: string;
  title: string;
  description?: string;
  /** Tag emitted in generated code, e.g. `ngxsmk-input` or `button`. */
  tag: string;
  /** Component class for live preview (ngComponentOutlet). Omit when `custom`. */
  component?: Type<unknown>;
  /** When true the parent projects a custom preview via content (e.g. directives). */
  custom?: boolean;
  /** Default projected text, used in code + custom previews. */
  content?: string;
  /** Input to feed `content` into when the component exposes a text input. */
  contentInput?: string;
  descriptors: PropDescriptor[];
  /** Non-editable inputs always passed to the preview (e.g. `options`). */
  fixed?: Record<string, unknown>;
  /** Optional code generator override. */
  code?: (values: Record<string, any>) => string;
}

@Component({
  selector: 'playground-section',
  standalone: true,
  imports: [
    NgComponentOutlet,
    NgxsmkPropPanel,
    NgxsmkCard,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkCardContent,
    NgxsmkHeading,
    NgxsmkText,
  ],
  template: `
    <ngxsmk-card>
      <div ngxsmkCardHeader>
        <ngxsmk-heading level="h3" ngxsmkCardTitle>{{ entry().title }}</ngxsmk-heading>
        @if (entry().description) {
          <ngxsmk-text variant="caption" color="secondary" class="ngxsmk-pg__desc">{{
            entry().description
          }}</ngxsmk-text>
        }
      </div>

      <div ngxsmkCardContent class="ngxsmk-pg">
        <div class="ngxsmk-pg__preview">
          @if (!entry().custom && entry().component) {
            <ng-container *ngComponentOutlet="entry().component ?? null; inputs: values()" />
          } @else {
            <ng-content />
          }
        </div>

        <ngxsmk-prop-panel [descriptors]="entry().descriptors" [(values)]="values" />

        <pre class="ngxsmk-pg__code"><code>{{ codeText() }}</code></pre>
      </div>
    </ngxsmk-card>
  `,
  styles: `
    :host {
      display: block;
    }
    .ngxsmk-pg {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-5, 1.25rem);
    }
    .ngxsmk-pg__desc {
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      display: block;
      margin-top: 0.25rem;
    }
    .ngxsmk-pg__preview {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: var(--ngxsmk-space-4, 1rem);
      min-height: 3.5rem;
      padding: var(--ngxsmk-space-5, 1.25rem);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
    }
    .ngxsmk-pg__code {
      margin: 0;
      padding: var(--ngxsmk-space-4, 1rem);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: 1.6;
      overflow-x: auto;
      white-space: pre;
      color: var(--ngxsmk-color-on-surface, #09090b);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundSection {
  readonly entry = input.required<PlaygroundEntry>();
  readonly values = model<Record<string, unknown>>({});

  protected readonly codeText = computed(() => {
    const entry = this.entry();
    const values = this.values();
    return entry.code ? entry.code(values) : generate(entry, values);
  });
}

function generate(entry: PlaygroundEntry, values: Record<string, unknown>): string {
  const attrs: string[] = [];
  for (const d of entry.descriptors) {
    const v = values[d.name];
    if (v === undefined || v === null || v === '') {
      continue;
    }
    if (d.control === 'boolean') {
      if (v) {
        attrs.push(d.name);
      }
      continue;
    }
    if (v === d.default) {
      continue;
    }
    if (d.control === 'number') {
      attrs.push(`[${d.name}]="${v}"`);
      continue;
    }
    attrs.push(`${d.name}="${v}"`);
  }
  const open = [entry.tag, ...attrs].join(' ');
  const content = entry.content ?? '';
  return `<${open}>${content}</${entry.tag}>`;
}
