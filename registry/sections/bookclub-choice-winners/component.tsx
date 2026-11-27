"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Smooothy from "smooothy";
import { BookclubMascotPopup } from "@registry/ui/bookclub-mascot-popup/component";
import { BookclubSliderControls } from "@registry/ui/bookclub-slider-controls/component";
import styles from "./styles.module.css";

export interface BookclubWinnerItem {
  id: string;
  yearTop: string;
  yearBottom: string;
  coverSrc?: string;
  coverAlt: string;
  authorPhotoSrc?: string;
  authorName?: string;
  nextVotingLabel?: string;
  href?: string;
  external?: boolean;
}

export interface BookclubChoiceWinnersProps {
  id?: string;
  title?: string;
  description?: string;
  popupTitle?: string;
  popupCtaLabel?: string;
  popupCtaHref?: string;
  showPopup?: boolean;
  showControls?: boolean;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
  heartImageSrc?: string;
  starburstImageSrc?: string;
  winners?: BookclubWinnerItem[];
  className?: string;
}

const DEFAULT_WINNERS: BookclubWinnerItem[] = [
  { id: "2026-upcoming", yearTop: "20", yearBottom: "26", coverAlt: "Next voting round: Fall 2026", nextVotingLabel: "Next voting round: Fall 2026" },
  { id: "2025-winner", yearTop: "20", yearBottom: "25", coverAlt: "The Lantern Keepers (2025 Winner)", authorName: "Maren Vance", href: "#winners" },
  { id: "2024-winner", yearTop: "20", yearBottom: "24", coverAlt: "Salt & Cypress (2024 Winner)", authorName: "Devon Okafor", href: "#winners" },
  { id: "2023-winner", yearTop: "20", yearBottom: "23", coverAlt: "Glass Meridian (2023 Winner)", authorName: "Soren Hale", href: "#winners" },
];

