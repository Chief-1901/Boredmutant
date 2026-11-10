// BoredMutant hero scene: loose orders (email, PDF, chat, sheet) fly into one cobalt
// system block and leave as neat, stacked sales orders. Bundled to /js/hero.js by esbuild.
import {
  WebGLRenderer, Scene, PerspectiveCamera, Group, Mesh, PlaneGeometry, MeshStandardMaterial,
  MeshPhysicalMaterial, ShadowMaterial, HemisphereLight, DirectionalLight, CanvasTexture,
  SRGBColorSpace, PCFSoftShadowMap, NeutralToneMapping, PMREMGenerator, Vector3, Color, MathUtils,
} from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

const COBALT = new Color('#1745c0');
const INK = '#16171a', MUTED = '#9a9ca3', RULE = '#e4e5e8', WASH = '#e9eefb';

const LABELS = {
  us: {
    pdf: ['PO-4471.pdf', 'Purchase order'],
    email: ['Re: order for Friday', 'Need 40 more of the'],
    chat: ['WhatsApp', '6 coils pls'],
    sheet: ['reorder.xlsx', 'Item  Qty'],
    order: 'SO-',
  },
  india: {
    pdf: ['Order-118.pdf', 'Purchase order'],
    email: ['Re: dispatch today?', 'Send 20 boxes of'],
    chat: ['WhatsApp', '20 box bhejo'],
    sheet: ['stock.xlsx', 'Item  Qty'],
    order: 'VCH-',
  },
};

// ---------- textures drawn once on canvas ----------
function card(kind, L) {
  const W = 360, H = 460, c = document.createElement('canvas');
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
  const line = (x, y, w, col = RULE, h = 12) => { g.fillStyle = col; roundRect(g, x, y, w, h, h / 2); g.fill(); };
  g.font = '600 26px Geist, system-ui, sans-serif';
  if (kind === 'pdf') {
    g.fillStyle = INK; g.fillText(L.pdf[1], 28, 62);
    g.font = '500 18px Geist, system-ui, sans-serif'; g.fillStyle = MUTED; g.fillText(L.pdf[0], 28, 92);
    g.fillStyle = INK; roundRect(g, W - 92, 36, 64, 30, 6); g.fill();
    g.fillStyle = '#fff'; g.font = '700 15px Geist, system-ui, sans-serif'; g.fillText('PDF', W - 76, 57);
    for (let i = 0; i < 6; i++) { const y = 150 + i * 46; line(28, y, 170 - (i % 3) * 30); line(W - 120, y, 40); line(W - 64, y, 36); g.fillStyle = RULE; g.fillRect(28, y + 30, W - 56, 2); }
  } else if (kind === 'email') {
    g.fillStyle = '#f3f4f6'; g.fillRect(0, 0, W, 108);
    g.fillStyle = INK; g.fillText(L.email[0], 28, 62);
    g.font = '500 18px Geist, system-ui, sans-serif'; g.fillStyle = MUTED; g.fillText('purchasing@customer', 28, 90);
    g.fillStyle = INK; g.font = '400 20px Geist, system-ui, sans-serif'; g.fillText(L.email[1], 28, 160);
    for (let i = 0; i < 7; i++) line(28, 190 + i * 34, W - 56 - (i % 4) * 46);
    g.fillStyle = WASH; roundRect(g, 28, H - 74, 150, 44, 8); g.fill();
    g.fillStyle = COBALT.getStyle(); g.font = '600 16px Geist, system-ui, sans-serif'; g.fillText('attachment', 46, H - 46);
  } else if (kind === 'chat') {
    g.fillStyle = '#f3f4f6'; g.fillRect(0, 0, W, H);
    g.fillStyle = INK; g.fillText(L.chat[0], 28, 58);
    const bubble = (x, y, w, h, me) => { g.fillStyle = me ? '#dfe7fb' : '#ffffff'; roundRect(g, x, y, w, h, 18); g.fill(); };
    bubble(28, 96, 230, 64, false); g.fillStyle = INK; g.font = '500 22px Geist, system-ui, sans-serif'; g.fillText(L.chat[1], 48, 136);
    bubble(110, 182, 222, 54, true); line(132, 203, 150, '#b9c8f1');
    bubble(28, 258, 260, 96, false); line(48, 282, 200); line(48, 310, 150);
    bubble(150, 376, 182, 54, true); line(172, 397, 120, '#b9c8f1');
  } else {
    g.fillStyle = INK; g.fillText(L.sheet[0], 28, 58);
    const x0 = 28, y0 = 90, cw = (W - 56) / 3, rh = 40;
    for (let r = 0; r < 9; r++) for (let k = 0; k < 3; k++) {
      g.strokeStyle = RULE; g.lineWidth = 2; g.strokeRect(x0 + k * cw, y0 + r * rh, cw, rh);
      if (r === 0) { g.fillStyle = '#f3f4f6'; g.fillRect(x0 + k * cw + 1, y0 + 1, cw - 2, rh - 2); }
      else line(x0 + k * cw + 12, y0 + r * rh + 14, cw * (k === 0 ? 0.7 : 0.4));
    }
  }
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t;
}

