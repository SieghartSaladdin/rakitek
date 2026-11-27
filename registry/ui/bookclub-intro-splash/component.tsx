"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import styles from "./styles.module.css";

export interface BookclubIntroSplashProps {
  id?: string;
  /** Mark that pops in over the sweeping blob. Defaults to a neutral ring with an open book. */
  logo?: ReactNode;
  /** Announced to assistive tech while the intro runs. Leave empty to hide the overlay from them. */
  label?: string;
  /** Set to false to render nothing (no overlay, no animation). */
  show?: boolean;
  /** Seconds to wait before the sweep starts. */
  delay?: number;
  /** 1 is the original pace (about 1.65s); 2 plays twice as fast. */
  speed?: number;
  /** Skip the animation (and the overlay) when the visitor prefers reduced motion. */
  respectReducedMotion?: boolean;
  /** Keep the finished, invisible overlay in the DOM instead of removing it. */
  holdAfterDone?: boolean;
  /** Safety net: remove the overlay after this many milliseconds even if the animation never finishes. */
  failSafeMs?: number;
  className?: string;
  onComplete?: () => void;
}

const BLOB_PATH =
  "M66.858-19C57.597 196.452 127.164 482.585 206.5 464.5c125.428-28.592 52.293-293.51 200.001-339 568.234-175-241.425 712.6 15.5 803.02C645 1007 629.398 499 810.5 499c113.398 0 106.54 189.465 164.235 429.52 48.005 199.72 89.415 213.09 105.265 173.78";

function DefaultLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 300 300" width="100%" aria-hidden="true" className={styles.logoSvg}>
      <circle cx="150" cy="150" r="136" stroke="currentColor" strokeWidth="20" />
      <path fill="currentColor" d="M150 118c-20-16-48-18-70-10v102c22-8 50-6 70 10 20-16 48-18 70-10V108c-22-8-50-6-70 10Zm-10 14v68c-12-5-26-7-40-6v-68c14-1 28 1 40 6Z" />
    </svg>
  );
}

export function BookclubIntroSplash({
  id,
  logo,
  label = "",
  show = true,
  delay = 0,
  speed = 1,
  respectReducedMotion = true,
  holdAfterDone = false,
  failSafeMs = 6000,
  className = "",
  onComplete,
}: BookclubIntroSplashProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const root = rootRef.current;
    if (!show || !root) return;
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setDone(true);
      completeRef.current?.();
    };
    if (respectReducedMotion && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      finish();
      return;
    }
    gsap.registerPlugin(DrawSVGPlugin);
    const path = root.querySelectorAll("svg path[data-splash-blob]");
    const logoEl = root.querySelectorAll("[data-splash-logo]");
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ delay, paused: true, onComplete: finish });
      tl.timeScale(Math.max(speed, 0.01));
      tl.set(path, { drawSVG: "0% 100%" });
      tl.set(logoEl, { scale: 0, rotate: -64, autoAlpha: 0 });
      tl.to(path, { keyframes: { "95%": { strokeWidth: "8%", ease: "circ.out" }, "100%": { drawSVG: "100% 100%" } }, duration: 1.25, delay: 0.4 }, "start");
      tl.to(logoEl, { scale: 1, rotate: 0, autoAlpha: 1, delay: 0.05, duration: 0.65, ease: "elastic.out(1,0.72)" }, "start");
      tl.to(logoEl, { scale: 0, rotate: 64, autoAlpha: 0, delay: 0.45, duration: 0.55, ease: "elastic.in(1,0.72)" }, "start");
      const start = () => tl.play();
      if (document.fonts?.ready) document.fonts.ready.then(start);
      else start();
    }, root);
    const failSafe = window.setTimeout(finish, failSafeMs);
    return () => {
      window.clearTimeout(failSafe);
      ctx.revert();
    };
  }, [show, delay, speed, respectReducedMotion, failSafeMs]);

  if (!show || (done && !holdAfterDone)) return null;

  return (
    <div
      ref={rootRef}
      id={id}
      data-rk-intro-splash=""
      data-state={done ? "done" : "playing"}
      role={label ? "status" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={[styles.transition, respectReducedMotion ? styles.respectMotion : "", className].filter(Boolean).join(" ")}
    >
      <div className={styles.shape}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1080 1080" fill="none" preserveAspectRatio="none" className={styles.svg}>
          <path data-splash-blob="" d={BLOB_PATH} stroke="currentColor" strokeWidth="70%" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div data-splash-logo="" className={styles.logo}>
        {logo ?? <DefaultLogo />}
      </div>
    </div>
  );
}
