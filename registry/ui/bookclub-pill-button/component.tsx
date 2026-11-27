"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./styles.module.css";

export interface BookclubPillButtonProps {
  label?: string;
  href?: string;
  external?: boolean;
  active?: boolean;
  showEars?: boolean;
  size?: "base" | "menu";
  tone?: "pale-yellow" | "soft-pink" | "soft-blue";
  asButton?: boolean;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

const TONE_CLASS: Record<NonNullable<BookclubPillButtonProps["tone"]>, string> = {
  "pale-yellow": "",
  "soft-pink": styles.toneSoftPink,
  "soft-blue": styles.toneSoftBlue,
};

export function BookclubPillButton({
  label = "All Books",
  href = "#books",
  external = false,
  active = false,
  showEars = true,
  size = "base",
  tone = "pale-yellow",
  asButton = false,
  className = "",
  onClick,
}: BookclubPillButtonProps) {
  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    const textEl = textRef.current;
    if (!el || !textEl) return;
    gsap.registerPlugin(SplitText);
    const mm = gsap.matchMedia();
    mm.add("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
      const split = new SplitText(textEl, { type: "chars", tag: "span" });
      const chars = [...split.chars];
      gsap.set(chars, { display: "inline-block", transformOrigin: "center center", willChange: "transform" });
      const tl = gsap.timeline({ paused: true }).to(chars, {
        keyframes: {
          "0%": { yPercent: 0, scaleY: 1, rotate: 0 },
          "20%": { yPercent: 55, scaleY: 0.3, rotate: 17, ease: "power2.in" },
          "100%": { yPercent: 0, scaleY: 1, rotate: 0, ease: "elastic.out(1,0.4)" },
        },
        duration: 0.725,
        stagger: { amount: 0.225 },
      });
      const pause = () => {
        tl.pause();
        gsap.to(chars, { yPercent: 0, scaleY: 1, rotate: 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      };
      const onEnter = () => tl.restart();
      const onFocusIn = () => { if (el.matches(":focus-visible")) tl.restart(); };
      const onFocusOut = () => { if (!el.matches(":hover")) pause(); };
      el.addEventListener("mouseenter", onEnter);
      el.addEventListener("mouseleave", pause);
      el.addEventListener("focusin", onFocusIn);
      el.addEventListener("focusout", onFocusOut);
      return () => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", pause);
        el.removeEventListener("focusin", onFocusIn);
        el.removeEventListener("focusout", onFocusOut);
        tl.kill();
        split.revert();
      };
    });
    return () => mm.revert();
  }, [label]);

  const cls = [
    styles.pill,
    showEars ? styles.withEars : "",
    size === "menu" ? styles.menuSize : "",
    TONE_CLASS[tone],
    className,
  ].filter(Boolean).join(" ");

  const inner = (
    <>
      <span className={styles.bg} />
      <span className={styles.inner}>
        <span ref={textRef} className={styles.text}>
          {label}
        </span>
      </span>
    </>
  );

  if (asButton) {
    return (
      <button
        ref={rootRef as React.RefObject<HTMLButtonElement>}
        type="button"
        aria-current={active ? "page" : undefined}
        className={cls}
        onClick={onClick}
      >
        {inner}
      </button>
    );
  }

  return (
    <a
      ref={rootRef as React.RefObject<HTMLAnchorElement>}
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-current={active ? "page" : undefined}
      className={cls}
      onClick={onClick}
    >
      {inner}
    </a>
  );
}
