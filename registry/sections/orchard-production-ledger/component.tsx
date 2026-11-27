"use client";

import { useEffect, useRef } from "react";
import styles from "./styles.module.css";

export interface OrchardLedgerColumn {
  key: string;
  label: string;
}

export interface OrchardProductionLedgerProps {
  id?: string;
  title?: string;
  /** Shrinks the heading font until it fits on one line of its container. */
  singleLineTitle?: boolean;
  /** Paragraphs under the heading; "\n" inside a paragraph is kept as a line break. */
  description?: string[];
  subtitle?: string;
  columns?: OrchardLedgerColumn[];
  rows?: Array<Record<string, string>>;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_COLUMNS: OrchardLedgerColumn[] = [
  { key: "product", label: "Product" },
  { key: "availability", label: "Availability" },
];

const DEFAULT_ROWS: Array<Record<string, string>> = [
  { product: "Navel Oranges for Fresh Consumption", availability: "November 20 to January 15" },
  { product: "Blood Oranges for Juicing", availability: "January 15 to February 28" },
  { product: "Sweet Lemons for Fresh Consumption", availability: "November 15 to April 15" },
];

export function OrchardProductionLedger({
  id,
  title = "Citrus Fruits",
  singleLineTitle = false,
  description = [
    "Fragrant and juicy, our citrus fruits are the heart of the orchard. Each fruit has its own season, its own character and its own story.",
  ],
  subtitle = "Crates / Box of 10kg",
  columns = DEFAULT_COLUMNS,
  rows = DEFAULT_ROWS,
  ariaLabel,
  className,
}: OrchardProductionLedgerProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!singleLineTitle || !el) return;
    let cancelled = false;
    let raf = 0;
    let ro: ResizeObserver | null = null;
    const fit = () => {
      el.style.fontSize = "";
      const available = el.clientWidth;
      if (!available) return;
      const range = document.createRange();
      range.selectNodeContents(el);
      const text = range.getBoundingClientRect().width;
      const max = available * 0.99;
      if (text > max) {
        const size = Number.parseFloat(getComputedStyle(el).fontSize);
        el.style.fontSize = `${((size * max) / text).toFixed(2)}px`;
      }
    };
    (async () => {
      await document.fonts?.ready;
      if (cancelled) return;
      fit();
      const parent = el.parentElement;
      if (parent) {
        ro = new ResizeObserver(() => {
          cancelAnimationFrame(raf);
          raf = requestAnimationFrame(fit);
        });
        ro.observe(parent);
      }
    })();
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      ro?.disconnect();
      el.style.fontSize = "";
    };
  }, [singleLineTitle, title]);

  if (!(title || subtitle || description.length || rows.length)) return null;
  const tableCls = `${styles.table} ${columns.length === 3 ? styles.cols3 : styles.cols2}`;

  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel ?? title}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.inner}>
            {title ? (
              <h2 ref={titleRef} className={singleLineTitle ? `${styles.title} ${styles.titleSingle}` : styles.title}>
                {title}
              </h2>
            ) : null}
            {description.length ? (
              <div className={styles.text}>
                {description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            {subtitle ? <h3 className={styles.subtitle}>{subtitle}</h3> : null}
            {rows.length ? (
              <div className={tableCls} role="table" aria-label={title}>
                <div className={`${styles.row} ${styles.rowHead}`} role="row">
                  {columns.map((col) => (
                    <span key={col.key} role="columnheader" className={styles.cell}>
                      {col.label}
                    </span>
                  ))}
                </div>
                {rows.map((row, i) => (
                  <div key={i} className={styles.row} role="row">
                    {columns.map((col) => (
                      <span key={col.key} role="cell" className={styles.cell}>
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
