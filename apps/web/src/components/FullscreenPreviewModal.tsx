"use client";

import { useEffect } from "react";
import type { SelectOption } from "@/lib/catalog-utils";
import { DropdownSelect } from "./DropdownSelect";
import {
  ResponsiveIframeStage,
  VIEWPORT_PRESETS,
  type ViewportMode,
} from "./ResponsiveIframeStage";

import type { ComponentKind } from "../../../../registry/schema";

interface FullscreenPreviewModalProps {
  open: boolean;
  kind: ComponentKind;
  id: string;
  name: string;
  styleId: string;
  styleOptions: SelectOption[];
  viewport: ViewportMode;
  onStyleChange: (next: string) => void;
  onViewportChange: (next: ViewportMode) => void;
  onClose: () => void;
}

const VIEWPORT_KEYS: ViewportMode[] = ["desktop", "tablet", "mobile"];

export function FullscreenPreviewModal({
  open,
  kind,
  id,
  name,
  styleId,
  styleOptions,
  viewport,
  onStyleChange,
  onViewportChange,
  onClose,
}: FullscreenPreviewModalProps) {
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const rawHref = `/preview/${kind}/${id}?style=${encodeURIComponent(styleId)}`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${name} fullscreen preview`}
      className="fixed inset-0 z-50 flex flex-col bg-[#08080a] text-white"
    >
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 bg-[#101014] px-4 py-2">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-white">{name}</span>
          <span className="hidden rounded-md border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[11px] text-zinc-300 sm:inline">
            {VIEWPORT_PRESETS[viewport].shortLabel}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            role="group"
            aria-label="Fullscreen viewport mode"
            className="inline-flex rounded-lg border border-white/10 bg-[#18181f] p-0.5 text-xs"
          >
            {VIEWPORT_KEYS.map((mode) => (
              <button
                key={mode}
                type="button"
                aria-pressed={viewport === mode}
                onClick={() => onViewportChange(mode)}
                className={`min-h-[36px] rounded-md px-3 font-medium transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  viewport === mode ? "bg-white text-black" : "text-zinc-300 hover:text-white"
                }`}
              >
                {mode === "desktop" ? "Desktop 100%" : mode === "tablet" ? "Tablet" : "Phone"}
              </button>
            ))}
          </div>

          <DropdownSelect
            label="Style"
            value={styleId}
            options={styleOptions}
            onChange={onStyleChange}
            align="right"
          />

          <a
            href={rawHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[40px] items-center rounded-lg border border-white/15 bg-white/5 px-3 text-xs font-medium text-zinc-200 transition-colors hover:bg-white/12 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            New Tab
          </a>

          <button
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[40px] items-center rounded-lg border border-white/20 bg-white px-3.5 text-xs font-semibold text-black transition-opacity hover:opacity-90 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Exit (Esc)
          </button>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ResponsiveIframeStage
          kind={kind}
          id={id}
          title={name}
          styleId={styleId}
          viewport={viewport}
          fullscreen
        />
      </div>
    </div>
  );
}
