"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ORCHARD_PAUSE_FRUITS, type OrchardPauseFruit } from "./pause-fruits";
import styles from "./styles.module.css";

export type { OrchardPauseFruit };

export interface OrchardFruitPauseStageProps {
  id?: string;
  /** Centered display line; line breaks are preserved. */
  title?: string;
  /** Fruit artwork. `name` must be one of pear, tomato, blackberry or eggplant (it selects the resting position). */
  fruits?: OrchardPauseFruit[];
  showFruits?: boolean;
  ariaLabel?: string;
  className?: string;
}

const POSITION_CLASS: Record<string, string> = {
  pear: styles.fruitPear,
  tomato: styles.fruitTomato,
  blackberry: styles.fruitBlackberry,
  eggplant: styles.fruitEggplant,
};

export function OrchardFruitPauseStage({
  id,
  title = "It’s not just a label,\nbut a promise that has been kept\nover time.",
  fruits = ORCHARD_PAUSE_FRUITS,
  showFruits = true,
  ariaLabel,
  className,
}: OrchardFruitPauseStageProps) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !showFruits || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.matchMedia().add("(min-width: 481px)", () => {
        const stage = section.querySelector<HTMLElement>("[data-pause-stage]");
        const items = Array.from(section.querySelectorAll<HTMLElement>("[data-pause-fruit]"));
        const heading = section.querySelector<HTMLElement>("[data-pause-title]");
        if (!stage || !items.length) return;
        const offset = (el: HTMLElement) => ({
          x: stage.clientWidth / 2 - (el.offsetLeft + el.offsetWidth / 2),
          y: stage.clientHeight / 2 - (el.offsetTop + el.offsetHeight / 2),
        });
        const tl = gsap.timeline({
          defaults: { ease: "none", duration: 1 },
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${1.5 * window.innerHeight}`,
            scrub: true,
            pin: stage,
            pinSpacing: false,
            invalidateOnRefresh: true,
          },
        });
        for (const el of items) {
          const scale = Number(el.dataset.pauseScale || 1);
          tl.fromTo(el, { x: () => offset(el).x, y: () => offset(el).y, scale }, { x: 0, y: 0, scale: 1 }, 0);
        }
        if (heading) tl.fromTo(heading, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 }, 0.5);
      });
    }, section);
    return () => ctx.revert();
  }, [title, showFruits, fruits]);

  return (
    <section
      ref={sectionRef}
      id={id}
      className={className ? `${styles.section} ${className}` : styles.section}
      aria-label={ariaLabel}
    >
      <div className={styles.stage} data-pause-stage>
        <p className={styles.title} data-pause-title>
          {title}
        </p>
        {showFruits
          ? fruits.map((fruit) => (
              <div
                key={fruit.name}
                className={`${styles.fruit} ${POSITION_CLASS[fruit.name] ?? ""}`}
                data-pause-fruit
                data-pause-scale={fruit.scale}
                aria-hidden="true"
                dangerouslySetInnerHTML={{ __html: fruit.svg }}
              />
            ))
          : null}
      </div>
    </section>
  );
}
