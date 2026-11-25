import type { JellyAgent } from "./jellyfish-palettes";
import { CELL, plotPixel, plotPixelLine } from "./reef-backdrop";

export function drawJelly(
  ctx: CanvasRenderingContext2D,
  j: JellyAgent,
  w: number,
  h: number,
  t: number,
  pointer: { x: number; y: number; active: boolean },
  reducedMotion: boolean,
) {
  const pulse = reducedMotion ? 0 : Math.sin(t * (2.1 + j.phase * 0.2) + j.phase);
  const orbitAmpX = j.followsPointer ? 0.24 : 0.14;
  const orbitAmpY = j.followsPointer ? 0.16 : 0.11;
  const targetX =
    j.followsPointer && pointer.active
      ? pointer.x
      : w * j.orbitX + Math.cos(t * j.orbitSpeed + j.phase) * w * orbitAmpX;
  const targetY =
    j.followsPointer && pointer.active
      ? pointer.y
      : h * j.orbitY + Math.sin(t * j.orbitSpeed * 1.35 + j.phase) * h * orbitAmpY;

  const dx = targetX - j.x;
  const dy = targetY - j.y;
  const dist = Math.hypot(dx, dy) || 1;
  const speedFactor = j.followsPointer ? 0.025 : 0.015;
  const thrust =
    (0.042 + Math.max(0, pulse) * 0.042 + j.surge * 0.2) * Math.min(dist, 240) * speedFactor;

  if (!reducedMotion) {
    j.vx = j.vx * 0.91 + (dx / dist) * thrust;
    j.vy = j.vy * 0.91 + (dy / dist) * thrust;
    j.x += j.vx;
    j.y += j.vy;
    j.surge *= 0.91;

    let diff = Math.atan2(dy, dx) - j.angle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    j.angle += diff * 0.055;
  }

  const bellR = Math.min(w, h) * 0.115 * j.scale * (1 + pulse * 0.06 + j.surge * 0.09);
  const halo = ctx.createRadialGradient(j.x, j.y, 6, j.x, j.y, bellR * 2.2);
  halo.addColorStop(0, j.palette.aura);
  halo.addColorStop(1, "rgba(5, 5, 6, 0)");
  ctx.fillStyle = halo;
  ctx.fillRect(j.x - bellR * 2.4, j.y - bellR * 2.4, bellR * 4.8, bellR * 4.8);

  const cosA = Math.cos(j.angle);
  const sinA = Math.sin(j.angle);
  const segLen = 10 * j.scale;

  for (let i = 0; i < j.tentacles.length; i++) {
    const frac = (i / Math.max(1, j.tentacles.length - 1)) * 2 - 1;
    const spread = frac * bellR * 0.72;
    const chain = j.tentacles[i];
    chain[0].x = j.x - cosA * bellR * 0.18 - sinA * spread;
    chain[0].y = j.y - sinA * bellR * 0.18 + cosA * spread;

    for (let s = 1; s < chain.length; s++) {
      const prev = chain[s - 1];
      const cur = chain[s];
      const wave = Math.sin(t * 2.7 + i * 0.8 + j.phase - s * 0.48) * 1.05;
      const vx = cur.x - prev.x - cosA * 1.3 - sinA * wave;
      const vy = cur.y - prev.y - sinA * 1.3 + cosA * wave;
      const d = Math.hypot(vx, vy) || 1;
      cur.x = prev.x + (vx / d) * segLen;
      cur.y = prev.y + (vy / d) * segLen;
    }

    const isCore = Math.abs(frac) < 0.45;
    for (let s = 0; s < chain.length - 1; s++) {
      const fade = 1 - s / chain.length;
      const rgb = isCore ? j.palette.tentacleCore : j.palette.tentacleOuter;
      const alpha = (fade * (isCore ? 0.82 : 0.45)).toFixed(2);
      plotPixelLine(ctx, chain[s].x, chain[s].y, chain[s + 1].x, chain[s + 1].y, `rgba(${rgb}, ${alpha})`);
    }
  }

  const rx = Math.max(4, Math.round((bellR * 1.04) / CELL));
  const ry = Math.max(3, Math.round((bellR * 0.85) / CELL));
  const rot = j.angle + Math.PI / 2;
  const cosR = Math.cos(rot);
  const sinR = Math.sin(rot);

  for (let gy = -ry; gy <= Math.round(ry * 0.25); gy++) {
    for (let gx = -rx; gx <= rx; gx++) {
      const nx = gx / rx;
      const ny = gy / ry;
      const dist2 = nx * nx + ny * ny;
      const skirtWave = Math.sin(nx * Math.PI * 3) * 0.08;
      if (ny > 0.16 + skirtWave || (ny < 0 && dist2 > 1.0) || (ny >= 0 && Math.abs(nx) > 0.98)) {
        continue;
      }

      const isOutline =
        (ny < 0 && dist2 > 0.82) ||
        Math.abs(ny - (0.16 + skirtWave)) < 0.14 ||
        (ny >= 0 && Math.abs(nx) > 0.86);
      const isRib = Math.abs(nx) < 0.09 || Math.abs(Math.abs(nx) - 0.46) < 0.08;
      const checker = ((gx + gy) & 1) === 0;

      let color: string | null = null;
      if (isOutline) color = ny < -0.35 ? j.palette.outlineTop : j.palette.outlineRim;
      else if (dist2 < 0.28 && ny < -0.05) color = checker ? j.palette.coreLight : j.palette.coreMid;
      else if (isRib) color = checker ? j.palette.coreMid : j.palette.ribDark;
      else if (dist2 < 0.65) color = checker ? j.palette.bodyMid : j.palette.bodyDark;
      else if (checker) color = j.palette.bodyEdge;

      if (!color) continue;
      const lx = gx * CELL;
      const ly = gy * CELL;
      plotPixel(ctx, j.x + lx * cosR - ly * sinR, j.y + lx * sinR + ly * cosR, color);
    }
  }
}
