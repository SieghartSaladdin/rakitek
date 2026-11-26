"use client";

import type { MouseEvent } from "react";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import styles from "./styles.module.css";

export interface NewsletterPrefooterProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function NewsletterPrefooter({
  title = "Subscribe to our newsletter",
  description = "Stay informed about seasonal departures, new collections, and exclusive travel dispatches. Join our mailing list today.",
  ctaLabel = "Join list!",
  ctaHref = "#subscribe",
  ctaExternal = false,
  onCtaClick,
}: NewsletterPrefooterProps) {
  return (
    <div className={styles.wrapper}>
      <section className={styles.prefooter}>
        <div className={styles.inner}>
          <div className={styles.title}>
            <span className={styles.line}>{title}</span>
          </div>
          <div className={styles.txt}>{description}</div>
          <RollingCtaButton
            href={ctaHref}
            external={ctaExternal}
            label={ctaLabel}
            variant="secondary"
            lightHover
            onClick={(e) => {
              if (ctaHref.startsWith("#")) e.preventDefault();
              onCtaClick?.(e);
            }}
          />
        </div>
      </section>
    </div>
  );
}
