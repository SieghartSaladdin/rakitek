"use client";

import {
  createElement,
  Fragment,
  useEffect,
  useRef,
  type CSSProperties,
  type ElementType,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import styles from "./styles.module.css";

export interface LineRevealProps extends HTMLAttributes<HTMLElement> {
  /** Element to render. Default "div". */
  as?: ElementType;
  id?: string;
  className?: string;
  /** Extra start delay in steps of 100ms (the original "mo-ln-X-Y" X). Default 0. */
  startStep?: number;
  /** Delay between rendered lines in ms. Default 60, or 100 for h1. */
  lineGapMs?: number;
  children?: ReactNode;
  href?: string;
  target?: string;
  rel?: string;
}

function lineIndexes(items: HTMLElement[]): number[] {
  const out: number[] = [];
  let line = -1;
  let lastTop = -Infinity;
  for (const el of items) {
    const top = Math.round(el.getBoundingClientRect().top);
    if (top > lastTop + 2) {
      line += 1;
      lastTop = top;
    }
    out.push(line);
  }
  return out;
}

function schedule(block: HTMLElement, baseDelay: number, startMs: number, gap: number) {
  const items = Array.from(block.querySelectorAll<HTMLElement>("[data-rk-line], [data-rk-word]"));
  const lines = lineIndexes(items);
  items.forEach((el, i) => {
    el.style.setProperty("--rk-d", `${Math.round(baseDelay + startMs + lines[i] * gap)}ms`);
  });
  const last = lines.length ? lines[lines.length - 1] : 0;
  block.querySelectorAll<HTMLElement>("[data-rk-rule]").forEach((rule) => {
    rule.style.setProperty("--rk-d", `${Math.round(baseDelay + startMs + last * gap)}ms`);
  });
}

/**
 * Scroll-triggered text reveal. Children built from RevealWords and RevealLine rise out of
 * their masks, one rendered line after another, when the block first enters the viewport.
 */
export function LineReveal({
  as = "div",
  className,
  startStep = 0,
  lineGapMs,
  children,
  ...rest
}: LineRevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const gap = lineGapMs ?? (as === "h1" ? 100 : 60);

  useEffect(() => {
    const block = ref.current;
    if (!block) return;
    const show = (baseDelay: number) => {
      schedule(block, baseDelay, startStep * 100, gap);
      block.dataset.rkIn = "true";
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      block.dataset.rkIn = "true";
      return;
    }
    const rect = block.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      show(200 + (Math.max(0, rect.top) / window.innerHeight) * 400);
      return;
    }
    const io = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        io.disconnect();
        show(0);
      }
    });
    io.observe(block);
    return () => io.disconnect();
  }, [gap, startStep]);

  return createElement(
    as,
    { ...rest, ref, className: className ? `${styles.block} ${className}` : styles.block },
    children,
  );
}

export interface RevealWordsProps {
  text: string;
}

/** Splits a string into masked words so a LineReveal can lift them line by line. */
export function RevealWords({ text }: RevealWordsProps) {
  return (
    <>
      {text.split(/(\s+)/).map((part, i) =>
        part === "" ? null : /^\s+$/.test(part) ? (
          <Fragment key={i}>{part}</Fragment>
        ) : (
          <span key={i} className={styles.wordMask}>
            <span className={styles.word} data-rk-word="">
              {part}
            </span>
          </span>
        ),
      )}
    </>
  );
}

export interface RevealLineProps {
  /** Mask element. Default "span". */
  as?: "span" | "div" | "li";
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  /** Renders the inner line as a link. */
  link?: { href: string; target?: string; rel?: string; className?: string };
}

/** One masked line of text (a heading, a list entry) that rises with its LineReveal block. */
export function RevealLine({ as = "span", className, style, children, link }: RevealLineProps) {
  const mask = className ? `${styles.mask} ${className}` : styles.mask;
  const inner = link ? (
    <a
      className={link.className ? `${styles.line} ${link.className}` : styles.line}
      data-rk-line=""
      href={link.href}
      target={link.target}
      rel={link.rel}
    >
      {children}
    </a>
  ) : (
    <span className={styles.line} data-rk-line="">
      {children}
    </span>
  );
  return createElement(as, { className: mask, style }, inner);
}
