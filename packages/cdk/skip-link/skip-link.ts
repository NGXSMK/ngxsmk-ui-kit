import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Accessible skip navigation link for keyboard users to bypass repetitive header navigation.
 * Renders off-screen by default, sliding into view when focused via Tab.
 *
 * ```html
 * <ngxsmk-skip-link targetId="main-content" label="Skip to main content" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-skip-link',
  template: `
    <a [href]="'#' + targetId()" class="ngxsmk-skip-link">
      {{ label() }}
    </a>
  `,
  styles: `
    .ngxsmk-skip-link {
      position: absolute;
      top: -9999px;
      inset-inline-start: var(--ngxsmk-space-4, 1rem);
      z-index: var(--ngxsmk-z-popover, 1000);
      padding: var(--ngxsmk-space-3, 0.75rem) var(--ngxsmk-space-4, 1rem);
      background: var(--ngxsmk-color-primary, #7c3aed);
      color: var(--ngxsmk-color-on-primary, #ffffff);
      font-family: var(--ngxsmk-font-sans, system-ui);
      font-size: var(--ngxsmk-text-body-sm-size, 0.875rem);
      font-weight: 600;
      text-decoration: none;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      box-shadow: var(--ngxsmk-shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
      outline: none;
      transition: top 0.15s ease-out;
    }

    .ngxsmk-skip-link:focus {
      top: var(--ngxsmk-space-4, 1rem);
      box-shadow: var(--ngxsmk-focus-ring);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSkipLink {
  /** Target HTML ID anchor to scroll/focus to. Default: 'main-content'. */
  readonly targetId = input<string>('main-content');

  /** Label text rendered inside the skip link. Default: 'Skip to content'. */
  readonly label = input<string>('Skip to content');
}
