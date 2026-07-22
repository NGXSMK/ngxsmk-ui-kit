import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (show()) {
      <button
        type="button"
        class="ngxsmk-back-to-top"
        aria-label="Scroll to top"
        (click)="scrollToTop()"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="18 15 12 9 6 15"></polyline>
        </svg>
      </button>
    }
  `,
  styles: `
    .ngxsmk-back-to-top {
      position: fixed;
      bottom: 1.75rem;
      right: 1.75rem;
      z-index: var(--ngxsmk-z-floating, 1200);
      width: 2.75rem;
      height: 2.75rem;
      border-radius: var(--ngxsmk-radius-full, 9999px);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      background: color-mix(in srgb, var(--ngxsmk-color-surface, #ffffff) 90%, transparent);
      color: var(--ngxsmk-color-on-surface, #09090b);
      backdrop-filter: blur(12px) saturate(1.5);
      box-shadow: var(--ngxsmk-shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.12));
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition:
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        background-color 0.15s ease,
        border-color 0.15s ease,
        box-shadow 0.15s ease;
      animation: ngxsmk-btn-scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
    }

    .ngxsmk-back-to-top:hover {
      transform: translateY(-3px) scale(1.08);
      background: var(--ngxsmk-color-primary, #7c3aed);
      border-color: var(--ngxsmk-color-primary, #7c3aed);
      color: var(--ngxsmk-color-on-primary, #ffffff);
      box-shadow: 0 12px 20px -4px
        color-mix(in srgb, var(--ngxsmk-color-primary, #7c3aed) 40%, transparent);
    }

    .ngxsmk-back-to-top:active {
      transform: translateY(0) scale(0.95);
    }

    .ngxsmk-back-to-top:focus-visible {
      outline: 2px solid var(--ngxsmk-color-primary, #7c3aed);
      outline-offset: 2px;
    }

    @keyframes ngxsmk-btn-scale-in {
      from {
        opacity: 0;
        transform: scale(0.6) translateY(10px);
      }
      to {
        opacity: 1;
        transform: scale(1) translateY(0);
      }
    }
  `,
})
export class ScrollToTop {
  protected readonly show = signal(false);

  @HostListener('window:scroll', [])
  protected onWindowScroll(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    this.show.set(scrollY > 280);
  }

  protected scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
