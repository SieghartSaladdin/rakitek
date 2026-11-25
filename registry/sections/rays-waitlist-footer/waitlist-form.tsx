"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import bubbleStyles from "./bubble.module.css";
import { FEEDBACK_POOLS, IDLE_NUDGES, checkEmail } from "./email-feedback";
import { RevealWords } from "./reveal-text";
import styles from "./styles.module.css";

type SubmitStatus = "idle" | "sending" | "done" | "dupe";
type BubbleSide = "left" | "right" | "center";
type BubbleState =
  | { mode: "hidden" }
  | { mode: "text"; text: string; side: BubbleSide; idle?: boolean }
  | { mode: "enter" };

export type WaitlistSubmitResult = "done" | "dupe" | { error: string } | void;

interface WaitlistFormProps {
  placeholder: string;
  caption: string;
  onSubmit?: (email: string) => Promise<WaitlistSubmitResult> | WaitlistSubmitResult;
}

const PLACEHOLDER_BASE_DELAY = 0.9;
const PLACEHOLDER_LETTER_STEP = 0.07;
const sideFor = (value: string): BubbleSide => (value.includes("@") ? "right" : "left");

export function WaitlistForm({ placeholder, caption, onSubmit }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const [bubble, setBubble] = useState<BubbleState>({ mode: "hidden" });

  const submittedRef = useRef<Set<string>>(new Set());
  const poolCursor = useRef<Partial<Record<keyof typeof FEEDBACK_POOLS, number>>>({});
  const quipTimer = useRef(0);
  const idleCursor = useRef(-1);
  const inputWrapRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const bubbleMeasureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measure = measureRef.current;
    const wrap = inputWrapRef.current;
    if (!measure || !wrap) return;
    measure.textContent = email;
    const wrapWidth = wrap.offsetWidth;
    const halfText = measure.offsetWidth / 2;
    const endX = Math.max(0, Math.min(wrapWidth / 2 + halfText, wrapWidth - 120));
    const startX = Math.min(wrapWidth, Math.max(wrapWidth / 2 - halfText, 120));
    wrap.style.setProperty("--endx", `${endX.toFixed(0)}px`);
    wrap.style.setProperty("--startx", `${startX.toFixed(0)}px`);
    let hash = 0;
    for (const ch of email) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    wrap.style.setProperty("--tilt", `${(Math.abs(hash) % 13) - 6}deg`);
  }, [email]);

  useEffect(() => {
    window.clearTimeout(quipTimer.current);
    if (!email.trim()) {
      setBubble({ mode: "hidden" });
      return;
    }
    const timer = window.setTimeout(() => {
      const verdict = checkEmail(email);
      if (verdict.kind === "pool") {
        const messages = FEEDBACK_POOLS[verdict.pool];
        const index = (poolCursor.current[verdict.pool] ?? -1) + 1;
        poolCursor.current[verdict.pool] = index;
        setBubble({ mode: "text", text: messages[index % messages.length], side: sideFor(email) });
      } else if (verdict.kind === "line") {
        setBubble({ mode: "text", text: verdict.text, side: sideFor(email) });
      } else if (verdict.kind === "quip") {
        setBubble({ mode: "text", text: verdict.text, side: "right" });
        quipTimer.current = window.setTimeout(() => setBubble({ mode: "enter" }), 800);
      } else if (verdict.kind === "enter") {
        setBubble({ mode: "enter" });
      } else {
        setBubble({ mode: "hidden" });
      }
    }, 500);
    return () => window.clearTimeout(timer);
  }, [email]);

  useEffect(() => {
    if (bubble.mode !== "text" || IDLE_NUDGES.includes(bubble.text)) return;
    const timer = window.setTimeout(() => {
      const verdict = checkEmail(email);
      if (verdict.kind === "pool" || verdict.kind === "line") {
        idleCursor.current = (idleCursor.current + 1) % IDLE_NUDGES.length;
        setBubble({ mode: "text", text: IDLE_NUDGES[idleCursor.current], side: "center", idle: true });
      }
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [bubble, email]);

  useEffect(() => {
    const measure = bubbleMeasureRef.current;
    const wrap = inputWrapRef.current;
    if (!measure || !wrap) return;
    if (bubble.mode === "text") {
      measure.textContent = bubble.text;
      const width = measure.offsetWidth + 44 + (bubble.idle ? 26 : 0);
      wrap.style.setProperty("--bw", `${width}px`);
    } else {
      wrap.style.removeProperty("--bw");
    }
  }, [bubble]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const address = email.trim().toLowerCase();
    if (!address || status === "sending") return;
    const verdict = checkEmail(address);
    if (verdict.kind !== "enter" && verdict.kind !== "quip") {
      if (verdict.kind === "pool") {
        setBubble({ mode: "text", text: FEEDBACK_POOLS[verdict.pool][0], side: sideFor(address) });
      } else if (verdict.kind === "line") {
        setBubble({ mode: "text", text: verdict.text, side: sideFor(address) });
      }
      return;
    }
    setStatus("sending");
    setErrorMessage(null);
    if (onSubmit) {
      const res = await onSubmit(address);
      if (res === "dupe") setStatus("dupe");
      else if (res && typeof res === "object" && "error" in res) {
        setStatus("idle");
        setErrorMessage(res.error);
      } else {
        setStatus("done");
      }
      return;
    }
    if (submittedRef.current.has(address)) {
      setStatus("dupe");
    } else {
      submittedRef.current.add(address);
      setStatus("done");
    }
  };

  const resetForm = () => {
    setEmail("");
    setStatus("idle");
    setErrorMessage(null);
    setBubble({ mode: "hidden" });
  };

  if (status === "done" || status === "dupe") {
    return (
      <div className={styles.formZone}>
        <p className={styles.bigDone}>
          <RevealWords text={status === "done" ? "You're in." : "Already in."} base={0.1} step={0.08} />
        </p>
        <p className={styles.caption}>
          <RevealWords
            text={status === "done" ? "We'll email you when the gates open." : "This email is on the list."}
            base={0.4}
          />
        </p>
        <button type="button" className={styles.another} onClick={resetForm}>
          Join with another email
        </button>
      </div>
    );
  }

  const phCenter = Math.max(1, placeholder.length - 1) / 2;
  const bubbleLeft =
    bubble.mode === "text" && bubble.side === "left"
      ? "var(--startx, 50%)"
      : bubble.mode === "text" && bubble.side === "center"
        ? "50%"
        : "var(--endx, 50%)";

  return (
    <form className={styles.formZone} onSubmit={handleSubmit}>
      <div ref={inputWrapRef} className={styles.inputWrap}>
        <span ref={measureRef} className={styles.measure} aria-hidden="true" />
        <input
          className={styles.emailInput}
          type="email"
          required
          aria-label={placeholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={(e) => setFocused(e.target.value.length > 0)}
          disabled={status === "sending"}
        />
        <span className={`${styles.ph} ${focused || email ? styles.phOff : ""}`} aria-hidden="true">
          {[...placeholder].map((letter, i) =>
            letter === " " ? (
              <span key={i}>{"\u00A0"}</span>
            ) : (
              <span
                key={i}
                className={styles.phL}
                style={{
                  animationDelay: `${(PLACEHOLDER_BASE_DELAY + Math.abs(i - phCenter) * PLACEHOLDER_LETTER_STEP).toFixed(2)}s`,
                }}
              >
                {letter}
              </span>
            ),
          )}
        </span>
        <span className={styles.line} aria-hidden="true" />
        <div className={bubbleStyles.bubbleWrap} aria-live="polite" style={{ left: bubbleLeft }}>
          {bubble.mode !== "hidden" && (
            <div
              className={`${bubbleStyles.bubble} ${bubble.mode === "enter" ? bubbleStyles.bubbleEnter : ""} ${
                bubble.mode === "text" && bubble.side === "left"
                  ? bubbleStyles.bubbleLeft
                  : bubble.mode === "text" && bubble.side === "center"
                    ? bubbleStyles.bubbleCenter
                    : ""
              }`}
            >
              {bubble.mode === "enter" ? (
                <button
                  type="submit"
                  className={bubbleStyles.enterBtn}
                  aria-label="Join the waitlist"
                  disabled={status === "sending"}
                >
                  &#x21B5;
                </button>
              ) : (
                <span key={bubble.text} className={bubbleStyles.bubbleText}>
                  {bubble.text}
                  {bubble.idle && (
                    <span className={bubbleStyles.dots} aria-hidden="true"><i /><i /><i /></span>
                  )}
                </span>
              )}
            </div>
          )}
        </div>
        <span ref={bubbleMeasureRef} className={bubbleStyles.bubbleMeasure} aria-hidden="true" />
      </div>
      <p className={styles.caption}>
        <RevealWords text={errorMessage ?? caption} base={errorMessage ? 0 : 1.3} step={0.05} />
      </p>
    </form>
  );
}
