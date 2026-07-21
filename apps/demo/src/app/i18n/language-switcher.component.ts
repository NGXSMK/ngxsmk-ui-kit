import { Component, computed, inject, signal } from '@angular/core';
import { UpperCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { LangService } from './lang.service';
import { isRtl } from './langs';

@Component({
  selector: 'app-language-switcher',
  standalone: true,
  imports: [TranslatePipe, UpperCasePipe],
  template: `
    <div class="lang" [class.lang--rtl]="isRtl()">
      <button
        class="lang__btn"
        type="button"
        [attr.aria-label]="'language.select' | translate"
        [attr.aria-expanded]="open()"
        (click)="open.set(!open())"
      >
        <span class="lang__globe" aria-hidden="true">🌐</span>
        <span class="lang__code">{{ active().code | uppercase }}</span>
        <span class="lang__caret" aria-hidden="true">▾</span>
      </button>

      @if (open()) {
        <ul class="lang__menu" role="listbox" [attr.aria-label]="'language.select' | translate">
          @for (l of langs; track l.code) {
            <li role="option" [attr.aria-selected]="l.code === active().code">
              <button
                class="lang__item"
                type="button"
                [class.lang__item--active]="l.code === active().code"
                (click)="choose(l.code)"
              >
                <span class="lang__flag" aria-hidden="true">{{ l.flag }}</span>
                <span class="lang__label">{{ l.label }}</span>
              </button>
            </li>
          }
        </ul>
      }
    </div>
  `,
  styles: `
    .lang {
      position: relative;
      flex-shrink: 0;
    }

    .lang__btn {
      display: inline-flex;
      align-items: center;
      gap: 0.375rem;
      height: 2rem;
      padding: 0 0.5rem;
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: transparent;
      color: var(--ngxsmk-color-on-surface-variant, #71717a);
      cursor: pointer;
      font-size: var(--ngxsmk-text-body-sm-size);
      font-weight: 600;
      transition:
        color 0.15s,
        border-color 0.15s,
        background 0.15s;
    }
    .lang__btn:hover {
      color: var(--ngxsmk-color-on-surface, #09090b);
      border-color: color-mix(
        in srgb,
        var(--ngxsmk-color-outline) 60%,
        var(--ngxsmk-color-primary)
      );
    }

    .lang__globe {
      font-size: var(--ngxsmk-text-body-md-size);
      line-height: 1;
    }
    .lang__caret {
      font-size: var(--ngxsmk-text-body-xs-size);
      opacity: 0.7;
    }

    .lang__menu {
      position: absolute;
      top: calc(100% + 0.375rem);
      inset-inline-end: 0;
      z-index: var(--ngxsmk-z-dropdown, 1000);
      margin: 0;
      padding: 0.25rem;
      list-style: none;
      min-width: 11rem;
      background: var(--ngxsmk-color-surface, #fff);
      border: 1px solid var(--ngxsmk-color-outline, #e4e4e7);
      border-radius: var(--ngxsmk-radius-lg, 0.5rem);
      box-shadow: var(--ngxsmk-shadow-lg, 0 20px 25px -5px rgba(0, 0, 0, 0.1));
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
      animation: lang-pop 0.12s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .lang--rtl .lang__menu {
      inset-inline-end: auto;
      inset-inline-start: 0;
    }

    @keyframes lang-pop {
      from {
        opacity: 0;
        transform: translateY(-4px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .lang__item {
      display: flex;
      align-items: center;
      gap: 0.625rem;
      width: 100%;
      padding: 0.5rem 0.625rem;
      border: none;
      border-radius: var(--ngxsmk-radius-md, 0.375rem);
      background: transparent;
      color: var(--ngxsmk-color-on-surface, #09090b);
      cursor: pointer;
      font-size: var(--ngxsmk-text-body-md-size);
      text-align: start;
    }
    .lang__item:hover {
      background: color-mix(in srgb, var(--ngxsmk-color-on-surface, #09090b) 4%, transparent);
    }
    .lang__item--active {
      background: var(--ngxsmk-color-primary-container, #ede9fe);
      color: var(--ngxsmk-color-on-primary-container, #4c1d95);
    }

    .lang__flag {
      font-size: var(--ngxsmk-text-body-lg-size);
      line-height: 1;
    }
  `,
})
export class LanguageSwitcher {
  private readonly lang = inject(LangService);
  readonly langs = this.lang.langs;
  readonly open = signal(false);

  readonly active = computed(
    () => this.langs.find((l) => l.code === this.lang.current()) ?? this.langs[0],
  );
  readonly isRtl = computed(() => isRtl(this.lang.current()));

  choose(code: string): void {
    this.lang.setLang(code);
    this.open.set(false);
  }
}
