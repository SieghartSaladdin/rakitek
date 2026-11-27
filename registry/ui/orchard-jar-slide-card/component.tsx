"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";
import { createFruitPhysics, scopeSvgIds, type FruitPhysicsHandle } from "./fruit-physics";
import styles from "./styles.module.css";

export interface OrchardJarSlideCardProps {
  id: string;
  title: string;
  imageSrc: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
  hoverBg?: string;
  svgMarkup?: string;
  href?: string;
  dragging?: boolean;
  onCardClick?: (id: string, event: MouseEvent<HTMLAnchorElement>) => void;
  onHoverChange?: (hovered: boolean, title: string) => void;
  className?: string;
}

const DECOR_COUNT = 9;
const DECOR_WIDTH = "35.64%";
const LEAVE_DELAY = 400;

export function OrchardJarSlideCard({
  id,
  title,
  imageSrc,
  imageAlt,
  imageWidth = 367,
  imageHeight = 481,
  hoverBg = "var(--rk-surface)",
  svgMarkup = "",
  href = "#product",
  dragging = false,
  onCardClick,
  onHoverChange,
  className,
}: OrchardJarSlideCardProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const physicsRef = useRef<FruitPhysicsHandle | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoveredRef = useRef(false);
  const [hovered, setHovered] = useState(false);
  const [decorOn, setDecorOn] = useState(false);
  const [enterTick, setEnterTick] = useState(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const resetTransforms = useCallback(() => {
    stageRef.current?.querySelectorAll<HTMLElement>("[data-fruit]").forEach((el) => {
      el.style.transform = "";
    });
  }, []);

  const onEnter = () => {
    if (dragging || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    clearTimer();
    hoveredRef.current = true;
    setHovered(true);
    setDecorOn(true);
    onHoverChange?.(true, title);
    if (svgMarkup) setEnterTick((n) => n + 1);
  };

  const onLeave = () => {
    hoveredRef.current = false;
    setHovered(false);
    onHoverChange?.(false, title);
    clearTimer();
    if (!physicsRef.current) {
      setDecorOn(false);
      return;
    }
    physicsRef.current.destroy();
    physicsRef.current = null;
    timerRef.current = setTimeout(() => {
      setDecorOn(false);
      resetTransforms();
      timerRef.current = null;
    }, LEAVE_DELAY);
  };

  useEffect(() => {
    if (!enterTick) return;
    const stage = stageRef.current;
    if (!hoveredRef.current || !stage) return;
    physicsRef.current?.destroy();
    physicsRef.current = createFruitPhysics(stage, { gravity: 3.5 });
  }, [enterTick]);

  useEffect(() => {
    if (!dragging) return;
    hoveredRef.current = false;
    setHovered(false);
    setDecorOn(false);
    clearTimer();
    physicsRef.current?.destroy();
    physicsRef.current = null;
    resetTransforms();
  }, [dragging, clearTimer, resetTransforms]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
      physicsRef.current?.destroy();
      physicsRef.current = null;
    };
  }, []);

  const decor = useMemo(
    () =>
      (decorOn ? Array.from({ length: DECOR_COUNT }, (_, i) => i) : []).map((index) => ({
        index,
        html: scopeSvgIds(svgMarkup, `${id}-${index}`),
      })),
    [decorOn, svgMarkup, id],
  );

  const rootClasses = [styles.card, hovered ? styles.isActive : "", className ?? ""]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={rootClasses}
      style={{ "--slide-bg": hoverBg } as CSSProperties}
      aria-label={title}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div
        ref={stageRef}
        className={styles.stage}
        data-fruit-loader-ready="false"
        aria-hidden="true"
      >
        {decor.map((d) => (
          <div
            key={d.index}
            className={styles.decor}
            data-fruit=""
            style={{ width: DECOR_WIDTH }}
            dangerouslySetInnerHTML={{ __html: d.html }}
          />
        ))}
      </div>
      <figure className={styles.jar}>
        <img
          src={imageSrc}
          alt={imageAlt ?? title}
          width={imageWidth}
          height={imageHeight}
          loading="lazy"
          decoding="async"
        />
      </figure>
      {href ? (
        <a
          className={styles.link}
          href={href}
          aria-label={title}
          onClick={onCardClick ? (e) => onCardClick(id, e) : undefined}
        />
      ) : null}
    </article>
  );
}
