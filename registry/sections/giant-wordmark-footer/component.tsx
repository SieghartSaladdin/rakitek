"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export interface WordmarkGlyph {
  /** SVG path data, drawn with currentColor. */
  d: string;
  viewBox: string;
  /** Flex basis inside the row, e.g. "0 0 25.35%". */
  flex: string;
  marginLeft?: string;
  /** Pins the glyph to the top of the row (a trademark mark) and lets it rise further. */
  raised?: boolean;
  /** Draw the path with the even-odd rule so inner shapes cut holes. Default true. */
  evenOdd?: boolean;
}

export interface GiantWordmarkFooterProps {
  id?: string;
  ariaLabel?: string;
  glyphs?: WordmarkGlyph[];
  /** Delay before the first glyph rises, in ms. Default 100. */
  startDelayMs?: number;
  /** Extra delay per glyph, in ms. Default 100. */
  glyphStepMs?: number;
}

const DEFAULT_GLYPHS: WordmarkGlyph[] = [
  {
    flex: "0 0 25.35%",
    viewBox: "0 0 360 388",
    d: "M180 44a150 150 0 1 0 0.01 0ZM180 106a88 88 0 1 1-0.01 0Z",
  },
  {
    flex: "0 0 20.99%",
    marginLeft: "2.11%",
    viewBox: "0 0 298 388",
    d: "M52 50H246V337H52ZM110 108V279H188V108Z",
  },
  {
    flex: "0 0 23.66%",
    marginLeft: "-1.9%",
    viewBox: "0 0 336 388",
    d: "M0 6.3H336L168 380.8Z",
  },
  {
    flex: "0 0 21.06%",
    marginLeft: "-0.42%",
    viewBox: "0 0 300 388",
    d: "M0 387.3V200a150 150 0 0 1 300 0V387.3Z",
  },
  {
    flex: "0 0 8.17%",
    marginLeft: "0.99%",
    viewBox: "0 0 116 123",
    d: "M58 6a58 58 0 1 0 0.01 0ZM58 16a48 48 0 1 1-0.01 0Z",
    raised: true,
  },
];

export function GiantWordmarkFooter({
  id,
  ariaLabel = "Studio signature",
  glyphs = DEFAULT_GLYPHS,
  startDelayMs = 100,
  glyphStepMs = 100,
}: GiantWordmarkFooterProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setRevealed(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id={id} ref={ref} className={styles.root} aria-label={ariaLabel}>
      <div className={styles.row}>
        {glyphs.map((glyph, i) => (
          <div
            key={i}
            className={`${styles.glyph} ${glyph.raised ? styles.raised : ""}`}
            style={{ flex: glyph.flex, marginLeft: glyph.marginLeft }}
          >
            <svg
              className={`${revealed ? styles.up : ""} ${glyph.raised ? styles.farDown : ""}`}
              viewBox={glyph.viewBox}
              fill="none"
              aria-hidden="true"
              style={{ transitionDelay: `${startDelayMs + i * glyphStepMs}ms` }}
            >
              <path d={glyph.d} fill="currentColor" fillRule={glyph.evenOdd === false ? "nonzero" : "evenodd"} />
            </svg>
          </div>
        ))}
      </div>
    </section>
  );
}
