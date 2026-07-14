import { Directive } from '@angular/core';

/**
 * Hides the host visually while keeping it available to screen readers.
 *
 * ```html
 * <span ngxsmkVisuallyHidden>Opens in a new window</span>
 * ```
 */
@Directive({
  standalone: true,
  selector: '[ngxsmkVisuallyHidden]',
  host: {
    style: `
      position: absolute;
      width: 1px;
      height: 1px;
      margin: -1px;
      padding: 0;
      border: 0;
      overflow: hidden;
      clip-path: inset(100%);
      white-space: nowrap;
    `,
  },
})
export class NgxsmkVisuallyHidden {}
