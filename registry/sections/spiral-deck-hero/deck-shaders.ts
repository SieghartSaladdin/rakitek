// GLSL shaders for curved 3D deck cards: vertex curl/flip and fragment smear/back.

export const CARD_VERTEX_SHADER = `
uniform float uBend;
uniform float uFlip;
uniform float uCardH;
varying vec2 vUv;

void main() {
  vUv = uv;
  vec3 p = position;
  p.z -= uBend * position.x * position.x;
  p.z -= uBend * 0.35 * position.y * position.y;
  if (uFlip > 0.0001) {
    float yN = position.y / uCardH + 0.5;
    float delay = 0.2;
    float rp = clamp((uFlip - (1.0 - yN) * delay) / (1.0 - delay), 0.0, 1.0);
    float a = rp * 6.2831853;
    float s = sin(a), c = cos(a);
    float nx = p.x * c - p.z * s;
    p.z = p.x * s + p.z * c;
    p.x = nx;
  }
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}
`;

export const CARD_FRAGMENT_SHADER = `
precision highp float;
uniform sampler2D uTex;
uniform sampler2D uBack;
uniform float uSmear;
uniform vec2 uDir;
uniform float uDim;
varying vec2 vUv;

void main() {
  if (!gl_FrontFacing) {
    vec4 b = texture2D(uBack, vUv);
    gl_FragColor = vec4(b.rgb * max(uDim, 0.7), b.a);
    return;
  }
  if (uSmear < 0.0008) {
    vec4 c0 = texture2D(uTex, vUv);
    c0.rgb *= uDim;
    gl_FragColor = c0;
    return;
  }
  vec4 acc = vec4(0.0);
  float total = 0.0;
  for (int i = 0; i < 7; i++) {
    float t = float(i) / 6.0 - 0.5;
    float w = 1.0 - abs(t) * 1.3;
    if (w <= 0.0) continue;
    acc += texture2D(uTex, vUv + uDir * t * uSmear) * w;
    total += w;
  }
  vec4 c = acc / total;
  c.rgb *= uDim;
  gl_FragColor = c;
}
`;
