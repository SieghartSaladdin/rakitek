"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface SaasWaitlistTemplateProps {
  navbar?: ReactNode;
  hero?: ReactNode;
  spotlight?: ReactNode;
  extra?: ReactNode;
  footer?: ReactNode;
  skipLinkLabel?: string;
  mainId?: string;
  className?: string;
}

export function SaasWaitlistTemplate({
  navbar,
  hero,
  spotlight,
  extra,
  footer,
  skipLinkLabel = "Skip to content",
  mainId = "SaasContent",
  className,
}: SaasWaitlistTemplateProps) {
  return (
    <div
      className={className ? `${styles.shell} ${className}` : styles.shell}
      data-rk-template="saas-waitlist-template"
    >
      <a className={styles.skipLink} href={`#${mainId}`}>
        {skipLinkLabel}
      </a>

      {navbar ? (
        <div className={styles.navbarSlot} data-template-slot="navbar">
          {navbar}
        </div>
      ) : null}

      <main id={mainId} className={styles.mainRegion} role="main" tabIndex={-1}>
        {spotlight ? (
          <div className={styles.sectionSlot} data-template-slot="spotlight">
            {spotlight}
          </div>
        ) : null}
        {hero ? (
          <div className={styles.sectionSlot} data-template-slot="hero">
            {hero}
          </div>
        ) : null}
        {extra ? (
          <div className={styles.sectionSlot} data-template-slot="extra">
            {extra}
          </div>
        ) : null}
      </main>

      {footer ? (
        <div className={styles.footerSlot} data-template-slot="footer">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
