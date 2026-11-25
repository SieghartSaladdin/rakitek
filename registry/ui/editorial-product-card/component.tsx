"use client";

import type { MouseEvent } from "react";
import styles from "./styles.module.css";

export interface ProductSpecItem {
  label: string;
  value: string;
}

export interface EditorialProductCardProps {
  title: string;
  price: string;
  specs?: ProductSpecItem[];
  variant?: "wireframe" | "tile";
  href?: string;
  actionTitle?: string;
  imageSrc?: string;
  imageAlt?: string;
  hoverSummary?: string;
  className?: string;
  onAction?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const DEFAULT_SPECS: ProductSpecItem[] = [
  { label: "Type", value: "Single Origin" },
  { label: "Origin", value: "Nicaragua" },
  { label: "Process", value: "Washed" },
];

function formatLabel(label: string): string {
  return label.endsWith(":") ? label : `${label}:`;
}

export function EditorialProductCard({
  title,
  price,
  specs = DEFAULT_SPECS,
  variant = "wireframe",
  href = "#",
  actionTitle,
  imageSrc,
  imageAlt,
  hoverSummary,
  className,
  onAction,
}: EditorialProductCardProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (onAction) {
      onAction(event);
      return;
    }
    if (href === "#") {
      event.preventDefault();
    }
  };

  if (variant === "tile") {
    const tileClass = className ? `${styles.tile} ${className}` : styles.tile;
    return (
      <article className={tileClass}>
        <a
          href={href}
          className={styles.tileLink}
          title={actionTitle ?? `Select ${title}`}
          onClick={handleClick}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? title}
              className={styles.tileImg}
            />
          ) : (
            <div className={styles.tileFallback} aria-hidden="true" />
          )}

          <div className={styles.tileInfos}>
            <h3 className={styles.tileTitle}>{title}</h3>
            <p className={styles.price}>{price}</p>
          </div>

          <div className={styles.tileHover}>
            {hoverSummary ? <p>{hoverSummary}</p> : null}
            <table className={styles.specTable}>
              <tbody>
                {specs.map((spec) => (
                  <tr key={spec.label} className={styles.specRow}>
                    <td className={styles.specLabel}>{formatLabel(spec.label)}</td>
                    <td className={styles.specValue}>{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </a>
      </article>
    );
  }

  const cardClass = className ? `${styles.card} ${className}` : styles.card;

  return (
    <article className={cardClass}>
      <a
        href={href}
        className={styles.cardLink}
        title={actionTitle ?? `Select ${title}`}
        onClick={handleClick}
      >
        <div className={styles.infos}>
          <h3 className={styles.title}>{title}</h3>
          <p className={styles.price}>{price}</p>
        </div>

        <table className={styles.specTable}>
          <tbody>
            {specs.map((spec) => (
              <tr key={spec.label} className={styles.specRow}>
                <td className={styles.specLabel}>{formatLabel(spec.label)}</td>
                <td className={styles.specValue}>{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </a>
    </article>
  );
}
