import type { Body, Engine } from "matter-js";
import {
  PHYSICS_CONFIG,
  drawCover,
  getColumnFallbackColor,
  type StatColumn,
} from "./stats-textures";

export type MatterModule = typeof import("matter-js");

export interface BallState {
  landed: boolean;
  scale: number;
  dying: boolean;
  dieT: number;
  idx: number;
  popT: number;
  popDelay: number;
}

export const BALL_OPTIONS = {
  restitution: 0.3,
  friction: 0.04,
  frictionStatic: 0.2,
  frictionAir: 0.012,
  density: 0.0016,
};

export interface PitMetrics {
  width: number;
  height: number;
  dpr: number;
  surfaceY: number;
  baseRadius: number;
  floor: Body | null;
  walls: Body[];
}

export function layoutPitWorld(
  Matter: MatterModule,
  engine: Engine,
  canvas: HTMLCanvasElement,
  gooCanvas: HTMLCanvasElement,
  colCount: number,
  prevWalls: Body[],
): PitMetrics | null {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (!width || !height) return null;

  const { Bodies, Composite } = Matter;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(width * dpr);
  canvas.height = Math.floor(height * dpr);
  gooCanvas.width = canvas.width;
  gooCanvas.height = canvas.height;

  const surfaceY = height * PHYSICS_CONFIG.surfaceYFraction;
  const baseRadius = Math.max(
    15,
    Math.min(
      48,
      Math.sqrt((0.68 * (width / colCount) * (height - surfaceY)) / (PHYSICS_CONFIG.ballsPerColumn * Math.PI)),
    ),
  );

  if (prevWalls.length) Composite.remove(engine.world, prevWalls);
  const floor = Bodies.rectangle(width / 2, height + 40, width + 200, 80, { isStatic: true });
  const walls: Body[] = [
    floor,
    Bodies.rectangle(-40, height / 2, 80, height * 3, { isStatic: true }),
    Bodies.rectangle(width + 40, height / 2, 80, height * 3, { isStatic: true }),
    ...Array.from({ length: colCount - 1 }, (_, i) =>
      Bodies.rectangle(width * ((i + 1) / colCount), height / 2, PHYSICS_CONFIG.dividerWidth, height * 2, {
        isStatic: true,
      }),
    ),
  ];
  Composite.add(engine.world, walls);

  return { width, height, dpr, surfaceY, baseRadius, floor, walls };
}

export function randomBallRadius(baseRadius: number): number {
  return (
    baseRadius *
    (PHYSICS_CONFIG.radiusMinFactor +
      Math.random() * (PHYSICS_CONFIG.radiusMaxFactor - PHYSICS_CONFIG.radiusMinFactor))
  );
}

export function seedColumnPiles(args: {
  Matter: MatterModule;
  engine: Engine;
  columns: StatColumn[];
  metrics: PitMetrics;
  balls: Body[];
  ballState: WeakMap<Body, BallState>;
  targetCounts: number[];
  shownCounts: number[];
  countRefs: { current: (HTMLSpanElement | null)[] };
  reducedMotion: boolean;
}): void {
  const { Matter, engine, columns, metrics, balls, ballState, targetCounts, shownCounts, countRefs, reducedMotion } =
    args;
  const { Bodies, Composite } = Matter;
  const colCount = Math.max(1, columns.length);
  const colW = metrics.width / colCount;

  for (let col = 0; col < colCount; col++) {
    const raw = Math.round(columns[col].target / 11);
    const count = Math.max(PHYSICS_CONFIG.seedMinBalls, Math.min(PHYSICS_CONFIG.seedMaxBalls, raw));
    const left = col * colW + 8;
    const right = (col + 1) * colW - 8;
    let cx = left;
    let cy = metrics.height - 8;
    let rowMax = 0;

    for (let s = 0; s < count; s++) {
      const radius = randomBallRadius(metrics.baseRadius);
      if (cx + radius * 2 > right && cx > left) {
        cx = left;
        cy -= rowMax * 2 * 0.95;
        rowMax = 0;
      }
      const ball = Bodies.circle(cx + radius, cy - radius, radius, BALL_OPTIONS);
      ballState.set(ball, {
        landed: true,
        scale: reducedMotion ? 1 : 0,
        dying: false,
        dieT: 0,
        idx: col,
        popT: reducedMotion ? PHYSICS_CONFIG.popDuration : 0,
        popDelay: reducedMotion ? 0 : 0.85 + s * 0.07 + Math.random() * 0.12,
      });
      balls.push(ball);
      Composite.add(engine.world, ball);
      cx += radius * 2 + 1;
      rowMax = Math.max(rowMax, radius);
    }

    targetCounts[col] = count * PHYSICS_CONFIG.scorePerBall;
    if (reducedMotion) {
      shownCounts[col] = targetCounts[col];
      const el = countRefs.current[col];
      if (el) el.textContent = String(shownCounts[col]);
    }
  }
}

