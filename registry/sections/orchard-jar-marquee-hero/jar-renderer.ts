import type * as ThreeNS from "three";

type Three = typeof ThreeNS;

export interface JarMaterial {
  setOffset: (v: number) => void;
  dispose: () => void;
}

export interface JarRenderer {
  createMaterial: (url: string, onLoad: () => void, onError: () => void) => JarMaterial;
  render: (jar: JarMaterial, offset: number) => void;
  blit: (ctx: CanvasRenderingContext2D) => void;
  resize: (canvases: HTMLCanvasElement[]) => void;
  dispose: () => void;
}

export const JAR_RATIO = 630 / 1013;
export const SCALE_MAX = 1.35;
export const FRONT_ROT = 182;

const CYL_TOP = 0.27;
const CYL_BOT = 0.87;
const CYL_WIDTH = 0.885;
const CYL_CURV = 3;
const GAP_LABEL = 0.09;
const LIGHT_INT = 0.58;
const LIGHT_AMB = 0.89;
const LIGHT_X = -1;

const pixelRatioFor = (w: number, h: number, scale = 1, count = 1) => {
  const dpr = Math.min(window.devicePixelRatio || 1, 3);
  const px = w * scale * h * scale * count;
  return px ? Math.max(1, Math.min(dpr, Math.sqrt(12e6 / px))) : dpr;
};

export function createJarWebGLRenderer(THREE: Three, onResizeDone: () => void): JarRenderer {
  const gl = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  gl.outputColorSpace = THREE.SRGBColorSpace;
  const anisotropy = gl.capabilities.getMaxAnisotropy();
  const loader = new THREE.TextureLoader();

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-JAR_RATIO / 2, JAR_RATIO / 2, 0.5, -0.5, 0.01, 10);
  camera.position.z = 5;
  scene.add(new THREE.AmbientLight(0xffffff, LIGHT_AMB));
  const spot = new THREE.SpotLight(0xffffff, LIGHT_INT * 5);
  spot.distance = 6;
  spot.angle = Math.PI / 4;
  spot.penumbra = 0.7;
  spot.decay = 1.2;
  spot.position.set(LIGHT_X, 0.5, 0.6);
  scene.add(spot, spot.target);
  spot.target.position.x = 0;
  spot.target.updateMatrixWorld();

  const mesh = new THREE.Mesh();
  scene.add(mesh);
  const cylHeight = CYL_BOT - CYL_TOP;
  const radius = (CYL_WIDTH * JAR_RATIO) / 2;
  const profile: ThreeNS.Vector2[] = [];
  for (let i = 0; i <= 16; i += 1) {
    profile.push(new THREE.Vector2(radius, (i / 16 - 0.5) * cylHeight));
  }
  mesh.geometry = new THREE.LatheGeometry(profile, 128);
  mesh.position.y = 0.5 - (CYL_TOP + CYL_BOT) / 2;
  mesh.rotation.x = (CYL_CURV * Math.PI) / 180;

  let bufW = 0;
  let bufH = 0;
  const matMap = new WeakMap<JarMaterial, ThreeNS.MeshStandardMaterial>();

  return {
    createMaterial: (url, onLoad, onError) => {
      const uGap = { value: GAP_LABEL };
      const uOffset = { value: FRONT_ROT / 360 };
      const map = loader.load(url, onLoad, undefined, onError);
      map.wrapS = THREE.RepeatWrapping;
      map.wrapT = THREE.ClampToEdgeWrapping;
      map.colorSpace = THREE.SRGBColorSpace;
      map.generateMipmaps = true;
      map.minFilter = THREE.LinearMipmapLinearFilter;
      map.magFilter = THREE.LinearFilter;
      map.anisotropy = anisotropy;

      const material = new THREE.MeshStandardMaterial({
        map,
        side: THREE.FrontSide,
        roughness: 0.72,
        metalness: 0,
      });
      material.onBeforeCompile = (shader) => {
        shader.uniforms.uGap = uGap;
        shader.uniforms.uOffset = uOffset;
        shader.fragmentShader = shader.fragmentShader.replace(
          "#include <common>",
          "#include <common>\nuniform float uGap;\nuniform float uOffset;",
        );
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

      const record: JarMaterial = {
        setOffset: (v) => {
          uOffset.value = v;
        },
        dispose: () => {
          material.dispose();
          map.dispose();
        },
      };
      matMap.set(record, material);
      return record;
    },
    render: (jar, offset) => {
      const mat = matMap.get(jar);
      if (!mat) return;
      jar.setOffset(offset);
      mesh.material = mat;
      gl.render(scene, camera);
    },
    blit: (ctx) => {
      ctx.clearRect(0, 0, bufW, bufH);
      ctx.drawImage(gl.domElement, 0, 0);
    },
    resize: (canvases) => {
      const first = canvases[0];
      const w = first?.offsetWidth ?? 0;
      const h = first?.offsetHeight ?? 0;
      if (!w || !h) return;
      gl.setPixelRatio(pixelRatioFor(w, h, SCALE_MAX, canvases.length));
      gl.setSize(w * SCALE_MAX, h * SCALE_MAX, false);
      bufW = gl.domElement.width;
      bufH = gl.domElement.height;
      for (const c of canvases) {
        c.width = bufW;
        c.height = bufH;
      }
      onResizeDone();
    },
    dispose: () => {
      mesh.geometry?.dispose();
      gl.dispose();
      gl.forceContextLoss?.();
    },
  };
}
