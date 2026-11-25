"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { CatalogComponentEntry } from "../../../../registry/schema";
import { getAllStyles, getItemsByKind } from "@/lib/catalog";
import { getAdjacentItems, type SelectOption } from "@/lib/catalog-utils";
import { buildSourceFileTabs, CodeViewer } from "./CodeViewer";
import { DropdownSelect } from "./DropdownSelect";
import { FullscreenPreviewModal } from "./FullscreenPreviewModal";
import { ItemMetaGrid } from "./ItemMetaGrid";
import {
  ResponsiveIframeStage,
  VIEWPORT_PRESETS,
  type ViewportMode,
} from "./ResponsiveIframeStage";

interface ItemDetailViewProps {
  item: CatalogComponentEntry;
  code: string;
  stylesCss?: string;
  previewCode?: string;
  extraFiles?: Record<string, string>;
}

const VIEWPORT_OPTIONS: SelectOption[] = [
  { value: "desktop", label: VIEWPORT_PRESETS.desktop.label },
  { value: "tablet", label: VIEWPORT_PRESETS.tablet.label },
  { value: "mobile", label: VIEWPORT_PRESETS.mobile.label },
];

type DetailTab = "preview" | "code" | "usage";

export function ItemDetailView({
  item,
  code,
  stylesCss,
  previewCode,
  extraFiles,
}: ItemDetailViewProps) {
  const styles = getAllStyles();
  const primaryStyle = item.recommendedStyles[0] ?? styles[0]?.id ?? "editorial-roastery";
  const [tab, setTab] = useState<DetailTab>("preview");
  const [viewport, setViewport] = useState<ViewportMode>("desktop");
  const [previewStyle, setPreviewStyle] = useState(primaryStyle);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [copiedMcp, setCopiedMcp] = useState(false);

  const styleOptions = useMemo<SelectOption[]>(
    () =>
      styles.map((s) => ({
        value: s.id,
        label: s.name,
        swatchColor: s.palettePreview.accent,
      })),
    [styles],
  );

  const { prev, next } = useMemo(
    () => getAdjacentItems(getItemsByKind(item.kind), item.id),
    [item.kind, item.id],
  );

  const sourceFiles = useMemo(
    () =>
      buildSourceFileTabs({
        componentPath: item.componentPath,
        stylesPath: item.stylesPath,
        code,
        stylesCss,
        extraFiles,
      }),
    [item.componentPath, item.stylesPath, code, stylesCss, extraFiles],
  );

  const tabs: Array<{ key: DetailTab; label: string }> = [
    { key: "preview", label: "Preview" },
    {
      key: "code",
      label: sourceFiles.length > 1 ? `Code (${sourceFiles.length} files)` : "TSX Code",
    },
    { key: "usage", label: "Usage" },
  ];

  const mcpPrompt = `Use rakitek-mcp get_component("${item.id}") with style "${previewStyle}".`;

  const handleCopyMcp = async () => {
    await navigator.clipboard.writeText(mcpPrompt);
    setCopiedMcp(true);
    setTimeout(() => setCopiedMcp(false), 1800);
  };

  return (
    <>
    <div className="space-y-8">
      <div className="space-y-4 border-b border-white/10 pb-6">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 font-mono text-xs text-zinc-400">
          <Link
            href={`/${item.level}s`}
            className="capitalize hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {item.level}s
          </Link>
          <span>/</span>
          <span className="capitalize">{item.category}</span>
          <span>/</span>
          <span className="text-zinc-200">{item.id}</span>
        </nav>

        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-300">
              {item.description}
            </p>
          </div>
          <button
            type="button"
            onClick={handleCopyMcp}
            className="inline-flex min-h-[44px] shrink-0 items-center rounded-lg border border-white/15 bg-white/6 px-4 text-xs font-semibold text-white transition-colors hover:bg-white/14 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {copiedMcp ? "MCP Prompt Copied" : "Copy MCP Prompt"}
          </button>
        </div>

        <ItemMetaGrid item={item} primaryStyle={primaryStyle} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap rounded-lg border border-white/10 bg-[#141418] p-1 text-xs">
          {tabs.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-pressed={tab === t.key}
              className={`min-h-[44px] rounded-md px-4 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                tab === t.key ? "bg-white text-black font-semibold" : "text-zinc-300 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "preview" ? (
          <div className="flex flex-wrap items-center gap-2">
            <DropdownSelect
              label="Style"
              value={previewStyle}
              options={styleOptions}
              onChange={setPreviewStyle}
              align="right"
            />
            <DropdownSelect
              label="Viewport"
              value={viewport}
              options={VIEWPORT_OPTIONS}
              onChange={(val) => setViewport(val as ViewportMode)}
              align="right"
            />
            <button
              type="button"
              onClick={() => setFullscreenOpen(true)}
              aria-label="Open fullscreen preview"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-white/15 bg-white/8 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-white/16 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path
                  d="M2.5 6V2.5H6M10 2.5H13.5V6M13.5 10V13.5H10M6 13.5H2.5V10"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="square"
                />
              </svg>
              <span>Fullscreen</span>
            </button>
          </div>
        ) : null}
      </div>

      {tab === "preview" ? (
        <ResponsiveIframeStage
          kind={item.kind}
          id={item.id}
          title={item.name}
          styleId={previewStyle}
          viewport={viewport}
        />
      ) : tab === "code" ? (
        <CodeViewer files={sourceFiles} />
      ) : (
        <CodeViewer code={previewCode ?? "// No usage file."} filename={item.previewPath} />
      )}

      <nav
        aria-label="Adjacent items"
        className="grid gap-3 border-t border-white/10 pt-6 sm:grid-cols-2"
      >
        {prev ? (
          <Link
            href={`/item/${prev.kind}/${prev.id}`}
            className="flex min-h-[44px] flex-col rounded-xl border border-white/10 bg-[#141418] p-4 transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="font-mono text-[11px] text-zinc-400">Previous</span>
            <span className="mt-1 text-sm font-semibold text-white">{prev.name}</span>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/item/${next.kind}/${next.id}`}
            className="flex min-h-[44px] flex-col items-end rounded-xl border border-white/10 bg-[#141418] p-4 text-right transition-colors hover:border-white/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <span className="font-mono text-[11px] text-zinc-400">Next</span>
            <span className="mt-1 text-sm font-semibold text-white">{next.name}</span>
          </Link>
        ) : null}
      </nav>
    </div>

    <FullscreenPreviewModal
      open={fullscreenOpen}
      kind={item.kind}
      id={item.id}
      name={item.name}
      styleId={previewStyle}
      styleOptions={styleOptions}
      viewport={viewport}
      onStyleChange={setPreviewStyle}
      onViewportChange={setViewport}
      onClose={() => setFullscreenOpen(false)}
    />
    </>
  );
}