export function nudgeNearbyBalls(
  Matter: MatterModule,
  balls: Body[],
  px: number,
  py: number,
  baseRadius: number,
): void {
  const reach = baseRadius * 3.2;
  for (const ball of balls) {
    const dx = ball.position.x - px;
    const dy = ball.position.y - py;
    const dist = Math.hypot(dx, dy);
    if (dist > 0.1 && dist < reach) {
      Matter.Sleeping.set(ball, false);
      const push = (1 - dist / reach) * 0.018;
      Matter.Body.applyForce(ball, ball.position, { x: (dx / dist) * push, y: (dy / dist) * push - 0.004 });
    }
  }
}

export interface RenderPitArgs {
  ctx: CanvasRenderingContext2D;
  gooCtx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  metrics: PitMetrics;
  colCount: number;
  focusedFor: number;
  reducedMotion: boolean;
  balls: Body[];
  ballState: WeakMap<Body, BallState>;
  textures: HTMLCanvasElement[];
}

export function renderStatsPit(args: RenderPitArgs): void {
  const { ctx, gooCtx, canvas, metrics, colCount, focusedFor, reducedMotion, balls, ballState, textures } = args;
  const { width, height, dpr, surfaceY, baseRadius } = metrics;
  if (!width || !height) return;

  const ink = getComputedStyle(canvas).color || "currentColor";
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);
  ctx.strokeStyle = ink;
  ctx.globalAlpha = 0.12;
  ctx.lineWidth = 1;
  for (let i = 0; i < colCount - 1; i++) {
    const p = reducedMotion ? 1 : Math.min(1, Math.max(0, (focusedFor - 0.6 - i * 0.14) / 0.6));
    if (p <= 0) continue;
    const eased = 1 - (1 - p) ** 3;
    const x = width * ((i + 1) / colCount);
    ctx.beginPath();
    ctx.moveTo(x, surfaceY);
    ctx.lineTo(x, surfaceY + (height - surfaceY) * eased);
    ctx.stroke();
  }

  ctx.fillStyle = ink;
  for (const ball of balls) {
    const state = ballState.get(ball);
    if (!state || state.landed) continue;
    const r = (ball.circleRadius ?? baseRadius) * state.scale;
    if (r < 0.5) continue;
    ctx.globalAlpha = state.dying ? 0.16 * state.scale : 0.16;
    ctx.beginPath();
    ctx.arc(ball.position.x, ball.position.y, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  gooCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
  gooCtx.clearRect(0, 0, width, height);
  const colW = width / colCount;
  const lift = baseRadius * PHYSICS_CONFIG.radiusMaxFactor * 3;
  for (let col = 0; col < colCount; col++) {
    const colX = colW * col;
    gooCtx.save();
    gooCtx.beginPath();
    let any = false;
    for (const ball of balls) {
      const state = ballState.get(ball);
      if (!state || !state.landed || state.idx !== col) continue;
      const r = (ball.circleRadius ?? baseRadius) * 1.09 * state.scale;
      if (r < 0.5) continue;
      gooCtx.moveTo(ball.position.x + r, ball.position.y);
      gooCtx.arc(ball.position.x, ball.position.y, r, 0, Math.PI * 2);
      any = true;
    }
    if (any) {
      gooCtx.clip();
      const tex = textures[col];
      if (tex) drawCover(gooCtx, tex, colX, surfaceY - lift, colW, height - surfaceY + lift);
      else {
        gooCtx.fillStyle = getColumnFallbackColor(col);
        gooCtx.fillRect(colX, surfaceY - lift, colW, height - surfaceY + lift);
      }
    }
    gooCtx.restore();
  }
}
