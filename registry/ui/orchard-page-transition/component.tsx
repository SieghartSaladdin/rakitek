"use client";

import type { AnimationEvent } from "react";
import styles from "./styles.module.css";

export type OrchardTransitionPhase = "idle" | "covering" | "lifting";

export interface OrchardPageTransitionProps {
  /** `covering` slides the panel up over the page, `lifting` carries it off the top. */
  phase?: OrchardTransitionPhase;
  onCoverFinished?: () => void;
  onLiftFinished?: () => void;
  /** Positions the layer with `position: absolute` inside its parent instead of fixed to the viewport. */
  contained?: boolean;
  className?: string;
}

export function OrchardPageTransition({
  phase = "idle",
  onCoverFinished,
  onLiftFinished,
  contained = false,
  className,
}: OrchardPageTransitionProps) {
  const onEnd = (e: AnimationEvent<HTMLDivElement>) => {
    if (e.animationName.includes("panelCover")) onCoverFinished?.();
    else if (e.animationName.includes("panelLift")) onLiftFinished?.();
  };
  const cls = [
    styles.layer,
    contained ? styles.contained : "",
    phase === "covering" ? styles.covering : "",
    phase === "lifting" ? styles.lifting : "",
    className ?? "",
  ].filter(Boolean).join(" ");
  return (
    <div className={cls} aria-hidden="true" data-page-transition>
      <div className={styles.panel} onAnimationEnd={onEnd} />
      <div className={styles.line} />
    </div>
  );
}
