"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrchardFormatBadge } from "@registry/ui/orchard-format-badge/component";
import { OrchardProductSliderRail, type OrchardProductSlideItem } from "./product-slider";
import styles from "./styles.module.css";

export type { OrchardProductSlideItem };

export interface OrchardProductShowcaseProps {
  id?: string;
  title?: string;
  coverImage?: string;
  coverAlt?: string;
  description?: string[];
  weightsLabel?: string;
  weights?: string[];
  showWeights?: boolean;
  asideFirst?: boolean;
  mediaLayout?: "cover" | "inline-slider";
  slides?: OrchardProductSlideItem[];
  showSlider?: boolean;
  onSlideClick?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_COVER =
  "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=1400&q=80&auto=format&fit=crop";

export function OrchardProductShowcase({
  id,
  title = "Marmelade &\nJams",
  coverImage = DEFAULT_COVER,
  coverAlt = "Artisanal citrus preserves picnic spread",
  description = [
    "Artisanal marmalades and jams prepared the slow way: pulp, peel, and organic cane sugar cooked gently to lock in bright orchard color and fragrant aromatics.",
  ],
  weightsLabel = "Available weights",
  weights = ["240g", "1.2kg"],
  showWeights = true,
  asideFirst = false,
  mediaLayout = "cover",
  slides = [],
  showSlider = true,
  onSlideClick,
  ariaLabel,
  className,
}: OrchardProductShowcaseProps) {
  const coverRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const figure = coverRef.current;
    const media = mediaRef.current;
    if (
      mediaLayout !== "cover" ||
      !figure ||
      !media ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        media,
        { yPercent: -10 },
        {
          yPercent: 10,
          ease: "none",
          scrollTrigger: {
            trigger: figure,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true,
          },
        },
      );
    }, figure);
    return () => ctx.revert();
  }, [mediaLayout, coverImage]);

  const bodyCls = `${styles.grid} ${styles.body} ${asideFirst ? styles.bodyAsideFirst : ""}`;

  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel ?? title.replace(/\s+/g, " ").trim()}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={bodyCls}>
          <div className={styles.media}>
            {mediaLayout === "inline-slider" ? (
              <OrchardProductSliderRail
                items={slides}
                inline={true}
                onSlideClick={onSlideClick}
              />
            ) : coverImage ? (
              <figure ref={coverRef} className={styles.cover}>
                <div ref={mediaRef} className={styles.coverMedia}>
                  <img src={coverImage} alt={coverAlt} loading="lazy" decoding="async" />
                </div>
              </figure>
            ) : null}
          </div>

          <div className={styles.aside}>
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
                responsiveCenter={true}
              />
            ) : null}
          </div>
        </div>
      </div>

      {mediaLayout === "cover" && showSlider && slides.length ? (
        <OrchardProductSliderRail
          items={slides}
          inline={false}
          onSlideClick={onSlideClick}
        />
      ) : null}
    </section>
  );
}
