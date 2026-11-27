"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import styles from "./styles.module.css";

export interface BookclubBouncyCtaProps {
  label?: string;
  href?: string;
  external?: boolean;
  variant?: "base" | "small" | "big";
  tone?: "magenta" | "orange" | "white" | "soft-pink";
  icon?: "arrow" | "hamburger" | "close";
  hideText?: boolean;
  menuToggle?: boolean;
  asDiv?: boolean;
  asButton?: boolean;
  type?: "button" | "submit" | "reset";
  ariaLabel?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

function renderIcon(icon: "arrow" | "hamburger" | "close", isAnchor: boolean, menuToggle: boolean) {
  if (icon === "hamburger") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.iconMenu}>
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 6h10M4 12h16H7m0 6h10" />
      </svg>
    );
  }
  if (icon === "close") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={styles.iconMenu}>
        <path fill="currentColor" d="m12 13.4-4.9 4.9a.95.95 0 0 1-.7.275.95.95 0 0 1-.7-.275.95.95 0 0 1-.275-.7q0-.425.275-.7l4.9-4.9-4.9-4.9a.95.95 0 0 1-.275-.7q0-.425.275-.7a.95.95 0 0 1 .7-.275q.425 0 .7.275l4.9 4.9 4.9-4.9a.95.95 0 0 1 .7-.275q.425 0 .7.275a.95.95 0 0 1 .275.7.95.95 0 0 1-.275.7L13.4 12l4.9 4.9a.95.95 0 0 1 .275.7.95.95 0 0 1-.275.7.95.95 0 0 1-.7.275.95.95 0 0 1-.7-.275z" />
      </svg>
    );
  }
  const iconCls = [
    menuToggle ? styles.iconMenu : styles.icon,
    isAnchor ? styles.anchorIcon : "",
  ].filter(Boolean).join(" ");
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 13" fill="none" aria-hidden="true" className={iconCls}>
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  );
}

const TONE_CLASS: Record<NonNullable<BookclubBouncyCtaProps["tone"]>, string> = {
  magenta: "",
  orange: styles.toneOrange,
  white: styles.toneWhite,
  "soft-pink": styles.toneSoftPink,
};

export function BookclubBouncyCta({
  label = "Log-in / Sign-up now",
  href,
  external = false,
  variant = "base",
  tone = "magenta",
  icon = "arrow",
  hideText = false,
  menuToggle = false,
  asDiv = false,
  asButton = false,
  type = "button",
  ariaLabel,
  className = "",
  onClick,
}: BookclubBouncyCtaProps) {
  const rootRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    const textEl = textRef.current;
    if (!el || !textEl || hideText) return;
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
      const hoverRoot = el.closest<HTMLElement>("[data-hover]") || el;
      const pause = () => {
        tl.pause();
        gsap.to(chars, { yPercent: 0, scaleY: 1, rotate: 0, duration: 0.2, ease: "power2.out", overwrite: "auto" });
      };
      const onEnter = () => tl.restart();
      const onFocusIn = () => { if (hoverRoot.matches(":focus-visible")) tl.restart(); };
      const onFocusOut = () => { if (!hoverRoot.matches(":hover")) pause(); };
      hoverRoot.addEventListener("mouseenter", onEnter);
      hoverRoot.addEventListener("mouseleave", pause);
      hoverRoot.addEventListener("focusin", onFocusIn);
      hoverRoot.addEventListener("focusout", onFocusOut);
      return () => {
        hoverRoot.removeEventListener("mouseenter", onEnter);
        hoverRoot.removeEventListener("mouseleave", pause);
        hoverRoot.removeEventListener("focusin", onFocusIn);
        hoverRoot.removeEventListener("focusout", onFocusOut);
        tl.kill();
        split.revert();
      };
    });
    return () => mm.revert();
  }, [label, hideText]);

  const cls = [
    styles.btn,
    variant === "small" ? styles.small : variant === "big" ? styles.big : "",
    menuToggle ? styles.menuToggle : "",
    TONE_CLASS[tone],
    className,
  ].filter(Boolean).join(" ");

  const isAnchor = Boolean(href?.startsWith("#"));
  const inner = (
    <>
      {!hideText ? (
        <span className={styles.textWrap}>
          <span className={styles.bg} />
          <span className={styles.textOuter}>
            <span ref={textRef} className={styles.text}>
              {label}
            </span>
          </span>
        </span>
      ) : null}
      <span className={styles.iconWrap}>
        <span className={styles.bg} />
        <span className={styles.iconOuter}>
          {renderIcon(icon, isAnchor, menuToggle)}
        </span>
      </span>
    </>
  );

  if (asDiv) {
    return (
      <div ref={rootRef as React.RefObject<HTMLDivElement>} data-rk-bouncy-cta="" className={cls} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </div>
    );
  }
  if (asButton || !href) {
    return (
      <button ref={rootRef as React.RefObject<HTMLButtonElement>} type={type} data-rk-bouncy-cta="" className={cls} aria-label={ariaLabel} onClick={onClick}>
        {inner}
      </button>
    );
  }
  return (
    <a
      ref={rootRef as React.RefObject<HTMLAnchorElement>}
      data-rk-bouncy-cta=""
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      aria-label={ariaLabel}
      className={cls}
      onClick={onClick}
    >
      {inner}
    </a>
  );
}
