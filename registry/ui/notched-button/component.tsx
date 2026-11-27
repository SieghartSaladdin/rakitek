"use client";

import { useCallback, type MouseEvent, type ReactNode } from "react";
import styles from "./styles.module.css";

export type NotchedButtonVariant = "outline" | "filled" | "inverse";
export type NotchedButtonSize = "sm" | "md" | "lg";

export interface NotchedButtonProps {
  children: ReactNode;
  variant?: NotchedButtonVariant;
  size?: NotchedButtonSize;
  href?: string;
  newTab?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  arrow?: boolean;
  className?: string;
  ariaLabel?: string;
}

const SIZE_CLASS: Record<NotchedButtonSize, string> = {
  sm: styles.sizeSm,
  md: styles.sizeMd,
  lg: styles.sizeLg,
};

const VARIANT_CLASS: Record<NotchedButtonVariant, string> = {
  outline: styles.outline,
  filled: styles.filled,
  inverse: `${styles.outline} ${styles.inverse}`,
};

function ArrowIcon() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function NotchedButton({
  children,
  variant = "outline",
  size = "md",
  href,
  newTab = false,
  onClick,
  type = "button",
  disabled = false,
  arrow = false,
  className,
  ariaLabel,
}: NotchedButtonProps) {
  const classes = [
    styles.btn,
    VARIANT_CLASS[variant],
    SIZE_CLASS[size],
    disabled ? styles.disabled : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  const trackPointer = useCallback((event: MouseEvent<HTMLElement>) => {
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    el.style.setProperty("--mouse-x", `${((event.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty("--mouse-y", `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const content = (
    <>
      {children}
      {arrow ? <ArrowIcon /> : null}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        onClick={onClick}
        onMouseMove={trackPointer}
        {...(newTab ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={trackPointer}
      disabled={disabled}
    >
      {content}
    </button>
  );
}
