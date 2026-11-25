"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { EN_COPY } from "@/lib/i18n/en";
import { ID_COPY } from "@/lib/i18n/id";
import type { Locale, WebCopy } from "@/lib/i18n/types";

const STORAGE_KEY = "rakitek-locale";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (next: Locale) => void;
  copy: WebCopy;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "en",
  setLocale: () => {},
  copy: EN_COPY,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "id" || saved === "en") {
        setLocaleState(saved);
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore storage restrictions
    }
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    document.documentElement.lang = next;
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage restrictions
    }
  };

  const copy = locale === "id" ? ID_COPY : EN_COPY;

  return (
    <LanguageContext.Provider value={{ locale, setLocale, copy }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage(): LanguageContextValue {
  return useContext(LanguageContext);
}
