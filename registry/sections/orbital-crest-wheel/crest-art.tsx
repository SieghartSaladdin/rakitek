"use client";

import { useId } from "react";

const SHIELD_PATH =
  "M0 2C0 0.895429 0.895431 0 2 0H72C73.1046 0 74 0.89543 74 2V56.2815C74 61.3452 70.5431 65.7548 65.6257 66.9635L39.6257 73.3546C37.9009 73.7785 36.0991 73.7785 34.3743 73.3546L8.37425 66.9635C3.45689 65.7548 0 61.3452 0 56.2815V2Z";

const INK = "var(--rk-bg)";
const PAPER = "var(--rk-fg)";
const ACCENT = "var(--rk-accent)";
const UMBER = "color-mix(in srgb, var(--rk-bg) 74%, var(--rk-accent))";
const BRONZE = "color-mix(in srgb, var(--rk-bg) 56%, var(--rk-accent))";
const GOLD_LIGHT = "color-mix(in srgb, var(--rk-accent) 88%, var(--rk-fg))";
const PARCHMENT = "color-mix(in srgb, var(--rk-accent) 26%, var(--rk-fg))";
const SKY_MIST = "color-mix(in srgb, var(--rk-fg-muted) 28%, var(--rk-fg))";
const SLATE_INK = "color-mix(in srgb, var(--rk-bg) 86%, var(--rk-fg-muted))";

function renderBattlementMotif() {
  const rows = [0, 1, 2, 3];
  const cols = [0, 1, 2];
  return (
    <g>
      <rect width="74" height="74" fill={ACCENT} />
      {rows.map((row) =>
        cols.map((col) => {
          const offsetX = row % 2 === 1 ? 12.3 : 0;
          const x = col * 24.6 + offsetX - 4;
          const y = row * 18.5;
          return (
            <path
              key={`${row}-${col}`}
              d={`M${x} ${y}h14v6h-4v12.5h-6V${y + 6}h-4Z`}
              fill={INK}
            />
          );
        }),
      )}
    </g>
  );
}

function renderScallopMotif() {
  const bands = [0, 1, 2, 3, 4];
  const cols = [0, 1, 2, 3];
  return (
    <g>
      <rect width="74" height="74" fill={BRONZE} />
      {bands.map((row) =>
        cols.map((col) => {
          const isGold = (row + col) % 2 === 0;
          const x = col * 18.5;
          const y = row * 14.8;
          return (
            <path
              key={`${row}-${col}`}
              d={`M${x} ${y + 3} Q${x + 4.6} ${y - 1.5} ${x + 9.25} ${y + 3} Q${x + 13.9} ${y - 1.5} ${x + 18.5} ${y + 3} V${y + 15.2} H${x} Z`}
              fill={isGold ? GOLD_LIGHT : BRONZE}
            />
          );
        }),
      )}
    </g>
  );
}

function renderCrownTreeMotif() {
  const petals: Array<[number, number]> = [
    [37, 13],
    [47.5, 19],
    [47.5, 31],
    [37, 37],
    [26.5, 31],
    [26.5, 19],
  ];
  const barDots = [11, 24, 37, 50, 63];
  return (
    <g>
      <rect width="74" height="74" fill={PARCHMENT} />
      <rect x="0" y="50" width="74" height="24" fill={UMBER} />
      <polygon points="32,52 42,52 39.5,35 34.5,35" fill={UMBER} />
      <circle cx="37" cy="25" r="10" fill={UMBER} />
      {petals.map(([cx, cy], idx) => (
        <circle key={`p-${idx}`} cx={cx} cy={cy} r="7.2" fill={UMBER} />
      ))}
      <circle cx="37" cy="25" r="3.4" fill={PARCHMENT} />
      {petals.map(([cx, cy], idx) => (
        <circle key={`h-${idx}`} cx={cx} cy={cy} r="3.2" fill={PARCHMENT} />
      ))}
      {barDots.map((cx, idx) => (
        <circle key={`d-${idx}`} cx={cx} cy="59" r="3.8" fill={PARCHMENT} />
      ))}
    </g>
  );
}

