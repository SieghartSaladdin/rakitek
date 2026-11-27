"use client";

import { useEffect, useRef } from "react";
import { BookclubAppBadges } from "@registry/ui/bookclub-app-badges/component";
import { BookclubMascotPopup } from "@registry/ui/bookclub-mascot-popup/component";
import { initBoxScrollSequence } from "./sequence";
import styles from "./styles.module.css";

export interface BookclubBoxSequenceProps {
  id?: string;
  headline?: string;
  headerImageSrc?: string;
  headerImageAlt?: string;
  callOutNote?: string;
  finalTagline?: string;
  popupTitle?: string;
  popupCtaLabel?: string;
  popupCtaHref?: string;
  showPopup?: boolean;
  appStoreHref?: string;
  googlePlayHref?: string;
  appStoreImageSrc?: string;
  googlePlayImageSrc?: string;
  showAppBadges?: boolean;
  sequenceBaseUrl?: string;
  mobileSequenceBaseUrl?: string;
  sequenceFrames?: number;
  sequenceDigits?: number;
  short?: boolean;
  className?: string;
}

export function BookclubBoxSequence({
  id = "box-sequence",
  headline = "UNBOX YOUR NEXT READ",
  headerImageSrc,
  headerImageAlt = "Book Club Box",
  callOutNote = "Each box includes a bookmark per book and postcard with a challenge to win a free credit!",
  finalTagline = "Made for readers by readers",
  popupTitle = "Want to join the Club?",
  popupCtaLabel = "Sign-up now!",
  popupCtaHref = "#signup",
  showPopup = true,
  appStoreHref = "#app-store",
  googlePlayHref = "#google-play",
  appStoreImageSrc,
  googlePlayImageSrc,
  showAppBadges = true,
  sequenceBaseUrl,
  mobileSequenceBaseUrl,
  sequenceFrames = 120,
  sequenceDigits = 3,
  short = false,
  className = "",
}: BookclubBoxSequenceProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    return initBoxScrollSequence(wrap, {
      sequenceBaseUrl,
      mobileSequenceBaseUrl,
      frames: sequenceFrames,
      digits: sequenceDigits,
    });
  }, [sequenceBaseUrl, mobileSequenceBaseUrl, sequenceFrames, sequenceDigits]);

  return (
    <section id={id} data-rk-box-sequence="" className={[styles.box, className].filter(Boolean).join(" ")}>
      <div
        ref={wrapRef}
        data-box-sequence-short={short ? "" : undefined}
        className={[styles.wrap, short ? styles.wrapShort : ""].filter(Boolean).join(" ")}
      >
        <div className={styles.sticky}>
          <div data-box-sequence-element="" className={styles.element}>
            {sequenceBaseUrl ? (
              <canvas data-box-sequence-canvas="" className={styles.canvas} />
            ) : (
              <div className={styles.fallbackCanvasBox} aria-hidden="true">
                <svg viewBox="0 0 420 340" fill="none" className={styles.fallbackSvg}>
                  <rect x="45" y="70" width="330" height="220" rx="34" fill="var(--rk-bc-yellow)" stroke="var(--rk-bc-black)" strokeWidth="8" />
                  <path d="M45 132h330" stroke="var(--rk-bc-black)" strokeWidth="8" />
                  <rect x="92" y="162" width="110" height="86" rx="14" fill="var(--rk-bc-bright-pink)" stroke="var(--rk-bc-black)" strokeWidth="6" />
                  <rect x="224" y="162" width="104" height="86" rx="14" fill="var(--rk-bc-white)" stroke="var(--rk-bc-black)" strokeWidth="6" />
                </svg>
              </div>
            )}

            {showPopup ? (
              <div className={styles.easterEgg}>
                <div className={styles.easterEggInner}>
                  <BookclubMascotPopup variant="left" title={popupTitle} ctaLabel={popupCtaLabel} ctaHref={popupCtaHref} />
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.textWrap}>
            <div className={styles.textOuter}>
              <p data-box-sequence-handwritten-text="" className={styles.handwrittenText}>
                {callOutNote}
              </p>
            </div>
          </div>

          <div className={styles.content}>
            <div className={styles.header}>
              {headerImageSrc ? (
                <img
                  src={headerImageSrc}
                  loading="lazy"
                  width={1000}
                  height={227}
                  alt={headerImageAlt}
                  data-box-sequence-title=""
                  className={styles.headerImg}
                />
              ) : (
                <h2 data-box-sequence-title="" className={styles.headerWordmark}>{headline}</h2>
              )}
            </div>
            <div className={styles.contentTextWrap}>
              <div className={styles.contentTextOuter}>
                <p data-box-sequence-text-final="" className={[styles.handwrittenText, styles.contentText].join(" ")}>
                  {finalTagline}
                </p>
              </div>
            </div>
            {showAppBadges ? (
              <div className={styles.action}>
                <BookclubAppBadges
                  variant="base"
                  wrapForSequence
                  appStoreHref={appStoreHref}
                  googlePlayHref={googlePlayHref}
                  appStoreImageSrc={appStoreImageSrc}
                  googlePlayImageSrc={googlePlayImageSrc}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
