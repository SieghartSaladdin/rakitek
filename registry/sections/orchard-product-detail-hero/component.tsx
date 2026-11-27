"use client";

import { Fragment, useEffect, useRef, type MouseEvent } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { OrchardSpinningJar, jarArt, labelArt } from "@registry/ui/orchard-spinning-jar/component";
import styles from "./styles.module.css";

export interface OrchardProductDetailHeroProps {
  id?: string;
  /** Monumental product name; "\n" becomes a line break. */
  title?: string;
  /** Left meta line, usually the category. */
  category?: string;
  categoryHref?: string;
  onCategoryClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** Right meta line; "\n" becomes a line break. */
  originLabel?: string;
  jarImage?: string;
  labelImage?: string;
  jarAlt?: string;
  /** Hides the jar while a flying clone is still landing. */
  jarPending?: boolean;
  /** Called with the jar element once its label has been drawn. */
  onJarReady?: (jar: HTMLElement) => void;
  ariaLabel?: string;
  className?: string;
}

const META_GAP_BELOW_JAR = 60;
const MOBILE_META_GAP = 16;
const SCROLL_FACTOR = 0.4;
const TITLE_MIN_TOP = 56;
const TITLE_JAR_GAP = 24;
const HEADER_PAD = 16;
const TITLE_REST_LOW = 0.5;
const TITLE_REST_HIGH = 0.6;

const Lines = ({ text }: { text: string }) => (
  <>
    {text.split("\n").map((line, i) => (
      <Fragment key={i}>
        {i > 0 ? <br /> : null}
        {line}
      </Fragment>
    ))}
  </>
);

export function OrchardProductDetailHero({
  id,
  title = "Pistachio\nCream",
  category = "Spreadable Creams",
  categoryHref,
  onCategoryClick,
  originLabel = "Made in\nSicily - Italy",
  jarImage = jarArt("goldenrod"),
  labelImage = labelArt("PISTACHIO", "Velvet Cream", "darkseagreen", "darkolivegreen"),
  jarAlt = "",
  jarPending = false,
  onJarReady,
  ariaLabel,
  className,
}: OrchardProductDetailHeroProps) {
  const rootRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const jarRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<{ setSpin(p: number): void } | null>(null);
  const readyRef = useRef(onJarReady);
  useEffect(() => {
    readyRef.current = onJarReady;
  });

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !jarRef.current) return;
    gsap.registerPlugin(ScrollTrigger);

    const layout = () => {
      const titleEl = titleRef.current;
      const jar = jarRef.current;
      const meta = metaRef.current;
      const stage = stageRef.current;
      if (!titleEl || !jar || !meta || !stage) return;
      meta.style.top = "";
      stage.style.removeProperty("--ph-title-rest-y");
      stage.style.removeProperty("--ph-title-fit");
      const mobile = window.matchMedia("(max-width: 1024px)").matches;
      const cs = getComputedStyle(root);
      const jarTop = jar.offsetTop;
      const scaleFrom = parseFloat(cs.getPropertyValue("--ph-jar-scale-from")) || 1;
      const safeTop = (parseFloat(cs.getPropertyValue("--header-safe-top")) || 0) + HEADER_PAD + (mobile ? meta.offsetHeight + MOBILE_META_GAP : 0);
      const jarTopScaled = jarTop - (jar.offsetHeight * (scaleFrom - 1)) / 2;
      const fullH = titleEl.offsetHeight;
      if (fullH > jarTopScaled - safeTop) stage.style.setProperty("--ph-title-fit", `${(jarTopScaled - safeTop) / fullH}`);
      const h = titleEl.offsetHeight;
      const clampY = (y: number) => Math.max(safeTop + h / 2, Math.min(y, jarTopScaled - h / 2));
      if (mobile) {
        const y = clampY(titleEl.offsetTop);
        stage.style.setProperty("--ph-title-rest-y", `${y}px`);
        stage.style.setProperty("--ph-title-fall", "0px");
        stage.style.setProperty("--ph-meta-shift", "0px");
        meta.style.top = `${y - h / 2 - MOBILE_META_GAP - meta.offsetHeight}px`;
        return;
      }
      const rise = cs.getPropertyValue("--ph-jar-rise").trim();
      const risePx = rise.endsWith("vh") ? (parseFloat(rise) * window.innerHeight) / 100 : parseFloat(rise) || 0;
      const jarCenter = jar.offsetTop + jar.offsetHeight / 2 + risePx;
      const stageH = stage.clientHeight;
      const minY = TITLE_MIN_TOP + h / 2;
      const maxY = jarTop - TITLE_JAR_GAP - h / 2;
      const k = Math.max(0, Math.min(1, (980 - stageH) / 220));
      const ratio = TITLE_REST_LOW + (TITLE_REST_HIGH - TITLE_REST_LOW) * k;
      const rest = Math.max(minY, Math.min(maxY, minY + (maxY - minY) * ratio));
      const restY = clampY(Math.min(rest, stageH * 0.52));
      stage.style.setProperty("--ph-title-rest-y", `${restY}px`);
      stage.style.setProperty("--ph-title-fall", `${jarCenter - restY}px`);
      stage.style.setProperty("--ph-meta-shift", `${jarCenter + h / 2 + META_GAP_BELOW_JAR - meta.offsetTop}px`);
    };

    let layoutRaf = 0;
    let ctx: gsap.Context | null = null;
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      ctx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: root,
          start: "top top",
          end: () => `+=${window.innerHeight * SCROLL_FACTOR}`,
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            stageRef.current?.style.setProperty("--ph", `${self.progress}`);
            spinRef.current?.setSpin(self.progress);
          },
        });
      }, root);
      layoutRaf = requestAnimationFrame(layout);
      ScrollTrigger.addEventListener("refresh", layout);
    }
    return () => {
      cancelAnimationFrame(layoutRaf);
      ScrollTrigger.removeEventListener("refresh", layout);
      ctx?.revert();
    };
  }, [title, category, jarImage]);

  const metaLeft = categoryHref ? (
    <a href={categoryHref} onClick={onCategoryClick} className={`${styles.metaItem} ${styles.metaLeft} ${styles.metaLink}`}>
      {category}
    </a>
  ) : (
    <p className={`${styles.metaItem} ${styles.metaLeft}`}>{category}</p>
  );

  return (
    <section ref={rootRef} id={id} className={className ? `${styles.hero} ${className}` : styles.hero} aria-label={ariaLabel}>
      <div ref={stageRef} className={styles.stage}>
        <h1 ref={titleRef} className={styles.title} aria-label={title.replace(/\n/g, " ")}>
          <Lines text={title} />
        </h1>
        <div ref={metaRef} className={styles.meta}>
          <div className={styles.grid}>
            {metaLeft}
            <p className={`${styles.metaItem} ${styles.metaRight}`}>
              <Lines text={originLabel} />
            </p>
          </div>
        </div>
        {jarImage ? (
          <div ref={jarRef} className={styles.jar}>
            <OrchardSpinningJar
              jarImage={jarImage}
              labelImage={labelImage}
              alt={jarAlt}
              handleRef={spinRef}
              pending={jarPending}
              onReady={() => jarRef.current && readyRef.current?.(jarRef.current)}
              style={{ width: "100%" }}
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
