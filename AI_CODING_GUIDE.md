# NGXSMK AI Coding Agent & LLM Integration Guide

> **Audience**: AI Coding Agents (Antigravity, Claude Code, Cursor, Copilot, Gemini CLI, Devin) & Developers  
> **Mission**: Generate 100% syntactically correct, zoneless, signal-native Angular code using NGXSMK without guessing APIs or hallucinating imports.

---

## 1. Core Architectural Rules for AI Agents

1. **Signals-Native Only**: Always use `input()`, `input.required()`, `model()`, `output()`, and `computed()`. Never generate legacy `@Input()` or `@Output()` decorators.
2. **One Directory Per Component**: Every component is its own secondary entry point. Import from `@ngxsmk/core/<name>` (e.g. `import { NgxsmkButton } from '@ngxsmk/core/button'`).
3. **No NgModules**: Every component and directive is `standalone: true`. Add them directly to the `imports: [...]` array of components.
4. **Token-Driven CSS Only**: Never write hardcoded `#hex` or physical pixel values in styles. Use CSS custom properties:
   - Colors: `var(--ngxsmk-color-primary)`, `var(--ngxsmk-color-surface)`, `var(--ngxsmk-color-on-surface)`
   - Spacing: `var(--ngxsmk-space-2)`, `var(--ngxsmk-space-4)`, `var(--ngxsmk-space-6)`
   - Radii: `var(--ngxsmk-radius-sm)`, `var(--ngxsmk-radius-md)`, `var(--ngxsmk-radius-lg)`
   - Focus: `var(--ngxsmk-focus-ring)`
5. **Logical CSS (100% RTL Compliant)**: Always use `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, etc. Never use `left` or `right`.
6. **Safe CSS Grid**: Always specify `minmax(0, 1fr)` rather than `1fr` in CSS grids to prevent phone overflow.

---

## 2. Canonical Import Mapping Reference

| Component / Directive  | Class Name                                                                                                            | Import Path                                         | Primary Selector                                      |
| ---------------------- | --------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------- |
| **Button**             | `NgxsmkButton`                                                                                                        | `@ngxsmk/core/button`                               | `button[ngxsmk-button], a[ngxsmk-button]`             |
| **Card**               | `NgxsmkCard`, `NgxsmkCardHeader`, `NgxsmkCardTitle`, `NgxsmkCardDescription`, `NgxsmkCardContent`, `NgxsmkCardFooter` | `@ngxsmk/core/card`                                 | `ngxsmk-card`, `[ngxsmkCardHeader]`, etc.             |
| **Form Field & Input** | `NgxsmkFormField`, `NgxsmkInputDirective`                                                                             | `@ngxsmk/core/form-field`, `@ngxsmk/core/input`     | `ngxsmk-form-field`, `input[ngxsmkInput]`             |
| **Switch & Checkbox**  | `NgxsmkSwitch`, `NgxsmkCheckbox`                                                                                      | `@ngxsmk/core/switch`, `@ngxsmk/core/checkbox`      | `ngxsmk-switch`, `ngxsmk-checkbox`                    |
| **Tabs**               | `NgxsmkTabs`, `NgxsmkTab`                                                                                             | `@ngxsmk/core/tabs`                                 | `ngxsmk-tabs`, `ngxsmk-tab`                           |
| **Dialog / Modal**     | `NgxsmkDialog`                                                                                                        | `@ngxsmk/core/dialog`                               | `ngxsmk-dialog`                                       |
| **Alert & Badge**      | `NgxsmkAlert`, `NgxsmkBadge`                                                                                          | `@ngxsmk/core/alert`, `@ngxsmk/core/badge`          | `ngxsmk-alert`, `ngxsmk-badge`                        |
| **Virtual Scroll**     | `NgxsmkVirtualScroll`                                                                                                 | `@ngxsmk/core/virtual-scroll`                       | `ngxsmk-virtual-scroll`                               |
| **AI Chat & Prompts**  | `NgxsmkAiChat`, `NgxsmkPromptInput`                                                                                   | `@ngxsmk/core/ai-chat`, `@ngxsmk/core/prompt-input` | `ngxsmk-ai-chat`, `ngxsmk-prompt-input`               |
| **Pin / OTP Input**    | `NgxsmkPinInput`                                                                                                      | `@ngxsmk/core/pin-input`                            | `ngxsmk-pin-input`                                    |
| **Roving Focus (CDK)** | `NgxsmkRovingFocusGroup`, `NgxsmkRovingFocusItem`                                                                     | `@ngxsmk/cdk/roving-focus`                          | `[ngxsmkRovingFocusGroup]`, `[ngxsmkRovingFocusItem]` |
| **Skip Link (CDK)**    | `NgxsmkSkipLink`                                                                                                      | `@ngxsmk/cdk/skip-link`                             | `ngxsmk-skip-link`                                    |

---

## 3. Common Composition Patterns

### 3.1 Form Field with Reactive Signals & Validation

```ts
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkButton } from '@ngxsmk/core/button';

