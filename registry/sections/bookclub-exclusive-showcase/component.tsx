"use client";

import { Fragment, type MouseEvent } from "react";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import { BookclubSliderControls } from "@registry/ui/bookclub-slider-controls/component";
import styles from "./styles.module.css";

export interface BookclubExclusiveTag {
  label: string;
  bgColor: string;
  textColor?: "black" | "white";
}

export interface BookclubExclusiveShowcaseProps {
  id?: string;
  title?: string;
  subtitle?: string;
  bookTitle?: string;
  bookDescription?: string;
  coverSrc?: string;
  coverAlt?: string;
  ratingLabel?: string;
  ratingValue?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  tags?: BookclubExclusiveTag[];
  authorsHeading?: string;
  authors?: string[];
  quote1?: string;
  quote2?: string;
  showControls?: boolean;
  className?: string;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

const DEFAULT_TAGS: BookclubExclusiveTag[] = [
  { label: "Club Original", bgColor: "var(--rk-bc-pale-blue)", textColor: "black" },
  { label: "Horror", bgColor: "var(--rk-bc-black)", textColor: "white" },
];

const DEFAULT_AUTHORS = [
  "Kay Chronister",
  "Del Sandeen",
  "Kylie Lee Baker",
  "Rachel Harrison",
  "CJ Leede",
  "Jennifer Thorne",
  "S.A. Barnes",
  "Stephen Graham Jones",
];

export function BookclubExclusiveShowcase({
  id = "exclusive",
  title = "Club Exclusive",
  subtitle = "Horror anthology by club authors. No, you can't get it anywhere else.",
  bookTitle = "One Bad Night & Other Stories",
  bookDescription = "Our club launched in October 2022, and we’re celebrating our three-year anniversary with this original horror anthology featuring 8 past featured authors.",
  coverSrc,
  coverAlt = "One Bad Night & Other Stories",
  ratingLabel = "Reader Rating",
  ratingValue = "4.0",
  ctaLabel = "Add to box!",
  ctaHref = "#exclusive",
  ctaExternal = false,
  tags = DEFAULT_TAGS,
  authorsHeading = "Authors",
  authors = DEFAULT_AUTHORS,
  quote1 = '"An absolutely phenomenal anthology of short stories from some of the best voices in horror right now!" - Trisha',
  quote2 = '"Not a bad story in the bunch. “One Bad Night” wrecked me." - Brittany',
  showControls = false,
  className = "",
  onCtaClick,
}: BookclubExclusiveShowcaseProps) {
  return (
    <section id={id} data-rk-exclusive-showcase="" className={[styles.exclusive, className].filter(Boolean).join(" ")}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            <div className={styles.headerContent}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.paragraph}>{subtitle}</p>
            </div>
          </div>
        </div>

        <ul role="list" className={styles.list}>
          <li className={styles.listItem}>
            <div className={styles.itemOuter}>
              <article className={styles.item}>
                <div className={styles.itemInner}>
                  <div className={styles.review}>
                    <div className={styles.reviewContent}>
                      <span className={styles.reviewTitle}>{ratingLabel}</span>
                      <span className={styles.reviewNumber}>{ratingValue}</span>
                    </div>
                    <svg viewBox="0 0 147 141" fill="none" aria-hidden="true" className={styles.reviewImg}>
                      <path d="M73.5 0l21 44 48 6-35 34 9 48-43-23-43 23 9-48-35-34 48-6Z" fill="currentColor" />
                    </svg>
                  </div>

                  <div className={styles.cardBg}>
                    <div className={styles.cardBgBottom} />
                    <div className={styles.cardCta}>
                      <BookclubBouncyCta label={ctaLabel} href={ctaHref} external={ctaExternal} variant="small" onClick={onCtaClick} />
                    </div>
                  </div>

                  <div className={styles.cardContainer}>
                    <div className={styles.cardCover}>
                      {coverSrc ? (
                        <img src={coverSrc} loading="lazy" alt={coverAlt} className={styles.cardImg} />
                      ) : (
                        <svg viewBox="0 0 320 493" fill="none" aria-hidden="true" className={styles.cardImg}>
                          <rect width="320" height="493" fill="var(--rk-bc-wine)" />
                          <circle cx="160" cy="210" r="82" fill="var(--rk-bc-yellow)" />
                          <rect x="44" y="340" width="232" height="18" rx="9" fill="var(--rk-bc-white)" opacity="0.25" />
                        </svg>
                      )}
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardText}>
                        <h3 className={styles.cardTitle}>{bookTitle}</h3>
                        <p className={styles.cardDesc}>{bookDescription}</p>
                      </div>
                      <ul role="list" className={styles.genreList}>
                        {tags.map((tag) => (
                          <li key={tag.label}>
                            <span
                              style={{
                                backgroundColor: tag.bgColor,
                                color: tag.textColor === "white" ? "var(--rk-bc-white)" : "var(--rk-bc-black)",
                              }}
                              className={styles.tagSmall}
                            >
                              <span className={styles.tagSmallText}>{tag.label}</span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </article>

              <div className={styles.addOn}>
                <div className={styles.authors}>
                  <h3 className={styles.authorsTitle}>{authorsHeading}</h3>
                  <p className={styles.authorsList}>
                    {authors.map((a, idx) => (
                      <Fragment key={a}>
                        {a}
                        {idx < authors.length - 1 ? <>, <br /></> : null}
                      </Fragment>
                    ))}
                  </p>
                </div>
                <div className={styles.quote01}><p className={styles.handwritten}>{quote1}</p></div>
                <div className={styles.quote02}><p className={[styles.handwritten, styles.handwrittenShort].join(" ")}>{quote2}</p></div>
                <svg viewBox="0 0 103 103" fill="none" aria-hidden="true" className={styles.emoji01}>
                  <circle cx="51" cy="51" r="44" fill="var(--rk-bc-yellow)" stroke="var(--rk-bc-black)" strokeWidth="6" />
                  <circle cx="37" cy="44" r="6" fill="var(--rk-bc-black)" />
                  <circle cx="65" cy="44" r="6" fill="var(--rk-bc-black)" />
                  <path d="M35 66c8 8 24 8 32 0" stroke="var(--rk-bc-black)" strokeWidth="6" strokeLinecap="round" />
                </svg>
                <svg viewBox="0 0 103 103" fill="none" aria-hidden="true" className={styles.emoji02}>
                  <path d="M51 8l12 28 30 4-22 21 5 30-25-14-25 14 5-30-22-21 30-4Z" fill="var(--rk-bc-cyan)" stroke="var(--rk-bc-black)" strokeWidth="6" />
                </svg>
                <svg viewBox="0 0 142 142" fill="none" aria-hidden="true" className={styles.emoji03}>
                  <rect x="20" y="20" width="102" height="102" rx="28" fill="var(--rk-bc-magenta)" stroke="var(--rk-bc-black)" strokeWidth="6" />
                  <path d="M46 72h50M71 47v50" stroke="var(--rk-bc-white)" strokeWidth="8" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </li>
        </ul>

        {showControls ? <BookclubSliderControls variant="exclusive" /> : null}
      </div>
    </section>
  );
}
