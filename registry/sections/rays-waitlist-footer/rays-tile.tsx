"use client";

import { useEffect, useRef, useState, type RefObject } from "react";
import * as THREE from "three";
import {
  MARK_ASPECT,
  MARK_TEX_H,
  MARK_TEX_PAD,
  MARK_TEX_W,
  RAYS_FRAGMENT_SHADER,
  RAYS_VERTEX_SHADER,
  createMarkTexture,
  readAccentTint,
} from "./rays-shaders";

const LIGHT_REST = { x: 0.454, y: 0.32 };
const POINTER_PULL = 0.28;
const LIGHT_RANGE = 0.46;
const SPRING_STIFFNESS = 70;
const SPRING_DAMPING = 8.5;

interface RaysTileProps {
  tileRef: RefObject<HTMLDivElement | null>;
  live: boolean;
  className?: string;
  fallbackClassName?: string;
}

export function RaysTile({ tileRef, live, className, fallbackClassName }: RaysTileProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const liveRef = useRef(live);
  liveRef.current = live;
  const [fallback, setFallback] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const tile = tileRef.current;
    if (!canvas || !tile) return;

    const reducedMotion =
      typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarseMobile =
      typeof matchMedia === "function" &&
      matchMedia("(pointer: coarse)").matches &&
      Math.min(window.screen.width, window.screen.height) < 820;

    if (coarseMobile) {
      setFallback(true);
      return;
    }

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        premultipliedAlpha: true,
        antialias: false,
        depth: false,
        stencil: false,
        powerPreference: "low-power",
      });
    } catch {
      setFallback(true);
      return;
    }

    renderer.setPixelRatio(1);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const markTexture = createMarkTexture();

    const uniforms = {
      uRes: { value: new THREE.Vector2(1, 1) },
      uLight: { value: new THREE.Vector2(0, 0) },
      uTileC: { value: new THREE.Vector2(0, 0) },
      uTileH: { value: new THREE.Vector2(1, 1) },
      uTileR: { value: 16 },
      uMarkH: { value: new THREE.Vector2(1, 1) },
      uMark: { value: markTexture },
      uSpread: { value: 180 },
      uIntensity: { value: 0.25 },
      uTint: { value: readAccentTint(tile) },
    };

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      vertexShader: RAYS_VERTEX_SHADER,
      fragmentShader: RAYS_FRAGMENT_SHADER,
      uniforms,
      depthTest: false,
      depthWrite: false,
    });
    scene.add(new THREE.Mesh(geometry, material));

    let renderScale = 1;
    let visible = true;
    let dirty = true;
    const pointer = { x: NaN, y: NaN };
    const light = { x: 0, y: 0, vx: 0, vy: 0, init: false };
    let lastTile = { cx: 0, cy: 0, w: 0 };

    const resize = () => {
      const dpr = Math.min(1, window.devicePixelRatio || 1);
      renderScale = Math.min(1, dpr * 0.6);
      const w = Math.max(1, Math.floor(canvas.clientWidth * renderScale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * renderScale));
      renderer.setSize(w, h, false);
      uniforms.uRes.value.set(w, h);
      uniforms.uTint.value.copy(readAccentTint(tile));
      dirty = true;
    };
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) dirty = true;
      },
      { threshold: 0 },
    );
    io.observe(canvas);

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY;
    };
    if (!reducedMotion) window.addEventListener("pointermove", onPointerMove, { passive: true });

    let raf = 0;
    let prevTime = performance.now();
    const frame = () => {
      raf = requestAnimationFrame(frame);
      const now = performance.now();
      const dt = Math.min(0.05, (now - prevTime) / 1000);
      prevTime = now;
      if (!visible || !liveRef.current) return;

      const canvasRect = canvas.getBoundingClientRect();
      const tileRect = tile.getBoundingClientRect();
      if (!tileRect.width) return;

      const cx = tileRect.left - canvasRect.left + tileRect.width / 2;
      const cy = tileRect.top - canvasRect.top + tileRect.height / 2;
      const halfW = tileRect.width / 2;
      const halfH = tileRect.height / 2;
      if (cx !== lastTile.cx || cy !== lastTile.cy || tileRect.width !== lastTile.w) {
        dirty = true;
        lastTile = { cx, cy, w: tileRect.width };
      }

      let targetX = cx + (LIGHT_REST.x - 0.5) * tileRect.width;
      let targetY = cy + (LIGHT_REST.y - 0.5) * tileRect.height;
      if (!reducedMotion && !Number.isNaN(pointer.x)) {
        targetX += (pointer.x - canvasRect.left - cx) * POINTER_PULL;
        targetY += (pointer.y - canvasRect.top - cy) * POINTER_PULL;
      }
      targetX = Math.max(cx - halfW * LIGHT_RANGE, Math.min(cx + halfW * LIGHT_RANGE, targetX));
      targetY = Math.max(cy - halfH * LIGHT_RANGE, Math.min(cy + halfH * LIGHT_RANGE, targetY));

      if (!light.init) {
        light.x = targetX;
        light.y = targetY;
        light.init = true;
        dirty = true;
      } else {
        light.vx += (targetX - light.x) * SPRING_STIFFNESS * dt;
        light.vy += (targetY - light.y) * SPRING_STIFFNESS * dt;
        const damping = Math.exp(-SPRING_DAMPING * dt);
        light.vx *= damping;
        light.vy *= damping;
        const nextX = light.x + light.vx * dt;
        const nextY = light.y + light.vy * dt;
        if (Math.abs(nextX - light.x) > 0.02 || Math.abs(nextY - light.y) > 0.02) dirty = true;
        light.x = nextX;
        light.y = nextY;
      }
      if (!dirty) return;
      dirty = false;

      tile.style.setProperty("--lx", `${(((light.x - (cx - halfW)) / tileRect.width) * 100).toFixed(1)}%`);
      tile.style.setProperty("--ly", `${(((light.y - (cy - halfH)) / tileRect.height) * 100).toFixed(1)}%`);

      const markW = tileRect.width * 0.62;
      const markH = markW / MARK_ASPECT;
      uniforms.uLight.value.set(light.x * renderScale, light.y * renderScale);
      uniforms.uTileC.value.set(cx * renderScale, cy * renderScale);
      uniforms.uTileH.value.set(halfW * renderScale, halfH * renderScale);
      uniforms.uTileR.value = Math.min(32, halfW * 0.5) * renderScale;
      uniforms.uMarkH.value.set(
        ((markW * ((MARK_TEX_W + MARK_TEX_PAD * 2) / MARK_TEX_W)) / 2) * renderScale,
        ((markH * ((MARK_TEX_H + MARK_TEX_PAD * 2) / MARK_TEX_H)) / 2) * renderScale,
      );
      uniforms.uSpread.value = tileRect.width * 3.2 * renderScale;
      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      geometry.dispose();
      material.dispose();
      markTexture.dispose();
      renderer.dispose();
    };
  }, [tileRef]);

  return (
    <>
      {fallback && <div className={fallbackClassName} aria-hidden="true" />}
      <canvas ref={canvasRef} className={className} aria-hidden="true" />
    </>
  );
}
