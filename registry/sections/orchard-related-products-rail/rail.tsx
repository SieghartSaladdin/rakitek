"use client";

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";
import {
  OrchardJarSlideCard,
  type OrchardJarSlideCardProps,
} from "@registry/ui/orchard-jar-slide-card/component";
import styles from "./styles.module.css";

export type OrchardRelatedProduct = Omit<
  OrchardJarSlideCardProps,
  "dragging" | "onCardClick" | "onHoverChange" | "className"
>;

interface DragState {
  pointerId: number;
  startX: number;
  startY: number;
  startScroll: number;
  lastX: number;
  lastTime: number;
  distance: number;
  velocity: number;
  momentum: number;
  current: number;
  target: number;
  tick: number;
  animating: boolean;
  lockedAxis: "" | "x" | "y";
}

const FOLLOW = 0.075;
const FRICTION = 0.92;
const THROW = 18;
const DRAG_THRESHOLD = 8;

const maxScroll = (el: HTMLElement) => Math.max(0, el.scrollWidth - el.clientWidth);
const clampScroll = (el: HTMLElement, v: number) => Math.max(0, Math.min(maxScroll(el), v));

export function OrchardRelatedRail({
  items,
  inline = false,
  onSlideClick,
}: {
  items: OrchardRelatedProduct[];
  inline?: boolean;
  onSlideClick?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const draggingRef = useRef(false);
  const suppressClick = useRef(false);
  const st = useRef<DragState>({
    pointerId: -1,
    startX: 0,
    startY: 0,
    startScroll: 0,
    lastX: 0,
    lastTime: 0,
    distance: 0,
    velocity: 0,
    momentum: 0,
    current: 0,
    target: 0,
    tick: 0,
    animating: false,
    lockedAxis: "",
  });

  const scrollable = items.length >= 5;

  const frame = useCallback(function frame() {
    const e = st.current;
    const el = trackRef.current;
    e.tick = 0;
    if (!el) return;
    if (!draggingRef.current && Math.abs(e.momentum) > 0.05) {
      const next = clampScroll(el, e.target + e.momentum);
      if (Math.abs(next - e.target) < 0.05) {
        e.momentum = 0;
      } else {
        e.target = next;
        e.momentum *= FRICTION;
        if (Math.abs(e.momentum) < 0.05) e.momentum = 0;
      }
    }
    e.current += (e.target - e.current) * FOLLOW;
    if (Math.abs(e.target - e.current) < 0.5) e.current = e.target;
    el.scrollLeft = e.current;
    if (draggingRef.current || Math.abs(e.target - e.current) >= 0.5 || Math.abs(e.momentum) > 0.05) {
      e.tick = requestAnimationFrame(frame);
      return;
    }
    e.animating = false;
  }, []);

  const kick = () => {
    const e = st.current;
    if (!e.tick) {
      e.animating = true;
      e.tick = requestAnimationFrame(frame);
    }
  };

  useEffect(() => {
    const state = st.current;
    return () => {
      if (state.tick) cancelAnimationFrame(state.tick);
    };
  }, []);

  const onPointerDown = (ev: PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    if (!el || !scrollable || ev.pointerType !== "mouse" || ev.button !== 0) return;
    const e = st.current;
    e.pointerId = ev.pointerId;
    e.startX = ev.clientX;
    e.startY = ev.clientY;
    e.startScroll = el.scrollLeft;
    e.lastX = ev.clientX;
    e.lastTime = ev.timeStamp || performance.now();
    e.distance = 0;
    e.velocity = 0;
    e.momentum = 0;
    e.current = el.scrollLeft;
    e.target = el.scrollLeft;
    e.lockedAxis = "";
    draggingRef.current = true;
    setDragging(true);
    el.setPointerCapture?.(ev.pointerId);
  };

  const onPointerMove = (ev: PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const e = st.current;
    if (!el || !draggingRef.current || ev.pointerId !== e.pointerId) return;
    const dx = ev.clientX - e.startX;
    const dy = ev.clientY - e.startY;
    if (!e.lockedAxis) {
      if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
      e.lockedAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
    }
    if (e.lockedAxis !== "x") return;
    const now = ev.timeStamp || performance.now();
    const dt = Math.max(1, now - e.lastTime);
    const v = (ev.clientX - e.lastX) / dt;
    e.velocity = e.velocity * 0.76 + v * 0.24;
    e.lastX = ev.clientX;
    e.lastTime = now;
    e.distance = Math.max(e.distance, Math.abs(dx));
    e.target = clampScroll(el, e.startScroll - dx);
    kick();
  };

  const onPointerUp = (ev: PointerEvent<HTMLDivElement>) => {
    const el = trackRef.current;
    const e = st.current;
    if (!draggingRef.current || (e.pointerId !== -1 && ev.pointerId !== e.pointerId)) return;
    draggingRef.current = false;
    setDragging(false);
    el?.releasePointerCapture?.(ev.pointerId);
    e.pointerId = -1;
    e.momentum = -e.velocity * THROW;
    kick();
    if (e.distance > DRAG_THRESHOLD) {
      suppressClick.current = true;
      setTimeout(() => {
        suppressClick.current = false;
      }, 0);
    }
  };

  if (!items.length) return null;

  const sliderCls = `${styles.slider} ${inline ? styles.sliderInline : ""}`;
  const trackCls = [
    styles.sliderTrack,
    scrollable ? styles.sliderTrackScroll : "",
    dragging ? styles.sliderTrackDragging : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={sliderCls}>
      <div
        ref={trackRef}
        className={trackCls}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onClickCapture={(ev) => {
          if (suppressClick.current) {
            ev.preventDefault();
            ev.stopPropagation();
          }
        }}
        onDragStart={(ev) => ev.preventDefault()}
      >
        {items.map((item) => (
          <OrchardJarSlideCard
            key={item.id}
            {...item}
            dragging={dragging}
            onCardClick={onSlideClick}
          />
        ))}
      </div>
    </div>
  );
}
