"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";

export interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Disable smooth scroll (e.g. when respecting reduced motion or nested preview). */
  disabled?: boolean;
}

/**
 * Shared single-instance smooth scroll shell for Rakitek-assembled apps, so
 * components never create conflicting scroll instances.
 * Lenis is a static import on purpose: a computed `import(name)` is skipped by
 * bundlers (Vite, Next) and then fails in the browser, silently leaving native scroll.
 */
export function SmoothScrollProvider({
  children,
  disabled = false,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    if (disabled || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [disabled]);

  return <>{children}</>;
}
