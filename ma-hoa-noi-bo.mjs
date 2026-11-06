// Mã hóa trang Nội bộ: noi-bo/*.md (chữ thường, KHÔNG lên mạng) → docs/noi-bo/<id>.enc.json (chỉ bản mã).
// AES-256-GCM, khóa = PBKDF2-SHA256(mật khẩu, salt ngẫu nhiên, 600.000 vòng). Trình duyệt giải mã bằng WebCrypto.
// Chạy:  node ma-hoa-noi-bo.mjs            (mã hóa tất cả, hỏi mật khẩu từng mục — gõ không hiện chữ)
//        node ma-hoa-noi-bo.mjs npc-cong-ty (chỉ 1 mục)
// Mật khẩu KHÔNG ghi vào file nào. Có thể đưa qua biến môi trường NOIBO_PASS_<ID> (vd NOIBO_PASS_NPC_CONG_TY).
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { randomBytes, pbkdf2Sync, createCipheriv, createDecipheriv } from 'node:crypto';

export const ITEMS = [
  { id: 'idol-tai-nha', src: 'noi-bo/thuong-idol-tai-nha.md' },
  { id: 'npc-cong-ty', src: 'noi-bo/chinh-sach-npc-tai-cong-ty.md' },
];
const ITER = 600000;
const root = new URL('.', import.meta.url);

function ask(q) { // hỏi mật khẩu, không hiện chữ
  return new Promise((ok) => {
    const { stdin, stdout } = process; let s = '';
    stdout.write(q); stdin.setRawMode?.(true); stdin.resume(); stdin.setEncoding('utf8');
    const on = (ch) => {
      for (const c of ch) {
        if (c === '\r' || c === '\n') { stdin.setRawMode?.(false); stdin.pause(); stdin.off('data', on); stdout.write('\n'); return ok(s); }
        if (c === '\u0003') process.exit(1);
        if (c === '\b' || c === '\u007f') s = s.slice(0, -1); else s += c;
      }
    };
    stdin.on('data', on);
  });
}

function encrypt(text, pass) {
  const salt = randomBytes(16), iv = randomBytes(12);
  const key = pbkdf2Sync(pass.normalize('NFC'), salt, ITER, 32, 'sha256');
  const c = createCipheriv('aes-256-gcm', key, iv);
  const ct = Buffer.concat([c.update(text, 'utf8'), c.final(), c.getAuthTag()]); // WebCrypto: tag nằm cuối
  const b = (x) => x.toString('base64');
  return { v: 1, kdf: 'PBKDF2-SHA256', iter: ITER, salt: b(salt), iv: b(iv), ct: b(ct) };
}
function decrypt(o, pass) { // dùng để tự kiểm tra
  const key = pbkdf2Sync(pass.normalize('NFC'), Buffer.from(o.salt, 'base64'), o.iter, 32, 'sha256');
  const all = Buffer.from(o.ct, 'base64'), d = createDecipheriv('aes-256-gcm', key, Buffer.from(o.iv, 'base64'));
  d.setAuthTag(all.subarray(-16));
  return Buffer.concat([d.update(all.subarray(0, -16)), d.final()]).toString('utf8');
}

const only = process.argv[2];
const list = only ? ITEMS.filter((i) => i.id === only) : ITEMS;
if (!list.length) { console.log('Không có mục', only, '— các mục:', ITEMS.map((i) => i.id).join(', ')); process.exit(1); }
mkdirSync(new URL('docs/noi-bo/', root), { recursive: true });
for (const it of list) {
  const md = readFileSync(new URL(it.src, root), 'utf8').replace(/<!--[\s\S]*?-->\s*/g, '').trim(); // bỏ ghi chú riêng
  const env = 'NOIBO_PASS_' + it.id.toUpperCase().replace(/-/g, '_');
  let pass = process.env[env];
  if (!pass) {
    pass = await ask(`Mật khẩu cho "${it.id}": `);
    if ((await ask('Gõ lại mật khẩu: ')) !== pass) { console.log('❌ Hai lần không khớp, bỏ qua', it.id); continue; }
  }
  if (pass.length < 8) { console.log('❌ Mật khẩu quá ngắn (cần ≥ 8 ký tự), bỏ qua', it.id); continue; }
  const plain = JSON.stringify({ md, at: new Date().toISOString().slice(0, 10) });
  const out = encrypt(plain, pass);
  if (decrypt(out, pass) !== plain) throw new Error('Tự kiểm tra giải mã thất bại');
  writeFileSync(new URL(`docs/noi-bo/${it.id}.enc.json`, root), JSON.stringify(out));
  console.log(`✅ ${it.id} → docs/noi-bo/${it.id}.enc.json (${md.length} ký tự)`);
}
