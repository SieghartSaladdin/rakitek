"use client";

import type { MouseEvent, ReactNode } from "react";
import styles from "./styles.module.css";

export interface BookclubSocialButtonProps {
  platform?: "instagram" | "tiktok" | "custom";
  href?: string;
  ariaLabel?: string;
  size?: "base" | "big";
  tone?: "default" | "pink" | "soft-pink";
  external?: boolean;
  icon?: ReactNode;
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const TONE_CLASS: Record<NonNullable<BookclubSocialButtonProps["tone"]>, string> = {
  default: "",
  pink: styles.tonePink,
  "soft-pink": styles.toneSoftPink,
};

function DefaultSocialIcon({ platform }: { platform: "instagram" | "tiktok" | "custom" }) {
  if (platform === "tiktok") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="100%" aria-hidden="true" className={styles.icon}>
        <path d="M16.6 5.82A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6 0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64 0 3.33 2.76 5.7 5.69 5.7 3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48Z" fill="currentColor" />
      </svg>
    );
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" width="100%" aria-hidden="true" className={styles.icon}>
      <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2Zm-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6Zm9.65 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" fill="currentColor" />
    </svg>
  );
}

export function BookclubSocialButton({
  platform = "instagram",
  href = "#social",
  ariaLabel,
  size = "base",
  tone = "default",
  external = true,
  icon,
  className = "",
  onClick,
}: BookclubSocialButtonProps) {
  const defaultLabel = platform === "tiktok" ? "Go to TikTok" : platform === "instagram" ? "Go to Instagram" : "Social link";
  const cls = [
    styles.social,
    size === "big" ? styles.big : "",
    TONE_CLASS[tone],
    className,
  ].filter(Boolean).join(" ");

  return (
    <a
      aria-label={ariaLabel ?? defaultLabel}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cls}
      onClick={onClick}
    >
      <div className={styles.inner}>
        <span className={styles.bg} />
        <span className={styles.iconOuter}>
          {icon ?? <DefaultSocialIcon platform={platform} />}
        </span>
      </div>
    </a>
  );
}
