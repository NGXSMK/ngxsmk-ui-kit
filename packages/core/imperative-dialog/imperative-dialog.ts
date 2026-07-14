import { DOCUMENT } from '@angular/common';
import {
  ApplicationRef,
  ComponentRef,
  EmbeddedViewRef,
  EnvironmentInjector,
  Injectable,
  createComponent,
  effect,
  inject,
} from '@angular/core';
import { NgxsmkDialog } from '@ngxsmk/core/dialog';
import { NgxsmkAlertDialog, NgxsmkAlertDialogVariant } from '@ngxsmk/core/alert-dialog';

/** Options for {@link NgxsmkImperativeAlertDialog.confirm}. */
export interface NgxsmkConfirmOptions {
  title?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: NgxsmkAlertDialogVariant;
}

function rootNode(ref: ComponentRef<unknown>): HTMLElement {
  return (ref.hostView as EmbeddedViewRef<unknown>).rootNodes[0] as HTMLElement;
}

/**
 * Opens {@link NgxsmkDialog} instances programmatically — no template binding
 * required. The dialog is mounted on `<body>`, shown, and fully torn down
 * (view detached, component destroyed, DOM removed) once it closes.
 *
 * ```ts
 * dialog = inject(NgxsmkImperativeDialog);
 * this.dialog.open('Title', 'Body content');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkImperativeDialog {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly doc = inject(DOCUMENT);

  /** Opens a dialog with the given title and body text. */
  open(title: string, content = ''): NgxsmkDialog {
    const body = content ? [this.doc.createTextNode(content)] : [];
    const compRef = createComponent(NgxsmkDialog, {
      environmentInjector: this.injector,
      projectableNodes: [body],
    });

    this.doc.body.appendChild(rootNode(compRef));
    this.appRef.attachView(compRef.hostView);
    compRef.setInput('title', title);
    compRef.setInput('open', true);
    // Flush CD (renders the view and runs the dialog's showModal effect) so the
    // dialog opens even when invoked outside Angular's zone.
    this.appRef.tick();

    // Tear everything down once the dialog reports itself closed.
    const watcher = effect(
      () => {
        if (compRef.instance.open()) return;
        queueMicrotask(() => this.destroy(compRef, watcher));
      },
      { injector: this.injector },
    );

    return compRef.instance;
  }

  private destroy(compRef: ComponentRef<NgxsmkDialog>, watcher: { destroy(): void }): void {
    watcher.destroy();
    const node = rootNode(compRef);
    this.appRef.detachView(compRef.hostView);
    compRef.destroy();
    node.remove();
  }
}

/**
 * Resolves a `Promise<boolean>` from a styled {@link NgxsmkAlertDialog} confirm
 * prompt — great for quick inline confirmations.
 *
 * ```ts
 * alert = inject(NgxsmkImperativeAlertDialog);
 * const ok = await this.alert.confirm('Discard changes?');
 * ```
 */
@Injectable({ providedIn: 'root' })
export class NgxsmkImperativeAlertDialog {
  private readonly appRef = inject(ApplicationRef);
  private readonly injector = inject(EnvironmentInjector);
  private readonly doc = inject(DOCUMENT);

  /** Shows a confirm dialog; resolves `true` on confirm, `false` otherwise. */
  confirm(message: string, options: NgxsmkConfirmOptions = {}): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const compRef = createComponent(NgxsmkAlertDialog, {
        environmentInjector: this.injector,
      });

      compRef.setInput('message', message);
      compRef.setInput('title', options.title ?? 'Are you sure?');
      if (options.confirmLabel) compRef.setInput('confirmLabel', options.confirmLabel);
      if (options.cancelLabel) compRef.setInput('cancelLabel', options.cancelLabel);
      if (options.variant) compRef.setInput('variant', options.variant);

      this.doc.body.appendChild(rootNode(compRef));
      this.appRef.attachView(compRef.hostView);
      compRef.setInput('open', true);
      this.appRef.tick();

      let settled = false;
      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        resolve(result);
        queueMicrotask(() => {
          const node = rootNode(compRef);
          this.appRef.detachView(compRef.hostView);
          compRef.destroy();
          node.remove();
        });
      };

      compRef.instance.confirmed.subscribe(() => finish(true));
      compRef.instance.cancelled.subscribe(() => finish(false));
    });
  }
}
