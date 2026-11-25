"use client";

import { Fragment, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./styles.module.css";

export interface KineticManifestoStepsProps {
  words?: [string, string, string];
  steps?: string[];
  visualImage?: string;
  visualAlt?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

const DEFAULT_STEPS = [
  "Select your coffee and size",
  "Select your frequency",
  "Sit back and enjoy",
];

function SplitWord({ text }: { text: string }) {
  const words = text.trim().split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((word, wIdx) => (
        <Fragment key={`${word}-${wIdx}`}>
          <span className={styles.word} data-manifesto-word="">
            {Array.from(word).map((ch, cIdx) => (
              <span key={`${wIdx}-${cIdx}`} className={styles.char} data-manifesto-char="">
                {ch}
              </span>
            ))}
          </span>
          {wIdx < words.length - 1 ? <span className={styles.whitespace}> </span> : null}
        </Fragment>
      ))}
    </>
  );
}

function animateBigTitle(title: HTMLElement) {
  const wordEls = Array.from(title.querySelectorAll<HTMLElement>("[data-manifesto-word]"));
  const chars: HTMLElement[] = [];
  let animI = 0;
  let xIndex = 0;
  let yIndex = 0;

  wordEls.forEach((wordEl, wIdx) => {
    animI = wIdx % 2 ? 1 : 0;
    Array.from(wordEl.children).forEach((node, subIdx) => {
      const charEl = node as HTMLElement;
      const opts: gsap.TweenVars = { opacity: 0 };
      if ((subIdx + animI) % 3 === 0) {
        opts.xPercent = xIndex % 2 ? 50 : -50;
        xIndex++;
      } else if (animI % 2 === 0) {
        opts.yPercent = yIndex % 2 ? -70 : 70;
        yIndex++;
      }
      charEl.dataset.stagger = String(gsap.utils.random(0.1, 0.6));
      gsap.set(charEl, opts);
      chars.push(charEl);
      animI++;
    });
  });

  const getStagger = (_idx: number, target: Element) =>
    parseFloat((target as HTMLElement).dataset.stagger || "0.2");
  const tl = gsap.timeline({ scrollTrigger: { trigger: title, once: true } });
  tl.to(chars, { xPercent: 0, yPercent: 0, ease: "expo.out", duration: 1.4, stagger: getStagger }, 0);
  tl.to(chars, { opacity: 1, ease: "expo.out", duration: 0.8, stagger: getStagger }, 0);
}

export function KineticManifestoSteps({
  words = ["never", "run", "out"],
  steps = DEFAULT_STEPS,
  visualImage,
  visualAlt = "Pour-over coffee dripper set on a glass carafe over a digital scale.",
  description = "Subscribe to monthly deliveries and save up to 15% on every order. Pick the roast or series that fits your taste.",
  ctaLabel = "Subscribe",
  ctaHref = "#subscribe",
}: KineticManifestoStepsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      section.querySelectorAll<HTMLElement>("[data-manifesto-lines]").forEach((el) => {
        el.classList.add(styles.animLinesActive);
      });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      section.querySelectorAll<HTMLElement>("[data-manifesto-title]").forEach(animateBigTitle);

      if (imageBoxRef.current) {
        gsap.fromTo(
          imageBoxRef.current,
          { "--yPercent": -1 } as gsap.TweenVars,
          {
            "--yPercent": 1,
            scrollTrigger: {
              trigger: imageBoxRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          } as gsap.TweenVars,
        );
      }

      section.querySelectorAll<HTMLElement>("[data-manifesto-anim-in]").forEach((el) => {
        const delay = el.dataset.delay ? parseFloat(el.dataset.delay) : 0;
        gsap.fromTo(
          el,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay,
            clearProps: "transform",
            scrollTrigger: { trigger: el, start: "top 85%", once: true },
          },
        );
      });

      section.querySelectorAll<HTMLElement>("[data-manifesto-lines]").forEach((el) => {
        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => el.classList.add(styles.animLinesActive),
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [words]);

  const handleCtaClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (ctaHref.startsWith("#")) e.preventDefault();
  };

  return (
    <section ref={sectionRef} className={styles.section} aria-label={words.join(" ")}>
      <div className={styles.root}>
        <h2 className="sr-only">{words.join(" ")}</h2>

        <div className={`${styles.padX} ${styles.line}`}>
          <p className={`${styles.tH1} ${styles.line1}`} data-manifesto-title="" aria-hidden="true">
            <SplitWord text={words[0]} />
          </p>
          <ol className={styles.list}>
            {steps.map((step) => (
              <li key={step} className={styles.tNarrow}>
                {step}
              </li>
            ))}
          </ol>
        </div>

        <div className={`${styles.grid} ${styles.padX} ${styles.line}`}>
          <div ref={imageBoxRef} className={styles.imageBox}>
            <div className={styles.imageInner}>
              {visualImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={visualImage}
                  alt={visualAlt}
                  width={467}
                  height={561}
                  loading="lazy"
                  className={styles.imageEl}
                />
              ) : (
                <div className={styles.imageFallback}>
                  <svg viewBox="0 0 240 280" fill="none" className={styles.artSvg} aria-hidden="true">
                    <path d="M56 76H184L142 146H98L56 76Z" stroke="currentColor" strokeWidth="3" />
                    <path d="M88 156H152L166 238H74L88 156Z" stroke="currentColor" strokeWidth="3" />
                    <path d="M158 176H180C190 176 196 184 196 196C196 208 190 216 180 216H164" stroke="currentColor" strokeWidth="3" />
                    <line x1="60" y1="248" x2="180" y2="248" stroke="currentColor" strokeWidth="3" />
                    <path d="M110 42C110 54 120 56 120 66" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                    <path d="M132 36C132 48 142 50 142 60" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <p className={`${styles.line2} ${styles.tH1}`} data-manifesto-title="" aria-hidden="true">
            <SplitWord text={words[1]} />
          </p>

          <div className={styles.subscribeDesktop}>
            <p className={`${styles.desc} ${styles.tH4}`} data-manifesto-anim-in="">
              {description}
            </p>
            <a
              href={ctaHref}
              className={`${styles.ctaBtn} ${styles.tH4}`}
              data-manifesto-anim-in=""
              data-delay="0.3"
              onClick={handleCtaClick}
            >
              {ctaLabel}
            </a>
          </div>
        </div>

        <div className={`${styles.grid} ${styles.padX} ${styles.line}`}>
          <p className={`${styles.line3} ${styles.tH1}`} data-manifesto-title="" aria-hidden="true">
            <SplitWord text={words[2]} />
          </p>
        </div>

        <div className={styles.subscribeMobile}>
          <p className={`${styles.tH4} ${styles.animLines}`} data-manifesto-lines="">
            {description}
          </p>
          <a href={ctaHref} className={`${styles.ctaBtn} ${styles.tH4}`} onClick={handleCtaClick}>
            {ctaLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
