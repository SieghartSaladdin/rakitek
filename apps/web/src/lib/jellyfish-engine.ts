import {
  CORAL_PALETTE,
  CYAN_PALETTE,
  GOLD_PALETTE,
  makeJelly,
  type JellyAgent,
} from "./jellyfish-palettes";
import { drawJelly } from "./jellyfish-renderer";
import {
  createPlankton,
  drawReefAndAmbience,
  plotPixel,
  plotPixelRing,
  type PixelBubble,
} from "./reef-backdrop";

interface Ripple {
  x: number;
  y: number;
  radius: number;
  alpha: number;
}

interface Ember {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
}

export interface JellyfishScene {
  setSize: (w: number, h: number) => void;
  setPointer: (x: number, y: number) => void;
  clearPointer: () => void;
  pulseAt: (x: number, y: number) => void;
  render: (ctx: CanvasRenderingContext2D, now: number, reducedMotion: boolean) => void;
}

const IDLE_TIMEOUT_MS = 2500;

export function createJellyfishScene(initW: number, initH: number): JellyfishScene {
  let w = initW;
  let h = initH;

  const pointer = { x: w * 0.54, y: h * 0.42, active: false, lastMovedAt: 0 };
  const ripples: Ripple[] = [];
  const embers: Ember[] = [];
  const bubbles: PixelBubble[] = [];
  let plankton = createPlankton(w, h, 36);

  const jellies: JellyAgent[] = [
    makeJelly(w * 0.22, h * 0.32, 0.64, 7, 13, false, 0.24, 0.34, 0.31, 1.4, CYAN_PALETTE),
    makeJelly(w * 0.78, h * 0.28, 0.48, 5, 11, false, 0.77, 0.3, 0.38, 3.2, CORAL_PALETTE),
    makeJelly(w * 0.52, h * 0.44, 1.0, 9, 16, true, 0.5, 0.42, 0.42, 0, GOLD_PALETTE),
  ];

  return {
    setSize(nextW, nextH) {
      w = nextW;
      h = nextH;
      plankton = createPlankton(w, h, 36);
    },
    setPointer(x, y) {
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      pointer.lastMovedAt = performance.now();
    },
    clearPointer() {
      pointer.active = false;
    },
    pulseAt(x, y) {
      pointer.x = x;
      pointer.y = y;
      pointer.active = true;
      pointer.lastMovedAt = performance.now();
      ripples.push({ x, y, radius: 14, alpha: 0.72 });
      for (const j of jellies) j.surge = j.followsPointer ? 1 : 0.55;
      for (let i = 0; i < 16; i++) {
        const a = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 2.5;
        embers.push({ x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed, life: 1 });
      }
      for (let i = 0; i < 6; i++) {
        bubbles.push({
          x: x + (Math.random() - 0.5) * 40,
          y: y + (Math.random() - 0.5) * 20,
          vy: 0.7 + Math.random() * 0.9,
          wobble: Math.random() * 6,
          alpha: 0.55,
        });
      }
    },
    render(ctx, now, reducedMotion) {
      const t = now * 0.001;
      ctx.imageSmoothingEnabled = false;
      ctx.fillStyle = "#050506";
      ctx.fillRect(0, 0, w, h);

      if (!reducedMotion && bubbles.length < 18 && Math.random() < 0.04) {
        bubbles.push({
          x: Math.random() * w,
          y: h - 25,
          vy: 0.45 + Math.random() * 0.55,
          wobble: Math.random() * 6,
          alpha: 0.38,
        });
      }

      drawReefAndAmbience(ctx, w, h, t, plankton, bubbles, reducedMotion);

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += 4.5;
        r.alpha *= 0.93;
        if (r.alpha < 0.04) {
          ripples.splice(i, 1);
          continue;
        }
        plotPixelRing(ctx, r.x, r.y, r.radius, r.alpha);
      }

      for (let i = embers.length - 1; i >= 0; i--) {
        const p = embers[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.96;
        p.vy *= 0.96;
        p.life -= 0.022;
        if (p.life <= 0) {
          embers.splice(i, 1);
          continue;
        }
        plotPixel(ctx, p.x, p.y, p.life > 0.5 ? "#fafaf8" : `rgba(229, 184, 105, ${p.life.toFixed(2)})`);
      }

      const pointerLive =
        pointer.active && performance.now() - pointer.lastMovedAt < IDLE_TIMEOUT_MS;
      const effectivePointer = { x: pointer.x, y: pointer.y, active: pointerLive };

      for (const j of jellies) {
        drawJelly(ctx, j, w, h, t, effectivePointer, reducedMotion);
      }
    },
  };
}
