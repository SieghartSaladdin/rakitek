"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import styles from "./styles.module.css";

export interface EditorialSpotlightBannerProps {
  category?: string;
  viewAllLabel?: string;
  viewAllHref?: string;
  title?: string;
  authorLine?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageSrc?: string;
  imageAlt?: string;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
  onViewAllClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function EditorialSpotlightBanner({
  category = "Journal",
  viewAllLabel = "View all",
  viewAllHref = "#stories",
  title = "Europe 2027: Reserve your seasonal cultural journey now!",
  authorLine = "Editorial Desk, 21/09/2026",
  ctaLabel = "Read the story",
  ctaHref = "#story",
  imageSrc = "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1920&q=80&auto=format&fit=crop",
  imageAlt = "Coastal cliffs overlooking the Aegean Sea",
  onCtaClick,
  onViewAllClick,
}: EditorialSpotlightBannerProps) {
  const bgRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const box = bgRef.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const img = box.querySelector<HTMLElement>("img");
    if (!img) return;
    const translateY = 200;

    const ctx = gsap.context(() => {
      gsap.set(img, { height: `calc(100% + ${translateY}px)`, top: 0 });
      gsap.to(img, {
        y: -translateY,
        ease: "none",
        scrollTrigger: {
          trigger: box,
          endTrigger: box,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, box);
    return () => ctx.revert();
  }, []);

  return (
    <article className={styles.article}>
      <div className={styles.category}>{category}</div>

      <div className={styles.infos}>
        <h5 className={styles.infosTitle}>{title}</h5>
        <div className={styles.infosAuthor}>{authorLine}</div>
        <RollingCtaButton
          href={ctaHref}
          label={ctaLabel}
          variant="secondary"
          className={styles.cta}
          onClick={(e) => {
            if (ctaHref.startsWith("#")) e.preventDefault();
            onCtaClick?.(e);
          }}
        />
      </div>

      <a
        href={viewAllHref}
        className={styles.viewAll}
        onClick={(e) => {
          if (viewAllHref.startsWith("#")) e.preventDefault();
          onViewAllClick?.(e);
        }}
      >
        {viewAllLabel}
      </a>

      <div ref={bgRef} className={styles.imgBox}>
        <img src={imageSrc} alt={imageAlt} decoding="async" loading="lazy" />
      </div>
    </article>
  );
}
