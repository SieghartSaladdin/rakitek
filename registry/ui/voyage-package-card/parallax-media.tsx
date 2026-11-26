"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

interface ParallaxMediaProps {
  translateY?: number;
  className?: string;
  children: ReactNode;
}

export function ParallaxMedia({
  translateY = 50,
  className = "",
  children,
}: ParallaxMediaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el || !translateY) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const media = el.querySelector<HTMLElement>("picture, img, video");
    if (!media) return;

    const ctx = gsap.context(() => {
      gsap.set(media, {
        height: `calc(100% + ${Math.abs(translateY)}px)`,
        ...(translateY < 0 ? { top: translateY } : { top: 0 }),
      });

      gsap.to(media, {
        y: -translateY,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          endTrigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [translateY]);

  return (
    <div ref={containerRef} className={`${styles.parallax} ${className}`.trim()}>
      {children}
    </div>
  );
}
