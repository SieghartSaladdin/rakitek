"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface LivePreviewFrameProps {
  itemKey: string;
  styleId?: string;
  compact?: boolean;
  href?: string;
  title?: string;
}

import type { ComponentKind } from "../../../../registry/schema";

const THUMB_VIEWPORTS: Record<ComponentKind, { width: number; height: number }> = {
  ui: { width: 1280, height: 800 },
  section: { width: 1440, height: 900 },
  template: { width: 1440, height: 900 },
  page: { width: 1440, height: 900 },
};

export function LivePreviewFrame({
  itemKey,
  styleId = "editorial-roastery",
  href,
  title,
}: LivePreviewFrameProps) {
  const [kindRaw, id = ""] = itemKey.split("/");
  const kind: ComponentKind =
    kindRaw === "section" || kindRaw === "template" || kindRaw === "page" ? kindRaw : "ui";
  const viewport = THUMB_VIEWPORTS[kind];
  const src = `/preview/${kind}/${id}?style=${encodeURIComponent(styleId)}&thumb=1`;

  const containerRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(0);
  const [shouldMount, setShouldMount] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateWidth = () => {
      const next = el.clientWidth;
      if (next > 0) setBoxWidth(next);
    };
    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(el);

    if (typeof IntersectionObserver === "undefined") {
      setShouldMount(true);
      return () => resizeObserver.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldMount(true);
          io.disconnect();
        }
      },
      { rootMargin: "320px 0px" },
    );
    io.observe(el);

    return () => {
      resizeObserver.disconnect();
      io.disconnect();
    };
  }, []);

  const scale = boxWidth > 0 ? boxWidth / viewport.width : 0;
  const isLoaded = loadedSrc === src;

  const stage = (
    <div
      ref={containerRef}
      data-rk-style={styleId}
      className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-white/10 bg-[#0c0c0e] transition-colors duration-200 group-hover/thumb:border-white/25"
    >
      {!isLoaded ? (
        <div
          className="absolute inset-0 flex items-center justify-center bg-[#101014]"
          aria-hidden="true"
        >
          <span className="font-mono text-[11px] text-zinc-400">Loading preview...</span>
        </div>
      ) : null}

      {shouldMount && scale > 0 ? (
        <iframe
          key={src}
          src={src}
          title={title ? `${title} preview` : `${itemKey} preview`}
          loading="lazy"
          tabIndex={-1}
          aria-hidden="true"
          onLoad={() => setLoadedSrc(src)}
          className={`pointer-events-none absolute left-0 top-0 border-0 transition-opacity duration-300 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          style={{
            width: viewport.width,
            height: viewport.height,
            transform: `scale(${scale})`,
            transformOrigin: "0 0",
          }}
        />
      ) : null}

      {href ? (
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-end p-2.5 opacity-0 transition-opacity duration-200 group-hover/thumb:opacity-100"
          aria-hidden="true"
        >
          <span className="rounded-full border border-white/20 bg-black/75 px-3 py-1 font-mono text-[11px] text-white backdrop-blur-md">
            Inspect
          </span>
        </div>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={title ? `Inspect ${title}` : `Inspect ${itemKey}`}
        className="group/thumb block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
      >
        {stage}
      </Link>
    );
  }

  return stage;
}
