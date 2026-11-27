"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import { DEFAULT_ARCH_SVG, DEFAULT_BADGE_SVG, jarSvg, labelSvg } from "./default-art";
import { createJarMarquee } from "./jar-slider";
import styles from "./styles.module.css";

export interface OrchardJarHeroItem {
  id: string;
  href: string;
  alt: string;
  width?: number;
  height?: number;
  jarSrc: string;
  labelSrc: string;
}

export interface OrchardJarMarqueeHeroProps {
  id?: string;
  title?: string;
  subtitle?: string;
  cta?: { href: string; label: string; target?: string } | null;
  shapeImage?: string;
  badgeImage?: string;
  items?: OrchardJarHeroItem[];
  onItemClick?: (item: OrchardJarHeroItem, event: MouseEvent<HTMLAnchorElement>) => void;
  onCtaClick?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_ITEMS: OrchardJarHeroItem[] = [
  { id: "orange-0", href: "#orange", alt: "Blood Orange Marmalade", width: 630, height: 1013, jarSrc: jarSvg("darkorange"), labelSrc: labelSvg("BLOOD ORANGE", "Marmalade", "orangered", "sienna") },
  { id: "caponata-1", href: "#caponata", alt: "Orchard Caponata", width: 630, height: 1013, jarSrc: jarSvg("maroon"), labelSrc: labelSvg("ORCHARD", "Relish", "plum", "indigo") },
  { id: "pesto-2", href: "#pesto", alt: "Sun-Dried Tomato Pesto", width: 630, height: 1013, jarSrc: jarSvg("firebrick"), labelSrc: labelSvg("RED PESTO", "Herb Blend", "bisque", "crimson") },
  { id: "pistachio-3", href: "#pistachio", alt: "Roasted Pistachio Spread", width: 630, height: 1013, jarSrc: jarSvg("olivedrab"), labelSrc: labelSvg("PISTACHIO", "Velvet Cream", "darkseagreen", "darkolivegreen") },
  { id: "fig-4", href: "#fig", alt: "Wild Fig Jam", width: 630, height: 1013, jarSrc: jarSvg("saddlebrown"), labelSrc: labelSvg("WILD FIG", "Harvest Jam", "tan", "saddlebrown") },
  { id: "mandarin-5", href: "#mandarin", alt: "Tangerine Preserve", width: 630, height: 1013, jarSrc: jarSvg("chocolate"), labelSrc: labelSvg("TANGERINE", "Citrus Peel", "orange", "chocolate") },
  { id: "mulberry-6", href: "#mulberry", alt: "Black Mulberry Jam", width: 630, height: 1013, jarSrc: jarSvg("darkslateblue"), labelSrc: labelSvg("MULBERRY", "Orchard Jam", "thistle", "darkslateblue") },
  { id: "almond-7", href: "#almond", alt: "Toasted Almond Cream", width: 630, height: 1013, jarSrc: jarSvg("goldenrod"), labelSrc: labelSvg("ALMOND", "Stone Ground", "wheat", "peru") },
];

export function OrchardJarMarqueeHero({
  id,
  title = "Artisan orchard marmalades, spreads and preserves",
  subtitle = "Scroll to discover",
  cta = null,
  shapeImage = DEFAULT_ARCH_SVG,
  badgeImage = DEFAULT_BADGE_SVG,
  items = DEFAULT_ITEMS,
  onItemClick,
  onCtaClick,
  ariaLabel = "Featured jar showcase",
  className,
}: OrchardJarMarqueeHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const [ready, setReady] = useState(false);

  const itemsKey = items.map((i) => `${i.id}|${i.jarSrc}|${i.labelSrc}`).join("~");

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const handle = createJarMarquee(root, { labelDelayMs: 120 });
    setReady(!!handle);
    return () => {
      setReady(false);
      handle?.destroy();
    };
  }, [itemsKey]);

  return (
    <section
      id={id}
      ref={rootRef}
      className={className ? `${styles.hero} ${className}` : styles.hero}
      data-jar-slider-ready={ready ? "true" : "false"}
      aria-label={ariaLabel}
    >
      <h1 className={styles.srOnly}>{title}</h1>
      <div className={styles.shapeLayer} aria-hidden="true">
        <img
          className={styles.shapeImage}
          src={shapeImage}
          width={1407}
          height={601}
          alt=""
          decoding="async"
        />
        {badgeImage ? (
          <div className={styles.badge}>
            <img
              className={styles.badgeArtwork}
              src={badgeImage}
              width={1168}
              height={1168}
              alt=""
              decoding="async"
            />
          </div>
        ) : null}
      </div>

      {cta || subtitle ? (
        <div className={styles.overlay}>
          {cta ? (
            <a
              className={styles.cta}
              href={cta.href}
              target={cta.target || undefined}
              rel={cta.target === "_blank" ? "noreferrer" : undefined}
              onClick={onCtaClick ? (e) => onCtaClick(cta.href, e) : undefined}
            >
              {cta.label}
            </a>
          ) : null}
          {subtitle ? (
            <p className={`${styles.prompt} ${ready ? styles.promptReady : ""}`}>{subtitle}</p>
          ) : null}
        </div>
      ) : null}

      <div className={styles.wrapper} data-jar-slider-wrap="">
        <div className={styles.marquee}>
          <div className={styles.track} data-jar-slider-track="">
            {items.map((item) => (
              <a
                key={item.id}
                className={styles.item}
                href={item.href}
                aria-label={item.alt}
                data-jar-slider-item=""
                data-jar={item.jarSrc}
                data-label={item.labelSrc}
                onClick={onItemClick ? (e) => onItemClick(item, e) : undefined}
              >
                <img
                  src={item.jarSrc}
                  alt={item.alt}
                  width={item.width ?? 630}
                  height={item.height ?? 1013}
                  loading="eager"
                  decoding="async"
                />
                <canvas aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
