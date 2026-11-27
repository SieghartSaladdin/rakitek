"use client";

import { useState, type MouseEvent } from "react";
import styles from "./styles.module.css";

export interface ProgramTile {
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
  href?: string;
}

export interface ProgramTileGridProps {
  id?: string;
  label?: string;
  title?: string;
  tiles?: readonly ProgramTile[];
  ctaLabel?: string;
  onTileClick?: (tile: ProgramTile, event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const DEFAULT_TILES: readonly ProgramTile[] = [
  { title: "TALKS", description: "Speakers on creativity, technology and innovation.", href: "#talks" },
  { title: "ART TRAIL", description: "Installations spread across the city.", href: "#trail" },
  { title: "PLAYGROUND", description: "Interactive experiences and workshops.", href: "#playground" },
];

const NOTCH_OPEN = "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)";
const NOTCH_CLOSED = "polygon(0 0, 100% 0, 100% 0, 100% 100%, 0 100%)";

function Arrow() {
  return (
    <svg
      className={styles.arrow}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}

export function ProgramTileGrid({
  id,
  label = "Discover",
  title = "Program",
  tiles = DEFAULT_TILES,
  ctaLabel = "Explore",
  onTileClick,
  className,
}: ProgramTileGridProps) {
  const [hovered, setHovered] = useState<number | null>(null);
  const rootClass = className ? `${styles.section} ${className}` : styles.section;

  return (
    <section id={id} className={rootClass}>
      <div className={styles.container}>
        <div className={styles.head}>
          {label ? <span className={styles.label}>{label}</span> : null}
          <h2 className={styles.title}>{title}</h2>
        </div>

        <div className={styles.grid}>
          {tiles.map((tile, index) => (
            <a
              key={`${tile.title}-${index}`}
              href={tile.href ?? "#"}
              className={styles.tile}
              style={{ clipPath: hovered === index ? NOTCH_OPEN : NOTCH_CLOSED }}
              onMouseEnter={() => setHovered(index)}
              onMouseLeave={() => setHovered(null)}
              onFocus={() => setHovered(index)}
              onBlur={() => setHovered(null)}
              onClick={onTileClick ? (event) => onTileClick(tile, event) : undefined}
            >
              {tile.imageSrc ? (
                <img
                  src={tile.imageSrc}
                  alt={tile.imageAlt ?? tile.title}
                  className={styles.image}
                />
              ) : null}
              <div className={styles.shade} aria-hidden="true" />
              <div className={styles.caption}>
                <h3 className={styles.tileTitle}>{tile.title}</h3>
                {tile.description ? <p className={styles.tileText}>{tile.description}</p> : null}
                {ctaLabel ? (
                  <span className={styles.cta}>
                    {ctaLabel}
                    <Arrow />
                  </span>
                ) : null}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
