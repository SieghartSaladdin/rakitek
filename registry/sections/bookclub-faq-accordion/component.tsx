"use client";

import { useEffect, useRef, type MouseEvent } from "react";
import gsap from "gsap";
import { BookclubBouncyCta } from "@registry/ui/bookclub-bouncy-cta/component";
import { BookclubMascotPopup } from "@registry/ui/bookclub-mascot-popup/component";
import { FaqBackgroundSvg } from "./bg-svg";
import styles from "./styles.module.css";

export interface BookclubFaqItem {
  id: string;
  question: string;
  answer: string;
  contactEmail?: string;
}

export interface BookclubFaqAccordionProps {
  id?: string;
  title?: string;
  items?: BookclubFaqItem[];
  ctaLabel?: string;
  ctaHref?: string;
  ctaExternal?: boolean;
  showCta?: boolean;
  popupTitle?: string;
  popupCtaLabel?: string;
  popupCtaHref?: string;
  showPopup?: boolean;
  className?: string;
  onCtaClick?: (event: MouseEvent<HTMLElement>) => void;
}

const DEFAULT_FAQ: BookclubFaqItem[] = [
  {
    id: "membership-cost",
    question: "How much does membership cost, my wallet is asking?",
    answer: "In the USA, membership is 17.99 USD/month (accounts for 1 book) and 10.99 for each extra book. In Canada, membership is 25.99 CAD/month (accounts for 1 book) and 15.99 for each extra book.",
  },
  {
    id: "shipping-countries",
    question: "What countries do we ship to?",
    answer: "We ship to the USA & Canada! Please contact support if you are mailing to Puerto Rico, an APO/FPO address, or PO box so we can set up your account.",
    contactEmail: "hello@example.com",
  },
  {
    id: "how-to-join",
    question: "How do I join the club?",
    answer: "You can sign up for membership by downloading our mobile app or by using our website. Place your first order to kickstart your membership!",
  },
];

export function BookclubFaqAccordion({
  id = "faq",
  title = "Common questions",
  items = DEFAULT_FAQ,
  ctaLabel = "Show all FAQ",
  ctaHref = "#faq",
  ctaExternal = false,
  showCta = true,
  popupTitle = "Want to join the Club?",
  popupCtaLabel = "Sign-up now!",
  popupCtaHref = "#signup",
  showPopup = true,
  className = "",
  onCtaClick,
}: BookclubFaqAccordionProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cleanups: (() => void)[] = [];
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 450;
    const easing = "cubic-bezier(.32, .72, 0, 1)";

    root.querySelectorAll<HTMLDetailsElement>("[data-accordion]").forEach((el) => {
      const summary = el.querySelector<HTMLElement>("[data-accordion-summary]");
      const content = el.querySelector<HTMLElement>("[data-accordion-content]");
      if (!summary || !content) return;
      let anim: Animation | null = null;
      let closing = false;
      let expanding = false;

      const finish = (open: boolean) => {
        el.open = open;
        anim = null;
        closing = false;
        expanding = false;
        el.style.height = "";
        el.style.overflow = "";
      };

      const expand = () => {
        expanding = true;
        el.classList.add(styles.detailsActive);
        const startH = `${el.offsetHeight}px`;
        const endH = `${summary.offsetHeight + content.offsetHeight}px`;
        anim?.cancel();
        anim = el.animate({ height: [startH, endH] }, { duration, easing });
        anim.onfinish = () => finish(true);
        anim.oncancel = () => { expanding = false; el.classList.remove(styles.detailsActive); };
      };

      const shrink = () => {
        closing = true;
        el.classList.remove(styles.detailsActive);
        const startH = `${el.offsetHeight}px`;
        const endH = `${summary.offsetHeight}px`;
        anim?.cancel();
        anim = el.animate({ height: [startH, endH] }, { duration, easing });
        anim.onfinish = () => finish(false);
        anim.oncancel = () => { closing = false; el.classList.add(styles.detailsActive); };
      };

      const onClick = (e: globalThis.MouseEvent) => {
        e.preventDefault();
        el.style.overflowY = "clip";
        if (closing || !el.open) {
          el.style.height = `${el.offsetHeight}px`;
          el.open = true;
          requestAnimationFrame(expand);
        } else if (expanding || el.open) {
          shrink();
        }
      };

      summary.addEventListener("click", onClick);
      cleanups.push(() => { summary.removeEventListener("click", onClick); anim?.cancel(); });
    });

    const bgPaths = root.querySelectorAll("[data-background-animation] path");
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      if (!bgPaths.length) return;
      gsap.set(bgPaths, { attr: { "stroke-width": 0 }, rotate: 0, transformOrigin: "center center", transformBox: "fill-box" });
      const tl = gsap.timeline({ repeat: -1 }).to(bgPaths, { attr: { "stroke-width": 60 }, rotate: 2, duration: 3, ease: "sine.inOut" }).to(bgPaths, { attr: { "stroke-width": 0 }, rotate: 0, duration: 3, ease: "sine.inOut" });
      return () => tl.kill();
    });

    return () => {
      mm.revert();
      cleanups.forEach((fn) => fn());
    };
  }, [items.length]);

  return (
    <section ref={rootRef} id={id} data-rk-faq-accordion="" className={[styles.faq, className].filter(Boolean).join(" ")}>
      <div className={styles.container}>
        <div className={styles.inner}>
          <header className={styles.header}><h2 className={styles.title}>{title}</h2></header>
          <div className={styles.content}>
            <div className={styles.accordion}>
              <ul role="list" className={styles.list}>
                {items.map((item) => (
                  <li key={item.id}>
                    <details data-accordion="" className={styles.details}>
                      <summary data-accordion-summary="" className={styles.summary}>
                        <span className={styles.titleWrap}>
                          <h3 className={styles.question}>{item.question}</h3>
                          <span aria-hidden="true" className={styles.iconWrap}>
                            <svg fill="none" viewBox="0 0 20 20" width="100%" className={styles.iconPlus}>
                              <path fill="currentColor" d="M7.84 18.8v-7H1.12V7.88h6.72V.96h4.32v6.92h6.76v3.92h-6.76v7z" />
                            </svg>
                            <svg fill="none" viewBox="0 0 20 20" width="100%" className={styles.iconMinus}>
                              <path fill="currentColor" d="M3.8 7.9h12.4v4.04H3.8z" />
                            </svg>
                          </span>
                        </span>
                      </summary>
                      <div data-accordion-content="">
                        <div className={styles.contentInner}>
                          <p className={styles.answer}>
                            {item.answer}
                            {item.contactEmail ? (
                              <>
                                {" "}
                                <a href={`mailto:${item.contactEmail}`}>{item.contactEmail}</a>
                              </>
                            ) : null}
                          </p>
                        </div>
                      </div>
                    </details>
                  </li>
                ))}
              </ul>
            </div>
            {showCta ? <BookclubBouncyCta label={ctaLabel} href={ctaHref} external={ctaExternal} onClick={onCtaClick} /> : null}
          </div>
          {showPopup ? (
            <div className={styles.easterEgg}>
              <BookclubMascotPopup variant="left" tone="pink" title={popupTitle} ctaLabel={popupCtaLabel} ctaHref={popupCtaHref} />
            </div>
          ) : null}
        </div>
      </div>
      <FaqBackgroundSvg />
    </section>
  );
}
