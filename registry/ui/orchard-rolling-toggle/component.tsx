"use client";

import type { CSSProperties } from "react";
import styles from "./styles.module.css";

export interface OrchardRollingToggleProps {
  open?: boolean;
  onToggle?: () => void;
  menuLabel?: string;
  closeLabel?: string;
  theme?: "dark" | "light";
  controlsId?: string;
  className?: string;
  pillClassName?: string;
  discClassName?: string;
}

function RollLabel({ text, variant }: { text: string; variant: "menu" | "close" }) {
  const variantClass = variant === "menu" ? styles.labelMenu : styles.labelClose;
  return (
    <span className={`${styles.label} ${variantClass}`}>
      <span className={styles.roll}>
        {Array.from(text).map((ch, i) => (
          <span
            key={`${variant}-${i}`}
            className={styles.rollChar}
            style={{ "--i": i } as CSSProperties}
          >
            <span className={styles.rollTop}>{ch === " " ? "\u00a0" : ch}</span>
            <span className={styles.rollBot}>{ch === " " ? "\u00a0" : ch}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

export function OrchardRollingToggle({
  open = false,
  onToggle,
  menuLabel = "menu",
  closeLabel = "close",
  theme = "dark",
  controlsId,
  className,
  pillClassName,
  discClassName,
}: OrchardRollingToggleProps) {
  const rootClasses = [
    styles.toggle,
    open ? styles.isOpen : "",
    theme === "light" ? styles.isLight : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={rootClasses}
      aria-controls={controlsId}
      aria-expanded={open}
      aria-label={open ? closeLabel : menuLabel}
      onClick={onToggle}
    >
      <span className={pillClassName ? `${styles.pill} ${pillClassName}` : styles.pill}>
        <span className={styles.pillTrack} aria-hidden="true">
          <RollLabel text={menuLabel} variant="menu" />
          <RollLabel text={closeLabel} variant="close" />
        </span>
      </span>
      <span
        className={discClassName ? `${styles.disc} ${discClassName}` : styles.disc}
        aria-hidden="true"
      >
        <span className={styles.symbolTrack}>
          <span className={styles.diamond} />
          <svg
            className={styles.closeIcon}
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M1.00008 1.00008L11.0001 11.0001"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M1.00001 11L11 0.999998"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </span>
      </span>
    </button>
  );
}
