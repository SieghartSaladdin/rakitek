"use client";

import type { MouseEvent } from "react";
import styles from "./styles.module.css";

export interface TicketMarqueeBarProps {
  id?: string;
  label?: string;
  href?: string;
  repeat?: number;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

function ArrowUpRight() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M7 7h10v10" />
      <path d="M7 17 17 7" />
    </svg>
  );
}

export function TicketMarqueeBar({
  id,
  label = "GET TICKETS",
  href = "#tickets",
  repeat = 32,
  onClick,
  className,
}: TicketMarqueeBarProps) {
  const rootClass = className ? `${styles.bar} ${className}` : styles.bar;
  const items = Array.from({ length: Math.max(1, repeat) }, (_, index) => index);

  return (
    <a id={id} href={href} aria-label={label} className={rootClass} onClick={onClick}>
      <div className={styles.shapes} aria-hidden="true">
        <span className={`${styles.shape} ${styles.shapeA}`} />
        <span className={`${styles.shape} ${styles.shapeB}`} />
        <span className={`${styles.shape} ${styles.shapeC}`} />
        <span className={`${styles.shape} ${styles.shapeD}`} />
      </div>

      <div className={styles.viewport}>
        <div className={styles.track}>
          {[0, 1].map((copy) => (
            <div key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
              {items.map((index) => (
                <span key={index} className={styles.item}>
                  <span className={styles.text}>{label}</span>
                  <ArrowUpRight />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </a>
  );
}
