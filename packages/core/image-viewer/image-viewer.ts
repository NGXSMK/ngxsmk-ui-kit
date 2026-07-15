import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-image-viewer',
  template: `
    <div class="ngxsmk-image-viewer__wrap">
      <img
        class="ngxsmk-image-viewer__img"
        [src]="src()"
        [alt]="alt()"
        tabindex="0"
        role="button"
        (click)="open = !open"
        (keydown.enter)="open = !open"
        (keydown.space)="open = !open; $event.preventDefault()"
      />
      @if (open) {
        <!-- eslint-disable-next-line @angular-eslint/template/click-events-have-key-events, @angular-eslint/template/interactive-supports-focus -->
        <div class="ngxsmk-image-viewer__overlay" (click)="open = false">
          <img class="ngxsmk-image-viewer__expanded" [src]="src()" [alt]="alt()" />
        </div>
      }
    </div>
  `,
  host: { class: 'ngxsmk-image-viewer' },
  styles: `
    :host {
      display: inline-block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-image-viewer__img {
      max-width: 100%;
      max-height: 20rem;
      border-radius: var(--ngxsmk-radius-md);
      cursor: pointer;
      transition: opacity var(--ngxsmk-duration-fast);
    }
    .ngxsmk-image-viewer__img:hover {
      opacity: 0.9;
    }
    .ngxsmk-image-viewer__overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: var(--ngxsmk-z-modal, 1400);
      cursor: pointer;
    }
    .ngxsmk-image-viewer__expanded {
      max-width: 90vw;
      max-height: 90vh;
      border-radius: var(--ngxsmk-radius-md);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkImageViewer {
  readonly src = input.required<string>();
  readonly alt = input('');

  protected open = false;
}
