"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface FixedBackdropRevealTemplateProps {
  backdrop?: ReactNode;
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  revealHeight?: string;
  mainId?: string;
  skipLinkLabel?: string;
  className?: string;
}

export function FixedBackdropRevealTemplate({
  backdrop,
  header,
  children,
  footer,
  revealHeight = "100vh",
  mainId = "main-content",
  skipLinkLabel = "Skip to main content",
  className,
}: FixedBackdropRevealTemplateProps) {
  const rootClass = className ? `${styles.shell} ${className}` : styles.shell;

  return (
    <div className={rootClass} data-rk-template="fixed-backdrop-reveal-template">
      <a className={styles.skipLink} href={`#${mainId}`}>
        {skipLinkLabel}
      </a>

      {backdrop ? (
        <div className={styles.backdropSlot} data-template-slot="backdrop">
          {backdrop}
        </div>
      ) : null}

      {header ? <div data-template-slot="header">{header}</div> : null}

      <div className={styles.layer}>
        <div className={styles.reveal} style={{ height: revealHeight }} aria-hidden="true" />
      </div>

      <div className={`${styles.layer} ${styles.content}`}>
        <main id={mainId} className={styles.main} tabIndex={-1}>
          {children}
        </main>
        {footer ? <div data-template-slot="footer">{footer}</div> : null}
      </div>
    </div>
  );
}
