import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DockItem {
  id: string;
  label: string;
  icon: string;
  badge?: string | number;
  disabled?: boolean;
}

export type DockPosition = 'bottom' | 'top' | 'left' | 'right';

/**
 * Floating macOS-style application dock with icon tooltips and magnification hover effects.
 *
 * ```html
 * <ngxsmk-dock [items]="dockItems" (itemClick)="onSelect($event)" />
 * ```
 */
@Component({
  standalone: true,
  selector: 'ngxsmk-dock',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'ngxsmk-dock',
    '[attr.data-position]': 'position()',
  },
  template: `
    <nav class="ngxsmk-dock__container" role="toolbar" aria-label="Action dock">
      @for (item of items(); track item.id) {
        <button
          type="button"
          class="ngxsmk-dock__item"
          [disabled]="item.disabled"
          [attr.aria-label]="item.label"
          (click)="onItemClick(item)"
        >
          <span class="ngxsmk-dock__tooltip" role="tooltip">{{ item.label }}</span>
          <span class="ngxsmk-dock__icon" [innerHTML]="item.icon"></span>
          @if (item.badge) {
            <span class="ngxsmk-dock__badge">{{ item.badge }}</span>
          }
        </button>
      }
    </nav>
  `,
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--ngxsmk-font-sans, system-ui, sans-serif);
      z-index: var(--ngxsmk-z-dock, 1000);
    }

    .ngxsmk-dock__container {
      display: flex;
      align-items: center;
      gap: var(--ngxsmk-space-2, 0.5rem);
      padding: var(--ngxsmk-space-2, 0.5rem) var(--ngxsmk-space-3, 0.75rem);
      border: 1px solid var(--ngxsmk-color-outline, rgba(228, 228, 231, 0.6));
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: color-mix(in srgb, var(--ngxsmk-color-surface, #ffffff) 80%, transparent);
      backdrop-filter: blur(16px) saturate(1.5);
      box-shadow: var(--ngxsmk-shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.1));
    }

    .ngxsmk-dock__item {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2.75rem;
      height: 2.75rem;
      border: none;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      background: var(--ngxsmk-color-surface-variant, #f4f4f5);
      color: var(--ngxsmk-color-on-surface, #09090b);
      cursor: pointer;
      transition:
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        background 0.15s ease,
        box-shadow 0.15s ease;
    }

    .ngxsmk-dock__item:hover:not(:disabled) {
      transform: scale(1.25) translateY(-4px);
      background: var(--ngxsmk-color-primary, #7c3aed);
      color: #ffffff;
      box-shadow: 0 8px 16px -4px rgba(124, 58, 237, 0.4);
    }

    .ngxsmk-dock__item:hover .ngxsmk-dock__tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-6px);
    }

    .ngxsmk-dock__tooltip {
      position: absolute;
      top: -2.25rem;
      left: 50%;
      transform: translateX(-50%) translateY(0);
      padding: 0.2rem 0.5rem;
      border-radius: var(--ngxsmk-radius-sm, 0.25rem);
      background: var(--ngxsmk-color-on-surface, #09090b);
      color: var(--ngxsmk-color-surface, #ffffff);
      font-size: var(--ngxsmk-text-body-xs-size, 0.75rem);
      font-weight: 500;
      white-space: nowrap;
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: all 0.15s ease;
    }

    .ngxsmk-dock__icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.25rem;
      height: 1.25rem;
    }

    .ngxsmk-dock__badge {
      position: absolute;
      top: -2px;
      right: -2px;
      padding: 0.1rem 0.35rem;
      border-radius: 9999px;
      background: var(--ngxsmk-color-error, #ef4444);
      color: #ffffff;
      font-size: 0.65rem;
      font-weight: 700;
      line-height: 1;
    }

    .ngxsmk-dock__item:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `,
})
export class NgxsmkDock {
  readonly items = input.required<DockItem[]>();
  readonly position = input<DockPosition>('bottom');

  readonly itemClick = output<DockItem>();

  protected onItemClick(item: DockItem): void {
    if (item.disabled) return;
    this.itemClick.emit(item);
  }
}
