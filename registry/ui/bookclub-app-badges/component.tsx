"use client";

import type { MouseEvent, ReactNode } from "react";
import styles from "./styles.module.css";

export interface BookclubAppBadgesProps {
  variant?: "base" | "outline";
  appStoreHref?: string;
  googlePlayHref?: string;
  appStoreAriaLabel?: string;
  googlePlayAriaLabel?: string;
  appStoreImageSrc?: string;
  googlePlayImageSrc?: string;
  appStoreSubtitle?: string;
  appStoreTitle?: string;
  googlePlaySubtitle?: string;
  googlePlayTitle?: string;
  external?: boolean;
  wrapForSequence?: boolean;
  className?: string;
  onClick?: (store: "apple" | "google", event: MouseEvent<HTMLAnchorElement>) => void;
}

function DefaultAppStoreSvg({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <svg viewBox="0 0 300 100" fill="none" aria-hidden="true" className={styles.svg}>
      <path d="M56.2 49.4c-.1-8.2 6.7-12.1 7-12.3-3.8-5.6-9.8-6.4-11.9-6.5-5-.5-9.8 3-12.4 3-2.6 0-6.5-2.9-10.7-2.8-5.5.1-10.6 3.2-13.4 8.2-5.8 10-1.5 24.8 4.1 32.9 2.7 4 6 8.4 10.2 8.2 4.1-.2 5.7-2.7 10.7-2.7s6.4 2.7 10.7 2.6c4.4-.1 7.2-4 9.9-8 3.1-4.6 4.4-9.1 4.5-9.3-.1-.1-8.6-3.3-8.7-13.3ZM48 25.4c2.3-2.8 3.8-6.6 3.4-10.5-3.3.1-7.3 2.2-9.6 5-2.1 2.4-3.9 6.3-3.4 10.1 3.7.3 7.4-1.8 9.6-4.6Z" fill="currentColor" />
      <text x="84" y="39" fill="currentColor" fontFamily="var(--rk-font-body)" fontWeight="600" fontSize="18" letterSpacing="0.02em">
        {subtitle}
      </text>
      <text x="84" y="72" fill="currentColor" fontFamily="var(--rk-font-body)" fontWeight="700" fontSize="34" letterSpacing="-0.02em">
        {title}
      </text>
    </svg>
  );
}

function DefaultGooglePlaySvg({ subtitle, title }: { subtitle: string; title: string }) {
  return (
    <svg viewBox="0 0 300 100" fill="none" aria-hidden="true" className={styles.svg}>
      <path d="M27 22.5c-.6.7-1 1.7-1 3v49c0 1.3.4 2.3 1 3l.2.2L54.7 50v-.6L27.2 22.3l-.2.2Z" fill="currentColor" opacity="0.92" />
      <path d="M63.8 59.3 54.7 50v-.6l9.1-9.2.2.1 10.8 6.1c3.1 1.7 3.1 4.6 0 6.4l-10.8 6.1-.2.4Z" fill="currentColor" opacity="0.72" />
      <path d="M64 59 54.7 49.7 27 77.5c1 1.1 2.7 1.2 4.6.1L64 59Z" fill="currentColor" opacity="0.58" />
      <path d="M64 40.4 31.6 22c-1.9-1.1-3.6-1-4.6.1L54.7 49.7 64 40.4Z" fill="currentColor" opacity="0.82" />
      <text x="86" y="38" fill="currentColor" fontFamily="var(--rk-font-body)" fontWeight="600" fontSize="16" letterSpacing="0.04em">
        {subtitle}
      </text>
      <text x="86" y="72" fill="currentColor" fontFamily="var(--rk-font-body)" fontWeight="700" fontSize="32" letterSpacing="-0.02em">
        {title}
      </text>
    </svg>
  );
}

export function BookclubAppBadges({
  variant = "base",
  appStoreHref = "#app-store",
  googlePlayHref = "#google-play",
  appStoreAriaLabel = "Download on the App Store",
  googlePlayAriaLabel = "Get it on Google Play",
  appStoreImageSrc,
  googlePlayImageSrc,
  appStoreSubtitle = "Download on the",
  appStoreTitle = "App Store",
  googlePlaySubtitle = "GET IT ON",
  googlePlayTitle = "Google Play",
  external = false,
  wrapForSequence = false,
  className = "",
  onClick,
}: BookclubAppBadgesProps) {
  const badgeCls = [styles.badge, variant === "outline" ? styles.outline : ""].filter(Boolean).join(" ");

  const wrapNode = (node: ReactNode, key: string) =>
    wrapForSequence ? (
      <div key={key} data-box-sequence-button="" className={styles.badgeWrap}>
        {node}
      </div>
    ) : (
      node
    );

  const appleNode = wrapNode(
    <a
      key="apple"
      aria-label={appStoreAriaLabel}
      href={appStoreHref}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={badgeCls}
      onClick={onClick ? (e) => onClick("apple", e) : undefined}
    >
      <span className={styles.bg}>
        {appStoreImageSrc ? (
          <img width={300} height={100} alt={appStoreAriaLabel} src={appStoreImageSrc} loading="lazy" className={styles.img} />
        ) : (
          <DefaultAppStoreSvg subtitle={appStoreSubtitle} title={appStoreTitle} />
        )}
      </span>
    </a>,
    "apple",
  );

  const googleNode = wrapNode(
    <a
      key="google"
      aria-label={googlePlayAriaLabel}
      href={googlePlayHref}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={badgeCls}
      onClick={onClick ? (e) => onClick("google", e) : undefined}
    >
      <span className={styles.bg}>
        {googlePlayImageSrc ? (
          <img width={300} height={100} alt={googlePlayAriaLabel} src={googlePlayImageSrc} loading="lazy" className={styles.img} />
        ) : (
          <DefaultGooglePlaySvg subtitle={googlePlaySubtitle} title={googlePlayTitle} />
        )}
      </span>
    </a>,
    "google",
  );

  if (wrapForSequence) {
    return (
      <>
        {appleNode}
        {googleNode}
      </>
    );
  }

  return (
    <div data-rk-app-badges="" className={[styles.group, className].filter(Boolean).join(" ")}>
      {appleNode}
      {googleNode}
    </div>
  );
}
