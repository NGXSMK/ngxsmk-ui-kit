import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DEFAULT_LANG, LANGS, isRtl } from './langs';

const STORAGE_KEY = 'ngxsmk-lang';

@Injectable({ providedIn: 'root' })
export class LangService {
  private readonly translate = inject(TranslateService);
  private readonly doc = inject(DOCUMENT);

  readonly langs = LANGS;
  readonly current = signal<string>(DEFAULT_LANG);

  constructor() {
    this.translate.addLangs(LANGS.map((l) => l.code));
    const stored = this.readStored();
    const initial = stored && LANGS.some((l) => l.code === stored) ? stored : DEFAULT_LANG;
    this.apply(initial);
  }

  setLang(code: string): void {
    if (!LANGS.some((l) => l.code === code)) return;
    this.apply(code);
  }

  private apply(code: string): void {
    this.current.set(code);
    this.translate.use(code);
    this.persist(code);
    const el = this.doc.documentElement;
    el.lang = code;
    el.dir = isRtl(code) ? 'rtl' : 'ltr';
  }

  private readStored(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  }

  private persist(code: string): void {
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* noop */
    }
  }
}
