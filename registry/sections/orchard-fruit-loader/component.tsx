"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  OrchardFruitStage,
  orchardFruitItems,
  type OrchardFruitStageItem,
} from "@registry/ui/orchard-fruit-stage/component";
import styles from "./styles.module.css";

export interface OrchardFruitLoaderProps {
  id?: string;
  /** Duration of the closing sweep in ms. */
  closeDelayMs?: number;
  gravity?: number;
  /** Duration of the 0 to 100 counter in ms. */
  progressDurationMs?: number;
  /** Delay before the counter appears, in ms. */
  progressDelayMs?: number;
  /** Text appended to the counter. */
  progressSuffix?: string;
  /** Freezes the counter and the close timers so the loader stays on screen for inspection. */
  paused?: boolean;
  /** Pins the loader to the viewport; set false to fill the parent element instead. */
  fixed?: boolean;
  /** Fires when the panel covers the intro (about 46% into the close). */
  onCovered?: () => void;
  /** Fires when the page behind may start its entrance (about 62% into the close). */
  onRevealing?: () => void;
  /** Fires once the loader has fully closed and unmounted. */
  onComplete?: () => void;
  className?: string;
}

const COPIES = 2;
const LOADER_SCALE = 1.2;
const COVER_AT = 0.46;
const REVEAL_AT = 0.62;
const HARD_CLOSE_DESKTOP = 2000;
const HARD_CLOSE_MOBILE = 2500;
const SETTLED_RATIO = 0.8;

export function OrchardFruitLoader({
  id,
  closeDelayMs = 1800,
  gravity = 3.35,
  progressDurationMs = 1700,
  progressDelayMs = 300,
  progressSuffix = "%",
  paused = false,
  fixed = true,
  onCovered,
  onRevealing,
  onComplete,
  className,
}: OrchardFruitLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [closing, setClosing] = useState(false);
  const [done, setDone] = useState(false);
  const flags = useRef({ settled: false, counted: false, closed: false });
  const cbs = useRef({ onCovered, onRevealing, onComplete });
  useEffect(() => {
    cbs.current = { onCovered, onRevealing, onComplete };
  });
  const timers = useRef<number[]>([]);

  const items = useMemo(() => {
    const out: OrchardFruitStageItem[] = [];
    for (let c = 0; c < COPIES; c += 1) {
      out.push(...orchardFruitItems(LOADER_SCALE * 0.8 * (0.9 + ((c * 7) % 5) * 0.05), 1, `loader-${c}`));
    }
    return out;
  }, []);

  const close = () => {
    const f = flags.current;
    if (f.closed) return;
    f.closed = true;
    setClosing(true);
    const at = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    at(() => cbs.current.onCovered?.(), Math.round(closeDelayMs * COVER_AT));
    at(() => cbs.current.onRevealing?.(), Math.round(closeDelayMs * REVEAL_AT));
    at(() => {
      setDone(true);
      cbs.current.onComplete?.();
    }, closeDelayMs);
  };
  const maybeClose = () => {
    if (flags.current.settled && flags.current.counted) close();
  };

  useEffect(() => {
    if (paused) return;
    const f = flags.current;
    let raf = 0;
    const hard = window.setTimeout(
      close,
      window.matchMedia("(max-width: 480px)").matches ? HARD_CLOSE_MOBILE : HARD_CLOSE_DESKTOP,
    );
    const start = window.setTimeout(() => {
      let t0 = 0;
      const step = (ts: number) => {
        if (!t0) t0 = ts;
        const x = Math.min(1, (ts - t0) / progressDurationMs);
        setProgress(Math.round((1 - (1 - x) ** 3) * 100));
        if (x < 1) {
          raf = requestAnimationFrame(step);
          return;
        }
        f.counted = true;
        maybeClose();
      };
      raf = requestAnimationFrame(step);
    }, progressDelayMs);
    const pending = timers.current;
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hard);
      window.clearTimeout(start);
      pending.forEach((t) => window.clearTimeout(t));
      pending.length = 0;
    };
    // the loader runs once per mount
  }, [paused]);

  if (done) return null;
  const cls = [styles.loader, fixed ? "" : styles.contained, closing ? styles.closing : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div id={id} className={cls} aria-hidden="true" data-fruit-loader>
      <div className={styles.content}>
        <div className={styles.mark}>
          {progress}
          {progressSuffix}{" "}
        </div>
        <OrchardFruitStage
          className={styles.stage}
          items={items}
          gravity={gravity}
          settledRatio={SETTLED_RATIO}
          onSettled={() => {
            flags.current.settled = true;
            if (!paused) maybeClose();
          }}
        />
      </div>
      <div className={styles.sweep}>
        <div className={styles.sweepPanel} />
        <div className={styles.sweepLine} />
      </div>
    </div>
  );
}
