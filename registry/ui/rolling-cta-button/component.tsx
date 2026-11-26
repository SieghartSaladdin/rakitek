"use client";

import type { MouseEventHandler } from "react";
import styles from "./styles.module.css";

export interface RollingCtaButtonProps {
  label?: string;
  href?: string;
  external?: boolean;
  variant?: "primary" | "secondary";
  isArrow?: boolean;
  isClose?: boolean;
  isFixed?: boolean;
  isSmall?: boolean;
  isWhite?: boolean;
  lightHover?: boolean;
  minWide?: boolean;
  arrowSize?: "default" | "lg";
  direction?: "left" | "right";
  disabled?: boolean;
  className?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLElement>;
  type?: "button" | "submit" | "reset";
  "data-testid"?: string;
  "data-carousel-arrow"?: string;
}

function CaretSvg({ large = false }: { large?: boolean }) {
  const w = large ? "10%" : "16%";
  return (
    <svg
      viewBox="0 0 8 12"
      fill="none"
      aria-hidden="true"
      style={{ width: w, height: "auto" }}
    >
      <path
        d="M1.04364 1.08526L6.00135 6.04297L1.04364 11.0007"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseSvg() {
  return (
    <svg
      viewBox="0 0 25 25"
      fill="none"
      aria-hidden="true"
      style={{ width: "40%", height: "auto" }}
    >
      <path
        d="M18.6914 6.1875L6.31704 18.5619"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M18.6914 18.5625L6.31704 6.18813"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RollingCtaButton({
  label,
  href,
  external = false,
  variant = "primary",
  isArrow = false,
  isClose = false,
  isFixed = false,
  isSmall = false,
  isWhite = false,
  lightHover = false,
  minWide = false,
  arrowSize = "default",
  direction,
  disabled = false,
  className = "",
  ariaLabel,
  onClick,
  type = "button",
  "data-testid": testId,
  "data-carousel-arrow": carouselArrow,
}: RollingCtaButtonProps) {
  const classes = [
    styles.cta,
    variant === "secondary" ? styles.secondary : "",
    direction === "left" ? styles.left : "",
    isArrow ? styles.isArrow : "",
    isArrow && arrowSize === "lg" ? styles.isArrowLg : "",
    isClose ? styles.isClose : "",
    isFixed ? styles.isFixed : "",
    isSmall ? styles.isSmall : "",
    isWhite ? styles.isWhite : "",
    lightHover ? styles.lightHover : "",
    minWide ? styles.minWide : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const inner = isClose ? (
    <span className={styles.inner}>
      <span className={`${styles.iconSlide} ${styles.iconAfter}`} aria-hidden="true">
        <CloseSvg />
      </span>
    </span>
  ) : isArrow ? (
    <span className={styles.inner}>
      <span className={`${styles.iconSlide} ${styles.iconBefore}`} aria-hidden="true">
        <CaretSvg large={arrowSize === "lg"} />
      </span>
      <span className={`${styles.iconSlide} ${styles.iconAfter}`} aria-hidden="true">
        <CaretSvg large={arrowSize === "lg"} />
      </span>
    </span>
  ) : (
    <span
      className={`${styles.inner} ${label ? styles.labelRoll : ""}`.trim()}
      data-label={label ?? undefined}
    >
      {label ? <span className={styles.txt}>{label}</span> : null}
    </span>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
        aria-label={ariaLabel ?? label}
        onClick={onClick}
        data-testid={testId}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      aria-label={ariaLabel ?? label ?? (isClose ? "Close" : "Action")}
      onClick={onClick}
      data-testid={testId}
      data-carousel-arrow={carouselArrow}
    >
      {inner}
    </button>
  );
}