function renderTriKeyMotif() {
  return (
    <g>
      <rect width="74" height="74" fill={UMBER} />
      <rect x="0" y="0" width="24.7" height="11" fill={ACCENT} />
      <rect x="49.3" y="0" width="24.7" height="11" fill={ACCENT} />
      <rect x="24.7" y="11" width="24.6" height="50" fill={ACCENT} />
      <rect x="0" y="61" width="24.7" height="13" fill={ACCENT} />
      <rect x="49.3" y="61" width="24.7" height="13" fill={ACCENT} />
      {[12.3, 61.7].map((cx, idx) => (
        <g key={`k-${idx}`} fill={ACCENT}>
          <polygon points={`${cx},15 ${cx + 7.5},23.5 ${cx},32 ${cx - 7.5},23.5`} />
          <polygon points={`${cx},19.8 ${cx + 3},23.5 ${cx},27.2 ${cx - 3},23.5`} fill={UMBER} />
          <rect x={cx - 2.3} y="30" width="4.6" height="25" />
          <rect x={cx - 6} y="35" width="12" height="3.2" />
          <rect x={cx - 6} y="41.5" width="12" height="3.2" />
          <rect x={cx - 2.3} y="51" width="7.2" height="4" />
        </g>
      ))}
      <g fill={UMBER}>
        <polygon points="37,56 44.5,47.5 37,39 29.5,47.5" />
        <polygon points="37,51.2 40,47.5 37,43.8 34,47.5" fill={ACCENT} />
        <rect x="34.7" y="16" width="4.6" height="25" />
        <rect x="31" y="25.5" width="12" height="3.2" />
        <rect x="31" y="32" width="12" height="3.2" />
        <rect x="31" y="16" width="8.3" height="4.2" />
      </g>
    </g>
  );
}

function renderVesselMotif() {
  return (
    <g>
      <rect width="74" height="74" fill={SKY_MIST} />
      <path d="M31 18 A13 13 0 0 1 44 5 V18 Z" fill={SLATE_INK} />
      <path d="M18 31 A13 13 0 0 1 31 18 V31 Z" fill={SLATE_INK} />
      <path d="M31 31 A13 13 0 0 1 44 18 V31 Z" fill={SLATE_INK} />
      <path d="M45 31 A13 13 0 0 1 58 18 V31 Z" fill={SLATE_INK} />
      <path d="M14 35 H60 C58.5 44.5 50 49.5 37 49.5 C24 49.5 15.5 44.5 14 35 Z" fill={SLATE_INK} />
      <path
        d="M-4 50 Q8 56 20 50 T44 50 T68 50 T84 50 V58 Q68 64 56 58 T32 58 T8 58 T-4 58 Z"
        fill={SLATE_INK}
      />
      <path
        d="M-4 62 Q8 68 20 62 T44 62 T68 62 T84 62 V74 H-4 Z"
        fill={SLATE_INK}
      />
      <path
        d="M-4 58 Q8 64 20 58 T44 58 T68 58 T84 58 V63 Q68 69 56 63 T32 63 T8 63 T-4 63 Z"
        fill={PAPER}
        opacity="0.22"
      />
    </g>
  );
}

export interface CrestArtProps {
  motifIndex: number;
  className?: string;
}

export function CrestArt({ motifIndex, className }: CrestArtProps) {
  const rawId = useId();
  const clipId = `rk-crest-${rawId.replaceAll(":", "")}`;
  const variant = ((motifIndex % 5) + 5) % 5;

  return (
    <svg
      className={className}
      viewBox="0 0 74 74"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <defs>
        <clipPath id={clipId}>
          <path d={SHIELD_PATH} />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        {variant === 0 && renderBattlementMotif()}
        {variant === 1 && renderScallopMotif()}
        {variant === 2 && renderCrownTreeMotif()}
        {variant === 3 && renderTriKeyMotif()}
        {variant === 4 && renderVesselMotif()}
      </g>
    </svg>
  );
}
