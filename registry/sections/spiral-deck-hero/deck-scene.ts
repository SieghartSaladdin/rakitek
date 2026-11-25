// Three.js WebGL 3D spiral card deck controller with clean disposal and reduced-motion support.

import {
  DoubleSide,
  Group,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from "three";
import { HERO_SPIRAL_CONFIG, type DeckConfig } from "./deck-data";
import { CARD_FRAGMENT_SHADER, CARD_VERTEX_SHADER } from "./deck-shaders";
import { buildCardTexturePair, PLANE_HEIGHT, PLANE_WIDTH, type SpiralCardItem } from "./deck-textures";

const CARD_COUNT = 18;
const CENTER_SLOT = 9;
const CAMERA_Z_OFFSET = 6.5;
const REVEAL_DURATION = 2.2;

export interface SpiralDeckController {
  setPointer: (nx: number, ny: number) => void;
  dragBy: (delta: number) => void;
  dispose: () => void;
}

type CardMesh = Mesh<PlaneGeometry, ShaderMaterial>;

const wrapIndex = (index: number, count: number) => ((index % count) + count) % count;

export function mountSpiralDeck(
  canvas: HTMLCanvasElement,
  cards: SpiralCardItem[],
  footerNote: string,
  reducedMotion: boolean,
  config: Partial<DeckConfig> = {},
): SpiralDeckController | null {
  if (cards.length === 0) return null;
  const cfg: DeckConfig = { ...HERO_SPIRAL_CONFIG, ...config };

  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch {
    return null;
  }

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.z = cfg.radius * cfg.squish + CAMERA_Z_OFFSET;

  const textureScale = window.innerWidth <= 768 ? 1.5 : 2;
  const maxAniso = renderer.capabilities.getMaxAnisotropy();
  const { fronts, backs } = buildCardTexturePair(cards, footerNote, textureScale, maxAniso);

  const deckGroup = new Group();
  scene.add(deckGroup);
  const geometry = new PlaneGeometry(PLANE_WIDTH, PLANE_HEIGHT, 24, 16);
  const meshes: CardMesh[] = Array.from({ length: CARD_COUNT }, () => {
    const mat = new ShaderMaterial({
      uniforms: {
        uTex: { value: fronts[0] },
        uBack: { value: backs[0] },
        uBend: { value: cfg.bend },
        uSmear: { value: 0 },
        uDir: { value: new Vector2(0, 1) },
        uDim: { value: 1 },
        uFlip: { value: 0 },
        uCardH: { value: PLANE_HEIGHT },
      },
      vertexShader: CARD_VERTEX_SHADER,
      fragmentShader: CARD_FRAGMENT_SHADER,
      transparent: true,
      side: DoubleSide,
      depthTest: false,
      depthWrite: false,
    });
    const mesh = new Mesh(geometry, mat);
    deckGroup.add(mesh);
    return mesh;
  });

  let alive = true;
  let rafId = 0;
  let spinTarget = 0;
  let spinSmooth = 0;
  let prevPos = 0;
  let velocity = 0;
  let tiltX = 0;
  let tiltZ = 0;
  let pointerX = 0;
  let pointerY = 0;
  let lastPointerX = 0;
  let lastPointerY = 0;
  let lastTime = performance.now() / 1000;
  let lastMoveTime = lastTime;
  let lastFrameTime = 0;
  let renderUntil = lastTime + 1;
  let revealing = !reducedMotion;
  const revealStart = lastTime;

  const positionCards = (now: number, dt: number) => {
    let revealEase = 1;
    if (revealing) {
      const k = Math.min(1, (now - revealStart) / REVEAL_DURATION);
      revealEase = 1 - (1 - k) ** 3;
      if (k >= 1) revealing = false;
    }

    const radius = 12 + (cfg.radius - 12) * revealEase;
    const speed = 1 + (cfg.autoSpeed - 1) * revealEase;
    const baseScale = 0.4 + (cfg.cardScale - 0.4) * revealEase;
    if (cfg.auto && !reducedMotion) spinTarget += speed * dt;

    spinSmooth += (spinTarget - spinSmooth) * Math.min(1, dt * 8);
    if (Math.abs(spinTarget - spinSmooth) < 3e-4) spinSmooth = spinTarget;

    const pos = spinSmooth;
    velocity += ((pos - prevPos) / dt - velocity) * 0.25;
    prevPos = pos;
    const smear = reducedMotion ? 0 : Math.min(0.055, Math.abs(velocity) * 0.012 * cfg.smear);

    const depth = radius * cfg.squish;
    camera.position.z = depth + CAMERA_Z_OFFSET;
    tiltX = reducedMotion ? 0 : tiltX + (-pointerY * cfg.mouseTilt - tiltX) * Math.min(1, dt * 4);
    tiltZ = reducedMotion ? 0 : tiltZ + (pointerX * cfg.mouseTilt - tiltZ) * Math.min(1, dt * 4);
    deckGroup.rotation.x = tiltX;
    deckGroup.rotation.z = -tiltZ;

    const halfH = Math.tan((38 * Math.PI) / 360) * camera.position.z;
    const halfW = halfH * camera.aspect;
    const ptrWX = pointerX * halfW;
    const ptrWY = pointerY * halfH;
    const firstIndex = Math.round(pos) - CENTER_SLOT;

    for (let slot = 0; slot < CARD_COUNT; slot++) {
      const cardIndex = firstIndex + slot;
      const rel = cardIndex - pos;
      const ang = rel * cfg.angleStep;
      const cos = Math.cos(ang);
      const sin = Math.sin(ang);

      let px = radius * sin + rel * cfg.gapX;
      let py = rel * cfg.gapY;
      if (!reducedMotion) {
        const mdx = ptrWX - px;
        const mdy = ptrWY - py;
        const pull = cfg.magnet * Math.exp(-(mdx * mdx + mdy * mdy) / 9);
        px += mdx * pull;
        py += mdy * pull;
      }

      const pz = depth * cos;
      const mesh = meshes[slot];
      mesh.position.set(px, py, pz);
      mesh.rotation.set(0, ang, -sin * cfg.edgeTwist);
      mesh.scale.setScalar(baseScale);
      mesh.renderOrder = Math.round(pz * 100);

      const texIdx = wrapIndex(cardIndex, cards.length);
      const u = mesh.material.uniforms;
      u.uTex.value = fronts[texIdx];
      u.uBack.value = backs[texIdx];
      u.uBend.value = cfg.bend;
      u.uSmear.value = smear;
      u.uDim.value = Math.max(0.32, 0.5 + 0.5 * cos);
    }
  };

  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (w <= 0 || h <= 0) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const now = performance.now() / 1000;
    positionCards(now, 0.016);
    renderer.render(scene, camera);
    renderUntil = now + 0.45;
  };

  resize();
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);
  window.addEventListener("resize", resize);

  const frame = () => {
    if (!alive) return;
    const now = performance.now() / 1000;
    const moved =
      Math.abs(pointerX - lastPointerX) > 1e-4 ||
      Math.abs(pointerY - lastPointerY) > 1e-4 ||
      revealing;
    if (moved) lastMoveTime = now;

    if (now - lastMoveTime > 2 && now - lastFrameTime < 1 / 30) {
      rafId = requestAnimationFrame(frame);
      return;
    }
    lastFrameTime = now;
    const dt = Math.min(0.05, now - lastTime) || 0.016;
    lastTime = now;

    positionCards(now, dt);
    const active = moved || Math.abs(spinTarget - spinSmooth) > 3e-4;
    lastPointerX = pointerX;
    lastPointerY = pointerY;
    if ((cfg.auto && !reducedMotion) || active) renderUntil = now + 0.45;
    if (now <= renderUntil) renderer.render(scene, camera);
    if (!reducedMotion) rafId = requestAnimationFrame(frame);
  };

  if (!reducedMotion) rafId = requestAnimationFrame(frame);

  return {
    setPointer(nx, ny) {
      pointerX = nx;
      pointerY = ny;
      renderUntil = performance.now() / 1000 + 0.45;
    },
    dragBy(delta) {
      spinTarget += delta;
      const now = performance.now() / 1000;
      renderUntil = now + 0.45;
      if (reducedMotion) {
        positionCards(now, 0.016);
        renderer.render(scene, camera);
      }
    },
    dispose() {
      alive = false;
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
      geometry.dispose();
      meshes.forEach((m) => m.material.dispose());
      fronts.forEach((t) => t.dispose());
      backs.forEach((t) => t.dispose());
      renderer.dispose();
    },
  };
}
