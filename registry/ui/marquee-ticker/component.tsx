"use client";

import type { CSSProperties } from "react";
import styles from "./styles.module.css";

export interface MarqueeTickerProps {
  items?: string[];
  separator?: string;
  mode?: "arrows" | "scroll";
  arrowCount?: number;
  speedSeconds?: number;
  inverted?: boolean;
  className?: string;
  ariaLabel?: string;
}

const DEFAULT_ITEMS = ["new", "Fresh off the tree", "New"];

function ArrowUpIcon({ className }: { className?: string }) {
  return (
    <svg
      width="20"
      height="24"
      viewBox="0 0 20 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12.473 5.054c.947.94 2.652 2.776 3.897 4.114.493.53.905.973 1.147 1.23l2.064-2.178c-1.918-1.391-6.024-5.562-7.842-7.97H8.773C6.953 2.659 2.847 6.827.93 8.221L2.993 10.4c.476-.5 1.134-1.205 1.827-1.95C6 7.182 7.336 5.75 8.037 5.053l.639-.636v16.638c0 .617-.077 1.231-.15 1.825a26.73 26.73 0 0 0-.098.859h3.653a24.516 24.516 0 0 0-.097-.851c-.075-.602-.152-1.216-.152-1.833V4.418l.64.636h.001Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function MarqueeTicker({
  items = DEFAULT_ITEMS,
  separator = "*",
  mode = "arrows",
  arrowCount = 5,
  speedSeconds = 15,
  inverted = false,
  className,
  ariaLabel = "Announcement ticker",
}: MarqueeTickerProps) {
  const safeItems = items.length > 0 ? items : DEFAULT_ITEMS;
  const joinedText = safeItems.join(` ${separator} `);
  const count = Math.max(0, Math.floor(arrowCount));
  const rootClassName = [
    styles.ticker,
    inverted ? styles.tickerInverted : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  if (mode === "scroll") {
    const repeated = [...safeItems, ...safeItems, ...safeItems];
    const trackStyle = {
      "--rk-marquee-duration": `${speedSeconds}s`,
    } as CSSProperties;

    return (
      <div
        className={rootClassName}
        data-rk-ticker-mode="scroll"
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
      >
        <div className={styles.scrollViewport}>
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className={styles.scrollTrack}
              style={trackStyle}
              aria-hidden={dup === 1 ? "true" : undefined}
            >
              {repeated.map((entry, idx) => (
                <span key={`${dup}-${entry}-${idx}`} className={styles.scrollItem}>
                  <span className={styles.scrollText}>{entry}</span>
                  <span className={styles.scrollSep} aria-hidden="true">
                    {separator}
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={rootClassName}
      data-rk-ticker-mode="arrows"
      role="region"
      aria-label={ariaLabel}
      tabIndex={0}
    >
      <div className={styles.inner}>
        {Array.from({ length: count }).map((_, i) => (
          <ArrowUpIcon key={`a1-${i}`} className={styles.arrow} />
        ))}
        <p className={styles.text}>{joinedText}</p>
        {Array.from({ length: count }).map((_, i) => (
          <ArrowUpIcon key={`a2-${i}`} className={styles.arrow} />
        ))}
      </div>
    </div>
  );
}
