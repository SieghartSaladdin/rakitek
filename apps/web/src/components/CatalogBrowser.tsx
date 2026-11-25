"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogComponentEntry } from "../../../../registry/schema";
import { getAllStyles } from "@/lib/catalog";
import {
  buildCategoryOptions,
  buildVibeOptions,
  filterCatalogItems,
  type SelectOption,
} from "@/lib/catalog-utils";
import type { CatalogKindKey } from "@/lib/i18n/types";
import { DropdownSelect } from "./DropdownSelect";
import { useLanguage } from "./LanguageProvider";
import { LivePreviewFrame } from "./LivePreviewFrame";

interface CatalogBrowserProps {
  kind: CatalogKindKey;
  title?: string;
  subtitle?: string;
  items: CatalogComponentEntry[];
}

export function CatalogBrowser({ kind, title, subtitle, items }: CatalogBrowserProps) {
  const { copy } = useLanguage();
  const kindCopy = copy.catalog.kindMeta[kind];
  const resolvedTitle = kindCopy.title ?? title ?? "";
  const resolvedSubtitle = kindCopy.subtitle ?? subtitle ?? "";

  const styles = getAllStyles();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [vibe, setVibe] = useState("all");
  const [styleId, setStyleId] = useState("all");

  const categoryOptions = useMemo(
    () => buildCategoryOptions(items, copy.catalog.allCategories),
    [items, copy.catalog.allCategories],
  );
  const vibeOptions = useMemo(
    () => buildVibeOptions(items, copy.catalog.allVibes),
    [items, copy.catalog.allVibes],
  );
  const styleOptions = useMemo<SelectOption[]>(
    () => [
      { value: "all", label: copy.catalog.allStyles, count: items.length },
      ...styles.map((s) => ({
        value: s.id,
        label: s.name,
        swatchColor: s.palettePreview.accent,
        count: items.filter((i) => i.recommendedStyles.includes(s.id)).length,
      })),
    ],
    [items, styles, copy.catalog.allStyles],
  );

  const filtered = useMemo(
    () => filterCatalogItems(items, { query, category, vibe, styleId }),
    [items, query, category, vibe, styleId],
  );

  const hasFilters = Boolean(query.trim()) || category !== "all" || vibe !== "all" || styleId !== "all";
  const resetFilters = () => {
    setQuery("");
    setCategory("all");
    setVibe("all");
    setStyleId("all");
  };

  return (
    <div className="space-y-8">
      <div className="space-y-5 border-b border-white/10 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{resolvedTitle}</h1>
            <p className="mt-2 max-w-2xl text-sm text-zinc-300">{resolvedSubtitle}</p>
          </div>
          <span className="font-mono text-xs text-zinc-400">
            {copy.common.showingOf(filtered.length, items.length)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label htmlFor={`rk-catalog-search-${kind}`} className="sr-only">
            {copy.catalog.filterAria(resolvedTitle)}
          </label>
          <input
            id={`rk-catalog-search-${kind}`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={copy.catalog.searchPlaceholder(kindCopy.plural)}
            className="min-h-[44px] w-full rounded-lg border border-white/15 bg-[#141418] px-3.5 text-xs text-white placeholder:text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-white sm:w-60"
          />
          <DropdownSelect
            label={copy.catalog.categoryLabel}
            value={category}
            options={categoryOptions}
            onChange={setCategory}
          />
          <DropdownSelect
            label={copy.catalog.vibeLabel}
            value={vibe}
            options={vibeOptions}
            onChange={setVibe}
          />
          <DropdownSelect
            label={copy.catalog.styleLabel}
            value={styleId}
            options={styleOptions}
            onChange={setStyleId}
          />
          {hasFilters ? (
            <button
              type="button"
              onClick={resetFilters}
              className="min-h-[44px] px-2 text-xs font-semibold text-zinc-300 underline underline-offset-4 hover:text-white cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {copy.common.reset}
            </button>
          ) : null}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141418] p-10 text-center">
          <p className="text-sm font-medium text-white">
            {copy.catalog.emptyTitle(kindCopy.plural)}
          </p>
          <p className="mt-1 text-xs text-zinc-400">{copy.catalog.emptyHint}</p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-5 inline-flex min-h-[44px] items-center rounded-full bg-white px-5 text-xs font-semibold text-black cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {copy.common.resetFilters}
          </button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {filtered.map((item) => (
            <article
              key={item.id}
              className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#141418] transition-colors hover:border-white/20"
            >
              <div className="p-3.5 pb-0">
                <LivePreviewFrame
                  itemKey={`${item.kind}/${item.id}`}
                  styleId={styleId !== "all" ? styleId : item.recommendedStyles[0]}
                  href={`/item/${item.kind}/${item.id}`}
                  title={item.name}
                  compact
                />
              </div>
              <div className="mt-3.5 flex flex-1 flex-col justify-between gap-4 border-t border-white/10 p-5">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-base font-semibold">{item.name}</h2>
                    <span className="shrink-0 rounded bg-white/10 px-2 py-0.5 font-mono text-[11px] uppercase text-zinc-200">
                      {item.category}
                    </span>
                  </div>
                  <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-300">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-1.5">
                    {item.vibes.map((v) => (
                      <span
                        key={v}
                        className="rounded-full border border-white/15 px-2.5 py-0.5 text-[11px] text-zinc-300"
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                  <Link
                    href={`/item/${item.kind}/${item.id}`}
                    className="inline-flex min-h-[44px] items-center px-2 text-xs font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    {copy.common.inspectAndCode}
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
