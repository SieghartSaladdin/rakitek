import type { Body } from "matter-js";
import {
  BALL_OPTIONS,
  layoutPitWorld,
  nudgeNearbyBalls,
  randomBallRadius,
  renderStatsPit,
  seedColumnPiles,
  type BallState,
  type MatterModule,
  type PitMetrics,
} from "./stats-renderer";
import { PHYSICS_CONFIG, buildColumnTextures, easeOutBack, type StatColumn } from "./stats-textures";

export interface StatsPhysicsOptions {
  canvas: HTMLCanvasElement;
  gooCanvas: HTMLCanvasElement;
  columns: StatColumn[];
  visibleRef: { current: boolean };
  focusedRef: { current: boolean };
  countRefs: { current: (HTMLSpanElement | null)[] };
  reducedMotion: boolean;
}

export function startStatsPhysics(Matter: MatterModule, opts: StatsPhysicsOptions): () => void {
  const { canvas, gooCanvas, columns, visibleRef, focusedRef, countRefs, reducedMotion } = opts;
  const ctx = canvas.getContext("2d");
  const gooCtx = gooCanvas.getContext("2d");
  if (!ctx || !gooCtx) return () => {};

  const colCount = Math.max(1, columns.length);
  const { Engine, Composite, Bodies, Body: MatterBody, Events } = Matter;
  const engine = Engine.create({ enableSleeping: true });
  engine.gravity.y = 1.4;
  engine.positionIterations = 12;
  engine.velocityIterations = 8;

  const textures = buildColumnTextures(colCount);
  const balls: Body[] = [];
  const ballState = new WeakMap<Body, BallState>();
  const dyingScratch: Body[] = [];
  const targetCounts = new Array<number>(colCount).fill(0);
  const shownCounts = new Array<number>(colCount).fill(0);
  let metrics: PitMetrics = { width: 0, height: 0, dpr: 1, surfaceY: 0, baseRadius: 24, floor: null, walls: [] };

  const columnOf = (x: number) => Math.min(colCount - 1, Math.max(0, Math.floor(x / (metrics.width / colCount))));
  const removeBall = (ball: Body) => {
    Composite.remove(engine.world, ball);
    const index = balls.indexOf(ball);
    if (index >= 0) balls.splice(index, 1);
    ballState.delete(ball);
  };

  function rebuildWorld() {
    const next = layoutPitWorld(Matter, engine, canvas, gooCanvas, colCount, metrics.walls);
    if (!next) return;
    metrics = next;
    for (const ball of balls) Composite.remove(engine.world, ball);
    balls.length = 0;
    seedColumnPiles({ Matter, engine, columns, metrics, balls, ballState, targetCounts, shownCounts, countRefs, reducedMotion });
  }

  function onBallContact(ball: Body, other: Body) {
    const state = ballState.get(ball);
    if (!state || state.landed || state.dying || !(other === metrics.floor || ballState.get(other)?.landed)) return;
    if (ball.position.y < metrics.surfaceY) {
      state.dying = true;
      state.dieT = 0;
      ball.isSensor = true;
      const side = Math.random() < 0.5 ? -1 : 1;
      MatterBody.setVelocity(ball, { x: side * (5 + Math.random() * 8), y: -(2 + Math.random() * 7) });
      MatterBody.setAngularVelocity(ball, (Math.random() - 0.5) * 0.8);
      return;
    }
    const col = columnOf(ball.position.x);
    state.landed = true;
    state.idx = col;
    targetCounts[col] = Math.min(PHYSICS_CONFIG.maxScore, targetCounts[col] + PHYSICS_CONFIG.scorePerBall);
  }

  Events.on(engine, "collisionStart", (event) => {
    for (const pair of event.pairs) {
      if (ballState.has(pair.bodyA)) onBallContact(pair.bodyA, pair.bodyB);
      if (ballState.has(pair.bodyB)) onBallContact(pair.bodyB, pair.bodyA);
    }
  });

  const paint = (focusedFor: number) =>
    renderStatsPit({ ctx, gooCtx, canvas, metrics, colCount, focusedFor, reducedMotion, balls, ballState, textures });

  rebuildWorld();

  let resizeTimer = 0;
  const onResize = () => {
    clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(() => {
      if (canvas.clientWidth === metrics.width && canvas.clientHeight === metrics.height) return;
      rebuildWorld();
      if (reducedMotion) paint(2);
    }, 160);
  };

  if (reducedMotion) {
    paint(2);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(resizeTimer);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }

  const pointer = { x: 0, y: 0, inside: false, holding: false };
  const pointerVel = { x: 0 };
  let lastPointerX = 0;
  let nextSpawnAt = 0;

  function spawnBall(x: number, yIn: number) {
    const y = Math.min(yIn, metrics.surfaceY - metrics.baseRadius * PHYSICS_CONFIG.radiusMaxFactor * 2);
    const ball = Bodies.circle(x, y, randomBallRadius(metrics.baseRadius), BALL_OPTIONS);
    MatterBody.setVelocity(ball, { x: Math.max(-9, Math.min(9, pointerVel.x * 0.8)), y: 1 + Math.random() });
    ballState.set(ball, { landed: false, scale: 1, dying: false, dieT: 0, idx: -1, popT: PHYSICS_CONFIG.popDuration, popDelay: 0 });
    balls.push(ball);
    Composite.add(engine.world, ball);
    if (balls.length > 260) removeBall(balls[0]);
  }

  const localPoint = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onPointerMove = (e: PointerEvent) => {
    const p = localPoint(e);
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.inside = true;
    if (pointer.holding && p.y > metrics.surfaceY) nudgeNearbyBalls(Matter, balls, p.x, p.y, metrics.baseRadius);
  };
  const onPointerLeave = () => { pointer.inside = false; pointer.holding = false; };
  const onPointerDown = (e: PointerEvent) => {
    const p = localPoint(e);
    pointer.x = p.x;
    pointer.y = p.y;
    pointer.inside = true;
    pointer.holding = true;
    if (p.y > metrics.surfaceY) nudgeNearbyBalls(Matter, balls, p.x, p.y, metrics.baseRadius);
    else spawnBall(p.x, p.y);
    nextSpawnAt = performance.now() + PHYSICS_CONFIG.holdSpawnIntervalMs;
  };
  const onPointerUp = () => { pointer.holding = false; };

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerenter", onPointerMove);
  canvas.addEventListener("pointerleave", onPointerLeave);
  canvas.addEventListener("pointerdown", onPointerDown);
  window.addEventListener("pointerup", onPointerUp);
  window.addEventListener("resize", onResize);

  let raf = 0;
  let lastFrame = performance.now();
  let accumulator = 0;
  let focusedFor = 0;
  const stepMs = 1000 / 60;

  const frame = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - lastFrame) / 1000);
    lastFrame = now;
    if (!visibleRef.current) { accumulator = 0; raf = requestAnimationFrame(frame); return; }

    pointerVel.x = pointerVel.x * 0.6 + (pointer.x - lastPointerX) * 0.4;
    lastPointerX = pointer.x;
    if ((pointer.holding || pointer.inside) && now >= nextSpawnAt) {
      spawnBall(pointer.x, pointer.y);
      nextSpawnAt = now + (pointer.holding ? PHYSICS_CONFIG.holdSpawnIntervalMs : 500 + Math.random() * 300);
    }

    accumulator += dt * 1000;
    for (let steps = 0; accumulator >= stepMs && steps < 5; steps++) {
      Engine.update(engine, stepMs);
      accumulator -= stepMs;
    }
    if (accumulator > stepMs) accumulator = 0;
    focusedFor = focusedRef.current ? focusedFor + dt : 0;

    for (const ball of balls) {
      const state = ballState.get(ball);
      if (state?.dying) {
        state.dieT += dt;
        state.scale = Math.max(0, 1 - state.dieT / PHYSICS_CONFIG.dieDuration);
        if (state.scale <= 0) dyingScratch.push(ball);
      } else if (focusedRef.current && state && state.popT < PHYSICS_CONFIG.popDuration) {
        if (state.popDelay > 0) state.popDelay -= dt;
        else {
          state.popT = Math.min(PHYSICS_CONFIG.popDuration, state.popT + dt);
          state.scale = easeOutBack(state.popT / PHYSICS_CONFIG.popDuration);
        }
      }
    }
    while (dyingScratch.length) removeBall(dyingScratch.pop()!);

    if (focusedRef.current && focusedFor >= 0.75) {
      for (let col = 0; col < colCount; col++) {
        if (shownCounts[col] === targetCounts[col]) continue;
        shownCounts[col] += (targetCounts[col] - shownCounts[col]) * Math.min(1, dt * 9);
        if (Math.abs(targetCounts[col] - shownCounts[col]) < 0.5) shownCounts[col] = targetCounts[col];
        const el = countRefs.current[col];
        if (el) el.textContent = String(Math.round(shownCounts[col]));
      }
    }

    const settled =
      focusedFor > 1.6 &&
      !pointer.inside &&
      !pointer.holding &&
      balls.every((b) => { const s = ballState.get(b); return Boolean(s && !s.dying && s.popT >= PHYSICS_CONFIG.popDuration && b.isSleeping); }) &&
      shownCounts.every((v, col) => v === targetCounts[col]);

    if (!settled) paint(focusedFor);
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    canvas.removeEventListener("pointermove", onPointerMove);
    canvas.removeEventListener("pointerenter", onPointerMove);
    canvas.removeEventListener("pointerleave", onPointerLeave);
    canvas.removeEventListener("pointerdown", onPointerDown);
    window.removeEventListener("pointerup", onPointerUp);
    window.removeEventListener("resize", onResize);
    clearTimeout(resizeTimer);
    Composite.clear(engine.world, false);
    Engine.clear(engine);
  };
}
