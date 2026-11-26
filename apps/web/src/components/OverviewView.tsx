"use client";

import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { useLanguage } from "./LanguageProvider";
import { LivePreviewFrame } from "./LivePreviewFrame";

export function OverviewView() {
  const { copy } = useLanguage();
  const featuredSection = catalog.sections[0];
  const featuredUi = catalog.ui.slice(0, 2);

  return (
    <div className="space-y-14">
      <section className="space-y-6 border-b border-white/10 pb-10">
        <h1 className="max-w-3xl text-3xl font-bold tracking-tight sm:text-5xl">
          {copy.overview.headline}
        </h1>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-300">
          {copy.overview.introPrefix}{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-xs text-white">
            --rk-*
          </code>{" "}
          {copy.overview.introSuffix}
        </p>

        <div className="grid gap-4 pt-2 sm:grid-cols-3">
          <Link
            href="/styles"
            className="rounded-xl border border-white/10 bg-[#141418] p-5 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <p className="font-mono text-xs text-zinc-400">{copy.overview.stylesTitle}</p>
            <p className="mt-2 text-3xl font-bold">{catalog.styles.length}</p>
            <p className="mt-1 text-xs text-zinc-400">{copy.overview.stylesNote}</p>
          </Link>
          <Link
            href="/ui"
            className="rounded-xl border border-white/10 bg-[#141418] p-5 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <p className="font-mono text-xs text-zinc-400">{copy.overview.uiTitle}</p>
            <p className="mt-2 text-3xl font-bold">{catalog.ui.length}</p>
            <p className="mt-1 text-xs text-zinc-400">{copy.overview.uiNote}</p>
          </Link>
          <Link
            href="/sections"
            className="rounded-xl border border-white/10 bg-[#141418] p-5 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <p className="font-mono text-xs text-zinc-400">{copy.overview.sectionsTitle}</p>
            <p className="mt-2 text-3xl font-bold">{catalog.sections.length}</p>
            <p className="mt-1 text-xs text-zinc-400">{copy.overview.sectionsNote}</p>
          </Link>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            {copy.overview.wf1Tag}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{copy.overview.wf1Title}</h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-300">
            {copy.overview.wf1BeforeStrong}{" "}
            <strong className="text-white">{copy.overview.wf1Strong}</strong>{" "}
            {copy.overview.wf1Between}{" "}
            <code className="font-mono text-zinc-100">tokens.css</code>{" "}
            {copy.overview.wf1AfterCode}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-6">
          <p className="font-mono text-xs uppercase tracking-wider text-zinc-400">
            {copy.overview.wf2Tag}
          </p>
          <h2 className="mt-2 text-lg font-semibold">{copy.overview.wf2Title}</h2>
          <p className="mt-2 text-xs leading-relaxed text-zinc-300">
            {copy.overview.wf2BeforeStrong}{" "}
            <strong className="text-white">{copy.overview.wf2Strong}</strong>{" "}
            {copy.overview.wf2Between}{" "}
            <code className="font-mono text-zinc-100">plan_page</code>{" "}
            {copy.overview.wf2AfterCode}
          </p>
        </div>
      </section>

      {featuredSection ? (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold">{copy.overview.featuredSection}</h2>
              <p className="text-xs text-zinc-400">
                {featuredSection.name} ({featuredSection.recommendedStyles[0] ?? "editorial-roastery"})
              </p>
            </div>
            <Link
              href={`/item/section/${featuredSection.id}`}
              className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {copy.common.inspectAndCode}
            </Link>
          </div>
          <LivePreviewFrame
            itemKey={`section/${featuredSection.id}`}
            styleId={featuredSection.recommendedStyles[0]}
            href={`/item/section/${featuredSection.id}`}
            title={featuredSection.name}
          />
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{copy.overview.featuredUi}</h2>
          <Link
            href="/ui"
            className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold text-zinc-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {copy.common.viewAllUi}
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          {featuredUi.map((item) => (
            <div key={item.id} className="space-y-2">
              <LivePreviewFrame
                itemKey={`ui/${item.id}`}
                styleId={item.recommendedStyles[0]}
                href={`/item/ui/${item.id}`}
                title={item.name}
                compact
              />
              <div className="flex items-center justify-between px-1 text-xs">
                <span className="font-medium text-zinc-200">{item.name}</span>
                <Link
                  href={`/item/ui/${item.id}`}
                  className="inline-flex min-h-[44px] items-center px-2 text-zinc-300 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  {copy.common.openDetails}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
