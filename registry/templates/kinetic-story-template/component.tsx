"use client";

import { useEffect, useState, type ReactNode } from "react";
import styles from "./styles.module.css";

export interface KineticStoryTemplateProps {
  hero?: ReactNode;
  manifesto?: ReactNode;
  story?: ReactNode;
  stats?: ReactNode;
  orbit?: ReactNode;
  footer?: ReactNode;
  floatingCtaLabel?: string;
  showFloatingCta?: boolean;
  onFloatingCtaClick?: () => void;
  skipLinkLabel?: string;
  mainId?: string;
  footerId?: string;
  className?: string;
}

export function KineticStoryTemplate({
  hero,
  manifesto,
  story,
  stats,
  orbit,
  footer,
  floatingCtaLabel = "Join Waitlist",
  showFloatingCta = true,
  onFloatingCtaClick,
  skipLinkLabel = "Skip to content",
  mainId = "StoryContent",
  footerId = "waitlist-footer",
  className,
}: KineticStoryTemplateProps) {
  const [pillVisible, setPillVisible] = useState(false);

  useEffect(() => {
    if (!showFloatingCta) {
      setPillVisible(false);
      return;
    }
    const onScroll = () => {
      const y = window.scrollY;
      const vh = window.innerHeight || 800;
      const maxY = document.documentElement.scrollHeight - vh;
      const pastHero = y > vh * 0.55;
      const nearEnd = maxY > vh && y > maxY - vh * 0.4;
      setPillVisible(pastHero && !nearEnd);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [showFloatingCta]);

  const handlePillClick = () => {
    if (onFloatingCtaClick) {
      onFloatingCtaClick();
      return;
    }
    const target = document.getElementById(footerId);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={className ? `${styles.shell} ${className}` : styles.shell}
      data-rk-template="kinetic-story-template"
    >
      <a className={styles.skipLink} href={`#${mainId}`}>
        {skipLinkLabel}
      </a>

      <main id={mainId} className={styles.mainRegion} role="main" tabIndex={-1}>
        {hero ? (
          <div className={styles.chapterSlot} data-template-slot="hero">
            {hero}
          </div>
        ) : null}
        {manifesto ? (
          <div className={styles.chapterSlot} data-template-slot="manifesto">
            {manifesto}
          </div>
        ) : null}
        {story ? (
          <div className={styles.chapterSlot} data-template-slot="story">
            {story}
          </div>
        ) : null}
        {stats ? (
          <div className={styles.chapterSlot} data-template-slot="stats">
            {stats}
          </div>
        ) : null}
        {orbit ? (
          <div className={styles.chapterSlot} data-template-slot="orbit">
            {orbit}
          </div>
        ) : null}
      </main>

      {footer ? (
        <div id={footerId} className={styles.footerSlot} data-template-slot="footer">
          {footer}
        </div>
      ) : null}

      {showFloatingCta ? (
        <button
          type="button"
          className={`${styles.floatingPill} ${pillVisible ? styles.floatingPillVisible : ""}`}
          onClick={handlePillClick}
          aria-label={floatingCtaLabel}
          data-template-slot="floating-cta"
        >
          <span className={styles.pillMark} aria-hidden="true" />
          <span className={styles.pillBtn}>{floatingCtaLabel}</span>
        </button>
      ) : null}
    </div>
  );
}
