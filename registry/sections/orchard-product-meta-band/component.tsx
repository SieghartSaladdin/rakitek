"use client";

import styles from "./styles.module.css";

export interface OrchardMetaTextBlock {
  label: string;
  value: string;
}

export interface OrchardMetaChipBlock {
  label: string;
  items: string[];
}

export interface OrchardProductMetaBandProps {
  id?: string;
  /** Left column: free-text advice. */
  tips?: OrchardMetaTextBlock | null;
  /** Middle column: circular size chips. */
  weights?: OrchardMetaChipBlock | null;
  /** Right column: short storage note. */
  conservation?: OrchardMetaTextBlock | null;
  ariaLabel?: string;
  className?: string;
}

export function OrchardProductMetaBand({
  id,
  tips = {
    label: "Useful tips",
    value: "Delicious for filling croissants, tarts or crepes. Keep away from heat sources and direct sunlight. After opening, store in the refrigerator and use within a few days.",
  },
  weights = { label: "Available weights", items: ["30g", "190g", "1kg", "3kg"] },
  conservation = { label: "Shelf life", value: "18 months" },
  ariaLabel,
  className,
}: OrchardProductMetaBandProps) {
  const hasChips = Boolean(weights?.items.length);
  if (!tips && !hasChips && !conservation) return null;
  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel ?? "Product details"}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.inner}>
            {tips ? (
              <div className={styles.col}>
                <p className={styles.label}>{tips.label}</p>
                <p className={styles.value}>{tips.value}</p>
              </div>
            ) : null}
            {weights && hasChips ? (
              <div className={`${styles.col} ${styles.colChips}`}>
                <p className={styles.label}>{weights.label}</p>
                <ul className={styles.chips}>
                  {weights.items.map((item, i) => (
                    <li key={`${item}-${i}`} className={styles.chip}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {conservation ? (
              <div className={styles.col}>
                <p className={styles.label}>{conservation.label}</p>
                <p className={styles.value}>{conservation.value}</p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
