// Chuyển động: nền 3D (three.js) + hiệu ứng theo chuột + cuộn. app.js gọi fx() sau khi vẽ xong trang.
function fx() {
  const calmFx = false; // Bảo muốn luôn có chuyển động (kể cả khi Windows tắt hiệu ứng)
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches && !calmFx;
  let mx = innerWidth / 2, my = innerHeight / 2, lastY = scrollY, vel = 0;

  // xen kẽ kiểu hiện ra: trượt trái / phóng to / trượt phải
  document.querySelectorAll('.grid4 > .rv, .grid3 > .rv, .steps > .rv, .pol > .rv').forEach((e, i) => e.classList.add(['l', 'z', 'r'][i % 3]));
  document.querySelectorAll('.prow.rv').forEach((e, i) => e.classList.add(i % 2 ? 'r' : 'l'));

  // --- cuộn: thanh tiến độ, header đậm lên, tiêu đề trôi + mờ dần, chữ chạy nghiêng theo tốc độ
  const bar = document.createElement('div'); bar.className = 'sprog'; document.body.append(bar);
  const head = document.querySelector('header'), h1 = document.querySelector('.hero h1, .phero h1'), mq = document.querySelector('.mq');
  const onScroll = () => {
    const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--sp', max > 0 ? y / max : 0);
    head?.classList.toggle('scr', y > 20);
    if (calmFx) return;
    if (h1 && y < innerHeight) { h1.style.transform = `translateY(${y * 0.25}px)`; h1.style.opacity = String(Math.max(0.35, 1 - y / (innerHeight * 1.2))); }
    vel = y - lastY; lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (!calmFx && mq) (function decay() { vel *= 0.9; mq.style.setProperty('--sk', `${Math.max(-12, Math.min(12, vel * 0.4))}deg`); requestAnimationFrame(decay); })();

  // --- nền 3D mọi trang
  if (!calmFx) bg3d(() => [mx / innerWidth - 0.5, my / innerHeight - 0.5]);

  // --- thẻ nghiêng 3D + vệt sáng theo chuột
  if (fine) document.querySelectorAll('.card, .ccard, .game, .prow, .pol > div, .ticket, .step, .ts .glass, .closing li, .author, .try, .hl, details').forEach((el) => {
    el.classList.add('tilt');
    const amp = el.matches('.prow, .ticket, .author, .hl, details') ? 3 : 10;
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      el.style.setProperty('--mx', `${x * 100}%`); el.style.setProperty('--my', `${y * 100}%`);
      el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * amp}deg) rotateY(${(x - 0.5) * amp}deg) translateZ(8px) translateY(-4px)`;
      el.classList.add('hov');
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; el.classList.remove('hov'); });
  });
  if (!fine) return;

  // --- nút hút theo chuột
  document.querySelectorAll('.btn').forEach((b) => {
    b.classList.add('mag');
    b.addEventListener('mousemove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px, ${(e.clientY - r.top - r.height / 2) * 0.35}px)`; });
    b.addEventListener('mouseleave', () => { b.style.transform = ''; });
  });

  // --- con trỏ vòng tròn, chấm sáng, tia lấp lánh, quầng sáng; màn hình LIVE nghiêng theo chuột
  const glow = document.createElement('div'); glow.className = 'mglow';
  const cur = document.createElement('div'); cur.className = 'cur';
  const dot = document.createElement('div'); dot.className = 'cdot';
  document.body.append(glow, cur, dot);
  const stage = document.querySelector('.stage'), chips = [...document.querySelectorAll('#chips .chip')];
  let cx = mx, cy = my, gx = mx, gy = my, sparkT = 0;
  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    const now = performance.now();
    if (now - sparkT > 45) {
      sparkT = now;
      const s = document.createElement('i'); s.className = 'spark';
      s.style.left = `${mx}px`; s.style.top = `${my}px`;
      s.style.setProperty('--x', `${(Math.random() - 0.5) * 40}px`); s.style.setProperty('--y', `${10 + Math.random() * 30}px`);
      document.body.append(s); setTimeout(() => s.remove(), 800);
    }
  }, { passive: true });
  document.addEventListener('mouseover', (e) => { cur.classList.toggle('big', !!e.target.closest('a, button, .ccard, .card, summary, .plan, input')); });
  document.addEventListener('mousedown', () => { cur.style.scale = '0.7'; });
  document.addEventListener('mouseup', () => { cur.style.scale = ''; });
  (function loop() {
    cx += (mx - cx) * 0.18; cy += (my - cy) * 0.18; gx += (mx - gx) * 0.06; gy += (my - gy) * 0.06;
    cur.style.transform = `translate(${cx}px, ${cy}px)`; glow.style.transform = `translate(${gx}px, ${gy}px)`;
    const nx = mx / innerWidth - 0.5, ny = my / innerHeight - 0.5;
    if (stage) stage.style.transform = `perspective(1000px) rotateY(${nx * 12}deg) rotateX(${-ny * 9}deg)`;
    chips.forEach((c, i) => { c.style.translate = `${nx * (18 + i * 10)}px ${ny * (14 + i * 8)}px`; });
    requestAnimationFrame(loop);
  })();
}

