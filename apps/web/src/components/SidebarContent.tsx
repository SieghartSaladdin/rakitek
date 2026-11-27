"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { catalog, getAllComponents } from "@/lib/catalog";
import { groupByCategory } from "@/lib/catalog-utils";
import type { AtomicLevel, CatalogComponentEntry } from "../../../../registry/schema";
import { GitHubStarsLink } from "./GitHubStarsLink";
import { useLanguage } from "./LanguageProvider";
import { LanguageToggle } from "./LanguageToggle";
import { RakitekLogo } from "./RakitekLogo";
import { SidebarAccordion } from "./SidebarAccordion";

interface SidebarContentProps {
  onNavigate?: () => void;
}

const LEVEL_CONFIG: Array<{ level: AtomicLevel; browseHref: string; groupedByCategory: boolean }> = [
  { level: "atom", browseHref: "/atoms", groupedByCategory: false },
  { level: "molecule", browseHref: "/molecules", groupedByCategory: false },
  { level: "organism", browseHref: "/organisms", groupedByCategory: true },
  { level: "template", browseHref: "/templates", groupedByCategory: false },
  { level: "page", browseHref: "/pages", groupedByCategory: false },
];

function matchesQuery(item: CatalogComponentEntry, q: string): boolean {
  if (!q) return true;
  return `${item.name} ${item.id} ${item.category} ${item.level} ${item.tags.join(" ")}`
    .toLowerCase()
    .includes(q);
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const { copy } = useLanguage();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const guideLinks = [
    { href: "/docs#install", label: copy.sidebar.installGuide },
    { href: "/docs#usage", label: copy.sidebar.usageGuide },
    { href: "/docs#mcp", label: copy.sidebar.mcpDocs },
    { href: "/docs#skills", label: copy.sidebar.skillsPlugin },
  ];

  const styles = useMemo(
    () =>
      catalog.styles.filter(
        (s) => !q || `${s.name} ${s.id} ${s.vibe} ${s.tags.join(" ")}`.toLowerCase().includes(q),
      ),
    [q],
  );

  const byLevel = useMemo(() => {
    const all = getAllComponents().filter((item) => matchesQuery(item, q));
    return LEVEL_CONFIG.map((cfg) => {
      const items = all.filter((item) => item.level === cfg.level);
      const meta = copy.sidebar.levels[cfg.level];
      return {
        ...cfg,
        title: meta.title,
        browseLabel: meta.browseLabel,
        items,
        groups: cfg.groupedByCategory ? groupByCategory(items) : [],
      };
    });
  }, [q, copy]);

  const totalMatches = styles.length + byLevel.reduce((sum, s) => sum + s.items.length, 0);

  const linkClass = (active: boolean) =>
    `flex min-h-[44px] items-center justify-between rounded-lg px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
      active ? "bg-white/14 font-semibold text-white" : "text-zinc-300 hover:bg-white/8 hover:text-white"
    }`;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3.5">
        <Link
          href="/"
          onClick={onNavigate}
          className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <RakitekLogo size={30} />
          <div>
            <span className="block text-sm font-bold leading-none text-white">rakitek</span>
            <span className="mt-0.5 block font-mono text-[10px] text-zinc-400">
              {copy.sidebar.registryTagline}
            </span>
          </div>
        </Link>
        <LanguageToggle compact />
      </div>

      <div>
        <label htmlFor="rk-sidebar-search" className="sr-only">
          {copy.sidebar.searchAria}
        </label>
        <input
          id="rk-sidebar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={copy.sidebar.searchPlaceholder}
          className="min-h-[44px] w-full rounded-lg border border-white/12 bg-white/[0.04] px-3 text-xs text-white placeholder:text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-1" aria-label={copy.sidebar.navAria}>
        <div className="space-y-1">
          <Link href="/overview" onClick={onNavigate} className={linkClass(pathname === "/overview")}>
            <span>{copy.sidebar.overview}</span>
          </Link>
          <Link href="/docs" onClick={onNavigate} className={linkClass(pathname === "/docs")}>
            <span>{copy.sidebar.documentation}</span>
          </Link>
        </div>

        {q && totalMatches === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-zinc-400">
            <p>{copy.sidebar.noMatches(query)}</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 min-h-[44px] font-semibold text-white underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {copy.common.clearSearch}
            </button>
          </div>
        ) : null}

        {!q ? (
          <SidebarAccordion
            title={copy.sidebar.guides}
            defaultOpen={pathname.startsWith("/docs")}
            forceOpen={pathname.startsWith("/docs")}
          >
            {guideLinks.map((guide) => (
              <Link key={guide.href} href={guide.href} onClick={onNavigate} className={linkClass(false)}>
                <span>{guide.label}</span>
              </Link>
            ))}
          </SidebarAccordion>
        ) : null}

        {styles.length > 0 ? (
          <SidebarAccordion
            title={copy.sidebar.websiteStyles}
            count={styles.length}
            defaultOpen={pathname === "/styles"}
            forceOpen={Boolean(q) || pathname === "/styles"}
          >
            <Link href="/styles" onClick={onNavigate} className={linkClass(pathname === "/styles")}>
              <span>{copy.sidebar.browseAllStyles}</span>
            </Link>
            {styles.map((style) => (
              <Link key={style.id} href={`/styles#${style.id}`} onClick={onNavigate} className={linkClass(false)}>
                <span className="flex items-center gap-2 truncate">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/25"
                    style={{ backgroundColor: style.palettePreview.accent }}
                    aria-hidden="true"
                  />
                  <span className="truncate">{style.name}</span>
                </span>
              </Link>
            ))}
          </SidebarAccordion>
        ) : null}

        {byLevel.map((section) => {
          if (section.items.length === 0) return null;
          const hasActive =
            pathname === section.browseHref ||
            section.items.some((item) => pathname === `/item/${item.kind}/${item.id}`);
          return (
            <SidebarAccordion
              key={section.level}
              title={section.title}
              count={section.items.length}
              defaultOpen
              forceOpen={Boolean(q) || hasActive}
            >
              <Link href={section.browseHref} onClick={onNavigate} className={linkClass(pathname === section.browseHref)}>
                <span>{section.browseLabel}</span>
              </Link>
              {section.groupedByCategory
                ? section.groups.map((group) => (
                    <div key={group.category} className="pt-1.5">
                      <p className="px-3 pb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                        {group.category}
                      </p>
                      {group.items.map((item) => {
                        const href = `/item/${item.kind}/${item.id}`;
                        return (
                          <Link
                            key={item.id}
                            href={href}
                            onClick={onNavigate}
                            aria-current={pathname === href ? "page" : undefined}
                            className={linkClass(pathname === href)}
                          >
                            <span className="truncate">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  ))
                : section.items.map((item) => {
                    const href = `/item/${item.kind}/${item.id}`;
                    return (
                      <Link
                        key={item.id}
                        href={href}
                        onClick={onNavigate}
                        aria-current={pathname === href ? "page" : undefined}
                        className={linkClass(pathname === href)}
                      >
                        <span className="truncate">{item.name}</span>
                      </Link>
                    );
                  })}
            </SidebarAccordion>
          );
        })}
      </nav>

      <div className="border-t border-white/10 pt-3">
        <GitHubStarsLink variant="sidebar" />
      </div>
    </div>
  );
}
