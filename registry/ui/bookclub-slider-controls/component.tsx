"use client";

import styles from "./styles.module.css";

export interface BookclubSliderControlsProps {
  variant?: "default" | "home" | "choice" | "exclusive";
  canPrev?: boolean;
  canNext?: boolean;
  alwaysVisible?: boolean;
  prevAriaLabel?: string;
  nextAriaLabel?: string;
  className?: string;
  onPrev?: () => void;
  onNext?: () => void;
}

const VARIANT_CLASS: Record<NonNullable<BookclubSliderControlsProps["variant"]>, string> = {
  default: "",
  home: styles.home,
  choice: styles.choice,
  exclusive: styles.exclusive,
};

function ArrowRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 14 13" fill="none" aria-hidden="true" className={styles.icon}>
      <path d="M13.58 5.66v.845l-5.994 5.66-1.71-2.063a61.427 61.427 0 0 1 4.265-2.988l-.02-.078c-1.828.196-4.107.294-6.387.294H0V4.835h3.734c2.28 0 4.56.098 6.387.294l.02-.059a67.638 67.638 0 0 1-4.265-3.006L7.586 0l5.994 5.66Z" fill="currentColor" />
    </svg>
  );
}

export function BookclubSliderControls({
  variant = "default",
  canPrev = true,
  canNext = true,
  alwaysVisible = false,
  prevAriaLabel = "Previous Slide",
  nextAriaLabel = "Next Slide",
  className = "",
  onPrev,
  onNext,
}: BookclubSliderControlsProps) {
  const wrapCls = [
    styles.controls,
    VARIANT_CLASS[variant],
    alwaysVisible ? styles.alwaysVisible : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <div data-books-slider-controls="" className={wrapCls}>
      <button
        type="button"
        aria-label={prevAriaLabel}
        data-books-slider-control="prev"
        disabled={!canPrev}
        onClick={onPrev}
        className={[styles.button, styles.previous, !canPrev ? styles.disabled : ""].filter(Boolean).join(" ")}
      >
        <span className={styles.buttonBg} />
        <span className={styles.iconWrap}>
          <ArrowRightIcon />
        </span>
      </button>
      <button
        type="button"
        aria-label={nextAriaLabel}
        data-books-slider-control="next"
        disabled={!canNext}
        onClick={onNext}
        className={[styles.button, !canNext ? styles.disabled : ""].filter(Boolean).join(" ")}
      >
        <span className={styles.buttonBg} />
        <span className={styles.iconWrap}>
          <ArrowRightIcon />
        </span>
      </button>
    </div>
  );
}
