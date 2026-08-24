import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  booleanAttribute,
  input,
} from '@angular/core';

/**
 * Content container with optional structural directives:
 *
 * ```html
 * <ngxsmk-card>
 *   <div ngxsmkCardHeader>
 *     <h3 ngxsmkCardTitle>Title</h3>
 *     <p ngxsmkCardDescription>Supporting copy</p>
 *   </div>
 *   <div ngxsmkCardContent>…</div>
 *   <div ngxsmkCardFooter>…</div>
 * </ngxsmk-card>
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-card',
  template: `<ng-content />`,
  host: {
    class: 'ngxsmk-card',
    '[attr.data-interactive]': 'interactive() ? "" : null',
  },
  styles: `
    :host {
      display: block;
      background: var(--ngxsmk-card-bg, var(--ngxsmk-color-surface));
      color: var(--ngxsmk-color-on-surface);
      border: 1px solid var(--ngxsmk-card-border-color, var(--ngxsmk-color-outline));
      border-radius: var(--ngxsmk-card-radius, var(--ngxsmk-radius-xl));
      box-shadow: var(--ngxsmk-card-shadow, var(--ngxsmk-shadow-sm));
      overflow: hidden;
    }

    :host([data-interactive]) {
      cursor: pointer;
      transition:
        box-shadow var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        border-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out),
        transform var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }
    :host([data-interactive]:hover) {
      box-shadow: var(--ngxsmk-shadow-md);
      border-color: var(--ngxsmk-color-outline-strong);
      transform: var(--ngxsmk-hover-lift);
    }
    :host([data-interactive]:active) {
      transform: var(--ngxsmk-press-scale);
    }
    :host([data-interactive]:focus-visible) {
      outline: none;
      box-shadow: var(--ngxsmk-focus-ring);
      border-color: var(--ngxsmk-color-ring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkCard {
  /** Adds hover elevation for clickable cards. */
  readonly interactive = input(false, { transform: booleanAttribute });
}

@Directive({
  standalone: true,
  selector: '[ngxsmkCardHeader]',
  host: {
    class: 'ngxsmk-card__header',
    style: `
      display: flex;
      flex-direction: column;
      gap: var(--ngxsmk-space-1);
      padding: var(--ngxsmk-space-6) var(--ngxsmk-space-6) var(--ngxsmk-space-4);
    `,
  },
})
export class NgxsmkCardHeader {}

@Directive({
  standalone: true,
  selector: '[ngxsmkCardTitle]',
  host: {
    class: 'ngxsmk-card__title',
    style: `
      margin: 0;
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-headline-sm-size);
      font-weight: var(--ngxsmk-text-headline-sm-weight);
      line-height: var(--ngxsmk-text-headline-sm-line);
    `,
  },
})
export class NgxsmkCardTitle {}

@Directive({
  standalone: true,
  selector: '[ngxsmkCardDescription]',
  host: {
    class: 'ngxsmk-card__description',
    style: `
      margin: 0;
      color: var(--ngxsmk-color-on-surface-variant);
      font-family: var(--ngxsmk-font-sans);
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: var(--ngxsmk-text-body-md-line);
    `,
  },
})
export class NgxsmkCardDescription {}

@Directive({
  standalone: true,
  selector: '[ngxsmkCardContent]',
  host: {
    class: 'ngxsmk-card__content',
    style: `display: block; padding: var(--ngxsmk-space-2) var(--ngxsmk-space-6) var(--ngxsmk-space-6);`,
  },
})
export class NgxsmkCardContent {}

@Directive({
  standalone: true,
  selector: '[ngxsmkCardFooter]',
  host: {
    class: 'ngxsmk-card__footer',
    style: `
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2);
      padding: var(--ngxsmk-space-4) var(--ngxsmk-space-6);
      border-top: 1px solid var(--ngxsmk-color-outline);
      background: var(--ngxsmk-color-surface-variant);
    `,
  },
})
export class NgxsmkCardFooter {}
