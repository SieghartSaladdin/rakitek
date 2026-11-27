"use client";

import { Fragment, useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import { DefaultStepArt, FlowBackgroundSvg } from "./bg-svg";
import styles from "./styles.module.css";

export interface BookclubStepItem {
  stepLabel: string;
  titleLines: string[];
  description: string;
  imageSrc?: string;
  imageAlt?: string;
  variant: "cyan" | "bright-pink" | "yellow" | "periwinkle";
}

export interface BookclubHowItWorksProps {
  id?: string;
  title?: string;
  handwrittenNote?: string;
  showHandwrittenNote?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  ctaLogoSrc?: string;
  showCta?: boolean;
  steps?: BookclubStepItem[];
  className?: string;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

const DEFAULT_STEPS: BookclubStepItem[] = [
  { stepLabel: "Step #1", titleLines: ["Explore our books"], description: "The first of every month we reveal 6-7 new books. Follow us on socials to keep an eye on any hints we may post.", variant: "cyan" },
  { stepLabel: "Step #2", titleLines: ["Build your ", "box"], description: "Members can order up to 3 books per box. At least one title must be from the current month's selections.", variant: "bright-pink" },
  { stepLabel: "Step #3", titleLines: ["Check your doorstep"], description: "Your box is delivered right to your doorstep. This is the best excuse to cancel your Friday night plans.", variant: "yellow" },
  { stepLabel: "Step #4", titleLines: ["Share your reads"], description: "Share your box and tag us or participate in the Club discussions in-app!", variant: "periwinkle" },
];

const CARD_TONE: Record<BookclubStepItem["variant"], string> = {
  cyan: "",
  "bright-pink": styles.toneBrightPink,
  yellow: styles.toneYellow,
  periwinkle: styles.tonePeriwinkle,
};

export function BookclubHowItWorks({
  id = "how-it-works",
  title = "How it works",
  handwrittenNote = "Consider us your professional book curator",
  showHandwrittenNote = true,
  ctaLabel = "Become a member",
  ctaHref = "#signup",
  ctaExternal = false,
  ctaLogoSrc,
  showCta = true,
  steps = DEFAULT_STEPS,
  className = "",
  onCtaClick,
}: BookclubHowItWorksProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const container = root.querySelector<HTMLElement>("[data-call-out]");
    if (!container) return;
    const cards = container.querySelectorAll<HTMLElement>("[data-call-out-item]");
    const cardContent = container.querySelectorAll<HTMLElement>("[data-call-out-child]");
    if (!cards.length) return;

    let currentPortion = 0;
    cards.forEach((card) => {
      gsap.set(card, { xPercent: (Math.random() - 0.5) * 10, yPercent: (Math.random() - 0.5) * 10, rotation: (Math.random() - 0.5) * 15 });
    });

    const enterTween = gsap.from(cards, {
      rotation: (Math.random() - 0.5) * 15,
      yPercent: "+=150",
      duration: 1.05,
      ease: "elastic.out(1, 0.75)",
      stagger: 0.088,
      scrollTrigger: { trigger: container, start: "top 85%", once: true },
    });

    const resetPortion = (idx: number) => {
      gsap.to(cards[idx], { xPercent: (Math.random() - 0.5) * 10, yPercent: (Math.random() - 0.5) * 10, rotation: (Math.random() - 0.5) * 20, scale: 1, duration: 0.85, ease: "elastic.out(1, 0.75)" });
    };
    const newPortion = (i: number) => {
      gsap.to(cards[i], { xPercent: 0, yPercent: 0, rotation: 0, duration: 0.85, scale: 1.075, ease: "elastic.out(1, 0.75)" });
      cardContent.forEach((child, idx) => {
        gsap.to(child, { xPercent: idx !== i ? 45 / (idx - i) : 0, ease: "elastic.out(1, 0.75)", duration: 0.85 });
      });
    };

    const onMove = (e: globalThis.MouseEvent) => {
      const w = container.clientWidth || 1;
      const portion = Math.ceil(((e.clientX - container.getBoundingClientRect().left) / w) * cards.length);
      if (currentPortion !== portion && portion > 0 && portion <= cards.length) {
        if (currentPortion !== 0) resetPortion(currentPortion - 1);
        currentPortion = portion;
        newPortion(currentPortion - 1);
      }
    };
    const onLeave = () => {
      if (currentPortion > 0) resetPortion(currentPortion - 1);
      currentPortion = 0;
      gsap.to(cardContent, { xPercent: 0, ease: "elastic.out(1, 0.75)", duration: 0.85 });
    };

    container.addEventListener("mousemove", onMove);
    container.addEventListener("mouseleave", onLeave);
    return () => {
      container.removeEventListener("mousemove", onMove);
      container.removeEventListener("mouseleave", onLeave);
      enterTween.kill();
    };
  }, [steps.length]);

  return (
    <section ref={rootRef} id={id} data-rk-how-it-works="" className={[styles.flow, className].filter(Boolean).join(" ")}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            {showHandwrittenNote ? (
              <div className={styles.textWrap}>
                <div className={styles.textOuter}><p className={styles.handwrittenText}>{handwrittenNote}</p></div>
              </div>
            ) : null}
            {showCta ? (
              <div className={styles.cta}>
                {ctaLogoSrc ? (
                  <img src={ctaLogoSrc} loading="lazy" alt="" className={styles.ctaLogo} />
                ) : (
                  <svg viewBox="0 0 80 80" fill="none" aria-hidden="true" className={styles.ctaLogo}>
                    <circle cx="40" cy="40" r="38" fill="currentColor" />
                    <path d="M23 27c5.5 0 11.2 1.8 15 5.2V55c-3.8-2.8-9.2-4.2-15-4.2-2.2 0-4.2.3-6 .8V27.9c1.9-.6 3.9-.9 6-.9Zm34 0c-5.5 0-11.2 1.8-15 5.2V55c3.8-2.8 9.2-4.2 15-4.2 2.2 0 4.2.3 6 .8V27.9c-1.9-.6-3.9-.9-6-.9Z" fill="var(--rk-bc-soft-pink)" />
                  </svg>
                )}
                <BookclubBouncyCta label={ctaLabel} href={ctaHref} external={ctaExternal} onClick={onCtaClick} />
              </div>
            ) : null}
          </header>

          <div className={styles.content}>
            <div data-call-out="" className={styles.list}>
              {steps.map((step, idx) => (
                <div key={step.stepLabel} data-call-out-item="" className={styles.listItem}>
                  <div data-call-out-child="" className={[styles.card, CARD_TONE[step.variant]].filter(Boolean).join(" ")}>
                    <div className={styles.cardInner}>
                      <div className={styles.cardHeader}><span className={styles.stepLabel}>{step.stepLabel}</span></div>
                      <div className={styles.cardImgWrap}>
                        {step.imageSrc ? (
                          <img width={720} height={588} alt={step.imageAlt ?? step.stepLabel} src={step.imageSrc} loading="lazy" className={styles.cardImg} />
                        ) : (
                          <DefaultStepArt index={idx} />
                        )}
                      </div>
                      <div className={styles.cardContent}>
                        <h3 className={styles.cardTitle}>
                          {step.titleLines.map((line, i) => (
                            <Fragment key={i}>{line}{i < step.titleLines.length - 1 ? <br /> : null}</Fragment>
                          ))}
                        </h3>
                        <p className={styles.cardParagraph}>{step.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {showHandwrittenNote ? (
              <div className={styles.contentTextWrap}>
                <div className={styles.contentTextOuter}><p className={styles.handwrittenText}>{handwrittenNote}</p></div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <FlowBackgroundSvg />
    </section>
  );
}
