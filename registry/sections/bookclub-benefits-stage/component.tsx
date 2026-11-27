"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BenefitsBackgroundSvg } from "./bg-svg";
import styles from "./styles.module.css";

export interface BookclubBenefitPill {
  position: "first" | "second" | "third" | "fourth" | "fifth";
  tone?: "magenta" | "orange" | "periwinkle" | "cyan" | "olive";
  lines: string[];
}

export interface BookclubBenefitsStageProps {
  id?: string;
  heading?: string;
  headingImageSrc?: string;
  headingImageAlt?: string;
  emblemImageSrc?: string;
  emblemAlt?: string;
  pills?: BookclubBenefitPill[];
  className?: string;
}

const DEFAULT_PILLS: BookclubBenefitPill[] = [
  { position: "first", tone: "magenta", lines: ["Range of genres"] },
  { position: "second", tone: "orange", lines: ["Free shipping"] },
  { position: "third", tone: "periwinkle", lines: ["Affordable"] },
  { position: "fourth", tone: "cyan", lines: ["High quality ", "hardcovers"] },
  { position: "fifth", tone: "olive", lines: ["Curated books"] },
];

const POS_CLASS: Record<BookclubBenefitPill["position"], string> = {
  first: styles.posFirst,
  second: styles.posSecond,
  third: styles.posThird,
  fourth: styles.posFourth,
  fifth: styles.posFifth,
};

const TONE_CLASS: Record<NonNullable<BookclubBenefitPill["tone"]>, string> = {
  magenta: "",
  orange: styles.toneOrange,
  periwinkle: styles.tonePeriwinkle,
  cyan: styles.toneCyan,
  olive: styles.toneOlive,
};

export function BookclubBenefitsStage({
  id = "benefits",
  heading = "Why join?",
  headingImageSrc,
  headingImageAlt = "Why join?",
  emblemImageSrc,
  emblemAlt = "Book Club Emblem",
  pills = DEFAULT_PILLS,
  className = "",
}: BookclubBenefitsStageProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger, InertiaPlugin);

    const items = el.querySelectorAll("[data-benefits-item]");
    const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 25%", once: true } });
    tl.fromTo(items, { rotate: () => gsap.utils.random(-33, 33), scale: 0 }, { rotate: 0, scale: 1, ease: "elastic.out(1,0.75)", duration: 0.85, stagger: 0.072 });

    const bgPaths = el.querySelectorAll("[data-background-animation] path");
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!bgPaths.length) return;
      gsap.set(bgPaths, { attr: { "stroke-width": 0 }, rotate: 0, transformOrigin: "center center", transformBox: "fill-box" });
      const bgTl = gsap.timeline({ repeat: -1 }).to(bgPaths, { attr: { "stroke-width": 60 }, rotate: 2, duration: 3, ease: "sine.inOut" }).to(bgPaths, { attr: { "stroke-width": 0 }, rotate: 0, duration: 3, ease: "sine.inOut" });
      return () => bgTl.kill();
    });

    const cleanups: (() => void)[] = [];
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      const clampXY = gsap.utils.clamp(-1080, 1080);
      const clampRot = gsap.utils.clamp(-60, 60);
      const root = el.querySelector<HTMLElement>("[data-momentum-hover]");
      if (root) {
        let prevX = 0, prevY = 0, velX = 0, velY = 0, rafId: number | null = null;
        const onMove = (e: MouseEvent) => {
          if (rafId) return;
          rafId = requestAnimationFrame(() => { velX = e.clientX - prevX; velY = e.clientY - prevY; prevX = e.clientX; prevY = e.clientY; rafId = null; });
        };
        root.addEventListener("mousemove", onMove);
        const childListeners: [HTMLElement, (e: MouseEvent) => void][] = [];
        root.querySelectorAll<HTMLElement>("[data-momentum-hover-element]").forEach((pillEl) => {
          const onEnter = (e: MouseEvent) => {
            const target = pillEl.querySelector<HTMLElement>("[data-momentum-hover-target]");
            if (!target) return;
            const { left, top, width, height } = target.getBoundingClientRect();
            const ox = e.clientX - (left + width / 2);
            const oy = e.clientY - (top + height / 2);
            const ang = (ox * velY - oy * velX) / (Math.hypot(ox, oy) || 1);
            gsap.to(target, { inertia: { x: { velocity: clampXY(velX * 25), end: 0 }, y: { velocity: clampXY(velY * 25), end: 0 }, rotation: { velocity: clampRot(ang * 15), end: 0 }, resistance: 160 } });
          };
          pillEl.addEventListener("mouseenter", onEnter);
          childListeners.push([pillEl, onEnter]);
        });
        cleanups.push(() => {
          root.removeEventListener("mousemove", onMove);
          if (rafId) cancelAnimationFrame(rafId);
          childListeners.forEach(([p, fn]) => p.removeEventListener("mouseenter", fn));
        });
      }
    }

    return () => {
      tl.kill();
      mm.revert();
      cleanups.forEach((fn) => fn());
    };
  }, [pills.length]);

  return (
    <section ref={rootRef} id={id} data-rk-benefits-stage="" className={[styles.benefits, className].filter(Boolean).join(" ")}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.content}>
            {headingImageSrc ? (
              <img src={headingImageSrc} loading="lazy" width={600} height={218} alt={headingImageAlt} className={styles.logoText} />
            ) : (
              <svg viewBox="0 0 600 218" fill="none" aria-hidden="true" className={styles.logoText}>
                <text x="300" y="128" textAnchor="middle" fill="var(--rk-bc-black)" fontFamily="var(--rk-font-display)" fontWeight="800" fontSize="92" letterSpacing="-0.02em">
                  {heading}
                </text>
              </svg>
            )}
            {emblemImageSrc ? (
              <img src={emblemImageSrc} loading="lazy" width={568} height={568} alt={emblemAlt} className={styles.logo} />
            ) : (
              <svg viewBox="0 0 568 568" fill="none" aria-hidden="true" className={styles.logo}>
                <circle cx="284" cy="284" r="270" fill="currentColor" />
                <path d="M168 188c38 0 78 13 106 38v166c-27-20-65-30-106-30-16 0-30 2-42 6V195c13-5 27-7 42-7Zm232 0c-38 0-78 13-106 38v166c27-20 65-30 106-30 16 0 30 2 42 6V195c-13-5-27-7-42-7Z" fill="var(--rk-bc-pale-yellow)" />
              </svg>
            )}
          </div>

          <div data-momentum-hover="" className={styles.labelWrap}>
            {pills.map((pill) => (
              <div key={pill.position} data-momentum-hover-element="" className={[styles.label, POS_CLASS[pill.position]].join(" ")}>
                <div data-benefits-item="" data-momentum-hover-target="" className={[styles.labelInner, TONE_CLASS[pill.tone ?? "magenta"]].filter(Boolean).join(" ")}>
                  <div className={styles.labelText}>
                    {pill.lines.map((line, i) => (
                      <Fragment key={i}>{line}{i < pill.lines.length - 1 ? <br /> : null}</Fragment>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <BenefitsBackgroundSvg />
        </div>
      </div>
    </section>
  );
}
