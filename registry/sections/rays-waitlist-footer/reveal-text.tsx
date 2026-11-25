import type { CSSProperties } from "react";
import { MARK_INNER_PATH, MARK_OUTER_PATH } from "./rays-shaders";
import styles from "./styles.module.css";

interface RevealWordsProps {
  text: string;
  base: number;
  step?: number;
}

export function RevealWords({ text, base, step = 0.04 }: RevealWordsProps) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className={styles.w}
          style={{ animationDelay: `${(base + i * step).toFixed(2)}s` }}
        >
          {word}
          {i < words.length - 1 ? "\u00A0" : ""}
        </span>
      ))}
    </>
  );
}

export function RevealLetters({ text }: { text: string }) {
  return (
    <>
      {[...text].map((letter, i) => (
        <span key={i} className={styles.hl} style={{ "--i": i } as CSSProperties}>
          {letter === " " ? "\u00A0" : letter}
        </span>
      ))}
    </>
  );
}

export function BrandMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 26.6 25" fill="none" aria-hidden="true">
      <path fillRule="evenodd" clipRule="evenodd" d={MARK_OUTER_PATH} fill="currentColor" />
      <path d={MARK_INNER_PATH} fill="currentColor" />
      <circle cx="4.8" cy="4.4" r="1.7" fill="currentColor" />
      <circle cx="21.8" cy="20.6" r="1.7" fill="currentColor" />
    </svg>
  );
}

export function BrandWordmark({ name, className }: { name: string; className?: string }) {
  return (
    <span className={className}>
      <svg viewBox="0 0 26.6 25" width="19" height="18" fill="none" aria-hidden="true">
        <path fillRule="evenodd" clipRule="evenodd" d={MARK_OUTER_PATH} fill="currentColor" />
        <path d={MARK_INNER_PATH} fill="currentColor" />
      </svg>
      <span className={styles.wordmarkText}>{name}</span>
    </span>
  );
}
