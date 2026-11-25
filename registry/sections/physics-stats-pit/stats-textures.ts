export interface StatColumn {
  key: string;
  label: string;
  target: number;
  subtitle?: string;
}

export const PHYSICS_CONFIG = {
  surfaceYFraction: 0.5,
  ballsPerColumn: 25,
  scorePerBall: 4,
  maxScore: 100,
  seedMinBalls: 5,
  seedMaxBalls: 8,
  dividerWidth: 8,
  holdSpawnIntervalMs: 143,
  dieDuration: 0.38,
  popDuration: 0.42,
  radiusMinFactor: 0.6,
  radiusMaxFactor: 1.45,
} as const;

export const easeOutBack = (t: number): number => {
  const c = 1.70158;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
};

const FALLBACK_COLORS = [
  "hsl(12 96% 49%)",
  "hsl(194 84% 80%)",
  "hsl(305 88% 87%)",
  "hsl(217 94% 46%)",
] as const;

const MOBILE_TILE_GRADIENTS = [
  "linear-gradient(155deg, hsl(46 98% 54%) 0%, hsl(46 98% 54%) 26%, hsl(12 96% 49%) 26.5%, hsl(12 96% 49%) 100%)",
  "linear-gradient(104deg, hsl(194 84% 82%) 0%, hsl(194 84% 82%) 46%, hsl(34 22% 45%) 46.5%, hsl(34 22% 45%) 74%, hsl(194 84% 82%) 74.5%)",
  "linear-gradient(112deg, hsl(305 88% 87%) 0%, hsl(305 88% 87%) 40%, hsl(38 22% 46%) 40.5%, hsl(38 22% 46%) 62%, hsl(305 88% 87%) 62.5%)",
  "repeating-linear-gradient(135deg, hsl(217 94% 46%) 0 38px, hsl(200 94% 80%) 38px 62px, hsl(217 94% 46%) 62px 104px)",
] as const;

export function getColumnFallbackColor(index: number): string {
  return FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

export function getMobileTileGradient(index: number): string {
  return MOBILE_TILE_GRADIENTS[index % MOBILE_TILE_GRADIENTS.length];
}

function paintEmberMotif(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "hsl(12 96% 49%)";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "hsl(46 98% 54%)";
  const spikes = 7;
  const step = w / spikes;
  for (let row = 0; row < 3; row++) {
    const yBase = h * (0.28 + row * 0.27);
    ctx.beginPath();
    ctx.moveTo(0, yBase);
    for (let i = 0; i <= spikes; i++) {
      const px = i * step;
      const py = i % 2 === 0 ? yBase - h * 0.14 : yBase + h * 0.05;
      ctx.lineTo(px, py);
    }
    ctx.lineTo(w, yBase + h * 0.08);
    ctx.lineTo(0, yBase + h * 0.08);
    ctx.closePath();
    ctx.fill();
  }

  ctx.fillStyle = "hsl(12 96% 49%)";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.92, w * 0.52, Math.PI, 0);
  ctx.fill();
}

function paintGlacierMotif(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "hsl(194 84% 82%)";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "hsl(34 22% 45%)";
  ctx.beginPath();
  ctx.moveTo(w * 0.34, 0);
  ctx.lineTo(w * 0.72, 0);
  ctx.lineTo(w * 0.58, h);
  ctx.lineTo(w * 0.22, h);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.arc(w * 0.68, h * 0.56, w * 0.24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "hsl(194 84% 82%)";
  ctx.beginPath();
  ctx.arc(w * 0.5, h * 0.76, w * 0.17, Math.PI, 0);
  ctx.lineTo(w * 0.67, h);
  ctx.lineTo(w * 0.33, h);
  ctx.closePath();
  ctx.fill();
}

function paintOrchidMotif(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "hsl(305 88% 87%)";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "hsl(38 22% 46%)";
  const bands: Array<[number, number, number, number]> = [
    [0.18, 0.14, 0.36, 0.34],
    [0.54, 0.32, 0.28, 0.38],
    [0.24, 0.62, 0.38, 0.26],
    [0.72, 0.72, 0.24, 0.2],
  ];
  for (const [rx, ry, rw, rh] of bands) {
    ctx.beginPath();
    ctx.moveTo(w * rx, h * ry);
    ctx.lineTo(w * (rx + rw), h * ry);
    ctx.lineTo(w * (rx + rw - 0.12), h * (ry + rh));
    ctx.lineTo(w * (rx - 0.12), h * (ry + rh));
    ctx.closePath();
    ctx.fill();
  }
}

function paintCobaltMotif(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = "hsl(217 94% 46%)";
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "hsl(200 94% 80%)";
  ctx.lineWidth = w * 0.085;
  ctx.lineCap = "round";
  for (let row = 0; row < 5; row++) {
    const y = h * (0.14 + row * 0.2);
    ctx.beginPath();
    ctx.moveTo(-w * 0.1, y + h * 0.06);
    ctx.quadraticCurveTo(w * 0.25, y - h * 0.07, w * 0.5, y + h * 0.04);
    ctx.quadraticCurveTo(w * 0.75, y + h * 0.15, w * 1.1, y - h * 0.02);
    ctx.stroke();
  }

  ctx.fillStyle = "hsl(220 92% 34%)";
  ctx.beginPath();
  ctx.arc(w * 0.18, h * 0.88, w * 0.28, 0, Math.PI * 2);
  ctx.arc(w * 0.84, h * 0.84, w * 0.24, 0, Math.PI * 2);
  ctx.fill();
}

const PAINTERS = [paintEmberMotif, paintGlacierMotif, paintOrchidMotif, paintCobaltMotif] as const;

export function buildColumnTextures(count: number): HTMLCanvasElement[] {
  const width = 480;
  const height = 640;
  const textures: HTMLCanvasElement[] = [];

  for (let i = 0; i < count; i++) {
    const offscreen = document.createElement("canvas");
    offscreen.width = width;
    offscreen.height = height;
    const ctx = offscreen.getContext("2d");
    if (ctx) {
      PAINTERS[i % PAINTERS.length](ctx, width, height);
    }
    textures.push(offscreen);
  }

  return textures;
}

export function drawCover(
  ctx: CanvasRenderingContext2D,
  source: HTMLCanvasElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number,
) {
  const srcAspect = source.width / source.height;
  const destAspect = dw / dh;
  let sw: number;
  let sh: number;
  let sx: number;
  let sy: number;

  if (srcAspect > destAspect) {
    sh = source.height;
    sw = sh * destAspect;
    sx = (source.width - sw) / 2;
    sy = 0;
  } else {
    sw = source.width;
    sh = sw / destAspect;
    sx = 0;
    sy = (source.height - sh) / 2;
  }

  ctx.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
}
