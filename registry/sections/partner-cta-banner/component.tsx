"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { RollingCtaButton } from "@registry/ui/rolling-cta-button/component";
import styles from "./styles.module.css";

export interface PartnerCtaBannerProps {
  title?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  tone?: "light" | "dark";
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function PartnerCtaBanner({
  title = "Entrust your travel plans to one of our fifty distinguished partner agencies of the year!",
  body = "Each year, the Meridian Voyages team selects the fifty independent travel agencies that stood out over the past twelve months. This recognition club celebrates the commitment, hospitality, and performance of our finest regional advisors.",
  ctaLabel = "Learn more",
  ctaHref = "#partners",
  tone = "light",
  onCtaClick,
}: PartnerCtaBannerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.registerPlugin(ScrollTrigger);
    const targets = el.querySelectorAll("[data-banner-anim]");
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.from(targets, {
        y: 80,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "circ.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (ctaHref.startsWith("#")) e.preventDefault();
    onCtaClick?.(e);
  };

  return (
    <section className={styles.textBanner}>
      <div
        ref={rootRef}
        className={`${styles.inner} ${tone === "dark" ? styles.isDark : ""}`.trim()}
      >
        <div className={styles.top}>
          <h2 className={styles.title}>
            <span className={styles.line}>{title}</span>
          </h2>
          <div className={styles.ctasDesktop} data-banner-anim>
            <RollingCtaButton
              href={ctaHref}
              label={ctaLabel}
              variant="secondary"
              minWide
              onClick={handleClick}
            />
          </div>
        </div>

        <p className={styles.txt} data-banner-anim>
          {body}
        </p>

        <div className={styles.ctasMobile} data-banner-anim>
          <RollingCtaButton
            href={ctaHref}
            label={ctaLabel}
            variant="secondary"
            minWide
            onClick={handleClick}
          />
        </div>
      </div>
    </section>
  );
}
