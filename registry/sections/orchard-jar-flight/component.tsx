"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { OrchardSpinningJar, type OrchardSpinningJarHandle } from "@registry/ui/orchard-spinning-jar/component";
import styles from "./styles.module.css";

export interface OrchardJarFlightRect {
  /** Centre in viewport px. */
  cx: number;
  cy: number;
  /** Layout size in px (before scale). */
  width: number;
  height: number;
  rotation: number;
  scale: number;
}

export interface OrchardJarFlightData {
  /** Transparent jar photo. */
  baseSrc: string;
  /** Snapshot of the label shown until the three.js label is ready. */
  labelSrc?: string;
  /** Label artwork wrapped by three.js; omit for a flat jar. */
  labelUrl?: string;
  /** Seconds the label has already spun in the source slider. */
  spinElapsed?: number;
  from: OrchardJarFlightRect;
  to: OrchardJarFlightRect;
}

export interface OrchardJarFlightProps {
  flight?: OrchardJarFlightData | null;
  /** The destination jar is in place, so the clone may land on it. */
  heroReady?: boolean;
  /** The page transition allows landing (the new page has been lifted). */
  canLand?: boolean;
  flightMs?: number;
  /** Fail-safe: the clone is removed after this long even if it never landed. */
  maxFlightMs?: number;
  onLanded?: () => void;
  /** Called when the clone is removed (landed or timed out). */
  onFinish?: () => void;
  className?: string;
}

const MAX_FRAME_MS = 32;
const LAND_REMOVE_MS = 180;
const SPIN_SECONDS = 2;

const cubicBezier = (x1: number, y1: number, x2: number, y2: number) => {
  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sx = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sy = (t: number) => ((ay * t + by) * t + cy) * t;
  const dx = (t: number) => (3 * ax * t + 2 * bx) * t + cx;
  const solve = (x: number) => {
    let t = x;
    for (let i = 0; i < 5; i += 1) {
      const err = sx(t) - x;
      const d = dx(t);
      if (Math.abs(err) < 1e-6 || d === 0) return t;
      t -= err / d;
    }
    return t;
  };
  return (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : sy(solve(x)));
};
const ease = cubicBezier(0.22, 1, 0.36, 1);
const easeInOutQuint = (t: number) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);

type Pose = { cx: number; cy: number; scale: number; rotation: number };
const startPose = (f: OrchardJarFlightData): Pose => ({
  cx: f.from.cx,
  cy: f.from.cy,
  scale: (f.from.height * f.from.scale) / f.to.height,
  rotation: f.from.rotation,
});
const endPose = (f: OrchardJarFlightData): Pose => ({ cx: f.to.cx, cy: f.to.cy, scale: f.to.scale, rotation: f.to.rotation });
const applyPose = (el: HTMLElement, origin: Pose, p: Pose) => {
  el.style.transform = `translate3d(${p.cx - origin.cx}px, ${p.cy - origin.cy}px, 0px) rotate(${p.rotation}deg) scale(${p.scale})`;
};

/** Fixed clone of a clicked jar that flies to the destination jar and spins its label on the way. */
export function OrchardJarFlight({
  flight = null,
  heroReady = true,
  canLand = true,
  flightMs = 2000,
  maxFlightMs = 6000,
  onLanded,
  onFinish,
  className,
}: OrchardJarFlightProps) {
  const cloneRef = useRef<HTMLDivElement>(null);
  const spinRef = useRef<OrchardSpinningJarHandle | null>(null);
  const [labelReady, setLabelReady] = useState(false);
  const [landed, setLanded] = useState(false);
  const live = useRef({ heroReady, canLand, onLanded, onFinish });
  useEffect(() => {
    live.current = { heroReady, canLand, onLanded, onFinish };
  });

  useEffect(() => {
    setLabelReady(false);
    setLanded(false);
    const el = cloneRef.current;
    if (!flight || !el) return;
    const origin = startPose(flight);
    applyPose(el, origin, origin);
    let raf = 0;
    let elapsed = 0;
    let last = 0;
    let removeTimer = 0;
    const failSafe = window.setTimeout(() => live.current.onFinish?.(), maxFlightMs);
    const frame = (now: number) => {
      const node = cloneRef.current;
      if (!node) return;
      elapsed += Math.min(MAX_FRAME_MS, now - last);
      last = now;
      const a = startPose(flight);
      const b = endPose(flight);
      const p = Math.min(1, elapsed / flightMs);
      const k = ease(p);
      applyPose(node, a, {
        cx: a.cx + (b.cx - a.cx) * k,
        cy: a.cy + (b.cy - a.cy) * k,
        scale: a.scale + (b.scale - a.scale) * k,
        rotation: a.rotation + (b.rotation - a.rotation) * k,
      });
      const already = flight.spinElapsed ?? 0;
      const spin = already > 0 ? (already + elapsed / 1000) / SPIN_SECONDS : elapsed / flightMs;
      spinRef.current?.setSpin(easeInOutQuint(Math.min(1, spin)));
      if (p >= 1 && live.current.heroReady && live.current.canLand) {
        setLanded(true);
        live.current.onLanded?.();
        removeTimer = window.setTimeout(() => live.current.onFinish?.(), LAND_REMOVE_MS);
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame((now) => {
      last = now;
      raf = requestAnimationFrame(frame);
    });
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(failSafe);
      window.clearTimeout(removeTimer);
    };
  }, [flight, flightMs, maxFlightMs]);

  if (!flight) return null;
  const style: CSSProperties = {
    left: `${flight.from.cx - flight.to.width / 2}px`,
    top: `${flight.from.cy - flight.to.height / 2}px`,
    width: `${flight.to.width}px`,
    height: `${flight.to.height}px`,
  };
  const cls = [styles.flight, landed ? styles.landed : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div ref={cloneRef} className={cls} style={style} aria-hidden="true" data-jar-flight>
      <OrchardSpinningJar
        jarImage={flight.baseSrc}
        labelImage={flight.labelUrl ?? ""}
        handleRef={spinRef}
        onReady={() => setLabelReady(true)}
        style={{ height: "100%", inset: 0, position: "absolute", width: "100%" }}
      />
      {flight.labelSrc && !labelReady ? <img className={styles.snapshot} src={flight.labelSrc} alt="" /> : null}
    </div>
  );
}
