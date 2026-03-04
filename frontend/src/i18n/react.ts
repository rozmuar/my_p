import React from 'react';
import { Translations, ruTranslations, enTranslations } from './translations';

type Language = 'ru' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = React.createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = React.useState<Language>('ru');

  React.useEffect(() => {
    const saved = localStorage.getItem('postapi-language');
    if (saved && (saved === 'ru' || saved === 'en')) {
      setLanguage(saved);
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('postapi-language', language);
  }, [language]);

  const translations = {
    ru: ruTranslations,
    en: enTranslations,
  };

  const value = {
    language,
    setLanguage,
    t: translations[language],
  };

  return React.createElement(I18nContext.Provider, { value }, children);
};

export const useTranslation = () => {
  const context = React.useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};