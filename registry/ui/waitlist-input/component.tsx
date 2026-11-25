"use client";

import { useState, type FormEvent } from "react";
import styles from "./styles.module.css";

const STAR_PATH =
  "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type WaitlistSubmitOutcome = "success" | "duplicate" | "error";

export interface WaitlistInputMeta {
  allowContact: boolean;
  rating: number;
}

export interface WaitlistInputProps {
  placeholder?: string;
  submitLabel?: string;
  submittingLabel?: string;
  optInLabel?: string | null;
  showRating?: boolean;
  ratingTitle?: string;
  ratingSubtitle?: string;
  successTitle?: string;
  successMessage?: string;
  duplicateMessage?: string;
  errorMessage?: string;
  invalidEmailMessage?: string;
  onSubmitEmail?: (
    email: string,
    meta: WaitlistInputMeta,
  ) => Promise<WaitlistSubmitOutcome | void> | WaitlistSubmitOutcome | void;
  onRate?: (stars: number) => void;
  className?: string;
}

type SubmitState = "idle" | "loading" | "success" | "duplicate" | "error";

export function WaitlistInput({
  placeholder = "Your Email",
  submitLabel = "Sign Up",
  submittingLabel = "Joining...",
  optInLabel = "Allow the team to contact me if they need feedback on early updates",
  showRating = true,
  ratingTitle = "What do you think of the idea?",
  ratingSubtitle = "We want to know if it makes sense",
  successTitle = "You're on the list",
  successMessage = "We'll reach out when it's ready.",
  duplicateMessage = "You're already on the list.",
  errorMessage = "Something went wrong. Try again.",
  invalidEmailMessage = "Please enter a valid email address.",
  onSubmitEmail,
  onRate,
  className,
}: WaitlistInputProps) {
  const [email, setEmail] = useState("");
  const [allowContact, setAllowContact] = useState(false);
  const [hoverStars, setHoverStars] = useState(0);
  const [rating, setRating] = useState(0);
  const [state, setState] = useState<SubmitState>("idle");
  const [customError, setCustomError] = useState<string | null>(null);

  const handleRate = (stars: number) => {
    setRating(stars);
    onRate?.(stars);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const cleaned = email.trim();
    if (!cleaned || state === "loading") return;

    if (!EMAIL_RE.test(cleaned)) {
      setState("error");
      setCustomError(invalidEmailMessage);
      return;
    }

    setState("loading");
    setCustomError(null);
    try {
      const outcome = (await onSubmitEmail?.(cleaned, { allowContact, rating })) ?? "success";
      setState(outcome);
      if (outcome === "success") {
        setEmail("");
      }
    } catch {
      setState("error");
    }
  };

  const shownStars = hoverStars || rating;
  const cardClass = className ? `${styles.card} ${className}` : styles.card;

  return (
    <div className={cardClass}>
      {state === "success" ? (
        <div className={styles.success} role="status">
          <p className={styles.successTitle}>{successTitle}</p>
          <p className={styles.successSub}>{successMessage}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className={styles.form}>
          <input
            className={styles.input}
            type="email"
            placeholder={placeholder}
            aria-label="Email address"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              if (state === "error" || state === "duplicate") {
                setState("idle");
                setCustomError(null);
              }
            }}
            required
          />

          {optInLabel ? (
            <label className={styles.checkLabel}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={allowContact}
                onChange={(event) => setAllowContact(event.target.checked)}
              />
              <span>{optInLabel}</span>
            </label>
          ) : null}

          {showRating ? (
            <div className={styles.ratingBlock}>
              <p className={styles.ratingTitle}>{ratingTitle}</p>
              <p className={styles.ratingSub}>{ratingSubtitle}</p>
              <div className={styles.stars} role="group" aria-label={ratingTitle}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`${styles.star} ${star <= shownStars ? styles.starFilled : ""}`}
                    aria-label={`Rate ${star} out of 5 stars`}
                    aria-pressed={star <= rating}
                    onMouseEnter={() => setHoverStars(star)}
                    onMouseLeave={() => setHoverStars(0)}
                    onClick={() => handleRate(star)}
                  >
                    <svg
                      width="28"
                      height="28"
                      viewBox="0 0 24 24"
                      fill={star <= shownStars ? "currentColor" : "none"}
                      stroke="currentColor"
                      strokeWidth="1.5"
                      aria-hidden="true"
                    >
                      <path d={STAR_PATH} />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {state === "duplicate" ? (
            <p className={styles.errorMsg} role="alert">
              {duplicateMessage}
            </p>
          ) : null}

          {state === "error" ? (
            <p className={styles.errorMsg} role="alert">
              {customError ?? errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={state === "loading" || !email.trim()}
          >
            {state === "loading" ? submittingLabel : submitLabel}
          </button>
        </form>
      )}
    </div>
  );
}
