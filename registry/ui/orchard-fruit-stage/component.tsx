"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { createFruitPhysics, type FruitPhysicsOptions } from "./fruit-physics";
import { ORCHARD_FRUIT_SHAPES } from "./fruit-shapes";
import styles from "./styles.module.css";

export type OrchardFruitStageItem =
  | { kind?: "fruit"; key?: string; svg: string; ratio: string; scale: number }
  | { kind: "node"; node: ReactNode };

export interface OrchardFruitStageProps {
  /** Falling items in drop order. A `node` item must render an element carrying `data-fruit`. */
  items?: OrchardFruitStageItem[];
  gravity?: number;
  seed?: number;
  settledRatio?: number;
  /** Lets the pointer grab and throw fruit. */
  interactive?: boolean;
  /** Click blast radius in px; 0 disables it. */
  clickBlastRadius?: number;
  /** Wait (up to this many ms) for web fonts before dropping, so text items measure correctly. */
  fontWaitMs?: number;
  /** Rotation in degrees per item for the static layout used with prefers-reduced-motion. */
  staticRotations?: number[];
  /** Called once the pile is calm (immediately when motion is reduced). */
  onSettled?: () => void;
  spawnX?: FruitPhysicsOptions["spawnX"];
  spawnY?: FruitPhysicsOptions["spawnY"];
  spawnAngle?: FruitPhysicsOptions["spawnAngle"];
  className?: string;
  style?: CSSProperties;
}

const suffixIds = (svg: string, suffix: string) => {
  const ids = Array.from(svg.matchAll(/\sid="([^"]+)"/g), (m) => m[1]);
  return ids.reduce(
    (out, id) => out.split(`"${id}"`).join(`"${id}-${suffix}"`).split(`(#${id})`).join(`(#${id}-${suffix})`),
    svg,
  );
};

/** Default silhouettes sized against a 300px reference, repeated `copies` times with unique svg ids. */
export function orchardFruitItems(factor = 1, copies = 1, idPrefix = "fruit"): OrchardFruitStageItem[] {
  const out: OrchardFruitStageItem[] = [];
  for (let c = 0; c < copies; c += 1) {
    ORCHARD_FRUIT_SHAPES.forEach((shape, i) => {
      out.push({
        key: `${idPrefix}-${c}-${i}`,
        svg: suffixIds(shape.svg, `${idPrefix}-${c}-${i}`),
        ratio: shape.ratio,
        scale: shape.scale * factor,
      });
    });
  }
  return out;
}

export function OrchardFruitStage({
  items,
  gravity = 1,
  seed,
  settledRatio,
  interactive = false,
  clickBlastRadius = 0,
  fontWaitMs = 0,
  staticRotations = [-9, 14, -18, 8, 20, -13, 6, -35, 17, -6, 11],
  onSettled,
  spawnX,
  spawnY,
  spawnAngle,
  className,
  style,
}: OrchardFruitStageProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [reduced, setReduced] = useState<boolean | null>(null);
  const settledRef = useRef(onSettled);
  useEffect(() => {
    settledRef.current = onSettled;
  });
  const list = useMemo(() => items ?? orchardFruitItems(1, 1, "stage"), [items]);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (reduced === null || !stage) return;
    if (reduced) {
      stage.dataset.fruitLoaderReady = "true";
      settledRef.current?.();
      return;
    }
    let cancelled = false;
    let physics: { destroy(): void } | null = null;
    (async () => {
      if (fontWaitMs > 0) {
        await Promise.race([document.fonts?.ready, new Promise((r) => window.setTimeout(r, fontWaitMs))]);
      }
      if (cancelled || !stageRef.current) return;
      physics = createFruitPhysics(stage, {
        gravity, seed, settledRatio, interactive, clickBlastRadius,
        onSettled: () => settledRef.current?.(),
        spawnX, spawnY, spawnAngle,
      });
      if (!physics) settledRef.current?.();
    })();
    return () => {
      cancelled = true;
      physics?.destroy();
    };
    // spawn callbacks are read once at mount, as the physics world is built once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, list, gravity, seed, settledRatio, interactive, clickBlastRadius, fontWaitMs]);

  const cls = [styles.stage, reduced ? styles.static : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div
      ref={stageRef}
      className={cls}
      style={style}
      data-fruit-loader-ready="false"
      data-fruit-stage-static={reduced ? "" : undefined}
      aria-hidden="true"
    >
      {list.map((item, i) =>
        item.kind === "node" ? (
          <span key={`n${i}`} style={{ display: "contents" }}>{item.node}</span>
        ) : (
          <div
            key={item.key ?? i}
            className={styles.fruit}
            data-fruit=""
            style={{
              width: `calc(var(--fruit-base, 200px) * ${item.scale})`,
              aspectRatio: item.ratio,
              ...(reduced ? { rotate: `${staticRotations[i % staticRotations.length]}deg` } : {}),
            }}
            dangerouslySetInnerHTML={{ __html: item.svg }}
          />
        ),
      )}
    </div>
  );
}
