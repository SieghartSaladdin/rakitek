"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface EditorialMissionSplitProps {
  tagline?: string;
  statement?: string;
  ctaLabel?: string;
  ctaHref?: string;
  topCaption?: string;
  bottomCaption?: string;
  coordinates?: string;
  backgroundImage?: string;
  backgroundAlt?: string;
  insetImage?: string;
  insetAlt?: string;
  /** When provided, called on CTA click; otherwise the link navigates normally (in-page anchors work). */
  onCtaClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  /** Optional id on the root section, e.g. for in-page anchor targets. */
  id?: string;
  ariaLabel?: string;
}

export function EditorialMissionSplit({
  tagline = "Our\nMission",
  statement = "People say we have a one-track mind. And to that we always reply - thank you. Because we believe that by focusing on one thing, many good things happen. And for our whole team, that one thing was always coffee. We have gone deeper into coffee than anyone, with busy hands and grinder dust on our sleeves at every step.",
  ctaLabel = "Learn More",
  ctaHref = "#mission",
  topCaption = "craft\nis always possible.",
  bottomCaption = "Just grab a bag\nand jump right in.",
  coordinates = "45.5236° N - 73.5955° W",
  backgroundImage,
  backgroundAlt = "Editorial architectural backdrop",
  insetImage,
  insetAlt = "Overhead specialty coffee portrait",
  onCtaClick,
  id,
  ariaLabel = "Editorial mission split",
}: EditorialMissionSplitProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const frontImgRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const topCaptionRef = useRef<HTMLParagraphElement>(null);
  const bottomCaptionRef = useRef<HTMLParagraphElement>(null);
  const coordinatesRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const linesEl = linesRef.current;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      linesEl?.classList.add(styles.linesActive);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      if (linesEl) {
        ScrollTrigger.create({
          trigger: linesEl,
          start: "top 85%",
          once: true,
          onEnter: () => linesEl.classList.add(styles.linesActive),
        });
      }

      const parallaxTargets = [bgRef.current, frontImgRef.current].filter(
        (el): el is HTMLDivElement => el !== null,
      );
      parallaxTargets.forEach((el) => {
        gsap.fromTo(
          el,
          { "--yPercent": -1 } as gsap.TweenVars,
          {
            "--yPercent": 1,
            scrollTrigger: {
              trigger: el,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          } as gsap.TweenVars,
        );
      });

      const fadeTargets = [
        topCaptionRef.current,
        bottomCaptionRef.current,
        coordinatesRef.current,
      ].filter((el): el is HTMLParagraphElement => el !== null);
      fadeTargets.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: el,
              start: "top 85%",
              once: true,
            },
          },
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id={id} className={styles.section} aria-label={ariaLabel}>
      <div className={styles.root}>
        <div ref={bgRef} className={styles.bg} aria-hidden="true">
          <div className={styles.mediaInner}>
            {backgroundImage ? (
              <img
                src={backgroundImage}
                alt={backgroundAlt}
                width={1920}
                height={2000}
                className={styles.bgImg}
              />
            ) : null}
          </div>
        </div>

        <div className={styles.manifest}>
          <p className={`${styles.narrow} ${styles.tagline}`}>{tagline}</p>
          <p className={styles.srOnly}>{statement}</p>
          <div ref={linesRef} className={`${styles.text} ${styles.lines}`} aria-hidden="true">
            {statement}
          </div>
          <a
            href={ctaHref}
            className={styles.btn}
            onClick={onCtaClick}
          >
            {ctaLabel}
          </a>
        </div>

        <div className={styles.visual}>
          <p ref={topCaptionRef} className={`${styles.narrow} ${styles.topCaption}`}>
            {topCaption}
          </p>

          <div ref={frontImgRef} className={styles.frontImg}>
            <div className={styles.mediaInner}>
              {insetImage ? (
                <img
                  src={insetImage}
                  alt={insetAlt}
                  width={980}
                  height={1363}
                  className={styles.frontImgMedia}
                />
              ) : null}
            </div>
          </div>

          <p ref={bottomCaptionRef} className={`${styles.narrow} ${styles.bottomCaption}`}>
            {bottomCaption}
          </p>
        </div>

        <p ref={coordinatesRef} className={`${styles.narrow} ${styles.coordinates}`}>
          {coordinates}
        </p>
      </div>
    </section>
  );
}
