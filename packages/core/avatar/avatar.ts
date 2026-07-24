import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type NgxsmkAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * User avatar with automatic initials fallback when no image is available
 * or the image fails to load.
 *
 * ```html
 * <ngxsmk-avatar src="/u/42.png" name="Ada Lovelace" />
 * <ngxsmk-avatar name="Ada Lovelace" size="lg" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-avatar',
  template: `
    @if (showImage()) {
      <img
        class="ngxsmk-avatar__image"
        [src]="src()"
        [alt]="name()"
        (error)="imageFailed.set(true)"
      />
    } @else {
      <span class="ngxsmk-avatar__initials" aria-hidden="true">{{ initials() }}</span>
    }
  `,
  host: {
    class: 'ngxsmk-avatar',
    '[attr.data-size]': 'size()',
    '[attr.data-shape]': 'shape()',
    '[attr.aria-label]': 'showImage() ? null : name() || null',
    '[attr.role]': 'showImage() ? null : "img"',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      background: var(--ngxsmk-color-primary-container);
      color: var(--ngxsmk-color-on-primary-container);
      border-radius: var(--ngxsmk-radius-full);
      overflow: hidden;
      user-select: none;
      font-family: var(--ngxsmk-font-sans);
      font-weight: var(--ngxsmk-font-weight-semibold, 600);
    }

    :host([data-shape='square']) {
      border-radius: var(--ngxsmk-radius-lg);
    }

    :host([data-size='sm']) {
      width: 1.75rem;
      height: 1.75rem;
      font-size: var(--ngxsmk-text-body-xs-size);
    }
    :host([data-size='md']) {
      width: 2.5rem;
      height: 2.5rem;
      font-size: var(--ngxsmk-text-label-lg-size);
    }
    :host([data-size='lg']) {
      width: 3.5rem;
      height: 3.5rem;
      font-size: var(--ngxsmk-text-title-md-size);
    }
    :host([data-size='xl']) {
      width: 5rem;
      height: 5rem;
      font-size: var(--ngxsmk-text-headline-md-size);
    }

    .ngxsmk-avatar__image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkAvatar {
  readonly src = input('');
  readonly name = input('');
  readonly size = input<NgxsmkAvatarSize>('md');
  readonly shape = input<'circle' | 'square'>('circle');

  protected readonly imageFailed = signal(false);

  protected readonly showImage = computed(() => !!this.src() && !this.imageFailed());

  protected readonly initials = computed(() => {
    const parts = this.name().trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) {
      return '?';
    }
    const first = parts[0][0] ?? '';
    const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
    return (first + last).toUpperCase();
  });
}
