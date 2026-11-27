"use client";

import styles from "./styles.module.css";

export interface FestivalSectionDividerProps {
  id?: string;
  number?: string;
  label?: string;
  align?: "left" | "right";
  className?: string;
}

export function FestivalSectionDivider({
  id,
  number = "001",
  label = "Section",
  align = "left",
  className,
}: FestivalSectionDividerProps) {
  const rootClass = className ? `${styles.root} ${className}` : styles.root;
  return (
    <div id={id} className={rootClass}>
      <div className={styles.container}>
        <div className={align === "right" ? `${styles.row} ${styles.reverse}` : styles.row}>
          {number ? <span className={styles.number}>{number}</span> : null}
          <div className={styles.rule} aria-hidden="true" />
          {label ? <span className={styles.label}>{label}</span> : null}
        </div>
      </div>
    </div>
  );
}
