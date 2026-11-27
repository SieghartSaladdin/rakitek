"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { DEFAULT_PHOTO_SLIDES } from "./default-slides";
import { renderSlides, type SliderLayout } from "./slider-math";
import styles from "./styles.module.css";

export interface OrchardPhotoSlide {
  src: string;
  alt?: string;
}

export interface OrchardPhotoDragSliderProps {
  id?: string;
  images?: OrchardPhotoSlide[];
  /** Accessible name of the carousel track. */
  galleryLabel?: string;
  /** Visually hidden usage hint read before the carousel. */
  hint?: string;
  /** Text offered to `onCursorLabel` while a fine pointer hovers the track. */
  dragLabel?: string;
  /** Receives `dragLabel` on hover and `null` on leave (wire it to a custom cursor). */
  onCursorLabel?: (label: string | null) => void;
  className?: string;
}

const FOLLOW = 0.05;
const FRICTION = 0.93;
const THROW = 16;
const DRAG_THRESHOLD = 8;


export function OrchardPhotoDragSlider({
  id,
  images = DEFAULT_PHOTO_SLIDES,
  galleryLabel = "Photo gallery",
  hint = "Drag or use the arrow keys to browse the photo gallery.",
  dragLabel = "Drag",
  onCursorLabel,
  className,
}: OrchardPhotoDragSliderProps) {
  const list = useMemo(() => images.filter((i) => Boolean(i?.src)), [images]);
  const trackRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [repeat, setRepeat] = useState(1);
  const cursorRef = useRef(onCursorLabel);
  useEffect(() => {
    cursorRef.current = onCursorLabel;
  });

  const slides = useRef<HTMLElement[]>([]);
  const imgs = useRef<(HTMLElement | null)[]>([]);
  const extra = useRef<number[]>([]);
  const reduced = useRef(false);
  const draggingRef = useRef(false);
  const suppressClick = useRef(false);
  const repeatRef = useRef(1);
  const layout = useRef<SliderLayout>({ slideW: 0, step: 0, total: 0, half: 0, containerW: 0 });
  const st = useRef({
    pointerId: -1, startX: 0, startScroll: 0, lastX: 0, lastTime: 0,
    distance: 0, velocity: 0, momentum: 0, current: 0, target: 0, raf: 0,
  });

  const render = useCallback((offset: number) => {
    renderSlides(layout.current, slides.current, imgs.current, extra.current, offset, reduced.current);
  }, []);

  const tick = useCallback(
    function tick() {
      const e = st.current;
      e.raf = 0;
      if (!draggingRef.current && Math.abs(e.momentum) > 0.05) {
        e.target += e.momentum;
        e.momentum *= FRICTION;
        if (Math.abs(e.momentum) < 0.05) e.momentum = 0;
      }
      e.current += (e.target - e.current) * FOLLOW;
      if (Math.abs(e.target - e.current) < 0.4 && !e.momentum) e.current = e.target;
      render(e.current);
      if (draggingRef.current || Math.abs(e.target - e.current) >= 0.4 || e.momentum) {
        e.raf = requestAnimationFrame(tick);
      }
    },
    [render],
  );

  const kick = () => {
    const e = st.current;
    if (!e.raf) e.raf = requestAnimationFrame(tick);
  };

  const measure = useCallback(() => {
    const track = trackRef.current;
    if (!track || !list.length) return;
    const first = track.querySelector<HTMLElement>("[data-photo-slide]");
    if (!first) return;
    const l = layout.current;
    l.containerW = track.clientWidth;
    l.slideW = first.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).getPropertyValue("--photo-slide-gap")) || 40;
    l.step = l.slideW + gap;
    const needed = Math.ceil((l.containerW * 2) / l.step) + 2;
    const reps = Math.max(1, Math.ceil(needed / list.length));
    if (reps !== repeatRef.current) {
      repeatRef.current = reps;
      setRepeat(reps);
      return;
    }
    slides.current = Array.from(track.querySelectorAll<HTMLElement>("[data-photo-slide]"));
    imgs.current = slides.current.map((s) => s.querySelector<HTMLElement>("[data-photo-img]"));
    extra.current = imgs.current.map((img) => Math.max(0, ((img?.offsetWidth ?? 0) - l.slideW) / 2));
    l.total = slides.current.length * l.step;
    l.half = l.total / 2;
    render(st.current.current);
    setReady(true);
  }, [list.length, render]);

  useLayoutEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    measure();
  }, [repeat, measure]);

  useEffect(() => {
    const track = trackRef.current;
    let ro: ResizeObserver | null = null;
    if (track) {
      ro = new ResizeObserver(() => measure());
      ro.observe(track);
    }
    const e = st.current;
    return () => {
      if (e.raf) cancelAnimationFrame(e.raf);
      e.raf = 0;
      ro?.disconnect();
      cursorRef.current?.(null);
    };
  }, [measure]);

  const onPointerDown = (ev: PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track || !slides.current.length || ev.button !== 0) return;
    const e = st.current;
    draggingRef.current = true;
    setDragging(true);
    e.pointerId = ev.pointerId;
    e.startX = ev.clientX;
    e.startScroll = e.target;
    e.lastX = ev.clientX;
    e.lastTime = ev.timeStamp || performance.now();
    e.distance = 0;
    e.velocity = 0;
    e.momentum = 0;
    track.setPointerCapture(ev.pointerId);
  };

  const onPointerMove = (ev: PointerEvent<HTMLDivElement>) => {
    const e = st.current;
    if (!draggingRef.current || ev.pointerId !== e.pointerId) return;
    const delta = ev.clientX - e.startX;
    const now = ev.timeStamp || performance.now();
    const dt = Math.max(1, now - e.lastTime);
    e.velocity = e.velocity * 0.76 + ((ev.clientX - e.lastX) / dt) * 0.24;
    e.lastX = ev.clientX;
    e.lastTime = now;
    e.distance = Math.max(e.distance, Math.abs(delta));
    e.target = e.startScroll - delta;
    kick();
  };

  const onPointerUp = (ev: PointerEvent<HTMLDivElement>) => {
    const e = st.current;
    if (!draggingRef.current || (e.pointerId !== -1 && ev.pointerId !== e.pointerId)) return;
    draggingRef.current = false;
    setDragging(false);
    trackRef.current?.releasePointerCapture?.(ev.pointerId);
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

  const onKeyDown = (ev: KeyboardEvent<HTMLDivElement>) => {
    if (!slides.current.length) return;
    const dir = ev.key === "ArrowRight" ? 1 : ev.key === "ArrowLeft" ? -1 : 0;
    if (!dir) return;
    ev.preventDefault();
    const e = st.current;
    e.momentum = 0;
    e.target += dir * layout.current.step;
    kick();
  };

  if (!list.length) return null;
  const repeated = Array.from({ length: repeat }, () => list).flat();
  const rootCls = [styles.section, ready ? styles.ready : "", dragging ? styles.dragging : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <section id={id} className={rootCls} data-photo-slider>
      <p className={styles.visuallyHidden}>{hint}</p>
      <div
        ref={trackRef}
        className={styles.track}
        tabIndex={0}
        role="group"
        aria-roledescription="carousel"
        aria-label={galleryLabel}
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
        onKeyDown={onKeyDown}
        onDragStart={(ev) => ev.preventDefault()}
        onMouseEnter={() => {
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) onCursorLabel?.(dragLabel);
        }}
        onMouseLeave={() => onCursorLabel?.(null)}
      >
        {repeated.map((image, i) => (
          <figure key={i} className={styles.slide} data-photo-slide>
            <img
              className={styles.img}
              data-photo-img
              src={image.src}
              alt={image.alt ?? ""}
              draggable={false}
              loading="lazy"
              decoding="async"
              onLoad={measure}
            />
          </figure>
        ))}
      </div>
    </section>
  );
}