// Nền 3D: khối pha lê tím bạc + vòng xoay + hạt sáng; xoay theo chuột, trôi theo cuộn. Nhẹ cho máy yếu.
function bg3d(mouse) {
  const T = window.THREE; if (!T) return;
  const cv = document.createElement('canvas'); cv.className = 'bg3d'; document.body.prepend(cv);
  let r;
  try { r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: false, powerPreference: 'low-power' }); } catch { cv.remove(); return; }
  r.setPixelRatio(1);
  const scene = new T.Scene(), cam = new T.PerspectiveCamera(55, 1, 0.1, 100); cam.position.z = 14;
  scene.add(new T.AmbientLight(0x8b5cf6, 0.6));
  const l1 = new T.PointLight(0xd8b4fe, 1.4, 60); l1.position.set(8, 6, 10); scene.add(l1);
  const l2 = new T.PointLight(0x7c3aed, 1.2, 60); l2.position.set(-10, -6, 6); scene.add(l2);
  const silver = new T.MeshStandardMaterial({ color: 0xd9d6ea, metalness: 0.9, roughness: 0.25, flatShading: true });
  const violet = new T.MeshStandardMaterial({ color: 0x9d5cff, metalness: 0.6, roughness: 0.3, flatShading: true, emissive: 0x2a0a55 });
  const wire = new T.MeshBasicMaterial({ color: 0xc084fc, wireframe: true, transparent: true, opacity: 0.35 });
  const group = new T.Group(); scene.add(group);
  const shapes = [
    [new T.IcosahedronGeometry(1.6, 0), violet, [-7.5, 3.5, -2]],
    [new T.OctahedronGeometry(1.2, 0), silver, [7.8, 2.2, -1]],
    [new T.TorusGeometry(1.5, 0.35, 10, 40), silver, [6.5, -4.5, -3]],
    [new T.DodecahedronGeometry(1.1, 0), violet, [-6.5, -4, -1]],
    [new T.TorusKnotGeometry(0.9, 0.28, 60, 8), violet, [0.5, 6.5, -6]],
    [new T.IcosahedronGeometry(3.2, 1), wire, [9, -1, -8]],
    [new T.OctahedronGeometry(0.7, 0), silver, [-2.5, -6.5, -2]],
  ].map(([g, m, p], i) => { const o = new T.Mesh(g, m); o.position.set(...p); o.userData = { base: p[1], sp: 0.2 + i * 0.07, ph: i * 1.3 }; group.add(o); return o; });
  // hạt sáng
  const N = 500, pos = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) { pos[i * 3] = (Math.random() - 0.5) * 40; pos[i * 3 + 1] = (Math.random() - 0.5) * 40; pos[i * 3 + 2] = -Math.random() * 20; }
  const pg = new T.BufferGeometry(); pg.setAttribute('position', new T.BufferAttribute(pos, 3));
  const stars = new T.Points(pg, new T.PointsMaterial({ color: 0xe9d5ff, size: 0.07, transparent: true, opacity: 0.8 })); scene.add(stars);
  const size = () => { const w = innerWidth, h = innerHeight; r.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); const small = w < 700; group.scale.setScalar(small ? 0.6 : 1); };
  addEventListener('resize', size); size();
  let rx = 0, ry = 0, t0 = performance.now(), run = true;
  document.addEventListener('visibilitychange', () => { run = !document.hidden; if (run) tick(); });
  function tick() {
    if (!run) return;
    const t = (performance.now() - t0) / 1000, [nx, ny] = mouse(), sy = scrollY;
    rx += (ny * 0.5 - rx) * 0.05; ry += (nx * 0.7 - ry) * 0.05;
    group.rotation.x = rx; group.rotation.y = ry + sy * 0.0006;
    group.position.y = sy * 0.004;
    shapes.forEach((o) => { const u = o.userData; o.rotation.x = t * u.sp; o.rotation.y = t * u.sp * 1.3; o.position.y = u.base + Math.sin(t * 0.8 + u.ph) * 0.5; });
    stars.rotation.y = t * 0.02 + nx * 0.2; stars.rotation.x = ny * 0.15; stars.position.y = sy * 0.006;
    r.render(scene, cam);
    requestAnimationFrame(tick);
  }
  tick();
}
