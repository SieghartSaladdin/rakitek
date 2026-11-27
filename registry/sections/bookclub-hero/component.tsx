"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import { BookclubMascotPopup } from "@registry/ui/bookclub-mascot-popup/component";
import { DefaultPackageVisual, HeroBackgroundSvg } from "./bg-svg";
import { runBookclubHeroIntro } from "./hero-anim";
import styles from "./styles.module.css";

export interface BookclubHeroProps {
  id?: string;
  headline?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  showCta?: boolean;
  handwrittenNote?: string;
  showHandwrittenNote?: boolean;
  popupTitle?: string;
  popupCtaLabel?: string;
  popupCtaHref?: string;
  showPopup?: boolean;
  visualImageSrc?: string;
  visualAlt?: string;
  sequenceBaseUrl?: string;
  sequenceFrames?: number;
  sequenceDigits?: number;
  sequenceFps?: number;
  className?: string;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

export function BookclubHero({
  id = "top",
  headline = "Unbox stories worth talking about",
  description = "Join the book club that’s anything but traditional. Choose up to 3 new reads every month, delivered to your door. Then dive into the stories, and the conversations.",
  ctaLabel = "Log-in / Sign-up now",
  ctaHref = "#signup",
  ctaExternal = false,
  showCta = true,
  handwrittenNote = "Shipping to the USA & Canada",
  showHandwrittenNote = true,
  popupTitle = "Want to join the Club?",
  popupCtaLabel = "Sign-up now!",
  popupCtaHref = "#signup",
  showPopup = true,
  visualImageSrc,
  visualAlt = "Monthly Book Club Box",
  sequenceBaseUrl,
  sequenceFrames = 120,
  sequenceDigits = 3,
  sequenceFps = 24,
  className = "",
  onCtaClick,
}: BookclubHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let cleanupIntro = () => {};
    let cancelled = false;
    const start = () => {
      if (!cancelled) cleanupIntro = runBookclubHeroIntro(root);
    };
    if (document.fonts?.ready) {
      document.fonts.ready.then(start);
    } else {
      start();
    }
    return () => {
      cancelled = true;
      cleanupIntro();
    };
  }, []);

  useEffect(() => {
    if (!sequenceBaseUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let dead = false;
    let raf = 0;
    const imgs: HTMLImageElement[] = [];
    const pad = (n: number) => String(n).padStart(sequenceDigits, "0");
    const resize = () => {
      const p = canvas.parentElement;
      if (!p) return;
      canvas.width = p.clientWidth;
      canvas.height = p.clientHeight;
    };
    resize();
    for (let i = 0; i < Math.min(sequenceFrames, 120); i++) {
      const img = new Image();
      img.src = `${sequenceBaseUrl}${pad(i)}.webp`;
      imgs.push(img);
    }
    const startMs = performance.now();
    const tick = (now: number) => {
      if (dead) return;
      const idx = Math.floor(((now - startMs) / 1000) * sequenceFps) % imgs.length;
      const img = imgs[idx] ?? imgs.find((im) => im.complete && im.naturalWidth > 0);
      if (img?.complete && img.naturalWidth > 0 && canvas.width > 0) {
        const s = Math.max(canvas.width / img.width, canvas.height / img.height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, (canvas.width - img.width * s) / 2, (canvas.height - img.height * s) / 2, img.width * s, img.height * s);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    return () => {
      dead = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, [sequenceBaseUrl, sequenceFrames, sequenceDigits, sequenceFps]);

  return (
    <section ref={rootRef} id={id} data-rk-hero="" className={[styles.hero, className].filter(Boolean).join(" ")}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.header}>
              <h1 data-hero-title="" className={styles.title}>{headline}</h1>
              <p data-hero-paragraph="" className={styles.paragraph}>{description}</p>
            </div>
            {showCta ? (
              <div data-hero-cta="">
                <BookclubBouncyCta label={ctaLabel} href={ctaHref} external={ctaExternal} onClick={onCtaClick} />
              </div>
            ) : null}
            {showHandwrittenNote ? (
              <div className={styles.textWrap}>
                <div className={styles.textOuter}>
                  <p data-hero-handwritten="" className={styles.handwrittenText}>{handwrittenNote}</p>
                </div>
              </div>
            ) : null}
          </div>
          <div className={styles.visual}>
            {visualImageSrc ? (
              <img className={styles.visualImg} src={visualImageSrc} width={630} height={789} alt={visualAlt} loading="eager" />
            ) : (
              <DefaultPackageVisual className={styles.visualImg} />
            )}
          </div>
        </div>
      </div>

      {showPopup ? (
        <div data-hero-easter-egg="" className={styles.easterEgg}>
          <BookclubMascotPopup variant="left" title={popupTitle} ctaLabel={popupCtaLabel} ctaHref={popupCtaHref} />
        </div>
      ) : null}

      <HeroBackgroundSvg />

      <div data-hero-sequence="" className={styles.sequence}>
        <div className={styles.sequenceElement}>
          {sequenceBaseUrl ? (
            <canvas ref={canvasRef} className={styles.sequenceCanvas} />
          ) : visualImageSrc ? (
            <div className={styles.fallbackBoxWrap}>
              <img src={visualImageSrc} width={630} height={789} alt={visualAlt} loading="eager" />
            </div>
          ) : (
            <div className={styles.fallbackBoxWrap}>
              <DefaultPackageVisual />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
