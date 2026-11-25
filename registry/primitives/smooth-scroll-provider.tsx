"use client";

import { useEffect, type ReactNode } from "react";

export interface SmoothScrollProviderProps {
  children: ReactNode;
  /** Disable smooth scroll (e.g. when respecting reduced motion or nested preview). */
  disabled?: boolean;
}

/**
 * Shared single-instance smooth scroll shell for Rakitek-assembled apps.
 * Dynamically loads Lenis only when installed in the host project so components
 * never create conflicting scroll instances.
 */
export function SmoothScrollProvider({
  children,
  disabled = false,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    if (disabled || typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let destroy: (() => void) | undefined;

    (async () => {
      try {
        const modName = "lenis";
        const mod = await import(/* webpackIgnore: true */ modName);
        const Lenis = mod.default;
        const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
        const raf = (time: number) => {
          lenis.raf(time);
          rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);
        destroy = () => {
          cancelAnimationFrame(rafId);
          lenis.destroy();
        };
      } catch {
        // Lenis is optional; native scroll remains active if not installed.
      }
    })();

    return () => {
      destroy?.();
    };
  }, [disabled]);

  return <>{children}</>;
}
