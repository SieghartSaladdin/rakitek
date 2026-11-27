import Matter from "matter-js";

export interface FruitPhysicsOptions {
  gravity?: number;
  seed?: number;
  settledRatio?: number;
  interactive?: boolean;
  clickBlastRadius?: number;
  onSettled?: () => void;
  spawnX?: (i: SpawnInfo) => number | undefined;
  spawnY?: (i: SpawnInfo) => number | undefined;
  spawnAngle?: (i: SpawnInfo) => number | undefined;
}

export interface SpawnInfo {
  index: number;
  width: number;
  height: number;
  stageWidth: number;
  stageHeight: number;
}

interface Pt {
  x: number;
  y: number;
}

const WALL = 240;

const seeded = (seed: number) => {
  let a = seed >>> 0;
  return () => {
    a += 1831565813;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const samplePath = (path: SVGGeometryElement, step: number): Pt[] => {
  const total = path.getTotalLength();
  const pts: Pt[] = [];
  for (let l = 0; total && l < total; l += step) {
    const p = path.getPointAtLength(l);
    pts.push({ x: p.x, y: p.y });
  }
  return pts;
};

/**
 * Drops every `[data-fruit]` child of the stage with matter-js bodies shaped from their SVG paths.
 * Returns null when there is nothing to animate (the caller shows its static layout instead).
 */
export function createFruitPhysics(stage: HTMLElement, options: FruitPhysicsOptions = {}): { destroy(): void } | null {
  const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-fruit]"));
  if (!els.length) return null;
  const { Engine, Runner, Composite, Bodies, Mouse, MouseConstraint, Events, Vertices, Sleeping, Body } = Matter;
  const rand = options.seed === undefined ? Math.random : seeded(options.seed);
  const engine = Engine.create();
  engine.enableSleeping = true;
  engine.gravity.y = options.gravity ?? 1;
  let width = stage.clientWidth;
  let height = stage.clientHeight;
  const wallOpts = { isStatic: true, restitution: 0.2, friction: 0.6 };
  const floor = Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, wallOpts);
  const left = Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 3, wallOpts);
  const right = Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 3, wallOpts);
  const bodyOpts = { restitution: 0.03, friction: 0.82, frictionAir: 0.03, sleepThreshold: 18 };

  const shapeOf = (el: HTMLElement, w: number, h: number): Pt[] => {
    const vb = el.querySelector("svg")?.viewBox.baseVal;
    const sx = vb?.width ? w / vb.width : 1;
    const sy = vb?.height ? h / vb.height : 1;
    const pts: Pt[] = [];
    el.querySelectorAll<SVGGeometryElement>("path").forEach((p) => {
      samplePath(p, 16).forEach((q) => pts.push({ x: q.x * sx, y: q.y * sy }));
    });
    return pts.length >= 3 ? (Vertices.hull(pts as unknown as Matter.Vertex[]) as unknown as Pt[]) : [];
  };

  const items = els.map((el, index) => {
    const rect = el.getBoundingClientRect();
    const w = rect.width || 120;
    const h = rect.height || 120;
    const info = { index, width: w, height: h, stageWidth: width, stageHeight: height };
    const x = options.spawnX?.(info) ?? Math.max(WALL / 4, w * 0.15 + rand() * Math.max(1, width - w * 1.3));
    const y = options.spawnY ? (options.spawnY(info) ?? 0) : -(h + 140) - index * 90 - rand() * 110;
    const angle = options.spawnAngle?.(info) ?? (rand() - 0.5) * 0.24;
    const shape = shapeOf(el, w, h);
    const centre = shape.length ? Vertices.centre(shape as unknown as Matter.Vertex[]) : { x: w / 2, y: h / 2 };
    const body = shape.length >= 3
      ? Bodies.fromVertices(x, y, [shape.map((p) => ({ x: p.x, y: p.y }))], { ...bodyOpts, angle }, true)
      : Bodies.rectangle(x, y, w * 0.9, h * 0.9, { ...bodyOpts, angle });
    el.style.transformOrigin = `${centre.x}px ${centre.y}px`;
    return { el, body, ox: centre.x, oy: centre.y };
  });
  Composite.add(engine.world, [floor, left, right, ...items.map((i) => i.body)]);

  let removeBlast: (() => void) | null = null;
  if (options.clickBlastRadius) {
    const radius = options.clickBlastRadius;
    const onDown = (e: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      for (const item of items) {
        const dx = item.body.position.x - (e.clientX - rect.left);
        const dy = item.body.position.y - (e.clientY - rect.top);
        const dist = Math.hypot(dx, dy);
        if (dist > radius) continue;
        Sleeping.set(item.body, false);
        const falloff = 1 - dist / radius;
        const force = 24 * (0.35 + 0.65 * falloff);
        const nx = dist ? dx / dist : (rand() - 0.5) * 2;
        const ny = dist ? dy / dist : -1;
        Body.setVelocity(item.body, {
          x: item.body.velocity.x + nx * force,
          y: item.body.velocity.y + ny * force - 24 * 0.6 * falloff,
        });
        Body.setAngularVelocity(item.body, item.body.angularVelocity + nx * falloff * 0.18);
      }
    };
    stage.addEventListener("pointerdown", onDown);
    removeBlast = () => stage.removeEventListener("pointerdown", onDown);
  }
  if (options.interactive !== false) {
    const constraint = MouseConstraint.create(engine, {
      mouse: Mouse.create(stage),
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(engine.world, constraint);
  }

  const render = () => {
    for (const i of items) {
      i.el.style.transform = `translate(${i.body.position.x - i.ox}px, ${i.body.position.y - i.oy}px) rotate(${i.body.angle}rad)`;
    }
  };
  let settled = false;
  let calm = 0;
  const needed = Math.max(1, Math.ceil(items.length * Math.min(1, Math.max(0, options.settledRatio ?? 1))));
  const runner = Runner.create();
  let running = false;
  const run = () => {
    if (!running) {
      running = true;
      Runner.run(runner, engine);
    }
  };
  const halt = () => {
    if (running) {
      running = false;
      Runner.stop(runner);
    }
  };
  const afterUpdate = () => {
    render();
    for (const i of items) if (i.body.isSleeping && i.body.position.y - i.oy < 0) Sleeping.set(i.body, false);
    const allAsleep = items.every((i) => i.body.isSleeping);
    if (!settled && options.onSettled) {
      const quiet = items.filter((i) => i.body.isSleeping || (i.body.speed < 0.18 && Math.abs(i.body.angularSpeed) < 0.015));
      calm = quiet.length >= needed ? calm + 1 : 0;
      if (calm >= 10 || allAsleep) {
        settled = true;
        options.onSettled();
      }
    }
    if (allAsleep && (settled || !options.onSettled)) halt();
  };
  Events.on(engine, "afterUpdate", afterUpdate);
  render();
  stage.dataset.fruitLoaderReady = "true";
  const startRaf = window.requestAnimationFrame(run);
  const onResize = () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
    Body.setPosition(floor, { x: width / 2, y: height + WALL / 2 });
    Body.setPosition(left, { x: -WALL / 2, y: height / 2 });
    Body.setPosition(right, { x: width + WALL / 2, y: height / 2 });
    for (const i of items) Sleeping.set(i.body, false);
    run();
  };
  window.addEventListener("resize", onResize);
  stage.addEventListener("pointerdown", run);
  return {
    destroy() {
      removeBlast?.();
      Events.off(engine, "afterUpdate", afterUpdate);
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("pointerdown", run);
      window.cancelAnimationFrame(startRaf);
      halt();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      stage.dataset.fruitLoaderReady = "false";
    },
  };
}
