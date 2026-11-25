"use client";

import { useEffect, useRef, useState } from "react";
import { RaysTile } from "./rays-tile";
import { BrandMark, BrandWordmark, RevealLetters, RevealWords } from "./reveal-text";
import styles from "./styles.module.css";
import { WaitlistForm, type WaitlistSubmitResult } from "./waitlist-form";

export type { WaitlistSubmitResult };

export interface RaysWaitlistFooterProps {
  label?: string;
  chapter?: string;
  lead?: string;
  pitch?: string;
  placeholder?: string;
  caption?: string;
  brandName?: string;
  creditLabel?: string;
  creditHref?: string;
  privacyLabel?: string;
  privacyHref?: string;
  termsLabel?: string;
  termsHref?: string;
  contactEmail?: string;
  bottomTagline?: string;
  onSubmit?: (email: string) => Promise<WaitlistSubmitResult> | WaitlistSubmitResult;
}

export function RaysWaitlistFooter({
  label = "Get In Early",
  chapter = "Chapter 08",
  lead = "Stop meaning to. Start doing.",
  pitch = "We're still building Oriel, and we're letting the first group in when it's ready. Leave your email and you'll be near the front of the line.",
  placeholder = "Your Email",
  caption = "Early access \u00B7 No card, no spam",
  brandName = "Oriel",
  creditLabel = "Built by Oriel Studio",
  creditHref = "#studio",
  privacyLabel = "Privacy",
  privacyHref = "#privacy",
  termsLabel = "Terms",
  termsHref = "#terms",
  contactEmail = "hello@oriel.studio",
  bottomTagline = "Real Life Happens Offline",
  onSubmit,
}: RaysWaitlistFooterProps) {
  const [live, setLive] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const tileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLive(true);
          io.disconnect();
        }
      },
      { threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className={`${styles.footer} ${live ? styles.footLive : ""}`}>
      <h2 className={styles.srOnly}>{label}</h2>
      <RaysTile
        tileRef={tileRef}
        live={live}
        className={styles.rays}
        fallbackClassName={styles.raysFallback}
      />
      <div className={styles.topbar}>
        <span><RevealWords text={label} base={1.4} step={0.05} /></span>
        <span><RevealWords text={chapter} base={1.5} step={0.05} /></span>
      </div>
      <div ref={tileRef} className={styles.tile} data-tile aria-hidden="true">
        <BrandMark className={styles.tileMark} />
      </div>
      <p className={styles.lead}><RevealWords text={lead} base={0.5} step={0.06} /></p>
      <p className={styles.pitch}><RevealWords text={pitch} base={0.65} step={0.015} /></p>
      <WaitlistForm placeholder={placeholder} caption={caption} onSubmit={onSubmit} />
      <div className={styles.bottom}>
        <div className={styles.bcol}>
          <a className={`${styles.legal} ${styles.dim}`} href={creditHref}>
            <span className={styles.w} style={{ animationDelay: "1.4s" }}>
              <RevealLetters text={creditLabel} />
            </span>
          </a>
          <a className={styles.legal} href={privacyHref}>
            <span className={styles.w} style={{ animationDelay: "1.52s" }}>
              <RevealLetters text={privacyLabel} />
            </span>
          </a>
        </div>
        <div className={`${styles.bcol} ${styles.bcenter}`}>
          <span className={styles.w} style={{ animationDelay: "1.45s" }}>
            <button
              type="button"
              className={styles.wordmarkBtn}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label={`${brandName}, back to top`}
            >
              <BrandWordmark name={brandName} className={styles.wordmark} />
            </button>
          </span>
          <span><RevealWords text={bottomTagline} base={1.5} step={0.03} /></span>
        </div>
        <div className={`${styles.bcol} ${styles.bright}`}>
          <a className={styles.mail} href={`mailto:${contactEmail}`}>
            <span className={styles.w} style={{ animationDelay: "1.45s" }}>
              <RevealLetters text={contactEmail} />
            </span>
          </a>
          <a className={styles.legal} href={termsHref}>
            <span className={styles.w} style={{ animationDelay: "1.55s" }}>
              <RevealLetters text={termsLabel} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
