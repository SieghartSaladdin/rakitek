"use client";

import { useCallback, useRef, useState, type MouseEvent } from "react";
import styles from "./styles.module.css";

export interface FestivalCardProps {
  id?: string;
  title: string;
  imageSrc?: string;
  imageAlt?: string;
  companyStudio?: string;
  subtitle?: string;
  location?: string;
  badge?: string;
  href?: string;
  variant?: "visual" | "wide";
  eager?: boolean;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
  className?: string;
}

const NOTCH_OPEN = "polygon(0 0, calc(100% - 40px) 0, 100% 40px, 100% 100%, 0 100%)";
const NOTCH_CLOSED = "polygon(0 0, 100% 0, 100% 0, 100% 100%, 0 100%)";

export function FestivalCard({
  id,
  title,
  imageSrc,
  imageAlt,
  companyStudio,
  subtitle,
  location,
  badge,
  href = "#",
  variant = "visual",
  eager = false,
  onClick,
  className,
}: FestivalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMove = useCallback((event: MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.setProperty("--mouse-x", `${px}%`);
    el.style.setProperty("--mouse-y", `${py}%`);
    setTilt({ x: ((px - 50) / 50) * 2, y: ((py - 50) / 50) * -2 });
  }, []);

  const handleLeave = useCallback(() => {
    setHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  const rootClass = className ? `${styles.card} ${className}` : styles.card;

  return (
    <div
      id={id}
      ref={cardRef}
      className={rootClass}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{
        transform: hovered
          ? `scale(1.02) rotateX(${tilt.y}deg) rotateY(${tilt.x}deg)`
          : "scale(1) rotateX(0deg) rotateY(0deg)",
        clipPath: hovered ? NOTCH_OPEN : NOTCH_CLOSED,
      }}
    >
      <a href={href} className={styles.link} onClick={onClick}>
        <div className={variant === "wide" ? `${styles.media} ${styles.wide}` : styles.media}>
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={imageAlt ?? title}
              loading={eager ? "eager" : "lazy"}
              decoding={eager ? "sync" : "async"}
              className={styles.image}
            />
          ) : null}
          <div className={styles.shade} aria-hidden="true" />
          <div className={styles.spotlight} aria-hidden="true" />
          {badge ? <div className={styles.badge}>{badge}</div> : null}
          <div className={styles.caption}>
            <div className={styles.captionMain}>
              {companyStudio ? <p className={styles.eyebrow}>{companyStudio}</p> : null}
              <h3 className={styles.title}>{title}</h3>
              {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
            </div>
            {location ? <p className={styles.location}>{location}</p> : null}
          </div>
        </div>
      </a>
    </div>
  );
}
