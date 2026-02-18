import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import translationTR from './locales/tr/translation.json';
import translationEN from './locales/en/translation.json';

const resources = {
  tr: {
    translation: translationTR
  },
  en: {
    translation: translationEN
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'tr', // Varsayılan dil
    debug: false,
    interpolation: {
      escapeValue: false // React zaten XSS koruması sağlıyor
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'] // Seçilen dili hafızada tut
    }
  });

export default i18n;
