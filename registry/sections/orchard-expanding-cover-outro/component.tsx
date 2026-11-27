"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface OrchardExpandingCoverOutroProps {
  id?: string;
  imageSrc?: string;
  imageAlt?: string;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1600&q=80&auto=format&fit=crop";

export function OrchardExpandingCoverOutro({
  id,
  imageSrc = DEFAULT_IMAGE,
  imageAlt = "Warm artisanal orchard pantry showcase",
  ariaLabel = "Closing visual showcase",
  className,
}: OrchardExpandingCoverOutroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const root = rootRef.current;
    const cover = coverRef.current;
    const media = mediaRef.current;
    if (!root || !cover) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(root);

    let ctx: gsap.Context | null = null;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.registerPlugin(ScrollTrigger);
      ctx = gsap.context(() => {
        gsap.fromTo(
          cover,
          { "--cover-inset": 1 },
          {
            "--cover-inset": 0,
            ease: "none",
            scrollTrigger: {
              trigger: root,
              start: "top bottom",
              end: "center center",
              scrub: true,
            },
          },
        );
        if (media) {
          gsap.fromTo(
            media,
            { yPercent: -10 },
            {
              yPercent: 10,
              ease: "none",
              scrollTrigger: {
                trigger: root,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            },
          );
        }
      }, root);
    }

    return () => {
      io.disconnect();
      ctx?.revert();
    };
  }, []);

  if (!imageSrc) return null;

  return (
    <section
      id={id}
      ref={rootRef}
      className={className ? `${styles.outro} ${className}` : styles.outro}
      aria-label={ariaLabel}
    >
      <div
        ref={coverRef}
        className={`${styles.cover} ${revealed ? styles.isRevealed : ""}`}
        data-header-light=""
      >
        <div ref={mediaRef} className={styles.media}>
          <img
            className={styles.image}
            src={imageSrc}
            alt={imageAlt}
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
}
