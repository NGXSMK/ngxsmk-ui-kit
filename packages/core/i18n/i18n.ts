import {
  DOCUMENT,
  effect,
  EnvironmentProviders,
  InjectionToken,
  inject,
  makeEnvironmentProviders,
  Pipe,
  PipeTransform,
  signal,
  WritableSignal,
} from '@angular/core';

export type Translations = Record<string, string>;
export type I18nParams = Record<string, string | number>;

export interface I18nStore {
  readonly locale: WritableSignal<string>;
  readonly translations: WritableSignal<Translations>;
  setLocale: (locale: string) => void;
  setTranslations: (translations: Translations) => void;
  translate: (key: string, params?: I18nParams) => string;
}

function interpolate(template: string, params?: I18nParams): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{${key}}`,
  );
}

export function createI18n(initial: Translations = {}, locale = 'en'): I18nStore {
  const translations = signal<Translations>(initial);
  const loc = signal(locale);
  return {
    locale: loc,
    translations,
    setLocale: (l) => loc.set(l),
    setTranslations: (t) => translations.set(t),
    translate: (key, params) => interpolate(translations()[key] ?? key, params),
  };
}

export const NGXSMK_I18N = new InjectionToken<I18nStore>('NGXSMK_I18N', {
  providedIn: 'root',
  factory: () => createI18n(),
});

export function provideI18n(initial: Translations = {}, locale = 'en'): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: NGXSMK_I18N, useValue: createI18n(initial, locale) },
  ]);
}

@Pipe({
  name: 'ngxsmkI18n',
  standalone: true,
  pure: false,
})
export class NgxsmkI18nPipe implements PipeTransform {
  private readonly store = inject(NGXSMK_I18N);

  transform(key: string, params?: I18nParams): string {
    const template = this.store.translations()[key] ?? key;
    return interpolate(template, params);
  }
}

export function useDirection(): WritableSignal<'ltr' | 'rtl'> {
  const doc = inject(DOCUMENT);
  const isBrowser = typeof document !== 'undefined';
  const initial: 'ltr' | 'rtl' =
    isBrowser && (doc.documentElement.getAttribute('dir') as 'ltr' | 'rtl') === 'rtl'
      ? 'rtl'
      : 'ltr';
  const dir = signal<'ltr' | 'rtl'>(initial);
  effect(() => {
    if (isBrowser) doc.documentElement.setAttribute('dir', dir());
  });
  return dir;
}
