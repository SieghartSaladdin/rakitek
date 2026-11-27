"use client";

import type { MouseEventHandler } from "react";
import styles from "./styles.module.css";

export interface MonoUnderlineLinkProps {
  href: string;
  label: string;
  id?: string;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

/**
 * Text link with a hairline underline that is drawn at rest and wipes out to the right on
 * hover. Inside a LineReveal block the label rises and the rule draws in with it.
 */
export function MonoUnderlineLink({
  href,
  label,
  id,
  className,
  target,
  rel,
  ariaLabel,
  onClick,
}: MonoUnderlineLinkProps) {
  return (
    <a
      id={id}
      className={className ? `${styles.link} ${className}` : styles.link}
      href={href}
      target={target}
      rel={rel ?? (target === "_blank" ? "noopener noreferrer" : undefined)}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      <span className={styles.mask}>
        <span className={styles.line} data-rk-line="">
          {label}
        </span>
      </span>
      <span className={styles.rule} aria-hidden="true">
        <span className={styles.stroke} data-rk-rule="" />
      </span>
    </a>
  );
}
