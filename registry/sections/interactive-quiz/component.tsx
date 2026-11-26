"use client";

import { useState } from "react";
import styles from "./styles.module.css";

export interface QuizChoice {
  id: string;
  label: string;
  matchKey: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: QuizChoice[];
}

export interface QuizResultItem {
  key: string;
  title: string;
  summary: string;
  ctaLabel: string;
  ctaHref?: string;
  secondaryCtaLabel?: string;
  image?: string;
  imageAlt?: string;
}

export interface InteractiveQuizProps {
  id?: string;
  eyebrow?: string;
  stepLabel?: string;
  ariaLabel?: string;
  noPreviousLabel?: string;
  previousLabel?: string;
  answerFirstLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
  retakeLabel?: string;
  /** Word between the step numbers ("Question 1 of 2"). Ignored when `progressLabel` is given. */
  ofLabel?: string;
  /** Full override for the step text, e.g. (n, total) => `Pertanyaan ${n}/${total}`. */
  progressLabel?: (current: number, total: number) => string;
  navAriaLabel?: string;
  /** The source theme hides the fill (empty div), so it is off by default for a 1:1 match. */
  progressFill?: boolean;
  questions: QuizQuestion[];
  results: QuizResultItem[];
  onCompleteAction?: (result: QuizResultItem) => void;
  onSecondaryAction?: (result: QuizResultItem) => void;
}

function ResultSilhouette() {
  return (
    <svg
      width="56"
      height="72"
      viewBox="0 0 56 72"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M10 14h36l4 52H6l4-52Z" />
      <path d="M6 26h44" />
      <rect x="18" y="34" width="20" height="16" />
    </svg>
  );
}

export function InteractiveQuiz({
  id = "quiz",
  eyebrow = "Your Recommended Match",
  stepLabel = "Question",
  ariaLabel = "Product recommendation quiz",
  noPreviousLabel = "No previous question",
  previousLabel = "Previous",
  answerFirstLabel = "Answer before proceeding",
  nextLabel = "Next question",
  finishLabel = "See my match",
  retakeLabel = "Retake quiz",
  ofLabel = "of",
  progressLabel,
  navAriaLabel = "Quiz navigation buttons",
  progressFill = false,
  questions,
  results,
  onCompleteAction,
  onSecondaryAction,
}: InteractiveQuizProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizChoice>>({});
  const [completed, setCompleted] = useState(false);

  const totalSteps = Math.max(1, questions.length);
  const current = questions[step];
  const selected = current ? answers[current.id] : undefined;
  const progress = completed ? 100 : ((step + 1) / totalSteps) * 100;

  const computeMatch = (): QuizResultItem | null => {
    if (results.length === 0) return null;
    const scores: Record<string, number> = {};
    Object.values(answers).forEach((choice) => {
      scores[choice.matchKey] = (scores[choice.matchKey] ?? 0) + 1;
    });
    const bestKey = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0];
    return results.find((r) => r.key === bestKey) ?? results[0];
  };

  const handleChoose = (opt: QuizChoice) => {
    if (!current) return;
    setAnswers((prev) => ({ ...prev, [current.id]: opt }));
  };

  const handleNext = () => {
    if (!selected) return;
    if (step < questions.length - 1) {
      setStep((s) => s + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setStep(0);
    setCompleted(false);
  };

  const matched = completed ? computeMatch() : null;
  const stepText = progressLabel
    ? progressLabel(step + 1, questions.length)
    : `${stepLabel} ${step + 1} ${ofLabel} ${questions.length}`;

  return (
    <section id={id} className={styles.section} aria-label={ariaLabel}>
      <div className={styles.container}>
        <div className={styles.header}>
          <p className={styles.eyebrow}>
            {completed ? eyebrow : stepText}
          </p>
          <div className={styles.progress}>
            {progressFill ? (
              <div className={styles.progressBar} style={{ width: `${progress}%` }} />
            ) : null}
          </div>
        </div>

        {!completed && current ? (
          <div
            className={styles.body}
            role="region"
            aria-label={stepText}
          >
            <h2 className={styles.prompt}>{current.prompt}</h2>

            <div className={styles.options}>
              {current.options.map((opt) => {
                const isSelected = selected?.id === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleChoose(opt)}
                    className={`${styles.option}${isSelected ? ` ${styles.optionSelected}` : ""}`}
                    aria-pressed={isSelected}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>

            <nav className={styles.nav} aria-label={navAriaLabel}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnGhost}`}
                disabled={step === 0}
                onClick={() => setStep((s) => Math.max(0, s - 1))}
              >
                {step === 0 ? noPreviousLabel : previousLabel}
              </button>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDark}`}
                disabled={!selected}
                onClick={handleNext}
              >
                {!selected
                  ? answerFirstLabel
                  : step === questions.length - 1
                    ? finishLabel
                    : nextLabel}
              </button>
            </nav>
          </div>
        ) : matched ? (
          <div className={styles.result}>
            <div className={styles.resultInfo}>
              <h2 className={styles.resultTitle}>{matched.title}</h2>
              <p className={styles.resultDesc}>{matched.summary}</p>
              <div className={styles.resultActions}>
                {matched.ctaHref ? (
                  <a
                    href={matched.ctaHref}
                    className={`${styles.btn} ${styles.btnDark}`}
                    onClick={() => onCompleteAction?.(matched)}
                  >
                    {matched.ctaLabel}
                  </a>
                ) : (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDark}`}
                    onClick={() => onCompleteAction?.(matched)}
                  >
                    {matched.ctaLabel}
                  </button>
                )}
                {matched.secondaryCtaLabel ? (
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnGhost}`}
                    onClick={() => onSecondaryAction?.(matched)}
                  >
                    {matched.secondaryCtaLabel}
                  </button>
                ) : null}
                <button type="button" className={styles.retake} onClick={handleReset}>
                  {retakeLabel}
                </button>
              </div>
            </div>
            <div className={styles.resultMedia}>
              {matched.image ? (
                <img src={matched.image} alt={matched.imageAlt ?? matched.title} />
              ) : (
                <div className={styles.resultPlaceholder}>
                  <ResultSilhouette />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
