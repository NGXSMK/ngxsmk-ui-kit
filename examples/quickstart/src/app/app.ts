import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgxsmkButton } from '@ngxsmk/core/button';
import {
  NgxsmkCard,
  NgxsmkCardContent,
  NgxsmkCardDescription,
  NgxsmkCardFooter,
  NgxsmkCardHeader,
  NgxsmkCardTitle,
} from '@ngxsmk/core/card';
import { NgxsmkContainer } from '@ngxsmk/core/container';
import { NgxsmkDialog, NgxsmkDialogFooter } from '@ngxsmk/core/dialog';
import { NgxsmkFormField } from '@ngxsmk/core/form-field';
import { NgxsmkHStack, NgxsmkVStack } from '@ngxsmk/core/h-stack';
import { NgxsmkInputDirective } from '@ngxsmk/core/input';
import { NgxsmkSwitch } from '@ngxsmk/core/switch';
import { NgxsmkThemeService } from '@ngxsmk/theme';

/**
 * A deliberately small page that touches the pieces most apps start with:
 * layout primitives, a card, a form field with a native input, buttons,
 * a dialog, and runtime dark-mode switching — all signals, no zone.js.
 */
@Component({
  selector: 'app-root',
  imports: [
    FormsModule,
    NgxsmkButton,
    NgxsmkCard,
    NgxsmkCardHeader,
    NgxsmkCardTitle,
    NgxsmkCardDescription,
    NgxsmkCardContent,
    NgxsmkCardFooter,
    NgxsmkContainer,
    NgxsmkDialog,
    NgxsmkDialogFooter,
    NgxsmkFormField,
    NgxsmkHStack,
    NgxsmkVStack,
    NgxsmkInputDirective,
    NgxsmkSwitch,
  ],
  template: `
    <ngxsmk-container size="sm">
      <ngxsmk-v-stack gap="var(--ngxsmk-space-6)" style="padding-block: var(--ngxsmk-space-8)">
        <ngxsmk-h-stack justify="space-between">
          <h1 style="margin: 0">NGXSMK quickstart</h1>
          <ngxsmk-switch [checked]="theme.isDark()" (checkedChange)="theme.setMode($event ? 'dark' : 'light')">
            Dark mode
          </ngxsmk-switch>
        </ngxsmk-h-stack>

        <ngxsmk-card>
          <div ngxsmkCardHeader>
            <h2 ngxsmkCardTitle>Say hello</h2>
            <p ngxsmkCardDescription>
              A form field, a native input with <code>ngxsmkInput</code>, and a dialog.
            </p>
          </div>
          <div ngxsmkCardContent>
            <ngxsmk-form-field label="Your name" hint="Shown in the greeting">
              <input ngxsmkInput placeholder="Ada Lovelace" [(ngModel)]="name" />
            </ngxsmk-form-field>
          </div>
          <div ngxsmkCardFooter>
            <ngxsmk-h-stack gap="var(--ngxsmk-space-2)" justify="flex-end">
              <button ngxsmk-button variant="outline" (click)="name.set('')">Clear</button>
              <button ngxsmk-button variant="primary" (click)="open.set(true)">Greet</button>
            </ngxsmk-h-stack>
          </div>
        </ngxsmk-card>

        <p style="color: var(--ngxsmk-color-on-surface-muted)">
          Edit <code>src/app/app.ts</code>. Every component is a standalone, signal-based
          Angular component imported from its own entry point
          (<code>&#64;ngxsmk/core/&lt;name&gt;</code>).
        </p>
      </ngxsmk-v-stack>
    </ngxsmk-container>

    <ngxsmk-dialog [(open)]="open" title="Hello!">
      {{ greeting() }}
      <div ngxsmkDialogFooter>
        <button ngxsmk-button variant="primary" (click)="open.set(false)">Close</button>
      </div>
    </ngxsmk-dialog>
  `,
})
export class App {
  protected readonly theme = inject(NgxsmkThemeService);
  protected readonly name = signal('');
  protected readonly open = signal(false);
  protected readonly greeting = computed(() =>
    this.name().trim() ? `Nice to meet you, ${this.name().trim()}.` : 'Nice to meet you, stranger.',
  );
}
