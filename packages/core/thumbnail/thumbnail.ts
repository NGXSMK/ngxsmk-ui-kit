import { ChangeDetectionStrategy, Component, input, signal, computed } from '@angular/core';

@Component({
  standalone: true,
  selector: 'ngxsmk-thumbnail',
  template: `
    @if (showImage()) {
      <img class="ngxsmk-thumbnail__img" [src]="src()" [alt]="alt()" (error)="failed.set(true)" />
    } @else {
      <span class="ngxsmk-thumbnail__fallback" aria-hidden="true">{{ fallback() }}</span>
    }
  `,
  host: {
    class: 'ngxsmk-thumbnail',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.aria-label]': 'alt() || null',
    '[attr.role]': '"img"',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      overflow: hidden;
      background: var(--ngxsmk-color-surface-variant);
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: var(--ngxsmk-font-sans);
      font-weight: 500;
    }
    :host([data-shape='square']) {
      border-radius: var(--ngxsmk-radius-md);
    }
    :host([data-shape='circle']) {
      border-radius: var(--ngxsmk-radius-full);
    }
    :host([data-size='sm']) {
      width: 2.5rem;
      height: 2.5rem;
      font-size: 0.75rem;
    }
    :host([data-size='md']) {
      width: 4rem;
      height: 4rem;
      font-size: 1rem;
    }
    :host([data-size='lg']) {
      width: 6rem;
      height: 6rem;
      font-size: 1.25rem;
    }
    :host([data-size='xl']) {
      width: 8rem;
      height: 8rem;
      font-size: 1.5rem;
    }
    .ngxsmk-thumbnail__img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkThumbnail {
  readonly src = input('');
  readonly alt = input('');
  readonly size = input<'sm' | 'md' | 'lg' | 'xl'>('md');
  readonly shape = input<'square' | 'circle'>('square');

  protected readonly failed = signal(false);
  protected readonly showImage = computed(() => !!this.src() && !this.failed());
  protected readonly fallback = computed(() => this.alt().charAt(0).toUpperCase() || '?');
}
