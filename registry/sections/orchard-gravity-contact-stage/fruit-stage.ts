import Matter from "matter-js";

export interface FruitStageOptions {
  gravity?: number;
  clickBlastRadius?: number;
}

interface Pt {
  x: number;
  y: number;
}

const WALL = 240;

const samplePath = (path: SVGGeometryElement, step: number): Pt[] => {
  const total = path.getTotalLength();
  if (!total) return [];
  const pts: Pt[] = [];
  for (let l = 0; l < total; l += step) {
    const p = path.getPointAtLength(l);
    pts.push({ x: p.x, y: p.y });
  }
  return pts;
};

export function createFruitStage(
  stage: HTMLElement,
  opts: FruitStageOptions = {},
): { destroy(): void } | null {
  const els = Array.from(stage.querySelectorAll<HTMLElement>("[data-fruit]"));
  if (!els.length) return null;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    els.forEach((el, i) => {
      const angle = (i / els.length) * Math.PI * 2;
      const radius = Math.min(stage.clientWidth, stage.clientHeight) * 0.42;
      const x = stage.clientWidth / 2 + Math.cos(angle) * radius;
      const y = stage.clientHeight / 2 + Math.sin(angle) * radius;
      el.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    });
    stage.dataset.fruitLoaderReady = "true";
    return { destroy: () => {} };
  }

  const { Engine, Runner, Composite, Bodies, Events, Vertices, Sleeping, Body } = Matter;
  const engine = Engine.create();
  engine.enableSleeping = true;
  engine.gravity.y = opts.gravity ?? 3.35;

  let width = stage.clientWidth;
  let height = stage.clientHeight;
  const wallOpts = { isStatic: true, restitution: 0.2, friction: 0.6 };
  const floor = Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, wallOpts);
  const left = Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 3, wallOpts);
  const right = Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 3, wallOpts);
  const bodyOpts = { restitution: 0.03, friction: 0.82, frictionAir: 0.03, sleepThreshold: 18 };

  const hullOf = (el: HTMLElement, w: number, h: number): Pt[] => {
    const vb = el.querySelector("svg")?.viewBox.baseVal;
    const sx = vb?.width ? w / vb.width : 1;
    const sy = vb?.height ? h / vb.height : 1;
    const pts: Pt[] = [];
    el.querySelectorAll<SVGGeometryElement>("path").forEach((p) => {
      samplePath(p, 16).forEach((q) => pts.push({ x: q.x * sx, y: q.y * sy }));
    });
    return pts.length >= 3
      ? (Vertices.hull(pts as unknown as Matter.Vertex[]) as unknown as Pt[])
      : [];
  };

  const items = els.map((el, i) => {
    const rect = el.getBoundingClientRect();
    const w = rect.width || 120;
    const h = rect.height || 120;
    const x = Math.max(WALL / 4, w * 0.15 + Math.random() * Math.max(1, width - w * 1.3));
    const y = -(h + 140) - i * 90 - Math.random() * 110;
    const angle = (Math.random() - 0.5) * 0.24;
    const verts = hullOf(el, w, h);
    const centre = verts.length
      ? Vertices.centre(verts as unknown as Matter.Vector[])
      : { x: w / 2, y: h / 2 };
    const body =
      verts.length >= 3
        ? Bodies.fromVertices(x, y, [verts.map((v) => ({ x: v.x, y: v.y }))], { ...bodyOpts, angle }, true)
        : Bodies.rectangle(x, y, w * 0.9, h * 0.9, { ...bodyOpts, angle });
    el.style.transformOrigin = `${centre.x}px ${centre.y}px`;
    return { el, body, offsetX: centre.x, offsetY: centre.y };
  });

  Composite.add(engine.world, [floor, left, right, ...items.map((it) => it.body)]);

  let removeBlast: (() => void) | null = null;
  if (opts.clickBlastRadius) {
    const radius = opts.clickBlastRadius;
    const speed = 24;
    const lift = 0.6;
    const onBlast = (ev: PointerEvent) => {
      const box = stage.getBoundingClientRect();
      const px = ev.clientX - box.left;
      const py = ev.clientY - box.top;
      for (const it of items) {
        const dx = it.body.position.x - px;
        const dy = it.body.position.y - py;
        const dist = Math.hypot(dx, dy);
        if (dist > radius) continue;
        Sleeping.set(it.body, false);
        const falloff = 1 - dist / radius;
        const nx = dist ? dx / dist : (Math.random() - 0.5) * 2;
        const ny = dist ? dy / dist : -1;
        const force = speed * (0.35 + 0.65 * falloff);
        Body.setVelocity(it.body, {
          x: it.body.velocity.x + nx * force,
          y: it.body.velocity.y + ny * force - speed * lift * falloff,
        });
        Body.setAngularVelocity(it.body, it.body.angularVelocity + nx * falloff * 0.18);
      }
    };
    stage.addEventListener("pointerdown", onBlast);
    removeBlast = () => stage.removeEventListener("pointerdown", onBlast);
  }

  const sync = () => {
    for (const it of items) {
      const { x, y } = it.body.position;
      it.el.style.transform = `translate(${x - it.offsetX}px, ${y - it.offsetY}px) rotate(${it.body.angle}rad)`;
    }
  };

  const runner = Runner.create();
  let running = false;
  const run = () => {
    if (running) return;
    running = true;
    Runner.run(runner, engine);
  };
  const halt = () => {
    if (!running) return;
    running = false;
    Runner.stop(runner);
  };
  const onUpdate = () => {
    sync();
    for (const it of items) {
      if (it.body.isSleeping && it.body.position.y - it.offsetY < 0) Sleeping.set(it.body, false);
    }
    if (items.every((it) => it.body.isSleeping)) halt();
  };
  Events.on(engine, "afterUpdate", onUpdate);

  sync();
  stage.dataset.fruitLoaderReady = "true";
  let raf = window.requestAnimationFrame(run);

  const onResize = () => {
    width = stage.clientWidth;
    height = stage.clientHeight;
    Body.setPosition(floor, { x: width / 2, y: height + WALL / 2 });
    Body.setPosition(left, { x: -WALL / 2, y: height / 2 });
    Body.setPosition(right, { x: width + WALL / 2, y: height / 2 });
    for (const it of items) Sleeping.set(it.body, false);
    run();
  };
  window.addEventListener("resize", onResize);
  stage.addEventListener("pointerdown", run);

  return {
    destroy() {
      removeBlast?.();
      Events.off(engine, "afterUpdate", onUpdate);
      window.removeEventListener("resize", onResize);
      stage.removeEventListener("pointerdown", run);
      window.cancelAnimationFrame(raf);
      raf = 0;
      halt();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      stage.dataset.fruitLoaderReady = "false";
    },
  };
}
