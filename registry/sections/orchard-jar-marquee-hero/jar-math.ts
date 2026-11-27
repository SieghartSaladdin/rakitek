import type { JarMaterial } from "./jar-renderer";

export const ROT_AMPLITUDE = 18;
export const Y_OFFSETS = [-0.053, 0.043, -0.024, 0.057, -0.048, 0.029, -0.038, 0.053];
export const SPIN_DURATION = 2;
export const HOVER_DWELL_MS = 260;
export const MOTION_THRESHOLD = 6;
export const SCALE_MIN = 0.55;
export const SCALE_MAX = 1.35;
export const EDGE_SHRINK = 0.1;
export const BRIGHT_MIN = 0.7;
export const BRIGHT_MAX = 1.1;
export const INTRO_MS = 1150;
export const INTRO_RISE = 56;
export const INTRO_SCALE = 0.9;
export const BADGE_INTRO_ROTATION = -18;
export const SPRING_STIFFNESS = 70;
export const SPRING_DAMPING = 9;

export interface Spring {
  value: number;
  velocity: number;
}

export interface LabelRec {
  element: HTMLElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  labelUrl: string;
  jar: JarMaterial | null;
  labelReady: boolean;
  cycleStart: number;
  hoverQueued: boolean;
  isPointerOver: boolean;
  pointerEnterTime: number;
  hoverDwellStart: number;
  renderedOffset: number;
  needsRender: boolean;
  turn: Spring;
  lean: Spring;
  lift: Spring;
  pullX: Spring;
  pullY: Spring;
  teardown: () => void;
}

export const spring = (): Spring => ({ value: 0, velocity: 0 });

export const stepSpring = (s: Spring, target: number, stiffness: number, dt: number) => {
  s.velocity += ((target - s.value) * stiffness - s.velocity * SPRING_DAMPING) * dt;
  s.value += s.velocity * dt;
  if (Math.abs(s.velocity) < 0.001 && Math.abs(target - s.value) < 0.001) {
    s.value = target;
    s.velocity = 0;
  }
};

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;
export const easeInOutQuint = (t: number) =>
  t < 0.5 ? 16 * t * t * t * t * t : 1 - (-2 * t + 2) ** 5 / 2;

export function createLabelRecords(items: HTMLElement[], canHover: () => boolean): LabelRec[] {
  return items
    .map((element): LabelRec | null => {
      const canvas = element.querySelector("canvas");
      const labelUrl = element.dataset.label || "";
      const ctx = canvas?.getContext("2d") ?? null;
      if (!canvas || !ctx || !labelUrl) return null;
      const rec: LabelRec = {
        element,
        canvas,
        ctx,
        labelUrl,
        jar: null,
        labelReady: false,
        cycleStart: -1,
        hoverQueued: false,
        isPointerOver: false,
        pointerEnterTime: -1,
        hoverDwellStart: -1,
        renderedOffset: Number.NaN,
        needsRender: true,
        turn: spring(),
        lean: spring(),
        lift: spring(),
        pullX: spring(),
        pullY: spring(),
        teardown: () => {},
      };
      const onEnter = () => {
        if (!canHover()) return;
        rec.isPointerOver = true;
        rec.hoverQueued = true;
        rec.pointerEnterTime = performance.now();
      };
      const onLeave = () => {
        rec.isPointerOver = false;
        rec.hoverQueued = false;
      };
      element.addEventListener("pointerenter", onEnter);
      element.addEventListener("pointerleave", onLeave);
      rec.teardown = () => {
        element.removeEventListener("pointerenter", onEnter);
        element.removeEventListener("pointerleave", onLeave);
      };
      return rec;
    })
    .filter((l): l is LabelRec => !!l);
}
