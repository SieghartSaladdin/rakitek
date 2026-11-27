"use client";

import { useEffect, useMemo, useState, type CSSProperties, type MouseEvent } from "react";
import {
  OrchardFruitStage,
  orchardFruitItems,
  type OrchardFruitStageItem,
} from "@registry/ui/orchard-fruit-stage/component";
import styles from "./styles.module.css";

export interface OrchardNotFoundLink {
  label: string;
  href: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}

export interface OrchardFruitNotFoundProps {
  id?: string;
  /** Status code shown as three falling glyphs. */
  status?: string | number;
  headline?: string;
  lead?: string;
  links?: OrchardNotFoundLink[];
  /** Accessible name of the link list. */
  linksLabel?: string;
  showFruit?: boolean;
  className?: string;
}

const FRUIT_FACTOR = 0.85;
const DIGIT_GAP_MS = 620;
const DIGIT_BASE_MS = 500;
const FONT_WAIT_MS = 1200;
const DIGIT_SLOTS = [
  { x: 26.1, tilt: 115.68 },
  { x: 44.61, tilt: 41.82 },
  { x: 79.18, tilt: 70.53 },
];

const DEFAULT_LINKS: OrchardNotFoundLink[] = [
  { label: "Home", href: "#home" },
  { label: "Pantry", href: "#pantry" },
  { label: "Contacts", href: "#contacts" },
];

type Slot = { digit: string; x: number; tilt: number };

export function OrchardFruitNotFound({
  id,
  status = 404,
  headline = "This page bore no fruit",
  lead = "Even among the groves you can take a wrong turn. Come back to our land and rediscover the authentic flavours.",
  links = DEFAULT_LINKS,
  linksLabel = "Page not found",
  showFruit = true,
  className,
}: OrchardFruitNotFoundProps) {
  const [small, setSmall] = useState(false);
  useEffect(() => {
    setSmall(window.matchMedia("(max-width: 480px)").matches);
  }, []);

  const slots: Slot[] = useMemo(
    () => String(status).split("").map((digit, i) => ({ digit, ...DIGIT_SLOTS[i % DIGIT_SLOTS.length] })),
    [status],
  );

  const { items, slotAt } = useMemo(() => {
    const all = orchardFruitItems(FRUIT_FACTOR, 1, "nf");
    const pool = small ? all.filter((_, i) => i % 2 === 0) : all;
    const near = Math.min(slots.length + 1, Math.max(0, pool.length - 1));
    const beside = pool.slice(pool.length - near);
    const out: OrchardFruitStageItem[] = [];
    const bySlot = new Map<number, { slot: Slot; order: number }>();
    pool.slice(0, pool.length - near).forEach((f) => out.push(f));
    slots.forEach((slot, i) => {
      bySlot.set(out.length, { slot, order: i });
      out.push({
        kind: "node",
        node: (
          <span key={`d${i}`} className={styles.digit} data-fruit="" style={{ "--tilt": `${slot.tilt}deg` } as CSSProperties}>
            {slot.digit}
          </span>
        ),
      });
      if (beside[i]) out.push(beside[i]);
    });
    beside.slice(slots.length).forEach((f) => out.push(f));
    return { items: out, slotAt: bySlot };
  }, [slots, small]);

  return (
    <div id={id} className={className ? `${styles.root} ${className}` : styles.root}>
      {showFruit ? (
        <OrchardFruitStage
          className={styles.stage}
          items={items}
          gravity={5.2}
          clickBlastRadius={420}
          fontWaitMs={FONT_WAIT_MS}
          spawnX={({ index, stageWidth }) => {
            const hit = slotAt.get(index);
            return hit ? (stageWidth * hit.slot.x) / 100 : undefined;
          }}
          spawnAngle={({ index }) => {
            const hit = slotAt.get(index);
            return hit ? (hit.slot.tilt * Math.PI) / 180 : undefined;
          }}
          spawnY={({ index, height }) => {
            const hit = slotAt.get(index);
            const extra = hit ? DIGIT_BASE_MS + hit.order * DIGIT_GAP_MS : 0;
            return -(height + 140) - index * 90 - extra;
          }}
        />
      ) : null}
      <div className={styles.content}>
        <div className={styles.text}>
          <h1 className={styles.headline}>{headline}</h1>
          <div className={styles.aside}>
            <p className={styles.lead}>{lead}</p>
            <nav className={styles.links} aria-label={linksLabel}>
              {links.map((link) => (
                <a key={link.href + link.label} href={link.href} onClick={link.onClick} className={styles.link} aria-label={link.label}>
                  {Array.from(link.label).map((ch, i) => (
                    <span key={i} className={styles.rollChar} style={{ "--i": i } as CSSProperties} aria-hidden="true">
                      <span className={styles.charTop}>{ch === " " ? " " : ch}</span>
                      <span className={styles.charBot}>{ch === " " ? " " : ch}</span>
                    </span>
                  ))}
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
