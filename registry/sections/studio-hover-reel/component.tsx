"use client";

import { useEffect, useRef, useState } from "react";
import { LineReveal, RevealWords } from "@registry/ui/mono-line-reveal/component";
import styles from "./styles.module.css";

export interface ReelItem {
  image: string;
  alt: string;
  width: number;
  height: number;
  title: string;
  type: string;
  about: string;
  year: string;
}

export interface ReelParagraphSegment {
  text: string;
  href?: string;
}

export interface StudioHoverReelProps {
  id?: string;
  items?: ReelItem[];
  /** Label of the hover target in the middle of the stage. */
  hoverLabel?: string;
  /** Paragraphs shown in the lower-left corner of the stage. */
  overview?: ReelParagraphSegment[][];
  showOverview?: boolean;
  /** Time each frame stays on screen while hovering, in ms. Default 1000. */
  cycleMs?: number;
  /** Pause before the reel starts after the pointer enters, in ms. Default 80. */
  hoverDelayMs?: number;
  /** Mark centred on the stage in difference blend; it grows to the stage width while the reel runs. */
  markPaths?: string[];
  markViewBox?: string;
  showMark?: boolean;
}

const NEUTRAL_MARK = ["M190 20a180 180 0 0 0 0 360Z", "M210 20a180 180 0 0 1 0 360Z"];

const FRAMES = [
  { image: "photo-1497366216548-37526070297c", width: 991, height: 1237 },
  { image: "photo-1497366754035-f200968a6e72", width: 1238, height: 1238 },
  { image: "photo-1486406146926-c627a92ad1ab", width: 828, height: 1238 },
  { image: "photo-1518005020951-eccb494ad742", width: 1847, height: 1237 },
  { image: "photo-1494438639946-1ebd1d20bf85", width: 991, height: 1236 },
  { image: "photo-1500648767791-00dcc994a43e", width: 826, height: 1235 },
];
const CAPTIONS = [
  ["Atelier", "Business Trips", "Paris, France", "2023"],
  ["Meridian", "Conference, Trophy", "Studio of the Year", "2020"],
  ["Meridian", "Trophy", "Studio of the Year", "2023"],
  ["Northline", "Studio Events", "Summit Hiking", "2022"],
  ["Northline", "Studio Life", "Studio Life", "2021"],
  ["Northline", "Office Details", "Poster Wall", "2022"],
];

const DEFAULT_ITEMS: ReelItem[] = FRAMES.map((frame, i) => ({
  image: `https://images.unsplash.com/${frame.image}?w=${frame.width}&h=${frame.height}&q=80&auto=format&fit=crop`,
  alt: `Studio archive frame ${i + 1}.`,
  width: frame.width,
  height: frame.height,
  title: CAPTIONS[i][0],
  type: CAPTIONS[i][1],
  about: CAPTIONS[i][2],
  year: CAPTIONS[i][3],
}));

const DEFAULT_OVERVIEW: ReelParagraphSegment[][] = [
  [
    {
      text: "Over the years, our work has grown from independent collaborations to partnerships with brands such as Atelier, Harbor, Meridian, Foundry and Lumen Labs. ",
    },
  ],
  [
    { text: "Along the way, Northline was named " },
    { text: "Studio of the Year by Design Weekly", href: "#awards" },
    { text: " in 2023, received " },
    { text: "4x Studio of the Year", href: "#awards" },
    { text: " titles from CSS Design Awards, and earned " },
    { text: "Red Dot ", href: "#awards" },
    { text: "recognition. Not as an objective, but as a reflection of consistent standards" },
  ],
  [
    {
      text: "We live design daily, not only through client work, but through research, experimentation, public talks and education. The studio's methodology has evolved into its own ",
    },
    { text: "educational platform", href: "#education" },
    { text: ", where we share the thinking behind our practice." },
  ],
  [
    {
      text: "Northline takes on a limited number of projects each year, partnering with marketing leaders and founders who value authorship, clarity and long-term brand impact.",
    },
  ],
];

