"use client";

import { useEffect, useRef, useState, type CSSProperties, type MutableRefObject } from "react";
import { jarArt, labelArt } from "./jar-art";
import { createJarLabel, type JarLabel } from "./jar-label";
import styles from "./styles.module.css";

export { jarArt, labelArt };

export interface OrchardSpinningJarHandle {
  /** Rotates the label, 0 to 1 (about half a turn). */
  setSpin(progress: number): void;
}

export interface OrchardSpinningJarProps {
  /** Transparent jar photo; the label area stays empty. */
  jarImage?: string;
  /** Flat label artwork wrapped around the jar by three.js. */
  labelImage?: string;
  alt?: string;
  /** Controlled spin, 0 to 1. Use `handleRef` for per-frame updates. */
  spin?: number;
  handleRef?: MutableRefObject<OrchardSpinningJarHandle | null>;
  /** Fires once the label texture has been drawn (or immediately when WebGL is unavailable). */
  onReady?: () => void;
  /** Hides the jar until a flying clone has landed. */
  pending?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function OrchardSpinningJar({
  jarImage = jarArt("goldenrod"),
  labelImage = labelArt("PISTACHIO", "Velvet Cream", "darkseagreen", "darkolivegreen"),
  alt = "",
  spin = 0,
  handleRef,
  onReady,
  pending = false,
  className,
  style,
}: OrchardSpinningJarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const jarRef = useRef<JarLabel | null>(null);
  const readyRef = useRef(onReady);
  const spinRef = useRef(spin);
  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    readyRef.current = onReady;
    spinRef.current = spin;
    jarRef.current?.setSpin(spin);
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !labelImage) return;
    const jar = createJarLabel(canvas, labelImage, () => readyRef.current?.());
    jarRef.current = jar;
    if (!jar) {
      setFallback(true);
      readyRef.current?.();
      return;
    }
    setFallback(false);
    jar.setSpin(spinRef.current);
    if (handleRef) handleRef.current = jar;
    return () => {
      if (handleRef) handleRef.current = null;
      jar.destroy();
      jarRef.current = null;
    };
  }, [labelImage, handleRef]);

  const cls = [styles.jar, pending ? styles.pending : "", className ?? ""].filter(Boolean).join(" ");
  return (
    <div className={cls} style={style} data-spinning-jar>
      <img className={styles.base} src={jarImage} alt={alt} width={630} height={1013} decoding="async" />
      {fallback ? <img className={styles.label} src={labelImage} alt="" /> : null}
      <canvas ref={canvasRef} className={styles.label} aria-hidden="true" hidden={fallback} />
    </div>
  );
}
