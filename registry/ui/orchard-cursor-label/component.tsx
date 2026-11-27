"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export interface OrchardCursorLabelProps {
  /** Text shown in the pill; a falsy value hides it. */
  label?: string | null;
  /** Lerp factor of the follow motion (1 snaps to the pointer). */
  follow?: number;
  /** Distance in px at which a newly shown pill jumps to the pointer instead of gliding. */
  jumpDistance?: number;
  /** Milliseconds to wait before hiding, so quick moves between zones do not flicker. */
  hideDelay?: number;
  className?: string;
}

/** Pill that follows a fine pointer over sliders ("Drag", "Click") and is inert on touch devices. */
export function OrchardCursorLabel({
  label = "Drag",
  follow = 0.12,
  jumpDistance = 80,
  hideDelay = 90,
  className,
}: OrchardCursorLabelProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [text, setText] = useState(label ?? "");
  const active = Boolean(label);
  const live = useRef({ tx: 0, ty: 0, x: 0, y: 0, raf: 0, seen: false, reduced: false, shown: false, hide: 0 });

  useEffect(() => {
    if (label) setText(label);
  }, [label]);

  useEffect(() => {
    const s = live.current;
    const apply = () => {
      if (rootRef.current) rootRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
    };
    const tick = () => {
      const k = s.reduced ? 1 : follow;
      s.x += (s.tx - s.x) * k;
      s.y += (s.ty - s.y) * k;
      apply();
      s.raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      s.tx = e.clientX;
      s.ty = e.clientY;
      if (!s.seen) {
        s.seen = true;
        s.x = s.tx;
        s.y = s.ty;
        apply();
      }
    };
    const show = () => {
      window.clearTimeout(s.hide);
      s.hide = 0;
      if (!s.shown && Math.hypot(s.tx - s.x, s.ty - s.y) > jumpDistance) {
        s.x = s.tx;
        s.y = s.ty;
        apply();
      }
      s.shown = true;
      setVisible(true);
      if (!s.raf) s.raf = requestAnimationFrame(tick);
    };
    const hide = () => {
      if (s.hide) return;
      s.hide = window.setTimeout(() => {
        s.hide = 0;
        s.shown = false;
        setVisible(false);
        cancelAnimationFrame(s.raf);
        s.raf = 0;
      }, hideDelay);
    };
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
      s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.addEventListener("pointermove", onMove, { passive: true });
      if (active) show();
      else hide();
    }
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.clearTimeout(s.hide);
      s.hide = 0;
      cancelAnimationFrame(s.raf);
      s.raf = 0;
    };
  }, [active, follow, jumpDistance, hideDelay]);

  return (
    <div ref={rootRef} className={className ? `${styles.root} ${className}` : styles.root} aria-hidden="true" data-cursor-label>
      <div className={visible ? `${styles.pill} ${styles.visible}` : styles.pill}>
        <span className={styles.diamond} />
        <span className={styles.text}>{text}</span>
      </div>
    </div>
  );
}
