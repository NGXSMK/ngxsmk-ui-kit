import { DOCUMENT } from '@angular/common';
import {
  DestroyRef,
  Directive,
  EmbeddedViewRef,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  effect,
  inject,
  input,
} from '@angular/core';
import { NGXSMK_PLATFORM_ADAPTER } from '@ngxsmk/cdk/platform';

/** Where a portal may send its content: an element, a CSS selector, or the default host. */
export type NgxsmkPortalTarget = HTMLElement | string | null;

/**
 * Renders content somewhere else in the DOM while keeping it in this
 * component's logical tree — so bindings, injected services, and change
 * detection all continue to work from where the template is written.
 *
 * Defaults to the platform's overlay container, which is `document.body` on the
 * web and `ion-app` under Ionic. That is the seam the kit's own dialogs use;
 * this directive exposes it for anything an app needs to escape a clipping or
 * stacking ancestor — a dropdown inside `overflow: hidden`, a toast that must
 * outrank a modal.
 *
 * ```html
 * <ng-template ngxsmkPortal>
 *   <div class="floating">Rendered on the overlay container</div>
 * </ng-template>
 *
 * <ng-template [ngxsmkPortal]="'#sidebar'">…</ng-template>
 * <ng-template [ngxsmkPortal]="hostEl" [ngxsmkPortalDisabled]="isInline()">…</ng-template>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkPortal]',
})
export class NgxsmkPortal {
  /** Destination. An element, a selector, or `null` for the overlay container. */
  readonly ngxsmkPortal = input<NgxsmkPortalTarget>(null);

  /** Render in place instead, without tearing the view down. */
  readonly ngxsmkPortalDisabled = input(false, { transform: booleanAttribute });

  private readonly viewContainer = inject(ViewContainerRef);
  private readonly template = inject(TemplateRef<unknown>);
  private readonly platform = inject(NGXSMK_PLATFORM_ADAPTER);
  private readonly document = inject(DOCUMENT);

  private view: EmbeddedViewRef<unknown> | null = null;

  constructor() {
    // Created once, outside the effect: the view stays logically attached to
    // this view container, so Angular keeps change-detecting it no matter
    // where its DOM nodes end up. Only the nodes move.
    this.view = this.viewContainer.createEmbeddedView(this.template);

    effect(() => {
      const host = this.ngxsmkPortalDisabled()
        ? this.anchorParent()
        : this.resolve(this.ngxsmkPortal());

      // Moving rather than recreating keeps whatever state the projected
      // content holds across a target change.
      if (host) {
        this.moveTo(host);
      }
    });

    inject(DestroyRef).onDestroy(() => this.teardown());
  }

  /** Where the `<ng-template>` itself sits, for the disabled (inline) case. */
  private anchorParent(): HTMLElement | null {
    const anchor = this.viewContainer.element.nativeElement as Node;
    return (anchor.parentNode as HTMLElement) ?? null;
  }

  private resolve(target: NgxsmkPortalTarget): HTMLElement | null {
    if (target instanceof HTMLElement) return target;
    if (typeof target === 'string') {
      return this.document.querySelector<HTMLElement>(target);
    }
    return this.platform.overlayContainer();
  }

  private moveTo(host: HTMLElement): void {
    for (const node of this.view!.rootNodes as Node[]) {
      host.appendChild(node);
    }
  }

  private teardown(): void {
    // The nodes live outside the view container, so Angular will not remove
    // them for us — take them out before destroying the view.
    for (const node of (this.view?.rootNodes ?? []) as Node[]) {
      (node as ChildNode).remove?.();
    }
    this.view?.destroy();
    this.view = null;
  }
}
