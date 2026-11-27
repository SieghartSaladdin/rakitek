"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrchardFormatBadge } from "@registry/ui/orchard-format-badge/component";
import {
  OrchardJarSlideCard,
  type OrchardJarSlideCardProps,
} from "@registry/ui/orchard-jar-slide-card/component";
import styles from "./styles.module.css";

export type OrchardPosterSlideItem = Omit<
  OrchardJarSlideCardProps,
  "dragging" | "onCardClick" | "onHoverChange" | "className"
>;

export interface OrchardParallaxPosterBandProps {
  id?: string;
  title?: string;
  backgroundImage?: string;
  backgroundAlt?: string;
  foregroundImage?: string;
  foregroundAlt?: string;
  description?: string[];
  weightsLabel?: string;
  weights?: string[];
  showWeights?: boolean;
  slides?: OrchardPosterSlideItem[];
  showSlider?: boolean;
  onSlideClick?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
  className?: string;
}

const TITLE_FIT = 0.88;
const DEFAULT_BG =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&q=80&auto=format&fit=crop";

export function OrchardParallaxPosterBand({
  id,
  title = "Savoury",
  backgroundImage = DEFAULT_BG,
  backgroundAlt = "Rustic orchard harvest ingredients",
  foregroundImage,
  foregroundAlt = "Artisanal jar closeup",
  description = [
    "Here, bright coastal citrus meets the savory depth of garden herbs and roasted olives, crafted for warm bread, grilled plates, and shared tables.",
  ],
  weightsLabel = "Available weights",
  weights = ["190g", "3kg"],
  showWeights = true,
  slides = [],
  showSlider = true,
  onSlideClick,
  ariaLabel,
  className,
}: OrchardParallaxPosterBandProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const front = frontRef.current;
    if (!box || !front || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        front,
        { yPercent: 3 },
        {
          yPercent: -14,
          ease: "none",
          scrollTrigger: {
            trigger: box,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, box);
    return () => ctx.revert();
  }, [foregroundImage]);

  useEffect(() => {
    const heading = titleRef.current;
    const box = boxRef.current;
    if (!heading || !box) return;
    const fit = () => {
      heading.style.fontSize = "";
      const boxW = box.clientWidth;
      if (!boxW) return;
      const range = document.createRange();
      range.selectNodeContents(heading);
      const textW = range.getBoundingClientRect().width;
      const max = boxW * TITLE_FIT;
      if (textW > max) {
        const size = Number.parseFloat(getComputedStyle(heading).fontSize);
        heading.style.fontSize = `${((size * max) / textW).toFixed(2)}px`;
      }
    };
    let cancelled = false;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    (async () => {
      await document.fonts?.ready;
      if (cancelled) return;
      fit();
      ro = new ResizeObserver(() => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(fit);
      });
      ro.observe(box);
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, [title]);

  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel ?? title}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.inner}>
            <div ref={boxRef} className={styles.box} data-header-light="">
              {backgroundImage ? (
                <img
                  className={styles.bg}
                  src={backgroundImage}
                  alt={backgroundAlt}
                  loading="lazy"
                  decoding="async"
                />
              ) : null}
              {title ? (
                <h2 ref={titleRef} className={styles.title}>
                  {title}
                </h2>
              ) : null}
              {foregroundImage ? (
                <div ref={frontRef} className={styles.front}>
                  <img
                    className={styles.frontImg}
                    src={foregroundImage}
                    alt={foregroundAlt}
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              ) : null}
            </div>

            {description.length || (showWeights && weights.length) ? (
              <div className={styles.details}>
                {description.length ? (
                  <div className={styles.text}>
                    {description.map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                ) : null}
                {showWeights && weights.length ? (
                  <OrchardFormatBadge
                    label={weightsLabel}
                    items={weights}
                    align="center"
                  />
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {showSlider && slides.length ? (
        <div className={styles.rail}>
          {slides.map((item) => (
            <OrchardJarSlideCard
              key={item.id}
              {...item}
              onCardClick={onSlideClick}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
}
