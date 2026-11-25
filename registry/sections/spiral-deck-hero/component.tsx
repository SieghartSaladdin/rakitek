"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { DEFAULT_SPIRAL_CARDS, HERO_SPIRAL_CONFIG, type DeckConfig } from "./deck-data";
import { mountSpiralDeck, type SpiralDeckController } from "./deck-scene";
import { DEFAULT_FOOTER_NOTE, type SpiralCardItem } from "./deck-textures";
import styles from "./styles.module.css";

export { DEFAULT_SPIRAL_CARDS };
export type { DeckConfig, SpiralCardItem };

const HEADLINE_SIDE_MARGIN = 40;

export interface SpiralDeckHeroProps {
  brandName?: string;
  brandMark?: ReactNode;
  tagline?: string;
  ctaLabel?: string;
  headline?: string;
  cards?: SpiralCardItem[];
  footerNote?: string;
  deckConfig?: Partial<DeckConfig>;
  onCtaClick?: () => void;
  onBrandClick?: () => void;
}

function DefaultBrandSvg() {
  return (
    <svg
      className={styles.logo}
      viewBox="0 0 1329 250"
      width="128"
      height="24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M126 14L224 70V180L126 236L28 180V70L126 14ZM126 56L66 90V160L126 194L186 160V90L126 56Z"
        fill="currentColor"
      />
      <circle cx="126" cy="125" r="28" fill="currentColor" />
      <path
        d="M402 24C476 24 528 66 528 134C528 202 476 244 402 244C328 244 276 202 276 134C276 66 328 24 402 24ZM402 78C366 78 346 100 346 134C346 168 366 190 402 190C438 190 458 168 458 134C458 100 438 78 402 78Z"
        fill="currentColor"
      />
      <path
        d="M554 28H692C746 28 782 54 782 100C782 134 762 154 724 162V165C758 172 784 196 786 239H704C702 196 678 174 628 174V239H554V28ZM628 82V128H678C698 128 710 120 710 105C710 90 698 82 678 82H628Z"
        fill="currentColor"
      />
      <rect x="814" y="28" width="74" height="211" fill="currentColor" />
      <path d="M922 28H1102V82H996V108H1086V158H996V185H1106V239H922V28Z" fill="currentColor" />
      <path d="M1138 28H1212V182H1329V239H1138V28Z" fill="currentColor" />
    </svg>
  );
}

export function SpiralDeckHero({
  brandName = "ORIEL",
  brandMark,
  tagline = "One real-world challenge a day. Four skills that grow when you act out in the world.",
  ctaLabel = "Join Waitlist",
  headline = "Return to living",
  cards = DEFAULT_SPIRAL_CARDS,
  footerNote = DEFAULT_FOOTER_NOTE,
  deckConfig,
  onCtaClick,
  onBrandClick,
}: SpiralDeckHeroProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const deckRef = useRef<SpiralDeckController | null>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const headlineWords = useMemo(() => {
    let idx = 0;
    return headline
      .trim()
      .split(/\s+/)
      .map((word, w) => ({
        key: `w${w}`,
        letters: [...word].map((char) => ({ char, delay: `${idx++ * 0.045}s` })),
      }));
  }, [headline]);

  useEffect(() => {
    const el = headlineRef.current;
    if (!el) return;
    let lastW = 0;
    const fit = () => {
      const w = window.innerWidth;
      if (w <= 768) {
        el.style.fontSize = "";
        lastW = w;
        return;
      }
      lastW = w;
      const target = w - HEADLINE_SIDE_MARGIN * 2;
      el.style.fontSize = "200px";
      const natural = el.scrollWidth;
      if (natural > 0) el.style.fontSize = `${(200 * target) / natural}px`;
    };
    const onResize = () => {
      if (window.innerWidth !== lastW) fit();
    };
    fit();
    window.addEventListener("resize", onResize);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", onResize);
  }, [headline]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const controller = mountSpiralDeck(
      canvas,
      cards,
      footerNote,
      reduced,
      deckConfig ?? HERO_SPIRAL_CONFIG,
    );
    if (!controller) {
      setWebglFailed(true);
      return;
    }
    setWebglFailed(false);
    deckRef.current = controller;
    return () => {
      controller.dispose();
      deckRef.current = null;
    };
  }, [cards, footerNote, deckConfig]);

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    if (e.pointerType !== "touch") e.currentTarget.setPointerCapture?.(e.pointerId);
    dragStart.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      deckRef.current?.setPointer(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      );
    }
    if (!dragStart.current) return;
    const delta =
      e.pointerType === "touch"
        ? (e.clientX - dragStart.current.x) * 0.008
        : -(e.clientY - dragStart.current.y) * 0.006;
    dragStart.current = { x: e.clientX, y: e.clientY };
    deckRef.current?.dragBy(delta);
  };

  const handlePointerUp = () => {
    dragStart.current = null;
  };

  const lastWord = headlineWords.length - 1;

  return (
    <section className={styles.stage} aria-label={headline}>
      <div className={styles.scene}>
        {webglFailed ? (
          <div className={styles.fallbackFan} aria-hidden="true">
            {cards.slice(0, 3).map((card, i) => (
              <article
                key={card.id}
                className={styles.fallbackCard}
                style={{ transform: `rotate(${(i - 1) * 7}deg)` }}
              >
                <span className={styles.fallbackHouse}>{card.house}</span>
                <h2 className={styles.fallbackTitle}>{card.title}</h2>
                <p className={styles.fallbackBody}>{card.body}</p>
              </article>
            ))}
          </div>
        ) : (
          <canvas
            ref={canvasRef}
            className={styles.canvas}
            aria-hidden="true"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
          />
        )}
      </div>

      <header className={styles.hero}>
        <div className={styles.scrim} aria-hidden="true">
          <div className={`${styles.blur} ${styles.b1}`} />
          <div className={`${styles.blur} ${styles.b2}`} />
          <div className={styles.grad} />
        </div>

        <nav className={styles.nav} aria-label="Primary">
          <button
            type="button"
            className={styles.logoBtn}
            onClick={onBrandClick}
            aria-label={`${brandName}, back to top`}
          >
            {brandMark ?? <DefaultBrandSvg />}
          </button>
          <p className={styles.tagline}>{tagline}</p>
          <button type="button" className={styles.cta} onClick={onCtaClick}>
            {ctaLabel}
          </button>
        </nav>

        <h1 ref={headlineRef} className={styles.headline} aria-label={headline}>
          {headlineWords.flatMap((word, w) => {
            const wordEl = (
              <span key={word.key} className={styles.word}>
                {word.letters.map((letter, l) => (
                  <span
                    key={l}
                    className={styles.letter}
                    style={{ animationDelay: letter.delay } as CSSProperties}
                  >
                    {letter.char}
                  </span>
                ))}
              </span>
            );
            return w < lastWord
              ? [wordEl, <span key={`s${w}`} className={styles.space} aria-hidden="true" />]
              : [wordEl];
          })}
        </h1>
      </header>
    </section>
  );
}
