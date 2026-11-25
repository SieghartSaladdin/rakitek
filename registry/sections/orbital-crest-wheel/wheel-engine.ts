export interface OrbitalCrestItem {
  name: string;
  motifIndex?: number;
}

export const DEFAULT_SPOKE_COUNT = 10;
export const BASE_SPIN_DEG_PER_SEC = 4;
export const SCROLL_SPIN_GAIN = 0.05;
export const MAX_SCROLL_SPIN = 110;
export const HOVER_FALLOFF_DEG = 26;
export const NAME_FADE_DEG = 16;
export const SPOKE_PHASE_DEG = 15;
export const INITIAL_WHEEL_ROTATION_DEG = 15;
const REVEAL_DURATION_MS = 620;
const MAX_SCROLL_STEP_PX = 180;

export function wrapAngle(deg: number): number {
  return (((deg % 360) + 540) % 360) - 180;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
}

export interface WheelEngineOptions {
  section: HTMLElement;
  wheel: HTMLDivElement;
  nameEl: HTMLParagraphElement;
  headWrap: HTMLDivElement | null;
  crestRefs: { current: (HTMLSpanElement | null)[] };
  inViewRef: { current: boolean };
  crests: OrbitalCrestItem[];
  spokeCount: number;
  isMobile: boolean;
  reducedMotion: boolean;
}

export function startOrbitalWheelEngine({
  section,
  wheel,
  nameEl,
  headWrap,
  crestRefs,
  inViewRef,
  crests,
  spokeCount,
  isMobile,
  reducedMotion,
}: WheelEngineOptions): () => void {
  let rotation = INITIAL_WHEEL_ROTATION_DEG;
  let lastScrollY = window.scrollY;
  let scrollVel = 0;
  let revealStart: number | null = reducedMotion ? 0 : null;
  const pointer = { x: 0, y: 0, on: false };
  const push = Array<number>(spokeCount).fill(0);

  if (reducedMotion) {
    section.style.setProperty("--rk-wheel-hl", "1");
  }

  const onPointerMove = (event: PointerEvent) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.on = true;
  };

  const onPointerLeave = () => {
    pointer.on = false;
  };

  window.addEventListener("pointermove", onPointerMove);
  document.addEventListener("pointerleave", onPointerLeave);

  let raf = 0;
  let last = performance.now();

  const frame = () => {
    const now = performance.now();
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!inViewRef.current) {
      lastScrollY = window.scrollY;
      raf = requestAnimationFrame(frame);
      return;
    }

    if (!reducedMotion) {
      if (revealStart === null) {
        revealStart = now;
      }
      const revealProgress = clamp01((now - revealStart) / REVEAL_DURATION_MS);
      section.style.setProperty("--rk-wheel-hl", revealProgress.toFixed(3));
    }

    const scrollY = window.scrollY;
    const deltaY = scrollY - lastScrollY;
    lastScrollY = scrollY;
    const instantVel = dt > 0 && Math.abs(deltaY) <= MAX_SCROLL_STEP_PX ? deltaY / dt : 0;
    scrollVel += (instantVel - scrollVel) * Math.min(1, dt * 6);
    const scrollSpin = Math.max(
      -MAX_SCROLL_SPIN,
      Math.min(MAX_SCROLL_SPIN, scrollVel * SCROLL_SPIN_GAIN),
    );

    if (!reducedMotion) {
      rotation += (BASE_SPIN_DEG_PER_SEC + scrollSpin) * dt;
    }

    if (headWrap) {
      const vh = window.innerHeight || 1;
      const titleRel = headWrap.getBoundingClientRect().top / vh;
      const morph = reducedMotion ? 0 : smoothstep(0.52, 0.12, titleRel);
      section.style.setProperty("--rk-wheel-morph", morph.toFixed(3));
    }

    const wheelRect = wheel.getBoundingClientRect();
    const cx = wheelRect.left + wheelRect.width / 2;
    const cy = wheelRect.top + wheelRect.height / 2;
    const radius = wheel.offsetWidth / 2;
    const sectionRect = section.getBoundingClientRect();
    const scale = sectionRect.width / section.offsetWidth || 1;
    const crestHalfHeight = (crestRefs.current[0]?.offsetHeight ?? 0) / 2;

    wheel.style.transform = `rotate(${rotation}deg)`;

    const dx = pointer.x - cx;
    const dy = pointer.y - cy;
    const pointerDist = Math.hypot(dx, dy);
    const pointerAngle = (Math.atan2(dx, -dy) * 180) / Math.PI;

    const semiA = radius * (isMobile ? 0.78 : 1);
    const semiB = radius * (isMobile ? 1.04 : 1);
    const ellipseRadius = (deg: number) => {
      const rad = (deg * Math.PI) / 180;
      return (semiA * semiB) / Math.hypot(semiB * Math.sin(rad), semiA * Math.cos(rad));
    };

    let topIndex = 0;
    let topDist = 1e9;
    let topAngle = 0;

    for (let i = 0; i < spokeCount; i++) {
      const spokeAngle = wrapAngle((i * 360) / spokeCount + SPOKE_PHASE_DEG + rotation);
      if (Math.abs(spokeAngle) < topDist) {
        topDist = Math.abs(spokeAngle);
        topIndex = i;
        topAngle = spokeAngle;
      }

      let targetPush = 0;
      if (pointer.on && !isMobile && !reducedMotion) {
        const delta = wrapAngle(pointerAngle - spokeAngle);
        const falloff = Math.exp(-((delta / HOVER_FALLOFF_DEG) ** 2));
        const along = pointerDist * Math.cos((delta * Math.PI) / 180);
        targetPush =
          Math.max(-0.09 * radius, Math.min(0.13 * radius, (along - radius) * 1.8)) * falloff;
      }

      push[i] += (targetPush - push[i]) * Math.min(1, dt * 7);
      const crest = crestRefs.current[i];
      const lift = ellipseRadius(spokeAngle) - radius + push[i];
      if (crest) {
        crest.style.transform = `translate(-50%, calc(-50% + ${(-lift).toFixed(1)}px))`;
      }
    }

    const activeSpin = reducedMotion ? 0 : BASE_SPIN_DEG_PER_SEC + scrollSpin;
    const calm = Math.max(0, 1 - Math.abs(activeSpin) / 80);
    const nameOpacity = Math.max(0, Math.min(1, 1 - (topDist - 6) / NAME_FADE_DEG)) * calm;
    const topRad = (topAngle * Math.PI) / 180;
    const topRadius = ellipseRadius(topAngle) + push[topIndex];

    nameEl.style.left = `${((cx + Math.sin(topRad) * topRadius - sectionRect.left) / scale).toFixed(1)}px`;
    nameEl.style.top = `${((cy - Math.cos(topRad) * topRadius - sectionRect.top) / scale + crestHalfHeight + 14).toFixed(1)}px`;
    nameEl.textContent = crests[topIndex % crests.length]?.name ?? "";
    nameEl.style.opacity = nameOpacity.toFixed(2);

    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("pointerleave", onPointerLeave);
  };
}
