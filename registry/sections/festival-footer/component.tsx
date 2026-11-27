"use client";

import { Fragment } from "react";
import { NotchedButton } from "@registry/ui/notched-button/component";
import news from "./newsletter.module.css";
import styles from "./styles.module.css";

export interface FooterLink {
  label: string;
  href: string;
  newTab?: boolean;
}

export interface FooterMetaItem {
  label: string;
  href?: string;
}

export interface FooterColumn {
  title: string;
  links: readonly FooterLink[];
}

export interface FestivalFooterProps {
  id?: string;
  showNewsletter?: boolean;
  newsletterLabel?: string;
  newsletterTitleLines?: readonly string[];
  newsletterText?: string;
  newsletterButtonLabel?: string;
  newsletterHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoHref?: string;
  brandName?: string;
  editionLabel?: string;
  dateLabel?: string;
  placeLabel?: string;
  socials?: readonly FooterLink[];
  columns?: readonly FooterColumn[];
  copyright?: string;
  metaItems?: readonly FooterMetaItem[];
  className?: string;
}

function LinkOrText({ item }: { item: FooterLink }) {
  const external = item.newTab ?? /^https?:/.test(item.href);
  return (
    <a
      href={item.href}
      className={styles.link}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {item.label}
    </a>
  );
}

export function FestivalFooter({
  id,
  showNewsletter = true,
  newsletterLabel = "Newsletter",
  newsletterTitleLines = ["Stay", "Informed"],
  newsletterText = "Subscribe to our newsletter for the latest news and announcements.",
  newsletterButtonLabel = "Subscribe",
  newsletterHref = "#newsletter",
  logoSrc,
  logoAlt = "Festival logo",
  logoHref = "#top",
  brandName = "Festival",
  editionLabel = "1st edition",
  dateLabel = "22-25 October 2026",
  placeLabel = "Harbour City, Northland",
  socials = [],
  columns = [],
  copyright = "© 2026 Festival. All rights reserved.",
  metaItems = [],
  className,
}: FestivalFooterProps) {
  const rootClass = className ? `${styles.footer} ${className}` : styles.footer;

  return (
    <footer id={id} className={rootClass}>
      {showNewsletter ? (
        <div className={news.block}>
          <div className={`${styles.container} ${news.inner}`}>
            <span className={news.eyebrow}>{newsletterLabel}</span>
            <div className={news.grid}>
              <div>
                <h3 className={news.title}>
                  {newsletterTitleLines.map((line, index) => (
                    <span key={`${line}-${index}`} className={news.titleLine}>
                      {line}
                    </span>
                  ))}
                </h3>
              </div>
              <div className={news.copy}>
                <p className={news.text}>{newsletterText}</p>
                <div className={news.action}>
                  <NotchedButton href={newsletterHref} variant="filled" size="lg">
                    {newsletterButtonLabel}
                  </NotchedButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className={`${styles.container} ${styles.main}`}>
        <div className={styles.mainGrid}>
          <div className={styles.brand}>
            <a href={logoHref} className={styles.logoLink}>
              {logoSrc ? (
                <img src={logoSrc} alt={logoAlt} className={styles.logo} />
              ) : (
                <span className={styles.wordmark}>{brandName}</span>
              )}
            </a>
            <div className={styles.facts}>
              {editionLabel ? <p className={styles.edition}>{editionLabel}</p> : null}
              {dateLabel ? <p className={styles.date}>{dateLabel}</p> : null}
              {placeLabel ? <p className={styles.place}>{placeLabel}</p> : null}
            </div>
            {socials.length > 0 ? (
              <div className={styles.socials}>
                {socials.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    className={styles.social}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          {columns.map((column) => (
            <div key={column.title}>
              <h4 className={styles.heading}>{column.title}</h4>
              <ul className={styles.list}>
                {column.links.map((item) => (
                  <li key={`${item.label}-${item.href}`}>
                    <LinkOrText item={item} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={`${styles.container} ${styles.bottomInner}`}>
          <p className={styles.copyright}>{copyright}</p>
          <div className={styles.meta}>
            {metaItems.map((item, index) => (
              <Fragment key={`${item.label}-${index}`}>
                {index > 0 ? <span aria-hidden="true">{"•"}</span> : null}
                {item.href ? (
                  <a href={item.href} className={styles.metaLink}>
                    {item.label}
                  </a>
                ) : (
                  <span>{item.label}</span>
                )}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