@Component({
  standalone: true,
  imports: [NgxsmkFormField, NgxsmkInputDirective, NgxsmkButton, FormsModule],
  template: `
    <form (ngSubmit)="onSubmit()">
      <ngxsmk-form-field label="User Email" [required]="true" hint="We will never share your email">
        <input ngxsmkInput type="email" [(ngModel)]="email" name="email" required />
      </ngxsmk-form-field>
      <button ngxsmk-button variant="primary" type="submit" [disabled]="!email()">Submit</button>
    </form>
  `,
})
export class UserFormComponent {
  readonly email = signal('');
  onSubmit() {
    console.log('Submitted email:', this.email());
  }
}
```

---

### 3.2 Modal Dialog with Accessible Focus Trap & Actions

```ts
import { Component, signal } from '@angular/core';
import { NgxsmkDialog } from '@ngxsmk/core/dialog';
import { NgxsmkButton } from '@ngxsmk/core/button';

@Component({
  standalone: true,
  imports: [NgxsmkDialog, NgxsmkButton],
  template: `
    <button ngxsmk-button variant="destructive" (click)="isOpen.set(true)">Delete Cluster</button>

    <ngxsmk-dialog [(open)]="isOpen" title="Confirm Cluster Deletion">
      <p>This action is irreversible. All connected instances will be permanently terminated.</p>
      <div slot="actions" class="flex justify-end gap-2 mt-4">
        <button ngxsmk-button variant="outline" (click)="isOpen.set(false)">Cancel</button>
        <button ngxsmk-button variant="destructive" (click)="confirmDelete()">
          Permanently Delete
        </button>
      </div>
    </ngxsmk-dialog>
  `,
})
export class DeleteClusterComponent {
  readonly isOpen = signal(false);
  confirmDelete() {
    this.isOpen.set(false);
  }
}
```

---

## 4. Anti-Patterns & Common Traps

| Anti-Pattern (DO NOT DO)                          | Correct Pattern (ALWAYS DO)                              |
| ------------------------------------------------- | -------------------------------------------------------- |
| ❌ `@Input() name = '';`                          | ✅ `readonly name = input('');`                          |
| ❌ `@Output() changed = new EventEmitter();`      | ✅ `readonly changed = output<string>();`                |
| ❌ `import { NgxsmkButton } from '@ngxsmk/core';` | ✅ `import { NgxsmkButton } from '@ngxsmk/core/button';` |
| ❌ `<button class="ngxsmk-btn">`                  | ✅ `<button ngxsmk-button variant="primary">`            |
| ❌ `color: #7c3aed;`                              | ✅ `color: var(--ngxsmk-color-primary);`                 |
| ❌ `margin-left: 16px;`                           | ✅ `margin-inline-start: var(--ngxsmk-space-4);`         |
| ❌ `grid-template-columns: 1fr 1fr;`              | ✅ `grid-template-columns: repeat(2, minmax(0, 1fr));`   |

---

## 5. Angular Material to NGXSMK Migration Guide

| Angular Material                                                               | NGXSMK Equivalent                                                         | Migration Changes                                                       |
| ------------------------------------------------------------------------------ | ------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| `<button mat-raised-button color="primary">`                                   | `<button ngxsmk-button variant="primary">`                                | Change `mat-raised-button` to `ngxsmk-button`, `color` to `variant`.    |
| `<mat-form-field><mat-label>Name</mat-label><input matInput></mat-form-field>` | `<ngxsmk-form-field label="Name"><input ngxsmkInput></ngxsmk-form-field>` | Move label to `[label]` input attribute on `<ngxsmk-form-field>`.       |
| `<mat-slide-toggle [(ngModel)]="active">`                                      | `<ngxsmk-switch [(checked)]="active">`                                    | Replace `mat-slide-toggle` with `ngxsmk-switch`, binding `[(checked)]`. |
| `<mat-tab-group><mat-tab label="1"></mat-tab></mat-tab-group>`                 | `<ngxsmk-tabs><ngxsmk-tab label="1"></ngxsmk-tab></ngxsmk-tabs>`          | Replace with `ngxsmk-tabs` and `ngxsmk-tab`.                            |
| `<mat-card><mat-card-title>Title</mat-card-title></mat-card>`                  | `<ngxsmk-card><h3 ngxsmkCardTitle>Title</h3></ngxsmk-card>`               | Use directive slots `[ngxsmkCardTitle]` inside `ngxsmk-card`.           |
