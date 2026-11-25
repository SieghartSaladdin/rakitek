"use client";

import { useLanguage } from "./LanguageProvider";
import type { Locale } from "@/lib/i18n/types";

interface LanguageToggleProps {
  compact?: boolean;
}

const OPTIONS: Array<{ code: Locale; label: string }> = [
  { code: "en", label: "EN" },
  { code: "id", label: "ID" },
];

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { locale, setLocale, copy } = useLanguage();

  return (
    <div
      role="group"
      aria-label={copy.common.languageAria}
      className="pointer-events-auto inline-flex items-center rounded-full border border-white/15 bg-white/[0.05] p-0.5 backdrop-blur-sm"
    >
      {OPTIONS.map((opt) => {
        const active = locale === opt.code;
        return (
          <button
            key={opt.code}
            type="button"
            aria-pressed={active}
            onClick={() => setLocale(opt.code)}
            className={`cursor-pointer rounded-full font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
              compact ? "min-h-[32px] px-2.5" : "min-h-[36px] px-3"
            } ${active ? "bg-white text-black" : "text-zinc-300 hover:text-white"}`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
