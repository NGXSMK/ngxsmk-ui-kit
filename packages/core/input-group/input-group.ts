import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

const STYLE_ID = 'ngxsmk-input-group-styles';

/**
 * Skin for the input group and its text add-ons. Injected globally (like the
 * `ngxsmk-input` skin) because the projected controls and `ngxsmk-input-group-text`
 * add-ons live in the consumer's view, where the component's scoped styles
 * cannot reach them.
 */
const INPUT_GROUP_CSS = `
.ngxsmk-input-group.ngxsmk-input-group--core {
  display: inline-flex;
  align-items: stretch;
  width: 100%;
  box-sizing: border-box;
  height: var(--ngxsmk-control-height);
  min-height: var(--ngxsmk-control-height);
  border: 1px solid var(--ngxsmk-color-outline-strong);
  border-radius: var(--ngxsmk-radius-base);
  background: var(--ngxsmk-color-surface);
  font-family: var(--ngxsmk-font-sans);
  overflow: hidden;
  transition:
    border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
    box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
}
.ngxsmk-input-group.ngxsmk-input-group--core:focus-within {
  border-color: var(--ngxsmk-color-ring);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--ngxsmk-color-ring) 25%, transparent);
}

/* Text add-ons sit flush against the control with a hairline separator. */
.ngxsmk-input-group-text {
  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  height: var(--ngxsmk-control-height);
  padding: 0 var(--ngxsmk-space-3);
  background: var(--ngxsmk-color-surface-variant);
  color: var(--ngxsmk-color-on-surface-variant);
  font-size: var(--ngxsmk-text-body-md-size);
  line-height: var(--ngxsmk-text-body-md-line);
  white-space: nowrap;
  user-select: none;
}
.ngxsmk-input-group-text:not(:last-child) { border-right: 1px solid var(--ngxsmk-color-outline); }
.ngxsmk-input-group-text:not(:first-child) { border-left: 1px solid var(--ngxsmk-color-outline); }

/* Nested controls shed their own chrome so the group reads as one field. */
.ngxsmk-input-group.ngxsmk-input-group--core .ngxsmk-input {
  flex: 1 1 auto;
  min-width: 0;
  border: none;
  border-radius: 0;
  background: transparent;
}
.ngxsmk-input-group.ngxsmk-input-group--core .ngxsmk-input:focus-visible {
  outline: none;
  box-shadow: none;
}
`;

/**
 * Wraps a native control with text add-ons that sit flush against it, rendered
 * as a single connected field.
 *
 * ```html
 * <ngxsmk-input-group>
 *   <ngxsmk-input-group-text>$</ngxsmk-input-group-text>
 *   <ngxsmk-input placeholder="0.00" />
 *   <ngxsmk-input-group-text>USD</ngxsmk-input-group-text>
 * </ngxsmk-input-group>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-input-group',
  template: `<ng-content />`,
  host: { class: 'ngxsmk-input-group ngxsmk-input-group--core' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkInputGroup {
  constructor() {
    const document = inject(DOCUMENT);
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement('style');
      style.id = STYLE_ID;
      style.textContent = INPUT_GROUP_CSS;
      document.head.appendChild(style);
    }
  }
}
