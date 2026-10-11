import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import pt from './locales/pt.json';

export const LANGUAGES = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'pt', label: 'Português' },
    { code: 'fr', label: 'Français' },
] as const;

const syncDocumentLanguage = (language: string) => {
    document.documentElement.lang = language;
};

i18n.use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { translation: en },
            es: { translation: es },
            pt: { translation: pt },
            fr: { translation: fr },
        },
        supportedLngs: LANGUAGES.map((language) => language.code),
        nonExplicitSupportedLngs: true,
        fallbackLng: 'en',
        interpolation: { escapeValue: false },
        detection: {
            order: ['localStorage', 'navigator'],
            lookupLocalStorage: 'language',
            caches: ['localStorage'],
        },
    });

syncDocumentLanguage(i18n.resolvedLanguage ?? 'en');
i18n.on('languageChanged', syncDocumentLanguage);

export default i18n;
