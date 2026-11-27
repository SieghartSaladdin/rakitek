"use client";

import { useEffect, useRef, useState } from "react";
import { LineReveal, RevealWords } from "@registry/ui/mono-line-reveal/component";
import styles from "./styles.module.css";

export interface ManifestoSegment {
  text: string;
  /** Id of a person whose portrait appears while this text is hovered or focused. */
  personId?: string;
}

export interface ManifestoPerson {
  id: string;
  image: string;
  alt: string;
  caption: string;
  width?: number;
  height?: number;
}

export interface FounderHoverManifestoProps {
  id?: string;
  ariaLabel?: string;
  /** Each paragraph is a list of segments; plain segments are text, tagged ones reveal a portrait. */
  paragraphs?: ManifestoSegment[][];
  people?: ManifestoPerson[];
  /** Hide the floating portrait panel. */
  showPortraits?: boolean;
  /** Pause before a portrait opens on hover, in ms. Default 60. */
  hoverDelayMs?: number;
}

const DEFAULT_PEOPLE: ManifestoPerson[] = [
  {
    id: "lead",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=692&q=80&auto=format&fit=crop",
    alt: "Portrait of a man looking at the camera.",
    caption: "Alex Moreau (Design Director)",
    width: 692,
    height: 898,
  },
  {
    id: "partner",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=692&q=80&auto=format&fit=crop",
    alt: "Portrait of a woman smiling.",
    caption: "Mira Lindqvist (Managing Director)",
    width: 692,
    height: 898,
  },
];

const DEFAULT_PARAGRAPHS: ManifestoSegment[][] = [
  [
    { text: "Northline is a concept-driven design studio founded by " },
    { text: "Mira Lindqvist", personId: "partner" },
    { text: " and " },
    { text: "Alex Moreau", personId: "lead" },
    { text: " in 2018 and based in the EU (AMS, WAW, BER)." },
  ],
  [
    {
      text: "Rooted in modernist design principles and graphic design tradition, our work combines typography, grid systems and motion to create digital experiences that balance clarity, usability and bold visual expression.",
    },
  ],
  [
    {
      text: "Our team remains intentionally small, under 10 people, which allows creative direction to stay personal and decisions to stay sharp. Every project is led closely",
    },
  ],
  [{ text: "by the founders. No layers. No dilution." }],
];

export function FounderHoverManifesto({
  id,
  ariaLabel = "Studio manifesto",
  paragraphs = DEFAULT_PARAGRAPHS,
  people = DEFAULT_PEOPLE,
  showPortraits = true,
  hoverDelayMs = 60,
}: FounderHoverManifestoProps) {
  const [active, setActive] = useState<string | null>(null);
  const [lastShown, setLastShown] = useState<string | null>(null);
  const previous = useRef<string | null>(null);
  const delay = useRef<number | null>(null);

  useEffect(() => {
    if (previous.current !== null && previous.current !== active) setLastShown(previous.current);
    previous.current = active;
  }, [active]);

  useEffect(() => () => {
    if (delay.current !== null) window.clearTimeout(delay.current);
  }, []);

  const enter = (personId: string) => {
    if (delay.current !== null) window.clearTimeout(delay.current);
    delay.current = window.setTimeout(() => setActive(personId), hoverDelayMs);
  };
  const leave = (personId: string) => {
    if (delay.current !== null) window.clearTimeout(delay.current);
    delay.current = null;
    setActive((current) => (current === personId ? null : current));
  };

  return (
    <section id={id} className={styles.root} aria-label={ariaLabel}>
      {showPortraits ? (
        <div className={styles.portraits} aria-hidden={active === null}>
          {people.map((person) => {
            const state = active === person.id ? styles.shown : lastShown === person.id ? styles.hiding : "";
            return (
              <div key={person.id} className={`${styles.portrait} ${state}`}>
                <img src={person.image} alt={person.alt} width={person.width} height={person.height} loading="lazy" />
                <span className={styles.caption}>
                  <span>{person.caption}</span>
                </span>
              </div>
            );
          })}
        </div>
      ) : null}

      <LineReveal as="div" className={styles.manifesto} lineGapMs={50}>
        <div className={styles.column}>
          {paragraphs.map((segments, p) => (
            <p key={p}>
              {segments.map((segment, s) =>
                segment.personId ? (
                  <span key={s}>
                    <u
                      className={styles.person}
                      tabIndex={0}
                      onMouseEnter={() => enter(segment.personId as string)}
                      onMouseLeave={() => leave(segment.personId as string)}
                      onFocus={() => enter(segment.personId as string)}
                      onBlur={() => leave(segment.personId as string)}
                    >
                      <RevealWords text={segment.text} />
                    </u>
                  </span>
                ) : (
                  <span key={s}>
                    <RevealWords text={segment.text} />
                  </span>
                ),
              )}
            </p>
          ))}
        </div>
      </LineReveal>
    </section>
  );
}
