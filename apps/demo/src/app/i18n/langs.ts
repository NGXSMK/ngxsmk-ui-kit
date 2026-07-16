export interface LangDef {
  code: string;
  label: string;
  dir: 'ltr' | 'rtl';
  flag: string;
}

export const LANGS: LangDef[] = [
  { code: 'en', label: 'English', dir: 'ltr', flag: '🇬🇧' },
  { code: 'es', label: 'Español', dir: 'ltr', flag: '🇪🇸' },
  { code: 'sv', label: 'Svenska', dir: 'ltr', flag: '🇸🇪' },
  { code: 'ar', label: 'العربية', dir: 'rtl', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', dir: 'ltr', flag: '🇫🇷' },
  { code: 'de', label: 'Deutsch', dir: 'ltr', flag: '🇩🇪' },
  { code: 'zh', label: '中文', dir: 'ltr', flag: '🇨🇳' },
  { code: 'ja', label: '日本語', dir: 'ltr', flag: '🇯🇵' },
  { code: 'pt', label: 'Português', dir: 'ltr', flag: '🇧🇷' },
  { code: 'hi', label: 'हिन्दी', dir: 'ltr', flag: '🇮🇳' },
];

export const DEFAULT_LANG = 'en';

export const RTL_LANGS = new Set(LANGS.filter((l) => l.dir === 'rtl').map((l) => l.code));

export function isRtl(code: string): boolean {
  return RTL_LANGS.has(code);
}
