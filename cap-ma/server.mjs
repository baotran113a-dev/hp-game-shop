// Công cụ cấp mã kích hoạt cho Bảo. Chạy trên máy tính; mở được từ máy tính (localhost:8690)
// và từ điện thoại cùng Wi-Fi (http://<IP máy tính>:8690), đều phải nhập PIN.
// Ký bằng khóa riêng khoa-rieng/private.pem — KHÔNG đưa khóa này lên mạng, nhớ sao lưu (mất là phải làm lại app).
// Chỉ nghe trong mạng nội bộ, không mở ra Internet. PIN lưu ở du-lieu/pin.txt (đổi PIN: sửa file này rồi chạy lại).
import express from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { fileURLToPath } from 'url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const PRIV = crypto.createPrivateKey(fs.readFileSync(path.join(ROOT, 'khoa-rieng', 'private.pem')));
const DB = path.join(ROOT, 'du-lieu', 'khach-hang.json'); // danh sách mã đã cấp (không đưa lên mạng)
const GAMES = JSON.parse(fs.readFileSync(path.join(ROOT, 'docs', 'games.json'), 'utf8'));
const PORT = 8690;

// PIN đăng nhập (6 số). Chưa có thì tự tạo ngẫu nhiên, lưu trong du-lieu/ (không đưa lên mạng).
const PIN_FILE = path.join(ROOT, 'du-lieu', 'pin.txt');
let PIN;
try { PIN = fs.readFileSync(PIN_FILE, 'utf8').trim(); } catch {}
if (!/^\d{6}$/.test(PIN || '')) {
  PIN = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
  fs.mkdirSync(path.dirname(PIN_FILE), { recursive: true });
  fs.writeFileSync(PIN_FILE, PIN);
}
const pinOk = (given) => {
  const a = Buffer.from(String(given || '')), b = Buffer.from(PIN);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
};

let list = [];
try { list = JSON.parse(fs.readFileSync(DB, 'utf8')); } catch {}
const save = () => { fs.mkdirSync(path.dirname(DB), { recursive: true }); fs.writeFileSync(DB, JSON.stringify(list, null, 1)); };

const toYmd = (d) => d.getUTCFullYear() * 10000 + (d.getUTCMonth() + 1) * 100 + d.getUTCDate();
const fromYmd = (e) => new Date(Date.UTC(Math.floor(e / 10000), Math.floor(e / 100) % 100 - 1, e % 100));
const todayVN = () => toYmd(new Date(Date.now() + 7 * 3600e3));

export function signKey(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `HP1.${body}.${crypto.sign(null, Buffer.from(body), PRIV).toString('base64url')}`;
}

const app = express();
app.use(express.json());
// Mọi /api đều cần PIN (gửi qua header x-pin). Sai thì chờ 1 giây để chặn dò PIN.
app.use('/api', async (req, res, next) => {
  if (pinOk(req.get('x-pin'))) return next();
  await new Promise((r) => setTimeout(r, 1000));
  res.status(401).json({ error: 'Sai PIN' });
});
app.get('/api/check', (_q, res) => res.json({ ok: true }));
app.get('/api/data', (_q, res) => res.json({ games: GAMES.games, list, today: todayVN() }));
app.post('/api/cap-ma', (req, res) => {
  const { game, machine, days, customer, note } = req.body || {};
  const m = String(machine || '').trim().toUpperCase();
  if (!/^[A-Z2-9]{5}-[A-Z2-9]{5}$/.test(m)) return res.status(400).json({ error: 'Mã máy phải có dạng XXXXX-XXXXX' });
  if (!GAMES.games.some((g) => g.id === game)) return res.status(400).json({ error: 'Chưa chọn game' });
  const n = Math.round(Number(days));
  if (!(n >= 1 && n <= 3660)) return res.status(400).json({ error: 'Số ngày không hợp lệ' });
  // Gia hạn: còn hạn thì cộng tiếp từ ngày hết hạn cũ, hết rồi thì tính từ hôm nay
  const old = list.filter((x) => x.game === game && x.machine === m).sort((a, b) => b.expires - a.expires)[0];
  const today = todayVN();
  const start = old && old.expires >= today ? fromYmd(old.expires) : fromYmd(today);
  if (!(old && old.expires >= today)) start.setUTCDate(start.getUTCDate() - 1); // tính cả hôm nay
  start.setUTCDate(start.getUTCDate() + n);
  const expires = toYmd(start);
  const key = signKey({ g: game, m, e: expires });
  const rec = { at: new Date().toISOString(), game, machine: m, days: n, expires, customer: String(customer || '').slice(0, 60), note: String(note || '').slice(0, 120), key };
  list.push(rec); save();
  res.json({ ok: true, ...rec });
});
app.get('/', (_q, res) => res.sendFile(path.join(ROOT, 'cap-ma', 'index.html')));

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cap ma kich hoat: http://localhost:${PORT}`);
    for (const ifaces of Object.values(os.networkInterfaces()))
      for (const i of ifaces || []) if (i.family === 'IPv4' && !i.internal) console.log(`Dien thoai (cung Wi-Fi): http://${i.address}:${PORT}`);
    console.log(`PIN: ${PIN}`);
  });
}
