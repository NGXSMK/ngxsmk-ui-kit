import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NgxsmkBreadcrumbItem } from '@ngxsmk/core/breadcrumb-item';

export interface NgxsmkBreadcrumbCrumb {
  label: string;
  href?: string;
}

/**
 * Composed breadcrumb trail. Prefer this over wiring sibling
 * `ngxsmk-breadcrumb-item` nodes by hand.
 *
 * ```html
 * <ngxsmk-breadcrumb
 *   [items]="[
 *     { label: 'Home', href: '/' },
 *     { label: 'Docs', href: '/docs' },
 *     { label: 'Button' }
 *   ]"
 * />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-breadcrumb',
  imports: [NgxsmkBreadcrumbItem],
  template: `
    <nav class="ngxsmk-breadcrumb__nav" [attr.aria-label]="ariaLabel()">
      @for (item of items(); track $index) {
        <ngxsmk-breadcrumb-item [href]="item.href ?? ''" [separator]="separator()">
          {{ item.label }}
        </ngxsmk-breadcrumb-item>
      }
    </nav>
  `,
  host: { class: 'ngxsmk-breadcrumb' },
  styles: `
    :host {
      display: block;
      font-family: var(--ngxsmk-font-sans);
    }
    .ngxsmk-breadcrumb__nav {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0;
      min-width: 0;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkBreadcrumb {
  readonly items = input<NgxsmkBreadcrumbCrumb[]>([]);
  readonly separator = input('/');
  readonly ariaLabel = input('Breadcrumb', { alias: 'aria-label' });
}
