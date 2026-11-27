"use client";

import type { CSSProperties } from "react";
import { FestivalCard } from "@registry/ui/festival-card/component";
import { NotchedButton } from "@registry/ui/notched-button/component";
import styles from "./styles.module.css";

export interface LineupCard {
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  companyStudio?: string;
  subtitle?: string;
  location?: string;
  badge?: string;
  href?: string;
}

export interface LineupStat {
  value: string;
  label: string;
}

export interface LineupAction {
  label: string;
  href: string;
  variant?: "outline" | "filled";
  arrow?: boolean;
}

export interface FestivalLineupSectionProps {
  id?: string;
  label?: string;
  title?: string;
  ghostNumber?: string;
  description?: string;
  stats?: readonly LineupStat[];
  cards?: readonly LineupCard[];
  actions?: readonly LineupAction[];
  eagerCards?: number;
  titleLetterSpacing?: string;
  titleLineHeight?: number;
  className?: string;
}

const DEFAULT_CARDS: readonly LineupCard[] = [
  { title: "Opening keynote", subtitle: "Main stage", href: "#program" },
  { title: "Making machines dream", subtitle: "Workshop", href: "#program" },
  { title: "Open data city", subtitle: "Panel", href: "#program" },
];

export function FestivalLineupSection({
  id,
  label = "Get inspired",
  title = "Talks",
  ghostNumber,
  description,
  stats,
  cards = DEFAULT_CARDS,
  actions,
  eagerCards = 3,
  titleLetterSpacing,
  titleLineHeight,
  className,
}: FestivalLineupSectionProps) {
  const rootClass = className ? `${styles.section} ${className}` : styles.section;
  const titleStyle: CSSProperties = {};
  if (titleLetterSpacing) titleStyle.letterSpacing = titleLetterSpacing;
  if (titleLineHeight !== undefined) titleStyle.lineHeight = titleLineHeight;

  return (
    <section id={id} className={rootClass}>
      <div className={styles.container}>
        <div className={styles.head}>
          <span className={styles.label}>{label}</span>
          {ghostNumber ? (
            <div className={styles.titleRow}>
              <h2 className={styles.title} style={titleStyle}>
                {title}
              </h2>
              <span className={styles.ghost} aria-hidden="true">
                {ghostNumber}
              </span>
            </div>
          ) : (
            <h2 className={`${styles.title} ${styles.titleSolo}`} style={titleStyle}>
              {title}
            </h2>
          )}
          {stats && stats.length > 0 ? (
            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label}>
                  <span className={styles.statValue}>{stat.value}</span>
                  <span className={styles.statLabel}>{stat.label}</span>
                </div>
              ))}
            </div>
          ) : null}
          {description ? <p className={styles.description}>{description}</p> : null}
        </div>

        <div className={styles.grid}>
          {cards.map((card, index) => (
            <FestivalCard
              key={`${card.title}-${index}`}
              title={card.title}
              imageSrc={card.imageSrc}
              imageAlt={card.imageAlt}
              companyStudio={card.companyStudio}
              subtitle={card.subtitle}
              location={card.location}
              badge={card.badge}
              href={card.href}
              variant="visual"
              eager={index < eagerCards}
            />
          ))}
        </div>

        {actions && actions.length > 0 ? (
          <div className={styles.actions}>
            {actions.map((action) => (
              <NotchedButton
                key={action.label}
                href={action.href}
                variant={action.variant ?? "outline"}
                arrow={action.arrow ?? true}
              >
                {action.label}
              </NotchedButton>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
