"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";

export interface FixedVideoBackdropProps {
  id?: string;
  videoSrc?: string;
  mobileVideoSrc?: string;
  videoTitle?: string;
  fallbackTop?: string;
  fallbackCenter?: string;
  fallbackBottom?: string;
  fallbackDelayMs?: number;
  position?: "fixed" | "absolute";
  className?: string;
}

export function FixedVideoBackdrop({
  id,
  videoSrc,
  mobileVideoSrc,
  videoTitle = "Background video",
  fallbackTop = "22-25 OCTOBER 2026",
  fallbackCenter = "FESTIVAL 15",
  fallbackBottom = "HARBOUR CITY - NORTHLAND",
  fallbackDelayMs = 5000,
  position = "fixed",
  className,
}: FixedVideoBackdropProps) {
  const [mode, setMode] = useState<"pending" | "mobile" | "desktop">("pending");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showFallback, setShowFallback] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setMode(mobileQuery.matches ? "mobile" : "desktop");
    setReducedMotion(motionQuery.matches);
    const onMobile = (event: MediaQueryListEvent) => {
      setMode(event.matches ? "mobile" : "desktop");
      setVideoReady(false);
    };
    const onMotion = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mobileQuery.addEventListener("change", onMobile);
    motionQuery.addEventListener("change", onMotion);
    return () => {
      mobileQuery.removeEventListener("change", onMobile);
      motionQuery.removeEventListener("change", onMotion);
    };
  }, []);

  const src = mode === "mobile" ? (mobileVideoSrc ?? videoSrc) : videoSrc;
  const playable = Boolean(src) && !reducedMotion && mode !== "pending";

  useEffect(() => {
    if (!playable) {
      setShowFallback(true);
      return;
    }
    if (videoReady) {
      setShowFallback(false);
      return;
    }
    const timer = window.setTimeout(() => setShowFallback(true), fallbackDelayMs);
    return () => window.clearTimeout(timer);
  }, [playable, videoReady, fallbackDelayMs]);

  const post = useCallback((method: string, value?: unknown) => {
    const target = iframeRef.current?.contentWindow;
    if (!target) return;
    target.postMessage(JSON.stringify(value === undefined ? { method } : { method, value }), "*");
  }, []);

  useEffect(() => {
    if (!playable) return;
    let replay: number | undefined;
    const onMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow) return;
      let message: { event?: string } | null = null;
      try {
        message = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
      } catch {
        return;
      }
      if (message?.event === "ready") {
        post("addEventListener", "playing");
        post("addEventListener", "timeupdate");
        post("setVolume", 0);
        post("play");
        replay = window.setTimeout(() => post("play"), 300);
      }
      if (message?.event === "playing" || message?.event === "timeupdate") {
        setVideoReady(true);
      }
    };
    window.addEventListener("message", onMessage);
    return () => {
      window.removeEventListener("message", onMessage);
      if (replay) window.clearTimeout(replay);
    };
  }, [playable, post]);

  const rootClass = [styles.backdrop, position === "absolute" ? styles.absolute : "", className ?? ""]
    .filter(Boolean)
    .join(" ");
  const frameClass = mode === "mobile" ? `${styles.video} ${styles.videoMobile}` : styles.video;

  return (
    <div id={id} className={rootClass}>
      {showFallback && !videoReady ? (
        <div className={styles.fallback} aria-hidden="true">
          <p className={styles.edge}>{fallbackTop}</p>
          <div className={styles.center}>{fallbackCenter}</div>
          <p className={styles.edge}>{fallbackBottom}</p>
        </div>
      ) : null}

      {playable ? (
        <div className={styles.stage}>
          <iframe
            key={mode}
            ref={iframeRef}
            title={videoTitle}
            src={src}
            allow="autoplay; fullscreen; picture-in-picture"
            loading="eager"
            tabIndex={-1}
            className={frameClass}
            style={{ opacity: videoReady ? 1 : 0 }}
          />
        </div>
      ) : null}
    </div>
  );
}
