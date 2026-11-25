"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import styles from "./styles.module.css";

export interface MinimalSaasFooterLink {
  label: string;
  href: string;
}

export interface MinimalSaasFooterProps {
  brand?: string;
  tagline?: string;
  links?: MinimalSaasFooterLink[];
}

const EASE_SMOOTH: [number, number, number, number] = [0.32, 0.72, 0, 1];

export function MinimalSaasFooter({
  brand = "Oriel",
  tagline = "Built by makers who got tired of autopilot.",
  links = [{ label: "Contact", href: "mailto:hello@example.com" }],
}: MinimalSaasFooterProps) {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(Boolean(reduced));

  useEffect(() => {
    if (reduced) {
      setVisible(true);
      return;
    }
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [reduced]);

  return (
    <footer className={styles.footer} ref={ref}>
      <motion.div
        className={styles.inner}
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={visible ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: reduced ? 0 : 0.7, ease: EASE_SMOOTH }}
      >
        <div className={styles.left}>
          <span className={styles.brand}>{brand}</span>
          <span className={styles.divider} aria-hidden="true" />
          <span className={styles.copy}>{tagline}</span>
        </div>
        <div className={styles.right}>
          {links.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={styles.footerLink}
              onClick={item.href.startsWith("#") ? (e) => e.preventDefault() : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.div>
    </footer>
  );
}
