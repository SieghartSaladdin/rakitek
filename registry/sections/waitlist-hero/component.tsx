"use client";

import { useCallback, useEffect, useRef, useState, type FormEvent, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./styles.module.css";

const MARQUEE_REPEAT = 8;
const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
const EASE_SMOOTH = [0.32, 0.72, 0, 1] as const;
const SPRING_SNAPPY = { type: "spring", stiffness: 280, damping: 22 } as const;
const REVEAL_HIDDEN = { opacity: 0, y: 40, filter: "blur(10px)" } as const;
const REVEAL_SHOWN = { opacity: 1, y: 0, filter: "blur(0px)" } as const;
const REVEAL_TRANSITION = { duration: 0.8, ease: EASE_SMOOTH } as const;
const REVEAL_STAGGER = 0.1;

export type WaitlistSubmitResult = "success" | "duplicate" | "error";

export interface WaitlistHeroProps {
  id?: string;
  marqueeText?: string;
  mobileOfferText?: string;
  memberCount?: number | null;
  memberCountLabel?: string;
  headline?: string;
  emailPlaceholder?: string;
  consentLabel?: string;
  ratingTitle?: string;
  ratingSubtitle?: string;
  submitLabel?: string;
  submittingLabel?: string;
  successTitle?: string;
  successSubtitle?: string;
  duplicateMessage?: string;
  errorMessage?: string;
  onRate?: (stars: number) => Promise<void> | void;
  onJoin?: (payload: {
    email: string;
    allowContact: boolean;
    rating: number;
  }) => Promise<WaitlistSubmitResult | void> | WaitlistSubmitResult | void;
}

type SubmitState = "idle" | "loading" | WaitlistSubmitResult;

export function WaitlistHero({
  id,
  marqueeText = "First 500 get free lifetime",
  mobileOfferText = "First 500 get free lifetime.",
  memberCount = null,
  memberCountLabel = "people on the list",
  headline = "Sign up to\nwaitlist",
  emailPlaceholder = "Your Email",
  consentLabel = "Allow occasional messages when we need feedback on upcoming features",
  ratingTitle = "What do you think of the idea?",
  ratingSubtitle = "We want to know if it makes sense",
  submitLabel = "Sign Up",
  submittingLabel = "Joining...",
  successTitle = "You're on the list",
  successSubtitle = "We'll reach out when it's ready.",
  duplicateMessage = "You're already on the list.",
  errorMessage = "Something went wrong. Try again.",
  onRate,
  onJoin,
}: WaitlistHeroProps) {
  const reducedMotion = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const [visible, setVisible] = useState(Boolean(reducedMotion));
  const [email, setEmail] = useState("");
  const [allowContact, setAllowContact] = useState(false);
  const [hoverStars, setHoverStars] = useState(0);
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<SubmitState>("idle");
  const [count, setCount] = useState<number | null>(memberCount);

  useEffect(() => { setCount(memberCount); }, [memberCount]);

  useEffect(() => {
    const node = sectionRef.current;
    if (reducedMotion || !node || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [reducedMotion]);

  const setSpot = (el: HTMLElement | null, prefix: string, x: string, y: string) => {
    if (!el) return;
    el.style.setProperty(`--${prefix}-x`, x);
    el.style.setProperty(`--${prefix}-y`, y);
  };

  const handleSectionMove = useCallback((event: MouseEvent<HTMLElement>) => {
    setSpot(sectionRef.current, "spot", `${event.clientX}px`, `${event.clientY}px`);
  }, []);

  const handleSectionLeave = useCallback(() => {
    setSpot(sectionRef.current, "spot", "-100%", "-100%");
  }, []);

  const handleHeadlineMove = useCallback((event: MouseEvent<HTMLHeadingElement>) => {
    const el = headlineRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot(el, "h-spot", `${((event.clientX - rect.left) / rect.width) * 100}%`, `${((event.clientY - rect.top) / rect.height) * 100}%`);
  }, []);

  const handleHeadlineLeave = useCallback(() => {
    setSpot(headlineRef.current, "h-spot", "-100%", "-100%");
  }, []);

  const handleRate = (stars: number) => {
    setRating(stars);
    void Promise.resolve(onRate?.(stars)).catch(() => {});
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || state === "loading") return;
    setState("loading");
    try {
      const result = (await onJoin?.({ email: trimmed, allowContact, rating })) ?? "success";
      setState(result);
      if (result === "success") setCount((cur) => (cur === null ? null : cur + 1));
    } catch {
      setState("error");
    }
  };

  const shownStars = hoverStars || rating;
  const instant = Boolean(reducedMotion);
  const reveal = (delay: number) => (instant ? { duration: 0 } : { ...REVEAL_TRANSITION, delay });

  return (
    <section
      id={id}
      ref={sectionRef}
      className={styles.section}
      onMouseMove={handleSectionMove}
      onMouseLeave={handleSectionLeave}
    >
      <div className={styles.marquee} aria-hidden="true">
        <div className={styles.marqueeTrack}>
          {Array.from({ length: MARQUEE_REPEAT }).map((_, index) => (
            <span key={index} className={styles.marqueeText}>{marqueeText}</span>
          ))}
        </div>
      </div>

      <div className={styles.inner}>
        {count !== null && (
          <motion.div
            className={styles.countPill}
            initial={instant ? false : { opacity: 0, y: 10 }}
            animate={visible ? { opacity: 1, y: 0 } : {}}
            transition={instant ? { duration: 0 } : { duration: 0.6, ease: EASE_SMOOTH }}
          >
            <span className={styles.countDot} aria-hidden="true" />
            <span className={styles.countText}>{count} {memberCountLabel}</span>
          </motion.div>
        )}

        <motion.h2
          ref={headlineRef}
          className={styles.headline}
          initial={instant ? false : REVEAL_HIDDEN}
          animate={visible ? REVEAL_SHOWN : {}}
          transition={reveal(REVEAL_STAGGER)}
          onMouseMove={handleHeadlineMove}
          onMouseLeave={handleHeadlineLeave}
        >
          {headline}
        </motion.h2>

        <motion.p
          className={styles.mobileOffer}
          initial={instant ? false : REVEAL_HIDDEN}
          animate={visible ? REVEAL_SHOWN : {}}
          transition={reveal(REVEAL_STAGGER * 1.5)}
        >
          {mobileOfferText}
        </motion.p>

        <motion.div
          className={styles.card}
          initial={instant ? false : { opacity: 0 }}
          animate={visible ? { opacity: 1 } : {}}
          transition={reveal(REVEAL_STAGGER * 2)}
        >
          {state === "success" ? (
            <div className={styles.success} role="status">
              <p className={styles.successTitle}>{successTitle}</p>
              <p className={styles.successSub}>{successSubtitle}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <input
                className={styles.input}
                type="email"
                placeholder={emailPlaceholder}
                aria-label="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <label className={styles.checkLabel}>
                <input type="checkbox" className={styles.checkbox} checked={allowContact} onChange={(event) => setAllowContact(event.target.checked)} />
                <span>{consentLabel}</span>
              </label>
              <div className={styles.ratingBlock}>
                <p className={styles.ratingTitle}>{ratingTitle}</p>
                <p className={styles.ratingSub}>{ratingSubtitle}</p>
                <div className={styles.stars} role="group" aria-label={ratingTitle}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <motion.button
                      key={star}
                      type="button"
                      className={`${styles.star} ${star <= shownStars ? styles.filled : ""}`}
                      aria-label={`Rate ${star} out of 5 stars`}
                      aria-pressed={star <= rating}
                      onMouseEnter={() => setHoverStars(star)}
                      onMouseLeave={() => setHoverStars(0)}
                      onClick={() => handleRate(star)}
                      whileHover={instant ? undefined : { scale: 1.2 }}
                      whileTap={instant ? undefined : { scale: 0.9 }}
                      transition={SPRING_SNAPPY}
                    >
                      <svg width="28" height="28" viewBox="0 0 24 24" fill={star <= shownStars ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                        <path d={STAR_PATH} />
                      </svg>
                    </motion.button>
                  ))}
                </div>
              </div>
              {state === "duplicate" && <p className={styles.errorMsg} role="alert">{duplicateMessage}</p>}
              {state === "error" && <p className={styles.errorMsg} role="alert">{errorMessage}</p>}
              <button type="submit" className={styles.submitBtn} disabled={state === "loading" || !email.trim()}>
                {state === "loading" ? submittingLabel : submitLabel}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
