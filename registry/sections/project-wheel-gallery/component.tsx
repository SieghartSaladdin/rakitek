"use client";

import { useEffect, useRef, useState } from "react";
import { MonoUnderlineLink } from "@registry/ui/mono-underline-link/component";
import { LineReveal, RevealLine, RevealWords } from "@registry/ui/mono-line-reveal/component";
import styles from "./styles.module.css";

export interface WheelGalleryItem {
  src: string;
  alt: string;
}

export interface ProjectWheelGalleryProps {
  id?: string;
  title?: string;
  /** Short lines under the title: category, role, year. */
  details?: string[];
  externalLink?: { href: string; label: string };
  backLink?: { href: string; label: string };
  items?: WheelGalleryItem[];
  galleryLabel?: string;
  /** Stage width over height of every frame. Default 1.6. */
  frameRatio?: number;
  /** Pixels of wheel travel per frame. Default 500. */
  wheelTravel?: number;
  /** Also scroll the gallery with arrow keys and the space bar. Default true. */
  captureKeys?: boolean;
}

const PHOTOS = [
  "photo-1486406146926-c627a92ad1ab",
  "photo-1518005020951-eccb494ad742",
  "photo-1497366216548-37526070297c",
  "photo-1497366754035-f200968a6e72",
  "photo-1494438639946-1ebd1d20bf85",
];

const DEFAULT_ITEMS: WheelGalleryItem[] = PHOTOS.map((photo, i) => ({
  src: `https://images.unsplash.com/${photo}?w=1200&h=750&q=80&auto=format&fit=crop`,
  alt: `Project frame ${i + 1}.`,
}));

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);
const wrap = (v: number, n: number) => ((v % n) + n) % n;
const outExpo = (t: number) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));

export function ProjectWheelGallery({
  id,
  title = "Atlas House",
  details = ["Architecture, Furniture", "Creative Direction, Web Design/Dev"],
  externalLink = { href: "#live", label: "Live Website" },
  backLink = { href: "#work", label: "Back" },
  items = DEFAULT_ITEMS,
  galleryLabel = "Project gallery",
  frameRatio = 1.6,
  wheelTravel = 500,
  captureKeys = true,
}: ProjectWheelGalleryProps) {
  const rootRef = useRef<HTMLElement | null>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const [stacked, setStacked] = useState(false);
  const total = items.length;

  useEffect(() => {
    const check = () => setStacked(window.innerWidth <= 842);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (stacked || !root) return;
    const push = (delta: number) => {
      target.current += delta / wheelTravel;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      push(e.deltaY);
    };
    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0]?.clientY ?? 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0]?.clientY ?? touchY;
      push((touchY - y) * 1.4);
      touchY = y;
    };
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      let delta = 0;
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") delta = -100;
      else if (e.key === "ArrowDown" || e.key === "ArrowRight") delta = 100;
      else if (e.key === " ") delta = (window.innerHeight - 40) * (e.shiftKey ? -1 : 1);
      if (delta === 0) return;
      e.preventDefault();
      push(delta);
    };
    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: true });
    if (captureKeys) window.addEventListener("keydown", onKey);
    return () => {
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
    };
  }, [stacked, wheelTravel, captureKeys]);

  useEffect(() => {
    if (stacked) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const next = current.current + (target.current - current.current) * 0.09;
      current.current = Math.abs(next - target.current) < 0.0005 ? target.current : next;
      const elapsed = reduced ? Infinity : performance.now() - start;
      items.forEach((_, i) => {
        const el = cards.current[i];
        if (!el) return;
        let rel = i - wrap(current.current, total);
        if (rel > total / 2) rel -= total;
        if (rel < -total / 2) rel += total;
        const dist = Math.abs(rel);
        if (dist > 3.2) {
          el.style.opacity = "0";
          el.style.pointerEvents = "none";
          return;
        }
        const pairDelay = Math.max(0, 3 - Math.round(dist)) * 80;
        const enter = outExpo(clamp((elapsed - pairDelay) / 1200, 0, 1));
        el.style.pointerEvents = "auto";
        el.style.width = `${(clamp(1 - 0.3 * dist * 0.58, 0.85, 1) * 100).toFixed(2)}%`;
        el.style.top = `${(50 + rel * 58).toFixed(2)}%`;
        el.style.transform = `translate3d(${((1 - enter) * el.offsetWidth).toFixed(1)}px, -50%, 0)`;
        el.style.opacity = clamp(1 - dist * 0.15, 0.25, 1).toFixed(3);
        el.style.zIndex = String(Math.round(20 - dist * 3));
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [stacked, total, items]);

  return (
    <section id={id} ref={rootRef} className={styles.root} aria-label={title}>
      {backLink ? (
        <LineReveal as="div" className={styles.back}>
          <MonoUnderlineLink href={backLink.href} label={backLink.label} />
        </LineReveal>
      ) : null}

      <div className={styles.info}>
        <LineReveal as="h1" className={styles.title}>
          <RevealLine>{title}</RevealLine>
        </LineReveal>
        <LineReveal as="div" className={styles.meta}>
          {details.map((line, i) => (
            <h2 key={i}>
              <RevealWords text={line} />
            </h2>
          ))}
          {externalLink ? (
            <div className={styles.external}>
              <MonoUnderlineLink href={externalLink.href} label={externalLink.label} target="_blank" />
            </div>
          ) : null}
        </LineReveal>
      </div>

      <div className={styles.gallery} aria-label={galleryLabel}>
        {items.map((item, i) => (
          <div
            key={`${item.src}-${i}`}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className={styles.card}
            style={stacked ? undefined : { aspectRatio: `${frameRatio} / 1` }}
          >
            <img src={item.src} alt={item.alt} loading={i < 3 ? "eager" : "lazy"} />
          </div>
        ))}
      </div>
    </section>
  );
}
