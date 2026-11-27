"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface BookclubPromoBannersProps {
  id?: string;
  primaryText?: string;
  secondaryText?: string;
  className?: string;
}

function BadgeWaveSvg({ clipId }: { clipId: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 2011 145" width="100%" className={styles.itemBgSvg}>
      <g fill="currentColor" clipPath={`url(#${clipId})`}>
        <path d="M522.714 32.133C534.929-7.994 565.736-17.48 603.542 2.98c5.886 3.193 11.838 6.62 16.876 10.891 19.662 16.71 39.246 33.517 58.324 50.81 31.328 28.382 62.157 57.239 102.545 74.207a178 178 0 0 0 16.8 6.112l-297.999.001q.803-4.204 1.63-8.401c6.872-34.866 10.678-70.564 20.996-104.467M1304.23 0c13.85 30.538 27.44 61.18 43.29 90.735 10.34 19.282 23.9 37.752 39.21 54.266L1227.85 145c-12.02-12.149-25.07-23.381-39.89-33.111-49.63-32.602-124.63-32.93-168.83 18.126-4.2 4.853-8.08 9.857-11.72 14.985H871.583c9.615-3.528 18.995-8.649 28.068-15.546 22.791-17.333 44.297-37.79 61.068-60.43C977.283 46.647 992.605 23.429 1007.61 0zM2056.78 0c5.35 17.74 8.57 36.296 11.93 54.504 1.02 5.551 1.67 11.168 2.15 16.81l-37 73.686h-400.09c16.99-10.341 33.39-21.603 49.44-33.287 50.15-36.51 98.13-75.785 148.68-111.712z" />
      </g>
      <defs>
        <clipPath id={clipId}>
          <path fill="currentColor" d="m.042 0 2010.74.578-.042 144L0 144z" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function BookclubPromoBanners({
  id = "promo",
  primaryText = "1st book only $4 w/ code FALL (USA-only)!",
  secondaryText = "1st book only $4 w/ code FALL (USA-only)!",
  className = "",
}: BookclubPromoBannersProps) {
  const rootRef = useRef<HTMLElement>(null);
  const clipBase = useId().replace(/:/g, "");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const items = el.querySelectorAll("[data-badge-item]");
    const [item1, item2] = Array.from(items);
    if (!item1 || !item2) return;

    const mm = gsap.matchMedia();
    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", mobile: "(max-width: 990px)" },
      (ctx) => {
        if (!ctx.conditions?.motion) return;
        const item2Y = ctx.conditions.mobile ? "-0.25em" : "-1em";
        gsap.set(item1, { rotate: -2, y: "-2em" });
        gsap.set(item2, { rotate: 1, y: "-6em" });
        const tl = gsap.timeline({ paused: true })
          .to(item1, { y: "0em", rotate: 0, duration: 1, ease: "elastic.out(1, 0.75)" }, 0)
          .to(item2, { y: item2Y, rotate: -4.7, duration: 1, ease: "elastic.out(1, 0.75)" }, 0.0088);
        const trigger = ScrollTrigger.create({ trigger: el, start: "top 80%", end: "bottom top", onEnter: () => tl.play() });
        return () => { trigger.kill(); tl.kill(); };
      },
    );
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} id={id} data-rk-promo-banners="" className={[styles.badge, className].filter(Boolean).join(" ")}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div data-badge-item="" className={styles.item}>
            <div className={styles.itemTitleOuter}><span className={styles.itemTitle}>{primaryText}</span></div>
            <div className={styles.itemBg}><BadgeWaveSvg clipId={`${clipBase}-1`} /></div>
          </div>
          <div data-badge-item="" className={styles.item}>
            <div className={styles.itemTitleOuter}><span className={styles.itemTitle}>{secondaryText}</span></div>
            <div className={[styles.itemBg, styles.itemBgBlue].join(" ")}><BadgeWaveSvg clipId={`${clipBase}-2`} /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
