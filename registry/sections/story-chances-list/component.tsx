"use client";

import { useEffect, useRef, useState } from "react";
import { CREST_MASK_URL, CREST_PATTERNS, DEFAULT_STORY_IMAGES } from "./artwork";
import styles from "./styles.module.css";

export interface StoryChanceItem {
  title: string;
  description: string;
  imageUrl?: string;
  imageAlt?: string;
}

export interface StoryChancesListProps {
  id?: string;
  label?: string;
  chapter?: string;
  headlineTopPrefix?: string;
  headlineTopSuffix?: string;
  headlineBottom?: string;
  subtitle?: string;
  itemPrefix?: string;
  items?: StoryChanceItem[];
  crestPatterns?: string[];
  className?: string;
}

const DEFAULT_ITEMS: StoryChanceItem[] = [
  {
    title: "To linger at a new table.",
    description:
      "You stepped out for one brief errand. Hours later you are trading stories with people you had never met at noon.",
  },
  {
    title: "To walk an empty street.",
    description:
      "Nobody watching, nothing to broadcast. Just quiet air in a corner of the city you seldom see at this hour.",
  },
  {
    title: "To notice the hidden doorway.",
    description:
      "A lane you pass every Tuesday. A courtyard you never tried. It has been waiting around the corner all along.",
  },
  {
    title: "To see the hard part vanish.",
    description:
      "The task you postponed for a month took four minutes in practice. After that, the weight simply disappeared.",
  },
  {
    title: "To return with a real story.",
    description:
      "Not a saved post or a clipped frame. An afternoon that actually unfolded while you were standing right in it.",
  },
];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function isCoarsePointer(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
}

export function StoryChancesList({
  id,
  label = "About Journey",
  chapter = "Chapter 03",
  headlineTopPrefix = "It starts as one",
  headlineTopSuffix = "step.",
  headlineBottom = "It rarely stays small.",
  subtitle = "No promises. Just what tends to unfold once you begin.",
  itemPrefix = "A chance",
  items = DEFAULT_ITEMS,
  crestPatterns = CREST_PATTERNS,
  className,
}: StoryChancesListProps) {
  const headRef = useRef<HTMLHeadingElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [headInView, setHeadInView] = useState(false);
  const [activeCrest, setActiveCrest] = useState(0);

  // Trigger headline entry animation when in view
  useEffect(() => {
    const el = headRef.current;
    if (prefersReducedMotion() || !el || typeof IntersectionObserver === "undefined") {
      setHeadInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setHeadInView(true);
      },
      { threshold: 0.25 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Rotate masked crest pattern every 1.4s while visible
  useEffect(() => {
    if (prefersReducedMotion() || !headInView || crestPatterns.length <= 1) return;
    const timer = window.setInterval(() => {
      setActiveCrest((prev) => (prev + 1) % crestPatterns.length);
    }, 1400);
    return () => window.clearInterval(timer);
  }, [headInView, crestPatterns.length]);

  // Reveal each row (--rp: 1) via IntersectionObserver
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const rows = Array.from(list.children) as HTMLElement[];

    if (prefersReducedMotion() || typeof IntersectionObserver === "undefined") {
      rows.forEach((row) => row.style.setProperty("--rp", "1"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).style.setProperty("--rp", "1");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12 },
    );

    rows.forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [items.length]);

  // Smooth pointer-proximity horizontal parallax on row photos
  useEffect(() => {
    const list = listRef.current;
    if (!list || isCoarsePointer() || prefersReducedMotion()) return;

    let mouseX = -1;
    let mouseY = -1;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    const offsets: number[] = [];
    let rafId = 0;

    const frame = () => {
      const rect = list.getBoundingClientRect();
      const visible = rect.bottom > 0 && rect.top < window.innerHeight;
      for (let i = 0; i < list.children.length; i++) {
        const photo = list.children[i].children[1] as HTMLElement | undefined;
        if (!photo) continue;
        let target = 0;
        if (visible && mouseX >= 0) {
          const box = photo.getBoundingClientRect();
          const cx = box.left + box.width / 2;
          const cy = box.top + box.height / 2;
          const falloff = 1 / (1 + ((mouseY - cy) / 140) ** 2);
          target = Math.max(-60, Math.min(60, (mouseX - cx) * 0.16)) * falloff;
        }
        offsets[i] = (offsets[i] ?? 0) + (target - (offsets[i] ?? 0)) * 0.12;
        photo.style.transform = `translateX(${offsets[i].toFixed(1)}px)`;
      }
      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafId);
    };
  }, [items.length]);

  const sectionClass = [styles.section, className ?? ""].filter(Boolean).join(" ");

  return (
    <section id={id} className={sectionClass}>
      <div className={styles.colontitle} aria-hidden="true">
        <span>{label}</span>
        <span className={styles.colontitleRight}>{chapter}</span>
      </div>
      <div className={styles.inner}>
        <h2 ref={headRef} className={`${styles.head} ${headInView ? styles.headIn : ""}`}>
          <span className={styles.headLine}>
            {headlineTopPrefix}{" "}
            <span className={styles.questWrap}>
              <span
                className={styles.crest}
                aria-hidden="true"
                style={{ WebkitMaskImage: CREST_MASK_URL, maskImage: CREST_MASK_URL }}
              >
                {crestPatterns.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt=""
                    width={160}
                    height={158}
                    decoding="async"
                    style={{
                      opacity: i === activeCrest ? 1 : 0,
                      transform: i === activeCrest ? "translateY(0)" : "translateY(45%)",
                    }}
                  />
                ))}
              </span>
              {"\u00A0"}
              {headlineTopSuffix}
            </span>
          </span>
          <span className={styles.headLine}>{headlineBottom}</span>
        </h2>
        <p className={styles.sub}>{subtitle}</p>
        <div className={styles.list} ref={listRef}>
          {items.map((item, i) => {
            const imgSrc =
              item.imageUrl ?? DEFAULT_STORY_IMAGES[i % DEFAULT_STORY_IMAGES.length];
            return (
              <div key={`${item.title}-${i}`} className={styles.row}>
                <div className={styles.itemLeft}>
                  <div>
                    <p className={styles.itemLabel}>{itemPrefix}</p>
                    <p className={styles.itemTitle}>{item.title}</p>
                  </div>
                  <p className={styles.itemNum}>{String(i + 1).padStart(2, "0")}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.itemPhoto}
                  src={imgSrc}
                  alt={item.imageAlt ?? ""}
                  aria-hidden={item.imageAlt ? undefined : true}
                  width={600}
                  height={400}
                  loading="lazy"
                  decoding="async"
                />
                <p className={styles.itemDesc}>{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
