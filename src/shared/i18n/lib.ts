import en from "./translations/en.json";
import ru from "./translations/ru.json";

export const languages = {
  ru: "Русский",
  en: "English",
};

export const defaultLang = "ru";

export const translations = {
  en,
  ru,
} as const;

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split("/");
  if (lang in translations) return lang as keyof typeof translations;
  return defaultLang;
}

export function useTranslations(lang: keyof typeof translations) {
  return function t(key: keyof (typeof translations)[typeof defaultLang]) {
    return translations[lang][key] || translations[defaultLang][key];
  };
}
