"use client";

import { useEffect, useRef, useState, type CSSProperties, type MouseEventHandler } from "react";
import styles from "./styles.module.css";

export interface HeaderLink {
  href: string;
  label: string;
  active?: boolean;
}

export interface MonoClockHeaderProps {
  id?: string;
  links?: HeaderLink[];
  /** SVG path data for the wordmark, one path per glyph so each can rise on its own. */
  wordmarkPaths?: string[];
  wordmarkViewBox?: string;
  homeHref?: string;
  homeLabel?: string;
  menuLabel?: string;
  /** Narrows the wordmark to its first glyph, as on inner pages. */
  compact?: boolean;
  showClock?: boolean;
  showContact?: boolean;
  /** Clock text for a given moment. Default: Central European time with CET/CEST. */
  formatClock?: (date: Date) => string;
  contactLabel?: string;
  copiedLabel?: string;
  /** Copied to the clipboard by the contact button when no onContactClick is given. */
  email?: string;
  onContactClick?: MouseEventHandler<HTMLButtonElement>;
  /** Delay before the first piece rises on load, in ms. Default 400. */
  startDelayMs?: number;
}

const NEUTRAL_WORDMARK = [
  "M24 12a22 22 0 1 0 0.01 0Z",
  "M64 12h44v44H64Z",
  "M120 56l23-44 23 44Z",
  "M180 56a22 22 0 0 1 44 0Z",
  "M232 12h18v44h-18Z",
];

function defaultClock(date: Date): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Berlin",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).formatToParts(date);
  const pick = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const summer = pick("timeZoneName") === "GMT+2";
  return `${summer ? "CEST" : "CET"} ${pick("hour")}:${pick("minute")} ${pick("dayPeriod")}`;
}

const DEFAULT_LINKS: HeaderLink[] = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About", active: true },
];

export function MonoClockHeader({
  id,
  links = DEFAULT_LINKS,
  wordmarkPaths = NEUTRAL_WORDMARK,
  wordmarkViewBox = "0 0 251 68",
  homeHref = "#top",
  homeLabel = "Home",
  menuLabel = "Main navigation",
  compact = false,
  showClock = true,
  showContact = true,
  formatClock = defaultClock,
  contactLabel = "Contact",
  copiedLabel = "Copied",
  email,
  onContactClick,
  startDelayMs = 400,
}: MonoClockHeaderProps) {
  const [booted, setBooted] = useState(false);
  const [clock, setClock] = useState("");
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setBooted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!showClock) return;
    const tick = () => setClock(formatClock(new Date()));
    tick();
    const interval = window.setInterval(tick, 10_000);
    return () => window.clearInterval(interval);
  }, [showClock, formatClock]);

  useEffect(() => () => {
    if (timer.current !== null) window.clearTimeout(timer.current);
  }, []);

  const handleContact: MouseEventHandler<HTMLButtonElement> = (event) => {
    if (onContactClick) {
      onContactClick(event);
      return;
    }
    if (email && navigator.clipboard) navigator.clipboard.writeText(email).catch(() => {});
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  const slot = (n: number): CSSProperties => ({ ["--rk-d" as string]: `${startDelayMs + n * 60}ms` });
  const timeSlot = wordmarkPaths.length + links.length;

  return (
    <header id={id} className={`${styles.header} ${booted ? styles.booted : ""}`}>
      <a
        className={`${styles.title} ${compact ? styles.compact : ""}`}
        href={homeHref}
        aria-label={homeLabel}
      >
        <svg className={styles.wordmark} viewBox={wordmarkViewBox} fill="none" aria-hidden="true">
          {wordmarkPaths.map((d, i) => (
            <path key={i} d={d} fill="currentColor" style={slot(i)} />
          ))}
        </svg>
      </a>

      <div className={styles.right}>
        <nav className={styles.menu} aria-label={menuLabel}>
          {links.map((link, i) => (
            <a
              key={link.href}
              className={link.active ? styles.active : undefined}
              href={link.href}
              aria-current={link.active ? "page" : undefined}
              style={slot(wordmarkPaths.length + i)}
            >
              <span>{link.label}</span>
            </a>
          ))}
        </nav>

        <div className={styles.time}>{showClock ? <span style={slot(timeSlot)}>{clock}</span> : null}</div>

        <div className={styles.contactMask}>
          {showContact ? (
            <button type="button" className={styles.contact} onClick={handleContact} style={slot(timeSlot + 1)}>
              {copied ? copiedLabel : contactLabel}
            </button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
