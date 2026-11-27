"use client";

import { useEffect, useRef } from "react";
import { initClampedParallax } from "./parallax";
import styles from "./styles.module.css";

export interface OrchardVisionParallaxBoxProps {
  id?: string;
  title?: string;
  /** Short statement; line breaks are preserved. */
  subtitle?: string;
  backgroundImage?: string;
  /** Cut-out portrait that drifts over the oversized title. */
  foregroundImage?: string;
  foregroundAlt?: string;
  showForeground?: boolean;
  ariaLabel?: string;
  className?: string;
}

export function OrchardVisionParallaxBox({
  id,
  title = "Vision",
  subtitle = "Growing the future,\nstarting from the earth.",
  backgroundImage = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1920&q=80&auto=format&fit=crop",
  foregroundImage,
  foregroundAlt = "",
  showForeground = true,
  ariaLabel,
  className,
}: OrchardVisionParallaxBoxProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const hasFront = showForeground && Boolean(foregroundImage);

  useEffect(() => {
    if (!boxRef.current || !frontRef.current) return;
    return initClampedParallax(frontRef.current, boxRef.current, { from: 3, to: -14 }) ?? undefined;
  }, [hasFront, foregroundImage]);

  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel ?? title}
    >
      <div className={styles.inner}>
        <div ref={boxRef} className={styles.box} data-vision-box>
          {backgroundImage ? <img className={styles.bg} src={backgroundImage} alt="" loading="lazy" decoding="async" /> : null}
          {title ? <h2 className={styles.title}>{title}</h2> : null}
          {hasFront ? (
            <div ref={frontRef} className={styles.front}>
              <img className={styles.frontImg} src={foregroundImage} alt={foregroundAlt} loading="lazy" decoding="async" />
            </div>
          ) : null}
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </div>
      </div>
    </section>
  );
}
