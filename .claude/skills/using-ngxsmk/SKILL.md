---
name: using-ngxsmk
description: Build Angular UIs with the NGXSMK UI kit (@ngxsmk/core, @ngxsmk/theme). Use whenever generating or editing Angular templates/components in a project that depends on @ngxsmk packages — covers correct imports, signal-based component APIs, theming tokens, and dark mode.
---

# Using NGXSMK UI Kit

NGXSMK is a signals-native, zoneless Angular UI kit (Angular 17.3–22, MIT).
Copy this skill folder into any consumer project's `.claude/skills/`.

## Ground rules for generated code

1. **Standalone imports.** Every component/directive is standalone. Import the
   class from its secondary entry point and add it to `imports`:

   ```ts
   import { NgxsmkButton } from '@ngxsmk/core/button';
   import { NgxsmkCard } from '@ngxsmk/core/card';
   ```

2. **Signal APIs.** Inputs are `input()` signals — bind with `[prop]="..."`.
   Outputs bind with `(event)="..."`. `model()` inputs support `[(prop)]`.
   Never use `@ViewChild` tricks or assign to inputs imperatively.

3. **Selectors.** Element selectors are `ngxsmk-*` (`<ngxsmk-card>`). Some are
   attribute directives on native elements, e.g. buttons keep native semantics:

   ```html
   <button ngxsmk-button variant="outline" size="sm">Cancel</button>
   <a ngxsmk-button variant="link" href="/docs">Docs</a>
   ```

4. **Theming.** Import theme CSS once (e.g. in `styles.css`):
   `@import '@ngxsmk/theme/css';`. Customize ONLY via `--ngxsmk-*` custom
   properties (`--ngxsmk-color-primary`, `--ngxsmk-radius-md`,
   `--ngxsmk-space-4`, ...). Never override internal `.ngxsmk-*` classes.
   Dark mode: add the `dark` class to `<html>`.

5. **Layout.** Prefer kit layout primitives (`stack`, `h-stack`, `grid`,
   `center`, `container`, `app-shell`) over ad-hoc flex CSS. In CSS grid, use
   `minmax(0, 1fr)` instead of `1fr` to avoid mobile overflow.

## Discovering component APIs

- If the project has the `@ngxsmk/mcp` MCP server configured, use its tools:
  `ngxsmk_search_components` then `ngxsmk_explain_api`.
- Otherwise consult `llms-full.txt` from the package repo (also at
  https://ngxsmk.github.io/ngxsmk-ui-kit/llms-full.txt) for the full generated list of selectors,
  inputs, and outputs.
- Component families: forms (inputs, select, autocomplete, datepicker...),
  data display (table, data-table, tree-view, stat...), charts (`chart-*`),
  AI/chat (`ai-chat`, `chat-*`, `streaming-text`, `reasoning-timeline`,
  `agent-card`, `voice-input`), overlays (dialog, sheet, popover, tooltip),
  layout & navigation.

## Example: minimal AI chat page

```ts
import { Component, signal } from '@angular/core';
import { NgxsmkAiChat } from '@ngxsmk/core/ai-chat';

@Component({
  standalone: true,
  selector: 'app-assistant',
  imports: [NgxsmkAiChat],
  template: `
    <ngxsmk-ai-chat
      [messages]="messages()"
      [isTyping]="isTyping()"
      (sendMessage)="onSend($event)"
    />
  `,
})
export class AssistantPage {
  readonly messages = signal([]);
  readonly isTyping = signal(false);
  onSend(text: string) {
    /* call your backend */
  }
}
```
