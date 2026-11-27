"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Shrinks the element's font-size (never below minFontSize) until its content
 * fits in `maxLines` lines. Re-runs on container resize and when fonts finish loading.
 */
export function useFitText<T extends HTMLElement>(maxLines: number, minFontSize: number, deps: unknown) {
  const ref = useRef<T | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let lastWidth = 0;

    const fit = () => {
      window.cancelAnimationFrame(rafId);
      rafId = window.requestAnimationFrame(() => {
        const width = el.clientWidth;
        if (!width || width === lastWidth) return;
        lastWidth = width;
        el.style.removeProperty("font-size");

        const style = window.getComputedStyle(el);
        const baseSize = Number.parseFloat(style.fontSize);
        if (!baseSize) return;
        const lineRatio = (Number.parseFloat(style.lineHeight) || baseSize * 1.25) / baseSize;

        const fits = () => {
          if (maxLines === 1) return el.scrollWidth <= width;
          const lineHeight = el.style.fontSize
            ? Number.parseFloat(window.getComputedStyle(el).lineHeight)
            : baseSize * lineRatio;
          return Math.round(el.scrollHeight / lineHeight) <= maxLines;
        };

        if (fits()) return;

        let low = minFontSize;
        let high = baseSize;
        let best = minFontSize;
        while (high - low > 0.25) {
          const mid = (low + high) / 2;
          el.style.fontSize = `${mid}px`;
          if (fits()) {
            best = mid;
            low = mid;
          } else {
            high = mid;
          }
        }
        el.style.fontSize = `${best}px`;
      });
    };

    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(el.parentElement || el);
    document.fonts?.ready.then(() => {
      lastWidth = 0;
      fit();
    });

    return () => {
      window.cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [deps, maxLines, minFontSize]);

  return ref;
}
