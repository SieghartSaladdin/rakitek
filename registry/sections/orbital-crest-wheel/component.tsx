"use client";

import {
  memo,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { CrestArt } from "./crest-art";
import {
  DEFAULT_SPOKE_COUNT,
  SPOKE_PHASE_DEG,
  startOrbitalWheelEngine,
  type OrbitalCrestItem,
} from "./wheel-engine";
import styles from "./styles.module.css";

export type { OrbitalCrestItem };

export interface OrbitalCrestWheelProps {
  id?: string;
  label?: string;
  chapter?: string;
  kicker?: string;
  headlineLines?: string[];
  lead?: string;
  blurb?: string;
  crests?: OrbitalCrestItem[];
  spokeCount?: number;
  className?: string;
}

const DEFAULT_CRESTS: OrbitalCrestItem[] = [
  { name: "The Iron Foundry", motifIndex: 0 },
  { name: "The Field Chroniclers", motifIndex: 1 },
  { name: "The Solstice Wardens", motifIndex: 2 },
  { name: "The Keystone Keepers", motifIndex: 3 },
  { name: "The Meridian Sailors", motifIndex: 4 },
];

const DEFAULT_HEADLINE_LINES = ["Pick a house.", "They shape", "your craft"];
const DEFAULT_LEAD = "A circle is a quiet corner built around one craft.";
const DEFAULT_BLURB =
  "Building stamina. Stepping outside more. Slowing down. Making things. Join the circles that match the days you want, and let shared rituals guide your next move. Or open your own chapter for your city, your neighbors, and pull others in. Nobody is ranked. You simply see you are not alone.";

const letterStyle = (index: number): CSSProperties => ({ ["--i" as string]: index });

function renderWordLetters(text: string, wordClass: string, letterClass: string): ReactNode[] {
  const words = text.split(" ");
  let offset = 0;
  return words.flatMap((word, wordIndex) => {
    const start = offset;
    offset += [...word].length;
    const node = (
      <span key={`w${wordIndex}`} className={wordClass}>
        {[...word].map((char, i) => (
          <span key={i} className={letterClass} style={letterStyle(start + i)}>
            {char}
          </span>
        ))}
      </span>
    );
    return wordIndex < words.length - 1 ? [node, " "] : [node];
  });
}

function renderHeadlineRows(lines: string[]): ReactNode[] {
  let offset = 0;
  return lines.map((line, rowIndex) => {
    const start = offset;
    let letters = 0;
    const children = [...line].map((char, i) => {
      if (char === " ") return <span key={i}>{"\u00A0"}</span>;
      const node = (
        <span key={i} className={styles.letter} style={letterStyle(start + letters)}>
          {char}
        </span>
      );
      letters++;
      return node;
    });
    offset += letters;
    return (
      <span key={rowIndex} className={styles.headRow}>
        {children}
      </span>
    );
  });
}

function OrbitalCrestWheelBase({
  id,
  label = "About Houses",
  chapter = "Chapter 07",
  kicker = "Join a house. Or start one.",
  headlineLines = DEFAULT_HEADLINE_LINES,
  lead = DEFAULT_LEAD,
  blurb = DEFAULT_BLURB,
  crests = DEFAULT_CRESTS,
  spokeCount = DEFAULT_SPOKE_COUNT,
  className,
}: OrbitalCrestWheelProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wheelRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLParagraphElement>(null);
  const headWrapRef = useRef<HTMLDivElement>(null);
  const crestRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const inViewRef = useRef(false);
  const [inView, setInView] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof IntersectionObserver === "undefined"
    ) {
      inViewRef.current = true;
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
        setInView(entry.isIntersecting);
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const wheel = wheelRef.current;
    const nameEl = nameRef.current;
    if (!section || !wheel || !nameEl) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return startOrbitalWheelEngine({
      section,
      wheel,
      nameEl,
      headWrap: headWrapRef.current,
      crestRefs,
      inViewRef,
      crests: crests.length > 0 ? crests : DEFAULT_CRESTS,
      spokeCount: Math.max(1, spokeCount),
      isMobile,
      reducedMotion,
    });
  }, [crests, isMobile, spokeCount]);

  const activeCrests = crests.length > 0 ? crests : DEFAULT_CRESTS;
  const totalSpokes = Math.max(1, spokeCount);
  const sectionClasses = [styles.section, inView ? styles.in : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} ref={sectionRef} className={sectionClasses}>
      <div className={styles.topbar}>
        <span>{label}</span>
        <span>{chapter}</span>
      </div>
      <div ref={wheelRef} className={styles.wheel} aria-hidden="true">
        {Array.from({ length: totalSpokes }, (_, i) => {
          const crest = activeCrests[i % activeCrests.length];
          const motif = crest.motifIndex ?? i % 5;
          return (
            <div
              key={i}
              className={styles.spoke}
              style={{ transform: `rotate(${(i * 360) / totalSpokes + SPOKE_PHASE_DEG}deg)` }}
            >
              <span
                className={styles.crest}
                ref={(el) => {
                  crestRefs.current[i] = el;
                }}
              >
                <CrestArt motifIndex={motif} className={styles.crestArt} />
              </span>
            </div>
          );
        })}
      </div>
      <p ref={nameRef} className={styles.crestName} aria-hidden="true" />
      <div className={styles.shader} aria-hidden="true">
        <div className={`${styles.shaderBlur} ${styles.sb1}`} />
        <div className={`${styles.shaderBlur} ${styles.sb2}`} />
        <div className={styles.shaderGrad} />
      </div>
      <div className={styles.cover} aria-hidden="true" />
      <p className={styles.kicker}>{kicker}</p>
      <div ref={headWrapRef} className={styles.headWrap}>
        <h2 className={styles.head}>
          {isMobile
            ? renderWordLetters(headlineLines.join(" "), styles.leadWord, styles.letter)
            : renderHeadlineRows(headlineLines)}
        </h2>
      </div>
      <div className={styles.leadStack}>
        <p className={styles.lead}>
          {renderWordLetters(lead, styles.leadWord, styles.leadLetter)}
        </p>
        <p className={styles.blurbBody}>{blurb}</p>
      </div>
    </section>
  );
}

export const OrbitalCrestWheel = memo(OrbitalCrestWheelBase);
export default OrbitalCrestWheel;
