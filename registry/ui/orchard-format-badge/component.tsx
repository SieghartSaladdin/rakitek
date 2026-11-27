"use client";

import styles from "./styles.module.css";

export interface OrchardFormatBadgeProps {
  label?: string;
  items: string[];
  align?: "start" | "center";
  responsiveCenter?: boolean;
  variant?: "solid" | "muted";
  className?: string;
  labelClassName?: string;
  listClassName?: string;
  itemClassName?: string;
}

export function OrchardFormatBadge({
  label = "Available weights",
  items,
  align = "start",
  responsiveCenter = false,
  variant = "solid",
  className,
  labelClassName,
  listClassName,
  itemClassName,
}: OrchardFormatBadgeProps) {
  if (!items.length) return null;

  const rootClasses = [
    styles.root,
    align === "center" ? styles.alignCenter : "",
    responsiveCenter ? styles.responsiveCenter : "",
    variant === "muted" ? styles.variantMuted : "",
    className ?? "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClasses}>
      {label ? (
        <p className={labelClassName ? `${styles.label} ${labelClassName}` : styles.label}>
          <span className={styles.labelInner}>{label}</span>
        </p>
      ) : null}
      <ul className={listClassName ? `${styles.list} ${listClassName}` : styles.list}>
        {items.map((w, i) => (
          <li
            key={`${w}-${i}`}
            className={itemClassName ? `${styles.item} ${itemClassName}` : styles.item}
          >
            {w}
          </li>
        ))}
      </ul>
    </div>
  );
}
