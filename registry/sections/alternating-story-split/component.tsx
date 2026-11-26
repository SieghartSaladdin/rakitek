"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import styles from "./styles.module.css";

export interface AlternatingStoryItem {
  id: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  imageSrc: string;
  imageAlt?: string;
  parallaxY?: number;
}

export interface AlternatingStorySplitProps {
  stories?: AlternatingStoryItem[];
  onCtaClick?: (item: AlternatingStoryItem, event: MouseEvent<HTMLElement>) => void;
}

const DEFAULT_STORIES: AlternatingStoryItem[] = [
  {
    id: "craft",
    title: "Quality since 1970",
    body: "Meridian Voyages continues to bring memorable experiences across the globe to thousands of travelers through a passionate team of regional specialists. Over 100 destinations are offered across seven distinct collections: North America, Ocean Cruises, European Circuits, Far Horizons, Dream Islands, Mediterranean Sun, and Alpine Tours. Whatever pace or horizon you seek, we have the right journey for you.",
    ctaLabel: "Learn more",
    ctaHref: "#about",
    imageSrc: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=1000&q=75&auto=format&fit=crop",
    imageAlt: "Whitewashed coastal village at sunset",
    parallaxY: 50,
  },
  {
    id: "gateway",
    title: "Your gateway to the world",
    body: "Step beyond ordinary sightseeing toward meaningful encounters across continents. Whether exploring alpine valleys, historic Mediterranean ports, or distant island lagoons, every departure balances thoughtful pacing with local insight.",
    ctaLabel: "Learn more",
    ctaHref: "#destinations",
    imageSrc: "https://images.unsplash.com/photo-1526392060635-9d6019884377?w=1000&q=75&auto=format&fit=crop",
    imageAlt: "Mountain pass along the Andes",
    parallaxY: -50,
  },
];

export function AlternatingStorySplit({
  stories = DEFAULT_STORIES,
  onCtaClick,
}: AlternatingStorySplitProps) {
  const rootRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const mediaBoxes = root.querySelectorAll<HTMLElement>("[data-story-media]");
      mediaBoxes.forEach((box) => {
        const yVal = Number(box.dataset.parallaxY ?? 50);
        const img = box.querySelector<HTMLElement>("img");
        if (!img || !yVal) return;
        gsap.set(img, {
          height: `calc(100% + ${Math.abs(yVal)}px)`,
          ...(yVal < 0 ? { top: yVal } : { top: 0 }),
        });
        gsap.to(img, {
          y: -yVal,
          ease: "none",
          scrollTrigger: {
            trigger: box,
            endTrigger: box,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, [stories]);

  return (
    <section ref={rootRef} className={styles.mediaAndText}>
      <span className={styles.borderTop} aria-hidden="true" />
      {stories.map((story) => (
        <div key={story.id} className={styles.row}>
          <div
            className={styles.media}
            data-story-media
            data-parallax-y={story.parallaxY ?? 50}
          >
            <img
              src={story.imageSrc}
              alt={story.imageAlt ?? story.title}
              decoding="async"
              loading="lazy"
            />
          </div>

          <div className={styles.txt}>
            <h3 className={styles.txtTitle}>
              <span className={styles.line}>{story.title}</span>
            </h3>
            <div className={styles.txtBody}>
              <p>{story.body}</p>
            </div>
            <div className={styles.ctas}>
              <RollingCtaButton
                href={story.ctaHref}
                label={story.ctaLabel}
                variant="primary"
                minWide
                onClick={(e) => {
                  if (story.ctaHref.startsWith("#")) e.preventDefault();
                  onCtaClick?.(story, e);
                }}
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
