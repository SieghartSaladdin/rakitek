// Procedural Canvas2D front and back card texture builder (zero external assets).

import { CanvasTexture, LinearMipmapLinearFilter, NoColorSpace } from "three";
import { drawAvatarDot, drawMotifPattern, MOTIF_THEMES, rgb, shieldPath } from "./deck-motifs";

export interface SpiralCardItem {
  id: number;
  house: string;
  title: string;
  body: string;
  duration?: string;
  extraCount?: number;
  patternIndex?: number;
}

export const CARD_WIDTH = 345;
export const CARD_HEIGHT = 490;
export const PLANE_WIDTH = 2.4;
export const PLANE_HEIGHT = (CARD_HEIGHT / CARD_WIDTH) * PLANE_WIDTH;
export const CARD_FONT = "-apple-system, system-ui, 'DM Sans', 'Helvetica Neue', sans-serif";
export const DEFAULT_FOOTER_NOTE = "In-person beats text for anything that matters.";

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 99,
): number {
  let line = "";
  let lines = 0;
  const emit = (str: string) => {
    ctx.fillText(str, x, y);
    y += lineHeight;
    lines++;
  };
  for (let word of text.split(" ")) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      line = candidate;
      continue;
    }
    if (line && (emit(line), (line = ""), lines >= maxLines)) return y;
    while (ctx.measureText(word).width > maxWidth) {
      let cut = 1;
      while (cut < word.length && ctx.measureText(word.slice(0, cut + 1)).width <= maxWidth) cut++;
      emit(word.slice(0, cut));
      if (lines >= maxLines) return y;
      word = word.slice(cut);
    }
    line = word;
  }
  if (line && lines < maxLines) emit(line);
  return y;
}

export function paintCardBack(canvas: HTMLCanvasElement, patternIdx: number, scale: number) {
  canvas.width = CARD_WIDTH * scale;
  canvas.height = CARD_HEIGHT * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 20);
  ctx.clip();
  drawMotifPattern(ctx, patternIdx, 0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.restore();
}

export function paintCardFront(
  canvas: HTMLCanvasElement,
  card: SpiralCardItem,
  footerNote: string,
  scale: number,
) {
  canvas.width = CARD_WIDTH * scale;
  canvas.height = CARD_HEIGHT * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  const patternIdx = card.patternIndex ?? (card.id % MOTIF_THEMES.length);
  const theme = MOTIF_THEMES[patternIdx % MOTIF_THEMES.length];

  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  ctx.beginPath();
  ctx.roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 20);
  ctx.fillStyle = rgb(239, 239, 239);
  ctx.fill();

  const shieldW = 56;
  const shieldH = shieldW * 1.12;
  ctx.save();
  shieldPath(ctx, 16, 24, shieldW, shieldH);
  ctx.shadowColor = theme.glow;
  ctx.shadowBlur = 18;
  ctx.shadowOffsetY = 4;
  ctx.fillStyle = rgb(220, 220, 220);
  ctx.fill();
  ctx.restore();

  ctx.save();
  shieldPath(ctx, 16, 24, shieldW, shieldH);
  ctx.clip();
  drawMotifPattern(ctx, patternIdx, 16, 24, shieldW, shieldH);
  ctx.restore();

  ctx.save();
  ctx.beginPath();
  ctx.roundRect(0, 0, CARD_WIDTH, CARD_HEIGHT, 20);
  ctx.clip();
  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

  let y = 106.72;
  ctx.font = `400 16px ${CARD_FONT}`;
  ctx.fillStyle = rgb(131, 131, 131);
  ctx.fillText(card.house, 16, y);

  ctx.font = `700 33px ${CARD_FONT}`;
  ctx.fillStyle = rgb(12, 12, 14);
  y = wrapText(ctx, card.title, 16, y + 36, CARD_WIDTH - 32, 33 * 0.97, 5);

  ctx.font = `400 16px ${CARD_FONT}`;
  ctx.fillStyle = rgb(70, 70, 70);
  wrapText(ctx, card.body, 16, y + 14, CARD_WIDTH - 32, 16 * 1.24, 4);

  const pillsY = CARD_HEIGHT - 87;
  const durationLabel = card.duration ?? "0:18";
  const moreLabel = `+${card.extraCount ?? 12}`;
  ctx.font = `500 14px ${CARD_FONT}`;
  ctx.textBaseline = "middle";
  let cursor = 16;
  for (let i = 0; i < 3; i++) {
    const pillW = 40 + ctx.measureText(durationLabel).width + 8;
    ctx.beginPath();
    ctx.roundRect(cursor, pillsY, pillW, 40, 20);
    ctx.fillStyle = rgb(255, 255, 255, 0.78);
    ctx.fill();
    drawAvatarDot(ctx, cursor + 20, pillsY + 20, 16, card.id + i);
    ctx.fillStyle = rgb(131, 131, 131);
    ctx.fillText(durationLabel, cursor + 40, pillsY + 21);
    cursor += pillW + 4;
  }
  const moreW = 16 + ctx.measureText(moreLabel).width;
  ctx.beginPath();
  ctx.roundRect(cursor, pillsY, moreW, 40, 20);
  ctx.fillStyle = rgb(255, 255, 255, 0.78);
  ctx.fill();
  ctx.fillStyle = rgb(131, 131, 131);
  ctx.fillText(moreLabel, cursor + 8, pillsY + 21);
  ctx.textBaseline = "alphabetic";

  ctx.fillStyle = rgb(242, 242, 242);
  ctx.fillRect(0, CARD_HEIGHT - 38, CARD_WIDTH, 38);
  ctx.strokeStyle = rgb(0, 0, 0, 0.08);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, CARD_HEIGHT - 38);
  ctx.lineTo(CARD_WIDTH, CARD_HEIGHT - 38);
  ctx.stroke();

  ctx.font = `400 12px ${CARD_FONT}`;
  ctx.fillStyle = rgb(131, 131, 131);
  ctx.textAlign = "center";
  wrapText(ctx, footerNote, CARD_WIDTH / 2, CARD_HEIGHT - 22, CARD_WIDTH - 36, 14, 2);
  ctx.restore();
}

export function buildCardTexturePair(
  cards: SpiralCardItem[],
  footerNote: string,
  scale: number,
  maxAnisotropy: number,
): { fronts: CanvasTexture[]; backs: CanvasTexture[] } {
  const fronts: CanvasTexture[] = [];
  const backs: CanvasTexture[] = [];
  for (let i = 0; i < cards.length; i++) {
    const frontCanvas = document.createElement("canvas");
    const backCanvas = document.createElement("canvas");
    paintCardFront(frontCanvas, cards[i], footerNote, scale);
    paintCardBack(backCanvas, cards[i].patternIndex ?? i, scale);

    const frontTex = new CanvasTexture(frontCanvas);
    frontTex.colorSpace = NoColorSpace;
    frontTex.anisotropy = Math.min(8, maxAnisotropy);
    frontTex.minFilter = LinearMipmapLinearFilter;

    const backTex = new CanvasTexture(backCanvas);
    backTex.colorSpace = NoColorSpace;
    backTex.anisotropy = Math.min(8, maxAnisotropy);

    fronts.push(frontTex);
    backs.push(backTex);
  }
  return { fronts, backs };
}
