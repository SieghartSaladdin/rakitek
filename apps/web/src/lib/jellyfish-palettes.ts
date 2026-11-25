export interface TentacleNode {
  x: number;
  y: number;
}

export interface JellyPalette {
  aura: string;
  outlineTop: string;
  outlineRim: string;
  coreLight: string;
  coreMid: string;
  ribDark: string;
  bodyMid: string;
  bodyDark: string;
  bodyEdge: string;
  tentacleCore: string;
  tentacleOuter: string;
}

export interface JellyAgent {
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  surge: number;
  scale: number;
  followsPointer: boolean;
  orbitX: number;
  orbitY: number;
  orbitSpeed: number;
  phase: number;
  tentacles: TentacleNode[][];
  palette: JellyPalette;
}

export const GOLD_PALETTE: JellyPalette = {
  aura: "rgba(229, 184, 105, 0.16)",
  outlineTop: "#fafaf8",
  outlineRim: "#e5b869",
  coreLight: "#fafaf8",
  coreMid: "#e5b869",
  ribDark: "#9c6d2c",
  bodyMid: "#6e4d21",
  bodyDark: "#2e2214",
  bodyEdge: "#433018",
  tentacleCore: "229, 184, 105",
  tentacleOuter: "250, 250, 248",
};

export const CYAN_PALETTE: JellyPalette = {
  aura: "rgba(124, 212, 216, 0.12)",
  outlineTop: "#e6fbfc",
  outlineRim: "#7cd4d8",
  coreLight: "#e6fbfc",
  coreMid: "#7cd4d8",
  ribDark: "#38787d",
  bodyMid: "#225055",
  bodyDark: "#12262a",
  bodyEdge: "#1b3a40",
  tentacleCore: "124, 212, 216",
  tentacleOuter: "226, 248, 250",
};

export const CORAL_PALETTE: JellyPalette = {
  aura: "rgba(217, 120, 85, 0.12)",
  outlineTop: "#fff1e8",
  outlineRim: "#e28862",
  coreLight: "#fff1e8",
  coreMid: "#e28862",
  ribDark: "#8c462e",
  bodyMid: "#5c2e20",
  bodyDark: "#281511",
  bodyEdge: "#3e1f16",
  tentacleCore: "226, 136, 98",
  tentacleOuter: "255, 232, 218",
};

export function makeJelly(
  x: number,
  y: number,
  scale: number,
  tentacleCount: number,
  segments: number,
  followsPointer: boolean,
  orbitX: number,
  orbitY: number,
  orbitSpeed: number,
  phase: number,
  palette: JellyPalette,
): JellyAgent {
  return {
    x,
    y,
    vx: 0,
    vy: 0,
    angle: -Math.PI / 2,
    surge: 0,
    scale,
    followsPointer,
    orbitX,
    orbitY,
    orbitSpeed,
    phase,
    palette,
    tentacles: Array.from({ length: tentacleCount }, () =>
      Array.from({ length: segments }, (_, s) => ({ x, y: y + s * 10 })),
    ),
  };
}
