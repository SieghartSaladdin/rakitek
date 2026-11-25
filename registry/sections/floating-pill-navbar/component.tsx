"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import styles from "./styles.module.css";

const EASE_SMOOTH: [number, number, number, number] = [0.32, 0.72, 0, 1];

export interface FloatingPillNavLink {
  label: string;
  targetId?: string;
  href?: string;
  onClick?: () => void;
}

export interface FloatingPillNavbarProps {
  brandName?: string;
  links?: FloatingPillNavLink[];
  contactLabel?: string;
  copiedLabel?: string;
  contactEmail?: string;
  copiedDurationMs?: number;
  onContactCopy?: (email: string) => void;
  className?: string;
}

const DEFAULT_LINKS: FloatingPillNavLink[] = [
  { label: "Home", targetId: "hero" },
  { label: "Catalog", targetId: "catalog" },
  { label: "Waitlist", targetId: "waitlist" },
];

function copyToClipboard(text: string): void {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).catch(() => {});
    return;
  }
  if (typeof document === "undefined") return;
  try {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  } catch {
    // Clipboard access unavailable in restricted contexts.
  }
}

function scrollToTarget(id: string, reducedMotion: boolean): void {
  if (typeof document === "undefined") return;
  const target = document.getElementById(id);
  if (!target) return;
  target.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth" });
}

export function FloatingPillNavbar({
  brandName = "Oriel",
  links = DEFAULT_LINKS,
  contactLabel = "Contact",
  copiedLabel = "Copied",
  contactEmail = "hello@oriel.studio",
  copiedDurationMs = 2500,
  onContactCopy,
  className,
}: FloatingPillNavbarProps) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prefersReducedMotion = Boolean(useReducedMotion());

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const labelMotion = prefersReducedMotion
    ? {
        initial: { opacity: 1, y: 0, filter: "blur(0px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 1, y: 0, filter: "blur(0px)" },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, y: 8, filter: "blur(4px)" },
        animate: { opacity: 1, y: 0, filter: "blur(0px)" },
        exit: { opacity: 0, y: -8, filter: "blur(4px)" },
        transition: { duration: 0.25, ease: EASE_SMOOTH },
      };

  const iconMotion = prefersReducedMotion
    ? {
        initial: { opacity: 1, scale: 1 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 1, scale: 1 },
        transition: { duration: 0 },
      }
    : {
        initial: { opacity: 0, scale: 0.5 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.5 },
        transition: { duration: 0.2, ease: EASE_SMOOTH },
      };

  const handleContact = () => {
    if (copied) return;
    copyToClipboard(contactEmail);
    setCopied(true);
    onContactCopy?.(contactEmail);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
      timeoutRef.current = null;
    }, copiedDurationMs);
  };

  const navClassName = className ? `${styles.nav} ${className}` : styles.nav;

  return (
    <motion.nav
      aria-label="Primary navigation"
      className={navClassName}
      initial={prefersReducedMotion ? false : { opacity: 0, y: -20, filter: "blur(10px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={
        prefersReducedMotion
          ? { duration: 0 }
          : { duration: 0.8, delay: 0.5, ease: EASE_SMOOTH }
      }
    >
      <span className={styles.logo}>{brandName}</span>
      <div className={styles.links}>
        {links.map((item) =>
          item.href ? (
            <a
              key={item.label}
              className={styles.link}
              href={item.href}
              onClick={item.onClick}
            >
              {item.label}
            </a>
          ) : (
            <button
              key={item.label}
              type="button"
              className={styles.link}
              onClick={() => {
                item.onClick?.();
                if (item.targetId) scrollToTarget(item.targetId, prefersReducedMotion);
              }}
            >
              {item.label}
            </button>
          ),
        )}
      </div>
      <button
        type="button"
        className={`${styles.contact} ${copied ? styles.contactCopied : ""}`}
        onClick={handleContact}
        aria-live="polite"
        aria-label={copied ? `${copiedLabel}: ${contactEmail}` : `${contactLabel} (${contactEmail})`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {copied ? (
            <motion.span key="copied" className={styles.contactLabel} {...labelMotion}>
              {copiedLabel}
            </motion.span>
          ) : (
            <motion.span key="contact" className={styles.contactLabel} {...labelMotion}>
              {contactLabel}
            </motion.span>
          )}
        </AnimatePresence>
        <span className={styles.contactIcon} aria-hidden="true">
          <AnimatePresence mode="wait" initial={false}>
            {copied ? (
              <motion.svg
                key="check"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                {...iconMotion}
              >
                <polyline points="20 6 9 17 4 12" />
              </motion.svg>
            ) : (
              <motion.svg
                key="arrow"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                {...iconMotion}
              >
                <line x1="7" y1="17" x2="17" y2="7" />
                <polyline points="7 7 17 7 17 17" />
              </motion.svg>
            )}
          </AnimatePresence>
        </span>
      </button>
    </motion.nav>
  );
}
