"use client";

import type { MouseEvent } from "react";
import { OrchardRelatedRail, type OrchardRelatedProduct } from "./rail";
import { orchardRelatedJar } from "./default-jars";
import styles from "./styles.module.css";

export type { OrchardRelatedProduct };

export interface OrchardRelatedProductsRailProps {
  id?: string;
  title?: string;
  products?: OrchardRelatedProduct[];
  onProductClick?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_PRODUCTS: OrchardRelatedProduct[] = [
  orchardRelatedJar("orange", "Orange Marmalade", "ORANGE", "darkorange"),
  orchardRelatedJar("pear", "Pear and Cinnamon", "PEAR", "goldenrod"),
  orchardRelatedJar("caponata", "Aubergine Caponata", "CAPONATA", "rebeccapurple"),
  orchardRelatedJar("pesto", "Pistachio Pesto", "PESTO", "forestgreen"),
];

export function OrchardRelatedProductsRail({
  id,
  title = "The other products",
  products = DEFAULT_PRODUCTS,
  onProductClick,
  ariaLabel,
  className,
}: OrchardRelatedProductsRailProps) {
  if (!products.length) return null;
  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel ?? title}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <h2 className={styles.title}>{title}</h2>
        </div>
      </div>
      <OrchardRelatedRail items={products} onSlideClick={onProductClick} />
    </section>
  );
}
