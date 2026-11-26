"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface HeritageManifestoBandProps {
  surtext?: string;
  statement?: string;
}

export function HeritageManifestoBand({
  surtext = "Since 1970",
  statement = "Meridian Voyages is far more than an ordinary tour operator, standing proudly as an enduring pioneer of curated journeys built on 56 years of craft.",
}: HeritageManifestoBandProps) {
  const textRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "circ.out",
          clearProps: "transform,opacity",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
        },
      );
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section className={styles.featuredText}>
      <div className={styles.inner}>
        {surtext ? <div className={styles.surtext}>{surtext}</div> : null}
        <div ref={textRef} className={styles.text}>
          <span className={styles.lineWrapper}>{statement}</span>
        </div>
      </div>
    </section>
  );
}
