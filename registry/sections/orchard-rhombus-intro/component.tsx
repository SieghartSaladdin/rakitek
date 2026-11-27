"use client";

import type { CSSProperties } from "react";
import styles from "./styles.module.css";

export interface OrchardRhombusIntroProps {
  id?: string;
  paragraphs?: string[];
  afterParagraphs?: string[];
  showMarkers?: boolean;
  paddingTop?: string;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_PARAGRAPHS = [
  "We select the finest harvests from terraced coastal groves to craft a pantry of small-batch preserves and spreads, pairing bright orchard fruit with honest pantry ingredients.",
];

export function OrchardRhombusIntro({
  id,
  paragraphs = DEFAULT_PARAGRAPHS,
  afterParagraphs = [],
  showMarkers = true,
  paddingTop,
  ariaLabel = "Editorial introduction",
  className,
}: OrchardRhombusIntroProps) {
  const validParagraphs = paragraphs.filter(Boolean);
  const validAfter = afterParagraphs.filter(Boolean);
  if (!validParagraphs.length && !validAfter.length) return null;

  const style = paddingTop
    ? ({ "--page-intro-pt": paddingTop } as CSSProperties)
    : undefined;

  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      style={style}
      aria-label={ariaLabel}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.inner}>
            {showMarkers ? <span className={styles.rhombus} aria-hidden="true" /> : null}
            {validParagraphs.length ? (
              <div className={styles.text}>
                {validParagraphs.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            {validAfter.length ? (
              <div className={styles.after}>
                {validAfter.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            ) : null}
            {showMarkers ? <span className={styles.rhombus} aria-hidden="true" /> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
