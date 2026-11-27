"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { MonoUnderlineLink } from "@registry/ui/mono-underline-link/component";
import styles from "./styles.module.css";

export interface MonoStudioNoteProps {
  id?: string;
  ariaLabel?: string;
  /** Statement lines, one rendered line each, rising 60ms apart. */
  lines?: string[];
  contactLabel?: string;
  /** Link text under the contact label, usually an email address. */
  linkLabel?: string;
  linkHref?: string;
  showContact?: boolean;
  /** Lines rise in while true and leave upward when it turns false. Default true. */
  visible?: boolean;
  /** Pins the note to the right grid columns under the header (position: fixed). Default true. */
  fixed?: boolean;
  /** Delay before the first line rises, in ms. Default 0. */
  startDelayMs?: number;
  className?: string;
}

const DEFAULT_LINES = [
  "The studio is shaped by people who care",
  "deeply about design and the process behind.",
  "Each project becomes a case study and a",
  "meaningful part of our portfolio, developed",
  "with care and attention.",
];

type State = "hidden" | "in" | "out";

const delay = (ms: number): CSSProperties => ({ ["--rk-d" as string]: `${ms}ms` });

/**
 * Short studio statement with a contact link, pinned beside the header. Lines rise 1.4s
 * expo-out 60ms apart, the link underline draws in after 560ms and wipes out on hover.
 */
export function MonoStudioNote({
  id,
  ariaLabel = "Studio overview",
  lines = DEFAULT_LINES,
  contactLabel = "Contact:",
  linkLabel = "hello@studio.com",
  linkHref = "mailto:hello@studio.com",
  showContact = true,
  visible = true,
  fixed = true,
  startDelayMs = 0,
  className,
}: MonoStudioNoteProps) {
  const [state, setState] = useState<State>("hidden");
  const shown = useRef(false);

  useEffect(() => {
    if (!visible) {
      if (shown.current) setState("out");
      return;
    }
    const frame = requestAnimationFrame(() => {
      shown.current = true;
      setState("in");
    });
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  const root = [styles.note, fixed ? styles.fixed : "", className ?? ""].filter(Boolean).join(" ");
  const n = lines.length;

  return (
    <aside
      id={id}
      className={root}
      aria-label={ariaLabel}
      data-state={state}
      style={{ ["--rk-start" as string]: `${startDelayMs}ms` }}
    >
      <div className={styles.statement}>
        {lines.map((text, i) => (
          <span key={i} className={styles.mask}>
            <span className={styles.line} data-rk-line="" style={delay(i * 60)}>
              {text}
            </span>
          </span>
        ))}
      </div>
      {showContact ? (
        <div>
          <span className={styles.mask}>
            <span className={styles.line} data-rk-line="" style={delay(n * 60)}>
              {contactLabel}
            </span>
          </span>
          <span className={styles.linkSlot} style={delay((n + 1) * 60)}>
            <MonoUnderlineLink href={linkHref} label={linkLabel} />
          </span>
        </div>
      ) : null}
    </aside>
  );
}
