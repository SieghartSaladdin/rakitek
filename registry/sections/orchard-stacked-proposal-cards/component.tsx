"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import { initProposalStackMotion } from "./stack-motion";
import styles from "./styles.module.css";

export interface OrchardProposalCardItem {
  title: string;
  duration: string;
  experience: string;
  includes: string;
  imageSrc: string;
  imageAlt?: string;
}

export interface OrchardStackedProposalCardsProps {
  id?: string;
  title?: string;
  sideLeft?: string;
  sideRight?: string;
  durationLabel?: string;
  experienceLabel?: string;
  includesLabel?: string;
  cards?: OrchardProposalCardItem[];
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_CARDS: OrchardProposalCardItem[] = [
  {
    title: "Citrus Grove\nTasting",
    duration: "2 hours",
    experience: "Guided orchard walk followed by seasonal marmalade and honey pairings.",
    includes: "Grove walk, 5 tastings, artisan tea service",
    imageSrc: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Harvest Kitchen\nWorkshop",
    duration: "3.5 hours",
    experience: "Small-batch copper kettle preserving class with warm sourdough service.",
    includes: "Apron, 2 custom jars to take home, light lunch",
    imageSrc: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1200&q=80&auto=format&fit=crop",
  },
  {
    title: "Terraced Table\nSunset Lunch",
    duration: "3 hours",
    experience: "Long-table seasonal tasting menu overlooking the coastal fruit rows.",
    includes: "4 courses, orchard botanicals, natural wine pairing",
    imageSrc: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=1200&q=80&auto=format&fit=crop",
  },
];

const splitLines = (s: string) => (s || "").split("\n").map((l) => l.trim()).filter(Boolean);

function Lines({ lines }: { lines: string[] }) {
  return (
    <>
      {lines.map((line, i) => (
        <Fragment key={`${i}-${line}`}>
          {i > 0 ? <br /> : null}
          {line}
        </Fragment>
      ))}
    </>
  );
}

export function OrchardStackedProposalCards({
  id,
  title = "Our Proposals",
  sideLeft = "Grove Visits\nAll Year",
  sideRight = "Curated\nTastings",
  durationLabel = "Duration",
  experienceLabel = "The Experience",
  includesLabel = "What is included",
  cards = DEFAULT_CARDS,
  ariaLabel = "Curated experiences",
  className,
}: OrchardStackedProposalCardsProps) {
  const rootRef = useRef<HTMLElement>(null);
  const titleLines = splitLines(title);
  const leftLines = splitLines(sideLeft);
  const rightLines = splitLines(sideRight);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ctx = initProposalStackMotion(root, {
      sideLeft: styles.sideLeft,
      sideRight: styles.sideRight,
      cards: styles.cards,
      stage: styles.stage,
      cardStack: styles.cardStack,
      mediaImg: styles.mediaImg,
    });
    return () => ctx?.revert();
  }, [cards.length]);

  return (
    <section
      id={id}
      ref={rootRef}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <header className={styles.head}>
            <h2 className={styles.title}><Lines lines={titleLines} /></h2>
            {leftLines.length ? <p className={`${styles.side} ${styles.sideLeft}`}><Lines lines={leftLines} /></p> : null}
            {rightLines.length ? <p className={`${styles.side} ${styles.sideRight}`}><Lines lines={rightLines} /></p> : null}
          </header>
        </div>
      </div>

      {cards.length ? (
        <div className={styles.cards} style={{ "--experience-card-count": String(cards.length) } as CSSProperties}>
          <div className={styles.stage}>
            <div className={styles.stack} data-proposal-stack="">
              {cards.map((card, i) => (
                <article key={`${i}-${card.title}`} className={`${styles.card} ${styles.cardStack}`}>
                  <div className={styles.media}>
                    <img className={styles.mediaImg} src={card.imageSrc} alt={card.imageAlt ?? card.title} loading="lazy" decoding="async" />
                  </div>
                  <div className={styles.body}>
                    <p className={styles.number}>{`${String(i + 1).padStart(2, "0")}.`}</p>
                    <div className={`${styles.row} ${styles.rowTitle}`}>
                      <h3 className={styles.cardTitle}>{card.title}</h3>
                      <div>
                        <p className={styles.label}>{durationLabel}</p>
                        <p className={styles.text}>{card.duration}</p>
                      </div>
                    </div>
                    <div className={`${styles.row} ${styles.rowDetails}`}>
                      <div>
                        <p className={styles.label}>{experienceLabel}</p>
                        <p className={styles.text}>{card.experience}</p>
                      </div>
                      <div>
                        <p className={styles.label}>{includesLabel}</p>
                        <p className={styles.text}>{card.includes}</p>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
