"use client";

import { useEffect, useRef } from "react";
import { initClampedParallax } from "./parallax";
import styles from "./styles.module.css";

export interface OrchardClosingParallaxFrameProps {
  id?: string;
  imageSrc?: string;
  imageAlt?: string;
  ariaLabel?: string;
  className?: string;
}

export function OrchardClosingParallaxFrame({
  id,
  imageSrc = "https://images.unsplash.com/photo-1506368249639-73a05d6f6488?w=1600&q=80&auto=format&fit=crop",
  imageAlt = "",
  ariaLabel,
  className,
}: OrchardClosingParallaxFrameProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boxRef.current || !mediaRef.current) return;
    return initClampedParallax(mediaRef.current, boxRef.current) ?? undefined;
  }, [imageSrc]);

  if (!imageSrc) return null;
  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel}
    >
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.inner}>
            <div ref={boxRef} className={styles.box} data-closing-box>
              <div ref={mediaRef} className={styles.media}>
                <img src={imageSrc} alt={imageAlt} loading="lazy" decoding="async" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
