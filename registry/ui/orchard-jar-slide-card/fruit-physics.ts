import Matter from "matter-js";

export interface FruitPhysicsOptions {
  gravity?: number;
  seed?: number;
}

export interface FruitPhysicsHandle {
  destroy: () => void;
}

const WALL = 240;

const seeded = (seed: number) => {
  let e = seed >>> 0;
  return () => {
    e += 1831565813;
    let n = Math.imul(e ^ (e >>> 15), 1 | e);
    n ^= n + Math.imul(n ^ (n >>> 7), 61 | n);
    return ((n ^ (n >>> 14)) >>> 0) / 4294967296;
  };
};

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function scopeSvgIds(markup: string, suffix: string | number): string {
  const sfx = String(suffix);
  if (!markup || !sfx) return markup;
  const ids = new Set<string>();
  for (const m of markup.matchAll(/\sid="([^"]+)"/g)) ids.add(m[1]);
  if (!ids.size) return markup;
  let out = markup;
  for (const id of ids) {
    const re = escapeRegExp(id);
    const next = `${id}-${sfx}`;
    out = out
      .replace(new RegExp(`(\\sid=")${re}(")`, "g"), `$1${next}$2`)
      .replace(new RegExp(`(url\\(#)${re}(\\))`, "g"), `$1${next}$2`)
      .replace(new RegExp(`((?:xlink:)?href="#)${re}(")`, "g"), `$1${next}$2`);
  }
  return out;
}

interface Pt {
  x: number;
  y: number;
}

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

export function createFruitPhysics(
  stage: HTMLElement,
  opts: FruitPhysicsOptions = {},
): FruitPhysicsHandle | null {
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
  const rand = opts.seed === undefined ? Math.random : seeded(opts.seed);
  const engine = Engine.create();
  engine.enableSleeping = true;
  engine.gravity.y = opts.gravity ?? 3.5;

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
    el.querySelectorAll<SVGGeometryElement>("path").forEach((path) => {
      samplePath(path, 16).forEach((p) => pts.push({ x: p.x * sx, y: p.y * sy }));
    });
    return pts.length >= 3
      ? (Vertices.hull(pts as unknown as Matter.Vertex[]) as unknown as Pt[])
      : [];
  };

  let shared: Pt[] | null = null;
  const items = els.map((el, i) => {
    const rect = el.getBoundingClientRect();
    const w = rect.width || 120;
    const h = rect.height || 120;
    const x = Math.max(WALL / 4, w * 0.15 + rand() * Math.max(1, width - w * 1.3));
    const y = -(h + 140) - i * 90 - rand() * 110;
    const angle = (rand() - 0.5) * 0.24;
    shared = shared ?? hullOf(el, w, h);
    const verts = shared;
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

  Composite.add(engine.world, [floor, left, right, ...items.map((i) => i.body)]);

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
      if (it.body.isSleeping && it.body.position.y - it.offsetY < 0) {
        Sleeping.set(it.body, false);
      }
    }
    if (items.every((it) => it.body.isSleeping)) halt();
  };
  Events.on(engine, "afterUpdate", onUpdate);

  sync();
  stage.dataset.fruitLoaderReady = "true";
  const raf = window.requestAnimationFrame(run);

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

  return {
    destroy() {
      Events.off(engine, "afterUpdate", onUpdate);
      window.removeEventListener("resize", onResize);
      window.cancelAnimationFrame(raf);
      halt();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      stage.dataset.fruitLoaderReady = "false";
    },
  };
}
