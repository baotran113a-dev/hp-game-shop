const $ = (id) => document.getElementById(id);
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const rich = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<em class="g">$1</em>').replace(/\n/g, '<br>');
const money = (n) => n ? `${n.toLocaleString('vi-VN')}đ` : 'Liên hệ';
const get = (o, path) => path.split('.').reduce((a, k) => a?.[k], o);
const params = new URLSearchParams(location.search);
const PAGE = document.body.dataset.page;
const calm = false;
let BOTTOM = '', SITE = {}, DATA = { shop: {}, games: [] }, DRAFT = null, ZALO = '#lien-he', cur = null, plan = null;
const img = (src) => DRAFT?.images?.[src] || src;
const clean = (href) => String(href || '').replace(/^(\.\/)?index\.html/, './').replace(/\.html(?=$|[?#])/, '');
const link = (href) => { const h = clean(href); return DRAFT && h && !/^(#|[a-z]+:)/i.test(h) ? h.replace(/^([^#?]*)/, '$1?preview=1') : h; };
const pageKey = (href) => clean(href).replace(/[?#].*$/, '').replace(/^\.?\//, '') || 'index';
if (/\.html$/.test(location.pathname)) history.replaceState(null, '', location.pathname.replace(/(index)?\.html$/, '') + location.search + location.hash);
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
  reveal(); if (typeof fx === "function") fx(); noCopy();
}

function shell() {
  const S = SITE, s = DATA.shop || {}, P = S[PAGE] || {};
  document.title = P.seoTitle || S.brand || document.title;
  const md = document.querySelector('meta[name=description]'); if (md) md.content = P.seoDescription || S.seoDescription || '';
  ZALO = s.zalo ? `https://zalo.me/${s.zalo.replace(/\D/g, '')}` : '#lien-he';
  const here = pageKey(location.pathname.split('/').pop());
  document.body.insertAdjacentHTML('afterbegin', `<div class="bgfx"></div><div class="glow a"></div><div class="glow b"></div>
  <header><div class="wrap">
    <a class="logo" href="${link('./')}"><img src="${esc(img(S.logo || 'img/logo.webp'))}" alt="${esc(S.brand)}"></a>
    <nav id="nav">${(S.nav || []).map((n) => `<a href="${esc(link(n.href))}" class="${pageKey(n.href) === here ? 'on' : ''}">${esc(n.label)}</a>`).join('')}</nav>
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
  ${s.zalo ? '<a class="zalo-float zalo" href="#" aria-label="Nhắn Zalo">💬 Zalo</a>' : ''}
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

const PAGES = {
  home(H) {
    const list = SITE.idol?.list || [];
    const half = Math.ceil(Math.min(list.length, 40) / 2), r1 = list.slice(0, half), r2 = list.slice(half, half * 2);
    main(`
    <div class="hero"><div class="wrap">
      <div class="rv">
        <span class="eyebrow">${esc(H.hero?.tag)}</span><h1>${rich(H.hero?.title)}</h1><p class="lead">${esc(H.hero?.text)}</p>
        <div class="cta"><a class="btn pri zalo" href="#">${esc(H.hero?.btn1)}</a><a class="btn ghost" href="${link('quyen-loi')}">${esc(H.hero?.btn2)}</a></div>
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
      <div class="cta c rv"><a class="btn ghost" href="${link('idol')}#creator">${esc(H.creatorsBtn)} (${list.length})</a></div></section>` : ''}
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
    const list = (DATA.games || []).filter((g) => !g.unlisted);
    const live = list.filter((g) => (g.kind || 'live') !== 'app'), apps = list.filter((g) => g.kind === 'app');
    main(`<div class="phero gtop"><div class="wrap rv"><span class="eyebrow">${esc(P.tag)}</span><h1>${rich(String(P.title || '').replace(/\s*\n\s*/g, ' '))}</h1><p class="lead">${esc(P.text)}</p></div></div>
    <section class="gsec"><div class="wrap">
      <div class="gtabs" role="tablist"><button data-tab="live" onclick="gTab('live')">🎮 Game LIVE <span>${live.length}</span></button><button data-tab="app" onclick="gTab('app')">🛠 Phần mềm <span>${apps.length}</span></button></div>
      <div class="g2s" id="gList-live">${live.map(gCard).join('')}</div>
      <div class="g2s" id="gList-app" hidden>${apps.map(gCard).join('')}</div>
      <p class="gsoon">🎮 Game mới đang làm… <a class="zalo" href="#">Nhắn Zalo</a> để được báo khi ra mắt.</p>
      <h3 class="rv" style="font-size:22px;margin:34px 0 16px">${esc(P.buyTitle)}</h3>${steps(P.buySteps)}</div></section>
    <section style="padding-top:10px"><div class="wrap"><div class="author glass rv">
      <div class="avatar">${a.image ? `<img src="${esc(img(a.image))}" alt="${esc(a.name)}">` : esc((a.name || '?').trim().split(/\s+/).pop()[0])}</div>
      <div><small>${esc(a.label)}</small><h3>${esc(a.name)}</h3><p>${esc(a.text)}</p></div><a class="btn ghost zalo" href="#">💬 Zalo</a></div></div></section>
    <div class="modal" id="gd" onclick="if(event.target===this)this.classList.remove('on')"><div class="box gdbox"><button class="x" onclick="$('gd').classList.remove('on')" aria-label="Đóng">×</button><div id="gdBody"></div></div></div>
    <div class="modal" id="vd" onclick="if(event.target===this)closeVid()"><div class="box vdbox"><button class="x" onclick="closeVid()" aria-label="Đóng">×</button><h3 id="vdTitle"></h3><div class="vdframe" id="vdFrame"></div><p style="margin:10px 0 0"><a id="vdLink" target="_blank" rel="noopener">Mở trên YouTube ↗</a></p></div></div>
    <div class="modal" id="buy" onclick="if(event.target===this)closeBuy()"><div class="box">
      <button class="x" onclick="closeBuy()" aria-label="Đóng">×</button><h3 id="buyTitle">Mua / gia hạn</h3>
      <p style="color:var(--mut);margin:0">Mua qua Zalo: shop gửi <b>file cài</b> và <b>mã kích hoạt</b> cho bạn.</p>
      <label>1. Chọn gói</label><div class="plans" id="plans"></div>
      <label>2. Quét mã QR để chuyển khoản (tự điền đúng số tiền + nội dung)</label>
      <div style="text-align:center;margin:0 0 10px"><img id="qrImg" alt="QR chuyển khoản" style="width:300px;max-width:92%;height:auto;border-radius:14px;background:#fff;padding:8px"><p style="font-size:14px;margin:8px 0 0;line-height:1.5"><b>VietinBank · 107888764184</b><br>TRẦN HỮU GIA BẢO<br><span style="color:var(--mut)">Nội dung:</span> <b id="qrNote">BHStudio</b></p></div>
      <div style="text-align:center;margin:10px 0 2px"><button class="btn pri sm" onclick="checkPaid()">✅ Tôi đã chuyển khoản</button></div>
      <div id="payWait" hidden style="font-size:13px;color:var(--mut);margin:6px 0 0;text-align:center"></div>
      <div id="paidBox" hidden style="margin:6px 0 0;padding:12px 14px;border-radius:12px;background:rgba(40,200,120,.12);border:1px solid rgba(40,200,120,.5)"><b style="color:#39d98a">✅ Đã nhận thanh toán!</b><p style="margin:6px 0 10px;font-size:14px">Mã đơn <b id="paidOrd"></b>. Nhắn Zalo shop để nhận <b>file cài</b> + <b>mã kích hoạt</b> nhé.</p><a class="btn pri sm zalo" href="#">💬 Nhắn Zalo ${esc(String(DATA.shop.zalo || '').replace(/\D/g, '').replace(/(\d{4})(\d{3})(\d+)/, '$1 $2 $3'))}</a></div></div></div>`);
    const fromApp = DATA.games.find((g) => g.id === params.get('game'));
    gTab(fromApp ? (fromApp.kind === 'app' ? 'app' : 'live') : location.hash === '#phan-mem' ? 'app' : 'live');
    addEventListener('hashchange', () => gTab(location.hash === '#phan-mem' ? 'app' : 'live'));
    document.querySelectorAll('#nav a').forEach((el) => { const h = el.getAttribute('href') || ''; if (/^game(#|$)/.test(h)) el.addEventListener('click', (e) => { e.preventDefault(); gTab(h === 'game#phan-mem' ? 'app' : 'live'); $('nav').classList.remove('open'); scrollTo({ top: 0, behavior: 'smooth' }); }); });
    if (params.get('game')) openBuy(params.get('game'), params.get('may'));
  },
  faq(P) {
    main(`${pageHero(P)}<section style="padding-top:24px"><div class="wrap" style="max-width:860px">${(P.items || []).map((f) => `<details class="glass rv"><summary>${esc(f.q)}</summary><p>${esc(f.a)}</p></details>`).join('')}</div></section>`);
  },
  noibo(P) {
    main(`${pageHero(P)}<section style="padding-top:24px"><div class="wrap">${(P.items || []).map((it, i) => `
      <div class="nb glass rv" id="nb-${esc(it.id)}"><div class="nbh"><div class="ic">${esc(it.icon || '🔒')}</div><div><small>MỤC ${two(i)} · MẬT KHẨU RIÊNG</small><h3>${esc(it.title)}</h3><p>${esc(it.text)}</p></div></div>
        <form class="nbf" onsubmit="event.preventDefault();nbOpen('${esc(it.id)}')"><label class="nbi"><b>🔑</b><input type="password" autocomplete="off" placeholder="${esc(P.placeholder || 'Nhập mật khẩu')}"></label><button class="btn pri sm">${esc(P.btn || 'Mở khóa')}</button></form>
        <p class="nbm"></p><div class="nbd"></div></div>`).join('')}
      <p class="nbnote rv">${esc(P.note)}</p></div></section>`);
    (P.items || []).forEach((it) => nbOpen(it.id, true));
  },
};

const b64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
const ub64 = (u) => btoa(String.fromCharCode(...new Uint8Array(u)));
async function nbOpen(id, auto) {
  const box = $('nb-' + id), inp = box.querySelector('input'), msg = box.querySelector('.nbm'), btn = box.querySelector('.nbf button');
  let o; try { o = await (await fetch(`ma-hoa/${id}.enc.json`, { cache: 'no-cache' })).json(); } catch { msg.textContent = auto ? '' : '⚠️ Mục này chưa có nội dung.'; return; }
  const saved = (() => { try { return JSON.parse(sessionStorage.getItem('nb-' + id) || 'null'); } catch { return null; } })();
  if (auto && !(saved && saved.salt === o.salt)) return;
  if (!auto && !inp.value) { msg.textContent = 'Nhập mật khẩu trước nhé.'; return; }
  msg.textContent = auto ? '' : '⏳ Đang mở khóa…'; btn.disabled = true;
  try {
    const key = auto ? await crypto.subtle.importKey('raw', b64(saved.key), 'AES-GCM', true, ['decrypt'])
      : await crypto.subtle.deriveKey({ name: 'PBKDF2', salt: b64(o.salt), iterations: o.iter, hash: 'SHA-256' },
        await crypto.subtle.importKey('raw', new TextEncoder().encode(inp.value.normalize('NFC')), 'PBKDF2', false, ['deriveKey']),
        { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
    const d = JSON.parse(new TextDecoder().decode(await crypto.subtle.decrypt({ name: 'AES-GCM', iv: b64(o.iv) }, key, b64(o.ct))));
    try { sessionStorage.setItem('nb-' + id, JSON.stringify({ salt: o.salt, key: ub64(await crypto.subtle.exportKey('raw', key)) })); } catch {}
    inp.value = ''; msg.textContent = ''; box.classList.add('open');
    box.querySelector('.nbd').innerHTML = `<div class="nbbar"><span>🔓 Đã mở · cập nhật ${esc(d.at || '')}</span><button class="btn ghost sm" onclick="nbLock('${esc(id)}')">🔒 Khóa lại</button></div>${md2html(d.md)}`;
  } catch { if (!auto) msg.textContent = '❌ Sai mật khẩu.'; else sessionStorage.removeItem('nb-' + id); }
  btn.disabled = false;
}
function nbLock(id) { try { sessionStorage.removeItem('nb-' + id); } catch {} const b = $('nb-' + id); b.classList.remove('open'); b.querySelector('.nbd').innerHTML = ''; }
function md2html(md) {
  const inl = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const L = md.split(/\r?\n/), out = [];
  for (let i = 0; i < L.length;) {
    const l = L[i].trim();
    const take = (re) => { const a = []; while (i < L.length && re.test(L[i].trim())) a.push(L[i++].trim()); return a; };
    if (!l) { i++; continue; }
    const h = l.match(/^(#{1,3})\s+(.*)/);
    if (h) { out.push(`<h${h[1].length + 2}>${inl(h[2])}</h${h[1].length + 2}>`); i++; continue; }
    if (l.startsWith('|')) {
      const rows = take(/^\|/).filter((r) => !/^\|[\s|:-]+\|$/.test(r)).map((r) => r.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      const [hd, ...bd] = rows;
      out.push(`<div class="tbl"><table><thead><tr>${hd.map((c) => `<th>${inl(c)}</th>`).join('')}</tr></thead><tbody>${bd.map((r) => `<tr>${r.map((c) => `<td>${inl(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
      continue;
    }
    if (l.startsWith(':::')) { out.push(`<div class="nbstat">${take(/^:::/).map((r) => { const [a, b, c] = r.slice(3).split('|').map((x) => x.trim()); return `<div><small>${inl(a)}</small><b>${inl(b)}</b><p>${inl(c || '')}</p></div>`; }).join('')}</div>`); continue; }
    if (l.startsWith('- ')) { out.push(`<ul>${take(/^- /).map((r) => `<li>${inl(r.slice(2))}</li>`).join('')}</ul>`); continue; }
    if (l.startsWith('>')) { out.push(take(/^>/).map((r) => { const w = /^>\s*!/.test(r); return `<p class="call${w ? ' warn' : ''}">${inl(r.replace(/^>\s*!?\s*/, ''))}</p>`; }).join('')); continue; }
    out.push(`<p>${inl(l)}</p>`); i++;
  }
  return out.join('');
}

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

const shortMoney = (n) => n ? (n % 1000 ? money(n) : `${(n / 1000).toLocaleString('vi-VN')}k`) : 'Liên hệ';
function gCard(g) {
  const pics = (g.images || [g.image]).filter(Boolean), id = esc(g.id);
  return `<div class="g2 glass rv"><div class="g2img" onclick="gDetail('${id}')"><img src="${esc(img(pics[0] || 'img/logo.webp'))}" alt="${esc(g.name)}" loading="lazy">${pics.length > 1 ? `<span class="g2n">📷 ${pics.length}</span>` : ''}</div>
    <div class="g2b"><h3>${esc(g.name)}${g.version ? ` <small>v${esc(g.version)}</small>` : ''}</h3><p class="g2tl">${esc(g.tagline)}</p>
      <div class="g2p">${(g.plans || []).map((p) => `<span>${esc(p.label)} <b>${shortMoney(p.price)}</b></span>`).join('')}</div>
      <div class="g2a"><button class="btn pri sm" onclick="openBuy('${id}')">💬 Liên hệ Zalo mua</button><button class="btn ghost sm" onclick="dlInfo('${id}')">⬇ Tải về</button></div>
      <div class="g2l"><button onclick="gDetail('${id}')">📋 Chi tiết</button>${(g.videos || []).map((v, i) => `<button onclick="openVid('${id}',${i})">▶ ${esc(v.label || 'Video')}</button>`).join('')}</div></div></div>`;
}
function gTab(t) {
  document.querySelectorAll('.gtabs button').forEach((b) => b.classList.toggle('on', b.dataset.tab === t));
  ['live', 'app'].forEach((k) => { const el = $('gList-' + k); if (el) el.hidden = k !== t; });
  document.querySelectorAll('.gsoon').forEach((el) => { el.hidden = t !== 'live'; });
  document.querySelectorAll('#nav a').forEach((a) => { const h = a.getAttribute('href') || ''; if (/^game(#|$)/.test(h)) a.classList.toggle('on', (h === 'game#phan-mem') === (t === 'app')); });
  const want = t === 'app' ? '#phan-mem' : ''; if (location.hash !== want && (want || location.hash === '#phan-mem')) history.replaceState(null, '', location.pathname + location.search + want);
}
function gDetail(id) {
  const g = DATA.games.find((x) => x.id === id); if (!g) return;
  $('gdBody').innerHTML = `<h3>${esc(g.name)}${g.version ? ` <small>v${esc(g.version)}</small>` : ''}</h3><p class="g2tl" style="-webkit-line-clamp:unset">${esc(g.tagline)}</p>
    <div class="shots">${(g.images || [g.image]).filter(Boolean).map((src) => `<img src="${esc(img(src))}" alt="${esc(g.name)}" loading="lazy" onclick="zoom(this.src)">`).join('')}</div>
    <ul class="gdf">${(g.features || []).map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
    <div class="g2p">${(g.plans || []).map((p) => `<span>${esc(p.label)} <b>${money(p.price)}</b></span>`).join('')}</div>
    <div class="g2a" style="margin-top:12px"><button class="btn pri sm" onclick="$('gd').classList.remove('on');openBuy('${esc(g.id)}')">💬 Liên hệ Zalo mua${isPerm(g) ? "" : " / gia hạn"}</button><button class="btn ghost sm" onclick="$('gd').classList.remove('on');dlInfo('${esc(g.id)}')">⬇ Tải về</button>${(g.videos || []).map((v, i) => `<button class="btn ghost sm" onclick="openVid('${esc(g.id)}',${i})">▶ ${esc(v.label || 'Video')}</button>`).join('')}</div>`;
  $('gd').classList.add('on');
}
function ytEmbed(url) {
  try {
    const u = new URL(url), id = u.hostname.includes('youtu.be') ? u.pathname.slice(1) : u.searchParams.get('v') || (u.pathname.match(/\/(?:shorts|embed)\/([\w-]+)/) || [])[1];
    if (!id) return '';
    const t = parseInt(u.searchParams.get('t') || u.searchParams.get('start') || '0', 10) || 0;
    return `https://www.youtube-nocookie.com/embed/${encodeURIComponent(id)}?autoplay=1&rel=0${t ? `&start=${t}` : ''}`;
  } catch { return ''; }
}
function openVid(id, i) {
  const g = DATA.games.find((x) => x.id === id), v = g?.videos?.[i]; if (!v) return;
  const src = ytEmbed(v.url); if (!src) { open(v.url, '_blank'); return; }
  $('vdTitle').textContent = `${g.name} · ${v.label || 'Video'}`;
  $('vdFrame').innerHTML = `<iframe src="${esc(src)}" title="${esc(v.label || 'Video')}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  $('vdLink').href = v.url; $('vd').classList.add('on');
}
function closeVid() { $('vd').classList.remove('on'); $('vdFrame').innerHTML = ''; }

function openBuy(id, may) {
  cur = DATA.games.find((g) => g.id === id); if (!cur) return;
  plan = cur.plans[0];
  $('buyTitle').textContent = `${isPerm(cur) ? "Mua vĩnh viễn" : "Mua / gia hạn"} — ${cur.name}`;
  $('plans').innerHTML = cur.plans.map((p, i) => `<div class="plan ${i ? '' : 'on'}" onclick="pick(${i})"><span>${esc(p.label)}</span><b>${money(p.price)}</b></div>`).join('');
  $('paidBox').hidden = true; $('payWait').hidden = true; clearInterval(payTimer);
  curOrd = newOrd();
  $('buy').classList.add('on'); updQR();
}
const isPerm = (g) => (g.plans || []).length > 0 && g.plans.every((p) => p.days >= 36500);
function closeBuy() { clearInterval(payTimer); $('buy').classList.remove('on'); }
function dlInfo(id) { toast('💬 Thanh toán xong, liên hệ admin (Zalo) để nhận link tải nhé!'); openBuy(id); }
function pick(i) { plan = cur.plans[i]; [...$('plans').children].forEach((el, j) => el.classList.toggle('on', i === j)); updQR(); }
const VQR_BANK = '970415', VQR_ACC = '107888764184', VQR_NAME = 'TRẦN HỮU GIA BẢO';
const PAY_API = 'https://tuyendungidol-game.canh-bao-live.workers.dev';
const ORD_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
let curOrd = '', payTimer = 0, payTries = 0;
function newOrd() { let s = ''; for (let i = 0; i < 5; i++) s += ORD_CHARS[Math.floor(Math.random() * ORD_CHARS.length)]; return s; }
const payContent = (id) => `SEVQR ${String(id).toUpperCase().replace(/[^A-Z0-9]/g, '')} DON${curOrd}`;
const vietqr = (amount, id) => `https://img.vietqr.io/image/${VQR_BANK}-${VQR_ACC}-compact2.png?amount=${Number(amount) || 0}&addInfo=${encodeURIComponent(payContent(id))}&accountName=${encodeURIComponent(VQR_NAME)}`;
function updQR() { const el = $('qrImg'); if (el && cur && plan) el.src = vietqr(plan.price, cur.id); const n = $('qrNote'); if (n && cur) n.textContent = payContent(cur.id); }
function checkPaid() {
  if (!curOrd) return;
  clearInterval(payTimer); payTries = 0;
  const w = $('payWait'); w.hidden = false; w.textContent = '⏳ Đang kiểm tra giao dịch…';
  const tick = async () => {
    payTries++;
    try { const j = await (await fetch(`${PAY_API}/trang-thai?code=${curOrd}&t=${Date.now()}`)).json(); if (j && j.paid) { clearInterval(payTimer); w.hidden = true; $('paidOrd').textContent = `DON${curOrd}`; $('paidBox').hidden = false; return; } } catch { /* thử lại */ }
    if (payTries >= 20) { clearInterval(payTimer); w.innerHTML = `⚠️ <b>Chưa thấy tiền về</b> cho đơn DON${curOrd}. Nếu bạn đã chuyển, gửi <b>biên lai chuyển khoản</b> qua Zalo để shop kiểm tra.<br><a class="btn sm" style="margin-top:8px" href="${ZALO}" target="_blank" rel="noopener">💬 Nhắn Zalo shop</a>`; }
  };
  tick(); payTimer = setInterval(tick, 4000);
}

function noCopy() {
  const typing = (e) => e.target.closest?.('input, textarea, [contenteditable]');
  const warn = () => toast('🔒 Nội dung của BH Studio được bảo vệ.');
  ['copy', 'cut', 'contextmenu', 'dragstart', 'selectstart'].forEach((t) => document.addEventListener(t, (e) => { if (typing(e)) return; e.preventDefault(); if (t === 'copy' || t === 'cut' || t === 'contextmenu') warn(); }));
  const shield = (on) => document.body.classList.toggle('shield', on);
  addEventListener('keydown', (e) => {
    const k = e.key.toLowerCase(), mod = e.ctrlKey || e.metaKey;
    if (k === 'printscreen') { shield(true); try { navigator.clipboard.writeText(''); } catch {} warn(); setTimeout(() => shield(false), 1500); return; }
    if (e.key === 'F12' || (mod && e.shiftKey && 'ijcs'.includes(k)) || (mod && ['s', 'p', 'u'].includes(k)) || (mod && ['c', 'x', 'a'].includes(k) && !typing(e))) { e.preventDefault(); warn(); }
  }, true);
  addEventListener('keyup', (e) => { if (e.key.toLowerCase() === 'printscreen') { try { navigator.clipboard.writeText(''); } catch {} } });
  if (PAGE === 'noibo') {
    addEventListener('blur', () => shield(true)); addEventListener('focus', () => shield(false));
    document.addEventListener('visibilitychange', () => shield(document.hidden));
  }
}
boot();
