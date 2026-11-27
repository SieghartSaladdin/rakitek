"use client";

import { NotchedButton } from "@registry/ui/notched-button/component";
import { useFitText } from "./use-fit-text";
import styles from "./styles.module.css";

export interface HeroManifestoStat {
  value: string;
  label: string;
}

export interface HeroManifestoAction {
  label: string;
  href: string;
  arrow?: boolean;
}

export interface FestivalHeroManifestoProps {
  id?: string;
  titleLines?: readonly string[];
  dateRange?: string;
  month?: string;
  year?: string;
  tagline?: string;
  location?: string;
  stats?: readonly HeroManifestoStat[];
  primaryAction?: HeroManifestoAction;
  secondaryAction?: HeroManifestoAction;
  minTitleSize?: number;
  className?: string;
}

const DEFAULT_LINES = ["NIGHT", "SIGNALS"] as const;

export function FestivalHeroManifesto({
  id,
  titleLines = DEFAULT_LINES,
  dateRange = "22-25",
  month = "OCT",
  year = "2026",
  tagline = "Art, Science & Technology",
  location = "Harbour City, Northland",
  stats,
  primaryAction,
  secondaryAction,
  minTitleSize = 36,
  className,
}: FestivalHeroManifestoProps) {
  const titleRef = useFitText<HTMLHeadingElement>(2, minTitleSize, titleLines);
  const rootClass = className ? `${styles.section} ${className}` : styles.section;

  return (
    <section id={id} className={rootClass}>
      <div className={styles.container}>
        <h1 ref={titleRef} className={styles.title}>
          {titleLines.map((line, index) => (
            <span key={`${line}-${index}`} className={styles.line}>
              {line}
            </span>
          ))}
        </h1>

        <div className={styles.info}>
          <div className={styles.col}>
            <span className={styles.date}>{dateRange}</span>
            <div className={styles.dateMeta}>
              <span className={styles.month}>{month}</span>
              <span className={styles.year}>{year}</span>
            </div>
          </div>

          <div className={styles.col}>
            <p className={styles.tagline}>{tagline}</p>
            <p className={styles.location}>{location}</p>
          </div>

          <div className={`${styles.col} ${styles.stats}`}>
            {(stats ?? []).map((stat) => (
              <div key={stat.label} className={styles.stat}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className={`${styles.col} ${styles.actions}`}>
            {primaryAction ? (
              <NotchedButton
                href={primaryAction.href}
                variant="filled"
                size="lg"
                arrow={primaryAction.arrow ?? true}
              >
                {primaryAction.label}
              </NotchedButton>
            ) : null}
            {secondaryAction ? (
              <NotchedButton
                href={secondaryAction.href}
                variant="outline"
                size="lg"
                arrow={secondaryAction.arrow ?? false}
              >
                {secondaryAction.label}
              </NotchedButton>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
