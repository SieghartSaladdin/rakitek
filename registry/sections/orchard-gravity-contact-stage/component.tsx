"use client";

import { useEffect, useRef, type CSSProperties, type MouseEvent } from "react";
import { createFruitStage } from "./fruit-stage";
import { BOTANICAL_SHAPES, type BotanicalShape } from "./fruit-svgs";
import styles from "./styles.module.css";

export interface OrchardContactOffice {
  label: string;
  lines: string[];
}

export interface OrchardContactSocialLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface OrchardGravityContactStageProps {
  id?: string;
  title?: string;
  subtitle?: string;
  offices?: OrchardContactOffice[];
  socialLabel?: string;
  socialLinks?: OrchardContactSocialLink[];
  emailPrompt?: string;
  emailLabel?: string;
  emailHref?: string;
  shapes?: BotanicalShape[];
  gravity?: number;
  clickBlastRadius?: number;
  onLinkClick?: (href: string, event: MouseEvent<HTMLAnchorElement>) => void;
  ariaLabel?: string;
  className?: string;
}

const DEFAULT_OFFICES: OrchardContactOffice[] = [
  { label: "Registered office", lines: ["Via degli Agrumi, 18", "95123 - Coastal Valley"] },
  { label: "Operational office", lines: ["Contrada Solare, Lot 4", "96014 - Grove District"] },
];

const DEFAULT_SOCIAL: OrchardContactSocialLink[] = [
  { label: "Instagram", href: "https://instagram.com", external: true },
  { label: "Facebook", href: "https://facebook.com", external: true },
];

export function OrchardGravityContactStage({
  id,
  title = "Contacts",
  subtitle = "Do you have a question or request? Write to us or drop by.",
  offices = DEFAULT_OFFICES,
  socialLabel = "Follow us",
  socialLinks = DEFAULT_SOCIAL,
  emailPrompt = "To request our full wholesale catalog or schedule an orchard tasting:",
  emailLabel = "hello@solaraorchard.example",
  emailHref = "mailto:hello@solaraorchard.example",
  shapes = BOTANICAL_SHAPES,
  gravity = 3.35,
  clickBlastRadius = 420,
  onLinkClick,
  ariaLabel = "Contact information",
  className,
}: OrchardGravityContactStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const handle = createFruitStage(stage, { gravity, clickBlastRadius });
    return () => handle?.destroy();
  }, [gravity, clickBlastRadius]);

  return (
    <section
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel}
    >
      <div
        ref={stageRef}
        className={styles.stage}
        data-fruit-loader-ready="false"
        aria-hidden="true"
      >
        {shapes.map((fruit, i) => (
          <div
            key={i}
            className={styles.fruit}
            data-fruit=""
            style={
              {
                width: `calc(var(--fruit-base) * ${fruit.scale})`,
                aspectRatio: fruit.ratio,
              } as CSSProperties
            }
            dangerouslySetInnerHTML={{ __html: fruit.svg }}
          />
        ))}
      </div>

      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.content}>
            {title ? <h1 className={styles.title}>{title}</h1> : null}
            {subtitle ? (
              <h2 className={styles.subtitle}>
                <span className={styles.subtitleInner}>{subtitle}</span>
              </h2>
            ) : null}

            <div className={styles.blocks}>
              {offices.map((office, idx) => (
                <div key={`${office.label}-${idx}`} className={styles.block}>
                  <p className={styles.label}>
                    <span className={styles.labelInner}>{office.label}</span>
                  </p>
                  <div className={styles.text}>
                    {office.lines.map((line, lIdx) => (
                      <p key={lIdx}>{line}</p>
                    ))}
                  </div>
                </div>
              ))}
              {socialLinks.length ? (
                <div className={styles.block}>
                  <p className={styles.label}>
                    <span className={styles.labelInner}>{socialLabel}</span>
                  </p>
                  <ul className={styles.social}>
                    {socialLinks.map((link) => (
                      <li key={link.href}>
                        <a
                          href={link.href}
                          target={link.external ? "_blank" : undefined}
                          rel={link.external ? "noopener noreferrer" : undefined}
                          className={styles.link}
                          onClick={onLinkClick ? (e) => onLinkClick(link.href, e) : undefined}
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>

            <div className={styles.mail}>
              {emailPrompt ? <p className={styles.message}>{emailPrompt}</p> : null}
              {emailLabel ? (
                <a href={emailHref} className={styles.email}>
                  {emailLabel}
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
