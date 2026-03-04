import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Translations, ruTranslations, enTranslations } from './translations';

type Language = 'ru' | 'en';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

interface I18nProviderProps {
  children: ReactNode;
}

export const I18nProvider: React.FC<I18nProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('postapi-language');
    return (saved as Language) || 'ru';
  });

  useEffect(() => {
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

  return (
    <I18nContext.Provider value={value}>
      {children}
    </I18nContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within an I18nProvider');
  }
  return context;
};