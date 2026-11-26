"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TripSearchBar, type TripSearchStep } from "@registry/ui/trip-search-bar/component";
import styles from "./styles.module.css";

export interface VideoExpandHeroProps {
  title?: string;
  backgroundImage?: string;
  backgroundAlt?: string;
  youtubeId?: string;
  query?: string;
  dateLabel?: string;
  hasCustomDate?: boolean;
  destinationLabel?: string;
  submitHref?: string;
  onSelectSearchStep?: (step: Exclude<TripSearchStep, null>) => void;
  onSearchSubmit?: () => void;
}

export function VideoExpandHero({
  title = "Curated journeys across every horizon",
  backgroundImage = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80&auto=format&fit=crop",
  backgroundAlt = "Ocean horizon at golden hour",
  youtubeId,
  query = "",
  dateLabel = "Preferred dates",
  hasCustomDate = false,
  destinationLabel = "All destinations",
  submitHref = "#search",
  onSelectSearchStep,
  onSearchSubmit,
}: VideoExpandHeroProps) {
  const bgRef = useRef<HTMLDivElement | null>(null);
  const mediaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const triggerEl = bgRef.current;
    const mediaEl = mediaRef.current;
    if (!triggerEl || !mediaEl) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const translateY = -100;
    const ctx = gsap.context(() => {
      gsap.set(mediaEl, {
        height: `calc(100% + ${Math.abs(translateY)}px)`,
        top: translateY,
      });
      gsap.to(mediaEl, {
        y: -translateY,
        ease: "none",
        scrollTrigger: {
          trigger: triggerEl,
          endTrigger: triggerEl,
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, triggerEl);

    return () => ctx.revert();
  }, []);

  return (
    <header className={styles.hero}>
      <div className={styles.headerInner}>
        <h1 className={styles.title}>{title}</h1>
      </div>

      <TripSearchBar
        isClicky
        className={styles.heroSearchBar}
        query={query}
        dateLabel={dateLabel}
        hasCustomDate={hasCustomDate}
        destinationLabel={destinationLabel}
        submitHref={submitHref}
        onSelectStep={(step) => onSelectSearchStep?.(step)}
        onSubmitClick={(e) => {
          if (submitHref.startsWith("#")) e.preventDefault();
          onSearchSubmit?.();
        }}
      />

      <div ref={bgRef} className={styles.headerBg}>
        <div
          ref={mediaRef}
          className={styles.bgMedia}
          style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
        >
          {youtubeId ? (
            <iframe
              className={styles.bgIframe}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&mute=1&loop=1&playlist=${youtubeId}&controls=0&playsinline=1&rel=0`}
              title={title}
              allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
            />
          ) : backgroundImage ? (
            <img src={backgroundImage} alt={backgroundAlt} />
          ) : null}
        </div>
      </div>
    </header>
  );
}
