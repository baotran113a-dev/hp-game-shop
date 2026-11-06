// Dùng chung cho mọi trang: đọc site.json + games.json, vẽ đầu/cuối trang, rồi vẽ phần riêng của từng trang (body data-page)
const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<em class="g">$1</em>').replace(/\n/g, '<br>');
const money = (n) => n ? `${n.toLocaleString('vi-VN')}đ` : 'Liên hệ';
const get = (o, path) => path.split('.').reduce((a, k) => a?.[k], o);
const params = new URLSearchParams(location.search);
const PAGE = document.body.dataset.page;
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
let BOTTOM = '', SITE = {}, DATA = { shop: {}, games: [] }, DRAFT = null, ZALO = '#lien-he', cur = null, plan = null;
const img = (src) => DRAFT?.images?.[src] || src; // ảnh vừa tải lên trong admin (xem trước)
const link = (href) => (DRAFT && /\.html$/.test(href || '') ? `${href}?preview=1` : href);
const two = (i) => String(i + 1).padStart(2, '0');

async function getJson(name) { return (await fetch(name, { cache: 'no-cache' })).json(); }
async function boot() {
  if (params.has('preview')) try { DRAFT = JSON.parse(localStorage.getItem('bs-draft') || 'null'); } catch {}
  [SITE, DATA] = DRAFT ? [DRAFT.site, DRAFT.games] : await Promise.all([getJson('site.json'), getJson('games.json')]);
  if (DRAFT) document.body.insertAdjacentHTML('beforeend', '<div class="pv">👁 Bản xem trước — chưa đăng</div>');
  shell();
  const run = PAGES[PAGE] || (() => {});
  run.call(null, SITE[PAGE] || {}, true); document.body.insertAdjacentHTML('beforeend', BOTTOM); if (run.after) run.after();
  document.querySelectorAll('[data-t]').forEach((el) => { el.textContent = get(SITE, el.dataset.t) ?? ''; });
  document.querySelectorAll('[data-h]').forEach((el) => { el.innerHTML = rich(get(SITE, el.dataset.h)); });
  document.querySelectorAll('.zalo').forEach((a) => { a.href = ZALO; a.target = '_blank'; });
  reveal();
}

