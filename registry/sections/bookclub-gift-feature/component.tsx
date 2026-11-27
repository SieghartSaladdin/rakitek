"use client";

import { useEffect, useId, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import styles from "./styles.module.css";

export interface BookclubPressItem {
  name: string;
  shortLabel?: string;
  imageSrc?: string;
}

export interface BookclubGiftFeatureProps {
  id?: string;
  curvedHeadline?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  showCta?: boolean;
  pressHeading?: string;
  pressItems?: BookclubPressItem[];
  showPress?: boolean;
  visualImageSrc?: string;
  visualAlt?: string;
  className?: string;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

const DEFAULT_PRESS: BookclubPressItem[] = [
  { name: "Publishers Weekly", shortLabel: "PW" },
  { name: "Literary Digest", shortLabel: "LD" },
  { name: "Book Riot", shortLabel: "BR" },
  { name: "Travel + Leisure", shortLabel: "T+L" },
];

export function BookclubGiftFeature({
  id = "gift",
  curvedHeadline = "A gift outside of the box",
  description = "Gift a subscription and they can pick their own books. No spying on shelves needed. Order today and instantly receive an e-gift card to print out or forward. If you’re lucky, they might let you borrow a copy.",
  ctaLabel = "Shop gifts!",
  ctaHref = "#gift",
  ctaExternal = false,
  showCta = true,
  pressHeading = "Mentioned by",
  pressItems = DEFAULT_PRESS,
  showPress = true,
  visualImageSrc,
  visualAlt = "Gift Book Club Box",
  className = "",
  onCtaClick,
}: BookclubGiftFeatureProps) {
  const rootRef = useRef<HTMLElement>(null);
  const pathId = useId().replace(/:/g, "");

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);

    const giftItem = el.querySelector<HTMLElement>("[data-gift-item]");
    const giftInner = el.querySelector<HTMLElement>("[data-gift]");
    const giftTl = giftItem && giftInner
      ? gsap.timeline({ scrollTrigger: { trigger: giftInner, start: "top 72%", once: true } }).fromTo(giftItem, { rotate: 30, scale: 0 }, { rotate: -21, scale: 1, ease: "elastic.out(1,0.75)", duration: 0.95 })
      : null;

    const svg = el.querySelector<SVGSVGElement>("[data-tagline-curve-svg]");
    const refText = el.querySelector<HTMLElement>("[data-tagline-curve-reference]");
    const svgText = el.querySelector<SVGTextElement>("[data-tagline-curve-text]");
    const textPath = svg?.querySelector<SVGTextPathElement>("textPath");
    const pathEl = svg?.querySelector<SVGPathElement>("path");

    const updateCurve = () => {
      if (!svg || !refText || !svgText) return;
      const textSizePx = parseFloat(getComputedStyle(refText).fontSize) || 16;
      const vbWidth = svg.viewBox?.baseVal?.width || svg.clientWidth || 1;
      const renderedWidth = svg.getBoundingClientRect().width || vbWidth;
      svgText.setAttribute("font-size", `${textSizePx / Math.max(renderedWidth / vbWidth, 0.001)}px`);
    };
    updateCurve();

    let curveTween: gsap.core.Tween | null = null;
    if (textPath && pathEl) {
      const ctx = document.createElement("canvas").getContext("2d");
      let textW = 600;
      if (ctx) {
        ctx.font = getComputedStyle(textPath).font;
        textW = ctx.measureText((textPath.textContent || "").trim()).width;
      }
      const finalOffset = -((textW * 1.25 * 100) / (pathEl.getTotalLength() || 1));
      curveTween = gsap.to(textPath, {
        attr: { startOffset: `${finalOffset}0%` },
        ease: "none",
        scrollTrigger: { trigger: el, start: "-40% bottom", end: "60% top", scrub: 0.5 },
      });
    }

    window.addEventListener("resize", updateCurve);
    return () => {
      window.removeEventListener("resize", updateCurve);
      giftTl?.kill();
      curveTween?.kill();
    };
  }, [curvedHeadline]);

  return (
    <section ref={rootRef} id={id} data-rk-gift-feature="" className={[styles.gift, className].filter(Boolean).join(" ")}>
      <header className={styles.taglineCurve}>
        <h2 data-tagline-curve-reference="" className={styles.screenReader}>{curvedHeadline}</h2>
        <div className={styles.taglineWrap}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 288" fill="none" data-tagline-curve-svg="" className={styles.taglineSvg}>
            <path d="M-165.5 288 C33.686 173 810 0 1304 0 C1797.99 0 2262.5 178.181 2741.5 272" id={pathId} stroke="none" />
            <text data-tagline-curve-text="">
              <textPath href={`#${pathId}`} startOffset="100%" textAnchor="start">{curvedHeadline}</textPath>
            </text>
          </svg>
        </div>
      </header>

      <div className={styles.container}>
        <div data-gift="" className={styles.inner}>
          <div className={styles.content}>
            <div className={styles.contentTop}>
              <p className={styles.paragraph}>{description}</p>
              {showCta ? <BookclubBouncyCta label={ctaLabel} href={ctaHref} external={ctaExternal} onClick={onCtaClick} /> : null}
            </div>
            {showPress ? (
              <div className={styles.contentBottom}>
                <div className={styles.handwrittenWrap}>
                  <div className={styles.handwrittenOuter}><p className={styles.handwritten}>{pressHeading}</p></div>
                </div>
                <div className={styles.boxWrap}>
                  {pressItems.map((item) => (
                    <div key={item.name} className={styles.pressBox}>
                      {item.imageSrc ? (
                        <img src={item.imageSrc} loading="lazy" width={104} height={104} alt={item.name} className={styles.pressImg} />
                      ) : (
                        <span className={styles.pressMonogram}>{item.shortLabel ?? item.name.slice(0, 3)}</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className={styles.visual}>
            {visualImageSrc ? (
              <img className={styles.visualImg} src={visualImageSrc} width={630} height={789} alt={visualAlt} data-gift-item="" loading="lazy" />
            ) : (
              <svg viewBox="0 0 630 789" fill="none" aria-label={visualAlt} data-gift-item="" className={styles.visualImg}>
                <rect x="95" y="130" width="440" height="540" rx="48" fill="var(--rk-bc-violet)" />
                <rect x="115" y="150" width="400" height="500" rx="36" fill="var(--rk-bc-bright-pink)" />
                <path d="M115 270h400v26H115z" fill="var(--rk-bc-cyan)" />
                <circle cx="315" cy="405" r="96" fill="var(--rk-bc-yellow)" />
              </svg>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
