import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  booleanAttribute,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { NgxsmkButton } from '@ngxsmk/core/button';

@Component({
  standalone: true,
  selector: 'ngxsmk-split-button',
  imports: [NgxsmkButton],
  template: `
    <div class="ngxsmk-split-button__container">
      <button
        ngxsmk-button
        [variant]="variant()"
        [size]="size()"
        [disabled]="disabled() || loading()"
        [loading]="loading()"
        class="ngxsmk-split-button__main"
        (click)="onMainClick($event)"
      >
        {{ label() }}
      </button>
      <button
        ngxsmk-button
        [variant]="variant()"
        [size]="size()"
        [disabled]="disabled() || loading()"
        class="ngxsmk-split-button__trigger"
        aria-label="Toggle dropdown options"
        aria-haspopup="menu"
        [attr.aria-expanded]="menuOpen()"
        (click)="toggleMenu($event)"
      >
        <svg
          viewBox="0 0 16 16"
          width="10"
          height="10"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        >
          <path d="M3 6l5 5 5-5" />
        </svg>
      </button>

      @if (menuOpen()) {
        <div class="ngxsmk-split-button__menu" role="menu">
          <ng-content />
        </div>
      }
    </div>
  `,
  host: {
    class: 'ngxsmk-split-button',
    '[attr.data-size]': 'size()',
    '[attr.data-variant]': 'variant()',
  },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--ngxsmk-font-sans);
      position: relative;
      vertical-align: middle;
    }

    .ngxsmk-split-button__container {
      display: inline-flex;
      position: relative;
    }

    .ngxsmk-split-button__main {
      border-top-right-radius: 0 !important;
      border-bottom-right-radius: 0 !important;
      border-right-width: 0 !important;
    }

    .ngxsmk-split-button__trigger {
      border-top-left-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
      padding-left: var(--ngxsmk-space-2) !important;
      padding-right: var(--ngxsmk-space-2) !important;
    }

    .ngxsmk-split-button__menu {
      position: absolute;
      top: calc(100% + var(--ngxsmk-space-1));
      right: 0;
      z-index: var(--ngxsmk-z-dropdown, 1000);
      min-width: 10rem;
      padding: var(--ngxsmk-space-1);
      border: 1px solid var(--ngxsmk-color-outline);
      border-radius: var(--ngxsmk-radius-md);
      background: var(--ngxsmk-color-surface);
      box-shadow: var(--ngxsmk-shadow-lg);
      display: flex;
      flex-direction: column;
    }

    .ngxsmk-split-button__menu ::ng-deep button,
    .ngxsmk-split-button__menu ::ng-deep a {
      display: block;
      width: 100%;
      padding: var(--ngxsmk-space-1-5) var(--ngxsmk-space-3);
      border: none;
      border-radius: var(--ngxsmk-radius-sm);
      background: transparent;
      color: var(--ngxsmk-color-on-surface);
      font-family: inherit;
      font-size: var(--ngxsmk-text-body-sm-size);
      line-height: var(--ngxsmk-text-body-sm-line);
      text-align: left;
      cursor: pointer;
      text-decoration: none;
      white-space: nowrap;
      box-sizing: border-box;
      transition: background-color var(--ngxsmk-duration-fast) var(--ngxsmk-ease-out);
    }

    .ngxsmk-split-button__menu ::ng-deep button:hover:not(:disabled),
    .ngxsmk-split-button__menu ::ng-deep a:hover {
      background: var(--ngxsmk-color-surface-hover);
    }

    .ngxsmk-split-button__menu ::ng-deep button:focus-visible,
    .ngxsmk-split-button__menu ::ng-deep a:focus-visible {
      outline: 2px solid var(--ngxsmk-color-ring);
      outline-offset: -2px;
      background: var(--ngxsmk-color-surface-hover);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxsmkSplitButton {
  private readonly elementRef = inject(ElementRef);

  readonly label = input<string>('');
  readonly variant = input<'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'>(
    'primary',
  );
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly disabled = input(false, { transform: booleanAttribute });
  readonly loading = input(false, { transform: booleanAttribute });

  readonly action = output<MouseEvent>();

  protected readonly menuOpen = signal(false);

  protected onMainClick(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      return;
    }
    this.action.emit(event);
  }

  protected toggleMenu(event: MouseEvent): void {
    if (this.disabled() || this.loading()) {
      return;
    }
    event.stopPropagation();
    this.menuOpen.update((open) => !open);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.menuOpen.set(false);
    }
  }
}
