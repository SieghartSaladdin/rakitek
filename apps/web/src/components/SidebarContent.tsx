"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";
import { catalog, getAllComponents } from "@/lib/catalog";
import { groupByCategory } from "@/lib/catalog-utils";
import type { AtomicLevel, CatalogComponentEntry } from "../../../../registry/schema";
import { RakitekLogo } from "./RakitekLogo";
import { SidebarAccordion } from "./SidebarAccordion";

interface SidebarContentProps {
  onNavigate?: () => void;
}

const GUIDE_LINKS = [
  { href: "/docs#usage", label: "Usage Guide" },
  { href: "/docs#mcp", label: "MCP Server Docs" },
  { href: "/docs#skills", label: "Skills & Plugin" },
];

const LEVEL_SECTIONS: Array<{
  level: AtomicLevel;
  title: string;
  browseHref: string;
  browseLabel: string;
  groupedByCategory: boolean;
}> = [
  { level: "atom", title: "Atoms", browseHref: "/atoms", browseLabel: "Browse All Atoms", groupedByCategory: false },
  { level: "molecule", title: "Molecules", browseHref: "/molecules", browseLabel: "Browse All Molecules", groupedByCategory: false },
  { level: "organism", title: "Organisms", browseHref: "/organisms", browseLabel: "Browse All Organisms", groupedByCategory: true },
  { level: "template", title: "Templates", browseHref: "/templates", browseLabel: "Browse All Templates", groupedByCategory: false },
  { level: "page", title: "Pages", browseHref: "/pages", browseLabel: "Browse All Pages", groupedByCategory: false },
];

function matchesQuery(item: CatalogComponentEntry, q: string): boolean {
  if (!q) return true;
  return `${item.name} ${item.id} ${item.category} ${item.level} ${item.tags.join(" ")}`
    .toLowerCase()
    .includes(q);
}

export function SidebarContent({ onNavigate }: SidebarContentProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const styles = useMemo(
    () =>
      catalog.styles.filter(
        (s) => !q || `${s.name} ${s.id} ${s.vibe} ${s.tags.join(" ")}`.toLowerCase().includes(q),
      ),
    [q],
  );

  const byLevel = useMemo(() => {
    const all = getAllComponents().filter((item) => matchesQuery(item, q));
    return LEVEL_SECTIONS.map((cfg) => {
      const items = all.filter((item) => item.level === cfg.level);
      return { ...cfg, items, groups: cfg.groupedByCategory ? groupByCategory(items) : [] };
    });
  }, [q]);

  const totalMatches = styles.length + byLevel.reduce((sum, s) => sum + s.items.length, 0);

  const linkClass = (active: boolean) =>
    `flex min-h-[44px] items-center justify-between rounded-lg px-3 text-xs transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
      active ? "bg-white/14 font-semibold text-white" : "text-zinc-300 hover:bg-white/8 hover:text-white"
    }`;

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="border-b border-white/10 pb-3.5">
        <Link
          href="/"
          onClick={onNavigate}
          className="inline-flex min-h-[44px] items-center gap-2.5 text-sm font-bold tracking-tight focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          <RakitekLogo size={30} />
          <div>
            <span className="block text-sm font-bold leading-none text-white">rakitek</span>
            <span className="mt-0.5 block font-mono text-[10px] text-zinc-400">UI/UX Registry</span>
          </div>
        </Link>
      </div>

      <div>
        <label htmlFor="rk-sidebar-search" className="sr-only">
          Search styles, atoms, molecules, organisms, templates, and pages
        </label>
        <input
          id="rk-sidebar-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search components, styles..."
          className="min-h-[44px] w-full rounded-lg border border-white/12 bg-white/[0.04] px-3 text-xs text-white placeholder:text-zinc-400 outline-none focus-visible:ring-2 focus-visible:ring-white"
        />
      </div>

      <nav className="flex-1 space-y-3 overflow-y-auto pr-1" aria-label="Registry sidebar">
        <div className="space-y-1">
          <Link href="/overview" onClick={onNavigate} className={linkClass(pathname === "/overview")}>
            <span>Overview</span>
          </Link>
          <Link href="/docs" onClick={onNavigate} className={linkClass(pathname === "/docs")}>
            <span>Documentation</span>
          </Link>
        </div>

        {q && totalMatches === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-xs text-zinc-400">
            <p>No items match &quot;{query}&quot;.</p>
            <button
              type="button"
              onClick={() => setQuery("")}
              className="mt-2 min-h-[44px] font-semibold text-white underline underline-offset-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Clear search
            </button>
          </div>
        ) : null}

        {!q ? (
          <SidebarAccordion
            title="Guides"
            defaultOpen={pathname.startsWith("/docs")}
            forceOpen={pathname.startsWith("/docs")}
          >
            {GUIDE_LINKS.map((guide) => (
              <Link key={guide.href} href={guide.href} onClick={onNavigate} className={linkClass(false)}>
                <span>{guide.label}</span>
              </Link>
            ))}
          </SidebarAccordion>
        ) : null}

        {styles.length > 0 ? (
          <SidebarAccordion
            title="Website Styles"
            count={styles.length}
            defaultOpen={pathname === "/styles"}
            forceOpen={Boolean(q) || pathname === "/styles"}
          >
            <Link href="/styles" onClick={onNavigate} className={linkClass(pathname === "/styles")}>
              <span>Browse All Styles</span>
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
    </div>
  );
}
