"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface OrchardSpecColumn {
  key: string;
  label: string;
  align?: "start" | "end";
}

export interface OrchardSpecLedgerSectionProps {
  id?: string;
  title?: string;
  description?: string[];
  coverImage?: string;
  coverAlt?: string;
  columns?: OrchardSpecColumn[];
  rows?: Array<Record<string, string>>;
  showCover?: boolean;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_COLUMNS: OrchardSpecColumn[] = [
  { key: "product", label: "Product", align: "start" },
  { key: "shelfLife", label: "Shelf life", align: "start" },
  { key: "weight", label: "Weight", align: "end" },
];

const DEFAULT_ROWS: Array<Record<string, string>> = [
  { product: "Orange Marmalade", shelfLife: "36 months", weight: "30g" },
  { product: "Mandarin Marmalade", shelfLife: "36 months", weight: "30g" },
  { product: "Extra Strawberry Jam", shelfLife: "36 months", weight: "30g" },
  { product: "Wild Fig Preserve", shelfLife: "36 months", weight: "30g" },
  { product: "Pistachio Spread", shelfLife: "18 months", weight: "30g" },
];

export function OrchardSpecLedgerSection({
  id,
  title = "Mono Pack",
  description = [
    "Single-serve artisanal preserves crafted for hospitality breakfast service, pairing clean glass packaging with bright orchard flavor.",
  ],
  coverImage = "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1400&q=80&auto=format&fit=crop",
  coverAlt = "Single-serve orchard preserve assortment",
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  showCover = true,
  ariaLabel,
  className,
}: OrchardSpecLedgerSectionProps) {
  const figureRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const figure = figureRef.current;
    const media = mediaRef.current;
    if (
      !showCover ||
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
  }, [showCover, coverImage]);

  const tableCls = `${styles.table} ${columns.length === 2 ? styles.cols2 : ""}`;

  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel ?? title}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.inner}>
            {title ? <h2 className={styles.title}>{title}</h2> : null}
            {description.length ? (
              <div className={styles.text}>
                {description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            {showCover && coverImage ? (
              <figure ref={figureRef} className={styles.cover}>
                <div ref={mediaRef} className={styles.coverMedia}>
                  <img src={coverImage} alt={coverAlt} loading="lazy" decoding="async" />
                </div>
              </figure>
            ) : null}
            {rows.length && columns.length ? (
              <div className={tableCls} role="table" aria-label={title}>
                <div className={`${styles.row} ${styles.rowHead}`} role="row">
                  {columns.map((col) => (
                    <span
                      key={col.key}
                      role="columnheader"
                      className={`${styles.cell} ${col.align === "end" ? styles.cellEnd : ""}`}
                    >
                      {col.label}
                    </span>
                  ))}
                </div>
                {rows.map((row, idx) => (
                  <div key={idx} className={styles.row} role="row">
                    {columns.map((col) => (
                      <span
                        key={col.key}
                        role="cell"
                        className={`${styles.cell} ${col.align === "end" ? styles.cellEnd : ""}`}
                      >
                        {row[col.key] ?? ""}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