function CaptionRow({ item, show }: { item: ReelItem; show: boolean }) {
  const shown = useRef(false);
  if (show) shown.current = true;
  const state = show ? "in" : shown.current ? "out" : "hidden";
  return (
    <div className={styles.row} data-state={state}>
      <div className={styles.titleCell}>
        <div className={styles.cell}>{item.title}</div>
      </div>
      <div className={styles.typeCell}>
        <div className={styles.cell}>{item.type}</div>
      </div>
      <div className={styles.aboutCell}>
        <div className={styles.cell}>{item.about}</div>
      </div>
      <div className={styles.yearCell}>
        <div className={styles.cell}>{item.year}</div>
      </div>
    </div>
  );
}

export function StudioHoverReel({
  id,
  items = DEFAULT_ITEMS,
  hoverLabel = "Inspect studio archive moments",
  overview = DEFAULT_OVERVIEW,
  showOverview = true,
  cycleMs = 1000,
  hoverDelayMs = 80,
  markPaths = NEUTRAL_MARK,
  markViewBox = "0 0 400 400",
  showMark = true,
}: StudioHoverReelProps) {
  const [hovering, setHovering] = useState(false);
  const [index, setIndex] = useState(0);
  const lastIndex = useRef(0);
  const enterTimer = useRef<number | null>(null);

  useEffect(() => {
    if (!hovering) return;
    const interval = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % items.length;
        lastIndex.current = next;
        return next;
      });
    }, cycleMs);
    return () => window.clearInterval(interval);
  }, [hovering, cycleMs, items.length]);

  useEffect(() => () => {
    if (enterTimer.current !== null) window.clearTimeout(enterTimer.current);
  }, []);

  const enter = () => {
    if (enterTimer.current !== null) window.clearTimeout(enterTimer.current);
    enterTimer.current = window.setTimeout(() => {
      setIndex(lastIndex.current);
      setHovering(true);
    }, hoverDelayMs);
  };
  const leave = () => {
    if (enterTimer.current !== null) window.clearTimeout(enterTimer.current);
    enterTimer.current = null;
    setHovering(false);
    setIndex(0);
  };

  return (
    <div id={id} className={styles.root}>
      <div className={styles.stage}>
        <div
          className={styles.hover}
          role="button"
          tabIndex={0}
          aria-label={hoverLabel}
          onMouseEnter={enter}
          onMouseLeave={leave}
          onFocus={enter}
          onBlur={leave}
        />
        <div className={`${styles.gallery} ${hovering ? styles.galleryOn : ""}`}>
          {items.map((item, i) => (
            <div key={item.image} className={`${styles.frame} ${i === index ? styles.frameOn : ""}`}>
              <img
                src={item.image}
                alt={item.alt}
                width={item.width}
                height={item.height}
                style={{ aspectRatio: `${item.width} / ${item.height}` }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
        <div className={styles.captions} aria-live="polite">
          {items.map((item, i) => (
            <CaptionRow key={`${item.title}-${i}`} item={item} show={hovering && i === index} />
          ))}
        </div>
      </div>

      {showMark ? (
        <div className={`${styles.mark} ${hovering ? styles.markOn : ""}`} aria-hidden="true">
          <svg viewBox={markViewBox} fill="none">
            {markPaths.map((d, i) => (
              <path key={i} d={d} fill="currentColor" />
            ))}
          </svg>
        </div>
      ) : null}

      {showOverview ? (
        <LineReveal as="div" className={styles.overview}>
          <div>
            {overview.map((segments, p) => (
              <p key={p}>
                {segments.map((segment, s) =>
                  segment.href ? (
                    <a key={s} href={segment.href}>
                      <span>
                        <RevealWords text={segment.text} />
                      </span>
                    </a>
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
      ) : null}
    </div>
  );
}
