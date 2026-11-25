"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./styles.module.css";

const EASE_SMOOTH = [0.32, 0.72, 0, 1] as const;
const REVEAL_HIDDEN = { opacity: 0, y: 40, filter: "blur(10px)" } as const;
const REVEAL_SHOWN = { opacity: 1, y: 0, filter: "blur(0px)" } as const;
const REVEAL_TRANSITION = { duration: 0.8, ease: EASE_SMOOTH } as const;
const REVEAL_STAGGER = 0.1;

const DEFAULT_LEAD = "96% of people admit running on autopilot";
const DEFAULT_COLUMNS: readonly [string, string] = [
  "That comes from a national survey of 3,000 respondents. It matches what we hear every week in interviews, forums, and chats.",
  "We are building a shared home for all of you. A space where you see how other members handled the same daily prompt, what surprised them, and what shifted. Real voices, moving at the very same pace.",
];

export interface SpotlightStatBandProps {
  id?: string;
  value?: number;
  suffix?: string;
  countDuration?: number;
  lead?: string;
  columns?: readonly [string, string];
  className?: string;
}

function useCountUp(
  target: number,
  seconds: number,
  active: boolean,
  instant: boolean,
): number {
  const [display, setDisplay] = useState(instant ? target : 0);
  const completed = useRef(false);

  useEffect(() => {
    if (instant || completed.current) {
      setDisplay(target);
      return;
    }
    if (!active) return;
    const durationMs = Math.max(seconds, 0.1) * 1000;
    const startTime = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3;
      setDisplay(Math.round(eased * target));
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        completed.current = true;
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active, target, seconds, instant]);

  return display;
}

export function SpotlightStatBand({
  id,
  value = 96,
  suffix = "%",
  countDuration = 2,
  lead = DEFAULT_LEAD,
  columns = DEFAULT_COLUMNS,
  className,
}: SpotlightStatBandProps) {
  const reducedMotion = useReducedMotion();
  const instant = Boolean(reducedMotion);
  const sectionRef = useRef<HTMLElement | null>(null);
  const numberRef = useRef<HTMLSpanElement | null>(null);
  const [visible, setVisible] = useState(instant);
  const count = useCountUp(value, countDuration, visible, instant);

  useEffect(() => {
    const node = sectionRef.current;
    if (instant || !node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [instant]);

  const handleMouseMove = useCallback((event: MouseEvent<HTMLSpanElement>) => {
    const element = numberRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    element.style.setProperty("--spot-x", `${x}%`);
    element.style.setProperty("--spot-y", `${y}%`);
  }, []);

  const handleMouseLeave = useCallback(() => {
    const element = numberRef.current;
    if (!element) return;
    element.style.setProperty("--spot-x", "-100%");
    element.style.setProperty("--spot-y", "-100%");
  }, []);

  const reveal = (step: number) =>
    instant ? { duration: 0 } : { ...REVEAL_TRANSITION, delay: REVEAL_STAGGER * step };

  const rootClass = className ? `${styles.section} ${className}` : styles.section;

  return (
    <section id={id} ref={sectionRef} className={rootClass}>
      <motion.div
        className={styles.numberWrap}
        initial={instant ? false : { opacity: 0, scale: 0.95, filter: "blur(16px)" }}
        animate={visible ? { opacity: 1, scale: 1, filter: "blur(0px)" } : {}}
        transition={instant ? { duration: 0 } : { duration: 1.2, ease: EASE_SMOOTH }}
      >
        <span
          ref={numberRef}
          className={styles.bigNumber}
          aria-label={`${value}${suffix}`}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {count}
          {suffix}
        </span>
      </motion.div>

      <motion.div
        className={styles.divider}
        aria-hidden="true"
        initial={instant ? false : { scaleX: 0, opacity: 0 }}
        animate={visible ? { scaleX: 1, opacity: 0.12 } : {}}
        transition={instant ? { duration: 0 } : { duration: 1, delay: 0.3, ease: EASE_SMOOTH }}
      />

      <div className={styles.textRow}>
        <motion.p
          className={styles.colText}
          initial={instant ? false : REVEAL_HIDDEN}
          animate={visible ? REVEAL_SHOWN : {}}
          transition={reveal(4)}
        >
          {lead}
        </motion.p>
        <motion.p
          className={styles.colText}
          initial={instant ? false : REVEAL_HIDDEN}
          animate={visible ? REVEAL_SHOWN : {}}
          transition={reveal(5)}
        >
          {columns[0]}
        </motion.p>
        <motion.p
          className={styles.colText}
          initial={instant ? false : REVEAL_HIDDEN}
          animate={visible ? REVEAL_SHOWN : {}}
          transition={reveal(6)}
        >
          {columns[1]}
        </motion.p>
      </div>
    </section>
  );
}
