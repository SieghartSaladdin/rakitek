"use client";

import type { MouseEvent } from "react";
import { ParallaxMedia } from "./parallax-media";
import styles from "./styles.module.css";

export interface VoyagePackageCardProps {
  title: string;
  href?: string;
  imageSrc?: string;
  imageAlt?: string;
  featuredBadge?: string;
  typeTags?: string[];
  specs?: string[];
  price?: number;
  pricePrefix?: string;
  priceSuffix?: string;
  formatPrice?: (price: number) => string;
  parallaxY?: number;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const defaultFormatPrice = (price: number): string =>
  `${price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")} $`;

export function VoyagePackageCard({
  title,
  href = "#package",
  imageSrc,
  imageAlt,
  featuredBadge = "Escorted",
  typeTags = ["Group Tour", "Cruise"],
  specs = ["16 days", "14 nights", "38 meals"],
  price = 4899,
  pricePrefix = "Starting from:",
  priceSuffix = "*",
  formatPrice = defaultFormatPrice,
  parallaxY = 50,
  onClick,
  className = "",
}: VoyagePackageCardProps) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`${styles.card} ${className}`.trim()}
    >
      <div className={styles.imgWrapper}>
        <ParallaxMedia translateY={parallaxY} className={styles.img}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? title}
              className={styles.parallaxImg}
              decoding="async"
              loading="lazy"
            />
          ) : null}
        </ParallaxMedia>
        {featuredBadge ? (
          <div className={`${styles.tag} ${styles.badge}`}>{featuredBadge}</div>
        ) : null}
      </div>

      <div className={styles.infos}>
        <h5 className={styles.infosTitle}>{title}</h5>
        {typeTags.length > 0 ? (
          <div className={styles.infosTags}>
            {typeTags.map((tag) => (
              <div key={tag} className={styles.tag}>
                {tag}
              </div>
            ))}
          </div>
        ) : null}
        <div className={styles.infosTable}>
          <ul className={styles.infosTableList}>
            {specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
          <div className={styles.infosTablePrice}>
            {pricePrefix}{" "}
            <strong>
              {formatPrice(price)}
              {priceSuffix}
            </strong>
          </div>
        </div>
      </div>
    </a>
  );
}
