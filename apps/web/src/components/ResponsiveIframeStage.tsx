"use client";

import { useEffect, useRef, useState } from "react";

export type ViewportMode = "desktop" | "tablet" | "mobile";

// Each preview renders at a real device size, then scales down to fit the column,
// so breakpoints and vh-based sections look exactly like on that device.
export const VIEWPORT_PRESETS: Record<
  ViewportMode,
  { label: string; shortLabel: string; width: number; height: number }
> = {
  desktop: { label: "Desktop (1440px)", shortLabel: "Desktop 1440 x 900", width: 1440, height: 900 },
  tablet: { label: "Tablet (768px)", shortLabel: "Tablet 768 x 1024", width: 768, height: 1024 },
  mobile: { label: "Mobile (390px)", shortLabel: "Phone 390 x 844", width: 390, height: 844 },
};

import type { ComponentKind } from "../../../../registry/schema";

interface ResponsiveIframeStageProps {
  kind: ComponentKind;
  id: string;
  title: string;
  styleId: string;
  viewport: ViewportMode;
  fullscreen?: boolean;
}

export function ResponsiveIframeStage({
  kind,
  id,
  title,
  styleId,
  viewport,
  fullscreen = false,
}: ResponsiveIframeStageProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [box, setBox] = useState({ width: 0, height: 0 });
  const preset = VIEWPORT_PRESETS[viewport];
  const src = `/preview/${kind}/${id}?style=${encodeURIComponent(styleId)}`;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const update = () => setBox({ width: el.clientWidth, height: el.clientHeight });
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (fullscreen && viewport === "desktop") {
    return (
      <iframe
        key={`${src}-full`}
        src={src}
        title={`${title} fullscreen desktop preview`}
        className="h-full w-full border-0 bg-[#08080a]"
      />
    );
  }

  const fitWidth = box.width > 0 ? box.width / preset.width : 1;
  const fitHeight = fullscreen && box.height > 0 ? box.height / preset.height : Infinity;
  const scale = Math.min(1, fitWidth, fitHeight);
  const percent = Math.round(scale * 100);

  return (
    <div
      className={
        fullscreen
          ? "flex h-full w-full flex-col items-center bg-[#08080a] px-4 py-4"
          : "flex w-full flex-col items-center rounded-2xl border border-white/10 bg-[#0a0a0c] p-3 sm:p-5"
      }
    >
      <div className="mb-3 flex items-center gap-2 rounded-full border border-white/10 bg-[#141418] px-3 py-1 font-mono text-[11px] text-zinc-300">
        <span>{preset.shortLabel}</span>
        <span className="text-zinc-400">{box.width > 0 ? `${percent}% · scroll inside` : "real media query"}</span>
      </div>

      <div ref={boxRef} className={fullscreen ? "min-h-0 w-full flex-1" : "w-full"}>
        <div
          className="relative mx-auto overflow-hidden rounded-xl border border-white/15 bg-[#0c0c0e] shadow-2xl"
          style={{ width: preset.width * scale, height: preset.height * scale }}
        >
          <iframe
            key={`${src}-${viewport}`}
            src={src}
            title={`${title} ${preset.label} preview`}
            className="absolute left-0 top-0 border-0"
            style={{
              width: preset.width,
              height: preset.height,
              transform: `scale(${scale})`,
              transformOrigin: "0 0",
            }}
          />
        </div>
      </div>
    </div>
  );
}
