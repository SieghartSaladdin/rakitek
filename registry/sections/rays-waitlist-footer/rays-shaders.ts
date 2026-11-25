import * as THREE from "three";

export const RAY_STEPS = 44;
export const MARK_ASPECT = 26.6 / 25;
export const MARK_TEX_W = 256;
export const MARK_TEX_H = Math.round(256 / MARK_ASPECT);
export const MARK_TEX_PAD = 20;

export const MARK_OUTER_PATH =
  "M13.3 1.2L24.2 12.5L13.3 23.8L2.4 12.5L13.3 1.2ZM13.3 5.9L19.5 12.5L13.3 19.1L7.1 12.5L13.3 5.9Z";
export const MARK_INNER_PATH = "M13.3 9.2L16.4 12.5L13.3 15.8L10.2 12.5Z";

export const RAYS_VERTEX_SHADER = `
void main() {
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const RAYS_FRAGMENT_SHADER = `
precision highp float;
uniform vec2 uRes;
uniform vec2 uLight;
uniform vec2 uTileC;
uniform vec2 uTileH;
uniform float uTileR;
uniform vec2 uMarkH;
uniform sampler2D uMark;
uniform float uSpread;
uniform float uIntensity;
uniform vec3 uTint;

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float emit(vec2 q) {
  float d = sdRoundBox(q - uTileC, uTileH, uTileR);
  float inside = 1.0 - smoothstep(-1.0, 1.0, d);
  vec2 uv = (q - uTileC) / (2.0 * uMarkH) + 0.5;
  float inBox = step(0.0, uv.x) * step(uv.x, 1.0) * step(0.0, uv.y) * step(uv.y, 1.0);
  float m = texture2D(uMark, uv).a * inBox;
  return inside * (1.0 - m);
}

void main() {
  vec2 p = vec2(gl_FragCoord.x, uRes.y - gl_FragCoord.y);
  vec2 toL = uLight - p;
  vec2 stepv = toL / float(${RAY_STEPS});
  vec2 q = p + stepv * hash(p);
  float sum = 0.0;
  for (int i = 0; i < ${RAY_STEPS}; i++) {
    sum += emit(q);
    q += stepv;
  }
  float ray = sum / float(${RAY_STEPS});
  float dEdge = max(0.0, sdRoundBox(p - uTileC, uTileH, uTileR));
  float fall = exp(-dEdge / uSpread);
  float I = ray * fall * uIntensity;
  vec3 col = min(uTint * I, vec3(1.0));
  float a = max(col.r, max(col.g, col.b));
  gl_FragColor = vec4(col, a);
}
`;

export function createMarkTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = MARK_TEX_W + MARK_TEX_PAD * 2;
  canvas.height = MARK_TEX_H + MARK_TEX_PAD * 2;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.save();
    ctx.filter = "blur(2.5px)";
    ctx.translate(MARK_TEX_PAD, MARK_TEX_PAD);
    ctx.scale(MARK_TEX_W / 26.6, MARK_TEX_H / 25);
    ctx.fillStyle = "white";
    ctx.fill(new Path2D(MARK_OUTER_PATH), "evenodd");
    ctx.fill(new Path2D(MARK_INNER_PATH));
    ctx.beginPath();
    ctx.arc(4.8, 4.4, 1.7, 0, Math.PI * 2);
    ctx.arc(21.8, 20.6, 1.7, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.flipY = false;
  tex.minFilter = THREE.LinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.needsUpdate = true;
  return tex;
}

export function readAccentTint(el: HTMLElement): THREE.Vector3 {
  const accent = getComputedStyle(el).getPropertyValue("--rk-accent").trim();
  const color = new THREE.Color();
  try {
    if (accent) color.set(accent);
    else color.setRGB(1, 0.88, 0.98);
  } catch {
    color.setRGB(1, 0.88, 0.98);
  }
  color.lerp(new THREE.Color(1, 1, 1), 0.45);
  return new THREE.Vector3(color.r, color.g, color.b);
}
