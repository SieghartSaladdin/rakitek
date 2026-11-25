// Procedural geometric motifs, heraldic shield path, and stylized avatar portraits.

export interface MotifTheme {
  bg: string;
  primary: string;
  secondary: string;
  glow: string;
}

export const rgb = (r: number, g: number, b: number, a = 1) =>
  a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`;

export const MOTIF_THEMES: MotifTheme[] = [
  { bg: rgb(206, 36, 32), primary: rgb(236, 198, 42), secondary: rgb(26, 20, 22), glow: rgb(206, 62, 48, 0.34) },
  { bg: rgb(104, 92, 62), primary: rgb(216, 178, 38), secondary: rgb(74, 66, 46), glow: rgb(196, 162, 52, 0.3) },
  { bg: rgb(194, 152, 186), primary: rgb(98, 86, 62), secondary: rgb(232, 208, 226), glow: rgb(172, 128, 168, 0.3) },
  { bg: rgb(32, 92, 178), primary: rgb(164, 212, 248), secondary: rgb(18, 56, 124), glow: rgb(56, 128, 212, 0.34) },
  { bg: rgb(192, 42, 34), primary: rgb(28, 24, 28), secondary: rgb(236, 178, 62), glow: rgb(188, 64, 52, 0.32) },
];

const AVATAR_TONES = [
  { bg: rgb(214, 176, 146), shirt: rgb(62, 48, 44), hair: rgb(42, 30, 26) },
  { bg: rgb(178, 196, 188), shirt: rgb(48, 66, 64), hair: rgb(54, 42, 36) },
  { bg: rgb(198, 174, 196), shirt: rgb(66, 48, 72), hair: rgb(34, 26, 38) },
  { bg: rgb(206, 192, 164), shirt: rgb(78, 62, 44), hair: rgb(48, 38, 28) },
];

export function drawMotifPattern(
  ctx: CanvasRenderingContext2D,
  idx: number,
  x: number,
  y: number,
  w: number,
  h: number,
) {
  const theme = MOTIF_THEMES[idx % MOTIF_THEMES.length];
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = theme.bg;
  ctx.fillRect(0, 0, w, h);

  const kind = idx % 5;
  if (kind === 0) {
    ctx.fillStyle = theme.primary;
    const cw = w * 0.28;
    const ch = h * 0.2;
    ctx.fillRect(0, 0, cw, ch);
    ctx.fillRect(w - cw, 0, cw, ch);
    ctx.fillRect(0, h - ch, cw, ch);
    ctx.fillRect(w - cw, h - ch, cw, ch);
    ctx.fillRect(w * 0.44, h * 0.14, w * 0.12, h * 0.42);
    ctx.fillRect(w * 0.3, h * 0.22, w * 0.4, h * 0.06);
    ctx.fillRect(w * 0.34, h * 0.34, w * 0.32, h * 0.06);
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.48);
    ctx.lineTo(w * 0.72, h * 0.64);
    ctx.lineTo(w * 0.5, h * 0.8);
    ctx.lineTo(w * 0.28, h * 0.64);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = theme.bg;
    ctx.beginPath();
    ctx.moveTo(w * 0.5, h * 0.56);
    ctx.lineTo(w * 0.6, h * 0.64);
    ctx.lineTo(w * 0.5, h * 0.72);
    ctx.lineTo(w * 0.4, h * 0.64);
    ctx.closePath();
    ctx.fill();
  } else if (kind === 1) {
    const cellW = w / 4;
    const cellH = h / 7;
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 4; c++) {
        ctx.fillStyle = (r + c) % 2 === 0 ? theme.primary : theme.secondary;
        const cx = c * cellW;
        const cy = r * cellH;
        ctx.beginPath();
        ctx.arc(cx + cellW * 0.5, cy + cellH * 0.52, cellW * 0.52, Math.PI, 0);
        ctx.lineTo(cx + cellW, cy + cellH + 1);
        ctx.lineTo(cx, cy + cellH + 1);
        ctx.closePath();
        ctx.fill();
      }
    }
  } else if (kind === 2) {
    ctx.fillStyle = theme.primary;
    ctx.fillRect(0, h * 0.72, w, h * 0.28);
    ctx.fillRect(w * 0.44, h * 0.42, w * 0.12, h * 0.34);
    const blobs: Array<[number, number, number]> = [
      [0.5, 0.22, 0.13], [0.33, 0.31, 0.12], [0.67, 0.31, 0.12],
      [0.32, 0.47, 0.11], [0.68, 0.47, 0.11], [0.5, 0.39, 0.14],
    ];
    for (const [bx, by, br] of blobs) {
      ctx.beginPath();
      ctx.arc(w * bx, h * by, w * br, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = theme.bg;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.39, w * 0.06, 0, Math.PI * 2);
    ctx.fill();
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      ctx.arc(w * (0.2 + i * 0.3), h * 0.86, w * 0.065, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (kind === 3) {
    const step = h / 8;
    for (let b = 0; b < 8; b++) {
      ctx.fillStyle = b % 2 === 0 ? theme.primary : theme.secondary;
      ctx.beginPath();
      const baseY = b * step;
      ctx.moveTo(0, baseY);
      for (let px = 0; px <= w; px += w / 16) {
        const wave = Math.sin((px / w) * Math.PI * 4 + b * 0.8) * (step * 0.32);
        ctx.lineTo(px, baseY + wave);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();
    }
  } else {
    const cw = w / 4;
    const ch = h / 6;
    ctx.fillStyle = theme.primary;
    for (let r = 0; r < 6; r++) {
      for (let c = 0; c < 4; c++) {
        const cx = (c + 0.5) * cw;
        const cy = (r + 0.5) * ch;
        ctx.beginPath();
        ctx.moveTo(cx, cy - ch * 0.44);
        ctx.lineTo(cx + cw * 0.44, cy);
        ctx.lineTo(cx, cy + ch * 0.44);
        ctx.lineTo(cx - cw * 0.44, cy);
        ctx.closePath();
        ctx.fill();
      }
    }
  }
  ctx.restore();
}

export function shieldPath(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  const r = w * 0.16;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h * 0.5);
  ctx.quadraticCurveTo(x + w, y + h * 0.86, x + w / 2, y + h);
  ctx.quadraticCurveTo(x, y + h * 0.86, x, y + h * 0.5);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

export function drawAvatarDot(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, seed: number) {
  const tone = AVATAR_TONES[seed % AVATAR_TONES.length];
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.clip();
  ctx.fillStyle = tone.bg;
  ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);
  ctx.fillStyle = tone.shirt;
  ctx.beginPath();
  ctx.arc(cx, cy + radius * 0.95, radius * 0.78, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = tone.hair;
  ctx.beginPath();
  ctx.arc(cx, cy - radius * 0.14, radius * 0.36, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}
