"use client";

import Link from "next/link";
import { GitHubStarsLink } from "./GitHubStarsLink";
import { JellyfishCanvas } from "./JellyfishCanvas";
import { useLanguage } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";
import { RakitekLogo } from "./RakitekLogo";

export function LandingHero() {
  const { copy } = useLanguage();

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#050506] text-[#fafaf8]">
      {/* Full-bleed interactive bioluminescent jellyfish canvas */}
      <div className="absolute inset-0 z-0">
        <JellyfishCanvas />
      </div>

      {/* Minimal top-left wordmark + top-right GitHub stars and EN/ID toggle */}
      <header className="pointer-events-none relative z-10 flex items-center justify-between gap-3 px-6 py-7 sm:px-10 sm:py-9">
        <span className="inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-200">
          <RakitekLogo size={28} />
          <span>RAKITEK</span>
        </span>
        <div className="pointer-events-auto flex items-center gap-2.5">
          <GitHubStarsLink />
          <LanguageToggle />
        </div>
      </header>

      {/* Bottom minimalist corners: short typography left, single entry button right */}
      <section className="pointer-events-none relative z-10 flex flex-col justify-between gap-6 px-6 pb-8 sm:flex-row sm:items-end sm:px-10 sm:pb-11">
        <div>
          <h1 className="text-4xl font-bold leading-[0.98] tracking-tight text-white sm:text-6xl">
            <span className="block">Rakitek</span>
            <span
              className="mt-1 block font-normal italic text-zinc-200"
              style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
            >
              {copy.landing.tagline}
            </span>
          </h1>
        </div>

        <Link
          href="/overview"
          className="pointer-events-auto inline-flex min-h-[44px] w-fit items-center rounded-full border border-white/25 bg-white/[0.06] px-7 text-xs font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:border-white hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {copy.landing.cta}
        </Link>
      </section>
    </div>
  );
}
