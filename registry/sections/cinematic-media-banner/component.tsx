"use client";

import { useState, type CSSProperties } from "react";
import styles from "./styles.module.css";

export interface CinematicMediaBannerProps {
  id?: string;
  imageSrc?: string;
  imageAlt?: string;
  imageOpacity?: number;
  videoSrc?: string;
  videoTitle?: string;
  cropScale?: number;
  aspectRatio?: string;
  eager?: boolean;
  className?: string;
}

export function CinematicMediaBanner({
  id,
  imageSrc,
  imageAlt = "",
  imageOpacity,
  videoSrc,
  videoTitle = "Background video",
  cropScale = 1.32,
  aspectRatio = "21 / 9",
  eager = false,
  className,
}: CinematicMediaBannerProps) {
  const [loaded, setLoaded] = useState(false);
  const rootClass = className ? `${styles.section} ${className}` : styles.section;
  const posterOpacity = imageOpacity ?? (videoSrc ? 0.8 : 1);
  const videoStyle: CSSProperties = {
    width: `${cropScale * 100}%`,
    height: `${cropScale * 131.25}%`,
    minWidth: `${cropScale * 100}%`,
    minHeight: `${cropScale * 131.25}%`,
    opacity: loaded ? 1 : 0,
  };

  return (
    <section id={id} className={rootClass}>
      <div className={styles.frame} style={{ aspectRatio }}>
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={imageAlt}
            aria-hidden={imageAlt ? undefined : true}
            loading={eager ? "eager" : "lazy"}
            className={styles.image}
            style={{ opacity: posterOpacity }}
          />
        ) : null}
        {videoSrc ? (
          <>
            <iframe
              title={videoTitle}
              src={videoSrc}
              allow="autoplay; fullscreen; picture-in-picture"
              loading="eager"
              tabIndex={-1}
              onLoad={() => setLoaded(true)}
              className={styles.video}
              style={videoStyle}
            />
            <div className={styles.blocker} aria-hidden="true" />
          </>
        ) : null}
      </div>
    </section>
  );
}
