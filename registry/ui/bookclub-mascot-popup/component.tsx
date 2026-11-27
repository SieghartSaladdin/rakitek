"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import styles from "./styles.module.css";

export interface BookclubMascotPopupProps {
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  external?: boolean;
  triggerAriaLabel?: string;
  variant?: "left" | "right" | "right-bottom";
  tone?: "light" | "dark-icon" | "pink";
  defaultOpen?: boolean;
  icon?: ReactNode;
  className?: string;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

function DefaultClubCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 80 80" width="100%" aria-hidden="true" className={styles.buttonSvg}>
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M40.922 0C63.522 0 80 18.401 80 41.1 80 63.8 63.522 80 40.922 80S0 63.8 0 41.1C0 18.402 18.321 0 40.922 0Zm22.857 15.697c-13.817-13.474-36.234-13.754-49.77 0C.473 29.45 2.035 50.379 15.852 63.853 29.67 77.327 52.823 79.81 66.36 66.055c13.537-13.754 11.237-36.884-2.58-50.358Z"
      />
      <path
        fill="currentColor"
        d="M23 27c5.5 0 11.2 1.8 15 5.2V55c-3.8-2.8-9.2-4.2-15-4.2-2.2 0-4.2.3-6 .8V27.9c1.9-.6 3.9-.9 6-.9Zm34 0c-5.5 0-11.2 1.8-15 5.2V55c3.8-2.8 9.2-4.2 15-4.2 2.2 0 4.2.3 6 .8V27.9c-1.9-.6-3.9-.9-6-.9Z"
      />
    </svg>
  );
}

const VARIANT_CLASS: Record<NonNullable<BookclubMascotPopupProps["variant"]>, string> = {
  left: styles.variantLeft,
  right: "",
  "right-bottom": styles.variantRightBottom,
};

const TONE_CLASS: Record<NonNullable<BookclubMascotPopupProps["tone"]>, string> = {
  light: "",
  "dark-icon": styles.toneDarkIcon,
  pink: styles.tonePink,
};

export function BookclubMascotPopup({
  title = "Want to join the Club?",
  ctaLabel = "Sign-up now!",
  ctaHref = "#signup",
  external = false,
  triggerAriaLabel = "Show Sign up",
  variant = "left",
  tone = "light",
  defaultOpen = false,
  icon,
  className = "",
  onCtaClick,
}: BookclubMascotPopupProps) {
  const [lockedOpen, setLockedOpen] = useState(defaultOpen);
  const [hovered, setHovered] = useState(false);
  const isOpen = lockedOpen || hovered;

  const cls = [
    styles.popup,
    VARIANT_CLASS[variant],
    TONE_CLASS[tone],
    isOpen ? styles.isOpen : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div
      data-rk-popup=""
      className={cls}
      onPointerEnter={() => { if (!lockedOpen) setHovered(true); }}
      onPointerLeave={() => { if (!lockedOpen) setHovered(false); }}
    >
      <button
        type="button"
        aria-label={triggerAriaLabel}
        aria-expanded={isOpen}
        className={styles.button}
        onClick={(e) => {
          e.preventDefault();
          setLockedOpen((prev) => !prev);
        }}
      >
        <span className={styles.buttonInner}>
          {icon ?? <DefaultClubCircleIcon />}
        </span>
      </button>

      <div className={styles.overlay}>
        <div className={styles.overlayInner}>
          <div className={styles.overlayBgWrap}>
            <div className={styles.overlayEars} aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 44 45" width="100%" className={styles.leftEar}>
                <path fill="currentColor" d="M1.335.198c.671-.316 1.5-.254 2.186.187C27.678 16.847 39.839 36.953 44 45h-6.048c-2.382-1.604-6.964-3.674-15.652-4.814C2.999 37.666-.665 14.174.09 2.04.152 1.28.589.515 1.335.198Z" />
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 29 80" width="100%" className={styles.rightEar}>
                <path fill="currentColor" d="M19.388.879c.667-.771 1.647-1.018 2.559-.807.912.21 1.682.956 1.926 1.861C34.595 38.09 25.79 69.237 21.823 80h-4.188c-.17-4.22-2.739-13.318-10.975-22.064-8.493-9.099-8.88-21.913-1.063-37.23C11.221 9.603 19.091 1.266 19.388.879Z" />
              </svg>
            </div>
            <div className={styles.overlayBg} />
          </div>

          <div className={styles.overlayContent}>
            <h3 className={styles.overlayTitle}>{title}</h3>
            <div className={styles.overlayAction}>
              <BookclubBouncyCta
                label={ctaLabel}
                href={ctaHref}
                external={external}
                variant="small"
                onClick={onCtaClick}
              />
            </div>
          </div>
        </div>
        <div className={styles.targetZone} />
      </div>
    </div>
  );
}