function orderFace(n, prefix) {
  const W = 520, H = 120, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
  g.fillStyle = COBALT.getStyle(); g.fillRect(0, 0, 14, H);
  g.fillStyle = INK; g.font = '600 34px "Geist Mono", ui-monospace, monospace'; g.fillText(prefix + (20480 + n), 40, 72);
  g.fillStyle = '#e3f3ea'; roundRect(g, W - 150, 34, 116, 52, 26); g.fill();
  g.fillStyle = '#1f7a4a'; g.font = '600 24px Geist, system-ui, sans-serif'; g.fillText('Posted', W - 128, 69);
  const t = new CanvasTexture(c); t.colorSpace = SRGBColorSpace; t.anisotropy = 4; return t;
}

function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const bez = (a, b, c, t, out) => {
  const u = 1 - t;
  out.set(u * u * a.x + 2 * u * t * b.x + t * t * c.x, u * u * a.y + 2 * u * t * b.y + t * t * c.y, u * u * a.z + 2 * u * t * b.z + t * t * c.z);
  return out;
};
// small seeded random so the scene composes the same way every load
let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

export function mount(host, { variant = 'us', still = false } = {}) {
  const L = LABELS[variant] || LABELS.us;
  const small = host.clientWidth < 640;
  const renderer = new WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance', preserveDrawingBuffer: /poster/.test(location.search) });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, small ? 1.5 : 1.75));
  renderer.toneMapping = NeutralToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.shadowMap.enabled = !small; renderer.shadowMap.type = PCFSoftShadowMap;
  // software rasterisers (headless browsers, old GPUs blocklisted to SwiftShader) keep the poster
  try {
    const gl = renderer.getContext(); const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = ext ? String(gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) : '';
    if (/swiftshader|llvmpipe|software|basic render/i.test(name) && !/poster/.test(location.search)) { renderer.dispose(); return; }
  } catch (e) { /* keep going */ }
  host.appendChild(renderer.domElement);

  const scene = new Scene();
  const pmrem = new PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.5;

  const camera = new PerspectiveCamera(30, 1, 0.1, 100);
  const hemi = new HemisphereLight(0xffffff, 0xdfe3ec, 0.9); scene.add(hemi);
  const sun = new DirectionalLight(0xffffff, 1.6);
  sun.position.set(-4, 9, 6); sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024); sun.shadow.radius = 8; sun.shadow.bias = -0.0004;
  Object.assign(sun.shadow.camera, { left: -14, right: 14, top: 12, bottom: -12, near: 1, far: 40 });
  scene.add(sun);

  const world = new Group(); scene.add(world);
  const floor = new Mesh(new PlaneGeometry(40, 40), new ShadowMaterial({ opacity: 0.075 }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = -1.62; floor.receiveShadow = true; world.add(floor);

  // the system block
  const block = new Group(); world.add(block);
  const body = new Mesh(new RoundedBoxGeometry(2.0, 2.35, 2.0, 8, 0.2), new MeshPhysicalMaterial({ color: COBALT, roughness: 0.42, metalness: 0.0, clearcoat: 0.7, clearcoatRoughness: 0.25 }));
  body.castShadow = true; block.add(body);
  const slotMat = new MeshStandardMaterial({ color: 0x0b1a44, roughness: 0.6 });
  const inSlot = new Mesh(new PlaneGeometry(1.1, 0.12), slotMat); inSlot.position.set(-1.001, 0.55, 0); inSlot.rotation.y = -Math.PI / 2; block.add(inSlot);
  const outSlot = new Mesh(new PlaneGeometry(1.4, 0.16), slotMat); outSlot.position.set(1.001, -0.6, 0); outSlot.rotation.y = Math.PI / 2; block.add(outSlot);
  const bandMat = new MeshStandardMaterial({ color: 0xffffff, emissive: new Color('#8fb0ff'), emissiveIntensity: 0.4, roughness: 0.3 });
  const band = new Mesh(new PlaneGeometry(1.3, 0.05), bandMat); band.position.set(0, 0.86, 1.002); block.add(band);
  const ventMat = new MeshStandardMaterial({ color: 0x0f2f86, roughness: 0.7 });
  for (let i = 0; i < 4; i++) { const v = new Mesh(new PlaneGeometry(0.62, 0.028), ventMat); v.position.set(0.42, -0.62 - i * 0.1, 1.002); block.add(v); }
  block.position.set(2.5, -0.44, 0);

  // documents
  const kinds = ['pdf', 'email', 'chat', 'sheet'];
  const tex = Object.fromEntries(kinds.map((k) => [k, card(k, L)]));
  const docGeo = new RoundedBoxGeometry(1.0, 1.28, 0.03, 2, 0.05);
  const docMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.55 });
  const faceGeo = new PlaneGeometry(0.93, 1.2);
  const N = small ? 9 : 14;
  const docs = [];
  const cloudC = new Vector3(1.05, 1.55, -1.0);
  for (let i = 0; i < N; i++) {
    const m = new Group();
    const b = new Mesh(docGeo, docMat); b.castShadow = true; m.add(b);
    const f = new Mesh(faceGeo, new MeshStandardMaterial({ map: tex[kinds[i % 4]], roughness: 0.7 })); f.position.z = 0.017; m.add(f);
    const chaos = new Vector3(cloudC.x + (rnd() - 0.5) * 2.2, cloudC.y + (rnd() - 0.5) * 1.9, cloudC.z + (rnd() - 0.5) * 1.8);
    const col = i % 4, row = Math.floor(i / 4);
    const grid = new Vector3(cloudC.x - 0.95 + col * 0.63, cloudC.y + 0.9 - row * 0.62, cloudC.z - 0.2 + col * 0.2);
    const rot = new Vector3((rnd() - 0.5) * 1.0, (rnd() - 0.5) * 1.4, (rnd() - 0.5) * 0.9);
    const d = { m, chaos, grid, rot, ph: rnd() * Math.PI * 2, state: 'float', t: 0, from: new Vector3(), s: 1 };
    m.position.copy(chaos); m.rotation.set(rot.x, rot.y, rot.z);
    world.add(m); docs.push(d);
  }

  // orders stacking on the right
  const orderGeo = new RoundedBoxGeometry(1.5, 0.13, 1.05, 2, 0.04);
  const orderMat = new MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
  const stackX = 4.55, stackBase = -1.54, step = 0.17, maxStack = 8;
  const orders = [];
  let orderCount = 0;
  const makeOrder = () => {
    const g = new Group();
    const b = new Mesh(orderGeo, orderMat); b.castShadow = true; b.receiveShadow = true; g.add(b);
    const face = new Mesh(new PlaneGeometry(1.3, 0.3), new MeshStandardMaterial({ map: orderFace(orderCount++, L.order), roughness: 0.6 }));
    face.rotation.x = -Math.PI / 2; face.position.y = 0.066; g.add(face);
    world.add(g); return g;
  };
  for (let i = 0; i < 4; i++) { const o = makeOrder(); o.position.set(stackX, stackBase + i * step, 0); o.rotation.y = (rnd() - 0.5) * 0.08; orders.push({ g: o, state: 'rest' }); }

  // ---------- sizing, pointer, scroll ----------
  let W = 1, H = 1;
  const size = () => {
    W = host.clientWidth; H = host.clientHeight;
    renderer.setSize(W, H, false); camera.aspect = W / H;
    const portrait = W / H < 1.1;
    camera.fov = portrait ? 36 : 30; camera.updateProjectionMatrix();
  };
  size();
  const ro = new ResizeObserver(size); ro.observe(host);

  const lean = { x: 0, y: 0, tx: 0, ty: 0 };
  addEventListener('pointermove', (e) => { lean.tx = (e.clientX / innerWidth - 0.5) * 2; lean.ty = (e.clientY / innerHeight - 0.5) * 2; }, { passive: true });
  let sp = 0;
  const hero = host.closest('section') || host;
  const onScroll = () => { const r = hero.getBoundingClientRect(); sp = MathUtils.clamp(-r.top / Math.max(1, r.height), 0, 1); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  // ---------- the loop ----------
  const tmp = new Vector3(), ctrl = new Vector3(), intake = new Vector3(), exitP = new Vector3();
  let last = performance.now(), clock = 0, nextLaunch = 0.6, pulse = 0, running = true, visible = true;

  const launch = () => {
    const free = docs.filter((d) => d.state === 'float');
    if (!free.length) return;
    // pick the doc nearest the block so the flow reads left to right
    free.sort((a, b) => b.m.position.x - a.m.position.x);
    const d = free[Math.floor(rnd() * Math.min(3, free.length))];
    d.state = 'fly'; d.t = 0; d.from.copy(d.m.position);
  };

  const frame = (now) => {
    const dt = Math.min(0.05, (now - last) / 1000); last = now; clock += dt;
    const order = MathUtils.smoothstep(sp, 0.05, 0.6); // scroll turns chaos into rows

    lean.x += (lean.tx - lean.x) * 0.05; lean.y += (lean.ty - lean.y) * 0.05;
    world.rotation.y = -0.16 + lean.x * 0.06 + sp * 0.18;
    world.rotation.x = lean.y * 0.035;
    const narrow = W / H < 1.4;
    world.position.x = narrow ? -2.55 : (variant === 'india' ? 0.4 : 0);
    camera.position.set(0, 3.0 + sp * 0.8, (narrow ? 13.2 : 12.4) - sp * 1.2);
    camera.lookAt(0, 0.1, 0);

    intake.set(block.position.x - 1.15, block.position.y + 0.55, 0);
    exitP.set(block.position.x + 1.2, block.position.y - 0.55, 0);

    for (const d of docs) {
      if (d.state === 'float') {
        const bob = Math.sin(clock * 0.9 + d.ph) * 0.08;
        tmp.lerpVectors(d.chaos, d.grid, order); tmp.y += bob;
        d.m.position.lerp(tmp, 0.06);
        const rx = MathUtils.lerp(d.rot.x, -0.15, order), ry = MathUtils.lerp(d.rot.y, 0.35, order), rz = MathUtils.lerp(d.rot.z, 0, order);
        d.m.rotation.x += (rx + Math.sin(clock * 0.6 + d.ph) * 0.05 - d.m.rotation.x) * 0.06;
        d.m.rotation.y += (ry - d.m.rotation.y) * 0.06;
        d.m.rotation.z += (rz - d.m.rotation.z) * 0.06;
        d.s += (1 - d.s) * 0.08; d.m.scale.setScalar(d.s);
      } else if (d.state === 'fly') {
        d.t += dt / 1.15;
        const k = ease(Math.min(1, d.t));
        ctrl.set((d.from.x + intake.x) / 2, Math.max(d.from.y, intake.y) + 1.1, (d.from.z + intake.z) / 2);
        bez(d.from, ctrl, intake, k, d.m.position);
        d.m.rotation.x += (0 - d.m.rotation.x) * 0.12; d.m.rotation.y += (Math.PI / 2 - d.m.rotation.y) * 0.12; d.m.rotation.z += (0 - d.m.rotation.z) * 0.12;
        d.m.scale.setScalar(MathUtils.lerp(1, 0.55, k));
        if (d.t >= 1) {
          d.state = 'float'; d.s = 0.01; d.m.scale.setScalar(0.01);
          d.m.position.set(cloudC.x + (rnd() - 0.5) * 2, cloudC.y + 3.6, cloudC.z - 1.5);
          pulse = 1; emit();
        }
      }
    }

    for (const o of orders) {
      if (o.state === 'out') {
        o.t += dt / 0.95; const k = ease(Math.min(1, o.t));
        ctrl.set((exitP.x + stackX) / 2 + 0.2, exitP.y + 1.2, 0);
        tmp.set(stackX, o.targetY, 0);
        bez(exitP, ctrl, tmp, k, o.g.position);
        o.g.rotation.z = (1 - k) * -0.5;
        if (o.t >= 1) { o.state = 'rest'; o.g.position.y = o.targetY; o.g.rotation.z = 0; }
      } else if (o.state === 'leave') {
        o.t += dt / 0.6; o.g.position.y += dt * 1.6; o.g.scale.setScalar(Math.max(0.001, 1 - o.t));
        if (o.t >= 1) { world.remove(o.g); o.dead = true; }
      }
    }
    for (let i = orders.length - 1; i >= 0; i--) if (orders[i].dead) orders.splice(i, 1);

    pulse *= 0.92;
    bandMat.emissiveIntensity = 0.4 + pulse * 2.2;
    body.scale.setScalar(1 + pulse * 0.025);

    if (clock > nextLaunch) { launch(); nextLaunch = clock + 1.25 + rnd() * 0.5; }
    renderer.render(scene, camera);
  };

  function emit() {
    const resting = orders.filter((o) => o.state === 'rest');
    if (resting.length >= maxStack) {
      // lift the oldest off the top of the queue to keep the stack readable
      const old = orders.find((o) => o.state === 'rest');
      old.state = 'leave'; old.t = 0;
      orders.filter((o) => o !== old && o.state === 'rest').forEach((o) => { o.g.position.y -= step; });
    }
    const height = orders.filter((o) => o.state === 'rest' || o.state === 'out').length;
    const g = makeOrder(); g.position.copy(exitP);
    orders.push({ g, state: 'out', t: 0, targetY: stackBase + height * step });
  }

  // if the device cannot hold the frame rate, settle on a still frame instead of stuttering
  let slow = 0, frames = 0;
  const loop = (now) => {
    if (!running) return;
    const t0 = performance.now(); frame(now); const cost = performance.now() - t0;
    if (++frames > 30 && cost > 28) slow++; else if (slow > 0) slow -= 0.5;
    if (slow > 45) { running = false; return; }
    requestAnimationFrame(loop);
  };

  if (still) {
    // reduced motion: compose one calm, finished frame
    docs.slice(0, 2).forEach((d, i) => { d.state = 'fly'; d.from.copy(d.chaos); d.t = 0.35 + i * 0.25; });
    for (let i = 0; i < 3; i++) emit();
    orders.forEach((o) => { if (o.state === 'out') { o.state = 'rest'; o.g.position.set(stackX, o.targetY, 0); o.g.rotation.z = 0; } });
    for (let i = 0; i < 40; i++) frame(last + i * 16);
  } else {
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible && !running && !document.hidden) { running = true; last = performance.now(); requestAnimationFrame(loop); }
      if (!visible) running = false;
    });
    io.observe(host);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) running = false;
      else if (visible && !running) { running = true; last = performance.now(); requestAnimationFrame(loop); }
    });
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(() => { host.classList.add('is-live'); window.__heroReady = true; });
}