export function BookclubChoiceWinners({
  id = "winners",
  title = "Members’ Choice Winners",
  description = "Every year readers vote on their favourite picks and we celebrate with a special reprinting. These titles have won our hearts and minds over the last few years.",
  popupTitle = "Want to join the Club?",
  popupCtaLabel = "Sign-up now!",
  popupCtaHref = "#signup",
  showPopup = true,
  showControls = true,
  prevAriaLabel = "Previous Slide",
  nextAriaLabel = "Next Slide",
  heartImageSrc,
  starburstImageSrc,
  winners = DEFAULT_WINNERS,
  className = "",
}: BookclubChoiceWinnersProps) {
  const rootRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<Smooothy | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  useEffect(() => {
    const root = rootRef.current;
    const wrapper = wrapperRef.current;
    if (!root || !wrapper) return;
    gsap.registerPlugin(ScrollTrigger);

    let rafId = 0;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 992px)", () => {
      const items = Array.from(wrapper.querySelectorAll<HTMLElement>("[data-books-slider-item]"));
      const settings = items.map((el, i) => {
        const dir = i % 2 === 0 ? -1 : 1;
        const rot = gsap.utils.random(1.5, 3, 0.1) * dir;
        const yOff = gsap.utils.random(3, 9, 0.1) * dir;
        el.style.setProperty("--book-slider-item-rotate", `${-rot}deg`);
        return { el, rot, yOff };
      });
      const slider = new Smooothy(wrapper, { infinite: false, snap: false, dragSensitivity: 0.008, lerpFactor: 0.225, scrollSensitivity: 1, bounceLimit: 0.5, setOffset: ({ wrapperWidth }: { wrapperWidth: number }) => wrapperWidth - 32 });
      sliderRef.current = slider;
      const tick = () => {
        slider.update();
        setCanPrev((slider.currentSlide ?? 0) > 0);
        setCanNext(gsap.utils.clamp(0, 1, slider.progress ?? 0) < 0.95);
        const rect = wrapper.getBoundingClientRect();
        const center = rect.left + rect.width / 2;
        const maxD = rect.width / 2 || 1;
        settings.forEach(({ el, rot, yOff }) => {
          const r = el.getBoundingClientRect();
          const strength = Math.sin(gsap.utils.clamp(-2, 2, (r.left + r.width / 2 - center) / maxD) * 1.2);
          el.style.transform = `translateY(${strength * yOff}%) rotate(${strength * rot}deg)`;
        });
        rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
      return () => {
        cancelAnimationFrame(rafId);
        items.forEach((el) => { el.style.transform = ""; el.style.removeProperty("--book-slider-item-rotate"); });
        slider.destroy?.();
        sliderRef.current = null;
      };
    });

    const heart = root.querySelector<HTMLElement>("[data-plop-in-item]");
    let heartTl: gsap.core.Timeline | null = null;
    if (heart) {
      gsap.set(heart, { scale: 0, rotate: -20, y: "-4em" });
      heartTl = gsap.timeline({ scrollTrigger: { trigger: heart, start: "top 80%", once: true } }).to(heart, { scale: 1, y: "0em", rotate: 11, duration: 0.7, ease: "elastic.out(1, 0.72)" });
    }

    return () => {
      cancelAnimationFrame(rafId);
      mm.revert();
      heartTl?.kill();
    };
  }, [winners.length]);

  return (
    <section ref={rootRef} id={id} data-rk-choice-winners="" className={[styles.choice, className].filter(Boolean).join(" ")}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.headerContainer}>
            {showPopup ? (
              <div className={styles.easterEgg}>
                <BookclubMascotPopup variant="right-bottom" tone="dark-icon" title={popupTitle} ctaLabel={popupCtaLabel} ctaHref={popupCtaHref} />
              </div>
            ) : null}
            <div className={styles.headerContent}>
              <h2 className={styles.title}>{title}</h2>
              <p className={styles.paragraph}>{description}</p>
            </div>
          </div>
          <div className={styles.visual}>
            {heartImageSrc ? (
              <img src={heartImageSrc} loading="lazy" width={175} height={158} alt="Heart illustration" data-plop-in-item="" className={styles.visualImg} />
            ) : (
              <svg viewBox="0 0 175 158" fill="none" aria-hidden="true" data-plop-in-item="" className={styles.visualImg}>
                <path d="M87.5 148S14 103 14 50C14 25 33 8 56 8c14 0 26 7 31.5 18C93 15 105 8 119 8c23 0 42 17 42 42 0 53-73.5 98-73.5 98Z" fill="currentColor" stroke="var(--rk-bc-black)" strokeWidth="8" />
              </svg>
            )}
          </div>
        </div>

        <div className={styles.content}>
          <div ref={wrapperRef} role="list" className={styles.list}>
            {winners.map((w) => (
              <div key={w.id} role="listitem" className={styles.listItem}>
                <article data-books-slider-item="" className={styles.item}>
                  <div className={styles.itemInner}>
                    <div className={styles.itemBg}>
                      <div className={styles.itemBgEars} aria-hidden="true">
                        <svg viewBox="0 0 44 45" fill="none" className={styles.leftEar}><path fill="currentColor" d="M1.335.198c.671-.316 1.5-.254 2.186.187C27.678 16.847 39.839 36.953 44 45h-6.048c-2.382-1.604-6.964-3.674-15.652-4.814C2.999 37.666-.665 14.174.09 2.04.152 1.28.589.515 1.335.198Z" /></svg>
                        <svg viewBox="0 0 29 80" fill="none" className={styles.rightEar}><path fill="currentColor" d="M19.388.879c.667-.771 1.647-1.018 2.559-.807.912.21 1.682.956 1.926 1.861C34.595 38.09 25.79 69.237 21.823 80h-4.188c-.17-4.22-2.739-13.318-10.975-22.064-8.493-9.099-8.88-21.913-1.063-37.23C11.221 9.603 19.091 1.266 19.388.879Z" /></svg>
                      </div>
                    </div>
                    <div className={[styles.itemContainer, w.nextVotingLabel ? styles.itemBlurred : ""].filter(Boolean).join(" ")}>
                      <div className={styles.itemCover}>
                        {w.coverSrc ? (
                          <img src={w.coverSrc} loading="lazy" alt={w.coverAlt} className={styles.itemImg} />
                        ) : (
                          <svg viewBox="0 0 320 493" fill="none" aria-hidden="true" className={styles.itemImg}>
                            <rect width="320" height="493" fill="var(--rk-bc-violet)" />
                            <circle cx="160" cy="220" r="88" fill="var(--rk-bc-bright-pink)" />
                          </svg>
                        )}
                      </div>
                      {w.authorName || w.authorPhotoSrc ? (
                        <div className={styles.author}>
                          {w.authorPhotoSrc ? (
                            <img src={w.authorPhotoSrc} loading="lazy" width={144} height={144} alt={w.authorName ?? "Winner Author"} className={styles.authorImg} />
                          ) : (
                            <svg viewBox="0 0 144 144" fill="none" aria-hidden="true" className={styles.authorImg}>
                              <rect width="144" height="144" fill="var(--rk-bc-cyan)" />
                              <circle cx="72" cy="54" r="24" fill="var(--rk-bc-black)" />
                              <path d="M28 134c6-28 24-42 44-42s38 14 44 42" fill="var(--rk-bc-black)" />
                            </svg>
                          )}
                        </div>
                      ) : null}
                      <div className={styles.year}>
                        {starburstImageSrc ? (
                          <img src={starburstImageSrc} loading="lazy" width={200} height={200} alt="" className={styles.yearImg} />
                        ) : (
                          <svg viewBox="0 0 200 200" fill="none" aria-hidden="true" className={styles.yearImg}>
                            <path d="M100 4l18 28 32-12 4 33 33 4-12 32 28 18-28 18 12 32-33 4-4 33-32-12-18 28-18-28-32 12-4-33-33-4 12-32-28-18 28-18-12-32 33-4 4-33 32 12Z" fill="currentColor" />
                          </svg>
                        )}
                        <div className={styles.yearTextWrap}>
                          <span className={styles.yearText}>{w.yearTop}</span>
                          <span className={styles.yearText}>{w.yearBottom}</span>
                        </div>
                      </div>
                      {w.nextVotingLabel ? (
                        <div className={styles.nextVoting}><span className={styles.nextVotingText}>{w.nextVotingLabel}</span></div>
                      ) : null}
                    </div>
                    {w.href ? (
                      <a aria-label={w.coverAlt} href={w.href} target={w.external ? "_blank" : undefined} rel={w.external ? "noopener noreferrer" : undefined} className={styles.itemLink} />
                    ) : null}
                  </div>
                </article>
              </div>
            ))}
          </div>
          {showControls ? (
            <BookclubSliderControls variant="choice" canPrev={canPrev} canNext={canNext} prevAriaLabel={prevAriaLabel} nextAriaLabel={nextAriaLabel} onPrev={() => sliderRef.current?.goToPrev()} onNext={() => sliderRef.current?.goToNext()} />
          ) : null}
        </div>
      </div>
    </section>
  );
}
