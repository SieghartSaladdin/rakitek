"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { PREVIEW_LOADERS } from "@/generated/preview-map";

import type { ComponentKind } from "../../../../registry/schema";

interface StandalonePreviewProps {
  itemKey: string;
  kind: ComponentKind;
  defaultStyleId: string;
}

export function StandalonePreview({
  itemKey,
  kind,
  defaultStyleId,
}: StandalonePreviewProps) {
  const searchParams = useSearchParams();
  const styleId = searchParams.get("style") ?? defaultStyleId;
  const isThumb = searchParams.get("thumb") === "1";
  const measureRef = useRef<HTMLDivElement>(null);
  const [PreviewComp, setPreviewComp] = useState<ComponentType | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isThumb || typeof document === "undefined") return;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
    };
  }, [isThumb]);

  useEffect(() => {
    let mounted = true;
    const loader = PREVIEW_LOADERS[itemKey];
    if (!loader) {
      setError(`No preview registered for "${itemKey}"`);
      return;
    }

    loader()
      .then((mod) => {
        if (mounted) {
          setPreviewComp(() => mod.default);
          setError(null);
        }
      })
      .catch((err) => {
        if (mounted) setError(err instanceof Error ? err.message : "Failed to load preview");
      });

    return () => {
      mounted = false;
    };
  }, [itemKey]);

  useEffect(() => {
    const el = measureRef.current;
    if (!el || typeof window === "undefined" || window.parent === window) return;

    const notifyHeight = () => {
      const extra = kind === "ui" ? 64 : 0;
      const height = Math.max(360, Math.ceil(el.getBoundingClientRect().height) + extra);
      window.parent.postMessage({ type: "rk-preview-height", itemKey, height }, "*");
    };

    notifyHeight();
    const observer = new ResizeObserver(notifyHeight);
    observer.observe(el);
    window.addEventListener("resize", notifyHeight);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", notifyHeight);
    };
  }, [itemKey, kind, PreviewComp, styleId]);

  const isFullWidth = kind !== "ui";

  return (
    <div
      data-rk-style={styleId}
      className={
        isThumb
          ? isFullWidth
            ? "h-screen w-full overflow-hidden"
            : "flex h-screen w-full items-center justify-center overflow-hidden"
          : isFullWidth
            ? "min-h-screen w-full"
            : "flex min-h-screen w-full items-center justify-center p-6 sm:p-10"
      }
      style={{
        backgroundColor: "var(--rk-bg)",
        color: "var(--rk-fg)",
        fontFamily: "var(--rk-font-body)",
      }}
    >
      <div
        ref={measureRef}
        data-rk-preview-stage={kind}
        className={isFullWidth ? "w-full" : "w-full max-w-5xl"}
      >
        {error ? (
          <div className="p-6 text-xs text-red-500">{error}</div>
        ) : PreviewComp ? (
          <PreviewComp />
        ) : (
          <div className="flex min-h-[360px] items-center justify-center text-xs opacity-60">
            Loading preview...
          </div>
        )}
      </div>
    </div>
  );
}
