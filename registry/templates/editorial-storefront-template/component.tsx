"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface EditorialStorefrontTemplateProps {
  /** Fixed right-hand desktop rail (90px) / mobile top bar (60px). */
  rail?: ReactNode;
  hero?: ReactNode;
  quiz?: ReactNode;
  showcase?: ReactNode;
  mission?: ReactNode;
  manifesto?: ReactNode;
  footer?: ReactNode;
  drawer?: ReactNode;
  skipLinkLabel?: string;
  mainId?: string;
  className?: string;
}

export function EditorialStorefrontTemplate({
  rail,
  hero,
  quiz,
  showcase,
  mission,
  manifesto,
  footer,
  drawer,
  skipLinkLabel = "Skip to content",
  mainId = "MainContent",
  className,
}: EditorialStorefrontTemplateProps) {
  return (
    <div
      className={className ? `${styles.shell} ${className}` : styles.shell}
      data-rk-template="editorial-storefront-template"
    >
      <a className={styles.skipLink} href={`#${mainId}`}>
        {skipLinkLabel}
      </a>

      {rail ? (
        <div className={styles.railSlot} data-template-slot="rail">
          {rail}
        </div>
      ) : null}

      <div className={styles.contentColumn} data-template-region="content">
        <main id={mainId} className={styles.mainRegion} role="main" tabIndex={-1}>
          {hero ? (
            <div className={styles.slotBlock} data-template-slot="hero">
              {hero}
            </div>
          ) : null}
          {quiz ? (
            <div className={styles.slotBlock} data-template-slot="quiz">
              {quiz}
            </div>
          ) : null}
          {showcase ? (
            <div className={styles.slotBlock} data-template-slot="showcase">
              {showcase}
            </div>
          ) : null}
          {mission ? (
            <div className={styles.slotBlock} data-template-slot="mission">
              {mission}
            </div>
          ) : null}
          {manifesto ? (
            <div className={styles.slotBlock} data-template-slot="manifesto">
              {manifesto}
            </div>
          ) : null}
        </main>

        {footer ? (
          <div className={styles.footerRegion} data-template-slot="footer">
            {footer}
          </div>
        ) : null}
      </div>

      {drawer ? (
        <div data-template-slot="drawer">
          {drawer}
        </div>
      ) : null}
    </div>
  );
}
