"use client";

import type { ReactNode } from "react";
import styles from "./styles.module.css";

export interface BookclubLandingTemplateProps {
  header?: ReactNode;
  hero?: ReactNode;
  books?: ReactNode;
  howItWorks?: ReactNode;
  boxSequence?: ReactNode;
  genres?: ReactNode;
  benefits?: ReactNode;
  faq?: ReactNode;
  gift?: ReactNode;
  promoBanners?: ReactNode;
  winners?: ReactNode;
  exclusive?: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  mainId?: string;
  className?: string;
}

export function BookclubLandingTemplate({
  header,
  hero,
  books,
  howItWorks,
  boxSequence,
  genres,
  benefits,
  faq,
  gift,
  promoBanners,
  winners,
  exclusive,
  footer,
  children,
  mainId = "main-content",
  className = "",
}: BookclubLandingTemplateProps) {
  const orderedSlots: Array<[string, ReactNode]> = [
    ["hero", hero],
    ["books", books],
    ["how-it-works", howItWorks],
    ["box-sequence", boxSequence],
    ["genres", genres],
    ["benefits", benefits],
    ["faq", faq],
    ["gift", gift],
    ["promo-banners", promoBanners],
    ["winners", winners],
    ["exclusive", exclusive],
  ];

  return (
    <div
      data-rk-template="bookclub-landing-template"
      className={[styles.wrapper, className].filter(Boolean).join(" ")}
    >
      {header ? <div data-template-slot="header">{header}</div> : null}

      <main id={mainId} className={styles.main} role="main">
        {orderedSlots.map(([key, node]) =>
          node ? (
            <div key={key} className={styles.slot} data-template-slot={key}>
              {node}
            </div>
          ) : null,
        )}
        {children}
      </main>

      {footer ? <div data-template-slot="footer">{footer}</div> : null}
    </div>
  );
}
