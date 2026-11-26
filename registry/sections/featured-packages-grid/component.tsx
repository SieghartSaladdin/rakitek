"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { VoyagePackageCard } from "@registry/ui/voyage-package-card/component";
import styles from "./styles.module.css";

export interface FeaturedPackageItem {
  id: string;
  title: string;
  href: string;
  imageSrc: string;
  imageAlt?: string;
  featuredBadge: string;
  typeTags: string[];
  specs: string[];
  price: number;
}

export interface FeaturedPackagesGridProps {
  heading?: string;
  packages?: FeaturedPackageItem[];
  pricePrefix?: string;
  formatPrice?: (price: number) => string;
  onCardClick?: (item: FeaturedPackageItem, event: MouseEvent<HTMLAnchorElement>) => void;
}

const DEFAULT_PACKAGES: FeaturedPackageItem[] = [
  {
    id: "kyoto-rail",
    title: "Ancient Kyoto & Coastal Japan Tours",
    href: "#kyoto",
    imageSrc: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=900&q=75&auto=format&fit=crop",
    featuredBadge: "Expert Led",
    typeTags: ["Group Expedition", "Cruise"],
    specs: ["16 days", "14 nights", "38 meals"],
    price: 9899,
  },
  {
    id: "rhone-riviera",
    title: "Rhone Valley & Riviera Escapade",
    href: "#rhone",
    imageSrc: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=900&q=75&auto=format&fit=crop",
    featuredBadge: "Favorite",
    typeTags: ["Group Tour", "Cruise"],
    specs: ["18 days", "16 nights", "31 meals"],
    price: 8599,
  },
  {
    id: "andalusia-coast",
    title: "Andalusia & Atlantic Coast",
    href: "#andalusia",
    imageSrc: "https://images.unsplash.com/photo-1558642084-fd07fae5282e?w=900&q=75&auto=format&fit=crop",
    featuredBadge: "Guaranteed",
    typeTags: ["Group Tour", "Cruise"],
    specs: ["18 days", "16 nights", "23 meals"],
    price: 5799,
  },
  {
    id: "sicily-calabria",
    title: "Sicily & Southern Cliffs",
    href: "#sicily",
    imageSrc: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=900&q=75&auto=format&fit=crop",
    featuredBadge: "Favorite",
    typeTags: ["Group Tour", "Stay"],
    specs: ["16 days", "14 nights", "31 meals"],
    price: 4999,
  },
  {
    id: "canadian-rockies",
    title: "Alpine Peaks & Pacific Coast",
    href: "#rockies",
    imageSrc: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=900&q=75&auto=format&fit=crop",
    featuredBadge: "Favorite",
    typeTags: ["Group Tour", "Circuit"],
    specs: ["13 days", "12 nights", "15 meals"],
    price: 6509,
  },
];

export function FeaturedPackagesGrid({
  heading = "Featured journeys",
  packages = DEFAULT_PACKAGES,
  pricePrefix = "Starting from:",
  formatPrice,
  onCardClick,
}: FeaturedPackagesGridProps) {
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  useEffect(() => {
    const el = headingRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const chars = el.querySelectorAll<HTMLElement>("[data-char]");
    if (!chars.length) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chars,
        { y: "145%" },
        {
          y: "0%",
          stagger: 0.025,
          duration: 0.8,
          ease: "circ.out",
          scrollTrigger: { trigger: el, start: "top 82%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, [heading]);

  return (
    <section className={styles.inner}>
      <h2 ref={headingRef} className={styles.title} aria-label={heading}>
        <span className={styles.line}>
          {heading.split(" ").map((word, wi) => (
            <span key={`${word}-${wi}`}>
              {wi > 0 ? " " : ""}
              {word.split("").map((ch, ci) => (
                <span key={`${ci}-${ch}`} className={styles.charWrap} aria-hidden="true">
                  <span className={styles.charInner} data-char>
                    {ch}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </span>
      </h2>

      <div className={styles.list}>
        {packages.map((item, idx) => (
          <VoyagePackageCard
            key={item.id}
            title={item.title}
            href={item.href}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt ?? item.title}
            featuredBadge={item.featuredBadge}
            typeTags={item.typeTags}
            specs={item.specs}
            price={item.price}
            pricePrefix={pricePrefix}
            formatPrice={formatPrice}
            parallaxY={idx % 2 === 0 ? 50 : -50}
            onClick={(e) => {
              if (item.href.startsWith("#")) e.preventDefault();
              onCardClick?.(item, e);
            }}
          />
        ))}
      </div>
    </section>
  );
}
