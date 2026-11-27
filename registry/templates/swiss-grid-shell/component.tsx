"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface SwissGridShellProps {
  /** Fixed blend-mode header. Render it first so it stays above the page. */
  header?: ReactNode;
  /** Fixed chrome rendered after the header, e.g. a studio note that pins itself beside it. */
  note?: ReactNode;
  /** Page sections, stacked full width on the white canvas. */
  children?: ReactNode;
  footer?: ReactNode;
  skipLinkLabel?: string;
  mainId?: string;
  className?: string;
}

/**
 * Page shell for the Swiss Mono style: the 12-column grid variables come from the style
 * tokens (--rk-col, --rk-gutter, --rk-u), so the shell only stacks the fixed chrome and
 * the sections on one canvas.
 */
export function SwissGridShell({
  header,
  note,
  children,
  footer,
  skipLinkLabel = "Skip to main content",
  mainId = "main",
  className,
}: SwissGridShellProps) {
  return (
    <div className={className ? `${styles.shell} ${className}` : styles.shell} data-rk-template="swiss-grid-shell">
      <a className={styles.skipLink} href={`#${mainId}`}>
        {skipLinkLabel}
      </a>
      {header}
      {note}
      <main id={mainId} className={styles.main} tabIndex={-1}>
        {children}
        {footer}
      </main>
    </div>
  );
}
