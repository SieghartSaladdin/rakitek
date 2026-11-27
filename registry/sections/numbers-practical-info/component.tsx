"use client";

import type { ReactNode } from "react";
import { NotchedButton } from "@registry/ui/notched-button/component";
import { CalendarIcon, PinIcon, TrainIcon } from "./icons";
import styles from "./styles.module.css";

export type InfoIconName = "calendar" | "pin" | "train";

export interface NumberStat {
  value: string;
  label: string;
}

export interface InfoItem {
  title: string;
  text: string;
  icon?: InfoIconName | ReactNode;
  actionLabel?: string;
  actionHref?: string;
}

export interface NumbersPracticalInfoProps {
  id?: string;
  numbersLabel?: string;
  numbers?: readonly NumberStat[];
  infoLabel?: string;
  info?: readonly InfoItem[];
  className?: string;
}

const DEFAULT_NUMBERS: readonly NumberStat[] = [
  { value: "40+", label: "Talks" },
  { value: "20+", label: "Artworks" },
  { value: "3", label: "Parties" },
];

const DEFAULT_INFO: readonly InfoItem[] = [
  { title: "Dates", text: "22-25 October 2026", icon: "calendar" },
  { title: "Location", text: "Harbour City, Northland", icon: "pin" },
];

function renderIcon(icon: InfoItem["icon"]): ReactNode {
  if (icon === "calendar") return <CalendarIcon className={styles.icon} />;
  if (icon === "pin") return <PinIcon className={styles.icon} />;
  if (icon === "train") return <TrainIcon className={styles.icon} />;
  if (icon) return <span className={styles.icon}>{icon}</span>;
  return null;
}

export function NumbersPracticalInfo({
  id,
  numbersLabel = "Festival in numbers",
  numbers = DEFAULT_NUMBERS,
  infoLabel = "Practical info",
  info = DEFAULT_INFO,
  className,
}: NumbersPracticalInfoProps) {
  const rootClass = className ? `${styles.section} ${className}` : styles.section;

  return (
    <section id={id} className={rootClass}>
      <div className={styles.container}>
        {numbers.length > 0 ? (
          <div className={styles.numbersBlock}>
            <span className={styles.label}>{numbersLabel}</span>
            <div className={styles.numbers}>
              {numbers.map((item) => (
                <div key={item.label} className={styles.number}>
                  <span className={styles.numberValue}>{item.value}</span>
                  <span className={styles.numberLabel}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {info.length > 0 ? (
          <div className={styles.infoBlock}>
            <span className={styles.label}>{infoLabel}</span>
            <div className={styles.infoGrid}>
              {info.map((item) => (
                <div key={item.title} className={styles.infoItem}>
                  {renderIcon(item.icon)}
                  <div>
                    <h4 className={styles.infoTitle}>{item.title}</h4>
                    <p
                      className={
                        item.actionLabel ? `${styles.infoText} ${styles.infoTextAction}` : styles.infoText
                      }
                    >
                      {item.text}
                    </p>
                    {item.actionLabel ? (
                      <NotchedButton
                        href={item.actionHref ?? "#"}
                        variant="outline"
                        size="sm"
                        arrow
                      >
                        {item.actionLabel}
                      </NotchedButton>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