// ---------- Đầu trang, khung liên hệ, chân trang ----------
function shell() {
  const S = SITE, s = DATA.shop || {}, P = S[PAGE] || {};
  document.title = P.seoTitle || S.brand || document.title;
  const md = document.querySelector('meta[name=description]'); if (md) md.content = S.seoDescription || '';
  ZALO = s.zalo ? `https://zalo.me/${s.zalo.replace(/\D/g, '')}` : '#lien-he';
  const here = location.pathname.split('/').pop() || 'index.html';
  document.body.insertAdjacentHTML('afterbegin', `<div class="bgfx"></div><div class="glow a"></div><div class="glow b"></div>
  <header><div class="wrap">
    <a class="logo" href="${link('index.html')}"><img src="${esc(img(S.logo || 'img/logo.webp'))}" alt="${esc(S.brand)}"></a>
    <nav id="nav">${(S.nav || []).map((n) => `<a href="${esc(link(n.href))}" class="${n.href === here ? 'on' : ''}">${esc(n.label)}</a>`).join('')}</nav>
    <a class="btn pri sm zalo" href="#">${esc(S.navCta || 'Zalo')}</a>
    <button class="menuBtn" aria-label="Menu" onclick="document.getElementById('nav').classList.toggle('open')">☰</button>
  </div></header>`);
  const C = S.contact || {}, so = S.social || {};
  const soc = `<div class="soc">${so.facebook ? `<a href="${esc(so.facebook)}" target="_blank" rel="noopener">📘 Fanpage</a>` : ''}${so.tiktok ? `<a href="${esc(so.tiktok)}" target="_blank" rel="noopener">🎵 TikTok</a>` : ''}<a class="zalo" href="#">💬 Zalo</a></div>`;
  BOTTOM = `
  <section id="lien-he"><div class="wrap"><div class="final glass rv">
    <img class="flogo" src="${esc(img(S.logo || 'img/logo.webp'))}" alt="${esc(S.brand)}">
    <span class="eyebrow">${esc(C.tag)}</span><h2>${rich(C.title)}</h2>
    <p class="sub" style="margin:0 auto 24px">${esc(C.text)}</p>
    <a class="btn pri zalo" href="#">${esc(C.btn)}</a>
    <p style="color:var(--mut);margin:14px 0 0;font-size:14px">${s.zalo ? `Zalo: ${esc(s.zalo.replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d+)/, '$1 $2 $3'))}` : ''}</p>
  </div></div></section>
  <footer><div class="wrap"><span>© ${new Date().getFullYear()} ${esc(S.footer)}</span>${soc}<span>${esc(S.footerNote)}</span></div></footer>
  <div class="toast" id="toast"></div><div class="lb" id="lb" onclick="this.classList.remove('on')"><img alt=""></div>`;
}
function pageHero(P, btns = '') {
  return `<div class="phero"><div class="wrap rv"><span class="eyebrow">${esc(P.tag)}</span><h1>${rich(P.title)}</h1><p class="lead">${esc(P.text)}</p>${btns}</div></div>`;
}
const cards = (arr, no) => (arr || []).map((p, i) => `<div class="card glass rv">${no ? `<span class="no">${two(i)}</span>` : ''}<div class="ic">${esc(p.icon)}</div><b>${esc(p.title)}</b><p>${esc(p.text)}</p></div>`).join('');
const timeline = (arr, label = 'BƯỚC') => `<div class="tl"><div class="rail"><i></i></div>${(arr || []).map((p, i) => `<div class="ts rv"><div class="dot">${esc(p.icon || i + 1)}</div><div class="glass">${p.icon ? '' : ''}<small>${label} ${two(i)}</small><b>${esc(p.title)}</b><p>${esc(p.text)}</p></div></div>`).join('')}</div>`;
const steps = (arr) => `<div class="steps">${(arr || []).map((p) => `<div class="step glass rv"><b>${esc(p.title)}</b><p>${esc(p.text)}</p></div>`).join('')}</div>`;
const creatorChip = (c) => `<a class="cav" href="https://www.tiktok.com/@${encodeURIComponent(c.id)}" target="_blank" rel="noopener"><img src="${esc(img(c.image || 'img/logo.webp'))}" alt="" loading="lazy">@${esc(c.id)}</a>`;
const main = (html) => document.body.insertAdjacentHTML('beforeend', `<main>${html}</main>`);

