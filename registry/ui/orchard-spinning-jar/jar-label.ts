import {
  AmbientLight, ClampToEdgeWrapping, FrontSide, LatheGeometry, LinearFilter, LinearMipmapLinearFilter,
  Mesh, MeshStandardMaterial, OrthographicCamera, RepeatWrapping, Scene, SpotLight, SRGBColorSpace,
  TextureLoader, Vector2, WebGLRenderer,
} from "three";

const ASPECT = 630 / 1013;
const SPIN_DEG = 182;
const CFG = { CYL_TOP: 0.27, CYL_BOT: 0.87, CYL_WIDTH: 0.885, CYL_CURV: 3, GAP_LABEL: 0.09, LIGHT_INT: 0.58, LIGHT_AMB: 0.89, LIGHT_X: -1 };

/** Device pixel ratio capped so the backing store stays under about 12 megapixels. */
const pixelRatio = (w: number, h: number) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const px = w * h;
  return px ? Math.max(1, Math.min(dpr, Math.sqrt(12e6 / px))) : dpr;
};

export interface JarLabel {
  setSpin(progress: number): void;
  destroy(): void;
}

/**
 * A three.js lathe cylinder textured with the label image is rendered offscreen and copied onto the
 * 2D canvas laid over the jar photo. Returns null when WebGL is unavailable so the caller can fall back.
 */
export function createJarLabel(canvas: HTMLCanvasElement, labelUrl: string, onReady?: () => void): JarLabel | null {
  const ctx = canvas.getContext("2d");
  if (!ctx || !labelUrl) return null;
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true });
  } catch {
    return null;
  }
  const baseOffset = SPIN_DEG / 360;
  renderer.outputColorSpace = SRGBColorSpace;
  const scene = new Scene();
  const camera = new OrthographicCamera(-ASPECT / 2, ASPECT / 2, 0.5, -0.5, 0.01, 10);
  camera.position.z = 5;
  scene.add(new AmbientLight(0xffffff, CFG.LIGHT_AMB));
  const spot = new SpotLight(0xffffff, CFG.LIGHT_INT * 5);
  spot.distance = 6;
  spot.angle = Math.PI / 4;
  spot.penumbra = 0.7;
  spot.decay = 1.2;
  spot.position.set(CFG.LIGHT_X, 0.5, 0.6);
  scene.add(spot, spot.target);
  spot.target.position.x = 0;
  spot.target.updateMatrixWorld();

  const height = CFG.CYL_BOT - CFG.CYL_TOP;
  const radius = (CFG.CYL_WIDTH * ASPECT) / 2;
  const profile: Vector2[] = [];
  for (let i = 0; i <= 16; i += 1) profile.push(new Vector2(radius, (i / 16 - 0.5) * height));
  const geometry = new LatheGeometry(profile, 128);

  const uOffset = { value: baseOffset };
  const uGap = { value: CFG.GAP_LABEL };
  let dirty = true;
  let loaded = false;
  let notified = false;
  const markLoaded = () => {
    loaded = true;
    dirty = true;
  };
  const texture = new TextureLoader().load(labelUrl, markLoaded, undefined, markLoaded);
  texture.wrapS = RepeatWrapping;
  texture.wrapT = ClampToEdgeWrapping;
  texture.colorSpace = SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = LinearMipmapLinearFilter;
  texture.magFilter = LinearFilter;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const material = new MeshStandardMaterial({ map: texture, side: FrontSide, roughness: 0.72, metalness: 0 });
  material.onBeforeCompile = (shader) => {
    shader.uniforms.uGap = uGap;
    shader.uniforms.uOffset = uOffset;
    shader.fragmentShader = shader.fragmentShader.replace("#include <common>", "#include <common>\nuniform float uGap;\nuniform float uOffset;");
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <map_fragment>",
      `#ifdef USE_MAP
        float _u = fract(vMapUv.x + uOffset);
        if (_u >= 1.0 - uGap) discard;
        float _r = _u / max(1.0 - uGap, 0.001);
        vec4 sampledDiffuseColor = texture2D(map, vec2(_r, vMapUv.y));
        diffuseColor *= sampledDiffuseColor;
      #endif`,
    );
  };
  const mesh = new Mesh(geometry, material);
  mesh.position.y = 0.5 - (CFG.CYL_TOP + CFG.CYL_BOT) / 2;
  mesh.rotation.x = (CFG.CYL_CURV * Math.PI) / 180;
  scene.add(mesh);

  let pw = 0;
  let ph = 0;
  const resize = () => {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setPixelRatio(pixelRatio(w, h));
    renderer.setSize(w, h, false);
    pw = renderer.domElement.width;
    ph = renderer.domElement.height;
    canvas.width = pw;
    canvas.height = ph;
    dirty = true;
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  let spin = 0;
  let lastOffset = Number.NaN;
  let alive = true;
  let raf = 0;
  const frame = () => {
    if (!alive) return;
    const offset = baseOffset - spin;
    if (dirty || offset !== lastOffset) {
      uOffset.value = offset;
      renderer.render(scene, camera);
      ctx.clearRect(0, 0, pw, ph);
      ctx.drawImage(renderer.domElement, 0, 0);
      lastOffset = offset;
      dirty = false;
      if (loaded && !notified) {
        notified = true;
        onReady?.();
      }
    }
    raf = requestAnimationFrame(frame);
  };
  raf = requestAnimationFrame(frame);

  return {
    setSpin(progress) {
      spin = Math.max(0, Math.min(1, progress));
    },
    destroy() {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      texture.dispose();
      renderer.dispose();
      renderer.forceContextLoss?.();
    },
  };
}
