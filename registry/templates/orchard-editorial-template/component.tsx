"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface OrchardEditorialTemplateProps {
  header?: ReactNode;
  hero?: ReactNode;
  intro?: ReactNode;
  sections?: ReactNode;
  outro?: ReactNode;
  floatingNav?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  skipLinkLabel?: string;
  mainId?: string;
  className?: string;
}

export function OrchardEditorialTemplate({
  header,
  hero,
  intro,
  sections,
  outro,
  floatingNav,
  footer,
  children,
  skipLinkLabel = "Skip to content",
  mainId = "site-main",
  className,
}: OrchardEditorialTemplateProps) {
  return (
    <div
      className={className ? `${styles.shell} ${className}` : styles.shell}
      data-rk-template="orchard-editorial-template"
    >
      <a className={styles.skipLink} href={`#${mainId}`}>
        {skipLinkLabel}
      </a>

      {header ? (
        <div className={styles.headerSlot} data-template-slot="header">
          {header}
        </div>
      ) : null}

      <div className={styles.mainRegion}>
        <main id={mainId} tabIndex={-1}>
          {hero ? (
            <div className={styles.slotBlock} data-template-slot="hero">
              {hero}
            </div>
          ) : null}
          {intro ? (
            <div className={styles.slotBlock} data-template-slot="intro">
              {intro}
            </div>
          ) : null}
          {sections ? (
            <div className={styles.slotBlock} data-template-slot="sections">
              {sections}
            </div>
          ) : null}
          {outro ? (
            <div className={styles.slotBlock} data-template-slot="outro">
              {outro}
            </div>
          ) : null}
          {children}
        </main>
      </div>

      {floatingNav ? (
        <div className={styles.floatingNavSlot} data-template-slot="floatingNav">
          {floatingNav}
        </div>
      ) : null}

      {footer ? (
        <div className={styles.footerSlot} data-template-slot="footer">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
