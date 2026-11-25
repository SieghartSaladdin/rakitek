"use client";

import { memo, useEffect, useRef, useState, type CSSProperties } from "react";
import { startStatsPhysics } from "./stats-physics";
import { getMobileTileGradient, type StatColumn } from "./stats-textures";
import styles from "./styles.module.css";

export type { StatColumn } from "./stats-textures";

export interface PhysicsStatsPitProps {
  id?: string;
  label?: string;
  chapter?: string;
  headlineLines?: string[];
  body?: string;
  columns?: StatColumn[];
  embedded?: boolean;
  className?: string;
}

const DEFAULT_HEADLINE_LINES = ["Every habit", "leaves a trace."];

const DEFAULT_BODY =
  "Choose the part of your craft you want to grow, and every step you take piles up there. Vitality, clarity, craft, presence. Some land right where you aimed. Some surprise you. Either way, it compounds into real progress.";

const DEFAULT_COLUMNS: StatColumn[] = [
  { key: "VIT", label: "Vitality", target: 88, subtitle: "Daily energy and endurance" },
  { key: "CLR", label: "Clarity", target: 56, subtitle: "Focused thought and calm judgment" },
  { key: "CRF", label: "Craft", target: 68, subtitle: "Deliberate practice and skill depth" },
  { key: "PRS", label: "Presence", target: 76, subtitle: "Steady attention in every room" },
];

function PhysicsStatsPitBase({
  id,
  label = "About Metrics",
  chapter = "Chapter 06",
  headlineLines = DEFAULT_HEADLINE_LINES,
  body = DEFAULT_BODY,
  columns = DEFAULT_COLUMNS,
  embedded = false,
  className,
}: PhysicsStatsPitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const physicsCanvasRef = useRef<HTMLCanvasElement>(null);
  const gooCanvasRef = useRef<HTMLCanvasElement>(null);
  const labelCountRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const tileCountRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const gridRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef(false);
  const focusedRef = useRef(false);

  const [focused, setFocused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !el || typeof IntersectionObserver === "undefined") {
      visibleRef.current = true;
      focusedRef.current = true;
      setFocused(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
        const isFocused = entry.intersectionRatio >= 0.35;
        focusedRef.current = isFocused;
        setFocused(isFocused);
      },
      { threshold: [0, 0.04, 0.35, 0.4] },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobile || !gridRef.current) return;
    const grid = gridRef.current;
    const targets = columns.map((col) => Math.max(0, Math.min(100, col.target)));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      targets.forEach((value, idx) => {
        const el = tileCountRefs.current[idx];
        if (el) el.textContent = String(value);
      });
      return;
    }
    tileCountRefs.current.forEach((el) => {
      if (el) el.textContent = "0";
    });
    let started = false;
    let raf = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started) return;
        started = true;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - t0) / 1200);
          const eased = 1 - (1 - p) ** 3;
          for (let i = 0; i < targets.length; i++) {
            const el = tileCountRefs.current[i];
            if (el) el.textContent = String(Math.round(targets[i] * eased));
          }
          if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(grid);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [isMobile, columns]);

  useEffect(() => {
    if (isMobile) return;
    let cancelled = false;
    let stop: (() => void) | undefined;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    import("matter-js").then((mod) => {
      if (cancelled || !physicsCanvasRef.current || !gooCanvasRef.current) return;
      stop = startStatsPhysics(mod.default, {
        canvas: physicsCanvasRef.current,
        gooCanvas: gooCanvasRef.current,
        columns,
        visibleRef,
        focusedRef,
        countRefs: labelCountRefs,
        reducedMotion,
      });
    });
    return () => {
      cancelled = true;
      stop?.();
    };
  }, [isMobile, columns]);

  const colPercent = 100 / Math.max(1, columns.length);
  const sectionClasses = [styles.stats, embedded ? styles.embedded : "", focused ? styles.in : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} ref={sectionRef} className={sectionClasses}>
      <div className={styles.colontitle} aria-hidden="true">
        <span>{label}</span>
        <span className={styles.colontitleRight}>{chapter}</span>
      </div>
      {!embedded && <div className={styles.backdrop} aria-hidden="true" />}
      {!isMobile && <canvas ref={gooCanvasRef} className={styles.goo} aria-hidden="true" />}
      {!isMobile && <canvas ref={physicsCanvasRef} className={styles.canvas} aria-hidden="true" />}

      <h2 className={styles.head}>
        {headlineLines.map((line, idx) => (
          <span key={`${line}-${idx}`} className={styles.headMask}>
            <span className={styles.headLine}>{line}</span>
          </span>
        ))}
      </h2>
      <p className={styles.body}>{body}</p>

      <ul className={styles.srOnly}>
        {columns.map((column) => (
          <li key={column.key}>
            {column.label}: {column.target}
            {column.subtitle ? `, ${column.subtitle}.` : "."}
          </li>
        ))}
      </ul>

      {!isMobile && (
        <div className={styles.labels} aria-hidden="true">
          {columns.map((column, i) => (
            <div key={column.key} className={styles.label} style={{ left: `calc(${i * colPercent}% + 32px)` }}>
              <span className={styles.labelName}>{column.label}</span>
              <span
                className={styles.labelCount}
                ref={(el) => {
                  labelCountRefs.current[i] = el;
                }}
              >
                0
              </span>
            </div>
          ))}
        </div>
      )}

      {isMobile && (
        <div className={styles.grid} ref={gridRef}>
          {columns.map((column, i) => {
            const target = Math.max(0, Math.min(100, column.target));
            return (
              <div key={column.key} className={styles.tile}>
                <div
                  className={styles.tileFill}
                  style={{ backgroundImage: getMobileTileGradient(i), "--target": `${target}%` } as CSSProperties}
                />
                <div className={styles.tileLabel}>
                  <span className={styles.tileName}>{column.label}</span>
                  <span
                    className={styles.tileCount}
                    ref={(el) => {
                      tileCountRefs.current[i] = el;
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export const PhysicsStatsPit = memo(PhysicsStatsPitBase);
export default PhysicsStatsPit;