// ---------- Từng trang ----------
const PAGES = {
  home(H) {
    const list = SITE.idol?.list || [];
    const half = Math.ceil(Math.min(list.length, 40) / 2), r1 = list.slice(0, half), r2 = list.slice(half, half * 2);
    main(`
    <div class="hero"><div class="wrap">
      <div class="rv">
        <span class="eyebrow">${esc(H.hero?.tag)}</span><h1>${rich(H.hero?.title)}</h1><p class="lead">${esc(H.hero?.text)}</p>
        <div class="cta"><a class="btn pri zalo" href="#">${esc(H.hero?.btn1)}</a><a class="btn ghost" href="${link('quyen-loi.html')}">${esc(H.hero?.btn2)}</a></div>
        <div class="try glass"><small>${esc(H.nameTry?.label)}</small>
          <div class="f"><label class="in"><b>@</b><input id="liveName" maxlength="24" autocomplete="off" placeholder="${esc(H.nameTry?.placeholder)}"></label><button class="btn pri sm" id="keepName">${esc(H.nameTry?.btn)}</button></div></div>
      </div>
      <div class="stage rv"><div id="chips">${(H.hero?.chips || []).map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>
        <div class="screen" id="screen"><img src="${esc(img(H.hero?.image || 'img/idol.jpg'))}" alt="Idol TikTok LIVE">
          <div class="ov top"><span class="who"><i></i><span id="who"></span></span><span class="live">LIVE</span><span class="eye">👁 <span id="eye"></span></span></div>
          <div class="ov bot" id="cms"></div></div></div>
    </div></div>
    <div class="wrap"><div class="hl glass rv">${(H.highlights || []).map((h) => `<div><div class="big">${esc(h.big)}</div><small>${esc(h.small)}</small></div>`).join('')}</div></div>
    <div class="mq" aria-hidden="true"><div class="t">${((H.marquee || []).map((w) => `<span>${esc(w)}</span>`).join('')).repeat(2)}</div></div>
    ${list.length ? `<section><div class="wrap" style="text-align:center"><h2 class="rv">${esc(H.creatorsTitle)}</h2><p class="sub rv" style="margin-inline:auto">${esc(H.creatorsSub)}</p></div>
      <div class="cstrip"><div class="t">${(r1.map(creatorChip).join('')).repeat(2)}</div></div>
      <div class="cstrip r" style="margin-top:12px"><div class="t">${(r2.map(creatorChip).join('')).repeat(2)}</div></div>
      <div class="cta c rv"><a class="btn ghost" href="${link('idol.html')}#creator">${esc(H.creatorsBtn)} (${list.length})</a></div></section>` : ''}
    <section style="padding-top:10px"><div class="wrap"><div class="ticket rv"><div class="stub">${esc(H.free?.badge)}</div>
      <div class="mid"><h3>${esc(H.free?.title)}</h3><p>${esc(H.free?.text)}</p></div><div class="go"><a class="btn pri zalo" href="#">${esc(H.free?.btn)}</a></div></div></div></section>
    <section><div class="wrap"><h2 class="rv">${esc(H.exploreTitle)}</h2><p class="sub rv">${esc(H.exploreSub)}</p>
      <div class="grid4">${(H.explore || []).map((e) => `<a class="card glass rv" style="text-decoration:none" href="${esc(link(e.href))}"><div class="ic">${esc(e.icon)}</div><b>${esc(e.title)} →</b><p>${esc(e.text)}</p></a>`).join('')}</div></div></section>`);
    liveScreen(H.live || {});
  },
  perks(P) {
    main(`${pageHero(P, `<div class="toc rv">${(P.items || []).map((it, i) => `<a href="#q${i + 1}">${two(i)} · ${esc(it.title)}</a>`).join('')}</div>`)}
    <section style="padding-top:24px"><div class="wrap">${(P.items || []).map((it, i) => `
      <div class="prow glass rv" id="q${i + 1}"><div class="n">${two(i)}</div><div><small>${esc(it.kicker)}</small><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p>
        <ul>${(it.bullets || []).map((b) => `<li>${esc(b)}</li>`).join('')}</ul>${it.link ? `<a class="btn ghost sm go" href="${esc(link(it.link))}">${esc(it.linkText || 'Xem thêm')} →</a>` : ''}</div></div>`).join('')}
    </div></section>
    <section style="padding-top:0"><div class="wrap closing"><h2 class="rv">${esc(P.closingTitle)}</h2><ul style="margin-top:20px">${(P.closing || []).map((c) => `<li class="rv"><b>${esc(c.title)}</b><span>${esc(c.text)}</span></li>`).join('')}</ul></div></section>`);
  },
  idol(P) {
    const list = P.list || [], types = [...new Set(list.map((c) => c.type).filter(Boolean))];
    main(`${pageHero(P, `<div class="cta"><a class="btn pri zalo" href="#">${esc(P.btn1)}</a><a class="btn ghost" href="#creator">${esc(P.btn2)}</a></div>`)}
    <section style="padding-top:30px"><div class="wrap"><h2 class="rv">${esc(P.policyTitle)}</h2>
      <div class="pol" style="margin-top:20px">${(P.policy || []).map((p) => `<div class="glass rv"><small>${esc(p.label)}</small><b>${esc(p.value)}</b></div>`).join('')}</div></div></section>
    <section><div class="wrap"><h2 class="rv">${esc(P.formatsTitle)}</h2><p class="sub rv">${esc(P.formatsSub)}</p><div class="grid4">${cards(P.formats)}</div></div></section>
    <section><div class="wrap split"><div class="rv"><h2>${esc(P.npcTitle)}</h2><p class="sub">${esc(P.npcText)}</p></div>
      <div class="grid3" style="grid-template-columns:1fr 1fr">${(P.npcPoints || []).map((p, i) => `<div class="card glass rv"><span class="no">${two(i)}</span><b>${esc(p.title)}</b><p>${esc(p.text)}</p></div>`).join('')}</div></div></section>
    <section id="creator"><div class="wrap"><h2 class="rv">${esc(P.creatorsTitle)}</h2><p class="sub rv">${esc(P.creatorsSub)}</p>
      <div class="tools rv"><button class="fchip on" data-f="">${esc(P.filterAll || 'Tất cả')}</button>${types.map((t) => `<button class="fchip" data-f="${esc(t)}">${esc(t)}</button>`).join('')}
        <input class="search" id="q" placeholder="${esc(P.searchPlaceholder)}"><span class="count" id="cnt"></span></div>
      <div class="cgrid" id="cgrid"></div></div></section>`);
    let f = '';
    const draw = () => {
      const q = $('q').value.trim().toLowerCase().replace(/^@/, '');
      const sh = list.filter((c) => (!f || c.type === f) && (!q || c.id.toLowerCase().includes(q)));
      $('cgrid').innerHTML = sh.map((c) => `<a class="ccard glass" href="https://www.tiktok.com/@${encodeURIComponent(c.id)}" target="_blank" rel="noopener"><div class="av"><img src="${esc(img(c.image || 'img/logo.webp'))}" alt="" loading="lazy">${c.type ? `<i>${esc(c.type)}</i>` : ''}</div><b>@${esc(c.id)}</b><small>Xem TikTok ↗</small></a>`).join('');
      $('cnt').textContent = `${sh.length} creator`;
    };
    document.querySelectorAll('.fchip').forEach((b) => b.onclick = () => { f = b.dataset.f; document.querySelectorAll('.fchip').forEach((x) => x.classList.toggle('on', x === b)); draw(); });
    $('q').oninput = draw; draw();
  },
  training(P) {
    main(`${pageHero(P, `<div class="cta"><a class="btn pri zalo" href="#">💬 ${esc(SITE.navCta || 'Ứng tuyển')}</a></div>`)}
    <section id="hanh-trinh"><div class="wrap"><div style="text-align:center"><h2 class="rv">${esc(P.daysTitle)}</h2></div>${timeline(P.days, 'NGÀY')}</div></section>
    <section><div class="wrap"><h2 class="rv">${esc(P.applyTitle)}</h2>${steps(P.apply)}
      <div class="req glass rv"><h3>${esc(P.reqTitle)}</h3><ul>${(P.requirements || []).map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div></div></section>`);
    railFx();
  },
  game(P) {
    const a = P.author || {};
    main(`${pageHero(P)}
    <section style="padding-top:30px"><div class="wrap"><div class="games" id="gameList">${(DATA.games || []).map((g) => `
      <div class="game glass rv"><div class="shots">${(g.images || [g.image]).filter(Boolean).map((src) => `<img src="${esc(img(src))}" alt="${esc(g.name)}" loading="lazy" onclick="zoom(this.src)">`).join('')}</div>
        <div class="body"><h3>${esc(g.name)}</h3><p class="tl2">${esc(g.tagline)}</p><ul>${(g.features || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
          <div class="price">${(g.plans || []).map((p) => `<div>${esc(p.label)} · <b>${money(p.price)}</b></div>`).join('')}</div>
          <div class="act"><a class="btn ghost sm" ${g.download ? `href="${esc(g.download)}"` : 'href="#lien-he"'}>⬇ Tải bản dùng thử${g.version ? ` v${esc(g.version)}` : ''}</a><button class="btn pri sm" onclick="openBuy('${esc(g.id)}')">🛒 Mua / gia hạn</button></div></div></div>`).join('')}
      <div class="game glass soon rv">🎮 Game mới đang làm…<br>Nhắn Zalo để được báo khi ra mắt.</div></div>
      <h3 class="rv" style="font-size:22px;margin:42px 0 16px">${esc(P.buyTitle)}</h3>${steps(P.buySteps)}</div></section>
    <section style="padding-top:10px"><div class="wrap"><div class="author glass rv">
      <div class="avatar">${a.image ? `<img src="${esc(img(a.image))}" alt="${esc(a.name)}">` : esc((a.name || '?').trim().split(/\s+/).pop()[0])}</div>
      <div><small>${esc(a.label)}</small><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div><a class="btn ghost zalo" href="#">💬 Zalo</a></div></div></section>
    <div class="modal" id="buy" onclick="if(event.target===this)closeBuy()"><div class="box">
      <button class="x" onclick="closeBuy()" aria-label="Đóng">×</button><h3 id="buyTitle">Mua / gia hạn</h3>
      <p style="color:var(--mut);margin:0">Dán mã máy, chọn gói, quét QR rồi nhắn Zalo để nhận mã.</p>
      <label>1. Mã máy <small>(trong app, ô "Mã máy")</small></label><input id="machine" placeholder="ABCDE-FGH23" maxlength="11" oninput="drawQr()">
      <label>2. Chọn gói</label><div class="plans" id="plans"></div>
      <label>3. Quét QR chuyển khoản</label><div id="qrBox"></div>
      <label>4. Nhắn Zalo để nhận mã</label><p style="margin:0 0 8px;color:var(--mut);font-size:14px">Gửi ảnh chụp chuyển khoản kèm tin nhắn bên dưới:</p>
      <div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn ghost sm" onclick="copyMsg()">📋 Chép tin nhắn</button><a class="btn pri sm zalo" href="#">💬 Mở Zalo</a></div>
      <p id="msgPrev" style="font-size:14px;color:var(--mut)"></p></div></div>`);
    // Mở từ app (nút "Mua / gia hạn") thì có sẵn game + mã máy
    if (params.get('game')) openBuy(params.get('game'), params.get('may'));
  },
  faq(P) {
    main(`${pageHero(P)}<section style="padding-top:24px"><div class="wrap" style="max-width:860px">${(P.items || []).map((f) => `<details class="glass rv"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);
  },
};

// ---------- Hiệu ứng ----------
function liveScreen(L) {
  const name = () => '@' + ($('liveName').value.trim().replace(/^@/, '') || L.defaultName || 'idol');
  $('who').textContent = name();
  $('liveName').oninput = () => { $('who').textContent = name(); };
  $('keepName').onclick = () => {
    const t = `Mình muốn đăng ký làm Idol TikTok LIVE, tên LIVE: ${name()}`;
    (navigator.clipboard?.writeText(t) || Promise.reject()).then(() => toast('Đã chép tin nhắn — dán vào Zalo để giữ tên nhé!'), () => toast(t));
    if (ZALO.startsWith('http')) window.open(ZALO, '_blank');
  };
  let v = Number(L.viewers) || 0; const eye = () => { $('eye').textContent = v.toLocaleString('vi-VN'); }; eye();
  const cms = L.comments || [], users = ['minh.thu', 'tuan_bmt', 'ha.vy99', 'khoa.dz', 'ngoc_anh', 'bao.long'];
  let i = 0;
  const push = () => { if (!cms.length) return; const box = $('cms'); box.insertAdjacentHTML('beforeend', `<div class="cm"><b>${users[i % users.length]}</b>${esc(cms[i % cms.length])}</div>`); i++; while (box.children.length > 3) box.firstElementChild.remove(); };
  push(); push();
  if (calm) return;
  setInterval(() => { v = Math.max(1, v + Math.round((Math.random() - .4) * 40)); eye(); }, 1500);
  setInterval(push, 2200);
  setInterval(() => { const h = document.createElement('span'); h.className = 'heart'; h.textContent = ['❤️', '💜', '🤍', '🌹'][Math.floor(Math.random() * 4)]; h.style.setProperty('--dx', `${Math.round((Math.random() - .5) * 80)}px`); $('screen').append(h); setTimeout(() => h.remove(), 2700); }, 700);
}
function railFx() {
  const tl = document.querySelector('.tl'); if (!tl) return;
  const rail = tl.querySelector('.rail i'), items = [...tl.querySelectorAll('.ts')];
  const f = () => { const r = tl.getBoundingClientRect(), mid = innerHeight * .6; rail.style.setProperty('--p', `${Math.min(1, Math.max(0, (mid - r.top) / r.height)) * 100}%`); items.forEach((it) => it.classList.toggle('on', it.getBoundingClientRect().top + 30 < mid)); };
  addEventListener('scroll', f, { passive: true }); f();
}
function toast(t) { const e = $('toast'); e.textContent = t; e.classList.add('on'); clearTimeout(e._t); e._t = setTimeout(() => e.classList.remove('on'), 3500); }
function reveal() {
  const els = document.querySelectorAll('.rv:not(.in)');
  if (!('IntersectionObserver' in window)) return els.forEach((e) => e.classList.add('in'));
  const io = new IntersectionObserver((list) => list.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .1 });
  els.forEach((e, i) => { e.style.transitionDelay = `${(i % 3) * 80}ms`; io.observe(e); });
}
function zoom(src) { $('lb').querySelector('img').src = src; $('lb').classList.add('on'); }

// ---------- Hộp mua game ----------
function openBuy(id, may) {
  cur = DATA.games.find((g) => g.id === id); if (!cur) return;
  plan = cur.plans[0];
  $('buyTitle').textContent = `Mua / gia hạn — ${cur.name}`;
  if (may) $('machine').value = may;
  $('plans').innerHTML = cur.plans.map((p, i) => `<div class="plan ${i ? '' : 'on'}" onclick="pick(${i})"><span>${esc(p.label)}</span><b>${money(p.price)}</b></div>`).join('');
  $('buy').classList.add('on'); drawQr();
}
function closeBuy() { $('buy').classList.remove('on'); }
function pick(i) { plan = cur.plans[i]; [...$('plans').children].forEach((el, j) => el.classList.toggle('on', i === j)); drawQr(); }
const machine = () => $('machine').value.trim().toUpperCase();
const okMachine = () => /^[A-Z2-9]{5}-[A-Z2-9]{5}$/.test(machine());
const content = () => `${cur.id.toUpperCase()} ${machine().replace('-', '')}`;
function drawQr() {
  const s = DATA.shop;
  if (!okMachine()) $('qrBox').innerHTML = '<div class="warn">Nhập mã máy (dạng ABCDE-FGH23) để hiện mã QR.</div>';
  else if (!s.bankBin || !s.bankAccount) $('qrBox').innerHTML = `<div class="warn">Nhắn Zalo để nhận thông tin chuyển khoản. Nội dung chuyển khoản: <b>${esc(content())}</b></div>`;
  else {
    const u = `https://img.vietqr.io/image/${encodeURIComponent(s.bankBin)}-${encodeURIComponent(s.bankAccount)}-compact2.png?amount=${plan.price || ''}&addInfo=${encodeURIComponent(content())}&accountName=${encodeURIComponent(s.accountName || '')}`;
    $('qrBox').innerHTML = `<div class="qr"><img src="${u}" alt="Mã QR chuyển khoản"><div>${esc(s.bankName)} · ${esc(s.bankAccount)} · ${esc(s.accountName)}</div><div>Số tiền: <b>${money(plan.price)}</b></div><div class="ct">Nội dung: ${esc(content())}</div></div>`;
  }
  $('msgPrev').textContent = msg();
}
const msg = () => `Mình đã chuyển khoản mua ${cur?.name} gói ${plan?.label}. Mã máy: ${machine() || '(chưa nhập)'}`;
function copyMsg() { navigator.clipboard.writeText(msg()).then(() => { $('msgPrev').textContent = '✅ Đã chép: ' + msg(); }); }
boot();
