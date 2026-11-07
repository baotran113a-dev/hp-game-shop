// Tạo GitHub Release + tải file lên, dùng đăng nhập Git đã lưu (không in token).
// node phat-hanh.mjs <tag> <tiêu đề> <ghi chú> <file>   (máy không có gh; xong thì sửa docs/games.json rồi push)
import { execFileSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const [tag, title, notes, file] = process.argv.slice(2);
const REPO = 'baotran113a-dev/hp-game-shop';
const cred = execFileSync('git', ['credential', 'fill'], { input: 'protocol=https\nhost=github.com\n\n', encoding: 'utf8' });
const token = /password=(.+)/.exec(cred)?.[1]?.trim();
if (!token) throw new Error('Không lấy được đăng nhập GitHub');
const H = { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json', 'User-Agent': 'bh-studio-release' };

let rel = await fetch(`https://api.github.com/repos/${REPO}/releases/tags/${tag}`, { headers: H });
if (rel.status === 404) {
  rel = await fetch(`https://api.github.com/repos/${REPO}/releases`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/json' }, body: JSON.stringify({ tag_name: tag, name: title, body: notes, target_commitish: 'main' }) });
}
const r = await rel.json();
if (!r.upload_url) { console.log('LOI tao release', rel.status, r.message); process.exit(1); }
const name = path.basename(file);
if ((r.assets || []).some((a) => a.name === name)) { console.log('DA CO', name); process.exit(0); }
const buf = fs.readFileSync(file);
const up = await fetch(`${r.upload_url.replace(/\{.*\}$/, '')}?name=${encodeURIComponent(name)}`, { method: 'POST', headers: { ...H, 'Content-Type': 'application/octet-stream', 'Content-Length': String(buf.length) }, body: buf });
const u = await up.json();
console.log(up.status, u.browser_download_url || u.message, (buf.length / 1e6).toFixed(1) + ' MB');
