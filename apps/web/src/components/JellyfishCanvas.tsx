"use client";

import { useEffect, useRef } from "react";
import { createJellyfishScene } from "@/lib/jellyfish-engine";

export function JellyfishCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const rect0 = canvas.getBoundingClientRect();
    const scene = createJellyfishScene(Math.max(1, rect0.width), Math.max(1, rect0.height));
    let rafId = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      scene.setSize(w, h);
    };

    const onMove = (e: PointerEvent) => scene.setPointer(e.clientX, e.clientY);
    const onDown = (e: PointerEvent) => scene.pulseAt(e.clientX, e.clientY);
    const onLeave = () => scene.clearPointer();

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("mouseleave", onLeave);

    const tick = (now: number) => {
      scene.render(ctx, now, reducedMotion);
      if (!reducedMotion) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="h-full w-full cursor-crosshair"
      style={{ imageRendering: "pixelated" }}
    />
  );
}
