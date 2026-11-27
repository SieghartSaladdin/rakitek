"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface OrchardEditorialPageHeroProps {
  id?: string;
  title?: string;
  coverImage?: string;
  coverAlt?: string;
  coverTitle?: string;
  coverDark?: boolean;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop";

export function OrchardEditorialPageHero({
  id,
  title = "Pantry",
  coverImage = DEFAULT_COVER,
  coverAlt = "Artisanal orchard table spread",
  coverTitle = "Our land, one jar at a time.",
  coverDark = true,
  ariaLabel = "Page hero",
  className,
}: OrchardEditorialPageHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const coverRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  const coverLines = (coverTitle ?? "")
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  useEffect(() => {
    const r = requestAnimationFrame(() => setRevealed(true));
    return () => cancelAnimationFrame(r);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    const cover = coverRef.current;
    const media = mediaRef.current;
    if (!root || !cover || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cover,
        { "--cover-inset": 1 },
        {
          "--cover-inset": 0,
          ease: "none",
          scrollTrigger: {
            trigger: root,
            start: "top top",
            end: "+=100",
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
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id={id}
      ref={rootRef}
      className={className ? `${styles.hero} ${className}` : styles.hero}
      aria-label={ariaLabel}
    >
      <div className={styles.head}>
        <div className={styles.grid}>
          <h1 className={styles.title}>{title}</h1>
        </div>
      </div>

      <div
        ref={coverRef}
        className={`${styles.cover} ${revealed ? styles.isRevealed : ""}`}
        data-header-light={coverDark ? "" : undefined}
      >
        <div ref={mediaRef} className={styles.coverMedia}>
          {coverImage ? (
            <img
              className={styles.coverImage}
              src={coverImage}
              alt={coverAlt}
              loading="eager"
              decoding="async"
            />
          ) : null}
        </div>
        {coverDark ? <div className={styles.coverOverlay} aria-hidden="true" /> : null}
        {coverLines.length ? (
          <div className={styles.coverContent}>
            <div className={styles.grid}>
              <h2 className={styles.coverTitle}>
                {coverLines.map((line, i) => (
                  <Fragment key={`${i}-${line}`}>
                    {i > 0 ? <br /> : null}
                    {line}
                  </Fragment>
                ))}
              </h2>
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
