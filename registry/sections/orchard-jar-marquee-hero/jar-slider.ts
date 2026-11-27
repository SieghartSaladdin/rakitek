import { attachMarqueeInput } from "./jar-input";
import {
  BADGE_INTRO_ROTATION,
  BRIGHT_MAX,
  BRIGHT_MIN,
  createLabelRecords,
  easeInOutQuint,
  easeOutCubic,
  EDGE_SHRINK,
  HOVER_DWELL_MS,
  INTRO_MS,
  INTRO_RISE,
  INTRO_SCALE,
  MOTION_THRESHOLD,
  ROT_AMPLITUDE,
  SCALE_MAX,
  SCALE_MIN,
  SPIN_DURATION,
  SPRING_STIFFNESS,
  stepSpring,
  Y_OFFSETS,
} from "./jar-math";
import { createJarWebGLRenderer, FRONT_ROT, JAR_RATIO, type JarRenderer } from "./jar-renderer";

const JAR_ASPECT = 1 / JAR_RATIO;
const ITEM_SIZE_MULT = 1.15;

export function createJarMarquee(
  root: HTMLElement,
  opts: { labelDelayMs?: number } = {},
): { destroy: () => void } | null {
  const wrap = root.querySelector<HTMLElement>("[data-jar-slider-wrap]");
  const track = root.querySelector<HTMLElement>("[data-jar-slider-track]");
  const items = Array.from(root.querySelectorAll<HTMLElement>("[data-jar-slider-item]"));
  if (!wrap || !track || !items.length) return null;

  const count = items.length;
  let itemW = 0, itemH = 0, slotW = 0, totalLen = 0, waveLen = 0, wrapPad = 0;
  let trackCx = 0, trackCy = 0, cosA = 1, sinA = 0;
  const hoverMq = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMq = window.matchMedia("(prefers-reduced-motion: reduce)");

  const layout = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const phone = vw <= 480;
    const tablet = !phone && vw <= 1024;
    const slotBase = vw / (phone || tablet ? 3 : 4);
    slotW = slotBase * (phone ? 1.15 : tablet ? 1.265 : 0.92);
    itemW = slotBase * (phone ? 0.73 : tablet ? 0.7875 : 0.5358) * ITEM_SIZE_MULT;
    itemH = itemW * JAR_ASPECT;
    if (itemH > vh * 0.72) {
      itemH = vh * 0.72;
      itemW = itemH / JAR_ASPECT;
    }
    totalLen = count * slotW;
    waveLen = 3 * slotW;
    wrapPad = itemW * 2;
    root.style.setProperty("--jar-item-w", `${itemW}px`);
    root.style.setProperty("--jar-item-h", `${itemH}px`);
    root.style.setProperty("--jar-marquee-h", `${Math.min(itemH * 1.35, vh * 0.95)}px`);
    const rootRect = root.getBoundingClientRect();
    const trackRect = track.getBoundingClientRect();
    trackCx = trackRect.left + trackRect.width / 2 - rootRect.left;
    trackCy = trackRect.top + trackRect.height / 2 - rootRect.top;
    const angle = ((Number.parseFloat(getComputedStyle(root).getPropertyValue("--jar-marquee-angle")) || 0) * Math.PI) / 180;
    cosA = Math.cos(angle);
    sinA = Math.sin(angle);
  };
  layout();

  const labels = createLabelRecords(items, () => hoverMq.matches);
  let renderer: JarRenderer | null = null;
  let alive = true;
  let introStart = -1;
  const markIntro = () => { if (introStart < 0) introStart = performance.now(); };
  const introFallback = window.setTimeout(markIntro, (opts.labelDelayMs ?? 120) + 1200);

  const threeTimer = window.setTimeout(async () => {
    try {
      const THREE = await import("three");
      if (!alive) return;
      renderer = createJarWebGLRenderer(THREE, () => labels.forEach((l) => (l.needsRender = true)));
      renderer.resize(labels.map((l) => l.canvas));
      let pending = labels.length;
      if (!pending) return markIntro();
      labels.forEach((l) => {
        if (!renderer) return;
        l.jar = renderer.createMaterial(
          l.labelUrl,
          () => { l.labelReady = true; l.needsRender = true; if (--pending <= 0) markIntro(); },
          () => { if (--pending <= 0) markIntro(); },
        );
      });
    } catch { markIntro(); }
  }, opts.labelDelayMs ?? 120);

  const input = attachMarqueeInput(root, wrap, () => {
    layout();
    renderer?.resize(labels.map((l) => l.canvas));
  });

  let scroll = 0, velocity = 0, lastTime = performance.now(), lastMotionTime = -1;
  let hoverStrength = 0, parX = 0, parY = 0;
  const startTime = performance.now();
  const slotX = (index: number, offset: number) => {
    let c = (index * slotW + itemW / 2 + offset + wrapPad) % totalLen;
    if (c < 0) c += totalLen;
    return c - wrapPad;
  };

  let raf = 0;
  const frame = (now: number) => {
    if (!alive) return;
    const dt = Math.min(1 / 30, Math.max(0, (now - lastTime) / 1000));
    lastTime = now;
    const { target, dragging, pointerInside, pointerX, pointerY } = input.state;
    const motionOk = !reducedMq.matches;
    const hoverActive = motionOk && pointerInside && hoverMq.matches;
    let px = 0, py = 0;
    if (hoverActive || hoverStrength > 0) {
      const rect = root.getBoundingClientRect();
      px = pointerX - rect.left;
      py = pointerY - rect.top;
      if (hoverActive && rect.width > 0 && rect.height > 0) {
        const k = 1 - Math.exp(-4 * dt);
        parX += (Math.max(-1, Math.min(1, (px / rect.width) * 2 - 1)) - parX) * k;
        parY += (Math.max(-1, Math.min(1, (py / rect.height) * 2 - 1)) - parY) * k;
      }
    }
    hoverStrength += ((hoverActive ? 1 : 0) - hoverStrength) * (1 - Math.exp(-3 * dt));
    if (!hoverActive && hoverStrength < 0.001) hoverStrength = 0;
    const parallaxX = parX * hoverStrength;
    const parallaxY = parY * hoverStrength;
    root.style.setProperty("--jar-parallax-x", parallaxX.toFixed(4));
    root.style.setProperty("--jar-parallax-y", parallaxY.toFixed(4));

    const prevScroll = scroll;
    scroll += (target - scroll) * (1 - Math.exp(-(dragging ? 11 : 2.3) * dt));
    if (Math.abs(target - scroll) < 0.05) scroll = target;
    velocity = dt > 0 ? (scroll - prevScroll) / dt : 0;

    const vw = window.innerWidth;
    root.style.setProperty("--jar-circle-rotation", `${scroll * (vw <= 480 ? -0.03 : -0.012)}deg`);
    const speed = Math.abs(velocity);
    if (dragging || speed > MOTION_THRESHOLD) lastMotionTime = now;
    const hoverCalm = !dragging && speed <= slotW * 1.4;
    const vNorm = Math.min(1, speed / 2400);
    const velScale = 1 - vNorm * vNorm * 0.05;
    const velBlur = vNorm * vNorm * (vw <= 480 ? 1.6 : 3.2);

    const shapeT = easeOutCubic(Math.min(1, Math.max(0, now - startTime) / INTRO_MS));
    root.style.setProperty("--jar-shape-intro-opacity", `${shapeT}`);
    root.style.setProperty("--jar-shape-intro-y", `${(1 - shapeT) * INTRO_RISE * 0.42}px`);
    root.style.setProperty("--jar-badge-intro-opacity", `${shapeT}`);
    root.style.setProperty("--jar-badge-intro-y", `${(1 - shapeT) * INTRO_RISE * 0.22}px`);
    root.style.setProperty("--jar-badge-intro-rotation", `${(1 - shapeT) * BADGE_INTRO_ROTATION}deg`);

    labels.forEach((a, i) => {
      const cx = slotX(i, scroll);
      const q = cx / vw;
      const warped = (q + 0.55 * 0.16 * Math.tanh((q - 0.5) / 0.16)) * vw;
      const bell = q >= 0 && q <= 1 ? Math.sin(q * Math.PI) : 0;
      const edge = slotW > 0 ? Math.abs(q - 0.5) / (slotW / vw) : 0;
      const scale = (SCALE_MIN + bell * (SCALE_MAX - SCALE_MIN)) * (1 - EDGE_SHRINK * Math.min(1, edge));
      const brightness = BRIGHT_MIN + bell * (BRIGHT_MAX - BRIGHT_MIN);
      const intro = easeOutCubic(introStart < 0 ? 1 : Math.min(1, Math.max(0, now - introStart) / INTRO_MS));
      const rise = (1 - intro) * INTRO_RISE;
      const rot = Math.sin(((i * slotW + scroll) / waveLen) * Math.PI * 2) * ROT_AMPLITUDE;
      const yOff = Y_OFFSETS[i % Y_OFFSETS.length] * itemH;
      const cxPos = trackCx + (warped - vw / 2) * cosA - (yOff + rise) * sinA;
      const cyPos = trackCy + (warped - vw / 2) * sinA + (yOff + rise) * cosA;

      let turnT = motionOk ? -Math.max(-1, Math.min(1, velocity / 2400)) * 38 : 0;
      let leanT = -Math.sign(velocity) * vNorm * 6;
      let liftT = 0, pullXT = 0, pullYT = 0;
      if (hoverStrength > 0) {
        const along = (px - cxPos) * cosA + (py - cyPos) * sinA;
        const across = -(px - cxPos) * sinA + (py - cyPos) * cosA;
        const radius = itemW * 1.6;
        const gauss = Math.exp(-((along * along + across * across) / (radius * radius)));
        const tAlong = Math.tanh(along / radius);
        const strength = hoverStrength * (0.3 + 0.7 * gauss);
        const sf = scale / SCALE_MAX;
        turnT += tAlong * 30 * strength;
        leanT += tAlong * 5 * gauss * hoverStrength;
        liftT = 0.05 * gauss * hoverStrength;
        pullXT = tAlong * 16 * gauss * hoverStrength + (parallaxX * cosA + parallaxY * sinA) * 26 * sf;
        pullYT = Math.tanh(across / (itemH * 0.8)) * 16 * gauss * hoverStrength + (-parallaxX * sinA + parallaxY * cosA) * 26 * sf;
      }
      const stiffness = SPRING_STIFFNESS * (0.85 + 0.3 * ((i * 0.618034) % 1));
      stepSpring(a.turn, turnT, stiffness, dt);
      stepSpring(a.lean, leanT, stiffness, dt);
      stepSpring(a.lift, liftT, stiffness, dt);
      stepSpring(a.pullX, pullXT, stiffness, dt);
      stepSpring(a.pullY, pullYT, stiffness, dt);

      a.element.style.transform = `translate(${warped - itemW / 2 + a.pullX.value}px, ${yOff + rise + a.pullY.value}px) rotate(${rot + a.lean.value}deg) scale(${scale * (INTRO_SCALE + intro * (1 - INTRO_SCALE)) * velScale * (1 + a.lift.value)})`;
      a.element.style.opacity = `${intro}`;
      a.element.style.filter = `brightness(${brightness}) blur(${(Math.min(vw <= 480 ? 2 : 4, edge * edge) + velBlur).toFixed(2)}px)`;

      let spin = 0;
      if (!hoverCalm || !a.isPointerOver) a.hoverDwellStart = -1;
      else if (a.hoverDwellStart < 0) a.hoverDwellStart = now;
      if (hoverMq.matches && a.isPointerOver && a.hoverQueued && a.cycleStart < 0 && a.hoverDwellStart >= 0 && (a.pointerEnterTime > lastMotionTime || now - a.hoverDwellStart >= HOVER_DWELL_MS)) {
        a.cycleStart = now;
        a.hoverQueued = false;
      }
      if (hoverMq.matches && a.cycleStart >= 0) {
        const elapsed = (now - a.cycleStart) / 1000;
        if (elapsed >= SPIN_DURATION) a.cycleStart = -1;
        else spin = easeInOutQuint(elapsed / SPIN_DURATION);
      }
      const offset = FRONT_ROT / 360 - spin - intro - Math.round(a.turn.value / 360 / 0.0005) * 0.0005;
      if (renderer && a.jar && a.labelReady && (a.needsRender || (cx + itemW > 0 && cx - itemW < vw && a.renderedOffset !== offset))) {
        renderer.render(a.jar, offset);
        renderer.blit(a.ctx);
        a.renderedOffset = offset;
        a.needsRender = false;
      }
    });
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    destroy: () => {
      alive = false;
      window.clearTimeout(threeTimer);
      window.clearTimeout(introFallback);
      cancelAnimationFrame(raf);
      input.destroy();
      labels.forEach((l) => { l.teardown(); l.jar?.dispose(); });
      renderer?.dispose();
    },
  };
}
