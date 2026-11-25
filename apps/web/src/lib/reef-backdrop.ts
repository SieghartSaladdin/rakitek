export const CELL = 5;

export interface PixelBubble {
  x: number;
  y: number;
  vy: number;
  wobble: number;
  alpha: number;
}

export interface PlanktonDot {
  x: number;
  y: number;
  phase: number;
  speed: number;
  warm: boolean;
}

export interface CoralSpec {
  xRatio: number;
  height: number;
  branches: number;
  kind: "staghorn" | "kelp" | "fan";
  tone: string;
  tip: string;
}

const CORALS: CoralSpec[] = [
  { xRatio: 0.06, height: 115, branches: 3, kind: "kelp", tone: "#183336", tip: "#5fb4b8" },
  { xRatio: 0.14, height: 85, branches: 4, kind: "staghorn", tone: "#3a221d", tip: "#d97855" },
  { xRatio: 0.25, height: 68, branches: 3, kind: "fan", tone: "#252936", tip: "#e5b869" },
  { xRatio: 0.37, height: 95, branches: 3, kind: "kelp", tone: "#152b30", tip: "#7cd4d8" },
  { xRatio: 0.54, height: 74, branches: 4, kind: "staghorn", tone: "#3d271c", tip: "#e5b869" },
  { xRatio: 0.67, height: 110, branches: 3, kind: "kelp", tone: "#183336", tip: "#6bc4c8" },
  { xRatio: 0.77, height: 88, branches: 4, kind: "staghorn", tone: "#452420", tip: "#d97855" },
  { xRatio: 0.87, height: 72, branches: 3, kind: "fan", tone: "#232836", tip: "#e5b869" },
  { xRatio: 0.94, height: 120, branches: 3, kind: "kelp", tone: "#14292e", tip: "#5fb4b8" },
];

export function snap(v: number): number {
  return Math.round(v / CELL) * CELL;
}

export function plotPixel(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string,
  size = 1,
) {
  ctx.fillStyle = color;
  ctx.fillRect(snap(x), snap(y), CELL * size, CELL * size);
}

export function plotPixelLine(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  color: string,
) {
  const steps = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / CELL));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    plotPixel(ctx, x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, color);
  }
}

export function plotPixelRing(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  radius: number,
  alpha: number,
) {
  const count = Math.max(16, Math.floor((Math.PI * 2 * radius) / (CELL * 1.6)));
  const color = `rgba(229, 184, 105, ${alpha.toFixed(2)})`;
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    plotPixel(ctx, cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, color);
  }
}

export function createPlankton(w: number, h: number, count = 34): PlanktonDot[] {
  return Array.from({ length: count }, (_, i) => ({
    x: ((i * 197.3) % 1000) / 1000 * w,
    y: ((i * 353.7) % 1000) / 1000 * h * 0.85,
    phase: i * 1.3,
    speed: 0.14 + (i % 5) * 0.05,
    warm: i % 3 !== 0,
  }));
}

export function drawReefAndAmbience(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  t: number,
  plankton: PlanktonDot[],
  bubbles: PixelBubble[],
  reducedMotion: boolean,
) {
  // Drifting bioluminescent pixel plankton
  for (const dot of plankton) {
    if (!reducedMotion) {
      dot.y -= dot.speed;
      if (dot.y < 10) dot.y = h * 0.86;
    }
    const px = dot.x + Math.sin(t * 0.8 + dot.phase) * 14;
    const twinkle = 0.2 + 0.35 * (0.5 + 0.5 * Math.sin(t * 2.1 + dot.phase));
    const color = dot.warm
      ? `rgba(229, 184, 105, ${twinkle.toFixed(2)})`
      : `rgba(124, 212, 216, ${twinkle.toFixed(2)})`;
    plotPixel(ctx, px, dot.y, color);
  }

  // Rising pixel bubbles
  for (let i = bubbles.length - 1; i >= 0; i--) {
    const b = bubbles[i];
    if (!reducedMotion) {
      b.y -= b.vy;
      b.x += Math.sin(t * 3 + b.wobble) * 0.45;
      b.alpha -= 0.0025;
    }
    if (b.y < -10 || b.alpha <= 0.05) {
      bubbles.splice(i, 1);
      continue;
    }
    plotPixel(ctx, b.x, b.y, `rgba(250, 250, 248, ${b.alpha.toFixed(2)})`);
  }

  // Stepped dark obsidian reef ridge at bottom edge
  const ridgeBase = h - CELL * 4;
  for (let x = 0; x < w; x += CELL) {
    const mound =
      Math.sin(x * 0.0065) * 18 + Math.cos(x * 0.017) * 9 + Math.sin(x * 0.032) * 5;
    const topY = snap(ridgeBase - Math.max(0, mound));
    ctx.fillStyle = "#0b0c10";
    ctx.fillRect(x, topY, CELL, h - topY);
    plotPixel(ctx, x, topY, "#171a22");
  }

  // Pixel-art corals & gently swaying kelp anchored to the reef ridge
  for (let idx = 0; idx < CORALS.length; idx++) {
    const coral = CORALS[idx];
    const baseX = snap(coral.xRatio * w);
    const mound =
      Math.sin(baseX * 0.0065) * 18 + Math.cos(baseX * 0.017) * 9 + Math.sin(baseX * 0.032) * 5;
    const baseY = snap(ridgeBase - Math.max(0, mound));
    const sway = reducedMotion ? 0 : Math.sin(t * 1.15 + idx * 1.1) * 7;

    if (coral.kind === "kelp") {
      const steps = Math.floor(coral.height / CELL);
      for (let s = 0; s < steps; s++) {
        const frac = s / steps;
        const kx = baseX + Math.sin(frac * 4 + t * 1.4 + idx) * (6 + frac * 10);
        const ky = baseY - s * CELL;
        plotPixel(ctx, kx, ky, coral.tone);
        if (s > 3 && s % 4 === 0) {
          const leafDir = s % 8 === 0 ? 1 : -1;
          plotPixel(ctx, kx + leafDir * CELL, ky, coral.tone);
          if (frac > 0.65) plotPixel(ctx, kx + leafDir * CELL * 2, ky - CELL, coral.tip);
        }
      }
      plotPixel(ctx, baseX + sway, baseY - coral.height, coral.tip);
    } else if (coral.kind === "staghorn") {
      const trunkTopY = baseY - coral.height * 0.45;
      plotPixelLine(ctx, baseX, baseY, baseX + sway * 0.3, trunkTopY, coral.tone);
      for (let b = 0; b < coral.branches; b++) {
        const dir = (b / (coral.branches - 1)) * 2 - 1;
        const bx = baseX + dir * (24 + (b % 2) * 14) + sway * 0.5;
        const by = baseY - coral.height * (0.65 + (b % 2) * 0.3);
        plotPixelLine(ctx, baseX + sway * 0.3, trunkTopY, bx, by, coral.tone);
        plotPixel(ctx, bx, by - CELL, coral.tip);
      }
    } else {
      for (let b = -2; b <= 2; b++) {
        const fx = baseX + b * 12 + sway * 0.4;
        const fy = baseY - coral.height * (1 - Math.abs(b) * 0.14);
        plotPixelLine(ctx, baseX, baseY, fx, fy, coral.tone);
        if (Math.abs(b) <= 1) plotPixel(ctx, fx, fy, coral.tip);
      }
    }
  }
}
