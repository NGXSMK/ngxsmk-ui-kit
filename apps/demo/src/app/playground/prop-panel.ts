import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';

export interface PropOption {
  value: string;
  label?: string;
  disabled?: boolean;
}

export type PropControl = 'text' | 'textarea' | 'number' | 'boolean' | 'select' | 'color';

export interface PropDescriptor {
  /** Input name on the component. */
  name: string;
  /** Human label; falls back to `name`. */
  label?: string;
  /** Which editor to render. Defaults to `text`. */
  control?: PropControl;
  /** Value used when the prop is omitted from generated code. */
  default?: unknown;
  /** Options for `select` controls. */
  options?: PropOption[];
  /** Short help text shown under the control. */
  description?: string;
}

/**
 * Config-driven editor for a component's inputs. Pass a list of
 * `PropDescriptor`s and a two-way `values` record; it renders one control per
 * descriptor and writes edits back into `values`. Adding support for a new
 * component is purely data — no template changes required.
 */
@Component({
  selector: 'ngxsmk-prop-panel',
  standalone: true,
  imports: [NgxsmkButton],
  template: `
    <div class="ngxsmk-prop-panel">
      @for (d of descriptors(); track d.name) {
        <div class="ngxsmk-prop-panel__row">
          <label class="ngxsmk-prop-panel__label" [attr.for]="d.name">
            {{ d.label ?? d.name }}
          </label>

          <div class="ngxsmk-prop-panel__control">
            @switch (d.control ?? 'text') {
              @case ('boolean') {
                <button
                  type="button"
                  ngxsmk-button
                  size="sm"
                  [variant]="values()[d.name] ? 'primary' : 'outline'"
                  (click)="toggle(d.name)"
                >
                  {{ values()[d.name] ? 'On' : 'Off' }}
                </button>
              }
              @case ('select') {
                <select
                  [id]="d.name"
                  class="ngxsmk-prop-panel__select"
                  [value]="values()[d.name]"
                  (change)="set(d.name, $any($event.target).value)"
                >
                  @for (o of d.options ?? []; track o.value) {
                    <option [value]="o.value" [disabled]="o.disabled">
                      {{ o.label ?? o.value }}
                    </option>
                  }
                </select>
              }
              @case ('number') {
                <input
                  [id]="d.name"
                  type="number"
                  class="ngxsmk-prop-panel__input"
                  [value]="values()[d.name]"
                  (input)="set(d.name, toNumber($any($event.target).value))"
                />
              }
              @case ('textarea') {
                <textarea
                  [id]="d.name"
                  class="ngxsmk-prop-panel__input"
                  [value]="values()[d.name]"
                  (input)="set(d.name, $any($event.target).value)"
                ></textarea>
              }
              @case ('color') {
                <input
                  [id]="d.name"
                  type="color"
                  class="ngxsmk-prop-panel__input ngxsmk-prop-panel__color"
                  [value]="values()[d.name]"
                  (input)="set(d.name, $any($event.target).value)"
                />
              }
              @default {
                <input
                  [id]="d.name"
                  type="text"
                  class="ngxsmk-prop-panel__input"
                  [value]="values()[d.name]"
                  (input)="set(d.name, $any($event.target).value)"
                />
              }
            }
          </div>

          @if (d.description) {
            <p class="ngxsmk-prop-panel__hint">{{ d.description }}</p>
          }
        </div>
      }
    </div>
  `,
  styles: `
    :host { display: block; }
    .ngxsmk-prop-panel {
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-3, 0.75rem);
    }
    .ngxsmk-prop-panel__row {
      display: grid;
      grid-template-columns: 7rem 1fr;
      grid-template-areas: 'label control' 'label hint';
      column-gap: var(--ngxsmk-space-3, 0.75rem);
      row-gap: 0.15rem;
      align-items: center;
    }
    .ngxsmk-prop-panel__label {
      grid-area: label;
      font-size: 0.8125rem;
      font-weight: 600;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
    }
    .ngxsmk-prop-panel__control { grid-area: control; }
    .ngxsmk-prop-panel__hint {
      grid-area: hint;
      margin: 0;
      font-size: 0.75rem;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      opacity: 0.85;
    }
    .ngxsmk-prop-panel__input,
    .ngxsmk-prop-panel__select {
      width: 100%;
      box-sizing: border-box;
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border: 1px solid var(--ngxsmk-color-outline, #d4d4d8);
      border-radius: var(--ngxsmk-radius-base, 0.375rem);
      background: var(--ngxsmk-color-surface, #fff);
      color: var(--ngxsmk-color-on-surface, #09090b);
      font-family: var(--ngxsmk-font-sans, system-ui), sans-serif;
      font-size: 0.8125rem;
    }
    .ngxsmk-prop-panel__input:focus-visible,
    .ngxsmk-prop-panel__select:focus-visible {
      outline: none;
      border-color: var(--ngxsmk-color-ring, #2563eb);
      box-shadow: 0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-ring, #2563eb) 25%, transparent);
    }
    .ngxsmk-prop-panel__color { padding: 0.15rem; height: 2.25rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkPropPanel {
  readonly descriptors = input.required<PropDescriptor[]>();
  readonly values = model<Record<string, unknown>>({});

  set(name: string, value: unknown): void {
    this.values.update(v => ({ ...v, [name]: value }));
  }

  toggle(name: string): void {
    this.values.update(v => ({ ...v, [name]: !v[name] }));
  }

  toNumber(raw: string): number | null {
    if (raw === '' || raw == null) {
      return null;
    }
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }
}
