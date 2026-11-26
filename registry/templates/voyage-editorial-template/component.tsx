"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface VoyageEditorialTemplateProps {
  header?: ReactNode;
  overlay?: ReactNode;
  hero?: ReactNode;
  carousel?: ReactNode;
  packages?: ReactNode;
  manifesto?: ReactNode;
  stories?: ReactNode;
  spotlight?: ReactNode;
  partnerBanner?: ReactNode;
  prefooter?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  skipLinkLabel?: string;
  mainId?: string;
  className?: string;
}

export function VoyageEditorialTemplate({
  header,
  overlay,
  hero,
  carousel,
  packages,
  manifesto,
  stories,
  spotlight,
  partnerBanner,
  prefooter,
  footer,
  children,
  skipLinkLabel = "Skip to main content",
  mainId = "MainContent",
  className,
}: VoyageEditorialTemplateProps) {
  const slots = [
    ["hero", hero],
    ["carousel", carousel],
    ["packages", packages],
    ["manifesto", manifesto],
    ["stories", stories],
    ["spotlight", spotlight],
    ["partnerBanner", partnerBanner],
  ] as const;

  return (
    <div
      className={className ? `${styles.shell} ${className}` : styles.shell}
      data-rk-template="voyage-editorial-template"
    >
      <a className={styles.skipLink} href={`#${mainId}`}>
        {skipLinkLabel}
      </a>

      {header ? (
        <div className={styles.headerSlot} data-template-slot="header">
          {header}
        </div>
      ) : null}

      {overlay ? <div data-template-slot="overlay">{overlay}</div> : null}

      <div className={styles.pageWrapper}>
        <main id={mainId} className={styles.mainRegion} role="main" tabIndex={-1}>
          {slots.map(([name, node]) =>
            node ? (
              <div key={name} className={styles.slotBlock} data-template-slot={name}>
                {node}
              </div>
            ) : null,
          )}
          {children}
        </main>
      </div>

      {prefooter ? (
        <div className={styles.prefooterRegion} data-template-slot="prefooter">
          {prefooter}
        </div>
      ) : null}

      {footer ? (
        <div className={styles.footerRegion} data-template-slot="footer">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
